import { getCurrentChatKey } from './storage.js?rmv=1.5.51-narrow1';
import { parseMultifaceOutput, createMultifaceFailureSlot, MULTIFACE_FAILURE_ATTR } from './multifaceProtocol.js?rmv=1.5.51-narrow1';
import { rabbitMirrorMultifaceSourceHash } from './multifaceProof.js?rmv=1.5.51-narrow1';
import { createRabbitMirrorTextReplacementReceipt } from './replacementReceipt.js?rmv=1.5.51-narrow1';

const KEY = 'rabbit_mirror_follow_partial_results_v1';
const MAX_CHARS = 768 * 1024;
const MAX_RECORDS = 120;
let cachedRaw = null;
let cachedRecords = [];
const validationCache = new WeakMap();
const sourceHashes = new WeakMap();
function records() {
    try {
        const raw = localStorage.getItem(KEY) || '[]';
        if (raw.length > MAX_CHARS * 2) return null;
        if (raw === cachedRaw) return cachedRecords;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length > MAX_RECORDS) return null;
        cachedRaw = raw;
        cachedRecords = parsed;
        return cachedRecords;
    } catch { return null; }
}
function owner(chat, index) {
    const message = Array.isArray(chat) ? chat[index] : null;
    if (!message || message.is_user || !Number.isInteger(index)) return null;
    const source=String(message.mes||'');
    let cached=sourceHashes.get(message);
    if(cached?.source!==source){cached={source,hash:rabbitMirrorMultifaceSourceHash(source)};sourceHashes.set(message,cached);}
    return {chatKey:getCurrentChatKey(chat), messageIndex:index, swipeId:Number.isInteger(message.swipe_id)?message.swipe_id:-1,
        sourceHash:cached.hash};
}
function sameOwner(left, right) {
    return !!left && !!right && ['chatKey','messageIndex','swipeId','sourceHash'].every(key => left[key] === right[key]);
}
export function followPartialResultOwnerKey(identity) {
    return JSON.stringify([identity?.chatKey,identity?.messageIndex,identity?.swipeId,identity?.sourceHash]);
}
export function followPartialResultFaceOwnerKey(identity, faceIndex) {
    return JSON.stringify([followPartialResultOwnerKey(identity),faceIndex]);
}
function valid(record) {
    if (!record || typeof record.html !== 'string' || record.html.length > MAX_CHARS || !Array.isArray(record.failedFaces)) return false;
    if(validationCache.has(record)) return validationCache.get(record);
    const parsed = parseMultifaceOutput(record.html);
    if (!parsed.ok || (!record.failedFaces.length && record.completedAfterRetry !== true) || record.failedFaces.length >= parsed.faces.length) return false;
    const seen = new Set();
    const accepted=record.failedFaces.every(failure => {
        if (!Number.isInteger(failure?.faceIndex) || failure.faceIndex < 0 || failure.faceIndex >= parsed.faces.length || seen.has(failure.faceIndex)) return false;
        seen.add(failure.faceIndex);
        // Serialized markers are not authority. A failed slot must equal the
        // exact fixed local card; it can never carry model text, CSS or script.
        return parsed.faces[failure.faceIndex]?.html === createMultifaceFailureSlot(failure.faceIndex, failure.code);
    });
    validationCache.set(record,accepted);
    return accepted;
}
export function readFollowPartialResult(chat, index) {
    const expected = owner(chat, index);
    const record = [...(records() || [])].reverse().find(item => sameOwner(item, expected));
    return valid(record) ? {...record,failedFaces:record.failedFaces.map(failure=>({...failure})),
        textReplacementReceipts:Array.isArray(record.textReplacementReceipts)
            ? record.textReplacementReceipts.map(receipt=>receipt&&typeof receipt==='object'?{...receipt}:null) : []} : null;
}
// Only the sanitizer/quality caller writes accepted faces. On recovery they are
// sanitized and quality checked again; this cache itself is never DOM proof.
export function saveFollowPartialResult(chat, index, expectedOwner, html, failedFaces, appliedRules) {
    const identity = owner(chat, index);
    if (!sameOwner(identity, expectedOwner) || chat[index] !== expectedOwner?.message) return false;
    const record = {...identity, html, failedFaces, ts:Date.now()};
    if (!valid(record)) return false;
    // An explicit appliedRules argument attests the sanitizer caller actually
    // filtered accepted faces. Missing arguments never mint a receipt. Local
    // failure cards are not model text and do not receive filtering authority.
    if (Array.isArray(appliedRules)) record.textReplacementReceipts=parseMultifaceOutput(html).faces.map(face=>
        failedFaces.some(failure=>failure.faceIndex===face.index) ? null
            : createRabbitMirrorTextReplacementReceipt(face.html,appliedRules,followPartialResultFaceOwnerKey(identity,face.index)));
    return persistRecord(record);
}
function persistRecord(record) {
    const identity=record;
    const previous = records();
    // These are durable results, not a disposable cache: refuse capacity
    // overflow rather than silently deleting another message's accepted faces.
    // An unreadable/over-limit store must never be replaced with an empty one.
    if (!previous) return false;
    const next = previous.filter(item => !sameOwner(item, identity)).concat(record);
    if (next.length > MAX_RECORDS) return false;
    const raw = JSON.stringify(next);
    if (raw.length > MAX_CHARS * 2) return false;
    try {
        localStorage.setItem(KEY, raw);
        if (localStorage.getItem(KEY) !== raw) return false;
        cachedRaw = raw; cachedRecords = next;
        return true;
    } catch { return false; }
}

/** Explicit failed-face retry only. The caller must sanitize and quality-check
 * the new face; this function grants no DOM proof. Compare-and-replace the exact
 * prior local result so an awaited request cannot overwrite a newer retry. */
export function replaceFollowPartialResultFace(chat, index, expectedOwner, {expectedHtml, faceIndex, html, appliedRules} = {}) {
    const identity=owner(chat,index);
    if(!sameOwner(identity,expectedOwner)||chat[index]!==expectedOwner?.message) return null;
    const current=readFollowPartialResult(chat,index);
    if(!current||current.html!==expectedHtml||!Number.isInteger(faceIndex)
        ||!current.failedFaces.some(failure=>failure.faceIndex===faceIndex)) return null;
    const old=parseMultifaceOutput(current.html);
    const source=typeof html==='string'?html.trim():'';
    const candidate=parseMultifaceOutput(source,{expectedCount:old.faces.length});
    if(candidate.faces.length!==1||candidate.faces[0]?.index!==faceIndex||candidate.faces[0]?.html!==source
        ||candidate.errors.some(error=>error.code!=='face-count-mismatch')
        ||source.includes(MULTIFACE_FAILURE_ATTR)) return null;
    const merged=old.faces.map(face=>face.index===faceIndex?source:face.html).join('\n');
    if(!parseMultifaceOutput(merged,{expectedCount:old.faces.length}).ok) return null;
    const failedFaces=current.failedFaces.filter(failure=>failure.faceIndex!==faceIndex);
    const record={...identity,html:merged,failedFaces,completedAfterRetry:failedFaces.length===0,ts:Date.now()};
    // A retry may use changed rules. Untouched siblings keep their own receipt;
    // only the newly filtered target is associated with the current rules.
    record.textReplacementReceipts=old.faces.map(face=>face.index===faceIndex
        ? (Array.isArray(appliedRules) ? createRabbitMirrorTextReplacementReceipt(source,appliedRules,followPartialResultFaceOwnerKey(identity,faceIndex)) : null)
        : current.textReplacementReceipts?.[face.index] || null);
    if(!valid(record)||!persistRecord(record)) return null;
    return readFollowPartialResult(chat,index);
}
