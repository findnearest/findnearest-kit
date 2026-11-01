import { describe, expect, test } from 'bun:test';
import { accountInitial } from '../src/lib/account/account.js';

describe('accountInitial', () => {
	test('is the capitalised first character of the name or email', () => {
		expect(accountInitial('ant burnett')).toBe('A');
		expect(accountInitial('  ant@example.com')).toBe('A');
	});

	// An empty avatar would look broken; an account with no name still gets a mark.
	test('falls back to a question mark when there is nothing to show', () => {
		expect(accountInitial('   ')).toBe('?');
	});
});
