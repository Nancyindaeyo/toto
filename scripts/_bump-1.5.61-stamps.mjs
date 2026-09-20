import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules', 'data']);
const REPLACEMENTS = [
    ['outputSanitizer.js?rmv=1.5.61', 'outputSanitizer.js?rmv=1.5.61'],
    ['independentApi.js?rmv=1.5.61', 'independentApi.js?rmv=1.5.61'],
    ['ui.js?rmv=1.5.61', 'ui.js?rmv=1.5.61'],
    ['visualScanner.js?rmv=1.5.61', 'visualScanner.js?rmv=1.5.61'],
    ['followFaceRetry.js?rmv=1.5.61', 'followFaceRetry.js?rmv=1.5.61'],
    ['renderedVisualFeedbackHotfix.js?rmv=1.5.61', 'renderedVisualFeedbackHotfix.js?rmv=1.5.61'],
];

function walk(dir, out = []) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name) || name.endsWith('.bak-split')) continue;
        const full = path.join(dir, name);
        const stat = statSync(full);
        if (stat.isDirectory()) walk(full, out);
        else if (/\.(js|mjs|json|md)$/.test(name)) out.push(full);
    }
    return out;
}

for (const file of walk(ROOT)) {
    let text = readFileSync(file, 'utf8');
    const next = REPLACEMENTS.reduce((current, [from, to]) => current.split(from).join(to), text);
    if (next !== text) {
        writeFileSync(file, next);
        console.log('updated', path.relative(ROOT, file));
    }
}
