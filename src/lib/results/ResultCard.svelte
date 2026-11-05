<!--
  One location in a ResultsLayout: a header row (number, name, status badge, distance) that opens
  the card, and a body with the alert lines, the app's own content and a "View profile" link.
  The app turns its data into these plain props (and formats the distance with
  `formatDistance`); the card knows nothing about hours rules or URLs.

  Styled by ResultsLayout (one stylesheet keeps the layouts' cascade in one place).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getResultsContext, type ResultAlert, type ResultBadge, type ResultSeverity } from './results.js';

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

	let {
		index,
		number,
		title,
		distance,
		severity = null,
		badge = null,
		alerts = [],
		profileHref,
		profileLabel = 'profile',
		onprofileclick,
		uid,
		children
	}: Props = $props();

	const ctx = getResultsContext();

	const expanded = $derived(ctx.expandedIndex === index);
	const dimmed = $derived(ctx.layout === 'grid' && ctx.expandedIndex !== null && !expanded);

	function onclick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		ctx.toggle(index);
	}
</script>

{#snippet icon(kind: 'triangle' | 'info' | 'circle')}
	<svg class="fn-result-icon" viewBox="0 0 24 24" aria-hidden="true">
		{#if kind === 'triangle'}
			<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
			<path d="M12 9v4M12 17h.01" />
		{:else}
			<circle cx="12" cy="12" r="10" />
			<path d={kind === 'info' ? 'M12 16v-4M12 8h.01' : 'M12 8v4M12 16h.01'} />
		{/if}
	</svg>
{/snippet}

<div
	class="fn-result-card"
	class:fn-is-collapsed={!expanded}
	class:fn-is-expanded={expanded}
	class:fn-is-dimmed={dimmed}
	class:fn-has-alert={badge !== null}
	data-severity={severity ?? undefined}
	data-location-uid={uid}
	data-card-index={index}
	style:--_i={index}
>
	<button
		type="button"
		class="fn-card-header"
		{onclick}
		onmouseenter={() => ctx.hover(index)}
		onmouseleave={() => ctx.hover(null)}
		aria-expanded={expanded}
	>
		<span class="fn-card-number">{number}</span>
		<h3 class="fn-card-title">{title}</h3>
		{#if badge}
			<span class="fn-status-badge" data-severity={badge.severity}>
				{#if badge.critical}
					{@render icon('triangle')}
				{:else if badge.severity === 'info'}
					{@render icon('info')}
				{/if}
				{badge.text}
			</span>
		{/if}
		<span class="fn-card-distance">{distance}</span>
	</button>

	{#if expanded}
		<div class="fn-card-body">
			{#if alerts.length > 0}
				<div class="fn-hours-alerts-banner">
					{#each alerts as alert, i (i)}
						<div class="fn-alert-item" data-severity={alert.severity}>
							{@render icon(alert.critical ? 'triangle' : alert.severity === 'info' ? 'info' : 'circle')}
							<span><strong>{alert.label}:</strong> {alert.text}</span>
						</div>
					{/each}
				</div>
			{/if}

			<div class="fn-card-content">
				{@render children?.()}

				{#if profileHref}
					<div class="fn-view-profile-link">
						<a href={profileHref} onclick={onprofileclick}>View {profileLabel} &rsaquo;</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
