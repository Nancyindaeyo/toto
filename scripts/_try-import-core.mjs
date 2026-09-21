import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(new URL('./_rmv-loader.mjs', import.meta.url));

const noop = () => {};
const chain = () => api;
const api = {
    length: 0,
    on: chain, off: chain, find: chain, attr: chain, append: chain, appendTo: chain,
    remove: chain, each: chain, filter: chain, val: chain, text: chain, html: chain,
    prop: chain, hide: chain, show: chain, parent: chain, data: chain, removeData: chain,
    addClass: chain, removeClass: chain, toggle: chain, css: chain, closest: chain,
    children: chain, eq: chain, first: chain, last: chain, empty: chain, trigger: chain,
};

globalThis.window = globalThis;
globalThis.self = globalThis;
globalThis.document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    removeEventListener: noop,
    createElement: () => ({
        style: {},
        classList: { add: noop, remove: noop, contains: () => false },
        setAttribute: noop,
        getAttribute: () => null,
        removeAttribute: noop,
        append: noop,
        appendChild: noop,
        addEventListener: noop,
        removeEventListener: noop,
        querySelector: () => null,
        querySelectorAll: () => [],
        closest: () => null,
        isConnected: false,
    }),
    documentElement: { style: {} },
    body: { append: noop, appendChild: noop },
    readyState: 'complete',
};
globalThis.HTMLElement = class HTMLElement {};
globalThis.Node = class Node {};
globalThis.DocumentFragment = class DocumentFragment {};
globalThis.MutationObserver = class { observe() {} disconnect() {} takeRecords() { return []; } };
globalThis.IntersectionObserver = class { observe() {} disconnect() {} };
globalThis.ResizeObserver = class { observe() {} disconnect() {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop });
globalThis.requestAnimationFrame = fn => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = id => clearTimeout(id);
globalThis.getComputedStyle = () => new Proxy({}, { get: () => '' });
globalThis.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
globalThis.sessionStorage = globalThis.localStorage;
globalThis.SillyTavern = { getContext: () => ({ chat: [], eventSource: { on: noop, off: noop, emit: noop } }) };
globalThis.toastr = { success: noop, error: noop, warning: noop, info: noop };
globalThis.jQuery = globalThis.$ = () => api;
globalThis.__rabbitMirrorRuntimeVersion = '1.5.62';
globalThis.CSS = { escape: String };
globalThis.DOMParser = class { parseFromString() { return globalThis.document; } };

async function tryImport(label, specifier) {
    try {
        await import(specifier);
        console.log('OK', label);
    } catch (error) {
        console.error('FAIL', label);
        console.error(error);
    }
}

await tryImport('outputSanitizer', new URL('../src/outputSanitizer.js', import.meta.url).href);
await tryImport('independentApi', new URL('../src/independentApi.js', import.meta.url).href);
await tryImport('ui', new URL('../src/ui.js', import.meta.url).href);
