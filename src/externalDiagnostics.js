import { sanitizeExternalTransportSummary as sanitizeTransportSummary, getRecentIndependentTransportDiagnostics, clearRecentIndependentTransportDiagnostics } from './transportDiagnostics.js?rmv=1.5.51-narrow1';

const DIAG_VERSION = '1.5.50-externaldiag-transport1';
const MAX_ENTRIES = 1800;
const STALL_INTERVAL_MS = 1000;
const STALL_THRESHOLD_MS = 250;
const CHAT_SAMPLE_DELAYS = [0, 500, 2000];
const MAINTENANCE_WINDOW_MS = 10000;

const moduleUrl = (() => { try { return new URL(import.meta.url, globalThis.location?.href || 'http://localhost/'); } catch { return null; } })();
const rabbitMirrorRootPath = (() => {
    try {
        const path = String(moduleUrl?.pathname || '');
        const marker = '/src/';
        const index = path.lastIndexOf(marker);
        return index >= 0 ? path.slice(0, index + 1) : '';
    } catch { return ''; }
})();

let entries = [];
let startedAt = 0;
let sequence = 0;
let cleanup = [];
let hostEventCleanup = [];
let hostEventInstallTimer = 0;
let chatObserver = null;
let firstTextObservers = new Map();
let chatSampleTimers = new Set();
let activeSend = null;
let sendSequence = 0;
let maintenanceSequence = 0;
let maintenanceWindows = [];
let initialized = false;
let transportRows = [];

// The request parser sends only a scalar transport summary. Revalidate the
// event at this boundary; arbitrary detail fields and provider strings must
// never enter external reports, even through a forged public event.
export function sanitizeExternalTransportSummary(value) {
    return sanitizeTransportSummary(value);
}

function installTransportMetadataListener() {
    if (typeof globalThis.addEventListener !== 'function') return;
    const listener = event => {
        if (!initialized) return;
        const summary = sanitizeExternalTransportSummary(event?.detail?.transport);
        if (!summary) return;
        const stamp = Number(event?.detail?.transportRequestStamp ?? event?.detail?.ts);
        const ts = Number.isFinite(stamp) && stamp > 0 ? stamp : Date.now();
        // Internal postprocessing republishes the same request timestamp. Update
        // its summary rather than pretend it was a new paid request.
        const existing = transportRows.find(row => row.ts === ts);
        if (existing) existing.summary = summary;
        else transportRows.push({ ts, summary });
        if (transportRows.length > 12) transportRows.splice(0, transportRows.length - 12);
    };
    globalThis.addEventListener('rabbitmirror:independent-api-diagnostic', listener);
    cleanup.push(() => globalThis.removeEventListener?.('rabbitmirror:independent-api-diagnostic', listener));
}

function now() {
    try { return performance.now(); } catch { return Date.now(); }
}
function wallNow() {
    try { return new Date().toISOString(); } catch { return ''; }
}
function safeString(value, max = 180) {
    const text = String(value ?? '').replace(/[\r\n\t]+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, Math.max(0, max - 3))}...` : text;
}
const SAFE_META_KEYS = new Set([
    'path','owner','initiator','startT','ttfbMs','downloadMs','decodedKB','transferKB','status','category',
    'container','blockingMs','externalScript','externalScriptMs','externalFn','rabbitMirrorScriptMs','rabbitMirrorOnly',
    'event','interactionId','inputDelay','processingMs','sendId','mesid','messages','role','sampleId',
    'reason','delay','users','assistants','source','windowId','action','eventCount','readyState','version',
    'rabbitMirrorRootPath','domContentLoadedMs','loadMs','responseMs',
]);
function safeMeta(meta = {}) {
    const out = {};
    if (!meta || typeof meta !== 'object') return out;
    for (const [key, raw] of Object.entries(meta)) {
        if (!SAFE_META_KEYS.has(key)) continue;
        if (raw === undefined || raw === null) continue;
        if (typeof raw === 'number' && Number.isFinite(raw)) out[key] = Math.round(raw * 10) / 10;
        else if (typeof raw === 'boolean') out[key] = raw;
        else if (typeof raw === 'string') out[key] = ['path','container','externalScript','rabbitMirrorRootPath'].includes(key)
            ? redactReportPath(raw)
            : safeString(raw, 200);
    }
    return out;
}
function push(kind, name, ms = 0, meta = {}, explicitT = null) {
    if (!startedAt) startedAt = now();
    const entry = {
        id: ++sequence,
        t: Math.round((explicitT == null ? now() - startedAt : explicitT) * 10) / 10,
        kind: safeString(kind || 'event', 40),
        name: safeString(name || '', 120),
        ms: Math.round((Number(ms) || 0) * 10) / 10,
        ...safeMeta(meta),
    };
    entries.push(entry);
    if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
    return entry;
}
function mark(name, meta = {}) { return push('mark', name, 0, meta); }

function sensitivePathSegment(segment = '') {
    let text = String(segment || '');
    try { text = decodeURIComponent(text); } catch {}
    if (/^(?:bearer|token|access[_-]?token|api[_-]?key|secret|session|authorization|password|passwd|signature|signed|sig)[=:._\s-]/i.test(text)) return true;
    if (/^(?:sk|pk|rk|ghp|gho|github_pat|xox[abprs])[-_][A-Za-z0-9_-]{8,}$/i.test(text)) return true;
    if (/^[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}$/.test(text)) return true;
    if (/^[0-9a-f]{16,}$/i.test(text) || /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(text)) return true;
    if (/^[A-Za-z0-9_-]{16,}={0,2}$/.test(text) && /[A-Za-z]/.test(text) && /[0-9_-]/.test(text)) return true;
    return false;
}
function redactDiagnosticPathname(path = '/') {
    const clean = String(path || '/').split(/[?#]/, 1)[0] || '/';
    const parts = clean.split('/').map(part => sensitivePathSegment(part) ? '[redacted]' : safeString(part, 72));
    const result = parts.join('/').replace(/\/{2,}/g, '/');
    return (result.startsWith('/') ? result : `/${result}`).slice(0, 240) || '/';
}
function pathOf(input) {
    let raw = '';
    try {
        raw = typeof input === 'string' ? input : (input?.name || input?.url || String(input || ''));
        const parsed = new URL(raw, globalThis.location?.href || 'http://localhost/');
        // Only hierarchical web URLs have a useful path-only representation. Opaque
        // schemes (data/javascript/blob/file/filesystem/extension-specific) may retain
        // secrets in pathname, so collapse them to a non-identifying root marker.
        if (!/^https?:$/i.test(parsed.protocol)) return '/';
        return redactDiagnosticPathname(parsed.pathname || '/');
    } catch {
        const clean = String(raw || '').split(/[?#]/, 1)[0];
        const absolute = /^(?:[a-z][a-z0-9+.-]*:)?\/\/[^/]*(\/.*)?$/i.exec(clean);
        if (absolute) return redactDiagnosticPathname(String(absolute[1] || '/'));
        if (/^[a-z][a-z0-9+.-]*:/i.test(clean)) return '/';
        return redactDiagnosticPathname(clean);
    }
}
function redactReportPath(value = '') {
    const text = String(value || '');
    if (!text || /^(?:window|iframe|frame|embed|object|unknown)$/.test(text)) return text;
    return redactDiagnosticPathname(text);
}
function isRabbitMirrorPath(path = '') {
    const text = String(path || '');
    if (rabbitMirrorRootPath && text.startsWith(rabbitMirrorRootPath)) return true;
    return /\/scripts\/extensions\/third-party\/(?:tototest|toto)(?:\/|$)/i.test(text)
        || /rabbit[-_]?mirror|rabbit_mirror/i.test(text);
}
function resourceOwner(path = '') {
    const text = String(path || '');
    if (isRabbitMirrorPath(text)) return 'rabbitmirror';
    if (/\/scripts\/extensions\/third-party\//i.test(text)) return 'other-extension';
    if (/^\/(?:script\.js|scripts\/)/i.test(text)) return 'sillytavern-core';
    if (/^\/api\//i.test(text)) return 'sillytavern-api';
    return 'other';
}
function classifyApi(path = '') {
    const text = String(path || '');
    if (text === '/api/chats/get') return 'chat.get';
    if (text === '/api/characters/chats' || text === '/api/groups/get') return 'chat.list';
    if (/\/api\/chats\/(?:save|group\/save)/.test(text)) return 'chat.save';
    if (text === '/api/settings/save') return 'settings.save';
    if (text.includes('/api/tokenizers/')) return 'tokenizer';
    if (text === '/api/backends/chat-completions/generate' || text === '/api/generate' || /\/generate$/.test(text)) return 'generate';
    if (/\/models(?:\/|$)/.test(text) || text.includes('/status')) return 'models/status';
    if (text.includes('/api/')) return 'api.other';
    return '';
}
function resourceMeta(item) {
    const path = pathOf(item.name);
    const requestStart = Number(item.requestStart || item.startTime || 0);
    const responseStart = Number(item.responseStart || 0);
    const responseEnd = Number(item.responseEnd || (item.startTime + item.duration) || 0);
    return {
        path,
        owner: resourceOwner(path),
        initiator: safeString(item.initiatorType || '', 40),
        startT: Number(item.startTime || 0) - startedAt,
        ttfbMs: responseStart > requestStart ? responseStart - requestStart : 0,
        downloadMs: responseEnd > responseStart && responseStart > 0 ? responseEnd - responseStart : 0,
        decodedKB: Math.round(Number(item.decodedBodySize || 0) / 102.4) / 10,
        transferKB: Math.round(Number(item.transferSize || 0) / 102.4) / 10,
        status: Number(item.responseStatus || 0),
    };
}

function installResourceObserver() {
    if (typeof PerformanceObserver !== 'function') return;
    const supported = PerformanceObserver.supportedEntryTypes || [];
    if (!supported.includes('resource')) return;
    const seen = new Set();
    const observer = new PerformanceObserver(list => {
        for (const item of list.getEntries()) {
            const meta = resourceMeta(item);
            const key = `${item.name}|${item.startTime}|${item.duration}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const apiCategory = classifyApi(meta.path);
            if (apiCategory) {
                push('network', 'external.network', item.duration, { ...meta, category: apiCategory }, meta.startT);
                continue;
            }
            const scriptLike = item.initiatorType === 'script' || /\.(?:m?js|css)(?:$|[?#])/i.test(String(item.name || ''));
            if (!scriptLike || Number(item.duration || 0) < 10) continue;
            push('resource', 'external.resource', item.duration, meta, meta.startT);
        }
    });
    observer.observe({ type: 'resource', buffered: true });
    cleanup.push(() => observer.disconnect());
}

function installPerformanceObservers() {
    let hasNativeLongTask = false;
    try {
        if (typeof PerformanceObserver === 'function') {
            const supported = PerformanceObserver.supportedEntryTypes || [];
            if (supported.includes('longtask')) {
                const observer = new PerformanceObserver(list => {
                    for (const item of list.getEntries()) {
                        const attribution = Array.isArray(item.attribution) ? item.attribution[0] : null;
                        const containerType = String(attribution?.containerType || '').trim().toLowerCase();
                        const container = attribution?.containerSrc
                            ? pathOf(attribution.containerSrc)
                            : /^(?:window|iframe|frame|embed|object)$/.test(containerType) ? containerType : 'unknown';
                        push('longtask', 'external.longtask', item.duration, {
                            container,
                        }, Number(item.startTime || 0) - startedAt);
                    }
                });
                observer.observe({ type: 'longtask', buffered: true });
                hasNativeLongTask = true;
                cleanup.push(() => observer.disconnect());
            }
            if (supported.includes('long-animation-frame')) {
                const observer = new PerformanceObserver(list => {
                    for (const item of list.getEntries()) {
                        if (Number(item.duration || 0) < 50) continue;
                        const scripts = Array.isArray(item.scripts) ? item.scripts : [];
                        const ranked = scripts
                            .map(script => ({
                                ms: Number(script?.duration || 0),
                                path: script?.sourceURL ? pathOf(script.sourceURL) : '',
                                fn: safeString(script?.sourceFunctionName || script?.invoker || '', 120),
                            }))
                            .sort((a, b) => b.ms - a.ms);
                        const external = ranked.find(row => row.path && !isRabbitMirrorPath(row.path)) || null;
                        const rabbit = ranked.find(row => row.path && isRabbitMirrorPath(row.path)) || null;
                        push('loaf', 'external.longAnimationFrame', item.duration, {
                            blockingMs: Number(item.blockingDuration || 0),
                            externalScript: external?.path || '',
                            externalScriptMs: external?.ms || 0,
                            externalFn: external?.fn || '',
                            rabbitMirrorScriptMs: rabbit?.ms || 0,
                            rabbitMirrorOnly: !external && !!rabbit,
                        }, Number(item.startTime || 0) - startedAt);
                    }
                });
                observer.observe({ type: 'long-animation-frame', buffered: true });
                cleanup.push(() => observer.disconnect());
            }
            if (supported.includes('event')) {
                const observer = new PerformanceObserver(list => {
                    for (const item of list.getEntries()) {
                        if (Number(item.duration || 0) < 100) continue;
                        const inputDelay = Math.max(0, Number(item.processingStart || 0) - Number(item.startTime || 0));
                        const processingMs = Math.max(0, Number(item.processingEnd || 0) - Number(item.processingStart || 0));
                        push('interaction', 'external.slowEvent', item.duration, {
                            event: safeString(item.name || '', 40), interactionId: Number(item.interactionId || 0), inputDelay, processingMs,
                        }, Number(item.startTime || 0) - startedAt);
                    }
                });
                observer.observe({ type: 'event', buffered: true, durationThreshold: 100 });
                cleanup.push(() => observer.disconnect());
            }
        }
    } catch (error) {
        mark('externalDiag.performanceObserverUnavailable', { error: safeString(error?.message || error) });
    }

    if (!hasNativeLongTask) {
        let expected = now() + STALL_INTERVAL_MS;
        const timer = setInterval(() => {
            const current = now();
            const lag = current - expected;
            expected = current + STALL_INTERVAL_MS;
            if (lag >= STALL_THRESHOLD_MS) push('stall', 'external.eventLoopStall', lag);
        }, STALL_INTERVAL_MS);
        cleanup.push(() => clearInterval(timer));
    }
}

function roleFromMessageNode(node) {
    if (!node?.matches?.('.mes, [mesid]')) return 'unknown';
    const isUser = node.getAttribute?.('is_user');
    if (isUser === 'true' || isUser === '1' || node.classList?.contains('user_mes')) return 'user';
    if (isUser === 'false' || isUser === '0' || node.classList?.contains('assistant_mes')) return 'assistant';
    try {
        const mesid = Number(node.getAttribute?.('mesid'));
        const chat = globalThis.SillyTavern?.getContext?.()?.chat;
        if (Number.isInteger(mesid) && Array.isArray(chat) && chat[mesid]) return chat[mesid].is_user ? 'user' : 'assistant';
    } catch {}
    return 'unknown';
}
function observeAssistantFirstText(messageNode) {
    if (!messageNode?.isConnected || firstTextObservers.has(messageNode)) return;
    const target = messageNode.querySelector?.('.mes_text') || messageNode;
    const mesid = safeString(messageNode.getAttribute?.('mesid') || '', 40);
    const markMutation = () => {
        mark('host.assistantFirstDomMutation', { sendId: activeSend?.id || '', mesid });
        try { firstTextObservers.get(messageNode)?.disconnect?.(); } catch {}
        firstTextObservers.delete(messageNode);
        return true;
    };
    // Structural presence only. Never inspect textContent/nodeValue: External
    // Diagnostics is forbidden from reading assistant正文 even transiently.
    if (Number(target?.childNodes?.length || 0) > 0) { markMutation(); return; }
    if (typeof MutationObserver !== 'function') return;
    const observer = new MutationObserver(records => { if (records?.length) markMutation(); });
    observer.observe(target, { childList: true, subtree: true, characterData: true });
    firstTextObservers.set(messageNode, observer);
}
function observeChatRoot() {
    const chat = document.querySelector?.('#chat');
    if (!chat || typeof MutationObserver !== 'function') return false;
    if (chatObserver) return true;
    mark('host.chatRootAvailable', { messages: [...(chat.children || [])].filter(node => node?.matches?.('.mes[mesid], [mesid].mes')).length });
    chatObserver = new MutationObserver(records => {
        for (const record of records) {
            for (const node of record.addedNodes || []) {
                if (node?.nodeType !== 1 || !node.matches?.('.mes[mesid], [mesid].mes')) continue;
                const role = roleFromMessageNode(node);
                const mesid = safeString(node.getAttribute?.('mesid') || '', 40);
                mark('host.chatMessageAdded', { role, mesid, sendId: activeSend?.id || '' });
                if (role === 'user') mark('host.userMessageVisible', { sendId: activeSend?.id || '', mesid });
                if (role === 'assistant') observeAssistantFirstText(node);
            }
        }
    });
    chatObserver.observe(chat, { childList: true, subtree: false });
    cleanup.push(() => { try { chatObserver?.disconnect?.(); } catch {} chatObserver = null; });
    return true;
}
function installChatObserverRetry() {
    if (observeChatRoot()) return;
    let attempts = 0;
    const timer = setInterval(() => {
        attempts += 1;
        if (observeChatRoot() || attempts >= 40) clearInterval(timer);
    }, 250);
    cleanup.push(() => clearInterval(timer));
}
function countChatMessages() {
    const chat = document.querySelector?.('#chat');
    if (!chat) return { messages: 0, users: 0, assistants: 0 };
    // The diagnostic is deliberately O(1): exact per-role counts would walk every
    // historical message and make the observer part of the performance problem.
    return { messages: Number(chat.childElementCount || 0), users: -1, assistants: -1 };
}
function scheduleChatSamples(reason = 'unknown') {
    for (const timer of chatSampleTimers) clearTimeout(timer);
    chatSampleTimers.clear();
    const sampleId = `${safeString(reason, 40)}:${++sequence}`;
    for (const delay of CHAT_SAMPLE_DELAYS) {
        const timer = setTimeout(() => {
            chatSampleTimers.delete(timer);
            mark('host.chatRenderSample', { sampleId, reason, delay, ...countChatMessages() });
        }, delay);
        chatSampleTimers.add(timer);
    }
}

function startSendIntent(source = 'unknown') {
    activeSend = { id: `s${++sendSequence}`, startedT: now() - startedAt, source };
    mark('host.sendIntent', { sendId: activeSend.id, source });
}
function installSendIntentListeners() {
    const click = event => {
        if (event?.isTrusted === false) return;
        if (event.target?.closest?.('#send_but, #send_button, [data-send-button]')) startSendIntent('button');
    };
    const keydown = event => {
        if (event?.isTrusted === false || event.key !== 'Enter' || event.shiftKey) return;
        if (event.target?.matches?.('#send_textarea, textarea#send_textarea')) startSendIntent('enter');
    };
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', keydown, true);
    cleanup.push(() => document.removeEventListener('click', click, true));
    cleanup.push(() => document.removeEventListener('keydown', keydown, true));
}

function maintenanceSource(node) {
    const host = node?.closest?.('[data-rabbit-mirror-external-source="true"]');
    return host?.getAttribute?.('data-rm-source') === 'independent' ? 'independent' : 'follow';
}
function startMaintenanceWindow(target, action = 'maintenance') {
    const row = {
        id: `m${++maintenanceSequence}`,
        source: maintenanceSource(target),
        action: safeString(action || 'maintenance', 80),
        startT: now() - startedAt,
        endT: now() - startedAt + MAINTENANCE_WINDOW_MS,
    };
    maintenanceWindows.push(row);
    if (maintenanceWindows.length > 12) maintenanceWindows.splice(0, maintenanceWindows.length - 12);
    mark('host.maintenanceIntent', { windowId: row.id, source: row.source, action: row.action });
}
function installMaintenanceIntentListeners() {
    const handler = event => {
        if (event?.isTrusted === false) return;
        const actionNode = event.target?.closest?.('[data-rm-maintenance-action]');
        const rabbit = event.target?.closest?.('[data-rm-maintenance-rabbit]');
        if (actionNode) startMaintenanceWindow(actionNode, actionNode.getAttribute?.('data-rm-maintenance-action') || 'action');
        else if (rabbit) startMaintenanceWindow(rabbit, 'open-menu');
    };
    document.addEventListener('click', handler, true);
    cleanup.push(() => document.removeEventListener('click', handler, true));
}

function clearHostEvents() {
    for (const item of hostEventCleanup.splice(0)) {
        try { item.es?.off?.(item.event, item.handler); } catch {}
    }
}
function installHostEvents() {
    let ctx;
    try { ctx = globalThis.SillyTavern?.getContext?.(); } catch { ctx = null; }
    const es = ctx?.eventSource;
    const et = ctx?.eventTypes || ctx?.event_types || {};
    if (!es?.on || !et || !Object.keys(et).length) return false;
    clearHostEvents();
    const bind = (event, name, handler = null) => {
        if (!event) return;
        const fn = (...args) => {
            mark(name, { sendId: activeSend?.id || '' });
            try { handler?.(...args); } catch {}
        };
        es.on(event, fn);
        hostEventCleanup.push({ es, event, handler: fn });
    };
    bind(et.CHAT_CHANGED, 'host.CHAT_CHANGED', () => scheduleChatSamples('CHAT_CHANGED'));
    bind(et.MESSAGE_SENT, 'host.MESSAGE_SENT');
    bind(et.GENERATION_STARTED, 'host.GENERATION_STARTED');
    bind(et.MESSAGE_RECEIVED, 'host.MESSAGE_RECEIVED');
    bind(et.CHARACTER_MESSAGE_RENDERED, 'host.CHARACTER_MESSAGE_RENDERED');
    bind(et.MESSAGE_UPDATED, 'host.MESSAGE_UPDATED');
    bind(et.GENERATION_ENDED, 'host.GENERATION_ENDED', () => { activeSend = null; });
    bind(et.GENERATION_STOPPED, 'host.GENERATION_STOPPED', () => { activeSend = null; });
    bind(et.MESSAGE_SWIPED, 'host.MESSAGE_SWIPED');
    mark('externalDiag.hostEventsInstalled', { eventCount: hostEventCleanup.length });
    return true;
}
function installHostEventsRetry() {
    let attempts = 0;
    const tryInstall = () => {
        attempts += 1;
        if (installHostEvents() || attempts >= 40) {
            if (hostEventInstallTimer) clearInterval(hostEventInstallTimer);
            hostEventInstallTimer = 0;
        }
    };
    tryInstall();
    if (!hostEventCleanup.length) hostEventInstallTimer = setInterval(tryInstall, 250);
    cleanup.push(() => { if (hostEventInstallTimer) clearInterval(hostEventInstallTimer); hostEventInstallTimer = 0; clearHostEvents(); });
}
function installLifecycleMarks() {
    mark('host.documentState', { readyState: document?.readyState || '' });
    const dom = () => mark('host.DOMContentLoaded');
    const load = () => { mark('host.load'); scheduleChatSamples('window.load'); };
    document.addEventListener('DOMContentLoaded', dom, { once: true });
    window.addEventListener('load', load, { once: true });
    cleanup.push(() => document.removeEventListener('DOMContentLoaded', dom));
    cleanup.push(() => window.removeEventListener('load', load));
    scheduleChatSamples('externalDiag.init');
}

function delta(a, b) {
    if (!a || !b) return null;
    return Math.round((Number(b.t || 0) - Number(a.t || 0)) * 10) / 10;
}
function firstAfter(snapshot, index, names, beforeName = 'host.sendIntent') {
    const wanted = new Set(Array.isArray(names) ? names : [names]);
    for (let i = index + 1; i < snapshot.length; i += 1) {
        const row = snapshot[i];
        if (row.name === beforeName) break;
        if (wanted.has(row.name)) return row;
    }
    return null;
}
function networkAfter(snapshot, startT, category, endT = Infinity) {
    return snapshot
        .filter(row => row.name === 'external.network' && row.category === category && Number(row.t) >= Number(startT) && Number(row.t) <= Number(endT))
        .sort((a, b) => Number(a.t) - Number(b.t))[0] || null;
}
function externalLoafInWindow(snapshot, startT, endT) {
    return snapshot
        .filter(row => row.name === 'external.longAnimationFrame' && Number(row.t) >= startT && Number(row.t) <= endT && row.externalScript)
        .sort((a, b) => Number(b.ms) - Number(a.ms));
}
function buildSendRows(snapshot) {
    const rows = [];
    snapshot.forEach((item, index) => {
        if (item.name !== 'host.sendIntent') return;
        const nextIntent = snapshot.slice(index + 1).find(row => row.name === 'host.sendIntent');
        const endT = nextIntent ? Number(nextIntent.t) : Infinity;
        const messageSent = firstAfter(snapshot, index, 'host.MESSAGE_SENT');
        const userDom = firstAfter(snapshot, index, 'host.userMessageVisible');
        const generationStarted = firstAfter(snapshot, index, 'host.GENERATION_STARTED');
        const firstText = firstAfter(snapshot, index, 'host.assistantFirstDomMutation');
        const ended = firstAfter(snapshot, index, ['host.GENERATION_ENDED', 'host.GENERATION_STOPPED']);
        const generateNet = networkAfter(snapshot, Number(item.t), 'generate', Math.min(endT, Number(ended?.t ?? Infinity)));
        const loaf = externalLoafInWindow(snapshot, Number(item.t), Number(firstText?.t ?? ended?.t ?? item.t + 15000))[0] || null;
        rows.push({
            sendId: item.sendId || '', source: item.source || '',
            intentToMessageSent: delta(item, messageSent),
            intentToUserDom: delta(item, userDom),
            intentToGenerationStarted: delta(item, generationStarted),
            intentToGenerateRequest: generateNet ? Math.round((Number(generateNet.t) - Number(item.t)) * 10) / 10 : null,
            generateTtfbMs: generateNet?.ttfbMs || null,
            intentToFirstText: delta(item, firstText),
            intentToEnd: delta(item, ended),
            externalBlockScript: loaf?.externalScript || '',
            externalBlockMs: loaf?.ms || 0,
        });
    });
    return rows.slice(-8);
}
function maintenanceWindowRows(snapshot) {
    return maintenanceWindows.slice(-8).map(win => {
        const externalLoaf = externalLoafInWindow(snapshot, win.startT, win.endT);
        const slowNetwork = snapshot
            .filter(row => row.name === 'external.network' && row.t >= win.startT && row.t <= win.endT && row.ms >= 1000)
            .sort((a, b) => b.ms - a.ms);
        const stalls = snapshot
            .filter(row => (row.name === 'external.eventLoopStall' || row.name === 'external.longtask') && row.t >= win.startT && row.t <= win.endT)
            .sort((a, b) => b.ms - a.ms);
        const rabbitOnlyLoaf = snapshot
            .filter(row => row.name === 'external.longAnimationFrame' && row.t >= win.startT && row.t <= win.endT && row.rabbitMirrorOnly)
            .sort((a, b) => b.ms - a.ms)[0] || null;
        return {
            ...win,
            maxExternalLoaf: externalLoaf[0] || null,
            maxStall: stalls[0] || null,
            slowNetwork: slowNetwork.slice(0, 3),
            rabbitOnlyLoaf,
        };
    });
}
function topExternalResources(snapshot) {
    return snapshot
        .filter(row => row.name === 'external.resource' && row.owner !== 'rabbitmirror')
        .sort((a, b) => Number(b.ms) - Number(a.ms));
}
function automatedFindings(snapshot, sendRows, maintenanceRows) {
    const findings = [];
    const resources = topExternalResources(snapshot);
    if (resources[0]?.ms >= 500) findings.push(`外部启动资源最慢：${resources[0].path} ${Math.round(resources[0].ms)}ms（${resources[0].owner}）。`);
    const externalLoaf = snapshot.filter(row => row.name === 'external.longAnimationFrame' && row.externalScript).sort((a, b) => b.ms - a.ms)[0];
    if (externalLoaf?.ms >= 500) findings.push(`外部脚本造成长帧：${externalLoaf.externalScript}，帧长 ${Math.round(externalLoaf.ms)}ms，脚本归因约 ${Math.round(externalLoaf.externalScriptMs || 0)}ms。`);
    const rabbitOnly = snapshot.filter(row => row.name === 'external.longAnimationFrame' && row.rabbitMirrorOnly).sort((a, b) => b.ms - a.ms)[0];
    if (!externalLoaf && rabbitOnly?.ms >= 500) findings.push(`捕获到 ${Math.round(rabbitOnly.ms)}ms 长帧，但浏览器只归因到兔子镜脚本；本“外部诊断”不继续分析，请对对应兔子镜使用原来的「📋 生成全链路诊断」。`);
    const chatSamples = snapshot.filter(row => row.name === 'host.chatRenderSample');
    const blank = chatSamples.find(row => Number(row.delay) >= 3000 && Number(row.messages) === 0);
    if (blank) {
        const get = snapshot.filter(row => row.name === 'external.network' && ['chat.get', 'chat.list'].includes(row.category) && row.ms >= 1000).sort((a, b) => b.ms - a.ms)[0];
        if (get) findings.push(`聊天窗口在 ${blank.delay}ms 仍为空；同期宿主请求 ${get.category} 用时 ${Math.round(get.ms)}ms（TTFB ${Math.round(get.ttfbMs || 0)}ms）。`);
        else findings.push(`聊天窗口在 ${blank.delay}ms 仍为空，但没有抓到对应慢 chat.get/chat.list；优先看外部 Long Frame/其他扩展脚本归因。`);
    }
    for (const row of sendRows) {
        if ((row.intentToMessageSent ?? 0) >= 1000 || (row.intentToGenerateRequest ?? 0) >= 1500) {
            if (row.externalBlockScript) findings.push(`发送 ${row.sendId} 在请求发出前存在外部脚本阻塞：${row.externalBlockScript}，最长帧 ${Math.round(row.externalBlockMs)}ms。`);
            else findings.push(`发送 ${row.sendId} 在请求发出前迟滞 ${Math.round(row.intentToGenerateRequest ?? row.intentToMessageSent)}ms，但未归因到外部脚本；更像 SillyTavern 宿主发送/保存链本身。`);
        }
        if ((row.generateTtfbMs ?? 0) >= 3000) findings.push(`发送 ${row.sendId} 的生成请求 TTFB ${Math.round(row.generateTtfbMs)}ms；这部分主要发生在请求发出后的上游/服务器等待。`);
    }
    for (const row of maintenanceRows) {
        if (row.maxExternalLoaf?.ms >= 500) findings.push(`维修兔 ${row.id}（${row.source}）点击后的 10 秒内，外部脚本 ${row.maxExternalLoaf.externalScript} 造成 ${Math.round(row.maxExternalLoaf.ms)}ms 长帧；这会让“点了没反应”。`);
        else if (row.maxStall?.ms >= 500) findings.push(`维修兔 ${row.id}（${row.source}）点击后的 10 秒内主线程阻塞 ${Math.round(row.maxStall.ms)}ms，但浏览器没有给出外部脚本归因。`);
        else if (row.rabbitOnlyLoaf?.ms >= 500) findings.push(`维修兔 ${row.id}（${row.source}）点击后的卡顿只归因到兔子镜内部；请对该镜使用原「📋 生成全链路诊断」，外部诊断到此停止。`);
    }
    const slowNetwork = snapshot.filter(row => row.name === 'external.network' && row.ms >= 3000).sort((a, b) => b.ms - a.ms).slice(0, 4);
    if (slowNetwork.length) findings.push(`宿主慢网络：${slowNetwork.map(row => `${row.category} ${Math.round(row.ms)}ms`).join('；')}。`);
    return [...new Set(findings)].slice(0, 12);
}

function report() {
    // Re-apply path redaction at the export boundary as defence in depth for old
    // buffered records and values supplied through the public mark() API.
    const snapshot = entries.map(row => ({
        ...row,
        ...(row.path ? { path: redactReportPath(row.path) } : {}),
        ...(row.container ? { container: redactReportPath(row.container) } : {}),
        ...(row.externalScript ? { externalScript: redactReportPath(row.externalScript) } : {}),
    })).sort((a, b) => Number(a.t) - Number(b.t));
    const sendRows = buildSendRows(snapshot);
    const maintenanceRows = maintenanceWindowRows(snapshot);
    const findings = automatedFindings(snapshot, sendRows, maintenanceRows);
    const resources = topExternalResources(snapshot).slice(0, 20);
    const externalLoaf = snapshot.filter(row => row.name === 'external.longAnimationFrame' && row.externalScript).sort((a, b) => b.ms - a.ms).slice(0, 15);
    const rabbitOnlyLoaf = snapshot.filter(row => row.name === 'external.longAnimationFrame' && row.rabbitMirrorOnly).sort((a, b) => b.ms - a.ms).slice(0, 8);
    const networks = snapshot.filter(row => row.name === 'external.network').sort((a, b) => b.ms - a.ms).slice(0, 24);
    const stalls = snapshot.filter(row => row.name === 'external.eventLoopStall' || row.name === 'external.longtask').sort((a, b) => b.ms - a.ms).slice(0, 15);
    const slowEvents = snapshot.filter(row => row.name === 'external.slowEvent').sort((a, b) => b.ms - a.ms).slice(0, 12);
    const samples = snapshot.filter(row => row.name === 'host.chatRenderSample').slice(-36);

    const lines = [];
    lines.push(`RabbitMirror 外部代码／宿主性能诊断 ${DIAG_VERSION}`);
    lines.push(`生成时间: ${wallNow()}`);
    lines.push('边界: 诊断 SillyTavern、其他扩展、浏览器主线程与网络；仅补充独立 API 的标量传输元数据，不读取兔子镜内部生成/维修状态。');
    lines.push('兔子镜内部维修问题请单独使用对应兔子镜里的「📋 生成全链路诊断」，两份报告不要合并。');
    lines.push('隐私: 不保存聊天正文、Prompt、API Key、角色正文、世界书正文、请求 body 或响应 body。');
    lines.push('');
    lines.push('【外部自动结论】');
    if (findings.length) findings.forEach((text, index) => lines.push(`${index + 1}. ${text}`));
    else lines.push('暂未捕获到明确的外部 1 秒级断点；请在同一页面复现一次空白/发送迟滞/维修点击无响应后再次生成。');

    lines.push('');
    lines.push('【外部启动资源】');
    if (resources.length) resources.forEach(row => lines.push(`- ${row.owner} ${row.path}: ${row.ms}ms decoded=${row.decodedKB || 0}KB transfer=${row.transferKB || 0}KB`));
    else lines.push('暂无 >=10ms 的外部 JS/CSS 资源记录。');

    lines.push('');
    lines.push('【外部脚本长帧归因】');
    if (externalLoaf.length) externalLoaf.forEach(row => lines.push(`- t+${row.t}ms frame=${row.ms}ms blocking=${row.blockingMs || 0}ms script=${row.externalScript} scriptMs=${row.externalScriptMs || 0} fn=${row.externalFn || ''}`));
    else lines.push('浏览器未捕获到可归因给外部脚本的 Long Animation Frame。');
    if (rabbitOnlyLoaf.length) {
        lines.push('仅归因兔子镜内部的长帧（这里只标记，不继续分析）:');
        rabbitOnlyLoaf.forEach(row => lines.push(`- t+${row.t}ms frame=${row.ms}ms rabbitMirrorScriptMs=${row.rabbitMirrorScriptMs || 0} → 请使用内部全链路诊断`));
    }

    lines.push('');
    lines.push('【主线程 / 慢交互】');
    if (stalls.length) stalls.forEach(row => lines.push(`- t+${row.t}ms ${row.name}: ${row.ms}ms${row.container ? ` container=${row.container}` : ''}`));
    else lines.push('未记录到 >=150ms event-loop stall / LongTask。');
    if (slowEvents.length) slowEvents.forEach(row => lines.push(`- event ${row.event}: ${row.ms}ms inputDelay=${row.inputDelay || 0}ms processing=${row.processingMs || 0}ms`));

    lines.push('');
    lines.push('【聊天窗口装载】');
    if (samples.length) samples.forEach(row => lines.push(`- ${row.reason} +${row.delay}ms: messages=${row.messages}, user=${row.users}, assistant=${row.assistants}`));
    else lines.push('暂无聊天 DOM 采样。');

    lines.push('');
    lines.push('【发送 → 请求 → AI 首字（宿主层）】');
    if (sendRows.length) {
        sendRows.forEach(row => lines.push(`- ${row.sendId}(${row.source}): click→MESSAGE_SENT=${row.intentToMessageSent ?? '?'}ms; click→userDOM=${row.intentToUserDom ?? '?'}ms; click→GEN_START=${row.intentToGenerationStarted ?? '?'}ms; click→generateRequest=${row.intentToGenerateRequest ?? '?'}ms; generateTTFB=${row.generateTtfbMs ?? '?'}ms; click→firstDOM=${row.intentToFirstText ?? '?'}ms; click→end=${row.intentToEnd ?? '?'}ms; externalBlock=${row.externalBlockScript || '-'} ${row.externalBlockMs || 0}ms`));
    } else lines.push('本会话尚未记录到发送动作。');

    lines.push('');
    lines.push('【宿主 / 网络最慢请求】');
    if (networks.length) networks.forEach(row => lines.push(`- ${row.category} ${row.path}: total=${row.ms}ms TTFB=${row.ttfbMs || 0}ms download=${row.downloadMs || 0}ms status=${row.status || '?'}`));
    else lines.push('暂无同源 /api 网络资源记录。');

    lines.push('');
    lines.push('【独立 API 响应传输（仅元数据）】');
    const yesNo = value => value === true ? '是' : value === false ? '否' : '未确认';
    if (!transportRows.length) lines.push('本页面会话尚无独立 API 传输记录，或已手动清空；不会为诊断额外发送请求。');
    else lines.push('包含本页面会话最近最多 12 次请求的标量记录（可以在失败后再打开诊断；刷新页面不保留）。');
    for (const row of transportRows) {
        const item = sanitizeExternalTransportSummary(row.summary);
        if (!item) continue;
        lines.push(`- HTTP=${item.status ?? '不可用'}; Content-Type=${item.contentType ?? '不可用'}; 实际解析=${item.parserFormat}; 应用接收字节=${item.receivedBytes ?? '不可用'}${item.receivedBytes == null ? '' : item.receivedBytesExact ? '（精确）' : '（估算）'}; 最终 content 字符=${item.contentChars ?? '不可用'}; finish_reason=${item.finishReason}; 正常结束=${yesNo(item.endedNormally)}; 提前断流=${yesNo(item.prematureClose)}; 结束方式=${item.termination}; 失败类别=${item.failureCategory}`);
    }
    lines.push('字节数指应用收到的解压后响应体，不是压缩网络流量。宿主适配器未公开的 HTTP/格式/字节数据标为不可用；仅 EOF 且无结束标记不能断言提前断流。');

    lines.push('');
    lines.push('【维修兔点击后的“外部阻塞窗口”】');
    if (maintenanceRows.length) {
        for (const row of maintenanceRows) {
            lines.push(`- ${row.id} source=${row.source} action=${row.action}:`);
            if (row.maxExternalLoaf) lines.push(`  externalLongFrame=${row.maxExternalLoaf.ms}ms script=${row.maxExternalLoaf.externalScript} scriptMs=${row.maxExternalLoaf.externalScriptMs || 0}`);
            else lines.push('  externalLongFrame=未捕获');
            if (row.maxStall) lines.push(`  maxMainThreadStall=${row.maxStall.ms}ms`);
            if (row.slowNetwork.length) row.slowNetwork.forEach(net => lines.push(`  slowNetwork=${net.category} ${net.ms}ms TTFB=${net.ttfbMs || 0}ms`));
            if (row.rabbitOnlyLoaf) lines.push(`  rabbitMirrorInternalLongFrame=${row.rabbitOnlyLoaf.ms}ms → 内部问题请另用全链路诊断`);
        }
    } else lines.push('本会话尚未点击维修兔。');
    return lines.join('\n');
}
function status() {
    const snapshot = entries;
    return {
        version: DIAG_VERSION,
        entries: snapshot.length,
        externalResources: snapshot.filter(row => row.name === 'external.resource' && row.owner !== 'rabbitmirror').length,
        externalLoaf: snapshot.filter(row => row.name === 'external.longAnimationFrame' && row.externalScript).length,
        stalls: snapshot.filter(row => row.name === 'external.eventLoopStall' || row.name === 'external.longtask').length,
        network: snapshot.filter(row => row.name === 'external.network').length,
        maintenanceWindows: maintenanceWindows.length,
    };
}
function reset(reason = 'manual') {
    entries = [];
    // Starting the performance recorder after an error must not throw away its
    // already captured transport receipt. Only explicit clear resets the ring.
    if (reason !== 'user-start') clearRecentIndependentTransportDiagnostics();
    transportRows = getRecentIndependentTransportDiagnostics();
    sequence = 0;
    startedAt = now();
    activeSend = null;
    maintenanceWindows = [];
    mark('externalDiag.reset', { reason });
    try {
        for (const item of performance.getEntriesByType?.('resource') || []) {
            const meta = resourceMeta(item);
            const apiCategory = classifyApi(meta.path);
            if (apiCategory) push('network', 'external.network', item.duration, { ...meta, category: apiCategory }, meta.startT);
            else if ((item.initiatorType === 'script' || /\.(?:m?js|css)(?:$|[?#])/i.test(String(item.name || ''))) && Number(item.duration || 0) >= 10) push('resource', 'external.resource', item.duration, meta, meta.startT);
        }
    } catch {}
    scheduleChatSamples('externalDiag.reset');
    return status();
}

export function initRabbitMirrorExternalDiagnostics() {
    if (initialized) return globalThis.__rabbitMirrorExternalDiag;
    initialized = true;
    startedAt = now();
    entries = [];
    transportRows = getRecentIndependentTransportDiagnostics();
    cleanup = [];
    maintenanceWindows = [];
    const api = {
        version: DIAG_VERSION,
        mark: (name, meta = {}) => name === 'externalDiag.userEnabled'
            ? mark(name, { readyState: safeString(meta?.readyState || '', 32) })
            : mark('externalDiag.externalMark'),
        dump: () => entries.map(row => ({ ...row })),
        report,
        status,
        reset,
    };
    globalThis.__rabbitMirrorExternalDiag = api;
    globalThis.rabbitMirrorExternalDiagnosticReport = report;
    installTransportMetadataListener();
    installResourceObserver();
    installPerformanceObservers();
    installLifecycleMarks();
    installSendIntentListeners();
    installMaintenanceIntentListeners();
    installChatObserverRetry();
    installHostEventsRetry();
    try {
        const nav = performance.getEntriesByType?.('navigation')?.[0];
        if (nav) {
            push('navigation', 'host.navigation', Number(nav.duration || 0), {
                domContentLoadedMs: Number(nav.domContentLoadedEventEnd || 0),
                loadMs: Number(nav.loadEventEnd || 0),
                responseMs: Number(nav.responseEnd || 0),
            }, -startedAt);
        }
    } catch {}
    mark('externalDiag.init', { version: DIAG_VERSION, rabbitMirrorRootPath });
    return api;
}

export function destroyRabbitMirrorExternalDiagnostics() {
    for (const timer of chatSampleTimers) clearTimeout(timer);
    chatSampleTimers.clear();
    for (const observer of firstTextObservers.values()) { try { observer.disconnect(); } catch {} }
    firstTextObservers.clear();
    for (const fn of cleanup.splice(0)) { try { fn(); } catch {} }
    clearHostEvents();
    if (globalThis.__rabbitMirrorExternalDiag?.version === DIAG_VERSION) delete globalThis.__rabbitMirrorExternalDiag;
    try { delete globalThis.rabbitMirrorExternalDiagnosticReport; } catch {}
    initialized = false;
}
