import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'src', 'independentApi.js');
const SOURCE_BACKUP = path.join(ROOT, 'src', 'independentApi.js.bak-split');
const OUT_DIR = path.join(ROOT, 'src', 'independentApi');
const STAMP = '1.5.60-split2';

const MODULE_ORDER = [
    'runtime',
    'flights',
    'persistence',
    'faceSwipe',
    'connection',
    'request',
    'geometry',
    'mount',
    'earlyBody',
    'lifecycle',
];

const MODULE_RANK = Object.fromEntries(MODULE_ORDER.map((name, index) => [name, index]));

const FORCE_RUNTIME = new Set([
    'RUNTIME_VERSION',
    'currentRuntime',
    'byteLength',
    'getContext',
    'hashText',
    'SOURCE_ATTR',
    'EXTERNAL_SHELL_ATTR',
    'INLINE_ANCHOR_ATTR',
    'FOLLOW_EXTERNAL_ANCHOR_ATTR',
    'FOLLOW_ORIGIN_ATTR',
    'RESAY_ATTR',
    'RESAY_EVENT',
    'HISTORY_EVENT',
    'INDEPENDENT_REPAIR_PERSIST_EVENT',
    'INDEPENDENT_LIVE_REPAIR_ATTR',
    'INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR',
    'independentMaintenanceLiveRepairLocked',
    'EPHEMERAL_FAILURE_ATTR',
    'EPHEMERAL_FAILURE_BODY_ATTR',
    'ACTION_BRIDGE_KEY',
    'INDEPENDENT_GENERATION_INTENTS_KEY',
    'INDEPENDENT_GENERATION_STOPS_KEY',
    'INDEPENDENT_GENERATION_INTENT_TTL_MS',
    'INDEPENDENT_GENERATION_INTENT_TYPES',
    'HISTORICAL_LIGHT_HOST_ATTR',
    'CONTEXT_TRANSCRIPT_BUDGET',
    'CONTEXT_TOTAL_BUDGET',
    'MAX_INDEPENDENT_REQUEST_CHARS',
]);

const FORCE_MODULE = {
    // flights
    pending: 'flights',
    automaticFailureStops: 'flights',
    AUTOMATIC_FAILURE_STOP_LIMIT: 'flights',
    automaticFailureKey: 'flights',
    automaticFailureStopFor: 'flights',
    hasAutomaticFailureStop: 'flights',
    markAutomaticFailureStop: 'flights',
    clearAutomaticFailureStop: 'flights',
    clearAutomaticFailureStops: 'flights',
    GLOBAL_FLIGHT_KEY: 'flights',
    GLOBAL_DISPATCH_LEASE_KEY: 'flights',
    GLOBAL_OPERATION_EPOCH_KEY: 'flights',
    LEGACY_GLOBAL_FLIGHT_KEYS: 'flights',
    INDEPENDENT_REQUEST_IDLE_TIMEOUT_MS: 'flights',
    INDEPENDENT_REQUEST_ABSOLUTE_TIMEOUT_MS: 'flights',
    createIndependentRequestDeadline: 'flights',
    globalFlights: 'flights',
    flightIdentity: 'flights',
    globalDispatchLeases: 'flights',
    globalOperationEpochs: 'flights',
    automaticDispatchAlreadyConsumed: 'flights',
    generationPolls: 'flights',
    HOST_GENERATION_EVENT_HINT_MS: 'flights',
    GENERATION_PLACEHOLDER_POLL_LIMIT_MS: 'flights',
    GENERATION_PLACEHOLDER_POLL_INTERVAL_MS: 'flights',
    OWNER_REATTACH_WAIT_MS: 'flights',
    ACTIVE_GENERATION_WAIT_MS: 'flights',
    HOST_FINAL_PROOF_WAIT_MS: 'flights',
    WEAK_GENERATION_FLAG_GRACE_MS: 'flights',
    WEAK_GENERATION_SOURCE_STABLE_WAIT_MS: 'flights',
    SOURCE_STABLE_WAIT_MS: 'flights',
    FINAL_RENDER_SOURCE_STABLE_WAIT_MS: 'flights',
    FINAL_RENDER_POLL_INTERVAL_MS: 'flights',
    FINAL_RENDER_CONFIRMATION_TTL_MS: 'flights',
    // persistence
    STORE_KEY: 'persistence',
    INTERACTION_STATE_MIGRATION_KEY: 'persistence',
    OWNER_LOCK_STORE_KEY: 'persistence',
    HISTORY_STORE_KEY: 'persistence',
    CHAT_OUTPUT_METADATA_KEY: 'persistence',
    CHAT_OUTPUT_METADATA_SCHEMA: 'persistence',
    HISTORY_PANEL_ATTR: 'persistence',
    OUTPUT_STORE_BUDGET_BYTES: 'persistence',
    HISTORY_STORE_BUDGET_BYTES: 'persistence',
    INDEPENDENT_HTML_BUDGET_BYTES: 'persistence',
    INDEPENDENT_RECORD_BUDGET_BYTES: 'persistence',
    INDEPENDENT_RAW_MARKUP_BUDGET_CHARS: 'persistence',
    INDEPENDENT_MAX_TAGS: 'persistence',
    INDEPENDENT_MAX_APPROX_DEPTH: 'persistence',
    INDEPENDENT_MAX_ATTRIBUTES: 'persistence',
    INDEPENDENT_MAX_CSS_CHARS: 'persistence',
    INDEPENDENT_MAX_CSS_RULES: 'persistence',
    INDEPENDENT_MAX_DATA_URI_CHARS: 'persistence',
    storageWarningShown: 'persistence',
    independentRecordWithinBudget: 'persistence',
    warnStorageTrimmed: 'persistence',
    readStore: 'persistence',
    compactOutputStore: 'persistence',
    writeStore: 'persistence',
    emptyHistoryStore: 'persistence',
    readHistoryStore: 'persistence',
    compactHistoryStore: 'persistence',
    historyEntriesForSlot: 'persistence',
    migrateLegacyDeletedRecords: 'persistence',
    // faceSwipe
    independentRerollMax: 'faceSwipe',
    independentSwipeFaceIndex: 'faceSwipe',
    independentSwipeDetails: 'faceSwipe',
    scrubSwipeDetailsHtml: 'faceSwipe',
    faceDetailsListFromHtml: 'faceSwipe',
    mergeFaceDetailsIntoHtml: 'faceSwipe',
    seedIndependentFaceSwipes: 'faceSwipe',
    seedIndependentFaceSwipesFromIdentity: 'faceSwipe',
    appendIndependentFaceSwipe: 'faceSwipe',
    clearEphemeralFaceFailure: 'faceSwipe',
    hasEphemeralFaceFailure: 'faceSwipe',
    showEphemeralFaceFailure: 'faceSwipe',
    writeIndependentOwnerHtml: 'faceSwipe',
    // connection
    API_PROFILE_STORE_KEY: 'connection',
    API_REQUEST_DIAGNOSTIC_STORE_KEY: 'connection',
    API_REQUEST_DIAGNOSTIC_EVENT: 'connection',
    WORLD_INFO_BOOK_CACHE_KEY: 'connection',
    WORLD_INFO_BOOK_CACHE_LIMIT: 'connection',
    WORLD_INFO_BOOKS_CHANGED_EVENT: 'connection',
    INDEPENDENT_MODEL_LIST_TIMEOUT_MS: 'connection',
    WORLD_INFO_BOOK_LIST_TIMEOUT_MS: 'connection',
    API_PROFILE_SCHEMA: 'connection',
    API_PROFILE_ORDER: 'connection',
    DEGRADED_PROFILE_RECHECK_MS: 'connection',
    STAGED_PROFILE_TTL_MS: 'connection',
    hostModule: 'connection',
    hostOpenAiModule: 'connection',
    cachedSillyTavernVersion: 'connection',
    globalWorldInfoSnapshots: 'connection',
    activeGlobalWorldInfoCapture: 'connection',
    observedWorldInfoBooks: 'connection',
    observedWorldInfoBookCacheLoaded: 'connection',
    GLOBAL_WORLD_INFO_SNAPSHOT_TTL_MS: 'connection',
    GLOBAL_WORLD_INFO_SNAPSHOT_LIMIT: 'connection',
    GLOBAL_WORLD_INFO_CONTEXT_BUDGET: 'connection',
    GLOBAL_WORLD_INFO_OWNER_GENERATION_TYPES: 'connection',
    INDEPENDENT_VISIBLE_TEXT_CACHE_LIMIT: 'connection',
    lastIndependentModelListDiagnostic: 'connection',
    scanCurrentChatIndependentContextTags: 'connection',
    getLastIndependentApiRequestDiagnostic: 'connection',
    getIndependentConnectionProfiles: 'connection',
    importCurrentSillyTavernConnection: 'connection',
    getIndependentSavedModels: 'connection',
    getObservedWorldInfoBooks: 'connection',
    fetchWorldInfoBooks: 'connection',
    getLastIndependentModelListDiagnostic: 'connection',
    fetchIndependentModels: 'connection',
    testIndependentConnection: 'connection',
    // geometry
    externalGeometryFrame: 'geometry',
    externalGeometryTimer: 'geometry',
    externalGeometryLastSignature: 'geometry',
    externalGeometryListenersInstalled: 'geometry',
    externalGeometryCycleSequence: 'geometry',
    externalGeometryLifecycleEpoch: 'geometry',
    externalGeometryLifecycleReason: 'geometry',
    externalGeometryOwnerNodes: 'geometry',
    remeasureRabbitMirrorFaceGeometry: 'geometry',
    undoRabbitMirrorFaceAutoWidth: 'geometry',
    repairRabbitMirrorFaceAutoWidth: 'geometry',
    // mount
    generationSequence: 'mount',
    historicalRestoreLightDepth: 'mount',
    withHistoricalRestoreLightPass: 'mount',
    historicalRestoreLightPassActive: 'mount',
    historicalLightHost: 'mount',
    markHistoricalLightHostForRestore: 'mount',
    orphanExternalHostTimers: 'mount',
    messageSourceRevisions: 'mount',
    externalFaceDetails: 'mount',
    serializeExternalFaceDetails: 'mount',
    independentDisplayMode: 'mount',
    lastIndependentDisplayMode: 'mount',
    consumeIndependentDisplayModeChange: 'mount',
    independentPlacementForState: 'mount',
    independentRejectedFacePreviews: 'mount',
    INDEPENDENT_REJECTED_PREVIEW_MAX_ENTRIES: 'mount',
    INDEPENDENT_REJECTED_PREVIEW_MAX_CHARS: 'mount',
    independentRejectedPreviewChars: 'mount',
    independentRejectedPreviewSequence: 'mount',
    independentRejectedFaceControlsWired: 'mount',
    clearIndependentRejectedFacePreviews: 'mount',
    externalHostSyncIndex: 'mount',
    hydrateIndependentFavoriteHtml: 'mount',
    containFavoriteHostLayout: 'mount',
    // earlyBody
    earlyBodyParserPromise: 'earlyBody',
    earlyBodyParser: 'earlyBody',
    earlyBodyProbeTimer: 'earlyBody',
    earlyBodyProbeSequence: 'earlyBody',
    // lifecycle
    observer: 'lifecycle',
    syncRunning: 'lifecycle',
    lastIndependentRequestConfig: 'lifecycle',
    hostGenerationInProgress: 'lifecycle',
    hostGenerationHintStartedAt: 'lifecycle',
    independentActionBridge: 'lifecycle',
    runtimeConfigSequence: 'lifecycle',
    lastAppliedRuntimeMode: 'lifecycle',
    lastAppliedIndependentTiming: 'lifecycle',
    automaticGenerationCutovers: 'lifecycle',
    backgroundLifecycleListenersInstalled: 'lifecycle',
    backgroundResumeTimer: 'lifecycle',
    backgroundLifecycleNeedsRecovery: 'lifecycle',
    generationPlaceholderTimer: 'lifecycle',
    generationPlaceholderStartedAt: 'lifecycle',
    passiveRecoveryTimers: 'lifecycle',
    persistedInteractionMigrationHandle: 'lifecycle',
    persistedInteractionMigrationIdle: 'lifecycle',
    startupHistoryFallbackRoot: 'lifecycle',
    startupHistoryFallbackHandler: 'lifecycle',
    queuedIndices: 'lifecycle',
    syncTimer: 'lifecycle',
    hostSubscriptions: 'lifecycle',
    managedIndependentMessagesUnsubscribe: 'lifecycle',
    reconfigureRuntime: 'lifecycle',
    refreshRabbitMirrorGenerationMode: 'lifecycle',
    initIndependentRabbitMirror: 'lifecycle',
    destroyIndependentRabbitMirror: 'lifecycle',
};

function assignModule(name, startLine) {
    if (FORCE_RUNTIME.has(name)) return 'runtime';
    if (FORCE_MODULE[name]) return FORCE_MODULE[name];
    if (startLine < 400) return 'flights';
    if (startLine < 900) return 'persistence';
    if (startLine < 2896) return 'connection';
    if (startLine < 5200) return 'request';
    if (startLine < 7736) return 'geometry';
    if (startLine < 10500) return 'mount';
    if (startLine < 12200) return 'earlyBody';
    return 'lifecycle';
}

const KEYWORDS = new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
    'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in',
    'instanceof', 'let', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
    'var', 'void', 'while', 'with', 'yield', 'enum', 'await', 'implements', 'package',
    'protected', 'static', 'interface', 'private', 'public', 'null', 'true', 'false',
    'undefined', 'NaN', 'Infinity',
]);

function isIdentStart(ch) {
    return /[A-Za-z_$]/.test(ch);
}
function isIdentPart(ch) {
    return /[A-Za-z0-9_$]/.test(ch);
}

function canStartRegex(prev) {
    const trimmed = prev.replace(/\s+$/u, '');
    if (!trimmed) return true;
    const ch = trimmed[trimmed.length - 1];
    if ('(,=:[!&|?{;'.includes(ch)) return true;
    return /(?:^|[^A-Za-z0-9_$])(?:return|case|throw|new|typeof|void|delete|await|in|of)\s*$/.test(trimmed);
}

function scanSkip(source, i, state) {
    const n = source.length;
    const ch = source[i];
    if (state.quote) {
        if (ch === '\\' && state.quote !== '`') return { i: Math.min(n, i + 2), state };
        if (state.quote === '`' && ch === '$' && source[i + 1] === '{') {
            return { i: i + 2, state: { ...state, quote: '', tmpl: (state.tmpl || 0) + 1, expr: (state.expr || 0) + 1 } };
        }
        if (ch === state.quote) return { i: i + 1, state: { ...state, quote: '' } };
        return { i: i + 1, state };
    }
    if (state.comment === '//') {
        if (ch === '\n') return { i: i + 1, state: { ...state, comment: '' } };
        return { i: i + 1, state };
    }
    if (state.comment === '/*') {
        if (ch === '*' && source[i + 1] === '/') return { i: i + 2, state: { ...state, comment: '' } };
        return { i: i + 1, state };
    }
    if (state.regex) {
        if (ch === '\\') return { i: Math.min(n, i + 2), state };
        if (ch === '[') return { i: i + 1, state: { ...state, regexClass: true } };
        if (ch === ']' && state.regexClass) return { i: i + 1, state: { ...state, regexClass: false } };
        if (ch === '/' && !state.regexClass) {
            let j = i + 1;
            while (j < n && /[a-z]/i.test(source[j])) j += 1;
            return { i: j, state: { ...state, regex: false, regexClass: false } };
        }
        return { i: i + 1, state };
    }
    if (ch === '/' && source[i + 1] === '/') return { i: i + 2, state: { ...state, comment: '//' } };
    if (ch === '/' && source[i + 1] === '*') return { i: i + 2, state: { ...state, comment: '/*' } };
    if (ch === '"' || ch === "'" || ch === '`') return { i: i + 1, state: { ...state, quote: ch } };
    if (ch === '/' && canStartRegex(source.slice(Math.max(0, i - 40), i))) {
        return { i: i + 1, state: { ...state, regex: true, regexClass: false } };
    }
    if (ch === '}' && state.expr) {
        const expr = state.expr - 1;
        const tmpl = state.tmpl;
        if (expr < tmpl) return { i: i + 1, state: { ...state, expr, quote: '`' } };
        return { i: i + 1, state: { ...state, expr } };
    }
    return { i: i + 1, state };
}

function parseName(header) {
    const text = header.trim();
    let match = text.match(/^(export\s+)?(async\s+)?function\s+([A-Za-z_$][\w$]*)/);
    if (match) return { kind: 'function', name: match[3], exported: !!match[1], async: !!match[2] };
    match = text.match(/^(export\s+)?(const|let|var)\s+([A-Za-z_$][\w$]*)/);
    if (match) return { kind: match[2], name: match[3], exported: !!match[1] };
    if (/^import\s/.test(text)) return { kind: 'import', name: null };
    return null;
}

const DECL_LINE_RE = /^(?:export\s+)?(?:async\s+)?function\s+[A-Za-z_$]|^(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$]|^import\s/;

function collectIdents(text) {
    const names = new Set();
    let i = 0;
    let state = { quote: '', comment: '', regex: false, regexClass: false, tmpl: 0, expr: 0 };
    const n = text.length;
    while (i < n) {
        const before = i;
        const skipped = scanSkip(text, i, state);
        if (skipped.state.quote || skipped.state.comment || skipped.state.regex || skipped.i !== before + 1) {
            state = skipped.state;
            i = skipped.i;
            continue;
        }
        state = skipped.state;
        const ch = text[i];
        if (isIdentStart(ch)) {
            let j = i + 1;
            while (j < n && isIdentPart(text[j])) j += 1;
            const ident = text.slice(i, j);
            if (!KEYWORDS.has(ident)) names.add(ident);
            i = j;
            continue;
        }
        i += 1;
    }
    return names;
}

function parseFile(source) {
    const lines = source.split(/(?<=\n)/);
    const starts = [];
    for (let i = 0; i < lines.length; i += 1) {
        if (DECL_LINE_RE.test(lines[i])) starts.push(i);
    }
    const items = [];
    for (let s = 0; s < starts.length; s += 1) {
        const from = starts[s];
        const to = s + 1 < starts.length ? starts[s + 1] : lines.length;
        const text = lines.slice(from, to).join('');
        const parsed = parseName(lines[from]);
        const line = from + 1;
        if (parsed?.kind === 'import') {
            items.push({ type: 'import', start: from, end: to, text, line });
        } else if (parsed?.name) {
            items.push({
                type: 'decl',
                kind: parsed.kind,
                name: parsed.name,
                exported: parsed.exported,
                start: from,
                end: to,
                text,
                line,
            });
        } else {
            items.push({ type: 'other', start: from, end: to, text, line });
        }
    }
    return items;
}

function parseExternalImport(text) {
    const from = text.match(/from\s+['"]([^'"]+)['"]/);
    if (!from) return null;
    const specifier = from[1];
    const names = [];
    const named = text.match(/\{([\s\S]*?)\}/);
    if (named) {
        for (const part of named[1].split(',')) {
            const piece = part.trim();
            if (!piece) continue;
            const alias = piece.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
            names.push(alias ? alias[2] : piece.replace(/\s+as\s+[A-Za-z_$][\w$]*$/, '').trim());
        }
    }
    return { specifier, names, text: text.trim() };
}

if (!existsSync(SOURCE_BACKUP)) copyFileSync(SOURCE_PATH, SOURCE_BACKUP);
const source = readFileSync(SOURCE_BACKUP, 'utf8');
const items = parseFile(source);
const imports = items.filter(item => item.type === 'import').map(item => parseExternalImport(item.text)).filter(Boolean);
const decls = items.filter(item => item.type === 'decl');

if (decls.length < 200) {
    console.error(`Parser found only ${decls.length} decls; aborting.`);
    process.exit(1);
}

const duplicateNames = decls.map(d => d.name).filter((name, index, all) => all.indexOf(name) !== index);
if (duplicateNames.length) {
    console.error(`Duplicate top-level names: ${[...new Set(duplicateNames)].join(', ')}`);
    process.exit(1);
}

const commentsByNext = new Map();
let pendingComments = [];
for (const item of items) {
    if (item.type === 'import') continue;
    if (item.type === 'comment' || item.type === 'other') {
        pendingComments.push(item.text);
        continue;
    }
    if (item.type === 'decl') {
        commentsByNext.set(item.name, pendingComments.join(''));
        pendingComments = [];
    }
}
const trailingComments = pendingComments.join('');

const bindingNames = new Set(decls.map(d => d.name));
const originalExport = new Set(decls.filter(d => d.exported).map(d => d.name));
for (const match of source.matchAll(/^export \{([^}]+)\}/gm)) {
    for (const part of match[1].split(',')) {
        const name = part.trim().split(/\s+as\s+/)[0].trim();
        if (name) originalExport.add(name);
    }
}

const moduleOf = new Map();
for (const decl of decls) moduleOf.set(decl.name, assignModule(decl.name, decl.line));

const uses = new Map();
for (const decl of decls) {
    const idents = collectIdents(decl.text);
    const refs = new Set();
    for (const ident of idents) {
        if (ident !== decl.name && bindingNames.has(ident)) refs.add(ident);
    }
    uses.set(decl.name, refs);
}

function assignsIdent(text, name) {
    return new RegExp(`(?:^|[^.\\w$])${name}\\s*(?:\\+\\+|--|\\+=|-=|=(?!=))`).test(text);
}

for (const decl of decls) {
    if (decl.kind !== 'let' && decl.kind !== 'var') continue;
    if (FORCE_RUNTIME.has(decl.name) || FORCE_MODULE[decl.name]) continue;
    const assignerMods = new Set();
    for (const other of decls) {
        if (other.kind !== 'function') continue;
        if (assignsIdent(other.text, decl.name)) assignerMods.add(moduleOf.get(other.name));
    }
    if (assignerMods.size === 1) moduleOf.set(decl.name, [...assignerMods][0]);
}

function usedExternals(decl) {
    const idents = collectIdents(decl.text);
    const names = new Set();
    for (const spec of imports) {
        for (const name of spec.names) if (idents.has(name)) names.add(name);
    }
    return names;
}

function promote(name, dest) {
    moduleOf.set(name, dest);
}

function moduleDeps() {
    const deps = new Map(MODULE_ORDER.map(name => [name, new Set()]));
    for (const decl of decls) {
        const from = moduleOf.get(decl.name);
        for (const ref of uses.get(decl.name)) {
            const to = moduleOf.get(ref);
            if (to && to !== from) deps.get(from).add(to);
        }
    }
    return deps;
}

function findCycles(deps) {
    const cycles = [];
    const stack = [];
    const onstack = new Set();
    const index = new Map();
    const low = new Map();
    let idx = 0;
    function strong(node) {
        index.set(node, idx);
        low.set(node, idx);
        idx += 1;
        stack.push(node);
        onstack.add(node);
        for (const next of deps.get(node) || []) {
            if (!index.has(next)) {
                strong(next);
                low.set(node, Math.min(low.get(node), low.get(next)));
            } else if (onstack.has(next)) {
                low.set(node, Math.min(low.get(node), index.get(next)));
            }
        }
        if (low.get(node) === index.get(node)) {
            const scc = [];
            while (true) {
                const item = stack.pop();
                onstack.delete(item);
                scc.push(item);
                if (item === node) break;
            }
            if (scc.length > 1) cycles.push(scc);
        }
    }
    for (const node of MODULE_ORDER) if (!index.has(node)) strong(node);
    return cycles;
}

function namesImportedFrom(fromModule, toModule) {
    const names = new Set();
    for (const decl of decls) {
        if (moduleOf.get(decl.name) !== fromModule) continue;
        for (const ref of uses.get(decl.name)) {
            if (moduleOf.get(ref) === toModule) names.add(ref);
        }
    }
    return names;
}

// Sibling circular imports are allowed. ESM live bindings are only read inside
// functions after all modules have evaluated, matching the original single-file
// call graph. Do not hoist families into runtime just to make the graph acyclic.

const exportedByModule = new Map(MODULE_ORDER.map(name => [name, new Set()]));
for (const decl of decls) {
    const mod = moduleOf.get(decl.name);
    if (originalExport.has(decl.name)) exportedByModule.get(mod).add(decl.name);
    for (const other of decls) {
        if (other.name === decl.name) continue;
        if (moduleOf.get(other.name) === mod) continue;
        if (uses.get(other.name).has(decl.name)) exportedByModule.get(mod).add(decl.name);
    }
}

const neededExternals = new Map(MODULE_ORDER.map(name => [name, new Set()]));
for (const decl of decls) {
    const mod = moduleOf.get(decl.name);
    for (const name of usedExternals(decl)) neededExternals.get(mod).add(name);
}

function relocateSpecifier(specifier) {
    const file = specifier.split('?')[0].split('/').pop().replace(/\.js$/, '');
    if (MODULE_ORDER.includes(file)) return specifier;
    if (specifier.startsWith('./')) return `../${specifier.slice(2)}`;
    if (specifier.startsWith('../')) return `../${specifier}`;
    return specifier;
}

function relocateEmbeddedSpecifiers(text) {
    return text.replace(/(from\s*|import\()\s*(['"])(\.\.?\/[^'"]+)\2/g, (all, keyword, quote, specifier) => {
        const relocated = relocateSpecifier(specifier);
        if (relocated === specifier) return all;
        return `${keyword}${quote}${relocated}${quote}`;
    });
}

function formatNamedImport(names, specifier) {
    if (names.length <= 4 && names.join(', ').length < 100) {
        return `import { ${names.join(', ')} } from '${specifier}';`;
    }
    return `import {\n    ${names.join(',\n    ')},\n} from '${specifier}';`;
}

function siblingImportLines(mod) {
    const needed = new Map();
    for (const decl of decls) {
        if (moduleOf.get(decl.name) !== mod) continue;
        for (const ref of uses.get(decl.name)) {
            const from = moduleOf.get(ref);
            if (from && from !== mod) {
                if (!needed.has(from)) needed.set(from, new Set());
                needed.get(from).add(ref);
            }
        }
    }
    const lines = [];
    for (const from of MODULE_ORDER) {
        if (!needed.has(from)) continue;
        const names = [...needed.get(from)].sort();
        lines.push(formatNamedImport(names, `./${from}.js?rmv=${STAMP}`));
    }
    return lines;
}

function externalImportLines(mod) {
    const needed = neededExternals.get(mod);
    const lines = [];
    for (const spec of imports) {
        const names = spec.names.filter(name => needed.has(name));
        if (!names.length) continue;
        lines.push(formatNamedImport(names, relocateSpecifier(spec.specifier)));
    }
    return lines;
}

function pieceFor(decl) {
    let text = decl.text;
    const shouldExport = exportedByModule.get(moduleOf.get(decl.name)).has(decl.name);
    if (shouldExport && !/^\s*export\s/.test(text)) text = `export ${text}`;
    return text.endsWith('\n') ? text : `${text}\n`;
}

mkdirSync(OUT_DIR, { recursive: true });

const counts = {};
for (const mod of MODULE_ORDER) {
    const owned = decls.filter(d => moduleOf.get(d.name) === mod).sort((a, b) => {
        const ak = a.kind === 'function' ? 1 : 0;
        const bk = b.kind === 'function' ? 1 : 0;
        if (ak !== bk) return ak - bk;
        return a.line - b.line;
    });
    counts[mod] = {
        decls: owned.length,
        lines: owned.reduce((sum, d) => sum + d.text.split('\n').length, 0),
        chars: owned.reduce((sum, d) => sum + d.text.length, 0),
        exports: [...exportedByModule.get(mod)].length,
        publicExports: [...exportedByModule.get(mod)].filter(name => originalExport.has(name)),
    };
    const header = `// Split from independentApi.js — ${mod}.\n`;
    const ext = externalImportLines(mod);
    const sib = siblingImportLines(mod);
    const body = relocateEmbeddedSpecifiers(owned.map(pieceFor).join('\n'));
    const extra = mod === MODULE_ORDER[MODULE_ORDER.length - 1] ? trailingComments : '';
    const file = [header, ...ext, ...sib, '', body, extra].filter((line, index, arr) => {
        if (line !== '') return true;
        return arr[index - 1] !== '';
    }).join('\n').replace(/\n{3,}/g, '\n\n');
    writeFileSync(path.join(OUT_DIR, `${mod}.js`), file.endsWith('\n') ? file : `${file}\n`);
}

const publicExports = [...originalExport];
const barrelLines = ['// Compatibility barrel. Callers may keep importing independentApi.js.'];
for (const mod of MODULE_ORDER) {
    const names = counts[mod].publicExports;
    if (!names.length) continue;
    const specifier = `./independentApi/${mod}.js?rmv=${STAMP}`;
    if (names.length <= 4 && names.join(', ').length < 100) {
        barrelLines.push(`export { ${names.join(', ')} } from '${specifier}';`);
    } else {
        barrelLines.push(`export {\n    ${names.join(',\n    ')},\n} from '${specifier}';`);
    }
}
writeFileSync(SOURCE_PATH, `${barrelLines.join('\n')}\n`);

function setterName(name) {
    return `write${name[0].toUpperCase()}${name.slice(1)}`;
}

function splitImportHead(text) {
    const lines = text.split('\n');
    let i = 0;
    let inImport = false;
    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('//') || line.trim() === '') {
            i += 1;
            continue;
        }
        if (line.startsWith('import ') || inImport) {
            inImport = !/from\s+['"][^'"]+['"]/.test(line);
            i += 1;
            continue;
        }
        break;
    }
    return { head: `${lines.slice(0, i).join('\n')}\n`, body: lines.slice(i).join('\n') };
}

function addNamedImports(text, fromMod, extraNames) {
    const needle = `from './${fromMod}.js?rmv=${STAMP}'`;
    const idx = text.indexOf(needle);
    if (idx < 0) {
        return `${formatNamedImport([...extraNames].sort(), `./${fromMod}.js?rmv=${STAMP}`)}\n${text}`;
    }
    const start = text.lastIndexOf('import', idx);
    const brace = text.indexOf('{', start);
    const endBrace = text.indexOf('}', brace);
    const existing = new Set(text.slice(brace + 1, endBrace).split(',').map(part => part.trim()).filter(Boolean));
    extraNames.forEach(name => existing.add(name));
    const after = text.slice(endBrace + 1);
    const fromEnd = after.indexOf(';');
    return `${text.slice(0, start)}${formatNamedImport([...existing].sort(), `./${fromMod}.js?rmv=${STAMP}`)}${fromEnd >= 0 ? after.slice(fromEnd + 1) : after}`;
}

function rewriteImportedAssigns(body, name) {
    const fn = setterName(name);
    return body
        .replace(new RegExp(`(?<![.\\w$])\\+\\+${name}\\b`, 'g'), `${fn}(${name}+1)`)
        .replace(new RegExp(`(?<![.\\w$])${name}\\+\\+`, 'g'), `${fn}(${name}+1)`)
        .replace(new RegExp(`(?<![.\\w$])${name}\\s*\\+=\\s*([^;\\n]+)`, 'g'), `${fn}(${name}+($1))`)
        .replace(new RegExp(`(?<![.\\w$])${name}\\s*=(?!=)\\s*([^;\\n]+)`, 'g'), `${fn}($1)`);
}

function parseFileNamedImports(text) {
    const found = [];
    const re = /import\s+\{([\s\S]*?)\}\s*from\s*['"]\.\/([A-Za-z]+)\.js\?rmv=[^'"]+['"]/g;
    let match;
    while ((match = re.exec(text))) {
        for (const part of match[1].split(',')) {
            const piece = part.trim();
            if (!piece) continue;
            const alias = piece.match(/^(?:([A-Za-z_$][\w$]*)\s+as\s+)?([A-Za-z_$][\w$]*)$/);
            if (!alias) continue;
            found.push({ exported: alias[1] || alias[2], local: alias[2], from: match[2] });
        }
    }
    return found;
}

const generated = new Map();
for (const mod of MODULE_ORDER) {
    generated.set(mod, readFileSync(path.join(OUT_DIR, `${mod}.js`), 'utf8'));
}

const setterOwners = new Map();
const setterUsers = new Map();
for (const [mod, text] of generated) {
    const { body } = splitImportHead(text);
    for (const imp of parseFileNamedImports(text)) {
        if (!assignsIdent(body, imp.local)) continue;
        if (!setterOwners.has(imp.from)) setterOwners.set(imp.from, new Set());
        setterOwners.get(imp.from).add(imp.exported);
        if (!setterUsers.has(mod)) setterUsers.set(mod, new Map());
        if (!setterUsers.get(mod).has(imp.from)) setterUsers.get(mod).set(imp.from, new Set());
        setterUsers.get(mod).get(imp.from).add(imp.exported);
    }
}

for (const [owner, names] of setterOwners) {
    let text = generated.get(owner);
    for (const name of names) {
        const fn = setterName(name);
        if (text.includes(`function ${fn}(`)) continue;
        const declRe = new RegExp(`^((?:export )?let ${name}\\s*=[^\\n]*\\n)`, 'm');
        if (!declRe.test(text)) {
            console.error(`Cannot inject ${fn}; let ${name} missing in ${owner}`);
            process.exit(1);
        }
        text = text.replace(declRe, `$1\nexport function ${fn}(value){ ${name} = value; return value; }\n`);
    }
    generated.set(owner, text);
}

for (const [mod, fromMap] of setterUsers) {
    let text = generated.get(mod);
    let { head, body } = splitImportHead(text);
    for (const [from, names] of fromMap) {
        for (const name of names) body = rewriteImportedAssigns(body, name);
        head = addNamedImports(head, from, [...names].map(setterName));
    }
    generated.set(mod, head + body);
}

for (const [mod, text] of generated) {
    writeFileSync(path.join(OUT_DIR, `${mod}.js`), text.endsWith('\n') ? text : `${text}\n`);
}

console.log(JSON.stringify({
    decls: decls.length,
    stamp: STAMP,
    publicExports,
    cycles: findCycles(moduleDeps()),
    runtimePromoted: decls.filter(d => FORCE_RUNTIME.has(d.name) || (assignModule(d.name, d.line) !== 'runtime' && moduleOf.get(d.name) === 'runtime')).map(d => d.name),
    counts,
}, null, 2));
