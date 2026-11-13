import { type GeocoderResult, type ResultKind, type SearchFn } from './client.js';
interface Props {
    /** Runs a search; build one with geocoderSearch() */
    search: SearchFn;
    /** A result was picked */
    onSelect: (result: GeocoderResult, info: {
        pin: boolean;
        kind: ResultKind;
    }) => void;
    /** The box text. Pass one-way to pre-fill (it never searches until focused), or bind it. */
    value?: string;
    /** Point to rank results near, read at search time (e.g. the map centre) */
    bias?: () => {
        lat: number;
        lon: number;
    } | null | undefined;
    /** Show each result's distance from this point, read at search time (e.g. the pin being edited) */
    distanceFrom?: () => {
        lat: number;
        lon: number;
    } | null | undefined;
    placeholder?: string;
    /** Accessible name when no visible <label for> points at `id` */
    label?: string;
    id?: string;
    limit?: number;
    minLength?: number;
    debounceMs?: number;
    /** Give up after this long; the geocoder's cold street path takes 6 to 10 s */
    timeoutMs?: number;
    /** Say "still searching" after this long */
    slowAfterMs?: number;
    /** 'dropdown' floats over what is below (maps); 'inline' pushes it down (forms) */
    layout?: 'dropdown' | 'inline';
    /** Empty the box after a pick instead of showing the picked text */
    clearOnSelect?: boolean;
    /** Chip text for a result; defaults to the geocoder's kind_label, else its kind (town, address, place, point, location) */
    kindLabel?: (result: GeocoderResult) => string;
    disabled?: boolean;
}
declare const GeocoderSearch: import("svelte").Component<Props, {}, "value">;
type GeocoderSearch = ReturnType<typeof GeocoderSearch>;
export default GeocoderSearch;
