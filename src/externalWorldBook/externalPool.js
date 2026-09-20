const MIX_MODES = Object.freeze({
    BUILTIN_ONLY: 'builtin-only',
    BUILTIN_PREFERRED: 'builtin-preferred',
    BALANCED: 'balanced',
    EXTERNAL_PREFERRED: 'external-preferred',
    EXTERNAL_ONLY: 'external-only',
});

export const EXTERNAL_WORLD_BOOK_MIX_MODES = Object.freeze(Object.values(MIX_MODES));

const EXTERNAL_SHARE = Object.freeze({
    [MIX_MODES.BUILTIN_ONLY]: 0,
    [MIX_MODES.BUILTIN_PREFERRED]: 0.30,
    [MIX_MODES.BALANCED]: 0.50,
    [MIX_MODES.EXTERNAL_PREFERRED]: 0.80,
    [MIX_MODES.EXTERNAL_ONLY]: 1,
});

const EMPTY_SNAPSHOT = Object.freeze({
    libraries: Object.freeze([]),
    themesByLibrary: Object.freeze([]),
    formatsByLibrary: Object.freeze([]),
    textsByLibrary: Object.freeze([]),
    themeCount: 0,
    formatCount: 0,
    textCount: 0,
});

let snapshot = EMPTY_SNAPSHOT;
let snapshotRevision = 0;
const selectionKeys = new WeakMap();

// Computed alongside eligible-ID snapshot construction, never by reading raw
// material or scanning a library during directive-cache lookup. Commutative
// sums keep the key stable when IDB hydration returns the same IDs reordered.
export function getExternalPoolSelectionKey() {
    return selectionKeys.get(snapshot) || '0:0:0';
}

export const EXTERNAL_POOL_METADATA_VERSION = 1;

// Revision is process-local identity evidence, not a raw-content cache. An older
// metadata read must not overwrite a more recent import/enable/delete action.
export function getExternalPoolRevision() { return snapshotRevision; }

export function externalPoolMetadataForLibrary(library, entries = []) {
    const libraryId = cleanId(library?.libraryId, 1024);
    const light = buildExternalPoolSnapshot([{ libraryId, enabled: true }], new Map([[libraryId, entries]]));
    return {
        libraryId,
        schemaVersion: EXTERNAL_POOL_METADATA_VERSION,
        enabled: library?.enabled === true,
        themeIds: [...(light.themesByLibrary[0]?.ids || [])],
        formatIds: [...(light.formatsByLibrary[0]?.ids || [])],
        ...(light.textCount ? { textIds: [...light.textsByLibrary[0].ids] } : {}),
    };
}

export function validExternalPoolMetadata(record, libraryId) {
    return record?.schemaVersion === EXTERNAL_POOL_METADATA_VERSION
        && record.libraryId === libraryId
        && Array.isArray(record.themeIds) && Array.isArray(record.formatIds)
        && record.themeIds.every(id => typeof id === 'string' && cleanId(id) === id && id.startsWith(`ext:${libraryId}:theme:`))
        && record.formatIds.every(id => typeof id === 'string' && cleanId(id) === id && id.startsWith(`ext:${libraryId}:format:`))
        && (record.textIds === undefined || (Array.isArray(record.textIds) && record.textIds.every(id => typeof id === 'string' && cleanId(id) === id && id.startsWith(`ext:${libraryId}:text:`))));
}

export function setExternalPoolMetadataSnapshot(libraries = [], metadata = []) {
    const byLibrary = new Map((Array.isArray(metadata) ? metadata : []).map(record => [record?.libraryId, record]));
    const entriesByLibrary = new Map();
    for (const library of Array.isArray(libraries) ? libraries : []) {
        const record = byLibrary.get(library?.libraryId);
        if (!validExternalPoolMetadata(record, library?.libraryId)) continue;
        entriesByLibrary.set(library.libraryId, [
            ...record.themeIds.map(externalId => ({ externalId, classification: 'theme', enabled: true, userConfirmed: true })),
            ...record.formatIds.map(externalId => ({ externalId, classification: 'format', enabled: true, userConfirmed: true })),
            ...(record.textIds || []).map(externalId => ({ externalId, classification: 'text', enabled: true, userConfirmed: true })),
        ]);
    }
    return setExternalPoolSnapshot(libraries, entriesByLibrary);
}

function cleanId(value, max = 2048) {
    const text = String(value ?? '').trim();
    return text && text.length <= max ? text : '';
}

function eligibleClassification(value) {
    const text = String(value || '').trim();
    return text === 'theme' || text === 'format' || text === 'text' ? text : '';
}

function lightweightEntry(entry, libraryId, classification) {
    const id = cleanId(entry?.externalId);
    if (!id || !id.startsWith('ext:')) return null;
    return Object.freeze({ id, libraryId, classification });
}

export function buildExternalPoolSnapshot(libraries = [], entriesByLibrary = new Map()) {
    const enabledLibraries = [];
    const themesByLibrary = [];
    const formatsByLibrary = [];
    const textsByLibrary = [];
    let themeCount = 0;
    let formatCount = 0;
    let textCount = 0;
    let selectionFirst = 0;
    let selectionSecond = 0;

    for (const rawLibrary of Array.isArray(libraries) ? libraries : []) {
        const libraryId = cleanId(rawLibrary?.libraryId, 1024);
        if (!libraryId || rawLibrary?.enabled !== true) continue;
        const sourceEntries = entriesByLibrary instanceof Map
            ? entriesByLibrary.get(libraryId)
            : entriesByLibrary?.[libraryId];
        const themeIds = [];
        const formatIds = [];
        const textIds = [];
        const seen = new Set();
        for (const entry of Array.isArray(sourceEntries) ? sourceEntries : []) {
            if (entry?.enabled !== true || entry?.userConfirmed !== true) continue;
            const classification = eligibleClassification(entry?.classification);
            if (!classification) continue;
            const light = lightweightEntry(entry, libraryId, classification);
            if (!light || seen.has(light.id)) continue;
            seen.add(light.id);
            let first = 2166136261;
            let second = 5381;
            const identity = `${libraryId}\u0000${classification}\u0000${light.id}`;
            for (let index = 0; index < identity.length; index += 1) {
                const code = identity.charCodeAt(index);
                first = Math.imul(first ^ code, 16777619);
                second = Math.imul(second, 33) ^ code;
            }
            selectionFirst = (selectionFirst + (first >>> 0)) >>> 0;
            selectionSecond = (selectionSecond + (second >>> 0)) >>> 0;
            if (classification === 'theme') themeIds.push(light.id);
            else if (classification === 'text') textIds.push(light.id);
            else formatIds.push(light.id);
        }
        if (!themeIds.length && !formatIds.length && !textIds.length) continue;
        enabledLibraries.push(Object.freeze({ libraryId }));
        if (themeIds.length) {
            themesByLibrary.push(Object.freeze({ libraryId, ids: Object.freeze(themeIds) }));
            themeCount += themeIds.length;
        }
        if (textIds.length) {
            textsByLibrary.push(Object.freeze({ libraryId, ids: Object.freeze(textIds) }));
            textCount += textIds.length;
        }
        if (formatIds.length) {
            formatsByLibrary.push(Object.freeze({ libraryId, ids: Object.freeze(formatIds) }));
            formatCount += formatIds.length;
        }
    }

    const result = Object.freeze({
        libraries: Object.freeze(enabledLibraries),
        themesByLibrary: Object.freeze(themesByLibrary),
        formatsByLibrary: Object.freeze(formatsByLibrary),
        textsByLibrary: Object.freeze(textsByLibrary),
        textCount,
        themeCount,
        formatCount,
    });
    selectionKeys.set(result, `${themeCount + formatCount + textCount}:${selectionFirst.toString(36)}:${selectionSecond.toString(36)}`);
    return result;
}

export function setExternalPoolSnapshot(libraries = [], entriesByLibrary = new Map()) {
    snapshot = buildExternalPoolSnapshot(libraries, entriesByLibrary);
    snapshotRevision += 1;
    return snapshot;
}

export function setExternalPoolSnapshotObject(nextSnapshot) {
    if (!nextSnapshot || typeof nextSnapshot !== 'object') {
        return clearExternalPoolSnapshot();
    }
    const libraries = Array.isArray(nextSnapshot.libraries) ? nextSnapshot.libraries : [];
    const entriesByLibrary = new Map();
    for (const library of libraries) {
        const libraryId = cleanId(library?.libraryId, 1024);
        if (!libraryId) continue;
        const entries = [];
        for (const id of Array.isArray(library?.themeIds) ? library.themeIds : []) {
            entries.push({ externalId: id, classification: 'theme', enabled: true, userConfirmed: true });
        }
        for (const id of Array.isArray(library?.formatIds) ? library.formatIds : []) {
            entries.push({ externalId: id, classification: 'format', enabled: true, userConfirmed: true });
        }
        for (const id of Array.isArray(library?.textIds) ? library.textIds : []) {
            entries.push({ externalId: id, classification: 'text', enabled: true, userConfirmed: true });
        }
        entriesByLibrary.set(libraryId, entries);
    }
    return setExternalPoolSnapshot(libraries.map(item => ({ ...item, enabled: item?.enabled !== false })), entriesByLibrary);
}

export function clearExternalPoolSnapshot() {
    snapshot = EMPTY_SNAPSHOT;
    snapshotRevision += 1;
    return snapshot;
}

export function getExternalPoolSnapshot() {
    return snapshot;
}

export function externalPoolItem(externalId, kind) {
    const id = cleanId(externalId);
    const classification = eligibleClassification(kind);
    if (!id || !classification) return null;
    return Object.freeze({ id, group: '', tags: Object.freeze([]), externalKind: classification });
}

function kindLibraries(kind) {
    if (kind === 'text') return snapshot.textsByLibrary;
    if (kind === 'presentation') {
        const combined = new Map();
        for (const library of [...snapshot.formatsByLibrary, ...snapshot.textsByLibrary]) {
            const ids = combined.get(library.libraryId) || [];
            combined.set(library.libraryId, [...ids, ...library.ids]);
        }
        return [...combined].map(([libraryId, ids]) => ({ libraryId, ids }));
    }
    return kind === 'format' ? snapshot.formatsByLibrary : snapshot.themesByLibrary;
}

export function externalPoolEligibleCount(kind) {
    return kind === 'text' ? snapshot.textCount : kind === 'presentation' ? snapshot.formatCount + snapshot.textCount : kind === 'format' ? snapshot.formatCount : snapshot.themeCount;
}

export function externalPoolActive(settings, kind) {
    if (settings?.externalWorldBookRandomEnabled !== true) return false;
    const mode = String(settings?.externalWorldBookMixMode || MIX_MODES.BUILTIN_ONLY);
    if (mode === MIX_MODES.BUILTIN_ONLY || !(mode in EXTERNAL_SHARE)) return false;
    return externalPoolEligibleCount(kind) > 0;
}

export function externalShareForMode(mode) {
    const key = String(mode || MIX_MODES.BUILTIN_ONLY);
    return Object.prototype.hasOwnProperty.call(EXTERNAL_SHARE, key) ? EXTERNAL_SHARE[key] : 0;
}

export function chooseExternalSource(settings, kind, randomUnit, builtinAvailable = true) {
    if (!externalPoolActive(settings, kind)) return false;
    const mode = String(settings?.externalWorldBookMixMode || MIX_MODES.BUILTIN_ONLY);
    if (mode === MIX_MODES.EXTERNAL_ONLY || !builtinAvailable) return true;
    const share = externalShareForMode(mode);
    if (share <= 0) return false;
    if (share >= 1) return true;
    return Number(randomUnit?.() ?? 0) < share;
}

function filteredLibraryPools(kind, hardExcludedIds = [], recentIds = [], avoidRepeat = true, preferredExcludedIds = [], recentIdHits = {}) {
    const hard = new Set(Array.isArray(hardExcludedIds) ? hardExcludedIds : []);
    const recent = new Set(Array.isArray(recentIds) ? recentIds : []);
    let base = kindLibraries(kind).map(library => ({
        libraryId: library.libraryId,
        ids: library.ids.filter(id => !hard.has(id)),
    })).filter(library => library.ids.length);
    // Prior attempts are cooldown preferences, not permanent exclusions. Keep
    // strict same-batch/user exclusions in base even when cooldown is exhausted.
    // This is candidate ranking within one draw, never a second plan/request.
    const preferred = new Set(Array.isArray(preferredExcludedIds) ? preferredExcludedIds : []);
    if (preferred.size) {
        const untried = base.map(library => ({ ...library, ids: library.ids.filter(id => !preferred.has(id)) }))
            .filter(library => library.ids.length);
        if (untried.length) base = untried;
    }
    if (!avoidRepeat || !recent.size) return base;
    const fresh = base.map(library => ({
        libraryId: library.libraryId,
        ids: library.ids.filter(id => !recent.has(id)),
    })).filter(library => library.ids.length);
    if (fresh.length) return fresh;
    // All eligible entries are in cooldown. Reuse is allowed, but do not erase
    // their different hit counts. Only use existing bounded history; no raw
    // worldbook reads, persistent fairness ledger, redraw or extra entropy.
    const weighted = base.map(library => {
        const weights = library.ids.map(id => {
            const value = Number(Object.prototype.hasOwnProperty.call(recentIdHits, id) ? recentIdHits[id] : 1);
            const hits = Number.isFinite(value) ? Math.min(1000, Math.max(1, value)) : 1;
            return 1 / ((1 + hits) ** 2);
        });
        return { ...library, weights, meanWeight: weights.reduce((sum, weight) => sum + weight, 0) / weights.length };
    });
    // Exact legacy distribution and index boundaries when counts are tied or
    // absent (including older history). Differing libraries must share the bias.
    const firstWeight = weighted[0]?.weights[0];
    return weighted.every(library => library.weights.every(weight => weight === firstWeight)) ? base : weighted;
}

function weightedLibraryPick(libraries, randomUnit) {
    if (!libraries.length) return null;
    const weighted = libraries.map(library => ({
        library,
        weight: Math.sqrt(Math.max(1, library.ids.length)) * (library.meanWeight ?? 1),
    }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Number(randomUnit?.() ?? 0) * total;
    for (const item of weighted) {
        roll -= item.weight;
        if (roll <= 0) return item.library;
    }
    return weighted[weighted.length - 1]?.library || null;
}

export function externalPoolHasAvailable(kind, excludedIds = []) {
    const excluded = new Set(Array.isArray(excludedIds) ? excludedIds : []);
    return kindLibraries(kind).some(library => library.ids.some(id => !excluded.has(id)));
}

export function pickExternalItems(settings, kind, count, options = {}) {
    const target = Math.max(0, Math.floor(Number(count) || 0));
    if (!target || !externalPoolActive(settings, kind)) return [];
    const randomUnit = options.randomUnit;
    const recentIds = Array.isArray(options.recentIds) ? options.recentIds : [];
    const hardExcluded = new Set(Array.isArray(options.hardExcludedIds) ? options.hardExcludedIds : []);
    const selected = [];

    while (selected.length < target) {
        const dynamicHard = [...hardExcluded, ...selected.map(item => item.id)];
        const libraries = filteredLibraryPools(kind, dynamicHard, recentIds, options.avoidRepeat !== false, options.preferredExcludedIds, options.recentIdHits || {});
        if (!libraries.length) break;
        const library = weightedLibraryPick(libraries, randomUnit);
        if (!library?.ids?.length) break;
        const roll = Number(randomUnit?.() ?? 0);
        let index = Math.min(library.ids.length - 1, Math.floor(roll * library.ids.length));
        if (library.weights) {
            let remaining = roll * library.weights.reduce((sum, weight) => sum + weight, 0);
            index = library.ids.length - 1;
            for (let i = 0; i < library.weights.length; i++) {
                remaining -= library.weights[i];
                if (remaining < 0) { index = i; break; }
            }
        }
        const selectedId = library.ids[index];
        const selectedKind = kind === 'presentation' ? (snapshot.textsByLibrary.some(pool => pool.libraryId === library.libraryId && pool.ids.includes(selectedId)) ? 'text' : 'format') : kind;
        const item = externalPoolItem(selectedId, selectedKind);
        if (!item) break;
        selected.push(item);
    }
    return selected;
}

export function sourceMixModeIsExternalOnly(settings) {
    return String(settings?.externalWorldBookMixMode || '') === MIX_MODES.EXTERNAL_ONLY;
}

function snapshotLibraryRecords() {
    const map = new Map();
    for (const library of snapshot.libraries) map.set(library.libraryId, { libraryId: library.libraryId, enabled: true });
    return map;
}

function snapshotEntryRecords() {
    const map = new Map();
    for (const library of snapshot.themesByLibrary) {
        const rows = map.get(library.libraryId) || [];
        for (const id of library.ids) rows.push({ externalId: id, classification: 'theme', enabled: true, userConfirmed: true });
        map.set(library.libraryId, rows);
    }
    for (const library of snapshot.formatsByLibrary) {
        const rows = map.get(library.libraryId) || [];
        for (const id of library.ids) rows.push({ externalId: id, classification: 'format', enabled: true, userConfirmed: true });
        map.set(library.libraryId, rows);
    }
    for (const library of snapshot.textsByLibrary) {
        const rows = map.get(library.libraryId) || [];
        for (const id of library.ids) rows.push({ externalId: id, classification: 'text', enabled: true, userConfirmed: true });
        map.set(library.libraryId, rows);
    }
    return map;
}

export function upsertExternalPoolLibrary(library, entries = []) {
    const libraryId = cleanId(library?.libraryId, 1024);
    if (!libraryId) return snapshot;
    const libraries = snapshotLibraryRecords();
    const entriesByLibrary = snapshotEntryRecords();
    libraries.set(libraryId, { libraryId, enabled: library?.enabled === true });
    entriesByLibrary.set(libraryId, Array.isArray(entries) ? entries : []);
    snapshot = buildExternalPoolSnapshot([...libraries.values()], entriesByLibrary);
    snapshotRevision += 1;
    return snapshot;
}

// Explicit bulk imports publish once, after the caller's durable transaction.
// Keep the single-library API unchanged. Build against local maps first so a
// malformed update cannot partly publish, reset an old snapshot or advance its
// revision. Only eligible IDs survive; this module has no raw-content cache.
export function upsertExternalPoolLibraries(updates = []) {
    if (!Array.isArray(updates) || !updates.length) return snapshot;
    const libraries = snapshotLibraryRecords();
    const entriesByLibrary = snapshotEntryRecords();
    let changed = false;
    for (const update of updates) {
        const libraryId = cleanId(update?.library?.libraryId, 1024);
        if (!libraryId) continue;
        const library = { libraryId, enabled: update.library.enabled === true };
        const entries = Array.isArray(update.entries) ? update.entries : [];
        const light = buildExternalPoolSnapshot([library], new Map([[libraryId, entries]]));
        // Match sequential upserts even if a batch disables/removes eligibility
        // and later re-enables the same ID: it re-enters at the end of the pool.
        if (light.libraries.length) {
            libraries.set(libraryId, library);
            entriesByLibrary.set(libraryId, entries);
        } else {
            libraries.delete(libraryId);
            entriesByLibrary.delete(libraryId);
        }
        changed = true;
    }
    if (!changed) return snapshot;
    const next = buildExternalPoolSnapshot([...libraries.values()], entriesByLibrary);
    snapshot = next;
    snapshotRevision += 1;
    return snapshot;
}

export function removeExternalPoolLibrary(libraryId) {
    const id = cleanId(libraryId, 1024);
    if (!id) return snapshot;
    const libraries = snapshotLibraryRecords();
    const entriesByLibrary = snapshotEntryRecords();
    libraries.delete(id);
    entriesByLibrary.delete(id);
    snapshot = buildExternalPoolSnapshot([...libraries.values()], entriesByLibrary);
    snapshotRevision += 1;
    return snapshot;
}
