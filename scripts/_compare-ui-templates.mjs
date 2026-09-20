import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bak = readFileSync(path.join(ROOT, 'src', 'ui.js.bak-split'), 'utf8').replace(/\r\n/g, '\n');
const template = readFileSync(path.join(ROOT, 'src', 'ui', 'settingsTemplate.js'), 'utf8');

function extract(source, assignment) {
    const start = source.indexOf(assignment);
    const tick = source.indexOf('`', start + assignment.length);
    const close = source.indexOf('`;', tick + 1);
    return source.slice(tick, close + 1);
}

function extractReturn(source, fn) {
    const start = source.indexOf(`export function ${fn}()`);
    const tick = source.indexOf('return `', start);
    const close = source.indexOf('`;', tick + 'return '.length);
    return source.slice(tick + 'return '.length, close + 1);
}

const pairs = [
    ['const html = ', 'buildRabbitMirrorSettingsDialogHtml'],
    ['const worldInfoPromptHtml = ', 'buildWorldInfoPromptModalHtml'],
    ['const tagFilterModalHtml = ', 'buildTagFilterModalHtml'],
];
for (const [assignment, fn] of pairs) {
    const a = extract(bak, assignment);
    const b = extractReturn(template, fn);
    console.log(fn, a === b ? 'IDENTICAL' : `DIFF bak=${a.length} new=${b.length}`);
    if (a !== b) {
        let i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
        console.log(' first mismatch at', i, JSON.stringify(a.slice(i, i + 40)), 'vs', JSON.stringify(b.slice(i, i + 40)));
    }
}
