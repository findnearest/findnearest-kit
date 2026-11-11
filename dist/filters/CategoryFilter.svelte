<!--
  A locator's category filters: the groups a FindNearest API's `GET /v1/filters` returns, each
  drawn in its own style. Options in a group combine with OR and groups with AND on the server;
  this component only keeps the selection (option uids) and reports changes.

  Styles: `chips` (toggle buttons), `choice` (radio list for single selection, checkboxes for
  multi, with each option's description), `toggle` (a switch per option, e.g. "Only show
  dealers with in-store display") and `menu` (a button that opens a checklist, for long lists).
  A single-selection `choice` group with no default option gets an "All" choice first, so it
  can be cleared.

  On a client site the filters must look like the parent site, so this styles the minimum: the
  chips take the parent's own button classes (`chipClass`, `chipSelectedClass`), and two cascade
  layers split the CSS: `fn-kit-look` (colours, borders, radii) under the parent site's CSS,
  `fn-kit-frame` (layout, the switch's parts) over it. Declare the order before any stylesheet
  loads: `<style>@layer fn-kit-look, captured, fn-kit-frame;</style>` in app.html.
-->
<script lang="ts">
	import { clearGroup, toggleOption, type FilterGroup } from './filters.js';

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
	const needsAll = (g: FilterGroup) => g.selection === 'single' && !g.options.some((o) => o.isDefault);

	function choose(g: FilterGroup, optionUid: string) {
		set(g.selection === 'single' ? [...clearGroup(g, selected), optionUid] : toggleOption(groups, selected, optionUid));
	}
</script>

{#snippet choiceList(g: FilterGroup, name: string)}
	{#if needsAll(g)}
		<label class="fnk-choice-item">
			<input type="radio" {name} checked={chosenIn(g) === 0} onchange={() => set(clearGroup(g, selected))} />
			<span class="fnk-choice-text"><span class="fnk-choice-label">{allLabel}</span></span>
		</label>
	{/if}
	{#each g.options as o (o.uid)}
		<label class="fnk-choice-item">
			<input
				type={g.selection === 'single' ? 'radio' : 'checkbox'}
				{name}
				checked={isOn(o.uid)}
				onchange={() => choose(g, o.uid)}
			/>
			<span class="fnk-choice-text">
				<span class="fnk-choice-label">{o.label}</span>
				{#if o.description}<span class="fnk-choice-desc">{o.description}</span>{/if}
			</span>
		</label>
	{/each}
{/snippet}

<div class="fnk-filters {className}">
	{#each groups as g (g.uid)}
		{#if g.style === 'toggle'}
			<div class="fnk-filter-group fnk-toggles">
				{#each g.options as o (o.uid)}
					<label class="fnk-switch">
						<input
							type="checkbox"
							role="switch"
							checked={isOn(o.uid)}
							onchange={() => set(toggleOption(groups, selected, o.uid))}
						/>
						<span class="fnk-switch-track" aria-hidden="true"><span class="fnk-switch-thumb"></span></span>
						<span class="fnk-switch-label">{o.label}</span>
					</label>
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
							title={o.description ?? undefined}
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
			gap: 0.6rem;
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
