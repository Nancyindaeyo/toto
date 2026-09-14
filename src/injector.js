import { eventSource, event_types, setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../../script.js';
import * as hostRuntime from '../../../../../script.js';
import { MODULE_NAME, getSettings } from './settings.js?rmv=1.5.51-narrow1';
import {
    buildFeedbackCatFinalCheck,
    buildFeedbackCatPrompt,
    clearFeedbackCatExtensionPrompt,
    getActiveFeedbackForCurrentChat,
    markFeedbackCatInjected,
} from './feedbackCat.js?rmv=1.5.51-narrow1';
import { recordRabbitMirrorInjection, recordRabbitMirrorNoInjection } from './tokenMeter.js?rmv=1.5.51-narrow1';
import { getCurrentChatKey, markPendingBatchAttempt, releasePendingComboBatch } from './storage.js?rmv=1.5.51-narrow1';
import { describeExternalWorldBookPreflightFailure } from './externalWorldBook/errors.js?rmv=1.5.51-narrow1';

const INJECT_KEY = `${MODULE_NAME}:auto_injection`;

let generationInvocationSequence = 0;
let independentGenerationIntentSequence = 0;
let promptBuilderPromise = null;
let generationGuardPromise = null;
let lastFollowExternalPreflightFailure = null;

export function getLastFollowExternalPreflightFailure() { return lastFollowExternalPreflightFailure; }

const INDEPENDENT_GENERATION_INTENTS_KEY = '__rabbitMirrorIndependentGenerationIntents';
const INDEPENDENT_GENERATION_STOPS_KEY = '__rabbitMirrorIndependentStoppedHostOperations';
const INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY = '__rabbitMirrorIndependentGenerationIntentBridgeCleanup';
const INDEPENDENT_GENERATION_INTENT_TTL_MS = 5 * 60 * 1000;
const INDEPENDENT_GENERATION_INTENT_MAX = 8;
const INDEPENDENT_GENERATION_INTENT_TYPES = new Set(['normal', 'continue', 'swipe', 'regenerate']);
let independentIntentBridgeSubscriptions = [];
let independentCoreRuntimeWakeTimer = 0;
let independentCoreRuntimeWakeRevision = 0;
const INDEPENDENT_CORE_RUNTIME_WAKE_DELAY_MS = 120;
const INDEPENDENT_EARLY_PACKET_KEY = '__rabbitMirrorEarlyBodyPacket';
const INDEPENDENT_EARLY_BRIDGE_KEY = '__rabbitMirrorEarlyBodyBridge';

function independentEarlyIntentEnabled(settings = getSettings(), ctx = currentIndependentIntentContext()) {
    return settings.enabled !== false && settings.autoRabbitMirrorInjection !== false
        && settings.generationSource === 'independent' && settings.mode !== 'off'
        && settings.independentEarlyBodyEnabled === true
        && !!String(settings.independentEarlyBodyChatKey || '')
        && String(settings.independentEarlyBodyChatKey) === String(getCurrentChatKey(ctx.chat) || '')
        && Array.isArray(settings.independentEarlyBodyTags) && settings.independentEarlyBodyTags.length > 0;
}
function independentEarlySelectionKey(settings) {
    return JSON.stringify([String(settings.independentEarlyBodyChatKey || ''), settings.independentEarlyBodyTags || [], settings.independentContextExcludedTags || []]);
}

function cancelIndependentEarlyIntent(reason = 'host-operation-replaced') {
    delete globalThis[INDEPENDENT_EARLY_PACKET_KEY];
    try { globalThis[INDEPENDENT_EARLY_BRIDGE_KEY]?.({ kind: 'cancel', reason }); } catch {}
}

function recordIndependentEarlyToken(text) {
    const ctx = currentIndependentIntentContext();
    const settings = getSettings();
    if (!independentEarlyIntentEnabled(settings, ctx)) {
        if (globalThis[INDEPENDENT_EARLY_PACKET_KEY]) cancelIndependentEarlyIntent('early-settings-changed');
        return;
    }
    const processor = ctx.streamingProcessor;
    const index = processor?.messageId;
    const message = Number.isSafeInteger(index) ? ctx.chat?.[index] : null;
    const type = String(processor?.type || '').toLowerCase();
    // Public ST/TT event payload is cumulative text, emitted before its next DOM
    // paint. Never concatenate successive payloads or await work in this listener.
    if (typeof text !== 'string' || text.length > 256 * 1024 || !processor
        || processor.result !== text || processor.isStopped === true || processor.isFinished === true
        || processor.abortController?.signal?.aborted || !isIndependentEligibleAssistantMessage(message)
        || !INDEPENDENT_GENERATION_INTENT_TYPES.has(type)
        || (Array.isArray(processor.toolCalls) && processor.toolCalls.length)) return;
    try { if (typeof ctx.canPerformToolCalls !== 'function' || ctx.canPerformToolCalls(type) !== false) return; }
    catch { return; }
    const chatKey = String(getCurrentChatKey(ctx.chat) || '');
    const intent = currentIndependentGenerationIntents().slice().reverse().find(item => item.chatKey === chatKey
        && item.type === type && !item.auxiliaryTerminalPending && !item.terminalAt
        && independentIntentCandidateIndex(item, ctx.chat) === index);
    if (!intent || !intent.earlySelectionKey || intent.earlySelectionKey !== independentEarlySelectionKey(settings)) {
        if (globalThis[INDEPENDENT_EARLY_PACKET_KEY]) cancelIndependentEarlyIntent('early-selection-changed');
        return;
    }
    const prefix = typeof processor.continueMessage === 'string' ? processor.continueMessage : '';
    if (prefix.length + text.length > 256 * 1024) return;
    const packet = { intentId: intent.id, selectionKey: intent.earlySelectionKey, chat: ctx.chat, chatKey, processor, index, message,
        swipe: Number(message.swipe_id ?? message.swipeId ?? 0) || 0, type, text: prefix + text };
    globalThis[INDEPENDENT_EARLY_PACKET_KEY] = packet;
    try { globalThis[INDEPENDENT_EARLY_BRIDGE_KEY]?.({ kind: 'token', packet }); } catch {}
}

function prewarmIndependentEarlyIntent(intent) {
    if (intent && independentEarlyIntentEnabled()) scheduleIndependentCoreRuntimeWake();
}

function hashIndependentIntentText(text = '') {
    let hash = 2166136261;
    for (const char of String(text || '')) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}

function currentIndependentIntentContext() {
    try {
        return globalThis.SillyTavern?.getContext?.() || {};
    } catch {
        return {};
    }
}

function currentIndependentIntentChat() {
    const chat = currentIndependentIntentContext().chat;
    return Array.isArray(chat) ? chat : [];
}

function currentIndependentGenerationIntents() {
    const now = Date.now();
    const source = Array.isArray(globalThis[INDEPENDENT_GENERATION_INTENTS_KEY])
        ? globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]
        : [];
    const current = source.filter(item => item && now - Number(item.startedAt || 0) <= INDEPENDENT_GENERATION_INTENT_TTL_MS);
    if (current.length !== source.length) globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = current;
    return current;
}

function isIndependentToolResultMessage(message) {
    const extra = message?.extra;
    return message?.is_system === true
        || extra?.isSmallSys === true
        || !!(extra && Object.prototype.hasOwnProperty.call(extra, 'tool_invocations'));
}

function isIndependentEligibleAssistantMessage(message) {
    return !!message
        && message.is_user !== true
        && !isIndependentToolResultMessage(message)
        && typeof message.mes === 'string';
}

function independentIntentTailRole(message) {
    if (message?.is_user === true) return 'user';
    if (isIndependentToolResultMessage(message)) return 'system';
    if (isIndependentEligibleAssistantMessage(message)) return 'assistant';
    return '';
}

function independentHostGenerationMayUseTools(type, ctx = currentIndependentIntentContext()) {
    const normalized = String(type || '').trim().toLowerCase();
    if (!['normal', 'swipe', 'regenerate'].includes(normalized)) return false;
    const mainApi = String(ctx?.mainApi || hostRuntime?.main_api || '').trim().toLowerCase();
    if (mainApi && mainApi !== 'openai') return false;
    try {
        if (typeof ctx?.canPerformToolCalls === 'function') return ctx.canPerformToolCalls(normalized) !== false;
        if (typeof ctx?.ToolManager?.canPerformToolCalls === 'function') return ctx.ToolManager.canPerformToolCalls(normalized) !== false;
    } catch { return true; }
    if (ctx?.chatCompletionSettings?.function_calling === false) return false;
    return true;
}

function independentHostRenderProof(index, toolCapable = true) {
    const processor = hostRuntime?.streamingProcessor;
    if (processor && Number(processor.messageId) === Number(index) && processor.isFinished === true) {
        return Array.isArray(processor.toolCalls) && processor.toolCalls.length > 0
            ? 'stream-tool-intermediate'
            : 'stream-final';
    }
    return toolCapable === false ? 'non-tool-final' : 'exact-render';
}

function independentIntentCandidateIndex(intent, chat) {
    if (!intent || !INDEPENDENT_GENERATION_INTENT_TYPES.has(String(intent.type || ''))) return null;
    const messages = Array.isArray(chat) ? chat : [];
    const tailIndex = Number(intent.tailIndex);
    if (!Number.isInteger(tailIndex) || tailIndex < 0) return null;
    const tail = messages[tailIndex];
    const tailRole = String(intent.tailRole || '');
    const type = String(intent.type || '');
    if (type === 'normal') {
        if (independentIntentTailRole(tail) !== tailRole
            || hashIndependentIntentText(tail?.mes || '') !== String(intent.tailBodyHash || '')
            || (Number(tail?.swipe_id ?? tail?.swipeId ?? 0) || 0) !== Number(intent.tailSwipeId || 0)) return null;
        const candidate = messages[tailIndex + 1];
        return isIndependentEligibleAssistantMessage(candidate) && String(candidate.mes || '').trim() ? tailIndex + 1 : null;
    }
    if (['continue', 'swipe', 'regenerate'].includes(type)
        && tailRole === 'assistant'
        && isIndependentEligibleAssistantMessage(tail)) {
        const changed = hashIndependentIntentText(tail.mes || '') !== String(intent.tailBodyHash || '')
            || (Number(tail?.swipe_id ?? tail?.swipeId ?? 0) || 0) !== Number(intent.tailSwipeId || 0);
        return changed ? tailIndex : null;
    }
    return null;
}

function resolveIndependentIntentCompletionIndex(payload, chat) {
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        const exactIndex = chat.indexOf(payload);
        if (exactIndex >= 0 && isIndependentEligibleAssistantMessage(chat[exactIndex])) return exactIndex;
    }
    const candidates = [payload, payload?.messageId, payload?.message_id, payload?.mesid, payload?.id];
    for (const value of candidates) {
        const index = Number(value);
        if (Number.isInteger(index) && index >= 0 && isIndependentEligibleAssistantMessage(chat[index])) return index;
    }
    return null;
}

function markIndependentGenerationIntentCompleted(payload, reason = 'host-completed') {
    const intents = currentIndependentGenerationIntents();
    if (!intents.length) return false;
    const chat = currentIndependentIntentChat();
    const chatKey = String(getCurrentChatKey(chat) || '');
    if (!chatKey || !intents.some(intent => String(intent?.chatKey || '') === chatKey)) return false;
    const index = resolveIndependentIntentCompletionIndex(payload, chat);
    if (!Number.isInteger(index)) return false;
    const message = chat[index];
    const finalBodyHash = hashIndependentIntentText(message?.mes || '');
    if (!finalBodyHash || !String(message?.mes || '').trim()) return false;
    let changed = false;
    let wakeEligible = false;
    const next = intents.map(intent => {
        if (String(intent.chatKey || '') !== chatKey || independentIntentCandidateIndex(intent, chat) !== index) return intent;
        changed = true;
        const toolCapable = intent.toolCapable !== false || independentHostGenerationMayUseTools(intent.type);
        const finalProof = independentHostRenderProof(index, toolCapable);
        const next = { ...intent, toolCapable };
        if (finalProof === 'stream-tool-intermediate') {
            delete next.completedAt;
            delete next.completionReason;
            delete next.finalIndex;
            delete next.finalBodyHash;
            delete next.finalProof;
            next.intermediateAt = Date.now();
            next.intermediateIndex = index;
            return Object.freeze(next);
        }
        wakeEligible = true;
        return Object.freeze({ ...next,
            completedAt: Date.now(), completionReason: String(reason || '').slice(0, 64),
            finalIndex: index, finalBodyHash, finalProof,
        });
    });
    globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = next;
    if (changed && wakeEligible) scheduleIndependentCoreRuntimeWake();
    return changed;
}

function markIndependentGenerationIntentTerminal(reason = 'host-terminal') {
    const intents = currentIndependentGenerationIntents();
    if (!intents.length) return false;
    const chat = currentIndependentIntentChat();
    const chatKey = String(getCurrentChatKey(chat) || '');
    if (!chatKey || !intents.some(intent => String(intent?.chatKey || '') === chatKey)) return false;
    let changed = false;
    const next = intents.map(intent => {
        if (String(intent?.chatKey || '') !== chatKey) return intent;
        changed = true;
        if (intent.auxiliaryTerminalPending === true) {
            const next = { ...intent, auxiliaryTerminalAt: Date.now(), auxiliaryTerminalReason: String(reason || '').slice(0, 64) };
            delete next.auxiliaryTerminalPending;
            delete next.auxiliaryStartedAt;
            return Object.freeze(next);
        }
        return Object.freeze({ ...intent,
            terminalAt: Date.now(), terminalReason: String(reason || '').slice(0, 64),
        });
    });
    globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = next;
    if (changed) scheduleIndependentCoreRuntimeWake();
    return changed;
}

function cancelIndependentCoreRuntimeWake() {
    independentCoreRuntimeWakeRevision += 1;
    if (independentCoreRuntimeWakeTimer) {
        try { globalThis.clearTimeout?.(independentCoreRuntimeWakeTimer); } catch {}
        independentCoreRuntimeWakeTimer = 0;
    }
}

function scheduleIndependentCoreRuntimeWake() {
    if (independentCoreRuntimeWakeTimer || typeof globalThis.setTimeout !== 'function') return false;
    // Completion proof is recorded synchronously, but the deferred graph gets a
    // cancellable paint window. A recursive/new START revokes this wake before it
    // can compete with the host's next paid request or tool continuation.
    const revision = ++independentCoreRuntimeWakeRevision;
    independentCoreRuntimeWakeTimer = globalThis.setTimeout(() => {
        if (revision !== independentCoreRuntimeWakeRevision) return;
        independentCoreRuntimeWakeTimer = 0;
        try {
            const runtimeLoad = globalThis.__rabbitMirrorEnsureDeferredCoreRuntime?.('independent-generation-intent');
            if (runtimeLoad && typeof runtimeLoad.catch === 'function') void runtimeLoad.catch(() => {});
        } catch {}
    }, INDEPENDENT_CORE_RUNTIME_WAKE_DELAY_MS);
    return true;
}

function independentIntentHasCompletedProof(intent) {
    return Number(intent?.completedAt) > 0
        && Number.isInteger(Number(intent?.finalIndex))
        && !!String(intent?.finalBodyHash || '')
        && !!String(intent?.finalProof || '');
}

function independentIntentSupersededByStart(intent, start = {}) {
    if (String(intent?.chatKey || '') !== String(start.chatKey || '')) return false;
    if (!independentIntentHasCompletedProof(intent)) return true;
    const finalIndex = Number(intent.finalIndex);
    const tailIndex = Number(start.tailIndex);
    const tailRole = String(start.tailRole || '');
    if (tailRole === 'system' && start.type === 'normal') return finalIndex === tailIndex - 1;
    if (tailRole === 'assistant') return finalIndex === tailIndex;
    return false;
}

function recordIndependentGenerationIntent(chat, type = '', earlySelectionKey = '') {
    cancelIndependentCoreRuntimeWake();
    if (globalThis[INDEPENDENT_EARLY_PACKET_KEY]) cancelIndependentEarlyIntent();
    const messages = Array.isArray(chat) ? chat : [];
    const normalizedType = String(type || 'normal').trim().toLowerCase() || 'normal';
    const chatKey = String(getCurrentChatKey(messages) || '');
    const previous = currentIndependentGenerationIntents();
    if (!INDEPENDENT_GENERATION_INTENT_TYPES.has(normalizedType)) {
        let changed = false;
        const next = previous.map(intent => {
            if (!chatKey || String(intent?.chatKey || '') !== chatKey) return intent;
            changed = true;
            return Object.freeze({ ...intent, auxiliaryTerminalPending: true, auxiliaryStartedAt: Date.now() });
        });
        if (changed) globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = next;
        return null;
    }
    const tailIndex = messages.length - 1;
    const tail = tailIndex >= 0 ? messages[tailIndex] : null;
    if (!tail || typeof tail?.is_user !== 'boolean') return null;
    // Host prompt transforms may clone or alter `_chat`. When the same tail exists in
    // SillyTavern's current raw chat, anchor the proof to that raw正文 instead.
    const hostContext = currentIndependentIntentContext();
    const rawTail = hostContext.chat?.[tailIndex];
    const hostTail = Array.isArray(hostContext.chat) ? hostContext.chat.at(-1) : messages.at(-1);
    const toolTail = Array.isArray(hostTail?.extra?.tool_invocations) && hostTail.extra.tool_invocations.length > 0;
    const stops = Array.isArray(globalThis[INDEPENDENT_GENERATION_STOPS_KEY]) ? globalThis[INDEPENDENT_GENERATION_STOPS_KEY] : [];
    if (normalizedType === 'normal' && toolTail && stops.some(stop => stop?.chatKey === chatKey)) return null;
    if (stops.length) globalThis[INDEPENDENT_GENERATION_STOPS_KEY] = stops.filter(stop => stop?.chatKey !== chatKey);
    const proofTail = rawTail && independentIntentTailRole(rawTail) === independentIntentTailRole(tail) ? rawTail : tail;
    const tailRole = independentIntentTailRole(proofTail);
    if (!tailRole) return null;
    const now = Date.now();
    independentGenerationIntentSequence += 1;
    const intent = Object.freeze({
        id: `${now.toString(36)}:${independentGenerationIntentSequence.toString(36)}`,
        earlySelectionKey: String(earlySelectionKey || ''),
        chatKey,
        startedAt: now,
        type: normalizedType,
        toolCapable: independentHostGenerationMayUseTools(normalizedType, hostContext),
        tailIndex,
        tailRole,
        tailBodyHash: hashIndependentIntentText(proofTail.mes || ''),
        tailSwipeId: Number(proofTail?.swipe_id ?? proofTail?.swipeId ?? 0) || 0,
    });
    // Revoke only unfinished or exact same-operation proof. Completed replies
    // from this chat may still be waiting for the deferred runtime and must not
    // disappear merely because the user starts a second message.
    const startIdentity = { chatKey, type: normalizedType, tailIndex, tailRole };
    globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = [...previous.filter(item => !independentIntentSupersededByStart(item, startIdentity)), intent]
        .slice(-INDEPENDENT_GENERATION_INTENT_MAX);
    return intent;
}

function clearIndependentGenerationIntents() {
    cancelIndependentEarlyIntent('chat-changed');
    globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = [];
    globalThis[INDEPENDENT_GENERATION_STOPS_KEY] = [];
}

export function initIndependentGenerationIntentBridge() {
    try { globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY]?.(); } catch {}
    destroyIndependentGenerationIntentBridge();
    const bindings = [
        // END/STOP carries no message owner in SillyTavern. Preserve only an
        // unscoped terminal hint; never fabricate a final正文 hash from the tail.
        [event_types?.GENERATION_ENDED, () => markIndependentGenerationIntentTerminal('generation-ended')],
        [event_types?.GENERATION_STOPPED, () => {
            markIndependentGenerationIntentTerminal('generation-stopped');
            cancelIndependentEarlyIntent('host-stopped');
        }],
        [event_types?.STREAM_TOKEN_RECEIVED, recordIndependentEarlyToken],
        [event_types?.CHARACTER_MESSAGE_RENDERED, payload => markIndependentGenerationIntentCompleted(payload, 'character-rendered')],
        [event_types?.CHAT_CHANGED, clearIndependentGenerationIntents],
    ].filter(([event]) => !!event);
    for (const [event, handler] of bindings) {
        try {
            eventSource?.on?.(event, handler);
            independentIntentBridgeSubscriptions.push({ event, handler });
        } catch {}
    }
    globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY] = destroyIndependentGenerationIntentBridge;
}

export function destroyIndependentGenerationIntentBridge({ clearIntents = false } = {}) {
    cancelIndependentCoreRuntimeWake();
    if (globalThis[INDEPENDENT_EARLY_PACKET_KEY]) cancelIndependentEarlyIntent('bridge-destroyed');
    for (const { event, handler } of independentIntentBridgeSubscriptions) {
        try { eventSource?.off?.(event, handler); } catch {}
    }
    independentIntentBridgeSubscriptions = [];
    if (globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY] === destroyIndependentGenerationIntentBridge) {
        try { delete globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY]; } catch {}
    }
    if (clearIntents) {
        try { delete globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]; } catch {}
        try { delete globalThis[INDEPENDENT_GENERATION_STOPS_KEY]; } catch {}
    }
}

function loadPromptBuilder() {
    if (!promptBuilderPromise) {
        promptBuilderPromise = import('./promptBuilder.js?rmv=1.5.51-narrow1').catch(error => {
            promptBuilderPromise = null;
            throw error;
        });
    }
    return promptBuilderPromise;
}

function loadGenerationGuard() {
    if (!generationGuardPromise) {
        generationGuardPromise = import('./generationGuard.js?rmv=1.5.51-narrow1').catch(error => {
            generationGuardPromise = null;
            throw error;
        });
    }
    return generationGuardPromise;
}

export function prewarmRabbitMirrorGenerationRuntime() {
    return Promise.all([loadPromptBuilder(), loadGenerationGuard()]).then(() => true);
}

function createGenerationScopeKey(type) {
    generationInvocationSequence += 1;
    const generationType = String(type || 'normal').replace(/[^a-z0-9_-]+/gi, '-');
    return `${generationType}:${Date.now().toString(36)}:${generationInvocationSequence.toString(36)}`;
}

export function clearRabbitMirrorPrompt(reason = 'cleared', generationType = '') {
    clearFeedbackCatExtensionPrompt();
    try {
        setExtensionPrompt(INJECT_KEY, '', extension_prompt_types.IN_CHAT, 0, false, extension_prompt_roles.SYSTEM);
        recordRabbitMirrorNoInjection(reason, generationType);
    } catch (error) {
        console.warn('[RabbitMirror] Failed to clear extension prompt:', error);
    }
}

// External reads may outlive the host's generation. Capture only the two tail
// owners (host chat and interceptor copy), not a new full-chat scan or cache.
function captureFollowPrefetchOwner(chat, sequence) {
    const hostChat = currentIndependentIntentContext().chat;
    const capture = messages => {
        if (!Array.isArray(messages)) return null;
        const index = messages.length - 1;
        const message = messages[index];
        return { messages, index, message, body: String(message?.mes || ''), swipe: Number(message?.swipe_id ?? message?.swipeId ?? 0) || 0 };
    };
    return { sequence, chatKey: getCurrentChatKey(chat), input: capture(chat), host: capture(hostChat) };
}

function followPrefetchOwnerMismatch(owner, chat) {
    if (!owner || owner.sequence !== generationInvocationSequence) return 'generation-replaced';
    if (owner.chatKey !== getCurrentChatKey(chat)) return 'chat-changed';
    if (owner.host && currentIndependentIntentContext().chat !== owner.host.messages) return 'host-chat-replaced';
    for (const [name, snapshot] of [['input', owner.input], ['host', owner.host]]) {
        if (!snapshot) continue;
        if (snapshot.messages.length - 1 !== snapshot.index) return `${name}-length-changed`;
        if (snapshot.messages[snapshot.index] !== snapshot.message) return `${name}-tail-replaced`;
        if (String(snapshot.message?.mes || '') !== snapshot.body) return `${name}-body-changed`;
        if ((Number(snapshot.message?.swipe_id ?? snapshot.message?.swipeId ?? 0) || 0) !== snapshot.swipe) return `${name}-swipe-changed`;
    }
    return '';
}

function followPrefetchOwnerIsCurrent(owner, chat) {
    return !followPrefetchOwnerMismatch(owner, chat);
}

function assertFollowPrefetchOwner(owner, chat) {
    if (followPrefetchOwnerIsCurrent(owner, chat)) return;
    const error = new Error('本轮外部参考读取期间正文或聊天已变化，未注入兔子镜请求。');
    error.code = 'RABBIT_MIRROR_EXTERNAL_PREFETCH_STALE';
    error.ownerMismatch = followPrefetchOwnerMismatch(owner, chat);
    error.requestCount = 0;
    throw error;
}

export async function rabbitMirrorGenerateInterceptor(_chat, _contextSize, _abort, type) {
    const settings = getSettings();

    if (settings.generationSource === 'independent') {
        generationInvocationSequence += 1;
        // The full independent runtime is intentionally deferred during page startup.
        // Capture this exact host generation before returning so a fast model cannot
        // finish before the deferred event subscribers exist. Loading is fire-and-forget:
        // it never blocks or joins the host's paid main-generation request.
        if (settings.enabled && settings.autoRabbitMirrorInjection && settings.mode !== 'off') {
            const intent = recordIndependentGenerationIntent(_chat, type,
                settings.independentEarlyBodyEnabled === true ? independentEarlySelectionKey(settings) : '');
            if (settings.independentEarlyBodyEnabled === true) prewarmIndependentEarlyIntent(intent);
        }
        clearRabbitMirrorPrompt('independent-api', type);
        return;
    }

    const skipQuiet = settings.skipQuiet && type === 'quiet';
    const skipImpersonate = settings.skipImpersonate && type === 'impersonate';

    if (!settings.enabled || !settings.autoRabbitMirrorInjection || settings.mode === 'off' || skipQuiet || skipImpersonate) {
        generationInvocationSequence += 1;
        const reason = skipQuiet
            ? 'quiet-skipped'
            : skipImpersonate
                ? 'impersonate-skipped'
                : 'disabled';
        clearRabbitMirrorPrompt(reason, type);
        return;
    }

    const activeFeedback = settings.feedbackCatEnabled !== false ? getActiveFeedbackForCurrentChat(_chat) : null;
    const feedbackPrompt = activeFeedback ? buildFeedbackCatPrompt(activeFeedback) : '';
    const feedbackFinalCheck = activeFeedback ? buildFeedbackCatFinalCheck(activeFeedback) : '';
    // 冻结 0.33.77 的基础生成 Prompt 与拼接位置：基础 Prompt 逐字保持，反馈仅在其后追加。
    // 未选择反馈时不追加任何字符，基础 Prompt 保持逐字不变。
    clearFeedbackCatExtensionPrompt();
    const generationScopeKey = createGenerationScopeKey(type);
    const externalEnabled = settings.externalWorldBookRandomEnabled === true && settings.externalWorldBookMixMode !== 'builtin-only';
    const appearanceEnabled = settings.appearanceReferenceEnabled === true;
    const appearanceRequest = { enabled: appearanceEnabled, revision: String(settings.appearanceReferenceRevision || '') };
    const memoryWorldBookEnabled = settings.memoryScanEnabled === true && settings.memoryWorldBookEnabled === true && !!String(settings.memoryWorldBookId || '').trim();
    const memorySettingsSnapshot = memoryWorldBookEnabled ? {
        memoryScanEnabled: settings.memoryScanEnabled, memoryWorldBookEnabled: settings.memoryWorldBookEnabled,
        memoryWorldBookId: settings.memoryWorldBookId, memoryMaxChars: settings.memoryMaxChars,
        memoryProviderIds: Array.isArray(settings.memoryProviderIds) ? [...settings.memoryProviderIds] : [],
        enabled: settings.enabled, autoRabbitMirrorInjection: settings.autoRabbitMirrorInjection,
        generationSource: settings.generationSource, mode: settings.mode,
    } : null;
    const materialEnabled = externalEnabled || appearanceEnabled || memoryWorldBookEnabled;
    const prefetchOwner = materialEnabled ? captureFollowPrefetchOwner(_chat, generationInvocationSequence) : null;
    const assertAppearanceOwner = () => {
        if (!appearanceEnabled) return;
        const current = getSettings();
        if (current.appearanceReferenceEnabled !== true || current.appearanceReferenceRevision !== appearanceRequest.revision) {
            const error = new Error('外观参考设置在读取期间已改变；本轮未注入兔子镜。');
            error.code = 'RABBIT_MIRROR_APPEARANCE_STALE'; error.requestCount = 0; throw error;
        }
    };
    const [{ buildRabbitMirrorPromptDetails, planRabbitMirrorPromptDetails, renderRabbitMirrorPromptPlan,
        prepareSelectedMemoryForPrompt, memoryRequestSettingsKey, assertMemoryRequestSettings }, {
        attachRabbitMirrorGenerationSelection,
        beginRabbitMirrorGenerationAttempt,
        registerRabbitMirrorFollowBatch,
    }] = await Promise.all([
        loadPromptBuilder(),
        loadGenerationGuard(),
    ]);
    const memorySettingsKey = memoryWorldBookEnabled ? memoryRequestSettingsKey(memorySettingsSnapshot, type) : '';
    const assertMemoryOwner = () => { if (memoryWorldBookEnabled) assertMemoryRequestSettings(getSettings(), memorySettingsKey, type); };
    const generationContext = {
        chat: _chat,
        batchOperation: {
            operationId: generationScopeKey,
            generationType: String(type || 'normal'),
            preview: false,
        },
    };
    let promptDetails;
    let frozenPlan;
    let externalRawMap;
    let appearanceMaterial;
    let memoryMaterial;
    let externalStage = 'runtime';
    try {
        if (materialEnabled) {
            assertFollowPrefetchOwner(prefetchOwner, _chat);
            assertAppearanceOwner();
            assertMemoryOwner();
            let repository;
            if (externalEnabled) {
                repository = await import('./externalWorldBook/store.js?rmv=1.5.51-narrow1');
                assertFollowPrefetchOwner(prefetchOwner, _chat);
                externalStage = 'index';
                await repository.hydrateExternalPoolMetadata();
                assertFollowPrefetchOwner(prefetchOwner, _chat);
                if (repository.getExternalPoolHydrationStatus().enabledMetadataRebuildRequired.length) {
                    const error = new Error('外部库需要先重建抽取索引。');
                    error.code = 'RABBIT_MIRROR_EXTERNAL_METADATA_REBUILD_REQUIRED';
                    error.requestCount = 0;
                    throw error;
                }
            }
            assertAppearanceOwner();
            beginRabbitMirrorGenerationAttempt(_chat, generationScopeKey);
            externalStage = 'selection';
            frozenPlan = planRabbitMirrorPromptDetails({ ...settings, appearanceReferenceEnabled: appearanceEnabled, appearanceReferenceRevision: appearanceRequest.revision }, type, null, generationScopeKey, generationContext);
            if (frozenPlan.selectedExternalIds.length) {
                externalStage = 'selected-read';
                externalRawMap = await repository.getSelectedExternalEntries(frozenPlan.selectedExternalIds);
                assertFollowPrefetchOwner(prefetchOwner, _chat);
            }
            if (frozenPlan.appearanceReference.enabled) {
                externalStage = 'appearance-read';
                const appearance = await import('./appearanceReference.js?rmv=1.5.51-narrow1');
                assertFollowPrefetchOwner(prefetchOwner, _chat); assertAppearanceOwner();
                appearanceMaterial = await appearance.loadAppearanceReferenceMaterial(frozenPlan.appearanceReference.revision);
                assertFollowPrefetchOwner(prefetchOwner, _chat); assertAppearanceOwner();
            }
            if (frozenPlan.memoryWorldBook?.enabled) {
                externalStage = 'memory-read';
                assertFollowPrefetchOwner(prefetchOwner, _chat); assertMemoryOwner();
                memoryMaterial = await prepareSelectedMemoryForPrompt(frozenPlan.args.settings, { generationType: type, hasSharedMemoryTheme: true });
                assertFollowPrefetchOwner(prefetchOwner, _chat); assertMemoryOwner();
            }
            externalStage = 'render';
            promptDetails = renderRabbitMirrorPromptPlan(frozenPlan, externalRawMap, appearanceMaterial, memoryMaterial);
            assertFollowPrefetchOwner(prefetchOwner, _chat);
            assertAppearanceOwner();
            assertMemoryOwner();
        } else {
            beginRabbitMirrorGenerationAttempt(_chat, generationScopeKey);
            promptDetails = buildRabbitMirrorPromptDetails(settings, type, null, generationScopeKey, generationContext);
        }
    } catch (error) {
        if (!materialEnabled) throw error;
        if (frozenPlan?.batchPlan) releasePendingComboBatch({ batchId: frozenPlan.batchPlan.batchId, identity: frozenPlan.batchPlan.identity });
        // A stale completion must not erase a newer interceptor's installed prompt.
        if (!prefetchOwner || prefetchOwner.sequence === generationInvocationSequence) {
            const failure = /^RABBIT_MIRROR_(?:APPEARANCE|MEMORY)_/.test(String(error?.code || ''))
                ? { code: error.code, message: error.message } : describeExternalWorldBookPreflightFailure(error);
            const mismatch = error?.code === 'RABBIT_MIRROR_EXTERNAL_PREFETCH_STALE' ? followPrefetchOwnerMismatch(prefetchOwner, _chat) : '';
            lastFollowExternalPreflightFailure = Object.freeze({ code: failure.code, stage: externalStage, ownerMismatch: mismatch, requestCount: 0, time: Date.now() });
            clearRabbitMirrorPrompt('external-material-preflight-rejected', type);
            globalThis.toastr?.warning?.(`${failure.message} 本轮未注入兔子镜。[${failure.code} / ${externalStage}${mismatch ? ` / ${mismatch}` : ''}]`);
            console.warn('[RabbitMirror] Follow external preflight:', lastFollowExternalPreflightFailure);
        }
        console.warn('[RabbitMirror] Follow external material preflight rejected; no RabbitMirror injection.');
        return;
    } finally {
        externalRawMap?.clear?.();
        appearanceMaterial = null;
        memoryMaterial = null;
    }
    if (materialEnabled) lastFollowExternalPreflightFailure = null;
    attachRabbitMirrorGenerationSelection(promptDetails.metadata);
    const basePrompt = promptDetails.prompt;
    if (!basePrompt) {
        clearRabbitMirrorPrompt(promptDetails.metadata?.disabled ? 'directive-skipped' : 'empty', type);
        return;
    }
    const prompt = feedbackPrompt
        ? `${basePrompt}\n\n${feedbackPrompt}${feedbackFinalCheck ? `\n\n${feedbackFinalCheck}` : ''}`
        : basePrompt;
    const role = settings.role === 'user' ? extension_prompt_roles.USER : settings.role === 'assistant' ? extension_prompt_roles.ASSISTANT : extension_prompt_roles.SYSTEM;

    setExtensionPrompt(
        INJECT_KEY,
        prompt,
        extension_prompt_types.IN_CHAT,
        Number(settings.depth) || 0,
        false,
        role,
    );
    if (promptDetails.batchPlan) {
        const marked = markPendingBatchAttempt(promptDetails.batchPlan);
        const registered = marked && registerRabbitMirrorFollowBatch(
            _chat,
            generationScopeKey,
            promptDetails.batchPlan,
            promptDetails.metadata,
        );
        if (!registered) {
            if (marked) releasePendingComboBatch({
                batchId: promptDetails.batchPlan.batchId,
                identity: promptDetails.batchPlan.identity,
            });
            clearRabbitMirrorPrompt('multiface-attempt-registration-failed', type);
            console.warn('[RabbitMirror] Follow multiface attempt was not registered; the host request continues without RabbitMirror injection.');
            return;
        }
    }
    recordRabbitMirrorInjection({
        prompt,
        basePrompt,
        generationType: type,
        metadata: promptDetails.metadata,
    });
    if (activeFeedback && feedbackPrompt) markFeedbackCatInjected(activeFeedback, type, feedbackPrompt);
}
