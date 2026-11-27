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
/**
 * A group of switches or checkboxes reads "show these": with nothing in it chosen (no filter,
 * every option's locations show) all its options draw on. Only multi-select groups of two or
 * more; a lone switch ("Only dealers with in-store display") is an opt-in and starts off.
 */
export function onWhenEmpty(g) {
    return g.selection === 'multi' && g.options.length > 1 && (g.style === 'toggle' || g.style === 'choice');
}
/** Whether an option draws as on (checked) in its group. */
export function isShownOn(g, selected, uid) {
    if (onWhenEmpty(g) && !g.options.some((o) => selected.includes(o.uid)))
        return true;
    return selected.includes(uid);
}
/**
 * Flip an option in an on-when-empty group as the visitor sees it. All on again clears the group,
 * so no redundant filter is sent. The last one on can't go off (empty already means all): this
 * returns the selection unchanged, and the component disables that control.
 */
export function flipShown(g, selected, uid) {
    const on = g.options.map((o) => o.uid).filter((u) => isShownOn(g, selected, u) !== (u === uid));
    if (on.length === 0)
        return selected;
    const rest = clearGroup(g, selected);
    return on.length === g.options.length ? rest : [...rest, ...on];
}
/** The only option still on in an on-when-empty group, which can't be turned off. */
export function isLastOn(g, selected, uid) {
    return onWhenEmpty(g) && isShownOn(g, selected, uid) && g.options.filter((o) => isShownOn(g, selected, o.uid)).length === 1;
}
