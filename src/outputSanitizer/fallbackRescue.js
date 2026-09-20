// Split from outputSanitizer.js — fallbackRescue.

import {
    FEEDBACK_CAT_ATTR,
    MAINTENANCE_RABBIT_ATTR,
    TOOL_ENTRY_HOST_ATTR,
    escapeRegExp,
    getRabbitMirrorLocalStyleElements,
} from './runtime.js?rmv=1.5.74';
import {
    CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR,
    CROSS_PARENT_CHECKED_VERIFIED_ATTR,
    DECORATIVE_OVERLAY_PASS_THROUGH_ATTR,
    DETACHED_CHECKED_HAS_CONTROL_ATTR,
    DETACHED_CHECKED_HAS_RULE_COUNT_ATTR,
    EXCLUSIVE_STACKED_STATE_CONTROL_ATTR,
    FOCUS_WITHIN_PERSISTENT_ACTIVE_ATTR,
    FOCUS_WITHIN_PERSISTENT_CONTROL_ATTR,
    FOCUS_WITHIN_PERSISTENT_HOST_ATTR,
    FOCUS_WITHIN_PERSISTENT_ROOT_ATTR,
    FOCUS_WITHIN_PERSISTENT_ROUTE,
    FOCUS_WITHIN_PERSISTENT_STYLE_ATTR,
    INDEPENDENT_NATIVE_CHECKED_RESTORE_ATTR,
    LABELED_CHECKED_VERIFY_CONTROL_ATTR,
    LABELED_CHECKED_VERIFY_LAST_ATTR,
    LABELED_CHECKED_VERIFY_ROOT_ATTR,
    LABELED_CHECKED_VERIFY_TARGET_ATTR,
    MARKDOWN_CSS_COMMENT_RESCUE_ATTR,
    MOBILE_INLINE_ANNOTATION_COUNT_ATTR,
    MOBILE_INLINE_ANNOTATION_HOST_ATTR,
    MOBILE_INLINE_ANNOTATION_MIRROR_ATTR,
    MOBILE_INLINE_ANNOTATION_ORIGINAL_ATTR,
    MOBILE_INLINE_ANNOTATION_RESCUE_ATTR,
    MOBILE_INLINE_ANNOTATION_STYLE_ATTR,
    MOBILE_INLINE_ANNOTATION_VISIBLE_ATTR,
    NESTED_DETAILS_DEFERRED_BINDING_PROP,
    NESTED_DETAILS_DEFERRED_BINDING_VERSION,
    NESTED_DETAILS_POPUP_CONTENT_ATTR,
    NESTED_DETAILS_POPUP_COUNT_ATTR,
    NESTED_DETAILS_POPUP_HOST_ATTR,
    NESTED_DETAILS_POPUP_RESCUE_ATTR,
    NESTED_DETAILS_POPUP_STYLE_ATTR,
    NESTED_DETAILS_REPLACEMENT_ATTR,
    NESTED_DETAILS_REPLACEMENT_BINDING_PROP,
    NESTED_DETAILS_REPLACEMENT_BINDING_VERSION,
    NESTED_DETAILS_REPLACEMENT_BOUND_ATTR,
    NESTED_DETAILS_REPLACEMENT_HOST_ATTR,
    NESTED_DETAILS_REPLACEMENT_STYLE_ATTR,
    PAIRED_CHECKED_STATE_CONTROL_ATTR,
    RENDERED_INPUT_ROUTE_ATTR,
    REVERSIBLE_CHECKED_RESULT_RESCUE_ATTR,
    REVERSIBLE_CHECKED_RESULT_ROOT_ATTR,
    REVERSIBLE_CHECKED_RESULT_TARGET_ATTR,
    TARGET_ACTIVE_ATTR,
    TARGET_RESCUE_STYLE_ATTR,
    UNLABELED_CHECKED_CONTROL_RESCUE_ATTR,
    UNLABELED_CHECKED_HOST_RESCUE_ATTR,
    WEBKIT_3D_FLIP_RESCUE_ATTR,
    addImportantToDeclarationBlock,
    applyCheckedRuleInlineFallback,
    applyCheckedRuleTextFallback,
    clearPersistedCheckedInlineArtifacts,
    clearUncheckedRadioCheckedInlineArtifacts,
    crossParentCheckedCandidateFingerprint,
    findCrossParentCheckedRuleFallbackCandidates,
    focusWithinPersistentRescueStates,
    installChannelDialCycleRescue,
    installCheckedHasStateFallback,
    installCrossParentCheckedRuleFallback,
    installDetachedCheckedHasFallback,
    installExclusiveStackedStateRescue,
    installMissingCheckedSubjectClassRescue,
    installPairedCheckedStateRescue,
    interactionLabelFallbackRoots,
    labeledCheckedVerificationStates,
    nestedDetailsDeferredChecks,
    parseCheckedRulesFromText,
    refreshExclusiveStackedStateRescue,
    refreshFocusToCheckedRescue,
    repairMalformedNestedInteractiveLabels,
    resolveTargetsForCheckedRule,
    restoreInteractionInlineOverrides,
    reversibleCheckedResultRescueStates,
    scheduleExclusiveStackedStateRefresh,
    strengthenRabbitMirrorCheckedStateCss,
    syncCrossParentCheckedRuleFallback,
    unlabeledCheckedHostRescueStates,
    webKit3DFlipInlineStates,
    webKit3DFlipRescueStates,
    webKit3DFlipStyleStates,
} from './checkedStateRescue.js?rmv=1.5.74';
import {
    EXISTING_INTERACTIVE_SELECTOR,
    RENDERED_BUTTON_ADJACENT_HIDDEN_RESCUE_ATTR,
    RENDERED_CLICKABLE_ADJACENT_POPUP_RESCUE_ATTR,
    RENDERED_CSS_STATE_SIBLING_RESCUE_ATTR,
    applyRenderedLabelInternalHiddenEntries,
    claimRenderedInputRoute,
    dispatchRescuedInputState,
    getRenderedInputRoute,
    getRenderedStyleSnapshot,
    installRenderedAdjacentHiddenGroupRescue,
    installRenderedButtonAdjacentHiddenRescue,
    installRenderedCheckedIdTargetRescue,
    installRenderedClickableAdjacentHiddenRescue,
    installRenderedClickableAdjacentPopupRescue,
    installRenderedContainerInternalRevealRescue,
    installRenderedCssStateSiblingRescue,
    installRenderedLabelAdjacentResultRescue,
    installRenderedLabelInternalHiddenRescue,
    installRenderedListDetailRescue,
    installRenderedMaskRevealRescue,
    installRenderedStateLayerRescue,
    installReversibleTargetClose,
    isCollapsedDimensionValue,
    normalizeStylePropertyName,
    parseCssStateSiblingAssignments,
} from './renderedStateRescue.js?rmv=1.5.74';
import {
    chooseMatchingRawRabbitMirrorRoot,
    detectInteractionCapabilities,
    getRawAssistantMessageForRenderedRoot,
    installPassportDocumentRescue,
    installPseudoInteractionRescue,
    installRawMessageCheckedChangeProgramRescue,
    installRawMessageDirectIdClickProgramRescue,
    installRawMessageHoverPseudoRescue,
    installRawMessageNamedFunctionClassRescue,
    installRawMessageRadioResetProgramRescue,
    installRawMessageScriptTimelineRescue,
    installRawMessageSelfMutationRescue,
    preparePseudoTrigger,
    shouldIgnorePseudoToggleEvent,
} from './scriptedInteractionRescue.js?rmv=1.5.74';
import {
    FEEDBACK_CAT_MENU_ATTR,
    FILL_IN_CHOICE_BLANK_ATTR,
    INTERACTION_DIAGNOSTIC_PANEL_ATTR,
    MAINTENANCE_MENU_ATTR,
    MOBILE_LAYOUT_BREAKPOINT_PX,
    diagnosticComputedStyle,
    diagnosticElementName,
    diagnosticFindClippingAncestor,
    maintenanceSafeComputedStyle,
    mobileInlineAnnotationRescueStates,
} from './diagnostics.js?rmv=1.5.74';
import { installStaticChoiceSelectionFallback } from './choiceRescue.js?rmv=1.5.74';
import {
    checkedDeclarationCreatesContentReveal,
    checkedTargetCarriesResultContent,
    pseudoStateTargetSelector,
} from './maintenanceInspect.js?rmv=1.5.74';
import { splitCssSelectorList } from './markup.js?rmv=1.5.74';
import { maintenanceMobileLayoutLengthPx, maintenanceMobileLayoutResolveCheckedTargets } from './layoutRescue.js?rmv=1.5.74';

const NESTED_DETAILS_FALLBACK_HANDLER_PROP = '__rabbitMirrorNestedDetailsFallbackHandler';

const NESTED_DETAILS_FALLBACK_HANDLER_VERSION = '1.4.12';


const REVERSIBLE_RADIO_GROUP_ATTR = 'data-rabbit-mirror-reversible-radio-group';

export const REVERSIBLE_RADIO_ROOT_ATTR = 'data-rabbit-mirror-reversible-radio-count';

export const REVERSIBLE_RADIO_LAST_ATTR = 'data-rabbit-mirror-reversible-radio-last';

export const REVERSIBLE_RADIO_BASELINE_ATTR = 'data-rm-reversible-radio-initial-checked';

const reversibleRadioGroupStates = new WeakMap();


let localPanelLayoutSequence = 0;

const localPanelLayoutScopes = new WeakMap();


const touchHoverRescueStates = new WeakMap();

export const TOUCH_HOVER_ATTR = 'data-rm-touch-hover';

export const TOUCH_HOVER_READY_ATTR = 'data-rm-touch-hover-ready';

export const TOUCH_HOVER_STYLE_ATTR = 'data-rabbit-mirror-touch-hover-rescue';


const MAINTENANCE_CHECKED_SANDBOX_ATTR = 'data-rabbit-mirror-maintenance-checked-sandbox';


let mobileInlineAnnotationCounter = 0;

function collectTargetRulesFromCss(cssText) {
    const rules = [];
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    let match;
    while ((match = blockRe.exec(String(cssText || '')))) {
        const selectorText = String(match[1] || '').trim();
        if (!selectorText || selectorText.startsWith('@') || !/:target\b/i.test(selectorText)) continue;
        const declarations = addImportantToDeclarationBlock(String(match[2] || ''));
        if (!declarations.trim()) continue;
        const selectors = selectorText.split(',')
            .map(value => value.trim())
            .filter(Boolean)
            .map(selector => selector.replace(/:target\b/gi, `[${TARGET_ACTIVE_ATTR}="true"]`));
        if (selectors.length) rules.push(`${selectors.join(', ')} {${declarations}}`);
    }
    return rules.join('\n');
}


function refreshTargetRescue(root) {
    if (!root?.querySelectorAll) return;
    let combinedCss = '';
    getRabbitMirrorLocalStyleElements(root).filter(styleEl => !styleEl.hasAttribute(TARGET_RESCUE_STYLE_ATTR)).forEach(styleEl => {
        const parsed = collectTargetRulesFromCss(styleEl.textContent || '');
        if (parsed) combinedCss += `${parsed}\n`;
    });
    let rescueStyle = root.querySelector(`style[${TARGET_RESCUE_STYLE_ATTR}]`);
    if (combinedCss.trim()) {
        if (!rescueStyle) {
            rescueStyle = document.createElement('style');
            rescueStyle.setAttribute(TARGET_RESCUE_STYLE_ATTR, 'true');
            root.appendChild(rescueStyle);
        }
        const nextCss = combinedCss.trim();
        if (rescueStyle.textContent !== nextCss) rescueStyle.textContent = nextCss;
    } else if (rescueStyle) {
        rescueStyle.remove();
    }

    if (root.dataset.rabbitMirrorTargetFallback === 'true') return;
    root.addEventListener('click', event => {
        const anchor = event.target?.closest?.('a[href^="#"]');
        if (!anchor || !root.contains(anchor)) return;
        const rawId = String(anchor.getAttribute('href') || '').slice(1);
        if (!rawId) return;
        let target = null;
        try {
            target = [...root.querySelectorAll('[id]')].find(el => el.id === decodeURIComponent(rawId));
        } catch {
            target = [...root.querySelectorAll('[id]')].find(el => el.id === rawId);
        }
        if (!target) return;
        event.preventDefault();
        root.querySelectorAll(`[${TARGET_ACTIVE_ATTR}="true"]`).forEach(el => {
            if (el !== target) el.removeAttribute(TARGET_ACTIVE_ATTR);
        });
        const active = target.getAttribute(TARGET_ACTIVE_ATTR) === 'true';
        if (active) target.removeAttribute(TARGET_ACTIVE_ATTR);
        else target.setAttribute(TARGET_ACTIVE_ATTR, 'true');
    }, true);
    root.dataset.rabbitMirrorTargetFallback = 'true';
}


function installNestedDetailsFallback(root) {
    if (!root?.querySelectorAll || !root?.addEventListener) return;
    const existing = root[NESTED_DETAILS_FALLBACK_HANDLER_PROP];
    if (existing?.version === NESTED_DETAILS_FALLBACK_HANDLER_VERSION && typeof existing?.handler === 'function') return;
    if (existing?.handler) {
        try { root.removeEventListener?.('click', existing.handler, true); } catch {}
    }
    const outerDetails = root.matches?.('details') ? root : root.querySelector(':scope > details');
    const handler = event => {
        const summary = event.target?.closest?.('summary');
        const details = summary?.parentElement;
        if (!summary || !details || details.tagName !== 'DETAILS' || details === outerDetails || !root.contains(details)) return;
        // 仅当宿主没有在本次点击中改变 open 状态时才兜底，避免双重切换。
        const before = details.open;
        setTimeout(() => {
            if (details.isConnected && details.open === before) details.open = !before;
        }, 0);
    };
    root.addEventListener('click', handler, true);
    try {
        Object.defineProperty(root, NESTED_DETAILS_FALLBACK_HANDLER_PROP, {
            configurable: true,
            writable: true,
            value: { version: NESTED_DETAILS_FALLBACK_HANDLER_VERSION, handler },
        });
    } catch {
        root[NESTED_DETAILS_FALLBACK_HANDLER_PROP] = { version: NESTED_DETAILS_FALLBACK_HANDLER_VERSION, handler };
    }
    // data 属性只供诊断，不再作为“监听器仍存活”的证据；clone/序列化不会保留 JS 监听器。
    root.dataset.rabbitMirrorDetailsFallback = 'true';
}


function directReadableDetailsChildren(details, summary) {
    return [...(details?.children || [])].filter(child => {
        if (child === summary) return false;
        const tag = String(child.tagName || '').toLowerCase();
        if (['style', 'script', 'template', 'noscript'].includes(tag)) return false;
        return String(child.textContent || '').replace(/\s+/g, ' ').trim().length > 0;
    });
}


function isFullHeightNestedDetailsCandidate(details, summary) {
    if (!details || !summary || details.parentElement == null) return false;
    const contentChildren = directReadableDetailsChildren(details, summary);
    if (!contentChildren.length) return false;

    const parent = details.parentElement;
    let parentStyle = null;
    let detailsStyle = null;
    let summaryStyle = null;
    try {
        parentStyle = globalThis.getComputedStyle?.(parent) || null;
        detailsStyle = globalThis.getComputedStyle?.(details) || null;
        summaryStyle = globalThis.getComputedStyle?.(summary) || null;
    } catch {
        // Inline declarations below are enough for a conservative fallback.
    }

    const parentOverflow = `${parent.style?.overflow || ''} ${parentStyle?.overflow || ''} ${parentStyle?.overflowY || ''}`.toLowerCase();
    const clippedParent = /hidden|clip/.test(parentOverflow);
    if (!clippedParent) return false;

    const summaryInlineHeight = String(summary.style?.height || '').trim().toLowerCase();
    const detailsInlineHeight = String(details.style?.height || '').trim().toLowerCase();
    const summaryComputedHeight = String(summaryStyle?.height || '').trim().toLowerCase();
    const detailsComputedHeight = String(detailsStyle?.height || '').trim().toLowerCase();
    const summaryExplicitFull = summaryInlineHeight === '100%' || summaryComputedHeight === '100%';
    const detailsExplicitFull = detailsInlineHeight === '100%' || detailsComputedHeight === '100%';

    let geometryFull = false;
    try {
        const parentRect = parent.getBoundingClientRect?.();
        const summaryRect = summary.getBoundingClientRect?.();
        if (parentRect?.height > 24 && summaryRect?.height > 0) {
            geometryFull = summaryRect.height >= parentRect.height * 0.72;
        }
    } catch {
        // ignore geometry failures in older WebViews
    }

    const fullOverlayContent = contentChildren.some(child => {
        const inline = String(child.getAttribute?.('style') || '').toLowerCase();
        let childStyle = null;
        try { childStyle = globalThis.getComputedStyle?.(child) || null; } catch {}
        const position = String(child.style?.position || childStyle?.position || '').toLowerCase();
        if (!/^(?:absolute|fixed)$/.test(position)) return false;
        const top = String(child.style?.top || childStyle?.top || '').trim().toLowerCase();
        const left = String(child.style?.left || childStyle?.left || '').trim().toLowerCase();
        const width = String(child.style?.width || childStyle?.width || '').trim().toLowerCase();
        const height = String(child.style?.height || childStyle?.height || '').trim().toLowerCase();
        const insetZero = /(?:^|;)\s*inset\s*:\s*0(?:px)?(?:\s*;|$)/.test(inline);
        const anchoredTopLeft = /^(?:0|0px)$/.test(top) && /^(?:0|0px)$/.test(left);
        const fillsWidth = width === '100%' || /(?:^|;)\s*(?:right\s*:\s*0(?:px)?|width\s*:\s*100%)\s*(?:;|$)/.test(inline);
        const fillsHeight = height === '100%' || /(?:^|;)\s*(?:bottom\s*:\s*0(?:px)?|height\s*:\s*100%)\s*(?:;|$)/.test(inline);
        return insetZero || (anchoredTopLeft && fillsWidth && fillsHeight);
    });

    return summaryExplicitFull || detailsExplicitFull || geometryFull || fullOverlayContent;
}


function ensureNestedDetailsReplacementStyle(root) {
    if (!root?.querySelector) return null;
    let style = root.querySelector(`style[${NESTED_DETAILS_REPLACEMENT_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(NESTED_DETAILS_REPLACEMENT_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `
[${NESTED_DETAILS_REPLACEMENT_HOST_ATTR}="true"] {
  height: auto !important;
  min-height: var(--rm-nested-details-original-height, 0px) !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}
[${NESTED_DETAILS_REPLACEMENT_ATTR}="true"] {
  width: 100% !important;
  height: auto !important;
  min-height: 100% !important;
  box-sizing: border-box !important;
}
[${NESTED_DETAILS_REPLACEMENT_ATTR}="true"][open] {
  overflow: auto !important;
  overscroll-behavior: contain !important;
}
[${NESTED_DETAILS_REPLACEMENT_ATTR}="true"][open] > summary {
  display: none !important;
  height: auto !important;
  min-height: 0 !important;
}
[${NESTED_DETAILS_REPLACEMENT_ATTR}="true"][open] > :not(summary):not(style):not(script):not(template) {
  width: 100% !important;
  min-height: 100% !important;
  box-sizing: border-box !important;
}
`;
    return style;
}


function installNestedDetailsReplacementForDetails(root, details, outerDetails = null) {
    if (!root?.querySelectorAll || !details || details === outerDetails) return 0;
    const summary = details.querySelector?.(':scope > summary');
    if (!summary) return 0;

    // Historical mirrors that were already repaired persist the marker in HTML, while
    // their live JS listeners are lost across clone/cache restores. Rehydrate those
    // markers without re-reading layout. Only an unmarked details needs the expensive
    // candidate test (computed style + geometry).
    const alreadyPatched = details.getAttribute(NESTED_DETAILS_REPLACEMENT_ATTR) === 'true';
    if (!alreadyPatched && !isFullHeightNestedDetailsCandidate(details, summary)) return 0;

    let patched = 0;
    if (!alreadyPatched) {
        details.setAttribute(NESTED_DETAILS_REPLACEMENT_ATTR, 'true');
        const host = details.parentElement;
        if (host) {
            let originalHeight = 0;
            try { originalHeight = Math.round(host.getBoundingClientRect?.().height || 0); } catch {}
            if (originalHeight > 0) host.style.setProperty('--rm-nested-details-original-height', `${originalHeight}px`);
            host.setAttribute(NESTED_DETAILS_REPLACEMENT_HOST_ATTR, 'true');
        }
        patched = 1;
    } else {
        details.parentElement?.setAttribute?.(NESTED_DETAILS_REPLACEMENT_HOST_ATTR, 'true');
    }

    const contentChildren = directReadableDetailsChildren(details, summary);
    const existingBinding = details[NESTED_DETAILS_REPLACEMENT_BINDING_PROP];
    const sameLiveChildren = existingBinding?.version === NESTED_DETAILS_REPLACEMENT_BINDING_VERSION
        && existingBinding.entries?.length === contentChildren.length
        && existingBinding.entries.every((entry, index) => entry.child === contentChildren[index]);
    if (!sameLiveChildren) {
        for (const entry of existingBinding?.entries || []) {
            try { entry.child?.removeEventListener?.('click', entry.onClick, false); } catch {}
            try { entry.child?.removeEventListener?.('keydown', entry.onKeydown, false); } catch {}
        }
        const entries = [];
        for (const child of contentChildren) {
            const onClick = event => {
                if (!details.open) return;
                const interactive = event.target?.closest?.('a, button, input, label, select, textarea, summary, [role="button"], [contenteditable="true"]');
                if (interactive && interactive !== child) return;
                details.open = false;
            };
            const onKeydown = event => {
                if (!details.open || (event.key !== 'Enter' && event.key !== ' ')) return;
                event.preventDefault();
                details.open = false;
            };
            child.addEventListener('click', onClick, false);
            child.addEventListener('keydown', onKeydown, false);
            entries.push({ child, onClick, onKeydown });
            if (!child.hasAttribute('tabindex')) child.setAttribute('tabindex', '0');
            if (!child.hasAttribute('role')) child.setAttribute('role', 'button');
            if (!child.getAttribute('aria-label')) child.setAttribute('aria-label', '轻触返回上一面');
        }
        try {
            Object.defineProperty(details, NESTED_DETAILS_REPLACEMENT_BINDING_PROP, {
                configurable: true,
                writable: true,
                value: { version: NESTED_DETAILS_REPLACEMENT_BINDING_VERSION, entries },
            });
        } catch {
            details[NESTED_DETAILS_REPLACEMENT_BINDING_PROP] = { version: NESTED_DETAILS_REPLACEMENT_BINDING_VERSION, entries };
        }
        // 该属性仅供诊断；真正的 live 绑定状态由上面的不可序列化 JS property 判断。
        details.setAttribute(NESTED_DETAILS_REPLACEMENT_BOUND_ATTR, 'true');
    }

    ensureNestedDetailsReplacementStyle(root);
    root.dataset.rabbitMirrorNestedDetailsReplacement = String(root.querySelectorAll(`[${NESTED_DETAILS_REPLACEMENT_ATTR}="true"]`).length);
    return patched;
}


export function installNestedDetailsReplacementContainment(root) {
    if (!root?.querySelectorAll) return 0;
    const outerDetails = root.matches?.('details') ? root : root.querySelector(':scope > details');
    let patched = 0;
    for (const details of root.querySelectorAll('details')) {
        if (details === outerDetails) continue;
        patched += installNestedDetailsReplacementForDetails(root, details, outerDetails);
    }
    return patched;
}


function scheduleNestedDetailsReplacementForDetails(root, details, outerDetails = null) {
    if (!root?.isConnected || !details?.isConnected || !details.open) return false;
    if (nestedDetailsDeferredChecks.has(details)) return true;
    nestedDetailsDeferredChecks.add(details);
    const run = () => {
        nestedDetailsDeferredChecks.delete(details);
        if (!root?.isConnected || !details?.isConnected || !details.open) return;
        try {
            installNestedDetailsReplacementForDetails(root, details, outerDetails);
        } catch (error) {
            console.debug('[RabbitMirror] deferred nested-details containment skipped:', error);
        }
    };
    // The expensive candidate test reads computed styles and geometry. Yield one paint
    // after the disclosure opens so Safari does not pay that layout cost while handling
    // the tap that opened the mirror.
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => setTimeout(run, 0));
    else setTimeout(run, 0);
    return true;
}


export function armNestedDetailsReplacementContainment(root) {
    if (!root?.querySelectorAll) return 0;
    const outerDetails = root.matches?.('details') ? root : root.querySelector(':scope > details');
    let bound = 0;

    for (const details of root.querySelectorAll('details')) {
        if (details === outerDetails) continue;
        const summary = details.querySelector?.(':scope > summary');
        if (!summary) continue;

        // Persisted repair markers can be rehydrated without any layout reads.
        if (details.getAttribute(NESTED_DETAILS_REPLACEMENT_ATTR) === 'true') {
            try { installNestedDetailsReplacementForDetails(root, details, outerDetails); } catch {}
        }

        const existing = details[NESTED_DETAILS_DEFERRED_BINDING_PROP];
        if (existing?.version === NESTED_DETAILS_DEFERRED_BINDING_VERSION && existing.onToggle) continue;
        if (existing?.onToggle) {
            try { details.removeEventListener('toggle', existing.onToggle, false); } catch {}
        }
        const onToggle = () => {
            if (!details.open) return;
            scheduleNestedDetailsReplacementForDetails(root, details, outerDetails);
        };
        details.addEventListener('toggle', onToggle, false);
        try {
            Object.defineProperty(details, NESTED_DETAILS_DEFERRED_BINDING_PROP, {
                configurable: true,
                writable: true,
                value: { version: NESTED_DETAILS_DEFERRED_BINDING_VERSION, onToggle },
            });
        } catch {
            details[NESTED_DETAILS_DEFERRED_BINDING_PROP] = { version: NESTED_DETAILS_DEFERRED_BINDING_VERSION, onToggle };
        }
        bound += 1;
    }

    // A historical mirror may contain a nested details that was already open before the
    // outer RabbitMirror shell was collapsed. Opening the outer shell does not fire a
    // nested toggle, so defer checks for only those already-open children at that moment.
    if (outerDetails) {
        const outerExisting = outerDetails[NESTED_DETAILS_DEFERRED_BINDING_PROP];
        if (!(outerExisting?.version === NESTED_DETAILS_DEFERRED_BINDING_VERSION && outerExisting.outer === true && outerExisting.onToggle)) {
            if (outerExisting?.onToggle) {
                try { outerDetails.removeEventListener('toggle', outerExisting.onToggle, false); } catch {}
            }
            const onOuterToggle = () => {
                if (!outerDetails.open) return;
                for (const details of root.querySelectorAll('details[open]')) {
                    if (details === outerDetails) continue;
                    scheduleNestedDetailsReplacementForDetails(root, details, outerDetails);
                }
            };
            outerDetails.addEventListener('toggle', onOuterToggle, false);
            try {
                Object.defineProperty(outerDetails, NESTED_DETAILS_DEFERRED_BINDING_PROP, {
                    configurable: true,
                    writable: true,
                    value: { version: NESTED_DETAILS_DEFERRED_BINDING_VERSION, outer: true, onToggle: onOuterToggle },
                });
            } catch {
                outerDetails[NESTED_DETAILS_DEFERRED_BINDING_PROP] = { version: NESTED_DETAILS_DEFERRED_BINDING_VERSION, outer: true, onToggle: onOuterToggle };
            }
            bound += 1;
        }
    }
    return bound;
}


function findNestedDetailsPopupClippingAncestor(element, root) {
    let current = element?.parentElement || null;
    for (let depth = 0; current && depth < 10; depth += 1, current = current.parentElement) {
        const style = maintenanceSafeComputedStyle(current);
        const overflow = `${style?.overflow || ''} ${style?.overflowX || ''} ${style?.overflowY || ''}`.toLowerCase();
        if (/(?:hidden|clip)/.test(overflow)) return current;
        if (current === root) break;
    }
    return null;
}


function nestedDetailsPopupOffsetLikelyOutside(content) {
    const top = String(content?.style?.top || '').trim().toLowerCase();
    if (/^(?:10[1-9]|1[1-9]\d|[2-9]\d{2,})(?:\.\d+)?%$/.test(top)) return true;
    const bottom = String(content?.style?.bottom || '').trim().toLowerCase();
    if (/^-(?:\d+(?:\.\d+)?)(?:px|rem|em|%)$/.test(bottom)) return true;
    return false;
}


export function findNestedDetailsPopupClippingCandidates(root, { requireOpen = false } = {}) {
    if (!root?.querySelectorAll) return [];
    const outerDetails = root.matches?.('details') ? root : root.querySelector(':scope > details');
    const candidates = [];
    const seen = new Set();

    for (const details of root.querySelectorAll('details')) {
        if (details === outerDetails || details.hasAttribute(NESTED_DETAILS_REPLACEMENT_ATTR)) continue;
        if (requireOpen && !details.open) continue;
        const summary = details.querySelector?.(':scope > summary');
        if (!summary) continue;
        for (const content of directReadableDetailsChildren(details, summary)) {
            if (seen.has(content)) continue;
            const text = String(content.textContent || '').replace(/\s+/g, ' ').trim();
            if (text.length < 2) continue;
            const style = maintenanceSafeComputedStyle(content);
            const position = String(style?.position || content.style?.position || '').toLowerCase();
            if (position !== 'absolute' && position !== 'fixed') continue;
            const clippingAncestor = findNestedDetailsPopupClippingAncestor(content, root);
            if (!clippingAncestor) continue;

            let outside = nestedDetailsPopupOffsetLikelyOutside(content);
            try {
                const contentRect = content.getBoundingClientRect?.();
                const clipRect = clippingAncestor.getBoundingClientRect?.();
                if (contentRect && clipRect) {
                    outside = outside
                        || contentRect.left < clipRect.left - 2
                        || contentRect.right > clipRect.right + 2
                        || contentRect.top < clipRect.top - 2
                        || contentRect.bottom > clipRect.bottom + 2;
                }
            } catch {
                // Inline top/left evidence above remains available in older WebViews.
            }
            if (!outside) continue;
            seen.add(content);
            candidates.push({ details, summary, content, clippingAncestor });
        }
    }
    return candidates;
}


function ensureNestedDetailsPopupRescueStyle(root) {
    if (!root?.querySelector) return null;
    let style = root.querySelector(`style[${NESTED_DETAILS_POPUP_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(NESTED_DETAILS_POPUP_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `
[${NESTED_DETAILS_POPUP_HOST_ATTR}="true"] {
  align-items: stretch !important;
  min-width: 0 !important;
}
[${NESTED_DETAILS_POPUP_RESCUE_ATTR}="true"] {
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
[${NESTED_DETAILS_POPUP_RESCUE_ATTR}="true"][open] > [${NESTED_DETAILS_POPUP_CONTENT_ATTR}="true"] {
  position: relative !important;
  inset: auto !important;
  top: auto !important;
  right: auto !important;
  bottom: auto !important;
  left: auto !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-top: 8px !important;
  box-sizing: border-box !important;
}
@media (max-width: 640px) {
  [${NESTED_DETAILS_POPUP_HOST_ATTR}="true"] {
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    align-items: stretch !important;
  }
  [${NESTED_DETAILS_POPUP_RESCUE_ATTR}="true"] {
    width: 100% !important;
    flex: 1 1 auto !important;
  }
}
`;
    return style;
}


export function repairNestedDetailsPopupClipping(root, { requireOpen = false } = {}) {
    if (!root?.querySelectorAll) return 0;
    const candidates = findNestedDetailsPopupClippingCandidates(root, { requireOpen });
    let repaired = 0;
    for (const { details, content } of candidates) {
        if (!details?.isConnected || !content?.isConnected) continue;
        // 自动安全巡逻只允许处理用户已经主动展开的内层 details。折叠态没有可靠
        // 几何，也不应该为了“维修”提前改变第二层内容的呈现。手动维修保持原行为。
        if (requireOpen && !details.open) continue;
        details.setAttribute(NESTED_DETAILS_POPUP_RESCUE_ATTR, 'true');
        content.setAttribute(NESTED_DETAILS_POPUP_CONTENT_ATTR, 'true');
        details.parentElement?.setAttribute?.(NESTED_DETAILS_POPUP_HOST_ATTR, 'true');
        repaired += 1;
    }
    if (repaired > 0 || root.querySelector?.(`[${NESTED_DETAILS_POPUP_RESCUE_ATTR}="true"]`)) {
        ensureNestedDetailsPopupRescueStyle(root);
        root.setAttribute(
            NESTED_DETAILS_POPUP_COUNT_ATTR,
            String(root.querySelectorAll(`[${NESTED_DETAILS_POPUP_RESCUE_ATTR}="true"]`).length),
        );
    }
    return repaired;
}



function mobileInlineAnnotationMeaningfulText(element) {
    return String(element?.textContent || '').replace(/\s+/g, ' ').trim().length >= 12;
}


function mobileInlineAnnotationCheckedTargets(root, input) {
    const targets = new Set();
    for (const rule of parseCheckedRulesFromText(root, input)) {
        for (const target of maintenanceMobileLayoutResolveCheckedTargets(root, input, rule)) {
            if (target && target !== input) targets.add(target);
        }
    }
    return targets;
}


export function findMobileInlineAnnotationCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const viewportWidth = Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
    if (viewportWidth > MOBILE_LAYOUT_BREAKPOINT_PX + 40) return [];
    const result = [];
    const seen = new Set();

    for (const host of root.querySelectorAll('label')) {
        if (host.hasAttribute(MOBILE_INLINE_ANNOTATION_HOST_ATTR)) continue;
        const input = host.querySelector?.(':scope > input[type="checkbox"], :scope > input[type="radio"]');
        if (!input || input.disabled) continue;
        const hostStyle = maintenanceSafeComputedStyle(host);
        const hostDisplay = String(hostStyle?.display || '').toLowerCase();
        if (hostDisplay && !/^(?:inline|inline-block|inline-flex|inline-grid)$/.test(hostDisplay)) continue;

        const routedTargets = mobileInlineAnnotationCheckedTargets(root, input);
        if (!routedTargets.size) continue;
        const children = [...(host.children || [])];
        for (const content of children) {
            if (content === input || seen.has(content) || content.hasAttribute(MOBILE_INLINE_ANNOTATION_ORIGINAL_ATTR)) continue;
            if (!routedTargets.has(content) || !mobileInlineAnnotationMeaningfulText(content)) continue;
            const style = maintenanceSafeComputedStyle(content);
            const position = String(style?.position || content.style?.position || '').toLowerCase();
            if (position !== 'absolute' && position !== 'fixed') continue;
            const inlineStyle = String(content.getAttribute?.('style') || '').toLowerCase();
            const width = maintenanceMobileLayoutLengthPx(style?.width || content.style?.width, Number(root.clientWidth || 0));
            const fixedWidth = /(?:^|;)\s*(?:width|min-width)\s*:\s*\d+(?:\.\d+)?(?:px|rem|em|vw)\b/.test(inlineStyle) || width >= 140;
            const overflowAncestor = diagnosticFindClippingAncestor(content, root);
            if (!fixedWidth && !overflowAncestor) continue;
            seen.add(content);
            result.push({ host, input, content });
        }
    }
    return result;
}


function removeDuplicateIdsFromMobileAnnotationMirror(mirror) {
    if (!mirror?.querySelectorAll) return;
    if (mirror.id) mirror.removeAttribute('id');
    mirror.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    mirror.querySelectorAll('input,button,select,textarea,a[href],label[for]').forEach(element => {
        element.removeAttribute?.('for');
        element.removeAttribute?.('href');
        element.setAttribute?.('tabindex', '-1');
        element.setAttribute?.('aria-hidden', 'true');
    });
}


function ensureMobileInlineAnnotationRescueStyle(root) {
    if (!root?.querySelector) return null;
    let style = root.querySelector(`style[${MOBILE_INLINE_ANNOTATION_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(MOBILE_INLINE_ANNOTATION_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `
[${MOBILE_INLINE_ANNOTATION_MIRROR_ATTR}="true"] { display: none !important; }
@media (max-width: ${MOBILE_LAYOUT_BREAKPOINT_PX}px) {
  [${MOBILE_INLINE_ANNOTATION_ORIGINAL_ATTR}="true"] { display: none !important; }
  [${MOBILE_INLINE_ANNOTATION_MIRROR_ATTR}="true"][${MOBILE_INLINE_ANNOTATION_VISIBLE_ATTR}="true"] {
    display: block !important;
    position: relative !important;
    inset: auto !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    float: none !important;
    clear: both !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    height: auto !important;
    max-height: none !important;
    box-sizing: border-box !important;
    margin: 8px 0 12px !important;
    white-space: normal !important;
    writing-mode: horizontal-tb !important;
    text-orientation: mixed !important;
    overflow: visible !important;
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
    z-index: auto !important;
  }
}`;
    return style;
}


function refreshMobileInlineAnnotationRescue(root) {
    const state = mobileInlineAnnotationRescueStates.get(root);
    if (!state) return;
    for (const entry of state.entries || []) {
        if (!entry.input?.isConnected || !entry.mirror?.isConnected) continue;
        const visible = !!entry.input.checked;
        if (visible) entry.mirror.setAttribute(MOBILE_INLINE_ANNOTATION_VISIBLE_ATTR, 'true');
        else entry.mirror.removeAttribute(MOBILE_INLINE_ANNOTATION_VISIBLE_ATTR);
        entry.mirror.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }
}


export function installMobileInlineAnnotationRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    let state = mobileInlineAnnotationRescueStates.get(root);
    if (!state) {
        state = {
            entries: [],
            onStateChange: () => setTimeout(() => refreshMobileInlineAnnotationRescue(root), 0),
        };
        root.addEventListener('input', state.onStateChange, false);
        root.addEventListener('change', state.onStateChange, false);
        mobileInlineAnnotationRescueStates.set(root, state);
    }

    let repaired = 0;
    for (const { host, input, content } of findMobileInlineAnnotationCandidates(root)) {
        if (!host?.isConnected || !input?.isConnected || !content?.isConnected) continue;
        mobileInlineAnnotationCounter += 1;
        const token = `rm-note-${mobileInlineAnnotationCounter.toString(36)}`;
        const mirror = content.cloneNode(true);
        removeDuplicateIdsFromMobileAnnotationMirror(mirror);
        mirror.setAttribute(MOBILE_INLINE_ANNOTATION_MIRROR_ATTR, 'true');
        mirror.setAttribute('data-rm-mobile-inline-annotation-token', token);
        mirror.setAttribute('aria-live', 'polite');
        mirror.setAttribute('aria-hidden', 'true');
        content.setAttribute(MOBILE_INLINE_ANNOTATION_ORIGINAL_ATTR, 'true');
        content.setAttribute('data-rm-mobile-inline-annotation-token', token);
        host.setAttribute(MOBILE_INLINE_ANNOTATION_HOST_ATTR, 'true');
        host.insertAdjacentElement('afterend', mirror);
        state.entries.push({ host, input, content, mirror, token });
        repaired += 1;
    }

    if (repaired > 0 || state.entries.some(entry => entry.mirror?.isConnected)) {
        ensureMobileInlineAnnotationRescueStyle(root);
        refreshMobileInlineAnnotationRescue(root);
        [80, 260, 650].forEach(delay => setTimeout(() => refreshMobileInlineAnnotationRescue(root), delay));
        root.setAttribute(MOBILE_INLINE_ANNOTATION_RESCUE_ATTR, 'true');
        root.setAttribute(
            MOBILE_INLINE_ANNOTATION_COUNT_ATTR,
            String(state.entries.filter(entry => entry.mirror?.isConnected).length),
        );
    }
    return repaired;
}


function repairMarkdownEmphasisInsideCssComments(cssText) {
    let changed = false;
    const repaired = String(cssText || '').replace(
        /\/\*([\s\S]*?)<(em|i)>\s*\/([\s\S]*?)\/\s*<\/\2>([\s\S]*?)\*\//gi,
        (full, before, tagName, rules, after) => {
            if (!/[{}]/.test(rules) || !/[.#:@\[]/.test(rules)) return full;
            changed = true;
            return `/*${before}*/${rules}/*${after}*/`;
        },
    );
    return { changed, repaired };
}


export function repairMarkdownCorruptedCssComments(root) {
    if (!root?.querySelectorAll) return 0;
    let repairedCount = 0;
    for (const style of getRabbitMirrorLocalStyleElements(root)) {
        const current = String(style.textContent || '');
        if (!/<(?:em|i)>\s*\//i.test(current) || !/\/\s*<\/(?:em|i)>/i.test(current)) continue;
        const result = repairMarkdownEmphasisInsideCssComments(current);
        if (!result.changed || result.repaired === current) continue;
        style.textContent = result.repaired;
        style.setAttribute(MARKDOWN_CSS_COMMENT_RESCUE_ATTR, 'true');
        repairedCount += 1;
    }
    if (repairedCount) root.dataset.rabbitMirrorMarkdownCssCommentRescue = String(repairedCount);
    return repairedCount;
}



export function applyCheckedVisualFallback(root, input) {
    // Once an exclusive stacked-state route owns a radio scene, do not let the generic
    // class-local checked fallback re-apply broad sibling styles on top of it. This also
    // covers the inferred baseline/close radio whose raw shared-class CSS can otherwise
    // hide the default panel or reveal multiple focus panels again during delayed verify.
    if (input?.hasAttribute?.(EXCLUSIVE_STACKED_STATE_CONTROL_ATTR)) {
        restoreInteractionInlineOverrides(input);
        refreshExclusiveStackedStateRescue(root);
        scheduleExclusiveStackedStateRefresh(root);
        return;
    }
    const renderedRoute = getRenderedInputRoute(input);
    if (renderedRoute) {
        restoreInteractionInlineOverrides(input);
        return;
    }
    const textRuleCount = applyCheckedRuleTextFallback(root, input);
    if (!textRuleCount) applyCheckedRuleInlineFallback(root, input);
}


function checkedStyleMapHidesTrigger(styleMap) {
    for (const [rawProperty, rawValue] of styleMap || []) {
        const property = String(rawProperty || '').trim().toLowerCase();
        const value = String(rawValue || '').trim().toLowerCase().replace(/\s*!important\s*$/i, '');
        if (property === 'display' && value === 'none') return true;
        if (property === 'visibility' && /^(?:hidden|collapse)$/.test(value)) return true;
        if (property === 'pointer-events' && value === 'none') return true;
        if (property === 'opacity') {
            const opacity = Number.parseFloat(value);
            if (Number.isFinite(opacity) && opacity <= 0.05) return true;
        }
        if (/^(?:width|height|max-width|max-height)$/.test(property) && isCollapsedDimensionValue(value)) return true;
        if (property === 'clip-path' && /^(?:inset\(\s*(?:50%|100%))/i.test(value)) return true;
        if (property === 'transform' && /scale(?:x|y|3d)?\(\s*0(?:\s*[,)]|\))/i.test(value)) return true;
    }
    return false;
}


function checkedStyleMapRevealsResult(root, target, styleMap) {
    if (!checkedTargetCarriesResultContent(target)) return false;
    return (styleMap || []).some(([property, value]) => (
        checkedDeclarationCreatesContentReveal(root, target, property, value)
    ));
}


function associatedLabelsForInput(root, input) {
    if (!root?.querySelectorAll || !input) return [];
    const labels = new Set();
    input.closest?.('label') && labels.add(input.closest('label'));
    for (const label of [...(input.labels || [])]) {
        if (root.contains?.(label)) labels.add(label);
    }
    const id = String(input.id || '');
    if (id) {
        for (const label of root.querySelectorAll('label[for]')) {
            if (String(label.getAttribute('for') || '') === id) labels.add(label);
        }
    }
    return [...labels];
}


function reversibleRadioGroupKey(input) {
    const name = String(input?.getAttribute?.('name') || '').trim();
    if (name) return `name:${name}`;
    const id = String(input?.id || '').trim();
    return id ? `id:${id}` : '';
}


function restoreReversibleRadioBaseline(root, group) {
    if (!root || !group?.radios?.length) return false;
    const changedRadios = [];
    for (const radio of group.radios) {
        if (!radio?.isConnected || !root.contains?.(radio)) continue;
        const shouldCheck = group.baselineChecked.has(radio);
        if (!!radio.checked !== shouldCheck) {
            radio.checked = shouldCheck;
            changedRadios.push(radio);
        }
        if (!shouldCheck) restoreInteractionInlineOverrides(radio);
        radio.setAttribute('aria-pressed', shouldCheck ? 'true' : 'false');
    }
    clearUncheckedRadioCheckedInlineArtifacts(root, group.radios);
    if (changedRadios.length) {
        for (const radio of changedRadios) dispatchRescuedInputState(radio);
        const preferred = group.radios.find(radio => group.baselineChecked.has(radio)) || null;
        if (preferred) applyCheckedVisualFallback(root, preferred);
    }
    root.setAttribute(REVERSIBLE_RADIO_LAST_ATTR, changedRadios.length ? 'restored-baseline' : 'baseline-already-active');
    return true;
}


export function installReversibleRadioGroupFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const radios = [...root.querySelectorAll('input[type="radio"]')].filter(radio => !radio.disabled);
    if (!radios.length) {
        root.removeAttribute?.(REVERSIBLE_RADIO_ROOT_ATTR);
        return 0;
    }

    let state = reversibleRadioGroupStates.get(root);
    if (!state) {
        state = { groups: new Map(), onClick: null };
        reversibleRadioGroupStates.set(root, state);
    }

    const grouped = new Map();
    for (const radio of radios) {
        const key = reversibleRadioGroupKey(radio);
        if (!key) continue;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(radio);
    }

    for (const [key, groupRadios] of grouped) {
        let group = state.groups.get(key);
        const sameNodes = group?.radios?.length === groupRadios.length
            && groupRadios.every((radio, index) => group.radios[index] === radio);
        if (!group || !sameNodes) {
            const baselineChecked = new Set();
            for (const radio of groupRadios) {
                let baseline = radio.getAttribute?.(REVERSIBLE_RADIO_BASELINE_ATTR);
                if (baseline !== 'true' && baseline !== 'false') {
                    baseline = radio.checked ? 'true' : 'false';
                    radio.setAttribute?.(REVERSIBLE_RADIO_BASELINE_ATTR, baseline);
                }
                if (baseline === 'true') baselineChecked.add(radio);
            }
            group = {
                key,
                radios: groupRadios,
                baselineChecked,
            };
            state.groups.set(key, group);
        } else {
            group.radios = groupRadios;
        }
        for (const radio of groupRadios) radio.setAttribute(REVERSIBLE_RADIO_GROUP_ATTR, key);
    }
    for (const key of [...state.groups.keys()]) {
        if (!grouped.has(key)) state.groups.delete(key);
    }

    if (!state.onClick) {
        state.onClick = event => {
            if (root.getAttribute?.(INDEPENDENT_NATIVE_CHECKED_RESTORE_ATTR) === 'true') return;
            const label = event.target?.closest?.('label');
            if (!label || !root.contains?.(label)) return;
            const nestedInteractive = event.target?.closest?.('button,a[href],input,select,textarea,[role="button"]');
            if (nestedInteractive && nestedInteractive !== label && label.contains?.(nestedInteractive)) return;

            let radio = null;
            const forId = String(label.getAttribute?.('for') || '').trim();
            if (forId) radio = [...root.querySelectorAll('input[type="radio"][id]')].find(item => item.id === forId) || null;
            if (!radio) radio = label.querySelector?.('input[type="radio"]') || null;
            if (!radio || !radio.checked) return;

            const key = reversibleRadioGroupKey(radio);
            const group = state.groups.get(key);
            if (!group) return;
            event.preventDefault();
            restoreReversibleRadioBaseline(root, group);
        };
        root.addEventListener('click', state.onClick, true);
    }

    const count = state.groups.size;
    if (count) root.setAttribute(REVERSIBLE_RADIO_ROOT_ATTR, String(count));
    else root.removeAttribute(REVERSIBLE_RADIO_ROOT_ATTR);
    return count;
}


function inputHasVisibleNativeToggle(input) {
    if (!input) return false;
    const snapshot = getRenderedStyleSnapshot(input);
    let rect = null;
    try {
        rect = input.getBoundingClientRect?.();
    } catch {
        rect = null;
    }
    const width = Number(rect?.width || 0);
    const height = Number(rect?.height || 0);
    return !snapshot.hidden && width >= 8 && height >= 8;
}


function targetAlreadyProvidesCheckedReturn(target, input) {
    if (!target || !input) return true;
    if (target.matches?.(EXISTING_INTERACTIVE_SELECTOR)) return true;
    const wrappingLabel = target.closest?.('label');
    if (wrappingLabel) {
        const forId = String(wrappingLabel.getAttribute('for') || '');
        if ((forId && forId === String(input.id || '')) || wrappingLabel.contains?.(input)) return true;
    }
    for (const label of target.querySelectorAll?.('label[for]') || []) {
        if (String(label.getAttribute('for') || '') === String(input.id || '')) return true;
    }
    return false;
}


export function findOneWayCheckedResultCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const candidates = [];
    const seen = new Set();

    for (const input of root.querySelectorAll('input[type="checkbox"]')) {
        if (input.disabled || inputHasVisibleNativeToggle(input)) continue;
        const labels = associatedLabelsForInput(root, input);
        if (!labels.length) continue;

        const hiddenLabels = new Set();
        const revealedTargets = new Set();
        for (const rule of parseCheckedRulesFromText(root, input)) {
            if (rule.pseudoElement) continue;
            const targets = resolveTargetsForCheckedRule(root, input, rule);
            for (const target of targets) {
                if (checkedStyleMapHidesTrigger(rule.styleMap)) {
                    for (const label of labels) {
                        if (target === label || target.contains?.(label)) hiddenLabels.add(label);
                    }
                }
                if (checkedStyleMapRevealsResult(root, target, rule.styleMap)) revealedTargets.add(target);
            }
        }
        if (hiddenLabels.size !== labels.length || !revealedTargets.size) continue;

        for (const target of revealedTargets) {
            if (!target?.isConnected || targetAlreadyProvidesCheckedReturn(target, input)) continue;
            const key = `${String(input.id || '')}|${String(target.className || target.tagName || '')}|${String(target.textContent || '').slice(0, 80)}`;
            if (seen.has(key)) continue;
            seen.add(key);
            candidates.push({ input, target, labels });
        }
    }
    return candidates;
}


function installOneWayCheckedResultFallback(root) {
    if (!root?.querySelectorAll) return 0;
    let state = reversibleCheckedResultRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        reversibleCheckedResultRescueStates.set(root, state);
    }
    for (const [target, entry] of [...state.entries]) {
        if (!target?.isConnected || !entry.input?.isConnected || !root.contains?.(target) || !root.contains(entry.input)) {
            state.entries.delete(target);
        }
    }

    const perInput = new Map();
    for (const candidate of findOneWayCheckedResultCandidates(root)) {
        const existing = state.entries.get(candidate.target);
        if (existing && existing.input !== candidate.input) continue;
        if (!installReversibleTargetClose(candidate.target, candidate.input, root)) continue;
        candidate.target.setAttribute(REVERSIBLE_CHECKED_RESULT_TARGET_ATTR, 'true');
        state.entries.set(candidate.target, candidate);
        perInput.set(candidate.input, (perInput.get(candidate.input) || 0) + 1);
    }

    for (const input of root.querySelectorAll(`[${REVERSIBLE_CHECKED_RESULT_RESCUE_ATTR}]`)) {
        if (!perInput.has(input)) input.removeAttribute(REVERSIBLE_CHECKED_RESULT_RESCUE_ATTR);
    }
    for (const [input, count] of perInput) {
        input.setAttribute(REVERSIBLE_CHECKED_RESULT_RESCUE_ATTR, String(count));
    }

    const liveCount = [...state.entries.keys()].filter(target => target?.isConnected && root.contains?.(target)).length;
    if (liveCount) root.setAttribute(REVERSIBLE_CHECKED_RESULT_ROOT_ATTR, String(liveCount));
    else root.removeAttribute(REVERSIBLE_CHECKED_RESULT_ROOT_ATTR);
    return liveCount;
}


export function inputHasAssociatedLabel(root, input) {
    if (!input) return false;
    if (input.closest?.('label')) return true;
    if (input.labels?.length) return true;
    const id = String(input.id || '');
    if (!id || !root?.querySelectorAll) return false;
    return [...root.querySelectorAll('label[for]')].some(label => String(label.getAttribute('for') || '') === id);
}


function checkedSelectorTargetsInputState(selector, input) {
    const source = String(selector || '').trim();
    if (!source || !/:checked\b/i.test(source) || !input?.matches) return false;

    // 只识别“当前 input 自身进入 checked 后会影响其他节点/宿主”的规则。
    // 允许 ancestor input:checked ~ target，也允许 .host:has(input:checked) target；
    // 单纯 input:checked { accent-color: ... } 不扩大点击区。
    const checkedSubjectRe = /((?:[a-zA-Z][\w-]*)?(?:(?:[#.][\w-]+)|(?:\[[^\]]+\]))*)\s*:checked\b/gi;
    let match;
    while ((match = checkedSubjectRe.exec(source))) {
        const subject = String(match[1] || '').trim() || 'input';
        let matchesInput = false;
        try {
            matchesInput = input.matches(subject);
        } catch {
            matchesInput = false;
        }
        if (!matchesInput) continue;

        const before = source.slice(0, match.index);
        const after = source.slice(match.index + match[0].length);
        const openHasIndex = before.lastIndexOf(':has(');
        const closeBeforeIndex = before.lastIndexOf(')');
        if (openHasIndex > closeBeforeIndex && after.includes(')')) return true;

        // checkbox/radio 是空元素；实际可见状态通常由 + / ~ / > 目标承担。
        // 允许中间带 :not(...) / :is(...) 等伪类，只要其后仍出现结构组合符。
        if (/(?:^|[^\\])[+~>]/.test(after)) return true;
    }
    return false;
}


export function inputHasMeaningfulCheckedSiblingRule(root, input) {
    if (!root?.querySelectorAll || !input?.matches) return false;

    // 优先走 CSSOM，能正确进入 @media / @supports 等嵌套规则；
    // 文本扫描作为 WebView 暂时禁止读取 style.sheet 时的后备。
    for (const style of getRabbitMirrorLocalStyleElements(root)) {
        try {
            let found = false;
            const visitRules = (rules) => {
                for (const rule of [...(rules || [])]) {
                    if (found) return;
                    if (rule?.cssRules) visitRules(rule.cssRules);
                    if (!rule?.selectorText || !/:checked\b/i.test(rule.selectorText)) continue;
                    for (const selector of splitCssSelectorList(rule.selectorText)) {
                        if (checkedSelectorTargetsInputState(selector, input)) {
                            found = true;
                            return;
                        }
                    }
                }
            };
            visitRules(style.sheet?.cssRules);
            if (found) return true;
        } catch {
            // Continue with text scan below.
        }
    }

    const cssText = getRabbitMirrorLocalStyleElements(root).map(style => String(style.textContent || '')).join('\n');
    const selectorBlockRe = /(?:^|[{}])\s*([^{}]*:checked[^{}]*)\{/gi;
    let match;
    while ((match = selectorBlockRe.exec(cssText))) {
        const selectorText = String(match[1] || '').trim();
        for (const selector of splitCssSelectorList(selectorText)) {
            if (checkedSelectorTargetsInputState(selector, input)) return true;
        }
    }
    return false;
}


function focusWithinPersistentInputLooksLikeOverlay(input) {
    if (!input?.style) return false;
    let computed = null;
    try { computed = typeof getComputedStyle === 'function' ? getComputedStyle(input) : null; } catch {}
    const inlineOpacity = Number.parseFloat(input.style.getPropertyValue('opacity') || '');
    const computedOpacity = Number.parseFloat(computed?.opacity || '');
    const opacity = Number.isFinite(computedOpacity) ? computedOpacity : inlineOpacity;
    const position = String(computed?.position || input.style.getPropertyValue('position') || '').trim().toLowerCase();
    const pointerEvents = String(computed?.pointerEvents || input.style.getPropertyValue('pointer-events') || '').trim().toLowerCase();
    if (pointerEvents === 'none') return false;
    return Number.isFinite(opacity) && opacity <= 0.05 && /^(?:absolute|fixed)$/.test(position);
}


function parseFocusWithinPersistentRules(root) {
    if (!root?.querySelectorAll) return [];
    const rules = [];
    const seen = new Set();
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    for (const style of getRabbitMirrorLocalStyleElements(root).filter(styleEl => !styleEl.hasAttribute(FOCUS_WITHIN_PERSISTENT_STYLE_ATTR))) {
        const cssText = String(style.textContent || '');
        blockRe.lastIndex = 0;
        let block;
        while ((block = blockRe.exec(cssText))) {
            const selectorText = String(block[1] || '').trim();
            if (!selectorText || selectorText.startsWith('@') || !/:focus-within\b/i.test(selectorText)) continue;
            const assignments = parseCssStateSiblingAssignments(block[2]);
            if (!assignments.length) continue;
            const declarations = addImportantToDeclarationBlock(String(block[2] || ''));
            if (!declarations.trim()) continue;
            for (const selector of splitCssSelectorList(selectorText)) {
                const matches = [...String(selector || '').matchAll(/:focus-within\b/gi)];
                if (matches.length !== 1) continue;
                const index = matches[0].index;
                const subjectSelector = String(selector).slice(0, index).trim();
                const suffix = String(selector).slice(index + matches[0][0].length);
                if (!subjectSelector || /:(?:hover|active|focus|checked|target|has)\b/i.test(subjectSelector)) continue;
                const transformedSelector = String(selector).replace(
                    /:focus-within\b/i,
                    `[${FOCUS_WITHIN_PERSISTENT_ACTIVE_ATTR}="true"]`,
                );
                const key = `${subjectSelector}|${suffix}|${transformedSelector}|${declarations}`;
                if (seen.has(key)) continue;
                seen.add(key);
                rules.push({ subjectSelector, suffix, transformedSelector, declarations, assignments });
            }
        }
    }
    return rules;
}


function focusWithinPersistentHostMatchesRule(host, rule) {
    if (!host?.matches || !rule?.subjectSelector) return false;
    try { return host.matches(rule.subjectSelector); } catch { return false; }
}


function focusWithinPersistentRuleTargets(host, rule) {
    if (!host || !rule) return [];
    const suffix = String(rule.suffix || '');
    if (!suffix.trim()) return [host];
    if (!/^\s+/.test(suffix)) return [];
    const selector = suffix.trim();
    if (!selector || /^[>+~]/.test(selector)) return [];
    try { return [...host.querySelectorAll(selector)]; } catch { return []; }
}


function focusWithinPersistentRuleRevealsContent(root, host, rule) {
    if (!/^\s+/.test(String(rule?.suffix || ''))) return false;
    for (const target of focusWithinPersistentRuleTargets(host, rule)) {
        if ((rule.assignments || []).some(({ property, value }) => (
            checkedDeclarationCreatesContentReveal(root, target, property, value)
        ))) return true;
    }
    return false;
}


export function findFocusWithinPersistentCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const rules = parseFocusWithinPersistentRules(root);
    if (!rules.length) return [];
    const candidates = [];
    for (const input of root.querySelectorAll('input[type="checkbox"]')) {
        if (input.disabled || inputHasAssociatedLabel(root, input) || !focusWithinPersistentInputLooksLikeOverlay(input)) continue;
        if (getRenderedInputRoute(input) && getRenderedInputRoute(input) !== FOCUS_WITHIN_PERSISTENT_ROUTE) continue;

        let host = input.parentElement;
        for (let depth = 0; host && host !== root && depth < 6; depth += 1, host = host.parentElement) {
            const controls = host.querySelectorAll?.('input[type="checkbox"], input[type="radio"]') || [];
            if (controls.length !== 1 || controls[0] !== input) continue;
            const matchedRules = rules.filter(rule => focusWithinPersistentHostMatchesRule(host, rule));
            if (!matchedRules.length || !matchedRules.some(rule => focusWithinPersistentRuleRevealsContent(root, host, rule))) continue;
            candidates.push({ input, host, rules: matchedRules });
            break;
        }
    }
    return candidates;
}


function setFocusWithinPersistentState(root, entry, active, phase = 'sync') {
    if (!root || !entry?.host || !entry?.input) return;
    entry.active = !!active;
    entry.host.setAttribute(FOCUS_WITHIN_PERSISTENT_ACTIVE_ATTR, entry.active ? 'true' : 'false');
    entry.host.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
    entry.host.setAttribute('aria-expanded', entry.active ? 'true' : 'false');
    entry.input.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
    const identity = String(entry.input.getAttribute('aria-label') || entry.input.id || entry.input.name || 'checkbox').slice(0, 100);
    root.dataset.rabbitMirrorFocusWithinPersistentLast = `${identity}:${entry.active ? '1' : '0'}@${phase}`;

    // 关闭时必须主动移走真实焦点，否则原始 :focus-within 仍会暂时压过持久状态桥接。
    if (!entry.active) {
        setTimeout(() => {
            const focused = typeof document !== 'undefined' ? document.activeElement : null;
            if (focused && (focused === entry.host || entry.host.contains?.(focused))) focused.blur?.();
        }, 0);
    }
}


function detachFocusWithinPersistentEntry(entry) {
    const { input, host, onPointerDown, onClick, onChange, onKeyDown } = entry || {};
    if (host?.removeEventListener) {
        if (onPointerDown) host.removeEventListener('pointerdown', onPointerDown, true);
        if (onClick) host.removeEventListener('click', onClick, false);
        if (onKeyDown) host.removeEventListener('keydown', onKeyDown, false);
    }
    if (input?.removeEventListener && onChange) input.removeEventListener('change', onChange, false);
    host?.removeAttribute?.(FOCUS_WITHIN_PERSISTENT_HOST_ATTR);
    host?.removeAttribute?.(FOCUS_WITHIN_PERSISTENT_ACTIVE_ATTR);
    input?.removeAttribute?.(FOCUS_WITHIN_PERSISTENT_CONTROL_ATTR);
    if (getRenderedInputRoute(input) === FOCUS_WITHIN_PERSISTENT_ROUTE) input.removeAttribute(RENDERED_INPUT_ROUTE_ATTR);
}


function installFocusWithinPersistentFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const candidates = findFocusWithinPersistentCandidates(root);
    const candidateByInput = new Map(candidates.map(candidate => [candidate.input, candidate]));
    const rescueState = focusWithinPersistentRescueStates.get(root) || { entries: new Map() };
    const { entries } = rescueState;

    for (const [input, entry] of [...entries]) {
        const candidate = candidateByInput.get(input);
        if (!candidate || candidate.host !== entry.host || !entry.host?.isConnected) {
            detachFocusWithinPersistentEntry(entry);
            entries.delete(input);
        }
    }

    for (const candidate of candidates) {
        const { input, host } = candidate;
        if (entries.has(input) || !claimRenderedInputRoute(input, FOCUS_WITHIN_PERSISTENT_ROUTE)) continue;

        if (host.hasAttribute(FOCUS_WITHIN_PERSISTENT_HOST_ATTR)) {
            const ownedByLiveEntry = [...entries.values()].some(entry => entry.host === host);
            if (ownedByLiveEntry) continue;
            host.removeAttribute(FOCUS_WITHIN_PERSISTENT_HOST_ATTR);
            host.removeAttribute(FOCUS_WITHIN_PERSISTENT_ACTIVE_ATTR);
        }

        const entry = {
            ...candidate,
            active: !!input.checked,
            beforePointer: null,
            onPointerDown: null,
            onClick: null,
            onChange: null,
            onKeyDown: null,
        };

        entry.onPointerDown = event => {
            if (event.target === input || event.target?.closest?.('input') === input) entry.beforePointer = !!input.checked;
        };
        entry.onChange = () => setFocusWithinPersistentState(root, entry, !!input.checked, 'change');
        entry.onClick = event => {
            const clickedInput = event.target === input || event.target?.closest?.('input') === input;
            if (clickedInput) {
                const before = entry.beforePointer;
                entry.beforePointer = null;
                setTimeout(() => {
                    if (!input.isConnected || !root.contains(input)) return;
                    if (before !== null && !!input.checked === !!before) {
                        input.checked = !before;
                        dispatchRescuedInputState(input);
                    }
                    setFocusWithinPersistentState(root, entry, !!input.checked, 'click');
                }, 0);
                return;
            }
            if (shouldIgnorePseudoToggleEvent(event, host)) return;
            event.preventDefault();
            input.checked = !input.checked;
            dispatchRescuedInputState(input);
            setFocusWithinPersistentState(root, entry, !!input.checked, 'host-click');
        };
        entry.onKeyDown = event => {
            if (event.target !== host || (event.key !== 'Enter' && event.key !== ' ')) return;
            event.preventDefault();
            input.checked = !input.checked;
            dispatchRescuedInputState(input);
            setFocusWithinPersistentState(root, entry, !!input.checked, 'keyboard');
        };

        preparePseudoTrigger(host);
        host.addEventListener('pointerdown', entry.onPointerDown, true);
        host.addEventListener('click', entry.onClick, false);
        host.addEventListener('keydown', entry.onKeyDown, false);
        input.addEventListener('change', entry.onChange, false);
        host.setAttribute(FOCUS_WITHIN_PERSISTENT_HOST_ATTR, 'true');
        input.setAttribute(FOCUS_WITHIN_PERSISTENT_CONTROL_ATTR, 'true');
        entries.set(input, entry);
        setFocusWithinPersistentState(root, entry, !!input.checked, 'install');
    }

    const cssRules = [];
    const seenCss = new Set();
    for (const entry of entries.values()) {
        for (const rule of entry.rules || []) {
            const css = `${rule.transformedSelector} {${rule.declarations}}`;
            if (seenCss.has(css)) continue;
            seenCss.add(css);
            cssRules.push(css);
        }
    }
    let rescueStyle = root.querySelector(`style[${FOCUS_WITHIN_PERSISTENT_STYLE_ATTR}]`);
    if (cssRules.length) {
        if (!rescueStyle) {
            rescueStyle = document.createElement('style');
            rescueStyle.setAttribute(FOCUS_WITHIN_PERSISTENT_STYLE_ATTR, 'true');
            root.appendChild(rescueStyle);
        }
        const nextCss = cssRules.join('\n');
        if (rescueStyle.textContent !== nextCss) rescueStyle.textContent = nextCss;
        root.setAttribute(FOCUS_WITHIN_PERSISTENT_ROOT_ATTR, String(entries.size));
    } else {
        rescueStyle?.remove();
        root.removeAttribute(FOCUS_WITHIN_PERSISTENT_ROOT_ATTR);
        delete root.dataset.rabbitMirrorFocusWithinPersistentLast;
    }
    focusWithinPersistentRescueStates.set(root, rescueState);
    return entries.size;
}


function findUnlabeledCheckedHost(root, input) {
    let host = input?.parentElement || null;
    for (let depth = 0; host && host !== root && depth < 6; depth += 1, host = host.parentElement) {
        const controls = host.querySelectorAll?.('input[type="checkbox"], input[type="radio"]') || [];
        const hasSiblingContent = [...(host.children || [])].some(child => child !== input && !/^(?:style|script)$/i.test(child.tagName || ''));
        if (controls.length === 1 && hasSiblingContent) return host;
    }
    return null;
}


function recordUnlabeledCheckedHostResult(root, state, before, intended, phase) {
    if (!root || !state?.input) return;
    const actual = !!state.input.checked;
    state.lastBefore = !!before;
    state.lastIntended = !!intended;
    state.lastActual = actual;
    state.lastPhase = String(phase || 'unknown');
    state.lastMatched = actual === !!intended;
    if (phase === 'click') state.toggleCount = (state.toggleCount || 0) + 1;
    if (phase === 'verified' && state.lastMatched) state.verifiedCount = (state.verifiedCount || 0) + 1;
    const identity = String(state.input.id || state.input.name || state.input.type || 'control').slice(0, 100);
    root.dataset.rabbitMirrorUnlabeledCheckedLast = `${identity}:${before ? '1' : '0'}>${intended ? '1' : '0'}=${actual ? '1' : '0'}@${state.lastPhase}`;
}


function verifyUnlabeledCheckedHostState(root, state, before, intended) {
    for (const delay of [0, 60]) {
        setTimeout(() => {
            const { input, host } = state || {};
            if (!input?.isConnected || !host?.isConnected || !root?.contains?.(input) || !root.contains(host)) return;
            if (!!input.checked !== !!intended) {
                setRescuedCheckedState(root, input, intended);
                state.correctionCount = (state.correctionCount || 0) + 1;
            } else {
                applyCheckedVisualFallback(root, input);
            }
            recordUnlabeledCheckedHostResult(root, state, before, intended, 'verified');
        }, delay);
    }
}


function detachUnlabeledCheckedHostEntry(state) {
    const { input, host, onPointerDown, onClick } = state || {};
    if (host?.removeEventListener) {
        if (onPointerDown) host.removeEventListener('pointerdown', onPointerDown, true);
        if (onClick) host.removeEventListener('click', onClick, true);
    }
    host?.removeAttribute?.(UNLABELED_CHECKED_HOST_RESCUE_ATTR);
    input?.removeAttribute?.(UNLABELED_CHECKED_CONTROL_RESCUE_ATTR);
}


export function setRescuedCheckedState(root, input, nextChecked) {
    if (!input || input.disabled) return false;
    const previous = !!input.checked;
    if (input.type === 'radio') {
        const radioName = String(input.name || '');
        const group = [...root.querySelectorAll('input[type="radio"]')]
            .filter(item => !radioName || item.name === radioName);
        group.filter(item => item !== input).forEach(item => {
            item.checked = false;
            restoreInteractionInlineOverrides(item);
        });
        // WeakMap records do not survive independent-API DOM re-mounts. An unchecked radio
        // may therefore still carry its previous checked branch as inline !important styles.
        clearUncheckedRadioCheckedInlineArtifacts(root, group.filter(item => item !== input));
        input.checked = true;
    } else {
        input.checked = !!nextChecked;
    }
    applyCheckedVisualFallback(root, input);
    if (previous !== input.checked) dispatchRescuedInputState(input);
    return previous !== input.checked;
}


function installUnlabeledCheckedHostFallback(root) {
    if (!root?.querySelectorAll) return 0;

    // 流式渲染时 input、style 与正文可能分批到达。旧实现第一次扫描为 0 后就永久返回空 Map，
    // 维修兔再次调用也无法真实安装。这里改为增量校准：清理失效条目并补装新命中路线。
    const rescueState = unlabeledCheckedHostRescueStates.get(root) || { entries: new Map() };
    const { entries } = rescueState;

    for (const [input, state] of [...entries]) {
        const expectedHost = input?.isConnected
            && root.contains?.(input)
            && !input.disabled
            && !inputHasAssociatedLabel(root, input)
            && inputHasMeaningfulCheckedSiblingRule(root, input)
            ? findUnlabeledCheckedHost(root, input)
            : null;
        if (!expectedHost || expectedHost !== state.host || !state.host?.isConnected) {
            detachUnlabeledCheckedHostEntry(state);
            entries.delete(input);
        }
    }

    for (const input of root.querySelectorAll('input[type="checkbox"], input[type="radio"]')) {
        if (entries.has(input) || input.disabled || inputHasAssociatedLabel(root, input)
            || !inputHasMeaningfulCheckedSiblingRule(root, input)) continue;
        const host = findUnlabeledCheckedHost(root, input);
        if (!host) continue;

        // DOM 被宿主克隆时 data 属性可能保留而 WeakMap 不保留；先移除无状态的旧标记再重绑。
        if (host.hasAttribute(UNLABELED_CHECKED_HOST_RESCUE_ATTR)) {
            const ownedByLiveEntry = [...entries.values()].some(entry => entry.host === host);
            if (ownedByLiveEntry) continue;
            host.removeAttribute(UNLABELED_CHECKED_HOST_RESCUE_ATTR);
        }

        const state = {
            input,
            host,
            beforePointer: null,
            toggleCount: 0,
            correctionCount: 0,
            verifiedCount: 0,
            onPointerDown: null,
            onClick: null,
        };

        state.onPointerDown = (event) => {
            const nestedInteractive = event.target?.closest?.(EXISTING_INTERACTIVE_SELECTOR);
            if (nestedInteractive && nestedInteractive !== input && host.contains(nestedInteractive)) return;
            state.beforePointer = !!input.checked;
        };

        state.onClick = (event) => {
            const nestedInteractive = event.target?.closest?.(EXISTING_INTERACTIVE_SELECTOR);
            if (nestedInteractive && nestedInteractive !== input && host.contains(nestedInteractive)) return;
            const clickedInput = event.target === input || event.target?.closest?.('input') === input;
            const before = state.beforePointer === null ? !!input.checked : state.beforePointer;
            state.beforePointer = null;
            const intended = input.type === 'radio' ? true : !before;

            if (!clickedInput) {
                // 当前局部宿主已经由急救器接管；阻止同一次点击继续冒泡到旧 onclick/其他兜底，
                // 避免 true→false 的双重切换。链接、按钮、summary 等原生交互已在上方排除。
                event.preventDefault();
                event.stopImmediatePropagation?.();
                setRescuedCheckedState(root, input, intended);
                recordUnlabeledCheckedHostResult(root, state, before, intended, 'click');
                verifyUnlabeledCheckedHostState(root, state, before, intended);
                return;
            }

            // 直接点到 input 时优先保留原生切换；若 WebView 没有执行 default action，下一任务补切一次。
            setTimeout(() => {
                if (!input.isConnected || !root.contains(input)) return;
                if (!!input.checked === before) setRescuedCheckedState(root, input, intended);
                else applyCheckedVisualFallback(root, input);
                recordUnlabeledCheckedHostResult(root, state, before, intended, 'click');
                verifyUnlabeledCheckedHostState(root, state, before, intended);
            }, 0);
        };

        host.addEventListener('pointerdown', state.onPointerDown, true);
        host.addEventListener('click', state.onClick, true);
        host.setAttribute(UNLABELED_CHECKED_HOST_RESCUE_ATTR, 'true');
        input.setAttribute(UNLABELED_CHECKED_CONTROL_RESCUE_ATTR, 'true');
        entries.set(input, state);
    }

    unlabeledCheckedHostRescueStates.set(root, rescueState);
    if (entries.size) root.dataset.rabbitMirrorUnlabeledCheckedFallback = String(entries.size);
    else {
        delete root.dataset.rabbitMirrorUnlabeledCheckedFallback;
        delete root.dataset.rabbitMirrorUnlabeledCheckedLast;
    }
    return entries.size;
}


function isRelevant3DFlipDeclaration(property, value) {
    const lowerProperty = String(property || '').toLowerCase();
    const sourceValue = String(value || '');
    return (lowerProperty === 'backface-visibility' && /hidden/i.test(sourceValue))
        || (lowerProperty === 'transform-style' && /preserve-3d/i.test(sourceValue))
        || lowerProperty === 'perspective'
        || (lowerProperty === 'transform' && /rotateY\s*\(/i.test(sourceValue));
}


function addWebKit3DFlipPrefixes(cssText) {
    let changed = false;
    const repaired = String(cssText || '').replace(/\{([^{}]*)\}/g, (ruleBlock, declarations) => {
        const patchedDeclarations = String(declarations || '').replace(
            /(^|;)(\s*)(backface-visibility|transform-style|perspective|transform)\s*:\s*([^;{}]+)(?=;|$)/gi,
            (full, separator, spacing, property, rawValue, offset, declarationSource) => {
                const value = String(rawValue || '').trim();
                const lowerProperty = String(property || '').toLowerCase();
                if (!isRelevant3DFlipDeclaration(lowerProperty, value)) return full;

                // 第二次扫描时，若紧邻的前一条已经是同值 WebKit 声明，不重复插入。
                const before = String(declarationSource || '').slice(0, offset);
                const previousPrefix = new RegExp(
                    `(?:^|;)\\s*-webkit-${escapeRegExp(lowerProperty)}\\s*:\\s*${escapeRegExp(value)}\\s*$`,
                    'i',
                );
                if (previousPrefix.test(before)) return full;

                changed = true;
                return `${separator}${spacing}-webkit-${lowerProperty}: ${value};${spacing}${lowerProperty}: ${value}`;
            },
        );
        return `{${patchedDeclarations}}`;
    });
    return { changed, repaired };
}


export function collectWebKit3DFlipEvidence(root) {
    if (!root?.querySelectorAll) return {
        rotateY: 0, webkitRotateY: 0, backface: 0, webkitBackface: 0,
        preserve3d: 0, webkitPreserve3d: 0, perspective: 0, webkitPerspective: 0,
    };
    const source = [
        ...getRabbitMirrorLocalStyleElements(root).map(style => String(style.textContent || '')),
        ...[...root.querySelectorAll('[style]')].map(element => String(element.getAttribute('style') || '')),
    ].join('\n');
    const count = pattern => (source.match(pattern) || []).length;
    return {
        rotateY: count(/(?:^|[;{]\s*)transform\s*:[^;{}]*rotateY\s*\(/gim),
        webkitRotateY: count(/(?:^|[;{]\s*)-webkit-transform\s*:[^;{}]*rotateY\s*\(/gim),
        backface: count(/(?:^|[;{]\s*)backface-visibility\s*:\s*hidden\b/gim),
        webkitBackface: count(/(?:^|[;{]\s*)-webkit-backface-visibility\s*:\s*hidden\b/gim),
        preserve3d: count(/(?:^|[;{]\s*)transform-style\s*:\s*preserve-3d\b/gim),
        webkitPreserve3d: count(/(?:^|[;{]\s*)-webkit-transform-style\s*:\s*preserve-3d\b/gim),
        perspective: count(/(?:^|[;{]\s*)perspective\s*:/gim),
        webkitPerspective: count(/(?:^|[;{]\s*)-webkit-perspective\s*:/gim),
    };
}


export function formatWebKit3DFlipEvidence(root) {
    const evidence = collectWebKit3DFlipEvidence(root);
    return `rotateY=${evidence.rotateY}/${evidence.webkitRotateY} backface=${evidence.backface}/${evidence.webkitBackface} preserve3d=${evidence.preserve3d}/${evidence.webkitPreserve3d} perspective=${evidence.perspective}/${evidence.webkitPerspective}`;
}


export function installWebKit3DFlipRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const rescueState = webKit3DFlipRescueStates.get(root) || { patchedNodes: new Set() };
    const { patchedNodes } = rescueState;
    for (const node of [...patchedNodes]) {
        if (!node?.isConnected || !root.contains?.(node)) patchedNodes.delete(node);
    }

    const flipSourceText = [
        ...getRabbitMirrorLocalStyleElements(root).map(style => String(style.textContent || '')),
        ...[...root.querySelectorAll('[style]')].map(element => String(element.getAttribute('style') || '')),
    ].join('\n');
    const hasRotateY = /rotateY\s*\(/i.test(flipSourceText);
    const has3DStructure = /(?:-webkit-)?backface-visibility\s*:\s*hidden/i.test(flipSourceText)
        || /(?:-webkit-)?transform-style\s*:\s*preserve-3d/i.test(flipSourceText);
    if (!hasRotateY || !has3DStructure) {
        webKit3DFlipRescueStates.set(root, rescueState);
        if (!patchedNodes.size) root.removeAttribute?.(WEBKIT_3D_FLIP_RESCUE_ATTR);
        return patchedNodes.size;
    }

    // 每个 style 独立补前缀。front/back 与 rotateY 常分散在多个 style 标签中，
    // 不能再要求“当前 style 自己也含 rotateY”；同时允许流式追加后再次增量扫描。
    for (const style of getRabbitMirrorLocalStyleElements(root)) {
        const current = String(style.textContent || '');
        if (webKit3DFlipStyleStates.get(style) === current) continue;
        const result = addWebKit3DFlipPrefixes(current);
        if (result.changed && result.repaired !== current) {
            style.textContent = result.repaired;
            style.setAttribute(WEBKIT_3D_FLIP_RESCUE_ATTR, 'true');
            patchedNodes.add(style);
        }
        webKit3DFlipStyleStates.set(style, String(style.textContent || ''));
    }

    // 仅复制元素本来就有的 3D 声明到 WebKit 前缀；绝不向整个容器新加 rotateY。
    for (const element of root.querySelectorAll('[style]')) {
        const current = String(element.getAttribute('style') || '');
        if (webKit3DFlipInlineStates.get(element) === current) continue;
        let changed = false;
        for (const property of ['backface-visibility', 'transform-style', 'perspective', 'transform']) {
            const value = element.style.getPropertyValue(property).trim();
            if (!value || !isRelevant3DFlipDeclaration(property, value)) continue;
            const prefixedProperty = `-webkit-${property}`;
            const priority = element.style.getPropertyPriority(property) || '';
            if (element.style.getPropertyValue(prefixedProperty).trim() !== value
                || element.style.getPropertyPriority(prefixedProperty) !== priority) {
                element.style.setProperty(prefixedProperty, value, priority);
                changed = true;
            }
        }
        if (changed) {
            element.setAttribute(WEBKIT_3D_FLIP_RESCUE_ATTR, 'true');
            patchedNodes.add(element);
        }
        webKit3DFlipInlineStates.set(element, String(element.getAttribute('style') || ''));
    }

    webKit3DFlipRescueStates.set(root, rescueState);
    if (patchedNodes.size) root.setAttribute(WEBKIT_3D_FLIP_RESCUE_ATTR, String(patchedNodes.size));
    else root.removeAttribute?.(WEBKIT_3D_FLIP_RESCUE_ATTR);
    return patchedNodes.size;
}



function isZeroInsetValue(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return /^(?:0|0px|0%|0em|0rem)$/.test(normalized);
}


function isHighConfidenceDecorativeOverlay(element) {
    if (!element?.style || element.hasAttribute?.(DECORATIVE_OVERLAY_PASS_THROUGH_ATTR)) return false;
    const position = String(element.style.getPropertyValue('position') || '').trim().toLowerCase();
    if (position !== 'absolute' && position !== 'fixed') return false;

    const inset = String(element.style.getPropertyValue('inset') || '').trim().toLowerCase();
    const fullInset = inset && inset.split(/\s+/).every(isZeroInsetValue);
    const fullEdges = ['top', 'right', 'bottom', 'left']
        .every(property => isZeroInsetValue(element.style.getPropertyValue(property)));
    if (!fullInset && !fullEdges) return false;

    if (String(element.textContent || '').trim()) return false;
    if (element.querySelector?.('a, button, input, select, textarea, label, summary, [role="button"], [contenteditable="true"]')) return false;
    if (element.hasAttribute?.('onclick') || element.hasAttribute?.('onpointerdown') || element.hasAttribute?.('ontouchstart')) return false;

    const cursor = String(element.style.getPropertyValue('cursor') || '').trim().toLowerCase();
    const pointerEvents = String(element.style.getPropertyValue('pointer-events') || '').trim().toLowerCase();
    if (cursor === 'pointer' || pointerEvents === 'none') return false;

    const background = `${element.style.getPropertyValue('background')} ${element.style.getPropertyValue('background-image')}`.trim();
    const opacity = Number.parseFloat(element.style.getPropertyValue('opacity') || '1');
    const decorativePaint = !!background && background.toLowerCase() !== 'none';
    const lowOpacity = Number.isFinite(opacity) && opacity <= 0.45;
    return decorativePaint && lowOpacity;
}


export function findDecorativeOverlayPassThroughCandidates(root) {
    if (!root?.querySelectorAll) return [];
    return [...root.querySelectorAll('[style]')].filter(isHighConfidenceDecorativeOverlay);
}


function installDecorativeOverlayPassThrough(root) {
    let patched = 0;
    for (const overlay of findDecorativeOverlayPassThroughCandidates(root)) {
        overlay.style.setProperty('pointer-events', 'none', 'important');
        overlay.setAttribute(DECORATIVE_OVERLAY_PASS_THROUGH_ATTR, 'true');
        overlay.setAttribute('aria-hidden', 'true');
        patched += 1;
    }
    return patched;
}


function localPanelLayoutRule(root, element, kind, declarations) {
    let scope = localPanelLayoutScopes.get(root);
    if (!scope) {
        scope = `rmlocal-${Date.now().toString(36)}-${++localPanelLayoutSequence}`;
        localPanelLayoutScopes.set(root, scope);
    }
    const attr = `data-rm-local-${kind}`;
    element.setAttribute(attr, scope);
    let sheet = root.querySelector(`style[data-rabbit-mirror-local-panel-layout="${scope}"]`);
    if (!sheet) {
        sheet = root.ownerDocument.createElement('style');
        sheet.setAttribute('data-rabbit-mirror-local-panel-layout', scope);
        root.appendChild(sheet);
    }
    const rule = `[${attr}="${scope}"]{${declarations}}`;
    if (!sheet.textContent.includes(rule)) sheet.textContent += rule;
}

// The untrusted-CSS guard intentionally rejects full-size absolute geometry.
// A legitimate second screen can consequently become a static sibling *below*
// the full-height first screen. Restore only a proven, clipped, face-local canvas;
// never relax the generated CSS guard or restore fixed/viewport overlays.

function restoreContainedCheckedPanels(root) {
    if (!root?.isConnected || typeof getComputedStyle !== 'function') return 0;
    const bounds = root.getBoundingClientRect();
    let count = 0;
    for (const input of [...root.querySelectorAll('input[type="checkbox"],input[type="radio"]')].slice(0, 32)) {
        if (input.disabled) continue;
        const labels = getAssociatedCheckableLabels(root, input);
        for (const rule of parseCheckedRulesFromText(root, input)) {
            if (rule.pseudoElement || !(rule.styleMap || []).some(([name,value]) => name === 'display' && value !== 'none')) continue;
            for (const target of resolveTargetsForCheckedRule(root, input, rule)) {
                const parent = target?.parentElement;
                if (!parent || parent === root || !root.contains(parent) || target.contains(input)) continue;
                // Both the existing opener and return route must belong to this control.
                if (!labels.some(label => target.contains(label)) || !labels.some(label => !target.contains(label))) continue;
                const style = getComputedStyle(target), hostStyle = getComputedStyle(parent), rect = parent.getBoundingClientRect();
                if (style.position !== 'static' || hostStyle.position !== 'relative') continue;
                if (!['hidden','clip','auto','scroll'].includes(hostStyle.overflowX) || !['hidden','clip','auto','scroll'].includes(hostStyle.overflowY)) continue;
                if (rect.width < 120 || rect.height < 80 || rect.width > bounds.width + 2
                    || rect.left < bounds.left - 2 || rect.right > bounds.right + 2
                    || rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2) continue;
                if (style.top !== '0px' || style.left !== '0px') continue;
                const fills = (value, expected) => value === '100%' || Math.abs(parseFloat(value) - expected) <= 2;
                if (!fills(style.width, parent.clientWidth) || !fills(style.height, parent.clientHeight)) continue;
                // A real preceding canvas establishes the broken stacked-screen pattern.
                // Several alternate panels may follow the same canvas; a hidden
                // earlier panel is not the canvas and must not block later controls.
                let previous = target.previousElementSibling, canvas = null;
                for (let depth = 0; previous && depth < 16; depth += 1, previous = previous.previousElementSibling) {
                    const previousStyle = getComputedStyle(previous);
                    if (previousStyle.display === 'none' || ['absolute','fixed'].includes(previousStyle.position)) continue;
                    if (previous.getBoundingClientRect().height >= rect.height * .85) canvas = previous;
                    break;
                }
                if (!canvas) continue;
                localPanelLayoutRule(root, target, 'checked-panel', 'position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;box-sizing:border-box!important;overflow:auto!important;');
                count += 1;
            }
        }
    }
    return count;
}


export function installIntelligentInteractionRescue(root) {
    restoreContainedCheckedPanels(root);
    // Generated HTML occasionally forgets to close one repeated card label before the next
    // card starts. Safari then treats later controls as descendants of the first label, and
    // class-local checked fallback can expand several branches at once. Repair this invalid
    // repeated-card structure before installing any interaction fallback.
    repairMalformedNestedInteractiveLabels(root);

    // Markdown 可能把相邻的 CSS 注释边界 */ ... /* 解析成 <em>/ ... /</em>，
    // 导致两段注释之间的状态规则被整段吞入注释。只在急救开启后修复当前 DOM 的明确损坏形态。
    repairMarkdownCorruptedCssComments(root);

    // SillyTavern/DOMPurify 可能在渲染前移除 onclick。只恢复原始源码中精确的
    // querySelectorAll('input[type=radio]').forEach(r => r.checked=false) 取消程序，
    // 并把原本会误伤整页的 document 范围收紧到当前兔子镜。
    installRawMessageRadioResetProgramRescue(root);
    // 回读安全可解析的 getElementById 样式/文字赋值，并按同一 DOM 路径绑定到渲染节点。
    installRawMessageDirectIdClickProgramRescue(root);
    // 宿主也会整段移除 <script>。只回读“固定 ID + click + 固定样式/文字 + 固定 setTimeout + 明确二次点击恢复”的有限时间线，
    // 不执行模型脚本本身；任何未知语句、动态选择器或任意调用都会整段放弃。
    installRawMessageScriptTimelineRescue(root);
    // 护照／证件类翻页采用“一次打开 + 独立关闭 + 印章长按详情”的复合结构；
    // 不执行原始 JavaScript，只回读固定 class add/remove 意图并恢复可逆开合和点按详情。
    installPassportDocumentRescue(root);
    // 命名函数仅接受受限的 getElementById + classList.contains/add/remove 两分支状态机；
    // 不执行原始 script，只把安全类名切换重新绑定到当前兔子镜。
    installRawMessageNamedFunctionClassRescue(root);
    // 回读只改写触发元素自身的安全 onclick（文字/样式），并改造成可逆点击。
    installRawMessageSelfMutationRescue(root);
    // 宿主会移除 onmouseover/onmouseout；从原始消息回读仅修改 this.style 的安全样式赋值，
    // 桌面保留悬停，触屏改为可保持、可再次点击恢复的状态。
    installRawMessageHoverPseudoRescue(root);
    // 同样从原始消息回读受限的 onchange 状态程序，覆盖宿主已删除事件属性的情况。
    installRawMessageCheckedChangeProgramRescue(root);
    // 低透明度、无文字、无交互后代的全覆盖纹理层在部分 WebView 中会截获触摸；
    // 只对高置信装饰层开启点击穿透，不处理真正的遮罩交互。
    installDecorativeOverlayPassThrough(root);

    // 模型偶尔在 CSS 中写出 .trigger:checked，却忘记把 trigger class 放到唯一的隐藏控件上。
    // 仅在原始源码中可证明“补上该 class 后，当前 label 控件会命中有正文的局部状态规则”时恢复。
    installMissingCheckedSubjectClassRescue(root);

    const capabilities = detectInteractionCapabilities(root);
    const preferNativeChecked = root.getAttribute?.(INDEPENDENT_NATIVE_CHECKED_RESTORE_ATTR) === 'true';
    if (capabilities.checked && !preferNativeChecked) {
        // radio 原生再次点击已选项不会取消，导致大量单选式场景进入第二状态后无法返回。
        // 记录首次安装时的组内初始 checked 基线；再次点按当前已选 label 时恢复该基线，不编造新内容。
        installReversibleRadioGroupFallback(root);
        // 无 label 的透明 checkbox 若只依赖父容器 :focus-within 显示背面，
        // 在触屏 WebView 中焦点会立即丢失或无法再次关闭。把同一套现有 CSS
        // 映射到本地持久状态属性；只接管明确承担第二层内容的高置信结构。
        installFocusWithinPersistentFallback(root);
        // 模型常把 checkbox/radio 的可保持状态误写成 :focus ~ ...。
        // 仅在当前兔子镜内复制为唯一 input ID 的 :checked 规则；普通 focus 视觉不受影响。
        refreshFocusToCheckedRescue(root);
        strengthenRabbitMirrorCheckedStateCss(root);
        // 旧消息中可能残留 .mes_text body:has(...:checked) 这类永不命中的全选联动；
        // 用当前兔子镜根的可逆状态属性恢复，不依赖宿主对 :has() 的支持。
        installCheckedHasStateFallback(root);
        // 控件区与内容区分离时，模型写出的 .content:has(input:checked) 永远无法命中；
        // 仅对控件明确位于 host 外、正文明确位于 host 内的局部规则建立状态桥接。
        installDetachedCheckedHasFallback(root);
        // 两个独立 checkbox 若分别承担“进入下一画面”和“返回主画面”，纯 CSS 会在返回后残留双重 checked，
        // 且内联 display:none 会压过普通 :has() 规则。只对互为反向显示、各自位于对应状态层内的高置信结构恢复可重复往返。
        installPairedCheckedStateRescue(root);
        // 优先解析 checkbox/radio 中安全的 ID 目标条件显隐；绑定到 input/change，
        // 避免 label 兜底只切换 checked、却不触发原 onclick 的情况。
        installRenderedCheckedIdTargetRescue(root);
        // 先从已渲染的安全 DOM 识别前景/隐藏层，再由 label 兜底触发 input/change。
        // 此路径完全不依赖已被宿主删除的 onclick/onchange。
        installRenderedStateLayerRescue(root);
        // 补救 label 后方的多段隐藏内容（如 querySelectorAll(...)[0/1]），不依赖事件原文。
        installRenderedAdjacentHiddenGroupRescue(root);
        // 补救 checkbox/radio 与单块隐藏正文同处 label 内的结构。
        installRenderedLabelInternalHiddenRescue(root);
        // 补救 label 后方紧邻的单块结果层，并可选增强同画布内的零尺寸视觉主体。
        installRenderedLabelAdjacentResultRescue(root);
        installInteractionLabelFallback(root);
        // 有 label 的 checked 控件不仅登记监听器，还登记可验证的受控目标；
        // 点击后会校验 checked 是否保持、第二状态是否真实改变，并在 WebView 回滚时补正。
        installLabeledCheckedVerificationFallback(root);
        // input 位于按钮组内、受控内容位于按钮组外时，原生 ~ 选择器无法跨父层命中。
        // 只对唯一 ID 触发器登记文本级跨父层兜底，实际切换仍由当前 label 驱动。
        installCrossParentCheckedRuleFallback(root);
        // 多个正文层叠在同一 grid-area/绝对定位画布中时，模型常给默认层写死内联 opacity:1；
        // checked 分支虽然成功显现，默认层仍会和新正文重叠。只对同一公共内容 class 的高置信互斥叠层强制单层可见。
        installExclusiveStackedStateRescue(root);
        // 电视／终端用多个重叠 label 模拟旋钮分区时，中间频道常被高 z-index 的左右标签永久遮住。
        // 只对已经存在完整 radio 分支和叠层画面的高置信旋钮，改为每次点按按顺序循环频道。
        installChannelDialCycleRescue(root);
        // checkbox 的 checked 分支若把唯一 label/触发器隐藏，却只留下普通正文结果，
        // 用户会失去取消勾选的入口。仅对这一高置信单向结构，让已展开结果可再次点按返回上一层。
        installOneWayCheckedResultFallback(root);
        // 没有 label 的透明 checkbox/radio 在 iOS WebView 中经常只有极小原生点击区；
        // 用其局部父容器兜底切换，不改动正常 label 交互。
        installUnlabeledCheckedHostFallback(root);
    }
    // Safari/WebKit 对 3D 翻面仍要求前缀版 backface/preserve-3d；缺失时背面会镜像或双面同显。
    installWebKit3DFlipRescue(root);
    // 精准读取 :active/:focus/:focus-within/:hover 与 +/~ 的后置状态映射；
    // 先于启发式按钮路线安装，避免同一按钮被两套可逆状态重复接管。
    if (capabilities.stateSibling) installRenderedCssStateSiblingRescue(root);
    // 普通 button 后紧邻隐藏内容时，先建立真实揭示路线，避免只被归类为 hover 颜色反馈。
    if (capabilities.buttonAdjacent) installRenderedButtonAdjacentHiddenRescue(root);
    // 普通 cursor:pointer 容器后紧邻 display:none 正文时，不再错误要求弹层必须带关闭按钮。
    if (capabilities.clickableAdjacent) installRenderedClickableAdjacentHiddenRescue(root);
    if (capabilities.clickablePopup) installRenderedClickableAdjacentPopupRescue(root);
    if (capabilities.hover) refreshTouchHoverRescue(root);
    if (capabilities.target) refreshTargetRescue(root);
    if (capabilities.details) installNestedDetailsFallback(root);
    if (capabilities.pseudo) installPseudoInteractionRescue(root);
    // 遮罩类优先于普通容器内揭示，避免同一画面被两条路线重复接管。
    if (capabilities.maskReveal) installRenderedMaskRevealRescue(root);
    if (capabilities.containerReveal) installRenderedContainerInternalRevealRescue(root);
    if (capabilities.listDetail) installRenderedListDetailRescue(root);
    // 纯静态的“选项 A/B/C”卡片若已有明确选择文案、统一同级容器与 cursor:pointer，
    // 可安全补成互斥且可撤回的选择状态；只确认用户选中了哪张卡，不生成缺失的剧情结果。
    installStaticChoiceSelectionFallback(root);
}


function touchHoverRuleTargets(root, selectorText) {
    if (!root?.querySelectorAll) return [];
    const selector = pseudoStateTargetSelector(selectorText)
        .replace(/::(?:before|after)\b/gi, '')
        .trim();
    if (!selector) return [];
    try {
        return [...root.querySelectorAll(selector)];
    } catch {
        return [];
    }
}


function touchHoverNumericValue(value) {
    const match = String(value || '').replace(/\s*!important\s*$/i, '').trim().match(/^(-?\d+(?:\.\d+)?)/);
    return match ? Number.parseFloat(match[1]) : Number.NaN;
}


function touchHoverRuleCarriesSecondState(root, selectorText, declarationText) {
    const declarations = [];
    const declarationRe = /(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+?)(?=;|$)/gi;
    let declaration;
    while ((declaration = declarationRe.exec(String(declarationText || '')))) {
        declarations.push([
            normalizeStylePropertyName(declaration[2]),
            String(declaration[3] || '').replace(/\s*!important\s*$/i, '').trim(),
        ]);
    }
    if (!declarations.length) return false;

    const pseudoElement = /::(?:before|after)\b/i.test(selectorText);
    const targets = touchHoverRuleTargets(root, selectorText);

    return declarations.some(([property, value]) => {
        const name = String(property || '').toLowerCase();
        const normalizedValue = String(value || '').trim().toLowerCase();

        // Hover 生成真实伪元素文字时属于新增内容，不是普通装饰。
        if (pseudoElement && name === 'content') {
            return normalizedValue && !/^(?:none|normal|""|'')$/.test(normalizedValue);
        }

        // 3D 翻面会切换观察面；平面位移、缩放和 rotate() 仍只是视觉反馈。
        if (name === 'transform') {
            return /(?:rotate[xy]|perspective)\s*\(/i.test(normalizedValue);
        }

        if (!targets.length) return false;

        if (name === 'display' && normalizedValue !== 'none') {
            return targets.some(target => target.hidden || diagnosticComputedStyle(target)?.display === 'none');
        }
        if (name === 'visibility' && /^(?:visible|initial|inherit|unset)$/.test(normalizedValue)) {
            return targets.some(target => /^(?:hidden|collapse)$/.test(String(diagnosticComputedStyle(target)?.visibility || '').toLowerCase()));
        }
        if (name === 'opacity') {
            const next = touchHoverNumericValue(normalizedValue);
            if (!Number.isFinite(next) || next <= 0.05) return false;
            return targets.some(target => {
                const current = Number.parseFloat(String(diagnosticComputedStyle(target)?.opacity || '1'));
                return Number.isFinite(current) && current <= 0.05;
            });
        }
        if (name === 'height' || name === 'max-height' || name === 'width' || name === 'max-width') {
            const next = touchHoverNumericValue(normalizedValue);
            if (!Number.isFinite(next) || next <= 1) return false;
            return targets.some(target => {
                const style = diagnosticComputedStyle(target);
                const current = Number.parseFloat(String(style?.getPropertyValue?.(name) || style?.[name] || ''));
                return Number.isFinite(current) && current <= 1;
            });
        }
        if ((name === 'clip-path' || name === '-webkit-clip-path') && !/^(?:none|initial|inherit|unset)$/.test(normalizedValue)) {
            return targets.some(target => {
                const style = diagnosticComputedStyle(target);
                const current = String(style?.getPropertyValue?.(name) || style?.clipPath || '').toLowerCase();
                return /inset\(\s*(?:50|100)%|circle\(\s*0|polygon\(\s*0\s+0\s*,\s*0\s+0/i.test(current);
            });
        }
        return false;
    });
}


function collectTouchHoverRulesFromCss(root, cssText) {
    const rules = [];
    const subjects = new Set();
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    let match;

    while ((match = blockRe.exec(String(cssText || '')))) {
        const selectorText = String(match[1] || '').trim();
        if (!selectorText || selectorText.startsWith('@') || !/:hover\b/i.test(selectorText)) continue;

        const declarationText = String(match[2] || '');
        const declarations = addImportantToDeclarationBlock(declarationText);
        if (!declarations.trim()) continue;

        const transformedSelectors = [];
        for (const selector of selectorText.split(',').map(value => value.trim()).filter(Boolean)) {
            if (!/:hover\b/i.test(selector)) continue;

            // 只有 Hover 真正揭示隐藏内容、展开零尺寸层、生成伪元素正文或执行 3D 翻面时，
            // 才在触屏端模拟持久 Hover。颜色、阴影、平面位移、缩放等装饰反馈保持原样。
            if (!touchHoverRuleCarriesSecondState(root, selector, declarationText)) continue;

            transformedSelectors.push(selector.replace(/:hover\b/gi, `[${TOUCH_HOVER_ATTR}="true"]`));

            const subjectRe = /((?:[a-zA-Z][\w-]*)?(?:[#.][\w-]+|\[[^\]]+\])*)\s*:hover\b/gi;
            let subjectMatch;
            while ((subjectMatch = subjectRe.exec(selector))) {
                const subject = String(subjectMatch[1] || '').trim();
                if (subject) subjects.add(subject);
            }
        }

        if (transformedSelectors.length) {
            rules.push(`${transformedSelectors.join(', ')} {${declarations}}`);
        }
    }

    return { cssText: rules.join('\n'), subjects: [...subjects] };
}


function refreshTouchHoverRescue(toto) {
    if (!toto?.querySelectorAll) return;

    let combinedCss = '';
    const subjects = new Set();
    getRabbitMirrorLocalStyleElements(toto).filter(styleEl => !styleEl.hasAttribute(TOUCH_HOVER_STYLE_ATTR)).forEach(styleEl => {
        const parsed = collectTouchHoverRulesFromCss(toto, styleEl.textContent || '');
        if (parsed.cssText) combinedCss += `${parsed.cssText}\n`;
        parsed.subjects.forEach(subject => subjects.add(subject));
    });

    let rescueStyle = toto.querySelector(`style[${TOUCH_HOVER_STYLE_ATTR}]`);
    if (combinedCss.trim()) {
        if (!rescueStyle) {
            rescueStyle = document.createElement('style');
            rescueStyle.setAttribute(TOUCH_HOVER_STYLE_ATTR, 'true');
            toto.appendChild(rescueStyle);
        }
        const nextCss = combinedCss.trim();
        if (rescueStyle.textContent !== nextCss) rescueStyle.textContent = nextCss;
    } else if (rescueStyle) {
        rescueStyle.remove();
    }

    toto.querySelectorAll?.(`[${TOUCH_HOVER_READY_ATTR}]`)?.forEach(element => element.removeAttribute(TOUCH_HOVER_READY_ATTR));
    let eligibleCount = 0;
    for (const subject of subjects) {
        try {
            toto.querySelectorAll(subject).forEach(element => {
                if (!element.hasAttribute(TOUCH_HOVER_READY_ATTR)) eligibleCount += 1;
                element.setAttribute(TOUCH_HOVER_READY_ATTR, 'true');
            });
        } catch {
            // Ignore malformed model-generated selectors.
        }
    }
    toto.querySelectorAll?.(`[${TOUCH_HOVER_ATTR}]`)?.forEach(element => {
        if (!element.hasAttribute(TOUCH_HOVER_READY_ATTR)) element.removeAttribute(TOUCH_HOVER_ATTR);
    });

    const previousState = touchHoverRescueStates.get(toto) || {};
    if (!eligibleCount) {
        if (previousState.listener) toto.removeEventListener('click', previousState.listener, false);
        touchHoverRescueStates.set(toto, { subjects: [], eligibleCount: 0, listener: null });
        toto.removeAttribute('data-rabbit-mirror-touch-hover-fallback');
        return;
    }

    let listener = previousState.listener;
    if (!listener) {
        listener = (event) => {
            const state = touchHoverRescueStates.get(toto);
            if (!state?.eligibleCount) return;

            const hoverTarget = event.target?.closest?.(`[${TOUCH_HOVER_READY_ATTR}="true"]`);
            if (!hoverTarget || !toto.contains(hoverTarget)) return;
            if (hoverTarget.hasAttribute?.(RENDERED_CSS_STATE_SIBLING_RESCUE_ATTR)
                || hoverTarget.hasAttribute?.(RENDERED_BUTTON_ADJACENT_HIDDEN_RESCUE_ATTR)
                || hoverTarget.hasAttribute?.(RENDERED_CLICKABLE_ADJACENT_POPUP_RESCUE_ATTR)
                || hoverTarget.hasAttribute?.(FILL_IN_CHOICE_BLANK_ATTR)) return;

            const isActive = hoverTarget.getAttribute(TOUCH_HOVER_ATTR) === 'true';
            if (isActive) hoverTarget.removeAttribute(TOUCH_HOVER_ATTR);
            else hoverTarget.setAttribute(TOUCH_HOVER_ATTR, 'true');
        };
        toto.addEventListener('click', listener, false);
    }

    touchHoverRescueStates.set(toto, { subjects: [...subjects], eligibleCount, listener });
    toto.dataset.rabbitMirrorTouchHoverFallback = 'true';
}


function getAssociatedCheckableLabels(root, input) {
    if (!root?.querySelectorAll || !input) return [];
    const result = [];
    const seen = new Set();
    const wrapping = input.closest?.('label');
    if (wrapping && root.contains?.(wrapping)) {
        result.push(wrapping);
        seen.add(wrapping);
    }
    for (const label of [...(input.labels || [])]) {
        if (!label || seen.has(label) || !root.contains?.(label)) continue;
        result.push(label);
        seen.add(label);
    }
    const id = String(input.id || '');
    if (id) {
        for (const label of root.querySelectorAll('label[for]')) {
            if (String(label.getAttribute('for') || '') !== id || seen.has(label)) continue;
            result.push(label);
            seen.add(label);
        }
    }
    return result;
}


function checkedVerificationDeclarationIsMeaningful(property, value, pseudoElement = '') {
    const name = String(property || '').trim().toLowerCase();
    const cleanValue = String(value || '').trim().toLowerCase();
    if (pseudoElement && name === 'content') return cleanValue && cleanValue !== 'none' && cleanValue !== 'normal';
    if (['display', 'visibility', 'opacity', 'height', 'max-height', 'min-height', 'transform', 'clip-path', 'filter'].includes(name)) return true;
    if (name === 'content') return true;
    if (name.startsWith('background') || name === 'color' || name.startsWith('border') || name === 'box-shadow' || name === 'text-shadow') return true;
    return false;
}


function checkedVerificationDeclarationCarriesSecondState(property, value, pseudoElement = '') {
    const name = String(property || '').trim().toLowerCase();
    const cleanValue = String(value || '').trim().toLowerCase();
    if (name === 'content') return !!cleanValue && cleanValue !== 'none' && cleanValue !== 'normal' && cleanValue !== '""' && cleanValue !== "''";
    if (pseudoElement) return false;
    if (name === 'display') return cleanValue !== 'none';
    if (name === 'visibility') return cleanValue !== 'hidden' && cleanValue !== 'collapse';
    if (name === 'opacity') return Number.parseFloat(cleanValue) > 0.05;
    if (['height', 'max-height', 'min-height'].includes(name)) return !isCollapsedDimensionValue(cleanValue);
    // A large class of generated interfaces reveals the second state by sliding an
    // overlay into place or blurring/recoloring the previous layer. Treat these as
    // real second-state evidence so the safe sandbox can verify them instead of
    // reporting a false failed label.
    if (name === 'transform') return !!cleanValue && cleanValue !== 'none';
    if (name === 'filter') return !!cleanValue && cleanValue !== 'none';
    return false;
}


function collectLabeledCheckedVerificationTargets(root, input) {
    if (!root || !input) return [];
    const entries = [];
    const entriesByKey = new Map();
    for (const rule of parseCheckedRulesFromText(root, input)) {
        const meaningful = (rule.styleMap || []).some(([property, value]) => (
            checkedVerificationDeclarationIsMeaningful(property, value, rule.pseudoElement)
        ));
        if (!meaningful) continue;
        const secondState = (rule.styleMap || []).some(([property, value]) => (
            checkedVerificationDeclarationCarriesSecondState(property, value, rule.pseudoElement)
        ));
        for (const target of resolveTargetsForCheckedRule(root, input, rule)) {
            if (!target?.isConnected || target === input || !root.contains?.(target)) continue;
            const key = `${rule.pseudoElement || 'self'}|${String(target.tagName || '')}|${String(target.className || '')}|${String(target.id || '')}`;
            const existing = entriesByKey.get(key);
            if (existing) {
                existing.secondState = existing.secondState || secondState;
                continue;
            }
            const entry = { target, pseudoElement: rule.pseudoElement || '', secondState };
            entriesByKey.set(key, entry);
            entries.push(entry);
            target.setAttribute?.(LABELED_CHECKED_VERIFY_TARGET_ATTR, 'true');
            if (entries.length >= 12) return entries;
        }
    }
    return entries;
}


function captureLabeledCheckedTargetState(entry) {
    const target = entry?.target;
    if (!target) return null;
    let computed = null;
    let pseudo = null;
    try {
        computed = typeof getComputedStyle === 'function' ? getComputedStyle(target) : null;
        if (entry.pseudoElement && typeof getComputedStyle === 'function') pseudo = getComputedStyle(target, entry.pseudoElement);
    } catch {
        computed = null;
        pseudo = null;
    }
    let rect = { width: 0, height: 0 };
    try {
        rect = target.getBoundingClientRect?.() || rect;
    } catch {
        // ignore
    }
    const opacity = Number.parseFloat(computed?.opacity || '1');
    return {
        display: String(computed?.display || ''),
        visibility: String(computed?.visibility || ''),
        opacity: Number.isFinite(opacity) ? opacity : 1,
        width: Number(rect.width || 0),
        height: Number(rect.height || 0),
        color: String(computed?.color || ''),
        backgroundColor: String(computed?.backgroundColor || ''),
        transform: String(computed?.transform || ''),
        content: String(pseudo?.content || ''),
    };
}


function labeledCheckedTargetStateChanged(before, after) {
    if (!before || !after) return false;
    for (const key of ['display', 'visibility', 'color', 'backgroundColor', 'transform', 'content']) {
        if (String(before[key] || '') !== String(after[key] || '')) return true;
    }
    if (Math.abs(Number(before.opacity || 0) - Number(after.opacity || 0)) > 0.02) return true;
    if (Math.abs(Number(before.width || 0) - Number(after.width || 0)) > 1) return true;
    if (Math.abs(Number(before.height || 0) - Number(after.height || 0)) > 1) return true;
    return false;
}


function prepareLabeledCheckedVerification(root, input) {
    const labels = getAssociatedCheckableLabels(root, input);
    const targets = collectLabeledCheckedVerificationTargets(root, input);
    return {
        labels,
        targets,
        before: targets.map(entry => captureLabeledCheckedTargetState(entry)),
        beforeChecked: !!input?.checked,
    };
}


function recordLabeledCheckedVerification(root, input, verification, intended, phase, corrected = false) {
    if (!root || !input || !verification) return false;
    const after = verification.targets.map(entry => captureLabeledCheckedTargetState(entry));
    const changedFlags = after.map((snapshot, index) => labeledCheckedTargetStateChanged(verification.before[index], snapshot));
    const changedCount = changedFlags.filter(Boolean).length;
    const secondStateTargetCount = verification.targets.filter(entry => entry.secondState).length;
    const secondStateChangedCount = verification.targets.reduce((count, entry, index) => (
        count + (entry.secondState && changedFlags[index] ? 1 : 0)
    ), 0);
    const checkedMatched = !!input.checked === !!intended;
    const visualMatched = secondStateTargetCount > 0 && secondStateChangedCount > 0;
    const matched = checkedMatched && visualMatched;
    const identity = String(input.id || input.name || input.type || 'control').slice(0, 100);
    const status = matched ? 'verified' : (corrected ? 'corrected' : 'failed');
    input.setAttribute(LABELED_CHECKED_VERIFY_CONTROL_ATTR, status);
    input.setAttribute('aria-pressed', input.checked ? 'true' : 'false');
    root.setAttribute(LABELED_CHECKED_VERIFY_LAST_ATTR, `${identity}:${verification.beforeChecked ? '1' : '0'}>${intended ? '1' : '0'}=${input.checked ? '1' : '0'};targets=${verification.targets.length};changed=${changedCount};second=${secondStateChangedCount}/${secondStateTargetCount}@${phase}:${status}`);
    return matched;
}


export function cancelLabeledCheckedTransitionVerification(input) {
    const state = labeledCheckedVerificationStates.get(input);
    if (!state) return;
    state.sequence = (state.sequence || 0) + 1;
}


function scheduleLabeledCheckedTransitionVerification(root, input, verification, intended, phase = 'label-click') {
    if (!root || !input || !verification) return;
    const state = labeledCheckedVerificationStates.get(input) || { verifiedCount: 0, correctionCount: 0, sequence: 0 };
    const sequence = (state.sequence || 0) + 1;
    state.sequence = sequence;
    labeledCheckedVerificationStates.set(input, state);
    for (const delay of [0, 70, 240]) {
        setTimeout(() => {
            if (state.sequence !== sequence) return;
            if (!root.isConnected || !input.isConnected || !root.contains(input)) return;
            let corrected = false;
            if (input.type === 'radio' && intended && !input.checked) {
                const radioName = String(input.name || '');
                const newerSelectionExists = [...root.querySelectorAll('input[type="radio"]')]
                    .some(item => item !== input
                        && (!radioName || String(item.name || '') === radioName)
                        && item.checked);
                // A later click selected another radio in the same group. This verification belongs
                // to the older click and must never reclaim the group or re-apply its old panel.
                if (newerSelectionExists) return;
            }
            // A healthy native/CSS state needs verification, not another restore +
            // rewrite of all matched rules. Keep every delayed check for late WebView
            // rollbacks, but only apply the fallback when the state actually failed.
            if (!!input.checked === !!intended
                && recordLabeledCheckedVerification(root, input, verification, intended, `${phase}+${delay}ms`)) {
                state.verifiedCount += 1;
                return;
            }
            if (!!input.checked !== !!intended) {
                setRescuedCheckedState(root, input, intended);
                corrected = true;
                state.correctionCount += 1;
            } else {
                applyCheckedVisualFallback(root, input);
                applyRenderedLabelInternalHiddenEntries(root);
            }
            const matched = recordLabeledCheckedVerification(root, input, verification, intended, `${phase}+${delay}ms`, corrected);
            if (matched) state.verifiedCount += 1;
        }, delay);
    }
}


function installLabeledCheckedVerificationFallback(root) {
    if (!root?.querySelectorAll) return 0;
    let count = 0;
    for (const input of root.querySelectorAll('input[type="checkbox"], input[type="radio"]')) {
        if (input.hasAttribute?.(DETACHED_CHECKED_HAS_CONTROL_ATTR)) {
            input.removeAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR);
            continue;
        }
        if (input.disabled || !inputHasAssociatedLabel(root, input) || !inputHasMeaningfulCheckedSiblingRule(root, input)) {
            input.removeAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR);
            continue;
        }
        const verification = prepareLabeledCheckedVerification(root, input);
        if (!verification.labels.length || !verification.targets.some(entry => entry.secondState)) continue;
        if (!input.hasAttribute(LABELED_CHECKED_VERIFY_CONTROL_ATTR)) input.setAttribute(LABELED_CHECKED_VERIFY_CONTROL_ATTR, 'ready');
        count += 1;
    }
    if (count) {
        root.setAttribute(LABELED_CHECKED_VERIFY_ROOT_ATTR, String(count));
        // A restored external mirror can arrive with checked=false controls but stale inline
        // reveal styles saved by an older runtime. At this point verification ownership has
        // been marked on controls/targets, so it is safe to remove those exact stale branches.
        clearUncheckedRadioCheckedInlineArtifacts(root);
    } else {
        root.removeAttribute(LABELED_CHECKED_VERIFY_ROOT_ATTR);
        root.removeAttribute(LABELED_CHECKED_VERIFY_LAST_ATTR);
    }
    return count;
}


function maintenanceProbeElementPath(ancestor, element) {
    if (!ancestor || !element) return null;
    if (ancestor === element) return [];
    const path = [];
    let current = element;
    while (current && current !== ancestor) {
        const parent = current.parentElement;
        if (!parent) return null;
        const index = [...parent.children].indexOf(current);
        if (index < 0) return null;
        path.unshift(index);
        current = parent;
    }
    return current === ancestor ? path : null;
}


function maintenanceProbeElementAtPath(ancestor, path) {
    let current = ancestor;
    for (const index of path || []) {
        current = current?.children?.[index] || null;
        if (!current) return null;
    }
    return current;
}


function sanitizeMaintenanceProbeClone(clone) {
    if (!clone?.querySelectorAll) return;
    clone.querySelectorAll(`[data-rm-image-region], [data-rm-image-portal], script, iframe, object, embed, [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}], [${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}], [${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`)
        .forEach(node => node.remove());
    clone.querySelectorAll('*').forEach(element => {
        for (const attribute of [...element.attributes]) {
            if (/^on[a-z]+$/i.test(attribute.name)) element.removeAttribute(attribute.name);
        }
        if (element.matches?.('audio, video')) {
            element.preload = 'none';
            element.autoplay = false;
        }
        if (element.matches?.('img')) element.loading = 'lazy';
    });
}


function createMaintenanceLabeledCheckedProbeSandbox(root) {
    if (!root?.cloneNode || typeof document === 'undefined' || !document.body) return null;
    const shell = root.closest?.('toto') || root;
    const rootPath = maintenanceProbeElementPath(shell, root);
    if (!rootPath) return null;

    const cloneShell = shell.cloneNode(true);
    sanitizeMaintenanceProbeClone(cloneShell);
    const cloneRoot = maintenanceProbeElementAtPath(cloneShell, rootPath);
    if (!cloneRoot?.querySelectorAll) return null;

    const host = document.createElement('div');
    host.setAttribute(MAINTENANCE_CHECKED_SANDBOX_ATTR, 'true');
    host.setAttribute('aria-hidden', 'true');
    host.inert = true;
    const width = Math.max(280, Math.min(960, Math.round(root.getBoundingClientRect?.().width || 360)));
    host.style.cssText = `all:initial!important;position:fixed!important;left:-100000px!important;top:0!important;width:${width}px!important;min-height:1px!important;opacity:0!important;pointer-events:none!important;overflow:hidden!important;contain:layout style paint!important;z-index:-2147483648!important;`;

    let mount = host;
    try {
        const shadow = host.attachShadow?.({ mode: 'closed' });
        if (shadow) mount = shadow;
    } catch {
        mount = host;
    }
    const quietStyle = document.createElement('style');
    quietStyle.textContent = '*,:before,:after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}';
    mount.append(quietStyle, cloneShell);
    document.body.appendChild(host);
    return { host, root: cloneRoot, destroy: () => host.remove() };
}


function applyMaintenanceSandboxCheckedState(root, input, nextChecked) {
    if (!root || !input || input.disabled) return false;
    if (input.type === 'radio') {
        const radioName = String(input.name || '');
        [...root.querySelectorAll('input[type="radio"]')]
            .filter(item => item !== input && (!radioName || item.name === radioName))
            .forEach(item => { item.checked = false; });
        input.checked = true;
    } else {
        input.checked = !!nextChecked;
    }
    applyCheckedVisualFallback(root, input);
    applyRenderedLabelInternalHiddenEntries(root);
    input.setAttribute('aria-pressed', input.checked ? 'true' : 'false');
    try { void input.offsetHeight; } catch {}
    return !!input.checked === (input.type === 'radio' ? true : !!nextChecked);
}


export function scheduleMaintenanceLabeledCheckedProbe(root, diagnosticState) {
    if (!root?.querySelectorAll) return 0;
    const renderedStateInputs = root.querySelectorAll('input[type="checkbox"], input[type="radio"]').length;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    const rawStateInputs = rawRoot?.querySelectorAll?.('input[type="checkbox"], input[type="radio"]')?.length || 0;
    if (!renderedStateInputs && !rawStateInputs) {
        diagnosticState?.events?.push?.('maintenance-sandbox-probe:not-applicable;原始与渲染均无checkbox/radio，无需验证');
        return 0;
    }
    if (Number.parseInt(root.getAttribute?.(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR) || '0', 10) > 0) {
        diagnosticState?.events?.push?.('maintenance-sandbox-probe:detached-has-route-present;控件与正文状态桥接已安装，未操作真实控件');
        return 0;
    }
    const sandbox = createMaintenanceLabeledCheckedProbeSandbox(root);
    if (!sandbox) {
        diagnosticState?.events?.push?.('maintenance-sandbox-probe:unavailable;未操作真实控件');
        return 0;
    }

    const sandboxRoot = sandbox.root;
    const sandboxStateInputs = [...sandboxRoot.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
    // cloneNode 不会复制 WeakMap 中保存的“修复前内联样式”，却会复制当前已修复后的
    // style=...!important。若直接在副本里取消 checked，旧实现无法恢复原状态，
    // 会把真正有效的跨父层兜底误测成 changed=0。先清理可识别的持久化兜底痕迹，
    // 再按副本当前 checked 状态重新建立一份只属于沙盒的可逆记录。
    clearPersistedCheckedInlineArtifacts(sandboxRoot, sandboxStateInputs);
    for (const stateInput of sandboxStateInputs) {
        if (stateInput.checked) applyCheckedVisualFallback(sandboxRoot, stateInput);
        else restoreInteractionInlineOverrides(stateInput);
        stateInput.setAttribute('aria-pressed', stateInput.checked ? 'true' : 'false');
    }

    const safeCandidates = [...sandboxRoot.querySelectorAll('input[type="checkbox"], input[type="radio"]')].filter(candidate => (
        !candidate.disabled
        && inputHasAssociatedLabel(sandboxRoot, candidate)
        && inputHasMeaningfulCheckedSiblingRule(sandboxRoot, candidate)
        && collectLabeledCheckedVerificationTargets(sandboxRoot, candidate).some(entry => entry.secondState)
    ));
    // Checkbox can be tested in either direction. Radio must use an unchecked member so the
    // sandbox can enter a different branch; re-selecting the already checked radio proves nothing.
    const input = safeCandidates.find(candidate => candidate.type === 'checkbox')
        || safeCandidates.find(candidate => candidate.type === 'radio' && !candidate.checked)
        || null;
    if (!input) {
        sandbox.destroy();
        diagnosticState?.events?.push?.('maintenance-sandbox-probe:no-safe-candidate;未操作真实控件');
        return 0;
    }

    const originalChecked = !!input.checked;
    const intended = input.type === 'radio' ? true : !originalChecked;
    const sandboxInputIndex = sandboxStateInputs.indexOf(input);
    const liveStateInputs = [...root.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
    const liveInput = sandboxInputIndex >= 0 ? liveStateInputs[sandboxInputIndex] : null;
    const verification = prepareLabeledCheckedVerification(sandboxRoot, input);
    if (!verification.targets.some(entry => entry.secondState)) {
        sandbox.destroy();
        diagnosticState?.events?.push?.('maintenance-sandbox-probe:no-second-state;未操作真实控件');
        return 0;
    }

    diagnosticState?.events?.push?.(`maintenance-sandbox-probe:scheduled target=${diagnosticElementName(input)} intended=${intended};真实控件未操作`);

    setTimeout(() => {
        if (!sandbox.host.isConnected || !input.isConnected) return;
        const applied = applyMaintenanceSandboxCheckedState(sandboxRoot, input, intended);
        diagnosticState?.events?.push?.(`maintenance-sandbox-probe:state-set checked=${input.checked} applied=${applied};无click/change/input事件`);
    }, 30);

    setTimeout(() => {
        if (!sandbox.host.isConnected || !input.isConnected) return;
        const matched = recordLabeledCheckedVerification(sandboxRoot, input, verification, intended, 'maintenance-sandbox-probe-observe', false);
        const evidence = String(sandboxRoot.getAttribute?.(LABELED_CHECKED_VERIFY_LAST_ATTR) || '');
        if (evidence) root.setAttribute?.(LABELED_CHECKED_VERIFY_LAST_ATTR, evidence);
        if (liveInput?.hasAttribute?.(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR)) {
            const liveCandidate = findCrossParentCheckedRuleFallbackCandidates(root)
                .find(candidate => candidate.input === liveInput);
            if (matched && liveCandidate) {
                liveInput.setAttribute(CROSS_PARENT_CHECKED_VERIFIED_ATTR, crossParentCheckedCandidateFingerprint(liveCandidate));
            } else {
                liveInput.removeAttribute(CROSS_PARENT_CHECKED_VERIFIED_ATTR);
            }
        }
        diagnosticState?.events?.push?.(`maintenance-sandbox-probe:observed checked=${input.checked} matched=${matched};真实控件保持原状`);
    }, 150);

    setTimeout(() => {
        sandbox.destroy();
        diagnosticState?.events?.push?.('maintenance-sandbox-probe:destroyed;隐藏副本已删除');
    }, 310);
    return 1;
}


function movingLabeledCheckableBridgeMap(root) {
    const entries = new Map();
    if (!root?.querySelectorAll || typeof getComputedStyle !== 'function') return entries;

    const movingSmallLabel = (label) => {
        if (!label?.getBoundingClientRect) return false;
        let rect = null;
        let ownStyle = null;
        try { rect = label.getBoundingClientRect(); } catch { rect = null; }
        try { ownStyle = getComputedStyle(label); } catch { ownStyle = null; }
        // details 尚未展开时 rect 可能为 0，但 CSS/inline 尺寸仍然可靠；不要因此漏装桥接。
        const width = Number(rect?.width || 0)
            || Number.parseFloat(ownStyle?.width || '')
            || Number.parseFloat(label.style?.width || '')
            || 0;
        const height = Number(rect?.height || 0)
            || Number.parseFloat(ownStyle?.height || '')
            || Number.parseFloat(label.style?.height || '')
            || 0;
        // 只接管很小、会随动画持续移动的 label；普通静止按钮继续走原生 click。
        if (!(width > 0 && height > 0 && width <= 52 && height <= 52)) return false;

        let node = label;
        for (let depth = 0; node && depth < 5; depth += 1, node = node.parentElement) {
            if (node !== label && node === root) break;
            let style = null;
            try { style = getComputedStyle(node); } catch { style = null; }
            const names = String(style?.animationName || '').split(',').map(value => value.trim().toLowerCase());
            const durations = String(style?.animationDuration || '').split(',').map(value => value.trim().toLowerCase());
            const animated = names.some(name => name && name !== 'none')
                && durations.some(duration => duration && duration !== '0s' && duration !== '0ms');
            if (animated) return true;
        }
        return false;
    };

    for (const input of root.querySelectorAll('input[type="checkbox"], input[type="radio"]')) {
        if (input.disabled || input.hasAttribute?.(PAIRED_CHECKED_STATE_CONTROL_ATTR)) continue;
        if (!inputHasMeaningfulCheckedSiblingRule(root, input)) continue;
        const secondState = collectLabeledCheckedVerificationTargets(root, input).some(entry => entry.secondState);
        if (!secondState) continue;
        for (const label of getAssociatedCheckableLabels(root, input)) {
            if (label.hasAttribute?.('onclick') || label.hasAttribute?.('onpointerdown') || label.hasAttribute?.('onpointerup')) continue;
            if (!movingSmallLabel(label)) continue;
            entries.set(label, input);
        }
    }
    return entries;
}


function installInteractionLabelFallback(toto) {
    if (!toto || interactionLabelFallbackRoots.has(toto)) return;

    // 旋转轨道上的小 label 在部分 Safari/WebView 中会在 pointerdown 与 pointerup 之间
    // 离开手指位置，浏览器因此不再派发最终 click。只对“动画移动 + 小命中区 + 已证明
    // checked 会打开第二层内容”的高置信 label 建立 pointer 级补偿：先让原生 click 有机会
    // 完成；若 pointerup 后 checked 仍未达到本次点击意图，再补发一次 label.click()。
    // 普通静止 label 不安装这条路线，也不会扩大任何全局点击区。
    const movingBridgeEntries = movingLabeledCheckableBridgeMap(toto);
    if (movingBridgeEntries.size) {
        const pendingPointers = new Map();
        const clearPointer = (pointerId) => {
            const state = pendingPointers.get(pointerId);
            pendingPointers.delete(pointerId);
            try {
                if (state?.label?.hasPointerCapture?.(pointerId)) state.label.releasePointerCapture(pointerId);
            } catch {
                // ignore unsupported/expired pointer capture
            }
            return state || null;
        };
        toto.addEventListener('pointerdown', event => {
            if (event.isPrimary === false || (Number.isFinite(event.button) && event.button !== 0)) return;
            const label = event.target?.closest?.('label');
            if (!label || !toto.contains(label)) return;
            const input = movingBridgeEntries.get(label);
            if (!input?.isConnected || input.disabled) return;
            // 已选 radio 的再次点击可能由“可逆 radio”专项路线解释；这里不抢它的语义。
            if (input.type === 'radio' && input.checked) return;
            const pointerId = Number(event.pointerId);
            if (!Number.isFinite(pointerId)) return;
            pendingPointers.set(pointerId, {
                label,
                input,
                startX: Number(event.clientX || 0),
                startY: Number(event.clientY || 0),
                startedAt: Date.now(),
                intended: input.type === 'radio' ? true : !input.checked,
            });
            try { label.setPointerCapture?.(pointerId); } catch { /* optional */ }
        }, true);
        toto.addEventListener('pointerup', event => {
            const pointerId = Number(event.pointerId);
            const state = Number.isFinite(pointerId) ? clearPointer(pointerId) : null;
            if (!state) return;
            const dx = Number(event.clientX || 0) - state.startX;
            const dy = Number(event.clientY || 0) - state.startY;
            if (Math.hypot(dx, dy) > 24 || Date.now() - state.startedAt > 1200) return;
            setTimeout(() => {
                const { label, input, intended } = state;
                if (!toto.isConnected || !label?.isConnected || !input?.isConnected || input.disabled) return;
                // 正常浏览器会在 pointerup 后同步派发 click，届时现有 label fallback 已经
                // 把状态切到 intended；只有 click 真正丢失时才执行这一条补偿。
                if (!!input.checked === !!intended) return;
                try { label.click?.(); } catch { /* leave the original state untouched */ }
            }, 0);
        }, true);
        toto.addEventListener('pointercancel', event => {
            const pointerId = Number(event.pointerId);
            if (Number.isFinite(pointerId)) clearPointer(pointerId);
        }, true);
        toto.setAttribute('data-rabbit-mirror-moving-label-pointer-bridge', String(movingBridgeEntries.size));
    } else {
        toto.removeAttribute?.('data-rabbit-mirror-moving-label-pointer-bridge');
    }

    // 使用捕获阶段，避免主题或其他插件在内部 stopPropagation 后导致 label 完全点不开。
    toto.addEventListener('click', (event) => {
        const label = event.target?.closest?.('label');
        if (!label || !toto.contains(label)) return;

        const targetId = label.getAttribute('for');
        const input = targetId
            ? [...toto.querySelectorAll('input[id]')].find(el => el.id === targetId)
            : label.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!input || !/^(?:checkbox|radio)$/i.test(input.type || '') || input.disabled) return;
        // PC independent external mirrors with complete native :checked rules do not need
        // the heavy manual checked fallback. Let the browser's label/input/CSS path run.
        if (toto.getAttribute?.(INDEPENDENT_NATIVE_CHECKED_RESTORE_ATTR) === 'true'
            && inputHasMeaningfulCheckedSiblingRule(toto, input)) return;
        const labeledVerification = input.hasAttribute?.(DETACHED_CHECKED_HAS_CONTROL_ATTR)
            ? null
            : prepareLabeledCheckedVerification(toto, input);
        // 双向频道／画面切换由专项路线独占，避免通用 label 兜底把“返回”控件重新勾上。
        if (input.hasAttribute(PAIRED_CHECKED_STATE_CONTROL_ATTR)) return;

        // 浏览器/主题层有时不会可靠触发隐藏 input；只在当前兔子镜内手动完成一次。
        event.preventDefault();
        const previous = !!input.checked;
        const intendedChecked = input.type === 'radio' ? true : !previous;
        if (input.type === 'radio') {
            // 将同组切换作为一个原子操作：取消所有旧点击的延迟验证，撤回旧分支，
            // 再只启用当前分支。否则旧 radio 的 +240ms 验证可能把自己重新勾上。
            const radioName = String(input.name || '');
            const group = [...toto.querySelectorAll('input[type="radio"]')]
                .filter(item => !radioName || String(item.name || '') === radioName);
            for (const item of group) {
                cancelLabeledCheckedTransitionVerification(item);
                if (item !== input) item.checked = false;
                restoreInteractionInlineOverrides(item);
                if (item !== input) item.setAttribute?.('aria-pressed', 'false');
            }
            clearUncheckedRadioCheckedInlineArtifacts(toto, group.filter(item => item !== input));
            input.checked = true;
        } else {
            input.checked = !input.checked;
        }

        // 在部分移动端 WebView 中，晚到的 <style> 即使被补上 !important，
        // 也可能未稳定覆盖元素原有的内联 display:none。这里直接按真实 :checked
        // 规则把状态声明落到匹配目标上，取消勾选时再恢复，作为最终兜底。
        // 先走不依赖 CSSOM 的文本解析兜底；酒馆/WebView 即使不给 style.sheet，仍能修复。
        // 文本规则命中后不要再运行 CSSOM 兜底，否则后者开头的恢复动作会撤销刚应用的状态。
        applyCheckedVisualFallback(toto, input);
        // label 内隐藏正文已有明确结构路线时，立即按本次 intended checked 状态落地，
        // 不只依赖后续冒泡 change；部分 WebView 会延迟或吞掉合成事件。
        applyRenderedLabelInternalHiddenEntries(toto);

        if (previous !== input.checked) {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (labeledVerification) {
            scheduleLabeledCheckedTransitionVerification(toto, input, labeledVerification, intendedChecked, 'label-click');
        } else {
            input.removeAttribute?.(LABELED_CHECKED_VERIFY_CONTROL_ATTR);
            toto.removeAttribute?.(LABELED_CHECKED_VERIFY_LAST_ATTR);
        }

        // 某些移动 WebView 会在捕获阶段 preventDefault 后仍执行一次迟到的原生 label 切换，
        // 使 checkbox 刚被急救器设为 true 又立刻回到 false。下一任务强制确认本次意图，
        // 仅在状态被回滚时补发一次 input/change，不造成正常环境的双重切换。
        setTimeout(() => {
            if (!input.isConnected || input.checked === intendedChecked) return;
            if (input.type === 'radio') {
                const radioName = String(input.name || '');
                const group = [];
                for (const item of toto.querySelectorAll('input[type="radio"]')) {
                    if (radioName && String(item.name || '') !== radioName) continue;
                    group.push(item);
                    if (item === input) continue;
                    cancelLabeledCheckedTransitionVerification(item);
                    item.checked = false;
                    restoreInteractionInlineOverrides(item);
                    item.setAttribute?.('aria-pressed', 'false');
                }
                clearUncheckedRadioCheckedInlineArtifacts(toto, group.filter(item => item !== input));
            }
            input.checked = intendedChecked;
            restoreInteractionInlineOverrides(input);
            if (input.type === 'radio' && input.hasAttribute?.(CROSS_PARENT_CHECKED_RULE_RESCUE_ATTR)) {
                syncCrossParentCheckedRuleFallback(toto);
            } else {
                applyCheckedVisualFallback(toto, input);
            }
            applyRenderedLabelInternalHiddenEntries(toto);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }, 0);
    }, true);

    interactionLabelFallbackRoots.add(toto);
    toto.dataset.rabbitMirrorInteractionFallback = 'true';
}


