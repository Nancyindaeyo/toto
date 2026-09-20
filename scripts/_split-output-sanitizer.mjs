import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'src', 'outputSanitizer.js');
const SOURCE_BACKUP = path.join(ROOT, 'src', 'outputSanitizer.js.bak-split');
const OUT_DIR = path.join(ROOT, 'src', 'outputSanitizer');
const STAMP = '1.5.60-split1';

const MODULE_ORDER = [
    'runtime',
    'checkedStateRescue',
    'renderedStateRescue',
    'scriptedInteractionRescue',
    'fallbackRescue',
    'idsAndRearm',
    'diagnostics',
    'choiceRescue',
    'maintenanceInspect',
    'markup',
    'layoutRescue',
    'toolsChrome',
    'lifecycle',
];

const MODULE_RANK = Object.fromEntries(MODULE_ORDER.map((name, index) => [name, index]));

const FORCE_RUNTIME = new Set([
    'escapeRegExp',
    'escapeCssIdentifier',
    'getRabbitMirrorLocalStyleElements',
    'getChatRoot',
    'isInsideChatMessage',
    'isRabbitMirrorDetails',
    'getRenderedRabbitMirrorInteractionRoots',
    'clearMirrorTitleDisplayArtifacts',
    'isCurrentRuntime',
    'isFeedbackCatEnabled',
    'isMaintenanceRabbitEnabled',
    'hashInteractionSignature',
    'MIRROR_TOTO_SELECTOR',
    'RUNTIME_VERSION',
    'RUNTIME_VERSION_ATTR',
    'FEEDBACK_CAT_RUNTIME_STYLE_ID',
    'TOOL_ENTRY_HOST_ATTR',
    'EXTERNAL_REFERENCE_NOTE_ATTR',
    'MIRROR_TITLE_PREFIX_ATTR',
    'MIRROR_TITLE_PART_ATTR',
    'MIRROR_TITLE_DISPLAY_ATTR',
    'MIRROR_TITLE_SOURCE_ATTR',
    'ensureFeedbackCatRuntimeStyle',
    'FEEDBACK_CAT_ATTR',
    'MAINTENANCE_RABBIT_ATTR',
    'RECIPE_BUTTON_ATTR',
    'RABBIT_MIRROR_CSS_SCOPE_ATTR',
    'REVERSIBLE_STYLE_BASELINE_ATTR',
    'REVERSIBLE_TEXT_BASELINE_ATTR',
    'RAW_SELF_MUTATION_HTML_BASELINE_ATTR',
    'RAW_SELF_MUTATION_ACTIVE_ATTR',
    'INTERACTION_HOME_ATTR',
]);

const FORCE_MODULE = {
    hostScriptModule: 'lifecycle',
    outputHostSubscriptions: 'lifecycle',
    recipeRecordedHandler: 'lifecycle',
    recipeOutsideCloseCleanup: 'toolsChrome',
    maintenanceOutsideCloseCleanup: 'toolsChrome',
    feedbackOutsideCloseCleanup: 'toolsChrome',
    toolOutsideCloseOwners: 'toolsChrome',
    TOTO_BLOCK_RE: 'markup',
    TOTO_BLOCK_SINGLE_RE: 'markup',
    FENCED_BLOCK_RE: 'markup',
    WHOLE_FENCED_BLOCK_RE: 'markup',
    TRAILING_HTML_START_RE: 'markup',
    PRE_CODE_RE: 'markup',
    HTML_COMMENT_RE: 'markup',
    CODE_FENCE_OPEN_RE: 'markup',
    TILDE_FENCE_OPEN_RE: 'markup',
    CODE_LIKE_TAG_RE: 'markup',
    CLASS_ATTR_RE: 'markup',
    HIGHLIGHT_CLASS_TOKEN_RE: 'markup',
    MULTI_BLANK_LINE_RE: 'markup',
    interactionScopeCounter: 'idsAndRearm',
    interactionScopeStates: 'idsAndRearm',
    SCOPED_INTERACTION_ID_RE: 'idsAndRearm',
    RADIO_GROUP_RESCUE_ATTR: 'idsAndRearm',
    RADIO_GROUP_ROOT_ATTR: 'idsAndRearm',
    INTERACTION_REFERENCE_ALIAS_REPAIR_ATTR: 'idsAndRearm',
    INTERACTION_REFERENCE_ALIAS_BASELINE_ATTR: 'idsAndRearm',
    RAW_RADIO_RESET_RESCUE_ATTR: 'scriptedInteractionRescue',
    RAW_RADIO_RESET_ROOT_ATTR: 'scriptedInteractionRescue',
    RAW_RADIO_RESET_LAST_ATTR: 'scriptedInteractionRescue',
    rawRadioResetRescueStates: 'scriptedInteractionRescue',
    INTERACTION_RESCUE_MEMORY_KEY: 'idsAndRearm',
    rememberedInteractionRescueKeys: 'idsAndRearm',
    getInteractionRescueKey: 'idsAndRearm',
    loadRememberedInteractionRescues: 'idsAndRearm',
    rememberInteractionRescue: 'idsAndRearm',
    wasInteractionRescued: 'idsAndRearm',
    createInteractionScopePrefix: 'idsAndRearm',
    replaceIdReferenceTokens: 'idsAndRearm',
    rewriteCssIdReferences: 'idsAndRearm',
    rewriteSmilIdReferences: 'idsAndRearm',
    addImportantToDeclarationBlock: 'checkedStateRescue',
    strengthenCheckedCssText: 'checkedStateRescue',
    strengthenRabbitMirrorCheckedStateCss: 'checkedStateRescue',
    interactionInlineOverrideStates: 'checkedStateRescue',
    FOCUS_TO_CHECKED_STYLE_ATTR: 'checkedStateRescue',
    FOCUS_TO_CHECKED_ROOT_ATTR: 'checkedStateRescue',
    cloneMessageForTransientRerender: 'markup',
    triggerInteractionDiagnosticOnce: 'diagnostics',
    startupMaintenanceInstallTimer: 'toolsChrome',
    startupMaintenanceInstallQueue: 'toolsChrome',
    startupMaintenanceVisibilityObserver: 'toolsChrome',
    startupMaintenanceFallbackRoot: 'toolsChrome',
    startupMaintenanceFallbackHandler: 'toolsChrome',
    rabbitMirrorInteractionResetInstanceCounter: 'maintenanceInspect',
    mobileInlineAnnotationCounter: 'fallbackRescue',
    mobileLayoutScopeCounter: 'layoutRescue',
    rehydrateStaticChoiceSelectionRepair: 'choiceRescue',
    rehydrateStructuredStaticDisclosureRepair: 'choiceRescue',
    rehydrateFillInChoiceRepair: 'choiceRescue',
    rehydrateRabbitMirrorMaintenanceRepairs: 'choiceRescue',
    collectScopedClassAliasesForHost: 'idsAndRearm',
    repairRabbitMirrorScopedClassAliasesInScope: 'idsAndRearm',
    getRabbitMirrorFacePosition: 'layoutRescue',
    independentMaintenanceHost: 'layoutRescue',
    refreshRabbitMirrorToolsInScope: 'toolsChrome',
    refreshMaintenanceRabbits: 'toolsChrome',
    refreshFeedbackCats: 'toolsChrome',
    refreshRecipeButtons: 'toolsChrome',
    showMaintenanceRabbitMenu: 'toolsChrome',
    handleMaintenanceRabbitClick: 'toolsChrome',
    maintenanceRecommendationForInspection: 'toolsChrome',
    maintenanceRecommendationText: 'toolsChrome',
};

function assignModule(name, startLine) {
    if (FORCE_RUNTIME.has(name)) return 'runtime';
    if (FORCE_MODULE[name]) return FORCE_MODULE[name];
    if (/^rehydrate/.test(name)) return 'choiceRescue';
    if (startLine < 418) {
        throw new Error(`Unassigned early binding ${name} at ${startLine}`);
    }
    if (startLine < 3232) return 'checkedStateRescue';
    if (startLine < 6437) return 'renderedStateRescue';
    if (startLine < 8911) return 'scriptedInteractionRescue';
    if (startLine < 11582) return 'fallbackRescue';
    if (startLine < 12200) return 'idsAndRearm';
    if (startLine < 14515) return 'diagnostics';
    if (startLine < 15564) return 'choiceRescue';
    if (startLine < 17484) return 'maintenanceInspect';
    if (startLine < 18053) return 'markup';
    if (startLine < 18251) return 'maintenanceInspect';
    if (startLine < 18877) return 'maintenanceInspect';
    if (startLine < 19864) return 'toolsChrome';
    if (startLine < 21899) return 'layoutRescue';
    if (startLine < 22888) return 'maintenanceInspect';
    if (startLine < 23035) return 'toolsChrome';
    if (startLine < 23756) return 'toolsChrome';
    if (startLine < 23818) return 'idsAndRearm';
    if (startLine < 24062) return 'choiceRescue';
    if (startLine < 24076) return 'toolsChrome';
    if (startLine < 25704) return 'markup';
    if (startLine < 26084) return 'maintenanceInspect';
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

const source = readFileSync(SOURCE_BACKUP, 'utf8');
const items = parseFile(source);
const imports = items.filter(item => item.type === 'import').map(item => parseExternalImport(item.text)).filter(Boolean);
const decls = items.filter(item => item.type === 'decl');

if (decls.length < 400) {
    console.error(`Parser found only ${decls.length} decls; aborting.`);
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
    const header = `// Split from outputSanitizer.js — ${mod}.\n`;
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
const barrelLines = ['// Compatibility barrel. Callers may keep importing outputSanitizer.js.'];
for (const mod of MODULE_ORDER) {
    const names = counts[mod].publicExports;
    if (!names.length) continue;
    const specifier = `./outputSanitizer/${mod}.js?rmv=${STAMP}`;
    if (names.length <= 4 && names.join(', ').length < 100) {
        barrelLines.push(`export { ${names.join(', ')} } from '${specifier}';`);
    } else {
        barrelLines.push(`export {\n    ${names.join(',\n    ')},\n} from '${specifier}';`);
    }
}
writeFileSync(SOURCE_PATH, `${barrelLines.join('\n')}\n`);

console.log(JSON.stringify({
    decls: decls.length,
    stamp: STAMP,
    publicExports,
    cycles: findCycles(moduleDeps()),
    runtimePromoted: decls.filter(d => FORCE_RUNTIME.has(d.name) || (assignModule(d.name, d.line) !== 'runtime' && moduleOf.get(d.name) === 'runtime')).map(d => d.name),
    counts,
}, null, 2));
