import { getIdFromUrl, getArtworkUrl } from '../utils/formatters';

const BASE_URL = 'https://pokeapi.co/api/v2';


// Wraps fetch: without internet, fetch throws an English error,
// so we replace it with a clear Spanish message for the user
async function request(url) {
  try {
    return await fetch(url);
  } catch {
    throw new Error('No hay conexión a internet. Revisa tu conexión e intenta de nuevo.');
  }
}

// Concept: fetch with async/await to consume a REST API
export async function getPokemonList(limit = 20, offset = 0) {
  const response = await request(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  // Concept: check response.ok before calling response.json()
  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de Pokémon.');
  }

  const data = await response.json();

  return {
    hasMore: data.next !== null,
    items: data.results.map((item) => {
      const id = getIdFromUrl(item.url);
      return { id, name: item.name, image: getArtworkUrl(id) };
    }),
  };
}

// Returns the Pokémon detail, or null if it does not exist (404)
export async function getPokemonDetail(nameOrId) {
  let query = String(nameOrId).trim().toLowerCase();

  // "025" -> "25", because the API does not accept leading zeros
  if (/^\d+$/.test(query)) {
    query = String(Number(query));
  }

   const response = await request(`${BASE_URL}/pokemon/${encodeURIComponent(query)}`);

  // Concept: a 404 returns plain text, not JSON, so we handle it first
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('No se pudo cargar la información del Pokémon.');
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    height: data.height / 10, // decimeters -> meters
    weight: data.weight / 10, // hectograms -> kilograms
    types: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      image:
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.front_default ??
      null,
  };
}