import { Link } from "react-router-dom";
import { Team } from "../../types/basketball";

interface TeamDetailsProps {
  team: Team;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamDetails = ({ team, onEdit, onDelete }: TeamDetailsProps) => {
  return (
    <div>
      <h1>{team.name}</h1>
      {team.league && (
        <div>
          <h2>League</h2>
          <p>
            <Link to={`/project/leagues/${team.league.id}`}>
              {team.league.name}
            </Link>
          </p>
        </div>
      )}
      {team.country && (
        <div>
          <h2>Country</h2>
          <div>
            <Link to={`/project/countries/${team.country.id}`}>
              {team.country.name}
            </Link>
            <div>
              <img 
                width="50px" 
                src={team.country.flag} 
                alt={`Flag of ${team.country.name}`} 
              />
            </div>
          </div>
        </div>
      )}
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
      <div>
        <Link to="/project/teams">Back to Teams List</Link>
      </div>
    </div>
  );
};

export default TeamDetails; 