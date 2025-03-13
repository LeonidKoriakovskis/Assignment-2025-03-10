import { Link } from "react-router-dom";
import { League } from "../../types/types";

interface LeagueDetailsProps {
  league: League;
  onEdit: () => void;
  onDelete: () => void;
}

const LeagueDetails = ({ league, onEdit, onDelete }: LeagueDetailsProps) => {
  return (
    <div>
      <h1>{league.name}</h1>
      {league.country && (
        <p>
          Country: <Link to={`/project/countries/${league.country.id}`}>
            {league.country.name}
          </Link>
          {' '}<img width="25px" src={league.country.flag} alt={league.country.name} />
        </p>
      )}
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
      <div>
        <Link to="/project/players">Back to Leagues List</Link>
      </div>
    </div>
  );
};

export default LeagueDetails; 