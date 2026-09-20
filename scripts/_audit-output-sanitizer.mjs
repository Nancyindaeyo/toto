import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'outputSanitizer');
const files = readdirSync(DIR).filter(name => name.endsWith('.js'));

function parseNamedImports(text) {
    const names = new Set();
    const specifiers = [];
    const re = /import\s+(?:type\s+)?(?:[A-Za-z_$][\w$]*\s*,\s*)?\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = re.exec(text))) {
        specifiers.push(match[2]);
        for (const part of match[1].split(',')) {
            const piece = part.trim();
            if (!piece) continue;
            const alias = piece.match(/as\s+([A-Za-z_$][\w$]*)$/);
            names.add(alias ? alias[1] : piece.replace(/\s+as\s+[A-Za-z_$][\w$]*$/, '').trim());
        }
    }
    return { names, specifiers };
}

function topLevelBindings(text) {
    const names = new Set();
    const kinds = new Map();
    const exported = new Set();
    for (const match of text.matchAll(/^(export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm)) {
        names.add(match[2]);
        kinds.set(match[2], 'function');
        if (match[1]) exported.add(match[2]);
    }
    for (const match of text.matchAll(/^(export\s+)?(const|let|var)\s+([A-Za-z_$][\w$]*)/gm)) {
        names.add(match[3]);
        kinds.set(match[3], match[2]);
        if (match[1]) exported.add(match[3]);
    }
    return { names, kinds, exported };
}

function collectIdents(text) {
    const names = new Set();
    const ident = /(?<![.\w$])([A-Za-z_$][\w$]*)/g;
    let match;
    while ((match = ident.exec(text))) names.add(match[1]);
    return names;
}

function stripNoise(source) {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/(^|[^:])\/\/.*$/gm, '$1')
        .replace(/`(?:\\[\s\S]|[^`\\])*`/g, '""')
        .replace(/'(?:\\[\s\S]|[^'\\])*'/g, '""')
        .replace(/"(?:\\[\s\S]|[^"\\])*"/g, '""');
}

const KEYWORDS = new Set(`
    break case catch class const continue debugger default delete do else export extends
    finally for function if import in instanceof let new return super switch this throw
    try typeof var void while with yield await enum null true false undefined NaN Infinity
    console document window globalThis Math Date JSON Object Array Map Set WeakMap WeakSet
    Promise Symbol BigInt Number String Boolean Error TypeError URL parseInt parseFloat
    isNaN isFinite CSS MutationObserver requestAnimationFrame cancelAnimationFrame
    setTimeout clearTimeout setInterval clearInterval structuredClone atob btoa fetch Event
    CustomEvent Node Element HTMLElement NodeFilter getComputedStyle navigator location
    history localStorage sessionStorage performance crypto Intl Reflect Proxy WeakRef
    AggregateError RangeError SyntaxError URIError Map Iterator
`.trim().split(/\s+/));

const issues = [];
const exportsByName = new Map();
const parsed = new Map();

for (const file of files) {
    const text = readFileSync(path.join(DIR, file), 'utf8');
    const imports = parseNamedImports(text);
    const bindings = topLevelBindings(text);
    parsed.set(file, { text, imports, bindings });
    for (const name of bindings.exported) {
        if (!exportsByName.has(name)) exportsByName.set(name, []);
        exportsByName.get(name).push(file);
    }
}

for (const file of files) {
    const { text, imports, bindings } = parsed.get(file);
    for (const specifier of imports.specifiers) {
        const resolved = path.resolve(DIR, specifier.split('?')[0]);
        if (!existsSync(resolved)) issues.push(`${file}: missing module ${specifier}`);
    }
    const withoutImports = text.replace(/import\s+(?:type\s+)?(?:[A-Za-z_$][\w$]*\s*,\s*)?\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?/g, '');
    const body = stripNoise(withoutImports);
    for (const name of imports.names) {
        const assign = new RegExp(`(?:^|[^.\\w$])${name}\\s*(?:\\+\\+|--|\\+=|-=|=(?!=))`);
        if (assign.test(body)) issues.push(`${file}: assigns imported binding ${name}`);
    }
    const used = collectIdents(body);
    for (const name of used) {
        if (KEYWORDS.has(name)) continue;
        if (bindings.names.has(name) || imports.names.has(name)) continue;
        if (/^[A-Z]/.test(name) && name.length <= 3) continue;
        // likely a free identifier the splitter missed
        if (exportsByName.has(name) && !bindings.names.has(name)) {
            issues.push(`${file}: uses ${name} but does not import it (exported by ${exportsByName.get(name).join(',')})`);
        }
    }
}

const barrel = readFileSync(path.join(ROOT, 'src', 'outputSanitizer.js'), 'utf8');
const barrelExports = [...barrel.matchAll(/^\s{4}([A-Za-z_$][\w$]*)|^export \{ ([^}]+) \}/gm)]
    .flatMap(match => match[1] ? [match[1]] : match[2].split(',').map(part => part.trim()).filter(Boolean));
const uniqueBarrel = [...new Set(barrelExports.filter(name => /^[A-Za-z_$]/.test(name)))];

console.log(JSON.stringify({
    issues,
    duplicateExports: [...exportsByName.entries()].filter(([, files]) => files.length > 1),
    barrelExports: uniqueBarrel,
    issueCount: issues.length,
}, null, 2));
