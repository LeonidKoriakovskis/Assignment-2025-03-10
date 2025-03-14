// PlayersPage.tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api/apiUrl';
import TeamForm from '../../components/TeamForm/TeamForm';
import { TeamFormData } from '../../types/basketball';
import styles from './TeamsPage.module.css';

const TeamsPage = () => {
  const { state, fetchData } = useBasketballContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    leagueId: 0,
    countryId: 0
  });
  const fetchStarted = useRef(false);

  const loadData = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await fetchData("teams", "teams?_expand=league&_expand=country");
    } finally {
      setIsLoading(false);
      fetchStarted.current = false;
    }
  }, [fetchData]);

  const loadLeaguesAndCountries = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await Promise.all([
        fetchData("leagues", "leagues?_expand=country"),
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
    await loadLeaguesAndCountries();
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData({
      name: "",
      leagueId: 0,
      countryId: 0
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/teams`, formData);
      await loadData();
      setIsAdding(false);
      setFormData({
        name: "",
        leagueId: 0,
        countryId: 0
      });
    } catch (error) {
      console.error('Error adding team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'leagueId' || name === 'countryId' ? Number(value) : value
    }));
  };

  if (!Array.isArray(state.teams)) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Teams</h1>
        <button className={styles.addButton} onClick={handleAdd}>
          Add Team
        </button>
      </div>
  
      {isAdding && (
        <TeamForm
          formData={formData}
          onSubmit={handleSave}
          onChange={handleInputChange}
          onCancel={handleCancel}
          state={state}
          submitLabel="Add"
          title="Add New Team"
        />
      )}
  
      {(state.loading || isLoading) && <p className={styles.loading}>Loading...</p>}
      {state.error && <p className={styles.error}>Error: {state.error}</p>}
  
      <ul className={styles.teamsList}>
        {state.teams.map((team) => (
          <li key={team.id} className={styles.teamCard}>
            <div className={styles.teamContent}>
              <div className={styles.teamHeader}>
                {team.logo && (
                  <img
                    className={styles.teamLogo}
                    src={team.logo}
                    alt={`${team.name} logo`}
                  />
                )}
                <Link 
                  to={`/project/teams/${team.id}`} 
                  className={styles.teamName}
                >
                  {team.name}
                </Link>
              </div>
  
              <div className={styles.teamInfo}>
                {team.league && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>League:</span>
                    <Link 
                      to={`/project/leagues/${team.league.id}`}
                      className={styles.leagueLink}
                    >
                      {team.league.name}
                    </Link>
                  </div>
                )}
  
                {team.country && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Country:</span>
                    <div className={styles.countryInfo}>
                      <Link 
                        to={`/project/countries/${team.country.id}`}
                        className={styles.countryLink}
                      >
                        {team.country.name}
                      </Link>
                      <img 
                        className={styles.flag}
                        src={team.country.flag} 
                        alt={team.country.name}
                      />
                    </div>
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

export default TeamsPage;

