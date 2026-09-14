import { detectWorldBookCapabilities, getHostRequestHeaders, requireHostHeaders } from './capabilities.js?rmv=1.5.51-narrow1';
import { EXTERNAL_WORLD_BOOK_ERROR_CODES, ExternalWorldBookError } from './errors.js?rmv=1.5.51-narrow1';
import { normalizeHostWorldBook } from './normalize.js?rmv=1.5.51-narrow1';

const DEFAULT_TIMEOUT_MS = 10000;

async function postJson(path, body, options = {}) {
    const fetchFn = options.fetchFn || globalThis.fetch;
    const headerProvider = options.headerProvider || getHostRequestHeaders;
    if (typeof fetchFn !== 'function') {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.CAPABILITY_UNAVAILABLE, '当前环境没有可用 fetch。');
    }
    const headers = requireHostHeaders(await headerProvider());
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), Math.max(1000, Number(options.timeoutMs) || DEFAULT_TIMEOUT_MS));
    try {
        const response = await fetchFn(path, {
            method: 'POST',
            credentials: 'same-origin',
            headers,
            body: JSON.stringify(body || {}),
            signal: controller.signal,
        });
        let payload = null;
        try { payload = await response.json(); } catch {}
        if (!response.ok) {
            throw new ExternalWorldBookError(
                path.endsWith('/list') ? EXTERNAL_WORLD_BOOK_ERROR_CODES.LIST_FAILED : EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED,
                `SillyTavern 世界书读取失败：HTTP ${response.status || '?'}`,
                { status: response.status || 0 },
            );
        }
        return payload;
    } catch (error) {
        if (controller.signal.aborted) {
            throw new ExternalWorldBookError(
                path.endsWith('/list') ? EXTERNAL_WORLD_BOOK_ERROR_CODES.LIST_FAILED : EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED,
                'SillyTavern 世界书读取超时。',
            );
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function listHostWorldBooks(options = {}) {
    const capabilities = await detectWorldBookCapabilities(options);
    if (!capabilities.canReadWorldBook) {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.CAPABILITY_UNAVAILABLE,
            '当前 SillyTavern 未检测到可用的世界书读取能力，可改用本地 JSON 导入。',
        );
    }
    const books = new Map();
    if (capabilities.headersAvailable) {
        try {
            const payload = await postJson('/api/worldinfo/list', {}, options);
            if (!Array.isArray(payload)) {
                throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.LIST_FAILED, 'SillyTavern 世界书列表格式不正确。');
            }
            for (const item of payload) {
                const fileId = String(item?.file_id ?? item?.name ?? '').trim();
                if (!fileId) continue;
                const displayName = String(item?.name ?? fileId).trim() || fileId;
                books.set(fileId, { fileId, displayName, extensions: item?.extensions && typeof item.extensions === 'object' ? item.extensions : {} });
            }
        } catch (error) {
            if (!capabilities.contextNames.length) throw error;
        }
    }
    if (!books.size && capabilities.contextNames.length) {
        for (const name of capabilities.contextNames) books.set(name, { fileId: name, displayName: name, extensions: {} });
    }
    if (!books.size && !capabilities.canListWorldBooks) {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.CAPABILITY_UNAVAILABLE,
            '当前 SillyTavern 未检测到可用的世界书读取能力，可改用本地 JSON 导入。',
        );
    }
    return [...books.values()].sort((a, b) => a.displayName.localeCompare(b.displayName, 'zh-Hans-CN'));
}

export async function readHostWorldBook(book, options = {}) {
    const fileId = String(book?.fileId ?? book ?? '').trim();
    if (!fileId) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.NOT_FOUND, '没有选择世界书。');
    }
    const payload = await postJson('/api/worldinfo/get', { name: fileId }, options);
    if (!payload || typeof payload !== 'object' || !Object.prototype.hasOwnProperty.call(payload, 'entries')) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.SCHEMA_UNSUPPORTED, 'SillyTavern 返回的世界书缺少 entries。');
    }
    return normalizeHostWorldBook(payload, {
        sourceId: fileId,
        sourceName: String(book?.displayName || payload?.name || fileId),
        sourceTransport: 'endpoint',
    });
}
