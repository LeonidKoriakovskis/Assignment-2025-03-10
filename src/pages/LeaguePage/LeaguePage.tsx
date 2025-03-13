import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useBasketballContext } from "../BasketballContextProvider";
import { Link } from "react-router-dom";

const LeaguePage = () => {
    const { id } = useParams<{ id: string }>();
    const { state, fetchData } = useBasketballContext();
    const [isLoading, setIsLoading] = useState(false);
    const fetchInProgress = useRef(false);
  
    const loadLeague = useCallback(async () => {
      if (!id || fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      setIsLoading(true);
      
      try {
        // First fetch all leagues to ensure we have the array
        await fetchData("leagues", "leagues?_expand=country");
        // Then fetch teams for this league
        await fetchData("teams", `teams?leagueId=${id}&_expand=country`);
      } finally {
        setIsLoading(false);
        fetchInProgress.current = false;
      }
    }, [id, fetchData]);

    useEffect(() => {
        loadLeague();
    }, [loadLeague]);

    // Show loading state while fetching
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Check if leagues is an array before using find
    if (!Array.isArray(state.leagues)) {
        return <div>Loading leagues...</div>;
    }

    // Get the league from state
    const league = state.leagues.find(l => l.id === Number(id));

    // Show not found if no league is found
    if (!league) {
        return <div>League not found</div>;
    }

    // Get teams for this league
    const leagueTeams = Array.isArray(state.teams) 
        ? state.teams.filter(team => team.leagueId === Number(id))
        : [];

    return (
        <div>
          <h1>{league.name}</h1>
          
          <div>
            <h2>Country</h2>
            {league.country && (
              <div>
                <Link to={`/project/countries/${league.country.id}`}>
                  {league.country.name}
                </Link>
                <div>
                  <img 
                    width="50px" 
                    src={league.country.flag} 
                    alt={`Flag of ${league.country.name}`} 
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <h2>Teams in this League</h2>
            {leagueTeams.length > 0 ? (
              <ul>
                {leagueTeams.map(team => (
                  <li key={team.id}>
                    <Link to={`/project/teams/${team.id}`}>{team.name}</Link>
                    {team.country && (
                      <span>
                        {' '}- <Link to={`/project/countries/${team.country.id}`}>{team.country.name}</Link>
                        {' '}<img width="25px" src={team.country.flag} alt={team.country.name} />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No teams found in this league</p>
            )}
          </div>

          <div>
            <Link to="/project/leagues">Back to Leagues List</Link>
          </div>
        </div>
    );
};

export default LeaguePage;