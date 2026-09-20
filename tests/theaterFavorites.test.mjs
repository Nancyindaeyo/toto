import test from 'node:test';
import assert from 'node:assert/strict';
import { captureTheaterFavoriteFromRoot, groupTheaterFavoritesByCharacter, UNCATEGORIZED_CHARACTER_NAME } from '../src/theaterFavorites.js';
import { collectRevealedClipHosts, shouldRelaxRevealedClipPanel } from '../src/revealedClipRepair.js';

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
        const captured = captureTheaterFavoriteFromRoot(fake, { sourceHash: 'abc', characterId: 'char.png', characterName: '幸村' });
        assert.equal(captured.title, '星空剧场');
        assert.equal(captured.mode, 'html');
        assert.match(captured.html, /<details>/);
        assert.equal(captured.sourceHash, 'abc');
        assert.equal(captured.characterName, '幸村');
        return;
    }
    details.innerHTML = '<summary> 星空剧场 </summary><p>可交互</p>';
    const captured = captureTheaterFavoriteFromRoot(details, { chatKey: 'chat-a', mesid: 4, swipe: 0, sourceHash: 'abc', characterName: '幸村', characterId: 'char.png' });
    assert.equal(captured.title, '星空剧场');
    assert.match(captured.html, /可交互/);
    assert.equal(captured.mesid, 4);
    assert.equal(captured.characterName, '幸村');
});

test('favorites group by character and keep uncategorized last', () => {
    const groups = groupTheaterFavoritesByCharacter([
        { id: 'a', title: '旧面', characterId: '', characterName: '' },
        { id: 'b', title: '立海', characterId: 'yukimura.png', characterName: '幸村精市' },
        { id: 'c', title: '另一面', characterId: 'yukimura.png', characterName: '幸村精市' },
        { id: 'd', title: '青学', characterId: 'fuji.png', characterName: '不二周助' },
    ]);
    assert.equal(groups.length, 3);
    assert.equal(groups.at(-1).characterName, UNCATEGORIZED_CHARACTER_NAME);
    assert.equal(groups.find(group => group.characterName === '幸村精市').items.length, 2);
});

test('revealed clip only relaxes overflowed open panels', () => {
    assert.equal(shouldRelaxRevealedClipPanel({ maxHeightPx: 320, scrollHeight: 900, clientHeight: 320, overflowY: 'hidden' }), true);
    assert.equal(shouldRelaxRevealedClipPanel({ maxHeightPx: 0, heightPx: 0, overflowY: 'visible', scrollHeight: 40, clientHeight: 40 }), false);
    assert.equal(shouldRelaxRevealedClipPanel({ overflowY: 'hidden', scrollHeight: 900, clientHeight: 200, protectedSurface: true }), false);
});

test('collectRevealedClipHosts prefers open inner details and checked siblings', () => {
    const inner = { tagName: 'DIV', children: [], open: false };
    const details = {
        tagName: 'DETAILS',
        open: true,
        children: [{ tagName: 'SUMMARY' }, inner],
        closest() { return null; },
        matches(selector) { return selector === 'details'; },
        parentElement: null,
    };
    inner.parentElement = details;
    const checked = {
        tagName: 'INPUT',
        parentElement: { children: [{ tagName: 'INPUT' }, { tagName: 'DIV', children: [] }] },
        closest() { return null; },
        matches() { return false; },
    };
    checked.parentElement.children[0] = checked;
    const panel = checked.parentElement.children[1];
    panel.parentElement = checked.parentElement;
    const root = {
        querySelectorAll(selector) {
            if (selector === 'details[open]') return [details];
            return [checked];
        },
        contains() { return true; },
    };
    const hosts = collectRevealedClipHosts(root, {
        isInternal: () => false,
        isOuterDetails: () => false,
        isVisible: () => true,
    });
    assert.ok(hosts.includes(details));
    assert.ok(hosts.includes(inner));
    assert.ok(hosts.includes(panel));
});
