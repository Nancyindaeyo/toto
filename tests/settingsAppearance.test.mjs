import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadAppearance() {
    const source = readFileSync(new URL('../src/settingsAppearance.js', import.meta.url), 'utf8')
        .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*/gm, '')
        .replace(/^export /gm, '');
    const context = vm.createContext({
        console,
        Object,
        JSON,
        Set,
        WeakMap,
        Map,
    });
    context.globalThis = context;
    vm.runInContext(`${source}\nObject.assign(globalThis, { UI_THEMES, normalizeAppearance, applyAppearanceTheme, APPEARANCE_STORAGE_KEY });`, context);
    return context;
}

const expected = [
    ['default', '#f5f4fb', '#ffffff', '#34495d', '#586b7c', '#ce729c', '#58a59e', '#cfdae5'],
    ['night', '#171d28', '#232c3a', '#edf1f8', '#b8c5d6', '#d9a8c1', '#90c9c5', '#455269'],
    ['gs1', '#edf6e5', '#ffffff', '#234831', '#50624d', '#43833d', '#e7b83b', '#bad7a7'],
    ['gs2', '#e9f3ff', '#ffffff', '#233d61', '#52647d', '#287dc3', '#9b79c8', '#b4d2ee'],
    ['gs3', '#fff0f5', '#ffffff', '#572c43', '#78536a', '#cc4d87', '#68a97d', '#edb6cf'],
    ['gs4', '#fff1d9', '#fffefd', '#553b24', '#74604b', '#c77425', '#5096c8', '#e9ca94'],
];
for (const [id, ...colors] of expected) test(`UI theme ${id} retains the supplied Hearttrace palette`, () => {
    const theme = loadAppearance().UI_THEMES.find(item => item.id === id);
    assert.ok(theme);
    assert.deepEqual(['background', 'surface', 'text', 'muted', 'accent', 'accentAlt', 'border'].map(key => theme.palette[key]), colors);
});

test('missing appearance preferences keep host theme without changing generation settings', () => {
    const { normalizeAppearance } = loadAppearance();
    assert.equal(normalizeAppearance(null).mode, 'host');
    assert.deepEqual(Object.keys(normalizeAppearance(null)).sort(), ['custom', 'mode']);
});

test('custom palette roundtrips and reading it does not mutate the input', () => {
    const { normalizeAppearance } = loadAppearance();
    const source = { mode: 'custom', custom: Object.fromEntries(['background', 'surface', 'text', 'muted', 'accent', 'accentAlt', 'border'].map(key => [key, '#123456'])) };
    const original = JSON.stringify(source);
    assert.equal(JSON.stringify(normalizeAppearance(source)), original);
    assert.equal(JSON.stringify(source), original);
});

test('corrupt saved appearance is recoverable and arbitrary CSS is not accepted as a colour', () => {
    const { normalizeAppearance } = loadAppearance();
    const source = { mode: 'missing-theme', custom: { background: 'url(https://example.invalid/track)', text: '#112233' } };
    const original = JSON.stringify(source);
    const normalized = normalizeAppearance(source);
    assert.equal(normalized.mode, 'host');
    assert.equal(normalized.custom.background, '#f5f4fb');
    assert.equal(normalized.custom.text, '#112233');
    assert.equal(JSON.stringify(source), original);
});

function fakeTarget() {
    const props = new Map();
    return {
        dataset: {},
        style: {
            setProperty: (key, value) => props.set(key, value),
            removeProperty: key => { props.delete(key); },
            getPropertyValue: key => props.get(key) || '',
        },
        props,
    };
}

test('applyAppearanceTheme mirrors the workbench tokens onto outside panels (host mode)', () => {
    const { applyAppearanceTheme, normalizeAppearance } = loadAppearance();
    const target = fakeTarget();
    applyAppearanceTheme(target, normalizeAppearance(null));
    assert.equal(target.dataset.rhTheme, 'host');
    assert.equal(target.props.get('--rh-bg'), 'var(--SmartThemeBlurTintColor, #f5f4fb)');
    assert.equal(target.props.get('--rh-card'), 'var(--SmartThemeBlurTintColor, #ffffff)');
    assert.equal(target.props.has('--SmartThemeBlurTintColor'), false, 'host mode never overrides host SmartTheme variables');
});

test('applyAppearanceTheme applies preset and custom palettes to outside panels', () => {
    const { applyAppearanceTheme, normalizeAppearance } = loadAppearance();
    const target = fakeTarget();
    applyAppearanceTheme(target, normalizeAppearance({ mode: 'night' }));
    assert.equal(target.dataset.rhTheme, 'night');
    assert.equal(target.props.get('--rh-card'), '#232c3a');
    assert.equal(target.props.get('--SmartThemeBlurTintColor'), 'var(--rh-card)');
    assert.equal(target.props.get('--SmartThemeBodyColor'), 'var(--rh-text)');
    const custom = fakeTarget();
    const customState = normalizeAppearance({ mode: 'custom', custom: { surface: '#123456' } });
    applyAppearanceTheme(custom, customState);
    assert.equal(custom.props.get('--rh-card'), '#123456');
});
