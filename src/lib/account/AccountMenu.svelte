<!--
  AccountBlock behind an avatar button, for an app with a row of links across the top and no
  sidebar. Goes at the right of the header. An app with a sidebar uses AccountBlock directly.
-->
<script lang="ts">
	import AccountBlock, { type AccountProps } from './AccountBlock.svelte';
	import { accountInitial } from './account.js';

	let { name, email, href, active, onnavigate, onSignOut, extra }: AccountProps = $props();

	let open = $state(false);
	let root = $state<HTMLElement>();
	let trigger = $state<HTMLButtonElement>();

	function onPointerDown(e: PointerEvent) {
		if (open && !root?.contains(e.target as Node)) open = false;
	}

	function onKeyDown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') {
			open = false;
			trigger?.focus();
		}
	}

	// Tabbing out closes it. relatedTarget is null when focus leaves the page, so that stays open.
	function onFocusOut(e: FocusEvent) {
		const next = e.relatedTarget as Node | null;
		if (next && !root?.contains(next)) open = false;
	}
</script>

<svelte:document onpointerdown={onPointerDown} onkeydown={onKeyDown} />

<div class="fnk-account-menu" bind:this={root} onfocusout={onFocusOut}>
	<button
		type="button"
		class="fnk-account-menu-trigger"
		bind:this={trigger}
		aria-haspopup="true"
		aria-expanded={open}
		aria-label="Account: {name}"
		title={name}
		onclick={() => (open = !open)}
	>
		{accountInitial(name)}
	</button>
	{#if open}
		<div class="fnk-account-menu-panel">
			<AccountBlock
				{name}
				{email}
				{href}
				{active}
				{extra}
				onnavigate={() => {
					open = false;
					onnavigate?.();
				}}
				onSignOut={() => {
					open = false;
					onSignOut();
				}}
			/>
		</div>
	{/if}
</div>

<style>
	.fnk-account-menu {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
	}

	.fnk-account-menu-trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--fn-control-height);
		height: var(--fn-control-height);
		margin: 0;
		padding: 0;
		background-color: var(--fn-color-primary-600);
		border: 0;
		border-radius: var(--fn-radius-full);
		color: var(--fn-color-on-solid);
		font: inherit;
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
	}
	.fnk-account-menu-trigger:hover,
	.fnk-account-menu-trigger[aria-expanded='true'] {
		background-color: var(--fn-color-primary-700);
	}
	.fnk-account-menu-trigger:focus-visible {
		outline: none;
		box-shadow: var(--fn-ring-primary);
	}

	.fnk-account-menu-panel {
		position: absolute;
		top: calc(100% + 0.375rem);
		right: 0;
		z-index: 900;
		width: 16rem;
		max-width: calc(100vw - 2rem);
		padding: 0.375rem;
		background-color: var(--fn-color-bg-page);
		border: 1px solid var(--fn-color-border);
		border-radius: var(--fn-radius-md);
		box-shadow: var(--fn-shadow-md);
	}
</style>
