<script lang="ts">
	// Demo for AccountBlock and AccountMenu with the kit's base CSS. Not packaged.
	import '$lib/styles/fn.css';
	import { AccountBlock, AccountMenu, themeState } from '$lib/index.js';

	let signOuts = $state(0);
	let debug = $state(false);
	const signOut = () => signOuts++;
</script>

<svelte:head><title>Account · findnearest-kit</title></svelte:head>

<header class="demo-header">
	<strong>Top-nav app: AccountMenu</strong>
	<AccountMenu name="Ant Burnett" email="ant@example.com" onSignOut={signOut} />
</header>

<main class="demo-main">
	<p>Mode: <code class="fn-code">{themeState.mode}</code> · Sign outs: <code class="fn-code">{signOuts}</code></p>

	<div class="demo-sidebars">
		<aside class="demo-sidebar">
			<strong>Name and email, linked</strong>
			<div class="demo-foot">
				<AccountBlock name="Ant Burnett" email="ant@example.com" href="/account" active onSignOut={signOut} />
			</div>
		</aside>
		<aside class="demo-sidebar">
			<strong>Long email as the name</strong>
			<div class="demo-foot">
				<AccountBlock
					name="a.very.long.address.that.must.truncate@example.com"
					email="a.very.long.address.that.must.truncate@example.com"
					onSignOut={signOut}
				/>
			</div>
		</aside>
		<aside class="demo-sidebar">
			<strong>With app extras</strong>
			<div class="demo-foot">
				<AccountBlock name="Ant Burnett" email="ant@example.com" onSignOut={signOut}>
					{#snippet extra()}
						<span class="fn-badge">SUPERADMIN</span>
						<label class="fn-flex fn-items-center fn-gap-1.5">
							<input type="checkbox" class="fn-checkbox" bind:checked={debug} /> Debug
						</label>
					{/snippet}
				</AccountBlock>
			</div>
		</aside>
	</div>
</main>

<style>
	.demo-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1.25rem;
		background: var(--fn-color-bg-page);
		border-bottom: 1px solid var(--fn-color-border);
	}
	.demo-main {
		padding: 1.25rem;
	}
	.demo-sidebars {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1rem;
	}
	.demo-sidebar {
		display: flex;
		flex-direction: column;
		width: 16rem;
		height: 22rem;
		padding: 0.5rem;
		background: var(--fn-color-bg-page);
		border: 1px solid var(--fn-color-border);
	}
	.demo-foot {
		margin-top: auto;
		padding-top: 0.5rem;
		border-top: 1px solid var(--fn-color-border);
	}
</style>
