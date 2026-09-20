// Split from outputSanitizer.js — checkedStateRescue.

import { escapeCssIdentifier, escapeRegExp, getRabbitMirrorLocalStyleElements } from './runtime.js?rmv=1.5.70';
import { getClassTokens, isCollapsedDimensionValue, parseCssStateSiblingAssignments } from './renderedStateRescue.js?rmv=1.5.70';
import {
    capturePseudoStyleState,
    chooseMatchingRawRabbitMirrorRoot,
    getRawAssistantMessageForRenderedRoot,
    normalizeInteractionMatchText,
    resolveRenderedCounterpart,
    restorePseudoStyleState,
} from './scriptedInteractionRescue.js?rmv=1.5.70';
import {
    REVERSIBLE_RADIO_BASELINE_ATTR,
    applyCheckedVisualFallback,
    inputHasAssociatedLabel,
    setRescuedCheckedState,
} from './fallbackRescue.js?rmv=1.5.70';
import { RADIO_GROUP_RESCUE_ATTR } from './idsAndRearm.js?rmv=1.5.70';
import { diagnosticComputedStyle, maintenanceSafeComputedStyle } from './diagnostics.js?rmv=1.5.70';
import {
    checkedDeclarationCreatesContentReveal,
    checkedTargetCarriesResultContent,
    findMaintenanceElementByRawClass,
    isIndependentMaintenanceRoot,
    notifyIndependentRepairPersistence,
    resolveMaintenanceGeneratedClass,
} from './maintenanceInspect.js?rmv=1.5.70';
import { splitCssSelectorList } from './markup.js?rmv=1.5.70';
import {
    maintenanceMobileLayoutLengthPx,
    maintenanceMobileLayoutRect,
    maintenanceMobileLayoutTextLength,
    viewportLayoutHasAuthoredGridPlacement,
} from './layoutRescue.js?rmv=1.5.70';

const interactionInlineOverrideStates = new WeakMap();



const FOCUS_TO_CHECKED_STYLE_ATTR = 'data-rabbit-mirror-focus-to-checked-rescue';

export const FOCUS_TO_CHECKED_ROOT_ATTR = 'data-rabbit-mirror-focus-to-checked-rules';


export const CHECKED_TEXT_RULE_RESCUE_ATTR = 'data-rabbit-mirror-checked-text-rule-rescue';

export const CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR = 'data-rabbit-mirror-cross-parent-checked-rescue';

export const CROSS_PARENT_CHECKED_ROOT_ATTR = 'data-rabbit-mirror-cross-parent-checked-rules';

export const CROSS_PARENT_CHECKED_VERIFIED_ATTR = 'data-rabbit-mirror-cross-parent-checked-verified';

const crossParentCheckedFallbackRoots = new WeakSet();

const CHECKED_PSEUDO_RULE_RESCUE_STYLE_ATTR = 'data-rabbit-mirror-checked-pseudo-rule-rescue';

const CHECKED_PSEUDO_RULE_TARGET_ATTR = 'data-rm-checked-pseudo-rule-target';

const interactionPseudoOverrideStates = new WeakMap();

let checkedPseudoRuleTokenCounter = 0;

const CHECKED_HAS_STATE_RESCUE_STYLE_ATTR = 'data-rabbit-mirror-checked-has-state-rescue';

const CHECKED_HAS_STATE_ROOT_ATTR = 'data-rabbit-mirror-checked-has-state';

export const CHECKED_HAS_STATE_RULE_COUNT_ATTR = 'data-rabbit-mirror-checked-has-state-rules';

const checkedHasStateRescueStates = new WeakMap();

const DETACHED_CHECKED_HAS_RESCUE_STYLE_ATTR = 'data-rabbit-mirror-detached-checked-has-rescue';

const DETACHED_CHECKED_HAS_ROOT_ATTR = 'data-rabbit-mirror-detached-checked-has-state';

export const DETACHED_CHECKED_HAS_RULE_COUNT_ATTR = 'data-rabbit-mirror-detached-checked-has-rules';

export const DETACHED_CHECKED_HAS_CONTROL_ATTR = 'data-rm-detached-checked-has-control';

const detachedCheckedHasRescueStates = new WeakMap();

const PAIRED_CHECKED_STATE_RESCUE_ATTR = 'data-rabbit-mirror-paired-checked-state-rescue';

export const PAIRED_CHECKED_STATE_CONTROL_ATTR = 'data-rm-paired-checked-state-control';

const PAIRED_CHECKED_STATE_PANEL_ATTR = 'data-rm-paired-checked-state-panel';

export const PAIRED_CHECKED_STATE_COUNT_ATTR = 'data-rabbit-mirror-paired-checked-state-count';

const pairedCheckedStateRescueStates = new WeakMap();

const EXCLUSIVE_STACKED_STATE_RESCUE_ATTR = 'data-rabbit-mirror-exclusive-stacked-state-rescue';

export const EXCLUSIVE_STACKED_STATE_COUNT_ATTR = 'data-rabbit-mirror-exclusive-stacked-state-count';

export const EXCLUSIVE_STACKED_STATE_CONTROL_ATTR = 'data-rm-exclusive-stacked-state-control';

export const EXCLUSIVE_STACKED_STATE_PANEL_ATTR = 'data-rm-exclusive-stacked-state-panel';

const EXCLUSIVE_STACKED_STATE_GRID_SPAN_ATTR = 'data-rm-exclusive-stacked-full-grid-span';

const EXCLUSIVE_STACKED_STATE_GRID_SPAN_COUNT_ATTR = 'data-rabbit-mirror-exclusive-stacked-grid-span-count';

const exclusiveStackedStateRescueStates = new WeakMap();

const CHANNEL_DIAL_CYCLE_RESCUE_ATTR = 'data-rabbit-mirror-channel-dial-cycle-rescue';

export const CHANNEL_DIAL_CYCLE_COUNT_ATTR = 'data-rabbit-mirror-channel-dial-cycle-count';

const CHANNEL_DIAL_CYCLE_HOST_ATTR = 'data-rm-channel-dial-cycle-host';

const CHANNEL_DIAL_CYCLE_LABEL_ATTR = 'data-rm-channel-dial-cycle-label';

const channelDialCycleRescueStates = new WeakMap();

export const EXPANDED_OPACITY_RESCUE_ATTR = 'data-rabbit-mirror-expanded-opacity-rescue';

const STALE_CHECKED_INLINE_CLEANUP_ATTR = 'data-rabbit-mirror-stale-checked-inline-cleanup';

export const INDEPENDENT_NATIVE_CHECKED_RESTORE_ATTR = 'data-rabbit-mirror-independent-native-checked-restored';

export const NESTED_LABEL_STRUCTURE_RESCUE_ATTR = 'data-rabbit-mirror-nested-label-structure-rescue';

const NESTED_LABEL_PROMOTED_ATTR = 'data-rm-nested-label-promoted';


export const NESTED_CHECKED_CONTENT_RESCUE_ATTR = 'data-rabbit-mirror-nested-checked-content-rescue';


export const MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR = 'data-rabbit-mirror-missing-checked-class-rescue';

const MISSING_CHECKED_SUBJECT_CLASS_CONTROL_ATTR = 'data-rm-missing-checked-class-control';


const SELECTOR_PANEL_GRID_SPAN_ATTR = 'data-rm-selector-panel-full-grid-span';

const SELECTOR_PANEL_GRID_SPAN_COUNT_ATTR = 'data-rabbit-mirror-selector-panel-grid-span-count';


export const TARGET_ACTIVE_ATTR = 'data-rm-target-active';

export const TARGET_RESCUE_STYLE_ATTR = 'data-rabbit-mirror-target-rescue';

export const interactionCapabilityStates = new WeakMap();


export const INLINE_PSEUDO_RESCUE_ATTR = 'data-rabbit-mirror-inline-pseudo-rescue';

export const RAW_HOVER_PSEUDO_RESCUE_ATTR = 'data-rabbit-mirror-raw-hover-pseudo-rescue';

export const RAW_HOVER_DECORATION_RESTORE_ATTR = 'data-rabbit-mirror-raw-hover-decoration-restore';

export const NESTED_DETAILS_REPLACEMENT_ATTR = 'data-rm-nested-details-replacement';

export const NESTED_DETAILS_REPLACEMENT_HOST_ATTR = 'data-rm-nested-details-replacement-host';

export const NESTED_DETAILS_REPLACEMENT_STYLE_ATTR = 'data-rabbit-mirror-nested-details-replacement-style';

export const NESTED_DETAILS_REPLACEMENT_BOUND_ATTR = 'data-rm-nested-details-replacement-bound';

export const NESTED_DETAILS_REPLACEMENT_BINDING_PROP = '__rabbitMirrorNestedDetailsReplacementBinding';

export const NESTED_DETAILS_REPLACEMENT_BINDING_VERSION = '1.4.12';

export const NESTED_DETAILS_DEFERRED_BINDING_PROP = '__rabbitMirrorNestedDetailsDeferredBinding';

export const NESTED_DETAILS_DEFERRED_BINDING_VERSION = '1.4.12';

export const nestedDetailsDeferredChecks = new WeakSet();

export const NESTED_DETAILS_POPUP_RESCUE_ATTR = 'data-rm-nested-details-popup-rescue';

export const NESTED_DETAILS_POPUP_HOST_ATTR = 'data-rm-nested-details-popup-host';

export const NESTED_DETAILS_POPUP_CONTENT_ATTR = 'data-rm-nested-details-popup-content';

export const NESTED_DETAILS_POPUP_STYLE_ATTR = 'data-rabbit-mirror-nested-details-popup-style';

export const NESTED_DETAILS_POPUP_COUNT_ATTR = 'data-rabbit-mirror-nested-details-popup-count';

export const MOBILE_INLINE_ANNOTATION_RESCUE_ATTR = 'data-rabbit-mirror-mobile-inline-annotation-rescue';

export const MOBILE_INLINE_ANNOTATION_HOST_ATTR = 'data-rm-mobile-inline-annotation-host';

export const MOBILE_INLINE_ANNOTATION_ORIGINAL_ATTR = 'data-rm-mobile-inline-annotation-original';

export const MOBILE_INLINE_ANNOTATION_MIRROR_ATTR = 'data-rm-mobile-inline-annotation-mirror';

export const MOBILE_INLINE_ANNOTATION_VISIBLE_ATTR = 'data-rm-mobile-inline-annotation-visible';

export const MOBILE_INLINE_ANNOTATION_STYLE_ATTR = 'data-rabbit-mirror-mobile-inline-annotation-style';

export const MOBILE_INLINE_ANNOTATION_COUNT_ATTR = 'data-rabbit-mirror-mobile-inline-annotation-count';

export const HINTED_PSEUDO_RESCUE_ATTR = 'data-rabbit-mirror-hinted-pseudo-rescue';

export const CHANGE_PSEUDO_RESCUE_ATTR = 'data-rabbit-mirror-change-pseudo-rescue';

export const DIRECT_ID_CLICK_RESCUE_ATTR = 'data-rabbit-mirror-direct-id-click-rescue';

export const DIRECT_ID_CLASS_STATE_RESCUE_ATTR = 'data-rabbit-mirror-direct-id-class-state-rescue';

export const RAW_NAMED_FUNCTION_RESCUE_ATTR = 'data-rabbit-mirror-raw-named-function-rescue';

export const RAW_SCRIPT_TIMELINE_RESCUE_ATTR = 'data-rabbit-mirror-raw-script-timeline-rescue';

export const RAW_SCRIPT_TIMELINE_ROOT_ATTR = 'data-rabbit-mirror-raw-script-timeline-count';

export const RAW_SCRIPT_TIMELINE_STATE_ATTR = 'data-rm-script-timeline-state';

export const PASSPORT_DOCUMENT_RESCUE_ATTR = 'data-rabbit-mirror-passport-document-rescue';

export const PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR = 'data-rabbit-mirror-passport-document-trigger-rescue';

export const PASSPORT_DOCUMENT_HOST_ATTR = 'data-rm-passport-document-host';

export const PASSPORT_DOCUMENT_COVER_ATTR = 'data-rm-passport-document-cover';

export const PASSPORT_DOCUMENT_PAGES_ATTR = 'data-rm-passport-document-pages';

export const PASSPORT_DOCUMENT_CLOSE_ATTR = 'data-rm-passport-document-close';

export const PASSPORT_DOCUMENT_STAMP_ATTR = 'data-rm-passport-document-stamp';

export const PASSPORT_DOCUMENT_STAMP_INDEX_ATTR = 'data-rm-passport-document-stamp-index';

export const PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR = 'data-rm-passport-document-stamp-detail';

export const PASSPORT_DOCUMENT_STAMP_ACTIVE_ATTR = 'data-rm-passport-document-stamp-active';

export const PASSPORT_DOCUMENT_OPEN_ATTR = 'data-rm-passport-document-open';

export const PASSPORT_DOCUMENT_STYLE_ATTR = 'data-rabbit-mirror-passport-document-style';

export const MARKDOWN_CSS_COMMENT_RESCUE_ATTR = 'data-rabbit-mirror-markdown-css-comment-rescue';

export const PSEUDO_ACTIVE_ATTR = 'data-rm-pseudo-active';

export const pseudoInteractionStates = new WeakMap();

export const directIdClassStateStates = new WeakMap();
// 同一目标 class 可能由“打开／关闭”两个不同按钮控制；登记所有触发器，
// 每次执行后统一同步 aria-pressed，避免前后按钮状态互相矛盾。

export const directIdClassOperationTriggerStates = new WeakMap();

export const passportDocumentRescueStates = new WeakMap();

// 统一可逆状态底座：第一次接管某个元素时，把原始内联样式写入 data 属性并保存在 WeakMap。
// 即使宿主随后克隆当前 DOM 或急救器再次扫描，也不会把“交互后状态”误记为新的初始状态。

export const reversibleStyleBaselineStates = new WeakMap();

export const reversibleTextBaselineStates = new WeakMap();

// 同一个 checkbox/radio 只允许一条“渲染后结构型”急救路线接管，避免多个兜底互相覆盖。

export const RENDERED_INPUT_ROUTE_ATTR = 'data-rm-rendered-input-route';

export const REVERSIBLE_TARGET_CLOSE_ATTR = 'data-rm-click-to-restore';

export const REVERSIBLE_CHECKED_RESULT_RESCUE_ATTR = 'data-rabbit-mirror-reversible-checked-result-rescue';

export const REVERSIBLE_CHECKED_RESULT_TARGET_ATTR = 'data-rm-reversible-checked-result-target';

export const REVERSIBLE_CHECKED_RESULT_ROOT_ATTR = 'data-rabbit-mirror-reversible-checked-result-count';

export const reversibleTargetCloseStates = new WeakMap();

export const reversibleCheckedResultRescueStates = new WeakMap();

export const interactionLabelFallbackRoots = new WeakSet();

export const LABELED_CHECKED_VERIFY_CONTROL_ATTR = 'data-rabbit-mirror-labeled-checked-verify';

export const LABELED_CHECKED_VERIFY_ROOT_ATTR = 'data-rabbit-mirror-labeled-checked-verify-count';

export const LABELED_CHECKED_VERIFY_LAST_ATTR = 'data-rabbit-mirror-labeled-checked-last';

export const LABELED_CHECKED_VERIFY_TARGET_ATTR = 'data-rm-labeled-checked-verify-target';

export const labeledCheckedVerificationStates = new WeakMap();

export const UNLABELED_CHECKED_HOST_RESCUE_ATTR = 'data-rabbit-mirror-unlabeled-checked-host-rescue';

export const UNLABELED_CHECKED_CONTROL_RESCUE_ATTR = 'data-rabbit-mirror-unlabeled-checked-control-rescue';

export const unlabeledCheckedHostRescueStates = new WeakMap();

export const FOCUS_WITHIN_PERSISTENT_STYLE_ATTR = 'data-rabbit-mirror-focus-within-persistent-style';

export const FOCUS_WITHIN_PERSISTENT_ROOT_ATTR = 'data-rabbit-mirror-focus-within-persistent-count';

export const FOCUS_WITHIN_PERSISTENT_HOST_ATTR = 'data-rabbit-mirror-focus-within-persistent-host';

export const FOCUS_WITHIN_PERSISTENT_CONTROL_ATTR = 'data-rabbit-mirror-focus-within-persistent-control';

export const FOCUS_WITHIN_PERSISTENT_ACTIVE_ATTR = 'data-rm-focus-within-persistent-active';

export const FOCUS_WITHIN_PERSISTENT_ROUTE = 'focus-within-persistent';

export const focusWithinPersistentRescueStates = new WeakMap();

export const WEBKIT_3D_FLIP_RESCUE_ATTR = 'data-rabbit-mirror-webkit-3d-flip-rescue';

export const DECORATIVE_OVERLAY_PASS_THROUGH_ATTR = 'data-rabbit-mirror-decorative-overlay-pass-through';

export const webKit3DFlipRescueStates = new WeakMap();

export const webKit3DFlipStyleStates = new WeakMap();

export const webKit3DFlipInlineStates = new WeakMap();


export function addImportantToDeclarationBlock(blockText) {
    return String(blockText || '').replace(
        /(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+?)(\s*!important\s*)?(?=;|$)/gi,
        (match, separator, property, value) => {
            const cleanValue = String(value || '').trim().replace(/\s*!important\s*$/i, '');
            if (!cleanValue) return match;
            return `${separator}${property}: ${cleanValue} !important`;
        },
    );
}


function strengthenCheckedCssText(cssText) {
    // 生成内容经常把初始隐藏状态写成内联 style（display:none / height:0 / opacity:0）。
    // 普通 :checked 规则无法覆盖内联样式，因此只对交互状态规则追加 !important。
    return String(cssText || '').replace(/([^{}]*:checked[^{}]*)\{([^{}]*)\}/gi, (match, selector, declarations) => {
        return `${selector}{${addImportantToDeclarationBlock(declarations)}}`;
    });
}


export function strengthenRabbitMirrorCheckedStateCss(toto) {
    if (!toto?.querySelectorAll) return;

    getRabbitMirrorLocalStyleElements(toto).forEach(styleEl => {
        const currentText = String(styleEl.textContent || '');
        if (!/:checked\b/i.test(currentText)) return;

        // 文本级处理可覆盖流式晚到的 style，也不依赖 CSSStyleSheet 是否已挂载。
        const strengthened = strengthenCheckedCssText(currentText);
        if (strengthened !== currentText) styleEl.textContent = strengthened;

        // CSSOM 再兜底一次，支持 @media/@supports 内的状态规则。
        try {
            const visitRules = (rules) => {
                for (const rule of [...(rules || [])]) {
                    if (rule?.cssRules) visitRules(rule.cssRules);
                    if (!rule?.selectorText || !/:checked\b/i.test(rule.selectorText) || !rule.style) continue;
                    for (const property of [...rule.style]) {
                        const value = rule.style.getPropertyValue(property);
                        if (value) rule.style.setProperty(property, value, 'important');
                    }
                }
            };
            visitRules(styleEl.sheet?.cssRules);
        } catch {
            // 某些宿主会暂时禁止读取 CSSOM；文本级修复仍然有效。
        }
    });
}




export function findDescendantLabelForId(container, id) {
    if (!container?.querySelectorAll || !id) return null;
    const expected = String(id);
    try {
        return [...container.querySelectorAll('label[for]')]
            .find(label => String(label.getAttribute('for') || '') === expected) || null;
    } catch {
        return null;
    }
}


function replaceCheckableFocusSubject(selector, input) {
    if (!selector || !input?.id || !/:focus\b\s*[+~]/i.test(selector)) return '';

    // 只接管“checkbox/radio 自身的 :focus 作为持久状态触发器”的明确误写。
    // 目标必须位于后续兄弟链；普通按钮/链接/文本输入的 focus 视觉完全不碰。
    const subjectRe = /((?:input\b)?(?:[#.][a-zA-Z0-9_-]+|\[[^\]]+\])*)\s*:focus\b(?=\s*[+~])/gi;
    let matched = false;
    const rewritten = String(selector).replace(subjectRe, (full, subject) => {
        const candidate = String(subject || '').trim();
        if (!candidate) return full;
        try {
            if (!input.matches(candidate)) return full;
        } catch {
            return full;
        }
        matched = true;
        return `#${escapeCssIdentifier(input.id)}:checked`;
    });
    return matched ? rewritten : '';
}


function collectFocusToCheckedRules(root) {
    if (!root?.querySelectorAll) return [];
    const inputs = [...root.querySelectorAll('input[type="checkbox"], input[type="radio"]')]
        .filter(input => input.id && !input.disabled);
    if (!inputs.length) return [];

    const rules = [];
    const seen = new Set();
    getRabbitMirrorLocalStyleElements(root).filter(styleEl => !styleEl.hasAttribute(FOCUS_TO_CHECKED_STYLE_ATTR)).forEach(styleEl => {
        const css = String(styleEl.textContent || '');
        const blockRe = /([^{}]+)\{([^{}]*)\}/g;
        let match;
        while ((match = blockRe.exec(css))) {
            const selectorText = String(match[1] || '').trim();
            if (!selectorText || selectorText.startsWith('@') || !/:focus\b\s*[+~]/i.test(selectorText)) continue;
            const declarations = addImportantToDeclarationBlock(String(match[2] || ''));
            if (!declarations.trim()) continue;

            for (const selector of selectorText.split(',').map(value => value.trim()).filter(Boolean)) {
                for (const input of inputs) {
                    const rewritten = replaceCheckableFocusSubject(selector, input);
                    if (!rewritten) continue;
                    const key = `${rewritten}|${declarations}`;
                    if (seen.has(key)) continue;
                    seen.add(key);
                    rules.push(`${rewritten} {${declarations}}`);
                }
            }
        }
    });
    return rules;
}


export function refreshFocusToCheckedRescue(root) {
    if (!root?.querySelectorAll) return;
    const rules = collectFocusToCheckedRules(root);
    let rescueStyle = root.querySelector(`style[${FOCUS_TO_CHECKED_STYLE_ATTR}]`);

    if (rules.length) {
        if (!rescueStyle) {
            rescueStyle = document.createElement('style');
            rescueStyle.setAttribute(FOCUS_TO_CHECKED_STYLE_ATTR, 'true');
            root.appendChild(rescueStyle);
        }
        const nextCss = rules.join('\n');
        if (rescueStyle.textContent !== nextCss) rescueStyle.textContent = nextCss;
        root.setAttribute(FOCUS_TO_CHECKED_ROOT_ATTR, String(rules.length));
    } else {
        rescueStyle?.remove();
        root.removeAttribute(FOCUS_TO_CHECKED_ROOT_ATTR);
    }
}



function rabbitMirrorElementClassTokens(element) {
    return new Set(String(element?.className || '').split(/\s+/).filter(Boolean));
}


function rabbitMirrorLabelsExplicitInput(label, input) {
    if (!label || !input) return false;
    const targetId = String(label.getAttribute?.('for') || '').trim();
    return !!targetId && !!input.id && targetId === String(input.id);
}


function rabbitMirrorNestedBranchForControl(outerLabel, input) {
    if (!outerLabel || !input || !outerLabel.contains?.(input)) return null;
    let current = input;
    while (current?.parentElement && current.parentElement !== outerLabel) current = current.parentElement;
    return current?.parentElement === outerLabel ? current : null;
}


function rabbitMirrorLooksLikeSiblingInteractionBranch(outerContainer, branch) {
    if (!outerContainer || !branch || branch === outerContainer) return false;
    if (String(outerContainer.tagName || '') !== String(branch.tagName || '')) return false;
    const outerClasses = rabbitMirrorElementClassTokens(outerContainer);
    const branchClasses = rabbitMirrorElementClassTokens(branch);
    if (!outerClasses.size || !branchClasses.size) return false;
    return [...outerClasses].some(token => branchClasses.has(token));
}


function clearMalformedNestedLabelCheckedOverrides(root, outerLabel, inputs) {
    if (!root || !outerLabel || !inputs?.length) return 0;
    let cleared = 0;
    for (const input of inputs) restoreInteractionInlineOverrides(input);

    // Older rescue builds may have persisted checked declarations directly onto several
    // descendants of an invalid outer label. WeakMap state is lost after extension reload,
    // so remove only !important declarations that exactly equal a checked-rule value and
    // only inside this already-proven malformed nested-label subtree.
    for (const input of inputs) {
        const rescueOwned = root.hasAttribute?.('data-rabbit-mirror-interaction-rescued')
            || input.hasAttribute?.(CHECKED_TEXT_RULE_RESCUE_ATTR)
            || input.hasAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR)
            || input.hasAttribute?.(RADIO_GROUP_RESCUE_ATTR);
        if (!rescueOwned) continue;
        for (const rule of parseCheckedRulesFromText(root, input)) {
            if (rule.pseudoElement || !rule.targetSelector) continue;
            let targets = [];
            try {
                if (outerLabel.matches?.(rule.targetSelector)) targets.push(outerLabel);
                targets.push(...outerLabel.querySelectorAll(rule.targetSelector));
            } catch {
                continue;
            }
            for (const target of new Set(targets)) {
                if (!target?.style) continue;
                for (const [rawProperty, rawValue] of rule.styleMap || []) {
                    const property = String(rawProperty || '').trim().toLowerCase();
                    if (!property) continue;
                    const priority = String(target.style.getPropertyPriority(property) || '').toLowerCase();
                    const current = String(target.style.getPropertyValue(property) || '').trim();
                    if (priority !== 'important' || !current) continue;
                    if (canonicalCheckedCssValue(property, current)
                        !== canonicalCheckedCssValue(property, rawValue)) continue;
                    target.style.removeProperty(property);
                    cleared += 1;
                }
            }
        }
    }
    return cleared;
}


export function repairMalformedNestedInteractiveLabels(root) {
    if (!root?.querySelectorAll) return 0;
    const malformedOuterLabels = [...root.querySelectorAll('label')]
        .filter(label => !!label.querySelector?.('label'));
    if (!malformedOuterLabels.length) return 0;

    let promoted = 0;
    let cleaned = 0;
    for (const outerLabel of malformedOuterLabels) {
        if (!root.contains?.(outerLabel)) continue;
        const outerContainer = outerLabel.parentElement;
        const host = outerContainer?.parentElement;
        if (!outerContainer || !host) continue;

        const outerFor = String(outerLabel.getAttribute?.('for') || '').trim();
        if (!outerFor) continue;
        const outerInput = [...root.querySelectorAll('input[type="checkbox"], input[type="radio"]')]
            .find(input => String(input.id || '') === outerFor);
        if (!outerInput || outerInput.parentElement !== outerContainer) continue;

        const nestedInputs = [...outerLabel.querySelectorAll('input[type="checkbox"], input[type="radio"]')]
            .filter(input => {
                if (!input.id) return false;
                return [...outerLabel.querySelectorAll('label[for]')]
                    .some(label => label !== outerLabel && rabbitMirrorLabelsExplicitInput(label, input));
            });
        if (!nestedInputs.length) continue;

        const branches = [];
        const seen = new Set();
        for (const input of nestedInputs) {
            const branch = rabbitMirrorNestedBranchForControl(outerLabel, input);
            if (!branch || seen.has(branch)) continue;
            // High-confidence only: the malformed branch must look like another item of the
            // same repeated interaction list/card family as the outer container.
            if (!rabbitMirrorLooksLikeSiblingInteractionBranch(outerContainer, branch)) continue;
            const hasExplicitInnerLabel = [...branch.querySelectorAll?.('label[for]') || []]
                .some(label => nestedInputs.some(input => rabbitMirrorLabelsExplicitInput(label, input)));
            if (!hasExplicitInnerLabel) continue;
            seen.add(branch);
            branches.push(branch);
        }
        if (!branches.length) continue;

        const affectedInputs = [outerInput, ...nestedInputs];
        cleaned += clearMalformedNestedLabelCheckedOverrides(root, outerLabel, affectedInputs);
        for (const input of affectedInputs) {
            input.removeAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR);
        }
        root.removeAttribute?.(LABELED_CHECKED_VERIFY_LAST_ATTR);

        let anchor = outerContainer;
        for (const branch of branches) {
            host.insertBefore(branch, anchor.nextSibling);
            branch.setAttribute?.(NESTED_LABEL_PROMOTED_ATTR, 'true');
            anchor = branch;
            promoted += 1;
        }
        outerLabel.removeAttribute?.(LABELED_CHECKED_VERIFY_TARGET_ATTR);
    }

    if (promoted > 0) {
        const previous = Number.parseInt(root.getAttribute?.(NESTED_LABEL_STRUCTURE_RESCUE_ATTR) || '0', 10) || 0;
        root.setAttribute(NESTED_LABEL_STRUCTURE_RESCUE_ATTR, String(previous + promoted));
        // Rebuild only the currently active checked branch after the DOM is valid again.
        // Unchecked siblings must stay free of persisted inline second-state declarations.
        const controls = [...root.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
        for (const input of controls) restoreInteractionInlineOverrides(input);
        for (const input of controls) {
            if (input.checked) applyCheckedVisualFallback(root, input);
            input.setAttribute?.('aria-pressed', input.checked ? 'true' : 'false');
        }
        if (cleaned > 0) root.setAttribute(STALE_CHECKED_INLINE_CLEANUP_ATTR, String(cleaned));
    }
    return promoted;
}


function canonicalCheckedCssValue(property, value) {
    const clean = String(value || '').trim().replace(/\s*!important\s*$/i, '');
    if (!clean) return '';
    if (typeof document === 'undefined' || !document.createElement) {
        return clean.toLowerCase().replace(/\s+/g, ' ');
    }
    try {
        const probe = document.createElement('span');
        probe.style.setProperty(String(property || ''), clean);
        return String(probe.style.getPropertyValue(String(property || '')) || clean)
            .trim().toLowerCase().replace(/\s+/g, ' ');
    } catch {
        return clean.toLowerCase().replace(/\s+/g, ' ');
    }
}


export function clearPersistedCheckedInlineArtifacts(root, inputs) {
    if (!root?.querySelectorAll || !inputs?.length) return 0;
    let cleared = 0;
    const seen = new WeakMap();

    for (const input of inputs) {
        const rescueOwned = input.hasAttribute?.(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR)
            || input.hasAttribute?.(CHECKED_TEXT_RULE_RESCUE_ATTR)
            || input.hasAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR);
        if (!rescueOwned) continue;

        for (const rule of parseCheckedRulesFromText(root, input)) {
            if (rule.pseudoElement) continue;
            const targets = resolveTargetsForCheckedRule(root, input, rule);
            for (const target of targets) {
                if (!target?.style) continue;
                const targetOwned = target.hasAttribute?.(LABELED_CHECKED_VERIFY_TARGET_ATTR)
                    || input.hasAttribute?.(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR);
                if (!targetOwned) continue;

                let properties = seen.get(target);
                if (!properties) {
                    properties = new Set();
                    seen.set(target, properties);
                }
                for (const [rawProperty, rawValue] of rule.styleMap || []) {
                    const property = String(rawProperty || '').trim().toLowerCase();
                    if (!property || properties.has(property)) continue;
                    properties.add(property);

                    // Exclusive stacked-state rescue owns these properties after it is installed.
                    // Do not confuse its live state with a persisted stale checked override.
                    if (target.hasAttribute?.(EXCLUSIVE_STACKED_STATE_PANEL_ATTR)
                        && /^(?:display|opacity|visibility|pointer-events|z-index)$/.test(property)) continue;

                    const priority = String(target.style.getPropertyPriority(property) || '').toLowerCase();
                    const current = String(target.style.getPropertyValue(property) || '').trim();
                    if (priority !== 'important' || !current) continue;
                    if (canonicalCheckedCssValue(property, current)
                        !== canonicalCheckedCssValue(property, rawValue)) continue;

                    target.style.removeProperty(property);
                    cleared += 1;
                }
            }
        }
    }

    if (cleared > 0) {
        root.setAttribute(STALE_CHECKED_INLINE_CLEANUP_ATTR, String(cleared));
    }
    return cleared;
}


export function clearUncheckedRadioCheckedInlineArtifacts(root, radios) {
    if (!root?.querySelectorAll) return 0;
    const candidates = Array.isArray(radios)
        ? radios
        : [...root.querySelectorAll('input[type="radio"]')];
    const unchecked = candidates.filter(radio => (
        radio?.matches?.('input[type="radio"]')
        && !radio.checked
        && root.contains?.(radio)
    ));
    if (!unchecked.length) return 0;

    // Radio groups are mutually exclusive, but an old checked fallback can survive after
    // the control has already become unchecked when the WeakMap record was lost by a DOM
    // clone/re-mount. Remove only rescue-owned !important declarations that exactly match
    // the control's own :checked rule; never touch unrelated inline presentation.
    const cleared = clearPersistedCheckedInlineArtifacts(root, unchecked);
    if (cleared > 0 && isIndependentMaintenanceRoot(root)) {
        setTimeout(() => {
            if (root?.isConnected) notifyIndependentRepairPersistence(root);
        }, 0);
    }
    return cleared;
}


function clearIndependentRescueOwnedCheckedInlineArtifacts(root, inputs) {
    if (!isIndependentMaintenanceRoot(root) || !root?.querySelectorAll || !inputs?.length) return 0;
    let cleared = 0;
    const seen = new WeakMap();

    for (const input of inputs) {
        const rescueOwned = input.hasAttribute?.(CHECKED_TEXT_RULE_RESCUE_ATTR)
            || input.hasAttribute?.(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR)
            || input.hasAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR);
        restoreInteractionInlineOverrides(input);
        if (!rescueOwned) continue;

        for (const rule of parseCheckedRulesFromText(root, input)) {
            if (rule.pseudoElement) continue;
            for (const target of resolveTargetsForCheckedRule(root, input, rule)) {
                if (!target?.style) continue;
                let properties = seen.get(target);
                if (!properties) {
                    properties = new Set();
                    seen.set(target, properties);
                }
                for (const [rawProperty, rawValue] of rule.styleMap || []) {
                    const property = String(rawProperty || '').trim().toLowerCase();
                    if (!property || properties.has(property)) continue;
                    properties.add(property);
                    const priority = String(target.style.getPropertyPriority(property) || '').toLowerCase();
                    const current = String(target.style.getPropertyValue(property) || '').trim();
                    if (priority !== 'important' || !current) continue;
                    if (canonicalCheckedCssValue(property, current) !== canonicalCheckedCssValue(property, rawValue)) continue;
                    target.style.removeProperty(property);
                    cleared += 1;
                }
                target.removeAttribute?.(LABELED_CHECKED_VERIFY_TARGET_ATTR);
            }
        }
        input.removeAttribute?.(CHECKED_TEXT_RULE_RESCUE_ATTR);
        input.removeAttribute?.(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR);
        input.removeAttribute?.(CROSS_PARENT_CHECKED_VERIFIED_ATTR);
        input.removeAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR);
        input.removeAttribute?.(EXPANDED_OPACITY_RESCUE_ATTR);
        input.setAttribute?.('aria-pressed', input.checked ? 'true' : 'false');
    }

    root.removeAttribute?.(CROSS_PARENT_CHECKED_ROOT_ATTR);
    root.removeAttribute?.(LABELED_CHECKED_VERIFY_ROOT_ATTR);
    root.removeAttribute?.(LABELED_CHECKED_VERIFY_LAST_ATTR);
    if (cleared > 0) root.setAttribute(STALE_CHECKED_INLINE_CLEANUP_ATTR, String(cleared));
    return cleared;
}


export function restoreIndependentNativeCheckedInteraction(root) {
    if (!isIndependentMaintenanceRoot(root) || !root?.querySelectorAll) return 0;
    const inputs = [...root.querySelectorAll('input[type="checkbox"], input[type="radio"]')]
        .filter(input => !input.disabled && inputHasAssociatedLabel(root, input));
    if (!inputs.length) {
        root.removeAttribute?.(INDEPENDENT_NATIVE_CHECKED_RESTORE_ATTR);
        return 0;
    }

    // 1.3.39 introduced a PC external fast path that treated the mere presence of
    // meaningful :checked CSS as proof that native label/input interaction worked.
    // The maintenance sandbox can prove the opposite: selectors may be present while
    // the browser/WebView still fails to expose the second state. 1.2.19 deliberately
    // kept the manual checked fallback active in that case. Clear only stale rescue-
    // owned inline state here, then remove the fast-path marker so the verified legacy
    // label/checked/radio rescue chain is allowed to install again.
    const cleared = clearIndependentRescueOwnedCheckedInlineArtifacts(root, inputs);
    root.removeAttribute?.(INDEPENDENT_NATIVE_CHECKED_RESTORE_ATTR);
    return cleared;
}


function collectCheckedRevealSignal(candidate, property, value) {
    if (!candidate) return;
    const name = String(property || '').trim().toLowerCase();
    const cleanValue = String(value || '').trim().toLowerCase();
    if (!name || !cleanValue) return;

    if (name === 'opacity') {
        // 激活规则明确声明透明度时尊重原规则，不进行残留透明度保全。
        candidate.explicitOpacity = true;
        return;
    }

    if (name === 'display' && cleanValue !== 'none') candidate.expands = true;
    else if (name === 'visibility' && cleanValue !== 'hidden' && cleanValue !== 'collapse') candidate.expands = true;
    else if (name === 'height' || name === 'min-height' || name === 'max-height') {
        if (!isCollapsedDimensionValue(cleanValue)) candidate.expands = true;
    }
}


function rememberCheckedRevealCandidate(candidates, target, styleMap) {
    if (!target || !styleMap?.length) return;
    let candidate = candidates.get(target);
    if (!candidate) {
        candidate = { target, expands: false, explicitOpacity: false };
        candidates.set(target, candidate);
    }
    for (const [property, value] of styleMap) collectCheckedRevealSignal(candidate, property, value);
}


function applyExpandedOpacityResidualRescue(input, candidates, records) {
    if (!input?.checked || !candidates?.size || !records) return 0;

    for (const candidate of candidates.values()) {
        const target = candidate?.target;
        if (!target?.isConnected || !candidate.expands || candidate.explicitOpacity) continue;
        if (records.some(record => record.element === target
            && record.property === 'opacity'
            && record.rescueKind === 'expanded-opacity')) continue;

        let computed = null;
        try {
            computed = typeof getComputedStyle === 'function' ? getComputedStyle(target) : null;
        } catch {
            computed = null;
        }
        const opacity = Number.parseFloat(computed?.opacity || '1');
        const display = String(computed?.display || '').toLowerCase();
        const visibility = String(computed?.visibility || '').toLowerCase();
        if (!Number.isFinite(opacity) || opacity > 0.05
            || display === 'none' || visibility === 'hidden' || visibility === 'collapse') continue;

        let rectHeight = 0;
        try {
            rectHeight = Number(target.getBoundingClientRect?.().height || 0);
        } catch {
            rectHeight = 0;
        }
        const naturalHeight = Math.max(rectHeight, Number(target.scrollHeight || 0));
        const hasContent = String(target.textContent || '').replace(/\s+/g, '').length >= 2
            || Number(target.childElementCount || 0) > 0;
        if (!hasContent || naturalHeight <= 4) continue;

        records.push({
            element: target,
            property: 'opacity',
            value: target.style.getPropertyValue('opacity'),
            priority: target.style.getPropertyPriority('opacity'),
            rescueKind: 'expanded-opacity',
        });
        target.style.setProperty('opacity', '1', 'important');
    }

    const rescuedCount = new Set(records
        .filter(record => record.rescueKind === 'expanded-opacity')
        .map(record => record.element)).size;
    if (rescuedCount) input.setAttribute(EXPANDED_OPACITY_RESCUE_ATTR, String(rescuedCount));
    return rescuedCount;
}


function scheduleExpandedOpacityResidualRescue(root, input, candidates, records) {
    if (!input || !candidates?.size || !records) return;
    for (const delay of [0, 80, 260, 650]) {
        setTimeout(() => {
            if (!input.isConnected || !input.checked
                || interactionInlineOverrideStates.get(input) !== records) return;
            applyExpandedOpacityResidualRescue(input, candidates, records);
            applyNestedCheckedContentResidualRescue(root, input, candidates, records);
        }, delay);
    }
}



function checkedDescendantHasIndependentStateRule(root, element) {
    if (!root?.querySelectorAll || !element) return true;
    const id = String(element.id || '').trim();
    const classes = getClassTokens(element).filter(Boolean);
    if (!id && !classes.length) return false;
    const needles = [];
    if (id) needles.push(`#${id}`);
    for (const className of classes) needles.push(`.${className}`);
    if (!needles.length) return false;

    const statePseudo = /:(?:checked|hover|active|focus|focus-within|target|has)\b/i;
    const revealProperty = /(?:^|;)\s*(?:display|visibility|opacity|height|max-height|min-height|clip-path)\s*:/i;
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    for (const style of getRabbitMirrorLocalStyleElements(root)) {
        const cssText = String(style.textContent || '');
        blockRe.lastIndex = 0;
        let block;
        while ((block = blockRe.exec(cssText))) {
            const selectorText = String(block[1] || '');
            if (!statePseudo.test(selectorText) || !revealProperty.test(String(block[2] || ''))) continue;
            if (needles.some(needle => selectorText.includes(needle))) return true;
        }
    }
    return false;
}


function checkedNestedContentDefaultDisplay(element) {
    const tag = String(element?.tagName || '').toLowerCase();
    if (['span', 'strong', 'em', 'i', 'b', 'small', 'mark', 'code', 'kbd', 'samp', 'q', 'cite', 'time'].includes(tag)) return 'inline';
    if (tag === 'li') return 'list-item';
    if (tag === 'table') return 'table';
    if (tag === 'tbody') return 'table-row-group';
    if (tag === 'thead') return 'table-header-group';
    if (tag === 'tfoot') return 'table-footer-group';
    if (tag === 'tr') return 'table-row';
    if (tag === 'td' || tag === 'th') return 'table-cell';
    return 'block';
}


function checkedNestedContentResidualEvidence(root, element) {
    if (!element?.isConnected || !root?.contains?.(element) || element.hidden) return null;
    if (element.matches?.('script,style,noscript,template,input,select,textarea,button,label,summary,details')) return null;
    if (element.querySelector?.('input,select,textarea,button,label,summary,details,[role="button"],[contenteditable="true"]')) return null;
    const text = normalizeInteractionMatchText(element.textContent);
    const hasMedia = !!element.querySelector?.('img,svg,canvas,video,audio,figure,table,ul,ol,dl,blockquote');
    if (text.length < 2 && !hasMedia) return null;
    if (checkedDescendantHasIndependentStateRule(root, element)) return null;

    const computed = diagnosticComputedStyle(element);
    const display = String(computed?.display || '').toLowerCase();
    const visibility = String(computed?.visibility || '').toLowerCase();
    const opacity = Number.parseFloat(String(computed?.opacity || '1'));
    const height = Number.parseFloat(String(computed?.height || ''));
    const maxHeight = String(computed?.maxHeight || computed?.getPropertyValue?.('max-height') || '').toLowerCase();
    const strong = display === 'none' || /^(?:hidden|collapse)$/.test(visibility);
    const weak = (Number.isFinite(opacity) && opacity <= 0.05)
        || (Number.isFinite(height) && height <= 1)
        || isCollapsedDimensionValue(maxHeight);
    if (!strong && !weak) return null;
    return { computed, display, visibility, opacity, height, maxHeight, strong };
}



function checkedExpandedResultStillCollapsed(target) {
    if (!target?.isConnected) return false;
    const computed = diagnosticComputedStyle(target);
    if (String(computed?.display || '').toLowerCase() === 'none') return false;
    if (/^(?:hidden|collapse)$/.test(String(computed?.visibility || '').toLowerCase())) return false;
    const opacity = Number.parseFloat(String(computed?.opacity || '1'));
    if (Number.isFinite(opacity) && opacity <= 0.05) return false;
    let height = 0;
    try { height = Number(target.getBoundingClientRect?.().height || 0); } catch { height = 0; }
    return height <= 1 && checkedTargetCarriesResultContent(target);
}


function applyNestedCheckedContentResidualRescue(root, input, candidates, records) {
    if (!root || !input?.checked || !candidates?.size || !records) return 0;
    const rescuedElements = new Set(records
        .filter(record => record.rescueKind === 'nested-checked-content')
        .map(record => record.element));

    for (const candidate of candidates.values()) {
        const target = candidate?.target;
        if (!target?.isConnected || !candidate.expands || !checkedExpandedResultStillCollapsed(target)) continue;
        // This route is intentionally shallow. It repairs only direct result-body children
        // left hidden after the checked rule has already proved that their parent is the
        // selected result. Nested interactive subpanels keep their own state machine.
        // Strong hiding evidence (display:none / visibility:hidden) must win over weak
        // geometry/opacity evidence so a zero-height wrapper cannot consume the one repair
        // slot before the actually hidden body is reached.
        const evidenceEntries = [...(target.children || [])]
            .filter(child => !rescuedElements.has(child))
            .map(child => ({ child, evidence: checkedNestedContentResidualEvidence(root, child) }))
            .filter(entry => entry.evidence);
        const strongEntries = evidenceEntries.filter(entry => entry.evidence.strong);
        const repairEntries = strongEntries.length
            ? strongEntries
            : evidenceEntries.filter(entry => !entry.evidence.strong);

        for (const { child, evidence } of repairEntries) {
            const { display, visibility, opacity, height, maxHeight } = evidence;
            const fixes = [];
            if (display === 'none') fixes.push(['display', checkedNestedContentDefaultDisplay(child)]);
            if (/^(?:hidden|collapse)$/.test(visibility)) fixes.push(['visibility', 'visible']);
            if (Number.isFinite(opacity) && opacity <= 0.05) fixes.push(['opacity', '1']);
            if (Number.isFinite(height) && height <= 1) fixes.push(['height', 'auto']);
            if (isCollapsedDimensionValue(maxHeight)) fixes.push(['max-height', 'none']);
            if (!fixes.length) continue;

            for (const [property, value] of fixes) {
                records.push({
                    element: child,
                    property,
                    value: child.style.getPropertyValue(property),
                    priority: child.style.getPropertyPriority(property),
                    rescueKind: 'nested-checked-content',
                });
                child.style.setProperty(property, value, 'important');
            }
            rescuedElements.add(child);
            // Stop as soon as the selected result has regained a real content box.
            // This keeps secondary metadata or intentionally hidden tertiary details closed.
            let targetHeight = 0;
            try { targetHeight = Number(target.getBoundingClientRect?.().height || 0); } catch { targetHeight = 0; }
            if (targetHeight > 4) break;
        }
    }

    if (rescuedElements.size) input.setAttribute(NESTED_CHECKED_CONTENT_RESCUE_ATTR, String(rescuedElements.size));
    else input.removeAttribute?.(NESTED_CHECKED_CONTENT_RESCUE_ATTR);
    return rescuedElements.size;
}



function checkedClassRepairDeclarationsCarryState(declarations) {
    const source = String(declarations || '');
    if (!source) return false;
    const strongStateProperty = /(?:^|;)\s*(?:display|visibility|opacity|max-height|min-height|height|transform|clip-path|filter)\s*:\s*([^;{}]+)/gi;
    let match;
    while ((match = strongStateProperty.exec(source))) {
        const value = String(match[1] || '').trim().toLowerCase();
        if (!value) continue;
        if (/^(?:none|normal|initial|inherit|unset)$/i.test(value)) continue;
        return true;
    }
    return false;
}


function rawRootHasExactClassToken(root, className) {
    if (!root?.querySelectorAll || !className) return false;
    return [...root.querySelectorAll('[class]')].some(element => (
        String(element.className || '').split(/\s+/).includes(className)
    ));
}


export function parseMissingCheckedSubjectClassRules(rawRoot) {
    if (!rawRoot?.querySelectorAll) return [];
    const groups = new Map();
    for (const styleElement of rawRoot.querySelectorAll('style')) {
        const css = String(styleElement.textContent || '');
        const blockRe = /([^{}]+)\{([^{}]*)\}/g;
        let block;
        while ((block = blockRe.exec(css))) {
            const declarations = String(block[2] || '');
            if (!checkedClassRepairDeclarationsCarryState(declarations)) continue;
            for (const selector of splitCssSelectorList(block[1])) {
                if (!/:checked\b/i.test(selector)) continue;
                const subjectMatch = /(?:^|[\s>+~,(])((?:input)?(?:\s*\[[^\]]+\])?(?:\.[_a-zA-Z][\w-]*)+)\s*:checked\s*([+~])\s*/i.exec(selector);
                if (!subjectMatch) continue;
                const subject = String(subjectMatch[1] || '').trim();
                const tagMatch = /^([a-zA-Z][\w-]*)/.exec(subject);
                if (tagMatch && tagMatch[1].toLowerCase() !== 'input') continue;
                const classes = [...subject.matchAll(/\.([_a-zA-Z][\w-]*)/g)].map(match => match[1]);
                if (classes.length !== 1) continue;
                const rawClass = classes[0];
                if (!rawClass || rawRootHasExactClassToken(rawRoot, rawClass)) continue;
                const item = groups.get(rawClass) || { rawClass, rules: [] };
                item.rules.push({ selector: String(selector || '').trim(), relation: subjectMatch[2] });
                groups.set(rawClass, item);
            }
        }
    }
    return [...groups.values()].filter(group => group.rules.length > 0);
}


function rawCheckedClassRuleMatchesInput(rawRoot, rawInput, rawClass, selector) {
    if (!rawRoot?.cloneNode || !rawInput || !rawClass || !selector || typeof document === 'undefined') return false;
    const rawInputs = [...rawRoot.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
    const inputIndex = rawInputs.indexOf(rawInput);
    if (inputIndex < 0) return false;
    const clone = rawRoot.cloneNode(true);
    const clonedInput = [...clone.querySelectorAll('input[type="checkbox"], input[type="radio"]')][inputIndex];
    if (!clonedInput?.classList) return false;
    clonedInput.classList.add(rawClass);
    clonedInput.checked = true;
    const wrapper = document.createElement('div');
    wrapper.appendChild(clone);
    try {
        return [...wrapper.querySelectorAll(selector)].some(target => (
            target !== clonedInput && normalizeInteractionMatchText(target.textContent).length >= 2
        ));
    } catch {
        return false;
    }
}


export function installMissingCheckedSubjectClassRescue(root) {
    if (!root?.querySelectorAll || root.hasAttribute?.(MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR)) {
        return Number.parseInt(root?.getAttribute?.(MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR) || '0', 10) || 0;
    }
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot) return 0;

    const rawInputs = [...rawRoot.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
    if (!rawInputs.length || rawInputs.length > 12) return 0;
    let repaired = 0;
    for (const group of parseMissingCheckedSubjectClassRules(rawRoot)) {
        const candidates = rawInputs.filter(input => {
            if (!inputHasAssociatedLabel(rawRoot, input)) return false;
            const matchingRuleCount = group.rules.filter(rule => (
                rawCheckedClassRuleMatchesInput(rawRoot, input, group.rawClass, rule.selector)
            )).length;
            return matchingRuleCount >= Math.min(2, group.rules.length);
        });
        if (candidates.length !== 1) continue;

        const renderedInput = resolveRenderedCounterpart(rawRoot, root, candidates[0], 'input');
        if (!renderedInput?.classList || findMaintenanceElementByRawClass(root, group.rawClass)) continue;
        const renderedClass = resolveMaintenanceGeneratedClass(root, group.rawClass);
        if (!renderedClass || renderedInput.classList.contains(renderedClass)) continue;
        renderedInput.classList.add(renderedClass);
        renderedInput.setAttribute(MISSING_CHECKED_SUBJECT_CLASS_CONTROL_ATTR, `${group.rawClass}:${renderedClass}`);
        repaired += 1;
    }
    if (repaired) root.setAttribute(MISSING_CHECKED_SUBJECT_CLASS_RESCUE_ATTR, String(repaired));
    return repaired;
}


function buildCheckedSelectorNeedles(input) {
    const needles = [];
    if (input?.id) {
        const escapedId = escapeRegExp(input.id);
        // ID 隔离后，#id 会被改写成 [id="scoped-id"]；两种形式都必须识别。
        const idSubject = `(?:#${escapedId}|\\[\\s*id\\s*=\\s*["']${escapedId}["']\\s*\\])`;
        needles.push({
            source: 'id',
            subjectSelector: `#${escapeCssIdentifier(input.id)}`,
            pattern: new RegExp(`${idSubject}\\s*:checked\\s*([+~])\\s*([^,{]+)`, 'i'),
        });
    }

    for (const className of getClassTokens(input).slice(0, 8)) {
        if (!className || className.length > 120) continue;
        const escapedClass = escapeRegExp(className);
        needles.push({
            source: 'class-local',
            subjectSelector: `.${className}`,
            pattern: new RegExp(`\\.${escapedClass}:checked\\s*([+~])\\s*([^,{]+)`, 'i'),
        });
    }
    return needles;
}



function matchGenericLocalCheckedSelector(selector, input) {
    const source = String(selector || '');
    if (!source || !input?.matches) return null;

    // 模型经常不给 input 设置 id/class，只写 input:checked + div ...。
    // 这种规则只能在当前 input 所在 label/局部容器内恢复，绝不能跨兔子镜全局扩散。
    const genericRe = /(?:^|[\s>+~,(])(input(?:\s*\[[^\]]+\])*)\s*:checked\s*([+~])\s*([^,{]+)/gi;
    let match;
    while ((match = genericRe.exec(source))) {
        const subject = String(match[1] || '').trim();
        if (!subject) continue;
        try {
            if (!input.matches(subject)) continue;
        } catch {
            continue;
        }
        return {
            source: 'generic-local',
            subjectSelector: subject,
            relation: match[2],
            rawTargetSelector: match[3],
        };
    }
    return null;
}


function splitCheckedPseudoTargetSelector(selectorText) {
    const source = String(selectorText || '').trim();
    const match = source.match(/^(.*?)(?:::)(before|after)\s*$/i);
    if (!match) return { targetSelector: source, pseudoElement: '' };
    return {
        targetSelector: String(match[1] || '').trim(),
        pseudoElement: String(match[2] || '').toLowerCase(),
    };
}


function addSpaceSeparatedAttributeToken(element, attribute, token) {
    if (!element?.setAttribute || !attribute || !token) return;
    const tokens = new Set(String(element.getAttribute(attribute) || '').split(/\s+/).filter(Boolean));
    tokens.add(token);
    element.setAttribute(attribute, [...tokens].join(' '));
}


function removeSpaceSeparatedAttributeToken(element, attribute, token) {
    if (!element?.getAttribute || !attribute || !token) return;
    const tokens = String(element.getAttribute(attribute) || '').split(/\s+/).filter(Boolean)
        .filter(value => value !== token);
    if (tokens.length) element.setAttribute(attribute, tokens.join(' '));
    else element.removeAttribute(attribute);
}


function restoreInteractionPseudoOverrides(input) {
    const state = interactionPseudoOverrideStates.get(input);
    if (!state) return;
    state.styleElement?.remove?.();
    for (const record of state.targets || []) {
        removeSpaceSeparatedAttributeToken(record.element, CHECKED_PSEUDO_RULE_TARGET_ATTR, record.token);
    }
    interactionPseudoOverrideStates.delete(input);
}


function installInteractionPseudoOverrides(root, input, entries) {
    restoreInteractionPseudoOverrides(input);
    if (!root?.appendChild || !input?.checked || !entries?.length) return 0;

    const styleElement = document.createElement('style');
    styleElement.setAttribute(CHECKED_PSEUDO_RULE_RESCUE_STYLE_ATTR, 'true');
    const targetRecords = [];
    const cssRules = [];
    let declarationCount = 0;

    for (const entry of entries) {
        const target = entry?.target;
        const pseudoElement = String(entry?.pseudoElement || '').toLowerCase();
        const styleMap = Array.isArray(entry?.styleMap) ? entry.styleMap : [];
        if (!target?.isConnected || !/^(?:before|after)$/.test(pseudoElement) || !styleMap.length) continue;

        checkedPseudoRuleTokenCounter += 1;
        const token = `p${checkedPseudoRuleTokenCounter.toString(36)}`;
        addSpaceSeparatedAttributeToken(target, CHECKED_PSEUDO_RULE_TARGET_ATTR, token);
        targetRecords.push({ element: target, token });

        const declarations = styleMap.map(([property, value]) => {
            declarationCount += 1;
            return `${property}: ${value} !important;`;
        }).join('');
        cssRules.push(`[${CHECKED_PSEUDO_RULE_TARGET_ATTR}~="${token}"]::${pseudoElement} {${declarations}}`);
    }

    if (!cssRules.length) {
        for (const record of targetRecords) {
            removeSpaceSeparatedAttributeToken(record.element, CHECKED_PSEUDO_RULE_TARGET_ATTR, record.token);
        }
        return 0;
    }

    styleElement.textContent = cssRules.join('\n');
    root.appendChild(styleElement);
    interactionPseudoOverrideStates.set(input, { styleElement, targets: targetRecords });
    return declarationCount;
}


export function parseCheckedRulesFromText(toto, input) {
    if (!toto?.querySelectorAll || !input) return [];
    const selectorNeedles = buildCheckedSelectorNeedles(input);

    const results = [];
    const seen = new Set();
    for (const styleEl of getRabbitMirrorLocalStyleElements(toto)) {
        const css = String(styleEl.textContent || '');
        const blockRe = /([^{}]+)\{([^{}]*)\}/g;
        let match;
        while ((match = blockRe.exec(css))) {
            const selectors = String(match[1] || '').split(',').map(v => v.trim()).filter(Boolean);
            const declarations = String(match[2] || '');
            const styleMap = [];
            declarations.replace(/(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+?)(\s*!important\s*)?(?=;|$)/gi,
                (_m, _sep, property, value) => {
                    const cleanValue = String(value || '').trim().replace(/\s*!important\s*$/i, '');
                    if (property && cleanValue) styleMap.push([property, cleanValue]);
                    return _m;
                });
            if (!styleMap.length) continue;

            for (const selector of selectors) {
                const parsedRules = [];
                for (const needle of selectorNeedles) {
                    const selectorMatch = selector.match(needle.pattern);
                    if (!selectorMatch) continue;
                    parsedRules.push({
                        source: needle.source,
                        subjectSelector: needle.subjectSelector,
                        relation: selectorMatch[1],
                        rawTargetSelector: selectorMatch[2],
                    });
                }
                const genericRule = matchGenericLocalCheckedSelector(selector, input);
                if (genericRule) parsedRules.push(genericRule);

                for (const parsedRule of parsedRules) {
                    const parsedTarget = splitCheckedPseudoTargetSelector(parsedRule.rawTargetSelector);
                    const targetSelector = parsedTarget.targetSelector;
                    const pseudoElement = parsedTarget.pseudoElement;
                    if (!targetSelector) continue;
                    // 同一条规则可能同时被 id/class 与通用 input 识别；按实际效果去重，保留先出现的精确路线。
                    const key = `${parsedRule.relation}|${targetSelector}|${pseudoElement}|${JSON.stringify(styleMap)}`;
                    if (seen.has(key)) continue;
                    seen.add(key);
                    results.push({ source: parsedRule.source, subjectSelector: parsedRule.subjectSelector || '', relation: parsedRule.relation, targetSelector, pseudoElement, styleMap });
                }
            }
        }
    }
    return results;
}


function getSiblingTargetsForCheckedRule(input, relation, targetSelector) {
    const targets = [];
    if (!input?.parentElement || !targetSelector) return targets;
    let node = input.nextElementSibling;
    if (relation === '+') {
        if (node?.matches?.(targetSelector)) targets.push(node);
        return targets;
    }
    while (node) {
        if (node.matches?.(targetSelector)) targets.push(node);
        node = node.nextElementSibling;
    }
    return targets;
}


function getLabelProxyTargetsForCheckedRule(input, relation, targetSelector) {
    const label = input?.closest?.('label');
    const parent = label?.parentElement || null;
    if (!label || !parent?.querySelectorAll || !label.contains(input) || !targetSelector) return [];

    const followingSiblings = [];
    let sibling = label.nextElementSibling;
    if (relation === '+') {
        if (sibling) followingSiblings.push(sibling);
    } else {
        while (sibling) {
            followingSiblings.push(sibling);
            sibling = sibling.nextElementSibling;
        }
    }
    if (!followingSiblings.length || followingSiblings.length > 8) return [];

    let parentMatches = [];
    try {
        parentMatches = [...parent.querySelectorAll(targetSelector)];
    } catch {
        return [];
    }
    const targets = parentMatches.filter(target => followingSiblings.some(container => (
        target === container || container.contains?.(target)
    )));
    // 只允许当前 label 后方局部兄弟区域内数量可控的目标，避免通用 input:checked 规则扩散到整面兔子镜。
    if (!targets.length || targets.length > 8) return [];
    return targets;
}


function getCrossContainerTargetsForCheckedRule(root, targetSelector) {
    if (!root?.querySelectorAll || !targetSelector) return [];
    try {
        const targets = [...root.querySelectorAll(targetSelector)];
        // 跨容器急救只接受当前兔子镜内明确且数量可控的目标，避免宽泛选择器误伤整页。
        if (!targets.length || targets.length > 12) return [];
        return targets;
    } catch {
        return [];
    }
}


function getProvableCrossParentTargetsForCheckedRule(root, input, rule) {
    if (!root?.querySelectorAll || !input || !rule) return [];
    if (rule.source === 'id') return getCrossContainerTargetsForCheckedRule(root, rule.targetSelector);
    if (rule.source !== 'class-local') return [];

    // A class subject may be promoted beyond its local label/container only when it
    // names exactly one checkable control and exactly one content-bearing target in
    // this mirror. Shared radio/tab classes and generic input selectors stay local.
    const subjectSelector = String(rule.subjectSelector || '').trim();
    if (!/^\.[_a-zA-Z][\w-]*$/.test(subjectSelector)) return [];
    let subjects = [];
    try { subjects = [...root.querySelectorAll(subjectSelector)]; } catch { return []; }
    if (subjects.length !== 1 || subjects[0] !== input || !inputHasAssociatedLabel(root, input)) return [];

    const targets = getCrossContainerTargetsForCheckedRule(root, rule.targetSelector);
    if (targets.length !== 1) return [];
    const target = targets[0];
    if (!target || target === input || input.parentElement?.contains?.(target)) return [];
    if (!checkedTargetCarriesResultContent(target)) return [];
    return targets;
}


function getCollapsedCompoundDescendantTargetsForCheckedRule(root, input, rule) {
    if (!root?.querySelectorAll || !input || !rule?.targetSelector) return [];
    const selector = String(rule.targetSelector || '').trim();
    // High-confidence malformed-selector rescue only: `.paper.manuscript` where no
    // single node has both classes, but the checked control is followed by exactly
    // one `.paper` containing exactly one `.manuscript` that is hidden by default
    // and the checked declarations explicitly reveal it. Do not generalize this to
    // arbitrary selectors/combinators.
    if (!/^(?:\.[_a-zA-Z][\w-]*){2}$/.test(selector)) return [];
    let directMatches = [];
    try { directMatches = [...root.querySelectorAll(selector)]; } catch { return []; }
    if (directMatches.length) return [];
    const classNames = [...selector.matchAll(/\.([_a-zA-Z][\w-]*)/g)].map(match => match[1]);
    if (classNames.length !== 2) return [];
    const [outerClass, innerClass] = classNames;
    const following = [];
    let sibling = input.nextElementSibling;
    if (rule.relation === '+') {
        if (sibling) following.push(sibling);
    } else if (rule.relation === '~') {
        while (sibling && following.length < 10) {
            following.push(sibling);
            sibling = sibling.nextElementSibling;
        }
    } else return [];
    if (!following.length) return [];

    const candidates = [];
    for (const container of following) {
        const outers = [];
        if (container.classList?.contains(outerClass)) outers.push(container);
        try { outers.push(...container.querySelectorAll(`.${outerClass}`)); } catch {}
        for (const outer of outers) {
            let descendants = [];
            try { descendants = [...outer.querySelectorAll(`.${innerClass}`)]; } catch { descendants = []; }
            for (const target of descendants) {
                if (!target?.isConnected || !root.contains?.(target) || target === input) continue;
                if (!checkedTargetCarriesResultContent(target)) continue;
                const reveals = (rule.styleMap || []).some(([property, value]) => (
                    checkedDeclarationCreatesContentReveal(root, target, property, value)
                ));
                if (!reveals) continue;
                if (!candidates.includes(target)) candidates.push(target);
            }
        }
    }
    return candidates.length === 1 ? candidates : [];
}


function splitSimpleAdjacentSiblingSelectorChain(targetSelector) {
    const source = String(targetSelector || '').trim();
    if (!source || !source.includes('+') || /[,>~]/.test(source)) return [];
    const parts = source.split(/\s*\+\s*/).map(part => part.trim()).filter(Boolean);
    if (parts.length < 2 || parts.length > 4) return [];
    // Keep this rescue deliberately narrow: no nested combinators or functional selectors.
    if (parts.some(part => /[(){}]/.test(part))) return [];
    return parts;
}


function labelExplicitlyTargetsInput(label, input) {
    if (!label || !input) return false;
    const forId = String(label.getAttribute?.('for') || '').trim();
    if (forId) return !!input.id && forId === String(input.id);
    return !!label.contains?.(input);
}


function getAdjacentSiblingChainTargetsForCheckedRule(input, relation, targetSelector) {
    if (!input || relation !== '+') return [];
    const parts = splitSimpleAdjacentSiblingSelectorChain(targetSelector);
    if (!parts.length) return [];

    let node = input;
    for (let index = 0; index < parts.length; index += 1) {
        node = node?.nextElementSibling || null;
        if (!node) return [];
        let matched = false;
        try { matched = !!node.matches?.(parts[index]); } catch { return []; }
        if (!matched) {
            // Generated HTML sometimes leaves the first label class unscoped while the CSS
            // subject has already been scoped. If this is still the explicit label for the
            // current control, allow only that one bridge; later chain members must match.
            if (index === 0 && node.tagName?.toLowerCase?.() === 'label' && labelExplicitlyTargetsInput(node, input)) {
                continue;
            }
            return [];
        }
    }
    return node && node !== input ? [node] : [];
}


export function resolveTargetsForCheckedRule(root, input, rule) {
    if (!root || !input || !rule) return [];
    let targets = getSiblingTargetsForCheckedRule(input, rule.relation, rule.targetSelector);
    if (targets.length) return targets;

    // Preserve the full local sibling chain for rules such as
    // `input:checked + .tab + .panel`. The old fallback queried `.tab + .panel` from the
    // whole parent container after the first direct match failed, which could reveal every
    // sibling panel sharing those classes when only one checkbox was clicked.
    const adjacentChain = splitSimpleAdjacentSiblingSelectorChain(rule.targetSelector);
    if (rule.relation === '+' && adjacentChain.length) {
        targets = getAdjacentSiblingChainTargetsForCheckedRule(input, rule.relation, rule.targetSelector);
        // A recognized adjacent chain must never degrade into container-wide class lookup.
        return targets;
    }

    if (rule.source === 'class-local' || rule.source === 'generic-local') {
        // A single adjacent-sibling rule is just as positional as a longer `+ A + B` chain.
        // If the next sibling does not match, do not spray that class across the whole local
        // container. This is especially important for radio groups where a baseline/close
        // radio shares the trigger class but intentionally has no state panel after it.
        // The only safe structural recovery here is a wrapping-label proxy; otherwise allow
        // a local fallback only when it resolves to exactly one unambiguous target.
        if (rule.relation === '+') {
            targets = getLabelProxyTargetsForCheckedRule(input, rule.relation, rule.targetSelector);
            if (targets.length) return targets;
            targets = getLocalContainerTargetsForCheckedRule(input, rule.targetSelector);
            if (targets.length === 1) return targets;
        } else {
            targets = getFollowingLocalContainerTargetsForCheckedRule(input, rule.targetSelector);
            if (targets.length) return targets;
            // 常见误写：input 被包在 label 内，但 :checked 规则把 label 后方内容当作 input 的兄弟。
            // 以 label 作为结构代理，仅在其同一局部父容器的后续兄弟区域内恢复目标。
            targets = getLabelProxyTargetsForCheckedRule(input, rule.relation, rule.targetSelector);
            if (targets.length) return targets;
        }
        targets = getProvableCrossParentTargetsForCheckedRule(root, input, rule);
        if (targets.length) return targets;
    } else {
        targets = getCrossContainerTargetsForCheckedRule(root, rule.targetSelector);
        if (targets.length) return targets;
    }
    // Another common model typo collapses an intended descendant selector into a
    // same-element class conjunction (`.paper.manuscript` instead of `.paper .manuscript`).
    // Only recover the unique, content-bearing hidden descendant when the checked
    // declarations themselves prove that it is the reveal target.
    return getCollapsedCompoundDescendantTargetsForCheckedRule(root, input, rule);
}


export function findCrossParentCheckedRuleFallbackCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const candidates = [];
    for (const input of root.querySelectorAll('input[type="checkbox"], input[type="radio"]')) {
        if (!inputHasAssociatedLabel(root, input)) continue;
        let ruleCount = 0;
        let targetCount = 0;
        for (const rule of parseCheckedRulesFromText(root, input)) {
            if (rule.source !== 'id' && rule.source !== 'class-local') continue;
            if (getSiblingTargetsForCheckedRule(input, rule.relation, rule.targetSelector).length) continue;
            const targets = getProvableCrossParentTargetsForCheckedRule(root, input, rule);
            if (!targets.length) continue;
            ruleCount += 1;
            targetCount += targets.length;
        }
        if (ruleCount) candidates.push({ input, ruleCount, targetCount });
    }
    return candidates;
}


export function crossParentCheckedCandidateFingerprint(candidate) {
    return `${Number(candidate?.ruleCount) || 0}:${Number(candidate?.targetCount) || 0}`;
}


export function crossParentCheckedCandidateVerified(candidate) {
    if (!candidate?.input?.getAttribute) return false;
    return String(candidate.input.getAttribute(CROSS_PARENT_CHECKED_VERIFIED_ATTR) || '')
        === crossParentCheckedCandidateFingerprint(candidate);
}


export function syncCrossParentCheckedRuleFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const inputs = [...root.querySelectorAll(`[${CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR}]`)]
        .filter(input => input.matches?.('input[type="checkbox"], input[type="radio"]'));
    if (!inputs.length) return 0;

    // 先统一撤回旧分支，避免 radio 切换后上一分支的内联急救状态残留。
    for (const input of inputs) restoreInteractionInlineOverrides(input);
    // 旧公开版会把 checked 兜底写入副 API缓存。重新载入后 WeakMap 已丢失，
    // 那些 !important 会被误当成“原始内联样式”，从而让多个 radio 分支同时显示。
    // 这里只移除能与 checked 规则精确对应、且带有维修归属标记的 important 声明。
    const staleCleanupCount = clearPersistedCheckedInlineArtifacts(root, inputs);
    let activeCount = 0;
    for (const input of inputs) {
        if (!input.checked) continue;
        applyCheckedVisualFallback(root, input);
        input.setAttribute('aria-pressed', 'true');
        activeCount += 1;
    }
    for (const input of inputs) {
        if (!input.checked) input.setAttribute('aria-pressed', 'false');
    }
    if (staleCleanupCount > 0) {
        setTimeout(() => {
            if (root?.isConnected) notifyIndependentRepairPersistence(root);
        }, 0);
    }
    return activeCount;
}


function scheduleCrossParentCheckedRuleSync(root) {
    if (!root) return;
    for (const delay of [0, 80, 260, 650]) {
        setTimeout(() => {
            if (root.isConnected) syncCrossParentCheckedRuleFallback(root);
        }, delay);
    }
}


export function installCrossParentCheckedRuleFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const liveInputs = new Set();
    let ruleCount = 0;
    for (const candidate of findCrossParentCheckedRuleFallbackCandidates(root)) {
        liveInputs.add(candidate.input);
        candidate.input.setAttribute(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR, String(candidate.ruleCount));
        // 验证标记绑定当前规则数与目标数。结构发生变化时旧验证会自动失效，
        // 不能因为“曾经装过兜底”就永久冒充已验证可用。
        if (candidate.input.hasAttribute(CROSS_PARENT_CHECKED_VERIFIED_ATTR)
            && !crossParentCheckedCandidateVerified(candidate)) {
            candidate.input.removeAttribute(CROSS_PARENT_CHECKED_VERIFIED_ATTR);
        }
        ruleCount += candidate.ruleCount;
    }
    for (const input of root.querySelectorAll(`[${CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR}]`)) {
        if (!liveInputs.has(input)) {
            input.removeAttribute(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR);
            input.removeAttribute(CROSS_PARENT_CHECKED_VERIFIED_ATTR);
        }
    }
    if (ruleCount) {
        root.setAttribute(CROSS_PARENT_CHECKED_ROOT_ATTR, String(ruleCount));
        let newlyBound = false;
        if (!crossParentCheckedFallbackRoots.has(root)) {
            const refresh = event => {
                if (!event.target?.hasAttribute?.(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR)) return;
                syncCrossParentCheckedRuleFallback(root);
                scheduleCrossParentCheckedRuleSync(root);
            };
            root.addEventListener('input', refresh, false);
            root.addEventListener('change', refresh, false);
            crossParentCheckedFallbackRoots.add(root);
            newlyBound = true;
        }
        // 安装时立即落实原本已经 checked 的初始分支；不能要求用户再点一次才显示。
        syncCrossParentCheckedRuleFallback(root);
        if (newlyBound) scheduleCrossParentCheckedRuleSync(root);
    } else {
        root.removeAttribute(CROSS_PARENT_CHECKED_ROOT_ATTR);
    }
    return ruleCount;
}



export function parseBrokenCheckedHasStateRules(root) {
    if (!root?.querySelectorAll) return [];
    const results = [];
    const seen = new Set();

    const visitSelector = (selectorText, declarations) => {
        const selector = String(selectorText || '').trim();
        if (!selector || !/:has\(/i.test(selector) || !/:checked\b/i.test(selector)) return;
        // 旧清洗链曾把 body:has(...) 前面再加 .mes_text，形成“消息内部寻找 body”的永不命中选择器。
        // 这里只接管明确含 body:has(...) 的错误祖先链；当前新版已正确改写为兔子镜根 :has(...)，不会命中本兜底。
        if (!/(?:^|[\s>+~])body\s*:has\(/i.test(selector)) return;

        const conditionRe = /:has\(\s*(?:#([A-Za-z_][\w-]*)|\[\s*id\s*=\s*["']([^"']+)["']\s*\])\s*:checked\s*\)/gi;
        const ids = [];
        let lastEnd = -1;
        let match;
        while ((match = conditionRe.exec(selector))) {
            ids.push(String(match[1] || match[2] || ''));
            lastEnd = conditionRe.lastIndex;
        }
        const hasCount = (selector.match(/:has\(/gi) || []).length;
        if (!ids.length || ids.length !== hasCount || lastEnd < 0) return;

        const targetSelector = selector.slice(lastEnd).trim().replace(/^[>+~]\s*/, '');
        if (!targetSelector) return;
        const querySelector = targetSelector.replace(/::(?:before|after)\s*$/i, '').trim();
        if (!querySelector) return;

        const controls = ids.map(id => [...root.querySelectorAll('[id]')]
            .find(element => String(element.id || '') === id
                && element.matches?.('input[type="checkbox"], input[type="radio"]')));
        if (controls.some(control => !control) || new Set(controls).size !== controls.length) return;

        let targets = [];
        try {
            targets = [...root.querySelectorAll(querySelector)];
        } catch {
            return;
        }
        if (!targets.length || targets.length > 12) return;

        const strengthened = addImportantToDeclarationBlock(String(declarations || ''));
        if (!strengthened.trim()) return;
        const key = `${ids.join('|')}|${targetSelector}|${strengthened}`;
        if (seen.has(key)) return;
        seen.add(key);
        results.push({ ids, controls, targetSelector, declarations: strengthened });
    };

    for (const style of getRabbitMirrorLocalStyleElements(root).filter(styleEl => !styleEl.hasAttribute(CHECKED_HAS_STATE_RESCUE_STYLE_ATTR))) {
        const css = String(style.textContent || '');
        const blockRe = /([^{}]+)\{([^{}]*)\}/g;
        let blockMatch;
        while ((blockMatch = blockRe.exec(css))) {
            const declarations = String(blockMatch[2] || '');
            for (const selector of splitCssSelectorList(String(blockMatch[1] || ''))) {
                visitSelector(selector, declarations);
            }
        }
    }
    return results;
}


function refreshCheckedHasStateFallback(root) {
    const state = checkedHasStateRescueStates.get(root);
    if (!state) return;
    const activeTokens = [];
    state.rules.forEach((rule, index) => {
        const active = rule.controls.every(control => control?.isConnected && !!control.checked);
        if (active) activeTokens.push(`s${index}`);
    });
    if (activeTokens.length) root.setAttribute(CHECKED_HAS_STATE_ROOT_ATTR, activeTokens.join(' '));
    else root.removeAttribute(CHECKED_HAS_STATE_ROOT_ATTR);
}


export function installCheckedHasStateFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const rules = parseBrokenCheckedHasStateRules(root);
    let state = checkedHasStateRescueStates.get(root);
    let rescueStyle = root.querySelector(`style[${CHECKED_HAS_STATE_RESCUE_STYLE_ATTR}]`);
    if (!rules.length) {
        if (state) {
            root.removeEventListener('input', state.onStateChange, false);
            root.removeEventListener('change', state.onStateChange, false);
            checkedHasStateRescueStates.delete(root);
        }
        rescueStyle?.remove();
        root.removeAttribute(CHECKED_HAS_STATE_ROOT_ATTR);
        root.removeAttribute(CHECKED_HAS_STATE_RULE_COUNT_ATTR);
        return 0;
    }

    if (!state) {
        state = {
            rules: [],
            onStateChange: () => refreshCheckedHasStateFallback(root),
        };
        root.addEventListener('input', state.onStateChange, false);
        root.addEventListener('change', state.onStateChange, false);
        checkedHasStateRescueStates.set(root, state);
    }
    state.rules = rules;

    if (!rescueStyle) {
        rescueStyle = document.createElement('style');
        rescueStyle.setAttribute(CHECKED_HAS_STATE_RESCUE_STYLE_ATTR, 'true');
        root.appendChild(rescueStyle);
    }
    rescueStyle.textContent = rules.map((rule, index) => (
        `[${CHECKED_HAS_STATE_ROOT_ATTR}~="s${index}"] ${rule.targetSelector} {${rule.declarations}}`
    )).join('\n');
    root.setAttribute(CHECKED_HAS_STATE_RULE_COUNT_ATTR, String(rules.length));
    refreshCheckedHasStateFallback(root);
    return rules.length;
}



function normalizeDetachedCheckedHasSelector(selectorText) {
    let selector = String(selectorText || '').trim();
    if (!selector) return '';
    selector = selector.replace(/^:scope\s+/i, '').trim();
    // 样式清洗会在局部选择器前加 .mes_text；当前 root 本身已位于 .mes_text 内，
    // querySelectorAll() 无法从后代重新命中这个外层祖先，因此只移除明确的宿主前缀。
    for (let guard = 0; guard < 5; guard += 1) {
        const next = selector.replace(/^(?:html|body|\.mes_text|\.mes)\s+/i, '').trim();
        if (next === selector) break;
        selector = next;
    }
    return selector;
}


function queryDetachedCheckedHasElements(root, selectorText) {
    if (!root?.querySelectorAll) return [];
    const selector = normalizeDetachedCheckedHasSelector(selectorText);
    if (!selector) return [];
    const result = [];
    const seen = new Set();
    try {
        if (root.matches?.(selector)) {
            result.push(root);
            seen.add(root);
        }
        for (const element of root.querySelectorAll(selector)) {
            if (seen.has(element)) continue;
            seen.add(element);
            result.push(element);
        }
    } catch {
        return [];
    }
    return result;
}


function detachedCheckedHasSafeDeclarations(declarationText) {
    return parseCssStateSiblingAssignments(declarationText)
        .filter(({ value }) => !/(?:expression\s*\(|javascript\s*:|url\s*\()/i.test(String(value || '')))
        .map(({ property, value }) => `${property}: ${value} !important;`)
        .join('');
}


export function parseDetachedCheckedHasRules(root) {
    if (!root?.querySelectorAll) return [];
    const rules = [];
    const seen = new Set();
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    const conditionRe = /:has\(\s*(input(?:\s*(?:\[[^\]]+\]|[.#][A-Za-z_][\w-]*))*)\s*:checked\s*\)/i;

    for (const style of getRabbitMirrorLocalStyleElements(root).filter(styleEl => !styleEl.hasAttribute(DETACHED_CHECKED_HAS_RESCUE_STYLE_ATTR))) {
        const css = String(style.textContent || '');
        let block;
        blockRe.lastIndex = 0;
        while ((block = blockRe.exec(css))) {
            const declarations = detachedCheckedHasSafeDeclarations(block[2]);
            if (!declarations) continue;
            for (const rawSelector of splitCssSelectorList(block[1])) {
                const selector = String(rawSelector || '').trim();
                if (!selector || (selector.match(/:has\(/gi) || []).length !== 1 || !/:checked\b/i.test(selector)) continue;
                const condition = conditionRe.exec(selector);
                if (!condition) continue;

                const hostSelector = normalizeDetachedCheckedHasSelector(selector.slice(0, condition.index));
                const targetSelector = normalizeDetachedCheckedHasSelector(
                    selector.slice(condition.index + condition[0].length).trim().replace(/^[>+~]\s*/, ''),
                );
                const controlSelector = String(condition[1] || '').replace(/\s+/g, '');
                if (!hostSelector || !targetSelector || !controlSelector) continue;
                if (/:has\(|:checked\b|::(?:before|after)/i.test(targetSelector)) continue;

                const hosts = queryDetachedCheckedHasElements(root, hostSelector);
                const controls = queryDetachedCheckedHasElements(root, controlSelector)
                    .filter(control => control.matches?.('input[type="checkbox"], input[type="radio"]') && !control.disabled);
                const targets = queryDetachedCheckedHasElements(root, targetSelector)
                    .filter(target => hosts.some(host => host === target || host.contains?.(target)));
                if (!hosts.length || hosts.length > 8 || !controls.length || controls.length > 12 || !targets.length || targets.length > 24) continue;

                // 原生 :has() 只有在 input 位于 host 内部时才会命中。当前控件全部位于 host 外，
                // 但目标正文确实位于 host 内，属于可高置信恢复的“控制区与内容区分离”结构。
                if (hosts.some(host => controls.some(control => host.contains?.(control)))) continue;

                const key = `${controlSelector}|${hostSelector}|${targetSelector}|${declarations}`;
                if (seen.has(key)) continue;
                seen.add(key);
                rules.push({ controls, hostSelector, targetSelector, declarations, targets });
            }
        }
    }
    return rules;
}


function refreshDetachedCheckedHasFallback(root) {
    const state = detachedCheckedHasRescueStates.get(root);
    if (!state) return;
    const activeTokens = [];
    state.rules.forEach((rule, index) => {
        if (rule.controls.some(control => control?.isConnected && !!control.checked)) activeTokens.push(`s${index}`);
    });
    if (activeTokens.length) root.setAttribute(DETACHED_CHECKED_HAS_ROOT_ATTR, activeTokens.join(' '));
    else root.removeAttribute(DETACHED_CHECKED_HAS_ROOT_ATTR);
}


export function installDetachedCheckedHasFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const rules = parseDetachedCheckedHasRules(root);
    let state = detachedCheckedHasRescueStates.get(root);
    let rescueStyle = root.querySelector(`style[${DETACHED_CHECKED_HAS_RESCUE_STYLE_ATTR}]`);

    const liveControls = new Set(rules.flatMap(rule => rule.controls));
    for (const control of root.querySelectorAll(`[${DETACHED_CHECKED_HAS_CONTROL_ATTR}]`)) {
        if (!liveControls.has(control)) control.removeAttribute(DETACHED_CHECKED_HAS_CONTROL_ATTR);
    }

    if (!rules.length) {
        if (state) {
            root.removeEventListener('input', state.onStateChange, false);
            root.removeEventListener('change', state.onStateChange, false);
            detachedCheckedHasRescueStates.delete(root);
        }
        rescueStyle?.remove();
        root.removeAttribute(DETACHED_CHECKED_HAS_ROOT_ATTR);
        root.removeAttribute(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR);
        return 0;
    }

    if (!state) {
        state = {
            rules: [],
            onStateChange: event => {
                const current = detachedCheckedHasRescueStates.get(root);
                if (!current?.controls?.has(event.target)) return;
                refreshDetachedCheckedHasFallback(root);
                for (const delay of [0, 80, 260]) {
                    setTimeout(() => {
                        if (root.isConnected) refreshDetachedCheckedHasFallback(root);
                    }, delay);
                }
            },
        };
        root.addEventListener('input', state.onStateChange, false);
        root.addEventListener('change', state.onStateChange, false);
        detachedCheckedHasRescueStates.set(root, state);
    }
    state.rules = rules;
    state.controls = liveControls;

    if (!rescueStyle) {
        rescueStyle = document.createElement('style');
        rescueStyle.setAttribute(DETACHED_CHECKED_HAS_RESCUE_STYLE_ATTR, 'true');
        root.appendChild(rescueStyle);
    }
    rescueStyle.textContent = rules.map((rule, index) => (
        `[${DETACHED_CHECKED_HAS_ROOT_ATTR}~="s${index}"] ${rule.targetSelector} {${rule.declarations}}`
    )).join('\n');

    const perControlCount = new Map();
    for (const rule of rules) {
        for (const control of rule.controls) perControlCount.set(control, (perControlCount.get(control) || 0) + 1);
    }
    for (const [control, count] of perControlCount) {
        control.setAttribute(DETACHED_CHECKED_HAS_CONTROL_ATTR, String(count));
    }
    root.setAttribute(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR, String(rules.length));
    refreshDetachedCheckedHasFallback(root);
    return rules.length;
}



function checkedHasDisplayValue(declarations) {
    const source = String(declarations || '');
    const match = /(?:^|;)\s*display\s*:\s*([^;{}]+?)(?:\s*!important\s*)?(?=;|$)/i.exec(source);
    return String(match?.[1] || '').trim().replace(/\s*!important\s*$/i, '').toLowerCase();
}


function parseSimpleCheckedHasDisplayRules(root) {
    if (!root?.querySelectorAll) return [];
    const rules = [];
    const seen = new Set();
    for (const style of getRabbitMirrorLocalStyleElements(root)) {
        const css = String(style.textContent || '');
        const blockRe = /([^{}]+)\{([^{}]*)\}/g;
        let block;
        while ((block = blockRe.exec(css))) {
            const display = checkedHasDisplayValue(block[2]);
            if (!display) continue;
            for (const rawSelector of splitCssSelectorList(block[1])) {
                const selector = String(rawSelector || '').trim();
                if (!selector || !/:has\(/i.test(selector) || !/:checked\b/i.test(selector)) continue;
                const condition = /:has\(\s*(input(?:\s*\[[^\]]+\]|\s*[.#][A-Za-z_][\w-]*)*)\s*:checked\s*\)/i.exec(selector);
                if (!condition) continue;
                const controlSelector = String(condition[1] || '').trim();
                if (!controlSelector || /[>+~,]/.test(controlSelector) || /:(?!not\()/i.test(controlSelector)) continue;
                const targetSelector = selector.slice(condition.index + condition[0].length)
                    .trim()
                    .replace(/^[>+~]\s*/, '');
                if (!targetSelector || /:has\(|:checked\b|::(?:before|after)/i.test(targetSelector)) continue;

                let controls = [];
                let targets = [];
                try {
                    controls = [...root.querySelectorAll(controlSelector)]
                        .filter(input => input.matches?.('input[type="checkbox"]') && !input.disabled);
                    targets = [...root.querySelectorAll(targetSelector)];
                } catch {
                    continue;
                }
                if (!controls.length || controls.length > 8 || !targets.length || targets.length > 8) continue;
                for (const input of controls) {
                    for (const target of targets) {
                        const key = `${controlSelector}|${targetSelector}|${display}|${controls.indexOf(input)}|${targets.indexOf(target)}`;
                        if (seen.has(key)) continue;
                        seen.add(key);
                        rules.push({ input, target, display });
                    }
                }
            }
        }
    }
    return rules;
}


function pairedCheckedStateBaselineHidden(panel) {
    return String(panel?.style?.getPropertyValue?.('display') || '').trim().toLowerCase() === 'none';
}


export function findPairedCheckedStateCandidates(root) {
    const rules = parseSimpleCheckedHasDisplayRules(root);
    if (!rules.length) return [];
    const byInput = new Map();
    for (const rule of rules) {
        let targetMap = byInput.get(rule.input);
        if (!targetMap) {
            targetMap = new Map();
            byInput.set(rule.input, targetMap);
        }
        targetMap.set(rule.target, rule.display);
    }

    const inputs = [...byInput.keys()];
    const results = [];
    const seen = new Set();
    for (let firstIndex = 0; firstIndex < inputs.length; firstIndex += 1) {
        const first = inputs[firstIndex];
        const firstMap = byInput.get(first);
        for (let secondIndex = firstIndex + 1; secondIndex < inputs.length; secondIndex += 1) {
            const second = inputs[secondIndex];
            const secondMap = byInput.get(second);
            const firstPanel = [...firstMap.keys()].find(target => target.contains?.(first) && firstMap.get(target) === 'none');
            const secondPanel = [...secondMap.keys()].find(target => target.contains?.(second) && secondMap.get(target) === 'none');
            if (!firstPanel || !secondPanel || firstPanel === secondPanel || firstPanel.parentElement !== secondPanel.parentElement) continue;
            const firstShowsSecond = String(firstMap.get(secondPanel) || '') !== 'none' && !!firstMap.get(secondPanel);
            const secondShowsFirst = String(secondMap.get(firstPanel) || '') !== 'none' && !!secondMap.get(firstPanel);
            if (!firstShowsSecond || !secondShowsFirst) continue;
            if (!inputHasAssociatedLabel(root, first) || !inputHasAssociatedLabel(root, second)) continue;
            if (maintenanceMobileLayoutTextLength(firstPanel) < 8 || maintenanceMobileLayoutTextLength(secondPanel) < 8) continue;

            let forward = first;
            let back = second;
            let initial = firstPanel;
            let feedback = secondPanel;
            let forwardMap = firstMap;
            let backMap = secondMap;
            const firstHidden = pairedCheckedStateBaselineHidden(firstPanel);
            const secondHidden = pairedCheckedStateBaselineHidden(secondPanel);
            if (firstHidden && !secondHidden) {
                forward = second;
                back = first;
                initial = secondPanel;
                feedback = firstPanel;
                forwardMap = secondMap;
                backMap = firstMap;
            } else if (firstHidden === secondHidden) {
                const firstSignature = `${firstPanel.id || ''} ${firstPanel.className || ''}`;
                const secondSignature = `${secondPanel.id || ''} ${secondPanel.className || ''}`;
                if (/(?:feedback|result|detail|secondary|back|反馈|结果|详情|次画面)/i.test(firstSignature)
                    && !/(?:feedback|result|detail|secondary|back|反馈|结果|详情|次画面)/i.test(secondSignature)) {
                    forward = second;
                    back = first;
                    initial = secondPanel;
                    feedback = firstPanel;
                    forwardMap = secondMap;
                    backMap = firstMap;
                }
            }
            if (pairedCheckedStateBaselineHidden(initial) || !pairedCheckedStateBaselineHidden(feedback)) continue;

            const initialShow = String(backMap.get(initial) || '').trim().toLowerCase();
            const feedbackShow = String(forwardMap.get(feedback) || '').trim().toLowerCase();
            if (!initialShow || initialShow === 'none' || !feedbackShow || feedbackShow === 'none') continue;
            const key = `${inputs.indexOf(forward)}|${inputs.indexOf(back)}|${[...root.querySelectorAll('*')].indexOf(initial)}|${[...root.querySelectorAll('*')].indexOf(feedback)}`;
            if (seen.has(key)) continue;
            seen.add(key);
            results.push({ forward, back, initial, feedback, initialShow, feedbackShow });
        }
    }
    return results;
}


function refreshPairedCheckedStateRescue(root) {
    const state = pairedCheckedStateRescueStates.get(root);
    if (!state) return;
    for (const entry of state.entries || []) {
        if (!entry.forward?.isConnected || !entry.back?.isConnected || !entry.initial?.isConnected || !entry.feedback?.isConnected) continue;
        if (entry.back.checked) {
            entry.forward.checked = false;
            entry.back.checked = false;
            restoreInteractionInlineOverrides(entry.forward);
            restoreInteractionInlineOverrides(entry.back);
        } else if (entry.forward.checked) {
            entry.back.checked = false;
        }
        const active = !!entry.forward.checked;
        entry.initial.style.setProperty('display', active ? 'none' : entry.initialShow, 'important');
        entry.feedback.style.setProperty('display', active ? entry.feedbackShow : 'none', 'important');
        entry.forward.setAttribute('aria-pressed', active ? 'true' : 'false');
        entry.back.setAttribute('aria-pressed', 'false');
        entry.initial.setAttribute(PAIRED_CHECKED_STATE_PANEL_ATTR, 'initial');
        entry.feedback.setAttribute(PAIRED_CHECKED_STATE_PANEL_ATTR, 'feedback');
    }
}


function schedulePairedCheckedStateRefresh(root) {
    for (const delay of [0, 80, 260, 650]) {
        setTimeout(() => {
            if (root?.isConnected) refreshPairedCheckedStateRescue(root);
        }, delay);
    }
}


export function installPairedCheckedStateRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const entries = findPairedCheckedStateCandidates(root);
    let state = pairedCheckedStateRescueStates.get(root);
    if (!entries.length) {
        if (state) {
            root.removeEventListener('click', state.onClick, true);
            root.removeEventListener('change', state.onChange, false);
            pairedCheckedStateRescueStates.delete(root);
        }
        root.removeAttribute(PAIRED_CHECKED_STATE_RESCUE_ATTR);
        root.removeAttribute(PAIRED_CHECKED_STATE_COUNT_ATTR);
        root.querySelectorAll(`[${PAIRED_CHECKED_STATE_CONTROL_ATTR}], [${PAIRED_CHECKED_STATE_PANEL_ATTR}]`).forEach(element => {
            element.removeAttribute(PAIRED_CHECKED_STATE_CONTROL_ATTR);
            element.removeAttribute(PAIRED_CHECKED_STATE_PANEL_ATTR);
        });
        return 0;
    }

    if (!state) {
        state = {
            entries: [],
            onClick: event => {
                const label = event.target?.closest?.('label');
                if (!label || !root.contains(label)) return;
                const targetId = label.getAttribute('for');
                const input = targetId
                    ? [...root.querySelectorAll('input[id]')].find(element => element.id === targetId)
                    : label.querySelector('input[type="checkbox"]');
                const entry = state.entries.find(item => item.forward === input || item.back === input);
                if (!entry) return;

                // 双向画面由本专项路线独占 label 点击。阻止浏览器原生 label 默认切换，
                // 避免后续通用 label 兜底或迟到的 WebView 默认行为把 back 再次勾上。
                event.preventDefault();
                const forwardBefore = !!entry.forward.checked;
                const backBefore = !!entry.back.checked;
                if (input === entry.forward) {
                    entry.forward.checked = true;
                    entry.back.checked = false;
                } else {
                    entry.forward.checked = false;
                    entry.back.checked = false;
                }
                restoreInteractionInlineOverrides(entry.forward);
                restoreInteractionInlineOverrides(entry.back);
                refreshPairedCheckedStateRescue(root);
                schedulePairedCheckedStateRefresh(root);

                if (forwardBefore !== entry.forward.checked) {
                    entry.forward.dispatchEvent(new Event('input', { bubbles: true }));
                    entry.forward.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (backBefore !== entry.back.checked) {
                    entry.back.dispatchEvent(new Event('input', { bubbles: true }));
                    entry.back.dispatchEvent(new Event('change', { bubbles: true }));
                }
            },
            onChange: event => {
                const entry = state.entries.find(item => item.forward === event.target || item.back === event.target);
                if (!entry) return;
                if (event.target === entry.forward && entry.forward.checked) entry.back.checked = false;
                if (event.target === entry.back && entry.back.checked) {
                    entry.forward.checked = false;
                    entry.back.checked = false;
                }
                refreshPairedCheckedStateRescue(root);
                schedulePairedCheckedStateRefresh(root);
            },
        };
        root.addEventListener('click', state.onClick, true);
        root.addEventListener('change', state.onChange, false);
        pairedCheckedStateRescueStates.set(root, state);
    }
    state.entries = entries;
    for (const entry of entries) {
        entry.forward.setAttribute(PAIRED_CHECKED_STATE_CONTROL_ATTR, 'forward');
        entry.back.setAttribute(PAIRED_CHECKED_STATE_CONTROL_ATTR, 'back');
    }
    root.setAttribute(PAIRED_CHECKED_STATE_RESCUE_ATTR, 'true');
    root.setAttribute(PAIRED_CHECKED_STATE_COUNT_ATTR, String(entries.length));
    refreshPairedCheckedStateRescue(root);
    schedulePairedCheckedStateRefresh(root);
    return entries.length;
}


function checkedStyleMapActivatesStackedPanel(styleMap) {
    for (const [rawProperty, rawValue] of styleMap || []) {
        const property = String(rawProperty || '').trim().toLowerCase();
        const value = String(rawValue || '').trim().toLowerCase().replace(/\s*!important\s*$/i, '');
        if (property === 'opacity') {
            const opacity = Number.parseFloat(value);
            if (Number.isFinite(opacity) && opacity > 0.05) return true;
        }
        if (property === 'visibility' && !/^(?:hidden|collapse)$/.test(value)) return true;
        if (property === 'display' && value && value !== 'none') return true;
        if (property === 'pointer-events' && value && value !== 'none') return true;
    }
    return false;
}


function commonStackedPanelClassToken(targets) {
    const lists = (targets || []).map(target => new Set(getClassTokens(target)));
    if (!lists.length) return '';
    const candidates = [...lists[0]].filter(token => lists.every(set => set.has(token)));
    return candidates
        .filter(token => /(?:info|content|state|panel|result|feedback|detail|text|screen|view|focus|draft|manuscript|essay|danmaku|marquee|ticker)/i.test(token))
        .sort((a, b) => b.length - a.length)[0] || '';
}


export function maintenancePassiveAnimatedStatePanel(element, style = null) {
    if (!element) return false;
    const computed = style || maintenanceSafeComputedStyle(element);
    const position = String(computed?.position || '').toLowerCase();
    const animationName = String(computed?.animationName || '').trim().toLowerCase();
    const whiteSpace = String(computed?.whiteSpace || '').trim().toLowerCase();
    const pointerEvents = String(computed?.pointerEvents || '').trim().toLowerCase();
    const opacity = Number.parseFloat(computed?.opacity || '1');
    return (position === 'absolute' || position === 'fixed')
        && animationName && animationName !== 'none'
        && whiteSpace === 'nowrap'
        && pointerEvents === 'none'
        && (!Number.isFinite(opacity) || opacity > 0.05);
}


function stackedPanelsShareLayer(parent, panels) {
    if (!parent || !panels?.length) return false;
    const parentStyle = maintenanceSafeComputedStyle(parent);
    const parentDisplay = String(parentStyle?.display || '').toLowerCase();
    if (parentDisplay === 'grid' || parentDisplay === 'inline-grid') {
        const areas = panels.map(panel => {
            const style = maintenanceSafeComputedStyle(panel);
            return [
                String(style?.gridArea || ''),
                String(style?.gridRowStart || ''),
                String(style?.gridColumnStart || ''),
            ].join('|');
        });
        const nonEmpty = areas.filter(value => value.replace(/\|/g, '').trim());
        if (!nonEmpty.length || new Set(nonEmpty).size === 1) return true;
        // 模型常只在公共 class 上声明 grid-area，部分 WebView 的 computedStyle 不返回长属性；
        // 父层为单格 grid 且所有候选是同一公共内容 class 时仍可视为叠层。
        const columnTemplate = String(parentStyle?.gridTemplateColumns || '').trim();
        const rowTemplate = String(parentStyle?.gridTemplateRows || '').trim();
        if (!/\s/.test(columnTemplate) && !/\s/.test(rowTemplate)) return true;
    }
    const positions = panels.map(panel => String(maintenanceSafeComputedStyle(panel)?.position || '').toLowerCase());
    return positions.every(position => position === 'absolute' || position === 'fixed');
}


function exclusiveStackedPanelsNeedFullGridSpan(parent, inputMap, panels) {
    if (!parent?.children || !inputMap?.size || !panels?.length) return false;
    const parentStyle = maintenanceSafeComputedStyle(parent);
    const display = String(parentStyle?.display || '').toLowerCase();
    if (display !== 'grid' && display !== 'inline-grid') return false;

    // Only repair the common "selector cards on a full-width row + state panels below"
    // pattern. A generic stacked panel inside a deliberate multi-column composition must
    // keep its authored grid placement.
    const controls = [...inputMap.keys()].filter(input => input?.id && input.parentElement === parent);
    if (controls.length < 2 || !panels.every(panel => panel?.parentElement === parent)) return false;

    const parentRect = maintenanceMobileLayoutRect(parent);
    const explicitFullSpanRow = [...parent.children].find(child => {
        if (!child || panels.includes(child) || controls.includes(child)) return false;
        const linkedLabels = controls.filter(input => findDescendantLabelForId(child, input.id)).length;
        if (linkedLabels < Math.min(2, controls.length)) return false;

        const inline = String(child.getAttribute?.('style') || '').toLowerCase();
        if (/grid-column\s*:\s*1\s*\/\s*-1/.test(inline)) return true;
        const style = maintenanceSafeComputedStyle(child);
        const start = String(style?.gridColumnStart || '').trim().toLowerCase();
        const end = String(style?.gridColumnEnd || '').trim().toLowerCase();
        if (start === '1' && end === '-1') return true;

        const rowRect = maintenanceMobileLayoutRect(child);
        return !!(parentRect && rowRect && parentRect.width > 0 && rowRect.width >= parentRect.width * 0.88);
    });
    if (!explicitFullSpanRow) return false;

    // Do not override an authored panel placement. The bug this rescues is specifically
    // auto-placement placing the active state panel into only the first grid track.
    return panels.every(panel => {
        const inline = String(panel.getAttribute?.('style') || '').toLowerCase();
        if (/grid-(?:column|area|row)\s*:/.test(inline)) return false;
        const style = maintenanceSafeComputedStyle(panel);
        const start = String(style?.gridColumnStart || '').trim().toLowerCase();
        const end = String(style?.gridColumnEnd || '').trim().toLowerCase();
        return (!start || start === 'auto') && (!end || end === 'auto');
    });
}


export function findExclusiveStackedStateCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const byParent = new Map();

    for (const input of root.querySelectorAll('input[type="radio"], input[type="checkbox"]')) {
        if (input.disabled) continue;
        for (const rule of parseCheckedRulesFromText(root, input)) {
            if (rule.pseudoElement || !checkedStyleMapActivatesStackedPanel(rule.styleMap)) continue;
            for (const target of resolveTargetsForCheckedRule(root, input, rule)) {
                if (!target?.parentElement || maintenanceMobileLayoutTextLength(target) < 6) continue;
                const parent = target.parentElement;
                if (!byParent.has(parent)) byParent.set(parent, new Map());
                const inputMap = byParent.get(parent);
                if (!inputMap.has(input)) inputMap.set(input, new Set());
                inputMap.get(input).add(target);
            }
        }
    }

    const candidates = [];
    for (const [parent, inputMap] of byParent) {
        const mappedTargets = [...new Set([...inputMap.values()].flatMap(set => [...set]))];
        if (inputMap.size < 2 || mappedTargets.length < 2 || mappedTargets.some(target => target.parentElement !== parent)) continue;
        const commonClass = commonStackedPanelClassToken(mappedTargets);
        if (!commonClass) continue;
        const classPanels = [...parent.children].filter(child => child.classList?.contains(commonClass));
        const passiveAnimatedCollection = classPanels.length > 0 && classPanels.every(panel => maintenancePassiveAnimatedStatePanel(panel));
        const panelLimit = passiveAnimatedCollection ? 30 : 10;
        if (classPanels.length < mappedTargets.length || classPanels.length > panelLimit) continue;
        if (!mappedTargets.every(target => classPanels.includes(target))) continue;

        // Radio scene-switchers often use a third, initially checked "close/default" radio
        // followed by a differently named default panel (for example `.rm-initial-view`).
        // It intentionally has no `+ .focus-panel` branch of its own, so it is absent from
        // inputMap. Treat only that baseline radio's immediate content sibling as the default
        // stacked panel when it shares the same one-cell layer as the mapped branches.
        const controls = [...inputMap.keys()];
        const radioNames = new Set(controls
            .filter(input => input?.type === 'radio')
            .map(input => String(input.name || '').trim())
            .filter(Boolean));
        const baselinePanels = [];
        const baselineControls = [];
        if (radioNames.size === 1) {
            const [radioName] = [...radioNames];
            for (const child of [...parent.children]) {
                if (!child?.matches?.('input[type="radio"]') || inputMap.has(child)) continue;
                if (String(child.name || '').trim() !== radioName) continue;
                const baseline = child.getAttribute?.(REVERSIBLE_RADIO_BASELINE_ATTR) === 'true'
                    || child.defaultChecked
                    || child.hasAttribute?.('checked');
                if (!baseline) continue;
                const panel = child.nextElementSibling;
                if (!panel || panel.parentElement !== parent || mappedTargets.includes(panel)) continue;
                if (!panel.matches?.('div,section,article,main,aside,figure')) continue;
                if (maintenanceMobileLayoutTextLength(panel) < 6) continue;
                if (!stackedPanelsShareLayer(parent, [...mappedTargets, panel])) continue;
                baselinePanels.push(panel);
                baselineControls.push(child);
            }
        }

        const panels = [...new Set([...classPanels, ...baselinePanels])];
        if (!stackedPanelsShareLayer(parent, panels)) continue;
        const defaultPanels = panels.filter(panel => !mappedTargets.includes(panel));
        if (!defaultPanels.length && panels.length === mappedTargets.length) {
            // 没有默认层也可以修复，但至少要有两个互斥 radio 分支。
            if (!controls.every(input => input.type === 'radio')) continue;
        }
        const fullGridSpanPanels = exclusiveStackedPanelsNeedFullGridSpan(parent, inputMap, panels);
        candidates.push({ parent, inputMap, panels, defaultPanels, baselineControls, commonClass, passiveAnimatedCollection, fullGridSpanPanels });
    }
    return candidates;
}

// 1.3.62: historical independent mirrors may already carry the persisted
// exclusive-stacked-state ownership markers from an older runtime. 1.3.57 made
// the complete interaction library lazy, so a version upgrade must not rely on
// re-running the whole detector merely to apply a later structural layout fix.
// This migration is deliberately cheap: it touches only already-owned state
// panels, requires the same direct grid parent plus a full-width selector row,
// and refuses authored grid placement. It can therefore run from
// ensureExternalTools() even while the details body stays collapsed.

export function repairRabbitMirrorPersistedExclusiveGridSpan(root) {
    if (!root?.querySelectorAll) return 0;
    if (root.getAttribute?.(EXCLUSIVE_STACKED_STATE_RESCUE_ATTR) !== 'true') return 0;
    const ownedPanels = [...root.querySelectorAll(`[${EXCLUSIVE_STACKED_STATE_PANEL_ATTR}]`)]
        .filter(panel => panel?.parentElement);
    if (ownedPanels.length < 2) {
        root.removeAttribute?.(EXCLUSIVE_STACKED_STATE_GRID_SPAN_COUNT_ATTR);
        return 0;
    }

    const groups = new Map();
    for (const panel of ownedPanels) {
        const parent = panel.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(panel);
    }

    let repaired = 0;
    for (const [parent, panels] of groups) {
        if (panels.length < 2) continue;
        const parentStyle = maintenanceSafeComputedStyle(parent);
        const display = String(parentStyle?.display || '').toLowerCase();
        if (display !== 'grid' && display !== 'inline-grid') continue;

        const controls = [...parent.children].filter(child =>
            child?.matches?.('input[type="radio"],input[type="checkbox"]')
            && child.hasAttribute?.(EXCLUSIVE_STACKED_STATE_CONTROL_ATTR));
        if (controls.length < 2) continue;
        const inputMap = new Map(controls.map(input => [input, new Set()]));

        // If a previous 1.3.62 pass already wrote the exact full-span value,
        // keep it without making the authored-placement guard fail on itself.
        const alreadyFullSpan = panels.every(panel => {
            const inline = String(panel.getAttribute?.('style') || '').toLowerCase();
            return /grid-column\s*:\s*1\s*\/\s*-1(?:\s*!important)?/.test(inline)
                && panel.getAttribute?.(EXCLUSIVE_STACKED_STATE_GRID_SPAN_ATTR) === 'true';
        });
        if (alreadyFullSpan) {
            repaired += panels.length;
            continue;
        }

        if (!exclusiveStackedPanelsNeedFullGridSpan(parent, inputMap, panels)) continue;
        for (const panel of panels) {
            panel.style.setProperty('grid-column', '1 / -1', 'important');
            panel.setAttribute(EXCLUSIVE_STACKED_STATE_GRID_SPAN_ATTR, 'true');
            repaired += 1;
        }
    }

    if (repaired) root.setAttribute(EXCLUSIVE_STACKED_STATE_GRID_SPAN_COUNT_ATTR, String(repaired));
    else root.removeAttribute?.(EXCLUSIVE_STACKED_STATE_GRID_SPAN_COUNT_ATTR);
    return repaired;
}


// 1.3.62: deterministic full-width result-panel repair for the common pattern:
// a multi-column Grid contains several state controls, one full-width selector-card row,
// and multiple text result panels that are auto-placed into a single narrow track.
// This is structural rather than geometric, so it also repairs hidden sibling panels and
// old mirrors whose current active panel has not yet produced measurable squeeze evidence.

function selectorPanelGridDisplay(parent) {
    const style = maintenanceSafeComputedStyle(parent);
    const display = String(style?.display || '').trim().toLowerCase();
    if (display === 'grid' || display === 'inline-grid') return true;
    const inline = String(parent?.getAttribute?.('style') || '').toLowerCase();
    return /(?:^|;)\s*display\s*:\s*(?:inline-)?grid\b/.test(inline);
}


function selectorPanelExplicitFullRow(child) {
    if (!child) return false;
    const inline = String(child.getAttribute?.('style') || '').toLowerCase();
    if (/grid-column\s*:\s*1\s*\/\s*-1(?:\s*!important)?/.test(inline)) return true;
    const style = maintenanceSafeComputedStyle(child);
    const start = String(style?.gridColumnStart || '').trim().toLowerCase();
    const end = String(style?.gridColumnEnd || '').trim().toLowerCase();
    return start === '1' && end === '-1';
}


function selectorPanelCheckedCssEvidence(root, controls, semanticToken = '') {
    const css = [...(root?.querySelectorAll?.('style') || [])]
        .map(style => String(style.textContent || ''))
        .join('\n');
    if (!css || !/:checked\b/.test(css)) return false;
    const linked = controls.filter(input => input?.id && css.includes(input.id));
    if (linked.length < Math.min(2, controls.length)) return false;
    return !semanticToken || css.includes(`.${semanticToken}`);
}


function selectorPanelSemanticPanels(parent, controls, selectorRow, root) {
    const excluded = new Set([...controls, selectorRow].filter(Boolean));
    const candidates = [...parent.children].filter(child => {
        if (!child || excluded.has(child)) return false;
        if (child.matches?.('style,script,template,input,select,textarea,button')) return false;
        if (viewportLayoutHasAuthoredGridPlacement(child)) return false;
        if (maintenanceMobileLayoutTextLength(child) < 40) return false;
        return true;
    });
    if (candidates.length < 2) return [];

    const tokenCounts = new Map();
    for (const child of candidates) {
        for (const token of getClassTokens(child)) {
            if (!/(?:panel|content|detail|commentary|comment|result|pane|view|body|story|note)/i.test(token)) continue;
            tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
        }
    }
    const semanticToken = [...tokenCounts.entries()]
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    if (!semanticToken || !selectorPanelCheckedCssEvidence(root, controls, semanticToken)) return [];
    const panels = candidates.filter(child => child.classList?.contains?.(semanticToken));
    return panels.length >= 2 && panels.length <= 12 ? panels : [];
}


export function findSelectorPanelGridSpanCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const allControls = [...root.querySelectorAll('input[type="radio"][id], input[type="checkbox"][id]')]
        .filter(input => input?.parentElement);
    if (allControls.length < 2) return [];

    const byParent = new Map();
    for (const input of allControls) {
        const parent = input.parentElement;
        if (!byParent.has(parent)) byParent.set(parent, []);
        byParent.get(parent).push(input);
    }

    const groups = [];
    for (const [parent, controls] of byParent) {
        if (controls.length < 2 || controls.length > 12 || !selectorPanelGridDisplay(parent)) continue;
        const radioControls = controls.filter(input => input.type === 'radio');
        if (radioControls.length >= 2) {
            const names = new Set(radioControls.map(input => String(input.name || '').trim()).filter(Boolean));
            if (names.size > 1) continue;
        }

        const selectorRow = [...parent.children].find(child => {
            if (!child || controls.includes(child)) return false;
            const linked = controls.filter(input => findDescendantLabelForId(child, input.id)).length;
            return linked >= Math.min(2, controls.length) && selectorPanelExplicitFullRow(child);
        });
        if (!selectorRow) continue;

        const panels = selectorPanelSemanticPanels(parent, controls, selectorRow, root);
        if (panels.length < 2) continue;
        const needsRepair = panels.filter(panel => {
            const inline = String(panel.getAttribute?.('style') || '').toLowerCase();
            const already = /grid-column\s*:\s*1\s*\/\s*-1(?:\s*!important)?/.test(inline)
                && panel.getAttribute?.(SELECTOR_PANEL_GRID_SPAN_ATTR) === 'true';
            return !already;
        });
        if (needsRepair.length) groups.push({ parent, controls, selectorRow, panels, needsRepair });
    }
    return groups;
}


export function repairRabbitMirrorSelectorPanelGridSpan(root) {
    if (!root?.querySelectorAll) return 0;
    const groups = findSelectorPanelGridSpanCandidates(root);
    if (!groups.length) {
        root.removeAttribute?.(SELECTOR_PANEL_GRID_SPAN_COUNT_ATTR);
        return 0;
    }

    let repaired = 0;
    for (const { panels } of groups) {
        for (const panel of panels) {
            panel.style.setProperty('grid-column', '1 / -1', 'important');
            panel.style.setProperty('min-width', '0', 'important');
            panel.style.setProperty('max-width', '100%', 'important');
            panel.style.setProperty('box-sizing', 'border-box', 'important');
            panel.setAttribute(SELECTOR_PANEL_GRID_SPAN_ATTR, 'true');
            repaired += 1;
        }
    }

    root.setAttribute(SELECTOR_PANEL_GRID_SPAN_COUNT_ATTR, String(repaired));
    return repaired;
}


function cleanupExclusiveStackedStateRescue(root) {
    const state = exclusiveStackedStateRescueStates.get(root);
    if (state) {
        root.removeEventListener('input', state.onStateChange, false);
        root.removeEventListener('change', state.onStateChange, false);
        for (const entry of state.entries || []) {
            for (const panelState of entry.panelStates || []) {
                restorePseudoStyleState(panelState.panel, panelState.originalStyles);
                panelState.panel?.removeAttribute?.(EXCLUSIVE_STACKED_STATE_PANEL_ATTR);
                panelState.panel?.removeAttribute?.(EXCLUSIVE_STACKED_STATE_GRID_SPAN_ATTR);
                panelState.panel?.removeAttribute?.('aria-hidden');
            }
            for (const input of entry.inputMap?.keys?.() || []) {
                input?.removeAttribute?.(EXCLUSIVE_STACKED_STATE_CONTROL_ATTR);
            }
            for (const input of entry.baselineControls || []) {
                input?.removeAttribute?.(EXCLUSIVE_STACKED_STATE_CONTROL_ATTR);
            }
        }
        exclusiveStackedStateRescueStates.delete(root);
    }
    root?.removeAttribute?.(EXCLUSIVE_STACKED_STATE_RESCUE_ATTR);
    root?.removeAttribute?.(EXCLUSIVE_STACKED_STATE_COUNT_ATTR);
    root?.removeAttribute?.(EXCLUSIVE_STACKED_STATE_GRID_SPAN_COUNT_ATTR);
}


export function refreshExclusiveStackedStateRescue(root) {
    const state = exclusiveStackedStateRescueStates.get(root);
    if (!state) return;
    for (const entry of state.entries || []) {
        if (!entry.parent?.isConnected) continue;
        const checkedMappings = [...entry.inputMap.entries()]
            .filter(([input]) => input?.isConnected && input.checked);
        // radio 组被宿主破坏时，优先采用 DOM 顺序中最后一个 checked 分支；
        // scopeRabbitMirrorInteractionIds 会在本路线安装前恢复真正的单选组。
        const activeMapping = checkedMappings.length ? checkedMappings[checkedMappings.length - 1] : null;
        const activePanels = new Set(activeMapping ? [...activeMapping[1]] : entry.defaultPanels);
        for (const panelState of entry.panelStates) {
            const { panel } = panelState;
            if (!panel?.isConnected) continue;
            const active = activePanels.has(panel);
            if (panelState.fullGridSpan) {
                // The selector/card row already spans the complete grid, while the mutually
                // exclusive result panels are auto-placed as ordinary grid items. Without
                // this, a desktop multi-column grid squeezes the active narrative into one
                // narrow track and leaves the rest of the row blank.
                panel.style.setProperty('grid-column', '1 / -1', 'important');
                panel.setAttribute(EXCLUSIVE_STACKED_STATE_GRID_SPAN_ATTR, 'true');
            }
            if (panelState.passiveAnimated) {
                // 弹幕/跑马灯属于“被选中的一组多个动画条目”，不是整页正文 panel。
                // 激活组恢复模型原本的透明度/z-index，只维持可见与动画；未激活组才强制隐藏并暂停。
                if (active) {
                    restorePseudoStyleState(panel, panelState.originalStyles);
                    panel.style.setProperty('visibility', 'visible', 'important');
                    panel.style.setProperty('pointer-events', 'none', 'important');
                    // Restoring the authored state already releases our inactive-group pause.
                    // Forcing running!important here would defeat collapsed-scene CSS and authored pauses.
                } else {
                    panel.style.setProperty('opacity', '0', 'important');
                    panel.style.setProperty('visibility', 'hidden', 'important');
                    panel.style.setProperty('pointer-events', 'none', 'important');
                    panel.style.setProperty('z-index', '0', 'important');
                    panel.style.setProperty('animation-play-state', 'paused', 'important');
                }
            } else {
                // Default/baseline panels are frequently hidden by an over-broad
                // `.trigger:checked ~ .initial-view { display:none }` rule because the
                // baseline radio shares the same trigger class. Own display only for the
                // inferred default panel so the return radio can actually restore it.
                if (panelState.isDefaultPanel) {
                    panel.style.setProperty('display', active ? panelState.visibleDisplay : 'none', 'important');
                }
                panel.style.setProperty('opacity', active ? '1' : '0', 'important');
                panel.style.setProperty('visibility', active ? 'visible' : 'hidden', 'important');
                panel.style.setProperty('pointer-events', active ? 'auto' : 'none', 'important');
                panel.style.setProperty('z-index', active ? '2' : '0', 'important');
            }
            panel.setAttribute(EXCLUSIVE_STACKED_STATE_PANEL_ATTR, active ? 'active' : 'inactive');
            panel.setAttribute('aria-hidden', active ? 'false' : 'true');
        }
        for (const input of entry.inputMap.keys()) {
            input.setAttribute('aria-pressed', input.checked ? 'true' : 'false');
        }
        for (const input of entry.baselineControls || []) {
            input.setAttribute('aria-pressed', input.checked ? 'true' : 'false');
        }
    }
}


export function scheduleExclusiveStackedStateRefresh(root) {
    for (const delay of [0, 80, 260, 650]) {
        setTimeout(() => {
            if (root?.isConnected) refreshExclusiveStackedStateRescue(root);
        }, delay);
    }
}


export function installExclusiveStackedStateRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const candidates = findExclusiveStackedStateCandidates(root);
    cleanupExclusiveStackedStateRescue(root);
    if (!candidates.length) return 0;

    const state = {
        entries: candidates.map(candidate => ({
            ...candidate,
            panelStates: candidate.panels.map(panel => {
                const computed = maintenanceSafeComputedStyle(panel);
                const computedDisplay = String(computed?.display || '').trim().toLowerCase();
                return {
                    panel,
                    isDefaultPanel: candidate.defaultPanels.includes(panel),
                    fullGridSpan: !!candidate.fullGridSpanPanels,
                    visibleDisplay: computedDisplay && computedDisplay !== 'none' ? computedDisplay : 'block',
                    passiveAnimated: !!candidate.passiveAnimatedCollection && maintenancePassiveAnimatedStatePanel(panel),
                    originalStyles: capturePseudoStyleState(panel, ['display', 'opacity', 'visibility', 'pointer-events', 'z-index', 'animation-play-state', 'grid-column']),
                };
            }),
        })),
        onStateChange: () => {
            refreshExclusiveStackedStateRescue(root);
            scheduleExclusiveStackedStateRefresh(root);
        },
    };
    root.addEventListener('input', state.onStateChange, false);
    root.addEventListener('change', state.onStateChange, false);
    exclusiveStackedStateRescueStates.set(root, state);

    for (const entry of state.entries) {
        for (const input of entry.inputMap.keys()) {
            input.setAttribute(EXCLUSIVE_STACKED_STATE_CONTROL_ATTR, 'true');
        }
        for (const input of entry.baselineControls || []) {
            input.setAttribute(EXCLUSIVE_STACKED_STATE_CONTROL_ATTR, 'baseline');
        }
    }
    root.setAttribute(EXCLUSIVE_STACKED_STATE_RESCUE_ATTR, 'true');
    root.setAttribute(EXCLUSIVE_STACKED_STATE_COUNT_ATTR, String(state.entries.length));
    refreshExclusiveStackedStateRescue(root);
    scheduleExclusiveStackedStateRefresh(root);
    return state.entries.length;
}



function channelDialLabelsForInput(root, input) {
    if (!root?.querySelectorAll || !input) return [];
    const labels = new Set();
    for (const label of input.labels || []) {
        if (root.contains?.(label)) labels.add(label);
    }
    const id = String(input.id || '').trim();
    if (id) {
        for (const label of root.querySelectorAll('label[for]')) {
            if (String(label.getAttribute('for') || '') === id) labels.add(label);
        }
    }
    return [...labels];
}


function channelDialMediaSignature(element) {
    if (!element) return '';
    return `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('aria-label') || ''}`;
}


export function findChannelDialCycleCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const stackedCandidates = findExclusiveStackedStateCandidates(root);
    const groups = new Map();
    for (const input of root.querySelectorAll('input[type="radio"]')) {
        if (input.disabled) continue;
        const name = String(input.name || '').trim();
        if (!name) continue;
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(input);
    }

    const candidates = [];
    for (const inputs of groups.values()) {
        if (inputs.length < 3 || inputs.length > 8) continue;
        const stacked = stackedCandidates.find(candidate => {
            const mappedInputs = new Set(candidate.inputMap.keys());
            return inputs.every(input => mappedInputs.has(input));
        });
        if (!stacked) continue;

        const allLabels = new Map(inputs.map(input => [input, channelDialLabelsForInput(root, input)]));
        if ([...allLabels.values()].some(labels => !labels.length)) continue;

        const possibleHosts = [...root.querySelectorAll('div,section,nav')].filter(element => {
            const style = maintenanceSafeComputedStyle(element);
            const position = String(style?.position || element.style?.position || '').toLowerCase();
            const signature = channelDialMediaSignature(element);
            const dialLike = /(?:knob|dial|channel-control|频道|旋钮)/i.test(signature)
                || !!element.querySelector?.('[class*="knob" i], [class*="dial" i], [aria-label*="频道"], [aria-label*="旋钮"]');
            if (!dialLike && position !== 'relative') return false;
            return inputs.every(input => (allLabels.get(input) || []).some(label => element.contains(label)));
        });

        let host = null;
        for (const candidateHost of possibleHosts) {
            const rect = maintenanceMobileLayoutRect(candidateHost);
            const width = Number(rect?.width || maintenanceMobileLayoutLengthPx(
                maintenanceSafeComputedStyle(candidateHost)?.width,
                Number(root.getBoundingClientRect?.().width || 480),
            ) || 0);
            const height = Number(rect?.height || 0);
            if ((width > 0 && width > 180) || (height > 0 && height > 180)) continue;
            const visibleDial = [...candidateHost.querySelectorAll('div,span')].find(element => {
                const signature = channelDialMediaSignature(element);
                if (!/(?:knob|dial|旋钮)/i.test(signature)) return false;
                const style = maintenanceSafeComputedStyle(element);
                const elementRect = maintenanceMobileLayoutRect(element);
                return String(style?.display || '').toLowerCase() !== 'none'
                    && Number(elementRect?.width || 0) >= 20
                    && Number(elementRect?.height || 0) >= 20;
            });
            if (!visibleDial) continue;

            let mediaHost = candidateHost;
            let mediaMatched = false;
            while (mediaHost && root.contains?.(mediaHost)) {
                const signature = channelDialMediaSignature(mediaHost);
                const hasScreen = !!mediaHost.querySelector?.('[class*="tv-screen" i], [class*="screen" i], [class*="channel" i], [class*="content-state" i]');
                if (/(?:tv|television|crt|monitor|terminal|频道|电视|监控|终端)/i.test(signature) || hasScreen) {
                    mediaMatched = true;
                    break;
                }
                if (mediaHost === root) break;
                mediaHost = mediaHost.parentElement;
            }
            if (!mediaMatched) continue;
            host = candidateHost;
            break;
        }
        if (!host) continue;
        candidates.push({ inputs, host, labels: [...new Set([...allLabels.values()].flat())] });
    }
    return candidates;
}


function cleanupChannelDialCycleRescue(root) {
    const state = channelDialCycleRescueStates.get(root);
    if (state) {
        for (const entry of state.entries || []) {
            entry.host?.removeEventListener?.('click', entry.onClick, true);
            entry.host?.removeEventListener?.('keydown', entry.onKeyDown, true);
            if (entry.host) {
                if (entry.originalRole == null) entry.host.removeAttribute('role');
                else entry.host.setAttribute('role', entry.originalRole);
                if (entry.originalTabIndex == null) entry.host.removeAttribute('tabindex');
                else entry.host.setAttribute('tabindex', entry.originalTabIndex);
                if (entry.originalAriaLabel == null) entry.host.removeAttribute('aria-label');
                else entry.host.setAttribute('aria-label', entry.originalAriaLabel);
                entry.host.removeAttribute(CHANNEL_DIAL_CYCLE_HOST_ATTR);
            }
            for (const labelState of entry.labelStates || []) {
                const { label, value, priority } = labelState;
                if (!label?.style) continue;
                if (value) label.style.setProperty('pointer-events', value, priority || '');
                else label.style.removeProperty('pointer-events');
                label.removeAttribute(CHANNEL_DIAL_CYCLE_LABEL_ATTR);
            }
        }
        channelDialCycleRescueStates.delete(root);
    }
    root?.removeAttribute?.(CHANNEL_DIAL_CYCLE_RESCUE_ATTR);
    root?.removeAttribute?.(CHANNEL_DIAL_CYCLE_COUNT_ATTR);
}


function activateChannelDialInput(root, entry, nextInput) {
    if (!nextInput?.isConnected || !root.contains?.(nextInput)) return;
    const before = entry.inputs.map(input => !!input.checked);
    setRescuedCheckedState(root, nextInput, true);
    entry.inputs.forEach(input => input.setAttribute('aria-pressed', input.checked ? 'true' : 'false'));
    entry.inputs.forEach((input, index) => {
        if (before[index] === !!input.checked) return;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    refreshExclusiveStackedStateRescue(root);
    scheduleExclusiveStackedStateRefresh(root);
}


export function installChannelDialCycleRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const candidates = findChannelDialCycleCandidates(root);
    cleanupChannelDialCycleRescue(root);
    if (!candidates.length) return 0;

    const state = { entries: [] };
    for (const candidate of candidates) {
        const entry = {
            ...candidate,
            originalRole: candidate.host.getAttribute('role'),
            originalTabIndex: candidate.host.getAttribute('tabindex'),
            originalAriaLabel: candidate.host.getAttribute('aria-label'),
            labelStates: candidate.labels.map(label => ({
                label,
                value: label.style.getPropertyValue('pointer-events'),
                priority: label.style.getPropertyPriority('pointer-events'),
            })),
        };
        const cycle = event => {
            if (!entry.host?.isConnected) return;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation?.();
            const currentIndex = Math.max(0, entry.inputs.findIndex(input => input.checked));
            const nextInput = entry.inputs[(currentIndex + 1) % entry.inputs.length];
            activateChannelDialInput(root, entry, nextInput);
        };
        entry.onClick = cycle;
        entry.onKeyDown = event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            cycle(event);
        };
        candidate.host.addEventListener('click', entry.onClick, true);
        candidate.host.addEventListener('keydown', entry.onKeyDown, true);
        candidate.host.setAttribute('role', 'button');
        candidate.host.setAttribute('tabindex', '0');
        candidate.host.setAttribute('aria-label', `频道旋钮：点击切换，共 ${candidate.inputs.length} 个频道`);
        candidate.host.setAttribute(CHANNEL_DIAL_CYCLE_HOST_ATTR, 'true');
        for (const label of candidate.labels) {
            label.style.setProperty('pointer-events', 'none', 'important');
            label.setAttribute(CHANNEL_DIAL_CYCLE_LABEL_ATTR, 'true');
        }
        state.entries.push(entry);
    }
    channelDialCycleRescueStates.set(root, state);
    root.setAttribute(CHANNEL_DIAL_CYCLE_RESCUE_ATTR, 'true');
    root.setAttribute(CHANNEL_DIAL_CYCLE_COUNT_ATTR, String(state.entries.length));
    return state.entries.length;
}


function getLocalContainerTargetsForCheckedRule(input, targetSelector) {
    if (!input || !targetSelector) return [];
    const wrappingLabel = input.closest?.('label') || null;
    // An invalid nested <label> can make closest('label') point at another control's
    // outer label. Never use that foreign label as the local scope, otherwise a class-local
    // :checked rule can be sprayed across several sibling cards and leave all panels open.
    const wrappingFor = String(wrappingLabel?.getAttribute?.('for') || '').trim();
    const wrappingBelongsToInput = !!wrappingLabel
        && (!wrappingFor || (!!input.id && wrappingFor === String(input.id)));
    const scope = wrappingBelongsToInput ? wrappingLabel : input.parentElement;
    if (!scope?.querySelectorAll) return [];
    try {
        const targets = [...scope.querySelectorAll(targetSelector)].filter(target => target !== input);
        // class 型 :checked 规则若结构写错，只允许在当前 label/局部容器内补救，
        // 绝不把同类目标扩散到其他事件节点。
        if (!targets.length || targets.length > 8) return [];
        return targets;
    } catch {
        return [];
    }

}


function getFollowingLocalContainerTargetsForCheckedRule(input, targetSelector) {
    if (!input || !targetSelector) return [];
    const wrappingLabel = input.closest?.('label') || null;
    const wrappingFor = String(wrappingLabel?.getAttribute?.('for') || '').trim();
    const wrappingBelongsToInput = !!wrappingLabel
        && (!wrappingFor || (!!input.id && wrappingFor === String(input.id)));
    const scope = wrappingBelongsToInput ? wrappingLabel : input.parentElement;
    if (!scope) return [];

    // `A:checked ~ B` can only ever address B after A. The old malformed-structure fallback
    // queried the whole local container and could therefore “repair” a B placed before A,
    // making an upper block react to a lower control. Keep the useful nested fallback, but
    // restrict it to following sibling regions (and their descendants) only.
    const targets = [];
    let sibling = input.nextElementSibling;
    while (sibling && targets.length <= 8) {
        try {
            if (sibling.matches?.(targetSelector)) targets.push(sibling);
            for (const target of sibling.querySelectorAll?.(targetSelector) || []) {
                if (!targets.includes(target)) targets.push(target);
                if (targets.length > 8) break;
            }
        } catch {
            return [];
        }
        sibling = sibling.nextElementSibling;
    }
    if (!targets.length || targets.length > 8) return [];
    return targets;
}


export function applyCheckedRuleTextFallback(toto, input) {
    if (!toto || !input) return 0;
    restoreInteractionInlineOverrides(input);
    if (!input.checked) return 0;

    const records = [];
    const pseudoEntries = [];
    const routeKinds = new Set();
    const revealCandidates = new Map();
    for (const rule of parseCheckedRulesFromText(toto, input)) {
        const targets = resolveTargetsForCheckedRule(toto, input, rule);
        for (const target of targets) {
            routeKinds.add(rule.source);
            if (rule.pseudoElement) {
                pseudoEntries.push({ target, pseudoElement: rule.pseudoElement, styleMap: rule.styleMap });
                continue;
            }
            rememberCheckedRevealCandidate(revealCandidates, target, rule.styleMap);
            for (const [property, value] of rule.styleMap) {
                records.push({
                    element: target,
                    property,
                    value: target.style.getPropertyValue(property),
                    priority: target.style.getPropertyPriority(property),
                });
                target.style.setProperty(property, value, 'important');
            }
        }
    }
    const pseudoDeclarationCount = installInteractionPseudoOverrides(toto, input, pseudoEntries);
    if (records.length) {
        interactionInlineOverrideStates.set(input, records);
        applyExpandedOpacityResidualRescue(input, revealCandidates, records);
        applyNestedCheckedContentResidualRescue(toto, input, revealCandidates, records);
        scheduleExpandedOpacityResidualRescue(toto, input, revealCandidates, records);
    }
    if (records.length || pseudoDeclarationCount) {
        input.setAttribute(CHECKED_TEXT_RULE_RESCUE_ATTR, [...routeKinds].join(','));
    }
    return records.length + pseudoDeclarationCount;
}


export function restoreInteractionInlineOverrides(input) {
    restoreInteractionPseudoOverrides(input);
    const records = interactionInlineOverrideStates.get(input);
    if (!records) {
        input?.removeAttribute?.(EXPANDED_OPACITY_RESCUE_ATTR);
        return;
    }
    for (const record of records) {
        const { element, property, value, priority } = record;
        if (!element?.style) continue;
        if (value) element.style.setProperty(property, value, priority || '');
        else element.style.removeProperty(property);
    }
    interactionInlineOverrideStates.delete(input);
    input?.removeAttribute?.(EXPANDED_OPACITY_RESCUE_ATTR);
    input?.removeAttribute?.(NESTED_CHECKED_CONTENT_RESCUE_ATTR);
}


export function applyCheckedRuleInlineFallback(toto, input) {
    if (!toto?.querySelectorAll || !input?.id) return;

    restoreInteractionInlineOverrides(input);
    if (!input.checked) return;

    const escapedId = typeof CSS !== 'undefined' && CSS.escape
        ? CSS.escape(input.id)
        : String(input.id).replace(/([^a-zA-Z0-9_-])/g, '\\$1');
    const idNeedle = `#${escapedId}:checked`;
    const records = [];
    const revealCandidates = new Map();

    const applyRule = (selectorText, style) => {
        if (!selectorText || !style || !selectorText.includes(idNeedle)) return;
        let targets = [];
        try {
            targets = [...toto.querySelectorAll(selectorText)];
        } catch {
            return;
        }
        const styleMap = [];
        for (const property of [...style]) {
            const value = style.getPropertyValue(property);
            if (value) styleMap.push([property, value]);
        }
        for (const target of targets) {
            rememberCheckedRevealCandidate(revealCandidates, target, styleMap);
            for (const [property, value] of styleMap) {
                records.push({
                    element: target,
                    property,
                    value: target.style.getPropertyValue(property),
                    priority: target.style.getPropertyPriority(property),
                });
                target.style.setProperty(property, value, 'important');
            }
        }
    };

    for (const styleEl of getRabbitMirrorLocalStyleElements(toto)) {
        try {
            const visitRules = (rules) => {
                for (const rule of [...(rules || [])]) {
                    if (rule?.cssRules) visitRules(rule.cssRules);
                    if (rule?.selectorText && rule?.style) applyRule(rule.selectorText, rule.style);
                }
            };
            visitRules(styleEl.sheet?.cssRules);
        } catch {
            // CSSOM 不可读时，文本级 !important 修复仍然保留。
        }
    }

    if (records.length) {
        interactionInlineOverrideStates.set(input, records);
        applyExpandedOpacityResidualRescue(input, revealCandidates, records);
        applyNestedCheckedContentResidualRescue(toto, input, revealCandidates, records);
        scheduleExpandedOpacityResidualRescue(toto, input, revealCandidates, records);
    }
}





