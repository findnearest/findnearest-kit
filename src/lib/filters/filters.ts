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

/**
 * A group of switches or checkboxes reads "show these": with nothing in it chosen (no filter,
 * every option's locations show) all its options draw on. Only multi-select groups of two or
 * more; a lone switch ("Only dealers with in-store display") is an opt-in and starts off.
 */
export function onWhenEmpty(g: FilterGroup): boolean {
	return g.selection === 'multi' && g.options.length > 1 && (g.style === 'toggle' || g.style === 'choice');
}

/** Whether an option draws as on (checked) in its group. */
export function isShownOn(g: FilterGroup, selected: string[], uid: string): boolean {
	if (onWhenEmpty(g) && !g.options.some((o) => selected.includes(o.uid))) return true;
	return selected.includes(uid);
}

/**
 * Flip an option in an on-when-empty group as the visitor sees it. All on again clears the group,
 * so no redundant filter is sent. The last one on can't go off (empty already means all): this
 * returns the selection unchanged, and the component disables that control.
 */
export function flipShown(g: FilterGroup, selected: string[], uid: string): string[] {
	const on = g.options.map((o) => o.uid).filter((u) => isShownOn(g, selected, u) !== (u === uid));
	if (on.length === 0) return selected;
	const rest = clearGroup(g, selected);
	return on.length === g.options.length ? rest : [...rest, ...on];
}

/** The only option still on in an on-when-empty group, which can't be turned off. */
export function isLastOn(g: FilterGroup, selected: string[], uid: string): boolean {
	return onWhenEmpty(g) && isShownOn(g, selected, uid) && g.options.filter((o) => isShownOn(g, selected, o.uid)).length === 1;
}
