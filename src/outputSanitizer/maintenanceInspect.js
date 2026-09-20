// Split from outputSanitizer.js — maintenanceInspect.

import { cloneRabbitMirrorFilteredNode } from '../bannedWords.js?rmv=1.5.53-cn-boundary1';
import { getCurrentChatKey } from '../storage.js?rmv=1.5.53-visualquick1';
import { auditVisibleLanguageBalanceText } from '../feedbackCat.js?rmv=1.5.53-cn-boundary1';
import { getRabbitMirrorGenerationSnapshot } from '../generationGuard.js?rmv=1.5.53-image1';
import { analyzeStylelessControlKinds, collectBoundedElementDescendants, countMeaningfulStateVisualRules } from '../presentationQuality.js?rmv=1.5.53-cn-boundary1';
import {
    EXTERNAL_REFERENCE_NOTE_ATTR,
    FEEDBACK_CAT_ATTR,
    INTERACTION_HOME_ATTR,
    MAINTENANCE_RABBIT_ATTR,
    MIRROR_TOTO_SELECTOR,
    RECIPE_BUTTON_ATTR,
    RUNTIME_VERSION,
    TOOL_ENTRY_HOST_ATTR,
    getRenderedRabbitMirrorInteractionRoots,
    hashInteractionSignature,
    isInsideChatMessage,
    isRabbitMirrorDetails,
} from './runtime.js?rmv=1.5.60-split1';
import {
    CHANGE_PSEUDO_RESCUE_ATTR,
    CHANNEL_DIAL_CYCLE_COUNT_ATTR,
    CHECKED_HAS_STATE_RULE_COUNT_ATTR,
    CROSS_PARENT_CHECKED_ROOT_ATTR,
    CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR,
    DECORATIVE_OVERLAY_PASS_THROUGH_ATTR,
    DETACHED_CHECKED_HAS_RULE_COUNT_ATTR,
    DIRECT_ID_CLASS_STATE_RESCUE_ATTR,
    DIRECT_ID_CLICK_RESCUE_ATTR,
    EXCLUSIVE_STACKED_STATE_COUNT_ATTR,
    FOCUS_WITHIN_PERSISTENT_ROOT_ATTR,
    INLINE_PSEUDO_RESCUE_ATTR,
    LABELED_CHECKED_VERIFY_ROOT_ATTR,
    MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR,
    NESTED_CHECKED_CONTENT_RESCUE_ATTR,
    PAIRED_CHECKED_STATE_COUNT_ATTR,
    PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR,
    RAW_NAMED_FUNCTION_RESCUE_ATTR,
    RAW_SCRIPT_TIMELINE_RESCUE_ATTR,
    RAW_SCRIPT_TIMELINE_ROOT_ATTR,
    REVERSIBLE_CHECKED_RESULT_ROOT_ATTR,
    REVERSIBLE_CHECKED_RESULT_TARGET_ATTR,
    crossParentCheckedCandidateVerified,
    findChannelDialCycleCandidates,
    findCrossParentCheckedRuleFallbackCandidates,
    findExclusiveStackedStateCandidates,
    findPairedCheckedStateCandidates,
    installMissingCheckedSubjectClassRescue,
    parseBrokenCheckedHasStateRules,
    parseCheckedRulesFromText,
    parseDetachedCheckedHasRules,
    parseMissingCheckedSubjectClassRules,
    resolveTargetsForCheckedRule,
    restoreIndependentNativeCheckedInteraction,
} from './checkedStateRescue.js?rmv=1.5.60-split1';
import { getClassTokens, isCollapsedDimensionValue, normalizeStylePropertyName } from './renderedStateRescue.js?rmv=1.5.60-split1';
import {
    RAW_RADIO_RESET_RESCUE_ATTR,
    RAW_SELF_MUTATION_RESCUE_ATTR,
    chooseMatchingRawRabbitMirrorRoot,
    collectSafeRawScriptTimelinePrograms,
    detectInteractionCapabilities,
    filterRabbitMirrorRuntimeDom,
    getAvailableHostChat,
    getExternalOwnerMessageIndex,
    getRabbitMirrorSummaryText,
    getRawAssistantMessageForRenderedRoot,
    installRawMessageRadioResetProgramRescue,
    normalizeInteractionMatchText,
} from './scriptedInteractionRescue.js?rmv=1.5.60-split1';
import {
    REVERSIBLE_RADIO_ROOT_ATTR,
    TOUCH_HOVER_ATTR,
    TOUCH_HOVER_READY_ATTR,
    TOUCH_HOVER_STYLE_ATTR,
    findDecorativeOverlayPassThroughCandidates,
    findFocusWithinPersistentCandidates,
    findMobileInlineAnnotationCandidates,
    findNestedDetailsPopupClippingCandidates,
    findOneWayCheckedResultCandidates,
    installIntelligentInteractionRescue,
    installMobileInlineAnnotationRescue,
    installReversibleRadioGroupFallback,
    installWebKit3DFlipRescue,
    repairMarkdownCorruptedCssComments,
    repairNestedDetailsPopupClipping,
    scheduleMaintenanceLabeledCheckedProbe,
} from './fallbackRescue.js?rmv=1.5.60-split1';
import {
    RADIO_GROUP_ROOT_ATTR,
    activateRabbitMirrorInteractionRescue,
    inspectSanitizedRadioGroupLoss,
    rearmRabbitMirrorSerializedInteractionRoot,
    scopeRabbitMirrorInteractionIds,
} from './idsAndRearm.js?rmv=1.5.60-split1';
import {
    DISABLED_ONLY_CHOICE_RESCUE_ATTR,
    FEEDBACK_CAT_MENU_ATTR,
    FILL_IN_CHOICE_COUNT_ATTR,
    INDEPENDENT_REPAIR_PERSIST_EVENT,
    INERT_ACTION_BUTTON_RESCUE_ATTR,
    INTERACTION_DIAGNOSTIC_PANEL_ATTR,
    MAINTENANCE_AUTO_SAFE_ATTR,
    MAINTENANCE_AUTO_SAFE_RESULT_ATTR,
    MAINTENANCE_AUTO_SAFE_VERSION,
    MAINTENANCE_MENU_ATTR,
    MAINTENANCE_MIRROR_IDENTITY_ATTR,
    MAINTENANCE_REPAIR_ATTR,
    MAINTENANCE_STATES,
    RECIPE_MENU_ATTR,
    RESAY_ATTR,
    SELECTION_ONLY_FALLBACK_ATTR,
    SOURCE_TRUNCATION_NOTICE_ATTR,
    STATIC_CHOICE_SELECTION_COUNT_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR,
    STYLELESS_STRUCTURED_CHOICE_ATTR,
    STYLELESS_STRUCTURED_CHOICE_LABEL_ATTR,
    STYLELESS_STRUCTURED_COUNT_ATTR,
    STYLELESS_STRUCTURED_HEADER_ATTR,
    STYLELESS_STRUCTURED_MAX_DESCENDANTS,
    STYLELESS_STRUCTURED_RESCUE_ATTR,
    STYLELESS_STRUCTURED_SECTION_ATTR,
    STYLELESS_STRUCTURED_SHELL_ATTR,
    STYLELESS_STRUCTURED_STYLE_ATTR,
    STYLELESS_STRUCTURED_SUBTITLE_ATTR,
    STYLELESS_STRUCTURED_TEXT_ATTR,
    STYLELESS_STRUCTURED_TITLE_ATTR,
    captureInteractionDiagnosticSnapshot,
    createOneShotInteractionDiagnosticPanel,
    diagnosticCodeRescueSummary,
    diagnosticComputedStyle,
    diagnosticContentSnapshot,
    diagnosticFullChainSummary,
    diagnosticMessageBody,
    diagnosticQueryContentAll,
    diagnosticRouteSummary,
    failMaintenanceRabbit,
    finalizeOneShotInteractionDiagnostic,
    findMaintenanceTextClippingCandidates,
    inspectRevealedDrawerClipping,
    interactionDiagnosticStates,
    isLikelyTouchDevice,
    maintenanceInteractionScopeEvidence,
    maintenancePreRepairSnapshots,
    markIndependentMaintenanceLiveRepair,
    rabbitMirrorInteractionResetInstanceIds,
    rabbitMirrorInteractionResetSnapshots,
    rabbitMirrorLanguageBalance,
    releaseIndependentMaintenanceLiveRepair,
    removeInteractionDiagnostic,
    repairMaintenanceTextClipping,
    repairRevealedDrawerClipping,
    setMaintenanceRabbitState,
    stripMaintenanceRabbitGlyphs,
} from './diagnostics.js?rmv=1.5.60-split1';
import {
    findDisabledOnlyChoiceGroupCandidates,
    findFillInChoiceCandidates,
    findInertActionButtonCandidates,
    findSelectionOnlyRadioFallbackCandidates,
    findStaticChoiceSelectionCandidates,
    findStructuredStaticDisclosureCandidates,
    installDisabledOnlyChoiceFallback,
    installFillInChoiceFallback,
    installInertActionButtonFallback,
    installSelectionOnlyStateFallback,
    installStaticChoiceSelectionFallback,
    installStructuredStaticDisclosureFallback,
    rehydrateRabbitMirrorMaintenanceRepairs,
} from './choiceRescue.js?rmv=1.5.60-split1';
import {
    FENCED_BLOCK_RE,
    RABBIT_MIRROR_SANITIZER_STYLE_DROP_ATTR,
    TOTO_BLOCK_SINGLE_RE,
    cleanRabbitMirrorOutput,
    cloneMessageForTransientRerender,
    compactTotoBlock,
    decodeHtmlEntities,
    looksLikeCompleteHtmlBlock,
    rescueDamagedDataUriRabbitMirrorOutput,
    rescuePlainTextRabbitMirrorOutput,
    sanitizeRabbitMirrorUntrustedTemplate,
    setTransientMessageSource,
    splitCssSelectorList,
    stripOneCodeFence,
    validateRabbitMirrorMarkupLexicalBudget,
    wrapNakedHtmlAsToto,
    wrapTrailingNakedHtml,
} from './markup.js?rmv=1.5.60-split1';
import {
    getRabbitMirrorFacePosition,
    independentMaintenanceHost,
    inspectMaintenanceMobileLayout,
    inspectMaintenanceViewportLayout,
    installMaintenanceHorizontalClipRescue,
    installMaintenanceMobileLayoutRescue,
    installMaintenanceViewportLayoutRescue,
    installVisualSceneryMobileNarrativeOverflowRescue,
    maintenanceMobileLayoutComputedStyle,
    maintenanceMobileLayoutIsInternal,
    maintenanceMobileLayoutRect,
    maintenanceMobileLayoutTextLength,
    shouldRunMaintenanceMobileLayoutRescue,
} from './layoutRescue.js?rmv=1.5.60-split1';
import {
    containRabbitMirrorTitleToolFloat,
    installMaintenanceRabbitForRoot,
    rabbitMirrorTextPresentation,
    refreshRabbitMirrorToolsInScope,
} from './toolsChrome.js?rmv=1.5.60-split1';
import {
    TRANSIENT_RERENDER_REASONING_ENVELOPE_RE,
    followMaintenanceRepairRecipes,
    getMessageIndexFromMirrorNode,
    hostScriptModule,
    maintenanceRepairActiveRuns,
    maintenanceRepairRunRecords,
    maintenanceRepairRunTokens,
    maintenanceRepairTimers,
    messageContainsReasoningEnvelope,
    messageUsesDistinctDisplaySource,
} from './lifecycle.js?rmv=1.5.60-split1';

let rabbitMirrorInteractionResetInstanceCounter = 0;

export const MAINTENANCE_FINDING_STAGE_LABELS = Object.freeze({
    source: '源码',
    structure: '结构／样式',
    visibility: '显示',
    interaction: '交互',
    compatibility: '兼容',
});




const TEXT_CONTRAST_RESCUE_ATTR = 'data-rabbit-mirror-text-contrast-rescue';

export const TEXT_CONTRAST_RESCUE_ROOT_ATTR = 'data-rabbit-mirror-text-contrast-rescue-count';


export const MAINTENANCE_QUARANTINED_SCRIPT_ATTR = 'data-rabbit-mirror-quarantined-script';

const MAINTENANCE_STATIC_DECOR_ATTR = 'data-rabbit-mirror-static-script-fallback';

const MAINTENANCE_STATIC_DECOR_CHILD_ATTR = 'data-rabbit-mirror-static-decoration';


const rabbitMirrorInteractionResetSourceSignatures = new WeakMap();


const rabbitMirrorInteractionResetBudgetSkips = new WeakMap();


const MAINTENANCE_RESCUE_MODULE_VERSION = 'v2.22';

// 维修兔内部急救登记表。这里登记的是已经存在并经过实际案例验证的旧急救能力，
// 维修兔只负责按用户选择调度，不复制、不删减各急救器原有逻辑。

const MAINTENANCE_RESCUE_LIBRARY = Object.freeze([
    { id: 'code-block-dom', modes: ['source', 'code', 'all'], bucket: 'code', run: ({ messageScope }) => sanitizeCodeBlocksInScope(messageScope, true) },
    { id: 'plain-text-dom', modes: ['source', 'plainText', 'code', 'all'], bucket: 'plainText', run: ({ messageScope }) => sanitizeWholePlainTextRabbitMirrorsInScope(messageScope, true) },
    { id: 'rendered-details-dom', modes: ['source', 'plainText', 'code', 'all'], bucket: 'plainText', run: ({ messageScope }) => sanitizeRenderedRabbitMirrorDetailsInScope(messageScope, true) },
    { id: 'styleless-structured-rescue', modes: ['style', 'all'], bucket: 'style', perTarget: true, run: ({ root, target }) => target === root ? installMaintenanceStylelessStructuredRescue(target) : 0 },
    { id: 'css-comment-boundary', modes: ['source', 'style', 'all'], bucket: 'style', perTarget: true, run: ({ target }) => repairMarkdownCorruptedCssComments(target) },
    // “排版不适配／内容显示不全”共用同一条手动路线：先修窄屏容器关系，再复测叶级文字裁切。
    { id: 'mobile-inline-annotation-flow-repair', modes: ['text', 'all'], bucket: 'style', perTarget: true, run: ({ target }) => installMobileInlineAnnotationRescue(target) },
    { id: 'nested-details-popup-flow-repair', modes: ['text', 'all'], bucket: 'style', perTarget: true, run: ({ target }) => repairNestedDetailsPopupClipping(target) },
    { id: 'mobile-layout-rescue', modes: ['text', 'all'], bucket: 'style', perTarget: true, run: ({ root, target }) => target === root && shouldRunMaintenanceMobileLayoutRescue(target) ? installMaintenanceMobileLayoutRescue(target) : 0 },
    // 1.3.62: 与上一条配对——上一条只写 @media(max-width:640px)，这条按当前视口实测并写入无 media query 的样式表。
    { id: 'viewport-layout-rescue', modes: ['text', 'all'], bucket: 'style', perTarget: true, run: ({ root, target }) => target === root ? installMaintenanceViewportLayoutRescue(target) : 0 },
    // 1.3.77: 仅处理「确有横向溢出且被最近祖先裁掉」这一种形态，产物全部为 transient。
    { id: 'horizontal-clip-rescue', modes: ['text', 'all'], bucket: 'style', perTarget: true, run: ({ root, target }) => target === root ? installMaintenanceHorizontalClipRescue(target) : 0 },
    { id: 'text-contrast-repair', modes: ['text', 'all'], bucket: 'style', perTarget: true, run: ({ target }) => repairSevereTextContrast(target) },
    { id: 'text-clipping-repair', modes: ['text', 'all'], bucket: 'style', perTarget: true, run: ({ target }) => repairMaintenanceTextClipping(target) },
    { id: 'webkit-3d-flip-compat', modes: ['interaction', 'style', 'all'], bucket: 'style', perTarget: true, run: ({ target }) => installWebKit3DFlipRescue(target) },
    { id: 'interaction-id-scope', modes: ['source', 'interaction', 'style', 'all'], bucket: 'scope', perTarget: true, run: ({ target }) => { scopeRabbitMirrorInteractionIds(target); return 1; } },
    { id: 'complete-interaction-library', modes: ['interaction', 'all'], bucket: 'interaction', perTarget: true, run: ({ target }) => {
        // installIntelligentInteractionRescue 内部包含旧库全部已验证路线：
        // 原始安全状态程序、自变化、checked/change、focus→checked、状态层、相邻隐藏组、
        // label 内隐藏、label 后置结果、CSS 状态兄弟、按钮/可点击后置内容、弹层、遮罩、
        // 列表详情、ID 目标显隐、叠层正文互斥、无 label focus-within 持久桥接、
        // data-active/class 状态程序、Touch Hover 与 label fallback。
        const radioGroupCountBefore = Number.parseInt(target.getAttribute?.(RADIO_GROUP_ROOT_ATTR) || '0', 10) || 0;
        scopeRabbitMirrorInteractionIds(target);
        const overlayCountBefore = target.querySelectorAll?.(`[${DECORATIVE_OVERLAY_PASS_THROUGH_ATTR}]`)?.length || 0;
        const rawHoverCountBefore = Number.parseInt(target.dataset?.rabbitMirrorRawHoverFallback || '0', 10) || 0;
        const recoveredProgramCountBefore = recoveredInlineStateProgramCount(target);
        const rawScriptTimelineCountBefore = Number.parseInt(target.getAttribute?.(RAW_SCRIPT_TIMELINE_ROOT_ATTR) || '0', 10) || 0;
        const disabledChoiceRepairCount = installDisabledOnlyChoiceFallback(target);
        installIntelligentInteractionRescue(target);
        const overlayCountAfter = target.querySelectorAll?.(`[${DECORATIVE_OVERLAY_PASS_THROUGH_ATTR}]`)?.length || 0;
        const rawHoverCountAfter = Number.parseInt(target.dataset?.rabbitMirrorRawHoverFallback || '0', 10) || 0;
        const recoveredProgramCountAfter = recoveredInlineStateProgramCount(target);
        const rawScriptTimelineCountAfter = Number.parseInt(target.getAttribute?.(RAW_SCRIPT_TIMELINE_ROOT_ATTR) || '0', 10) || 0;
        const rawScriptTimelineRepairCount = Math.max(0, rawScriptTimelineCountAfter - rawScriptTimelineCountBefore);
        const radioGroupCountAfter = Number.parseInt(target.getAttribute?.(RADIO_GROUP_ROOT_ATTR) || '0', 10) || 0;
        const radioGroupRepairCount = Math.max(0, radioGroupCountAfter - radioGroupCountBefore);
        const overlayRepairCount = Math.max(0, overlayCountAfter - overlayCountBefore);
        const rawHoverRepairCount = Math.max(0, rawHoverCountAfter - rawHoverCountBefore);
        const recoveredProgramRepairCount = Math.max(0, recoveredProgramCountAfter - recoveredProgramCountBefore);
        const crossParentCheckedCount = Number.parseInt(target.getAttribute?.(CROSS_PARENT_CHECKED_ROOT_ATTR) || '0', 10) || 0;
        const labeledCheckedVerifyCount = Number.parseInt(target.getAttribute?.(LABELED_CHECKED_VERIFY_ROOT_ATTR) || '0', 10) || 0;
        if (crossParentCheckedCount > 0 || labeledCheckedVerifyCount > 0) {
            // 自动维修也必须做一次隐藏隔离副本验证。它不点击、不派发事件、不修改真实控件；
            // checkbox 与 radio 都在副本中切换，约 150ms 后只把验证证据写回 live root。
            scheduleMaintenanceLabeledCheckedProbe(target, null);
        }
        const checkedHasStateCount = Number.parseInt(target.getAttribute?.(CHECKED_HAS_STATE_RULE_COUNT_ATTR) || '0', 10) || 0;
        const detachedCheckedHasCount = Number.parseInt(target.getAttribute?.(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR) || '0', 10) || 0;
        const pairedCheckedStateCount = Number.parseInt(target.getAttribute?.(PAIRED_CHECKED_STATE_COUNT_ATTR) || '0', 10) || 0;
        const exclusiveStackedStateCount = Number.parseInt(target.getAttribute?.(EXCLUSIVE_STACKED_STATE_COUNT_ATTR) || '0', 10) || 0;
        const channelDialCycleCount = Number.parseInt(target.getAttribute?.(CHANNEL_DIAL_CYCLE_COUNT_ATTR) || '0', 10) || 0;
        const reversibleCheckedCount = Number.parseInt(target.getAttribute?.(REVERSIBLE_CHECKED_RESULT_ROOT_ATTR) || '0', 10) || 0;
        const reversibleRadioCount = Number.parseInt(target.getAttribute?.(REVERSIBLE_RADIO_ROOT_ATTR) || '0', 10) || 0;
        const nestedCheckedContentCount = target.querySelectorAll?.(`[${NESTED_CHECKED_CONTENT_RESCUE_ATTR}]`)?.length || 0;
        const focusWithinPersistentCount = Number.parseInt(target.getAttribute?.(FOCUS_WITHIN_PERSISTENT_ROOT_ATTR) || '0', 10) || 0;
        const selectionFallbackCount = installSelectionOnlyStateFallback(target);
        const inertActionRepairCount = installInertActionButtonFallback(target);
        const staticChoiceRepairCount = installStaticChoiceSelectionFallback(target);
        const structuredStaticDisclosureRepairCount = installStructuredStaticDisclosureFallback(target);
        const fillInChoiceRepairCount = installFillInChoiceFallback(target);
        const disabledChoiceCount = target.querySelectorAll?.(`[${DISABLED_ONLY_CHOICE_RESCUE_ATTR}]`)?.length || 0;
        const inertActionCount = target.querySelectorAll?.(`[${INERT_ACTION_BUTTON_RESCUE_ATTR}]`)?.length || 0;
        const staticChoiceCount = Number.parseInt(target.getAttribute?.(STATIC_CHOICE_SELECTION_COUNT_ATTR) || '0', 10) || 0;
        const structuredStaticDisclosureCount = Number.parseInt(target.getAttribute?.(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR) || '0', 10) || 0;
        const fillInChoiceCount = Number.parseInt(target.getAttribute?.(FILL_IN_CHOICE_COUNT_ATTR) || '0', 10) || 0;
        detectInteractionCapabilities(target);
        const depthAfter = maintenanceCheckedInteractionDepth(target);
        const meaningfulCheckedRoute = depthAfter.meaningfulCheckedRuleCount > 0
            && depthAfter.unresolvedCheckedRuleCount === 0
            && !depthAfter.checkedSelectionOnly;
        const genuinelyRescued = selectionFallbackCount > 0
            || disabledChoiceRepairCount > 0
            || inertActionRepairCount > 0
            || staticChoiceRepairCount > 0
            || structuredStaticDisclosureRepairCount > 0
            || fillInChoiceRepairCount > 0
            || disabledChoiceCount > 0
            || inertActionCount > 0
            || staticChoiceCount > 0
            || structuredStaticDisclosureCount > 0
            || fillInChoiceCount > 0
            || overlayRepairCount > 0
            || rawHoverRepairCount > 0
            || recoveredProgramRepairCount > 0
            || recoveredProgramCountAfter > 0
            || rawScriptTimelineRepairCount > 0
            || rawScriptTimelineCountAfter > 0
            || radioGroupRepairCount > 0
            || radioGroupCountAfter > 0
            || crossParentCheckedCount > 0
            || labeledCheckedVerifyCount > 0
            || checkedHasStateCount > 0
            || detachedCheckedHasCount > 0
            || pairedCheckedStateCount > 0
            || exclusiveStackedStateCount > 0
            || channelDialCycleCount > 0
            || reversibleCheckedCount > 0
            || reversibleRadioCount > 0
            || nestedCheckedContentCount > 0
            || focusWithinPersistentCount > 0
            || meaningfulCheckedRoute;
        if (genuinelyRescued) target.dataset.rabbitMirrorInteractionRescued = 'true';
        else delete target.dataset.rabbitMirrorInteractionRescued;
        const routes = String(target.dataset.rabbitMirrorInteractionRoutes || '')
            .split(',')
            .map(item => item.trim())
            .filter(item => item && item !== 'none');
        // 不再把“调用了总入口”冒充为“命中了一条急救路线”；选择样式专用结构只有在安全补出分支提示后才算修复。
        return genuinelyRescued ? Math.max(routes.length, disabledChoiceRepairCount, inertActionRepairCount, staticChoiceRepairCount, structuredStaticDisclosureRepairCount, fillInChoiceRepairCount, disabledChoiceCount, inertActionCount, staticChoiceCount, structuredStaticDisclosureCount, fillInChoiceCount, overlayRepairCount, rawHoverRepairCount, recoveredProgramRepairCount, recoveredProgramCountAfter, rawScriptTimelineRepairCount, rawScriptTimelineCountAfter, radioGroupRepairCount, radioGroupCountAfter, crossParentCheckedCount, labeledCheckedVerifyCount, checkedHasStateCount, detachedCheckedHasCount, pairedCheckedStateCount, exclusiveStackedStateCount, channelDialCycleCount, reversibleCheckedCount, nestedCheckedContentCount, focusWithinPersistentCount) : 0;
    } },
]);


const SOURCE_RECOVERY_COOLDOWN_MS = 1800;

const sourceRecoveryLastRun = new Map();

let codeShellRecoveryObserver = null;


export const CODE_SHELL_SELECTOR = 'pre, code, .hljs, .code_block, .code-block, .codeblock, [class*="codeblock"], [class*="code-block"]';


function isCheckedSelectionVisualProperty(property, value) {
    const name = String(property || '').trim().toLowerCase();
    const cleanValue = String(value || '').trim().toLowerCase();
    if (!name) return true;
    if (name === 'transform') {
        // 双面翻转会改变观察内容；普通位移、缩放与平面旋转只算选中反馈。
        return !/(?:rotate[xy]|perspective)\s*\(/i.test(cleanValue);
    }
    if (name.startsWith('--')) return true;
    return name === 'color'
        || name === 'background' || name.startsWith('background-')
        || name === 'border' || name.startsWith('border-')
        || name === 'box-shadow' || name === 'text-shadow'
        || name === 'outline' || name.startsWith('outline-')
        || name === 'filter' || name === 'backdrop-filter'
        || name === 'fill' || name === 'stroke'
        || name === 'cursor'
        || name === 'font-weight' || name === 'font-style'
        || name === 'text-decoration' || name === 'letter-spacing'
        || name === 'translate' || name === 'rotate' || name === 'scale'
        || name === 'transition' || name.startsWith('transition-')
        || name === 'transform-origin';
}



function checkedBaselineDeclarationMap(declarations) {
    const map = new Map();
    const declarationRe = /(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+?)(?=;|$)/gi;
    let match;
    while ((match = declarationRe.exec(String(declarations || '')))) {
        map.set(normalizeStylePropertyName(match[2]), String(match[3] || '').replace(/\s*!important\s*$/i, '').trim().toLowerCase());
    }
    return map;
}


function checkedTargetHasHiddenBaseline(root, target, property) {
    if (!target) return false;
    const name = normalizeStylePropertyName(property);
    const inlineValue = String(target.style?.getPropertyValue?.(name) || '').trim().toLowerCase();
    const computed = diagnosticComputedStyle(target);
    const computedValue = String(computed?.getPropertyValue?.(name) || computed?.[name] || '').trim().toLowerCase();

    if (name === 'display' && (target.hidden || inlineValue === 'none' || computedValue === 'none')) return true;
    if (name === 'visibility' && /^(?:hidden|collapse)$/.test(inlineValue || computedValue)) return true;
    if (name === 'opacity') {
        const value = Number.parseFloat(inlineValue || computedValue || '1');
        if (Number.isFinite(value) && value <= 0.05) return true;
    }
    if (/^(?:height|max-height|min-height)$/.test(name)) {
        const value = inlineValue || computedValue;
        if (isCollapsedDimensionValue(value)) return true;
    }
    if (name === 'clip-path' && /(?:inset\(\s*50%|circle\(\s*0|polygon\(\s*0)/i.test(inlineValue || computedValue)) return true;

    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    for (const style of diagnosticQueryContentAll(root, 'style')) {
        const cssText = String(style.textContent || '');
        blockRe.lastIndex = 0;
        let block;
        while ((block = blockRe.exec(cssText))) {
            const selectorText = String(block[1] || '').trim();
            if (!selectorText || selectorText.startsWith('@') || /:(?:checked|hover|active|focus|focus-within|target|has)\b/i.test(selectorText)) continue;
            const declarations = checkedBaselineDeclarationMap(block[2]);
            if (!declarations.has(name)) continue;
            const baselineValue = declarations.get(name) || '';
            let matches = false;
            for (const selector of splitCssSelectorList(selectorText)) {
                try {
                    if (target.matches?.(selector)) {
                        matches = true;
                        break;
                    }
                } catch {
                    // Ignore malformed model-generated selectors.
                }
            }
            if (!matches) continue;
            if (name === 'display' && baselineValue === 'none') return true;
            if (name === 'visibility' && /^(?:hidden|collapse)$/.test(baselineValue)) return true;
            if (name === 'opacity') {
                const value = Number.parseFloat(baselineValue);
                if (Number.isFinite(value) && value <= 0.05) return true;
            }
            if (/^(?:height|max-height|min-height)$/.test(name) && isCollapsedDimensionValue(baselineValue)) return true;
            if (name === 'clip-path' && /(?:inset\(\s*50%|circle\(\s*0|polygon\(\s*0)/i.test(baselineValue)) return true;
        }
    }
    return false;
}


export function checkedTargetCarriesResultContent(target) {
    if (!target) return false;
    const text = normalizeInteractionMatchText(target.textContent);
    if (text.length >= 2) return true;
    if (target.querySelector?.('img,svg,canvas,video,audio,figure,table,ul,ol,dl,blockquote')) return true;
    const semantic = `${target.id || ''} ${getClassTokens(target).join(' ')}`;
    return /(?:result|reaction|response|message|content|detail|reveal|hidden|panel|output|结果|反应|反馈|信息|详情|揭示|正文)/i.test(semantic)
        && !/(?:progress|meter|bar|track|fill|indicator|decor|ornament|进度|装饰)/i.test(semantic);
}


export function checkedDeclarationCreatesContentReveal(root, target, property, value) {
    if (!checkedTargetCarriesResultContent(target)) return false;
    const name = normalizeStylePropertyName(property);
    const cleanValue = String(value || '').replace(/\s*!important\s*$/i, '').trim().toLowerCase();
    if (name === 'display') return cleanValue !== 'none' && checkedTargetHasHiddenBaseline(root, target, name);
    if (name === 'visibility') return /^(?:visible|initial|inherit|unset)$/.test(cleanValue) && checkedTargetHasHiddenBaseline(root, target, name);
    if (name === 'opacity') {
        const next = Number.parseFloat(cleanValue);
        return Number.isFinite(next) && next > 0.05 && checkedTargetHasHiddenBaseline(root, target, name);
    }
    if (/^(?:height|max-height|min-height)$/.test(name)) {
        return !isCollapsedDimensionValue(cleanValue) && checkedTargetHasHiddenBaseline(root, target, name);
    }
    if (name === 'clip-path') return /^(?:none|initial|inherit|unset)$/.test(cleanValue) && checkedTargetHasHiddenBaseline(root, target, name);
    if (name === 'content') return !/^(?:none|normal|['"]{0,2})$/.test(cleanValue);
    return false;
}


function isCheckedRuleVisualOnlyForTarget(root, target, styleMap) {
    return (styleMap || []).every(([property, value]) => {
        if (checkedDeclarationCreatesContentReveal(root, target, property, value)) return false;
        const name = normalizeStylePropertyName(property);
        if (/^(?:display|visibility|opacity|height|max-height|min-height|clip-path)$/.test(name)) return true;
        return isCheckedSelectionVisualProperty(name, value);
    });
}


export function maintenanceCheckedInteractionDepth(root) {
    const controls = diagnosticQueryContentAll(root, 'input[type="checkbox"], input[type="radio"]');
    const selectionOnlyFallbackCount = diagnosticQueryContentAll(root, `[${SELECTION_ONLY_FALLBACK_ATTR}]`).length;
    if (!controls.length) return { checkedSelectionOnly: false, checkedSelectionOnlyRaw: false, checkedRuleCount: 0, meaningfulCheckedRuleCount: 0, selectionStyleRuleCount: 0, unresolvedCheckedRuleCount: 0, selectionOnlyFallbackCount };

    let checkedRuleCount = 0;
    let meaningfulCheckedRuleCount = 0;
    let selectionStyleRuleCount = 0;
    let unresolvedCheckedRuleCount = 0;
    for (const input of controls) {
        const wrappingLabel = input.closest?.('label');
        for (const rule of parseCheckedRulesFromText(root, input)) {
            checkedRuleCount += 1;
            const targets = resolveTargetsForCheckedRule(root, input, rule);
            // A syntactically present :checked rule that points at no real element
            // is not a meaningful second layer. Older diagnostics counted it as one,
            // which let the maintenance rabbit report success while the intended
            // content stayed permanently hidden.
            if (!targets.length) {
                unresolvedCheckedRuleCount += 1;
                continue;
            }
            const onlySelectionSurface = targets.every(target => (
                (wrappingLabel && (target === wrappingLabel || wrappingLabel.contains?.(target)))
                || String(target.tagName || '').toLowerCase() === 'label'
            ));
            const visualOnly = targets.every(target => isCheckedRuleVisualOnlyForTarget(root, target, rule.styleMap));
            if (onlySelectionSurface && visualOnly) selectionStyleRuleCount += 1;
            else meaningfulCheckedRuleCount += 1;
        }
    }

    const detachedCheckedHasRuleCount = Number.parseInt(root.getAttribute?.(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR) || '0', 10) || 0;
    if (detachedCheckedHasRuleCount > 0) {
        checkedRuleCount += detachedCheckedHasRuleCount;
        meaningfulCheckedRuleCount += detachedCheckedHasRuleCount;
    }

    const checkedSelectionOnlyRaw = checkedRuleCount > 0
        && unresolvedCheckedRuleCount === 0
        && meaningfulCheckedRuleCount === 0
        && selectionStyleRuleCount === checkedRuleCount
        && controls.length > 1;
    const checkedSelectionOnly = checkedSelectionOnlyRaw && selectionOnlyFallbackCount === 0;
    return { checkedSelectionOnly, checkedSelectionOnlyRaw, checkedRuleCount, meaningfulCheckedRuleCount, selectionStyleRuleCount, unresolvedCheckedRuleCount, selectionOnlyFallbackCount };
}




export function pseudoStateTargetSelector(selectorText) {
    return String(selectorText || '')
        .replace(/:(?:hover|active|focus-within|focus)\b/gi, '')
        .trim();
}


function pseudoStateOpacityReveal(root, selectorText, value) {
    const nextOpacity = Number.parseFloat(String(value || ''));
    if (!Number.isFinite(nextOpacity) || nextOpacity <= 0.05) return false;
    const selector = pseudoStateTargetSelector(selectorText);
    if (!selector || !root?.querySelectorAll) return false;
    try {
        return [...root.querySelectorAll(selector)].some(target => {
            const style = diagnosticComputedStyle(target);
            const current = Number.parseFloat(style?.opacity || '1');
            return Number.isFinite(current) && current <= 0.05;
        });
    } catch {
        return false;
    }
}


function pseudoStateMovesDecorativeNestedDetailsSummary(root, selectorText, property) {
    const name = normalizeStylePropertyName(property);
    if (!['left', 'right', 'top', 'bottom'].includes(name)) return false;
    if (!/:hover\b/i.test(String(selectorText || ''))) return false;
    const selector = pseudoStateTargetSelector(selectorText);
    if (!selector || !root?.querySelectorAll) return false;
    try {
        const targets = [...root.querySelectorAll(selector)];
        if (!targets.length) return false;
        return targets.every(target => {
            const summary = target.closest?.('summary');
            const details = summary?.parentElement;
            if (!summary || !details || details.tagName !== 'DETAILS') return false;
            const outerDetails = root.matches?.('details') ? root : root.querySelector?.(':scope > details');
            if (details === outerDetails) return false;
            if (String(target.textContent || '').trim()) return false;
            const rect = target.getBoundingClientRect?.();
            const thinDecoration = !rect || Number(rect.height || 0) <= 16 || Number(rect.width || 0) <= 16;
            return thinDecoration;
        });
    } catch {
        return false;
    }
}


function isPseudoStateVisualOnlyProperty(root, selectorText, property, value) {
    const name = normalizeStylePropertyName(property);
    const normalizedValue = String(value || '').trim().toLowerCase();
    if (name === 'opacity') return !pseudoStateOpacityReveal(root, selectorText, normalizedValue);
    if (pseudoStateMovesDecorativeNestedDetailsSummary(root, selectorText, name)) return true;
    return isCheckedSelectionVisualProperty(name, normalizedValue);
}


export function maintenancePseudoInteractionDepth(root) {
    let pseudoRuleCount = 0;
    let visualOnlyPseudoRuleCount = 0;
    let meaningfulPseudoRuleCount = 0;
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    const declarationRe = /(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+?)(?=;|$)/gi;

    for (const style of diagnosticQueryContentAll(root, 'style')) {
        if (style.hasAttribute?.(TOUCH_HOVER_STYLE_ATTR)) continue;
        const cssText = String(style.textContent || '');
        blockRe.lastIndex = 0;
        let block;
        while ((block = blockRe.exec(cssText))) {
            const selectorText = String(block[1] || '').trim();
            if (!/:(?:hover|active|focus-within|focus)\b/i.test(selectorText)) continue;
            for (const selector of selectorText.split(',').map(value => value.trim()).filter(Boolean)) {
                if (!/:(?:hover|active|focus-within|focus)\b/i.test(selector)) continue;
                const declarations = [];
                declarationRe.lastIndex = 0;
                let declaration;
                while ((declaration = declarationRe.exec(String(block[2] || '')))) {
                    declarations.push([declaration[2], declaration[3]]);
                }
                if (!declarations.length) continue;
                pseudoRuleCount += 1;
                const visualOnly = declarations.every(([property, value]) => (
                    isPseudoStateVisualOnlyProperty(root, selector, property, value)
                ));
                if (visualOnly) visualOnlyPseudoRuleCount += 1;
                else meaningfulPseudoRuleCount += 1;
            }
        }
    }

    const touchHoverEligibleCount = diagnosticQueryContentAll(root, `[${TOUCH_HOVER_READY_ATTR}]`).length;
    const touchHoverActiveCount = diagnosticQueryContentAll(root, `[${TOUCH_HOVER_ATTR}="true"]`).length;
    return {
        pseudoRuleCount,
        visualOnlyPseudoRuleCount,
        meaningfulPseudoRuleCount,
        touchHoverEligibleCount,
        touchHoverActiveCount,
        pseudoVisualOnlyRaw: pseudoRuleCount > 0 && meaningfulPseudoRuleCount === 0,
    };
}


function recoveredInlineStateProgramCount(root) {
    if (!root?.querySelectorAll) return 0;
    const selector = [
        `[${CHANGE_PSEUDO_RESCUE_ATTR}]`,
        `[${INLINE_PSEUDO_RESCUE_ATTR}]`,
        `[${DIRECT_ID_CLICK_RESCUE_ATTR}]`,
        `[${DIRECT_ID_CLASS_STATE_RESCUE_ATTR}]`,
        `[${RAW_SELF_MUTATION_RESCUE_ATTR}]`,
        `[${RAW_NAMED_FUNCTION_RESCUE_ATTR}]`,
        `[${RAW_SCRIPT_TIMELINE_RESCUE_ATTR}]`,
        `[${RAW_RADIO_RESET_RESCUE_ATTR}]`,
        `[${PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR}]`,
    ].join(',');
    return new Set([...root.querySelectorAll(selector)]).size;
}


export function maintenanceReachableInteractionEvidence(root, routeSummary, checkedDepth, pseudoDepth, raw) {
    if (!root?.querySelectorAll) {
        return { contentInteractiveElementCount: 0, installedInteractionRouteCount: 0, noInteractionStructure: false };
    }
    const outerDetails = root.matches?.('details') ? root : root.querySelector?.(':scope > details');
    const outerSummary = outerDetails?.querySelector?.(':scope > summary') || null;
    const interactiveSelector = [
        'button', 'input:not([type="hidden"])', 'select', 'textarea', 'a[href]',
        '[role="button"]', '[role="switch"]', '[role="tab"]', '[role="menuitem"]', '[role="radio"]',
        '[contenteditable="true"]', '[popovertarget]', '[commandfor]', '[tabindex]', 'summary',
    ].join(',');
    const contentInteractiveElementCount = diagnosticQueryContentAll(root, interactiveSelector)
        .filter(element => {
            if (outerSummary && (element === outerSummary || outerSummary.contains?.(element))) return false;
            if (element.matches?.(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`)) return false;
            return true;
        }).length;

    const installedInteractionRouteCount = Number(routeSummary.adjacent || 0)
        + Number(routeSummary.layers || 0)
        + Number(routeSummary.labelInternal || 0)
        + Number(routeSummary.labelAdjacent || 0)
        + Number(routeSummary.maskReveal || 0)
        + Number(routeSummary.listDetail || 0)
        + Number(routeSummary.stateSibling || 0)
        + Number(routeSummary.stateCrossTree || 0)
        + Number(routeSummary.buttonAdjacent || 0)
        + Number(routeSummary.clickableAdjacent || 0)
        + Number(routeSummary.clickablePopup || 0)
        + Number(routeSummary.checkedIdTarget || 0)
        + Number(routeSummary.focusToChecked || 0)
        + Number(routeSummary.checkedTextRule || 0)
        + Number(routeSummary.crossParentChecked || 0)
        + Number(routeSummary.checkedHasState || 0)
        + Number(routeSummary.detachedCheckedHas || 0)
        + Number(routeSummary.pairedCheckedState || 0)
        + Number(routeSummary.exclusiveStackedState || 0)
        + Number(routeSummary.channelDialCycle || 0)
        + Number(routeSummary.reversibleChecked || 0)
        + Number(routeSummary.containerReveal || 0)
        + Number(routeSummary.selfMutation || 0)
        + Number(routeSummary.classStateProgram || 0)
        + Number(routeSummary.scriptTimeline || 0)
        + Number(routeSummary.changeProgram || 0)
        + Number(routeSummary.focusWithinPersistent || 0)
        + Number(routeSummary.unlabeledChecked || 0)
        + Number(routeSummary.selectionFallback || 0)
        + Number(routeSummary.disabledChoice || 0)
        + Number(routeSummary.inertAction || 0)
        + Number(routeSummary.staticChoiceSelection || 0)
        + Number(routeSummary.structuredStaticDisclosure || 0)
        + Number(routeSummary.fillInChoice || 0)
        + Number(routeSummary.passportDocument || 0);

    const rawStateProgram = /\bon(?:click|change|input)\s*=|addEventListener\s*\(\s*['"](?:click|change|input)['"]|setAttribute\s*\(\s*['"]data-|classList\.(?:add|remove|toggle)|\.checked\s*=|:checked\b|:target\b/i.test(String(raw || ''));
    const nestedDetailsCount = diagnosticQueryContentAll(root, 'details').filter(details => details !== outerDetails).length;
    const staticChoiceCandidateCount = findStaticChoiceSelectionCandidates(root).length;
    const structuredStaticDisclosureCandidateCount = findStructuredStaticDisclosureCandidates(root).length;
    const fillInChoiceCandidateCount = findFillInChoiceCandidates(root)
        .reduce((sum, candidate) => sum + Number(candidate.blanks?.length || 0), 0);
    const noInteractionStructure = !rabbitMirrorTextPresentation(root) && contentInteractiveElementCount === 0
        && installedInteractionRouteCount === 0
        && staticChoiceCandidateCount === 0
        && structuredStaticDisclosureCandidateCount === 0
        && fillInChoiceCandidateCount === 0
        && Number(checkedDepth?.checkedRuleCount || 0) === 0
        && Number(pseudoDepth?.pseudoRuleCount || 0) === 0
        && nestedDetailsCount === 0
        && !rawStateProgram;
    return { contentInteractiveElementCount, installedInteractionRouteCount, noInteractionStructure };
}


function maintenanceKnownInteractionEvidence(root, full, code) {
    const raw = decodeHtmlEntities(getRawAssistantMessageForRenderedRoot(root) || '');
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(raw, root);
    const rawMirrorHtml = String(rawRoot?.outerHTML || raw || '');
    const stateProgram = /\bon(?:click|change|input)\s*=|setAttribute\s*\(\s*['"]data-|classList\.(?:add|remove|toggle)|\.checked\s*=|:checked\b/i.test(rawMirrorHtml);
    const checkedControlsLost = !!full.stateControlsLost;
    const lostInlineStatePrograms = Math.max(0, Number((full.rawMirrorInlineEvents ?? full.rawInlineEvents) || 0) - Number((full.renderedMirrorInlineEvents ?? full.renderedInlineEvents) || 0));
    const recoveredInlineStatePrograms = recoveredInlineStateProgramCount(root);
    const strippedStateProgram = lostInlineStatePrograms > recoveredInlineStatePrograms && stateProgram;
    const decorativeOverlayCandidateCount = findDecorativeOverlayPassThroughCandidates(root).length;
    const scopeEvidence = maintenanceInteractionScopeEvidence(root);
    const checkedDepth = maintenanceCheckedInteractionDepth(root);
    const pseudoDepth = maintenancePseudoInteractionDepth(root);
    const routeSummary = diagnosticRouteSummary(root);
    const otherRouteCount = routeSummary.adjacent + routeSummary.layers + routeSummary.labelInternal + routeSummary.labelAdjacent
        + routeSummary.maskReveal + routeSummary.listDetail + routeSummary.stateSibling + routeSummary.buttonAdjacent
        + routeSummary.clickableAdjacent + routeSummary.clickablePopup + routeSummary.checkedIdTarget + routeSummary.focusToChecked
        + routeSummary.checkedTextRule + routeSummary.crossParentChecked + routeSummary.checkedHasState + routeSummary.detachedCheckedHas + routeSummary.pairedCheckedState + routeSummary.expandedOpacity
        + routeSummary.reversibleChecked + routeSummary.radioReset
        + routeSummary.containerReveal + routeSummary.selfMutation + routeSummary.classStateProgram + routeSummary.scriptTimeline + routeSummary.changeProgram
        + routeSummary.focusWithinPersistent + routeSummary.unlabeledChecked + routeSummary.selectionFallback + routeSummary.disabledChoice + routeSummary.inertAction + routeSummary.staticChoiceSelection + routeSummary.structuredStaticDisclosure + routeSummary.fillInChoice + routeSummary.passportDocument;
    const innerDetailsCount = diagnosticQueryContentAll(root, 'details').length;
    const hasTargetRoute = !!root?.querySelector?.('a[href^="#"]') && /:target\b/i.test(raw);
    const hasPopoverRoute = !!root?.querySelector?.('[popovertarget], [commandfor], [popover]');
    const pseudoVisualOnly = pseudoDepth.pseudoVisualOnlyRaw
        && checkedDepth.meaningfulCheckedRuleCount === 0
        && otherRouteCount === 0
        && innerDetailsCount === 0
        && !hasTargetRoute
        && !hasPopoverRoute;
    const rawRootForCheckedClass = chooseMatchingRawRabbitMirrorRoot(raw, root);
    const missingCheckedSubjectClassCandidateCount = rawRootForCheckedClass
        ? parseMissingCheckedSubjectClassRules(rawRootForCheckedClass).length
        : 0;
    const missingCheckedSubjectClassRescueCount = Number.parseInt(root.getAttribute?.(MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR) || '0', 10) || 0;
    const missingCheckedSubjectClassMissingCount = Math.max(0, missingCheckedSubjectClassCandidateCount - missingCheckedSubjectClassRescueCount);
    const radioGroupInspection = inspectSanitizedRadioGroupLoss(root);
    const radioGroupLossCandidateCount = Number(radioGroupInspection.candidateCount) || 0;
    const radioGroupRescueCount = Number(radioGroupInspection.rescuedCount) || 0;
    const selectionOnlyRepairCandidateCount = checkedDepth.checkedSelectionOnly
        ? findSelectionOnlyRadioFallbackCandidates(root).length
        : 0;
    const crossParentCheckedCandidates = findCrossParentCheckedRuleFallbackCandidates(root);
    const crossParentCheckedRuleVerifiedCount = crossParentCheckedCandidates
        .filter(candidate => crossParentCheckedCandidateVerified(candidate))
        .length;
    // “装上兜底”不等于“修复已验证”。只有当前规则/目标指纹通过隐藏副本的
    // 第二状态实测后才从 finding 中移除；验证失败或尚未验证都会继续保留黄灯。
    const crossParentCheckedRuleCandidateCount = crossParentCheckedCandidates
        .filter(candidate => !candidate.input.hasAttribute(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR)
            || !crossParentCheckedCandidateVerified(candidate))
        .length;
    const checkedHasStateRuleCandidateCount = parseBrokenCheckedHasStateRules(root).length;
    const checkedHasStateRuleRescueCount = Number.parseInt(root.getAttribute?.(CHECKED_HAS_STATE_RULE_COUNT_ATTR) || '0', 10) || 0;
    const checkedHasStateRuleMissingCount = Math.max(0, checkedHasStateRuleCandidateCount - checkedHasStateRuleRescueCount);
    const detachedCheckedHasRuleCandidateCount = parseDetachedCheckedHasRules(root).length;
    const detachedCheckedHasRuleRescueCount = Number.parseInt(root.getAttribute?.(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR) || '0', 10) || 0;
    const detachedCheckedHasRuleMissingCount = Math.max(0, detachedCheckedHasRuleCandidateCount - detachedCheckedHasRuleRescueCount);
    const pairedCheckedStateCandidateCount = findPairedCheckedStateCandidates(root).length;
    const pairedCheckedStateRescueCount = Number.parseInt(root.getAttribute?.(PAIRED_CHECKED_STATE_COUNT_ATTR) || '0', 10) || 0;
    const pairedCheckedStateMissingCount = Math.max(0, pairedCheckedStateCandidateCount - pairedCheckedStateRescueCount);
    const exclusiveStackedStateCandidateCount = findExclusiveStackedStateCandidates(root).length;
    const exclusiveStackedStateRescueCount = Number.parseInt(root.getAttribute?.(EXCLUSIVE_STACKED_STATE_COUNT_ATTR) || '0', 10) || 0;
    const exclusiveStackedStateMissingCount = Math.max(0, exclusiveStackedStateCandidateCount - exclusiveStackedStateRescueCount);
    const channelDialCycleCandidateCount = findChannelDialCycleCandidates(root).length;
    const channelDialCycleRescueCount = Number.parseInt(root.getAttribute?.(CHANNEL_DIAL_CYCLE_COUNT_ATTR) || '0', 10) || 0;
    const channelDialCycleMissingCount = Math.max(0, channelDialCycleCandidateCount - channelDialCycleRescueCount);
    const oneWayCheckedResultCandidateCount = findOneWayCheckedResultCandidates(root)
        .filter(candidate => !candidate.target?.hasAttribute?.(REVERSIBLE_CHECKED_RESULT_TARGET_ATTR))
        .length;
    const reversibleCheckedResultRescueCount = Number.parseInt(root.getAttribute?.(REVERSIBLE_CHECKED_RESULT_ROOT_ATTR) || '0', 10) || 0;
    const disabledOnlyChoiceCandidateCount = findDisabledOnlyChoiceGroupCandidates(root).length;
    const inertActionButtonCandidateCount = findInertActionButtonCandidates(root).length;
    const staticChoiceSelectionCandidateCount = findStaticChoiceSelectionCandidates(root).length;
    const staticChoiceSelectionRescueCount = Number.parseInt(root.getAttribute?.(STATIC_CHOICE_SELECTION_COUNT_ATTR) || '0', 10) || 0;
    const structuredStaticDisclosureCandidateCount = otherRouteCount === 0
        && checkedDepth.meaningfulCheckedRuleCount === 0
        && pseudoDepth.meaningfulPseudoRuleCount === 0
        ? findStructuredStaticDisclosureCandidates(root).length
        : 0;
    const structuredStaticDisclosureRescueCount = Number.parseInt(root.getAttribute?.(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR) || '0', 10) || 0;
    const fillInChoiceCandidateCount = findFillInChoiceCandidates(root)
        .reduce((sum, candidate) => sum + Number(candidate.blanks?.length || 0), 0);
    const fillInChoiceRescueCount = Number.parseInt(root.getAttribute?.(FILL_IN_CHOICE_COUNT_ATTR) || '0', 10) || 0;
    const focusWithinPersistentCandidateCount = findFocusWithinPersistentCandidates(root).length;
    const focusWithinPersistentRescueCount = Number(routeSummary.focusWithinPersistent || 0);
    const focusWithinPersistentMissingCount = Math.max(0, focusWithinPersistentCandidateCount - focusWithinPersistentRescueCount);
    const rawScriptTimelineCandidateCount = collectSafeRawScriptTimelinePrograms(root).length;
    const rawScriptTimelineRescueCount = Number(routeSummary.scriptTimeline || 0);
    const rawScriptTimelineMissingCount = Math.max(0, rawScriptTimelineCandidateCount - rawScriptTimelineRescueCount);
    // 只有选中项外观变化时，补 Hover 也不会生成缺失的第二层内容，不能误导为可修复交互。
    const touchHoverMissing = !checkedDepth.checkedSelectionOnly
        && isLikelyTouchDevice()
        // 只把真正承担第二层内容／状态变化的 Hover 视为需要触屏兜底。
        // 普通按钮变色、把手轻微位移等装饰 Hover 不应让已存在点击状态程序的作品持续报错。
        && pseudoDepth.meaningfulPseudoRuleCount > 0
        && focusWithinPersistentCandidateCount === 0
        && !root.querySelector?.(`[${TOUCH_HOVER_STYLE_ATTR}]`)
        && root.getAttribute?.('data-rabbit-mirror-touch-hover-fallback') !== 'true';
    const unscopedControls = (full.inputCount > 0 || full.buttonCount > 0)
        && root.dataset?.rabbitMirrorInteractionScoped !== 'true';
    const reachability = maintenanceReachableInteractionEvidence(root, routeSummary, checkedDepth, pseudoDepth, raw);
    return { checkedControlsLost, stateControlsLost: !!full.stateControlsLost, strippedStateProgram, lostInlineStatePrograms, recoveredInlineStatePrograms, decorativeOverlayCandidateCount, touchHoverMissing, unscopedControls, missingCheckedSubjectClassCandidateCount, missingCheckedSubjectClassRescueCount, missingCheckedSubjectClassMissingCount, radioGroupLossCandidateCount, radioGroupRescueCount, selectionOnlyRepairCandidateCount, disabledOnlyChoiceCandidateCount, inertActionButtonCandidateCount, staticChoiceSelectionCandidateCount, staticChoiceSelectionRescueCount, structuredStaticDisclosureCandidateCount, structuredStaticDisclosureRescueCount, fillInChoiceCandidateCount, fillInChoiceRescueCount, focusWithinPersistentCandidateCount, focusWithinPersistentRescueCount, focusWithinPersistentMissingCount, rawScriptTimelineCandidateCount, rawScriptTimelineRescueCount, rawScriptTimelineMissingCount, crossParentCheckedRuleCandidateCount, crossParentCheckedRuleVerifiedCount, checkedHasStateRuleCandidateCount, checkedHasStateRuleRescueCount, checkedHasStateRuleMissingCount, detachedCheckedHasRuleCandidateCount, detachedCheckedHasRuleRescueCount, detachedCheckedHasRuleMissingCount, pairedCheckedStateCandidateCount, pairedCheckedStateRescueCount, pairedCheckedStateMissingCount, exclusiveStackedStateCandidateCount, exclusiveStackedStateRescueCount, exclusiveStackedStateMissingCount, channelDialCycleCandidateCount, channelDialCycleRescueCount, channelDialCycleMissingCount, oneWayCheckedResultCandidateCount, reversibleCheckedResultRescueCount, pseudoVisualOnly, raw, ...scopeEvidence, ...checkedDepth, ...pseudoDepth, ...reachability };
}



function maintenanceStyleRuleCountFromText(cssText) {
    return (String(cssText || '').match(/[^@{}][^{}]*\{[^{}]*\}/g) || []).length;
}


function maintenanceStylelessAuthoredRuleCount(root) {
    let rendered = 0;
    let renderedStateVisual = 0;
    for (const style of root?.querySelectorAll?.('style') || []) {
        if ([...(style.attributes || [])].some(attribute => /^data-rabbit-mirror-/i.test(attribute.name))) continue;
        const cssText = String(style.textContent || '');
        rendered += maintenanceStyleRuleCountFromText(cssText);
        renderedStateVisual += countMeaningfulStateVisualRules(cssText);
    }
    let raw = 0;
    let rawStateVisual = 0;
    try {
        const decodedRaw = decodeHtmlEntities(String(getRawAssistantMessageForRenderedRoot(root) || ''));
        const isolated = extractMaintenanceMirrorSourceBySummary(decodedRaw, root) || decodedRaw;
        const css = [...String(isolated || '').matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)]
            .map(match => String(match[1] || ''))
            .join('\n');
        raw = maintenanceStyleRuleCountFromText(css);
        rawStateVisual = countMeaningfulStateVisualRules(css);
    } catch {}
    return {
        rendered,
        raw,
        total: Math.max(rendered, raw),
        renderedStateVisual,
        rawStateVisual,
        stateVisual: Math.max(renderedStateVisual, rawStateVisual),
    };
}


function maintenanceStylelessComputedVisualMaturity(elements = []) {
    let computedVisualCount = 0;
    let computedVisualSignalCount = 0;
    let inlineStructuralVisualCount = 0;
    for (const element of elements || []) {
        if (!element?.getAttribute || element.matches?.('input,button,select,textarea,label,img,svg,canvas,video,audio,iframe,object,embed')) continue;
        const inline = String(element.getAttribute('style') || '').toLowerCase();
        const strongInlineVisual = [
            /(?:^|;)\s*background(?:-color|-image)?\s*:/,
            /(?:^|;)\s*border(?:-[\w-]+)?\s*:/,
            /(?:^|;)\s*box-shadow\s*:/,
            /(?:^|;)\s*border-radius\s*:/,
            /(?:^|;)\s*display\s*:\s*(?:flex|grid|inline-flex|inline-grid)\b/,
        ].some(pattern => pattern.test(inline));
        if (strongInlineVisual) inlineStructuralVisualCount += 1;

        const style = maintenanceMobileLayoutComputedStyle(element);
        if (!style) continue;
        let signals = 0;
        const background = String(style.backgroundColor || '').toLowerCase();
        if (!/(?:^|;)\s*background(?:-color|-image)?\s*:/.test(inline)
            && background && background !== 'transparent' && background !== 'rgba(0, 0, 0, 0)') signals += 1;
        const borderWidth = Math.max(
            Number.parseFloat(style.borderTopWidth || '0') || 0,
            Number.parseFloat(style.borderRightWidth || '0') || 0,
            Number.parseFloat(style.borderBottomWidth || '0') || 0,
            Number.parseFloat(style.borderLeftWidth || '0') || 0,
        );
        if (!/(?:^|;)\s*border(?:-[\w-]+)?\s*:/.test(inline) && borderWidth >= 1) signals += 1;
        if (!/(?:^|;)\s*box-shadow\s*:/.test(inline) && String(style.boxShadow || '').toLowerCase() !== 'none') signals += 1;
        const radius = Math.max(
            Number.parseFloat(style.borderTopLeftRadius || '0') || 0,
            Number.parseFloat(style.borderTopRightRadius || '0') || 0,
            Number.parseFloat(style.borderBottomLeftRadius || '0') || 0,
            Number.parseFloat(style.borderBottomRightRadius || '0') || 0,
        );
        if (!/(?:^|;)\s*border-radius\s*:/.test(inline) && radius >= 4) signals += 1;
        const display = String(style.display || '').toLowerCase();
        if (!/(?:^|;)\s*display\s*:/.test(inline) && /^(?:flex|grid|inline-flex|inline-grid)$/.test(display)) signals += 1;
        const padding = ['paddingTop','paddingRight','paddingBottom','paddingLeft']
            .reduce((sum, key) => sum + (Number.parseFloat(style[key] || '0') || 0), 0);
        if (!/(?:^|;)\s*padding(?:-[\w-]+)?\s*:/.test(inline) && padding >= 16) signals += 1;
        if (signals >= 2) computedVisualCount += 1;
        computedVisualSignalCount += signals;
    }
    return { computedVisualCount, computedVisualSignalCount, inlineStructuralVisualCount };
}


function maintenanceStylelessStructuredInfo(root, full = null) {
    const empty = {
        candidate: false,
        authoredRuleCount: 0,
        textLength: 0,
        elementCount: 0,
        classedCount: 0,
        distinctClassCount: 0,
        inlineStyledCount: 0,
        inlineDeclarationCount: 0,
        richInlineCount: 0,
        inlineStructuralVisualCount: 0,
        computedVisualCount: 0,
        computedVisualSignalCount: 0,
        formControlCount: 0,
        meaningfulFormControlCount: 0,
        choiceControlCount: 0,
        nonChoiceFormControlCount: 0,
        stateVisualRuleCount: 0,
    };
    if (!root?.querySelectorAll || root.hasAttribute?.(STYLELESS_STRUCTURED_RESCUE_ATTR)) return empty;
    const details = root.matches?.('details') ? root : root.querySelector?.('details');
    if (!details) return empty;
    const authored = maintenanceStylelessAuthoredRuleCount(root);

    const boundedTree = collectBoundedElementDescendants(details, STYLELESS_STRUCTURED_MAX_DESCENDANTS);
    if (boundedTree.exceeded) return empty;
    const elements = boundedTree.elements.filter(element => {
        const tag = String(element.tagName || '').toLowerCase();
        if (!tag || ['summary', 'style', 'script', 'template', 'br'].includes(tag)) return false;
        return !maintenanceMobileLayoutIsInternal(element);
    });
    const textLength = Number(full?.rawBodyTextLength || full?.renderedBodyTextLength || maintenanceMobileLayoutTextLength(details) || 0);
    const elementCount = Number(full?.rawBodyElementCount || full?.renderedBodyElementCount || elements.length || 0);
    const visualProgramCount = Math.max(Number(full?.rawBodyVisualProgramCount || 0), Number(full?.renderedBodyVisualProgramCount || 0));
    const semanticElementCount = Math.max(Number(full?.rawBodySemanticElementCount || 0), Number(full?.renderedBodySemanticElementCount || 0));
    const classed = elements.filter(element => String(element.getAttribute?.('class') || '').trim());
    const distinctClasses = new Set(classed.flatMap(element => String(element.getAttribute('class') || '').split(/\s+/).filter(Boolean)));
    let inlineStyledCount = 0;
    let inlineDeclarationCount = 0;
    const richInlineCount = elements.filter(element => {
        const style = String(element.getAttribute?.('style') || '');
        if (style.trim()) inlineStyledCount += 1;
        const declarations = (style.match(/(?:^|;)\s*[-\w]+\s*:/g) || []).length;
        inlineDeclarationCount += declarations;
        return declarations >= 5 || /(?:background(?:-image)?\s*:[^;]*(?:url\(|gradient\()|mask(?:-image)?\s*:|clip-path\s*:|filter\s*:)/i.test(style);
    }).length;
    const maturity = maintenanceStylelessComputedVisualMaturity(elements);
    const formControls = elements.filter(control => control.matches?.('input,button,select,textarea'));
    const formControlCount = formControls.length;
    const controlKinds = analyzeStylelessControlKinds(formControls.map(control => ({
        tagName: String(control.tagName || '').toLowerCase(),
        type: String(control.getAttribute?.('type') || control.type || '').toLowerCase(),
    })));
    const meaningfulFormControlCount = formControls.filter(control => {
        if (control.matches?.('button,select,textarea')) return maintenanceMobileLayoutTextLength(control) >= 1 || !!control.getAttribute?.('aria-label');
        if (!control.id) return false;
        let label = null;
        try { label = details.querySelector(`label[for="${cssEscape(control.id)}"]`); } catch {}
        return maintenanceMobileLayoutTextLength(label) >= 2 || !!control.getAttribute?.('aria-label');
    }).length;

    const namedStructure = classed.length >= 5 && distinctClasses.size >= 5;
    const bareChoiceNarrative = controlKinds.choiceCount >= 2
        && controlKinds.safeChoiceOnly
        && elementCount >= 8;

    // 1.4.30.20: authored rule count alone is not evidence that the browser received an
    // effective visual program. Empty/non-matching rules and a few type-only declarations
    // used to suppress this rescue, while three native radios also failed the old <=1 gate.
    // Continue to fail closed for text inputs, buttons, selects and textareas; only a bounded
    // radio/checkbox narrative may enter the neutral typographic fallback.
    const candidate = textLength >= 140
        && elementCount >= 8
        && semanticElementCount >= 1
        && visualProgramCount === 0
        && (namedStructure || bareChoiceNarrative)
        && inlineStyledCount <= 2
        && inlineDeclarationCount <= 9
        && richInlineCount === 0
        && maturity.inlineStructuralVisualCount === 0
        && maturity.computedVisualSignalCount === 0
        && controlKinds.safeChoiceOnly;
    return {
        candidate,
        authoredRuleCount: authored.total,
        textLength,
        elementCount,
        classedCount: classed.length,
        distinctClassCount: distinctClasses.size,
        inlineStyledCount,
        inlineDeclarationCount,
        richInlineCount,
        inlineStructuralVisualCount: maturity.inlineStructuralVisualCount,
        computedVisualCount: maturity.computedVisualCount,
        computedVisualSignalCount: maturity.computedVisualSignalCount,
        formControlCount,
        meaningfulFormControlCount,
        choiceControlCount: controlKinds.choiceCount,
        nonChoiceFormControlCount: controlKinds.nonChoiceCount,
        stateVisualRuleCount: authored.stateVisual,
    };
}


function maintenanceStylelessStructuredCss() {
    return `
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_SHELL_ATTR}] { width:100% !important; max-width:760px !important; min-width:0 !important; margin:8px auto !important; padding:clamp(10px,3vw,18px) clamp(4px,2vw,12px) !important; box-sizing:border-box !important; border:0 !important; border-radius:0 !important; background:transparent !important; box-shadow:none !important; overflow:visible !important; line-height:1.72 !important; }
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_HEADER_ATTR}] { display:block !important; margin:0 0 14px !important; padding:0 0 9px !important; border:0 !important; border-bottom:1px solid color-mix(in srgb,currentColor 24%,transparent) !important; border-radius:0 !important; background:transparent !important; box-shadow:none !important; }
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_TITLE_ATTR}] { display:block !important; margin:0 0 6px !important; font-size:clamp(1.08rem,4.8vw,1.45rem) !important; line-height:1.3 !important; font-weight:800 !important; letter-spacing:.02em !important; overflow-wrap:anywhere !important; }
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_SUBTITLE_ATTR}] { display:block !important; margin:0 0 10px !important; font-size:.88em !important; line-height:1.55 !important; opacity:.76 !important; overflow-wrap:anywhere !important; }
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_SECTION_ATTR}] { display:block !important; width:100% !important; max-width:100% !important; min-width:0 !important; margin:13px 0 !important; padding:0 !important; box-sizing:border-box !important; border:0 !important; border-radius:0 !important; background:transparent !important; box-shadow:none !important; overflow:visible !important; }
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_TEXT_ATTR}] { max-width:100% !important; min-width:0 !important; line-height:1.75 !important; overflow-wrap:anywhere !important; word-break:break-word !important; }
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_CHOICE_ATTR}] { inline-size:18px !important; block-size:18px !important; margin:2px 8px 2px 2px !important; vertical-align:middle !important; accent-color:currentColor !important; }
[${STYLELESS_STRUCTURED_RESCUE_ATTR}] [${STYLELESS_STRUCTURED_CHOICE_LABEL_ATTR}] { display:inline-flex !important; align-items:center !important; gap:7px !important; min-height:32px !important; max-width:100% !important; margin:2px 10px 2px 0 !important; overflow-wrap:anywhere !important; }
`;
}


function installMaintenanceStylelessStructuredRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    const full = diagnosticFullChainSummary(root, diagnosticCodeRescueSummary(root));
    const info = maintenanceStylelessStructuredInfo(root, full);
    if (!info.candidate) return 0;

    const details = root.matches?.('details') ? root : root.querySelector?.('details');
    if (!details) return 0;
    const direct = [...details.children].filter(child => {
        const tag = String(child.tagName || '').toLowerCase();
        return tag && !['summary', 'style', 'script', 'template'].includes(tag) && !maintenanceMobileLayoutIsInternal(child);
    });
    const shell = direct.find(child => maintenanceMobileLayoutTextLength(child) >= 80 && Number(child.childElementCount || 0) >= 2) || direct[0];
    if (!shell) return 0;

    const marked = new Set();
    const mark = (element, attr) => {
        if (!element?.setAttribute || element.hasAttribute(attr)) return;
        element.setAttribute(attr, 'true');
        marked.add(element);
    };
    mark(shell, STYLELESS_STRUCTURED_SHELL_ATTR);
    for (const element of [shell, ...shell.querySelectorAll('*')]) {
        if (maintenanceMobileLayoutIsInternal(element)) continue;
        const signature = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('role') || ''}`.toLowerCase();
        if (/(?:^|[-_\s])(?:header|masthead|head)(?:$|[-_\s])/.test(signature)) mark(element, STYLELESS_STRUCTURED_HEADER_ATTR);
        if (/(?:^|[-_\s])(?:title|heading|headline)(?:$|[-_\s])/.test(signature)) mark(element, STYLELESS_STRUCTURED_TITLE_ATTR);
        if (/(?:^|[-_\s])(?:subtitle|sub-title|subhead|kicker|meta)(?:$|[-_\s])/.test(signature)) mark(element, STYLELESS_STRUCTURED_SUBTITLE_ATTR);
        if (/(?:^|[-_\s])(?:box|panel|section|speech|confession|track|card|note)(?:$|[-_\s])/.test(signature)) mark(element, STYLELESS_STRUCTURED_SECTION_ATTR);
        if (/(?:^|[-_\s])(?:text|content|speech|confession|rhyme|desc|description|body)(?:$|[-_\s])/.test(signature)
            || element.matches?.('p,blockquote,li')) mark(element, STYLELESS_STRUCTURED_TEXT_ATTR);
    }
    for (const control of shell.querySelectorAll('input[type="radio"],input[type="checkbox"]')) {
        mark(control, STYLELESS_STRUCTURED_CHOICE_ATTR);
        let label = control.closest?.('label') || null;
        if (!label && control.id) {
            try { label = shell.querySelector(`label[for="${cssEscape(control.id)}"]`); } catch {}
        }
        if (label) mark(label, STYLELESS_STRUCTURED_CHOICE_LABEL_ATTR);
    }
    let style = root.querySelector(`style[${STYLELESS_STRUCTURED_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(STYLELESS_STRUCTURED_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = maintenanceStylelessStructuredCss();
    root.setAttribute(STYLELESS_STRUCTURED_RESCUE_ATTR, 'true');
    root.setAttribute(STYLELESS_STRUCTURED_COUNT_ATTR, String(marked.size));
    return Math.max(1, marked.size);
}


function maintenanceFallbackFullSummary(root) {
    const body = diagnosticMessageBody(root) || root;
    const snapshot = diagnosticContentSnapshot(body);
    const renderedHtml = snapshot.html;
    const renderedText = snapshot.text;
    const styleTexts = diagnosticQueryContentAll(body, 'style').map(style => String(style.textContent || '')).join('\n');
    return {
        renderedEscapedTags: /&lt;\/?[a-z]/i.test(renderedHtml) || /<toto\b/i.test(renderedText),
        structureTruncated: false,
        damagedDataUriCandidate: false,
        sourceCandidate: false,
        hostCssParserError: false,
        hostCssParserErrorText: '',
        rawUnencodedSvgDataUri: false,
        rawCssCommentCount: 0,
        rawCssIdSelectorCount: 0,
        severeStructureLoss: false,
        visibleBodyMissing: false,
        rawSourceBodyMissing: false,
        rawCssTruncated: false,
        rawBodyTagCount: 0,
        rawBodyTextLength: 0,
        rawBodyElementCount: 0,
        rawBodySemanticElementCount: 0,
        rawBodyVisualProgramCount: 0,
        rawBodyEmptyShell: false,
        sourceTruncationNoticeInstalled: false,
        renderedBodyElementCount: 0,
        renderedBodyTextLength: 0,
        renderedBodySemanticElementCount: 0,
        renderedBodyVisualProgramCount: 0,
        renderedBodyEmptyShell: false,
        languageForeignDominant: false,
        languageHanChars: 0,
        languageLatinLetters: 0,
        languageForeignWordCount: 0,
        languageForeignWords: [],
        rawToto: false,
        rawHtml: false,
        controlsLost: false,
        checkedCount: (styleTexts.match(/:checked\b/gi) || []).length,
        rawInlineEvents: 0,
        renderedInlineEvents: 0,
        hoverCount: (styleTexts.match(/:hover\b/gi) || []).length,
        activeCount: (styleTexts.match(/:active\b/gi) || []).length,
        inputCount: body?.querySelectorAll?.('input,select,textarea')?.length || 0,
        buttonCount: body?.querySelectorAll?.('button')?.length || 0,
    };
}


function parseComputedRgbColor(value) {
    const text = String(value || '').trim().toLowerCase();
    if (!text || text === 'transparent') return null;
    const match = text.match(/^rgba?\(\s*([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:\s*(?:,|\/)\s*([\d.]+%?))?\s*\)$/i);
    if (!match) return null;
    const alphaText = String(match[4] || '1');
    const alpha = alphaText.endsWith('%') ? Number.parseFloat(alphaText) / 100 : Number.parseFloat(alphaText);
    return {
        r: Math.max(0, Math.min(255, Number.parseFloat(match[1]) || 0)),
        g: Math.max(0, Math.min(255, Number.parseFloat(match[2]) || 0)),
        b: Math.max(0, Math.min(255, Number.parseFloat(match[3]) || 0)),
        a: Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1,
    };
}


function compositeReadableColor(foreground, background, alpha = 1) {
    const a = Math.max(0, Math.min(1, Number(alpha) || 0));
    return {
        r: foreground.r * a + background.r * (1 - a),
        g: foreground.g * a + background.g * (1 - a),
        b: foreground.b * a + background.b * (1 - a),
        a: 1,
    };
}


function readableRelativeLuminance(color) {
    if (!color) return 0;
    const channel = value => {
        const normalized = Math.max(0, Math.min(255, Number(value) || 0)) / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}


function readableContrastRatio(a, b) {
    const l1 = readableRelativeLuminance(a);
    const l2 = readableRelativeLuminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}


function directReadableTextLength(element) {
    if (!element?.childNodes) return 0;
    return [...element.childNodes]
        .filter(node => node?.nodeType === 3)
        .map(node => String(node.textContent || '').replace(/\s+/g, ' ').trim())
        .join(' ')
        .trim().length;
}


function effectiveReadableOpacity(element, root) {
    let opacity = 1;
    for (let current = element; current && current.nodeType === 1; current = current.parentElement) {
        let style = null;
        try { style = globalThis.getComputedStyle?.(current) || null; } catch {}
        const local = Number.parseFloat(style?.opacity || '1');
        if (Number.isFinite(local)) opacity *= Math.max(0, Math.min(1, local));
        if (current === root) break;
    }
    return opacity;
}


function effectiveReadableBackground(element, root) {
    const layers = [];
    let foundOpaque = false;
    for (let current = element; current && current.nodeType === 1; current = current.parentElement) {
        let style = null;
        try { style = globalThis.getComputedStyle?.(current) || null; } catch {}
        const parsed = parseComputedRgbColor(style?.backgroundColor);
        const backgroundImage = String(style?.backgroundImage || 'none').trim().toLowerCase();
        // A transparent gradient/picture cannot be reduced to one safe comparison color.
        // Skip it rather than repaint text against a guessed parent surface.
        if (backgroundImage && backgroundImage !== 'none' && (!parsed || parsed.a < 0.82)) return null;
        if (parsed && parsed.a > 0.02) {
            layers.push(parsed);
            if (parsed.a >= 0.96) { foundOpaque = true; break; }
        }
        if (current === root) break;
    }
    if (!layers.length || !foundOpaque) return null;
    let background = { r: layers[layers.length - 1].r, g: layers[layers.length - 1].g, b: layers[layers.length - 1].b, a: 1 };
    for (let index = layers.length - 2; index >= 0; index -= 1) {
        background = compositeReadableColor(layers[index], background, layers[index].a);
    }
    return background;
}


function severeTextContrastCandidate(element, root) {
    if (!element || element === root || element.closest?.(`[${TOOL_ENTRY_HOST_ATTR}]`)) return null;
    if (element.closest?.('summary')) return null;
    const tag = String(element.tagName || '').toUpperCase();
    if (['STYLE', 'SCRIPT', 'TEMPLATE', 'NOSCRIPT', 'SVG', 'PATH', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return null;
    const textLength = directReadableTextLength(element);
    if (textLength < 8 && !['BUTTON', 'LABEL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) return null;
    let style = null;
    try { style = globalThis.getComputedStyle?.(element) || null; } catch { return null; }
    if (!style || style.display === 'none' || style.visibility === 'hidden') return null;
    const effectiveOpacity = effectiveReadableOpacity(element, root);
    // Opacity is frequently part of a legitimate hidden/reveal state. Only repair fully
    // visible text here; low-opacity content stays under the interaction rescue system.
    if (!Number.isFinite(effectiveOpacity) || effectiveOpacity < 0.6) return null;
    const foreground = parseComputedRgbColor(style.color);
    const background = effectiveReadableBackground(element, root);
    if (!foreground || !background) return null;
    const effectiveForeground = compositeReadableColor(foreground, background, Math.max(0, Math.min(1, foreground.a * effectiveOpacity)));
    const ratio = readableContrastRatio(effectiveForeground, background);
    // Only flag severe failures. Secondary/meta text is allowed to be softer; this threshold
    // is intentionally below WCAG AA so the maintenance rabbit does not restyle normal design.
    if (ratio >= 2.05) return null;
    return { element, ratio, foreground, background, effectiveOpacity, textLength };
}


export function findSevereTextContrastCandidates(root, limit = 80) {
    if (!root?.querySelectorAll || typeof globalThis.getComputedStyle !== 'function') return [];
    const selector = 'p,li,blockquote,h1,h2,h3,h4,h5,h6,span,strong,em,b,i,label,button,td,th,dt,dd,figcaption,small,div,section,article';
    const result = [];
    for (const element of root.querySelectorAll(selector)) {
        const candidate = severeTextContrastCandidate(element, root);
        if (!candidate) continue;
        result.push(candidate);
        if (result.length >= Math.max(1, Number(limit) || 80)) break;
    }
    return result;
}


function readableForegroundForBackground(original, background, targetRatio = 4.2) {
    const dark = { r: 18, g: 18, b: 20, a: 1 };
    const light = { r: 248, g: 248, b: 248, a: 1 };
    const target = readableRelativeLuminance(background) > 0.42 ? dark : light;
    let best = target;
    for (let step = 1; step <= 20; step += 1) {
        const t = step / 20;
        const mixed = {
            r: original.r * (1 - t) + target.r * t,
            g: original.g * (1 - t) + target.g * t,
            b: original.b * (1 - t) + target.b * t,
            a: 1,
        };
        if (readableContrastRatio(mixed, background) >= targetRatio) { best = mixed; break; }
    }
    return best;
}


function repairSevereTextContrast(root) {
    const candidates = findSevereTextContrastCandidates(root);
    if (!candidates.length) {
        root?.removeAttribute?.(TEXT_CONTRAST_RESCUE_ROOT_ATTR);
        return 0;
    }
    let repaired = 0;
    for (const candidate of candidates) {
        const element = candidate.element;
        if (!element?.isConnected || !root.contains?.(element)) continue;
        const next = readableForegroundForBackground(candidate.foreground, candidate.background, 4.2);
        element.style?.setProperty?.('color', `rgb(${Math.round(next.r)}, ${Math.round(next.g)}, ${Math.round(next.b)})`, 'important');
        element.setAttribute?.(TEXT_CONTRAST_RESCUE_ATTR, 'true');
        repaired += 1;
    }
    if (repaired) root.setAttribute?.(TEXT_CONTRAST_RESCUE_ROOT_ATTR, String(repaired));
    return repaired;
}


function createMaintenanceFinding({ id, stage, label, evidence = [], mode, confidence = 1 }) {
    return {
        id: String(id || ''),
        stage: String(stage || 'structure'),
        label: String(label || ''),
        evidence: (Array.isArray(evidence) ? evidence : [evidence]).map(value => String(value || '')).filter(Boolean),
        mode: String(mode || ''),
        confidence: Math.max(0, Math.min(1, Number(confidence) || 0)),
    };
}


function maintenanceFindingKey(finding) {
    return `${finding?.stage || ''}:${finding?.id || ''}`;
}


function dedupeMaintenanceFindings(findings) {
    const map = new Map();
    for (const finding of findings || []) {
        if (!finding?.id || !finding?.label) continue;
        const key = maintenanceFindingKey(finding);
        const previous = map.get(key);
        if (!previous || Number(finding.confidence || 0) > Number(previous.confidence || 0)) map.set(key, finding);
    }
    return [...map.values()];
}


function buildMaintenanceFindings(root, {
    full = {},
    code = {},
    interaction = {},
    textClippingCandidateCount = 0,
    textContrastCandidateCount = 0,
    nestedDetailsPopupCandidateCount = 0,
    mobileInlineAnnotationCandidateCount = 0,
    mobileLayout = null,
    viewportLayout = null,
} = {}) {
    const findings = [];
    const add = finding => findings.push(createMaintenanceFinding(finding));

    const sanitizerDroppedStyleCount = Number.parseInt(root?.getAttribute?.(RABBIT_MIRROR_SANITIZER_STYLE_DROP_ATTR) || '0', 10) || 0;
    if (sanitizerDroppedStyleCount > 0) {
        add({
            id: 'sanitizer-local-style-dropped', stage: 'structure', mode: 'style',
            label: `安全净化器删除了 ${sanitizerDroppedStyleCount} 份仍含本地规则的样式表；外框、默认隐藏态或交互显示规则可能因此丢失`,
            evidence: [`sanitizerDroppedStyleCount=${sanitizerDroppedStyleCount}`], confidence: 1,
        });
    }

    if (full.rawSourceBodyMissing && !full.sourceTruncationNoticeInstalled) {
        add({
            id: full.rawCssTruncated ? 'raw-css-truncated' : 'raw-body-missing',
            stage: 'source',
            mode: 'source',
            label: full.rawCssTruncated ? '原始输出在样式中途截断，正文没有生成' : '原始输出缺少可显示的正文主体',
            evidence: [`rawSourceBodyMissing=${!!full.rawSourceBodyMissing}`, `rawCssTruncated=${!!full.rawCssTruncated}`],
            confidence: 1,
        });
    }
    if (full.visibleBodyMissing) {
        add({
            id: 'visible-body-missing', stage: 'source', mode: 'source',
            label: '展开后没有显示兔子镜主体，但原始源码仍可恢复',
            evidence: ['visibleBodyMissing=true'], confidence: 1,
        });
    }
    if (full.structureTruncated || full.damagedDataUriCandidate) {
        add({
            id: 'source-structure-damaged', stage: 'source', mode: 'source',
            label: '源码结构截断或 SVG Data URI 损坏',
            evidence: [`structureTruncated=${!!full.structureTruncated}`, `damagedDataUriCandidate=${!!full.damagedDataUriCandidate}`],
            confidence: 0.98,
        });
    }
    if (full.severeStructureLoss && !full.visibleBodyMissing && full.rawToto) {
        add({
            id: 'severe-render-structure-loss', stage: 'source', mode: 'source',
            label: '渲染主体大面积缺失，原始源码仍可恢复',
            evidence: ['severeStructureLoss=true', 'rawToto=true'], confidence: 0.96,
        });
    }
    if (full.hostCssParserError) {
        add({
            id: 'host-css-parser-error', stage: 'structure', mode: 'style',
            label: '宿主 CSS 解析失败',
            evidence: [String(full.hostCssParserErrorText || 'hostCssParserError=true')], confidence: 0.98,
        });
    }
    if (!full.rawSourceBodyMissing && ((full.sourceCandidate && full.sourceObscured) || (code.strictWhole && code.strictParseOk))) {
        add({
            id: 'source-obscured-or-code-shell', stage: 'source', mode: 'source',
            label: '显示层被代码壳或源码文本接管，可从原始消息恢复',
            evidence: [
                `sourceCandidate=${!!full.sourceCandidate}`,
                `sourceObscured=${!!full.sourceObscured}`,
                `strictWhole=${!!code.strictWhole}`,
                `strictParseOk=${!!code.strictParseOk}`,
                `currentMirrorNeedsSanitize=${!!code.currentMirrorNeedsSanitize}`,
            ],
            confidence: full.sourceObscured || code.strictParseOk ? 0.97 : 0.86,
        });
    }

    const stylelessStructured = maintenanceStylelessStructuredInfo(root, full);
    if (stylelessStructured.candidate) {
        add({
            id: 'styleless-structured-mirror', stage: 'structure', mode: 'style',
            label: '兔子镜正文结构完整，但当前可见节点没有形成有效视觉程序；可用无卡片的中性排版做本地降级救援',
            evidence: [
                `authoredRules=${stylelessStructured.authoredRuleCount}`,
                `text=${stylelessStructured.textLength}`,
                `elements=${stylelessStructured.elementCount}`,
                `classed=${stylelessStructured.classedCount}`,
                `distinctClasses=${stylelessStructured.distinctClassCount}`,
                `inlineStyled=${stylelessStructured.inlineStyledCount}`,
                `inlineDeclarations=${stylelessStructured.inlineDeclarationCount}`,
                `richInline=${stylelessStructured.richInlineCount}`,
                `inlineStructuralVisual=${stylelessStructured.inlineStructuralVisualCount}`,
                `computedVisual=${stylelessStructured.computedVisualCount}`,
                `computedVisualSignals=${stylelessStructured.computedVisualSignalCount}`,
                `formControls=${stylelessStructured.formControlCount}`,
                `meaningfulFormControls=${stylelessStructured.meaningfulFormControlCount}`,
                `choiceControls=${stylelessStructured.choiceControlCount}`,
                `nonChoiceControls=${stylelessStructured.nonChoiceFormControlCount}`,
                `stateVisualRules=${stylelessStructured.stateVisualRuleCount}`,
            ],
            confidence: 0.99,
        });
    }

    if ((Number(nestedDetailsPopupCandidateCount) || 0) > 0) {
        add({
            id: 'nested-details-popup-clipped', stage: 'visibility', mode: 'text',
            label: `检测到 ${Number(nestedDetailsPopupCandidateCount) || 0} 处展开结果脱离文档流并被外层裁切`,
            evidence: [`nestedDetailsPopupCandidateCount=${Number(nestedDetailsPopupCandidateCount) || 0}`],
            confidence: 0.98,
        });
    }

    if ((Number(mobileInlineAnnotationCandidateCount) || 0) > 0) {
        add({
            id: 'mobile-inline-annotation-clipped', stage: 'visibility', mode: 'text',
            label: `检测到 ${Number(mobileInlineAnnotationCandidateCount) || 0} 处手机端行内批注被压窄、重叠或裁切`,
            evidence: [`mobileInlineAnnotationCandidateCount=${Number(mobileInlineAnnotationCandidateCount) || 0}`],
            confidence: 0.98,
        });
    }

    if ((Number(mobileLayout?.candidateCount) || 0) > 0) {
        add({
            id: 'mobile-layout-content-risk', stage: 'visibility', mode: 'text',
            label: `检测到 ${Number(mobileLayout?.candidateCount) || 0} 处手机端容器挤压、横向溢出或状态内容定高风险`,
            evidence: [
                `viewportWidth=${Number(mobileLayout?.viewportWidth) || 0}`,
                `horizontalOverflow=${Number(mobileLayout?.horizontalOverflowCount) || 0}`,
                `fixedWidth=${Number(mobileLayout?.fixedWidthCount) || 0}`,
                `grid=${Number(mobileLayout?.gridCount) || 0}`,
                `matrix=${Number(mobileLayout?.matrixCount) || 0}`,
                `flex=${Number(mobileLayout?.flexCount) || 0}`,
                `multiColumn=${Number(mobileLayout?.multiColumnCount) || 0}`,
                `media=${Number(mobileLayout?.mediaCount) || 0}`,
                `stateContent=${Number(mobileLayout?.stateContentCount) || 0}`,
                `squeezedText=${Number(mobileLayout?.squeezedTextCount) || 0}`,
                `underfill=${Number(mobileLayout?.underfillCount) || 0}`,
            ],
            confidence: 0.93,
        });
    }

    if ((Number(viewportLayout?.candidateCount) || 0) > 0) {
        add({
            id: 'viewport-layout-squeezed-or-clipped', stage: 'visibility', mode: 'text',
            label: `检测到 ${Number(viewportLayout?.candidateCount) || 0} 处当前窗口正文被异常压窄或被裁切`,
            evidence: [
                `viewportWidth=${Number(viewportLayout?.viewportWidth) || 0}`,
                `structuralGridSpan=${Number(viewportLayout?.structuralGridSpanCount) || 0}`,
                `squeezed=${Number(viewportLayout?.squeezedCount) || 0}`,
                `overflow=${Number(viewportLayout?.overflowCount) || 0}`,
                `overflowX=${Number(viewportLayout?.overflowXCount) || 0}`,
                `overflowY=${Number(viewportLayout?.overflowYCount) || 0}`,
                `pointerBlocked=${Number(viewportLayout?.pointerBlockedCount) || 0}`,
            ],
            confidence: 0.97,
        });
    }

    if ((Number(textContrastCandidateCount) || 0) > 0) {
        add({
            id: 'severe-text-contrast', stage: 'visibility', mode: 'text',
            label: `检测到 ${Number(textContrastCandidateCount) || 0} 处正文与实际背景对比度过低，文字几乎不可读`,
            evidence: [`textContrastCandidateCount=${Number(textContrastCandidateCount) || 0}`], confidence: 0.99,
        });
    }

    if ((Number(textClippingCandidateCount) || 0) > 0) {
        add({
            id: 'text-clipping', stage: 'visibility', mode: 'text',
            label: `检测到 ${Number(textClippingCandidateCount) || 0} 处文字可能被裁切、限行或省略`,
            evidence: [`textClippingCandidateCount=${Number(textClippingCandidateCount) || 0}`], confidence: 0.9,
        });
    }

    if (interaction.stateControlsLost) {
        add({
            id: 'state-control-structure-stripped', stage: 'source', mode: 'source',
            label: '当前兔子镜的 checkbox/radio 被宿主剥离，原始同标题镜面仍保留完整控件结构',
            evidence: [
                `rawMirrorStateInputs=${Number(full.rawMirrorStateInputCount) || 0}`,
                `renderedMirrorStateInputs=${Number(full.renderedMirrorStateInputCount) || 0}`,
            ],
            confidence: 1,
        });
    } else if (interaction.checkedControlsLost) {
        add({
            id: 'checked-controls-lost', stage: 'interaction', mode: 'interaction',
            label: 'CSS 仍依赖 checked 状态，但对应控件已经丢失',
            evidence: ['controlsLost=true', 'checkedCount>0'], confidence: 1,
        });
    }
    if (interaction.strippedStateProgram) {
        add({
            id: 'state-program-stripped', stage: 'interaction', mode: 'interaction',
            label: '宿主删除了会推进状态的点击／变更程序',
            evidence: [
                `lostInlineStatePrograms=${Number(interaction.lostInlineStatePrograms) || 0}`,
                `recoveredInlineStatePrograms=${Number(interaction.recoveredInlineStatePrograms) || 0}`,
            ],
            confidence: 0.92,
        });
    }
    if (Number(interaction.rawScriptTimelineMissingCount) > 0) {
        add({
            id: 'script-timeline-stripped', stage: 'interaction', mode: 'interaction',
            label: '宿主删除了可安全恢复的多阶段点击时间线',
            evidence: [
                `rawScriptTimelineCandidateCount=${Number(interaction.rawScriptTimelineCandidateCount) || 0}`,
                `rawScriptTimelineRescueCount=${Number(interaction.rawScriptTimelineRescueCount) || 0}`,
            ],
            confidence: 0.98,
        });
    }
    if (Number(interaction.decorativeOverlayCandidateCount) > 0) {
        add({
            id: 'decorative-overlay-blocks-touch', stage: 'interaction', mode: 'interaction',
            label: `${Number(interaction.decorativeOverlayCandidateCount)} 处全覆盖装饰层可能阻断触摸`,
            evidence: [`decorativeOverlayCandidateCount=${Number(interaction.decorativeOverlayCandidateCount)}`], confidence: 0.86,
        });
    }
    if (interaction.touchHoverMissing) {
        add({
            id: 'meaningful-hover-without-touch', stage: 'interaction', mode: 'interaction',
            label: '承担第二层内容的 Hover 在触屏环境没有等价操作',
            evidence: [`meaningfulPseudoRuleCount=${Number(interaction.meaningfulPseudoRuleCount) || 0}`], confidence: 0.94,
        });
    }
    if (Number(interaction.focusWithinPersistentMissingCount) > 0) {
        add({
            id: 'unlabeled-focus-within-not-persistent', stage: 'interaction', mode: 'interaction',
            label: '无 label 的透明 checkbox 只依赖 focus-within 显示第二层，触屏上无法稳定保持或再次关闭',
            evidence: [`focusWithinPersistentMissingCount=${Number(interaction.focusWithinPersistentMissingCount)}`], confidence: 1,
        });
    }
    if (Number(interaction.missingCheckedSubjectClassMissingCount) > 0) {
        add({
            id: 'missing-checked-control-class', stage: 'interaction', mode: 'interaction',
            label: 'CSS 的 :checked 状态引用了唯一缺失的控制 class，现有前后层无法切换',
            evidence: [`missingCheckedSubjectClassMissingCount=${Number(interaction.missingCheckedSubjectClassMissingCount)}`], confidence: 1,
        });
    }
    if (Number(interaction.radioGroupLossCandidateCount) > 0) {
        add({
            id: 'radio-group-name-stripped', stage: 'interaction', mode: 'interaction',
            label: 'radio 同组关系被宿主移除，单选节点会累积成同时选中',
            evidence: [`radioGroupLossCandidateCount=${Number(interaction.radioGroupLossCandidateCount)}`], confidence: 1,
        });
    }
    if (Number(interaction.selectionOnlyRepairCandidateCount) > 0) {
        add({
            id: 'selection-only-missing-result', stage: 'interaction', mode: 'interaction',
            label: '选择控件只有选中外观，没有可辨认的结果反馈',
            evidence: [`selectionOnlyRepairCandidateCount=${Number(interaction.selectionOnlyRepairCandidateCount)}`], confidence: 0.88,
        });
    }
    if (Number(interaction.disabledOnlyChoiceCandidateCount) > 0) {
        add({
            id: 'disabled-only-choice-group', stage: 'interaction', mode: 'interaction',
            label: '选择项具有可点击外观，但整组控件被 disabled，当前无法操作',
            evidence: [`disabledOnlyChoiceCandidateCount=${Number(interaction.disabledOnlyChoiceCandidateCount)}`], confidence: 0.96,
        });
    }
    if (Number(interaction.inertActionButtonCandidateCount) > 0) {
        add({
            id: 'inert-action-button', stage: 'interaction', mode: 'interaction',
            label: '动作按钮没有可识别的点击结果或状态推进路线',
            evidence: [`inertActionButtonCandidateCount=${Number(interaction.inertActionButtonCandidateCount)}`], confidence: 0.91,
        });
    }
    if (Number(interaction.staticChoiceSelectionCandidateCount) > 0) {
        add({
            id: 'static-choice-cards-without-selection', stage: 'interaction', mode: 'interaction',
            label: '抉择卡片具有明确选项与点击外观，但没有可保持的选择状态',
            evidence: [`staticChoiceSelectionCandidateCount=${Number(interaction.staticChoiceSelectionCandidateCount)}`], confidence: 0.97,
        });
    }
    if (Number(interaction.structuredStaticDisclosureCandidateCount) > 0) {
        add({
            id: 'structured-static-sections-without-reachable-state', stage: 'interaction', mode: 'interaction',
            label: '正文已分成多个明确层级，但所有分段仍是静态展示；可只使用现有标题与正文恢复可展开、可收起、可返回的巡览状态',
            evidence: [`structuredStaticDisclosureCandidateCount=${Number(interaction.structuredStaticDisclosureCandidateCount)}`], confidence: 0.94,
        });
    }
    if (Number(interaction.fillInChoiceCandidateCount) > 0) {
        add({
            id: 'fill-in-blanks-with-static-options', stage: 'interaction', mode: 'interaction',
            label: '填空位与候选碎片已经存在，但当前只有 Hover 提示；可只使用现有候选恢复可选择、可改选、可清除的保持状态',
            evidence: [`fillInChoiceCandidateCount=${Number(interaction.fillInChoiceCandidateCount)}`], confidence: 0.99,
        });
    }
    if (Number(interaction.unresolvedCheckedRuleCount) > 0) {
        add({
            id: 'unresolved-checked-target', stage: 'interaction', mode: 'interaction',
            label: '存在无法命中真实目标的 checked 规则，当前交互不能判定为正常或已修复',
            evidence: [`unresolvedCheckedRuleCount=${Number(interaction.unresolvedCheckedRuleCount)}`], confidence: 0.99,
        });
    }
    if (Number(interaction.crossParentCheckedRuleCandidateCount) > 0) {
        add({
            id: 'cross-parent-checked-target', stage: 'interaction', mode: 'interaction',
            label: 'checked 目标位于触发器父层之外，原生兄弟选择器无法命中',
            evidence: [
                `crossParentCheckedRuleCandidateCount=${Number(interaction.crossParentCheckedRuleCandidateCount)}`,
                `crossParentCheckedRuleVerifiedCount=${Number(interaction.crossParentCheckedRuleVerifiedCount) || 0}`,
            ], confidence: 0.98,
        });
    }
    if (Number(interaction.checkedHasStateRuleMissingCount) > 0) {
        add({
            id: 'checked-has-wrong-scope', stage: 'interaction', mode: 'interaction',
            label: '全选联动绑定在错误的 :has() 作用域，完成状态无法命中',
            evidence: [`checkedHasStateRuleMissingCount=${Number(interaction.checkedHasStateRuleMissingCount)}`], confidence: 0.98,
        });
    }
    if (Number(interaction.detachedCheckedHasRuleMissingCount) > 0) {
        add({
            id: 'detached-checked-has-state', stage: 'interaction', mode: 'interaction',
            label: 'radio/checkbox 位于 :has() 内容容器之外，原始分支正文无法随选择切换',
            evidence: [`detachedCheckedHasRuleMissingCount=${Number(interaction.detachedCheckedHasRuleMissingCount)}`], confidence: 1,
        });
    }
    if (Number(interaction.pairedCheckedStateMissingCount) > 0) {
        add({
            id: 'paired-checked-state-locked', stage: 'interaction', mode: 'interaction',
            label: '进入下一画面与返回主画面由两个独立 checkbox 控制，返回后会残留状态且内联隐藏阻断显示',
            evidence: [`pairedCheckedStateMissingCount=${Number(interaction.pairedCheckedStateMissingCount)}`], confidence: 1,
        });
    }
    if (Number(interaction.exclusiveStackedStateMissingCount) > 0) {
        add({
            id: 'exclusive-stacked-state-overlap', stage: 'interaction', mode: 'interaction',
            label: '多个状态正文叠在同一画布，默认层的内联可见样式会与选中分支重叠',
            evidence: [`exclusiveStackedStateMissingCount=${Number(interaction.exclusiveStackedStateMissingCount)}`], confidence: 0.99,
        });
    }
    if (Number(interaction.channelDialCycleMissingCount) > 0) {
        add({
            id: 'channel-dial-overlap', stage: 'interaction', mode: 'interaction',
            label: '频道旋钮的重叠点击分区遮住了中间频道，无法按顺序切换全部画面',
            evidence: [`channelDialCycleMissingCount=${Number(interaction.channelDialCycleMissingCount)}`], confidence: 0.99,
        });
    }
    if (Number(interaction.oneWayCheckedResultCandidateCount) > 0) {
        add({
            id: 'checked-result-no-return', stage: 'interaction', mode: 'interaction',
            label: 'checked 分支隐藏了唯一触发器，进入下一层后没有返回上一层的操作入口',
            evidence: [`oneWayCheckedResultCandidateCount=${Number(interaction.oneWayCheckedResultCandidateCount)}`], confidence: 0.98,
        });
    }
    if (interaction.needsScopeRepair) {
        add({
            id: 'interaction-id-scope-collision', stage: 'interaction', mode: 'interaction',
            label: `交互 ID 未隔离（重复 ID=${Number(interaction.duplicateIds) || 0}，失配标签=${Number(interaction.brokenLocalLabels) || 0}）`,
            evidence: [
                `duplicateIds=${Number(interaction.duplicateIds) || 0}`,
                `brokenLocalLabels=${Number(interaction.brokenLocalLabels) || 0}`,
            ],
            confidence: 0.94,
        });
    }

    if (full.mobile3DFlipCandidate) {
        add({
            id: 'ios-3d-flip-incomplete', stage: 'compatibility', mode: 'style',
            label: 'iOS 3D 翻面缺少 WebKit 对应属性，可能镜像或双面同显',
            evidence: ['mobile3DFlipCandidate=true'], confidence: 0.96,
        });
    }

    return dedupeMaintenanceFindings(findings);
}


export function maintenanceRepairModesForFindings(findings) {
    const list = findings || [];
    const plan = [];
    const push = mode => { if (mode && !plan.includes(mode)) plan.push(mode); };
    if (list.some(finding => finding.stage === 'source')) push('source');
    if (list.some(finding => finding.stage === 'structure')) push('style');
    if (list.some(finding => finding.stage === 'visibility')) push('text');
    if (list.some(finding => finding.stage === 'interaction')) push('interaction');
    if (list.some(finding => finding.stage === 'compatibility')) push('style');
    return plan;
}


export function maintenanceFindingReason(findings) {
    const list = findings || [];
    if (!list.length) return '';
    return list.map((finding, index) => {
        const stage = MAINTENANCE_FINDING_STAGE_LABELS[finding.stage] || '其他';
        return `${index + 1}. ${stage}：${finding.label}`;
    }).join('；');
}


function maintenanceFindingSnapshot(findings) {
    return (findings || []).map(finding => ({
        id: finding.id,
        stage: finding.stage,
        label: finding.label,
        mode: finding.mode,
        confidence: finding.confidence,
        evidence: finding.evidence,
    }));
}


function inspectMaintenanceRabbit(root) {
    let code = {};
    let full = maintenanceFallbackFullSummary(root);
    let partialInspection = false;
    try {
        code = diagnosticCodeRescueSummary(root) || {};
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance code inspection skipped:', error);
    }
    try {
        full = { ...full, ...(diagnosticFullChainSummary(root, code) || {}) };
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance full-chain inspection skipped:', error);
    }
    let interaction;
    try {
        interaction = maintenanceKnownInteractionEvidence(root, full, code);
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance interaction inspection skipped:', error);
        interaction = { checkedControlsLost: false, stateControlsLost: false, strippedStateProgram: false, lostInlineStatePrograms: 0, recoveredInlineStatePrograms: 0, decorativeOverlayCandidateCount: 0, touchHoverMissing: false, unscopedControls: false, missingCheckedSubjectClassCandidateCount: 0, missingCheckedSubjectClassRescueCount: 0, missingCheckedSubjectClassMissingCount: 0, radioGroupLossCandidateCount: 0, radioGroupRescueCount: 0, duplicateIds: 0, brokenLocalLabels: 0, checkedCssIdSelectors: 0, needsScopeRepair: false, checkedSelectionOnly: false, checkedSelectionOnlyRaw: false, checkedRuleCount: 0, meaningfulCheckedRuleCount: 0, selectionStyleRuleCount: 0, unresolvedCheckedRuleCount: 0, selectionOnlyFallbackCount: 0, selectionOnlyRepairCandidateCount: 0, disabledOnlyChoiceCandidateCount: 0, inertActionButtonCandidateCount: 0, staticChoiceSelectionCandidateCount: 0, staticChoiceSelectionRescueCount: 0, structuredStaticDisclosureCandidateCount: 0, structuredStaticDisclosureRescueCount: 0, fillInChoiceCandidateCount: 0, fillInChoiceRescueCount: 0, focusWithinPersistentCandidateCount: 0, focusWithinPersistentRescueCount: 0, focusWithinPersistentMissingCount: 0, rawScriptTimelineCandidateCount: 0, rawScriptTimelineRescueCount: 0, rawScriptTimelineMissingCount: 0, crossParentCheckedRuleCandidateCount: 0, checkedHasStateRuleCandidateCount: 0, checkedHasStateRuleRescueCount: 0, checkedHasStateRuleMissingCount: 0, detachedCheckedHasRuleCandidateCount: 0, detachedCheckedHasRuleRescueCount: 0, detachedCheckedHasRuleMissingCount: 0, pairedCheckedStateCandidateCount: 0, pairedCheckedStateRescueCount: 0, pairedCheckedStateMissingCount: 0, exclusiveStackedStateCandidateCount: 0, exclusiveStackedStateRescueCount: 0, exclusiveStackedStateMissingCount: 0, channelDialCycleCandidateCount: 0, channelDialCycleRescueCount: 0, channelDialCycleMissingCount: 0, oneWayCheckedResultCandidateCount: 0, reversibleCheckedResultRescueCount: 0, pseudoVisualOnly: false, pseudoRuleCount: 0, visualOnlyPseudoRuleCount: 0, meaningfulPseudoRuleCount: 0, touchHoverEligibleCount: 0, touchHoverActiveCount: 0, contentInteractiveElementCount: 0, installedInteractionRouteCount: 0, noInteractionStructure: false, raw: '' };
    }
    let textContrastCandidateCount = 0;
    try {
        textContrastCandidateCount = findSevereTextContrastCandidates(root).length;
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance text contrast inspection skipped:', error);
    }
    let textClippingCandidateCount = 0;
    try {
        textClippingCandidateCount = findMaintenanceTextClippingCandidates(root).length;
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance text clipping inspection skipped:', error);
    }
    let nestedDetailsPopupCandidateCount = 0;
    try {
        nestedDetailsPopupCandidateCount = findNestedDetailsPopupClippingCandidates(root).length;
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance nested details popup inspection skipped:', error);
    }
    let mobileInlineAnnotationCandidateCount = 0;
    try {
        mobileInlineAnnotationCandidateCount = findMobileInlineAnnotationCandidates(root).length;
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance mobile inline annotation inspection skipped:', error);
    }
    let mobileLayout = { candidateCount: 0, viewportWidth: Number(globalThis.innerWidth || 0), narrowViewport: false };
    try {
        mobileLayout = inspectMaintenanceMobileLayout(root);
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance mobile layout inspection skipped:', error);
    }
    let viewportLayout = { candidateCount: 0, squeezedCount: 0, overflowCount: 0, overflowXCount: 0, overflowYCount: 0, pointerBlockedCount: 0, viewportWidth: Number(globalThis.innerWidth || 0) };
    try {
        viewportLayout = inspectMaintenanceViewportLayout(root);
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance viewport layout inspection skipped:', error);
    }
    let languageBalance = auditVisibleLanguageBalanceText('');
    try {
        languageBalance = rabbitMirrorLanguageBalance(root);
    } catch (error) {
        partialInspection = true;
        console.debug('[RabbitMirror] maintenance language balance inspection skipped:', error);
    }

    const findings = buildMaintenanceFindings(root, {
        full,
        code,
        interaction,
        textClippingCandidateCount,
        textContrastCandidateCount,
        nestedDetailsPopupCandidateCount,
        mobileInlineAnnotationCandidateCount,
        mobileLayout,
        viewportLayout,
    });
    const repairPlan = maintenanceRepairModesForFindings(findings);
    if (findings.length) {
        return {
            state: MAINTENANCE_STATES.repairable,
            reason: maintenanceFindingReason(findings),
            findings,
            repairPlan,
            code,
            full,
            interaction,
            textClippingCandidateCount,
            textContrastCandidateCount,
            nestedDetailsPopupCandidateCount,
            mobileInlineAnnotationCandidateCount,
            mobileLayout,
            viewportLayout,
            languageBalance,
        };
    }

    if (languageBalance.foreignDominant) {
        return {
            state: MAINTENANCE_STATES.notice,
            reason: `${languageBalance.reason}；允许少量英文术语和缩写，但主界面不建议由英文接管。可用挨打猫“🌐 一直说外语”后重说`,
            findings: [],
            repairPlan: [],
            code,
            full,
            interaction,
            textClippingCandidateCount,
            textContrastCandidateCount,
            nestedDetailsPopupCandidateCount,
            mobileInlineAnnotationCandidateCount,
            mobileLayout,
            viewportLayout,
            languageBalance,
        };
    }

    const unknownReasons = [];
    if (full.sourceTruncationNoticeInstalled) unknownReasons.push('原始输出缺少正文，已显示截断说明；缺失内容需要重新生成');
    if (full.severeStructureLoss && !full.rawToto) unknownReasons.push('渲染结构明显缺失，但未命中安全修复类型');
    if (full.controlsLost && full.checkedCount === 0 && full.rawInlineEvents === 0) unknownReasons.push('交互控件丢失，无法确认原始状态逻辑');
    if (full.currentMirrorRenderedEscapedTags && !code.strictParseOk && !full.sourceCandidate) unknownReasons.push('显示层仍有源码标签，但没有可安全恢复的完整候选');
    if (interaction.checkedSelectionOnly && interaction.selectionOnlyRepairCandidateCount === 0 && Number(interaction.pairedCheckedStateRescueCount || 0) === 0) unknownReasons.push('选择控件只能改变选中样式，且没有可安全挂接的内容区；维修兔不能代写缺失体验');
    if (!rabbitMirrorTextPresentation(root) && interaction.pseudoVisualOnly) unknownReasons.push('当前只有 Hover／Active 外观变化，没有可保持状态或第二层内容；维修兔不能代写缺失体验');
    if (interaction.noInteractionStructure) unknownReasons.push('原始输出只有静态内容或动画，没有可达的内容交互结构；维修兔不能在不编造结果的情况下自动补全');
    if (unknownReasons.length) {
        return {
            state: MAINTENANCE_STATES.unknown,
            reason: unknownReasons.join('；'),
            findings: [],
            repairPlan: [],
            code,
            full,
            interaction,
            textClippingCandidateCount,
            textContrastCandidateCount,
            nestedDetailsPopupCandidateCount,
            mobileInlineAnnotationCandidateCount,
            mobileLayout,
            viewportLayout,
            languageBalance,
        };
    }
    const healthyReason = partialInspection
        ? '未发现可确认异常（部分巡逻项目已安全跳过）'
        : (full.activeCount > 0 && full.checkedCount === 0 ? '原生按压／长按交互完整，未发现高置信异常' : '未发现高置信异常');
    return {
        state: MAINTENANCE_STATES.healthy,
        reason: healthyReason,
        findings: [],
        repairPlan: [],
        code,
        full,
        interaction,
        textClippingCandidateCount,
        textContrastCandidateCount,
        nestedDetailsPopupCandidateCount,
        mobileInlineAnnotationCandidateCount,
        mobileLayout,
        viewportLayout,
        languageBalance,
    };
}


export function maintenanceRepairRootBudget(root) {
    const limits = { maxNodes: 2200, maxDepth: 64, maxAttributes: 7000 };
    if (!root?.isConnected) return { ok: false, reason: 'detached', ...limits };
    const stack = [{ node: root, depth: 1 }];
    let nodes = 0;
    let attributes = 0;
    while (stack.length) {
        const { node, depth } = stack.pop();
        nodes += 1;
        attributes += Number(node?.attributes?.length || 0);
        if (nodes > limits.maxNodes || depth > limits.maxDepth || attributes > limits.maxAttributes) {
            return { ok: false, reason: 'complexity', nodes, depth, attributes, ...limits };
        }
        const children = node?.children || [];
        for (let index = children.length - 1; index >= 0; index -= 1) stack.push({ node: children[index], depth: depth + 1 });
    }
    return { ok: true, nodes, attributes, ...limits };
}


export function rejectOversizedMaintenanceRepair(root, button, action = '维修') {
    const budget = maintenanceRepairRootBudget(root);
    if (budget.ok) return false;
    setMaintenanceRabbitState(
        button,
        MAINTENANCE_STATES.unknown,
        budget.reason === 'complexity'
            ? `当前单镜结构过大（${budget.nodes || '>'}${budget.maxNodes} 节点上限），为避免浏览器卡死未执行${action}；请重新生成或使用轻量模板`
            : `当前兔子镜已脱离页面，未执行${action}`,
    );
    return true;
}


export function patrolMaintenanceRabbit(root, button) {
    if (!root?.isConnected || !button?.isConnected) return null;
    if (rejectOversizedMaintenanceRepair(root, button, '巡逻')) return null;
    const origin = captureMaintenanceRepairOrigin(root);
    setMaintenanceRabbitState(button, MAINTENANCE_STATES.checking, '正在检查 HTML、CSS、源码与交互链');
    let result;
    try {
        result = inspectMaintenanceRabbit(root);
    } catch (error) {
        console.debug('[RabbitMirror] maintenance rabbit patrol failed:', error);
        result = { state: MAINTENANCE_STATES.unknown, reason: '巡逻未完成，可点击重试；未对当前兔子镜作任何修改' };
    }
    setTimeout(() => {
        if (!button.isConnected) return;
        if (maintenanceRepairOriginIsCurrent(origin)) setMaintenanceRabbitState(button, result.state, result.reason);
        else failMaintenanceRabbit(button, '❌ 巡逻结果已因聊天、Swipe、正文或镜面身份变化取消');
    }, 120);
    return result;
}


function findLiveMaintenanceRoot(root, summaryText = '', messageIndex = -1) {
    if (root?.isConnected) return exactIndependentMaintenanceRoot(root);
    const wantedIdentity = followMaintenanceMirrorIdentity(root);
    const independentHost = independentMaintenanceHost(root);
    const ownerKey = String(independentHost?.dataset?.rmKey || root?.dataset?.rabbitMirrorExternalOwner || '');
    const facePosition = getRabbitMirrorFacePosition(root);
    if (ownerKey) {
        const exact = [...(document.querySelectorAll?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]') || [])]
            .find(host => String(host.dataset?.rmKey || '') === ownerKey);
        if (exact && Number.isInteger(facePosition?.faceIndex)) {
            const faces = [...(exact.children || [])].filter(child => child?.matches?.('details') && isRabbitMirrorDetails(child));
            return faces.length === facePosition.faceCount ? faces[facePosition.faceIndex] || null : null;
        }
        return null;
    }
    const messageElement = messageIndex >= 0 ? getRenderedMessageElement(messageIndex) : null;
    if (!messageElement) return null;
    const candidates = getRenderedRabbitMirrorInteractionRoots(messageElement);
    if (wantedIdentity) {
        const exact = candidates.find(candidate => followMaintenanceMirrorIdentity(candidate) === wantedIdentity);
        return exact || null;
    }
    if (!summaryText) return candidates.length === 1 ? candidates[0] : null;
    const summaryMatches = candidates.filter(candidate => getRabbitMirrorSummaryText(candidate).includes(summaryText));
    return summaryMatches.length === 1 ? summaryMatches[0] : null;
}


export function getSelectedMessageSource(message, { preferDisplay = false } = {}) {
    if (!message || message?.is_user) return '';
    const swipeIndex = Number.isInteger(message?.swipe_id) ? message.swipe_id : -1;
    const displaySource = typeof message?.extra?.display_text === 'string' ? message.extra.display_text : '';
    const swipeSource = swipeIndex >= 0 && typeof message?.swipes?.[swipeIndex] === 'string'
        ? message.swipes[swipeIndex]
        : '';
    const messageSource = typeof message?.mes === 'string' ? message.mes : '';
    const candidates = preferDisplay
        ? [displaySource]
        : [swipeSource, messageSource, displaySource];

    for (const candidate of candidates) {
        const decoded = decodeHtmlEntities(String(candidate || '')).trim();
        if (!decoded) continue;
        if (needsSanitize(decoded) || /<(?:toto|details)\b/i.test(decoded)) return decoded;
    }
    return candidates.map(value => String(value || '').trim()).find(Boolean) || '';
}


export function normalizeMaintenanceSummaryText(text) {
    return stripMaintenanceRabbitGlyphs(text)
        .replace(/\s+/g, ' ')
        .trim();
}


export function maintenanceMessageSourceCandidates(message, { displayOnly = false } = {}) {
    const candidates = [];
    const seen = new Set();
    const push = (label, value) => {
        if (typeof value !== 'string') return;
        const source = decodeHtmlEntities(value).trim();
        if (!source || seen.has(source)) return;
        seen.add(source);
        candidates.push({ label, source });
    };

    if (displayOnly) {
        push('display_text', message?.extra?.display_text);
        return candidates;
    }

    const swipeIndex = Number.isInteger(message?.swipe_id) ? message.swipe_id : -1;
    if (swipeIndex >= 0) push('当前 swipe', message?.swipes?.[swipeIndex]);
    push('mes', message?.mes);
    push('display_text', message?.extra?.display_text);
    return candidates;
}


export function maintenanceMirrorBodyEvidence(candidate) {
    const empty = {
        hasDetails: false,
        textLength: 0,
        bodyElementCount: 0,
        semanticElementCount: 0,
        visualProgramCount: 0,
        highConfidenceEmptyShell: false,
    };
    if (!(candidate instanceof Element)) return empty;
    const details = candidate.matches?.('details') ? candidate : candidate.querySelector?.('details');
    if (!details) return empty;

    const clone = details.cloneNode(true);
    clone.querySelectorAll?.([
        ':scope > summary',
        '[data-rm-image-region]',
        'script',
        'template',
        `[${MAINTENANCE_RABBIT_ATTR}]`,
        `[${FEEDBACK_CAT_ATTR}]`,
        `[${TOOL_ENTRY_HOST_ATTR}]`,
        `[${MAINTENANCE_MENU_ATTR}]`,
        `[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`,
        `[${FEEDBACK_CAT_MENU_ATTR}]`,
        `[${RECIPE_MENU_ATTR}]`,
        `[${SOURCE_TRUNCATION_NOTICE_ATTR}]`,
        `[${EXTERNAL_REFERENCE_NOTE_ATTR}]`,
    ].join(','))?.forEach(node => node.remove());

    const contentStyles = [...(clone.querySelectorAll?.('style') || [])]
        .filter(style => ![...style.attributes].some(attribute => /^data-rabbit-mirror-/i.test(attribute.name)))
        .map(style => String(style.textContent || ''))
        .join('\n');
    clone.querySelectorAll?.('style')?.forEach(style => style.remove());

    const textLength = decodeHtmlEntities(String(clone.textContent || ''))
        .replace(/\s+/g, ' ')
        .trim().length;
    const bodyElements = [...(clone.querySelectorAll?.('*') || [])]
        .filter(element => !['br'].includes(String(element.tagName || '').toLowerCase()));
    const semanticSelector = [
        'input', 'button', 'select', 'textarea', 'a[href]', 'label',
        'img', 'svg', 'canvas', 'video', 'audio', 'iframe', 'object', 'embed',
        'table', 'ul', 'ol', 'li', 'p', 'blockquote', 'pre', 'code',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figure', 'figcaption',
        'details', 'meter', 'progress', '[role]', '[tabindex]', '[contenteditable="true"]',
    ].join(',');
    const semanticElementCount = clone.querySelectorAll?.(semanticSelector)?.length || 0;
    const inlineVisualProgramCount = bodyElements.filter(element => {
        const style = String(element.getAttribute?.('style') || '');
        return /(?:background(?:-image)?\s*:[^;]*(?:url\(|gradient\()|mask(?:-image)?\s*:|clip-path\s*:|filter\s*:|content\s*:)/i.test(style);
    }).length;
    const stylesheetVisualProgramCount = (contentStyles.match(/@keyframes\b|content\s*:|background(?:-image)?\s*:[^;{}]*(?:url\(|gradient\()|mask(?:-image)?\s*:|clip-path\s*:/gi) || []).length;
    const visualProgramCount = inlineVisualProgramCount + stylesheetVisualProgramCount;

    // 仅把“零文字、零语义／媒体／控件、最多两个空包装元素、也没有视觉程序”的结构判为空壳。
    // 这样可识别模型只输出外框与一条空分隔栏的失败案例，同时避免把 SVG、渐变绘景、动画或复杂纯视觉作品误删。
    const highConfidenceEmptyShell = textLength === 0
        && semanticElementCount === 0
        && bodyElements.length <= 2
        && visualProgramCount === 0;

    return {
        hasDetails: true,
        textLength,
        bodyElementCount: bodyElements.length,
        semanticElementCount,
        visualProgramCount,
        highConfidenceEmptyShell,
    };
}


function maintenanceMirrorCandidateHasBody(candidate) {
    const evidence = maintenanceMirrorBodyEvidence(candidate);
    return evidence.hasDetails && !evidence.highConfidenceEmptyShell
        && (evidence.textLength > 0
            || evidence.bodyElementCount > 0
            || evidence.semanticElementCount > 0
            || evidence.visualProgramCount > 0);
}


export function findRecoverableMaintenanceMirrorSource(message, root, { displayOnly = false } = {}) {
    const wantedSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(root));
    const candidates = maintenanceMessageSourceCandidates(message, { displayOnly });
    if (!displayOnly) {
        const chat = getAvailableHostChat();
        const messageIndex = Array.isArray(chat) ? chat.lastIndexOf(message) : -1;
        const snapshot = getRabbitMirrorGenerationSnapshot(message, chat, messageIndex, wantedSummary);
        if (snapshot?.source) candidates.push({ label: '本轮完整源码临时快照', source: snapshot.source });
    }
    const seen = new Set();
    for (const candidateSource of candidates) {
        if (!candidateSource?.source || seen.has(candidateSource.source)) continue;
        seen.add(candidateSource.source);
        const isolated = extractIsolatedMaintenanceMirrorSource(candidateSource.source, root);
        if (!isolated) continue;
        const candidate = findCleanMaintenanceMirrorNode(isolated, root);
        if (!candidate || !maintenanceMirrorCandidateHasBody(candidate)) continue;
        const candidateSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(candidate));
        const titleMatches = !!wantedSummary && (
            candidateSummary === wantedSummary
            || candidateSummary.includes(wantedSummary)
            || wantedSummary.includes(candidateSummary)
        );
        if (!titleMatches) continue;
        return { ...candidateSource, source: isolated };
    }
    return null;
}



export function extractMaintenanceMirrorSourceBySummary(source, root) {
    const text = String(source || '');
    if (!text || !normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(root))) return '';
    // Select among parsed top-level RabbitMirror roots. Counting every <summary> in the
    // source lets a nested details panel steal the ordinal of a later same-title mirror.
    const candidate = chooseMatchingRawRabbitMirrorRoot(text, root);
    const isolated = String(candidate?.outerHTML || '').trim();
    if (!isolated || TRANSIENT_RERENDER_REASONING_ENVELOPE_RE.test(isolated)) return '';
    return isolated;
}



function quarantineMaintenanceScriptBlocks(source) {
    return String(source || '').replace(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi, (_match, body) => {
        let encoded = '';
        try {
            encoded = encodeURIComponent(String(body || ''));
        } catch {
            encoded = '';
        }
        return `<template ${MAINTENANCE_QUARANTINED_SCRIPT_ATTR}="${encoded}"></template>`;
    });
}


function decodeQuarantinedMaintenanceScript(element) {
    const encoded = String(element?.getAttribute?.(MAINTENANCE_QUARANTINED_SCRIPT_ATTR) || '');
    if (!encoded) return '';
    try {
        return decodeURIComponent(encoded);
    } catch {
        return '';
    }
}


export function findMaintenanceElementByRawClass(root, rawClass) {
    const wanted = String(rawClass || '').trim();
    if (!root?.querySelectorAll || !wanted) return null;
    for (const element of root.querySelectorAll('[class]')) {
        const tokens = String(element.className || '').split(/\s+/).filter(Boolean);
        if (tokens.some(token => token === wanted || token === `custom-${wanted}` || token.endsWith(`-${wanted}`))) {
            return element;
        }
    }
    return null;
}


export function resolveMaintenanceGeneratedClass(root, rawClass) {
    const wanted = String(rawClass || '').trim();
    if (!wanted) return '';
    const existing = findMaintenanceElementByRawClass(root, wanted);
    if (existing) {
        const tokens = String(existing.className || '').split(/\s+/).filter(Boolean);
        return tokens.find(token => token === wanted || token === `custom-${wanted}` || token.endsWith(`-${wanted}`)) || wanted;
    }
    for (const style of root?.querySelectorAll?.('style') || []) {
        const css = String(style.textContent || '');
        const classRe = /\.([_a-zA-Z][\w-]*)/g;
        let match;
        while ((match = classRe.exec(css))) {
            const token = String(match[1] || '');
            if (token === wanted || token === `custom-${wanted}` || token.endsWith(`-${wanted}`)) return token;
        }
    }
    return wanted;
}


function parseMaintenanceStaticDecorationPlans(scriptText) {
    const script = String(scriptText || '');
    if (!script || !/createElement\s*\(\s*['"]div['"]\s*\)/i.test(script)) return [];

    const targets = new Map();
    const childClasses = new Map();
    const plans = [];
    const targetRe = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*document\.querySelector\(\s*(['"])\.([A-Za-z_][\w-]*)\2\s*\)/g;
    const classRe = /([A-Za-z_$][\w$]*)\.className\s*=\s*(['"])([^'"]+)\2/g;
    const appendRe = /([A-Za-z_$][\w$]*)\.appendChild\(\s*([A-Za-z_$][\w$]*)\s*\)/g;
    let match;
    while ((match = targetRe.exec(script))) targets.set(match[1], match[3]);
    while ((match = classRe.exec(script))) childClasses.set(match[1], String(match[3] || '').trim());
    while ((match = appendRe.exec(script))) {
        const targetClass = targets.get(match[1]);
        const childClass = childClasses.get(match[2]);
        if (!targetClass || !childClass) continue;
        const signal = `${targetClass} ${childClass}`.toLowerCase();
        const kind = /(?:star|stars|spark|twinkle)/.test(signal)
            ? 'stars'
            : /(?:building|cityscape|skyline)/.test(signal) ? 'buildings' : '';
        if (kind) plans.push({ targetClass, childClass, kind });
    }
    return plans.slice(0, 4);
}


function installMaintenanceStaticDecorationFallback(root, scriptText) {
    if (!root?.querySelectorAll) return 0;
    let created = 0;
    for (const plan of parseMaintenanceStaticDecorationPlans(scriptText)) {
        const target = findMaintenanceElementByRawClass(root, plan.targetClass);
        if (!target || target.children.length > 4) continue;
        const childClass = resolveMaintenanceGeneratedClass(root, plan.childClass);
        if (!childClass) continue;
        const count = plan.kind === 'stars' ? 24 : 10;
        for (let index = 0; index < count; index += 1) {
            const child = document.createElement('div');
            child.className = childClass;
            child.setAttribute(MAINTENANCE_STATIC_DECOR_CHILD_ATTR, plan.kind);
            if (plan.kind === 'stars') {
                const size = 1 + ((index * 7) % 4) * 0.45;
                child.style.width = `${size.toFixed(2)}px`;
                child.style.height = `${size.toFixed(2)}px`;
                child.style.top = `${(index * 37 + 9) % 96}%`;
                child.style.left = `${(index * 53 + 5) % 98}%`;
                child.style.animationDelay = `${-((index * 0.47) % 5).toFixed(2)}s`;
                child.style.animationDuration = `${(3 + (index % 5) * 0.55).toFixed(2)}s`;
            } else {
                child.style.left = `${Math.min(95, index * 9.7).toFixed(1)}%`;
                child.style.height = `${14 + ((index * 17) % 47)}%`;
                child.style.width = `${3 + ((index * 5) % 6)}%`;
                child.style.opacity = `${(0.32 + (index % 5) * 0.11).toFixed(2)}`;
            }
            target.appendChild(child);
            created += 1;
        }
        target.setAttribute(MAINTENANCE_STATIC_DECOR_ATTR, `${plan.kind}:${count}`);
    }
    return created;
}


function sanitizeMaintenanceMirrorTemplate(template) {
    if (!template?.content?.querySelectorAll) return null;

    const scriptSources = [];
    for (const placeholder of [...template.content.querySelectorAll(`template[${MAINTENANCE_QUARANTINED_SCRIPT_ATTR}]`)]) {
        scriptSources.push(decodeQuarantinedMaintenanceScript(placeholder));
        placeholder.remove();
    }
    for (const script of [...template.content.querySelectorAll('script')]) {
        scriptSources.push(String(script.textContent || ''));
        script.remove();
    }

    if (!sanitizeRabbitMirrorUntrustedTemplate(template)) return null;

    let decorationCount = 0;
    for (const scriptSource of scriptSources) {
        decorationCount += installMaintenanceStaticDecorationFallback(template.content, scriptSource);
    }
    return { strippedScriptCount: scriptSources.length, decorationCount };
}


function prepareMaintenanceMirrorSource(source) {
    let text = decodeHtmlEntities(String(source || ''))
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        .trim();
    if (!text) return '';

    // 先把模型脚本隔离为不可执行占位符。这样既不会在重建时执行脚本，
    // 也不会让脚本正文里的 < 运算符被 HTML 紧凑器误当标签吞掉。
    text = quarantineMaintenanceScriptBlocks(text);

    // 0.32.76 能救版本的关键顺序：先在字符串层保住主体，再进入 HTML 解析。
    // 损坏的 inline SVG Data URI 会提前结束 style 属性；直接交给 template.innerHTML
    // 只会得到同样被截断的 DOM，因此必须先移除损坏背景声明。
    text = rescueDamagedDataUriRabbitMirrorOutput(text);
    text = rescuePlainTextRabbitMirrorOutput(text) || text;
    text = cleanRabbitMirrorOutput(text) || text;
    return text.trim();
}


function extractIsolatedMaintenanceMirrorSource(source, root) {
    let text = decodeHtmlEntities(String(source || ''))
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        .trim();
    if (!text) return '';

    // 优先按当前 summary 在字符串层截取对应 <details>。
    // 这一步不解析整条消息，因此即使前面含 thinking/reasoning，或损坏 SVG 已破坏 HTML 属性边界，
    // 也只会拿到当前兔子镜本体，不会把思维包裹带入显示层。
    const isolatedBySummary = extractMaintenanceMirrorSourceBySummary(text, root);
    if (isolatedBySummary) {
        const repairedIsolated = rescueDamagedDataUriRabbitMirrorOutput(isolatedBySummary).trim();
        if (repairedIsolated
            && !TRANSIENT_RERENDER_REASONING_ENVELOPE_RE.test(repairedIsolated)
            && /<(?:toto|details)\b/i.test(repairedIsolated)
            && /<summary\b[^>]*>[\s\S]*?兔子镜/i.test(repairedIsolated)) {
            return repairedIsolated;
        }
    }

    // 字符串隔离未命中时，再退回脱离页面的 template 匹配。
    text = rescueDamagedDataUriRabbitMirrorOutput(text);
    const matched = chooseMatchingRawRabbitMirrorRoot(text, root);
    const isolated = String(matched?.outerHTML || '').trim();
    if (!isolated) return '';
    const wantedSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(root));
    const matchedSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(matched));
    const titleMatches = !!wantedSummary && (
        matchedSummary === wantedSummary
        || matchedSummary.includes(wantedSummary)
        || wantedSummary.includes(matchedSummary)
    );
    if (!titleMatches) return '';

    // 若畸形标签把思维包裹卷入候选内部，则宁可停止，也不冒险展示隐藏内容。
    if (TRANSIENT_RERENDER_REASONING_ENVELOPE_RE.test(isolated)) return '';
    if (!/<(?:toto|details)\b/i.test(isolated) || !/<summary\b[^>]*>[\s\S]*?兔子镜/i.test(isolated)) return '';
    return isolated;
}

export function findCleanMaintenanceMirrorNode(source, root) {
    const cleaned = prepareMaintenanceMirrorSource(source);
    if (!cleaned || typeof document === 'undefined') return null;
    if (!validateRabbitMirrorMarkupLexicalBudget(cleaned)) return null;
    const wantedSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(root));

    try {
        const template = document.createElement('template');
        template.innerHTML = cleaned;

        // 直接 DOM 恢复绕过宿主 DOMPurify，因此在离线 template 中主动执行同等安全边界：
        // script 只删除不执行；其余主动嵌入内容仍整面拒绝。真实交互只允许后续安全解析器重建。
        if (!sanitizeMaintenanceMirrorTemplate(template)) return null;

        const candidates = [];
        for (const toto of template.content.querySelectorAll('toto')) {
            const cloned = toto.cloneNode(true);
            if (cloned.querySelector?.('details')) candidates.push(cloned);
        }
        // 部分显示正则只保留了裸 <details>，也允许把它作为临时显示层候选，
        // 但不会写回 mes/swipe/display_text。
        if (!candidates.length) {
            for (const details of template.content.querySelectorAll('details')) {
                const holder = document.createElement('toto');
                holder.setAttribute('data-rabbit-mirror', 'true');
                holder.style.display = 'block';
                holder.appendChild(details.cloneNode(true));
                candidates.push(holder);
            }
        }
        let fallback = null;
        for (const candidate of candidates) {
            fallback ||= candidate;
            const candidateSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(candidate));
            const titleMatches = !!wantedSummary && (
                candidateSummary === wantedSummary
                || candidateSummary.includes(wantedSummary)
                || wantedSummary.includes(candidateSummary)
            );
            if (titleMatches) return candidate;
        }
        // 有目标标题时绝不退回“唯一候选即采用”；否则可能把同一消息里另一面兔子镜错填进当前空壳。
        return !wantedSummary && candidates.length === 1 ? fallback : null;
    } catch (error) {
        console.debug('[RabbitMirror] maintenance source parse failed:', error);
        return null;
    }
}


function replaceMaintenanceMirrorDomFromSource(root, source) {
    if (!root?.isConnected || typeof document === 'undefined') return false;
    const candidate = findCleanMaintenanceMirrorNode(source, root);
    // 空 <details><summary>...</summary></details> 不是“成功恢复”。
    // 只有候选本身确实含正文元素或直接文本时才允许替换，避免用另一份空壳覆盖当前空壳并误报 changed=true。
    if (!candidate || !maintenanceMirrorCandidateHasBody(candidate)) return false;

    const currentToto = root.matches?.(MIRROR_TOTO_SELECTOR)
        ? root
        : root.closest?.(MIRROR_TOTO_SELECTOR);
    const currentDetails = root.matches?.('details') ? root : root.querySelector?.('details');
    const candidateDetails = candidate instanceof Element ? candidate.querySelector('details') : null;
    const replaceTarget = currentToto?.isConnected ? currentToto : currentDetails?.isConnected ? currentDetails : root;
    const clonedDetails = candidateDetails?.cloneNode?.(true);
    const replacement = currentToto?.isConnected
        ? candidate
        : clonedDetails instanceof Element ? clonedDetails : null;
    if (!replaceTarget?.isConnected || !replacement) return false;

    const wasOpen = !!currentDetails?.open;
    replaceTarget.replaceWith(replacement);
    const liveRoot = replacement.matches?.('details') ? replacement : replacement.querySelector?.('details') || replacement;
    const liveDetails = liveRoot.matches?.('details') ? liveRoot : liveRoot.querySelector?.('details');
    if (liveDetails instanceof HTMLDetailsElement && wasOpen) liveDetails.open = true;
    installMaintenanceRabbitForRoot(liveRoot);
    return true;
}



function installMaintenanceSourceTruncationNotice(root, inspection) {
    if (!root?.isConnected || typeof document === 'undefined') return false;
    const details = root.matches?.('details') ? root : root.querySelector?.('details');
    if (!details) return false;
    if (details.querySelector?.(`[${SOURCE_TRUNCATION_NOTICE_ATTR}]`)) return false;

    const notice = document.createElement('div');
    notice.setAttribute(SOURCE_TRUNCATION_NOTICE_ATTR, 'true');
    notice.setAttribute('role', 'status');
    notice.style.cssText = 'box-sizing:border-box;width:calc(100% - 24px);margin:16px 12px;padding:16px;border:1px dashed currentColor;border-radius:6px;background:rgba(127,127,127,.08);color:inherit;line-height:1.65;opacity:.9;';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight:700;margin-bottom:6px;';
    title.textContent = inspection?.full?.rawCssTruncated ? '原始输出已截断' : '原始输出为空壳';
    const message = document.createElement('div');
    const independent = isIndependentMaintenanceRoot(root);
    message.textContent = inspection?.full?.rawCssTruncated
        ? (independent ? '副 API 输出在 <style> 中途结束，镜面正文没有生成，无法从现有内容恢复。请使用挨打猫“重说”。' : '这条兔子镜在 <style> 中途结束，正文没有出现在原始源码中，无法从现有内容恢复。请重新生成这条消息。')
        : (independent ? '副 API 返回的是空壳兔子镜，维修兔不会借用聊天正文补写。请使用挨打猫“重说”。' : '这条兔子镜的原始源码没有可显示的正文主体，无法凭空恢复缺失内容。请重新生成这条消息。');
    const detail = document.createElement('div');
    detail.style.cssText = 'margin-top:8px;font-size:.88em;opacity:.72;';
    detail.textContent = '维修兔仅显示此说明，不会改写聊天原文。';
    notice.append(title, message, detail);

    const summary = details.querySelector?.(':scope > summary') || details.querySelector?.('summary');
    if (summary) summary.insertAdjacentElement('afterend', notice);
    else details.prepend(notice);
    return true;
}


export function isIndependentMaintenanceRoot(root){
 if(independentMaintenanceHost(root)) return true;
 const details=root?.matches?.('details')?root:root?.querySelector?.('details');
 return String(details?.dataset?.rabbitMirrorExternalSource||'')==='independent';
}

function exactIndependentMaintenanceRoot(root){
 const face=getRabbitMirrorFacePosition(root);
 if(face?.source==='independent') return face.details || null;
 const host=independentMaintenanceHost(root);
 return host ? null : root;
}

function independentMaintenanceRootHasBody(root){
 const details=exactIndependentMaintenanceRoot(root)?.matches?.('details')
  ? exactIndependentMaintenanceRoot(root)
  : exactIndependentMaintenanceRoot(root)?.querySelector?.('details');
 if(!details) return false;
 const summary=details.querySelector?.(':scope > summary');
 return [...(details.childNodes||[])].some(node=>{
  if(node===summary) return false;
  if(node.nodeType===3) return !!String(node.textContent||'').trim();
  if(node.nodeType!==1 || ['STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node.tagName)) return false;
  if(node.matches?.('[data-rabbit-mirror-tool-entry-host], [data-rabbit-mirror-source-truncation-notice]')) return false;
  if(node.hidden || String(node.getAttribute?.('aria-hidden')||'').toLowerCase()==='true') return false;
  return !!(String(node.textContent||'').trim() || node.children?.length || node.matches?.('img,svg,canvas,video,audio,input,button,select,textarea,table,ul,ol,section,article,main,figure,form'));
 });
}

function repairMaintenanceMessageSource(root, inspection) {
    if (isIndependentMaintenanceRoot(root)) {
        const blank = !independentMaintenanceRootHasBody(root);
        const localInspection = blank
            ? { ...inspection, full: { ...(inspection?.full || {}), rawSourceBodyMissing: true } }
            : inspection;
        const noticeShown = blank ? installMaintenanceSourceTruncationNotice(root, localInspection) : false;
        return { changed: false, noticeShown, unrecoverable: blank, index: getMessageIndexFromMirrorNode(root), reason: blank
            ? '副 API返回的是空壳兔子镜；维修兔已保持正文不变，请使用挨打猫“重说”。'
            : '副 API兔子镜与正文完全隔离；维修兔只处理当前镜面 DOM，不会读取、重绘或改写正文。' };
    }
    const index = getMessageIndexFromMirrorNode(root);
    if (index < 0) return { changed: false, index, reason: '无法识别所属消息' };
    const host = hostScriptModule || globalThis;
    const chat = host?.chat || globalThis.chat;
    const message = Array.isArray(chat) ? chat[index] : null;
    if (!message || message?.is_user) return { changed: false, index, reason: '未找到可维护的助手消息' };

    const hasReasoningEnvelope = messageContainsReasoningEnvelope(message);
    const distinctDisplaySource = messageUsesDistinctDisplaySource(message);
    // 存在独立 display_text 时只使用显示源本身，不回退到 mes/swipe，避免绕过用户显示正则。
    const source = getSelectedMessageSource(message, { preferDisplay: distinctDisplaySource });
    if (!source) return { changed: false, index, reason: distinctDisplaySource ? '独立显示源中没有可恢复的兔子镜源码' : '没有可恢复的消息源' };

    if (inspection?.full?.rawSourceBodyMissing) {
        // mes、当前 swipe 与非独立 display_text 偶尔会在宿主插件链中不同步。
        // 先在同一条消息的当前有效来源中按 summary 精确寻找完整镜面；只恢复同标题且确有正文的候选。
        // 不扫描历史 swipe，不跨消息回填，也不绕过独立 display_text，避免混入另一版剧情或被显示规则隐藏的内容。
        const alternate = findRecoverableMaintenanceMirrorSource(message, root, { displayOnly: distinctDisplaySource });
        if (alternate?.source) {
            const recovered = replaceMaintenanceMirrorDomFromSource(root, alternate.source);
            if (recovered) {
                return { changed: true, index, reason: `已从同一消息的${alternate.label}恢复同标题完整兔子镜；未改写聊天原文` };
            }
        }

        const noticeShown = installMaintenanceSourceTruncationNotice(root, inspection);
        const reason = inspection?.full?.rawCssTruncated
            ? '原始输出在 <style> 中途截断，正文未生成；已标记为生成失败，无法恢复不存在的内容'
            : '当前消息、当前 swipe、显示源与本轮临时快照中均没有同标题完整正文；已标记为生成失败，无法凭空补写';
        return { changed: false, noticeShown, unrecoverable: true, index, reason };
    }

    const hasSourceCandidate = inspection?.full?.sourceCandidate || inspection?.code?.strictWhole || inspection?.code?.needsSanitize;
    if (hasSourceCandidate) {
        // 先在当前有效消息来源中寻找同标题且确有正文的候选，再只重建这一面 DOM。
        // 这样即使当前 swipe 与 mes 暂时不同步，也不会先拿空壳候选误报恢复成功。
        const recoverable = findRecoverableMaintenanceMirrorSource(message, root, { displayOnly: distinctDisplaySource });
        const sourceForRecovery = recoverable?.source || source;
        const isolatedMirrorSource = extractIsolatedMaintenanceMirrorSource(sourceForRecovery, root);
        if (isolatedMirrorSource) {
            const directDomRecovered = replaceMaintenanceMirrorDomFromSource(root, isolatedMirrorSource);
            if (directDomRecovered) {
                const notes = [];
                if (recoverable?.label) notes.push(`来源=${recoverable.label}`);
                if (hasReasoningEnvelope) notes.push('已隔离思维包裹');
                if (/<script\b/i.test(isolatedMirrorSource)) notes.push('脚本已移除，静态主体已保留');
                const note = notes.length ? `（${notes.join('；')}）` : '';
                return { changed: true, index, reason: `已从当前消息源码安全重建这一面兔子镜 DOM${note}` };
            }
        }

        // 只有不存在思维包裹、且没有独立显示源时，才允许退回整条消息瞬时重绘。
        // 这保留原有隐私边界，同时不再误伤“可安全隔离当前兔子镜”的情况。
        if (!hasReasoningEnvelope && !distinctDisplaySource) {
            const directRecovered = recoverMessageSourceToDisplay(host, index, message, { force: true, sourceOverride: source });
            if (directRecovered) return { changed: true, index, reason: '已调用旧源码恢复模块重建当前消息显示层' };
        }
    }

    if (hasReasoningEnvelope) {
        return { changed: false, index, reason: '存在思维包裹；已尝试安全提取当前兔子镜，但未得到可重建片段，未执行整条重绘' };
    }
    if (distinctDisplaySource) {
        return { changed: false, index, reason: '存在独立显示源；当前兔子镜无法安全隔离，未回退到原始消息整条重绘' };
    }

    let repaired = source;
    if (inspection?.full?.damagedDataUriCandidate || inspection?.full?.structureTruncated) {
        repaired = rescueDamagedDataUriRabbitMirrorOutput(repaired);
    }
    if (inspection?.full?.sourceCandidate || inspection?.code?.strictWhole || inspection?.code?.needsSanitize) {
        repaired = rescuePlainTextRabbitMirrorOutput(repaired) || repaired;
    }
    if (!repaired || repaired === source) return { changed: false, index, reason: '消息源无需重绘' };

    const transientMessage = setTransientMessageSource(message, repaired);
    const changed = preserveAndRerenderSanitizedMessage(host, index, transientMessage);
    return { changed, index, reason: changed ? '已用临时副本恢复当前消息显示层' : '当前消息重绘失败' };
}


function maintenanceSnapshotKey(root) {
    const index = getMessageIndexFromMirrorNode(root);
    const chat = getAvailableHostChat();
    const message = index >= 0 ? chat[index] : null;
    const swipe = Number.isInteger(message?.swipe_id) ? message.swipe_id : 0;
    const host = root?.matches?.('[data-rabbit-mirror-external-source="true"]')
        ? root
        : root?.closest?.('[data-rabbit-mirror-external-source="true"]');
    const sourceKind = String(host?.dataset?.rmSource || '');
    const ownerKey = sourceKind === 'independent' ? String(host?.dataset?.rmKey || '') : '';
    const faceIndex = getRabbitMirrorFacePosition(root)?.faceIndex;
    let chatKey = 'chat';
    try { chatKey = String(getCurrentChatKey?.(chat) || 'chat'); } catch {}
    const mirrorIdentity = ownerKey ? '' : followMaintenanceMirrorIdentity(root);
    const facePart = Number.isInteger(faceIndex) ? `:face:${faceIndex}` : '';
    return ownerKey ? `${chatKey}:${ownerKey}${facePart}` : `${chatKey}:${index}:${swipe}:${mirrorIdentity}${facePart}`;
}


function captureMaintenanceRepairOrigin(root) {
    const index = getMessageIndexFromMirrorNode(root);
    const chat = getAvailableHostChat();
    const message = index >= 0 ? chat[index] : null;
    const swipe = Number.isInteger(message?.swipe_id) ? message.swipe_id : 0;
    const host = root?.matches?.('[data-rabbit-mirror-external-source="true"]')
        ? root
        : root?.closest?.('[data-rabbit-mirror-external-source="true"]');
    const sourceKind = String(host?.dataset?.rmSource || '');
    const ownerKey = sourceKind === 'independent' ? String(host?.dataset?.rmKey || '') : '';
    let chatKey = 'chat';
    try { chatKey = String(getCurrentChatKey?.(chat) || 'chat'); } catch {}
    const selectedSource = message && !message?.is_user
        ? getSelectedMessageSource(message, { preferDisplay: messageUsesDistinctDisplaySource(message) })
        : '';
    const sourceHash = String(host?.dataset?.rmSourceHash || (selectedSource ? hashInteractionSignature(selectedSource) : ''));
    const faceIndex = getRabbitMirrorFacePosition(root)?.faceIndex;
    const mirrorIdentity = ownerKey
        ? `${ownerKey}${Number.isInteger(faceIndex) ? `:face:${faceIndex}` : ''}`
        : followMaintenanceMirrorIdentity(root);
    return Object.freeze({ chatKey, index, swipe, sourceHash, mirrorIdentity, ownerKey, faceIndex });
}


function maintenanceRepairOriginKey(origin) {
    if (!origin) return '';
    const owner = origin.ownerKey || `${origin.index}:${origin.swipe}`;
    return `${origin.chatKey}:${owner}:${origin.sourceHash}:${origin.mirrorIdentity}`;
}


function maintenanceRepairOriginIsCurrent(origin) {
    if (!origin) return false;
    const chat = getAvailableHostChat();
    let chatKey = 'chat';
    try { chatKey = String(getCurrentChatKey?.(chat) || 'chat'); } catch {}
    if (chatKey !== origin.chatKey) return false;
    if (origin.ownerKey) {
        if (typeof document === 'undefined') return false;
        const host = [...(document.querySelectorAll?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]') || [])]
            .find(candidate => String(candidate?.dataset?.rmKey || '') === origin.ownerKey);
        if (!host?.isConnected || !Number.isInteger(origin.faceIndex)) return false;
        const currentSourceHash = String(host.dataset?.rmSourceHash || '');
        const faces = [...(host.children || [])].filter(child => child?.matches?.('details') && isRabbitMirrorDetails(child));
        const currentFace = faces[origin.faceIndex];
        return !!origin.sourceHash && !!currentSourceHash && currentSourceHash === origin.sourceHash
            && !!currentFace && getRabbitMirrorFacePosition(currentFace)?.faceIndex === origin.faceIndex;
    }
    const message = Number.isInteger(origin.index) && origin.index >= 0 ? chat[origin.index] : null;
    if (!message || message?.is_user) return false;
    const swipe = Number.isInteger(message?.swipe_id) ? message.swipe_id : 0;
    if (swipe !== origin.swipe) return false;
    const source = getSelectedMessageSource(message, { preferDisplay: messageUsesDistinctDisplaySource(message) });
    const sourceHash = source ? hashInteractionSignature(source) : '';
    if (!sourceHash || sourceHash !== origin.sourceHash || !origin.mirrorIdentity) return false;
    const messageElement = getRenderedMessageElement(origin.index);
    if (!messageElement?.isConnected) return false;
    return getRenderedRabbitMirrorInteractionRoots(messageElement)
        .some(candidate => followMaintenanceMirrorIdentity(candidate) === origin.mirrorIdentity);
}


export function beginMaintenanceRepairRun(root, button) {
    const origin = captureMaintenanceRepairOrigin(root);
    const key = maintenanceRepairOriginKey(origin);
    if (!key || maintenanceRepairActiveRuns.has(key)) return null;
    const token = (Number(maintenanceRepairRunTokens.get(key)) || 0) + 1;
    maintenanceRepairRunTokens.delete(key);
    maintenanceRepairRunTokens.set(key, token);
    maintenanceRepairActiveRuns.add(key);
    const repairRun = Object.freeze({ key, token, origin, button });
    maintenanceRepairRunRecords.set(key, repairRun);
    return repairRun;
}


function maintenanceRepairRunIsCurrent(repairRun) {
    return !!repairRun
        && maintenanceRepairActiveRuns.has(repairRun.key)
        && maintenanceRepairRunTokens.get(repairRun.key) === repairRun.token
        && maintenanceRepairOriginIsCurrent(repairRun.origin);
}


export function finishMaintenanceRepairRun(repairRun) {
    if (!repairRun || maintenanceRepairRunTokens.get(repairRun.key) !== repairRun.token) return false;
    maintenanceRepairActiveRuns.delete(repairRun.key);
    maintenanceRepairRunRecords.delete(repairRun.key);
    for (const [timer, key] of maintenanceRepairTimers.entries()) {
        if (key !== repairRun.key) continue;
        clearTimeout(timer);
        maintenanceRepairTimers.delete(timer);
    }
    while (maintenanceRepairRunTokens.size > 128) {
        const oldest = maintenanceRepairRunTokens.keys().next().value;
        if (!oldest || maintenanceRepairActiveRuns.has(oldest)) break;
        maintenanceRepairRunTokens.delete(oldest);
    }
    return true;
}


function scheduleMaintenanceRepairCallback(repairRun, delay, callback, button = repairRun?.button) {
    let timer = 0;
    timer = setTimeout(() => {
        maintenanceRepairTimers.delete(timer);
        if (!maintenanceRepairRunIsCurrent(repairRun)) {
            cancelMaintenanceRepairRun(repairRun, '维修已因聊天、Swipe、正文或镜面身份变化取消');
            return;
        }
        try {
            callback();
        } catch (error) {
            console.debug('[RabbitMirror] delayed maintenance repair failed:', error);
            failMaintenanceRabbit(button, '维修延迟复核执行失败，请生成全链路诊断');
            finishMaintenanceRepairRun(repairRun);
        }
    }, Math.max(0, Number(delay) || 0));
    maintenanceRepairTimers.set(timer, repairRun?.key || '');
    return timer;
}


export function cancelMaintenanceRepairRun(repairRun, reason = '维修已因当前目标变化取消', { notify = true } = {}) {
    if (!repairRun || maintenanceRepairRunTokens.get(repairRun.key) !== repairRun.token) return false;
    if (notify && repairRun.button?.isConnected) failMaintenanceRabbit(repairRun.button, `❌ ${reason}`);
    return finishMaintenanceRepairRun(repairRun);
}


export function cancelMaintenanceRepairRuns(reason = '维修已因聊天、Swipe 或正文变化取消', { notify = false } = {}) {
    const activeRuns = [...maintenanceRepairRunRecords.values()];
    for (const timer of maintenanceRepairTimers.keys()) clearTimeout(timer);
    maintenanceRepairTimers.clear();
    if (notify) {
        for (const repairRun of activeRuns) {
            if (repairRun.button?.isConnected) failMaintenanceRabbit(repairRun.button, `❌ ${reason}`);
        }
    }
    maintenanceRepairActiveRuns.clear();
    maintenanceRepairRunRecords.clear();
    maintenanceRepairRunTokens.clear();
}


function trimMaintenanceSnapshots(max = 24) {
    while (maintenancePreRepairSnapshots.size > max) {
        const oldest = [...maintenancePreRepairSnapshots.entries()].sort((a, b) => Number(a[1]?.ts || 0) - Number(b[1]?.ts || 0))[0]?.[0];
        if (!oldest) break;
        maintenancePreRepairSnapshots.delete(oldest);
    }
}


function trimRabbitMirrorInteractionResetSnapshots(max = 24) {
    while (rabbitMirrorInteractionResetSnapshots.size > max) {
        const oldest = [...rabbitMirrorInteractionResetSnapshots.entries()].sort((a, b) => Number(a[1]?.ts || 0) - Number(b[1]?.ts || 0))[0]?.[0];
        if (!oldest) break;
        rabbitMirrorInteractionResetSnapshots.delete(oldest);
    }
}


function rabbitMirrorInteractionResetIdentityNode(root) {
    if (!root) return null;
    if (root.matches?.('details')) return root;
    return root.querySelector?.(':scope > details') || root.querySelector?.('details') || root;
}


function rabbitMirrorInteractionResetInstanceId(root, create = false) {
    const node = rabbitMirrorInteractionResetIdentityNode(root);
    if (!node) return '';
    let id = rabbitMirrorInteractionResetInstanceIds.get(node) || '';
    if (!id && create) {
        rabbitMirrorInteractionResetInstanceCounter += 1;
        id = `${Date.now().toString(36)}-${rabbitMirrorInteractionResetInstanceCounter.toString(36)}`;
        rabbitMirrorInteractionResetInstanceIds.set(node, id);
    }
    return id;
}


function rabbitMirrorInteractionResetSourceSignature(root) {
    const externalHost = root?.matches?.('[data-rabbit-mirror-external-source="true"]')
        ? root
        : root?.closest?.('[data-rabbit-mirror-external-source="true"]');
    const externalSourceHash = String(
        externalHost?.getAttribute?.('data-rabbit-mirror-owner-source-hash')
        || externalHost?.getAttribute?.('data-rm-owner-source-hash')
        || externalHost?.dataset?.rabbitMirrorOwnerSourceHash
        || '',
    ).trim();
    const externalOwnerKey = String(externalHost?.dataset?.rmKey || externalHost?.dataset?.rabbitMirrorExternalOwner || '').trim();
    if (externalSourceHash || externalOwnerKey) {
        return hashInteractionSignature(`external|${externalOwnerKey}|${externalSourceHash}`);
    }

    const index = getMessageIndexFromMirrorNode(root);
    const chat = getAvailableHostChat();
    const message = index >= 0 ? chat[index] : null;
    if (message && !message?.is_user) {
        const swipe = Number.isInteger(message?.swipe_id) ? message.swipe_id : 0;
        // Exact immutable source strings are the revision evidence. Do not parse
        // HTML entities and hash the entire multi-face reply again on pointerdown,
        // click, and every maintenance-menu open. A changed source (including an
        // equal-length edit), selected swipe, display source or index is a miss.
        const mes = message.mes;
        const swipeSource = message.swipes?.[message.swipe_id];
        const display = message.extra?.display_text;
        const previous = rabbitMirrorInteractionResetSourceSignatures.get(message);
        if (previous && previous.index === index && previous.swipeId === message.swipe_id
            && previous.mes === mes && previous.swipeSource === swipeSource && previous.display === display) return previous.signature;
        const source = getSelectedMessageSource(message, { preferDisplay: messageUsesDistinctDisplaySource(message) });
        const signature = source ? hashInteractionSignature(`${index}|${swipe}|${source}`) : 'fallback';
        rabbitMirrorInteractionResetSourceSignatures.set(message, { index, swipeId: message.swipe_id, mes, swipeSource, display, signature });
        return signature;
    }
    return 'fallback';
}


function rabbitMirrorInteractionResetSnapshotKey(root, createInstance = false) {
    const base = maintenanceSnapshotKey(root);
    const instance = rabbitMirrorInteractionResetInstanceId(root, createInstance);
    const source = rabbitMirrorInteractionResetSourceSignature(root);
    return base && instance && source ? `${base}|mirror:${instance}|src:${source}` : '';
}


function cleanRabbitMirrorInteractionResetClone(details) {
    if (!details?.cloneNode) return null;
    const clone = cloneRabbitMirrorFilteredNode(details);
    clone.querySelectorAll?.(`[${EXTERNAL_REFERENCE_NOTE_ATTR}]`)?.forEach(node => node.remove());
    clone.querySelectorAll?.(`[data-rm-image-region], [data-rm-image-portal], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}], [${RECIPE_MENU_ATTR}]`)?.forEach(node => node.remove());
    clone.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
    clone.querySelectorAll?.('[data-rabbit-mirror-maintenance-checked-sandbox]')?.forEach(node => node.remove());
    clone.querySelectorAll?.(`[${INTERACTION_HOME_ATTR}]`)?.forEach(node => node.remove());
    return clone;
}


export function removeRabbitMirrorInteractionHomeControls(root) {
    if (!root) return 0;
    const controls = new Set();
    if (root.matches?.(`[${INTERACTION_HOME_ATTR}]`)) controls.add(root);
    root.querySelectorAll?.(`[${INTERACTION_HOME_ATTR}]`)?.forEach(node => controls.add(node));
    let removed = 0;
    for (const control of controls) {
        control.remove?.();
        removed += 1;
    }
    return removed;
}


function invalidateRabbitMirrorInteractionResetSnapshot(root) {
    rabbitMirrorInteractionResetBudgetSkips.delete(root);
    const key = rabbitMirrorInteractionResetSnapshotKey(root, false);
    if (key) rabbitMirrorInteractionResetSnapshots.delete(key);
}


function captureRabbitMirrorInteractionResetSnapshot(root) {
    if (!root?.isConnected) return false;
    // Pointerdown and click both reach this boundary. Once this exact owner,
    // source and DOM instance has a baseline, do not walk its entire subtree
    // again for every control activation. Owner/source checks still run first.
    const key = rabbitMirrorInteractionResetSnapshotKey(root, true);
    if (!key || rabbitMirrorInteractionResetSnapshots.has(key)
        || rabbitMirrorInteractionResetBudgetSkips.get(root) === key) return false;
    // This capture runs on pointerdown before the browser can deliver the native
    // label/radio/details interaction. Never deep-clone a large generated mirror on
    // that critical path; the optional “restore initial state” feature is skipped.
    const budget = maintenanceRepairRootBudget(root);
    if (!budget.ok || budget.nodes > 1200 || budget.attributes > 4000) {
        // Oversized scenes must not repeat the same bounded walk on every tap.
        // This negative receipt holds no DOM clone and applies only to this
        // exact source/instance; explicit repair invalidation permits a retry.
        rabbitMirrorInteractionResetBudgetSkips.set(root, key);
        return false;
    }
    rabbitMirrorInteractionResetBudgetSkips.delete(root);
    const details = root.matches?.('details') ? root : root.querySelector?.(':scope > details') || root.querySelector?.('details');
    if (!details?.parentNode) return false;
    const node = cleanRabbitMirrorInteractionResetClone(details);
    if (!node) return false;
    const instanceId = rabbitMirrorInteractionResetInstanceId(root, false);
    rabbitMirrorInteractionResetSnapshots.set(key, { node, instanceId, sourceSignature: rabbitMirrorInteractionResetSourceSignature(root), ts: Date.now() });
    trimRabbitMirrorInteractionResetSnapshots();
    // Recovery remains available from Maintenance Rabbit; never inject a generic
    // reset pill into the model-authored artwork. Also clear a persisted legacy pill.
    removeRabbitMirrorInteractionHomeControls(root);
    return true;
}


export function hasRabbitMirrorInteractionResetSnapshot(root) {
    const key = rabbitMirrorInteractionResetSnapshotKey(root, false);
    return !!key && rabbitMirrorInteractionResetSnapshots.has(key);
}


export function rabbitMirrorInteractionRootFromTarget(target) {
    if (!(target instanceof Element)) return null;
    const directToto = target.closest?.(MIRROR_TOTO_SELECTOR);
    if (directToto && isInsideChatMessage(directToto)) return directToto;
    let details = target.closest?.('details');
    while (details) {
        if (isRabbitMirrorDetails(details) && isInsideChatMessage(details)) return details;
        details = details.parentElement?.closest?.('details') || null;
    }
    const label = target.closest?.('label');
    const forId = String(label?.getAttribute?.('for') || '').trim();
    if (forId) {
        const input = label.ownerDocument?.getElementById?.(forId);
        if (input && input !== target) return rabbitMirrorInteractionRootFromTarget(input);
    }
    return null;
}


export function captureRabbitMirrorInteractionResetFromEventTarget(target) {
    if (!(target instanceof Element)) return false;
    if (target.closest?.(`[data-rm-image-region], [data-rm-image-portal], [${TOOL_ENTRY_HOST_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}], [${RECIPE_MENU_ATTR}], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) return false;
    const root = rabbitMirrorInteractionRootFromTarget(target);
    if (!root) return false;
    const details = getRabbitMirrorFacePosition(root)?.details
        || (root.matches?.('details') ? root : root.querySelector?.(':scope > details') || null);
    const summary = target.closest?.('summary');
    if (summary?.parentElement === details) return false;
    const actionable = target.closest?.('input, button, label, select, textarea, a[href], [role="button"], [tabindex], summary, [data-rabbit-mirror-change-pseudo-rescue], [data-rabbit-mirror-direct-id-click-rescue], [data-rabbit-mirror-clickable-adjacent-popup-fallback], [data-rabbit-mirror-container-internal-reveal-fallback]');
    if (!actionable || !details?.contains?.(actionable)) return false;
    return captureRabbitMirrorInteractionResetSnapshot(root);
}


export function restoreRabbitMirrorInteractionResetSnapshot(root, button) {
    const key = rabbitMirrorInteractionResetSnapshotKey(root, false);
    const snapshot = key ? rabbitMirrorInteractionResetSnapshots.get(key) : null;
    if (!snapshot?.node) {
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.unknown, '当前兔子镜还没有可恢复的交互初始状态');
        return false;
    }
    const details = root.matches?.('details') ? root : root.querySelector?.(':scope > details') || root.querySelector?.('details');
    if (!details?.parentNode) return false;
    const keepOpen = details.hasAttribute('open');
    const restoredDetails = cloneRabbitMirrorFilteredNode(snapshot.node);
    filterRabbitMirrorRuntimeDom(restoredDetails);
    if (keepOpen) restoredDetails.setAttribute('open', ''); else restoredDetails.removeAttribute('open');
    rearmRabbitMirrorSerializedInteractionRoot(restoredDetails);
    details.replaceWith(restoredDetails);
    if (snapshot.instanceId) rabbitMirrorInteractionResetInstanceIds.set(restoredDetails, snapshot.instanceId);
    const restoredRoot = root === details ? restoredDetails : root;
    try { activateRabbitMirrorInteractionRescue(restoredRoot); } catch (error) { console.debug('[RabbitMirror] interaction reset rescue rebind skipped:', error); }
    try { rehydrateRabbitMirrorMaintenanceRepairs(restoredRoot); } catch (error) { console.debug('[RabbitMirror] interaction reset maintenance rehydrate skipped:', error); }
    try { refreshRabbitMirrorToolsInScope(restoredRoot); } catch (error) { console.debug('[RabbitMirror] interaction reset tool refresh skipped:', error); }
    try { removeRabbitMirrorInteractionHomeControls(restoredRoot); } catch (error) { console.debug('[RabbitMirror] legacy interaction home cleanup skipped:', error); }
    const restoredButton = restoredRoot.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || restoredDetails.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
    setMaintenanceRabbitState(restoredButton, MAINTENANCE_STATES.idle, '已恢复这面兔子镜的交互初始状态；外层展开状态保持不变');
    if (isIndependentMaintenanceRoot(restoredRoot)) notifyIndependentRepairPersistence(restoredRoot);
    return true;
}


function captureMaintenancePreRepairSnapshot(root) {
    if (!root?.isConnected) return null;
    const details = root.matches?.('details') ? root : root.querySelector?.(':scope > details') || root.querySelector?.('details');
    if (!details?.parentNode) return null;
    const key = maintenanceSnapshotKey(root);
    const originalNode = details;

    // Independent external mirrors keep their outer host, but the maintenance working
    // <details> itself must start from a fresh DOM node. The older 1.2.19 maintenance
    // path did this naturally; repairing the same live node in-place lets old listeners
    // and WeakMap-backed checked/radio state survive across repeated repairs and fight
    // the newly installed fallback. Clone+replace only the details body, never the host.
    // Runtime-only tool buttons are rebuilt instead of cloned so their listeners cannot
    // turn into static/dead controls after the replacement.
    if (isIndependentMaintenanceRoot(root)) {
        const snapshotNode = cloneRabbitMirrorFilteredNode(originalNode);
        const workingNode = cloneRabbitMirrorFilteredNode(originalNode);
        snapshotNode.querySelectorAll?.(`[data-rm-image-region], [data-rm-image-portal], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}]`)?.forEach(node => node.remove());
        snapshotNode.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
        workingNode.querySelectorAll?.(`[data-rm-image-region], [data-rm-image-portal], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}]`)?.forEach(node => node.remove());
        workingNode.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
        const wasOpen = originalNode.hasAttribute('open');
        rearmRabbitMirrorSerializedInteractionRoot(workingNode);
        originalNode.replaceWith(workingNode);
        if (wasOpen) workingNode.setAttribute('open', ''); else workingNode.removeAttribute('open');
        try { refreshRabbitMirrorToolsInScope?.(workingNode); } catch {}
        maintenancePreRepairSnapshots.set(key, {
            node: snapshotNode,
            open: wasOpen,
            ts: Date.now(),
        });
        trimMaintenanceSnapshots();
        const workingButton = workingNode.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || null;
        return { key, root: workingNode, button: workingButton };
    }

    // The follow-main-API mirror is already live. Keep its listener-bearing DOM in
    // place and store only a detached rollback clone. Replacing the working node
    // would drop handlers while preserving data-* "already bound" markers.
    const snapshotNode = cloneRabbitMirrorFilteredNode(originalNode);
    snapshotNode.querySelectorAll?.(`[data-rm-image-region], [data-rm-image-portal], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}]`)?.forEach(node => node.remove());
    snapshotNode.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
    maintenancePreRepairSnapshots.set(key, {
        node: snapshotNode,
        open: originalNode.hasAttribute('open'),
        ts: Date.now(),
    });
    trimMaintenanceSnapshots();
    const workingButton = root.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || originalNode.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || null;
    return { key, root, button: workingButton };
}


function restoreMaintenancePreRepairSnapshot(root, button) {
    const key = maintenanceSnapshotKey(root);
    const snapshot = maintenancePreRepairSnapshots.get(key);
    if (!snapshot?.node) {
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.unknown, '当前兔子镜没有可返回的修复前界面');
        return false;
    }
    const details = root.matches?.('details') ? root : root.querySelector?.(':scope > details') || root.querySelector?.('details');
    if (!details?.parentNode) return false;
    const originalNode = snapshot.node;
    filterRabbitMirrorRuntimeDom(originalNode);
    if (snapshot.open) originalNode.setAttribute('open', ''); else originalNode.removeAttribute('open');
    rearmRabbitMirrorSerializedInteractionRoot(originalNode);
    details.replaceWith(originalNode);
    maintenancePreRepairSnapshots.delete(key);
    setTimeout(() => {
        try { refreshRabbitMirrorToolsInScope?.(originalNode); } catch {}
        try { activateRabbitMirrorInteractionRescue(originalNode); } catch {}
        try { rehydrateRabbitMirrorMaintenanceRepairs(originalNode); } catch {}
    }, 0);
    return true;
}


export function triggerDiagnosticForMaintenanceRoot(root) {
    const button = root?.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`);
    const failDiagnostic = (error, stage) => {
        console.debug(`[RabbitMirror] maintenance diagnostic ${stage} failed:`, error);
        failMaintenanceRabbit(button, `📋 全链路诊断${stage}失败，请重新打开诊断或把错误反馈给开发者`);
        return false;
    };
    if (!root?.isConnected) return failDiagnostic(new Error('diagnostic root detached'), '启动');
    try {
        removeInteractionDiagnostic(root);
        const state = { events: ['maintenance-rabbit:direct'], snapshots: [], panel: null, pre: null, report: '' };
        interactionDiagnosticStates.set(root, state);
        createOneShotInteractionDiagnosticPanel(root, state);
        captureInteractionDiagnosticSnapshot(root, state, '维修兔触发前');
        scheduleMaintenanceLabeledCheckedProbe(root, state);
        const captureLater = label => {
            try { captureInteractionDiagnosticSnapshot(root, state, label); }
            catch (error) { failDiagnostic(error, `${label} 快照`); }
        };
        setTimeout(() => captureLater('+100ms'), 100);
        setTimeout(() => captureLater('+500ms'), 500);
        setTimeout(() => finalizeOneShotInteractionDiagnostic(root, state), 650);
        return true;
    } catch (error) {
        return failDiagnostic(error, '启动');
    }
}


function maintenanceUserRepairInspection(root, mode) {
    const inspection = inspectMaintenanceRabbit(root);
    const independent = isIndependentMaintenanceRoot(root);
    if (!independent && (mode === 'source' || mode === 'code' || mode === 'plainText' || mode === 'all')) {
        inspection.full = { ...inspection.full, sourceCandidate: true };
        inspection.code = { ...inspection.code, needsSanitize: true, strictWhole: true };
    }
    if (mode === 'style' || mode === 'source' || mode === 'all') {
        const full = diagnosticFullChainSummary(root, inspection.code || {}) || {};
        if (full.damagedDataUriCandidate || full.structureTruncated || full.hostCssParserError) {
            inspection.full = { ...inspection.full, ...full };
        }
    }
    return inspection;
}


function createMaintenanceLibraryResult(mode) {
    return {
        version: MAINTENANCE_RESCUE_MODULE_VERSION,
        mode,
        code: 0,
        plainText: 0,
        interaction: 0,
        style: 0,
        scope: 0,
        executed: [],
        skipped: [],
        failed: [],
    };
}


function runMaintenanceRescueModule(module, context, result) {
    try {
        const count = Number(module.run(context)) || 0;
        result[module.bucket] = (Number(result[module.bucket]) || 0) + count;
        result.executed.push({ id: module.id, count });
    } catch (error) {
        result.failed.push({ id: module.id, message: String(error?.message || error || 'unknown error') });
        console.debug(`[RabbitMirror] maintenance module ${module.id} skipped:`, error);
    }
}


function runMaintenanceLegacyRescueLibrary(root, mode = 'all') {
    const result = createMaintenanceLibraryResult(mode);
    if (!root?.isConnected) return result;
    const independent = isIndependentMaintenanceRoot(root);
    const messageScope = independent
        ? exactIndependentMaintenanceRoot(root)
        : (root.closest?.('[data-rabbit-mirror-external-shell], [data-rabbit-mirror-external-source], .mes, [mesid], [data-message-id], [data-messageid]') || root);
    // 副 API镜面永远只维修自己；不能让任何全局源码／DOM急救器扫到聊天正文。
    // 跟随主 API 也只维修用户点中的这一面；跨同消息其它镜面的扩散扫描会在复杂输出上
    // 放大成事件长任务，并可能把另一个镜面的状态误当成当前目标。
    const targets = [independent ? exactIndependentMaintenanceRoot(root) : root];

    for (const module of MAINTENANCE_RESCUE_LIBRARY) {
        if (!module.modes.includes(mode) || (independent && ['code-block-dom', 'plain-text-dom', 'rendered-details-dom'].includes(module.id))) {
            result.skipped.push(module.id);
            continue;
        }
        if (module.perTarget) {
            for (const target of targets) {
                if (!target?.isConnected) continue;
                runMaintenanceRescueModule(module, { root, target, messageScope, mode }, result);
            }
        } else {
            runMaintenanceRescueModule(module, { root, messageScope, mode }, result);
        }
    }
    return result;
}



function mergeMaintenanceLibraryResult(target, addition, label = '') {
    if (!target || !addition) return target;
    for (const bucket of ['code', 'plainText', 'interaction', 'style', 'scope']) {
        target[bucket] = (Number(target[bucket]) || 0) + (Number(addition[bucket]) || 0);
    }
    target.executed = [...(target.executed || []), ...(addition.executed || [])];
    target.failed = [...(target.failed || []), ...(addition.failed || [])];
    if (label) target.followup = label;
    return target;
}


function followMaintenanceRepairKey(root) {
    if (!root || isIndependentMaintenanceRoot(root)) return '';
    const index = getMessageIndexFromMirrorNode(root);
    const message = index >= 0 ? getAvailableHostChat()?.[index] : null;
    const source = getSelectedMessageSource(message, { preferDisplay: true }) || getSelectedMessageSource(message);
    const identity = followMaintenanceMirrorIdentity(root);
    return identity ? `${maintenanceSnapshotKey(root)}:${hashInteractionSignature(source)}:${identity}` : '';
}


function followMaintenanceMirrorIdentity(root) {
    if (!root || isIndependentMaintenanceRoot(root)) return '';
    const existing = String(root.getAttribute?.(MAINTENANCE_MIRROR_IDENTITY_ATTR) || '').trim();
    if (existing) return existing;
    const index = getMessageIndexFromMirrorNode(root);
    const messageElement = index >= 0 ? getRenderedMessageElement(index) : null;
    const candidates = messageElement ? getRenderedRabbitMirrorInteractionRoots(messageElement) : [];
    let ordinal = candidates.findIndex(candidate => candidate === root || candidate.contains?.(root) || root.contains?.(candidate));
    if (ordinal < 0) ordinal = 0;
    const summary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(root));
    const identity = `m${ordinal}:${hashInteractionSignature(`${ordinal}|${String(root.tagName || '')}|${summary}`).slice(0, 12)}`;
    try { root.setAttribute?.(MAINTENANCE_MIRROR_IDENTITY_ATTR, identity); } catch {}
    return identity;
}


function rememberFollowMaintenanceRepair(root, mode, result) {
    const key = followMaintenanceRepairKey(root);
    if (!key) return false;
    const moduleIds = [...new Set((result?.executed || []).filter(item => Number(item?.count || 0) > 0).map(item => String(item.id || '')).filter(Boolean))];
    if (!moduleIds.length) return false;
    followMaintenanceRepairRecipes.set(key, { mode, moduleIds, lastRoot: root, ts: Date.now() });
    while (followMaintenanceRepairRecipes.size > 24) {
        const oldest = [...followMaintenanceRepairRecipes.entries()].sort((a, b) => Number(a[1]?.ts || 0) - Number(b[1]?.ts || 0))[0]?.[0];
        if (!oldest) break;
        followMaintenanceRepairRecipes.delete(oldest);
    }
    return true;
}


export function replayFollowMaintenanceRepair(root) {
    const key = followMaintenanceRepairKey(root);
    const recipe = key ? followMaintenanceRepairRecipes.get(key) : null;
    if (!recipe || recipe.lastRoot === root || !root?.isConnected) return 0;
    if (!maintenanceRepairRootBudget(root).ok) return 0;
    let repaired = 0;
    const messageScope = root.closest?.('[data-rabbit-mirror-external-shell], [data-rabbit-mirror-external-source], .mes, [mesid]') || root;
    for (const id of recipe.moduleIds) {
        const module = MAINTENANCE_RESCUE_LIBRARY.find(item => item.id === id && item.modes.includes(recipe.mode));
        if (!module) continue;
        const result = createMaintenanceLibraryResult(`replay:${recipe.mode}`);
        if (module.perTarget) runMaintenanceRescueModule(module, { root, target: root, messageScope, mode: recipe.mode }, result);
        else runMaintenanceRescueModule(module, { root, messageScope, mode: recipe.mode }, result);
        repaired += Number(result[module.bucket] || 0);
    }
    recipe.lastRoot = root; recipe.ts = Date.now();
    root.dataset.rabbitMirrorMaintenanceRecipeReplayed = repaired > 0 ? 'true' : 'checked';
    return repaired;
}


function runMaintenanceSourceInteractionFollowup(root) {
    if (!root?.isConnected) return null;
    const inspection = inspectMaintenanceRabbit(root);
    const interaction = inspection?.interaction || {};
    const shouldRepair = interaction.strippedStateProgram
        || interaction.stateControlsLost
        || interaction.checkedControlsLost
        || interaction.decorativeOverlayCandidateCount > 0
        || interaction.touchHoverMissing
        || interaction.needsScopeRepair
        || interaction.missingCheckedSubjectClassMissingCount > 0
        || interaction.radioGroupLossCandidateCount > 0
        || interaction.selectionOnlyRepairCandidateCount > 0
        || interaction.disabledOnlyChoiceCandidateCount > 0
        || interaction.inertActionButtonCandidateCount > 0
        || interaction.staticChoiceSelectionCandidateCount > 0
        || interaction.structuredStaticDisclosureCandidateCount > 0
        || interaction.fillInChoiceCandidateCount > 0
        || interaction.focusWithinPersistentMissingCount > 0
        || interaction.rawScriptTimelineMissingCount > 0
        || interaction.oneWayCheckedResultCandidateCount > 0;
    if (!shouldRepair) return null;

    const module = MAINTENANCE_RESCUE_LIBRARY.find(item => item.id === 'complete-interaction-library');
    if (!module) return null;
    const result = createMaintenanceLibraryResult('source-interaction-followup');
    runMaintenanceRescueModule(module, { root, target: root, messageScope: root, mode: 'interaction' }, result);
    return result;
}


function scheduleMaintenanceScopedFollowups(root, summaryText, messageIndex, mode, repairRun) {
    // Independent interaction repair is fully applied to the current live mirror in the
    // first pass. Do not repeat the complete repair library four more times: that old
    // follow-up pattern is unnecessary here and was the source of the post-click hitch.
    // Keep only one lightweight tool refresh; the verified 360ms completion path below
    // performs the single persistence write. No observer/polling is added.
    if (isIndependentMaintenanceRoot(root) && ['interaction', 'text', 'style'].includes(mode)) {
        // 独立 API 镜面首轮维修已经直接作用于当前 live DOM。交互、排版和样式都不再
        // 在 80/350/900/1800ms 把整套库重复跑四遍；那会让几何判定随着每次改写继续
        // 漂移，也会放大 CPU 峰值。这里只做一次轻量工具刷新，避免同一维修双写存储。
        scheduleMaintenanceRepairCallback(repairRun, 140, () => {
            const liveRoot = findLiveMaintenanceRoot(root, summaryText, messageIndex) || root;
            if (!liveRoot?.isConnected) return;
            installMaintenanceRabbitForRoot(liveRoot);
        });
        return;
    }
    // One bounded follow-up only: if the host replaced the repaired DOM, replay the
    // exact successful module recipe on the new live root. Never rescan/repair source four times.
    scheduleMaintenanceRepairCallback(repairRun, 160, () => {
        const liveRoot = findLiveMaintenanceRoot(root, summaryText, messageIndex);
        if (!liveRoot?.isConnected) return;
        if (liveRoot !== root) replayFollowMaintenanceRepair(liveRoot);
        installMaintenanceRabbitForRoot(liveRoot);
    });
}



export function maintenanceRepairPlanLabel(plan) {
    const labels = { source: '源码', style: '结构／样式', text: '排版／显示', interaction: '交互' };
    return (plan || []).map(mode => labels[mode] || mode).join(' → ');
}


function compareMaintenanceFindings(beforeFindings, afterFindings) {
    const beforeMap = new Map((beforeFindings || []).map(finding => [maintenanceFindingKey(finding), finding]));
    const afterMap = new Map((afterFindings || []).map(finding => [maintenanceFindingKey(finding), finding]));
    const resolved = [...beforeMap.entries()].filter(([key]) => !afterMap.has(key)).map(([, finding]) => finding);
    const remaining = [...afterMap.values()];
    const introduced = [...afterMap.entries()].filter(([key]) => !beforeMap.has(key)).map(([, finding]) => finding);
    return { resolved, remaining, introduced };
}


export function notifyIndependentRepairPersistence(root) {
    const host = root?.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]');
    const button = root?.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`);
    if (!host) {
        if (isIndependentMaintenanceRoot(root)) {
            button?.removeAttribute?.(MAINTENANCE_REPAIR_ATTR);
            setMaintenanceRabbitState(button, MAINTENANCE_STATES.unknown, '❌ 独立 API 维修保存目标已脱离，当前修改未确认持久化');
        }
        return false;
    }
    const detail = { root, host, persisted: null, persistenceReason: '' };
    if (!host.isConnected || typeof document === 'undefined' || typeof CustomEvent === 'undefined') {
        detail.persisted = false;
        detail.persistenceReason = '保存桥不可用或镜面已脱离页面';
    } else {
        try {
            document.dispatchEvent(new CustomEvent(INDEPENDENT_REPAIR_PERSIST_EVENT, { detail }));
        } catch (error) {
            detail.persisted = false;
            detail.persistenceReason = `保存桥执行异常：${String(error?.message || error || 'unknown').slice(0, 80)}`;
        }
    }
    // Keep the repaired live DOM authoritative until the synchronous persistence
    // bridge has copied it into both local cache and chat metadata. A nearby
    // SillyTavern/message mutation may otherwise remount the pre-repair cached HTML
    // a few hundred milliseconds later, making the interaction appear to "heal"
    // and then immediately break again.
    releaseIndependentMaintenanceLiveRepair(host, 900);
    if (detail.persisted !== true) {
        button?.removeAttribute?.(MAINTENANCE_REPAIR_ATTR);
        setMaintenanceRabbitState(
            button,
            MAINTENANCE_STATES.unknown,
            `⚠️ 维修已作用于当前界面，但独立 API 镜面保存失败（${String(detail.persistenceReason || '保存桥未响应').slice(0, 120)}）；刷新后可能丢失`,
        );
        return false;
    }
    return true;
}


function runMaintenanceAutomaticRepairPlan(root, button, repairRun) {
    if (!root?.isConnected || !button?.isConnected || !maintenanceRepairRunIsCurrent(repairRun)) {
        finishMaintenanceRepairRun(repairRun);
        return false;
    }
    if (rejectOversizedMaintenanceRepair(root, button, '自动维修')) {
        finishMaintenanceRepairRun(repairRun);
        return false;
    }
    const initialInspection = inspectMaintenanceRabbit(root);
    const initialFindings = initialInspection.findings || [];
    const initialPlan = maintenanceRepairModesForFindings(initialFindings);
    if (!initialPlan.length) {
        const state = initialInspection.state === MAINTENANCE_STATES.unknown
            ? MAINTENANCE_STATES.unknown
            : initialInspection.state;
        setMaintenanceRabbitState(button, state, initialInspection.reason || '未发现可自动维修的高置信问题');
        finishMaintenanceRepairRun(repairRun);
        return false;
    }
    markIndependentMaintenanceLiveRepair(root, 5200);
    const captured = captureMaintenancePreRepairSnapshot(root);
    if (captured) {
        root = captured.root || root;
        button = captured.button || root.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
    }

    const summaryText = stripMaintenanceRabbitGlyphs(getRabbitMirrorSummaryText(root)).trim();
    const originalIndex = getMessageIndexFromMirrorNode(root);
    const aggregate = createMaintenanceLibraryResult('auto-plan');
    aggregate.repairOrder = [...initialPlan];
    aggregate.findingsBefore = maintenanceFindingSnapshot(initialFindings);
    const discoveredFindings = new Map(initialFindings.map(finding => [maintenanceFindingKey(finding), finding]));
    aggregate.stepResults = [];
    aggregate.sourceRepairs = [];
    const attemptedModes = new Set();
    let currentRoot = root;

    setMaintenanceRabbitState(
        button,
        MAINTENANCE_STATES.checking,
        `检测到 ${initialFindings.length} 项问题，正在按顺序维修：${maintenanceRepairPlanLabel(initialPlan)}`,
    );

    const locateCurrentRoot = () => maintenanceRepairRunIsCurrent(repairRun)
        ? (findLiveMaintenanceRoot(currentRoot, summaryText, originalIndex) || currentRoot)
        : null;

    const finalize = () => {
        const liveRoot = locateCurrentRoot();
        const liveButton = liveRoot?.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
        if (!liveRoot?.isConnected) {
            failMaintenanceRabbit(liveButton, '维修后无法重新定位当前兔子镜');
            finishMaintenanceRepairRun(repairRun);
            return;
        }
        if (rejectOversizedMaintenanceRepair(liveRoot, liveButton, '维修后复核')) {
            finishMaintenanceRepairRun(repairRun);
            return;
        }
        const afterInspection = inspectMaintenanceRabbit(liveRoot);
        for (const finding of afterInspection.findings || []) discoveredFindings.set(maintenanceFindingKey(finding), finding);
        const comparison = compareMaintenanceFindings([...discoveredFindings.values()], afterInspection.findings || []);
        aggregate.findingsAfter = maintenanceFindingSnapshot(afterInspection.findings || []);
        aggregate.verification = {
            resolved: maintenanceFindingSnapshot(comparison.resolved),
            remaining: maintenanceFindingSnapshot(comparison.remaining),
            introduced: maintenanceFindingSnapshot(comparison.introduced),
        };
        aggregate.autoSelected = 'multi-plan';
        aggregate.mode = 'auto-plan';
        aggregate.sourceRepair = aggregate.sourceRepairs[0] || { attempted: false, changed: false, reason: '' };
        liveRoot.dataset.rabbitMirrorMaintenanceModules = JSON.stringify(aggregate);
        liveButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);

        const resolvedLabels = comparison.resolved.map(item => item.label);
        const remainingLabels = comparison.remaining.map(item => item.label);
        const failedModules = [...new Set((aggregate.failed || []).map(item => String(item?.id || '')).filter(Boolean))];
        if (afterInspection.full?.sourceTruncationNoticeInstalled) {
            setMaintenanceRabbitState(liveButton, MAINTENANCE_STATES.unknown, '本次生成不完整，未计为修复成功；请重新生成该条');
        } else if (remainingLabels.length) {
            const resolvedText = resolvedLabels.length ? `已验证修复 ${resolvedLabels.length} 项：${resolvedLabels.join('、')}；` : '尚未验证任何问题已消失；';
            setMaintenanceRabbitState(
                liveButton,
                MAINTENANCE_STATES.repairable,
                `${failedModules.length ? `⚠️ ${failedModules.length} 个维修模块已安全跳过（${failedModules.join('、')}）；` : ''}${resolvedText}仍有 ${remainingLabels.length} 项：${remainingLabels.join('；')}`,
            );
        } else if (afterInspection.state === MAINTENANCE_STATES.unknown) {
            setMaintenanceRabbitState(
                liveButton,
                MAINTENANCE_STATES.unknown,
                `已验证修复 ${resolvedLabels.length} 项；仍无法安全确认：${afterInspection.reason}`,
            );
        } else if (failedModules.length) {
            setMaintenanceRabbitState(
                liveButton,
                MAINTENANCE_STATES.unknown,
                `⚠️ 已验证修复 ${resolvedLabels.length} 项，但 ${failedModules.length} 个维修模块执行异常并已安全跳过（${failedModules.join('、')}）；请实际确认`,
            );
        } else {
            liveButton.setAttribute(MAINTENANCE_REPAIR_ATTR, 'true');
            setMaintenanceRabbitState(
                liveButton,
                MAINTENANCE_STATES.idle,
                `已按顺序维修并验证 ${resolvedLabels.length} 项：${resolvedLabels.join('、') || '未发现剩余高置信异常'}`,
            );
        }

        const persistenceOk = notifyIndependentRepairPersistence(liveRoot);
        if (isIndependentMaintenanceRoot(liveRoot) && !persistenceOk) {
            finishMaintenanceRepairRun(repairRun);
            return;
        }

        // 宿主可能在维修后稍晚重绘；再做一次只读复核，若问题重新出现则恢复黄灯。
        scheduleMaintenanceRepairCallback(repairRun, 1100, () => {
            try {
                const verifyRoot = findLiveMaintenanceRoot(liveRoot, summaryText, originalIndex) || liveRoot;
                const verifyButton = verifyRoot?.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || liveButton;
                if (!verifyRoot?.isConnected || !verifyButton?.isConnected) return;
                if (rejectOversizedMaintenanceRepair(verifyRoot, verifyButton, '延迟复核')) return;
                const lateInspection = inspectMaintenanceRabbit(verifyRoot);
                if ((lateInspection.findings || []).length) {
                    setMaintenanceRabbitState(
                        verifyButton,
                        MAINTENANCE_STATES.repairable,
                        `延迟复核仍检测到 ${(lateInspection.findings || []).length} 项：${maintenanceFindingReason(lateInspection.findings || [])}`,
                    );
                }
            } finally {
                finishMaintenanceRepairRun(repairRun);
            }
        }, liveButton);
    };

    const runNextStep = () => {
        const liveRoot = locateCurrentRoot();
        if (!liveRoot?.isConnected) {
            finalize();
            return;
        }
        const liveButton = liveRoot.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
            if (rejectOversizedMaintenanceRepair(liveRoot, liveButton, '自动维修')) {
                finishMaintenanceRepairRun(repairRun);
                return;
            }
        currentRoot = liveRoot;
        const currentInspection = inspectMaintenanceRabbit(liveRoot);
        for (const finding of currentInspection.findings || []) discoveredFindings.set(maintenanceFindingKey(finding), finding);
        const currentPlan = maintenanceRepairModesForFindings(currentInspection.findings || []);
        const discoveredPlan = maintenanceRepairModesForFindings([...discoveredFindings.values()]);
        const candidatePlan = [...currentPlan, ...discoveredPlan.filter(mode => !currentPlan.includes(mode))];
        const nextMode = candidatePlan.find(mode => !attemptedModes.has(mode));
        if (!nextMode) {
            finalize();
            return;
        }
        attemptedModes.add(nextMode);
        if (!aggregate.repairOrder.includes(nextMode)) aggregate.repairOrder.push(nextMode);
        const stepBefore = maintenanceFindingSnapshot(currentInspection.findings || []);
        const step = { mode: nextMode, before: stepBefore, sourceRepair: null, modules: null };
        aggregate.stepResults.push(step);

        const executeLibrary = () => {
            const latestRoot = locateCurrentRoot();
            if (!latestRoot?.isConnected) {
                finalize();
                return;
            }
            const latestButton = latestRoot.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
            if (rejectOversizedMaintenanceRepair(latestRoot, latestButton, '自动维修')) {
                finishMaintenanceRepairRun(repairRun);
                return;
            }
            currentRoot = latestRoot;
            const nativeCheckedRestoreCount = nextMode === 'interaction'
                ? restoreIndependentNativeCheckedInteraction(latestRoot)
                : 0;
            const libraryResult = runMaintenanceLegacyRescueLibrary(latestRoot, nextMode);
            if (nativeCheckedRestoreCount > 0) {
                libraryResult.interaction = (Number(libraryResult.interaction) || 0) + nativeCheckedRestoreCount;
                libraryResult.executed.unshift({ id: 'independent-checked-state-reset', count: nativeCheckedRestoreCount });
            }
            mergeMaintenanceLibraryResult(aggregate, libraryResult, nextMode);
            step.modules = {
                executed: [...(libraryResult.executed || [])],
                failed: [...(libraryResult.failed || [])],
            };
            scheduleMaintenanceRepairCallback(repairRun, 180, () => {
                const afterStepRoot = locateCurrentRoot();
                const afterStepInspection = afterStepRoot?.isConnected ? inspectMaintenanceRabbit(afterStepRoot) : { findings: [] };
                step.after = maintenanceFindingSnapshot(afterStepInspection.findings || []);
                runNextStep();
            }, latestButton);
        };

        if (nextMode === 'source') {
            const sourceInspection = maintenanceUserRepairInspection(liveRoot, 'source');
            const sourceResult = repairMaintenanceMessageSource(liveRoot, sourceInspection);
            step.sourceRepair = {
                attempted: true,
                changed: !!sourceResult.changed,
                noticeShown: !!sourceResult.noticeShown,
                unrecoverable: !!sourceResult.unrecoverable,
                reason: String(sourceResult.reason || ''),
            };
            aggregate.sourceRepairs.push(step.sourceRepair);
            if (sourceResult.changed) scheduleMaintenanceRepairCallback(repairRun, 220, executeLibrary, liveButton);
            else executeLibrary();
        } else {
            executeLibrary();
        }
    };

    runNextStep();
    return true;
}


function maintenanceAutoSafeCountAttribute(root, attribute) {
    return Number.parseInt(root?.getAttribute?.(attribute) || '0', 10) || 0;
}


function maintenanceAutoSafeHasSettledOpenLayout(root) {
    if (!root?.isConnected) return false;
    const outerDetails = root.matches?.('details')
        ? root
        : root.querySelector?.(':scope > details') || root.querySelector?.('details');
    if (outerDetails && !outerDetails.open) return false;
    const rect = maintenanceMobileLayoutRect(outerDetails || root);
    return !!rect && rect.width > 1 && rect.height > 1;
}


function installMaintenanceAutoSafeViewportLayoutRescue(root) {
    // 视口类修复必须建立在真实展开后的布局上；折叠 details 的 0×0 几何不参与自动判断。
    if (!maintenanceAutoSafeHasSettledOpenLayout(root)) return 0;
    return installMaintenanceViewportLayoutRescue(root);
}


function installMaintenanceAutoSafeNestedDetailsPopupRescue(root) {
    // 除了外层已展开，内层 details 也必须已经由用户主动打开；随后继续沿用原有
    // absolute/fixed + clipping ancestor + 实际越界的高置信候选判定。
    if (!maintenanceAutoSafeHasSettledOpenLayout(root)) return 0;
    return repairNestedDetailsPopupClipping(root, { requireOpen: true });
}



function captureMaintenanceAutoSafeUiState(root) {
    if (!root?.querySelectorAll) return null;
    return {
        controls: [...root.querySelectorAll('input[type="checkbox"], input[type="radio"]')].map(control => ({
            control,
            checked: !!control.checked,
            defaultChecked: !!control.defaultChecked,
        })),
        details: [...root.querySelectorAll('details')].map(details => ({ details, open: !!details.open })),
    };
}


function restoreMaintenanceAutoSafeUiState(snapshot) {
    if (!snapshot) return;
    for (const item of snapshot.controls || []) {
        if (!item.control?.isConnected) continue;
        // 自动巡逻只允许补结构，不得替用户选择、取消或切换任何状态。
        item.control.checked = item.checked;
        item.control.defaultChecked = item.defaultChecked;
    }
    for (const item of snapshot.details || []) {
        if (!item.details?.isConnected) continue;
        item.details.open = item.open;
    }
}


export function runMaintenanceSafeAutomaticRepairs(root, button) {
    if (!root?.isConnected || !button?.isConnected) return { repaired: 0, modules: [] };
    const repairRun = beginMaintenanceRepairRun(root, button);
    if (!repairRun) return { repaired: 0, modules: [], skipped: 'busy' };
    try {
    if (rejectOversizedMaintenanceRepair(root, button, '自动巡逻')) return { repaired: 0, modules: [], skipped: 'budget' };
    invalidateRabbitMirrorInteractionResetSnapshot(root);
    const uiStateSnapshot = captureMaintenanceAutoSafeUiState(root);
    const modules = [];
    const failedModules = [];
    const add = (id, count) => {
        const value = Math.max(0, Number(count) || 0);
        if (value > 0) modules.push({ id, count: value });
        return value;
    };
    let repaired = 0;
    setMaintenanceRabbitState(button, MAINTENANCE_STATES.checking, '自动巡逻：正在执行不改变展开状态的安全修复');

    try {
        const beforeScoped = root.dataset?.rabbitMirrorInteractionScoped === 'true';
        const beforeRadioGroups = maintenanceAutoSafeCountAttribute(root, RADIO_GROUP_ROOT_ATTR);
        const scopeResult = root.querySelector?.('input[id], label[for]')
            ? scopeRabbitMirrorInteractionIds(root, { installRescue: false })
            : null;
        const afterScoped = root.dataset?.rabbitMirrorInteractionScoped === 'true';
        const afterRadioGroups = maintenanceAutoSafeCountAttribute(root, RADIO_GROUP_ROOT_ATTR);
        if (!beforeScoped && afterScoped && Number(scopeResult?.scopedIdCount || 0) > 0) repaired += add('interaction-id-scope', 1);
        repaired += add('radio-group-local-scope', Math.max(0, afterRadioGroups - beforeRadioGroups));
    } catch (error) {
        failedModules.push('interaction-id-scope');
        console.debug('[RabbitMirror] auto-safe ID/radio repair skipped:', error);
    }

    // 自动模式只运行不会显隐正文、不会写入当前选择状态的结构型模块。
    // focus-within / cross-parent / :has() 等视觉状态桥接仍保留给手动维修，
    // 避免误判时把所有第二层内容提前展开或锁死交互。
    const safeInstallers = [
        ['radio-reset-local-scope', installRawMessageRadioResetProgramRescue],
        ['radio-reversible-return', installReversibleRadioGroupFallback],
        ['missing-checked-control-class', installMissingCheckedSubjectClassRescue],
        ['webkit-3d-flip-compat', installWebKit3DFlipRescue],
        ['visual-scenery-mobile-overflow', installVisualSceneryMobileNarrativeOverflowRescue],
        // 1.4.30.20: this path is now fail-closed to a bounded radio/checkbox narrative and
        // applies typography/choice spacing only—no generic card shell and no state mutation.
        ['styleless-structured-rescue', installMaintenanceStylelessStructuredRescue],
        // 1.3.102: 两类高置信排版修复进入自动安全层，但只在真实展开、可测布局下运行。
        // 不提升 text/mobile-layout/annotation/完整交互/源码恢复，避免自动改变可见内容或消息源。
        ['viewport-layout-rescue', installMaintenanceAutoSafeViewportLayoutRescue],
        ['nested-details-popup-flow-repair', installMaintenanceAutoSafeNestedDetailsPopupRescue],
    ];
    for (const [id, installer] of safeInstallers) {
        try {
            repaired += add(id, installer(root));
        } catch (error) {
            failedModules.push(id);
            console.debug(`[RabbitMirror] auto-safe module ${id} skipped:`, error);
        }
    }

    // 无论模块内部发生什么，自动巡逻结束时都恢复用户原有的 checked/open 状态。
    restoreMaintenanceAutoSafeUiState(uiStateSnapshot);

    const inspection = inspectMaintenanceRabbit(root);
    const payload = {
        version: MAINTENANCE_AUTO_SAFE_VERSION,
        runtime: RUNTIME_VERSION,
        repaired,
        modules,
        failedModules,
        statePreserved: true,
        remaining: maintenanceFindingSnapshot(inspection.findings || []),
    };
    root.setAttribute(MAINTENANCE_AUTO_SAFE_ATTR, repaired > 0 ? 'repaired' : 'checked');
    root.setAttribute(MAINTENANCE_AUTO_SAFE_RESULT_ATTR, JSON.stringify(payload));
    if (repaired > 0) button.setAttribute(MAINTENANCE_REPAIR_ATTR, 'true');

    if (failedModules.length) {
        button.removeAttribute(MAINTENANCE_REPAIR_ATTR);
        const completed = repaired > 0 ? `已完成 ${repaired} 项安全修复；` : '';
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.unknown, `${completed}自动巡逻有模块执行失败：${failedModules.join('、')}；当前展开和选择状态已恢复，可点击生成全链路诊断`);
    } else if ((inspection.findings || []).length) {
        const prefix = repaired > 0 ? `已自动完成 ${repaired} 项安全修复；` : '未命中可自动处理的安全项；';
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.repairable, `${prefix}当前展开状态未改变；仍需手动确认：${maintenanceFindingReason(inspection.findings || [])}`);
    } else if (repaired > 0) {
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.healthy, `已自动完成 ${repaired} 项安全修复，未改变当前展开状态：${modules.map(item => item.id).join('、')}`);
    } else {
        setMaintenanceRabbitState(button, inspection.state, inspection.reason || '自动巡逻未发现需要安全修复的问题');
    }
    if (repaired > 0) notifyIndependentRepairPersistence(root);
    return { repaired, modules, failedModules, inspection };
    } finally {
        finishMaintenanceRepairRun(repairRun);
    }
}


export function runMaintenanceUserRepair(root, button, mode) {
    if (!root?.isConnected || !button?.isConnected) return false;
    const repairRun = beginMaintenanceRepairRun(root, button);
    if (!repairRun) {
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.checking, '维修正在进行，请等待当前复核完成');
        return false;
    }
    if (rejectOversizedMaintenanceRepair(root, button, mode === 'interaction' ? '交互维修' : '维修')) {
        finishMaintenanceRepairRun(repairRun);
        return false;
    }
    try {
        invalidateRabbitMirrorInteractionResetSnapshot(root);
        if (mode === 'auto') return runMaintenanceAutomaticRepairPlan(root, button, repairRun);
        markIndependentMaintenanceLiveRepair(root, 5200);
        const captured = captureMaintenancePreRepairSnapshot(root);
        if (captured) {
            root = captured.root || root;
            button = captured.button || root.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
        }
        const effectiveMode = mode;
        const labels = {
        auto: '正在自动判断并维修当前兔子镜',
        source: '正在恢复当前兔子镜的代码／纯文字显示',
        interaction: '正在尝试接上当前兔子镜的开关',
        text: '正在修复当前兔子镜的其他排版问题',
        code: '正在尝试恢复当前兔子镜的代码显示',
        plainText: '正在尝试恢复当前兔子镜的纯文字显示',
        style: '正在尝试修复当前兔子镜的显示样式',
        all: '正在对当前兔子镜执行强制维修',
        };
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.checking, labels[mode] || labels[effectiveMode] || '正在维修当前兔子镜');
        const summaryText = stripMaintenanceRabbitGlyphs(getRabbitMirrorSummaryText(root)).trim();
        const originalIndex = getMessageIndexFromMirrorNode(root);
        const inspection = maintenanceUserRepairInspection(root, effectiveMode);
        const sourceResult = (effectiveMode === 'source' || effectiveMode === 'code' || effectiveMode === 'plainText' || effectiveMode === 'style' || effectiveMode === 'all')
            ? repairMaintenanceMessageSource(root, inspection)
            : { changed: false, index: originalIndex, reason: '' };
        const continueRepair = () => {
            if (!maintenanceRepairRunIsCurrent(repairRun)) {
                finishMaintenanceRepairRun(repairRun);
                return;
            }
            const liveRoot = findLiveMaintenanceRoot(root, summaryText, sourceResult.index >= 0 ? sourceResult.index : originalIndex);
            if (!liveRoot) {
                failMaintenanceRabbit(button, '维修后未找到当前兔子镜，请生成全链路诊断');
                finishMaintenanceRepairRun(repairRun);
                return;
            }
            const liveButton = liveRoot.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
            if (rejectOversizedMaintenanceRepair(liveRoot, liveButton, effectiveMode === 'interaction' ? '交互维修' : '维修')) {
                finishMaintenanceRepairRun(repairRun);
                return;
            }
            // Clear stale rescue-owned checked state first, then run the normal verified checked fallback.
            const nativeCheckedRestoreCount = (effectiveMode === 'interaction' || effectiveMode === 'all')
                ? restoreIndependentNativeCheckedInteraction(liveRoot)
                : 0;
            const libraryResult = runMaintenanceLegacyRescueLibrary(liveRoot, effectiveMode);
            if (nativeCheckedRestoreCount > 0) {
                libraryResult.interaction = (Number(libraryResult.interaction) || 0) + nativeCheckedRestoreCount;
                libraryResult.executed.unshift({ id: 'independent-checked-state-reset', count: nativeCheckedRestoreCount });
            }
            if (sourceResult.changed && effectiveMode === 'source') {
                const followupResult = runMaintenanceSourceInteractionFollowup(liveRoot);
                if (followupResult) mergeMaintenanceLibraryResult(libraryResult, followupResult, 'interaction');
            }
            libraryResult.sourceRepair = {
                attempted: effectiveMode === 'source' || effectiveMode === 'code' || effectiveMode === 'plainText' || effectiveMode === 'style' || effectiveMode === 'all',
                changed: !!sourceResult.changed,
                noticeShown: !!sourceResult.noticeShown,
                unrecoverable: !!sourceResult.unrecoverable,
                reason: String(sourceResult.reason || ''),
            };
            const executedRepairCount = (libraryResult.executed || [])
                .filter(entry => entry?.id !== 'interaction-id-scope')
                .reduce((sum, entry) => sum + Math.max(0, Number(entry?.count) || 0), 0);
            const actualRepairApplied = !!sourceResult.changed || executedRepairCount > 0;
            liveRoot.dataset.rabbitMirrorMaintenanceModules = JSON.stringify(libraryResult);
            rememberFollowMaintenanceRepair(liveRoot, effectiveMode, libraryResult);
            if (sourceResult.unrecoverable || !actualRepairApplied) liveButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);
            else liveButton.setAttribute(MAINTENANCE_REPAIR_ATTR, 'true');
            scheduleMaintenanceScopedFollowups(
                liveRoot,
                summaryText,
                sourceResult.index >= 0 ? sourceResult.index : originalIndex,
                effectiveMode,
                repairRun,
            );
            scheduleMaintenanceRepairCallback(repairRun, 360, () => {
                const afterRoot = findLiveMaintenanceRoot(liveRoot, summaryText, sourceResult.index >= 0 ? sourceResult.index : originalIndex);
                const afterButton = afterRoot?.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || liveButton;
                if (!afterRoot) {
                    failMaintenanceRabbit(afterButton, '维修后无法重新定位当前兔子镜');
                    finishMaintenanceRepairRun(repairRun);
                    return;
                }
                if (rejectOversizedMaintenanceRepair(afterRoot, afterButton, '维修后复核')) {
                    finishMaintenanceRepairRun(repairRun);
                    return;
                }
                const after = inspectMaintenanceRabbit(afterRoot);
                const failedModules = [...new Set((libraryResult.failed || []).map(item => String(item?.id || '')).filter(Boolean))];
                if (after.full?.sourceTruncationNoticeInstalled) {
                    afterButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);
                    setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.unknown, '本次生成不完整，未计为修复成功；请重新生成该条');
                } else if (effectiveMode === 'interaction') {
                    const clip = inspectRevealedDrawerClipping(afterRoot);
                    if (clip.clipped > 0) {
                        setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.repairable, '状态已切上，但展开内容仍被裁切。请改用「展开后文字被裁」。');
                    } else if (!actualRepairApplied) {
                        afterButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);
                        setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.unknown, '没接到开关：看起来像按钮，但当前没有可保持的第二层。可用挨打猫重说。');
                    } else {
                        setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.idle, '已接上开关：点了应能保持打开。请实际点一下确认。');
                    }
                } else if (after.state === MAINTENANCE_STATES.repairable) {
                    afterButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);
                    setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.repairable, `已尝试维修，请实际确认；仍检测到：${after.reason}`);
                } else if (after.state === MAINTENANCE_STATES.unknown) {
                    afterButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);
                    setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.unknown, `已尝试维修；仍无法安全确认：${after.reason}`);
                } else if (failedModules.length) {
                    afterButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);
                    setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.unknown, `⚠️ ${failedModules.length} 个维修模块执行异常并已安全跳过（${failedModules.join('、')}）；请实际确认当前镜面`);
                } else if (!actualRepairApplied) {
                    afterButton.removeAttribute(MAINTENANCE_REPAIR_ATTR);
                    setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.unknown, `未命中任何可安全执行的维修路线，未标记为已维修${sourceResult.reason ? `：${sourceResult.reason}` : ''}`);
                } else {
                    const autoNote = mode === 'auto' ? `（自动选择：${effectiveMode}）` : '';
                    // 1.3.62: 排版类修复原本无论如何都报“已执行”。窄屏样式表在宽屏上不可能生效，
                    // 用户因此看到“修了 30 处但画面没变”，只能得出“维修兔判断错误”。这里如实说明。
                    const executedModuleCount = id => Number((libraryResult.executed || []).find(item => item?.id === id)?.count || 0);
                    const mobileOnlyMarks = executedModuleCount('mobile-layout-rescue');
                    const viewportMarks = executedModuleCount('viewport-layout-rescue');
                    const viewportWidth = Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
                    let layoutNote = '';
                    if (mobileOnlyMarks) {
                        layoutNote = `；已在当前窄屏修复 ${mobileOnlyMarks} 处手机排版风险`;
                    }
                    if (viewportMarks) {
                        layoutNote += `；已按当前窗口修复 ${viewportMarks} 处压窄／裁切／滚动问题`;
                    }
                    setMaintenanceRabbitState(afterButton, MAINTENANCE_STATES.idle, `维修路线已执行${autoNote}${layoutNote}，请实际确认是否恢复正常`);
                }
                notifyIndependentRepairPersistence(afterRoot);
                finishMaintenanceRepairRun(repairRun);
            }, liveButton);
        };
        if (sourceResult.changed) scheduleMaintenanceRepairCallback(repairRun, 200, continueRepair, button);
        else continueRepair();
    } catch (error) {
        console.debug('[RabbitMirror] maintenance user repair failed:', error);
        failMaintenanceRabbit(button, '维修执行失败，请生成全链路诊断');
        finishMaintenanceRepairRun(repairRun);
        return false;
    }
    return true;
}

// Explicit current-face width recovery. Keep the live DOM and all interaction
// state intact; this path never enters source repair or generation/persistence.

export async function runMaintenanceNarrowFaceRepair(root, button) {
    if (!root?.isConnected || !button?.isConnected) return false;
    const details = button.closest?.('details');
    if (!details || !(root === details || root.contains?.(details)) || !isRabbitMirrorDetails(details)) return false;
    if (!details.open) {
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.idle, '请先展开这面兔子镜，再执行窄面电击');
        return false;
    }
    const repairRun = beginMaintenanceRepairRun(root, button);
    if (!repairRun) return false;
    try {
        if (rejectOversizedMaintenanceRepair(root, button, '窄面电击')) return false;
        if (!maintenanceRepairRunIsCurrent(repairRun)) return false;
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.checking, '⚡ 正在重新测量并恢复这面兔子镜的宽度');
        const adapter = await import('../independentApi.js?rmv=1.5.61');
        // Loading the adapter is the sole async boundary. Never apply a delayed
        // click to a new chat, Swipe, source revision, face or replacement node.
        if (!root.isConnected || !details.isConnected || !button.isConnected
            || button.closest?.('details') !== details || !details.open
            || !maintenanceRepairRunIsCurrent(repairRun)) {
            if (button.isConnected) setMaintenanceRabbitState(button, MAINTENANCE_STATES.idle, '本次窄面电击已因目标或展开状态变化取消');
            return false;
        }
        const geometry = adapter.remeasureRabbitMirrorFaceGeometry(details);
        if (geometry.status === 'stale') {
            setMaintenanceRabbitState(button, MAINTENANCE_STATES.unknown, '镜面归属已变化，本次电击已取消');
            return false;
        }
        const summary = details.querySelector(':scope > summary');
        if (summary) containRabbitMirrorTitleToolFloat(summary);
        const content = adapter.repairRabbitMirrorFaceAutoWidth(details);
        const gains = [geometry, content].filter(result =>
            Number(result.afterWidth) > Number(result.beforeWidth) + 2);
        if (gains.length) {
            const result = gains[gains.length - 1];
            setMaintenanceRabbitState(button, MAINTENANCE_STATES.idle,
                `⚡ 已恢复宽度：${Math.round(result.beforeWidth)} → ${Math.round(result.afterWidth)}px，请确认显示`);
        } else {
            setMaintenanceRabbitState(button, MAINTENANCE_STATES.idle,
                '⚡ 已复测，未确认可安全恢复的压窄；若仍异常，请生成全链路诊断');
        }
        return gains.length > 0;
    } catch (error) {
        console.debug('[RabbitMirror] narrow face repair failed:', error);
        failMaintenanceRabbit(button, '窄面电击未完成，请生成全链路诊断');
        return false;
    } finally {
        finishMaintenanceRepairRun(repairRun);
    }
}


export function runMaintenanceRevealClipRepair(root, button) {
    if (!root?.isConnected || !button?.isConnected) return false;
    const repairRun = beginMaintenanceRepairRun(root, button);
    if (!repairRun) return false;
    try {
        if (rejectOversizedMaintenanceRepair(root, button, '展开后解裁')) return false;
        invalidateRabbitMirrorInteractionResetSnapshot(root);
        const captured = captureMaintenancePreRepairSnapshot(root);
        if (captured) {
            root = captured.root || root;
            button = captured.button || root.querySelector?.(`[${MAINTENANCE_RABBIT_ATTR}]`) || button;
        }
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.checking, '正在按当前已打开的抽屉测量并放开裁切');
        const result = repairRevealedDrawerClipping(root);
        if (result.reason === 'none-open') {
            button.removeAttribute(MAINTENANCE_REPAIR_ATTR);
            setMaintenanceRabbitState(button, MAINTENANCE_STATES.idle, '请先点开那个抽屉或选项，再使用「展开后文字被裁」。');
            return false;
        }
        if (!result.repaired) {
            button.removeAttribute(MAINTENANCE_REPAIR_ATTR);
            setMaintenanceRabbitState(button, MAINTENANCE_STATES.unknown, '当前打开的块没有高置信裁切祖先。若文字其实不在画面里，请用挨打猫重说。');
            return false;
        }
        button.setAttribute(MAINTENANCE_REPAIR_ATTR, 'true');
        setMaintenanceRabbitState(button, MAINTENANCE_STATES.idle, '已放开刚才展开的内容，请看最后一行是否完整。可用「恢复到初始」还原这一版。');
        notifyIndependentRepairPersistence(root);
        return true;
    } catch (error) {
        console.debug('[RabbitMirror] revealed clip repair failed:', error);
        failMaintenanceRabbit(button, '展开后解裁未完成，请生成全链路诊断');
        return false;
    } finally {
        finishMaintenanceRepairRun(repairRun);
    }
}


export function needsSanitize(text) {
    const decoded = decodeHtmlEntities(String(text || ''));
    if (TOTO_BLOCK_SINGLE_RE.test(decoded)) return true;
    if (/```(?:html|HTML|xml|XML)?[\s\S]*?<toto\b/i.test(decoded)) return true;
    if (FENCED_BLOCK_RE.test(decoded)) {
        FENCED_BLOCK_RE.lastIndex = 0;
        let match;
        while ((match = FENCED_BLOCK_RE.exec(decoded))) {
            const raw = stripOneCodeFence(decodeHtmlEntities(match[1]));
            if (looksLikeCompleteHtmlBlock(raw) || TOTO_BLOCK_SINGLE_RE.test(raw)) {
                FENCED_BLOCK_RE.lastIndex = 0;
                return true;
            }
        }
        FENCED_BLOCK_RE.lastIndex = 0;
    }
    return wrapTrailingNakedHtml(decoded) !== decoded.trim();
}


function findRecentAssistantMessages(mod) {
    const chat = mod?.chat || globalThis.chat;
    if (!Array.isArray(chat) || !chat.length) return [];
    const start = Math.max(0, chat.length - 8);
    return chat
        .slice(start)
        .map((message, offset) => ({ message, index: start + offset }))
        .filter(({ message }) => !message?.is_user && typeof message?.mes === 'string');
}


export function getRenderedMessageElement(index) {
    if (typeof document === 'undefined') return null;
    // SillyTavern 的 mesid 是聊天数组下标，只会是非负整数。
    const safeIndex = Number.isInteger(Number(index)) ? String(Number(index)) : '';
    return safeIndex ? document.querySelector(`#chat [mesid="${safeIndex}"]`) : null;
}


function renderedMessageHasCssError(index) {
    const messageElement = getRenderedMessageElement(index);
    if (!messageElement) return false;
    const text = messageElement.querySelector('.mes_text')?.textContent || messageElement.textContent || '';
    return /CSS\s+ERROR\s*:/i.test(text) && !!messageElement.querySelector('details, toto');
}


function preserveAndRerenderSanitizedMessage(mod, index, message) {
    try {
        const updater = mod?.updateMessageBlock || globalThis.updateMessageBlock;
        if (typeof updater !== 'function' || typeof document === 'undefined') return false;

        const messageElement = getRenderedMessageElement(index);
        const detailsOpenStates = messageElement
            ? [...messageElement.querySelectorAll('details')].map(details => details.open)
            : [];

        updater(index, message);

        // updateMessageBlock 会重建消息正文。恢复用户当时已展开的兔子镜，避免急救时突然收起。
        const restoredElement = getRenderedMessageElement(index);
        if (restoredElement && detailsOpenStates.length) {
            [...restoredElement.querySelectorAll('details')].forEach((details, detailsIndex) => {
                if (detailsOpenStates[detailsIndex]) details.open = true;
            });
        }
        return true;
    } catch (error) {
        console.debug('[RabbitMirror] rerender after sanitizer failed:', error);
        return false;
    }
}



function getMessageIndexFromElement(node) {
    const externalIndex = getExternalOwnerMessageIndex(node);
    if (externalIndex >= 0) return externalIndex;
    const messageElement = node?.closest?.('#chat [mesid], .mes[mesid]');
    const value = Number(messageElement?.getAttribute?.('mesid'));
    return Number.isInteger(value) && value >= 0 ? value : -1;
}


function getSourceRecoveryCandidate(message) {
    if (!message || message?.is_user) return '';
    const swipeIndex = Number.isInteger(message?.swipe_id) ? message.swipe_id : -1;
    const sources = [];
    if (typeof message?.extra?.display_text === 'string') sources.push(message.extra.display_text);
    if (swipeIndex >= 0 && typeof message?.swipes?.[swipeIndex] === 'string') sources.push(message.swipes[swipeIndex]);
    if (typeof message?.mes === 'string') sources.push(message.mes);

    for (const source of sources) {
        const decoded = decodeHtmlEntities(source);
        if (needsSanitize(decoded)) return decoded;
    }
    return '';
}


function recoverMessageSourceToDisplay(mod, index, message, { force = false, sourceOverride = '' } = {}) {
    if (!force || !message || message?.is_user) return false;
    const source = String(sourceOverride || getSourceRecoveryCandidate(message) || '');
    if (!source) return false;

    // 与思维链隔离保持一致：不得用含 reasoning 包裹的原始源瞬时重绘整条消息。
    if (TRANSIENT_RERENDER_REASONING_ENVELOPE_RE.test(source)) return false;

    const cleaned = cleanRabbitMirrorOutput(source);
    if (!cleaned || cleaned === source) return false;

    const signature = `${index}:${source.length}:${cleaned.length}`;
    const now = Date.now();
    const previous = sourceRecoveryLastRun.get(signature) || 0;
    if (!force && now - previous < SOURCE_RECOVERY_COOLDOWN_MS) return false;
    sourceRecoveryLastRun.set(signature, now);

    const transientMessage = cloneMessageForTransientRerender(message);
    transientMessage.mes = cleaned;
    if (Array.isArray(transientMessage.swipes)) {
        const swipeIndex = Number.isInteger(transientMessage.swipe_id)
            ? transientMessage.swipe_id
            : transientMessage.swipes.length - 1;
        if (typeof transientMessage.swipes[swipeIndex] === 'string') transientMessage.swipes[swipeIndex] = cleaned;
    }
    if (typeof transientMessage?.extra?.display_text === 'string') transientMessage.extra.display_text = cleaned;

    const rerendered = preserveAndRerenderSanitizedMessage(mod, index, transientMessage);
    return rerendered;
}



function parseHtmlFragment(html) {
    try {
        if (!validateRabbitMirrorMarkupLexicalBudget(html)) return null;
        const template = document.createElement('template');
        template.innerHTML = html;
        if (!sanitizeMaintenanceMirrorTemplate(template)) return null;
        return template.content.childNodes.length ? template.content.cloneNode(true) : null;
    } catch {
        return null;
    }
}


export function parseTotoFragment(html) {
    try {
        if (!validateRabbitMirrorMarkupLexicalBudget(html)) return null;
        const template = document.createElement('template');
        template.innerHTML = html;
        if (!sanitizeMaintenanceMirrorTemplate(template)) return null;
        const toto = template.content.querySelector('toto[data-rabbit-mirror="true"], toto');
        return toto ? toto.cloneNode(true) : null;
    } catch {
        return null;
    }
}


function isCodeShellNode(node) {
    return !!node?.matches?.(CODE_SHELL_SELECTOR);
}


function findCodeReplaceTarget(node) {
    // 只替换真正的代码块节点；绝不根据父层文字或样式向上吞掉普通容器。
    // 因而主容器的 background / border / padding / radius / shadow / layout 会原样保留。
    if (!node?.closest) return null;
    const pre = node.closest('pre');
    if (pre) return pre;
    return isCodeShellNode(node) ? node : null;
}


function getCodeCandidateText(node) {
    const clone = node.cloneNode(true);
    // 去掉代码块工具栏文字，避免“隐藏代码块/复制”等字样影响 HTML 判断。
    for (const el of [...clone.querySelectorAll('button, .copy_code, .code-copy, .codeblock-header, .code_block_header, .toolbar, .hljs-button')]) el.remove();
    return clone.textContent || '';
}



function extractLikelyHtmlFromText(text) {
    let raw = stripOneCodeFence(decodeHtmlEntities(String(text || '')))
        .replace(/\u00a0/g, ' ')
        .trim();
    if (!raw) return '';

    // 去掉“隐藏代码块/复制”等代码块工具栏文字；有些主题会把它们混进 textContent。
    raw = raw
        .replace(/^(?:隐藏代码块|显示代码块|Hide code|Show code|Copy|Copied|复制|复制代码|代码块|Code)\s*/i, '')
        .trim();

    const startMatch = raw.match(/<\s*(?:toto|div|section|article|details)\b/i);
    if (!startMatch) return '';
    raw = raw.slice(startMatch.index).trim();

    // 如果末尾混入了复制按钮/提示文字，从最后一个可信闭合标签截断。
    const closingTags = ['</toto>', '</details>', '</article>', '</section>', '</div>'];
    let end = -1;
    for (const tag of closingTags) {
        const index = raw.toLowerCase().lastIndexOf(tag);
        if (index >= 0) end = Math.max(end, index + tag.length);
    }
    if (end >= 0) raw = raw.slice(0, end).trim();

    return raw;
}


function sanitizeRenderedRabbitMirrorDetailsInScope(root, force = false) {
    if (!force) return 0;
    if (!root?.querySelectorAll) return 0;
    let repairedCount = 0;
    const detailsList = [...root.querySelectorAll('toto details, details')].filter(isRabbitMirrorDetails);

    for (const details of detailsList) {
        if (!isInsideChatMessage(details)) continue;

        // 以 summary 为锚点修复：标题已经被渲染成功时，说明外层兔子镜成立；
        // 这时只要把 summary 后面被当成源码显示的 HTML 正文拆回真实 DOM。
        const candidates = [...details.querySelectorAll('pre, code, .hljs, .code_block, .code-block, .codeblock, [class*="codeblock"], [class*="code-block"]')]
            .filter(node => node !== details && !node.closest('summary'))
            .sort((a, b) => (b.querySelectorAll('*').length - a.querySelectorAll('*').length));

        for (const node of candidates) {
            if (!node?.isConnected || !details.contains(node)) continue;
            if (node.querySelector?.('toto, details')) continue;

            const raw = extractLikelyHtmlFromText(getCodeCandidateText(node));
            if (!raw) continue;

            let replacement = null;
            if (TOTO_BLOCK_SINGLE_RE.test(raw)) {
                const cleaned = cleanRabbitMirrorOutput(raw);
                const inner = cleaned
                    .replace(/^\s*<toto\b[^>]*>/i, '')
                    .replace(/<\/toto>\s*$/i, '')
                    .trim();
                replacement = parseHtmlFragment(compactTotoBlock(inner));
            } else if (looksLikeCompleteHtmlBlock(raw)) {
                replacement = parseHtmlFragment(compactTotoBlock(raw));
            }

            if (!replacement) continue;
            const target = findCodeReplaceTarget(node);
            if (target?.isConnected && details.contains(target) && isInsideChatMessage(target) && isCodeShellNode(target)) {
                target.replaceWith(replacement);
                repairedCount += 1;
                break;
            }
        }
    }
    return repairedCount;
}



export function extractStrictWholeRabbitMirrorText(node) {
    if (!node) return '';
    const decoded = decodeHtmlEntities(String(node.textContent || ''))
        .replace(/\u00a0/g, ' ')
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        .trim();
    if (!decoded) return '';

    const match = decoded.match(/^\s*(<toto\b[\s\S]*?<\/toto>)\s*$/i);
    if (!match) return '';
    const raw = match[1].trim();
    if (!/<toto\b[^>]*data-rabbit-mirror\s*=\s*["']true["']/i.test(raw)) return '';
    if (!/<details\b/i.test(raw) || !/<summary\b[^>]*>[\s\S]*?兔子镜/i.test(raw)) return '';
    return raw;
}


function sanitizeWholePlainTextRabbitMirrorsInScope(root, force = false) {
    if (!force) return 0;
    if (!root?.querySelectorAll) return 0;
    let repairedCount = 0;
    const messageBodies = root.matches?.('.mes_text') ? [root] : [...root.querySelectorAll('.mes_text')];
    for (const body of messageBodies) {
        if (!body?.isConnected || !isInsideChatMessage(body)) continue;
        if (body.querySelector('toto, details')) continue;

        const raw = extractStrictWholeRabbitMirrorText(body);
        if (!raw) continue;
        const cleaned = cleanRabbitMirrorOutput(raw);
        const match = cleaned.match(TOTO_BLOCK_SINGLE_RE);
        const replacement = match ? parseTotoFragment(match[0]) : null;
        if (!replacement) continue;

        // 只修当前显示层，不写回 mes/swipe/display_text，也不触发保存。
        body.replaceChildren(replacement);
        repairedCount += 1;
    }
    return repairedCount;
}



function sanitizeCodeBlocksInScope(root, force = false) {
    if (!force) return 0;
    if (!root?.querySelectorAll) return 0;
    let repairedCount = 0;
    const candidates = [...new Set([...root.querySelectorAll(CODE_SHELL_SELECTOR)])]
        .filter(node => !node.querySelector?.('pre, code') || node.matches('pre, code, .hljs'));

    for (const node of candidates) {
        if (!node?.isConnected || !isInsideChatMessage(node)) continue;
        const raw = stripOneCodeFence(decodeHtmlEntities(getCodeCandidateText(node)));
        if (!raw) continue;

        let replacement = null;
        const ownerDetails = node.closest('details');
        const insideRabbitMirror = !!node.closest(MIRROR_TOTO_SELECTOR) || !!(ownerDetails && isRabbitMirrorDetails(ownerDetails));

        if (TOTO_BLOCK_SINGLE_RE.test(raw)) {
            const cleaned = cleanRabbitMirrorOutput(raw);
            const match = cleaned.match(TOTO_BLOCK_SINGLE_RE);
            replacement = match ? parseTotoFragment(match[0]) : null;
        } else if (looksLikeCompleteHtmlBlock(raw)) {
            // 已经在兔子镜 details 里面时，只把代码块内容变成真实 HTML，避免再套一层小剧场。
            replacement = insideRabbitMirror
                ? parseHtmlFragment(compactTotoBlock(raw))
                : parseTotoFragment(wrapNakedHtmlAsToto(raw));
        }

        if (!replacement) continue;
        const target = findCodeReplaceTarget(node);
        if (target?.isConnected && isInsideChatMessage(target) && isCodeShellNode(target)) {
            target.replaceWith(replacement);
            repairedCount += 1;
        }
    }
    return repairedCount;
}











