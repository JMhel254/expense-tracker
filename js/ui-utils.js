const ThemeManager = {
    init() {
        const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.apply(theme);
    },
    apply(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    },
    toggle() {
        const current = localStorage.getItem('theme') || 'light';
        const target = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', target);
        this.apply(target);
        
        // Dispatch custom event for other components to react if needed
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: target } }));
    }
};

// Initialize theme as soon as script loads to avoid flash
ThemeManager.init();

// Support for AOS or other animations could go here
document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations or other UI logic
});
