// Split from outputSanitizer.js — markup.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { applyRabbitMirrorBannedWordsToDom } from '../bannedWords.js?rmv=1.5.53-cn-boundary1';
import {
    EXTERNAL_REFERENCE_NOTE_ATTR,
    INTERACTION_HOME_ATTR,
    RABBIT_MIRROR_CSS_SCOPE_ATTR,
    RAW_SELF_MUTATION_ACTIVE_ATTR,
    RAW_SELF_MUTATION_HTML_BASELINE_ATTR,
    REVERSIBLE_STYLE_BASELINE_ATTR,
    REVERSIBLE_TEXT_BASELINE_ATTR,
    clearMirrorTitleDisplayArtifacts,
    escapeRegExp,
    hashInteractionSignature,
} from './runtime.js?rmv=1.5.63';

const TOTO_BLOCK_RE = /<toto\b[\s\S]*?<\/toto>/gi;

export const TOTO_BLOCK_SINGLE_RE = /<toto\b[\s\S]*?<\/toto>/i;

export const FENCED_BLOCK_RE = /```(?:html|HTML|xml|XML)?\s*\n?([\s\S]*?)\n?```/gi;

const WHOLE_FENCED_BLOCK_RE = /^\s*```(?:html|HTML|xml|XML)?\s*\n?([\s\S]*?)\n?```\s*$/i;

const TRAILING_HTML_START_RE = /(?:^|\n)(<(?:div|section|article|details)\b[\s\S]*)$/i;

const PRE_CODE_RE = /<pre\b[^>]*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi;

const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;

const CODE_FENCE_OPEN_RE = /```(?:html|xml|javascript|js|css)?\s*/gi;

const TILDE_FENCE_OPEN_RE = /~~~(?:html|xml|javascript|js|css)?\s*/gi;

const CODE_LIKE_TAG_RE = /<\/?(?:pre|code|kbd|samp)\b[^>]*>/gi;

const CLASS_ATTR_RE = /\sclass=(["'])([^"']*)\1/gi;

const HIGHLIGHT_CLASS_TOKEN_RE = /^(?:language-(?:html|xml|js|javascript|css)|hljs|prism|prettyprint)$/i;

const MULTI_BLANK_LINE_RE = /\n\s*\n/g;





const RABBIT_MIRROR_BLOCKED_RENDER_SELECTOR = 'script, iframe, object, embed, link, meta, base, frame';

const RABBIT_MIRROR_NETWORK_URL_ATTRS = new Set(['href', 'src', 'xlink:href', 'poster', 'background']);

const RABBIT_MIRROR_INTERNAL_MODEL_ATTRS = new Set([
    REVERSIBLE_STYLE_BASELINE_ATTR,
    REVERSIBLE_TEXT_BASELINE_ATTR,
    RAW_SELF_MUTATION_HTML_BASELINE_ATTR,
    RAW_SELF_MUTATION_ACTIVE_ATTR,
    INTERACTION_HOME_ATTR,
]);

const RABBIT_MIRROR_OWNER_MODEL_ATTR_RE = /^data-(?:rabbit-mirror-(?:face-(?:index|count)|owner-(?:chat|mesid|swipe|source-hash|key)|external-(?:owner|source))|rm-(?:face-(?:index|count)|owner-(?:chat|mesid|swipe|source-hash)|external-owner-message|key|source|source-hash))$/i;

const RABBIT_MIRROR_TAROT_ORIGIN = 'https://gfx.tarot.com';

const RABBIT_MIRROR_TAROT_PATH_RE = /^\/images\/site\/decks\/rider\/full_size\/(?:[0-9]|[1-6][0-9]|7[0-7])\.jpg$/;

const RABBIT_MIRROR_MAX_DATA_IMAGE_CHARS = 2_000_000;

export const RABBIT_MIRROR_SANITIZER_STYLE_DROP_ATTR = 'data-rabbit-mirror-sanitizer-style-dropped';

export const RABBIT_MIRROR_SANITIZER_IMPORT_STRIPPED_ATTR = 'data-rabbit-mirror-sanitizer-import-stripped';


const RABBIT_MIRROR_MAX_TEMPLATE_NODES = 4200;

const RABBIT_MIRROR_MAX_TEMPLATE_DEPTH = 72;

const RABBIT_MIRROR_MAX_TEMPLATE_ATTRIBUTES = 12000;

const RABBIT_MIRROR_MAX_TEMPLATE_CSS_CHARS = 160000;

const RABBIT_MIRROR_MAX_TEMPLATE_CSS_RULES = 1400;

const RABBIT_MIRROR_MAX_TEMPLATE_DATA_URI_CHARS = 192000;

export const RABBIT_MIRROR_MAX_TEMPLATE_SOURCE_CHARS = 786432;


const DAMAGED_DATA_URI_MESSAGE_ATTR = 'data-rabbit-mirror-damaged-data-uri-rescued';

const DAMAGED_DATA_URI_ROOT_ATTR = 'data-rabbit-mirror-data-uri-rescued';

const INLINE_SVG_DATA_URI_RE = /data:image\/svg\+xml(?:;[^,)]*)?,/i;

const UI_TAG_AFTER_DATA_URI_RE = /<(?:div|section|article|label|input|button|p|span|h[1-6]|ul|ol|li|table|thead|tbody|tfoot|tr|td|th|form|details|summary|figure|figcaption|main|header|footer|nav)\b/i;

const SVG_LEAK_TAGS = new Set([
    'svg', 'defs', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
    'filter', 'feturbulence', 'fecolormatrix', 'fegaussianblur', 'feoffset', 'feblend',
    'fedisplacementmap', 'femerge', 'femergenode', 'mask', 'clippath', 'pattern', 'lineargradient',
    'radialgradient', 'stop', 'text', 'tspan', 'use', 'symbol',
]);


const plainTextRerenderedSignatures = new Set();


const MALFORMED_HTML_TAG_NAMES = '(?:div|span|label|section|article|button|input|select|textarea|details|summary|h[1-6]|p|a|img|svg|path|g|ul|ol|li|table|thead|tbody|tfoot|tr|td|th|form|fieldset|legend)';

const MALFORMED_HTML_ATTR_NAMES = '(?:class|id|style|for|href|src|type|role|name|value|title|tabindex|checked|disabled|selected|multiple|placeholder|aria-[\\w-]+|data-[\\w-]+)';


let rabbitMirrorCssScopeCounter = 0;


function decodeCssEscapesForSecurity(value = '') {
    return String(value || '')
        .replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => {
            const point = Number.parseInt(hex, 16);
            if (!Number.isFinite(point) || point <= 0 || point > 0x10ffff) return '';
            try { return String.fromCodePoint(point); } catch { return ''; }
        })
        .replace(/\\([^\r\n\f0-9a-fA-F])/g, '$1');
}


function normalizeGeneratedResourceValue(value = '') {
    return String(value || '')
        .replace(/^[\u0000-\u0020\u007f\u200b-\u200d\ufeff]+|[\u0000-\u0020\u007f\u200b-\u200d\ufeff]+$/g, '')
        .trim();
}


function isAllowedTarotImageUrl(value = '') {
    const raw = normalizeGeneratedResourceValue(value);
    if (!raw) return false;
    try {
        const parsed = new URL(raw);
        return parsed.origin === RABBIT_MIRROR_TAROT_ORIGIN
            && !parsed.username
            && !parsed.password
            && !parsed.search
            && !parsed.hash
            && RABBIT_MIRROR_TAROT_PATH_RE.test(parsed.pathname);
    } catch {
        return false;
    }
}


function decodeSvgDataImagePayload(raw = '') {
    const comma = String(raw || '').indexOf(',');
    if (comma < 0) return '';
    const header = String(raw).slice(0, comma).toLowerCase();
    const payload = String(raw).slice(comma + 1);
    try {
        if (/;base64(?:;|$)/i.test(header)) {
            if (typeof globalThis.atob !== 'function') return '';
            return globalThis.atob(payload);
        }
        return decodeURIComponent(payload);
    } catch {
        return '';
    }
}


function isSafeSvgDataImageValue(raw = '') {
    if (String(raw || '').length > RABBIT_MIRROR_MAX_DATA_IMAGE_CHARS) return false;
    const svg = decodeSvgDataImagePayload(raw);
    if (!svg || svg.length > 300000) return false;
    const normalized = decodeCssEscapesForSecurity(svg)
        .replace(/&(?:#x?0*3a|colon);/gi, ':')
        .replace(/&(?:#x?0*2f|sol);/gi, '/');
    if (/<\s*(?:script|iframe|object|embed|foreignObject)\b/i.test(normalized)) return false;
    if (/\@import\b/i.test(normalized)) return false;
    if (/\b(?:href|xlink:href|src)\s*=\s*(['"])(?!\s*#)[\s\S]*?\1/i.test(normalized)) return false;
    const urlRe = /url\(\s*(['"]?)([\s\S]*?)\1\s*\)/gi;
    let match;
    while ((match = urlRe.exec(normalized))) {
        if (!String(match[2] || '').trim().startsWith('#')) return false;
    }
    return true;
}


function isAllowedGeneratedResourceValue(value = '') {
    const raw = normalizeGeneratedResourceValue(value);
    if (!raw) return true;
    if (raw.startsWith('#')) return true;
    if (/^data:image\/(?:png|gif|jpe?g|webp|avif)(?:;|,)/i.test(raw)) {
        return raw.length <= RABBIT_MIRROR_MAX_DATA_IMAGE_CHARS;
    }
    if (/^data:image\/svg\+xml(?:;|,)/i.test(raw)) return isSafeSvgDataImageValue(raw);
    return isAllowedTarotImageUrl(raw);
}


export function cssContainsUnsafeGeneratedResource(value = '') {
    const css = decodeCssEscapesForSecurity(value).replace(/\/\*[\s\S]*?\*\//g, '');
    if (!css.trim()) return false;
    if (/\@import\b/i.test(css)) return true;
    if (/(?:expression\s*\(|-moz-binding\s*:|behavior\s*:)/i.test(css)) return true;

    const urlRe = /url\(\s*(['"]?)([\s\S]*?)\1\s*\)/gi;
    let match;
    while ((match = urlRe.exec(css))) {
        if (!isAllowedGeneratedResourceValue(match[2])) return true;
    }

    const imageSetRe = /(?:-webkit-)?image-set\s*\(([\s\S]*?)\)/gi;
    while ((match = imageSetRe.exec(css))) {
        const body = String(match[1] || '');
        const quotedRe = /(['"])([\s\S]*?)\1/g;
        let quoted;
        while ((quoted = quotedRe.exec(body))) {
            if (!isAllowedGeneratedResourceValue(quoted[2])) return true;
        }
    }
    return false;
}


export function splitCssDeclarationList(value = '') {
    const source = String(value || '');
    const parts = [];
    let start = 0;
    let quote = '';
    let escaped = false;
    let parenDepth = 0;
    let bracketDepth = 0;
    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
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
        if (char === '(') parenDepth += 1;
        else if (char === ')' && parenDepth > 0) parenDepth -= 1;
        else if (char === '[') bracketDepth += 1;
        else if (char === ']' && bracketDepth > 0) bracketDepth -= 1;
        else if (char === ';' && parenDepth === 0 && bracketDepth === 0) {
            parts.push(source.slice(start, index));
            start = index + 1;
        }
    }
    parts.push(source.slice(start));
    return parts;
}


function cssDeclarationBodies(value = '') {
    const source = String(value || '');
    const bodies = [];
    const stack = [];
    let quote = '';
    let escaped = false;
    let comment = false;
    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';
        if (comment) {
            if (char === '*' && next === '/') {
                comment = false;
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
            comment = true;
            index += 1;
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '{') {
            if (stack.length) stack[stack.length - 1].hasChild = true;
            stack.push({ start: index + 1, hasChild: false });
            continue;
        }
        if (char === '}' && stack.length) {
            const frame = stack.pop();
            if (!frame.hasChild) bodies.push(source.slice(frame.start, index));
        }
    }
    return bodies.length ? bodies : [source];
}


function zeroEdgeDeclarationPresent(css = '', property = '') {
    const unit = '(?:0(?:px|%|rem|em|vh|vw|dvh|dvw|svh|svw|lvh|lvw)?)';
    return new RegExp(`\\b${property}\\s*:\\s*${unit}(?:\\s*!important)?(?:\\s*;|$)`, 'i').test(css);
}


export function cssDeclarationBlockContainsUnsafeOverlayGeometry(value = '') {
    const css = decodeCssEscapesForSecurity(value).replace(/\/\*[\s\S]*?\*\//g, '').toLowerCase();
    if (!css.trim()) return false;
    const positionMatch = /\bposition\s*:\s*(fixed|sticky|absolute)\b/.exec(css);
    if (!positionMatch) return false;
    const position = positionMatch[1];
    const fullInset = /\binset\s*:\s*0(?:px|%|rem|em|vh|vw|dvh|dvw|svh|svw|lvh|lvw)?(?:\s+0(?:px|%|rem|em|vh|vw|dvh|dvw|svh|svw|lvh|lvw)?){0,3}(?:\s*!important)?(?:\s*;|$)/i.test(css)
        || ['top', 'right', 'bottom', 'left'].every(edge => zeroEdgeDeclarationPresent(css, edge));
    const viewportWidth = /\b(?:width|min-width)\s*:\s*(?:100(?:d|s|l)?vw|100%)(?:\s*!important)?(?:\s*;|$)/i.test(css);
    const viewportHeight = /\b(?:height|min-height)\s*:\s*(?:100(?:d|s|l)?vh|100%)(?:\s*!important)?(?:\s*;|$)/i.test(css);
    const zMatch = /\bz-index\s*:\s*(-?\d+)/.exec(css);
    const highZ = !!zMatch && Number(zMatch[1]) >= 1000;

    if (position === 'fixed') return fullInset || (viewportWidth && viewportHeight);
    if (position === 'sticky') return viewportWidth && viewportHeight;
    return (viewportWidth && viewportHeight) || (fullInset && highZ);
}


function cssContainsUnsafeOverlayGeometry(value = '') {
    return cssDeclarationBodies(value).some(cssDeclarationBlockContainsUnsafeOverlayGeometry);
}


export function sanitizeGeneratedCssDeclarationBlock(value = '') {
    const declarations = splitCssDeclarationList(value);
    const kept = [];
    for (const declaration of declarations) {
        const trimmed = String(declaration || '').trim();
        if (!trimmed) continue;
        if (/^\@import\b/i.test(trimmed)) continue;
        if (cssContainsUnsafeGeneratedResource(trimmed)) continue;
        kept.push(trimmed);
    }
    let cleaned = kept.join(';');
    if (cleaned && !/;\s*$/.test(cleaned)) cleaned += ';';
    if (cssDeclarationBlockContainsUnsafeOverlayGeometry(cleaned)) {
        cleaned = splitCssDeclarationList(cleaned)
            .filter(declaration => !/^\s*position\s*:\s*(?:fixed|sticky|absolute)\b/i.test(String(declaration || '')))
            .map(declaration => String(declaration || '').trim())
            .filter(Boolean)
            .join(';');
        if (cleaned && !/;\s*$/.test(cleaned)) cleaned += ';';
    }
    return cleaned;
}


function stripGeneratedCssImportRules(value = '') {
    const source = String(value || '');
    if (!source.trim()) return source;
    // Use the repository's CSS rule-list walker: strip only @import (including escaped
    // spellings) while retaining local layout/borders/display:none/:checked rules.
    return transformCssRuleList(source, selector => selector);
}


function sanitizeGeneratedStyleSheet(value = '') {
    const original = String(value || '');
    if (!original.trim()) return original;
    const source = stripGeneratedCssImportRules(original);

    const stack = [];
    const spans = [];
    let quote = '';
    let escaped = false;
    let comment = false;
    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';
        if (comment) {
            if (char === '*' && next === '/') {
                comment = false;
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
            comment = true;
            index += 1;
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '{') {
            if (stack.length) stack[stack.length - 1].hasChild = true;
            stack.push({ start: index + 1, hasChild: false });
            continue;
        }
        if (char === '}' && stack.length) {
            const frame = stack.pop();
            if (!frame.hasChild) spans.push({ start: frame.start, end: index });
        }
    }

    if (!spans.length) return sanitizeGeneratedCssDeclarationBlock(source);
    let cleaned = source;
    for (const span of spans.sort((a, b) => b.start - a.start)) {
        const body = cleaned.slice(span.start, span.end);
        const sanitized = sanitizeGeneratedCssDeclarationBlock(body);
        cleaned = `${cleaned.slice(0, span.start)}${sanitized}${cleaned.slice(span.end)}`;
    }
    if (cssContainsUnsafeGeneratedResource(cleaned) || cssContainsUnsafeOverlayGeometry(cleaned)) return '';
    return cleaned;
}


function unwrapGeneratedForms(template) {
    for (const form of [...template.content.querySelectorAll('form')]) {
        form.replaceWith(...form.childNodes);
    }
}


function canonicalAllowedTarotImageUrl(value = '') {
    const raw = normalizeGeneratedResourceValue(value);
    if (!raw) return '';
    try {
        const parsed = new URL(raw);
        if (parsed.origin !== RABBIT_MIRROR_TAROT_ORIGIN
            || parsed.username
            || parsed.password
            || !RABBIT_MIRROR_TAROT_PATH_RE.test(parsed.pathname)) return '';
        return `${RABBIT_MIRROR_TAROT_ORIGIN}${parsed.pathname}`;
    } catch {
        return '';
    }
}


function buildUniqueGeneratedIdMap(template) {
    const counts = new Map();
    const nodes = new Map();
    for (const element of [...template.content.querySelectorAll('[id]')]) {
        const id = String(element.getAttribute('id') || '');
        if (!id || id.length > 160 || /[\u0000-\u001f\u007f\s<>"'`=]/.test(id)) continue;
        counts.set(id, (counts.get(id) || 0) + 1);
        nodes.set(id, element);
    }
    const unique = new Map();
    for (const [id, count] of counts) {
        if (count === 1) unique.set(id, nodes.get(id));
    }
    return unique;
}


function sanitizeLocalGeneratedPopoverRoutes(template) {
    const uniqueIds = buildUniqueGeneratedIdMap(template);
    for (const target of [...template.content.querySelectorAll('[popover]')]) {
        const mode = String(target.getAttribute('popover') || '').trim().toLowerCase();
        if (mode && !['auto', 'manual', 'hint'].includes(mode)) target.removeAttribute('popover');
    }

    for (const control of [...template.content.querySelectorAll('[popovertarget], [commandfor], [popovertargetaction], [command]')]) {
        const isButton = control.matches?.('button, input[type="button"], input[type="reset"]');
        const popoverId = String(control.getAttribute('popovertarget') || '').trim();
        if (control.hasAttribute('popovertarget')) {
            const target = isButton ? uniqueIds.get(popoverId) : null;
            if (!target?.hasAttribute?.('popover')) {
                control.removeAttribute('popovertarget');
                control.removeAttribute('popovertargetaction');
            }
        }
        if (control.hasAttribute('popovertargetaction')) {
            const action = String(control.getAttribute('popovertargetaction') || '').trim().toLowerCase();
            if (!control.hasAttribute('popovertarget') || !['toggle', 'show', 'hide'].includes(action)) {
                control.removeAttribute('popovertargetaction');
            }
        }

        const commandId = String(control.getAttribute('commandfor') || '').trim();
        if (control.hasAttribute('commandfor')) {
            const target = isButton ? uniqueIds.get(commandId) : null;
            const command = String(control.getAttribute('command') || '').trim().toLowerCase();
            if (!target?.hasAttribute?.('popover') || !['show-popover', 'hide-popover', 'toggle-popover'].includes(command)) {
                control.removeAttribute('commandfor');
                control.removeAttribute('command');
            }
        } else if (control.hasAttribute('command')) {
            control.removeAttribute('command');
        }
    }
}


export function validateRabbitMirrorMarkupLexicalBudget(value = '') {
    const source = String(value || '');
    if (!source || source.length > RABBIT_MIRROR_MAX_TEMPLATE_SOURCE_CHARS) return false;
    const lower = source.toLowerCase();
    let dataIndex = lower.indexOf('data:');
    while (dataIndex >= 0) {
        let end = dataIndex + 5;
        const hardLimit = dataIndex + RABBIT_MIRROR_MAX_TEMPLATE_DATA_URI_CHARS + 6;
        const limit = Math.min(source.length, hardLimit);
        while (end < limit && !/[\s"'<>)]/.test(source[end])) end += 1;
        if (hardLimit <= source.length && end >= hardLimit && !/[\s"'<>)]/.test(source[end] || '')) return false;
        dataIndex = lower.indexOf('data:', Math.max(end, dataIndex + 5));
    }

    const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
    const tagRe = /<\s*(\/?)\s*([a-z][a-z0-9:-]*)\b([^>]*)>/gi;
    let tags = 0; let depth = 0; let attributes = 0; let match;
    while ((match = tagRe.exec(source))) {
        tags += 1;
        if (tags > RABBIT_MIRROR_MAX_TEMPLATE_NODES) return false;
        const closing = !!match[1]; const name = String(match[2] || '').toLowerCase(); const tail = String(match[3] || '');
        if (closing) depth = Math.max(0, depth - 1);
        else {
            const attrMatches = tail.match(/\s+[a-z_:][-a-z0-9_:.]*(?:\s*=)?/gi);
            attributes += attrMatches?.length || 0;
            if (attributes > RABBIT_MIRROR_MAX_TEMPLATE_ATTRIBUTES) return false;
            if (!voidTags.has(name) && !/\/\s*$/.test(tail)) {
                depth += 1;
                if (depth > RABBIT_MIRROR_MAX_TEMPLATE_DEPTH) return false;
            }
        }
    }

    let cssChars = 0; let cssRules = 0; let cursor = 0;
    while (true) {
        const open = lower.indexOf('<style', cursor); if (open < 0) break;
        const body = lower.indexOf('>', open + 6); if (body < 0) return false;
        const close = lower.indexOf('</style', body + 1); if (close < 0) return false;
        const css = source.slice(body + 1, close);
        cssChars += css.length; cssRules += (css.match(/{/g) || []).length;
        if (cssChars > RABBIT_MIRROR_MAX_TEMPLATE_CSS_CHARS || cssRules > RABBIT_MIRROR_MAX_TEMPLATE_CSS_RULES) return false;
        cursor = close + 7;
    }
    return true;
}


export function validateRabbitMirrorTemplateStructuralBudget(template) {
    const root = template?.content;
    if (!root?.childNodes) return false;
    let nodes = 0; let attributes = 0; let cssChars = 0; let cssRules = 0;
    const stack = [...root.childNodes].reverse().map(node => ({ node, depth: 1 }));
    while (stack.length) {
        const { node, depth } = stack.pop();
        nodes += 1;
        if (nodes > RABBIT_MIRROR_MAX_TEMPLATE_NODES || depth > RABBIT_MIRROR_MAX_TEMPLATE_DEPTH) return false;
        if (node?.nodeType === 1) {
            const attrs = [...(node.attributes || [])];
            attributes += attrs.length;
            if (attributes > RABBIT_MIRROR_MAX_TEMPLATE_ATTRIBUTES) return false;
            for (const attr of attrs) {
                const value = String(attr?.value || '');
                const dataAt = value.toLowerCase().indexOf('data:');
                if (dataAt >= 0 && value.length - dataAt > RABBIT_MIRROR_MAX_TEMPLATE_DATA_URI_CHARS) return false;
            }
            if (String(node.tagName || '').toLowerCase() === 'style') {
                const css = String(node.textContent || '');
                cssChars += css.length;
                cssRules += (css.match(/{/g) || []).length;
                if (cssChars > RABBIT_MIRROR_MAX_TEMPLATE_CSS_CHARS || cssRules > RABBIT_MIRROR_MAX_TEMPLATE_CSS_RULES) return false;
            }
        }
        const children = [...(node?.childNodes || [])];
        for (let i = children.length - 1; i >= 0; i -= 1) stack.push({ node: children[i], depth: depth + 1 });
    }
    return true;
}


export function sanitizeRabbitMirrorUntrustedTemplate(template) {
    if (!template?.content?.querySelectorAll) return false;
    // Fail closed before any broad selector walk. This prevents model-produced tag,
    // attribute, CSS-rule and deep-nesting bombs from turning sanitization into a long task.
    if (!validateRabbitMirrorTemplateStructuralBudget(template)) return false;
    if (restoreStandaloneKeyframesInTemplate(template) && !validateRabbitMirrorTemplateStructuralBudget(template)) return false;
    clearMirrorTitleDisplayArtifacts(template.content);

    template.content.querySelectorAll(RABBIT_MIRROR_BLOCKED_RENDER_SELECTOR).forEach(node => node.remove());
    // Local attribution is rebuilt from exact-owner metadata, never model HTML.
    template.content.querySelectorAll(`[${EXTERNAL_REFERENCE_NOTE_ATTR}]`).forEach(node => node.remove());
    unwrapGeneratedForms(template);

    let droppedLocalStyleCount = 0;
    let importStrippedStyleCount = 0;
    for (const style of [...template.content.querySelectorAll('style')]) {
        const css = String(style.textContent || '');
        const cssWithoutImports = stripGeneratedCssImportRules(css);
        if (cssWithoutImports !== css) importStrippedStyleCount += 1;
        const cleanedCss = sanitizeGeneratedStyleSheet(css);
        if (!cleanedCss.trim()) {
            if (cssWithoutImports.trim()) droppedLocalStyleCount += 1;
            style.remove();
        } else if (cleanedCss !== css) style.textContent = cleanedCss;
    }

    if (droppedLocalStyleCount || importStrippedStyleCount) {
        const roots = [...template.content.querySelectorAll('toto, details')];
        for (const root of roots) {
            if (droppedLocalStyleCount) root.setAttribute(RABBIT_MIRROR_SANITIZER_STYLE_DROP_ATTR, String(droppedLocalStyleCount));
            if (importStrippedStyleCount) root.setAttribute(RABBIT_MIRROR_SANITIZER_IMPORT_STRIPPED_ATTR, String(importStrippedStyleCount));
        }
    }

    for (const element of [...template.content.querySelectorAll('*')]) {
        if (element.matches?.('input[type="password"], input[type="file"]')) {
            element.remove();
            continue;
        }
        for (const attribute of [...element.attributes]) {
            const name = String(attribute.name || '').toLowerCase();
            const value = String(attribute.value || '');
            if (RABBIT_MIRROR_INTERNAL_MODEL_ATTRS.has(name)
                || RABBIT_MIRROR_OWNER_MODEL_ATTR_RE.test(name)
                || /^on[a-z]+$/.test(name)
                || name === 'srcdoc'
                || name === 'action'
                || name === 'formaction'
                || name === 'target'
                || name === 'autofocus'
                || name === 'autocomplete'
                || name === 'form'
                || name === 'formenctype'
                || name === 'formmethod'
                || name === 'formnovalidate'
                || name === 'srcset'
                || name === 'ping'
                || (name === 'open' && element.tagName?.toLowerCase() === 'dialog')) {
                element.removeAttribute(attribute.name);
                continue;
            }
            // Local popover/command attributes are validated as a linked set after all generic attributes are stripped.
            if (name === 'popover'
                || name === 'popovertarget'
                || name === 'popovertargetaction'
                || name === 'command'
                || name === 'commandfor') continue;
            if (RABBIT_MIRROR_NETWORK_URL_ATTRS.has(name)) {
                const normalizedResource = normalizeGeneratedResourceValue(value);
                const canonicalTarot = canonicalAllowedTarotImageUrl(normalizedResource);
                if (canonicalTarot) {
                    element.setAttribute(attribute.name, canonicalTarot);
                    if (element.tagName?.toLowerCase() === 'img') element.setAttribute('referrerpolicy', 'no-referrer');
                    continue;
                }
                if (!isAllowedGeneratedResourceValue(normalizedResource)) {
                    element.removeAttribute(attribute.name);
                    continue;
                }
            }
            if (name === 'style') {
                const cleanedStyle = sanitizeGeneratedCssDeclarationBlock(value);
                if (!cleanedStyle.trim()) element.removeAttribute(attribute.name);
                else if (cleanedStyle !== value) element.setAttribute(attribute.name, cleanedStyle);
                continue;
            }
            if (/url\s*\(/i.test(decodeCssEscapesForSecurity(value)) && cssContainsUnsafeGeneratedResource(value)) {
                element.removeAttribute(attribute.name);
            }
        }
    }
    sanitizeLocalGeneratedPopoverRoutes(template);
    const bannedWords = getSettings()?.rabbitMirrorBannedWords;
    if (Array.isArray(bannedWords) && bannedWords.length) {
        applyRabbitMirrorBannedWordsToDom(template.content, bannedWords);
    }
    return true;
}


function findLastInlineStyleMatch(tagPrefix) {
    let last = null;
    const re = /\bstyle\s*=\s*(["'])/gi;
    let match;
    while ((match = re.exec(String(tagPrefix || '')))) last = match;
    return last;
}


function findLastBackgroundDeclarationStart(stylePrefix, absoluteStart) {
    let found = -1;
    const re = /(?:^|;)\s*background(?:-image)?\s*:/gi;
    let match;
    while ((match = re.exec(String(stylePrefix || '')))) {
        const declarationOffset = match.index + (match[0].startsWith(';') ? 1 : 0);
        found = absoluteStart + declarationOffset;
    }
    return found;
}


function findNextUiTagStart(text, fromIndex) {
    const source = String(text || '');
    const tail = source.slice(Math.max(0, fromIndex));
    const match = UI_TAG_AFTER_DATA_URI_RE.exec(tail);
    return match ? Math.max(0, fromIndex) + match.index : -1;
}



function findDamagedInlineSvgDeclarationEnd(text, propertyStart, uriIndex, styleQuote) {
    const source = String(text || '');
    const prefix = source.slice(propertyStart, uriIndex);
    const urlOpen = prefix.toLowerCase().lastIndexOf('url(');
    if (urlOpen < 0 || !styleQuote) return -1;

    let quoteIndex = propertyStart + urlOpen + 4;
    while (quoteIndex < uriIndex && /\s/.test(source[quoteIndex])) quoteIndex += 1;
    const urlQuote = source[quoteIndex] === '"' || source[quoteIndex] === "'" ? source[quoteIndex] : '';

    // 精确寻找 url(...) 结束后紧接 style 属性闭引号和标签结束符的位置。
    // 只删除 background-image 声明本身，保留其后的 <style> 与正文；找不到时才使用旧保主体兜底。
    for (let index = Math.max(uriIndex, quoteIndex + 1); index < source.length; index += 1) {
        if (urlQuote) {
            if (source[index] !== urlQuote) continue;
        } else if (source[index] !== ')') {
            continue;
        }

        let cursor = urlQuote ? index + 1 : index;
        while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1;
        if (source[cursor] !== ')') continue;
        cursor += 1;
        while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1;
        if (source[cursor] === ';') cursor += 1;
        while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1;
        if (source[cursor] !== styleQuote) continue;
        const styleCloseIndex = cursor;
        cursor += 1;
        while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1;
        if (source[cursor] === '>') return styleCloseIndex;
        if (source.slice(cursor, cursor + 4).toLowerCase() === '&gt;') return styleCloseIndex;
    }
    return -1;
}


export function countRawUiTags(text) {
    return (String(text || '').match(/<(?:div|section|article|label|input|button|p|span|h[1-6]|ul|ol|li|table|form|details|summary|figure|main|header|footer|nav)\b/gi) || []).length;
}


function parsedElementCount(text) {
    try {
        if (typeof document === 'undefined') return -1;
        if (!validateRabbitMirrorMarkupLexicalBudget(text)) return -1;
        const template = document.createElement('template');
        template.innerHTML = String(text || '');
        return template.content.querySelectorAll('*').length;
    } catch {
        return -1;
    }
}


function isLikelyDamagedInlineSvgDataUri(text, candidate) {
    const source = String(text || '');
    const { styleQuote, styleValueStart, uriIndex, nextUiTagIndex } = candidate;
    if (!styleQuote || nextUiTagIndex <= uriIndex) return false;

    const span = source.slice(uriIndex, nextUiTagIndex);
    if (!INLINE_SVG_DATA_URI_RE.test(span)) return false;
    INLINE_SVG_DATA_URI_RE.lastIndex = 0;

    // 只有“inline style 属性中的原始 SVG 文本”才会被接管。
    // 百分号编码或 base64 的健康资源不会匹配 <svg / &lt;svg，因此保持原样。
    if (!/(?:<|&lt;)svg\b/i.test(span)) return false;

    // HTML 属性引号在 data URI 尚未结束前再次出现，说明 SVG 内部引号会提前截断 style 属性。
    // 反斜杠不能转义 HTML 属性引号，因此 \" 同样属于损坏信号。
    const lastParen = span.lastIndexOf(')');
    const quoteIndex = source.indexOf(styleQuote, uriIndex);
    const quoteInsideDataUri = quoteIndex >= 0 && quoteIndex < nextUiTagIndex
        && (lastParen < 0 || quoteIndex <= uriIndex + lastParen);
    const explicitDamageSignal = /\\["']|\\&quot;|&quot;|["']{2}|["']\s*&gt;/i.test(span);

    if (quoteInsideDataUri || explicitDamageSignal) return true;

    // 浏览器可用时再做一次保守判定：原文标签很多，但解析后主体被吞掉。
    const rawCount = countRawUiTags(source);
    const parsedCount = parsedElementCount(source);
    return rawCount >= 6 && parsedCount >= 0 && parsedCount + 4 < rawCount;
}


function removeSurplusSvgClosingTags(text, removedFragment) {
    let output = String(text || '');
    const removedNames = new Set();
    String(removedFragment || '').replace(/<\/?([a-z][\w:-]*)\b/gi, (_full, rawName) => {
        const name = String(rawName || '').toLowerCase();
        if (SVG_LEAK_TAGS.has(name)) removedNames.add(name);
        return _full;
    });

    for (const name of removedNames) {
        const escaped = escapeRegExp(name);
        const openRe = new RegExp(`<${escaped}\\b(?![^>]*\\/>)`, 'gi');
        const closeRe = new RegExp(`</${escaped}\\s*>`, 'gi');
        const opens = (output.match(openRe) || []).length;
        const closes = (output.match(closeRe) || []).length;
        let surplus = Math.max(0, closes - opens);
        if (!surplus) continue;

        output = output.replace(closeRe, match => {
            if (surplus <= 0) return match;
            surplus -= 1;
            return '';
        });
    }
    return output;
}

/**
 * 保全型 data URI 急救：只移除会截断 inline style 属性的损坏 SVG data URI 声明。
 * 不改色、不重写其余 DOM/CSS，也不处理健康的 percent-encoded/base64 资源。
 */

export function rescueDamagedDataUriRabbitMirrorOutput(responseText = '') {
    let text = String(responseText || '');
    if (!/(?:<toto\b|<details\b)/i.test(text) || !/data:image\/svg\+xml/i.test(text)) return text;

    let cursor = 0;
    let repairs = 0;
    while (repairs < 8) {
        const lower = text.toLowerCase();
        const uriIndex = lower.indexOf('data:image/svg+xml', cursor);
        if (uriIndex < 0) break;

        const tagStart = text.lastIndexOf('<', uriIndex);
        const tagEndBeforeUri = text.lastIndexOf('>', uriIndex);
        if (tagStart < 0 || tagEndBeforeUri > tagStart) {
            cursor = uriIndex + 18;
            continue;
        }

        const tagPrefix = text.slice(tagStart, uriIndex);
        const styleMatch = findLastInlineStyleMatch(tagPrefix);
        if (!styleMatch) {
            cursor = uriIndex + 18;
            continue;
        }

        const styleQuote = styleMatch[1];
        const styleValueStart = tagStart + styleMatch.index + styleMatch[0].length;
        const stylePrefix = text.slice(styleValueStart, uriIndex);
        const propertyStart = findLastBackgroundDeclarationStart(stylePrefix, styleValueStart);
        const nextUiTagIndex = findNextUiTagStart(text, uriIndex + 18);
        const candidate = { styleQuote, styleValueStart, uriIndex, nextUiTagIndex };

        if (propertyStart < styleValueStart || nextUiTagIndex < 0 || !isLikelyDamagedInlineSvgDataUri(text, candidate)) {
            cursor = uriIndex + 18;
            continue;
        }

        const preciseStyleClose = findDamagedInlineSvgDeclarationEnd(text, propertyStart, uriIndex, styleQuote);
        if (preciseStyleClose >= 0) {
            const removedFragment = text.slice(propertyStart, preciseStyleClose);
            const safePrefix = text.slice(0, propertyStart).replace(/[ \t]+$/g, '');
            let safeSuffix = text.slice(preciseStyleClose);
            if (safeSuffix.toLowerCase().startsWith(`${styleQuote}&gt;`)) {
                safeSuffix = `${styleQuote}>${safeSuffix.slice(styleQuote.length + 4)}`;
            }
            text = `${safePrefix}${safeSuffix}`;
            text = removeSurplusSvgClosingTags(text, removedFragment);
        } else {
            const removedFragment = text.slice(propertyStart, nextUiTagIndex);
            const safePrefix = text.slice(0, propertyStart).replace(/[ \t]+$/g, '');
            const safeSuffix = text.slice(nextUiTagIndex);
            text = `${safePrefix}${styleQuote}>\n${safeSuffix}`;
            text = removeSurplusSvgClosingTags(text, removedFragment);
        }
        repairs += 1;
        cursor = Math.max(0, propertyStart + 2);
    }

    return text;
}


export function setTransientMessageSource(message, repaired) {
    const transientMessage = cloneMessageForTransientRerender(message);
    transientMessage.mes = repaired;

    if (Array.isArray(transientMessage.swipes)) {
        const swipeIndex = Number.isInteger(transientMessage.swipe_id)
            ? transientMessage.swipe_id
            : transientMessage.swipes.length - 1;
        if (typeof transientMessage.swipes[swipeIndex] === 'string') transientMessage.swipes[swipeIndex] = repaired;
    }
    if (typeof transientMessage?.extra?.display_text === 'string') transientMessage.extra.display_text = repaired;
    return transientMessage;
}



function stripHtmlComments(text) {
    return String(text || '').replace(HTML_COMMENT_RE, '');
}


export function normalizeMirrorAttribute(text) {
    return String(text || '').replace(new RegExp('data-rabbit-' + 'h' + 'ole', 'gi'), 'data-rabbit-mirror');
}


function stripSyntaxHighlightClasses(text) {
    return String(text || '').replace(CLASS_ATTR_RE, (match, quote, classValue) => {
        const kept = String(classValue || '')
            .split(/\s+/)
            .filter(token => token && !HIGHLIGHT_CLASS_TOKEN_RE.test(token));
        return kept.length ? ` class=${quote}${kept.join(' ')}${quote}` : '';
    });
}


function stripCodeBlockTriggers(text) {
    return normalizeMirrorAttribute(stripHtmlComments(String(text || '')))
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        .replace(CODE_FENCE_OPEN_RE, '')
        .replace(/```/g, '')
        .replace(TILDE_FENCE_OPEN_RE, '')
        .replace(/~~~/g, '')
        .replace(CODE_LIKE_TAG_RE, '')
        .replace(CLASS_ATTR_RE, (match, quote, classValue) => {
            const kept = String(classValue || '')
                .split(/\s+/)
                .filter(token => token && !HIGHLIGHT_CLASS_TOKEN_RE.test(token));
            return kept.length ? ` class=${quote}${kept.join(' ')}${quote}` : '';
        })
        .replace(MULTI_BLANK_LINE_RE, '\n')
        .trim();
}


export function decodeHtmlEntities(text) {
    const input = String(text || '');
    if (!input.includes('&')) return input;
    try {
        if (typeof document === 'undefined') return input;
        const textarea = document.createElement('textarea');
        textarea.innerHTML = input;
        return textarea.value;
    } catch {
        return input;
    }
}


export function stripOneCodeFence(text) {
    const input = String(text || '').trim();
    const match = input.match(WHOLE_FENCED_BLOCK_RE);
    return match ? String(match[1] || '').trim() : input;
}


export function looksLikeCompleteHtmlBlock(text) {
    const html = String(text || '').trim();
    if (!html) return false;
    if (TOTO_BLOCK_SINGLE_RE.test(html)) return true;
    if (!/^<(?:div|section|article|details)\b[\s\S]*<\/(?:div|section|article|details)>\s*$/i.test(html)) return false;

    // 只接管“像兔子镜 UI 作品”的整段 HTML，避免误伤普通聊天里的 HTML 教程代码。
    const htmlSignal = /\bstyle\s*=|display\s*:\s*(?:grid|flex|block)|box-sizing\s*:|max-width\s*:|linear-gradient\(|box-shadow\s*:|filter\s*:|border-radius\s*:/i.test(html);
    const theaterSignal = /兔子镜|小剧场|互动区|海龟汤|剖面图|Layer|视觉|展现形式|summary|details/i.test(html);
    const enoughTags = (html.match(/<\/(?:div|p|span|h[1-6]|section|article)>/gi) || []).length >= 3;
    return htmlSignal && (theaterSignal || enoughTags);
}


export function wrapNakedHtmlAsToto(html) {
    const body = compactTotoBlock(html);
    if (TOTO_BLOCK_SINGLE_RE.test(body)) return body;
    if (/<details\b/i.test(body) && /<summary\b/i.test(body)) {
        return `<toto data-rabbit-mirror="true" style="display:block;">${body}</toto>`;
    }
    return `<toto data-rabbit-mirror="true" style="display:block;"><details style="display:block;box-sizing:border-box;"><summary style="cursor:pointer;list-style:none;font-weight:700;margin:0 0 8px 0;">【兔子镜：小剧场】</summary>${body}</details></toto>`;
}


function cleanCodeFencePayload(payload) {
    const raw = stripHtmlComments(stripOneCodeFence(decodeHtmlEntities(payload)));
    if (!raw) return raw;
    if (TOTO_BLOCK_SINGLE_RE.test(raw)) return cleanRabbitMirrorOutput(raw);
    if (looksLikeCompleteHtmlBlock(raw)) return wrapNakedHtmlAsToto(raw);
    return null;
}


function unwrapCodeBlocksInsideToto(block) {
    let html = stripHtmlComments(String(block || ''));

    // 关键兜底：外层 <toto>/<details> 已经成立，但模型把正文 HTML 又塞进 ```html 代码块时，
    // 这里只拆掉内部代码块，保留原本的外层 summary，不再二次包 <toto>。
    html = html.replace(FENCED_BLOCK_RE, (match, payload) => {
        const raw = stripHtmlComments(stripOneCodeFence(decodeHtmlEntities(payload)));
        if (looksLikeCompleteHtmlBlock(raw)) return compactTotoBlock(raw);
        if (TOTO_BLOCK_SINGLE_RE.test(raw)) return compactTotoBlock(raw.replace(/^<toto\b[^>]*>/i, '').replace(/<\/toto>\s*$/i, ''));
        return match;
    });

    // 兼容已经被 Markdown 渲染成 <pre><code>&lt;div...&gt;</code></pre> 后又写回消息的情况。
    html = html.replace(PRE_CODE_RE, (match, payload) => {
        const raw = stripHtmlComments(stripOneCodeFence(decodeHtmlEntities(payload)));
        if (looksLikeCompleteHtmlBlock(raw)) return compactTotoBlock(raw);
        if (TOTO_BLOCK_SINGLE_RE.test(raw)) return compactTotoBlock(raw.replace(/^<toto\b[^>]*>/i, '').replace(/<\/toto>\s*$/i, ''));
        return match;
    });

    return stripCodeBlockTriggers(html);
}


export function wrapTrailingNakedHtml(text) {
    const input = String(text || '').trim();
    if (TOTO_BLOCK_SINGLE_RE.test(input)) return input;
    if (looksLikeCompleteHtmlBlock(input)) return wrapNakedHtmlAsToto(input);

    const match = input.match(TRAILING_HTML_START_RE);
    if (!match) return input;
    const htmlStart = match.index + match[0].indexOf('<');
    const prefix = input.slice(0, htmlStart).trimEnd();
    const tail = input.slice(htmlStart).trim();
    if (!looksLikeCompleteHtmlBlock(tail)) return input;
    return `${prefix}${prefix ? '\n' : ''}${wrapNakedHtmlAsToto(tail)}`.trim();
}


function splitCssVarArguments(value) {
    const source = String(value || '');
    let depth = 0;
    let quote = '';
    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        if (quote) {
            if (char === '\\') index += 1;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '(') depth += 1;
        else if (char === ')') depth = Math.max(0, depth - 1);
        else if (char === ',' && depth === 0) {
            return [source.slice(0, index).trim(), source.slice(index + 1).trim()];
        }
    }
    return [source.trim(), ''];
}


function replaceCssVarFunctions(value, resolver) {
    const source = String(value || '');
    let output = '';
    let cursor = 0;

    while (cursor < source.length) {
        const match = /var\s*\(/ig.exec(source.slice(cursor));
        if (!match) {
            output += source.slice(cursor);
            break;
        }

        const start = cursor + match.index;
        const open = start + match[0].lastIndexOf('(');
        output += source.slice(cursor, start);

        let depth = 1;
        let quote = '';
        let end = open + 1;
        for (; end < source.length; end += 1) {
            const char = source[end];
            if (quote) {
                if (char === '\\') end += 1;
                else if (char === quote) quote = '';
                continue;
            }
            if (char === '"' || char === "'") {
                quote = char;
                continue;
            }
            if (char === '(') depth += 1;
            else if (char === ')') {
                depth -= 1;
                if (depth === 0) break;
            }
        }

        if (depth !== 0) {
            output += source.slice(start);
            break;
        }

        const [name, fallback] = splitCssVarArguments(source.slice(open + 1, end));
        const resolved = resolver(name, fallback);
        output += resolved;
        cursor = end + 1;
    }

    return output;
}


function collectCssCustomPropertyValuesFromHtml(htmlText) {
    const html = String(htmlText || '');
    const values = new Map();
    const collect = (cssSource) => {
        const declarationRe = /(?:^|[;{])\s*(--[^\s:;{}]+)\s*:\s*([^;{}]*?)(?=;|})/g;
        let match;
        while ((match = declarationRe.exec(String(cssSource || '')))) {
            const name = String(match[1] || '').trim();
            const value = String(match[2] || '').trim();
            if (name && value) values.set(name, value);
        }
    };

    html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (full, css = '') => {
        collect(css);
        return full;
    });
    html.replace(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi, (full, quote, css = '') => {
        collect(`{${css}}`);
        return full;
    });
    return values;
}


function expandUnsupportedCssCustomProperties(cssText, inheritedValues = null) {
    const source = String(cssText || '');
    if (!/(?:^|[;{])\s*--[^\s:;{}]+\s*:|var\s*\(/i.test(source)) return source;

    const values = new Map(inheritedValues instanceof Map ? inheritedValues : []);
    const declarationRe = /(^|[;{])\s*(--[^\s:;{}]+)\s*:\s*([^;{}]*?)(?=;|})/g;
    let match;
    while ((match = declarationRe.exec(source))) {
        const name = String(match[2] || '').trim();
        const value = String(match[3] || '').trim();
        if (name && value) values.set(name, value);
    }

    const resolvedCache = new Map();
    const resolveName = (name, stack = new Set()) => {
        const key = String(name || '').trim();
        if (!key.startsWith('--')) return '';
        if (resolvedCache.has(key)) return resolvedCache.get(key);
        if (stack.has(key)) return '';
        const raw = values.get(key);
        if (raw === undefined) return '';

        const nextStack = new Set(stack);
        nextStack.add(key);
        const resolved = replaceCssVarFunctions(raw, (nestedName, fallback) => {
            const nested = resolveName(nestedName, nextStack);
            if (nested) return nested;
            if (fallback) {
                return replaceCssVarFunctions(fallback, (fallbackName, nestedFallback) => {
                    const fallbackResolved = resolveName(fallbackName, nextStack);
                    return fallbackResolved || nestedFallback || `var(${fallbackName})`;
                });
            }
            return `var(${nestedName})`;
        }).trim();
        resolvedCache.set(key, resolved);
        return resolved;
    };

    // 删除宿主旧 CSS 解析器不识别的 --自定义属性声明，保留前导 { / ; 作为声明边界。
    let repaired = source.replace(declarationRe, (full, boundary) => boundary || '');
    repaired = repaired.replace(/\{\s*(?:;\s*)+/g, '{');
    repaired = replaceCssVarFunctions(repaired, (name, fallback) => {
        const resolved = resolveName(name);
        if (resolved) return resolved;
        if (fallback) {
            return replaceCssVarFunctions(fallback, (fallbackName, nestedFallback) => {
                const fallbackResolved = resolveName(fallbackName);
                return fallbackResolved || nestedFallback || `var(${fallbackName})`;
            });
        }
        // 无法可靠解析时保留原 var()，绝不再用 initial 覆盖健康 UI 的颜色与背景。
        return `var(${name})`;
    });

    return repaired;
}


function repairLikelyBareRootSelector(cssText, htmlText) {
    let css = String(cssText || '');
    const html = String(htmlText || '');
    const classTokens = [];
    const classRe = /\sclass\s*=\s*(["'])([^"']+)\1/gi;
    let classMatch;
    while ((classMatch = classRe.exec(html))) {
        String(classMatch[2] || '').split(/\s+/).forEach(token => {
            if (/^rabbit-scenery-[a-z0-9_-]+$/i.test(token)) classTokens.push(token);
        });
    }

    for (const className of classTokens) {
        if (new RegExp(`\\.${escapeRegExp(className)}\\s*\\{`, 'i').test(css)) continue;
        const suffix = className.replace(/^rabbit-scenery-/i, '');
        const candidates = [className, suffix].filter(Boolean);
        for (const candidate of candidates) {
            const bareRe = new RegExp(`(^|})\\s*${escapeRegExp(candidate)}\\s*\\{`, 'i');
            if (!bareRe.test(css)) continue;
            css = css.replace(bareRe, (full, boundary) => `${boundary || ''}.${className}{`);
            break;
        }
    }
    return css;
}

// CSS 声明级保全：模型偶尔把 filter() 错塞进 transform 值中，
// 例如 transform: scale(1.1) filter(blur(4px));。
// 某些宿主 CSS 处理器会因此放弃整份样式。这里只修复这一种可明确还原的误写；
// 若 filter( 外层括号本身无法闭合，则仅丢弃该条 transform 声明，保住其余 CSS/HTML。

function splitWrappedFilterFromTransformValue(rawValue) {
    const source = String(rawValue || '');
    const pieces = [];
    const filters = [];
    let cursor = 0;
    let index = 0;
    let depth = 0;
    let quote = '';
    let escaped = false;
    let malformed = false;

    while (index < source.length) {
        const char = source[index];
        if (quote) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            index += 1;
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            index += 1;
            continue;
        }
        if (char === '(') {
            depth += 1;
            index += 1;
            continue;
        }
        if (char === ')') {
            depth = Math.max(0, depth - 1);
            index += 1;
            continue;
        }

        if (depth === 0 && /[a-zA-Z_-]/.test(char)) {
            const tokenMatch = /^filter\s*\(/i.exec(source.slice(index));
            const previous = index > 0 ? source[index - 1] : '';
            if (tokenMatch && !/[a-zA-Z0-9_-]/.test(previous)) {
                const openIndex = index + tokenMatch[0].lastIndexOf('(');
                let scan = openIndex + 1;
                let filterDepth = 1;
                let filterQuote = '';
                let filterEscaped = false;
                while (scan < source.length && filterDepth > 0) {
                    const scanChar = source[scan];
                    if (filterQuote) {
                        if (filterEscaped) filterEscaped = false;
                        else if (scanChar === '\\') filterEscaped = true;
                        else if (scanChar === filterQuote) filterQuote = '';
                    } else if (scanChar === '"' || scanChar === "'") {
                        filterQuote = scanChar;
                    } else if (scanChar === '(') {
                        filterDepth += 1;
                    } else if (scanChar === ')') {
                        filterDepth -= 1;
                    }
                    scan += 1;
                }

                if (filterDepth !== 0) {
                    malformed = true;
                    break;
                }

                const closeIndex = scan - 1;
                const filterValue = source.slice(openIndex + 1, closeIndex).trim();
                if (!filterValue || /[;{}]/.test(filterValue)) {
                    malformed = true;
                    break;
                }

                pieces.push(source.slice(cursor, index));
                filters.push(filterValue);
                cursor = closeIndex + 1;
                index = cursor;
                continue;
            }
        }
        index += 1;
    }

    if (malformed) return { changed: true, malformed: true, transformValue: '', filterValue: '' };
    if (!filters.length) return { changed: false, malformed: false, transformValue: source, filterValue: '' };

    pieces.push(source.slice(cursor));
    const transformValue = pieces.join(' ').replace(/\s{2,}/g, ' ').trim();
    const filterValue = filters.join(' ').replace(/\s{2,}/g, ' ').trim();
    return { changed: true, malformed: false, transformValue, filterValue };
}

// CSS 注释剥离急救：SillyTavern/Markdown 的换行与强调解析偶尔会破坏
// <style> 内的 /* ... */ 边界，继而让宿主 CSS 解析器误报 missing '}'。
// 注释不参与最终视觉，因此在代码块急救或单条纯文字急救实际整理样式时，
// 仅删除引号外的 CSS 注释并以一个空格占位；不开对应急救时不会调用。

export function stripCssComments(cssText) {
    const source = String(cssText || '');
    let output = '';
    let index = 0;
    let quote = '';
    let escaped = false;

    while (index < source.length) {
        const char = source[index];
        const next = source[index + 1] || '';

        if (quote) {
            output += char;
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            index += 1;
            continue;
        }

        if (char === '"' || char === "'") {
            quote = char;
            output += char;
            index += 1;
            continue;
        }

        if (char === '/' && next === '*') {
            const closeIndex = source.indexOf('*/', index + 2);
            // 未闭合注释已经会吞掉后续全部 CSS；急救时直接丢弃其余注释内容，
            // 至少保住注释之前已经完整的规则，而不是把损坏边界继续交给宿主解析器。
            if (closeIndex < 0) break;
            if (output && !/\s$/.test(output)) output += ' ';
            index = closeIndex + 2;
            while (index < source.length && /[ \t]/.test(source[index])) index += 1;
            continue;
        }

        output += char;
        index += 1;
    }

    return output;
}


function decodeMinimalSvgHtmlEntities(text) {
    return String(text || '')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#(?:39|x27);/gi, "'")
        .replace(/&amp;/gi, '&');
}


function percentEncodeSvgDataPayload(payload) {
    const source = decodeMinimalSvgHtmlEntities(payload);
    let output = '';
    for (let index = 0; index < source.length;) {
        if (source[index] === '%' && /^[0-9a-f]{2}$/i.test(source.slice(index + 1, index + 3))) {
            output += source.slice(index, index + 3);
            index += 3;
            continue;
        }
        const codePoint = source.codePointAt(index);
        const char = String.fromCodePoint(codePoint);
        index += char.length;
        if (/^[A-Za-z0-9._~-]$/.test(char)) {
            output += char;
            continue;
        }
        output += encodeURIComponent(char).replace(/[!'()*]/g, token => `%${token.charCodeAt(0).toString(16).toUpperCase()}`);
    }
    return output;
}

/**
 * 将 <style> 中仍携带原始 XML 的 quoted SVG data URI 转成百分号编码。
 * 浏览器原生 CSS 能接受原始 XML，但部分 SillyTavern 美化/作用域解析器会被其中的
 * <svg>、引号或内部 url(#id) 扰乱，并在后续选择器处报“property missing ':'”。
 * 仅处理明确含原始 <svg> 的 quoted data URI；base64 与已编码资源保持不变。
 */

function normalizeQuotedCssSvgDataUris(cssText) {
    let source = String(cssText || '');
    let cursor = 0;
    let repairs = 0;

    while (repairs < 24) {
        const lower = source.toLowerCase();
        const uriIndex = lower.indexOf('data:image/svg+xml', cursor);
        if (uriIndex < 0) break;

        const urlStart = lower.lastIndexOf('url(', uriIndex);
        if (urlStart < 0) {
            cursor = uriIndex + 18;
            continue;
        }

        let quoteIndex = urlStart + 4;
        while (quoteIndex < source.length && /\s/.test(source[quoteIndex])) quoteIndex += 1;
        const quote = source[quoteIndex];
        if (quote !== '"' && quote !== "'") {
            cursor = uriIndex + 18;
            continue;
        }

        let quoteEnd = quoteIndex + 1;
        let escaped = false;
        for (; quoteEnd < source.length; quoteEnd += 1) {
            const char = source[quoteEnd];
            if (escaped) {
                escaped = false;
                continue;
            }
            if (char === '\\') {
                escaped = true;
                continue;
            }
            if (char === quote) break;
        }
        if (quoteEnd >= source.length) {
            cursor = uriIndex + 18;
            continue;
        }

        let closeParen = quoteEnd + 1;
        while (closeParen < source.length && /\s/.test(source[closeParen])) closeParen += 1;
        if (source[closeParen] !== ')') {
            cursor = uriIndex + 18;
            continue;
        }

        const commaIndex = source.indexOf(',', uriIndex);
        if (commaIndex < 0 || commaIndex >= quoteEnd) {
            cursor = uriIndex + 18;
            continue;
        }

        const payload = source.slice(commaIndex + 1, quoteEnd);
        if (!/(?:<|&lt;)svg\b/i.test(payload)) {
            cursor = quoteEnd + 1;
            continue;
        }

        const encodedPayload = percentEncodeSvgDataPayload(payload);
        source = `${source.slice(0, commaIndex + 1)}${encodedPayload}${source.slice(quoteEnd)}`;
        repairs += 1;
        cursor = commaIndex + 1 + encodedPayload.length;
    }

    return source;
}


function repairJoinedCssLengthTokens(value) {
    return String(value || '').replace(
        /(-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|vw|vh|vmin|vmax|%))(?=-?(?:\d|\.\d))/gi,
        '$1 ',
    );
}


function repairMalformedCssDeclarations(cssText) {
    let repaired = String(cssText || '').replace(
        /(^|[;{])(\s*)transform\s*:\s*([^;{}]+)(;|(?=}))/gi,
        (full, boundary, spacing, rawValue, terminator) => {
            const important = /\s*!important\s*$/i.test(rawValue);
            const value = String(rawValue || '').replace(/\s*!important\s*$/i, '').trim();
            const split = splitWrappedFilterFromTransformValue(value);
            if (!split.changed) return full;
            if (split.malformed) return `${boundary}${spacing}`;

            const priority = important ? ' !important' : '';
            const declarations = [];
            if (split.transformValue) declarations.push(`transform: ${split.transformValue}${priority}`);
            if (split.filterValue) declarations.push(`filter: ${split.filterValue}${priority}`);
            return `${boundary}${spacing}${declarations.join(';')}${terminator === ';' ? ';' : ''}`;
        },
    );

    // 模型偶尔把 box-model 的相邻长度值粘在一起，例如
    // padding:30px20px / margin:0 0 10px0。这里只修明确允许多值的属性，
    // 不做全 CSS 猜测，避免误伤 URL、色值或自定义标识符。
    // 不消费声明后的分号，这样同一 rule 中连续多个坏声明可以在一次扫描里全部修复。
    repaired = repaired.replace(
        /(^|[;{])(\s*)((?:padding|margin|inset|gap|row-gap|column-gap|border-radius|scroll-margin|scroll-padding))\s*:\s*([^;{}]+)(?=;|})/gi,
        (full, boundary, spacing, property, rawValue) => {
            const value = repairJoinedCssLengthTokens(rawValue);
            if (value === rawValue) return full;
            return `${boundary}${spacing}${property}: ${String(value).trim()}`;
        },
    );

    // transition:all0.7s / transition:transform1.5s 是另一类常见粘连；
    // 仅修 CSS 过渡属性关键字与紧随其后的时长，避免猜测自定义标识符。
    repaired = repaired.replace(
        /(^|[;{])(\s*)transition\s*:\s*([^;{}]+)(;|(?=}))/gi,
        (full, boundary, spacing, rawValue, terminator) => {
            const value = String(rawValue || '').replace(
                /\b(all|transform|opacity|filter|width|height|max-height|min-height|left|right|top|bottom|color|background|background-color|box-shadow|clip-path)(?=\d*\.?\d+(?:ms|s)\b)/gi,
                '$1 ',
            );
            if (value === rawValue) return full;
            return `${boundary}${spacing}transition: ${value.trim()}${terminator === ';' ? ';' : ''}`;
        },
    );

    // transform 函数之间必须分隔；模型偶尔会输出 rotate(0deg)translateY(0)。
    repaired = repaired.replace(
        /(^|[;{])(\s*)transform\s*:\s*([^;{}]+)(;|(?=}))/gi,
        (full, boundary, spacing, rawValue, terminator) => {
            const value = String(rawValue || '').replace(/\)(?=[a-z-]+\()/gi, ') ');
            if (value === rawValue) return full;
            return `${boundary}${spacing}transform: ${value.trim()}${terminator === ';' ? ';' : ''}`;
        },
    );

    // 渐变色标也会出现 rgba(...)100% 这种粘连，只在 background 声明中补空格。
    repaired = repaired.replace(
        /(^|[;{])(\s*)(background(?:-image)?)\s*:\s*([^;{}]+)(;|(?=}))/gi,
        (full, boundary, spacing, property, rawValue, terminator) => {
            const value = String(rawValue || '').replace(/\)(?=\d+(?:\.\d+)?%)/g, ') ');
            if (value === rawValue) return full;
            return `${boundary}${spacing}${property}: ${value.trim()}${terminator === ';' ? ';' : ''}`;
        },
    );

    // 只修 CSS 保留字之间的高置信粘连，不猜测作者意图。
    repaired = repaired.replace(
        /(^|[;{])(\s*)((?:-webkit-)?animation(?:-name)?)\s*:\s*([^;{}]+)(?=;|})/gi,
        (full, boundary, spacing, property, rawValue) => {
            const value = String(rawValue || '')
                .replace(/\b(linear|ease|ease-in|ease-out|ease-in-out)(?=infinite(?:alternate(?:-reverse)?)?\b)/gi, '$1 ')
                .replace(/\binfinite(?=alternate(?:-reverse)?\b)/gi, 'infinite ');
            if (value === rawValue) return full;
            return `${boundary}${spacing}${property}: ${value.trim()}`;
        },
    );
    repaired = repaired.replace(/\btransparent(?=\d+(?:\.\d+)?%)/gi, 'transparent ');
    repaired = repaired.replace(
        /(^|[;{])(\s*)box-shadow\s*:\s*([^;{}]+)(?=;|})/gi,
        (full, boundary, spacing, rawValue) => {
            const value = String(rawValue || '').replace(/\b0\s+0(?=\d+(?:\.\d+)?(?:px|r?em|vh|vw|vmin|vmax|%)\b)/gi, '0 0 ');
            if (value === rawValue) return full;
            return `${boundary}${spacing}box-shadow: ${value.trim()}`;
        },
    );

    return repaired;
}


function repairPlainTextCssInHtml(htmlText) {
    const html = String(htmlText || '');
    // CSS 变量可能定义在主容器的 inline style 中、却在局部 <style> 中被引用。
    // 先从整条兔子镜收集变量，避免把原本可用的配色错误替换成 initial。
    const inheritedValues = collectCssCustomPropertyValuesFromHtml(html);
    return html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (full, attrs = '', css = '') => {
        const normalized = String(css || '')
            .replace(/<br\s*\/?>/gi, '')
            .replace(/\r\n?/g, '\n');
        const commentStripped = stripCssComments(normalized);
        const svgDataUriNormalized = normalizeQuotedCssSvgDataUris(commentStripped);
        const declarationRepaired = repairMalformedCssDeclarations(svgDataUriNormalized);
        const expanded = expandUnsupportedCssCustomProperties(declarationRepaired, inheritedValues);
        const repaired = repairLikelyBareRootSelector(expanded, html);
        return `<style${attrs}>${repaired}</style>`;
    });
}


function needsPlainTextCssRescue(text) {
    const source = decodeHtmlEntities(String(text || ''));
    if (!/<(?:toto|details)\b[\s\S]*?<style\b/i.test(source)) return false;
    return /(?:^|[;{])\s*--[^\s:;{}]+\s*:|var\s*\(/i.test(source);
}


export function repairMalformedRabbitMirrorMarkup(htmlText = '') {
    let html = String(htmlText || '');
    const duplicateClosing = new RegExp(
        `<\\s*\\/\\s*(${MALFORMED_HTML_TAG_NAMES})(${MALFORMED_HTML_ATTR_NAMES})\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)\\s*>\\s*<\\s*\\/\\s*\\1\\s*>`,
        'gi',
    );
    const malformedOpening = new RegExp(
        `<\\s*(${MALFORMED_HTML_TAG_NAMES})(${MALFORMED_HTML_ATTR_NAMES})(?=\\s*=)`,
        'gi',
    );
    const malformedClosing = new RegExp(
        `<\\s*\\/\\s*(${MALFORMED_HTML_TAG_NAMES})(?:${MALFORMED_HTML_ATTR_NAMES})(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+))?\\s*>`,
        'gi',
    );

    // 模型偶尔把“标签名 + 第一个属性”粘在一起，例如 <divclass=...>、<labelfor=...>。
    // 先折叠“损坏闭标签 + 重复标准闭标签”，避免修复后多关一层容器。
    html = html.replace(duplicateClosing, '</$1>');
    html = html.replace(malformedOpening, '<$1 $2');
    html = html.replace(malformedClosing, '</$1>');
    return html;
}


export function rescuePlainTextRabbitMirrorOutput(responseText = '') {
    let text = repairMalformedRabbitMirrorMarkup(normalizeMirrorAttribute(String(responseText || '')));
    text = repairPlainTextCssInHtml(text);
    text = text.replace(TOTO_BLOCK_RE, block => compactTotoBlock(block));
    return text.trim();
}


function createRabbitMirrorCssScopeToken(sourceText) {
    rabbitMirrorCssScopeCounter += 1;
    const signature = hashInteractionSignature(sourceText).slice(0, 7);
    const timePart = Date.now().toString(36);
    const countPart = rabbitMirrorCssScopeCounter.toString(36);
    const randomPart = Math.random().toString(36).slice(2, 6);
    return `rmcss-${signature}-${timePart}-${countPart}-${randomPart}`;
}


function prepareRabbitMirrorCssScope(html) {
    const source = String(html || '');
    const existing = new RegExp(`${RABBIT_MIRROR_CSS_SCOPE_ATTR}\\s*=\\s*(["'])([^"']+)\\1`, 'i').exec(source);
    const scopeToken = existing?.[2] || createRabbitMirrorCssScopeToken(source);
    const scopeSelector = `[${RABBIT_MIRROR_CSS_SCOPE_ATTR}="${scopeToken}"]`;
    const classPrefix = `rmc-${scopeToken.replace(/^rmcss-/i, '')}-`;

    const markTag = (tag) => {
        const attrRe = new RegExp(`\\s${RABBIT_MIRROR_CSS_SCOPE_ATTR}\\s*=\\s*(["']).*?\\1`, 'i');
        if (attrRe.test(tag)) return tag.replace(attrRe, ` ${RABBIT_MIRROR_CSS_SCOPE_ATTR}="${scopeToken}"`);
        return tag.replace(/^<([a-z][\w:-]*)\b/i, `<$1 ${RABBIT_MIRROR_CSS_SCOPE_ATTR}="${scopeToken}"`);
    };

    let prepared = source.replace(/<toto\b[^>]*>/i, markTag);
    prepared = prepared.replace(/<(details|div|section|article)\b[^>]*>/i, markTag);
    return { html: prepared, scopeToken, scopeSelector, classPrefix };
}


function findCssTopLevelDelimiter(sourceText, startIndex = 0) {
    const source = String(sourceText || '');
    let quote = '';
    let escaped = false;
    let parentheses = 0;
    let brackets = 0;

    for (let index = startIndex; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';
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
        if (char === '/' && next === '*') {
            const close = source.indexOf('*/', index + 2);
            if (close < 0) return { index: source.length, char: '' };
            index = close + 1;
            continue;
        }
        if (char === '(') parentheses += 1;
        else if (char === ')') parentheses = Math.max(0, parentheses - 1);
        else if (char === '[') brackets += 1;
        else if (char === ']') brackets = Math.max(0, brackets - 1);
        else if (!parentheses && !brackets && (char === '{' || char === ';')) return { index, char };
    }
    return { index: -1, char: '' };
}


function findCssMatchingBrace(sourceText, openIndex) {
    const source = String(sourceText || '');
    if (source[openIndex] !== '{') return -1;
    let depth = 1;
    let quote = '';
    let escaped = false;

    for (let index = openIndex + 1; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';
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
        if (char === '/' && next === '*') {
            const close = source.indexOf('*/', index + 2);
            if (close < 0) return -1;
            index = close + 1;
            continue;
        }
        if (char === '{') depth += 1;
        else if (char === '}') {
            depth -= 1;
            if (!depth) return index;
        }
    }
    return -1;
}


function readCssAtRuleKeyword(statementText) {
    const source = String(statementText || '').trimStart();
    if (!source.startsWith('@')) return '';
    let index = 1;
    let keyword = '';
    while (index < source.length) {
        const char = source[index];
        if (/[A-Za-z0-9_-]/.test(char)) {
            keyword += char;
            index += 1;
            continue;
        }
        if (char === '\\') {
            index += 1;
            let hex = '';
            while (index < source.length && hex.length < 6 && /[0-9A-Fa-f]/.test(source[index])) {
                hex += source[index];
                index += 1;
            }
            if (hex) {
                try { keyword += String.fromCodePoint(parseInt(hex, 16)); } catch {}
                if (/\s/.test(source[index] || '')) index += 1;
                continue;
            }
            if (index < source.length) {
                keyword += source[index];
                index += 1;
                continue;
            }
        }
        break;
    }
    return keyword.toLowerCase();
}


function transformCssRuleList(cssText, selectorTransform) {
    const source = String(cssText || '');
    const recursiveAtRules = new Set(['media', 'supports', 'container', 'layer', 'document', 'starting-style', 'scope']);
    let output = '';
    let cursor = 0;

    while (cursor < source.length) {
        const delimiter = findCssTopLevelDelimiter(source, cursor);
        if (delimiter.index < 0) {
            output += source.slice(cursor);
            break;
        }
        if (delimiter.char === ';') {
            const statement = source.slice(cursor, delimiter.index + 1);
            // @import 会引入完全未经过逐镜 selector scope 的外部样式；按 CSS 标识符规则读取
            // at-keyword，连 @\69mport / @\000069 mport 这类转义写法也一并拦截。
            // 只丢 import，本地 @layer/@namespace 等其他语句保持原行为。
            if (readCssAtRuleKeyword(statement) !== 'import') output += statement;
            else output += ' ';
            cursor = delimiter.index + 1;
            continue;
        }

        const closeIndex = findCssMatchingBrace(source, delimiter.index);
        if (closeIndex < 0) {
            output += source.slice(cursor);
            break;
        }

        const rawPrelude = source.slice(cursor, delimiter.index);
        const leading = rawPrelude.match(/^\s*/)?.[0] || '';
        const trailing = rawPrelude.match(/\s*$/)?.[0] || '';
        const prelude = rawPrelude.trim();
        const body = source.slice(delimiter.index + 1, closeIndex);

        if (prelude.startsWith('@')) {
            // CSS at-keyword 允许转义（例如 @\6d edia）。复用同一解析器，避免通过
            // 转义 @media/@supports 绕过递归 selector scope。
            const atName = readCssAtRuleKeyword(prelude);
            const isKeyframes = atName.endsWith('keyframes');
            const transformedBody = !isKeyframes && recursiveAtRules.has(atName)
                ? transformCssRuleList(body, selectorTransform)
                : body;
            output += `${leading}${prelude}${trailing}{${transformedBody}}`;
        } else {
            const transformedPrelude = typeof selectorTransform === 'function'
                ? selectorTransform(prelude)
                : prelude;
            output += `${leading}${transformedPrelude}${trailing}{${body}}`;
        }
        cursor = closeIndex + 1;
    }
    return output;
}


export function splitCssSelectorList(selectorText) {
    const source = String(selectorText || '');
    const parts = [];
    let start = 0;
    let quote = '';
    let escaped = false;
    let parentheses = 0;
    let brackets = 0;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
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
        if (char === '(') parentheses += 1;
        else if (char === ')') parentheses = Math.max(0, parentheses - 1);
        else if (char === '[') brackets += 1;
        else if (char === ']') brackets = Math.max(0, brackets - 1);
        else if (char === ',' && !parentheses && !brackets) {
            parts.push(source.slice(start, index));
            start = index + 1;
        }
    }
    parts.push(source.slice(start));
    return parts;
}


function rewriteSimpleCssIdSelectorsAsAttributes(selectorText, allowedIds = null) {
    const source = String(selectorText || '');
    let output = '';
    let quote = '';
    let escaped = false;
    let brackets = 0;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        if (quote) {
            output += char;
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            output += char;
            continue;
        }
        if (char === '[') {
            brackets += 1;
            output += char;
            continue;
        }
        if (char === ']') {
            brackets = Math.max(0, brackets - 1);
            output += char;
            continue;
        }
        if (!brackets && char === '#' && /[A-Za-z_-]/.test(source[index + 1] || '')) {
            let end = index + 2;
            while (end < source.length && /[\w-]/.test(source[end])) end += 1;
            const id = source.slice(index + 1, end);
            if (!allowedIds || allowedIds.has(id)) output += `[id="${id}"]`;
            else output += source.slice(index, end);
            index = end - 1;
            continue;
        }
        output += char;
    }
    return output;
}


function collectRabbitMirrorCheckedStateIds(cssTexts) {
    const ids = new Set();
    for (const cssText of cssTexts || []) {
        transformCssRuleList(cssText, (prelude) => {
            for (const selector of splitCssSelectorList(prelude)) {
                if (!/:checked\b/i.test(selector)) continue;
                const rewritten = rewriteSimpleCssIdSelectorsAsAttributes(selector);
                for (const match of rewritten.matchAll(/\[id="([A-Za-z_-][\w-]*)"\]/g)) ids.add(match[1]);
            }
            return prelude;
        });
    }
    return ids;
}


function visitSimpleCssClassTokens(selectorText, visitor) {
    const source = String(selectorText || '');
    let output = '';
    let quote = '';
    let escaped = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        if (quote) {
            output += char;
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            output += char;
            continue;
        }
        if (char === '.' && /[A-Za-z_]/.test(source[index + 1] || '')) {
            let end = index + 2;
            while (end < source.length && /[\w-]/.test(source[end])) end += 1;
            const className = source.slice(index + 1, end);
            const replacement = typeof visitor === 'function' ? visitor(className) : className;
            output += `.${replacement || className}`;
            index = end - 1;
            continue;
        }
        output += char;
    }
    return output;
}


function collectRabbitMirrorCssClasses(cssTexts) {
    const names = new Set();
    for (const cssText of cssTexts || []) {
        transformCssRuleList(cssText, (prelude) => {
            visitSimpleCssClassTokens(prelude, (className) => {
                names.add(className);
                return className;
            });
            return prelude;
        });
    }
    return names;
}


function buildRabbitMirrorClassMap(cssTexts, classPrefix) {
    const map = new Map();
    for (const className of collectRabbitMirrorCssClasses(cssTexts)) {
        if (!className) continue;
        if (className.startsWith(classPrefix)) {
            map.set(className, className);
            // 旧缓存可能已经把 CSS selector 加上逐镜前缀，但损坏的
            // <divclass="rm-..."> 在此前版本中没有被修成同一个 class。
            // 为当前 scope 的已前缀 class 补一条“原始后缀 → 已前缀 class”别名，
            // 只用于重清理旧缓存，不会改变新生成兔子镜的正常 class 映射。
            const legacyClassName = className.slice(classPrefix.length);
            if (legacyClassName && !map.has(legacyClassName)) map.set(legacyClassName, className);
        } else {
            map.set(className, `${classPrefix}${className}`);
        }
    }
    return map;
}


function collectRabbitMirrorKeyframeNames(cssTexts) {
    const names = new Set();
    const pattern = /@(?:-webkit-)?keyframes\s+(?:(["'])([^"']+)\1|([^\s{]+))/gi;
    for (const cssText of cssTexts || []) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(String(cssText || '')))) {
            const name = String(match[2] || match[3] || '').trim();
            if (name) names.add(name);
        }
    }
    pattern.lastIndex = 0;
    return names;
}


function buildRabbitMirrorKeyframeMap(cssTexts, scopeToken) {
    const map = new Map();
    const prefix = `rmkf-${String(scopeToken || '').replace(/^rmcss-/i, '')}-`;
    for (const name of collectRabbitMirrorKeyframeNames(cssTexts)) {
        if (!name || name.startsWith(prefix)) {
            map.set(name, name);
            continue;
        }
        const identifierSafe = /^-?[_a-zA-Z][\w-]*$/.test(name);
        const safeName = identifierSafe
            ? name
            : `animation-${hashInteractionSignature(name).slice(0, 7)}`;
        map.set(name, `${prefix}${safeName}`);
    }
    return map;
}


function rewriteRabbitMirrorAnimationNameTokens(valueText, keyframeMap) {
    let value = String(valueText || '');
    if (!keyframeMap?.size) return value;
    for (const [oldName, newName] of keyframeMap.entries()) {
        if (!oldName || oldName === newName) continue;
        const escaped = escapeRegExp(oldName);
        value = value
            .replace(new RegExp(`(["'])${escaped}\\1`, 'g'), `$1${newName}$1`)
            .replace(new RegExp(`(^|[^\\w-])${escaped}(?![\\w-])`, 'g'), `$1${newName}`);
    }
    return value;
}


function rewriteRabbitMirrorAnimationDeclarations(cssText, keyframeMap) {
    if (!keyframeMap?.size) return String(cssText || '');
    return String(cssText || '').replace(
        /(^|[;{])(\s*(?:-webkit-)?animation(?:-name)?\s*:\s*)([^;{}]*)(?=;|}|$)/gi,
        (match, boundary, property, value) => `${boundary}${property}${rewriteRabbitMirrorAnimationNameTokens(value, keyframeMap)}`,
    );
}


function rewriteRabbitMirrorKeyframeDefinitions(cssText, keyframeMap) {
    if (!keyframeMap?.size) return String(cssText || '');
    return String(cssText || '').replace(
        /(@(?:-webkit-)?keyframes\s+)(?:(["'])([^"']+)\2|([^\s{]+))/gi,
        (match, prefix, quote, quotedName, bareName) => {
            const oldName = String(quotedName || bareName || '').trim();
            const newName = keyframeMap.get(oldName) || oldName;
            return quote ? `${prefix}${quote}${newName}${quote}` : `${prefix}${newName}`;
        },
    );
}


function rewriteRabbitMirrorInlineAnimationStyles(htmlText, keyframeMap) {
    if (!keyframeMap?.size) return String(htmlText || '');
    return String(htmlText || '').replace(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi, (match, quote, styleText) => {
        const rewritten = rewriteRabbitMirrorAnimationDeclarations(styleText, keyframeMap);
        return ` style=${quote}${rewritten}${quote}`;
    });
}


function selectorStartsWithSafeRabbitMirrorScope(selectorText, scopeSelector) {
    const match = /^\[data-rabbit-mirror-css-scope="([^"]+)"\]$/.exec(String(scopeSelector || '').trim());
    const scopeValue = String(match?.[1] || '').trim();
    if (!scopeValue) return false;
    const pattern = new RegExp(
        `^\\s*\\[\\s*data-rabbit-mirror-css-scope\\s*=\\s*["']${escapeRegExp(scopeValue)}["']\\s*\\]`,
        'i',
    );
    const selector = String(selectorText || '');
    const scoped = pattern.exec(selector);
    if (!scoped) return false;
    const remainder = selector.slice(scoped[0].length);
    // 当前 scope 自身、其后代/子级或同元素 compound selector 都不会逃出镜面；
    // 兄弟/column combinator 则能把目标指向 scope 外，必须继续在外层再套一次 scope。
    return !/^\s*(?:[+~]|\|\|)/.test(remainder);
}


function scopeRabbitMirrorSelectorList(selectorText, scopeSelector, classMap, checkedStateIds) {
    return splitCssSelectorList(selectorText).map((rawSelector) => {
        // 高置信修复模型偶发的 `. className` 选择器笔误。点号后出现空白在 CSS 类选择器中本来就是无效语法，
        // 因此这里只把它恢复成 `.className`，不会改动正常后代选择器。
        const selectorWithClassSpacingFixed = rawSelector.trim().replace(/\.\s+([_a-zA-Z][\w-]*)/g, '.$1');
        // 部分宿主 CSS 作用域解析链会在原始资源解析受扰后，于 checkbox/radio 的 #id
        // 状态规则附近中断。只改写明确参与 :checked 的状态 ID，避免扩大影响范围；
        // label/控件语义不变，后续 ID 隔离也会继续同步 [id="..."] 引用。
        const idSafeSelector = rewriteSimpleCssIdSelectorsAsAttributes(selectorWithClassSpacingFixed, checkedStateIds);
        let selector = visitSimpleCssClassTokens(idSafeSelector, className => classMap.get(className) || className);
        selector = selector
            .replace(/:root\b/gi, scopeSelector)
            .replace(/:host\b/gi, scopeSelector)
            .replace(/^html(?:\s+body)?(?=\s|[.#[:])/i, scopeSelector)
            .replace(/^body(?=\s|[.#[:])/i, scopeSelector);
        // 只有“当前这面镜子的精确 scope token”才能证明已经隔离。
        // 泛化的 [data-rabbit-mirror-css-scope] 仍必须再套当前 scope，避免跨镜样式串染。
        if (!selector || selectorStartsWithSafeRabbitMirrorScope(selector, scopeSelector)) return selector;
        return `${scopeSelector} ${selector}`;
    }).join(',');
}


function scopeRabbitMirrorCssText(cssText, scopeSelector, classMap, checkedStateIds, keyframeMap) {
    const scoped = transformCssRuleList(cssText, prelude => scopeRabbitMirrorSelectorList(prelude, scopeSelector, classMap, checkedStateIds));
    const definitionsRewritten = rewriteRabbitMirrorKeyframeDefinitions(scoped, keyframeMap);
    return rewriteRabbitMirrorAnimationDeclarations(definitionsRewritten, keyframeMap);
}


function splitJoinedRabbitMirrorClassToken(token, classMap) {
    const source = String(token || '').trim();
    if (!source || classMap.has(source)) return null;
    const candidates = new Set();
    for (const [left, leftMapped] of classMap.entries()) {
        if (!left || left.length < 4 || left.length >= source.length || !source.startsWith(left)) continue;
        const right = source.slice(left.length);
        if (right.length < 4) continue;
        const rightMapped = classMap.get(right);
        if (!rightMapped) continue;
        candidates.add(`${leftMapped}\u0000${rightMapped}`);
    }
    if (candidates.size !== 1) return null;
    return [...candidates][0].split('\u0000');
}


function rewriteRabbitMirrorClassAttributes(htmlText, classMap) {
    if (!classMap?.size) return String(htmlText || '');
    return String(htmlText || '').replace(CLASS_ATTR_RE, (match, quote, classValue) => {
        const tokens = String(classValue || '').split(/\s+/).filter(Boolean);
        const rewritten = tokens.flatMap((token) => {
            const mapped = classMap.get(token);
            if (mapped) return [mapped];
            // 高置信修复模型把两个已知 class 粘成一个 token 的情况，
            // 例如 rm-content-secretrm-layer。只有唯一拆分时才动。
            return splitJoinedRabbitMirrorClassToken(token, classMap) || [token];
        });
        return rewritten.length ? ` class=${quote}${rewritten.join(' ')}${quote}` : '';
    });
}

// Some responses/host Markdown passes leave a complete keyframes rule as text
// with <br> separators. Recover only a whole standalone run, never prose, code
// examples, incomplete rules or general selectors. The normal sanitizer and
// per-mirror animation-name scoping still own the resulting stylesheet.

function completeStandaloneKeyframes(source) {
    if (!source || source.length > 8192) return false;
    let rest = source.trim(), rules = 0, frames = 0;
    while (rest && rules++ < 16) {
        const head = /^@(?:-webkit-)?keyframes\s+[a-zA-Z_][\w-]*\s*\{\s*/.exec(rest);
        if (!head) return false;
        rest = rest.slice(head[0].length);
        let count = 0;
        while (rest && rest[0] !== '}' && frames++ < 64) {
            const frame = /^(?:from|to|\d+(?:\.\d+)?%)(?:\s*,\s*(?:from|to|\d+(?:\.\d+)?%))*\s*\{[^{}<>]*\}\s*/.exec(rest);
            if (!frame) return false;
            rest = rest.slice(frame[0].length); count++;
        }
        if (!count || rest[0] !== '}') return false;
        rest = rest.slice(1).trim();
    }
    return !rest && rules > 0;
}


function restoreStandaloneKeyframesInTemplate(template) {
    const content = template?.content;
    if (!content || typeof document === 'undefined' || typeof document.createTreeWalker !== 'function'
        || !/@(?:-webkit-)?keyframes\b/.test(content.textContent || '')) return false;
    const walker = document.createTreeWalker(content, 4); // text nodes only
    const starts = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!/^\s*@(?:-webkit-)?keyframes\b/.test(node.nodeValue || '')
            || !node.parentElement?.closest('toto, details')
            || node.parentElement.closest('pre, code, textarea, script, style, svg, math, summary')) continue;
        let previous = node.previousSibling, precedingText = false;
        while (previous && (previous.nodeType === 3 || previous.nodeName === 'BR')) {
            if (previous.nodeType === 3 && previous.nodeValue.trim()) { precedingText = true; break; }
            previous = previous.previousSibling;
        }
        if (precedingText) continue;
        starts.push(node);
    }
    let changed = false;
    for (const start of starts) {
        if (!content.contains(start)) continue;
        const nodes = []; let text = '';
        for (let node = start; node && (node.nodeType === 3 || node.nodeName === 'BR'); node = node.nextSibling) {
            nodes.push(node); text += node.nodeType === 3 ? node.nodeValue : '\n';
            if (text.length > 8192) break;
        }
        if (!completeStandaloneKeyframes(text)) continue;
        const css = sanitizeGeneratedStyleSheet(text);
        if (!css.trim()) continue;
        const style = document.createElement('style'); style.textContent = css;
        start.before(style); for (const node of nodes) node.remove(); changed = true;
    }
    return changed;
}


function restoreStandaloneKeyframesInHtml(html) {
    if (typeof document === 'undefined' || !/(?:^|>)\s*@(?:-webkit-)?keyframes\b/.test(
        html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ''))) return html;
    const template = document.createElement('template'); template.innerHTML = html;
    if (!validateRabbitMirrorTemplateStructuralBudget(template) || !restoreStandaloneKeyframesInTemplate(template)
        || !validateRabbitMirrorTemplateStructuralBudget(template)) return html;
    return template.innerHTML;
}


export function compactTotoBlock(block) {
    const preparedScope = prepareRabbitMirrorCssScope(restoreStandaloneKeyframesInHtml(repairMalformedRabbitMirrorMarkup(normalizeMirrorAttribute(stripCodeBlockTriggers(block)))));
    let html = preparedScope.html;
    const rawStyleTexts = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
        .map(match => stripCssComments(String(match[1] || '').replace(/<br\s*\/?>/gi, '')));
    const classMap = buildRabbitMirrorClassMap(rawStyleTexts, preparedScope.classPrefix);
    const keyframeMap = buildRabbitMirrorKeyframeMap(rawStyleTexts, preparedScope.scopeToken);
    const checkedStateIds = collectRabbitMirrorCheckedStateIds(rawStyleTexts);
    const styleSlots = [];

    // 1. 保护 <style>...</style>，避免 CSS 文本被误插入 <br>。
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (match) => {
        const key = `%%RHT_STYLE_${styleSlots.length}%%`;
        const compactedStyle = match
            // 清理宿主换行转换残留；这是代码块与纯文字急救共用的样式整理底层。
            .replace(/<br\s*\/?>/gi, '')
            .replace(/\r\n?/g, '\n')
            .replace(/^[ \t]+/gm, '')
            .replace(/[ \t]+$/gm, '')
            .replace(/\n+/g, '')
            .replace(/>\s+</g, '><')
            .trim();
        styleSlots.push(compactedStyle.replace(
            /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/i,
            (full, openTag, css, closeTag) => {
                const commentStripped = stripCssComments(css);
                const svgDataUriNormalized = normalizeQuotedCssSvgDataUris(commentStripped);
                const repairedCss = repairMalformedCssDeclarations(svgDataUriNormalized);
                const scopedCss = scopeRabbitMirrorCssText(repairedCss, preparedScope.scopeSelector, classMap, checkedStateIds, keyframeMap);
                return `${openTag}${scopedCss}${closeTag}`;
            },
        ));
        return key;
    });

    // 2. 核心：清除每一行行首缩进，破坏 Markdown-it 的“行首 4 空格代码块”识别条件。
    html = html
        .replace(/\r\n?/g, '\n')
        .replace(/^[ \t]+/gm, '')
        .replace(/[ \t]+$/gm, '');

    // 3. 只删除标签之间的结构空白，尽量不碰属性文案。
    html = html
        .replace(/>\s+</g, '><')
        .replace(/\n(?=<)/g, '')
        .replace(/>\n/g, '>');

    // 4. 按标签切开：标签内换行压成空格；纯结构空白删除；真实文案里的换行转 <br>。
    html = html
        .split(/(<[^>]+>)/g)
        .map((part) => {
            if (!part) return '';
            if (part.startsWith('<')) {
                return part
                    .replace(/\s*\n\s*/g, ' ')
                    .replace(/[ \t]{2,}/g, ' ');
            }
            if (!part.trim()) return '';
            return part
                .replace(/[ \t]*\n[ \t]*/g, '<br>')
                .replace(/(?:<br>){3,}/g, '<br><br>');
        })
        .join('')
        .trim();

    // 5. 将当前兔子镜本地 CSS 使用的 class 与动画名改成逐镜唯一名称，
    // 阻断旧消息同名样式或 @keyframes 串入；只改 style 属性中的 animation 声明。
    html = rewriteRabbitMirrorClassAttributes(html, classMap);
    html = rewriteRabbitMirrorInlineAnimationStyles(html, keyframeMap);

    // 6. 还原 <style>。
    styleSlots.forEach((style, index) => {
        html = html.replace(`%%RHT_STYLE_${index}%%`, style);
    });

    return html
        .replace(CLASS_ATTR_RE, (match, quote, classValue) => {
            const kept = String(classValue || '')
                .split(/\s+/)
                .filter(token => token && !HIGHLIGHT_CLASS_TOKEN_RE.test(token));
            return kept.length ? ` class=${quote}${kept.join(' ')}${quote}` : '';
        })
        .replace(MULTI_BLANK_LINE_RE, '\n')
        .trim();
}


export function cleanRabbitMirrorOutput(responseText = '') {
    let text = repairMalformedRabbitMirrorMarkup(normalizeMirrorAttribute(stripHtmlComments(String(responseText || ''))))
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        .replace(/\r\n?/g, '\n')
        .trim();

    // 1. 如果整个回复被一层 ```html 包住，先扒掉最外层。
    const wholeFence = text.match(WHOLE_FENCED_BLOCK_RE);
    if (wholeFence) {
        const payload = decodeHtmlEntities(wholeFence[1]).trim();
        if (TOTO_BLOCK_SINGLE_RE.test(payload) || looksLikeCompleteHtmlBlock(payload)) text = payload;
    }

    // 2. 先处理已经有 <toto> 外壳的块：拆掉内部 ```html / <pre><code>，再压缩。
    text = text.replace(TOTO_BLOCK_RE, (block) => compactTotoBlock(unwrapCodeBlocksInsideToto(block)));

    // 3. 再处理外层裸露的代码块：如果整块是兔子镜或裸 HTML，则补边界。
    text = text.replace(FENCED_BLOCK_RE, (match, payload) => {
        const cleaned = cleanCodeFencePayload(payload);
        return cleaned || match;
    }).trim();

    // 4. 兜底：残留的首尾三反引号。
    text = text
        .replace(/^\s*```(?:html|HTML|xml|XML)?\s*\n?/i, '')
        .replace(/\n?\s*```\s*$/i, '')
        .trim();

    // 5. 如果模型漏掉 <toto>，接管消息末尾的完整裸 HTML 小剧场并补上边界。
    text = wrapTrailingNakedHtml(text);

    // 6. 补完边界后再处理/压缩一次，确保内部代码块也被拆掉。
    text = text.replace(TOTO_BLOCK_RE, (block) => compactTotoBlock(unwrapCodeBlocksInsideToto(block)));

    return text.trim();
}


export function cloneMessageForTransientRerender(message) {
    try {
        if (typeof structuredClone === 'function') return structuredClone(message);
    } catch {
        // fallback below
    }
    try {
        return JSON.parse(JSON.stringify(message));
    } catch {
        return { ...message };
    }
}


