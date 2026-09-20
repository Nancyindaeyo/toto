import { normalizePresentationModes } from './presentationMode.js?rmv=1.5.53-visualquick1';
import { extension_settings } from '../../../../extensions.js';
import { saveSettingsDebounced } from '../../../../../script.js';
import { independentGenerationTiming } from './independentTiming.js?rmv=1.5.53-timing1';
import { AUTOMATIC_REROLL_DEFAULT, normalizeAutomaticRerollMax } from './automaticReroll.js?rmv=1.5.70';

export const MODULE_NAME = 'rabbit_mirror_theater';

export const VISUAL_PROMPT_MAX_CHARS = 5000;
export const VISUAL_EXTRA_PROMPT_MAX_CHARS = 1000;
export const VISUAL_AVOID_PROMPT_MAX_CHARS = 1000;
export const WORLD_INFO_BOOK_NAME_MAX_CHARS = 512;
export const INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT = 32;
// Keep startup normalization scalar-only; loading host world-book readers is a user action.
function normalizeMemoryWorldBookSettingId(value) {
    return typeof value === 'string' && value.length <= 1000 && !/[\u0000\r\n]/.test(value)
        ? value.trim() : '';
}
// Do not silently reduce a malformed early-body selection: that could start a
// request before all tags the user selected have closed. Reserved names are also
// rejected by the runtime parser; this startup normalizer stays dependency-free.
export function normalizeIndependentEarlyBodyTags(value) {
    if (!Array.isArray(value) || value.length > 8 || value.some(tag =>
        typeof tag !== 'string' || !/^[a-z][a-z0-9_:-]{0,63}$/i.test(tag.trim()))) return [];
    return [...new Set(value.map(tag => tag.trim().toLowerCase()))];
}
export const DEFAULT_INDEPENDENT_CONTEXT_EXCLUDED_TAGS = Object.freeze([
    'thinking',
    'updatevariable',
    'updatevarible',
]);

export const RABBIT_MIRROR_BANNED_WORD_MAX_COUNT = 256;
export const RABBIT_MIRROR_BANNED_WORD_MAX_CHARS = 80;

export function normalizeRabbitMirrorBannedWords(value) {
    const source = typeof value === 'string'
        ? value.replace(/\r\n?/g, '\n').split('\n')
        : Array.isArray(value) ? value : [];
    const result = [];
    const seen = new Set();
    for (const raw of source) {
        const term = String((raw && typeof raw === 'object' ? raw.find : raw) ?? '')
            .replace(/[\u0000-\u001F\u007F]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, RABBIT_MIRROR_BANNED_WORD_MAX_CHARS);
        if (!term) continue;
        const key = term.toLocaleLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const replacement = raw && typeof raw === 'object'
            ? String(raw.replace ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, 240) : '';
        result.push(replacement ? { find: term, replace: replacement } : term);
        if (result.length >= RABBIT_MIRROR_BANNED_WORD_MAX_COUNT) break;
    }
    return result;
}


export function normalizeIndependentContextExcludedTags(value) {
    const source = Array.isArray(value)
        ? value
        : String(value ?? '').split(/[\s,，、;；]+/);
    const normalized = [];
    const seen = new Set();
    for (const rawValue of source) {
        const raw = String(rawValue ?? '').trim();
        if (!raw) continue;
        const unwrapped = raw
            .replace(/^<\s*\/?\s*/, '')
            .replace(/\s*\/?>\s*$/, '')
            .split(/\s/, 1)[0]
            .toLocaleLowerCase();
        // User-defined context tags may be Chinese or other Unicode letter names.
        // Keep the same 64-code-point/name-character boundary used for ASCII tags.
        if (!/^[\p{L}][\p{L}\p{N}._:-]{0,63}$/u.test(unwrapped) || [...unwrapped].length > 64 || seen.has(unwrapped)) continue;
        seen.add(unwrapped);
        normalized.push(unwrapped);
        if (normalized.length >= INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT) break;
    }
    return normalized;
}


const LEGACY_FORMAT_ID_ALIASES = Object.freeze({
    '6.2.1.2': '6.2.1.1.e',
});

function canonicalFormatSettingId(value) {
    const id = String(value || '').trim();
    return LEGACY_FORMAT_ID_ALIASES[id] || id;
}
export const DEFAULT_VISUAL_PROMPT = String.raw`兔子镜默认视觉规则:
  - 不得以通用圆角面板、卡片列表、数据仪表盘或信息框作为默认主体，再向其中填入本轮内容。
  - 当展现形式本身属于平面媒介时，其纸面、印刷面、画布、版式、纹理、边缘与承载内容可以直接构成主要视觉本体，不视为通用面板。
  - 主背景、主要承载面、文字、边界、阴影、发光和强调色，必须配合该形式实际采用的材质、环境和光线；不得预设固定的界面配色组合。
  - 标题和情绪词只能影响已经成立的画面本体，不能单独触发预设的界面底盘、警报结构或科技仪表盘。
  - 仅替换标题和正文就能直接用于其他题材的通用界面，属于不合格输出。

色彩组织:
  - 配色必须形成明确的主次关系，由主要色彩关系统领画面，再用有限的辅助色与局部强调色建立层次；不得让所有颜色平均分布或同时抢眼。
  - 不得为了避免重复或追求独特强行改变色相，也不得加入不属于媒介的霓虹、光晕或高饱和强调色。
  - 主背景、承载面、正文、装饰与交互状态须通过明度、饱和度、冷暖、透明度和材质差异清晰分层，并保持相互呼应。
  - 强调色只用于真正需要聚焦的主体、关系节点或状态变化，数量与面积必须克制。
  - 材质色、环境光与阴影必须共同作用，不能只给不同区域机械填充不同色块。
  - 视觉质感应由比例、留白、层次、材质、光影与色彩关系共同成立，不得依靠堆叠渐变、发光、阴影或高饱和色制造表面效果。
  - 当展现形式适合单色、低彩度或有限色域时，可以保持克制，但仍须依靠明度、纹理、材质与空间层次形成完整视觉。`;

function cloneDefaultSettings() {
    return typeof structuredClone === 'function'
        ? structuredClone(defaultSettings)
        : JSON.parse(JSON.stringify(defaultSettings));
}

export const defaultSettings = Object.freeze({
    enabled: true,
    autoRabbitMirrorInjection: true,
    mode: 'integrated',
    generationSource: 'follow',
    independentGenerationTiming: 'auto',
    followDisplayMode: 'inline',
    independentConnectionProfileId: '',
    independentApiBaseUrl: '',
    independentApiKey: '',
    independentApiModel: '',
    independentApiTemperature: 0.8,
    independentApiMaxTokens: 30000,
    independentAutomaticRerollMax: AUTOMATIC_REROLL_DEFAULT,
    independentAdvancedEnabled: false,
    independentReasoningEffort: '',
    independentExtraParams: '',
    independentExcludedParams: [],
    independentContextMaxLayers: 20,
    independentContextExcludedTags: [...DEFAULT_INDEPENDENT_CONTEXT_EXCLUDED_TAGS],
    behaviorRuleMode: 'always',
    behaviorRuleText: null,
    independentEarlyBodyEnabled: false,
    independentEarlyBodyTags: [],
    independentEarlyBodyChatKey: '',
    // Follow mode shares the host request with the main reply, so tag isolation is
    // instruction-only and must remain explicit opt-in to avoid permanent prompt cost.
    followTagIsolationEnabled: false,
    independentReadCharacterCardSummary: true,
    independentReadPersonaSummary: true,
    independentDisplayMode: 'external',
    independentReadGlobalWorldInfo: false,
    independentWorldInfoDisabledBooks: [],
    samplingMode: 'classic',
    rawPolicy: 'balanced',
    showCot: false,
    avoidRepeat: true,
    cooldownRounds: 10,
    blacklistEnabled: true,
    blacklistedThemeIds: [],
    blacklistedFormatIds: [],
    favoriteThemeIds: [],
    favoriteFormatIds: [],
    favoriteThemeMultipliers: {},
    favoriteFormatMultipliers: {},
    presentationWorldviewLock: false,
    // 每轮生成的兔子镜面数（1～5）。默认 1，关闭多面不改旧单面路径。
    rabbitMirrorFaceCount: 1,
    rabbitMirrorPresentationModes: ['auto', 'auto', 'auto', 'auto', 'auto'],
    richFormatBias: false,
    maintenanceRabbitEnabled: true,
    maintenanceRabbitAutoSafeEnabled: false,
    maintenanceRabbitAutoSafeConsent: false,
    feedbackCatEnabled: true,
    rabbitMirrorBannedWords: [],
    // 1C-1 only: hidden production gate. The UI does not expose this until external raw lookup exists.
    externalWorldBookRandomEnabled: false,
    externalWorldBookMixMode: 'builtin-only',
    enhancedVisualDrawing: false,
    visualPromptEditingEnabled: false,
    visualPrompt: DEFAULT_VISUAL_PROMPT,
    visualExtraPrompt: '',
    visualAvoidPrompt: '',
    appearanceReferenceEnabled: false,
    appearanceReferenceRevision: '',

    hardStartup: true,
    hardChineseLock: true,
    userDirectivePriority: true,
    creativeExpansionMode: true,
    forceVisualScenery: false,
    visualSceneryCombination: false,
    imageEnabled: false,
    imagePromptFormat: 'nai5-natural',
    memoryScanEnabled: false,
    memoryWorldBookEnabled: false,
    memoryWorldBookId: '',
    memoryProviderIds: [],
    memoryMaxChars: 2200,
    themesMin: 1,
    themesMax: 3,
    formatsMin: 1,
    formatsMax: 2,
    depth: 0,
    role: 'system',
    skipQuiet: true,
    skipImpersonate: true,
    debug: false,
});

export function getSettings() {
    if (!extension_settings[MODULE_NAME] || typeof extension_settings[MODULE_NAME] !== 'object') {
        extension_settings[MODULE_NAME] = cloneDefaultSettings();
    }
    const settings = extension_settings[MODULE_NAME];
    // Resolve missing/corrupt timing from the old flags before defaults fill it.
    settings.independentGenerationTiming = independentGenerationTiming(settings);
    const legacyRescueWasEnabled = !!(settings.plainTextRescueMode || settings.codeBlockRescueMode || settings.interactionRescueMode);
    for (const [key, value] of Object.entries(defaultSettings)) {
        if (settings[key] === undefined) settings[key] = value;
    }

    if (settings.mode === 'canon' || settings.mode === 'off') {
        settings.mode = settings.mode === 'off' ? 'off' : 'integrated';
    }
    if (!['follow', 'independent'].includes(settings.generationSource)) settings.generationSource = 'follow';
    if (!['inline', 'external'].includes(settings.followDisplayMode)) settings.followDisplayMode = 'inline';
    if (!['external', 'external_then_inline'].includes(settings.independentDisplayMode)) settings.independentDisplayMode = 'external';
    settings.independentReadGlobalWorldInfo = settings.independentReadGlobalWorldInfo === true;
    settings.independentConnectionProfileId = String(settings.independentConnectionProfileId || '').trim().slice(0, 160);
    settings.independentWorldInfoDisabledBooks = [...new Set((Array.isArray(settings.independentWorldInfoDisabledBooks) ? settings.independentWorldInfoDisabledBooks : [])
        .map(value => String(value || '').trim())
        .filter(value => value && value.length <= WORLD_INFO_BOOK_NAME_MAX_CHARS))];
    settings.independentApiBaseUrl = String(settings.independentApiBaseUrl || '').trim();
    settings.independentApiKey = String(settings.independentApiKey || '').trim();
    settings.independentApiModel = String(settings.independentApiModel || '').trim();
    {
        const temperature = Number(settings.independentApiTemperature);
        settings.independentApiTemperature = Math.max(0, Math.min(2, Number.isFinite(temperature) ? temperature : 0.8));
    }
    settings.independentApiMaxTokens = Math.max(512, Math.min(32000, Number(settings.independentApiMaxTokens) || 30000));
    settings.independentAutomaticRerollMax = normalizeAutomaticRerollMax(settings.independentAutomaticRerollMax);
    // Keep this startup path scalar-only. Invalid stored JSON is not silently
    // truncated or repaired; opt-in request preflight validates it before send.
    settings.independentAdvancedEnabled = settings.independentAdvancedEnabled === true;
    {
        const contextLayers = Number(settings.independentContextMaxLayers);
        settings.independentContextMaxLayers = Math.max(1, Math.min(200, Number.isFinite(contextLayers) ? Math.round(contextLayers) : 20));
    }
    settings.independentContextExcludedTags = normalizeIndependentContextExcludedTags(settings.independentContextExcludedTags);
    settings.behaviorRuleMode = ['always', 'off', 'adult-only'].includes(settings.behaviorRuleMode) ? settings.behaviorRuleMode : 'always';
    settings.behaviorRuleText = settings.behaviorRuleText == null ? null : String(settings.behaviorRuleText).replace(/\u0000/g, '').slice(0, 20000);
    settings.independentEarlyBodyEnabled = settings.independentEarlyBodyEnabled === true;
    settings.independentEarlyBodyTags = normalizeIndependentEarlyBodyTags(settings.independentEarlyBodyTags);
    settings.independentEarlyBodyChatKey = String(settings.independentEarlyBodyChatKey || '').slice(0, 2048);
    settings.followTagIsolationEnabled = settings.followTagIsolationEnabled === true;
    settings.independentReadCharacterCardSummary = settings.independentReadCharacterCardSummary !== false;
    settings.independentReadPersonaSummary = settings.independentReadPersonaSummary !== false;

    if (settings.showCot === undefined && settings.showWonderland !== undefined) {
        settings.showCot = !!settings.showWonderland;
    }
    if (settings.showWonderland !== undefined) delete settings.showWonderland;
    if (settings.forceInteractiveMode !== undefined) delete settings.forceInteractiveMode;
    if (settings.uiAudit !== undefined) delete settings.uiAudit;

    // Remove settings left by features that no longer exist in this build.
    for (const key of Object.keys(settings)) {
        if (!(key in defaultSettings)) delete settings[key];
    }

    settings.themesMin = Number(settings.themesMin) || defaultSettings.themesMin;
    settings.themesMax = Number(settings.themesMax) || defaultSettings.themesMax;
    settings.formatsMin = Number(settings.formatsMin) || defaultSettings.formatsMin;
    settings.formatsMax = Number(settings.formatsMax) || defaultSettings.formatsMax;
    settings.cooldownRounds = Math.max(1, Number(settings.cooldownRounds) || defaultSettings.cooldownRounds);
    settings.blacklistEnabled = settings.blacklistEnabled !== false;
    const normalizeSelectionIds = (value, mapId = id => id) => [...new Set((Array.isArray(value) ? value : []).map(id => mapId(String(id || '').trim())).filter(Boolean))].slice(0, 512);
    settings.blacklistedThemeIds = normalizeSelectionIds(settings.blacklistedThemeIds);
    settings.blacklistedFormatIds = normalizeSelectionIds(settings.blacklistedFormatIds, canonicalFormatSettingId);
    settings.favoriteThemeIds = normalizeSelectionIds(settings.favoriteThemeIds);
    settings.favoriteFormatIds = normalizeSelectionIds(settings.favoriteFormatIds, canonicalFormatSettingId);
    const normalizeFavoriteMultipliers = (value, favoriteIds, mapId = id => id) => {
        const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
        const allowed = new Set(favoriteIds || []);
        const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor']);
        const result = {};
        for (const [rawId, rawMultiplier] of Object.entries(source)) {
            const sourceId = String(rawId || '').trim();
            const id = mapId(sourceId);
            if (!id || forbiddenKeys.has(sourceId) || forbiddenKeys.has(id) || !allowed.has(id) || Object.keys(result).length >= 512) continue;
            const empty = rawMultiplier == null || (typeof rawMultiplier === 'string' && !rawMultiplier.trim());
            const parsed = empty ? NaN : Number(rawMultiplier);
            const bounded = Math.max(1, Math.min(50, Number.isFinite(parsed) ? parsed : 3));
            result[id] = Math.round(bounded * 2) / 2;
        }
        return result;
    };
    settings.favoriteThemeMultipliers = normalizeFavoriteMultipliers(settings.favoriteThemeMultipliers, settings.favoriteThemeIds);
    settings.favoriteFormatMultipliers = normalizeFavoriteMultipliers(settings.favoriteFormatMultipliers, settings.favoriteFormatIds, canonicalFormatSettingId);
    settings.presentationWorldviewLock = settings.presentationWorldviewLock === true;
    // 只接受数字 1～5；任何异常值（NaN、字符串、0、负数、超界）都回落到 1，
    // 保证旧设置升级与畸形写入都不会意外开启多面。
    settings.rabbitMirrorPresentationModes = normalizePresentationModes(settings.rabbitMirrorPresentationModes);
    const faceCount = settings.rabbitMirrorFaceCount;
    settings.rabbitMirrorFaceCount = Number.isInteger(faceCount) && faceCount >= 2 && faceCount <= 5 ? faceCount : 1;
    if (settings.autoRabbitMirrorInjection === undefined) settings.autoRabbitMirrorInjection = settings.enabled !== false;
    if (settings.maintenanceRabbitEnabled === undefined) {
        settings.maintenanceRabbitEnabled = legacyRescueWasEnabled || defaultSettings.maintenanceRabbitEnabled;
    }
    settings.maintenanceRabbitEnabled = !!settings.maintenanceRabbitEnabled;
    settings.maintenanceRabbitAutoSafeConsent = settings.maintenanceRabbitAutoSafeConsent === true;
    settings.maintenanceRabbitAutoSafeEnabled = settings.maintenanceRabbitAutoSafeConsent === true
        && settings.maintenanceRabbitAutoSafeEnabled === true;
    if (!settings.maintenanceRabbitEnabled) {
        settings.maintenanceRabbitAutoSafeEnabled = false;
        settings.maintenanceRabbitAutoSafeConsent = false;
    }
    settings.feedbackCatEnabled = settings.feedbackCatEnabled !== false;
    settings.rabbitMirrorBannedWords = normalizeRabbitMirrorBannedWords(settings.rabbitMirrorBannedWords);
    settings.externalWorldBookRandomEnabled = settings.externalWorldBookRandomEnabled === true;
    settings.externalWorldBookMixMode = ['builtin-only','builtin-preferred','balanced','external-preferred','external-only'].includes(settings.externalWorldBookMixMode)
        ? settings.externalWorldBookMixMode
        : 'builtin-only';
    settings.enhancedVisualDrawing = settings.enhancedVisualDrawing === true;
    settings.visualSceneryCombination = settings.visualSceneryCombination === true;
    settings.imageEnabled = settings.imageEnabled === true;
    settings.imagePromptFormat = settings.imagePromptFormat === 'nai45-tags' ? 'nai45-tags' : 'nai5-natural';
    settings.visualPromptEditingEnabled = !!settings.visualPromptEditingEnabled;
    settings.appearanceReferenceEnabled = settings.appearanceReferenceEnabled === true;
    settings.appearanceReferenceRevision = /^[a-z\d-]{8,80}$/i.test(String(settings.appearanceReferenceRevision || '')) ? String(settings.appearanceReferenceRevision) : '';
    const normalizeVisualSetting = (value, fallback, maxChars) => {
        const raw = typeof value === 'string' ? value : String(value ?? fallback);
        if (raw.length <= maxChars && raw.indexOf('\r') < 0) return raw;
        return raw.replace(/\r\n?/g, '\n').slice(0, maxChars);
    };
    settings.visualPrompt = normalizeVisualSetting(settings.visualPrompt, DEFAULT_VISUAL_PROMPT, VISUAL_PROMPT_MAX_CHARS);
    settings.visualExtraPrompt = normalizeVisualSetting(settings.visualExtraPrompt, '', VISUAL_EXTRA_PROMPT_MAX_CHARS);
    settings.visualAvoidPrompt = normalizeVisualSetting(settings.visualAvoidPrompt, '', VISUAL_AVOID_PROMPT_MAX_CHARS);

    delete settings.plainTextRescueMode;
    delete settings.codeBlockRescueMode;
    delete settings.interactionRescueMode;
    if (!['classic', 'format_only'].includes(settings.samplingMode)) settings.samplingMode = defaultSettings.samplingMode;
    if (!['compact', 'balanced', 'full'].includes(settings.rawPolicy)) settings.rawPolicy = defaultSettings.rawPolicy;
    if (!Array.isArray(settings.memoryProviderIds)) settings.memoryProviderIds = [];
    settings.memoryProviderIds = settings.memoryProviderIds.map(value => {
        const id = String(value || '');
        return id === 'baibai-book' ? 'global:STBaiBaiBook' : id;
    });
    settings.memoryProviderIds = [...new Set(settings.memoryProviderIds.filter(Boolean))].slice(0, 12);
    settings.memoryScanEnabled = !!settings.memoryScanEnabled;
    settings.memoryWorldBookEnabled = settings.memoryWorldBookEnabled === true;
    settings.memoryWorldBookId = normalizeMemoryWorldBookSettingId(settings.memoryWorldBookId);
    settings.memoryMaxChars = Math.max(600, Math.min(6000, Number(settings.memoryMaxChars) || defaultSettings.memoryMaxChars));
    settings.richFormatBias = false;
    settings.depth = Number(settings.depth) || 0;
    return settings;
}

// One root attribute hides existing notes immediately without scanning chat DOM.
export function syncExternalReferenceVisibility(settings) {
    const root = globalThis.document?.documentElement;
    if (!root?.setAttribute) return;
    const value = settings?.externalWorldBookRandomEnabled === true ? 'true' : 'false';
    if (root.getAttribute('data-rabbit-mirror-external-sampling-enabled') !== value) {
        root.setAttribute('data-rabbit-mirror-external-sampling-enabled', value);
    }
}

export function updateSettings(patch) {
    const settings = getSettings();
    const safePatch = patch && typeof patch === 'object' ? { ...patch } : {};
    if (Object.prototype.hasOwnProperty.call(safePatch, 'independentGenerationTiming')) {
        safePatch.independentGenerationTiming = independentGenerationTiming({ ...settings, ...safePatch });
    }
    if ((safePatch.generationSource ?? settings.generationSource) === 'independent'
        && (Object.prototype.hasOwnProperty.call(safePatch, 'independentGenerationTiming') || safePatch.generationSource === 'independent')) {
        const timing = independentGenerationTiming({ ...settings, ...safePatch });
        const enabled = timing !== 'off';
        const previousMode = safePatch.mode ?? settings.mode;
        safePatch.enabled = enabled;
        safePatch.autoRabbitMirrorInjection = enabled;
        safePatch.mode = enabled ? (previousMode === 'off' ? 'integrated' : previousMode) : 'off';
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'memoryWorldBookEnabled')) safePatch.memoryWorldBookEnabled = safePatch.memoryWorldBookEnabled === true;
    if (Object.prototype.hasOwnProperty.call(safePatch, 'memoryWorldBookId')) safePatch.memoryWorldBookId = normalizeMemoryWorldBookSettingId(safePatch.memoryWorldBookId);
    if (Object.prototype.hasOwnProperty.call(safePatch, 'independentEarlyBodyEnabled')) safePatch.independentEarlyBodyEnabled = safePatch.independentEarlyBodyEnabled === true;
    if (Object.prototype.hasOwnProperty.call(safePatch, 'independentEarlyBodyTags')) safePatch.independentEarlyBodyTags = normalizeIndependentEarlyBodyTags(safePatch.independentEarlyBodyTags);
    if (Object.prototype.hasOwnProperty.call(safePatch, 'independentEarlyBodyChatKey')) safePatch.independentEarlyBodyChatKey = String(safePatch.independentEarlyBodyChatKey || '').slice(0, 2048);
    if (Object.prototype.hasOwnProperty.call(safePatch, 'independentAutomaticRerollMax')) {
        safePatch.independentAutomaticRerollMax = normalizeAutomaticRerollMax(safePatch.independentAutomaticRerollMax);
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'behaviorRuleMode')) safePatch.behaviorRuleMode = ['always', 'off', 'adult-only'].includes(safePatch.behaviorRuleMode) ? safePatch.behaviorRuleMode : 'always';
    if (Object.prototype.hasOwnProperty.call(safePatch, 'behaviorRuleText')) safePatch.behaviorRuleText = safePatch.behaviorRuleText == null ? null : String(safePatch.behaviorRuleText).replace(/\u0000/g, '').slice(0, 20000);
    if (Object.prototype.hasOwnProperty.call(safePatch, 'independentContextExcludedTags')) {
        safePatch.independentContextExcludedTags = normalizeIndependentContextExcludedTags(safePatch.independentContextExcludedTags);
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'followTagIsolationEnabled')) {
        safePatch.followTagIsolationEnabled = safePatch.followTagIsolationEnabled === true;
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'rabbitMirrorBannedWords')) {
        safePatch.rabbitMirrorBannedWords = normalizeRabbitMirrorBannedWords(safePatch.rabbitMirrorBannedWords);
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'externalWorldBookRandomEnabled')) {
        safePatch.externalWorldBookRandomEnabled = safePatch.externalWorldBookRandomEnabled === true;
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'externalWorldBookMixMode')) {
        safePatch.externalWorldBookMixMode = ['builtin-only','builtin-preferred','balanced','external-preferred','external-only'].includes(safePatch.externalWorldBookMixMode)
            ? safePatch.externalWorldBookMixMode
            : 'builtin-only';
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'imageEnabled')) safePatch.imageEnabled = safePatch.imageEnabled === true;
    if (Object.prototype.hasOwnProperty.call(safePatch, 'imagePromptFormat')) safePatch.imagePromptFormat = safePatch.imagePromptFormat === 'nai45-tags' ? 'nai45-tags' : 'nai5-natural';
    if (Object.prototype.hasOwnProperty.call(safePatch, 'visualSceneryCombination')) {
        safePatch.visualSceneryCombination = safePatch.visualSceneryCombination === true;
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'enhancedVisualDrawing')) {
        safePatch.enhancedVisualDrawing = safePatch.enhancedVisualDrawing === true;
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'appearanceReferenceEnabled')) safePatch.appearanceReferenceEnabled = safePatch.appearanceReferenceEnabled === true;
    if (Object.prototype.hasOwnProperty.call(safePatch, 'appearanceReferenceRevision')) safePatch.appearanceReferenceRevision = /^[a-z\d-]{8,80}$/i.test(String(safePatch.appearanceReferenceRevision || '')) ? String(safePatch.appearanceReferenceRevision) : '';
    if (Object.prototype.hasOwnProperty.call(safePatch, 'rabbitMirrorPresentationModes')) {
        safePatch.rabbitMirrorPresentationModes = normalizePresentationModes(safePatch.rabbitMirrorPresentationModes);
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'rabbitMirrorFaceCount')) {
        const faceCount = safePatch.rabbitMirrorFaceCount;
        safePatch.rabbitMirrorFaceCount = Number.isInteger(faceCount) && faceCount >= 2 && faceCount <= 5 ? faceCount : 1;
    }
    for (const key of ['independentReadCharacterCardSummary', 'independentReadPersonaSummary']) {
        if (Object.prototype.hasOwnProperty.call(safePatch, key)) safePatch[key] = safePatch[key] !== false;
    }
    const keys = Object.keys(safePatch).slice(0, 24);
    const changedKeys = keys.filter(key => {
        try { return JSON.stringify(settings?.[key]) !== JSON.stringify(safePatch[key]); } catch { return settings?.[key] !== safePatch[key]; }
    });
    globalThis.__rabbitMirrorPerfDiag?.mark?.('settings.update', {
        keys: keys.join(','),
        changedKeys: changedKeys.join(','),
        changedCount: changedKeys.length,
    });
    Object.assign(settings, safePatch);
    if (Object.prototype.hasOwnProperty.call(safePatch, 'externalWorldBookRandomEnabled')) syncExternalReferenceVisibility(settings);
    if (String(settings.independentConnectionProfileId || '').trim()) settings.independentApiKey = '';
    globalThis.__rabbitMirrorPerfDiag?.mark?.('settings.saveScheduled', { source: 'updateSettings', keys: keys.join(',') });
    saveSettingsDebounced();
}

export function resetSettings() {
    extension_settings[MODULE_NAME] = cloneDefaultSettings();
    syncExternalReferenceVisibility(extension_settings[MODULE_NAME]);
    saveSettingsDebounced();
}
