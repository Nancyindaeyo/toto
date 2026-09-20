import { presentationModeFields } from './presentationMode.js?rmv=1.5.53-visualquick1';
import {
    commitPendingComboBatch,
    getCurrentChatKey,
    releasePendingComboBatch,
} from './storage.js?rmv=1.5.53-visualquick1';
import { recordRabbitMirrorRecipe } from './blacklist.js?rmv=1.5.53-image1';
import { parseMultifaceOutput, recoverableMultifaceFrames, createMultifaceFailureSlot, multifaceRecoveryWithinRawBudgets } from './multifaceProtocol.js?rmv=1.5.53-cn-boundary1';

const SNAPSHOT_STORAGE_KEY = 'rabbit_mirror_theater:generation_snapshots:v1';
const ACTIVE_ATTEMPT_STORAGE_KEY = 'rabbit_mirror_theater:active_generation_attempt:v1';
const SNAPSHOT_TTL_MS = 30 * 60 * 1000;
const MAX_SNAPSHOTS = 16;
const MAX_SNAPSHOT_SOURCE_CHARS = 240000;
const MAX_ACTIVE_FOLLOW_BATCHES = 8;
const activeFollowBatches = new Map();

function deeplyFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const nested of Object.values(value)) deeplyFreeze(nested);
    return Object.freeze(value);
}

function hashText(text) {
    let hash = 2166136261;
    for (const char of String(text || '')) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}

function normalizeText(value) {
    return String(value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;|&#34;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim();
}

function cssStructuralBalance(cssText) {
    const source = String(cssText || '');
    let depth = 0;
    let minDepth = 0;
    let quote = '';
    let escaped = false;
    let inComment = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        const next = source[index + 1] || '';
        if (inComment) {
            if (char === '*' && next === '/') {
                inComment = false;
                index += 1;
            }
            continue;
        }
        if (quote) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '/' && next === '*') {
            inComment = true;
            index += 1;
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '{') depth += 1;
        else if (char === '}') {
            depth -= 1;
            minDepth = Math.min(minDepth, depth);
        }
    }
    return {
        depth,
        extraClosingBrace: minDepth < 0,
        unterminatedString: !!quote,
        unterminatedComment: inComment,
    };
}

function findBalancedDetailsEnd(source, detailsStart) {
    const text = String(source || '');
    if (detailsStart < 0) return -1;
    const tagRe = /<\s*(\/?)\s*details\b[^>]*>/gi;
    tagRe.lastIndex = detailsStart;
    let depth = 0;
    let match;
    while ((match = tagRe.exec(text))) {
        if (match.index < detailsStart) continue;
        if (match[1]) {
            depth -= 1;
            if (depth === 0) return tagRe.lastIndex;
        } else if (!/\/\s*>$/.test(match[0])) {
            depth += 1;
        }
    }
    return -1;
}

function extractRabbitMirrorCandidates(source) {
    const text = String(source || '');
    const candidates = [];
    const summaryRe = /<summary\b[^>]*>([\s\S]*?)<\/summary\s*>/gi;
    let match;
    while ((match = summaryRe.exec(text))) {
        const title = normalizeText(match[1]);
        if (!title.includes('兔子镜')) continue;
        const detailsStart = text.slice(0, match.index).toLowerCase().lastIndexOf('<details');
        if (detailsStart < 0) continue;
        const detailsEnd = findBalancedDetailsEnd(text, detailsStart);
        const isolatedSource = detailsEnd > detailsStart
            ? text.slice(detailsStart, detailsEnd).trim()
            : text.slice(detailsStart).trim();
        candidates.push({
            title,
            detailsStart,
            detailsEnd,
            isolatedSource,
            summaryClosed: true,
        });
    }
    return candidates;
}

function sourceBodyEvidence(isolatedSource) {
    const stylesheetText = [...String(isolatedSource || '').matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)]
        .map(match => String(match[1] || ''))
        .join('\n');
    const stylesheetVisualProgramCount = (stylesheetText.match(/@keyframes\b|content\s*:|background(?:-image)?\s*:[^;{}]*(?:url\(|gradient\()|mask(?:-image)?\s*:|clip-path\s*:/gi) || []).length;
    const withoutNonBody = String(isolatedSource || '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
        .replace(/<summary\b[^>]*>[\s\S]*?<\/summary\s*>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<\/?(?:toto|details)\b[^>]*>/gi, ' ')
        .replace(/<br\s*\/?>/gi, ' ');
    const bodyTagCount = (withoutNonBody.match(/<(?:div|section|article|label|input|button|p|span|h[1-6]|ul|ol|li|table|form|figure|main|header|footer|nav|img|svg|canvas|video|audio|meter|progress)\b/gi) || []).length;
    const bodyTextLength = normalizeText(withoutNonBody).length;
    const visualProgramCount = stylesheetVisualProgramCount
        + (withoutNonBody.match(/(?:background(?:-image)?\s*:[^;]*(?:url\(|gradient\()|mask(?:-image)?\s*:|clip-path\s*:|filter\s*:|@keyframes\b|<svg\b|<canvas\b|<img\b|<video\b)/gi) || []).length;
    return {
        bodyTagCount,
        bodyTextLength,
        visualProgramCount,
        bodyMissing: bodyTagCount === 0 && bodyTextLength === 0 && visualProgramCount === 0,
    };
}

export function inspectRabbitMirrorGenerationSource(source, expectedTitle = '') {
    const candidates = extractRabbitMirrorCandidates(source);
    const wanted = normalizeText(expectedTitle);
    const candidate = wanted
        ? [...candidates].reverse().find(item => item.title === wanted || item.title.includes(wanted) || wanted.includes(item.title))
        : candidates[candidates.length - 1];
    if (!candidate) {
        return {
            hasMirror: false,
            complete: false,
            reason: 'missing-rabbit-mirror',
            title: '',
            isolatedSource: '',
        };
    }

    const isolated = candidate.isolatedSource;
    const styleOpenCount = (isolated.match(/<style\b/gi) || []).length;
    const styleCloseCount = (isolated.match(/<\/style\s*>/gi) || []).length;
    const styleBlocks = [...isolated.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)]
        .map(match => String(match[1] || ''));
    const cssBalance = cssStructuralBalance(styleBlocks.join('\n'));
    const body = sourceBodyEvidence(isolated);
    const detailsClosed = candidate.detailsEnd > candidate.detailsStart;
    const styleClosed = styleOpenCount === styleCloseCount;
    const cssTruncated = styleOpenCount > 0 && (
        !styleClosed
        || cssBalance.depth !== 0
        || cssBalance.extraClosingBrace
        || cssBalance.unterminatedString
        || cssBalance.unterminatedComment
    );

    let reason = '';
    if (!detailsClosed) reason = 'details-not-closed';
    else if (cssTruncated) reason = 'css-truncated';
    else if (body.bodyMissing) reason = 'body-missing';

    return {
        hasMirror: true,
        complete: !reason,
        reason: reason || 'complete',
        title: candidate.title,
        isolatedSource: isolated,
        detailsClosed,
        styleOpenCount,
        styleCloseCount,
        cssTruncated,
        ...body,
    };
}

function readSnapshots() {
    try {
        const parsed = JSON.parse(sessionStorage.getItem(SNAPSHOT_STORAGE_KEY) || '[]');
        const now = Date.now();
        return Array.isArray(parsed)
            ? parsed.filter(item => item && now - Number(item.ts || 0) <= SNAPSHOT_TTL_MS)
            : [];
    } catch {
        return [];
    }
}

function writeSnapshots(items) {
    try {
        sessionStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify((items || []).slice(-MAX_SNAPSHOTS)));
        return true;
    } catch (error) {
        console.debug('[RabbitMirror] generation snapshot store unavailable:', error);
        return false;
    }
}

function readActiveAttempt() {
    try {
        const value = JSON.parse(sessionStorage.getItem(ACTIVE_ATTEMPT_STORAGE_KEY) || 'null');
        return value && typeof value === 'object' ? value : null;
    } catch {
        return null;
    }
}

function writeActiveAttempt(value) {
    try {
        sessionStorage.setItem(ACTIVE_ATTEMPT_STORAGE_KEY, JSON.stringify(value || null));
    } catch {
        // Session state is optional; generation still works without it.
    }
}

function snapshotKey(chatKey, messageIndex, swipeId) {
    return `${chatKey}|m:${messageIndex}|s:${swipeId}`;
}

function currentSwipeId(message) {
    return Number.isInteger(message?.swipe_id) ? message.swipe_id : -1;
}

function copyFormatDescriptors(metadata) {
    const allowedIds = new Set(Array.isArray(metadata?.formatIds) ? metadata.formatIds : []);
    const seen = new Set();
    const descriptors = [];
    const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
    for (const item of Array.isArray(metadata?.formatDescriptors) ? metadata.formatDescriptors.slice(0, 8) : []) {
        const id = item?.id;
        if (typeof id !== 'string' || !id || id.length > 2048 || !allowedIds.has(id) || seen.has(id)) continue;
        seen.add(id);
        descriptors.push({
            id,
            title: text(item.title, 160),
            summary: text(item.summary, 210),
            tags: Array.isArray(item.tags) ? item.tags.slice(0, 4).map(tag => text(tag, 64)).filter(Boolean) : [],
        });
    }
    return descriptors;
}

function copySelectionMetadata(metadata = null) {
    if (!metadata || typeof metadata !== 'object') return null;
    const copy = {
        samplingMode: String(metadata.samplingMode || 'classic'),
        themeIds: Array.isArray(metadata.themeIds) ? [...metadata.themeIds] : [],
        formatIds: Array.isArray(metadata.formatIds) ? [...metadata.formatIds] : [],
        ...presentationModeFields(metadata),
        userDirectiveApplied: !!metadata.userDirectiveApplied,
        forcedVisualScenery: !!metadata.forcedVisualScenery,
        tarotRules: metadata.tarotRules === true,
    };
    const formatDescriptors = copyFormatDescriptors(metadata);
    if (formatDescriptors.length) copy.formatDescriptors = formatDescriptors;
    if (Array.isArray(metadata.faces)) {
        copy.faces = metadata.faces.slice(0, 5).map(face => ({
            faceIndex: Number(face?.faceIndex),
            ...copySelectionMetadata(face),
        }));
    }
    return copy;
}

function isFollowBatchPlan(plan) {
    return plan?.kind === 'rabbit-mirror-multiface-plan'
        && plan.schemaVersion === 1
        && typeof plan?.batchId === 'string' && !!plan.batchId
        && plan?.identity?.kind === 'generation-operation'
        && typeof plan.identity.chatKey === 'string' && !!plan.identity.chatKey
        && typeof plan.identity.generationScopeKey === 'string' && !!plan.identity.generationScopeKey
        && typeof plan.identity.operationId === 'string' && !!plan.identity.operationId
        && typeof plan.identity.generationType === 'string' && !!plan.identity.generationType
        && typeof plan.identity.settingsKey === 'string' && !!plan.identity.settingsKey
        && plan.identity.preview === false
        && Number.isInteger(plan.requestedFaceCount)
        && plan.requestedFaceCount >= 2 && plan.requestedFaceCount <= 5
        && Array.isArray(plan.faces) && plan.faces.length === plan.requestedFaceCount
        && plan.faces.every((face, index) => face?.faceIndex === index && face?.combo && typeof face.combo === 'object');
}

function followTargetFor(chat, generationType = '') {
    const list = Array.isArray(chat) ? chat : [];
    const type = String(generationType || 'normal').toLowerCase();
    const tailIndex = list.length - 1;
    const tail = list[tailIndex] || null;
    if (tail && tail.is_user !== true && ['continue', 'swipe', 'regenerate'].includes(type)) {
        return { targetMessageIndex: tailIndex, existingTarget: true };
    }
    if (tail && tail.is_user !== true && type === 'normal') {
        return { targetMessageIndex: tailIndex, existingTarget: true };
    }
    return { targetMessageIndex: list.length, existingTarget: false };
}

function followAnchor(chat, target) {
    const list = Array.isArray(chat) ? chat : [];
    const anchorIndex = target.targetMessageIndex - 1;
    const anchor = list[anchorIndex] || null;
    const targetMessage = target.existingTarget ? list[target.targetMessageIndex] : null;
    return {
        initialLength: list.length,
        anchorIndex,
        anchorIsUser: typeof anchor?.is_user === 'boolean' ? anchor.is_user : null,
        anchorBodyHash: anchor ? hashText(anchor.mes || '') : '',
        anchorSwipeId: anchor ? currentSwipeId(anchor) : -1,
        targetBodyHash: targetMessage ? hashText(targetMessage.mes || '') : '',
        targetSwipeId: targetMessage ? currentSwipeId(targetMessage) : null,
    };
}

function normalizedFollowRecord(chat, attemptId, plan, metadata = null) {
    if (!isFollowBatchPlan(plan)) return null;
    const list = Array.isArray(chat) ? chat : [];
    const chatKey = getCurrentChatKey(list);
    if (!chatKey || plan.identity.chatKey !== chatKey
        || plan.identity.operationId !== String(attemptId || '')
        || plan.identity.generationScopeKey !== String(attemptId || '')) return null;
    const target = followTargetFor(list, plan.identity.generationType);
    return Object.freeze({
        batchId: plan.batchId,
        attemptId: String(attemptId || ''),
        chatKey,
        targetMessageIndex: target.targetMessageIndex,
        existingTarget: target.existingTarget,
        generationType: String(plan.identity.generationType || 'normal').toLowerCase(),
        anchor: Object.freeze(followAnchor(list, target)),
        plan: deeplyFreeze(JSON.parse(JSON.stringify(plan))),
        selectionMetadata: deeplyFreeze(copySelectionMetadata(metadata)),
        startedAt: Date.now(),
    });
}

function deleteFollowRecord(batchId, { release = false } = {}) {
    const record = activeFollowBatches.get(String(batchId || '')) || null;
    if (!record) return false;
    activeFollowBatches.delete(record.batchId);
    if (release) releasePendingComboBatch({ batchId: record.plan.batchId, identity: record.plan.identity });
    return true;
}

/** Register only after the follow prompt was actually installed, never during preview. */
export function registerRabbitMirrorFollowBatch(chat, attemptId, plan, metadata = null) {
    const record = normalizedFollowRecord(chat, attemptId, plan, metadata);
    if (!record) return false;
    const existingBatch = activeFollowBatches.get(record.batchId);
    if (existingBatch) {
        return existingBatch.attemptId === record.attemptId
            && existingBatch.chatKey === record.chatKey
            && existingBatch.targetMessageIndex === record.targetMessageIndex
            && JSON.stringify(existingBatch.plan) === JSON.stringify(record.plan);
    }
    for (const current of [...activeFollowBatches.values()]) {
        if (current.chatKey === record.chatKey && current.targetMessageIndex === record.targetMessageIndex) {
            deleteFollowRecord(current.batchId, { release: true });
        }
    }
    if (activeFollowBatches.size >= MAX_ACTIVE_FOLLOW_BATCHES) return false;
    activeFollowBatches.set(record.batchId, record);
    return true;
}

function followOwner(record, chat) {
    const list = Array.isArray(chat) ? chat : [];
    if (!record || getCurrentChatKey(list) !== record.chatKey) return null;
    const anchor = list[record.anchor.anchorIndex] || null;
    if (record.anchor.anchorIndex >= 0 && (
        !anchor
        || anchor.is_user !== record.anchor.anchorIsUser
        || hashText(anchor.mes || '') !== record.anchor.anchorBodyHash
        || currentSwipeId(anchor) !== record.anchor.anchorSwipeId
    )) return null;
    const message = list[record.targetMessageIndex];
    if (!message || message.is_user === true || typeof message.mes !== 'string' || !message.mes.trim()) return null;
    const swipeId = currentSwipeId(message);
    const sourceHash = hashText(message.mes);
    if (record.existingTarget && sourceHash === record.anchor.targetBodyHash) return null;
    const parsed = parseMultifaceOutput(message.mes, {
        expectedCount: record.plan.requestedFaceCount,
        allowProse: true,
    });
    if (!parsed.ok) return { record, message, messageIndex: record.targetMessageIndex, swipeId, sourceHash, parsed };
    return { record, message, messageIndex: record.targetMessageIndex, swipeId, sourceHash, parsed };
}

function faceMetadata(record, faceIndex) {
    const supplied = record?.selectionMetadata?.faces?.find(face => face.faceIndex === faceIndex);
    if (supplied) return copySelectionMetadata(supplied);
    const combo = record?.plan?.faces?.[faceIndex]?.combo;
    if (!combo) return null;
    return copySelectionMetadata({
        samplingMode: combo.samplingMode,
        themeIds: combo.themeIds,
        formatIds: combo.formatIds,
        ...presentationModeFields(combo),
        forcedVisualScenery: combo.forcedVisualScenery,
    });
}

export function getRabbitMirrorFollowBatchSources(chat, { terminalMessageIndexes = [] } = {}) {
    const list = Array.isArray(chat) ? chat : [];
    const sets = [];
    for (const record of activeFollowBatches.values()) {
        const owner = followOwner(record, list);
        const partial = !owner?.parsed?.ok && terminalMessageIndexes.includes(owner?.messageIndex)
            && recoverableMultifaceFrames(owner?.parsed).length > 0 && multifaceRecoveryWithinRawBudgets(owner.message.mes);
        if (!owner?.parsed?.ok && !partial) continue;
        const sourceFaces = owner.parsed.faces;
        sets.push({
            batchId: record.batchId,
            plan: record.plan,
            identity: record.plan.identity,
            partial,
            owner: {
                chat: list,
                chatKey: record.chatKey,
                message: owner.message,
                messageIndex: owner.messageIndex,
                swipeId: owner.swipeId,
                sourceHash: owner.sourceHash,
            },
            faces: Array.from({length:record.plan.requestedFaceCount}, (_, index) => {
                const face = sourceFaces.find(item => item.index === index);
                if (face) return {...face, metadata:faceMetadata(record,index)};
                const code = String(owner.parsed.errors?.[0]?.code || 'incomplete-face');
                const html = createMultifaceFailureSlot(index, code);
                return {index, html, summaryHtml:`【兔子镜：第 ${index+1} 面未完成】`, failure:{faceIndex:index,status:'failed',code}, metadata:faceMetadata(record,index)};
            }),
        });
    }
    return sets;
}

export function getRabbitMirrorFollowBatchTargetIndexes(chat) {
    const list = Array.isArray(chat) ? chat : [];
    const chatKey = getCurrentChatKey(list);
    return [...activeFollowBatches.values()]
        .filter(record => record.chatKey === chatKey)
        .map(record => record.targetMessageIndex)
        .filter((value, index, values) => values.indexOf(value) === index)
        .slice(0, MAX_ACTIVE_FOLLOW_BATCHES);
}

export function commitRabbitMirrorFollowBatch(batchId, chat, faceScans = [], expectedOwner = null) {
    const record = activeFollowBatches.get(String(batchId || '')) || null;
    const owner = followOwner(record, chat);
    const partial = expectedOwner?.partial === true && recoverableMultifaceFrames(owner?.parsed).length > 0
        && multifaceRecoveryWithinRawBudgets(owner.message.mes);
    if (!record || (!owner?.parsed?.ok && !partial) || !expectedOwner || !Array.isArray(faceScans)
        || faceScans.length !== record.plan.requestedFaceCount) return false;
    if (expectedOwner.chatKey !== record.chatKey
        || expectedOwner.message !== owner.message
        || expectedOwner.messageIndex !== owner.messageIndex
        || expectedOwner.swipeId !== owner.swipeId
        || expectedOwner.sourceHash !== owner.sourceHash) return false;
    if (hashText(owner.message.mes || '') !== owner.sourceHash || currentSwipeId(owner.message) !== owner.swipeId) return false;
    const committed = commitPendingComboBatch(faceScans, { batchId: record.plan.batchId, identity: record.plan.identity, partial });
    if (!committed) return false;
    recordRabbitMirrorRecipe({
        chat,
        chatKey: record.chatKey,
        messageIndex: owner.messageIndex,
        swipeId: owner.swipeId,
        message: owner.message,
        metadata: record.selectionMetadata || { faces: record.plan.faces.map((face, faceIndex) => faceMetadata(record, faceIndex)) },
        source: 'follow',
    });
    activeFollowBatches.delete(record.batchId);
    return true;
}

export function releaseRabbitMirrorFollowBatch(expected = null) {
    const operationId = String(expected?.operationId || '');
    const batchId = String(expected?.batchId || '');
    let changed = false;
    for (const record of [...activeFollowBatches.values()]) {
        if (batchId && record.batchId !== batchId) continue;
        if (operationId && record.attemptId !== operationId) continue;
        changed = deleteFollowRecord(record.batchId, { release: true }) || changed;
    }
    return changed;
}

export function releaseRabbitMirrorFollowBatchAtMessage(chat, messageIndex) {
    const chatKey = getCurrentChatKey(Array.isArray(chat) ? chat : []);
    if (!chatKey || !Number.isInteger(messageIndex)) return false;
    let changed = false;
    for (const record of [...activeFollowBatches.values()]) {
        if (record.chatKey === chatKey && record.targetMessageIndex === messageIndex) {
            changed = deleteFollowRecord(record.batchId, { release: true }) || changed;
        }
    }
    return changed;
}

export function beginRabbitMirrorGenerationAttempt(chat, attemptId) {
    const list = Array.isArray(chat) ? chat : [];
    const chatKey = getCurrentChatKey(list);
    const lastAssistantIndex = (() => {
        for (let index = list.length - 1; index >= 0; index -= 1) {
            if (list[index] && !list[index].is_user) return index;
        }
        return -1;
    })();
    const endsWithAssistant = !!(list.length && list[list.length - 1] && !list[list.length - 1].is_user);
    const targetMessageIndex = endsWithAssistant ? list.length - 1 : list.length;
    const snapshots = readSnapshots().filter(item => {
        if (item.chatKey !== chatKey) return true;
        if (item.messageIndex === targetMessageIndex) return false;
        if (endsWithAssistant && item.messageIndex === lastAssistantIndex) return false;
        return true;
    });
    writeSnapshots(snapshots);
    const active = {
        chatKey,
        attemptId: String(attemptId || ''),
        startedAt: Date.now(),
        targetMessageIndex,
        selectionMetadata: null,
    };
    writeActiveAttempt(active);
    return active;
}


export function attachRabbitMirrorGenerationSelection(metadata = null) {
    const active = readActiveAttempt();
    if (!active || !metadata || typeof metadata !== 'object') return false;
    active.selectionMetadata = copySelectionMetadata(metadata);
    writeActiveAttempt(active);
    return true;
}

function messageSourceCandidates(message) {
    const values = [];
    const seen = new Set();
    const push = (label, source) => {
        if (typeof source !== 'string') return;
        const text = source.trim();
        if (!text || seen.has(text)) return;
        seen.add(text);
        values.push({ label, source: text });
    };
    const swipeId = currentSwipeId(message);
    if (swipeId >= 0) push('当前 swipe', message?.swipes?.[swipeId]);
    push('mes', message?.mes);
    push('display_text', message?.extra?.display_text);
    return values;
}

export function captureRabbitMirrorGenerationSnapshots(chat) {
    const list = Array.isArray(chat) ? chat : [];
    if (!list.length) return 0;
    const chatKey = getCurrentChatKey(list);
    const active = readActiveAttempt();
    const indexes = [];
    if (active?.chatKey === chatKey && Number.isInteger(active?.targetMessageIndex) && list[active.targetMessageIndex] && !list[active.targetMessageIndex].is_user) {
        indexes.push(active.targetMessageIndex);
    } else {
        for (let index = list.length - 1; index >= 0 && indexes.length < 4; index -= 1) {
            if (list[index] && !list[index].is_user) indexes.push(index);
        }
    }
    let snapshots = readSnapshots();
    let changed = 0;

    for (const messageIndex of indexes) {
        const message = list[messageIndex];
        const swipeId = currentSwipeId(message);
        const key = snapshotKey(chatKey, messageIndex, swipeId);
        const attemptId = active?.chatKey === chatKey && active?.targetMessageIndex === messageIndex
            ? String(active.attemptId || '')
            : '';
        for (const candidate of messageSourceCandidates(message)) {
            if (/\bdata-rm-face\s*=/i.test(candidate.source)) continue;
            const inspection = inspectRabbitMirrorGenerationSource(candidate.source);
            if (!inspection.hasMirror || inspection.isolatedSource.length > MAX_SNAPSHOT_SOURCE_CHARS) continue;
            const existingIndex = snapshots.findIndex(item => item.key === key);
            const existing = existingIndex >= 0 ? snapshots[existingIndex] : null;
            const staleAttempt = !!(attemptId && existing?.attemptId && existing.attemptId !== attemptId);
            const staleTitle = !!(existing?.title && inspection.title && normalizeText(existing.title) !== normalizeText(inspection.title));
            const base = staleAttempt || staleTitle ? null : existing;
            const next = {
                key,
                chatKey,
                messageIndex,
                swipeId,
                attemptId,
                title: inspection.title,
                titleHash: hashText(inspection.title),
                longestSource: !base?.longestSource || inspection.isolatedSource.length > base.longestSource.length
                    ? inspection.isolatedSource
                    : base.longestSource,
                completeSource: inspection.complete && (!base?.completeSource || inspection.isolatedSource.length >= base.completeSource.length)
                    ? inspection.isolatedSource
                    : (base?.completeSource || ''),
                complete: !!(inspection.complete || base?.completeSource),
                reason: inspection.complete ? 'complete' : inspection.reason,
                sourceLabel: candidate.label,
                selectionMetadata: attemptId && active?.selectionMetadata ? { ...active.selectionMetadata } : (base?.selectionMetadata || null),
                ts: Date.now(),
            };
            if (existingIndex >= 0) snapshots.splice(existingIndex, 1);
            snapshots.push(next);
            if (next.selectionMetadata) {
                recordRabbitMirrorRecipe({
                    chat: list,
                    chatKey,
                    messageIndex,
                    swipeId,
                    message,
                    metadata: next.selectionMetadata,
                    source: 'follow',
                });
            }
            changed += 1;
        }
    }
    if (changed) writeSnapshots(snapshots);
    return changed;
}

export function getRabbitMirrorGenerationSnapshot(message, chat, messageIndex, expectedTitle = '', faceIndex = null) {
    const list = Array.isArray(chat) ? chat : [];
    const index = Number.isInteger(messageIndex) ? messageIndex : list.lastIndexOf(message);
    if (index < 0) return null;
    const chatKey = getCurrentChatKey(list);
    const swipeId = currentSwipeId(message);
    if (Number.isInteger(faceIndex) && faceIndex >= 0 && faceIndex < 5) {
        const wanted = normalizeText(expectedTitle);
        for (const set of getRabbitMirrorFollowBatchSources(list)) {
            if (set.owner.message !== message || set.owner.messageIndex !== index || set.owner.chatKey !== chatKey || set.owner.swipeId !== swipeId) continue;
            const face = set.faces.find(item => item.index === faceIndex);
            if (!face?.details) continue;
            const title = normalizeText(face.summaryHtml);
            if (wanted && title !== wanted && !title.includes(wanted) && !wanted.includes(title)) continue;
            return {
                source: face.inner,
                title,
                sourceLabel: '本轮多面完整源码',
                attemptId: set.identity.operationId,
                ts: Date.now(),
                faceIndex,
                selectionMetadata: face.metadata ? copySelectionMetadata(face.metadata) : null,
            };
        }
        return null;
    }
    const key = snapshotKey(chatKey, index, swipeId);
    const wanted = normalizeText(expectedTitle);
    const item = [...readSnapshots()].reverse().find(snapshot => {
        if (snapshot.key !== key || !snapshot.completeSource) return false;
        if (!wanted) return true;
        const title = normalizeText(snapshot.title);
        return title === wanted || title.includes(wanted) || wanted.includes(title);
    });
    if (!item) return null;
    const inspection = inspectRabbitMirrorGenerationSource(item.completeSource, wanted);
    if (!inspection.complete) return null;
    return {
        source: item.completeSource,
        title: item.title,
        sourceLabel: item.sourceLabel,
        attemptId: item.attemptId,
        ts: item.ts,
        selectionMetadata: item.selectionMetadata ? { ...item.selectionMetadata } : null,
    };
}

export function clearRabbitMirrorGenerationSnapshots() {
    for (const record of [...activeFollowBatches.values()]) deleteFollowRecord(record.batchId, { release: true });
    try {
        sessionStorage.removeItem(SNAPSHOT_STORAGE_KEY);
        sessionStorage.removeItem(ACTIVE_ATTEMPT_STORAGE_KEY);
    } catch {
        // no-op
    }
}
