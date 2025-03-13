import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useBasketballContext } from "../BasketballContextProvider";
import { LeagueFormData } from "../../types/basketball";
import axios from "axios";
import { API_URL } from "../../api/apiUrl";
import LeagueForm from "../../components/LeagueForm/LeagueForm";
import LeagueDetails from "../../components/LeagueDetails/LeagueDetails";

const LeaguePage = () => {
    const { id } = useParams<{ id: string }>();
    const { state, fetchData } = useBasketballContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
     const navigate = useNavigate();
    const [formData, setFormData] = useState<LeagueFormData>({
        name: "",
        countryId: 0
      });
    const fetchInProgress = useRef(false);
  
    const loadLeague = useCallback(async () => {
      if (!id || fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      setIsLoading(true);
      
      try {
        await fetchData("leagues", "leagues?_expand=country");
        await fetchData("teams", `teams?leagueId=${id}&_expand=country`);
      } finally {
        setIsLoading(false);
        fetchInProgress.current = false;
      }
    }, [id, fetchData]);

    const loadCountries = useCallback(async () => {
      if (fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      setIsLoading(true);
      
      try {
        await Promise.all([
          fetchData("countries", "countries")
        ]);
      } finally {
        setIsLoading(false);
        fetchInProgress.current = false;
      }
    }, [fetchData]);



    useEffect(() => {
        loadLeague();
    }, [loadLeague]);

    useEffect(() => {
      if (state.leagues && Array.isArray(state.leagues)) {
        const league = state.leagues.find(p => p.id === Number(id));
        if (league) {
          setFormData({
            name: league.name,
            countryId: league.countryId
          });
        }
      }
    }, [state.leagues, id]);

    const handleEdit = async () => {
      await loadCountries();
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
      if (state.leagues && Array.isArray(state.leagues)) {
        const league = state.leagues.find(p => p.id === Number(id));
        if (league) {
          setFormData({
            name: league.name,
            countryId: league.countryId
          });
        }
      }
    };


    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await axios.put(`${API_URL}/leagues/${id}`, formData);
        await loadLeague();
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating league:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this league?')) {
        try {
          setIsLoading(true);
          await axios.delete(`${API_URL}/leagues/${id}`);
          navigate('/project/leagues');
        } catch (error) {
          console.error('Error deleting league:', error);
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

    const league = state.leagues.find(l => l.id === Number(id));

    if (!league) {
        return <div>League not found</div>;
    }

    return (
      <div>
      {isEditing ? (
        <LeagueForm
          formData={formData}
          onSubmit={handleSave}
          onChange={handleInputChange}
          onCancel={handleCancel}
          state={state}
          submitLabel="Save"
          title="Edit League"
        />
      ) : (
        <LeagueDetails
          league = {league}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
    );
};


export default LeaguePage;