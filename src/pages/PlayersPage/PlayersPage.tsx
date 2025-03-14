// PlayersPage.tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api/apiUrl';
import PlayerForm from '../../components/PlayerForm/PlayerForm';
import { PlayerFormData } from '../../types/basketball';
import styles from './PlayersPage.module.css';


const PlayersPage = () => {
  const { state, fetchData } = useBasketballContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<PlayerFormData>({
    name: "",
    position: "",
    teamId: 0,
    countryId: 0
  });
  const fetchStarted = useRef(false);

  const loadData = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await fetchData("players", "players?_expand=team&_expand=country");
    } finally {
      setIsLoading(false);
      fetchStarted.current = false;
    }
  }, [fetchData]);

  const loadTeamsAndCountries = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await Promise.all([
        fetchData("teams", "teams?_expand=league"),
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
    await loadTeamsAndCountries();
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData({
      name: "",
      position: "",
      teamId: 0,
      countryId: 0
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/players`, formData);
      await loadData();
      setIsAdding(false);
      setFormData({
        name: "",
        position: "",
        teamId: 0,
        countryId: 0
      });
    } catch (error) {
      console.error('Error adding player:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamId' || name === 'countryId' ? Number(value) : value
    }));
  };

  if (!Array.isArray(state.players)) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles['players-container']}>
      <div className={styles.header}>
        <h1 className={styles.title}>Players</h1>
        <button 
          className={styles['add-button']}
          onClick={handleAdd}
        >
          Add Player
        </button>
      </div>

      {isAdding && (
        <PlayerForm
          formData={formData}
          onSubmit={handleSave}
          onChange={handleInputChange}
          onCancel={handleCancel}
          state={state}
          submitLabel="Add"
          title="Add New Player"
        />
      )}

      {(state.loading || isLoading) && (
        <p className={styles.loading}>Loading...</p>
      )}
      
      {state.error && (
        <p className={styles.error}>Error: {state.error}</p>
      )}
      
      <ul className={styles['players-list']}>
        {state.players.map((player) => (
          <li key={player.id} className={styles['player-item']}>
            <Link 
              to={`/project/players/${player.id}`} 
              className={styles['player-name']}
            >
              {player.name}
            </Link>
            
            {player.team && (
              <span className={styles['team-info']}>
                {' '}- <Link 
                  to={`/project/teams/${player.team.id}`} 
                  className={styles['team-link']}
                >
                  {player.team.name}
                </Link>
              </span>
            )}
            
            {player.country && (
              <span className={styles['country-info']}>
                {' '}- <Link 
                  to={`/project/countries/${player.country.id}`} 
                  className={styles['country-link']}
                >
                  {player.country.name}
                </Link>
                {' '}
                <img 
                  className={styles['country-flag']}
                  width={'25px'} 
                  src={player.country.flag} 
                  alt={player.country.name} 
                />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersPage;

