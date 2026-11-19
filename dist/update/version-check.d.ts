/**
 * True when the deployed build at `url` (SvelteKit's version.json) differs from `current`.
 * Bypasses the HTTP cache: adapter-node serves version.json without Cache-Control, so a plain
 * fetch can get the old copy back from the browser or Cloudflare. Any failure (offline,
 * mid-deploy, bad JSON) is false; the next check tries again.
 */
export declare function hasNewerBuild(url: string, current: string, fetchFn?: typeof fetch): Promise<boolean>;
