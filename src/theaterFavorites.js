const DB_NAME = 'rabbit_mirror_theater_favorites_v1';
const STORE = 'favorites';
const DB_VERSION = 1;
export const THEATER_FAVORITES_CHANGED_EVENT = 'rabbitmirror:theater-favorites-changed';
export const THEATER_FAVORITE_MAX_ITEMS = 80;
export const THEATER_FAVORITE_MAX_HTML_BYTES = 400 * 1024;

function byteLength(value = '') {
    const text = String(value || '');
    try { return new TextEncoder().encode(text).length; }
    catch { return unescape(encodeURIComponent(text)).length; }
}

function notifyChanged() {
    try { document.dispatchEvent(new CustomEvent(THEATER_FAVORITES_CHANGED_EVENT)); } catch {}
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
    return {
        id,
        title: String(value.title || '未命名兔子镜').replace(/\s+/g, ' ').trim().slice(0, 120) || '未命名兔子镜',
        mode: value.mode === 'text' ? 'text' : 'html',
        html,
        chatKey: String(value.chatKey || '').slice(0, 180),
        mesid: Number.isInteger(value.mesid) && value.mesid >= 0 ? value.mesid : null,
        swipe: Number.isInteger(value.swipe) && value.swipe >= 0 ? value.swipe : null,
        sourceHash: String(value.sourceHash || '').slice(0, 80),
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

export async function saveTheaterFavorite(input) {
    const html = String(input?.html || '').trim();
    if (!html) throw new Error('没有可收藏的兔子镜内容。');
    if (byteLength(html) > THEATER_FAVORITE_MAX_HTML_BYTES) {
        throw new Error('这面兔子镜超过收藏夹单条体积上限，未写入。');
    }
    const record = normalizeRecord({
        id: String(input?.id || '').trim() || `fav_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        title: input?.title,
        mode: input?.mode,
        html,
        chatKey: input?.chatKey,
        mesid: input?.mesid,
        swipe: input?.swipe,
        sourceHash: input?.sourceHash,
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

export function captureTheaterFavoriteFromRoot(root, owner = {}) {
    const details = root?.matches?.('details') ? root : root?.closest?.('details') || root?.querySelector?.('details');
    if (!details || details.classList?.contains('rabbit-mirror-external-placeholder')) return null;
    const html = String(details.outerHTML || '').trim();
    if (!html) return null;
    const title = String(details.querySelector?.(':scope > summary')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    return {
        title: title || '未命名兔子镜',
        mode: String(details.getAttribute?.('data-rm-presentation-mode') || owner.mode || '') === 'text' ? 'text' : 'html',
        html,
        chatKey: String(owner.chatKey || details.dataset?.rabbitMirrorOwnerChat || ''),
        mesid: Number.isInteger(owner.mesid) ? owner.mesid : Number(details.dataset?.rabbitMirrorOwnerMesid),
        swipe: Number.isInteger(owner.swipe) ? owner.swipe : Number(details.dataset?.rabbitMirrorOwnerSwipe),
        sourceHash: String(owner.sourceHash || details.dataset?.rabbitMirrorOwnerSourceHash || ''),
    };
}

let viewer = null;

export function closeTheaterFavoriteViewer() {
    if (!viewer) return;
    const { overlay, keydown } = viewer;
    document.removeEventListener('keydown', keydown, true);
    overlay.remove();
    viewer = null;
}

export async function openTheaterFavoriteViewer(id, hydrate) {
    const record = await getTheaterFavorite(id);
    if (!record) throw new Error('没有找到这条收藏。');
    closeTheaterFavoriteViewer();
    const overlay = document.createElement('div');
    overlay.setAttribute('data-rm-theater-favorite-viewer', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '兔子镜收藏');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10080;box-sizing:border-box;background:rgba(8,10,14,.62);padding:max(16px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));display:flex;align-items:center;justify-content:center;';
    const card = document.createElement('div');
    card.style.cssText = 'width:min(720px,calc(100vw - 24px));max-height:min(88vh,calc(100dvh - 48px));overflow:auto;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);padding:14px;box-sizing:border-box;';
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px;';
    const title = document.createElement('strong');
    title.textContent = record.title;
    title.style.cssText = 'min-width:0;font-size:15px;';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'menu_button';
    close.textContent = '关闭';
    close.addEventListener('click', () => closeTheaterFavoriteViewer());
    header.append(title, close);
    const note = document.createElement('p');
    note.style.cssText = 'margin:0 0 10px;opacity:.7;font-size:11px;line-height:1.45;';
    note.textContent = '收藏走本机净化与挂载，不写入主楼 Prompt，也不接入七日历坐标。';
    const stage = document.createElement('div');
    stage.setAttribute('data-rm-theater-favorite-stage', 'true');
    card.append(header, note, stage);
    overlay.append(card);
    overlay.addEventListener('pointerdown', event => { if (event.target === overlay) closeTheaterFavoriteViewer(); });
    const keydown = event => { if (event.key === 'Escape') closeTheaterFavoriteViewer(); };
    document.addEventListener('keydown', keydown, true);
    document.body.append(overlay);
    viewer = { overlay, keydown };
    if (typeof hydrate !== 'function') throw new Error('收藏夹缺少挂载管线。');
    await hydrate(stage, record);
    return record;
}
