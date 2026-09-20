// Split from outputSanitizer.js — choiceRescue.

import {
    FEEDBACK_CAT_ATTR,
    MAINTENANCE_RABBIT_ATTR,
    RECIPE_BUTTON_ATTR,
    TOOL_ENTRY_HOST_ATTR,
    escapeCssIdentifier,
} from './runtime.js?rmv=1.5.65';
import {
    DETACHED_CHECKED_HAS_CONTROL_ATTR,
    DIRECT_ID_CLASS_STATE_RESCUE_ATTR,
    DIRECT_ID_CLICK_RESCUE_ATTR,
    HINTED_PSEUDO_RESCUE_ATTR,
    INLINE_PSEUDO_RESCUE_ATTR,
    interactionCapabilityStates,
} from './checkedStateRescue.js?rmv=1.5.65';
import {
    RENDERED_BUTTON_ADJACENT_HIDDEN_RESCUE_ATTR,
    RENDERED_CLICKABLE_ADJACENT_HIDDEN_RESCUE_ATTR,
    RENDERED_CLICKABLE_ADJACENT_POPUP_RESCUE_ATTR,
    RENDERED_CSS_STATE_SIBLING_RESCUE_ATTR,
    findRenderedButtonAdjacentHiddenTarget,
    findRenderedClickableAdjacentHiddenTarget,
    findRenderedClickableAdjacentPopupTarget,
    getClassTokens,
} from './renderedStateRescue.js?rmv=1.5.65';
import {
    RAW_SELF_MUTATION_RESCUE_ATTR,
    detectInteractionCapabilities,
    filterRabbitMirrorRuntimeText,
    isRabbitMirrorRuntimeTextTarget,
} from './scriptedInteractionRescue.js?rmv=1.5.65';
import {
    DISABLED_ONLY_CHOICE_CONTROL_ATTR,
    DISABLED_ONLY_CHOICE_RESCUE_ATTR,
    FILL_IN_CHOICE_ACTIVE_ATTR,
    FILL_IN_CHOICE_AVAILABLE_ATTR,
    FILL_IN_CHOICE_BLANK_ATTR,
    FILL_IN_CHOICE_CODE_ATTR,
    FILL_IN_CHOICE_COUNT_ATTR,
    FILL_IN_CHOICE_FILLED_ATTR,
    FILL_IN_CHOICE_OPTION_ATTR,
    FILL_IN_CHOICE_RESCUE_ATTR,
    FILL_IN_CHOICE_SELECTED_ATTR,
    FILL_IN_CHOICE_STYLE_ATTR,
    FILL_IN_CHOICE_USED_ATTR,
    INERT_ACTION_BUTTON_RESCUE_ATTR,
    INERT_ACTION_STATUS_ATTR,
    RESAY_ATTR,
    SELECTION_ONLY_FALLBACK_ATTR,
    SELECTION_ONLY_PLACEHOLDER_ATTR,
    SELECTION_ONLY_SOURCE_ATTR,
    STATIC_CHOICE_SELECTION_COUNT_ATTR,
    STATIC_CHOICE_SELECTION_ITEM_ATTR,
    STATIC_CHOICE_SELECTION_RESCUE_ATTR,
    STATIC_CHOICE_SELECTION_SELECTED_ATTR,
    STATIC_CHOICE_SELECTION_STYLE_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_BODY_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_OPEN_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_STYLE_ATTR,
    STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR,
    diagnosticCompactText,
    diagnosticComputedStyle,
    diagnosticFindAssociatedLabel,
    diagnosticIsInternalUiNode,
    diagnosticQueryContentAll,
    fillInChoiceRescueStates,
    staticChoiceSelectionRescueStates,
    structuredStaticDisclosureRescueStates,
} from './diagnostics.js?rmv=1.5.65';
import { maintenanceCheckedInteractionDepth } from './maintenanceInspect.js?rmv=1.5.65';

const STATIC_CHOICE_TITLE_RE = /^(?:选项|选择|方案|路线|分支|抉择|结局|行动|choice|option|route|path)\s*(?:[A-Z0-9一二三四五六七八九十]+)?\s*[:：·\-—]/i;

const STATIC_CHOICE_CONTEXT_RE = /(?:抉择|选择|选项|分支|路线|结局|节点|肉鸽|choice|option|decision|route|branch)/i;


const FILL_IN_CHOICE_PLACEHOLDER_RE = /(?:[_＿]{3,}|…{2,}|\.\.\.{1,}|待填|填空|请填|blank|fill[\s_-]*in)/i;

const FILL_IN_CHOICE_HINT_RE = /(?:选项|候选|可选|答案|option|choice).{0,40}(?:待填|可选|选择|choose|fill)?/i;

const FILL_IN_CHOICE_CONTEXT_RE = /(?:填空|待填|候选|选项|答案|行为碎片|fill[\s_-]*in|blank|choice|option)/i;


const STRUCTURED_STATIC_DISCLOSURE_INTENT_RE = /(?:点击|点按|轻触|展开|收起|折叠|打开|关闭|查看(?:详情|全文|内容)?|更多|显示|隐藏|切换|揭示|翻开|展开阅读|tap|click|expand|collapse|toggle|open|close|view\s+(?:more|details)|show|hide|reveal)/i;

const STRUCTURED_STATIC_DISCLOSURE_CLASS_RE = /(?:accordion|collapse|collapsible|disclosure|toggle|expander|fold|drawer|spoiler|reveal|expandable)/i;


const MAINTENANCE_PERSISTED_REPAIR_ATTR = 'data-rabbit-mirror-maintenance-persisted-layout';

const INERT_ACTION_BUTTON_TEXT_RE = /(?:确认|提交|下注|买定离手|继续|下一步|开始|启动|执行|打开|查看|领取|解锁|发送|保存|进入|揭示|抽取|投票|选择|决定|叩谢|拜谢|谢神|参拜|叩拜|礼拜|合掌|祈愿|祈福|还愿|上香|奉纳|致谢|道谢|感谢|confirm|submit|continue|next|start|launch|execute|open|view|claim|unlock|send|save|enter|reveal|draw|vote|choose|bet|place\s+bet|pray|worship|give\s+thanks|offer\s+thanks)/i;

const INERT_ACTION_RITUAL_TEXT_RE = /(?:叩谢|拜谢|谢神|参拜|叩拜|礼拜|合掌|祈愿|祈福|还愿|上香|奉纳|致谢|道谢|感谢|pray|worship|give\s+thanks|offer\s+thanks)/i;

let inertActionStatusCounter = 0;


function selectionOnlyFallbackLabelText(input) {
    const label = input?.closest?.('label');
    const text = diagnosticCompactText(label?.textContent || input?.value || input?.id || '该选项', 120);
    return text || '该选项';
}


function lowestCommonElementAncestor(elements, boundary) {
    const list = (elements || []).filter(Boolean);
    if (!list.length) return null;
    let node = list[0];
    while (node && node !== boundary) {
        if (list.every(element => node.contains?.(element))) return node;
        node = node.parentElement;
    }
    return boundary && list.every(element => boundary.contains?.(element)) ? boundary : null;
}


function nextSelectionOnlyContentRegion(groupContainer, root) {
    let current = groupContainer;
    while (current && current !== root) {
        let sibling = current.nextElementSibling;
        while (sibling) {
            const tag = String(sibling.tagName || '').toLowerCase();
            const text = String(sibling.textContent || '').replace(/\s+/g, ' ').trim();
            if (!['style', 'script', 'br'].includes(tag)
                && !(tag === 'p' && !text)
                && !diagnosticIsInternalUiNode(sibling)
                && !sibling.matches?.(`[${SELECTION_ONLY_PLACEHOLDER_ATTR}]`)) {
                const hasControls = !!sibling.querySelector?.('input, select, textarea, button, label');
                if (!hasControls && text.length >= 60) return sibling;
                break;
            }
            sibling = sibling.nextElementSibling;
        }
        current = current.parentElement;
    }
    return null;
}



function maintenanceElementLooksClickable(element) {
    if (!element) return false;
    const inlineCursor = String(element.style?.getPropertyValue?.('cursor') || '').trim().toLowerCase();
    const computedCursor = String(diagnosticComputedStyle(element)?.cursor || '').trim().toLowerCase();
    return inlineCursor === 'pointer'
        || computedCursor === 'pointer'
        || element.getAttribute?.('role') === 'button'
        || element.hasAttribute?.('tabindex');
}


export function findDisabledOnlyChoiceGroupCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const groups = new Map();
    for (const input of diagnosticQueryContentAll(root, 'input[type="radio"][name]')) {
        const name = String(input.name || '').trim();
        if (!name) continue;
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(input);
    }

    const candidates = [];
    for (const inputs of groups.values()) {
        if (inputs.length < 2 || !inputs.every(input => input.disabled)) continue;
        const labels = inputs.map(input => diagnosticFindAssociatedLabel(root, input)).filter(Boolean);
        if (labels.length !== inputs.length || !labels.some(maintenanceElementLooksClickable)) continue;
        const groupContainer = lowestCommonElementAncestor(labels, root);
        if (!groupContainer || groupContainer === root || groupContainer.hasAttribute?.(DISABLED_ONLY_CHOICE_RESCUE_ATTR)) continue;
        if (groupContainer.getAttribute?.('aria-disabled') === 'true') continue;
        candidates.push({ inputs, labels, groupContainer });
    }
    return candidates;
}


export function installDisabledOnlyChoiceFallback(root) {
    let installed = 0;
    for (const candidate of findDisabledOnlyChoiceGroupCandidates(root)) {
        for (const input of candidate.inputs) {
            input.setAttribute(DISABLED_ONLY_CHOICE_CONTROL_ATTR, 'true');
            input.disabled = false;
        }
        candidate.groupContainer.setAttribute(DISABLED_ONLY_CHOICE_RESCUE_ATTR, 'true');
        candidate.groupContainer.dataset.rabbitMirrorDisabledChoiceCount = String(candidate.inputs.length);
        installed += 1;
    }
    if (installed > 0) root.dataset.rabbitMirrorDisabledChoiceFallback = String(installed);
    return installed;
}



function staticChoiceCardTitle(element) {
    if (!element?.querySelector) return '';
    const title = element.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > header, :scope > strong, :scope > b');
    return diagnosticCompactText(title?.textContent || element.textContent || '', 160);
}


function staticChoiceCardHasRealControl(element) {
    if (!element?.querySelector) return false;
    return !!element.querySelector('button, input, select, textarea, a[href], label, details, summary, [popovertarget], [commandfor], [contenteditable="true"]');
}


function staticChoiceCardLooksEligible(element) {
    if (!element || diagnosticIsInternalUiNode(element) || staticChoiceCardHasRealControl(element)) return false;
    const tag = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|section|article|li|figure)$/.test(tag)) return false;
    if (!maintenanceElementLooksClickable(element)) return false;
    const text = diagnosticCompactText(element.textContent || '', 1600);
    if (text.length < 18 || text.length > 1500) return false;
    return STATIC_CHOICE_TITLE_RE.test(staticChoiceCardTitle(element));
}


export function findStaticChoiceSelectionCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const candidates = [];
    const managedGroups = new Set((staticChoiceSelectionRescueStates.get(root)?.entries || []).map(entry => entry.group));
    for (const group of diagnosticQueryContentAll(root, 'div, section, article, main, ul, ol')) {
        if (managedGroups.has(group)) continue;
        const managedAncestor = group.parentElement?.closest?.(`[${STATIC_CHOICE_SELECTION_RESCUE_ATTR}]`);
        if (managedAncestor && managedGroups.has(managedAncestor)) continue;
        if (group.querySelector?.('input, button, select, textarea, details, summary, [popovertarget], [commandfor]')) continue;

        const children = [...(group.children || [])]
            .filter(child => !/^(?:style|script|template|br)$/i.test(String(child.tagName || '')));
        if (children.length < 2 || children.length > 8) continue;
        if (!children.every(staticChoiceCardLooksEligible)) continue;

        const style = diagnosticComputedStyle(group);
        const display = String(style?.display || group.style?.display || '').toLowerCase();
        if (!/(?:grid|flex)/.test(display)) continue;

        const contextText = diagnosticCompactText(`${group.previousElementSibling?.textContent || ''} ${group.parentElement?.textContent || ''}`, 1200);
        const titles = children.map(staticChoiceCardTitle);
        if (!titles.every(title => STATIC_CHOICE_TITLE_RE.test(title))) continue;
        if (!STATIC_CHOICE_CONTEXT_RE.test(contextText) && children.length < 3) continue;

        candidates.push({ group, items: children, titles });
    }
    return candidates;
}


function ensureStaticChoiceSelectionStyle(root) {
    let style = root.querySelector?.(`style[${STATIC_CHOICE_SELECTION_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(STATIC_CHOICE_SELECTION_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `
[${STATIC_CHOICE_SELECTION_RESCUE_ATTR}] [${STATIC_CHOICE_SELECTION_ITEM_ATTR}] { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
[${STATIC_CHOICE_SELECTION_RESCUE_ATTR}="active"] [${STATIC_CHOICE_SELECTION_ITEM_ATTR}]:not([${STATIC_CHOICE_SELECTION_SELECTED_ATTR}="true"]) { opacity: .72 !important; }
[${STATIC_CHOICE_SELECTION_ITEM_ATTR}="true"][${STATIC_CHOICE_SELECTION_SELECTED_ATTR}="true"] { outline: 2px solid currentColor !important; outline-offset: 2px !important; }
`;
}


function applyStaticChoiceSelectionState(entry, selectedItem = null) {
    if (!entry?.group) return;
    entry.selectedItem = selectedItem && entry.items.includes(selectedItem) ? selectedItem : null;
    entry.group.setAttribute(STATIC_CHOICE_SELECTION_RESCUE_ATTR, entry.selectedItem ? 'active' : 'true');
    for (const item of entry.items) {
        const selected = item === entry.selectedItem;
        item.setAttribute(STATIC_CHOICE_SELECTION_SELECTED_ATTR, selected ? 'true' : 'false');
        item.setAttribute('aria-checked', selected ? 'true' : 'false');
    }
}


export function installStaticChoiceSelectionFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const candidates = findStaticChoiceSelectionCandidates(root);
    if (!candidates.length) return Number.parseInt(root.getAttribute?.(STATIC_CHOICE_SELECTION_COUNT_ATTR) || '0', 10) || 0;

    ensureStaticChoiceSelectionStyle(root);
    let state = staticChoiceSelectionRescueStates.get(root);
    if (!state) {
        state = { entries: [] };
        staticChoiceSelectionRescueStates.set(root, state);
    }

    let installed = 0;
    for (const candidate of candidates) {
        const rememberedSelectedItem = candidate.items.find(item => item.getAttribute?.(STATIC_CHOICE_SELECTION_SELECTED_ATTR) === 'true') || null;
        const entry = { ...candidate, selectedItem: rememberedSelectedItem };
        candidate.group.setAttribute(STATIC_CHOICE_SELECTION_RESCUE_ATTR, rememberedSelectedItem ? 'active' : 'true');
        candidate.group.setAttribute('role', 'radiogroup');
        candidate.group.setAttribute('aria-label', '抉择选项');

        for (const [index, item] of candidate.items.entries()) {
            item.setAttribute(STATIC_CHOICE_SELECTION_ITEM_ATTR, 'true');
            item.setAttribute(STATIC_CHOICE_SELECTION_SELECTED_ATTR, 'false');
            item.setAttribute('role', 'radio');
            item.setAttribute('aria-checked', 'false');
            item.setAttribute('aria-label', candidate.titles[index] || `选项 ${index + 1}`);
            if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');

            const activate = event => {
                if (event?.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
                if (event?.type === 'keydown') event.preventDefault();
                if (event?.type === 'click' && event.target?.closest?.('a,button,input,select,textarea,label,summary')) return;
                const next = entry.selectedItem === item ? null : item;
                applyStaticChoiceSelectionState(entry, next);
            };
            item.addEventListener('click', activate, false);
            item.addEventListener('keydown', activate, false);
        }
        state.entries.push(entry);
        applyStaticChoiceSelectionState(entry, rememberedSelectedItem);
        installed += 1;
    }

    const total = new Set([...root.querySelectorAll?.(`[${STATIC_CHOICE_SELECTION_RESCUE_ATTR}]`) || []]).size;
    if (total) root.setAttribute(STATIC_CHOICE_SELECTION_COUNT_ATTR, String(total));
    return installed;
}



function fillInChoiceDirectTextNode(element) {
    if (!element?.childNodes) return null;
    let fallback = null;
    for (const node of element.childNodes) {
        if (node?.nodeType !== 3) continue;
        fallback ||= node;
        if (FILL_IN_CHOICE_PLACEHOLDER_RE.test(String(node.nodeValue || ''))) return node;
    }
    return fallback;
}


function fillInChoiceDirectText(element) {
    if (!element?.childNodes) return '';
    return [...element.childNodes]
        .filter(node => node?.nodeType === 3)
        .map(node => String(node.nodeValue || ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}


function fillInChoiceExtractCodes(value) {
    const raw = String(value || '').toUpperCase().replace(/／/g, '/');
    const found = [];
    const add = code => {
        const clean = String(code || '').trim().toUpperCase();
        if (!/^[A-Z0-9]{1,3}$/.test(clean) || found.includes(clean)) return;
        found.push(clean);
    };
    for (const match of raw.matchAll(/\[\s*([A-Z0-9]{1,3})\s*\]/g)) add(match[1]);
    const stripped = raw
        .replace(/(?:选项|候选|可选|答案|OPTION|CHOICE|待填|填写|填空|请选择|选择|CHOOSE|FILL\s*IN)/g, ' ')
        .replace(/[()（）【】\[\]]/g, ' ');
    for (const token of stripped.split(/[\/、,，;；|\s]+/)) add(token);
    return found;
}


function fillInChoiceBlankEvidence(element) {
    if (!element || diagnosticIsInternalUiNode(element)) return null;
    const tag = String(element.tagName || '').toLowerCase();
    if (!/^(?:span|div|p|em|strong|b|i|code|small)$/.test(tag)) return null;
    if (element.querySelector?.('button, input, select, textarea, a[href], label, details, summary')) return null;
    const directText = fillInChoiceDirectText(element);
    const semantic = `${element.id || ''} ${getClassTokens(element).join(' ')} ${element.getAttribute?.('title') || ''}`;
    if (!FILL_IN_CHOICE_PLACEHOLDER_RE.test(`${directText} ${semantic}`)) return null;

    let hintNode = null;
    let allowedCodes = [];
    for (const node of element.querySelectorAll?.('*') || []) {
        const hint = diagnosticCompactText(node.textContent || '', 180);
        if (!FILL_IN_CHOICE_HINT_RE.test(hint)) continue;
        const codes = fillInChoiceExtractCodes(hint);
        if (!codes.length) continue;
        hintNode = node;
        allowedCodes = codes;
        break;
    }
    if (!allowedCodes.length) {
        const fallbackHint = `${element.getAttribute?.('aria-label') || ''} ${element.getAttribute?.('title') || ''}`;
        allowedCodes = fillInChoiceExtractCodes(fallbackHint);
    }
    if (!allowedCodes.length) return null;
    const textNode = fillInChoiceDirectTextNode(element);
    if (!textNode) return null;
    return {
        blank: element,
        textNode,
        originalText: String(textNode.nodeValue || ''),
        placeholder: directText || '_______',
        hintNode,
        allowedCodes,
    };
}


function fillInChoiceOptionEvidence(element) {
    if (!element || diagnosticIsInternalUiNode(element)) return null;
    const tag = String(element.tagName || '').toLowerCase();
    if (!/^(?:div|li|p|span|article|section)$/.test(tag)) return null;
    if (element.querySelector?.('button, input, select, textarea, a[href], label, details, summary')) return null;
    const directTag = [...(element.children || [])].find(child => /^\s*\[[A-Z0-9]{1,3}\]\s*$/i.test(String(child.textContent || '')));
    let code = '';
    let tagText = '';
    if (directTag) {
        tagText = String(directTag.textContent || '').trim();
        code = fillInChoiceExtractCodes(tagText)[0] || '';
    } else {
        const directText = fillInChoiceDirectText(element);
        const match = /^\s*\[([A-Z0-9]{1,3})\]\s*/i.exec(directText);
        if (!match) return null;
        code = String(match[1] || '').toUpperCase();
        tagText = match[0];
    }
    if (!code) return null;
    const allText = diagnosticCompactText(element.textContent || '', 240);
    const label = diagnosticCompactText(allText.replace(tagText, ''), 180);
    if (label.length < 2 || label.length > 160) return null;
    const nestedTagged = [...(element.querySelectorAll?.('div, li, p, span, article, section') || [])]
        .filter(node => node !== element && node !== directTag)
        .some(node => {
            const direct = fillInChoiceDirectText(node);
            const total = diagnosticCompactText(node.textContent || '', 220);
            return /^\s*\[[A-Z0-9]{1,3}\]/i.test(direct) && total.replace(direct, '').trim().length >= 2;
        });
    if (nestedTagged) return null;
    return { option: element, code, label };
}


function fillInChoiceHasExistingControl(root) {
    if (!root?.querySelectorAll) return true;
    const outerDetails = root.matches?.('details') ? root : root.querySelector?.(':scope > details');
    const outerSummary = outerDetails?.querySelector?.(':scope > summary') || null;
    return diagnosticQueryContentAll(root, 'button, input:not([type="hidden"]), select, textarea, a[href], label, details, summary, [contenteditable="true"], [popovertarget], [commandfor]')
        .some(element => {
            if (outerSummary && (element === outerSummary || outerSummary.contains?.(element))) return false;
            if (element === outerDetails) return false;
            if (element.matches?.(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`)) return false;
            return true;
        });
}


export function findFillInChoiceCandidates(root) {
    if (!root?.querySelectorAll || fillInChoiceHasExistingControl(root)) return [];
    if (Number.parseInt(root.getAttribute?.(FILL_IN_CHOICE_COUNT_ATTR) || '0', 10) > 0) return [];

    const blanks = diagnosticQueryContentAll(root, 'span, div, p, em, strong, b, i, code, small')
        .map(fillInChoiceBlankEvidence)
        .filter(Boolean)
        .filter(entry => !entry.blank.closest?.(`[${FILL_IN_CHOICE_RESCUE_ATTR}]`));
    if (!blanks.length || blanks.length > 12) return [];

    const options = diagnosticQueryContentAll(root, 'div, li, p, span, article, section')
        .map(fillInChoiceOptionEvidence)
        .filter(Boolean);
    if (options.length < 2 || options.length > 36) return [];

    const optionCodes = new Set(options.map(item => item.code));
    const matchedBlanks = blanks.map(entry => ({
        ...entry,
        allowedCodes: entry.allowedCodes.filter(code => optionCodes.has(code)),
    })).filter(entry => entry.allowedCodes.length > 0);
    if (!matchedBlanks.length) return [];

    const usedCodes = new Set(matchedBlanks.flatMap(entry => entry.allowedCodes));
    const matchedOptions = options.filter(item => usedCodes.has(item.code));
    if (matchedOptions.length < 2) return [];
    const contextText = diagnosticCompactText(root.textContent || '', 2600);
    if (!FILL_IN_CHOICE_CONTEXT_RE.test(contextText)) return [];
    if (matchedBlanks.length === 1 && matchedOptions.length < 2) return [];
    return [{ blanks: matchedBlanks, options: matchedOptions }];
}


function ensureFillInChoiceStyle(root) {
    let style = root.querySelector?.(`style[${FILL_IN_CHOICE_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(FILL_IN_CHOICE_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `
[${FILL_IN_CHOICE_BLANK_ATTR}] { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
[${FILL_IN_CHOICE_BLANK_ATTR}][${FILL_IN_CHOICE_ACTIVE_ATTR}="true"] { outline: 2px solid currentColor !important; outline-offset: 3px !important; }
[${FILL_IN_CHOICE_BLANK_ATTR}][${FILL_IN_CHOICE_FILLED_ATTR}="true"] { font-style: normal !important; min-width: 0 !important; }
[${FILL_IN_CHOICE_OPTION_ATTR}] { cursor: pointer !important; touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: opacity .16s ease, outline-color .16s ease, transform .16s ease; }
[${FILL_IN_CHOICE_RESCUE_ATTR}="active"] [${FILL_IN_CHOICE_OPTION_ATTR}][${FILL_IN_CHOICE_AVAILABLE_ATTR}="false"] { opacity: .34 !important; pointer-events: none !important; }
[${FILL_IN_CHOICE_OPTION_ATTR}][${FILL_IN_CHOICE_SELECTED_ATTR}="true"] { outline: 2px solid currentColor !important; outline-offset: 2px !important; }
[${FILL_IN_CHOICE_OPTION_ATTR}][${FILL_IN_CHOICE_USED_ATTR}="true"] { box-shadow: inset 0 0 0 1px currentColor !important; }
[${FILL_IN_CHOICE_BLANK_ATTR}]:focus-visible, [${FILL_IN_CHOICE_OPTION_ATTR}]:focus-visible { outline: 2px solid currentColor !important; outline-offset: 3px !important; }
`;
}


function fillInChoiceSetBlankText(entry, value) {
    if (!entry?.textNode || !isRabbitMirrorRuntimeTextTarget(entry.textNode)) return;
    entry.textNode.nodeValue = filterRabbitMirrorRuntimeText(value);
}


function applyFillInChoiceState(state) {
    if (!state?.root) return;
    state.root.setAttribute(FILL_IN_CHOICE_RESCUE_ATTR, state.activeEntry ? 'active' : 'true');
    for (const entry of state.entries) {
        const active = state.activeEntry === entry;
        entry.blank.setAttribute(FILL_IN_CHOICE_ACTIVE_ATTR, active ? 'true' : 'false');
        entry.blank.setAttribute(FILL_IN_CHOICE_FILLED_ATTR, entry.selectedCode ? 'true' : 'false');
        if (entry.selectedCode) entry.blank.setAttribute(FILL_IN_CHOICE_CODE_ATTR, entry.selectedCode);
        else entry.blank.removeAttribute(FILL_IN_CHOICE_CODE_ATTR);
        entry.blank.setAttribute('aria-expanded', active ? 'true' : 'false');
        entry.blank.setAttribute('aria-label', entry.selectedLabel
            ? `已填：${entry.selectedLabel}；点击修改，Delete 清除`
            : '待填空；点击后选择现有候选项');
    }
    for (const item of state.options) {
        const available = !state.activeEntry || state.activeEntry.allowedCodes.includes(item.code);
        const selected = !!state.activeEntry && state.activeEntry.selectedCode === item.code;
        const used = state.entries.some(entry => entry.selectedCode === item.code);
        item.option.setAttribute(FILL_IN_CHOICE_AVAILABLE_ATTR, available ? 'true' : 'false');
        item.option.setAttribute(FILL_IN_CHOICE_SELECTED_ATTR, selected ? 'true' : 'false');
        item.option.setAttribute(FILL_IN_CHOICE_USED_ATTR, used ? 'true' : 'false');
        item.option.setAttribute('aria-disabled', available ? 'false' : 'true');
        item.option.setAttribute('aria-selected', selected ? 'true' : 'false');
        item.option.tabIndex = available ? 0 : -1;
    }
}


function fillInChoiceClearEntry(state, entry, { focus = true } = {}) {
    if (!entry) return;
    entry.selectedCode = '';
    entry.selectedLabel = '';
    fillInChoiceSetBlankText(entry, entry.originalText || entry.placeholder || '_______');
    state.activeEntry = null;
    applyFillInChoiceState(state);
    if (focus) entry.blank.focus?.();
}


function fillInChoiceSelectOption(state, entry, optionEntry) {
    if (!entry || !optionEntry || !entry.allowedCodes.includes(optionEntry.code)) return;
    if (entry.selectedCode === optionEntry.code) {
        fillInChoiceClearEntry(state, entry);
        return;
    }
    entry.selectedCode = optionEntry.code;
    entry.selectedLabel = optionEntry.label;
    fillInChoiceSetBlankText(entry, optionEntry.label);
    state.activeEntry = null;
    applyFillInChoiceState(state);
    entry.blank.focus?.();
}


function fillInChoiceEligibleOptions(state) {
    if (!state?.activeEntry) return state?.options || [];
    return state.options.filter(item => state.activeEntry.allowedCodes.includes(item.code));
}


export function installFillInChoiceFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const candidates = findFillInChoiceCandidates(root);
    if (!candidates.length) return Number.parseInt(root.getAttribute?.(FILL_IN_CHOICE_COUNT_ATTR) || '0', 10) || 0;

    ensureFillInChoiceStyle(root);
    let state = fillInChoiceRescueStates.get(root);
    if (!state) {
        state = { root, entries: [], options: [], activeEntry: null };
        fillInChoiceRescueStates.set(root, state);
    }
    let installed = 0;

    for (const candidate of candidates) {
        for (const rawEntry of candidate.blanks) {
            if (state.entries.some(entry => entry.blank === rawEntry.blank)) continue;
            const entry = { ...rawEntry, selectedCode: '', selectedLabel: '' };
            entry.blank.setAttribute(FILL_IN_CHOICE_BLANK_ATTR, 'true');
            entry.blank.setAttribute('role', 'button');
            if (!entry.blank.hasAttribute('tabindex')) entry.blank.tabIndex = 0;
            state.entries.push(entry);
            installed += 1;

            entry.blank.addEventListener('click', event => {
                if (event.target?.closest?.(`[${FILL_IN_CHOICE_OPTION_ATTR}]`)) return;
                state.activeEntry = state.activeEntry === entry ? null : entry;
                applyFillInChoiceState(state);
            }, false);
            entry.blank.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    state.activeEntry = state.activeEntry === entry ? null : entry;
                    applyFillInChoiceState(state);
                    if (state.activeEntry === entry) fillInChoiceEligibleOptions(state)[0]?.option?.focus?.();
                    return;
                }
                if ((event.key === 'Delete' || event.key === 'Backspace') && entry.selectedCode) {
                    event.preventDefault();
                    fillInChoiceClearEntry(state, entry);
                    return;
                }
                if (event.key === 'Escape') {
                    event.preventDefault();
                    state.activeEntry = null;
                    applyFillInChoiceState(state);
                }
            }, false);
        }

        for (const rawOption of candidate.options) {
            if (state.options.some(item => item.option === rawOption.option)) continue;
            const item = { ...rawOption };
            item.option.setAttribute(FILL_IN_CHOICE_OPTION_ATTR, 'true');
            item.option.setAttribute(FILL_IN_CHOICE_CODE_ATTR, item.code);
            item.option.setAttribute('role', 'option');
            if (!item.option.hasAttribute('tabindex')) item.option.tabIndex = 0;
            state.options.push(item);

            const choose = event => {
                if (event?.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
                if (event?.type === 'keydown') event.preventDefault();
                let entry = state.activeEntry;
                if (!entry || !entry.allowedCodes.includes(item.code)) {
                    const eligible = state.entries.filter(candidateEntry => candidateEntry.allowedCodes.includes(item.code));
                    entry = eligible.find(candidateEntry => !candidateEntry.selectedCode) || eligible[0] || null;
                }
                if (!entry) return;
                fillInChoiceSelectOption(state, entry, item);
            };
            item.option.addEventListener('click', choose, false);
            item.option.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    choose(event);
                    return;
                }
                if (event.key === 'Escape') {
                    event.preventDefault();
                    const active = state.activeEntry;
                    state.activeEntry = null;
                    applyFillInChoiceState(state);
                    active?.blank?.focus?.();
                    return;
                }
                const eligible = fillInChoiceEligibleOptions(state);
                const currentIndex = eligible.indexOf(item);
                if (currentIndex < 0) return;
                let nextIndex = currentIndex;
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % eligible.length;
                else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + eligible.length) % eligible.length;
                else if (event.key === 'Home') nextIndex = 0;
                else if (event.key === 'End') nextIndex = eligible.length - 1;
                else return;
                event.preventDefault();
                eligible[nextIndex]?.option?.focus?.();
            }, false);
        }
    }

    if (installed > 0 && !state.outsideListenerInstalled) {
        root.addEventListener('click', event => {
            if (!state.activeEntry) return;
            if (event.target?.closest?.(`[${FILL_IN_CHOICE_BLANK_ATTR}], [${FILL_IN_CHOICE_OPTION_ATTR}]`)) return;
            state.activeEntry = null;
            applyFillInChoiceState(state);
        }, false);
        state.outsideListenerInstalled = true;
    }

    const total = state.entries.length;
    if (total) root.setAttribute(FILL_IN_CHOICE_COUNT_ATTR, String(total));
    applyFillInChoiceState(state);
    return installed;
}



function structuredStaticDisclosureInlineStyle(element) {
    return String(element?.getAttribute?.('style') || '').toLowerCase();
}


function structuredStaticDisclosureFontWeight(element) {
    const style = diagnosticComputedStyle(element);
    const raw = String(style?.fontWeight || element?.style?.fontWeight || '').toLowerCase();
    if (raw === 'bold' || raw === 'bolder') return 700;
    const numeric = Number.parseInt(raw, 10);
    return Number.isFinite(numeric) ? numeric : 400;
}


function structuredStaticDisclosureLooksSegmented(container) {
    if (!container) return false;
    const style = diagnosticComputedStyle(container);
    const inline = structuredStaticDisclosureInlineStyle(container);
    const display = String(style?.display || container.style?.display || '').toLowerCase();
    const className = String(container.className || '').toLowerCase();
    return /(?:grid|flex)/.test(display)
        || /(?:border(?:-|:)|background(?:-|:)|box-shadow\s*:|padding\s*:)/.test(inline)
        || /(?:card|panel|item|entry|row|metric|stat|evidence|record|section|block)/.test(className);
}


function structuredStaticDisclosureTitleLooksExplicit(trigger, container, children) {
    const title = diagnosticCompactText(trigger?.textContent || '', 180);
    if (title.length < 2 || title.length > 120) return false;
    if (/^(?:h[1-6]|legend|dt|th)$/i.test(String(trigger?.tagName || ''))) return true;
    if (structuredStaticDisclosureFontWeight(trigger) >= 600) return true;
    const triggerStyle = diagnosticComputedStyle(trigger);
    const textTransform = String(triggerStyle?.textTransform || trigger?.style?.textTransform || '').toLowerCase();
    const letterSpacing = Number.parseFloat(triggerStyle?.letterSpacing || trigger?.style?.letterSpacing || '0') || 0;
    if (textTransform && textTransform !== 'none') return true;
    if (Math.abs(letterSpacing) >= 0.4) return true;
    const emphasizedDescendant = [...(trigger.querySelectorAll?.('strong, b, h1, h2, h3, h4, h5, h6, [style]') || [])]
        .some(node => /font-weight\s*:\s*(?:bold|[6-9]00)\b/i.test(String(node.getAttribute?.('style') || ''))
            || /^(?:strong|b|h[1-6])$/i.test(String(node.tagName || '')));
    if (emphasizedDescendant) return true;
    if (children.length === 2 && structuredStaticDisclosureFontWeight(children[1]) >= 600) return true;
    return false;
}


function structuredStaticDisclosureBodyLooksMeaningful(bodies) {
    const visibleBodies = bodies.filter(body => {
        const style = diagnosticComputedStyle(body);
        const position = String(style?.position || body?.style?.position || '').toLowerCase();
        const opacity = Number.parseFloat(style?.opacity || body?.style?.opacity || '1');
        return position !== 'absolute' && position !== 'fixed' && !(Number.isFinite(opacity) && opacity <= 0.08);
    });
    if (!visibleBodies.length) return false;
    const textLength = visibleBodies.reduce((sum, body) => sum + diagnosticCompactText(body.textContent || '', 1200).length, 0);
    if (textLength >= 2) return true;
    return visibleBodies.some(body => {
        const inline = structuredStaticDisclosureInlineStyle(body);
        return /(?:background(?:-|:)|border(?:-|:)|height\s*:\s*(?:[2-9]|[1-9]\d))/i.test(inline)
            || !!body.querySelector?.('img, svg, canvas, video, progress, meter');
    });
}


function structuredStaticDisclosureHasExplicitIntent(trigger, container, ignoreGeneratedRescueSemantics = false) {
    if (!trigger || !container) return false;
    const ariaLabel = String(trigger.getAttribute?.('aria-label') || '');
    const generatedLabel = /^展开或收起：/.test(ariaLabel);
    const semanticLabel = ignoreGeneratedRescueSemantics && generatedLabel ? '' : ariaLabel;
    const text = diagnosticCompactText(`${trigger.textContent || ''} ${semanticLabel} ${trigger.getAttribute?.('title') || ''}`, 220);
    if (STRUCTURED_STATIC_DISCLOSURE_INTENT_RE.test(text)) return true;

    const identity = `${trigger.id || ''} ${trigger.className || ''} ${container.id || ''} ${container.className || ''}`;
    if (STRUCTURED_STATIC_DISCLOSURE_CLASS_RE.test(identity)) return true;

    const inline = structuredStaticDisclosureInlineStyle(trigger);
    if (/cursor\s*:\s*pointer\b/i.test(inline)) return true;
    if (trigger.hasAttribute?.('onclick') || trigger.hasAttribute?.('aria-controls')) return true;
    if (!ignoreGeneratedRescueSemantics) {
        const role = String(trigger.getAttribute?.('role') || '').toLowerCase();
        if (role === 'button' || role === 'switch' || role === 'tab') return true;
    }
    return false;
}

// 1.3.52: 与 independentApi 的 MAINTENANCE_PERSISTED_LAYOUT_ATTR 同名，表示这一面镜子的
// 当前 DOM 是用户主动维修并已保存的结果，而不是本轮生成的原始输出。

function rabbitMirrorHasPersistedMaintenanceRepair(root) {
    if (!root?.getAttribute) return false;
    if (root.getAttribute(MAINTENANCE_PERSISTED_REPAIR_ATTR) === 'true') return true;
    const details = root.matches?.('details')
        ? root
        : root.querySelector?.(':scope > details') || root.querySelector?.('details');
    if (details?.getAttribute?.(MAINTENANCE_PERSISTED_REPAIR_ATTR) === 'true') return true;
    return root.closest?.(`[${MAINTENANCE_PERSISTED_REPAIR_ATTR}="true"]`) ? true : false;
}


export function clearOrphanedStructuredStaticDisclosureArtifacts(root) {
    if (!root?.querySelectorAll || structuredStaticDisclosureRescueStates.get(root)?.entries?.length) return 0;
    // 重新挂载的独立 API 外置镜面永远是全新 DOM，WeakMap 必然为空。若该镜面带有维修兔持久化标记，
    // 这些折叠结构是用户明确修出来的，不能当作“旧版本遗留孤儿标记”清掉，
    // 否则 installMaintenanceRabbitForRoot 会在装按钮的同一步就把上一次的维修成果抹掉。
    if (rabbitMirrorHasPersistedMaintenanceRepair(root)) return 0;
    let cleared = 0;
    for (const container of root.querySelectorAll(`[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}]`)) {
        const trigger = container.querySelector?.(`:scope > [${STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR}]`);
        // 新版只撤回缺乏原始交互意图的旧维修结果。明确写有“点击/展开”、组件类名、
        // cursor:pointer、onclick 或 aria-controls 的真实折叠结构继续保留，避免升级时误伤。
        if (trigger && structuredStaticDisclosureHasExplicitIntent(trigger, container, true)) continue;
        if (trigger) {
            const generatedLabel = /^展开或收起：/.test(String(trigger.getAttribute('aria-label') || ''));
            trigger.removeAttribute(STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR);
            // 旧版只有在原元素缺少 aria-label 时才写入这一固定文案；以它作为证据，
            // 避免清理时误删作者本来就设置的 role/tabindex/aria-expanded。
            if (generatedLabel) {
                if (trigger.getAttribute('role') === 'button') trigger.removeAttribute('role');
                if (trigger.getAttribute('tabindex') === '0') trigger.removeAttribute('tabindex');
                trigger.removeAttribute('aria-label');
                trigger.removeAttribute('aria-expanded');
            }
        }
        container.querySelectorAll?.(`:scope > [${STRUCTURED_STATIC_DISCLOSURE_BODY_ATTR}]`)
            ?.forEach(body => body.removeAttribute(STRUCTURED_STATIC_DISCLOSURE_BODY_ATTR));
        container.removeAttribute(STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR);
        container.removeAttribute(STRUCTURED_STATIC_DISCLOSURE_OPEN_ATTR);
        cleared += 1;
    }
    const remaining = root.querySelectorAll(`[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}]`).length;
    if (remaining <= 0) {
        root.querySelector?.(`style[${STRUCTURED_STATIC_DISCLOSURE_STYLE_ATTR}]`)?.remove();
        root.removeAttribute?.(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR);
    } else {
        root.setAttribute?.(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR, String(remaining));
    }
    return cleared;
}


function structuredStaticDisclosureHasExistingInteraction(root) {
    if (!root?.querySelectorAll) return true;
    const outerDetails = root.matches?.('details') ? root : root.querySelector?.(':scope > details');
    const outerSummary = outerDetails?.querySelector?.(':scope > summary') || null;
    const selector = [
        'button', 'input:not([type="hidden"])', 'select', 'textarea', 'a[href]',
        '[role="button"]', '[role="switch"]', '[role="tab"]', '[role="radio"]',
        '[contenteditable="true"]', '[popovertarget]', '[commandfor]', '[tabindex]', 'summary',
    ].join(',');
    return diagnosticQueryContentAll(root, selector).some(element => {
        if (outerSummary && (element === outerSummary || outerSummary.contains?.(element))) return false;
        if (element.matches?.(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`)) return false;
        return true;
    });
}


export function findStructuredStaticDisclosureCandidates(root) {
    if (!root?.querySelectorAll || structuredStaticDisclosureHasExistingInteraction(root)) return [];
    const managed = new Set((structuredStaticDisclosureRescueStates.get(root)?.entries || []).map(entry => entry.container));
    const rawCandidates = [];
    for (const container of diagnosticQueryContentAll(root, 'div, section, article, main, li, dl')) {
        if (managed.has(container) || diagnosticIsInternalUiNode(container)) continue;
        if (container.hasAttribute?.(STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR)) continue;
        if (container.querySelector?.('input, button, select, textarea, details, summary, a[href], [popovertarget], [commandfor], [contenteditable="true"]')) continue;
        const children = [...(container.children || [])]
            .filter(child => !/^(?:style|script|template|br)$/i.test(String(child.tagName || '')))
            .filter(child => !diagnosticIsInternalUiNode(child));
        if (children.length < 2 || children.length > 5) continue;
        if (!structuredStaticDisclosureLooksSegmented(container)) continue;
        const [trigger, ...bodies] = children;
        const inlinePair = children.length === 2 && children.every(child => /^(?:span|small|em|strong|b|i|code)$/i.test(String(child.tagName || '')));
        if (inlinePair && structuredStaticDisclosureFontWeight(children[1]) < 600) continue;
        const triggerStyle = diagnosticComputedStyle(trigger);
        const triggerPosition = String(triggerStyle?.position || trigger?.style?.position || '').toLowerCase();
        const triggerOpacity = Number.parseFloat(triggerStyle?.opacity || trigger?.style?.opacity || '1');
        if (triggerPosition === 'absolute' || triggerPosition === 'fixed') continue;
        if (Number.isFinite(triggerOpacity) && triggerOpacity <= 0.08) continue;
        if (!structuredStaticDisclosureTitleLooksExplicit(trigger, container, children)) continue;
        // 维修兔只能恢复已经表达出来的交互意图，不能把普通卡片、漫画分格或静态信息块
        // 擅自改造成折叠控件。必须存在点击/展开文案、交互语义、cursor:pointer 或明确组件类名。
        if (!structuredStaticDisclosureHasExplicitIntent(trigger, container)) continue;
        if (!structuredStaticDisclosureBodyLooksMeaningful(bodies)) continue;
        const wholeTextLength = diagnosticCompactText(container.textContent || '', 2200).length;
        if (wholeTextLength < 6 || wholeTextLength > 2000) continue;
        rawCandidates.push({ container, trigger, bodies, title: diagnosticCompactText(trigger.textContent || '', 80) });
    }

    // 只保留最内层的明确分段，避免同时把整张镜面和其内部小节都改造成折叠层。
    const leafCandidates = rawCandidates.filter(candidate => !rawCandidates.some(other => (
        other !== candidate && candidate.container.contains?.(other.container)
    )));
    // 单个普通标题正文很可能只是排版，不足以证明模型试图生成可推进结构；至少命中两段才允许维修兔介入。
    if (leafCandidates.length < 2) return [];
    return leafCandidates.slice(0, 12);
}


function ensureStructuredStaticDisclosureStyle(root) {
    let style = root.querySelector?.(`style[${STRUCTURED_STATIC_DISCLOSURE_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(STRUCTURED_STATIC_DISCLOSURE_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `
[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}] > [${STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR}] { cursor: pointer !important; touch-action: manipulation; -webkit-tap-highlight-color: transparent; position: relative; padding-right: max(1.8em, 28px) !important; }
[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}] > [${STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR}]::after { content: '−'; position: absolute; right: .35em; top: 50%; transform: translateY(-50%); font: 700 1em/1 sans-serif; opacity: .66; }
[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}][${STRUCTURED_STATIC_DISCLOSURE_OPEN_ATTR}="false"] > [${STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR}]::after { content: '+'; }
[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}][${STRUCTURED_STATIC_DISCLOSURE_OPEN_ATTR}="false"] > [${STRUCTURED_STATIC_DISCLOSURE_BODY_ATTR}] { display: none !important; }
[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}] > [${STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR}]:focus-visible { outline: 2px solid currentColor !important; outline-offset: 3px !important; }
`;
}


function applyStructuredStaticDisclosureState(entry, open) {
    if (!entry?.container || !entry?.trigger) return;
    entry.open = !!open;
    entry.container.setAttribute(STRUCTURED_STATIC_DISCLOSURE_OPEN_ATTR, entry.open ? 'true' : 'false');
    entry.trigger.setAttribute('aria-expanded', entry.open ? 'true' : 'false');
}


export function installStructuredStaticDisclosureFallback(root) {
    if (!root?.querySelectorAll) return 0;
    // 升级后先撤回旧版本在普通静态分段上留下的内部标记与样式；不触碰原始正文和作者样式。
    clearOrphanedStructuredStaticDisclosureArtifacts(root);
    const candidates = findStructuredStaticDisclosureCandidates(root);
    if (!candidates.length) return Number.parseInt(root.getAttribute?.(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR) || '0', 10) || 0;

    ensureStructuredStaticDisclosureStyle(root);
    let state = structuredStaticDisclosureRescueStates.get(root);
    if (!state) {
        state = { entries: [] };
        structuredStaticDisclosureRescueStates.set(root, state);
    }

    let installed = 0;
    for (const candidate of candidates) {
        if (state.entries.some(entry => entry.container === candidate.container)) continue;
        const entry = { ...candidate, open: true };
        candidate.container.setAttribute(STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR, 'true');
        candidate.trigger.setAttribute(STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR, 'true');
        candidate.trigger.setAttribute('role', 'button');
        if (!candidate.trigger.hasAttribute('tabindex')) candidate.trigger.setAttribute('tabindex', '0');
        if (!candidate.trigger.hasAttribute('aria-label')) {
            candidate.trigger.setAttribute('aria-label', `展开或收起：${candidate.title || '当前内容'}`);
        }
        for (const body of candidate.bodies) body.setAttribute(STRUCTURED_STATIC_DISCLOSURE_BODY_ATTR, 'true');
        state.entries.push(entry);
        applyStructuredStaticDisclosureState(entry, true);

        const activate = event => {
            if (event?.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
            if (event?.type === 'keydown') event.preventDefault();
            if (event?.type === 'click' && event.target?.closest?.('a,button,input,select,textarea,label,summary')) return;
            applyStructuredStaticDisclosureState(entry, !entry.open);
        };
        candidate.trigger.addEventListener('click', activate, false);
        candidate.trigger.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                activate(event);
                return;
            }
            const currentIndex = state.entries.indexOf(entry);
            if (event.key === 'Escape') {
                event.preventDefault();
                for (const item of state.entries) applyStructuredStaticDisclosureState(item, true);
                candidate.trigger.focus?.();
                return;
            }
            let nextIndex = currentIndex;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % state.entries.length;
            else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + state.entries.length) % state.entries.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = state.entries.length - 1;
            else return;
            event.preventDefault();
            state.entries[nextIndex]?.trigger?.focus?.();
        }, false);
        installed += 1;
    }

    const total = new Set([...root.querySelectorAll?.(`[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}]`) || []]).size;
    if (total) root.setAttribute(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR, String(total));
    return installed;
}


function inertActionStatusMessage(button) {
    const rawLabel = diagnosticCompactText(button?.textContent || button?.getAttribute?.('aria-label') || '', 80)
        .replace(/[。！？!?]+$/g, '')
        .trim();
    const label = rawLabel || '当前操作';
    if (INERT_ACTION_RITUAL_TEXT_RE.test(label)) {
        return `“${label}”状态已记录。原始输出没有提供额外结果；再次点击可撤回。`;
    }
    return `“${label}”已记录。原始输出没有提供对应的后续结果内容；再次点击可撤回。`;
}


function buttonHasKnownInteractionRoute(button, root) {
    if (!button || !root) return true;
    if (diagnosticIsInternalUiNode(button) || button.closest?.('summary, form, label')) return true;
    if (button.disabled) return true;
    if (button.hasAttribute?.('onclick') || button.hasAttribute?.('onchange') || button.hasAttribute?.('oninput')) return true;
    if (button.hasAttribute?.('popovertarget') || button.hasAttribute?.('commandfor') || button.hasAttribute?.('formaction')) return true;
    if (button.hasAttribute?.('aria-controls')) {
        const targetId = String(button.getAttribute('aria-controls') || '').trim();
        if (targetId && root.querySelector?.(`#${escapeCssIdentifier(targetId)}`)) return true;
    }
    const rescueAttrs = [
        RENDERED_BUTTON_ADJACENT_HIDDEN_RESCUE_ATTR,
        RENDERED_CLICKABLE_ADJACENT_HIDDEN_RESCUE_ATTR,
        RENDERED_CLICKABLE_ADJACENT_POPUP_RESCUE_ATTR,
        RENDERED_CSS_STATE_SIBLING_RESCUE_ATTR,
        DIRECT_ID_CLICK_RESCUE_ATTR,
        DIRECT_ID_CLASS_STATE_RESCUE_ATTR,
        RAW_SELF_MUTATION_RESCUE_ATTR,
        INLINE_PSEUDO_RESCUE_ATTR,
        HINTED_PSEUDO_RESCUE_ATTR,
        INERT_ACTION_BUTTON_RESCUE_ATTR,
    ];
    if (rescueAttrs.some(attribute => button.hasAttribute?.(attribute))) return true;
    if (findRenderedButtonAdjacentHiddenTarget(button)
        || findRenderedClickableAdjacentHiddenTarget(button)
        || findRenderedClickableAdjacentPopupTarget(button)) return true;
    return false;
}


export function findInertActionButtonCandidates(root) {
    if (!root?.querySelectorAll) return [];
    return diagnosticQueryContentAll(root, 'button').filter(button => {
        if (buttonHasKnownInteractionRoute(button, root)) return false;
        const text = diagnosticCompactText(button.textContent || button.getAttribute?.('aria-label') || '', 180);
        return text.length >= 2 && INERT_ACTION_BUTTON_TEXT_RE.test(text);
    });
}


export function installInertActionButtonFallback(root) {
    let installed = 0;
    for (const button of findInertActionButtonCandidates(root)) {
        const status = document.createElement('div');
        status.setAttribute(INERT_ACTION_STATUS_ATTR, 'true');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.id = `rm-inert-action-status-${(++inertActionStatusCounter).toString(36)}`;
        status.hidden = true;
        status.style.cssText = 'display:none;box-sizing:border-box;width:100%;margin-top:10px;padding:10px 12px;border:1px dashed currentColor;border-radius:6px;font-size:13px;line-height:1.55;opacity:.8;';
        status.textContent = inertActionStatusMessage(button);
        button.insertAdjacentElement('afterend', status);

        const describedBy = String(button.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (!describedBy.includes(status.id)) describedBy.push(status.id);
        button.setAttribute('aria-describedby', describedBy.join(' '));

        let active = false;
        const render = () => {
            status.hidden = !active;
            status.style.display = active ? 'block' : 'none';
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
            button.dataset.rabbitMirrorInertActionActive = active ? 'true' : 'false';
        };
        button.addEventListener('click', event => {
            event.preventDefault();
            active = !active;
            render();
        }, false);
        button.setAttribute(INERT_ACTION_BUTTON_RESCUE_ATTR, 'true');
        render();
        installed += 1;
    }
    if (installed > 0) root.dataset.rabbitMirrorInertActionFallback = String(installed);
    return installed;
}


export function findSelectionOnlyRadioFallbackCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const groups = new Map();
    for (const input of diagnosticQueryContentAll(root, 'input[type="radio"]')) {
        const name = String(input.name || '').trim();
        if (!name) continue;
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(input);
    }

    const candidates = [];
    for (const inputs of groups.values()) {
        if (inputs.length < 2) continue;
        // 已由跨容器 :has() 状态桥接恢复真实分支内容，不得再误判成“只有选中样式”。
        if (inputs.some(input => input.hasAttribute?.(DETACHED_CHECKED_HAS_CONTROL_ATTR))) continue;
        const labels = inputs.map(input => input.closest?.('label')).filter(Boolean);
        if (labels.length !== inputs.length) continue;
        const groupContainer = lowestCommonElementAncestor(labels, root);
        if (!groupContainer || groupContainer === root || groupContainer.hasAttribute?.(SELECTION_ONLY_FALLBACK_ATTR)) continue;

        const checkedInput = inputs.find(input => input.checked) || null;
        const nearbyContentRegion = nextSelectionOnlyContentRegion(groupContainer, root);
        // 只有确实存在默认选中项时，才能把后续正文安全视为该默认分支。
        // 若没有默认项或根本没有后续正文，只建立“已选择但原文无结果”的状态提示，不擅自隐藏任何现有内容。
        const mode = nearbyContentRegion && checkedInput ? 'content-region' : 'status-only';
        candidates.push({
            inputs,
            labels,
            groupContainer,
            contentRegion: mode === 'content-region' ? nearbyContentRegion : null,
            defaultInput: mode === 'content-region' ? checkedInput : null,
            mode,
        });
    }
    return candidates;
}


export function installSelectionOnlyStateFallback(root) {
    if (!root?.querySelectorAll) return 0;
    const checkedDepth = maintenanceCheckedInteractionDepth(root);
    const forcedDisabledChoiceGroup = !!root.querySelector?.(`[${DISABLED_ONLY_CHOICE_RESCUE_ATTR}]`);
    if (!checkedDepth.checkedSelectionOnly && !forcedDisabledChoiceGroup) return 0;
    let installed = 0;
    for (const candidate of findSelectionOnlyRadioFallbackCandidates(root)) {
        const { inputs, groupContainer, contentRegion, defaultInput, mode } = candidate;
        const placeholder = document.createElement('div');
        placeholder.setAttribute(SELECTION_ONLY_PLACEHOLDER_ATTR, 'true');
        placeholder.setAttribute('role', 'status');
        placeholder.setAttribute('aria-live', 'polite');
        placeholder.hidden = true;
        placeholder.style.cssText = 'box-sizing:border-box;width:100%;padding:16px;border:1px dashed currentColor;border-radius:6px;line-height:1.6;opacity:.82;';
        const title = document.createElement('div');
        title.style.cssText = 'font-weight:700;margin-bottom:6px;';
        const note = document.createElement('div');
        note.style.cssText = 'font-size:13px;opacity:.78;';
        placeholder.append(title, note);

        if (mode === 'content-region' && contentRegion) {
            note.textContent = '原始输出未提供此选项的对应内容。切回默认选项可查看已保留内容。';
            contentRegion.insertAdjacentElement('afterend', placeholder);
            contentRegion.setAttribute(SELECTION_ONLY_SOURCE_ATTR, 'true');
        } else {
            note.textContent = '原始输出只提供了选中样式，没有对应的结果内容。可继续切换其他选项，维修兔不会代写缺失剧情。';
            groupContainer.insertAdjacentElement('afterend', placeholder);
        }

        const originalDisplay = contentRegion?.style?.getPropertyValue?.('display') || '';
        const originalPriority = contentRegion?.style?.getPropertyPriority?.('display') || '';
        const render = () => {
            const selected = inputs.find(input => input.checked) || null;
            if (mode === 'content-region' && contentRegion && defaultInput) {
                const showOriginal = !selected || selected === defaultInput;
                if (showOriginal) {
                    if (originalDisplay) contentRegion.style.setProperty('display', originalDisplay, originalPriority);
                    else contentRegion.style.removeProperty('display');
                    placeholder.hidden = true;
                    placeholder.style.display = 'none';
                } else {
                    contentRegion.style.setProperty('display', 'none', 'important');
                    title.textContent = selectionOnlyFallbackLabelText(selected);
                    placeholder.hidden = false;
                    placeholder.style.display = 'block';
                }
            } else if (selected) {
                title.textContent = selectionOnlyFallbackLabelText(selected);
                placeholder.hidden = false;
                placeholder.style.display = 'block';
            } else {
                placeholder.hidden = true;
                placeholder.style.display = 'none';
            }
            groupContainer.dataset.rabbitMirrorSelectionOnlySelected = String(selected?.id || selected?.value || '');
        };
        const onChange = event => {
            if (!inputs.includes(event.target)) return;
            render();
        };
        groupContainer.addEventListener('change', onChange, false);
        groupContainer.setAttribute(SELECTION_ONLY_FALLBACK_ATTR, mode);
        render();
        installed += 1;
    }
    if (installed > 0) {
        const capabilities = detectInteractionCapabilities(root);
        capabilities.selectionFallback = true;
        interactionCapabilityStates.set(root, capabilities);
        root.dataset.rabbitMirrorInteractionRoutes = Object.entries(capabilities)
            .filter(([, enabled]) => enabled)
            .map(([name]) => name)
            .join(',') || 'none';
    }
    return installed;
}


function rehydrateStaticChoiceSelectionRepair(root) {
    if (!root?.querySelectorAll) return 0;
    const existing = staticChoiceSelectionRescueStates.get(root);
    if (existing?.entries?.length) return 0;
    const groups = [...root.querySelectorAll(`[${STATIC_CHOICE_SELECTION_RESCUE_ATTR}]`)];
    if (!groups.length) return 0;
    ensureStaticChoiceSelectionStyle(root);
    const state = { entries: [] };
    staticChoiceSelectionRescueStates.set(root, state);
    let rebound = 0;
    for (const group of groups) {
        const items = [...(group.children || [])].filter(item => item.hasAttribute?.(STATIC_CHOICE_SELECTION_ITEM_ATTR));
        if (items.length < 2) continue;
        const titles = items.map(staticChoiceCardTitle);
        const entry = { group, items, titles, selectedItem: null };
        group.setAttribute(STATIC_CHOICE_SELECTION_RESCUE_ATTR, 'true');
        group.setAttribute('role', 'radiogroup');
        if (!group.hasAttribute('aria-label')) group.setAttribute('aria-label', '抉择选项');
        for (const [index, item] of items.entries()) {
            item.setAttribute(STATIC_CHOICE_SELECTION_ITEM_ATTR, 'true');
            item.setAttribute(STATIC_CHOICE_SELECTION_SELECTED_ATTR, 'false');
            item.setAttribute('role', 'radio');
            item.setAttribute('aria-checked', 'false');
            if (!item.hasAttribute('aria-label')) item.setAttribute('aria-label', titles[index] || `选项 ${index + 1}`);
            if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
            const activate = event => {
                if (event?.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
                if (event?.type === 'keydown') event.preventDefault();
                if (event?.type === 'click' && event.target?.closest?.('a,button,input,select,textarea,label,summary')) return;
                const next = entry.selectedItem === item ? null : item;
                applyStaticChoiceSelectionState(entry, next);
            };
            item.addEventListener('click', activate, false);
            item.addEventListener('keydown', activate, false);
        }
        state.entries.push(entry);
        applyStaticChoiceSelectionState(entry, null);
        rebound += 1;
    }
    if (state.entries.length) root.setAttribute(STATIC_CHOICE_SELECTION_COUNT_ATTR, String(state.entries.length));
    else staticChoiceSelectionRescueStates.delete(root);
    return rebound;
}


function rehydrateStructuredStaticDisclosureRepair(root) {
    if (!root?.querySelectorAll) return 0;
    const existing = structuredStaticDisclosureRescueStates.get(root);
    if (existing?.entries?.length) return 0;
    const containers = [...root.querySelectorAll(`[${STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR}]`)];
    if (!containers.length) return 0;
    ensureStructuredStaticDisclosureStyle(root);
    const state = { entries: [] };
    structuredStaticDisclosureRescueStates.set(root, state);
    let rebound = 0;
    for (const container of containers) {
        const trigger = container.querySelector?.(`:scope > [${STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR}]`);
        const bodies = [...(container.querySelectorAll?.(`:scope > [${STRUCTURED_STATIC_DISCLOSURE_BODY_ATTR}]`) || [])];
        if (!trigger || !bodies.length) continue;
        const entry = {
            container,
            trigger,
            bodies,
            title: diagnosticCompactText(trigger.textContent || '', 80),
            open: true,
        };
        container.setAttribute(STRUCTURED_STATIC_DISCLOSURE_RESCUE_ATTR, 'true');
        trigger.setAttribute(STRUCTURED_STATIC_DISCLOSURE_TRIGGER_ATTR, 'true');
        trigger.setAttribute('role', 'button');
        if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0');
        if (!trigger.hasAttribute('aria-label')) trigger.setAttribute('aria-label', `展开或收起：${entry.title || '当前内容'}`);
        state.entries.push(entry);
        applyStructuredStaticDisclosureState(entry, true);
        const activate = event => {
            if (event?.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
            if (event?.type === 'keydown') event.preventDefault();
            if (event?.type === 'click' && event.target?.closest?.('a,button,input,select,textarea,label,summary')) return;
            applyStructuredStaticDisclosureState(entry, !entry.open);
        };
        trigger.addEventListener('click', activate, false);
        trigger.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                activate(event);
                return;
            }
            const currentIndex = state.entries.indexOf(entry);
            if (event.key === 'Escape') {
                event.preventDefault();
                for (const item of state.entries) applyStructuredStaticDisclosureState(item, true);
                trigger.focus?.();
                return;
            }
            let nextIndex = currentIndex;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % state.entries.length;
            else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + state.entries.length) % state.entries.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = state.entries.length - 1;
            else return;
            event.preventDefault();
            state.entries[nextIndex]?.trigger?.focus?.();
        }, false);
        rebound += 1;
    }
    if (state.entries.length) root.setAttribute(STRUCTURED_STATIC_DISCLOSURE_COUNT_ATTR, String(state.entries.length));
    else structuredStaticDisclosureRescueStates.delete(root);
    return rebound;
}


function rehydrateFillInChoiceRepair(root) {
    if (!root?.querySelectorAll) return 0;
    const existing = fillInChoiceRescueStates.get(root);
    if (existing?.entries?.length || existing?.options?.length) return 0;
    const rawBlanks = [...root.querySelectorAll(`[${FILL_IN_CHOICE_BLANK_ATTR}]`)];
    const rawOptions = [...root.querySelectorAll(`[${FILL_IN_CHOICE_OPTION_ATTR}]`)];
    if (!rawBlanks.length || rawOptions.length < 2) return 0;

    const optionEvidence = rawOptions.map(option => {
        const parsed = fillInChoiceOptionEvidence(option);
        if (parsed) return parsed;
        const code = String(option.getAttribute?.(FILL_IN_CHOICE_CODE_ATTR) || '').trim().toUpperCase();
        if (!code) return null;
        const label = diagnosticCompactText(option.textContent || '', 180).replace(new RegExp(`^\\s*\\[?${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]?\\s*`), '').trim();
        return label ? { option, code, label } : null;
    }).filter(Boolean);
    const optionCodes = new Set(optionEvidence.map(item => item.code));
    const blankEvidence = rawBlanks.map(blank => fillInChoiceBlankEvidence(blank)).filter(Boolean).map(entry => ({
        ...entry,
        allowedCodes: entry.allowedCodes.filter(code => optionCodes.has(code)),
    })).filter(entry => entry.allowedCodes.length);
    if (!blankEvidence.length || optionEvidence.length < 2) return 0;

    ensureFillInChoiceStyle(root);
    const state = { root, entries: [], options: [], activeEntry: null, outsideListenerInstalled: false };
    fillInChoiceRescueStates.set(root, state);
    let rebound = 0;

    for (const rawEntry of blankEvidence) {
        const entry = { ...rawEntry, selectedCode: '', selectedLabel: '' };
        entry.blank.setAttribute(FILL_IN_CHOICE_BLANK_ATTR, 'true');
        entry.blank.removeAttribute(FILL_IN_CHOICE_CODE_ATTR);
        entry.blank.setAttribute('role', 'button');
        if (!entry.blank.hasAttribute('tabindex')) entry.blank.tabIndex = 0;
        state.entries.push(entry);
        rebound += 1;
        entry.blank.addEventListener('click', event => {
            if (event.target?.closest?.(`[${FILL_IN_CHOICE_OPTION_ATTR}]`)) return;
            state.activeEntry = state.activeEntry === entry ? null : entry;
            applyFillInChoiceState(state);
        }, false);
        entry.blank.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                state.activeEntry = state.activeEntry === entry ? null : entry;
                applyFillInChoiceState(state);
                if (state.activeEntry === entry) fillInChoiceEligibleOptions(state)[0]?.option?.focus?.();
                return;
            }
            if ((event.key === 'Delete' || event.key === 'Backspace') && entry.selectedCode) {
                event.preventDefault();
                fillInChoiceClearEntry(state, entry);
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                state.activeEntry = null;
                applyFillInChoiceState(state);
            }
        }, false);
    }

    for (const rawOption of optionEvidence) {
        const item = { ...rawOption };
        item.option.setAttribute(FILL_IN_CHOICE_OPTION_ATTR, 'true');
        item.option.setAttribute(FILL_IN_CHOICE_CODE_ATTR, item.code);
        item.option.setAttribute('role', 'option');
        if (!item.option.hasAttribute('tabindex')) item.option.tabIndex = 0;
        state.options.push(item);
        const choose = event => {
            if (event?.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
            if (event?.type === 'keydown') event.preventDefault();
            let entry = state.activeEntry;
            if (!entry || !entry.allowedCodes.includes(item.code)) {
                const eligible = state.entries.filter(candidateEntry => candidateEntry.allowedCodes.includes(item.code));
                entry = eligible.find(candidateEntry => !candidateEntry.selectedCode) || eligible[0] || null;
            }
            if (!entry) return;
            fillInChoiceSelectOption(state, entry, item);
        };
        item.option.addEventListener('click', choose, false);
        item.option.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                choose(event);
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                const active = state.activeEntry;
                state.activeEntry = null;
                applyFillInChoiceState(state);
                active?.blank?.focus?.();
                return;
            }
            const eligible = fillInChoiceEligibleOptions(state);
            const currentIndex = eligible.indexOf(item);
            if (currentIndex < 0) return;
            let nextIndex = currentIndex;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % eligible.length;
            else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + eligible.length) % eligible.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = eligible.length - 1;
            else return;
            event.preventDefault();
            eligible[nextIndex]?.option?.focus?.();
        }, false);
    }

    if (state.entries.length && state.options.length) {
        root.addEventListener('click', event => {
            if (!state.activeEntry) return;
            if (event.target?.closest?.(`[${FILL_IN_CHOICE_BLANK_ATTR}], [${FILL_IN_CHOICE_OPTION_ATTR}]`)) return;
            state.activeEntry = null;
            applyFillInChoiceState(state);
        }, false);
        state.outsideListenerInstalled = true;
        root.setAttribute(FILL_IN_CHOICE_COUNT_ATTR, String(state.entries.length));
        applyFillInChoiceState(state);
        return rebound;
    }
    fillInChoiceRescueStates.delete(root);
    return 0;
}


export function rehydrateRabbitMirrorMaintenanceRepairs(root) {
    if (!root?.querySelectorAll || !rabbitMirrorHasPersistedMaintenanceRepair(root)) return 0;
    let rebound = 0;
    const run = (label, fn) => {
        try { rebound += Number(fn(root)) || 0; }
        catch (error) { console.debug(`[RabbitMirror] ${label} rehydrate skipped:`, error); }
    };
    run('static choice', rehydrateStaticChoiceSelectionRepair);
    run('structured disclosure', rehydrateStructuredStaticDisclosureRepair);
    run('fill-in choice', rehydrateFillInChoiceRepair);
    return rebound;
}


