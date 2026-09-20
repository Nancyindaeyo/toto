import { SETTINGS_UI_VERSION, RUNTIME_VERSION, escapeHtml, isCurrentRuntime } from './ui/runtime.js?rmv=1.5.62';
import { buildRabbitMirrorSettingsDialogHtml, buildWorldInfoPromptModalHtml, buildTagFilterModalHtml } from './ui/settingsTemplate.js?rmv=1.5.62';
import { attachIndependentApiDiagnosticListener, attachTokenMeterListener, renderIndependentApiDiagnostic, renderTokenMeter } from './ui/tokenMeter.js?rmv=1.5.62';
import { attachWorldInfoBooksListener, clearCollapsedAllWorldInfoBookRows, clearPulledWorldInfoBooks, installWorldInfoBookVisibilityObserver, pullAllWorldInfoBooks, renderWorldInfoBookSettings, resetWorldInfoBookUiState } from './ui/worldInfoBooks.js?rmv=1.5.62';
import { installTtDiagnosticEntry } from './ui/ttDiagnostics.js?rmv=1.5.62';

import { normalizePresentationModes } from './presentationMode.js?rmv=1.5.53-visualquick1';
import { DEFAULT_INDEPENDENT_CONTEXT_EXCLUDED_TAGS, DEFAULT_VISUAL_PROMPT, INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT, RABBIT_MIRROR_BANNED_WORD_MAX_COUNT, VISUAL_AVOID_PROMPT_MAX_CHARS, VISUAL_EXTRA_PROMPT_MAX_CHARS, VISUAL_PROMPT_MAX_CHARS, getSettings, normalizeIndependentContextExcludedTags, normalizeRabbitMirrorBannedWords, updateSettings, resetSettings } from './settings.js?rmv=1.5.60-fork1';
import { clearLastCombo, getCurrentChatKey } from './storage.js?rmv=1.5.53-visualquick1';
import { normalizeEarlyBodyTags } from './earlyBodyTags.js?rmv=1.5.53-cn-boundary1';
import { independentGenerationTiming } from './independentTiming.js?rmv=1.5.53-timing1';
import { applyRabbitMirrorHostSurface } from './hostCompatibility.js?rmv=1.5.58-fork1';
import { DEFAULT_BEHAVIOR_RULE_TEXT, resolveBehaviorRuleText } from './behaviorRules.js?rmv=1.5.53-cn-boundary1';
import { clearRecentIndependentTransportDiagnostics } from './transportDiagnostics.js?rmv=1.5.53-cn-boundary1';
import { parseIndependentAdvancedOptions } from './advancedRequestOptions.js?rmv=1.5.53-cn-boundary1';
import { parseRabbitMirrorReplacementLines, formatRabbitMirrorReplacementLines } from './bannedWords.js?rmv=1.5.53-cn-boundary1';
import { clearRabbitMirrorPrompt, startManualEntryDiagnostic, stopManualEntryDiagnostic, getManualEntryDiagnosticState } from './injector.js?rmv=1.5.53-image1';
import { clearFeedbackCatExtensionPrompt, getActiveFeedbackForCurrentChat, syncFeedbackCatExtensionPrompt } from './feedbackCat.js?rmv=1.5.53-cn-boundary1';
import { configureMaintenanceAutoSafeMode, refreshMaintenanceRabbits } from './outputSanitizer.js?rmv=1.5.62';
import { scanMemoryPlugins, testMemoryProvider } from './memoryScanner.js?rmv=1.5.53-cn-boundary1';
import { fetchIndependentModels, getIndependentConnectionProfiles, getIndependentSavedModels, getLastIndependentModelListDiagnostic, hydrateIndependentFavoriteHtml, importCurrentSillyTavernConnection, refreshRabbitMirrorGenerationMode, scanCurrentChatIndependentContextTags, testIndependentConnection } from './independentApi.js?rmv=1.5.62';
import { configureRabbitMirrorNoSendRegex, inspectRabbitMirrorNoSendRegex, openSillyTavernRegexSettings } from './regexConfigurator.js?rmv=1.5.53-cn-boundary1';
import { BLACKLIST_CHANGED_EVENT, blacklistEntries, blacklistPoolStats, clearBlacklist, removeBlacklistItem, setBlacklistEnabled, favoriteEntries, removeFavoriteItem, setFavoriteMultiplier, clearFavorites } from './blacklist.js?rmv=1.5.53-image1';
import { THEATER_FAVORITES_CHANGED_EVENT, deleteTheaterFavorite, groupTheaterFavoritesByCharacter, listTheaterFavorites, openTheaterFavoriteLibrary, openTheaterFavoriteViewer } from './theaterFavorites.js?rmv=1.5.60-fork1';

import { mountSettingsAppearance, destroySettingsAppearance } from './settingsAppearance.js?rmv=1.5.60-fork1';

let uiMountRetryTimer = 0;
let uiMountRetryCount = 0;
let retainedExternalDiagnosticReport = '';
let retainedExternalDiagnosticStatus = null;
let memoryWorldBookDirectory = [];
let memoryWorldBookDirectoryLoaded = false;
let memoryWorldBookDirectoryBusy = false;
let memoryWorldBookDirectorySequence = 0;
// Commit settings synchronously; let the checkbox paint before refreshing chat tools.
// All three legacy refresh exports rebuild the same tools, so one pending pass
// reads the latest flags for rapid changes instead of scanning the chat repeatedly.
let settingsToolsRefreshPending = false;
function scheduleSettingsToolsRefresh() {
    if (settingsToolsRefreshPending) return;
    settingsToolsRefreshPending = true;
    const refresh = () => {
        settingsToolsRefreshPending = false;
        if (isCurrentRuntime()) refreshMaintenanceRabbits();
    };
    if (typeof globalThis.requestAnimationFrame === 'function') {
        globalThis.requestAnimationFrame(() => setTimeout(refresh, 0));
    } else setTimeout(refresh, 0);
}

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

async function renderTheaterFavoriteSettings() {
    const target = $('#rh_theater_favorite_summary');
    if (!target.length) return;
    try {
        const rows = await listTheaterFavorites();
        if (!target.length) return;
        const groups = groupTheaterFavoritesByCharacter(rows);
        if (!groups.length) {
            target.html('<div style="opacity:.55;font-size:11px;padding:3px 0;">暂无成品收藏。可点标题旁的星标收藏本面，再从这里或「打开收藏夹」回看。</div>');
            return;
        }
        target.html(groups.map(group => `<div style="margin-top:8px;">
      <div style="font-weight:700;font-size:11px;opacity:.8;margin-bottom:4px;">${escapeHtml(group.characterName)}（${group.items.length}）</div>
      ${group.items.map(item => `<div style="display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid color-mix(in srgb,currentColor 10%,transparent);">
      <span style="min-width:0;flex:1;overflow-wrap:anywhere;">${escapeHtml(item.title)} <small style="opacity:.62;">${escapeHtml(item.mode)}</small></span>
      <button type="button" class="menu_button rh-theater-favorite-open" data-id="${escapeHtml(item.id)}" style="padding:2px 7px;min-height:28px;">打开</button>
      <button type="button" class="menu_button rh-theater-favorite-remove" data-id="${escapeHtml(item.id)}" style="padding:2px 7px;min-height:28px;">删除</button>
    </div>`).join('')}
    </div>`).join(''));
    } catch (error) {
        target.html(`<div style="opacity:.7;font-size:11px;">${escapeHtml(error?.message || '收藏夹无法读取。')}</div>`);
    }
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
        const { listMemoryWorldBooks, normalizeMemoryWorldBookId } = await import('./memoryWorldBook.js?rmv=1.5.53-cn-boundary1');
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


export function initRabbitMirrorUI() {
    if (!isCurrentRuntime()) return;
    const finishUiInit = globalThis.__rabbitMirrorPerfDiag?.begin?.('ui.initCall', { retry: uiMountRetryCount }, 0);
    const settings = getSettings();
    const noSendRegex = '/<toto\\b[^>]*>[\\s\\S]*?<\\/toto>\\s*/gi';
    const existing = $('#rabbit_mirror_theater_settings');
    if (existing.length) {
        const currentPanels = existing.filter(`[data-rabbit-mirror-ui-version="${SETTINGS_UI_VERSION}"][data-rabbit-mirror-runtime-version="${RUNTIME_VERSION}"]`)
            .filter((_, panel) => panel.dataset.rabbitMirrorUiReady === 'true'
                && panel.dataset.rhWorkbench === 'ui3'
                && panel.tagName === 'DIALOG'
                && panel.__rabbitMirrorWorkbench?.hasEntry()
                && panel.__rabbitMirrorWorkbench?.isComplete()
                && panel.querySelector('#rh_enabled')
                && panel.querySelector('#rh_ui_theme')
                && panel.querySelectorAll('.rh-ui-tabs').length === 1);
        if (existing.length === 1 && currentPanels.length === 1) { finishUiInit?.({ outcome: 'already-mounted' }); return; }
        // A hot reload may leave the old settings DOM alive even after manifest.json has updated.
        // Remove every stale/duplicate panel so the claimed runtime becomes the only UI owner.
        try { globalThis.__rabbitMirrorTagFilterScanUiCleanup?.(); } catch {}
        globalThis.__rabbitMirrorTagFilterScanUiCleanup = null;
        try { globalThis.__rabbitMirrorTtDiagnosticUiCleanup?.(); } catch {}
        existing.each((_, panel) => destroySettingsAppearance(panel));
        existing.remove();
        $('body > #rh_advanced_modal, body > #rh_world_info_prompt_modal, body > #rh_independent_tag_filter_modal').remove();
    }

    // All paths below mount a new UI owner, including rebuilds without destroy.
    // Invalidate old responses here; they must not unlock a later request.
    memoryWorldBookDirectorySequence += 1;
    memoryWorldBookDirectoryBusy = false;
    const settingsMount = $('body');
    if (!settingsMount.length || !document.getElementById('extensionsMenu')) {
        scheduleUiMountRetry();
        finishUiInit?.({ outcome: 'mount-missing' });
        return;
    }
    uiMountRetryCount = 0;

    const html = buildRabbitMirrorSettingsDialogHtml();

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
            const updater = await import('./extensionUpdater.js?rmv=1.5.58-fork1');
            const result = await updater.requestRabbitMirrorUpdate();
            if (!status.isConnected) return;
            status.textContent = result.status === 'current'
                ? '宿主确认当前安装所登记的仓库分支已是最新版（不是 homePage 链接）。若界面仍旧，可手动刷新；刷新不会清空母本库。'
                : '宿主已按当前安装的 git remote 完成更新。若 remote 仍是作者仓库，可能已不是本 fork。请先结束生成、保存正在输入的文字，再点下方刷新。';
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
    $(buildWorldInfoPromptModalHtml()).appendTo(document.body);
    $(buildTagFilterModalHtml()).appendTo(document.body);
    for (const id of ['rh_advanced_modal', 'rh_world_info_prompt_modal', 'rh_independent_tag_filter_modal']) {
        // Stable TT layout contract, scoped to our modal; no host/theme rewrite.
        const modal = document.getElementById(id);
        applyRabbitMirrorHostSurface(modal, 'backdrop');
        applyRabbitMirrorHostSurface(modal?.firstElementChild, 'fullscreen-window');
    }
    attachTokenMeterListener();
    renderTokenMeter();

    checked('#rh_enabled', settings.autoRabbitMirrorInjection !== false && settings.enabled !== false);
    $('#rh_independent_generation_timing').val(independentGenerationTiming(settings));
    $(`input[name="rh_generation_source"][value="${settings.generationSource || 'follow'}"]`).prop('checked', true);
    $(`input[name="rh_follow_display"][value="${settings.followDisplayMode || 'inline'}"]`).prop('checked', true);
    $(`input[name="rh_independent_display"][value="${settings.independentDisplayMode || 'external'}"]`).prop('checked', true);
    $('#rh_independent_base').val(settings.independentApiBaseUrl || '');
    $('#rh_independent_key').val(settings.independentApiKey || '');
    $('#rh_independent_temperature').val(settings.independentApiTemperature ?? 0.8);
    $('#rh_independent_max_tokens').val(settings.independentApiMaxTokens ?? 30000);
    $('#rh_independent_automatic_reroll').val(settings.independentAutomaticRerollMax ?? 2);
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
        const timing = independentGenerationTiming(current);
        const timingDescriptions = {
            auto: '按原有规则自动生成；已配置的正文标签提前生成仍按原设置生效。',
            manual: '先显示待生成外置框。你判断正文完成后，点击框内“生成”才请求副 API。',
            off: '不生成兔子镜。保留已保存内容，显示与操作沿用原关闭行为。',
        };
        $('#rh_independent_generation_timing').val(timing);
        $('#rh_independent_generation_timing_row').prop('hidden', !independent);
        $('#rh_independent_generation_timing_hint').text(timingDescriptions[timing]);
        $('#rh_enabled').prop('checked', current.autoRabbitMirrorInjection !== false && current.enabled !== false);
        $('#rh_enabled').closest('.rabbit-mirror-primary-row').prop('hidden', independent);
        $('#rh_independent_api_fields').show();
        $('#rh_follow_display_row').toggle(!independent);
        $('#rh_independent_mode_status').text(independent
            ? `当前副 API：${{ auto: '自动生成', manual: '手动生成', off: '关闭' }[timing]}。${timingDescriptions[timing]}`
            : `当前使用“跟随当前 API”；标签隔离${current.followTagIsolationEnabled === true ? '已开启' : '未开启'}，其余独立 API 设置可提前配置。`);
    };
    syncGenerationModeFields();
    renderIndependentApiDiagnostic();
    attachIndependentApiDiagnosticListener();
    attachWorldInfoBooksListener();
    try { globalThis.__rabbitMirrorBlacklistUiCleanup?.(); } catch {}
    const blacklistListener = event => { checked('#rh_blacklist_enabled', getSettings().blacklistEnabled !== false); if (event?.detail?.action === 'enabled') scheduleSettingsToolsRefresh(); if (document.getElementById('rh_random_preference_section')?.open) { renderBlacklistSettings(); renderFavoriteSettings(); void renderTheaterFavoriteSettings(); } };
    const theaterFavoriteListener = () => { void renderTheaterFavoriteSettings(); };
    globalThis.addEventListener?.(BLACKLIST_CHANGED_EVENT, blacklistListener);
    document.addEventListener(THEATER_FAVORITES_CHANGED_EVENT, theaterFavoriteListener);
    globalThis.__rabbitMirrorBlacklistUiCleanup = () => {
        globalThis.removeEventListener?.(BLACKLIST_CHANGED_EVENT, blacklistListener);
        document.removeEventListener(THEATER_FAVORITES_CHANGED_EVENT, theaterFavoriteListener);
    };
    checked('#rh_feedback_cat', settings.feedbackCatEnabled);
    checked('#rh_maintenance_rabbit', settings.maintenanceRabbitEnabled);
    checked('#rh_maintenance_auto_safe', settings.maintenanceRabbitAutoSafeEnabled === true && settings.maintenanceRabbitAutoSafeConsent === true);
    $('#rh_sampling_mode').val(settings.samplingMode || 'classic');
    $('#rh_raw_policy').val(settings.rawPolicy || 'balanced');
    checked('#rh_user_directive', settings.userDirectivePriority);
    checked('#rh_worldview_lock', settings.presentationWorldviewLock === true);
    checked('#rh_creative_expansion', settings.creativeExpansionMode);
    checked('#rh_force_visual_scenery', settings.forceVisualScenery);
    checked('#rh_visual_scenery_combination', settings.visualSceneryCombination);
    checked('#rh_image_enabled', settings.imageEnabled);
    $('#rh_image_prompt_format').val(settings.imagePromptFormat);
    $('#rh_visual_scenery_combination').prop('disabled', !settings.forceVisualScenery);
    checked('#rh_avoid_repeat', settings.avoidRepeat);
    checked('#rh_blacklist_enabled', settings.blacklistEnabled !== false);
    checked('#rh_memory_scan_enabled', settings.memoryScanEnabled);
    renderMemoryWorldBookBinding();
    checked('#rh_enhanced_visual_drawing', settings.enhancedVisualDrawing === true);
    checked('#rh_multiface_enabled', settings.rabbitMirrorFaceCount > 1);
    $('#rh_multiface_count').val(String(settings.rabbitMirrorFaceCount > 1 ? settings.rabbitMirrorFaceCount : 2));
    $('#rh_multiface_count_row').prop('hidden', settings.rabbitMirrorFaceCount <= 1);
    $('#rh_multiface_count').prop('disabled', settings.rabbitMirrorFaceCount <= 1);
    renderFacePresentationSettings(settings);
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
            const module = await import('./appearanceReference.js?rmv=1.5.53-cn-boundary1');
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
            const module = await import('./appearanceReference.js?rmv=1.5.53-cn-boundary1');
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
            const module = await import('./quickStart.js?rmv=1.5.60-fork1');
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
        toastr?.info?.(enabled ? '已开启世界书读取，从下一轮独立 API 生成生效。' : '暂不读取世界书；之后可在“设置 → 它可以参考什么 → 使用世界书资料”中随时开启。');
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
    $('#rh_independent_generation_timing').on('change', e => {
        updateSettings({ independentGenerationTiming: e.target.value });
        clearRabbitMirrorPrompt('independent-api');
        syncGenerationModeFields();
        refreshRabbitMirrorGenerationMode();
        renderTokenMeter();
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
            const pulledCount = await pullAllWorldInfoBooks();
            status.text(`已拉取 ${pulledCount} 本`);
            toastr?.success?.(`已拉取 ${pulledCount} 本世界书；列表保留在折叠区内`);
        } catch (error) {
            clearPulledWorldInfoBooks();
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
        const rerollMax=Number($('#rh_independent_automatic_reroll').val());
        const contextLayers=Number($('#rh_independent_context_layers').val());
        updateSettings({
            independentConnectionProfileId:'',
            independentApiBaseUrl:$('#rh_independent_base').val(),
            independentApiKey:$('#rh_independent_key').val(),
            independentApiModel:$('#rh_independent_model').val(),
            independentApiTemperature:Number.isFinite(temperature)?temperature:0.8,
            independentApiMaxTokens:Number.isFinite(maxTokens)&&maxTokens>0?maxTokens:30000,
            independentAutomaticRerollMax:Number.isFinite(rerollMax)?rerollMax:2,
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
        const rerollMax = Number($('#rh_independent_automatic_reroll').val());
        const contextLayers = Number($('#rh_independent_context_layers').val());
        updateSettings({
            independentApiBaseUrl: $('#rh_independent_base').val(),
            independentApiKey: $('#rh_independent_key').val(),
            independentApiModel: $('#rh_independent_model').val(),
            independentApiTemperature: Number.isFinite(temperature) ? temperature : 0.8,
            independentApiMaxTokens: Number.isFinite(maxTokens) && maxTokens > 0 ? maxTokens : 30000,
            independentAutomaticRerollMax: Number.isFinite(rerollMax) ? rerollMax : 2,
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
    $('#rh_independent_temperature, #rh_independent_max_tokens, #rh_independent_automatic_reroll, #rh_independent_context_layers').on('change', saveIndependentFields);
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
        scheduleSettingsToolsRefresh();
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
        scheduleSettingsToolsRefresh();
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
        scheduleSettingsToolsRefresh();
        toastr?.[enabled ? 'info' : 'success']?.(enabled
            ? '自动巡逻已开启，只自动修简单问题。'
            : '自动巡逻已关闭：维修兔恢复为纯手动模式。');
    });

    $('#rh_enhanced_visual_drawing').on('change', e => {
        updateSettings({ enhancedVisualDrawing: e.target.checked === true });
    });
    for (let index = 0; index < 5; index += 1) {
        $(`#rh_face_mode_${index}`).on('change', e => {
            const modes = normalizePresentationModes(getSettings().rabbitMirrorPresentationModes);
            modes[index] = e.target.value;
            updateSettings({ rabbitMirrorPresentationModes: modes });
            renderFacePresentationSettings(getSettings());
        });
    }
    $('#rh_multiface_enabled').on('change', e => {
        const enabled = e.target.checked === true;
        const count = Number($('#rh_multiface_count').val());
        updateSettings({ rabbitMirrorFaceCount: enabled && Number.isInteger(count) && count >= 2 && count <= 5 ? count : enabled ? 2 : 1 });
        $('#rh_multiface_count_row').prop('hidden', !enabled);
        $('#rh_multiface_count').prop('disabled', !enabled);
        renderFacePresentationSettings(getSettings());
    });
    $('#rh_multiface_count').on('change', e => {
        if ($('#rh_multiface_enabled').prop('checked') === true) updateSettings({ rabbitMirrorFaceCount: Number(e.target.value) });
        renderFacePresentationSettings(getSettings());
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
    $('#rh_force_visual_scenery').on('change', e => {
        updateSettings({ forceVisualScenery: e.target.checked });
        $('#rh_visual_scenery_combination').prop('disabled', !e.target.checked);
    });
    $('#rh_visual_scenery_combination').on('change', e => updateSettings({ visualSceneryCombination: e.target.checked }));
    $('#rh_image_enabled').on('change', e => {
        updateSettings({ imageEnabled: e.target.checked });
        scheduleSettingsToolsRefresh();
    });
    $('#rh_image_prompt_format').on('change', e => updateSettings({ imagePromptFormat: e.target.value }));
    $('#rh_image_status_refresh').on('click', async () => {
        const output = document.getElementById('rh_image_provider_status');
        try {
            const { getImageBackendStatus } = await import('./baibaiImage.js');
            const status = await getImageBackendStatus();
            output.textContent = status.configured ? `柏宝绘已连接 · ${status.backend || ''} ${status.model || ''}` : (status.reason || '柏宝绘尚未配置，请先安装并配置柏宝绘。');
        } catch { output.textContent = '无法读取柏宝绘连接，请检查插件是否已加载并完成配置。'; }
    });
    $('#rh_avoid_repeat').on('change', e => updateSettings({ avoidRepeat: e.target.checked }));
    $('#rh_random_preference_section').on('toggle', function () {
        if (!this.open) return;
        renderBlacklistSettings();
        renderFavoriteSettings();
    });
    $('#rh_theater_favorite_section').on('toggle', function () {
        if (!this.open) return;
        void renderTheaterFavoriteSettings();
    });
    void renderTheaterFavoriteSettings();
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
        scheduleSettingsToolsRefresh();
    });
    $('#rh_blacklist_clear').on('click', () => {
        clearBlacklist('all');
        renderBlacklistSettings();
        scheduleSettingsToolsRefresh();
        toastr?.success?.('已清空全部抽签黑名单');
    });
    $('#rh_favorite_summary').on('change', '.rh-favorite-multiplier', function () {
        const kind = String($(this).data('kind') || '') === 'format' ? 'format' : 'theme';
        const id = String($(this).data('id') || '');
        const multiplier = setFavoriteMultiplier(kind, id, $(this).val());
        if (multiplier == null) toastr?.warning?.(`收藏倍率没有修改：${id}`);
        else toastr?.success?.(`收藏倍率已更新：${id} ×${multiplier}`);
        renderFavoriteSettings();
        scheduleSettingsToolsRefresh();
    });
    $('#rh_favorite_summary').on('click', '.rh-favorite-remove', function () {
        const kind = String($(this).data('kind') || '') === 'format' ? 'format' : 'theme';
        const id = String($(this).data('id') || '');
        if (removeFavoriteItem(kind, id)) toastr?.success?.(`已取消收藏：${id}`);
        renderFavoriteSettings();
        scheduleSettingsToolsRefresh();
    });
    $('#rh_favorite_clear').on('click', () => {
        clearFavorites('all');
        renderFavoriteSettings();
        scheduleSettingsToolsRefresh();
        toastr?.success?.('已清空全部收藏');
    });
    $('#rh_theater_favorite_open_library').on('click', async () => {
        try {
            await openTheaterFavoriteLibrary((container, record) => hydrateIndependentFavoriteHtml(container, record));
        } catch (error) {
            toastr?.warning?.(String(error?.message || '无法打开收藏夹。'));
        }
    });
    $('#rh_theater_favorite_summary').on('click', '.rh-theater-favorite-open', async function () {
        const id = String($(this).data('id') || '');
        try {
            await openTheaterFavoriteViewer(id, (container, record) => hydrateIndependentFavoriteHtml(container, record));
        } catch (error) {
            toastr?.warning?.(String(error?.message || '无法打开收藏。'));
        }
    });
    $('#rh_theater_favorite_summary').on('click', '.rh-theater-favorite-remove', async function () {
        const id = String($(this).data('id') || '');
        try {
            await deleteTheaterFavorite(id);
            toastr?.success?.('已从兔子镜收藏夹删除。');
            void renderTheaterFavoriteSettings();
        } catch (error) {
            toastr?.warning?.(String(error?.message || '删除失败。'));
        }
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
                const module = await import('./externalWorldBook/importWizard.js?rmv=1.5.53-image1');
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

    const renderManualEntryDiagnostic = () => {
        const state = getManualEntryDiagnosticState();
        $('#rh_manual_diag_start').prop('disabled', state.active);
        $('#rh_manual_diag_stop').prop('disabled', !state.active);
        $('#rh_manual_diag_copy').prop('disabled', !state.report);
        $('#rh_manual_diag_output').val(state.report).prop('hidden', !state.report);
        $('#rh_manual_diag_status').text(state.active ? '正在记录。可关闭设置，回聊天正常发送一条消息；角色回复后回来结束记录。' : state.report ? '已停止并保留报告。不需要点击生成或重说兔子镜。' : '尚未开始。诊断默认关闭。');
    };
    $('#rh_manual_diag_start').on('click', () => { startManualEntryDiagnostic(); renderManualEntryDiagnostic(); });
    $('#rh_manual_diag_stop').on('click', () => { stopManualEntryDiagnostic(); renderManualEntryDiagnostic(); });
    $('#rh_manual_diag_copy').on('click', async () => {
        const report = getManualEntryDiagnosticState().report;
        if (!report) return;
        try { await navigator.clipboard.writeText(report); $('#rh_manual_diag_status').text('报告已复制。'); }
        catch {
            const output = document.getElementById('rh_manual_diag_output');
            output?.focus(); output?.select();
            let copied = false; try { copied = document.execCommand('copy'); } catch {}
            $('#rh_manual_diag_status').text(copied ? '报告已复制。' : '自动复制失败，请长按下方报告全选复制。');
        }
    });
    renderManualEntryDiagnostic();

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
    mountSettingsAppearance(document.getElementById('rabbit_mirror_theater_settings'), {
        onNavigate(page) {
            if (page === 'books') renderWorldInfoBookSettings({ current: true, all: false });
            if (page === 'preferences') { renderBlacklistSettings(); renderFavoriteSettings(); void renderTheaterFavoriteSettings(); }
        },
    });
    $('#rabbit_mirror_theater_settings').attr('data-rabbit-mirror-ui-ready', 'true');
    finishUiInit?.({ outcome: 'mounted' });
}

export function destroyRabbitMirrorUI() {
    destroySettingsAppearance(document.getElementById('rabbit_mirror_theater_settings'));
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
    resetWorldInfoBookUiState();
    $('#rabbit_mirror_theater_settings').remove();
}

function renderFacePresentationSettings(settings) {
    const modes = normalizePresentationModes(settings.rabbitMirrorPresentationModes);
    const count = settings.rabbitMirrorFaceCount || 1;
    for (let index = 0; index < 5; index += 1) {
        const row = document.querySelector(`[data-rh-presentation-row="${index}"]`);
        if (row) { row.hidden = index >= count; row.style.display = index < count ? 'flex' : 'none'; }
        const select = document.getElementById(`rh_face_mode_${index}`);
        if (select) { select.value = modes[index]; select.disabled = index >= count; }
    }
}
