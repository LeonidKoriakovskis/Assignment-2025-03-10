// PlayersPage.tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';
import { LeagueFormData } from '../../types/basketball';
import { API_URL } from '../../api/apiUrl';
import axios from 'axios';
import LeagueForm from '../../components/LeagueForm/LeagueForm';
import styles from './LeaguesPage.module.css';

const LeaguesPage = () => {
  const { state, fetchData } = useBasketballContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<LeagueFormData>({
      name: "",
      countryId: 0
    });
  const fetchStarted = useRef(false);

  const loadData = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await fetchData("leagues", "leagues?_expand=country");
    } finally {
      setIsLoading(false);
      fetchStarted.current = false;
    }
  }, [fetchData]);

  const loadCountries = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await Promise.all([
        fetchData("countries", "countries")
      ]);
    } finally {
      setIsLoading(false);
      fetchStarted.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async () => {
    await loadCountries();
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData({
      name: "",
      countryId: 0
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/leagues`, formData);
      await loadData();
      setIsAdding(false);
      setFormData({
        name: "",
        countryId: 0
      });
    } catch (error) {
      console.error('Error adding league:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === 'countryId' ? Number(value) : value
  }));
  };




  if (!Array.isArray(state.leagues)) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
          <h1 className={styles.title}>Leagues</h1>
          <button className={styles.addButton} onClick={handleAdd}>Add League</button>
      </div>

      {isAdding && (
        <LeagueForm
          formData={formData}
          onSubmit={handleSave}
          onChange={handleInputChange}
          onCancel={handleCancel}
          state={state}
          submitLabel="Add"
          title="Add New Player"
        />
      )}

      {(state.loading || isLoading) && <p className={styles.loading}>Loading...</p>}
      {state.error && <p className={styles.error}>Error: {state.error}</p>}
      
      <ul className={styles.leaguesList}>
        {state.leagues.map((league) => (
          <li key={league.id} className={styles.leagueCard}>
            <div className={styles.leagueContent}>
              <div className={styles.leagueInfo}>
                <Link 
                  to={`/project/leagues/${league.id}`}
                  className={styles.leagueName}
                >
                  {league.name}
                </Link>
                
                {league.country && (
                  <div className={styles.countryInfo}>
                    <span>-</span>
                    <Link 
                      to={`/project/countries/${league.country.id}`}
                      className={styles.countryLink}
                    >
                      {league.country.name}
                    </Link>
                    <img 
                      className={styles.flag}
                      src={league.country.flag} 
                      alt={league.country.name} 
                    />
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
);

};

export default LeaguesPage;
