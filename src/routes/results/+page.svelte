<script lang="ts">
	// Demo for ResultsLayout + ResultCard as a client site uses them: no base CSS, the parent
	// site's CSS in a `captured` layer above the kit's, and an optional unlayered override. Not packaged.
	import { ResultCard, ResultsLayout, formatDistance, type ResultsLayoutMode } from '$lib/index.js';

	const sample = [
		{ uid: 'a1', name: 'Kempsey Service Centre', meters: 850, severity: null, badge: null, alerts: [] },
		{
			uid: 'a2',
			name: 'Macdonald Downs Airport Remote Servicing Agent and Community Access Point with a very long name',
			meters: 2449,
			severity: 'error',
			badge: { text: 'Closed today', severity: 'error', critical: true },
			alerts: [{ severity: 'error', label: 'Today', text: 'Closed - Staff training', critical: true }]
		},
		{
			uid: 'a3',
			name: 'Port Macquarie Service Centre',
			meters: 36_600,
			severity: 'surface',
			badge: { text: 'Public holiday', severity: 'surface' },
			alerts: [{ severity: 'surface', label: 'Mon 25 Dec', text: 'Closed - Christmas Day' }]
		},
		{
			uid: 'a4',
			name: 'Taree Service Centre',
			meters: 61_000,
			severity: 'info',
			badge: { text: 'Hours change', severity: 'info' },
			alerts: [{ severity: 'info', label: 'Fri', text: 'Closes at 2pm' }]
		},
		{
			uid: 'a5',
			name: 'Gloucester Agent',
			meters: 99,
			severity: 'warning',
			badge: { text: 'Closing soon', severity: 'warning' },
			alerts: [{ severity: 'warning', label: 'Today', text: 'Closes at 3:30pm' }]
		}
	] as const;

	let layout = $state<ResultsLayoutMode>('grid');
	let dark = $state(false);
	let override = $state(false);
	let withMap = $state(true);
	let expandedIndex = $state<number | null>(null);
	let hovered = $state<number | null>(null);
	let events = $state<string[]>([]);

	$effect(() => {
		document.documentElement.setAttribute('data-mode', dark ? 'dark' : 'light');
	});
</script>

<svelte:head>
	<title>Results · findnearest-kit</title>
	<!-- What a client template does: the kit lowest, the parent site's CSS over it -->
	{@html `<style>@layer fn-kit, captured;
		@layer captured { body { font-size: 18px; } h3 { font-family: Georgia, serif; color: purple; font-size: 1.25rem; font-weight: 700; margin: 0; } .site-link { color: #0b6e99; text-decoration: underline; } }
	</style>`}
	{#if override}
		{@html `<style>.fn-result-card .fn-card-number { background: crimson; }</style>`}
	{/if}
</svelte:head>

<main class="fn-demo" class:fn-demo-dark={dark}>
	<h1>ResultsLayout</h1>
	<div class="fn-demo-bar">
		<label><input type="radio" bind:group={layout} value="grid" /> grid</label>
		<label><input type="radio" bind:group={layout} value="wallet" /> wallet</label>
		<label><input type="checkbox" bind:checked={withMap} /> map</label>
		<label><input type="checkbox" bind:checked={dark} /> dark</label>
		<label><input type="checkbox" bind:checked={override} /> unlayered override</label>
		<span>expanded {expandedIndex ?? '-'} · hovered {hovered ?? '-'} · {events.at(-1) ?? ''}</span>
	</div>

	<ResultsLayout
		{layout}
		{withMap}
		count={sample.length}
		bind:expandedIndex
		onexpand={(i) => events.push(`expand ${i}`)}
		onhover={(i) => (hovered = i)}
	>
		{#each sample as s, index (s.uid)}
			<ResultCard
				{index}
				uid={s.uid}
				number={index + 1}
				title={s.name}
				distance={formatDistance(s.meters)}
				severity={s.severity}
				badge={s.badge}
				alerts={[...s.alerts]}
				profileHref="#profile-{s.uid}"
				profileLabel="service centre"
				profileClass="site-link"
				onprofileclick={() => events.push(`profile ${s.uid}`)}
			>
				<p>12 Smith Street, Kempsey, NSW, 2440</p>
				<p><strong>Today:</strong> 8:30am - 4:30pm</p>
			</ResultCard>
		{/each}
		{#snippet map()}
			<div class="fn-demo-map">map · highlight {expandedIndex ?? hovered ?? '-'}</div>
		{/snippet}
		{#snippet footer()}
			<p class="fn-demo-footer">Showing all locations within 100 kilometres.</p>
		{/snippet}
	</ResultsLayout>

	<div style="height: 120vh"></div>
</main>

<style>
	.fn-demo {
		font-family: system-ui, sans-serif;
		padding: 1.5rem;
		color: #111827;
		background: #f9fafb;
	}
	.fn-demo-dark {
		color: #f3f4f6;
		background: #030712;
	}
	.fn-demo-bar {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}
	.fn-demo-map {
		display: grid;
		place-items: center;
		background: repeating-linear-gradient(45deg, #cbd5e1 0 10px, #e2e8f0 10px 20px);
		color: #0f172a;
	}
	.fn-demo-footer {
		margin-top: 1rem;
	}
</style>
