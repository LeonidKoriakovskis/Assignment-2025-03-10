// PlayersPage.tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useBasketballContext } from '../BasketballContextProvider';
import { Link } from 'react-router-dom';

const CountriesPage = () => {
  const { state, fetchData } = useBasketballContext();
  const [isLoading, setIsLoading] = useState(false);
  const fetchStarted = useRef(false);

  const loadData = useCallback(async () => {
    if (fetchStarted.current) return;
    
    fetchStarted.current = true;
    setIsLoading(true);
    try {
      await fetchData("countries", "countries");
    } finally {
      setIsLoading(false);
      fetchStarted.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!Array.isArray(state.countries)) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Countries</h1>
      {(state.loading || isLoading) && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      <ul>
        {state.countries.map((country) => (
          <li key={country.id}>
            <Link to={`/project/countries/${country.id}`}>{country.name}</Link>
            <span>
              {' '}<img width={'25px'} src={country.flag} alt={country.name} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountriesPage;
