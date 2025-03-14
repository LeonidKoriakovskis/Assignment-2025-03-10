import { Link } from 'react-router-dom';
import styles from './CountryDetails.module.css';

interface CountryDetailsProps {
  country: {
    id: number;
    name: string;
    flag: string;
    continent: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const CountryDetails = ({ country, onEdit, onDelete }: CountryDetailsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.countryHeader}>
        <img 
          src={country.flag} 
          alt={`${country.name} flag`} 
          className={styles.flag}
        />
        <h1 className={styles.title}>{country.name}</h1>
      </div>

      <div className={styles.infoSection}>
        <p className={styles.infoItem}>
          <span className={styles.label}>Continent:</span>
          <span className={styles.value}>{country.continent}</span>
        </p>
      </div>

      <div className={styles.actionButtons}>
        <button 
          className={`${styles.button} ${styles.editButton}`} 
          onClick={onEdit}
        >
          Edit
        </button>
        <button 
          className={`${styles.button} ${styles.deleteButton}`} 
          onClick={onDelete}
        >
          Delete
        </button>
      </div>

      <div className={styles.backLinkContainer}>
        <Link to="/project/countries" className={styles.backLink}>
          ← Back to Countries List
        </Link>
      </div>
    </div>
  );
};

export default CountryDetails;
