import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'src', 'ui.js');
const SOURCE_BACKUP = path.join(ROOT, 'src', 'ui.js.bak-split');
const OUT_DIR = path.join(ROOT, 'src', 'ui');
const STAMP = '1.5.60-split3';

if (!existsSync(SOURCE_BACKUP)) copyFileSync(SOURCE_PATH, SOURCE_BACKUP);
const source = readFileSync(SOURCE_BACKUP, 'utf8').replace(/\r\n/g, '\n');

function mustIndex(haystack, needle, from = 0) {
    const index = haystack.indexOf(needle, from);
    if (index < 0) throw new Error(`Missing marker: ${JSON.stringify(needle).slice(0, 80)}`);
    return index;
}

function sliceExclusive(startMarker, endMarker) {
    const start = mustIndex(source, startMarker);
    const end = mustIndex(source, endMarker, start);
    return source.slice(start, end).replace(/\s+$/, '') + '\n';
}

function extractBacktickAfter(assignment) {
    const start = mustIndex(source, assignment);
    const tick = mustIndex(source, '`', start + assignment.length);
    const close = mustIndex(source, '`;', tick + 1);
    return source.slice(tick, close + 1);
}

mkdirSync(OUT_DIR, { recursive: true });

const runtimeJs = `// Split from ui.js — runtime.

export const SETTINGS_UI_VERSION = '1.12-layered-ui3-swipe1';
export const RUNTIME_VERSION = '1.5.60';

export function isCurrentRuntime() {
    return globalThis.__rabbitMirrorRuntimeVersion === RUNTIME_VERSION;
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
`;

const settingsDialog = extractBacktickAfter('const html = ');
const worldInfoPrompt = extractBacktickAfter('const worldInfoPromptHtml = ');
const tagFilterModal = extractBacktickAfter('const tagFilterModalHtml = ');

const settingsTemplateJs = `// Split from ui.js — settings HTML strings only.

import { INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT, VISUAL_AVOID_PROMPT_MAX_CHARS, VISUAL_EXTRA_PROMPT_MAX_CHARS, VISUAL_PROMPT_MAX_CHARS } from '../settings.js?rmv=1.5.60-fork1';
import { BEHAVIOR_RULE_MAX_CHARS } from '../behaviorRules.js?rmv=1.5.53-cn-boundary1';
import { RUNTIME_VERSION, SETTINGS_UI_VERSION } from './runtime.js?rmv=${STAMP}';

export function buildRabbitMirrorSettingsDialogHtml() {
    return ${settingsDialog};
}

export function buildWorldInfoPromptModalHtml() {
    return ${worldInfoPrompt};
}

export function buildTagFilterModalHtml() {
    return ${tagFilterModal};
}
`;

const worldInfoFns = sliceExclusive(
    'function worldInfoSourceLabel(value) {',
    'function independentApiProfileLabel(diagnostic) {',
);

const worldInfoBooksJs = `// Split from ui.js — worldbook list rendering and visibility.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { WORLD_INFO_BOOKS_CHANGED_EVENT, fetchWorldInfoBooks, getObservedWorldInfoBooks } from '../independentApi.js?rmv=1.5.63';
import { escapeHtml, isCurrentRuntime } from './runtime.js?rmv=${STAMP}';

let pulledWorldInfoBooks = [];
let worldInfoBookRenderTimer = 0;
let worldInfoBookVisibilityObserver = null;
let worldInfoBookCurrentVisible = false;
let worldInfoBookCurrentDirty = true;
const WORLD_INFO_BOOK_RENDER_DEBOUNCE_MS = 140;

${worldInfoFns}
export async function pullAllWorldInfoBooks() {
    pulledWorldInfoBooks = await fetchWorldInfoBooks();
    renderWorldInfoBookSettings({ current: false, all: true });
    return pulledWorldInfoBooks.length;
}

export function clearPulledWorldInfoBooks() {
    pulledWorldInfoBooks = [];
    renderWorldInfoBookSettings({ current: false, all: true });
}

export function attachWorldInfoBooksListener() {
    try { globalThis.__rabbitMirrorWorldInfoBooksUiCleanup?.(); } catch {}
    const worldInfoBooksListener = () => scheduleWorldInfoBookSettingsRender();
    globalThis.addEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
    globalThis.__rabbitMirrorWorldInfoBooksUiCleanup = () => globalThis.removeEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
}

export function resetWorldInfoBookUiState() {
    clearWorldInfoBookRenderTimer();
    disconnectWorldInfoBookVisibilityObserver();
    worldInfoBookCurrentDirty = true;
}

export {
    renderWorldInfoBookSettings,
    scheduleWorldInfoBookSettingsRender,
    installWorldInfoBookVisibilityObserver,
    clearCollapsedAllWorldInfoBookRows,
};
`;

const profileLabel = sliceExclusive(
    'function independentApiProfileLabel(diagnostic) {',
    'function independentModelPullSnapshotMatches(snapshot,state) {',
);
const diagnosticAndMeter = sliceExclusive(
    '// Display only: keep the exact IDs and original labels in the request/repair record.',
    'function renderMemoryScanResults(results) {',
);

const tokenMeterJs = `// Split from ui.js — Prompt meter and latest independent request diagnostic.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { getLastRabbitMirrorTokenRecordForSource, TOKEN_METER_EVENT } from '../tokenMeter.js?rmv=1.5.53-visualquick1';
import { API_REQUEST_DIAGNOSTIC_EVENT, getLastIndependentApiRequestDiagnostic } from '../independentApi.js?rmv=1.5.63';
import { escapeHtml } from './runtime.js?rmv=${STAMP}';

${profileLabel}${diagnosticAndMeter}
export function attachIndependentApiDiagnosticListener() {
    try { globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup?.(); } catch {}
    const independentDiagnosticListener = event => { renderIndependentApiDiagnostic(event?.detail || null); };
    globalThis.addEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
    globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup = () => globalThis.removeEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
}

export { renderTokenMeter, attachTokenMeterListener, renderIndependentApiDiagnostic };
`;

const ttDiagnosticsJs = `// Split from ui.js — TT diagnostic entry.

import { startTtSurfaceDiagnostics, stopTtSurfaceDiagnostics, isTtSurfaceDiagnosticsActive, buildTtSurfaceReport, recordTtSurface, registerTtSurfaceCleanup, nextTtSurfaceClickSeq } from '../ttSurfaceDiagnostics.js?rmv=1.5.53-cn-boundary1';
import { getRabbitMirrorHostCompatibilityStatus } from '../hostCompatibility.js?rmv=1.5.58-fork1';
import { RUNTIME_VERSION, isCurrentRuntime } from './runtime.js?rmv=${STAMP}';

${sliceExclusive(
    'let retainedTtDiagnosticReport = \'\';',
    'export function initRabbitMirrorUI() {',
).replace(/\s+$/, '')}

export { installTtDiagnosticEntry };
`;

writeFileSync(path.join(OUT_DIR, 'runtime.js'), runtimeJs);
writeFileSync(path.join(OUT_DIR, 'settingsTemplate.js'), settingsTemplateJs);
writeFileSync(path.join(OUT_DIR, 'worldInfoBooks.js'), worldInfoBooksJs);
writeFileSync(path.join(OUT_DIR, 'tokenMeter.js'), tokenMeterJs);
writeFileSync(path.join(OUT_DIR, 'ttDiagnostics.js'), ttDiagnosticsJs);

let next = source;
const replacements = [
    [
        `const SETTINGS_UI_VERSION = '1.12-layered-ui3-swipe1';
const RUNTIME_VERSION = '1.5.60';

function isCurrentRuntime() {
    return globalThis.__rabbitMirrorRuntimeVersion === RUNTIME_VERSION;
}
`,
        '',
    ],
    [
        `let pulledWorldInfoBooks = [];
let worldInfoBookRenderTimer = 0;
let worldInfoBookVisibilityObserver = null;
let worldInfoBookCurrentVisible = false;
let worldInfoBookCurrentDirty = true;
`,
        '',
    ],
    [
        `const WORLD_INFO_BOOK_RENDER_DEBOUNCE_MS = 140;

`,
        '',
    ],
    [
        `function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


`,
        '',
    ],
    [
        sliceExclusive('function worldInfoSourceLabel(value) {', 'function independentApiProfileLabel(diagnostic) {'),
        '',
    ],
    [
        sliceExclusive('function independentApiProfileLabel(diagnostic) {', 'function independentModelPullSnapshotMatches(snapshot,state) {'),
        '',
    ],
    [
        sliceExclusive(
            '// Display only: keep the exact IDs and original labels in the request/repair record.',
            'function renderMemoryScanResults(results) {',
        ),
        '',
    ],
    [
        sliceExclusive(
            'let retainedTtDiagnosticReport = \'\';',
            'export function initRabbitMirrorUI() {',
        ),
        '',
    ],
];

for (const [from, to] of replacements) {
    if (!next.includes(from)) throw new Error(`Rewrite block missing:\n${from.slice(0, 120)}`);
    next = next.replace(from, to);
}

if (!next.includes('const html = `')) throw new Error('settings dialog template missing');
next = next.replace(/const html = `[\s\S]*?<\/dialog>`;/, 'const html = buildRabbitMirrorSettingsDialogHtml();');
if (!next.includes('const worldInfoPromptHtml = `')) throw new Error('world info modal template missing');
next = next.replace(/const worldInfoPromptHtml = `[\s\S]*?<\/div>`;\r?\n    \$\(worldInfoPromptHtml\)\.appendTo\(document\.body\);/, '$(buildWorldInfoPromptModalHtml()).appendTo(document.body);');
if (!next.includes('const tagFilterModalHtml = `')) throw new Error('tag filter modal template missing');
next = next.replace(/const tagFilterModalHtml = `[\s\S]*?<\/div>`;\r?\n    \$\(tagFilterModalHtml\)\.appendTo\(document\.body\);/, '$(buildTagFilterModalHtml()).appendTo(document.body);');

const diagnosticListener = `    renderIndependentApiDiagnostic();
    try { globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup?.(); } catch {}
    const independentDiagnosticListener = event => { renderIndependentApiDiagnostic(event?.detail || null); };
    globalThis.addEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
    globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup = () => globalThis.removeEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
`;
if (!next.includes(diagnosticListener)) throw new Error('diagnostic listener block missing');
next = next.replace(diagnosticListener, `    renderIndependentApiDiagnostic();
    attachIndependentApiDiagnosticListener();
`);

const worldInfoListener = `    try { globalThis.__rabbitMirrorWorldInfoBooksUiCleanup?.(); } catch {}
    const worldInfoBooksListener = () => scheduleWorldInfoBookSettingsRender();
    globalThis.addEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
    globalThis.__rabbitMirrorWorldInfoBooksUiCleanup = () => globalThis.removeEventListener?.(WORLD_INFO_BOOKS_CHANGED_EVENT, worldInfoBooksListener);
`;
if (!next.includes(worldInfoListener)) throw new Error('world info listener block missing');
next = next.replace(worldInfoListener, `    attachWorldInfoBooksListener();
`);

const fetchBlock = `        try {
            pulledWorldInfoBooks = await fetchWorldInfoBooks();
            renderWorldInfoBookSettings({ current: false, all: true });
            status.text(\`已拉取 \${pulledWorldInfoBooks.length} 本\`);
            toastr?.success?.(\`已拉取 \${pulledWorldInfoBooks.length} 本世界书；列表保留在折叠区内\`);
        } catch (error) {
            pulledWorldInfoBooks = [];
            renderWorldInfoBookSettings({ current: false, all: true });
`;
if (!next.includes(fetchBlock)) throw new Error('world info fetch block missing');
next = next.replace(fetchBlock, `        try {
            const pulledCount = await pullAllWorldInfoBooks();
            status.text(\`已拉取 \${pulledCount} 本\`);
            toastr?.success?.(\`已拉取 \${pulledCount} 本世界书；列表保留在折叠区内\`);
        } catch (error) {
            clearPulledWorldInfoBooks();
`);

const destroyWorldInfo = `    clearWorldInfoBookRenderTimer();
    disconnectWorldInfoBookVisibilityObserver();
    worldInfoBookCurrentDirty = true;
`;
if (!next.includes(destroyWorldInfo)) throw new Error('destroy world info block missing');
next = next.replace(destroyWorldInfo, `    resetWorldInfoBookUiState();
`);

const extraImports = `import { SETTINGS_UI_VERSION, RUNTIME_VERSION, escapeHtml, isCurrentRuntime } from './ui/runtime.js?rmv=${STAMP}';
import { buildRabbitMirrorSettingsDialogHtml, buildWorldInfoPromptModalHtml, buildTagFilterModalHtml } from './ui/settingsTemplate.js?rmv=${STAMP}';
import { attachIndependentApiDiagnosticListener, attachTokenMeterListener, renderIndependentApiDiagnostic, renderTokenMeter } from './ui/tokenMeter.js?rmv=${STAMP}';
import { attachWorldInfoBooksListener, clearCollapsedAllWorldInfoBookRows, clearPulledWorldInfoBooks, installWorldInfoBookVisibilityObserver, pullAllWorldInfoBooks, renderWorldInfoBookSettings, resetWorldInfoBookUiState } from './ui/worldInfoBooks.js?rmv=${STAMP}';
import { installTtDiagnosticEntry } from './ui/ttDiagnostics.js?rmv=${STAMP}';

`;

next = extraImports + next;

writeFileSync(SOURCE_PATH, next);
console.log('wrote', SOURCE_PATH);
for (const name of ['runtime.js', 'settingsTemplate.js', 'tokenMeter.js', 'worldInfoBooks.js', 'ttDiagnostics.js']) {
    const file = path.join(OUT_DIR, name);
    console.log(String(readFileSync(file, 'utf8').split(/\r?\n/).length).padStart(6), name);
}
console.log(String(next.split(/\r?\n/).length).padStart(6), 'ui.js');
