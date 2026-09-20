import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
    assert.equal(loaded.RUNTIME_VERSION, '1.5.61');
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
});

test('geometry module owns face auto-width and remeasure', () => {
    const source = readFileSync(new URL('../src/independentApi/geometry.js', import.meta.url), 'utf8');
    assert.match(source, /export function remeasureRabbitMirrorFaceGeometry\(/);
    assert.match(source, /export function repairRabbitMirrorFaceAutoWidth\(/);
    assert.match(source, /export function undoRabbitMirrorFaceAutoWidth\(/);
    assert.doesNotMatch(source, /export function initIndependentRabbitMirror/);
    assert.doesNotMatch(source, /export async function testIndependentConnection/);
});
