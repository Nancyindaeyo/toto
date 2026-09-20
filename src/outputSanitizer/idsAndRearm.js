// Split from outputSanitizer.js — idsAndRearm.

import {
    RABBIT_MIRROR_CSS_SCOPE_ATTR,
    escapeCssIdentifier,
    escapeRegExp,
    getRabbitMirrorLocalStyleElements,
    hashInteractionSignature,
} from './runtime.js?rmv=1.5.70';
import {
    CHANGE_PSEUDO_RESCUE_ATTR,
    DIRECT_ID_CLASS_STATE_RESCUE_ATTR,
    DIRECT_ID_CLICK_RESCUE_ATTR,
    HINTED_PSEUDO_RESCUE_ATTR,
    INLINE_PSEUDO_RESCUE_ATTR,
    PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR,
    RAW_HOVER_DECORATION_RESTORE_ATTR,
    RAW_HOVER_PSEUDO_RESCUE_ATTR,
    RAW_NAMED_FUNCTION_RESCUE_ATTR,
    RAW_SCRIPT_TIMELINE_RESCUE_ATTR,
    RAW_SCRIPT_TIMELINE_ROOT_ATTR,
    repairMalformedNestedInteractiveLabels,
    repairRabbitMirrorSelectorPanelGridSpan,
    restoreInteractionInlineOverrides,
} from './checkedStateRescue.js?rmv=1.5.70';
import {
    RAW_SELF_MUTATION_RESCUE_ATTR,
    chooseMatchingRawRabbitMirrorRoot,
    getRawAssistantMessageForRenderedRoot,
} from './scriptedInteractionRescue.js?rmv=1.5.70';
import {
    applyCheckedVisualFallback,
    inputHasMeaningfulCheckedSiblingRule,
    installIntelligentInteractionRescue,
} from './fallbackRescue.js?rmv=1.5.70';
import { INERT_ACTION_BUTTON_RESCUE_ATTR, INERT_ACTION_STATUS_ATTR } from './diagnostics.js?rmv=1.5.70';
import { rehydrateRabbitMirrorMaintenanceRepairs } from './choiceRescue.js?rmv=1.5.70';
import { maintenanceRepairRootBudget } from './maintenanceInspect.js?rmv=1.5.70';

let interactionScopeCounter = 0;

export const interactionScopeStates = new WeakMap();

const SCOPED_INTERACTION_ID_RE = /^(rm-[a-z0-9]+-[a-z0-9]+-[a-z0-9]{5}-)(.+)$/i;

export const RADIO_GROUP_RESCUE_ATTR = 'data-rabbit-mirror-radio-group-rescue';

export const RADIO_GROUP_ROOT_ATTR = 'data-rabbit-mirror-radio-group-count';

const INTERACTION_REFERENCE_ALIAS_REPAIR_ATTR = 'data-rabbit-mirror-interaction-reference-alias-count';

const INTERACTION_REFERENCE_ALIAS_BASELINE_ATTR = 'data-rabbit-mirror-interaction-reference-alias-baseline';

const INTERACTION_RESCUE_MEMORY_KEY = 'rabbitMirrorInteractionRescueMemoryV1';

const rememberedInteractionRescueKeys = new Set();


const firstUseInteractionActivatedRoots = new WeakSet();

export const firstUseInteractionBindings = new WeakMap();


function getInteractionRescueKey(toto) {
    if (!toto?.querySelectorAll) return '';
    const summary = (toto.querySelector('summary')?.textContent || '').replace(/\s+/g, ' ').trim();
    const bodyText = (toto.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 1200);
    const inputs = toto.querySelectorAll('input[type="checkbox"], input[type="radio"]').length;
    const labels = toto.querySelectorAll('label').length;
    return hashInteractionSignature(`${summary}|${inputs}|${labels}|${bodyText}`);
}


function loadRememberedInteractionRescues() {
    if (rememberedInteractionRescueKeys.size) return;
    try {
        const values = JSON.parse(sessionStorage.getItem(INTERACTION_RESCUE_MEMORY_KEY) || '[]');
        if (Array.isArray(values)) values.forEach(value => value && rememberedInteractionRescueKeys.add(String(value)));
    } catch {
        // sessionStorage unavailable; in-memory memory still works.
    }
}


function rememberInteractionRescue(toto) {
    const key = getInteractionRescueKey(toto);
    if (!key) return;
    loadRememberedInteractionRescues();
    rememberedInteractionRescueKeys.add(key);
    try {
        sessionStorage.setItem(INTERACTION_RESCUE_MEMORY_KEY, JSON.stringify([...rememberedInteractionRescueKeys].slice(-300)));
    } catch {
        // Ignore storage failures.
    }
}


function wasInteractionRescued(toto) {
    const key = getInteractionRescueKey(toto);
    if (!key) return false;
    loadRememberedInteractionRescues();
    return rememberedInteractionRescueKeys.has(key);
}


function createInteractionScopePrefix() {
    interactionScopeCounter += 1;
    const timePart = Date.now().toString(36);
    const countPart = interactionScopeCounter.toString(36);
    const randomPart = Math.random().toString(36).slice(2, 7);
    return `rm-${timePart}-${countPart}-${randomPart}-`;
}


function replaceIdReferenceTokens(value, idMap) {
    return String(value || '')
        .split(/\s+/)
        .map(token => idMap.get(token) || token)
        .join(' ');
}


function rewriteCssIdReferences(cssText, idMap) {
    let css = String(cssText || '');
    for (const [oldId, newId] of idMap.entries()) {
        const escaped = escapeRegExp(oldId);
        // 常规 #id 选择器与 CSS/SVG url(#id) 引用。
        css = css
            .replace(new RegExp(`#${escaped}(?![\\w-])`, 'g'), `#${newId}`)
            .replace(new RegExp(`url\\(\\s*(["']?)#${escaped}\\1\\s*\\)`, 'g'), `url(#${newId})`);

        // ID 隔离后，CSS 属性选择器也必须同步。
        // 典型模型输出：#d1:checked ~ label[for="d1"] div。
        // 过去只改写 #d1 与真实 label.for，遗漏了 style 文本中的 [for="d1"]，
        // 导致整条选择器永久失配。这里只处理明确承载 ID 引用的属性。
        for (const attr of ['id', 'for', 'aria-controls', 'aria-labelledby', 'aria-describedby']) {
            css = css.replace(
                new RegExp(`(\\[\\s*${attr}\\s*=\\s*["'])${escaped}(["']\\s*\\])`, 'gi'),
                `$1${newId}$2`,
            );
        }
        for (const attr of ['href', 'xlink\\:href']) {
            css = css.replace(
                new RegExp(`(\\[\\s*${attr}\\s*=\\s*["']#)${escaped}(["']\\s*\\])`, 'gi'),
                `$1${newId}$2`,
            );
        }
    }
    return css;
}


function rewriteSmilIdReferences(value, idMap) {
    let output = String(value || '');
    for (const [oldId, newId] of idMap.entries()) {
        const escaped = escapeRegExp(oldId);
        output = output.replace(new RegExp(`(^|[;\\s])${escaped}(?=\\.)`, 'g'), `$1${newId}`);
    }
    return output;
}



function collectExistingIdReferences(text, existingIds, output) {
    const value = String(text || '');
    // 按 DOM 中真实存在的 ID 精确匹配，避免把 :checked / :hover 等伪类误当成 ID 的一部分。
    for (const id of existingIds) {
        const escaped = escapeRegExp(id);
        if (new RegExp(`#${escaped}(?![\\w-])`).test(value)
            || new RegExp(`url\\(\\s*["']?#${escaped}(?:["']?\\s*)\\)`, 'i').test(value)
            || new RegExp(`\\[\\s*id\\s*=\\s*["']${escaped}["']\\s*\\]`, 'i').test(value)) {
            output.add(id);
        }
    }
}


function collectUrlIdReferences(text, existingIds, output) {
    const pattern = /url\(\s*["']?#([^\s)"']+)/gi;
    let match;
    while ((match = pattern.exec(String(text || '')))) {
        const id = match[1];
        if (existingIds.has(id)) output.add(id);
    }
}


function buildElementsById(toto) {
    const elementsById = new Map();
    toto.querySelectorAll('[id]').forEach(el => {
        const id = String(el.id || '').trim();
        if (!id) return;
        if (!elementsById.has(id)) elementsById.set(id, []);
        elementsById.get(id).push(el);
    });
    return elementsById;
}


function collectCurrentIdsToScope(toto, elementsById, mappedValues = new Set()) {
    const existingIds = new Set(elementsById.keys());
    const idsToScope = new Set();
    const controls = [...toto.querySelectorAll('input[type="checkbox"], input[type="radio"]')];

    controls.forEach(input => {
        const id = String(input.id || '').trim();
        if (id && !mappedValues.has(id)) idsToScope.add(id);
    });

    toto.querySelectorAll('label[for], [href^="#"], [xlink\\:href^="#"], [aria-controls], [aria-labelledby], [aria-describedby]').forEach(el => {
        const forValue = el.getAttribute('for');
        if (forValue && existingIds.has(forValue) && !mappedValues.has(forValue)) idsToScope.add(forValue);
        for (const attr of ['href', 'xlink:href']) {
            const value = el.getAttribute(attr);
            const id = value?.startsWith('#') ? value.slice(1) : '';
            if (id && existingIds.has(id) && !mappedValues.has(id)) idsToScope.add(id);
        }
        for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
            const value = el.getAttribute(attr);
            if (value) value.split(/\s+/).filter(Boolean).forEach(id => {
                if (existingIds.has(id) && !mappedValues.has(id)) idsToScope.add(id);
            });
        }
    });

    getRabbitMirrorLocalStyleElements(toto).forEach(styleEl => {
        collectExistingIdReferences(styleEl.textContent, existingIds, idsToScope);
    });
    toto.querySelectorAll('*').forEach(el => {
        for (const attr of [...(el.attributes || [])]) {
            if (!attr?.value || /^(?:id|class)$/i.test(attr.name)) continue;
            collectUrlIdReferences(attr.value, existingIds, idsToScope);
            if (/^(?:begin|end)$/i.test(attr.name) && attr.value.includes('.')) {
                for (const id of existingIds) {
                    if (!mappedValues.has(id) && new RegExp(`(^|[;\\s])${escapeRegExp(id)}(?=\\.)`).test(attr.value)) idsToScope.add(id);
                }
            }
        }
    });

    return { controls, idsToScope };
}


function normalizeInteractionReferenceAliasToken(token = '') {
    const value = String(token || '').toLowerCase();
    // Generated controls often use interchangeable checkbox-state words between the
    // real input id and the CSS/label reference (for example toggle vs chk). Treat
    // only these narrow control-kind aliases as equivalent; the semantic tail still
    // has to match and augmentInteractionReferenceAliases() still requires a unique
    // best target before any reference is rewritten.
    if (['chk', 'check', 'checkbox', 'cb', 'toggle', 'switch'].includes(value)) return 'toggle';
    if (['rad', 'radio', 'rb'].includes(value)) return 'radio';
    return value;
}


function interactionReferenceAliasTokens(value = '') {
    return String(value || '')
        .toLowerCase()
        .split(/[-_:]+/)
        .filter(Boolean)
        .filter((token, index) => !(index === 0 && token === 'rm'))
        .map(normalizeInteractionReferenceAliasToken);
}


function interactionReferenceAliasScore(referenceId, sourceId) {
    const reference = String(referenceId || '').trim();
    const source = String(sourceId || '').trim();
    if (!reference || !source) return 0;
    if (reference === source) return 1000;
    if (source.endsWith(`-${reference}`)) return 950;
    if (reference.endsWith(`-${source}`)) return 900;

    const refTokens = interactionReferenceAliasTokens(reference);
    const sourceTokens = interactionReferenceAliasTokens(source);
    if (!refTokens.length || !sourceTokens.length) return 0;
    if (refTokens[refTokens.length - 1] !== sourceTokens[sourceTokens.length - 1]) return 0;

    let suffix = 0;
    while (suffix < refTokens.length && suffix < sourceTokens.length
        && refTokens[refTokens.length - 1 - suffix] === sourceTokens[sourceTokens.length - 1 - suffix]) {
        suffix += 1;
    }

    const isSubsequence = (shorter, longer) => {
        let cursor = 0;
        for (const token of longer) {
            if (token === shorter[cursor]) cursor += 1;
            if (cursor >= shorter.length) return true;
        }
        return false;
    };
    const shorter = refTokens.length <= sourceTokens.length ? refTokens : sourceTokens;
    const longer = shorter === refTokens ? sourceTokens : refTokens;
    const subsequence = isSubsequence(shorter, longer);

    // 只接受高置信的“中间漏掉一个命名片段”或“前缀不同但末端语义一致”。
    // 例如模型把 input id="rm-ero-rad-1" 的引用写成 for="rm-rad-1"。
    // 要求至少两个连续尾部 token 一致，并且较短 token 序列是较长序列的子序列；
    // 同时必须唯一命中，避免把 tab-1 误接到其他不相关控件。
    if (suffix < 2 || !subsequence) return 0;
    const distance = Math.abs(refTokens.length - sourceTokens.length);
    if (distance > 2) return 0;
    return 700 + suffix * 20 - distance * 5;
}


function collectBrokenInteractionReferenceIds(toto) {
    const references = new Set();
    if (!toto?.querySelectorAll) return references;

    // A <label for> is direct evidence that the referenced id is meant to be a form
    // control. It is therefore safe to consider a narrow checkbox/radio alias repair.
    toto.querySelectorAll('label[for]').forEach(label => {
        const value = String(label.getAttribute('for') || '').trim();
        if (value) references.add(value);
    });

    // CSS ids are much more ambiguous: a plain #foo may identify a result panel, SVG
    // node, decorative element, etc. 1.4.28 treated every broken #id as a possible
    // control alias, which could redirect a panel's base hide/show rule to an input and
    // leave the real gated content permanently visible. Only collect ids that are
    // provably used as the subject of checkbox/radio state CSS.
    const checkedIdSelector = /#([A-Za-z_-][\w-]*)(?=\s*(?::checked|:not\(\s*:checked\s*\)))/gi;
    const checkedIdAttrSelector = /\[\s*id\s*=\s*["']([^"']+)["']\s*\](?=\s*(?::checked|:not\(\s*:checked\s*\)))/gi;
    getRabbitMirrorLocalStyleElements(toto).forEach(styleEl => {
        const css = String(styleEl.textContent || '');
        for (const match of css.matchAll(checkedIdSelector)) {
            const value = String(match[1] || '').trim();
            if (value) references.add(value);
        }
        for (const match of css.matchAll(checkedIdAttrSelector)) {
            const value = String(match[1] || '').trim();
            if (value) references.add(value);
        }
    });
    return references;
}


function interactionReferenceHasPositiveCheckedCssEvidence(toto, referenceId) {
    const id = String(referenceId || '').trim();
    if (!id) return false;
    const escaped = escapeRegExp(id);
    const subject = `(?:#${escaped}|\\[\\s*id\\s*=\\s*["']${escaped}["']\\s*\\])`;
    const pattern = new RegExp(`${subject}\\s*:checked\\b`, 'i');
    return getRabbitMirrorLocalStyleElements(toto).some(styleEl => pattern.test(String(styleEl.textContent || '')));
}


function preserveAliasRepairInitialCheckboxBaseline(toto, referenceId, currentId) {
    if (!interactionReferenceHasPositiveCheckedCssEvidence(toto, referenceId)) return false;
    const input = [...toto.querySelectorAll('input[type="checkbox"]')].find(item => String(item.id || '') === String(currentId || ''));
    if (!input || !input.checked || input.hasAttribute(INTERACTION_REFERENCE_ALIAS_BASELINE_ATTR)) return false;
    // If the real id already had a meaningful checked route before alias repair, its initial
    // checked state was already visible and must remain untouched. Only neutralize a checked
    // checkbox when the *newly repaired* broken selector would introduce a second-layer state
    // that was not visible before the repair. This keeps repair state-preserving.
    if (inputHasMeaningfulCheckedSiblingRule(toto, input)) return false;
    input.checked = false;
    input.removeAttribute('checked');
    input.setAttribute(INTERACTION_REFERENCE_ALIAS_BASELINE_ATTR, 'unchecked');
    input.setAttribute('aria-pressed', 'false');
    restoreInteractionInlineOverrides(input);
    return true;
}


function augmentInteractionReferenceAliases(toto, idMap) {
    const aliasMap = new Map();
    if (!toto?.querySelectorAll || !idMap?.size) return aliasMap;
    const liveIds = new Set([...toto.querySelectorAll('[id]')].map(el => String(el.id || '').trim()).filter(Boolean));
    const liveControlIds = new Set(
        [...toto.querySelectorAll('input[type="checkbox"], input[type="radio"]')]
            .map(input => String(input.id || '').trim())
            .filter(Boolean),
    );
    const candidateByValue = new Map();
    for (const [sourceId, currentId] of idMap.entries()) {
        const source = String(sourceId || '').trim();
        const current = String(currentId || '').trim();
        if (!source || !current || !liveIds.has(current) || !liveControlIds.has(current)) continue;
        const existing = candidateByValue.get(current);
        if (!existing || source.length > existing.sourceId.length) candidateByValue.set(current, { sourceId: source, currentId: current });
    }
    const candidates = [...candidateByValue.values()];
    if (!candidates.length) return aliasMap;

    for (const referenceId of collectBrokenInteractionReferenceIds(toto)) {
        if (!referenceId || idMap.has(referenceId) || liveIds.has(referenceId)) continue;
        const ranked = candidates
            .map(candidate => ({ ...candidate, score: interactionReferenceAliasScore(referenceId, candidate.sourceId) }))
            .filter(candidate => candidate.score > 0)
            .sort((a, b) => b.score - a.score);
        if (!ranked.length) continue;
        const best = ranked[0];
        const competingValue = ranked.find(candidate => candidate.currentId !== best.currentId && candidate.score >= best.score);
        if (competingValue) continue;
        preserveAliasRepairInitialCheckboxBaseline(toto, referenceId, best.currentId);
        // A guessed control alias is not a real DOM id. Never add it to the global idMap:
        // doing so rewrites unrelated panel/base/SVG selectors and can expose content that
        // was supposed to stay hidden until interaction.
        aliasMap.set(referenceId, best.currentId);
    }
    if (aliasMap.size) toto.setAttribute?.(INTERACTION_REFERENCE_ALIAS_REPAIR_ATTR, String(aliasMap.size));
    else if (!toto.querySelector?.(`label[for]:not([for=""])`)) toto.removeAttribute?.(INTERACTION_REFERENCE_ALIAS_REPAIR_ATTR);
    return aliasMap;
}


function rewriteCssCheckedControlAliasReferences(cssText, aliasMap) {
    let output = String(cssText || '');
    if (!aliasMap?.size || !output) return output;
    for (const [referenceId, currentId] of aliasMap.entries()) {
        const reference = String(referenceId || '').trim();
        const current = String(currentId || '').trim();
        if (!reference || !current) continue;
        const escapedReference = escapeRegExp(reference);
        const checkedLookahead = '(?=\\s*(?::checked\\b|:not\\(\\s*:checked\\s*\\)))';
        output = output.replace(
            new RegExp(`#${escapedReference}${checkedLookahead}`, 'g'),
            `#${current}`,
        );
        output = output.replace(
            new RegExp(`\\[\\s*id\\s*=\\s*(["'])${escapedReference}\\1\\s*\\]${checkedLookahead}`, 'g'),
            (_match, quote) => `[id=${quote}${current}${quote}]`,
        );
    }
    return output;
}


function synchronizeInteractionReferences(toto, idMap, aliasMap = new Map()) {
    if (!idMap?.size && !aliasMap?.size) return;

    toto.querySelectorAll('label[for]').forEach(label => {
        const oldFor = label.getAttribute('for');
        if (idMap.has(oldFor)) label.setAttribute('for', idMap.get(oldFor));
        else if (aliasMap.has(oldFor)) label.setAttribute('for', aliasMap.get(oldFor));
    });

    toto.querySelectorAll('[href^="#"], [xlink\\:href^="#"]').forEach(el => {
        for (const attr of ['href', 'xlink:href']) {
            const value = el.getAttribute(attr);
            if (!value?.startsWith('#')) continue;
            const oldId = value.slice(1);
            if (idMap.has(oldId)) el.setAttribute(attr, `#${idMap.get(oldId)}`);
        }
    });

    for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
        toto.querySelectorAll(`[${attr}]`).forEach(el => {
            el.setAttribute(attr, replaceIdReferenceTokens(el.getAttribute(attr), idMap));
        });
    }

    getRabbitMirrorLocalStyleElements(toto).forEach(styleEl => {
        const currentText = String(styleEl.textContent || '');
        const scopedText = rewriteCssIdReferences(currentText, idMap);
        const rewrittenText = rewriteCssCheckedControlAliasReferences(scopedText, aliasMap);
        if (rewrittenText !== currentText) styleEl.textContent = rewrittenText;
    });

    toto.querySelectorAll('*').forEach(el => {
        for (const attr of [...(el.attributes || [])]) {
            if (!attr?.value) continue;
            if (/url\(\s*["']?#/i.test(attr.value)) {
                el.setAttribute(attr.name, rewriteCssIdReferences(attr.value, idMap));
            } else if (/^(?:begin|end)$/i.test(attr.name) && attr.value.includes('.')) {
                el.setAttribute(attr.name, rewriteSmilIdReferences(attr.value, idMap));
            }
        }
    });
}


function recoverInteractionScopeState(toto) {
    const idMap = new Map();
    let prefix = '';
    toto.querySelectorAll('[id]').forEach(el => {
        const currentId = String(el.id || '').trim();
        const match = currentId.match(SCOPED_INTERACTION_ID_RE);
        if (!match) return;
        prefix ||= match[1];
        if (match[1] === prefix && match[2]) idMap.set(match[2], currentId);
    });
    return idMap.size ? { prefix, idMap } : null;
}


export function inspectSanitizedRadioGroupLoss(root) {
    const empty = { candidateCount: 0, rescuedCount: 0, groups: [] };
    if (!root?.querySelectorAll) return empty;
    const rawMessage = getRawAssistantMessageForRenderedRoot(root);
    const rawRoot = chooseMatchingRawRabbitMirrorRoot(rawMessage, root);
    if (!rawRoot?.querySelectorAll) {
        return {
            ...empty,
            rescuedCount: Number.parseInt(root.getAttribute?.(RADIO_GROUP_ROOT_ATTR) || '0', 10) || 0,
        };
    }

    const rawRadios = [...rawRoot.querySelectorAll('input[type="radio"]')];
    const renderedRadios = [...root.querySelectorAll('input[type="radio"]')];
    if (!rawRadios.length || rawRadios.length !== renderedRadios.length) {
        return {
            ...empty,
            rescuedCount: Number.parseInt(root.getAttribute?.(RADIO_GROUP_ROOT_ATTR) || '0', 10) || 0,
        };
    }

    const groups = new Map();
    rawRadios.forEach((rawInput, index) => {
        const rawName = String(rawInput.getAttribute('name') || '').trim();
        if (!rawName) return;
        if (!groups.has(rawName)) groups.set(rawName, []);
        groups.get(rawName).push({ rawInput, renderedInput: renderedRadios[index] || null });
    });

    const candidates = [];
    for (const [rawName, entries] of groups) {
        if (entries.length < 2 || entries.some(entry => !entry.renderedInput)) continue;
        const renderedNames = entries.map(entry => String(entry.renderedInput.getAttribute('name') || '').trim());
        const sameNonEmptyName = renderedNames.every(name => name && name === renderedNames[0]);
        const rescueMarked = entries.every(entry => entry.renderedInput.hasAttribute(RADIO_GROUP_RESCUE_ATTR));
        const checkedCount = entries.filter(entry => entry.renderedInput.checked).length;
        if (!sameNonEmptyName || !rescueMarked || checkedCount > 1) {
            candidates.push({ rawName, entries, renderedNames, checkedCount });
        }
    }

    return {
        candidateCount: candidates.length,
        rescuedCount: Number.parseInt(root.getAttribute?.(RADIO_GROUP_ROOT_ATTR) || '0', 10) || 0,
        groups: candidates,
    };
}


function restoreSanitizedRadioGroups(root, scopePrefix = '') {
    if (!root?.querySelectorAll) return 0;
    const inspection = inspectSanitizedRadioGroupLoss(root);
    if (!inspection.groups.length) {
        const existing = root.querySelectorAll?.(`[${RADIO_GROUP_RESCUE_ATTR}]`)?.length || 0;
        if (!existing) root.removeAttribute?.(RADIO_GROUP_ROOT_ATTR);
        return Number.parseInt(root.getAttribute?.(RADIO_GROUP_ROOT_ATTR) || '0', 10) || 0;
    }

    for (const group of inspection.groups) {
        const scopedName = `${scopePrefix || ''}${group.rawName}`;
        const groupToken = `g${hashInteractionSignature(scopedName).slice(0, 10)}`;
        const renderedInputs = group.entries.map(entry => entry.renderedInput).filter(Boolean);
        if (renderedInputs.length < 2) continue;

        const checkedInputs = renderedInputs.filter(input => input.checked);
        const focused = renderedInputs.includes(globalThis.document?.activeElement)
            ? globalThis.document.activeElement
            : null;
        const rawDefaultEntry = [...group.entries].reverse().find(entry => entry.rawInput.hasAttribute('checked')) || null;
        let preferred = null;
        if (checkedInputs.length === 1) preferred = checkedInputs[0];
        else if (checkedInputs.length > 1) preferred = focused && focused.checked ? focused : checkedInputs[checkedInputs.length - 1];
        else if (rawDefaultEntry) preferred = rawDefaultEntry.renderedInput;

        for (const input of renderedInputs) {
            if (String(input.getAttribute('name') || '') !== scopedName) {
                input.setAttribute('name', scopedName);
            }
            input.setAttribute(RADIO_GROUP_RESCUE_ATTR, groupToken);
        }

        if (preferred) {
            for (const input of renderedInputs) {
                const shouldCheck = input === preferred;
                input.checked = shouldCheck;
                if (!shouldCheck) restoreInteractionInlineOverrides(input);
            }
            applyCheckedVisualFallback(root, preferred);
        } else {
            for (const input of renderedInputs) {
                input.checked = false;
                restoreInteractionInlineOverrides(input);
            }
        }
    }

    const liveGroups = new Set(
        [...root.querySelectorAll(`[${RADIO_GROUP_RESCUE_ATTR}]`)]
            .map(input => String(input.getAttribute(RADIO_GROUP_RESCUE_ATTR) || ''))
            .filter(Boolean),
    ).size;
    if (liveGroups) root.setAttribute(RADIO_GROUP_ROOT_ATTR, String(liveGroups));
    else root.removeAttribute(RADIO_GROUP_ROOT_ATTR);
    return liveGroups;
}


export function scopeRabbitMirrorInteractionIds(toto, { installRescue = true } = {}) {
    if (!toto?.querySelector) return;

    // Structural validity must be restored before radio grouping or checked fallback reads
    // local ancestry. This is intentionally high-confidence and only promotes repeated
    // sibling-like branches out of an illegally nested label.
    repairMalformedNestedInteractiveLabels(toto);

    // WeakMap 记录同一 DOM 在流式生成期间的映射；旧版本留下的 data 标记则从已加前缀的 ID 中恢复。
    let state = interactionScopeStates.get(toto);
    if (!state && toto.dataset.rabbitMirrorInteractionScoped === 'true') {
        state = recoverInteractionScopeState(toto);
        if (state) interactionScopeStates.set(toto, state);
        else delete toto.dataset.rabbitMirrorInteractionScoped;
    }

    if (!state) {
        state = { prefix: createInteractionScopePrefix(), idMap: new Map() };
        interactionScopeStates.set(toto, state);
    }

    // DOMPurify/宿主可能移除 radio 的 name，原本的单选组会退化成多个可同时 checked 的独立控件。
    // 从同一条消息的原始兔子镜按 radio 顺序恢复组名，并使用当前镜面前缀隔离跨消息碰撞。
    const restoredRadioGroupCount = restoreSanitizedRadioGroups(toto, state.prefix);

    const mappedValues = new Set(state.idMap.values());
    const elementsById = buildElementsById(toto);
    const { controls, idsToScope } = collectCurrentIdsToScope(toto, elementsById, mappedValues);

    // 新到达的交互控件或 SVG/CSS 引用只追加到原映射，不会给已有 ID 再套第二层前缀。
    for (const oldId of idsToScope) {
        if (state.idMap.has(oldId) || mappedValues.has(oldId) || !elementsById.has(oldId)) continue;
        const newId = `${state.prefix}${oldId}`;
        state.idMap.set(oldId, newId);
        mappedValues.add(newId);
        for (const el of elementsById.get(oldId) || []) el.id = newId;
    }

    controls.filter(input => input.type === 'radio' && input.hasAttribute('name')).forEach(input => {
        const name = input.getAttribute('name') || '';
        if (name && !name.startsWith(state.prefix)) input.name = `${state.prefix}${name}`;
    });

    // 模型偶尔让 input 的真实 id 比 label/CSS 引用多一个中间命名片段，
    // 例如 id="rm-ero-rad-1"，却写成 for="rm-rad-1" 与 [id="rm-rad-1"]。
    // 在正式同步前建立唯一、高置信别名；只改引用，不改控件本身。
    const aliasMap = augmentInteractionReferenceAliases(toto, state.idMap);
    synchronizeInteractionReferences(toto, state.idMap, aliasMap);
    if (installRescue) {
        installIntelligentInteractionRescue(toto);
        // Structural Grid result panels are safe to normalize once the scoped ids/labels
        // have been synchronized. This does not depend on viewport size or panel visibility.
        repairRabbitMirrorSelectorPanelGridSpan(toto);
        firstUseInteractionActivatedRoots.add(toto);
    }
    toto.dataset.rabbitMirrorInteractionScoped = 'true';
    return { scopedIdCount: state.idMap.size, radioGroupCount: restoredRadioGroupCount };
}


export function isolateRabbitMirrorInteractionIds(root) {
    return scopeRabbitMirrorInteractionIds(root, { installRescue: false });
}

// Independent external mirrors are parsed outside the normal message render path.
// They still need the same high-confidence interaction rescue routes that are
// normally attached to rendered mirrors; otherwise valid labels can toggle a
// control while malformed cross-parent / one-way CSS remains permanently inert.
// This entry point is intentionally separate from isolateRabbitMirrorInteractionIds()
// so history/serialization callers can keep the no-listener behavior when needed.
// cloneNode()/outerHTML preserve serializable "listener installed" markers but
// never preserve addEventListener handlers. Clear only those runtime markers
// before a detached snapshot or parsed fragment becomes live again; the existing
// safe interaction rescue can then rebuild listeners without weakening sanitization.

export function rearmRabbitMirrorSerializedInteractionRoot(root) {
    if (!root?.querySelectorAll) return 0;
    const listenerMarkers = [
        CHANGE_PSEUDO_RESCUE_ATTR,
        DIRECT_ID_CLICK_RESCUE_ATTR,
        DIRECT_ID_CLASS_STATE_RESCUE_ATTR,
        RAW_NAMED_FUNCTION_RESCUE_ATTR,
        RAW_SCRIPT_TIMELINE_RESCUE_ATTR,
        RAW_HOVER_PSEUDO_RESCUE_ATTR,
        RAW_HOVER_DECORATION_RESTORE_ATTR,
        RAW_SELF_MUTATION_RESCUE_ATTR,
        INLINE_PSEUDO_RESCUE_ATTR,
        HINTED_PSEUDO_RESCUE_ATTR,
        PASSPORT_DOCUMENT_TRIGGER_RESCUE_ATTR,
        INERT_ACTION_BUTTON_RESCUE_ATTR,
    ];
    const selector = listenerMarkers.map(attribute => `[${attribute}]`).join(',');
    const candidates = new Set();
    if (root.matches?.(selector)) candidates.add(root);
    root.querySelectorAll(selector).forEach(node => candidates.add(node));

    let cleared = 0;
    for (const node of candidates) {
        if (node.hasAttribute?.(INERT_ACTION_BUTTON_RESCUE_ATTR)) {
            const describedBy = String(node.getAttribute?.('aria-describedby') || '').split(/\s+/).filter(Boolean);
            const retained = [];
            for (const id of describedBy) {
                const status = node.parentElement?.querySelector?.(`#${escapeCssIdentifier(id)}`);
                if (status?.hasAttribute?.(INERT_ACTION_STATUS_ATTR)) status.remove();
                else retained.push(id);
            }
            if (node.nextElementSibling?.hasAttribute?.(INERT_ACTION_STATUS_ATTR)) node.nextElementSibling.remove();
            if (retained.length) node.setAttribute('aria-describedby', retained.join(' '));
            else node.removeAttribute?.('aria-describedby');
            node.removeAttribute?.('data-rabbit-mirror-inert-action-active');
            node.removeAttribute?.('aria-pressed');
        }
        for (const attribute of listenerMarkers) {
            if (!node.hasAttribute?.(attribute)) continue;
            node.removeAttribute(attribute);
            cleared += 1;
        }
    }
    root.removeAttribute?.(RAW_SCRIPT_TIMELINE_ROOT_ATTR);
    delete root.dataset?.rabbitMirrorRawHoverFallback;
    delete root.dataset?.rabbitMirrorSelfMutationFallback;
    delete root.dataset?.rabbitMirrorInertActionFallback;
    delete root.dataset?.rabbitMirrorTargetFallback;
    return cleared;
}


export function activateRabbitMirrorInteractionRescue(root) {
    return scopeRabbitMirrorInteractionIds(root, { installRescue: true });
}

// Parsing/scoping alone cannot restore safe event programs removed by host sanitization.
// Bind this one live face only when opened; do not scan collapsed history or run the
// manual diagnostic/repair/persistence workflow. A fast first tap can beat the paint
// callback, so capture it before the control's native default action instead of losing it.

export function armRabbitMirrorFirstUseInteraction(root) {
    if (!root?.querySelector || firstUseInteractionActivatedRoots.has(root)) return;
    if (firstUseInteractionBindings.has(root)) return;
    const details = root.matches?.('details') ? root : root.querySelector(':scope > details');
    if (!details) return;
    const state = { scheduled: false, finished: false, frame: 0, timer: 0 };
    firstUseInteractionBindings.set(root, state);
    const cleanup = () => {
        if (state.frame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(state.frame);
        if (state.timer) clearTimeout(state.timer);
        state.frame = 0; state.timer = 0; state.scheduled = false;
        details.removeEventListener('toggle', schedule, false);
        root.removeEventListener('pointerdown', firstTap, true);
        root.removeEventListener('click', firstTap, true);
        root.removeEventListener('keydown', firstKey, true);
    };
    state.dispose = () => {
        state.finished = true;
        cleanup();
        firstUseInteractionBindings.delete(root);
    };
    const initialize = () => {
        if (state.timer) clearTimeout(state.timer);
        state.timer = 0;
        state.scheduled = false;
        if (state.finished || !root.isConnected || !details.open) return;
        state.finished = true;
        cleanup();
        if (firstUseInteractionActivatedRoots.has(root)) return;
        // Existing per-face safety budget is also the first-use ceiling. Oversized
        // or rejected work is not repeatedly scanned by later toggle/click events.
        if (!maintenanceRepairRootBudget(root).ok) return;
        try {
            activateRabbitMirrorInteractionRescue(root);
            rehydrateRabbitMirrorMaintenanceRepairs(root);
        } catch (error) {
            console.debug('[RabbitMirror] first-use interaction initialization skipped:', error);
        }
    };
    function schedule() {
        if (state.finished || state.scheduled || !details.open || !root.isConnected) return;
        state.scheduled = true;
        if (typeof requestAnimationFrame === 'function') state.frame = requestAnimationFrame(() => {
            state.frame = 0;
            if (!state.finished) state.timer = setTimeout(initialize, 0);
        });
        else state.timer = setTimeout(initialize, 0);
    }
    function firstTap(event) {
        const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
        if (!target || details.querySelector(':scope > summary')?.contains(target)) return;
        initialize();
    }
    function firstKey(event) {
        if (['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) firstTap(event);
    }
    details.addEventListener('toggle', schedule, false);
    root.addEventListener('pointerdown', firstTap, true);
    root.addEventListener('click', firstTap, true);
    root.addEventListener('keydown', firstKey, true);
    schedule();
}


function collectScopedClassAliasesForHost(host) {
    if (!host?.querySelectorAll || !host?.getAttribute) return new Map();
    const scopeToken = String(host.getAttribute(RABBIT_MIRROR_CSS_SCOPE_ATTR) || '').trim();
    if (!scopeToken) return new Map();
    const classPrefix = `rmc-${scopeToken.replace(/^rmcss-/i, '')}-`;
    const aliases = new Map();
    const ambiguous = new Set();
    const escapedPrefix = escapeRegExp(classPrefix);
    const classRe = new RegExp(`\\.(${escapedPrefix}[A-Za-z_][\\w-]*)`, 'g');
    for (const style of host.querySelectorAll('style')) {
        const css = String(style.textContent || '');
        classRe.lastIndex = 0;
        let match;
        while ((match = classRe.exec(css))) {
            const mapped = String(match[1] || '');
            const raw = mapped.slice(classPrefix.length);
            if (!raw) continue;
            const previous = aliases.get(raw);
            if (previous && previous !== mapped) ambiguous.add(raw);
            else if (!previous) aliases.set(raw, mapped);
        }
    }
    for (const raw of ambiguous) aliases.delete(raw);
    return aliases;
}


export function repairRabbitMirrorScopedClassAliasesInScope(scope) {
    if (!scope?.querySelectorAll) return 0;
    const hosts = [];
    if (scope.matches?.(`[${RABBIT_MIRROR_CSS_SCOPE_ATTR}]`)) hosts.push(scope);
    for (const host of scope.querySelectorAll(`[${RABBIT_MIRROR_CSS_SCOPE_ATTR}]`)) {
        if (!hosts.includes(host)) hosts.push(host);
    }
    let changed = 0;
    for (const host of hosts) {
        const aliases = collectScopedClassAliasesForHost(host);
        if (!aliases.size) continue;
        const elements = [];
        if (host.hasAttribute?.('class')) elements.push(host);
        for (const element of host.querySelectorAll('[class]')) elements.push(element);
        for (const element of elements) {
            const original = String(element.getAttribute('class') || '').split(/\s+/).filter(Boolean);
            if (!original.length) continue;
            let localChanged = false;
            const rewritten = original.map((token) => {
                const mapped = aliases.get(token);
                if (!mapped || mapped === token) return token;
                localChanged = true;
                return mapped;
            });
            if (!localChanged) continue;
            element.setAttribute('class', [...new Set(rewritten)].join(' '));
            changed += 1;
        }
    }
    return changed;
}

// 1.3.55: 维修兔持久化记录已经带有 rescue 标记、role/tabindex 与 count。
// 不能再次调用普通 install*Fallback() 做“候选重识别”：structured disclosure 会因为
// 已存在 role=button/tabindex 被判定为已有交互，fill-in choice 会因为 count>0 被直接跳过。
// 这里改为只根据“已经保存的维修标记”重建 WeakMap 状态与 listener；没有持久化标记的镜面绝不介入。

