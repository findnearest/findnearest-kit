<!--
  A locator's category filters: the groups a FindNearest API's `GET /v1/filters` returns, each
  drawn in its own style. Options in a group combine with OR and groups with AND on the server;
  this component only keeps the selection (option uids) and reports changes.

  Styles: `chips` (toggle buttons), `choice` (radio list for single selection, checkboxes for
  multi, with each option's description), `toggle` (a switch per option, e.g. "Only show
  dealers with in-store display") and `menu` (a button that opens a checklist, for long lists).
  A single-selection `choice` group with no default option gets an "All" choice first, so it
  can be cleared, unless the group sets `showAll: false`. Option descriptions show under the
  option, behind an info button with a tooltip (hover, keyboard focus or tap; Esc closes), or not
  at all, by the group's `descriptionDisplay`.

  On a client site the filters must look like the parent site, so this styles the minimum: the
  chips take the parent's own button classes (`chipClass`, `chipSelectedClass`), and two cascade
  layers split the CSS: `fn-kit-look` (colours, borders, radii) under the parent site's CSS,
  `fn-kit-frame` (layout, the switch's parts) over it. Declare the order before any stylesheet
  loads: `<style>@layer fn-kit-look, captured, fn-kit-frame;</style>` in app.html.
-->
<script lang="ts">
	import { clearGroup, toggleOption, type FilterGroup, type FilterOption } from './filters.js';

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

	let {
		groups,
		selected = $bindable([]),
		onchange,
		chipClass = '',
		chipSelectedClass = '',
		allLabel = 'All',
		hideLabels = false,
		class: className = ''
	}: Props = $props();

	const uid = $props.id();

	function set(next: string[]) {
		selected = next;
		onchange?.(next);
	}

	const isOn = (optionUid: string) => selected.includes(optionUid);
	const chosenIn = (g: FilterGroup) => g.options.filter((o) => isOn(o.uid)).length;
	const needsAll = (g: FilterGroup) =>
		g.selection === 'single' && (g.showAll ?? true) && !g.options.some((o) => o.isDefault);
	const shows = (g: FilterGroup, where: 'below' | 'tooltip', o: FilterOption) =>
		!!o.description && (g.descriptionDisplay ?? 'below') === where;

	function choose(g: FilterGroup, optionUid: string) {
		set(g.selection === 'single' ? [...clearGroup(g, selected), optionUid] : toggleOption(groups, selected, optionUid));
	}

	// One tooltip open at a time, by tap or click; hover and keyboard focus also show it (CSS)
	let openTip = $state<string | null>(null);
	function closeTipOutside(e: MouseEvent) {
		if (openTip && !(e.target as Element | null)?.closest?.('.fnk-info')) openTip = null;
	}
</script>

<svelte:window onclick={closeTipOutside} onkeydown={(e) => e.key === 'Escape' && (openTip = null)} />

{#snippet info(o: FilterOption, key: string)}
	{@const tipId = `fnk-tip-${uid}-${key}`}
	<span class="fnk-info">
		<button
			type="button"
			class="fnk-info-button"
			aria-label="About {o.label}"
			aria-describedby={tipId}
			aria-expanded={openTip === key}
			onclick={() => (openTip = openTip === key ? null : key)}
		>
			<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
			</svg>
		</button>
		<span role="tooltip" id={tipId} class="fnk-tip" class:fnk-tip-open={openTip === key}>{o.description}</span>
	</span>
{/snippet}

{#snippet choiceList(g: FilterGroup, name: string)}
	{#if needsAll(g)}
		<div class="fnk-choice-item">
			<label class="fnk-choice-main">
				<input type="radio" {name} checked={chosenIn(g) === 0} onchange={() => set(clearGroup(g, selected))} />
				<span class="fnk-choice-text"><span class="fnk-choice-label">{allLabel}</span></span>
			</label>
		</div>
	{/if}
	{#each g.options as o (o.uid)}
		<div class="fnk-choice-item">
			<label class="fnk-choice-main">
				<input
					type={g.selection === 'single' ? 'radio' : 'checkbox'}
					{name}
					checked={isOn(o.uid)}
					onchange={() => choose(g, o.uid)}
				/>
				<span class="fnk-choice-text">
					<span class="fnk-choice-label">{o.label}</span>
					{#if shows(g, 'below', o)}<span class="fnk-choice-desc">{o.description}</span>{/if}
				</span>
			</label>
			{#if shows(g, 'tooltip', o)}{@render info(o, `${g.uid}-${o.uid}`)}{/if}
		</div>
	{/each}
{/snippet}

<div class="fnk-filters {className}">
	{#each groups as g (g.uid)}
		{#if g.style === 'toggle'}
			<div class="fnk-filter-group fnk-toggles">
				{#each g.options as o (o.uid)}
					<div class="fnk-switch-item">
						<label class="fnk-switch">
							<input
								type="checkbox"
								role="switch"
								checked={isOn(o.uid)}
								onchange={() => set(toggleOption(groups, selected, o.uid))}
							/>
							<span class="fnk-switch-track" aria-hidden="true"><span class="fnk-switch-thumb"></span></span>
							<span class="fnk-choice-text">
								<span class="fnk-switch-label">{o.label}</span>
								{#if shows(g, 'below', o)}<span class="fnk-choice-desc">{o.description}</span>{/if}
							</span>
						</label>
						{#if shows(g, 'tooltip', o)}{@render info(o, `${g.uid}-${o.uid}`)}{/if}
					</div>
				{/each}
			</div>
		{:else if g.style === 'choice'}
			<fieldset class="fnk-filter-group fnk-choices">
				<legend class:fnk-visually-hidden={hideLabels}>{g.label}</legend>
				{@render choiceList(g, `fnk-filter-${uid}-${g.uid}`)}
			</fieldset>
		{:else if g.style === 'menu'}
			<details class="fnk-filter-group fnk-menu">
				<summary class="fnk-menu-button {chipClass}">
					{g.label}{chosenIn(g) > 0 ? ` (${chosenIn(g)})` : ''}
				</summary>
				<fieldset class="fnk-menu-panel fnk-choices">
					<legend class="fnk-visually-hidden">{g.label}</legend>
					{@render choiceList(g, `fnk-filter-${uid}-${g.uid}`)}
				</fieldset>
			</details>
		{:else}
			<fieldset class="fnk-filter-group fnk-chips">
				<legend class:fnk-visually-hidden={hideLabels}>{g.label}</legend>
				<div class="fnk-chip-row">
					{#each g.options as o (o.uid)}
						<button
							type="button"
							class="fnk-chip {isOn(o.uid) ? chipSelectedClass : chipClass}"
							class:fnk-chip-on={isOn(o.uid)}
							aria-pressed={isOn(o.uid)}
							title={(g.descriptionDisplay ?? 'below') !== 'none' ? (o.description ?? undefined) : undefined}
							onclick={() => set(toggleOption(groups, selected, o.uid))}
						>
							{o.label}
						</button>
					{/each}
				</div>
			</fieldset>
		{/if}
	{/each}
</div>

<style>
	/* How the filters look: under the parent site's CSS, which wins wherever it has a say.
	   Theme through the kit's --fnk-* properties on any ancestor. */
	@layer fn-kit-look {
		.fnk-filters {
			--_fg: var(--fnk-fg, #0f172a);
			--_muted: var(--fnk-muted, #64748b);
			--_border: var(--fnk-border, #7e8ea4);
			--_bg: var(--fnk-bg, #fff);
			--_accent: var(--fnk-accent, #2563eb);
			--_radius: var(--fnk-radius, 4px);
			--_ring: var(--fnk-ring, 0 0 0 3px rgb(37 99 235 / 0.2));
			--_shadow: var(--fnk-shadow, 0 4px 12px rgb(15 23 42 / 0.12));
			color: var(--_fg);
		}

		legend {
			font-weight: 600;
		}

		/* The kit's own chip, for a locator that passes no parent button classes */
		.fnk-chip {
			padding: 0.45rem 0.9rem;
			font: inherit;
			color: var(--_fg);
			background: var(--_bg);
			border: 1px solid var(--_border);
			border-radius: 999px;
			cursor: pointer;
		}
		.fnk-chip-on {
			color: #fff;
			background: var(--_accent);
			border-color: var(--_accent);
		}
		.fnk-chip:focus-visible,
		.fnk-menu-button:focus-visible {
			outline: none;
			box-shadow: var(--_ring);
		}

		.fnk-choice-desc {
			font-size: 0.875em;
			color: var(--_muted);
		}
		.fnk-info-button {
			color: var(--_muted);
			cursor: pointer;
		}
		.fnk-info-button:hover,
		.fnk-info-button[aria-expanded='true'] {
			color: var(--_fg);
		}
		.fnk-info-button:focus-visible {
			outline: none;
			box-shadow: var(--_ring);
		}
		.fnk-tip {
			padding: 0.4rem 0.6rem;
			font-size: 0.8125rem;
			line-height: 1.35;
			color: var(--fnk-tip-fg, #fff);
			background: var(--fnk-tip-bg, #374151);
			border-radius: var(--_radius);
			box-shadow: var(--_shadow);
		}
		input[type='radio'],
		input[type='checkbox'] {
			accent-color: var(--_accent);
		}

		.fnk-switch-track {
			background: var(--_border);
			border-radius: 999px;
		}
		.fnk-switch input:checked + .fnk-switch-track {
			background: var(--_accent);
		}
		.fnk-switch-thumb {
			background: #fff;
			border-radius: 999px;
		}
		.fnk-switch input:focus-visible + .fnk-switch-track {
			box-shadow: var(--_ring);
		}

		.fnk-menu-button {
			padding: 0.45rem 0.9rem;
			color: var(--_fg);
			background: var(--_bg);
			border: 1px solid var(--_border);
			border-radius: var(--_radius);
			cursor: pointer;
		}
		.fnk-menu-panel {
			background: var(--_bg);
			border: 1px solid var(--_border);
			border-radius: var(--_radius);
			box-shadow: var(--_shadow);
		}
	}

	/* What must hold whatever the parent site's CSS says: the layout, a fieldset's reset,
	   the switch's parts and the menu panel's position. */
	@layer fn-kit-frame {
		.fnk-filters {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			text-align: start;
		}

		fieldset {
			margin: 0;
			padding: 0;
			border: 0;
			min-width: 0;
		}
		legend {
			padding: 0;
			margin-bottom: 0.5rem;
		}

		.fnk-chip-row {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.fnk-choices {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
		.fnk-choice-item {
			display: flex;
			align-items: flex-start;
			gap: 0.4rem;
		}
		.fnk-choice-main {
			display: flex;
			align-items: flex-start;
			gap: 0.6rem;
			min-width: 0;
			cursor: pointer;
		}
		/* Native radios and checkboxes, whatever the site does to its own (one hides them all with
		   opacity: 0 and appearance: none to draw custom ones from markup we don't have) */
		.fnk-choice-item input {
			appearance: auto;
			position: static;
			display: inline-block;
			flex: none;
			width: 1.1rem;
			height: 1.1rem;
			margin: 0.15em 0 0;
			opacity: 1;
			visibility: visible;
			clip: auto;
			clip-path: none;
		}
		.fnk-choice-text {
			display: flex;
			flex-direction: column;
			gap: 0.15rem;
			min-width: 0;
		}

		.fnk-toggles {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
		.fnk-switch {
			position: relative;
			display: inline-flex;
			align-items: center;
			gap: 0.6rem;
			cursor: pointer;
		}
		/* The real checkbox stays focusable and clickable, over the drawn track */
		.fnk-switch input {
			position: absolute;
			inset: 0 auto 0 0;
			width: 2.5rem;
			height: 100%;
			margin: 0;
			opacity: 0;
			cursor: pointer;
		}
		.fnk-switch-track {
			position: relative;
			flex: none;
			width: 2.5rem;
			height: 1.5rem;
		}
		.fnk-switch-thumb {
			position: absolute;
			top: 0.1875rem;
			left: 0.1875rem;
			width: 1.125rem;
			height: 1.125rem;
			transition: transform 0.15s ease;
		}
		.fnk-switch input:checked + .fnk-switch-track .fnk-switch-thumb {
			transform: translateX(1rem);
		}
		@media (prefers-reduced-motion: reduce) {
			.fnk-switch-thumb {
				transition: none;
			}
		}

		.fnk-menu {
			position: relative;
			align-self: flex-start;
		}
		.fnk-menu-button {
			display: inline-block;
			list-style: none;
		}
		.fnk-menu-button::-webkit-details-marker {
			display: none;
		}
		.fnk-menu-panel {
			position: absolute;
			z-index: var(--fnk-z, 10);
			top: calc(100% + 4px);
			left: 0;
			min-width: 16rem;
			max-height: 22rem;
			overflow-y: auto;
			padding: 0.75rem;
		}

		.fnk-switch-item {
			display: flex;
			align-items: center;
			gap: 0.4rem;
		}

		/* The info icon and its tooltip: shown on hover, keyboard focus, or a tap (fnk-tip-open) */
		.fnk-info {
			position: relative;
			display: inline-flex;
			flex: none;
		}
		.fnk-info-button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 1.75rem;
			height: 1.75rem;
			min-width: 0;
			margin: -0.15rem 0 0;
			padding: 0;
			font-size: 1.05rem;
			line-height: 1;
			/* An icon, not one of the site's buttons */
			background: none;
			border: 0;
			border-radius: 999px;
		}
		.fnk-tip {
			position: absolute;
			z-index: var(--fnk-z, 10);
			top: calc(100% + 4px);
			right: -0.25rem;
			display: none;
			width: max-content;
			max-width: min(18rem, 80vw);
			text-align: start;
			white-space: normal;
		}
		.fnk-info-button:focus-visible + .fnk-tip,
		.fnk-tip-open {
			display: block;
		}
		/* Touch screens keep :hover after a tap, so a second tap couldn't close it */
		@media (hover: hover) {
			.fnk-info:hover .fnk-tip {
				display: block;
			}
		}

		.fnk-visually-hidden {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
			border: 0;
		}
	}
</style>
