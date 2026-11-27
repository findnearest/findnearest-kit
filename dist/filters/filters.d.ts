/** One choice in a filter group, as a FindNearest API's `GET /v1/filters` returns it. */
export interface FilterOption {
    uid: string;
    label: string;
    description: string | null;
    /** Selected when the locator first loads */
    isDefault: boolean;
}
/** Where option descriptions go. */
export type DescriptionDisplay = 'below' | 'tooltip' | 'none';
/** How a group draws: toggle chips, a menu button, a radio or checkbox list, or switches. */
export type FilterStyle = 'chips' | 'menu' | 'choice' | 'toggle';
export interface FilterGroup {
    uid: string;
    label: string;
    description: string | null;
    style: FilterStyle;
    selection: 'single' | 'multi';
    /** How option descriptions show: under the option (default), behind an info icon, or not at all */
    descriptionDisplay?: DescriptionDisplay;
    /** A one-pick group without a default option gets an "All" choice first (default true) */
    showAllChoice?: boolean;
    options: FilterOption[];
}
/** The option uids a locator starts with: every option marked as a default. */
export declare function defaultSelection(groups: FilterGroup[]): string[];
/**
 * Toggle one option in a selection, keeping the group's rule: in a single-selection group,
 * choosing an option replaces the group's other choices; choosing it again clears it.
 */
export declare function toggleOption(groups: FilterGroup[], selected: string[], uid: string): string[];
/** Clear one group's choices (a single-selection group's "All"). */
export declare function clearGroup(group: FilterGroup, selected: string[]): string[];
/**
 * A group of switches or checkboxes reads "show these": with nothing in it chosen (no filter,
 * every option's locations show) all its options draw on. Only multi-select groups of two or
 * more; a lone switch ("Only dealers with in-store display") is an opt-in and starts off.
 */
export declare function onWhenEmpty(g: FilterGroup): boolean;
/** Whether an option draws as on (checked) in its group. */
export declare function isShownOn(g: FilterGroup, selected: string[], uid: string): boolean;
/**
 * Flip an option in an on-when-empty group as the visitor sees it. All on again clears the group,
 * so no redundant filter is sent. The last one on can't go off (empty already means all): this
 * returns the selection unchanged, and the component disables that control.
 */
export declare function flipShown(g: FilterGroup, selected: string[], uid: string): string[];
/** The only option still on in an on-when-empty group, which can't be turned off. */
export declare function isLastOn(g: FilterGroup, selected: string[], uid: string): boolean;
