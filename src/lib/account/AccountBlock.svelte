<!--
  The logged-in user, the dark mode switch and sign out, as one block. The house place for them:
  at the foot of the sidebar and drawer in an app that has one; apps with a row of links across
  the top reach it through AccountMenu. The app supplies any divider and spacing around it.

  Both theme labels render and CSS on data-mode shows the right one, so the server (which can't
  read localStorage) and the browser agree and nothing flips on hydration.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { accountInitial } from './account.js';
	import { themeState } from '../theme/theme.svelte.js';

	export interface AccountProps {
		/** The person's name, or their email if they have no name. */
		name: string;
		/** Shown under the name. Left out when it would repeat the name. */
		email?: string;
		/** Makes the name row a link, e.g. to the settings page. */
		href?: string;
		/** The page at `href` is the current page. */
		active?: boolean;
		/** Called when the name row's link is followed, e.g. to close a drawer. */
		onnavigate?: () => void;
		onSignOut: () => void;
		/** App-specific extras under the name: a role badge, a debug switch. */
		extra?: Snippet;
	}

	let { name, email, href, active = false, onnavigate, onSignOut, extra }: AccountProps = $props();

	let subtitle = $derived(email && email !== name ? email : undefined);
</script>

{#snippet identity()}
	<span class="fnk-account-avatar" aria-hidden="true">{accountInitial(name)}</span>
	<span class="fnk-account-text">
		<span class="fnk-account-name" title={name}>{name}</span>
		{#if subtitle}<span class="fnk-account-email" title={subtitle}>{subtitle}</span>{/if}
	</span>
{/snippet}

<div class="fnk-account">
	{#if href}
		<a
			class="fnk-account-identity fnk-account-link"
			class:fnk-account-active={active}
			{href}
			aria-current={active ? 'page' : undefined}
			onclick={() => onnavigate?.()}
		>
			{@render identity()}
		</a>
	{:else}
		<div class="fnk-account-identity">{@render identity()}</div>
	{/if}

	{#if extra}<div class="fnk-account-extra">{@render extra()}</div>{/if}

	<button type="button" class="fnk-account-row" onclick={() => themeState.toggle()}>
		<span class="fnk-account-for-light">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
			Dark mode
		</span>
		<span class="fnk-account-for-dark">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<circle cx="12" cy="12" r="4" />
				<path
					d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
				/>
			</svg>
			Light mode
		</span>
	</button>

	<button type="button" class="fnk-account-row fnk-account-signout" onclick={onSignOut}>
		<span>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
			</svg>
			Sign out
		</span>
	</button>
</div>

<style>
	.fnk-account {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
		font-size: 0.8125rem;
		color: var(--fn-color-body);
	}

	.fnk-account-identity {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		min-width: 0;
		padding: 0.375rem 0.5rem;
		border-radius: var(--fn-radius);
		color: var(--fn-color-body);
		text-decoration: none;
	}
	.fnk-account-link:hover,
	.fnk-account-active {
		background-color: var(--fn-color-bg-accent);
		color: var(--fn-color-body);
		text-decoration: none;
	}

	.fnk-account-avatar {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: var(--fn-control-height);
		height: var(--fn-control-height);
		border-radius: var(--fn-radius-full);
		background-color: var(--fn-color-primary-600);
		color: var(--fn-color-on-solid);
		font-weight: 500;
	}

	.fnk-account-text {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}
	.fnk-account-name,
	.fnk-account-email {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.fnk-account-name {
		font-weight: 500;
	}
	.fnk-account-email {
		font-size: 0.75rem;
		color: var(--fn-color-body-faint);
	}
	/* On the highlight only body reaches AA in both modes (body-muted is 4.0:1 in dark). */
	.fnk-account-link:hover .fnk-account-email,
	.fnk-account-active .fnk-account-email {
		color: var(--fn-color-body);
	}

	.fnk-account-extra {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		color: var(--fn-color-body-muted);
	}

	/* Every property is set here, so an app's own button rules can't reshape a row. */
	.fnk-account-row {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		min-height: var(--fn-control-height);
		margin: 0;
		padding: 0 0.5rem;
		background: transparent;
		border: 0;
		border-radius: var(--fn-radius);
		color: var(--fn-color-body-muted);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.fnk-account-row:hover {
		background-color: var(--fn-color-bg-accent);
		color: var(--fn-color-body);
	}
	.fnk-account-signout,
	.fnk-account-signout:hover {
		color: var(--fn-tint-error-text);
	}
	.fnk-account-signout:hover {
		background-color: var(--fn-tint-error-bg-soft);
	}
	.fnk-account-row > span {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}
	.fnk-account-row svg {
		flex-shrink: 0;
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.fnk-account-row:focus-visible,
	.fnk-account-link:focus-visible {
		outline: none;
		box-shadow: var(--fn-ring-primary);
	}

	.fnk-account-row > .fnk-account-for-dark,
	:global([data-mode='dark']) .fnk-account-row > .fnk-account-for-light {
		display: none;
	}
	:global([data-mode='dark']) .fnk-account-row > .fnk-account-for-dark {
		display: flex;
	}
</style>
