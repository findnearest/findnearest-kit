/**
 * The light/dark switch. Remembered in localStorage under `theme`; `data-mode` (and class `dark`)
 * on <html> is what the tokens follow.
 *
 * Creating it only reads `data-mode`, which is what's on screen: the app's first-paint script in
 * app.html has already decided it, and an app without dark mode that imports something else from
 * the kit must stay as it is.
 */
class ThemeState {
    mode = $state('light');
    constructor() {
        if (typeof document === 'undefined')
            return;
        if (document.documentElement.getAttribute('data-mode') === 'dark')
            this.mode = 'dark';
    }
    toggle() {
        this.setMode(this.mode === 'light' ? 'dark' : 'light');
    }
    setMode(mode) {
        this.mode = mode;
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.classList.toggle('dark', mode === 'dark');
        try {
            localStorage.setItem('theme', mode);
        }
        catch {
            // Storage blocked: the mode holds until the page reloads.
        }
    }
}
export const themeState = new ThemeState();
