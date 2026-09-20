import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(ROOT, 'src', 'independentApi');
const stamp = '1.5.60-split2';
const files = readdirSync(dir).filter(name => name.endsWith('.js'));
const exportNames = new Map();
const importNames = [];

for (const file of files) {
    const text = readFileSync(path.join(dir, file), 'utf8');
    const names = new Set();
    for (const match of text.matchAll(/^export (?:async )?(?:function|const|let|class) ([A-Za-z_$][\w$]*)/gm)) {
        names.add(match[1]);
    }
    for (const match of text.matchAll(/^export \{([\s\S]*?)\}/gm)) {
        for (const part of match[1].split(',')) {
            const piece = part.trim();
            if (!piece) continue;
            const as = piece.match(/^(?:([A-Za-z_$][\w$]*)\s+as\s+)?([A-Za-z_$][\w$]*)$/);
            if (as) names.add(as[1] || as[2]);
        }
    }
    exportNames.set(file.replace(/\.js$/, ''), names);
    const re = /import\s+\{([\s\S]*?)\}\s+from\s+['"]\.\/([A-Za-z]+)\.js\?rmv=([^'"]+)['"]/g;
    let match;
    while ((match = re.exec(text))) {
        for (const part of match[1].split(',')) {
            const piece = part.trim();
            if (!piece) continue;
            const alias = piece.match(/^(?:([A-Za-z_$][\w$]*)\s+as\s+)?([A-Za-z_$][\w$]*)$/);
            if (!alias) continue;
            importNames.push({ file, from: match[2], exported: alias[1] || alias[2], stamp: match[3] });
        }
    }
    const unstamped = [...text.matchAll(/from\s+['"](\.[^'"]+\.js)['"]/g)].map(item => item[1]);
    if (unstamped.length) console.log('UNSTAMPED', file, unstamped);
}

let missing = 0;
let stampMismatch = 0;
for (const imp of importNames) {
    if (imp.stamp !== stamp) {
        stampMismatch += 1;
        console.log('STAMP', imp.file, '->', imp.from, imp.stamp);
    }
    const names = exportNames.get(imp.from);
    if (!names?.has(imp.exported)) {
        missing += 1;
        console.log('MISSING', imp.file, 'imports', imp.exported, 'from', imp.from);
    }
}
console.log('independentApi sibling imports', importNames.length, 'missing', missing, 'stampMismatch', stampMismatch);
