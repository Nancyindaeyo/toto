// Split from outputSanitizer.js — renderedStateRescue.

import { getRabbitMirrorLocalStyleElements } from './runtime.js?rmv=1.6';
import {
    CHANGE_PSEUDO_RESCUE_ATTR,
    PSEUDO_ACTIVE_ATTR,
    RENDERED_INPUT_ROUTE_ATTR,
    REVERSIBLE_TARGET_CLOSE_ATTR,
    restoreInteractionInlineOverrides,
    reversibleTargetCloseStates,
} from './checkedStateRescue.js?rmv=1.6';
import {
    RAW_SELF_MUTATION_RESCUE_ATTR,
    applyPseudoStyleAssignments,
    capturePseudoStyleState,
    captureStableTextState,
    chooseMatchingRawRabbitMirrorRoot,
    decodeSafeInlineString,
    filterRabbitMirrorRuntimeText,
    getCapturedStyleValue,
    getElementChildIndexPath,
    getRawAssistantMessageForRenderedRoot,
    isRabbitMirrorRuntimeTextTarget,
    normalizeInteractionMatchText,
    preparePseudoTrigger,
    resolveElementChildIndexPath,
    restorePseudoStyleState,
    shouldIgnorePseudoToggleEvent,
} from './scriptedInteractionRescue.js?rmv=1.6';
import { TOUCH_HOVER_STYLE_ATTR, setRescuedCheckedState } from './fallbackRescue.js?rmv=1.6';
import { interactionScopeStates } from './idsAndRearm.js?rmv=1.6';
import { INTERACTION_DIAGNOSTIC_PANEL_ATTR } from './diagnostics.js?rmv=1.6';
import {
    cssContainsUnsafeGeneratedResource,
    cssDeclarationBlockContainsUnsafeOverlayGeometry,
    sanitizeGeneratedCssDeclarationBlock,
    splitCssDeclarationList,
    splitCssSelectorList,
} from './markup.js?rmv=1.6';

export const RENDERED_STATE_LAYER_RESCUE_ATTR = 'data-rabbit-mirror-rendered-state-layer-rescue';

const RENDERED_STATE_LAYER_ROLE_ATTR = 'data-rm-rendered-state-layer-role';

export const renderedStateLayerRescueStates = new WeakMap();


export const RENDERED_ADJACENT_HIDDEN_GROUP_RESCUE_ATTR = 'data-rabbit-mirror-adjacent-hidden-group-rescue';

const RENDERED_ADJACENT_HIDDEN_ITEM_ATTR = 'data-rm-adjacent-hidden-item';

export const renderedAdjacentHiddenGroupRescueStates = new WeakMap();

const ADJACENT_HIDDEN_TRIGGER_HINT_RE = /(?:点击|轻触|触摸|按下|查看|读取|提取|感知|共振|唤醒|揭示|显示|开启|切换|进入)|\b(?:click|tap|touch|open|reveal|show|inspect|sense)\b/i;

const ADJACENT_HIDDEN_CLASS_HINT_RE = /(?:hidden|reveal|secret|thought|detail|info|result|message|dialog|caption|note|content|text)/i;


export const RENDERED_LABEL_INTERNAL_HIDDEN_RESCUE_ATTR = 'data-rabbit-mirror-label-internal-hidden-rescue';

const RENDERED_LABEL_INTERNAL_HIDDEN_ITEM_ATTR = 'data-rm-label-internal-hidden-item';

export const renderedLabelInternalHiddenRescueStates = new WeakMap();


export const RENDERED_LABEL_ADJACENT_RESULT_RESCUE_ATTR = 'data-rabbit-mirror-label-adjacent-result-rescue';

const RENDERED_LABEL_ADJACENT_RESULT_ITEM_ATTR = 'data-rm-label-adjacent-result-item';

const RENDERED_LABEL_ADJACENT_VISUAL_ITEM_ATTR = 'data-rm-label-adjacent-visual-item';

export const renderedLabelAdjacentResultRescueStates = new WeakMap();

const LABEL_ADJACENT_RESULT_HINT_RE = /(?:detail|result|reaction|response|info|content|reveal|hidden|message|panel|output|详情|结果|反应|状态|信息|揭示)/i;

const LABEL_ADJACENT_VISUAL_HINT_RE = /(?:zone|radar|meter|gauge|ring|circle|field|area|territory|dominance|progress|pulse|wave|领域|雷达|区域|环|范围|进度)/i;


export const RENDERED_CHECKED_ID_TARGET_RESCUE_ATTR = 'data-rabbit-mirror-checked-id-target-rescue';

const RENDERED_CHECKED_ID_TARGET_ITEM_ATTR = 'data-rm-checked-id-target-item';

export const renderedCheckedIdTargetRescueStates = new WeakMap();

const CHECKED_ID_TARGET_ALLOWED_PROPERTIES = new Set([
    'display', 'visibility', 'opacity', 'pointer-events', 'transform',
    'height', 'min-height', 'max-height', 'width', 'min-width', 'max-width',
    'overflow', 'overflow-x', 'overflow-y', 'background', 'background-color', 'color',
]);


export const RENDERED_BUTTON_ADJACENT_HIDDEN_RESCUE_ATTR = 'data-rabbit-mirror-button-adjacent-hidden-rescue';

export const RENDERED_BUTTON_ADJACENT_HIDDEN_ITEM_ATTR = 'data-rm-button-adjacent-hidden-item';

export const renderedButtonAdjacentHiddenRescueStates = new WeakMap();

const BUTTON_ADJACENT_HIDDEN_HINT_RE = /(?:hidden|secret|detail|data|log|result|reaction|response|message|content|reveal|decode|机密|隐藏|秘密|详情|日志|结果|反应|反馈|信息|内容|解码)/i;


export const RENDERED_CSS_STATE_SIBLING_RESCUE_ATTR = 'data-rabbit-mirror-css-state-sibling-rescue';

export const RENDERED_CSS_STATE_SIBLING_ITEM_ATTR = 'data-rm-css-state-sibling-item';

const RENDERED_CSS_STATE_CROSS_TREE_RESCUE_ATTR = 'data-rabbit-mirror-css-state-cross-tree-rescue';

export const RENDERED_CSS_STATE_CROSS_TREE_ROOT_ATTR = 'data-rabbit-mirror-css-state-cross-tree-fallback';

export const renderedCssStateSiblingRescueStates = new WeakMap();

const CSS_STATE_SIBLING_SAFE_PROPERTIES = new Set([
    'display', 'visibility', 'opacity', 'pointer-events', 'transform', 'filter',
    'height', 'min-height', 'max-height', 'width', 'min-width', 'max-width',
    'overflow', 'overflow-x', 'overflow-y', 'position', 'inset', 'top', 'right', 'bottom', 'left',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'z-index', 'clip-path', 'background', 'background-color', 'color',
    'border', 'border-color', 'border-top', 'border-right', 'border-bottom', 'border-left',
    'box-shadow', 'text-shadow', 'font-weight', 'font-style', 'letter-spacing',
]);


export const RENDERED_CLICKABLE_ADJACENT_HIDDEN_RESCUE_ATTR = 'data-rabbit-mirror-clickable-adjacent-hidden-rescue';

const RENDERED_CLICKABLE_ADJACENT_HIDDEN_ITEM_ATTR = 'data-rm-clickable-adjacent-hidden-item';

export const renderedClickableAdjacentHiddenRescueStates = new WeakMap();

const CLICKABLE_ADJACENT_HIDDEN_TRIGGER_HINT_RE = /(?:点击|轻触|触摸|确认|查看|检视|检查|展开|打开|开启|读取|揭示|解锁|封存|归档|提交|播放)|\b(?:click|tap|touch|confirm|view|inspect|check|expand|open|read|reveal|unlock|archive|submit|play)\b/i;

const CLICKABLE_ADJACENT_HIDDEN_TRIGGER_CLASS_RE = /(?:trigger|button|action|click|tap|confirm|toggle|reveal|open|操作|按钮|触发)/i;

const CLICKABLE_ADJACENT_HIDDEN_TARGET_CLASS_RE = /(?:hidden|secret|detail|result|message|content|text|archive|record|system|隐藏|秘密|详情|结果|信息|内容|正文|档案|记录|判定)/i;


export const RENDERED_CLICKABLE_ADJACENT_POPUP_RESCUE_ATTR = 'data-rabbit-mirror-clickable-adjacent-popup-rescue';

const RENDERED_CLICKABLE_ADJACENT_POPUP_ITEM_ATTR = 'data-rm-clickable-adjacent-popup-item';

const RENDERED_CLICKABLE_ADJACENT_POPUP_CLOSE_ATTR = 'data-rm-clickable-adjacent-popup-close';

export const renderedClickableAdjacentPopupRescueStates = new WeakMap();

const CLICKABLE_ADJACENT_POPUP_TRIGGER_HINT_RE = /(?:点击|轻触|触摸|查看|检视|检查|打开|开启|进入|解锁|翻阅|读取|回忆|相簿|底片)|\b(?:click|tap|touch|open|inspect|view|enter|unlock|album|memory)\b/i;

const CLICKABLE_ADJACENT_POPUP_CLOSE_HINT_RE = /(?:关闭|合上|收起|返回|退出|结束|完成)|\b(?:close|back|exit|dismiss|done|cancel)\b/i;

const CLICKABLE_ADJACENT_POPUP_TARGET_HINT_RE = /(?:popup|modal|dialog|overlay|album|memory|detail|secret|hidden|弹层|弹窗|浮层|相簿|回忆|详情|秘密|隐藏)/i;


const RENDERED_CONTAINER_INTERNAL_REVEAL_ATTR = 'data-rabbit-mirror-container-internal-reveal';

const RENDERED_CONTAINER_INTERNAL_REVEAL_ITEM_ATTR = 'data-rm-container-internal-reveal-item';

export const renderedContainerInternalRevealStates = new WeakMap();

const CONTAINER_INTERNAL_REVEAL_HINT_RE = /(?:点击|轻触|触摸|恢复|曝光|播放|读取|查看|展开|解锁|揭示|悬停|移入|划过|鼠标经过|鼠标移入)|\b(?:click|tap|touch|restore|expose|play|read|view|open|reveal|hover|mouseover|mouse\s*over)\b/i;

const CONTAINER_INTERNAL_REVEAL_HOVER_HINT_RE = /(?:悬停|移入|划过|鼠标经过|鼠标移入)|\b(?:hover|mouseover|mouse\s*over)\b/i;

const CONTAINER_INTERNAL_REVEAL_CLASS_RE = /(?:hidden|secret|reveal|detail|content|text|message|msg|fragment|track|scene)/i;


const RENDERED_MASK_REVEAL_RESCUE_ATTR = 'data-rabbit-mirror-mask-reveal-rescue';

const RENDERED_MASK_REVEAL_TARGET_ATTR = 'data-rm-mask-reveal-target';

export const renderedMaskRevealRescueStates = new WeakMap();

const MASK_REVEAL_MASK_HINT_RE = /(?:frost|fog|mist|mask|cover|veil|curtain|overlay|blur|霜|雾|遮罩|覆盖|幕)/i;

const MASK_REVEAL_HIDDEN_HINT_RE = /(?:hidden|reveal|secret|message|msg|detail|content|note|memo|thought|隐藏|揭示|秘密|信息|备忘|内容)/i;

const MASK_REVEAL_TRIGGER_HINT_RE = /(?:长按|按住|点击|轻触|触摸|擦拭|擦去|揭开|查看|显露|解锁|开启)|\b(?:click|tap|touch|hold|wipe|reveal|open|inspect)\b/i;


const RENDERED_LIST_DETAIL_RESCUE_ATTR = 'data-rabbit-mirror-rendered-list-detail-rescue';

const RENDERED_LIST_DETAIL_TRIGGER_ATTR = 'data-rm-list-detail-trigger';

const RENDERED_LIST_DETAIL_PANEL_ATTR = 'data-rm-list-detail-panel';

const RENDERED_LIST_DETAIL_ACTIVE_ATTR = 'data-rm-list-detail-active';

export const renderedListDetailRescueStates = new WeakMap();

const LIST_DETAIL_DEFAULT_HINT_RE = /(?:等待|请选择|选择|选取|点击|轻触|触摸|查看|展开).{0,24}(?:目标|项目|条目|内容|详情|证物|报告|视图|对象|选项)?|\b(?:waiting|select|choose|pick|tap|click)\b/i;


export const PSEUDO_INTERACTION_HINT_RE = /(?:鼠标\s*)?(?:悬停|划过|移入)|\bhover\b|(?:点击|轻触|触摸).{0,16}(?:显示|查看|展开|播放|切换)/i;

export const EXISTING_INTERACTIVE_SELECTOR = 'a, button, input, label, summary, select, textarea, [role="button"], [contenteditable="true"]';


const RECOVERED_INTERACTION_STYLE_MAX_VALUE_CHARS = 4000;

const RECOVERED_INTERACTION_OVERLAY_PROPERTIES = new Set([
    'position', 'inset', 'top', 'right', 'bottom', 'left',
    'width', 'min-width', 'height', 'min-height', 'z-index',
]);


export function getRenderedInputRoute(input) {
    return String(input?.getAttribute?.(RENDERED_INPUT_ROUTE_ATTR) || '');
}


export function claimRenderedInputRoute(input, routeName) {
    if (!input || !routeName) return false;
    const existing = getRenderedInputRoute(input);
    if (existing && existing !== routeName) return false;
    if (!existing) input.setAttribute(RENDERED_INPUT_ROUTE_ATTR, routeName);
    return true;
}


export function dispatchRescuedInputState(input) {
    if (!input?.dispatchEvent) return;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}


export function installReversibleTargetClose(target, input, root) {
    if (!target?.addEventListener || !input || !root?.contains?.(target)) return false;
    const existing = reversibleTargetCloseStates.get(target);
    if (existing?.input === input && existing?.root === root) return true;
    if (existing) {
        target.removeEventListener?.('click', existing.onClick, false);
        reversibleTargetCloseStates.delete(target);
    }
    // DOM 被宿主克隆时 data 属性可能保留而 WeakMap 不保留；允许重新绑定真实监听器。
    if (target.hasAttribute(REVERSIBLE_TARGET_CLOSE_ATTR)) target.removeAttribute(REVERSIBLE_TARGET_CLOSE_ATTR);

    const onClick = event => {
        if (!input.checked) return;
        const nestedInteractive = event.target?.closest?.(EXISTING_INTERACTIVE_SELECTOR);
        if (nestedInteractive && nestedInteractive !== target && target.contains?.(nestedInteractive)) return;
        const selection = globalThis.getSelection?.();
        if (selection && !selection.isCollapsed && String(selection).trim()) return;
        event.preventDefault();
        if (input.type === 'radio') {
            input.checked = false;
            restoreInteractionInlineOverrides(input);
            dispatchRescuedInputState(input);
        } else {
            setRescuedCheckedState(root, input, false);
        }
    };
    target.addEventListener('click', onClick, false);
    target.setAttribute(REVERSIBLE_TARGET_CLOSE_ATTR, 'true');
    if (!target.hasAttribute('title')) target.setAttribute('title', '再次点按返回上一层');
    reversibleTargetCloseStates.set(target, { input, root, onClick });
    return true;
}

// 渲染后结构型状态层急救：不依赖可能已被宿主删除的 onclick/onchange。
// 仅处理非常明确的结构：label 直属隐藏 checkbox/radio + 两层几何重合的前景/隐藏层。

export function getInlineStyleValue(element, property) {
    return String(element?.style?.getPropertyValue?.(property) || '').trim();
}


function isExplicitlyHiddenStateLayer(element) {
    const display = getInlineStyleValue(element, 'display').toLowerCase();
    const visibility = getInlineStyleValue(element, 'visibility').toLowerCase();
    const opacityText = getInlineStyleValue(element, 'opacity');
    const opacity = Number.parseFloat(opacityText);
    return display === 'none'
        || visibility === 'hidden'
        || (opacityText !== '' && Number.isFinite(opacity) && opacity <= 0.05);
}

// 某些模型把隐藏态只写在 <style> 中，实际节点没有 inline style。
// 这类目标必须读取计算样式，否则“按钮 + 后置内容”会被误判为完全没有交互。

export function getRenderedStyleSnapshot(element) {
    let computed = null;
    try {
        computed = typeof getComputedStyle === 'function' ? getComputedStyle(element) : null;
    } catch {
        computed = null;
    }

    const display = String(computed?.display || getInlineStyleValue(element, 'display') || '').trim().toLowerCase();
    const visibility = String(computed?.visibility || getInlineStyleValue(element, 'visibility') || '').trim().toLowerCase();
    const opacityText = String(computed?.opacity || getInlineStyleValue(element, 'opacity') || '').trim();
    const opacity = Number.parseFloat(opacityText);
    const height = String(computed?.height || getInlineStyleValue(element, 'height') || '').trim().toLowerCase();
    const maxHeight = String(computed?.maxHeight || getInlineStyleValue(element, 'max-height') || '').trim().toLowerCase();
    const transform = String(computed?.transform || getInlineStyleValue(element, 'transform') || '').trim();
    const rectHeight = getRenderedElementHeight(element);

    const displayHidden = display === 'none';
    const visibilityHidden = visibility === 'hidden' || visibility === 'collapse';
    const opacityHidden = opacityText !== '' && Number.isFinite(opacity) && opacity <= 0.05;
    const heightCollapsed = isCollapsedDimensionValue(height) && rectHeight <= 1;
    const maxHeightCollapsed = isCollapsedDimensionValue(maxHeight) && rectHeight <= 1;

    return {
        display,
        visibility,
        opacityText,
        opacity,
        height,
        maxHeight,
        transform,
        rectHeight,
        displayHidden,
        visibilityHidden,
        opacityHidden,
        heightCollapsed,
        maxHeightCollapsed,
        hidden: displayHidden || visibilityHidden || opacityHidden || heightCollapsed || maxHeightCollapsed,
    };
}


function isOverlayLikeStateLayer(element) {
    const position = getInlineStyleValue(element, 'position').toLowerCase();
    if (position === 'absolute' || position === 'fixed') return true;

    const inset = getInlineStyleValue(element, 'inset');
    if (inset) return true;

    const edges = ['top', 'right', 'bottom', 'left']
        .map(property => getInlineStyleValue(element, property))
        .filter(Boolean).length;
    if (edges >= 3) return true;

    const width = getInlineStyleValue(element, 'width').replace(/\s+/g, '');
    const height = getInlineStyleValue(element, 'height').replace(/\s+/g, '');
    return width === '100%' && height === '100%';
}


function getStateLayerGeometryScore(first, second) {
    if (!first || !second) return 0;
    let score = 0;
    for (const property of ['position', 'inset', 'top', 'right', 'bottom', 'left', 'width', 'height']) {
        const firstValue = getInlineStyleValue(first, property).replace(/\s+/g, '').toLowerCase();
        const secondValue = getInlineStyleValue(second, property).replace(/\s+/g, '').toLowerCase();
        if (firstValue && secondValue && firstValue === secondValue) score += 1;
    }
    return score;
}


function neutralizeStateLayerTransform(transformText) {
    let transform = String(transformText || '').trim();
    if (!transform || transform.toLowerCase() === 'none') return '';

    let changed = false;
    transform = transform
        .replace(/translate3d\([^)]*\)/gi, () => {
            changed = true;
            return 'translate3d(0, 0, 0)';
        })
        .replace(/translate(?:x|y|z)?\([^)]*\)/gi, match => {
            changed = true;
            const name = match.slice(0, match.indexOf('('));
            if (/^translate$/i.test(name)) return 'translate(0, 0)';
            return `${name}(0)`;
        })
        .replace(/scale3d\([^)]*\)/gi, () => {
            changed = true;
            return 'scale3d(1, 1, 1)';
        })
        .replace(/scale(?:x|y|z)?\([^)]*\)/gi, match => {
            changed = true;
            const name = match.slice(0, match.indexOf('('));
            if (/^scale$/i.test(name)) return 'scale(1)';
            return `${name}(1)`;
        });

    return changed ? transform : '';
}


function buildRenderedStateLayerEntry(label, input) {
    if (!label?.children || !input || input.parentElement !== label) return null;

    const children = [...label.children];
    const inputIndex = children.indexOf(input);
    if (inputIndex < 0) return null;

    // 只看 input 后面的直属元素，避免把 label 里的说明文字或嵌套控件误当成状态层。
    const candidates = children.slice(inputIndex + 1)
        .filter(element => element?.nodeType === 1 && !/^(?:style|script|input)$/i.test(element.tagName || ''))
        .filter(isOverlayLikeStateLayer)
        .slice(0, 6);
    if (candidates.length < 2) return null;

    const rememberedFront = candidates.filter(element => element.getAttribute?.(RENDERED_STATE_LAYER_ROLE_ATTR) === 'front');
    const rememberedReveal = candidates.filter(element => element.getAttribute?.(RENDERED_STATE_LAYER_ROLE_ATTR) === 'reveal');
    const hiddenCandidates = candidates.filter(isExplicitlyHiddenStateLayer);
    const visibleCandidates = candidates.filter(element => !isExplicitlyHiddenStateLayer(element));
    if ((!hiddenCandidates.length || !visibleCandidates.length) && (!rememberedFront.length || !rememberedReveal.length)) return null;

    // DOM 被宿主克隆时，优先沿用上次写入的 front/reveal 角色，避免把交互后状态反向识别。
    const hiddenLayers = rememberedReveal.length ? rememberedReveal : hiddenCandidates.filter(hidden => (
        visibleCandidates.some(visible => getStateLayerGeometryScore(visible, hidden) >= 3)
    ));
    const visibleLayers = rememberedFront.length ? rememberedFront : visibleCandidates.filter(visible => (
        hiddenLayers.some(hidden => getStateLayerGeometryScore(visible, hidden) >= 3)
    ));
    if (!hiddenLayers.length || !visibleLayers.length) return null;

    const visibleStates = visibleLayers.map(target => ({
        target,
        originalStyles: capturePseudoStyleState(target, ['opacity', 'pointer-events']),
    }));
    const hiddenStates = hiddenLayers.map(target => {
        const originalStyles = capturePseudoStyleState(target, ['display', 'visibility', 'opacity', 'pointer-events', 'transform']);
        return {
            target,
            originalStyles,
            activeTransform: neutralizeStateLayerTransform(getCapturedStyleValue(originalStyles, 'transform')),
            wasDisplayNone: getCapturedStyleValue(originalStyles, 'display').toLowerCase() === 'none',
            wasVisibilityHidden: getCapturedStyleValue(originalStyles, 'visibility').toLowerCase() === 'hidden',
        };
    });

    visibleLayers.forEach(target => target.setAttribute(RENDERED_STATE_LAYER_ROLE_ATTR, 'front'));
    hiddenLayers.forEach(target => target.setAttribute(RENDERED_STATE_LAYER_ROLE_ATTR, 'reveal'));

    return { label, input, visibleStates, hiddenStates };
}


function applyRenderedStateLayerEntry(entry) {
    if (!entry?.input) return;
    const active = !!entry.input.checked;

    for (const state of entry.visibleStates || []) {
        restorePseudoStyleState(state.target, state.originalStyles);
        if (active) {
            applyPseudoStyleAssignments(state.target, [
                { property: 'opacity', value: '0' },
                { property: 'pointer-events', value: 'none' },
            ]);
        }
    }

    for (const state of entry.hiddenStates || []) {
        restorePseudoStyleState(state.target, state.originalStyles);
        if (!active) continue;

        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'pointer-events', value: 'auto' },
        ];
        if (state.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (state.wasVisibilityHidden) assignments.push({ property: 'visibility', value: 'visible' });
        if (state.activeTransform) assignments.push({ property: 'transform', value: state.activeTransform });
        applyPseudoStyleAssignments(state.target, assignments);
    }

    entry.label?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
    entry.input?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
}


function applyRenderedStateLayerEntries(root) {
    const state = renderedStateLayerRescueStates.get(root);
    if (!state?.entries?.size) return;
    for (const entry of state.entries.values()) applyRenderedStateLayerEntry(entry);
}


export function installRenderedStateLayerRescue(root) {
    if (!root?.querySelectorAll) return;

    let state = renderedStateLayerRescueStates.get(root);
    if (!state) {
        state = { entries: new Map(), listenerInstalled: false };
        renderedStateLayerRescueStates.set(root, state);
    }

    for (const label of root.querySelectorAll('label')) {
        const input = label.querySelector(':scope > input[type="checkbox"], :scope > input[type="radio"]');
        if (!input || state.entries.has(input)) continue;
        const existingRoute = getRenderedInputRoute(input);
        if (existingRoute && existingRoute !== 'state-layer') continue;
        const entry = buildRenderedStateLayerEntry(label, input);
        if (!entry || !claimRenderedInputRoute(input, 'state-layer')) continue;
        state.entries.set(input, entry);
        input.setAttribute(RENDERED_STATE_LAYER_RESCUE_ATTR, 'true');
    }

    if (!state.entries.size) return;

    if (!state.listenerInstalled) {
        const refresh = event => {
            const input = event.target;
            if (!input || !state.entries.has(input)) return;
            // radio 切换会同步取消同组旧项，因此统一刷新当前兔子镜内全部结构状态。
            applyRenderedStateLayerEntries(root);
        };
        root.addEventListener('input', refresh, false);
        root.addEventListener('change', refresh, false);
        state.listenerInstalled = true;
        root.dataset.rabbitMirrorRenderedStateLayerFallback = 'true';
    }

    applyRenderedStateLayerEntries(root);
}


// 渲染后“相邻隐藏内容组”急救：用于 label/checkbox 后方紧邻的多段隐藏内容。
// 不依赖 onchange 原文，专门覆盖 querySelectorAll(...)[n] 在宿主净化后无法回读的情况。

export function getClassTokens(element) {
    return String(element?.getAttribute?.('class') || '')
        .split(/\s+/)
        .map(token => token.trim())
        .filter(Boolean);
}


function isAdjacentHiddenTextCandidate(element) {
    if (!element) return false;
    const previouslyManaged = element.hasAttribute?.(RENDERED_ADJACENT_HIDDEN_ITEM_ATTR);
    if (!previouslyManaged && !isExplicitlyHiddenStateLayer(element)) return false;
    if (element.hasAttribute?.(RENDERED_STATE_LAYER_ROLE_ATTR)
        || element.hasAttribute?.(RENDERED_LIST_DETAIL_PANEL_ATTR)) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:p|div|span|section|article|aside|blockquote|small|em|strong)$/.test(tagName)) return false;
    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length >= 6 && text.length <= 1200;
}


function findAdjacentHiddenGroupHost(label) {
    let node = label?.nextElementSibling || null;
    for (let step = 0; node && step < 3; step += 1, node = node.nextElementSibling) {
        if (/^(?:style|script|input|label)$/i.test(node.tagName || '')) continue;
        const candidates = [node, ...(node.querySelectorAll?.('*') || [])].filter(isAdjacentHiddenTextCandidate);
        if (candidates.length) return node;
        // 遇到新的明确交互块后停止跨越，避免误抓更远处的隐藏内容。
        if (node.querySelector?.('input, label, button, details, summary')) break;
    }
    return null;
}


function collectAdjacentHiddenGroupTargets(host) {
    if (!host?.querySelectorAll) return [];
    const candidates = [host, ...host.querySelectorAll('*')]
        .filter(isAdjacentHiddenTextCandidate)
        .slice(0, 24);
    if (!candidates.length) return [];

    // 优先选择共享的语义 class 组，例如两个 .hidden-thought，避免把同一容器内无关隐藏层一起揭开。
    const groups = new Map();
    for (const element of candidates) {
        for (const token of getClassTokens(element)) {
            if (!ADJACENT_HIDDEN_CLASS_HINT_RE.test(token)) continue;
            if (!groups.has(token)) groups.set(token, []);
            groups.get(token).push(element);
        }
    }
    const best = [...groups.values()]
        .map(group => [...new Set(group)])
        .filter(group => group.length >= 1 && group.length <= 8)
        .sort((a, b) => b.length - a.length)[0];
    if (best?.length) return best;

    // 没有语义 class 时，只接受数量很少、且直属于同一个紧邻容器的隐藏文本。
    const direct = [...(host.children || [])].filter(isAdjacentHiddenTextCandidate);
    return direct.length >= 1 && direct.length <= 4 ? direct : [];
}


function buildRenderedAdjacentHiddenGroupEntry(label, input) {
    if (!label || !input || !ADJACENT_HIDDEN_TRIGGER_HINT_RE.test(String(label.textContent || ''))) return null;
    const host = findAdjacentHiddenGroupHost(label);
    if (!host) return null;
    const targets = collectAdjacentHiddenGroupTargets(host);
    if (!targets.length) return null;

    const targetStates = targets.map(target => {
        const originalStyles = capturePseudoStyleState(target, [
            'display', 'visibility', 'opacity', 'pointer-events', 'transform', 'max-height',
        ]);
        const originalTransform = getCapturedStyleValue(originalStyles, 'transform');
        return {
            target,
            originalStyles,
            activeTransform: neutralizeStateLayerTransform(originalTransform),
            wasDisplayNone: getCapturedStyleValue(originalStyles, 'display').toLowerCase() === 'none',
            wasVisibilityHidden: getCapturedStyleValue(originalStyles, 'visibility').toLowerCase() === 'hidden',
            hadCollapsedMaxHeight: /^(?:0|0px|0em|0rem|0%)$/i.test(getCapturedStyleValue(originalStyles, 'max-height').replace(/\s+/g, '')),
        };
    });

    const hostState = {
        target: host,
        originalStyles: capturePseudoStyleState(host, ['min-height', 'overflow']),
        needsHeight: targets.some(target => ['absolute', 'fixed'].includes(getInlineStyleValue(target, 'position').toLowerCase())),
    };

    targets.forEach((target, index) => target.setAttribute(RENDERED_ADJACENT_HIDDEN_ITEM_ATTR, String(index)));
    input.setAttribute(RENDERED_ADJACENT_HIDDEN_GROUP_RESCUE_ATTR, 'true');
    return { label, input, hostState, targetStates };
}


function applyRenderedAdjacentHiddenGroupEntry(entry) {
    if (!entry?.input) return;
    const active = !!entry.input.checked;
    restorePseudoStyleState(entry.hostState.target, entry.hostState.originalStyles);

    for (const state of entry.targetStates || []) {
        restorePseudoStyleState(state.target, state.originalStyles);
        if (!active) continue;
        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ];
        if (state.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (state.activeTransform) assignments.push({ property: 'transform', value: state.activeTransform });
        if (state.hadCollapsedMaxHeight) assignments.push({ property: 'max-height', value: '1000px' });
        applyPseudoStyleAssignments(state.target, assignments);
    }

    if (active && entry.hostState.needsHeight) {
        // 绝对定位文本不会撑开父容器；给相邻内容区保留可见高度，避免内容虽已 opacity:1 仍被外层裁切。
        const estimatedHeight = Math.min(240, Math.max(56, (entry.targetStates?.length || 1) * 42));
        applyPseudoStyleAssignments(entry.hostState.target, [
            { property: 'min-height', value: `${estimatedHeight}px` },
            { property: 'overflow', value: 'visible' },
        ]);
    }

    entry.label?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
    entry.input?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
}


function applyRenderedAdjacentHiddenGroupEntries(root) {
    const state = renderedAdjacentHiddenGroupRescueStates.get(root);
    if (!state?.entries?.size) return;
    for (const entry of state.entries.values()) applyRenderedAdjacentHiddenGroupEntry(entry);
}


export function installRenderedAdjacentHiddenGroupRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedAdjacentHiddenGroupRescueStates.get(root);
    if (!state) {
        state = { entries: new Map(), listenerInstalled: false };
        renderedAdjacentHiddenGroupRescueStates.set(root, state);
    }

    for (const label of root.querySelectorAll('label')) {
        const input = label.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!input || state.entries.has(input)) continue;
        const existingRoute = getRenderedInputRoute(input);
        if (existingRoute && existingRoute !== 'adjacent-hidden') continue;
        const entry = buildRenderedAdjacentHiddenGroupEntry(label, input);
        if (!entry || !claimRenderedInputRoute(input, 'adjacent-hidden')) continue;
        state.entries.set(input, entry);
        for (const targetState of entry.targetStates || []) installReversibleTargetClose(targetState.target, input, root);
    }
    if (!state.entries.size) return;

    if (!state.listenerInstalled) {
        const refresh = event => {
            if (!state.entries.has(event.target)) return;
            applyRenderedAdjacentHiddenGroupEntries(root);
        };
        root.addEventListener('input', refresh, false);
        root.addEventListener('change', refresh, false);
        state.listenerInstalled = true;
        root.dataset.rabbitMirrorAdjacentHiddenGroupFallback = 'true';
    }
    applyRenderedAdjacentHiddenGroupEntries(root);
}


// 渲染后“label 内单块隐藏内容”急救：用于 checkbox/radio 与隐藏内容同处一个 label 的结构。
// 不依赖宿主可能已经删除的 onclick/onchange，只根据当前安全 DOM 建立状态切换。

function isLabelInternalHiddenCandidate(element, input, label) {
    if (!element || element === input || element === label || !label?.contains?.(element)) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    // 隐藏 input 是交互载体，不得误判为待显示内容。
    if (/^(?:input|select|textarea|option|button|label|style|script|template|svg|path)$/.test(tagName)) return false;
    if (element.hasAttribute?.(RENDERED_STATE_LAYER_ROLE_ATTR)
        || element.hasAttribute?.(RENDERED_ADJACENT_HIDDEN_ITEM_ATTR)
        || element.hasAttribute?.(RENDERED_LIST_DETAIL_PANEL_ATTR)) return false;
    const previouslyManaged = element.hasAttribute?.(RENDERED_LABEL_INTERNAL_HIDDEN_ITEM_ATTR);
    if (!previouslyManaged && !isExplicitlyHiddenStateLayer(element)) return false;

    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 4 || text.length > 1800) return false;

    const classText = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    const semanticHint = ADJACENT_HIDDEN_CLASS_HINT_RE.test(classText);
    const inlineMaxHeight = getInlineStyleValue(element, 'max-height').replace(/\s+/g, '').toLowerCase();
    const inlineHeight = getInlineStyleValue(element, 'height').replace(/\s+/g, '').toLowerCase();
    const collapsedBox = /^(?:0|0px|0em|0rem|0%)$/.test(inlineMaxHeight)
        || /^(?:0|0px|0em|0rem|0%)$/.test(inlineHeight);

    // 严格补充“label 内弹层”结构：input 后隔着一段可见触发文字，再跟一块 display:none/opacity:0 内容。
    // 这覆盖模型常写错的 this.nextElementSibling（实际目标是下下个兄弟节点），但不会扫描 label 外部。
    const children = [...(label.children || [])];
    const inputIndex = children.indexOf(input);
    const elementIndex = children.indexOf(element);
    const directAfterInput = element.parentElement === label && inputIndex >= 0 && elementIndex > inputIndex;
    const leadingText = directAfterInput
        ? children.slice(inputIndex + 1, elementIndex)
            .filter(node => !isExplicitlyHiddenStateLayer(node))
            .map(node => String(node.textContent || '').replace(/\s+/g, ' ').trim())
            .join(' ')
        : '';
    const triggerHint = ADJACENT_HIDDEN_TRIGGER_HINT_RE.test(leadingText);
    const displayNone = getInlineStyleValue(element, 'display').toLowerCase() === 'none';
    const position = getInlineStyleValue(element, 'position').toLowerCase();
    const positionedPopup = position === 'absolute' || position === 'fixed';

    return previouslyManaged || semanticHint || collapsedBox || (directAfterInput && triggerHint && (displayNone || positionedPopup));
}


function collectLabelInternalHiddenTargets(label, input) {
    if (!label?.querySelectorAll) return [];
    const raw = [...label.querySelectorAll('*')]
        .filter(element => isLabelInternalHiddenCandidate(element, input, label));
    if (!raw.length) return [];

    // 如果父级隐藏容器已被选中，不再同时选择其内部子节点，避免重复写样式。
    const topLevel = raw.filter(element => !raw.some(other => other !== element && other.contains?.(element)));
    return topLevel.slice(0, 4);
}


function getComputedOverflowValue(element) {
    try {
        const style = typeof getComputedStyle === 'function' ? getComputedStyle(element) : null;
        return `${style?.overflow || ''} ${style?.overflowX || ''} ${style?.overflowY || ''}`.toLowerCase();
    } catch {
        return '';
    }
}


function getRenderedElementHeight(element) {
    try {
        return Number(element?.getBoundingClientRect?.().height || 0);
    } catch {
        return 0;
    }
}


function captureLabelInternalAncestorStates(target, label) {
    const states = [];
    let current = target?.parentElement || null;
    for (let depth = 0; current && depth < 5; depth += 1, current = current.parentElement) {
        if (!label.contains(current) && current !== label) break;
        const overflow = getComputedOverflowValue(current);
        const inlineHeight = getInlineStyleValue(current, 'height').replace(/\s+/g, '').toLowerCase();
        const inlineMaxHeight = getInlineStyleValue(current, 'max-height').replace(/\s+/g, '').toLowerCase();
        const collapsed = /^(?:0|0px|0em|0rem|0%)$/.test(inlineHeight)
            || /^(?:0|0px|0em|0rem|0%)$/.test(inlineMaxHeight)
            || getRenderedElementHeight(current) <= 1;
        const clips = /(?:hidden|clip)/.test(overflow);
        if (collapsed || clips || current === label) {
            states.push({
                target: current,
                originalStyles: capturePseudoStyleState(current, [
                    'display', 'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
                ]),
                collapsed,
                clips,
            });
        }
        if (current === label) break;
    }
    return states;
}


function buildRenderedLabelInternalHiddenEntry(label, input, root) {
    if (!label || !input || input.closest?.('label') !== label) return null;
    const targets = collectLabelInternalHiddenTargets(label, input);
    if (!targets.length) return null;

    const targetStates = targets.map(target => {
        const originalStyles = capturePseudoStyleState(target, [
            'display', 'visibility', 'opacity', 'pointer-events', 'transform',
            'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
            'position', 'inset', 'top', 'right', 'bottom', 'left', 'width', 'max-width',
            'box-sizing', 'margin', 'margin-top',
        ]);
        const originalTransform = getCapturedStyleValue(originalStyles, 'transform');
        const originalPosition = getCapturedStyleValue(originalStyles, 'position').toLowerCase();
        return {
            target,
            originalStyles,
            activeTransform: neutralizeStateLayerTransform(originalTransform),
            wasDisplayNone: getCapturedStyleValue(originalStyles, 'display').toLowerCase() === 'none',
            wasVisibilityHidden: getCapturedStyleValue(originalStyles, 'visibility').toLowerCase() === 'hidden',
            hadCollapsedHeight: /^(?:0|0px|0em|0rem|0%)$/i.test(getCapturedStyleValue(originalStyles, 'height').replace(/\s+/g, '')),
            hadCollapsedMaxHeight: /^(?:0|0px|0em|0rem|0%)$/i.test(getCapturedStyleValue(originalStyles, 'max-height').replace(/\s+/g, '')),
            isPositionedPopup: ['absolute', 'fixed'].includes(originalPosition),
            ancestorStates: captureLabelInternalAncestorStates(target, label),
        };
    });

    targets.forEach((target, index) => target.setAttribute(RENDERED_LABEL_INTERNAL_HIDDEN_ITEM_ATTR, String(index)));
    input.setAttribute(RENDERED_LABEL_INTERNAL_HIDDEN_RESCUE_ATTR, 'true');
    return { label, input, targetStates };
}


function restoreLabelInternalAncestorStates(entry) {
    const restored = new Set();
    for (const state of entry?.targetStates || []) {
        for (const ancestor of state.ancestorStates || []) {
            if (!ancestor?.target || restored.has(ancestor.target)) continue;
            restorePseudoStyleState(ancestor.target, ancestor.originalStyles);
            restored.add(ancestor.target);
        }
    }
}


function applyRenderedLabelInternalHiddenEntry(entry) {
    if (!entry?.input) return;
    const active = !!entry.input.checked;
    restoreLabelInternalAncestorStates(entry);

    for (const state of entry.targetStates || []) {
        restorePseudoStyleState(state.target, state.originalStyles);
        if (!active) continue;

        const naturalHeight = Math.max(80, Number(state.target?.scrollHeight || 0) + 24);
        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
            { property: 'overflow', value: 'visible' },
        ];
        if (state.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (state.activeTransform) assignments.push({ property: 'transform', value: state.activeTransform });
        if (state.isPositionedPopup) {
            // 绝对定位弹层经常被外层 overflow:hidden 裁掉，也会盖住原触发区，导致无法再次关闭。
            // 急救时暂时改为同一 label 内的流式展开；取消勾选后由统一基线精确恢复。
            assignments.push(
                { property: 'position', value: 'relative' },
                { property: 'inset', value: 'auto' },
                { property: 'top', value: 'auto' },
                { property: 'right', value: 'auto' },
                { property: 'bottom', value: 'auto' },
                { property: 'left', value: 'auto' },
                { property: 'width', value: '100%' },
                { property: 'max-width', value: '100%' },
                { property: 'box-sizing', value: 'border-box' },
                { property: 'margin', value: '10px 0 0 0' },
            );
        }
        if (state.hadCollapsedHeight || getRenderedElementHeight(state.target) <= 1) {
            assignments.push({ property: 'height', value: 'auto' });
            assignments.push({ property: 'min-height', value: `${naturalHeight}px` });
        }
        if (state.hadCollapsedMaxHeight || getRenderedElementHeight(state.target) <= 1) {
            assignments.push({ property: 'max-height', value: `${Math.max(320, naturalHeight * 2)}px` });
        }
        applyPseudoStyleAssignments(state.target, assignments);

        for (const ancestor of state.ancestorStates || []) {
            const ancestorAssignments = [];
            if (ancestor.clips) {
                ancestorAssignments.push({ property: 'overflow', value: 'visible' });
                ancestorAssignments.push({ property: 'overflow-x', value: 'visible' });
                ancestorAssignments.push({ property: 'overflow-y', value: 'visible' });
            }
            if (ancestor.collapsed || ancestor.target === entry.label) {
                const contentHeight = Math.max(
                    Number(ancestor.target?.scrollHeight || 0),
                    naturalHeight + 48,
                );
                ancestorAssignments.push({ property: 'height', value: 'auto' });
                ancestorAssignments.push({ property: 'max-height', value: `${Math.max(480, contentHeight + 80)}px` });
                ancestorAssignments.push({ property: 'min-height', value: `${Math.min(1200, contentHeight)}px` });
            }
            applyPseudoStyleAssignments(ancestor.target, ancestorAssignments);
        }
    }

    entry.label?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
    entry.input?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
}


export function applyRenderedLabelInternalHiddenEntries(root) {
    const state = renderedLabelInternalHiddenRescueStates.get(root);
    if (!state?.entries?.size) return;
    for (const entry of state.entries.values()) applyRenderedLabelInternalHiddenEntry(entry);
}


export function installRenderedLabelInternalHiddenRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedLabelInternalHiddenRescueStates.get(root);
    if (!state) {
        state = { entries: new Map(), listenerInstalled: false };
        renderedLabelInternalHiddenRescueStates.set(root, state);
    }

    for (const label of root.querySelectorAll('label')) {
        const input = label.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!input || state.entries.has(input)) continue;
        const existingRoute = getRenderedInputRoute(input);
        if (existingRoute && existingRoute !== 'label-internal') continue;
        const entry = buildRenderedLabelInternalHiddenEntry(label, input, root);
        if (!entry || !claimRenderedInputRoute(input, 'label-internal')) continue;
        state.entries.set(input, entry);
    }
    if (!state.entries.size) return;

    if (!state.listenerInstalled) {
        const refresh = event => {
            if (!state.entries.has(event.target)) return;
            applyRenderedLabelInternalHiddenEntries(root);
            // 某些主题会在 change 后一帧重新写布局；短延迟复核能避免刚显示又被压回 0 高度。
            for (const delay of [0, 80, 260]) {
                setTimeout(() => {
                    if (root.isConnected) applyRenderedLabelInternalHiddenEntries(root);
                }, delay);
            }
        };
        root.addEventListener('input', refresh, false);
        root.addEventListener('change', refresh, false);
        state.listenerInstalled = true;
        root.dataset.rabbitMirrorLabelInternalHiddenFallback = 'true';
    }
    applyRenderedLabelInternalHiddenEntries(root);
}



// 渲染后“label 后置结果层”急救：用于 checkbox/radio 位于 label 内，结果层紧跟在 label 后方的结构。
// 不依赖已被宿主删除的 onchange；优先保证隐藏结果能够显示，并可选增强同画布内的零尺寸视觉主体。

export function isCollapsedDimensionValue(value) {
    return /^(?:0|0px|0em|0rem|0%)$/i.test(String(value || '').replace(/\s+/g, ''));
}


function isLabelAdjacentResultCandidate(element) {
    if (!element || /^(?:input|label|button|style|script|template)$/i.test(element.tagName || '')) return false;
    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 8 || text.length > 2400) return false;

    const previouslyManaged = element.hasAttribute?.(RENDERED_LABEL_ADJACENT_RESULT_ITEM_ATTR);
    const hidden = isExplicitlyHiddenStateLayer(element)
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'height'))
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'max-height'));
    if (!previouslyManaged && !hidden) return false;

    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    const hasStructure = !!element.querySelector?.('p, div, span, section, article, ul, ol, dl, table, [style*="background"], [style*="border"]');
    return LABEL_ADJACENT_RESULT_HINT_RE.test(semantic) || hasStructure || text.length >= 40;
}


function findLabelAdjacentResultTarget(label) {
    let node = label?.nextElementSibling || null;
    for (let step = 0; node && step < 3; step += 1, node = node.nextElementSibling) {
        if (/^(?:style|script)$/i.test(node.tagName || '')) continue;
        if (isLabelAdjacentResultCandidate(node)) return node;
        // 只允许跨过很短的空白装饰层；遇到新的交互结构即停止。
        if (node.querySelector?.('input, label, button, details, summary')) break;
        const text = String(node.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length > 24) break;
    }
    return null;
}


function collectLabelAdjacentVisualTargets(label) {
    const parent = label?.parentElement;
    if (!parent?.children) return [];
    const siblings = [...parent.children];
    const labelIndex = siblings.indexOf(label);
    if (labelIndex <= 0) return [];

    const searchRoots = siblings.slice(Math.max(0, labelIndex - 5), labelIndex).reverse();
    for (const searchRoot of searchRoots) {
        const candidates = [searchRoot, ...(searchRoot.querySelectorAll?.('[class], [id]') || [])]
            .filter(element => {
                const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
                if (!LABEL_ADJACENT_VISUAL_HINT_RE.test(semantic)) return false;
                if (element.hasAttribute?.(RENDERED_LABEL_ADJACENT_VISUAL_ITEM_ATTR)) return true;
                const width = getInlineStyleValue(element, 'width');
                const height = getInlineStyleValue(element, 'height');
                if (!isCollapsedDimensionValue(width) || !isCollapsedDimensionValue(height)) return false;
                const radius = getInlineStyleValue(element, 'border-radius');
                return /(?:50%|999px|9999px)/i.test(radius) || /circle|ring|zone|radar/i.test(semantic);
            });
        if (candidates.length) return candidates.slice(0, 2);
    }
    return [];
}


function buildRenderedLabelAdjacentResultEntry(label, input) {
    if (!label || !input || input.closest?.('label') !== label) return null;
    const target = findLabelAdjacentResultTarget(label);
    if (!target) return null;

    const originalStyles = capturePseudoStyleState(target, [
        'display', 'visibility', 'opacity', 'pointer-events', 'transform',
        'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
    ]);
    const targetState = {
        target,
        originalStyles,
        activeTransform: neutralizeStateLayerTransform(getCapturedStyleValue(originalStyles, 'transform')),
        wasDisplayNone: getCapturedStyleValue(originalStyles, 'display').toLowerCase() === 'none',
        hadCollapsedHeight: isCollapsedDimensionValue(getCapturedStyleValue(originalStyles, 'height')),
        hadCollapsedMaxHeight: isCollapsedDimensionValue(getCapturedStyleValue(originalStyles, 'max-height')),
    };

    const visualStates = collectLabelAdjacentVisualTargets(label).map(visual => ({
        target: visual,
        originalStyles: capturePseudoStyleState(visual, ['width', 'height', 'opacity', 'transform']),
    }));

    target.setAttribute(RENDERED_LABEL_ADJACENT_RESULT_ITEM_ATTR, 'true');
    visualStates.forEach((state, index) => state.target.setAttribute(RENDERED_LABEL_ADJACENT_VISUAL_ITEM_ATTR, String(index)));
    input.setAttribute(RENDERED_LABEL_ADJACENT_RESULT_RESCUE_ATTR, 'true');
    return { label, input, targetState, visualStates };
}


function applyRenderedLabelAdjacentResultEntry(entry) {
    if (!entry?.input || !entry?.targetState?.target) return;
    const active = !!entry.input.checked;
    const state = entry.targetState;
    restorePseudoStyleState(state.target, state.originalStyles);
    for (const visualState of entry.visualStates || []) restorePseudoStyleState(visualState.target, visualState.originalStyles);

    if (active) {
        const naturalHeight = Math.max(72, Number(state.target.scrollHeight || 0) + 20);
        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
            { property: 'overflow', value: 'visible' },
        ];
        if (state.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (state.activeTransform) assignments.push({ property: 'transform', value: state.activeTransform });
        if (state.hadCollapsedHeight) assignments.push({ property: 'height', value: 'auto' });
        if (state.hadCollapsedMaxHeight || getRenderedElementHeight(state.target) <= 1) {
            assignments.push({ property: 'max-height', value: `${Math.max(360, naturalHeight * 2)}px` });
            assignments.push({ property: 'min-height', value: `${Math.min(1200, naturalHeight)}px` });
        }
        applyPseudoStyleAssignments(state.target, assignments);

        for (const visualState of entry.visualStates || []) {
            let size = 130;
            try {
                const rect = visualState.target.parentElement?.getBoundingClientRect?.();
                const candidate = Math.min(Number(rect?.width || 0), Number(rect?.height || 0)) * 0.72;
                if (Number.isFinite(candidate) && candidate >= 56) size = Math.max(72, Math.min(160, Math.round(candidate)));
            } catch {
                // Fallback size remains 130px.
            }
            applyPseudoStyleAssignments(visualState.target, [
                { property: 'width', value: `${size}px` },
                { property: 'height', value: `${size}px` },
                { property: 'opacity', value: '1' },
            ]);
        }
    }

    entry.label?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
    entry.input?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
}


function applyRenderedLabelAdjacentResultEntries(root) {
    const state = renderedLabelAdjacentResultRescueStates.get(root);
    if (!state?.entries?.size) return;
    for (const entry of state.entries.values()) applyRenderedLabelAdjacentResultEntry(entry);
}


export function installRenderedLabelAdjacentResultRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedLabelAdjacentResultRescueStates.get(root);
    if (!state) {
        state = { entries: new Map(), listenerInstalled: false };
        renderedLabelAdjacentResultRescueStates.set(root, state);
    }

    for (const label of root.querySelectorAll('label')) {
        const input = label.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!input || state.entries.has(input)) continue;
        const existingRoute = getRenderedInputRoute(input);
        if (existingRoute && existingRoute !== 'label-adjacent') continue;
        const entry = buildRenderedLabelAdjacentResultEntry(label, input);
        if (!entry || !claimRenderedInputRoute(input, 'label-adjacent')) continue;
        state.entries.set(input, entry);
        installReversibleTargetClose(entry.targetState?.target, input, root);
    }
    if (!state.entries.size) return;

    if (!state.listenerInstalled) {
        const refresh = event => {
            if (!state.entries.has(event.target)) return;
            applyRenderedLabelAdjacentResultEntries(root);
            for (const delay of [0, 80, 260]) {
                setTimeout(() => {
                    if (root.isConnected) applyRenderedLabelAdjacentResultEntries(root);
                }, delay);
            }
        };
        root.addEventListener('input', refresh, false);
        root.addEventListener('change', refresh, false);
        state.listenerInstalled = true;
        root.dataset.rabbitMirrorLabelAdjacentResultFallback = 'true';
    }
    applyRenderedLabelAdjacentResultEntries(root);
}


// checkbox/radio → ID目标显隐急救：专门解析安全的
// document.getElementById('id').style.xxx = this.checked ? 'A' : 'B'
// 不执行模型 JavaScript；将状态绑定到 input/change，因此 label 兜底手动切换时也能生效。

function collectCheckedIdTargetAssignments(scriptText, root) {
    const source = String(scriptText || '');
    if (!source || !/document\s*\.\s*getElementById\s*\(/i.test(source)
        || !/this\s*\.\s*checked/i.test(source)) return null;

    const matches = [];
    const remember = (match, rawId, rawProperty, checkedValue, uncheckedValue) => {
        const target = resolveScopedPseudoId(root, rawId);
        const property = normalizeStylePropertyName(rawProperty);
        const activeValue = decodeSafeInlineString(checkedValue).trim();
        const inactiveValue = decodeSafeInlineString(uncheckedValue).trim();
        if (!target || !property || !CHECKED_ID_TARGET_ALLOWED_PROPERTIES.has(property)
            || !activeValue || !inactiveValue) return false;
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            target,
            property,
            checkedValue: activeValue,
            uncheckedValue: inactiveValue,
        });
        return true;
    };

    // document.getElementById('id').style.display = this.checked ? 'block' : 'none';
    const dotRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*style\s*\.\s*([a-zA-Z][\w]*)\s*=\s*this\s*\.\s*checked\s*\?\s*(['"])([\s\S]*?)\4\s*:\s*(['"])([\s\S]*?)\6\s*;?/g;
    let match;
    while ((match = dotRe.exec(source))) {
        if (!remember(match, match[2], match[3], match[5], match[7])) return null;
    }

    // document.getElementById('id').style['display'] = this.checked ? 'block' : 'none';
    const bracketRe = /document\s*\.\s*getElementById\s*\(\s*(['"])([a-zA-Z_][\w:.-]*)\1\s*\)\s*\.\s*style\s*\[\s*(['"])([a-zA-Z-]+)\3\s*\]\s*=\s*this\s*\.\s*checked\s*\?\s*(['"])([\s\S]*?)\5\s*:\s*(['"])([\s\S]*?)\7\s*;?/g;
    while ((match = bracketRe.exec(source))) {
        if (!remember(match, match[2], match[4], match[6], match[8])) return null;
    }

    if (!matches.length) return null;
    matches.sort((a, b) => a.start - b.start);

    // 仅接受上述条件赋值与空白、分号、注释。出现其他语句时整段放弃。
    let cursor = 0;
    let remainder = '';
    for (const item of matches) {
        if (item.start < cursor) continue;
        remainder += source.slice(cursor, item.start);
        cursor = item.end;
    }
    remainder += source.slice(cursor);
    remainder = remainder
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/[^\r\n]*/g, '')
        .replace(/[\s;]+/g, '');
    if (remainder !== '') return null;

    return matches.map(item => ({
        target: item.target,
        property: item.property,
        checkedValue: item.checkedValue,
        uncheckedValue: item.uncheckedValue,
    }));
}


function collectRenderedCheckedIdTargetSources(root) {
    const sources = new Map();
    if (!root?.querySelectorAll) return sources;

    for (const input of root.querySelectorAll('input[type="checkbox"][onclick], input[type="radio"][onclick]')) {
        const source = String(input.getAttribute('onclick') || '');
        if (source) sources.set(input, source);
    }

    // 宿主若已删除 onclick，则从同一条消息的原始兔子镜按子节点路径回读。
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) return sources;

    for (const rawInput of rawRoot.querySelectorAll('input[type="checkbox"][onclick], input[type="radio"][onclick]')) {
        const path = getElementChildIndexPath(rawRoot, rawInput);
        if (!path) continue;
        const renderedInput = resolveElementChildIndexPath(root, path);
        if (!renderedInput?.matches?.('input[type="checkbox"], input[type="radio"]') || sources.has(renderedInput)) continue;
        const source = String(rawInput.getAttribute('onclick') || '');
        if (source) sources.set(renderedInput, source);
    }
    return sources;
}


function buildRenderedCheckedIdTargetEntry(input, assignments) {
    if (!input || !assignments?.length) return null;
    const targetStates = assignments.map(action => {
        const originalStyles = capturePseudoStyleState(action.target, [action.property]);
        action.target.setAttribute(RENDERED_CHECKED_ID_TARGET_ITEM_ATTR, 'true');
        return { ...action, originalStyles };
    });
    input.setAttribute(RENDERED_CHECKED_ID_TARGET_RESCUE_ATTR, 'true');
    return { input, targetStates };
}


function applyRenderedCheckedIdTargetEntry(entry) {
    if (!entry?.input || !entry?.targetStates?.length) return;
    const active = !!entry.input.checked;
    for (const state of entry.targetStates) {
        restorePseudoStyleState(state.target, state.originalStyles);
        const value = active ? state.checkedValue : state.uncheckedValue;
        applyPseudoStyleAssignments(state.target, [{ property: state.property, value }]);
        if (state.property === 'display' || state.property === 'visibility' || state.property === 'opacity') {
            const hidden = (state.property === 'display' && value.toLowerCase() === 'none')
                || (state.property === 'visibility' && value.toLowerCase() === 'hidden')
                || (state.property === 'opacity' && Number.parseFloat(value) <= 0.05);
            state.target.setAttribute('aria-hidden', hidden ? 'true' : 'false');
        }
    }
    entry.input.setAttribute('aria-pressed', active ? 'true' : 'false');
}


export function installRenderedCheckedIdTargetRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedCheckedIdTargetRescueStates.get(root);
    if (!state) {
        state = { entries: new Map(), listenerInstalled: false };
        renderedCheckedIdTargetRescueStates.set(root, state);
    }

    for (const [input, source] of collectRenderedCheckedIdTargetSources(root)) {
        if (state.entries.has(input)) continue;
        const existingRoute = getRenderedInputRoute(input);
        if (existingRoute && existingRoute !== 'checked-id-target') continue;
        const assignments = collectCheckedIdTargetAssignments(source, root);
        if (!assignments?.length || !claimRenderedInputRoute(input, 'checked-id-target')) continue;
        const entry = buildRenderedCheckedIdTargetEntry(input, assignments);
        if (!entry) continue;
        state.entries.set(input, entry);
        // 避免浏览器原生 click 与本地 input/change 急救重复执行。
        input.removeAttribute('onclick');
    }
    if (!state.entries.size) return;

    if (!state.listenerInstalled) {
        const refresh = event => {
            const entry = state.entries.get(event.target);
            if (!entry) return;
            applyRenderedCheckedIdTargetEntry(entry);
            for (const delay of [0, 80, 260]) {
                setTimeout(() => {
                    if (root.isConnected && entry.input.isConnected) applyRenderedCheckedIdTargetEntry(entry);
                }, delay);
            }
        };
        root.addEventListener('input', refresh, false);
        root.addEventListener('change', refresh, false);
        state.listenerInstalled = true;
        root.dataset.rabbitMirrorCheckedIdTargetFallback = 'true';
    }

    for (const entry of state.entries.values()) applyRenderedCheckedIdTargetEntry(entry);
}


// 渲染后“按钮 + 后置隐藏内容”急救：用于宿主删除 onclick 后，只剩普通 button 与紧邻隐藏内容的结构。
// 该路线优先于触屏 hover 兜底；点击一次显示，第二次点击精确恢复最初状态。

function isRenderedButtonAdjacentHiddenTarget(element, button) {
    if (!element || !button || element === button) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|aside|p|ul|ol|dl)$/.test(tagName)) return false;

    const previouslyManaged = element.hasAttribute?.(RENDERED_BUTTON_ADJACENT_HIDDEN_ITEM_ATTR);
    const renderedStyle = getRenderedStyleSnapshot(element);
    const hidden = isExplicitlyHiddenStateLayer(element)
        || renderedStyle.hidden
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'height'))
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'max-height'));
    if (!previouslyManaged && !hidden) return false;

    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 4 || text.length > 3200) return false;
    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    return previouslyManaged || BUTTON_ADJACENT_HIDDEN_HINT_RE.test(semantic) || text.length >= 24;
}


export function findRenderedButtonAdjacentHiddenTarget(button) {
    let node = button?.nextElementSibling || null;
    for (let step = 0; node && step < 3; step += 1, node = node.nextElementSibling) {
        if (/^(?:style|script|template)$/i.test(node.tagName || '')) continue;
        if (isRenderedButtonAdjacentHiddenTarget(node, button)) return node;

        // 只允许跨过空白/极短装饰节点；遇到另一处明确交互即停止，避免串到无关区域。
        if (node.querySelector?.('button, input, label, details, summary')) break;
        const text = String(node.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length > 12) break;
    }
    return null;
}


export function hasRenderedButtonAdjacentHiddenCandidates(root) {
    if (!root?.querySelectorAll) return false;
    return [...root.querySelectorAll('button')].some(button => !!findRenderedButtonAdjacentHiddenTarget(button));
}


function buildRenderedButtonAdjacentHiddenEntry(button, target) {
    if (!button || !target) return null;
    const renderedStyle = getRenderedStyleSnapshot(target);
    const originalStyles = capturePseudoStyleState(target, [
        'display', 'visibility', 'opacity', 'pointer-events', 'transform',
        'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
        'position', 'inset', 'top', 'right', 'bottom', 'left', 'width', 'max-width',
        'margin', 'margin-top',
    ]);
    const inlinePosition = getCapturedStyleValue(originalStyles, 'position').toLowerCase();
    let computedPosition = '';
    try {
        computedPosition = String(typeof getComputedStyle === 'function' ? getComputedStyle(target)?.position || '' : '').toLowerCase();
    } catch {
        computedPosition = '';
    }
    const position = inlinePosition || computedPosition;
    const originalTransform = getCapturedStyleValue(originalStyles, 'transform') || renderedStyle.transform;
    const activeTransform = neutralizeStateLayerTransform(originalTransform)
        || (originalTransform && originalTransform.toLowerCase() !== 'none' ? 'none' : '');

    target.setAttribute(RENDERED_BUTTON_ADJACENT_HIDDEN_ITEM_ATTR, 'true');
    button.setAttribute(RENDERED_BUTTON_ADJACENT_HIDDEN_RESCUE_ATTR, 'true');
    return {
        button,
        target,
        active: false,
        originalStyles,
        activeTransform,
        wasDisplayNone: getCapturedStyleValue(originalStyles, 'display').toLowerCase() === 'none' || renderedStyle.displayHidden,
        wasVisibilityHidden: getCapturedStyleValue(originalStyles, 'visibility').toLowerCase() === 'hidden' || renderedStyle.visibilityHidden,
        wasOpacityHidden: renderedStyle.opacityHidden,
        hadCollapsedHeight: isCollapsedDimensionValue(getCapturedStyleValue(originalStyles, 'height')) || renderedStyle.heightCollapsed,
        hadCollapsedMaxHeight: isCollapsedDimensionValue(getCapturedStyleValue(originalStyles, 'max-height')) || renderedStyle.maxHeightCollapsed,
        isPositionedPopup: position === 'absolute' || position === 'fixed',
    };
}


function applyRenderedButtonAdjacentHiddenEntry(entry, active = entry?.active) {
    if (!entry?.button || !entry?.target) return;
    entry.active = !!active;
    restorePseudoStyleState(entry.target, entry.originalStyles);

    if (entry.active) {
        const naturalHeight = Math.max(64, Number(entry.target.scrollHeight || 0) + 20);
        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ];
        if (entry.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (entry.activeTransform) assignments.push({ property: 'transform', value: entry.activeTransform });
        if (entry.hadCollapsedHeight) assignments.push({ property: 'height', value: 'auto' });
        if (entry.hadCollapsedMaxHeight || getRenderedElementHeight(entry.target) <= 1) {
            assignments.push({ property: 'max-height', value: `${Math.max(320, naturalHeight * 2)}px` });
            assignments.push({ property: 'min-height', value: `${Math.min(1200, naturalHeight)}px` });
        }
        if (entry.isPositionedPopup) {
            assignments.push(
                { property: 'position', value: 'relative' },
                { property: 'inset', value: 'auto' },
                { property: 'top', value: 'auto' },
                { property: 'right', value: 'auto' },
                { property: 'bottom', value: 'auto' },
                { property: 'left', value: 'auto' },
                { property: 'width', value: 'auto' },
                { property: 'max-width', value: '100%' },
                { property: 'margin-top', value: '10px' },
            );
        }
        applyPseudoStyleAssignments(entry.target, assignments);
    }

    entry.button.setAttribute('aria-expanded', entry.active ? 'true' : 'false');
    entry.button.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
}


export function installRenderedButtonAdjacentHiddenRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedButtonAdjacentHiddenRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        renderedButtonAdjacentHiddenRescueStates.set(root, state);
    }

    for (const button of root.querySelectorAll('button')) {
        if (button.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)
            || button.hasAttribute?.(RENDERED_CSS_STATE_SIBLING_RESCUE_ATTR)
            || state.entries.has(button)) continue;
        const target = findRenderedButtonAdjacentHiddenTarget(button);
        if (!target) continue;
        const entry = buildRenderedButtonAdjacentHiddenEntry(button, target);
        if (!entry) continue;
        state.entries.set(button, entry);

        button.addEventListener('click', event => {
            event.preventDefault();
            const nextActive = !entry.active;
            applyRenderedButtonAdjacentHiddenEntry(entry, nextActive);
            // 第二次点击恢复隐藏时，移除按钮焦点，避免原始 :focus + 后置内容规则继续把目标显示出来。
            if (!nextActive) {
                setTimeout(() => {
                    try {
                        if (document?.activeElement === entry.button) entry.button.blur?.();
                    } catch {
                        // 无 document 或 blur 不可用时，后续内联状态恢复仍继续执行。
                    }
                }, 0);
            }
            // 某些主题会在点击后一帧重写 display；短延迟复核只重放当前可逆状态。
            for (const delay of [0, 80, 260]) {
                setTimeout(() => {
                    if (root.isConnected && entry.button.isConnected && entry.target.isConnected) {
                        applyRenderedButtonAdjacentHiddenEntry(entry, entry.active);
                    }
                }, delay);
            }
        }, false);
        applyRenderedButtonAdjacentHiddenEntry(entry, false);
    }

    if (state.entries.size) root.dataset.rabbitMirrorButtonAdjacentHiddenFallback = 'true';
}


// 渲染后“CSS 状态兄弟映射”急救：精准读取模型已写出的
// A:active + B、A:focus ~ B、A:nth-child(n):focus ~ B 等规则。
// 在移动端把瞬时 active/focus 变成可逆点击状态，并按原 CSS 声明显示对应后置内容。

export function parseCssStateSiblingAssignments(blockText) {
    const assignments = new Map();
    const declarationRe = /(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+?)(?=;|$)/gi;
    let match;
    while ((match = declarationRe.exec(String(blockText || '')))) {
        const property = normalizeStylePropertyName(match[2]);
        const value = String(match[3] || '').trim().replace(/\s*!important\s*$/i, '');
        if (!CSS_STATE_SIBLING_SAFE_PROPERTIES.has(property) || !value) continue;
        assignments.set(property, value);
    }
    return [...assignments.entries()].map(([property, value]) => ({ property, value }));
}


function normalizeCssStateSiblingSelector(selector) {
    return String(selector || '')
        .trim()
        .replace(/^(?:\.mes_text\s+)+/i, '')
        .replace(/^:scope\s+/, '')
        .trim();
}


function parseCssStateSiblingSelector(selectorText) {
    const selector = String(selectorText || '').trim();
    if (!selector || !/:(?:active|focus-within|focus|hover)\b/i.test(selector)) return null;
    const match = /^([\s\S]*?):(active|focus-within|focus|hover)\b\s*([+~])\s*([\s\S]+)$/i.exec(selector);
    if (!match) return null;
    const triggerSelector = normalizeCssStateSiblingSelector(match[1]);
    const targetSelector = normalizeCssStateSiblingSelector(match[4]);
    if (!triggerSelector || !targetSelector) return null;
    return {
        triggerSelector,
        stateType: String(match[2] || '').toLowerCase(),
        combinator: match[3],
        targetSelector,
    };
}


function parseCssDirectStateSelector(selectorText) {
    const selector = String(selectorText || '').trim();
    const match = /^([\s\S]*?):(active|focus-within|focus|hover)\b\s*$/i.exec(selector);
    if (!match) return null;
    const triggerSelector = normalizeCssStateSiblingSelector(match[1]);
    return triggerSelector ? { triggerSelector, stateType: String(match[2] || '').toLowerCase() } : null;
}


function queryCssStateSiblingTriggers(root, selector) {
    if (!root?.querySelectorAll || !selector) return [];
    try {
        return [...root.querySelectorAll(selector)];
    } catch {
        return [];
    }
}


function elementMatchesCssStateSiblingSelector(element, selector) {
    if (!element?.matches || !selector) return false;
    try {
        return element.matches(selector);
    } catch {
        return false;
    }
}


function collectCssStateSiblingTargets(trigger, combinator, targetSelector) {
    if (!trigger || !targetSelector) return [];
    if (combinator === '+') {
        const target = trigger.nextElementSibling;
        return target && elementMatchesCssStateSiblingSelector(target, targetSelector) ? [target] : [];
    }
    const targets = [];
    for (let node = trigger.nextElementSibling; node; node = node.nextElementSibling) {
        if (elementMatchesCssStateSiblingSelector(node, targetSelector)) targets.push(node);
    }
    return targets;
}


function cssStateNodeDistanceToAncestor(node, ancestor, maxDistance = 6) {
    let current = node;
    for (let distance = 0; current && distance <= maxDistance; distance += 1, current = current.parentElement) {
        if (current === ancestor) return distance;
    }
    return Number.POSITIVE_INFINITY;
}


function findCssStateLocalCommonAncestor(root, trigger, target) {
    if (!root || !trigger || !target) return null;
    let ancestor = trigger.parentElement;
    for (let triggerDistance = 1; ancestor && triggerDistance <= 3; triggerDistance += 1, ancestor = ancestor.parentElement) {
        if (ancestor === root) break;
        if (!ancestor.contains?.(target)) continue;
        const targetDistance = cssStateNodeDistanceToAncestor(target, ancestor, 5);
        if (targetDistance <= 4) return ancestor;
    }
    return null;
}

// 模型有时把 A:hover ~ B 写成跨层、逆向或嵌套关系：触发器与目标实际位于
// 同一局部画布，但不满足 CSS 兄弟选择器。只有原关系完全找不到目标、目标数量受限、
// 且触发器与目标共享近距离局部祖先时，才把它作为高置信跨层候选。

function collectCssStateCrossTreeTargets(root, trigger, targetSelector) {
    if (!root?.querySelectorAll || !trigger || !targetSelector) return [];
    let candidates = [];
    try {
        candidates = [...root.querySelectorAll(targetSelector)];
    } catch {
        return [];
    }
    if (!candidates.length || candidates.length > 8) return [];
    return candidates.filter(target => {
        if (!target || target === trigger || target.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) return false;
        if (trigger.contains?.(target) || target.contains?.(trigger)) return false;
        return !!findCssStateLocalCommonAncestor(root, trigger, target);
    });
}


function cssStateSiblingAssignmentsReveal(assignments) {
    for (const { property, value } of assignments || []) {
        const normalized = String(value || '').trim().toLowerCase();
        if (property === 'opacity' && Number.parseFloat(normalized) > 0.05) return true;
        if (property === 'display' && normalized !== 'none') return true;
        if (property === 'visibility' && !/(?:hidden|collapse)/.test(normalized)) return true;
        if ((property === 'height' || property === 'max-height' || property === 'min-height')
            && !isCollapsedDimensionValue(normalized)) return true;
        if (property === 'pointer-events' && normalized !== 'none') return true;
    }
    return false;
}


function collectRenderedCssStateSiblingRuleData(root) {
    if (!root?.querySelectorAll) return { mappings: [], directRules: [] };
    const mappings = [];
    const directRules = [];
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;

    for (const style of getRabbitMirrorLocalStyleElements(root)) {
        if (style.hasAttribute?.(TOUCH_HOVER_STYLE_ATTR)) continue;
        const cssText = String(style.textContent || '');
        blockRe.lastIndex = 0;
        let match;
        while ((match = blockRe.exec(cssText))) {
            const selectorText = String(match[1] || '').replace(/\/\*[\s\S]*?\*\//g, ' ').trim();
            if (!selectorText || selectorText.startsWith('@')) continue;
            const assignments = parseCssStateSiblingAssignments(match[2]);
            if (!assignments.length) continue;
            for (const rawSelector of splitCssSelectorList(selectorText)) {
                const sibling = parseCssStateSiblingSelector(rawSelector);
                if (sibling) {
                    mappings.push({ ...sibling, assignments });
                    continue;
                }
                const direct = parseCssDirectStateSelector(rawSelector);
                if (direct) directRules.push({ ...direct, assignments });
            }
        }
    }
    return { mappings, directRules };
}


function buildRenderedCssStateSiblingEntries(root) {
    const { mappings, directRules } = collectRenderedCssStateSiblingRuleData(root);
    if (!mappings.length) return [];
    const grouped = new Map();

    for (const mapping of mappings) {
        for (const trigger of queryCssStateSiblingTriggers(root, mapping.triggerSelector)) {
            if (trigger.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) continue;
            let targets = collectCssStateSiblingTargets(trigger, mapping.combinator, mapping.targetSelector);
            let crossTree = false;
            if (!targets.length) {
                targets = collectCssStateCrossTreeTargets(root, trigger, mapping.targetSelector);
                crossTree = targets.length > 0;
            }

            for (const target of targets) {
                if (!target || target === trigger || target.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) continue;
                const text = normalizeInteractionMatchText(target.textContent);
                if (!text && !target.children?.length) continue;

                let entry = grouped.get(trigger);
                if (!entry) {
                    entry = {
                        trigger,
                        targetAssignments: new Map(),
                        triggerAssignments: [],
                        active: false,
                        group: trigger.parentElement || root,
                        crossTree: false,
                        stateTypes: new Set(),
                    };
                    grouped.set(trigger, entry);
                }
                entry.crossTree = entry.crossTree || crossTree;
                entry.stateTypes.add(mapping.stateType);
                let targetMap = entry.targetAssignments.get(target);
                if (!targetMap) {
                    targetMap = new Map();
                    entry.targetAssignments.set(target, targetMap);
                }
                for (const assignment of mapping.assignments) targetMap.set(assignment.property, assignment.value);
            }
        }
    }

    const entries = [];
    for (const entry of grouped.values()) {
        const targetRecords = [...entry.targetAssignments.entries()].map(([target, assignmentMap]) => {
            const assignments = [...assignmentMap.entries()].map(([property, value]) => ({ property, value }));
            const rendered = getRenderedStyleSnapshot(target);
            const hidden = rendered.hidden || rendered.rectHeight <= 1
                || isCollapsedDimensionValue(getInlineStyleValue(target, 'height'))
                || isCollapsedDimensionValue(getInlineStyleValue(target, 'max-height'));
            return {
                target,
                assignments,
                rendered,
                hidden,
                reveals: cssStateSiblingAssignmentsReveal(assignments),
            };
        });

        // 跨层兜底必须至少包含一个“原本隐藏、状态后显现”的真实目标。
        // 满足后才把同一状态里的旧主体隐藏／移位声明一并接管，避免把普通 hover 装饰误变成点击程序。
        const hasHiddenRevealTarget = targetRecords.some(record => record.hidden && record.reveals);
        if (entry.crossTree && !hasHiddenRevealTarget) continue;
        const acceptedTargets = entry.crossTree
            ? targetRecords
            : targetRecords.filter(record => record.hidden || record.reveals);
        if (!acceptedTargets.length) continue;

        for (const rule of directRules) {
            if (elementMatchesCssStateSiblingSelector(entry.trigger, rule.triggerSelector)) {
                const merged = new Map(entry.triggerAssignments.map(item => [item.property, item.value]));
                for (const assignment of rule.assignments) merged.set(assignment.property, assignment.value);
                entry.triggerAssignments = [...merged.entries()].map(([property, value]) => ({ property, value }));
            }
        }

        const triggerProperties = new Set(entry.triggerAssignments.map(item => item.property));
        entry.triggerOriginalStyles = capturePseudoStyleState(entry.trigger, triggerProperties);
        entry.targetStates = acceptedTargets.map(record => {
            const { target, assignments, rendered } = record;
            let computedPosition = '';
            try { computedPosition = String(getComputedStyle(target)?.position || '').toLowerCase(); } catch { computedPosition = ''; }
            const position = getInlineStyleValue(target, 'position').toLowerCase() || computedPosition;
            const properties = new Set([
                ...assignments.map(item => item.property),
                'display', 'visibility', 'opacity', 'pointer-events', 'transform',
                'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
                'position', 'inset', 'top', 'right', 'bottom', 'left', 'width', 'max-width',
            ]);
            const parent = target.parentElement;
            return {
                target,
                assignments,
                rendered,
                positionedOverlay: position === 'absolute' || position === 'fixed',
                originalStyles: capturePseudoStyleState(target, properties),
                parent,
                parentOriginalStyles: parent ? capturePseudoStyleState(parent, ['height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y']) : new Map(),
            };
        });
        if (!entry.targetStates.length) continue;
        entry.trigger.setAttribute(RENDERED_CSS_STATE_SIBLING_RESCUE_ATTR, 'true');
        if (entry.crossTree) entry.trigger.setAttribute(RENDERED_CSS_STATE_CROSS_TREE_RESCUE_ATTR, 'true');
        entry.targetStates.forEach((state, index) => state.target.setAttribute(RENDERED_CSS_STATE_SIBLING_ITEM_ATTR, String(index)));
        entries.push(entry);
    }
    return entries;
}


function applyRenderedCssStateSiblingEntry(entry, active = entry?.active) {
    if (!entry?.trigger) return;
    entry.active = !!active;
    restorePseudoStyleState(entry.trigger, entry.triggerOriginalStyles);
    if (entry.active) applyPseudoStyleAssignments(entry.trigger, entry.triggerAssignments);

    for (const state of entry.targetStates || []) {
        restorePseudoStyleState(state.target, state.originalStyles);
        if (state.parent) restorePseudoStyleState(state.parent, state.parentOriginalStyles);
        if (!entry.active) continue;

        const assignments = [...state.assignments];
        const propertyMap = new Map(assignments.map(item => [item.property, item.value]));
        if (state.rendered.displayHidden && !propertyMap.has('display')) assignments.push({ property: 'display', value: 'block' });
        if (!propertyMap.has('visibility')) assignments.push({ property: 'visibility', value: 'visible' });
        if (!propertyMap.has('opacity')) assignments.push({ property: 'opacity', value: '1' });
        if (!propertyMap.has('pointer-events')) assignments.push({ property: 'pointer-events', value: 'auto' });

        let computedLineHeight = 20;
        let availableWidth = 320;
        try {
            const computed = typeof getComputedStyle === 'function' ? getComputedStyle(state.target) : null;
            computedLineHeight = Number.parseFloat(computed?.lineHeight || '') || 20;
            availableWidth = Number(state.parent?.getBoundingClientRect?.().width || state.target.getBoundingClientRect?.().width || 320);
        } catch {
            computedLineHeight = 20;
            availableWidth = 320;
        }
        const textLength = normalizeInteractionMatchText(state.target.textContent).length;
        const explicitBreaks = state.target.querySelectorAll?.('br')?.length || 0;
        const charsPerLine = Math.max(16, Math.floor(Math.max(160, availableWidth - 24) / 7));
        const estimatedLines = Math.max(1, Math.ceil(textLength / charsPerLine) + explicitBreaks);
        const naturalHeight = Math.max(
            64,
            Number(state.target.scrollHeight || 0) + 20,
            Math.ceil(estimatedLines * computedLineHeight + 28),
        );
        const collapsed = state.rendered.rectHeight <= 1
            || isCollapsedDimensionValue(getCapturedStyleValue(state.originalStyles, 'height'))
            || isCollapsedDimensionValue(getCapturedStyleValue(state.originalStyles, 'max-height'));
        if (collapsed) {
            if (!propertyMap.has('height')) assignments.push({ property: 'height', value: 'auto' });
            if (!propertyMap.has('max-height')) assignments.push({ property: 'max-height', value: `${Math.max(640, naturalHeight * 2)}px` });
            assignments.push({ property: 'overflow', value: 'visible' });
        }

        if (state.positionedOverlay && state.parent) {
            assignments.push(
                { property: 'height', value: 'auto' },
                { property: 'min-height', value: `${Math.min(2400, naturalHeight)}px` },
                { property: 'max-height', value: 'none' },
                { property: 'overflow', value: 'visible' },
            );
            applyPseudoStyleAssignments(state.parent, [
                { property: 'min-height', value: `${Math.min(2400, naturalHeight)}px` },
            ]);
        }
        applyPseudoStyleAssignments(state.target, assignments);
    }

    if (entry.trigger.matches?.('input[type="checkbox"], input[type="radio"]')) {
        try { entry.trigger.checked = entry.active; } catch {}
    }
    entry.trigger.setAttribute('aria-expanded', entry.active ? 'true' : 'false');
    entry.trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
}


export function hasRenderedCssStateSiblingCandidates(root) {
    if (!root?.querySelectorAll) return false;
    return buildRenderedCssStateSiblingEntries(root).length > 0;
}


export function installRenderedCssStateSiblingRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedCssStateSiblingRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        renderedCssStateSiblingRescueStates.set(root, state);
    }

    for (const entry of buildRenderedCssStateSiblingEntries(root)) {
        if (state.entries.has(entry.trigger)) continue;
        state.entries.set(entry.trigger, entry);
        preparePseudoTrigger(entry.trigger);

        const toggle = event => {
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            } else {
                event?.preventDefault?.();
            }
            const nextActive = !entry.active;
            if (nextActive) {
                for (const other of state.entries.values()) {
                    if (other !== entry && other.group === entry.group && other.active) {
                        applyRenderedCssStateSiblingEntry(other, false);
                        try { other.trigger.blur?.(); } catch {}
                    }
                }
            }
            applyRenderedCssStateSiblingEntry(entry, nextActive);
            if (!nextActive) {
                setTimeout(() => {
                    try { if (document?.activeElement === entry.trigger) entry.trigger.blur?.(); } catch {}
                }, 0);
            }
            for (const delay of [0, 80, 260]) {
                setTimeout(() => {
                    if (root.isConnected && entry.trigger.isConnected) applyRenderedCssStateSiblingEntry(entry, entry.active);
                }, delay);
            }
        };

        entry.trigger.addEventListener('click', toggle, false);
        entry.trigger.addEventListener('keydown', toggle, false);

        // 隐藏 input 的 :active/:focus 伪交互在触屏端不会形成可保持状态；
        // 若存在明确 label[for]，让真实可触摸的 label 代理同一可逆状态，并同步 input.checked。
        const triggerId = String(entry.trigger.id || '').trim();
        const transientInput = triggerId
            && entry.trigger.matches?.('input[type="checkbox"], input[type="radio"]')
            && [...(entry.stateTypes || [])].some(type => /^(?:active|focus|focus-within|hover)$/.test(type));
        if (transientInput) {
            let proxyLabels = [];
            try {
                const escapedId = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(triggerId) : triggerId.replace(/(["\\])/g, '\\$1');
                proxyLabels = [...root.querySelectorAll(`label[for="${escapedId}"]`)];
            } catch {
                proxyLabels = [...root.querySelectorAll('label')].filter(label => label.getAttribute('for') === triggerId);
            }
            for (const label of proxyLabels) {
                if (label.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) continue;
                label.setAttribute('data-rabbit-mirror-transient-state-proxy', 'true');
                label.setAttribute('role', label.getAttribute('role') || 'button');
                if (!label.hasAttribute('tabindex')) label.setAttribute('tabindex', '0');
                label.addEventListener('click', toggle, false);
                label.addEventListener('keydown', toggle, false);
            }
        }
        applyRenderedCssStateSiblingEntry(entry, false);
    }

    if (state.entries.size) root.dataset.rabbitMirrorCssStateSiblingFallback = 'true';
    const crossTreeCount = [...state.entries.values()].filter(entry => entry.crossTree).length;
    if (crossTreeCount) root.setAttribute(RENDERED_CSS_STATE_CROSS_TREE_ROOT_ATTR, String(crossTreeCount));
    else root.removeAttribute(RENDERED_CSS_STATE_CROSS_TREE_ROOT_ATTR);
}


// 渲染后“可点击容器 + 后置隐藏内容”急救：用于 onclick 被删除后，
// 只剩 cursor:pointer 的普通 div/span 与紧邻 display:none 正文的结构。
// 与“可点击画面 + 弹层”不同，本路线不要求关闭按钮，点击一次显示，第二次恢复。

function isRenderedClickableAdjacentHiddenTrigger(element) {
    if (!element) return false;
    if (element.hasAttribute?.(RENDERED_CLICKABLE_ADJACENT_HIDDEN_RESCUE_ATTR)) return true;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|figure|aside|span|p)$/.test(tagName)) return false;
    if (isExplicitlyHiddenStateLayer(element)) return false;
    if (getInlineStyleValue(element, 'cursor').toLowerCase() !== 'pointer') return false;
    if (element.querySelector?.('button, input, label, summary, details, select, textarea, a[href]')) return false;

    const text = normalizeInteractionMatchText(element.textContent);
    if (text.length < 2 || text.length > 420) return false;
    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    return CLICKABLE_ADJACENT_HIDDEN_TRIGGER_HINT_RE.test(text)
        || CLICKABLE_ADJACENT_HIDDEN_TRIGGER_CLASS_RE.test(semantic);
}


function isRenderedClickableAdjacentHiddenTarget(element, trigger) {
    if (!element || !trigger || element === trigger) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|aside|p|ul|ol|dl|blockquote|pre)$/.test(tagName)) return false;

    const previouslyManaged = element.hasAttribute?.(RENDERED_CLICKABLE_ADJACENT_HIDDEN_ITEM_ATTR);
    const hidden = isExplicitlyHiddenStateLayer(element)
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'height'))
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'max-height'));
    if (!previouslyManaged && !hidden) return false;

    // 带独立关闭按钮或绝对/固定定位的结构继续交给“可点击画面弹层”路线，避免双重接管。
    const position = getInlineStyleValue(element, 'position').toLowerCase();
    if (!previouslyManaged && (/^(?:absolute|fixed)$/.test(position) || findRenderedClickableAdjacentPopupCloseButtons(element).length)) return false;

    const text = normalizeInteractionMatchText(element.textContent);
    if (text.length < 4 || text.length > 5000) return false;
    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    return previouslyManaged
        || CLICKABLE_ADJACENT_HIDDEN_TARGET_CLASS_RE.test(semantic)
        || text.length >= 12;
}


export function findRenderedClickableAdjacentHiddenTarget(trigger) {
    let node = trigger?.nextElementSibling || null;
    for (let step = 0; node && step < 3; step += 1, node = node.nextElementSibling) {
        if (/^(?:style|script|template)$/i.test(node.tagName || '')) continue;
        if (isRenderedClickableAdjacentHiddenTarget(node, trigger)) return node;

        // 允许跨过一个纯装饰短节点；遇到真实内容或另一交互区立即停止。
        if (node.querySelector?.('button, input, label, details, summary, select, textarea, a[href]')) break;
        const text = normalizeInteractionMatchText(node.textContent);
        if (text.length > 12) break;
    }
    return null;
}


export function hasRenderedClickableAdjacentHiddenCandidates(root) {
    if (!root?.querySelectorAll) return false;
    return [...root.querySelectorAll('div, section, article, figure, aside, span, p')]
        .some(trigger => isRenderedClickableAdjacentHiddenTrigger(trigger)
            && !!findRenderedClickableAdjacentHiddenTarget(trigger));
}


function buildRenderedClickableAdjacentHiddenEntry(trigger, target) {
    if (!trigger || !target) return null;
    const targetOriginalStyles = capturePseudoStyleState(target, [
        'display', 'visibility', 'opacity', 'pointer-events', 'transform',
        'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
        'position', 'inset', 'top', 'right', 'bottom', 'left', 'width', 'max-width',
        'margin', 'margin-top',
    ]);
    trigger.setAttribute(RENDERED_CLICKABLE_ADJACENT_HIDDEN_RESCUE_ATTR, 'true');
    target.setAttribute(RENDERED_CLICKABLE_ADJACENT_HIDDEN_ITEM_ATTR, 'true');
    return {
        trigger,
        target,
        active: false,
        targetOriginalStyles,
        activeTransform: neutralizeStateLayerTransform(getCapturedStyleValue(targetOriginalStyles, 'transform')),
        wasDisplayNone: getCapturedStyleValue(targetOriginalStyles, 'display').toLowerCase() === 'none',
        hadCollapsedHeight: isCollapsedDimensionValue(getCapturedStyleValue(targetOriginalStyles, 'height')),
        hadCollapsedMaxHeight: isCollapsedDimensionValue(getCapturedStyleValue(targetOriginalStyles, 'max-height')),
    };
}


function applyRenderedClickableAdjacentHiddenEntry(entry, active = entry?.active) {
    if (!entry?.trigger || !entry?.target) return;
    entry.active = !!active;
    restorePseudoStyleState(entry.target, entry.targetOriginalStyles);

    if (entry.active) {
        const naturalHeight = Math.max(48, Number(entry.target.scrollHeight || 0) + 20);
        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ];
        if (entry.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (entry.activeTransform) assignments.push({ property: 'transform', value: entry.activeTransform });
        if (entry.hadCollapsedHeight) assignments.push({ property: 'height', value: 'auto' });
        if (entry.hadCollapsedMaxHeight || getRenderedElementHeight(entry.target) <= 1) {
            assignments.push({ property: 'max-height', value: `${Math.max(320, naturalHeight * 2)}px` });
            assignments.push({ property: 'min-height', value: `${Math.min(1200, naturalHeight)}px` });
        }
        applyPseudoStyleAssignments(entry.target, assignments);
    }

    entry.trigger.setAttribute('aria-expanded', entry.active ? 'true' : 'false');
    entry.trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
    entry.target.setAttribute('aria-hidden', entry.active ? 'false' : 'true');
}


export function installRenderedClickableAdjacentHiddenRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedClickableAdjacentHiddenRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        renderedClickableAdjacentHiddenRescueStates.set(root, state);
    }

    for (const trigger of root.querySelectorAll('div, section, article, figure, aside, span, p')) {
        if (trigger.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`) || state.entries.has(trigger)) continue;
        if (!isRenderedClickableAdjacentHiddenTrigger(trigger)) continue;
        const target = findRenderedClickableAdjacentHiddenTarget(trigger);
        if (!target) continue;
        const entry = buildRenderedClickableAdjacentHiddenEntry(trigger, target);
        if (!entry) continue;
        state.entries.set(trigger, entry);
        preparePseudoTrigger(trigger);

        const toggle = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, trigger)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            event?.preventDefault?.();
            applyRenderedClickableAdjacentHiddenEntry(entry, !entry.active);
            for (const delay of [0, 80, 260]) {
                setTimeout(() => {
                    if (root.isConnected && entry.trigger.isConnected && entry.target.isConnected) {
                        applyRenderedClickableAdjacentHiddenEntry(entry, entry.active);
                    }
                }, delay);
            }
        };

        trigger.addEventListener('click', toggle, false);
        trigger.addEventListener('keydown', toggle, false);
        applyRenderedClickableAdjacentHiddenEntry(entry, false);
    }

    if (state.entries.size) root.dataset.rabbitMirrorClickableAdjacentHiddenFallback = 'true';
}


// 渲染后“可点击画面 + 相邻弹层”急救：用于宿主删除 onclick 后，
// 只剩带 cursor:pointer 的画面、紧邻隐藏弹层以及弹层内关闭按钮的结构。
// 点击画面打开，点击关闭入口恢复；不依赖原始事件代码，并保持完整可逆。

function isRenderedClickableAdjacentPopupTrigger(element) {
    if (!element || element.hasAttribute?.(RENDERED_CLICKABLE_ADJACENT_POPUP_RESCUE_ATTR)) return !!element;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|figure|aside|span)$/.test(tagName)) return false;
    if (isExplicitlyHiddenStateLayer(element)) return false;
    if (getInlineStyleValue(element, 'cursor').toLowerCase() !== 'pointer') return false;
    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length >= 2 && text.length <= 420;
}


function findRenderedClickableAdjacentPopupCloseButtons(target) {
    if (!target?.querySelectorAll) return [];
    const buttons = [...target.querySelectorAll('button, [role="button"]')];
    const hinted = buttons.filter(button => CLICKABLE_ADJACENT_POPUP_CLOSE_HINT_RE.test(
        String(button.textContent || button.getAttribute?.('aria-label') || '').replace(/\s+/g, ' ').trim(),
    ));
    return hinted.length ? hinted : (buttons.length === 1 ? buttons : []);
}


function isRenderedClickableAdjacentPopupTarget(element, trigger) {
    if (!element || !trigger || element === trigger) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|aside|dialog)$/.test(tagName)) return false;

    const previouslyManaged = element.hasAttribute?.(RENDERED_CLICKABLE_ADJACENT_POPUP_ITEM_ATTR);
    if (!previouslyManaged && !isExplicitlyHiddenStateLayer(element)) return false;

    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 8 || text.length > 5000) return false;

    const position = getInlineStyleValue(element, 'position').toLowerCase();
    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    const closeButtons = findRenderedClickableAdjacentPopupCloseButtons(element);
    const triggerText = String(trigger.textContent || '').replace(/\s+/g, ' ').trim();
    const triggerHint = CLICKABLE_ADJACENT_POPUP_TRIGGER_HINT_RE.test(triggerText);
    const popupHint = /^(?:absolute|fixed)$/.test(position)
        || CLICKABLE_ADJACENT_POPUP_TARGET_HINT_RE.test(semantic)
        || closeButtons.length > 0;

    return previouslyManaged || (triggerHint && popupHint && closeButtons.length > 0);
}


export function findRenderedClickableAdjacentPopupTarget(trigger) {
    let node = trigger?.nextElementSibling || null;
    for (let step = 0; node && step < 2; step += 1, node = node.nextElementSibling) {
        if (/^(?:style|script|template)$/i.test(node.tagName || '')) continue;
        if (isRenderedClickableAdjacentPopupTarget(node, trigger)) return node;
        break;
    }
    return null;
}


export function hasRenderedClickableAdjacentPopupCandidates(root) {
    if (!root?.querySelectorAll) return false;
    return [...root.querySelectorAll('div, section, article, figure, aside, span')]
        .some(trigger => isRenderedClickableAdjacentPopupTrigger(trigger)
            && !!findRenderedClickableAdjacentPopupTarget(trigger));
}


function buildRenderedClickableAdjacentPopupEntry(trigger, target) {
    if (!trigger || !target) return null;
    const targetOriginalStyles = capturePseudoStyleState(target, [
        'display', 'visibility', 'opacity', 'pointer-events', 'transform',
        'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
        'position', 'inset', 'top', 'right', 'bottom', 'left', 'width', 'max-width',
        'margin', 'margin-top', 'z-index',
    ]);
    const triggerOriginalStyles = capturePseudoStyleState(trigger, ['filter', 'opacity', 'transform']);
    const closeButtons = findRenderedClickableAdjacentPopupCloseButtons(target);
    if (!closeButtons.length) return null;

    trigger.setAttribute(RENDERED_CLICKABLE_ADJACENT_POPUP_RESCUE_ATTR, 'true');
    target.setAttribute(RENDERED_CLICKABLE_ADJACENT_POPUP_ITEM_ATTR, 'true');
    closeButtons.forEach(button => button.setAttribute(RENDERED_CLICKABLE_ADJACENT_POPUP_CLOSE_ATTR, 'true'));

    return {
        trigger,
        target,
        closeButtons,
        active: false,
        targetOriginalStyles,
        triggerOriginalStyles,
        activeTransform: neutralizeStateLayerTransform(getCapturedStyleValue(targetOriginalStyles, 'transform')),
        wasDisplayNone: getCapturedStyleValue(targetOriginalStyles, 'display').toLowerCase() === 'none',
        hadCollapsedHeight: isCollapsedDimensionValue(getCapturedStyleValue(targetOriginalStyles, 'height')),
        hadCollapsedMaxHeight: isCollapsedDimensionValue(getCapturedStyleValue(targetOriginalStyles, 'max-height')),
    };
}


function applyRenderedClickableAdjacentPopupEntry(entry, active = entry?.active) {
    if (!entry?.trigger || !entry?.target) return;
    entry.active = !!active;
    restorePseudoStyleState(entry.target, entry.targetOriginalStyles);
    restorePseudoStyleState(entry.trigger, entry.triggerOriginalStyles);

    if (entry.active) {
        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ];
        if (entry.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (entry.activeTransform) assignments.push({ property: 'transform', value: entry.activeTransform });
        if (entry.hadCollapsedHeight) assignments.push({ property: 'height', value: 'auto' });
        if (entry.hadCollapsedMaxHeight) assignments.push({ property: 'max-height', value: '1200px' });
        applyPseudoStyleAssignments(entry.target, assignments);
    }

    entry.trigger.setAttribute('aria-expanded', entry.active ? 'true' : 'false');
    entry.trigger.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
    entry.target.setAttribute('aria-hidden', entry.active ? 'false' : 'true');
}


export function installRenderedClickableAdjacentPopupRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedClickableAdjacentPopupRescueStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        renderedClickableAdjacentPopupRescueStates.set(root, state);
    }

    for (const trigger of root.querySelectorAll('div, section, article, figure, aside, span')) {
        if (trigger.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`) || state.entries.has(trigger)) continue;
        if (!isRenderedClickableAdjacentPopupTrigger(trigger)) continue;
        const target = findRenderedClickableAdjacentPopupTarget(trigger);
        if (!target) continue;
        const entry = buildRenderedClickableAdjacentPopupEntry(trigger, target);
        if (!entry) continue;
        state.entries.set(trigger, entry);
        preparePseudoTrigger(trigger);

        const toggle = event => {
            if (event && shouldIgnorePseudoToggleEvent(event, trigger)) return;
            event?.preventDefault?.();
            applyRenderedClickableAdjacentPopupEntry(entry, !entry.active);
            for (const delay of [0, 80, 260]) {
                setTimeout(() => {
                    if (root.isConnected && entry.trigger.isConnected && entry.target.isConnected) {
                        applyRenderedClickableAdjacentPopupEntry(entry, entry.active);
                    }
                }, delay);
            }
        };

        trigger.addEventListener('click', toggle, false);
        trigger.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            toggle(event);
        }, false);

        for (const closeButton of entry.closeButtons) {
            closeButton.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                applyRenderedClickableAdjacentPopupEntry(entry, false);
            }, false);
        }
        applyRenderedClickableAdjacentPopupEntry(entry, false);
    }

    if (state.entries.size) root.dataset.rabbitMirrorClickableAdjacentPopupFallback = 'true';
}



// 渲染后“可点击容器内部揭示”急救：用于 onclick 被删除后，
// 容器内部仍保留点击提示与 display:none / opacity:0 正文的结构。
// 每个容器独立、可逆，不依赖 class 原名或原始事件代码。

function isRenderedContainerInternalRevealTarget(element, host) {
    if (!element || !host || element.parentElement !== host) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|aside|p|blockquote|pre)$/.test(tagName)) return false;
    const previouslyManaged = element.hasAttribute?.(RENDERED_CONTAINER_INTERNAL_REVEAL_ITEM_ATTR);
    const hidden = isExplicitlyHiddenStateLayer(element)
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'height'))
        || isCollapsedDimensionValue(getInlineStyleValue(element, 'max-height'));
    if (!previouslyManaged && !hidden) return false;
    const text = normalizeInteractionMatchText(element.textContent);
    return text.length >= 4 && text.length <= 6000;
}


function collectRenderedContainerInternalRevealHints(host, targets) {
    const targetSet = new Set(targets || []);
    return [...(host?.children || [])].filter(element => {
        if (targetSet.has(element) || isExplicitlyHiddenStateLayer(element)) return false;
        const text = normalizeInteractionMatchText(element.textContent);
        const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
        return text.length > 0 && text.length <= 260
            && (CONTAINER_INTERNAL_REVEAL_HINT_RE.test(text) || /(?:hint|instruction|prompt|提示|操作)/i.test(semantic));
    }).slice(0, 4);
}


function buildRenderedContainerInternalRevealEntry(host) {
    if (!host?.children || host.hasAttribute?.(RENDERED_MASK_REVEAL_RESCUE_ATTR)) return null;
    if (host.querySelector?.('input, label, button, summary, details, select, textarea')) return null;

    const targets = [...host.children].filter(element => isRenderedContainerInternalRevealTarget(element, host)).slice(0, 4);
    if (!targets.length) return null;
    const hints = collectRenderedContainerInternalRevealHints(host, targets);
    const semantic = `${host.id || ''} ${getClassTokens(host).join(' ')} ${normalizeInteractionMatchText(host.textContent).slice(0, 300)}`;
    const hasPointerCursor = getInlineStyleValue(host, 'cursor').toLowerCase() === 'pointer';

    // 旧路线要求外层容器预先写 cursor:pointer。模型若把 onmouseover 错挂在
    // opacity:0/max-height:0 的答案自身，宿主净化事件属性后，外层问题行通常没有 cursor。
    // 此时只在同一直属容器内同时存在“悬停/点击查看”等明确提示与隐藏正文时接管，
    // 不把普通装饰层或无提示的静态内容误判为交互。
    if (!hasPointerCursor && !hints.length) return null;
    if (!hints.length && !CONTAINER_INTERNAL_REVEAL_CLASS_RE.test(semantic)) return null;

    const targetStates = targets.map(target => ({
        target,
        originalStyles: capturePseudoStyleState(target, [
            'display', 'visibility', 'opacity', 'pointer-events', 'transform',
            'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y',
        ]),
        activeTransform: neutralizeStateLayerTransform(getInlineStyleValue(target, 'transform')),
        wasDisplayNone: getInlineStyleValue(target, 'display').toLowerCase() === 'none',
        wasVisibilityHidden: getInlineStyleValue(target, 'visibility').toLowerCase() === 'hidden',
        hadCollapsedHeight: isCollapsedDimensionValue(getInlineStyleValue(target, 'height')),
        hadCollapsedMaxHeight: isCollapsedDimensionValue(getInlineStyleValue(target, 'max-height')),
    }));
    const hintStates = hints.map(target => ({
        target,
        originalStyles: capturePseudoStyleState(target, ['display', 'visibility', 'opacity', 'pointer-events']),
    }));

    host.setAttribute(RENDERED_CONTAINER_INTERNAL_REVEAL_ATTR, 'true');
    targets.forEach((target, index) => target.setAttribute(RENDERED_CONTAINER_INTERNAL_REVEAL_ITEM_ATTR, String(index)));
    const hoverHint = hints.some(target => CONTAINER_INTERNAL_REVEAL_HOVER_HINT_RE.test(normalizeInteractionMatchText(target.textContent)));
    return { host, targetStates, hintStates, active: false, pinned: false, hoverHint };
}


function applyRenderedContainerInternalRevealEntry(entry, active = entry?.active) {
    if (!entry?.host) return;
    entry.active = !!active;
    for (const state of entry.targetStates || []) {
        restorePseudoStyleState(state.target, state.originalStyles);
        if (!entry.active) continue;
        const assignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
            { property: 'overflow', value: 'visible' },
        ];
        if (state.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
        if (state.wasVisibilityHidden) assignments.push({ property: 'visibility', value: 'visible' });
        if (state.activeTransform) assignments.push({ property: 'transform', value: state.activeTransform });
        if (state.hadCollapsedHeight) assignments.push({ property: 'height', value: 'auto' });
        if (state.hadCollapsedMaxHeight) assignments.push({ property: 'max-height', value: '1600px' });
        applyPseudoStyleAssignments(state.target, assignments);
    }
    for (const state of entry.hintStates || []) {
        restorePseudoStyleState(state.target, state.originalStyles);
        if (entry.active) applyPseudoStyleAssignments(state.target, [
            { property: 'display', value: 'none' },
            { property: 'opacity', value: '0' },
            { property: 'pointer-events', value: 'none' },
        ]);
    }
    entry.host.setAttribute('aria-expanded', entry.active ? 'true' : 'false');
    entry.host.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
}


function findRenderedContainerInternalRevealEntries(root) {
    if (!root?.querySelectorAll) return [];
    const entries = [];
    for (const host of root.querySelectorAll('div, section, article, aside, figure')) {
        if (host.closest?.(`[${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) continue;
        const entry = buildRenderedContainerInternalRevealEntry(host);
        if (entry) entries.push(entry);
    }
    return entries;
}


export function hasRenderedContainerInternalRevealCandidates(root) {
    if (!root?.querySelectorAll) return false;
    return [...root.querySelectorAll('div, section, article, aside, figure')].some(host => {
        if (host.querySelector?.('input, label, button, summary, details, select, textarea')) return false;
        const targets = [...(host.children || [])].filter(element => isRenderedContainerInternalRevealTarget(element, host));
        if (!targets.length) return false;
        const hints = collectRenderedContainerInternalRevealHints(host, targets);
        const hasPointerCursor = getInlineStyleValue(host, 'cursor').toLowerCase() === 'pointer';
        if (!hasPointerCursor && !hints.length) return false;
        return hints.length > 0
            || CONTAINER_INTERNAL_REVEAL_CLASS_RE.test(`${host.id || ''} ${getClassTokens(host).join(' ')}`);
    });
}


export function installRenderedContainerInternalRevealRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedContainerInternalRevealStates.get(root);
    if (!state) {
        state = { entries: new Map() };
        renderedContainerInternalRevealStates.set(root, state);
    }

    for (const entry of findRenderedContainerInternalRevealEntries(root)) {
        if (state.entries.has(entry.host)) continue;
        state.entries.set(entry.host, entry);
        preparePseudoTrigger(entry.host);
        const togglePinned = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, entry.host)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            event?.preventDefault?.();
            entry.pinned = !entry.pinned;
            applyRenderedContainerInternalRevealEntry(entry, entry.pinned);
        };
        entry.host.addEventListener('click', togglePinned, false);
        entry.host.addEventListener('keydown', togglePinned, false);

        // 写着“悬停查看”的结构在桌面端继续保留悬停体验；手机端则由点击锁定。
        // pinned 与 hover 分离，避免 mouseenter 已展开后随后的 click 反向把内容关掉。
        if (entry.hoverHint) {
            entry.host.addEventListener('pointerenter', event => {
                if (event.pointerType === 'touch' || entry.pinned) return;
                applyRenderedContainerInternalRevealEntry(entry, true);
            }, false);
            entry.host.addEventListener('pointerleave', event => {
                if (event.pointerType === 'touch' || entry.pinned) return;
                applyRenderedContainerInternalRevealEntry(entry, false);
            }, false);
        }
        applyRenderedContainerInternalRevealEntry(entry, false);
    }
    if (state.entries.size) root.dataset.rabbitMirrorContainerInternalRevealFallback = 'true';
}

// 渲染后“遮罩—隐藏层揭示”急救：用于宿主已删除 onmouseover/onmouseout，且没有表单控件的画面揭层。
// 只识别同一容器内语义明确的遮罩层与隐藏正文层，点击/轻触一次显示，再次点击恢复。

function isRenderedMaskRevealHiddenTarget(element) {
    if (!element) return false;
    const previouslyManaged = element.hasAttribute?.(RENDERED_MASK_REVEAL_TARGET_ATTR);
    if (!previouslyManaged && !isExplicitlyHiddenStateLayer(element)) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|aside|p|span)$/.test(tagName)) return false;
    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 8 || text.length > 1800) return false;
    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    return MASK_REVEAL_HIDDEN_HINT_RE.test(semantic) || text.length >= 30;
}


function isRenderedMaskRevealMask(element) {
    if (!element || isExplicitlyHiddenStateLayer(element)) return false;
    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')}`;
    const clipPath = getInlineStyleValue(element, 'clip-path');
    const backdrop = getInlineStyleValue(element, 'backdrop-filter');
    const looksLikeMask = MASK_REVEAL_MASK_HINT_RE.test(semantic) || !!clipPath || !!backdrop;
    return looksLikeMask && isOverlayLikeStateLayer(element);
}


function findRenderedMaskRevealEntries(root) {
    if (!root?.querySelectorAll) return [];
    const entries = [];
    const seenHosts = new Set();

    for (const hidden of root.querySelectorAll('div, section, article, aside, p, span')) {
        if (!isRenderedMaskRevealHiddenTarget(hidden)) continue;
        const host = hidden.parentElement;
        if (!host || seenHosts.has(host) || host.hasAttribute?.(RAW_SELF_MUTATION_RESCUE_ATTR) || host.querySelector?.('input, label, button, select, textarea')) continue;
        const siblings = [...(host.children || [])];
        const masks = siblings.filter(item => item !== hidden && isRenderedMaskRevealMask(item));
        if (!masks.length) continue;

        const hostText = String(host.textContent || '').replace(/\s+/g, ' ').trim();
        const cursor = getInlineStyleValue(host, 'cursor').toLowerCase();
        if (cursor !== 'pointer' && !MASK_REVEAL_TRIGGER_HINT_RE.test(hostText)) continue;

        const mask = masks[0];
        const hiddenOriginalStyles = capturePseudoStyleState(hidden, ['display', 'visibility', 'opacity', 'pointer-events', 'transform']);
        const maskOriginalStyles = capturePseudoStyleState(mask, ['opacity', 'clip-path', 'pointer-events', 'filter']);
        const hiddenState = {
            target: hidden,
            originalStyles: hiddenOriginalStyles,
            activeTransform: neutralizeStateLayerTransform(getCapturedStyleValue(hiddenOriginalStyles, 'transform')),
            wasDisplayNone: getCapturedStyleValue(hiddenOriginalStyles, 'display').toLowerCase() === 'none',
        };
        const maskState = {
            target: mask,
            originalStyles: maskOriginalStyles,
            originalClipPath: getCapturedStyleValue(maskOriginalStyles, 'clip-path'),
        };
        entries.push({
            host,
            hiddenState,
            maskState,
            active: host.getAttribute?.('aria-pressed') === 'true',
        });
        seenHosts.add(host);
    }
    return entries;
}


export function hasRenderedMaskRevealCandidates(root) {
    return findRenderedMaskRevealEntries(root).length > 0;
}


function applyRenderedMaskRevealEntry(entry, active) {
    if (!entry?.host) return;
    entry.active = !!active;
    restorePseudoStyleState(entry.hiddenState.target, entry.hiddenState.originalStyles);
    restorePseudoStyleState(entry.maskState.target, entry.maskState.originalStyles);

    if (entry.active) {
        const revealAssignments = [
            { property: 'opacity', value: '1' },
            { property: 'visibility', value: 'visible' },
            { property: 'pointer-events', value: 'auto' },
        ];
        if (entry.hiddenState.wasDisplayNone) revealAssignments.push({ property: 'display', value: 'flex' });
        if (entry.hiddenState.activeTransform) revealAssignments.push({ property: 'transform', value: entry.hiddenState.activeTransform });
        applyPseudoStyleAssignments(entry.hiddenState.target, revealAssignments);

        const maskAssignments = [
            { property: 'opacity', value: '0.18' },
            { property: 'pointer-events', value: 'none' },
        ];
        if (/circle\(/i.test(entry.maskState.originalClipPath)) {
            maskAssignments.push({ property: 'clip-path', value: 'circle(85% at 50% 50%)' });
        }
        applyPseudoStyleAssignments(entry.maskState.target, maskAssignments);
    }

    entry.host.setAttribute('aria-pressed', entry.active ? 'true' : 'false');
}


export function installRenderedMaskRevealRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedMaskRevealRescueStates.get(root);
    if (!state) {
        state = { hosts: new Map() };
        renderedMaskRevealRescueStates.set(root, state);
    }

    for (const entry of findRenderedMaskRevealEntries(root)) {
        if (state.hosts.has(entry.host)) continue;
        state.hosts.set(entry.host, entry);
        entry.host.setAttribute(RENDERED_MASK_REVEAL_RESCUE_ATTR, 'true');
        entry.hiddenState.target.setAttribute(RENDERED_MASK_REVEAL_TARGET_ATTR, 'true');
        preparePseudoTrigger(entry.host);

        const activate = event => {
            if (event?.type === 'click' && shouldIgnorePseudoToggleEvent(event, entry.host)) return;
            if (event?.type === 'keydown') {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
            }
            applyRenderedMaskRevealEntry(entry, !entry.active);
        };
        entry.host.addEventListener('click', activate, false);
        entry.host.addEventListener('keydown', activate, false);
        applyRenderedMaskRevealEntry(entry, entry.active);
    }
}

// 渲染后“列表项目 → 详情视图”急救：不依赖已被宿主删除的 onclick。
// 仅处理严格结构：同一布局中，前置区域存在 N 个明确可点击候选项，后置详情容器直属包含 N 个隐藏详情层。

function isMeaningfulListDetailPanel(element) {
    if (!element?.id || !isExplicitlyHiddenStateLayer(element)) return false;
    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 24) return false;
    const tagName = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|aside|li)$/.test(tagName)) return false;
    return !!element.querySelector?.('h1, h2, h3, h4, h5, h6, p, ul, ol, dl, table, [style*="border"], [style*="background"]')
        || text.length >= 80;
}


function isLikelyListDetailTrigger(element) {
    if (!element?.style || !element?.textContent) return false;
    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text || text.length > 120) return false;

    const tagName = String(element.tagName || '').toLowerCase();
    if (/^(?:input|textarea|select|option|details|summary)$/.test(tagName)) return false;

    const cursor = getInlineStyleValue(element, 'cursor').toLowerCase();
    const decoration = `${getInlineStyleValue(element, 'text-decoration')} ${getInlineStyleValue(element, 'text-decoration-line')}`.toLowerCase();
    const role = String(element.getAttribute?.('role') || '').toLowerCase();
    const explicitlyClickable = cursor === 'pointer'
        || decoration.includes('underline')
        || role === 'button'
        || element.hasAttribute?.('onclick');
    if (!explicitlyClickable) return false;

    // 选择最内层的明确触发项，避免同时把 li 与内部 span 都计入。
    const nestedClickable = [...(element.querySelectorAll?.('[style*="cursor"], [style*="text-decoration"], [role="button"], [onclick]') || [])]
        .some(child => child !== element && isLikelyListDetailTrigger(child));
    return !nestedClickable;
}


function collectListDetailTriggersBeforeHost(host, expectedCount) {
    const parent = host?.parentElement;
    if (!parent || expectedCount < 2 || expectedCount > 8) return [];
    const siblings = [...parent.children];
    const hostIndex = siblings.indexOf(host);
    if (hostIndex <= 0) return [];

    const searchRoots = siblings.slice(0, hostIndex);
    const candidates = [];
    for (const searchRoot of searchRoots) {
        if (isLikelyListDetailTrigger(searchRoot)) candidates.push(searchRoot);
        for (const element of searchRoot.querySelectorAll?.('*') || []) {
            if (isLikelyListDetailTrigger(element)) candidates.push(element);
        }
    }

    const unique = [...new Set(candidates)]
        .filter(candidate => !candidates.some(other => other !== candidate && candidate.contains?.(other)));
    return unique.length === expectedCount ? unique : [];
}


function getListDetailDefaultViews(host, panels) {
    const panelSet = new Set(panels);
    return [...host.children].filter(element => {
        if (panelSet.has(element) || isExplicitlyHiddenStateLayer(element)) return false;
        const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
        const id = String(element.id || '').toLowerCase();
        if (!text || text.length > 180) return false;
        return /(?:default|empty|placeholder|waiting|select|choose)/i.test(id)
            || LIST_DETAIL_DEFAULT_HINT_RE.test(text);
    }).slice(0, 3);
}


function buildRenderedListDetailEntry(host) {
    if (!host?.children) return null;
    const panels = [...host.children].filter(isMeaningfulListDetailPanel);
    if (panels.length < 2 || panels.length > 8) return null;

    const triggers = collectListDetailTriggersBeforeHost(host, panels.length);
    if (triggers.length !== panels.length) return null;

    const defaultViews = getListDetailDefaultViews(host, panels);
    const panelStates = panels.map(panel => ({
        panel,
        originalStyles: capturePseudoStyleState(panel, ['display', 'visibility', 'opacity', 'pointer-events']),
        wasDisplayNone: getInlineStyleValue(panel, 'display').toLowerCase() === 'none',
        wasVisibilityHidden: getInlineStyleValue(panel, 'visibility').toLowerCase() === 'hidden',
    }));
    const defaultStates = defaultViews.map(view => ({
        view,
        originalStyles: capturePseudoStyleState(view, ['display', 'visibility', 'opacity', 'pointer-events']),
    }));

    panels.forEach((panel, index) => {
        panel.setAttribute(RENDERED_LIST_DETAIL_PANEL_ATTR, String(index));
        panel.setAttribute('aria-hidden', 'true');
    });
    triggers.forEach((trigger, index) => {
        trigger.setAttribute(RENDERED_LIST_DETAIL_TRIGGER_ATTR, String(index));
        trigger.setAttribute('aria-controls', panels[index].id);
        trigger.setAttribute('aria-pressed', 'false');
    });

    return { host, triggers, panelStates, defaultStates, activeIndex: -1 };
}


function applyRenderedListDetailEntry(entry, activeIndex) {
    if (!entry) return;
    entry.activeIndex = Number.isInteger(activeIndex) ? activeIndex : -1;

    for (const [index, state] of entry.panelStates.entries()) {
        restorePseudoStyleState(state.panel, state.originalStyles);
        const active = index === entry.activeIndex;
        if (active) {
            const assignments = [
                { property: 'visibility', value: 'visible' },
                { property: 'opacity', value: '1' },
                { property: 'pointer-events', value: 'auto' },
            ];
            if (state.wasDisplayNone) assignments.push({ property: 'display', value: 'block' });
            applyPseudoStyleAssignments(state.panel, assignments);
            state.panel.setAttribute('aria-hidden', 'false');
            state.panel.setAttribute(RENDERED_LIST_DETAIL_ACTIVE_ATTR, 'true');
        } else {
            state.panel.setAttribute('aria-hidden', 'true');
            state.panel.removeAttribute(RENDERED_LIST_DETAIL_ACTIVE_ATTR);
        }
    }

    for (const state of entry.defaultStates) {
        restorePseudoStyleState(state.view, state.originalStyles);
        if (entry.activeIndex >= 0) {
            applyPseudoStyleAssignments(state.view, [
                { property: 'display', value: 'none' },
                { property: 'opacity', value: '0' },
                { property: 'pointer-events', value: 'none' },
            ]);
            state.view.setAttribute('aria-hidden', 'true');
        } else {
            state.view.removeAttribute('aria-hidden');
        }
    }

    entry.triggers.forEach((trigger, index) => {
        const active = index === entry.activeIndex;
        trigger.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (active) trigger.setAttribute(RENDERED_LIST_DETAIL_ACTIVE_ATTR, 'true');
        else trigger.removeAttribute(RENDERED_LIST_DETAIL_ACTIVE_ATTR);
    });
}


function findRenderedListDetailEntries(root) {
    if (!root?.querySelectorAll) return [];
    const entries = [];
    for (const host of root.querySelectorAll('div, section, article, aside')) {
        const entry = buildRenderedListDetailEntry(host);
        if (entry) entries.push(entry);
    }
    return entries;
}


export function hasRenderedListDetailCandidates(root) {
    return findRenderedListDetailEntries(root).length > 0;
}


export function installRenderedListDetailRescue(root) {
    if (!root?.querySelectorAll) return;
    let state = renderedListDetailRescueStates.get(root);
    if (!state) {
        state = { hosts: new Map() };
        renderedListDetailRescueStates.set(root, state);
    }

    for (const entry of findRenderedListDetailEntries(root)) {
        if (state.hosts.has(entry.host)) continue;
        state.hosts.set(entry.host, entry);
        entry.host.setAttribute(RENDERED_LIST_DETAIL_RESCUE_ATTR, 'true');

        entry.triggers.forEach((trigger, index) => {
            preparePseudoTrigger(trigger);
            const activate = event => {
                if (event?.type === 'keydown') {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                }
                applyRenderedListDetailEntry(entry, index);
            };
            trigger.addEventListener('click', activate, false);
            trigger.addEventListener('keydown', activate, false);
        });
        applyRenderedListDetailEntry(entry, -1);
    }
}


export function normalizeStylePropertyName(property) {
    return String(property || '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}


function normalizeRecoveredInteractionStyleAssignments(assignments = []) {
    const normalized = [];
    for (const assignment of assignments || []) {
        const property = normalizeStylePropertyName(assignment?.property);
        const value = String(assignment?.value ?? '').trim();
        // Custom properties can indirectly feed an existing url()/position declaration,
        // which would bypass a property-local check. Recovered model events do not need
        // extension-defined variables, so keep the boundary to ordinary declarations.
        if (!/^-?[a-z][a-z0-9-]*$/i.test(property) || property.startsWith('--')) return [];
        if (!value || value.length > RECOVERED_INTERACTION_STYLE_MAX_VALUE_CHARS) return [];
        normalized.push({ property, value });
    }
    return normalized;
}


function currentRecoveredInteractionOverlayDeclarationMap(element) {
    const declarations = new Map();
    const style = element?.style;
    const length = Number(style?.length);
    if (style && Number.isInteger(length) && length >= 0 && typeof style.item === 'function') {
        for (let index = 0; index < length; index += 1) {
            const property = normalizeStylePropertyName(style.item(index));
            if (!RECOVERED_INTERACTION_OVERLAY_PROPERTIES.has(property)) continue;
            const value = String(style.getPropertyValue?.(property) || '').trim();
            if (property && value) declarations.set(property, value);
        }
    } else {
        // Minimal DOM/test doubles may not expose CSSStyleDeclaration iteration.
        const raw = String(element?.getAttribute?.('style') || '');
        for (const declaration of splitCssDeclarationList(raw)) {
            const index = declaration.indexOf(':');
            if (index <= 0) continue;
            const property = normalizeStylePropertyName(declaration.slice(0, index).trim());
            const value = declaration.slice(index + 1).trim().replace(/\s*!important\s*$/i, '');
            if (RECOVERED_INTERACTION_OVERLAY_PROPERTIES.has(property) && value) {
                declarations.set(property, value);
            }
        }
    }

    // A recovered declaration can combine with positioning supplied by a sanitized
    // stylesheet, not only with inline state. Bring just the overlay-relevant computed
    // values into the effective-state check so ordinary computed CSS is not reserialized.
    try {
        const view = element?.ownerDocument?.defaultView || globalThis;
        const computed = typeof view?.getComputedStyle === 'function' ? view.getComputedStyle(element) : null;
        for (const property of RECOVERED_INTERACTION_OVERLAY_PROPERTIES) {
            if (declarations.has(property)) continue;
            const value = String(computed?.getPropertyValue?.(property) || '').trim();
            if (value) declarations.set(property, value);
        }
    } catch {
        // Detached/test DOM nodes may not have a computable style; inline state still applies.
    }
    return declarations;
}


export function sanitizeRecoveredInteractionStyleAssignments(element, assignments = [], { removedProperties = [] } = {}) {
    const normalized = normalizeRecoveredInteractionStyleAssignments(assignments);
    if (!normalized.length || normalized.length !== (assignments || []).length) return [];

    const block = normalized.map(({ property, value }) => `${property}:${value}`).join(';');
    if (!block || cssContainsUnsafeGeneratedResource(block)) return [];

    // Reuse the initial generated-CSS policy and reject the whole recovered operation if
    // that policy would drop any declaration. Never reinterpret a partly unsafe program.
    const sanitized = sanitizeGeneratedCssDeclarationBlock(block);
    const sourceCount = splitCssDeclarationList(block).filter(item => String(item || '').trim()).length;
    const sanitizedCount = splitCssDeclarationList(sanitized).filter(item => String(item || '').trim()).length;
    if (!sanitized || sourceCount !== sanitizedCount) return [];

    const hasOverlayAssignment = normalized.some(({ property }) => RECOVERED_INTERACTION_OVERLAY_PROPERTIES.has(property));
    if (!hasOverlayAssignment) return normalized;

    // Evaluate the final declaration state rather than only the new values. Otherwise a
    // recovered `position:fixed` could combine with sanitized-but-inert inset/size values
    // already present on the element and recreate a full-screen overlay across state copies.
    const overlayDeclarations = currentRecoveredInteractionOverlayDeclarationMap(element);
    for (const property of removedProperties || []) {
        overlayDeclarations.delete(normalizeStylePropertyName(property));
    }
    for (const { property, value } of normalized) {
        if (RECOVERED_INTERACTION_OVERLAY_PROPERTIES.has(property)) overlayDeclarations.set(property, value);
    }
    const overlayBlock = [...overlayDeclarations.entries()].map(([property, value]) => `${property}:${value}`).join(';');
    return !overlayBlock || !cssDeclarationBlockContainsUnsafeOverlayGeometry(overlayBlock) ? normalized : [];
}


export function validateRabbitMirrorRecoveredStyleAssignments(element, assignments = [], options = {}) {
    return sanitizeRecoveredInteractionStyleAssignments(element, assignments, options);
}


export function parseInlineStyleAssignments(scriptText) {
    const assignments = new Map();
    const source = String(scriptText || '');
    if (!source || !/this\.style/i.test(source)) return [];

    const remember = (property, value) => {
        const normalizedProperty = normalizeStylePropertyName(property);
        const normalizedValue = String(value || '').trim();
        if (!normalizedProperty || !normalizedValue) return;
        assignments.set(normalizedProperty, normalizedValue);
    };

    // 只解析安全且意图明确的 this.style.xxx='value'，绝不执行模型输出的 JavaScript。
    const dotAssignmentRe = /this\.style\.([a-zA-Z][\w]*)\s*=\s*(['"])([\s\S]*?)\2\s*;?/g;
    let match;
    while ((match = dotAssignmentRe.exec(source))) remember(match[1], match[3]);

    const bracketAssignmentRe = /this\.style\[\s*(['"])([a-zA-Z-]+)\1\s*\]\s*=\s*(['"])([\s\S]*?)\3\s*;?/g;
    while ((match = bracketAssignmentRe.exec(source))) remember(match[2], match[4]);

    return sanitizeRecoveredInteractionStyleAssignments(
        null,
        [...assignments.entries()].map(([property, value]) => ({ property, value })),
    );
}


export function collectInlineAssignments(element, attributeNames) {
    const combined = new Map();
    for (const attributeName of attributeNames) {
        const value = element?.getAttribute?.(attributeName);
        for (const assignment of parseInlineStyleAssignments(value)) {
            combined.set(assignment.property, assignment.value);
        }
    }
    return [...combined.entries()].map(([property, value]) => ({ property, value }));
}


export function resolveScopedPseudoId(root, rawId) {
    const id = String(rawId || '').trim();
    if (!root?.querySelectorAll || !id) return null;

    const direct = [...root.querySelectorAll('[id]')].find(element => element.id === id);
    if (direct) return direct;

    const mappedId = interactionScopeStates.get(root)?.idMap?.get?.(id);
    if (mappedId) {
        const mapped = [...root.querySelectorAll('[id]')].find(element => element.id === mappedId);
        if (mapped) return mapped;
    }

    return null;
}


function resolveParentElementExpression(element, expression) {
    const source = String(expression || '').replace(/\s+/g, '');
    if (!/^this(?:\.parentElement)+$/.test(source)) return null;
    const depth = (source.match(/\.parentElement/g) || []).length;
    let current = element;
    for (let index = 0; index < depth; index += 1) {
        current = current?.parentElement || null;
        if (!current) return null;
    }
    return current;
}


function isSafeLocalQuerySelector(selector) {
    const source = String(selector || '').trim();
    // 仅允许一个简单的 ID、class 或标签选择器；禁止组合器、属性、伪类与通配符。
    return /^(?:#[a-zA-Z_][\w:.-]*|\.[a-zA-Z_][\w-]*|[a-zA-Z][\w-]*)$/.test(source);
}


function resolveSafeScopedQuery(scope, selector, root) {
    const safeSelector = String(selector || '').trim();
    if (!scope?.querySelector || !root?.contains || !root.contains(scope) || !isSafeLocalQuerySelector(safeSelector)) return null;
    if (safeSelector.startsWith('#')) {
        return resolveScopedPseudoId(scope, safeSelector.slice(1)) || resolveScopedPseudoId(root, safeSelector.slice(1));
    }
    try {
        let target = scope.querySelector(safeSelector);
        // 酒馆净化器会把模型 class 改写为 custom-xxx。原始 onchange 仍引用旧 class，
        // 急救时仅在同一兔子镜范围内补查该安全前缀，不访问整页。
        if (!target && safeSelector.startsWith('.')) {
            const className = safeSelector.slice(1);
            target = scope.querySelector(`.custom-${className}`);
            if (!target) {
                target = [...scope.querySelectorAll('[class]')].find(element =>
                    [...(element.classList || [])].some(token => token === className || token.endsWith(`-${className}`)),
                ) || null;
            }
        }
        return target && root.contains(target) ? target : null;
    } catch {
        return null;
    }
}


function resolveSafeScopedQueryAll(scope, selector, root) {
    const safeSelector = String(selector || '').trim();
    if (!scope?.querySelectorAll || !root?.contains || !root.contains(scope) || !isSafeLocalQuerySelector(safeSelector)) return [];
    if (safeSelector.startsWith('#')) {
        const target = resolveScopedPseudoId(scope, safeSelector.slice(1)) || resolveScopedPseudoId(root, safeSelector.slice(1));
        return target ? [target] : [];
    }
    try {
        let targets = [...scope.querySelectorAll(safeSelector)].filter(target => target && root.contains(target));
        if (!targets.length && safeSelector.startsWith('.')) {
            const className = safeSelector.slice(1);
            targets = [...scope.querySelectorAll(`.custom-${className}`)].filter(target => target && root.contains(target));
            if (!targets.length) {
                targets = [...scope.querySelectorAll('[class]')].filter(element =>
                    root.contains(element)
                    && [...(element.classList || [])].some(token => token === className || token.endsWith(`-${className}`)),
                );
            }
        }
        return targets.slice(0, 64);
    } catch {
        return [];
    }
}


function resolveRelativeQueryExpression(input, expression, root) {
    const source = String(expression || '').replace(/\s+/g, '');
    const match = /^(this(?:\.parentElement)*)\.querySelector\((['"])([.#][\w:.-]+)\2\)$/.exec(source);
    if (!match) return null;
    const scope = match[1] === 'this' ? input : resolveParentElementExpression(input, match[1]);
    return resolveSafeScopedQuery(scope, match[3], root);
}


function findMatchingScriptBrace(sourceText, openIndex) {
    const source = String(sourceText || '');
    if (source[openIndex] !== '{') return -1;
    let depth = 0;
    let quote = '';
    let escaped = false;

    for (let index = openIndex; index < source.length; index += 1) {
        const char = source[index];
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
        if (char === '{') depth += 1;
        else if (char === '}') {
            depth -= 1;
            if (depth === 0) return index;
        }
    }
    return -1;
}


function extractCheckedConditionalBranches(scriptText) {
    const source = String(scriptText || '');
    const conditionMatch = /if\s*\(\s*this\.checked\s*\)/i.exec(source);
    if (!conditionMatch) return null;

    const activeOpen = source.indexOf('{', conditionMatch.index + conditionMatch[0].length);
    if (activeOpen < 0) return null;
    const activeClose = findMatchingScriptBrace(source, activeOpen);
    if (activeClose < 0) return null;

    const tail = source.slice(activeClose + 1);
    const elseMatch = /^\s*else\s*/i.exec(tail);
    if (!elseMatch) return null;
    const inactiveOpen = source.indexOf('{', activeClose + 1 + elseMatch[0].length);
    if (inactiveOpen < 0) return null;
    const inactiveClose = findMatchingScriptBrace(source, inactiveOpen);
    if (inactiveClose < 0) return null;

    return {
        active: source.slice(activeOpen + 1, activeClose),
        inactive: source.slice(inactiveOpen + 1, inactiveClose),
    };
}


function parseNamedStyleAssignments(scriptText, targetMap, targetCollections = new Map()) {
    const assignmentsByTarget = new Map();
    const source = String(scriptText || '');

    const rememberTarget = (target, property, value) => {
        const normalizedProperty = normalizeStylePropertyName(property);
        const normalizedValue = String(value || '').trim();
        if (!target || !normalizedProperty || !normalizedValue) return;
        if (!assignmentsByTarget.has(target)) assignmentsByTarget.set(target, new Map());
        assignmentsByTarget.get(target).set(normalizedProperty, normalizedValue);
    };
    const remember = (targetName, property, value) => rememberTarget(targetMap.get(targetName), property, value);
    const rememberIndexed = (collectionName, rawIndex, property, value) => {
        const index = Number(rawIndex);
        const collection = targetCollections.get(collectionName);
        if (!Number.isSafeInteger(index) || index < 0 || index > 63 || !collection) return;
        rememberTarget(collection[index], property, value);
    };

    const dotAssignmentRe = /([a-zA-Z_$][\w$]*)\.style\.([a-zA-Z][\w]*)\s*=\s*(['"])([\s\S]*?)\3\s*;?/g;
    let match;
    while ((match = dotAssignmentRe.exec(source))) remember(match[1], match[2], match[4]);

    const bracketAssignmentRe = /([a-zA-Z_$][\w$]*)\.style\[\s*(['"])([a-zA-Z-]+)\2\s*\]\s*=\s*(['"])([\s\S]*?)\4\s*;?/g;
    while ((match = bracketAssignmentRe.exec(source))) remember(match[1], match[3], match[5]);

    const indexedDotAssignmentRe = /([a-zA-Z_$][\w$]*)\s*\[\s*(\d{1,2})\s*\]\s*\.style\.([a-zA-Z][\w]*)\s*=\s*(['"])([\s\S]*?)\4\s*;?/g;
    while ((match = indexedDotAssignmentRe.exec(source))) rememberIndexed(match[1], match[2], match[3], match[5]);

    const indexedBracketAssignmentRe = /([a-zA-Z_$][\w$]*)\s*\[\s*(\d{1,2})\s*\]\s*\.style\[\s*(['"])([a-zA-Z-]+)\3\s*\]\s*=\s*(['"])([\s\S]*?)\5\s*;?/g;
    while ((match = indexedBracketAssignmentRe.exec(source))) rememberIndexed(match[1], match[2], match[4], match[6]);

    return new Map(
        [...assignmentsByTarget.entries()].map(([target, assignments]) => [
            target,
            [...assignments.entries()].map(([property, value]) => ({ property, value })),
        ]),
    );
}


function parseNamedTextAssignments(scriptText, targetMap, targetCollections = new Map()) {
    const textByTarget = new Map();
    const source = String(scriptText || '');
    const rememberText = (target, mode, rawValue) => {
        if (!target) return;
        // Keep the inert instruction raw. The live assignment boundary performs
        // the current replacement once; replacement output need not be idempotent.
        const value = decodeSafeInlineString(rawValue);
        // innerHTML 只接受纯文本；任何标签形态都放弃该条文字赋值。
        if (mode === 'innerHTML' && /<[^>]*>/.test(value)) return;
        textByTarget.set(target, value);
    };

    const textAssignmentRe = /([a-zA-Z_$][\w$]*)\.(innerHTML|innerText|textContent)\s*=\s*(['"])((?:\\.|(?!\3)[\s\S])*)\3\s*;?/g;
    let match;
    while ((match = textAssignmentRe.exec(source))) rememberText(targetMap.get(match[1]), match[2], match[4]);

    const indexedTextAssignmentRe = /([a-zA-Z_$][\w$]*)\s*\[\s*(\d{1,2})\s*\]\s*\.(innerHTML|innerText|textContent)\s*=\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*;?/g;
    while ((match = indexedTextAssignmentRe.exec(source))) {
        const index = Number(match[2]);
        const collection = targetCollections.get(match[1]);
        if (!Number.isSafeInteger(index) || index < 0 || index > 63 || !collection) continue;
        rememberText(collection[index], match[3], match[5]);
    }
    return textByTarget;
}



function resolveAncestorQueryExpression(input, expression, root) {
    const source = String(expression || '').trim();
    const match = /^(this(?:(?:\s*\.\s*(?:parentNode|parentElement))*))\s*\.\s*querySelector\(\s*(['"])([.#]?[a-zA-Z_][\w:.-]*)\2\s*\)$/.exec(source);
    if (!match) return null;

    const chain = match[1];
    const depth = (chain.match(/\.\s*(?:parentNode|parentElement)/g) || []).length;
    let scope = input;
    for (let index = 0; index < depth; index += 1) {
        scope = scope?.parentElement || null;
        if (!scope || !root?.contains?.(scope)) return null;
    }
    return resolveSafeScopedQuery(scope, match[3], root);
}


function parseSafeCssTextAssignments(cssText) {
    const assignments = [];
    const source = String(cssText || '').trim();
    if (!source || /[{}<>]/.test(source)) return assignments;
    for (const declaration of source.split(';')) {
        const index = declaration.indexOf(':');
        if (index <= 0) continue;
        const property = normalizeStylePropertyName(declaration.slice(0, index).trim());
        const value = declaration.slice(index + 1).trim();
        if (!/^[a-z][a-z0-9-]*$/i.test(property) || !value) continue;
        assignments.push({ property, value });
    }
    return assignments;
}


export function resolveCheckedRelativeElementExpression(input, expression, root) {
    const source = String(expression || '').replace(/\s+/g, '');
    if (!/^this(?:\.(?:nextElementSibling|previousElementSibling|parentElement|parentNode)){0,6}$/.test(source)) return null;

    let target = input;
    const steps = source.match(/\.(?:nextElementSibling|previousElementSibling|parentElement|parentNode)/g) || [];
    for (const rawStep of steps) {
        const step = rawStep.slice(1);
        if (step === 'nextElementSibling') target = target?.nextElementSibling || null;
        else if (step === 'previousElementSibling') target = target?.previousElementSibling || null;
        else target = target?.parentElement || null;
        if (!target || !root?.contains?.(target)) return null;
    }
    return target && root?.contains?.(target) ? target : null;
}


function parseCheckedTernaryStyleProgramFromSource(input, root, scriptText) {
    const source = String(scriptText || '');
    if (!source || !/this\s*\.\s*checked\s*\?/i.test(source)) return null;

    const stateValues = new Map();
    const ternaryRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*this\s*\.\s*checked\s*\?\s*(['"])((?:\\.|(?!\2)[\s\S])*)\2\s*:\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*;?/g;
    let match;
    while ((match = ternaryRe.exec(source))) {
        stateValues.set(match[1], {
            active: decodeSafeInlineString(match[3]),
            inactive: decodeSafeInlineString(match[5]),
        });
    }
    // 直接写在赋值右侧的三元表达式不需要先声明状态变量。
    // 不能在 stateValues 为空时提前退出，否则
    // this.nextElementSibling.style.opacity = this.checked ? '1' : '0'
    // 这类最常见结构会在真正解析前被误判为无程序。

    const statesByTarget = new Map();
    const ensureTargetState = target => {
        if (!target) return null;
        if (!statesByTarget.has(target)) {
            statesByTarget.set(target, {
                target,
                activeAssignments: [],
                inactiveAssignments: [],
                activeText: undefined,
                inactiveText: undefined,
            });
        }
        return statesByTarget.get(target);
    };

    // 支持模型最常见的直接相邻目标写法：
    // this.nextElementSibling.style.opacity = this.checked ? '1' : '0';
    // 仅沿当前 input 的有限亲属/兄弟链解析，不执行任意 JavaScript，也不会越出当前兔子镜。
    const rememberDirectStyle = (expression, property, rawActive, rawInactive) => {
        const target = resolveCheckedRelativeElementExpression(input, expression, root);
        const state = ensureTargetState(target);
        const normalizedProperty = normalizeStylePropertyName(property);
        if (!state || !/^[a-z][a-z0-9-]*$/i.test(normalizedProperty)) return;
        state.activeAssignments.push({ property: normalizedProperty, value: decodeSafeInlineString(rawActive) });
        state.inactiveAssignments.push({ property: normalizedProperty, value: decodeSafeInlineString(rawInactive) });
    };

    const directDotTernaryRe = /(this(?:\s*\.\s*(?:nextElementSibling|previousElementSibling|parentElement|parentNode)){0,6})\s*\.\s*style\s*\.\s*([a-zA-Z][\w]*)\s*=\s*this\s*\.\s*checked\s*\?\s*(['"])((?:\\.|(?!\3)[\s\S])*)\3\s*:\s*(['"])((?:\\.|(?!\5)[\s\S])*)\5\s*;?/g;
    let directMatch;
    while ((directMatch = directDotTernaryRe.exec(source))) {
        rememberDirectStyle(directMatch[1], directMatch[2], directMatch[4], directMatch[6]);
    }

    const directBracketTernaryRe = /(this(?:\s*\.\s*(?:nextElementSibling|previousElementSibling|parentElement|parentNode)){0,6})\s*\.\s*style\s*\[\s*(['"])([a-zA-Z-]+)\2\s*\]\s*=\s*this\s*\.\s*checked\s*\?\s*(['"])((?:\\.|(?!\4)[\s\S])*)\4\s*:\s*(['"])((?:\\.|(?!\6)[\s\S])*)\6\s*;?/g;
    while ((directMatch = directBracketTernaryRe.exec(source))) {
        rememberDirectStyle(directMatch[1], directMatch[3], directMatch[5], directMatch[7]);
    }

    const directTextTernaryRe = /(this(?:\s*\.\s*(?:nextElementSibling|previousElementSibling|parentElement|parentNode)){0,6})\s*\.\s*(innerText|textContent)\s*=\s*this\s*\.\s*checked\s*\?\s*(['"])((?:\\.|(?!\3)[\s\S])*)\3\s*:\s*(['"])((?:\\.|(?!\5)[\s\S])*)\5\s*;?/g;
    while ((directMatch = directTextTernaryRe.exec(source))) {
        const target = resolveCheckedRelativeElementExpression(input, directMatch[1], root);
        const state = ensureTargetState(target);
        if (!state) continue;
        state.activeText = decodeSafeInlineString(directMatch[4]);
        state.inactiveText = decodeSafeInlineString(directMatch[6]);
    }

    const queryExpressionPattern = String.raw`(this(?:(?:\s*\.\s*(?:parentNode|parentElement))*)\s*\.\s*querySelector\(\s*(['"])([.#]?[a-zA-Z_][\w:.-]*)\2\s*\))`;

    // 逐行解析，避免 cssText 的字符串内部包含分号时被错误截断。
    for (const rawLine of source.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || /^(?:const|let|var)\b/.test(line)) continue;

        let lineMatch = new RegExp(`^${queryExpressionPattern}\\s*\\.\\s*style\\s*\\.\\s*([a-zA-Z][\\w]*)\\s*=\\s*([a-zA-Z_$][\\w$]*)\\s*;?$`).exec(line);
        if (lineMatch) {
            const target = resolveAncestorQueryExpression(input, lineMatch[1], root);
            const values = stateValues.get(lineMatch[5]);
            const state = ensureTargetState(target);
            if (state && values) {
                const property = normalizeStylePropertyName(lineMatch[4]);
                state.activeAssignments.push({ property, value: values.active });
                state.inactiveAssignments.push({ property, value: values.inactive });
            }
            continue;
        }

        lineMatch = new RegExp(`^${queryExpressionPattern}\\s*\\.\\s*(innerText|textContent)\\s*=\\s*([a-zA-Z_$][\\w$]*)\\s*;?$`).exec(line);
        if (lineMatch) {
            const target = resolveAncestorQueryExpression(input, lineMatch[1], root);
            const values = stateValues.get(lineMatch[5]);
            const state = ensureTargetState(target);
            if (state && values) {
                state.activeText = values.active;
                state.inactiveText = values.inactive;
            }
            continue;
        }

        lineMatch = new RegExp(`^${queryExpressionPattern}\\s*\\.\\s*style\\s*\\.\\s*cssText\\s*=\\s*([a-zA-Z_$][\\w$]*)\\s*\\+\\s*(['"])((?:\\\\.|(?!\\5)[\\s\\S])*)\\5\\s*;?$`).exec(line);
        if (lineMatch) {
            const target = resolveAncestorQueryExpression(input, lineMatch[1], root);
            const values = stateValues.get(lineMatch[4]);
            const suffix = decodeSafeInlineString(lineMatch[6]);
            const state = ensureTargetState(target);
            if (state && values) {
                state.activeAssignments.push(...parseSafeCssTextAssignments(`${values.active}${suffix}`));
                state.inactiveAssignments.push(...parseSafeCssTextAssignments(`${values.inactive}${suffix}`));
            }
        }
    }

    const states = [];
    for (const state of statesByTarget.values()) {
        const properties = new Set([
            ...state.activeAssignments.map(item => item.property),
            ...state.inactiveAssignments.map(item => item.property),
        ]);
        if (!properties.size && state.activeText === undefined && state.inactiveText === undefined) continue;
        states.push({
            ...state,
            originalText: captureStableTextState(state.target),
            originalStyles: capturePseudoStyleState(state.target, properties),
        });
    }
    return states.length ? states : null;
}


export function parseCheckedChangeStyleProgramFromSource(input, root, scriptText) {
    const source = String(scriptText || '');
    if (!source) return null;
    if (!/if\s*\(\s*this\.checked\s*\)/i.test(source)) {
        return parseCheckedTernaryStyleProgramFromSource(input, root, source);
    }

    // 只接受结构清晰的 if(this.checked){...} else {...}，绝不执行模型输出的 JavaScript。
    const branches = extractCheckedConditionalBranches(source);
    if (!branches) return null;

    const targetMap = new Map([['this', input]]);
    const targetCollections = new Map();

    // 支持：const wrapper = this.parentElement.parentElement;
    const parentAliasRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(this(?:\s*\.\s*parentElement)+)\s*;?/g;
    let match;
    while ((match = parentAliasRe.exec(source))) {
        const resolved = resolveParentElementExpression(input, match[2]);
        if (resolved && root.contains(resolved)) targetMap.set(match[1], resolved);
    }

    // 支持：const target = this.parentElement.parentElement.querySelector('.target-class');
    // 以及 const target = wrapper.querySelector('#target-id')。只允许单一 class / ID 选择器。
    const relativeQueryAliasRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(this(?:\s*\.\s*parentElement)*)\s*\.\s*querySelector\(\s*(['"])([.#][a-zA-Z_][\w:.-]*)\3\s*\)\s*;?/g;
    while ((match = relativeQueryAliasRe.exec(source))) {
        const expression = `${match[2]}.querySelector('${match[4]}')`;
        const target = resolveRelativeQueryExpression(input, expression, root);
        if (target) targetMap.set(match[1], target);
    }

    const queryAliasRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*([a-zA-Z_$][\w$]*)\.querySelector\(\s*(['"])([.#]?[a-zA-Z_][\w:.-]*)\3\s*\)\s*;?/g;
    while ((match = queryAliasRe.exec(source))) {
        const scope = targetMap.get(match[2]);
        const target = resolveSafeScopedQuery(scope, match[4], root);
        if (target) targetMap.set(match[1], target);
    }

    // 模型常用 document.getElementById；宿主会删除 onchange，且 ID 可能已被兔子镜作用域化。
    // 这里只在当前兔子镜内解析安全的固定 ID，不访问整页，也不执行模型 JavaScript。
    const documentIdAliasRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*document\s*\.\s*getElementById\(\s*(['"])([a-zA-Z_][\w:.-]*)\2\s*\)\s*;?/g;
    while ((match = documentIdAliasRe.exec(source))) {
        const target = resolveScopedPseudoId(root, match[3]);
        if (target) targetMap.set(match[1], target);
    }

    // 模型常用 document.querySelector；急救器不会访问整页，而是强制收敛到当前兔子镜。
    const documentQueryAliasRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*document\s*\.\s*querySelector\(\s*(['"])([.#]?[a-zA-Z_][\w:.-]*)\2\s*\)\s*;?/g;
    while ((match = documentQueryAliasRe.exec(source))) {
        const target = resolveSafeScopedQuery(root, match[3], root);
        if (target) targetMap.set(match[1], target);
    }

    // document 作用域别名建立后，再解析依赖它的二级查询，例如 core = cluster.querySelector('div')。
    queryAliasRe.lastIndex = 0;
    while ((match = queryAliasRe.exec(source))) {
        const scope = targetMap.get(match[2]);
        const target = resolveSafeScopedQuery(scope, match[4], root);
        if (target) targetMap.set(match[1], target);
    }

    // 支持固定索引的安全集合访问：const nodes = document/queryScope.querySelectorAll('.item'); nodes[0].style...
    const documentQueryAllAliasRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*document\s*\.\s*querySelectorAll\(\s*(['"])([.#]?[a-zA-Z_][\w:.-]*)\2\s*\)\s*;?/g;
    while ((match = documentQueryAllAliasRe.exec(source))) {
        const targets = resolveSafeScopedQueryAll(root, match[3], root);
        if (targets.length) targetCollections.set(match[1], targets);
    }

    const scopedQueryAllAliasRe = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*([a-zA-Z_$][\w$]*)\.querySelectorAll\(\s*(['"])([.#]?[a-zA-Z_][\w:.-]*)\3\s*\)\s*;?/g;
    while ((match = scopedQueryAllAliasRe.exec(source))) {
        const scope = targetMap.get(match[2]);
        const targets = resolveSafeScopedQueryAll(scope, match[4], root);
        if (targets.length) targetCollections.set(match[1], targets);
    }

    const activeByTarget = parseNamedStyleAssignments(branches.active, targetMap, targetCollections);
    const inactiveByTarget = parseNamedStyleAssignments(branches.inactive, targetMap, targetCollections);
    const activeTextByTarget = parseNamedTextAssignments(branches.active, targetMap, targetCollections);
    const inactiveTextByTarget = parseNamedTextAssignments(branches.inactive, targetMap, targetCollections);
    const targets = new Set([
        ...activeByTarget.keys(),
        ...inactiveByTarget.keys(),
        ...activeTextByTarget.keys(),
        ...inactiveTextByTarget.keys(),
    ]);
    if (!targets.size || (!activeByTarget.size && !activeTextByTarget.size)) return null;

    const states = [];
    for (const target of targets) {
        const activeAssignments = activeByTarget.get(target) || [];
        const inactiveAssignments = inactiveByTarget.get(target) || [];
        const properties = new Set([...activeAssignments, ...inactiveAssignments].map(item => item.property));
        const hasActiveText = activeTextByTarget.has(target);
        const hasInactiveText = inactiveTextByTarget.has(target);
        if (!properties.size && !hasActiveText && !hasInactiveText) continue;
        states.push({
            target,
            activeAssignments,
            inactiveAssignments,
            activeText: hasActiveText ? activeTextByTarget.get(target) : undefined,
            inactiveText: hasInactiveText ? inactiveTextByTarget.get(target) : undefined,
            originalText: captureStableTextState(target),
            originalStyles: capturePseudoStyleState(target, properties),
        });
    }

    return states.length ? states : null;
}


export function parseCheckedChangeStyleProgram(input, root) {
    return parseCheckedChangeStyleProgramFromSource(input, root, input?.getAttribute?.('onchange') || '');
}


function applyCheckedChangeProgram(input, states) {
    const active = !!input?.checked;
    for (const state of states || []) {
        if (!state?.target) continue;
        if (active) {
            if (state.activeText !== undefined && isRabbitMirrorRuntimeTextTarget(state.target)) state.target.textContent = filterRabbitMirrorRuntimeText(state.activeText);
            applyPseudoStyleAssignments(state.target, state.activeAssignments);
            state.target.setAttribute(PSEUDO_ACTIVE_ATTR, 'true');
        } else {
            restorePseudoStyleState(state.target, state.originalStyles);
            if (state.inactiveText !== undefined && isRabbitMirrorRuntimeTextTarget(state.target)) state.target.textContent = filterRabbitMirrorRuntimeText(state.inactiveText);
            else if (state.originalText !== undefined && isRabbitMirrorRuntimeTextTarget(state.target)) state.target.textContent = filterRabbitMirrorRuntimeText(state.originalText);
            applyPseudoStyleAssignments(state.target, state.inactiveAssignments);
            state.target.removeAttribute(PSEUDO_ACTIVE_ATTR);
        }
    }
    input?.setAttribute?.('aria-pressed', active ? 'true' : 'false');
}


export function bindCheckedChangeProgram(input, states) {
    if (!input || !states?.length || input.hasAttribute(CHANGE_PSEUDO_RESCUE_ATTR)) return false;
    input.addEventListener('change', () => applyCheckedChangeProgram(input, states), false);
    input.addEventListener('input', () => applyCheckedChangeProgram(input, states), false);
    input.removeAttribute('onchange');
    input.setAttribute(CHANGE_PSEUDO_RESCUE_ATTR, 'true');
    applyCheckedChangeProgram(input, states);
    return true;
}


