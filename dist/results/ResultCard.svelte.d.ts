import type { Snippet } from 'svelte';
import { type ResultAlert, type ResultBadge, type ResultSeverity } from './results.js';
interface Props {
    /** Position in the list (0-based). */
    index: number;
    /** The number on the marker; matches the map's marker. */
    number: number;
    title: string;
    /** Already formatted, e.g. with `formatDistance`. */
    distance: string;
    /** Tints the card: `error` for an unplanned closure, `surface` mutes a routine one. */
    severity?: ResultSeverity | null;
    badge?: ResultBadge | null;
    /** Shown at the top of the open card. */
    alerts?: ResultAlert[];
    /** The profile page; omit it to leave out the "View … ›" link. */
    profileHref?: string;
    /** What a profile is called, as in "View {profileLabel} ›". */
    profileLabel?: string;
    onprofileclick?: (e: MouseEvent) => void;
    /** Set as `data-location-uid`, so the app can find the card again. */
    uid?: string;
    /** The open card's own content: address, hours, modules. */
    children?: Snippet;
}
declare const ResultCard: import("svelte").Component<Props, {}, "">;
type ResultCard = ReturnType<typeof ResultCard>;
export default ResultCard;
