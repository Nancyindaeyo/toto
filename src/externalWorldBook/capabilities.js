import { EXTERNAL_WORLD_BOOK_ERROR_CODES, ExternalWorldBookError } from './errors.js?rmv=1.5.53-cn-boundary1';

export function getWorldInfoNamesFromContext(context = globalThis.SillyTavern?.getContext?.()) {
    try {
        if (typeof context?.getWorldInfoNames !== 'function') return null;
        const value = context.getWorldInfoNames();
        return Array.isArray(value) ? value.map(name => String(name || '').trim()).filter(Boolean) : null;
    } catch {
        return null;
    }
}

export async function getHostRequestHeaders() {
    try {
        const module = await import('../../../../../../script.js');
        if (typeof module?.getRequestHeaders !== 'function') return null;
        return module.getRequestHeaders();
    } catch {
        return null;
    }
}

export async function detectWorldBookCapabilities(options = {}) {
    const contextProvider = options.contextProvider || (() => globalThis.SillyTavern?.getContext?.());
    const headerProvider = options.headerProvider || getHostRequestHeaders;
    const contextNames = getWorldInfoNamesFromContext(contextProvider());
    const headers = await headerProvider();
    return {
        canListWorldBooks: Array.isArray(contextNames) || !!headers,
        canReadWorldBook: !!headers,
        canReadDisabledWorldBooks: !!headers,
        source: Array.isArray(contextNames) ? 'context-api' : headers ? 'endpoint' : null,
        contextNames: Array.isArray(contextNames) ? contextNames : [],
        headersAvailable: !!headers,
        reason: headers || Array.isArray(contextNames) ? '' : EXTERNAL_WORLD_BOOK_ERROR_CODES.CAPABILITY_UNAVAILABLE,
    };
}

export function requireHostHeaders(headers) {
    if (!headers || typeof headers !== 'object') {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.CAPABILITY_UNAVAILABLE,
            '当前 SillyTavern 未检测到可用的世界书读取请求能力，可改用本地 JSON 导入。',
        );
    }
    return headers;
}
