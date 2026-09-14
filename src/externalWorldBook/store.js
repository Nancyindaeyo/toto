import { EXTERNAL_WORLD_BOOK_CLASSIFICATION } from './classifier.js?rmv=1.5.51-narrow1';
import { EXTERNAL_WORLD_BOOK_ERROR_CODES, ExternalWorldBookError } from './errors.js?rmv=1.5.51-narrow1';
import { entryIdentity } from './selectionState.js?rmv=1.5.51-narrow1';
import { EXTERNAL_POOL_METADATA_VERSION, externalPoolMetadataForLibrary, getExternalPoolRevision, getExternalPoolSnapshot, removeExternalPoolLibrary, setExternalPoolMetadataSnapshot, upsertExternalPoolLibrary, validExternalPoolMetadata } from './externalPool.js?rmv=1.5.51-narrow1';

export const EXTERNAL_WORLD_BOOK_DB_NAME = 'rabbitmirror_external_worldbooks';
export const EXTERNAL_WORLD_BOOK_DB_VERSION = 2;
export const EXTERNAL_WORLD_BOOK_LIBRARY_SCHEMA_VERSION = 1;
const STORE_LIBRARIES = 'libraries';
const STORE_ENTRIES = 'entries';
const STORE_POOL_METADATA = 'poolMetadata';
const INDEX_ENTRIES_BY_LIBRARY = 'byLibrary';
const INDEX_ENTRIES_BY_EXTERNAL_ID = 'byExternalId';

let hydrationFactory = null;
let hydrationPromise = null;
let hydratedRevision = -1;
let hydrationStatus = Object.freeze({ hydrated: false, metadataRebuildRequired: Object.freeze([]), enabledMetadataRebuildRequired: Object.freeze([]) });

export function getExternalPoolHydrationStatus() { return hydrationStatus; }

function invalidateMetadataHydration() {
    hydratedRevision = -1;
    hydrationStatus = Object.freeze({ hydrated: false, metadataRebuildRequired: Object.freeze([]), enabledMetadataRebuildRequired: Object.freeze([]) });
}

function metadataRebuildError(libraryId) {
    return new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_STATE_CONFLICT,
        '这个旧外部库尚无轻量抽取索引，请在外部库管理中明确重建索引，或重新导入；不会自动读取整库正文。',
        { reason: 'metadata-rebuild-required', libraryId });
}

function hashText(text = '') {
    let h = 2166136261;
    for (const ch of String(text)) {
        h ^= ch.charCodeAt(0);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
}

function safeIdentityPart(value, maxChars = 96) {
    const text = String(value ?? '').trim();
    const encoded = encodeURIComponent(text).replace(/%/g, '_');
    return encoded.slice(0, maxChars) || 'unknown';
}

export function externalLibraryIdForBook(book) {
    const sourceType = String(book?.sourceType || 'unknown').trim() || 'unknown';
    const sourceId = String(book?.sourceId || book?.sourceName || 'unknown').trim() || 'unknown';
    return `extlib:${safeIdentityPart(sourceType, 20)}:${hashText(`${sourceType}\u0000${sourceId}`)}:${safeIdentityPart(sourceId)}`;
}

export function externalEntryStableIdentity(entry) {
    const sourceId = String(entry?.sourceEntryId ?? '');
    if (entry?.sourceEntryUid !== null && entry?.sourceEntryUid !== undefined && String(entry.sourceEntryUid) !== '') {
        // Keep the source entry id as a deterministic disambiguator. Well-formed SillyTavern
        // lorebooks use unique UIDs, but a malformed/imported book must never collapse two
        // entries into one IndexedDB record merely because it repeats a UID.
        return `uid:${String(entry.sourceEntryUid)}:id:${sourceId}`;
    }
    return `id:${sourceId}`;
}

function externalEntryKind(classification) {
    if (classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.THEME) return 'theme';
    if (classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.FORMAT) return 'format';
    if (classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.AUXILIARY) return 'aux';
    return 'entry';
}

export function externalEntryId(libraryId, entry, classification) {
    const stable = externalEntryStableIdentity(entry);
    return `ext:${libraryId}:${externalEntryKind(classification)}:${hashText(stable)}:${safeIdentityPart(stable, 72)}`;
}

function sourceEntryMap(book) {
    return new Map((Array.isArray(book?.entries) ? book.entries : []).map(entry => [entryIdentity(entry), entry]));
}

export function prepareExternalLibrarySnapshot(book, draft, options = {}) {
    if (!book || typeof book !== 'object') throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.STORAGE_WRITE_FAILED, '没有可保存的外部世界书。');
    const libraryId = externalLibraryIdForBook(book);
    const now = Number(options.now ?? Date.now());
    const sourceByIdentity = sourceEntryMap(book);
    const storedEntries = [];

    for (const item of Array.isArray(draft) ? draft : []) {
        const source = sourceByIdentity.get(item.entryIdentity);
        if (!source) continue;
        const classification = Object.values(EXTERNAL_WORLD_BOOK_CLASSIFICATION).includes(item.classification)
            ? item.classification
            : EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING;
        const stableIdentity = externalEntryStableIdentity(source);
        const externalId = externalEntryId(libraryId, source, classification);
        storedEntries.push({
            storageKey: `${libraryId}\u0000${stableIdentity}`,
            libraryId,
            externalId,
            sourceEntryIdentity: stableIdentity,
            sourceEntryId: source.sourceEntryId,
            sourceEntryUid: source.sourceEntryUid,
            sourceTitle: source.title,
            sourceKeywords: [...new Set([...(source.primaryKeywords || []), ...(source.secondaryKeywords || [])])],
            classification,
            suggestion: item.suggestion,
            classificationConfidence: item.confidence,
            userConfirmed: classification !== EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING,
            localTitle: String(item.localTitle || source.title || '').trim().slice(0, 1000),
            summary: String(item.summary || '').replace(/\r\n?/g, '\n').trim().slice(0, 1200),
            rawContent: String(source.content || ''),
            contentHash: String(source.contentHash || ''),
            enabled: [
                EXTERNAL_WORLD_BOOK_CLASSIFICATION.THEME,
                EXTERNAL_WORLD_BOOK_CLASSIFICATION.FORMAT,
                EXTERNAL_WORLD_BOOK_CLASSIFICATION.AUXILIARY,
            ].includes(classification),
            aliases: [],
            linkedAuxiliaryIds: [],
            sourceDisabled: source.disabled === true,
            sourceConstant: source.constant === true,
            sourceSelective: source.selective === true,
            originalOrder: source.originalOrder,
            createdAt: now,
            updatedAt: now,
        });
    }

    const counts = storedEntries.reduce((acc, entry) => {
        if (entry.classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.THEME) acc.theme += 1;
        else if (entry.classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.FORMAT) acc.format += 1;
        else if (entry.classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.AUXILIARY) acc.auxiliary += 1;
        else if (entry.classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.IGNORE) acc.ignored += 1;
        else acc.pending += 1;
        return acc;
    }, { theme: 0, format: 0, auxiliary: 0, ignored: 0, pending: 0 });

    return {
        library: {
            schemaVersion: EXTERNAL_WORLD_BOOK_LIBRARY_SCHEMA_VERSION,
            libraryId,
            displayName: String(book.sourceName || '未命名世界书').trim().slice(0, 1000),
            sourceType: String(book.sourceType || ''),
            sourceTransport: String(book.sourceTransport || ''),
            sourceWorldBookId: String(book.sourceId || ''),
            sourceWorldBookName: String(book.sourceName || ''),
            sourceHash: String(book.sourceHash || ''),
            enabled: options.enabled === true,
            entryCount: storedEntries.length,
            themeCount: counts.theme,
            formatCount: counts.format,
            auxiliaryCount: counts.auxiliary,
            pendingCount: counts.pending,
            ignoredCount: counts.ignored,
            createdAt: now,
            updatedAt: now,
        },
        entries: storedEntries,
    };
}

function requestPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
    });
}

function transactionPromise(transaction) {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed'));
        transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted'));
    });
}

function wrapStorageError(error, fallbackMessage = '外部世界书本地存储失败。') {
    if (error instanceof ExternalWorldBookError) return error;
    const name = String(error?.name || '');
    if (name === 'QuotaExceededError') {
        return new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.STORAGE_QUOTA, '浏览器本地存储空间不足，未保存这次外部世界书。');
    }
    return new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.STORAGE_WRITE_FAILED, fallbackMessage, { causeName: name || 'Error' });
}

export async function openExternalLibraryDatabase(options = {}) {
    const factory = options.indexedDBFactory || globalThis.indexedDB;
    if (!factory || typeof factory.open !== 'function') {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.STORAGE_UNAVAILABLE, '当前浏览器没有可用的 IndexedDB，无法保存外部世界书。');
    }
    return new Promise((resolve, reject) => {
        let request;
        let settled = false;
        const rejectOpen = error => { if (!settled) { settled = true; reject(error); } };
        try { request = factory.open(EXTERNAL_WORLD_BOOK_DB_NAME, EXTERNAL_WORLD_BOOK_DB_VERSION); }
        catch (error) { rejectOpen(wrapStorageError(error, '无法打开外部世界书本地数据库。')); return; }
        request.onupgradeneeded = () => {
            if (settled) { try { request.transaction?.abort(); } catch {} return; }
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_LIBRARIES)) db.createObjectStore(STORE_LIBRARIES, { keyPath: 'libraryId' });
            // Upgrade creates structures only. Existing raw records remain in place;
            // their light metadata is rebuilt only by an explicit user action.
            if (!db.objectStoreNames.contains(STORE_POOL_METADATA)) db.createObjectStore(STORE_POOL_METADATA, { keyPath: 'libraryId' });
            if (!db.objectStoreNames.contains(STORE_ENTRIES)) {
                const entries = db.createObjectStore(STORE_ENTRIES, { keyPath: 'storageKey' });
                entries.createIndex(INDEX_ENTRIES_BY_LIBRARY, 'libraryId', { unique: false });
                entries.createIndex(INDEX_ENTRIES_BY_EXTERNAL_ID, 'externalId', { unique: true });
            } else {
                const tx = request.transaction;
                const entries = tx.objectStore(STORE_ENTRIES);
                if (!entries.indexNames.contains(INDEX_ENTRIES_BY_LIBRARY)) entries.createIndex(INDEX_ENTRIES_BY_LIBRARY, 'libraryId', { unique: false });
                if (!entries.indexNames.contains(INDEX_ENTRIES_BY_EXTERNAL_ID)) entries.createIndex(INDEX_ENTRIES_BY_EXTERNAL_ID, 'externalId', { unique: true });
            }
        };
        request.onsuccess = () => {
            const db = request.result;
            if (settled) { try { db.close(); } catch {} return; }
            settled = true;
            db.onversionchange = () => { try { db.close(); } catch {} };
            resolve(db);
        };
        request.onerror = () => rejectOpen(wrapStorageError(request.error, '无法打开外部世界书本地数据库。'));
        request.onblocked = () => rejectOpen(new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.STORAGE_UNAVAILABLE, '外部世界书本地数据库正在被其它页面占用，请关闭其它酒馆页面后重试。'));
    });
}

async function entryKeysForLibrary(store, libraryId, options = {}) {
    const keyRangeFactory = options.keyRangeFactory || globalThis.IDBKeyRange;
    if (store.index && keyRangeFactory?.only) {
        const index = store.index(INDEX_ENTRIES_BY_LIBRARY);
        if (index?.getAllKeys) return requestPromise(index.getAllKeys(keyRangeFactory.only(libraryId)));
    }
    if (typeof store.getAll === 'function') {
        const rows = await requestPromise(store.getAll());
        return (Array.isArray(rows) ? rows : []).filter(row => row?.libraryId === libraryId).map(row => row.storageKey);
    }
    return [];
}

export async function saveExternalLibrarySnapshot(snapshot, options = {}) {
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_LIBRARIES, STORE_ENTRIES, STORE_POOL_METADATA], 'readwrite');
        const libraries = transaction.objectStore(STORE_LIBRARIES);
        const entries = transaction.objectStore(STORE_ENTRIES);
        const libraryId = String(snapshot?.library?.libraryId || '');
        if (!libraryId) throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.STORAGE_WRITE_FAILED, '外部世界书缺少 libraryId。');

        const existing = await requestPromise(libraries.get(libraryId));
        const keys = await entryKeysForLibrary(entries, libraryId, options);
        for (const key of keys) entries.delete(key);
        const library = {
            ...snapshot.library,
            enabled: existing ? existing.enabled === true : snapshot.library.enabled === true,
            createdAt: existing?.createdAt ?? snapshot.library.createdAt,
            updatedAt: Date.now(),
            poolMetadataVersion: EXTERNAL_POOL_METADATA_VERSION,
        };
        libraries.put(library);
        transaction.objectStore(STORE_POOL_METADATA).put(externalPoolMetadataForLibrary(library, snapshot.entries || []));
        for (const entry of snapshot.entries || []) {
            entries.put({ ...entry, createdAt: existing?.createdAt ?? entry.createdAt, updatedAt: Date.now() });
        }
        await transactionPromise(transaction);
        upsertExternalPoolLibrary(library, snapshot.entries || []);
        invalidateMetadataHydration();
        return library;
    } catch (error) {
        try { db.close(); } catch {}
        throw wrapStorageError(error);
    } finally {
        try { db.close(); } catch {}
    }
}

export async function listExternalLibraries(options = {}) {
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_LIBRARIES], 'readonly');
        const rows = await requestPromise(transaction.objectStore(STORE_LIBRARIES).getAll());
        await transactionPromise(transaction);
        return (Array.isArray(rows) ? rows : []).sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    } finally {
        try { db.close(); } catch {}
    }
}

export async function getExternalLibraryEntries(libraryId, options = {}) {
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_ENTRIES], 'readonly');
        const store = transaction.objectStore(STORE_ENTRIES);
        const keyRangeFactory = options.keyRangeFactory || globalThis.IDBKeyRange;
        let rows;
        if (store.index && keyRangeFactory?.only) rows = await requestPromise(store.index(INDEX_ENTRIES_BY_LIBRARY).getAll(keyRangeFactory.only(libraryId)));
        else rows = (await requestPromise(store.getAll())).filter(row => row?.libraryId === libraryId);
        await transactionPromise(transaction);
        return Array.isArray(rows) ? rows : [];
    } finally {
        try { db.close(); } catch {}
    }
}

function externalEntryChoice(row) {
    return {
        externalId: String(row.externalId || ''),
        title: String(row.localTitle || row.sourceTitle || '未命名条目').slice(0, 1000),
        classification: String(row.classification || ''),
        enabled: row.enabled === true,
        selectable: row.userConfirmed === true && ['theme', 'format'].includes(row.classification),
    };
}

// Explicit management action only. Read one library through its index, retain
// at most one page of light choices, and never return/cache rawContent in UI.
export async function listExternalLibraryEntryChoices(libraryId, options = {}) {
    if (typeof libraryId !== 'string' || !libraryId.trim() || libraryId !== libraryId.trim() || libraryId.length > 1024) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_STATE_CONFLICT, '没有有效的母本库编号；不会扫描其它库。');
    }
    const pageSize = Math.max(1, Math.min(50, Math.floor(Number(options.pageSize) || 50)));
    const offset = Math.max(0, Math.min(25000, Math.floor(Number(options.offset) || 0)));
    const query = String(options.query || '').trim().slice(0, 200).toLocaleLowerCase('zh-Hans-CN');
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_ENTRIES], 'readonly');
        const done = transactionPromise(transaction);
        done.catch(() => {});
        const result = await new Promise((resolve, reject) => {
            const request = transaction.objectStore(STORE_ENTRIES).index(INDEX_ENTRIES_BY_LIBRARY).openCursor(libraryId);
            const choices = [];
            let matched = 0;
            request.onerror = () => reject(request.error || new Error('Entry choices read failed'));
            request.onsuccess = () => {
                const cursor = request.result;
                if (!cursor) { resolve({ choices, hasNext: false, offset }); return; }
                const row = cursor.value;
                if (row?.libraryId === libraryId) {
                    const choice = externalEntryChoice(row);
                    if (!query || choice.title.toLocaleLowerCase('zh-Hans-CN').includes(query)) {
                        if (matched++ >= offset) choices.push(choice);
                        if (choices.length > pageSize) { choices.pop(); resolve({ choices, hasNext: true, offset }); return; }
                    }
                }
                cursor.continue();
            };
        });
        await done;
        return result;
    } catch (error) {
        throw wrapStorageError(error, '无法读取这本库的条目列表；已保存内容未修改。');
    } finally {
        try { db.close(); } catch {}
    }
}

export async function setExternalLibraryEntryEnabled(libraryId, externalId, enabled, options = {}) {
    const db = await openExternalLibraryDatabase(options);
    let transaction;
    let done;
    try {
        transaction = db.transaction([STORE_LIBRARIES, STORE_ENTRIES, STORE_POOL_METADATA], 'readwrite');
        done = transactionPromise(transaction);
        done.catch(() => {});
        const libraries = transaction.objectStore(STORE_LIBRARIES);
        const entries = transaction.objectStore(STORE_ENTRIES);
        const metadataStore = transaction.objectStore(STORE_POOL_METADATA);
        const [library, row, metadata] = await Promise.all([
            requestPromise(libraries.get(libraryId)),
            requestPromise(entries.index(INDEX_ENTRIES_BY_EXTERNAL_ID).get(externalId)),
            requestPromise(metadataStore.get(libraryId)),
        ]);
        if (!library || !row || row.libraryId !== libraryId || row.externalId !== externalId) {
            throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.NOT_FOUND, '条目已不存在或不属于这本库；未修改任何内容。');
        }
        if (!validExternalPoolMetadata(metadata, libraryId)) throw metadataRebuildError(libraryId);
        if (!externalEntryChoice(row).selectable || !externalId.startsWith(`ext:${libraryId}:${row.classification}:`)) {
            throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_STATE_CONFLICT, '只有已确认的主题和展现形式可以勾选参与抽签；条目原文未修改。');
        }
        const now = Date.now();
        const next = { ...row, enabled: enabled === true, updatedAt: now };
        const field = row.classification === 'theme' ? 'themeIds' : 'formatIds';
        const ids = metadata[field].filter(id => id !== externalId);
        if (next.enabled) ids.push(externalId);
        const nextMetadata = { ...metadata, enabled: library.enabled === true, [field]: ids };
        const nextLibrary = { ...library, updatedAt: now };
        entries.put(next);
        metadataStore.put(nextMetadata);
        libraries.put(nextLibrary);
        await done;
        // Publish only after the durable transaction. No raw rows are retained
        // in the existing pool, and another library's choices remain untouched.
        upsertExternalPoolLibrary(nextLibrary, [
            ...nextMetadata.themeIds.map(id => ({ externalId: id, classification: 'theme', enabled: true, userConfirmed: true })),
            ...nextMetadata.formatIds.map(id => ({ externalId: id, classification: 'format', enabled: true, userConfirmed: true })),
        ]);
        invalidateMetadataHydration();
        return externalEntryChoice(next);
    } catch (error) {
        try { transaction?.abort(); } catch {}
        if (done) await done.catch(() => {});
        throw wrapStorageError(error, '条目勾选未保存，请重试；原有内容与选择保持不变。');
    } finally {
        try { db.close(); } catch {}
    }
}

export async function setExternalLibraryEnabled(libraryId, enabled, options = {}) {
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_LIBRARIES, STORE_POOL_METADATA], 'readwrite');
        const store = transaction.objectStore(STORE_LIBRARIES);
        const metadataStore = transaction.objectStore(STORE_POOL_METADATA);
        const [current, metadata] = await Promise.all([requestPromise(store.get(libraryId)), requestPromise(metadataStore.get(libraryId))]);
        if (!current) throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.NOT_FOUND, '未找到已保存的外部世界书。');
        if (enabled === true && !validExternalPoolMetadata(metadata, libraryId)) throw metadataRebuildError(libraryId);
        const next = { ...current, enabled: enabled === true, updatedAt: Date.now() };
        store.put(next);
        if (validExternalPoolMetadata(metadata, libraryId)) metadataStore.put({ ...metadata, enabled: next.enabled });
        await transactionPromise(transaction);
        // Toggling never loads raw rows. Reuse the persisted ID-only metadata.
        const entries = validExternalPoolMetadata(metadata, libraryId) ? [
            ...(metadata?.themeIds || []).map(externalId => ({ externalId, classification: 'theme', enabled: true, userConfirmed: true })),
            ...(metadata?.formatIds || []).map(externalId => ({ externalId, classification: 'format', enabled: true, userConfirmed: true })),
        ] : [];
        upsertExternalPoolLibrary(next, entries);
        invalidateMetadataHydration();
        return next;
    } catch (error) {
        throw wrapStorageError(error, '无法更新外部世界书启用状态。');
    } finally {
        try { db.close(); } catch {}
    }
}

export async function deleteExternalLibrary(libraryId, options = {}) {
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_LIBRARIES, STORE_ENTRIES, STORE_POOL_METADATA], 'readwrite');
        const libraries = transaction.objectStore(STORE_LIBRARIES);
        const entries = transaction.objectStore(STORE_ENTRIES);
        const keys = await entryKeysForLibrary(entries, libraryId, options);
        for (const key of keys) entries.delete(key);
        libraries.delete(libraryId);
        transaction.objectStore(STORE_POOL_METADATA).delete(libraryId);
        await transactionPromise(transaction);
        removeExternalPoolLibrary(libraryId);
        invalidateMetadataHydration();
        return true;
    } catch (error) {
        throw wrapStorageError(error, '无法删除外部世界书本地索引。');
    } finally {
        try { db.close(); } catch {}
    }
}

// This API is the only generation-time raw ingress. Its Map and rows belong to
// the requesting operation; neither is retained in the pool, metadata or cache.
export async function getSelectedExternalEntries(ids = [], options = {}) {
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_STATE_CONFLICT, '外部条目 ID 列表无效。', { reason: 'selected-ids-invalid' });
    }
    const selected = [...new Set(ids.filter(id => id.startsWith('ext:')))];
    if (!selected.length) return new Map();
    if (selected.some(id => id !== id.trim() || id.length > 2048)) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_STATE_CONFLICT, '外部条目 ID 无效。', { reason: 'selected-id-invalid' });
    }
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_ENTRIES, STORE_LIBRARIES], 'readonly');
        const done = transactionPromise(transaction);
        // Register the rejection handler before any request can abort the transaction.
        done.catch(() => {});
        const index = transaction.objectStore(STORE_ENTRIES).index(INDEX_ENTRIES_BY_EXTERNAL_ID);
        const libraries = transaction.objectStore(STORE_LIBRARIES);
        const libraryRequests = new Map();
        const reads = selected.map(id => new Promise((resolve, reject) => {
            // Exactly one index.get per unique selected ID; no getAll/raw fallback.
            const request = index.get(id);
            request.onerror = () => reject(request.error || new Error('Selected external entry read failed'));
            request.onsuccess = () => {
                const row = request.result;
                if (!row?.libraryId) { resolve({ id, row, library: null }); return; }
                try {
                    // Enqueue this request inside the IDB success task, including
                    // Safari, rather than after the transaction has gone inactive.
                    if (!libraryRequests.has(row.libraryId)) libraryRequests.set(row.libraryId, requestPromise(libraries.get(row.libraryId)));
                    libraryRequests.get(row.libraryId).then(library => resolve({ id, row, library }), reject);
                } catch (error) { reject(error); }
            };
        }));
        const [pairs] = await Promise.all([Promise.all(reads), done]);
        const materials = new Map();
        for (const { id, row, library } of pairs) {
            if (!row || row.externalId !== id || !library) {
                throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.NOT_FOUND, '本轮抽中的外部条目已不存在；本轮已停止，不会替换条目或自动重抽。', { reason: 'selected-entry-missing', externalId: id });
            }
            const kind = row.classification;
            if (row.enabled !== true || row.userConfirmed !== true || library.enabled !== true
                || !['theme', 'format'].includes(kind) || !id.startsWith(`ext:${row.libraryId}:${kind}:`)) {
                throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_STATE_CONFLICT, '本轮抽中的外部条目已停用或分类状态发生变化；不会自动重抽。', { reason: 'selected-entry-ineligible', externalId: id });
            }
            if (typeof row.rawContent !== 'string' || !row.rawContent.trim()) {
                throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_CONTENT_INVALID, '本轮抽中的外部条目缺少正文；不会自动重抽。', { reason: 'selected-entry-raw-missing', externalId: id });
            }
            // The selected library is already read in this same transaction. Carry only
            // its name for local attribution; no extra library scan or persistent raw copy.
            materials.set(id, { ...row, sourceWorldBookName: String(library.sourceWorldBookName || library.displayName || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 200) });
        }
        return materials;
    } catch (error) {
        if (error instanceof ExternalWorldBookError) throw error;
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED, '无法读取本轮抽中的外部条目；本轮已停止。', { reason: 'selected-entry-read-failed', causeName: String(error?.name || 'Error') });
    } finally {
        try { db.close(); } catch {}
    }
}

// Caller opts in at an async generation/settings boundary. Merely importing this
// module does not open IDB. Concurrent callers share only this ID-only hydration.
export function hydrateExternalPoolMetadata(options = {}) {
    const factory = options.indexedDBFactory || globalThis.indexedDB;
    if (hydrationFactory !== factory) {
        hydrationFactory = factory;
        hydrationPromise = null;
        invalidateMetadataHydration();
    }
    if (hydrationPromise) return hydrationPromise;
    if (options.force !== true && hydratedRevision === getExternalPoolRevision()) return Promise.resolve(getExternalPoolSnapshot());
    const revision = getExternalPoolRevision();
    const pending = (async () => {
        const db = await openExternalLibraryDatabase(options);
        try {
            const transaction = db.transaction([STORE_LIBRARIES, STORE_POOL_METADATA], 'readonly');
            const done = transactionPromise(transaction);
            const [libraries, metadata] = await Promise.all([
                requestPromise(transaction.objectStore(STORE_LIBRARIES).getAll()),
                requestPromise(transaction.objectStore(STORE_POOL_METADATA).getAll()),
                done,
            ]);
            if (!Array.isArray(libraries) || !Array.isArray(metadata)) throw new Error('Invalid external pool metadata');
            // Never resurrect a deleted/disabled library from an older async read.
            if (hydrationFactory !== factory || revision !== getExternalPoolRevision()) return getExternalPoolSnapshot();
            const byLibrary = new Map(metadata.map(record => [record?.libraryId, record]));
            const missing = libraries.filter(library => !validExternalPoolMetadata(byLibrary.get(library?.libraryId), library?.libraryId)).map(library => String(library.libraryId));
            const result = setExternalPoolMetadataSnapshot(libraries, metadata);
            hydratedRevision = getExternalPoolRevision();
            const enabledMissing = libraries.filter(library => library.enabled === true && missing.includes(String(library.libraryId))).map(library => String(library.libraryId));
            hydrationStatus = Object.freeze({ hydrated: true, metadataRebuildRequired: Object.freeze(missing), enabledMetadataRebuildRequired: Object.freeze(enabledMissing) });
            return result;
        } finally {
            try { db.close(); } catch {}
        }
    })().finally(() => { if (hydrationPromise === pending) hydrationPromise = null; });
    hydrationPromise = pending;
    return pending;
}

// Explicit user action only (or explicit re-import via saveExternalLibrarySnapshot).
// This is deliberately not called by hydration, generation, enable or startup.
export async function rebuildExternalPoolMetadata(libraryId, options = {}) {
    const db = await openExternalLibraryDatabase(options);
    try {
        const transaction = db.transaction([STORE_LIBRARIES, STORE_ENTRIES, STORE_POOL_METADATA], 'readwrite');
        const done = transactionPromise(transaction);
        done.catch(() => {});
        const libraries = transaction.objectStore(STORE_LIBRARIES);
        const metadataStore = transaction.objectStore(STORE_POOL_METADATA);
        const libraryRead = requestPromise(libraries.get(libraryId));
        const rowsRead = requestPromise(transaction.objectStore(STORE_ENTRIES).index(INDEX_ENTRIES_BY_LIBRARY).getAll(libraryId));
        const [library, rows] = await Promise.all([libraryRead, rowsRead]);
        if (!library) throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.NOT_FOUND, '未找到需要重建索引的外部库。');
        if (!Array.isArray(rows)) throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED, '无法读取该外部库以重建索引。');
        const metadata = externalPoolMetadataForLibrary(library, rows);
        metadataStore.put(metadata);
        libraries.put({ ...library, poolMetadataVersion: EXTERNAL_POOL_METADATA_VERSION, updatedAt: Date.now() });
        await done;
        upsertExternalPoolLibrary(library, rows);
        invalidateMetadataHydration();
        return metadata;
    } catch (error) {
        throw wrapStorageError(error, '无法重建外部库轻量索引；原有正文未删除。');
    } finally {
        try { db.close(); } catch {}
    }
}
