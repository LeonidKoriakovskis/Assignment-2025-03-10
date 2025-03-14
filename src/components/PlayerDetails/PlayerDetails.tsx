import { Link } from "react-router-dom";
import { Player } from "../../types/basketball";
import styles from './PlayerDetails.module.css';

interface PlayerDetailsProps {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
}

const PlayerDetails = ({ player, onEdit, onDelete }: PlayerDetailsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{player.name}</h1>
        <div className={styles.actions}>
          <button 
            className={styles.editButton}
            onClick={onEdit}
          >
            Edit
          </button>
          <button 
            className={styles.deleteButton}
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className={styles.details}>
        {player.position && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Position:</span>
            <span className={styles.value}>{player.position}</span>
          </div>
        )}

        {player.team && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Team:</span>
            <Link 
              to={`/project/teams/${player.team.id}`}
              className={styles.link}
            >
              {player.team.name}
            </Link>
          </div>
        )}

        {player.country && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Country:</span>
            <div className={styles.value}>
              <Link 
                to={`/project/countries/${player.country.id}`}
                className={styles.link}
              >
                {player.country.name}
              </Link>
              <img 
                className={styles.flag}
                src={player.country.flag} 
                alt={player.country.name}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetails; 