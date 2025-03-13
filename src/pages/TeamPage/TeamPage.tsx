import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useBasketballContext } from "../BasketballContextProvider";
import axios from "axios";
import { API_URL } from "../../api/apiUrl";
import TeamForm from "../../components/TeamForm/TeamForm";
import TeamDetails from "../../components/TeamDetails/TeamDetails";
import { TeamFormData } from "../../types/basketball";

const TeamPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, fetchData } = useBasketballContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<TeamFormData>({
      name: "",
      leagueId: 0,
      countryId: 0
    });
    const fetchInProgress = useRef(false);
  
    const loadTeam = useCallback(async () => {
      if (!id || fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      setIsLoading(true);
      
      try {
        await fetchData("teams", "teams?_expand=league&_expand=country");
      } finally {
        setIsLoading(false);
        fetchInProgress.current = false;
      }
    }, [id, fetchData]);

    const loadLeaguesAndCountries = useCallback(async () => {
      if (fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      setIsLoading(true);
      
      try {
        await Promise.all([
          fetchData("leagues", "leagues?_expand=country"),
          fetchData("countries", "countries")
        ]);
      } finally {
        setIsLoading(false);
        fetchInProgress.current = false;
      }
    }, [fetchData]);

    useEffect(() => {
      loadTeam();
    }, [loadTeam]);

    useEffect(() => {
      if (state.teams && Array.isArray(state.teams)) {
        const team = state.teams.find(t => t.id === Number(id));
        if (team) {
          setFormData({
            name: team.name,
            leagueId: team.leagueId,
            countryId: team.countryId
          });
        }
      }
    }, [state.teams, id]);

    const handleEdit = async () => {
      await loadLeaguesAndCountries();
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
      if (state.teams && Array.isArray(state.teams)) {
        const team = state.teams.find(t => t.id === Number(id));
        if (team) {
          setFormData({
            name: team.name,
            leagueId: team.leagueId,
            countryId: team.countryId
          });
        }
      }
    };

    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await axios.put(`${API_URL}/teams/${id}`, formData);
        await loadTeam();
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating team:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this team?')) {
        try {
          setIsLoading(true);
          await axios.delete(`${API_URL}/teams/${id}`);
          navigate('/project/teams');
        } catch (error) {
          console.error('Error deleting team:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === 'leagueId' || name === 'countryId' ? Number(value) : value
      }));
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!Array.isArray(state.teams)) {
      return <div>Loading teams...</div>;
    }

    const team = state.teams.find(t => t.id === Number(id));

    if (!team) {
      return <div>Team not found</div>;
    }

    return (
      <div>
        {isEditing ? (
          <TeamForm
            formData={formData}
            onSubmit={handleSave}
            onChange={handleInputChange}
            onCancel={handleCancel}
            state={state}
            submitLabel="Save"
            title="Edit Team"
          />
        ) : (
          <TeamDetails
            team={team}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    );
};

export default TeamPage;