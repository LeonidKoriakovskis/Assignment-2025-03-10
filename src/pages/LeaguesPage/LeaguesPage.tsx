// PlayersPage.tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';

const LeaguesPage = () => {
  const { state, fetchData } = useBasketballContext();
  const [isLoading, setIsLoading] = useState(false);
  const fetchStarted = useRef(false);

  const loadData = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await fetchData("leagues", "leagues?_expand=country");
    } finally {
      setIsLoading(false);
      fetchStarted.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!Array.isArray(state.leagues)) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Leagues</h1>
      {(state.loading || isLoading) && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      <ul>
        {state.leagues.map((league) => (
          <li key={league.id}>
            <Link to={`/project/leagues/${league.id}`}>{league.name}</Link>
            {league.country && (
              <span>
                {' '}- <Link to={`/project/countries/${league.country.id}`}>{league.country.name}</Link>
                {' '}<img width={'25px'} src={league.country.flag} alt={league.country.name} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaguesPage;
