import { parseMultifaceOutput, createMultifaceFailureSlot } from './multifaceProtocol.js';

function wrapIndependentFaceForMerge(inner, index) {
    return `<toto data-rabbit-mirror="true" data-rm-face="${index + 1}">${String(inner || '')}</toto>`;
}

function isFailureFaceHtml(html = '') {
    return /data-rabbit-mirror-face-failure/i.test(String(html || ''));
}

export function recipesCoverMissing(recipes, indexes = []) {
    if (!Array.isArray(recipes) || !indexes.length) return false;
    return indexes.every(index => Number.isInteger(index) && index >= 0 && recipes[index]);
}

export function remapRetryFaceIndexes(failedFaces, missingIndexes) {
    const missing = Array.isArray(missingIndexes) ? missingIndexes : [];
    return (Array.isArray(failedFaces) ? failedFaces : [])
        .map(face => {
            const local = Number(face?.faceIndex);
            const original = Number.isInteger(local) ? missing[local] : undefined;
            return Number.isInteger(original) ? { ...face, faceIndex: original } : null;
        })
        .filter(Boolean);
}

export function missingIndexesFromIndependentResult(result, expectedCount = 1, previousMissing = []) {
    const expected = Math.max(1, Number(expectedCount) || 1);
    if (result?.skipped) return [];
    if (Array.isArray(result?.failedFaces) && result.failedFaces.length) {
        return [...new Set(result.failedFaces
            .map(face => Number(face.faceIndex))
            .filter(index => Number.isInteger(index) && index >= 0 && index < expected))]
            .sort((left, right) => left - right);
    }
    const html = String(result?.html || '');
    if (!html.trim()) {
        return previousMissing.length
            ? [...previousMissing]
            : Array.from({ length: expected }, (_, index) => index);
    }
    if (expected <= 1) {
        if (/<details\b/i.test(html) && !isFailureFaceHtml(html)) return [];
        return [0];
    }
    const parsed = parseMultifaceOutput(html, { expectedCount: expected });
    if (!parsed.ok) {
        return previousMissing.length
            ? [...previousMissing]
            : Array.from({ length: expected }, (_, index) => index);
    }
    const missing = [];
    for (const face of parsed.faces) {
        if (isFailureFaceHtml(face.html || face.inner || '')) missing.push(face.index);
    }
    for (let index = 0; index < expected; index += 1) {
        if (!parsed.faces.some(face => face.index === index)) missing.push(index);
    }
    return [...new Set(missing)].sort((left, right) => left - right);
}

export function mergeMissingIndependentFaces(previousHtml, expectedCount, missingIndexes, incoming = {}) {
    const expected = Math.max(1, Number(expectedCount) || 1);
    const missing = [...new Set((Array.isArray(missingIndexes) ? missingIndexes : [])
        .filter(index => Number.isInteger(index) && index >= 0 && index < expected))]
        .sort((left, right) => left - right);
    const previous = parseMultifaceOutput(String(previousHtml || ''), { expectedCount: expected });
    const previousFaces = previous.ok ? previous.faces : [];
    const incomingHtml = String(incoming?.html || '');
    const incomingParsed = incomingHtml
        ? parseMultifaceOutput(incomingHtml, { expectedCount: Math.max(1, missing.length || 1) })
        : { ok: false, faces: [] };
    const incomingFaces = incomingParsed.ok ? incomingParsed.faces : [];
    const incomingFailed = new Set((Array.isArray(incoming?.failedFaces) ? incoming.failedFaces : [])
        .map(face => Number(face.faceIndex)));
    const next = [];
    const failedFaces = [];
    let incomingCursor = 0;
    for (let index = 0; index < expected; index += 1) {
        if (!missing.includes(index)) {
            const kept = previousFaces.find(face => face.index === index);
            next.push(kept?.html || createMultifaceFailureSlot(index, 'incomplete-face'));
            if (!kept || isFailureFaceHtml(kept.html || '')) {
                failedFaces.push({ faceIndex: index, status: 'failed', code: 'incomplete-face' });
            }
            continue;
        }
        const piece = incomingFaces[incomingCursor];
        const incomingIndex = incomingCursor;
        incomingCursor += 1;
        if (piece && !isFailureFaceHtml(piece.html || piece.inner || '') && !incomingFailed.has(incomingIndex)) {
            next.push(wrapIndependentFaceForMerge(piece.details || piece.inner || '', index));
        } else {
            const code = String(incoming?.failedFaces?.find(face => Number(face.faceIndex) === incomingIndex)?.code || 'incomplete-face');
            const old = previousFaces.find(face => face.index === index);
            next.push(old?.html || createMultifaceFailureSlot(index, code));
            failedFaces.push({ faceIndex: index, status: 'failed', code });
        }
    }
    return {
        html: next.join('\n'),
        failedFaces,
        completedFaces: expected - failedFaces.length,
        mergedFromMissingRetry: true,
    };
}
