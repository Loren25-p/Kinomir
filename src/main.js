import { getPopular, getTopRated, getUpcoming, searchMovies } from './api.js';
import { createMovieCard, updateHeroSection, toggleFavorite } from './ui.js';
import { openModal, closeModal } from './modal.js';
import { playTrailer, closePlayer } from './player.js';
import { debounce } from './utils.js';
import { getFavorites } from './state.js';

function renderCarousel(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        if (movie.poster_path) container.appendChild(createMovieCard(movie));
    });
}

async function init() {
    // Hero preload skeletons can be added here if desired
    const popular = await getPopular();
    if (popular && popular.results && popular.results.length) {
        updateHeroSection(popular.results[0]);
    }
    if (popular && popular.results) renderCarousel(popular.results, 'popular-movies');
    const [top, upcoming] = await Promise.all([getTopRated(), getUpcoming()]);
    if (top && top.results) renderCarousel(top.results, 'top-rated-movies');
    if (upcoming && upcoming.results) renderCarousel(upcoming.results, 'upcoming-movies');

    renderMyList();

    // Register service worker
    if ('serviceWorker' in navigator) {
        try { await navigator.serviceWorker.register('/service-worker.js'); } catch {}
    }
}

function renderMyList() {
    const ids = getFavorites();
    const container = document.getElementById('my-list');
    if (!container) return;
    container.innerHTML = '';
    if (!ids.length) {
        container.innerHTML = '<div class="text-gray-400">Пока здесь пусто. Добавляйте фильмы в избранное.</div>';
        return;
    }
    // Render placeholders; detailed fetch per id on demand could be added later
    ids.forEach(id => {
        const placeholder = document.createElement('div');
        placeholder.className = 'movie-card flex-shrink-0 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 cursor-pointer skeleton rounded-lg h-[240px]';
        placeholder.dataset.id = id;
        container.appendChild(placeholder);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Global delegated events
    document.body.addEventListener('click', (event) => {
        const card = event.target.closest('.movie-card');
        const watchBtn = event.target.closest('.watch-btn');
        const detailsBtn = event.target.closest('.details-btn');
        const closeModalBtn = event.target.closest('#close-modal');
        const closePlayerBtn = event.target.closest('#close-player');
        const favBtn = event.target.closest('.favorite-btn');

        if (card) openModal(card.dataset.id);
        if (detailsBtn) openModal(document.getElementById('hero-section').dataset.id);
        if (watchBtn) playTrailer(watchBtn.dataset.id || document.getElementById('hero-section').dataset.id);
        if (closeModalBtn || event.target === document.getElementById('modal')) closeModal();
        if (closePlayerBtn || event.target === document.getElementById('player-overlay')) closePlayer();
        if (favBtn) {
            const id = favBtn.dataset.id;
            toggleFavorite(id);
            renderMyList();
            favBtn.querySelector('svg').classList.toggle('text-red-500');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modal');
            const player = document.getElementById('player-overlay');
            if (!modal.classList.contains('hidden')) closeModal();
            if (!player.classList.contains('hidden')) closePlayer();
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const handleSearch = debounce(async (e) => {
            const query = e.target.value.trim();
            const container = document.getElementById('popular-movies');
            if (!query) {
                const data = await getPopular();
                if (data && data.results) renderCarousel(data.results, 'popular-movies');
                return;
            }
            const data = await searchMovies(query);
            if (data && data.results) renderCarousel(data.results, 'popular-movies');
        }, 400);
        searchInput.addEventListener('input', handleSearch);
    }

    const myListNav = document.getElementById('nav-mylist');
    if (myListNav) {
        myListNav.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('mylist-heading').scrollIntoView({ behavior: 'smooth' });
        });
    }

    init();
});

