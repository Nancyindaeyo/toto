import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/batchPlanCodec.js', import.meta.url), 'utf8');
const { packBatchPlanText, unpackBatchPlanText } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const MAX_CHARS = 262144;
const encoded = (...codes) => ({ encoding: 'lzw15-utf8-v1', data: String.fromCharCode(...codes.map(code => code + 32)) });

test('exact JSON round trip retains property order, Unicode, escapes and five full plans', () => {
    const face = { theme: '雨の夜 🌧️', form: '翻页', ui: '雪と灯り', interaction: '打开／关闭', rules: '这是完整的生成要求。日本語 😀 " \\ \n\t'.repeat(250) };
    const text = JSON.stringify({ z: 'first', faces: Array.from({ length: 5 }, (_, i) => ({ ...face, index: i })), a: 'last' });
    const packed = packBatchPlanText(text);
    assert.equal(packed.encoding, 'lzw15-utf8-v1');
    assert.ok(JSON.stringify(packed).length < text.length / 3);
    assert.equal(unpackBatchPlanText(JSON.parse(JSON.stringify(packed))), text);
});

test('empty, tiny and lone surrogate inputs retain exact plain text', () => {
    for (const text of ['', 'a', '{}', '\ud800', '\udfff'.repeat(1000)]) {
        assert.deepEqual(packBatchPlanText(text), { encoding: 'plain-v1', data: text });
        assert.equal(unpackBatchPlanText(packBatchPlanText(text)), text);
    }
});

test('fixed independent LZW example decodes ABABABA, including next-code special case', () => {
    assert.equal(unpackBatchPlanText(encoded(65, 66, 256, 258)), 'ABABABA');
    assert.equal(unpackBatchPlanText(encoded(0xef, 0xbb, 0xbf, 65)), '\ufeffA');
    const leadingBom = '\ufeff' + '原文'.repeat(1000);
    assert.equal(unpackBatchPlanText(packBatchPlanText(leadingBom)), leadingBom);
});

test('incompressible ASCII falls back to plain and growing random Unicode round trips', () => {
    let seed = 19;
    const next = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0);
    const text = Array.from({ length: 128 }, () => String.fromCharCode(32 + next() % 95)).join('');
    assert.equal(packBatchPlanText(text).encoding, 'plain-v1');
    for (const length of [200, 5000, 262144]) {
        const value = Array.from({ length }, () => String.fromCharCode(32 + next() % 55000)).join('');
        const packed = packBatchPlanText(value);
        assert.equal(unpackBatchPlanText(packed), value);
    }
});

test('full dictionary freeze remains lossless for a large mixed input', () => {
    let seed = 3;
    const noise = Array.from({ length: 120000 }, () => {
        seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
        return String.fromCharCode(32 + (seed >>> 9) % 95);
    }).join('');
    // Learn a repetitive phrase before the random middle fills the dictionary.
    const repeated = 'Keep the entire theme, presentation, UI and interaction unchanged. '.repeat(1200);
    const text = repeated.slice(0, 70000) + noise + repeated.slice(0, MAX_CHARS - 190000);
    const packed = packBatchPlanText(text);
    assert.equal(packed.encoding, 'lzw15-utf8-v1');
    assert.ok(packed.data.length > 32768, 'decode continues beyond dictionary capacity');
    const packedJson = JSON.stringify(packed);
    const plainJson = JSON.stringify({ encoding: 'plain-v1', data: text });
    assert.ok(packedJson.length < plainJson.length);
    assert.ok(Buffer.byteLength(packedJson, 'utf8') < Buffer.byteLength(plainJson, 'utf8'));
    assert.equal(unpackBatchPlanText(packed), text);
});

test('compression that saves UTF-16 units but expands UTF-8 storage uses plain', () => {
    let seed = 3;
    const text = Array.from({ length: 100000 }, () => {
        seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
        return String.fromCharCode(32 + (seed >>> 9) % 95);
    }).join('');
    assert.equal(packBatchPlanText(text).encoding, 'plain-v1');
    assert.equal(unpackBatchPlanText(packBatchPlanText(text)), text);
});

test('maximum character boundary works and excess inputs are rejected', () => {
    for (const char of ['a', '字']) {
        const text = char.repeat(MAX_CHARS);
        assert.equal(unpackBatchPlanText(packBatchPlanText(text)), text);
    }
    assert.equal(packBatchPlanText('a'.repeat(MAX_CHARS + 1)), null);
    assert.equal(unpackBatchPlanText({ encoding: 'plain-v1', data: 'a'.repeat(MAX_CHARS + 1) }), null);
    assert.equal(packBatchPlanText(null), null);
});

test('malformed, unknown, invalid UTF8 and over-expanding compressed input fail closed', () => {
    for (const value of [null, {}, [], { encoding: 'unknown', data: 'a' }, { encoding: 'plain-v1', data: 4 },
        { encoding: 'lzw15-utf8-v1', data: '' }, encoded(256), encoded(65, 258), encoded(65500), encoded(-1),
        encoded(0xc3), encoded(0xff), encoded(0xe6, 0xbc), { encoding: 'lzw15-utf8-v1', data: 'A'.repeat(MAX_CHARS + 1) }]) {
        assert.equal(unpackBatchPlanText(value), null);
    }
    // Each code adds one byte to the previous sequence: bounded stream, excessive expansion.
    const bomb = encoded(65, ...Array.from({ length: 1300 }, (_, i) => 256 + i));
    assert.equal(unpackBatchPlanText(bomb), null);
});

test('missing browser text codecs keep plain storage available', () => {
    const encoder = globalThis.TextEncoder;
    const decoder = globalThis.TextDecoder;
    try {
        globalThis.TextEncoder = undefined;
        globalThis.TextDecoder = undefined;
        const text = '字'.repeat(500);
        assert.deepEqual(packBatchPlanText(text), { encoding: 'plain-v1', data: text });
        assert.equal(unpackBatchPlanText({ encoding: 'plain-v1', data: text }), text);
        assert.equal(unpackBatchPlanText(encoded(65, 66)), null);
    } finally {
        globalThis.TextEncoder = encoder;
        globalThis.TextDecoder = decoder;
    }
});
