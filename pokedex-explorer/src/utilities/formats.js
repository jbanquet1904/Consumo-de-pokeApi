const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export function getIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

export function getArtworkUrl(id) {
  return `${ARTWORK_BASE_URL}/${id}.png`;
}

export function formatNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}