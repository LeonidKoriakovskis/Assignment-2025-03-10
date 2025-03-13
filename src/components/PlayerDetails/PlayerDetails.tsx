import { Link } from "react-router-dom";
import { Player } from "../../types/basketball";

interface PlayerDetailsProps {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
}

const PlayerDetails = ({ player, onEdit, onDelete }: PlayerDetailsProps) => {
  return (
    <div>
      <h1>{player.name}</h1>
      <p>Position: {player.position}</p>
      {player.team && (
        <p>
          Team: <Link to={`/project/teams/${player.team.id}`}>{player.team.name}</Link>
        </p>
      )}
      {player.country && (
        <p>
          Country: <Link to={`/project/countries/${player.country.id}`}>
            {player.country.name}
          </Link>
          {' '}<img width="25px" src={player.country.flag} alt={player.country.name} />
        </p>
      )}
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
      <div>
        <Link to="/project/players">Back to Players List</Link>
      </div>
    </div>
  );
};

export default PlayerDetails; 