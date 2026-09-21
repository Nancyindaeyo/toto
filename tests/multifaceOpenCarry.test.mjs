import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// mount.js pulls in the full SillyTavern host graph, so exercise the real function
// source standalone: externalFaceDetails + showMultifaceFace are self-contained.
function loadShowMultifaceFace() {
    const source = readFileSync(new URL('../src/independentApi/mount.js', import.meta.url), 'utf8');
    const faceMatch = source.match(/export function externalFaceDetails\(host\)\{[^}]*\}/);
    const showMatch = source.match(/export function showMultifaceFace\(host,index=0\)\{[\s\S]*?\r?\n\}/);
    assert.ok(faceMatch, 'externalFaceDetails source found');
    assert.ok(showMatch, 'showMultifaceFace source found');
    const context = vm.createContext({ console });
    context.globalThis = context;
    vm.runInContext(
        `${faceMatch[0].replace('export ', '')}\n${showMatch[0].replace('export ', '')}\n`
        + 'Object.assign(globalThis, { externalFaceDetails, showMultifaceFace });',
        context,
    );
    return context;
}

function fakeFace() {
    const attrs = new Map();
    return {
        tagName: 'DETAILS',
        style: {
            values: new Map(),
            setProperty(k, v) { this.values.set(k, v); },
            removeProperty(k) { this.values.delete(k); },
        },
        hasAttribute(name) { return attrs.has(name); },
        setAttribute(name, value) { attrs.set(name, String(value)); },
        removeAttribute(name) { attrs.delete(name); },
    };
}

function fakeHost(faces) {
    return { children: faces, dataset: {}, classList: { toggle() {} } };
}

test('face switch carries the expanded state to the incoming face', () => {
    const { showMultifaceFace } = loadShowMultifaceFace();
    const faces = [fakeFace(), fakeFace(), fakeFace()];
    const host = fakeHost(faces);
    host.dataset.rmFaceView = '0';
    faces[0].setAttribute('open', '');
    const next = showMultifaceFace(host, 1);
    assert.equal(next, 1);
    assert.equal(faces[1].hasAttribute('open'), true, 'incoming face must stay expanded');
    assert.equal(faces[0].hasAttribute('open'), false, 'outgoing face releases open');
    assert.equal(faces[2].hasAttribute('open'), false);
});

test('collapsed state also carries, and carries back', () => {
    const { showMultifaceFace } = loadShowMultifaceFace();
    const faces = [fakeFace(), fakeFace()];
    const host = fakeHost(faces);
    host.dataset.rmFaceView = '0';
    showMultifaceFace(host, 1);
    assert.equal(faces[1].hasAttribute('open'), false, 'collapsed stays collapsed');
    faces[1].setAttribute('open', '');
    showMultifaceFace(host, 0);
    assert.equal(faces[0].hasAttribute('open'), true, 'expanded carries back');
    assert.equal(faces[1].hasAttribute('open'), false);
});

test('same-index normalization never touches open', () => {
    const { showMultifaceFace } = loadShowMultifaceFace();
    const faces = [fakeFace(), fakeFace()];
    const host = fakeHost(faces);
    host.dataset.rmFaceView = '1';
    faces[1].setAttribute('open', '');
    showMultifaceFace(host, 1);
    assert.equal(faces[1].hasAttribute('open'), true);
    assert.equal(faces[0].hasAttribute('open'), false);
});

test('single-face hosts leave open untouched', () => {
    const { showMultifaceFace } = loadShowMultifaceFace();
    const faces = [fakeFace()];
    const host = fakeHost(faces);
    faces[0].setAttribute('open', '');
    showMultifaceFace(host, 0);
    assert.equal(faces[0].hasAttribute('open'), true);
});

test('toolsChrome keeps delete out of the pager bar and pins it top-right', () => {
    const source = readFileSync(new URL('../src/outputSanitizer/toolsChrome.js', import.meta.url), 'utf8');
    assert.match(source, /function installFaceSwipeDelete\(/);
    assert.match(source, /summary\.insertBefore\(del, summary\.firstElementChild\)/);
    const barHtml = source.match(/bar\.innerHTML = '([^']*)'/)?.[1] || '';
    assert.ok(barHtml.includes('data-rm-face-swipe="prev"'));
    assert.ok(barHtml.includes('data-rm-face-swipe="next"'));
    assert.ok(!barHtml.includes('data-rm-face-swipe="delete"'), 'pager bar must not contain the delete button');
    assert.match(source, /faceSwipeBarIntent\(current, 'delete'\)/);
});

test('persisted-HTML scrub strips the delete button (no storage leak)', () => {
    const geometry = readFileSync(new URL('../src/independentApi/geometry.js', import.meta.url), 'utf8');
    const selector = geometry.match(/PERSISTED_RUNTIME_UI_SELECTOR = '([^']*)'/)?.[1] || '';
    assert.ok(selector.includes('[data-rm-face-swipe-delete]'), 'delete button must be stripped before persisting');
    assert.ok(selector.includes('[data-rm-face-swipe-bar]'));
    const faceSwipe = readFileSync(new URL('../src/independentApi/faceSwipe.js', import.meta.url), 'utf8');
    assert.ok(faceSwipe.includes('[data-rm-face-swipe-delete]'));
});
