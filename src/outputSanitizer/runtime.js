// Split from outputSanitizer.js — runtime.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';

export const RUNTIME_VERSION = '1.5.68';

export const RUNTIME_VERSION_ATTR = 'data-rabbit-mirror-runtime-version';


export const FEEDBACK_CAT_RUNTIME_STYLE_ID = 'rabbit-mirror-feedback-cat-runtime-style';

export const TOOL_ENTRY_HOST_ATTR = 'data-rabbit-mirror-tool-entry-host';

export const EXTERNAL_REFERENCE_NOTE_ATTR = 'data-rabbit-mirror-reference-note';

export const MIRROR_TITLE_PREFIX_ATTR = 'data-rabbit-mirror-title-prefix';

export const MIRROR_TITLE_PART_ATTR = 'data-rabbit-mirror-title-part';

export const MIRROR_TITLE_DISPLAY_ATTR = 'data-rabbit-mirror-title-display';

export const MIRROR_TITLE_SOURCE_ATTR = 'data-rabbit-mirror-title-source';


export const MIRROR_TOTO_SELECTOR = 'toto[data-rabbit-mirror="true"], toto[data-rabbit-hole="true"]';

export const REVERSIBLE_STYLE_BASELINE_ATTR = 'data-rm-reversible-style-baseline';

export const REVERSIBLE_TEXT_BASELINE_ATTR = 'data-rm-reversible-text-baseline';

export const RAW_SELF_MUTATION_HTML_BASELINE_ATTR = 'data-rm-self-mutation-html-baseline';

export const RAW_SELF_MUTATION_ACTIVE_ATTR = 'data-rm-self-mutation-active';

export const MAINTENANCE_RABBIT_ATTR = 'data-rabbit-mirror-maintenance-rabbit';

export const INTERACTION_HOME_ATTR = 'data-rabbit-mirror-interaction-home';

export const FEEDBACK_CAT_ATTR = 'data-rabbit-mirror-feedback-cat';

export const RECIPE_BUTTON_ATTR = 'data-rabbit-mirror-recipe';

export const RABBIT_MIRROR_CSS_SCOPE_ATTR = 'data-rabbit-mirror-css-scope';

export function ensureFeedbackCatRuntimeStyle() {
    if (typeof document === 'undefined') return;
    let style = document.getElementById(FEEDBACK_CAT_RUNTIME_STYLE_ID);
    if (!style) {
        style = document.createElement('style');
        style.id = FEEDBACK_CAT_RUNTIME_STYLE_ID;
        (document.head || document.documentElement)?.appendChild(style);
    }
    const css = `
summary span[${MIRROR_TITLE_PART_ATTR}][${MIRROR_TITLE_PART_ATTR}],
summary span[${MIRROR_TITLE_PART_ATTR}][${MIRROR_TITLE_PART_ATTR}]::before {
    all: unset !important;
    display: inline !important;
}
summary span[${MIRROR_TITLE_PART_ATTR}][${MIRROR_TITLE_PART_ATTR}]::before {
    content: attr(${MIRROR_TITLE_DISPLAY_ATTR}) !important;
}
summary span[${MIRROR_TITLE_PART_ATTR}]::after {
    content: none !important;
}
summary span[${MIRROR_TITLE_PART_ATTR}] > span[${MIRROR_TITLE_SOURCE_ATTR}][${MIRROR_TITLE_SOURCE_ATTR}] {
    display: none !important;
}
[${TOOL_ENTRY_HOST_ATTR}][${TOOL_ENTRY_HOST_ATTR}] {
    all: initial !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 2px !important;
    float: inline-end !important;
    flex: 0 0 auto !important;
    position: relative !important;
    z-index: 2147483000 !important;
    width: auto !important;
    min-width: max-content !important;
    height: auto !important;
    min-height: 0 !important;
    max-width: none !important;
    max-height: none !important;
    margin: 0 0 0 6px !important;
    margin-inline-start: auto !important;
    padding: 0 !important;
    overflow: visible !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    transform: none !important;
    filter: none !important;
    clip: auto !important;
    clip-path: none !important;
    white-space: nowrap !important;
    vertical-align: middle !important;
    color: inherit !important;
    font: inherit !important;
    line-height: 1 !important;
    isolation: isolate !important;
}
@media (max-width: 720px) {
[${TOOL_ENTRY_HOST_ATTR}][${TOOL_ENTRY_HOST_ATTR}] {
    float: none !important;
    display: flex !important;
    width: 100% !important;
    min-width: 100% !important;
    flex: 1 1 auto !important;
    margin: 2px 0 0 !important;
    margin-inline-start: 0 !important;
}
}
[${TOOL_ENTRY_HOST_ATTR}] > button[${MAINTENANCE_RABBIT_ATTR}],
[${TOOL_ENTRY_HOST_ATTR}] > button[${FEEDBACK_CAT_ATTR}],
[${TOOL_ENTRY_HOST_ATTR}] > button[${RECIPE_BUTTON_ATTR}] {
    all: initial !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
    z-index: 2147483001 !important;
    flex: 0 0 auto !important;
    width: auto !important;
    min-width: 0 !important;
    height: auto !important;
    min-height: 20px !important;
    max-width: none !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 1px 3px !important;
    border: 0 !important;
    border-radius: 5px !important;
    background: transparent !important;
    color: inherit !important;
    font: inherit !important;
    font-size: 14px !important;
    line-height: 1 !important;
    text-indent: 0 !important;
    letter-spacing: normal !important;
    white-space: nowrap !important;
    overflow: visible !important;
    visibility: visible !important;
    opacity: .94 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    transform: none !important;
    filter: none !important;
    clip: auto !important;
    clip-path: none !important;
    box-shadow: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    touch-action: manipulation !important;
    -webkit-tap-highlight-color: transparent !important;
}
[${TOOL_ENTRY_HOST_ATTR}] > button[${MAINTENANCE_RABBIT_ATTR}]::before,
[${TOOL_ENTRY_HOST_ATTR}] > button[${MAINTENANCE_RABBIT_ATTR}]::after,
[${TOOL_ENTRY_HOST_ATTR}] > button[${FEEDBACK_CAT_ATTR}]::before,
[${TOOL_ENTRY_HOST_ATTR}] > button[${FEEDBACK_CAT_ATTR}]::after,
[${TOOL_ENTRY_HOST_ATTR}] > button[${RECIPE_BUTTON_ATTR}]::before,
[${TOOL_ENTRY_HOST_ATTR}] > button[${RECIPE_BUTTON_ATTR}]::after {
    content: none !important;
    display: none !important;
}
`;
    if (style.textContent !== css) style.textContent = css;
}



export function isCurrentRuntime() {
    return globalThis.__rabbitMirrorRuntimeVersion === RUNTIME_VERSION;
}
// Cached SillyTavern script module. In module builds, chat is not guaranteed to be exposed on globalThis.

export function isFeedbackCatEnabled() {
    try {
        return getSettings().feedbackCatEnabled !== false;
    } catch {
        return true;
    }
}


export function isMaintenanceRabbitEnabled() {
    try {
        return getSettings().maintenanceRabbitEnabled !== false;
    } catch {
        return true;
    }
}



export function hashInteractionSignature(text) {
    let hash = 2166136261;
    for (const char of String(text || '')) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}


export function escapeRegExp(text) {
    return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



export function getRabbitMirrorLocalStyleElements(root) {
    if (!root?.querySelectorAll) return [];
    const styles = [];
    const seen = new Set();
    const remember = (style) => {
        if (!style || seen.has(style)) return;
        seen.add(style);
        styles.push(style);
    };

    root.querySelectorAll('style').forEach(remember);

    // SillyTavern/DOMPurify may strip the unknown <toto> wrapper while leaving its scoped
    // <style> as a sibling of <details>. In that layout the control/label remain inside the
    // details root, but :checked CSS sits outside it. Recover only styles carrying this exact
    // mirror's generated scope token, so another mirror in the same message cannot leak in.
    const scopedNode = root.matches?.('[data-rabbit-mirror-css-scope]')
        ? root
        : root.querySelector?.('[data-rabbit-mirror-css-scope]');
    const scopeValue = String(scopedNode?.getAttribute?.('data-rabbit-mirror-css-scope') || '').trim();
    if (!scopeValue) return styles;

    const boundary = root.closest?.('.mes_text') || root.closest?.('.mes') || root.parentElement;
    if (!boundary?.querySelectorAll) return styles;
    const scopePattern = new RegExp(
        `\\[\\s*data-rabbit-mirror-css-scope\\s*=\\s*["']${escapeRegExp(scopeValue)}["']\\s*\\]`,
        'i',
    );
    boundary.querySelectorAll('style').forEach(style => {
        if (scopePattern.test(String(style.textContent || ''))) remember(style);
    });
    return styles;
}


export function escapeCssIdentifier(value) {
    const text = String(value || '');
    try {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(text);
    } catch {
        // Fall through to a conservative identifier escape.
    }
    return text.replace(/(^-?\d)|[^a-zA-Z0-9_-]/g, match => `\\${match}`);
}


export function getRenderedRabbitMirrorInteractionRoots(root) {
    if (!root?.querySelectorAll) return [];
    const candidates = new Set();

    // scope 自己可能就是刚被维修兔 clone+replace 的兔子镜根节点。
    // querySelectorAll() 只搜索后代、不包含 scope 本身；若这里漏掉 self，
    // 维修前主动移除的运行时工具（维修兔 / 挨打猫 / 抽签）就无法立即重建。
    if (root.nodeType === 1) {
        if (root.matches?.(MIRROR_TOTO_SELECTOR)) candidates.add(root);
        else if (root.matches?.('details') && isRabbitMirrorDetails(root)) candidates.add(root);
    }

    root.querySelectorAll(MIRROR_TOTO_SELECTOR).forEach(node => candidates.add(node));

    // 部分酒馆渲染/净化链会移除未知的 <toto> 外壳，但保留带“兔子镜”标题的 <details>。
    // 代码块急救原本已有该兼容路径；交互急救也必须识别同一类实际渲染结果。
    root.querySelectorAll('details').forEach(details => {
        if (!isRabbitMirrorDetails(details)) return;
        if (details.closest(MIRROR_TOTO_SELECTOR)) return;
        candidates.add(details);
    });

    return [...candidates];
}


// beta.14.48: keep the automatic-frame removal migration, but do not render or infer any new frame color.
// Clean attributes and CSS variables written by beta.14.35-14.46 so cached mirrors
// immediately return to the original external-frame rendering without touching generated content.

export function clearMirrorTitleDisplayArtifacts(root) {
    // Rebuild display text from filtered source, never from model/persisted attributes.
    root?.querySelectorAll?.(`span[${MIRROR_TITLE_SOURCE_ATTR}], span[${MIRROR_TITLE_PART_ATTR}]`)
        .forEach(node => node.replaceWith(...node.childNodes));
    root?.querySelectorAll?.(`span[${MIRROR_TITLE_PREFIX_ATTR}]`).forEach(node => {
        if (!node.textContent) node.remove();
    });
}


export function getChatRoot() {
    if (typeof document === 'undefined') return null;
    return document.querySelector('#chat')
        || document.querySelector('#chat_block')
        || document.querySelector('.chat')
        || document.querySelector('[id*=chat]');
}


export function isInsideChatMessage(node) {
    const root = getChatRoot();
    if (!root || !node || !root.contains(node)) return false;
    // 只允许修聊天区，绝不碰扩展设置页/弹窗，避免再次影响其他插件勾选。
    // 注意：不要用 .drawer-content 做全局排除，部分主题/插件会把聊天消息也包在 drawer 类容器里。
    if (node.closest('#extensions_settings, #extensions_settings2, #rm_extensions_block, #extensionsMenu, .popup, .modal, .ui-dialog, [data-rm-theater-favorite-viewer], [data-rm-theater-favorite-library], [data-rm-theater-favorite-stage], [data-rm-theater-favorite-host]')) return false;
    const messageScope = node.closest('.mes, [mesid], .mes_text, [data-message-id], [data-messageid], .swipe_right, .swipe_left');
    return !!messageScope || root === node.closest('#chat') || root === node.closest('#chat_block');
}


export function isRabbitMirrorDetails(details) {
    if (!details?.querySelector) return false;
    const summary = details.querySelector(':scope > summary') || details.querySelector('summary');
    if (!summary) return false;

    const title = (summary.textContent || '').replace(/\s+/g, ' ').trim();
    // 标题只是兼容线索，不再是唯一身份。显示正则/翻译/模型改标题时，
    // 跟随主 API 的 <toto> 外壳又可能被宿主剥掉，必须依赖插件自己的结构标记继续识别。
    if (/兔子[镜鏡]/.test(title) || /rabbit\s*mirror/i.test(title)) return true;

    const ownScope = String(details.getAttribute?.(RABBIT_MIRROR_CSS_SCOPE_ATTR) || '').trim();
    if (/^rmcss-[a-z0-9-]+$/i.test(ownScope)) return true;

    // 兼容少数“外层 div/section 被标记、details 位于其内”的合法结构；
    // 只认该标记宿主下的最外层 details，避免把兔子镜内部的嵌套 details 都当成独立镜面。
    const scopedHost = details.closest?.(`[${RABBIT_MIRROR_CSS_SCOPE_ATTR}]`);
    const scopedValue = String(scopedHost?.getAttribute?.(RABBIT_MIRROR_CSS_SCOPE_ATTR) || '').trim();
    if (scopedHost && scopedHost !== details && /^rmcss-[a-z0-9-]+$/i.test(scopedValue)) {
        const parentDetails = details.parentElement?.closest?.('details');
        if (!parentDetails || !scopedHost.contains?.(parentDetails)) return true;
    }

    return false;
}


