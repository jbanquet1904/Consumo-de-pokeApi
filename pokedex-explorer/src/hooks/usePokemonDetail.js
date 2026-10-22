import { useEffect, useState } from 'react';
import { getPokemonDetail } from '../services/pokeApi';

export function usePokemonDetail(pokemonId) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Concept: dependency array -> the request runs again only
  // when pokemonId or reloadKey change
  useEffect(() => {
    let isActive = true; // ignores the response if the user already left

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const data = await getPokemonDetail(pokemonId);
        if (!isActive) return;

        if (data === null) {
          setNotFound(true);
        } else {
          setPokemon(data);
        }
      } catch (err) {
        if (isActive) setError(err.message);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    load();

    // Concept: cleanup function of useEffect
    return () => {
      isActive = false;
    };
  }, [pokemonId, reloadKey]);

  const retry = () => setReloadKey((key) => key + 1);

  return { pokemon, loading, error, notFound, retry };
}