import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function stripModuleSyntax(source) {
    return source
        .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*/gm, '')
        .replace(/^export /gm, '');
}

function loadMarkup() {
    const runtime = stripModuleSyntax(readFileSync(new URL('../src/outputSanitizer/runtime.js', import.meta.url), 'utf8'));
    const markup = stripModuleSyntax(readFileSync(new URL('../src/outputSanitizer/markup.js', import.meta.url), 'utf8'));
    const context = vm.createContext({
        console,
        URL,
        Map,
        Set,
        WeakMap,
        WeakSet,
        document: undefined,
        getSettings: () => ({}),
        applyRabbitMirrorBannedWordsToDom() {},
    });
    vm.runInContext(`${runtime}\n${markup}`, context);
    return context;
}

test('markup helpers evaluate without loading rescue families or the barrel', () => {
    const loaded = loadMarkup();
    assert.equal(typeof loaded.cleanRabbitMirrorOutput, 'function');
    assert.equal(typeof loaded.compactTotoBlock, 'function');
    assert.equal(typeof loaded.validateRabbitMirrorMarkupLexicalBudget, 'function');
    assert.equal(typeof loaded.installIntelligentInteractionRescue, 'undefined');
    assert.equal(typeof loaded.initOutputSanitizer, 'undefined');
});

test('lexical budget rejects empty and oversized source', () => {
    const { validateRabbitMirrorMarkupLexicalBudget } = loadMarkup();
    assert.equal(validateRabbitMirrorMarkupLexicalBudget(''), false);
    assert.equal(validateRabbitMirrorMarkupLexicalBudget('<div>ok</div>'), true);
    assert.equal(validateRabbitMirrorMarkupLexicalBudget(`<div>${'x'.repeat(800000)}</div>`), false);
});

test('cleanRabbitMirrorOutput unwraps a fenced toto block', () => {
    const { cleanRabbitMirrorOutput } = loadMarkup();
    const cleaned = cleanRabbitMirrorOutput('```html\n<toto data-rabbit-mirror="true"><div>镜面</div></toto>\n```');
    assert.match(cleaned, /<toto\b/i);
    assert.doesNotMatch(cleaned, /```/);
    assert.match(cleaned, /镜面/);
});

test('compactTotoBlock strips leading indent that would become a markdown code block', () => {
    const { compactTotoBlock } = loadMarkup();
    const compacted = compactTotoBlock('<toto data-rabbit-mirror="true">\n    <div>正文</div>\n</toto>');
    assert.doesNotMatch(compacted, /^    /m);
    assert.match(compacted, /正文/);
});
