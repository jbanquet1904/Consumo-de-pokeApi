import { useCallback, useEffect, useRef, useState } from 'react';
import { getPokemonList } from '../services/pokeApi';

const PAGE_SIZE = 20;

export function usePokemonList() {
  // Concept: useState for the data and each UI state
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true); // first page
  const [loadingMore, setLoadingMore] = useState(false); // next pages
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // useRef keeps values between renders without re-rendering
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false); // prevents duplicate requests

  const loadPage = useCallback(async (isFirstPage) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isFirstPage) {
      offsetRef.current = 0;
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const result = await getPokemonList(PAGE_SIZE, offsetRef.current);
      setPokemons((prev) => (isFirstPage ? result.items : [...prev, ...result.items]));
      offsetRef.current += PAGE_SIZE;
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Concept: useEffect with dependency array -> runs only once on mount
  useEffect(() => {
    loadPage(true);
  }, [loadPage]);

  // Called by FlatList's onEndReached (infinite scroll)
  const loadMore = () => {
    if (!hasMore || loading || loadingMore || error) return;
    loadPage(false);
  };

  // If the list is empty, reload from the start; otherwise retry the next page
  const retry = () => {
    loadPage(pokemons.length === 0);
  };

  return { pokemons, loading, loadingMore, error, loadMore, retry };
}