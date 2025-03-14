import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';
import { CountryFormData } from '../../types/basketball';
import axios from 'axios';
import { API_URL } from '../../api/apiUrl';
import CountryForm from '../../components/CountryForm/CountryForm';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './CountriesPage.module.css';

const CountriesPage = () => {
  const { state, fetchData } = useBasketballContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CountryFormData>({
    name: "",
    continent: "", 
    flag: ""
  });
  const fetchStarted = useRef(false);

  const loadData = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await fetchData("countries", "countries");
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setIsLoading(false);
      fetchStarted.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData({
      name: "",
      continent: "",
      flag: ""
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/countries`, formData);
      await loadData();
      setIsAdding(false);
      setFormData({
        name: "",
        continent: "",
        flag: ""
      });
    } catch (error) {
      console.error('Error adding country:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading || !Array.isArray(state.countries)) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Countries</h1>
        <button className={styles.addButton} onClick={handleAdd}>
          Add Country
        </button>
      </header>
  
      {isAdding && (
        <div className={styles.formContainer}>
          <CountryForm
            formData={formData}
            onSubmit={handleSave}
            onChange={handleInputChange}
            onCancel={handleCancel}
            state={state}
            submitLabel="Add"
            title="Add New Country"
          />
        </div>
      )}
  
      {(state.loading || isLoading) && <p className={styles.loading}>Loading...</p>}
      {state.error && <p className={styles.error}>Error: {state.error}</p>}
  
      <div className={styles.countriesGrid}>
        {state.countries.map((country) => (
          <div key={country.id} className={styles.countryCard}>
            <Link to={`/project/countries/${country.id}`} className={styles.countryLink}>
              <div className={styles.countryHeader}>
                <img 
                  src={country.flag} 
                  alt={`${country.name} flag`} 
                  className={styles.flag}
                />
                <h2 className={styles.countryName}>{country.name}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesPage;