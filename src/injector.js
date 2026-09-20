import { eventSource, event_types, setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../../script.js';
import * as hostRuntime from '../../../../../script.js';
import { MODULE_NAME, getSettings } from './settings.js?rmv=1.5.53-image1';
import {
    buildFeedbackCatFinalCheck,
    buildFeedbackCatPrompt,
    clearFeedbackCatExtensionPrompt,
    getActiveFeedbackForCurrentChat,
    markFeedbackCatInjected,
} from './feedbackCat.js?rmv=1.5.53-cn-boundary1';
import { recordRabbitMirrorInjection, recordRabbitMirrorNoInjection } from './tokenMeter.js?rmv=1.5.53-visualquick1';
import { getCurrentChatKey, markPendingBatchAttempt, releasePendingComboBatch } from './storage.js?rmv=1.5.53-visualquick1';
import { describeExternalWorldBookPreflightFailure } from './externalWorldBook/errors.js?rmv=1.5.53-cn-boundary1';
import { independentGenerationTiming } from './independentTiming.js?rmv=1.5.53-timing1';

const INJECT_KEY = `${MODULE_NAME}:auto_injection`;

let generationInvocationSequence = 0;
let independentGenerationIntentSequence = 0;
let promptBuilderPromise = null;
let generationGuardPromise = null;
let lastFollowExternalPreflightFailure = null;

export function getLastFollowExternalPreflightFailure() { return lastFollowExternalPreflightFailure; }

const INDEPENDENT_GENERATION_INTENTS_KEY = '__rabbitMirrorIndependentGenerationIntents';
// Runtime-only references survive object spreads but never enter JSON/Prompt.
const INDEPENDENT_INTENT_OWNER = Symbol.for('rabbitMirror.independentIntentOwner');
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
const INDEPENDENT_MANUAL_INTENTS_KEY = '__rabbitMirrorIndependentManualIntentsV1';
const INDEPENDENT_MANUAL_BRIDGE_KEY = '__rabbitMirrorIndependentManualBridge';
const INDEPENDENT_MANUAL_BIND_KEY = '__rabbitMirrorBindIndependentManualIntent';

// Opt-in, in-memory scalar diagnostics. Never serialize host payloads or owners.
const MANUAL_DIAG_VERSION = '1.5.53-manualdiag1';
const MANUAL_DIAG_HOOK = '__rabbitMirrorManualEntryDiagnosticRecord';
const MANUAL_DIAG_EVENTS = new Set(['start','stop','host-event','host-start','user-sent','interceptor','manual-record','manual-bind','bridge','placeholder','click','runtime-start','runtime-stop']);
const MANUAL_DIAG_NUMBERS = new Set(['index','messageCount','intentCount','boundCount','cancelledCount','consumedCount','subscriptionCount','pendingFrames','readyFrames','visiblePendingFrames']);
const MANUAL_DIAG_BOOLEANS = new Set(['enabled','autoInjection','modeOff','sourceIndependent','timingManual','runtimeCurrent','bridgePresent','elementFound','intentPresent','sameChat','sameKey','sameTail','alreadyBound','dryRun','consumed','cancelled','hostFound','connected','hasButton','hidden','visible','returned','candidateEligible']);
const MANUAL_DIAG_ENUMS = new Set(['normal','continue','swipe','regenerate','quiet','impersonate','other','auto','manual','off','unknown','created','reused','rejected','bound','unbound','entered','existing','missing-element','missing-intent','inactive','unavailable','ready','GENERATION_STARTED','MESSAGE_SENT','GENERATION_ENDED','GENERATION_STOPPED','STREAM_TOKEN_RECEIVED','MESSAGE_RECEIVED','CHARACTER_MESSAGE_RENDERED','CHAT_CHANGED',MANUAL_DIAG_VERSION]);
let manualEntryDiagnosticSession = null;
let manualEntryDiagnosticReport = '';
function manualEntryDiagnosticFields(values = {}) {
    const clean = {};
    for (const [key, value] of Object.entries(values)) {
        if (MANUAL_DIAG_NUMBERS.has(key) && Number.isSafeInteger(value) && value >= -1) clean[key] = value;
        else if (MANUAL_DIAG_BOOLEANS.has(key) && typeof value === 'boolean') clean[key] = value;
        else if (['type','timing','result','event','runtimeVersion'].includes(key) && MANUAL_DIAG_ENUMS.has(value)) clean[key] = value;
    }
    return clean;
}
function recordManualEntryDiagnostic(event, values = {}) {
    try {
        const session = manualEntryDiagnosticSession;
        if (!session || !MANUAL_DIAG_EVENTS.has(event)) return;
        const fields = manualEntryDiagnosticFields(values);
        const counter = event === 'host-event' ? `${event}:${fields.event || 'unknown'}` : event;
        session.counts[counter] = (session.counts[counter] || 0) + 1;
        // Tokens are counted, never copied into the timeline. Retain the first
        // boundary and the latest 199 records if a long session fills the buffer.
        if (event === 'host-event' && fields.event === 'STREAM_TOKEN_RECEIVED') return;
        if (session.rows.length >= 200) { session.rows.splice(1, 1); session.dropped += 1; }
        session.rows.push({ ms: Math.max(0, Date.now() - session.started), event, ...fields });
    } catch { /* Diagnostics must never interrupt generation. */ }
}
function manualEntryDiagnosticSnapshot() {
    try {
        const settings = getSettings(), chat = currentIndependentIntentChat();
        const intents = currentIndependentManualIntents();
        const bridge = globalThis[INDEPENDENT_MANUAL_BRIDGE_KEY];
        const core = typeof bridge?.diagnosticSnapshot === 'function' ? bridge.diagnosticSnapshot() : { result: 'unavailable' };
        return manualEntryDiagnosticFields({ enabled: settings.enabled !== false,
            autoInjection: settings.autoRabbitMirrorInjection !== false, modeOff: settings.mode === 'off',
            sourceIndependent: settings.generationSource === 'independent', timing: independentGenerationTiming(settings),
            messageCount: chat.length, intentCount: intents.length,
            boundCount: intents.filter(i => i.message && !i.cancelled).length,
            cancelledCount: intents.filter(i => i.cancelled).length, consumedCount: intents.filter(i => i.consumed).length,
            subscriptionCount: independentIntentBridgeSubscriptions.length, bridgePresent: typeof bridge === 'function', ...core });
    } catch { return { result: 'unavailable' }; }
}
export function startManualEntryDiagnostic() {
    manualEntryDiagnosticSession = { started: Date.now(), counts: {}, rows: [], dropped: 0 };
    manualEntryDiagnosticReport = '';
    globalThis[MANUAL_DIAG_HOOK] = recordManualEntryDiagnostic;
    recordManualEntryDiagnostic('start', manualEntryDiagnosticSnapshot());
}
export function stopManualEntryDiagnostic() {
    if (!manualEntryDiagnosticSession) return manualEntryDiagnosticReport;
    recordManualEntryDiagnostic('stop', manualEntryDiagnosticSnapshot());
    const session = manualEntryDiagnosticSession;
    manualEntryDiagnosticSession = null;
    if (globalThis[MANUAL_DIAG_HOOK] === recordManualEntryDiagnostic) delete globalThis[MANUAL_DIAG_HOOK];
    manualEntryDiagnosticReport = [
        `RabbitMirror 手动入口诊断 ${MANUAL_DIAG_VERSION}`,
        `生成时间: ${new Date().toISOString()}`,
        '边界：手动入口、宿主事件、消息绑定与外置框挂载。此报告独立于外部性能诊断。',
        '隐私：仅布尔值、计数及固定状态码；不记录聊天正文、Prompt、密钥、聊天标识或事件原始内容。',
        '诊断不调用模型；计数为 0 只表示本次采集未记录到，不证明宿主从未触发。',
        'runtimeVersion=unavailable 或缺失表示核心诊断接口不可用，不能由此断言核心未运行。',
        `记录上限 200 条；省略中间记录 ${session.dropped} 条；事件计数保留。`,
        '【计数】', JSON.stringify(session.counts), '【时序】', ...session.rows.map(row => JSON.stringify(row))
    ].join('\n');
    return manualEntryDiagnosticReport;
}
export function getManualEntryDiagnosticState() {
    return { active: !!manualEntryDiagnosticSession, report: manualEntryDiagnosticReport };
}


function currentIndependentManualIntents() {
    return Array.isArray(globalThis[INDEPENDENT_MANUAL_INTENTS_KEY])
        ? globalThis[INDEPENDENT_MANUAL_INTENTS_KEY] : [];
}

function notifyIndependentManualIntent(intent) {
    try { globalThis[INDEPENDENT_MANUAL_BRIDGE_KEY]?.({ kind: 'changed', intent }); } catch {}
}

function independentManualIntentCandidateIndex(intent, chat, processor = null) {
    if (!intent || intent.cancelled || intent.chat !== chat || chat[intent.tailIndex] !== intent.tail) return null;
    if (intent.message) {
        return chat[intent.index] === intent.message
            && (Number(intent.message.swipe_id ?? intent.message.swipeId ?? 0) || 0) === intent.swipe
            ? intent.index : null;
    }
    if (intent.type === 'normal') {
        if (independentIntentTailRole(intent.tail) !== intent.tailRole
            || String(intent.tail.mes || '') !== intent.tailSource
            || (Number(intent.tail.swipe_id ?? intent.tail.swipeId ?? 0) || 0) !== intent.tailSwipe) return null;
        return isIndependentEligibleAssistantMessage(chat[intent.tailIndex + 1]) ? intent.tailIndex + 1 : null;
    }
    if (!['continue', 'swipe', 'regenerate'].includes(intent.type)
        || intent.tailRole !== 'assistant' || !isIndependentEligibleAssistantMessage(intent.tail)) return null;
    const observedStream = processor && Number(processor.messageId) === intent.tailIndex
        && String(processor.type || '').toLowerCase() === intent.type;
    const bodyChanged = String(intent.tail.mes || '') !== intent.tailSource
        || (Number(intent.tail.swipe_id ?? intent.tail.swipeId ?? 0) || 0) !== intent.tailSwipe;
    return bodyChanged || observedStream ? intent.tailIndex : null;
}

// Called by existing host events and renderer mounts. This only binds intentions
// captured during this page session; it never discovers historical messages.
function bindIndependentManualIntent(payload, processor = null) {
    if (!currentIndependentManualIntents().length) { recordManualEntryDiagnostic('manual-bind', {result:'missing-intent'}); return false; }
    const settings = getSettings();
    if (settings.generationSource !== 'independent' || independentGenerationTiming(settings) !== 'manual') { recordManualEntryDiagnostic('manual-bind', {result:'inactive'}); return false; }
    const chat = currentIndependentIntentChat();
    const chatKey = String(getCurrentChatKey(chat) || '');
    const exactIndex = payload === undefined ? null : resolveIndependentIntentCompletionIndex(payload, chat);
    if (payload !== undefined && !Number.isInteger(exactIndex)) return false;
    let changed = false;
    for (const intent of currentIndependentManualIntents()) {
        recordManualEntryDiagnostic('manual-bind', {index: Number.isInteger(exactIndex)?exactIndex:-1, sameKey:intent.chatKey===chatKey, sameChat:intent.chat===chat, sameTail:chat[intent.tailIndex]===intent.tail, cancelled:!!intent.cancelled, consumed:!!intent.consumed, alreadyBound:!!intent.message});
        if (intent.chatKey !== chatKey || intent.cancelled || intent.consumed) continue;
        const index = independentManualIntentCandidateIndex(intent, chat, processor);
        recordManualEntryDiagnostic('manual-bind', {candidateEligible:Number.isInteger(index)});
        if (!Number.isInteger(index) || (exactIndex !== null && exactIndex !== index)) continue;
        intent.index = index;
        intent.message = chat[index];
        intent.swipe = Number(intent.message.swipe_id ?? intent.message.swipeId ?? 0) || 0;
        changed = true;
        notifyIndependentManualIntent(intent);
    }
    recordManualEntryDiagnostic('manual-bind', {result:changed?'bound':'unbound'});
    return changed;
}

function recordIndependentManualToken() {
    const ctx = currentIndependentIntentContext();
    const processor = hostRuntime.streamingProcessor || ctx.streamingProcessor;
    if (processor && Number.isSafeInteger(processor.messageId)) bindIndependentManualIntent(processor.messageId, processor);
}

function cancelReplacedIndependentManualIntents(type) {
    if (!['continue', 'swipe', 'regenerate'].includes(type)) return;
    const chat = currentIndependentIntentChat();
    const tail = chat.at(-1);
    const chatKey = String(getCurrentChatKey(chat) || '');
    for (const intent of currentIndependentManualIntents()) {
        if (intent.cancelled || intent.chat !== chat || intent.chatKey !== chatKey) continue;
        if (intent.message === tail || (!intent.message && intent.tail === tail && intent.tailRole === 'assistant')) {
            intent.cancelled = true;
            notifyIndependentManualIntent(intent);
        }
    }
}

// Host generation starts before a new user message is appended. Keep that
// exact boundary until MESSAGE_SENT, rather than treating an old reply as new.
let independentManualHostStart = null;
function beginIndependentManualHostGeneration(type, _options, dryRun = false) {
    const settings = getSettings();
    const normalizedType = String(type || 'normal').trim().toLowerCase() || 'normal';
    recordManualEntryDiagnostic('host-start', {type:MANUAL_DIAG_ENUMS.has(normalizedType)?normalizedType:'other', dryRun:!!dryRun, enabled:settings.enabled!==false, autoInjection:settings.autoRabbitMirrorInjection!==false, modeOff:settings.mode==='off', sourceIndependent:settings.generationSource==='independent', timing:independentGenerationTiming(settings)});
    if (dryRun || settings.enabled === false || settings.autoRabbitMirrorInjection === false
        || settings.mode === 'off' || settings.generationSource !== 'independent'
        || independentGenerationTiming(settings) !== 'manual'
        || normalizedType !== 'normal') return;
    const chat = currentIndependentIntentChat();
    independentManualHostStart = { chat, chatKey: String(getCurrentChatKey(chat) || ''),
        tail: chat.at(-1), tailIndex: chat.length - 1, type: normalizedType };
    recordIndependentManualIntent(normalizedType);
}
function bindIndependentManualUserMessage(payload) {
    const start = independentManualHostStart;
    const chat = currentIndependentIntentChat();
    recordManualEntryDiagnostic('user-sent', {intentPresent:!!start, sameChat:start?.chat===chat, sameKey:start?.chatKey===String(getCurrentChatKey(chat)||''), sameTail:!!start&&(start.tailIndex<0||chat[start.tailIndex]===start.tail), messageCount:chat.length});
    if (!start || start.type !== 'normal' || start.chat !== chat
        || start.chatKey !== String(getCurrentChatKey(chat) || '')
        || (start.tailIndex >= 0 && chat[start.tailIndex] !== start.tail)) return;
    const raw = typeof payload === 'object' && payload !== null
        ? payload.messageId ?? payload.message_id ?? payload.mesid ?? payload.index ?? payload.id : payload;
    if (typeof raw === 'string' ? !/^\d+$/.test(raw.trim()) : !Number.isSafeInteger(raw)) return;
    const index = Number(raw);
    if (index !== start.tailIndex + 1 || index !== chat.length - 1 || chat[index]?.is_user !== true) return;
    const settings = getSettings();
    if (settings.enabled === false || settings.autoRabbitMirrorInjection === false || settings.mode === 'off'
        || settings.generationSource !== 'independent' || independentGenerationTiming(settings) !== 'manual') return;
    recordIndependentManualIntent('normal', { reuse: true });
}
function recordIndependentManualIntent(type, { reuse = false } = {}) {
    const normalizedType = String(type || 'normal').trim().toLowerCase() || 'normal';
    if (!INDEPENDENT_GENERATION_INTENT_TYPES.has(normalizedType)) return null;
    const chat = currentIndependentIntentChat();
    const chatKey = String(getCurrentChatKey(chat) || '');
    const tailIndex = chat.length - 1;
    const tail = chat[tailIndex];
    const tailRole = independentIntentTailRole(tail);
    if (!chatKey || !tail || !tailRole || (normalizedType !== 'normal' && tailRole !== 'assistant')) { recordManualEntryDiagnostic('manual-record', {result:'rejected'}); return null; }
    if (reuse) {
        const existing = currentIndependentManualIntents().slice().reverse().find(intent =>
            !intent.cancelled && !intent.consumed && intent.type === normalizedType && intent.chat === chat
            && intent.chatKey === chatKey && intent.tailIndex === tailIndex && intent.tail === tail
            && intent.tailSource === String(tail.mes || '')
            && intent.tailSwipe === (Number(tail.swipe_id ?? tail.swipeId ?? 0) || 0));
        if (existing) { recordManualEntryDiagnostic('manual-record', {result:'reused'}); return existing; }
    }
    // Preserve an earlier reply's waiting frame when a later normal turn starts.
    // An unbound intention is superseded only after trying its exact old target.
    bindIndependentManualIntent();
    const previous = currentIndependentManualIntents();
    for (const intent of previous) {
        if (intent.chat === chat && intent.chatKey === chatKey && !intent.message && !intent.cancelled) {
            intent.cancelled = true;
            notifyIndependentManualIntent(intent);
        }
    }
    independentGenerationIntentSequence += 1;
    const intent = { id: `manual:${Date.now().toString(36)}:${independentGenerationIntentSequence.toString(36)}`,
        type: normalizedType, chatKey, chat, tail, tailIndex, tailRole,
        tailSwipe: Number(tail.swipe_id ?? tail.swipeId ?? 0) || 0,
        tailSource: String(tail.mes || ''), index: -1, message: null, swipe: 0, cancelled: false, consumed: false };
    globalThis[INDEPENDENT_MANUAL_INTENTS_KEY] = [...previous, intent];
    recordManualEntryDiagnostic('manual-record', {result:'created', type:normalizedType, index:tailIndex});
    scheduleIndependentCoreRuntimeWake();
    notifyIndependentManualIntent(intent);
    return intent;
}

function independentEarlyIntentEnabled(settings = getSettings(), ctx = currentIndependentIntentContext()) {
    return settings.enabled !== false && settings.autoRabbitMirrorInjection !== false
        && settings.generationSource === 'independent' && settings.mode !== 'off'
        && independentGenerationTiming(settings) === 'auto'
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
    const processor = hostRuntime?.streamingProcessor || currentIndependentIntentContext().streamingProcessor;
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
    const owner = intent[INDEPENDENT_INTENT_OWNER];
    if (owner && (owner.chat !== messages || owner.tail !== tail)) return null;
    if (owner?.message && (messages[owner.index] !== owner.message
        || (Number(owner.message.swipe_id ?? owner.message.swipeId ?? 0) || 0) !== owner.swipe)) return null;
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
        if (typeof value === 'string' ? !/^\d+$/.test(value.trim()) : typeof value !== 'number' || !Number.isSafeInteger(value)) continue;
        const index = Number(value);
        if (Number.isInteger(index) && index >= 0 && isIndependentEligibleAssistantMessage(chat[index])) return index;
    }
    return null;
}

function independentIntentBoundOwner(intent, chat, index, event) {
    const owner = intent[INDEPENDENT_INTENT_OWNER];
    if (!owner || owner.chat !== chat || owner.tail !== chat[Number(intent.tailIndex)]
        || independentIntentCandidateIndex(intent, chat) !== index) return null;
    const message = chat[index];
    const swipe = Number(message?.swipe_id ?? message?.swipeId ?? 0) || 0;
    if (owner.message && (owner.message !== message || owner.index !== index || owner.swipe !== swipe)) return null;
    return Object.freeze({ ...owner, message, index, swipe,
        receivedAt: event === 'received' ? Date.now() : owner.receivedAt,
        renderedAt: event === 'rendered' ? Date.now() : owner.renderedAt,
    });
}

function markIndependentGenerationIntentReceived(payload) {
    const chat = currentIndependentIntentChat();
    const chatKey = String(getCurrentChatKey(chat) || '');
    const index = resolveIndependentIntentCompletionIndex(payload, chat);
    if (!chatKey || !Number.isInteger(index)) return false;
    let changed = false;
    globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = currentIndependentGenerationIntents().map(intent => {
        if (intent.chatKey !== chatKey) return intent;
        const owner = independentIntentBoundOwner(intent, chat, index, 'received');
        if (!owner) return intent;
        changed = true;
        // RECEIVE binds an owner only. It is not a final-response assertion.
        return Object.freeze({ ...intent, [INDEPENDENT_INTENT_OWNER]: owner });
    });
    return changed;
}

function independentIntentHostIsActive(ctx = currentIndependentIntentContext()) {
    if ([ctx.isGenerating, ctx.is_generating, ctx.is_send_press,
        globalThis.is_send_press, globalThis.is_group_generating].some(value => value === true)) return true;
    try {
        if (hostRuntime.is_send_press === true || hostRuntime.isGenerating?.() === true) return true;
        if (globalThis.document?.querySelector?.('#chat .mes.streaming, #chat .mes[data-is-streaming="true"], #chat .mes[is_generating="true"], #chat .mes[data-generating="true"]')) return true;
    } catch { return true; }
    const processor = hostRuntime.streamingProcessor || ctx.streamingProcessor;
    return !!(processor && processor.isFinished === false && processor.isStopped !== true
        && processor.abortController?.signal?.aborted !== true);
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
        const owner = independentIntentBoundOwner(intent, chat, index, 'rendered');
        if (!owner) return intent;
        changed = true;
        const toolCapable = intent.toolCapable !== false || independentHostGenerationMayUseTools(intent.type);
        const finalProof = independentHostRenderProof(index, toolCapable);
        const next = { ...intent, toolCapable, [INDEPENDENT_INTENT_OWNER]: owner };
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
    const currentOperation = intents.slice().reverse().find(intent => intent.chatKey === chatKey && !intent.terminalAt);
    let changed = false;
    const next = intents.map(intent => {
        if (String(intent?.chatKey || '') !== chatKey) return intent;
        if (intent.terminalAt) return intent;
        changed = true;
        if (intent.auxiliaryTerminalPending === true) {
            const next = { ...intent, auxiliaryTerminalAt: Date.now(), auxiliaryTerminalReason: String(reason || '').slice(0, 64) };
            delete next.auxiliaryTerminalPending;
            delete next.auxiliaryStartedAt;
            return Object.freeze(next);
        }
        const next = { ...intent,
            terminalAt: Date.now(), terminalReason: String(reason || '').slice(0, 64),
        };
        const owner = intent[INDEPENDENT_INTENT_OWNER];
        const index = Number(owner?.index);
        if (intent !== currentOperation || intent.terminalAt || reason !== 'generation-ended'
            || intent.intermediateAt || !owner?.message || (!owner.receivedAt && !owner.renderedAt)
            || !independentIntentBoundOwner(intent, chat, index, '') || independentIntentHostIsActive()) return Object.freeze(next);
        const toolCapable = intent.toolCapable !== false || independentHostGenerationMayUseTools(intent.type);
        const proof = independentHostRenderProof(index, toolCapable);
        const processor = hostRuntime.streamingProcessor || currentIndependentIntentContext().streamingProcessor;
        if (proof === 'stream-tool-intermediate' || processor?.isStopped === true || processor?.abortController?.signal?.aborted === true) return Object.freeze(next);
        const hadRenderedProof = owner.renderedAt && independentIntentHasCompletedProof(intent);
        if (!hadRenderedProof && toolCapable !== false && proof !== 'stream-final') return Object.freeze(next);
        // A terminal may complete an exact received non-tool owner, or reconcile
        // postprocessing of a previously rendered owner. Never guess a tail.
        return Object.freeze({ ...next, toolCapable, completedAt: Date.now(),
            completionReason: hadRenderedProof ? 'rendered-ended' : 'received-ended',
            finalIndex: index, finalBodyHash: hashIndependentIntentText(owner.message.mes || ''),
            finalProof: hadRenderedProof ? intent.finalProof : 'received-ended',
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
        [INDEPENDENT_INTENT_OWNER]: Object.freeze({
            chat: Array.isArray(hostContext.chat) ? hostContext.chat : messages,
            tail: proofTail, message: null, index: -1, swipe: 0, receivedAt: 0, renderedAt: 0,
        }),
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
    independentManualHostStart = null;
    cancelIndependentEarlyIntent('chat-changed');
    globalThis[INDEPENDENT_GENERATION_INTENTS_KEY] = [];
    globalThis[INDEPENDENT_GENERATION_STOPS_KEY] = [];
    for (const intent of currentIndependentManualIntents()) intent.cancelled = true;
    globalThis[INDEPENDENT_MANUAL_INTENTS_KEY] = [];
    try { globalThis[INDEPENDENT_MANUAL_BRIDGE_KEY]?.({ kind: 'clear' }); } catch {}
}

export function initIndependentGenerationIntentBridge() {
    try { globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY]?.(); } catch {}
    destroyIndependentGenerationIntentBridge();
    const bindings = [
        [event_types?.GENERATION_STARTED, beginIndependentManualHostGeneration],
        [event_types?.MESSAGE_SENT, bindIndependentManualUserMessage],
        // END/STOP carries no message owner. Only the exact previously bound
        // operation may use END to reconcile its non-tool/final-render proof.
        [event_types?.GENERATION_ENDED, () => { independentManualHostStart = null; markIndependentGenerationIntentTerminal('generation-ended'); }],
        [event_types?.GENERATION_STOPPED, () => {
            independentManualHostStart = null;
            markIndependentGenerationIntentTerminal('generation-stopped');
            cancelIndependentEarlyIntent('host-stopped');
        }],
        [event_types?.STREAM_TOKEN_RECEIVED, text => { recordIndependentEarlyToken(text); recordIndependentManualToken(); }],
        [event_types?.MESSAGE_RECEIVED, payload => { markIndependentGenerationIntentReceived(payload); bindIndependentManualIntent(payload); }],
        [event_types?.CHARACTER_MESSAGE_RENDERED, payload => { markIndependentGenerationIntentCompleted(payload, 'character-rendered'); bindIndependentManualIntent(payload); }],
        [event_types?.CHAT_CHANGED, clearIndependentGenerationIntents],
    ].filter(([event]) => !!event);
    for (const [event, handler] of bindings) {
        try {
            const name = ['GENERATION_STARTED','MESSAGE_SENT','GENERATION_ENDED','GENERATION_STOPPED','STREAM_TOKEN_RECEIVED','MESSAGE_RECEIVED','CHARACTER_MESSAGE_RENDERED','CHAT_CHANGED'].find(key => event_types?.[key] === event) || 'other';
            const observedHandler = (...args) => { recordManualEntryDiagnostic('host-event', {event:name}); return handler(...args); };
            eventSource?.on?.(event, observedHandler);
            independentIntentBridgeSubscriptions.push({ event, handler: observedHandler });
        } catch {}
    }
    globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY] = destroyIndependentGenerationIntentBridge;
    globalThis[INDEPENDENT_MANUAL_BIND_KEY] = bindIndependentManualIntent;
}

export function destroyIndependentGenerationIntentBridge({ clearIntents = false } = {}) {
    stopManualEntryDiagnostic();
    independentManualHostStart = null;
    cancelIndependentCoreRuntimeWake();
    if (globalThis[INDEPENDENT_EARLY_PACKET_KEY]) cancelIndependentEarlyIntent('bridge-destroyed');
    for (const { event, handler } of independentIntentBridgeSubscriptions) {
        try { eventSource?.off?.(event, handler); } catch {}
    }
    independentIntentBridgeSubscriptions = [];
    if (globalThis[INDEPENDENT_MANUAL_BIND_KEY] === bindIndependentManualIntent) delete globalThis[INDEPENDENT_MANUAL_BIND_KEY];
    if (globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY] === destroyIndependentGenerationIntentBridge) {
        try { delete globalThis[INDEPENDENT_GENERATION_INTENT_BRIDGE_CLEANUP_KEY]; } catch {}
    }
    if (clearIntents) {
        try { delete globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]; } catch {}
        try { delete globalThis[INDEPENDENT_GENERATION_STOPS_KEY]; } catch {}
        for (const intent of currentIndependentManualIntents()) intent.cancelled = true;
        try { delete globalThis[INDEPENDENT_MANUAL_INTENTS_KEY]; } catch {}
        try { globalThis[INDEPENDENT_MANUAL_BRIDGE_KEY]?.({ kind: 'clear' }); } catch {}
    }
}

function loadPromptBuilder() {
    if (!promptBuilderPromise) {
        promptBuilderPromise = import('./promptBuilder.js?rmv=1.5.53-image1').catch(error => {
            promptBuilderPromise = null;
            throw error;
        });
    }
    return promptBuilderPromise;
}

function loadGenerationGuard() {
    if (!generationGuardPromise) {
        generationGuardPromise = import('./generationGuard.js?rmv=1.5.53-image1').catch(error => {
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
    recordManualEntryDiagnostic('interceptor', {type:MANUAL_DIAG_ENUMS.has(type)?type:type==null?'normal':'other', sourceIndependent:settings.generationSource==='independent', timing:independentGenerationTiming(settings)});
    const operationType = String(type || '').trim().toLowerCase();
    cancelReplacedIndependentManualIntents(operationType);
    if (['continue', 'swipe', 'regenerate'].includes(operationType)) {
        const hostChat = currentIndependentIntentChat();
        const index = Array.isArray(_chat) ? _chat.length - 1 : -1;
        const tail = hostChat[index];
        if (index >= 0 && index === hostChat.length - 1 && isIndependentEligibleAssistantMessage(tail)
            && independentIntentTailRole(_chat[index]) === 'assistant'
            && getCurrentChatKey(_chat) === getCurrentChatKey(hostChat)
            && tail.extra?.rabbitMirrorOwnerLineage) {
            // Replacing the body revokes restore lineage even while generation
            // is disabled. Preserve the previously paid result itself.
            tail.extra.rabbitMirrorOwnerLineage = { revoked: true,
                swipe: Number(tail.swipe_id ?? tail.swipeId ?? 0) || 0 };
        }
    }

    if (settings.generationSource === 'independent') {
        generationInvocationSequence += 1;
        // The full independent runtime is intentionally deferred during page startup.
        // Capture this exact host generation before returning so a fast model cannot
        // finish before the deferred event subscribers exist. Loading is fire-and-forget:
        // it never blocks or joins the host's paid main-generation request.
        const timing = independentGenerationTiming(settings);
        if (settings.enabled && settings.autoRabbitMirrorInjection && settings.mode !== 'off' && timing === 'auto') {
            const intent = recordIndependentGenerationIntent(_chat, type,
                settings.independentEarlyBodyEnabled === true ? independentEarlySelectionKey(settings) : '');
            if (settings.independentEarlyBodyEnabled === true) prewarmIndependentEarlyIntent(intent);
        } else if (timing === 'manual') {
            recordIndependentManualIntent(type, { reuse: true });
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
    const explicitTextFace = Array.isArray(settings.rabbitMirrorPresentationModes)
        && settings.rabbitMirrorPresentationModes.slice(0, Math.min(5, Math.max(1, Number(settings.rabbitMirrorFaceCount) || 1))).includes('text');
    const externalEnabled = (settings.externalWorldBookRandomEnabled === true && settings.externalWorldBookMixMode !== 'builtin-only') || explicitTextFace;
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
                repository = await import('./externalWorldBook/store.js?rmv=1.5.53-text1');
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
                const appearance = await import('./appearanceReference.js?rmv=1.5.53-cn-boundary1');
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
