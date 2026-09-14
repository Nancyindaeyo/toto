// Lossless storage encoding only; never used to shorten the prompt sent to a model.
// The frozen 15-bit dictionary and byte/character caps bound both memory and work.
const MAX_CHARS = 262144;
const MAX_BYTES = MAX_CHARS * 3;
const DICTIONARY_LIMIT = 32768;
const CODE_OFFSET = 32;

export function packBatchPlanText(text) {
    if (typeof text !== 'string' || text.length > MAX_CHARS) return null;
    const plain = { encoding: 'plain-v1', data: text };
    if (text.length < 64) return plain;
    try {
        if (typeof TextEncoder !== 'function' || typeof TextDecoder !== 'function') return plain;
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        // TextEncoder replaces lone surrogates; those must remain verbatim in plain storage.
        if (bytes.length > MAX_BYTES || new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes) !== text) return plain;
        const dictionary = new Map();
        const codes = [];
        let next = 256;
        let previous = bytes[0];
        for (let i = 1; i < bytes.length; i++) {
            const byte = bytes[i];
            const key = previous * 256 + byte;
            const found = dictionary.get(key);
            if (found !== undefined) {
                previous = found;
            } else {
                codes.push(String.fromCharCode(previous + CODE_OFFSET));
                if (next < DICTIONARY_LIMIT) dictionary.set(key, next++);
                previous = byte;
            }
        }
        codes.push(String.fromCharCode(previous + CODE_OFFSET));
        const packed = { encoding: 'lzw15-utf8-v1', data: codes.join('') };
        // Include JSON escaping/markers and improve both UTF-16 and UTF-8 quota accounting.
        const packedJson = JSON.stringify(packed);
        const plainJson = JSON.stringify(plain);
        return packed.data.length <= MAX_CHARS && packedJson.length < plainJson.length
            && encoder.encode(packedJson).length < encoder.encode(plainJson).length ? packed : plain;
    } catch {
        return plain;
    }
}

export function unpackBatchPlanText(value) {
    try {
        if (!value || typeof value !== 'object' || Array.isArray(value)
            || typeof value.data !== 'string' || value.data.length > MAX_CHARS) return null;
        if (value.encoding === 'plain-v1') return value.data;
        if (value.encoding !== 'lzw15-utf8-v1' || !value.data.length || typeof TextDecoder !== 'function') return null;

        const prefixes = new Uint16Array(DICTIONARY_LIMIT);
        const suffixes = new Uint8Array(DICTIONARY_LIMIT);
        const lengths = new Uint32Array(DICTIONARY_LIMIT);
        lengths.fill(1, 0, 256);
        const bytes = new Uint8Array(MAX_BYTES);
        let next = 256;
        let previous = value.data.charCodeAt(0) - CODE_OFFSET;
        if (previous < 0 || previous > 255) return null;
        let previousFirst = previous;
        let used = 1;
        bytes[0] = previous;
        for (let i = 1; i < value.data.length; i++) {
            const code = value.data.charCodeAt(i) - CODE_OFFSET;
            if (code < 0 || code > next || code >= DICTIONARY_LIMIT) return null;
            const special = code === next;
            // LZW's next-code case means previous sequence followed by its first byte.
            if (special) {
                prefixes[next] = previous;
                suffixes[next] = previousFirst;
                lengths[next++] = lengths[previous] + 1;
            }
            const length = lengths[code];
            if (!length || used + length > MAX_BYTES) return null;
            let position = used + length - 1;
            let prefix = code;
            while (prefix >= 256) {
                bytes[position--] = suffixes[prefix];
                prefix = prefixes[prefix];
            }
            bytes[position] = prefix;
            used += length;
            if (!special && next < DICTIONARY_LIMIT) {
                prefixes[next] = previous;
                suffixes[next] = prefix;
                lengths[next++] = lengths[previous] + 1;
            }
            previous = code;
            previousFirst = prefix;
        }
        const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes.subarray(0, used));
        return text.length <= MAX_CHARS ? text : null;
    } catch {
        return null;
    }
}
