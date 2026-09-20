// Split from outputSanitizer.js — toolsChrome.

import { installMirrorToolMenu, fitMirrorToolPanel } from '../mirrorToolMenu.js?rmv=1.5.58-fork1';
import { isTextPresentation } from '../presentationMode.js?rmv=1.5.53-visualquick1';
import { isRabbitMirrorManagedChatSurface } from '../hostCompatibility.js?rmv=1.5.58-fork1';
import { getSettings, syncExternalReferenceVisibility } from '../settings.js?rmv=1.5.60-fork1';
import { getCurrentChatKey } from '../storage.js?rmv=1.5.53-visualquick1';
import { getSanitizedRabbitMirrorFaceProof } from '../multifaceProof.js?rmv=1.5.53-visualquick1';
import {
    captureTheaterFavoriteFromRoot,
    openTheaterFavoriteLibrary,
    toggleTheaterFavorite,
    isTheaterFavoriteHtml,
} from '../theaterFavorites.js?rmv=1.5.60-fork1';
import {
    FEEDBACK_CAT_TYPES,
    clearActiveFeedbackForCurrentChat,
    feedbackCatReceiptText,
    feedbackCatStatusText,
    getActiveFeedbackForCurrentChat,
    getFeedbackCatLastReceiptForCurrentChat,
    setActiveFeedbackForCurrentChat,
} from '../feedbackCat.js?rmv=1.5.53-cn-boundary1';
import { scanRabbitMirrorHtml } from '../visualScanner.js?rmv=1.5.64';
import {
    FAVORITE_MULTIPLIER_MAX,
    FAVORITE_MULTIPLIER_MIN,
    blacklistEntries,
    clearBlacklist,
    clearFavorites,
    favoriteEntries,
    getBlacklistState,
    getFavoriteMultiplier,
    getFavoritesState,
    getRabbitMirrorRecipe,
    isBlacklisted,
    isFavorited,
    removeBlacklistItem,
    removeFavoriteItem,
    selectionCatalogEntries,
    setBlacklistEnabled,
    setFavoriteMultiplier,
    toggleBlacklistItem,
    toggleFavoriteItem,
} from '../blacklist.js?rmv=1.5.53-image1';
import {
    EXTERNAL_REFERENCE_NOTE_ATTR,
    FEEDBACK_CAT_ATTR,
    MAINTENANCE_RABBIT_ATTR,
    MIRROR_TITLE_DISPLAY_ATTR,
    MIRROR_TITLE_PART_ATTR,
    MIRROR_TITLE_PREFIX_ATTR,
    MIRROR_TITLE_SOURCE_ATTR,
    MIRROR_TOTO_SELECTOR,
    RECIPE_BUTTON_ATTR,
    RUNTIME_VERSION,
    RUNTIME_VERSION_ATTR,
    TOOL_ENTRY_HOST_ATTR,
    ensureFeedbackCatRuntimeStyle,
    getChatRoot,
    getRenderedRabbitMirrorInteractionRoots,
    isCurrentRuntime,
    isFeedbackCatEnabled,
    isInsideChatMessage,
    isMaintenanceRabbitEnabled,
    isRabbitMirrorDetails,
} from './runtime.js?rmv=1.5.64';
import { getAvailableHostChat } from './scriptedInteractionRescue.js?rmv=1.5.64';
import { armNestedDetailsReplacementContainment, installNestedDetailsReplacementContainment } from './fallbackRescue.js?rmv=1.5.64';
import { armRabbitMirrorFirstUseInteraction, repairRabbitMirrorScopedClassAliasesInScope } from './idsAndRearm.js?rmv=1.5.64';
import {
    FEEDBACK_CAT_MENU_ATTR,
    FEEDBACK_HISTORY_EVENT,
    FEEDBACK_RESAY_EVENT,
    MAINTENANCE_MENU_ATTR,
    MAINTENANCE_REASON_ATTR,
    MAINTENANCE_STATES,
    MAINTENANCE_STATE_ATTR,
    RECIPE_MENU_ATTR,
    RESAY_ATTR,
    bindRevealedInteractionMemory,
    clearLegacyRabbitMirrorAutoFrameArtifacts,
    copyRabbitMirrorCurrentFaceHtml,
    downloadRabbitMirrorCurrentFaceHtml,
    failMaintenanceRabbit,
    maintenanceMenuProblemText,
    rabbitMirrorLanguageBalance,
    scheduleCurrentHighConfidenceTextRepair,
    setMaintenanceRabbitState,
} from './diagnostics.js?rmv=1.5.64';
import { clearOrphanedStructuredStaticDisclosureArtifacts } from './choiceRescue.js?rmv=1.5.64';
import {
    MAINTENANCE_FINDING_STAGE_LABELS,
    beginMaintenanceRepairRun,
    finishMaintenanceRepairRun,
    hasRabbitMirrorInteractionResetSnapshot,
    maintenanceFindingReason,
    maintenanceRepairModesForFindings,
    maintenanceRepairPlanLabel,
    patrolMaintenanceRabbit,
    rejectOversizedMaintenanceRepair,
    removeRabbitMirrorInteractionHomeControls,
    replayFollowMaintenanceRepair,
    restoreRabbitMirrorInteractionResetSnapshot,
    runMaintenanceNarrowFaceRepair,
    runMaintenanceRevealClipRepair,
    runMaintenanceUserRepair,
    triggerDiagnosticForMaintenanceRoot,
} from './maintenanceInspect.js?rmv=1.5.64';
import {
    getRabbitMirrorFacePosition,
    installMaintenanceHorizontalClipOpenRescue,
    repairLegacyMaintenanceMobileStateRows,
} from './layoutRescue.js?rmv=1.5.64';
import {
    getMessageIndexFromMirrorNode,
    installMaintenanceAutoSafeOpenPatrol,
    installManagedRabbitMirrorTools,
    pruneMaintenanceAutoSafeOpenBindings,
    scheduleMaintenanceAutoSafeForRoot,
} from './lifecycle.js?rmv=1.5.64';

let recipeOutsideCloseCleanup = null;

let maintenanceOutsideCloseCleanup = null;

let feedbackOutsideCloseCleanup = null;

export const toolOutsideCloseOwners = new Map();

// 0.32.68: 新增源码恢复链：在 TH/高亮插件生成代码壳后，直接用原始消息的清洗副本瞬时重绘当前显示层；不写回 mes/swipe/display_text；
// 0.32.67: 一次性交互诊断升级为兔子镜总诊断，可检查交互、代码块、纯文字源码、显示源与触发链；急救逻辑保持不变；
// 0.32.66: 新增文字可读性底线；代码块急救补充完整转义兔子镜普通文本 DOM 兜底；其余行为保持不变；
// 本版仅撤回 promptBuilder 中 0.32.60 新增的常驻色彩关系测试规则。
// 含 thinking/reasoning 包裹时仍禁止整条消息瞬时重绘；但允许先隔离并只重建当前兔子镜 DOM。


const PALETTE_DEDUPE_CHECKED_ATTR = 'data-rabbit-mirror-palette-dedupe-checked';
// Diagnostics are optional and cannot change the operation's return or error.

let mirrorImageModule = null;

let startupMaintenanceInstallTimer = 0;

let startupMaintenanceInstallQueue = [];

let startupMaintenanceVisibilityObserver = null;

let startupMaintenanceFallbackRoot = null;

let startupMaintenanceFallbackHandler = null;


export function closeMaintenanceRabbitMenu() {
    try { maintenanceOutsideCloseCleanup?.(); } catch {}
    maintenanceOutsideCloseCleanup = null;
    toolOutsideCloseOwners.delete('maintenance');
    document.querySelectorAll?.(`[${MAINTENANCE_MENU_ATTR}]`)?.forEach(panel => panel.remove());
}


function bindMaintenanceOutsideClose(panel, button) {
    try { maintenanceOutsideCloseCleanup?.(); } catch {}
    toolOutsideCloseOwners.set('maintenance', { button, close: closeMaintenanceRabbitMenu });
    let closeOnOutside = null;
    const timer = setTimeout(() => {
        if (!panel?.isConnected) return;
        closeOnOutside = event => {
            if (!panel.isConnected || (!panel.contains(event.target) && event.target !== button)) closeMaintenanceRabbitMenu();
        };
        document.addEventListener('pointerdown', closeOnOutside, true);
    }, 0);
    maintenanceOutsideCloseCleanup = () => {
        clearTimeout(timer);
        if (closeOnOutside) document.removeEventListener('pointerdown', closeOnOutside, true);
        closeOnOutside = null;
    };
}



function feedbackCatEscapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


export function closeFeedbackCatMenu() {
    try { feedbackOutsideCloseCleanup?.(); } catch {}
    feedbackOutsideCloseCleanup = null;
    toolOutsideCloseOwners.delete('feedback');
    document.querySelectorAll?.(`[${FEEDBACK_CAT_MENU_ATTR}]`)?.forEach(panel => panel.remove());
}


function positionFeedbackCatPanel(panel, button, preferredWidth = 300) {
    if (typeof fitMirrorToolPanel === 'function') return fitMirrorToolPanel(panel, button, preferredWidth);
    const rect = button.getBoundingClientRect();
    // 1.3.20: on phones the menu is taller than the visual viewport. Use the
    // visual viewport when available, cap the panel height, and let the menu
    // itself scroll so the bottom “重说 / 兔子镜历史” actions stay reachable.
    const viewport = globalThis.visualViewport || null;
    const viewportWidth = Math.max(0, Number(viewport?.width || globalThis.innerWidth || 0));
    const viewportHeight = Math.max(0, Number(viewport?.height || globalThis.innerHeight || 0));
    const viewportLeft = Number(viewport?.offsetLeft || 0);
    const viewportTop = Number(viewport?.offsetTop || 0);
    const width = Math.min(preferredWidth, Math.max(250, viewportWidth - 24));
    panel.style.width = `${width}px`;
    panel.style.maxHeight = `${Math.max(160, viewportHeight - 24)}px`;
    const left = Math.max(viewportLeft + 12, Math.min(rect.left, viewportLeft + viewportWidth - width - 12));
    panel.style.left = `${left}px`;
    const panelHeight = Math.min(panel.offsetHeight || 0, Math.max(160, viewportHeight - 24));
    const top = Math.max(viewportTop + 12, Math.min(rect.bottom + 6, viewportTop + viewportHeight - panelHeight - 12));
    panel.style.top = `${top}px`;
}


function bindFeedbackCatOutsideClose(panel, button) {
    try { feedbackOutsideCloseCleanup?.(); } catch {}
    toolOutsideCloseOwners.set('feedback', { button, close: closeFeedbackCatMenu });
    let closeOnOutside = null;
    const timer = setTimeout(() => {
        if (!panel?.isConnected) return;
        closeOnOutside = event => {
            if (!panel.isConnected || (!panel.contains(event.target) && event.target !== button)) closeFeedbackCatMenu();
        };
        document.addEventListener('pointerdown', closeOnOutside, true);
    }, 0);
    feedbackOutsideCloseCleanup = () => {
        clearTimeout(timer);
        if (closeOnOutside) document.removeEventListener('pointerdown', closeOnOutside, true);
        closeOnOutside = null;
    };
}


function bindRecipeOutsideClose(panel, button) {
    // Keep exactly one outside-close listener. The 1.3.64 implementation removed stale listeners
    // only on the *next* pointerdown; repeated keyboard/programmatic open-close cycles could leave
    // detached-panel listeners behind until another pointer event happened.
    try { recipeOutsideCloseCleanup?.(); } catch {}
    toolOutsideCloseOwners.set('recipe', { button, close: closeRecipeMenu });
    let closeOnOutside = null;
    const timer = setTimeout(() => {
        if (!panel?.isConnected) return;
        closeOnOutside = event => {
            if (!panel.isConnected || (!panel.contains(event.target) && event.target !== button)) {
                closeRecipeMenu();
            }
        };
        document.addEventListener('pointerdown', closeOnOutside, true);
    }, 0);
    recipeOutsideCloseCleanup = () => {
        clearTimeout(timer);
        if (closeOnOutside) document.removeEventListener('pointerdown', closeOnOutside, true);
        closeOnOutside = null;
    };
}


function feedbackCatSourceIdentity(root) {
    const messageId = getMessageIndexFromMirrorNode(root);
    const chat = getAvailableHostChat();
    const message = messageId >= 0 ? chat[messageId] : null;
    const swipeId = Number.isInteger(message?.swipe_id) ? message.swipe_id : -1;
    let sourceFingerprint = null;
    try {
        const renderedToto = root?.matches?.('toto') ? root : root?.closest?.('toto') || root;
        const scanned = scanRabbitMirrorHtml(String(message?.mes || renderedToto?.outerHTML || ''), renderedToto);
        sourceFingerprint = scanned && typeof scanned === 'object' ? {
            signature: scanned.signature || '',
            skeleton: scanned.skeleton || '',
            riskFlags: Array.isArray(scanned.riskFlags) ? scanned.riskFlags : [],
            paletteFingerprint: scanned.paletteFingerprint || null,
            interactionFamily: scanned.interactionFamily || null,
        } : null;
    } catch (error) {
        console.debug('[RabbitMirror] feedback cat source fingerprint skipped:', error);
    }
    return { messageId, swipeId, sourceFingerprint };
}


function feedbackCatButtonTitle() {
    const active = getActiveFeedbackForCurrentChat();
    return active
        ? `挨打猫：${feedbackCatStatusText(active)}；点击可修改或清除`
        : '挨打猫：反馈这面兔子镜；未选择时不会向模型追加内容';
}


function updateFeedbackCatButtonTitles(scope = document) {
    const title = feedbackCatButtonTitle();
    scope.querySelectorAll?.(`[${FEEDBACK_CAT_ATTR}]`)?.forEach(button => {
        button.title = title;
        button.setAttribute('aria-label', title);
        normalizeRabbitMirrorToolButton(button);
        normalizeRabbitMirrorToolHost(button.parentElement?.matches?.(`[${TOOL_ENTRY_HOST_ATTR}]`) ? button.parentElement : null);
    });
}


function saveFeedbackCatChoice(root, types, customText, rounds) {
    try {
        const source = feedbackCatSourceIdentity(root);
        const record = setActiveFeedbackForCurrentChat({
            types,
            customText,
            rounds,
            sourceMessageId: source.messageId,
            sourceSwipeId: source.swipeId,
            sourceFingerprint: source.sourceFingerprint,
        });
        updateFeedbackCatButtonTitles();
        const rangeText = Number(rounds) === 1 ? '下一轮' : `接下来 ${rounds} 轮`;
        globalThis.toastr?.success?.(`挨打猫记住了 ${types.length} 项反馈，将影响${rangeText}。`);
        return record;
    } catch (error) {
        globalThis.toastr?.warning?.(error?.message || '挨打猫没有记住，请重试。');
        return null;
    }
}


function showFeedbackCatRangeMenu(root, button, types, customText = '') {
    closeFeedbackCatMenu();
    const selectedTypes = [...new Set((Array.isArray(types) ? types : [types]).filter(type => FEEDBACK_CAT_TYPES[type]))];
    const panel = document.createElement('div');
    panel.className = 'rabbit-mirror-feedback-cat-menu';
    panel.setAttribute(FEEDBACK_CAT_MENU_ATTR, 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '挨打猫反馈范围');
    panel.innerHTML = `
      <div class="rabbit-mirror-feedback-cat-menu-title">🐈‍⬛ (×﹏×)</div>
      <div class="rabbit-mirror-feedback-cat-menu-copy">已选 ${selectedTypes.length} 项：${feedbackCatEscapeHtml(selectedTypes.map(type => FEEDBACK_CAT_TYPES[type]).join('、'))}</div>
      <div class="rabbit-mirror-feedback-cat-menu-copy">这顿打要记多久？</div>
      <button type="button" data-rm-feedback-rounds="1">○ 下一轮</button>
      <button type="button" data-rm-feedback-rounds="3">○ 接下来 3 轮</button>
      <button type="button" data-rm-feedback-rounds="10">○ 接下来 10 轮</button>
      <button type="button" data-rm-feedback-action="back">返回修改</button>
      <button type="button" data-rm-feedback-action="close">取消</button>`;
    document.body.appendChild(panel);
    positionFeedbackCatPanel(panel, button);
    panel.addEventListener('click', event => {
        const roundsButton = event.target?.closest?.('[data-rm-feedback-rounds]');
        const action = event.target?.closest?.('[data-rm-feedback-action]')?.getAttribute('data-rm-feedback-action');
        if (!roundsButton && !action) return;
        event.preventDefault();
        event.stopPropagation();
        if (roundsButton) {
            const rounds = Number(roundsButton.getAttribute('data-rm-feedback-rounds'));
            const saved = saveFeedbackCatChoice(root, selectedTypes, customText, rounds);
            if (saved) closeFeedbackCatMenu();
            return;
        }
        if (action === 'back') {
            showFeedbackCatMenu(root, button, { types: selectedTypes, customText });
            return;
        }
        closeFeedbackCatMenu();
    }, true);
    bindFeedbackCatOutsideClose(panel, button);
    return true;
}


function feedbackCatIndependentOwner(root, button = null) {
    if (!root) return null;
    const details = root.matches?.('details') ? root : root.closest?.('details') || root.querySelector?.('details');
    const host = root?.matches?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]')
        ? root
        : root?.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]')
          || root?.querySelector?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]')
          || details?.parentElement?.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]');
    const buttonMesid = Number(button?.dataset?.rmFeedbackOwnerMesid);
    const directMesid = Number(details?.dataset?.rabbitMirrorOwnerMesid);
    const messageId = getMessageIndexFromMirrorNode(root);
    const targetMesid = Number.isInteger(directMesid) && directMesid >= 0
        ? directMesid
        : Number.isInteger(buttonMesid) && buttonMesid >= 0
            ? buttonMesid
            : messageId;
    const directKey = String(details?.dataset?.rabbitMirrorOwnerKey
        || details?.dataset?.rabbitMirrorExternalOwner
        || button?.dataset?.rmFeedbackOwnerKey
        || '');
    const directSource = String(details?.dataset?.rabbitMirrorExternalSource || button?.dataset?.rmFeedbackOwnerSource || '');
    const resolvedHost = host || (targetMesid >= 0
        ? [...(document.querySelectorAll?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]') || [])]
            .find(candidate => Number(candidate?.dataset?.rmOwnerMesid ?? candidate?.dataset?.rmExternalOwnerMessage) === targetMesid)
        : directKey
            ? [...(document.querySelectorAll?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]') || [])]
                .find(candidate => String(candidate?.dataset?.rmKey || '') === directKey)
            : null);
    if (!resolvedHost && directSource !== 'independent') return null;
    const chat = getAvailableHostChat();
    const finalMesid = Number(resolvedHost?.dataset?.rmOwnerMesid
        ?? resolvedHost?.dataset?.rmExternalOwnerMessage
        ?? targetMesid);
    if (!Number.isInteger(finalMesid) || finalMesid < 0 || chat[finalMesid]?.is_user) return null;
    const message = chat[finalMesid] || null;
    let ownerChat = '';
    try { ownerChat = String(getCurrentChatKey?.(chat) || ''); } catch {}
    const faceIndex = getRabbitMirrorFacePosition(root)?.faceIndex;
    return {
        chat: String(resolvedHost?.dataset?.rmOwnerChat
            || details?.dataset?.rabbitMirrorOwnerChat
            || button?.dataset?.rmFeedbackOwnerChat
            || ownerChat),
        mesid: finalMesid,
        swipe: Number(resolvedHost?.dataset?.rmOwnerSwipe
            ?? details?.dataset?.rabbitMirrorOwnerSwipe
            ?? button?.dataset?.rmFeedbackOwnerSwipe
            ?? (Number.isInteger(message?.swipe_id) ? message.swipe_id : 0)),
        key: String(resolvedHost?.dataset?.rmKey || directKey),
        sourceHash: String(resolvedHost?.dataset?.rmSourceHash
            || details?.dataset?.rabbitMirrorOwnerSourceHash
            || button?.dataset?.rmFeedbackOwnerSourceHash
            || ''),
        ...(Number.isInteger(faceIndex) ? { faceIndex } : {}),
    };
}


function invokeFeedbackMirrorAction(action, root, owner) {
    const bridge = globalThis.__rabbitMirrorIndependentActionsV1;
    if (bridge?.runtime === RUNTIME_VERSION && typeof bridge?.[action] === 'function') {
        try {
            if (bridge[action](root, owner || {})) return true;
        } catch (error) {
            console.debug('[RabbitMirror] independent action bridge failed, using event fallback:', error);
        }
    }
    const detail = { root, owner: owner || {}, handled: false };
    document.dispatchEvent(new CustomEvent(action === 'resay' ? FEEDBACK_RESAY_EVENT : FEEDBACK_HISTORY_EVENT, { detail }));
    return !!detail.handled;
}


function showFeedbackCatMenu(root, button, draft = null) {
    closeMaintenanceRabbitMenu();
    closeFeedbackCatMenu();
    if (!root?.isConnected || !button?.isConnected) return false;
    const active = getActiveFeedbackForCurrentChat();
    const lastReceipt = getFeedbackCatLastReceiptForCurrentChat();
    const initialTypes = Array.isArray(draft?.types)
        ? draft.types
        : Array.isArray(active?.types)
            ? active.types
            : active?.type
                ? [active.type]
                : [];
    const selected = new Set(initialTypes.filter(type => FEEDBACK_CAT_TYPES[type]));
    let customText = String(draft?.customText ?? active?.customText ?? '');
    const panel = document.createElement('div');
    panel.className = 'rabbit-mirror-feedback-cat-menu';
    panel.setAttribute(FEEDBACK_CAT_MENU_ATTR, 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '挨打猫多选反馈');
    const receiptLine = lastReceipt
        ? `<div class="rabbit-mirror-feedback-cat-status">上一轮送达回执：${feedbackCatEscapeHtml(feedbackCatReceiptText(lastReceipt))}</div>`
        : '';
    const status = active
        ? `<div class="rabbit-mirror-feedback-cat-status">当前反馈：${feedbackCatEscapeHtml(feedbackCatStatusText(active))}</div>${receiptLine}`
        : lastReceipt
            ? `<div class="rabbit-mirror-feedback-cat-status">当前没有生效中的反馈。</div>${receiptLine}`
            : '<div class="rabbit-mirror-feedback-cat-status">可同时选择多项；关闭而未提交不会影响后续生成。</div>';
    const independentOwner = feedbackCatIndependentOwner(root, button);
    const actionBridge = globalThis.__rabbitMirrorIndependentActionsV1;
    const quickResay = independentOwner && actionBridge?.runtime === RUNTIME_VERSION
        ? actionBridge.prepareQuickResay?.(root, independentOwner) : null;
    const independentActions = independentOwner
        ? `<div class="rabbit-mirror-feedback-cat-actions rabbit-mirror-feedback-cat-mirror-actions">
            <button type="button" data-rm-feedback-action="resay"${quickResay ? ' data-rm-quick-resay="true"' : ''}>↻ ${quickResay ? '快速重说这一面' : '重说'}</button>
          </div>`
        : '';
    panel.innerHTML = `
      <div class="rabbit-mirror-feedback-cat-menu-title">🐈‍⬛ 挨打猫</div>
      ${status}
      <div class="rabbit-mirror-feedback-cat-menu-copy">可以多选，再统一提交。</div>
      <button type="button" data-rm-feedback-type="color">🎨 ${FEEDBACK_CAT_TYPES.color}</button>
      <button type="button" data-rm-feedback-type="structure">▦ ${FEEDBACK_CAT_TYPES.structure}</button>
      <button type="button" data-rm-feedback-type="overall">◉ ${FEEDBACK_CAT_TYPES.overall}</button>
      <button type="button" data-rm-feedback-type="interaction">✦ ${FEEDBACK_CAT_TYPES.interaction}</button>
      <button type="button" data-rm-feedback-type="language">🌐 ${FEEDBACK_CAT_TYPES.language}</button>
      <button type="button" data-rm-feedback-type="custom">✎ 其他：自己输入</button>
      <textarea class="rabbit-mirror-feedback-cat-input rabbit-mirror-feedback-cat-custom-inline" maxlength="400" rows="4" placeholder="输入其他反馈……"></textarea>
      <div class="rabbit-mirror-feedback-cat-actions">
        <button type="button" data-rm-feedback-action="reset">清空选择</button>
        <button type="button" data-rm-feedback-action="submit">提交反馈</button>
      </div>
      ${active ? '<button type="button" data-rm-feedback-action="clear-active">不打了，清除当前生效反馈</button>' : ''}
      ${independentActions}
      <button type="button" data-rm-feedback-action="close">取消</button>`;
    const textarea = panel.querySelector('.rabbit-mirror-feedback-cat-custom-inline');
    textarea.value = customText;
    const render = () => {
        panel.querySelectorAll('[data-rm-feedback-type]').forEach(item => {
            const type = item.getAttribute('data-rm-feedback-type');
            const on = selected.has(type);
            item.classList.toggle('is-selected', on);
            item.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        const customOn = selected.has('custom');
        textarea.classList.toggle('is-visible', customOn);
        textarea.hidden = !customOn;
        panel.querySelector('[data-rm-feedback-action="submit"]').disabled = selected.size === 0;
    };
    document.body.appendChild(panel);
    positionFeedbackCatPanel(panel, button, 340);
    render();
    panel.addEventListener('click', event => {
        const typeButton = event.target?.closest?.('[data-rm-feedback-type]');
        const action = event.target?.closest?.('[data-rm-feedback-action]')?.getAttribute('data-rm-feedback-action');
        if (!typeButton && !action) return;
        event.preventDefault();
        event.stopPropagation();
        if (typeButton) {
            const type = typeButton.getAttribute('data-rm-feedback-type');
            if (selected.has(type)) selected.delete(type);
            else selected.add(type);
            render();
            if (type === 'custom' && selected.has('custom')) setTimeout(() => textarea.focus(), 0);
            return;
        }
        if (action === 'reset') {
            selected.clear();
            customText = '';
            textarea.value = '';
            render();
            return;
        }
        if (action === 'submit') {
            customText = textarea.value.trim();
            if (!selected.size) {
                globalThis.toastr?.warning?.('至少选择一项反馈。');
                return;
            }
            if (selected.has('custom') && !customText) {
                globalThis.toastr?.warning?.('请填写“其他”反馈内容。');
                textarea.focus();
                return;
            }
            showFeedbackCatRangeMenu(root, button, [...selected], customText);
            return;
        }
        if (action === 'clear-active') {
            clearActiveFeedbackForCurrentChat();
            updateFeedbackCatButtonTitles();
            closeFeedbackCatMenu();
            globalThis.toastr?.success?.('挨打猫已经忘掉当前反馈。');
            return;
        }
        if (action === 'resay' || action === 'history') {
            if (!panel.isConnected) return;
            const owner = independentOwner || feedbackCatIndependentOwner(root, button) || {};
            const handled = action === 'resay' && typeof quickResay === 'function'
                ? quickResay() : invokeFeedbackMirrorAction(action, root, owner);
            closeFeedbackCatMenu();
            if (!handled) globalThis.toastr?.warning?.('没有找到这条回复对应的副 API 兔子镜。');
            return;
        }
        closeFeedbackCatMenu();
    }, true);
    textarea.addEventListener('input', () => { customText = textarea.value; });
    bindFeedbackCatOutsideClose(panel, button);
    return true;
}


function rabbitMirrorExternalGenerationState(root) {
    const host = root?.matches?.('[data-rabbit-mirror-external-source="true"][data-rm-state]')
        ? root
        : root?.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-state]');
    return String(host?.getAttribute?.('data-rm-state') || '');
}



function rabbitMirrorExternalGenerationNotice(root, kind = 'maintenance') {
    const state = rabbitMirrorExternalGenerationState(root);
    if (state === 'loading') {
        const message = kind === 'feedback'
            ? '兔子镜仍在生成中，挨打猫会在生成完成后启用。'
            : '兔子镜仍在生成中，请稍候。';
        globalThis.toastr?.info?.(message);
        return true;
    }
    if (state === 'error' && kind === 'maintenance') {
        globalThis.toastr?.warning?.('独立 API 生成失败，维修兔无法修复请求错误；失败原因已显示在兔子镜内。');
        return true;
    }
    return false;
}


export function handleFeedbackCatClick(event, root, button) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (rabbitMirrorExternalGenerationNotice(root, 'feedback')) return;
    closeRecipeMenu();
    showFeedbackCatMenu(root, button);
}



export function closeRecipeMenu() {
    try { recipeOutsideCloseCleanup?.(); } catch {}
    recipeOutsideCloseCleanup = null;
    toolOutsideCloseOwners.delete('recipe');
    document.querySelectorAll?.(`[${RECIPE_MENU_ATTR}]`)?.forEach(panel => panel.remove());
}


function rabbitMirrorRecipeIdentity(root) {
    const details = root?.matches?.('details') ? root : root?.querySelector?.(':scope > details') || root?.querySelector?.('details');
    const chat = getAvailableHostChat();
    const ownerChat = String(details?.dataset?.rabbitMirrorOwnerChat || '').trim();
    const ownerMesid = Number(details?.dataset?.rabbitMirrorOwnerMesid);
    const messageIndex = Number.isInteger(ownerMesid) && ownerMesid >= 0 ? ownerMesid : getMessageIndexFromMirrorNode(root);
    const message = messageIndex >= 0 ? chat?.[messageIndex] : null;
    const ownerSwipe = Number(details?.dataset?.rabbitMirrorOwnerSwipe);
    const swipeId = Number.isInteger(ownerSwipe) && ownerSwipe >= 0
        ? ownerSwipe
        : Number.isInteger(message?.swipe_id) && message.swipe_id >= 0
            ? message.swipe_id
            : 0;
    const chatKey = ownerChat || getCurrentChatKey(chat);
    // Follow-mode external recovery may mount direct details instead of toto.
    // Its sanitizer-owned WeakMap proof is authoritative, not a model data-* ID.
    const proof = getSanitizedRabbitMirrorFaceProof(details);
    const faceIndex = getRabbitMirrorFacePosition(root)?.faceIndex
        ?? (proof?.origin === 'follow' ? proof.faceIndex : null);
    return { chatKey, messageIndex, swipeId, message, ...(Number.isInteger(faceIndex) ? { faceIndex } : {}) };
}


export function rabbitMirrorTextPresentation(root) {
    const details = root?.matches?.('details') ? root : root?.querySelector?.(':scope > details');
    const proof = getSanitizedRabbitMirrorFaceProof(root) || getSanitizedRabbitMirrorFaceProof(details)
        || getSanitizedRabbitMirrorFaceProof(root?.closest?.('toto'));
    if (proof?.presentationMode) return isTextPresentation(proof);
    return isTextPresentation(rabbitMirrorRecipeForRoot(root, true));
}


function rabbitMirrorRecipeForRoot(root, includeExternalOnly = false) {
    const identity = rabbitMirrorRecipeIdentity(root);
    return getRabbitMirrorRecipe({ ...identity, includeExternalOnly });
}


function recipeButtonTitle(recipe) {
    if (!recipe) return '本轮抽签：暂无可读取的抽取记录';
    const count = (recipe.themes?.length || 0) + (recipe.formats?.length || 0);
    const items = [...(recipe.themes || []), ...(recipe.formats || [])];
    const blocked = items.filter(item => isBlacklisted(item.kind, item.id)).length;
    const favored = items.filter(item => isFavorited(item.kind, item.id)).length;
    return `本轮抽签：${count} 项${favored ? `；${favored} 项已收藏` : ''}${blocked ? `；${blocked} 项已加入黑名单` : ''}`;
}


function recipePanelRow(item) {
    const blocked = isBlacklisted(item.kind, item.id);
    const favored = isFavorited(item.kind, item.id);
    const kindLabel = item.kind === 'format' ? '展现形式' : '主题 / 元素';
    const blacklistAction = item?.ambiguous
        ? blocked ? '解除两项黑名单' : '同时拉黑两项'
        : blocked ? '解除黑名单' : '加入黑名单';
    const favoriteAction = item?.ambiguous
        ? favored ? '解除两项收藏' : '同时收藏两项'
        : favored ? '取消收藏' : '加入收藏室';
    const ambiguityNote = item?.ambiguous
        ? '<div style="font-size:9px;opacity:.58;margin-top:3px;line-height:1.35;">旧版记录无法判断当时实际是哪一项；操作会同时作用于这两个旧同 ID 项目。</div>'
        : '';
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(127,127,127,.18);">
      <div style="min-width:0;flex:1;line-height:1.35;">
        <div style="font-size:10px;opacity:.58;margin-bottom:2px;">${kindLabel}</div>
        <div style="font-size:12px;font-weight:700;overflow-wrap:anywhere;">${feedbackCatEscapeHtml(item.id)} ${feedbackCatEscapeHtml(item.title)}</div>
        ${ambiguityNote}
      </div>
      <div style="display:flex;flex:0 0 auto;gap:5px;flex-wrap:wrap;justify-content:flex-end;max-width:190px;">
        <button type="button" data-rm-recipe-favorite-kind="${feedbackCatEscapeHtml(item.kind)}" data-rm-recipe-favorite-id="${feedbackCatEscapeHtml(item.id)}" style="border:1px solid rgba(127,127,127,.34);border-radius:7px;padding:5px 8px;background:${favored ? 'rgba(222,170,55,.16)' : 'rgba(222,170,55,.07)'};color:inherit;cursor:pointer;font:inherit;font-size:11px;">${favored ? '★ ' : '☆ '}${favoriteAction}</button>
        <button type="button" data-rm-recipe-blacklist-kind="${feedbackCatEscapeHtml(item.kind)}" data-rm-recipe-blacklist-id="${feedbackCatEscapeHtml(item.id)}" style="border:1px solid rgba(127,127,127,.34);border-radius:7px;padding:5px 8px;background:${blocked ? 'rgba(127,127,127,.12)' : 'rgba(190,70,70,.08)'};color:inherit;cursor:pointer;font:inherit;font-size:11px;">${blocked ? '✓ ' : '🚫 '}${blacklistAction}</button>
      </div>
    </div>`;
}


function recipeBlacklistManagerRow(item) {
    const kindLabel = item.kind === 'format' ? '展现形式' : '主题 / 元素';
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(127,127,127,.18);">
      <div style="min-width:0;flex:1;line-height:1.35;">
        <div style="font-size:10px;opacity:.58;margin-bottom:2px;">${kindLabel}</div>
        <div style="font-size:12px;font-weight:700;overflow-wrap:anywhere;">${feedbackCatEscapeHtml(item.id)} ${feedbackCatEscapeHtml(item.title)}</div>
      </div>
      <button type="button" data-rm-blacklist-manager-remove="true" data-rm-blacklist-manager-kind="${feedbackCatEscapeHtml(item.kind)}" data-rm-blacklist-manager-id="${feedbackCatEscapeHtml(item.id)}" style="flex:0 0 auto;border:1px solid rgba(127,127,127,.34);border-radius:7px;padding:5px 8px;background:rgba(127,127,127,.12);color:inherit;cursor:pointer;font:inherit;font-size:11px;">✓ 解除</button>
    </div>`;
}


function showBlacklistManagerMenu(root, button) {
    closeRecipeMenu();
    closeFeedbackCatMenu();
    closeMaintenanceRabbitMenu();
    const state = getBlacklistState();
    const themes = blacklistEntries('theme');
    const formats = blacklistEntries('format');
    const panel = document.createElement('div');
    panel.setAttribute(RECIPE_MENU_ATTR, 'true');
    panel.style.cssText = 'position:fixed;z-index:2147483646;box-sizing:border-box;padding:12px 13px;border:1px solid rgba(127,127,127,.35);border-radius:10px;background:var(--SmartThemeBlurTintColor,rgba(28,28,32,.97));color:var(--SmartThemeBodyColor,#eee);box-shadow:0 10px 32px rgba(0,0,0,.28);overflow:auto;font-family:inherit;';
    const themeRows = themes.map(recipeBlacklistManagerRow).join('');
    const formatRows = formats.map(recipeBlacklistManagerRow).join('');
    panel.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
        <button type="button" data-rm-blacklist-manager-action="back" style="border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;font-size:12px;padding:2px 4px;">←</button>
        <div style="font-weight:800;font-size:13px;">🚫 抽签黑名单</div>
      </div>
      <div style="font-size:10px;opacity:.62;line-height:1.45;margin-bottom:7px;">这里只显示真正会从随机候选池排除的项目，不向 Prompt 注入禁止文字。</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid rgba(127,127,127,.18);">
        <div style="font-size:11px;font-weight:700;">当前状态：${state.enabled ? '已启用' : '已暂停'}</div>
        <button type="button" data-rm-blacklist-manager-action="toggle-enabled" style="border:1px solid rgba(127,127,127,.34);border-radius:7px;padding:5px 8px;background:rgba(127,127,127,.10);color:inherit;cursor:pointer;font:inherit;font-size:11px;">${state.enabled ? '暂停黑名单' : '启用黑名单'}</button>
      </div>
      <div style="font-size:10px;opacity:.58;margin-top:9px;">主题 / 元素（${themes.length}）</div>
      ${themeRows || '<div style="padding:8px 0;opacity:.62;font-size:11px;">暂无。</div>'}
      <div style="font-size:10px;opacity:.58;margin-top:9px;">展现形式（${formats.length}）</div>
      ${formatRows || '<div style="padding:8px 0;opacity:.62;font-size:11px;">暂无。</div>'}
      <div style="display:flex;gap:7px;margin-top:10px;">
        <button type="button" data-rm-blacklist-manager-action="back" style="flex:1;border:1px solid rgba(127,127,127,.34);border-radius:7px;padding:6px 8px;background:rgba(127,127,127,.08);color:inherit;cursor:pointer;font:inherit;font-size:11px;">← 返回本轮抽签</button>
        <button type="button" data-rm-blacklist-manager-action="clear" ${themes.length || formats.length ? '' : 'disabled'} style="flex:1;border:1px solid rgba(190,70,70,.34);border-radius:7px;padding:6px 8px;background:rgba(190,70,70,.08);color:inherit;cursor:${themes.length || formats.length ? 'pointer' : 'default'};opacity:${themes.length || formats.length ? '1' : '.45'};font:inherit;font-size:11px;">清空全部</button>
      </div>`;
    document.body.appendChild(panel);
    positionFeedbackCatPanel(panel, button, 380);
    panel.addEventListener('click', event => {
        const remove = event.target?.closest?.('[data-rm-blacklist-manager-remove="true"]');
        if (remove && panel.contains(remove)) {
            event.preventDefault();
            event.stopPropagation();
            const kind = remove.getAttribute('data-rm-blacklist-manager-kind') === 'format' ? 'format' : 'theme';
            const id = String(remove.getAttribute('data-rm-blacklist-manager-id') || '');
            if (removeBlacklistItem(kind, id)) globalThis.toastr?.success?.(`已解除黑名单：${id}`);
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe);
            button.setAttribute('aria-label', button.title);
            closeRecipeMenu();
            showBlacklistManagerMenu(root, button);
            return;
        }
        const action = event.target?.closest?.('[data-rm-blacklist-manager-action]');
        if (!action || !panel.contains(action)) return;
        event.preventDefault();
        event.stopPropagation();
        const value = action.getAttribute('data-rm-blacklist-manager-action');
        if (value === 'back') {
            closeRecipeMenu();
            showRecipeMenu(root, button);
            return;
        }
        if (value === 'toggle-enabled') {
            setBlacklistEnabled(!getBlacklistState().enabled);
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe);
            button.setAttribute('aria-label', button.title);
            closeRecipeMenu();
            installRecipeButtonForRoot(root);
            return;
        }
        if (value === 'clear') {
            if (themes.length || formats.length) {
                clearBlacklist('all');
                globalThis.toastr?.success?.('已清空全部抽签黑名单。');
            }
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe);
            button.setAttribute('aria-label', button.title);
            closeRecipeMenu();
            showBlacklistManagerMenu(root, button);
        }
    });
    bindRecipeOutsideClose(panel, button);
    return true;
}


function recipeFavoriteManagerRow(item) {
    const multiplier = getFavoriteMultiplier(item.kind, item.id);
    return `<div style="display:flex;gap:7px;align-items:center;padding:7px 0;border-bottom:1px solid rgba(127,127,127,.18);">
      <div style="min-width:0;flex:1;">
        <div style="font-size:11px;font-weight:700;line-height:1.35;overflow-wrap:anywhere;">${feedbackCatEscapeHtml(item.title || item.id)}</div>
        <div style="font-size:9px;opacity:.55;margin-top:2px;">${feedbackCatEscapeHtml(item.id)} · ${item.kind === 'format' ? '展现形式' : '主题 / 元素'}</div>
      </div>
      <label style="display:inline-flex;align-items:center;gap:3px;flex:0 0 auto;font-size:10px;opacity:.9;">×<input type="number" inputmode="decimal" min="${FAVORITE_MULTIPLIER_MIN}" max="${FAVORITE_MULTIPLIER_MAX}" step="0.5" value="${feedbackCatEscapeHtml(String(multiplier))}" data-rm-favorite-multiplier-kind="${feedbackCatEscapeHtml(item.kind)}" data-rm-favorite-multiplier-id="${feedbackCatEscapeHtml(item.id)}" style="width:50px;box-sizing:border-box;border:1px solid rgba(222,170,55,.38);border-radius:6px;padding:4px 5px;background:rgba(127,127,127,.10);color:inherit;font:inherit;font-size:11px;"></label>
      <button type="button" data-rm-favorite-manager-remove="true" data-rm-favorite-manager-kind="${feedbackCatEscapeHtml(item.kind)}" data-rm-favorite-manager-id="${feedbackCatEscapeHtml(item.id)}" style="flex:0 0 auto;border:1px solid rgba(222,170,55,.34);border-radius:7px;padding:5px 8px;background:rgba(222,170,55,.10);color:inherit;cursor:pointer;font:inherit;font-size:11px;">★ 取消收藏</button>
    </div>`;
}


function showFavoriteManagerMenu(root, button) {
    closeRecipeMenu();
    closeFeedbackCatMenu();
    closeMaintenanceRabbitMenu();
    const themes = favoriteEntries('theme');
    const formats = favoriteEntries('format');
    const panel = document.createElement('div');
    panel.setAttribute(RECIPE_MENU_ATTR, 'true');
    panel.style.cssText = 'position:fixed;z-index:2147483646;box-sizing:border-box;padding:12px 13px;border:1px solid rgba(127,127,127,.35);border-radius:10px;background:var(--SmartThemeBlurTintColor,rgba(28,28,32,.97));color:var(--SmartThemeBodyColor,#eee);box-shadow:0 10px 32px rgba(0,0,0,.28);overflow:auto;font-family:inherit;';
    const themeRows = themes.map(recipeFavoriteManagerRow).join('');
    const formatRows = formats.map(recipeFavoriteManagerRow).join('');
    panel.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
        <button type="button" data-rm-favorite-manager-action="back" style="border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;font-size:12px;padding:2px 4px;">←</button>
        <div style="font-weight:800;font-size:13px;">⭐ 收藏室</div>
      </div>
      <div style="font-size:10px;opacity:.62;line-height:1.45;margin-bottom:7px;">收藏只在本地提高随机抽取权重，不向 Prompt 追加偏好文字；不会越过黑名单或近期冷却。每项可单独设置 ×1～×50，旧收藏默认 ×3。×50 仍是相对随机权重，不代表 50% 或必出。</div>
      <div style="font-size:10px;opacity:.58;margin-top:9px;">主题 / 元素（${themes.length}）</div>
      ${themeRows || '<div style="padding:8px 0;opacity:.62;font-size:11px;">暂无。</div>'}
      <div style="font-size:10px;opacity:.58;margin-top:9px;">展现形式（${formats.length}）</div>
      ${formatRows || '<div style="padding:8px 0;opacity:.62;font-size:11px;">暂无。</div>'}
      <div style="display:flex;gap:7px;margin-top:10px;">
        <button type="button" data-rm-favorite-manager-action="back" style="flex:1;border:1px solid rgba(127,127,127,.34);border-radius:7px;padding:6px 8px;background:rgba(127,127,127,.08);color:inherit;cursor:pointer;font:inherit;font-size:11px;">← 返回本轮抽签</button>
        <button type="button" data-rm-favorite-manager-action="clear" ${themes.length || formats.length ? '' : 'disabled'} style="flex:1;border:1px solid rgba(222,170,55,.34);border-radius:7px;padding:6px 8px;background:rgba(222,170,55,.08);color:inherit;cursor:${themes.length || formats.length ? 'pointer' : 'default'};opacity:${themes.length || formats.length ? '1' : '.45'};font:inherit;font-size:11px;">清空收藏室</button>
      </div>`;
    document.body.appendChild(panel);
    positionFeedbackCatPanel(panel, button, 400);
    panel.addEventListener('change', event => {
        const input = event.target?.closest?.('[data-rm-favorite-multiplier-kind][data-rm-favorite-multiplier-id]');
        if (!input || !panel.contains(input)) return;
        const kind = input.getAttribute('data-rm-favorite-multiplier-kind') === 'format' ? 'format' : 'theme';
        const id = String(input.getAttribute('data-rm-favorite-multiplier-id') || '');
        const raw = String(input.value ?? '').trim();
        if (!raw || !Number.isFinite(Number(raw))) {
            input.value = String(getFavoriteMultiplier(kind, id));
            globalThis.toastr?.warning?.(`收藏倍率未修改：${id}。请输入 ${FAVORITE_MULTIPLIER_MIN}～${FAVORITE_MULTIPLIER_MAX} 之间的数字。`);
            return;
        }
        const value = setFavoriteMultiplier(kind, id, raw);
        if (value == null) {
            globalThis.toastr?.warning?.(`收藏倍率没有修改：${id}。请确认该项目仍在收藏室。`);
            closeRecipeMenu();
            showFavoriteManagerMenu(root, button);
            return;
        }
        input.value = String(value);
        globalThis.toastr?.success?.(`收藏倍率已设为 ×${value}：${id}`);
    });
    panel.addEventListener('click', event => {
        const remove = event.target?.closest?.('[data-rm-favorite-manager-remove="true"]');
        if (remove && panel.contains(remove)) {
            event.preventDefault();
            event.stopPropagation();
            const kind = remove.getAttribute('data-rm-favorite-manager-kind') === 'format' ? 'format' : 'theme';
            const id = String(remove.getAttribute('data-rm-favorite-manager-id') || '');
            if (removeFavoriteItem(kind, id)) globalThis.toastr?.success?.(`已取消收藏：${id}`);
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe);
            button.setAttribute('aria-label', button.title);
            closeRecipeMenu();
            showFavoriteManagerMenu(root, button);
            return;
        }
        const action = event.target?.closest?.('[data-rm-favorite-manager-action]');
        if (!action || !panel.contains(action)) return;
        event.preventDefault();
        event.stopPropagation();
        const value = action.getAttribute('data-rm-favorite-manager-action');
        if (value === 'back') {
            closeRecipeMenu();
            showRecipeMenu(root, button);
            return;
        }
        if (value === 'clear') {
            if (themes.length || formats.length) {
                clearFavorites('all');
                globalThis.toastr?.success?.('已清空收藏室。');
            }
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe);
            button.setAttribute('aria-label', button.title);
            closeRecipeMenu();
            showFavoriteManagerMenu(root, button);
        }
    });
    bindRecipeOutsideClose(panel, button);
    return true;
}



function catalogParentId(item, idSet) {
    const id = String(item?.id || '');
    const parts = id.split('.').filter(Boolean);
    for (let cut = parts.length - 1; cut >= 1; cut--) {
        const candidate = parts.slice(0, cut).join('.');
        if (idSet.has(candidate)) return candidate;
    }
    return '';
}


function buildSelectionCatalog(kind) {
    const entries = selectionCatalogEntries(kind);
    const idSet = new Set(entries.map(item => item.id));
    const byId = new Map(entries.map(item => [item.id, item]));
    const children = new Map();
    const groups = new Map();
    for (const item of entries) {
        const parentId = catalogParentId(item, idSet);
        if (parentId) {
            if (!children.has(parentId)) children.set(parentId, []);
            children.get(parentId).push(item);
        } else {
            const group = String(item.group || '其他');
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group).push(item);
        }
    }
    const sortItems = items => [...items].sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
    for (const [key, items] of children) children.set(key, sortItems(items));
    for (const [key, items] of groups) groups.set(key, sortItems(items));
    return { kind, entries, idSet, byId, children, groups };
}


function catalogItemRow(item, tree) {
    const favored = isFavorited(item.kind, item.id);
    const blocked = isBlacklisted(item.kind, item.id);
    const childCount = tree.children.get(item.id)?.length || 0;
    const multiplier = favored ? getFavoriteMultiplier(item.kind, item.id) : 0;
    return `<div style="display:flex;gap:6px;align-items:center;padding:7px 0;border-bottom:1px solid rgba(127,127,127,.16);">
      <button type="button" ${childCount ? `data-rm-catalog-enter-id="${feedbackCatEscapeHtml(item.id)}"` : 'disabled'} style="flex:0 0 25px;width:25px;height:25px;border:1px solid rgba(127,127,127,.28);border-radius:6px;background:rgba(127,127,127,.08);color:inherit;cursor:${childCount ? 'pointer' : 'default'};opacity:${childCount ? '1' : '.28'};font:inherit;">${childCount ? '›' : '·'}</button>
      <div style="min-width:0;flex:1;">
        <div style="font-size:11px;font-weight:700;line-height:1.35;overflow-wrap:anywhere;">${feedbackCatEscapeHtml(item.title || item.id)}</div>
        <div style="font-size:9px;opacity:.54;margin-top:2px;overflow-wrap:anywhere;">${feedbackCatEscapeHtml(item.id)}${childCount ? ` · 下级 ${childCount} 项` : ''}</div>
      </div>
      <button type="button" data-rm-catalog-favorite-kind="${feedbackCatEscapeHtml(item.kind)}" data-rm-catalog-favorite-id="${feedbackCatEscapeHtml(item.id)}" style="flex:0 0 auto;border:1px solid rgba(222,170,55,.34);border-radius:7px;padding:5px 7px;background:${favored ? 'rgba(222,170,55,.22)' : 'rgba(127,127,127,.08)'};color:inherit;cursor:pointer;font:inherit;font-size:10px;font-weight:700;">${favored ? `★ ×${feedbackCatEscapeHtml(String(multiplier))}` : '☆'}</button>
      <button type="button" data-rm-catalog-blacklist-kind="${feedbackCatEscapeHtml(item.kind)}" data-rm-catalog-blacklist-id="${feedbackCatEscapeHtml(item.id)}" style="flex:0 0 auto;border:1px solid rgba(190,70,70,.34);border-radius:7px;padding:5px 7px;background:${blocked ? 'rgba(190,70,70,.22)' : 'rgba(127,127,127,.08)'};color:inherit;cursor:pointer;font:inherit;font-size:10px;font-weight:700;">${blocked ? '🚫' : '○'}</button>
    </div>`;
}


function showSelectionCatalogMenu(root, button, navigation = {}) {
    closeRecipeMenu();
    closeFeedbackCatMenu();
    closeMaintenanceRabbitMenu();
    const kind = navigation.kind === 'format' ? 'format' : navigation.kind === 'theme' ? 'theme' : '';
    const group = String(navigation.group || '');
    const parentId = String(navigation.parentId || '');
    const query = String(navigation.query || '').trim();
    const panel = document.createElement('div');
    panel.setAttribute(RECIPE_MENU_ATTR, 'true');
    panel.style.cssText = 'position:fixed;z-index:2147483646;box-sizing:border-box;padding:12px 13px;border:1px solid rgba(127,127,127,.35);border-radius:10px;background:var(--SmartThemeBlurTintColor,rgba(28,28,32,.97));color:var(--SmartThemeBodyColor,#eee);box-shadow:0 10px 32px rgba(0,0,0,.28);overflow:auto;font-family:inherit;';

    let body = '';
    let tree = null;
    if (!kind) {
        const themeCount = selectionCatalogEntries('theme').length;
        const formatCount = selectionCatalogEntries('format').length;
        body = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px;">
          <button type="button" data-rm-catalog-kind="theme" style="border:1px solid rgba(127,127,127,.34);border-radius:8px;padding:10px 8px;background:rgba(127,127,127,.09);color:inherit;cursor:pointer;font:inherit;font-size:11px;font-weight:700;">主题 / 元素<br><span style="font-size:9px;opacity:.6;font-weight:400;">${themeCount} 项</span></button>
          <button type="button" data-rm-catalog-kind="format" style="border:1px solid rgba(127,127,127,.34);border-radius:8px;padding:10px 8px;background:rgba(127,127,127,.09);color:inherit;cursor:pointer;font:inherit;font-size:11px;font-weight:700;">展现形式<br><span style="font-size:9px;opacity:.6;font-weight:400;">${formatCount} 项</span></button>
        </div>`;
    } else {
        tree = buildSelectionCatalog(kind);
        const kindLabel = kind === 'format' ? '展现形式' : '主题 / 元素';
        const searchResults = query ? tree.entries.filter(item => `${item.id} ${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase())) : [];
        const clippedResults = searchResults.slice(0, 80);
        let rows = '';
        let title = kindLabel;
        if (query) {
            title = `${kindLabel} · 搜索`;
            rows = clippedResults.map(item => catalogItemRow(item, tree)).join('') || '<div style="padding:10px 0;opacity:.62;font-size:11px;">没有匹配项目。</div>';
            if (searchResults.length > clippedResults.length) rows += `<div style="font-size:9px;opacity:.55;margin-top:6px;">匹配 ${searchResults.length} 项，仅显示前 ${clippedResults.length} 项；请继续缩小关键词。</div>`;
        } else if (!group) {
            title = `${kindLabel} · 大组`;
            const groupKeys = [...tree.groups.keys()].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
            rows = groupKeys.map(key => {
                const roots = tree.groups.get(key) || [];
                const descendantCount = tree.entries.filter(item => String(item.group || '其他') === key).length;
                return `<button type="button" data-rm-catalog-group="${feedbackCatEscapeHtml(key)}" style="display:flex;width:100%;align-items:center;justify-content:space-between;gap:8px;border:0;border-bottom:1px solid rgba(127,127,127,.16);padding:9px 3px;background:transparent;color:inherit;cursor:pointer;font:inherit;text-align:left;"><span style="font-size:11px;font-weight:700;">组 ${feedbackCatEscapeHtml(key)}</span><span style="font-size:9px;opacity:.56;">${descendantCount} 项 · ${roots.length} 个顶层 ›</span></button>`;
            }).join('');
        } else {
            const current = parentId ? tree.byId.get(parentId) : null;
            title = current ? `${kindLabel} · ${current.title}` : `${kindLabel} · 组 ${group}`;
            const items = parentId ? (tree.children.get(parentId) || []) : (tree.groups.get(group) || []);
            rows = items.map(item => catalogItemRow(item, tree)).join('') || '<div style="padding:10px 0;opacity:.62;font-size:11px;">这一层没有项目。</div>';
        }
        body = `<div style="display:flex;gap:6px;margin:8px 0;">
          <input type="search" value="${feedbackCatEscapeHtml(query)}" data-rm-catalog-search style="min-width:0;flex:1;box-sizing:border-box;border:1px solid rgba(127,127,127,.32);border-radius:7px;padding:6px 7px;background:rgba(127,127,127,.08);color:inherit;font:inherit;font-size:11px;" placeholder="搜索名称 / ID / 说明">
          <button type="button" data-rm-catalog-search-action="run" style="border:1px solid rgba(127,127,127,.32);border-radius:7px;padding:6px 8px;background:rgba(127,127,127,.08);color:inherit;cursor:pointer;font:inherit;font-size:10px;">搜索</button>
          ${query ? '<button type="button" data-rm-catalog-search-action="clear" style="border:1px solid rgba(127,127,127,.32);border-radius:7px;padding:6px 8px;background:rgba(127,127,127,.08);color:inherit;cursor:pointer;font:inherit;font-size:10px;">清除</button>' : ''}
        </div><div style="font-size:10px;font-weight:700;opacity:.72;margin:3px 0 4px;">${feedbackCatEscapeHtml(title)}</div>${rows}`;
    }

    panel.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
        <button type="button" data-rm-catalog-action="back" style="border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;font-size:12px;padding:2px 4px;">←</button>
        <div style="font-weight:800;font-size:13px;">📚 全池一览</div>
      </div>
      <div style="font-size:10px;opacity:.62;line-height:1.45;">无需等项目被随机抽中。按层级浏览或搜索后，可直接收藏 / 拉黑；操作仍只影响本地随机池，不增加 Prompt。</div>
      ${body}`;
    document.body.appendChild(panel);
    positionFeedbackCatPanel(panel, button, 420);

    const reopen = next => { closeRecipeMenu(); showSelectionCatalogMenu(root, button, next); };
    const parentOf = id => {
        if (!tree || !id) return '';
        const item = tree.byId.get(id);
        return item ? catalogParentId(item, tree.idSet) : '';
    };
    panel.addEventListener('keydown', event => {
        const input = event.target?.closest?.('[data-rm-catalog-search]');
        if (!input || event.key !== 'Enter') return;
        event.preventDefault();
        reopen({ kind, query: input.value });
    });
    panel.addEventListener('click', event => {
        const action = event.target?.closest?.('[data-rm-catalog-action]');
        if (action && panel.contains(action)) {
            event.preventDefault(); event.stopPropagation();
            if (!kind) { closeRecipeMenu(); showRecipeMenu(root, button); return; }
            if (query) { reopen({ kind }); return; }
            if (parentId) {
                const previousParent = parentOf(parentId);
                reopen({ kind, group, parentId: previousParent });
                return;
            }
            if (group) { reopen({ kind }); return; }
            reopen({});
            return;
        }
        const kindButton = event.target?.closest?.('[data-rm-catalog-kind]');
        if (kindButton && panel.contains(kindButton)) { event.preventDefault(); event.stopPropagation(); reopen({ kind: kindButton.getAttribute('data-rm-catalog-kind') }); return; }
        const groupButton = event.target?.closest?.('[data-rm-catalog-group]');
        if (groupButton && panel.contains(groupButton)) { event.preventDefault(); event.stopPropagation(); reopen({ kind, group: String(groupButton.getAttribute('data-rm-catalog-group') || '') }); return; }
        const enterButton = event.target?.closest?.('[data-rm-catalog-enter-id]');
        if (enterButton && panel.contains(enterButton)) { event.preventDefault(); event.stopPropagation(); reopen({ kind, group, parentId: String(enterButton.getAttribute('data-rm-catalog-enter-id') || '') }); return; }
        const searchAction = event.target?.closest?.('[data-rm-catalog-search-action]');
        if (searchAction && panel.contains(searchAction)) {
            event.preventDefault(); event.stopPropagation();
            const mode = searchAction.getAttribute('data-rm-catalog-search-action');
            const input = panel.querySelector('[data-rm-catalog-search]');
            if (mode === 'clear') reopen({ kind });
            else reopen({ kind, query: String(input?.value || '') });
            return;
        }
        const favoriteAction = event.target?.closest?.('[data-rm-catalog-favorite-kind][data-rm-catalog-favorite-id]');
        if (favoriteAction && panel.contains(favoriteAction)) {
            event.preventDefault(); event.stopPropagation();
            const actionKind = favoriteAction.getAttribute('data-rm-catalog-favorite-kind') === 'format' ? 'format' : 'theme';
            const id = String(favoriteAction.getAttribute('data-rm-catalog-favorite-id') || '');
            const before = isFavorited(actionKind, id);
            const after = toggleFavoriteItem(actionKind, id);
            if (after === before) globalThis.toastr?.warning?.(`收藏室没有修改：${id}。`);
            else globalThis.toastr?.success?.(after ? `已加入收藏室：${id}（默认 ×3，可在收藏室修改倍率）` : `已取消收藏：${id}`);
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe); button.setAttribute('aria-label', button.title);
            reopen({ kind, group, parentId, query });
            return;
        }
        const blacklistAction = event.target?.closest?.('[data-rm-catalog-blacklist-kind][data-rm-catalog-blacklist-id]');
        if (blacklistAction && panel.contains(blacklistAction)) {
            event.preventDefault(); event.stopPropagation();
            const actionKind = blacklistAction.getAttribute('data-rm-catalog-blacklist-kind') === 'format' ? 'format' : 'theme';
            const id = String(blacklistAction.getAttribute('data-rm-catalog-blacklist-id') || '');
            const before = isBlacklisted(actionKind, id);
            const after = toggleBlacklistItem(actionKind, id);
            if (after === before) globalThis.toastr?.warning?.(`黑名单没有修改：${id}。`);
            else globalThis.toastr?.success?.(after ? `已加入黑名单：${id}` : `已解除黑名单：${id}`);
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe); button.setAttribute('aria-label', button.title);
            reopen({ kind, group, parentId, query });
        }
    });
    bindRecipeOutsideClose(panel, button);
    return true;
}


function showRecipeMenu(root, button) {
    closeRecipeMenu();
    closeFeedbackCatMenu();
    closeMaintenanceRabbitMenu();
    const recipe = rabbitMirrorRecipeForRoot(root, true);
    const state = getBlacklistState();
    const favoriteState = getFavoritesState();
    const items = [...(recipe?.themes || []), ...(recipe?.formats || [])];
    const panel = document.createElement('div');
    panel.setAttribute(RECIPE_MENU_ATTR, 'true');
    panel.style.cssText = 'position:fixed;z-index:2147483646;box-sizing:border-box;padding:12px 13px;border:1px solid rgba(127,127,127,.35);border-radius:10px;background:var(--SmartThemeBlurTintColor,rgba(28,28,32,.97));color:var(--SmartThemeBodyColor,#eee);box-shadow:0 10px 32px rgba(0,0,0,.28);overflow:auto;font-family:inherit;';
    const directiveNote = recipe?.userDirectiveApplied ? '本轮含用户明确点菜；黑名单只影响之后的随机抽取。' : '';
    const forcedNote = recipe?.forcedVisualScenery ? '本轮含固定动态视觉场景；固定模式会优先于随机黑名单。' : '';
    const emptyNote = !recipe ? '本面暂无可读取的抽签记录；无法确定本面抽中了哪些项目。仍可管理全局黑名单、收藏和全池。'
        : recipe.hasExternalReferences ? '本面仅有外部材料记录，没有可列出的内部主题或展现形式。可在下方管理全局黑名单、收藏和全池。'
        : '本轮没有记录主题或展现形式。';
    const totalBlocked = state.themeIds.length + state.formatIds.length;
    const totalFavorites = favoriteState.themeIds.length + favoriteState.formatIds.length;
    panel.innerHTML = `<div style="font-weight:800;font-size:13px;margin-bottom:3px;">🎲 本轮抽签</div>
      <div style="font-size:10px;opacity:.62;line-height:1.45;margin-bottom:7px;">显示的是这一面兔子镜当时真实抽中的内部项目，不做 AI 事后分析。⭐ 收藏提高本地随机权重；🚫 黑名单从随机池排除；两者互斥且都不加 Prompt。</div>
      ${items.map(recipePanelRow).join('') || `<div data-rm-recipe-record-status style="padding:8px 0;opacity:.68;font-size:11px;">${emptyNote}</div>`}
      <div style="display:flex;gap:7px;margin-top:9px;flex-wrap:wrap;">
        <button type="button" data-rm-recipe-action="favorite-manager" style="flex:1 1 100px;border:1px solid rgba(222,170,55,.34);border-radius:7px;padding:6px 8px;background:rgba(222,170,55,.08);color:inherit;cursor:pointer;font:inherit;font-size:11px;font-weight:700;">⭐ 收藏室${totalFavorites ? `（${totalFavorites}）` : ''}</button>
        <button type="button" data-rm-recipe-action="blacklist-manager" style="flex:1 1 100px;border:1px solid rgba(127,127,127,.34);border-radius:7px;padding:6px 8px;background:rgba(127,127,127,.08);color:inherit;cursor:pointer;font:inherit;font-size:11px;font-weight:700;">🚫 黑名单${totalBlocked ? `（${totalBlocked}）` : ''}</button>
        <button type="button" data-rm-recipe-action="catalog-manager" style="flex:1 1 100%;border:1px solid rgba(80,135,190,.34);border-radius:7px;padding:6px 8px;background:rgba(80,135,190,.08);color:inherit;cursor:pointer;font:inherit;font-size:11px;font-weight:700;">📚 全池一览</button>
      </div>
      <div style="font-size:10px;opacity:.68;line-height:1.5;margin-top:9px;">${state.enabled ? '黑名单已启用。' : '黑名单目前暂时停用；名单仍保留。'}${directiveNote ? `<br>${feedbackCatEscapeHtml(directiveNote)}` : ''}${forcedNote ? `<br>${feedbackCatEscapeHtml(forcedNote)}` : ''}</div>`;
    document.body.appendChild(panel);
    positionFeedbackCatPanel(panel, button, 360);
    panel.addEventListener('click', event => {
        const managerAction = event.target?.closest?.('[data-rm-recipe-action="blacklist-manager"], [data-rm-recipe-action="favorite-manager"], [data-rm-recipe-action="catalog-manager"]');
        if (managerAction && panel.contains(managerAction)) {
            event.preventDefault();
            event.stopPropagation();
            const manager = managerAction.getAttribute('data-rm-recipe-action');
            closeRecipeMenu();
            if (manager === 'favorite-manager') showFavoriteManagerMenu(root, button);
            else if (manager === 'catalog-manager') showSelectionCatalogMenu(root, button);
            else showBlacklistManagerMenu(root, button);
            return;
        }
        const favoriteAction = event.target?.closest?.('[data-rm-recipe-favorite-kind][data-rm-recipe-favorite-id]');
        if (favoriteAction && panel.contains(favoriteAction)) {
            event.preventDefault();
            event.stopPropagation();
            const kind = favoriteAction.getAttribute('data-rm-recipe-favorite-kind') === 'format' ? 'format' : 'theme';
            const id = String(favoriteAction.getAttribute('data-rm-recipe-favorite-id') || '');
            const wasFavorited = isFavorited(kind, id);
            const nowFavorited = toggleFavoriteItem(kind, id);
            if (nowFavorited === wasFavorited) {
                globalThis.toastr?.warning?.(`收藏室没有修改：${id}。项目可能已失效，或收藏已达到容量上限。`);
            } else {
                globalThis.toastr?.success?.(nowFavorited ? `已加入收藏室：${id}；之后随机抽中概率会提高。` : `已取消收藏：${id}`);
            }
            const freshRecipe = rabbitMirrorRecipeForRoot(root);
            button.title = recipeButtonTitle(freshRecipe);
            button.setAttribute('aria-label', button.title);
            closeRecipeMenu();
            showRecipeMenu(root, button);
            return;
        }
        const action = event.target?.closest?.('[data-rm-recipe-blacklist-kind][data-rm-recipe-blacklist-id]');
        if (!action || !panel.contains(action)) return;
        event.preventDefault();
        event.stopPropagation();
        const kind = action.getAttribute('data-rm-recipe-blacklist-kind') === 'format' ? 'format' : 'theme';
        const id = String(action.getAttribute('data-rm-recipe-blacklist-id') || '');
        const wasBlocked = isBlacklisted(kind, id);
        const nowBlocked = toggleBlacklistItem(kind, id);
        if (nowBlocked === wasBlocked) {
            globalThis.toastr?.warning?.(`黑名单没有修改：${id}。项目可能已失效，或名单已达到容量上限。`);
        } else {
            globalThis.toastr?.success?.(nowBlocked ? `已加入黑名单：${id}；从下一轮随机抽取开始生效。` : `已解除黑名单：${id}`);
        }
        const freshRecipe = rabbitMirrorRecipeForRoot(root);
        button.title = recipeButtonTitle(freshRecipe);
        button.setAttribute('aria-label', button.title);
        closeRecipeMenu();
        showRecipeMenu(root, button);
    });
    bindRecipeOutsideClose(panel, button);
    return true;
}


export function handleRecipeClick(event, root, button) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (rabbitMirrorExternalGenerationNotice(root, 'feedback')) return;
    showRecipeMenu(root, button);
}


function maintenanceRecommendationForInspection(inspection) {
    const findings = inspection?.findings || [];
    const plan = maintenanceRepairModesForFindings(findings);
    if (findings.length) {
        return {
            mode: 'auto',
            label: `✨ 自动按顺序维修 ${findings.length} 项`,
            reason: `检测结果：${maintenanceFindingReason(findings)}。维修顺序：${maintenanceRepairPlanLabel(plan)}`,
        };
    }
    if (inspection?.state === MAINTENANCE_STATES.notice) {
        return { mode: 'patrol', label: '🌐 文案英文占比偏高', reason: inspection.reason || '语言平衡提示；不自动改写正文' };
    }
    if (inspection?.state === MAINTENANCE_STATES.unknown) {
        return { mode: 'diagnostic', label: '📋 生成全链路诊断', reason: '没有足够证据自动选择安全修复路线' };
    }
    return { mode: 'patrol', label: '无需维修', reason: '巡逻未发现高置信异常' };
}


function maintenanceRecommendationText(inspection) {
    const findings = inspection?.findings || [];
    if (findings.length) {
        const labels = [];
        for (const finding of findings) {
            const label = finding?.stage === 'visibility'
                ? '排版／显示'
                : (MAINTENANCE_FINDING_STAGE_LABELS[finding?.stage] || '其他');
            if (!labels.includes(label)) labels.push(label);
        }
        return `检测到 ${findings.length} 项：${labels.join('、')}`;
    }
    if (inspection?.state === MAINTENANCE_STATES.notice) return '检测到：可见文案英文占比偏高（允许少量英文）';
    if (inspection?.state === MAINTENANCE_STATES.unknown) return '暂无法安全判断，可生成全链路诊断';
    return '未发现高置信异常';
}


function showMaintenanceRabbitMenu(root, button) {
    closeFeedbackCatMenu();
    closeMaintenanceRabbitMenu();
    if (!root?.isConnected || !button?.isConnected) return false;
    const panel = document.createElement('div');
    panel.className = 'rabbit-mirror-maintenance-menu';
    panel.setAttribute(MAINTENANCE_MENU_ATTR, 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '维修兔');
    // Keep menu opening instant. Full inspection can be expensive on large generated DOM,
    // so only run it after the user explicitly chooses auto/patrol/diagnostic.
    panel.innerHTML = `
      <div class="rabbit-mirror-maintenance-menu-title">🐇 这面兔子镜哪里不对？</div>
      <div class="rabbit-mirror-maintenance-recommendation" data-rm-recommended-action="manual">请先点出有问题的交互，再选对应修复。不会自动改你没打开的内容。</div>
      <button type="button" data-rm-maintenance-action="interaction">🖱️ 点了没有反应</button>
      <button type="button" data-rm-maintenance-action="reveal-clip">📖 展开后文字被裁／显示不全</button>
      <button type="button" data-rm-maintenance-action="narrow-width">⚡ 强效电击：恢复窄面</button>
      <button type="button" data-rm-maintenance-action="auto">✨ 自动判断并维修</button>
      <button type="button" data-rm-maintenance-action="patrol">🔍 只巡逻，不修改</button>
      <button type="button" data-rm-maintenance-action="text">📱 其他排版不适配</button>
      <button type="button" data-rm-maintenance-action="source">📄 空白或显示代码、纯文字</button>
      <button type="button" data-rm-maintenance-action="style">🎨 样子不对</button>
      <button type="button" data-rm-maintenance-action="all">🔧 全部试试（仅当前兔子镜）</button>
      <button type="button" data-rm-maintenance-action="reset-interaction" ${hasRabbitMirrorInteractionResetSnapshot(root) || (typeof canRestoreIndependentSwipeInitial === 'function' && canRestoreIndependentSwipeInitial(root)) ? '' : 'disabled'}>⏪ 恢复到初始</button>
      <button type="button" data-rm-maintenance-action="copy-html" style="min-height:44px!important;">复制本面 HTML（含样式）</button>
      <button type="button" data-rm-maintenance-action="download-html" style="min-height:44px!important;">下载本面 HTML 文件</button>
      <div data-rm-copy-html-status role="status" aria-live="polite" style="font-size:12px;line-height:1.5;">复制为独立 HTML，仅包含本面。依赖兔子镜脚本的交互不会随文件导出。</div>
      <button type="button" data-rm-maintenance-action="diagnostic">📋 生成全链路诊断</button>
      <button type="button" data-rm-maintenance-action="close">关闭</button>`;
    const recommendation = panel.querySelector('.rabbit-mirror-maintenance-recommendation');
    if (recommendation) {
        const state = button.getAttribute(MAINTENANCE_STATE_ATTR) || MAINTENANCE_STATES.idle;
        const reason = button.getAttribute(MAINTENANCE_REASON_ATTR) || '';
        // The reason may contain diagnostic detail. Keep it out of innerHTML so a
        // repaired/model-produced string can never become executable menu markup.
        recommendation.textContent = maintenanceMenuProblemText(state, reason);
        recommendation.setAttribute('data-rm-maintenance-problem-text', 'true');
    }
    document.body.appendChild(panel);
    const rect = button.getBoundingClientRect();
    const width = Math.min(300, Math.max(240, globalThis.innerWidth - 24));
    panel.style.width = `${width}px`;
    const left = Math.max(12, Math.min(rect.left, globalThis.innerWidth - width - 12));
    panel.style.left = `${left}px`;
    panel.style.top = `${Math.min(rect.bottom + 6, globalThis.innerHeight - panel.offsetHeight - 12)}px`;
    if (typeof fitMirrorToolPanel === 'function') fitMirrorToolPanel(panel, button, 340);
    panel.addEventListener('click', event => {
        const action = event.target?.closest?.('[data-rm-maintenance-action]')?.getAttribute('data-rm-maintenance-action');
        if (!action) return;
        event.preventDefault();
        event.stopPropagation();
        if (action === 'download-html') {
            downloadRabbitMirrorCurrentFaceHtml(root, event.target.closest('[data-rm-maintenance-action]'), panel);
            return;
        }
        if (action === 'copy-html') {
            void copyRabbitMirrorCurrentFaceHtml(root, event.target.closest('[data-rm-maintenance-action]'), panel);
            return;
        }
        closeMaintenanceRabbitMenu();
        if (action === 'close') return;
        if (action === 'narrow-width') {
            void runMaintenanceNarrowFaceRepair(root, button);
            return;
        }
        if (action === 'reveal-clip') {
            runMaintenanceRevealClipRepair(root, button);
            return;
        }
        if (action === 'reset-interaction') {
            const repairRun = beginMaintenanceRepairRun(root, button);
            if (!repairRun) return;
            try {
                const restoreSwipe = globalThis.__rabbitMirrorIndependentActionsV1?.restoreInitial;
                if (typeof restoreSwipe === 'function' && restoreSwipe(root)) {
                    finishMaintenanceRepairRun(repairRun);
                    return;
                }
                if (!rejectOversizedMaintenanceRepair(root, button, '恢复到初始')) {
                    restoreRabbitMirrorInteractionResetSnapshot(root, button);
                }
            } catch (error) {
                console.debug('[RabbitMirror] interaction reset failed:', error);
                failMaintenanceRabbit(button, '恢复到初始执行失败，请生成全链路诊断');
            } finally {
                finishMaintenanceRepairRun(repairRun);
            }
            return;
        }
        if (action === 'patrol') {
            patrolMaintenanceRabbit(root, button);
            return;
        }
        if (action === 'diagnostic') {
            triggerDiagnosticForMaintenanceRoot(root);
            return;
        }
        runMaintenanceUserRepair(root, button, action);
    }, true);
    bindMaintenanceOutsideClose(panel, button);
    return true;
}


export function handleMaintenanceRabbitClick(event, root, button) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (rabbitMirrorExternalGenerationNotice(root, 'maintenance')) return;
    showMaintenanceRabbitMenu(root, button);
}


function setImportantStyle(element, property, value) {
    if (!element?.style) return false;
    if (element.style.getPropertyValue(property) === value && element.style.getPropertyPriority(property) === 'important') return false;
    element.style.setProperty(property, value, 'important');
    return true;
}


function normalizeRabbitMirrorToolHost(host) {
    if (!host) return false;
    host.hidden = false;
    host.removeAttribute?.('aria-hidden');
    host.setAttribute(TOOL_ENTRY_HOST_ATTR, 'true');
    host.setAttribute(RUNTIME_VERSION_ATTR, RUNTIME_VERSION);
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', '兔子镜工具');
    const styles = {
        all: 'initial', display: 'inline-flex', 'align-items': 'center', 'justify-content': 'flex-end', gap: '2px',
        float: 'inline-end', flex: '0 0 auto', position: 'relative', 'z-index': '2147483000', width: 'auto',
        'min-width': '0', height: 'auto', 'min-height': '0', 'max-width': 'none', 'max-height': 'none',
        margin: '0 0 0 6px', 'margin-inline-start': 'auto', padding: '0', overflow: 'visible', visibility: 'visible', opacity: '1',
        'pointer-events': 'auto', transform: 'none', filter: 'none', clip: 'auto', 'clip-path': 'none',
        'white-space': 'nowrap', 'vertical-align': 'middle', color: 'inherit', font: 'inherit', 'line-height': '1',
        isolation: 'isolate',
    };
    let changed = false;
    for (const [property, value] of Object.entries(styles)) changed = setImportantStyle(host, property, value) || changed;
    return changed;
}


export function normalizeRabbitMirrorToolButton(button) {
    if (!button) return false;
    button.hidden = false;
    button.disabled = false;
    button.removeAttribute?.('aria-hidden');
    button.tabIndex = 0;
    const styles = {
        all: 'initial', display: 'inline-flex', 'align-items': 'center', 'justify-content': 'center', position: 'relative',
        'z-index': '2147483001', flex: '0 0 auto', width: 'auto', 'min-width': '0', height: 'auto',
        'min-height': '20px', 'max-width': 'none', 'max-height': 'none', margin: '0', padding: '1px 3px', border: '0',
        'border-radius': '5px', background: 'transparent', color: 'inherit', font: 'inherit', 'font-size': '14px',
        'line-height': '1', 'text-indent': '0', 'letter-spacing': 'normal', 'white-space': 'nowrap', overflow: 'visible',
        visibility: 'visible', opacity: '.94', 'pointer-events': 'auto', cursor: 'pointer', transform: 'none', filter: 'none',
        clip: 'auto', 'clip-path': 'none', 'box-shadow': 'none', appearance: 'none', '-webkit-appearance': 'none',
        'touch-action': 'manipulation', '-webkit-tap-highlight-color': 'transparent',
    };
    let changed = false;
    for (const [property, value] of Object.entries(styles)) changed = setImportantStyle(button, property, value) || changed;
    return changed;
}

// A list-item/block summary may not establish a formatting context in a host
// theme or older WebKit. Its floated tools then narrow the following overflow:auto
// body. Contain our own float, rather than mistaking that right margin for authored
// card width. Use an owned empty span so authored ::before/::after stay untouched.

export function containRabbitMirrorTitleToolFloat(summary) {
    if (!summary?.isConnected || typeof getComputedStyle !== 'function') return;
    const attr = 'data-rabbit-mirror-title-flow-end';
    let end = summary.querySelector(`:scope > [${attr}]`);
    const display = getComputedStyle(summary).display;
    const flow = ['block','list-item','flow-root','flow-root list-item','inline','inline-block'].includes(display);
    if (!flow && !end) return;
    if (!end) {
        end = summary.ownerDocument.createElement('span');
        end.setAttribute(attr, 'true');
        end.setAttribute('aria-hidden', 'true');
    }
    if (summary.lastElementChild !== end) summary.appendChild(end);
    const styles = { display:flow?'block':'none', position:'static', float:'none', clear:'both', width:'0', height:'0',
        'min-width':'0', 'max-width':'0', 'min-height':'0', 'max-height':'0', margin:'0', padding:'0',
        border:'0', 'line-height':'0', 'font-size':'0', 'pointer-events':'none', visibility:'hidden' };
    for (const [property,value] of Object.entries(styles)) setImportantStyle(end, property, value);
}


function ensureRabbitMirrorToolHost(summary) {
    if (!summary?.querySelectorAll) return null;
    ensureFeedbackCatRuntimeStyle();
    const hosts = [...summary.querySelectorAll(`:scope > [${TOOL_ENTRY_HOST_ATTR}]`)];
    let host = hosts.find(item => item.getAttribute(RUNTIME_VERSION_ATTR) === RUNTIME_VERSION) || hosts[0] || null;
    hosts.filter(item => item !== host).forEach(item => item.remove());
    if (!host) {
        host = document.createElement('span');
        summary.appendChild(host);
    }
    normalizeRabbitMirrorToolHost(host);
    containRabbitMirrorTitleToolFloat(summary);
    return host;
}


export function rabbitMirrorToolRootFromButton(button) {
    if (!button?.closest) return null;
    const toto = button.closest(MIRROR_TOTO_SELECTOR);
    if (toto && isInsideChatMessage(toto)) return toto;
    const details = button.closest('details');
    if (details && isRabbitMirrorDetails(details) && isInsideChatMessage(details)) return details;
    return null;
}


function ensureMaintenanceRabbitButton(root, summary, host) {
    const existing = [...summary.querySelectorAll?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || []];
    let current = existing.find(button => button.getAttribute(RUNTIME_VERSION_ATTR) === RUNTIME_VERSION) || existing[0] || null;
    existing.filter(button => button !== current).forEach(button => button.remove());
    if (!current) {
        current = document.createElement('button');
        current.type = 'button';
        current.className = 'rabbit-mirror-maintenance-rabbit';
        current.setAttribute(MAINTENANCE_RABBIT_ATTR, 'true');
        current.setAttribute(MAINTENANCE_STATE_ATTR, MAINTENANCE_STATES.idle);
    }
    current.type = 'button';
    current.className = 'rabbit-mirror-maintenance-rabbit';
    current.setAttribute(MAINTENANCE_RABBIT_ATTR, 'true');
    current.setAttribute(RUNTIME_VERSION_ATTR, RUNTIME_VERSION);
    if (current.parentElement !== host) host.appendChild(current);
    const externalState = rabbitMirrorExternalGenerationState(root);
    if (externalState === 'loading') {
        setMaintenanceRabbitState(current, MAINTENANCE_STATES.checking, '兔子镜正在生成中');
        current.setAttribute('data-rabbit-mirror-external-waiting', 'true');
    } else if (externalState === 'error') {
        setMaintenanceRabbitState(current, MAINTENANCE_STATES.unknown, '独立 API 生成失败；失败原因已显示在兔子镜内');
        current.removeAttribute('data-rabbit-mirror-external-waiting');
    } else {
        const wasWaiting = current.hasAttribute('data-rabbit-mirror-external-waiting');
        current.removeAttribute('data-rabbit-mirror-external-waiting');
        const languageBalance = rabbitMirrorLanguageBalance(root);
        const state = current.getAttribute(MAINTENANCE_STATE_ATTR) || MAINTENANCE_STATES.idle;
        const reason = current.getAttribute(MAINTENANCE_REASON_ATTR) || '';
        const preserveTechnicalState = state === MAINTENANCE_STATES.repairable
            || state === MAINTENANCE_STATES.unknown
            || state === MAINTENANCE_STATES.checking;
        if (languageBalance.foreignDominant && !preserveTechnicalState) {
            setMaintenanceRabbitState(current, MAINTENANCE_STATES.notice, `${languageBalance.reason}；少量英文术语仍允许`);
        } else if (wasWaiting) {
            setMaintenanceRabbitState(current, MAINTENANCE_STATES.idle, '兔子镜生成完成，可点击巡逻');
        } else if (state === MAINTENANCE_STATES.notice && !languageBalance.foreignDominant) {
            setMaintenanceRabbitState(current, MAINTENANCE_STATES.idle, '语言比例已恢复为混合或中文主导，可点击巡逻');
        } else {
            setMaintenanceRabbitState(current, state, reason);
        }
    }
    return current;
}


function stampFeedbackCatIndependentOwner(button, owner) {
    if (!button) return;
    const attributes = {
        rmFeedbackOwnerSource: owner ? 'independent' : '',
        rmFeedbackOwnerChat: String(owner?.chat || ''),
        rmFeedbackOwnerMesid: Number.isInteger(owner?.mesid) && owner.mesid >= 0 ? String(owner.mesid) : '',
        rmFeedbackOwnerSwipe: Number.isInteger(owner?.swipe) && owner.swipe >= 0 ? String(owner.swipe) : '',
        rmFeedbackOwnerKey: String(owner?.key || ''),
        rmFeedbackOwnerSourceHash: String(owner?.sourceHash || ''),
    };
    for (const [name, value] of Object.entries(attributes)) {
        if (value) button.dataset[name] = value;
        else delete button.dataset[name];
    }
}


function ensureFeedbackCatButton(root, summary, host) {
    const existing = [...summary.querySelectorAll?.(`[${FEEDBACK_CAT_ATTR}]`) || []];
    let current = existing.find(button => button.getAttribute(RUNTIME_VERSION_ATTR) === RUNTIME_VERSION) || existing[0] || null;
    existing.filter(button => button !== current).forEach(button => button.remove());
    if (!current) current = document.createElement('button');
    current.type = 'button';
    current.className = 'rabbit-mirror-feedback-cat';
    current.setAttribute(FEEDBACK_CAT_ATTR, 'true');
    current.setAttribute(RUNTIME_VERSION_ATTR, RUNTIME_VERSION);
    current.textContent = '🐈';
    const externalState = rabbitMirrorExternalGenerationState(root);
    current.title = externalState === 'loading'
        ? '挨打猫：兔子镜正在生成中，生成完成后可反馈'
        : feedbackCatButtonTitle();
    current.setAttribute('aria-label', current.title);
    if (externalState === 'loading') current.setAttribute('data-rabbit-mirror-external-waiting', 'true');
    else current.removeAttribute('data-rabbit-mirror-external-waiting');
    if (current.parentElement !== host) host.appendChild(current);
    // Keep a second copy of the independent owner identity directly on the cat
    // button. Some themes move/clone the tool host after it was installed; the
    // button metadata survives that move and lets “重说/历史” resolve the exact
    // chat + message + Swipe even when the external shell is no longer an ancestor.
    stampFeedbackCatIndependentOwner(current, feedbackCatIndependentOwner(root));
    normalizeRabbitMirrorToolButton(current);
    return current;
}



function recipeButtonShouldBeVisible(recipe, blacklistState = getBlacklistState()) {
    // Visibility is a user setting; missing face receipts must not hide management.
    // Recipe resolution itself remains owner-checked in blacklist.js.
    return blacklistState?.enabled === true;
}


function mirrorTitleDisplayParts(texts) {
    const chars = texts.flatMap((node, part) => Array.from(node.data, char => ({ char, part })));
    const trim = () => {
        while (chars.length && /\s/u.test(chars[0].char)) chars.shift();
        while (chars.length && /\s/u.test(chars[chars.length - 1].char)) chars.pop();
    };
    const pairs = { '【': '】', '[': ']', '［': '］' };
    for (let pass = 0; pass < 8 && chars.length; pass += 1) {
        trim();
        if (!chars.length) break;
        if (pairs[chars[0].char] === chars[chars.length - 1].char) {
            chars.shift(); chars.pop();
            continue;
        }
        const text = chars.map(item => item.char).join('');
        const brand = text.match(/^([\p{P}\p{S}\u200d\ufe0f\s]*?)(?:兔子[镜鏡]|Rabbit\s*Mirror)\s*[:：]\s*/iu);
        if (!brand) break;
        const decorationLength = Array.from(brand[1]).length;
        chars.splice(decorationLength, Array.from(brand[0]).length - decorationLength);
    }
    trim();
    if (!chars.length) return null;
    const display = texts.map(() => '');
    for (const { char, part } of chars) display[part] += char === '•' ? '·' : char;
    display[chars[0].part] = `【兔子镜：${display[chars[0].part]}`;
    display[chars[chars.length - 1].part] += '】';
    return display;
}


function ensureMirrorTitleDisplay(summary) {
    if (!summary?.childNodes || summary.childNodes.length > 256) return;
    const skip = `[${TOOL_ENTRY_HOST_ATTR}], [${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${MIRROR_TITLE_PREFIX_ATTR}], button, input, select, textarea, a, label, svg, style, script, template, noscript, [contenteditable], [role="button"], [role="link"], [data-rm-face-swipe-bar], [data-rm-face-favorite-star]`;
    const texts = [];
    const stack = [...summary.childNodes].reverse();
    let visited = 0, length = 0;
    while (stack.length) {
        const node = stack.pop();
        if (++visited > 256) return;
        if (node.nodeType === 3) {
            length += node.data.length;
            if (length > 2048 || texts.length >= 64) return;
            texts.push(node);
        } else if (node.nodeType === 1 && !node.matches(skip)) {
            if (node.hidden || node.getAttribute('aria-hidden') === 'true') continue;
            if (visited + stack.length + node.childNodes.length > 256) return;
            stack.push(...[...node.childNodes].reverse());
        }
    }
    const display = mirrorTitleDisplayParts(texts);
    if (!display) return;
    const raw = texts.map(node => node.data).join('');
    const alreadyFormatted = display.join('') === raw;
    summary.querySelectorAll(`:scope > span[${MIRROR_TITLE_PREFIX_ATTR}]`).forEach(node => {
        if (!node.textContent) node.remove();
    });
    let styleReady = false;
    texts.forEach((node, index) => {
        const source = node.parentElement;
        let part = source?.hasAttribute(MIRROR_TITLE_SOURCE_ATTR)
            && source.parentElement?.hasAttribute(MIRROR_TITLE_PART_ATTR) ? source.parentElement : null;
        if (alreadyFormatted || display[index] === node.data) {
            if (part) part.replaceWith(node);
            return;
        }
        // Keep original Text nodes/receipts and rich-title parents; repair/retry reads raw textContent.
        if (!part) {
            if (!styleReady) { ensureFeedbackCatRuntimeStyle(); styleReady = true; }
            part = summary.ownerDocument.createElement('span');
            part.setAttribute(MIRROR_TITLE_PART_ATTR, 'true');
            const original = summary.ownerDocument.createElement('span');
            original.setAttribute(MIRROR_TITLE_SOURCE_ATTR, 'true');
            node.replaceWith(part);
            original.appendChild(node);
            part.appendChild(original);
        }
        if (part.getAttribute(MIRROR_TITLE_DISPLAY_ATTR) !== display[index]) {
            part.setAttribute(MIRROR_TITLE_DISPLAY_ATTR, display[index]);
        }
    });
}


function installExternalReferenceNote(details, recipe) {
    const settings = getSettings();
    syncExternalReferenceVisibility(settings);
    const existing = [...details.querySelectorAll(`:scope > [${EXTERNAL_REFERENCE_NOTE_ATTR}]`)];
    if (settings.externalWorldBookRandomEnabled !== true || !recipe?.hasExternalReferences) {
        existing.forEach(node => node.remove());
        return;
    }
    const sources = (Array.isArray(recipe.externalSources) ? recipe.externalSources : [])
        .filter(name => typeof name === 'string').slice(0, 24)
        .map(name => name.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 200)).filter(Boolean);
    const text = sources.length ? `本轮抽取来源：${[...new Set(sources)].join('、')}` : '本轮抽取来源：旧记录未保存世界书名称';
    const note = existing[0] || document.createElement('small');
    existing.slice(1).forEach(node => node.remove());
    if (note.getAttribute(EXTERNAL_REFERENCE_NOTE_ATTR) !== 'true') note.setAttribute(EXTERNAL_REFERENCE_NOTE_ATTR, 'true');
    // Names are plain text, not links, markup, attribution inferred from the title,
    // or content to send to the model. This runs on the existing scoped mount event.
    if (note.textContent !== text) note.textContent = text;
    if (note.parentElement !== details || note !== details.lastElementChild) details.appendChild(note);
}


function removeRecipeButtonsFromSummary(summary) {
    if (!summary?.querySelectorAll) return 0;
    const existing = [...summary.querySelectorAll(`[${RECIPE_BUTTON_ATTR}]`)];
    existing.forEach(button => button.remove());
    if (existing.length) closeRecipeMenu();
    for (const host of summary.querySelectorAll(`:scope > [${TOOL_ENTRY_HOST_ATTR}]`)) {
        if (!host.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}]`)) host.remove();
    }
    return existing.length;
}


function ensureRecipeButton(root, summary, host, recipe = rabbitMirrorRecipeForRoot(root)) {
    const existing = [...summary.querySelectorAll?.(`[${RECIPE_BUTTON_ATTR}]`) || []];
    let current = existing.find(button => button.getAttribute(RUNTIME_VERSION_ATTR) === RUNTIME_VERSION) || existing[0] || null;
    existing.filter(button => button !== current).forEach(button => button.remove());
    if (!current) current = document.createElement('button');
    current.type = 'button';
    current.className = 'rabbit-mirror-recipe-button';
    current.setAttribute(RECIPE_BUTTON_ATTR, 'true');
    current.setAttribute(RUNTIME_VERSION_ATTR, RUNTIME_VERSION);
    current.textContent = '🎲';
    current.title = recipeButtonTitle(recipe);
    current.setAttribute('aria-label', current.title);
    current.dataset.rmRecipeAvailable = recipe ? 'true' : 'false';
    if (current.parentElement !== host) host.appendChild(current);
    normalizeRabbitMirrorToolButton(current);
    return current;
}


function installRecipeButtonForRoot(root) {
    if (!isCurrentRuntime() || !root?.querySelector) return false;
    const details = root.matches?.('details') ? root : root.querySelector(':scope > details') || root.querySelector('details');
    const summary = details?.querySelector?.(':scope > summary') || details?.querySelector?.('summary');
    if (!summary) return false;
    ensureMirrorTitleDisplay(summary);
    const recipe = rabbitMirrorRecipeForRoot(root, true);
    installExternalReferenceNote(details, recipe);
    if (!recipeButtonShouldBeVisible(recipe, getBlacklistState())) {
        removeRecipeButtonsFromSummary(summary);
        return true;
    }
    const host = ensureRabbitMirrorToolHost(summary);
    if (!host) return false;
    ensureRecipeButton(root, summary, host, recipe);
    return true;
}


export function installMaintenanceRabbitForRoot(root) {
    if (!isCurrentRuntime() || !root?.querySelector) return false;
    clearOrphanedStructuredStaticDisclosureArtifacts(root);
    const details = root.matches?.('details') ? root : root.querySelector(':scope > details') || root.querySelector('details');
    const summary = details?.querySelector?.(':scope > summary') || details?.querySelector?.('summary');
    if (!summary) return false;
    const host = ensureRabbitMirrorToolHost(summary);
    if (!host) return false;
    ensureMaintenanceRabbitButton(root, summary, host);
    return true;
}


function installFeedbackCatForRoot(root) {
    if (!isCurrentRuntime() || !root?.querySelector) return false;
    const details = root.matches?.('details') ? root : root.querySelector(':scope > details') || root.querySelector('details');
    const summary = details?.querySelector?.(':scope > summary') || details?.querySelector?.('summary');
    if (!summary) return false;
    const host = ensureRabbitMirrorToolHost(summary);
    if (!host) return false;
    ensureFeedbackCatButton(root, summary, host);
    return true;
}


function removeEmptyRabbitMirrorToolHosts(chatRoot = getChatRoot()) {
    chatRoot?.querySelectorAll?.(`[${TOOL_ENTRY_HOST_ATTR}]`)?.forEach(host => {
        if (!host.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}]`)) host.remove();
    });
}


export function removeMaintenanceRabbitsInChatDom() {
    const chatRoot = getChatRoot();
    chatRoot?.querySelectorAll?.(`[${MAINTENANCE_RABBIT_ATTR}]`)?.forEach(button => button.remove());
    removeEmptyRabbitMirrorToolHosts(chatRoot);
}


export function removeFeedbackCatsInChatDom() {
    const chatRoot = getChatRoot();
    chatRoot?.querySelectorAll?.(`[${FEEDBACK_CAT_ATTR}]`)?.forEach(button => button.remove());
    removeEmptyRabbitMirrorToolHosts(chatRoot);
    closeFeedbackCatMenu();
}



function beginHostWorkTiming(name){
 let end;
 try{ end=globalThis.__rabbitMirrorExternalDiag?.beginHostWork?.(name); }catch{}
 if(typeof end!=='function') return null;
 return ()=>{ try{ end(); }catch{} };
}

function loadMirrorImageModule() {
    if (!mirrorImageModule) mirrorImageModule = import('../imageUi.js?rmv=1.5.53-hostuifix1').catch(error => { mirrorImageModule = null; throw error; });
    return mirrorImageModule;
}

function canRestoreIndependentSwipeInitial(root) {
    try { return !!globalThis.__rabbitMirrorIndependentActionsV1?.hasSwipeInitial?.(root); }
    catch { return false; }
}

function independentActionBridge() {
    return globalThis.__rabbitMirrorIndependentActionsV1;
}

function stopTitleToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
}

function paintFavoriteStar(button, on) {
    if (!button) return;
    button.classList.toggle('is-favorited', !!on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    button.title = on ? '取消收藏本面' : '收藏本面';
    button.setAttribute('aria-label', button.title);
    button.innerHTML = on
        ? '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3.6 14.5 9l6 .5-4.6 4 1.4 5.9L12 16.8 6.7 19.4 8.1 13.5 3.5 9.5 9.5 9z"/></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M12 4.2 14.2 9l5.3.4-4.1 3.5 1.3 5.2L12 15.7 7.3 18.1 8.6 12.9 4.5 9.4 9.8 9z"/></svg>';
}

function installFavoriteStar(root, host, before) {
    let star = host.querySelector(':scope > [data-rm-face-favorite-star]');
    if (!star) {
        star = document.createElement('button');
        star.type = 'button';
        star.setAttribute('data-rm-face-favorite-star', 'true');
        star.className = 'rabbit-mirror-face-favorite-star';
        star.addEventListener('click', event => {
            stopTitleToggle(event);
            const captured = captureTheaterFavoriteFromRoot(root);
            if (!captured) {
                globalThis.toastr?.warning?.('当前没有可收藏的兔子镜。');
                return;
            }
            void toggleTheaterFavorite(captured).then(result => {
                paintFavoriteStar(star, result.favorited);
                globalThis.toastr?.success?.(result.favorited ? '已收入兔子镜收藏夹。' : '已取消收藏。');
            }).catch(error => globalThis.toastr?.warning?.(String(error?.message || '收藏失败。')));
        }, true);
    }
    if (before?.parentElement === host) host.insertBefore(star, before);
    else host.append(star);
    const captured = captureTheaterFavoriteFromRoot(root);
    paintFavoriteStar(star, false);
    if (captured?.html) void isTheaterFavoriteHtml(captured.html).then(on => { if (star.isConnected) paintFavoriteStar(star, on); }).catch(() => {});
    return star;
}

function installFaceSwipeBar(root, host, before) {
    const bridge = independentActionBridge();
    const view = bridge?.runtime === RUNTIME_VERSION ? bridge.swipeView?.(root) : null;
    let bar = host.querySelector(':scope > [data-rm-face-swipe-bar]');
    if (!view) {
        bar?.remove();
        return;
    }
    if (!bar) {
        bar = document.createElement('span');
        bar.setAttribute('data-rm-face-swipe-bar', 'true');
        bar.className = 'rabbit-mirror-face-swipe-bar';
        bar.innerHTML = '<button type="button" data-rm-face-swipe="prev" aria-label="上一版">‹</button><span data-rm-face-swipe-label></span><button type="button" data-rm-face-swipe="next" aria-label="下一版">›</button><button type="button" data-rm-face-swipe="delete" aria-label="删除这一版">×</button>';
        bar.addEventListener('click', event => {
            const action = event.target?.closest?.('[data-rm-face-swipe]')?.getAttribute('data-rm-face-swipe');
            if (!action) return;
            stopTitleToggle(event);
            const live = independentActionBridge();
            const current = live?.swipeView?.(root);
            if (!current) return;
            if (action === 'prev') {
                const target = current.overlay ? current.currentIndex : current.currentIndex - 1;
                if (target < 0) return;
                live.selectSwipe?.(root, target);
                return;
            }
            if (action === 'next') {
                if (!current.canNext) return;
                live.selectSwipe?.(root, current.currentIndex + 1);
                return;
            }
            if (action === 'delete') live.deleteSwipe?.(root);
        }, true);
    }
    if (before?.parentElement === host) host.insertBefore(bar, before);
    else host.append(bar);
    const label = bar.querySelector('[data-rm-face-swipe-label]');
    if (label) label.textContent = view.label;
    const prev = bar.querySelector('[data-rm-face-swipe="prev"]');
    const next = bar.querySelector('[data-rm-face-swipe="next"]');
    const remove = bar.querySelector('[data-rm-face-swipe="delete"]');
    if (prev) prev.disabled = !view.canPrev;
    if (next) next.disabled = !view.canNext;
    if (remove) {
        remove.disabled = !view.canDelete;
        remove.hidden = view.count < 1;
        remove.title = view.canDelete ? '删除当前这一版' : (view.overlay ? '失败这一格不会保存，切回上一版即可清掉' : '只剩一版时不能删除');
    }
    bar.title = view.overlay ? '这一版生成失败，可切回上一版' : (view.full ? '已满五版，删一版后才能重说' : '切换这一面的重说版本');
    return bar;
}

function installFaceTitleChrome(root, host) {
    const rabbit = host.querySelector(':scope > [data-rm-tool-menu-button]');
    const star = installFavoriteStar(root, host, rabbit);
    installFaceSwipeBar(root, host, star || rabbit);
}

function installUnifiedMirrorTools(root) {
    const details = root.matches?.('details') ? root : root.querySelector(':scope > details') || root.querySelector('details');
    const summary = details?.querySelector(':scope > summary');
    if (!summary) return;
    const host = ensureRabbitMirrorToolHost(summary);
    const actions = [];
    const add = (attr, enabled, id, label, handler) => {
        const button = host.querySelector(`[${attr}]`);
        if (button && enabled) actions.push({ id, label, run: event => handler(event, root, button) });
        else if (button && !enabled) button.remove();
    };
    add(MAINTENANCE_RABBIT_ATTR, isMaintenanceRabbitEnabled(), 'maintenance', '🐇 维修兔', handleMaintenanceRabbitClick);
    add(FEEDBACK_CAT_ATTR, isFeedbackCatEnabled(), 'feedback', '🐈 挨打猫 · 反馈与重说', handleFeedbackCatClick);
    add(RECIPE_BUTTON_ATTR, true, 'recipe', '🎲 黑名单与本轮抽签', handleRecipeClick);
    actions.push({ id: 'image', label: '▧ 生图', run: (_event, opener) => {
        void loadMirrorImageModule().then(module => { if (root.isConnected) return module.openMirrorImagePanel(root, { opener }); })
            .catch(() => globalThis.toastr?.warning?.('生图面板未能打开，请重新打开后再试。'));
    } });
    actions.push({ id: 'theater-favorite-library', label: '📖 打开收藏夹', run: () => {
        void import('../independentApi.js?rmv=1.5.64').then(module =>
            openTheaterFavoriteLibrary((container, record) => module.hydrateIndependentFavoriteHtml(container, record)))
            .catch(error => globalThis.toastr?.warning?.(String(error?.message || '无法打开收藏夹。')));
    } });
    installMirrorToolMenu(root, host, actions, () => {
        closeMaintenanceRabbitMenu(); closeFeedbackCatMenu(); closeRecipeMenu();
        mirrorImageModule?.then(module => module.closeMirrorImagePanel?.()).catch(() => {});
    });
    installFaceTitleChrome(root, host);
    // Restore saved images even when image generation is disabled; this never requests a model.
    void loadMirrorImageModule().then(module => { if (root.isConnected) return module.mountMirrorImage(root); })
        .catch(() => {});
}

export function installMaintenanceRabbitsInScope(scope, options = {}) {
    const end = beginHostWorkTiming('maintenance.installScope');
    try { return installMaintenanceRabbitsInScopeCore(scope, options); } finally { end?.(); }
}

function installMaintenanceRabbitsInScopeCore(scope, { allowGlobalRemoval = false, autoSafeForceCurrent = false, historyRestoreLight = false } = {}) {
    if (!isCurrentRuntime() || !scope?.querySelectorAll) return;
    const perfEnd = globalThis.__rabbitMirrorPerfDiag?.begin?.('maintenance.installScope', { allowGlobalRemoval: !!allowGlobalRemoval, historyRestoreLight: !!historyRestoreLight }, 8);
    const maintenanceEnabled = isMaintenanceRabbitEnabled();
    const feedbackEnabled = isFeedbackCatEnabled();
    if (allowGlobalRemoval && !maintenanceEnabled) removeMaintenanceRabbitsInChatDom();
    if (allowGlobalRemoval && !feedbackEnabled) removeFeedbackCatsInChatDom();

    getRenderedRabbitMirrorInteractionRoots(scope).forEach(root => {
        if (!isInsideChatMessage(root)) return;
        armRabbitMirrorFirstUseInteraction(root);
        bindRevealedInteractionMemory(root);
        // Migrate cached/serialized mirrors created by the short-lived inline reset
        // control. Recovery snapshots stay intact and remain reachable from Maintenance Rabbit.
        removeRabbitMirrorInteractionHomeControls(root);
        // If SillyTavern replaced a follow-mode mirror after a successful manual repair,
        // replay only that recorded recipe on the new live root. This is bounded and does
        // not touch chat source, sibling mirrors, cache, or the independent-API path.
        replayFollowMaintenanceRepair(root);
        try {
            clearLegacyRabbitMirrorAutoFrameArtifacts(root);
        } catch (error) {
            console.debug('[RabbitMirror] legacy frame palette cleanup skipped for one mirror:', error);
        }
        try {
            // 1.3.93: CHAT_CHANGED/full-chat refresh only rehydrates cheap listeners and
            // persisted repair markers. Fresh/scoped message installs keep the immediate
            // candidate pass so newly rendered mirrors behave exactly as before.
            armNestedDetailsReplacementContainment(root);
            if (!allowGlobalRemoval && !historyRestoreLight) installNestedDetailsReplacementContainment(root);
        } catch (error) {
            console.debug('[RabbitMirror] nested details containment skipped for one mirror:', error);
        }
        if (maintenanceEnabled) {
            try {
                installMaintenanceRabbitForRoot(root);
                const maintenanceButton = root.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`);
                // Installing the tool remains read-only unless the user explicitly enabled
                // experimental auto patrol and this is the current host-rendered message.
                if (autoSafeForceCurrent && maintenanceButton) {
                    scheduleMaintenanceAutoSafeForRoot(root, maintenanceButton, { forceCurrent: true, delay: 720 });
                }
            } catch (error) {
                console.debug('[RabbitMirror] maintenance rabbit install recovered for one mirror:', error);
            }
        }
        if (maintenanceEnabled) {
            try {
                // 1.3.94: full-chat history restoration only binds this lightweight toggle listener.
                // It performs no inspection until the user actually opens this one mirror.
                installMaintenanceAutoSafeOpenPatrol(root);
            } catch (error) {
                console.debug('[RabbitMirror] auto-safe open-patrol binding skipped for one mirror:', error);
            }
        }
        if (maintenanceEnabled) {
            // 1.3.92: 这里只安装一个轻量 toggle 入口，不在全聊天工具刷新时读取布局。
            // 真正的横向裁切检查只会在当前镜面已展开并完成一帧绘制后运行。
            try {
                installMaintenanceHorizontalClipOpenRescue(root);
            } catch (error) {
                console.debug('[RabbitMirror] horizontal clip open-rescue binding skipped for one mirror:', error);
            }
        }
        if (feedbackEnabled) {
            try {
                installFeedbackCatForRoot(root);
            } catch (error) {
                console.debug('[RabbitMirror] feedback cat install recovered for one mirror:', error);
            }
        }
        try {
            installRecipeButtonForRoot(root);
        } catch (error) {
            console.debug('[RabbitMirror] recipe button install recovered for one mirror:', error);
        }
        if (typeof installUnifiedMirrorTools === 'function') installUnifiedMirrorTools(root);
        if (!historyRestoreLight) scheduleCurrentHighConfidenceTextRepair(root);
    });
    if (feedbackEnabled) updateFeedbackCatButtonTitles(scope);
    perfEnd?.();
}


function installMaintenanceRabbitsInChatDom() {
    const chatRoot = getChatRoot();
    if (!chatRoot) return;
    pruneMaintenanceAutoSafeOpenBindings();
    installMaintenanceRabbitsInScope(chatRoot, {
        allowGlobalRemoval: true,
    });
}


export function cancelStartupMaintenanceHistoryInstall() {
    if (startupMaintenanceInstallTimer) clearTimeout(startupMaintenanceInstallTimer);
    startupMaintenanceInstallTimer = 0;
    startupMaintenanceInstallQueue = [];
    try { startupMaintenanceVisibilityObserver?.disconnect?.(); } catch {}
    startupMaintenanceVisibilityObserver = null;
    if (startupMaintenanceFallbackRoot && startupMaintenanceFallbackHandler) {
        try { startupMaintenanceFallbackRoot.removeEventListener('scroll', startupMaintenanceFallbackHandler, false); } catch {}
        try { startupMaintenanceFallbackRoot.removeEventListener('pointerdown', startupMaintenanceFallbackHandler, true); } catch {}
        try { startupMaintenanceFallbackRoot.removeEventListener('focusin', startupMaintenanceFallbackHandler, true); } catch {}
    }
    startupMaintenanceFallbackRoot = null;
    startupMaintenanceFallbackHandler = null;
}


export function installMaintenanceRabbitsDeferredInChatDom() {
    const chatRoot = getChatRoot();
    if (!chatRoot) return;
    cancelStartupMaintenanceHistoryInstall();
    if (isRabbitMirrorManagedChatSurface()) { installManagedRabbitMirrorTools(); return; }
    pruneMaintenanceAutoSafeOpenBindings();
    // These events discover not-yet-visited history, not a reason to reinstall a
    // live scene. Genuine host replacements are handled by the structural observer.
    // Weak membership follows DOM lifetime and never retains virtualized history.
    const visited = new WeakSet();
    const install = root => {
        if (!root?.isConnected || visited.has(root)) return;
        installMaintenanceRabbitsInScope(root, {
            historyRestoreLight: true,
        });
        visited.add(root);
    };
    const recent = [];
    for (let node = chatRoot.lastElementChild; node && recent.length < 6; node = node.previousElementSibling) {
        if (node.matches?.('.mes[mesid], [mesid].mes')) recent.push(node);
    }
    globalThis.__rabbitMirrorPerfDiag?.mark?.('maintenance.startupDeferred', { bounded: true, immediate: recent.length });
    for (const root of recent.reverse()) install(root);

    let queued = false;
    const probe = event => {
        const direct = event?.target?.closest?.('.mes[mesid], [mesid].mes');
        if (direct && chatRoot.contains?.(direct)) { install(direct); return; }
        if (queued) return;
        queued = true;
        startupMaintenanceInstallTimer = setTimeout(() => {
            startupMaintenanceInstallTimer = 0; queued = false;
            if (!isCurrentRuntime()) return;
            const box = chatRoot.getBoundingClientRect?.();
            if (!box || typeof document.elementsFromPoint !== 'function') return;
            const x = Math.max(box.left + 1, Math.min(box.right - 1, box.left + box.width / 2));
            const roots = new Set();
            for (const y of [box.top + 8, box.top + box.height / 2, box.bottom - 8]) {
                for (const element of document.elementsFromPoint(x, y) || []) {
                    const root = element?.closest?.('.mes[mesid], [mesid].mes');
                    if (root && chatRoot.contains?.(root)) roots.add(root);
                    if (roots.size >= 6) break;
                }
                if (roots.size >= 6) break;
            }
            for (const root of roots) install(root);
        }, 80);
    };
    startupMaintenanceFallbackRoot = chatRoot; startupMaintenanceFallbackHandler = probe;
    chatRoot.addEventListener('scroll', probe, { passive: true });
    chatRoot.addEventListener('pointerdown', probe, true); chatRoot.addEventListener('focusin', probe, true);
    probe();
}


export function refreshMaintenanceRabbits() {
    installMaintenanceRabbitsInChatDom();
}


export function refreshFeedbackCats() {
    installMaintenanceRabbitsInChatDom();
}


export function refreshRecipeButtons() {
    installMaintenanceRabbitsInChatDom();
}



export function refreshRabbitMirrorToolsInScope(scope, { historyRestoreLight = false } = {}) {
    if (!scope?.querySelectorAll) return;
    repairRabbitMirrorScopedClassAliasesInScope(scope);
    // 1.4.30.17: preserve the 1.3.57/1.3.93/1.3.94 history invariant. A full-chat
    // restore may reattach old collapsed mirrors, but it must not run the newer
    // computed-style mobile-row migration or immediate auto-safe/nested candidate
    // passes for every historical mirror. Those remain fresh/scoped-message work
    // and the existing first-open patrol will handle the one mirror the user opens.
    if (!historyRestoreLight) repairLegacyMaintenanceMobileStateRows(scope);
    installMaintenanceRabbitsInScope(scope, { historyRestoreLight });
}




