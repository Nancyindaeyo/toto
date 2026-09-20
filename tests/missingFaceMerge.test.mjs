import test from 'node:test';
import assert from 'node:assert/strict';
import {
    mergeMissingIndependentFaces,
    missingIndexesFromIndependentResult,
    recipesCoverMissing,
    remapRetryFaceIndexes,
} from '../src/missingFaceMerge.js';

function faceHtml(index, title, body, failed = false) {
    const inner = failed
        ? `<details data-rabbit-mirror-face-failure="incomplete-face"><summary>【兔子镜：第 ${index + 1} 面未完成】</summary><p>未完成</p></details>`
        : `<details><summary>${title}</summary><p>${body}</p></details>`;
    return `<toto data-rabbit-mirror="true" data-rm-face="${index + 1}">${inner}</toto>`;
}

test('recipesCoverMissing requires every missing index', () => {
    assert.equal(recipesCoverMissing([{ id: 1 }, { id: 2 }], [1]), true);
    assert.equal(recipesCoverMissing([{ id: 1 }], [1]), false);
    assert.equal(recipesCoverMissing([], [0]), false);
});

test('remapRetryFaceIndexes maps local retry faces onto the original missing slots', () => {
    assert.deepEqual(
        remapRetryFaceIndexes([{ faceIndex: 0, code: 'empty' }, { faceIndex: 1, code: 'bad' }], [1, 3]),
        [{ faceIndex: 1, code: 'empty' }, { faceIndex: 3, code: 'bad' }],
    );
});

test('missing indexes come from failedFaces or leftover failure slots', () => {
    assert.deepEqual(missingIndexesFromIndependentResult({ failedFaces: [{ faceIndex: 1 }] }, 3), [1]);
    const previous = [faceHtml(0, '一面', '甲'), faceHtml(1, '二面', '乙', true)].join('\n');
    assert.deepEqual(missingIndexesFromIndependentResult({ html: previous }, 2), [1]);
    assert.deepEqual(missingIndexesFromIndependentResult({ html: '' }, 2), [0, 1]);
});

test('merge only replaces the missing faces from the retry payload', () => {
    const previous = [faceHtml(0, '一面', '甲'), faceHtml(1, '二面', '乙', true), faceHtml(2, '三面', '丙', true)].join('\n');
    const incoming = [faceHtml(0, '新二', '新乙'), faceHtml(1, '新三', '新丙', true)].join('\n');
    const merged = mergeMissingIndependentFaces(previous, 3, [1, 2], { html: incoming, failedFaces: [{ faceIndex: 1, code: 'incomplete-face' }] });
    assert.equal(merged.completedFaces, 2);
    assert.deepEqual(merged.failedFaces.map(face => face.faceIndex), [2]);
    assert.match(merged.html, /新乙/);
    assert.match(merged.html, /data-rm-face="1"/);
    assert.match(merged.html, /data-rm-face="3"/);
});
