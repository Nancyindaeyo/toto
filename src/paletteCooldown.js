import {
    getActivePaletteCooldown,
    getRepeatedPaletteFamily,
} from './storage.js?rmv=1.5.51-narrow1';

const SAFE_PALETTE_LABEL_RE = /^(?:(?:低|中|高)明度)?(?:暖|冷|中性)?(?:红|橙|黄|绿|青|蓝|紫|粉|中性色)?(?:(?:低|中|高)饱和)?$/;

function safePaletteLabel(value) {
    const text = String(value || '').trim();
    return text && text.length <= 24 && SAFE_PALETTE_LABEL_RE.test(text) ? text : '';
}

function boundedInteger(value, min, max) {
    const number = Math.floor(Number(value));
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : min;
}

function normalizedRepeatedPalette() {
    const repeated = getRepeatedPaletteFamily(3, 2);
    const label = safePaletteLabel(repeated?.label);
    if (!repeated || !label) return null;
    return {
        label,
        count: boundedInteger(repeated.count, 2, 3),
        window: boundedInteger(repeated.window, 2, 3),
    };
}

function normalizedDarkCooldown() {
    const dark = getActivePaletteCooldown(5);
    if (!dark?.active) return null;
    return { remaining: boundedInteger(dark.remaining, 1, 5) };
}

export function buildPaletteCooldownExecutionLock() {
    const repeated = normalizedRepeatedPalette();
    const dark = normalizedDarkCooldown();
    return [
        repeated
            ? `重复配色族「${repeated.label}」近 ${repeated.window} 面出现 ${repeated.count} 次，本轮主色相／冷暖／饱和度至少改变一项，不得只调亮暗或替换局部强调色`
            : '',
        dark
            ? `低明度主承载仍在冷却，剩余 ${dark.remaining} 面；本轮禁止再次使用大面积深色背景承载正文`
            : '',
    ].filter(Boolean).join('；');
}

export function buildPaletteCooldownRule() {
    const repeated = normalizedRepeatedPalette();
    const dark = normalizedDarkCooldown();
    if (!repeated && !dark) return '';

    const constraints = [
        repeated ? `重复配色族「${repeated.label}」近 ${repeated.window} 面出现 ${repeated.count} 次：从本轮材质与光线重新推导，主色相／冷暖／饱和度至少改变一项，不得只调明暗或强调色` : '',
        dark ? `低明度主承载仍冷却 ${dark.remaining} 面：主要正文不得继续使用大面积深色底，深色只作局部结构或强调` : '',
    ].filter(Boolean);

    return String.raw`
配色短冷却【只约束实际重复项】:
${constraints.map(item => `  - ${item}。`).join('\n')}
  - 用户明确配色优先；其余部分保持清晰对比，不永久禁色，也不机械轮换固定色板。`;
}
