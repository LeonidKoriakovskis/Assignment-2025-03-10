import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useBasketballContext } from "../BasketballContextProvider";
import { Link } from "react-router-dom";

const CountryPage = () => {
    const { id } = useParams<{ id: string }>();
    const { state, fetchData } = useBasketballContext();
    const [isLoading, setIsLoading] = useState(false);
    const fetchInProgress = useRef(false);
  
    const loadCountry = useCallback(async () => {
      if (!id || fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      setIsLoading(true);
      
      try {
        // First fetch all countries to ensure we have the array
        await fetchData("countries", "countries");
        // Then fetch teams and leagues for this country
        await Promise.all([
          fetchData("teams", `teams?countryId=${id}&_expand=league`),
          fetchData("leagues", `leagues?countryId=${id}`)
        ]);
      } finally {
        setIsLoading(false);
        fetchInProgress.current = false;
      }
    }, [id, fetchData]);

    useEffect(() => {
        loadCountry();
    }, [loadCountry]);

    // Show loading state while fetching
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Check if countries is an array before using find
    if (!Array.isArray(state.countries)) {
        return <div>Loading countries...</div>;
    }

    // Get the country from state
    const country = state.countries.find(c => c.id === Number(id));

    // Show not found if no country is found
    if (!country) {
        return <div>Country not found</div>;
    }

    // Get teams and leagues for this country
    const countryTeams = Array.isArray(state.teams) 
        ? state.teams.filter(team => team.countryId === Number(id))
        : [];

    const countryLeagues = Array.isArray(state.leagues)
        ? state.leagues.filter(league => league.countryId === Number(id))
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
            <Link to="/project/countries">Back to Countries List</Link>
          </div>
        </div>
    );
};

export default CountryPage;