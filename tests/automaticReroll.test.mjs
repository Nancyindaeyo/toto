import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AUTOMATIC_REROLL_MAX,
    shouldAutomaticReroll,
    automaticRerollStatusText,
    automaticRerollExhaustedNote,
} from '../src/automaticReroll.js';

test('zero usable faces allow two extra automatic posts', () => {
    assert.equal(AUTOMATIC_REROLL_MAX, 2);
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
