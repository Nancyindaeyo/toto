import { packBatchPlanText, unpackBatchPlanText } from './batchPlanCodec.js?rmv=1.5.51-narrow1';

const STORAGE_KEY = 'rabbit_mirror_theater:last_combo:v11';
const PENDING_KEY = 'rabbit_mirror_theater:pending_combo:v11';
const MAX_STORED = 20;
const ATTEMPT_STORAGE_KEY = 'rabbit_mirror_theater:generation_attempts:v1';
const DIRECTIVE_PICK_STORAGE_KEY = 'rabbit_mirror_theater:directive_pick_cache:v1';
const MAX_ATTEMPTS_PER_CHAT = 20;
const MAX_DIRECTIVE_PICKS_PER_CHAT = 24;
const ATTEMPT_TTL_MS = 12 * 60 * 60 * 1000;
const DIRECTIVE_PICK_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const FORMAT_ELIGIBLE_MISS_STORAGE_KEY = 'rabbit_mirror_theater:format_eligible_misses:v1';
const FORMAT_ELIGIBLE_MISS_CAP = 320;

function normalizeFormatEligibleMisses(raw, validFormatIds = []) {
    const valid = new Set((validFormatIds || []).map(id => String(id || '').trim()).filter(Boolean));
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const normalized = {};
    for (const [rawId, rawValue] of Object.entries(source)) {
        const sourceId = String(rawId || '').trim();
        const id = sourceId === '6.2.1.2' ? '6.2.1.1.e' : sourceId;
        if (!id || (valid.size && !valid.has(id))) continue;
        const value = Number(rawValue);
        if (!Number.isFinite(value) || value < 0) continue;
        const misses = Math.min(FORMAT_ELIGIBLE_MISS_CAP, Math.floor(value));
        if (misses > 0) normalized[id] = Math.max(Number(normalized[id] || 0), misses);
    }
    return normalized;
}

function readFormatEligibleMissStore(validFormatIds = []) {
    try {
        return normalizeFormatEligibleMisses(
            JSON.parse(localStorage.getItem(FORMAT_ELIGIBLE_MISS_STORAGE_KEY) || '{}'),
            validFormatIds,
        );
    } catch {
        return {};
    }
}

function writeFormatEligibleMissStore(value) {
    try {
        localStorage.setItem(FORMAT_ELIGIBLE_MISS_STORAGE_KEY, JSON.stringify(value || {}));
        return true;
    } catch (error) {
        console.warn('[RabbitMirror] Failed to store format fairness state:', error);
        return false;
    }
}

export function getFormatEligibleMisses(validFormatIds = []) {
    return readFormatEligibleMissStore(validFormatIds);
}

export function recordFormatEligibleMissRound({ eligibleIds = [], selectedIds = [], validFormatIds = [] } = {}) {
    const valid = new Set((validFormatIds || []).map(id => String(id || '').trim()).filter(Boolean));
    const eligible = [...new Set((eligibleIds || []).map(id => String(id || '').trim()).filter(id => id && (!valid.size || valid.has(id))))];
    if (!eligible.length) return false;

    const selected = new Set((selectedIds || []).map(id => String(id || '').trim()).filter(Boolean));
    const state = readFormatEligibleMissStore(validFormatIds);

    for (const id of eligible) {
        if (selected.has(id)) {
            delete state[id];
            continue;
        }
        const next = Math.min(FORMAT_ELIGIBLE_MISS_CAP, Number(state[id] || 0) + 1);
        state[id] = next;
    }

    // 每次真实随机抽签本来就需要持久化 aging；即使所有计数都已到 cap，也写回一次
    // 规范化后的稀疏 map，以便顺手清掉已经从当前 format 索引消失的旧 ID / 非法值。
    return writeFormatEligibleMissStore(state);
}

export function resetFormatEligibleMisses(formatIds = []) {
    const targets = [...new Set((formatIds || []).map(id => String(id || '').trim()).filter(Boolean))];
    if (!targets.length) return false;
    const state = readFormatEligibleMissStore();
    let changed = false;
    for (const id of targets) {
        if (state[id] === undefined) continue;
        delete state[id];
        changed = true;
    }
    return changed ? writeFormatEligibleMissStore(state) : true;
}

// 抽签写入 pending 后，只有真正渲染出兔子镜才会提交。若生成被取消、请求失败或页面刷新，
// pending 会一直留在 localStorage；之后任意一面兔子镜渲染完成都会把这个从未生成过的组合
// 当作本轮结果写进正式历史，污染冷却与避让，并把新镜子的视觉指纹贴到旧组合上。
//
// 页面会话标记是主判据：它在模块加载时生成且不持久化，因此上一次页面会话写入的 pending
// 一定不等于当前值，可以确定那次生成已经不可能仍在进行。
const PENDING_SESSION_TOKEN = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// 同一次页面会话内的兜底上限。必须显著大于任何仍可能正常完成的生成：
// 副 API 单次请求上限 5 分钟，profile 回退最多 12 次串行，理论最坏约 60 分钟；
// 跟随模式没有自己的超时，完全跟随宿主生成生命周期。因此取与本文件既有「生成相关本地
// 状态」同一量级的 12 小时，留出十余倍余量，宁可漏判也不误杀慢请求。真正兜住孤儿
// pending 的是会话标记：任何漏判都会在下一次页面加载时被清掉。
const PENDING_MAX_AGE_MS = 12 * 60 * 60 * 1000;

// 容量类错误与权限／禁用类错误必须区分：前者可以靠丢弃过期数据自救，后者丢多少都没用，
// 删数据只会白白损失状态。
function isStorageQuotaError(error) {
    if (!error) return false;
    const name = String(error.name || '');
    const code = Number(error.code);
    return name === 'QuotaExceededError'
        || name === 'NS_ERROR_DOM_QUOTA_REACHED'
        || code === 22
        || code === 1014;
}

function scopedBucketFullyExpired(bucket, ttlMs, now) {
    if (!Array.isArray(bucket)) return true;
    if (!bucket.length) return true;
    return bucket.every(item => !item || now - Number(item.ts || 0) > ttlMs);
}

// 读路径只做内存过滤，因此过期的外来 chat 桶需要一个回收出口。挂在本来就要写盘的时刻，
// 每次只回收第一个遇到的全过期外来桶：无需定时器或轮询，回收速度与使用频率自然成正比，
// 单次写入的额外开销也保持恒定。
function reclaimOneExpiredForeignBucket(store, currentKey, ttlMs) {
    if (!store || typeof store !== 'object') return '';
    const now = Date.now();
    for (const key of Object.keys(store)) {
        if (key === currentKey) continue;
        if (!scopedBucketFullyExpired(store[key], ttlMs, now)) continue;
        delete store[key];
        return key;
    }
    return '';
}

// 配额自救：丢弃最旧的外来 chat 桶（按桶内最新条目时间比较），永不动当前 chat 的数据。
function dropOldestForeignBucket(store, currentKey) {
    if (!store || typeof store !== 'object') return false;
    let oldestKey = '';
    let oldestTs = Infinity;
    for (const key of Object.keys(store)) {
        if (key === currentKey) continue;
        const bucket = Array.isArray(store[key]) ? store[key] : [];
        let newest = 0;
        for (const item of bucket) newest = Math.max(newest, Number(item?.ts || 0));
        if (newest < oldestTs) { oldestTs = newest; oldestKey = key; }
    }
    if (!oldestKey) return false;
    delete store[oldestKey];
    return true;
}

function hashText(text) {
    let hash = 2166136261;
    for (const char of String(text || '')) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}

function firstNonEmpty(values) {
    for (const value of values) {
        if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
}

function getContextSafe() {
    try {
        return globalThis.SillyTavern?.getContext?.() || {};
    } catch {
        return {};
    }
}

function resolveChat(chatOverride = null) {
    const context = getContextSafe();
    if (Array.isArray(context?.chat) && context.chat.length) return context.chat;
    if (Array.isArray(chatOverride) && chatOverride.some(item => typeof item?.is_user === 'boolean')) return chatOverride;
    if (Array.isArray(globalThis.chat)) return globalThis.chat;
    return [];
}

export function getCurrentChatKey(chatOverride = null) {
    const context = getContextSafe();
    const chat = resolveChat(chatOverride);
    const metadata = context?.chatMetadata || globalThis.chat_metadata || {};
    const chatId = firstNonEmpty([
        context?.chatId,
        context?.chat_id,
        metadata?.chat_id,
        metadata?.file_name,
        metadata?.name,
    ]);
    const groupId = firstNonEmpty([context?.groupId, context?.group_id, globalThis.selected_group]);
    const characterId = firstNonEmpty([
        context?.characterId,
        context?.character_id,
        context?.character?.avatar,
        context?.characterName,
        globalThis.this_chid,
    ]);
    const firstMessage = chat[0] || {};
    const seed = firstNonEmpty([
        firstMessage?.send_date,
        firstMessage?.name,
        String(firstMessage?.mes || '').slice(0, 160),
        globalThis.location?.pathname,
    ]);
    return chatId
        ? `chat:${chatId}`
        : groupId
            ? `group:${groupId}:${hashText(seed)}`
            : characterId
                ? `character:${characterId}:${hashText(seed)}`
                : `fallback:${hashText(seed || 'unknown-chat')}`;
}

function readScopedStore(storageKey) {
    try {
        const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function writeScopedStore(storageKey, value, currentKey = '') {
    const store = value && typeof value === 'object' ? value : {};
    try {
        localStorage.setItem(storageKey, JSON.stringify(store));
        return true;
    } catch (error) {
        // 只有容量类错误才值得靠丢数据自救。SecurityError、存储被禁用、权限异常等
        // 丢多少桶都不会成功，此时删除数据是纯损失。
        if (!isStorageQuotaError(error)) {
            console.warn('[RabbitMirror] Failed to store scoped generation state:', error);
            return false;
        }
        if (!dropOldestForeignBucket(store, currentKey)) {
            console.warn('[RabbitMirror] Scoped generation state over quota and nothing safe to drop:', error);
            return false;
        }
        // 最多重试一次：仍然失败说明不是靠丢一个桶能解决的问题。
        try {
            localStorage.setItem(storageKey, JSON.stringify(store));
            return true;
        } catch (retryError) {
            console.warn('[RabbitMirror] Scoped generation state still over quota after reclaim:', retryError);
            return false;
        }
    }
}

function compactIdList(values, limit = 16) {
    return [...new Set((values || []).map(value => String(value || '').trim()).filter(Boolean))].slice(0, limit);
}

function incrementRecentHit(map, value) {
    const key = String(value || '').trim();
    if (!key) return;
    map.set(key, Number(map.get(key) || 0) + 1);
}

function recentHitObject(map) {
    return Object.fromEntries([...map.entries()].map(([key, count]) => [key, Math.max(1, Number(count) || 1)]));
}

export function getRecentGenerationAttemptIds(chatKey, limit = 10) {
    const key = String(chatKey || '').trim();
    if (!key) return { themeIds: [], formatIds: [], themeGroups: [], formatGroups: [], themeIdHits: {}, formatIdHits: {}, themeGroupHits: {}, formatGroupHits: {} };
    const store = readScopedStore(ATTEMPT_STORAGE_KEY);
    const now = Date.now();
    // 读路径只做内存过滤，不写盘：读操作不应产生副作用，单条过期就整表序列化在长聊天里
    // 也是明确的写放大。实际回收发生在 recordGenerationAttempt 本来就要写盘的时刻。
    const items = Array.isArray(store[key])
        ? store[key].filter(item => item && now - Number(item.ts || 0) <= ATTEMPT_TTL_MS)
        : [];
    const recent = items.slice(-Math.max(1, Number(limit) || 10));
    const themeIds = new Set();
    const formatIds = new Set();
    const themeGroups = new Set();
    const formatGroups = new Set();
    const themeIdHits = new Map();
    const formatIdHits = new Map();
    const themeGroupHits = new Map();
    const formatGroupHits = new Map();
    for (const item of recent) {
        for (const id of new Set(item.themeIds || [])) { themeIds.add(id); incrementRecentHit(themeIdHits, id); }
        for (const id of new Set(item.formatIds || [])) { formatIds.add(id); incrementRecentHit(formatIdHits, id); }
        for (const id of new Set(item.themeGroups || [])) { themeGroups.add(id); incrementRecentHit(themeGroupHits, id); }
        for (const id of new Set(item.formatGroups || [])) { formatGroups.add(id); incrementRecentHit(formatGroupHits, id); }
    }
    return {
        themeIds: [...themeIds],
        formatIds: [...formatIds],
        themeGroups: [...themeGroups],
        formatGroups: [...formatGroups],
        themeIdHits: recentHitObject(themeIdHits),
        formatIdHits: recentHitObject(formatIdHits),
        themeGroupHits: recentHitObject(themeGroupHits),
        formatGroupHits: recentHitObject(formatGroupHits),
    };
}

export function recordGenerationAttempt(combo, { chatKey = '', attemptId = '', directiveScoped = false } = {}) {
    const key = String(chatKey || '').trim();
    const id = String(attemptId || '').trim();
    if (!key || !id || !combo) return false;
    const store = readScopedStore(ATTEMPT_STORAGE_KEY);
    const now = Date.now();
    const items = Array.isArray(store[key])
        ? store[key].filter(item => item && now - Number(item.ts || 0) <= ATTEMPT_TTL_MS)
        : [];
    if (items.some(item => item.attemptId === id)) return false;
    items.push({
        attemptId: id,
        themeIds: compactIdList(combo.themeIds),
        formatIds: compactIdList(combo.formatIds),
        themeGroups: compactIdList(combo.themeGroups),
        formatGroups: compactIdList(combo.formatGroups),
        directiveScoped: !!directiveScoped,
        ts: now,
    });
    store[key] = items.slice(-MAX_ATTEMPTS_PER_CHAT);
    reclaimOneExpiredForeignBucket(store, key, ATTEMPT_TTL_MS);
    return writeScopedStore(ATTEMPT_STORAGE_KEY, store, key);
}

export function getDirectiveScopedPick(chatKey, directiveScopeKey) {
    const chat = String(chatKey || '').trim();
    const scope = String(directiveScopeKey || '').trim();
    if (!chat || !scope) return null;
    const store = readScopedStore(DIRECTIVE_PICK_STORAGE_KEY);
    const now = Date.now();
    const items = Array.isArray(store[chat])
        ? store[chat].filter(item => item && now - Number(item.ts || 0) <= DIRECTIVE_PICK_TTL_MS)
        : [];
    // 同上：读路径无副作用，回收挂在 setDirectiveScopedPick 的写盘时刻。
    const found = items.find(item => item.scopeKey === scope) || null;
    return found ? { ...found } : null;
}

export function setDirectiveScopedPick(chatKey, directiveScopeKey, combo) {
    const chat = String(chatKey || '').trim();
    const scope = String(directiveScopeKey || '').trim();
    if (!chat || !scope || !combo) return false;
    const store = readScopedStore(DIRECTIVE_PICK_STORAGE_KEY);
    const now = Date.now();
    const items = Array.isArray(store[chat])
        ? store[chat].filter(item => item && now - Number(item.ts || 0) <= DIRECTIVE_PICK_TTL_MS && item.scopeKey !== scope)
        : [];
    items.push({
        scopeKey: scope,
        themeIds: compactIdList(combo.themeIds),
        formatIds: compactIdList(combo.formatIds),
        uiReviewFocus: Array.isArray(combo.uiReviewFocus) ? combo.uiReviewFocus.slice(0, 8) : [],
        ts: now,
    });
    store[chat] = items.slice(-MAX_DIRECTIVE_PICKS_PER_CHAT);
    reclaimOneExpiredForeignBucket(store, chat, DIRECTIVE_PICK_TTL_MS);
    return writeScopedStore(DIRECTIVE_PICK_STORAGE_KEY, store, chat);
}


function readHistory() {
    try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === 'object') return [raw];
        return [];
    } catch {
        return [];
    }
}

function signatureOf(combo) {
    return JSON.stringify({
        themeIds: combo?.themeIds || [],
        formatIds: combo?.formatIds || [],
        samplingMode: combo?.samplingMode || 'classic',
        forcedVisualScenery: !!combo?.forcedVisualScenery,
    });
}

export function getComboHistory(limit = 10) {
    const history = readHistory();
    return history.slice(-Math.max(0, Number(limit) || 10));
}

export function getLastCombo() {
    const history = readHistory();
    return history[history.length - 1] || {};
}

export function getRecentIds(limit = 10) {
    const history = getComboHistory(limit);
    const themeIds = new Set();
    const formatIds = new Set();
    const themeGroups = new Set();
    const formatGroups = new Set();
    const themeIdHits = new Map();
    const formatIdHits = new Map();
    const themeGroupHits = new Map();
    const formatGroupHits = new Map();
    const uiReviewFocus = [];

    for (const combo of history) {
        for (const id of new Set(combo?.themeIds || [])) { themeIds.add(id); incrementRecentHit(themeIdHits, id); }
        for (const id of new Set(combo?.formatIds || [])) { formatIds.add(id); incrementRecentHit(formatIdHits, id); }
        for (const id of new Set(combo?.themeGroups || [])) { themeGroups.add(id); incrementRecentHit(themeGroupHits, id); }
        for (const id of new Set(combo?.formatGroups || [])) { formatGroups.add(id); incrementRecentHit(formatGroupHits, id); }
        if (Array.isArray(combo?.uiReviewFocus) && combo.uiReviewFocus.length) {
            uiReviewFocus.push(combo.uiReviewFocus.join('；'));
        }
    }

    return {
        themeIds: [...themeIds],
        formatIds: [...formatIds],
        themeGroups: [...themeGroups],
        formatGroups: [...formatGroups],
        themeIdHits: recentHitObject(themeIdHits),
        formatIdHits: recentHitObject(formatIdHits),
        themeGroupHits: recentHitObject(themeGroupHits),
        formatGroupHits: recentHitObject(formatGroupHits),
        uiReviewFocus: uiReviewFocus.slice(-limit),
    };
}


export function getRecentRiskFlags(limit = 3) {
    const history = getComboHistory(limit);
    const flags = [];
    for (const item of history) {
        if (Array.isArray(item?.riskFlags)) flags.push(...item.riskFlags);
    }
    return [...new Set(flags)];
}

export function getRecentRiskFlagCounts(limit = 3) {
    const history = getComboHistory(limit);
    const counts = {};
    for (const item of history) {
        for (const flag of item?.riskFlags || []) {
            counts[flag] = (counts[flag] || 0) + 1;
        }
    }
    return counts;
}


export function getRecentPaletteFingerprints(limit = 3) {
    return getComboHistory(limit)
        .map(item => item?.paletteFingerprint)
        .filter(item => item && typeof item === 'object' && Number(item.confidence || 0) >= 0.35)
        .slice(-Math.max(0, Number(limit) || 3));
}

function isDarkPaletteTrigger(fingerprint) {
    if (!fingerprint || typeof fingerprint !== 'object') return false;
    const confidence = Number(fingerprint.confidence || 0);
    const darkAreaRatio = Number(fingerprint.darkAreaRatio || 0);
    const averageLuminance = Number(fingerprint.averageLuminance || 255);
    return confidence >= 0.5
        && fingerprint.brightness === 'dark'
        && (darkAreaRatio >= 0.55 || averageLuminance <= 105);
}

// 1.3.52: 原本整条配色反馈链只认“暗”。米黄／奶油是 brightness:'light' + temperature:'warm'
// + saturation:'low'，永远不会触发任何冷却；同时反黑规则还在持续把模型推向“高明度暖中性色”，
// 于是米黄成为唯一的收敛点，一旦落进去就再也出不来。
// classifyPaletteSamples 早就算出了 hueFamily / temperature / saturation，这里开始真正使用它们。
const PALETTE_BRIGHTNESS_LABELS = { dark: '低明度', mid: '中明度', light: '高明度' };
const PALETTE_TEMPERATURE_LABELS = { warm: '暖', cool: '冷', neutral: '中性' };
const PALETTE_SATURATION_LABELS = { low: '低饱和', medium: '中饱和', high: '高饱和' };
const PALETTE_HUE_LABELS = {
    red: '红', orange: '橙', yellow: '黄', green: '绿',
    cyan: '青', blue: '蓝', purple: '紫', pink: '粉', neutral: '中性色',
};

// 1.4.30.5: 配色冷却不再给任何具体颜色家族特殊待遇。
// 统一使用同一组结构维度描述近期成品，避免“禁蓝→全紫→再禁紫”式颜色打地鼠。
export function paletteFamilyKey(fingerprint) {
    if (!fingerprint || typeof fingerprint !== 'object') return '';
    if (Number(fingerprint.confidence || 0) < 0.35) return '';
    const brightness = String(fingerprint.brightness || '').trim();
    if (!brightness) return '';
    const hueFamily = String(fingerprint.hueFamily || 'neutral').trim() || 'neutral';
    const temperature = String(fingerprint.temperature || 'neutral').trim() || 'neutral';
    const saturation = String(fingerprint.saturation || 'low').trim() || 'low';
    return `${brightness}|${hueFamily}|${temperature}|${saturation}`;
}

export function describePaletteFamily(fingerprint) {
    if (!fingerprint || typeof fingerprint !== 'object') return '';
    const brightness = PALETTE_BRIGHTNESS_LABELS[String(fingerprint.brightness || '')] || '';
    const temperature = PALETTE_TEMPERATURE_LABELS[String(fingerprint.temperature || '')] || '';
    const saturation = PALETTE_SATURATION_LABELS[String(fingerprint.saturation || '')] || '';
    const hue = PALETTE_HUE_LABELS[String(fingerprint.hueFamily || 'neutral')] || '';
    return [brightness, temperature, hue, saturation].filter(Boolean).join('');
}

// 1.4.30.5: 不再等重复已经形成才纠偏。每一面真实成品完成后立即进入短期冷却；
// 这里只按时间距离返回近期真实配色，不决定下一轮该用什么颜色。
export function getRecentPaletteCooldown(window = 3) {
    const span = Math.max(1, Number(window) || 3);
    const recent = getRecentPaletteFingerprints(span).slice().reverse();
    return recent.map((fingerprint, roundsAgo) => ({
        fingerprint,
        key: paletteFamilyKey(fingerprint),
        label: describePaletteFamily(fingerprint),
        roundsAgo,
        strength: Math.max(1, span - roundsAgo),
    })).filter(item => item.label);
}


const VISUAL_FAMILY_DIMENSION_LABELS = Object.freeze({
    surface_family: '主底盘／材质',
    contrast_family: '明暗关系',
    contour_family: '整体轮廓',
    reading_family: '阅读路径',
    unit_family: '信息单位',
    space_family: '空间结构',
});

export function parseVisualFamilySkeleton(value = '') {
    const text = String(value || '').trim();
    if (!text) return {};
    const parsed = {};
    for (const part of text.split('；')) {
        const match = part.match(/^\s*([a-z_]+)\s*:\s*(.+?)\s*$/i);
        if (!match) continue;
        const key = String(match[1] || '').trim();
        if (!Object.prototype.hasOwnProperty.call(VISUAL_FAMILY_DIMENSION_LABELS, key)) continue;
        const valueText = String(match[2] || '').trim();
        if (valueText) parsed[key] = valueText.slice(0, 120);
    }
    return parsed;
}

export function describeVisualFamilyDimensions(family = {}) {
    if (!family || typeof family !== 'object') return '';
    return Object.entries(VISUAL_FAMILY_DIMENSION_LABELS)
        .map(([key, label]) => family[key] ? `${label}=${family[key]}` : '')
        .filter(Boolean)
        .join('；');
}

export function getRecentVisualFamilyCooldown(window = 3) {
    const span = Math.max(1, Number(window) || 3);
    return getComboHistory(span)
        .slice()
        .reverse()
        .map((item, roundsAgo) => ({
            family: parseVisualFamilySkeleton(item?.visualSkeleton || ''),
            roundsAgo,
            strength: Math.max(1, span - roundsAgo),
        }))
        .filter(item => Object.keys(item.family).length);
}

export function getRepeatedVisualFamilyDimensions(window = 3, threshold = 2) {
    const span = Math.max(2, Number(window) || 3);
    const hits = Math.max(2, Number(threshold) || 2);
    const chronological = getComboHistory(span)
        .map(item => parseVisualFamilySkeleton(item?.visualSkeleton || ''))
        .filter(family => Object.keys(family).length);
    if (chronological.length < hits) return [];

    const latest = chronological[chronological.length - 1];
    const result = [];
    for (const [key, label] of Object.entries(VISUAL_FAMILY_DIMENSION_LABELS)) {
        const latestValue = latest[key];
        if (!latestValue) continue;
        let streak = 0;
        for (let index = chronological.length - 1; index >= 0; index -= 1) {
            if (chronological[index]?.[key] !== latestValue) break;
            streak += 1;
        }
        if (streak < hits) continue;
        result.push({ key, label, value: latestValue, streak, strength: Math.min(span, streak) });
    }
    return result;
}

// 近 window 轮中，最新一轮所属的配色家族出现了 threshold 次及以上即视为重复。
// 与 getActivePaletteCooldown 的“只防暗”互补：这条对任何家族一视同仁，包括米黄。
export function getRepeatedPaletteFamily(window = 3, threshold = 2) {
    const span = Math.max(2, Number(window) || 3);
    const hits = Math.max(2, Number(threshold) || 2);
    const recent = getComboHistory(span)
        .map(item => item?.paletteFingerprint)
        .filter(item => item && typeof item === 'object');
    const keyed = recent.map(item => ({ item, key: paletteFamilyKey(item) })).filter(entry => entry.key);
    if (keyed.length < hits) return null;
    const latest = keyed[keyed.length - 1];
    const count = keyed.filter(entry => entry.key === latest.key).length;
    if (count < hits) return null;
    return {
        key: latest.key,
        count,
        window: keyed.length,
        label: describePaletteFamily(latest.item) || latest.key,
        fingerprint: latest.item,
    };
}

// 一次低明度主承载输出触发后续五轮冷却；冷却期内若再次命中则重新从五轮开始。
export function getActivePaletteCooldown(rounds = 5) {
    const cooldownRounds = Math.max(1, Number(rounds) || 5);
    const history = readHistory();
    for (let index = history.length - 1; index >= 0; index -= 1) {
        const fingerprint = history[index]?.paletteFingerprint;
        if (!isDarkPaletteTrigger(fingerprint)) continue;
        const completedSinceTrigger = history.length - 1 - index;
        if (completedSinceTrigger >= cooldownRounds) return { active: false, remaining: 0 };
        return {
            active: true,
            remaining: cooldownRounds - completedSinceTrigger,
            completedSinceTrigger,
            fingerprint,
        };
    }
    return { active: false, remaining: 0 };
}

function normalizeInteractionFamily(value) {
    if (!value || typeof value !== 'object') return undefined;
    const id = String(value.id || '').trim();
    if (!id || id === 'none') return undefined;
    return {
        id: id.slice(0, 80),
        label: String(value.label || id).slice(0, 120),
        confidence: Math.max(0, Math.min(1, Number(value.confidence) || 0)),
        controlCount: Math.max(0, Math.min(99, Number(value.controlCount) || 0)),
        panelCount: Math.max(0, Math.min(99, Number(value.panelCount) || 0)),
    };
}

export function getRecentInteractionFamilies(limit = 5) {
    return getComboHistory(limit)
        .map(item => normalizeInteractionFamily(item?.interactionFamily))
        .filter(Boolean)
        .slice(-Math.max(0, Number(limit) || 5));
}

export function getRecentInteractionFamilyCounts(limit = 5) {
    const counts = {};
    for (const family of getRecentInteractionFamilies(limit)) {
        counts[family.id] = (counts[family.id] || 0) + 1;
    }
    return counts;
}

// 单请求多面：批次待提交队列。
//
// 与 PENDING_KEY 分开存放，因为语义不同：PENDING_KEY 是"一次生成一个组合"，
// 多面是"一次生成 N 个组合，各自等待自己那一面真正渲染完成后再分别提交"。
// 本层只提供显式提交能力；真正成功和当前 owner 的证明由未来 C2 调用方负责。
const PENDING_BATCH_KEY = 'rabbit_mirror_theater:pending_batch:v1';
// Keep the old slot readable for requests already in flight in another tab.
// Older runtimes must never mistake a packed plan for prompt-ready material.
const LEGACY_BATCH_REGISTRY_KEY = 'rabbit_mirror_theater:pending_batch_registry:v2';
const ACTIVE_BATCH_REGISTRY_KEY = 'rabbit_mirror_theater:pending_batch_registry:v3';
const ACTIVE_BATCH_REGISTRY_MAX = 8;
const ACTIVE_BATCH_REGISTRY_MAX_CHARS = 1024 * 1024;
let pendingBatchSequence = 0;

// These values come from the caller's already-proven owner/operation, never
// from model HTML or a scan of the current chat.
function normalizeBatchIdentity(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const operation = value.kind === 'generation-operation';
    const stringLimits = operation
        ? { chatKey: 1024, generationScopeKey: 1024, operationId: 1024, generationType: 64, settingsKey: 8192 }
        : { chatKey: 1024, generationScopeKey: 1024, sourceHash: 512, settingsKey: 8192 };
    for (const [key, limit] of Object.entries(stringLimits)) {
        if (typeof value[key] !== 'string' || !value[key].trim() || value[key].length > limit) return null;
    }
    if (operation && typeof value.preview !== 'boolean') return null;
    if (operation) return {
        kind: 'generation-operation', chatKey: value.chatKey, generationScopeKey: value.generationScopeKey,
        operationId: value.operationId, generationType: value.generationType, settingsKey: value.settingsKey,
        preview: value.preview === true,
    };
    if (value.kind != null && value.kind !== 'final-body') return null;
    if (!Number.isSafeInteger(value.mesid) || value.mesid < 0 || !Number.isSafeInteger(value.swipeId) || value.swipeId < 0) return null;
    return {
        chatKey: value.chatKey,
        generationScopeKey: value.generationScopeKey,
        mesid: value.mesid,
        swipeId: value.swipeId,
        sourceHash: value.sourceHash,
        settingsKey: value.settingsKey,
    };
}

function batchMatchesExpected(batch, expected, requireCommitIdentity = false) {
    const identity = batch?.identity == null ? null : normalizeBatchIdentity(batch.identity);
    if (batch?.identity != null && !identity) return false;
    if (expected == null) return !requireCommitIdentity || !identity;
    if (!expected || typeof expected !== 'object' || Array.isArray(expected)) return false;
    const hasBatchId = typeof expected.batchId === 'string' && !!expected.batchId;
    if (Object.prototype.hasOwnProperty.call(expected, 'batchId') && !hasBatchId) return false;
    if (hasBatchId && expected.batchId !== batch.batchId) return false;
    const wantedIdentity = expected.identity == null ? null : normalizeBatchIdentity(expected.identity);
    if (expected.identity != null && !wantedIdentity) return false;
    if (identity) {
        if (!wantedIdentity || Object.keys(identity).some(key => identity[key] !== wantedIdentity[key])) return false;
        if (requireCommitIdentity && !hasBatchId) return false;
    } else if (wantedIdentity) return false;
    return hasBatchId || !!wantedIdentity;
}

function validBatchCombo(combo) {
    if (!combo || typeof combo !== 'object' || Array.isArray(combo)) return false;
    for (const key of ['themeIds', 'formatIds']) {
        if (!Array.isArray(combo[key]) || combo[key].length > 16) return false;
        for (let index = 0; index < combo[key].length; index += 1) {
            if (!Object.prototype.hasOwnProperty.call(combo[key], index)) return false;
            const id = combo[key][index];
            if (typeof id !== 'string' || !id.trim()) return false;
            // Imported IDs include the URI-encoded source filename and stable
            // entry identity. Keep their original IDs (including saved recipes)
            // and match the bounded prompt-material contract; builtin IDs retain
            // their old limit. Truncating or hashing here would change ownership.
            if (id.trimStart().startsWith('ext:')) {
                if (id !== id.trim() || id.length > 2048 || !/^ext:[A-Za-z0-9:._!~*'()-]+$/.test(id)) return false;
            } else if (id.length > 128) return false;
        }
        if (new Set(combo[key]).size !== combo[key].length) return false;
    }
    return combo.themeIds.length + combo.formatIds.length > 0 || combo.customDirective === true;
}

function removeBatchRawIfUnchanged(raw) {
    try {
        if (localStorage.getItem(PENDING_BATCH_KEY) !== raw) return false;
        localStorage.removeItem(PENDING_BATCH_KEY);
        return localStorage.getItem(PENDING_BATCH_KEY) === null;
    } catch { return false; }
}

// localStorage has no cross-tab CAS. Restore only an unchanged value recognisable
// as this attempted write; never overwrite a different batch/value discovered on
// read-back. This is bounded synchronous recovery, not a retry loop.
function restoreOwnedStorageWrite(key, payload, previousRaw, batchId = '') {
    try {
        const current = localStorage.getItem(key);
        if (current === previousRaw) return true;
        if (typeof current !== 'string') return false;
        const ownPrefix = payload.startsWith(current) && current.length > 1
            && (!batchId || current.includes(JSON.stringify(batchId)));
        if (current !== payload && !ownPrefix) return false;
        if (localStorage.getItem(key) !== current) return false;
        if (previousRaw === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previousRaw);
        return localStorage.getItem(key) === previousRaw;
    } catch {
        // A permanently disabled/full store cannot promise a rollback. The caller
        // still reports failure and never marks the face committed.
        return false;
    }
}

function cloneSerializable(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch { return null; }
}

function validStringList(values, maxItems = 512) {
    if (!Array.isArray(values) || values.length > maxItems) return false;
    for (let index = 0; index < values.length; index += 1) {
        const value = values[index];
        if (!Object.prototype.hasOwnProperty.call(values, index) || typeof value !== 'string' || !value.trim()) return false;
        // selectedFormatIds can contain external IDs even though external
        // entries do not receive builtin eligible-miss / soft-pity accounting.
        if (value.trimStart().startsWith('ext:')) {
            if (value !== value.trim() || value.length > 2048 || !/^ext:[A-Za-z0-9:._!~*'()-]+$/.test(value)) return false;
        } else if (value.length > 128) return false;
    }
    return true;
}

function normalizeLocalBatchPlan(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const identity = normalizeBatchIdentity(value.identity);
    if (!identity || typeof value.batchId !== 'string' || !value.batchId.trim() || value.batchId.length > 256 ||
        !Number.isSafeInteger(value.requestedFaceCount) || value.requestedFaceCount < 2 || value.requestedFaceCount > 5 ||
        !Array.isArray(value.faces) || value.faces.length !== value.requestedFaceCount) return null;
    const seen = new Set();
    for (let index = 0; index < value.faces.length; index += 1) if (!Object.prototype.hasOwnProperty.call(value.faces, index)) return null;
    const faces = value.faces.map((face, expectedIndex) => {
        if (!face || typeof face !== 'object' || Array.isArray(face) || face.faceIndex !== expectedIndex || seen.has(face.faceIndex) ||
            !validBatchCombo(face.combo)) return null;
        seen.add(face.faceIndex);
        return { faceIndex: face.faceIndex, combo: cloneSerializable(face.combo) };
    });
    if (faces.some(face => !face)) return null;
    const fairness = value.fairness && typeof value.fairness === 'object' && !Array.isArray(value.fairness) ? value.fairness : {};
    for (const key of ['eligibleFormatIds', 'selectedFormatIds', 'validFormatIds']) if (fairness[key] !== undefined && !validStringList(fairness[key])) return null;
    if (fairness.directiveScoped !== undefined && typeof fairness.directiveScoped !== 'boolean') return null;
    const eligibleFormatIds = [...new Set(fairness.eligibleFormatIds || [])];
    const selectedFormatIds = [...new Set(fairness.selectedFormatIds || [])];
    const validFormatIds = [...new Set(fairness.validFormatIds || [])];
    if (!validStringList(eligibleFormatIds) || !validStringList(selectedFormatIds) || !validStringList(validFormatIds)) return null;
    return {
        kind: 'rabbit-mirror-multiface-plan', schemaVersion: 1, batchId: value.batchId,
        identity, requestedFaceCount: value.requestedFaceCount, faces,
        fairness: { eligibleFormatIds, selectedFormatIds, validFormatIds, directiveScoped: fairness.directiveScoped === true },
    };
}

// Diagnostics are a fixed code only, never IDs, source text or native storage
// errors. The optional observer cannot turn a rejection into dispatch authority.
function reportBatchRejection(options, code) {
    try { if (typeof options?.onRejected === 'function') options.onRejected(code); } catch { /* Observer only. */ }
}

export function createPendingComboBatchPlan(combos = [], identity = null, fairness = {}, options = {}) {
    const reject = code => { reportBatchRejection(options, code); return null; };
    if (!Array.isArray(combos) || combos.length < 2 || combos.length > 5) return reject('BATCH_PLAN_INPUT_INVALID');
    const normalizedIdentity = normalizeBatchIdentity(identity);
    if (!normalizedIdentity) return reject('BATCH_PLAN_IDENTITY_INVALID');
    if (combos.some(combo => !validBatchCombo(combo))) {
        const duplicate = combos.some(combo => ['themeIds', 'formatIds'].some(key =>
            Array.isArray(combo?.[key]) && new Set(combo[key]).size !== combo[key].length));
        return reject(duplicate ? 'BATCH_PLAN_DUPLICATE_ID' : 'BATCH_PLAN_COMBO_INVALID');
    }
    const candidate = normalizeLocalBatchPlan({
        batchId: `${PENDING_SESSION_TOKEN}:${Date.now().toString(36)}:${(++pendingBatchSequence).toString(36)}`,
        identity: normalizedIdentity,
        requestedFaceCount: combos.length,
        faces: combos.map((combo, faceIndex) => ({ faceIndex, combo })),
        fairness,
    });
    if (!candidate) return reject('BATCH_PLAN_INVALID');
    const payload = JSON.stringify(candidate);
    return payload.length <= 262144 ? cloneSerializable(candidate) : reject('BATCH_PLAN_TOO_LARGE');
}

function normalizeActiveBatchRecord(value, storageKey = ACTIVE_BATCH_REGISTRY_KEY) {
    let source = value?.plan;
    if (storageKey === ACTIVE_BATCH_REGISTRY_KEY) {
        const text = unpackBatchPlanText(value?.planPayload);
        if (text === null) return null;
        try { source = JSON.parse(text); } catch { return null; }
    }
    const plan = normalizeLocalBatchPlan(source);
    if (!plan || typeof value.registrySession !== 'string' || !value.registrySession ||
        !Number.isFinite(value.createdAt) || value.createdAt <= 0) return null;
    return { plan, registrySession: value.registrySession, createdAt: value.createdAt, storageKey, stored: value };
}

function readActiveBatchRegistry() {
    try {
        const rawByKey = {};
        const records = [];
        // This path runs only for explicit batch operations, never at startup.
        for (const key of [ACTIVE_BATCH_REGISTRY_KEY, LEGACY_BATCH_REGISTRY_KEY]) {
            const raw = localStorage.getItem(key);
            rawByKey[key] = raw;
            if (raw === null) continue;
            if (raw.length > ACTIVE_BATCH_REGISTRY_MAX_CHARS) return null;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length > ACTIVE_BATCH_REGISTRY_MAX) return null;
            for (const value of parsed) {
                const record = normalizeActiveBatchRecord(value, key);
                if (!record) return null;
                records.push(record);
            }
        }
        return { raw: rawByKey[ACTIVE_BATCH_REGISTRY_KEY], rawByKey, records };
    } catch { return null; }
}

function registryWithoutRecord(registry, record) {
    return JSON.stringify(registry.records
        .filter(item => item.storageKey === record.storageKey && item !== record)
        .map(item => item.stored));
}

function activeBatchRecordIsFresh(record, now = Date.now()) {
    return !!record && record.createdAt <= now + 1000 && now - record.createdAt <= PENDING_MAX_AGE_MS;
}

function planMatchesExpected(plan, expected) {
    return !!plan && !!expected && expected.batchId === plan.batchId &&
        batchMatchesExpected({ batchId: plan.batchId, identity: plan.identity }, expected, true);
}

export function findPendingComboBatchPlan(identity) {
    const normalized = normalizeBatchIdentity(identity);
    const registry = normalized && readActiveBatchRegistry();
    if (!registry) return null;
    const record = registry.records.find(item => activeBatchRecordIsFresh(item) && batchMatchesExpected(
        { batchId: item.plan.batchId, identity: item.plan.identity }, { identity: normalized }, false,
    ));
    return record ? cloneSerializable(record.plan) : null;
}

// Quota recovery has a fixed allowlist, not a prefix scan. These slots contain
// temporary draw reservations/accounting, never rendered or repaired results.
function expiredTransactionTime(at, now) {
    return Number.isFinite(at) && at > 0 && now - at > PENDING_MAX_AGE_MS;
}

function compactExpiredTransactionRaw(key, raw, now) {
    if (raw === null || raw.length > ACTIVE_BATCH_REGISTRY_MAX_CHARS) return raw;
    try {
        const data = JSON.parse(raw);
        let next = data;
        if (key === PENDING_KEY) {
            if (validBatchCombo(data) && typeof data.pendingSession === 'string' && data.pendingSession
                && data.signature === signatureOf(data) && expiredTransactionTime(data.pendingTs, now)) return null;
        } else if (key === PENDING_BATCH_KEY) {
            if (data && typeof data.batchId === 'string' && data.batchId && typeof data.pendingSession === 'string' && data.pendingSession
                && expiredTransactionTime(data.pendingTs, now) && (data.identity == null || normalizeBatchIdentity(data.identity))
                && Array.isArray(data.faces) && data.faces.length >= 2 && data.faces.length <= 5
                && data.faces.every((face, index) => validBatchCombo(face) && face.batchId === data.batchId
                    && face.faceIndex === index && face.signature === signatureOf(face)
                    && (face.committed === undefined || typeof face.committed === 'boolean'))) return null;
        } else if (key === ACTIVE_BATCH_REGISTRY_KEY || key === LEGACY_BATCH_REGISTRY_KEY) {
            if (!Array.isArray(data) || data.length > ACTIVE_BATCH_REGISTRY_MAX || data.some(row => !normalizeActiveBatchRecord(row, key))) return raw;
            // Keep original surviving objects, including fields owned by other tabs.
            next = data.filter(row => !expiredTransactionTime(row.createdAt, now));
        } else if (key === ATTEMPT_STORAGE_KEY) {
            if (!data || typeof data !== 'object' || Array.isArray(data)) return raw;
            next = { ...data };
            for (const [bucket, rows] of Object.entries(data)) {
                if (!Array.isArray(rows)) continue;
                const kept = rows.filter(row => !(row && typeof row.attemptId === 'string' && row.attemptId
                    && validBatchCombo(row) && expiredTransactionTime(row.ts, now)));
                if (kept.length === rows.length) continue;
                if (kept.length) next[bucket] = kept;
                else delete next[bucket];
            }
        } else return raw;
        const result = JSON.stringify(next);
        return result.length < raw.length ? result : raw;
    } catch { return raw; } // Unknown/corrupt schemas are not permission to delete.
}

function reclaimExpiredTransactionsForQuota(changes) {
    const now = Date.now();
    const rebased = changes.map(change => ({ ...change }));
    try {
        // A failed/foreign rollback must never authorize cleanup or overwrite.
        if (rebased.some(change => localStorage.getItem(change.key) !== change.before)) return null;
        for (const key of [PENDING_KEY, PENDING_BATCH_KEY, ACTIVE_BATCH_REGISTRY_KEY, LEGACY_BATCH_REGISTRY_KEY, ATTEMPT_STORAGE_KEY]) {
            const before = localStorage.getItem(key);
            const after = compactExpiredTransactionRaw(key, before, now);
            if (after === before) continue;
            const change = rebased.find(item => item.key === key);
            if ((change && change.before !== before) || localStorage.getItem(key) !== before) return null;
            try {
                if (after === null) localStorage.removeItem(key);
                else localStorage.setItem(key, after);
            } catch (error) {
                // Shrinking writes can also be refused. Only an unchanged slot is
                // safe to skip; do not attempt to repair arbitrary foreign data.
                if (!isStorageQuotaError(error) || localStorage.getItem(key) !== before) return null;
                continue;
            }
            if (localStorage.getItem(key) !== after) return null;
            if (change) {
                change.before = after;
                change.after = compactExpiredTransactionRaw(key, change.after, now);
            }
        }
        return rebased;
    } catch { return null; }
}

function writeOwnedTransaction(changes = [], options = {}, allowQuotaRecovery = false) {
    const completed = [];
    let rejection = 'BATCH_STORAGE_WRITE_FAILED';
    try {
        for (const change of changes) {
            if (localStorage.getItem(change.key) !== change.before) {
                rejection = 'BATCH_STORAGE_CHANGED';
                throw new Error('Concurrent storage change');
            }
            completed.push(change);
            localStorage.setItem(change.key, change.after);
            if (localStorage.getItem(change.key) !== change.after) {
                rejection = 'BATCH_STORAGE_READBACK_MISMATCH';
                throw new Error('Storage read-back mismatch');
            }
        }
        return true;
    } catch (error) {
        for (const change of completed.reverse()) {
            try {
                restoreOwnedStorageWrite(change.key, change.after, change.before);
            } catch { /* Fail closed; caller receives false and never dispatches/commits. */ }
        }
        if (allowQuotaRecovery && isStorageQuotaError(error)) {
            const retry = reclaimExpiredTransactionsForQuota(changes);
            // Same plan and payload, one local retry only. No picker/provider call.
            if (retry) return writeOwnedTransaction(retry, options, false);
        }
        reportBatchRejection(options, isStorageQuotaError(error) ? 'BATCH_STORAGE_QUOTA_EXCEEDED' : rejection);
        return false;
    }
}

function batchPityAgedPayload(plan, beforeRaw) {
    let state;
    try {
        const parsed = JSON.parse(beforeRaw || '{}');
        state = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch { return null; }
    const valid = new Set(plan.fairness.validFormatIds);
    const normalized = normalizeFormatEligibleMisses(state, [...valid]);
    for (const id of plan.fairness.eligibleFormatIds) {
        if (!valid.has(id)) return null;
        normalized[id] = Math.min(FORMAT_ELIGIBLE_MISS_CAP, Number(normalized[id] || 0) + 1);
    }
    return JSON.stringify(normalized);
}

function batchAttemptPayload(plan, beforeRaw, now) {
    let store;
    try {
        const parsed = JSON.parse(beforeRaw || '{}');
        store = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch { store = {}; }
    const key = plan.identity.chatKey;
    const items = Array.isArray(store[key])
        ? store[key].filter(item => item && now - Number(item.ts || 0) <= ATTEMPT_TTL_MS)
        : [];
    const attemptIds = plan.faces.map(face => `${plan.batchId}:${face.faceIndex}`);
    if (items.some(item => attemptIds.includes(item?.attemptId))) return null;
    for (const face of plan.faces) {
        const combo = face.combo;
        items.push({
            attemptId: `${plan.batchId}:${face.faceIndex}`,
            themeIds: compactIdList(combo.themeIds),
            formatIds: compactIdList(combo.formatIds),
            themeGroups: compactIdList(combo.themeGroups),
            formatGroups: compactIdList(combo.formatGroups),
            directiveScoped: plan.fairness.directiveScoped === true,
            ts: now,
        });
    }
    store[key] = items.slice(-MAX_ATTEMPTS_PER_CHAT);
    reclaimOneExpiredForeignBucket(store, key, ATTEMPT_TTL_MS);
    return JSON.stringify(store);
}

export function markPendingBatchAttempt(planInput = null, options = {}) {
    const reject = code => { reportBatchRejection(options, code); return false; };
    const plan = normalizeLocalBatchPlan(planInput);
    if (!plan) return reject(planInput && typeof planInput === 'object' && !Array.isArray(planInput) && !normalizeBatchIdentity(planInput.identity)
        ? 'BATCH_PLAN_IDENTITY_INVALID' : 'BATCH_PLAN_INVALID');
    if (plan.identity.preview === true) return reject('BATCH_PREVIEW_NOT_DISPATCHABLE');
    const registry = readActiveBatchRegistry();
    if (!registry) return reject('BATCH_REGISTRY_UNREADABLE');
    const now = Date.now();
    // A tab can be killed before its finally handler runs. Keep every plausible
    // in-flight request (the independent absolute deadline is 20 minutes), but
    // reclaim only records older than the established 12-hour pending TTL. This
    // avoids both permanent capacity loss after crashes and cross-tab eviction of
    // a live paid request; cleanup happens only inside this explicit dispatch CAS.
    const liveRecords = registry.records.filter(record => !expiredTransactionTime(record.createdAt, now));
    const existing = liveRecords.find(record => record.plan.batchId === plan.batchId);
    if (existing) return JSON.stringify(existing.plan) === JSON.stringify(plan) || reject('BATCH_ID_CONFLICT');
    if (liveRecords.length >= ACTIVE_BATCH_REGISTRY_MAX) return reject('BATCH_REGISTRY_CAPACITY');
    const planPayload = packBatchPlanText(JSON.stringify(plan));
    if (!planPayload) return reject('BATCH_PLAN_TOO_LARGE');
    const record = { planPayload, registrySession: PENDING_SESSION_TOKEN, createdAt: now };
    const registryAfter = JSON.stringify([
        ...liveRecords.filter(item => item.storageKey === ACTIVE_BATCH_REGISTRY_KEY).map(item => item.stored), record,
    ]);
    if (registryAfter.length > ACTIVE_BATCH_REGISTRY_MAX_CHARS) return reject('BATCH_REGISTRY_TOO_LARGE');
    let pityBefore;
    let attemptBefore;
    try {
        pityBefore = localStorage.getItem(FORMAT_ELIGIBLE_MISS_STORAGE_KEY);
        attemptBefore = localStorage.getItem(ATTEMPT_STORAGE_KEY);
    } catch { return reject('BATCH_STORAGE_UNAVAILABLE'); }
    const pityAfter = batchPityAgedPayload(plan, pityBefore);
    const attemptAfter = batchAttemptPayload(plan, attemptBefore, now);
    if (pityAfter === null) {
        // Both failures already rejected before this diagnostic existed. Preserve
        // their state rather than clearing fairness or drawing another plan.
        let invalidState = false;
        try { JSON.parse(pityBefore || '{}'); } catch { invalidState = true; }
        return reject(invalidState ? 'BATCH_FAIRNESS_STATE_INVALID' : 'BATCH_FAIRNESS_PLAN_MISMATCH');
    }
    if (attemptAfter === null) return reject('BATCH_ATTEMPT_ALREADY_RECORDED');
    const changes = [{ key: ACTIVE_BATCH_REGISTRY_KEY, before: registry.raw, after: registryAfter }];
    if (pityAfter !== (pityBefore || '{}')) changes.push({ key: FORMAT_ELIGIBLE_MISS_STORAGE_KEY, before: pityBefore, after: pityAfter });
    if (attemptAfter !== (attemptBefore || '{}')) changes.push({ key: ATTEMPT_STORAGE_KEY, before: attemptBefore, after: attemptAfter });
    // Preserve exactly the same planned values and retention policy. Accounting
    // can already be shrinking (e.g. shorter IDs replacing older attempt rows).
    // Write that reduction before growing the reservation so a fitting final
    // state does not need unnecessary temporary headroom. Owned rollback still
    // runs in reverse order, removing our growth before restoring larger values.
    const shrinks = change => typeof change.before === 'string' && change.after.length < change.before.length;
    return writeOwnedTransaction([...changes.filter(shrinks), ...changes.filter(change => !shrinks(change))], options, true);
}

function normalizeFaceScan(value, faceIndex) {
    if (!value || typeof value !== 'object' || Array.isArray(value) ||
        (value.faceIndex !== undefined && value.faceIndex !== faceIndex)) return null;
    return {
        visualSignature: String(value.visualSignature ?? value.signature ?? '').slice(0, 280),
        visualSkeleton: String(value.visualSkeleton ?? value.skeleton ?? '').slice(0, 420),
        riskFlags: Array.isArray(value.riskFlags) ? [...new Set(value.riskFlags.map(String))].slice(0, 8) : [],
        paletteFingerprint: value.paletteFingerprint && typeof value.paletteFingerprint === 'object' ? value.paletteFingerprint : null,
        interactionFamily: normalizeInteractionFamily(value.interactionFamily),
    };
}

function batchHistoryPayload(plan, scans, beforeRaw) {
    let history;
    try {
        const parsed = JSON.parse(beforeRaw === null ? '[]' : beforeRaw);
        history = Array.isArray(parsed) ? parsed : parsed && typeof parsed === 'object' ? [parsed] : null;
    } catch { return null; }
    if (!history) return null;
    const acceptedFaces = plan.faces.filter(face => scans[face.faceIndex]);
    const existing = acceptedFaces.filter(face => historyHasBatchFace(history, plan.batchId, face.faceIndex));
    if (existing.length) return existing.length === acceptedFaces.length ? beforeRaw : null;
    const now = Date.now();
    for (const face of acceptedFaces) {
        const scan = scans[face.faceIndex];
        const combo = face.combo;
        // Successful history is accounting, not a recovery source for a pending
        // prompt. Consumers use IDs, UI/interaction and visual fingerprints.
        // Preserve those fields while avoiding another copy of mother materials.
        const { themes, formats, ...accounting } = combo;
        history.push({ ...accounting, signature: signatureOf(combo), ts: now, batchId: plan.batchId, faceIndex: face.faceIndex,
            visualSignature: scan.visualSignature || combo.visualSignature,
            visualSkeleton: scan.visualSkeleton || combo.visualSkeleton,
            riskFlags: scan.riskFlags, paletteFingerprint: scan.paletteFingerprint || undefined,
            interactionFamily: scan.interactionFamily, visualSignatureTs: now });
    }
    return JSON.stringify(history.slice(-MAX_STORED));
}

function batchPityCommittedPayload(plan, beforeRaw, scans) {
    let state;
    try {
        const parsed = JSON.parse(beforeRaw || '{}');
        state = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch { return null; }
    const selected = new Set(plan.faces.filter(face => scans[face.faceIndex]).flatMap(face => face.combo.formatIds || []));
    const normalized = normalizeFormatEligibleMisses(state, plan.fairness.validFormatIds);
    for (const id of selected) delete normalized[id];
    return JSON.stringify(normalized);
}

export function commitPendingComboBatch(faceScans = [], expected = null) {
    const registry = readActiveBatchRegistry();
    if (!registry || !expected) return false;
    const index = registry.records.findIndex(record => activeBatchRecordIsFresh(record) && planMatchesExpected(record.plan, expected));
    if (index < 0) return false;
    const record = registry.records[index];
    const plan = record.plan;
    if (!Array.isArray(faceScans) || faceScans.length !== plan.requestedFaceCount) return false;
    for (let index = 0; index < faceScans.length; index += 1) if (!Object.hasOwn(faceScans, index)) return false;
    const allowPartial = expected.partial === true;
    const scans = faceScans.map((value, index) => value === null && allowPartial ? null : normalizeFaceScan(value, index));
    if (!scans.some(Boolean) || scans.some((scan, index) => !scan && !(allowPartial && faceScans[index] === null))) return false;
    let historyBefore;
    let pityBefore;
    try {
        historyBefore = localStorage.getItem(STORAGE_KEY);
        pityBefore = localStorage.getItem(FORMAT_ELIGIBLE_MISS_STORAGE_KEY);
    } catch { return false; }
    const historyAfter = batchHistoryPayload(plan, scans, historyBefore);
    const pityAfter = batchPityCommittedPayload(plan, pityBefore, scans);
    if (historyAfter === null || pityAfter === null) return false;
    const registryAfter = registryWithoutRecord(registry, record);
    const changes = [];
    if (historyAfter !== historyBefore) changes.push({ key: STORAGE_KEY, before: historyBefore, after: historyAfter });
    if (pityAfter !== (pityBefore || '{}')) changes.push({ key: FORMAT_ELIGIBLE_MISS_STORAGE_KEY, before: pityBefore, after: pityAfter });
    changes.push({ key: record.storageKey, before: registry.rawByKey[record.storageKey], after: registryAfter });
    // Release the completed reservation before growing history, so a fitting
    // final state does not require room for both. Owned rollback restores it.
    const shrinks = change => typeof change.before === 'string' && change.after.length < change.before.length;
    return writeOwnedTransaction([...changes.filter(shrinks), ...changes.filter(change => !shrinks(change))]);
}

export function releasePendingComboBatch(expected = null) {
    if (!expected || typeof expected !== 'object') return false;
    const registry = readActiveBatchRegistry();
    if (!registry) return false;
    const index = registry.records.findIndex(record => planMatchesExpected(record.plan, expected));
    if (index < 0) return true;
    const record = registry.records[index];
    const after = registryWithoutRecord(registry, record);
    return writeOwnedTransaction([{ key: record.storageKey, before: registry.rawByKey[record.storageKey], after }]);
}

export function setPendingComboBatch(combos = [], identity = null) {
    let payload = '';
    let batchId = '';
    let previousBatchRaw = null;
    let previousSingleRaw = null;
    let singleRemovalAttempted = false;
    try {
        if (!Array.isArray(combos) || combos.length < 1 || combos.length > 5) return '';
        for (let index = 0; index < combos.length; index += 1) {
            if (!Object.prototype.hasOwnProperty.call(combos, index) || !validBatchCombo(combos[index])) return '';
        }
        const faces = combos.slice();
        const normalizedIdentity = identity == null ? null : normalizeBatchIdentity(identity);
        if (identity != null && !normalizedIdentity) return '';
        // Legacy standalone storage callers keep their single-face path, without
        // clearing an unrelated batch. This compatibility slot accepts 2..5.
        if (faces.length === 1) {
            if (!normalizedIdentity) setPendingCombo(faces[0]);
            return '';
        }
        previousBatchRaw = localStorage.getItem(PENDING_BATCH_KEY);
        previousSingleRaw = localStorage.getItem(PENDING_KEY);
        batchId = `${PENDING_SESSION_TOKEN}:${Date.now().toString(36)}:${(++pendingBatchSequence).toString(36)}`;
        payload = JSON.stringify({
            batchId,
            pendingTs: Date.now(),
            pendingSession: PENDING_SESSION_TOKEN,
            ...(normalizedIdentity ? { identity: normalizedIdentity } : {}),
            faces: faces.map((combo, index) => {
                const { committed, ...uncommittedCombo } = combo;
                return { ...uncommittedCombo, batchId, faceIndex: index, signature: signatureOf(combo) };
            }),
        });
        localStorage.setItem(PENDING_BATCH_KEY, payload);
        if (localStorage.getItem(PENDING_BATCH_KEY) !== payload) throw new Error('Batch read-back mismatch');
        // Storage, not the caller, owns this transition. Keep the original single
        // pending until the whole batch has survived read-back verification.
        if (localStorage.getItem(PENDING_KEY) !== previousSingleRaw) throw new Error('Single pending changed during batch write');
        if (previousSingleRaw !== null) {
            singleRemovalAttempted = true;
            localStorage.removeItem(PENDING_KEY);
            if (localStorage.getItem(PENDING_KEY) !== null) throw new Error('Single pending removal failed');
        }
        if (localStorage.getItem(PENDING_BATCH_KEY) !== payload) throw new Error('Batch replaced during single transition');
        return batchId;
    } catch (error) {
        const rolledBackOwnBatch = payload && restoreOwnedStorageWrite(PENDING_BATCH_KEY, payload, previousBatchRaw, batchId);
        if (rolledBackOwnBatch && singleRemovalAttempted && previousSingleRaw !== null) {
            try {
                if (localStorage.getItem(PENDING_KEY) === null) localStorage.setItem(PENDING_KEY, previousSingleRaw);
            } catch { /* Preserve the failure result if storage cannot recover. */ }
        }
        console.warn('[RabbitMirror] Failed to store pending combo batch:', error);
        return '';
    }
}

export function readPendingComboBatch(expected = null) {
    let raw = null;
    try {
        raw = localStorage.getItem(PENDING_BATCH_KEY);
        if (!raw) return null;
        const batch = JSON.parse(raw);
        if (!batch || typeof batch !== 'object' || Array.isArray(batch)) throw new Error('Invalid batch object');
        // A mismatched owner must not clean up another chat's pending, even if
        // that other record is old or malformed.
        if (!batchMatchesExpected(batch, expected)) return null;
        const validFaces = Array.isArray(batch.faces) && batch.faces.length >= 2 && batch.faces.length <= 5
            && batch.faces.every(face => validBatchCombo(face) && face.batchId === batch.batchId
                && face.signature === signatureOf(face)
                && Number.isSafeInteger(face.faceIndex) && face.faceIndex >= 0 && face.faceIndex < batch.faces.length
                && (face.committed === undefined || typeof face.committed === 'boolean'))
            && new Set(batch.faces.map(face => face.faceIndex)).size === batch.faces.length;
        const validIdentity = batch.identity == null || !!normalizeBatchIdentity(batch.identity);
        const at = batch.pendingTs;
        const now = Date.now();
        if (typeof batch.batchId !== 'string' || !batch.batchId || batch.batchId.length > 256
            || !validFaces || !validIdentity || batch.pendingSession !== PENDING_SESSION_TOKEN
            // At most one second of wall-clock jitter, never an indefinitely
            // future-dated record. No periodic expiration task is needed.
            || !Number.isFinite(at) || at <= 0 || at > now + 1000 || now - at > PENDING_MAX_AGE_MS) {
            if (expected == null) removeBatchRawIfUnchanged(raw);
            return null;
        }
        return { ...batch, faces: batch.faces.slice().sort((a, b) => a.faceIndex - b.faceIndex) };
    } catch {
        // Without a parseable expected owner, only the explicit diagnostic/legacy
        // read may discard a malformed slot; guarded callers leave it untouched.
        if (expected == null && raw !== null) removeBatchRawIfUnchanged(raw);
        return null;
    }
}

// 显式提交调用方确认成功的面；未提交的面不入史。C1 不自行证明 DOM 渲染成功。
export function commitPendingBatchFace(faceIndex = 0, visualSignature = '', visualSkeleton = '', riskFlags = [], paletteFingerprint = null, interactionFamily = null, expected = null) {
    if (!Number.isSafeInteger(faceIndex) || faceIndex < 0 || faceIndex > 4) return false;
    const batch = readPendingComboBatch(expected);
    if (!batch || !batchMatchesExpected(batch, expected, true)) return false;
    const face = batch.faces.find(item => item.faceIndex === faceIndex);
    if (!face || (face.committed === true && historyHasBatchFace(readHistory(), batch.batchId, faceIndex))) return false;
    // 直连共享底层：不经过 PENDING_KEY，因此绝不可能提交到别人的旧组合。
    const written = commitComboToHistory(
        face,
        { visualSignature, visualSkeleton, riskFlags, paletteFingerprint, interactionFamily },
        { batchId: batch.batchId, faceIndex },
    );
    if (!written) return false;   // 写入失败 → 不标记 committed，可重试
    let markerRaw = null;
    let markerPayload = '';
    try {
        markerRaw = localStorage.getItem(PENDING_BATCH_KEY);
        if (!markerRaw) return true;
        const current = JSON.parse(markerRaw);
        if (current?.batchId !== batch.batchId || !batchMatchesExpected(current, expected, true)) return true;
        const history = readHistory();
        const currentFace = current.faces?.find(item => item.faceIndex === faceIndex);
        if (!currentFace) return true;
        currentFace.committed = true;
        if (localStorage.getItem(PENDING_BATCH_KEY) !== markerRaw) return true;
        if (current.faces.every(item => item.committed === true && historyHasBatchFace(history, batch.batchId, item.faceIndex))) removeBatchRawIfUnchanged(markerRaw);
        else {
            markerPayload = JSON.stringify(current);
            localStorage.setItem(PENDING_BATCH_KEY, markerPayload);
            if (localStorage.getItem(PENDING_BATCH_KEY) !== markerPayload) throw new Error('Batch marker read-back mismatch');
        }
    } catch (error) {
        if (markerPayload) restoreOwnedStorageWrite(PENDING_BATCH_KEY, markerPayload, markerRaw, batch.batchId);
        console.warn('[RabbitMirror] Failed to persist batch face state:', error);
        // 落盘失败不回滚历史：历史已经是事实，批次状态下次读取时按 committed 重建。
    }
    return true;
}

// 只清单面 pending，不动历史与批次。供批次规划清理逐面 setLastCombo 残留。
export function clearPendingCombo() {
    try { localStorage.removeItem(PENDING_KEY); } catch {}
}

export function clearPendingComboBatch(expected = null) {
    try {
        const raw = localStorage.getItem(PENDING_BATCH_KEY);
        if (raw === null) return false;
        if (expected != null && !batchMatchesExpected(JSON.parse(raw), expected, true)) return false;
        return removeBatchRawIfUnchanged(raw);
    } catch { return false; }
}

export function setPendingCombo(combo) {
    try {
        if (!combo) return;
        const pending = {
            ...combo,
            signature: signatureOf(combo),
            pendingTs: Date.now(),
            pendingSession: PENDING_SESSION_TOKEN,
        };
        localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    } catch (error) {
        console.warn('[RabbitMirror] Failed to store pending combo:', error);
    }
}

// 共享底层：把一个已经确认属于本次生成的 combo 写进正式历史。
//
// 单面 pending 与批次 face 都直连这里，不再互相借道对方的存储槽。
// 返回 true 仅代表「确实写进了 STORAGE_KEY」；任何解析/写入失败都返回 false，
// 调用方据此决定是否标记 committed，绝不会把失败当成成功。
// 批次提交幂等：history 是唯一权威的「已提交」记录。
//
// pending_batch 的 committed 标记可能落盘失败（配额、隐私模式、宿主限制），
// 一旦丢失，重试同一 face 会二次写入 history。因此改为在 history 条目上带
// batchId + faceIndex，写入前先查重 —— 只要那一面真的进过 history，重试就是幂等的。
function historyHasBatchFace(history, batchId, faceIndex) {
    if (!batchId || !Number.isSafeInteger(faceIndex) || faceIndex < 0 || faceIndex > 4) return false;
    return (Array.isArray(history) ? history : []).some(item =>
        item && item.batchId === batchId && item.faceIndex === faceIndex);
}

function commitComboToHistory(combo, visual = {}, options = {}) {
    if (!combo || typeof combo !== 'object') return false;
    const { visualSignature = '', visualSkeleton = '', riskFlags = [], paletteFingerprint = null, interactionFamily = null } = visual || {};
    const batchId = String(options?.batchId || '');
    const faceIndex = options?.faceIndex;
    let previousHistoryRaw = null;
    let historyPayload = '';
    try {
        let history;
        if (batchId) {
            if (!Number.isSafeInteger(faceIndex) || faceIndex < 0 || faceIndex > 4) return false;
            previousHistoryRaw = localStorage.getItem(STORAGE_KEY);
            // Parse the verified snapshot itself. readHistory intentionally masks
            // legacy read errors, which must not turn a batch read failure into []
            // and erase earlier successes when this write later succeeds.
            const parsed = JSON.parse(previousHistoryRaw === null ? '[]' : previousHistoryRaw);
            if (Array.isArray(parsed)) history = parsed;
            else if (parsed && typeof parsed === 'object') history = [parsed];
            else throw new Error('Invalid batch history snapshot');
        } else {
            history = readHistory();
        }
        // 已经在 history 里 → 视为提交成功，但绝不重复写入。
        if (batchId && historyHasBatchFace(history, batchId, faceIndex)) return true;
        const now = Date.now();
        const sig = combo.signature || signatureOf(combo);
        const last = history[history.length - 1];
        // 批次面带幂等键，不走签名去重分支：三面本就应各占一条。
        if (!batchId && last?.signature === sig && now - Number(last?.ts || 0) < 120000) {
            if (visualSignature) last.visualSignature = String(visualSignature).slice(0, 280);
            if (visualSkeleton) last.visualSkeleton = String(visualSkeleton).slice(0, 420);
            if (Array.isArray(riskFlags) && riskFlags.length) last.riskFlags = [...new Set(riskFlags)].slice(0, 8);
            if (paletteFingerprint && typeof paletteFingerprint === 'object') last.paletteFingerprint = paletteFingerprint;
            const normalizedFamily = normalizeInteractionFamily(interactionFamily);
            if (normalizedFamily) last.interactionFamily = normalizedFamily;
            last.visualSignatureTs = now;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_STORED)));
            return true;
        }
        history.push({
            ...combo,
            signature: sig,
            ts: now,
            ...(batchId ? { batchId, faceIndex: Number(faceIndex) } : {}),
            visualSignature: visualSignature ? String(visualSignature).slice(0, 280) : combo.visualSignature,
            visualSkeleton: visualSkeleton ? String(visualSkeleton).slice(0, 420) : combo.visualSkeleton,
            riskFlags: Array.isArray(riskFlags) ? [...new Set(riskFlags)].slice(0, 8) : [],
            paletteFingerprint: paletteFingerprint && typeof paletteFingerprint === 'object' ? paletteFingerprint : undefined,
            interactionFamily: normalizeInteractionFamily(interactionFamily),
            visualSignatureTs: visualSignature || visualSkeleton || (Array.isArray(riskFlags) && riskFlags.length) || paletteFingerprint || normalizeInteractionFamily(interactionFamily) ? now : undefined,
        });
        if (batchId) {
            historyPayload = JSON.stringify(history.slice(-MAX_STORED));
            if (localStorage.getItem(STORAGE_KEY) !== previousHistoryRaw) return false;
            localStorage.setItem(STORAGE_KEY, historyPayload);
            const confirmedRaw = localStorage.getItem(STORAGE_KEY);
            if (confirmedRaw !== historyPayload || !historyHasBatchFace(JSON.parse(confirmedRaw), batchId, faceIndex)) {
                throw new Error('Batch history read-back mismatch');
            }
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_STORED)));
        }
        return true;
    } catch (error) {
        if (batchId && historyPayload) restoreOwnedStorageWrite(STORAGE_KEY, historyPayload, previousHistoryRaw);
        console.warn('[RabbitMirror] Failed to write combo history:', error);
        return false;
    }
}

export function commitPendingCombo(visualSignature = '', visualSkeleton = '', riskFlags = [], paletteFingerprint = null, interactionFamily = null) {
    try {
        const raw = localStorage.getItem(PENDING_KEY);
        if (!raw) return;
        const pending = JSON.parse(raw);
        if (!pending || typeof pending !== 'object') return;

        // pending 只对创建它的那一次生成有意义。这里判定它是否已经不可能属于当前这次提交：
        //  1. 会话标记不同 —— 写入它的页面会话已经结束，那次生成绝无可能仍在进行；
        //  2. 同会话内超过保守上限 —— 兜底，阈值远大于任何仍可能完成的生成；
        //  3. 缺少时间戳 —— 无从判断新旧，按不可信处理。
        // 命中任一条就丢弃，不写入历史：让一个从未生成过的组合进入冷却，比丢一条记录糟得多。
        // 提交只由「某面兔子镜已渲染完成」触发，真正在途的请求不会走到这里。
        const pendingSession = String(pending.pendingSession || '');
        const pendingAt = Number(pending.pendingTs);
        const staleSession = !!pendingSession && pendingSession !== PENDING_SESSION_TOKEN;
        const staleAge = !Number.isFinite(pendingAt) || Date.now() - pendingAt > PENDING_MAX_AGE_MS;
        if (staleSession || staleAge) {
            localStorage.removeItem(PENDING_KEY);
            return;
        }

        if (commitComboToHistory(pending, { visualSignature, visualSkeleton, riskFlags, paletteFingerprint, interactionFamily })) {
            localStorage.removeItem(PENDING_KEY);
        }
    } catch (error) {
        console.warn('[RabbitMirror] Failed to commit pending combo:', error);
    }
}

// 兼容旧调用：0.31.21 起不再在 prompt 构建时直接写入“最近历史”，只暂存为 pending。
export function setLastCombo(combo) {
    setPendingCombo(combo);
}

export function clearLastCombo() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PENDING_KEY);
        localStorage.removeItem(PENDING_BATCH_KEY);
        localStorage.removeItem(ATTEMPT_STORAGE_KEY);
        localStorage.removeItem(DIRECTIVE_PICK_STORAGE_KEY);
        localStorage.removeItem(FORMAT_ELIGIBLE_MISS_STORAGE_KEY);
        try {
            sessionStorage.removeItem('rabbit_mirror_theater:generation_snapshots:v1');
            sessionStorage.removeItem('rabbit_mirror_theater:active_generation_attempt:v1');
        } catch {
            // Session storage is optional in some host contexts.
        }
        // 清理旧版 key，防止旧记录混淆。
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v3');
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v4');
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v5');
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v6');
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v7');
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v8');
        localStorage.removeItem('rabbit_mirror_theater:pending_combo:v8');
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v9');
        localStorage.removeItem('rabbit_mirror_theater:pending_combo:v9');
        localStorage.removeItem('rabbit_mirror_theater:last_combo:v10');
        localStorage.removeItem('rabbit_mirror_theater:pending_combo:v10');
    } catch {}
}

export function updateLatestVisualSignature(visualSignature, visualSkeleton = '', riskFlags = [], paletteFingerprint = null, interactionFamily = null) {
    if (!visualSignature && !visualSkeleton && !(Array.isArray(riskFlags) && riskFlags.length) && !paletteFingerprint && !normalizeInteractionFamily(interactionFamily)) return;
    try {
        commitPendingCombo(visualSignature, visualSkeleton, riskFlags, paletteFingerprint, interactionFamily);
        const history = readHistory();
        if (!history.length) return;
        const last = history[history.length - 1];
        if (visualSignature) last.visualSignature = String(visualSignature).slice(0, 280);
        if (visualSkeleton) last.visualSkeleton = String(visualSkeleton).slice(0, 420);
        if (Array.isArray(riskFlags) && riskFlags.length) last.riskFlags = [...new Set(riskFlags)].slice(0, 8);
        if (paletteFingerprint && typeof paletteFingerprint === 'object') last.paletteFingerprint = paletteFingerprint;
        const normalizedFamily = normalizeInteractionFamily(interactionFamily);
        if (normalizedFamily) last.interactionFamily = normalizedFamily;
        last.visualSignatureTs = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_STORED)));
    } catch (error) {
        console.warn('[RabbitMirror] Failed to store visual signature:', error);
    }
}
