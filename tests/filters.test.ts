import { describe, expect, test } from 'bun:test';
import { clearGroup, defaultSelection, toggleOption, type FilterGroup } from '../src/lib/filters/filters.js';

const groups: FilterGroup[] = [
	{
		uid: 'range',
		label: 'Range',
		description: null,
		style: 'choice',
		selection: 'single',
		options: [
			{ uid: 'any', label: 'Any dealer', description: null, isDefault: true },
			{ uid: 'x', label: 'X', description: null, isDefault: false }
		]
	},
	{
		uid: 'type',
		label: 'Type',
		description: null,
		style: 'chips',
		selection: 'multi',
		options: [
			{ uid: 'branch', label: 'Branches', description: null, isDefault: false },
			{ uid: 'atm', label: 'ATMs', description: null, isDefault: false }
		]
	}
];

describe('filters', () => {
	test('defaults come from isDefault', () => {
		expect(defaultSelection(groups)).toEqual(['any']);
	});
	test('single selection replaces its group, leaves others', () => {
		expect(toggleOption(groups, ['any', 'atm'], 'x')).toEqual(['atm', 'x']);
	});
	test('multi selection adds and removes', () => {
		expect(toggleOption(groups, ['branch'], 'atm')).toEqual(['branch', 'atm']);
		expect(toggleOption(groups, ['branch', 'atm'], 'branch')).toEqual(['atm']);
	});
	test('unknown uid changes nothing; clearGroup clears only that group', () => {
		expect(toggleOption(groups, ['x'], 'nope')).toEqual(['x']);
		expect(clearGroup(groups[0], ['x', 'atm'])).toEqual(['atm']);
	});
});
