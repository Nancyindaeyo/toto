import { listHostWorldBooks, readHostWorldBook } from './externalWorldBook/hostReader.js?rmv=1.5.51-narrow1';

const MAX_MEMORY_CHARS = 6000;
const MAX_MEMORY_ENTRIES = 24;
const MAX_WORLD_BOOK_ID_CHARS = 1000;

export function normalizeMemoryWorldBookId(value) {
    return typeof value === 'string' && value.length <= MAX_WORLD_BOOK_ID_CHARS && !/[\u0000\r\n]/.test(value)
        ? value.trim() : '';
}

export function memoryWorldBookBindingEnabled(settings) {
    return settings?.memoryScanEnabled === true && settings?.memoryWorldBookEnabled === true
        && !!normalizeMemoryWorldBookId(settings.memoryWorldBookId);
}

/** Explicit settings action only: the public host list returns a directory, not entry bodies. */
export async function listMemoryWorldBooks(options = {}) {
    const books = await listHostWorldBooks(options);
    return books.map(book => ({ fileId: book.fileId, displayName: book.displayName }));
}

function limitChars(maxChars) {
    return Math.max(600, Math.min(MAX_MEMORY_CHARS, Math.floor(Number(maxChars) || 2200)));
}

/** Bounded extraction in the host's supplied order; no entry is treated as a new instruction. */
export function extractMemoryWorldBookMaterial(book, maxChars = 2200) {
    const limit = limitChars(maxChars);
    const entries = Array.isArray(book?.entries) ? book.entries : [];
    const chunks = [];
    const seen = new Set();
    let usedChars = 0;
    let selectedEntries = 0;
    let omitted = false;
    for (const entry of entries) {
        if (entry?.disabled === true || typeof entry?.content !== 'string' || !entry.content) continue;
        if (selectedEntries >= MAX_MEMORY_ENTRIES || usedChars >= limit) { omitted = true; break; }
        // Only inspect text that can enter this request. Never retain the whole
        // normalized book or construct a second full-book string for the prompt.
        const remaining = limit - usedChars - (chunks.length ? 2 : 0);
        if (remaining <= 0) { omitted = true; break; }
        const text = entry.content.slice(0, remaining).trim();
        if (!text || seen.has(text)) continue;
        seen.add(text);
        chunks.push(text);
        usedChars += text.length + (chunks.length > 1 ? 2 : 0);
        selectedEntries++;
        if (entry.content.length > remaining) { omitted = true; break; }
    }
    return {
        providerId: `worldbook:${String(book?.sourceId || '')}`,
        providerName: `记忆世界书：${String(book?.sourceName || book?.sourceId || '已绑定世界书').slice(0, 100)}`,
        text: chunks.join('\n\n'),
        coverage: omitted ? { complete: false, reason: 'worldbook-material-limit' } : null,
        selectedEntries,
    };
}

/** Called only after I.1 has been selected for a real generation. No cache or polling. */
export async function readBoundMemoryWorldBook(settings, maxChars = 2200, options = {}) {
    if (!memoryWorldBookBindingEnabled(settings)) return null;
    const fileId = normalizeMemoryWorldBookId(settings.memoryWorldBookId);
    // SillyTavern's existing public endpoint returns one complete selected book;
    // it does not expose per-entry reads. Only the bounded material escapes this
    // function, and neither the response nor the book is persisted or cached.
    const book = await readHostWorldBook({ fileId }, options);
    return extractMemoryWorldBookMaterial(book, maxChars);
}
