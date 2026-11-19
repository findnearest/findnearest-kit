import { describe, expect, test } from 'bun:test';
import { hasNewerBuild } from '../src/lib/update/version-check.js';

function fakeFetch(status: number, body: string, seen: RequestInit[] = []) {
	return (async (_url: string, init: RequestInit) => {
		seen.push(init);
		return new Response(body, { status });
	}) as unknown as typeof fetch;
}

describe('hasNewerBuild', () => {
	test('a different deployed version is newer, fetched past the HTTP cache', async () => {
		const seen: RequestInit[] = [];
		expect(await hasNewerBuild('/_app/version.json', '100', fakeFetch(200, '{"version":"200"}', seen))).toBe(true);
		expect(seen[0].cache).toBe('no-store');
	});

	test('the same version is not newer', async () => {
		expect(await hasNewerBuild('/v', '100', fakeFetch(200, '{"version":"100"}'))).toBe(false);
	});

	test('errors, bad JSON and a missing version are not newer', async () => {
		expect(await hasNewerBuild('/v', '100', fakeFetch(503, '{"version":"200"}'))).toBe(false);
		expect(await hasNewerBuild('/v', '100', fakeFetch(200, '<html>'))).toBe(false);
		expect(await hasNewerBuild('/v', '100', fakeFetch(200, '{}'))).toBe(false);
		const offline = (async () => {
			throw new TypeError('Failed to fetch');
		}) as unknown as typeof fetch;
		expect(await hasNewerBuild('/v', '100', offline)).toBe(false);
	});
});
