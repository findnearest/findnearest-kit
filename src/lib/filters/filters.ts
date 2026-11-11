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
export function defaultSelection(groups: FilterGroup[]): string[] {
	return groups.flatMap((g) => g.options.filter((o) => o.isDefault).map((o) => o.uid));
}

/**
 * Toggle one option in a selection, keeping the group's rule: in a single-selection group,
 * choosing an option replaces the group's other choices; choosing it again clears it.
 */
export function toggleOption(groups: FilterGroup[], selected: string[], uid: string): string[] {
	const group = groups.find((g) => g.options.some((o) => o.uid === uid));
	if (!group) return selected;
	if (selected.includes(uid)) return selected.filter((u) => u !== uid);
	if (group.selection === 'multi') return [...selected, uid];
	const siblings = new Set(group.options.map((o) => o.uid));
	return [...selected.filter((u) => !siblings.has(u)), uid];
}

/** Clear one group's choices (a single-selection group's "All"). */
export function clearGroup(group: FilterGroup, selected: string[]): string[] {
	const ids = new Set(group.options.map((o) => o.uid));
	return selected.filter((u) => !ids.has(u));
}
