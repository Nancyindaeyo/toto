import test from 'node:test';
import assert from 'node:assert/strict';
import {
    FACE_SWIPE_MAX,
    FACE_SWIPE_FULL_MESSAGE,
    emptySwipeState,
    canAppendSwipe,
    seedSwipeState,
    appendSuccessfulSwipe,
    selectSwipeIndex,
    deleteCurrentSwipe,
    updateCurrentSwipeHtml,
    restoreCurrentSwipeInitial,
    faceSwipeBarIntent,
} from '../src/swipeVersions.js';

function stack(...htmls) {
    let state = emptySwipeState();
    for (const html of htmls) {
        const result = appendSuccessfulSwipe(state, { html, initialHtml: html });
        assert.equal(result.ok, true);
        state = result.state;
    }
    return state;
}

test('first successful face occupies version 1', () => {
    const seeded = seedSwipeState(emptySwipeState(), { html: '<details>a</details>' });
    assert.equal(seeded.ok, true);
    assert.equal(seeded.seeded, true);
    assert.equal(seeded.state.versions.length, 1);
    assert.equal(seeded.state.currentIndex, 0);
});

test('seed does not overwrite an existing stack', () => {
    const first = seedSwipeState(emptySwipeState(), { html: '<details>a</details>' });
    const again = seedSwipeState(first.state, { html: '<details>b</details>' });
    assert.equal(again.seeded, false);
    assert.equal(again.state.versions[0].html, '<details>a</details>');
});

test('resay appends to the right and becomes current', () => {
    const state = stack('<details>1</details>', '<details>2</details>');
    assert.equal(state.versions.length, 2);
    assert.equal(state.currentIndex, 1);
    assert.equal(state.versions[1].html, '<details>2</details>');
});

test('fifth resay is allowed, sixth is blocked until delete', () => {
    const htmls = Array.from({ length: FACE_SWIPE_MAX }, (_, i) => `<details>${i + 1}</details>`);
    const state = stack(...htmls);
    assert.equal(canAppendSwipe(state), false);
    const blocked = appendSuccessfulSwipe(state, { html: '<details>6</details>' });
    assert.equal(blocked.ok, false);
    assert.equal(blocked.reason, 'full');
    assert.equal(blocked.message, FACE_SWIPE_FULL_MESSAGE);
    assert.equal(blocked.state.versions.length, 5);
});

test('delete current lands on the older neighbor and renumbers', () => {
    const five = stack('<details>1</details>', '<details>2</details>', '<details>3</details>', '<details>4</details>', '<details>5</details>');
    const atThree = selectSwipeIndex(five, 2);
    const deleted = deleteCurrentSwipe(atThree.state);
    assert.equal(deleted.ok, true);
    assert.equal(deleted.state.versions.map(item => item.html).join(','), '<details>1</details>,<details>2</details>,<details>4</details>,<details>5</details>');
    assert.equal(deleted.state.currentIndex, 1);
    assert.equal(deleted.state.versions[1].html, '<details>2</details>');
});

test('delete newest lands on the previous version', () => {
    const five = stack('<details>1</details>', '<details>2</details>', '<details>3</details>', '<details>4</details>', '<details>5</details>');
    const deleted = deleteCurrentSwipe(five);
    assert.equal(deleted.state.currentIndex, 3);
    assert.equal(deleted.state.versions[3].html, '<details>4</details>');
    assert.equal(deleted.state.versions.length, 4);
});

test('delete oldest lands on the original second version', () => {
    const three = selectSwipeIndex(stack('<details>1</details>', '<details>2</details>', '<details>3</details>'), 0);
    const deleted = deleteCurrentSwipe(three.state);
    assert.equal(deleted.ok, true);
    assert.equal(deleted.state.currentIndex, 0);
    assert.equal(deleted.state.versions[0].html, '<details>2</details>');
    assert.equal(deleted.state.versions.length, 2);
});

test('cannot delete the last remaining version', () => {
    const one = stack('<details>only</details>');
    const deleted = deleteCurrentSwipe(one);
    assert.equal(deleted.ok, false);
    assert.equal(deleted.reason, 'last');
    assert.equal(deleted.state.versions.length, 1);
});

test('repair updates current html and restore returns birth html', () => {
    const state = stack('<details>birth</details>');
    const repaired = updateCurrentSwipeHtml(state, '<details>repaired</details>');
    assert.equal(repaired.ok, true);
    assert.equal(repaired.state.versions[0].html, '<details>repaired</details>');
    assert.equal(repaired.state.versions[0].initialHtml, '<details>birth</details>');
    const restored = restoreCurrentSwipeInitial(repaired.state);
    assert.equal(restored.state.versions[0].html, '<details>birth</details>');
    assert.equal(restored.state.versions.length, 1);
});

test('title arrows resay at the ends and switch in the middle', () => {
    const first = { currentIndex: 0, canNext: false, canDelete: false, canResay: true, overlay: false };
    assert.deepEqual(faceSwipeBarIntent(first, 'next'), { type: 'resay' });
    assert.deepEqual(faceSwipeBarIntent(first, 'prev'), { type: 'resay' });
    const mid = { currentIndex: 1, canNext: true, canDelete: true, canResay: true, overlay: false };
    assert.deepEqual(faceSwipeBarIntent(mid, 'prev'), { type: 'select', index: 0 });
    assert.deepEqual(faceSwipeBarIntent(mid, 'next'), { type: 'select', index: 2 });
    const lastFull = { currentIndex: 4, canNext: false, canDelete: true, canResay: false, overlay: false };
    assert.deepEqual(faceSwipeBarIntent(lastFull, 'next'), { type: 'noop' });
    assert.deepEqual(faceSwipeBarIntent(lastFull, 'prev'), { type: 'select', index: 3 });
    const overlay = { currentIndex: 0, canNext: false, canDelete: false, canResay: true, overlay: true };
    assert.deepEqual(faceSwipeBarIntent(overlay, 'prev'), { type: 'select', index: 0 });
    assert.deepEqual(faceSwipeBarIntent(overlay, 'next'), { type: 'resay' });
});
