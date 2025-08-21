import { getMovie } from './api.js';
import { formatYear, formatRating, trapFocus } from './utils.js';
import { IMAGE_BASE_URL } from './api.js';

let cleanupFocusTrap = null;

export async function openModal(movieId) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    if (!modal || !modalContent) return;
    const movie = await getMovie(movieId);
    if (!movie) return;

    const year = formatYear(movie.release_date);
    const rating = formatRating(movie.vote_average);
    const genres = (movie.genres || []).map(g => g.name).join(', ');

    modalContent.innerHTML = `
        <button id="close-modal" class="absolute top-3 right-3 text-gray-400 hover:text-white z-10" aria-label="Закрыть модальное окно">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="md:flex">
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Постер ${movie.title}" class="w-full md:w-1/3 h-auto object-cover rounded-l-lg" loading="lazy">
            <div class="p-6 md:p-8 flex flex-col">
                <h2 id="modal-title" class="text-3xl font-bold mb-2">${movie.title}</h2>
                <div class="flex items-center space-x-4 text-gray-400 mb-4">
                    <span>${year}</span>
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span class="font-bold">${rating}</span>
                    </div>
                </div>
                <p class="text-sm text-gray-500 mb-4">${genres}</p>
                <p class="text-gray-300 mb-6 flex-grow">${movie.overview}</p>
                <button class="watch-btn w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2 transition mt-auto" data-id="${movie.id}">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                    <span>Смотреть трейлер</span>
                </button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    modalContent.classList.add('modal-enter');
    document.body.style.overflow = 'hidden';
    cleanupFocusTrap = trapFocus(modal, modalContent.querySelector('#close-modal'));
}

export function closeModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    if (!modal || !modalContent) return;
    modalContent.classList.remove('modal-enter');
    modalContent.classList.add('modal-leave');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        modalContent.classList.remove('modal-leave');
        if (typeof cleanupFocusTrap === 'function') cleanupFocusTrap();
    }, 300);
}
