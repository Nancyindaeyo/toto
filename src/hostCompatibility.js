import { recordTtSurface, ttSurfaceNow } from './ttSurfaceDiagnostics.js?rmv=1.5.53-cn-boundary1';
import { createRabbitMirrorHostCompatibility as createHostCompatibility } from './hostCompatibilityCore.js?rmv=1.5.58-fork1';

const COHORT = '1.5.58-fork1';
const rootUrl = new URL('../', import.meta.url).href;

// Adopt only this exact installation, host object and module cohort.
export function getRabbitMirrorEarlyBootstrap() {
    const entry = globalThis.__rabbitMirrorTtBootstrap;
    return entry?.cohort === COHORT && entry.rootUrl === rootUrl
        && entry.host === globalThis.__TAURITAVERN__ ? entry : null;
}

export function createRabbitMirrorHostCompatibility(hostGlobal = globalThis) {
    return createHostCompatibility(hostGlobal, { record: recordTtSurface, now: ttSurfaceNow });
}

const compatibility = getRabbitMirrorEarlyBootstrap()?.bridge || createRabbitMirrorHostCompatibility();
// A superseded in-flight core must not create a second participant or adopt
// another installation's leases when its own entry is no longer the owner.
if (globalThis.__rabbitMirrorTtBootstrap && !getRabbitMirrorEarlyBootstrap()) compatibility.dispose();
compatibility.attachDiagnostics({ record: recordTtSurface, now: ttSurfaceNow });
export const initRabbitMirrorHostCompatibility = () => compatibility.initialize();
export const isRabbitMirrorManagedChatSurface = () => compatibility.isManaged();
export const getRabbitMirrorHostCompatibilityStatus = () => compatibility.getStatus();
export const subscribeRabbitMirrorChatSurface = definition => compatibility.subscribe(definition);
export const getRabbitMirrorMountedMessages = () => compatibility.getMountedMessages();
export const getRabbitMirrorExternalPlacementParent = message => compatibility.externalPlacementParent(message);
export const applyRabbitMirrorHostSurface = (element, surface) => compatibility.applySurface(element, surface);
