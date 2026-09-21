import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        const st = statSync(full);
        if (st.isDirectory()) {
            if (name === 'data' || name === 'node_modules') continue;
            out.push(...walk(full));
        } else if (name.endsWith('.js') && !name.includes('.bak')) out.push(full);
    }
    return out;
}

function parseExports(text) {
    const names = new Set();
    for (const match of text.matchAll(/^export\s+(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/gm)) {
        names.add(match[1]);
    }
    for (const match of text.matchAll(/^export\s+\{([\s\S]*?)\}(\s*from\s*['"][^'"]+['"])?/gm)) {
        for (const part of match[1].split(',')) {
            const piece = part.trim();
            if (!piece || piece.startsWith('...')) continue;
            const as = piece.match(/^(?:([A-Za-z_$][\w$]*)\s+as\s+)?([A-Za-z_$][\w$]*)$/);
            if (!as) continue;
            names.add(as[2]);
        }
    }
    return names;
}

function parseNamedImports(text) {
    const items = [];
    const re = /(?:import|export)\s+\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = re.exec(text))) {
        for (const part of match[1].split(',')) {
            const piece = part.trim();
            if (!piece) continue;
            const as = piece.match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+[A-Za-z_$][\w$]*)?$/);
            if (!as) continue;
            items.push({ exported: as[1], specifier: match[2] });
        }
    }
    return items;
}

function resolveSpecifier(fromFile, specifier) {
    const bare = specifier.replace(/\?rmv=[^'"]+$/, '');
    if (!(bare.startsWith('./') || bare.startsWith('../'))) return null;
    return path.normalize(path.join(path.dirname(fromFile), bare));
}

const files = [
    ...walk(path.join(ROOT, 'src')),
    path.join(ROOT, 'index.js'),
];
const exportMap = new Map(files.map(file => [file, parseExports(readFileSync(file, 'utf8'))]));

let missing = 0;
let unresolved = 0;
for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const imp of parseNamedImports(text)) {
        const target = resolveSpecifier(file, imp.specifier);
        if (!target) continue;
        if (!exportMap.has(target)) {
            unresolved += 1;
            console.log('UNRESOLVED', path.relative(ROOT, file), '->', imp.specifier);
            continue;
        }
        if (!exportMap.get(target).has(imp.exported)) {
            missing += 1;
            console.log('MISSING', path.relative(ROOT, file), 'imports', imp.exported, 'from', path.relative(ROOT, target));
        }
    }
}
let duplicates = 0;
for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const counts = new Map();
    const add = name => counts.set(name, (counts.get(name) || 0) + 1);
    for (const match of text.matchAll(/^export\s+(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/gm)) {
        add(match[1]);
    }
    for (const match of text.matchAll(/^export\s+\{([\s\S]*?)\}(\s*from\s*['"][^'"]+['"])?/gm)) {
        if (match[2]) continue;
        for (const part of match[1].split(',')) {
            const piece = part.trim();
            if (!piece || piece.startsWith('...')) continue;
            const as = piece.match(/^(?:([A-Za-z_$][\w$]*)\s+as\s+)?([A-Za-z_$][\w$]*)$/);
            if (as) add(as[2]);
        }
    }
    for (const [name, count] of counts) {
        if (count < 2) continue;
        duplicates += 1;
        console.log('DUPLICATE', path.relative(ROOT, file), name, count);
    }
}
console.log('files', files.length, 'missing', missing, 'unresolved', unresolved, 'duplicates', duplicates);
if (missing || duplicates) process.exit(1);
