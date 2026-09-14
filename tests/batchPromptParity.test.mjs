import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createRuntime, createStore } from './helpers/vmLoader.mjs';

const candidateRoot = fileURLToPath(new URL('..', import.meta.url));
const baselineRoot = process.env.RABBIT_MIRROR_BASELINE;
const copy = value => JSON.parse(JSON.stringify(value));
const scope = 'generation:quota-parity:final-body';
const generationContext = { batchIdentity: { mesid: 16, swipeId: 2, sourceHash: 'verified-final-body-fixture' } };

async function fixture(root = candidateRoot, mixed = false, generationType = 'independent') {
    const runtime = createRuntime(root);
    const settingsModule = await runtime.load('src/settings.js');
    const settings = { ...copy(settingsModule.defaultSettings), generationSource: generationType === 'independent' ? 'independent' : 'follow',
        rabbitMirrorFaceCount: 5, rawPolicy: 'full', userDirectivePriority: false };
    const prompt = await runtime.load('src/promptBuilder.js');
    const first = prompt.planRabbitMirrorPromptDetails(settings, generationType, null, scope, generationContext);
    const storage = await runtime.load('src/storage.js');
    const combos = copy(first.batchPlan.faces.map(face => face.combo));
    const rawMap = new Map();
    if (mixed) {
        const external = (id, classification, localTitle, rawContent) => ({
            id, externalId: id, classification, localTitle, sourceTitle: localTitle,
            sourceWorldBookName: '隔离测试母本', sourceKeywords: ['雨夜', '可见机关'],
            summary: `${localTitle}的完整摘要，保留动作与状态组织。`, rawContent,
            enabled: true, userConfirmed: true,
        });
        const theme = external('ext:parity:theme:1', 'theme', '外部雨夜主题', '外部主题完整正文。雨夜等待与再次相遇。'.repeat(40));
        const format = external('ext:parity:format:1', 'format', '外部机关形式', '外部形式完整正文。沿可见折痕打开机关，再触摸返回。'.repeat(40));
        rawMap.set(theme.id, theme); rawMap.set(format.id, format);
        combos[2].themeIds = [theme.id]; combos[2].themes = [{ id: theme.id, externalKind: 'theme' }];
        combos[3].formatIds = [format.id]; combos[3].formats = [{ id: format.id, externalKind: 'format' }];
        combos[4].themeIds = []; combos[4].themes = [];
        combos[4].formatIds = []; combos[4].formats = []; combos[4].customDirective = true;
    }
    const fairness = copy(first.batchPlan.fairness);
    fairness.selectedFormatIds = [...new Set(combos.flatMap(combo => combo.formatIds))];
    const plan = storage.createPendingComboBatchPlan(combos, first.batchPlan.identity, fairness);
    assert.ok(plan);
    assert.equal(plan.requestedFaceCount, 5);
    assert.ok(plan.faces.every(face => face.combo.uiReviewFocus.length >= 3));
    assert.ok(plan.faces.every(face => face.combo.interactionDiversity.faceCount === 5));
    return { settings, plan: copy(plan), rawMap, generationType };
}

async function persistAndRecover(root, fixtureValue) {
    const store = createStore();
    const writer = createRuntime(root, { store });
    const storage = await writer.load('src/storage.js');
    assert.equal(storage.markPendingBatchAttempt(copy(fixtureValue.plan)), true);
    const persistedChars = [...store.values].reduce((sum, [key, value]) => sum + key.length + value.length, 0);
    // A new VM has no module-scoped picker cache: this must recover from localStorage.
    const reader = createRuntime(root, { store });
    const recoveredStorage = await reader.load('src/storage.js');
    const recovered = recoveredStorage.findPendingComboBatchPlan(copy(fixtureValue.plan.identity));
    assert.equal(JSON.stringify(recovered), JSON.stringify(fixtureValue.plan));
    const prompt = await reader.load('src/promptBuilder.js');
    const renderPlan = prompt.planRabbitMirrorPromptDetails(fixtureValue.settings, fixtureValue.generationType, null, scope, generationContext);
    assert.ok(Object.isFrozen(renderPlan));
    assert.equal(renderPlan.batchPlan.batchId, fixtureValue.plan.batchId);
    const rendered = prompt.renderRabbitMirrorPromptPlan(renderPlan, fixtureValue.rawMap);
    assert.equal(rendered.metadata.faceCount, 5);
    assert.equal(rendered.metadata.faces.length, 5);
    assert.equal(rendered.batchPlan.batchId, fixtureValue.plan.batchId);
    assert.ok(rendered.prompt.length > 10000);
    assert.ok(rendered.executionLock.length > 0);
    return { rendered, persistedChars, reader, recoveredStorage, store };
}

test('five-face recovery retains full builtin, external, custom, UI and interaction data without a memory cache', async () => {
    const value = await fixture(candidateRoot, true);
    const result = await persistAndRecover(candidateRoot, value);
    assert.match(result.rendered.prompt, /外部雨夜主题/);
    assert.match(result.rendered.prompt, /外部机关形式/);
    assert.match(result.rendered.prompt, /本批交互分散/);
    assert.ok(result.persistedChars < JSON.stringify(value.plan).length);
    for (const change of [
        { chatKey: 'chat:other' }, { mesid: 17 }, { swipeId: 3 },
        { sourceHash: 'changed-final-body' }, { generationScopeKey: 'different-operation' },
        { settingsKey: 'different-settings' },
    ]) assert.equal(result.recoveredStorage.findPendingComboBatchPlan({ ...value.plan.identity, ...change }), null);
});

for (const generationType of ['independent', 'normal']) for (const mixed of [false, true]) {
    test(`${generationType}: baseline/candidate shared prompt and execution lock are byte-identical after ${mixed ? 'mixed' : 'builtin'} five-face recovery`,
        { skip: !baselineRoot && 'Set RABBIT_MIRROR_BASELINE to the untouched source ZIP extraction for this comparison.' }, async () => {
            const value = await fixture(baselineRoot, mixed, generationType);
            const before = await persistAndRecover(baselineRoot, value);
            const after = await persistAndRecover(candidateRoot, value);
            assert.equal(after.rendered.prompt, before.rendered.prompt);
            assert.equal(after.rendered.executionLock, before.rendered.executionLock);
            assert.equal(JSON.stringify(after.rendered.metadata), JSON.stringify(before.rendered.metadata));
            assert.equal(JSON.stringify(after.rendered.batchPlan), JSON.stringify(before.rendered.batchPlan));
            assert.ok(after.persistedChars < before.persistedChars);
        });
}

for (const generationType of ['independent', 'normal']) {
    test(`${generationType}: compact successful history leaves the next real draw and prompt byte-identical`,
        { skip: !baselineRoot && 'Set RABBIT_MIRROR_BASELINE for the history comparison.' }, async () => {
            const value = await fixture(baselineRoot, false, generationType);
            const before = await persistAndRecover(baselineRoot, value);
            const after = await persistAndRecover(candidateRoot, value);
            const scans = value.plan.faces.map(({ faceIndex }) => ({
                faceIndex, visualSignature: `成功面${faceIndex}的指纹`, visualSkeleton: `成功面${faceIndex}的骨架`,
                riskFlags: ['inner_details'], interactionFamily: { id: 'flip_card_family', confidence: 1 },
            }));
            const nextPrompts = [];
            for (const [root, result] of [[baselineRoot, before], [candidateRoot, after]]) {
                assert.equal(result.recoveredStorage.commitPendingComboBatch(scans, value.plan), true);
                const reader = createRuntime(root, { store: result.store });
                const prompt = await reader.load('src/promptBuilder.js');
                const nextPlan = prompt.planRabbitMirrorPromptDetails(value.settings, generationType, null, `${scope}:next`,
                    { batchIdentity: { mesid: 17, swipeId: 0, sourceHash: 'next-final-body' } });
                nextPrompts.push(prompt.renderRabbitMirrorPromptPlan(nextPlan));
            }
            assert.equal(nextPrompts[1].prompt, nextPrompts[0].prompt);
            assert.equal(nextPrompts[1].executionLock, nextPrompts[0].executionLock);
            assert.equal(JSON.stringify(nextPrompts[1].batchPlan), JSON.stringify(nextPrompts[0].batchPlan));
        });
}

const payload = () => ({ model: 'offline-test', stream: false, messages: [
    { role: 'system', content: '同一份公共生成规则。一次生成五面。' },
    { role: 'user', content: '【当前聊天逐轮正文】\n[16 ASSISTANT]\n这是当前最终正文。\n'
        + '<兔子镜近输出短锁 data-source="independent-api-near-output">只生成本轮五面。</兔子镜近输出短锁>' },
] });

/** Guard-boundary fixture, not a simulation of the entire host event lifecycle.
 * Registration and release use real storage; the operation lease is a test double.
 */
function batchLease(storage, plan, signal, errors) {
    let spent = false;
    return {
        consume() {
            if (signal?.aborted) return false;
            let code = '';
            if (!storage.markPendingBatchAttempt(plan, { onRejected: value => { code = value; } })) {
                errors.push(code);
                const error = new Error(code); error.code = code; throw error;
            }
            if (spent) { storage.releasePendingComboBatch(plan); return false; }
            spent = true;
            return true;
        },
    };
}

for (const mode of ['fetch', 'host-service']) {
    test(`${mode}: registered five-face batch crosses the real guard once and reused lease cannot dispatch twice`, async () => {
        const { plan } = await fixture();
        const calls = [];
        const runtime = createRuntime(candidateRoot, { fetch: async (...args) => {
            calls.push(args); return new Response('{"choices":[{"message":{"content":"five faces"}}]}', { status: 200 });
        } });
        const storage = await runtime.load('src/storage.js');
        const guard = await runtime.load('src/independentSecurityGuard.js');
        const lease = batchLease(storage, plan, null, []);
        const send = () => mode === 'fetch'
            ? guard.fetchRabbitMirrorIndependentCompletion('/api/backends/chat-completions/generate', { method: 'POST', body: JSON.stringify(payload()), rabbitMirrorDispatchLease: lease })
            : Promise.resolve().then(() => { const body = guard.authorizeRabbitMirrorIndependentServiceRequest(payload(), lease); calls.push(body); });
        await send();
        assert.equal(calls.length, 1);
        await assert.rejects(send(), error => error.code === 'RABBIT_MIRROR_DISPATCH_LEASE_REJECTED');
        assert.equal(calls.length, 1);
    });

    for (const failure of ['quota', 'cancelled', 'context-boundary']) {
        test(`${mode}: ${failure} rejects before any provider dispatch`, async () => {
            const { plan } = await fixture();
            const calls = [];
            const store = createStore([], failure === 'quota' ? 0 : Infinity);
            const runtime = createRuntime(candidateRoot, { store, fetch: async () => { calls.push(true); return new Response('{}'); } });
            const storage = await runtime.load('src/storage.js');
            const guard = await runtime.load('src/independentSecurityGuard.js');
            const controller = new AbortController();
            if (failure === 'cancelled') controller.abort();
            const errors = [];
            const lease = batchLease(storage, plan, controller.signal, errors);
            const body = payload();
            if (failure === 'context-boundary') body.messages[1].content = '只有半成品，没有正文边界。';
            const send = () => mode === 'fetch'
                ? guard.fetchRabbitMirrorIndependentCompletion('/api/backends/chat-completions/generate', { method: 'POST', body: JSON.stringify(body), rabbitMirrorDispatchLease: lease })
                : Promise.resolve().then(() => { const approved = guard.authorizeRabbitMirrorIndependentServiceRequest(body, lease); calls.push(approved); });
            await assert.rejects(send(), error => error.code === ({ quota: 'BATCH_STORAGE_QUOTA_EXCEEDED',
                cancelled: 'RABBIT_MIRROR_DISPATCH_LEASE_REJECTED', 'context-boundary': 'RABBIT_MIRROR_CONTEXT_BOUNDARY_REJECTED' })[failure]);
            assert.equal(calls.length, 0);
            assert.equal(store.values.size, 0);
            assert.deepEqual(errors, failure === 'quota' ? ['BATCH_STORAGE_QUOTA_EXCEEDED'] : []);
        });
    }
}
