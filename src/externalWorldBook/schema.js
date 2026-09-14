import { EXTERNAL_WORLD_BOOK_ERROR_CODES, ExternalWorldBookError } from './errors.js?rmv=1.5.51-narrow1';

export const EXTERNAL_WORLD_BOOK_SCHEMA_VERSION = 1;
export const EXTERNAL_WORLD_BOOK_MAX_FILE_BYTES = 8 * 1024 * 1024;
export const EXTERNAL_WORLD_BOOK_MAX_ENTRIES = 5000;
export const EXTERNAL_WORLD_BOOK_PREVIEW_CHARS = 360;
export const EXTERNAL_WORLD_BOOK_SEARCH_CONTENT_CHARS = 480;

export function isPlainObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function normalizeWorldBookString(value, maxChars = 1000000) {
    return String(value ?? '').replace(/\r\n?/g, '\n').slice(0, Math.max(0, Number(maxChars) || 0));
}

export function normalizeWorldBookStringArray(value, maxItems = 128, maxChars = 512) {
    const source = Array.isArray(value)
        ? value
        : typeof value === 'string'
            ? [value]
            : [];
    const result = [];
    const seen = new Set();
    for (const item of source) {
        const text = normalizeWorldBookString(item, maxChars).trim();
        if (!text || seen.has(text)) continue;
        seen.add(text);
        result.push(text);
        if (result.length >= maxItems) break;
    }
    return result;
}

export function resolveEntriesContainer(raw) {
    if (!isPlainObject(raw)) {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.SCHEMA_UNSUPPORTED,
            '该 JSON 顶层不是对象，无法识别为世界书。',
        );
    }
    if (!Object.prototype.hasOwnProperty.call(raw, 'entries')) {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRIES_MISSING,
            '该 JSON 缺少 entries，无法识别为当前支持的世界书结构。',
        );
    }
    const entries = raw.entries;
    if (Array.isArray(entries)) {
        return entries.map((entry, index) => ({ sourceKey: String(index), entry, originalIndex: index }));
    }
    if (isPlainObject(entries)) {
        return Object.entries(entries).map(([sourceKey, entry], index) => ({ sourceKey: String(sourceKey), entry, originalIndex: index }));
    }
    throw new ExternalWorldBookError(
        EXTERNAL_WORLD_BOOK_ERROR_CODES.SCHEMA_UNSUPPORTED,
        'entries 既不是数组也不是对象，已停止导入。',
    );
}

function normalizeEntryDisabled(entry, sourceKey) {
    const hasDisable = Object.prototype.hasOwnProperty.call(entry, 'disable');
    const hasEnabled = Object.prototype.hasOwnProperty.call(entry, 'enabled');
    if (hasDisable && hasEnabled) {
        const disabledByDisable = Boolean(entry.disable);
        const disabledByEnabled = !Boolean(entry.enabled);
        if (disabledByDisable !== disabledByEnabled) {
            throw new ExternalWorldBookError(
                EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_STATE_CONFLICT,
                `世界书条目 ${sourceKey} 同时存在互相冲突的 disable / enabled。`,
                { sourceKey },
            );
        }
        return disabledByDisable;
    }
    if (hasDisable) return Boolean(entry.disable);
    if (hasEnabled) return !Boolean(entry.enabled);
    return false;
}

function normalizeNumeric(value, fallback = null) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

export function normalizeWorldBookEntry(rawEntry, context = {}) {
    const sourceKey = String(context.sourceKey ?? context.originalIndex ?? '');
    if (!isPlainObject(rawEntry)) {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.SCHEMA_UNSUPPORTED,
            `世界书条目 ${sourceKey || '?'} 不是对象。`,
            { sourceKey },
        );
    }
    if (typeof rawEntry.content !== 'string') {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_CONTENT_INVALID,
            `世界书条目 ${sourceKey || '?'} 的 content 不是文本。`,
            { sourceKey, contentType: Array.isArray(rawEntry.content) ? 'array' : typeof rawEntry.content },
        );
    }

    const uidValue = rawEntry.uid ?? rawEntry.id ?? null;
    const uid = uidValue === null || uidValue === undefined ? null : String(uidValue);
    const comment = normalizeWorldBookString(rawEntry.comment ?? '', 1000).trim();
    const explicitTitle = normalizeWorldBookString(rawEntry.title ?? rawEntry.name ?? '', 1000).trim();
    const fallbackIdentity = (uid ?? sourceKey) || String(Number(context.originalIndex || 0) + 1);
    const title = explicitTitle || comment || `条目 ${fallbackIdentity}`;
    const primaryKeywords = normalizeWorldBookStringArray(rawEntry.key ?? rawEntry.keys ?? [], 128, 512);
    const secondaryKeywords = normalizeWorldBookStringArray(rawEntry.keysecondary ?? rawEntry.secondary_keys ?? rawEntry.secondaryKeys ?? [], 128, 512);
    const content = normalizeWorldBookString(rawEntry.content, 1000000);
    const disabled = normalizeEntryDisabled(rawEntry, sourceKey);
    const constant = rawEntry.constant === true;
    const selective = rawEntry.selective === true || rawEntry.selectiveLogic !== undefined;
    const originalOrder = normalizeNumeric(rawEntry.order, normalizeNumeric(rawEntry.display_index, context.originalIndex ?? 0));

    return {
        sourceEntryId: sourceKey,
        sourceEntryUid: uid,
        title,
        comment,
        primaryKeywords,
        secondaryKeywords,
        content,
        disabled,
        constant,
        selective,
        originalOrder,
        position: normalizeNumeric(rawEntry.position, null),
        probability: normalizeNumeric(rawEntry.probability, null),
        sticky: normalizeNumeric(rawEntry.sticky, null),
        cooldown: normalizeNumeric(rawEntry.cooldown, null),
        delay: normalizeNumeric(rawEntry.delay, null),
        group: normalizeWorldBookString(rawEntry.group ?? '', 256).trim(),
        groupWeight: normalizeNumeric(rawEntry.groupWeight ?? rawEntry.group_weight, null),
        scanDepth: normalizeNumeric(rawEntry.scanDepth ?? rawEntry.scan_depth, null),
        vectorized: rawEntry.vectorized === true,
        sourceMetadata: {
            sourceKey,
            uid: rawEntry.uid ?? null,
            id: rawEntry.id ?? null,
        },
    };
}
