import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useBasketballContext } from "../BasketballContextProvider";
import { CountryFormData } from "../../types/basketball";
import axios from "axios";
import { API_URL } from "../../api/apiUrl";
import CountryForm from "../../components/CountryForm/CountryForm";
import CountryDetails from "../../components/CountryDetails/CountryDetails";

const CountryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { state, fetchData } = useBasketballContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CountryFormData>({
    name: "",
    continent: "",
    flag: ""
  });
  const fetchInProgress = useRef(false);

  const loadCountry = useCallback(async () => {
    if (!id || fetchInProgress.current) return;
    
    fetchInProgress.current = true;
    setIsLoading(true);
    
    try {
      await fetchData("countries", "countries");
      await Promise.all([
        fetchData("teams", `teams?countryId=${id}&_expand=league`),
        fetchData("leagues", `leagues?countryId=${id}`)
      ]);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [id, fetchData]);

  useEffect(() => {
    loadCountry();
  }, [loadCountry]);

  useEffect(() => {
    if (state.countries && Array.isArray(state.countries)) {
      const country = state.countries.find(p => p.id === Number(id));
      if (country) {
        setFormData({
          name: country.name,
          continent: country.continent,
          flag: country.flag
        });
      }
    }
  }, [state.countries, id]);

  const handleEdit = async () => {
    await loadCountry();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (state.countries && Array.isArray(state.countries)) {
      const country = state.countries.find(p => p.id === Number(id));
      if (country) {
        setFormData({
          name: country.name,
          continent: country.continent,
          flag: country.flag
        });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/countries/${id}`, formData);
      await loadCountry();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating country:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_URL}/countries/${id}`);
        navigate('/project/countries');
      } catch (error) {
        console.error('Error deleting country:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(state.countries)) {
    return <div>Loading countries...</div>;
  }

  const country = state.countries.find(c => c.id === Number(id));

  if (!country) {
    return <div>Country not found</div>;
  }

  return (
    <div>
      {isEditing ? (
        <CountryForm
          formData={formData}
          onSubmit={handleSave}
          onChange={handleInputChange}
          onCancel={handleCancel}
          state={state}
          submitLabel="Save"
          title="Edit country"
        />
      ) : (
        <CountryDetails
          country={country}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default CountryPage;