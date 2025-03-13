// PlayersPage.tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api/apiUrl';
import TeamForm from '../../components/TeamForm/TeamForm';
import { TeamFormData } from '../../types/basketball';

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Teams</h1>
        <button onClick={handleAdd}>Add Team</button>
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

      {(state.loading || isLoading) && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      <ul>
        {state.teams.map((team) => (
          <li key={team.id}>
            <Link to={`/project/teams/${team.id}`}>{team.name}</Link>
            {team.league && (
              <span> - <Link to={`/project/leagues/${team.league.id}`}>{team.league.name}</Link> - </span>
            )}
            {team.country && (
              <span>
                <img width={'25px'} src={team.country.flag} alt={team.country.name} />
                <Link to={`/project/countries/${team.country.id}`}>{team.country.name}</Link>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsPage;

