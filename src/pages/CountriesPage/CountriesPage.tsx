import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';
import { CountryFormData } from '../../types/basketball';
import axios from 'axios';
import { API_URL } from '../../api/apiUrl';
import CountryForm from '../../components/CountryForm/CountryForm';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Countries</h1>
        <button onClick={handleAdd} disabled={isLoading}>Add Country</button>
      </div>

      {isAdding && (
        <CountryForm
          formData={formData}
          onSubmit={handleSave}
          onChange={handleInputChange}
          onCancel={handleCancel}
          state={state}
          submitLabel="Add"
          title="Add New Country"
        />
      )}
      
      {state.error && <p>Error: {state.error}</p>}
      
      <ul>
        {state.countries.map((country) => (
          <li key={country.id}>
            <Link to={`/project/countries/${country.id}`}>{country.name}</Link>
            <span>
              {country.flag && <img width="25" src={country.flag} alt={country.name} />}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountriesPage;