import { describe, expect, test } from 'bun:test';
import {
	clearGroup,
	defaultSelection,
	flipShown,
	isLastOn,
	isShownOn,
	onWhenEmpty,
	toggleOption,
	type FilterGroup
} from '../src/lib/filters/filters.js';

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

const opt = (uid: string) => ({ uid, label: uid, description: null, isDefault: false });
const switches: FilterGroup = { uid: 'kind', label: 'Kind', description: null, style: 'toggle', selection: 'multi', options: ['a', 'b', 'c'].map(opt) };
const lone: FilterGroup = { uid: 'display', label: 'Display', description: null, style: 'toggle', selection: 'multi', options: [opt('d')] };

describe('switches read "show these"', () => {
	test('nothing chosen: every switch on, but a lone opt-in switch and chips stay off', () => {
		expect(['a', 'b', 'c'].map((u) => isShownOn(switches, [], u))).toEqual([true, true, true]);
		expect(onWhenEmpty(lone)).toBe(false);
		expect(isShownOn(lone, [], 'd')).toBe(false);
		expect(onWhenEmpty(groups[1])).toBe(false);
	});
	test('turning one off chooses the rest; other groups are kept', () => {
		expect(flipShown(switches, ['x'], 'b')).toEqual(['x', 'a', 'c']);
		expect(isShownOn(switches, ['a', 'c'], 'b')).toBe(false);
	});
	test('all back on clears the group (no redundant filter)', () => {
		expect(flipShown(switches, ['x', 'a', 'c'], 'b')).toEqual(['x']);
	});
	test('the last one on cannot go off', () => {
		expect(isLastOn(switches, ['a'], 'a')).toBe(true);
		expect(isLastOn(switches, ['a'], 'b')).toBe(false);
		expect(isLastOn(switches, [], 'a')).toBe(false);
		expect(flipShown(switches, ['a'], 'a')).toEqual(['a']);
	});
});
