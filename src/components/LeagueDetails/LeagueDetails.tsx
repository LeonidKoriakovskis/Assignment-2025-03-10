import { Link } from "react-router-dom";
import { League } from "../../types/types";
import styles from "./LeagueDetails.module.css";

interface LeagueDetailsProps {
  league: League;
  onEdit: () => void;
  onDelete: () => void;
}

const LeagueDetails = ({ league, onEdit, onDelete }: LeagueDetailsProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{league.name}</h1>
      {league.country && (
        <div className={styles.countrySection}>
          <span className={styles.label}>Country: </span>
          <Link 
            to={`/project/countries/${league.country.id}`}
            className={styles.countryLink}
          >
            {league.country.name}
          </Link>
          <img 
            className={styles.flag}
            src={league.country.flag} 
            alt={league.country.name} 
          />
        </div>
      )}
      <div className={styles.buttonGroup}>
        <button className={`${styles.button} ${styles.editButton}`} onClick={onEdit}>
          Edit
        </button>
        <button className={`${styles.button} ${styles.deleteButton}`} onClick={onDelete}>
          Delete
        </button>
      </div>
      <div className={styles.backLinkContainer}>
        <Link to="/project/players" className={styles.backLink}>
          ← Back to Leagues List
        </Link>
      </div>
    </div>
  );
};

export default LeagueDetails; 