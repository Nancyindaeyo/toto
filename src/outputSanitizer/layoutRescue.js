// Split from outputSanitizer.js — layoutRescue.

import { collectBoundedElementDescendants, semanticEnsembleScalePlan } from '../presentationQuality.js?rmv=1.5.53-cn-boundary1';
import {
    FEEDBACK_CAT_ATTR,
    MAINTENANCE_RABBIT_ATTR,
    MIRROR_TOTO_SELECTOR,
    RECIPE_BUTTON_ATTR,
    TOOL_ENTRY_HOST_ATTR,
    isRabbitMirrorDetails,
} from './runtime.js?rmv=1.5.67';
import {
    EXCLUSIVE_STACKED_STATE_PANEL_ATTR,
    MOBILE_INLINE_ANNOTATION_MIRROR_ATTR,
    MOBILE_INLINE_ANNOTATION_ORIGINAL_ATTR,
    PASSPORT_DOCUMENT_COVER_ATTR,
    PASSPORT_DOCUMENT_HOST_ATTR,
    PASSPORT_DOCUMENT_PAGES_ATTR,
    PASSPORT_DOCUMENT_STAMP_ATTR,
    PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR,
    findDescendantLabelForId,
    findSelectorPanelGridSpanCandidates,
    maintenancePassiveAnimatedStatePanel,
    parseCheckedRulesFromText,
    repairRabbitMirrorSelectorPanelGridSpan,
    resolveTargetsForCheckedRule,
} from './checkedStateRescue.js?rmv=1.5.67';
import { getClassTokens } from './renderedStateRescue.js?rmv=1.5.67';
import {
    ensurePassportDocumentRescueStyle,
    findRenderedPassportDocumentCandidates,
    markRenderedPassportDocumentCandidate,
} from './scriptedInteractionRescue.js?rmv=1.5.67';
import {
    FEEDBACK_CAT_MENU_ATTR,
    INDEPENDENT_MOBILE_SPATIAL_CANVAS_ATTR,
    INDEPENDENT_MOBILE_SPATIAL_COUNT_ATTR,
    INDEPENDENT_MOBILE_SPATIAL_SCROLL_ATTR,
    INDEPENDENT_MOBILE_SPATIAL_STYLE_ATTR,
    INTERACTION_DIAGNOSTIC_PANEL_ATTR,
    MAINTENANCE_MENU_ATTR,
    MOBILE_LAYOUT_BREAKPOINT_PX,
    MOBILE_LAYOUT_BREAK_TEXT_ATTR,
    MOBILE_LAYOUT_COMPACT_GAP_ATTR,
    MOBILE_LAYOUT_COMPACT_PADDING_ATTR,
    MOBILE_LAYOUT_FIT_ATTR,
    MOBILE_LAYOUT_FLEX_STACK_ATTR,
    MOBILE_LAYOUT_FLEX_WRAP_ATTR,
    MOBILE_LAYOUT_FLUID_TITLE_ATTR,
    MOBILE_LAYOUT_GRID_COLLAPSE_ATTR,
    MOBILE_LAYOUT_MATRIX_ACTIVE_ATTR,
    MOBILE_LAYOUT_MATRIX_CELL_ATTR,
    MOBILE_LAYOUT_MATRIX_PRESERVE_ATTR,
    MOBILE_LAYOUT_MEDIA_ATTR,
    MOBILE_LAYOUT_MIN_ATTR,
    MOBILE_LAYOUT_RELATION_BRANCH_ATTR,
    MOBILE_LAYOUT_RELATION_CELL_ATTR,
    MOBILE_LAYOUT_RELATION_DETAIL_ATTR,
    MOBILE_LAYOUT_RELATION_SIDE_ATTR,
    MOBILE_LAYOUT_RELATION_TREE_ATTR,
    MOBILE_LAYOUT_RESCUE_COUNT_ATTR,
    MOBILE_LAYOUT_RESCUE_STYLE_ATTR,
    MOBILE_LAYOUT_SCOPE_ATTR,
    MOBILE_LAYOUT_SCREEN_SHELL_PRESERVE_ATTR,
    MOBILE_LAYOUT_SCROLL_ATTR,
    MOBILE_LAYOUT_SECTION_STACK_PRESERVE_ATTR,
    MOBILE_LAYOUT_SINGLE_COLUMN_ATTR,
    MOBILE_LAYOUT_SQUEEZED_TEXT_ATTR,
    MOBILE_LAYOUT_STATE_ACTIVE_ATTR,
    MOBILE_LAYOUT_STATE_CONTENT_ATTR,
    MOBILE_LAYOUT_STATE_ROW_ATTR,
    MOBILE_LAYOUT_STATE_ROW_GUARD_STYLE_ATTR,
    MOBILE_LAYOUT_TARGET_ATTRS,
    MOBILE_LAYOUT_UNDERFILL_ATTR,
    RECIPE_MENU_ATTR,
    RESAY_ATTR,
    VISUAL_SCENERY_MOBILE_OVERFLOW_COPY_ATTR,
    VISUAL_SCENERY_MOBILE_OVERFLOW_COUNT_ATTR,
    VISUAL_SCENERY_MOBILE_OVERFLOW_HOST_ATTR,
    VISUAL_SCENERY_MOBILE_OVERFLOW_SOURCE_ATTR,
    VISUAL_SCENERY_MOBILE_OVERFLOW_STYLE_ATTR,
    maintenanceDirectTextLength,
    maintenanceHasIntentionalMarquee,
    maintenanceIsVisibleContentElement,
    maintenanceSafeComputedStyle,
    maintenanceVisibleTextRects,
    mobileLayoutRescueStates,
    mobileMatrixPreserveStates,
    rabbitMirrorFacePositionHints,
} from './diagnostics.js?rmv=1.5.67';

let mobileLayoutScopeCounter = 0;

const VIEWPORT_LAYOUT_RESCUE_STYLE_ATTR = 'data-rabbit-mirror-viewport-layout-rescue';

export const VIEWPORT_LAYOUT_COUNT_ATTR = 'data-rabbit-mirror-viewport-layout-count';

const VIEWPORT_LAYOUT_SPAN_ATTR = 'data-rm-squeezed-span';

const VIEWPORT_LAYOUT_SCROLL_ATTR = 'data-rm-squeezed-scroll';

const VIEWPORT_LAYOUT_SCROLL_Y_ATTR = 'data-rm-squeezed-scroll-y';

const VIEWPORT_LAYOUT_POINTER_ATTR = 'data-rm-squeezed-pointer';

const VIEWPORT_LAYOUT_TARGET_ATTRS = Object.freeze([
    VIEWPORT_LAYOUT_SPAN_ATTR,
    VIEWPORT_LAYOUT_SCROLL_ATTR,
    VIEWPORT_LAYOUT_SCROLL_Y_ATTR,
    VIEWPORT_LAYOUT_POINTER_ATTR,
]);

// 宽屏“竖长柱”必须有非常强的几何证据，避免把正常 sidebar / 菜单 / 标签栏拉满。

const VIEWPORT_SQUEEZE_MAX_WIDTH_PX = 320;

const VIEWPORT_SQUEEZE_MIN_PARENT_WIDTH_PX = 480;

const VIEWPORT_SQUEEZE_MIN_TEXT = 60;

const VIEWPORT_SQUEEZE_MIN_RATIO = 4;

const VIEWPORT_SQUEEZE_MAX_PARENT_FRACTION = 0.42;


const HCLIP_SCOPE_ATTR = 'data-rm-hclip-scope';

const HCLIP_SCROLLER_ATTR = 'data-rm-hclip-scroller';

const HCLIP_KEEP_Y_ATTR = 'data-rm-hclip-keep-y';

export const HCLIP_REPORT_ATTR = 'data-rm-hclip-report';

const HCLIP_ENSEMBLE_FIT_ATTR = 'data-rm-hclip-ensemble-fit';

const HCLIP_ENSEMBLE_CLIP_ATTR = 'data-rm-hclip-ensemble-clip';

const HCLIP_STYLE_ATTR = 'data-rabbit-mirror-horizontal-clip-rescue';
// 所有 transient 产物共用这个前缀，便于无条件清理。

const HCLIP_TRANSIENT_ATTRS = Object.freeze([
    HCLIP_SCOPE_ATTR, HCLIP_SCROLLER_ATTR, HCLIP_KEEP_Y_ATTR, HCLIP_REPORT_ATTR,
    HCLIP_ENSEMBLE_FIT_ATTR, HCLIP_ENSEMBLE_CLIP_ATTR,
]);


const HCLIP_BREAKPOINT_PX = 640;
// 低于这个像素差不算"真实溢出"：亚像素与滚动条宽度都会造成 1–4px 的假阳性。

const HCLIP_MIN_OVERFLOW_PX = 8;
// 候选容器扫描上限，避免超大镜面上做无差别布局读。

const HCLIP_MAX_CONTAINERS = 140;
// These budgets apply before selector/filter/layout work. Exceeding one simply keeps the
// existing horizontal-scroll fallback and avoids doing quality repair on an attacker-sized DOM.

const HCLIP_ENSEMBLE_MAX_ROOT_DESCENDANTS = 720;

const HCLIP_ENSEMBLE_MAX_HOST_DESCENDANTS = 160;

const HCLIP_ENSEMBLE_MAX_DIRECT_CHILDREN = 64;
// 有意义正文的最低压缩字符数。

const HCLIP_MEANINGFUL_TEXT = 12;
// 明显小装饰的尺寸上限。

const HCLIP_DECORATIVE_MAX_PX = 64;


const HCLIP_MEDIA_TAGS = new Set(['IMG', 'VIDEO', 'IFRAME', 'CANVAS', 'SVG', 'PICTURE', 'OBJECT', 'EMBED']);

const HCLIP_INTERACTIVE_SELECTOR = 'a[href],button,input,select,textarea,label,details,summary,[role="button"],[role="link"],[role="checkbox"],[role="radio"],[role="tab"],[tabindex]:not([tabindex="-1"])';

// 1.3.92: 跟随主 API 的横向裁切只在真实展开后测量。WeakMap 只记录当前 live DOM，
// clone/重挂载后的新 <details> 会自然重新绑定，不写入任何可持久化 data-* 标记。

// 诊断用的可读定位串，只取标签、id、前两个 class 与在父层中的序号。

export function independentMaintenanceHost(root){
 if(!root?.closest && !root?.matches) return null;
 const direct=root.matches?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]')?root:null;
 return direct || root.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-source="independent"]') || null;
}

// A face number is runtime ownership data, never model output. Derive it only
// from the direct child position inside the locally mounted external host, or
// from a flat run of direct inline <toto> siblings. Nested generated markup and
// data-* claims cannot appoint themselves as another face.

export function getRabbitMirrorFacePosition(root) {
    if (!root) return null;
    const remembered = rabbitMirrorFacePositionHints.get(root) || null;
    let details = root.matches?.('details') ? root : root.closest?.('details') || null;
    const externalHost = independentMaintenanceHost(root);
    if (externalHost) {
        const faces = [...(externalHost.children || [])].filter(child =>
            child?.matches?.('details') && isRabbitMirrorDetails(child));
        if (faces.length >= 1 && faces.length <= 5) {
            if (!details && faces.length === 1 && root === externalHost) details = faces[0];
            const faceIndex = faces.indexOf(details);
            if (faceIndex >= 0) {
                const info = Object.freeze({ faceIndex, faceCount: faces.length, details, host: externalHost, source: 'independent' });
                rabbitMirrorFacePositionHints.set(root, info);
                rabbitMirrorFacePositionHints.set(details, info);
                return info;
            }
        }
        return remembered;
    }

    const toto = root.matches?.(MIRROR_TOTO_SELECTOR)
        ? root
        : root.closest?.(MIRROR_TOTO_SELECTOR) || null;
    if (toto && !toto.parentElement?.closest?.(MIRROR_TOTO_SELECTOR)) {
        const faces = [...(toto.parentElement?.children || [])].filter(child => child?.matches?.(MIRROR_TOTO_SELECTOR));
        if (faces.length >= 1 && faces.length <= 5) {
            const faceIndex = faces.indexOf(toto);
            if (faceIndex >= 0) {
                const directDetails = toto.querySelector?.(':scope > details') || null;
                if (directDetails && isRabbitMirrorDetails(directDetails)) {
                    const info = Object.freeze({ faceIndex, faceCount: faces.length, details: directDetails, host: toto.parentElement, source: 'inline' });
                    rabbitMirrorFacePositionHints.set(root, info);
                    rabbitMirrorFacePositionHints.set(toto, info);
                    rabbitMirrorFacePositionHints.set(directDetails, info);
                    return info;
                }
            }
        }
    }
    return remembered;
}

export function maintenanceMobileLayoutComputedStyle(element) {
    try {
        return typeof getComputedStyle === 'function' ? getComputedStyle(element) : null;
    } catch {
        return null;
    }
}


export function maintenanceMobileLayoutRect(element) {
    try {
        const rect = element?.getBoundingClientRect?.();
        return rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } : null;
    } catch {
        return null;
    }
}


export function maintenanceMobileLayoutLengthPx(value, reference = 0) {
    const text = String(value || '').trim().toLowerCase();
    if (!text || text === 'auto' || text === 'none' || text === 'normal') return 0;
    const number = Number.parseFloat(text);
    if (!Number.isFinite(number)) return 0;
    if (text.endsWith('px')) return number;
    if (text.endsWith('rem')) return number * 16;
    if (text.endsWith('em')) return number * 16;
    if (text.endsWith('vw')) return number * Math.max(320, Number(globalThis.innerWidth) || reference || 0) / 100;
    if (text.endsWith('vh')) return number * Math.max(480, Number(globalThis.innerHeight) || 0) / 100;
    if (text.endsWith('%') && reference > 0) return number * reference / 100;
    return number;
}


function maintenanceMobileLayoutSplitTracks(value) {
    const text = String(value || '').trim();
    if (!text || text === 'none') return [];
    const repeat = /^repeat\(\s*(\d+)\s*,/i.exec(text);
    if (repeat) return Array.from({ length: Math.min(12, Number(repeat[1]) || 0) }, () => 'repeat-track');
    const tracks = [];
    let current = '';
    let depth = 0;
    for (const char of text) {
        if (char === '(' || char === '[') depth += 1;
        if (char === ')' || char === ']') depth = Math.max(0, depth - 1);
        if (/\s/.test(char) && depth === 0) {
            if (current.trim()) tracks.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) tracks.push(current.trim());
    return tracks;
}


function maintenanceMobileLayoutHasFixedTrack(value) {
    const text = String(value || '').toLowerCase();
    return /(?:^|[^\w.-])\d+(?:\.\d+)?(?:px|rem|em|vw)(?:$|[^\w.-])/.test(text)
        || /(?:minmax|fit-content)\([^)]*\d+(?:\.\d+)?(?:px|rem|em|vw)/.test(text);
}


export function maintenanceMobileLayoutTextLength(element) {
    return String(element?.textContent || '').replace(/\s+/g, '').length;
}


export function maintenanceMobileLayoutIsInternal(element) {
    if (!element?.matches) return true;
    if (element.closest?.('[data-rm-image-region], [data-rm-image-portal], [data-rm-tool-menu]')) return true;
    if (element.matches('style,script,link,meta,br,summary')) return true;
    if (element.closest?.(`[${MAINTENANCE_MENU_ATTR}], [${FEEDBACK_CAT_MENU_ATTR}], [${RECIPE_MENU_ATTR}], [${INTERACTION_DIAGNOSTIC_PANEL_ATTR}]`)) return true;
    if (element.matches(`[${MAINTENANCE_RABBIT_ATTR}], [${FEEDBACK_CAT_ATTR}], [${RECIPE_BUTTON_ATTR}], [${RESAY_ATTR}], [${TOOL_ENTRY_HOST_ATTR}]`)) return true;
    if (element.matches(`[${MOBILE_INLINE_ANNOTATION_ORIGINAL_ATTR}], [${MOBILE_INLINE_ANNOTATION_MIRROR_ATTR}]`)) return true;
    return false;
}


export function maintenanceMobileLayoutIsPassportManaged(element) {
    if (!element?.hasAttribute) return false;
    if (element.hasAttribute(PASSPORT_DOCUMENT_HOST_ATTR)
        || element.hasAttribute(PASSPORT_DOCUMENT_COVER_ATTR)
        || element.hasAttribute(PASSPORT_DOCUMENT_PAGES_ATTR)
        || element.hasAttribute(PASSPORT_DOCUMENT_STAMP_ATTR)
        || element.hasAttribute(PASSPORT_DOCUMENT_STAMP_DETAIL_ATTR)) return true;
    return !!element.closest?.(`[${PASSPORT_DOCUMENT_COVER_ATTR}], [${PASSPORT_DOCUMENT_PAGES_ATTR}], [${PASSPORT_DOCUMENT_STAMP_ATTR}]`);
}


function maintenanceMobileLayoutSectionStackInfo(element, style = null, directChildren = null) {
    if (!element?.querySelectorAll) return null;
    const computed = style || maintenanceMobileLayoutComputedStyle(element);
    const display = String(computed?.display || '').toLowerCase();
    const direction = String(computed?.flexDirection || '').toLowerCase();
    if (!display.includes('flex') || !direction.startsWith('column')) return null;

    const signature = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('aria-label') || ''}`;
    if (!/(?:entremet|layer|layers|section|section-view|cutaway|cross-section|strata|剖面|分层|层级|夹层|切面)/i.test(signature)) return null;

    const children = Array.isArray(directChildren)
        ? directChildren
        : [...(element.children || [])].filter(child => !maintenanceMobileLayoutIsInternal(child));
    const controls = [...element.querySelectorAll('input[type="checkbox"], input[type="radio"]')]
        .filter(input => input.closest?.('label')?.parentElement === element || input.parentElement === element);
    if (controls.length < 3 || controls.length > 12) return null;

    const sections = children.filter(child => {
        if (child.matches?.('label') && child.querySelector?.('input[type="checkbox"], input[type="radio"]')) return false;
        const childSignature = `${child.id || ''} ${child.className || ''}`;
        if (!/(?:^|[\s_-])(?:layer|section|slice|stratum)(?:$|[\s_-])|层|切片/i.test(childSignature)) return false;
        return maintenanceMobileLayoutTextLength(child) >= 4;
    });
    if (sections.length < 3 || Math.abs(sections.length - controls.length) > 1) return null;
    return { controls, sections };
}


function maintenanceMobileLayoutElementInSectionStack(element, hosts) {
    return (hosts || []).some(host => host === element || host.contains?.(element));
}



function maintenanceMobileLayoutScreenShellInfo(element) {
    if (!element?.querySelectorAll || element.matches?.('details,toto,summary,style,script')) return null;
    const signature = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('aria-label') || ''}`;
    const ownMediaHint = /(?:tv|television|crt|monitor|terminal|screen-shell|电视|监控|终端|显示器)/i.test(signature);
    const descendantMediaHint = !!element.querySelector?.(
        '[class*="tv-cabinet" i], [class*="tv-screen" i], [class*="crt" i], [class*="monitor" i], [class*="terminal" i], [class*="screen-shell" i]',
    );
    if (!ownMediaHint && !descendantMediaHint) return null;
    const screens = [...element.querySelectorAll('div,section,article,main')].filter(child => {
        const childSignature = `${child.id || ''} ${child.className || ''}`;
        return /(?:tv-screen|screen|display|viewport|monitor|屏幕|画面)/i.test(childSignature);
    });
    if (!screens.length || screens.length > 6) return null;
    const controls = [...element.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
    if (controls.length < 1 || controls.length > 8) return null;
    const statePanels = [...element.querySelectorAll('div,section,article')].filter(panel => {
        const panelSignature = `${panel.id || ''} ${panel.className || ''}`;
        return /(?:state|scene|channel|feedback|initial|result|panel|画面|频道|反馈|状态)/i.test(panelSignature)
            && maintenanceMobileLayoutTextLength(panel) >= 8;
    });
    if (statePanels.length < 2) return null;
    return { screens, controls, statePanels };
}


function maintenanceMobileLayoutElementInScreenShell(element, hosts) {
    return (hosts || []).some(host => host === element || host.contains?.(element));
}


function maintenanceMobileLayoutHorizontalMediaHint(element) {
    if (!element) return false;
    if (element.matches?.('table,thead,tbody,tr,canvas')) return true;
    const signature = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('role') || ''} ${element.getAttribute?.('aria-label') || ''}`;
    return /(?:table|timeline|track|chart|graph|map|board|calendar|schedule|kanban|matrix|gallery|carousel|slider|race|score|monopoly|game[-_ ]?board|仪表|时间轴|赛道|地图|表格|棋盘|游戏板|大富翁|画布|日历)/i.test(signature);
}

// 固定格位、棋盘、地图、座位图等空间型 Grid 不能像文章卡片一样折成单列。
// 一旦直接子节点使用 grid-column/grid-row 指定位置，或存在依赖 Grid 坐标的绝对定位覆盖物，
// 改写列数会让隐式列、棋子/标记位置和阅读路径一起错位；此类结构宁可局部滚动，也要保形。

function maintenanceMobileLayoutSpatialGridInfo(element, style = null, directChildren = null) {
    if (!element) return null;
    const computed = style || maintenanceMobileLayoutComputedStyle(element);
    if (!String(computed?.display || '').toLowerCase().includes('grid')) return null;
    const columnTracks = maintenanceMobileLayoutSplitTracks(computed?.gridTemplateColumns);
    if (columnTracks.length < 2) return null;
    const rowTracks = maintenanceMobileLayoutSplitTracks(computed?.gridTemplateRows);
    const children = Array.isArray(directChildren)
        ? directChildren
        : [...(element.children || [])].filter(child => !maintenanceMobileLayoutIsInternal(child));

    const placedChildren = children.filter(child => {
        const inline = String(child.getAttribute?.('style') || '').toLowerCase();
        if (/(?:^|;)\s*grid-(?:column|row)(?:-start|-end)?\s*:/.test(inline)) return true;
        const childStyle = maintenanceMobileLayoutComputedStyle(child);
        if (!childStyle) return false;
        return [childStyle.gridColumnStart, childStyle.gridColumnEnd, childStyle.gridRowStart, childStyle.gridRowEnd]
            .map(value => String(value || '').trim().toLowerCase())
            .some(value => value && value !== 'auto');
    });
    const anchoredOverlays = children.filter(child => {
        const childStyle = maintenanceMobileLayoutComputedStyle(child);
        const position = String(childStyle?.position || '').toLowerCase();
        if (position !== 'absolute' && position !== 'fixed') return false;
        const inline = String(child.getAttribute?.('style') || '').toLowerCase();
        return /(?:^|;)\s*(?:left|right|top|bottom)\s*:/.test(inline);
    });
    const hasTemplateAreas = String(computed?.gridTemplateAreas || '').trim().toLowerCase() !== 'none'
        && String(computed?.gridTemplateAreas || '').trim() !== '';
    const semanticText = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('aria-label') || ''} ${element.parentElement?.textContent || ''}`
        .replace(/\s+/g, ' ')
        .slice(0, 1200);
    const semanticHint = /(?:monopoly|game[-_ ]?board|board|map|track|race|calendar|schedule|seat|棋盘|游戏板|大富翁|地图|赛道|座位|日历|棋子|格子)/i.test(semanticText);

    const explicitSpatialPlacement = placedChildren.length >= 2
        || (placedChildren.length >= 1 && anchoredOverlays.length >= 1)
        || hasTemplateAreas;
    const semanticSpatialLayout = semanticHint
        && rowTracks.length >= 2
        && children.length >= 3
        && children.length <= 24
        && (maintenanceMobileLayoutHasFixedTrack(computed?.gridTemplateColumns)
            || maintenanceMobileLayoutHasFixedTrack(computed?.gridTemplateRows));
    if (!explicitSpatialPlacement && !semanticSpatialLayout) return null;
    if (rowTracks.length <= 1 && placedChildren.length < 2 && !anchoredOverlays.length && !hasTemplateAreas) return null;
    return { columnTracks, rowTracks, placedChildren, anchoredOverlays, semanticHint };
}



function maintenanceMobileLayoutSemanticMatrixInfo(element, style = null, directChildren = null) {
    if (!element) return null;
    const computed = style || maintenanceMobileLayoutComputedStyle(element);
    if (!String(computed?.display || '').toLowerCase().includes('grid')) return null;
    const columnTracks = maintenanceMobileLayoutSplitTracks(computed?.gridTemplateColumns);
    const rowTracks = maintenanceMobileLayoutSplitTracks(computed?.gridTemplateRows);
    if (columnTracks.length !== 2 || rowTracks.length !== 2) return null;

    const children = Array.isArray(directChildren)
        ? directChildren
        : [...(element.children || [])].filter(child => !maintenanceMobileLayoutIsInternal(child));
    const cells = children.filter(child => {
        const childStyle = maintenanceMobileLayoutComputedStyle(child);
        const position = String(childStyle?.position || '').toLowerCase();
        if (position === 'absolute' || position === 'fixed') return false;
        if (child.matches?.('label,button,details,a,[role="button"],[tabindex]')) return true;
        return maintenanceMobileLayoutTextLength(child) >= 18;
    });
    if (cells.length !== 4) return null;

    const signature = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('aria-label') || ''} ${cells.map(cell => `${cell.id || ''} ${cell.className || ''}`).join(' ')}`;
    const axisChildren = children.filter(child => /(?:axis|轴线|坐标轴|label-(?:top|bottom|left|right))/i.test(`${child.id || ''} ${child.className || ''}`));
    const semanticHint = /(?:quadrant|matrix|四象限|象限|坐标图|坐标系|matrix-grid|四宫格)/i.test(signature)
        || axisChildren.length >= 2;
    if (!semanticHint) return null;
    return { cells };
}


function maintenanceMobileLayoutMatrixInputs(root, cells) {
    const inputs = [];
    const seen = new Set();
    for (const cell of cells || []) {
        const forId = String(cell.getAttribute?.('for') || '').trim();
        const input = cell.control || (forId ? globalThis.document?.getElementById?.(forId) : null) || null;
        if (!input || !root.contains?.(input) || !input.matches?.('input[type="checkbox"], input[type="radio"]') || seen.has(input)) continue;
        seen.add(input);
        inputs.push(input);
    }
    return inputs;
}


function refreshMaintenanceMobileMatrixStates(root) {
    const state = mobileMatrixPreserveStates.get(root);
    if (!state) return;
    for (const entry of state.entries || []) {
        if (!entry.matrix?.isConnected) continue;
        const active = (entry.inputs || []).some(input => input?.checked);
        if (active) entry.matrix.setAttribute(MOBILE_LAYOUT_MATRIX_ACTIVE_ATTR, 'true');
        else entry.matrix.removeAttribute(MOBILE_LAYOUT_MATRIX_ACTIVE_ATTR);
    }
}


function installMaintenanceMobileMatrixStateRescue(root, entries) {
    if (!root) return 0;
    let state = mobileMatrixPreserveStates.get(root);
    if (!state) {
        state = {
            entries: [],
            onStateChange: () => setTimeout(() => refreshMaintenanceMobileMatrixStates(root), 0),
        };
        root.addEventListener('input', state.onStateChange, false);
        root.addEventListener('change', state.onStateChange, false);
        mobileMatrixPreserveStates.set(root, state);
    }
    state.entries = entries || [];
    refreshMaintenanceMobileMatrixStates(root);
    return state.entries.length;
}


function maintenanceMobileLayoutIsDecorativeOverflow(element, style = null) {
    if (!element) return false;
    const computed = style || maintenanceMobileLayoutComputedStyle(element);
    const position = String(computed?.position || '').toLowerCase();
    if (position !== 'absolute' && position !== 'fixed') return false;
    // 绝对定位 + nowrap + 动画 + pointer-events:none 的文字通常就是弹幕/跑马灯。
    // 它横穿画布是设计本身，不应被手机正文适配当成 overflow 再压宽/换行。
    if (maintenancePassiveAnimatedStatePanel(element, computed)) return true;
    if (maintenanceMobileLayoutTextLength(element) > 0 || Number(element.childElementCount || 0) > 0) return false;
    if (element.matches?.('img,video,iframe,canvas,svg,button,input,label,a,summary,[role="button"],[tabindex]')) return false;
    const opacity = Number.parseFloat(computed?.opacity || '1');
    const pointerEvents = String(computed?.pointerEvents || '').toLowerCase();
    return pointerEvents === 'none' || (Number.isFinite(opacity) && opacity <= 0.65);
}


function maintenanceMobileLayoutMark(element, attr, marked) {
    if (!element?.setAttribute || !attr) return;
    if (!element.hasAttribute(attr)) element.setAttribute(attr, 'true');
    marked?.add?.(element);
}


function maintenanceMobileLayoutCreateScopeToken() {
    mobileLayoutScopeCounter += 1;
    return `rmmobile-${Date.now().toString(36)}-${mobileLayoutScopeCounter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}


export function maintenanceMobileLayoutResolveCheckedTargets(root, input, rule) {
    // Keep mobile state-content discovery on the exact same safe target resolver as the
    // interaction layer. A separate broader class-local fallback can otherwise reintroduce
    // the same "one radio reveals every sibling panel" bug only on narrow screens.
    return resolveTargetsForCheckedRule(root, input, rule)
        .filter(target => target && target !== input);
}


function maintenanceMobileLayoutFixedRevealLimit(styleMap, referenceWidth) {
    let limit = 0;
    for (const [property, value] of styleMap || []) {
        const name = String(property || '').toLowerCase();
        const clean = String(value || '').trim().toLowerCase();
        if (name !== 'height' && name !== 'max-height') continue;
        if (!clean || /^(?:auto|none|max-content|min-content|fit-content|100%)$/.test(clean)) continue;
        const px = maintenanceMobileLayoutLengthPx(clean, referenceWidth);
        if (px > 0) limit = Math.max(limit, px);
    }
    return limit;
}


function refreshMaintenanceMobileStateContents(root) {
    const state = mobileLayoutRescueStates.get(root);
    if (!state) return;
    const activeTargets = new Set();
    for (const mapping of state.mappings || []) {
        if (mapping.input?.checked && mapping.target?.isConnected) activeTargets.add(mapping.target);
    }
    for (const target of state.targets || []) {
        if (!target?.isConnected) continue;
        if (activeTargets.has(target)) target.setAttribute(MOBILE_LAYOUT_STATE_ACTIVE_ATTR, 'true');
        else target.removeAttribute(MOBILE_LAYOUT_STATE_ACTIVE_ATTR);
    }
}


function installMaintenanceMobileStateContentRescue(root, marked, referenceWidth) {
    if (!root?.querySelectorAll) return 0;
    const mappings = [];
    const targets = new Set();
    for (const input of root.querySelectorAll('input[type="checkbox"], input[type="radio"]')) {
        for (const rule of parseCheckedRulesFromText(root, input)) {
            const fixedLimit = maintenanceMobileLayoutFixedRevealLimit(rule.styleMap, referenceWidth);
            if (fixedLimit <= 0) continue;
            for (const target of maintenanceMobileLayoutResolveCheckedTargets(root, input, rule)) {
                const hasContent = maintenanceMobileLayoutTextLength(target) >= 8 || Number(target.childElementCount || 0) > 0;
                if (!hasContent) continue;
                const inlineHeight = maintenanceMobileLayoutLengthPx(target.style?.height, referenceWidth);
                const naturalHeight = Math.max(Number(target.scrollHeight || 0), Number(maintenanceMobileLayoutRect(target)?.height || 0));
                const collapsedInitially = String(target.style?.height || '').trim() === '0px'
                    || String(target.style?.height || '').trim() === '0';
                if (!collapsedInitially && naturalHeight > 0 && naturalHeight <= fixedLimit + 8) continue;
                target.setAttribute(MOBILE_LAYOUT_STATE_CONTENT_ATTR, 'true');
                targets.add(target);
                mappings.push({ input, target });
                maintenanceMobileLayoutMark(target, MOBILE_LAYOUT_STATE_CONTENT_ATTR, marked);
            }
        }
    }

    let state = mobileLayoutRescueStates.get(root);
    if (!state) {
        state = {
            mappings: [],
            targets: new Set(),
            onStateChange: () => setTimeout(() => refreshMaintenanceMobileStateContents(root), 0),
        };
        root.addEventListener('input', state.onStateChange, false);
        root.addEventListener('change', state.onStateChange, false);
        mobileLayoutRescueStates.set(root, state);
    }
    state.mappings = mappings;
    state.targets = targets;
    refreshMaintenanceMobileStateContents(root);
    return targets.size;
}



function maintenanceMobileLayoutRelationTreeInfo(element) {
    if (!element?.querySelectorAll) return null;
    const style = maintenanceMobileLayoutComputedStyle(element);
    if (!String(style?.display || '').toLowerCase().includes('grid')) return null;
    const tracks = maintenanceMobileLayoutSplitTracks(String(style?.gridTemplateColumns || ''));
    if (tracks.length !== 2) return null;
    const cells = [...(element.children || [])].filter(child => !maintenanceMobileLayoutIsInternal(child));
    if (cells.length !== 2) return null;
    const entries = [];
    for (const cell of cells) {
        const input = cell.querySelector?.('input[type="radio"], input[type="checkbox"]');
        if (!input?.id) return null;
        const label = findDescendantLabelForId(cell, input.id);
        if (!label) return null;
        let detail = null;
        for (const sibling of [...(input.parentElement?.children || [])]) {
            if (sibling === input || sibling === label) continue;
            if (sibling.compareDocumentPosition?.(input) & Node.DOCUMENT_POSITION_FOLLOWING) continue;
        }
        detail = input.nextElementSibling;
        if (!detail || maintenanceMobileLayoutTextLength(detail) < 8) return null;
        const detailStyle = maintenanceMobileLayoutComputedStyle(detail);
        const collapsed = String(detailStyle?.opacity || '') === '0'
            || maintenanceMobileLayoutLengthPx(detailStyle?.maxHeight, 640) <= 1
            || String(detail.style?.maxHeight || '').trim() === '0';
        if (!collapsed) return null;
        entries.push({ cell, input, label, detail });
    }
    const hint = String(element.parentElement?.textContent || '').replace(/\s+/g, ' ').trim();
    const hasRelationHint = /关系|羁绊|节点|角色|人物|relationship|bond|node/i.test(hint);
    if (!hasRelationHint) return null;
    return { branch: element, entries };
}


function maintenanceMobileLayoutCollectRelationTrees(root, elements, marked) {
    const infos = [];
    for (const element of elements) {
        const info = maintenanceMobileLayoutRelationTreeInfo(element);
        if (!info) continue;
        maintenanceMobileLayoutMark(info.branch, MOBILE_LAYOUT_RELATION_BRANCH_ATTR, marked);
        const host = info.branch.parentElement || info.branch;
        maintenanceMobileLayoutMark(host, MOBILE_LAYOUT_RELATION_TREE_ATTR, marked);
        info.entries.forEach((entry, index) => {
            maintenanceMobileLayoutMark(entry.cell, MOBILE_LAYOUT_RELATION_CELL_ATTR, marked);
            maintenanceMobileLayoutMark(entry.detail, MOBILE_LAYOUT_RELATION_DETAIL_ATTR, marked);
            entry.detail.setAttribute(MOBILE_LAYOUT_RELATION_SIDE_ATTR, index === 0 ? 'left' : 'right');
            marked?.add?.(entry.detail);
        });
        infos.push(info);
    }
    return infos;
}


function maintenanceMobileLayoutElementInRelationTree(element, relationInfos) {
    return relationInfos.some(info => info.branch === element || info.branch.contains?.(element));
}


function maintenanceMobileLayoutStateRowInfo(element) {
    if (!element?.children) return null;
    const directChildren = [...element.children].filter(child => !maintenanceMobileLayoutIsInternal(child));
    const inputs = directChildren.filter(child => child.matches?.('input[type="radio"][id], input[type="checkbox"][id]'));
    if (inputs.length < 2) return null;
    const labels = [];
    for (const input of inputs) {
        const label = directChildren.find(child => child.matches?.('label[for]') && String(child.getAttribute('for') || '') === String(input.id || ''));
        if (!label) return null;
        labels.push(label);
    }
    if (new Set(labels).size !== labels.length) return null;
    const structured = labels.some(label => label.children.length >= 2 && maintenanceMobileLayoutTextLength(label) >= 24);
    const hiddenStateContent = labels.some(label => [...label.querySelectorAll('*')].some(node => {
        const style = maintenanceMobileLayoutComputedStyle(node);
        if (!style) return false;
        return Number.parseFloat(style.opacity || '1') <= 0.05
            || String(style.pointerEvents || '').toLowerCase() === 'none'
            || maintenanceMobileLayoutLengthPx(style.maxHeight, 640) <= 1 && String(style.overflow || '').toLowerCase() === 'hidden';
    }));
    if (!structured && !hiddenStateContent) return null;
    return { element, inputs, labels };
}


function repairMaintenanceMobileStateRowClasses(info) {
    const labels = Array.isArray(info?.labels) ? info.labels : [];
    if (labels.length < 2) return 0;
    let changed = 0;
    const tokenCounts = new Map();
    for (const label of labels) {
        for (const token of getClassTokens(label)) tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
    }
    const sharedPanelTokens = [...tokenCounts.entries()]
        .filter(([token, count]) => count >= Math.max(2, labels.length - 1) && /(?:^|[-_])(?:panel|slide|pane|item)(?:$|[-_])/i.test(token))
        .map(([token]) => token);
    for (const label of labels) {
        for (const token of sharedPanelTokens) {
            if (label.classList.contains(token)) continue;
            label.classList.add(token);
            changed += 1;
        }
    }
    const prefixCounts = new Map();
    for (const label of labels) {
        for (const token of getClassTokens(label)) {
            const match = token.match(/^(.*-p)(\d+)$/i);
            if (!match) continue;
            const entry = prefixCounts.get(match[1]) || new Set();
            entry.add(Number(match[2]));
            prefixCounts.set(match[1], entry);
        }
    }
    const statePrefix = [...prefixCounts.entries()].find(([, numbers]) => numbers.size >= 2)?.[0] || '';
    if (statePrefix) {
        labels.forEach((label, index) => {
            const hasStateClass = getClassTokens(label).some(token => token.startsWith(statePrefix) && /\d+$/.test(token));
            if (hasStateClass) return;
            label.classList.add(`${statePrefix}${index + 1}`);
            changed += 1;
        });
    }
    return changed;
}


function maintenanceMobileStateRowGuardCss(scopeToken) {
    const scope = `[${MOBILE_LAYOUT_SCOPE_ATTR}="${scopeToken}"]`;
    return `@media (max-width: ${MOBILE_LAYOUT_BREAKPOINT_PX}px) {
${scope} [${MOBILE_LAYOUT_STATE_ROW_ATTR}] { flex-wrap: nowrap !important; min-width: 0 !important; max-width: 100% !important; align-items: stretch !important; overflow-x: auto !important; overflow-y: hidden !important; overscroll-behavior-inline: contain; -webkit-overflow-scrolling: touch; }
${scope} [${MOBILE_LAYOUT_STATE_ROW_ATTR}] > label { max-width: none !important; box-sizing: border-box !important; }
}`;
}


export function repairLegacyMaintenanceMobileStateRows(scope) {
    if (!scope?.querySelectorAll) return 0;
    const roots = [];
    if (scope.hasAttribute?.(MOBILE_LAYOUT_SCOPE_ATTR)) roots.push(scope);
    roots.push(...scope.querySelectorAll(`[${MOBILE_LAYOUT_SCOPE_ATTR}]`));
    let changed = 0;
    for (const root of [...new Set(roots)]) {
        const scopeToken = String(root.getAttribute(MOBILE_LAYOUT_SCOPE_ATTR) || '');
        if (!scopeToken) continue;
        const candidates = [root, ...root.querySelectorAll(`[${MOBILE_LAYOUT_FLEX_WRAP_ATTR}], [${MOBILE_LAYOUT_STATE_ROW_ATTR}]`)];
        let guarded = false;
        for (const element of [...new Set(candidates)]) {
            const info = maintenanceMobileLayoutStateRowInfo(element);
            if (!info) continue;
            if (element.hasAttribute(MOBILE_LAYOUT_FLEX_WRAP_ATTR)) {
                element.removeAttribute(MOBILE_LAYOUT_FLEX_WRAP_ATTR);
                changed += 1;
            }
            if (!element.hasAttribute(MOBILE_LAYOUT_STATE_ROW_ATTR)) {
                element.setAttribute(MOBILE_LAYOUT_STATE_ROW_ATTR, 'true');
                changed += 1;
            }
            changed += repairMaintenanceMobileStateRowClasses(info);
            guarded = true;
        }
        if (!guarded) continue;
        let style = root.querySelector(`:scope > style[${MOBILE_LAYOUT_STATE_ROW_GUARD_STYLE_ATTR}]`);
        if (!style) {
            style = document.createElement('style');
            style.setAttribute(MOBILE_LAYOUT_STATE_ROW_GUARD_STYLE_ATTR, 'true');
            root.appendChild(style);
            changed += 1;
        }
        style.textContent = maintenanceMobileStateRowGuardCss(scopeToken);
    }
    return changed;
}


function visualSceneryMobileOverflowCandidateRecords(root) {
    if (!root?.querySelectorAll) return [];
    const viewportWidth = Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
    if (viewportWidth > MOBILE_LAYOUT_BREAKPOINT_PX + 40) return [];
    const records = [];
    for (const scene of root.querySelectorAll('[data-rm-visual-scenery="true"]')) {
        const sceneStyle = maintenanceMobileLayoutComputedStyle(scene);
        const sceneRect = maintenanceMobileLayoutRect(scene);
        if (!sceneStyle || !sceneRect || sceneRect.height <= 40) continue;
        const overflow = `${sceneStyle.overflow || ''} ${sceneStyle.overflowX || ''} ${sceneStyle.overflowY || ''}`.toLowerCase();
        if (!/(?:hidden|clip)/.test(overflow)) continue;

        const candidates = [];
        for (const element of scene.querySelectorAll('div,p,section,article,aside,blockquote,figcaption,span')) {
            if (maintenanceMobileLayoutIsInternal(element)) continue;
            if (maintenanceDirectTextLength(element) < 48) continue;
            const style = maintenanceMobileLayoutComputedStyle(element);
            const position = String(style?.position || '').toLowerCase();
            if (position !== 'absolute' && position !== 'fixed') continue;
            const rect = maintenanceMobileLayoutRect(element);
            if (!rect || rect.height <= 1) continue;
            const textRects = maintenanceVisibleTextRects(element);
            const lowestTextBottom = textRects.reduce((max, textRect) => Math.max(max, Number(textRect?.bottom || 0)), 0);
            const highestTextTop = textRects.reduce((min, textRect) => Math.min(min, Number(textRect?.top || sceneRect.top)), sceneRect.top);
            const bottom = Math.max(Number(rect.bottom || 0), lowestTextBottom);
            const top = Math.min(Number(rect.top || sceneRect.top), highestTextTop);
            const ownOverflow = Number(element.scrollHeight || 0) > Number(element.clientHeight || 0) + 3;
            if (bottom <= sceneRect.bottom + 3 && top >= sceneRect.top - 3 && !ownOverflow) continue;
            candidates.push(element);
        }
        if (candidates.length) records.push({ scene, candidates: candidates.slice(0, 4) });
    }
    return records;
}


function cleanVisualSceneryOverflowClone(clone) {
    if (!clone?.querySelectorAll) return clone;
    const nodes = [clone, ...clone.querySelectorAll('*')];
    for (const node of nodes) {
        if (!node?.attributes) continue;
        for (const attr of [...node.attributes]) {
            const name = String(attr.name || '').toLowerCase();
            if (name === VISUAL_SCENERY_MOBILE_OVERFLOW_COPY_ATTR) continue;
            if (name === 'style' || name === 'class' || name === 'id' || name === 'for' || name === 'name' || name === 'tabindex'
                || name.startsWith('on') || name.startsWith('data-rabbit-mirror-') || name.startsWith('data-rm-')) {
                node.removeAttribute(attr.name);
            }
        }
    }
    clone.querySelectorAll('script,style,iframe,input,button,select,textarea,option').forEach(node => node.remove());
    return clone;
}


function ensureVisualSceneryMobileOverflowStyle(root) {
    let style = root.querySelector(`:scope > style[${VISUAL_SCENERY_MOBILE_OVERFLOW_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(VISUAL_SCENERY_MOBILE_OVERFLOW_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `[${VISUAL_SCENERY_MOBILE_OVERFLOW_HOST_ATTR}] { display:none; }
@media (max-width: ${MOBILE_LAYOUT_BREAKPOINT_PX}px) {
[${VISUAL_SCENERY_MOBILE_OVERFLOW_SOURCE_ATTR}] { visibility:hidden !important; pointer-events:none !important; }
[${VISUAL_SCENERY_MOBILE_OVERFLOW_HOST_ATTR}] { display:block !important; position:relative !important; width:100% !important; max-width:100% !important; min-width:0 !important; height:auto !important; max-height:none !important; margin:12px 0 0 !important; padding:0 !important; overflow:visible !important; box-sizing:border-box !important; }
[${VISUAL_SCENERY_MOBILE_OVERFLOW_COPY_ATTR}] { display:block !important; position:static !important; inset:auto !important; width:auto !important; max-width:100% !important; min-width:0 !important; height:auto !important; max-height:none !important; margin:0 !important; padding:8px 4px 10px !important; overflow:visible !important; opacity:1 !important; transform:none !important; white-space:normal !important; overflow-wrap:anywhere !important; word-break:break-word !important; line-height:1.8 !important; color:inherit !important; background:transparent !important; box-shadow:none !important; }
[${VISUAL_SCENERY_MOBILE_OVERFLOW_COPY_ATTR}] + [${VISUAL_SCENERY_MOBILE_OVERFLOW_COPY_ATTR}] { margin-top:8px !important; }
}`;
    return style;
}


export function installVisualSceneryMobileNarrativeOverflowRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    root.querySelectorAll(`[${VISUAL_SCENERY_MOBILE_OVERFLOW_HOST_ATTR}]`).forEach(node => node.remove());
    root.querySelectorAll(`[${VISUAL_SCENERY_MOBILE_OVERFLOW_SOURCE_ATTR}]`).forEach(node => node.removeAttribute(VISUAL_SCENERY_MOBILE_OVERFLOW_SOURCE_ATTR));
    root.removeAttribute(VISUAL_SCENERY_MOBILE_OVERFLOW_COUNT_ATTR);

    const records = visualSceneryMobileOverflowCandidateRecords(root);
    if (!records.length) return 0;
    ensureVisualSceneryMobileOverflowStyle(root);
    let repaired = 0;
    for (const { scene, candidates } of records) {
        let anchor = scene;
        while (anchor.parentElement && anchor.parentElement !== root && !anchor.parentElement.matches?.('details,toto')) {
            anchor = anchor.parentElement;
        }
        const host = document.createElement('div');
        host.setAttribute(VISUAL_SCENERY_MOBILE_OVERFLOW_HOST_ATTR, 'true');
        let copied = 0;
        for (const source of candidates) {
            if (!source?.isConnected) continue;
            const copy = cleanVisualSceneryOverflowClone(source.cloneNode(true));
            copy.setAttribute(VISUAL_SCENERY_MOBILE_OVERFLOW_COPY_ATTR, 'true');
            source.setAttribute(VISUAL_SCENERY_MOBILE_OVERFLOW_SOURCE_ATTR, 'true');
            host.appendChild(copy);
            copied += 1;
        }
        if (!copied) continue;
        anchor.insertAdjacentElement('afterend', host);
        repaired += copied;
    }
    if (repaired > 0) root.setAttribute(VISUAL_SCENERY_MOBILE_OVERFLOW_COUNT_ATTR, String(repaired));
    return repaired;
}



function independentMobileSpatialViewportNarrow(root) {
    // External RabbitMirror has its own narrow shell even on a wide desktop window.
    // Use the real mounted mirror width first; window.innerWidth is only a fallback.
    let rootWidth = 0;
    try { rootWidth = Number(root?.getBoundingClientRect?.().width || root?.parentElement?.getBoundingClientRect?.().width || 0); } catch {}
    if (rootWidth > 0) return rootWidth <= 760;
    const viewportWidth = Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
    return viewportWidth > 0 && viewportWidth <= MOBILE_LAYOUT_BREAKPOINT_PX + 40;
}


function independentMobileSpatialClippingAncestor(host, root) {
    let current = host?.parentElement || null;
    for (let depth = 0; current && depth < 5; depth += 1, current = current.parentElement) {
        if (current === root) break;
        const style = maintenanceMobileLayoutComputedStyle(current);
        const overflowX = String(style?.overflowX || style?.overflow || '').toLowerCase();
        if (/(?:hidden|clip)/.test(overflowX)) return current;
    }
    return null;
}


function independentMobileSpatialCanvasInfo(host, root) {
    if (!host?.querySelectorAll || maintenanceMobileLayoutIsInternal(host)) return null;
    if (host.hasAttribute?.(HCLIP_ENSEMBLE_FIT_ATTR) || host.closest?.(`[${HCLIP_ENSEMBLE_FIT_ATTR}]`)) return null;
    const hostStyle = maintenanceMobileLayoutComputedStyle(host);
    const position = String(hostStyle?.position || '').toLowerCase();
    if (!['relative', 'absolute'].includes(position)) return null;
    const hostRect = maintenanceMobileLayoutRect(host);
    if (!hostRect || hostRect.width < 180) return null;

    const absoluteChildren = [...host.children].filter(child => {
        if (maintenanceMobileLayoutIsInternal(child)) return false;
        const childPosition = String(maintenanceMobileLayoutComputedStyle(child)?.position || '').toLowerCase();
        return childPosition === 'absolute' || childPosition === 'fixed';
    });
    if (absoluteChildren.length < 3) return null;

    let farRight = hostRect.width;
    let farBottom = hostRect.height;
    let meaningful = 0;
    for (const child of absoluteChildren) {
        const childRect = maintenanceMobileLayoutRect(child);
        if (!childRect) continue;
        farRight = Math.max(farRight, childRect.right - hostRect.left);
        farBottom = Math.max(farBottom, childRect.bottom - hostRect.top);
        if (maintenanceMobileLayoutTextLength(child) >= 8 || child.matches?.('img,svg,canvas,video,figure')) meaningful += 1;
    }
    const naturalWidth = Math.max(Number(host.scrollWidth || 0), farRight);
    if (meaningful < 2 || naturalWidth <= hostRect.width + 48 || naturalWidth <= hostRect.width * 1.14) return null;
    if (naturalWidth > 1800) return null;

    const clippingAncestor = independentMobileSpatialClippingAncestor(host, root);
    if (!clippingAncestor) return null;
    return { host, clippingAncestor, naturalWidth: Math.ceil(naturalWidth), naturalHeight: Math.ceil(Math.max(Number(host.scrollHeight || 0), farBottom)) };
}


export function activateRabbitMirrorIndependentMobileSpatialRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    const independent = root.getAttribute?.('data-rabbit-mirror-external-source') === 'independent'
        || !!root.closest?.('[data-rabbit-mirror-external-source="independent"]');
    if (!independent) return 0;

    // Always clear stale marks first. Container width can change without a full regeneration.
    root.querySelectorAll(`[${INDEPENDENT_MOBILE_SPATIAL_SCROLL_ATTR}], [${INDEPENDENT_MOBILE_SPATIAL_CANVAS_ATTR}]`).forEach(element => {
        element.removeAttribute(INDEPENDENT_MOBILE_SPATIAL_SCROLL_ATTR);
        element.removeAttribute(INDEPENDENT_MOBILE_SPATIAL_CANVAS_ATTR);
        element.style?.removeProperty?.('--rm-mobile-spatial-natural-width');
    });
    if (!independentMobileSpatialViewportNarrow(root)) {
        root.removeAttribute(INDEPENDENT_MOBILE_SPATIAL_COUNT_ATTR);
        root.querySelector?.(`style[${INDEPENDENT_MOBILE_SPATIAL_STYLE_ATTR}]`)?.remove?.();
        return 0;
    }

    const infos = [...root.querySelectorAll('div,section,article,main,figure')]
        .map(host => independentMobileSpatialCanvasInfo(host, root))
        .filter(Boolean)
        .filter((info, index, all) => !all.some((other, otherIndex) => otherIndex !== index && other.host.contains?.(info.host) && other.naturalWidth >= info.naturalWidth));
    if (!infos.length) {
        root.removeAttribute(INDEPENDENT_MOBILE_SPATIAL_COUNT_ATTR);
        root.querySelector?.(`style[${INDEPENDENT_MOBILE_SPATIAL_STYLE_ATTR}]`)?.remove?.();
        return 0;
    }

    for (const info of infos) {
        info.clippingAncestor.setAttribute(INDEPENDENT_MOBILE_SPATIAL_SCROLL_ATTR, 'true');
        info.host.setAttribute(INDEPENDENT_MOBILE_SPATIAL_CANVAS_ATTR, 'true');
        info.host.style.setProperty('--rm-mobile-spatial-natural-width', `${Math.max(320, info.naturalWidth)}px`);
    }
    let style = root.querySelector(`style[${INDEPENDENT_MOBILE_SPATIAL_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(INDEPENDENT_MOBILE_SPATIAL_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = `[${INDEPENDENT_MOBILE_SPATIAL_SCROLL_ATTR}] { overflow-x: auto !important; overscroll-behavior-inline: contain !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-x pan-y !important; }
[${INDEPENDENT_MOBILE_SPATIAL_CANVAS_ATTR}] { width: var(--rm-mobile-spatial-natural-width) !important; min-width: var(--rm-mobile-spatial-natural-width) !important; max-width: none !important; box-sizing: border-box !important; }`;
    root.setAttribute(INDEPENDENT_MOBILE_SPATIAL_COUNT_ATTR, String(infos.length));
    return infos.length;
}


function maintenanceMobileLayoutCss(scopeToken) {
    const scope = `[${MOBILE_LAYOUT_SCOPE_ATTR}="${scopeToken}"]`;
    return `@media (max-width: ${MOBILE_LAYOUT_BREAKPOINT_PX}px) {
${scope} [${MOBILE_LAYOUT_FIT_ATTR}] { max-width: 100% !important; box-sizing: border-box !important; min-width: 0 !important; }
${scope} [${MOBILE_LAYOUT_MIN_ATTR}] { min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important; }
${scope} [${MOBILE_LAYOUT_GRID_COLLAPSE_ATTR}] { grid-template-columns: minmax(0, 1fr) !important; width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; }
${scope} [${MOBILE_LAYOUT_MATRIX_PRESERVE_ATTR}] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; }
${scope} [${MOBILE_LAYOUT_MATRIX_PRESERVE_ATTR}][${MOBILE_LAYOUT_MATRIX_ACTIVE_ATTR}] { aspect-ratio: auto !important; height: auto !important; max-height: none !important; grid-template-rows: repeat(2, minmax(0, 1fr)) !important; align-items: stretch !important; }
${scope} [${MOBILE_LAYOUT_MATRIX_CELL_ATTR}] { min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important; overflow: hidden !important; padding-left: clamp(10px, 3vw, 16px) !important; padding-right: clamp(10px, 3vw, 16px) !important; overflow-wrap: anywhere !important; word-break: break-word !important; }
${scope} [${MOBILE_LAYOUT_MATRIX_PRESERVE_ATTR}][${MOBILE_LAYOUT_MATRIX_ACTIVE_ATTR}] [${MOBILE_LAYOUT_MATRIX_CELL_ATTR}] { height: auto !important; min-height: 0 !important; }
${scope} [${MOBILE_LAYOUT_FLEX_WRAP_ATTR}] { flex-wrap: wrap !important; min-width: 0 !important; }
${scope} [${MOBILE_LAYOUT_STATE_ROW_ATTR}] { flex-wrap: nowrap !important; min-width: 0 !important; max-width: 100% !important; align-items: stretch !important; overflow-x: auto !important; overflow-y: hidden !important; overscroll-behavior-inline: contain; -webkit-overflow-scrolling: touch; }
${scope} [${MOBILE_LAYOUT_STATE_ROW_ATTR}] > label { max-width: none !important; box-sizing: border-box !important; }
${scope} [${MOBILE_LAYOUT_FLEX_STACK_ATTR}] { flex-direction: column !important; align-items: stretch !important; min-width: 0 !important; }
${scope} [${MOBILE_LAYOUT_SINGLE_COLUMN_ATTR}] { column-count: 1 !important; column-width: auto !important; }
${scope} [${MOBILE_LAYOUT_FLUID_TITLE_ATTR}] { font-size: clamp(1.1rem, 5.2vw, 1.5rem) !important; line-height: 1.18 !important; overflow-wrap: anywhere !important; word-break: break-word !important; }
${scope} [${MOBILE_LAYOUT_COMPACT_PADDING_ATTR}] { padding-left: clamp(10px, 4vw, 20px) !important; padding-right: clamp(10px, 4vw, 20px) !important; }
${scope} [${MOBILE_LAYOUT_COMPACT_GAP_ATTR}] { gap: clamp(10px, 3vw, 20px) !important; }
${scope} [${MOBILE_LAYOUT_MEDIA_ATTR}] { max-width: 100% !important; box-sizing: border-box !important; }
${scope} img[${MOBILE_LAYOUT_MEDIA_ATTR}], ${scope} video[${MOBILE_LAYOUT_MEDIA_ATTR}], ${scope} canvas[${MOBILE_LAYOUT_MEDIA_ATTR}] { height: auto !important; }
${scope} iframe[${MOBILE_LAYOUT_MEDIA_ATTR}] { width: 100% !important; }
${scope} [${MOBILE_LAYOUT_SCROLL_ATTR}] { max-width: 100% !important; overflow-x: auto !important; overscroll-behavior-inline: contain; -webkit-overflow-scrolling: touch; }
${scope} table[${MOBILE_LAYOUT_SCROLL_ATTR}], ${scope} pre[${MOBILE_LAYOUT_SCROLL_ATTR}] { display: block !important; }
${scope} [${MOBILE_LAYOUT_BREAK_TEXT_ATTR}] { overflow-wrap: anywhere !important; word-break: break-word !important; min-width: 0 !important; }
${scope} [${MOBILE_LAYOUT_SQUEEZED_TEXT_ATTR}] { min-width:min(72%, 280px) !important; max-width:calc(100% - 16px) !important; box-sizing:border-box !important; white-space:normal !important; overflow-wrap:break-word !important; word-break:normal !important; }
${scope} [${MOBILE_LAYOUT_UNDERFILL_ATTR}] { width:min(100%, 420px) !important; min-width:min(100%, 420px) !important; max-width:100% !important; box-sizing:border-box !important; }
${scope} [${MOBILE_LAYOUT_STATE_CONTENT_ATTR}][${MOBILE_LAYOUT_STATE_ACTIVE_ATTR}] { height: auto !important; max-height: none !important; overflow: visible !important; }
${scope} [${MOBILE_LAYOUT_RELATION_BRANCH_ATTR}] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; width: 100% !important; max-width: 100% !important; min-width: 0 !important; gap: clamp(8px, 3vw, 16px) !important; overflow: visible !important; }
${scope} [${MOBILE_LAYOUT_RELATION_CELL_ATTR}] { min-width: 0 !important; max-width: none !important; overflow: visible !important; }
${scope} [${MOBILE_LAYOUT_RELATION_DETAIL_ATTR}] { width: calc(200% + clamp(8px, 3vw, 16px)) !important; max-width: none !important; box-sizing: border-box !important; overflow-wrap: break-word !important; word-break: normal !important; }
${scope} [${MOBILE_LAYOUT_RELATION_DETAIL_ATTR}][${MOBILE_LAYOUT_RELATION_SIDE_ATTR}="left"] { transform: none !important; }
${scope} [${MOBILE_LAYOUT_RELATION_DETAIL_ATTR}][${MOBILE_LAYOUT_RELATION_SIDE_ATTR}="right"] { transform: translateX(calc(-50% - clamp(4px, 1.5vw, 8px))) !important; }
}`;
}




function maintenanceMobileLayoutSqueezedTextCandidate(element, style = null, referenceWidth = 0) {
    if (!element?.parentElement || referenceWidth < 280) return false;
    if (maintenanceMobileLayoutIsInternal(element) || maintenanceMobileLayoutIsPassportManaged(element)) return false;
    if (element.matches?.('input,select,textarea,button,label,a,pre,code,table,blockquote,figcaption,svg,canvas,img,video,iframe')) return false;
    if (element.closest?.('[data-rm-touch-zone]')) return false;

    const computed = style || maintenanceMobileLayoutComputedStyle(element);
    const rect = maintenanceMobileLayoutRect(element);
    const parentRect = maintenanceMobileLayoutRect(element.parentElement);
    if (!computed || !rect || !parentRect || parentRect.width < 260 || rect.width <= 0 || rect.height <= 0) return false;
    const textLength = maintenanceMobileLayoutTextLength(element);
    if (textLength < 72) return false;

    const writingMode = String(computed.writingMode || '').trim().toLowerCase();
    if (writingMode && !writingMode.startsWith('horizontal')) return false;
    const whiteSpace = String(computed.whiteSpace || '').trim().toLowerCase();
    if (/(?:pre|nowrap)/.test(whiteSpace)) return false;
    const signature = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('role') || ''} ${element.getAttribute?.('aria-label') || ''}`;
    if (/(?:^|[-_\s])(?:sidebar|side-bar|rail|toc|menu|nav|toolbar|badge|tag|legend|avatar|icon|ticker|caption|label|quote|blockquote|poem|verse|lyrics|lyric|haiku|couplet|vertical-text)(?:$|[-_\s])/i.test(signature)) return false;

    const fontSize = maintenanceMobileLayoutLengthPx(computed.fontSize, parentRect.width) || Number.parseFloat(computed.fontSize || '0') || 0;
    if (fontSize < 10 || fontSize > 42) return false;
    const padding = maintenanceMobileLayoutLengthPx(computed.paddingLeft, parentRect.width)
        + maintenanceMobileLayoutLengthPx(computed.paddingRight, parentRect.width);
    const usableWidth = Math.max(1, rect.width - padding);
    const approxCharsPerLine = usableWidth / Math.max(10, fontSize * 0.95);
    const parentFraction = rect.width / Math.max(1, parentRect.width);
    const extremeNarrow = rect.width <= 176 && parentFraction <= 0.5 && parentRect.width - rect.width >= 72;
    const columnLike = rect.height / Math.max(1, rect.width) >= 2.2 && approxCharsPerLine <= 5.4;
    if (!extremeNarrow || !columnLike) return false;

    const transform = String(computed.transform || '').trim().toLowerCase();
    const matrix = transform.match(/^matrix\(([^)]+)\)$/);
    if (matrix) {
        const parts = matrix[1].split(',').map(value => Number.parseFloat(value.trim()));
        if (parts.length >= 4 && (Math.abs(parts[1] || 0) > 0.08 || Math.abs(parts[2] || 0) > 0.08)) return false;
    }
    const aspectRatio = String(computed.aspectRatio || '').trim().toLowerCase();
    if (aspectRatio && aspectRatio !== 'auto') return false;

    // On absolute Visual Scenery overlays, only rescue a block that is already geometrically
    // centered. This avoids stretching intentionally narrow edge labels or side annotations.
    const position = String(computed.position || '').trim().toLowerCase();
    if (position === 'absolute' || position === 'fixed') {
        const centerDelta = Math.abs((rect.left + rect.width / 2) - (parentRect.left + parentRect.width / 2));
        if (centerDelta > parentRect.width * 0.2) return false;
    }
    return true;
}


function maintenanceMobileLayoutUnderfillCandidate(element, style = null, referenceWidth = 0) {
    if (!element?.parentElement || referenceWidth < 300) return false;
    if (maintenanceMobileLayoutIsInternal(element) || maintenanceMobileLayoutIsPassportManaged(element)) return false;
    if (maintenanceMobileLayoutHorizontalMediaHint(element)) return false;
    const computed = style || maintenanceMobileLayoutComputedStyle(element);
    const rect = maintenanceMobileLayoutRect(element);
    const parent = element.parentElement;
    const parentStyle = maintenanceMobileLayoutComputedStyle(parent);
    const parentRect = maintenanceMobileLayoutRect(parent);
    if (!computed || !rect || !parentStyle || !parentRect || rect.width < 170 || parentRect.width < 300) return false;
    if (rect.width >= Math.min(referenceWidth, parentRect.width) * 0.78) return false;
    if (parentRect.width - rect.width < 56) return false;
    const position = String(computed.position || '').toLowerCase();
    if (position === 'absolute' || position === 'fixed') return false;
    const writingMode = String(computed.writingMode || '').trim().toLowerCase();
    if (writingMode && writingMode !== 'horizontal-tb') return false;
    const parentDisplay = String(parentStyle.display || '').toLowerCase();
    const centeredFlex = parentDisplay.includes('flex') && /center/.test(String(parentStyle.justifyContent || '').toLowerCase());
    const centeredGrid = parentDisplay.includes('grid') && /center/.test(`${parentStyle.justifyItems || ''} ${parentStyle.placeItems || ''}`.toLowerCase());
    if (!centeredFlex && !centeredGrid) return false;

    const signature = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('role') || ''}`;
    if (/(?:^|[-_\s])(?:sidebar|side-bar|rail|toc|menu|nav|toolbar|badge|tag|legend|avatar|icon|ticket|receipt|passport|document|tarot|playing-card|photo|polaroid|postcard|phone|mobile|device|stamp|qr|barcode|coupon|voucher|letter|invitation|envelope|book|page|poster|sheet|parchment|scroll|certificate|stationery)(?:$|[-_\s])/i.test(signature)) return false;
    if (String(computed.aspectRatio || '').toLowerCase() !== 'auto' && String(computed.aspectRatio || '').trim()) return false;
    const explicitMaxWidth = Math.max(
        maintenanceMobileLayoutLengthPx(computed.maxWidth, parentRect.width),
        maintenanceMobileLayoutLengthPx(computed.maxInlineSize, parentRect.width),
    );
    if (explicitMaxWidth > 0 && explicitMaxWidth <= 340) return false;
    const explicitFlexBasis = maintenanceMobileLayoutLengthPx(computed.flexBasis, parentRect.width);
    if (explicitFlexBasis > 0 && explicitFlexBasis <= 340) return false;
    if (maintenanceMobileLayoutTextLength(element) < 110 || Number(element.childElementCount || 0) < 2) return false;

    const meaningfulSiblings = [...parent.children].filter(child => {
        if (child === element || maintenanceMobileLayoutIsInternal(child)) return false;
        const childStyle = maintenanceMobileLayoutComputedStyle(child);
        if (!childStyle || childStyle.display === 'none' || childStyle.visibility === 'hidden') return false;
        const childRect = maintenanceMobileLayoutRect(child);
        const childWidth = Number(childRect?.width || 0);
        const childHeight = Number(childRect?.height || 0);
        if (childWidth <= 8 && childHeight <= 8) return false;
        const childText = maintenanceMobileLayoutTextLength(child);
        if (childText >= 8) return true;
        if (!child.matches?.('img,svg,canvas,video,figure')) return false;
        const hint = `${child.id || ''} ${child.className || ''} ${child.getAttribute?.('role') || ''} ${child.getAttribute?.('aria-label') || ''}`;
        const decorative = child.getAttribute?.('aria-hidden') === 'true'
            || String(childStyle.pointerEvents || '').toLowerCase() === 'none'
            || /(?:^|[-_\s])(?:icon|badge|ornament|decor|decoration|seal|stamp|mark|sparkle|flourish)(?:$|[-_\s])/i.test(hint);
        if (decorative) return false;
        return (childWidth >= 64 && childHeight >= 48) || childWidth * childHeight >= 4096;
    });
    if (meaningfulSiblings.length > 0) return false;

    const fixedWidth = maintenanceMobileLayoutLengthPx(computed.width, parentRect.width);
    return fixedWidth > 0 && fixedWidth <= 340;
}


export function inspectMaintenanceMobileLayout(root) {
    const empty = {
        candidateCount: 0,
        viewportWidth: Number(globalThis.innerWidth || 0),
        narrowViewport: false,
        horizontalOverflowCount: 0,
        fixedWidthCount: 0,
        gridCount: 0,
        matrixCount: 0,
        flexCount: 0,
        multiColumnCount: 0,
        mediaCount: 0,
        stateContentCount: 0,
        squeezedTextCount: 0,
        underfillCount: 0,
        passportDocumentCount: 0,
        sectionStackCount: 0,
        screenShellCount: 0,
        relationTreeCount: 0,
        visualSceneryOverflowCount: 0,
    };
    if (!root?.querySelectorAll) return empty;
    const viewportWidth = Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
    const narrowViewport = viewportWidth > 0 && viewportWidth <= MOBILE_LAYOUT_BREAKPOINT_PX + 40;
    if (!narrowViewport) return { ...empty, viewportWidth, narrowViewport };

    const rootRect = maintenanceMobileLayoutRect(root);
    const referenceWidth = Math.max(280, Math.min(
        Number(rootRect?.width || 0) || Number(root.parentElement?.clientWidth || 0) || viewportWidth || MOBILE_LAYOUT_BREAKPOINT_PX,
        viewportWidth || MOBILE_LAYOUT_BREAKPOINT_PX,
        MOBILE_LAYOUT_BREAKPOINT_PX,
    ));
    const buckets = {
        horizontalOverflow: new Set(),
        fixedWidth: new Set(),
        grid: new Set(),
        matrix: new Set(),
        flex: new Set(),
        multiColumn: new Set(),
        media: new Set(),
        stateContent: new Set(),
        squeezedText: new Set(),
        underfill: new Set(),
        relationTree: new Set(),
    };
    const alreadyRepaired = root.hasAttribute(MOBILE_LAYOUT_SCOPE_ATTR)
        && !!root.querySelector(`style[${MOBILE_LAYOUT_RESCUE_STYLE_ATTR}]`);
    // Keep diagnostics aligned with what the mobile rescue can actually patch.
    // The outer RabbitMirror root (often <details>) also contains the summary/tool row;
    // its scrollWidth can therefore grow because of a long title + 🐇/🐈 tools even when
    // the generated body itself fits perfectly. The rescue intentionally patches only
    // descendants, so counting the root here creates a permanent false-positive finding.
    const elements = [...root.querySelectorAll('*')].filter(element => !maintenanceMobileLayoutIsInternal(element));
    const sectionStackHosts = elements.filter(element => maintenanceMobileLayoutSectionStackInfo(element));
    const screenShellHosts = elements.filter(element => maintenanceMobileLayoutScreenShellInfo(element))
        .filter(host => !elements.some(other => other !== host && maintenanceMobileLayoutScreenShellInfo(other) && other.contains?.(host)));

    const relationTreeInfos = elements.map(maintenanceMobileLayoutRelationTreeInfo).filter(Boolean);
    relationTreeInfos.forEach(info => buckets.relationTree.add(info.branch));
    for (const element of elements) {
        if (maintenanceMobileLayoutElementInSectionStack(element, sectionStackHosts)
            || maintenanceMobileLayoutElementInScreenShell(element, screenShellHosts)
            || maintenanceMobileLayoutElementInRelationTree(element, relationTreeInfos)) continue;
        const style = maintenanceMobileLayoutComputedStyle(element);
        if (!style) continue;
        const rect = maintenanceMobileLayoutRect(element);
        const display = String(style.display || '').toLowerCase();
        const inlineStyle = String(element.getAttribute?.('style') || '').toLowerCase();
        const clientWidth = Number(element.clientWidth || 0);
        const scrollWidth = Number(element.scrollWidth || 0);
        const overflowsSelf = clientWidth > 0 && scrollWidth > clientWidth + 3;
        const overflowsViewport = !!rect && (rect.left < -3 || rect.right > viewportWidth + 3);
        const decorativeOverflow = maintenanceMobileLayoutIsDecorativeOverflow(element, style);
        const passportManaged = maintenanceMobileLayoutIsPassportManaged(element);
        if (!decorativeOverflow && !passportManaged && (overflowsSelf || overflowsViewport)) buckets.horizontalOverflow.add(element);

        const minWidth = maintenanceMobileLayoutLengthPx(style.minWidth, referenceWidth);
        const fixedWidth = maintenanceMobileLayoutLengthPx(style.width, referenceWidth);
        const explicitLargeWidth = /(?:^|;)\s*(?:width|min-width)\s*:\s*(?:3[6-9]\d|[4-9]\d{2}|\d{4,})(?:\.\d+)?px\b/.test(inlineStyle);
        if (!passportManaged && !element.hasAttribute(MOBILE_LAYOUT_FIT_ATTR) && (minWidth > referenceWidth + 3 || fixedWidth > referenceWidth + 3 || explicitLargeWidth)) {
            buckets.fixedWidth.add(element);
        }

        if (display.includes('grid') && !element.hasAttribute(MOBILE_LAYOUT_GRID_COLLAPSE_ATTR) && !element.hasAttribute(PASSPORT_DOCUMENT_PAGES_ATTR)) {
            const template = String(style.gridTemplateColumns || '').trim();
            const tracks = maintenanceMobileLayoutSplitTracks(template);
            const textHeavy = maintenanceMobileLayoutTextLength(element) >= 120;
            const matrixInfo = maintenanceMobileLayoutSemanticMatrixInfo(element, style);
            const spatialGridInfo = maintenanceMobileLayoutSpatialGridInfo(element, style);
            if (matrixInfo) {
                const matrixInputs = maintenanceMobileLayoutMatrixInputs(root, matrixInfo.cells);
                const active = matrixInputs.some(input => input.checked);
                const cellClipped = matrixInfo.cells.some(cell => Number(cell.scrollHeight || 0) > Number(cell.clientHeight || 0) + 3);
                const constrained = String(style.aspectRatio || '').toLowerCase() !== 'auto'
                    || maintenanceMobileLayoutLengthPx(style.maxHeight, referenceWidth) > 0
                    || maintenanceMobileLayoutLengthPx(style.height, referenceWidth) > 0;
                if (active && (cellClipped || constrained)) buckets.matrix.add(element);
            } else if (spatialGridInfo) {
                // 空间型 Grid 只报告真实横向溢出，不作为“应折成单列”的普通 Grid 候选。
                if (overflowsSelf || overflowsViewport) buckets.horizontalOverflow.add(element);
            } else if (tracks.length > 1 && (overflowsSelf || overflowsViewport || textHeavy)) {
                buckets.grid.add(element);
            }
        }

        if (display.includes('flex') && !passportManaged && !element.hasAttribute(MOBILE_LAYOUT_FLEX_WRAP_ATTR) && !element.hasAttribute(MOBILE_LAYOUT_FLEX_STACK_ATTR)) {
            const direction = String(style.flexDirection || 'row').toLowerCase();
            if (direction.startsWith('row')) {
                const children = [...(element.children || [])].filter(child => {
                    if (maintenanceMobileLayoutIsInternal(child)) return false;
                    const childPosition = String(maintenanceMobileLayoutComputedStyle(child)?.position || '').toLowerCase();
                    return childPosition !== 'absolute' && childPosition !== 'fixed';
                });
                const wrap = String(style.flexWrap || '').toLowerCase();
                const hasLargeHeading = !!element.querySelector?.(':scope > h1, :scope > h2');
                const childOverflow = rect ? children.some(child => {
                    const childRect = maintenanceMobileLayoutRect(child);
                    return childRect && (childRect.right > rect.right + 3 || childRect.left < rect.left - 3);
                }) : false;
                const gap = maintenanceMobileLayoutLengthPx(style.columnGap || style.gap, referenceWidth);
                let nonShrinkWidth = 0;
                let nonShrinkCount = 0;
                for (const child of children) {
                    const childRect = maintenanceMobileLayoutRect(child);
                    const childStyle = maintenanceMobileLayoutComputedStyle(child);
                    if (Number.parseFloat(childStyle?.flexShrink || '1') !== 0) continue;
                    nonShrinkCount += 1;
                    nonShrinkWidth += Math.max(
                        Number(childRect?.width || 0),
                        maintenanceMobileLayoutLengthPx(childStyle?.width, referenceWidth),
                        maintenanceMobileLayoutLengthPx(childStyle?.minWidth, referenceWidth),
                    );
                }
                nonShrinkWidth += Math.max(0, nonShrinkCount - 1) * gap;
                const constrainedChildren = nonShrinkCount >= 2 && nonShrinkWidth > referenceWidth + 3;
                if (children.length > 1 && wrap === 'nowrap' && (overflowsSelf || childOverflow || hasLargeHeading || constrainedChildren)) {
                    buckets.flex.add(element);
                }
            }
        }

        if (!element.hasAttribute(MOBILE_LAYOUT_SQUEEZED_TEXT_ATTR)
            && maintenanceMobileLayoutSqueezedTextCandidate(element, style, referenceWidth)) {
            buckets.squeezedText.add(element);
        }

        if (!element.hasAttribute(MOBILE_LAYOUT_UNDERFILL_ATTR)
            && maintenanceMobileLayoutUnderfillCandidate(element, style, referenceWidth)) {
            buckets.underfill.add(element);
        }

        const columnCount = Number.parseInt(style.columnCount || '1', 10) || 1;
        if (columnCount > 1 && !element.hasAttribute(MOBILE_LAYOUT_SINGLE_COLUMN_ATTR)) buckets.multiColumn.add(element);

        if (element.matches?.('img,video,iframe,canvas,svg,table,pre')) {
            const mediaOverflow = overflowsSelf || overflowsViewport || Number(rect?.width || 0) > referenceWidth + 3;
            if (mediaOverflow && !element.hasAttribute(MOBILE_LAYOUT_MEDIA_ATTR) && !element.hasAttribute(MOBILE_LAYOUT_SCROLL_ATTR)) {
                buckets.media.add(element);
            }
        }
    }

    if (!alreadyRepaired) {
        for (const input of root.querySelectorAll('input[type="checkbox"], input[type="radio"]')) {
            for (const rule of parseCheckedRulesFromText(root, input)) {
                const fixedLimit = maintenanceMobileLayoutFixedRevealLimit(rule.styleMap, referenceWidth);
                if (fixedLimit <= 0) continue;
                for (const target of maintenanceMobileLayoutResolveCheckedTargets(root, input, rule)) {
                    if (target.hasAttribute(MOBILE_LAYOUT_STATE_CONTENT_ATTR)) continue;
                    const hasContent = maintenanceMobileLayoutTextLength(target) >= 8 || Number(target.childElementCount || 0) > 0;
                    if (!hasContent) continue;
                    const collapsedInitially = /^(?:0|0px)$/.test(String(target.style?.height || '').trim());
                    const naturalHeight = Math.max(Number(target.scrollHeight || 0), Number(maintenanceMobileLayoutRect(target)?.height || 0));
                    if (collapsedInitially || naturalHeight === 0 || naturalHeight > fixedLimit + 8) buckets.stateContent.add(target);
                }
            }
        }
    }

    const visualSceneryOverflowCount = visualSceneryMobileOverflowCandidateRecords(root)
        .reduce((sum, record) => sum + (record?.candidates?.length || 0), 0);
    const unique = new Set(Object.values(buckets).flatMap(set => [...set]));
    return {
        candidateCount: unique.size + visualSceneryOverflowCount,
        viewportWidth,
        narrowViewport,
        horizontalOverflowCount: buckets.horizontalOverflow.size,
        fixedWidthCount: buckets.fixedWidth.size,
        gridCount: buckets.grid.size,
        matrixCount: buckets.matrix.size,
        flexCount: buckets.flex.size,
        multiColumnCount: buckets.multiColumn.size,
        mediaCount: buckets.media.size,
        stateContentCount: buckets.stateContent.size,
        squeezedTextCount: buckets.squeezedText.size,
        underfillCount: buckets.underfill.size,
        passportDocumentCount: findRenderedPassportDocumentCandidates(root).length,
        sectionStackCount: sectionStackHosts.length,
        screenShellCount: screenShellHosts.length,
        relationTreeCount: relationTreeInfos.length,
        visualSceneryOverflowCount,
    };
}


export function installMaintenanceMobileLayoutRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    let scopeToken = root.getAttribute(MOBILE_LAYOUT_SCOPE_ATTR);
    if (!scopeToken) {
        scopeToken = maintenanceMobileLayoutCreateScopeToken();
        root.setAttribute(MOBILE_LAYOUT_SCOPE_ATTR, scopeToken);
    }

    for (const attr of MOBILE_LAYOUT_TARGET_ATTRS) {
        root.querySelectorAll(`[${attr}]`).forEach(element => element.removeAttribute(attr));
    }

    const rootRect = maintenanceMobileLayoutRect(root);
    const viewportWidth = Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
    const viewportLimit = viewportWidth > 0 && viewportWidth <= MOBILE_LAYOUT_BREAKPOINT_PX + 40
        ? viewportWidth
        : MOBILE_LAYOUT_BREAKPOINT_PX;
    const referenceWidth = Math.max(280, Math.min(
        Number(rootRect?.width || 0) || Number(root.parentElement?.clientWidth || 0) || viewportWidth || MOBILE_LAYOUT_BREAKPOINT_PX,
        viewportLimit,
        MOBILE_LAYOUT_BREAKPOINT_PX,
    ));
    const marked = new Set();
    const matrixEntries = [];
    const passportCandidates = findRenderedPassportDocumentCandidates(root);
    for (const candidate of passportCandidates) markRenderedPassportDocumentCandidate(candidate, marked);
    if (passportCandidates.length) ensurePassportDocumentRescueStyle(root);
    const elements = [...root.querySelectorAll('*')].filter(element => !maintenanceMobileLayoutIsInternal(element));
    const sectionStackHosts = elements.filter(element => maintenanceMobileLayoutSectionStackInfo(element));
    for (const host of sectionStackHosts) maintenanceMobileLayoutMark(host, MOBILE_LAYOUT_SECTION_STACK_PRESERVE_ATTR, marked);
    const screenShellHosts = elements.filter(element => maintenanceMobileLayoutScreenShellInfo(element))
        .filter(host => !elements.some(other => other !== host && maintenanceMobileLayoutScreenShellInfo(other) && other.contains?.(host)));
    for (const host of screenShellHosts) maintenanceMobileLayoutMark(host, MOBILE_LAYOUT_SCREEN_SHELL_PRESERVE_ATTR, marked);
    const relationTreeInfos = maintenanceMobileLayoutCollectRelationTrees(root, elements, marked);

    for (const element of elements) {
        if (maintenanceMobileLayoutElementInSectionStack(element, sectionStackHosts)
            || maintenanceMobileLayoutElementInScreenShell(element, screenShellHosts)
            || maintenanceMobileLayoutElementInRelationTree(element, relationTreeInfos)) continue;
        const style = maintenanceMobileLayoutComputedStyle(element);
        if (!style) continue;
        const rect = maintenanceMobileLayoutRect(element);
        const display = String(style.display || '').toLowerCase();
        const position = String(style.position || '').toLowerCase();
        const directChildren = [...(element.children || [])].filter(child => !maintenanceMobileLayoutIsInternal(child));
        const inlineStyle = String(element.getAttribute?.('style') || '').toLowerCase();
        const elementWidth = Number(rect?.width || 0);
        const clientWidth = Number(element.clientWidth || 0);
        const scrollWidth = Number(element.scrollWidth || 0);
        const overflowsSelf = clientWidth > 0 && scrollWidth > clientWidth + 3;
        const overflowsRoot = elementWidth > referenceWidth + 3;
        const minWidth = maintenanceMobileLayoutLengthPx(style.minWidth, referenceWidth);
        const inlineFixedWidth = /(?:^|;)\s*(?:width|min-width)\s*:\s*\d+(?:\.\d+)?(?:px|rem|em|vw)\b/.test(inlineStyle);
        const viewportWidthWithPadding = /(?:^|;)\s*width\s*:\s*100vw\b/.test(inlineStyle)
            && (maintenanceMobileLayoutLengthPx(style.paddingLeft, referenceWidth) + maintenanceMobileLayoutLengthPx(style.paddingRight, referenceWidth) > 0);

        const decorativeOverflow = maintenanceMobileLayoutIsDecorativeOverflow(element, style);
        const passportManaged = maintenanceMobileLayoutIsPassportManaged(element);
        if (!decorativeOverflow && !passportManaged && (overflowsRoot || minWidth > referenceWidth + 3 || inlineFixedWidth || viewportWidthWithPadding)) {
            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_FIT_ATTR, marked);
        }

        if (display.includes('grid')) {
            const template = String(style.gridTemplateColumns || '').trim();
            const tracks = maintenanceMobileLayoutSplitTracks(template);
            const matrixInfo = maintenanceMobileLayoutSemanticMatrixInfo(element, style, directChildren);
            const spatialGridInfo = maintenanceMobileLayoutSpatialGridInfo(element, style, directChildren);
            if (element.hasAttribute(PASSPORT_DOCUMENT_PAGES_ATTR)) {
                for (const child of directChildren) maintenanceMobileLayoutMark(child, MOBILE_LAYOUT_MIN_ATTR, marked);
            } else if (matrixInfo) {
                maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_MATRIX_PRESERVE_ATTR, marked);
                for (const cell of matrixInfo.cells) maintenanceMobileLayoutMark(cell, MOBILE_LAYOUT_MATRIX_CELL_ATTR, marked);
                matrixEntries.push({ matrix: element, inputs: maintenanceMobileLayoutMatrixInputs(root, matrixInfo.cells) });
            } else if (spatialGridInfo) {
                // 棋盘/地图/显式格位 Grid 保留列数与坐标。能放下时完全不改；真正超宽时只在自身局部滚动。
                for (const child of directChildren) maintenanceMobileLayoutMark(child, MOBILE_LAYOUT_MIN_ATTR, marked);
                if (overflowsSelf || overflowsRoot) maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_SCROLL_ATTR, marked);
            } else {
                for (const child of directChildren) maintenanceMobileLayoutMark(child, MOBILE_LAYOUT_MIN_ATTR, marked);
                if (tracks.length > 1 && (overflowsSelf || overflowsRoot)) {
                    if (maintenanceMobileLayoutHorizontalMediaHint(element)) {
                        maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_SCROLL_ATTR, marked);
                    } else {
                        maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_GRID_COLLAPSE_ATTR, marked);
                    }
                }
            }
        }

        if (display.includes('flex') && directChildren.length > 1 && !passportManaged) {
            const direction = String(style.flexDirection || 'row').toLowerCase();
            if (direction.startsWith('row')) {
                const flowChildren = directChildren.filter(child => {
                    const childPosition = String(maintenanceMobileLayoutComputedStyle(child)?.position || '').toLowerCase();
                    return childPosition !== 'absolute' && childPosition !== 'fixed';
                });
                const wrap = String(style.flexWrap || '').toLowerCase();
                const hasLargeHeading = !!element.querySelector?.(':scope > h1, :scope > h2');
                const childOverflow = rect ? flowChildren.some(child => {
                    const childRect = maintenanceMobileLayoutRect(child);
                    return childRect && (childRect.right > rect.right + 3 || childRect.left < rect.left - 3);
                }) : false;
                const gap = maintenanceMobileLayoutLengthPx(style.columnGap || style.gap, referenceWidth);
                let nonShrinkWidth = 0;
                let nonShrinkCount = 0;
                for (const child of flowChildren) {
                    const childRect = maintenanceMobileLayoutRect(child);
                    const childStyle = maintenanceMobileLayoutComputedStyle(child);
                    if (Number.parseFloat(childStyle?.flexShrink || '1') !== 0) continue;
                    nonShrinkCount += 1;
                    nonShrinkWidth += Math.max(
                        Number(childRect?.width || 0),
                        maintenanceMobileLayoutLengthPx(childStyle?.width, referenceWidth),
                        maintenanceMobileLayoutLengthPx(childStyle?.minWidth, referenceWidth),
                    );
                }
                nonShrinkWidth += Math.max(0, nonShrinkCount - 1) * gap;
                const constrainedChildren = nonShrinkCount >= 2 && nonShrinkWidth > referenceWidth + 3;
                if (wrap === 'nowrap' && (overflowsSelf || childOverflow || hasLargeHeading || constrainedChildren)) {
                    const stateRowInfo = maintenanceMobileLayoutStateRowInfo(element);
                    if (stateRowInfo) {
                        repairMaintenanceMobileStateRowClasses(stateRowInfo);
                        maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_STATE_ROW_ATTR, marked);
                    } else {
                        for (const child of flowChildren) maintenanceMobileLayoutMark(child, MOBILE_LAYOUT_MIN_ATTR, marked);
                        const textHeavyChildren = flowChildren.filter(child => maintenanceMobileLayoutTextLength(child) >= 18).length;
                        if (flowChildren.length <= 3 && textHeavyChildren >= 2) {
                            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_FLEX_STACK_ATTR, marked);
                        } else {
                            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_FLEX_WRAP_ATTR, marked);
                        }
                    }
                }
            }
        }

        if (maintenanceMobileLayoutSqueezedTextCandidate(element, style, referenceWidth)) {
            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_SQUEEZED_TEXT_ATTR, marked);
        }

        if (maintenanceMobileLayoutUnderfillCandidate(element, style, referenceWidth)) {
            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_UNDERFILL_ATTR, marked);
        }

        const columnCount = Number.parseInt(style.columnCount || '1', 10) || 1;
        if (columnCount > 1 || /(?:^|;)\s*column-count\s*:\s*[2-9]\d*\b/.test(inlineStyle)) {
            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_SINGLE_COLUMN_ATTR, marked);
        }

        if (element.matches?.('h1,h2,h3')) {
            const fontSize = maintenanceMobileLayoutLengthPx(style.fontSize, referenceWidth);
            // 只有真正偏大的标题才缩字号。旧逻辑把“文字较长”也当成大标题，
            // 会把原本 1.2rem 的标题在 440px 手机上反而放大到约 30px。
            if (fontSize >= 24) {
                maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_FLUID_TITLE_ATTR, marked);
            } else if (overflowsSelf || overflowsRoot) {
                // 小字号标题若只是长文本溢出，只允许断行，不得放大字号。
                maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_BREAK_TEXT_ATTR, marked);
            }
        }

        const maxHorizontalPadding = Math.max(
            maintenanceMobileLayoutLengthPx(style.paddingLeft, referenceWidth),
            maintenanceMobileLayoutLengthPx(style.paddingRight, referenceWidth),
        );
        if (maxHorizontalPadding >= 24 && elementWidth > 0 && elementWidth <= referenceWidth + 4) {
            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_COMPACT_PADDING_ATTR, marked);
        }
        const rowGap = maintenanceMobileLayoutLengthPx(style.rowGap, referenceWidth);
        const columnGap = maintenanceMobileLayoutLengthPx(style.columnGap, referenceWidth);
        if (Math.max(rowGap, columnGap) >= 24) maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_COMPACT_GAP_ATTR, marked);

        if (element.matches?.('img,video,iframe,canvas,svg')) {
            const decorativeOverlay = (position === 'absolute' || position === 'fixed')
                && String(style.pointerEvents || '').toLowerCase() === 'none';
            if (!decorativeOverlay) maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_MEDIA_ATTR, marked);
        }
        if (element.matches?.('table,pre')) {
            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_SCROLL_ATTR, marked);
        }

        const compactText = String(element.textContent || '').replace(/\s+/g, ' ').trim();
        const hasLongToken = /[^\s]{28,}/.test(compactText);
        if ((overflowsSelf && maintenanceMobileLayoutTextLength(element) > 0) || hasLongToken) {
            maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_BREAK_TEXT_ATTR, marked);
        }

        if ((position === 'absolute' || position === 'fixed') && maintenanceMobileLayoutTextLength(element) > 0 && rootRect && rect) {
            if (rect.left < rootRect.left - 4 || rect.right > rootRect.right + 4) {
                maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_FIT_ATTR, marked);
                maintenanceMobileLayoutMark(element, MOBILE_LAYOUT_BREAK_TEXT_ATTR, marked);
            }
        }
    }

    installMaintenanceMobileMatrixStateRescue(root, matrixEntries);
    installMaintenanceMobileStateContentRescue(root, marked, referenceWidth);
    const visualSceneryOverflowRepairCount = installVisualSceneryMobileNarrativeOverflowRescue(root);

    let rescueStyle = root.querySelector(`style[${MOBILE_LAYOUT_RESCUE_STYLE_ATTR}]`);
    if (!rescueStyle) {
        rescueStyle = document.createElement('style');
        rescueStyle.setAttribute(MOBILE_LAYOUT_RESCUE_STYLE_ATTR, 'true');
        root.appendChild(rescueStyle);
    }
    rescueStyle.textContent = maintenanceMobileLayoutCss(scopeToken);
    const count = marked.size + visualSceneryOverflowRepairCount;
    root.setAttribute(MOBILE_LAYOUT_RESCUE_COUNT_ATTR, String(count));
    return count;
}

// ---------------------------------------------------------------------------
// 1.3.62: 当前视口“被压窄正文 / 长内容裁切”急救。
//
// 1.3.60 首次补上宽屏实测，但仍有三个缺口：只修当前可见 panel、滚动属性从未真正
// 标记、以及只看 inline grid placement 容易把作者有意的窄栏误判。本版收紧为：
// 1) 只在真实几何证据足够强时跨满 Grid；2) 已识别的互斥状态 panel 同组一起修；
// 3) 对真实 overflow:hidden/clip 且内容超出容器的正文恢复可滚动；4) 诊断能看到这些候选。
// ---------------------------------------------------------------------------

export function viewportLayoutHasAuthoredGridPlacement(element) {
    const inline = String(element?.getAttribute?.('style') || '').toLowerCase();
    if (/grid-(?:column|area|row)\s*:/.test(inline)) return true;
    const style = maintenanceSafeComputedStyle(element);
    if (!style) return false;
    const start = String(style.gridColumnStart || 'auto').trim().toLowerCase();
    const end = String(style.gridColumnEnd || 'auto').trim().toLowerCase();
    const rowStart = String(style.gridRowStart || 'auto').trim().toLowerCase();
    const rowEnd = String(style.gridRowEnd || 'auto').trim().toLowerCase();
    return !['', 'auto'].includes(start) || !['', 'auto'].includes(end)
        || !['', 'auto'].includes(rowStart) || !['', 'auto'].includes(rowEnd);
}


function viewportLayoutHasAuthoredNarrowSize(element, parentWidth = 0) {
    const inline = String(element?.getAttribute?.('style') || '').toLowerCase();
    for (const match of inline.matchAll(/(?:^|;)\s*(width|max-width|min-width|flex-basis)\s*:\s*([^;]+)/g)) {
        const value = String(match[2] || '').trim();
        if (!value || /^(?:auto|none|max-content|min-content|fit-content)$/.test(value)) continue;
        const px = maintenanceMobileLayoutLengthPx(value, Math.max(1, parentWidth));
        // width:100% / max-width:100% 是“填满轨道”，并不代表作者想要窄栏；只有显式约束到
        // 父容器一半以下、且绝对尺寸确实偏窄时才视为作者意图。
        if (px > 0 && px <= VIEWPORT_SQUEEZE_MAX_WIDTH_PX + 20 && px < parentWidth * 0.5) return true;
    }
    const style = maintenanceSafeComputedStyle(element);
    if (!style) return false;
    const maxWidthText = String(style.maxWidth || '').trim().toLowerCase();
    if (!maxWidthText || maxWidthText === 'none') return false;
    const maxWidth = maintenanceMobileLayoutLengthPx(maxWidthText, Math.max(1, parentWidth));
    return maxWidth > 0 && maxWidth <= VIEWPORT_SQUEEZE_MAX_WIDTH_PX + 20 && maxWidth < parentWidth * 0.5;
}


function viewportLayoutIntentionalNarrowHint(element) {
    const tokens = getClassTokens(element).join(' ');
    const role = String(element?.getAttribute?.('role') || '');
    return /(?:^|[-_\s])(?:sidebar|side-bar|rail|toc|menu|nav|toolbar|badge|tag|legend|avatar|icon-list)(?:$|[-_\s])/i.test(`${tokens} ${role}`);
}


function viewportLayoutContentHint(element) {
    if (!element) return false;
    if (element.hasAttribute?.(EXCLUSIVE_STACKED_STATE_PANEL_ATTR)
        || element.hasAttribute?.(MOBILE_LAYOUT_STATE_CONTENT_ATTR)) return true;
    const tokens = getClassTokens(element).join(' ');
    const role = String(element.getAttribute?.('role') || '');
    return /(?:^|[-_\s])(?:panel|content|detail|body|text|comment|commentary|note|story|log|screen|viewport|drawer|popup|result|description|desc|article)(?:$|[-_\s])/i.test(`${tokens} ${role}`);
}


function viewportLayoutSharedStatePanels(element, parent) {
    if (!element || !parent?.children) return [element].filter(Boolean);
    const direct = [...parent.children].filter(child => !maintenanceMobileLayoutIsInternal(child));
    if (element.hasAttribute?.(EXCLUSIVE_STACKED_STATE_PANEL_ATTR)) {
        const owned = direct.filter(child => child.hasAttribute?.(EXCLUSIVE_STACKED_STATE_PANEL_ATTR));
        return owned.length >= 2 ? owned : [element];
    }
    const stateInputs = direct.filter(child => child.matches?.('input[type="radio"], input[type="checkbox"]'));
    if (stateInputs.length < 2) return [element];
    const meaningfulTokens = getClassTokens(element)
        .filter(token => /(?:panel|content|detail|body|comment|result|pane|view)/i.test(token));
    if (!meaningfulTokens.length) return [element];
    const siblings = direct.filter(child => child !== element
        && meaningfulTokens.some(token => child.classList?.contains?.(token))
        && maintenanceMobileLayoutTextLength(child) >= 20
        && !viewportLayoutHasAuthoredGridPlacement(child));
    return siblings.length ? [element, ...siblings] : [element];
}


function findViewportSqueezedCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const found = [];
    const seen = new Set();
    for (const element of root.querySelectorAll('*')) {
        if (maintenanceMobileLayoutIsInternal(element) || seen.has(element)) continue;
        if (!maintenanceIsVisibleContentElement(element)) continue;
        const parent = element.parentElement;
        if (!parent || parent === root) continue;
        const parentStyle = maintenanceSafeComputedStyle(parent);
        const parentDisplay = String(parentStyle?.display || '').toLowerCase();
        // 通用强修只处理 Grid。Flex 的窄栏很常见（例如 sidebar），不能仅凭几何擅自拉满。
        if (parentDisplay !== 'grid' && parentDisplay !== 'inline-grid') continue;
        if (viewportLayoutHasAuthoredGridPlacement(element) || viewportLayoutIntentionalNarrowHint(element)) continue;

        const rect = maintenanceMobileLayoutRect(element);
        const parentRect = maintenanceMobileLayoutRect(parent);
        if (!rect || !parentRect || rect.width <= 0 || rect.height <= 0) continue;
        if (parentRect.width < VIEWPORT_SQUEEZE_MIN_PARENT_WIDTH_PX) continue;
        if (rect.width >= VIEWPORT_SQUEEZE_MAX_WIDTH_PX) continue;
        if (rect.width >= parentRect.width * VIEWPORT_SQUEEZE_MAX_PARENT_FRACTION) continue;
        if (viewportLayoutHasAuthoredNarrowSize(element, parentRect.width)) continue;
        if (maintenanceMobileLayoutTextLength(element) < VIEWPORT_SQUEEZE_MIN_TEXT) continue;
        if (rect.height / Math.max(1, rect.width) < VIEWPORT_SQUEEZE_MIN_RATIO) continue;
        const writingMode = String(maintenanceSafeComputedStyle(element)?.writingMode || '').toLowerCase();
        if (writingMode && !writingMode.startsWith('horizontal')) continue;
        // 只修最外层被压窄的那一个，避免父子同时改写。
        if (found.some(item => item.element.contains?.(element))) continue;
        const group = viewportLayoutSharedStatePanels(element, parent);
        for (const candidate of group) {
            if (!candidate || seen.has(candidate) || viewportLayoutHasAuthoredGridPlacement(candidate)) continue;
            seen.add(candidate);
            found.push({ element: candidate, reason: 'grid-span' });
        }
    }
    return found;
}


function findViewportOverflowCandidates(root) {
    if (!root?.querySelectorAll) return [];
    const found = [];
    for (const element of root.querySelectorAll('*')) {
        if (maintenanceMobileLayoutIsInternal(element) || !maintenanceIsVisibleContentElement(element)) continue;
        const textLength = maintenanceMobileLayoutTextLength(element);
        if (textLength < 40) continue;
        const style = maintenanceSafeComputedStyle(element);
        if (!style) continue;
        const position = String(style.position || '').toLowerCase();
        if (position === 'absolute' || position === 'fixed') continue;
        const clientWidth = Number(element.clientWidth || 0);
        const clientHeight = Number(element.clientHeight || 0);
        if (clientWidth <= 2 || clientHeight <= 2) continue;
        const overflow = String(style.overflow || '').toLowerCase();
        const overflowX = String(style.overflowX || overflow).toLowerCase();
        const overflowY = String(style.overflowY || overflow).toLowerCase();
        const clippedX = /(?:hidden|clip)/.test(overflowX) && Number(element.scrollWidth || 0) > clientWidth + 4;
        const clippedY = /(?:hidden|clip)/.test(overflowY) && Number(element.scrollHeight || 0) > clientHeight + 6;
        if (clippedX && !clippedY && maintenanceHasIntentionalMarquee(element)) continue;
        // 容器级裁切只在“正文/状态面板”或叶级文字上放开，避免把整个视觉画框变成滚动盒。
        const directText = maintenanceDirectTextLength(element) > 0;
        const semanticLeaf = !element.querySelector?.('div,section,article,main,aside,header,footer,ul,ol,table,figure,details,form');
        const contentHint = viewportLayoutContentHint(element);
        if (!contentHint && !directText && !semanticLeaf) continue;
        const hasInteractive = !!element.querySelector?.('a[href],button,label,input,select,textarea,[role="button"],[tabindex]');
        const explicitlyActive = element.getAttribute?.(EXCLUSIVE_STACKED_STATE_PANEL_ATTR) === 'active'
            || element.getAttribute?.('aria-hidden') === 'false'
            || element.hasAttribute?.(MOBILE_LAYOUT_STATE_ACTIVE_ATTR);
        const pointerBlocked = explicitlyActive && hasInteractive && String(style.pointerEvents || '').toLowerCase() === 'none';
        if (!clippedX && !clippedY && !pointerBlocked) continue;
        found.push({ element, clippedX, clippedY, pointerBlocked, reason: pointerBlocked && !clippedX && !clippedY ? 'pointer' : 'overflow' });
        if (found.length >= 24) break;
    }
    return found;
}


export function inspectMaintenanceViewportLayout(root) {
    const structuralGridSpan = findSelectorPanelGridSpanCandidates(root);
    const squeezed = findViewportSqueezedCandidates(root);
    const overflow = findViewportOverflowCandidates(root);
    return {
        candidateCount: structuralGridSpan.length + squeezed.length + overflow.length,
        structuralGridSpanCount: structuralGridSpan.length,
        squeezedCount: squeezed.length,
        overflowCount: overflow.length,
        overflowXCount: overflow.filter(item => item.clippedX).length,
        overflowYCount: overflow.filter(item => item.clippedY).length,
        pointerBlockedCount: overflow.filter(item => item.pointerBlocked).length,
        viewportWidth: Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0)),
    };
}


function maintenanceViewportLayoutCss(scopeToken) {
    const scope = `[${MOBILE_LAYOUT_SCOPE_ATTR}="${scopeToken}"]`;
    return `
${scope} [${VIEWPORT_LAYOUT_SPAN_ATTR}] { grid-column: 1 / -1 !important; min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important; overflow-wrap: break-word !important; }
${scope} [${VIEWPORT_LAYOUT_SCROLL_ATTR}] { max-width: 100% !important; overflow-x: auto !important; overscroll-behavior-inline: contain !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-x pan-y !important; }
${scope} [${VIEWPORT_LAYOUT_SCROLL_Y_ATTR}] { overflow-y: auto !important; overscroll-behavior-block: contain !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-x pan-y !important; }
${scope} [${VIEWPORT_LAYOUT_POINTER_ATTR}] { pointer-events: auto !important; }
`;
}

// ---------------------------------------------------------------------------
// 1.3.77: 移动端横向裁切急救。
//
// 目标只有一种形态：窄屏下确实存在横向内容溢出，而最近的祖先用 overflow-x:hidden/clip
// 把它裁掉了，于是用户既看不到完整内容、也无法横向滚动。
//
// 这条路线刻意不覆盖"外置几何把整面镜子量窄了"——那是 1.3.77 的几何复测负责的问题，
// 让排版急救去替几何擦屁股只会掩盖真正的故障点。
//
// 全部产物都是 transient：不写任何持久化 marker，也不做 rehydrate。每次挂载重新按
// scrollWidth/clientWidth 实测即可自然重建，不会出现"标记还在但能力没恢复"的状态。
// ---------------------------------------------------------------------------

function hclipElementPath(element) {
    if (!element?.tagName) return '(unknown)';
    const tag = String(element.tagName).toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = String(element.className || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(name => `.${name}`).join('');
    const siblings = [...(element.parentElement?.children || [])];
    const index = siblings.indexOf(element);
    return `${tag}${id}${classes}[${index >= 0 ? index : '?'}]`;
}


function hclipCompactText(element) {
    return String(element?.textContent || '').replace(/\s+/g, '').length;
}


function hclipViewportWidth() {
    return Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
}


function hclipSafeStyle(element) {
    try { return typeof getComputedStyle === 'function' ? getComputedStyle(element) : null; }
    catch { return null; }
}


function hclipSafeRect(element) {
    try { return element?.getBoundingClientRect?.() || null; }
    catch { return null; }
}

// 真实横向溢出证据。只用 scrollWidth/clientWidth，不靠 CSS 猜。

function hclipOverflowAmount(element) {
    const scrollWidth = Number(element?.scrollWidth || 0);
    const clientWidth = Number(element?.clientWidth || 0);
    if (!scrollWidth || !clientWidth) return 0;
    return scrollWidth - clientWidth;
}


function hclipOverflowXMode(style) {
    return String(style?.overflowX || '').trim().toLowerCase();
}

// 已经能横向滚动的容器不重复改造。

function hclipIsExistingScroller(style) {
    const mode = hclipOverflowXMode(style);
    return mode === 'auto' || mode === 'scroll' || mode === 'overlay';
}


function hclipIsClipping(style) {
    const mode = hclipOverflowXMode(style);
    return mode === 'hidden' || mode === 'clip';
}

// 保留原纵向裁切。overflow-x 一旦不是 visible，visible 的 overflow-y 在规范上本就计算为 auto，
// 因此这里把 visible 归一到 auto，其余原样保留，绝不把纵向一起放开或收紧。

function hclipPreservedOverflowY(style) {
    const mode = String(style?.overflowY || '').trim().toLowerCase();
    if (mode === 'hidden' || mode === 'clip' || mode === 'scroll') return mode;
    return 'auto';
}

// 高置信装饰判定。必须是组合证据，任何单一信号都不足以判定。
// pointer-events:none 与低文本量只作为辅助证据；媒体元素不因无文本被判成装饰。

function hclipDecorativeVerdict(element, style, rect) {
    if (!element || !style) return 'uncertain';
    const tag = String(element.tagName || '').toUpperCase();
    // 媒体本身就是内容，缺文本说明不了任何事。
    if (HCLIP_MEDIA_TAGS.has(tag) || element.querySelector?.('img,video,iframe,canvas,svg,picture,object,embed')) return 'content';
    const position = String(style.position || '').trim().toLowerCase();
    const detached = position === 'absolute' || position === 'fixed';
    if (!detached) return 'content';
    if (hclipCompactText(element) >= HCLIP_MEANINGFUL_TEXT) return 'content';
    if (element.querySelector?.(HCLIP_INTERACTIVE_SELECTOR)) return 'content';
    // 正文／状态语义：一旦命中就按内容处理，宁可不修也不要修错。
    const semantic = `${element.id || ''} ${element.className || ''} ${element.getAttribute?.('aria-label') || ''} ${element.getAttribute?.('role') || ''}`.toLowerCase();
    if (/(panel|content|body|text|detail|result|status|state|log|entry|card|dialog|message|note|正文|内容|面板|状态|记录|说明)/.test(semantic)) return 'content';
    // 到这里已经满足：脱离文档流 + 无有意义文本 + 无交互后代 + 无正文语义。
    // 还需要至少一项辅助证据才升级为高置信装饰。
    const pointerNone = String(style.pointerEvents || '').trim().toLowerCase() === 'none';
    const width = Math.max(0, Number(rect?.width || 0));
    const height = Math.max(0, Number(rect?.height || 0));
    const tinyOrnament = width > 0 && height > 0 && width <= HCLIP_DECORATIVE_MAX_PX && height <= HCLIP_DECORATIVE_MAX_PX;
    if (pointerNone || tinyOrnament) return 'decorative';
    return 'uncertain';
}

// 找出真正越过裁切容器右边界的直接贡献者。只在确认溢出之后才做，且只看直接子元素。

function hclipBoundaryContributors(container) {
    const containerRect = hclipSafeRect(container);
    if (!containerRect) return [];
    const limit = containerRect.left + Number(container.clientWidth || containerRect.width || 0);
    const found = [];
    for (const child of [...(container.children || [])]) {
        if (maintenanceMobileLayoutIsInternal(child)) continue;
        const rect = hclipSafeRect(child);
        if (!rect) continue;
        const overshoot = rect.right - limit;
        if (overshoot < HCLIP_MIN_OVERFLOW_PX && Number(child.scrollWidth || 0) - Number(child.clientWidth || 0) < HCLIP_MIN_OVERFLOW_PX) continue;
        found.push({ element: child, style: hclipSafeStyle(child), rect, overshoot });
    }
    return found;
}


function hclipSemanticUnitSignature(element) {
    const tag = String(element?.tagName || '').toLowerCase();
    const classes = String(element?.getAttribute?.('class') || '')
        .split(/\s+/)
        .map(value => value.trim().toLowerCase())
        .filter(value => value && !/^(?:active|selected|current|on|off|left|right|first|last)$/.test(value))
        .slice(0, 2)
        .sort()
        .join('.');
    return `${tag}|${classes}`;
}


function hclipSemanticEnsembleUnits(host) {
    if (!host?.querySelectorAll) return [];
    const hostTraversal = collectBoundedElementDescendants(host, HCLIP_ENSEMBLE_MAX_HOST_DESCENDANTS);
    if (hostTraversal.exceeded) return [];
    const tag = String(host.tagName || '').toUpperCase();
    if (tag === 'SVG') {
        return hostTraversal.elements.filter(element => String(element.tagName || '').toUpperCase() === 'TEXT').filter(element => {
            const length = hclipCompactText(element);
            return length >= 1 && length <= 40;
        }).slice(0, 9);
    }

    if (Number(host.children?.length || 0) > HCLIP_ENSEMBLE_MAX_DIRECT_CHILDREN) return [];

    const hostStyle = hclipSafeStyle(host);
    const rowLike = /(?:flex|grid)/.test(String(hostStyle?.display || '').toLowerCase())
        || ['relative', 'absolute'].includes(String(hostStyle?.position || '').toLowerCase());
    const candidates = [...(host.children || [])].filter(element => {
        if (maintenanceMobileLayoutIsInternal(element)) return false;
        if (element.matches?.('style,script,template,input,button,select,textarea,summary,details')) return false;
        if (element.querySelector?.('input,button,select,textarea,details,summary,[role="button"],[role="tab"]')) return false;
        const length = hclipCompactText(element);
        if (length < 1 || length > 42) return false;
        const rect = hclipSafeRect(element);
        return !!rect && Number(rect.width || 0) >= 8 && Number(rect.height || 0) >= 8;
    });
    if (candidates.length < 3) return [];

    const groups = new Map();
    for (const element of candidates) {
        const key = hclipSemanticUnitSignature(element);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(element);
    }
    const repeated = [...groups.values()].sort((a, b) => b.length - a.length)[0] || [];
    if (repeated.length >= 3 && repeated.length <= 8) return repeated;
    return rowLike && candidates.length <= 8 ? candidates : [];
}


function hclipSemanticClippingContainer(host, root, naturalWidth) {
    let current = host;
    for (let depth = 0; current && depth < 7; depth += 1, current = current.parentElement) {
        const style = hclipSafeStyle(current);
        const width = Number(current.clientWidth || hclipSafeRect(current)?.width || 0);
        const independentSpatialScroller = current.hasAttribute?.(INDEPENDENT_MOBILE_SPATIAL_SCROLL_ATTR);
        if ((hclipIsClipping(style) || independentSpatialScroller) && width > 0 && naturalWidth > width + HCLIP_MIN_OVERFLOW_PX) return current;
        if (current === root) break;
    }
    return null;
}


function inspectSemanticEnsembleFits(root) {
    const stats = { narrow: false, candidates: 0, plans: [] };
    if (!root?.querySelectorAll || !root?.isConnected) return stats;
    const viewportWidth = hclipViewportWidth();
    if (!viewportWidth || viewportWidth > HCLIP_BREAKPOINT_PX) return stats;
    stats.narrow = true;
    const rootRect = hclipSafeRect(root);
    if (!rootRect || rootRect.width <= 0 || rootRect.height <= 0) return stats;

    const rootTraversal = collectBoundedElementDescendants(root, HCLIP_ENSEMBLE_MAX_ROOT_DESCENDANTS);
    if (rootTraversal.exceeded) return stats;
    const hosts = rootTraversal.elements
        .filter(element => element.matches?.('div,section,article,main,figure,ul,ol,svg'))
        .slice(0, HCLIP_MAX_CONTAINERS);
    for (const host of hosts) {
        if (maintenanceMobileLayoutIsInternal(host) || host.hasAttribute?.(HCLIP_ENSEMBLE_FIT_ATTR)) continue;
        if (host.querySelector?.('button,input,select,textarea,details,summary,[role="button"],[role="tab"]')) continue;
        const units = hclipSemanticEnsembleUnits(host);
        if (units.length < 3 || units.length > 8) continue;
        const hostRect = hclipSafeRect(host);
        if (!hostRect || hostRect.width <= 0 || hostRect.height <= 0) continue;
        let farRight = Number(hostRect.right || 0);
        if (Number(host.children?.length || 0) > HCLIP_ENSEMBLE_MAX_DIRECT_CHILDREN) continue;
        for (const child of [...(host.children || [])]) {
            const rect = hclipSafeRect(child);
            if (rect) farRight = Math.max(farRight, Number(rect.right || 0));
        }
        const naturalWidth = Math.max(
            Number(host.scrollWidth || 0),
            Number(hostRect.width || 0),
            farRight - Number(hostRect.left || 0),
            String(host.tagName || '').toUpperCase() === 'SVG' ? Number(host.viewBox?.baseVal?.width || host.width?.baseVal?.value || 0) : 0,
        );
        const clip = hclipSemanticClippingContainer(host, root, naturalWidth);
        if (!clip) continue;
        const availableWidth = Math.min(
            Number(root.clientWidth || rootRect.width || 0),
            Number(clip.clientWidth || hclipSafeRect(clip)?.width || 0),
        );
        const totalTextLength = units.reduce((sum, element) => sum + hclipCompactText(element), 0);
        const plan = semanticEnsembleScalePlan({
            naturalWidth,
            availableWidth,
            unitCount: units.length,
            totalTextLength,
            hasComplexControls: false,
        });
        if (!plan.candidate) continue;
        stats.candidates += 1;
        stats.plans.push({ host, clip, ...plan });
    }

    // Prefer the outermost preserving canvas when nested wrappers describe the same group.
    stats.plans = stats.plans.filter((plan, index, all) => !all.some((other, otherIndex) => (
        otherIndex !== index
        && other.host.contains?.(plan.host)
        && other.unitCount >= plan.unitCount
        && other.naturalWidth >= plan.naturalWidth
    )));
    return stats;
}


function hclipCollectClippingContainers(root) {
    // 语义预筛：只看可能承载正文／交互／grid-flex 内容的容器，且跳过插件自身 UI。
    // 这一步不做任何布局读。
    const candidates = [];
    for (const element of root.querySelectorAll('div,section,article,main,figure,ul,ol,table')) {
        if (candidates.length >= HCLIP_MAX_CONTAINERS) break;
        if (maintenanceMobileLayoutIsInternal(element)) continue;
        if (!element.children?.length) continue;
        candidates.push(element);
    }
    return candidates;
}


function inspectHorizontalClip(root) {
    const stats = {
        viewportWidth: hclipViewportWidth(),
        narrow: false,
        candidates: 0,
        repaired: 0,
        skippedDecorative: 0,
        skippedExistingScroller: 0,
        skippedUncertain: 0,
        plans: [],
    };
    if (!root?.querySelectorAll || !root?.isConnected) return stats;
    // 1) 仅手机窄视口
    if (!stats.viewportWidth || stats.viewportWidth > HCLIP_BREAKPOINT_PX) return stats;
    stats.narrow = true;
    // 2) root 可见
    const rootRect = hclipSafeRect(root);
    if (!rootRect || rootRect.width <= 0 || rootRect.height <= 0) return stats;

    // 3) 语义候选 → 4) 几何溢出（只有溢出的少数才进入 getComputedStyle）
    for (const container of hclipCollectClippingContainers(root)) {
        if (container.hasAttribute?.(HCLIP_ENSEMBLE_CLIP_ATTR)) continue;
        const overflow = hclipOverflowAmount(container);
        if (overflow < HCLIP_MIN_OVERFLOW_PX) continue;
        const style = hclipSafeStyle(container);
        if (!style) continue;
        // 6) 中间已有有效横向滚动容器：不重复改造
        if (hclipIsExistingScroller(style)) { stats.skippedExistingScroller += 1; continue; }
        // 4) 该祖先 computed overflow-x 必须是 hidden/clip；只有纵向溢出不处理
        if (!hclipIsClipping(style)) continue;
        stats.candidates += 1;

        // 5) 判定越界贡献者是正文还是纯装饰
        const contributors = hclipBoundaryContributors(container);
        const content = [];
        let decorative = 0;
        let uncertain = 0;
        for (const item of contributors) {
            const verdict = hclipDecorativeVerdict(item.element, item.style, item.rect);
            if (verdict === 'content') content.push(item);
            else if (verdict === 'decorative') decorative += 1;
            else uncertain += 1;
        }
        if (!content.length) {
            // 找不到任何明确的有意义正文贡献者：保守跳过，不动 overflow。
            if (uncertain) stats.skippedUncertain += 1;
            else if (decorative) stats.skippedDecorative += 1;
            else stats.skippedUncertain += 1;
            continue;
        }
        stats.plans.push({
            container,
            style,
            overflow,
            scrollWidth: Number(container.scrollWidth || 0),
            clientWidth: Number(container.clientWidth || 0),
            content,
            decorative,
            uncertain,
        });
    }
    return stats;
}


function maintenanceHorizontalClipCss(scopeToken) {
    const scope = `[${HCLIP_SCOPE_ATTR}="${scopeToken}"]`;
    return `
${scope} [${HCLIP_SCROLLER_ATTR}] { overflow-x: auto !important; overscroll-behavior-inline: contain; -webkit-overflow-scrolling: touch; }
${scope} [${HCLIP_SCROLLER_ATTR}][${HCLIP_KEEP_Y_ATTR}="hidden"] { overflow-y: hidden !important; }
${scope} [${HCLIP_SCROLLER_ATTR}][${HCLIP_KEEP_Y_ATTR}="clip"] { overflow-y: clip !important; }
${scope} [${HCLIP_SCROLLER_ATTR}][${HCLIP_KEEP_Y_ATTR}="scroll"] { overflow-y: scroll !important; }
${scope} [${HCLIP_SCROLLER_ATTR}][${HCLIP_KEEP_Y_ATTR}="auto"] { overflow-y: auto !important; }
${scope} [${HCLIP_ENSEMBLE_FIT_ATTR}] { zoom:var(--rm-hclip-ensemble-scale) !important; transform-origin:top left !important; }
@supports not (zoom:1) {
${scope} [${HCLIP_ENSEMBLE_FIT_ATTR}] { transform:scale(var(--rm-hclip-ensemble-scale)) !important; transform-origin:top left !important; width:calc(100% / var(--rm-hclip-ensemble-scale)) !important; max-width:none !important; }
}
`;
}


export function clearRabbitMirrorHorizontalClipArtifacts(root) {
    if (!root?.querySelectorAll) return 0;
    let cleared = 0;
    for (const element of root.querySelectorAll(`[${HCLIP_ENSEMBLE_FIT_ATTR}]`)) {
        element.style?.removeProperty?.('--rm-hclip-ensemble-scale');
    }
    for (const attr of HCLIP_TRANSIENT_ATTRS) {
        for (const element of [root, ...root.querySelectorAll(`[${attr}]`)]) {
            if (element?.hasAttribute?.(attr)) { element.removeAttribute(attr); cleared += 1; }
        }
    }
    for (const style of root.querySelectorAll(`style[${HCLIP_STYLE_ATTR}]`)) { style.remove(); cleared += 1; }
    return cleared;
}


export function installMaintenanceHorizontalClipRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    // 幂等：先整体撤回上一轮的 transient 产物，再重新实测。跑两次不会继续叠加。
    clearRabbitMirrorHorizontalClipArtifacts(root);

    const ensemble = inspectSemanticEnsembleFits(root);
    for (const plan of ensemble.plans) {
        plan.host.setAttribute(HCLIP_ENSEMBLE_FIT_ATTR, 'true');
        plan.host.style?.setProperty?.('--rm-hclip-ensemble-scale', Number(plan.scale || 1).toFixed(4));
        plan.clip.setAttribute(HCLIP_ENSEMBLE_CLIP_ATTR, 'true');
    }

    const stats = inspectHorizontalClip(root);
    const report = {
        viewportWidth: stats.viewportWidth,
        narrow: stats.narrow || ensemble.narrow,
        candidates: stats.candidates,
        repaired: 0,
        scrollRepaired: 0,
        semanticEnsembleCandidates: ensemble.candidates,
        semanticEnsembleFitted: ensemble.plans.length,
        skippedDecorative: stats.skippedDecorative,
        skippedExistingScroller: stats.skippedExistingScroller,
        skippedUncertain: stats.skippedUncertain,
        targets: [],
    };
    if (!stats.plans.length && !ensemble.plans.length) {
        if (stats.narrow && (stats.candidates || stats.skippedDecorative || stats.skippedExistingScroller || stats.skippedUncertain)) {
            root.setAttribute(HCLIP_REPORT_ATTR, JSON.stringify(report));
        }
        return 0;
    }

    const scopeToken = maintenanceMobileLayoutCreateScopeToken();
    root.setAttribute(HCLIP_SCOPE_ATTR, scopeToken);
    let style = document.createElement('style');
    style.setAttribute(HCLIP_STYLE_ATTR, 'true');
    style.textContent = maintenanceHorizontalClipCss(scopeToken);
    root.appendChild(style);

    for (const plan of ensemble.plans) {
        report.repaired += 1;
        report.targets.push({
            stage: 'semantic-ensemble-fit',
            target: hclipElementPath(plan.host),
            before: {
                naturalWidth: plan.naturalWidth,
                availableWidth: plan.availableWidth,
                unitCount: plan.unitCount,
            },
            after: {
                scale: Number(plan.scale.toFixed(4)),
                visibleAsGroup: true,
            },
        });
    }

    for (const plan of stats.plans) {
        const before = {
            overflowX: hclipOverflowXMode(plan.style),
            overflowY: String(plan.style.overflowY || '').trim().toLowerCase(),
            scrollWidth: plan.scrollWidth,
            clientWidth: plan.clientWidth,
        };
        // 1.3.77 hotfix: 不再改写正文／视觉组件自身的 width、max-width 或 min-width。
        // 1.3.76 的 content-shrink 第一步会把模型有意设置的固定宽度视觉舞台压成父容器宽度，
        // 在纯外置手机布局里形成“标题正常、正文突然变窄”的回归。
        // 既然已经有真实横向溢出 + 有意义内容贡献者 + 最近裁切祖先这三重证据，
        // 最保守的修复就是只让该裁切祖先横向可滚动，完整保留作者原本的内容几何。
        const keepY = hclipPreservedOverflowY(plan.style);
        plan.container.setAttribute(HCLIP_SCROLLER_ATTR, 'true');
        plan.container.setAttribute(HCLIP_KEEP_Y_ATTR, keepY);
        report.repaired += 1;
        report.scrollRepaired += 1;
        report.targets.push({
            stage: 'ancestor-scroll-x',
            target: hclipElementPath(plan.container),
            before,
            after: {
                overflowX: 'auto',
                overflowY: keepY,
                scrollWidth: Number(plan.container.scrollWidth || 0),
                clientWidth: Number(plan.container.clientWidth || 0),
            },
        });
    }
    root.setAttribute(HCLIP_REPORT_ATTR, JSON.stringify(report));
    return report.repaired;
}



export function installMaintenanceHorizontalClipOpenRescue(root) {
    // Ordinary expand is not a repair intent. Horizontal layout measurement is
    // available through explicit “排版/显示” Maintenance Rabbit repair only.
    return !!root?.isConnected;
}


export function installMaintenanceViewportLayoutRescue(root) {
    if (!root?.querySelectorAll || !root?.isConnected) return 0;
    const structuralGridSpanCount = repairRabbitMirrorSelectorPanelGridSpan(root);
    let scopeToken = root.getAttribute(MOBILE_LAYOUT_SCOPE_ATTR);
    if (!scopeToken) {
        scopeToken = maintenanceMobileLayoutCreateScopeToken();
        root.setAttribute(MOBILE_LAYOUT_SCOPE_ATTR, scopeToken);
    }
    // 先撤回上一轮标记再重新测量：视口变了、状态面板换了，候选也会变。
    for (const attr of VIEWPORT_LAYOUT_TARGET_ATTRS) {
        root.querySelectorAll(`[${attr}]`).forEach(element => element.removeAttribute(attr));
    }

    const squeezed = findViewportSqueezedCandidates(root);
    const overflow = findViewportOverflowCandidates(root);
    if (!squeezed.length && !overflow.length) {
        root.querySelector(`style[${VIEWPORT_LAYOUT_RESCUE_STYLE_ATTR}]`)?.remove();
        if (structuralGridSpanCount) root.setAttribute(VIEWPORT_LAYOUT_COUNT_ATTR, String(structuralGridSpanCount));
        else root.removeAttribute(VIEWPORT_LAYOUT_COUNT_ATTR);
        return structuralGridSpanCount;
    }

    const marked = new Set();
    for (const { element } of squeezed) {
        maintenanceMobileLayoutMark(element, VIEWPORT_LAYOUT_SPAN_ATTR, marked);
    }
    for (const { element, clippedX, clippedY, pointerBlocked } of overflow) {
        if (clippedX) maintenanceMobileLayoutMark(element, VIEWPORT_LAYOUT_SCROLL_ATTR, marked);
        if (clippedY) maintenanceMobileLayoutMark(element, VIEWPORT_LAYOUT_SCROLL_Y_ATTR, marked);
        if (pointerBlocked) maintenanceMobileLayoutMark(element, VIEWPORT_LAYOUT_POINTER_ATTR, marked);
    }

    let style = root.querySelector(`style[${VIEWPORT_LAYOUT_RESCUE_STYLE_ATTR}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(VIEWPORT_LAYOUT_RESCUE_STYLE_ATTR, 'true');
        root.appendChild(style);
    }
    style.textContent = maintenanceViewportLayoutCss(scopeToken);
    const total = marked.size + structuralGridSpanCount;
    root.setAttribute(VIEWPORT_LAYOUT_COUNT_ATTR, String(total));
    return total;
}

// 当前视口是否会让窄屏样式表生效。

function maintenanceMobileRescueAppliesNow() {
    const width = Math.max(0, Number(globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0));
    return width > 0 && width <= MOBILE_LAYOUT_BREAKPOINT_PX;
}

// 1.3.62: 窄屏预置不再在宽屏上“先写一套以后也许用得上”。只有用户此刻真的在窄屏，
// 且只读巡逻确实发现 mobile layout 风险时才执行，避免好好的桌面镜面被自动维修污染。

export function shouldRunMaintenanceMobileLayoutRescue(root) {
    if (!maintenanceMobileRescueAppliesNow()) return false;
    try { return Number(inspectMaintenanceMobileLayout(root)?.candidateCount || 0) > 0; }
    catch { return false; }
}


