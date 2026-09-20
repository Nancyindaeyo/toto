// Split from outputSanitizer.js — diagnostics.

import { cloneRabbitMirrorFilteredNode } from '../bannedWords.js?rmv=1.5.53-cn-boundary1';
import { collectRevealedClipHosts, shouldRelaxRevealedClipPanel, REVEALED_CLIP_RESCUE_ATTR } from '../revealedClipRepair.js?rmv=1.5.58-fork1';
import { auditVisibleLanguageBalanceText } from '../feedbackCat.js?rmv=1.5.53-cn-boundary1';
import {
    EXTERNAL_REFERENCE_NOTE_ATTR,
    FEEDBACK_CAT_ATTR,
    INTERACTION_HOME_ATTR,
    MAINTENANCE_RABBIT_ATTR,
    MIRROR_TOTO_SELECTOR,
    RAW_SELF_MUTATION_ACTIVE_ATTR,
    RECIPE_BUTTON_ATTR,
    RUNTIME_VERSION,
    TOOL_ENTRY_HOST_ATTR,
    escapeCssIdentifier,
    escapeRegExp,
    getChatRoot,
    getRenderedRabbitMirrorInteractionRoots,
    isCurrentRuntime,
    isInsideChatMessage,
    isMaintenanceRabbitEnabled,
    isRabbitMirrorDetails,
} from './runtime.js?rmv=1.5.70';
import {
    CHANGE_PSEUDO_RESCUE_ATTR,
    CHANNEL_DIAL_CYCLE_COUNT_ATTR,
    CHECKED_HAS_STATE_RULE_COUNT_ATTR,
    CHECKED_TEXT_RULE_RESCUE_ATTR,
    CROSS_PARENT_CHECKED_ROOT_ATTR,
    DECORATIVE_OVERLAY_PASS_THROUGH_ATTR,
    DETACHED_CHECKED_HAS_CONTROL_ATTR,
    DETACHED_CHECKED_HAS_RULE_COUNT_ATTR,
    DIRECT_ID_CLASS_STATE_RESCUE_ATTR,
    EXCLUSIVE_STACKED_STATE_COUNT_ATTR,
    EXPANDED_OPACITY_RESCUE_ATTR,
    FOCUS_TO_CHECKED_ROOT_ATTR,
    FOCUS_WITHIN_PERSISTENT_CONTROL_ATTR,
    FOCUS_WITHIN_PERSISTENT_ROOT_ATTR,
    LABELED_CHECKED_VERIFY_CONTROL_ATTR,
    LABELED_CHECKED_VERIFY_LAST_ATTR,
    LABELED_CHECKED_VERIFY_ROOT_ATTR,
    MARKDOWN_CSS_COMMENT_RESCUE_ATTR,
    MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR,
    MOBILE_INLINE_ANNOTATION_COUNT_ATTR,
    NESTED_CHECKED_CONTENT_RESCUE_ATTR,
    NESTED_DETAILS_POPUP_COUNT_ATTR,
    NESTED_LABEL_STRUCTURE_RESCUE_ATTR,
    PAIRED_CHECKED_STATE_COUNT_ATTR,
    PASSPORT_DOCUMENT_RESCUE_ATTR,
    RAW_SCRIPT_TIMELINE_ROOT_ATTR,
    REVERSIBLE_CHECKED_RESULT_ROOT_ATTR,
    UNLABELED_CHECKED_CONTROL_RESCUE_ATTR,
    WEBKIT_3D_FLIP_RESCUE_ATTR,
    passportDocumentRescueStates,
    unlabeledCheckedHostRescueStates,
} from './checkedStateRescue.js?rmv=1.5.70';
import {
    RENDERED_ADJACENT_HIDDEN_GROUP_RESCUE_ATTR,
    RENDERED_BUTTON_ADJACENT_HIDDEN_ITEM_ATTR,
    RENDERED_CHECKED_ID_TARGET_RESCUE_ATTR,
    RENDERED_CSS_STATE_CROSS_TREE_ROOT_ATTR,
    RENDERED_CSS_STATE_SIBLING_ITEM_ATTR,
    RENDERED_LABEL_ADJACENT_RESULT_RESCUE_ATTR,
    RENDERED_LABEL_INTERNAL_HIDDEN_RESCUE_ATTR,
    RENDERED_STATE_LAYER_RESCUE_ATTR,
    findRenderedButtonAdjacentHiddenTarget,
    getClassTokens,
    getInlineStyleValue,
    getRenderedInputRoute,
    getRenderedStyleSnapshot,
    renderedAdjacentHiddenGroupRescueStates,
    renderedButtonAdjacentHiddenRescueStates,
    renderedCheckedIdTargetRescueStates,
    renderedClickableAdjacentHiddenRescueStates,
    renderedClickableAdjacentPopupRescueStates,
    renderedContainerInternalRevealStates,
    renderedCssStateSiblingRescueStates,
    renderedLabelAdjacentResultRescueStates,
    renderedLabelInternalHiddenRescueStates,
    renderedListDetailRescueStates,
    renderedMaskRevealRescueStates,
    renderedStateLayerRescueStates,
} from './renderedStateRescue.js?rmv=1.5.70';
import {
    RAW_RADIO_RESET_LAST_ATTR,
    RAW_RADIO_RESET_ROOT_ATTR,
    chooseMatchingRawRabbitMirrorRoot,
    getAssistantMessageForRenderedRoot,
    getAvailableHostChat,
    getExternalOwnerMessageIndex,
    getRabbitMirrorSummaryText,
    getRawAssistantMessageForRenderedRoot,
    rawSelfMutationRescueStates,
} from './scriptedInteractionRescue.js?rmv=1.5.70';
import {
    REVERSIBLE_RADIO_LAST_ATTR,
    REVERSIBLE_RADIO_ROOT_ATTR,
    TOUCH_HOVER_ATTR,
    TOUCH_HOVER_READY_ATTR,
    collectWebKit3DFlipEvidence,
    findMobileInlineAnnotationCandidates,
    findNestedDetailsPopupClippingCandidates,
    formatWebKit3DFlipEvidence,
    repairNestedDetailsPopupClipping,
} from './fallbackRescue.js?rmv=1.5.70';
import { RADIO_GROUP_RESCUE_ATTR, RADIO_GROUP_ROOT_ATTR } from './idsAndRearm.js?rmv=1.5.70';
import {
    findFillInChoiceCandidates,
    findStaticChoiceSelectionCandidates,
    findStructuredStaticDisclosureCandidates,
} from './choiceRescue.js?rmv=1.5.70';
import {
    CODE_SHELL_SELECTOR,
    MAINTENANCE_QUARANTINED_SCRIPT_ATTR,
    TEXT_CONTRAST_RESCUE_ROOT_ATTR,
    extractMaintenanceMirrorSourceBySummary,
    extractStrictWholeRabbitMirrorText,
    findCleanMaintenanceMirrorNode,
    findRecoverableMaintenanceMirrorSource,
    findSevereTextContrastCandidates,
    maintenanceCheckedInteractionDepth,
    maintenanceMirrorBodyEvidence,
    maintenancePseudoInteractionDepth,
    maintenanceReachableInteractionEvidence,
    maintenanceRepairRootBudget,
    needsSanitize,
    normalizeMaintenanceSummaryText,
    parseTotoFragment,
} from './maintenanceInspect.js?rmv=1.5.70';
import {
    RABBIT_MIRROR_MAX_TEMPLATE_SOURCE_CHARS,
    RABBIT_MIRROR_SANITIZER_IMPORT_STRIPPED_ATTR,
    RABBIT_MIRROR_SANITIZER_STYLE_DROP_ATTR,
    TOTO_BLOCK_SINGLE_RE,
    cleanRabbitMirrorOutput,
    countRawUiTags,
    decodeHtmlEntities,
    rescueDamagedDataUriRabbitMirrorOutput,
    sanitizeRabbitMirrorUntrustedTemplate,
    stripCssComments,
    validateRabbitMirrorTemplateStructuralBudget,
} from './markup.js?rmv=1.5.70';
import {
    HCLIP_REPORT_ATTR,
    VIEWPORT_LAYOUT_COUNT_ATTR,
    getRabbitMirrorFacePosition,
    inspectMaintenanceMobileLayout,
    inspectMaintenanceViewportLayout,
    maintenanceMobileLayoutIsPassportManaged,
} from './layoutRescue.js?rmv=1.5.70';
import { normalizeRabbitMirrorToolButton, rabbitMirrorTextPresentation } from './toolsChrome.js?rmv=1.5.70';
import {
    getMessageIndexFromMirrorNode,
    hostScriptModule,
    messageUsesDistinctDisplaySource,
    outputHostGenerationLooksActive,
} from './lifecycle.js?rmv=1.5.70';

export const INTERACTION_DIAGNOSTIC_PANEL_ATTR = 'data-rabbit-mirror-interaction-diagnostic';

// 0.33.7: 维修兔 v1.6。把既有代码块、纯文字、源码/SVG、CSS作用域与完整交互急救库接入逐条维修流水线。
// 设计底线：没有高置信证据就不修改；黄灯才允许调用已有修复路线，红灯只生成诊断。

export const MAINTENANCE_STATE_ATTR = 'data-rabbit-mirror-maintenance-state';

export const MAINTENANCE_REASON_ATTR = 'data-rabbit-mirror-maintenance-reason';

export const MAINTENANCE_REPAIR_ATTR = 'data-rabbit-mirror-maintenance-repaired';

export const MAINTENANCE_MENU_ATTR = 'data-rabbit-mirror-maintenance-menu';

export const MAINTENANCE_MIRROR_IDENTITY_ATTR = 'data-rabbit-mirror-maintenance-identity';

export const INDEPENDENT_REPAIR_PERSIST_EVENT = 'rabbitmirror:independent-repair-persist';

const INDEPENDENT_LIVE_REPAIR_ATTR = 'data-rabbit-mirror-maintenance-live-repair';

const INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR = 'data-rabbit-mirror-maintenance-live-repair-until';

export const maintenancePreRepairSnapshots = new Map();

export const rabbitMirrorInteractionResetSnapshots = new Map();

export const rabbitMirrorInteractionResetInstanceIds = new WeakMap();

export const rabbitMirrorFacePositionHints = new WeakMap();

export const MAINTENANCE_AUTO_SAFE_ATTR = 'data-rabbit-mirror-auto-safe-maintenance';

export const MAINTENANCE_AUTO_SAFE_RESULT_ATTR = 'data-rabbit-mirror-auto-safe-result';

export const MAINTENANCE_AUTO_SAFE_VERSION = 'safe-v3-live-patrol';

export const RESAY_ATTR = 'data-rabbit-mirror-resay';

export const FEEDBACK_CAT_MENU_ATTR = 'data-rabbit-mirror-feedback-cat-menu';

export const RECIPE_MENU_ATTR = 'data-rabbit-mirror-recipe-menu';

export const FEEDBACK_RESAY_EVENT = 'rabbitmirror:resay';

export const FEEDBACK_HISTORY_EVENT = 'rabbitmirror:history';

export const SELECTION_ONLY_FALLBACK_ATTR = 'data-rabbit-mirror-selection-only-fallback';

export const SELECTION_ONLY_PLACEHOLDER_ATTR = 'data-rabbit-mirror-selection-only-placeholder';

export const SELECTION_ONLY_SOURCE_ATTR = 'data-rabbit-mirror-selection-only-source';

export const DISABLED_ONLY_CHOICE_RESCUE_ATTR = 'data-rabbit-mirror-disabled-choice-rescue';

export const DISABLED_ONLY_CHOICE_CONTROL_ATTR = 'data-rm-disabled-choice-control';

export const INERT_ACTION_BUTTON_RESCUE_ATTR = 'data-rabbit-mirror-inert-action-rescue';

export const INERT_ACTION_STATUS_ATTR = 'data-rabbit-mirror-inert-action-status';

export const STATIC_CHOICE_SELECTION_RESCUE_ATTR = 'data-rabbit-mirror-static-choice-selection-rescue';

export const STATIC_CHOICE_SELECTION_ITEM_ATTR = 'data-rm-static-choice-item';

export const STATIC_CHOICE_SELECTION_SELECTED_ATTR = 'data-rm-static-choice-selected';

export const STATIC_CHOICE_SELECTION_COUNT_ATTR = 'data-rabbit-mirror-static-choice-selection-count';

export const STATIC_CHOICE_SELECTION_STYLE_ATTR = 'data-rabbit-mirror-static-choice-selection-style';

export const staticChoiceSelectionRescueStates = new WeakMap();

export const STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR = 'data-rabbit-mirror-structured-static-disclosure';

export const STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR = 'data-rm-structured-static-disclosure-trigger';

export const STRUCTURED_STATIC_DISCLOSURE_BODY_ATTR = 'data-rm-structured-static-disclosure-body';

export const STRUCTURED_STATIC_DISCLOSURE_OPEN_ATTR = 'data-rm-structured-static-disclosure-open';

export const STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR = 'data-rabbit-mirror-structured-static-disclosure-count';

export const STRUCTURED_STATIC_DISCLOSURE_STYLE_ATTR = 'data-rabbit-mirror-structured-static-disclosure-style';

export const structuredStaticDisclosureRescueStates = new WeakMap();

export const FILL_IN_CHOICE_RESCUE_ATTR = 'data-rabbit-mirror-fill-in-choice-rescue';

export const FILL_IN_CHOICE_BLANK_ATTR = 'data-rm-fill-in-choice-blank';

export const FILL_IN_CHOICE_ACTIVE_ATTR = 'data-rm-fill-in-choice-active';

export const FILL_IN_CHOICE_FILLED_ATTR = 'data-rm-fill-in-choice-filled';

export const FILL_IN_CHOICE_CODE_ATTR = 'data-rm-fill-in-choice-code';

export const FILL_IN_CHOICE_OPTION_ATTR = 'data-rm-fill-in-choice-option';

export const FILL_IN_CHOICE_AVAILABLE_ATTR = 'data-rm-fill-in-choice-available';

export const FILL_IN_CHOICE_SELECTED_ATTR = 'data-rm-fill-in-choice-selected';

export const FILL_IN_CHOICE_USED_ATTR = 'data-rm-fill-in-choice-used';

export const FILL_IN_CHOICE_COUNT_ATTR = 'data-rabbit-mirror-fill-in-choice-count';

export const FILL_IN_CHOICE_STYLE_ATTR = 'data-rabbit-mirror-fill-in-choice-style';

export const fillInChoiceRescueStates = new WeakMap();

export const STYLELESS_STRUCTURED_RESCUE_ATTR = 'data-rabbit-mirror-styleless-structured-rescue';

export const STYLELESS_STRUCTURED_STYLE_ATTR = 'data-rabbit-mirror-styleless-structured-style';

export const STYLELESS_STRUCTURED_SHELL_ATTR = 'data-rm-styleless-shell';

export const STYLELESS_STRUCTURED_HEADER_ATTR = 'data-rm-styleless-header';

export const STYLELESS_STRUCTURED_TITLE_ATTR = 'data-rm-styleless-title';

export const STYLELESS_STRUCTURED_SUBTITLE_ATTR = 'data-rm-styleless-subtitle';

export const STYLELESS_STRUCTURED_SECTION_ATTR = 'data-rm-styleless-section';

export const STYLELESS_STRUCTURED_TEXT_ATTR = 'data-rm-styleless-text';

export const STYLELESS_STRUCTURED_CHOICE_ATTR = 'data-rm-styleless-choice';

export const STYLELESS_STRUCTURED_CHOICE_LABEL_ATTR = 'data-rm-styleless-choice-label';

export const STYLELESS_STRUCTURED_COUNT_ATTR = 'data-rabbit-mirror-styleless-structured-count';

export const STYLELESS_STRUCTURED_MAX_DESCENDANTS = 320;

export const MOBILE_LAYOUT_RESCUE_STYLE_ATTR = 'data-rabbit-mirror-mobile-layout-rescue';

export const MOBILE_LAYOUT_SCOPE_ATTR = 'data-rabbit-mirror-mobile-layout-scope';

export const MOBILE_LAYOUT_RESCUE_COUNT_ATTR = 'data-rabbit-mirror-mobile-layout-count';

export const MOBILE_LAYOUT_FIT_ATTR = 'data-rm-mobile-fit';

export const MOBILE_LAYOUT_MIN_ATTR = 'data-rm-mobile-min';

export const MOBILE_LAYOUT_GRID_COLLAPSE_ATTR = 'data-rm-mobile-grid-collapse';

export const MOBILE_LAYOUT_MATRIX_PRESERVE_ATTR = 'data-rm-mobile-matrix-preserve';

export const MOBILE_LAYOUT_MATRIX_ACTIVE_ATTR = 'data-rm-mobile-matrix-active';

export const MOBILE_LAYOUT_MATRIX_CELL_ATTR = 'data-rm-mobile-matrix-cell';

export const MOBILE_LAYOUT_FLEX_WRAP_ATTR = 'data-rm-mobile-flex-wrap';

export const MOBILE_LAYOUT_STATE_ROW_ATTR = 'data-rm-mobile-state-row';

export const MOBILE_LAYOUT_STATE_ROW_GUARD_STYLE_ATTR = 'data-rabbit-mirror-mobile-state-row-guard';

export const MOBILE_LAYOUT_FLEX_STACK_ATTR = 'data-rm-mobile-flex-stack';

export const MOBILE_LAYOUT_SINGLE_COLUMN_ATTR = 'data-rm-mobile-single-column';

export const MOBILE_LAYOUT_FLUID_TITLE_ATTR = 'data-rm-mobile-fluid-title';

export const MOBILE_LAYOUT_COMPACT_PADDING_ATTR = 'data-rm-mobile-compact-padding';

export const MOBILE_LAYOUT_COMPACT_GAP_ATTR = 'data-rm-mobile-compact-gap';

export const MOBILE_LAYOUT_MEDIA_ATTR = 'data-rm-mobile-media';

export const MOBILE_LAYOUT_SCROLL_ATTR = 'data-rm-mobile-scroll';

export const MOBILE_LAYOUT_BREAK_TEXT_ATTR = 'data-rm-mobile-break-text';

export const MOBILE_LAYOUT_SQUEEZED_TEXT_ATTR = 'data-rm-mobile-squeezed-text';

export const MOBILE_LAYOUT_UNDERFILL_ATTR = 'data-rm-mobile-underfill';

export const MOBILE_LAYOUT_STATE_CONTENT_ATTR = 'data-rm-mobile-state-content';

export const MOBILE_LAYOUT_STATE_ACTIVE_ATTR = 'data-rm-mobile-state-active';

export const MOBILE_LAYOUT_SECTION_STACK_PRESERVE_ATTR = 'data-rm-mobile-section-stack-preserve';

export const MOBILE_LAYOUT_SCREEN_SHELL_PRESERVE_ATTR = 'data-rm-mobile-screen-shell-preserve';

export const MOBILE_LAYOUT_RELATION_TREE_ATTR = 'data-rm-mobile-relation-tree';

export const MOBILE_LAYOUT_RELATION_BRANCH_ATTR = 'data-rm-mobile-relation-branch';

export const MOBILE_LAYOUT_RELATION_CELL_ATTR = 'data-rm-mobile-relation-cell';

export const MOBILE_LAYOUT_RELATION_DETAIL_ATTR = 'data-rm-mobile-relation-detail';

export const MOBILE_LAYOUT_RELATION_SIDE_ATTR = 'data-rm-mobile-relation-side';

export const VISUAL_SCENERY_MOBILE_OVERFLOW_HOST_ATTR = 'data-rm-mobile-visual-scenery-overflow-host';

export const VISUAL_SCENERY_MOBILE_OVERFLOW_COPY_ATTR = 'data-rm-mobile-visual-scenery-overflow-copy';

export const VISUAL_SCENERY_MOBILE_OVERFLOW_SOURCE_ATTR = 'data-rm-mobile-visual-scenery-overflow-source';

export const VISUAL_SCENERY_MOBILE_OVERFLOW_STYLE_ATTR = 'data-rabbit-mirror-visual-scenery-overflow-rescue';

export const VISUAL_SCENERY_MOBILE_OVERFLOW_COUNT_ATTR = 'data-rabbit-mirror-visual-scenery-overflow-count';

export const INDEPENDENT_MOBILE_SPATIAL_SCROLL_ATTR = 'data-rm-independent-mobile-spatial-scroll';

export const INDEPENDENT_MOBILE_SPATIAL_CANVAS_ATTR = 'data-rm-independent-mobile-spatial-canvas';

export const INDEPENDENT_MOBILE_SPATIAL_STYLE_ATTR = 'data-rabbit-mirror-independent-mobile-spatial-style';

export const INDEPENDENT_MOBILE_SPATIAL_COUNT_ATTR = 'data-rabbit-mirror-independent-mobile-spatial-count';

export const MOBILE_LAYOUT_BREAKPOINT_PX = 640;

export const MOBILE_LAYOUT_TARGET_ATTRS = Object.freeze([
    MOBILE_LAYOUT_FIT_ATTR,
    MOBILE_LAYOUT_MIN_ATTR,
    MOBILE_LAYOUT_GRID_COLLAPSE_ATTR,
    MOBILE_LAYOUT_MATRIX_PRESERVE_ATTR,
    MOBILE_LAYOUT_MATRIX_ACTIVE_ATTR,
    MOBILE_LAYOUT_MATRIX_CELL_ATTR,
    MOBILE_LAYOUT_FLEX_WRAP_ATTR,
    MOBILE_LAYOUT_STATE_ROW_ATTR,
    MOBILE_LAYOUT_FLEX_STACK_ATTR,
    MOBILE_LAYOUT_SINGLE_COLUMN_ATTR,
    MOBILE_LAYOUT_FLUID_TITLE_ATTR,
    MOBILE_LAYOUT_COMPACT_PADDING_ATTR,
    MOBILE_LAYOUT_COMPACT_GAP_ATTR,
    MOBILE_LAYOUT_MEDIA_ATTR,
    MOBILE_LAYOUT_SCROLL_ATTR,
    MOBILE_LAYOUT_BREAK_TEXT_ATTR,
    MOBILE_LAYOUT_SQUEEZED_TEXT_ATTR,
    MOBILE_LAYOUT_UNDERFILL_ATTR,
    MOBILE_LAYOUT_STATE_CONTENT_ATTR,
    MOBILE_LAYOUT_STATE_ACTIVE_ATTR,
    MOBILE_LAYOUT_SECTION_STACK_PRESERVE_ATTR,
    MOBILE_LAYOUT_SCREEN_SHELL_PRESERVE_ATTR,
    MOBILE_LAYOUT_RELATION_TREE_ATTR,
    MOBILE_LAYOUT_RELATION_BRANCH_ATTR,
    MOBILE_LAYOUT_RELATION_CELL_ATTR,
    MOBILE_LAYOUT_RELATION_DETAIL_ATTR,
    MOBILE_LAYOUT_RELATION_SIDE_ATTR,
]);

export const mobileLayoutRescueStates = new WeakMap();

export const mobileMatrixPreserveStates = new WeakMap();

export const mobileInlineAnnotationRescueStates = new WeakMap();

export const SOURCE_TRUNCATION_NOTICE_ATTR = 'data-rabbit-mirror-source-truncation-notice';

export const MAINTENANCE_STATES = Object.freeze({ idle: 'idle', checking: 'checking', healthy: 'healthy', repairable: 'repairable', notice: 'notice', unknown: 'unknown' });

const INTERACTION_DIAGNOSTIC_VERSION = `${RUNTIME_VERSION}-FULL-CHAIN`;

const DIAGNOSTIC_WAIT_TIMEOUT_MS = 45000;

const DIAGNOSTIC_SOURCE_LIMIT = 60000;

export const interactionDiagnosticStates = new WeakMap();

let oneShotInteractionDiagnosticSession = null;


const TEXT_CLIPPING_REPAIR_ATTR = 'data-rabbit-mirror-text-clipping-repair';

const TEXT_CLIPPING_ITEM_ATTR = 'data-rm-text-clipping-item';

const TEXT_CLIPPING_BASELINE_ATTR = 'data-rm-text-clipping-baseline';

const lastRevealedInteractionByRoot = new WeakMap();


let maintenanceHighConfidenceTextCheckedRoots = new WeakSet();

export const maintenanceHighConfidenceTextRepairFrames = new Map();


const DIAGNOSTIC_MULTIFACE_PROTOCOL_CODES = new Set([
    'invalid-tag', 'tag-budget', 'invalid-attribute', 'duplicate-attribute', 'unclosed-attribute',
    'attribute-budget', 'unclosed-tag', 'css-budget', 'cross-face-style', 'css-depth',
    'unbalanced-style', 'unclosed-style', 'character-budget', 'byte-budget', 'data-uri-budget',
    'invalid-input', 'invalid-expected-count', 'outside-wrapper', 'outside-content', 'unclosed-comment',
    'unclosed-cdata', 'unsupported-declaration', 'mismatched-close', 'invalid-face-structure',
    'duplicate-face-content', 'duplicate-face-summary', 'nested-face', 'invalid-face-marker',
    'duplicate-face-index', 'unexpected-face-index', 'outside-markup', 'invalid-face-root',
    'multiple-face-details', 'multiple-face-summaries', 'unsupported-raw-text', 'invalid-self-close',
    'depth-budget', 'unclosed-raw-text', 'unclosed-face', 'face-count-mismatch',
]);


export function clearLegacyRabbitMirrorAutoFrameArtifacts(root) {
    if (!root) return;
    const targets = new Set();
    if (root.nodeType === 1) targets.add(root);
    root.closest?.('.rabbit-mirror-external-shell[data-rm-source="independent"]') && targets.add(root.closest('.rabbit-mirror-external-shell[data-rm-source="independent"]'));
    root.querySelectorAll?.('[data-rabbit-mirror-auto-frame], [data-rabbit-mirror-auto-frame-version], [data-rabbit-mirror-auto-frame-source], [data-rabbit-mirror-auto-frame-preserved], [style*="--rm-auto-frame-"]').forEach(node => targets.add(node));

    for (const target of targets) {
        target.removeAttribute?.('data-rabbit-mirror-auto-frame');
        target.removeAttribute?.('data-rabbit-mirror-auto-frame-version');
        target.removeAttribute?.('data-rabbit-mirror-auto-frame-source');
        target.removeAttribute?.('data-rabbit-mirror-auto-frame-preserved');
        if (!target.style) continue;
        for (const name of [
            '--rm-auto-frame-base',
            '--rm-auto-frame-summary',
            '--rm-auto-frame-border',
            '--rm-auto-frame-surface',
            '--rm-auto-frame-text',
            '--rm-auto-frame-shadow',
        ]) target.style.removeProperty(name);
        if (!String(target.getAttribute?.('style') || '').trim()) target.removeAttribute?.('style');
    }
}


// 一次性兔子镜总诊断：用户启动后点击一条异常消息。
// 既可捕获已渲染兔子镜交互，也可捕获尚未恢复的代码块/纯文字兔子镜消息；约 650ms 后自动停止。

export function markIndependentMaintenanceLiveRepair(root, ttl = 5000) {
    const host = root?.matches?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]')
        ? root
        : root?.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]');
    if (!host?.isConnected) return null;
    const until = Date.now() + Math.max(1200, Number(ttl) || 5000);
    host.setAttribute(INDEPENDENT_LIVE_REPAIR_ATTR, 'true');
    host.setAttribute(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR, String(until));
    if (host.__rabbitMirrorMaintenanceLiveRepairTimer) clearTimeout(host.__rabbitMirrorMaintenanceLiveRepairTimer);
    host.__rabbitMirrorMaintenanceLiveRepairTimer = setTimeout(() => {
        host.__rabbitMirrorMaintenanceLiveRepairTimer = 0;
        const currentUntil = Number(host.getAttribute(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR) || 0);
        if (currentUntil > Date.now()) return;
        host.removeAttribute(INDEPENDENT_LIVE_REPAIR_ATTR);
        host.removeAttribute(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR);
    }, Math.max(1300, until - Date.now() + 80));
    return host;
}

export function releaseIndependentMaintenanceLiveRepair(root, delay = 700) {
    const host = root?.matches?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]')
        ? root
        : root?.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]');
    if (!host?.isConnected) return false;
    const until = Date.now() + Math.max(250, Number(delay) || 700);
    host.setAttribute(INDEPENDENT_LIVE_REPAIR_ATTR, 'true');
    host.setAttribute(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR, String(until));
    if (host.__rabbitMirrorMaintenanceLiveRepairTimer) clearTimeout(host.__rabbitMirrorMaintenanceLiveRepairTimer);
    host.__rabbitMirrorMaintenanceLiveRepairTimer = setTimeout(() => {
        host.__rabbitMirrorMaintenanceLiveRepairTimer = 0;
        const currentUntil = Number(host.getAttribute(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR) || 0);
        if (currentUntil > Date.now()) return;
        host.removeAttribute(INDEPENDENT_LIVE_REPAIR_ATTR);
        host.removeAttribute(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR);
    }, Math.max(320, until - Date.now() + 80));
    return true;
}

export function diagnosticCompactText(value, maxLength = 80) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}


export function diagnosticComputedStyle(element) {
    try {
        return typeof getComputedStyle === 'function' ? getComputedStyle(element) : null;
    } catch {
        return null;
    }
}


function diagnosticRect(element) {
    try {
        const rect = element?.getBoundingClientRect?.();
        if (!rect) return { width: 0, height: 0 };
        return {
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
        };
    } catch {
        return { width: 0, height: 0 };
    }
}


export function diagnosticElementName(element) {
    if (!element) return '(none)';
    const tag = String(element.tagName || 'node').toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = getClassTokens(element).slice(0, 3).map(token => `.${token}`).join('');
    return `${tag}${id}${classes}`;
}


export function diagnosticFindClippingAncestor(element, root) {
    let current = element?.parentElement || null;
    for (let depth = 0; current && depth < 7; depth += 1, current = current.parentElement) {
        if (current.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) return null;
        const style = diagnosticComputedStyle(current);
        const overflow = `${style?.overflow || ''}/${style?.overflowX || ''}/${style?.overflowY || ''}`.toLowerCase();
        const rect = diagnosticRect(current);
        if (/(?:hidden|clip)/.test(overflow) || rect.height <= 1) {
            return `${diagnosticElementName(current)} height=${rect.height}px overflow=${overflow}`;
        }
        if (current === root) break;
    }
    return null;
}


function diagnosticCollectTargets(root) {
    if (!root?.querySelectorAll) return [];
    const semanticSelectors = [
        '.hidden-thought',
        '[class*="hidden"]',
        '[class*="reveal"]',
        '[class*="secret"]',
        `[${RENDERED_BUTTON_ADJACENT_HIDDEN_ITEM_ATTR}]`,
        `[${RENDERED_CSS_STATE_SIBLING_ITEM_ATTR}]`,
    ];
    const seen = new Set();
    const result = [];
    const append = element => {
        if (!element || seen.has(element)) return false;
        if (element.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) return false;
        if (element.closest?.(`[${SOURCE_TRUNCATION_NOTICE_ATTR}]`)) return false;
        const tagName = String(element.tagName || '').toLowerCase();
        if (/^(?:input|select|textarea|option|button|label|style|script|template)$/.test(tagName)) return false;
        seen.add(element);
        result.push(element);
        return result.length >= 12;
    };

    // 语义类名或已经登记过的急救目标即使当前可见，也要保留在诊断候选中，
    // 这样可以观察“切换后是否真的出现”。
    for (const element of root.querySelectorAll(semanticSelectors.join(','))) {
        if (append(element)) return result;
    }

    // 样式候选必须按实际数值判断。旧实现用 [style*="opacity:0"]，
    // 会把 opacity:0.7、opacity:0.8 等正常可见装饰误报成隐藏内容。
    for (const element of root.querySelectorAll('[style]')) {
        if (!getRenderedStyleSnapshot(element).hidden) continue;
        if (append(element)) return result;
    }

    // 诊断模式也读取计算样式，覆盖隐藏态仅存在于 <style> 的按钮后置结果。
    for (const button of root.querySelectorAll('button')) {
        const target = findRenderedButtonAdjacentHiddenTarget(button);
        if (append(target)) break;
    }
    return result;
}


export function diagnosticFindAssociatedLabel(root, input) {
    if (!input) return null;
    const wrapping = input.closest?.('label');
    if (wrapping) return wrapping;
    if (input.labels?.length) return input.labels[0] || null;
    const id = String(input.id || '');
    if (!id || !root?.querySelectorAll) return null;
    return [...root.querySelectorAll('label[for]')].find(label => String(label.getAttribute('for') || '') === id) || null;
}


export function diagnosticRouteSummary(root) {
    return {
        adjacent: renderedAdjacentHiddenGroupRescueStates.get(root)?.entries?.size || 0,
        layers: renderedStateLayerRescueStates.get(root)?.entries?.size || 0,
        labelInternal: renderedLabelInternalHiddenRescueStates.get(root)?.entries?.size || 0,
        labelAdjacent: renderedLabelAdjacentResultRescueStates.get(root)?.entries?.size || 0,
        maskReveal: renderedMaskRevealRescueStates.get(root)?.hosts?.size || 0,
        listDetail: renderedListDetailRescueStates.get(root)?.entries?.size || 0,
        stateSibling: renderedCssStateSiblingRescueStates.get(root)?.entries?.size || 0,
        stateCrossTree: Number.parseInt(root?.getAttribute?.(RENDERED_CSS_STATE_CROSS_TREE_ROOT_ATTR) || '0', 10) || 0,
        buttonAdjacent: renderedButtonAdjacentHiddenRescueStates.get(root)?.entries?.size || 0,
        clickableAdjacent: renderedClickableAdjacentHiddenRescueStates.get(root)?.entries?.size || 0,
        clickablePopup: renderedClickableAdjacentPopupRescueStates.get(root)?.entries?.size || 0,
        checkedIdTarget: renderedCheckedIdTargetRescueStates.get(root)?.entries?.size || 0,
        focusToChecked: Number.parseInt(root?.getAttribute?.(FOCUS_TO_CHECKED_ROOT_ATTR) || '0', 10) || 0,
        checkedTextRule: root?.querySelectorAll?.(`[${CHECKED_TEXT_RULE_RESCUE_ATTR}]`)?.length || 0,
        missingCheckedClass: Number.parseInt(root?.getAttribute?.(MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR) || '0', 10) || 0,
        crossParentChecked: Number.parseInt(root?.getAttribute?.(CROSS_PARENT_CHECKED_ROOT_ATTR) || '0', 10) || 0,
        checkedHasState: Number.parseInt(root?.getAttribute?.(CHECKED_HAS_STATE_RULE_COUNT_ATTR) || '0', 10) || 0,
        detachedCheckedHas: Number.parseInt(root?.getAttribute?.(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR) || '0', 10) || 0,
        pairedCheckedState: Number.parseInt(root?.getAttribute?.(PAIRED_CHECKED_STATE_COUNT_ATTR) || '0', 10) || 0,
        exclusiveStackedState: Number.parseInt(root?.getAttribute?.(EXCLUSIVE_STACKED_STATE_COUNT_ATTR) || '0', 10) || 0,
        channelDialCycle: Number.parseInt(root?.getAttribute?.(CHANNEL_DIAL_CYCLE_COUNT_ATTR) || '0', 10) || 0,
        reversibleChecked: Number.parseInt(root?.getAttribute?.(REVERSIBLE_CHECKED_RESULT_ROOT_ATTR) || '0', 10) || 0,
        radioGroups: Number.parseInt(root?.getAttribute?.(RADIO_GROUP_ROOT_ATTR) || '0', 10) || 0,
        reversibleRadio: Number.parseInt(root?.getAttribute?.(REVERSIBLE_RADIO_ROOT_ATTR) || '0', 10) || 0,
        radioReset: Number.parseInt(root?.getAttribute?.(RAW_RADIO_RESET_ROOT_ATTR) || '0', 10) || 0,
        expandedOpacity: root?.querySelectorAll?.(`[${EXPANDED_OPACITY_RESCUE_ATTR}]`)?.length || 0,
        nestedCheckedContent: root?.querySelectorAll?.(`[${NESTED_CHECKED_CONTENT_RESCUE_ATTR}]`)?.length || 0,
        containerReveal: renderedContainerInternalRevealStates.get(root)?.entries?.size || 0,
        selfMutation: rawSelfMutationRescueStates.get(root)?.entries?.size || 0,
        classStateProgram: root?.querySelectorAll?.(`[${DIRECT_ID_CLASS_STATE_RESCUE_ATTR}]`)?.length || 0,
        scriptTimeline: Number.parseInt(root?.getAttribute?.(RAW_SCRIPT_TIMELINE_ROOT_ATTR) || '0', 10) || 0,
        cssCommentRepair: root?.querySelectorAll?.(`[${MARKDOWN_CSS_COMMENT_RESCUE_ATTR}]`)?.length || 0,
        changeProgram: root?.querySelectorAll?.(`[${CHANGE_PSEUDO_RESCUE_ATTR}]`)?.length || 0,
        focusWithinPersistent: Number.parseInt(root?.getAttribute?.(FOCUS_WITHIN_PERSISTENT_ROOT_ATTR) || '0', 10) || 0,
        unlabeledChecked: unlabeledCheckedHostRescueStates.get(root)?.entries?.size || 0,
        labeledCheckedVerify: Number.parseInt(root?.getAttribute?.(LABELED_CHECKED_VERIFY_ROOT_ATTR) || '0', 10) || 0,
        webkit3dFlip: Number.parseInt(root?.getAttribute?.(WEBKIT_3D_FLIP_RESCUE_ATTR) || '0', 10) || 0,
        selectionFallback: root?.querySelectorAll?.(`[${SELECTION_ONLY_FALLBACK_ATTR}]`)?.length || 0,
        disabledChoice: root?.querySelectorAll?.(`[${DISABLED_ONLY_CHOICE_RESCUE_ATTR}]`)?.length || 0,
        inertAction: root?.querySelectorAll?.(`[${INERT_ACTION_BUTTON_RESCUE_ATTR}]`)?.length || 0,
        staticChoiceSelection: Number.parseInt(root?.getAttribute?.(STATIC_CHOICE_SELECTION_COUNT_ATTR) || '0', 10) || 0,
        structuredStaticDisclosure: Number.parseInt(root?.getAttribute?.(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR) || '0', 10) || 0,
        fillInChoice: Number.parseInt(root?.getAttribute?.(FILL_IN_CHOICE_COUNT_ATTR) || '0', 10) || 0,
        passportDocument: passportDocumentRescueStates.get(root)?.entries?.length || 0,
        decorativeOverlayPassThrough: root?.querySelectorAll?.(`[${DECORATIVE_OVERLAY_PASS_THROUGH_ATTR}]`)?.length || 0,
        touchHoverEligible: root?.querySelectorAll?.(`[${TOUCH_HOVER_READY_ATTR}]`)?.length || 0,
        touchHoverActive: root?.querySelectorAll?.(`[${TOUCH_HOVER_ATTR}="true"]`)?.length || 0,
    };
}


function diagnosticInferReason(root, inputs, targets, state = null) {
    if (rabbitMirrorTextPresentation(root) && !inputs.length
        && !targets.some(target => !diagnosticIsInternalUiNode(target)
            && !target.closest?.(`[${TOOL_ENTRY_HOST_ATTR}]`)
            && !target.matches?.('[data-rabbit-mirror-title-flow-end="true"]'))) return '本面为文本模式：使用 HTML 排版阅读，不要求内部交互；外层收展与重说工具照常可用。';
    const routes = diagnosticRouteSummary(root);
    const depth = maintenanceCheckedInteractionDepth(root);
    const routeCount = routes.adjacent + routes.layers + routes.labelInternal + routes.labelAdjacent + routes.maskReveal + routes.listDetail + routes.stateSibling + routes.buttonAdjacent + routes.clickableAdjacent + routes.clickablePopup + routes.checkedIdTarget + routes.focusToChecked + routes.checkedTextRule + routes.missingCheckedClass + routes.crossParentChecked + routes.checkedHasState + routes.detachedCheckedHas + routes.pairedCheckedState + routes.exclusiveStackedState + routes.channelDialCycle + routes.reversibleRadio + routes.expandedOpacity + routes.nestedCheckedContent + routes.containerReveal + routes.selfMutation + routes.classStateProgram + routes.scriptTimeline + routes.cssCommentRepair + routes.changeProgram + routes.focusWithinPersistent + routes.unlabeledChecked + routes.labeledCheckedVerify + routes.selectionFallback + routes.disabledChoice + routes.inertAction + routes.staticChoiceSelection + routes.structuredStaticDisclosure + routes.fillInChoice + routes.passportDocument + routes.decorativeOverlayPassThrough;
    const checkedInputs = inputs.filter(input => input.checked);
    const visibleTargets = targets.filter(target => {
        const style = diagnosticComputedStyle(target);
        const rect = diagnosticRect(target);
        const opacity = Number.parseFloat(style?.opacity || '1');
        return style?.display !== 'none' && style?.visibility !== 'hidden' && opacity > 0.05 && rect.height > 0;
    });

    if (routes.detachedCheckedHas > 0) {
        return '已恢复控制区与内容区分离的 :has() 状态联动；radio 切换会显示原始源码中对应的正文分支。';
    }
    if (routes.focusWithinPersistent > 0) {
        return '已把无 label 透明 checkbox 的 :focus-within 第二层内容恢复为可保持、可再次关闭的点击状态。';
    }
    if (depth.selectionOnlyFallbackCount > 0) {
        const statusOnlyCount = diagnosticQueryContentAll(root, `[${SELECTION_ONLY_FALLBACK_ATTR}="status-only"]`).length;
        if (statusOnlyCount > 0) return '已为只有选中样式、没有结果内容的选项建立明确状态提示；不会伪造缺失剧情。';
        return '已为缺少分支内容的选择控件建立明确缺失提示与返回路径；默认内容保持原样，其他选项不会伪造剧情。';
    }
    if (depth.checkedSelectionOnly && !targets.length) return 'radio/checkbox 只改变选中项外观，源码没有可识别的第二层内容；可使用维修兔建立明确缺失提示。';
    const pseudoDepth = maintenancePseudoInteractionDepth(root);
    if (!inputs.length && pseudoDepth.pseudoVisualOnlyRaw && !routes.stateSibling && !routes.buttonAdjacent && !routes.clickableAdjacent && !routes.clickablePopup && !routes.containerReveal && !routes.listDetail) {
        return '当前只有 Hover／Active 的变色、背景或轻微位移，没有可保持状态或第二层内容。';
    }
    const reachability = maintenanceReachableInteractionEvidence(root, routes, depth, pseudoDepth, getRawAssistantMessageForRenderedRoot(root));
    if (!inputs.length && routes.fillInChoice > 0) {
        return '已把原有填空与候选碎片恢复为可选择、可改选、可清除的保持状态；只使用源码现有候选，不补写新答案。';
    }
    if (!inputs.length && routes.staticChoiceSelection > 0) {
        return '已把原有的静态抉择卡片恢复为互斥、可撤回的选择状态；只记录当前选项，不编造缺失的后续剧情。';
    }
    if (!inputs.length && findStaticChoiceSelectionCandidates(root).length > 0) {
        return '检测到具有明确“选项”文案和点击外观的静态卡片，可使用维修兔恢复互斥选择状态。';
    }
    if (!inputs.length && reachability.noInteractionStructure) {
        return '原始输出只有静态内容或动画，没有可达的内容交互结构；维修兔不能在不编造结果的情况下自动补全。';
    }
    if (!inputs.length && routes.selfMutation > 0) {
        const activeSelfMutation = !!root.querySelector?.(`[${RAW_SELF_MUTATION_ACTIVE_ATTR}="true"]`);
        return activeSelfMutation
            ? '元素自身状态切换已执行，当前可见变化由 class／样式状态直接驱动；此类交互不要求另有隐藏内容。'
            : '元素自身状态切换路线已建立；本次诊断未实际点击该元素，不能因没有隐藏内容而判定交互失败。';
    }
    if (!inputs.length && routeCount && visibleTargets.length) return '非表单交互急救路线已建立，候选内容在计算样式中已有可见项。';
    if (!inputs.length && routeCount) return '非表单交互急救路线已建立，但候选内容最终仍不可见：样式可能被覆盖或被布局裁切。';
    if (!inputs.length) return '未找到 checkbox/radio：渲染后控件可能被删除，或当前交互并非表单状态结构。';
    const diagnosticEvents = state?.events || [];
    const inputInteractionObserved = diagnosticEvents.some(item => /(?:click|input|change):capture target=input/i.test(String(item || '')));
    const sandboxProbeAttempted = diagnosticEvents.some(item => /maintenance-sandbox-probe:/i.test(String(item || '')));
    const labeledProbeLast = String(root.getAttribute?.(LABELED_CHECKED_VERIFY_LAST_ATTR) || '');
    if (/maintenance-sandbox-probe-observe:verified/i.test(labeledProbeLast)) {
        return '维修兔已在隐藏隔离副本中切换有 label 的 checkbox，并观察到 checked 状态与第二层内容真实变化；当前页面的真实控件未被操作。';
    }
    if (sandboxProbeAttempted && !inputInteractionObserved) {
        return '全链路诊断只在隐藏隔离副本中尝试动态验证；本次未形成高置信第二状态证据，当前页面真实控件未被操作。';
    }
    if (!checkedInputs.length && !inputInteractionObserved) return '本次诊断没有实际操作 checkbox/radio；当前只能确认急救路线是否安装，不能据此判断控件发生了重复切换。';
    if (!checkedInputs.length) return '实际操作后控件仍未保持勾选；可能发生重复切换、触摸被覆盖层拦截，或宿主再次回滚了状态。';
    if (!routeCount && targets.length) return 'checkbox 已切换，但没有任何渲染后急救路线建立：当前结构识别条件未命中。';
    if (routeCount && !visibleTargets.length) return '急救路线已建立，但候选内容最终仍不可见：样式可能未执行、被宿主覆盖，或被布局裁切。';
    if (visibleTargets.length) return '候选内容在计算样式中已有可见项；若屏幕仍看不到，请重点查看高度、裁切和时间快照。';
    return '尚无法自动归因，请连同源码与实际渲染代码一起反馈。';
}


export function captureInteractionDiagnosticSnapshot(root, state, label) {
    if (!root || !state) return;
    const targets = diagnosticCollectTargets(root).slice(0, 6);
    const inputs = [...root.querySelectorAll('input[type="checkbox"], input[type="radio"]')].slice(0, 6);
    const targetSummary = targets.map((target, index) => {
        const computed = diagnosticComputedStyle(target);
        const rect = diagnosticRect(target);
        return `${index}:${diagnosticElementName(target)} opacity=${computed?.opacity || '?'} display=${computed?.display || '?'} height=${rect.height}px`;
    }).join(' | ');
    const inputSummary = inputs.map((input, index) => `${index}:${diagnosticElementName(input)}=${!!input.checked}`).join(' | ');
    state.snapshots.push(`${label} inputs[${inputSummary || 'none'}] targets[${targetSummary || 'none'}]`);
    if (state.snapshots.length > 6) state.snapshots.splice(0, state.snapshots.length - 6);
}



export function diagnosticMessageBody(root) {
    if (!root?.closest) return root || null;
    if (root.matches?.('.mes_text')) return root;
    return root.closest('.mes_text') || root.querySelector?.('.mes_text') || root;
}


export function diagnosticIsInternalUiNode(node) {
    if (!node) return false;
    if (node.closest?.('[data-rm-image-region], [data-rm-image-portal], [data-rm-tool-menu]')) return true;
    if (node.closest?.(`[${EXTERNAL_REFERENCE_NOTE_ATTR}]`)) return true;
    if (node.matches?.(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`)) return true;
    return !!node.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}]`);
}


export function diagnosticQueryContentAll(root, selector) {
    return [...(root?.querySelectorAll?.(selector) || [])]
        .filter(node => !diagnosticIsInternalUiNode(node));
}


export function diagnosticContentSnapshot(root) {
    const fallback = {
        html: String(root?.innerHTML || ''),
        text: String(root?.textContent || ''),
    };
    const clone = root?.cloneNode?.(true);
    if (!clone?.querySelectorAll) return fallback;
    clone.querySelectorAll(`[data-rm-image-region], [data-rm-image-portal], [${EXTERNAL_REFERENCE_NOTE_ATTR}], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}], [${RECIPE_MENU_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}]`)
        .forEach(node => node.remove());
    return {
        html: String(clone.innerHTML || ''),
        text: String(clone.textContent || ''),
    };
}



export function maintenanceSafeComputedStyle(element) {
    try {
        return typeof getComputedStyle === 'function' ? getComputedStyle(element) : null;
    } catch {
        return null;
    }
}


export function maintenanceIsVisibleContentElement(element) {
    if (!element?.getBoundingClientRect || diagnosticIsInternalUiNode(element)) return false;
    const tag = String(element.tagName || '').toLowerCase();
    if (/^(?:style|script|template|input|select|textarea|option|svg|path|br|hr)$/.test(tag)) return false;
    if (element.closest?.('[hidden], [aria-hidden="true"]')) return false;
    const style = maintenanceSafeComputedStyle(element);
    if (!style || style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
    const opacity = Number.parseFloat(style.opacity || '1');
    if (Number.isFinite(opacity) && opacity <= 0.05) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 1 && rect.height > 1;
}


function maintenanceHasMeaningfulText(element) {
    const text = String(element?.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length >= 2 && text.length <= 12000;
}


export function maintenanceDirectTextLength(element) {
    let length = 0;
    for (const node of [...(element?.childNodes || [])]) {
        if (node?.nodeType === 3) length += String(node.nodeValue || '').replace(/\s+/g, ' ').trim().length;
    }
    return length;
}


export function maintenanceVisibleTextRects(element, limit = 80) {
    if (!element || typeof document === 'undefined' || !document.createTreeWalker || !document.createRange) return [];
    const SHOW_TEXT = globalThis.NodeFilter?.SHOW_TEXT ?? 4;
    const FILTER_ACCEPT = globalThis.NodeFilter?.FILTER_ACCEPT ?? 1;
    const FILTER_REJECT = globalThis.NodeFilter?.FILTER_REJECT ?? 2;
    const walker = document.createTreeWalker(element, SHOW_TEXT, {
        acceptNode(node) {
            const value = String(node?.nodeValue || '').replace(/\s+/g, ' ').trim();
            if (!value) return FILTER_REJECT;
            const parent = node.parentElement;
            if (!parent || diagnosticIsInternalUiNode(parent) || !maintenanceIsVisibleContentElement(parent)) return FILTER_REJECT;
            return FILTER_ACCEPT;
        },
    });
    const rects = [];
    let node;
    while ((node = walker.nextNode()) && rects.length < limit) {
        try {
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const rect of [...range.getClientRects()]) {
                if (rect.width > 0.5 && rect.height > 0.5) rects.push(rect);
                if (rects.length >= limit) break;
            }
            range.detach?.();
        } catch {
            // Ignore a single malformed text node.
        }
    }
    return rects;
}


export function maintenanceHasIntentionalMarquee(element) {
    if (!element?.querySelectorAll) return false;
    for (const descendant of element.querySelectorAll('*')) {
        const style = maintenanceSafeComputedStyle(descendant);
        if (!style) continue;
        const animationName = String(style.animationName || '').trim().toLowerCase();
        const whiteSpace = String(style.whiteSpace || '').trim().toLowerCase();
        if (animationName && animationName !== 'none' && whiteSpace === 'nowrap') return true;
    }
    return false;
}


function maintenanceCssPixelValue(value) {
    const match = String(value ?? '').trim().match(/^(-?(?:\d+\.?\d*|\.\d+))px$/i);
    if (!match) return Number.NaN;
    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
}


function maintenanceSafeTextClippingAncestorEvidence(element, root, textRects) {
    if (!element || !root || !Array.isArray(textRects) || !textRects.length) return null;
    let ancestor = element.parentElement;
    let depth = 0;
    while (ancestor && ancestor !== root && depth < 5) {
        if (root.contains?.(ancestor) === false) break;
        const style = maintenanceSafeComputedStyle(ancestor);
        const rect = ancestor.getBoundingClientRect?.();
        if (!style || !rect || Number(rect.width || 0) <= 1 || Number(rect.height || 0) <= 1) {
            ancestor = ancestor.parentElement;
            depth += 1;
            continue;
        }
        const position = String(style.position || '').trim().toLowerCase();
        const tag = String(ancestor.tagName || '').trim().toLowerCase();
        const interactiveSelf = !!ancestor.matches?.('input,button,select,textarea,a[href],[role="button"],[tabindex],[aria-expanded],details,summary');
        const unsafeStructure = interactiveSelf
            || /^(?:details|summary|table|ul|ol|form|svg|canvas|picture|video|audio|iframe)$/.test(tag)
            || !!ancestor.querySelector?.('input,button,select,textarea,a[href],[role="button"],[tabindex],[aria-expanded],details,summary,svg,canvas,img,picture,video,audio,iframe,table,ul,ol,form');
        if (position === 'absolute' || position === 'fixed' || unsafeStructure) {
            ancestor = ancestor.parentElement;
            depth += 1;
            continue;
        }
        const overflow = String(style.overflow || '').trim().toLowerCase();
        const overflowX = String(style.overflowX || overflow).trim().toLowerCase();
        const overflowY = String(style.overflowY || overflow).trim().toLowerCase();
        const clipsX = /^(?:hidden|clip)$/.test(overflowX);
        const clipsY = /^(?:hidden|clip)$/.test(overflowY);
        const horizontal = clipsX && textRects.some(textRect => textRect.left < rect.left - 1 || textRect.right > rect.right + 1);
        const vertical = clipsY && textRects.some(textRect => textRect.top < rect.top - 1 || textRect.bottom > rect.bottom + 1);
        if ((horizontal || vertical) && !(horizontal && !vertical && maintenanceHasIntentionalMarquee(ancestor))) {
            return { element: ancestor, horizontal, vertical, depth: depth + 1 };
        }
        ancestor = ancestor.parentElement;
        depth += 1;
    }
    return null;
}


function maintenanceHasReachableTextRevealPath(element, root) {
    if (!element || !root) return false;
    const outerDetails = root.matches?.('details') ? root : root.querySelector?.(':scope > details');
    let cursor = element;
    let depth = 0;
    while (cursor && cursor !== root && depth < 4) {
        // The outer title only folds the whole work. It cannot reveal text cut
        // off inside the already-open work, so it is not an internal reveal path.
        if (cursor === outerDetails) break;
        if (cursor.matches?.('details:not([open]), label, summary, input, button, select, textarea, a[href], [role="button"], [tabindex], [aria-expanded]')) return true;
        const previous = cursor.previousElementSibling;
        if (previous?.parentElement !== outerDetails || !previous?.matches?.('summary')) {
            if (previous?.matches?.('input[type="checkbox"], input[type="radio"], button, label[for], summary, a[href], [role="button"], [tabindex], [aria-controls], [aria-expanded]')) return true;
        }
        cursor = cursor.parentElement;
        depth += 1;
    }
    const id = String(element.id || element.getAttribute?.('id') || '').trim();
    if (!id || !root.querySelectorAll) return false;
    for (const control of root.querySelectorAll('label[for], [aria-controls], a[href^="#"]')) {
        const target = String(control.getAttribute?.('for') || control.getAttribute?.('aria-controls') || control.getAttribute?.('href')?.replace(/^#/, '') || '').trim();
        if (target === id) return true;
    }
    return false;
}


function maintenanceTextClippingEvidence(element, root) {
    if (!maintenanceIsVisibleContentElement(element) || !maintenanceHasMeaningfulText(element)) return null;
    // 护照／证件专项维修会单独恢复封面、内页滚动与印章详情。
    // 不再让通用文字裁切巡逻把尚未打开的封面或受控详情误报为正文丢失。
    if (maintenanceMobileLayoutIsPassportManaged(element)) return null;
    const style = maintenanceSafeComputedStyle(element);
    if (!style) return null;
    const rect = element.getBoundingClientRect();
    const clientWidth = Number(element.clientWidth || 0);
    const clientHeight = Number(element.clientHeight || 0);
    if (clientWidth <= 1 || clientHeight <= 1) return null;

    const overflow = String(style.overflow || '').toLowerCase();
    const overflowX = String(style.overflowX || overflow).toLowerCase();
    const overflowY = String(style.overflowY || overflow).toLowerCase();
    const clipsX = /(?:hidden|clip)/.test(overflowX);
    const clipsY = /(?:hidden|clip)/.test(overflowY);
    const whiteSpace = String(style.whiteSpace || '').toLowerCase();
    const textOverflow = String(style.textOverflow || '').toLowerCase();
    const lineClamp = String(style.webkitLineClamp || element.style?.getPropertyValue?.('-webkit-line-clamp') || '').trim().toLowerCase();
    const lineClamped = !!lineClamp && !/^(?:none|unset|initial|0)$/.test(lineClamp);
    const noWrap = /^(?:nowrap|pre)$/.test(whiteSpace);
    const writingMode = String(style.writingMode || 'horizontal-tb').trim().toLowerCase();
    const verticalWriting = /^(?:vertical|sideways)/.test(writingMode);
    const fontSizePx = maintenanceCssPixelValue(style.fontSize);
    const lineHeightPx = maintenanceCssPixelValue(style.lineHeight);
    const directText = maintenanceDirectTextLength(element) > 0;
    const semanticTextTag = /^(?:p|span|div|li|td|th|h[1-6]|blockquote|pre|code|label|button|summary|figcaption|dd|dt)$/.test(String(element.tagName || '').toLowerCase());

    const scrollOverflowX = Number(element.scrollWidth || 0) > clientWidth + 2;
    const scrollOverflowY = Number(element.scrollHeight || 0) > clientHeight + 2;
    const textRects = maintenanceVisibleTextRects(element);
    const textOutsideX = textRects.some(textRect => textRect.left < rect.left - 1 || textRect.right > rect.right + 1);
    const textOutsideY = textRects.some(textRect => textRect.top < rect.top - 1 || textRect.bottom > rect.bottom + 1);

    // scrollWidth/scrollHeight 可能由绝对定位装饰层或整块媒介结构撑大。
    // 只有直属文本，或自身就是文字载体且没有块级结构子树时，才把滚动尺寸当文字证据。
    const hasBlockStructure = !!element.querySelector?.('div,section,article,main,aside,header,footer,ul,ol,table,figure,details,form');
    const scrollTextEvidence = directText || (semanticTextTag && !hasBlockStructure);
    const lineHeightCramped = !verticalWriting
        && Number.isFinite(fontSizePx) && fontSizePx >= 8
        && Number.isFinite(lineHeightPx) && lineHeightPx > 0
        && lineHeightPx < fontSizePx * 0.88
        && textOutsideY;
    const clippingAncestor = scrollTextEvidence
        ? maintenanceSafeTextClippingAncestorEvidence(element, root, textRects)
        : null;
    let horizontal = (clipsX && textOutsideX)
        || ((clipsX || noWrap || textOverflow === 'ellipsis') && scrollTextEvidence && scrollOverflowX)
        || !!clippingAncestor?.horizontal;
    const vertical = lineClamped
        || (clipsY && textOutsideY)
        || (clipsY && scrollTextEvidence && scrollOverflowY)
        || lineHeightCramped
        || !!clippingAncestor?.vertical;
    // 滚动字幕会故意把 nowrap 文本移出裁切窗口；这是媒介动画，不是文字丢失。
    if (horizontal && !vertical && clipsX && maintenanceHasIntentionalMarquee(element)) horizontal = false;
    if (!horizontal && !vertical) return null;

    // Automatic repair is intentionally narrower than the maintenance-rabbit
    // diagnostic. Line clamp, ellipsis and compact display typography can be
    // deliberate; only a separate, simple clipping ancestor with no reachable
    // reveal control is safe enough to rewrite without asking the player.
    const highConfidence = !lineClamped
        && !lineHeightCramped
        && !!clippingAncestor
        && !maintenanceHasReachableTextRevealPath(clippingAncestor.element, root);

    return {
        element,
        horizontal,
        vertical,
        noWrap,
        lineClamped,
        lineHeightCramped,
        verticalWriting,
        clippingAncestor,
        highConfidence,
        rootWidth: Number(root?.getBoundingClientRect?.().width || 0),
        elementWidth: rect.width,
    };
}


function maintenanceHasPotentialAutomaticTextClip(element, root, ancestorStyles) {
    // Automatic opening checks are not a full diagnostic. Only direct readable
    // text can be repaired, and high confidence requires a separate simple
    // clipping ancestor. Reject impossible cases before walking descendants or
    // allocating text Ranges. Cache ancestor styles only for this read-only pass.
    if (maintenanceDirectTextLength(element) < 2 || diagnosticIsInternalUiNode(element)) return false;
    if (/^(?:style|script|template|input|select|textarea|option|svg|path)$/.test(String(element.tagName || '').toLowerCase())) return false;
    let ancestor = element.parentElement;
    for (let depth = 0; ancestor && ancestor !== root && depth < 5; depth += 1, ancestor = ancestor.parentElement) {
        if (root.contains?.(ancestor) === false) break;
        let potential = ancestorStyles.get(ancestor);
        if (potential === undefined) {
            const style = maintenanceSafeComputedStyle(ancestor);
            const position = String(style?.position || '').toLowerCase();
            const overflow = String(style?.overflow || '').toLowerCase();
            potential = !!style
                && position !== 'absolute' && position !== 'fixed'
                && (/^(?:hidden|clip)$/.test(String(style.overflowX || overflow).toLowerCase())
                    || /^(?:hidden|clip)$/.test(String(style.overflowY || overflow).toLowerCase()));
            if (potential) {
                const unsafeSelector = 'input,button,select,textarea,a[href],[role="button"],[tabindex],[aria-expanded],details,summary,svg,canvas,img,picture,video,audio,iframe,table,ul,ol,form';
                potential = !ancestor.matches?.(unsafeSelector) && !ancestor.querySelector?.(unsafeSelector);
            }
            ancestorStyles.set(ancestor, potential);
        }
        if (potential) return true;
    }
    return false;
}


export function findMaintenanceTextClippingCandidates(root, limit = 24, { highConfidenceOnly = false } = {}) {
    if (!root?.querySelectorAll) return [];
    const candidates = [];
    const seen = new Set();
    const ancestorStyles = highConfidenceOnly ? new Map() : null;
    const elements = [root, ...root.querySelectorAll('*')];
    for (const element of elements) {
        if (seen.has(element)) continue;
        if (highConfidenceOnly && !maintenanceHasPotentialAutomaticTextClip(element, root, ancestorStyles)) continue;
        const evidence = maintenanceTextClippingEvidence(element, root);
        if (!evidence) continue;
        if (highConfidenceOnly && !evidence.highConfidence) continue;
        seen.add(element);
        candidates.push(evidence);
        if (candidates.length >= Math.max(1, Number(limit) || 24)) break;
    }
    return candidates;
}


function encodeTextClippingBaseline(element, properties) {
    if (!element?.style || element.hasAttribute(TEXT_CLIPPING_BASELINE_ATTR)) return;
    const baseline = {};
    for (const property of properties) {
        baseline[property] = {
            value: element.style.getPropertyValue(property),
            priority: element.style.getPropertyPriority(property),
        };
    }
    try {
        element.setAttribute(TEXT_CLIPPING_BASELINE_ATTR, encodeURIComponent(JSON.stringify(baseline)));
    } catch {
        element.setAttribute(TEXT_CLIPPING_BASELINE_ATTR, 'captured');
    }
}



export function repairMaintenanceTextClipping(root, { highConfidenceOnly = false, maxCandidates = 24 } = {}) {
    if (!root?.querySelectorAll) return 0;
    let repaired = 0;
    const candidates = findMaintenanceTextClippingCandidates(root, maxCandidates, { highConfidenceOnly });
    for (const evidence of candidates) {
        if (highConfidenceOnly && !evidence.highConfidence) continue;
        const element = evidence.element;
        if (!element?.style) continue;
        const tag = String(element.tagName || '').toLowerCase();
        const hasBlockStructure = !!element.querySelector?.('div,section,article,main,aside,header,footer,ul,ol,table,figure,details,form');
        const directTextCarrier = maintenanceDirectTextLength(element) > 0;
        const semanticLeafText = /^(?:p|span|li|td|th|h[1-6]|blockquote|pre|code|label|button|figcaption|dd|dt)$/.test(tag) && !hasBlockStructure;
        // 只维修真正的叶级文字载体。含完整布局子树的画框、卡片、翻页和档案板只报告，不改结构。
        if (!directTextCarrier && !semanticLeafText) continue;
        const properties = [
            'white-space', 'overflow-wrap', 'word-break', 'text-overflow',
            'width', 'max-width', 'min-width', 'box-sizing',
            'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
            'display', 'line-height', '-webkit-line-clamp', 'line-clamp', '-webkit-box-orient',
        ];
        encodeTextClippingBaseline(element, properties);
        element.style.setProperty('min-width', '0', 'important');
        element.style.setProperty('max-width', '100%', 'important');
        element.style.setProperty('box-sizing', 'border-box', 'important');
        element.style.setProperty('overflow-wrap', 'anywhere', 'important');
        element.style.setProperty('word-break', 'break-word', 'important');
        element.style.setProperty('text-overflow', 'clip', 'important');
        const computedPosition = String(maintenanceSafeComputedStyle(element)?.position || '').toLowerCase();
        // 仅解除叶级、非绝对定位文字自身的裁切；绝不打开媒介外壳或叠层页面的 overflow。
        if ((evidence.lineClamped || evidence.vertical) && computedPosition !== 'absolute' && computedPosition !== 'fixed') {
            element.style.setProperty('overflow', 'visible', 'important');
            element.style.setProperty('overflow-y', 'visible', 'important');
            if (evidence.horizontal) element.style.setProperty('overflow-x', 'visible', 'important');
        }

        if ((evidence.noWrap || evidence.horizontal) && !evidence.verticalWriting) {
            element.style.setProperty('white-space', tag === 'pre' || tag === 'code' ? 'pre-wrap' : 'normal', 'important');
            // 解除 nowrap 后文字会新增行；即使首次采样只有横向溢出，也必须同步释放固定高度。
            element.style.setProperty('height', 'auto', 'important');
            element.style.setProperty('max-height', 'none', 'important');
        }
        if (evidence.elementWidth > Math.max(1, evidence.rootWidth) + 2) {
            element.style.setProperty('width', '100%', 'important');
        }
        if (evidence.vertical || evidence.lineClamped) {
            element.style.setProperty('height', 'auto', 'important');
            element.style.setProperty('max-height', 'none', 'important');
        }
        if (evidence.lineHeightCramped) {
            element.style.setProperty('line-height', '1.35', 'important');
        }
        if (evidence.lineClamped) {
            element.style.setProperty('-webkit-line-clamp', 'unset', 'important');
            element.style.setProperty('line-clamp', 'unset', 'important');
            element.style.setProperty('-webkit-box-orient', 'initial', 'important');
            if (String(maintenanceSafeComputedStyle(element)?.display || '').toLowerCase() === '-webkit-box') {
                element.style.setProperty('display', 'block', 'important');
            }
        }
        element.setAttribute(TEXT_CLIPPING_ITEM_ATTR, 'true');
        const clippingAncestor = evidence.clippingAncestor?.element;
        if (clippingAncestor?.style) {
            const ancestorProperties = [
                'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
                'overflow', 'overflow-x', 'overflow-y', 'box-sizing',
            ];
            encodeTextClippingBaseline(clippingAncestor, ancestorProperties);
            clippingAncestor.style.setProperty('box-sizing', 'border-box', 'important');
            if (evidence.clippingAncestor.vertical) {
                clippingAncestor.style.setProperty('height', 'auto', 'important');
                clippingAncestor.style.setProperty('max-height', 'none', 'important');
                clippingAncestor.style.setProperty('overflow-y', 'visible', 'important');
            }
            if (evidence.clippingAncestor.horizontal) {
                clippingAncestor.style.setProperty('min-width', '0', 'important');
                clippingAncestor.style.setProperty('max-width', '100%', 'important');
                clippingAncestor.style.setProperty('overflow-x', 'visible', 'important');
            }
            clippingAncestor.setAttribute(TEXT_CLIPPING_ITEM_ATTR, 'true');
        }
        repaired += 1;
    }
    if (repaired > 0) root.setAttribute(TEXT_CLIPPING_REPAIR_ATTR, String(repaired));
    return repaired;
}


function outerRabbitMirrorDetails(root) {
    if (!root) return null;
    if (root.matches?.('details') && isRabbitMirrorDetails(root)) return root;
    const nested = root.querySelector?.(':scope > details') || root.querySelector?.('details');
    return nested && isRabbitMirrorDetails(nested) ? nested : null;
}


export function bindRevealedInteractionMemory(root) {
    if (!root || root.dataset?.rmRevealClipMemory === 'true') return;
    root.dataset.rmRevealClipMemory = 'true';
    const remember = event => {
        const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
        if (!target || !root.contains?.(target) || diagnosticIsInternalUiNode(target)) return;
        const outer = outerRabbitMirrorDetails(root);
        if (outer?.querySelector?.(':scope > summary')?.contains(target)) return;
        lastRevealedInteractionByRoot.set(root, target);
    };
    root.addEventListener('change', remember, true);
    root.addEventListener('click', remember, true);
}


function revealedClipHostOptions(root) {
    const outer = outerRabbitMirrorDetails(root);
    return {
        isInternal: diagnosticIsInternalUiNode,
        isOuterDetails: node => node === outer || node === root,
        isVisible: element => {
            try { return maintenanceIsVisibleContentElement(element); }
            catch { return Number(element?.clientHeight || 0) > 1; }
        },
        lastControl: lastRevealedInteractionByRoot.get(root) || null,
    };
}


export function inspectRevealedDrawerClipping(root) {
    const hosts = collectRevealedClipHosts(root, revealedClipHostOptions(root));
    let clipped = 0;
    for (const host of hosts) {
        const style = maintenanceSafeComputedStyle(host);
        const overflowY = String(style?.overflowY || style?.overflow || host.style?.getPropertyValue?.('overflow-y') || '');
        if (shouldRelaxRevealedClipPanel({
            maxHeightPx: maintenanceCssPixelValue(style?.maxHeight),
            heightPx: maintenanceCssPixelValue(style?.height),
            overflowY,
            clientHeight: Number(host.clientHeight || 0),
            scrollHeight: Number(host.scrollHeight || 0),
            protectedSurface: maintenanceHasIntentionalMarquee(host),
        })) clipped += 1;
    }
    return { hostCount: hosts.length, clipped };
}


export function repairRevealedDrawerClipping(root) {
    const hosts = collectRevealedClipHosts(root, revealedClipHostOptions(root));
    if (!hosts.length) return { repaired: 0, reason: 'none-open' };
    let repaired = 0;
    const marked = new Set();
    const relax = element => {
        if (!element?.style || marked.has(element) || diagnosticIsInternalUiNode(element)) return 0;
        if (element === root || element === outerRabbitMirrorDetails(root)) return 0;
        if (maintenanceHasIntentionalMarquee(element)) return 0;
        const style = maintenanceSafeComputedStyle(element);
        const overflowY = String(style?.overflowY || style?.overflow || '');
        if (!shouldRelaxRevealedClipPanel({
            maxHeightPx: maintenanceCssPixelValue(style?.maxHeight),
            heightPx: maintenanceCssPixelValue(style?.height),
            overflowY,
            clientHeight: Number(element.clientHeight || 0),
            scrollHeight: Number(element.scrollHeight || 0),
            protectedSurface: false,
        })) return 0;
        encodeTextClippingBaseline(element, ['height', 'max-height', 'min-height', 'overflow', 'overflow-y', 'overflow-x']);
        element.style.setProperty('height', 'auto', 'important');
        element.style.setProperty('max-height', 'none', 'important');
        if (/(?:hidden|clip)/.test(overflowY.toLowerCase())) {
            element.style.setProperty('overflow-y', 'visible', 'important');
            const overflowX = String(style?.overflowX || '').toLowerCase();
            if (!/(?:auto|scroll|hidden|clip)/.test(overflowX)) {
                element.style.setProperty('overflow', 'visible', 'important');
            }
        }
        element.setAttribute(REVEALED_CLIP_RESCUE_ATTR, 'true');
        marked.add(element);
        return 1;
    };
    for (const host of hosts) {
        repaired += relax(host);
        let ancestor = host.parentElement;
        let hops = 0;
        while (ancestor && ancestor !== root && hops < 8) {
            if (ancestor === outerRabbitMirrorDetails(root)) break;
            repaired += relax(ancestor);
            ancestor = ancestor.parentElement;
            hops += 1;
        }
        repaired += repairMaintenanceTextClipping(host, { highConfidenceOnly: false, maxCandidates: 12 });
    }
    repaired += repairNestedDetailsPopupClipping(root, { requireOpen: true });
    if (repaired > 0) root.setAttribute(REVEALED_CLIP_RESCUE_ATTR, String(repaired));
    return { repaired, reason: repaired ? 'repaired' : 'no-clip' };
}


function maintenanceRootIsLatestAssistant(root) {
    const messageIndex = getMessageIndexFromMirrorNode(root);
    const chat = getAvailableHostChat();
    if (messageIndex < 0 || !Array.isArray(chat) || !chat[messageIndex]
        || chat[messageIndex]?.is_user || chat[messageIndex]?.is_system) return false;
    for (let index = chat.length - 1; index >= 0; index -= 1) {
        const message = chat[index];
        if (!message || message.is_user || message.is_system) continue;
        return index === messageIndex;
    }
    return false;
}


function maintenanceCurrentHighConfidenceTextRepairEligible(root) {
    if (!isCurrentRuntime() || !root?.isConnected || !root?.querySelectorAll || !isInsideChatMessage(root)) return false;
    if (!maintenanceRootIsLatestAssistant(root) || outputHostGenerationLooksActive()) return false;
    if (root.closest?.('[data-rm-pending="true"], [data-rm-awaiting-fresh-source="true"]')) return false;
    const details = getRabbitMirrorFacePosition(root)?.details
        || (root.matches?.('details') ? root : root.querySelector?.(':scope > details') || null);
    if (details && !details.hasAttribute?.('open')) return false;
    const budget = maintenanceRepairRootBudget(root);
    return !!budget.ok && budget.nodes <= 800 && budget.attributes <= 2600;
}


export function scheduleCurrentHighConfidenceTextRepair(root) {
    if (!root?.isConnected || maintenanceHighConfidenceTextCheckedRoots.has(root)
        || maintenanceHighConfidenceTextRepairFrames.has(root)) return false;
    const run = () => {
        maintenanceHighConfidenceTextRepairFrames.delete(root);
        if (!maintenanceCurrentHighConfidenceTextRepairEligible(root)) return;
        maintenanceHighConfidenceTextCheckedRoots.add(root);
        try {
            // One current, settled, bounded mirror only. This deliberately repairs just
            // high-confidence leaf text/nearest safe ancestors and never persists a scan.
            repairMaintenanceTextClipping(root, { highConfidenceOnly: true, maxCandidates: 12 });
        } catch (error) {
            console.debug('[RabbitMirror] bounded current text-clipping repair skipped:', error);
        }
    };
    if (typeof globalThis.requestAnimationFrame === 'function') {
        const frame = globalThis.requestAnimationFrame(run);
        maintenanceHighConfidenceTextRepairFrames.set(root, frame);
    } else {
        run();
    }
    return true;
}


export function cancelCurrentHighConfidenceTextRepairs() {
    if (typeof globalThis.cancelAnimationFrame === 'function') {
        for (const frame of maintenanceHighConfidenceTextRepairFrames.values()) {
            try { globalThis.cancelAnimationFrame(frame); } catch {}
        }
    }
    maintenanceHighConfidenceTextRepairFrames.clear();
    maintenanceHighConfidenceTextCheckedRoots = new WeakSet();
}



function maintenanceSourceTextMatchesCurrentMirror(value, root) {
    const wantedSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(root));
    if (!wantedSummary) return false;
    const decoded = decodeHtmlEntities(String(value || ''))
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, ' ')
        .replace(/<[^>]*>/g, ' ');
    const candidate = normalizeMaintenanceSummaryText(decoded);
    if (!candidate) return false;
    return candidate.includes(wantedSummary)
        || (candidate.length >= 8 && candidate.length >= Math.floor(wantedSummary.length * 0.65) && wantedSummary.includes(candidate));
}


function maintenanceRelevantSourceNodes(root, body, selector) {
    const nodes = diagnosticQueryContentAll(body, selector);
    if (!nodes.length) return [];
    return nodes.filter(node => {
        if (node === root || node.contains?.(root) || root?.contains?.(node)) return true;
        const snapshot = diagnosticContentSnapshot(node);
        return maintenanceSourceTextMatchesCurrentMirror(`${snapshot.text}\n${snapshot.html}`, root);
    });
}


function maintenanceRelevantThRenderNodes(root, body, relevantCodeShellNodes = []) {
    const shellSet = new Set(relevantCodeShellNodes || []);
    return diagnosticQueryContentAll(body, '.TH-render').filter(node => {
        if (node === root || node.contains?.(root) || root?.contains?.(node)) return true;
        if ([...shellSet].some(shell => node.contains?.(shell) || shell.contains?.(node))) return true;
        const snapshot = diagnosticContentSnapshot(node);
        return maintenanceSourceTextMatchesCurrentMirror(`${snapshot.text}\n${snapshot.html}`, root);
    });
}


export function diagnosticCodeRescueSummary(root) {
    const body = diagnosticMessageBody(root);
    const snapshot = diagnosticContentSnapshot(body);
    const renderedText = snapshot.text;
    const decodedRendered = decodeHtmlEntities(renderedText)
        .replace(/\u00a0/g, ' ')
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        .trim();
    const rawMessage = String(getRawAssistantMessageForRenderedRoot(root) || '');
    const decodedRaw = decodeHtmlEntities(rawMessage);
    const codeShellNodes = diagnosticQueryContentAll(body, CODE_SHELL_SELECTOR);
    const relevantCodeShellNodes = maintenanceRelevantSourceNodes(root, body, CODE_SHELL_SELECTOR);
    const codeShells = codeShellNodes.length;
    const relevantCodeShells = relevantCodeShellNodes.length;
    const relevantShellSnapshot = relevantCodeShellNodes
        .map(node => diagnosticContentSnapshot(node))
        .map(item => `${item.text}\n${item.html}`)
        .join('\n');
    const renderedMirrors = diagnosticQueryContentAll(body, 'toto[data-rabbit-mirror="true"], toto, details').length;
    const strictWhole = extractStrictWholeRabbitMirrorText(body);
    const rawHasToto = /<toto\b/i.test(decodedRaw);
    const renderedHasTotoText = /<toto\b/i.test(decodedRendered);
    const renderedHasEscapedToto = /&lt;\s*toto\b/i.test(renderedText) || renderedHasTotoText;
    const renderedHasFence = /```(?:html|xml)?/i.test(decodedRendered);
    const rawNeeds = rawMessage ? needsSanitize(decodedRaw) : false;
    const renderedNeeds = decodedRendered ? needsSanitize(decodedRendered) : false;
    const currentMirrorNeedsSanitize = relevantShellSnapshot
        ? needsSanitize(decodeHtmlEntities(relevantShellSnapshot))
        : false;
    const rawCleaned = rawNeeds ? cleanRabbitMirrorOutput(decodedRaw) : decodedRaw;
    const rawWouldChange = !!rawMessage && rawCleaned !== rawMessage && rawCleaned !== decodedRaw;
    const strictParseOk = strictWhole ? !!parseTotoFragment(cleanRabbitMirrorOutput(strictWhole)) : false;
    const messageElement = body?.closest?.('.mes, [mesid], [data-message-id], [data-messageid]');
    const externalMesid = getExternalOwnerMessageIndex(body);
    const mesid = externalMesid >= 0 ? String(externalMesid) : (messageElement?.getAttribute?.('mesid') || '(unknown)');
    const displayTextDiff = (() => {
        try {
            const index = Number.parseInt(mesid, 10);
            const chat = hostScriptModule?.chat || globalThis.chat;
            const message = Number.isInteger(index) && Array.isArray(chat) ? chat[index] : null;
            return typeof message?.extra?.display_text === 'string' && message.extra.display_text !== message?.mes;
        } catch { return false; }
    })();

    let reason = '旧全局急救调度已移除；当前兔子镜仅由逐条维修兔按用户操作处理。';
    if (renderedMirrors && !renderedHasTotoText && !relevantCodeShells) reason = '当前消息中已存在真实兔子镜 DOM；若仍异常，重点查看交互或 CSS，而非代码块恢复。';
    else if (strictWhole && strictParseOk) reason = '当前显示层是完整纯文字兔子镜，且解析测试成功，但仍未替换：优先怀疑扫描触发时机、消息 DOM 选择器或后续插件再次重绘。';
    else if (strictWhole && !strictParseOk) reason = '已命中完整纯文字兔子镜，但解析测试失败：源码边界、标签结构或清洗结果仍有问题。';
    else if (relevantCodeShells && (renderedHasTotoText || currentMirrorNeedsSanitize)) reason = '发现代码块外壳与兔子镜源码候选；若未恢复，优先检查替换目标识别或后续重绘覆盖。';
    else if (rawNeeds && !currentMirrorNeedsSanitize && !strictWhole && !relevantCodeShells) reason = '聊天原始源需要急救，但当前显示层不再呈现相同源码：可能由 display_text、显示正则或其他美化插件接管。';
    else if (renderedHasEscapedToto && !strictWhole) reason = '显示层含兔子镜标签文字，但并非“整条消息仅一个完整 toto”结构，因此严格纯文字兜底不会接管。';
    else if (renderedHasFence && !relevantCodeShells) reason = '看到三反引号文本，但宿主没有生成标准代码块节点；当前严格纯文字兜底又未命中完整 toto。';

    return {
        body, mesid, codeShells, relevantCodeShells, renderedMirrors, strictWhole: !!strictWhole, strictParseOk,
        renderedHasTotoText, renderedHasEscapedToto, renderedHasFence,
        rawHasToto, rawNeeds, renderedNeeds, currentMirrorNeedsSanitize, rawWouldChange, displayTextDiff,
        renderedLength: decodedRendered.length, rawLength: decodedRaw.length, reason,
    };
}



function cssStructuralBalance(cssText) {
    const source = String(cssText || '');
    let depth = 0;
    let minDepth = 0;
    let quote = '';
    let escaped = false;
    let inComment = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';

        if (inComment) {
            if (char === '*' && next === '/') {
                inComment = false;
                index += 1;
            }
            continue;
        }
        if (quote) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '/' && next === '*') {
            inComment = true;
            index += 1;
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '{') depth += 1;
        else if (char === '}') {
            depth -= 1;
            minDepth = Math.min(minDepth, depth);
        }
    }
    return { depth, extraClosingBrace: minDepth < 0, unterminatedString: !!quote, unterminatedComment: inComment };
}


function maintenanceRawSourceIntegrity(decodedRaw, root) {
    const isolated = extractMaintenanceMirrorSourceBySummary(decodedRaw, root);
    if (!isolated) {
        return {
            isolated: '', rawSourceBodyMissing: false, rawCssTruncated: false,
            rawBodyTagCount: 0, rawBodyTextLength: 0, rawBodyElementCount: 0,
            rawBodySemanticElementCount: 0, rawBodyVisualProgramCount: 0, rawBodyEmptyShell: false,
            sourceTruncationNoticeInstalled: !!root?.querySelector?.(`[${SOURCE_TRUNCATION_NOTICE_ATTR}]`),
        };
    }

    const styleBlocks = [...isolated.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)]
        .map(match => String(match[1] || ''));
    const cssBalance = cssStructuralBalance(styleBlocks.join('\n'));
    const withoutNonBody = isolated
        .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
        .replace(/<summary\b[^>]*>[\s\S]*?<\/summary\s*>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<\/?(?:toto|details)\b[^>]*>/gi, ' ')
        .replace(/<br\s*\/?>/gi, ' ');
    const rawBodyTagCount = (withoutNonBody.match(/<(?:div|section|article|label|input|button|p|span|h[1-6]|ul|ol|li|table|form|figure|main|header|footer|nav|img|svg|canvas)\b/gi) || []).length;
    const rawBodyText = decodeHtmlEntities(withoutNonBody.replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim();
    let parsedBodyEvidence = null;
    try {
        const parsedCandidate = findCleanMaintenanceMirrorNode(isolated, root);
        parsedBodyEvidence = parsedCandidate ? maintenanceMirrorBodyEvidence(parsedCandidate) : null;
    } catch {
        parsedBodyEvidence = null;
    }
    const rawSourceBodyMissing = (rawBodyTagCount === 0 && rawBodyText.length === 0)
        || !!parsedBodyEvidence?.highConfidenceEmptyShell;
    const rawCssTruncated = styleBlocks.length > 0 && (
        cssBalance.depth > 0
        || cssBalance.extraClosingBrace
        || cssBalance.unterminatedString
        || cssBalance.unterminatedComment
    );

    return {
        isolated,
        rawSourceBodyMissing,
        rawCssTruncated,
        rawBodyTagCount,
        rawBodyTextLength: rawBodyText.length,
        rawBodyElementCount: Number(parsedBodyEvidence?.bodyElementCount || 0),
        rawBodySemanticElementCount: Number(parsedBodyEvidence?.semanticElementCount || 0),
        rawBodyVisualProgramCount: Number(parsedBodyEvidence?.visualProgramCount || 0),
        rawBodyEmptyShell: !!parsedBodyEvidence?.highConfidenceEmptyShell,
        sourceTruncationNoticeInstalled: !!root?.querySelector?.(`[${SOURCE_TRUNCATION_NOTICE_ATTR}]`),
    };
}


export function diagnosticFullChainSummary(root, code) {
    const body = code?.body || diagnosticMessageBody(root);
    const rawMessage = String(getRawAssistantMessageForRenderedRoot(root) || '');
    const decodedRaw = decodeHtmlEntities(rawMessage);
    const snapshot = diagnosticContentSnapshot(body);
    const renderedHtml = snapshot.html;
    const renderedText = snapshot.text;
    const styleTexts = diagnosticQueryContentAll(body, 'style').map(style => String(style.textContent || '')).join('\n');
    const rawStyles = [...decodedRaw.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1] || '').join('\n');
    // 宿主/美化插件会返回多种 CSS 错误文案（property missing ':'、missing '}' 等）。
    // 只要当前消息出现其标准 CSS ERROR 前缀，就应视为源码重建信号，而不能只识别某一种报错。
    const hostCssParserErrorText = (renderedText.match(/CSS\s+ERROR\s*:\s*Error:[^\r\n]{0,320}/i)?.[0] || '').trim();
    const hostCssParserError = !!hostCssParserErrorText;
    const rawUnencodedSvgDataUri = /data:image\/svg\+xml[^,]*,(?:\s|%20)*(?:<|&lt;)svg\b/i.test(rawStyles);
    const rawCssCommentCount = (rawStyles.match(/\/\*[\s\S]*?\*\//g) || []).length;
    const rawStylesWithoutComments = stripCssComments(rawStyles);
    const rawCssIdSelectorCount = (rawStylesWithoutComments.match(/(?:^|})\s*#[A-Za-z_-][\w-]*(?=[\s:.\[>~+,{])/gm) || []).length;
    const rawInlineEvents = (decodedRaw.match(/\son[a-z]+\s*=/gi) || []).length;
    let renderedInlineEvents = 0;
    body?.querySelectorAll?.('*').forEach(element => {
        for (const attr of [...(element.attributes || [])]) {
            if (/^on[a-z]+$/i.test(attr.name)) renderedInlineEvents += 1;
        }
    });
    const cssText = `${rawStyles}\n${styleTexts}`;
    const cssRuleCount = (cssText.match(/[^@{}][^{}]*\{[^{}]*\}/g) || []).length;
    const animationCount = (cssText.match(/@keyframes\b/gi) || []).length;
    const hoverCount = (cssText.match(/:hover\b/gi) || []).length;
    const focusCount = (cssText.match(/:focus(?:-within)?\b/gi) || []).length;
    const activeCount = (cssText.match(/:active\b/gi) || []).length;
    const checkedCount = (cssText.match(/:checked\b/gi) || []).length;
    const mobileWebKit = /(?:iPhone|iPad|iPod).*AppleWebKit|AppleWebKit.*Mobile/i.test(String(globalThis.navigator?.userAgent || ''));
    const flipSourceText = `${decodedRaw}
${styleTexts}`;
    const flipEvidence = collectWebKit3DFlipEvidence(root);
    const mobile3DFlipCandidate = mobileWebKit
        && /rotateY\s*\(/i.test(flipSourceText)
        && /backface-visibility\s*:\s*hidden/i.test(flipSourceText)
        && /preserve-3d/i.test(flipSourceText)
        && (flipEvidence.webkitRotateY < flipEvidence.rotateY
            || flipEvidence.webkitBackface < flipEvidence.backface
            || flipEvidence.webkitPreserve3d < flipEvidence.preserve3d
            || flipEvidence.webkitPerspective < flipEvidence.perspective);
    const detailsCount = diagnosticQueryContentAll(body, 'details').length;
    const styleCount = diagnosticQueryContentAll(body, 'style').length;
    const scriptCount = diagnosticQueryContentAll(body, 'script').length;
    const iframeCount = diagnosticQueryContentAll(body, 'iframe').length;
    const inputCount = diagnosticQueryContentAll(body, 'input,select,textarea').length;
    const buttonCount = diagnosticQueryContentAll(body, 'button').length;
    const thRenderCount = diagnosticQueryContentAll(body, '.TH-render').length;
    const highlightedCount = diagnosticQueryContentAll(body, 'code.hljs,[data-highlighted="yes"]').length;
    const relevantCodeShellNodes = maintenanceRelevantSourceNodes(root, body, CODE_SHELL_SELECTOR);
    const relevantThRenderCount = maintenanceRelevantThRenderNodes(root, body, relevantCodeShellNodes).length;
    const relevantHighlightedCount = maintenanceRelevantSourceNodes(root, body, 'code.hljs,[data-highlighted="yes"]').length;
    const mirrorCount = getRenderedRabbitMirrorInteractionRoots(body).filter(node => !diagnosticIsInternalUiNode(node)).length;
    const scopedCount = diagnosticQueryContentAll(body, '[data-rabbit-mirror-interaction-scoped="true"]').length;
    const rescuedCount = diagnosticQueryContentAll(body, '[data-rabbit-mirror-interaction-rescued="true"]').length;
    let maintenanceModuleVersion = '';
    let maintenanceModuleMode = '';
    let maintenanceSourceAttempted = false;
    let maintenanceSourceChanged = false;
    let maintenanceSourceReason = '';
    let maintenanceFindingCount = 0;
    let maintenanceRepairOrder = '';
    let maintenanceResolvedCount = 0;
    let maintenanceRemainingCount = 0;
    const maintenanceModuleNodes = [...(body?.querySelectorAll?.('[data-rabbit-mirror-maintenance-modules]') || [])].reverse();
    for (const node of maintenanceModuleNodes) {
        try {
            const payload = JSON.parse(node.getAttribute('data-rabbit-mirror-maintenance-modules') || '{}');
            maintenanceModuleVersion = String(payload?.version || '');
            maintenanceModuleMode = String(payload?.autoSelected || payload?.mode || '');
            maintenanceSourceAttempted = !!payload?.sourceRepair?.attempted;
            maintenanceSourceChanged = !!payload?.sourceRepair?.changed;
            maintenanceSourceReason = String(payload?.sourceRepair?.reason || '');
            maintenanceFindingCount = Array.isArray(payload?.findingsBefore) ? payload.findingsBefore.length : 0;
            maintenanceRepairOrder = Array.isArray(payload?.repairOrder) ? payload.repairOrder.join(' → ') : '';
            maintenanceResolvedCount = Array.isArray(payload?.verification?.resolved) ? payload.verification.resolved.length : 0;
            maintenanceRemainingCount = Array.isArray(payload?.verification?.remaining) ? payload.verification.remaining.length : 0;
            break;
        } catch {
            // Ignore malformed historical metadata and continue to an older valid record.
        }
    }
    const rawInputCount = (decodedRaw.match(/<input\b/gi) || []).length;
    const rawLabelCount = (decodedRaw.match(/<label\b/gi) || []).length;
    const renderedLabelCount = diagnosticQueryContentAll(body, 'label').length;
    const rawUiTagCount = countRawUiTags(decodedRaw);
    const rawSourceIntegrity = maintenanceRawSourceIntegrity(decodedRaw, root);
    const renderedUiTagCount = diagnosticQueryContentAll(body, 'div,section,article,label,input,button,p,span,h1,h2,h3,h4,h5,h6,ul,ol,li,table,form,details,summary,figure,main,header,footer,nav').length;
    const primaryDetails = root?.matches?.('details') ? root : root?.querySelector?.('details');

    // 诊断页可以包含同一消息里的其它兔子镜、隐藏副本或工具节点。
    // “当前镜面的控件是否丢失”必须只比较当前 summary 对应的原始镜面与当前 root，
    // 不能再用整条 .mes_text 的 input 数量，否则别处残留的控件会把当前镜面的结构丢失遮住。
    const rawMirrorRoot = chooseMatchingRawRabbitMirrorRoot(decodedRaw, root);
    const currentMirrorScope = primaryDetails || root;
    const languageBalance = rabbitMirrorLanguageBalance(currentMirrorScope);
    const rawMirrorInputCount = rawMirrorRoot?.querySelectorAll?.('input,select,textarea')?.length || 0;
    const rawMirrorStateInputCount = rawMirrorRoot?.querySelectorAll?.('input[type="checkbox"], input[type="radio"]')?.length || 0;
    const rawMirrorLabelCount = rawMirrorRoot?.querySelectorAll?.('label')?.length || 0;
    const renderedMirrorInputCount = diagnosticQueryContentAll(currentMirrorScope, 'input,select,textarea').length;
    const renderedMirrorStateInputCount = diagnosticQueryContentAll(currentMirrorScope, 'input[type="checkbox"], input[type="radio"]').length;
    const renderedMirrorLabelCount = diagnosticQueryContentAll(currentMirrorScope, 'label').length;
    let rawMirrorInlineEvents = 0;
    rawMirrorRoot?.querySelectorAll?.('*')?.forEach(element => {
        for (const attr of [...(element.attributes || [])]) {
            if (/^on[a-z]+$/i.test(attr.name)) rawMirrorInlineEvents += 1;
        }
    });
    let renderedMirrorInlineEvents = 0;
    currentMirrorScope?.querySelectorAll?.('*')?.forEach(element => {
        if (diagnosticIsInternalUiNode(element)) return;
        for (const attr of [...(element.attributes || [])]) {
            if (/^on[a-z]+$/i.test(attr.name)) renderedMirrorInlineEvents += 1;
        }
    });
    const primarySummary = primaryDetails?.querySelector?.(':scope > summary') || primaryDetails?.querySelector?.('summary');
    const primaryRect = diagnosticRect(primaryDetails);
    const summaryRect = diagnosticRect(primarySummary);
    const primaryOpen = String(primaryDetails?.tagName || '').toLowerCase() !== 'details' || !!primaryDetails?.open;
    const renderedBodyElementCount = primaryDetails ? [...(primaryDetails.children || [])].filter(child => {
        const tag = String(child?.tagName || '').toLowerCase();
        if (!tag || tag === 'summary' || tag === 'style' || tag === 'script' || tag === 'br') return false;
        if (child.matches?.(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`) || child.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}]`)) return false;
        if (tag === 'p' && !String(child.textContent || '').trim() && !child.children?.length) return false;
        return true;
    }).length : 0;
    const renderedBodyEvidence = primaryDetails ? maintenanceMirrorBodyEvidence(primaryDetails) : null;
    // 空壳 details 的默认 margin、summary 按钮或主题样式可能让外框高度略高于 summary，
    // 不能再把“几何高度几乎相等”作为源码缺失的必要条件。
    // 同时检查当前消息的 mes、当前 swipe 与有效显示源：只要其中存在同标题完整主体，
    // 就应判为“可来源恢复”，而不是“内容从未生成”；完全找不到同标题主体时才判为空壳。
    const currentMessage = getAssistantMessageForRenderedRoot(root);
    const distinctDisplaySource = messageUsesDistinctDisplaySource(currentMessage);
    const recoverableBodySource = currentMessage
        ? findRecoverableMaintenanceMirrorSource(currentMessage, root, { displayOnly: distinctDisplaySource })
        : null;
    const renderedShellBodyMissing = !!(primaryDetails && primaryOpen && (
        renderedBodyElementCount === 0
        || renderedBodyEvidence?.highConfidenceEmptyShell
    ));
    const rawSourceBodyMissing = !!(renderedShellBodyMissing
        && !recoverableBodySource
        && (rawSourceIntegrity.rawSourceBodyMissing || !rawSourceIntegrity.isolated));
    const rawCssTruncated = !!(rawSourceIntegrity.rawSourceBodyMissing && rawSourceIntegrity.rawCssTruncated);
    const sourceTruncationNoticeInstalled = !!rawSourceIntegrity.sourceTruncationNoticeInstalled;
    const visibleBodyMissing = !!(primaryDetails && primaryOpen && code?.rawHasToto && rawUiTagCount >= 6 && (
        renderedBodyElementCount === 0
        || (primaryRect.height > 0 && primaryRect.height <= summaryRect.height + 10)
    ));
    const repairedDataUriSource = rescueDamagedDataUriRabbitMirrorOutput(decodedRaw);
    const damagedDataUriCandidate = repairedDataUriSource !== decodedRaw;
    const controlsLost = rawMirrorInputCount > 0 && renderedMirrorInputCount === 0;
    const stateControlsLost = rawMirrorStateInputCount > 0 && renderedMirrorStateInputCount === 0;
    const labelsLost = rawMirrorLabelCount > 0 && renderedMirrorLabelCount === 0;
    const severeStructureLoss = rawUiTagCount >= 8 && renderedUiTagCount + 5 < rawUiTagCount
        && renderedUiTagCount < Math.ceil(rawUiTagCount * 0.55);
    const structureTruncated = damagedDataUriCandidate && (controlsLost || labelsLost || severeStructureLoss);
    const rawMirrorSourcePresent = !!code?.rawHasToto || /<details\b/i.test(decodedRaw);
    const sourceCandidate = !sourceTruncationNoticeInstalled && ((rawMirrorSourcePresent && (
        !!code?.rawNeeds
        || !!code?.currentMirrorNeedsSanitize
        || Number(code?.relevantCodeShells || 0) > 0
        || relevantThRenderCount > 0
        || relevantHighlightedCount > 0
        || visibleBodyMissing
        || severeStructureLoss
        || stateControlsLost
    )) || !!(renderedShellBodyMissing && recoverableBodySource));
    const currentMirrorRenderedEscapedTags = !!code?.currentMirrorNeedsSanitize
        || Number(code?.relevantCodeShells || 0) > 0
        || !!code?.strictWhole;
    // 原始聊天内容会永久保留未清洗源码；这本身不是显示故障。
    // 只有当前显示层仍存在 CSS ERROR、代码壳、转义源码或完整纯文字候选时，才判定源码仍被遮蔽。
    const sourceObscured = sourceCandidate && (
        hostCssParserError
        || relevantThRenderCount > 0
        || relevantHighlightedCount > 0
        || Number(code?.relevantCodeShells || 0) > 0
        || !!code?.strictWhole
        || !!code?.currentMirrorNeedsSanitize
        || visibleBodyMissing
        || severeStructureLoss
        || stateControlsLost
        || rawSourceBodyMissing
    );
    const sanitizerStyleDropCount = Number.parseInt(root?.getAttribute?.(RABBIT_MIRROR_SANITIZER_STYLE_DROP_ATTR) || '0', 10) || 0;
    const sanitizerImportStrippedCount = Number.parseInt(root?.getAttribute?.(RABBIT_MIRROR_SANITIZER_IMPORT_STRIPPED_ATTR) || '0', 10) || 0;
    let verdict = '当前链路未发现单一高置信故障点。';
    if (sanitizerStyleDropCount > 0) verdict = `高置信：安全净化器删除了 ${sanitizerStyleDropCount} 份仍含本地规则的样式表；外框、默认隐藏态或交互显示规则可能同时丢失。`;
    else if (sourceTruncationNoticeInstalled) verdict = '原始输出缺少正文，维修兔已显示截断说明；缺失内容无法从现有源码恢复，需要重新生成该条。';
    else if (rawCssTruncated) verdict = '高置信：原始兔子镜在 <style> 中途截断，正文未生成；现有源码无法恢复缺失内容，只能显示截断说明并重新生成该条。';
    else if (rawSourceBodyMissing) verdict = '高置信：原始兔子镜只包含样式或空壳，没有可显示的正文主体；现有源码无法补回不存在的内容。';
    else if (structureTruncated) verdict = '高置信：损坏的 SVG Data URI 破坏了 inline style 属性边界，导致后续 DOM 被截断；应移除该背景声明并用原始源码临时重绘显示层。';
    else if (stateControlsLost) verdict = '高置信：当前兔子镜原始源码存在 checkbox/radio，但当前镜面的状态控件已在宿主渲染中丢失；应从同标题原始镜面安全重建当前 DOM，再恢复其交互。';
    else if (damagedDataUriCandidate) verdict = '检测到疑似损坏的 SVG Data URI；当前结构尚未达到高置信截断阈值，但建议优先执行保主体清洗。';
    else if (sourceCandidate && hostCssParserError && rawUnencodedSvgDataUri) verdict = '高置信：宿主 CSS 解析器在原始 SVG Data URI 之后中断，后续 HTML 被代码壳接管；源码恢复时应先编码 SVG 数据并重绘当前显示层。';
    else if (sourceCandidate && hostCssParserError && rawCssIdSelectorCount > 0) verdict = '高置信：宿主 CSS 解析器在状态 ID 选择器附近中断，后续 HTML 被代码壳接管；源码恢复时应使用兼容选择器并重绘当前显示层。';
    else if (sourceCandidate && hostCssParserError && rawCssCommentCount > 0) verdict = '高置信：宿主 CSS 解析器在注释边界附近中断，后续 HTML 被代码壳接管；源码恢复时应移除 CSS 注释并重绘当前显示层。';
    else if (sourceCandidate && hostCssParserError) verdict = '宿主 CSS 解析失败并遮蔽了原始兔子镜源码；应先执行 CSS 兼容清洗，再重绘当前显示层。';
    else if (sourceCandidate && relevantThRenderCount) verdict = '原始兔子镜源码被 TH-render 代码壳接管；应检查源码恢复是否在其重绘后再次执行。';
    else if (sourceCandidate && relevantHighlightedCount) verdict = '原始兔子镜源码进入语法高亮代码壳；应检查源码恢复触发时机或后续重绘覆盖。';
    else if (sourceCandidate && sourceObscured) verdict = '原始源需要恢复；请使用当前条目的维修兔，无法恢复时生成全链路诊断。';
    else if (code?.strictWhole && code?.strictParseOk) verdict = '显示层是可解析的完整纯文字兔子镜，但替换未发生；重点检查消息选择器与观察器触发。';
    else if (mirrorCount > 0 && Number(code?.relevantCodeShells || 0) === 0) verdict = '兔子镜主体已经渲染；故障更可能位于 CSS、可读性或交互链。';
    else if (rawInlineEvents > renderedInlineEvents) verdict = '原始源码中的内联事件在渲染后减少，说明宿主净化器删除了部分事件属性。';
    return {
        rawHtml: /<\/?[a-z][^>]*>/i.test(decodedRaw),
        rawToto: /<toto\b/i.test(decodedRaw),
        rawFence: /```(?:html|xml)?/i.test(decodedRaw),
        renderedEscapedTags: /&lt;\/?[a-z]/i.test(renderedHtml) || /<toto\b/i.test(renderedText),
        currentMirrorRenderedEscapedTags,
        detailsCount, styleCount, scriptCount, iframeCount, inputCount, buttonCount,
        cssRuleCount, animationCount, hoverCount, focusCount, activeCount, checkedCount,
        rawInlineEvents, renderedInlineEvents, thRenderCount, highlightedCount,
        relevantThRenderCount, relevantHighlightedCount, relevantCodeShellCount: Number(code?.relevantCodeShells || 0),
        mirrorCount, scopedCount, rescuedCount, sourceCandidate, sourceObscured,
        sanitizerStyleDropCount, sanitizerImportStrippedCount,
        maintenanceModuleVersion, maintenanceModuleMode, maintenanceSourceAttempted, maintenanceSourceChanged, maintenanceSourceReason,
        maintenanceFindingCount, maintenanceRepairOrder, maintenanceResolvedCount, maintenanceRemainingCount,
        hostCssParserError, hostCssParserErrorText, rawUnencodedSvgDataUri, rawCssCommentCount, rawCssIdSelectorCount,
        rawInputCount, rawLabelCount, renderedLabelCount, rawUiTagCount, renderedUiTagCount,
        rawMirrorInputCount, rawMirrorStateInputCount, rawMirrorLabelCount,
        renderedMirrorInputCount, renderedMirrorStateInputCount, renderedMirrorLabelCount,
        languageForeignDominant: !!languageBalance.foreignDominant,
        languageHanChars: Number(languageBalance.hanChars || 0),
        languageLatinLetters: Number(languageBalance.latinLetters || 0),
        languageForeignWordCount: Number(languageBalance.foreignWordCount || 0),
        languageForeignWords: Array.isArray(languageBalance.foreignWords) ? languageBalance.foreignWords : [],
        rawMirrorInlineEvents, renderedMirrorInlineEvents,
        damagedDataUriCandidate, controlsLost, stateControlsLost, labelsLost, severeStructureLoss, structureTruncated,
        visibleBodyMissing, rawSourceBodyMissing, rawCssTruncated, sourceTruncationNoticeInstalled,
        rawBodyTagCount: rawSourceIntegrity.rawBodyTagCount, rawBodyTextLength: rawSourceIntegrity.rawBodyTextLength,
        rawBodyElementCount: rawSourceIntegrity.rawBodyElementCount,
        rawBodySemanticElementCount: rawSourceIntegrity.rawBodySemanticElementCount,
        rawBodyVisualProgramCount: rawSourceIntegrity.rawBodyVisualProgramCount,
        rawBodyEmptyShell: rawSourceIntegrity.rawBodyEmptyShell,
        renderedBodyElementCount,
        renderedBodyTextLength: Number(renderedBodyEvidence?.textLength || 0),
        renderedBodySemanticElementCount: Number(renderedBodyEvidence?.semanticElementCount || 0),
        renderedBodyVisualProgramCount: Number(renderedBodyEvidence?.visualProgramCount || 0),
        renderedBodyEmptyShell: !!renderedBodyEvidence?.highConfidenceEmptyShell,
        recoverableBodySource: recoverableBodySource?.label || '', mobile3DFlipCandidate, verdict,
    };
}


function diagnosticIndependentApiRequestSnapshot() {
    try {
        const value = JSON.parse(localStorage.getItem('rabbit_mirror_independent_api_last_request_v2') || 'null');
        if (!value || typeof value !== 'object') return null;
        return value;
    } catch {
        return null;
    }
}


function diagnosticIndependentTerminalFields(value) {
    const requestCount = value?.requestCount === 0 || value?.requestCount === 1 ? value.requestCount : '?';
    const terminalFace = Number.isInteger(value?.terminalFace) && value.terminalFace >= 1 && value.terminalFace <= 5 ? value.terminalFace : '(无)';
    const protocolErrorCode = DIAGNOSTIC_MULTIFACE_PROTOCOL_CODES.has(value?.protocolErrorCode) ? value.protocolErrorCode : '(无或未知)';
    const protocolOffset = Number.isSafeInteger(value?.protocolOffset) && value.protocolOffset >= 0 ? value.protocolOffset : '(无)';
    return `requestCount=${requestCount} terminalFace=${terminalFace} protocolErrorCode=${protocolErrorCode} protocolOffset=${protocolOffset}`;
}


function diagnosticIndependentSelectionFields(value) {
    if (!value || typeof value !== 'object') return [];
    // This is a bounded view of the existing selection receipt, not another
    // library read or evidence that the adapter/provider used those materials.
    const recorded = Array.isArray(value.faces) && value.faces.length ? value.faces : [value];
    const declared = Number.isInteger(value.faceCount) && value.faceCount >= 1 && value.faceCount <= 5 ? value.faceCount : 1;
    const count = Math.min(5, Math.max(recorded.length, declared));
    const counts = ids => {
        if (!Array.isArray(ids)) return '未记录';
        if (ids.length > 8) return '未知（超过8项）';
        let builtin = 0;
        let external = 0;
        for (const id of ids) {
            if (typeof id !== 'string' || id.length > 2048 || !id.trim()) return '未知（记录无效）';
            if (id.startsWith('ext:')) external += 1;
            else builtin += 1;
        }
        return `内置${builtin}/外部${external}`;
    };
    const lines = ['选材记录（最近请求，不一定对应当前镜面；不等于最终发送或模型遵从）：'];
    for (let index = 0; index < count; index += 1) {
        const face = recorded[index];
        const visual = face?.forcedVisualScenery === true ? '是' : face?.forcedVisualScenery === false ? '否' : '未记录';
        const presentation = face?.presentationMode ? `；呈现=${face.presentationMode === 'text' ? '文本' : 'HTML'}；文本类 ${counts(face.textIds || [])}` : '';
        lines.push(`第${index + 1}面：主题 ${counts(face?.themeIds)}；形式 ${counts(face?.formatIds)}；动态视觉固定=${visual}${presentation}`);
    }
    if (recorded.length > 5) lines.push('选材记录超过展示上限，最多展示5面。');
    lines.push('外部预取与最终请求体：未记录独立验证证据；选材记录不能证明已发送或模型采用。');
    return lines;
}


function buildInteractionDiagnosticText(root, state, phase = 'capture complete') {
    const inputs = diagnosticQueryContentAll(root, 'input[type="checkbox"], input[type="radio"]').slice(0, 8);
    const labels = diagnosticQueryContentAll(root, 'label');
    const targets = diagnosticCollectTargets(root);
    const routes = diagnosticRouteSummary(root);
    const checkedDepth = maintenanceCheckedInteractionDepth(root);
    const pseudoDepth = maintenancePseudoInteractionDepth(root);
    const reachability = maintenanceReachableInteractionEvidence(
        root,
        routes,
        checkedDepth,
        pseudoDepth,
        getRawAssistantMessageForRenderedRoot(root),
    );
    const mobileLayout = inspectMaintenanceMobileLayout(root);
    const viewportLayout = inspectMaintenanceViewportLayout(root);
    const nestedDetailsPopupCandidateCount = findNestedDetailsPopupClippingCandidates(root).length;
    const textContrastCandidateCount = findSevereTextContrastCandidates(root).length;
    const mobileInlineAnnotationCandidateCount = findMobileInlineAnnotationCandidates(root).length;
    const structuredStaticDisclosureCandidateCount = findStructuredStaticDisclosureCandidates(root).length;
    const fillInChoiceCandidateCount = findFillInChoiceCandidates(root)
        .reduce((sum, candidate) => sum + Number(candidate.blanks?.length || 0), 0);
    const title = diagnosticCompactText(root.querySelector('summary')?.textContent, 64);
    const code = diagnosticCodeRescueSummary(root);
    const full = diagnosticFullChainSummary(root, code);
    const independentRequest = diagnosticIndependentApiRequestSnapshot();
    const lines = [
        `兔子镜小剧场 全链路诊断`,
        `运行版本: ${INTERACTION_DIAGNOSTIC_VERSION}`,
        `标题: ${title || '(未渲染 summary／可能仍是代码块或纯文字)'}`,
        `阶段: ${phase}`,
        `诊断模式: 一次性全链路诊断（已自动停止）`,
        `控件验证: 隐藏隔离副本（不点击、不派发事件、不修改当前页面真实控件）`,
        `维修兔: ${isMaintenanceRabbitEnabled() ? 'ON（逐条手动巡逻）' : 'OFF'}`,
        `旧全局急救链: 已合并停用`,
        `消息 mesid: ${code.mesid}`,
        `根节点: ${diagnosticElementName(root)} / connected=${!!root.isConnected}`,
        '',
        '[0. 独立 API 最近一次实际请求]',
        independentRequest ? `状态=${independentRequest.ok ? 'success' : 'failed'} HTTP=${independentRequest.status || '?'} model=${independentRequest.model || '(无)'}` : '（暂无独立 API实际生成记录）',
        independentRequest ? `profile=${independentRequest.profile || '(无)'} systemMessage=${!!independentRequest.systemMessageSent} temperatureConfigured=${independentRequest.configuredTemperature ?? '(无)'} temperatureSent=${!!independentRequest.temperatureSent}` : '',
        independentRequest ? `tokenField=${independentRequest.tokenField || '(无)'} stream=${!!independentRequest.streamSent} remembered=${independentRequest.rememberedProfile || '(无)'} attempts=${Array.isArray(independentRequest.attempts) ? independentRequest.attempts.map(item => `${item.profile}:${item.status}`).join(' -> ') : '(无)'}` : '',
        independentRequest ? diagnosticIndependentTerminalFields(independentRequest) : '',
        independentRequest ? `samplingMode=${independentRequest.samplingMode || '(无)'} executionLockChars=${Number(independentRequest.executionLockChars || 0)}` : '',
        independentRequest ? `首面选材名称：themes=${Array.isArray(independentRequest.themeLabels) ? independentRequest.themeLabels.join(' + ') : '(无)'} formats=${Array.isArray(independentRequest.formatLabels) ? independentRequest.formatLabels.join(' + ') : '(无)'}` : '',
        ...diagnosticIndependentSelectionFields(independentRequest),
        '',
        '[1. HTML／Markdown 输入层]',
        `原始源含HTML=${full.rawHtml} 含toto=${full.rawToto} 含三反引号=${full.rawFence}`,
        `显示层仍含转义标签=${full.renderedEscapedTags}`,
        '',
        '[2. DOM 渲染层]',
        `details=${full.detailsCount} style=${full.styleCount} script=${full.scriptCount} iframe=${full.iframeCount}`,
        `buttons=${full.buttonCount} inputs=${full.inputCount} rabbitMirrors=${full.mirrorCount}`,
        `原始 inputs=${full.rawInputCount} labels=${full.rawLabelCount} UI标签≈${full.rawUiTagCount}`,
        `渲染 inputs=${full.inputCount} labels=${full.renderedLabelCount} UI标签≈${full.renderedUiTagCount}`,
        `非法嵌套label=${diagnosticQueryContentAll(root, 'label label').length} 结构修复=${root.getAttribute?.(NESTED_LABEL_STRUCTURE_RESCUE_ATTR) || '0'}`,
        `当前镜面状态控件 原始=${full.rawMirrorStateInputCount ?? 0} 渲染=${full.renderedMirrorStateInputCount ?? 0} 丢失=${!!full.stateControlsLost}`,
        `SVG Data URI损坏候选=${full.damagedDataUriCandidate} 结构截断=${full.structureTruncated}`,
        `原始源码主体缺失=${!!full.rawSourceBodyMissing} 空结构壳=${!!full.rawBodyEmptyShell} CSS中途截断=${!!full.rawCssTruncated} 截断说明=${!!full.sourceTruncationNoticeInstalled}`,
        `原始主体 文本=${full.rawBodyTextLength ?? 0} 元素=${full.rawBodyElementCount ?? 0} 语义/媒体=${full.rawBodySemanticElementCount ?? 0} 视觉程序=${full.rawBodyVisualProgramCount ?? 0}`,
        `展开后主体缺失=${full.visibleBodyMissing} 空结构壳=${!!full.renderedBodyEmptyShell} 主体子节点=${full.renderedBodyElementCount ?? 0} 文本=${full.renderedBodyTextLength ?? 0}`,
        `可见语言 英文主导=${!!full.languageForeignDominant} 中文字符=${full.languageHanChars ?? 0} 英文字母=${full.languageLatinLetters ?? 0} 英文词≈${full.languageForeignWordCount ?? 0} 示例=${Array.isArray(full.languageForeignWords) && full.languageForeignWords.length ? full.languageForeignWords.slice(0, 8).join('/') : '(无)'}`,
        '',
        '[3. CSS 能力层]',
        `rules≈${full.cssRuleCount} keyframes=${full.animationCount}`,
        `hover=${full.hoverCount} focus=${full.focusCount} active=${full.activeCount} checked=${full.checkedCount}`,
        `宿主CSS解析错误=${full.hostCssParserError} 原始未编码SVG=${full.rawUnencodedSvgDataUri} 原始CSS注释=${full.rawCssCommentCount} 原始#ID选择器=${full.rawCssIdSelectorCount}`,
        `宿主CSS错误摘要=${full.hostCssParserErrorText || '(无)'}`,
        `严重低对比文字候选=${textContrastCandidateCount} 已维修=${root.getAttribute?.(TEXT_CONTRAST_RESCUE_ROOT_ATTR) || '0'}`,
        '',
        '[4. 净化器／属性保留层]',
        `原始内联事件=${full.rawInlineEvents} 渲染后内联事件=${full.renderedInlineEvents}`,
        `script保留=${full.scriptCount} iframe保留=${full.iframeCount}`,
        `CSS import仅移除=${full.sanitizerImportStrippedCount || 0} 整份本地style被删=${full.sanitizerStyleDropCount || 0}`,
        '',
        '[5. 宿主／美化重绘层]',
        `TH-render=${full.thRenderCount} highlightedCode=${full.highlightedCount}`,
        `当前镜面相关 TH-render=${full.relevantThRenderCount || 0} highlightedCode=${full.relevantHighlightedCount || 0} codeShells=${full.relevantCodeShellCount || 0}`,
        `源码恢复候选=${full.sourceCandidate} 源码被显示层遮蔽=${full.sourceObscured}`,
        '',
        '[6. 兔子镜小剧场急救安装层]',
        `interactionScoped=${full.scopedCount} interactionRescued=${full.rescuedCount}`,
        `maintenanceVersion=${full.maintenanceModuleVersion || '(无)'} mode=${full.maintenanceModuleMode || '(无)'}`,
        `findings=${full.maintenanceFindingCount || 0} repairOrder=${full.maintenanceRepairOrder || '(无)'}`,
        `verifiedResolved=${full.maintenanceResolvedCount || 0} verifiedRemaining=${full.maintenanceRemainingCount || 0}`,
        `sourceRepair attempted=${!!full.maintenanceSourceAttempted} changed=${!!full.maintenanceSourceChanged}`,
        `sourceRepair reason=${full.maintenanceSourceReason || '(无)'}`,
        '',
        `[全链路初步判断] ${full.verdict}`,
        '',
        '[7. 代码块／纯文字恢复链]',
        `标准代码外壳 codeShells=${code.codeShells} 当前镜面相关=${code.relevantCodeShells || 0}`,
        `已渲染兔子镜节点 renderedMirrors=${code.renderedMirrors}`,
        `显示层含 toto 标签文字=${code.renderedHasTotoText}`,
        `显示层含转义/可见 toto=${code.renderedHasEscapedToto}`,
        `显示层含三反引号=${code.renderedHasFence}`,
        `完整纯文字 toto 候选=${code.strictWhole} parseOk=${code.strictParseOk}`,
        `原始消息含 toto=${code.rawHasToto} needsSanitize=${code.rawNeeds} wouldChange=${code.rawWouldChange}`,
        `显示层 needsSanitize=${code.renderedNeeds} 当前镜面 needsSanitize=${!!code.currentMirrorNeedsSanitize} display_text与mes不同=${code.displayTextDiff}`,
        `长度 raw=${code.rawLength} renderedText=${code.renderedLength}`,
        `[代码块初步判断] ${code.reason}`,
        '',
        '[8. 交互恢复链]',
        `labels=${labels.length} inputs=${inputs.length} hiddenCandidates=${targets.length}`,
        `相邻隐藏组 entries=${routes.adjacent} listener=${root.dataset.rabbitMirrorAdjacentHiddenGroupFallback || 'false'}`,
        `双层状态 entries=${routes.layers} listener=${root.dataset.rabbitMirrorRenderedStateLayerFallback || 'false'}`,
        `label内隐藏 entries=${routes.labelInternal} listener=${root.dataset.rabbitMirrorLabelInternalHiddenFallback || 'false'}`,
        `label后置结果 entries=${routes.labelAdjacent} listener=${root.dataset.rabbitMirrorLabelAdjacentResultFallback || 'false'}`,
        `遮罩揭示 entries=${routes.maskReveal} listener=${routes.maskReveal ? 'true' : 'false'}`,
        `列表详情 entries=${routes.listDetail} listener=${root.dataset.rabbitMirrorRenderedListDetailFallback || 'false'}`,
        `状态兄弟映射 entries=${routes.stateSibling} listener=${root.dataset.rabbitMirrorCssStateSiblingFallback || 'false'}`,
        `跨层伪类状态 entries=${routes.stateCrossTree} listener=${routes.stateCrossTree ? 'true' : 'false'}`,
        `按钮后置内容 entries=${routes.buttonAdjacent} listener=${root.dataset.rabbitMirrorButtonAdjacentHiddenFallback || 'false'}`,
        `可点击后置内容 entries=${routes.clickableAdjacent} listener=${root.dataset.rabbitMirrorClickableAdjacentHiddenFallback || 'false'}`,
        `可点击画面弹层 entries=${routes.clickablePopup} listener=${root.dataset.rabbitMirrorClickableAdjacentPopupFallback || 'false'}`,
        `ID目标显隐 entries=${routes.checkedIdTarget} listener=${root.dataset.rabbitMirrorCheckedIdTargetFallback || 'false'}`,
        `focus→checked entries=${routes.focusToChecked} listener=${routes.focusToChecked ? 'true' : 'false'}`,
        `CSS状态规则 entries=${routes.checkedTextRule} listener=${routes.checkedTextRule ? 'true' : 'false'}`,
        `checked缺失控制类恢复 entries=${routes.missingCheckedClass} listener=${routes.missingCheckedClass ? 'true' : 'false'}`,
        `跨父层checked兜底 entries=${routes.crossParentChecked} listener=${routes.crossParentChecked ? 'true' : 'false'}`,
        `全选联动兜底 entries=${routes.checkedHasState} listener=${routes.checkedHasState ? 'true' : 'false'}`,
        `跨容器:has状态桥接 entries=${routes.detachedCheckedHas} listener=${routes.detachedCheckedHas ? 'true' : 'false'}`,
        `双向画面切换 entries=${routes.pairedCheckedState} listener=${routes.pairedCheckedState ? 'true' : 'false'}`,
        `叠层正文互斥 entries=${routes.exclusiveStackedState} listener=${routes.exclusiveStackedState ? 'true' : 'false'}`,
        `频道旋钮循环 entries=${routes.channelDialCycle} listener=${routes.channelDialCycle ? 'true' : 'false'}`,
        `单向checked回退 entries=${routes.reversibleChecked} listener=${routes.reversibleChecked ? 'true' : 'false'}`,
        `radio同组恢复 groups=${routes.radioGroups} listener=${routes.radioGroups ? 'true' : 'false'}`,
        `radio可逆返回 groups=${routes.reversibleRadio} listener=${routes.reversibleRadio ? 'true' : 'false'} last=${root.getAttribute?.(REVERSIBLE_RADIO_LAST_ATTR) || '(尚未再次点按已选项)'}`,
        `radio取消程序恢复 entries=${routes.radioReset} listener=${routes.radioReset ? 'true' : 'false'} last=${root.getAttribute?.(RAW_RADIO_RESET_LAST_ATTR) || '(尚未点击验证)'}`,
        `checked交互深度 rules=${checkedDepth.checkedRuleCount} selectionOnly=${checkedDepth.selectionStyleRuleCount} secondLayer=${checkedDepth.meaningfulCheckedRuleCount} unresolved=${checkedDepth.unresolvedCheckedRuleCount || 0} fallback=${checkedDepth.selectionOnlyFallbackCount}`,
        `checked内层正文残留兜底 entries=${routes.nestedCheckedContent || 0} listener=${routes.nestedCheckedContent ? 'true' : 'false'}`,
        `伪类交互深度 rules=${pseudoDepth.pseudoRuleCount} visualOnly=${pseudoDepth.visualOnlyPseudoRuleCount} secondLayer=${pseudoDepth.meaningfulPseudoRuleCount}`,
        `可达内容交互 elements=${reachability.contentInteractiveElementCount} routes=${reachability.installedInteractionRouteCount} missing=${reachability.noInteractionStructure}`,
        `内部details替换承载 patches=${root.dataset.rabbitMirrorNestedDetailsReplacement || '0'}`,
        `原始Hover触屏兜底 entries=${root.dataset.rabbitMirrorRawHoverFallback || '0'}`,
        `触屏Hover候选 targets=${routes.touchHoverEligible} active=${routes.touchHoverActive} listener=${root.dataset.rabbitMirrorTouchHoverFallback || 'false'}`,
        `展开透明保全 entries=${routes.expandedOpacity} listener=${routes.expandedOpacity ? 'true' : 'false'}`,
        `容器内揭示 entries=${routes.containerReveal} listener=${root.dataset.rabbitMirrorContainerInternalRevealFallback || 'false'}`,
        `元素自变化 entries=${routes.selfMutation} listener=${root.dataset.rabbitMirrorSelfMutationFallback || 'false'}`,
        `类名状态程序 entries=${routes.classStateProgram} listener=${routes.classStateProgram ? 'true' : 'false'}`,
        `脚本时间线恢复 entries=${routes.scriptTimeline} listener=${routes.scriptTimeline ? 'true' : 'false'}`,
        `CSS注释保全 entries=${routes.cssCommentRepair} listener=${routes.cssCommentRepair ? 'true' : 'false'}`,
        `安全状态程序 entries=${routes.changeProgram} listener=${routes.changeProgram ? 'true' : 'false'}`,
        `护照／证件翻页 entries=${routes.passportDocument} listener=${routes.passportDocument ? 'true' : 'false'}`,
        `装饰覆盖层穿透 entries=${routes.decorativeOverlayPassThrough} listener=${routes.decorativeOverlayPassThrough ? 'true' : 'false'}`,
        `无label focus-within持久桥接 entries=${routes.focusWithinPersistent} listener=${routes.focusWithinPersistent ? 'true' : 'false'} last=${root.dataset.rabbitMirrorFocusWithinPersistentLast || '(尚未点击验证)'}`,
        `无label控件宿主 entries=${routes.unlabeledChecked} listener=${routes.unlabeledChecked ? 'true' : 'false'} last=${root.dataset.rabbitMirrorUnlabeledCheckedLast || '(尚未点击验证)'}`,
        `有label控件安全副本实测 entries=${routes.labeledCheckedVerify} last=${root.getAttribute?.(LABELED_CHECKED_VERIFY_LAST_ATTR) || '(尚未安全验证)'}`,
        `缺失分支兜底 entries=${routes.selectionFallback} listener=${routes.selectionFallback ? 'true' : 'false'}`,
        `disabled选择恢复 groups=${routes.disabledChoice} listener=${routes.disabledChoice ? 'true' : 'false'}`,
        `无动作按钮兜底 entries=${routes.inertAction} listener=${routes.inertAction ? 'true' : 'false'}`,
        `静态抉择选择 entries=${routes.staticChoiceSelection} listener=${routes.staticChoiceSelection ? 'true' : 'false'}`,
        `结构化静态分段 candidates=${structuredStaticDisclosureCandidateCount} entries=${routes.structuredStaticDisclosure} listener=${routes.structuredStaticDisclosure ? 'true' : 'false'}`,
        `填空候选恢复 candidates=${fillInChoiceCandidateCount} entries=${routes.fillInChoice} listener=${routes.fillInChoice ? 'true' : 'false'}`,
        `iOS 3D翻面兼容 patches=${routes.webkit3dFlip} evidence=${formatWebKit3DFlipEvidence(root)}`,
        `label fallback=${root.dataset.rabbitMirrorLabelFallback || root.dataset.rabbitMirrorCheckedFallback || root.dataset.rabbitMirrorInteractionFallback || 'unknown'}`,
        '',
        '[9. 手机端排版／内容承载]',
        `viewportWidth=${mobileLayout.viewportWidth || 0} narrow=${!!mobileLayout.narrowViewport} candidates=${mobileLayout.candidateCount || 0}`,
        `overflow=${mobileLayout.horizontalOverflowCount || 0} fixedWidth=${mobileLayout.fixedWidthCount || 0} grid=${mobileLayout.gridCount || 0} matrix=${mobileLayout.matrixCount || 0} flex=${mobileLayout.flexCount || 0}`,
        `multiColumn=${mobileLayout.multiColumnCount || 0} media=${mobileLayout.mediaCount || 0} stateContent=${mobileLayout.stateContentCount || 0} squeezedText=${mobileLayout.squeezedTextCount || 0} underfill=${mobileLayout.underfillCount || 0}`,
        `护照／证件内页=${mobileLayout.passportDocumentCount || 0} repaired=${root.getAttribute?.(PASSPORT_DOCUMENT_RESCUE_ATTR) || '0'}`,
        `剖面／分层保形=${mobileLayout.sectionStackCount || 0}`,
        `电视／终端屏幕保形=${mobileLayout.screenShellCount || 0}`,
        `内部details弹出结果裁切=${nestedDetailsPopupCandidateCount} repaired=${root.getAttribute?.(NESTED_DETAILS_POPUP_COUNT_ATTR) || '0'}`,
        `手机端行内批注=${mobileInlineAnnotationCandidateCount} repaired=${root.getAttribute?.(MOBILE_INLINE_ANNOTATION_COUNT_ATTR) || '0'}`,
        `动态视觉长正文越界=${mobileLayout.visualSceneryOverflowCount || 0} repaired=${root.getAttribute?.(VISUAL_SCENERY_MOBILE_OVERFLOW_COUNT_ATTR) || '0'}`,
        `当前窗口压窄=${viewportLayout.squeezedCount || 0} 裁切=${viewportLayout.overflowCount || 0} x=${viewportLayout.overflowXCount || 0} y=${viewportLayout.overflowYCount || 0} pointer=${viewportLayout.pointerBlockedCount || 0}`,
        (() => {
            let hclip = {};
            try { hclip = JSON.parse(root.getAttribute?.(HCLIP_REPORT_ATTR) || '{}') || {}; } catch { hclip = {}; }
            const target = Array.isArray(hclip.targets) && hclip.targets.length ? hclip.targets[0] : null;
            const detail = target
                ? `；目标=${target.target} 阶段=${target.stage} overflow-x ${target.before?.overflowX}→${target.after?.overflowX} overflow-y ${target.before?.overflowY}→${target.after?.overflowY} scrollWidth ${target.before?.scrollWidth}→${target.after?.scrollWidth} clientWidth ${target.before?.clientWidth}→${target.after?.clientWidth}`
                : '';
            return `横向裁切 horizontalClipCandidates=${hclip.candidates || 0} horizontalClipRepaired=${hclip.repaired || 0} scrollRepaired=${hclip.scrollRepaired || 0} semanticEnsembleCandidates=${hclip.semanticEnsembleCandidates || 0} semanticEnsembleFitted=${hclip.semanticEnsembleFitted || 0} horizontalClipSkippedDecorative=${hclip.skippedDecorative || 0} horizontalClipSkippedExistingScroller=${hclip.skippedExistingScroller || 0} horizontalClipSkippedUncertain=${hclip.skippedUncertain || 0}${detail}`;
        })(),
        `repairScope=${root.getAttribute?.(MOBILE_LAYOUT_SCOPE_ATTR) || '(无)'} mobilePatched=${root.getAttribute?.(MOBILE_LAYOUT_RESCUE_COUNT_ATTR) || '0'} viewportPatched=${root.getAttribute?.(VIEWPORT_LAYOUT_COUNT_ATTR) || '0'}`,
        '',
        '[捕获事件]',
    ];

    if (!state.events.length) lines.push('（未捕获 click / input / change）');
    else state.events.slice(-16).forEach(item => lines.push(item));

    lines.push('', '[时间快照]');
    if (!state.snapshots.length) lines.push('（无）');
    else state.snapshots.forEach(item => lines.push(item));

    lines.push('', '[输入控件]');
    if (!inputs.length) lines.push('（无）');
    inputs.forEach((input, index) => {
        const label = diagnosticFindAssociatedLabel(root, input);
        lines.push(
            `${index}: ${diagnosticElementName(input)} type=${input.type} checked=${!!input.checked}`,
            `   label=${!!label} text="${diagnosticCompactText(label?.textContent, 68)}"`,
            `   attrs: route=${getRenderedInputRoute(input) || 'none'} adjacent=${input.getAttribute(RENDERED_ADJACENT_HIDDEN_GROUP_RESCUE_ATTR) || 'false'} layer=${input.getAttribute(RENDERED_STATE_LAYER_RESCUE_ATTR) || 'false'} labelInternal=${input.getAttribute(RENDERED_LABEL_INTERNAL_HIDDEN_RESCUE_ATTR) || 'false'} labelAdjacent=${input.getAttribute(RENDERED_LABEL_ADJACENT_RESULT_RESCUE_ATTR) || 'false'} idTarget=${input.getAttribute(RENDERED_CHECKED_ID_TARGET_RESCUE_ATTR) || 'false'} cssChecked=${input.getAttribute(CHECKED_TEXT_RULE_RESCUE_ATTR) || 'false'} detachedHas=${input.getAttribute(DETACHED_CHECKED_HAS_CONTROL_ATTR) || 'false'} focusWithinPersistent=${input.getAttribute(FOCUS_WITHIN_PERSISTENT_CONTROL_ATTR) || 'false'} radioGroup=${input.getAttribute(RADIO_GROUP_RESCUE_ATTR) || 'false'} expandedOpacity=${input.getAttribute(EXPANDED_OPACITY_RESCUE_ATTR) || 'false'} change=${input.getAttribute(CHANGE_PSEUDO_RESCUE_ATTR) || 'false'} unlabeledHost=${input.getAttribute(UNLABELED_CHECKED_CONTROL_RESCUE_ATTR) || 'false'} labeledVerified=${input.getAttribute(LABELED_CHECKED_VERIFY_CONTROL_ATTR) || 'false'}`,
        );
    });

    lines.push('', '[疑似隐藏内容]');
    if (!targets.length) lines.push('（无）');
    targets.forEach((target, index) => {
        const computed = diagnosticComputedStyle(target);
        const rect = diagnosticRect(target);
        const parentRect = diagnosticRect(target.parentElement);
        const clipping = diagnosticFindClippingAncestor(target, root);
        lines.push(
            `${index}: ${diagnosticElementName(target)} text="${diagnosticCompactText(target.textContent, 70)}"`,
            `   inline: opacity=${getInlineStyleValue(target, 'opacity') || '(empty)'} display=${getInlineStyleValue(target, 'display') || '(empty)'} visibility=${getInlineStyleValue(target, 'visibility') || '(empty)'} transform=${getInlineStyleValue(target, 'transform') || '(empty)'} height=${getInlineStyleValue(target, 'height') || '(empty)'} maxHeight=${getInlineStyleValue(target, 'max-height') || '(empty)'}`,
            `   computed: opacity=${computed?.opacity || '?'} display=${computed?.display || '?'} visibility=${computed?.visibility || '?'} height=${rect.height}px parentHeight=${parentRect.height}px`,
            `   clipping: ${clipping || '未发现明显裁切祖先'}`,
        );
    });

    lines.push('', `[初步判断] ${diagnosticInferReason(root, inputs, targets, state)}`);
    return lines.join('\n');
}


function diagnosticLimitSource(text, maxLength = DIAGNOSTIC_SOURCE_LIMIT) {
    let source = String(text || '');
    source = source
        .replace(/data:[^"'<>\s]{240,}/gi, match => `${match.slice(0, 72)}…[资源内容已省略]`)
        .replace(/[A-Za-z0-9+/]{600,}={0,2}/g, '[超长编码内容已省略]');
    if (source.length <= maxLength) return source;
    return `${source.slice(0, maxLength)}\n<!-- 已截断：原长度 ${source.length} 字符 -->`;
}


function getDiagnosticRawSource(root) {
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (rawRoot?.outerHTML) return diagnosticLimitSource(rawRoot.outerHTML);
    const match = String(rawMessage || '').match(TOTO_BLOCK_SINGLE_RE);
    return diagnosticLimitSource(match?.[0] || rawMessage || '（未能从宿主聊天数据中取得原始兔子镜源码）');
}


function getDiagnosticRenderedSource(root) {
    try {
        const clone = root.cloneNode(true);
        if (clone.matches?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) return '（当前根节点为诊断面板，无法复制兔子镜）';
        clone.querySelectorAll?.(`[data-rm-image-region], [data-rm-image-portal], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`).forEach(panel => panel.remove());
        return diagnosticLimitSource(clone.outerHTML || '（无法序列化实际渲染代码）');
    } catch {
        return '（无法序列化实际渲染代码）';
    }
}


function buildInteractionDiagnosticClipboardText(root, state) {
    const report = state.report || buildInteractionDiagnosticText(root, state, 'capture complete');
    return [
        report,
        '',
        '[隐私提醒] 以下源码包含当前这一条兔子镜中的文字内容；请确认后再发送给他人。超长资源与编码内容会自动省略。',
        '',
        '[原始兔子镜源码]',
        getDiagnosticRawSource(root),
        '',
        '[实际渲染代码]',
        getDiagnosticRenderedSource(root),
    ].join('\n');
}


async function copyDiagnosticText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            const ok = document.execCommand('copy');
            textarea.remove();
            return !!ok;
        } catch {
            return false;
        }
    }
}

// Explicit menu action only: export one live face, never its message/raw-source
// owner. The detached clone is sanitized but never mounted or executed.

function buildRabbitMirrorCurrentFaceHtml(root) {
    const details = root?.matches?.('details') ? root
        : root?.matches?.(MIRROR_TOTO_SELECTOR) ? root.querySelector(':scope > details') : null;
    if (!details?.isConnected || !isRabbitMirrorDetails(details)) {
        throw new Error('当前镜面已离开页面，请重新打开这一面的维修兔后复制。');
    }
    if (!validateRabbitMirrorTemplateStructuralBudget({ content: { childNodes: [details] } })) {
        throw new Error('这面 HTML 超出安全复制范围，未复制，也未截断内容。');
    }
    const template = document.createElement('template');
    const clone = cloneRabbitMirrorFilteredNode(details);
    const originals = details.querySelectorAll('input, textarea, option');
    const copies = clone.querySelectorAll('input, textarea, option');
    originals.forEach((node, index) => {
        const copy = copies[index];
        if (node.matches('input[type="checkbox"], input[type="radio"]')) copy.toggleAttribute('checked', !!node.checked);
        else if (node.matches('option')) copy.toggleAttribute('selected', !!node.selected);
        else if (node.matches('textarea')) copy.textContent = node.value;
        else if (!node.matches('input[type="password"], input[type="file"]')) copy.setAttribute('value', node.value);
    });
    // A normal inline face may keep its local stylesheet/scope on the <toto>
    // wrapper. Clone only that shell and direct styles, not sibling prose/faces.
    if (root !== details) {
        const shell = root.cloneNode(false);
        for (const child of root.children) {
            if (child === details) shell.appendChild(clone);
            else if (child.matches('style')) shell.appendChild(child.cloneNode(true));
        }
        template.content.appendChild(shell);
    } else template.content.appendChild(clone);
    template.content.querySelectorAll([
        '[data-rm-image-region]', '[data-rm-image-portal]',
        `[${TOOL_ENTRY_HOST_ATTR}]`, `[${MAINTENANCE_RABBIT_ATTR}]`, `[${FEEDBACK_CAT_ATTR}]`,
        `[${RECIPE_BUTTON_ATTR}]`, `[${RESAY_ATTR}]`, `[${MAINTENANCE_MENU_ATTR}]`,
        `[${FEEDBACK_CAT_MENU_ATTR}]`, `[${RECIPE_MENU_ATTR}]`, `[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`,
        `[${EXTERNAL_REFERENCE_NOTE_ATTR}]`, `[${INTERACTION_HOME_ATTR}]`,
        '[data-rabbit-mirror-maintenance-checked-sandbox]', '[data-rabbit-mirror-title-flow-end]',
        `template[${MAINTENANCE_QUARANTINED_SCRIPT_ATTR}]`,
    ].join(',')).forEach(node => node.remove());
    // Remove only diagnostic bookkeeping from the detached export. Functional
    // rescue markers/CSS remain intact; live DOM and saved source are untouched.
    const diagnosticAttributes = [
        'data-rabbit-mirror-maintenance-modules', MAINTENANCE_AUTO_SAFE_RESULT_ATTR,
        MAINTENANCE_STATE_ATTR, MAINTENANCE_REASON_ATTR,
    ];
    for (const node of template.content.querySelectorAll('*')) {
        for (const attribute of diagnosticAttributes) node.removeAttribute(attribute);
    }
    if (!sanitizeRabbitMirrorUntrustedTemplate(template)) {
        throw new Error('这面 HTML 未通过安全复制检查；当前页面没有改变。');
    }
    const html = template.innerHTML;
    if (!html || html.length > RABBIT_MIRROR_MAX_TEMPLATE_SOURCE_CHARS) {
        throw new Error('这面 HTML 超出安全复制范围，未复制，也未截断内容。');
    }
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8">'
        + '<meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>兔子镜小剧场</title></head><body>\n' + html + '\n</body></html>';
}


async function writeRabbitMirrorHtmlClipboard(text, panel) {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* WebView fallback below. */ }
    const previousFocus = document.activeElement;
    let field;
    try {
        field = document.createElement('textarea');
        field.value = text;
        field.readOnly = true;
        field.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;font-size:16px;';
        // A modal dialog makes body siblings inert. Put the selection inside
        // the active top-layer dialog so mobile WebViews can actually focus it.
        const dialog = panel?.closest?.('dialog[open]') || [...document.querySelectorAll('dialog[open]')].reverse().find(node => {
            try { return node.matches(':modal'); } catch { return node.contains(previousFocus); }
        });
        (dialog || panel || document.body).appendChild(field);
        field.focus({ preventScroll: true });
        field.select();
        field.setSelectionRange(0, field.value.length);
        return document.activeElement === field && !!document.execCommand('copy');
    } catch { return false; }
    finally {
        field?.remove();
        if (previousFocus?.isConnected) { try { previousFocus.focus({ preventScroll: true }); } catch {} }
    }
}


export async function copyRabbitMirrorCurrentFaceHtml(root, actionButton, panel) {
    if (!actionButton || actionButton.disabled) return;
    const status = panel.querySelector('[data-rm-copy-html-status]');
    actionButton.disabled = true;
    if (status) status.textContent = '正在复制本面 HTML…';
    panel.querySelector('[data-rm-copy-html-fallback]')?.remove();
    try {
        const html = buildRabbitMirrorCurrentFaceHtml(root);
        const copied = await writeRabbitMirrorHtmlClipboard(html, panel);
        if (!panel.isConnected) return;
        if (status) status.textContent = copied
            ? '已提交完整 HTML 到剪贴板（含样式）。若粘贴软件限制长度，请用“下载本面 HTML 文件”；不含整份诊断或其他消息。'
            : '自动复制失败。可下载本面 HTML 文件，或在下方全选复制；当前镜面没有改变。';
        if (!copied) {
            const field = document.createElement('textarea');
            field.setAttribute('data-rm-copy-html-fallback', 'true');
            field.setAttribute('aria-label', '本面 HTML，可全选后手动复制');
            field.readOnly = true;
            field.value = html;
            field.style.cssText = 'box-sizing:border-box;width:100%;min-height:96px;';
            status?.insertAdjacentElement('afterend', field);
        }
    } catch (error) {
        if (status?.isConnected) status.textContent = String(error?.message || '复制失败，当前镜面没有改变。');
    } finally {
        actionButton.disabled = false;
    }
}


export function downloadRabbitMirrorCurrentFaceHtml(root, actionButton, panel) {
    if (!actionButton || actionButton.disabled) return;
    const status = panel.querySelector('[data-rm-copy-html-status]');
    let url, link;
    try {
        const html = buildRabbitMirrorCurrentFaceHtml(root);
        url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
        link = document.createElement('a');
        link.href = url;
        link.download = '兔子镜-本面.html';
        link.textContent = '保存本面 HTML 文件';
        panel.appendChild(link);
        link.click();
        if (status) status.textContent = '已请求保存本面 HTML 文件。若宿主未弹出保存，请使用复制；依赖兔子镜脚本的交互不会随文件导出。';
    } catch (error) {
        if (status) status.textContent = String(error?.message || '文件导出失败，当前镜面没有改变。');
    } finally {
        link?.remove();
        // Keep the URL valid through the browser/native download hand-off.
        if (url) setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
}


export function removeInteractionDiagnostic(root) {
    const state = interactionDiagnosticStates.get(root);
    state?.panel?.remove?.();
    interactionDiagnosticStates.delete(root);
    root?.querySelectorAll?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`).forEach(panel => panel.remove());
}


export function removeAllInteractionDiagnosticPanels() {
    const chatRoot = getChatRoot();
    for (let message = chatRoot?.lastElementChild, examined = 0; message && examined < 6; message = message.previousElementSibling) {
        if (!message.matches?.('.mes[mesid], [mesid].mes')) continue;
        examined += 1;
        message.querySelectorAll?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`).forEach(panel => panel.remove());
    }
}


export function createOneShotInteractionDiagnosticPanel(root, state) {
    if (!root?.isConnected || state.panel?.isConnected) return;
    const panel = document.createElement('div');
    panel.setAttribute(INTERACTION_DIAGNOSTIC_PANEL_ATTR, 'true');
    panel.style.cssText = [
        'position:relative', 'z-index:2147483000', 'display:block', 'box-sizing:border-box',
        'margin:16px 8px 8px', 'padding:12px', 'border:3px solid #facc15', 'border-radius:8px',
        'background:#111827', 'color:#f9fafb', 'box-shadow:0 0 0 2px #ef4444 inset',
        'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace', 'font-size:11px', 'line-height:1.45',
        'white-space:normal', 'overflow:auto', 'max-height:520px',
    ].join(';');

    const heading = document.createElement('div');
    heading.textContent = '【一次性兔子镜总诊断｜捕获完成后自动停止】';
    heading.style.cssText = 'font-weight:800;color:#fde047;margin-bottom:8px;';

    const privacy = document.createElement('div');
    privacy.textContent = '点击异常消息即可诊断：支持交互失效、代码块、纯文字源码与显示源冲突。复制时会附带该条源码与实际渲染代码；不会自动上传。';
    privacy.style.cssText = 'color:#cbd5e1;margin-bottom:8px;font-size:10px;';

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;';
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.textContent = '复制诊断＋代码';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = '关闭报告';
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = '重新诊断';
    for (const button of [copyButton, closeButton, retryButton]) {
        button.style.cssText = 'cursor:pointer;padding:5px 10px;border:1px solid #fde047;border-radius:5px;background:#1f2937;color:#fff;';
    }
    actions.append(copyButton, closeButton, retryButton);

    const pre = document.createElement('pre');
    pre.textContent = '正在检查当前消息的代码恢复链与交互状态，请稍候约半秒……';
    pre.style.cssText = 'margin:0;white-space:pre-wrap;word-break:break-word;color:#f3f4f6;background:transparent;border:0;padding:0;';
    panel.append(heading, privacy, actions, pre);

    const outerDetails = root.matches?.('details') ? root : root.querySelector(':scope > details');
    (outerDetails || root).appendChild(panel);
    Object.assign(state, { panel, pre, copyButton, closeButton, retryButton });

    copyButton.addEventListener('click', async event => {
        event.preventDefault();
        event.stopPropagation();
        const original = copyButton.textContent;
        copyButton.textContent = '正在整理源码…';
        try {
            const text = buildInteractionDiagnosticClipboardText(root, state);
            const ok = await copyDiagnosticText(text);
            copyButton.textContent = ok ? '已复制' : '复制失败，请截图';
        } catch (error) {
            const message = String(error?.message || error || 'unknown copy error');
            copyButton.textContent = '整理失败，请截图';
            if (state.pre?.isConnected && !state.report) state.pre.textContent = `诊断整理失败：${message}`;
            console.debug('[RabbitMirror] diagnostic clipboard build failed:', error);
        } finally {
            setTimeout(() => { if (copyButton.isConnected) copyButton.textContent = original; }, 1400);
        }
    });
    closeButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        removeInteractionDiagnostic(root);
    });
    retryButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        removeInteractionDiagnostic(root);
        triggerInteractionDiagnosticOnce();
    });
}


function getDiagnosticRootFromTarget(target) {
    if (!target?.closest) return null;
    if (target.closest(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) return null;
    const toto = target.closest(MIRROR_TOTO_SELECTOR);
    if (toto && isInsideChatMessage(toto)) return toto;
    const details = target.closest('details');
    if (details && isRabbitMirrorDetails(details) && isInsideChatMessage(details)) return details;
    // 总诊断必须允许点击尚未恢复成 DOM 的代码块或纯文字源码。
    const body = target.closest('.mes_text');
    if (body && isInsideChatMessage(body)) return body;
    const message = target.closest('.mes, [mesid], [data-message-id], [data-messageid]');
    const messageBody = message?.querySelector?.('.mes_text');
    if (messageBody && isInsideChatMessage(messageBody)) return messageBody;
    return null;
}


function stopOneShotInteractionDiagnosticSession() {
    const session = oneShotInteractionDiagnosticSession;
    if (!session) return;
    for (const [type, handler] of Object.entries(session.handlers || {})) {
        session.chatRoot?.removeEventListener?.(type, handler, true);
    }
    for (const timer of session.timers || []) clearTimeout(timer);
    oneShotInteractionDiagnosticSession = null;
}


export function finalizeOneShotInteractionDiagnostic(root, state) {
    try {
        captureInteractionDiagnosticSnapshot(root, state, '+650ms');
        state.report = buildInteractionDiagnosticText(root, state, 'full check +650ms');
        if (state.pre?.isConnected) state.pre.textContent = state.report;
    } catch (error) {
        const message = String(error?.stack || error?.message || error || 'unknown diagnostic error');
        state.report = [
            '兔子镜小剧场 全链路诊断',
            `运行版本: ${INTERACTION_DIAGNOSTIC_VERSION}`,
            '阶段: diagnostic-error',
            '',
            '[诊断内部错误]',
            message,
            '',
            '诊断本身发生异常，当前页面真实控件未因此被操作。请复制本报告发送给开发者。',
        ].join('\n');
        if (state.pre?.isConnected) state.pre.textContent = state.report;
        const button = root?.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`);
        failMaintenanceRabbit(button, '📋 全链路诊断收尾失败，错误已写入诊断报告');
        console.debug('[RabbitMirror] one-shot diagnostic finalize failed:', error);
    } finally {
        stopOneShotInteractionDiagnosticSession();
    }
}


function handleOneShotInteractionDiagnosticEvent(session, event) {
    const root = getDiagnosticRootFromTarget(event?.target);
    if (!root) return;
    if (session.root && session.root !== root) return;

    if (!session.root) {
        session.root = root;
        removeInteractionDiagnostic(root);
        const state = { events: [], snapshots: [], panel: null, pre: null, report: '' };
        session.state = state;
        interactionDiagnosticStates.set(root, state);
        createOneShotInteractionDiagnosticPanel(root, state);
        captureInteractionDiagnosticSnapshot(root, state, '捕获前');
        for (const [label, delay] of [['+0ms', 0], ['+100ms', 100], ['+500ms', 500]]) {
            session.timers.push(setTimeout(() => captureInteractionDiagnosticSnapshot(root, state, label), delay));
        }
        session.timers.push(setTimeout(() => finalizeOneShotInteractionDiagnostic(root, state), 650));
    }

    const state = session.state;
    const target = event?.target;
    const checked = target?.matches?.('input[type="checkbox"], input[type="radio"]') ? ` checked=${!!target.checked}` : '';
    state.events.push(`${event.type}:capture target=${diagnosticElementName(target)}${checked}`);
    if (state.events.length > 24) state.events.splice(0, state.events.length - 24);
}



export function rabbitMirrorLanguageBalance(root) {
    if (!root) return auditVisibleLanguageBalanceText('');
    try {
        const clone = root.cloneNode?.(true);
        if (clone?.querySelectorAll) {
            clone.querySelectorAll(`[data-rm-image-region], [data-rm-image-portal], style,script,[${TOOL_ENTRY_HOST_ATTR}],[${MAINTENANCE_RABBIT_ATTR}],[${FEEDBACK_CAT_ATTR}],[${RESAY_ATTR}],[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}],[${FEEDBACK_CAT_MENU_ATTR}]`).forEach(node => node.remove());
            return auditVisibleLanguageBalanceText(clone.textContent || '');
        }
    } catch (error) {
        console.debug('[RabbitMirror] language balance clone audit skipped:', error);
    }
    return auditVisibleLanguageBalanceText(root.textContent || '');
}


function maintenanceRabbitTitle(state, reason = '') {
    const details = reason ? `：${reason}` : '';
    if (state === MAINTENANCE_STATES.checking) return `维修兔正在巡逻${details}`;
    if (state === MAINTENANCE_STATES.healthy) return `维修兔：未发现需要维修的问题。点击可重新巡逻${details}`;
    if (state === MAINTENANCE_STATES.repairable) return `维修兔：发现可安全尝试修复的问题。点击开始维修${details}`;
    if (state === MAINTENANCE_STATES.notice) return `维修兔：发现内容提示，不会自动改写正文${details}`;
    if (state === MAINTENANCE_STATES.unknown) return `维修兔：无法安全判断。点击生成全链路诊断${details}`;
    return '维修兔：点击巡逻';
}


function maintenanceProblemEmoji(state, reason = '') {
    const text = String(reason || '').trim();
    if (!text || state === MAINTENANCE_STATES.healthy || state === MAINTENANCE_STATES.checking) return '';
    const existing = text.match(/[📄🎨📱🌐📡📋❌]|🖱️|⚠️/u);
    if (existing) return existing[0];
    if (/过大|节点上限|卡死|超限|安全预算|复杂度/.test(text)) return '⚠️';
    if (/巡逻未完成|维修(?:延迟复核)?执行失败|执行异常|无法重新定位|未找到当前兔子镜|脱离页面/.test(text)) return '❌';

    const categories = [
        { emoji: '📡', pattern: /独立\s*API|副\s*API|网络|请求|连接|SSE|NDJSON|流式|模型/i },
        { emoji: '📄', pattern: /源码|空白|显示代码|纯文字|代码块|转义标签|原始源|HTML|生成不完整|缺少正文|截断说明|完整候选/i },
        { emoji: '🎨', pattern: /结构／样式|结构\/样式|样式|CSS|WebKit|兼容|颜色|视觉|背景|材质|外观/i },
        { emoji: '📱', pattern: /排版|内容显示|手机端|窄屏|裁切|溢出|overflow|低对比|压窄|布局|可见正文/i },
        { emoji: '🖱️', pattern: /交互|checked|checkbox|radio|label|点击|触发器|第二层|Hover|Active|focus|控件|选择状态/i },
        { emoji: '🌐', pattern: /外语|英文|语言|文案.*占比/i },
    ];
    let selected = null;
    for (const category of categories) {
        const index = text.search(category.pattern);
        if (index < 0 || (selected && selected.index <= index)) continue;
        selected = { index, emoji: category.emoji };
    }
    if (selected) return selected.emoji;
    if (/失败|异常|未完成|未找到|无法重新定位|脱离页面/.test(text)) return '❌';
    if (state === MAINTENANCE_STATES.unknown || /无法安全判断|全链路诊断|未命中/.test(text)) return '📋';
    if (state === MAINTENANCE_STATES.repairable || state === MAINTENANCE_STATES.notice) return '⚠️';
    return '';
}


function decorateMaintenanceRabbitReason(state, reason = '') {
    const text = String(reason || '').trim();
    const emoji = maintenanceProblemEmoji(state, text);
    if (!emoji || text.startsWith(emoji)) return text;
    return `${emoji} ${text}`;
}


export function maintenanceMenuProblemText(state, reason = '') {
    const text = String(reason || '').trim();
    if (state === MAINTENANCE_STATES.checking) return text || '正在检查当前镜面，请稍候。';
    if (state === MAINTENANCE_STATES.healthy) return text || '未发现需要维修的问题。';
    if (text) return decorateMaintenanceRabbitReason(state, text);
    return '请选择问题类型；“自动判断”会在执行时检测当前镜面。';
}


function maintenanceRabbitGlyph(state, _reason = '') {
    return state === MAINTENANCE_STATES.healthy
        ? '🐇🟢'
        : (state === MAINTENANCE_STATES.repairable || state === MAINTENANCE_STATES.notice)
            ? '🐇🟡'
            : state === MAINTENANCE_STATES.unknown
                ? '🐇🔴'
                : '🐇⚪';
}


export function stripMaintenanceRabbitGlyphs(text = '') {
    return String(text || '').replace(/🐇[⚪🟢🟡🔴]?(?:📄|🎨|📱|🖱️|🌐|📡|📋|❌|⚠️)?/gu, '');
}


export function setMaintenanceRabbitState(button, state, reason = '') {
    if (!button) return;
    const decoratedReason = decorateMaintenanceRabbitReason(state, reason);
    button.setAttribute(MAINTENANCE_STATE_ATTR, state);
    button.setAttribute(MAINTENANCE_REASON_ATTR, decoratedReason);
    button.textContent = maintenanceRabbitGlyph(state, decoratedReason);
    button.title = maintenanceRabbitTitle(state, decoratedReason);
    button.setAttribute('aria-label', button.title);
    normalizeRabbitMirrorToolButton(button);
}


export function failMaintenanceRabbit(button, reason = '维修执行失败，请生成全链路诊断') {
    setMaintenanceRabbitState(button, MAINTENANCE_STATES.unknown, reason);
    return false;
}


export function isLikelyTouchDevice() {
    try {
        return (navigator.maxTouchPoints || 0) > 0 || globalThis.matchMedia?.('(hover: none)')?.matches === true;
    } catch {
        return false;
    }
}


export function maintenanceInteractionScopeEvidence(root) {
    const controls = diagnosticQueryContentAll(root, 'input[type="checkbox"][id], input[type="radio"][id]');
    const explicitLabels = diagnosticQueryContentAll(root, 'label[for]');
    let duplicateIds = 0;
    let brokenLocalLabels = 0;
    let checkedCssIdSelectors = 0;

    for (const input of controls) {
        const id = String(input.id || '').trim();
        if (!id) continue;
        try {
            if (document.querySelectorAll(`#${escapeCssIdentifier(id)}`).length > 1) duplicateIds += 1;
        } catch {
            // Ignore selector failures.
        }
        const wrappingLabel = input.closest?.('label');
        const explicitLabel = explicitLabels.find(label => label.getAttribute('for') === id);
        const wrappingValid = !!wrappingLabel && wrappingLabel.control === input;
        const explicitValid = !!explicitLabel && explicitLabel.control === input;
        if (!wrappingValid && !explicitValid) brokenLocalLabels += 1;
    }

    const cssText = [...(root?.querySelectorAll?.('style') || [])].map(style => String(style.textContent || '')).join('\n');
    for (const input of controls) {
        const id = String(input.id || '').trim();
        if (!id) continue;
        const escaped = escapeRegExp(id);
        if (new RegExp(`(?:#${escaped}|\\[\\s*id\\s*=\\s*["']${escaped}["']\\s*\\])[^{}]*:checked`, 'i').test(cssText)) checkedCssIdSelectors += 1;
    }

    return { duplicateIds, brokenLocalLabels, checkedCssIdSelectors, needsScopeRepair: controls.length > 0 && (duplicateIds > 0 || brokenLocalLabels > 0) };
}



export function triggerInteractionDiagnosticOnce() {
    try {
        const chatRoot = getChatRoot();
        if (!chatRoot) return false;
        stopOneShotInteractionDiagnosticSession();
        removeAllInteractionDiagnosticPanels();

        const session = { chatRoot, root: null, state: null, handlers: {}, timers: [] };
        for (const type of ['click', 'input', 'change']) {
            const handler = event => handleOneShotInteractionDiagnosticEvent(session, event);
            session.handlers[type] = handler;
            chatRoot.addEventListener(type, handler, true);
        }
        session.timers.push(setTimeout(() => stopOneShotInteractionDiagnosticSession(), DIAGNOSTIC_WAIT_TIMEOUT_MS));
        oneShotInteractionDiagnosticSession = session;
        return true;
    } catch (error) {
        console.debug('[RabbitMirror] one-shot full diagnostic failed:', error);
        stopOneShotInteractionDiagnosticSession();
        return false;
    }
}







