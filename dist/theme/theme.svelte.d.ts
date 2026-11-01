export type Theme = 'light' | 'dark';
/**
 * The light/dark switch. Remembered in localStorage under `theme`; `data-mode` (and class `dark`)
 * on <html> is what the tokens follow.
 *
 * Creating it only reads `data-mode`, which is what's on screen: the app's first-paint script in
 * app.html has already decided it, and an app without dark mode that imports something else from
 * the kit must stay as it is.
 */
declare class ThemeState {
    mode: Theme;
    constructor();
    toggle(): void;
    setMode(mode: Theme): void;
}
export declare const themeState: ThemeState;
export {};
