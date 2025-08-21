import { getVideos } from './api.js';

export async function playTrailer(movieId) {
    const playerOverlay = document.getElementById('player-overlay');
    const playerContainer = document.getElementById('player-container');
    if (!playerOverlay || !playerContainer) return;
    const data = await getVideos(movieId);
    const trailer = data && data.results ? data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') : null;
    if (trailer) {
        playerContainer.innerHTML = `<iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        playerContainer.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl text-white">Трейлер не найден.</div>`;
    }
    playerOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function closePlayer() {
    const playerOverlay = document.getElementById('player-overlay');
    const playerContainer = document.getElementById('player-container');
    if (!playerOverlay || !playerContainer) return;
    playerOverlay.classList.add('hidden');
    playerContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
}
