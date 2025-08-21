export function debounce(fn, delay = 300) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    };
}

export function qs(selector, root = document) {
    return root.querySelector(selector);
}

export function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

export function trapFocus(container, firstFocusable) {
    const focusableSelectors = [
        'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])',
        'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed',
        '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]'
    ];
    const focusable = Array.from(container.querySelectorAll(focusableSelectors.join(',')));
    const first = firstFocusable || focusable[0];
    const last = focusable[focusable.length - 1];
    function handleKey(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
    container.addEventListener('keydown', handleKey);
    first && first.focus();
    return () => container.removeEventListener('keydown', handleKey);
}

export function formatYear(dateString) {
    return dateString ? dateString.substring(0, 4) : 'N/A';
}

export function formatRating(value) {
    return typeof value === 'number' ? value.toFixed(1) : 'N/A';
}
