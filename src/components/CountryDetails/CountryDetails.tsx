import { Link } from "react-router-dom";
import { Country } from "../../types/types";
import { useBasketballContext } from "../../pages/BasketballContextProvider";

interface CountryDetailsProps {
  country: Country;
  onEdit: () => void;
  onDelete: () => void;
}

const CountryDetails = ({ country, onEdit, onDelete }: CountryDetailsProps) => {
    const { state } = useBasketballContext();

    const countryTeams = Array.isArray(state.teams) 
        ? state.teams.filter(team => team.countryId === country.id)
        : [];

    const countryLeagues = Array.isArray(state.leagues)
        ? state.leagues.filter(league => league.countryId === country.id)
        : [];

    return (
        <div>
            <h1>{country.name}</h1>
            <div>
                <img 
                    width="100px" 
                    src={country.flag} 
                    alt={`Flag of ${country.name}`} 
                />
            </div>

            <div>
                <h2>Leagues in {country.name}</h2>
                {countryLeagues.length > 0 ? (
                    <ul>
                        {countryLeagues.map(league => (
                            <li key={league.id}>
                                <Link to={`/project/leagues/${league.id}`}>{league.name}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No leagues found in this country</p>
                )}
            </div>

            <div>
                <h2>Teams in {country.name}</h2>
                {countryTeams.length > 0 ? (
                    <ul>
                        {countryTeams.map(team => (
                            <li key={team.id}>
                                <Link to={`/project/teams/${team.id}`}>{team.name}</Link>
                                {team.league && (
                                    <span>
                                        {' '}- <Link to={`/project/leagues/${team.league.id}`}>{team.league.name}</Link>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No teams found in this country</p>
                )}
            </div>

            <div>
                <button onClick={onEdit}>Edit Country</button>
                <button onClick={onDelete}>Delete Country</button>
                <Link to="/project/countries">Back to Countries List</Link>
            </div>
        </div>
    );
};

export default CountryDetails; 
