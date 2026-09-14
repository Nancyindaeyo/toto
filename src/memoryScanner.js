import { extension_settings } from '../../../../extensions.js';

const MEMORY_TRACE_RE = /(memory|memories|memo|recall|remember|summary|summar|history|lore|book|horae|vector|记忆|回忆|忆|摘要|总结|往事|历史)/i;
const EXCLUDED_GLOBAL_KEYS = new Set([
    'history', 'window', 'self', 'globalThis', 'document', 'location', 'navigator', 'performance',
    'localStorage', 'sessionStorage', 'caches', 'frames', 'parent', 'top', 'opener', 'SillyTavern',
    '$', 'jQuery', 'toastr',
]);
const LEGACY_PROVIDER_ALIASES = new Map([
    ['baibai-book', 'global:STBaiBaiBook'],
]);
const MAX_READABLE_RESULTS = 12;
const MAX_PENDING_RESULTS = 20;

function safeGlobalValue(key) {
    try {
        return globalThis?.[key];
    } catch {
        return undefined;
    }
}

function titleFromToken(token) {
    return String(token || '')
        .replace(/^global:/, '')
        .replace(/^settings:/, '')
        .replace(/^script:/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || '未命名来源';
}

function normalizedToken(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g, '');
}

function safeText(value) {
    return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function readDeclaredName(api) {
    if (!api || (typeof api !== 'object' && typeof api !== 'function')) return '';
    const direct = [
        api.displayName,
        api.pluginName,
        api.extensionName,
        api.name,
    ];
    const nested = [
        api.meta?.displayName,
        api.meta?.name,
        api.metadata?.displayName,
        api.metadata?.name,
        api.manifest?.display_name,
        api.manifest?.displayName,
        api.manifest?.name,
    ];
    for (const value of [...direct, ...nested]) {
        const name = safeText(value);
        if (name && !/^(object|function|api)$/i.test(name)) return name.slice(0, 100);
    }
    return '';
}

function collectExtensionTraces() {
    const traces = new Map();
    const add = (token, source, detail = '') => {
        const raw = String(token || '').trim();
        const context = `${raw} ${detail}`;
        if (!raw || !MEMORY_TRACE_RE.test(context)) return;
        const normalized = normalizedToken(raw) || raw.toLowerCase();
        const existing = traces.get(normalized) || {
            id: normalized,
            token: raw,
            sources: new Set(),
            details: new Set(),
        };
        existing.sources.add(source);
        if (detail) existing.details.add(String(detail).slice(0, 220));
        traces.set(normalized, existing);
    };

    try {
        for (const key of Object.keys(extension_settings || {})) add(key, '扩展设置');
    } catch {}

    try {
        for (const script of document.querySelectorAll('script[src]')) {
            const src = String(script.getAttribute('src') || '');
            if (!MEMORY_TRACE_RE.test(src)) continue;
            const parts = src.split(/[/?#]/).filter(Boolean);
            const thirdPartyIndex = parts.findIndex(x => x === 'third-party');
            const token = thirdPartyIndex >= 0
                ? parts[thirdPartyIndex + 1]
                : parts.at(-2) || parts.at(-1) || src;
            add(token, '已加载扩展', src);
        }
    } catch {}

    return [...traces.values()].map(item => ({
        id: item.id,
        token: item.token,
        sources: [...item.sources],
        details: [...item.details],
    }));
}

function findMatchingTrace(globalKey, traces) {
    const keyNorm = normalizedToken(globalKey);
    if (!keyNorm) return null;
    let best = null;
    for (const trace of traces) {
        const tokenNorm = normalizedToken(trace.token);
        const detailNorm = normalizedToken(trace.details.join(' '));
        const exact = tokenNorm === keyNorm;
        const contains = tokenNorm && (tokenNorm.includes(keyNorm) || keyNorm.includes(tokenNorm));
        const detailHit = detailNorm.includes(keyNorm);
        if (!exact && !contains && !detailHit) continue;
        const score = exact ? 3 : contains ? 2 : 1;
        if (!best || score > best.score) best = { trace, score };
    }
    return best?.trace || null;
}

function providerDisplayName(api, globalKey, trace = null) {
    return readDeclaredName(api)
        || safeText(trace?.token)
        || titleFromToken(globalKey)
        || '已检测到的记忆来源';
}

function providerDetails(api) {
    const parts = ['公开接口：getInjectedHistory'];
    const apiVersion = api?.apiVersion ?? api?.version;
    const pluginVersion = api?.pluginVersion ?? api?.extensionVersion;
    if (apiVersion !== undefined && apiVersion !== null && String(apiVersion).trim()) {
        parts.push(`API v${String(apiVersion).trim()}`);
    }
    if (pluginVersion !== undefined && pluginVersion !== null && String(pluginVersion).trim()) {
        parts.push(`版本 ${String(pluginVersion).trim()}`);
    }
    return parts.join(' · ');
}

function detectReadablePublicApis(traces) {
    const results = [];
    let keys = [];
    try {
        keys = Object.getOwnPropertyNames(globalThis);
    } catch {
        return results;
    }

    for (const key of keys) {
        if (EXCLUDED_GLOBAL_KEYS.has(key)) continue;
        const api = safeGlobalValue(key);
        if (!api || (typeof api !== 'object' && typeof api !== 'function')) continue;

        let reader;
        try {
            reader = api.getInjectedHistory;
        } catch {
            continue;
        }
        if (typeof reader !== 'function') continue;

        const trace = findMatchingTrace(key, traces);
        results.push({
            id: `global:${encodeURIComponent(key)}`,
            name: providerDisplayName(api, key, trace),
            kind: 'public-api',
            readable: true,
            selectedAllowed: true,
            status: '可读取',
            source: `globalThis.${key}`,
            details: providerDetails(api),
            matchedTraceId: trace?.id || '',
        });
        if (results.length >= MAX_READABLE_RESULTS) break;
    }

    return results;
}

function dedupeScanResults(results) {
    const map = new Map();
    for (const item of results) {
        if (!item?.id) continue;
        const key = item.id.toLowerCase();
        const existing = map.get(key);
        if (!existing || (!existing.readable && item.readable)) map.set(key, item);
    }
    return [...map.values()];
}

export function scanMemoryPlugins() {
    const traces = collectExtensionTraces();
    const readable = detectReadablePublicApis(traces);
    const matchedTraceIds = new Set(readable.map(item => item.matchedTraceId).filter(Boolean));
    const readableNames = readable.map(item => normalizedToken(`${item.name} ${item.source}`));

    const pending = [];
    for (const trace of traces) {
        if (matchedTraceIds.has(trace.id)) continue;
        const traceNorm = normalizedToken(`${trace.token} ${trace.details.join(' ')}`);
        if (readableNames.some(name => name && traceNorm && (name.includes(traceNorm) || traceNorm.includes(name)))) continue;
        pending.push({
            id: `trace:${encodeURIComponent(trace.token)}`,
            name: titleFromToken(trace.token),
            kind: 'installation-trace',
            readable: false,
            selectedAllowed: false,
            status: '待适配',
            source: trace.sources.join('、') || '扩展痕迹',
            details: trace.details[0] || '未检测到可直接调用的公开读取接口',
        });
        if (pending.length >= MAX_PENDING_RESULTS) break;
    }

    return dedupeScanResults([...readable, ...pending]).sort((a, b) => {
        if (a.readable !== b.readable) return a.readable ? -1 : 1;
        return a.name.localeCompare(b.name, 'zh-CN');
    });
}

function normalizeMemoryText(result) {
    if (result == null) return '';
    if (typeof result === 'string') return result.trim();
    if (Array.isArray(result)) {
        return result.map(item => normalizeMemoryText(item)).filter(Boolean).join('\n').trim();
    }
    if (typeof result !== 'object') return String(result).trim();

    const preferred = ['relativeText', 'text', 'content', 'memoryText', 'historyText', 'summary'];
    for (const key of preferred) {
        if (typeof result[key] === 'string' && result[key].trim()) return result[key].trim();
    }
    if (Array.isArray(result.nodes)) {
        const nodeText = result.nodes
            .map(node => node?.relativeText || node?.text || node?.summary || '')
            .filter(Boolean)
            .join('\n');
        if (nodeText.trim()) return nodeText.trim();
    }
    return '';
}

function balancedLimit(text, maxChars) {
    const raw = String(text || '').trim();
    const max = Math.max(400, Number(maxChars) || 2200);
    if (raw.length <= max) return raw;
    const headSize = Math.floor(max * 0.35);
    const tailSize = max - headSize - 26;
    return `${raw.slice(0, headSize).trim()}\n……[中段为控制长度已省略]……\n${raw.slice(-tailSize).trim()}`;
}

function resolveProviderId(providerId) {
    const raw = String(providerId || '');
    return LEGACY_PROVIDER_ALIASES.get(raw) || raw;
}

function readGlobalProvider(providerId) {
    const resolvedId = resolveProviderId(providerId);
    const encoded = resolvedId.slice('global:'.length);
    const key = decodeURIComponent(encoded);
    const api = safeGlobalValue(key);
    if (!api || typeof api.getInjectedHistory !== 'function') {
        throw new Error(`${titleFromToken(key)} 的公开读取接口当前不可用`);
    }

    const result = api.getInjectedHistory();
    if (result && typeof result.then === 'function') {
        throw new Error('当前版本暂不支持异步 getInjectedHistory 接口');
    }

    let snapshot = null;
    if (typeof api.getSnapshot === 'function') {
        try {
            snapshot = api.getSnapshot();
        } catch {}
    }

    const traces = collectExtensionTraces();
    const trace = findMatchingTrace(key, traces);
    return {
        providerId: resolvedId,
        providerName: providerDisplayName(api, key, trace),
        text: normalizeMemoryText(result),
        coverage: result?.coverage || snapshot?.coverage || null,
        chat: result?.chat || snapshot?.chat || null,
        revision: result?.revision ?? snapshot?.revision ?? null,
    };
}

export function readMemoryProvider(providerId) {
    const resolvedId = resolveProviderId(providerId);
    if (resolvedId.startsWith('global:')) return readGlobalProvider(resolvedId);
    throw new Error('当前来源只有扫描记录，尚无可用读取接口');
}

export function testMemoryProvider(providerId) {
    const startedAt = globalThis.performance?.now?.() ?? Date.now();
    try {
        const result = readMemoryProvider(providerId);
        const elapsed = Math.max(0, Math.round((globalThis.performance?.now?.() ?? Date.now()) - startedAt));
        const text = String(result.text || '').trim();
        return {
            ok: true,
            providerId: result.providerId || providerId,
            providerName: result.providerName,
            chars: text.length,
            hasContent: !!text,
            chatId: result.chat?.id || '',
            characterName: result.chat?.characterName || '',
            coverageComplete: result.coverage?.complete,
            missingFloors: Array.isArray(result.coverage?.missingAiFloors) ? result.coverage.missingAiFloors.length : 0,
            revision: result.revision,
            elapsed,
        };
    } catch (error) {
        return {
            ok: false,
            providerId,
            error: error?.message || String(error),
        };
    }
}

function normalizedDedupKey(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, '').slice(0, 1200);
}

export function readSelectedMemoryForPrompt(settings, maxChars = 2200, additionalMaterials = []) {
    if (!settings?.memoryScanEnabled) return null;
    const selected = Array.isArray(settings.memoryProviderIds) ? settings.memoryProviderIds : [];
    if (!selected.length && !additionalMaterials.length) return null;

    const chunks = [];
    const seen = new Set();
    const errors = [];
    const sources = [];
    const append = (result, providerId) => {
        const text = String(result?.text || '').trim();
        if (!text) return;
        const key = normalizedDedupKey(text);
        if (seen.has(key)) return;
        seen.add(key);
        sources.push(result.providerName || providerId);
        const coverageNote = result.coverage?.reason === 'worldbook-material-limit'
            ? '\n[来源提示：本次仅按字符上限选取部分世界书资料，不代表完整世界书。]'
            : result.coverage?.complete === false
                ? `\n[来源提示：该记忆存在缺口，缺失楼层数 ${Array.isArray(result.coverage?.missingAiFloors) ? result.coverage.missingAiFloors.length : '未知'}]`
                : '';
        chunks.push(`【来源：${result.providerName || providerId}】\n${text}${coverageNote}`);
    };

    for (const rawProviderId of selected.slice(0, 6)) {
        const providerId = resolveProviderId(rawProviderId);
        try {
            const result = readMemoryProvider(providerId);
            append(result, providerId);
        } catch (error) {
            errors.push(`${providerId}: ${error?.message || error}`);
        }
    }
    for (const result of additionalMaterials.slice(0, 1)) append(result, result?.providerId || '已绑定世界书');

    if (!chunks.length) return errors.length ? { text: '', sources: [], errors } : null;
    return {
        text: balancedLimit(chunks.join('\n\n'), maxChars),
        sources,
        errors,
    };
}

/** The async material phase runs after selection, never during scan/plan/preview. */
export async function prepareSelectedMemoryForPrompt(settings, options = {}) {
    if (!settings?.memoryScanEnabled || options.hasSharedMemoryTheme !== true) return null;
    const independent = String(options.generationType || 'normal') === 'independent';
    const maxChars = Math.max(600, Math.min(6000, Math.floor(Number(options.maxChars ?? settings.memoryMaxChars) || 2200)));
    const additional = [];
    let worldBookError = '';
    if (settings.memoryWorldBookEnabled === true && typeof settings.memoryWorldBookId === 'string' && settings.memoryWorldBookId.trim()) {
        try {
            const { readBoundMemoryWorldBook } = await import('./memoryWorldBook.js?rmv=1.5.51-narrow1');
            const result = await readBoundMemoryWorldBook(settings, maxChars, options.worldBookOptions);
            if (result) additional.push(result);
        } catch (error) {
            worldBookError = `记忆世界书: ${error?.message || String(error)}`;
        }
    }
    // The new, explicitly bound worldbook is available in both generation modes.
    // Do not silently broaden the pre-existing plugin API access of independent mode.
    const materialSettings = independent ? { ...settings, memoryProviderIds: [] } : settings;
    const material = readSelectedMemoryForPrompt(materialSettings, maxChars, additional);
    if (!worldBookError) return material;
    return {
        ...(material || { text: '', sources: [], errors: [] }),
        errors: [...(material?.errors || []), worldBookError],
    };
}

export function memoryRequestSettingsKey(settings, generationType = 'normal') {
    return JSON.stringify([
        settings?.memoryScanEnabled === true,
        settings?.memoryWorldBookEnabled === true,
        String(settings?.memoryWorldBookId || ''),
        Number(settings?.memoryMaxChars) || 2200,
        generationType === 'independent' ? [] : (Array.isArray(settings?.memoryProviderIds) ? settings.memoryProviderIds : []),
        settings?.enabled !== false, settings?.autoRabbitMirrorInjection !== false,
        String(settings?.generationSource || 'follow'), String(settings?.mode || ''),
    ]);
}

export function assertMemoryRequestSettings(settings, expected, generationType = 'normal') {
    if (memoryRequestSettingsKey(settings, generationType) === expected) return;
    const error = new Error('共同回忆资料设置在读取期间已变化；本轮未发送或注入兔子镜，请按当前设置重试。');
    error.code = 'RABBIT_MIRROR_MEMORY_STALE';
    error.requestCount = 0;
    throw error;
}
