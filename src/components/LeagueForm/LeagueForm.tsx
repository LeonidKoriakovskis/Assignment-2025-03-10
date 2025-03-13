import { BasketballState } from "../../types/basketball";

interface LeagueFormData {
  name: string;
  countryId: number;
}

interface LeagueFormProps {
  formData: LeagueFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCancel: () => void;
  state: BasketballState;
  submitLabel: string;
  title: string;
}

const LeagueForm = ({
  formData,
  onSubmit,
  onChange,
  onCancel,
  state,
  submitLabel,
  title
}: LeagueFormProps) => {
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

export default LeagueForm; 