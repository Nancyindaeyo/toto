import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import test, { afterEach } from 'node:test';
import { THEMATIC_CATEGORIES } from '../data/structured/thematicIndex.js';
import { PRESENTATION_FORMATS } from '../data/structured/presentationIndex.js';

const HISTORY = 'rabbit_mirror_theater:last_combo:v11';
const LEGACY = 'rabbit_mirror_theater:pending_batch_registry:v2';
const REGISTRY = 'rabbit_mirror_theater:pending_batch_registry:v3';
const ATTEMPTS = 'rabbit_mirror_theater:generation_attempts:v1';
const FAIRNESS = 'rabbit_mirror_theater:format_eligible_misses:v1';
const originalStorage = globalThis.localStorage;
afterEach(() => { globalThis.localStorage = originalStorage; });
const clone = value => JSON.parse(JSON.stringify(value));
let moduleSequence = 0;
async function freshStorageModule(url = new URL('../src/storage.js', import.meta.url)) {
    const fresh = new URL(url);
    fresh.searchParams.set('storage-test-instance', String(++moduleSequence));
    return import(fresh.href);
}

// Quotas intentionally count UTF-16 code units, including keys, rather than
// claiming to reproduce any particular browser's opaque quota accounting.
class QuotaStorage {
    constructor(entries = [], limit = Infinity) {
        this.data = new Map(entries);
        this.limit = limit;
        this.operations = [];
        this.rejectOnce = null;
    }
    get length() { return this.data.size; }
    key(index) { return [...this.data.keys()][index] ?? null; }
    getItem(key) { return this.data.get(String(key)) ?? null; }
    get used() { return [...this.data].reduce((sum, [key, value]) => sum + key.length + value.length, 0); }
    snapshot() { return [...this.data].sort(([a], [b]) => a.localeCompare(b)); }
    setItem(key, value) {
        key = String(key); value = String(value);
        const before = this.data.get(key);
        const nextUsage = this.used - (before === undefined ? 0 : key.length + before.length) + key.length + value.length;
        const forced = this.rejectOnce?.(key, value) === true;
        if (forced) this.rejectOnce = null;
        const rejected = forced || nextUsage > this.limit;
        this.operations.push({ operation: 'set', key, rejected });
        if (rejected) throw new DOMException('simulated site quota', 'QuotaExceededError');
        this.data.set(key, value);
    }
    removeItem(key) {
        this.operations.push({ operation: 'remove', key: String(key) });
        this.data.delete(String(key));
    }
}

function useStorage(entries = [], limit = Infinity) {
    const storage = new QuotaStorage(entries, limit);
    globalThis.localStorage = storage;
    return storage;
}
function identity(index = 1) {
    return { chatKey: 'chat:quota-test', generationScopeKey: `scope:${index}`, mesid: index,
        swipeId: 0, sourceHash: `final-body-hash:${index}`, settingsKey: 'settings:five-faces' };
}
const themes = [...THEMATIC_CATEGORIES].sort((a, b) => b.raw.length - a.raw.length).slice(0, 5);
const formats = [...PRESENTATION_FORMATS].sort((a, b) => b.raw.length - a.raw.length).slice(0, 5);
function builtinCombos(count = 5) {
    return Array.from({ length: count }, (_, index) => ({
        themeIds: [themes[index].id], formatIds: [formats[index].id],
        themeGroups: [themes[index].group], formatGroups: [formats[index].group],
        themes: [clone(themes[index])], formats: [clone(formats[index])],
        uiReviewFocus: [`UI重点 ${index}`, '层次与留白'],
        diversityPlan: { composition: `layout:${index}`, interaction: `interaction:${index}` },
        samplingMode: 'classic', forcedVisualScenery: index === 0,
        requestedInteraction: { family: `family:${index}`, controls: ['打开', '切换'] },
        visualSignature: `planned-visual:${index}`, visualSkeleton: `planned-skeleton:${index}`,
    }));
}
function mixedCombos() {
    const combos = builtinCombos();
    const themeId = `ext:${'source_name_'.repeat(90)}:theme:1`;
    const formatId = `ext:${'source_name_'.repeat(90)}:format:1`;
    combos[3] = { ...combos[3], themeIds: [themeId], formatIds: [formatId],
        themes: [{ id: themeId, title: '外部主题', summary: '版本冻结', raw: '外部规则与完整引文。\n'.repeat(500), extra: { revision: 3 } }],
        formats: [{ id: formatId, title: '外部展现', summary: '不能依赖后来修改的目录', raw: '保留每一条交互指令。\n'.repeat(500) }],
        customMetadata: { emoji: '🌧️🐇', nested: ['日本語', '中文', '\\literal', '\nnewline'] },
    };
    combos[4] = { ...combos[4], themeIds: [], formatIds: [], themes: [], formats: [],
        customDirective: true, directiveText: '用户自己填写的详细需求。'.repeat(250),
        uiReviewFocus: ['用户指定布局', '完整文本保留'],
    };
    return combos;
}
function fairnessFor(combos) {
    const ids = [...new Set(combos.flatMap(combo => combo.formatIds))];
    return { eligibleFormatIds: [...ids, 'eligible-but-unselected'], selectedFormatIds: ids,
        validFormatIds: [...ids, 'eligible-but-unselected'], directiveScoped: false };
}
function makePlan(api, combos = builtinCombos(), owner = identity()) {
    const plan = api.createPendingComboBatchPlan(combos, owner, fairnessFor(combos));
    assert.ok(plan, 'fixture is a valid frozen multi-face plan');
    return plan;
}
const expectedFor = plan => ({ batchId: plan.batchId, identity: plan.identity });
function scansFor(plan) {
    return plan.faces.map(({ faceIndex }) => ({ faceIndex,
        visualSignature: `rendered-visual:${faceIndex}`, visualSkeleton: `rendered-skeleton:${faceIndex}`,
        riskFlags: [`risk:${faceIndex}`],
        paletteFingerprint: { confidence: 0.9, brightness: 'light', hueFamily: 'green', temperature: 'cool', saturation: 'medium' },
        interactionFamily: { id: `actual-family:${faceIndex}`, label: '切换', confidence: 0.9, controlCount: 2, panelCount: 3 },
    }));
}
function legacyRecord(plan) {
    return { plan: clone(plan), registrySession: 'older-tab-still-alive', createdAt: Date.now() };
}

test('plan creation keeps full built-in material and does not write storage', async () => {
    const storage = useStorage();
    const api = await freshStorageModule();
    const combos = builtinCombos();
    const plan = makePlan(api, combos);
    assert.deepEqual(plan.faces.map(face => face.combo), combos);
    combos[0].themes[0].raw = 'later mutation';
    assert.notEqual(plan.faces[0].combo.themes[0].raw, 'later mutation');
    assert.deepEqual(storage.operations, []);
});

test('same bounded quota: unchanged baseline fits 2, rejects 5; compact storage fits 5', async t => {
    const baselineUrl = process.env.RM_BASELINE_STORAGE_SOURCE
        ? pathToFileURL(process.env.RM_BASELINE_STORAGE_SOURCE)
        : new URL('../../../audit-baseline/toto-main/src/storage.js', import.meta.url);
    try { await access(baselineUrl); } catch {
        t.skip('Unchanged source ZIP baseline is external to this deliverable; set RM_BASELINE_STORAGE_SOURCE to compare.');
        return;
    }
    const baseline = await freshStorageModule(baselineUrl);
    const candidate = await freshStorageModule();
    const two = makePlan(baseline, builtinCombos(2));
    const five = makePlan(baseline, builtinCombos());
    const unrelated = [['another-plugin:user-data', 'kept'.repeat(250)]];
    let store = useStorage(unrelated);
    assert.equal(baseline.markPendingBatchAttempt(two), true);
    const twoUnits = store.used;
    store = useStorage(unrelated);
    assert.equal(baseline.markPendingBatchAttempt(five), true);
    const oldFiveUnits = store.used;
    store = useStorage(unrelated);
    assert.equal(candidate.markPendingBatchAttempt(five), true);
    const newFiveUnits = store.used;
    const quota = Math.max(twoUnits, newFiveUnits) + 32;
    assert.ok(quota < oldFiveUnits, 'real index fixture reproduces the differential quota boundary');
    store = useStorage(unrelated, quota);
    assert.equal(baseline.markPendingBatchAttempt(two), true);
    store = useStorage(unrelated, quota);
    const rejected = [];
    assert.equal(baseline.markPendingBatchAttempt(five, { onRejected: code => rejected.push(code) }), false);
    assert.equal(rejected.at(-1), 'BATCH_STORAGE_QUOTA_EXCEEDED');
    assert.deepEqual(store.snapshot(), new QuotaStorage(unrelated).snapshot());
    store = useStorage(unrelated, quota);
    assert.equal(candidate.markPendingBatchAttempt(five), true);
    assert.deepEqual(candidate.findPendingComboBatchPlan(five.identity), five);
    assert.equal(store.getItem('another-plugin:user-data'), unrelated[0][1]);
    t.diagnostic(JSON.stringify({ units: 'UTF-16 code units including keys', baseline2: twoUnits,
        baseline5: oldFiveUnits, compact5: newFiveUnits, quota }));
});

test('fresh module restores all frozen built-in/custom/external material and long IDs exactly', async () => {
    const store = useStorage();
    let api = await freshStorageModule();
    const combos = mixedCombos();
    const plan = makePlan(api, combos);
    const frozen = JSON.stringify(plan);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    assert.equal(store.getItem(LEGACY), null);
    assert.ok(store.getItem(REGISTRY).length < frozen.length);
    combos[3].themes[0].raw = 'edited after reservation';
    plan.faces[4].combo.directiveText = 'changed caller memory';
    api = await freshStorageModule();
    const loaded = api.findPendingComboBatchPlan(identity());
    assert.equal(JSON.stringify(loaded), frozen);
    loaded.faces[3].combo.themes[0].raw = 'changed returned copy';
    assert.equal(JSON.stringify(api.findPendingComboBatchPlan(identity())), frozen);
});

test('marking the same frozen batch twice does not duplicate attempts or age fairness twice', async () => {
    const store = useStorage();
    const api = await freshStorageModule();
    const plan = makePlan(api);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const before = store.snapshot();
    store.operations = [];
    assert.equal(api.markPendingBatchAttempt(clone(plan)), true);
    assert.deepEqual(store.snapshot(), before);
    assert.deepEqual(store.operations, []);
    assert.equal(JSON.parse(store.getItem(ATTEMPTS))[plan.identity.chatKey].length, 5);
    assert.ok(Object.values(api.getFormatEligibleMisses()).every(value => value === 1));
});

test('same batch ID with changed frozen material is rejected without replacing reservation', async () => {
    const store = useStorage();
    const api = await freshStorageModule();
    const plan = makePlan(api);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const before = store.snapshot();
    const changed = clone(plan);
    changed.faces[0].combo.themes[0].raw += ' new requirements';
    const rejected = [];
    assert.equal(api.markPendingBatchAttempt(changed, { onRejected: code => rejected.push(code) }), false);
    assert.deepEqual(rejected, ['BATCH_ID_CONFLICT']);
    assert.deepEqual(store.snapshot(), before);
});

test('chat, final body, message, swipe and batch identity mismatches cannot commit or release', async () => {
    const store = useStorage();
    const api = await freshStorageModule();
    const plan = makePlan(api);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const before = store.snapshot();
    store.operations = [];
    for (const field of Object.keys(plan.identity)) {
        const owner = { ...plan.identity, [field]: typeof plan.identity[field] === 'number' ? 42 : `different:${field}` };
        assert.equal(api.findPendingComboBatchPlan(owner), null);
        assert.equal(api.commitPendingComboBatch(scansFor(plan), { batchId: plan.batchId, identity: owner }), false);
        api.releasePendingComboBatch({ batchId: plan.batchId, identity: owner });
    }
    assert.equal(api.commitPendingComboBatch(scansFor(plan), { ...expectedFor(plan), batchId: 'other-batch' }), false);
    api.releasePendingComboBatch({ ...expectedFor(plan), batchId: 'other-batch' });
    assert.deepEqual(store.snapshot(), before);
    assert.deepEqual(store.operations, []);
});

test('duplicate selected IDs, sparse plans and preview operations cannot reserve dispatch', async () => {
    const store = useStorage();
    const api = await freshStorageModule();
    const combos = builtinCombos();
    combos[0].themeIds.push(combos[0].themeIds[0]);
    const codes = [];
    assert.equal(api.createPendingComboBatchPlan(combos, identity(), {}, { onRejected: code => codes.push(code) }), null);
    assert.deepEqual(codes, ['BATCH_PLAN_DUPLICATE_ID']);
    const plan = makePlan(api);
    delete plan.faces[1];
    assert.equal(api.markPendingBatchAttempt(plan), false);
    const preview = api.createPendingComboBatchPlan(builtinCombos(), {
        kind: 'generation-operation', chatKey: 'chat:preview', generationScopeKey: 'scope:preview',
        operationId: 'operation:preview', generationType: 'normal', settingsKey: 'settings', preview: true,
    });
    assert.ok(preview);
    assert.equal(api.markPendingBatchAttempt(preview), false);
    assert.deepEqual(store.operations, []);
});

test('legacy v2 and compact v3 coexist; legacy read, idempotent mark, commit and release remain isolated', async () => {
    const api = await freshStorageModule();
    const older = makePlan(api, builtinCombos(2), identity(11));
    const other = makePlan(api, builtinCombos(2), identity(12));
    const legacyRaw = JSON.stringify([legacyRecord(older), legacyRecord(other)]);
    const store = useStorage([[LEGACY, legacyRaw], ['other:data', 'keep']]);
    assert.deepEqual(api.findPendingComboBatchPlan(older.identity), older);
    assert.equal(api.markPendingBatchAttempt(older), true);
    assert.deepEqual(store.operations, []);
    const current = makePlan(api, builtinCombos(), identity(13));
    assert.equal(api.markPendingBatchAttempt(current), true);
    const compactBefore = store.getItem(REGISTRY);
    assert.equal(store.getItem(LEGACY), legacyRaw);
    assert.equal(api.commitPendingComboBatch(scansFor(older), expectedFor(older)), true);
    assert.equal(store.getItem(REGISTRY), compactBefore);
    assert.deepEqual(JSON.parse(store.getItem(LEGACY)), [JSON.parse(legacyRaw)[1]]);
    const remainingLegacy = store.getItem(LEGACY);
    assert.equal(api.releasePendingComboBatch(expectedFor(current)), true);
    assert.equal(store.getItem(LEGACY), remainingLegacy);
    assert.equal(api.releasePendingComboBatch(expectedFor(other)), true);
    assert.equal(store.getItem(REGISTRY), '[]');
    assert.equal(store.getItem(LEGACY), '[]');
    assert.equal(store.getItem('other:data'), 'keep');
});

test('successful history omits only material arrays and preserves draw, UI, visual and cooldown data', async () => {
    const store = useStorage();
    const api = await freshStorageModule();
    const plan = makePlan(api, mixedCombos());
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const scans = scansFor(plan);
    assert.equal(api.commitPendingComboBatch(scans, expectedFor(plan)), true);
    const history = api.getComboHistory(20);
    assert.equal(history.length, 5);
    for (const [index, saved] of history.entries()) {
        const { themes: omittedThemes, formats: omittedFormats, ...accounting } = plan.faces[index].combo;
        for (const [key, value] of Object.entries(accounting)) {
            if (['visualSignature', 'visualSkeleton'].includes(key)) continue;
            assert.deepEqual(saved[key], value, `retains ${key} on face ${index}`);
        }
        assert.equal(Object.hasOwn(saved, 'themes'), false);
        assert.equal(Object.hasOwn(saved, 'formats'), false);
        assert.equal(saved.batchId, plan.batchId);
        assert.equal(saved.faceIndex, index);
        assert.equal(saved.visualSignature, scans[index].visualSignature);
        assert.equal(saved.visualSkeleton, scans[index].visualSkeleton);
        assert.deepEqual(saved.paletteFingerprint, scans[index].paletteFingerprint);
        assert.deepEqual(saved.riskFlags, scans[index].riskFlags);
        assert.deepEqual(saved.interactionFamily, scans[index].interactionFamily);
    }
    assert.deepEqual(api.getRecentIds(20).themeIds, [...new Set(plan.faces.flatMap(face => face.combo.themeIds))]);
    assert.deepEqual(api.getRecentIds(20).formatIds, [...new Set(plan.faces.flatMap(face => face.combo.formatIds))]);
    assert.equal(api.getRecentIds(20).uiReviewFocus.length, 5);
    assert.equal(api.getRecentInteractionFamilies(20).length, 5);
    assert.deepEqual(api.getFormatEligibleMisses(), { 'eligible-but-unselected': 1 });
    assert.equal(api.findPendingComboBatchPlan(plan.identity), null);
    const before = store.snapshot();
    assert.equal(api.commitPendingComboBatch(scans, expectedFor(plan)), false);
    assert.equal(api.markPendingBatchAttempt(plan), false, 'consumed attempt journal prevents reserving the same request again');
    assert.deepEqual(store.snapshot(), before);
});

test('partial commit records only accepted faces and keeps failed faces out of completion cooldown', async () => {
    const store = useStorage();
    const api = await freshStorageModule();
    const plan = makePlan(api);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const scans = scansFor(plan).map((scan, index) => index === 2 ? scan : null);
    const before = store.snapshot();
    assert.equal(api.commitPendingComboBatch(scans, expectedFor(plan)), false);
    assert.deepEqual(store.snapshot(), before);
    assert.equal(api.commitPendingComboBatch(scans, { ...expectedFor(plan), partial: true }), true);
    assert.deepEqual(api.getRecentIds().themeIds, plan.faces[2].combo.themeIds);
    assert.equal(api.getComboHistory()[0].faceIndex, 2);
    const pity = api.getFormatEligibleMisses();
    assert.equal(pity[plan.faces[2].combo.formatIds[0]], undefined);
    assert.equal(pity[plan.faces[0].combo.formatIds[0]], 1);
    assert.equal(api.findPendingComboBatchPlan(plan.identity), null);
    assert.equal(JSON.parse(store.getItem(ATTEMPTS))[plan.identity.chatKey].length, 5);
});

test('corrupt compact or legacy registry fails closed without overwriting any stored data', async () => {
    const api = await freshStorageModule();
    const plan = makePlan(api);
    const corruptValues = [
        [REGISTRY, '{broken'],
        [REGISTRY, JSON.stringify([{ planPayload: { encoding: 'unknown', data: 'secret' }, registrySession: 'x', createdAt: Date.now() }])],
        [REGISTRY, JSON.stringify([{ planPayload: { encoding: 'lzw15-utf8-v1', data: String.fromCharCode(288) }, registrySession: 'x', createdAt: Date.now() }])],
        [LEGACY, JSON.stringify([{ plan: { ...plan, faces: [] }, registrySession: 'x', createdAt: Date.now() }])],
    ];
    for (const [key, value] of corruptValues) {
        const entries = [[key, value], ['other:data', 'keep']];
        if (key !== LEGACY) entries.push([LEGACY, JSON.stringify([legacyRecord(plan)])]);
        const store = useStorage(entries);
        const before = store.snapshot();
        const codes = [];
        assert.equal(api.findPendingComboBatchPlan(plan.identity), null);
        assert.equal(api.markPendingBatchAttempt(plan, { onRejected: code => codes.push(code) }), false);
        assert.deepEqual(codes, ['BATCH_REGISTRY_UNREADABLE']);
        assert.equal(api.commitPendingComboBatch(scansFor(plan), expectedFor(plan)), false);
        assert.equal(api.releasePendingComboBatch(expectedFor(plan)), false);
        assert.deepEqual(store.snapshot(), before);
        assert.deepEqual(store.operations, []);
    }
});

test('quota failure in later accounting write rolls back reservation and preserves live legacy/unrelated keys', async () => {
    const api = await freshStorageModule();
    const older = makePlan(api, builtinCombos(2), identity(21));
    const plan = makePlan(api, builtinCombos(), identity(22));
    const entries = [[LEGACY, JSON.stringify([legacyRecord(older)])], ['other:data', 'keep'.repeat(200)]];
    let store = useStorage(entries);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const quota = store.used - 1;
    store = useStorage(entries, quota);
    const before = store.snapshot();
    assert.ok(store.used < quota);
    const codes = [];
    assert.equal(api.markPendingBatchAttempt(plan, { onRejected: code => codes.push(code) }), false);
    assert.equal(codes.at(-1), 'BATCH_STORAGE_QUOTA_EXCEEDED');
    assert.ok(store.operations.some(op => op.key === ATTEMPTS && op.rejected));
    assert.deepEqual(store.snapshot(), before);
    assert.deepEqual(api.findPendingComboBatchPlan(older.identity), older);
    assert.equal(api.findPendingComboBatchPlan(plan.identity), null);
});

test('insufficient capacity for even compact reservation still refuses dispatch without deleting user data', async () => {
    const api = await freshStorageModule();
    const plan = makePlan(api);
    const store = useStorage([['other:data', 'persisted history']]);
    store.limit = store.used + 1;
    const before = store.snapshot();
    const codes = [];
    assert.equal(api.markPendingBatchAttempt(plan, { onRejected: code => codes.push(code) }), false);
    assert.deepEqual(codes, ['BATCH_STORAGE_QUOTA_EXCEEDED']);
    assert.deepEqual(store.snapshot(), before);
    assert.equal(api.findPendingComboBatchPlan(plan.identity), null);
});

test('completed batch commits when final state fits without simultaneous reservation-plus-history headroom', async () => {
    const api = await freshStorageModule();
    const plan = makePlan(api, mixedCombos());
    let store = useStorage([['other:data', 'kept']]);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const before = store.snapshot();
    const initialUsage = store.used;
    assert.equal(api.commitPendingComboBatch(scansFor(plan), expectedFor(plan)), true);
    const historyAfter = store.getItem(HISTORY);
    const finalUsage = store.used;
    const quota = Math.max(initialUsage, finalUsage);
    assert.ok(initialUsage + HISTORY.length + historyAfter.length > quota);
    store = useStorage(before, quota);
    assert.equal(api.commitPendingComboBatch(scansFor(plan), expectedFor(plan)), true);
    assert.equal(api.getComboHistory(20).length, 5);
    assert.equal(store.getItem(REGISTRY), '[]');
    assert.ok(store.used <= quota);
    const writes = store.operations.filter(op => op.operation === 'set').map(op => op.key);
    assert.ok(writes.indexOf(REGISTRY) < writes.indexOf(HISTORY), 'completed reservation shrinks before history grows');
});

test('failed history commit restores reservation after shrink and remains retryable for commit only', async () => {
    const api = await freshStorageModule();
    const plan = makePlan(api);
    const store = useStorage([['other:data', 'keep']]);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const before = store.snapshot();
    store.limit = store.used;
    store.rejectOnce = key => key === HISTORY;
    assert.equal(api.commitPendingComboBatch(scansFor(plan), expectedFor(plan)), false);
    assert.deepEqual(store.snapshot(), before);
    assert.deepEqual(api.findPendingComboBatchPlan(plan.identity), plan);
    store.limit = Infinity;
    assert.equal(api.commitPendingComboBatch(scansFor(plan), expectedFor(plan)), true);
    assert.equal(api.getComboHistory(20).length, 5);
});

test('reservation uses reclaimed accounting headroom before writing a new compact plan', async () => {
    const api = await freshStorageModule();
    const plan = makePlan(api);
    const attemptRows = Array.from({ length: 20 }, (_, index) => ({
        attemptId: `previous:${index}`, themeIds: [`ext:${'long_source_'.repeat(100)}:${index}`],
        formatIds: [], themeGroups: [], formatGroups: [], ts: Date.now(),
    }));
    const entries = [[ATTEMPTS, JSON.stringify({ [plan.identity.chatKey]: attemptRows })], ['other:data', 'keep']];
    let store = useStorage(entries);
    const initialUsage = store.used;
    assert.equal(api.markPendingBatchAttempt(plan), true);
    const finalUsage = store.used;
    const registry = store.getItem(REGISTRY);
    const quota = Math.max(initialUsage, finalUsage);
    assert.ok(initialUsage + REGISTRY.length + registry.length > quota);
    store = useStorage(entries, quota);
    assert.equal(api.markPendingBatchAttempt(plan), true);
    assert.deepEqual(api.findPendingComboBatchPlan(plan.identity), plan);
    assert.equal(store.operations.find(op => op.operation === 'set').key, ATTEMPTS);
    assert.equal(JSON.parse(store.getItem(ATTEMPTS))[plan.identity.chatKey].length, 20);
});
