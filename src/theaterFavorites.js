const DB_NAME = 'rabbit_mirror_theater_favorites_v1';
const STORE = 'favorites';
const DB_VERSION = 1;
export const THEATER_FAVORITES_CHANGED_EVENT = 'rabbitmirror:theater-favorites-changed';
export const THEATER_FAVORITE_MAX_ITEMS = 80;
export const THEATER_FAVORITE_MAX_HTML_BYTES = 400 * 1024;
export const UNCATEGORIZED_CHARACTER_NAME = '未分类';

function byteLength(value = '') {
    const text = String(value || '');
    try { return new TextEncoder().encode(text).length; }
    catch { return unescape(encodeURIComponent(text)).length; }
}

function notifyChanged() {
    try { document.dispatchEvent(new CustomEvent(THEATER_FAVORITES_CHANGED_EVENT)); } catch {}
}

function firstNonEmpty(values) {
    for (const value of values) {
        const text = String(value ?? '').trim();
        if (text) return text;
    }
    return '';
}

export function currentTheaterFavoriteCharacter() {
    try {
        const ctx = globalThis.SillyTavern?.getContext?.() || {};
        const characters = Array.isArray(ctx.characters) ? ctx.characters
            : (Array.isArray(globalThis.characters) ? globalThis.characters : []);
        const groupId = firstNonEmpty([ctx.groupId, ctx.group_id, globalThis.selected_group]);
        if (groupId) {
            const groups = Array.isArray(ctx.groups) ? ctx.groups
                : (Array.isArray(globalThis.groups) ? globalThis.groups : []);
            const group = groups.find(item => String(item?.id) === groupId);
            const name = firstNonEmpty([group?.name, ctx.groupName, '群聊']).replace(/\s+/g, ' ').slice(0, 80);
            return { characterId: `group:${groupId}`.slice(0, 180), characterName: name || '群聊' };
        }
        const chid = ctx.characterId ?? ctx.character_id ?? globalThis.this_chid;
        const character = ctx.character || (characters[chid] && typeof characters[chid] === 'object' ? characters[chid] : null);
        const avatar = firstNonEmpty([character?.avatar]);
        const name = firstNonEmpty([ctx.name2, character?.name, ctx.characterName]).replace(/\s+/g, ' ').slice(0, 80);
        const characterId = firstNonEmpty([avatar, name ? `name:${name}` : '', chid != null && chid !== '' ? `chid:${chid}` : '']).slice(0, 180);
        return {
            characterId,
            characterName: name || (characterId ? '未命名角色' : UNCATEGORIZED_CHARACTER_NAME),
        };
    } catch {
        return { characterId: '', characterName: UNCATEGORIZED_CHARACTER_NAME };
    }
}

export function groupTheaterFavoritesByCharacter(rows) {
    const groups = new Map();
    for (const row of rows || []) {
        const id = String(row?.characterId || '');
        const name = String(row?.characterName || '').trim() || (id ? '未命名角色' : UNCATEGORIZED_CHARACTER_NAME);
        if (!groups.has(id)) groups.set(id, { characterId: id, characterName: name, items: [] });
        const group = groups.get(id);
        if (name && (group.characterName === UNCATEGORIZED_CHARACTER_NAME || !group.characterName)) group.characterName = name;
        group.items.push(row);
    }
    return [...groups.values()].sort((a, b) => {
        if (!a.characterId && b.characterId) return 1;
        if (a.characterId && !b.characterId) return -1;
        return String(a.characterName).localeCompare(String(b.characterName), 'zh');
    });
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('当前环境没有 IndexedDB，无法使用兔子镜收藏夹。'));
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: 'id' });
                store.createIndex('createdAt', 'createdAt');
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('无法打开兔子镜收藏夹。'));
    });
}

function runStore(mode, work) {
    return openDatabase().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        let result;
        tx.oncomplete = () => {
            try { db.close(); } catch {}
            resolve(result);
        };
        tx.onerror = () => {
            try { db.close(); } catch {}
            reject(tx.error || new Error('收藏夹事务失败。'));
        };
        tx.onabort = () => {
            try { db.close(); } catch {}
            reject(tx.error || new Error('收藏夹事务已中止。'));
        };
        try { result = work(store, value => { result = value; }); }
        catch (error) { reject(error); }
    }));
}

function normalizeRecord(value) {
    if (!value || typeof value !== 'object') return null;
    const html = String(value.html || '').trim();
    if (!html || byteLength(html) > THEATER_FAVORITE_MAX_HTML_BYTES) return null;
    const id = String(value.id || '').trim();
    if (!id) return null;
    const characterId = String(value.characterId || '').slice(0, 180);
    const characterName = String(value.characterName || '').replace(/\s+/g, ' ').trim().slice(0, 80)
        || (characterId ? '未命名角色' : UNCATEGORIZED_CHARACTER_NAME);
    return {
        id,
        title: String(value.title || '未命名兔子镜').replace(/\s+/g, ' ').trim().slice(0, 120) || '未命名兔子镜',
        mode: value.mode === 'text' ? 'text' : 'html',
        html,
        chatKey: String(value.chatKey || '').slice(0, 180),
        mesid: Number.isInteger(value.mesid) && value.mesid >= 0 ? value.mesid : null,
        swipe: Number.isInteger(value.swipe) && value.swipe >= 0 ? value.swipe : null,
        sourceHash: String(value.sourceHash || '').slice(0, 80),
        characterId,
        characterName,
        createdAt: Number(value.createdAt) || Date.now(),
    };
}

export async function listTheaterFavorites() {
    const rows = await runStore('readonly', (store, done) => {
        const request = store.getAll();
        request.onsuccess = () => done(request.result || []);
    });
    return (Array.isArray(rows) ? rows : []).map(normalizeRecord).filter(Boolean)
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
}

export async function getTheaterFavorite(id) {
    const row = await runStore('readonly', (store, done) => {
        const request = store.get(String(id || ''));
        request.onsuccess = () => done(request.result || null);
    });
    return normalizeRecord(row);
}

function hashFavoriteHtml(text = '') {
    let h = 2166136261;
    for (const ch of String(text)) {
        h ^= ch.charCodeAt(0);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
}

const FAVORITE_RUNTIME_UI_SELECTOR = [
    '[data-rabbit-mirror-tool-entry-host]',
    '[data-rm-image-region]',
    '[data-rm-image-portal]',
    '[data-rabbit-mirror-maintenance-rabbit]',
    '[data-rabbit-mirror-feedback-cat]',
    '[data-rabbit-mirror-recipe]',
    '[data-rabbit-mirror-resay]',
    '[data-rm-tool-menu-button]',
    '[data-rm-ephemeral-failure-body]',
    '[data-rm-face-swipe-host]',
    '[data-rm-face-swipe-bar]',
    '[data-rm-face-swipe-delete]',
    '[data-rm-face-favorite-star]',
].join(', ');

export function sanitizeTheaterFavoriteTitle(title) {
    return String(title || '')
        .replace(/[‹<]\s*\d+\s*\/\s*\d+\s*[›>]/g, '')
        .replace(/[×✕]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120);
}

export function theaterFavoriteTitleFromDetails(details) {
    const summary = details?.querySelector?.(':scope > summary') || details?.querySelector?.('summary');
    if (!summary) return '';
    const clone = typeof summary.cloneNode === 'function' ? summary.cloneNode(true) : null;
    if (clone?.querySelectorAll) {
        clone.querySelectorAll(FAVORITE_RUNTIME_UI_SELECTOR).forEach(node => node.remove());
        return sanitizeTheaterFavoriteTitle(clone.textContent);
    }
    return sanitizeTheaterFavoriteTitle(summary.textContent);
}

export function theaterFavoriteDisplayTitle(record) {
    const html = String(record?.html || '').trim();
    if (html && typeof document !== 'undefined') {
        const template = document.createElement('template');
        template.innerHTML = html;
        const fromHtml = theaterFavoriteTitleFromDetails(template.content.querySelector('details') || template.content);
        if (fromHtml) return fromHtml;
    }
    return sanitizeTheaterFavoriteTitle(record?.title) || '未命名兔子镜';
}

export function stripTheaterFavoriteRuntimeUi(scope) {
    if (!scope?.querySelectorAll) return;
    scope.querySelectorAll(FAVORITE_RUNTIME_UI_SELECTOR).forEach(node => node.remove());
}

async function copyTextToClipboard(text) {
    const value = String(text || '');
    if (!value) return false;
    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        try {
            const field = document.createElement('textarea');
            field.value = value;
            field.setAttribute('readonly', '');
            field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
            document.body.append(field);
            field.select();
            const ok = document.execCommand('copy');
            field.remove();
            return !!ok;
        } catch {
            return false;
        }
    }
}

export async function copyTheaterFavoriteHtml(record) {
    const html = scrubTheaterFavoriteHtml(record?.html);
    if (!html) throw new Error('这面收藏没有可复制的 HTML。');
    const copied = await copyTextToClipboard(html);
    if (!copied) throw new Error('复制失败，当前收藏没有改变。');
    return html;
}

export function scrubTheaterFavoriteHtml(html) {
    const source = String(html || '').trim();
    if (!source || typeof document === 'undefined') return source;
    const template = document.createElement('template');
    template.innerHTML = source;
    template.content.querySelectorAll?.(FAVORITE_RUNTIME_UI_SELECTOR)?.forEach(node => node.remove());
    const root = [...template.content.children].find(node => node.nodeType === 1);
    return String(root?.outerHTML || source).trim();
}

export function theaterFavoriteToggleId(html) {
    const scrubbed = scrubTheaterFavoriteHtml(html);
    return `toggle_${hashFavoriteHtml(scrubbed)}`.slice(0, 80);
}

export async function saveTheaterFavorite(input) {
    const html = scrubTheaterFavoriteHtml(input?.html);
    if (!html) throw new Error('没有可收藏的兔子镜内容。');
    if (byteLength(html) > THEATER_FAVORITE_MAX_HTML_BYTES) {
        throw new Error('这面兔子镜超过收藏夹单条体积上限，未写入。');
    }
    const character = currentTheaterFavoriteCharacter();
    const record = normalizeRecord({
        id: String(input?.id || '').trim() || `fav_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        title: input?.title,
        mode: input?.mode,
        html,
        chatKey: input?.chatKey,
        mesid: input?.mesid,
        swipe: input?.swipe,
        sourceHash: input?.sourceHash,
        characterId: input?.characterId || character.characterId,
        characterName: input?.characterName || character.characterName,
        createdAt: Date.now(),
    });
    if (!record) throw new Error('收藏内容无法保存。');
    await runStore('readwrite', (store, done) => {
        const request = store.getAll();
        request.onsuccess = () => {
            const rows = (Array.isArray(request.result) ? request.result : []).map(normalizeRecord).filter(Boolean)
                .sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
            while (rows.length >= THEATER_FAVORITE_MAX_ITEMS) {
                const oldest = rows.shift();
                if (oldest?.id) store.delete(oldest.id);
            }
            store.put(record);
            done(record);
        };
    });
    notifyChanged();
    return record;
}

export async function deleteTheaterFavorite(id) {
    const key = String(id || '');
    if (!key) return false;
    await runStore('readwrite', store => store.delete(key));
    notifyChanged();
    return true;
}

export async function toggleTheaterFavorite(input) {
    const captured = input && typeof input === 'object' ? input : null;
    const html = scrubTheaterFavoriteHtml(captured?.html);
    if (!html) throw new Error('当前没有可收藏的兔子镜。');
    const id = theaterFavoriteToggleId(html);
    const existing = await getTheaterFavorite(id);
    if (existing) {
        await deleteTheaterFavorite(id);
        return { favorited: false, id };
    }
    await saveTheaterFavorite({ ...captured, html, id });
    return { favorited: true, id };
}

export async function isTheaterFavoriteHtml(html) {
    const id = theaterFavoriteToggleId(html);
    return !!(await getTheaterFavorite(id));
}

function isTheaterFavoritePlaceholder(details) {
    return !!details?.classList?.contains('rabbit-mirror-external-placeholder')
        || !!details?.hasAttribute?.('data-rabbit-mirror-placeholder');
}

function firstCapturableFavoriteDetails(nodes) {
    for (const node of nodes || []) {
        if (node?.matches?.('details') && !isTheaterFavoritePlaceholder(node)) return node;
    }
    return null;
}

export function resolveTheaterFavoriteCaptureRoot(root) {
    const direct = root?.matches?.('details') ? root
        : (root?.closest?.('details') || root?.querySelector?.('details') || null);
    if (direct && !isTheaterFavoritePlaceholder(direct)) return direct;
    const host = root?.closest?.('[data-rabbit-mirror-external-source="true"], .rabbit-mirror-external-host')
        || direct?.closest?.('[data-rabbit-mirror-external-source="true"], .rabbit-mirror-external-host');
    const fromHost = firstCapturableFavoriteDetails(host?.children);
    if (fromHost) return fromHost;
    const message = root?.closest?.('.mes, [mesid]') || host?.closest?.('.mes, [mesid]') || direct?.closest?.('.mes, [mesid]');
    for (const shell of message?.querySelectorAll?.('[data-rabbit-mirror-external-source="true"], .rabbit-mirror-external-host') || []) {
        const found = firstCapturableFavoriteDetails(shell.children);
        if (found) return found;
    }
    return null;
}

export function captureTheaterFavoriteFromRoot(root, owner = {}) {
    const details = resolveTheaterFavoriteCaptureRoot(root);
    if (!details) return null;
    const html = scrubTheaterFavoriteHtml(details.outerHTML);
    if (!html) return null;
    const title = theaterFavoriteTitleFromDetails(details) || String(details.querySelector?.(':scope > summary')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    const character = currentTheaterFavoriteCharacter();
    return {
        id: theaterFavoriteToggleId(html),
        title: title || '未命名兔子镜',
        mode: String(details.getAttribute?.('data-rm-presentation-mode') || owner.mode || '') === 'text' ? 'text' : 'html',
        html,
        chatKey: String(owner.chatKey || details.dataset?.rabbitMirrorOwnerChat || ''),
        mesid: Number.isInteger(owner.mesid) ? owner.mesid : Number(details.dataset?.rabbitMirrorOwnerMesid),
        swipe: Number.isInteger(owner.swipe) ? owner.swipe : Number(details.dataset?.rabbitMirrorOwnerSwipe),
        sourceHash: String(owner.sourceHash || details.dataset?.rabbitMirrorOwnerSourceHash || ''),
        characterId: String(owner.characterId || character.characterId || ''),
        characterName: String(owner.characterName || character.characterName || UNCATEGORIZED_CHARACTER_NAME),
    };
}

let viewer = null;
let library = null;

function overlayParent() {
    const settings = document.getElementById('rabbit_mirror_theater_settings');
    if (settings?.tagName === 'DIALOG' && (settings.open || settings.hasAttribute('open'))) return settings;
    return document.body;
}

function dismissOverlay(overlay) {
    try { if (overlay?.open && typeof overlay.close === 'function') overlay.close(); } catch {}
    overlay?.remove?.();
}

export function closeTheaterFavoriteViewer() {
    if (!viewer) return;
    const { overlay, keydown } = viewer;
    document.removeEventListener('keydown', keydown, true);
    dismissOverlay(overlay);
    viewer = null;
}

export function closeTheaterFavoriteLibrary() {
    if (!library) return;
    const { overlay, keydown } = library;
    document.removeEventListener('keydown', keydown, true);
    dismissOverlay(overlay);
    library = null;
}

function overlayCard(label) {
    const overlay = document.createElement('dialog');
    overlay.setAttribute('aria-label', label);
    overlay.style.cssText = 'position:fixed;inset:0;width:auto;height:auto;max-width:none;max-height:none;margin:0;padding:max(16px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));box-sizing:border-box;border:0;background:rgba(8,10,14,.62);display:flex;align-items:center;justify-content:center;z-index:10070;';
    const card = document.createElement('div');
    card.setAttribute('data-rm-theater-favorite-card', 'true');
    card.style.cssText = 'width:min(720px,calc(100vw - 24px));max-height:min(88vh,calc(100dvh - 48px));overflow:auto;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);padding:14px;box-sizing:border-box;position:relative;isolation:isolate;';
    overlay.append(card);
    overlay.addEventListener('click', event => event.stopPropagation());
    overlay.addEventListener('pointerdown', event => event.stopPropagation());
    overlay.addEventListener('submit', event => { event.preventDefault(); event.stopPropagation(); });
    return { overlay, card };
}

function presentOverlay(overlay) {
    overlayParent().append(overlay);
    try {
        if (typeof overlay.showModal === 'function') overlay.showModal();
        else overlay.setAttribute('open', '');
    } catch {
        overlay.setAttribute('open', '');
    }
}

function bindOverlayDismiss(overlay, close) {
    overlay.addEventListener('cancel', event => {
        event.preventDefault();
        event.stopPropagation();
        close();
    });
    overlay.addEventListener('pointerdown', event => {
        if (event.target !== overlay) return;
        event.preventDefault();
        close();
    });
}

export async function openTheaterFavoriteViewer(id, hydrate) {
    const record = await getTheaterFavorite(id);
    if (!record) throw new Error('没有找到这条收藏。');
    closeTheaterFavoriteViewer();
    const { overlay, card } = overlayCard('兔子镜收藏');
    overlay.style.zIndex = '10080';
    overlay.setAttribute('data-rm-theater-favorite-viewer', 'true');
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px;';
    const title = document.createElement('strong');
    title.textContent = theaterFavoriteDisplayTitle(record);
    title.style.cssText = 'min-width:0;flex:1;font-size:15px;';
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:6px;flex:0 0 auto;';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'menu_button';
    copy.textContent = '复制 HTML';
    copy.addEventListener('click', () => {
        void copyTheaterFavoriteHtml(record).then(() => {
            globalThis.toastr?.success?.('已复制这面收藏的 HTML。');
        }).catch(error => {
            globalThis.toastr?.warning?.(String(error?.message || '复制失败。'));
        });
    });
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'menu_button';
    close.textContent = '关闭';
    close.addEventListener('click', () => closeTheaterFavoriteViewer());
    actions.append(copy, close);
    header.append(title, actions);
    const note = document.createElement('p');
    note.style.cssText = 'margin:0 0 10px;opacity:.7;font-size:11px;line-height:1.45;';
    note.textContent = record.characterName
        ? `角色卡：${record.characterName}。收藏走本机净化与挂载，不写入主楼 Prompt。`
        : '收藏走本机净化与挂载，不写入主楼 Prompt，也不接入七日历坐标。';
    const stage = document.createElement('div');
    stage.setAttribute('data-rm-theater-favorite-stage', 'true');
    card.append(header, note, stage);
    stage.style.cssText = 'position:relative;max-width:100%;overflow:auto;isolation:isolate;';
    stage.addEventListener('submit', event => { event.preventDefault(); event.stopPropagation(); });
    bindOverlayDismiss(overlay, closeTheaterFavoriteViewer);
    const keydown = event => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        closeTheaterFavoriteViewer();
    };
    document.addEventListener('keydown', keydown, true);
    presentOverlay(overlay);
    viewer = { overlay, keydown };
    if (typeof hydrate !== 'function') {
        closeTheaterFavoriteViewer();
        throw new Error('收藏夹缺少挂载管线。');
    }
    try {
        await hydrate(stage, record);
        stripTheaterFavoriteRuntimeUi(stage);
    } catch (error) {
        closeTheaterFavoriteViewer();
        throw error;
    }
    return record;
}

export async function openTheaterFavoriteLibrary(hydrate) {
    const rows = await listTheaterFavorites();
    closeTheaterFavoriteLibrary();
    const { overlay, card } = overlayCard('兔子镜收藏夹');
    overlay.setAttribute('data-rm-theater-favorite-library', 'true');
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px;';
    const title = document.createElement('strong');
    title.textContent = '兔子镜收藏夹';
    title.style.cssText = 'min-width:0;font-size:15px;';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'menu_button';
    close.textContent = '关闭';
    close.addEventListener('click', () => closeTheaterFavoriteLibrary());
    header.append(title, close);
    const note = document.createElement('p');
    note.style.cssText = 'margin:0 0 10px;opacity:.7;font-size:11px;line-height:1.45;';
    note.textContent = '按角色卡分组回看已收藏成品。打开时保留交互，不写入主楼 Prompt。旧收藏没有角色信息时归入「未分类」。';
    const list = document.createElement('div');
    const groups = groupTheaterFavoritesByCharacter(rows);
    if (!groups.length) {
        const empty = document.createElement('p');
        empty.style.cssText = 'margin:0;opacity:.7;font-size:12px;';
        empty.textContent = '还没有成品收藏。点标题旁的星标，或在工具菜单打开收藏夹。';
        list.append(empty);
    } else {
        for (const group of groups) {
            const heading = document.createElement('div');
            heading.style.cssText = 'font-weight:800;font-size:12px;margin:10px 0 4px;opacity:.88;';
            heading.textContent = `${group.characterName}（${group.items.length}）`;
            list.append(heading);
            for (const item of group.items) {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:7px;padding:7px 0;border-bottom:1px solid color-mix(in srgb,currentColor 10%,transparent);';
                const label = document.createElement('span');
                label.style.cssText = 'min-width:0;flex:1;overflow-wrap:anywhere;';
                label.textContent = theaterFavoriteDisplayTitle(item);
                const open = document.createElement('button');
                open.type = 'button';
                open.className = 'menu_button';
                open.textContent = '打开';
                open.style.minHeight = '28px';
                open.addEventListener('click', () => {
                    void openTheaterFavoriteViewer(item.id, hydrate).catch(error => {
                        globalThis.toastr?.warning?.(String(error?.message || '无法打开收藏。'));
                    });
                });
                const remove = document.createElement('button');
                remove.type = 'button';
                remove.className = 'menu_button';
                remove.textContent = '删除';
                remove.style.minHeight = '28px';
                remove.addEventListener('click', () => {
                    void deleteTheaterFavorite(item.id).then(() => openTheaterFavoriteLibrary(hydrate))
                        .catch(error => globalThis.toastr?.warning?.(String(error?.message || '删除失败。')));
                });
                row.append(label, open, remove);
                list.append(row);
            }
        }
    }
    card.append(header, note, list);
    bindOverlayDismiss(overlay, closeTheaterFavoriteLibrary);
    const keydown = event => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (viewer) closeTheaterFavoriteViewer();
        else closeTheaterFavoriteLibrary();
    };
    document.addEventListener('keydown', keydown, true);
    presentOverlay(overlay);
    library = { overlay, keydown };
    return rows;
}
