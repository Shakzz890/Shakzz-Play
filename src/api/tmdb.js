const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMG_URL = 'https://image.tmdb.org/t/p/original';
export const POSTER_URL = 'https://image.tmdb.org/t/p/w300';
export const PLACEHOLDER_IMG = 'logo.png'; // Ensure logo.png is in public folder

export const fetchData = async (endpoint, page = 1) => {
    try {
        const separator = endpoint.includes('?') ? '&' : '?';
        const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&page=${page}`;
        const res = await fetch(url);
        return await res.json();
    } catch (e) { return { results: [] }; }
};

export const getDisplayTitle = (item) => {
  if (!item) return '';
  if (item.origin_country?.includes('PH') || item.original_language === 'tl') {
    return item.original_name || item.name || item.title;
  }
  return item.title || item.name;
};
