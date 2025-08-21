import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from './api.js';
import { isFavorite, addFavorite, removeFavorite } from './state.js';

export function createMovieCard(movie, { withActions = true } = {}) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card flex-shrink-0 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 cursor-pointer';
    movieCard.dataset.id = movie.id;
    const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://placehold.co/400x600/1a202c/ffffff?text=Нет+постера';
    movieCard.innerHTML = `
        <div class="relative group">
            <img src="${posterPath}" alt="${movie.title}" class="rounded-lg shadow-lg group-hover:scale-105 transform transition-transform duration-300" loading="lazy">
            ${withActions ? `
            <button class="absolute top-2 right-2 bg-gray-900/70 hover:bg-gray-900/90 text-white rounded-full p-1.5 favorite-btn" aria-label="Добавить в избранное" title="Добавить в избранное" data-id="${movie.id}">
                <svg class="w-5 h-5 ${isFavorite(movie.id) ? 'text-red-500' : 'text-white'}" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
            </button>` : ''}
        </div>`;
    return movieCard;
}

export function updateHeroSection(movie) {
    const heroSection = document.getElementById('hero-section');
    if (!movie || !heroSection) return;
    heroSection.dataset.id = movie.id;
    document.getElementById('hero-backdrop').src = `${BACKDROP_BASE_URL}${movie.backdrop_path}`;
    document.getElementById('hero-title').textContent = movie.title;
    document.getElementById('hero-overview').textContent = movie.overview;
}

export function toggleFavorite(movieId) {
    if (isFavorite(movieId)) {
        removeFavorite(movieId);
    } else {
        addFavorite(movieId);
    }
}
