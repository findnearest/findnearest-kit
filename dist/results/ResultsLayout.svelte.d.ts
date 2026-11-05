import type { Snippet } from 'svelte';
import { type ResultsLayoutMode } from './results.js';
interface Props {
    /** Cards beside the map in equal rows (`grid`) or sticky stacking cards (`wallet`). */
    layout?: ResultsLayoutMode;
    /** Number of cards, which sizes the grid rows and the wallet stacking order. */
    count: number;
    /** Show the map column (needs the `map` snippet). */
    withMap?: boolean;
    /** The open card, if any. Bind it to drive the map's zoom from it, or set it from a marker. */
    expandedIndex?: number | null;
    /** A card was opened from its header (not when `expandedIndex` is set from outside). */
    onexpand?: (index: number) => void;
    /** The pointer entered (index) or left (null) a card header, for the map highlight. */
    onhover?: (index: number | null) => void;
    /** The ResultCards. */
    children: Snippet;
    /** The map; it fills the map column. */
    map?: Snippet;
    /** Below the cards, in the same column: a "searched within" note, pagination. */
    footer?: Snippet;
}
declare const ResultsLayout: import("svelte").Component<Props, {}, "expandedIndex">;
type ResultsLayout = ReturnType<typeof ResultsLayout>;
export default ResultsLayout;
