import test from 'node:test';
import assert from 'node:assert/strict';
import {
    DEFAULT_INDEPENDENT_MAX_REQUEST_CHARS,
    MIN_INDEPENDENT_MAX_REQUEST_CHARS,
    INDEPENDENT_MAX_REQUEST_CHARS_CEILING,
    normalizeIndependentMaxRequestChars,
    configuredIndependentMaxRequestChars,
} from '../src/independentRequestBudget.js';

test('default request budget is 50000, not a 32000 hard cap', () => {
    assert.equal(DEFAULT_INDEPENDENT_MAX_REQUEST_CHARS, 50000);
    assert.equal(normalizeIndependentMaxRequestChars(undefined), 50000);
    assert.equal(normalizeIndependentMaxRequestChars(''), 50000);
    assert.equal(configuredIndependentMaxRequestChars({}), 50000);
});

test('users can raise the budget in settings', () => {
    assert.equal(normalizeIndependentMaxRequestChars(80000), 80000);
    assert.equal(configuredIndependentMaxRequestChars({ independentMaxRequestChars: 120000 }), 120000);
    assert.equal(normalizeIndependentMaxRequestChars(MIN_INDEPENDENT_MAX_REQUEST_CHARS), MIN_INDEPENDENT_MAX_REQUEST_CHARS);
});

test('invalid or tiny values fall back instead of blocking every request', () => {
    assert.equal(normalizeIndependentMaxRequestChars(0), 50000);
    assert.equal(normalizeIndependentMaxRequestChars(-1), 50000);
    assert.equal(normalizeIndependentMaxRequestChars(100), MIN_INDEPENDENT_MAX_REQUEST_CHARS);
    assert.equal(normalizeIndependentMaxRequestChars(INDEPENDENT_MAX_REQUEST_CHARS_CEILING + 1), INDEPENDENT_MAX_REQUEST_CHARS_CEILING);
});
