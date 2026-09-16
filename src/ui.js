import { DEFAULT_INDEPENDENT_CONTEXT_EXCLUDED_TAGS, DEFAULT_VISUAL_PROMPT, INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT, RABBIT_MIRROR_BANNED_WORD_MAX_COUNT, VISUAL_AVOID_PROMPT_MAX_CHARS, VISUAL_EXTRA_PROMPT_MAX_CHARS, VISUAL_PROMPT_MAX_CHARS, getSettings, normalizeIndependentContextExcludedTags, normalizeRabbitMirrorBannedWords, updateSettings, resetSettings } from './settings.js?rmv=1.5.51-narrow1';
import { startTtSurfaceDiagnostics, stopTtSurfaceDiagnostics, isTtSurfaceDiagnosticsActive, buildTtSurfaceReport, recordTtSurface, registerTtSurfaceCleanup, nextTtSurfaceClickSeq } from './ttSurfaceDiagnostics.js?rmv=1.5.51-narrow1';
import { isRabbitMirrorManagedChatSurface, getRabbitMirrorHostCompatibilityStatus } from './hostCompatibility.js?rmv=1.5.52-domcompat1';
import { clearLastCombo, getCurrentChatKey } from './storage.js?rmv=1.5.51-narrow1';
import { normalizeEarlyBodyTags } from './earlyBodyTags.js?rmv=1.5.51-narrow1';
import { applyRabbitMirrorHostSurface } from './hostCompatibility.js?rmv=1.5.52-domcompat1';
import { BEHAVIOR_RULE_MAX_CHARS, DEFAULT_BEHAVIOR_RULE_TEXT, resolveBehaviorRuleText } from './behaviorRules.js?rmv=1.5.51-narrow1';
import { clearRecentIndependentTransportDiagnostics } from './transportDiagnostics.js?rmv=1.5.51-narrow1';
import { parseIndependentAdvancedOptions } from './advancedRequestOptions.js?rmv=1.5.51-narrow1';
import { parseRabbitMirrorReplacementLines, formatRabbitMirrorReplacementLines } from './bannedWords.js?rmv=1.5.51-narrow1';
import { clearRabbitMirrorPrompt } from './injector.js?rmv=1.5.51-narrow1';
import { clearFeedbackCatExtensionPrompt, getActiveFeedbackForCurrentChat, syncFeedbackCatExtensionPrompt } from './feedbackCat.js?rmv=1.5.51-narrow1';
import { configureMaintenanceAutoSafeMode, refreshFeedbackCats, refreshMaintenanceRabbits, refreshRecipeButtons } from './outputSanitizer.js?rmv=1.5.52-domcompat1';
import { scanMemoryPlugins, testMemoryProvider } from './memoryScanner.js?rmv=1.5.51-narrow1';
import { getLastRabbitMirrorTokenRecordForSource, TOKEN_METER_EVENT } from './tokenMeter.js?rmv=1.5.51-narrow1';
import { API_REQUEST_DIAGNOSTIC_EVENT, WORLD_INFO_BOOKS_CHANGED_EVENT, fetchIndependentModels, fetchWorldInfoBooks, getIndependentConnectionProfiles, getIndependentSavedModels, getLastIndependentApiRequestDiagnostic, getLastIndependentModelListDiagnostic, getObservedWorldInfoBooks, importCurrentSillyTavernConnection, refreshRabbitMirrorGenerationMode, scanCurrentChatIndependentContextTags, testIndependentConnection } from './independentApi.js?rmv=1.5.52-domcompat1';
import { configureRabbitMirrorNoSendRegex, inspectRabbitMirrorNoSendRegex, openSillyTavernRegexSettings } from './regexConfigurator.js?rmv=1.5.51-narrow1';
import { BLACKLIST_CHANGED_EVENT, blacklistEntries, blacklistPoolStats, clearBlacklist, removeBlacklistItem, setBlacklistEnabled, favoriteEntries, removeFavoriteItem, setFavoriteMultiplier, clearFavorites } from './blacklist.js?rmv=1.5.51-narrow1';

const SETTINGS_UI_VERSION = '1.10-parameter-exclusion';
const RUNTIME_VERSION = '1.5.52';

function isCurrentRuntime() {
    return globalThis.__rabbitMirrorRuntimeVersion === RUNTIME_VERSION;
}
let uiMountRetryTimer = 0;
let uiMountRetryCount = 0;
let pulledWorldInfoBooks = [];
let worldInfoBookRenderTimer = 0;
let worldInfoBookVisibilityObserver = null;
let worldInfoBookCurrentVisible = false;
let worldInfoBookCurrentDirty = true;
let retainedExternalDiagnosticReport = '';
let retainedExternalDiagnosticStatus = null;
let memoryWorldBookDirectory = [];
let memoryWorldBookDirectoryLoaded = false;
let memoryWorldBookDirectoryBusy = false;
let memoryWorldBookDirectorySequence = 0;
const WORLD_INFO_BOOK_RENDER_DEBOUNCE_MS = 140;

function scheduleUiMountRetry() {
    if (!isCurrentRuntime() || uiMountRetryTimer || uiMountRetryCount >= 20) return;
    uiMountRetryCount += 1;
    globalThis.__rabbitMirrorPerfDiag?.mark?.('ui.mountRetryScheduled', { retry: uiMountRetryCount });
    uiMountRetryTimer = setTimeout(() => {
        uiMountRetryTimer = 0;
        initRabbitMirrorUI();
    }, Math.min(1000, 120 + uiMountRetryCount * 40));
}

function checked(id, value) {
    $(id).prop('checked', !!value);
}

function renderVisualPromptStatus(settings = getSettings()) {
    const target = $('#rh_visual_prompt_status');
    if (!target.length) return;
    const enabled = !!settings?.visualPromptEditingEnabled;
    const official = String(settings?.visualPrompt ?? DEFAULT_VISUAL_PROMPT).replace(/\r\n?/g, '\n');
    const extra = String(settings?.visualExtraPrompt || '').trim();
    const avoid = String(settings?.visualAvoidPrompt || '').trim();
    const parts = [];
    if (official !== DEFAULT_VISUAL_PROMPT) parts.push('通用视觉规则已修改');
    if (extra) parts.push('额外视觉偏好已保存');
    if (avoid) parts.push('视觉避雷已保存');
    // 1.3.69: 开启编辑后，「通用视觉审美规则」这一栏就是整套配色组织与反通用面板规则的
    // 唯一来源（关闭时走 legacyPresentationEmbodimentRule 内置同样内容）。清空它不会报错，
    // 但下一面开始这些规则会整体消失，只有画面变差能看出来，因此这里明确提示。
    if (enabled && !official.trim()) {
        target.text('当前：编辑注入已启用，但「通用视觉审美规则」为空。配色组织与反通用面板规则这一整层不会发送；如非刻意，请点「恢复默认通用视觉规则」。');
        return;
    }
    if (!enabled) {
        target.text(parts.length
            ? `当前：编辑注入未启用，仍走 1.3.20 原版视觉流程；已保存内容不会发送（${parts.join(' / ')}）。`
            : '当前：编辑注入未启用，下一面仍走 1.3.20 原版视觉流程。');
        return;
    }
    target.text(parts.length
        ? `当前：编辑注入已启用（${parts.join(' / ')}）`
        : '当前：编辑注入已启用；使用可编辑的通用视觉规则。');
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


function renderBlacklistSettings() {
    const target = $('#rh_blacklist_summary');
    if (!target.length) return;
    const settings = getSettings();
    const themes = blacklistEntries('theme');
    const formats = blacklistEntries('format');
    const stats = blacklistPoolStats();
    const row = item => `<div style="display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid color-mix(in srgb,currentColor 10%,transparent);">
      <span style="min-width:0;flex:1;overflow-wrap:anywhere;">${escapeHtml(item.id)} ${escapeHtml(item.title)}</span>
      <button type="button" class="menu_button rh-blacklist-remove" data-kind="${escapeHtml(item.kind)}" data-id="${escapeHtml(item.id)}" style="padding:2px 7px;min-height:24px;">解除</button>
    </div>`;
    const section = (title, items) => `<div style="margin-top:7px;"><div style="font-weight:700;font-size:11px;opacity:.74;margin-bottom:2px;">${title}（${items.length}）</div>${items.length ? items.map(row).join('') : '<div style="opacity:.55;font-size:11px;padding:3px 0;">暂无</div>'}</div>`;
    const warnings = [];
    if (stats.themePoolEmpty) warnings.push('主题 / 元素候选已全部加入黑名单，随机主题将没有候选。');
    if (stats.formatPoolEmpty) warnings.push('展现形式候选已全部加入黑名单，随机形式将没有候选。');
    target.html(`<div style="font-size:11px;line-height:1.5;opacity:.78;">当前${settings.blacklistEnabled !== false ? '启用' : '暂停'}；主题 / 元素 ${themes.length}/${stats.themeTotal}，展现形式 ${formats.length}/${stats.formatTotal}。黑名单只过滤随机抽取，不向模型追加任何 Prompt。</div>
      ${warnings.length ? `<div style="margin-top:5px;color:#d97706;font-size:11px;line-height:1.45;">${warnings.map(escapeHtml).join('<br>')}</div>` : ''}
      ${section('主题 / 元素', themes)}
      ${section('展现形式', formats)}`);
}

function renderFavoriteSettings() {
    const target = $('#rh_favorite_summary');
    if (!target.length) return;
    const themes = favoriteEntries('theme');
    const formats = favoriteEntries('format');
    const row = item => `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid color-mix(in srgb,currentColor 10%,transparent);">
      <span style="min-width:0;overflow-wrap:anywhere;">${escapeHtml(item.id)} ${escapeHtml(item.title)}</span>
      <label style="display:flex;align-items:center;gap:4px;font-size:11px;white-space:nowrap;">倍率 ×<input class="text_pole rh-favorite-multiplier" type="number" min="1" max="50" step="0.5" value="${escapeHtml(item.multiplier)}" data-kind="${escapeHtml(item.kind)}" data-id="${escapeHtml(item.id)}" style="width:66px;min-height:28px;padding:2px 5px;"></label>
      <button type="button" class="menu_button rh-favorite-remove" data-kind="${escapeHtml(item.kind)}" data-id="${escapeHtml(item.id)}" style="padding:2px 7px;min-height:28px;">取消</button>
    </div>`;
    const section = (title, items) => `<div style="margin-top:7px;"><div style="font-weight:700;font-size:11px;opacity:.74;margin-bottom:2px;">${title}（${items.length}）</div>${items.length ? items.map(row).join('') : '<div style="opacity:.55;font-size:11px;padding:3px 0;">暂无收藏</div>'}</div>`;
    target.html(`<div style="font-size:11px;line-height:1.5;opacity:.78;">收藏室只调整本地随机权重，不向模型追加 Prompt；每项倍率可设为 ×1～×50。</div>${section('主题 / 元素', themes)}${section('展现形式', formats)}`);
}

function worldInfoSourceLabel(value) {
    return ({ characterLore: '角色', chatLore: '当前聊天', personaLore: 'Persona', globalLore: '当前全局' })[String(value || '')] || String(value || '');
}
function renderWorldInfoRows(target, books, disabled, emptyText) {
    if (!target.length) return;
    const rows = books.map((item, index) => {
        const enabled = !disabled.has(item.id);
        const identity = item.label !== item.id ? `<br><span style="opacity:.55;font-size:10px;">${escapeHtml(item.id)}</span>` : '';
        const sourceText = Array.isArray(item.sources) && item.sources.length
            ? item.sources.map(worldInfoSourceLabel).filter(Boolean).join(' / ')
            : item.note || '';
        return `<label class="checkbox_label" style="display:flex;align-items:flex-start;gap:7px;margin:4px 0;">
          <input class="rh-world-info-book-toggle" type="checkbox" data-book-index="${index}" data-book-id="${escapeHtml(item.id)}" ${enabled ? 'checked' : ''}>
          <span style="min-width:0;flex:1;overflow-wrap:anywhere;"><b>${escapeHtml(item.label)}</b>${identity}${sourceText ? `<br><span style="opacity:.6;font-size:10px;">${escapeHtml(sourceText)}</span>` : ''}</span>
        </label>`;
    }).join('');
    target.data('rm-world-info-books', books.map(item => item.id));
    target.html(books.length ? rows : `<div style="font-size:11px;line-height:1.4;opacity:.66;">${escapeHtml(emptyText)}</div>`);
}
function clearWorldInfoBookRenderTimer() {
    if (!worldInfoBookRenderTimer) return;
    clearTimeout(worldInfoBookRenderTimer);
    worldInfoBookRenderTimer = 0;
}
function renderWorldInfoBookSettings({ current = true, all = false } = {}) {
    const currentTarget = $('#rh_world_info_book_filters');
    const allTarget = $('#rh_world_info_all_book_filters');
    if (!currentTarget.length && !allTarget.length) return;
    const settings = getSettings();
    const disabled = new Set(Array.isArray(settings.independentWorldInfoDisabledBooks) ? settings.independentWorldInfoDisabledBooks : []);

    if (current && currentTarget.length) {
        const currentBooks = getObservedWorldInfoBooks().map(item => ({
            id: String(item?.name || '').trim(),
            label: String(item?.name || '').trim(),
            sources: item?.sources || [],
        })).filter(item => item.id);
        renderWorldInfoRows(
            currentTarget,
            currentBooks,
            disabled,
            '当前聊天还没有观察到酒馆加载的世界书。进入角色聊天并正常生成后会自动显示当前聊天相关世界书；不会为了列表重新扫描条目。',
        );
        worldInfoBookCurrentDirty = false;
    }

    const allDetails = document.getElementById('rh_world_info_all_books');
    if (!all || !allTarget.length || !allDetails?.open) return;
    const byId = new Map();
    for (const item of pulledWorldInfoBooks) {
        const id = String(item?.id || item?.name || '').trim(); if (!id) continue;
        byId.set(id, { id, label: String(item?.label || id).trim() || id, sources: [], note: '全部世界书' });
    }
    for (const id of disabled) {
        if (!byId.has(id)) byId.set(id, { id, label: id, sources: [], note: '已保存为关闭' });
    }
    const allBooks = [...byId.values()].sort((a, b) => String(a.label || a.id).localeCompare(String(b.label || b.id), 'zh-Hans-CN'));
    renderWorldInfoRows(allTarget, allBooks, disabled, '尚未拉取全部世界书。');
}
function scheduleWorldInfoBookSettingsRender(delay = WORLD_INFO_BOOK_RENDER_DEBOUNCE_MS) {
    worldInfoBookCurrentDirty = true;
    clearWorldInfoBookRenderTimer();
    // When the extension drawer is closed, do not build even the current-chat checkbox DOM.
    // IntersectionObserver will render it when the user actually exposes this settings area.
    if (worldInfoBookVisibilityObserver && !worldInfoBookCurrentVisible) return;
    worldInfoBookRenderTimer = setTimeout(() => {
        worldInfoBookRenderTimer = 0;
        if (!isCurrentRuntime() || !worldInfoBookCurrentDirty) return;
        renderWorldInfoBookSettings({ current: true, all: false });
    }, Math.max(0, Number(delay) || 0));
}
function disconnectWorldInfoBookVisibilityObserver() {
    try { worldInfoBookVisibilityObserver?.disconnect?.(); } catch {}
    worldInfoBookVisibilityObserver = null;
    worldInfoBookCurrentVisible = false;
}
function installWorldInfoBookVisibilityObserver() {
    disconnectWorldInfoBookVisibilityObserver();
    const target = document.getElementById('rh_world_info_book_filters');
    if (!target) return;
    if (typeof IntersectionObserver !== 'function') {
        worldInfoBookCurrentVisible = true;
        scheduleWorldInfoBookSettingsRender(0);
        return;
    }
    worldInfoBookVisibilityObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.target !== target) continue;
            worldInfoBookCurrentVisible = entry.isIntersecting === true;
            if (worldInfoBookCurrentVisible && worldInfoBookCurrentDirty) scheduleWorldInfoBookSettingsRender(0);
        }
    }, { root: null, threshold: 0 });
    worldInfoBookVisibilityObserver.observe(target);
}
function clearCollapsedAllWorldInfoBookRows() {
    const target = $('#rh_world_info_all_book_filters');
    if (!target.length) return;
    target.removeData('rm-world-info-books');
    target.html('<div style="font-size:11px;line-height:1.4;opacity:.66;">折叠时不创建完整世界书列表；展开后按需渲染。</div>');
}

function independentApiProfileLabel(diagnostic) {
    if (!diagnostic?.profile) return '暂无记录';
    const numericStatus = Number(diagnostic.status || 0);
    const status = diagnostic.ok
        ? '成功'
        : numericStatus > 0
            ? `失败 HTTP ${numericStatus}`
            : diagnostic.transportCause === 'connection-interrupted'
                ? '连接中断（未收到完整响应）'
                : '未收到 HTTP 响应';
    const temp = diagnostic.temperatureSent ? `温度 ${Number(diagnostic.configuredTemperature ?? 0.8)}` : '默认温度';
    const stream = diagnostic.streamSent ? '流式' : '非流式';
    return `${status}｜${temp}｜${stream}`;
}

function independentModelPullSnapshotMatches(snapshot,state) {
    state=state||{};
    if(!snapshot || Number(snapshot.epoch)!==Number(state.epoch)) return false;
    if(Number(snapshot.profileRevision)!==Number(state.profileRevision)) return false;
    if(String(snapshot.activeProfileId||'').trim()!==String(state.activeProfileId||'').trim()) return false;
    if(snapshot.source?.mode==='profile') return String(snapshot.source.profileId||'').trim()===String(state.activeProfileId||'').trim();
    if(snapshot.source?.mode==='manual') return String(snapshot.source.baseUrl||'').trim()===String(state.manualBaseUrl||'').trim()
        && String(snapshot.source.apiKey||'')===String(state.manualApiKey||'');
    return false;
}

let independentModelPullEpoch = 0;

function invalidateIndependentModelPull() {
    independentModelPullEpoch += 1;
}

function beginIndependentConnectionOperation() {
    const next = Number(globalThis.__rabbitMirrorIndependentConnectionOperationRevision || 0) + 1;
    globalThis.__rabbitMirrorIndependentConnectionOperationRevision = next;
    return next;
}

function independentConnectionOperationIsCurrent(revision) {
    return isCurrentRuntime()
        && Number(globalThis.__rabbitMirrorIndependentConnectionOperationRevision || 0) === Number(revision);
}

// Display only: keep the exact IDs and original labels in the request/repair record.
// No library reads are needed to render the latest selection, including legacy labels.
function shortDiagnosticSelectionLabels(labels, ids, fallback) {
    if (!Array.isArray(labels) || !labels.length) return fallback;
    return labels.slice(0, 12).map((value, index) => {
        let title = typeof value === 'string' ? value.slice(0, 4096).trim() : '';
        const id = typeof ids?.[index] === 'string' ? ids[index].slice(0, 2048) : '';
        if (id && (title === id || title.startsWith(`${id} `))) title = title.slice(id.length).trim();
        // Older diagnostics did not always carry IDs alongside "ID title".
        title = title.replace(/^ext:\S+(?:\s+|$)/, '').replace(/^(?:[A-Z]|\d+)(?:\.\d+)+(?:\s+|$)/, '').trim();
        if (!title) return '名称未记录';
        const chars = Array.from(title.replace(/\s+/g, ' '));
        return chars.length > 64 ? `${chars.slice(0, 64).join('')}…` : chars.join('');
    }).join('＋');
}

function renderDiagnosticSelection(diagnostic) {
    const faces = Array.isArray(diagnostic?.faces) ? diagnostic.faces.slice(0, 5) : [];
    const requested = Number(diagnostic?.faceCount);
    const count = Math.min(5, Math.max(faces.length, Number.isInteger(requested) && requested > 0 ? requested : 1));
    const hasLabels = Array.isArray(diagnostic?.themeLabels) || Array.isArray(diagnostic?.formatLabels);
    if (!faces.length && !hasLabels && count === 1) return '';
    const rows = Array.from({ length: count }, (_, index) => {
        const face = faces[index] || (index === 0 && !faces.length ? diagnostic : null);
        const themes = shortDiagnosticSelectionLabels(face?.themeLabels, face?.themeIds, face ? '仅当前语境' : '名称未记录');
        const formats = shortDiagnosticSelectionLabels(face?.formatLabels, face?.formatIds, '名称未记录');
        return `<div data-rm-diagnostic-face="${index + 1}" style="min-width:0;overflow-wrap:anywhere;margin-top:4px;"><b>第 ${index + 1} 面：</b>题材：${escapeHtml(themes)}｜展现：${escapeHtml(formats)}</div>`;
    }).join('');
    return `<br><b>抽到：</b>${rows}`;
}

function renderIndependentApiDiagnostic(diagnostic = getLastIndependentApiRequestDiagnostic()) {
    const target = $('#rh_independent_api_diagnostic');
    if (!target.length) return;
    const text = independentApiProfileLabel(diagnostic);
    const attempts = '';
    const requestedModel = String(diagnostic?.model || '').trim();
    const model = requestedModel ? `<br><b>请求指定模型：</b>${escapeHtml(requestedModel)}` : '';
    const selection = renderDiagnosticSelection(diagnostic);
    const worldInfo = diagnostic?.globalWorldInfoEnabled
        ? `<br><b>世界书：</b>${diagnostic.globalWorldInfoCaptured ? `已带入 ${formatMeterNumber(diagnostic.globalWorldInfoEntries)}／${formatMeterNumber(diagnostic.globalWorldInfoTotalEntries || diagnostic.globalWorldInfoEntries)} 条，${formatMeterNumber(diagnostic.globalWorldInfoChars)} 字符${diagnostic.globalWorldInfoTruncated ? '（已按独立预算裁剪）' : ''}` : '本轮无可用条目'}`
        : '<br><b>世界书：</b>关闭';
    target.html(`<b>最近请求：</b>${escapeHtml(text)}${escapeHtml(attempts)}${model}${selection}${worldInfo}`);
}


function formatMeterNumber(value) {
    return Math.max(0, Number(value) || 0).toLocaleString('zh-CN');
}

function tokenMeterSourceLabel(generationSource) {
    return String(generationSource || '').toLowerCase() === 'independent' ? '独立 API' : '跟随正文 API';
}

function tokenMeterRecordAgeLabel(record) {
    const recordedAt = Number(record?.recordedAt);
    const age = recordedAt > 0 ? Date.now() - recordedAt : Number.POSITIVE_INFINITY;
    return age >= 0 && age <= 30 * 60 * 1000 ? '最近记录' : '历史记录';
}

function tokenMeterNoInjectionLabel(reason) {
    const labels = {
        disabled: '最近状态：未注入（兔子镜已关闭）',
        'quiet-skipped': '最近状态：未注入（静默生成已跳过）',
        'impersonate-skipped': '最近状态：未注入（角色扮演生成已跳过）',
        'directive-skipped': '最近状态：未注入（用户指令要求跳过）',
        'independent-api': '最近状态：正文 API 未注入（兔子镜由独立 API 生成）',
        'mode-change': '当前注入已按生成方式切换清空',
        empty: '最近状态：未注入（没有形成有效 Prompt）',
        cleared: '当前注入已清空',
        manual: '当前注入已手动清空',
    };
    return labels[String(reason || '')] || '最近状态：未注入';
}

function renderTokenMeter(record = getLastRabbitMirrorTokenRecordForSource(getSettings().generationSource)) {
    const root = $('#rh_token_meter');
    if (!root.length) return;
    const main = root.find('[data-rh-token-meter-main]');
    const exact = root.find('[data-rh-token-meter-exact]');
    const detail = root.find('[data-rh-token-meter-detail]');
    const generationSource = getSettings().generationSource;
    const sourceLabel = tokenMeterSourceLabel(generationSource);
    if (!record) {
        main.text(`${sourceLabel} · 尚无估算记录`);
        exact.text('下一次生成准备请求时更新。');
        detail.text('这里只显示兔子镜 Prompt 的本地估算，不是服务商账单 Token。');
        return;
    }
    const ageLabel = tokenMeterRecordAgeLabel(record);
    if (record.status === 'independent') {
        const tokens = record.tokens || {};
        const chars = record.chars || {};
        main.text(`${sourceLabel} · ${ageLabel} · 请求前规则估算约 ${formatMeterNumber(tokens.estimated)} Token（非账单）`);
        const layerText = chars.independentContextLayers
            ? ` · 最近 ${formatMeterNumber(chars.independentContextLayers)}/${formatMeterNumber(chars.independentContextMaxLayers || chars.independentContextLayers)} 层`
            : '';
        const filteredText = [
            chars.filteredRabbitMirrorChars ? `历史兔子镜 ${formatMeterNumber(chars.filteredRabbitMirrorChars)} 字符` : '',
            chars.filteredContextTagChars ? `指定标签 ${formatMeterNumber(chars.filteredContextTagChars)} 字符` : '',
        ].filter(Boolean).join(' · ');
        const totalRequestChars = Number(chars.totalRequest) || (Number(chars.total) || 0) + (Number(chars.independentContext) || 0);
        exact.text(`规则估算范围 ${formatMeterNumber(tokens.min)}–${formatMeterNumber(tokens.max)} Token；请求消息内容合计 ${formatMeterNumber(totalRequestChars)} 字符（规则 ${formatMeterNumber(chars.total)}；上下文 ${formatMeterNumber(chars.independentContext)}）${layerText}${filteredText ? ` · 已过滤 ${filteredText}` : ''}。`);
        const parts = [
            `基础约 ${formatMeterNumber(tokens.baseEstimated)}`,
            chars.feedback ? `反馈约 ${formatMeterNumber(tokens.feedbackEstimated)}` : '反馈 0',
            chars.executionLock ? `格式与边界约束约 ${formatMeterNumber(tokens.executionLockEstimated)} Token（非禁词）` : '',
            `参考内容 ${formatMeterNumber(chars.motherLibrary)} 字符`,
            chars.sharedMemory ? `回忆资料 ${formatMeterNumber(chars.sharedMemory)} 字符` : '',
            chars.editableVisual ? `自定义视觉 ${formatMeterNumber(chars.editableVisual)} 字符` : '',
        ].filter(Boolean);
        detail.text(parts.join('；'));
        return;
    }
    if (record.status !== 'injected') {
        main.text(`${sourceLabel} · ${ageLabel} · 追加量 0`);
        exact.text(tokenMeterNoInjectionLabel(record.reason));
        detail.text('最近状态没有追加兔子镜 Prompt；这不是服务商账单 Token。');
        return;
    }

    const tokens = record.tokens || {};
    const chars = record.chars || {};
    main.text(`${sourceLabel} · ${ageLabel} · 兔子镜待注入 Prompt 估算约 ${formatMeterNumber(tokens.estimated)} Token（非账单）`);
    exact.text(`估算范围 ${formatMeterNumber(tokens.min)}–${formatMeterNumber(tokens.max)} Token；Prompt 字符数 ${formatMeterNumber(chars.total)}`);
    const parts = [
        `基础约 ${formatMeterNumber(tokens.baseEstimated)}`,
        chars.feedback ? `反馈约 ${formatMeterNumber(tokens.feedbackEstimated)}` : '反馈 0',
        `参考内容 ${formatMeterNumber(chars.motherLibrary)} 字符`,
        chars.sharedMemory ? `回忆资料 ${formatMeterNumber(chars.sharedMemory)} 字符` : '',
        chars.editableVisual ? `自定义视觉 ${formatMeterNumber(chars.editableVisual)} 字符` : '',
    ].filter(Boolean);
    detail.text(parts.join('；'));
}

function attachTokenMeterListener() {
    try { globalThis.__rabbitMirrorTokenMeterUiCleanup?.(); } catch {}
    try { globalThis.__rabbitMirrorBlacklistUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorBlacklistUiCleanup = null;
    // Select the record for the currently visible generation mode. A host-side
    // "main API 0 Token" bookkeeping event must not hide the latest independent
    // API measurement.
    const handler = () => renderTokenMeter();
    globalThis.addEventListener?.(TOKEN_METER_EVENT, handler);
    globalThis.__rabbitMirrorTokenMeterUiCleanup = () => globalThis.removeEventListener?.(TOKEN_METER_EVENT, handler);
}

function renderMemoryScanResults(results) {
    const settings = getSettings();
    const selected = new Set(settings.memoryProviderIds || []);
    const container = $('#rh_memory_scan_results');
    if (!container.length) return;

    const list = Array.isArray(results) ? results : [];
    const readable = list.filter(item => item?.readable && item?.selectedAllowed);
    const pending = list.filter(item => !item?.readable);

    const contextBlock = `<div class="rh-memory-context" style="padding:8px 0 9px 0;">
      <div style="font-size:12px;"><b>当前模型上下文</b> <span style="font-size:11px;opacity:.82;">[已可用]</span></div>
      <div style="margin-top:3px;opacity:.68;font-size:11px;line-height:1.45;">近期对话、已注入世界书，以及模型当前已经获得的摘要或总结；无需由兔子镜重复读取。</div>
    </div>`;

    const readableRows = readable.map(item => {
        const checkedAttr = selected.has(item.id) ? ' checked' : '';
        return `<div class="rh-memory-provider" style="padding:8px 0;border-top:1px solid color-mix(in srgb, var(--SmartThemeBorderColor) 65%, transparent);">
          <label class="checkbox_label" style="align-items:flex-start;">
            <input class="rh-memory-provider-check" type="checkbox" data-provider-id="${escapeHtml(item.id)}"${checkedAttr}>
            <span><b>${escapeHtml(item.name)}</b> <span style="font-size:11px;opacity:.82;">[可读取]</span><br><span style="opacity:.7;font-size:11px;line-height:1.45;">来源类型：公开资料接口</span></span>
          </label>
          ${item.details ? `<div style="margin:3px 0 0 26px;opacity:.62;font-size:11px;line-height:1.4;word-break:break-word;">${escapeHtml(item.details)}</div>` : ''}
          <button class="menu_button rh-memory-test" type="button" data-provider-id="${escapeHtml(item.id)}" style="margin:6px 0 0 26px;padding:3px 8px;min-height:unset;font-size:12px;">测试读取</button>
        </div>`;
    }).join('');

    const readableBlock = readableRows || '<div style="opacity:.75;font-size:12px;line-height:1.5;padding:6px 0;">未检测到可额外读取的资料来源。</div>';

    let pendingBlock = '';
    if (pending.length) {
        const visiblePending = pending.slice(0, 10);
        const pendingRows = visiblePending.map(item => `<div style="padding:5px 0;border-top:1px solid color-mix(in srgb, var(--SmartThemeBorderColor) 45%, transparent);">
          <div style="font-size:12px;"><b>${escapeHtml(item.name)}</b> <span style="opacity:.58;font-size:11px;">[待适配]</span></div>
          <div style="opacity:.6;font-size:11px;line-height:1.4;word-break:break-word;">${escapeHtml(item.source || item.status || '')}</div>
        </div>`).join('');
        const omitted = pending.length > visiblePending.length
            ? `<div style="padding-top:5px;opacity:.58;font-size:11px;">另有 ${pending.length - visiblePending.length} 个候选未展开显示。</div>`
            : '';
        pendingBlock = `<details class="rh-memory-pending" style="margin-top:8px;border-top:1px dashed color-mix(in srgb, var(--SmartThemeBorderColor) 60%, transparent);padding-top:7px;">
          <summary style="cursor:pointer;font-size:12px;opacity:.72;">其他候选（${pending.length}）</summary>
          <div style="padding:4px 0 0 10px;">${pendingRows}${omitted}</div>
        </details>`;
    }

    if (!readable.length && !pending.length) {
        container.html(`${contextBlock}<div style="opacity:.75;font-size:12px;line-height:1.5;padding:6px 0;">未扫描到可额外读取的资料来源。</div>`);
        return;
    }
    container.html(`${contextBlock}${readableBlock}${pendingBlock}`);
}

function renderMemoryWorldBookBinding(message = '') {
    const select = document.getElementById('rh_memory_worldbook_id');
    if (!select) return;
    const settings = getSettings();
    const bound = settings.memoryWorldBookId;
    const options = [{ fileId: '', displayName: '未绑定记忆世界书' }, ...memoryWorldBookDirectory];
    if (bound && !memoryWorldBookDirectory.some(book => book.fileId === bound)) {
        options.push({ fileId: bound, displayName: `${bound}（${memoryWorldBookDirectoryLoaded ? '当前目录中未找到，原绑定保留' : '已保存，尚未刷新目录'}）` });
    }
    select.replaceChildren(...options.map(book => {
        const option = document.createElement('option');
        option.value = book.fileId;
        option.textContent = book.displayName;
        return option;
    }));
    select.value = bound;
    checked('#rh_memory_worldbook_enabled', settings.memoryWorldBookEnabled);
    $('#rh_memory_worldbook_refresh').prop('disabled', memoryWorldBookDirectoryBusy)
        .text(memoryWorldBookDirectoryBusy ? '正在读取世界书目录…' : '刷新世界书目录');
    $('#rh_memory_worldbook_clear').prop('disabled', !bound);
    $('#rh_memory_worldbook_status').attr('aria-busy', String(memoryWorldBookDirectoryBusy)).text(message || (
        memoryWorldBookDirectoryBusy ? '正在读取书名目录，不读取条目正文…'
            : !settings.memoryScanEnabled ? '额外资料总开关已关闭；绑定与勾选保留，不额外读取记忆资料。'
                : !settings.memoryWorldBookEnabled ? '记忆世界书来源已关闭；已保存的绑定保留。'
                    : !bound ? '尚未绑定。请刷新目录后选择一本记忆世界书。'
                        : '绑定已保存；仅在抽中 I.1 共同回忆时按需读取，不会每轮读取。'
    ));
}

async function refreshMemoryWorldBookDirectory() {
    const select = document.getElementById('rh_memory_worldbook_id');
    if (!select || memoryWorldBookDirectoryBusy) return;
    const sequence = ++memoryWorldBookDirectorySequence;
    const isAlive = () => sequence === memoryWorldBookDirectorySequence && select.isConnected
        && document.getElementById('rh_memory_worldbook_id') === select && isCurrentRuntime();
    memoryWorldBookDirectoryBusy = true;
    renderMemoryWorldBookBinding();
    try {
        const { listMemoryWorldBooks, normalizeMemoryWorldBookId } = await import('./memoryWorldBook.js?rmv=1.5.51-narrow1');
        if (!isAlive()) return;
        const books = await listMemoryWorldBooks();
        if (!isAlive()) return;
        const seen = new Set();
        memoryWorldBookDirectory = books.flatMap(book => {
            const fileId = normalizeMemoryWorldBookId(book?.fileId);
            if (!fileId || seen.has(fileId)) return [];
            seen.add(fileId);
            return [{ fileId, displayName: String(book.displayName || fileId) }];
        });
        memoryWorldBookDirectoryLoaded = true;
        memoryWorldBookDirectoryBusy = false;
        renderMemoryWorldBookBinding(memoryWorldBookDirectory.length
            ? `已读取 ${memoryWorldBookDirectory.length} 本世界书的名称，可在下方选择绑定；未读取条目正文。`
            : '目录为空；没有更改原绑定。可确认酒馆世界书列表后再次刷新。');
    } catch {
        if (!isAlive()) return;
        memoryWorldBookDirectoryBusy = false;
        renderMemoryWorldBookBinding('世界书目录读取失败，原绑定与列表已保留。请确认酒馆连接后点击“刷新世界书目录”重试。');
    }
}

function memoryTestMessage(result) {
    if (!result?.ok) return `读取失败：${result?.error || '未知错误'}`;
    const parts = [
        `${result.providerName || '资料来源'}读取成功`,
        `资料正文 ${result.chars} 字符`,
        result.characterName ? `角色：${result.characterName}` : '',
        result.chatId ? `聊天：${result.chatId}` : '',
        result.coverageComplete === false ? `覆盖不完整（缺失 ${result.missingFloors || 0} 个 AI 楼层）` : '',
        `耗时 ${result.elapsed || 0}ms`,
    ].filter(Boolean);
    return parts.join('；');
}

let retainedTtDiagnosticReport = '';

// Session-only capture. Never retain generated text or put diagnostic state on DOM nodes.
function captureTtDiagnosticInputs(chatRoot, session) {
    if (!chatRoot?.addEventListener) return;
    let root = chatRoot;
    let nodeIds = new WeakMap();
    let nextNodeId = 0;
    const pending = new Map();
    const recent = new Map();
    const bound = (map, key, value) => {
        map.delete(key); map.set(key, value);
        if (map.size > 24) map.delete(map.keys().next().value);
    };
    const nodeId = node => {
        if (!nodeIds.has(node)) nodeIds.set(node, ++nextNodeId);
        return nodeIds.get(node);
    };
    const handler = event => {
        if (!isTtSurfaceDiagnosticsActive() || !root) return;
        const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
        const summary = target?.closest?.('summary');
        const details = event.type === 'toggle' ? target : summary?.parentElement;
        if (!details?.matches?.('details') || !root.contains(details)) return;
        if (!details.closest('toto[data-rabbit-mirror="true"], toto[data-rabbit-hole="true"], [data-rabbit-mirror-css-scope], [data-rabbit-mirror-external-source="true"], .rabbit-mirror-external-host')) return;
        if (summary && target.closest('button, input, select, textarea, a[href], [contenteditable="true"], [data-rabbit-mirror-tool-entry-host]')) return;
        const id = nodeId(details);
        const pointer = Number.isFinite(event.pointerId) ? event.pointerId : -1;
        let previous = pending.get(pointer);
        let seq;
        if (event.type === 'pointerdown') {
            seq = nextTtSurfaceClickSeq();
            bound(pending, pointer, { seq, node: id });
            previous = null;
        } else if (event.type === 'toggle') {
            seq = recent.get(id) || 0;
        } else {
            seq = previous?.seq || recent.get(id) || nextTtSurfaceClickSeq();
        }
        if (event.type === 'click' || event.type === 'pointercancel') pending.delete(pointer);
        if (seq) bound(recent, id, seq);
        const messageId = Number(details.closest('.mes')?.getAttribute('mesid'));
        session.inputEvents += 1;
        // All arguments are scalars. A new DOM identity is recorded, never restored.
        recordTtSurface(event.type, {
            seq, node: id, mesid: Number.isInteger(messageId) ? messageId : -1,
            pointerId: Number.isFinite(event.pointerId) ? event.pointerId : undefined,
            pointerType: typeof event.pointerType === 'string' ? event.pointerType : undefined,
            detail: Number.isFinite(event.detail) ? event.detail : undefined,
            eventTime: Number.isFinite(event.timeStamp) ? event.timeStamp : undefined,
            phase: 'capture-before-default',
            open: !!details.open, connected: !!details.isConnected,
            sameDetails: previous ? previous.node === id : undefined,
            defaultPrevented: !!event.defaultPrevented,
        });
    };
    const events = ['pointerdown', 'pointerup', 'pointercancel', 'click', 'toggle'];
    registerTtSurfaceCleanup(() => {
        for (const type of events) root?.removeEventListener(type, handler, true);
        pending.clear(); recent.clear(); nodeIds = new WeakMap(); root = null;
    });
    for (const type of events) root.addEventListener(type, handler, { capture: true, passive: true });
}

// Only these two TT controls use pointerup; a drag/cancel must never start diagnostics.
function bindTtDiagnosticTap(button, activate, isAlive) {
    let gesture = null;
    let suppressClick = null;
    const now = () => performance.now();
    const isTouch = event => event.pointerType === 'touch' || event.pointerType === 'pen';
    const usable = () => isAlive() && button.isConnected && !button.disabled;
    const clearGesture = event => {
        if (gesture && gesture.id === event.pointerId) {
            suppressClick = { at: now(), id: gesture.id };
            gesture = null;
        }
    };
    const onDown = event => {
        if (!isTouch(event) || !usable()) return;
        if (event.isPrimary === false) {
            if (gesture) suppressClick = { at: now(), id: gesture.id };
            gesture = null;
            return;
        }
        if (event.button !== 0) return;
        suppressClick = null;
        gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, at: now(), moved: false };
    };
    const onMove = event => {
        if (!gesture || gesture.id !== event.pointerId) return;
        if (Math.abs(event.clientX - gesture.x) > 12 || Math.abs(event.clientY - gesture.y) > 12) gesture.moved = true;
    };
    const onUp = event => {
        if (!isTouch(event) || !gesture || gesture.id !== event.pointerId) return;
        const tap = gesture;
        gesture = null;
        suppressClick = { at: now(), id: tap.id };
        if (!usable() || event.isPrimary === false || tap.moved || now() - tap.at > 900
            || Math.abs(event.clientX - tap.x) > 12 || Math.abs(event.clientY - tap.y) > 12) return;
        // Do not synthesize click or cancel native scrolling. The later click is de-duplicated.
        activate('pointerup');
    };
    const onClick = event => {
        if (!usable()) return;
        // detail=0 is keyboard/accessibility activation, not the compatibility click after a tap.
        if (event.detail !== 0 && suppressClick && now() - suppressClick.at < 1000
            && (!(event.pointerId > 0) || event.pointerId === suppressClick.id)) return;
        suppressClick = null;
        gesture = null;
        activate('click');
    };
    const handlers = { pointerdown: onDown, pointermove: onMove, pointerup: onUp,
        pointercancel: clearGesture, lostpointercapture: clearGesture, click: onClick };
    for (const [type, handler] of Object.entries(handlers)) {
        button.addEventListener(type, handler, { capture: true, passive: true });
    }
    return () => {
        for (const [type, handler] of Object.entries(handlers)) button.removeEventListener(type, handler, true);
        gesture = null;
        suppressClick = null;
    };
}

function ttDiagnosticHostNote(state) {
    if (state?.managed === true && state?.registered === true) return 'ChatSurface 已托管。';
    if (state?.projectionFallback === true) return 'TT 首次投影已关闭注册窗口；兔子镜改为跟随当前可见楼层，设置栏和视口内小剧场仍可用。滚动后新进入画面的楼层会再挂载。';
    if (state?.registrationFailure === 'late-projection') return '兔子镜尝试注册时 TT 的首次聊天投影已开始，已错过注册窗口；反复点击设置不能补注册，具体加载时序请查看 TT 诊断。';
    if (state?.registrationFailure === 'duplicate-participant') return 'TT 检测到重复的兔子镜注册；请仅启用一份正式版或测试版兔子镜后重启。';
    if (state?.registrationFailure === 'host-rejected') return 'TT 拒绝了 ChatSurface 注册，具体原因未公开；不能据此认定已接入或已修复。';
    return '当前未接入 managed ChatSurface；仍可采集触摸和入口状态，缺少挂载记录不能用于排除问题。';
}

function installTtDiagnosticEntry() {
    try { globalThis.__rabbitMirrorTtDiagnosticUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorTtDiagnosticUiCleanup = null;
    const panel = document.getElementById('rabbit_mirror_theater_settings');
    if (!panel) return;
    const start = $(panel.querySelector('#rh_tt_diag_start'));
    const copy = $(panel.querySelector('#rh_tt_diag_copy'));
    const statusText = $(panel.querySelector('#rh_tt_diag_status'));
    const output = $(panel.querySelector('#rh_tt_diag_output'));
    if (!start.length || !copy.length || !statusText.length || !output.length) return;
    const hostState = getRabbitMirrorHostCompatibilityStatus();
    const isTt = !!globalThis.__TAURITAVERN__ || hostState?.host === 'tauritavern';
    // The shared button CSS uses display:... !important; plain .hide() cannot beat it.
    for (const button of [start[0], copy[0]]) {
        button.hidden = !isTt;
        button.style.setProperty('display', isTt ? 'inline-flex' : 'none', 'important');
    }
    if (!isTt) { statusText.hide(); output.hide(); return; }
    let disposed = false;
    let session = null;
    const inputCleanups = [];
    const isAlive = () => !disposed && isCurrentRuntime() && panel.isConnected
        && document.getElementById('rabbit_mirror_theater_settings') === panel;
    const hostNote = ttDiagnosticHostNote(hostState);
    const notify = (kind, text) => { try { globalThis.toastr?.[kind]?.(text); } catch {} };
    const setStatus = text => { if (!disposed) statusText.text(text).show(); };
    const report = () => {
        if (!session) return retainedTtDiagnosticReport;
        const elapsed = Math.max(0, (session.endedAt ?? performance.now()) - session.startedAt);
        const head = [
            'TT 诊断入口：1.5.48-ttentry3',
            `diagnostic-start +0ms | managed=${session.host.managed} | registered=${session.host.registered} | protocolVersion=${session.host.protocolVersion ?? '不可用'}`,
            `入口动作=${session.activation} | chatRootFound=${session.chatRootFound} | pointerEvents=${session.pointerEvents} | 输入事件 ${session.inputEvents} 条`,
            session.host.managed && session.host.registered ? '' : '未接入 managed ChatSurface：挂载分发不可用或未启用；以下报告不代表没有卡顿。',
            session.endedAt !== null ? `diagnostic-stop +${elapsed.toFixed(0)}ms | ${session.stopReason || '自动停止或达到条数上限'}` : '状态：正在采集',
            session.host.errorCode ? `宿主状态：${session.host.errorCode}` : '',
            session.host.registrationFailure ? `注册原因：${session.host.registrationFailure} | ${ttDiagnosticHostNote(session.host)}` : '',
            '没有业务记录不代表没有卡顿；以下为空时，只能确认入口已运行。',
        ].filter(Boolean).join('\n');
        return head + '\n\n' + (session.engineStarted ? buildTtSurfaceReport({ version: RUNTIME_VERSION, ...session.host }) : '采集模块未成功启动。');
    };
    const renderStopped = () => {
        if (!session) return;
        session.endedAt = performance.now();
        retainedTtDiagnosticReport = report();
        if (disposed) return;
        start.text('开始 TT 诊断（20 秒）').prop('disabled', false);
        copy.prop('disabled', false);
        setStatus('TT 诊断已结束，报告已显示，可复制；没有业务事件也会保留入口状态。');
        output.val(retainedTtDiagnosticReport).show();
        if (session.stopReason !== '入口启动异常') notify('success', 'TT 诊断已结束，报告已保留；请点击“复制 TT 诊断”。');
    };
    const startDiagnostic = activation => {
        if (!isAlive()) return;
        if (isTtSurfaceDiagnosticsActive()) {
            if (session) session.stopReason = '手动结束';
            stopTtSurfaceDiagnostics();
            return;
        }
        try {
            const state = getRabbitMirrorHostCompatibilityStatus();
            const chatRoot = document.getElementById('chat');
            session = {
                startedAt: performance.now(), endedAt: null, inputEvents: 0, engineStarted: false, activation,
                chatRootFound: !!chatRoot, pointerEvents: typeof globalThis.PointerEvent === 'function',
                host: { managed: state?.managed === true, registered: state?.registered === true,
                    protocolVersion: Number.isFinite(state?.protocolVersion) ? state.protocolVersion : null,
                    errorCode: String(state?.errorCode || '').slice(0, 48),
                    registrationFailure: ['late-projection', 'duplicate-participant', 'host-rejected'].includes(state?.registrationFailure) ? state.registrationFailure : '' },
            };
            retainedTtDiagnosticReport = '';
            output.val('').hide();
            startTtSurfaceDiagnostics({ onStateChange: active => {
                if (active) {
                    session.engineStarted = true;
                    recordTtSurface('diagnostic-start', { managed: session.host.managed, registered: session.host.registered, protocolVersion: session.host.protocolVersion });
                } else renderStopped();
            } });
            captureTtDiagnosticInputs(chatRoot, session);
            start.text('结束 TT 诊断（20 秒自动停止）').prop('disabled', false);
            copy.prop('disabled', false);
            setStatus(chatRoot ? `TT 诊断已开始（入口修复3）。请收起设置，在 20 秒内复现问题。${ttDiagnosticHostNote(session.host)}` : 'TT 诊断已开始，但未找到聊天窗口；请进入聊天后重新采集。');
            notify('info', 'TT 诊断已开始，请在 20 秒内复现滚动卡顿或点不开。');
        } catch {
            if (session) session.stopReason = '入口启动异常';
            try { stopTtSurfaceDiagnostics(); } catch {}
            if (session) { session.endedAt = performance.now(); retainedTtDiagnosticReport = report(); }
            start.text('开始 TT 诊断（20 秒）').prop('disabled', false);
            copy.prop('disabled', false);
            output.val(retainedTtDiagnosticReport || 'TT 诊断入口启动失败，未进行采集。').show();
            setStatus('TT 诊断启动失败，已显示入口报告；请复制反馈，不需要重新生成兔子镜。');
            notify('error', 'TT 诊断未正常启动，请复制下方入口报告。');
        }
    };
    const copyDiagnostic = async () => {
        if (!isAlive()) return;
        if (isTtSurfaceDiagnosticsActive()) {
            if (session) session.stopReason = '复制前结束';
            stopTtSurfaceDiagnostics();
        }
        const text = report();
        if (!text) {
            setStatus('还没有 TT 诊断报告，请先点击“开始 TT 诊断”并复现问题。');
            notify('warning', '还没有 TT 诊断报告，请先开始诊断。');
            return;
        }
        output.val(text).show();
        try {
            if (typeof navigator.clipboard?.writeText !== 'function') throw new Error('clipboard-unavailable');
            await navigator.clipboard.writeText(text);
            if (isAlive()) { setStatus('TT 诊断已复制。'); notify('success', '已复制 TT ChatSurface 诊断'); }
        } catch {
            if (!isAlive()) return;
            const textarea = output[0];
            let copied = false;
            try {
                textarea?.focus?.({ preventScroll: true }); textarea?.select?.();
                textarea?.setSelectionRange?.(0, text.length);
                copied = document.execCommand?.('copy') === true;
            } catch {}
            setStatus(copied ? 'TT 诊断已复制。' : '自动复制未成功：报告已显示，请长按下方文本全选复制。');
            notify(copied ? 'success' : 'warning', copied ? '已复制 TT ChatSurface 诊断' : '自动复制未成功，请长按下方报告手动复制。');
        }
    };
    start.off('.rmTtDiag'); copy.off('.rmTtDiag');
    inputCleanups.push(bindTtDiagnosticTap(start[0], startDiagnostic, isAlive));
    inputCleanups.push(bindTtDiagnosticTap(copy[0], copyDiagnostic, isAlive));
    start.text('开始 TT 诊断（20 秒）').prop('disabled', false);
    copy.prop('disabled', false);
    setStatus(`TT 入口修复3 · 已就绪。${hostNote}`
        + (retainedTtDiagnosticReport ? ' 已保留上次报告。' : ' 手动开启后采集 20 秒，不发模型请求。'));
    if (retainedTtDiagnosticReport) output.val(retainedTtDiagnosticReport).show();
    const cleanup = () => {
        if (disposed) return;
        disposed = true;
        if (session) session.stopReason = '设置界面卸载';
        try { stopTtSurfaceDiagnostics(); } catch {}
        for (const dispose of inputCleanups.splice(0)) dispose();
        start.off('.rmTtDiag'); copy.off('.rmTtDiag');
        if (globalThis.__rabbitMirrorTtDiagnosticUiCleanup === cleanup) globalThis.__rabbitMirrorTtDiagnosticUiCleanup = null;
    };
    globalThis.__rabbitMirrorTtDiagnosticUiCleanup = cleanup;
}

export function initRabbitMirrorUI() {
    if (!isCurrentRuntime()) return;
    const finishUiInit = globalThis.__rabbitMirrorPerfDiag?.begin?.('ui.initCall', { retry: uiMountRetryCount }, 0);
    const settings = getSettings();
    const noSendRegex = '/<toto\\b[^>]*>[\\s\\S]*?<\\/toto>\\s*/gi';
    const existing = $('#rabbit_mirror_theater_settings');
    if (existing.length) {
        const currentPanels = existing.filter(`[data-rabbit-mirror-ui-version="${SETTINGS_UI_VERSION}"][data-rabbit-mirror-runtime-version="${RUNTIME_VERSION}"]`)
            .filter((_, panel) => {
                const $panel = $(panel);
                const $advanced = $('body > #rh_advanced_modal');
                const $worldPrompt = $('body > #rh_world_info_prompt_modal');
                const $tagFilter = $('body > #rh_independent_tag_filter_modal');
                return $panel.attr('data-rabbit-mirror-ui-ready') === 'true'
                    && $advanced.length === 1
                    && $worldPrompt.length === 1
                    && $tagFilter.length === 1
                    && $panel.find('#rh_enabled').length === 1
                    && $panel.find('#rh_advanced_open').length === 1
                    && $panel.find('#rh_independent_advanced_open').length === 1
                    && $panel.find('.rabbit-mirror-primary-row').length === 1
                    && $panel.find('#rh_token_meter > summary').length === 1
                    && $panel.find('#rh_token_meter #rh_independent_api_diagnostic').length === 1
                    && $panel.find('#rh_independent_api_section #rh_independent_api_diagnostic').length === 0
                    && $panel.find('#rh_external_diag_status').length === 1
                    && $panel.find('#rh_external_diag_start').length === 1
                    && $panel.find('#rh_external_diag_stop').length === 1
                    && $panel.find('#rh_external_diag_report').length === 1
                    && $panel.find('#rh_external_diag_copy').length === 1
                    && $panel.find('#rh_external_diag_reset').length === 1
                    && $panel.find('#rh_external_diag_output').length === 1
                    && $panel.find('#rh_blacklist_enabled').length
                    && $panel.find('#rh_favorite_summary').length
                    && $advanced.find('#rh_feedback_cat').length
                    && $advanced.find('#rh_maintenance_rabbit').length
                    && $advanced.find('#rh_enhanced_visual_drawing').length === 1
                    && $advanced.find('#rh_enhanced_visual_drawing_help').length === 1
                    && $advanced.find('#rh_advanced_page_generation #rh_multiface_enabled').length === 1
                    && $advanced.find('#rh_advanced_page_generation #rh_multiface_count').length === 1
                    && $advanced.find('#rh_advanced_page_generation #rh_enhanced_visual_drawing').length === 1
                    && $advanced.find('#rh_visual_extra_prompt').length
                    && $advanced.find('#rh_visual_avoid_prompt').length
                    && $advanced.find('#rh_visual_prompt_save').length
                    && $advanced.find('#rh_appearance_reference_save').length
                    && $advanced.find('#rh_worldview_lock').length
                    && $advanced.find('#rh_advanced_back_top').length
                    && $advanced.find('#rh_advanced_page_worldinfo').length
                    && $advanced.find('#rh_independent_context_layers').length
                    && $advanced.find('#rh_independent_include_character_summary').length
                    && $advanced.find('#rh_independent_include_persona_summary').length
                    && $advanced.find('#rh_independent_tag_filter_open').length
                    && $advanced.find('#rh_independent_read_global_world_info').length
                    && $advanced.find('#rh_world_info_book_filters').length
                    && $advanced.find('#rh_world_info_books_fetch').length
                    && $advanced.find('#rh_world_info_all_book_filters').length
                    && $panel.find('#rh_independent_api_section').length
                    && $worldPrompt.find('#rh_world_info_prompt_close').length
                    && $worldPrompt.find('#rh_world_info_prompt_enable').length
                    && $worldPrompt.find('#rh_world_info_prompt_disable').length
                    && $tagFilter.find('#rh_independent_tag_filter_scan').length
                    && $tagFilter.find('#rh_independent_tag_filter_save').length;
            });
        if (existing.length === 1 && currentPanels.length === 1) { finishUiInit?.({ outcome: 'already-mounted' }); return; }
        // A hot reload may leave the old settings DOM alive even after manifest.json has updated.
        // Remove every stale/duplicate panel so the claimed runtime becomes the only UI owner.
        try { globalThis.__rabbitMirrorTagFilterScanUiCleanup?.(); } catch {}
        globalThis.__rabbitMirrorTagFilterScanUiCleanup = null;
        try { globalThis.__rabbitMirrorTtDiagnosticUiCleanup?.(); } catch {}
        existing.remove();
        $('body > #rh_advanced_modal, body > #rh_world_info_prompt_modal, body > #rh_independent_tag_filter_modal').remove();
    }

    // All paths below mount a new UI owner, including rebuilds without destroy.
    // Invalidate old responses here; they must not unlock a later request.
    memoryWorldBookDirectorySequence += 1;
    memoryWorldBookDirectoryBusy = false;
    const settingsMount = $('#extensions_settings2');
    if (!settingsMount.length) {
        scheduleUiMountRetry();
        finishUiInit?.({ outcome: 'mount-missing' });
        return;
    }
    uiMountRetryCount = 0;

    const html = `
<div id="rabbit_mirror_theater_settings" class="rabbit-mirror-settings" data-rabbit-mirror-ui-version="${SETTINGS_UI_VERSION}" data-rabbit-mirror-runtime-version="${RUNTIME_VERSION}" data-rabbit-mirror-ui-ready="false">
  <div class="inline-drawer">
    <div class="inline-drawer-toggle inline-drawer-header rabbit-mirror-drawer-header">
      <b>兔子镜小剧场</b><span class="rabbit-mirror-toto-watermark">TOTOv1.5.48</span>
      <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
    </div>
    <div class="inline-drawer-content">
      <div class="rabbit-mirror-primary-toggle">
        <div class="rabbit-mirror-primary-row">
          <label class="checkbox_label rabbit-mirror-enable-control">
            <input id="rh_enabled" type="checkbox">
            <span class="rabbit-mirror-enable-copy"><b>兔子镜自动注入</b><small>随回复生成；首次使用请配置不发送正则。</small></span>
          </label>
          <button id="rh_advanced_open" class="menu_button rabbit-mirror-advanced-launch" type="button" aria-haspopup="dialog" aria-controls="rh_advanced_modal">高级设置</button>
        </div>
      </div>

      <div class="rabbit-mirror-help-update-row">
        <details id="rh_quick_start" class="rabbit-mirror-quick-start">
          <summary>新手指引</summary>
          <div class="rabbit-mirror-quick-start-body" role="region" aria-label="新手指引"><p role="status">展开后加载使用指引，不会修改设置。</p></div>
        </details>
        <button id="rh_update_now" class="menu_button rabbit-mirror-update-button" type="button">检查并更新</button>
      </div>
      <div id="rh_update_status" class="rabbit-mirror-update-status" role="status" aria-live="polite" hidden></div>
      <button id="rh_update_reload" class="menu_button" type="button" hidden>刷新并加载已安装版本</button>

      <details id="rh_token_meter" class="rabbit-mirror-token-meter" aria-live="polite">
        <summary class="rabbit-mirror-token-meter-head">
          <span class="rabbit-mirror-token-meter-label">Prompt 估算</span>
          <span data-rh-token-meter-main>尚无生成记录</span>
        </summary>
        <div class="rabbit-mirror-token-meter-body">
          <div data-rh-token-meter-exact class="rabbit-mirror-token-meter-exact">下一轮生成后更新。</div>
          <div data-rh-token-meter-detail class="rabbit-mirror-token-meter-detail">只统计兔子镜自己的 Prompt。</div>
          <div id="rh_independent_api_diagnostic" style="padding:7px 9px;border-left:2px solid color-mix(in srgb, var(--SmartThemeBorderColor) 65%, transparent);opacity:.78;font-size:11px;line-height:1.5;word-break:break-word;">最近请求：暂无记录</div>
          <div class="rabbit-mirror-token-meter-note">仅为本地 Prompt 估算，不是服务商账单 Token；记录在请求发送前生成。</div>
        </div>
      </details>

      <details class="rabbit-mirror-section">
        <summary><span>生成方式</span><span class="rabbit-mirror-section-note">跟随 / 独立</span></summary>
        <div class="rabbit-mirror-section-content">
          <label class="checkbox_label"><input name="rh_generation_source" id="rh_generation_follow" type="radio" value="follow"> 跟随当前 API</label>
          <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.72;font-size:12px;line-height:1.45;">跟着当前回复一起生成兔子镜。</div>
          <div id="rh_follow_display_row" style="margin-left:26px;padding:7px 10px;border-left:2px solid color-mix(in srgb, var(--SmartThemeBorderColor) 60%, transparent);">
            <label><input name="rh_follow_display" type="radio" value="inline"> 正文下方</label>
            <label style="margin-left:14px;"><input name="rh_follow_display" type="radio" value="external"> 外置弹窗</label>
            <div id="rh_follow_regex_helper" style="margin-top:9px;padding-top:8px;border-top:1px solid color-mix(in srgb,currentColor 12%,transparent);">
              <div data-rh-no-send-regex-status style="font-size:11px;line-height:1.45;opacity:.78;">不发送兔子镜正则：正在检测…</div>
              <div class="flex-container" style="gap:7px;flex-wrap:wrap;margin-top:6px;">
                <button class="menu_button rh_regex_configure" type="button">一键配置正则</button>
                <button class="menu_button rh_regex_open" type="button">查看酒馆正则</button>
              </div>
            </div>
          </div>
          <label class="checkbox_label" style="margin-top:12px;"><input name="rh_generation_source" id="rh_generation_independent" type="radio" value="independent"> 使用独立 API</label>
          <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.72;font-size:12px;line-height:1.45;">正文先生成，回复结束后再用独立 API 单独生成兔子镜；具体配置在下面的独立分区。</div>
        </div>
      </details>

      <details class="rabbit-mirror-section" id="rh_independent_api_section">
        <summary><span>独立 API</span><span class="rabbit-mirror-section-note">连接 · 模型 · 显示</span></summary>
        <div class="rabbit-mirror-section-content">
          <div id="rh_independent_mode_status" aria-live="polite" style="padding:7px 9px;border-left:2px solid color-mix(in srgb,var(--SmartThemeBorderColor) 65%,transparent);opacity:.78;font-size:11px;line-height:1.45;">正在读取当前生成模式……</div>
          <details id="rh_behavior_rules" style="margin:12px 0;min-width:0;border:2px solid var(--SmartThemeQuoteColor,currentColor);border-radius:10px;background:color-mix(in srgb,var(--SmartThemeQuoteColor,currentColor) 7%,transparent);">
            <summary id="rh_behavior_rule_heading" style="cursor:pointer;padding:13px 14px;font-size:16px;font-weight:700;">补充创作规则 · 独立 API</summary>
            <div style="padding:0 14px 14px;">
              <label for="rh_behavior_rule_mode" style="display:block;font-weight:700;margin:8px 0;">注入方式</label>
              <select id="rh_behavior_rule_mode" class="text_pole" style="width:100%;max-width:100%;box-sizing:border-box;min-height:44px;">
                <option value="always">每轮注入</option><option value="off">不注入</option><option value="adult-only">仅在抽到成人内容时注入</option>
              </select>
              <label for="rh_behavior_rule_text" style="display:block;font-weight:700;margin:8px 0;">补充规则完整内容（可编辑或留空）</label>
              <textarea id="rh_behavior_rule_text" class="text_pole" rows="10" maxlength="${BEHAVIOR_RULE_MAX_CHARS}" spellcheck="false" aria-describedby="rh_behavior_rule_help" style="width:100%;max-width:100%;min-height:200px;box-sizing:border-box;resize:vertical;font-size:14px;line-height:1.6;"></textarea>
              <div id="rh_behavior_rule_help" style="font-size:12px;line-height:1.6;">仅作用于独立 API，不改变正文连接。</div>
              <div class="flex-container" style="gap:8px;flex-wrap:wrap;margin:10px 0;">
                <button id="rh_behavior_rule_save" class="menu_button" type="button" style="min-height:44px;font-weight:700;">保存创作规则</button>
                <button id="rh_behavior_rule_clear" class="menu_button" type="button" style="min-height:44px;">清空内容</button>
                <button id="rh_behavior_rule_reset" class="menu_button" type="button" style="min-height:44px;">恢复默认</button>
              </div>
              <div id="rh_behavior_rule_status" role="status" aria-live="polite" style="font-size:13px;line-height:1.6;"></div>
            </div>
          </details>
          <div id="rh_independent_api_fields" style="display:grid;gap:9px;">
            <div style="padding:10px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:10px;">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">独立 API 生成方式</div>
            <div id="rh_independent_display_row" class="flex-container" style="gap:14px;flex-wrap:wrap;align-items:center;">
              <label><input name="rh_independent_display" type="radio" value="external"> ① 轻壳外置（标题有壳）</label>
              <label><input name="rh_independent_display" type="radio" value="external_then_inline"> ② 外置后内嵌</label>
            </div>
              <div style="opacity:.66;font-size:11px;line-height:1.45;margin-top:6px;">只决定副 API 成品显示在哪里，不改变提示词、美化规则或模型。</div>
            </div>
            <div style="padding:9px 10px;border:1px solid color-mix(in srgb, currentColor 16%, transparent);border-radius:9px;">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">连接与模型</div>
              <div class="flex-container" style="gap:7px;flex-wrap:wrap;align-items:center;">
                <button id="rh_independent_import_current" class="menu_button" type="button" style="font-weight:700;">从酒馆当前连接一键配置</button>
                <span id="rh_independent_connection_status" style="opacity:.72;font-size:11px;line-height:1.4;">尚未配置</span>
              </div>
              <div style="opacity:.78;font-size:11px;line-height:1.45;margin-top:5px;">仅“酒馆 Connection Profile 一键配置”需要 SillyTavern 1.18.0 及以上版本；旧版仍可使用兔子镜及下方“手动 OpenAI 兼容接口”。</div>
              <button id="rh_independent_models" class="menu_button" type="button" style="margin-top:8px;">从此酒馆连接拉取模型</button>
            </div>
            <div class="flex-container" style="gap:7px;flex-wrap:wrap;">
              <button id="rh_independent_test" class="menu_button" type="button">测试连接</button>
            </div>
            <select id="rh_independent_model_select" class="text_pole" aria-label="已拉取模型列表">
              <option value="">请从酒馆连接或手动接口拉取模型</option>
            </select>
            <input id="rh_independent_model" class="text_pole" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="模型 ID；可从上方完整列表选择，也可直接手动填写">
            <div id="rh_independent_model_list_source" aria-live="polite" style="opacity:.7;font-size:11px;line-height:1.45;">模型列表尚未拉取。列表来源与当前实际模型会分别标明。</div>
            <details id="rh_independent_manual_legacy" style="margin-top:2px;">
              <summary style="cursor:pointer;font-size:11px;opacity:.7;">高级：手动 OpenAI 兼容接口（旧配置兼容）</summary>
              <div style="display:grid;gap:6px;padding-top:7px;">
                <input id="rh_independent_base" class="text_pole" type="text" inputmode="url" autocapitalize="off" spellcheck="false" placeholder="API 地址">
                <input id="rh_independent_key" class="text_pole" type="password" autocomplete="off" placeholder="API Key">
                <div class="flex-container" style="gap:7px;flex-wrap:wrap;">
                  <button id="rh_independent_manual_models" class="menu_button" type="button">从此手动接口拉取模型</button>
                  <button id="rh_independent_use_manual" class="menu_button" type="button">改用这组手动接口</button>
                </div>
              </div>
            </details>
            <div class="flex-container" style="gap:8px;flex-wrap:wrap;align-items:center;padding:9px 10px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:9px;">
              <label>温度 <input id="rh_independent_temperature" class="text_pole" type="number" min="0" max="2" step="0.1" style="width:82px;"></label>
              <label>整批最大输出 <input id="rh_independent_max_tokens" class="text_pole" type="number" min="512" max="32000" step="256" style="width:110px;"></label>
            </div>
            <div class="rabbit-mirror-independent-advanced-row">
              <details id="rh_independent_request_advanced" class="rabbit-mirror-request-options">
                <summary>高级生成参数 <span>排除参数 · 推理强度</span></summary>
                <div class="rabbit-mirror-request-options-body">
                  <label class="rabbit-mirror-request-enable"><input id="rh_independent_advanced_enabled" type="checkbox"> 启用高级生成参数</label>
                  <p id="rh_independent_advanced_help">仅作用于兔子镜独立 API。默认关闭，不改变原请求；关闭时可保存草稿，但不会发送。参数是否被模型支持，取决于你的接口。</p>
                  <label for="rh_independent_reasoning_effort">推理强度（reasoning_effort）</label>
                  <select id="rh_independent_reasoning_effort" class="text_pole" aria-describedby="rh_independent_advanced_help">
                    <option value="">默认：不覆盖</option><option value="none">关闭推理 · none</option>
                    <option value="minimal">最低 · minimal</option><option value="low">低 · low</option>
                    <option value="medium">中 · medium</option><option value="high">高 · high</option>
                    <option value="xhigh">极高 · xhigh</option><option value="max">最大 · max</option>
                  </select>
                  <fieldset id="rh_independent_excluded_params" aria-describedby="rh_independent_excluded_help">
                    <legend>排除参数（勾选 = 不发送）</legend>
                    <p id="rh_independent_excluded_help">从请求中移除这些字段，不是设为 0。取消勾选恢复原请求逻辑，不改正文连接的设置；推理强度单独保留。</p>
                    <div class="rabbit-mirror-exclusion-grid">
                      ${[
                          ['temperature', '温度'], ['frequency_penalty', '频率惩罚'],
                          ['presence_penalty', '存在惩罚'], ['top_p', 'Top P'],
                          ['top_k', 'Top K'], ['seed', '种子'], ['min_p', 'Min P'],
                          ['top_a', 'Top A'], ['typical_p', 'Typical P'], ['repetition_penalty', '重复惩罚'],
                      ].map(([field, label]) => `<label class="rabbit-mirror-request-enable"><input type="checkbox" name="rh_independent_excluded_param" value="${field}" data-rh-exclude-param="${field}"><span>${label}<small>${field}</small></span></label>`).join('')}
                    </div>
                    <div class="rabbit-mirror-request-options-actions">
                      <button id="rh_independent_exclude_common" class="menu_button" type="button">选中常用四项</button>
                      <button id="rh_independent_exclude_none" class="menu_button" type="button">取消所有排除</button>
                    </div>
                    <p>常用四项：温度、频率惩罚、存在惩罚、Top P。选好后点击下方“保存高级参数”。排除优先于下方合法 JSON 中的同名参数，保留编辑框内容。</p>
                  </fieldset>
                  <label for="rh_independent_extra_params">附加生成参数（JSON 对象，可留空）</label>
                  <textarea id="rh_independent_extra_params" class="text_pole" rows="5" maxlength="8192" autocapitalize="off" autocomplete="off" spellcheck="false" aria-describedby="rh_independent_extra_help rh_independent_advanced_error" placeholder='例如：{"top_p": 0.9, "seed": 42}'></textarea>
                  <div id="rh_independent_advanced_error" role="alert" aria-live="polite" hidden></div>
                  <p id="rh_independent_extra_help">支持 reasoning_effort、top_p、min_p、top_a、typical_p、top_k、frequency_penalty、presence_penalty、repetition_penalty、seed、verbosity。只接受这些生成参数，不接受对象／数组、模型、消息、密钥或网络设置；JSON 中的推理强度不能与上方选择冲突。</p>
                  <p>参数范围：top_p / min_p / top_a / typical_p 为 0–1；top_k 为 0–1000000 的整数；frequency_penalty / presence_penalty 为 −2–2；repetition_penalty 大于 0 且不超过 10；seed 为安全整数；verbosity 为 low / medium / high。你的模型可能只支持其中一部分。</p>
                  <p>当前支持手动 OpenAI 兼容接口，以及自定义 Chat Completions 类型的连接 Profile。其它连接或协议不支持这条直传路径时，将在发送前提示；不会自动切换连接或重试。TT 的宿主权限仍可能限制透传。</p>
                  <div class="rabbit-mirror-request-options-actions">
                    <button id="rh_independent_advanced_save" class="menu_button" type="button">保存高级参数</button>
                    <button id="rh_independent_extra_clear" class="menu_button" type="button">清空附加参数</button>
                    <button id="rh_independent_advanced_reset" class="menu_button" type="button">恢复默认</button>
                  </div>
                  <div id="rh_independent_advanced_status" role="status" aria-live="polite"></div>
                </div>
              </details>
            </div>
            <div class="rabbit-mirror-independent-advanced-row">
              <div class="rabbit-mirror-independent-advanced-copy"><b>读取内容与隐私</b><span>聊天层数、角色卡 / Persona、世界书与正文标签过滤</span></div>
              <button id="rh_independent_advanced_open" class="menu_button" type="button">管理读取内容</button>
            </div>
            <div style="opacity:.72;font-size:11px;line-height:1.45;">温度建议 <b>1.0</b>。</div>
            <div style="opacity:.66;font-size:11px;line-height:1.45;">一键配置时不保存 API Key；旧手动模式仍按原逻辑保存在当前 SillyTavern 扩展设置里。</div>
          </div>
        </div>
      </details>

      <details class="rabbit-mirror-section rabbit-mirror-tools">
        <summary><span>工具与维护</span><span class="rabbit-mirror-section-note">正则 · 诊断 · 重置</span></summary>
        <div class="rabbit-mirror-section-content">
          <div class="rabbit-mirror-regex-helper">
            <div style="font-weight:600;margin-bottom:6px;">不发送兔子镜正则</div>
            <div data-rh-no-send-regex-status style="opacity:.82;font-size:12px;margin-bottom:8px;">正在检测酒馆 Regex 配置…</div>
            <div class="flex-container" style="gap:7px;flex-wrap:wrap;">
              <button class="menu_button rh_regex_configure" type="button">一键配置正则</button>
              <button class="menu_button rh_regex_open" type="button">查看酒馆正则</button>
              <button id="rh_copy_regex" class="menu_button" type="button">复制推荐正则</button>
            </div>
          </div>
          <div class="rabbit-mirror-regex-helper" style="margin-top:10px;">
            <div style="font-weight:600;margin-bottom:6px;">禁词表（本地过滤）</div>
            <div style="opacity:.76;font-size:12px;line-height:1.5;margin-bottom:7px;">一行一条：原词 =&gt; 替换词。只填原词或右边留空就是删除。使用本地字面匹配，不执行输入的正则表达式；只改兔子镜文字，不改正文或代码，不占 Prompt / Token。</div>
            <label for="rh_banned_words">替换规则</label>
            <textarea id="rh_banned_words" class="text_pole" spellcheck="false" style="width:100%;min-height:180px;resize:vertical;box-sizing:border-box;" placeholder="旧称呼 => 新称呼\n要删除的词"></textarea>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
              <label style="min-width:0;">查找原文<input id="rh_replacement_find" class="text_pole" type="text" maxlength="80" style="width:100%;min-width:0;max-width:100%;box-sizing:border-box;" /></label>
              <label style="min-width:0;">替换为（留空删除）<input id="rh_replacement_value" class="text_pole" type="text" maxlength="240" style="width:100%;min-width:0;max-width:100%;box-sizing:border-box;" /></label>
            </div>
            <button id="rh_replacement_add" class="menu_button" type="button">添加到规则列表</button>
            <div class="flex-container" style="gap:7px;align-items:center;flex-wrap:wrap;margin-top:7px;">
              <button id="rh_banned_words_save" class="menu_button" type="button">保存禁词表</button>
              <span id="rh_banned_words_status" style="font-size:11px;opacity:.72;"></span>
            </div>
          </div>
          <div class="rabbit-mirror-actions">
            <button id="rh_clear_last" class="menu_button">清除抽签历史与冷却记录</button>
            <button id="rh_clear_injection" class="menu_button">清空当前注入</button>
            <button id="rh_reset" class="menu_button">恢复默认设置</button>
          </div>
          <div id="rh_external_library_actions" style="padding:10px 11px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:10px;">
            <div style="font-weight:700;">把你的文字、玩法或世界书加入母本库</div>
            <div style="font-size:12px;line-height:1.5;margin-top:4px;">不会进入兔子镜内置，感谢各位制作小剧场的老师，请征求作者同意后使用。</div>
            <div class="rh-library-quick-actions">
              <button id="rh_external_plain_open" class="menu_button" type="button">粘贴文字</button>
              <button id="rh_external_file_open" class="menu_button" type="button">导入文件（TXT / MD / JSON）</button>
              <button id="rh_external_transfer_open" class="menu_button" type="button">换设备：导出／导入整库</button>
              <button id="rh_external_worldbook_open" class="menu_button" type="button">管理母本库</button>
            </div>
            <div style="font-size:12px;line-height:1.6;margin-top:8px;">首次导入：填写文字或选择文件 → 确认分类 → 保存 → 启用库并打开外部抽签。换设备：旧设备导出整库文件，再到新设备导入。</div>
          </div>
          <div style="margin-top:12px;padding:10px 11px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:10px;">
            <div style="font-weight:700;">🛰 外部代码／宿主性能诊断（测试版）</div>
            <div style="opacity:.74;font-size:11px;line-height:1.5;margin-top:4px;">只诊断 <b>SillyTavern 本体、其他扩展、浏览器主线程和网络</b>：聊天为什么空白、发送为什么迟滞、AI 请求何时真正发出、维修兔点击后是否被外部脚本/网络阻塞。<br><b>不读取兔子镜内部生成或维修状态。</b> 兔子镜内部问题仍请使用对应兔子镜里的「📋 生成全链路诊断」，两份报告互不合并。</div>
            <div id="rh_external_diag_status" style="margin-top:7px;opacity:.82;font-size:11px;line-height:1.45;">默认关闭（零常驻监听）；需要复现问题时再手动开启。</div>
            <div class="flex-container" style="gap:7px;flex-wrap:wrap;margin-top:8px;">
              <button id="rh_external_diag_start" class="menu_button" type="button" style="font-weight:700;">开始新诊断</button>
              <button id="rh_external_diag_stop" class="menu_button" type="button">结束并生成报告</button>
              <button id="rh_external_diag_report" class="menu_button" type="button" style="font-weight:700;">查看当前／最后报告</button>
              <button id="rh_external_diag_copy" class="menu_button" type="button">复制外部报告</button>
                <button id="rh_tt_diag_start" class="menu_button" type="button" hidden style="display:none!important;min-height:44px;">开始 TT 诊断（20 秒）</button>
                <button id="rh_tt_diag_copy" class="menu_button" type="button" hidden style="display:none!important;min-height:44px;">复制 TT 诊断</button>
              <button id="rh_external_diag_reset" class="menu_button" type="button">清空外部记录</button>
            </div>
            <div id="rh_tt_diag_status" role="status" style="display:none;margin-top:7px;opacity:.82;font-size:11px;line-height:1.45;"></div>
            <textarea id="rh_tt_diag_output" class="text_pole" aria-label="TT 诊断报告" readonly spellcheck="false" style="display:none;width:100%;min-height:220px;max-height:50vh;resize:vertical;box-sizing:border-box;margin-top:8px;font:11px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;user-select:text;-webkit-user-select:text;"></textarea>
            <textarea id="rh_external_diag_output" class="text_pole" readonly spellcheck="false" style="display:none;width:100%;min-height:240px;resize:vertical;box-sizing:border-box;margin-top:8px;font:11px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;"></textarea>
          </div>
        </div>
      </details>

      <details id="rh_random_preference_section" class="rabbit-mirror-section">
        <summary><span>收藏与黑名单</span><span class="rabbit-mirror-section-note">随机偏好</span></summary>
        <div class="rabbit-mirror-section-content">
          <div style="padding-bottom:10px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);">
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_blacklist_enabled" type="checkbox"> 🚫 启用抽签黑名单</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 7px 26px;opacity:.76;font-size:12px;line-height:1.5;">加入黑名单后，从下一轮随机抽取开始直接从候选池排除；不增加 Token。明确点菜和固定动态视觉场景仍可覆盖随机黑名单。</div>
            <div id="rh_blacklist_summary" class="rabbit-mirror-blacklist-summary" style="padding:8px 9px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:8px;font-size:11px;line-height:1.45;"><div style="opacity:.6;">展开后显示黑名单。</div></div>
            <button id="rh_blacklist_clear" class="menu_button" type="button" style="margin-top:7px;">清空全部黑名单</button>
          </div>
          <div style="margin-top:11px;">
            <div style="font-weight:700;margin-bottom:6px;">⭐ 收藏室</div>
            <div id="rh_favorite_summary" style="padding:8px 9px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:8px;font-size:11px;line-height:1.45;"><div style="opacity:.6;">展开后显示收藏室。</div></div>
            <button id="rh_favorite_clear" class="menu_button" type="button" style="margin-top:7px;">清空全部收藏</button>
          </div>
        </div>
      </details>

      <div id="rh_advanced_modal" class="rabbit-mirror-advanced-modal" role="dialog" aria-modal="true" aria-label="兔子镜高级设置" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:2147483000;background:rgba(8,10,14,.62);box-sizing:border-box;padding-top:max(24px,calc(env(safe-area-inset-top) + 14px));padding-right:max(12px,calc(env(safe-area-inset-right) + 8px));padding-bottom:max(24px,calc(env(safe-area-inset-bottom) + 14px));padding-left:max(12px,calc(env(safe-area-inset-left) + 8px));align-items:center;justify-content:center;overflow:hidden;pointer-events:auto;">
        <div id="rh_advanced_modal_card" style="width:min(760px,calc(100vw - 24px));max-width:100%;max-height:88vh;max-height:calc(100dvh - 76px - env(safe-area-inset-top) - env(safe-area-inset-bottom));display:flex;flex-direction:column;min-height:0;overflow:hidden;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);box-sizing:border-box;pointer-events:auto;">
          <div id="rh_advanced_modal_header" style="display:grid;grid-template-columns:auto minmax(0,1fr) 40px;align-items:center;gap:8px;flex:0 0 auto;padding:11px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);background:var(--SmartThemeBlurTintColor,#202226);">
            <button id="rh_advanced_back_top" class="menu_button" type="button" aria-label="返回高级选项" title="返回高级选项" style="display:none;min-width:84px;height:38px;padding:0 10px;border-radius:12px;font-size:12px;line-height:1;">← 高级选项</button>
            <div style="min-width:0;text-align:left;"><b id="rh_advanced_modal_title" style="font-size:15px;">高级设置</b><div id="rh_advanced_modal_hint" style="opacity:.65;font-size:11px;line-height:1.35;margin-top:2px;white-space:normal;">选择要调整的项目</div></div>
            <button id="rh_advanced_close" class="menu_button" type="button" aria-label="关闭高级设置" title="关闭" style="width:38px;min-width:38px;height:38px;padding:0;border-radius:12px;font-size:20px;line-height:1;">×</button>
          </div>
          <div id="rh_advanced_scroll" style="flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;padding:14px 14px max(18px,env(safe-area-inset-bottom));box-sizing:border-box;">
          <div id="rh_advanced_menu" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:9px;">
            <button class="menu_button rh-advanced-choice" type="button" data-page="generation" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🎛️ 生成与抽取</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">抽取模式、参考内容、世界观锁与冷却</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="visual" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🎨 个性化视觉提示词</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">额外视觉偏好、避雷与通用视觉规则</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="memory" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🧠 共同回忆资料来源</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">记忆插件接口／绑定记忆世界书</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="worldinfo" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🔌 独立 API</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">补充创作规则、读取范围、世界书与正文标签</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="repair" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🐈‍⬛🐇 挨打猫与维修兔</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">美化反馈、维修兔与自动巡逻</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="external" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">📚 母本库：导入与备份</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">粘贴文字、导入文件、换设备</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="replacement" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;">🚫 禁词与文字替换</button>
          </div>

          <div id="rh_advanced_page_external" class="rh-advanced-page" data-title="母本库：导入与备份" style="display:none;">
            <div style="font-size:12px;line-height:1.6;margin-bottom:10px;">想加入自己的小剧场，或把已导入的库带到另一台设备？都从这里操作；不导入也能直接使用兔子镜。</div>
            <div style="display:grid;gap:7px;margin-bottom:10px;font-size:12px;line-height:1.55;">
              <div><b>粘贴文字：</b>填名称、贴文字 → 读取并确认分类。主题是“演什么”，展现形式是“怎么玩” → 保存，无需转成 JSON。</div>
              <div><b>导入文件：</b>选择 TXT / MD / JSON 或世界书文件 → 读取 → 确认分类 → 保存；兔子镜整库备份会自动进入导入确认。</div>
              <div><b>换设备：</b>旧设备导出整库备份 → 把文件传到新设备 → 新设备导入 → 核对并确认保存。</div>
              <div><b>启用方式：</b>新导入的库默认停用。保存后请在“管理母本库”启用新库，并打开“外部母本参与抽签”。同编号的已有库会跳过、不覆盖，抽签总开关也不会自动替你打开。</div>
            </div>
          </div>
          <div id="rh_advanced_page_replacement" class="rh-advanced-page" data-title="🚫 禁词与文字替换" style="display:none;"></div>
          <div id="rh_advanced_page_generation" class="rh-advanced-page" data-title="生成与抽取" style="display:none;">
            <label for="rh_multiface_enabled" class="checkbox_label"><input id="rh_multiface_enabled" type="checkbox" aria-describedby="rh_multiface_help" aria-controls="rh_multiface_count_row"> 多面兔子镜</label>
            <div id="rh_multiface_count_row" hidden style="margin:6px 0 6px 26px;">
              <label for="rh_multiface_count">每轮生成
                <select id="rh_multiface_count" class="text_pole" style="width:auto;min-height:36px;">
                  <option value="2">2 面</option><option value="3">3 面</option><option value="4">4 面</option><option value="5">5 面</option>
                </select>
              </label>
            </div>
            <div id="rh_multiface_help" class="rabbit-mirror-subnote" style="margin:0 0 10px 26px;">一次请求，各面独立展示。所有面共用整批输出上限，面数更多时每面可用篇幅更少；上下文字符不是绘制额度。</div>
            <label for="rh_sampling_mode" class="flex-container alignitemscenter" style="gap:8px;flex-wrap:wrap;margin:8px 0;">
              <span>抽取模式</span>
              <select id="rh_sampling_mode" class="text_pole" style="max-width:300px;">
                <option value="classic">主题元素 + 展现形式（经典模式）</option>
                <option value="format_only">仅展现形式</option>
              </select>
            </label>
            <label for="rh_raw_policy" class="flex-container alignitemscenter" style="gap:8px;flex-wrap:wrap;margin:8px 0;">
              <span>参考内容</span>
              <select id="rh_raw_policy" class="text_pole" style="max-width:320px;">
                <option value="compact">精简：Prompt 较短，Token 较少</option>
                <option value="balanced">均衡：Prompt 长度适中（默认）</option>
                <option value="full">完整：Prompt 较长，参考内容更多</option>
              </select>
            </label>
            <div class="rabbit-mirror-subnote" style="margin:-4px 0 8px 0;opacity:.72;font-size:12px;line-height:1.45;">控制随机生成时使用的参考内容多少。默认使用“均衡”。</div>
            <label class="checkbox_label"><input id="rh_creative_expansion" type="checkbox"> 发散孵化模式</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">开启后会探索更随机、更跳脱的内容组合。</div>
            <label class="checkbox_label"><input id="rh_force_visual_scenery" type="checkbox"> 动态视觉场景</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">开启后，展现形式将固定为动态视觉场景图，每轮兔子镜都会按此形式生成。</div>
            <label for="rh_enhanced_visual_drawing" class="checkbox_label"><input id="rh_enhanced_visual_drawing" type="checkbox" aria-describedby="rh_enhanced_visual_drawing_help"> 增强视觉绘制</label>
            <div id="rh_enhanced_visual_drawing_help" class="rabbit-mirror-subnote" style="margin:0 0 8px 26px;">加强画面细节、层次与互动；可与动态视觉场景一起开启。</div>
            <label class="checkbox_label"><input id="rh_user_directive" type="checkbox"> 用户指令优先</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">开启后，可以自由点菜自己喜欢的任意内容。</div>
            <label class="checkbox_label"><input id="rh_worldview_lock" type="checkbox"> 展现形式世界观锁</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">保留展现形式功能与结构，只转换不合当前世界观的具体载体；开启时会提示把抽取模式切换为“仅展现形式”。</div>
            <label class="checkbox_label"><input id="rh_avoid_repeat" type="checkbox"> 10轮冷却：避免重复主题/展现形式/整体观感</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 2px 26px;opacity:.72;font-size:12px;line-height:1.45;">仅记录已经实际生成成功的兔子镜；用于避免连续复用相近的结构骨架与整体视觉家族。</div>
          </div>

          <div id="rh_advanced_page_visual" class="rh-advanced-page" data-title="个性化视觉提示词" style="display:none;">
            <div style="opacity:.82;font-size:12px;line-height:1.55;margin-bottom:9px;">这里可以直接写你喜欢或不喜欢的画面感觉。只有勾选下面的“启用视觉提示词编辑注入”后，保存的内容才会随生成兔子镜的请求发送。</div>
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_visual_prompt_enabled" type="checkbox"> 启用视觉提示词编辑注入</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.76;font-size:12px;line-height:1.5;">默认关闭。关闭时已编辑内容仍保存在本地，但不会注入模型；下一面继续使用 1.3.20 原版视觉规则。开启后才切换到可编辑视觉层。</div>
            <div id="rh_visual_prompt_status" style="padding:7px 9px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:8px;opacity:.82;font-size:11px;line-height:1.45;margin-bottom:10px;">当前：正在读取视觉提示词状态……</div>
            <label for="rh_visual_extra_prompt" style="display:block;font-weight:700;margin:8px 0 5px;">额外视觉偏好（可选）</label>
            <textarea id="rh_visual_extra_prompt" class="text_pole" rows="5" maxlength="${VISUAL_EXTRA_PROMPT_MAX_CHARS}" spellcheck="false" placeholder="例如：像真实纸张拼贴的小剧场，左上方来光，标题压在图像边缘，正文像杂志内页，近看能看到印刷网点和轻微裁切毛边。" style="width:100%;min-height:100px;resize:vertical;box-sizing:border-box;line-height:1.5;"></textarea>
            <div style="opacity:.68;font-size:11px;line-height:1.45;margin:5px 0 10px;">可以只写“毛玻璃”“粉嫩清新”这类简单偏好，系统会把它当作设计种子并自动补足构图、层级、光线、排版、材质细节与交互第二状态；想更可控时，也可以像占位示例那样写一条完整但不冗长的视觉句子。开启注入后会作为本轮明确视觉要求执行，未指定的部分仍由兔子镜原有视觉规则补足。上限 ${VISUAL_EXTRA_PROMPT_MAX_CHARS} 字符。</div>
            <label for="rh_visual_avoid_prompt" style="display:block;font-weight:700;margin:10px 0 5px;">不希望出现的视觉（可选）</label>
            <textarea id="rh_visual_avoid_prompt" class="text_pole" rows="4" maxlength="${VISUAL_AVOID_PROMPT_MAX_CHARS}" spellcheck="false" placeholder="例如：不要荧光渐变、蓝白系统 UI、统一圆角卡片、廉价塑料感……" style="width:100%;min-height:88px;resize:vertical;box-sizing:border-box;line-height:1.5;"></textarea>
            <div style="opacity:.68;font-size:11px;line-height:1.45;margin:5px 0 10px;">可以直接写你不喜欢的颜色、质感、排版方式、光线感觉、UI 套路或整体风格。开启注入后会作为明确避用项处理。上限 ${VISUAL_AVOID_PROMPT_MAX_CHARS} 字符。</div>
            <details style="margin-top:10px;"><summary style="cursor:pointer;font-weight:700;">高级：修改通用视觉规则 <span style="font-weight:400;opacity:.62;font-size:11px;">通常无需修改</span></summary><div style="padding-top:9px;">
              <div style="opacity:.72;font-size:11px;line-height:1.5;margin-bottom:7px;">只有想直接改兔子镜原本的通用画面规则时才需要这里。普通用户只填写上面的“额外视觉偏好 / 不希望出现”即可。</div>
              <label for="rh_visual_prompt" style="display:block;font-weight:700;margin:8px 0 5px;">通用视觉审美规则（高级，可编辑）</label>
              <textarea id="rh_visual_prompt" class="text_pole" rows="14" maxlength="${VISUAL_PROMPT_MAX_CHARS}" spellcheck="false" style="width:100%;min-height:230px;resize:vertical;box-sizing:border-box;line-height:1.5;"></textarea>
              <div style="opacity:.68;font-size:11px;line-height:1.45;margin:5px 0 8px;">修改后会替换兔子镜原本的通用画面规则；上限 ${VISUAL_PROMPT_MAX_CHARS} 字符。核心结构与兼容规则仍不可覆盖。</div>
              <button id="rh_visual_prompt_reset" class="menu_button" type="button">恢复默认通用视觉规则</button>
            </div></details>
            <div class="flex-container" style="gap:8px;flex-wrap:wrap;margin-top:12px;"><button id="rh_visual_prompt_save" class="menu_button" type="button">保存并从下一面生效</button></div>
            <div style="opacity:.66;font-size:11px;line-height:1.45;margin-top:7px;">为避免重新引入移动端设置页卡顿，三个输入框都不会在键入时写设置；只有点击上面的保存按钮才会持久化。</div>
            <details id="rh_appearance_reference" style="margin-top:16px;min-width:0;">
              <summary style="cursor:pointer;font-weight:700;min-height:44px;line-height:44px;">参考一个外观 / 交互模板（可选）</summary>
              <p style="font-size:12px;line-height:1.6;">只借鉴布局、配色与交互结构，人物、正文和情节仍按当前聊天生成。不会执行或预览导入的 HTML，也不会请求其中的图片、字体等资源。</p>
              <label class="checkbox_label" style="min-height:44px;"><input id="rh_appearance_reference_enabled" type="checkbox"> 启用已保存的外观参考</label>
              <p style="font-size:12px;line-height:1.6;">默认关闭。原输入最多 128 KiB；只在本设备保存去掉原文字、脚本、事件和网址的结构摘要（每份最多 12,000 字符；安全替换时最多保留新旧两份），不保存原文、不塞入酒馆 settings。开启后每次生成会增加输入 Token；一批多面仅带入当前一份。不支持的样式会省略，不保证复刻原作。</p>
              <label for="rh_appearance_reference_input" style="display:block;margin:8px 0;">粘贴需要参考的 HTML</label>
              <textarea id="rh_appearance_reference_input" class="text_pole" rows="4" maxlength="131072" spellcheck="false" style="width:100%;max-width:100%;box-sizing:border-box;resize:vertical;"></textarea>
              <label for="rh_appearance_reference_file" style="display:block;margin:8px 0;">或选择本地 HTML / TXT 文件</label>
              <input id="rh_appearance_reference_file" type="file" accept=".html,.htm,.txt" style="width:100%;max-width:100%;min-height:44px;">
              <button id="rh_appearance_reference_save" class="menu_button" type="button" style="min-height:44px;margin-top:8px;">提取并保存外观参考</button>
              <div id="rh_appearance_reference_status" role="status" aria-live="polite" style="font-size:12px;line-height:1.6;margin-top:8px;"></div>
              <button id="rh_appearance_reference_unlink" class="menu_button" type="button" hidden style="min-height:44px;margin-top:8px;">解除旧参考关联</button>
            </details>
          </div>

          <div id="rh_advanced_page_memory" class="rh-advanced-page" data-title="共同回忆资料来源" style="display:none;">
            <label class="checkbox_label"><input id="rh_memory_scan_enabled" type="checkbox"> 启用额外资料来源（实验性）</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.76;font-size:12px;line-height:1.45;">开启后，兔子镜可能生成回忆杀；仅在实际出现回忆杀时增加额外 Token。</div>
            <button id="rh_memory_scan_now" class="menu_button" type="button">扫描可用资料来源</button>
            <div style="margin-top:6px;opacity:.68;font-size:11px;line-height:1.45;">扫描公开、正规的记忆插件接口 API。</div>
            <div id="rh_memory_scan_results" style="margin-top:8px;"></div>
            <section aria-labelledby="rh_memory_worldbook_heading" style="margin-top:16px;padding-top:12px;border-top:1px solid var(--SmartThemeBorderColor);min-width:0;">
              <h4 id="rh_memory_worldbook_heading" style="margin:0 0 8px;">绑定记忆世界书</h4>
              <label class="checkbox_label" style="min-height:44px;"><input id="rh_memory_worldbook_enabled" type="checkbox"> 将绑定的世界书作为共同回忆资料</label>
              <div class="rabbit-mirror-subnote" style="font-size:12px;line-height:1.5;margin:6px 0;">由上方总开关控制。仅抽中 I.1 共同回忆时读取；关闭来源不清除绑定。这里只保存书名，不把世界书正文存入设置。</div>
              <button id="rh_memory_worldbook_refresh" class="menu_button" type="button" style="min-height:44px;max-width:100%;">刷新世界书目录</button>
              <label for="rh_memory_worldbook_id" style="display:block;margin:8px 0 4px;">选择记忆世界书（自动保存）</label>
              <select id="rh_memory_worldbook_id" class="text_pole" style="display:block;width:100%;max-width:100%;min-width:0;min-height:44px;box-sizing:border-box;"></select>
              <button id="rh_memory_worldbook_clear" class="menu_button" type="button" style="min-height:44px;margin-top:8px;">清空绑定</button>
              <div id="rh_memory_worldbook_status" role="status" aria-live="polite" style="font-size:12px;line-height:1.5;margin-top:8px;overflow-wrap:anywhere;"></div>
            </section>
          </div>

          <div id="rh_advanced_page_worldinfo" class="rh-advanced-page" data-title="独立 API" style="display:none;">
            <details id="rh_early_body_options" style="margin-bottom:12px;min-width:0;">
              <summary style="min-height:44px;cursor:pointer;">正文标签闭合后提前生成（可选）</summary>
              <label class="checkbox_label" style="min-height:44px;"><input id="rh_early_body_enabled" type="checkbox"> 为当前聊天开启提前生成</label>
              <label for="rh_early_body_tags" style="display:block;margin:8px 0;">正文标签名（最多 8 个，逗号分隔）</label>
              <input id="rh_early_body_tags" class="text_pole" type="text" maxlength="520" placeholder="例如 story_scene" style="width:100%;min-height:44px;box-sizing:border-box;">
              <button id="rh_early_body_scan" class="menu_button" type="button" style="min-height:44px;">扫描当前聊天可选标签</button>
              <div id="rh_early_body_candidates" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
              <button id="rh_early_body_save" class="menu_button" type="button" style="min-height:44px;margin-top:8px;">保存当前聊天设置</button>
              <div style="font-size:12px;line-height:1.6;margin-top:8px;">这里选的是要读取的正文，不是上面的过滤标签。所有选中标签完整闭合且内容可见后，可在状态栏等尾部仍输出时先请求兔子镜；仍最多一次请求，主回复结束后展示。未闭合、工具调用或无法确认时，仍等正文结束。切换聊天不会沿用此设置。</div>
              <div id="rh_early_body_status" role="status" aria-live="polite" style="font-size:12px;line-height:1.6;"></div>
            </details>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">读取范围</div>
              <label>最近 <input id="rh_independent_context_layers" class="text_pole" type="number" min="1" max="200" step="1" inputmode="numeric" style="width:76px;"> 层可见聊天正文</label>
              <div class="rabbit-mirror-subnote" style="margin:6px 0 0;opacity:.72;font-size:11px;line-height:1.5;">只读取最近 X 层可见正文。历史兔子镜和隐藏推理始终不会发送；小缓存只在本次请求内复用，完成后立即销毁。</div>
            </div>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">附加资料</div>
              <label class="checkbox_label"><input id="rh_independent_include_character_summary" type="checkbox"> 角色卡摘要（推荐开启）</label>
              <label class="checkbox_label"><input id="rh_independent_include_persona_summary" type="checkbox"> Persona 摘要（推荐开启）</label>
              <div class="rabbit-mirror-subnote" style="margin:4px 0 0 26px;opacity:.72;font-size:11px;line-height:1.5;">只带入紧凑摘要，不会把整张角色卡或其它隐藏提示整包塞给副 API。</div>
            </div>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">正文标签过滤／隔离</div>
              <div class="flex-container" style="gap:8px;flex-wrap:wrap;align-items:center;">
                <button id="rh_independent_tag_filter_open" class="menu_button" type="button">扫描与管理正文标签</button>
                <span id="rh_independent_tag_filter_summary" style="opacity:.72;font-size:11px;line-height:1.4;">尚未设置</span>
              </div>
              <label class="checkbox_label" style="margin-top:8px;"><input id="rh_follow_tag_isolation" type="checkbox"> 跟随当前 API：禁止兔子镜参考所选标签</label>
              <div class="rabbit-mirror-subnote" style="margin:3px 0 0 26px;opacity:.72;font-size:11px;line-height:1.5;">仅要求兔子镜跳过所选标签内容；如需彻底过滤，请使用独立 API。</div>
              <div class="rabbit-mirror-subnote" style="margin:6px 0 0;opacity:.72;font-size:11px;line-height:1.5;">独立 API 会在发送前从副 API 临时上下文副本中过滤并跳过所选标签内容；原酒馆正文始终不修改。</div>
            </div>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <label class="checkbox_label" style="font-weight:700;"><input id="rh_independent_read_global_world_info" type="checkbox"> 读取本轮已激活的世界书</label>
              <div class="rabbit-mirror-subnote" style="margin:2px 0 0 26px;opacity:.72;font-size:11px;line-height:1.5;">进入当前角色聊天后，优先显示酒馆为当前聊天加载过的角色／聊天／Persona／当前全局世界书；真正发送时仍只复用主生成本轮实际激活的条目，不会重新扫描或重掷概率。</div>
            </div>
            <div style="margin:7px 0 4px;font-size:12px;font-weight:700;opacity:.86;">当前聊天相关世界书</div>
            <div id="rh_world_info_book_filters" style="margin:4px 0 10px;padding:8px 9px;border:1px solid color-mix(in srgb,var(--SmartThemeBorderColor) 45%,transparent);border-radius:10px;max-height:190px;overflow:auto;-webkit-overflow-scrolling:touch;"><div style="font-size:11px;line-height:1.4;opacity:.66;">打开此高级选项时自动显示当前聊天相关世界书。</div></div>
            <details id="rh_world_info_all_books" style="margin:5px 0 8px;">
              <summary style="cursor:pointer;font-size:11px;opacity:.78;">更多：从全部世界书中选择（折叠）</summary>
              <div class="flex-container" style="gap:7px;flex-wrap:wrap;align-items:center;margin:8px 0 0;">
                <button id="rh_world_info_books_fetch" class="menu_button" type="button">拉取全部世界书</button>
                <span id="rh_world_info_books_fetch_status" style="opacity:.66;font-size:11px;">未拉取</span>
              </div>
              <div id="rh_world_info_all_book_filters" style="margin-top:7px;padding:8px 9px;border:1px solid color-mix(in srgb,var(--SmartThemeBorderColor) 45%,transparent);border-radius:10px;max-height:260px;overflow:auto;-webkit-overflow-scrolling:touch;"><div style="font-size:11px;line-height:1.4;opacity:.66;">折叠时不创建完整世界书列表；展开后按需渲染。</div></div>
            </details>
          </div>

          <div id="rh_advanced_page_repair" class="rh-advanced-page" data-title="挨打猫与维修兔" style="display:none;">
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_feedback_cat" type="checkbox"> 🐈 启用挨打猫</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.78;font-size:12px;line-height:1.5;">用于纠正兔子镜的美化效果；仅在实际提交美化反馈时增加额外 Token。</div>
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_maintenance_rabbit" type="checkbox"> 🐇 启用维修兔</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.78;font-size:12px;line-height:1.5;">兔子镜出问题时，可使用维修兔进行检查和修复；维修兔本身不会增加模型 Token。</div>
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_maintenance_auto_safe" type="checkbox"> 🧪 维修兔自动巡逻（实验性）</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.78;font-size:12px;line-height:1.5;">新生成的兔子镜会自动修常见小问题；复杂问题仍需手动修。</div>
          </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>`;

    try { globalThis.__rabbitMirrorQuickStartUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorQuickStartUiCleanup = null;
    $('body > #rh_advanced_modal, body > #rh_world_info_prompt_modal, body > #rh_independent_tag_filter_modal').remove();
    settingsMount.append(html);
    if (globalThis.__TAURITAVERN__) document.getElementById('rabbit_mirror_theater_settings')?.setAttribute('data-rm-host', 'tauritavern');
    $('#rh_update_now').on('click', async event => {
        const button = event.currentTarget;
        if (button.disabled) return;
        const status = document.getElementById('rh_update_status');
        const reload = document.getElementById('rh_update_reload');
        button.disabled = true;
        status.hidden = false;
        status.textContent = '正在向酒馆请求更新当前兔子镜，请稍候。不会更新其他扩展，也不会删除本地数据。';
        reload.hidden = true;
        try {
            const updater = await import('./extensionUpdater.js?rmv=1.5.51-narrow1');
            const result = await updater.requestRabbitMirrorUpdate();
            if (!status.isConnected) return;
            status.textContent = result.status === 'current'
                ? '宿主确认当前分支已是最新版。若界面仍旧，可手动刷新；刷新不会清空母本库。'
                : '宿主已完成更新。请先结束生成、保存正在输入的文字，再点下方刷新。';
            reload.hidden = false;
        } catch (error) {
            if (status.isConnected) status.textContent = String(error?.message || '更新失败，请检查宿主日志。');
        } finally { if (button.isConnected) button.disabled = false; }
    });
    $('#rh_update_reload').on('click', () => {
        if (globalThis.confirm('刷新会中断当前操作，请确认已结束生成并保存输入内容。现在刷新吗？')) location.reload();
    });
    // The settings root uses CSS layout containment and a scroll container. Move the
    // advanced dialog to <body> so it is a real viewport modal instead of being clipped
    // inside the extension drawer; all setting controls keep their existing IDs/events.
    $('#rh_advanced_modal').appendTo(document.body);
    const worldInfoPromptHtml = `
<div id="rh_world_info_prompt_modal" role="dialog" aria-modal="true" aria-label="独立 API 世界书设置" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:2147483001;background:rgba(8,10,14,.62);box-sizing:border-box;padding-top:max(24px,calc(env(safe-area-inset-top) + 14px));padding-right:max(12px,calc(env(safe-area-inset-right) + 8px));padding-bottom:max(24px,calc(env(safe-area-inset-bottom) + 14px));padding-left:max(12px,calc(env(safe-area-inset-left) + 8px));align-items:center;justify-content:center;overflow:hidden;pointer-events:auto;">
  <div style="width:min(520px,calc(100vw - 24px));max-height:calc(100dvh - 76px - env(safe-area-inset-top) - env(safe-area-inset-bottom));overflow:hidden;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);display:flex;flex-direction:column;">
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 40px;align-items:center;gap:8px;padding:11px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);">
      <div><b style="font-size:15px;">独立 API 是否读取世界书？</b><div style="opacity:.65;font-size:11px;line-height:1.35;margin-top:2px;">之后也可以在「高级设置 → 独立 API」随时修改</div></div>
      <button id="rh_world_info_prompt_close" class="menu_button" type="button" aria-label="关闭" style="width:38px;min-width:38px;height:38px;padding:0;border-radius:12px;font-size:20px;line-height:1;">×</button>
    </div>
    <div style="padding:15px;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;">
      <div style="padding:12px 13px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);font-size:12px;line-height:1.6;">
        <div style="font-weight:700;margin-bottom:5px;">📚 读取世界书</div>
        <div style="opacity:.78;">进入当前角色聊天后，优先显示酒馆为当前聊天加载过的角色／聊天／Persona／当前全局世界书；真正发送时仍只复用主生成本轮实际激活的条目，不会重新扫描或重掷概率。</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:14px;">
        <button id="rh_world_info_prompt_disable" class="menu_button" type="button" style="min-height:44px;">暂不启用</button>
        <button id="rh_world_info_prompt_enable" class="menu_button" type="button" style="min-height:44px;font-weight:700;">启用世界书</button>
      </div>
    </div>
  </div>
</div>`;
    $(worldInfoPromptHtml).appendTo(document.body);
    const tagFilterModalHtml = `
<div id="rh_independent_tag_filter_modal" role="dialog" aria-modal="true" aria-label="兔子镜正文标签管理" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:2147483002;background:rgba(8,10,14,.62);box-sizing:border-box;padding:18px 12px;align-items:center;justify-content:center;overflow:hidden;pointer-events:auto;">
  <div style="width:min(560px,calc(100vw - 24px));max-height:min(720px,calc(100dvh - 36px));overflow:hidden;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);display:flex;flex-direction:column;">
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 40px;align-items:center;gap:8px;padding:11px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);">
      <div><b style="font-size:15px;">兔子镜正文标签管理</b><div style="opacity:.65;font-size:11px;line-height:1.35;margin-top:2px;">独立 API 发送前过滤；跟随当前 API 仅在开关启用时要求兔子镜跳过所选标签，原正文与美化规则保持不变</div></div>
      <button id="rh_independent_tag_filter_close" class="menu_button" type="button" aria-label="关闭" style="width:38px;min-width:38px;height:38px;padding:0;border-radius:12px;font-size:20px;line-height:1;">×</button>
    </div>
    <div style="padding:14px;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;">
      <div style="font-size:12px;line-height:1.55;opacity:.82;">勾选要整段过滤／隔离的标签。标签名不区分大小写；可填写 <code>thinking</code>、<code>&lt;thinking&gt;</code> 或自定义标签名。最多 ${INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT} 项，不接受正则。预设内尚未出现在聊天正文的标签，请手动添加。</div>
      <div style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:9px;align-items:center;margin-top:12px;padding:10px;border:1px solid color-mix(in srgb,currentColor 13%,transparent);border-radius:11px;background:color-mix(in srgb,currentColor 4%,transparent);">
        <button id="rh_independent_tag_filter_scan" class="menu_button" type="button">扫描当前聊天标签</button>
        <div id="rh_independent_tag_filter_scan_status" aria-live="polite" style="min-width:0;opacity:.72;font-size:11px;line-height:1.45;">扫描当前聊天已加载的正文源与可见正文；结果不会自动勾选或保存。</div>
      </div>
      <div id="rh_independent_tag_filter_list" style="display:grid;gap:7px;margin-top:12px;"></div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:12px;">
        <input id="rh_independent_tag_filter_input" class="text_pole" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" maxlength="80" placeholder="添加标签，例如 &lt;analysis&gt;">
        <button id="rh_independent_tag_filter_add" class="menu_button" type="button">添加并勾选</button>
      </div>
      <div id="rh_independent_tag_filter_error" aria-live="polite" style="min-height:18px;margin-top:5px;color:#ef9a9a;font-size:11px;line-height:1.4;"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;padding:11px 14px 14px;border-top:1px solid color-mix(in srgb,currentColor 12%,transparent);">
      <button id="rh_independent_tag_filter_cancel" class="menu_button" type="button">取消</button>
      <button id="rh_independent_tag_filter_save" class="menu_button" type="button" style="font-weight:700;">保存并从下一轮生效</button>
    </div>
  </div>
</div>`;
    $(tagFilterModalHtml).appendTo(document.body);
    for (const id of ['rh_advanced_modal', 'rh_world_info_prompt_modal', 'rh_independent_tag_filter_modal']) {
        // Stable TT layout contract, scoped to our modal; no host/theme rewrite.
        const modal = document.getElementById(id);
        applyRabbitMirrorHostSurface(modal, 'backdrop');
        applyRabbitMirrorHostSurface(modal?.firstElementChild, 'fullscreen-window');
    }
    attachTokenMeterListener();
    renderTokenMeter();

    checked('#rh_enabled', settings.autoRabbitMirrorInjection !== false && settings.enabled !== false);
    $(`input[name="rh_generation_source"][value="${settings.generationSource || 'follow'}"]`).prop('checked', true);
    $(`input[name="rh_follow_display"][value="${settings.followDisplayMode || 'inline'}"]`).prop('checked', true);
    $(`input[name="rh_independent_display"][value="${settings.independentDisplayMode || 'external'}"]`).prop('checked', true);
    $('#rh_independent_base').val(settings.independentApiBaseUrl || '');
    $('#rh_independent_key').val(settings.independentApiKey || '');
    $('#rh_independent_temperature').val(settings.independentApiTemperature ?? 0.8);
    $('#rh_independent_max_tokens').val(settings.independentApiMaxTokens ?? 30000);
    checked('#rh_independent_advanced_enabled', settings.independentAdvancedEnabled === true);
    $('#rh_independent_reasoning_effort').val(settings.independentReasoningEffort || '');
    $('#rh_independent_extra_params').val(typeof settings.independentExtraParams === 'string' ? settings.independentExtraParams : '');
    const setExcludedSelection = fields => {
        const selected = new Set(Array.isArray(fields) ? fields : []);
        document.querySelectorAll('#rh_independent_excluded_params [data-rh-exclude-param]').forEach(input => {
            input.checked = selected.has(input.getAttribute('data-rh-exclude-param'));
        });
    };
    setExcludedSelection(settings.independentExcludedParams);
    $('#rh_independent_context_layers').val(settings.independentContextMaxLayers ?? 20);
    checked('#rh_follow_tag_isolation', settings.followTagIsolationEnabled === true);
    $('#rh_banned_words_save').parent().parent().appendTo('#rh_advanced_page_replacement');
    $('#rh_external_library_actions').appendTo('#rh_advanced_page_external');
    document.getElementById('rh_advanced_page_worldinfo').prepend(document.getElementById('rh_behavior_rules'));
    $('#rh_banned_words').val(formatRabbitMirrorReplacementLines(settings.rabbitMirrorBannedWords || []));
    $('#rh_banned_words_status').text(`已保存 ${(settings.rabbitMirrorBannedWords || []).length} / ${RABBIT_MIRROR_BANNED_WORD_MAX_COUNT} 个词`);
    $('#rh_independent_model').val(settings.independentApiModel || '');
    const tagFilterPresetLabels = new Map([
        ['thinking', 'thinking'],
        ['updatevariable', 'UpdateVariable'],
        ['updatevarible', 'UpdateVarible'],
    ]);
    let tagFilterDraft = new Set();
    let tagFilterDetected = new Map();
    let tagFilterScanController = null;
    let tagFilterScanEpoch = 0;
    const renderTagFilterSummary = () => {
        const current = getSettings();
        const tags = normalizeIndependentContextExcludedTags(current.independentContextExcludedTags);
        const followHint = current.followTagIsolationEnabled === true ? '跟随隔离已开' : '跟随隔离未开';
        const summary = tags.length
            ? `已选 ${tags.length} 项：${tags.slice(0, 3).map(tag => tagFilterPresetLabels.get(tag) || tag).join('、')}${tags.length > 3 ? '…' : ''}；${followHint}`
            : `未选择标签；${followHint}`;
        $('#rh_independent_tag_filter_summary').text(summary);
    };
    const renderTagFilterDraft = () => {
        const list = $('#rh_independent_tag_filter_list').empty();
        const knownTags = [...new Set([...DEFAULT_INDEPENDENT_CONTEXT_EXCLUDED_TAGS, ...tagFilterDraft, ...tagFilterDetected.keys()])];
        for (const tag of knownTags) {
            const row = $('<div>').css({ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: '8px', alignItems: 'center', padding: '8px 9px', border: '1px solid color-mix(in srgb,currentColor 13%,transparent)', borderRadius: '10px' });
            const label = $('<label>').addClass('checkbox_label').css({ minWidth: 0, overflowWrap: 'anywhere' });
            const checkbox = $('<input>').attr({ type: 'checkbox', 'data-rh-context-tag': tag }).prop('checked', tagFilterDraft.has(tag));
            label.append(checkbox, document.createTextNode(` <${tagFilterPresetLabels.get(tag) || tag}>`));
            row.append(label);
            const detectedCount = Number(tagFilterDetected.get(tag) || 0);
            if (detectedCount > 0) row.append($('<span>').text(`扫描到 ${detectedCount} 次`).css({ opacity: .68, fontSize: '10px', whiteSpace: 'nowrap' }));
            else if (tagFilterPresetLabels.has(tag)) row.append($('<span>').text('常用').css({ opacity: .62, fontSize: '10px' }));
            else row.append($('<button>').attr({ type: 'button', 'data-rh-remove-context-tag': tag }).addClass('menu_button').text('移除').css({ minWidth: '64px' }));
            list.append(row);
        }
        if (!knownTags.length) list.append($('<div>').text('当前没有可选标签。').css({ opacity: .65, fontSize: '11px' }));
    };
    const cancelTagFilterScan = () => {
        tagFilterScanEpoch += 1;
        try { tagFilterScanController?.abort?.(); } catch {}
        tagFilterScanController = null;
        $('#rh_independent_tag_filter_scan').prop('disabled', false).text('扫描当前聊天标签');
        $('#rh_independent_tag_filter_save').prop('disabled', false);
    };
    try { globalThis.__rabbitMirrorTagFilterScanUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorTagFilterScanUiCleanup = cancelTagFilterScan;
    const setTagFilterOpen = open => {
        const modal = $('#rh_independent_tag_filter_modal');
        cancelTagFilterScan();
        if (open) {
            tagFilterDraft = new Set(normalizeIndependentContextExcludedTags(getSettings().independentContextExcludedTags));
            tagFilterDetected = new Map();
            $('#rh_independent_tag_filter_input').val('');
            $('#rh_independent_tag_filter_error').text('');
            $('#rh_independent_tag_filter_scan_status').text('扫描当前聊天已加载的正文源与可见正文；结果不会自动勾选或保存。');
            renderTagFilterDraft();
        }
        modal.attr('aria-hidden', open ? 'false' : 'true').css('display', open ? 'flex' : 'none');
        if (open) setTimeout(() => $('#rh_independent_tag_filter_input').trigger('focus'), 0);
    };
    renderTagFilterSummary();
    const earlyBodyChat = () => { try { return String(getCurrentChatKey(globalThis.SillyTavern?.getContext?.()?.chat || []) || ''); } catch { return ''; } };
    let earlyBodyRenderedChat = '';
    const renderEarlyBodySettings = () => {
        const value = getSettings();
        const currentChat = earlyBodyChat();
        if (currentChat !== earlyBodyRenderedChat) {
            $('#rh_early_body_candidates').empty();
            earlyBodyRenderedChat = currentChat;
        }
        const sameChat = value.independentEarlyBodyChatKey === currentChat;
        checked('#rh_early_body_enabled', sameChat && value.independentEarlyBodyEnabled === true);
        $('#rh_early_body_tags').val(sameChat ? (value.independentEarlyBodyTags || []).join(', ') : '');
        $('#rh_early_body_status').text(sameChat && value.independentEarlyBodyEnabled === true ? '当前聊天已开启；只影响下一次独立生成。' : '当前聊天未开启提前生成。');
    };
    renderEarlyBodySettings();
    $('#rh_early_body_options').on('toggle', event => { if (event.currentTarget.open) renderEarlyBodySettings(); });
    $('#rh_early_body_enabled').on('change', event => {
        if (!event.currentTarget.checked && getSettings().independentEarlyBodyChatKey === earlyBodyChat()) {
            updateSettings({ independentEarlyBodyEnabled: false });
            refreshRabbitMirrorGenerationMode();
            $('#rh_early_body_status').text('已关闭。普通正文结束后生成的流程保持不变。');
        } else $('#rh_early_body_status').text('请选好正文标签，再保存以开启。');
    });
    $('#rh_early_body_save').on('click', () => {
        const enabled = $('#rh_early_body_enabled').prop('checked') === true;
        const input = String($('#rh_early_body_tags').val() || '').split(/[\s,，、;；]+/).filter(Boolean);
        const tags = normalizeEarlyBodyTags(input);
        const context = globalThis.SillyTavern?.getContext?.() || {};
        const key = earlyBodyChat();
        if (!Array.isArray(context.chat) || !context.chat.length || !key) { $('#rh_early_body_status').text('请先打开要设置的聊天。'); return; }
        if (enabled && !tags.length) { $('#rh_early_body_status').text('请填写 1–8 个有效正文标签名；不能使用思考、脚本或兔子镜标签。'); return; }
        if (enabled && tags.some(tag => (getSettings().independentContextExcludedTags || []).includes(tag))) { $('#rh_early_body_status').text('正文标签同时被设为过滤标签。请先取消过滤该标签，或选择真正的正文标签。'); return; }
        updateSettings({ independentEarlyBodyEnabled: enabled, independentEarlyBodyTags: tags, independentEarlyBodyChatKey: key });
        refreshRabbitMirrorGenerationMode();
        $('#rh_early_body_status').text(enabled ? '已保存，仅在当前聊天的下一次独立生成生效。' : '已保存，提前生成功能关闭。');
    });
    $('#rh_early_body_scan').on('click', async event => {
        const button = event.currentTarget, owner = earlyBodyChat();
        if (button.disabled) return;
        button.disabled = true;
        $('#rh_early_body_status').text('正在扫描已加载的当前聊天，不会请求模型。');
        try {
            const result = await scanCurrentChatIndependentContextTags();
            if (!button.isConnected || owner !== earlyBodyChat()) return;
            const target = document.getElementById('rh_early_body_candidates'); target.replaceChildren();
            const selected = new Set(normalizeEarlyBodyTags(String($('#rh_early_body_tags').val() || '').split(/[\s,，、;；]+/).filter(Boolean)));
            for (const row of result?.tags || []) {
                const name = normalizeEarlyBodyTags([row?.name])[0]; if (!name) continue;
                const label = document.createElement('label'); label.className = 'checkbox_label'; label.style.minHeight = '44px';
                const control = document.createElement('input'); control.type = 'checkbox'; control.checked = selected.has(name);
                control.addEventListener('change', () => {
                    const current = new Set(normalizeEarlyBodyTags(String($('#rh_early_body_tags').val() || '').split(/[\s,，、;；]+/).filter(Boolean)));
                    if (control.checked && current.size >= 8 && !current.has(name)) { control.checked = false; return; }
                    if (control.checked) current.add(name); else current.delete(name);
                    $('#rh_early_body_tags').val([...current].join(', '));
                });
                label.append(control, document.createTextNode(name)); target.append(label);
            }
            $('#rh_early_body_status').text(target.childElementCount ? '扫描完成。勾选真正的正文标签后保存；不会自动勾选。' : '没有找到可用正文标签，可以手动填写标签名。');
        } catch { if (button.isConnected) $('#rh_early_body_status').text('扫描未完成，请确认当前聊天后重试。'); }
        finally { if (button.isConnected) button.disabled = false; }
    });
    const renderIndependentConnectionStatus = () => {
        const currentSettings=getSettings();
        const currentId=String(currentSettings.independentConnectionProfileId||'').trim();
        const actualModel=String(currentSettings.independentApiModel||'').trim();
        const profile=getIndependentConnectionProfiles().find(item=>item.id===currentId);
        const target=$('#rh_independent_connection_status');
        if(!currentId){ target.text(`当前连接：手动接口；兔子镜请求模型：${actualModel||'尚未填写'}`); return; }
        if(!profile){ target.text('当前连接已失效，请重新一键配置'); return; }
        const profileDefault=String(profile.model||'').trim();
        const defaultHint=profileDefault && profileDefault!==actualModel ? `（Profile 默认：${profileDefault}）` : '';
        target.text(`当前连接：${profile.name}；兔子镜请求模型：${actualModel||profileDefault||'尚未选择'}${defaultHint}`);
    };
    renderIndependentConnectionStatus();
    checked('#rh_independent_read_global_world_info', settings.independentReadGlobalWorldInfo === true);
    checked('#rh_independent_include_character_summary', settings.independentReadCharacterCardSummary !== false);
    checked('#rh_independent_include_persona_summary', settings.independentReadPersonaSummary !== false);
    installWorldInfoBookVisibilityObserver();
    const syncGenerationModeFields = () => {
        const current = getSettings();
        const independent = current.generationSource === 'independent';
        $('#rh_independent_api_fields').show();
        $('#rh_follow_display_row').toggle(!independent);
        $('#rh_independent_mode_status').text(independent
            ? '当前已启用独立 API；以下设置会用于下一轮副 API 生成。'
            : `当前使用“跟随当前 API”；标签隔离${current.followTagIsolationEnabled === true ? '已开启' : '未开启'}，其余独立 API 设置可提前配置。`);
    };
    syncGenerationModeFields();
    renderIndependentApiDiagnostic();
    try { globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup?.(); } catch {}
    const independentDiagnosticListener = event => { renderIndependentApiDiagnostic(event?.detail || null); };
    globalThis.addEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
    globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup = () => globalThis.removeEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
    try { globalThis.__rabbitMirrorWorldInfoBooksUiCleanup?.(); } catch {}
    const worldInfoBooksListener = () => scheduleWorldInfoBookSettingsRender();
    globalThis.addEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
    globalThis.__rabbitMirrorWorldInfoBooksUiCleanup = () => globalThis.removeEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
    try { globalThis.__rabbitMirrorBlacklistUiCleanup?.(); } catch {}
    const blacklistListener = event => { checked('#rh_blacklist_enabled', getSettings().blacklistEnabled !== false); if (event?.detail?.action === 'enabled') refreshRecipeButtons(); if (document.getElementById('rh_random_preference_section')?.open) { renderBlacklistSettings(); renderFavoriteSettings(); } };
    globalThis.addEventListener?.(BLACKLIST_CHANGED_EVENT, blacklistListener);
    globalThis.__rabbitMirrorBlacklistUiCleanup = () => globalThis.removeEventListener?.(BLACKLIST_CHANGED_EVENT, blacklistListener);
    checked('#rh_feedback_cat', settings.feedbackCatEnabled);
    checked('#rh_maintenance_rabbit', settings.maintenanceRabbitEnabled);
    checked('#rh_maintenance_auto_safe', settings.maintenanceRabbitAutoSafeEnabled === true && settings.maintenanceRabbitAutoSafeConsent === true);
    $('#rh_sampling_mode').val(settings.samplingMode || 'classic');
    $('#rh_raw_policy').val(settings.rawPolicy || 'balanced');
    checked('#rh_user_directive', settings.userDirectivePriority);
    checked('#rh_worldview_lock', settings.presentationWorldviewLock === true);
    checked('#rh_creative_expansion', settings.creativeExpansionMode);
    checked('#rh_force_visual_scenery', settings.forceVisualScenery);
    checked('#rh_avoid_repeat', settings.avoidRepeat);
    checked('#rh_blacklist_enabled', settings.blacklistEnabled !== false);
    checked('#rh_memory_scan_enabled', settings.memoryScanEnabled);
    renderMemoryWorldBookBinding();
    checked('#rh_enhanced_visual_drawing', settings.enhancedVisualDrawing === true);
    checked('#rh_multiface_enabled', settings.rabbitMirrorFaceCount > 1);
    $('#rh_multiface_count').val(String(settings.rabbitMirrorFaceCount > 1 ? settings.rabbitMirrorFaceCount : 2));
    $('#rh_multiface_count_row').prop('hidden', settings.rabbitMirrorFaceCount <= 1);
    $('#rh_multiface_count').prop('disabled', settings.rabbitMirrorFaceCount <= 1);
    checked('#rh_visual_prompt_enabled', settings.visualPromptEditingEnabled);
    $('#rh_visual_prompt').val(settings.visualPrompt ?? DEFAULT_VISUAL_PROMPT);
    $('#rh_visual_extra_prompt').val(settings.visualExtraPrompt || '');
    $('#rh_visual_avoid_prompt').val(settings.visualAvoidPrompt || '');
    renderVisualPromptStatus(settings);

    let appearanceFileSequence = 0;
    let appearanceSaving = false;
    $('#rh_behavior_rule_mode').val(settings.behaviorRuleMode || 'always');
    $('#rh_behavior_rule_text').val(resolveBehaviorRuleText(settings));
    $('#rh_behavior_rule_status').text(settings.behaviorRuleMode === 'off' ? '当前：不注入；已保存的内容仍保留。' : settings.behaviorRuleMode === 'adult-only' ? '当前：仅在抽到成人内容时向独立 API 注入。' : '当前：每轮向独立 API 注入已保存内容。');
    $('#rh_behavior_rule_mode').on('change', () => {
        const mode = String($('#rh_behavior_rule_mode').val());
        updateSettings({ behaviorRuleMode: mode });
        refreshRabbitMirrorGenerationMode();
        $('#rh_behavior_rule_status').text(mode === 'off' ? '已关闭，从下一轮起不发送这一块；编辑内容仍保留。' : '注入方式已保存，从下一轮生效。未保存的文本修改不会发送。');
    });
    $('#rh_behavior_rule_save').on('click', () => {
        updateSettings({ behaviorRuleText: String($('#rh_behavior_rule_text').val() ?? '') });
        refreshRabbitMirrorGenerationMode();
        $('#rh_behavior_rule_status').text('内容已保存，从下一轮生效；每份请求最多注入一次。');
    });
    $('#rh_behavior_rule_clear').on('click', () => {
        $('#rh_behavior_rule_text').val('');
        updateSettings({ behaviorRuleText: '' });
        refreshRabbitMirrorGenerationMode();
        $('#rh_behavior_rule_status').text('已清空并保存，不会自动补回默认内容。');
    });
    $('#rh_behavior_rule_reset').on('click', () => {
        $('#rh_behavior_rule_text').val(DEFAULT_BEHAVIOR_RULE_TEXT);
        updateSettings({ behaviorRuleText: null });
        refreshRabbitMirrorGenerationMode();
        $('#rh_behavior_rule_status').text('已恢复默认内容并保存；注入方式保持不变。');
    });
    const appearanceUIOwner = document.getElementById('rh_appearance_reference');
    const appearanceRawInput = document.getElementById('rh_appearance_reference_input');
    const appearanceFileInput = document.getElementById('rh_appearance_reference_file');
    const appearanceOwnerIsCurrent = () => isCurrentRuntime() && appearanceUIOwner?.isConnected === true && document.getElementById('rh_appearance_reference') === appearanceUIOwner;
    const appearanceStatus = message => { if (appearanceOwnerIsCurrent()) $('#rh_appearance_reference_status').text(message); };
    let appearanceRecoveryRevision = '';
    const showAppearanceRecovery = (error, revision) => {
        if (!appearanceOwnerIsCurrent() || getSettings().appearanceReferenceRevision !== revision) return;
        const code = String(error?.code || '');
        if (!['RABBIT_MIRROR_APPEARANCE_RETAIN_MISSING', 'RABBIT_MIRROR_APPEARANCE_MISSING'].includes(code)) return;
        appearanceRecoveryRevision = revision;
        $('#rh_appearance_reference_unlink').prop('hidden', false);
        appearanceStatus('当前设备缺少已关联的有效参考。可点“解除旧参考关联”：只关闭参考并清除关联，不删除数据库内容；之后再显式保存新参考。');
    };
    const renderAppearanceState = () => {
        const current = getSettings();
        checked('#rh_appearance_reference_enabled', current.appearanceReferenceEnabled === true);
        appearanceStatus(current.appearanceReferenceEnabled
            ? '已启用：从下一轮读取当前设备的参考摘要；若本设备没有对应模板，会在请求前提示。'
            : '已关闭：生成时不读取或发送参考模板。已保存的摘要仍保留。');
    };
    const clearAppearanceInput = () => {
        appearanceFileSequence += 1;
        if (appearanceRawInput) appearanceRawInput.value = '';
        if (appearanceFileInput) appearanceFileInput.value = '';
    };
    renderAppearanceState();
    // An explicit expansion may check this device's small saved material. No
    // check at UI startup, no polling, and no module/read on generation OFF.
    $('#rh_appearance_reference').on('toggle', async () => {
        if (!appearanceUIOwner?.open || !appearanceOwnerIsCurrent() || appearanceSaving) return;
        const revision = String(getSettings().appearanceReferenceRevision || '');
        if (!revision) return;
        const sequence = appearanceFileSequence;
        try {
            const module = await import('./appearanceReference.js?rmv=1.5.51-narrow1');
            if (!appearanceOwnerIsCurrent() || !appearanceUIOwner.open || sequence !== appearanceFileSequence || appearanceSaving) return;
            await module.loadAppearanceReferenceMaterial(revision);
            if (!appearanceOwnerIsCurrent() || !appearanceUIOwner.open || sequence !== appearanceFileSequence || appearanceSaving || getSettings().appearanceReferenceRevision !== revision) return;
            appearanceRecoveryRevision = '';
            $('#rh_appearance_reference_unlink').prop('hidden', true);
        } catch (error) {
            if (!appearanceSaving && sequence === appearanceFileSequence && appearanceUIOwner?.open) showAppearanceRecovery(error, revision);
        }
    });
    $('#rh_appearance_reference_unlink').on('click', () => {
        if (!appearanceOwnerIsCurrent() || appearanceSaving || !appearanceRecoveryRevision || getSettings().appearanceReferenceRevision !== appearanceRecoveryRevision) return;
        if (!globalThis.confirm('仅关闭外观参考并解除当前设置的关联，不删除数据库中的摘要，不修改聊天或其他数据。继续吗？')) return;
        updateSettings({ appearanceReferenceEnabled: false, appearanceReferenceRevision: '' });
        appearanceRecoveryRevision = '';
        $('#rh_appearance_reference_unlink').prop('hidden', true);
        renderAppearanceState();
        appearanceStatus('已解除旧参考关联，数据库内容未删除。现在可粘贴或选择文件，显式保存新参考。');
    });
    $('#rh_appearance_reference_enabled').on('change', e => {
        if (e.target.checked && !getSettings().appearanceReferenceRevision) {
            e.target.checked = false;
            appearanceStatus('请先提取并保存一个外观参考，再启用。');
            return;
        }
        updateSettings({ appearanceReferenceEnabled: e.target.checked === true });
        renderAppearanceState();
    });
    $('#rh_appearance_reference_file').on('change', async e => {
        const file = e.target.files?.[0];
        const sequence = ++appearanceFileSequence;
        if (!file) return;
        if (!/\.(?:html?|txt)$/i.test(file.name) || file.size > 128 * 1024) {
            clearAppearanceInput(); appearanceStatus('请选择不超过 128 KiB 的 HTML / TXT 文件。原有参考未改动。'); return;
        }
        appearanceStatus('正在读取本地文件；尚未保存，也不会运行文件。');
        try {
            const text = await file.text();
            if (sequence !== appearanceFileSequence || !appearanceOwnerIsCurrent()) return;
            $('#rh_appearance_reference_input').val(text);
            appearanceStatus('文件已填入，点击“提取并保存”后才会替换已保存的参考。');
        } catch { if (sequence === appearanceFileSequence) appearanceStatus('文件读取失败；原有参考未改动。'); }
    });
    $('#rh_appearance_reference_save').on('click', async () => {
        if (appearanceSaving || !appearanceOwnerIsCurrent()) return;
        appearanceSaving = true;
        $('#rh_appearance_reference_save, #rh_appearance_reference_input, #rh_appearance_reference_file').prop('disabled', true);
        appearanceStatus('正在提取安全的结构摘要并保存……');
        const retainRevision = String(getSettings().appearanceReferenceRevision || '');
        let raw = String($('#rh_appearance_reference_input').val() || '');
        try {
            const module = await import('./appearanceReference.js?rmv=1.5.51-narrow1');
            if (!appearanceOwnerIsCurrent()) return;
            if (String(getSettings().appearanceReferenceRevision || '') !== retainRevision) {
                appearanceStatus('参考关联已改变，本次保存已停止；未写入摘要，也未覆盖当前设置。请核对当前关联后再保存。');
                return;
            }
            const saved = await module.saveAppearanceReference(raw, { retainRevision });
            if (!appearanceOwnerIsCurrent()) return;
            if (String(getSettings().appearanceReferenceRevision || '') !== retainRevision) {
                appearanceStatus('参考关联已改变，摘要可能已写入本设备，但本次保存未覆盖当前设置。请核对当前关联后再保存。');
                return;
            }
            updateSettings({ appearanceReferenceRevision: saved.revision });
            appearanceRecoveryRevision = '';
            $('#rh_appearance_reference_unlink').prop('hidden', true);
            appearanceStatus(`已保存 ${saved.nodeCount} 个结构节点、${saved.ruleCount} 条样式规则，共 ${saved.chars} 字符。原文字和资源已去掉，输入已清空。${getSettings().appearanceReferenceEnabled ? '下一轮生效。' : '当前仍关闭，可勾选上方开关启用。'}`);
        } catch (error) {
            appearanceStatus(`${String(error?.code || '').startsWith('RABBIT_MIRROR_APPEARANCE_') ? error.message : '参考模板保存失败。'} 原有设置保持不变。`);
            showAppearanceRecovery(error, retainRevision);
        } finally {
            raw = ''; clearAppearanceInput(); appearanceSaving = false;
            if (appearanceOwnerIsCurrent()) $('#rh_appearance_reference_save, #rh_appearance_reference_input, #rh_appearance_reference_file').prop('disabled', false);
        }
    });

    const showAdvancedMenu = () => {
        $('.rh-advanced-page').hide();
        $('#rh_advanced_menu').css('display', 'grid');
        $('#rh_advanced_back_top').hide();
        $('#rh_advanced_modal_title').text('高级设置');
        $('#rh_advanced_modal_hint').text('选择要调整的项目');
        const scroll = document.getElementById('rh_advanced_scroll');
        if (scroll) scroll.scrollTop = 0;
    };
    const setAdvancedOpen = open => {
        const modal = $('#rh_advanced_modal');
        modal.attr('aria-hidden', open ? 'false' : 'true');
        modal.css('display', open ? 'flex' : 'none');
    };
    const closeAdvancedModal = () => {
        clearAppearanceInput();
        setAdvancedOpen(false);
        showAdvancedMenu();
    };
    $('#rh_advanced_open').on('click', () => {
        showAdvancedMenu();
        setAdvancedOpen(true);
    });
    $('#rh_advanced_close').on('click', closeAdvancedModal);
    $('#rh_advanced_back_top').on('click', showAdvancedMenu);
    $('#rh_advanced_modal').on('click', function (event) {
        if (event.target === this) closeAdvancedModal();
    });
    const showAdvancedPage = page => {
        const target = $(`#rh_advanced_page_${page}`);
        if (!target.length) return false;
        $('#rh_advanced_menu').hide();
        $('.rh-advanced-page').hide();
        target.show();
        $('#rh_advanced_back_top').show();
        $('#rh_advanced_modal_title').text(String(target.data('title') || '高级设置'));
        $('#rh_advanced_modal_hint').text('修改后按原有规则保存并从后续生成生效');
        const scroll = document.getElementById('rh_advanced_scroll');
        if (scroll) scroll.scrollTop = 0;
        if (page === 'worldinfo') renderWorldInfoBookSettings({ current: true, all: false });
        return true;
    };
    $('.rh-advanced-choice').on('click', function () {
        showAdvancedPage(String($(this).data('page') || ''));
    });
    $('#rh_independent_advanced_open').on('click', () => {
        showAdvancedMenu();
        setAdvancedOpen(true);
        showAdvancedPage('worldinfo');
    });

    const quickStart = document.getElementById('rh_quick_start');
    let guideLoading = false;
    let guideCleanup = null;
    let guideDisposed = false;
    const loadQuickStart = async () => {
        if (!quickStart.open || guideLoading || guideCleanup || guideDisposed) return;
        guideLoading = true;
        try {
            const module = await import('./quickStart.js?rmv=1.5.51-narrow1');
            if (guideDisposed || !quickStart.isConnected || !isCurrentRuntime()) return;
            guideCleanup = module.mountRabbitMirrorQuickStart({
                root: document.getElementById('rabbit_mirror_theater_settings'),
                openAdvanced: page => { showAdvancedMenu(); setAdvancedOpen(true); showAdvancedPage(page); },
                closeAdvanced: closeAdvancedModal,
            });
        } catch {
            if (!guideDisposed && quickStart.isConnected) quickStart.querySelector('.rabbit-mirror-quick-start-body').textContent = '指引暂时未加载，请收起后重试。原有设置仍可使用。';
        } finally { guideLoading = false; }
    };
    quickStart.addEventListener('toggle', loadQuickStart);
    globalThis.__rabbitMirrorQuickStartUiCleanup = () => {
        guideDisposed = true;
        quickStart.removeEventListener('toggle', loadQuickStart);
        guideCleanup?.();
    };

    const setWorldInfoPromptOpen = open => {
        const modal = $('#rh_world_info_prompt_modal');
        modal.attr('aria-hidden', open ? 'false' : 'true');
        modal.css('display', open ? 'flex' : 'none');
    };
    const applyIndependentWorldInfoChoice = enabled => {
        updateSettings({ independentReadGlobalWorldInfo: enabled === true });
        checked('#rh_independent_read_global_world_info', enabled === true);
        setWorldInfoPromptOpen(false);
        toastr?.info?.(enabled ? '已开启世界书读取，从下一轮独立 API 生成生效。' : '暂不读取世界书；之后可在高级设置中随时开启。');
    };
    $('#rh_world_info_prompt_enable').on('click', () => applyIndependentWorldInfoChoice(true));
    $('#rh_world_info_prompt_disable').on('click', () => applyIndependentWorldInfoChoice(false));
    $('#rh_world_info_prompt_close').on('click', () => setWorldInfoPromptOpen(false));
    $('#rh_world_info_prompt_modal').on('click', function (event) { if (event.target === this) setWorldInfoPromptOpen(false); });
    $('#rh_independent_tag_filter_open').on('click', () => setTagFilterOpen(true));
    $('#rh_independent_tag_filter_close, #rh_independent_tag_filter_cancel').on('click', () => setTagFilterOpen(false));
    $('#rh_independent_tag_filter_modal').on('click', function (event) { if (event.target === this) setTagFilterOpen(false); });
    $('#rh_independent_tag_filter_list').on('change', '[data-rh-context-tag]', function () {
        const tag = String($(this).attr('data-rh-context-tag') || '');
        if (!tag) return;
        if (this.checked && !tagFilterDraft.has(tag) && tagFilterDraft.size >= INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT) {
            this.checked = false;
            $('#rh_independent_tag_filter_error').text(`最多只能过滤 ${INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT} 个标签。`);
            return;
        }
        if (this.checked) tagFilterDraft.add(tag); else tagFilterDraft.delete(tag);
        $('#rh_independent_tag_filter_error').text('');
    });
    $('#rh_independent_tag_filter_list').on('click', '[data-rh-remove-context-tag]', function () {
        tagFilterDraft.delete(String($(this).attr('data-rh-remove-context-tag') || ''));
        renderTagFilterDraft();
    });
    const addTagFilterDraft = () => {
        const raw = String($('#rh_independent_tag_filter_input').val() || '').trim();
        const normalized = normalizeIndependentContextExcludedTags([raw]);
        if (!normalized.length) {
            $('#rh_independent_tag_filter_error').text('请输入普通标签名；只允许字母开头以及字母、数字、点、下划线、冒号或连字符。');
            return;
        }
        if (!tagFilterDraft.has(normalized[0]) && tagFilterDraft.size >= INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT) {
            $('#rh_independent_tag_filter_error').text(`最多只能过滤 ${INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT} 个标签。`);
            return;
        }
        tagFilterDraft.add(normalized[0]);
        $('#rh_independent_tag_filter_input').val('');
        $('#rh_independent_tag_filter_error').text('');
        renderTagFilterDraft();
    };
    $('#rh_independent_tag_filter_add').on('click', addTagFilterDraft);
    $('#rh_independent_tag_filter_input').on('keydown', event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        addTagFilterDraft();
    });
    $('#rh_independent_tag_filter_scan').on('click', async () => {
        cancelTagFilterScan();
        const controller = new AbortController();
        tagFilterScanController = controller;
        const epoch = ++tagFilterScanEpoch;
        $('#rh_independent_tag_filter_scan').prop('disabled', true).text('正在扫描…');
        $('#rh_independent_tag_filter_save').prop('disabled', true);
        $('#rh_independent_tag_filter_scan_status').text('正在分批扫描当前聊天已加载的正文源与可见正文…');
        $('#rh_independent_tag_filter_error').text('');
        try {
            const result = await scanCurrentChatIndependentContextTags({ signal: controller.signal });
            if (epoch !== tagFilterScanEpoch || $('#rh_independent_tag_filter_modal').attr('aria-hidden') !== 'false') return;
            tagFilterDetected = new Map((result?.tags || [])
                .map(item => [String(item?.name || ''), Number(item?.count || 0)])
                .filter(([name, count]) => name && count > 0));
            renderTagFilterDraft();
            const total = [...tagFilterDetected.values()].reduce((sum, count) => sum + count, 0);
            const base = result?.available === false
                ? '当前没有可扫描的聊天正文。'
                : (tagFilterDetected.size
                    ? `扫描到 ${tagFilterDetected.size} 种、${total} 个自定义标签；尚未自动勾选。`
                    : '当前聊天已加载正文中没有发现可选自定义标签。');
            $('#rh_independent_tag_filter_scan_status').text(`${base}${result?.truncated ? ' 已达到安全上限，结果可能不完整。' : ''}`);
        } catch (error) {
            if (epoch !== tagFilterScanEpoch || controller.signal.aborted) return;
            $('#rh_independent_tag_filter_scan_status').text(error?.name === 'AbortError' ? String(error?.message || '扫描已取消，请重新扫描。') : '扫描失败，请稍后重试。');
        } finally {
            if (epoch === tagFilterScanEpoch) {
                tagFilterScanController = null;
                $('#rh_independent_tag_filter_scan').prop('disabled', false).text('扫描当前聊天标签');
                $('#rh_independent_tag_filter_save').prop('disabled', false);
            }
        }
    });
    $('#rh_independent_tag_filter_save').on('click', () => {
        const selectedTags = normalizeIndependentContextExcludedTags([...tagFilterDraft]);
        updateSettings({ independentContextExcludedTags: selectedTags });
        renderTagFilterSummary();
        setTagFilterOpen(false);
        toastr?.success?.('标签设置已保存：独立 API 下一轮发送前过滤；跟随当前 API 按隔离开关执行。');
    });
    $('#rh_follow_tag_isolation').on('change', e => {
        const enabled = e.target.checked === true;
        updateSettings({ followTagIsolationEnabled: enabled });
        renderTagFilterSummary();
        syncGenerationModeFields();
        toastr?.info?.(enabled
            ? '跟随标签隔离已开启，从下一轮兔子镜生效；正文与主预设不会被删除。'
            : '跟随标签隔离已关闭；独立 API 的发送前标签过滤设置不受影响。');
    });

    $('input[name="rh_generation_source"]').on('change', e => {
        const generationSource = e.target.value === 'independent' ? 'independent' : 'follow';
        updateSettings({ generationSource });
        clearRabbitMirrorPrompt(generationSource === 'independent' ? 'independent-api' : 'mode-change');
        syncGenerationModeFields();
        refreshRabbitMirrorGenerationMode();
        renderTokenMeter();
        toastr?.info?.(generationSource === 'independent' ? '已切换为独立 API。' : '已切换为跟随当前 API。');
        void refreshNoSendRegexStatus();
        if (generationSource === 'independent') setWorldInfoPromptOpen(true);
    });
    $('input[name="rh_follow_display"]').on('change', e => { updateSettings({ followDisplayMode: e.target.value === 'external' ? 'external' : 'inline' }); refreshRabbitMirrorGenerationMode(); });
    $('input[name="rh_independent_display"]').on('change', e => { updateSettings({ independentDisplayMode: e.target.value === 'external_then_inline' ? 'external_then_inline' : 'external' }); refreshRabbitMirrorGenerationMode(); });
    $('#rh_independent_read_global_world_info').on('change', e => {
        updateSettings({ independentReadGlobalWorldInfo: e.target.checked === true });
        toastr?.info?.(e.target.checked ? '已开启世界书读取，从下一轮生效。' : '已关闭世界书读取，从下一轮生效。');
    });
    $('#rh_independent_include_character_summary').on('change', e => {
        updateSettings({ independentReadCharacterCardSummary: e.target.checked === true });
    });
    $('#rh_independent_include_persona_summary').on('change', e => {
        updateSettings({ independentReadPersonaSummary: e.target.checked === true });
    });
    $('#rh_world_info_all_books').on('toggle', function () {
        if (this.open) renderWorldInfoBookSettings({ current: false, all: true });
        else clearCollapsedAllWorldInfoBookRows();
    });
    $('#rh_world_info_books_fetch').on('click', async function () {
        const button = $(this);
        const status = $('#rh_world_info_books_fetch_status');
        button.prop('disabled', true);
        status.text('正在拉取…');
        try {
            pulledWorldInfoBooks = await fetchWorldInfoBooks();
            renderWorldInfoBookSettings({ current: false, all: true });
            status.text(`已拉取 ${pulledWorldInfoBooks.length} 本`);
            toastr?.success?.(`已拉取 ${pulledWorldInfoBooks.length} 本世界书；列表保留在折叠区内`);
        } catch (error) {
            pulledWorldInfoBooks = [];
            renderWorldInfoBookSettings({ current: false, all: true });
            const message = String(error?.message || error);
            status.text(message.includes('超时') ? '拉取超时' : '拉取失败');
            toastr?.warning?.(message);
        } finally {
            button.prop('disabled', false);
        }
    });
    $('#rh_world_info_book_filters, #rh_world_info_all_book_filters').on('change', '.rh-world-info-book-toggle', function () {
        const index = Number($(this).attr('data-book-index'));
        const container = $(this).closest('#rh_world_info_book_filters, #rh_world_info_all_book_filters');
        const books = container.data('rm-world-info-books') || [];
        const name = String(books[index] || '').trim();
        if (!name) return;
        const nextDisabled = new Set(getSettings().independentWorldInfoDisabledBooks || []);
        if (this.checked) nextDisabled.delete(name);
        else nextDisabled.add(name);
        updateSettings({ independentWorldInfoDisabledBooks: [...nextDisabled] });
        $('.rh-world-info-book-toggle').each(function () {
            if (String($(this).attr('data-book-id') || '') === name) $(this).prop('checked', !nextDisabled.has(name));
        });
        const safeName = escapeHtml(name);
        toastr?.info?.(this.checked ? `已开启「${safeName}」。` : `已关闭「${safeName}」。`);
    });
    $('#rh_independent_import_current').on('click', async function () {
        const connectionRevision=beginIndependentConnectionOperation();
        invalidateIndependentModelPull();
        const button=$(this); button.prop('disabled',true);
        try {
            const imported=await importCurrentSillyTavernConnection({
                isCurrent:()=>independentConnectionOperationIsCurrent(connectionRevision),
            });
            if(!independentConnectionOperationIsCurrent(connectionRevision)) return;
            const fresh=getSettings();
            document.getElementById('rh_independent_profile_refresh')?.click?.();
            syncIndependentProfileSelector(String(fresh.independentConnectionProfileId||''));
            $('#rh_independent_model').val(fresh.independentApiModel||imported?.model||'');
            renderIndependentConnectionStatus();
            const savedModels=getIndependentSavedModels();
            const source={mode:'profile',profileId:String(fresh.independentConnectionProfileId||''),label:String(imported?.name||'当前酒馆连接')};
            renderIndependentModelSelect(savedModels,String($('#rh_independent_model').val()||''),source,{
                statusText:savedModels.length?`已载入 ${savedModels.length} 个酒馆已保存模型；点击“从此酒馆连接拉取模型”可刷新完整列表。`:`已启用酒馆连接「${source.label}」；请点击按钮拉取模型。`,
            });
            refreshRabbitMirrorGenerationMode();
            toastr?.success?.(`已一键配置酒馆连接：${String(imported?.name||'当前连接')}`);
        } catch(error) {
            if(error?.code==='INDEPENDENT_CONNECTION_SELECTION_SUPERSEDED' || !isCurrentRuntime()) return;
            toastr?.error?.(`一键配置失败：${String(error?.message||error)}`);
        } finally { button.prop('disabled',false); }
    });
    $('#rh_independent_use_manual').on('click', () => {
        beginIndependentConnectionOperation();
        invalidateIndependentModelPull();
        const temperature=Number($('#rh_independent_temperature').val());
        const maxTokens=Number($('#rh_independent_max_tokens').val());
        const contextLayers=Number($('#rh_independent_context_layers').val());
        updateSettings({
            independentConnectionProfileId:'',
            independentApiBaseUrl:$('#rh_independent_base').val(),
            independentApiKey:$('#rh_independent_key').val(),
            independentApiModel:$('#rh_independent_model').val(),
            independentApiTemperature:Number.isFinite(temperature)?temperature:0.8,
            independentApiMaxTokens:Number.isFinite(maxTokens)&&maxTokens>0?maxTokens:30000,
            independentContextMaxLayers:Number.isFinite(contextLayers)&&contextLayers>0?contextLayers:20,
        });
        syncIndependentProfileSelector('');
        const source={mode:'manual',baseUrl:String($('#rh_independent_base').val()||'').trim(),apiKey:String($('#rh_independent_key').val()||''),label:'手动 OpenAI 兼容接口'};
        renderIndependentModelSelect([],String($('#rh_independent_model').val()||''),source,{selectCurrent:false,statusText:'已切换为手动接口；请从此手动接口拉取模型，或继续使用手填模型 ID。'});
        renderIndependentConnectionStatus();
        refreshRabbitMirrorGenerationMode();
        toastr?.info?.('已切换为旧手动 OpenAI 兼容接口。');
    });
    const saveIndependentFields = () => {
        const temperature = Number($('#rh_independent_temperature').val());
        const maxTokens = Number($('#rh_independent_max_tokens').val());
        const contextLayers = Number($('#rh_independent_context_layers').val());
        updateSettings({
            independentApiBaseUrl: $('#rh_independent_base').val(),
            independentApiKey: $('#rh_independent_key').val(),
            independentApiModel: $('#rh_independent_model').val(),
            independentApiTemperature: Number.isFinite(temperature) ? temperature : 0.8,
            independentApiMaxTokens: Number.isFinite(maxTokens) && maxTokens > 0 ? maxTokens : 30000,
            independentContextMaxLayers: Number.isFinite(contextLayers) && contextLayers > 0 ? contextLayers : 20,
        });
    };
    const advancedDraft = () => ({
        independentAdvancedEnabled: $('#rh_independent_advanced_enabled').prop('checked') === true,
        independentReasoningEffort: String($('#rh_independent_reasoning_effort').val() || ''),
        independentExtraParams: String($('#rh_independent_extra_params').val() || ''),
        independentExcludedParams: Array.from(document.querySelectorAll('#rh_independent_excluded_params input:checked'), input => input.value),
    });
    const showAdvancedError = message => {
        const error = document.getElementById('rh_independent_advanced_error');
        error.textContent = message;
        error.hidden = !message;
        document.getElementById('rh_independent_extra_params').setAttribute('aria-invalid', message ? 'true' : 'false');
    };
    const validateAdvancedDraft = () => {
        const draft = advancedDraft();
        try {
            if (draft.independentExtraParams.length > 8192) throw new Error('附加参数最多 8192 个字符；请缩短后再保存。');
            const parsed = parseIndependentAdvancedOptions(draft);
            showAdvancedError('');
            return { draft, parsed };
        } catch (error) {
            showAdvancedError(String(error?.message || '高级参数无效；请检查 JSON 对象与参数值。'));
            $('#rh_independent_advanced_status').text('未保存；仍使用上次已保存的设置。');
            return null;
        }
    };
    const renderAdvancedSavedStatus = () => {
        const current = getSettings();
        if (!current.independentAdvancedEnabled) {
            $('#rh_independent_advanced_status').text('已关闭：不追加也不排除参数，保持原请求。');
            return;
        }
        try {
            const parsed = parseIndependentAdvancedOptions(current);
            const count = Object.keys(parsed.body || {}).length;
            const exclusions = parsed.excludedParams?.length || 0;
            $('#rh_independent_advanced_status').text(count || exclusions ? `已保存：追加 ${count} 项，排除 ${exclusions} 项；下一次独立生成生效。` : '已启用，尚未设置覆盖或排除项；保持原请求。');
        } catch (error) {
            showAdvancedError(String(error?.message || '已保存的高级参数无效。'));
            $('#rh_independent_advanced_status').text('已保存的配置需修正；请求前会拦截，不会自动重试。');
        }
    };
    const saveAdvancedDraft = () => {
        const valid = validateAdvancedDraft();
        if (!valid) return false;
        updateSettings(valid.draft);
        renderAdvancedSavedStatus();
        return true;
    };
    $('#rh_independent_advanced_save').on('click', () => {
        if (!saveAdvancedDraft()) document.getElementById('rh_independent_extra_params')?.focus();
    });
    $('#rh_independent_advanced_enabled').on('change', () => {
        if (!saveAdvancedDraft()) checked('#rh_independent_advanced_enabled', getSettings().independentAdvancedEnabled === true);
    });
    $('#rh_independent_reasoning_effort, #rh_independent_extra_params').on('input change', () => {
        showAdvancedError('');
        $('#rh_independent_advanced_status').text('有未保存的修改；点击“保存高级参数”生效。');
    }).on('blur', validateAdvancedDraft);
    $('#rh_independent_excluded_params input').on('change', () => {
        showAdvancedError('');
        $('#rh_independent_advanced_status').text('排除选择尚未保存；点击“保存高级参数”生效。');
    });
    $('#rh_independent_exclude_common').on('click', () => {
        setExcludedSelection(['temperature', 'frequency_penalty', 'presence_penalty', 'top_p']);
        showAdvancedError('');
        $('#rh_independent_advanced_status').text('已选中常用四项；点击“保存高级参数”生效。');
    });
    $('#rh_independent_exclude_none').on('click', () => {
        setExcludedSelection([]);
        showAdvancedError('');
        $('#rh_independent_advanced_status').text('已取消排除选择；点击“保存高级参数”生效。');
    });
    $('#rh_independent_extra_clear').on('click', () => {
        $('#rh_independent_extra_params').val('');
        showAdvancedError('');
        $('#rh_independent_advanced_status').text('已清空编辑框；点击“保存高级参数”生效。');
    });
    $('#rh_independent_advanced_reset').on('click', () => {
        checked('#rh_independent_advanced_enabled', false);
        $('#rh_independent_reasoning_effort').val('');
        $('#rh_independent_extra_params').val('');
        setExcludedSelection([]);
        saveAdvancedDraft();
    });
    renderAdvancedSavedStatus();
    // Do not serialize the whole extension settings object on every mobile input event.
    // Safari may emit repeated input/autofill events as the drawer opens, which made the UI stutter.
    $('#rh_independent_base, #rh_independent_key, #rh_independent_model').on('change blur', saveIndependentFields);
    $('#rh_independent_temperature, #rh_independent_max_tokens, #rh_independent_context_layers').on('change', saveIndependentFields);
    let independentModelListSource=null;
    const independentProfileSourceRevision = () => Number(globalThis.__rabbitMirrorIndependentProfileSourceRevision||0);
    const syncIndependentProfileSelector = profileId => {
        const select=$('#rh_independent_profile_select');
        if(!select.length) return;
        select.val(String(profileId||'').trim());
    };
    const independentModelSourceKey = source => {
        if(source?.mode==='profile') return `profile:${String(source.profileId||'').trim()}`;
        if(source?.mode==='manual') return `manual:${String(source.baseUrl||'').trim()}`;
        return '';
    };
    const independentModelSourceIsActive = source => {
        const current=getSettings();
        if(source?.mode==='profile') return String(current.independentConnectionProfileId||'').trim()===String(source.profileId||'').trim();
        if(source?.mode==='manual') return !String(current.independentConnectionProfileId||'').trim()
            && String(current.independentApiBaseUrl||'').trim()===String(source.baseUrl||'').trim();
        return false;
    };
    const beginIndependentModelPull = source => ({
        epoch:++independentModelPullEpoch,
        profileRevision:independentProfileSourceRevision(),
        activeProfileId:String(getSettings().independentConnectionProfileId||'').trim(),
        source:{...source},
    });
    const independentModelPullIsCurrent = snapshot => {
        return independentModelPullSnapshotMatches(snapshot,{
            epoch:independentModelPullEpoch,
            profileRevision:independentProfileSourceRevision(),
            activeProfileId:String(getSettings().independentConnectionProfileId||'').trim(),
            manualBaseUrl:String($('#rh_independent_base').val()||'').trim(),
            manualApiKey:String($('#rh_independent_key').val()||''),
        });
    };
    const renderIndependentModelSelect = (models, currentModel='', source=null, options={}) => {
        const select=$('#rh_independent_model_select');
        const current=String(currentModel||'').trim();
        const safeModels=Array.isArray(models)?models:[];
        independentModelListSource=source&&independentModelSourceKey(source)?{...source}:null;
        const sourceKey=independentModelSourceKey(independentModelListSource);
        select.attr('data-rh-model-source',sourceKey);
        const placeholder=options.placeholderText || (safeModels.length
            ? `已从${source?.label||'当前来源'}拉取 ${safeModels.length} 个模型，请选择`
            : '请从酒馆连接或手动接口拉取模型');
        select.empty().append($('<option>').val('').text(placeholder));
        for(const id of safeModels){
            select.append($('<option>').val(id).text(id));
        }
        // 只有当前手动模型确实存在于列表时才选中；自定义 ID 保持在文本框，不伪装成列表项。
        const selectCurrent=options.selectCurrent!==false && independentModelSourceIsActive(independentModelListSource);
        select.val(selectCurrent && safeModels.includes(current) ? current : '');
        const sourceText=options.statusText || (independentModelListSource
            ? `模型列表来源：${independentModelListSource.label||'当前来源'}。选择列表模型时，会同时锁定这个连接来源。`
            : '模型列表尚未拉取。列表来源与当前实际模型会分别标明。');
        $('#rh_independent_model_list_source').text(sourceText);
    };
    // Keystrokes only invalidate an in-flight list result; settings are still
    // saved on change/blur, so mobile input keeps the existing low-work path.
    $('#rh_independent_base, #rh_independent_key, #rh_independent_model').on('input', invalidateIndependentModelPull);
    $('#rh_independent_base, #rh_independent_key').on('change blur', () => {
        if(independentModelListSource?.mode!=='manual') return;
        const baseUrl=String($('#rh_independent_base').val()||'').trim();
        const apiKey=String($('#rh_independent_key').val()||'');
        if(baseUrl===String(independentModelListSource.baseUrl||'').trim() && apiKey===String(independentModelListSource.apiKey||'')) return;
        invalidateIndependentModelPull();
        const source={mode:'manual',baseUrl,apiKey,label:'手动 OpenAI 兼容接口'};
        renderIndependentModelSelect([],String($('#rh_independent_model').val()||''),source,{
            selectCurrent:false,
            statusText:'手动 API 地址或 Key 已改变；旧模型列表已清空，请重新拉取。',
        });
    });
    $('#rh_independent_model_select').on('change', e => {
        const model=String(e.target.value||'').trim();
        if(!model) return;
        const source=independentModelListSource;
        if(!source || String($(e.target).attr('data-rh-model-source')||'')!==independentModelSourceKey(source)) {
            toastr?.warning?.('这份模型列表的连接来源已失效，请重新拉取后再选择。');
            $(e.target).val('');
            return;
        }
        beginIndependentConnectionOperation();
        invalidateIndependentModelPull();
        $('#rh_independent_model').val(model);
        if(source.mode==='profile') {
            updateSettings({independentConnectionProfileId:String(source.profileId||'').trim(),independentApiKey:'',independentApiModel:model});
            syncIndependentProfileSelector(String(source.profileId||'').trim());
        } else {
            updateSettings({
                independentConnectionProfileId:'',
                independentApiBaseUrl:String(source.baseUrl||'').trim(),
                independentApiKey:String(source.apiKey||''),
                independentApiModel:model,
            });
            syncIndependentProfileSelector('');
        }
        renderIndependentConnectionStatus();
        refreshRabbitMirrorGenerationMode();
        $('#rh_independent_model_list_source').text(`已选择：${source.label||'当前来源'} / ${model}。下一次兔子镜请求将使用此连接与模型。`);
    });
    $('#rh_independent_model').on('change blur', () => {
        invalidateIndependentModelPull();
        const current=String($('#rh_independent_model').val()||'').trim();
        const select=$('#rh_independent_model_select');
        const exists=select.find('option').toArray().some(option=>String(option.value||'')===current);
        select.val(exists ? current : '');
        renderIndependentConnectionStatus();
    });
    $('#rh_independent_models').on('click', async function () {
        const button=$(this); const originalText=button.text();
        const currentSettings=getSettings();
        const profileId=String(currentSettings.independentConnectionProfileId||'').trim();
        const profile=getIndependentConnectionProfiles().find(item=>item.id===profileId);
        if(!profileId || !profile){ toastr?.warning?.('请先一键配置或选择一个酒馆 Connection Profile。'); return; }
        const source={mode:'profile',profileId,label:String(profile.name||'当前酒馆连接')};
        const pullSnapshot=beginIndependentModelPull(source);
        const current=String($('#rh_independent_model').val() || currentSettings.independentApiModel || '').trim();
        const savedModels=getIndependentSavedModels();
        button.prop('disabled',true).text('正在拉取…');
        renderIndependentModelSelect(savedModels,current,source,{statusText:`正在从酒馆连接「${source.label}」刷新模型列表；较慢中转最多等待 30 秒…`});
        try {
            const models=await fetchIndependentModels({mode:'profile',profileId});
            if(!isCurrentRuntime() || !independentModelPullIsCurrent(pullSnapshot)) return;
            renderIndependentModelSelect(models,current,source);
            if(current) {
                $('#rh_independent_model').val(current);
            } else if(models[0]) {
                $('#rh_independent_model').val(models[0]);
                $('#rh_independent_model_select').val(models[0]);
                updateSettings({independentApiModel:models[0]});
            }
            const diagnostic=getLastIndependentModelListDiagnostic();
            if(diagnostic?.mode==='saved-fallback') {
                toastr?.warning?.(`远端模型列表不可用；已显示酒馆连接中保存的 ${models.length} 个模型。${diagnostic.error||''}`);
            } else {
                toastr?.success?.(`已从酒馆连接「${source.label}」拉取 ${models.length} 个模型；选择后兔子镜会使用该模型，正文连接不会切换。`);
            }
        } catch(error) {
            if(!isCurrentRuntime() || !independentModelPullIsCurrent(pullSnapshot)) return;
            // 远端 /models 卡住或失败时保留酒馆已保存模型与手动 ID，不让设置页无限等待。
            renderIndependentModelSelect(savedModels,current,source,{statusText:savedModels.length?`远端拉取失败；已保留「${source.label}」的 ${savedModels.length} 个酒馆已保存模型。`:`从酒馆连接「${source.label}」拉取失败。`});
            if(current) $('#rh_independent_model').val(current);
            const fallbackText=savedModels.length ? `；已保留酒馆中已保存的 ${savedModels.length} 个模型` : '';
            toastr?.warning?.(`模型列表拉取失败${fallbackText}。${String(error?.message||error)}`);
        } finally {
            button.prop('disabled',false).text(originalText);
        }
    });
    $('#rh_independent_manual_models').on('click', async function () {
        const button=$(this); const originalText=button.text();
        const baseUrl=String($('#rh_independent_base').val()||'').trim();
        const apiKey=String($('#rh_independent_key').val()||'');
        if(!baseUrl){ toastr?.warning?.('请先填写手动 API 地址。'); return; }
        const source={mode:'manual',baseUrl,apiKey,label:'手动 OpenAI 兼容接口'};
        const pullSnapshot=beginIndependentModelPull(source);
        const current=String($('#rh_independent_model').val()||getSettings().independentApiModel||'').trim();
        const sourceWasActive=independentModelSourceIsActive(source);
        button.prop('disabled',true).text('正在拉取…');
        renderIndependentModelSelect([],current,source,{selectCurrent:false,statusText:'正在从手动 API 地址拉取模型；不会借用当前酒馆 Profile。'});
        try {
            const models=await fetchIndependentModels({mode:'manual',baseUrl,apiKey});
            if(!isCurrentRuntime() || !independentModelPullIsCurrent(pullSnapshot)) return;
            renderIndependentModelSelect(models,current,source,{selectCurrent:sourceWasActive});
            if(sourceWasActive && !current && models[0]){
                $('#rh_independent_model').val(models[0]);
                $('#rh_independent_model_select').val(models[0]);
                updateSettings({independentConnectionProfileId:'',independentApiBaseUrl:baseUrl,independentApiKey:apiKey,independentApiModel:models[0]});
                renderIndependentConnectionStatus();
            }
            toastr?.success?.(`已从手动接口拉取 ${models.length} 个模型；选择任一模型后会同时切换到这组手动连接。`);
        } catch(error) {
            if(!isCurrentRuntime() || !independentModelPullIsCurrent(pullSnapshot)) return;
            renderIndependentModelSelect([],current,source,{selectCurrent:false,statusText:'从手动 API 地址拉取失败；手填模型 ID 仍会保留。'});
            toastr?.warning?.(`手动接口模型列表拉取失败。${String(error?.message||error)}`);
        } finally {
            button.prop('disabled',false).text(originalText);
        }
    });
    $('#rh_independent_test').on('click', async () => {
        saveIndependentFields();
        const result=await testIndependentConnection();
        if(result.verified) {
            toastr?.success?.(`模型列表端点可用；检测到 ${result.models.length} 个模型`);
            return;
        }
        if(result.code==='MODEL_LIST_SAVED_FALLBACK') {
            toastr?.warning?.(`远端模型列表不可用；已确认兔子镜仍保留该酒馆连接中保存的 ${result.models.length} 个模型。${result.error||''}`);
            return;
        }
        const manualModel=String($('#rh_independent_model').val() || result.manualModel || '').trim();
        toastr?.[manualModel ? 'warning' : 'error']?.(manualModel
            ? `无法用 /models 验证；已保留模型「${manualModel}」。可直接生成测试。${result.error}`
            : `连接检测未通过：${result.error}`);
    });

    $('#rh_enabled').on('change', e => { updateSettings({ enabled: e.target.checked, autoRabbitMirrorInjection: e.target.checked, mode: e.target.checked ? 'integrated' : 'off' }); if (e.target.checked) syncFeedbackCatExtensionPrompt(getActiveFeedbackForCurrentChat()); else clearFeedbackCatExtensionPrompt(); refreshRabbitMirrorGenerationMode(); });
    $('#rh_feedback_cat').on('change', e => {
        updateSettings({ feedbackCatEnabled: e.target.checked });
        if (e.target.checked) syncFeedbackCatExtensionPrompt(getActiveFeedbackForCurrentChat());
        else clearFeedbackCatExtensionPrompt();
        refreshFeedbackCats();
        toastr?.[e.target.checked ? 'info' : 'success']?.(e.target.checked
            ? '挨打猫已启用：每条兔子镜会显示独立的 🐈，没有反馈时不会追加 Prompt。'
            : '挨打猫已关闭：标题入口已移除，已保存反馈暂停注入。');
    });
    $('#rh_maintenance_rabbit').on('change', e => {
        const enabled = !!e.target.checked;
        updateSettings({
            maintenanceRabbitEnabled: enabled,
            ...(enabled ? {} : { maintenanceRabbitAutoSafeEnabled: false, maintenanceRabbitAutoSafeConsent: false }),
        });
        if (!enabled) {
            checked('#rh_maintenance_auto_safe', false);
            configureMaintenanceAutoSafeMode(false);
        }
        refreshMaintenanceRabbits();
        toastr?.[enabled ? 'info' : 'success']?.(enabled
            ? '维修兔已启用：每条兔子镜会显示独立的 🐇⚪；默认仍为手动巡逻。'
            : '维修兔已关闭：自动巡逻同时关闭，标题入口已移除。');
    });
    $('#rh_maintenance_auto_safe').on('change', e => {
        const enabled = !!e.target.checked;
        if (enabled) checked('#rh_maintenance_rabbit', true);
        updateSettings({
            maintenanceRabbitEnabled: enabled ? true : getSettings().maintenanceRabbitEnabled,
            maintenanceRabbitAutoSafeEnabled: enabled,
            maintenanceRabbitAutoSafeConsent: enabled,
        });
        configureMaintenanceAutoSafeMode(enabled);
        refreshMaintenanceRabbits();
        toastr?.[enabled ? 'info' : 'success']?.(enabled
            ? '自动巡逻已开启，只自动修简单问题。'
            : '自动巡逻已关闭：维修兔恢复为纯手动模式。');
    });

    $('#rh_enhanced_visual_drawing').on('change', e => {
        updateSettings({ enhancedVisualDrawing: e.target.checked === true });
    });
    $('#rh_multiface_enabled').on('change', e => {
        const enabled = e.target.checked === true;
        const count = Number($('#rh_multiface_count').val());
        updateSettings({ rabbitMirrorFaceCount: enabled && Number.isInteger(count) && count >= 2 && count <= 5 ? count : enabled ? 2 : 1 });
        $('#rh_multiface_count_row').prop('hidden', !enabled);
        $('#rh_multiface_count').prop('disabled', !enabled);
    });
    $('#rh_multiface_count').on('change', e => {
        if ($('#rh_multiface_enabled').prop('checked') === true) updateSettings({ rabbitMirrorFaceCount: Number(e.target.value) });
    });

    $('#rh_visual_prompt_enabled').on('change', e => {
        const enabled = !!e.target.checked;
        updateSettings({ visualPromptEditingEnabled: enabled });
        renderVisualPromptStatus(getSettings());
        toastr?.[enabled ? 'info' : 'success']?.(enabled
            ? '视觉提示词编辑注入已启用：从下一面兔子镜开始使用已保存的可编辑视觉层。'
            : '自定义视觉已关闭；从下一面恢复默认规则。');
    });

    $('#rh_visual_prompt_save').on('click', () => {
        const visualPrompt = String($('#rh_visual_prompt').val() ?? '').replace(/\r\n?/g, '\n').slice(0, VISUAL_PROMPT_MAX_CHARS);
        const visualExtraPrompt = String($('#rh_visual_extra_prompt').val() ?? '').replace(/\r\n?/g, '\n').slice(0, VISUAL_EXTRA_PROMPT_MAX_CHARS);
        const visualAvoidPrompt = String($('#rh_visual_avoid_prompt').val() ?? '').replace(/\r\n?/g, '\n').slice(0, VISUAL_AVOID_PROMPT_MAX_CHARS);
        updateSettings({ visualPrompt, visualExtraPrompt, visualAvoidPrompt });
        renderVisualPromptStatus(getSettings());
        const total = visualPrompt.length + visualExtraPrompt.length + visualAvoidPrompt.length;
        if (getSettings().visualPromptEditingEnabled && !visualPrompt.trim()) {
            toastr?.warning?.(`已保存（${total} 字符），但默认视觉规则是空的；建议恢复默认。`);
        } else {
            toastr?.success?.(getSettings().visualPromptEditingEnabled
                ? `视觉提示词已保存（${total} 字符），编辑注入已开启，将从下一面兔子镜开始生效。`
                : `视觉提示词已保存（${total} 字符），但编辑注入当前关闭；不会发送给模型。`);
        }
    });
    $('#rh_visual_prompt_reset').on('click', () => {
        $('#rh_visual_prompt').val(DEFAULT_VISUAL_PROMPT);
        updateSettings({ visualPrompt: DEFAULT_VISUAL_PROMPT });
        renderVisualPromptStatus(getSettings());
        toastr?.success?.('已恢复默认视觉规则；额外视觉偏好与避雷内容保持不变。');
    });

    $('#rh_memory_scan_enabled').on('change', e => {
        updateSettings({ memoryScanEnabled: e.target.checked });
        renderMemoryWorldBookBinding();
        toastr?.[e.target.checked ? 'info' : 'success']?.(e.target.checked
            ? '已开启共同回忆额外资料读取：只有抽中 I.1 时才会读取已勾选来源。'
            : '已关闭额外资料读取；扫描结果和勾选记录会保留。');
    });
    $('#rh_memory_scan_now').on('click', () => {
        const results = scanMemoryPlugins();
        renderMemoryScanResults(results);
        const readableCount = results.filter(item => item.readable).length;
        const pendingCount = results.length - readableCount;
        toastr?.info?.(`扫描完成：${readableCount} 个可读取${pendingCount ? `，${pendingCount} 个其他候选已收起` : ''}。`);
    });
    $('#rh_memory_worldbook_refresh').on('click', refreshMemoryWorldBookDirectory);
    $('#rh_memory_worldbook_enabled').on('change', e => {
        updateSettings({ memoryWorldBookEnabled: e.target.checked });
        renderMemoryWorldBookBinding();
    });
    $('#rh_memory_worldbook_id').on('change', e => {
        updateSettings({ memoryWorldBookId: e.target.value });
        renderMemoryWorldBookBinding();
    });
    $('#rh_memory_worldbook_clear').on('click', () => {
        updateSettings({ memoryWorldBookId: '' });
        renderMemoryWorldBookBinding('绑定已清空，不会读取记忆世界书；其他已勾选记忆插件来源保持不变。');
    });
    $('#rh_memory_scan_results').on('change', '.rh-memory-provider-check', function () {
        const id = String($(this).data('provider-id') || '');
        const current = new Set(getSettings().memoryProviderIds || []);
        if (this.checked) current.add(id); else current.delete(id);
        updateSettings({ memoryProviderIds: [...current] });
    });
    $('#rh_memory_scan_results').on('click', '.rh-memory-test', function () {
        const id = String($(this).data('provider-id') || '');
        const result = testMemoryProvider(id);
        if (result.ok) toastr?.success?.(memoryTestMessage(result));
        else toastr?.error?.(memoryTestMessage(result));
    });

    $('#rh_sampling_mode').on('change', e => updateSettings({ samplingMode: e.target.value }));
    $('#rh_raw_policy').on('change', e => updateSettings({ rawPolicy: e.target.value }));
    $('#rh_user_directive').on('change', e => updateSettings({ userDirectivePriority: e.target.checked }));
    $('#rh_worldview_lock').on('change', e => {
        const enabled = !!e.target.checked;
        if (!enabled) {
            updateSettings({ presentationWorldviewLock: false });
            toastr?.info?.('展现形式世界观锁已关闭。');
            return;
        }
        const currentMode = String(getSettings().samplingMode || 'classic');
        if (currentMode !== 'format_only') {
            const accepted = globalThis.confirm?.('开启“展现形式世界观锁”时，建议把抽取模式改为“仅展现形式”，这样不会再随机抽取主题元素。\n\n是否现在切换为“仅展现形式”？') !== false;
            if (!accepted) {
                e.target.checked = false;
                return;
            }
            updateSettings({ presentationWorldviewLock: true, samplingMode: 'format_only' });
            $('#rh_sampling_mode').val('format_only');
            toastr?.info?.('展现形式世界观锁已开启，并已把抽取模式切换为“仅展现形式”。');
            return;
        }
        updateSettings({ presentationWorldviewLock: true });
        toastr?.info?.('展现形式世界观锁已开启。');
    });
    $('#rh_creative_expansion').on('change', e => updateSettings({ creativeExpansionMode: e.target.checked }));
    $('#rh_force_visual_scenery').on('change', e => updateSettings({ forceVisualScenery: e.target.checked }));
    $('#rh_avoid_repeat').on('change', e => updateSettings({ avoidRepeat: e.target.checked }));
    $('#rh_random_preference_section').on('toggle', function () {
        if (!this.open) return;
        renderBlacklistSettings();
        renderFavoriteSettings();
    });
    $('#rh_blacklist_enabled').on('change', e => {
        setBlacklistEnabled(e.target.checked);
        renderBlacklistSettings();
        toastr?.info?.(e.target.checked ? '黑名单已开启。' : '黑名单已暂停，名单仍保留。');
    });
    $('#rh_blacklist_summary').on('click', '.rh-blacklist-remove', function () {
        const kind = String($(this).data('kind') || '') === 'format' ? 'format' : 'theme';
        const id = String($(this).data('id') || '');
        if (removeBlacklistItem(kind, id)) toastr?.success?.(`已解除黑名单：${id}`);
        renderBlacklistSettings();
        refreshRecipeButtons();
    });
    $('#rh_blacklist_clear').on('click', () => {
        clearBlacklist('all');
        renderBlacklistSettings();
        refreshRecipeButtons();
        toastr?.success?.('已清空全部抽签黑名单');
    });
    $('#rh_favorite_summary').on('change', '.rh-favorite-multiplier', function () {
        const kind = String($(this).data('kind') || '') === 'format' ? 'format' : 'theme';
        const id = String($(this).data('id') || '');
        const multiplier = setFavoriteMultiplier(kind, id, $(this).val());
        if (multiplier == null) toastr?.warning?.(`收藏倍率没有修改：${id}`);
        else toastr?.success?.(`收藏倍率已更新：${id} ×${multiplier}`);
        renderFavoriteSettings();
        refreshRecipeButtons();
    });
    $('#rh_favorite_summary').on('click', '.rh-favorite-remove', function () {
        const kind = String($(this).data('kind') || '') === 'format' ? 'format' : 'theme';
        const id = String($(this).data('id') || '');
        if (removeFavoriteItem(kind, id)) toastr?.success?.(`已取消收藏：${id}`);
        renderFavoriteSettings();
        refreshRecipeButtons();
    });
    $('#rh_favorite_clear').on('click', () => {
        clearFavorites('all');
        renderFavoriteSettings();
        refreshRecipeButtons();
        toastr?.success?.('已清空全部收藏');
    });

    const libraryEntryViews = { rh_external_plain_open: 'plain', rh_external_file_open: 'file', rh_external_transfer_open: 'transfer', rh_external_worldbook_open: 'manage' };
    let libraryOpening = false;
    for (const [id, initialView] of Object.entries(libraryEntryViews)) {
        const button = document.getElementById(id);
        const label = button.textContent;
        button.addEventListener('click', async () => {
            if (libraryOpening) return;
            libraryOpening = true;
            for (const key of Object.keys(libraryEntryViews)) document.getElementById(key).disabled = true;
            button.textContent = '正在加载…';
            try {
                const module = await import('./externalWorldBook/importWizard.js?rmv=1.5.51-narrow1');
                if (!isCurrentRuntime() || !button.isConnected) return;
                module.openExternalWorldBookImportWizard?.({ initialView });
            } catch (error) {
                console.error('[RabbitMirror] library tool failed:', error);
                toastr?.warning?.('母本库暂时未能打开，请再点一次。现有库不会改变。');
            } finally {
                libraryOpening = false;
                for (const key of Object.keys(libraryEntryViews)) {
                    const entry = document.getElementById(key);
                    if (entry) entry.disabled = false;
                }
                button.textContent = label;
            }
        });
    }

    const setNoSendRegexStatus = (text, tone = '') => {
        $('[data-rh-no-send-regex-status]').text(text).css('opacity', tone === 'ok' ? '.92' : '.78');
    };
    const refreshNoSendRegexStatus = async () => {
        if (getSettings().generationSource !== 'follow') {
            setNoSendRegexStatus('不发送兔子镜正则：独立 API 不依赖此正则。');
            return;
        }
        setNoSendRegexStatus('不发送兔子镜正则：正在检测…');
        const result = await inspectRabbitMirrorNoSendRegex();
        if (!result?.available) {
            setNoSendRegexStatus('未检测到酒馆 Regex 功能；可继续使用“复制推荐正则”。');
            return;
        }
        if (result.status === 'read-failed') setNoSendRegexStatus('无法安全读取酒馆 Regex 列表；未修改配置，可使用“复制推荐正则”。');
        else if (result.status === 'configured') setNoSendRegexStatus(result.disabled === true
            ? '✓ 正则已配置，但酒馆 Regex 当前被禁用。'
            : result.disabled === false ? '✓ 不发送兔子镜正则已配置。'
                : '✓ 正则已配置；无法确认酒馆 Regex 是否启用，请到扩展设置检查。', result.disabled === false ? 'ok' : '');
        else if (result.status === 'managed-update') setNoSendRegexStatus('检测到 RabbitMirror 旧配置，可一键更新。');
        else if (result.status === 'conflict') setNoSendRegexStatus('检测到同名但已修改的正则；为避免覆盖，请先查看酒馆正则。');
        else setNoSendRegexStatus('尚未配置不发送兔子镜正则。');
    };
    $('.rh_regex_configure').on('click', async function () {
        const buttons = $('.rh_regex_configure');
        buttons.prop('disabled', true);
        setNoSendRegexStatus('正在配置不发送兔子镜正则…');
        try {
            const result = await configureRabbitMirrorNoSendRegex();
            if (!result?.available) {
                setNoSendRegexStatus('未检测到酒馆 Regex 功能；可使用“复制推荐正则”。');
                toastr?.warning?.('未检测到酒馆 Regex 功能。');
            } else if (result.status === 'conflict') {
                setNoSendRegexStatus('检测到同名但已修改的正则；没有自动覆盖。');
                toastr?.warning?.('发现同名自定义正则，为避免覆盖已停止自动配置。');
            } else if (!result.ok) {
                const message = result.saveAttempted
                    ? '已尝试写入，但无法确认保存结果；请查看酒馆 Regex，不会自动重试。'
                    : '无法安全读取酒馆 Regex 列表；未修改任何正则，可使用“复制推荐正则”。';
                setNoSendRegexStatus(message);
                toastr?.warning?.(message);
            } else {
                const message = result.status === 'updated' ? '不发送兔子镜正则已更新。' : '不发送兔子镜正则已配置。';
                const enabledHint = result.disabled === true ? '酒馆 Regex 当前被禁用，请先启用该扩展。'
                    : result.disabled === false ? '' : '无法确认酒馆 Regex 是否启用，请到扩展设置检查。';
                const listHint = '若酒馆正则列表未刷新，请刷新页面后查看。';
                const notice = `${message} ${enabledHint} ${listHint}`.replace(/\s+/g, ' ').trim();
                setNoSendRegexStatus(`✓ ${notice}`, result.disabled === false ? 'ok' : '');
                toastr?.[result.disabled === false ? 'success' : 'warning']?.(notice);
            }
        } catch (error) {
            console.error('[RabbitMirror] regex auto-config failed:', error);
            setNoSendRegexStatus('一键配置失败，可使用“复制推荐正则”。');
            toastr?.warning?.(`正则配置失败：${String(error?.message || error)}`);
        } finally {
            buttons.prop('disabled', false);
        }
    });
    $('.rh_regex_open').on('click', async () => {
        const result = await openSillyTavernRegexSettings();
        if (!result?.ok) toastr?.warning?.('未能自动打开酒馆 Regex 界面，请从魔法棒扩展菜单打开 Regex。');
        else toastr?.info?.('已打开酒馆 Regex 区域；若列表未显示最新配置，请刷新页面后查看。');
    });
    $('#rh_banned_words_save').on('click', () => {
        const words = normalizeRabbitMirrorBannedWords(parseRabbitMirrorReplacementLines($('#rh_banned_words').val()));
        updateSettings({ rabbitMirrorBannedWords: words });
        $('#rh_banned_words').val(formatRabbitMirrorReplacementLines(words));
        $('#rh_banned_words_status').text(`已保存 ${words.length} / ${RABBIT_MIRROR_BANNED_WORD_MAX_COUNT} 个词；从下一面生效`);
        toastr?.success?.(words.length ? `禁词表已保存 ${words.length} 个词，从下一面兔子镜生效。` : '禁词表已清空。');
    });
    $('#rh_replacement_add').on('click', () => {
        const find = String($('#rh_replacement_find').val() || '').trim();
        const replace = String($('#rh_replacement_value').val() || '').trim();
        if (!find) { toastr?.warning?.('先填写要查找的原文。'); return; }
        const rules = normalizeRabbitMirrorBannedWords([
            ...parseRabbitMirrorReplacementLines($('#rh_banned_words').val()), { find, replace },
        ]);
        $('#rh_banned_words').val(formatRabbitMirrorReplacementLines(rules));
        $('#rh_banned_words_status').text('已添加到列表，请点击“保存禁词表”保存。');
        $('#rh_replacement_find').val('');
        $('#rh_replacement_value').val('');
    });
    void refreshNoSendRegexStatus();

    $('#rh_copy_regex').on('click', async () => {
        try {
            await navigator.clipboard.writeText(noSendRegex);
            toastr?.success?.('已复制推荐正则');
        } catch (error) {
            const textarea = document.createElement('textarea');
            textarea.value = noSendRegex;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            toastr?.success?.('已复制推荐正则');
        }
    });

    $('#rh_clear_last').on('click', () => {
        clearLastCombo();
        toastr?.success?.('已清除抽签历史与冷却记录');
    });
    $('#rh_clear_injection').on('click', () => {
        clearRabbitMirrorPrompt('manual');
        toastr?.success?.('已清空当前兔子镜注入');
    });
    // Memory-provider discovery can be expensive on mobile. Never rescan merely because
    // the settings drawer was mounted/opened; scan only from the explicit button.
    if (settings.memoryScanEnabled || (settings.memoryProviderIds || []).length) {
        $('#rh_memory_scan_results').html('<div style="padding:8px 0;opacity:.68;font-size:11px;line-height:1.45;">已保存资料来源设置。需要刷新列表时请点击“扫描可用资料来源”。</div>');
    }

    let externalDiagnosticUiRevision = 0;
    const externalDiagnosticStatusText = (state, prefix = '诊断中') => `${prefix}｜原始事件 ${Number(state?.entries || 0)} 条（不是报告数）｜分类：外部资源 ${Number(state?.externalResources || 0)}｜外部长帧 ${Number(state?.externalLoaf || 0)}｜主线程阻塞 ${Number(state?.stalls || 0)}｜网络 ${Number(state?.network || 0)}｜维修点击窗口 ${Number(state?.maintenanceWindows || 0)}`;
    const renderExternalDiagnosticStatus = () => {
        const api = globalThis.__rabbitMirrorExternalDiag;
        const target = $('#rh_external_diag_status');
        if (!target.length) return;
        if (!api?.status) {
            target.text(retainedExternalDiagnosticReport && retainedExternalDiagnosticStatus
                ? externalDiagnosticStatusText(retainedExternalDiagnosticStatus, '已结束并保留最后报告')
                : '默认关闭（零常驻监听）；需要复现问题时再手动开启。');
            return;
        }
        const state = api.status();
        target.text(externalDiagnosticStatusText(state));
    };
    const ensureExternalDiagnosticApi = async () => {
        const existing = globalThis.__rabbitMirrorExternalDiag;
        if (existing?.status) return existing;
        return await globalThis.__rabbitMirrorEnsureExternalDiag?.();
    };
    const renderExternalDiagnosticReport = async () => {
        const api = globalThis.__rabbitMirrorExternalDiag;
        const output = $('#rh_external_diag_output');
        const text = api?.report ? String(api.report() || '') : retainedExternalDiagnosticReport;
        if (!text) { toastr?.error?.('请先开始外部诊断，复现问题后再结束并生成报告'); return ''; }
        output.val(text).show();
        renderExternalDiagnosticStatus();
        return text;
    };
    $('#rh_external_diag_start').on('click', async () => {
        const revision = ++externalDiagnosticUiRevision;
        const api = await ensureExternalDiagnosticApi();
        if (revision !== externalDiagnosticUiRevision) return;
        if (!api) { toastr?.error?.('外部诊断模块启动失败'); return; }
        retainedExternalDiagnosticReport = '';
        retainedExternalDiagnosticStatus = null;
        api.reset?.('user-start');
        $('#rh_external_diag_output').hide().val('');
        renderExternalDiagnosticStatus();
        toastr?.success?.('外部诊断已开始；已保留本页最近的副 API 传输摘要，无需为查看它重新生成。页面性能需开启后记录。');
    });
    $('#rh_external_diag_stop').on('click', () => {
        externalDiagnosticUiRevision += 1;
        const api = globalThis.__rabbitMirrorExternalDiag;
        const report = api?.report?.();
        const status = api?.status?.();
        if (report) retainedExternalDiagnosticReport = String(report);
        if (status) retainedExternalDiagnosticStatus = { ...status };
        globalThis.__rabbitMirrorDisableExternalDiag?.();
        if (retainedExternalDiagnosticReport) $('#rh_external_diag_output').val(retainedExternalDiagnosticReport).show();
        renderExternalDiagnosticStatus();
        toastr?.success?.(retainedExternalDiagnosticReport
            ? '外部诊断已结束并保留报告；常驻监听和定时器已移除'
            : '外部诊断未在运行；没有可生成的记录');
    });
    $('#rh_external_diag_report').on('click', async () => { await renderExternalDiagnosticReport(); });
    $('#rh_external_diag_copy').on('click', async () => {
        const text = await renderExternalDiagnosticReport();
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            toastr?.success?.('已复制外部代码／宿主性能诊断报告');
        } catch {
            const output = document.getElementById('rh_external_diag_output');
            output?.focus?.(); output?.select?.();
            try { document.execCommand('copy'); toastr?.success?.('已复制外部代码／宿主性能诊断报告'); }
            catch { toastr?.error?.('复制失败，请手动复制报告'); }
        }
    });
    $('#rh_external_diag_reset').on('click', () => {
        clearRecentIndependentTransportDiagnostics();
        const api = globalThis.__rabbitMirrorExternalDiag;
        api?.reset?.('settings-button');
        retainedExternalDiagnosticReport = '';
        retainedExternalDiagnosticStatus = null;
        $('#rh_external_diag_output').hide().val('');
        renderExternalDiagnosticStatus();
        toastr?.success?.(api ? '已清空外部诊断记录，从现在重新记录' : '已清空最后保留的外部诊断报告');
    });
    renderExternalDiagnosticStatus();

    installTtDiagnosticEntry();

    $('#rh_reset').on('click', () => {
        resetSettings();
        location.reload();
    });
    $('#rabbit_mirror_theater_settings').attr('data-rabbit-mirror-ui-ready', 'true');
    finishUiInit?.({ outcome: 'mounted' });
}

export function destroyRabbitMirrorUI() {
    memoryWorldBookDirectorySequence += 1;
    memoryWorldBookDirectory = [];
    memoryWorldBookDirectoryLoaded = false;
    memoryWorldBookDirectoryBusy = false;
    invalidateIndependentModelPull();
    beginIndependentConnectionOperation();
    try { globalThis.__rabbitMirrorTtDiagnosticUiCleanup?.(); } catch {}
    try { globalThis.__rabbitMirrorQuickStartUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorQuickStartUiCleanup = null;
    try { globalThis.__rabbitMirrorTagFilterScanUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorTagFilterScanUiCleanup = null;
    $('#rh_advanced_modal, #rh_world_info_prompt_modal, #rh_independent_tag_filter_modal').remove();
    try { document.getElementById('rh_external_worldbook_import_modal')?.remove?.(); } catch {}
    if (uiMountRetryTimer) {
        clearTimeout(uiMountRetryTimer);
        uiMountRetryTimer = 0;
    }
    uiMountRetryCount = 0;
    try { globalThis.__rabbitMirrorTokenMeterUiCleanup?.(); } catch {}
    try { globalThis.__rabbitMirrorBlacklistUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorBlacklistUiCleanup = null;
    globalThis.__rabbitMirrorTokenMeterUiCleanup = null;
    try { globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup = null;
    try { globalThis.__rabbitMirrorWorldInfoBooksUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorWorldInfoBooksUiCleanup = null;
    clearWorldInfoBookRenderTimer();
    disconnectWorldInfoBookVisibilityObserver();
    worldInfoBookCurrentDirty = true;
    $('#rabbit_mirror_theater_settings').remove();
}
