const FAVORITES_KEY = 'kinomir:favorites';

export function getFavorites() {
    try {
        const value = localStorage.getItem(FAVORITES_KEY);
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
}

export function isFavorite(movieId) {
    return getFavorites().includes(Number(movieId));
}

export function addFavorite(movieId) {
    const list = getFavorites();
    const id = Number(movieId);
    if (!list.includes(id)) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...list, id]));
    }
}

export function removeFavorite(movieId) {
    const id = Number(movieId);
    const next = getFavorites().filter(m => m !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
}
