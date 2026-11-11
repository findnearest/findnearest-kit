/** The option uids a locator starts with: every option marked as a default. */
export function defaultSelection(groups) {
    return groups.flatMap((g) => g.options.filter((o) => o.isDefault).map((o) => o.uid));
}
/**
 * Toggle one option in a selection, keeping the group's rule: in a single-selection group,
 * choosing an option replaces the group's other choices; choosing it again clears it.
 */
export function toggleOption(groups, selected, uid) {
    const group = groups.find((g) => g.options.some((o) => o.uid === uid));
    if (!group)
        return selected;
    if (selected.includes(uid))
        return selected.filter((u) => u !== uid);
    if (group.selection === 'multi')
        return [...selected, uid];
    const siblings = new Set(group.options.map((o) => o.uid));
    return [...selected.filter((u) => !siblings.has(u)), uid];
}
/** Clear one group's choices (a single-selection group's "All"). */
export function clearGroup(group, selected) {
    const ids = new Set(group.options.map((o) => o.uid));
    return selected.filter((u) => !ids.has(u));
}
