import { BasketballState, CountryFormData } from "../../types/basketball";


interface CountryFormProps {
  formData: CountryFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCancel: () => void;
  state: BasketballState;
  submitLabel: string;
  title: string;
}

const CountryForm = ({
  formData,
  onSubmit,
  onChange,
  onCancel,
  submitLabel,
  title
}: CountryFormProps) => {
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
            Continent:
            <input
              type="text"
              name="continent"
              value={formData.continent}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Flag:
            <input
              type="text"
              name="flag"
              value={formData.flag}
              onChange={onChange}
              required
            />
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

export default CountryForm; 