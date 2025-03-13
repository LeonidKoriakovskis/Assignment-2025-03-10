import { BasketballState } from "../../types/basketball";

interface TeamFormData {
  name: string;
  leagueId: number;
  countryId: number;
}

interface TeamFormProps {
  formData: TeamFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCancel: () => void;
  state: BasketballState;
  submitLabel: string;
  title: string;
}

const TeamForm = ({ 
  formData, 
  onSubmit, 
  onChange, 
  onCancel, 
  state,
  submitLabel,
  title 
}: TeamFormProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            League:
            <select
              name="leagueId"
              value={formData.leagueId}
              onChange={onChange}
              required
            >
              <option value="">Select a league</option>
              {Array.isArray(state.leagues) && state.leagues.map(league => (
                <option key={league.id} value={league.id}>{league.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Country:
            <select
              name="countryId"
              value={formData.countryId}
              onChange={onChange}
              required
            >
              <option value="">Select a country</option>
              {Array.isArray(state.countries) && state.countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <button type="submit">{submitLabel}</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm; 