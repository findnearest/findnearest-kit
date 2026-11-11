import { type FilterGroup } from './filters.js';
interface Props {
    /** The groups to show, in order */
    groups: FilterGroup[];
    /** Selected option uids. Bind it, or pass it with `onchange`. */
    selected?: string[];
    /** The selection changed */
    onchange?: (selected: string[]) => void;
    /** Class(es) for an unselected chip and the menu button, e.g. the parent site's secondary button */
    chipClass?: string;
    /** Class(es) for a selected chip, e.g. the parent site's primary button */
    chipSelectedClass?: string;
    /** Label of the "All" choice in a single-selection choice group without a default */
    allLabel?: string;
    /** Hide the group headings (a locator with one obvious group) */
    hideLabels?: boolean;
    class?: string;
}
declare const CategoryFilter: import("svelte").Component<Props, {}, "selected">;
type CategoryFilter = ReturnType<typeof CategoryFilter>;
export default CategoryFilter;
