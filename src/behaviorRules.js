import { INDEPENDENT_BEHAVIOR_EDITOR_DEFAULT } from '../data/independentBehaviorPatch.js?rmv=1.5.53-cn-boundary1';

export const BEHAVIOR_RULE_MAX_CHARS = 20000;
export const DEFAULT_BEHAVIOR_RULE_TEXT = String(INDEPENDENT_BEHAVIOR_EDITOR_DEFAULT || '').trim();

export function normalizeBehaviorRuleMode(value) {
    return ['always', 'off', 'adult-only'].includes(value) ? value : 'always';
}

// null means the shipped default; an explicit empty string must stay empty.
export function normalizeBehaviorRuleText(value) {
    return value == null ? null : String(value).replace(/\u0000/g, '').slice(0, BEHAVIOR_RULE_MAX_CHARS);
}

export function resolveBehaviorRuleText(settings) {
    const text = normalizeBehaviorRuleText(settings?.behaviorRuleText);
    return text === null ? DEFAULT_BEHAVIOR_RULE_TEXT : text;
}

export function buildBehaviorRuleBlock(settings, combos = []) {
    const mode = normalizeBehaviorRuleMode(settings?.behaviorRuleMode);
    if (mode === 'off') return '';
    const adultFaces = combos.map((combo, index) =>
        [...(combo?.themes || []), ...(combo?.formats || [])].some(item =>
            Array.isArray(item?.tags) && item.tags.some(tag => String(tag).toLowerCase() === 'adult')) ? index + 1 : 0
    ).filter(Boolean);
    if (mode === 'adult-only' && !adultFaces.length) return '';
    const text = resolveBehaviorRuleText(settings).trim();
    if (!text) return '';
    const scope = mode === 'adult-only' && combos.length > 1 ? `（仅第 ${adultFaces.join('、')} 面）` : '';
    return `创作补充规则${scope}：\n${text}`;
}
