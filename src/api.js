const API_KEY = 'd9dfa44607376fc8cbe78f55c15ed183';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

async function request(path, params = {}) {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('language', 'ru-RU');
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    try {
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API error:', error);
        return null;
    }
}

export function getPopular() {
    return request('/movie/popular');
}

export function getTopRated() {
    return request('/movie/top_rated');
}

export function getUpcoming() {
    return request('/movie/upcoming');
}

export function getMovie(movieId) {
    return request(`/movie/${movieId}`);
}

export function getVideos(movieId) {
    return request(`/movie/${movieId}/videos`);
}

export function searchMovies(query) {
    return request('/search/movie', { query });
}
