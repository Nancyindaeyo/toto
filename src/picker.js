import { THEMATIC_CATEGORIES } from '../data/structured/thematicIndex.js?rmv=1.5.53-cn-boundary1';
import { PRESENTATION_FORMATS } from '../data/structured/presentationIndex.js?rmv=1.5.53-cn-boundary1';
import {
    getCurrentChatKey,
    getDirectiveScopedPick,
    getFormatEligibleMisses,
    getLastCombo,
    getRecentGenerationAttemptIds,
    getRecentIds,
    getRecentInteractionFamilies,
    recordGenerationAttempt,
    recordFormatEligibleMissRound,
    setDirectiveScopedPick,
    setLastCombo,
    setPendingComboBatch,
    readPendingComboBatch,
    clearPendingComboBatch,
    createPendingComboBatchPlan,
    findPendingComboBatchPlan,
} from './storage.js?rmv=1.5.53-visualquick1';
import { filterRandomFormatPool, filterRandomThemePool, getFavoritesState } from './blacklist.js?rmv=1.5.53-image1';
import { describeBatchPlanFailure } from './externalWorldBook/errors.js?rmv=1.5.53-cn-boundary1';
import { requestedPresentationMode, presentationModeFields, visualSceneryCombinationEnabled } from './presentationMode.js?rmv=1.5.53-visualquick1';
import { planBatchInteractionDiversity } from './batchInteractionDiversity.js?rmv=1.5.53-text1';
import {
    chooseExternalSource,
    externalPoolActive,
    externalPoolHasAvailable,
    externalPoolItem,
    getExternalPoolSelectionKey,
    getExternalPoolSnapshot,
    pickExternalItems,
    sourceMixModeIsExternalOnly,
} from './externalWorldBook/externalPool.js?rmv=1.5.53-text1';

function randomUnit() {
    try {
        const cryptoApi = globalThis.crypto;
        if (cryptoApi?.getRandomValues) {
            const value = new Uint32Array(1);
            cryptoApi.getRandomValues(value);
            return value[0] / 0x100000000;
        }
    } catch {
        // Older or restricted WebViews may not expose crypto; Math.random remains a safe compatibility fallback.
    }
    return Math.random();
}

function randomInt(min, max) {
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    return Math.floor(randomUnit() * (high - low + 1)) + low;
}

function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(randomUnit() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function weightedThemeCount(settings) {
    const min = Number(settings.themesMin) || 1;
    const max = Number(settings.themesMax) || 3;
    const r = randomUnit();
    const count = r < 0.75 ? 1 : r < 0.97 ? 2 : 3;
    return clamp(count, min, max);
}

function weightedFormatCount(settings) {
    const min = Number(settings.formatsMin) || 1;
    const max = Number(settings.formatsMax) || 2;
    const count = randomUnit() < 0.85 ? 1 : 2;
    return clamp(count, min, max);
}


const UI_REVIEW_FOCUS = [
    '展现形式载体感',
    '媒介语法准确度',
    '非通用卡片化',
    '高级质感',
    '空间层级与视觉深度',
    '主视觉锚点明确',
    '文字密度服从载体',
    '文本长短错落',
    '阅读路径有节奏',
    '装饰方式与氛围契合',
    '配色服务本轮氛围',
    '避免状态栏化',
    '避免报告卡化',
    '避免普通信息面板化',
    '近期10轮观感去重'
];

function pickUiReviewFocus(count = 4) {
    const n = Math.max(3, Math.min(Number(count) || 4, UI_REVIEW_FOCUS.length));
    const mustHave = ['展现形式载体感', '媒介语法准确度', '近期10轮观感去重'];
    const rest = UI_REVIEW_FOCUS.filter(x => !mustHave.includes(x));
    return [...mustHave, ...shuffle(rest).slice(0, Math.max(0, n - mustHave.length))];
}

let cachedPick = null;

function normalizeGenerationScopeKey(value) {
    return String(value || '').trim();
}

function hashText(text) {
    let hash = 2166136261;
    for (const char of String(text || '')) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}

function compactUnique(values) {
    return [...new Set((values || []).map(value => String(value || '').trim()).filter(Boolean))];
}

function mergeRecentHitMaps(base = {}, attempts = {}) {
    const result = {};
    for (const source of [base, attempts]) {
        for (const [key, raw] of Object.entries(source || {})) {
            const count = Math.max(0, Math.floor(Number(raw) || 0));
            if (key && count) result[key] = Math.max(Number(result[key] || 0), count);
        }
    }
    return result;
}

function mergeRecent(base, attempts) {
    return {
        themeIds: compactUnique([...(base?.themeIds || []), ...(attempts?.themeIds || [])]),
        formatIds: compactUnique([...(base?.formatIds || []), ...(attempts?.formatIds || [])]),
        themeGroups: compactUnique([...(base?.themeGroups || []), ...(attempts?.themeGroups || [])]),
        formatGroups: compactUnique([...(base?.formatGroups || []), ...(attempts?.formatGroups || [])]),
        themeIdHits: mergeRecentHitMaps(base?.themeIdHits, attempts?.themeIdHits),
        formatIdHits: mergeRecentHitMaps(base?.formatIdHits, attempts?.formatIdHits),
        ...((base?.textIds?.length || attempts?.textIds?.length) ? {
            textIds: compactUnique([...(base?.textIds || []), ...(attempts?.textIds || [])]),
            textIdHits: mergeRecentHitMaps(base?.textIdHits, attempts?.textIdHits),
        } : {}),
        themeGroupHits: mergeRecentHitMaps(base?.themeGroupHits, attempts?.themeGroupHits),
        formatGroupHits: mergeRecentHitMaps(base?.formatGroupHits, attempts?.formatGroupHits),
        uiReviewFocus: Array.isArray(base?.uiReviewFocus) ? [...base.uiReviewFocus] : [],
    };
}

function allowByMode(_item, mode) {
    if (mode === 'off') return false;
    return true;
}

function fairnessFactor(eligibleMisses) {
    const misses = Math.max(0, Math.floor(Number(eligibleMisses) || 0));
    if (misses >= 320) return 2.00;
    if (misses >= 220) return 1.70;
    if (misses >= 140) return 1.45;
    if (misses >= 80) return 1.25;
    if (misses >= 40) return 1.10;
    return 1.00;
}

function favoriteMultiplierFor(id, favoriteIds, multiplierMap = {}) {
    if (!(favoriteIds instanceof Set ? favoriteIds : new Set(favoriteIds || [])).has(id)) return 1;
    const raw = multiplierMap?.[id];
    const empty = raw == null || (typeof raw === 'string' && !raw.trim());
    const parsed = empty ? NaN : Number(raw);
    if (!Number.isFinite(parsed)) return 3;
    return Math.max(1, Math.min(50, parsed));
}

function favoriteThemeFamilyFactor(items, favorites, multiplierMap = {}) {
    let maxMultiplier = 1;
    for (const item of items || []) {
        if (!favorites.has(item.id)) continue;
        maxMultiplier = Math.max(maxMultiplier, favoriteMultiplierFor(item.id, favorites, multiplierMap));
    }
    if (maxMultiplier <= 1) return 1;
    // 兼容旧默认：单项 ×3 时家族仍是既有 ×2.5。高倍率只温和抬升家族层，
    // 并在 ×6 封顶，避免一个高倍率收藏把整个大家族一起成倍放大。
    return Math.min(6, 1 + (maxMultiplier - 1) * 0.75);
}

function recentDiversityFactor(hitCount, firstPenalty = 0.35, floor = 0.12) {
    const hits = Math.max(0, Math.floor(Number(hitCount) || 0));
    if (!hits) return 1;
    const first = Math.max(0.01, Math.min(1, Number(firstPenalty) || 0.35));
    const minimum = Math.max(0.01, Math.min(first, Number(floor) || 0.12));
    return Math.max(minimum, first * Math.pow(0.72, hits - 1));
}

function formatFamilyKey(itemOrId) {
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id;
    const parts = String(id || '').split('.').filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
    return String(id || 'unknown');
}

function recentFamilyHits(idHits = {}, familyKey = value => String(value || '')) {
    const result = {};
    for (const [id, raw] of Object.entries(idHits || {})) {
        const family = familyKey(id);
        const count = Math.max(0, Math.floor(Number(raw) || 0));
        if (family && count) result[family] = Number(result[family] || 0) + count;
    }
    return result;
}

function familySizeMap(items, familyKey) {
    const counts = new Map();
    for (const item of items || []) {
        const key = familyKey(item);
        counts.set(key, Number(counts.get(key) || 0) + 1);
    }
    return counts;
}

function balancedFamilyItemFactor(itemCount) {
    // Item-level sampling otherwise gives a family one full ticket per child.
    // Keep larger families richer, but reduce their total mass from n to n^0.45.
    return 1 / Math.pow(Math.max(1, Number(itemCount) || 1), 0.55);
}

function immediateFamilySet(values) {
    return new Set((Array.isArray(values) ? values : []).map(value => String(value || '')).filter(Boolean));
}

function weightedSample(pool, count, recentIds = [], recentGroups = [], avoidRepeat = true, hardExcludedIds = [], favoriteIds = [], eligibleMisses = {}, favoriteMultipliers = {}, recentGroupHitMap = {}, recentFamilyHitMap = {}, immediateFamilyKeys = [], groupCooldownEnabled = true) {
    const recent = new Set(recentIds || []);
    const groups = new Set(recentGroups || []);
    const hardExcluded = new Set(hardExcludedIds || []);
    const favorites = new Set(favoriteIds || []);
    let candidates = [...pool];

    // 每次新的非点菜生成都先硬排除刚刚抽过的子项；候选不足时才安全回退。
    if (hardExcluded.size) {
        const filtered = candidates.filter(x => !hardExcluded.has(x.id));
        if (filtered.length >= count) candidates = filtered;
    }

    // 正式冷却历史仍按原设置执行。
    if (avoidRepeat) {
        const filtered = candidates.filter(x => !recent.has(x.id));
        if (filtered.length >= count) candidates = filtered;
    }
    const immediateFamilies = avoidRepeat ? immediateFamilySet(immediateFamilyKeys) : new Set();

    const selected = [];
    const used = new Set();
    const usedFamilies = new Set();
    const familySizes = familySizeMap(candidates, formatFamilyKey);
    while (selected.length < count && used.size < candidates.length) {
        let available = candidates.filter(item => !used.has(item.id));
        // Maximise immediate-family avoidance instead of falling back all-or-nothing:
        // consume every still-unseen fresh family first, then reopen an older family
        // only when it is needed to fill the remaining slots.
        const freshDifferentFamilies = available.filter(item => {
            const family = formatFamilyKey(item);
            return !immediateFamilies.has(family) && !usedFamilies.has(family);
        });
        if (freshDifferentFamilies.length) {
            available = freshDifferentFamilies;
        } else {
            const differentFamilies = available.filter(item => !usedFamilies.has(formatFamilyKey(item)));
            if (differentFamilies.length) available = differentFamilies;
        }
        const weighted = available
            .map(item => {
                let weight = balancedFamilyItemFactor(familySizes.get(formatFamilyKey(item)));
                // 仅显式 IF 主题保留大家族软冷却；普通路线允许同组的不同玩法
                // 自然相邻。IF 的原系数、下界及所有候选的基础权重保持不变。
                const groupHits = Number(recentGroupHitMap?.[item.group] || (groups.has(item.group) ? 1 : 0));
                if (avoidRepeat && groupCooldownEnabled && groupHits) weight *= recentDiversityFactor(groupHits, 0.35);
                // 格式索引同时含父项与子项。精确 ID 虽不同，前两段家族相同
                // 时观感仍高度近似，因此增加软家族避让而不做硬排除。
                const familyHits = Number(recentFamilyHitMap?.[formatFamilyKey(item)] || 0);
                if (avoidRepeat && familyHits) weight *= recentDiversityFactor(familyHits, 0.28);
                // 收藏室只提高本地随机权重，不越过黑名单、硬排除或近期冷却。
                if (favorites.has(item.id)) weight *= favoriteMultiplierFor(item.id, favorites, favoriteMultipliers);
                // 公平性只作用于已经通过本轮资格过滤的候选；有上限，不形成固定轮播或硬保底。
                weight *= fairnessFactor(eligibleMisses?.[item.id]);
                return { item, weight };
            });
        const total = weighted.reduce((sum, x) => sum + x.weight, 0);
        let roll = randomUnit() * total;
        let chosen = weighted[weighted.length - 1]?.item;
        for (const entry of weighted) {
            roll -= entry.weight;
            if (roll <= 0) {
                chosen = entry.item;
                break;
            }
        }
        if (!chosen) break;
        selected.push(chosen);
        used.add(chosen.id);
        usedFamilies.add(formatFamilyKey(chosen));
    }
    const finalSelected = selected.length
        ? selected
        : shuffle(candidates).slice(0, Math.max(1, Math.min(count, candidates.length)));
    return {
        selected: finalSelected,
        eligibleIds: candidates.map(item => String(item?.id || '')).filter(Boolean),
    };
}

function themeFamilyKey(itemOrId) {
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id;
    const parts = String(id || '').split('.').filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
    return String(id || 'unknown');
}

function pickWeightedEntry(entries, getWeight) {
    if (!entries.length) return null;
    const weighted = entries.map(entry => ({
        entry,
        weight: Math.max(0.0001, Number(getWeight(entry)) || 0.0001),
    }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = randomUnit() * total;
    for (const item of weighted) {
        roll -= item.weight;
        if (roll <= 0) return item.entry;
    }
    return weighted[weighted.length - 1]?.entry || null;
}

function themeFamilyBaseWeight(itemCount) {
    // Families retain a modest benefit for genuine breadth, while very large
    // trees no longer dominate almost linearly merely because they have children.
    return Math.pow(Math.max(1, Number(itemCount) || 1), 0.6);
}

/**
 * 主题采用“父主题家族优先 + 温和规模校正”抽取：
 * 家族仍是去重/冷却单位，但基础权重随家族有效条目数按 0.6 次方增长。
 * 这样单条家族不会天然拿到完整家族票，同时也不会让大树家族完全按子项数量线性霸榜。
 */
function weightedThemeSample(pool, count, recentIds = [], recentGroups = [], avoidRepeat = true, hardExcludedIds = [], favoriteIds = [], favoriteMultipliers = {}, recentGroupHitMap = {}, recentFamilyHitMap = {}, immediateFamilyKeys = []) {
    const recent = new Set(recentIds || []);
    const recentGroupSet = new Set(recentGroups || []);
    const recentFamilySet = new Set((recentIds || []).map(themeFamilyKey));
    const hardExcluded = new Set(hardExcludedIds || []);
    const favorites = new Set(favoriteIds || []);
    let workingPool = [...pool];
    if (hardExcluded.size) {
        const filtered = workingPool.filter(item => !hardExcluded.has(item.id));
        if (filtered.length >= Math.max(1, Number(count) || 1)) workingPool = filtered;
    }
    if (avoidRepeat && recent.size) {
        const filtered = workingPool.filter(item => !recent.has(item.id));
        if (filtered.length >= Math.max(1, Number(count) || 1)) workingPool = filtered;
    }
    const immediateFamilies = avoidRepeat ? immediateFamilySet(immediateFamilyKeys) : new Set();
    const families = new Map();

    for (const item of workingPool) {
        const key = themeFamilyKey(item);
        if (!families.has(key)) families.set(key, { key, group: item.group, items: [] });
        families.get(key).items.push(item);
    }

    const familyList = [...families.values()];
    const selected = [];
    const usedFamilies = new Set();
    const targetCount = Math.max(0, Math.min(Number(count) || 0, familyList.length));

    while (selected.length < targetCount) {
        let availableFamilies = familyList.filter(family => !usedFamilies.has(family.key));
        if (!availableFamilies.length) break;
        const freshFamilies = availableFamilies.filter(family => !immediateFamilies.has(family.key));
        if (freshFamilies.length) availableFamilies = freshFamilies;

        const family = pickWeightedEntry(availableFamilies, entry => {
            let weight = themeFamilyBaseWeight(entry.items.length);
            const groupHits = Number(recentGroupHitMap?.[entry.group] || (recentGroupSet.has(entry.group) ? 1 : 0));
            const familyHits = Number(recentFamilyHitMap?.[entry.key] || (recentFamilySet.has(entry.key) ? 1 : 0));
            if (avoidRepeat && groupHits) weight *= recentDiversityFactor(groupHits, 0.35);
            if (avoidRepeat && familyHits) weight *= recentDiversityFactor(familyHits, 0.25);
            weight *= favoriteThemeFamilyFactor(entry.items, favorites, favoriteMultipliers);
            return weight;
        });
        if (!family) break;
        usedFamilies.add(family.key);

        let itemCandidates = [...family.items];
        if (avoidRepeat) {
            const freshItems = itemCandidates.filter(item => !recent.has(item.id));
            if (freshItems.length) itemCandidates = freshItems;
        }

        const chosen = pickWeightedEntry(itemCandidates, item => {
            let weight = !avoidRepeat || !recent.has(item.id) ? 1 : 0.12;
            if (favorites.has(item.id)) weight *= favoriteMultiplierFor(item.id, favorites, favoriteMultipliers);
            return weight;
        });
        if (chosen) selected.push(chosen);
    }

    if (selected.length) return selected;
    return shuffle(workingPool).slice(0, Math.max(1, Math.min(count, workingPool.length)));
}

function sourceAwareThemeSample({ settings, pool, count, recentIds, recentIdHits, recentGroups, avoidRepeat, hardExcludedIds, favoriteIds, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys, externalHardExcludedIds = [] }) {
    if (!externalPoolActive(settings, 'theme')) {
        return weightedThemeSample(pool, count, recentIds, recentGroups, avoidRepeat, hardExcludedIds, favoriteIds, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys);
    }
    const target = Math.max(0, Number(count) || 0);
    const sourceKinds = [];
    const builtinAvailable = pool.length > 0;
    for (let index = 0; index < target; index += 1) {
        sourceKinds.push(chooseExternalSource(settings, 'theme', randomUnit, builtinAvailable) ? 'external' : 'builtin');
    }
    const builtinCount = sourceKinds.filter(kind => kind === 'builtin').length;
    const externalCount = sourceKinds.length - builtinCount;
    let builtins = builtinCount
        ? weightedThemeSample(pool, builtinCount, recentIds, recentGroups, avoidRepeat, hardExcludedIds, favoriteIds, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys)
        : [];
    let externals = externalCount
        ? pickExternalItems(settings, 'theme', externalCount, {
            randomUnit,
            recentIds,
            recentIdHits,
            hardExcludedIds: externalHardExcludedIds,
            preferredExcludedIds: hardExcludedIds,
            avoidRepeat,
        })
        : [];

    if (externals.length < externalCount && !sourceMixModeIsExternalOnly(settings)) {
        const deficit = externalCount - externals.length;
        const extraHard = [...hardExcludedIds, ...builtins.map(item => item.id)];
        builtins = [...builtins, ...weightedThemeSample(pool, deficit, recentIds, recentGroups, avoidRepeat, extraHard, favoriteIds, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys)];
    }
    if (builtins.length < builtinCount) {
        const deficit = builtinCount - builtins.length;
        externals = [...externals, ...pickExternalItems(settings, 'theme', deficit, {
            randomUnit,
            recentIds,
            recentIdHits,
            hardExcludedIds: [...externalHardExcludedIds, ...externals.map(item => item.id)],
            preferredExcludedIds: hardExcludedIds,
            avoidRepeat,
        })];
    }

    const builtinQueue = [...builtins];
    const externalQueue = [...externals];
    const selected = [];
    for (const kind of sourceKinds) {
        const next = kind === 'external' ? externalQueue.shift() : builtinQueue.shift();
        if (next) selected.push(next);
    }
    selected.push(...builtinQueue, ...externalQueue);
    return uniqueById(selected).slice(0, target);
}

function sourceAwareFormatSample({ settings, pool, count, recentIds, recentIdHits, recentGroups, avoidRepeat, hardExcludedIds, favoriteIds, eligibleMisses, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys, groupCooldownEnabled, externalHardExcludedIds = [], presentationKind = 'format' }) {
    if (!externalPoolActive(settings, presentationKind)) {
        return weightedSample(pool, count, recentIds, recentGroups, avoidRepeat, hardExcludedIds, favoriteIds, eligibleMisses, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys, groupCooldownEnabled);
    }
    const target = Math.max(0, Number(count) || 0);
    const sourceKinds = [];
    const builtinAvailable = pool.length > 0;
    for (let index = 0; index < target; index += 1) {
        sourceKinds.push(chooseExternalSource(settings, presentationKind, randomUnit, builtinAvailable) ? 'external' : 'builtin');
    }
    const builtinCount = sourceKinds.filter(kind => kind === 'builtin').length;
    const externalCount = sourceKinds.length - builtinCount;
    let builtinSample = builtinCount
        ? weightedSample(pool, builtinCount, recentIds, recentGroups, avoidRepeat, hardExcludedIds, favoriteIds, eligibleMisses, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys, groupCooldownEnabled)
        : { selected: [], eligibleIds: [] };
    let externals = externalCount
        ? pickExternalItems(settings, presentationKind, externalCount, {
            randomUnit,
            recentIds,
            recentIdHits,
            hardExcludedIds: externalHardExcludedIds,
            preferredExcludedIds: hardExcludedIds,
            avoidRepeat,
        })
        : [];

    if (externals.length < externalCount && !sourceMixModeIsExternalOnly(settings)) {
        const deficit = externalCount - externals.length;
        const extraHard = [...hardExcludedIds, ...builtinSample.selected.map(item => item.id)];
        const extra = weightedSample(pool, deficit, recentIds, recentGroups, avoidRepeat, extraHard, favoriteIds, eligibleMisses, favoriteMultipliers, recentGroupHitMap, recentFamilyHitMap, immediateFamilyKeys, groupCooldownEnabled);
        builtinSample = { selected: [...builtinSample.selected, ...extra.selected], eligibleIds: [...new Set([...builtinSample.eligibleIds, ...extra.eligibleIds])] };
    }
    if (builtinSample.selected.length < builtinCount) {
        const deficit = builtinCount - builtinSample.selected.length;
        externals = [...externals, ...pickExternalItems(settings, presentationKind, deficit, {
            randomUnit,
            recentIds,
            recentIdHits,
            hardExcludedIds: [...externalHardExcludedIds, ...externals.map(item => item.id)],
            preferredExcludedIds: hardExcludedIds,
            avoidRepeat,
        })];
    }

    const builtinQueue = [...builtinSample.selected];
    const externalQueue = [...externals];
    const selected = [];
    for (const kind of sourceKinds) {
        const next = kind === 'external' ? externalQueue.shift() : builtinQueue.shift();
        if (next) selected.push(next);
    }
    selected.push(...builtinQueue, ...externalQueue);
    return {
        selected: uniqueById(selected).slice(0, target),
        // Fairness bookkeeping remains strictly builtin; external entries do not participate
        // in the builtin eligible-miss state.
        eligibleIds: builtinSample.eligibleIds,
    };
}

function randomCandidateAvailable(settings, kind, builtinPool, usedIds = new Set()) {
    const builtinAvailable = builtinPool.some(item => !usedIds.has(item.id));
    if (!externalPoolActive(settings, kind)) return builtinAvailable;
    const externalAvailable = externalPoolHasAvailable(kind, [...usedIds]);
    if (sourceMixModeIsExternalOnly(settings)) return externalAvailable;
    return builtinAvailable || externalAvailable;
}

function getCurrentTurnUserMessage(chatOverride = null) {
    try {
        const context = globalThis.SillyTavern?.getContext?.() || {};
        const overrideUsable = Array.isArray(chatOverride) && chatOverride.some(item => typeof item?.is_user === 'boolean');
        const chat = Array.isArray(context?.chat) && context.chat.length
            ? context.chat
            : overrideUsable
                ? chatOverride
                : Array.isArray(globalThis.chat)
                    ? globalThis.chat
                    : [];

        // 取本次助手回复所对应的最近一条用户消息。
        // 因此同一条回复反复重说/Swipe 时仍能识别同一份点菜；用户发送新消息后自然切换到新消息。
        for (let index = chat.length - 1; index >= 0; index -= 1) {
            const message = chat[index];
            if (!message || typeof message.mes !== 'string' || message.is_system || !message.is_user) continue;
            const text = message.mes.trim();
            if (!text) return null;
            const stablePart = String(message.mesid ?? message.send_date ?? index);
            return {
                text: message.mes,
                index,
                key: `${stablePart}:${hashText(message.mes)}`,
            };
        }
        return null;
    } catch (_error) {
        return null;
    }
}

function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[\s`*_【】\[\]（）()「」『』:：,，.。;；/\\|+\-—_]/g, '');
}

function splitDirectiveText(text) {
    return String(text || '')
        .replace(/\s+/g, ' ')
        .split(/[+＋、,，;；\n]/)
        .map(x => x.trim())
        .filter(Boolean);
}

function uniqueDirectiveTexts(items, limit = 8, maxChars = 700) {
    const seen = new Set();
    const result = [];
    for (const value of items || []) {
        const text = String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxChars);
        if (!text) continue;
        const key = normalizeText(text);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        result.push(text);
        if (result.length >= limit) break;
    }
    return result;
}

function itemHaystack(item) {
    return normalizeText([
        item.id,
        item.title,
        ...(Array.isArray(item.aliases) ? item.aliases : []),
        item.summary,
        item.raw,
        ...(item.tags || []),
    ].join(' '));
}

function matchOne(pool, query) {
    const q = normalizeText(query);
    if (!q) return null;

    let best = null;
    let bestScore = 0;
    for (const item of pool) {
        const id = normalizeText(item.id);
        const title = normalizeText(item.title);
        const aliases = Array.isArray(item.aliases) ? item.aliases.map(normalizeText).filter(Boolean) : [];
        const summary = normalizeText(item.summary);
        const raw = normalizeText(item.raw);
        const haystack = itemHaystack(item);

        let score = 0;
        if (id === q) score = 100;
        else if (title === q) score = 95;
        else if (aliases.includes(q)) score = 94;
        else if (id.includes(q) || q.includes(id)) score = Math.max(score, 80);
        else if (title.includes(q) || q.includes(title)) score = Math.max(score, 75);
        else if (summary.includes(q)) score = Math.max(score, 55);
        else if (raw.includes(q)) score = Math.max(score, 50);
        else if (haystack.includes(q)) score = Math.max(score, 40);

        if (score > bestScore) {
            best = item;
            bestScore = score;
        }
    }
    return bestScore >= 40 ? best : null;
}

function uniqueById(items) {
    const seen = new Set();
    const result = [];
    for (const item of items) {
        if (!item || seen.has(item.id)) continue;
        seen.add(item.id);
        result.push(item);
    }
    return result;
}

function extractAfterPatterns(message, patterns) {
    const results = [];
    for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'ig');
        let match;
        while ((match = regex.exec(message)) !== null) {
            const value = (match[1] || '').trim();
            if (value) results.push(value);
        }
    }
    return results;
}

function cleanDirectiveBlock(value, maxChars = 3000) {
    return String(value || '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .trim()
        .slice(0, maxChars);
}

function findExplicitDirectiveStart(message) {
    const patterns = [
        // 兔子镜：…… / 本轮兔子镜主题：…… / 小剧场要求：……
        /(^|[\n。！？!?；;])([ \t]*(?:[-*•]\s*)?(?:(?:本轮|这次|下次|下一个)\s*)?(?:兔子镜|小剧场)\s*(?:(?:主题|元素|题材|展现形式|展示形式|表现形式|格式|形式|要求|指令)\s*)?[:：])/igm,
        // 这次兔子镜做成…… / 把小剧场改成……
        /(^|[\n。！？!?；;])([ \t]*(?:[-*•]\s*)?(?:请\s*)?(?:把|将)?\s*(?:(?:本轮|这次|下次|下一个)\s*)?(?:兔子镜|小剧场)\s*(?:做成|改成|换成|用|生成|来|要|想看|想要|指定))/igm,
        // 做一个……的兔子镜 / 生成一个……小剧场
        /(^|[\n。！？!?；;])([ \t]*(?:[-*•]\s*)?(?:请\s*)?(?:做|生成|来|给我来|想看|想要|换成|改成|做成)(?:一个|个)?\s*[^。\n！？!?；;]{1,700}?(?:的)?(?:兔子镜|小剧场)(?=$|[。！？!?；;\n]))/igm,
    ];

    let earliest = null;
    for (const pattern of patterns) {
        pattern.lastIndex = 0;
        const match = pattern.exec(message);
        if (!match) continue;
        const index = match.index + String(match[1] || '').length;
        if (earliest === null || index < earliest) earliest = index;
    }
    return earliest;
}

function extractRabbitMirrorDirective(message) {
    const source = String(message || '');
    if (!source || !/(兔子镜|小剧场)/.test(source)) return '';

    const start = findExplicitDirectiveStart(source);
    if (start === null) return '';

    let block = source.slice(start);
    // 用户可在同一条消息中用“正文：/继续剧情：”明确结束点菜区块。
    const stopMatch = /\n\s*(?:正文|剧情|继续剧情|继续角色扮演|角色扮演|RP)\s*[:：]/i.exec(block);
    if (stopMatch) block = block.slice(0, stopMatch.index);
    return cleanDirectiveBlock(block);
}

function extractDisableDirective(message) {
    const source = String(message || '');
    const patterns = [
        /(^|[\n。！？!?；;])\s*(?:(?:本轮|这次)\s*)?(?:不要|不用|关闭|关掉|禁用|停止)\s*(?:兔子镜|小剧场)/im,
        /(^|[\n。！？!?；;])\s*(?:(?:本轮|这次)\s*)?(?:兔子镜|小剧场)\s*(?:关闭|关掉|不要|不用|禁用|停止|off)/im,
    ];
    for (const pattern of patterns) {
        const match = pattern.exec(source);
        if (!match) continue;
        const start = match.index + String(match[1] || '').length;
        return cleanDirectiveBlock(source.slice(start), 700);
    }
    return '';
}

function parseUserDirective(currentTurn) {
    const message = String(currentTurn?.text || '');
    if (!message) return null;

    const disableDirective = extractDisableDirective(message);
    if (disableDirective) {
        return {
            disabled: true,
            reason: '用户本轮明确要求关闭兔子镜',
            rawDirective: disableDirective,
            messageKey: currentTurn?.key || '',
        };
    }

    const rawDirective = extractRabbitMirrorDirective(message);
    if (!rawDirective) return null;

    const themeTexts = extractAfterPatterns(rawDirective, [
        '(?:兔子镜|小剧场)(?:主题|元素|题材|theme)\\s*[:：]\\s*([^\\n。；;]+)',
        '(?:兔子镜|小剧场)(?:主题|元素|题材|theme)\\s+(?:用|要|换成|改成|做成)?\\s*([^\\n。；;]+)',
    ]);
    const formatTexts = extractAfterPatterns(rawDirective, [
        '(?:兔子镜|小剧场)(?:展现形式|展示形式|表现形式|格式|形式|format|ui|UI)\\s*[:：]\\s*([^\\n。；;]+)',
        '(?:兔子镜|小剧场)(?:展现形式|展示形式|表现形式|格式|形式|format|ui|UI)\\s+(?:用|要|换成|改成|做成)?\\s*([^\\n。；;]+)',
    ]);
    const generalTexts = extractAfterPatterns(rawDirective, [
        '(?:兔子镜|小剧场)\\s*[:：]\\s*([^\\n。；;]+)',
        '(?:兔子镜|小剧场)\\s*(?:想看|想要|来|要|指定|换成|改成|做成|用|生成)\\s*([^\\n。；;]+)',
        '(?:下一个|下次|这次|本轮)?\\s*(?:兔子镜|小剧场)\\s*(?:想看|想要|来|要|指定|换成|改成|做成|用|生成)\\s*([^\\n。；;]+)',
        '(?:想看|想要|来(?:一个|个)?|做(?:一个|个)?|生成(?:一个|个)?|换成|改成|做成)\\s*([^\\n。；;]{1,700}?)(?:的)?(?:兔子镜|小剧场)(?=$|[。；;！!？?\\n])',
    ]).filter(x => !/^(主题|元素|题材|展现形式|展示形式|表现形式|格式|形式)\s*[:：]/.test(x));

    const themeQueries = uniqueDirectiveTexts(splitDirectiveText(themeTexts.join('、')));
    const formatQueries = uniqueDirectiveTexts(splitDirectiveText(formatTexts.join('、')));
    const generalQueries = uniqueDirectiveTexts(splitDirectiveText(generalTexts.join('、')));

    const themes = [];
    const formats = [];
    const customThemes = [];
    const customFormats = [];
    const customRequests = [];
    let hasThemeRequest = themeQueries.length > 0;
    let hasFormatRequest = formatQueries.length > 0;

    for (const query of themeQueries) {
        const matched = matchOne(THEMATIC_CATEGORIES, query);
        if (matched) themes.push(matched);
        else customThemes.push(query);
    }
    for (const query of formatQueries) {
        const matched = matchOne(PRESENTATION_FORMATS, query);
        if (matched) formats.push(matched);
        else customFormats.push(query);
    }
    for (const query of generalQueries) {
        const format = matchOne(PRESENTATION_FORMATS, query);
        const theme = matchOne(THEMATIC_CATEGORIES, query);
        if (format) {
            formats.push(format);
            hasFormatRequest = true;
        }
        if (theme) {
            themes.push(theme);
            hasThemeRequest = true;
        }
        if (!format && !theme) {
            customRequests.push(query);
            // 未分类自由点菜可能同时规定“演什么”和“怎么演”；为避免随机项冲掉原意，两侧均视为已指定。
            hasThemeRequest = true;
            hasFormatRequest = true;
        }
    }

    const uniqueThemes = uniqueById(themes);
    const uniqueFormats = uniqueById(formats);
    const uniqueCustomThemes = uniqueDirectiveTexts(customThemes);
    const uniqueCustomFormats = uniqueDirectiveTexts(customFormats);
    const uniqueCustomRequests = uniqueDirectiveTexts(customRequests);

    return {
        disabled: false,
        themes: uniqueThemes,
        formats: uniqueFormats,
        customThemes: uniqueCustomThemes,
        customFormats: uniqueCustomFormats,
        customRequests: uniqueCustomRequests,
        hasThemeRequest,
        hasFormatRequest,
        source: '当前待回复用户消息中的明确兔子镜点菜',
        rawDirective,
        messageKey: currentTurn?.key || '',
    };
}

function getVisualSceneryFormat() {
    return PRESENTATION_FORMATS.find(item => item.id === '10.2.2' || normalizeText(item.title) === normalizeText('Visual Scenery')) || null;
}

function applyDirectiveOrRandom({ settings, directive, themePool, formatPool, themeCount, formatCount, recent, formalRecent, hardRecent, previousThemeFamilyKeys = [], previousFormatFamilyKeys = [], favoriteThemeIds, favoriteFormatIds, favoriteThemeMultipliers, favoriteFormatMultipliers, formatEligibleMisses, externalExcludedThemeIds = [], externalExcludedFormatIds = [], externalExcludedTextIds = [], faceIndex = 0 }) {
    if (directive?.disabled) return { disabled: true, directive };
    const requestedMode = requestedPresentationMode(settings, faceIndex);
    const textSettings = { ...settings, externalWorldBookRandomEnabled: true, externalWorldBookMixMode: 'external-only' };
    if (requestedMode === 'text' && settings.mode !== 'off') {
        const texts = pickExternalItems(textSettings, 'text', 1, {
            randomUnit, hardExcludedIds: externalExcludedTextIds, avoidRepeat: settings.avoidRepeat,
            recentIds: recent.textIds || [], recentIdHits: recent.textIdHits || {},
            preferredExcludedIds: hardRecent.textIds || [],
        });
        if (texts.length) return { themes: [], formats: [], texts, directive, forcedFormats: [],
            requestedPresentationMode: 'text', presentationMode: 'text',
            formatFairnessEligibleIds: [], formatFairnessSelectedIds: [] };
    }
    if (requestedMode === 'text') settings = { ...settings, forceVisualScenery: false };
    const combineVisual = visualSceneryCombinationEnabled(settings);
    // Only the new combination path excludes the already locked visual item.
    if (combineVisual) formatPool = formatPool.filter(item => item.id !== '10.2.2');
    const includeAutoText = requestedMode === 'auto' && externalPoolActive(settings, 'text');
    const themeFamilyHitMap = recentFamilyHits(recent.themeIdHits, themeFamilyKey);
    // 格式兄弟家族只参考既有正式提交记录；失败 attempt 仍参与 exact 防重，
    // 但不再连带冷却同 family/group 的未抽中母本。主题与 pity 语义不变。
    const formatFamilyHitMap = recentFamilyHits(formalRecent?.formatIdHits, formatFamilyKey);

    const pickedThemes = directive?.hasThemeRequest
        ? []
        : sourceAwareThemeSample({
            settings,
            pool: themePool,
            count: themeCount,
            recentIds: recent.themeIds,
            recentIdHits: recent.themeIdHits,
            recentGroups: recent.themeGroups,
            avoidRepeat: settings.avoidRepeat,
            hardExcludedIds: hardRecent.themeIds,
            favoriteIds: favoriteThemeIds,
            favoriteMultipliers: favoriteThemeMultipliers,
            recentGroupHitMap: recent.themeGroupHits,
            recentFamilyHitMap: themeFamilyHitMap,
            immediateFamilyKeys: previousThemeFamilyKeys,
            externalHardExcludedIds: externalExcludedThemeIds,
        });
    // 这里只提前组装最终主题，不省略 format_only 原有的主题随机抽数。
    // 与 Prompt 的 IF 判据一致：只认已选主题的显式 tag，不猜标题或编号。
    const formatOnly = settings.samplingMode === 'format_only';
    const themes = formatOnly
        ? []
        : uniqueById([...(directive?.themes || []), ...pickedThemes]).slice(0, Math.max(themeCount, directive?.themes?.length || 0));
    const formatGroupCooldownEnabled = themes.some(item =>
        Array.isArray(item?.tags) && item.tags.some(tag => String(tag || '').trim().toLowerCase() === 'if'));
    const formatSample = directive?.hasFormatRequest
        ? { selected: [], eligibleIds: [] }
        : settings.forceVisualScenery && !combineVisual && !includeAutoText
            ? weightedSample(
                formatPool,
                formatCount,
                recent.formatIds,
                formalRecent?.formatGroups || [],
                settings.avoidRepeat,
                hardRecent.formatIds,
                favoriteFormatIds,
                formatEligibleMisses,
                favoriteFormatMultipliers,
                formalRecent?.formatGroupHits || {},
                formatFamilyHitMap,
                previousFormatFamilyKeys,
                formatGroupCooldownEnabled,
            )
            : sourceAwareFormatSample({
                settings,
                pool: formatPool,
                count: formatCount,
                recentIds: includeAutoText ? [...recent.formatIds, ...(recent.textIds || [])] : recent.formatIds,
                recentIdHits: includeAutoText ? { ...recent.formatIdHits, ...(recent.textIdHits || {}) } : recent.formatIdHits,
                recentGroups: formalRecent?.formatGroups || [],
                avoidRepeat: settings.avoidRepeat,
                hardExcludedIds: includeAutoText ? [...hardRecent.formatIds, ...(hardRecent.textIds || [])] : hardRecent.formatIds,
                favoriteIds: favoriteFormatIds,
                eligibleMisses: formatEligibleMisses,
                favoriteMultipliers: favoriteFormatMultipliers,
                recentGroupHitMap: formalRecent?.formatGroupHits || {},
                recentFamilyHitMap: formatFamilyHitMap,
                immediateFamilyKeys: previousFormatFamilyKeys,
                groupCooldownEnabled: formatGroupCooldownEnabled,
                externalHardExcludedIds: [...externalExcludedFormatIds, ...externalExcludedTextIds],
                presentationKind: includeAutoText ? 'presentation' : 'format',
            });
    const texts = formatSample.selected.filter(item => item.externalKind === 'text');
    const pickedFormats = formatSample.selected.filter(item => item.externalKind !== 'text');
    const isText = requestedMode === 'text' || texts.length > 0;
    const visualSceneryFormat = getVisualSceneryFormat();
    const forcedFormats = !isText && settings.forceVisualScenery && visualSceneryFormat ? [visualSceneryFormat] : [];
    const directiveFormats = directive?.formats || [];
    const directiveWantsVisualScenery = directiveFormats.some(item => item?.id === '10.2.2');

    let formats;
    if (forcedFormats.length) {
        formats = combineVisual
            ? uniqueById([...forcedFormats, ...directiveFormats.filter(item => item.id !== '10.2.2'), ...pickedFormats])
            : forcedFormats;
    } else if (directiveWantsVisualScenery) {
        formats = uniqueById(directiveFormats);
    } else {
        formats = uniqueById([...directiveFormats, ...pickedFormats]).slice(0, Math.max(formatCount, directiveFormats.length));
    }

    const formatFairnessEligibleIds = settings.forceVisualScenery && !combineVisual ? [] : formatSample.eligibleIds;
    const formatFairnessSelectedIds = settings.forceVisualScenery && !combineVisual ? [] : pickedFormats.map(item => item.id);
    return { themes, formats, directive, forcedFormats, formatFairnessEligibleIds, formatFairnessSelectedIds,
        ...(combineVisual && !isText ? { visualSceneryCombination: true } : {}),
        ...(requestedMode !== 'auto' || isText ? { requestedPresentationMode: requestedMode, presentationMode: isText ? 'text' : 'html' } : {}),
        ...(texts.length ? { texts } : {}) };
}

function comboFromSelection(result, settings, recent, uiReviewFocus = null) {
    return {
        themes: result.themes,
        formats: result.formats,
        themeIds: result.themes.map(x => x.id),
        formatIds: result.formats.map(x => x.id),
        themeGroups: result.themes.map(x => x.group).filter(Boolean),
        themeFamilies: result.themes.map(themeFamilyKey).filter(Boolean),
        formatGroups: result.formats.map(x => x.group).filter(Boolean),
        mode: settings.mode,
        samplingMode: settings.samplingMode || 'classic',
        forcedVisualScenery: result.presentationMode !== 'text' && !!settings.forceVisualScenery,
        ...presentationModeFields(result),
        ...(result.texts?.length ? { texts: result.texts, textIds: result.texts.map(item => item.id) } : {}),
        cooldownRounds: settings.cooldownRounds || 10,
        uiReviewFocus: Array.isArray(uiReviewFocus) && uiReviewFocus.length ? [...uiReviewFocus] : pickUiReviewFocus(5),
        recentUiReviewFocus: recent.uiReviewFocus || [],
    };
}

function rehydrateDirectiveCombo(cached, settings, recent) {
    if (!cached) return null;
    const themes = (cached.themeIds || [])
        .map(id => id.startsWith('ext:') ? (externalPoolHasAvailable('theme') && getExternalPoolSnapshot().themesByLibrary.some(library => library.ids.includes(id)) ? externalPoolItem(id, 'theme') : null) : THEMATIC_CATEGORIES.find(item => item.id === id))
        .filter(Boolean);
    const formats = (cached.formatIds || [])
        .map(id => id.startsWith('ext:') ? (getExternalPoolSnapshot().formatsByLibrary.some(library => library.ids.includes(id)) ? externalPoolItem(id, 'format') : null) : PRESENTATION_FORMATS.find(item => item.id === id))
        .filter(Boolean);
    if (themes.length !== (cached.themeIds || []).length || formats.length !== (cached.formatIds || []).length) return null;
    const texts = (cached.textIds || []).map(id => getExternalPoolSnapshot().textsByLibrary.some(library => library.ids.includes(id)) ? externalPoolItem(id, 'text') : null);
    if (texts.some(item => !item)) return null;
    return comboFromSelection({ themes, formats, ...(texts.length ? { texts } : {}), ...presentationModeFields(cached) }, settings, recent, cached.uiReviewFocus);
}

function directiveRandomPreferenceScopeKey(settings) {
    // Partial point-order directives may leave one side random. Their 7-day directive cache must
    // change when blacklist or 收藏室 changes, otherwise the cached random half can ignore the
    // user's newest local candidate preference. Sort IDs so array order itself does not invalidate.
    const blockedThemes = compactUnique(settings?.blacklistedThemeIds || []).sort().join(',');
    const blockedFormats = compactUnique(settings?.blacklistedFormatIds || []).sort().join(',');
    const favoriteThemeIds = compactUnique(settings?.favoriteThemeIds || []).sort();
    const favoriteFormatIds = compactUnique(settings?.favoriteFormatIds || []).sort();
    const themeMultiplierMap = settings?.favoriteThemeMultipliers && typeof settings.favoriteThemeMultipliers === 'object' ? settings.favoriteThemeMultipliers : {};
    const formatMultiplierMap = settings?.favoriteFormatMultipliers && typeof settings.favoriteFormatMultipliers === 'object' ? settings.favoriteFormatMultipliers : {};
    const favoriteThemes = favoriteThemeIds.map(id => `${id}:${Number(themeMultiplierMap[id]) || 3}`).join(',');
    const favoriteFormats = favoriteFormatIds.map(id => `${id}:${Number(formatMultiplierMap[id]) || 3}`).join(',');
    const blacklistState = settings?.blacklistEnabled === false ? 'off' : 'on';
    return `random-pref:b=${blacklistState}:bt=${hashText(blockedThemes)}:bf=${hashText(blockedFormats)}:ft=${hashText(favoriteThemes)}:ff=${hashText(favoriteFormats)}`;
}

function directiveScopeKey(directive, settings) {
    if (!directive?.rawDirective || !directive?.messageKey) return '';
    const config = [
        settings.samplingMode || 'classic',
        settings.forceVisualScenery ? 'visual' : 'normal',
        ...(visualSceneryCombinationEnabled(settings) ? ['visual-combination'] : []),
        settings.themesMin,
        settings.themesMax,
        settings.formatsMin,
        settings.formatsMax,
        settings.externalWorldBookRandomEnabled === true ? 'external-on' : 'external-off',
        String(settings.externalWorldBookMixMode || 'builtin-only'),
        directiveRandomPreferenceScopeKey(settings),
        ...(requestedPresentationMode(settings) !== 'auto' ? [`presentation:${requestedPresentationMode(settings)}`] : []),
        // A partial directive may cache a builtin random half while a library
        // is disabled. New operations must respect later import/enable changes.
        // Keep the OFF cache key byte-identical; in-flight picks remain frozen
        // by the earlier generationScopeKey fast path.
        ...((requestedPresentationMode(settings) === 'text' ||
            (settings.externalWorldBookRandomEnabled === true && settings.externalWorldBookMixMode !== 'builtin-only'))
            ? [`external-pool:${getExternalPoolSelectionKey()}`] : []),
    ].join('|');
    return hashText(`${directive.messageKey}|${directive.rawDirective}|${config}`);
}

// 多面基础层独立缓存；不接入当前单面 Prompt / API / DOM 调用链。
let cachedBatchPlan = null;
const cachedLiveBatchPlans = new Map();

function cloneBatchPlan(value) {
    return JSON.parse(JSON.stringify(value));
}

function batchFacesMatch(pending, faces, batchId) {
    if (!pending || !Array.isArray(pending.faces) || pending.faces.length !== faces.length) return false;
    return faces.every((face, faceIndex) => {
        const combo = face.combo;
        const stored = pending.faces[faceIndex];
        const signature = JSON.stringify({
            themeIds: combo.themeIds || [], formatIds: combo.formatIds || [],
            samplingMode: combo.samplingMode || 'classic', forcedVisualScenery: !!combo.forcedVisualScenery,
            ...presentationModeFields(combo),
        });
        return stored?.batchId === batchId && stored.faceIndex === faceIndex && stored.signature === signature &&
            JSON.stringify(stored.themeIds) === JSON.stringify(combo.themeIds) &&
            JSON.stringify(stored.formatIds) === JSON.stringify(combo.formatIds);
    });
}

function batchRandomSettingsKey(settings, total, favorites, exclusions, directive = null) {
    const sortedIds = values => compactUnique(Array.isArray(values) ? values : []).sort();
    // 完整白名单 JSON，不使用可能碰撞的短 hash，也不序列化 API、正文或视觉设置。
    const key = JSON.stringify({
        faceCount: total,
        ...(Array.from({ length: total }, (_, index) => requestedPresentationMode(settings, index)).some(mode => mode !== 'auto')
            ? { presentationModes: Array.from({ length: total }, (_, index) => requestedPresentationMode(settings, index)) } : {}),
        mode: settings.mode,
        samplingMode: settings.samplingMode || 'classic',
        themesMin: settings.themesMin,
        themesMax: settings.themesMax,
        formatsMin: settings.formatsMin,
        formatsMax: settings.formatsMax,
        avoidRepeat: settings.avoidRepeat,
        cooldownRounds: settings.cooldownRounds || 10,
        userDirectivePriority: !!settings.userDirectivePriority,
        forceVisualScenery: !!settings.forceVisualScenery,
        ...(visualSceneryCombinationEnabled(settings) ? { visualSceneryCombination: true } : {}),
        externalWorldBookRandomEnabled: settings.externalWorldBookRandomEnabled === true,
        externalWorldBookMixMode: String(settings.externalWorldBookMixMode || 'builtin-only'),
        blacklistEnabled: settings.blacklistEnabled !== false,
        blacklistedThemeIds: sortedIds(settings.blacklistedThemeIds),
        blacklistedFormatIds: sortedIds(settings.blacklistedFormatIds),
        favoriteThemes: [...favorites.themeIds].sort().map(id => [id, favorites.themeMultipliers[id]]),
        favoriteFormats: [...favorites.formatIds].sort().map(id => [id, favorites.formatMultipliers[id]]),
        excludedThemeIds: exclusions.themeIds,
        excludedFormatIds: exclusions.formatIds,
        ...(exclusions.textIds?.length ? { excludedTextIds: exclusions.textIds } : {}),
        // 只保留已有点菜解析器限定范围内的明确指令，不保存整条用户消息。
        directive: directive ? {
            rawDirective: directive.rawDirective,
            disabled: !!directive.disabled,
            themeIds: (directive.themes || []).map(item => item.id),
            formatIds: (directive.formats || []).map(item => item.id),
        } : null,
    });
    return key.length <= 8192 ? key : '';
}

function batchPlanningIdentity(settings, generationScopeKey, generationContext, total, onRejected = null) {
    const reject = reason => { if (onRejected) onRejected(reason); return null; };
    const source = generationContext?.batchIdentity;
    const operation = generationContext?.batchPlanningOnly === true ? generationContext?.batchOperation : null;
    const boundedString = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
    if (!boundedString(generationScopeKey, 1024)) return reject('BATCH_PLAN_IDENTITY_INVALID');
    if (operation) {
        if (!boundedString(operation.operationId, 1024) || !boundedString(operation.generationType, 64)) return reject('BATCH_PLAN_IDENTITY_INVALID');
    } else if (!source || !Number.isSafeInteger(source.mesid) || source.mesid < 0 ||
        !Number.isSafeInteger(source.swipeId) || source.swipeId < 0 || !boundedString(source.sourceHash, 512)) return reject('BATCH_PLAN_IDENTITY_INVALID');
    const chatKey = getCurrentChatKey(generationContext?.chat || null);
    if (!boundedString(chatKey, 1024)) return reject('BATCH_PLAN_IDENTITY_INVALID');
    const favorites = getFavoritesState(settings);
    const exclusions = {
        themeIds: compactUnique(Array.isArray(generationContext?.batchExcludedThemeIds) ? generationContext.batchExcludedThemeIds : []).sort(),
        formatIds: compactUnique(Array.isArray(generationContext?.batchExcludedFormatIds) ? generationContext.batchExcludedFormatIds : []).sort(),
        textIds: compactUnique(Array.isArray(generationContext?.batchExcludedTextIds) ? generationContext.batchExcludedTextIds : []).sort(),
    };
    // 先拒绝本来就超限的设置，不为缺身份/非法签名额外读取聊天。
    if (!batchRandomSettingsKey(settings, total, favorites, exclusions)) return reject('BATCH_SETTINGS_TOO_LARGE');
    const currentTurn = settings.userDirectivePriority ? getCurrentTurnUserMessage(generationContext?.chat || null) : null;
    const directive = currentTurn ? parseUserDirective(currentTurn) : null;
    const settingsKey = batchRandomSettingsKey(settings, total, favorites, exclusions, directive);
    return {
        identity: operation
            ? { kind: 'generation-operation', chatKey, generationScopeKey, operationId: operation.operationId,
                generationType: operation.generationType, preview: operation.preview === true, settingsKey }
            : { chatKey, generationScopeKey, mesid: source.mesid, swipeId: source.swipeId, sourceHash: source.sourceHash, settingsKey },
        favorites,
        exclusions,
        directive,
        signatureTooLarge: !settingsKey,
    };
}

function batchPickSnapshot(settings, generationContext, planning) {
    const formalRecent = getRecentIds(settings.cooldownRounds || 10);
    const attemptRecent = getRecentGenerationAttemptIds(planning.identity.chatKey, settings.cooldownRounds || 10);
    const validFormatIds = PRESENTATION_FORMATS.map(item => String(item?.id || '')).filter(Boolean);
    const excludedThemes = new Set(planning.exclusions.themeIds);
    const excludedFormats = new Set(planning.exclusions.formatIds);
    return {
        last: getLastCombo(),
        formalRecent,
        attemptRecent,
        recent: mergeRecent(formalRecent, attemptRecent),
        directive: planning.directive,
        favorites: planning.favorites,
        exclusions: planning.exclusions,
        validFormatIds,
        formatEligibleMisses: getFormatEligibleMisses(validFormatIds),
        themePool: filterRandomThemePool(THEMATIC_CATEGORIES.filter(item => allowByMode(item, settings.mode)), settings).filter(item => !excludedThemes.has(item.id)),
        formatPool: filterRandomFormatPool(PRESENTATION_FORMATS.filter(item => allowByMode(item, settings.mode)), settings).filter(item => !excludedFormats.has(item.id)),
    };
}

function planBatchFace(settings, snapshot, usedThemeIds, usedFormatIds, counts = null, faceIndex = 0, usedTextIds = new Set()) {
    // 在生产 selector 的输入池里移除批内已选 exact，历史不足时的回退不能恢复它们。
    // 不要求每面 family / group 不同，仍由同一权重函数决定。
    const themePool = snapshot.themePool.filter(item => !usedThemeIds.has(item.id));
    const formatPool = snapshot.formatPool.filter(item => !usedFormatIds.has(item.id));
    const themeCount = counts ? counts.themeCount : weightedThemeCount(settings);
    const formatCount = counts ? counts.formatCount : weightedFormatCount(settings);
    const result = applyDirectiveOrRandom({
        settings,
        directive: snapshot.directive,
        themePool,
        formatPool,
        themeCount,
        formatCount,
        recent: snapshot.recent,
        formalRecent: snapshot.formalRecent,
        hardRecent: {
            themeIds: [...(snapshot.attemptRecent.themeIds || []), ...snapshot.exclusions.themeIds],
            formatIds: [...(snapshot.attemptRecent.formatIds || []), ...snapshot.exclusions.formatIds],
            textIds: snapshot.attemptRecent.textIds || [],
        },
        previousThemeFamilyKeys: (snapshot.last?.themeIds || []).map(themeFamilyKey),
        previousFormatFamilyKeys: (snapshot.last?.formatIds || []).map(formatFamilyKey),
        favoriteThemeIds: snapshot.favorites.themeIds,
        favoriteFormatIds: snapshot.favorites.formatIds,
        favoriteThemeMultipliers: snapshot.favorites.themeMultipliers,
        favoriteFormatMultipliers: snapshot.favorites.formatMultipliers,
        formatEligibleMisses: snapshot.formatEligibleMisses,
        externalExcludedThemeIds: [...snapshot.exclusions.themeIds, ...usedThemeIds],
        externalExcludedFormatIds: [...snapshot.exclusions.formatIds, ...usedFormatIds],
        externalExcludedTextIds: [...(snapshot.exclusions.textIds || []), ...usedTextIds],
        faceIndex,
    });
    return { result, payload: { combo: comboFromSelection(result, settings, snapshot.recent), last: snapshot.last, directive: snapshot.directive || null } };
}

function finalizeBatchFallback(first, snapshot, scopeKey, identityKey, chatKey, directiveCacheKey = '') {
    // 复用首面；不再次调用 single 抽签。只完成一次原单面的写入顺序。
    if (first.result.formatFairnessEligibleIds?.length) {
        recordFormatEligibleMissRound({
            eligibleIds: first.result.formatFairnessEligibleIds,
            selectedIds: first.result.formatFairnessSelectedIds,
            validFormatIds: snapshot.validFormatIds,
        });
    }
    if (snapshot.directive && directiveCacheKey) setDirectiveScopedPick(chatKey, directiveCacheKey, first.payload.combo);
    setLastCombo(first.payload.combo);
    recordGenerationAttempt(first.payload.combo, { chatKey, attemptId: scopeKey, directiveScoped: !!snapshot.directive });
    cachedPick = { scopeKey, payload: cloneBatchPlan(first.payload), batchFallbackKey: identityKey };
    return [cloneBatchPlan(first.payload)];
}

function batchPrioritySingle(settings, snapshot, scopeKey, identityKey, chatKey) {
    // 复用刚才唯一一次取得的点菜快照。计数抽数与原 single 的禁用/缓存顺序一致。
    const counts = { themeCount: weightedThemeCount(settings), formatCount: weightedFormatCount(settings) };
    if (snapshot.directive?.disabled) {
        const payload = { disabled: true, directive: snapshot.directive, combo: null, last: snapshot.last };
        cachedPick = { scopeKey, payload: cloneBatchPlan(payload), batchFallbackKey: identityKey };
        return [cloneBatchPlan(payload)];
    }
    const directiveCacheKey = directiveScopeKey(snapshot.directive, settings);
    const cachedCombo = snapshot.directive && directiveCacheKey
        ? rehydrateDirectiveCombo(getDirectiveScopedPick(chatKey, directiveCacheKey), settings, snapshot.recent)
        : null;
    if (cachedCombo) {
        const payload = { combo: cachedCombo, last: snapshot.last, directive: snapshot.directive };
        setLastCombo(cachedCombo);
        recordGenerationAttempt(cachedCombo, { chatKey, attemptId: scopeKey, directiveScoped: true });
        cachedPick = { scopeKey, payload: cloneBatchPlan(payload), batchFallbackKey: identityKey };
        return [cloneBatchPlan(payload)];
    }
    const first = planBatchFace(settings, snapshot, new Set(), new Set(), counts);
    return finalizeBatchFallback(first, snapshot, scopeKey, identityKey, chatKey, directiveCacheKey);
}

function batchSinglePath(settings, generationScopeKey, generationContext, identityKey = '') {
    const scopeKey = normalizeGenerationScopeKey(generationScopeKey);
    // 完整身份的降级不得给无身份 / 其他身份的旧 single 缓存重新贴 owner。
    // 面数 1 的早返回不经过这里，仍保留原单面缓存契约。
    if (cachedPick?.scopeKey === scopeKey && (identityKey || cachedPick.batchFallbackKey) && cachedPick.batchFallbackKey !== identityKey) cachedPick = null;
    const single = pickCombination(settings, generationScopeKey, generationContext);
    if (identityKey && cachedPick?.scopeKey === scopeKey) cachedPick.batchFallbackKey = identityKey;
    return [cloneBatchPlan(single)];
}

function multiFacePlanningError(message, reasonCode = 'BATCH_PLAN_INVALID') {
    const reason = describeBatchPlanFailure(reasonCode);
    const error = new Error(`${message} 诊断原因：${reason.code}。`);
    error.code = 'MULTIFACE_PLAN_UNAVAILABLE';
    error.reasonCode = reason.code;
    return error;
}

function liveBatchResult(plan, directive) {
    const faces = plan.faces.map(face => ({ combo: cloneBatchPlan(face.combo), last: null, directive: cloneBatchPlan(directive || null), batchId: plan.batchId, faceIndex: face.faceIndex }));
    Object.defineProperty(faces, 'batchPlan', { value: cloneBatchPlan(plan), enumerable: false });
    return faces;
}

function addBatchInteractionDiversity(combos, settings) {
    // New multi-face plans only. Do not read history or consume entropy in the
    // single-face/off/cache paths, and never infer a mechanism from raw content.
    if (!settings?.avoidRepeat || combos.length < 2 || combos.length > 5) return;
    const hints = planBatchInteractionDiversity(combos.length, {
        enabled: true, recentFamilies: getRecentInteractionFamilies(5),
        presentationModes: combos.map(combo => combo.presentationMode || 'html'),
    });
    if (hints) combos.forEach((combo, index) => { if (hints[index]) combo.interactionDiversity = hints[index]; });
}

function pickLiveCombinationBatch(settings, planning, faceCount, planningReason = 'BATCH_PLAN_IDENTITY_INVALID') {
    if (!planning || planning.signatureTooLarge) throw multiFacePlanningError('多面抽取缺少有效的本次生成身份，或抽取设置签名过长；本次尚未发送请求。',
        planning?.signatureTooLarge ? 'BATCH_SETTINGS_TOO_LARGE' : planningReason);
    if (planning.directive?.disabled) return [{ disabled: true, combo: null, directive: planning.directive, last: null }];
    const identityKey = JSON.stringify(planning.identity);
    const cached = cachedLiveBatchPlans.get(identityKey) || findPendingComboBatchPlan(planning.identity);
    if (cached) return liveBatchResult(cached, planning.directive);
    const snapshot = batchPickSnapshot(settings, null, planning);
    const usedThemeIds = new Set();
    const usedFormatIds = new Set();
    const usedTextIds = new Set(snapshot.exclusions.textIds || []);
    const fixedThemes = new Set((snapshot.directive?.themes || []).map(item => item.id));
    const fixedFormats = new Set((snapshot.directive?.formats || []).map(item => item.id));
    if (settings.forceVisualScenery) fixedFormats.add('10.2.2');
    const needsRandomThemes = settings.samplingMode !== 'format_only' && !snapshot.directive?.hasThemeRequest;
    const needsRandomFormats = (!settings.forceVisualScenery || visualSceneryCombinationEnabled(settings)) && !snapshot.directive?.hasFormatRequest;
    const results = [];
    for (let faceIndex = 0; faceIndex < faceCount; faceIndex += 1) {
        const requestedMode = requestedPresentationMode(settings, faceIndex);
        const textAvailable = requestedMode !== 'html' && (requestedMode === 'text' || externalPoolActive(settings, 'text'))
            && externalPoolHasAvailable('text', [...usedTextIds]);
        if (!textAvailable && ((needsRandomThemes && !randomCandidateAvailable(settings, 'theme', snapshot.themePool, usedThemeIds)) ||
            (needsRandomFormats && !randomCandidateAvailable(settings, 'format', snapshot.formatPool, usedFormatIds)))) {
            throw multiFacePlanningError(`当前候选池不足以抽取 ${faceCount} 面不同的随机内容；请调整黑名单或面数，本次尚未发送请求。`, 'BATCH_CANDIDATE_POOL_EXHAUSTED');
        }
        const selected = planBatchFace(settings, snapshot, usedThemeIds, usedFormatIds, null, faceIndex, usedTextIds);
        const combo = selected.payload.combo;
        if (!combo.textIds?.length && ((needsRandomThemes && !combo.themeIds.length) || (needsRandomFormats && !combo.formatIds.length))) {
            throw multiFacePlanningError('多面抽取未得到完整的随机选题／形式；本次尚未发送请求。', 'BATCH_SELECTION_INCOMPLETE');
        }
        if (!combo.themeIds.length && !combo.formatIds.length && snapshot.directive) combo.customDirective = true;
        for (const id of combo.themeIds) if (!fixedThemes.has(id)) usedThemeIds.add(id);
        for (const id of combo.formatIds) if (!fixedFormats.has(id)) usedFormatIds.add(id);
        (combo.textIds || []).forEach(id => usedTextIds.add(id));
        results.push(selected);
    }
    addBatchInteractionDiversity(results.map(result => result.payload.combo), settings);
    let planRejection = 'BATCH_PLAN_INVALID';
    const plan = createPendingComboBatchPlan(results.map(result => result.payload.combo), planning.identity, {
        eligibleFormatIds: [...new Set(results.flatMap(result => result.result.formatFairnessEligibleIds || []))],
        selectedFormatIds: [...new Set(results.flatMap(result => result.result.formatFairnessSelectedIds || []))],
        validFormatIds: snapshot.validFormatIds,
        directiveScoped: !!snapshot.directive,
    }, { onRejected: code => { planRejection = code; } });
    if (!plan) throw multiFacePlanningError('多面计划无法安全建立；本次尚未发送请求。', planRejection);
    cachedLiveBatchPlans.set(identityKey, cloneBatchPlan(plan));
    if (cachedLiveBatchPlans.size > 8) cachedLiveBatchPlans.delete(cachedLiveBatchPlans.keys().next().value);
    return liveBatchResult(plan, snapshot.directive);
}

export function pickCombinationForMultifaceResay(settings, resay) {
    if (!resay || !Number.isSafeInteger(resay.faceIndex) || resay.faceIndex < 0 ||
        !Array.isArray(resay.faces) || resay.faceIndex >= resay.faces.length || resay.faces.length > 5) {
        throw multiFacePlanningError('未找到要重新生成的兔子镜面；本次尚未发送请求。');
    }
    const face = resay.faces[resay.faceIndex];
    if (Number(face?.customThemeCount || 0) > 0 || Number(face?.customFormatCount || 0) > 0 || Number(face?.customRequestCount || 0) > 0) {
        throw multiFacePlanningError('原面包含未入库的自定义点菜，仅凭面元数据无法安全还原；请重新选择整批生成。');
    }
    const externalSnapshot = getExternalPoolSnapshot();
    const resolveIds = (ids, pool, kind) => {
        if (!Array.isArray(ids) || ids.length > 16) throw multiFacePlanningError('原面抽取记录不完整，不能静默更换选题。');
        const externalLibraries = kind === 'text' ? externalSnapshot.textsByLibrary : kind === 'format' ? externalSnapshot.formatsByLibrary : externalSnapshot.themesByLibrary;
        const selected = ids.map(id => {
            if (typeof id !== 'string' || !id.startsWith('ext:')) return pool.find(item => item.id === id);
            // Re-say is an exact selection, not another random draw. The ID-only
            // constructor cannot prove membership: use the current eligible pool.
            if (!externalLibraries.some(library => library.ids.includes(id))) return null;
            return externalPoolItem(id, kind);
        });
        if (selected.some(item => !item)) throw multiFacePlanningError('原面使用的库条目已不存在，不能静默更换选题。');
        return selected;
    };
    const themes = resolveIds(face?.themeIds, THEMATIC_CATEGORIES, 'theme');
    const formats = resolveIds(face?.formatIds, PRESENTATION_FORMATS, 'format');
    const texts = resolveIds(face?.textIds || [], [], 'text');
    if (!themes.length && !formats.length && !texts.length) throw multiFacePlanningError('原面只有自定义指令，缺少可复用抽取记录；请重新选择整批生成。');
    const selectedSettings = { ...settings, samplingMode: face.samplingMode || settings.samplingMode, forceVisualScenery: face.forcedVisualScenery === true, visualSceneryCombination: face.visualSceneryCombination === true };
    return { combo: comboFromSelection({ themes, formats, ...(texts.length ? { texts } : {}), ...presentationModeFields(face) }, selectedSettings, getRecentIds(settings.cooldownRounds || 10)), directive: null, last: null };
}

export function pickCombinationBatch(settings, generationScopeKey = '', generationContext = null, faceCount = 1) {
    // 单面严格早返回：不得读取、清除或触碰另一轮 pending batch。
    if (!Number.isSafeInteger(faceCount) || faceCount < 2 || faceCount > 5) return [pickCombination(settings, generationScopeKey, generationContext)];

    let planningRejection = 'BATCH_PLAN_IDENTITY_INVALID';
    const planning = batchPlanningIdentity(settings, generationScopeKey, generationContext, faceCount, code => { planningRejection = code; });
    if (generationContext?.batchPlanningOnly === true) return pickLiveCombinationBatch(settings, planning, faceCount, planningRejection);
    if (!planning) return batchSinglePath(settings, generationScopeKey, generationContext);
    const { identity } = planning;
    const identityKey = planning.signatureTooLarge ? '' : JSON.stringify(identity);
    const scopeKey = normalizeGenerationScopeKey(generationScopeKey);
    if (identityKey && cachedPick?.scopeKey === scopeKey && cachedPick.batchFallbackKey === identityKey) return [cloneBatchPlan(cachedPick.payload)];
    if (identityKey && cachedBatchPlan?.identityKey === identityKey && batchFacesMatch(
        readPendingComboBatch({ batchId: cachedBatchPlan.batchId, identity }), cachedBatchPlan.faces, cachedBatchPlan.batchId,
    )) return cloneBatchPlan(cachedBatchPlan.faces);
    cachedBatchPlan = null;

    const snapshot = batchPickSnapshot(settings, generationContext, planning);
    // 点菜和强制展现优先，不能为了凑面数改写用户明确选择。
    const hasPresentationSelection = Array.from({ length: faceCount }, (_, index) => requestedPresentationMode(settings, index))
        .some(mode => mode !== 'auto') || externalPoolActive(settings, 'text') || visualSceneryCombinationEnabled(settings);
    if (planning.signatureTooLarge || (!hasPresentationSelection && (snapshot.directive || settings.forceVisualScenery))) {
        return batchPrioritySingle(settings, snapshot, scopeKey, identityKey, identity.chatKey);
    }

    const first = planBatchFace(settings, snapshot, new Set(), new Set());
    const faces = [first.payload];
    const usedThemeIds = new Set(first.payload.combo.themeIds);
    const usedFormatIds = new Set(first.payload.combo.formatIds);
    const usedTextIds = new Set([...(snapshot.exclusions.textIds || []), ...(first.payload.combo.textIds || [])]);
    const wantsThemes = settings.samplingMode !== 'format_only';
    if (first.payload.combo.textIds?.length || (usedFormatIds.size && (!wantsThemes || usedThemeIds.size))) {
        for (let index = 1; index < faceCount; index += 1) {
            const mode = requestedPresentationMode(settings, index);
            const textAvailable = mode !== 'html' && (mode === 'text' || externalPoolActive(settings, 'text')) && externalPoolHasAvailable('text', [...usedTextIds]);
            if (!textAvailable && (!randomCandidateAvailable(settings, 'format', snapshot.formatPool, usedFormatIds) ||
                (wantsThemes && !randomCandidateAvailable(settings, 'theme', snapshot.themePool, usedThemeIds)))) break;
            const next = planBatchFace(settings, snapshot, usedThemeIds, usedFormatIds, null, index, usedTextIds);
            if (!next.payload.combo.textIds?.length && (!next.payload.combo.formatIds.length || (wantsThemes && !next.payload.combo.themeIds.length))) break;
            faces.push(next.payload);
            next.payload.combo.themeIds.forEach(id => usedThemeIds.add(id));
            next.payload.combo.formatIds.forEach(id => usedFormatIds.add(id));
            (next.payload.combo.textIds || []).forEach(id => usedTextIds.add(id));
        }
    }
    if (faces.length < 2) return finalizeBatchFallback(first, snapshot, scopeKey, identityKey, identity.chatKey);

    const batchId = setPendingComboBatch(faces.map(item => item.combo), identity);
    if (!batchId || !batchFacesMatch(readPendingComboBatch({ batchId, identity }), faces, batchId)) {
        if (batchId) clearPendingComboBatch({ batchId, identity });
        console.warn('[RabbitMirror] Pending combo batch storage failed; preserving the selected first face.');
        return finalizeBatchFallback(first, snapshot, scopeKey, identityKey, identity.chatKey);
    }
    addBatchInteractionDiversity(faces.map(face => face.combo), settings);
    const completeFaces = faces.map((face, faceIndex) => ({ ...face, batchId, faceIndex }));
    cachedBatchPlan = { identityKey, batchId, faces: cloneBatchPlan(completeFaces) };
    return cloneBatchPlan(completeFaces);
}

export function pickCombination(settings, generationScopeKey = '', generationContext = null) {
    const scopeKey = normalizeGenerationScopeKey(generationScopeKey);
    if (scopeKey && cachedPick?.scopeKey === scopeKey) return cachedPick.payload;

    const chatOverride = generationContext?.chat || null;
    const chatKey = getCurrentChatKey(chatOverride);
    const currentTurn = settings.userDirectivePriority ? getCurrentTurnUserMessage(chatOverride) : null;
    const directive = currentTurn ? parseUserDirective(currentTurn) : null;
    const last = getLastCombo();
    const formalRecent = getRecentIds(settings.cooldownRounds || 10);
    const attemptRecent = getRecentGenerationAttemptIds(chatKey, settings.cooldownRounds || 10);
    const recent = mergeRecent(formalRecent, attemptRecent);
    // 单请求多面：本批前面已选中的组合并入硬排除，与历史冷却走同一条过滤路径。
    // generationContext 不带这两个字段时（既有单面调用）结果与原来逐字相同。
    const batchExcludedThemeIds = Array.isArray(generationContext?.batchExcludedThemeIds)
        ? generationContext.batchExcludedThemeIds.map(value => String(value || '')).filter(Boolean)
        : [];
    const batchExcludedFormatIds = Array.isArray(generationContext?.batchExcludedFormatIds)
        ? generationContext.batchExcludedFormatIds.map(value => String(value || '')).filter(Boolean)
        : [];
    const hardRecent = {
        themeIds: [...(attemptRecent.themeIds || []), ...batchExcludedThemeIds],
        formatIds: [...(attemptRecent.formatIds || []), ...batchExcludedFormatIds],
        textIds: attemptRecent.textIds || [],
    };
    const favorites = getFavoritesState(settings);
    const validFormatIds = PRESENTATION_FORMATS.map(item => String(item?.id || '')).filter(Boolean);
    const formatEligibleMisses = getFormatEligibleMisses(validFormatIds);
    const themeCount = weightedThemeCount(settings);
    const formatCount = weightedFormatCount(settings);

    let themePool = filterRandomThemePool(THEMATIC_CATEGORIES.filter(item => allowByMode(item, settings.mode)), settings);
    let formatPool = filterRandomFormatPool(PRESENTATION_FORMATS.filter(item => allowByMode(item, settings.mode)), settings);
    // Blacklist filtering is a real pool exclusion, not a Prompt instruction.
    // 1.3.69: 这两行原本写成 `!pool.length && blacklistEnabled === false` 才恢复整池。
    // 但 blacklistEnabled === false 时 filterRandomXxxPool 已经原样返回整池，池为空
    // 只可能是 allowByMode 自己筛空的（mode === 'off'），恢复出来还是空——两行在任何
    // 可达状态下都是 no-op。留着最大的风险是后来者以为它是安全网而把条件反过来，
    // 那样就会把用户明确拉黑的项目重新塞回随机池。
    // 用户故意拉黑整池时必须保持空池，由设置页警告，这里不做任何兜底。

    if (directive?.disabled) {
        const payload = { disabled: true, directive, combo: null, last };
        if (scopeKey) cachedPick = { scopeKey, payload };
        return payload;
    }

    const directiveCacheKey = directiveScopeKey(directive, settings);
    let combo = null;
    if (directive && directiveCacheKey) {
        combo = rehydrateDirectiveCombo(getDirectiveScopedPick(chatKey, directiveCacheKey), settings, recent);
    }

    if (!combo) {
        const result = applyDirectiveOrRandom({
            settings,
            directive,
            themePool,
            formatPool,
            themeCount,
            formatCount,
            recent,
            formalRecent,
            hardRecent,
            previousThemeFamilyKeys: (last?.themeIds || []).map(themeFamilyKey),
            previousFormatFamilyKeys: (last?.formatIds || []).map(formatFamilyKey),
            favoriteThemeIds: favorites.themeIds,
            favoriteFormatIds: favorites.formatIds,
            favoriteThemeMultipliers: favorites.themeMultipliers,
            favoriteFormatMultipliers: favorites.formatMultipliers,
            formatEligibleMisses,
            externalExcludedTextIds: generationContext?.batchExcludedTextIds || [],
            faceIndex: Number.isSafeInteger(generationContext?.faceIndex) ? generationContext.faceIndex : 0,
        });
        combo = comboFromSelection(result, settings, recent);
        if (result.formatFairnessEligibleIds?.length) {
            recordFormatEligibleMissRound({
                eligibleIds: result.formatFairnessEligibleIds,
                selectedIds: result.formatFairnessSelectedIds,
                validFormatIds,
            });
        }
        if (directive && directiveCacheKey) setDirectiveScopedPick(chatKey, directiveCacheKey, combo);
    }

    setLastCombo(combo);
    recordGenerationAttempt(combo, {
        chatKey,
        attemptId: scopeKey || `fallback:${Date.now().toString(36)}:${randomUnit().toString(36).slice(2, 8)}`,
        directiveScoped: !!directive,
    });

    const payload = { combo, last, directive: directive || null };
    if (scopeKey) cachedPick = { scopeKey, payload };
    return payload;
}
