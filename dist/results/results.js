import { getContext, setContext } from 'svelte';
/** Distance from the search point, as the result cards show it: "<100m", "2.4km", "37km". */
export function formatDistance(meters) {
    if (meters < 100)
        return '<100m';
    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(1)}km` : `${Math.round(km)}km`;
}
const KEY = Symbol('fnk-results');
export function setResultsContext(ctx) {
    setContext(KEY, ctx);
}
export function getResultsContext() {
    const ctx = getContext(KEY);
    if (!ctx)
        throw new Error('ResultCard must be rendered inside a ResultsLayout');
    return ctx;
}
