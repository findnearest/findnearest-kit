/** How the result cards sit beside the map: equal-height rows filling the map's height, or
 *  sticky cards that stack as the page scrolls. */
export type ResultsLayoutMode = 'grid' | 'wallet';
/** How loudly a card or alert reads: `surface` mutes a routine closure, `error` tints the card. */
export type ResultSeverity = 'surface' | 'info' | 'warning' | 'error';
/** The pill in a card's header, e.g. "Closed today". */
export interface ResultBadge {
    text: string;
    severity: ResultSeverity;
    /** Shows the warning triangle (an unplanned closure); info badges always show the info mark. */
    critical?: boolean;
}
/** One line in an expanded card's alert banner, e.g. "Mon 25 Dec: Closed - Christmas Day". */
export interface ResultAlert {
    severity: ResultSeverity;
    /** Bold lead-in, e.g. the day. */
    label: string;
    text: string;
    critical?: boolean;
}
/** Distance from the search point, as the result cards show it: "<100m", "2.4km", "37km". */
export declare function formatDistance(meters: number): string;
/** Shared between ResultsLayout and its ResultCards. */
export interface ResultsContext {
    readonly layout: ResultsLayoutMode;
    readonly count: number;
    readonly expandedIndex: number | null;
    toggle(index: number): void;
    hover(index: number | null): void;
}
export declare function setResultsContext(ctx: ResultsContext): void;
export declare function getResultsContext(): ResultsContext;
