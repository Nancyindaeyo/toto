import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AUTOMATIC_REROLL_MAX,
    AUTOMATIC_REROLL_DEFAULT,
    normalizeAutomaticRerollMax,
    configuredAutomaticRerollMax,
    shouldAutomaticReroll,
    automaticRerollStatusText,
    automaticRerollExhaustedNote,
    shouldAnnounceAutomaticRerollExhausted,
} from '../src/automaticReroll.js';

test('zero usable faces allow two extra automatic posts', () => {
    assert.equal(AUTOMATIC_REROLL_MAX, 2);
    assert.equal(AUTOMATIC_REROLL_DEFAULT, 2);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1 }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 2 }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 3 }), false);
});

test('ready faces and manual or face resay never auto-reroll', () => {
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, usableReadyFace: true }), false);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, manual: true }), false);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, faceResay: true }), false);
});

test('status copy keeps the ready shell language', () => {
    assert.match(automaticRerollStatusText(1, 2), /1\/2/);
    assert.match(automaticRerollStatusText(2, 2), /已出的镜面会保留/);
    assert.match(automaticRerollExhaustedNote(2), /2\/2/);
});

test('exhausted copy only after the extra automatic posts are used up', () => {
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 1 }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 2 }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 3 }), true);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 1, usableReadyFace: true }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 3, manual: true }), false);
});

test('settings clamp keeps 0 as no extra automatic posts', () => {
    assert.equal(normalizeAutomaticRerollMax(0), 0);
    assert.equal(normalizeAutomaticRerollMax(10), 10);
    assert.equal(normalizeAutomaticRerollMax(99), 10);
    assert.equal(normalizeAutomaticRerollMax('nope'), 2);
    assert.equal(configuredAutomaticRerollMax({ independentAutomaticRerollMax: 4 }), 4);
    assert.equal(shouldAutomaticReroll({ failedPosts: 1, max: 0 }), false);
    assert.equal(shouldAnnounceAutomaticRerollExhausted({ failedPosts: 1, max: 0 }), false);
    assert.equal(shouldAutomaticReroll({ failedPosts: 3, max: 4 }), true);
    assert.equal(shouldAutomaticReroll({ failedPosts: 5, max: 4 }), false);
});
