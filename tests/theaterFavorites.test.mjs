import test from 'node:test';
import assert from 'node:assert/strict';
import { captureTheaterFavoriteFromRoot } from '../src/theaterFavorites.js';

test('favorite capture keeps the live face markup and skips placeholders', () => {
    const details = globalThis.document?.createElement?.('details');
    if (!details) {
        const fake = {
            matches(selector) { return selector === 'details'; },
            classList: { contains: () => false },
            querySelector() { return { textContent: '  星空剧场  ' }; },
            outerHTML: '<details><summary>星空剧场</summary><p>可交互</p></details>',
            dataset: { rabbitMirrorOwnerChat: 'chat-a', rabbitMirrorOwnerMesid: '4', rabbitMirrorOwnerSwipe: '0' },
            getAttribute() { return 'html'; },
        };
        const captured = captureTheaterFavoriteFromRoot(fake, { sourceHash: 'abc' });
        assert.equal(captured.title, '星空剧场');
        assert.equal(captured.mode, 'html');
        assert.match(captured.html, /<details>/);
        assert.equal(captured.sourceHash, 'abc');
        return;
    }
    details.innerHTML = '<summary> 星空剧场 </summary><p>可交互</p>';
    const captured = captureTheaterFavoriteFromRoot(details, { chatKey: 'chat-a', mesid: 4, swipe: 0, sourceHash: 'abc' });
    assert.equal(captured.title, '星空剧场');
    assert.match(captured.html, /可交互/);
    assert.equal(captured.mesid, 4);
});
