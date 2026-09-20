import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AUTOMATIC_REROLL_DEFAULT,
    AUTOMATIC_REROLL_IDLE_DEFAULT_SECONDS,
    AUTOMATIC_REROLL_STALL_MS,
    normalizeAutomaticRerollMax,
    normalizeAutomaticRerollIdleSeconds,
    configuredAutomaticRerollMax,
    configuredAutomaticRerollIdleMs,
    shouldAutomaticReroll,
    automaticRerollStatusText,
    automaticRerollExhaustedNote,
    shouldAnnounceAutomaticRerollExhausted,
    stallTimeoutError,
    isAutomaticRerollStall,
    isQuotaInsufficientFailure,
    isLocalPreflightFailure,
} from '../src/automaticReroll.js';

test('default extra posts stay two and have no upper cap', () => {
    assert.equal(AUTOMATIC_REROLL_DEFAULT, 2);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1 }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 2 }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 3 }), false);
    assert.equal(normalizeAutomaticRerollMax(99), 99);
    assert.equal(configuredAutomaticRerollMax({ independentAutomaticRerollMax: 20 }), 20);
});

test('manual resay and leftover ready faces still reroll until complete', () => {
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, complete: false }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, complete: true }), false);
});

test('status copy keeps leftover faces and missing-face counts', () => {
    assert.match(automaticRerollStatusText(1, 2), /1\/2/);
    assert.match(automaticRerollStatusText(2, 2, 1), /还缺 1 面/);
    assert.match(automaticRerollExhaustedNote(2), /2\/2/);
});

test('exhausted copy only after the extra automatic posts are used up', () => {
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 1 }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 2 }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 3 }), true);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 3, cancelled: true }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 3, quotaInsufficient: true }), false);
});

test('401 and 429 reroll; quota, preflight, cancel, chat, replace and absolute timeout do not', () => {
    const fail = { failedPosts: 1, max: 2 };
    assert.equal(shouldAutomaticReroll(fail), true);
    assert.equal(shouldAutomaticReroll({ ...fail, timedOut: true }), false);
    assert.equal(shouldAutomaticReroll({ ...fail, cancelled: true }), false);
    assert.equal(shouldAutomaticReroll({ ...fail, stale: true }), false);
    assert.equal(shouldAutomaticReroll({ ...fail, preflight: true }), false);
    assert.equal(shouldAutomaticReroll({ ...fail, quotaInsufficient: true }), false);
    assert.equal(isQuotaInsufficientFailure({ status: 401 }, {}), false);
    assert.equal(isQuotaInsufficientFailure({ status: 429 }, {}), false);
    assert.equal(isQuotaInsufficientFailure({ message: 'insufficient_quota' }, {}), true);
    assert.equal(isQuotaInsufficientFailure({ message: '额度不足' }, {}), true);
    assert.equal(isLocalPreflightFailure({ requestCount: 0 }), true);
    assert.equal(isLocalPreflightFailure({ code: 'RABBIT_MIRROR_REQUEST_TOO_LARGE' }), true);
});

test('idle stall defaults to 90 seconds and stays rerollable', () => {
    assert.equal(AUTOMATIC_REROLL_IDLE_DEFAULT_SECONDS, 90);
    assert.equal(AUTOMATIC_REROLL_STALL_MS, 90000);
    assert.equal(normalizeAutomaticRerollIdleSeconds(0), 1);
    assert.equal(configuredAutomaticRerollIdleMs({ independentAutomaticRerollIdleSeconds: 45 }), 45000);
    const stall = stallTimeoutError(1, 90);
    assert.equal(isAutomaticRerollStall(stall), true);
    assert.match(stall.message, /90 秒/);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, timedOut: false }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, timedOut: true }), false);
});

test('settings keep 0 as no extra automatic posts', () => {
    assert.equal(normalizeAutomaticRerollMax(0), 0);
    assert.equal(normalizeAutomaticRerollMax('nope'), 2);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, max: 0 }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 1, max: 0 }), false);
    assert.equal(shouldAutomaticReroll({ failedPosts: 3, max: 4 }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 5, max: 4 }), false);
});
