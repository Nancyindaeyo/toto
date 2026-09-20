import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadRuntime() {
    const source = readFileSync(new URL('../src/independentApi/runtime.js', import.meta.url), 'utf8')
        .replace(/^export /gm, '');
    const context = vm.createContext({
        console,
        TextEncoder,
        Set,
        Date,
    });
    context.globalThis = context;
    vm.runInContext(`${source}\nObject.assign(globalThis, { RUNTIME_VERSION, byteLength, hashText, currentRuntime });`, context);
    return context;
}

test('independentApi runtime loads without flights, connection, or the barrel', () => {
    const loaded = loadRuntime();
    assert.equal(loaded.RUNTIME_VERSION, '1.5.67');
    assert.equal(typeof loaded.byteLength, 'function');
    assert.equal(typeof loaded.flightIdentity, 'undefined');
    assert.equal(typeof loaded.initIndependentRabbitMirror, 'undefined');
    assert.equal(typeof loaded.fetchIndependentModels, 'undefined');
});

test('byteLength counts UTF-8 bytes and hashText is stable', () => {
    const { byteLength, hashText } = loadRuntime();
    assert.equal(byteLength('ab'), 2);
    assert.equal(byteLength('镜'), 3);
    assert.equal(hashText('same'), hashText('same'));
    assert.notEqual(hashText('a'), hashText('b'));
});

test('connection profile helpers stay with the documented connection cut', () => {
    const source = readFileSync(new URL('../src/independentApi/connection.js', import.meta.url), 'utf8');
    assert.match(source, /export async function testIndependentConnection\(/);
    assert.match(source, /export async function fetchIndependentModels\(/);
    assert.match(source, /function profileUsesTemperature\(/);
    assert.match(source, /export function profileTokenField\(/);
    assert.doesNotMatch(source, /export function initIndependentRabbitMirror/);
    assert.doesNotMatch(source, /export function repairRabbitMirrorFaceAutoWidth/);
    assert.doesNotMatch(source, /export \{[^}]*scanCurrentChatIndependentContextTags/);
    assert.doesNotMatch(source, /export \{[^}]*API_REQUEST_DIAGNOSTIC_EVENT/);
    assert.match(source, /export async function scanCurrentChatIndependentContextTags\(/);
    assert.match(source, /export const API_REQUEST_DIAGNOSTIC_EVENT/);
});

test('geometry module owns face auto-width and remeasure', () => {
    const source = readFileSync(new URL('../src/independentApi/geometry.js', import.meta.url), 'utf8');
    assert.match(source, /export function remeasureRabbitMirrorFaceGeometry\(/);
    assert.match(source, /export function repairRabbitMirrorFaceAutoWidth\(/);
    assert.match(source, /export function undoRabbitMirrorFaceAutoWidth\(/);
    assert.doesNotMatch(source, /export function initIndependentRabbitMirror/);
    assert.doesNotMatch(source, /export async function testIndependentConnection/);
});

test('imported setter wraps do not leave a stray paren after an opening brace', () => {
    const dir = new URL('../src/independentApi/', import.meta.url);
    for (const name of readdirSync(dir).filter(file => file.endsWith('.js'))) {
        const source = readFileSync(new URL(name, dir), 'utf8');
        assert.doesNotMatch(source, /\{\r\)/, `${name} has a first-line setter wrap leftover`);
        assert.doesNotMatch(source, /write[A-Z][A-Za-z]*\([^;\n]*\{\s*\)/, `${name} has a broken setter wrap`);
    }
});

test('imported lets are not mutated with ++/--/+=/-=', () => {
    const dir = new URL('../src/independentApi/', import.meta.url);
    const files = readdirSync(dir).filter(file => file.endsWith('.js'));
    const exportedLets = new Map();
    const importRe = /import\s+\{([\s\S]*?)\}\s*from\s*['"]\.\/([A-Za-z]+)\.js\?rmv=[^'"]+['"]/g;
    for (const name of files) {
        const source = readFileSync(new URL(name, dir), 'utf8');
        for (const match of source.matchAll(/^export let ([A-Za-z_$][\w$]*)\s*=/gm)) {
            exportedLets.set(`${name.replace(/\.js$/, '')}:${match[1]}`, true);
        }
    }
    for (const name of files) {
        const source = readFileSync(new URL(name, dir), 'utf8');
        const localModule = name.replace(/\.js$/, '');
        for (const match of source.matchAll(importRe)) {
            const from = match[2];
            if (from === localModule) continue;
            for (const part of match[1].split(',')) {
                const piece = part.trim();
                if (!piece) continue;
                const alias = piece.match(/^(?:([A-Za-z_$][\w$]*)\s+as\s+)?([A-Za-z_$][\w$]*)$/);
                if (!alias) continue;
                const exported = alias[1] || alias[2];
                const local = alias[2];
                if (!exportedLets.has(`${from}:${exported}`)) continue;
                const mutated = new RegExp(`(?:(?:^|[^.\\w$])(?:\\+\\+|--)${local}\\b|(?:^|[^.\\w$])${local}\\s*(?:\\+\\+|--|\\+=|-=|=(?!=)))`);
                assert.equal(mutated.test(source), false, `${name} mutates imported let ${local} from ${from}.js`);
            }
        }
    }
});
