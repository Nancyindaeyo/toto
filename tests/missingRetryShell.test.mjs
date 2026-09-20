import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MISSING_INDEPENDENT_RETRY_SHELL_LIMIT,
    MISSING_INDEPENDENT_RETRY_SHELL_MESSAGE,
    MISSING_SHELL_SCAN_RANGE_ALL,
    assistantRowsInScanRange,
    formatMissingShellReport,
    hasUsableAssistantBody,
    isRecentAssistantIndex,
    isMissingShellTargetFloor,
    normalizeMissingShellScanRange,
    shouldRestoreMissingIndependentRetryShell,
} from '../src/independentApi/missingRetryShell.js';

const allowed = {
    timing: 'auto',
    isTargetFloor: true,
    hasMessageBody: true,
};

test('scan range defaults to ten assistant floors and can cover the whole chat', () => {
    assert.equal(MISSING_INDEPENDENT_RETRY_SHELL_LIMIT, 10);
    assert.equal(normalizeMissingShellScanRange(undefined), 10);
    assert.equal(normalizeMissingShellScanRange(6), 10);
    assert.equal(normalizeMissingShellScanRange(20), 20);
    assert.equal(normalizeMissingShellScanRange('all'), MISSING_SHELL_SCAN_RANGE_ALL);
    const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => ({ i, m: { mes: String(i) } }));
    assert.deepEqual(assistantRowsInScanRange(rows, 10).map(row => row.i), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    assert.equal(assistantRowsInScanRange(rows, 'all').length, 12);
    assert.match(formatMissingShellReport({ range: 10, floors: [{ index: 8 }, { index: 11 }] }), /#8、#11/);
    assert.match(formatMissingShellReport({ range: 'all', floors: [] }), /没有缺外壳/);
});

test('recent assistant window uses the selected scan rows', () => {
    assert.equal(isRecentAssistantIndex([{ i: 2 }, { i: 5 }], 5), true);
    assert.equal(isRecentAssistantIndex([{ i: 2 }, { i: 5 }], 4), false);
    assert.equal(isRecentAssistantIndex(null, 5), false);
});

test('currently synced or mounted floors stay eligible even outside the scan window', () => {
    assert.equal(isMissingShellTargetFloor(3, { recentIndices: new Set([8, 9]) }), false);
    assert.equal(isMissingShellTargetFloor(3, { recentIndices: new Set([8, 9]), syncedIndices: new Set([3]) }), true);
    assert.equal(isMissingShellTargetFloor(9, { recentIndices: new Set([8, 9]) }), true);
    assert.equal(isMissingShellTargetFloor('x', { syncedIndices: new Set([1]) }), false);
});

test('only auto/manual independent timing may restore a retry shell', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell(allowed), true);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, timing: 'manual' }), true);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, timing: 'off' }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, timing: '' }), false);
});

test('ready product, deleted owner, live host, in-flight request or follow mirror keep the current UI', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasSavedHtml: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, persistedDeleted: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasHost: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasActiveFlight: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasFollowMirror: true }), false);
});

test('missing a crash authorization must not block the retry card', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell(allowed), true);
});

test('active generation and quick-waiting keep the loading placeholder path', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, isActiveGenerationTarget: true }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, quickWaiting: true }), false);
});

test('only the current target floor with usable body gets a card, placed under that reply', () => {
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, isTargetFloor: false }), false);
    assert.equal(shouldRestoreMissingIndependentRetryShell({ ...allowed, hasMessageBody: false }), false);
    assert.equal(hasUsableAssistantBody({ mes: '<div>日历</div>' }), true);
    assert.equal(hasUsableAssistantBody({ mes: '   ', extra: { display_text: '正文' } }), true);
    assert.equal(hasUsableAssistantBody({ mes: '   ' }), false);
    assert.match(MISSING_INDEPENDENT_RETRY_SHELL_MESSAGE, /不会自动再发请求/);
});
