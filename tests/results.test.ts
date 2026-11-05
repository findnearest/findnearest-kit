import { describe, expect, test } from 'bun:test';
import { formatDistance } from '../src/lib/results/results.js';

describe('formatDistance', () => {
	// Under 100m the straight-line figure is noise, so it is shown as a bound
	test('says <100m for anything closer than 100 metres', () => {
		expect(formatDistance(0)).toBe('<100m');
		expect(formatDistance(99.9)).toBe('<100m');
	});

	test('shows one decimal under 10km and whole kilometres from there', () => {
		expect(formatDistance(100)).toBe('0.1km');
		expect(formatDistance(2449)).toBe('2.4km');
		expect(formatDistance(9949)).toBe('9.9km');
		expect(formatDistance(10_000)).toBe('10km');
		expect(formatDistance(36_600)).toBe('37km');
	});
});
