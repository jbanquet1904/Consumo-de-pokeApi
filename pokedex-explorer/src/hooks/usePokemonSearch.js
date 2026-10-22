import { useState } from 'react';
import { getPokemonDetail } from '../services/pokeApi';

export function usePokemonSearch(onFound) {
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [notFoundQuery, setNotFoundQuery] = useState(null);

  const search = async (query) => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    setSearching(true);
    setError(null);
    setNotFoundQuery(null);

    try {
      const data = await getPokemonDetail(cleanQuery);
      if (data === null) {
        setNotFoundQuery(query.trim()); // empty state
      } else {
        onFound(data.id); // opens the detail view
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setError(null);
    setNotFoundQuery(null);
  };

  return { search, searching, error, notFoundQuery, clearSearch };
}