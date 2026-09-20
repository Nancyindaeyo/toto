import { EXTERNAL_WORLD_BOOK_ERROR_CODES, ExternalWorldBookError } from './errors.js?rmv=1.5.53-cn-boundary1';
import { EXTERNAL_WORLD_BOOK_MAX_FILE_BYTES } from './schema.js?rmv=1.5.53-cn-boundary1';
import { normalizeFileWorldBook } from './normalize.js?rmv=1.5.53-cn-boundary1';

async function readFileText(file, maxBytes) {
    // Blob.text() always decodes UTF-8. Honor only explicit UTF-16 BOMs;
    // do not guess encodings or reinterpret the contents as JSON/HTML.
    if (typeof file?.arrayBuffer === 'function' && typeof TextDecoder !== 'undefined') {
        let bytes;
        try { bytes = new Uint8Array(await file.arrayBuffer()); }
        catch { throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED, '本地文件读取失败。'); }
        if (bytes.byteLength > maxBytes) {
            throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.FILE_TOO_LARGE, `本地文件超过 ${Math.round(maxBytes / 1024 / 1024)} MiB 安全上限。`);
        }
        const utf32 = bytes.length >= 4 && ((bytes[0] === 0xff && bytes[1] === 0xfe && bytes[2] === 0 && bytes[3] === 0)
            || (bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 0xfe && bytes[3] === 0xff));
        const encoding = bytes[0] === 0xff && bytes[1] === 0xfe ? 'utf-16le'
            : bytes[0] === 0xfe && bytes[1] === 0xff ? 'utf-16be' : 'utf-8';
        try {
            if (utf32) throw new Error('unsupported encoding');
            return new TextDecoder(encoding, { fatal: encoding !== 'utf-8' }).decode(bytes);
        } catch {
            throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED, '文件编码不支持或内容不完整；请另存为 UTF-8，或带 BOM 的 UTF-16 后重试。');
        }
    }
    if (typeof file?.text === 'function') return file.text();
    if (typeof FileReader === 'undefined') {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED, '当前浏览器无法读取本地文件。');
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED, '本地文件读取失败。'));
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.readAsText(file);
    });
}

function fileIdentity(file) {
    const name = String(file?.name || 'worldbook.json');
    const size = Number(file?.size || 0);
    const lastModified = Number(file?.lastModified || 0);
    return `${name}:${size}:${lastModified}`;
}

export function readPlainTextWorldBook(text, options = {}) {
    if (typeof text !== 'string' || !text.trim()) throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.ENTRY_CONTENT_INVALID, '请填写要导入的小剧场文字。');
    if (text.length > 1000000 || new TextEncoder().encode(text).byteLength > EXTERNAL_WORLD_BOOK_MAX_FILE_BYTES) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.FILE_TOO_LARGE, '单份纯文字最多 100 万字符、8 MiB；请分成较小的内容，不会自动截断。');
    }
    const name = String(options.name || '我的小剧场文字').trim().slice(0, 1000) || '我的小剧场文字';
    // A bounded identity only; never put the pasted body into light source metadata.
    let fingerprint = 2166136261, second = 5381;
    for (let i = 0; i < text.length; i++) { const code = text.charCodeAt(i); fingerprint = Math.imul(fingerprint ^ code, 16777619); second = Math.imul(second, 33) ^ code; }
    return normalizeFileWorldBook({ name, entries: [{ uid: 0, comment: name, content: text }] }, {
        sourceId: options.sourceId || `plain-text:${(fingerprint >>> 0).toString(36)}-${(second >>> 0).toString(36)}:${name}`,
        sourceName: name,
    });
}

async function readLocalFile(file, allowLibraryBackup = false) {
    if (!file || typeof file !== 'object') {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.READ_FAILED, '没有选择世界书文件。');
    }
    const name = String(file.name || '').trim();
    if (name && !/\.(?:json|txt|md)$/i.test(name)) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.FILE_TYPE_UNSUPPORTED, '支持 JSON 世界书，以及 TXT / MD 纯文字文件。');
    }
    const plain = /\.(?:txt|md)$/i.test(name);
    // Only the explicit local-import workflow may inspect JSON up to the
    // migration budget. Ordinary worldbooks remain limited to 8 MiB below.
    const maxBytes = allowLibraryBackup && !plain ? 32 * 1024 * 1024 : EXTERNAL_WORLD_BOOK_MAX_FILE_BYTES;
    const size = Number(file.size || 0);
    if (size > maxBytes) {
        throw new ExternalWorldBookError(
            EXTERNAL_WORLD_BOOK_ERROR_CODES.FILE_TOO_LARGE,
            `本地文件超过 ${Math.round(maxBytes / 1024 / 1024)} MiB 安全上限。`,
            { size },
        );
    }
    const text = await readFileText(file, maxBytes);
    const actualBytes = typeof text === 'string' && text.length <= maxBytes ? new TextEncoder().encode(text).byteLength : Infinity;
    if (actualBytes > maxBytes) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.FILE_TOO_LARGE, `本地文件超过 ${Math.round(maxBytes / 1024 / 1024)} MiB 安全上限。`);
    }
    if (plain) return { kind: 'worldbook', book: readPlainTextWorldBook(text, { name: name.replace(/\.(?:txt|md)$/i, ''), sourceId: fileIdentity(file) }) };
    let raw;
    try {
        raw = JSON.parse(text.replace(/^\uFEFF/, ''));
    } catch (cause) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.JSON_INVALID, '世界书 JSON 无法解析。', undefined, { cause });
    }
    // Never infer a backup from its filename (which users can rename). Its
    // explicit format marker selects the strict backup schema/ID validation.
    if (allowLibraryBackup && raw?.format === 'RabbitMirror.ExternalLibraries') {
        const { validateExternalLibraryBackup } = await import('./backup.js?rmv=1.5.53-text1');
        return { kind: 'backup', backup: validateExternalLibraryBackup(raw) };
    }
    if (size > EXTERNAL_WORLD_BOOK_MAX_FILE_BYTES || actualBytes > EXTERNAL_WORLD_BOOK_MAX_FILE_BYTES) {
        throw new ExternalWorldBookError(EXTERNAL_WORLD_BOOK_ERROR_CODES.FILE_TOO_LARGE, '普通世界书文件超过 8 MiB 安全上限；只有兔子镜整库迁移文件支持 32 MiB。');
    }
    return { kind: 'worldbook', book: normalizeFileWorldBook(raw, {
        fileName: name || 'worldbook.json',
        fileFingerprint: fileIdentity(file),
    }) };
}

export async function readLocalWorldBookFile(file) {
    return (await readLocalFile(file)).book;
}

export async function readLocalExternalImportFile(file) {
    return readLocalFile(file, true);
}
