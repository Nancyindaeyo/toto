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

export function faceSwipeKey(slot, faceIndex = 0) {
    const index = Number.isInteger(faceIndex) && faceIndex >= 0 ? faceIndex : 0;
    return `${String(slot || '')}\u0000${index}`;
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

function readStore() {
    try {
        const raw = JSON.parse(globalThis.localStorage?.getItem(STORE_KEY) || 'null');
        if (!raw || typeof raw !== 'object' || !raw.faces || typeof raw.faces !== 'object') return emptyStore();
        return { schema: STORE_SCHEMA, faces: raw.faces };
    } catch {
        return emptyStore();
    }
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

export function readFaceSwipe(slot, faceIndex = 0) {
    const key = faceSwipeKey(slot, faceIndex);
    return normalizeSwipeState(readStore().faces[key]);
}

export function writeFaceSwipe(slot, faceIndex, state) {
    const key = faceSwipeKey(slot, faceIndex);
    const normalized = normalizeSwipeState(state);
    const store = readStore();
    if (!normalized.versions.length) delete store.faces[key];
    else store.faces[key] = normalized;
    writeStore(store);
    return normalized;
}

export function mutateFaceSwipe(slot, faceIndex, mutator) {
    const current = readFaceSwipe(slot, faceIndex);
    const result = mutator(current);
    if (!result?.ok || !result.state) return result || { ok: false, reason: 'invalid', state: current };
    return { ...result, state: writeFaceSwipe(slot, faceIndex, result.state) };
}
