import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function readUi(name) {
    return readFileSync(new URL(`../src/ui/${name}`, import.meta.url), 'utf8');
}

function loadRuntime() {
    const source = readUi('runtime.js').replace(/^export /gm, '');
    const context = vm.createContext({});
    context.globalThis = context;
    vm.runInContext(`${source}\nObject.assign(globalThis, { SETTINGS_UI_VERSION, RUNTIME_VERSION, isCurrentRuntime, escapeHtml });`, context);
    return context;
}

test('ui runtime loads without settings, independentApi, or the ui barrel', () => {
    const loaded = loadRuntime();
    assert.equal(loaded.RUNTIME_VERSION, '1.5.65');
    assert.equal(loaded.SETTINGS_UI_VERSION, '1.12-layered-ui3-swipe1');
    assert.equal(loaded.escapeHtml('<a "b">'), '&lt;a &quot;b&quot;&gt;');
    loaded.__rabbitMirrorRuntimeVersion = '1.5.65';
    assert.equal(loaded.isCurrentRuntime(), true);
    loaded.__rabbitMirrorRuntimeVersion = 'other';
    assert.equal(loaded.isCurrentRuntime(), false);
    assert.equal(typeof loaded.initRabbitMirrorUI, 'undefined');
    assert.equal(typeof loaded.buildRabbitMirrorSettingsDialogHtml, 'undefined');
});

test('settings template keeps mount ids and does not own event bindings', () => {
    const source = readUi('settingsTemplate.js');
    assert.match(source, /id="rh_enabled"/);
    assert.match(source, /id="rh_token_meter"/);
    assert.match(source, /id="rh_tt_diag_start"/);
    assert.match(source, /id="rh_world_info_book_filters"/);
    assert.match(source, /id="rh_visual_avoid_prompt"/);
    assert.match(source, /id="rh_world_info_prompt_modal"/);
    assert.match(source, /id="rh_independent_tag_filter_modal"/);
    assert.doesNotMatch(source, /export function initRabbitMirrorUI/);
    assert.doesNotMatch(source, /\$\('#rh_enabled'\)\.on\(/);
});

test('token meter module owns prompt estimate and latest-request rendering', () => {
    const source = readUi('tokenMeter.js');
    assert.match(source, /function renderTokenMeter\(/);
    assert.match(source, /function renderIndependentApiDiagnostic\(/);
    assert.match(source, /export function attachIndependentApiDiagnosticListener\(/);
    assert.doesNotMatch(source, /export function initRabbitMirrorUI/);
    assert.doesNotMatch(source, /function installTtDiagnosticEntry\(/);
});

test('world info module owns list rendering and visibility observer', () => {
    const source = readUi('worldInfoBooks.js');
    assert.match(source, /function renderWorldInfoBookSettings\(/);
    assert.match(source, /new IntersectionObserver/);
    assert.match(source, /export async function pullAllWorldInfoBooks\(/);
    assert.doesNotMatch(source, /export function initRabbitMirrorUI/);
    assert.doesNotMatch(source, /function installTtDiagnosticEntry\(/);
});

test('TT diagnostics stay out of the settings template and barrel bindings', () => {
    const source = readUi('ttDiagnostics.js');
    assert.match(source, /function installTtDiagnosticEntry\(/);
    assert.match(source, /function bindTtDiagnosticTap\(/);
    assert.doesNotMatch(source, /export function initRabbitMirrorUI/);
    assert.doesNotMatch(source, /function renderTokenMeter\(/);
});

test('ui.js keeps mount/destroy and no longer embeds the settings dialog HTML', () => {
    const source = readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8');
    assert.match(source, /export function initRabbitMirrorUI\(/);
    assert.match(source, /export function destroyRabbitMirrorUI\(/);
    assert.match(source, /const html = buildRabbitMirrorSettingsDialogHtml\(\);/);
    assert.doesNotMatch(source, /id="rh_visual_avoid_prompt"/);
    assert.doesNotMatch(source, /id="rh_tt_diag_start"/);
    assert.match(source, /from '\.\/ui\/runtime\.js\?rmv=1\.5\.65'/);
});
