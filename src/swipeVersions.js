export const FACE_SWIPE_MAX = 5;
export const FACE_SWIPE_FULL_MESSAGE = '已满五版，请先删一版再重说';
const STORE_KEY = 'rabbit_mirror_face_swipes_v1';
const STORE_SCHEMA = 1;
const STACK_LIMIT = 80;
const ENTRY_MAX_CHARS = 400 * 1024;

function hashText(text = '') {
    let h = 2166136261;
    for (const ch of String(text)) {
        h ^= ch.charCodeAt(0);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
}

// Versions belong to the chat message swipe, not a source-hash snapshot.
// Resay remounts often change the fingerprint; hashed slots used to orphan
// the stack and re-seed the new HTML as 1/1.
export function faceSwipeStorageSlot(slot = '') {
    const text = String(slot || '');
    const match = text.match(/:(\d+):(\d+):([0-9a-f]{8,64})$/i);
    return match ? text.slice(0, -(match[3].length + 1)) : text;
}

export function faceSwipeKey(slot, faceIndex = 0) {
    const index = Number.isInteger(faceIndex) && faceIndex >= 0 ? faceIndex : 0;
    return `${faceSwipeStorageSlot(slot)}\u0000${index}`;
}

export function emptySwipeState() {
    return { versions: [], currentIndex: 0, touched: 0 };
}

export function normalizeSwipeEntry(value) {
    const html = String(value?.html || '').trim();
    if (!html || html.length > ENTRY_MAX_CHARS) return null;
    const initialHtml = String(value?.initialHtml || html).trim() || html;
    if (initialHtml.length > ENTRY_MAX_CHARS) return null;
    return {
        id: String(value?.id || hashText(html)),
        html,
        initialHtml,
        ts: Number(value?.ts || Date.now()) || Date.now(),
    };
}

export function normalizeSwipeState(value) {
    const versions = (Array.isArray(value?.versions) ? value.versions : [])
        .map(normalizeSwipeEntry)
        .filter(Boolean)
        .slice(0, FACE_SWIPE_MAX);
    if (!versions.length) return emptySwipeState();
    const currentIndex = Math.max(0, Math.min(versions.length - 1, Number(value?.currentIndex) || 0));
    return {
        versions,
        currentIndex,
        touched: Number(value?.touched || versions[currentIndex]?.ts || Date.now()) || Date.now(),
    };
}

export function currentSwipeEntry(state) {
    const normalized = normalizeSwipeState(state);
    return normalized.versions[normalized.currentIndex] || null;
}

export function canAppendSwipe(state) {
    return normalizeSwipeState(state).versions.length < FACE_SWIPE_MAX;
}

export function swipeFullMessage() {
    return FACE_SWIPE_FULL_MESSAGE;
}

// Title ‹ › at the ends mean 重说, not a dead control. Overlay prev remounts
// the last success; next at the last slot (or 1/1) pays for a new version.
export function fallbackFaceSwipeView() {
    return {
        count: 1,
        currentIndex: 0,
        overlay: false,
        label: '1/1',
        canPrev: false,
        canNext: false,
        canDelete: false,
        canResay: true,
        full: false,
    };
}

export function multifaceFacePagerView(faceCount, currentIndex, overlay = false) {
    const count = Math.max(1, Number(faceCount) || 1);
    const index = Math.max(0, Math.min(count - 1, Number(currentIndex) || 0));
    return {
        count,
        currentIndex: index,
        overlay: overlay === true,
        label: `${index + 1}/${count}`,
        canPrev: overlay === true || index > 0,
        canNext: index < count - 1,
        canDelete: false,
        canResay: true,
        full: false,
    };
}

export function faceSwipeBarIntent(view, action) {
    if (!view || !action) return { type: 'noop' };
    if (action === 'delete') return view.canDelete ? { type: 'delete' } : { type: 'noop' };
    if (action === 'prev') {
        if (view.overlay) return { type: 'select', index: view.currentIndex };
        if (view.currentIndex > 0) return { type: 'select', index: view.currentIndex - 1 };
        return view.canResay ? { type: 'resay' } : { type: 'noop' };
    }
    if (action === 'next') {
        if (view.canNext) return { type: 'select', index: view.currentIndex + 1 };
        return view.canResay ? { type: 'resay' } : { type: 'noop' };
    }
    return { type: 'noop' };
}

export function seedSwipeState(state, entry) {
    const normalized = normalizeSwipeState(state);
    if (normalized.versions.length) return { ok: true, seeded: false, state: normalized };
    const next = appendSuccessfulSwipe(normalized, entry);
    return next.ok ? { ok: true, seeded: true, state: next.state } : next;
}

export function appendSuccessfulSwipe(state, entry) {
    const normalized = normalizeSwipeState(state);
    const item = normalizeSwipeEntry(entry);
    if (!item) return { ok: false, reason: 'invalid' };
    if (normalized.versions.length >= FACE_SWIPE_MAX) {
        return { ok: false, reason: 'full', state: normalized, message: FACE_SWIPE_FULL_MESSAGE };
    }
    const versions = [...normalized.versions, item];
    return {
        ok: true,
        state: {
            versions,
            currentIndex: versions.length - 1,
            touched: Date.now(),
        },
    };
}

export function selectSwipeIndex(state, index) {
    const normalized = normalizeSwipeState(state);
    if (!normalized.versions.length) return { ok: false, reason: 'empty', state: normalized };
    const nextIndex = Math.max(0, Math.min(normalized.versions.length - 1, Number(index)));
    if (!Number.isInteger(nextIndex)) return { ok: false, reason: 'invalid', state: normalized };
    return {
        ok: true,
        state: { ...normalized, currentIndex: nextIndex, touched: Date.now() },
    };
}

export function deleteCurrentSwipe(state) {
    const normalized = normalizeSwipeState(state);
    if (normalized.versions.length <= 1) {
        return { ok: false, reason: 'last', state: normalized };
    }
    const removed = normalized.currentIndex;
    const versions = normalized.versions.filter((_, index) => index !== removed);
    const currentIndex = removed === 0 ? 0 : removed - 1;
    return {
        ok: true,
        state: {
            versions,
            currentIndex: Math.max(0, Math.min(versions.length - 1, currentIndex)),
            touched: Date.now(),
        },
    };
}

export function updateCurrentSwipeHtml(state, html) {
    const normalized = normalizeSwipeState(state);
    const current = normalized.versions[normalized.currentIndex];
    const nextHtml = String(html || '').trim();
    if (!current || !nextHtml || nextHtml.length > ENTRY_MAX_CHARS) {
        return { ok: false, reason: 'invalid', state: normalized };
    }
    const versions = normalized.versions.map((entry, index) => (
        index === normalized.currentIndex
            ? { ...entry, html: nextHtml, id: hashText(nextHtml), ts: Date.now() }
            : entry
    ));
    return { ok: true, state: { ...normalized, versions, touched: Date.now() } };
}

export function restoreCurrentSwipeInitial(state) {
    const normalized = normalizeSwipeState(state);
    const current = normalized.versions[normalized.currentIndex];
    if (!current?.initialHtml) return { ok: false, reason: 'empty', state: normalized };
    return updateCurrentSwipeHtml(normalized, current.initialHtml);
}

function emptyStore() {
    return { schema: STORE_SCHEMA, faces: {} };
}

let memoryStore = null;

function cloneStore(store) {
    return { schema: STORE_SCHEMA, faces: { ...(store?.faces || {}) } };
}

function readStore() {
    if (memoryStore) return cloneStore(memoryStore);
    try {
        const raw = JSON.parse(globalThis.localStorage?.getItem(STORE_KEY) || 'null');
        if (raw && typeof raw === 'object' && raw.faces && typeof raw.faces === 'object') {
            memoryStore = { schema: STORE_SCHEMA, faces: { ...raw.faces } };
            return cloneStore(memoryStore);
        }
    } catch {}
    memoryStore = emptyStore();
    return cloneStore(memoryStore);
}

export function resetFaceSwipeStoreForTests() {
    memoryStore = null;
}

function compactStore(store) {
    const next = emptyStore();
    const stacks = Object.entries(store.faces || {})
        .map(([key, value]) => [key, normalizeSwipeState(value)])
        .filter(([, state]) => state.versions.length)
        .sort((a, b) => Number(b[1].touched || 0) - Number(a[1].touched || 0))
        .slice(0, STACK_LIMIT);
    for (const [key, state] of stacks) next.faces[key] = state;
    return next;
}

function writeStore(store) {
    const compacted = compactStore(store);
    memoryStore = compacted;
    try {
        globalThis.localStorage?.setItem(STORE_KEY, JSON.stringify(compacted));
        return true;
    } catch {
        const keys = Object.keys(compacted.faces);
        while (keys.length > 1) {
            keys.pop();
            const retry = emptyStore();
            for (const key of keys) retry.faces[key] = compacted.faces[key];
            try {
                globalThis.localStorage?.setItem(STORE_KEY, JSON.stringify(retry));
                return true;
            } catch {}
        }
        return false;
    }
}

export function compactFaceSwipeStoreForQuota() {
    const store = readStore();
    const stacks = Object.entries(store.faces || {})
        .map(([key, value]) => [key, normalizeSwipeState(value)])
        .filter(([, state]) => state.versions.length)
        .sort((a, b) => Number(b[1].touched || 0) - Number(a[1].touched || 0));
    for (const limit of [40, 20, 10, 5, 1]) {
        const next = emptyStore();
        for (const [key, state] of stacks.slice(0, limit)) next.faces[key] = state;
        memoryStore = next;
        try {
            globalThis.localStorage?.setItem(STORE_KEY, JSON.stringify(next));
            return true;
        } catch {}
    }
    return false;
}

function matchingSwipeKeys(store, slot, faceIndex = 0) {
    const suffix = `\u0000${Number.isInteger(faceIndex) && faceIndex >= 0 ? faceIndex : 0}`;
    const base = faceSwipeStorageSlot(slot);
    const preferred = `${base}${suffix}`;
    const keys = [];
    if (store.faces?.[preferred]) keys.push(preferred);
    for (const key of Object.keys(store.faces || {})) {
        if (key === preferred || !key.endsWith(suffix)) continue;
        const slotPart = key.slice(0, -suffix.length);
        const hash = slotPart.startsWith(`${base}:`) ? slotPart.slice(base.length + 1) : '';
        if (slotPart === base || /^[0-9a-f]{8,64}$/i.test(hash)) keys.push(key);
    }
    return keys;
}

export function readFaceSwipe(slot, faceIndex = 0) {
    const store = readStore();
    let best = emptySwipeState();
    for (const key of matchingSwipeKeys(store, slot, faceIndex)) {
        const state = normalizeSwipeState(store.faces[key]);
        if (
            state.versions.length > best.versions.length
            || (state.versions.length === best.versions.length && state.versions.length && Number(state.touched || 0) > Number(best.touched || 0))
        ) {
            best = state;
        }
    }
    return best;
}

export function writeFaceSwipe(slot, faceIndex, state) {
    const storageKey = faceSwipeKey(slot, faceIndex);
    const normalized = normalizeSwipeState(state);
    const store = readStore();
    for (const key of matchingSwipeKeys(store, slot, faceIndex)) {
        if (key !== storageKey) delete store.faces[key];
    }
    if (!normalized.versions.length) delete store.faces[storageKey];
    else store.faces[storageKey] = normalized;
    writeStore(store);
    return normalized;
}

export function mutateFaceSwipe(slot, faceIndex, mutator) {
    const current = readFaceSwipe(slot, faceIndex);
    const result = mutator(current);
    if (!result?.ok || !result.state) return result || { ok: false, reason: 'invalid', state: current };
    return { ...result, state: writeFaceSwipe(slot, faceIndex, result.state) };
}
