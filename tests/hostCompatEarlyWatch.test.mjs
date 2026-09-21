// Regression: iOS deferred load races — extension evaluates before the TT ABI,
// and TT's first chat projection freezes registration before the heavy graph's
// first subscribe. The early host watch must register within ~50ms of the ABI
// appearing. See hostCompatibilityCore.js scheduleEarlyHostWatch().
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRabbitMirrorHostCompatibility } from '../src/hostCompatibilityCore.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function fakeHostGlobal() {
    return { setTimeout: setTimeout.bind(globalThis), clearTimeout: clearTimeout.bind(globalThis) };
}

function fakeChatSurfaceApi({ frozen = () => false } = {}) {
    return {
        protocolVersion: 1,
        isManagedOwnershipRequired: () => true,
        registerParticipant(def) {
            if (frozen()) throw new Error('must register before the first projection');
            return { id: def.id };
        },
    };
}

test('early watch registers when ABI appears after evaluation, before first projection', async () => {
    const hostGlobal = fakeHostGlobal();
    let projected = false;
    // ABI appears at ~100ms; first projection (freeze) at ~400ms.
    setTimeout(() => { hostGlobal.__TAURITAVERN__ = { api: { chatSurface: fakeChatSurfaceApi({ frozen: () => projected }) } }; }, 100);
    setTimeout(() => { projected = true; }, 400);

    const compat = createRabbitMirrorHostCompatibility(hostGlobal);
    const s0 = compat.initialize(); // evaluation-time: no host yet
    assert.equal(s0.registered, false);

    await sleep(300); // watch polls every 50ms — must catch ABI at ~100-150ms
    const status = compat.getStatus();
    compat.dispose();
    assert.equal(status.registered, true);
    assert.equal(status.errorCode, '');
    assert.equal(status.projectionFallback, false);
});

test('late-projection still reports failure and starts visible fallback', async () => {
    const hostGlobal = fakeHostGlobal();
    hostGlobal.__TAURITAVERN__ = { api: { chatSurface: fakeChatSurfaceApi({ frozen: () => true }) } };
    const compat = createRabbitMirrorHostCompatibility(hostGlobal);
    const status = compat.initialize();
    assert.equal(status.registered, false);
    assert.equal(status.errorCode, 'CHAT_SURFACE_REGISTRATION_FAILED');
    assert.equal(status.registrationFailure, 'late-projection');
    compat.dispose();
});

test('dispose stops the early watch (no registration after teardown)', async () => {
    const hostGlobal = fakeHostGlobal();
    const compat = createRabbitMirrorHostCompatibility(hostGlobal);
    compat.initialize();
    compat.dispose();
    hostGlobal.__TAURITAVERN__ = { api: { chatSurface: fakeChatSurfaceApi() } };
    await sleep(200);
    assert.equal(compat.getStatus().registered, false);
});

test('api-incomplete pass does not latch: retry registers once ABI completes', async () => {
    const hostGlobal = fakeHostGlobal();
    // Host global exists but chatSurface ABI is not yet populated (iOS race window).
    hostGlobal.__TAURITAVERN__ = { api: {} };
    const compat = createRabbitMirrorHostCompatibility(hostGlobal);
    const s0 = compat.initialize();
    assert.equal(s0.registered, false);
    setTimeout(() => { hostGlobal.__TAURITAVERN__.api.chatSurface = fakeChatSurfaceApi(); }, 100);
    await sleep(300);
    const status = compat.getStatus();
    compat.dispose();
    assert.equal(status.registered, true);
});

test('TT host before ABI latch still places inside .mes_block, not as a #chat sibling', () => {
    const hostGlobal = fakeHostGlobal();
    hostGlobal.__TAURITAVERN__ = { api: {} };
    const mesBlock = { id: 'mes-block' };
    const mesText = { parentElement: mesBlock };
    const mes = {
        querySelector(sel) {
            if (sel === '.mes_text') return mesText;
            if (sel === '.mes_block') return mesBlock;
            return null;
        },
        contains(node) { return node === mesText || node === mesBlock; },
    };
    mesBlock.parentElement = mes;
    const compat = createRabbitMirrorHostCompatibility(hostGlobal);
    const status = compat.initialize();
    assert.equal(status.registered, false);
    assert.equal(compat.isManaged(), false);
    assert.equal(compat.externalPlacementParent(mes), mesBlock);
    compat.dispose();
});
