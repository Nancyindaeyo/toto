import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MISSING_INDEPENDENT_RETRY_SHELL_LIMIT,
    MISSING_INDEPENDENT_RETRY_SHELL_MESSAGE,
    isRecentAssistantIndex,
    shouldRestoreMissingIndependentRetryShell,
} from '../src/independentApi/missingRetryShell.js';

const allowed = {
    timing: 'auto',
    isRecentAssistant: true,
    hasMessageBody: true,
};

test('recent assistant window stays at the startup sync bound', () => {
    assert.equal(MISSING_INDEPENDENT_RETRY_SHELL_LIMIT, 6);
    assert.equal(isRecentAssistantIndex([{ i: 2 }, { i: 5 }], 5), true);
    assert.equal(isRecentAssistantIndex([{ i: 2 }, { i: 5 }], 4), false);
    assert.equal(isRecentAssistantIndex(null, 5), false);
});

test('only auto/manual independent timing may restore a retry shell', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell(allowed), true);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, timing: 'manual' }), true);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, timing: 'off' }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, timing: '' }), false);
});

test('ready product, deleted owner, live host or in-flight request keep the current UI', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasSavedHtml: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, persistedDeleted: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasHost: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasActiveFlight: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, automaticSuppressed: true }), false);
});

test('active generation and quick-waiting keep the loading placeholder path', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, isActiveGenerationTarget: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, quickWaiting: true }), false);
});

test('old floors and empty bodies do not grow retry cards', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, isRecentAssistant: false }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasMessageBody: false }), false);
    assert.match(MISSING_INDEPENDENT_RETRY_SHELL_MESSAGE, /不会自动再发请求/);
});
