import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBasketballContext } from '../BasketballContextProvider';
import axios from 'axios';
import { API_URL } from '../../api/apiUrl';
import PlayerForm from '../../components/PlayerForm/PlayerForm';
import PlayerDetails from '../../components/PlayerDetails/PlayerDetails';
import { PlayerFormData } from '../../types/basketball';
import styles from './PlayerPage.module.css';

const PlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, fetchData } = useBasketballContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PlayerFormData>({
    name: "",
    position: "",
    teamId: 0,
    countryId: 0
  });
  const fetchInProgress = useRef(false);

  const loadPlayer = useCallback(async () => {
    if (!id || fetchInProgress.current) return;
    
    fetchInProgress.current = true;
    setIsLoading(true);
    
    try {
      await fetchData("players", "players?_expand=team&_expand=country");
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [id, fetchData]);

  const loadTeamsAndCountries = useCallback(async () => {
    if (fetchInProgress.current) return;
    
    fetchInProgress.current = true;
    setIsLoading(true);
    
    try {
      await Promise.all([
        fetchData("teams", "teams?_expand=league"),
        fetchData("countries", "countries")
      ]);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    loadPlayer();
  }, [loadPlayer]);

  useEffect(() => {
    if (state.players && Array.isArray(state.players)) {
      const player = state.players.find(p => p.id === Number(id));
      if (player) {
        setFormData({
          name: player.name,
          position: player.position,
          teamId: player.teamId,
          countryId: player.countryId
        });
      }
    }
  }, [state.players, id]);

  const handleEdit = async () => {
    await loadTeamsAndCountries();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (state.players && Array.isArray(state.players)) {
      const player = state.players.find(p => p.id === Number(id));
      if (player) {
        setFormData({
          name: player.name,
          position: player.position,
          teamId: player.teamId,
          countryId: player.countryId
        });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/players/${id}`, formData);
      await loadPlayer();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating player:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_URL}/players/${id}`);
        navigate('/project/players');
      } catch (error) {
        console.error('Error deleting player:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamId' || name === 'countryId' ? Number(value) : value
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(state.players)) {
    return <div>Loading players...</div>;
  }

  const player = state.players.find(p => p.id === Number(id));

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div className={styles.container}>
    {isEditing ? (
      <PlayerForm
        formData={formData}
        onSubmit={handleSave}
        onChange={handleInputChange}
        onCancel={handleCancel}
        state={state}
        submitLabel="Save"
        title="Edit Player"
      />
    ) : (
      <PlayerDetails
        player={player}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )}
  </div>
  );
};

export default PlayerPage;