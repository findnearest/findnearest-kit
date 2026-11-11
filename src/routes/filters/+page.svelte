<script lang="ts">
	// Demo for CategoryFilter as a client site uses it: the parent site's CSS (a centred section,
	// a call-to-action `button {}` rule) in a `captured` layer between the kit's look and frame
	// layers, and the parent's own button classes passed in. Sample data only. Not packaged.
	import { CategoryFilter, defaultSelection, type FilterGroup } from '$lib/index.js';

	const range: FilterGroup[] = [
		{
			uid: 'range',
			label: 'Range',
			description: null,
			style: 'choice',
			selection: 'single',
			options: [
				{ uid: 'any', label: 'Any dealer', description: null, isDefault: true },
				{ uid: 'premium', label: 'Premium range', description: 'Selected stockists only', isDefault: false }
			]
		},
		{
			uid: 'display',
			label: 'Display',
			description: null,
			style: 'toggle',
			selection: 'multi',
			options: [{ uid: 'shown', label: 'Only show dealers with the range on display', description: null, isDefault: false }]
		}
	];

	const types: FilterGroup[] = [
		{
			uid: 'type',
			label: 'Location type',
			description: null,
			style: 'chips',
			selection: 'multi',
			options: [
				{ uid: 'branch', label: 'Branches', description: 'Every kind of branch', isDefault: false },
				{ uid: 'atm', label: 'ATMs', description: null, isDefault: false },
				{ uid: 'business', label: 'Business banking', description: null, isDefault: false },
				{ uid: 'mobile', label: 'Mobile lenders', description: null, isDefault: false }
			]
		}
	];

	const offices: FilterGroup[] = [
		{
			uid: 'office',
			label: 'Choose an office type',
			description: null,
			style: 'choice',
			selection: 'single',
			options: [
				{ uid: 'full', label: 'Full service centre', description: null, isDefault: false },
				{ uid: 'agent', label: 'Agents', description: 'A free face-to-face service in the community.', isDefault: false },
				{ uid: 'access', label: 'Access points', description: 'Free self-help facilities.', isDefault: false }
			]
		}
	];

	const menu: FilterGroup[] = [{ ...types[0], uid: 'menu', label: 'Filter', style: 'menu' }];

	let rangeSel = $state(defaultSelection(range));
	let typeSel = $state<string[]>([]);
	let officeSel = $state<string[]>([]);
	let menuSel = $state<string[]>([]);
</script>

<svelte:head>
	<title>CategoryFilter demo</title>
	{@html `<style>@layer fn-kit-look, captured, fn-kit-frame;
		@layer captured { .site-section { text-align: center; } button { border: 2px solid #111; padding: 12px 20px; font-weight: 700; display: inline-block; } .site-btn { background: #fff; color: #111; border-radius: 0; } .site-btn-primary { background: #111; color: #fff; border-radius: 0; } }
	</style>`}
</svelte:head>

<main class="demo">
	<h1>CategoryFilter</h1>
	<p>Parent CSS centres the section and styles every button; the filters keep their layout.</p>

	<section class="site-section">
		<h2>Choice + toggle (single range, refinement switch)</h2>
		<CategoryFilter groups={range} bind:selected={rangeSel} />
		<p class="sel">Selected: {rangeSel.join(', ') || 'none'}</p>
	</section>

	<section class="site-section">
		<h2>Chips with the parent's button classes</h2>
		<CategoryFilter groups={types} bind:selected={typeSel} chipClass="site-btn" chipSelectedClass="site-btn-primary" />
		<p class="sel">Selected: {typeSel.join(', ') || 'none (all)'}</p>
	</section>

	<section class="site-section">
		<h2>Choice with descriptions and an "All" choice</h2>
		<CategoryFilter groups={offices} bind:selected={officeSel} />
		<p class="sel">Selected: {officeSel.join(', ') || 'none (all)'}</p>
	</section>

	<section class="site-section">
		<h2>Menu</h2>
		<CategoryFilter groups={menu} bind:selected={menuSel} />
		<p class="sel">Selected: {menuSel.join(', ') || 'none (all)'}</p>
	</section>
</main>

<style>
	.demo {
		max-width: 720px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.sel {
		font-size: 0.85rem;
		color: #555;
	}
</style>
