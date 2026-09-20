// Split from outputSanitizer.js — scriptedInteractionRescue.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { applyRabbitMirrorBannedWordsToDom, filterRabbitMirrorVisibleTextValue } from '../bannedWords.js?rmv=1.5.53-cn-boundary1';
import {
    FEEDBACK_CAT_ATTR,
    MAINTENANCE_RABBIT_ATTR,
    MIRROR_TOTO_SELECTOR,
    RAW_SELF_MUTATION_ACTIVE_ATTR,
    RAW_SELF_MUTATION_HTML_BASELINE_ATTR,
    RECIPE_BUTTON_ATTR,
    REVERSIBLE_STYLE_BASELINE_ATTR,
    REVERSIBLE_TEXT_BASELINE_ATTR,
    TOOL_ENTRY_HOST_ATTR,
    clearMirrorTitleDisplayArtifacts,
    escapeCssIdentifier,
    escapeRegExp,
    getRabbitMirrorLocalStyleElements,
    getRenderedRabbitMirrorInteractionRoots,
    isRabbitMirrorDetails,
} from './runtime.js?rmv=1.5.63';
import {
    CHANGE_PSEUDO_RESCUE_ATTR,
    DETACHED_CHECKED_HAS_RULE_COUNT_ATTR,
    DIRECT_ID_CLASS_STATE_RESCUE_ATTR,
    DIRECT_ID_CLICK_RESCUE_ATTR,
    HINTED_PSEUDO_RESCUE_ATTR,
    INLINE_PSEUDO_RESCUE_ATTR,
    PASSPORT_DOCUMENT_CLOSE_ATTR,
    PASSPORT_DOCUMENT_COVER_ATTR,
    PASSPORT_DOCUMENT_HOST_ATTR,
    PASSPORT_DOCUMENT_OPEN_ATTR,
    PASSPORT_DOCUMENT_PAGES_ATTR,
    PASSPORT_DOCUMENT_RESCUE_ATTR,
    PASSPORT_DOCUMENT_STAMP_ACTIVE_ATTR,
    PASSPORT_DOCUMENT_STAMP_ATTR,
    PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR,
    PASSPORT_DOCUMENT_STAMP_INDEX_ATTR,
    PASSPORT_DOCUMENT_STYLE_ATTR,
    PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR,
    PSEUDO_ACTIVE_ATTR,
    RAW_HOVER_DECORATION_RESTORE_ATTR,
    RAW_HOVER_PSEUDO_RESCUE_ATTR,
    RAW_NAMED_FUNCTION_RESCUE_ATTR,
    RAW_SCRIPT_TIMELINE_RESCUE_ATTR,
    RAW_SCRIPT_TIMELINE_ROOT_ATTR,
    RAW_SCRIPT_TIMELINE_STATE_ATTR,
    REVERSIBLE_CHECKED_RESULT_ROOT_ATTR,
    directIdClassOperationTriggerStates,
    directIdClassStateStates,
    interactionCapabilityStates,
    passportDocumentRescueStates,
    pseudoInteractionStates,
    restoreInteractionInlineOverrides,
    reversibleStyleBaselineStates,
    reversibleTextBaselineStates,
    syncCrossParentCheckedRuleFallback,
} from './checkedStateRescue.js?rmv=1.5.63';
import {
    EXISTING_INTERACTIVE_SELECTOR,
    PSEUDO_INTERACTION_HINT_RE,
    applyRenderedLabelInternalHiddenEntries,
    bindCheckedChangeProgram,
    collectInlineAssignments,
    dispatchRescuedInputState,
    hasRenderedButtonAdjacentHiddenCandidates,
    hasRenderedClickableAdjacentHiddenCandidates,
    hasRenderedClickableAdjacentPopupCandidates,
    hasRenderedContainerInternalRevealCandidates,
    hasRenderedCssStateSiblingCandidates,
    hasRenderedListDetailCandidates,
    hasRenderedMaskRevealCandidates,
    normalizeStylePropertyName,
    parseCheckedChangeStyleProgram,
    parseCheckedChangeStyleProgramFromSource,
    parseInlineStyleAssignments,
    resolveCheckedRelativeElementExpression,
    resolveScopedPseudoId,
    sanitizeRecoveredInteractionStyleAssignments,
} from './renderedStateRescue.js?rmv=1.5.63';
import { cancelLabeledCheckedTransitionVerification, setRescuedCheckedState } from './fallbackRescue.js?rmv=1.5.63';
import {
    DISABLED_ONLY_CHOICE_RESCUE_ATTR,
    FILL_IN_CHOICE_COUNT_ATTR,
    INERT_ACTION_BUTTON_RESCUE_ATTR,
    INERT_ACTION_STATUS_ATTR,
    MOBILE_LAYOUT_BREAKPOINT_PX,
    RESAY_ATTR,
    SELECTION_ONLY_FALLBACK_ATTR,
    STATIC_CHOICE_SELECTION_COUNT_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR,
} from './diagnostics.js?rmv=1.5.63';
import {
    checkedDeclarationCreatesContentReveal,
    getRenderedMessageElement,
    getSelectedMessageSource,
    isIndependentMaintenanceRoot,
    maintenanceMessageSourceCandidates,
    normalizeMaintenanceSummaryText,
} from './maintenanceInspect.js?rmv=1.5.63';
import {
    decodeHtmlEntities,
    normalizeMirrorAttribute,
    rescueDamagedDataUriRabbitMirrorOutput,
    validateRabbitMirrorMarkupLexicalBudget,
} from './markup.js?rmv=1.5.63';
import { getMessageIndexFromMirrorNode, hostScriptModule, messageUsesDistinctDisplaySource } from './lifecycle.js?rmv=1.5.63';

export const RAW_RADIO_RESET_RESCUE_ATTR = 'data-rabbit-mirror-radio-reset-rescue';

export const RAW_RADIO_RESET_ROOT_ATTR = 'data-rabbit-mirror-radio-reset-count';

export const RAW_RADIO_RESET_LAST_ATTR = 'data-rabbit-mirror-radio-reset-last';

const rawRadioResetRescueStates = new WeakMap();


const RABBIT_MIRROR_NON_CONTENT_TEXT_TAGS = new Set(['STYLE', 'SCRIPT', 'TEMPLATE', 'NOSCRIPT']);


export const RAW_SELF_MUTATION_RESCUE_ATTR = 'data-rabbit-mirror-self-mutation-rescue';

export const rawSelfMutationRescueStates = new WeakMap();

const rawSelfMutationDomBaselines = new WeakMap();


const RAW_SCRIPT_TIMELINE_ALLOWED_STYLE_PROPERTIES = new Set([
    'animation', 'background', 'background-color', 'border', 'border-left', 'border-right', 'border-top', 'border-bottom',
    'box-shadow', 'color', 'display', 'filter', 'height', 'left', 'opacity', 'pointer-events', 'right', 'top',
    'transform', 'visibility', 'width', 'z-index',
]);

const rawScriptTimelineRescueStates = new WeakMap();


function installCheckedChangePseudoInteractionRescue(root) {
    if (!root?.querySelectorAll) return;
    const candidates = [...root.querySelectorAll('input[type="checkbox"][onchange], input[type="radio"][onchange]')];

    for (const input of candidates) {
        if (input.hasAttribute(CHANGE_PSEUDO_RESCUE_ATTR)) continue;
        const states = parseCheckedChangeStyleProgram(input, root);
        if (!states?.length) continue;
        bindCheckedChangeProgram(input, states);
    }
}


function readReversibleStyleBaseline(element) {
    if (!element?.style) return new Map();
    const remembered = reversibleStyleBaselineStates.get(element);
    if (remembered) return remembered;

    const baseline = new Map();
    const encoded = element.getAttribute?.(REVERSIBLE_STYLE_BASELINE_ATTR) || '';
    if (encoded) {
        try {
            const parsed = JSON.parse(decodeURIComponent(encoded));
            if (parsed && typeof parsed === 'object') {
                const entries = Object.entries(parsed).map(([property, state]) => ({
                    property,
                    value: String(state?.value || ''),
                    priority: String(state?.priority || '').toLowerCase() === 'important' ? 'important' : '',
                }));
                const valued = entries.filter(entry => entry.value);
                const removedProperties = entries.filter(entry => !entry.value).map(entry => entry.property);
                const safe = valued.length
                    ? sanitizeRecoveredInteractionStyleAssignments(element, valued, { removedProperties })
                    : [];
                if (!valued.length || safe.length === valued.length) {
                    for (const entry of entries) {
                        const property = normalizeStylePropertyName(entry.property);
                        if (!property || property.startsWith('--')) continue;
                        baseline.set(property, { value: entry.value, priority: entry.priority });
                    }
                } else {
                    element.removeAttribute?.(REVERSIBLE_STYLE_BASELINE_ATTR);
                }
            }
        } catch {
            // 损坏或旧格式的本地标记直接忽略，并从当前原始 DOM 重新建立。
        }
    }
    reversibleStyleBaselineStates.set(element, baseline);
    return baseline;
}


function persistReversibleStyleBaseline(element, baseline) {
    if (!element?.setAttribute || !baseline?.size) return;
    try {
        const serializable = Object.fromEntries([...baseline.entries()].map(([property, state]) => [property, {
            value: String(state?.value || ''),
            priority: String(state?.priority || ''),
        }]));
        element.setAttribute(REVERSIBLE_STYLE_BASELINE_ATTR, encodeURIComponent(JSON.stringify(serializable)));
    } catch {
        // data 属性写入失败时，WeakMap 中的当前会话基线仍可使用。
    }
}


export function capturePseudoStyleState(element, properties) {
    const captured = new Map();
    if (!element?.style) return captured;
    const baseline = readReversibleStyleBaseline(element);
    let changed = false;

    for (const property of properties) {
        if (!baseline.has(property)) {
            baseline.set(property, {
                value: element.style.getPropertyValue(property) || '',
                priority: element.style.getPropertyPriority(property) || '',
            });
            changed = true;
        }
        const state = baseline.get(property) || { value: '', priority: '' };
        captured.set(property, { value: state.value, priority: state.priority });
    }
    if (changed) persistReversibleStyleBaseline(element, baseline);
    return captured;
}


export function getCapturedStyleValue(captured, property) {
    return String(captured?.get?.(property)?.value || '').trim();
}


export function captureStableTextState(element) {
    if (!element) return '';
    if (reversibleTextBaselineStates.has(element)) return reversibleTextBaselineStates.get(element);

    let value = '';
    const encoded = element.getAttribute?.(REVERSIBLE_TEXT_BASELINE_ATTR) || '';
    if (encoded) {
        try {
            value = decodeURIComponent(encoded);
        } catch {
            value = '';
        }
    }
    if (!encoded) {
        value = String(element.textContent || '');
        try {
            if (value.length <= 4000) element.setAttribute(REVERSIBLE_TEXT_BASELINE_ATTR, encodeURIComponent(value));
        } catch {
            // WeakMap fallback remains available.
        }
    }
    reversibleTextBaselineStates.set(element, value);
    return value;
}


export function applyPseudoStyleAssignments(element, assignments) {
    const safeAssignments = sanitizeRecoveredInteractionStyleAssignments(element, assignments);
    if (!safeAssignments.length) return 0;
    let applied = 0;
    for (const { property, value } of safeAssignments) {
        element.style?.setProperty?.(property, value, 'important');
        applied += 1;
    }
    return applied;
}


export function restorePseudoStyleState(element, captured) {
    const entries = [...(captured || [])].map(([property, previous]) => ({
        property,
        value: String(previous?.value || ''),
        priority: String(previous?.priority || '').toLowerCase() === 'important' ? 'important' : '',
    }));
    const valued = entries.filter(entry => entry.value);
    const removedProperties = entries.filter(entry => !entry.value).map(entry => entry.property);
    const safe = valued.length
        ? sanitizeRecoveredInteractionStyleAssignments(element, valued, { removedProperties })
        : [];
    const canRestoreValues = safe.length === valued.length;
    let restored = 0;
    for (const entry of entries) {
        if (entry.value) {
            if (!canRestoreValues) continue;
            element.style?.setProperty?.(normalizeStylePropertyName(entry.property), entry.value, entry.priority);
        } else {
            element.style?.removeProperty?.(normalizeStylePropertyName(entry.property));
        }
        restored += 1;
    }
    return restored;
}


function setPseudoInteractionState(state, active) {
    if (!state?.target) return;
    state.active = !!active;
    if (state.active) {
        applyPseudoStyleAssignments(state.target, state.activeAssignments);
        state.target.setAttribute(PSEUDO_ACTIVE_ATTR, 'true');
    } else {
        restorePseudoStyleState(state.target, state.originalStyles);
        applyPseudoStyleAssignments(state.target, state.inactiveAssignments);
        state.target.removeAttribute(PSEUDO_ACTIVE_ATTR);
    }
    state.trigger?.setAttribute?.('aria-pressed', state.active ? 'true' : 'false');
}


function isPseudoTriggerUsable(element) {
    if (!element?.style) return false;
    const display = String(element.style.getPropertyValue('display') || '').trim().toLowerCase();
    const visibility = String(element.style.getPropertyValue('visibility') || '').trim().toLowerCase();
    const pointerEvents = String(element.style.getPropertyValue('pointer-events') || '').trim().toLowerCase();
    return display !== 'none' && visibility !== 'hidden' && pointerEvents !== 'none';
}


export function preparePseudoTrigger(trigger) {
    if (!trigger?.setAttribute) return;
    const tagName = String(trigger.tagName || '').toLowerCase();
    const alreadyInteractive = /^(?:a|button|input|label|summary|select|textarea)$/.test(tagName)
        || trigger.hasAttribute('tabindex')
        || trigger.hasAttribute('role');
    if (!alreadyInteractive) {
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');
    }
    trigger.setAttribute('aria-pressed', 'false');
    if (!trigger.style?.getPropertyValue?.('cursor')) trigger.style?.setProperty?.('cursor', 'pointer');
}


export function shouldIgnorePseudoToggleEvent(event, trigger) {
    const interactive = event.target?.closest?.(EXISTING_INTERACTIVE_SELECTOR);
    return !!(interactive && interactive !== trigger && trigger?.contains?.(interactive));
}


function bindPseudoToggle(trigger, state) {
    if (!trigger?.addEventListener || !state) return;
    preparePseudoTrigger(trigger);

    trigger.addEventListener('click', event => {
        if (shouldIgnorePseudoToggleEvent(event, trigger)) return;
        setPseudoInteractionState(state, !state.active);
    }, false);

    trigger.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setPseudoInteractionState(state, !state.active);
    }, false);
}


function findHintedHiddenLayerPairs(root) {
    if (!root?.querySelectorAll) return [];
    const pairs = [];
    const hints = [...root.querySelectorAll('div, p, span, small, em, strong')]
        .filter(element => {
            const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
            return text && text.length <= 100 && PSEUDO_INTERACTION_HINT_RE.test(text);
        });

    for (const hint of hints) {
        const host = hint.parentElement;
        if (!host || !root.contains(host)) continue;
        const candidates = [...host.children].filter(candidate => {
            if (candidate === hint || candidate.contains(hint) || candidate.hasAttribute(HINTED_PSEUDO_RESCUE_ATTR) || candidate.hasAttribute(INLINE_PSEUDO_RESCUE_ATTR)) return false;
            const opacity = Number.parseFloat(candidate.style?.getPropertyValue?.('opacity') || '');
            const visibility = String(candidate.style?.getPropertyValue?.('visibility') || '').trim().toLowerCase();
            const hidden = (Number.isFinite(opacity) && opacity <= 0.05) || visibility === 'hidden';
            if (!hidden) return false;

            const position = String(candidate.style?.getPropertyValue?.('position') || '').trim().toLowerCase();
            const width = String(candidate.style?.getPropertyValue?.('width') || '').trim();
            const height = String(candidate.style?.getPropertyValue?.('height') || '').trim();
            const inset = String(candidate.style?.getPropertyValue?.('inset') || '').trim();
            const looksLikeLayer = /^(?:absolute|fixed)$/.test(position)
                && (width === '100%' || height === '100%' || inset === '0' || inset === '0px');
            if (!looksLikeLayer) return false;

            const animatedDescendant = candidate.querySelector?.('[style*="animation"], animate, animateTransform');
            const meaningfulContent = String(candidate.textContent || '').replace(/\s+/g, ' ').trim().length >= 12;
            return !!animatedDescendant || meaningfulContent;
        });
        if (!candidates.length) continue;
        pairs.push({ hint, host, target: candidates[0] });
    }
    return pairs;
}


function hasPseudoInteractionCandidates(root) {
    if (!root?.querySelectorAll) return false;
    if (root.querySelector('[onmouseover], [onmouseenter], [onmouseout], [onmouseleave], [onclick], [onchange]')) return true;
    return findHintedHiddenLayerPairs(root).length > 0;
}



export function decodeSafeInlineString(value) {
    return String(value || '')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\(['"\\])/g, '$1');
}


function getSafeClassTokens(value) {
    return String(value || '')
        .split(/\s+/)
        .map(token => token.trim())
        .filter(token => /^[a-zA-Z_][\w-]*$/.test(token));
}


function inferRenderedClassPrefix(target, rawTokens, root) {
    const currentTokens = [...(target?.classList || [])];
    const scores = new Map();
    for (const rawToken of rawTokens || []) {
        for (const currentToken of currentTokens) {
            if (currentToken === rawToken) scores.set('', (scores.get('') || 0) + 3);
            else if (currentToken.endsWith(rawToken)) {
                const prefix = currentToken.slice(0, -rawToken.length);
                if (/^[a-zA-Z0-9_-]+$/.test(prefix)) scores.set(prefix, (scores.get(prefix) || 0) + 2);
            }
        }
    }

    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    if (ranked.length) return ranked[0][0];

    const cssText = [...(root?.querySelectorAll?.('style') || [])]
        .map(style => style.textContent || '')
        .join('\n');
    if ((rawTokens || []).some(token => new RegExp(`\\.custom-${escapeRegExp(token)}(?![\\w-])`).test(cssText))) {
        return 'custom-';
    }
    return '';
}


function buildDirectIdClassStateAction(target, rawClassValue, root) {
    const rawTokens = getSafeClassTokens(decodeSafeInlineString(rawClassValue));
    if (!target?.classList || !rawTokens.length) return null;
    const prefix = inferRenderedClassPrefix(target, rawTokens, root);
    const classes = [...new Set(rawTokens.map(token => {
        if (target.classList.contains(token)) return token;
        if (prefix && target.classList.contains(`${prefix}${token}`)) return `${prefix}${token}`;
        return `${prefix}${token}`;
    }))];
    return classes.length ? { type: 'class-state', target, classes } : null;
}


function applyDirectIdClassState(action) {
    const target = action?.target;
    if (!target?.classList || !Array.isArray(action.classes)) return;

    let state = directIdClassStateStates.get(target);
    if (!state) {
        state = {
            baseline: new Set([...target.classList]),
            applied: new Set(),
        };
        directIdClassStateStates.set(target, state);
    }

    for (const className of state.applied) {
        if (!state.baseline.has(className)) target.classList.remove(className);
    }
    for (const className of state.baseline) target.classList.add(className);
    for (const className of action.classes) target.classList.add(className);

    state.applied = new Set(action.classes.filter(className => !state.baseline.has(className)));
}


function collectDirectIdClickAssignments(scriptText, root, rawRoot = null) {
    const source = String(scriptText || '');
    if (!source || !/document\s*\.\s*getElementById\s*\(/i.test(source)) return null;

    const matches = [];
    const addMatch = (match, action) => {
        matches.push({ start: match.index, end: match.index + match[0].length, action });
    };


    const resolveRawIdTarget = rawId => {
        const id = String(rawId || '').trim();
        if (!rawRoot?.querySelectorAll || !id) return null;
        return [...rawRoot.querySelectorAll('[id]')].find(element => element.id === id) || null;
    };
    const buildClassOperationAction = (rawId, rawClassName, operation) => {
        const target = resolveScopedPseudoId(root, rawId);
        const rawTarget = resolveRawIdTarget(rawId);
        const classToken = String(rawClassName || '').trim();
        if (!target?.classList || !rawTarget?.classList || !/^[a-zA-Z_][\w-]*$/.test(classToken)) return null;
        const prefix = inferRenderedClassPrefix(target, [...rawTarget.classList], root);
        const className = target.classList.contains(classToken) ? classToken : `${prefix || ''}${classToken}`;

        // 仅恢复在原始／渲染 CSS 中真实出现过的状态 class，避免把任意 onclick 变成无依据状态机。
        const rawCssText = [...(rawRoot.querySelectorAll?.('style') || [])].map(style => style.textContent || '').join('\n');
        const renderedCssText = [...(root.querySelectorAll?.('style') || [])].map(style => style.textContent || '').join('\n');
        const rawEvidence = new RegExp(`\\.${escapeRegExp(classToken)}(?![\\w-])`).test(rawCssText)
            || rawTarget.classList.contains(classToken);
        const renderedEvidence = new RegExp(`\\.${escapeRegExp(className)}(?![\\w-])`).test(renderedCssText)
            || target.classList.contains(className);
        if (!rawEvidence || !renderedEvidence) return null;
        return { type: `class-${operation}`, target, className };
    };

    // document.getElementById('id').checked = true/false;
    // 仅接受固定布尔值与当前兔子镜内真实 checkbox/radio，不执行任意表达式。
    const checkedRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*checked\s*=\s*(true|false)\s*;?/gi;
    let match;
    while ((match = checkedRe.exec(source))) {
        const target = resolveScopedPseudoId(root, match[2]);
        if (!target?.matches?.('input[type="checkbox"], input[type="radio"]')) return null;
        addMatch(match, { type: 'checked', target, value: String(match[3]).toLowerCase() === 'true', root });
    }

    // document.getElementById('id').style.left = '70%';
    const styleDotRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*style\s*\.\s*([a-zA-Z][\w]*)\s*=\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*;?/g;
    while ((match = styleDotRe.exec(source))) {
        const target = resolveScopedPseudoId(root, match[2]);
        const property = normalizeStylePropertyName(match[3]);
        const value = decodeSafeInlineString(match[5]);
        if (!target || !property || !value) return null;
        addMatch(match, { type: 'style', target, property, value });
    }

    // document.getElementById('id').style['left'] = '70%';
    const styleBracketRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*style\s*\[\s*(['"])([a-zA-Z-]+)\3\s*\]\s*=\s*(['"])((?:\\.|(?!\5)[\s\S])*)\5\s*;?/g;
    while ((match = styleBracketRe.exec(source))) {
        const target = resolveScopedPseudoId(root, match[2]);
        const property = normalizeStylePropertyName(match[4]);
        const value = decodeSafeInlineString(match[6]);
        if (!target || !property || !value) return null;
        addMatch(match, { type: 'style', target, property, value });
    }

    // document.getElementById('id').innerText/textContent = '...';
    const textRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*(innerText|textContent)\s*=\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*;?/g;
    while ((match = textRe.exec(source))) {
        const target = resolveScopedPseudoId(root, match[2]);
        const value = decodeSafeInlineString(match[5]);
        if (!target) return null;
        addMatch(match, { type: 'text', target, value });
    }

    // document.getElementById('id').classList.toggle/add/remove('active');
    // 只接受固定 ID、固定 class 与三种有限操作；按原目标 class 推导宿主前缀，绝不执行原始 JavaScript。
    const classOperationRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*classList\s*\.\s*(toggle|add|remove)\s*\(\s*(['"])([a-zA-Z_][\w-]*)\4\s*\)\s*;?/gi;
    while ((match = classOperationRe.exec(source))) {
        const action = buildClassOperationAction(match[2], match[5], String(match[3] || '').toLowerCase());
        if (!action) return null;
        addMatch(match, action);
    }

    // document.getElementById('id').className = 'base active';
    // 只接受固定字符串，并把酒馆自动加入的 custom- 前缀映射回当前安全 DOM。
    const classNameRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*className\s*=\s*(['"])((?:\\.|(?!\3)[\s\S])*)\3\s*;?/g;
    while ((match = classNameRe.exec(source))) {
        const target = resolveScopedPseudoId(root, match[2]);
        const action = buildDirectIdClassStateAction(target, match[4], root);
        if (!action) return null;
        addMatch(match, action);
    }

    if (!matches.length) return null;
    matches.sort((a, b) => a.start - b.start);

    // 只接受由上述明确赋值与空白/分号组成的脚本。任何未知语句都会放弃，绝不部分执行。
    let cursor = 0;
    let remainder = '';
    for (const item of matches) {
        if (item.start < cursor) continue;
        remainder += source.slice(cursor, item.start);
        cursor = item.end;
    }
    remainder += source.slice(cursor);
    if (remainder.replace(/[\s;]+/g, '') !== '') return null;

    return matches.map(item => item.action);
}


function applyDirectIdClickAssignments(actions) {
    for (const action of actions || []) {
        if (!action?.target) continue;
        if (action.type === 'style') {
            applyPseudoStyleAssignments(action.target, [action]);
        } else if (action.type === 'text') {
            if (isRabbitMirrorRuntimeTextTarget(action.target)) action.target.textContent = filterRabbitMirrorRuntimeText(action.value);
        } else if (action.type === 'checked') {
            const actionRoot = action.root?.contains?.(action.target)
                ? action.root
                : action.target.closest?.(MIRROR_TOTO_SELECTOR) || action.target.closest?.('details');
            if (actionRoot && action.target.type === 'radio' && action.value === false) {
                const previous = !!action.target.checked;
                action.target.checked = false;
                restoreInteractionInlineOverrides(action.target);
                if (previous) dispatchRescuedInputState(action.target);
            } else if (actionRoot) {
                setRescuedCheckedState(actionRoot, action.target, action.value);
            }
        } else if (action.type === 'class-state') {
            applyDirectIdClassState(action);
        } else if (action.type === 'class-toggle') {
            action.target.classList.toggle(action.className);
        } else if (action.type === 'class-add') {
            action.target.classList.add(action.className);
        } else if (action.type === 'class-remove') {
            action.target.classList.remove(action.className);
        }
    }
}


function installDirectIdClickProgramRescue(root) {
    if (!root?.querySelectorAll) return;
    const candidates = [...root.querySelectorAll('[onclick]')];

    for (const trigger of candidates) {
        if (trigger.hasAttribute(DIRECT_ID_CLICK_RESCUE_ATTR)) continue;
        const source = trigger.getAttribute('onclick');
        const actions = collectDirectIdClickAssignments(source, root);
        if (!actions?.length) continue;

        preparePseudoTrigger(trigger);
        const activate = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, trigger)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            if (event?.type === 'change' && trigger.matches?.('input[type="radio"]') && !trigger.checked) return;
            applyDirectIdClickAssignments(actions);
        };

        trigger.addEventListener('click', activate, false);
        trigger.addEventListener('keydown', activate, false);
        if (trigger.matches?.('input[type="checkbox"], input[type="radio"]')) {
            trigger.addEventListener('change', activate, false);
        }
        trigger.removeAttribute('onclick');
        trigger.removeAttribute('aria-pressed');
        trigger.setAttribute(DIRECT_ID_CLICK_RESCUE_ATTR, 'true');
    }
}



export function getRabbitMirrorSummaryText(root) {
    const summary = root?.querySelector?.('summary');
    if (!summary) return '';
    const clone = summary.cloneNode?.(true);
    if (clone?.querySelectorAll) {
        clone.querySelectorAll(`[data-rm-image-region], [data-rm-image-portal], [${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`).forEach(node => node.remove());
    }
    return String((clone || summary).textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
}


export function getAvailableHostChat() {
    try {
        const contextChat = globalThis.SillyTavern?.getContext?.()?.chat;
        if (Array.isArray(contextChat)) return contextChat;
    } catch {
        // Fall through to the imported script module.
    }

    if (Array.isArray(hostScriptModule?.chat)) return hostScriptModule.chat;
    if (Array.isArray(globalThis.chat)) return globalThis.chat;
    return [];
}


export function getExternalOwnerMessageIndex(node) {
    const shell = node?.closest?.('[data-rabbit-mirror-external-shell][data-rm-owner-mesid], [data-rabbit-mirror-external-source][data-rm-owner-mesid]');
    const value = Number(shell?.getAttribute?.('data-rm-owner-mesid'));
    return Number.isInteger(value) && value >= 0 ? value : -1;
}


export function getAssistantMessageForRenderedRoot(root) {
    const chat = getAvailableHostChat();
    if (!chat.length || !root?.closest) return null;

    const externalIndex = getExternalOwnerMessageIndex(root);
    if (externalIndex >= 0 && chat[externalIndex] && !chat[externalIndex]?.is_user) return chat[externalIndex];

    const messageElement = root.closest('.mes, [mesid], [data-message-id], [data-messageid]');
    const rawMessageId = messageElement?.getAttribute?.('mesid')
        ?? messageElement?.getAttribute?.('data-message-id')
        ?? messageElement?.getAttribute?.('data-messageid')
        ?? messageElement?.dataset?.messageId
        ?? messageElement?.dataset?.messageid;
    const numericId = Number.parseInt(String(rawMessageId ?? ''), 10);
    if (Number.isInteger(numericId) && chat[numericId] && !chat[numericId]?.is_user) {
        return chat[numericId];
    }

    const summary = getRabbitMirrorSummaryText(root);
    if (!summary) return null;
    for (let index = chat.length - 1; index >= Math.max(0, chat.length - 12); index -= 1) {
        const item = chat[index];
        if (item?.is_user) continue;
        const sources = maintenanceMessageSourceCandidates(item);
        if (sources.some(candidate => candidate.source.includes(summary))) return item;
    }
    return null;
}


export function getRawAssistantMessageForRenderedRoot(root) {
    const externalShell = root?.closest?.('[data-rabbit-mirror-external-shell][data-rm-source="independent"]');
    const independentSource = externalShell?.__rabbitMirrorIndependentSource;
    if (typeof independentSource === 'string' && independentSource.trim()) return independentSource;

    const message = getAssistantMessageForRenderedRoot(root);
    if (!message) return '';
    // Keep every maintenance reader on the same current-source rule as source repair:
    // an independent display source is authoritative; otherwise prefer the selected
    // Swipe before mes and use display_text only as the final same-message fallback.
    return getSelectedMessageSource(message, { preferDisplay: messageUsesDistinctDisplaySource(message) });
}


function collectRawRabbitMirrorRoots(rawHtml) {
    if (!rawHtml || typeof document === 'undefined') return [];
    try {
        if (!validateRabbitMirrorMarkupLexicalBudget(rawHtml)) return [];
        // 原始消息可能含会截断 inline style 的未编码 SVG Data URI。
        // 先在字符串层移除损坏的背景声明，再交给 template 解析；否则后续安全事件回读也会失去真实 DOM 路径。
        const prepared = rescueDamagedDataUriRabbitMirrorOutput(
            decodeHtmlEntities(normalizeMirrorAttribute(String(rawHtml))),
        );
        if (!validateRabbitMirrorMarkupLexicalBudget(prepared)) return [];
        const template = document.createElement('template');
        template.innerHTML = prepared;
        const roots = [...template.content.querySelectorAll(MIRROR_TOTO_SELECTOR)];
        if (roots.length) return roots;

        const detailsCandidates = [...template.content.querySelectorAll('details')]
            .filter(details => isRabbitMirrorDetails(details));
        const candidateSet = new Set(detailsCandidates);
        return detailsCandidates.filter(details => {
            let parent = details.parentElement?.closest?.('details') || null;
            while (parent) {
                if (candidateSet.has(parent)) return false;
                parent = parent.parentElement?.closest?.('details') || null;
            }
            return true;
        });
    } catch {
        return [];
    }
}

function maintenanceRenderedSameSummaryOrdinal(root) {
    if (!root || isIndependentMaintenanceRoot(root)) return 0;
    const wantedSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(root));
    const messageIndex = getMessageIndexFromMirrorNode(root);
    const messageElement = messageIndex >= 0 ? getRenderedMessageElement(messageIndex) : null;
    if (!wantedSummary || !messageElement) return 0;
    const matches = getRenderedRabbitMirrorInteractionRoots(messageElement)
        .filter(candidate => normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(candidate)) === wantedSummary);
    const ordinal = matches.findIndex(candidate => candidate === root || candidate.contains?.(root) || root.contains?.(candidate));
    return ordinal >= 0 ? ordinal : 0;
}


function chooseMaintenanceMirrorCandidate(candidates, renderedRoot) {
    const list = Array.isArray(candidates) ? candidates : [];
    if (!list.length) return null;
    const wantedSummary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(renderedRoot));
    if (!wantedSummary) return list.length === 1 ? list[0] : null;
    const ordinal = maintenanceRenderedSameSummaryOrdinal(renderedRoot);
    const exact = list.filter(candidate => normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(candidate)) === wantedSummary);
    if (exact.length) return exact[ordinal] || null;
    const partial = list.filter(candidate => {
        const summary = normalizeMaintenanceSummaryText(getRabbitMirrorSummaryText(candidate));
        return !!summary && (summary.includes(wantedSummary) || wantedSummary.includes(summary));
    });
    return partial[ordinal] || null;
}


export function chooseMatchingRawRabbitMirrorRoot(rawHtml, renderedRoot) {
    const candidates = collectRawRabbitMirrorRoots(rawHtml);
    const matched = chooseMaintenanceMirrorCandidate(candidates, renderedRoot);

    if (!matched) return null;
    const renderedTag = String(renderedRoot?.tagName || '').toLowerCase();
    const matchedTag = String(matched.tagName || '').toLowerCase();
    if (renderedTag === matchedTag) return matched;

    if (renderedTag === 'details') {
        return matched.querySelector?.(':scope > details') || matched.querySelector?.('details') || matched;
    }
    if (renderedTag === 'toto' && matchedTag === 'details') return matched;
    return matched;
}


export function getElementChildIndexPath(root, element) {
    if (!root || !element || root === element) return [];
    const path = [];
    let current = element;
    while (current && current !== root) {
        const parent = current.parentElement;
        if (!parent) return null;
        const index = [...parent.children].indexOf(current);
        if (index < 0) return null;
        path.unshift(index);
        current = parent;
    }
    return current === root ? path : null;
}


export function resolveElementChildIndexPath(root, path) {
    let current = root;
    for (const index of path || []) {
        current = current?.children?.[index] || null;
        if (!current) return null;
    }
    return current;
}



export function normalizeInteractionMatchText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}


export function filterRabbitMirrorRuntimeText(value) {
    const words = getSettings()?.rabbitMirrorBannedWords;
    if (!Array.isArray(words) || !words.length) return String(value ?? '');
    return filterRabbitMirrorVisibleTextValue(String(value ?? ''), words).text;
}


export function filterRabbitMirrorRuntimeDom(root) {
    const words = getSettings()?.rabbitMirrorBannedWords;
    if (!Array.isArray(words) || !words.length) return 0;
    clearMirrorTitleDisplayArtifacts(root);
    return applyRabbitMirrorBannedWordsToDom(root, words);
}


export function isRabbitMirrorRuntimeTextTarget(target) {
    let element = target?.nodeType === 3 ? target.parentElement || target.parentNode : target;
    if (!element) return false;
    // A recovered text assignment must never become a CSS/script rewrite.
    for (; element; element = element.parentElement) {
        if (RABBIT_MIRROR_NON_CONTENT_TEXT_TAGS.has(String(element.tagName || '').toUpperCase())) return false;
    }
    return true;
}


export function resolveRenderedCounterpart(rawRoot, renderedRoot, rawElement, selector = '*') {
    if (!rawRoot || !renderedRoot || !rawElement) return null;
    const rawTag = String(rawElement.tagName || '').toLowerCase();

    if (rawElement.matches?.('input[type="checkbox"], input[type="radio"]')) {
        const rawInputs = [...rawRoot.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
        const renderedInputs = [...renderedRoot.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
        const index = rawInputs.indexOf(rawElement);
        return index >= 0 ? (renderedInputs[index] || null) : null;
    }

    const rawId = String(rawElement.id || '').trim();
    if (rawId) {
        const idCandidate = resolveScopedPseudoId(renderedRoot, rawId);
        if (idCandidate && String(idCandidate.tagName || '').toLowerCase() === rawTag) return idCandidate;
    }

    const path = getElementChildIndexPath(rawRoot, rawElement);
    const pathCandidate = path ? resolveElementChildIndexPath(renderedRoot, path) : null;
    if (pathCandidate && String(pathCandidate.tagName || '').toLowerCase() === rawTag) return pathCandidate;

    const rawText = normalizeInteractionMatchText(rawElement.textContent);
    const candidates = [...renderedRoot.querySelectorAll(selector)]
        .filter(candidate => String(candidate.tagName || '').toLowerCase() === rawTag);
    if (!candidates.length) return null;
    if (rawText) {
        const exact = candidates.find(candidate => normalizeInteractionMatchText(candidate.textContent) === rawText);
        if (exact) return exact;
        const prefix = rawText.slice(0, Math.min(64, rawText.length));
        const near = candidates.find(candidate => normalizeInteractionMatchText(candidate.textContent).includes(prefix));
        if (near) return near;
    }

    const rawPeers = [...rawRoot.querySelectorAll(rawTag || '*')];
    const index = rawPeers.indexOf(rawElement);
    return index >= 0 ? (candidates[index] || null) : null;
}


function parseSafeSelfMutationText(mode, rawValue) {
    const decoded = decodeSafeInlineString(rawValue);
    if (mode !== 'innerHTML') return decoded;
    if (typeof document === 'undefined') return decoded.replace(/<[^>]*>/g, '');
    try {
        if (!validateRabbitMirrorMarkupLexicalBudget(decoded)) return null;
        const template = document.createElement('template');
        template.innerHTML = decoded;
        if (template.content.querySelector('script, style, iframe, object, embed, form, input, button, a')) return null;
        return String(template.content.textContent || '').replace(/\s+/g, ' ').trim();
    } catch {
        return null;
    }
}


function parseRelativeSelfMutationAssignments(scriptText, trigger, root) {
    const source = String(scriptText || '');
    const grouped = new Map();
    if (!source || !trigger || !root?.contains?.(trigger)) return [];

    const remember = (expression, property, value) => {
        const target = resolveCheckedRelativeElementExpression(trigger, expression, root);
        const normalizedProperty = normalizeStylePropertyName(property);
        const normalizedValue = String(value || '').trim();
        if (!target?.style || !normalizedProperty || !normalizedValue) return;
        let entry = grouped.get(target);
        if (!entry) {
            entry = { target, assignments: new Map() };
            grouped.set(target, entry);
        }
        // 同一目标、同一属性只保留脚本中的最后一次赋值，兼容 setTimeout 内的最终状态。
        entry.assignments.set(normalizedProperty, normalizedValue);
    };

    let match;
    const dotAssignmentRe = /(this(?:\s*\.\s*(?:nextElementSibling|previousElementSibling|parentElement|parentNode)){1,6})\s*\.\s*style\s*\.\s*([a-zA-Z][\w]*)\s*=\s*(['"])((?:\\.|(?!\3)[\s\S])*)\3\s*;?/g;
    while ((match = dotAssignmentRe.exec(source))) remember(match[1], match[2], match[4]);

    const bracketAssignmentRe = /(this(?:\s*\.\s*(?:nextElementSibling|previousElementSibling|parentElement|parentNode)){1,6})\s*\.\s*style\s*\[\s*(['"])([a-zA-Z-]+)\2\s*\]\s*=\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*;?/g;
    while ((match = bracketAssignmentRe.exec(source))) remember(match[1], match[3], match[5]);

    return [...grouped.values()].map(item => {
        const assignments = [...item.assignments.entries()].map(([property, value]) => ({ property, value }));
        return {
            target: item.target,
            assignments,
            originalStyles: capturePseudoStyleState(item.target, new Set(assignments.map(assignment => assignment.property))),
        };
    });
}


// 从原始消息安全回读 this.querySelector('固定选择器').style.xxx = '固定值'。
// 先在原始兔子镜内定位目标，再按 DOM 路径映射到已渲染节点，兼容宿主给 class 自动加前缀。

function parseRawDescendantSelfMutationAssignments(scriptText, rawTrigger, rawRoot, renderedRoot) {
    const source = String(scriptText || '');
    const grouped = new Map();
    if (!source || !rawTrigger?.querySelector || !rawRoot || !renderedRoot) return [];

    const remember = (selector, property, value) => {
        const safeSelector = String(selector || '').trim();
        if (!safeSelector || safeSelector.length > 240 || /[{};]/.test(safeSelector)) return;
        let rawTarget = null;
        try { rawTarget = rawTrigger.querySelector(safeSelector); } catch { return; }
        if (!rawTarget || rawTarget === rawTrigger) return;
        const target = resolveRenderedCounterpart(rawRoot, renderedRoot, rawTarget, '*');
        const normalizedProperty = normalizeStylePropertyName(property);
        const normalizedValue = decodeSafeInlineString(value).trim();
        if (!target?.style || !renderedRoot.contains?.(target) || !normalizedProperty || !normalizedValue) return;
        let entry = grouped.get(target);
        if (!entry) {
            entry = { target, assignments: new Map() };
            grouped.set(target, entry);
        }
        entry.assignments.set(normalizedProperty, normalizedValue);
    };

    let match;
    const dotAssignmentRe = /this\s*\.\s*querySelector\s*\(\s*(['"])((?:\\.|(?!\1)[\s\S]){1,240})\1\s*\)\s*\.\s*style\s*\.\s*([a-zA-Z][\w]*)\s*=\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*;?/g;
    while ((match = dotAssignmentRe.exec(source))) remember(decodeSafeInlineString(match[2]), match[3], match[5]);

    const bracketAssignmentRe = /this\s*\.\s*querySelector\s*\(\s*(['"])((?:\\.|(?!\1)[\s\S]){1,240})\1\s*\)\s*\.\s*style\s*\[\s*(['"])([a-zA-Z-]+)\3\s*\]\s*=\s*(['"])((?:\\.|(?!\5)[\s\S])*)\5\s*;?/g;
    while ((match = bracketAssignmentRe.exec(source))) remember(decodeSafeInlineString(match[2]), match[4], match[6]);


    // opacity=1 / zIndex=10 等不带引号的有限数字赋值。
    const dotNumericAssignmentRe = /this\s*\.\s*querySelector\s*\(\s*(['"])((?:\\.|(?!\1)[\s\S]){1,240})\1\s*\)\s*\.\s*style\s*\.\s*([a-zA-Z][\w]*)\s*=\s*(-?(?:\d+(?:\.\d+)?|\.\d+))\s*;?/g;
    while ((match = dotNumericAssignmentRe.exec(source))) remember(decodeSafeInlineString(match[2]), match[3], match[4]);

    const bracketNumericAssignmentRe = /this\s*\.\s*querySelector\s*\(\s*(['"])((?:\\.|(?!\1)[\s\S]){1,240})\1\s*\)\s*\.\s*style\s*\[\s*(['"])([a-zA-Z-]+)\3\s*\]\s*=\s*(-?(?:\d+(?:\.\d+)?|\.\d+))\s*;?/g;
    while ((match = bracketNumericAssignmentRe.exec(source))) remember(decodeSafeInlineString(match[2]), match[4], match[5]);

    return [...grouped.values()].map(item => {
        const assignments = [...item.assignments.entries()].map(([property, value]) => ({ property, value }));
        return {
            target: item.target,
            assignments,
            originalStyles: capturePseudoStyleState(item.target, new Set(assignments.map(assignment => assignment.property))),
        };
    });
}


function parseSafeAttributeGroupToggleProgram(source, trigger, root, rawTrigger = null, rawRoot = null) {
    const script = String(source || '');
    if (!script || !trigger || !rawTrigger || !rawRoot || !root) return null;

    // 仅接受明确的 this.setAttribute('data-*', this.getAttribute(...) === active ? inactive : active)
    // 加同一父容器兄弟项设为 inactive 的有限状态程序；不执行模型 JavaScript。
    const toggleMatch = /this\s*\.\s*setAttribute\(\s*(['"])(data-[a-zA-Z0-9_-]+)\1\s*,\s*this\s*\.\s*getAttribute\(\s*(['"])\2\3\s*\)\s*={2,3}\s*(['"])([^'"]+)\4\s*\?\s*(['"])([^'"]+)\6\s*:\s*(['"])([^'"]+)\8\s*\)/i.exec(script);
    if (!toggleMatch) return null;

    const attributeName = toggleMatch[2];
    const comparedValue = String(toggleMatch[5] || '');
    const whenEqual = String(toggleMatch[7] || '');
    const whenDifferent = String(toggleMatch[9] || '');
    if (!attributeName.startsWith('data-') || !comparedValue || !whenEqual || !whenDifferent) return null;

    // 严格提取并验证同组兄弟关闭意图。
    const strictPeerMatch = /Array\s*\.\s*from\(\s*this\s*\.\s*parent(?:Node|Element)\s*\.\s*children\s*\)\s*\.\s*forEach\s*\(\s*([a-zA-Z_$][\w$]*)\s*=>[\s\S]{0,600}?\1\s*!={1,2}\s*this[\s\S]{0,600}?\1\s*\.\s*classList\s*\.\s*contains\(\s*(['"])([a-zA-Z_][\w-]*)\2\s*\)[\s\S]{0,600}?\1\s*\.\s*setAttribute\(\s*(['"])(data-[a-zA-Z0-9_-]+)\4\s*,\s*(['"])([^'"]+)\6\s*\)/i.exec(script);
    if (!strictPeerMatch) return null;

    const peerClass = strictPeerMatch[3];
    const peerAttribute = strictPeerMatch[5];
    const peerInactiveValue = strictPeerMatch[7];
    if (peerAttribute !== attributeName || peerInactiveValue !== whenEqual) return null;

    const rawParent = rawTrigger.parentElement;
    if (!rawParent) return null;
    const rawPeers = [...rawParent.children].filter(node => node !== rawTrigger && node.classList?.contains?.(peerClass));
    const peers = rawPeers
        .map(rawPeer => resolveRenderedCounterpart(rawRoot, root, rawPeer, '*'))
        .filter(peer => peer && peer !== trigger && root.contains?.(peer));

    return {
        kind: 'attribute-group-toggle',
        trigger,
        attributeName,
        comparedValue,
        activeValue: whenDifferent,
        inactiveValue: whenEqual,
        peers,
        active: trigger.getAttribute(attributeName) === whenDifferent,
    };
}


function parseSafeSelfClassToggleProgram(source, trigger, root, rawTrigger = null) {
    const script = String(source || '');
    const match = /^\s*this\s*\.\s*classList\s*\.\s*toggle\(\s*(['"])([a-zA-Z_][\w-]*)\1\s*\)\s*;?\s*$/i.exec(script);
    if (!match || !trigger?.classList) return null;
    const rawClassName = match[2];
    const rawTokens = [...(rawTrigger?.classList || [])];
    if (!rawTokens.length) rawTokens.push(rawClassName);
    const prefix = inferRenderedClassPrefix(trigger, rawTokens, root);
    const className = trigger.classList.contains(rawClassName)
        ? rawClassName
        : `${prefix}${rawClassName}`;
    return {
        kind: 'class-toggle',
        trigger,
        className,
        active: trigger.classList.contains(className),
    };
}

// 宿主会剥离模型写在点击热区上的 inline onclick。
// 仅回读极窄的 this.closest('.fixed-class').classList.toggle('fixed-state') 形态，
// 并要求原始 CSS 与渲染后 CSS 都真实存在对应状态 class；绝不执行原始 JavaScript。

function parseSafeClosestClassToggleProgram(source, trigger, root, rawTrigger = null, rawRoot = null) {
    const script = String(source || '');
    const match = /^\s*this\s*\.\s*closest\(\s*(['"])(\.[a-zA-Z_][\w-]*)\1\s*\)\s*\.\s*classList\s*\.\s*toggle\(\s*(['"])([a-zA-Z_][\w-]*)\3\s*\)\s*;?\s*$/i.exec(script);
    if (!match || !trigger || !root || !rawTrigger || !rawRoot) return null;

    const rawSelector = match[2];
    const rawClassName = match[4];
    let rawTarget = null;
    try { rawTarget = rawTrigger.closest(rawSelector); } catch { return null; }
    if (!rawTarget || (rawTarget !== rawRoot && !rawRoot.contains?.(rawTarget))) return null;

    const target = rawTarget === rawRoot
        ? root
        : resolveRenderedCounterpart(rawRoot, root, rawTarget, '*');
    if (!target?.classList || (target !== root && !root.contains?.(target))) return null;

    const rawTokens = [...(rawTarget.classList || [])];
    const prefix = inferRenderedClassPrefix(target, rawTokens.length ? rawTokens : [rawSelector.slice(1)], root);
    const className = target.classList.contains(rawClassName)
        ? rawClassName
        : `${prefix || ''}${rawClassName}`;

    const rawCssText = [...(rawRoot.querySelectorAll?.('style') || [])].map(style => style.textContent || '').join('\n');
    const renderedCssText = [...(root.querySelectorAll?.('style') || [])].map(style => style.textContent || '').join('\n');
    const rawEvidence = new RegExp(`\\.${escapeRegExp(rawClassName)}(?![\\w-])`).test(rawCssText);
    const renderedEvidence = new RegExp(`\\.${escapeRegExp(className)}(?![\\w-])`).test(renderedCssText);
    if (!rawEvidence || !renderedEvidence) return null;

    return {
        kind: 'closest-class-toggle',
        trigger,
        target,
        className,
        active: target.classList.contains(className),
    };
}


function parseSelfMutationProgram(source, trigger, root, rawTrigger = null, rawRoot = null) {
    const script = String(source || '');
    if (!script) return null;

    const classToggleProgram = parseSafeSelfClassToggleProgram(script, trigger, root, rawTrigger);
    if (classToggleProgram) return classToggleProgram;

    const closestClassToggleProgram = parseSafeClosestClassToggleProgram(script, trigger, root, rawTrigger, rawRoot);
    if (closestClassToggleProgram) return closestClassToggleProgram;

    const attributeProgram = parseSafeAttributeGroupToggleProgram(script, trigger, root, rawTrigger, rawRoot);
    if (attributeProgram) return attributeProgram;

    if (!/this\s*\.(?:innerHTML|innerText|textContent|style|nextElementSibling|previousElementSibling|parentElement|parentNode|querySelector|classList)/i.test(script)) return null;

    const activeAssignments = parseInlineStyleAssignments(script);
    const relativeMutations = parseRelativeSelfMutationAssignments(script, trigger, root);
    const descendantMutations = parseRawDescendantSelfMutationAssignments(script, rawTrigger, rawRoot, root);
    const relatedMutations = [...relativeMutations, ...descendantMutations];
    let activeText;
    const textMatch = /this\s*\.\s*(innerHTML|innerText|textContent)\s*=\s*(['"])((?:\\.|(?!\2)[\s\S])*)\2\s*;?/i.exec(script);
    if (textMatch) activeText = parseSafeSelfMutationText(textMatch[1], textMatch[3]);
    if (!activeAssignments.length && activeText == null && !relatedMutations.length) return null;

    const properties = new Set(activeAssignments.map(item => item.property));
    // baseline / active are extension-owned runtime state. Never trust model-authored data-rm-* attributes.
    // Store inert DOM clones in a WeakMap; restoring the inactive state never reparses a model-controlled HTML string.
    let originalNodes = rawSelfMutationDomBaselines.get(trigger);
    if (!Array.isArray(originalNodes)) {
        originalNodes = [...trigger.childNodes].map(node => node.cloneNode(true));
        rawSelfMutationDomBaselines.set(trigger, originalNodes);
    }
    trigger.removeAttribute?.(RAW_SELF_MUTATION_HTML_BASELINE_ATTR);
    trigger.removeAttribute?.(RAW_SELF_MUTATION_ACTIVE_ATTR);
    return {
        trigger,
        active: false,
        activeAssignments,
        activeText,
        relatedMutations,
        originalNodes,
        originalStyles: capturePseudoStyleState(trigger, properties),
    };
}


function applyRawSelfMutationEntry(entry, active) {
    if (!entry?.trigger) return;
    entry.active = !!active;

    if (entry.kind === 'class-toggle') {
        entry.trigger.classList.toggle(entry.className, entry.active);
        entry.trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
        entry.trigger.setAttribute(RAW_SELF_MUTATION_ACTIVE_ATTR, entry.active ? 'true' : 'false');
        return;
    }

    if (entry.kind === 'closest-class-toggle') {
        entry.target?.classList?.toggle?.(entry.className, entry.active);
        entry.trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
        entry.trigger.setAttribute(RAW_SELF_MUTATION_ACTIVE_ATTR, entry.active ? 'true' : 'false');
        return;
    }

    if (entry.kind === 'attribute-group-toggle') {
        for (const peer of entry.peers || []) {
            peer?.setAttribute?.(entry.attributeName, entry.inactiveValue);
            peer?.setAttribute?.('aria-pressed', 'false');
            const peerEntry = rawSelfMutationRescueStates.get(entry.trigger.closest?.('details'))?.entries?.get?.(peer);
            if (peerEntry) peerEntry.active = false;
        }
        entry.trigger.setAttribute(entry.attributeName, entry.active ? entry.activeValue : entry.inactiveValue);
        entry.trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
        entry.trigger.setAttribute(RAW_SELF_MUTATION_ACTIVE_ATTR, entry.active ? 'true' : 'false');
        return;
    }

    restorePseudoStyleState(entry.trigger, entry.originalStyles);
    for (const mutation of entry.relatedMutations || []) {
        restorePseudoStyleState(mutation.target, mutation.originalStyles);
    }
    if (entry.active) {
        if (entry.activeText != null && isRabbitMirrorRuntimeTextTarget(entry.trigger)) entry.trigger.textContent = filterRabbitMirrorRuntimeText(entry.activeText);
        applyPseudoStyleAssignments(entry.trigger, entry.activeAssignments);
        for (const mutation of entry.relatedMutations || []) {
            applyPseudoStyleAssignments(mutation.target, mutation.assignments);
        }
    } else if (entry.activeText != null && isRabbitMirrorRuntimeTextTarget(entry.trigger)) {
        const restoredNodes = (entry.originalNodes || []).map(node => node.cloneNode(true));
        entry.trigger.replaceChildren(...restoredNodes);
        filterRabbitMirrorRuntimeDom(entry.trigger);
    }
    entry.trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
    entry.trigger.setAttribute(RAW_SELF_MUTATION_ACTIVE_ATTR, entry.active ? 'true' : 'false');
}


function rawHoverProgramHasMeaningfulTouchState(root, target, assignments) {
    return (assignments || []).some(({ property, value }) => {
        const name = normalizeStylePropertyName(property);
        const cleanValue = String(value || '').trim().toLowerCase();
        if (checkedDeclarationCreatesContentReveal(root, target, name, cleanValue)) return true;
        // 3D 翻面会切换实际观看内容，不属于普通按钮变色或轻微位移。
        if (name === 'transform' && /(?:rotate[xy]|perspective)\s*\(/i.test(cleanValue)) return true;
        return false;
    });
}


function bindRawHoverDecorationRestore(trigger, state) {
    if (!trigger?.addEventListener || !state) return;
    const apply = active => {
        if (active) applyPseudoStyleAssignments(state.target, state.activeAssignments);
        else {
            restorePseudoStyleState(state.target, state.originalStyles);
            applyPseudoStyleAssignments(state.target, state.inactiveAssignments);
        }
    };
    trigger.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse') apply(true);
    }, false);
    trigger.addEventListener('pointerleave', event => {
        if (event.pointerType === 'mouse') apply(false);
    }, false);
}


export function installRawMessageHoverPseudoRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return 0;

    let installed = 0;
    for (const rawTrigger of rawRoot.querySelectorAll('[onmouseover], [onmouseenter]')) {
        const renderedTrigger = resolveRenderedCounterpart(rawRoot, root, rawTrigger, 'div, span, section, article, figure, aside, button');
        if (!renderedTrigger
            || renderedTrigger.hasAttribute(RAW_HOVER_PSEUDO_RESCUE_ATTR)
            || renderedTrigger.hasAttribute(RAW_HOVER_DECORATION_RESTORE_ATTR)) continue;
        const activeSource = rawTrigger.getAttribute('onmouseover') || rawTrigger.getAttribute('onmouseenter') || '';
        const inactiveSource = rawTrigger.getAttribute('onmouseout') || rawTrigger.getAttribute('onmouseleave') || '';
        const activeAssignments = parseInlineStyleAssignments(activeSource);
        const inactiveAssignments = parseInlineStyleAssignments(inactiveSource);
        if (!activeAssignments.length) continue;

        const properties = new Set([...activeAssignments, ...inactiveAssignments].map(item => item.property));
        const state = {
            target: renderedTrigger,
            trigger: renderedTrigger,
            active: false,
            activeAssignments,
            inactiveAssignments,
            originalStyles: capturePseudoStyleState(renderedTrigger, properties),
        };

        if (!rawHoverProgramHasMeaningfulTouchState(root, renderedTrigger, activeAssignments)) {
            // 纯配色、阴影、边框或平面位移只恢复桌面鼠标悬停；
            // 不把它伪装成可点击按钮，也不在触屏上制造可保持的假状态。
            bindRawHoverDecorationRestore(renderedTrigger, state);
            renderedTrigger.setAttribute(RAW_HOVER_DECORATION_RESTORE_ATTR, 'true');
            continue;
        }

        pseudoInteractionStates.set(renderedTrigger, state);
        bindPseudoToggle(renderedTrigger, state);
        renderedTrigger.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse') setPseudoInteractionState(state, true);
        }, false);
        renderedTrigger.addEventListener('pointerleave', event => {
            if (event.pointerType === 'mouse') setPseudoInteractionState(state, false);
        }, false);
        renderedTrigger.setAttribute(RAW_HOVER_PSEUDO_RESCUE_ATTR, 'true');
        installed += 1;
    }
    const liveMeaningfulCount = root.querySelectorAll?.(`[${RAW_HOVER_PSEUDO_RESCUE_ATTR}]`)?.length || 0;
    if (liveMeaningfulCount) root.dataset.rabbitMirrorRawHoverFallback = String(liveMeaningfulCount);
    else delete root.dataset.rabbitMirrorRawHoverFallback;
    return installed;
}


export function installRawMessageSelfMutationRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return 0;

    let state = rawSelfMutationRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        rawSelfMutationRescueStates.set(root, state);
    }

    let installed = 0;
    for (const rawTrigger of rawRoot.querySelectorAll('[onclick]')) {
        const source = rawTrigger.getAttribute('onclick') || '';
        if (!/this\s*\.(?:innerHTML|innerText|textContent|style|nextElementSibling|previousElementSibling|parentElement|parentNode|querySelector|closest|setAttribute|getAttribute|classList)/i.test(source)) continue;
        const renderedTrigger = resolveRenderedCounterpart(rawRoot, root, rawTrigger, 'div, span, section, article, figure, aside, button');
        if (!renderedTrigger || state.entries.has(renderedTrigger)) continue;
        const entry = parseSelfMutationProgram(source, renderedTrigger, root, rawTrigger, rawRoot);
        if (!entry) continue;

        state.entries.set(renderedTrigger, entry);
        preparePseudoTrigger(renderedTrigger);
        const toggle = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, renderedTrigger)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            event?.preventDefault?.();
            applyRawSelfMutationEntry(entry, !entry.active);
        };
        renderedTrigger.addEventListener('click', toggle, false);
        renderedTrigger.addEventListener('keydown', toggle, false);
        renderedTrigger.setAttribute(RAW_SELF_MUTATION_RESCUE_ATTR, 'true');
        installed += 1;
    }
    if (installed || state.entries.size) root.dataset.rabbitMirrorSelfMutationFallback = 'true';
    return installed;
}


function directIdClassOperationActions(actions) {
    return (actions || []).filter(action => /^class-(?:toggle|add|remove)$/.test(String(action?.type || ''))
        && action?.target?.classList && action?.className);
}


function registerDirectIdClassOperationTrigger(trigger, actions) {
    for (const action of directIdClassOperationActions(actions)) {
        let classMap = directIdClassOperationTriggerStates.get(action.target);
        if (!classMap) {
            classMap = new Map();
            directIdClassOperationTriggerStates.set(action.target, classMap);
        }
        let triggers = classMap.get(action.className);
        if (!triggers) {
            triggers = new Set();
            classMap.set(action.className, triggers);
        }
        triggers.add(trigger);
    }
}


function syncDirectIdClassOperationTriggers(actions) {
    for (const action of directIdClassOperationActions(actions)) {
        const active = action.target.classList.contains(action.className);
        const triggers = directIdClassOperationTriggerStates.get(action.target)?.get?.(action.className) || [];
        for (const trigger of triggers) {
            if (!trigger?.isConnected) continue;
            trigger.setAttribute('aria-pressed', active ? 'true' : 'false');
            trigger.setAttribute('data-rabbit-mirror-direct-id-class-active', active ? 'true' : 'false');
        }
    }
}


function bindDirectIdClickActions(trigger, actions) {
    if (!trigger || !actions?.length || trigger.hasAttribute(DIRECT_ID_CLICK_RESCUE_ATTR)) return false;

    preparePseudoTrigger(trigger);
    const activate = event => {
        if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, trigger)) return;
        if (event?.type === 'keydown') {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
        }
        // 隐藏 checkbox/radio 在触屏环境通常由 label 兜底直接切换 checked，
        // 原 input 不一定收到 click，但一定会收到急救器补发的 input/change。
        // radio 只在成为当前选中项时执行原 onclick 的固定赋值，避免失选分支反向覆盖。
        if (event?.type === 'change' && trigger.matches?.('input[type="radio"]') && !trigger.checked) return;
        applyDirectIdClickAssignments(actions);
        syncDirectIdClassOperationTriggers(actions);
    };

    registerDirectIdClassOperationTrigger(trigger, actions);
    trigger.addEventListener('click', activate, false);
    trigger.addEventListener('keydown', activate, false);
    if (trigger.matches?.('input[type="checkbox"], input[type="radio"]')) {
        trigger.addEventListener('change', activate, false);
    }
    trigger.removeAttribute('onclick');
    trigger.removeAttribute('aria-pressed');
    trigger.setAttribute(DIRECT_ID_CLICK_RESCUE_ATTR, 'true');
    if (actions.some(action => action?.type === 'class-state' || /^class-(?:toggle|add|remove)$/.test(String(action?.type || '')))) {
        trigger.setAttribute(DIRECT_ID_CLASS_STATE_RESCUE_ATTR, 'true');
    }
    syncDirectIdClassOperationTriggers(actions);
    return true;
}


function reclaimStaleInertActionTrigger(trigger) {
    if (!trigger?.hasAttribute?.(INERT_ACTION_BUTTON_RESCUE_ATTR) || !trigger.parentNode) return trigger;
    const statusId = String(trigger.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)
        .find(id => trigger.parentElement?.querySelector?.(`#${escapeCssIdentifier(id)}`)?.hasAttribute?.(INERT_ACTION_STATUS_ATTR));
    const adjacentStatus = trigger.nextElementSibling?.hasAttribute?.(INERT_ACTION_STATUS_ATTR)
        ? trigger.nextElementSibling
        : (statusId ? trigger.parentElement?.querySelector?.(`#${escapeCssIdentifier(statusId)}`) : null);
    adjacentStatus?.remove?.();

    // 热重载时旧版通用兜底的 listener 无法直接移除；用等价克隆替换按钮，
    // 保留结构与样式，同时清除旧 listener 和通用状态属性，再交给真实 class 状态程序接管。
    const replacement = trigger.cloneNode(true);
    replacement.removeAttribute(INERT_ACTION_BUTTON_RESCUE_ATTR);
    replacement.removeAttribute('data-rabbit-mirror-inert-action-active');
    replacement.removeAttribute('aria-pressed');
    if (statusId) {
        const describedBy = String(replacement.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean).filter(id => id !== statusId);
        if (describedBy.length) replacement.setAttribute('aria-describedby', describedBy.join(' '));
        else replacement.removeAttribute('aria-describedby');
    }
    trigger.replaceWith(replacement);
    return replacement;
}



function parseSafeRawRadioResetProgram(source) {
    const outer = /^\s*document\s*\.\s*querySelectorAll\s*\(\s*(['"])([\s\S]*?)\1\s*\)\s*\.\s*forEach\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*$/.exec(String(source || ''));
    if (!outer) return false;

    const selector = String(outer[2] || '')
        .replace(/\s+/g, '')
        .replace(/(['"])radio\1/gi, 'radio')
        .toLowerCase();
    if (selector !== 'input[type=radio]') return false;

    const callback = String(outer[3] || '').trim();
    const arrow = /^\(?\s*([a-zA-Z_$][\w$]*)\s*\)?\s*=>\s*(?:\{\s*)?\1\s*\.\s*checked\s*=\s*false\s*;?\s*(?:\}\s*)?$/.exec(callback);
    if (arrow) return true;

    const classic = /^function\s*\(\s*([a-zA-Z_$][\w$]*)\s*\)\s*\{\s*\1\s*\.\s*checked\s*=\s*false\s*;?\s*\}$/.exec(callback);
    return !!classic;
}


function resetLocalRabbitMirrorRadios(root) {
    if (!root?.querySelectorAll) return 0;
    const radios = [...root.querySelectorAll('input[type="radio"]')];
    let changed = 0;
    for (const radio of radios) {
        cancelLabeledCheckedTransitionVerification(radio);
        const wasChecked = !!radio.checked;
        radio.checked = false;
        restoreInteractionInlineOverrides(radio);
        radio.setAttribute?.('aria-pressed', 'false');
        if (wasChecked) {
            changed += 1;
            dispatchRescuedInputState(radio);
        }
    }
    applyRenderedLabelInternalHiddenEntries(root);
    syncCrossParentCheckedRuleFallback(root);
    root.setAttribute?.(RAW_RADIO_RESET_LAST_ATTR, `radios=${radios.length};changed=${changed}`);
    return changed;
}


export function installRawMessageRadioResetProgramRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return 0;

    let state = rawRadioResetRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        rawRadioResetRescueStates.set(root, state);
    }
    for (const [trigger, entry] of [...state.entries]) {
        if (!trigger?.isConnected || !root.contains?.(trigger)) {
            trigger?.removeEventListener?.('click', entry.onActivate, false);
            trigger?.removeEventListener?.('keydown', entry.onActivate, false);
            state.entries.delete(trigger);
        }
    }

    let installed = 0;
    for (const rawTrigger of rawRoot.querySelectorAll('[onclick]')) {
        if (!parseSafeRawRadioResetProgram(rawTrigger.getAttribute('onclick'))) continue;
        const renderedTrigger = resolveRenderedCounterpart(rawRoot, root, rawTrigger, '*');
        if (!renderedTrigger || state.entries.has(renderedTrigger)) continue;
        if (!root.querySelector('input[type="radio"]')) continue;

        // DOM 克隆会保留 data 属性但不会保留监听器；允许在新根节点上重新绑定。
        renderedTrigger.removeAttribute?.(RAW_RADIO_RESET_RESCUE_ATTR);
        preparePseudoTrigger(renderedTrigger);
        const onActivate = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, renderedTrigger)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            event?.preventDefault?.();
            event?.stopPropagation?.();
            resetLocalRabbitMirrorRadios(root);
        };
        renderedTrigger.addEventListener('click', onActivate, false);
        renderedTrigger.addEventListener('keydown', onActivate, false);
        renderedTrigger.setAttribute(RAW_RADIO_RESET_RESCUE_ATTR, 'true');
        state.entries.set(renderedTrigger, { onActivate });
        installed += 1;
    }

    const liveCount = state.entries.size;
    if (liveCount) root.setAttribute(RAW_RADIO_RESET_ROOT_ATTR, String(liveCount));
    else {
        root.removeAttribute(RAW_RADIO_RESET_ROOT_ATTR);
        root.removeAttribute(RAW_RADIO_RESET_LAST_ATTR);
    }
    return installed;
}


export function installRawMessageDirectIdClickProgramRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return 0;

    let installed = 0;
    for (const rawTrigger of rawRoot.querySelectorAll('[onclick]')) {
        let renderedTrigger = resolveRenderedCounterpart(rawRoot, root, rawTrigger, '*');
        if (!renderedTrigger || renderedTrigger.hasAttribute(DIRECT_ID_CLICK_RESCUE_ATTR)) continue;
        renderedTrigger = reclaimStaleInertActionTrigger(renderedTrigger);

        const source = rawTrigger.getAttribute('onclick');
        const actions = collectDirectIdClickAssignments(source, root, rawRoot);
        if (!actions?.length) continue;
        if (bindDirectIdClickActions(renderedTrigger, actions)) installed += 1;
    }
    return installed;
}




function maskJavascriptCommentsPreservingStrings(source) {
    const text = String(source || '');
    const out = [...text];
    let quote = '';
    let escaped = false;
    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        const next = text[index + 1] || '';
        if (quote) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '/' && next === '/') {
            let cursor = index;
            while (cursor < text.length && text[cursor] !== '\n' && text[cursor] !== '\r') {
                out[cursor] = ' ';
                cursor += 1;
            }
            index = cursor - 1;
            continue;
        }
        if (char === '/' && next === '*') {
            out[index] = ' ';
            out[index + 1] = ' ';
            let cursor = index + 2;
            while (cursor < text.length) {
                if (text[cursor] === '*' && text[cursor + 1] === '/') {
                    out[cursor] = ' ';
                    out[cursor + 1] = ' ';
                    cursor += 2;
                    break;
                }
                if (text[cursor] !== '\n' && text[cursor] !== '\r') out[cursor] = ' ';
                cursor += 1;
            }
            index = cursor - 1;
        }
    }
    return out.join('');
}


function findJavascriptBlockEnd(source, openIndex) {
    const text = String(source || '');
    if (text[openIndex] !== '{') return -1;
    let depth = 0;
    let quote = '';
    let escaped = false;
    let lineComment = false;
    let blockComment = false;
    for (let index = openIndex; index < text.length; index += 1) {
        const char = text[index];
        const next = text[index + 1] || '';
        if (lineComment) {
            if (char === '\n' || char === '\r') lineComment = false;
            continue;
        }
        if (blockComment) {
            if (char === '*' && next === '/') {
                blockComment = false;
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
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '/' && next === '/') {
            lineComment = true;
            index += 1;
            continue;
        }
        if (char === '/' && next === '*') {
            blockComment = true;
            index += 1;
            continue;
        }
        if (char === '{') depth += 1;
        else if (char === '}') {
            depth -= 1;
            if (depth === 0) return index;
            if (depth < 0) return -1;
        }
    }
    return -1;
}


function blankJavascriptRanges(source, ranges) {
    const chars = [...String(source || '')];
    for (const range of ranges || []) {
        const start = Math.max(0, Number(range?.start) || 0);
        const end = Math.min(chars.length, Number(range?.end) || 0);
        for (let index = start; index < end; index += 1) {
            if (chars[index] !== '\n' && chars[index] !== '\r') chars[index] = ' ';
        }
    }
    return chars.join('');
}


function parseSafeClickListenerBlock(source, fromIndex = 0) {
    const text = String(source || '');
    const listenerRe = /\b([a-zA-Z_$][\w$]*)\s*\.\s*addEventListener\s*\(\s*(['"])click\2\s*,\s*(?:(\(\s*\)\s*=>)|(?:function\s*([a-zA-Z_$][\w$]*)?\s*\(\s*\)))\s*\{/g;
    listenerRe.lastIndex = Math.max(0, Number(fromIndex) || 0);
    const match = listenerRe.exec(text);
    if (!match) return null;
    const openIndex = listenerRe.lastIndex - 1;
    const closeIndex = findJavascriptBlockEnd(text, openIndex);
    if (closeIndex < 0) return null;
    const tail = text.slice(closeIndex + 1, closeIndex + 180);
    const tailMatch = /^\s*(,\s*\{\s*once\s*:\s*true\s*\})?\s*\)\s*;?/.exec(tail);
    if (!tailMatch) return null;
    return {
        alias: match[1],
        functionName: match[4] || '',
        once: !!tailMatch[1],
        start: match.index,
        end: closeIndex + 1 + tailMatch[0].length,
        body: text.slice(openIndex + 1, closeIndex),
    };
}


function extractSafeSetTimeoutBlocks(source) {
    const text = String(source || '');
    const blocks = [];
    const timeoutRe = /\bsetTimeout\s*\(\s*(?:\(\s*\)\s*=>|function\s*\(\s*\))\s*\{/g;
    let match;
    while ((match = timeoutRe.exec(text))) {
        const openIndex = timeoutRe.lastIndex - 1;
        const closeIndex = findJavascriptBlockEnd(text, openIndex);
        if (closeIndex < 0) return null;
        const tail = text.slice(closeIndex + 1, closeIndex + 100);
        const tailMatch = /^\s*,\s*(\d{1,5})\s*\)\s*;?/.exec(tail);
        if (!tailMatch) return null;
        const delay = Number(tailMatch[1]);
        if (!Number.isFinite(delay) || delay < 0 || delay > 15000) return null;
        const end = closeIndex + 1 + tailMatch[0].length;
        blocks.push({
            start: match.index,
            end,
            delay,
            body: text.slice(openIndex + 1, closeIndex),
        });
        timeoutRe.lastIndex = end;
    }
    return blocks;
}


function parseSafeAliasTimelineActions(source, aliases, stateVariables, { resetFunctionName = '', resetTriggerAlias = '' } = {}) {
    const masked = maskJavascriptCommentsPreservingStrings(source);
    const ranges = [];
    const actions = [];
    const addRange = (match, action = null) => {
        ranges.push({ start: match.index, end: match.index + match[0].length });
        if (action) actions.push(action);
    };
    const resolveAlias = alias => aliases.get(String(alias || '')) || null;
    const addStyle = (match, alias, rawProperty, rawValue) => {
        const target = resolveAlias(alias);
        const property = normalizeStylePropertyName(rawProperty);
        const value = decodeSafeInlineString(rawValue).trim();
        if (!target?.style || !RAW_SCRIPT_TIMELINE_ALLOWED_STYLE_PROPERTIES.has(property)) return false;
        if (!value || value.length > 1400 || /(?:expression\s*\(|javascript\s*:|url\s*\()/i.test(value)) return false;
        addRange(match, { type: 'style', target, property, value });
        return true;
    };

    let match;
    const styleDotRe = /\b([a-zA-Z_$][\w$]*)\s*\.\s*style\s*\.\s*([a-zA-Z][\w]*)\s*=\s*(['"])((?:\\.|(?!\3)[\s\S])*)\3\s*;?/g;
    while ((match = styleDotRe.exec(masked))) {
        if (!addStyle(match, match[1], match[2], match[4])) return null;
    }
    const styleBracketRe = /\b([a-zA-Z_$][\w$]*)\s*\.\s*style\s*\[\s*(['"])([a-zA-Z-]+)\2\s*\]\s*=\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*;?/g;
    while ((match = styleBracketRe.exec(masked))) {
        if (!addStyle(match, match[1], match[3], match[5])) return null;
    }
    const textRe = /\b([a-zA-Z_$][\w$]*)\s*\.\s*(innerText|textContent)\s*=\s*(['"])((?:\\.|(?!\3)[\s\S])*)\3\s*;?/g;
    while ((match = textRe.exec(masked))) {
        const target = resolveAlias(match[1]);
        const value = decodeSafeInlineString(match[4]);
        if (!target || value.length > 800) return null;
        addRange(match, { type: 'text', target, value });
    }

    const guardRe = /\bif\s*\(\s*([a-zA-Z_$][\w$]*)\s*\)\s*return\s*;?/g;
    while ((match = guardRe.exec(masked))) {
        if (!stateVariables.has(match[1])) return null;
        addRange(match);
    }
    const stateAssignRe = /\b([a-zA-Z_$][\w$]*)\s*=\s*(true|false)\s*;?/g;
    while ((match = stateAssignRe.exec(masked))) {
        if (!stateVariables.has(match[1])) continue;
        addRange(match);
    }
    if (resetFunctionName && resetTriggerAlias) {
        const removeRe = new RegExp(`\\b${escapeRegExp(resetTriggerAlias)}\\s*\\.\\s*removeEventListener\\s*\\(\\s*(['\"])click\\1\\s*,\\s*${escapeRegExp(resetFunctionName)}\\s*\\)\\s*;?`, 'g');
        while ((match = removeRe.exec(masked))) addRange(match);
    }

    const remainder = blankJavascriptRanges(masked, ranges);
    if (remainder.replace(/[\s;]+/g, '') !== '') return null;
    return actions;
}


function parseSafeRawScriptTimelineProgram(scriptText, rawRoot, root) {
    const source = String(scriptText || '');
    if (!source || source.length > 24000 || /[`]/.test(source)) return null;
    const masked = maskJavascriptCommentsPreservingStrings(source);
    const aliases = new Map();
    const aliasRanges = [];
    const rawAliasIds = new Map();
    const aliasRe = /\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\2\s*\)\s*;?/g;
    let match;
    while ((match = aliasRe.exec(masked))) {
        const rawId = match[3];
        const rawTarget = [...(rawRoot?.querySelectorAll?.('[id]') || [])].find(element => element.id === rawId) || null;
        const target = resolveScopedPseudoId(root, rawId) || (rawTarget ? resolveRenderedCounterpart(rawRoot, root, rawTarget, '*') : null);
        if (!rawTarget || !target || !root.contains?.(target)) return null;
        aliases.set(match[1], target);
        rawAliasIds.set(match[1], rawId);
        aliasRanges.push({ start: match.index, end: match.index + match[0].length });
    }
    if (!aliases.size || aliases.size > 24) return null;

    const stateVariables = new Set();
    const stateRanges = [];
    const stateDeclRe = /\b(?:let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(true|false)\s*;?/g;
    while ((match = stateDeclRe.exec(masked))) {
        if (aliases.has(match[1])) return null;
        stateVariables.add(match[1]);
        stateRanges.push({ start: match.index, end: match.index + match[0].length });
    }
    if (stateVariables.size > 4) return null;

    const outer = parseSafeClickListenerBlock(masked, 0);
    if (!outer || !aliases.has(outer.alias) || outer.once) return null;
    const trigger = aliases.get(outer.alias);
    const timeouts = extractSafeSetTimeoutBlocks(outer.body);
    if (!timeouts || !timeouts.length || timeouts.length > 8) return null;

    let resetActions = null;
    let resetDelay = -1;
    const stages = [];
    for (const timeout of timeouts) {
        let stageBody = timeout.body;
        let enablesReset = false;
        const nested = parseSafeClickListenerBlock(stageBody, 0);
        if (nested) {
            if (resetActions || nested.alias !== outer.alias || !nested.functionName || !nested.once) return null;
            const parsedReset = parseSafeAliasTimelineActions(nested.body, aliases, stateVariables, {
                resetFunctionName: nested.functionName,
                resetTriggerAlias: nested.alias,
            });
            if (!parsedReset?.length) return null;
            resetActions = parsedReset;
            resetDelay = timeout.delay;
            enablesReset = true;
            stageBody = blankJavascriptRanges(stageBody, [{ start: nested.start, end: nested.end }]);
        }
        const actions = parseSafeAliasTimelineActions(stageBody, aliases, stateVariables);
        if (actions === null) return null;
        if (actions.length || enablesReset) stages.push({ delay: timeout.delay, actions, enablesReset });
    }
    if (!resetActions?.length || resetDelay < 0) return null;

    const outerWithoutTimeouts = blankJavascriptRanges(outer.body, timeouts.map(item => ({ start: item.start, end: item.end })));
    const immediateActions = parseSafeAliasTimelineActions(outerWithoutTimeouts, aliases, stateVariables);
    if (immediateActions === null) return null;

    const topLevelRemainder = blankJavascriptRanges(masked, [
        ...aliasRanges,
        ...stateRanges,
        { start: outer.start, end: outer.end },
    ]);
    if (topLevelRemainder.replace(/[\s;]+/g, '') !== '') return null;

    const meaningfulActionCount = immediateActions.length + stages.reduce((sum, stage) => sum + stage.actions.length, 0) + resetActions.length;
    if (meaningfulActionCount < 4) return null;
    return { trigger, triggerAlias: outer.alias, rawTriggerId: rawAliasIds.get(outer.alias) || '', immediateActions, stages, resetActions, resetDelay };
}


export function collectSafeRawScriptTimelinePrograms(root) {
    if (!root?.querySelectorAll) return [];
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return [];
    const programs = [];
    const seenTriggers = new Set();
    for (const script of rawRoot.querySelectorAll('script')) {
        const program = parseSafeRawScriptTimelineProgram(script.textContent || '', rawRoot, root);
        if (!program?.trigger || seenTriggers.has(program.trigger)) continue;
        seenTriggers.add(program.trigger);
        programs.push(program);
    }
    return programs;
}


function applyRawScriptTimelineActions(actions) {
    for (const action of actions || []) {
        if (!action?.target?.isConnected) continue;
        if (action.type === 'style') applyPseudoStyleAssignments(action.target, [action]);
        else if (action.type === 'text' && isRabbitMirrorRuntimeTextTarget(action.target)) action.target.textContent = filterRabbitMirrorRuntimeText(action.value);
    }
}


function clearRawScriptTimelineTimers(entry) {
    for (const timer of entry?.timers || []) clearTimeout(timer);
    if (entry) entry.timers = [];
}


function syncRawScriptTimelineEntry(entry) {
    const trigger = entry?.trigger;
    if (!trigger?.isConnected) return;
    trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
    trigger.setAttribute(RAW_SCRIPT_TIMELINE_STATE_ATTR, entry.resetReady ? 'reset-ready' : (entry.active ? 'active' : 'idle'));
}


export function installRawMessageScriptTimelineRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const programs = collectSafeRawScriptTimelinePrograms(root);
    let state = rawScriptTimelineRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        rawScriptTimelineRescueStates.set(root, state);
    }
    for (const [trigger, entry] of [...state.entries]) {
        if (!trigger?.isConnected || !root.contains?.(trigger)) {
            clearRawScriptTimelineTimers(entry);
            trigger?.removeEventListener?.('click', entry.onActivate, false);
            trigger?.removeEventListener?.('keydown', entry.onActivate, false);
            state.entries.delete(trigger);
        }
    }

    let installed = 0;
    for (const program of programs) {
        const trigger = program.trigger;
        if (!trigger || state.entries.has(trigger)) continue;
        preparePseudoTrigger(trigger);
        const entry = { ...program, trigger, active: false, resetReady: false, timers: [], onActivate: null };
        const onActivate = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, trigger)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            if (entry.active) {
                if (!entry.resetReady) return;
                clearRawScriptTimelineTimers(entry);
                applyRawScriptTimelineActions(entry.resetActions);
                entry.active = false;
                entry.resetReady = false;
                syncRawScriptTimelineEntry(entry);
                return;
            }
            entry.active = true;
            entry.resetReady = false;
            clearRawScriptTimelineTimers(entry);
            applyRawScriptTimelineActions(entry.immediateActions);
            for (const stage of entry.stages) {
                const timer = setTimeout(() => {
                    if (!entry.active || !trigger.isConnected) return;
                    applyRawScriptTimelineActions(stage.actions);
                    if (stage.enablesReset) entry.resetReady = true;
                    syncRawScriptTimelineEntry(entry);
                }, stage.delay);
                entry.timers.push(timer);
            }
            syncRawScriptTimelineEntry(entry);
        };
        entry.onActivate = onActivate;
        trigger.addEventListener('click', onActivate, false);
        trigger.addEventListener('keydown', onActivate, false);
        trigger.setAttribute(RAW_SCRIPT_TIMELINE_RESCUE_ATTR, 'true');
        syncRawScriptTimelineEntry(entry);
        state.entries.set(trigger, entry);
        installed += 1;
    }
    if (state.entries.size) root.setAttribute(RAW_SCRIPT_TIMELINE_ROOT_ATTR, String(state.entries.size));
    else root.removeAttribute(RAW_SCRIPT_TIMELINE_ROOT_ATTR);
    return installed;
}


function passportDocumentSemanticText(element) {
    return `${element?.id || ''} ${element?.className || ''} ${element?.getAttribute?.('aria-label') || ''}`;
}


function passportDocumentLooksLikeCover(element) {
    return /(?:passport|document|book|travel|visa|证件|护照|通行).*(?:cover|front|封面)|(?:cover|front|封面).*(?:passport|document|book|travel|visa|证件|护照|通行)/i.test(passportDocumentSemanticText(element));
}


function passportDocumentLooksLikePages(element) {
    return /(?:passport|document|book|travel|visa|证件|护照|通行).*(?:pages?|inside|content|内页|页)|(?:pages?|inside|content|内页|页).*(?:passport|document|book|travel|visa|证件|护照|通行)/i.test(passportDocumentSemanticText(element));
}


function passportDocumentLooksLikeStamp(element) {
    if (!element?.querySelector) return false;
    const signature = passportDocumentSemanticText(element);
    if (!/(?:^|[\s_-])stamp(?:$|[\s_-])|印章|邮戳/i.test(signature)) return false;
    return !![...element.querySelectorAll('*')].find(child => /(?:stamp.*detail|detail.*stamp|印章.*详情|批注)/i.test(passportDocumentSemanticText(child)));
}


function passportDocumentStampDetail(stamp) {
    if (!stamp?.querySelectorAll) return null;
    return [...stamp.querySelectorAll('*')].find(child => /(?:stamp.*detail|detail.*stamp|印章.*详情|批注)/i.test(passportDocumentSemanticText(child))) || null;
}


export function findRenderedPassportDocumentCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const candidates = [];
    const seen = new Set();
    for (const pages of root.querySelectorAll('div,section,article')) {
        if (!passportDocumentLooksLikePages(pages)) continue;
        const cover = pages.previousElementSibling;
        const host = pages.parentElement;
        if (!cover || !host || !passportDocumentLooksLikeCover(cover)) continue;
        const stamps = [...pages.querySelectorAll('div,label,button')].filter(passportDocumentLooksLikeStamp);
        if (stamps.length < 2) continue;
        const close = [...pages.querySelectorAll('div,span,button,a')].find(element => /(?:close|fold|合上|关闭|收起)/i.test(`${passportDocumentSemanticText(element)} ${element.textContent || ''}`)) || null;
        if (seen.has(pages)) continue;
        seen.add(pages);
        candidates.push({ host, cover, pages, close, stamps });
    }
    return candidates;
}


export function markRenderedPassportDocumentCandidate(candidate, marked = null) {
    if (!candidate) return 0;
    const { host, cover, pages, close, stamps } = candidate;
    const mark = (element, attr, value = 'true') => {
        if (!element?.setAttribute) return;
        element.setAttribute(attr, value);
        marked?.add?.(element);
    };
    mark(host, PASSPORT_DOCUMENT_HOST_ATTR);
    mark(cover, PASSPORT_DOCUMENT_COVER_ATTR);
    mark(pages, PASSPORT_DOCUMENT_PAGES_ATTR);
    if (close) mark(close, PASSPORT_DOCUMENT_CLOSE_ATTR);
    (stamps || []).forEach((stamp, index) => {
        mark(stamp, PASSPORT_DOCUMENT_STAMP_ATTR);
        mark(stamp, PASSPORT_DOCUMENT_STAMP_INDEX_ATTR, String(index + 1));
        const detail = passportDocumentStampDetail(stamp);
        if (detail) mark(detail, PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR);
    });
    return 3 + (close ? 1 : 0) + (stamps?.length || 0);
}


function parseSafeSelfClassAddProgram(source) {
    const match = /^\s*this\s*\.\s*classList\s*\.\s*add\(\s*(['"])([a-zA-Z_][\w-]*)\1\s*\)\s*;?\s*$/i.exec(String(source || ''));
    return match ? match[2] : '';
}


function parseSafeQuerySelectorClassRemoveProgram(source, expectedClass) {
    const match = /^\s*document\s*\.\s*querySelector\(\s*(['"])(\.[a-zA-Z_][\w-]*)\1\s*\)\s*\.\s*classList\s*\.\s*remove\(\s*(['"])([a-zA-Z_][\w-]*)\3\s*\)\s*;?\s*$/i.exec(String(source || ''));
    if (!match || match[4] !== expectedClass) return null;
    return { selector: match[2], className: match[4] };
}


function parsePassportStampNthRules(rawRoot, stampClassName) {
    if (!rawRoot?.querySelectorAll || !stampClassName) return new Map();
    const safeProperties = new Set([
        'border-color', 'border-style', 'border-width', 'color', 'background', 'background-color',
        'grid-column', 'grid-row', 'justify-self', 'align-self', 'margin-top', 'margin-bottom',
        'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
        'border-radius', 'transform', 'opacity',
    ]);
    const result = new Map();
    const escaped = escapeRegExp(stampClassName);
    const ruleRe = new RegExp(`\\.${escaped}\\s*:nth-child\\(\\s*(\\d+)\\s*\\)\\s*\\{([^{}]*)\\}`, 'gi');
    const declarationRe = /(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+?)(?=;|$)/gi;
    for (const style of rawRoot.querySelectorAll('style')) {
        const cssText = String(style.textContent || '');
        let ruleMatch;
        while ((ruleMatch = ruleRe.exec(cssText))) {
            const index = Number(ruleMatch[1]);
            if (!Number.isInteger(index) || index < 1 || index > 12) continue;
            const assignments = [];
            declarationRe.lastIndex = 0;
            let declaration;
            while ((declaration = declarationRe.exec(ruleMatch[2]))) {
                const property = normalizeStylePropertyName(declaration[2]);
                const value = String(declaration[3] || '').trim().replace(/\s*!important\s*$/i, '');
                if (safeProperties.has(property) && value) assignments.push({ property, value });
            }
            if (assignments.length) result.set(index, assignments);
        }
    }
    return result;
}


function applyPassportStampNthRules(rawCandidate, renderedCandidate, rawRoot) {
    const rawStamps = rawCandidate?.stamps || [];
    const renderedStamps = renderedCandidate?.stamps || [];
    if (!rawStamps.length || !renderedStamps.length) return 0;
    const classCounts = new Map();
    for (const token of rawStamps[0].classList || []) {
        if (/(?:^|[-_])stamp$/i.test(token) || /^stamp$/i.test(token)) classCounts.set(token, 1);
    }
    const stampClassName = [...classCounts.keys()][0] || [...(rawStamps[0].classList || [])].find(token => /stamp/i.test(token)) || '';
    const rules = parsePassportStampNthRules(rawRoot, stampClassName);
    let applied = 0;
    for (let index = 0; index < renderedStamps.length; index += 1) {
        const assignments = rules.get(index + 1);
        if (!assignments?.length) continue;
        applyPseudoStyleAssignments(renderedStamps[index], assignments);
        applied += assignments.length;
    }
    return applied;
}


export function ensurePassportDocumentRescueStyle(root) {
    if (!root?.querySelector) return null;
    let style = root.querySelector(`style[${PASSPORT_DOCUMENT_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(PASSPORT_DOCUMENT_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `
[${PASSPORT_DOCUMENT_HOST_ATTR}] { perspective: 1000px; }
[${PASSPORT_DOCUMENT_COVER_ATTR}] { -webkit-backface-visibility: hidden !important; backface-visibility: hidden !important; -webkit-transform-style: preserve-3d !important; transform-style: preserve-3d !important; will-change: transform; }
[${PASSPORT_DOCUMENT_PAGES_ATTR}] { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
[${PASSPORT_DOCUMENT_STAMP_ATTR}] { overflow: visible !important; }
[${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_ACTIVE_ATTR}="true"] > [${PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR}] { opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }
@media (max-width: ${MOBILE_LAYOUT_BREAKPOINT_PX}px) {
  [${PASSPORT_DOCUMENT_HOST_ATTR}] { height: clamp(380px, 70svh, 560px) !important; min-height: 380px !important; overflow: hidden !important; }
  [${PASSPORT_DOCUMENT_COVER_ATTR}] { height: 100% !important; min-height: 100% !important; box-sizing: border-box !important; }
  [${PASSPORT_DOCUMENT_PAGES_ATTR}] { height: 100% !important; max-height: none !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; grid-auto-flow: row !important; grid-auto-rows: max-content !important; align-content: start !important; overflow-y: auto !important; overflow-x: hidden !important; padding: clamp(12px, 4vw, 20px) !important; box-sizing: border-box !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}] { min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important; flex-wrap: nowrap !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_INDEX_ATTR}="1"] { grid-column: 1 !important; grid-row: 1 !important; justify-self: end !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_INDEX_ATTR}="2"] { grid-column: 2 !important; grid-row: 2 !important; justify-self: start !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_INDEX_ATTR}="3"] { grid-column: 1 / span 2 !important; grid-row: 3 !important; justify-self: center !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_ACTIVE_ATTR}="true"] { margin-bottom: clamp(120px, 32vw, 170px) !important; }
  [${PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR}] { width: min(220px, calc(100vw - 86px)) !important; max-width: min(220px, calc(100vw - 86px)) !important; box-sizing: border-box !important; writing-mode: horizontal-tb !important; white-space: normal !important; overflow-wrap: anywhere !important; word-break: break-word !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_INDEX_ATTR}="1"] > [${PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR}] { left: 0 !important; right: auto !important; transform: translateY(6px) !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_INDEX_ATTR}="2"] > [${PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR}] { left: auto !important; right: 0 !important; transform: translateY(6px) !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_INDEX_ATTR}="3"] > [${PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR}] { left: 50% !important; right: auto !important; transform: translateX(-50%) translateY(6px) !important; }
  [${PASSPORT_DOCUMENT_STAMP_ATTR}][${PASSPORT_DOCUMENT_STAMP_ACTIVE_ATTR}="true"] > [${PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR}] { transform-origin: top center !important; }
  [${PASSPORT_DOCUMENT_CLOSE_ATTR}] { position: sticky !important; bottom: 0 !important; right: auto !important; grid-column: 1 / span 2 !important; justify-self: end !important; width: max-content !important; margin-top: 12px !important; padding: 6px 8px !important; background: rgba(253, 251, 247, 0.94) !important; z-index: 40 !important; }
}`;
    return style;
}


function findRawPassportDocumentCandidate(root) {
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return null;
    for (const rawCover of rawRoot.querySelectorAll('[onclick]')) {
        const openClass = parseSafeSelfClassAddProgram(rawCover.getAttribute('onclick'));
        if (!openClass || !passportDocumentLooksLikeCover(rawCover)) continue;
        const rawPages = rawCover.nextElementSibling;
        if (!rawPages || !passportDocumentLooksLikePages(rawPages)) continue;
        const rawStamps = [...rawPages.querySelectorAll('div,label,button')].filter(passportDocumentLooksLikeStamp);
        if (rawStamps.length < 2) continue;
        const rawClose = [...rawPages.querySelectorAll('[onclick]')].find(element => parseSafeQuerySelectorClassRemoveProgram(element.getAttribute('onclick'), openClass)) || null;
        const renderedCover = resolveRenderedCounterpart(rawRoot, root, rawCover, '*');
        const renderedPages = resolveRenderedCounterpart(rawRoot, root, rawPages, '*');
        if (!renderedCover || !renderedPages) continue;
        const renderedHost = renderedPages.parentElement;
        const renderedClose = rawClose ? resolveRenderedCounterpart(rawRoot, root, rawClose, '*') : null;
        const renderedStamps = rawStamps.map(stamp => resolveRenderedCounterpart(rawRoot, root, stamp, '*')).filter(Boolean);
        if (!renderedHost || renderedStamps.length < 2) continue;
        const prefix = inferRenderedClassPrefix(renderedCover, [...rawCover.classList, openClass], root);
        const renderedOpenClass = renderedCover.classList.contains(openClass) ? openClass : `${prefix}${openClass}`;
        return {
            rawRoot,
            rawCandidate: { host: rawPages.parentElement, cover: rawCover, pages: rawPages, close: rawClose, stamps: rawStamps },
            renderedCandidate: { host: renderedHost, cover: renderedCover, pages: renderedPages, close: renderedClose, stamps: renderedStamps },
            openClass: renderedOpenClass,
        };
    }
    return null;
}


function applyPassportDocumentOpenState(entry, active) {
    if (!entry?.candidate?.cover || !entry?.candidate?.pages) return;
    entry.active = !!active;
    const { host, cover, pages } = entry.candidate;
    cover.classList.toggle(entry.openClass, entry.active);
    host.setAttribute(PASSPORT_DOCUMENT_OPEN_ATTR, entry.active ? 'true' : 'false');
    cover.setAttribute('aria-expanded', entry.active ? 'true' : 'false');
    pages.setAttribute('aria-hidden', entry.active ? 'false' : 'true');
    restorePseudoStyleState(pages, entry.pagesOriginalStyles);
    if (entry.active) {
        applyPseudoStyleAssignments(pages, [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ]);
    } else {
        applyPseudoStyleAssignments(pages, [
            { property: 'opacity', value: '0' },
            { property: 'pointer-events', value: 'none' },
        ]);
        for (const stampEntry of entry.stampEntries || []) applyPassportStampState(entry, stampEntry, false);
    }
}


function applyPassportStampState(documentEntry, stampEntry, active) {
    if (!stampEntry?.stamp) return;
    stampEntry.active = !!active;
    stampEntry.stamp.setAttribute(PASSPORT_DOCUMENT_STAMP_ACTIVE_ATTR, stampEntry.active ? 'true' : 'false');
    stampEntry.stamp.setAttribute('aria-expanded', stampEntry.active ? 'true' : 'false');
    if (!stampEntry.active && stampEntry.detail) {
        restorePseudoStyleState(stampEntry.detail, stampEntry.detailOriginalStyles);
    }
    if (stampEntry.active && stampEntry.detail) {
        applyPseudoStyleAssignments(stampEntry.detail, [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ]);
    }
}


export function installPassportDocumentRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    const raw = findRawPassportDocumentCandidate(root);
    if (!raw) return 0;
    const candidate = raw.renderedCandidate;
    markRenderedPassportDocumentCandidate(candidate);
    ensurePassportDocumentRescueStyle(root);
    applyPassportStampNthRules(raw.rawCandidate, candidate, raw.rawRoot);

    let state = passportDocumentRescueStates.get(root);
    if (!state) {
        state = { entries: [] };
        passportDocumentRescueStates.set(root, state);
    }
    if (state.entries.some(entry => entry.candidate.cover === candidate.cover)) return 0;

    const entry = {
        candidate,
        openClass: raw.openClass,
        active: candidate.cover.classList.contains(raw.openClass),
        pagesOriginalStyles: capturePseudoStyleState(candidate.pages, ['opacity', 'visibility', 'pointer-events']),
        stampEntries: [],
    };
    for (const stamp of candidate.stamps) {
        const detail = passportDocumentStampDetail(stamp);
        const stampEntry = {
            stamp,
            detail,
            active: false,
            detailOriginalStyles: detail ? capturePseudoStyleState(detail, ['opacity', 'visibility', 'pointer-events', 'transform']) : new Map(),
        };
        entry.stampEntries.push(stampEntry);
        preparePseudoTrigger(stamp);
        const toggleStamp = event => {
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            } else if (event?.target?.closest?.(`[${PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR}]`)) {
                return;
            } else event?.preventDefault?.();
            const next = !stampEntry.active;
            for (const other of entry.stampEntries) if (other !== stampEntry && other.active) applyPassportStampState(entry, other, false);
            applyPassportStampState(entry, stampEntry, next);
        };
        stamp.addEventListener('click', toggleStamp, false);
        stamp.addEventListener('keydown', toggleStamp, false);
        stamp.setAttribute(PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR, 'true');
        applyPassportStampState(entry, stampEntry, false);
    }

    preparePseudoTrigger(candidate.cover);
    const open = event => {
        if (event?.type === 'keydown') {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
        } else event?.preventDefault?.();
        applyPassportDocumentOpenState(entry, true);
        for (const delay of [0, 80, 260, 650]) setTimeout(() => root.isConnected && applyPassportDocumentOpenState(entry, entry.active), delay);
    };
    candidate.cover.addEventListener('click', open, false);
    candidate.cover.addEventListener('keydown', open, false);
    candidate.cover.setAttribute(PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR, 'true');

    if (candidate.close) {
        preparePseudoTrigger(candidate.close);
        const close = event => {
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            } else event?.preventDefault?.();
            event?.stopPropagation?.();
            applyPassportDocumentOpenState(entry, false);
        };
        candidate.close.addEventListener('click', close, false);
        candidate.close.addEventListener('keydown', close, false);
        candidate.close.setAttribute(PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR, 'true');
    }

    state.entries.push(entry);
    root.setAttribute(PASSPORT_DOCUMENT_RESCUE_ATTR, String(state.entries.length));
    applyPassportDocumentOpenState(entry, entry.active);
    return 1 + entry.stampEntries.length;
}


function stripSafeJavaScriptComments(sourceText) {
    const source = String(sourceText || '');
    let output = '';
    let quote = '';
    let escaped = false;
    let lineComment = false;
    let blockComment = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';
        if (lineComment) {
            if (char === '\n' || char === '\r') {
                lineComment = false;
                output += char;
            } else output += ' ';
            continue;
        }
        if (blockComment) {
            if (char === '*' && next === '/') {
                blockComment = false;
                output += '  ';
                index += 1;
            } else output += char === '\n' || char === '\r' ? char : ' ';
            continue;
        }
        if (quote) {
            output += char;
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '"' || char === "'" || char === '`') {
            quote = char;
            output += char;
            continue;
        }
        if (char === '/' && next === '/') {
            lineComment = true;
            output += '  ';
            index += 1;
            continue;
        }
        if (char === '/' && next === '*') {
            blockComment = true;
            output += '  ';
            index += 1;
            continue;
        }
        output += char;
    }
    return output;
}


function findSafeJavaScriptClosingBrace(sourceText, openIndex) {
    const source = String(sourceText || '');
    if (source[openIndex] !== '{') return -1;
    let depth = 0;
    let quote = '';
    let escaped = false;
    let lineComment = false;
    let blockComment = false;

    for (let index = openIndex; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';
        if (lineComment) {
            if (char === '\n' || char === '\r') lineComment = false;
            continue;
        }
        if (blockComment) {
            if (char === '*' && next === '/') {
                blockComment = false;
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
        if (char === '"' || char === "'" || char === '`') {
            quote = char;
            continue;
        }
        if (char === '/' && next === '/') {
            lineComment = true;
            index += 1;
            continue;
        }
        if (char === '/' && next === '*') {
            blockComment = true;
            index += 1;
            continue;
        }
        if (char === '{') depth += 1;
        else if (char === '}') {
            depth -= 1;
            if (depth === 0) return index;
            if (depth < 0) return -1;
        }
    }
    return -1;
}


function extractSafeNamedFunctionBody(rawRoot, functionName) {
    const name = String(functionName || '').trim();
    if (!rawRoot?.querySelectorAll || !/^[a-zA-Z_$][\w$]*$/.test(name)) return '';
    const headerRe = new RegExp(`function\\s+${escapeRegExp(name)}\\s*\\(\\s*\\)\\s*\\{`, 'g');
    for (const script of rawRoot.querySelectorAll('script')) {
        const source = String(script.textContent || '');
        headerRe.lastIndex = 0;
        const match = headerRe.exec(source);
        if (!match) continue;
        const openIndex = source.indexOf('{', match.index + match[0].length - 1);
        const closeIndex = findSafeJavaScriptClosingBrace(source, openIndex);
        if (openIndex >= 0 && closeIndex > openIndex) return source.slice(openIndex + 1, closeIndex);
    }
    return '';
}


function resolveRenderedClassName(target, rawClassName, root) {
    const rawName = String(rawClassName || '').trim();
    if (!target?.classList || !/^[a-zA-Z_][\w-]*$/.test(rawName)) return '';
    if (target.classList.contains(rawName)) return rawName;
    const prefix = inferRenderedClassPrefix(target, [rawName], root);
    return `${prefix || ''}${rawName}`;
}


function parseSafeNamedFunctionClassBranch(branchText, variableTargets, root) {
    const source = String(branchText || '');
    const actions = [];
    const actionRe = /([a-zA-Z_$][\w$]*)\s*\.\s*classList\s*\.\s*(add|remove)\s*\(\s*(['"])([a-zA-Z_][\w-]*)\3\s*\)\s*;?/g;
    let cursor = 0;
    let match;
    while ((match = actionRe.exec(source))) {
        if (source.slice(cursor, match.index).trim()) return null;
        const target = variableTargets.get(match[1]);
        const className = resolveRenderedClassName(target, match[4], root);
        if (!target || !className) return null;
        actions.push({ target, operation: match[2], className });
        cursor = match.index + match[0].length;
    }
    if (source.slice(cursor).trim() || !actions.length) return null;
    return actions;
}


function parseSafeNamedFunctionClassProgram(rawRoot, renderedRoot, functionName) {
    const rawBody = extractSafeNamedFunctionBody(rawRoot, functionName);
    if (!rawBody) return null;
    let source = stripSafeJavaScriptComments(rawBody);
    const variableTargets = new Map();
    const declarationRe = /\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\2\s*\)\s*;?/g;
    source = source.replace(declarationRe, (whole, variableName, quote, rawId) => {
        const target = resolveScopedPseudoId(renderedRoot, rawId);
        if (target) variableTargets.set(variableName, target);
        return ' '.repeat(whole.length);
    });
    if (!variableTargets.size) return null;

    const conditionRe = /if\s*\(\s*([a-zA-Z_$][\w$]*)\s*\.\s*classList\s*\.\s*contains\s*\(\s*(['"])([a-zA-Z_][\w-]*)\2\s*\)\s*\)\s*\{/g;
    const conditionMatch = conditionRe.exec(source);
    if (!conditionMatch || source.slice(0, conditionMatch.index).trim()) return null;
    const conditionTarget = variableTargets.get(conditionMatch[1]);
    const conditionClassName = resolveRenderedClassName(conditionTarget, conditionMatch[3], renderedRoot);
    if (!conditionTarget || !conditionClassName) return null;

    const trueOpen = source.indexOf('{', conditionMatch.index + conditionMatch[0].length - 1);
    const trueClose = findSafeJavaScriptClosingBrace(source, trueOpen);
    if (trueClose < 0) return null;
    const afterTrue = source.slice(trueClose + 1);
    const elseMatch = /^\s*else\s*\{/.exec(afterTrue);
    if (!elseMatch) return null;
    const falseOpen = trueClose + 1 + elseMatch[0].lastIndexOf('{');
    const falseClose = findSafeJavaScriptClosingBrace(source, falseOpen);
    if (falseClose < 0 || source.slice(falseClose + 1).trim()) return null;

    const whenActive = parseSafeNamedFunctionClassBranch(source.slice(trueOpen + 1, trueClose), variableTargets, renderedRoot);
    const whenInactive = parseSafeNamedFunctionClassBranch(source.slice(falseOpen + 1, falseClose), variableTargets, renderedRoot);
    if (!whenActive?.length || !whenInactive?.length) return null;
    return {
        functionName,
        conditionTarget,
        conditionClassName,
        whenActive,
        whenInactive,
        triggers: new Set(),
    };
}


function applySafeNamedFunctionClassProgram(program) {
    if (!program?.conditionTarget?.classList) return;
    const wasActive = program.conditionTarget.classList.contains(program.conditionClassName);
    const actions = wasActive ? program.whenActive : program.whenInactive;
    for (const action of actions || []) {
        if (!action?.target?.classList) continue;
        action.target.classList[action.operation](action.className);
    }
    const isActive = program.conditionTarget.classList.contains(program.conditionClassName);
    for (const trigger of program.triggers || []) {
        trigger?.setAttribute?.('aria-pressed', isActive ? 'true' : 'false');
    }
}


export function installRawMessageNamedFunctionClassRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return 0;

    const programs = new Map();
    let installed = 0;
    for (const rawTrigger of rawRoot.querySelectorAll('[onclick]')) {
        const callMatch = /^\s*([a-zA-Z_$][\w$]*)\s*\(\s*\)\s*;?\s*$/.exec(String(rawTrigger.getAttribute('onclick') || ''));
        if (!callMatch) continue;
        const renderedTrigger = resolveRenderedCounterpart(rawRoot, root, rawTrigger, '*');
        if (!renderedTrigger || renderedTrigger.hasAttribute(RAW_NAMED_FUNCTION_RESCUE_ATTR)) continue;

        let program = programs.get(callMatch[1]);
        if (!program) {
            program = parseSafeNamedFunctionClassProgram(rawRoot, root, callMatch[1]);
            if (!program) continue;
            programs.set(callMatch[1], program);
        }

        preparePseudoTrigger(renderedTrigger);
        const activate = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, renderedTrigger)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            event?.preventDefault?.();
            applySafeNamedFunctionClassProgram(program);
        };
        renderedTrigger.addEventListener('click', activate, false);
        renderedTrigger.addEventListener('keydown', activate, false);
        renderedTrigger.setAttribute(RAW_NAMED_FUNCTION_RESCUE_ATTR, callMatch[1]);
        renderedTrigger.setAttribute(DIRECT_ID_CLICK_RESCUE_ATTR, 'true');
        renderedTrigger.setAttribute(DIRECT_ID_CLASS_STATE_RESCUE_ATTR, 'true');
        program.triggers.add(renderedTrigger);
        installed += 1;
    }
    return installed;
}


export function installRawMessageCheckedChangeProgramRescue(root) {
    if (!root?.querySelectorAll) return 0;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return 0;

    let installed = 0;
    for (const rawInput of rawRoot.querySelectorAll('input[type="checkbox"][onchange], input[type="radio"][onchange]')) {
        const renderedInput = resolveRenderedCounterpart(rawRoot, root, rawInput, 'input[type="checkbox"], input[type="radio"]');
        if (!renderedInput?.matches?.('input[type="checkbox"], input[type="radio"]')) continue;
        if (renderedInput.hasAttribute(CHANGE_PSEUDO_RESCUE_ATTR)) continue;

        const source = rawInput.getAttribute('onchange') || '';
        const states = parseCheckedChangeStyleProgramFromSource(renderedInput, root, source);
        if (!states?.length) continue;
        if (bindCheckedChangeProgram(renderedInput, states)) installed += 1;
    }
    return installed;
}


function installInlineEventPseudoInteractionRescue(root) {
    if (!root?.querySelectorAll) return;
    const candidates = [...root.querySelectorAll('[onmouseover], [onmouseenter], [onmouseout], [onmouseleave], [onclick]')];

    for (const target of candidates) {
        if (target.hasAttribute(INLINE_PSEUDO_RESCUE_ATTR)) continue;
        const hoverOn = collectInlineAssignments(target, ['onmouseover', 'onmouseenter']);
        const hoverOff = collectInlineAssignments(target, ['onmouseout', 'onmouseleave']);
        const clickOn = collectInlineAssignments(target, ['onclick']);
        const activeAssignments = hoverOn.length ? hoverOn : clickOn;
        if (!activeAssignments.length) continue;

        const properties = new Set([...activeAssignments, ...hoverOff].map(item => item.property));
        const originalStyles = capturePseudoStyleState(target, properties);
        const trigger = isPseudoTriggerUsable(target) ? target : target.parentElement;
        if (!trigger || !root.contains(trigger)) continue;

        const state = {
            target,
            trigger,
            active: false,
            activeAssignments,
            inactiveAssignments: hoverOff,
            originalStyles,
        };
        pseudoInteractionStates.set(target, state);
        bindPseudoToggle(trigger, state);

        // 桌面鼠标继续保留原本的进入/离开语义；触屏则通过点击切换。
        if (hoverOn.length) {
            trigger.addEventListener('pointerenter', event => {
                if (event.pointerType === 'mouse') setPseudoInteractionState(state, true);
            }, false);
            trigger.addEventListener('pointerleave', event => {
                if (event.pointerType === 'mouse') setPseudoInteractionState(state, false);
            }, false);
        }

        // 识别成功后移除对应内联事件，避免 CSP 报错或浏览器与急救器双重执行。
        for (const attributeName of ['onmouseover', 'onmouseenter', 'onmouseout', 'onmouseleave', 'onclick']) {
            const eventCode = target.getAttribute(attributeName);
            if (parseInlineStyleAssignments(eventCode).length) target.removeAttribute(attributeName);
        }
        target.setAttribute(INLINE_PSEUDO_RESCUE_ATTR, 'true');
    }
}


function installHintedHiddenLayerRescue(root) {
    for (const { host, target } of findHintedHiddenLayerPairs(root)) {
        if (target.hasAttribute(HINTED_PSEUDO_RESCUE_ATTR)) continue;
        const properties = new Set(['opacity', 'visibility', 'pointer-events']);
        const originalStyles = capturePseudoStyleState(target, properties);
        const activeAssignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ];
        const state = {
            target,
            trigger: host,
            active: false,
            activeAssignments,
            inactiveAssignments: [],
            originalStyles,
        };
        pseudoInteractionStates.set(target, state);
        bindPseudoToggle(host, state);
        target.setAttribute(HINTED_PSEUDO_RESCUE_ATTR, 'true');
    }
}


export function installPseudoInteractionRescue(root) {
    installCheckedChangePseudoInteractionRescue(root);
    installDirectIdClickProgramRescue(root);
    installInlineEventPseudoInteractionRescue(root);
    // 某些宿主会在渲染前移除 onmouseover/onclick。此路径只在“悬停/点击提示 + 隐藏全覆盖层”同时存在时启用。
    installHintedHiddenLayerRescue(root);
}


export function detectInteractionCapabilities(root) {
    if (!root?.querySelectorAll) return { checked: false, hover: false, details: false, target: false, pseudo: false, listDetail: false, maskReveal: false, stateSibling: false, buttonAdjacent: false, clickableAdjacent: false, clickablePopup: false, containerReveal: false, selfMutation: false, detachedCheckedHas: false, selectionFallback: false, disabledChoiceFallback: false, actionFallback: false, staticChoiceSelection: false, structuredStaticDisclosure: false, fillInChoice: false, scriptTimeline: false, reversibleChecked: false };
    const cssText = getRabbitMirrorLocalStyleElements(root).map(style => style.textContent || '').join('\n');
    const outerDetails = root.matches?.('details') ? root : root.querySelector(':scope > details');
    const nestedDetails = [...root.querySelectorAll('details')].filter(item => item !== outerDetails);
    const capabilities = {
        checked: !!root.querySelector('input[type="checkbox"], input[type="radio"]') || /:checked\b/i.test(cssText),
        hover: /:hover\b/i.test(cssText),
        details: nestedDetails.length > 0,
        target: /:target\b/i.test(cssText) || !!root.querySelector('a[href^="#"]'),
        pseudo: hasPseudoInteractionCandidates(root),
        listDetail: hasRenderedListDetailCandidates(root),
        maskReveal: hasRenderedMaskRevealCandidates(root),
        stateSibling: hasRenderedCssStateSiblingCandidates(root),
        buttonAdjacent: hasRenderedButtonAdjacentHiddenCandidates(root),
        clickableAdjacent: hasRenderedClickableAdjacentHiddenCandidates(root),
        clickablePopup: hasRenderedClickableAdjacentPopupCandidates(root),
        containerReveal: hasRenderedContainerInternalRevealCandidates(root),
        selfMutation: (rawSelfMutationRescueStates.get(root)?.entries?.size || 0) > 0,
        detachedCheckedHas: Number.parseInt(root.getAttribute?.(DETACHED_CHECKED_HAS_RULE_COUNT_ATTR) || '0', 10) > 0,
        selectionFallback: !!root.querySelector(`[${SELECTION_ONLY_FALLBACK_ATTR}]`),
        disabledChoiceFallback: !!root.querySelector(`[${DISABLED_ONLY_CHOICE_RESCUE_ATTR}]`),
        actionFallback: !!root.querySelector(`[${INERT_ACTION_BUTTON_RESCUE_ATTR}]`),
        staticChoiceSelection: Number.parseInt(root.getAttribute?.(STATIC_CHOICE_SELECTION_COUNT_ATTR) || '0', 10) > 0,
        structuredStaticDisclosure: Number.parseInt(root.getAttribute?.(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR) || '0', 10) > 0,
        fillInChoice: Number.parseInt(root.getAttribute?.(FILL_IN_CHOICE_COUNT_ATTR) || '0', 10) > 0,
        passportDocument: (passportDocumentRescueStates.get(root)?.entries?.length || 0) > 0,
        scriptTimeline: Number.parseInt(root.getAttribute?.(RAW_SCRIPT_TIMELINE_ROOT_ATTR) || '0', 10) > 0,
        reversibleChecked: Number.parseInt(root.getAttribute?.(REVERSIBLE_CHECKED_RESULT_ROOT_ATTR) || '0', 10) > 0,
    };
    interactionCapabilityStates.set(root, capabilities);
    root.dataset.rabbitMirrorInteractionRoutes = Object.entries(capabilities)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name)
        .join(',') || 'none';
    return capabilities;
}


