import type { Snippet } from 'svelte';
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
declare const AccountBlock: import("svelte").Component<AccountProps, {}, "">;
type AccountBlock = ReturnType<typeof AccountBlock>;
export default AccountBlock;
