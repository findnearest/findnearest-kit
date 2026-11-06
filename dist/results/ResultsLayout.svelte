<!--
  The results half of a public "find nearest" page: a column of ResultCards beside a map.

  Two layouts. `grid` (from 1024px wide): equal-height card rows filling the map's height, and an
  expanded card's body floats over the rows below it (Escape or a click outside closes it).
  `wallet`: sticky cards that stack under each other as the page scrolls. Below 1024px both
  are one column, wallet-style cards first and the map after them.

  The map is a snippet: the app renders its own map component (this package never imports a map
  library) and drives it from `expandedIndex` and the `onhover` index.

  On a client site the results must look like the parent site, so this styles the minimum and
  sets no font, heading or link style. Two cascade layers: `fn-kit-look` (borders, radii,
  shadows, colours, tints) sits under the parent site's CSS, which wins wherever it has a say;
  `fn-kit-frame` (the layouts, positions, ellipsis and our own buttons' box) sits over it, so a
  site's `*` reset or `button {}` style can't break the cards. The app's unlayered CSS beats
  both. Declare the order before any stylesheet loads:
  `<style>@layer fn-kit-look, captured, fn-kit-frame;</style>` in app.html.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setResultsContext, type ResultsLayoutMode } from './results.js';

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

	let {
		layout = 'grid',
		count,
		withMap = false,
		expandedIndex = $bindable(null),
		onexpand,
		onhover,
		children,
		map,
		footer
	}: Props = $props();

	setResultsContext({
		get layout() {
			return layout;
		},
		get count() {
			return count;
		},
		get expandedIndex() {
			return expandedIndex;
		},
		toggle(index) {
			if (expandedIndex === index) {
				expandedIndex = null;
			} else {
				expandedIndex = index;
				onexpand?.(index);
			}
		},
		hover(index) {
			onhover?.(index);
		}
	});

	function onkeydown(e: KeyboardEvent) {
		if (layout === 'grid' && e.key === 'Escape' && expandedIndex !== null) expandedIndex = null;
	}
</script>

<svelte:document {onkeydown} />

<div
	class="fn-results-layout"
	class:fn-with-map={withMap && map}
	class:fn-layout-grid={layout === 'grid'}
	class:fn-layout-wallet={layout === 'wallet'}
>
	<div class="fn-results-column">
		{#if layout === 'grid' && expandedIndex !== null}
			<button
				type="button"
				class="fn-grid-backdrop"
				onclick={() => (expandedIndex = null)}
				aria-label="Close expanded card"
			></button>
		{/if}
		<div class="fn-cards-stack" style:--_count={count}>
			{@render children()}
		</div>
		{@render footer?.()}
	</div>

	{#if withMap && map}
		<div class="fn-map-column">
			{@render map()}
		</div>
	{/if}
</div>

<style>
	/* How the cards look: under the parent site's CSS, which wins wherever it has a say */
	@layer fn-kit-look {
		/* Theme through --fnk-results-* on any ancestor. The fallbacks are the light look, with
		   dark ones under [data-mode='dark']; an app that maps the properties onto its own
		   tokens (fn-last.css does for fn.css apps) gets both modes from those. */
		.fn-results-layout {
			--_bg: var(--fnk-results-bg, #fff);
			--_border: var(--fnk-results-border, rgb(229 231 235));
			--_border-raised: var(--fnk-results-border-raised, rgb(229 231 235));
			--_border-open: var(--fnk-results-border-open, rgb(55 65 81));
			--_hover: var(--fnk-results-hover, rgb(243 244 246));
			--_body-hover: var(--fnk-results-body-hover, rgb(249 250 251));
			--_muted: var(--fnk-results-muted, rgb(107 114 128));
			--_marker: var(--fnk-results-marker, rgb(55 65 81));
			--_marker-open: var(--fnk-results-marker-open, rgb(31 41 55));
			--_marker-fg: var(--fnk-results-marker-fg, #fff);
			--_radius: var(--fnk-results-radius, 0.75rem);
			/* Multiplies every shadow's alpha: dark mode needs heavier shadows to read at all */
			--_k: var(--fnk-results-shadow-strength, 1);
			--_sticky-top: var(--fnk-results-sticky-top, 56px);
			--_wallet-step: var(--fnk-results-wallet-step, 47px);
			--_max-height: var(--fnk-results-max-height, 600px);
			--_error: var(--fnk-results-error, rgb(239 68 68));
			--_error-text: var(--fnk-results-error-text, rgb(185 28 28));
			--_error-strong: var(--fnk-results-error-strong, rgb(127 29 29));
			--_error-marker: var(--fnk-results-error-marker, rgb(185 28 28));
			--_error-card: var(--fnk-results-error-card, color-mix(in srgb, var(--_error) 7%, var(--_bg)));
			--_warning: var(--fnk-results-warning, rgb(245 158 11));
			--_warning-text: var(--fnk-results-warning-text, rgb(180 83 9));
			--_info: var(--fnk-results-info, rgb(59 130 246));
			--_info-text: var(--fnk-results-info-text, rgb(29 78 216));
			--_surface: var(--fnk-results-surface, rgb(107 114 128));
			--_surface-text: var(--fnk-results-surface-text, rgb(75 85 99));
			--_badge-tint: var(--fnk-results-badge-tint, 15%);
			--_alert-tint: var(--fnk-results-alert-tint, 10%);
			--_error-opacity: 0.85;
			--_surface-opacity: 0.75;

			display: grid;
			gap: 1.5rem;
			grid-template-columns: 1fr;
		}

		:global([data-mode='dark']) .fn-results-layout {
			--_bg: var(--fnk-results-bg, rgb(17 24 39));
			--_border: var(--fnk-results-border, rgb(55 65 81));
			--_border-raised: var(--fnk-results-border-raised, rgb(75 85 99));
			--_hover: var(--fnk-results-hover, rgb(31 41 55));
			--_body-hover: var(--fnk-results-body-hover, rgb(31 41 55));
			--_muted: var(--fnk-results-muted, rgb(156 163 175));
			--_k: var(--fnk-results-shadow-strength, 3);
			--_error-text: var(--fnk-results-error-text, rgb(252 165 165));
			--_error-strong: var(--fnk-results-error-strong, rgb(252 165 165));
			--_error-card: var(
				--fnk-results-error-card,
				color-mix(in srgb, rgb(127 29 29) 15%, var(--_bg))
			);
			--_warning-text: var(--fnk-results-warning-text, rgb(253 230 138));
			--_info-text: var(--fnk-results-info-text, rgb(147 197 253));
			--_surface-text: var(--fnk-results-surface-text, rgb(156 163 175));
			--_badge-tint: var(--fnk-results-badge-tint, 20%);
			--_alert-tint: var(--fnk-results-alert-tint, 15%);
			--_error-opacity: 0.9;
			--_surface-opacity: 0.8;
		}

		@media (min-width: 1024px) {
			.fn-results-layout.fn-with-map {
				grid-template-columns: minmax(400px, 1fr) minmax(300px, 1fr);
				align-items: start;
			}
		}

		.fn-results-column {
			min-width: 0;
			position: relative;
		}

		/* Invisible backdrop: a click outside the open card closes it */
		.fn-grid-backdrop {
			position: fixed;
			inset: 0;
			z-index: 50;
			cursor: default;
			background: transparent;
			border: none;
			padding: 0;
			margin: 0;
		}

		.fn-cards-stack {
			display: flex;
			flex-direction: column;
		}

		/* ---------------------------------------------------------------- card (wallet, and
		   every layout below 1024px): sticky cards that slide under the one above */
		.fn-results-layout :global(.fn-result-card) {
			position: sticky;
			top: var(--_top, 0);
			z-index: var(--_z, 1);
			background: var(--_bg);
			border-radius: 0 0 var(--_radius) var(--_radius);
			box-shadow: 0 2px 4px rgb(0 0 0 / calc(0.08 * var(--_k)));
			border: 1px solid var(--_border);
			border-top: none;
			overflow: hidden;
			margin-top: -8px;
		}

		.fn-results-layout.fn-layout-wallet :global(.fn-result-card) {
			--_top: calc(var(--_sticky-top) + var(--_i) * var(--_wallet-step));
			--_z: calc(var(--_count) - var(--_i));
		}

		.fn-results-layout :global(.fn-result-card:first-child) {
			margin-top: 0;
			border-radius: var(--_radius);
			border-top: 1px solid var(--_border);
			box-shadow: 0 2px 8px rgb(0 0 0 / calc(0.1 * var(--_k)));
		}

		.fn-results-layout :global(.fn-result-card:last-child) {
			border-radius: 0 0 var(--_radius) var(--_radius);
		}

		.fn-results-layout :global(.fn-result-card.fn-is-expanded) {
			border-color: var(--_border-open);
			box-shadow: 0 -2px 4px rgb(55 65 81 / calc(0.1 * var(--_k)));
		}

		/* ---------------------------------------------------------------- grid */
		@media (min-width: 1024px) {
			.fn-results-layout.fn-layout-grid.fn-with-map .fn-cards-stack {
				display: grid;
				grid-template-rows: repeat(var(--_count, 10), 1fr);
				/* Explicit 0-min column: the implicit `auto` track grows to a long title's
				   min-content, pushing cards under the map instead of ellipsizing */
				grid-template-columns: minmax(0, 1fr);
				height: min(calc(100vh - 8rem), var(--_max-height));
				gap: 0;
				overflow: visible;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card) {
				position: relative;
				top: auto;
				z-index: auto;
				margin-top: 0;
				border-radius: 0;
				border: 1px solid var(--_border);
				border-top: none;
				box-shadow: none;
				display: flex;
				flex-direction: column;
				overflow: visible;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card:first-child) {
				border-radius: var(--_radius) var(--_radius) 0 0;
				border-top: 1px solid var(--_border);
				box-shadow: 0 -2px 8px rgb(0 0 0 / calc(0.05 * var(--_k)));
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card:first-child .fn-card-header) {
				border-radius: var(--_radius) var(--_radius) 0 0;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card:last-child) {
				border-radius: 0 0 var(--_radius) var(--_radius);
				box-shadow: 0 2px 8px rgb(0 0 0 / calc(0.08 * var(--_k)));
			}

			.fn-results-layout.fn-layout-grid
				:global(.fn-result-card:last-child:not(.fn-is-expanded) .fn-card-header) {
				border-radius: 0 0 var(--_radius) var(--_radius);
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card:only-child) {
				border-radius: var(--_radius);
				border-top: 1px solid var(--_border);
				box-shadow: 0 2px 8px rgb(0 0 0 / calc(0.08 * var(--_k)));
			}

			.fn-results-layout.fn-layout-grid
				:global(.fn-result-card:only-child:not(.fn-is-expanded) .fn-card-header) {
				border-radius: var(--_radius);
			}

			.fn-results-layout.fn-layout-grid
				:global(.fn-result-card:only-child.fn-is-expanded .fn-card-header) {
				border-radius: var(--_radius) var(--_radius) 0 0;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card .fn-card-header) {
				flex: 1;
				min-height: 0;
			}

			/* The open card rises over its neighbours, and its body floats over the rows below */
			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-expanded) {
				z-index: 100;
				border-radius: var(--_radius) var(--_radius) 0 0;
				border: 1px solid var(--_border-raised);
				border-bottom: none;
				background: var(--_bg);
				box-shadow:
					0 -4px 16px rgb(0 0 0 / calc(0.1 * var(--_k))),
					-4px 0 16px rgb(0 0 0 / calc(0.1 * var(--_k))),
					4px 0 16px rgb(0 0 0 / calc(0.1 * var(--_k)));
				transition: box-shadow 0.15s ease-out;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-expanded .fn-card-header) {
				border-radius: var(--_radius) var(--_radius) 0 0;
				position: relative;
				z-index: 1;
				box-shadow: 0 4px 8px rgb(0 0 0 / calc(0.1 * var(--_k)));
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-expanded .fn-card-body) {
				position: absolute;
				top: 100%;
				left: -1px;
				right: -1px;
				background: var(--_bg);
				border: 1px solid var(--_border-raised);
				border-top: none;
				border-radius: 0 0 var(--_radius) var(--_radius);
				box-shadow:
					0 8px 16px rgb(0 0 0 / calc(0.15 * var(--_k))),
					4px 4px 12px rgb(0 0 0 / calc(0.08 * var(--_k))),
					-4px 4px 12px rgb(0 0 0 / calc(0.08 * var(--_k)));
				max-height: 350px;
				overflow-y: auto;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-dimmed) {
				opacity: 0.4;
				transition: opacity 0.15s ease-out;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-dimmed:hover) {
				opacity: 0.7;
			}
		}

		/* ---------------------------------------------------------------- closures */
		.fn-results-layout :global(.fn-result-card[data-severity='error']) {
			background: var(--_error-card);
			opacity: var(--_error-opacity);
		}

		.fn-results-layout :global(.fn-result-card[data-severity='error'] .fn-card-title) {
			color: var(--_error-strong);
		}

		.fn-results-layout :global(.fn-result-card[data-severity='error'] .fn-card-number) {
			background: var(--_error-marker);
		}

		/* A routine closure (public holiday) is only muted */
		.fn-results-layout :global(.fn-result-card[data-severity='surface']) {
			opacity: var(--_surface-opacity);
		}

		.fn-results-layout :global(.fn-result-card[data-severity='surface'] .fn-card-title) {
			color: var(--_muted);
		}

		/* Open cards are read in full */
		.fn-results-layout :global(.fn-result-card.fn-is-expanded[data-severity]) {
			opacity: 1;
		}

		/* ---------------------------------------------------------------- header */
		.fn-results-layout :global(.fn-card-header) {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
			padding: 1rem 1.25rem;
			/* A button doesn't inherit the page's type by default; the parent site's should show */
			font: inherit;
			color: inherit;
			letter-spacing: inherit;
			background: inherit;
			border: none;
			width: 100%;
			text-align: left;
			cursor: pointer;
			min-height: 56px;
			transition: background-color 0.15s ease;
		}

		.fn-results-layout :global(:is(.fn-card-header:hover, .fn-card-header:focus-visible)) {
			background: var(--_hover);
		}

		.fn-results-layout :global(.fn-card-number) {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 26px;
			height: 26px;
			background: var(--_marker);
			color: var(--_marker-fg);
			font-size: 0.75rem;
			font-weight: 600;
			border-radius: 50%;
			border: 2px solid var(--_marker-fg);
			box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
			flex-shrink: 0;
		}

		.fn-results-layout :global(.fn-is-expanded .fn-card-number) {
			background: var(--_marker-open);
			transform: scale(1.1);
		}

		/* Size, weight and font are the parent site's heading style; only the ellipsis is ours */
		.fn-results-layout :global(.fn-card-title) {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.fn-results-layout :global(.fn-card-distance) {
			flex-shrink: 0;
		}

		.fn-results-layout :global(.fn-status-badge) {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
			padding: 0.125rem 0.5rem;
			font-size: 0.625rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.025em;
			border-radius: 9999px;
			flex-shrink: 0;
		}

		.fn-results-layout :global(.fn-result-icon) {
			width: 1rem;
			height: 1rem;
			flex-shrink: 0;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}

		.fn-results-layout :global(.fn-status-badge .fn-result-icon) {
			width: 0.75rem;
			height: 0.75rem;
		}

		/* ---------------------------------------------------------------- body */
		.fn-results-layout :global(.fn-card-body) {
			display: block;
			padding: 0 1.25rem 1.25rem;
			color: inherit;
			border-top: 1px solid var(--_border);
		}

		.fn-results-layout :global(.fn-card-body:hover) {
			background: var(--_body-hover);
		}

		.fn-results-layout :global(.fn-hours-alerts-banner) {
			display: flex;
			flex-direction: column;
			gap: 0.375rem;
			padding: 0.75rem 0;
			border-bottom: 1px solid var(--_border);
		}

		.fn-results-layout :global(.fn-alert-item) {
			display: flex;
			align-items: flex-start;
			gap: 0.5rem;
			padding: 0.5rem 0.75rem;
			border-radius: 0.375rem;
		}

		.fn-results-layout :global(.fn-card-content) {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			padding-top: 0.75rem;
		}

		.fn-results-layout :global(.fn-view-profile-link) {
			margin-top: 0.75rem;
			padding-top: 0.75rem;
			border-top: 1px solid var(--_border);
			text-align: right;
		}

		/* ---------------------------------------------------------------- severity tints */
		.fn-results-layout :global([data-severity='error']:is(.fn-status-badge, .fn-alert-item)) {
			--_sev: var(--_error);
			color: var(--_error-text);
		}
		.fn-results-layout :global([data-severity='warning']:is(.fn-status-badge, .fn-alert-item)) {
			--_sev: var(--_warning);
			color: var(--_warning-text);
		}
		.fn-results-layout :global([data-severity='info']:is(.fn-status-badge, .fn-alert-item)) {
			--_sev: var(--_info);
			color: var(--_info-text);
		}
		.fn-results-layout :global([data-severity='surface']:is(.fn-status-badge, .fn-alert-item)) {
			--_sev: var(--_surface);
			color: var(--_surface-text);
		}
		.fn-results-layout :global(.fn-status-badge[data-severity]) {
			background: color-mix(in srgb, var(--_sev) var(--_badge-tint), transparent);
		}
		.fn-results-layout :global(.fn-alert-item[data-severity]) {
			background: color-mix(in srgb, var(--_sev) var(--_alert-tint), transparent);
		}

		/* ---------------------------------------------------------------- map */
		.fn-map-column > :global(*) {
			border-radius: var(--_radius);
			box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
		}
	}
	/* What must hold whatever the parent site's CSS says: the layouts, the sticky and floating
	   positions, the ellipsis, and the box of our own controls. A card header is a <button>
	   only for keyboard and screen readers, so a site's `button {}` call-to-action style must
	   not land on it (BOQ's gives every button a 2px border, padding and inline-block). */
	@layer fn-kit-frame {
		.fn-results-layout {
			display: grid;
			grid-template-columns: 1fr;
		}

		.fn-results-column {
			min-width: 0;
			position: relative;
		}

		.fn-grid-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 50;
			width: auto;
			height: auto;
			max-width: none;
			margin: 0;
			padding: 0;
			border: none;
			background: transparent;
			box-shadow: none;
			cursor: default;
		}

		.fn-cards-stack {
			display: flex;
			flex-direction: column;
		}

		.fn-results-layout :global(.fn-result-card) {
			position: sticky;
			top: var(--_top, 0);
			z-index: var(--_z, 1);
			overflow: hidden;
			margin-top: -8px;
			background: var(--_bg);
		}

		.fn-results-layout :global(.fn-result-card:first-child) {
			margin-top: 0;
		}

		.fn-results-layout :global(.fn-result-card[data-severity='error']) {
			background: var(--_error-card);
		}

		.fn-results-layout :global(.fn-card-header) {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
			width: 100%;
			max-width: none;
			min-height: 56px;
			margin: 0;
			padding: 1rem 1.25rem;
			border: none;
			/* Corners follow the card, wherever it sits in the stack */
			border-radius: inherit;
			background: inherit;
			font: inherit;
			color: inherit;
			letter-spacing: inherit;
			text-transform: none;
			text-align: left;
			cursor: pointer;
		}

		.fn-results-layout :global(.fn-card-header:hover) {
			background: var(--_hover);
		}

		.fn-results-layout :global(.fn-card-number) {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 26px;
			height: 26px;
			flex-shrink: 0;
			border-radius: 50%;
		}

		.fn-results-layout :global(.fn-card-title) {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.fn-results-layout :global(:is(.fn-card-distance, .fn-status-badge)) {
			flex-shrink: 0;
		}

		.fn-results-layout :global(.fn-status-badge) {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
		}

		.fn-results-layout :global(.fn-result-icon) {
			width: 1rem;
			height: 1rem;
			flex-shrink: 0;
			fill: none;
			stroke: currentColor;
		}

		.fn-results-layout :global(.fn-status-badge .fn-result-icon) {
			width: 0.75rem;
			height: 0.75rem;
		}

		.fn-results-layout :global(.fn-card-body) {
			display: block;
		}

		.fn-results-layout :global(:is(.fn-hours-alerts-banner, .fn-card-content)) {
			display: flex;
			flex-direction: column;
		}

		.fn-results-layout :global(.fn-alert-item) {
			display: flex;
			align-items: flex-start;
			gap: 0.5rem;
		}

		/* The column has the height and the map fills it: a map component's own unlayered
		   `height: 100%` beats any layered height on the map itself. */
		.fn-map-column {
			position: sticky;
			top: var(--_sticky-top);
			height: 400px;
		}

		.fn-map-column > :global(*) {
			height: 100%;
		}

		@media (min-width: 1024px) {
			.fn-results-layout.fn-with-map {
				grid-template-columns: minmax(400px, 1fr) minmax(300px, 1fr);
			}

			.fn-results-layout.fn-layout-grid.fn-with-map .fn-cards-stack {
				display: grid;
				grid-template-rows: repeat(var(--_count, 10), 1fr);
				grid-template-columns: minmax(0, 1fr);
				height: min(calc(100vh - 8rem), var(--_max-height));
				overflow: visible;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card) {
				position: relative;
				top: auto;
				z-index: auto;
				margin-top: 0;
				display: flex;
				flex-direction: column;
				overflow: visible;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card .fn-card-header) {
				flex: 1;
				min-height: 0;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-expanded) {
				z-index: 100;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-expanded .fn-card-body) {
				position: absolute;
				top: 100%;
				left: -1px;
				right: -1px;
				max-height: 350px;
				overflow-y: auto;
				background: var(--_bg);
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-dimmed) {
				opacity: 0.4;
			}

			.fn-results-layout.fn-layout-grid :global(.fn-result-card.fn-is-dimmed:hover) {
				opacity: 0.7;
			}

			.fn-map-column {
				height: calc(100vh - 8rem);
				max-height: var(--_max-height);
			}
		}
	}
</style>
