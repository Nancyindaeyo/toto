// Split from ui.js — worldbook list rendering and visibility.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { WORLD_INFO_BOOKS_CHANGED_EVENT, fetchWorldInfoBooks, getObservedWorldInfoBooks } from '../independentApi.js?rmv=1.5.70';
import { escapeHtml, isCurrentRuntime } from './runtime.js?rmv=1.5.70';

let pulledWorldInfoBooks = [];
let worldInfoBookRenderTimer = 0;
let worldInfoBookVisibilityObserver = null;
let worldInfoBookCurrentVisible = false;
let worldInfoBookCurrentDirty = true;
const WORLD_INFO_BOOK_RENDER_DEBOUNCE_MS = 140;

function worldInfoSourceLabel(value) {
    return ({ characterLore: '角色', chatLore: '当前聊天', personaLore: 'Persona', globalLore: '当前全局' })[String(value || '')] || String(value || '');
}
function renderWorldInfoRows(target, books, disabled, emptyText) {
    if (!target.length) return;
    const rows = books.map((item, index) => {
        const enabled = !disabled.has(item.id);
        const identity = item.label !== item.id ? `<br><span style="opacity:.55;font-size:10px;">${escapeHtml(item.id)}</span>` : '';
        const sourceText = Array.isArray(item.sources) && item.sources.length
            ? item.sources.map(worldInfoSourceLabel).filter(Boolean).join(' / ')
            : item.note || '';
        return `<label class="checkbox_label" style="display:flex;align-items:flex-start;gap:7px;margin:4px 0;">
          <input class="rh-world-info-book-toggle" type="checkbox" data-book-index="${index}" data-book-id="${escapeHtml(item.id)}" ${enabled ? 'checked' : ''}>
          <span style="min-width:0;flex:1;overflow-wrap:anywhere;"><b>${escapeHtml(item.label)}</b>${identity}${sourceText ? `<br><span style="opacity:.6;font-size:10px;">${escapeHtml(sourceText)}</span>` : ''}</span>
        </label>`;
    }).join('');
    target.data('rm-world-info-books', books.map(item => item.id));
    target.html(books.length ? rows : `<div style="font-size:11px;line-height:1.4;opacity:.66;">${escapeHtml(emptyText)}</div>`);
}
function clearWorldInfoBookRenderTimer() {
    if (!worldInfoBookRenderTimer) return;
    clearTimeout(worldInfoBookRenderTimer);
    worldInfoBookRenderTimer = 0;
}
function renderWorldInfoBookSettings({ current = true, all = false } = {}) {
    const currentTarget = $('#rh_world_info_book_filters');
    const allTarget = $('#rh_world_info_all_book_filters');
    if (!currentTarget.length && !allTarget.length) return;
    const settings = getSettings();
    const disabled = new Set(Array.isArray(settings.independentWorldInfoDisabledBooks) ? settings.independentWorldInfoDisabledBooks : []);

    if (current && currentTarget.length) {
        const currentBooks = getObservedWorldInfoBooks().map(item => ({
            id: String(item?.name || '').trim(),
            label: String(item?.name || '').trim(),
            sources: item?.sources || [],
        })).filter(item => item.id);
        renderWorldInfoRows(
            currentTarget,
            currentBooks,
            disabled,
            '当前聊天还没有观察到酒馆加载的世界书。进入角色聊天并正常生成后会自动显示当前聊天相关世界书；不会为了列表重新扫描条目。',
        );
        worldInfoBookCurrentDirty = false;
    }

    const allDetails = document.getElementById('rh_world_info_all_books');
    if (!all || !allTarget.length || !allDetails?.open) return;
    const byId = new Map();
    for (const item of pulledWorldInfoBooks) {
        const id = String(item?.id || item?.name || '').trim(); if (!id) continue;
        byId.set(id, { id, label: String(item?.label || id).trim() || id, sources: [], note: '全部世界书' });
    }
    for (const id of disabled) {
        if (!byId.has(id)) byId.set(id, { id, label: id, sources: [], note: '已保存为关闭' });
    }
    const allBooks = [...byId.values()].sort((a, b) => String(a.label || a.id).localeCompare(String(b.label || b.id), 'zh-Hans-CN'));
    renderWorldInfoRows(allTarget, allBooks, disabled, '尚未拉取全部世界书。');
}
function scheduleWorldInfoBookSettingsRender(delay = WORLD_INFO_BOOK_RENDER_DEBOUNCE_MS) {
    worldInfoBookCurrentDirty = true;
    clearWorldInfoBookRenderTimer();
    // When the extension drawer is closed, do not build even the current-chat checkbox DOM.
    // IntersectionObserver will render it when the user actually exposes this settings area.
    if (worldInfoBookVisibilityObserver && !worldInfoBookCurrentVisible) return;
    worldInfoBookRenderTimer = setTimeout(() => {
        worldInfoBookRenderTimer = 0;
        if (!isCurrentRuntime() || !worldInfoBookCurrentDirty) return;
        renderWorldInfoBookSettings({ current: true, all: false });
    }, Math.max(0, Number(delay) || 0));
}
function disconnectWorldInfoBookVisibilityObserver() {
    try { worldInfoBookVisibilityObserver?.disconnect?.(); } catch {}
    worldInfoBookVisibilityObserver = null;
    worldInfoBookCurrentVisible = false;
}
function installWorldInfoBookVisibilityObserver() {
    disconnectWorldInfoBookVisibilityObserver();
    const target = document.getElementById('rh_world_info_book_filters');
    if (!target) return;
    if (typeof IntersectionObserver !== 'function') {
        worldInfoBookCurrentVisible = true;
        scheduleWorldInfoBookSettingsRender(0);
        return;
    }
    worldInfoBookVisibilityObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.target !== target) continue;
            worldInfoBookCurrentVisible = entry.isIntersecting === true;
            if (worldInfoBookCurrentVisible && worldInfoBookCurrentDirty) scheduleWorldInfoBookSettingsRender(0);
        }
    }, { root: null, threshold: 0 });
    worldInfoBookVisibilityObserver.observe(target);
}
function clearCollapsedAllWorldInfoBookRows() {
    const target = $('#rh_world_info_all_book_filters');
    if (!target.length) return;
    target.removeData('rm-world-info-books');
    target.html('<div style="font-size:11px;line-height:1.4;opacity:.66;">折叠时不创建完整世界书列表；展开后按需渲染。</div>');
}

export async function pullAllWorldInfoBooks() {
    pulledWorldInfoBooks = await fetchWorldInfoBooks();
    renderWorldInfoBookSettings({ current: false, all: true });
    return pulledWorldInfoBooks.length;
}

export function clearPulledWorldInfoBooks() {
    pulledWorldInfoBooks = [];
    renderWorldInfoBookSettings({ current: false, all: true });
}

export function attachWorldInfoBooksListener() {
    try { globalThis.__rabbitMirrorWorldInfoBooksUiCleanup?.(); } catch {}
    const worldInfoBooksListener = () => scheduleWorldInfoBookSettingsRender();
    globalThis.addEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
    globalThis.__rabbitMirrorWorldInfoBooksUiCleanup = () => globalThis.removeEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
}

export function resetWorldInfoBookUiState() {
    clearWorldInfoBookRenderTimer();
    disconnectWorldInfoBookVisibilityObserver();
    worldInfoBookCurrentDirty = true;
}

export {
    renderWorldInfoBookSettings,
    scheduleWorldInfoBookSettingsRender,
    installWorldInfoBookVisibilityObserver,
    clearCollapsedAllWorldInfoBookRows,
};
