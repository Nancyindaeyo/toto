// Split from independentApi.js — mount.

import { presentationModeFields } from '../presentationMode.js?rmv=1.5.53-visualquick1';
import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { independentGenerationTiming } from '../independentTiming.js?rmv=1.5.53-timing1';
import { independentAdvancedOptionsSignature } from '../advancedRequestOptions.js?rmv=1.5.53-cn-boundary1';
import {
    cleanRabbitMirrorOutput,
    refreshRabbitMirrorToolsInScope,
    isolateRabbitMirrorInteractionIds,
    rearmRabbitMirrorSerializedInteractionRoot,
} from '../outputSanitizer.js?rmv=1.5.63';
import { matchesRabbitMirrorTextReplacementReceipt } from '../replacementReceipt.js?rmv=1.5.53-cn-boundary1';
import { parseMultifaceOutput, createMultifaceFailureSlot, MULTIFACE_FAILURE_ATTR } from '../multifaceProtocol.js?rmv=1.5.53-cn-boundary1';
import { getSanitizedRabbitMirrorFaceProof, markSanitizedRabbitMirrorFace, rabbitMirrorMultifaceSourceHash } from '../multifaceProof.js?rmv=1.5.53-visualquick1';
import {
    FOLLOW_MULTIFACE_COMMITTED_EVENT,
    FOLLOW_MULTIFACE_REJECTED_EVENT,
    getRabbitMirrorFollowBatchFailure,
} from '../visualScanner.js?rmv=1.5.63';
import { commitPendingComboBatch, releasePendingComboBatch } from '../storage.js?rmv=1.5.53-visualquick1';
import {
    consumeInjectedFeedbackForSuccessfulIndependentRabbitMirror,
    getActiveFeedbackForCurrentChat,
    markFeedbackCatInjected,
} from '../feedbackCat.js?rmv=1.5.53-cn-boundary1';
import { getRabbitMirrorRecipe, recordRabbitMirrorRecipe } from '../blacklist.js?rmv=1.5.53-image1';
import { readFollowPartialResult, followPartialResultFaceOwnerKey } from '../followPartialResults.js?rmv=1.5.53-visualquick1';
import {
    shouldAutomaticReroll,
    automaticRerollStatusText,
    automaticRerollExhaustedNote,
    shouldAnnounceAutomaticRerollExhausted,
} from '../automaticReroll.js?rmv=1.5.60-fork1';
import {
    FACE_SWIPE_FULL_MESSAGE,
    canAppendSwipe,
    seedSwipeState,
    updateCurrentSwipeHtml,
    readFaceSwipe,
    mutateFaceSwipe,
} from '../swipeVersions.js?rmv=1.5.60-fork1';
import {
    ACTION_BRIDGE_KEY,
    CONTEXT_TOTAL_BUDGET,
    EXTERNAL_SHELL_ATTR,
    FOLLOW_EXTERNAL_ANCHOR_ATTR,
    HISTORICAL_LIGHT_HOST_ATTR,
    HISTORY_EVENT,
    INDEPENDENT_GENERATION_INTENTS_KEY,
    INDEPENDENT_GENERATION_INTENT_TTL_MS,
    INDEPENDENT_GENERATION_INTENT_TYPES,
    INDEPENDENT_REPAIR_PERSIST_EVENT,
    MAX_INDEPENDENT_REQUEST_CHARS,
    RESAY_EVENT,
    RUNTIME_VERSION,
    SOURCE_ATTR,
    byteLength,
    currentRuntime,
    getContext,
    hashText,
    independentMaintenanceLiveRepairLocked,
} from './runtime.js?rmv=1.5.63';
import {
    ACTIVE_GENERATION_WAIT_MS,
    FINAL_RENDER_CONFIRMATION_TTL_MS,
    FINAL_RENDER_POLL_INTERVAL_MS,
    FINAL_RENDER_SOURCE_STABLE_WAIT_MS,
    GENERATION_PLACEHOLDER_POLL_INTERVAL_MS,
    GENERATION_PLACEHOLDER_POLL_LIMIT_MS,
    OWNER_REATTACH_WAIT_MS,
    SOURCE_STABLE_WAIT_MS,
    WEAK_GENERATION_FLAG_GRACE_MS,
    WEAK_GENERATION_SOURCE_STABLE_WAIT_MS,
    advanceOperationEpochForBase,
    automaticDispatchAlreadyConsumed,
    automaticFailureStopFor,
    automaticFailureStops,
    clearAutomaticFailureStop,
    createIndependentRequestDeadline,
    createManualDispatchLease,
    flightIdentity,
    generationPolls,
    globalFlights,
    hasAutomaticFailureStop,
    markAutomaticFailureStop,
    operationEpochForBase,
    pending,
    reserveAutomaticDispatchLease,
} from './flights.js?rmv=1.5.63';
import {
    HISTORY_PANEL_ATTR,
    INDEPENDENT_RECORD_BUDGET_BYTES,
    appendHistoryEntry,
    applyIndependentFaceSwipe,
    canIndependentFaceResay,
    chatPersistenceSlot,
    deleteIndependentFaceSwipe,
    hasIndependentSwipeInitial,
    historyEntriesForSlot,
    independentFaceSwipeView,
    independentRecordWithinBudget,
    persistedOwnerForMessage,
    readStore,
    restoreIndependentFaceSwipeInitial,
    writePersistedOwner,
    writeStore,
} from './persistence.js?rmv=1.5.63';
import {
    appendIndependentFaceSwipe,
    faceDetailsListFromHtml,
    hasEphemeralFaceFailure,
    independentRerollMax,
    scrubSwipeDetailsHtml,
    seedIndependentFaceSwipes,
    showEphemeralFaceFailure,
} from './faceSwipe.js?rmv=1.5.63';
import {
    INDEPENDENT_OWNER_OBSERVATION,
    assistantMessages,
    bindIndependentRecordContinuity,
    chatKey,
    contextBundle,
    createIndependentVisibleTextReader,
    externalHostGenerationActivity,
    findSavedRecord,
    globalWorldInfoContextView,
    globalWorldInfoSnapshotFor,
    hostGenerationActivity,
    hostGenerationLooksActive,
    hostModule,
    independentLineageOriginSlot,
    isRabbitMirrorEligibleAssistantMessage,
    isRabbitMirrorToolResultMessage,
    lastAssistantMessage,
    legacyChatKey,
    legacyMessageSlotKeys,
    lockedIndependentRecordForBase,
    messageBaseSlotKey,
    messageBody,
    messageBodyFingerprint,
    messageDisplayFingerprint,
    messageElement,
    messageReasoningFingerprint,
    messageSlotKey,
    messageSourceFingerprint,
    observeMessageSourceRevision,
    ownerLockForBase,
    recordKey,
    saveRecordForSlot,
    savedIndependentRecordForOwner,
    savedRecordMatchesObserved,
    setOwnerLockForBase,
    slotSearchKeys,
    swipeId,
} from './connection.js?rmv=1.5.63';
import {
    allExternalHosts,
    assertIndependentMarkupComplexityWithDiagnostic,
    callIndependentApi,
    commitIndependentVisualResult,
    externalHosts,
    externalInsertTarget,
    followOriginMarker,
    hasMultifaceMarkup,
    independentExternalEffectiveViewportWidth,
    independentMarkupLimitError,
    independentPaletteFingerprintFromHtml,
    independentSelectedFormatDescriptors,
    legacyFollowOriginContainer,
    markExternalGeometryLifecycle,
    matchingExternalHosts,
    removeDuplicateExternalHosts,
    removeEmptyFollowExternalAnchors,
    republishIndependentTerminalFailure,
    requestIndependentCompletion,
    stampExternalDetailsOwnership,
    wrapIndependentFace,
    wrapPreparedIndependentFace,
    wrappedIndependentMirrorHtml,
} from './request.js?rmv=1.5.63';
import {
    DEFERRED_INTERACTION_RESCUE_ATTR,
    INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR,
    INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR,
    INDEPENDENT_EXTERNAL_STAGE_NEUTRALIZED_ATTR,
    MAINTENANCE_PERSISTED_LAYOUT_ATTR,
    averageExternalShellColors,
    beginHostWorkTiming,
    buildExternalHost,
    captureIndependentContentWidthBaseline,
    clearExternalHostFreshSourceState,
    clearIndependentResayStatus,
    collapseDuplicateIdentityHosts,
    ensureExternalTools,
    ensureReplyGenerationPlaceholder,
    externalHostsOwnedByMesid,
    externalShellColorsFromText,
    externalToolHost,
    extractReadyDetails,
    fallbackExternalDetails,
    hasExplicitSourceReplacementEvidence,
    independentStoredHtmlRestorable,
    initialHtmlForRecord,
    inlineRabbitMirrorDetails,
    isRabbitMirrorDetails,
    markExternalDetails,
    markMountedFaceProofs,
    messageElementForExternalHost,
    mirrorSemanticFingerprint,
    mountExternalFaceDetails,
    mountedIndependentErrorHostMatchesObserved,
    mountedIndependentReadyHostMatchesObserved,
    parseExternalShellColor,
    passiveIndependentFailureForIdentity,
    placeExternalHost,
    prepareQuickResay,
    prepareStoredIndependentRecordHtml,
    quickActionOwnerCurrent,
    quickStartOwners,
    readyDetailsFromHost,
    readyRecordFromHost,
    rebuildCollapsedReadyHost,
    recoverEscapedExternalDetails,
    recoverSavedRecord,
    refreshExistingExternalDetails,
    removeInlineMirrorDuplicate,
    renderExternalErrorBody,
    repatriateExternalDetails,
    replaceExternalMultifaceFace,
    restoreIndependentContentWidthBaseline,
    sanitizeIndependentReadyFragment,
    scheduleExternalShellTint,
    scrubIndependentInteractionState,
    sealIndependentTextReplacementRecord,
    setPlaceholderSummary,
    showIndependentResayStatus,
    transferExternalTools,
    usableReadyDetails,
} from './geometry.js?rmv=1.5.63';
import {
    assertEarlyBodyOwner,
    automaticHostGenerationMayUseTools,
    automaticHostRenderProof,
    cancelEarlyBodyOwner,
    clearAutomaticHostGenerationSettlement,
    clearScheduledGeneration,
    earlyBodyOwnerCurrent,
    hasExistingFollowRabbitMirror,
    queueMessageSync,
    scheduleStartupHistorySync,
    suppressesAutomaticGeneration,
    unlockAutomaticGenerationCutover,
} from './earlyBody.js?rmv=1.5.63';
import {
    automaticGenerationCutovers,
    backgroundLifecycleListenersInstalled,
    backgroundLifecycleNeedsRecovery,
    backgroundResumeTimer,
    generationPlaceholderStartedAt,
    generationPlaceholderTimer,
    hostGenerationHintStartedAt,
    hostGenerationInProgress,
    independentActionBridge,
    lastAppliedIndependentTiming,
    runtimeConfigSequence,
    writeBackgroundLifecycleListenersInstalled,
    writeBackgroundLifecycleNeedsRecovery,
    writeBackgroundResumeTimer,
    writeGenerationPlaceholderStartedAt,
    writeGenerationPlaceholderTimer,
    writeHostGenerationHintStartedAt,
    writeHostGenerationInProgress,
    writeIndependentActionBridge,
    writeLastAppliedIndependentTiming,
} from './lifecycle.js?rmv=1.5.63';

let generationSequence = 0;

let historicalRestoreLightDepth = 0;

let feedbackActionListenerInstalled = false;

let repairPersistenceListenerInstalled = false;

let followMultifaceCommitListenerInstalled = false;

export const orphanExternalHostTimers = new Map();

export const messageSourceRevisions = new Map();
// Legacy "globalWorldInfo" runtime names are retained to avoid widening this patch; the capture
// now reuses activated Global / Character / Chat / Persona World Info under one shared budget.

export const independentRejectedFacePreviews=new Map();

export const INDEPENDENT_REJECTED_PREVIEW_MAX_ENTRIES=20;

export const INDEPENDENT_REJECTED_PREVIEW_MAX_CHARS=1024*1024;

export let independentRejectedPreviewChars=0;

export function writeIndependentRejectedPreviewChars(value){ independentRejectedPreviewChars = value; return value; }

export let independentRejectedPreviewSequence=0;

export const independentRejectedFaceControlsWired=new WeakSet();

export let externalHostSyncIndex=null;

export function writeExternalHostSyncIndex(value){ externalHostSyncIndex = value; return value; }

let lastIndependentDisplayMode=independentDisplayMode();

const mirrorImageTargetCache = new WeakMap();

const MANUAL_INTENTS_KEY='__rabbitMirrorIndependentManualIntentsV1';

const manualPlaceholderOwners=new WeakMap();

export const manualTerminalOwners=new Map();

export const INDEPENDENT_INTENT_OWNER=Symbol.for('rabbitMirror.independentIntentOwner');

export const earlyBodyCredentials=new WeakMap();

export function withHistoricalRestoreLightPass(fn){
 historicalRestoreLightDepth += 1;
 try { return fn(); } finally { historicalRestoreLightDepth = Math.max(0,historicalRestoreLightDepth-1); }
}

function historicalRestoreLightPassActive(){ return historicalRestoreLightDepth>0; }

export function historicalLightHost(host){
 if(!host?.isConnected || host.dataset?.rmSource!=='independent' || host.dataset?.rmState!=='ready') return false;
 const details=host.querySelector?.(':scope > details');
 return host.hasAttribute?.(HISTORICAL_LIGHT_HOST_ATTR) && !!details && externalFaceDetails(host).every(face=>!face.open && !face.hasAttribute?.('open'));
}

function markHistoricalLightHostForRestore(host){
 if(!host?.setAttribute || host.dataset?.rmSource!=='independent' || host.dataset?.rmState!=='ready') return false;
 const details=host.querySelector?.(':scope > details');
 if(historicalRestoreLightPassActive() && details && externalFaceDetails(host).every(face=>!face.open && !face.hasAttribute?.('open'))){
  host.setAttribute(HISTORICAL_LIGHT_HOST_ATTR,'true');
  host.dataset.rmGeometryMode='historical-collapsed-deferred';
  return true;
 }
 if(externalFaceDetails(host).some(face=>face.open || face.hasAttribute?.('open'))) host.removeAttribute?.(HISTORICAL_LIGHT_HOST_ATTR);
 return false;
}

export function externalFaceDetails(host){
 return [...(host?.children||[])].filter(node=>node?.tagName==='DETAILS').slice(0,5);
}

export function serializeExternalFaceDetails(host,{scrubTools=true}={}){
 const faces=externalFaceDetails(host);
 return faces.map((details,index)=>{
  const clone=details.cloneNode(true);
  clone.querySelectorAll?.('[data-rabbit-mirror-reference-note]')?.forEach(node=>node.remove());
  if(scrubTools) clone.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-interaction-diagnostic], [data-rabbit-mirror-interaction-home]')?.forEach(node=>node.remove());
  stripIndependentTransientLayoutArtifacts(clone);
  clone.removeAttribute?.(DEFERRED_INTERACTION_RESCUE_ATTR);
  return faces.length>1?wrapIndependentFace(clone.outerHTML,index):String(clone.outerHTML||'');
 }).join('\n');
}

export function clearIndependentRejectedFacePreviews(){
 independentRejectedFacePreviews.clear(); independentRejectedPreviewChars=0;
}

function independentDisplayMode(){
 return getSettings().independentDisplayMode==='external_then_inline' ? 'external_then_inline' : 'external';
}

export function consumeIndependentDisplayModeChange(){
 const next=independentDisplayMode();
 const changed=next!==lastIndependentDisplayMode;
 lastIndependentDisplayMode=next;
 return changed;
}

export function independentPlacementForState(state='ready'){
 return state==='ready' && independentDisplayMode()==='external_then_inline' ? 'inline' : 'external';
}

export function stripIndependentTransientLayoutArtifacts(details){
 if(!details?.querySelectorAll) return details;
 details.querySelectorAll('[data-rm-rejected-preview-host]').forEach(node=>{ node.replaceChildren(); node.hidden=true; });
 // One-shot diagnostics belong to the current live DOM only. A cached/remounted
 // diagnostic panel has no JS listeners and becomes an uncloseable dead UI shell.
 details.querySelectorAll('[data-rabbit-mirror-interaction-diagnostic]').forEach(node=>node.remove());
 // A user-triggered Maintenance Rabbit repair is not a disposable runtime rescue.
 // Keep its media-scoped mobile/layout repair CSS across independent external remounts.
 // Runtime-only spatial fitting remains disposable and is always recalculated.
 const preserveMaintenance=details.getAttribute?.(MAINTENANCE_PERSISTED_LAYOUT_ATTR)==='true';
 // Restore exact pre-rescue inline style when 1.3.3 itself widened the inner carrier.
 for(const element of details.querySelectorAll(`[${INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR}], [${INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR}]`)){
  restoreIndependentContentWidthBaseline(element);
 }
 const transientStyles=['style[data-rabbit-mirror-independent-mobile-spatial-style]'];
 if(!preserveMaintenance){
  transientStyles.push('style[data-rabbit-mirror-mobile-layout-rescue]','style[data-rabbit-mirror-visual-scenery-overflow-rescue]','style[data-rabbit-mirror-viewport-layout-rescue]');
 }
 details.querySelectorAll(transientStyles.join(',')).forEach(node=>node.remove());
 if(!preserveMaintenance){
  details.querySelectorAll('[data-rm-mobile-visual-scenery-overflow-host]').forEach(node=>node.remove());
  details.querySelectorAll('[data-rm-mobile-visual-scenery-overflow-source]').forEach(node=>node.removeAttribute('data-rm-mobile-visual-scenery-overflow-source'));
 }
 const runtimeAttrs=[
  'data-rabbit-mirror-independent-mobile-spatial-count',
  'data-rm-independent-mobile-spatial-scroll','data-rm-independent-mobile-spatial-canvas'
 ];
 const maintenanceAttrs=[
  'data-rabbit-mirror-mobile-layout-scope','data-rabbit-mirror-mobile-layout-count',
  'data-rabbit-mirror-visual-scenery-overflow-count','data-rabbit-mirror-viewport-layout-count',
  'data-rm-mobile-fit','data-rm-mobile-min','data-rm-mobile-grid-collapse','data-rm-mobile-matrix-preserve',
  'data-rm-mobile-matrix-active','data-rm-mobile-matrix-cell','data-rm-mobile-flex-wrap','data-rm-mobile-state-row',
  'data-rm-mobile-flex-stack','data-rm-mobile-single-column','data-rm-mobile-fluid-title','data-rm-mobile-compact-padding',
  'data-rm-mobile-compact-gap','data-rm-mobile-media','data-rm-mobile-scroll','data-rm-mobile-break-text',
  'data-rm-mobile-state-content','data-rm-mobile-state-active','data-rm-mobile-section-stack-preserve','data-rm-mobile-screen-shell-preserve',
  'data-rm-mobile-relation-tree','data-rm-mobile-relation-branch','data-rm-mobile-relation-cell','data-rm-mobile-relation-detail',
  'data-rm-mobile-relation-side',
  'data-rm-squeezed-span','data-rm-squeezed-scroll','data-rm-squeezed-scroll-y','data-rm-squeezed-pointer'
 ];
 const attrs=preserveMaintenance ? runtimeAttrs : [...runtimeAttrs,...maintenanceAttrs];
 const nodes=[details,...details.querySelectorAll('*')];
 for(const node of nodes){
  for(const attr of attrs) node.removeAttribute?.(attr);
  node.style?.removeProperty?.('--rm-mobile-spatial-natural-width');
 }
 return details;
}


export function independentPrimaryVisualShell(details){
 if(!details?.querySelectorAll || typeof getComputedStyle!=='function') return null;
 const body=[...(details.children||[])].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node?.tagName));
 if(!body?.isConnected) return null;
 let bodyRect; try{ bodyRect=body.getBoundingClientRect(); }catch{return null;}
 const bodyWidth=Math.max(1,Number(bodyRect?.width||0));
 const bodyHeight=Math.max(1,Number(bodyRect?.height||0));
 const nodes=[body,...body.querySelectorAll('div,section,article,main,figure')].slice(0,320);
 const candidates=[];
 for(const element of nodes){
  if(!element?.isConnected || element.closest?.('[data-rabbit-mirror-tool-entry-host]')) continue;
  let style,rect; try{ style=getComputedStyle(element); rect=element.getBoundingClientRect(); }catch{continue;}
  if(!style || style.display==='none' || style.visibility==='hidden' || Number(style.opacity||1)<.08) continue;
  const width=Math.max(0,Number(rect?.width||0));
  const height=Math.max(0,Number(rect?.height||0));
  if(width<180 || height<220) continue;
  const widthRatio=width/bodyWidth;
  const heightRatio=height/bodyHeight;
  if(widthRatio<.34 || widthRatio>.96 || heightRatio<.28) continue;
  const signature=`${element.id||''} ${element.className||''} ${element.getAttribute?.('aria-label')||''} ${element.getAttribute?.('style')||''}`.toLowerCase();
  const strongHint=/(?:phone|shell|device|frame|screen|terminal|monitor|passport|card|document|paper|page|book|镜|壳|界面|手机|证件|书页|档案|屏幕|终端)/i.test(signature);
  const objectLike=/(?:phone|device|terminal|monitor|passport|document|paper|page|book|手机|证件|书页|档案|屏幕|终端)/i.test(signature);
  const background=parseExternalShellColor(style.backgroundColor);
  const gradient=averageExternalShellColors(externalShellColorsFromText(style.backgroundImage));
  const borderRadius=Math.max(...String(style.borderRadius||'0').split(/[\s\/]+/).map(value=>parseFloat(value)||0),0);
  const borderWidth=Math.max(...String(style.borderWidth||'0').split(/\s+/).map(value=>parseFloat(value)||0),0);
  const hasBackground=!!((background && background.a>=.18) || gradient);
  const hasFrame=borderRadius>=14 || borderWidth>=2;
  if(!strongHint && !hasBackground && !hasFrame) continue;
  let depth=0,current=element; while(current&&current!==body&&depth<14){ depth++; current=current.parentElement; }
  const centerOffset=Math.abs((Number(rect.left||0)+width/2)-(Number(bodyRect.left||0)+bodyWidth/2))/Math.max(1,bodyWidth);
  const area=width*height;
  const areaRatio=Math.min(1.6,area/Math.max(1,bodyWidth*bodyHeight));
  const portraitBonus=height>=width*1.12 ? .65 : 0;
  const score=areaRatio*6 + widthRatio*2.8 + heightRatio*1.4 + (strongHint?2.8:0) + (hasBackground?1.2:0) + (hasFrame?1.1:0) + portraitBonus - centerOffset*2 + Math.max(0,.9-depth*.08);
  candidates.push({element,width,height,widthRatio,heightRatio,area,score,strongHint,objectLike,hasFrame,hasBackground});
 }
 candidates.sort((a,b)=>b.score-a.score);
 return candidates[0]||null;
}


function independentPrimaryContentCarrier(details){

 if(!details?.querySelectorAll || typeof getComputedStyle!=='function') return null;
 const body=[...(details.children||[])].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node?.tagName));
 if(!body?.isConnected) return null;
 let bodyRect; try{ bodyRect=body.getBoundingClientRect(); }catch{return null;}
 const bodyWidth=Math.max(1,Number(bodyRect?.width||0));
 const bodyHeight=Math.max(1,Number(bodyRect?.height||0));
 const compact=value=>String(value||'').replace(/\s+/g,'').trim();
 const totalText=Math.max(1,compact(body.textContent).length);
 const visualShell=independentPrimaryVisualShell(details)?.element || null;
 const candidates=[];
 const nodes=[...body.querySelectorAll('main,article,section,figure,div')].slice(0,260);
 for(const element of nodes){
  if(!element?.isConnected || element.closest?.('[data-rabbit-mirror-tool-entry-host]')) continue;
  // 1.2.67's mobile rescue deliberately preserved screen/device shells instead of
  // treating them as a generic narrow text carrier. Keep that separation here too:
  // the object itself is sized by the dedicated adaptive-media path below.
  if(visualShell && (element===visualShell || visualShell.contains?.(element))) continue;
  let style,rect; try{ style=getComputedStyle(element); rect=element.getBoundingClientRect(); }catch{continue;}
  if(!style || style.display==='none' || style.visibility==='hidden' || Number(style.opacity||1)<.08) continue;
  const width=Math.max(0,Number(rect?.width||0));
  const height=Math.max(0,Number(rect?.height||0));
  if(width<120 || height<120) continue;
  const widthRatio=width/bodyWidth;
  const heightRatio=Math.min(1.4,height/bodyHeight);
  if(widthRatio<.42 || widthRatio>.93) continue;
  const textLength=compact(element.textContent).length;
  const textShare=Math.min(1,textLength/totalText);
  if(textLength<140 || textShare<.42) continue;
  const background=parseExternalShellColor(style.backgroundColor);
  const hasBackground=!!(background && background.a>=.20) || (style.backgroundImage && style.backgroundImage!=='none');
  if(!hasBackground) continue;
  let depth=0,current=element;
  while(current&&current!==body&&depth<12){ depth++; current=current.parentElement; }
  const score=textShare*5 + widthRatio*1.2 + heightRatio + (hasBackground ? 0.8 : 0) + Math.min(.8,depth*.08);
  candidates.push({element,widthRatio,textShare,score});
 }
 candidates.sort((a,b)=>b.score-a.score);
 return candidates[0]||null;
}




function independentExternalCompactTarget(details){
 if(!details?.querySelectorAll || typeof getComputedStyle!=='function') return null;
 const body=[...(details.children||[])].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node?.tagName));
 if(!body?.isConnected) return null;
 let bodyRect;
 try{ bodyRect=body.getBoundingClientRect(); }catch{return null;}
 const bodyWidth=Math.max(1,Number(bodyRect?.width||0));
 const bodyCenter=Number(bodyRect.left||0)+bodyWidth/2;
 const compact=value=>String(value||'').replace(/\s+/g,'').trim();
 const totalText=Math.max(1,compact(body.textContent).length);
 const candidates=[];
 const seen=new Set();
 const scoreCandidate=(element,baseScore=0)=>{
  if(!element?.isConnected || element===body || seen.has(element) || element.closest?.('[data-rabbit-mirror-tool-entry-host]')) return;
  let style,rect;
  try{ style=getComputedStyle(element); rect=element.getBoundingClientRect(); }catch{return;}
  if(!style || style.display==='none' || style.visibility==='hidden' || Number(style.opacity||1)<.08) return;
  const width=Math.max(0,Number(rect?.width||0));
  const height=Math.max(0,Number(rect?.height||0));
  if(width<180 || height<140) return;
  const widthRatio=width/bodyWidth;
  if(widthRatio<.18 || widthRatio>.90) return;
  const centerOffset=Math.abs((Number(rect.left||0)+width/2)-bodyCenter)/Math.max(1,bodyWidth);
  if(centerOffset>.14) return;
  const textLength=compact(element.textContent).length;
  const textShare=Math.min(1,textLength/totalText);
  const signature=`${element.id||''} ${element.className||''} ${element.getAttribute?.('aria-label')||''} ${element.getAttribute?.('style')||''}`.toLowerCase();
  const semantic=/(?:document|paper|page|book|brochure|report|sheet|form|poster|certificate|flyer|catalog|manual|letter|newspaper|magazine|ticket|receipt|phone|shell|device|frame|screen|terminal|monitor|passport|card|档案|报告|楼书|手册|纸|书页|票据|证书|刊物|报纸|杂志|手机|证件|屏幕|终端|壳|镜)/i.test(signature);
  const background=parseExternalShellColor(style.backgroundColor);
  const hasBackground=!!(background && background.a>=.16) || (style.backgroundImage && style.backgroundImage!=='none');
  const borderWidth=Math.max(...String(style.borderWidth||'0').split(/\s+/).map(value=>parseFloat(value)||0),0);
  const borderRadius=Math.max(...String(style.borderRadius||'0').split(/[\s\/]+/).map(value=>parseFloat(value)||0),0);
  const hasFrame=borderWidth>=1 || borderRadius>=12 || (style.boxShadow && style.boxShadow!=='none');
  const inlineStyle=String(element.getAttribute?.('style')||'').toLowerCase();
  const explicitWidth=/(?:^|;)\s*(?:width|max-width|min-width)\s*:/.test(inlineStyle)
   || (String(style.width||'').trim() && String(style.width||'').trim()!=='auto' && Math.abs(width-bodyWidth)>24)
   || (String(style.maxWidth||'').trim() && String(style.maxWidth||'').trim()!=='none');
  if(!semantic && !hasBackground && !hasFrame && !explicitWidth) return;
  if(textLength<60 && !semantic && !hasFrame) return;
  const portraitBonus=height>=width*1.04 ? .6 : 0;
  const narrowBonus=Math.max(0,(.92-widthRatio)*3.6);
  const textBonus=Math.min(2.2,textShare*2.6);
  const score=baseScore + narrowBonus + textBonus + (semantic?1.8:0) + (hasBackground?1.0:0) + (hasFrame?1.0:0) + (explicitWidth?1.4:0) + portraitBonus - centerOffset*4;
  seen.add(element);
  candidates.push({element,width,height,widthRatio,textShare,score});
 };
 const visual=independentPrimaryVisualShell(details);
 if(visual?.element) scoreCandidate(visual.element,6.2);
 const carrier=independentPrimaryContentCarrier(details);
 if(carrier?.element) scoreCandidate(carrier.element,4.8);
 for(const element of [...(body.children||[])]) scoreCandidate(element,3.6);
 for(const element of [...body.querySelectorAll('main,article,section,figure,div')].slice(0,240)) scoreCandidate(element,0);
 candidates.sort((a,b)=>b.score-a.score);
 return candidates[0]||null;
}


export function clearIndependentExternalCompactShellWidth(host){
 if(!host?.style) return;
 host.removeAttribute('data-rm-independent-external-compact-shell');
 host.style.removeProperty('--rm-external-compact-width');
}


function compactIndependentExternalShellToPrimaryVisual(host){
 if(externalFaceDetails(host).length>1) return false;
 if(!host?.isConnected || host.dataset.rmSource!=='independent' || host.dataset.rmState!=='ready' || host.dataset.rmPlacement!=='external') return false;
 const viewportWidth=independentExternalEffectiveViewportWidth();
 if(viewportWidth>0 && viewportWidth<900) return false;
 const details=host.querySelector?.(':scope > details[data-rabbit-mirror-external-details="true"], :scope > details');
 const summary=details?.querySelector?.(':scope > summary');
 if(!details || !summary || typeof getComputedStyle!=='function') return false;
 const body=[...(details.children||[])].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node?.tagName));
 if(!body?.isConnected) return false;
 let bodyRect,hostRect,summaryRect;
 try{ bodyRect=body.getBoundingClientRect(); hostRect=host.getBoundingClientRect(); summaryRect=summary.getBoundingClientRect(); }catch{return false;}
 const bodyWidth=Math.max(0,Number(bodyRect?.width||0));
 const hostWidth=Math.max(0,Number(hostRect?.width||0));
 if(bodyWidth<260 || hostWidth<320 || bodyWidth>hostWidth+2) return false;
 const target=independentExternalCompactTarget(details);
 if(!target?.element) return false;
 const targetWidth=Math.max(0,Number(target.width||0));
 const targetHeight=Math.max(0,Number(target.height||0));
 if(targetWidth<180 || targetHeight<140) return false;
 const summaryWidth=Math.max(0,Number(summaryRect?.width||0));
 const laneWidth=Math.max(0,Number(hostWidth||0));
 let compactWidth=Math.max(targetWidth,summaryWidth);
 compactWidth=Math.min(compactWidth,laneWidth);
 if(!Number.isFinite(compactWidth) || compactWidth<220) return false;
 if(compactWidth>=laneWidth-8) return false;
 host.style.setProperty('--rm-external-compact-width',`${Math.round(compactWidth*10)/10}px`);
 host.setAttribute('data-rm-independent-external-compact-shell','true');
 host.dataset.rmIndependentExternalCompactShell='primary-visual';
 return true;
}


function neutralizeIndependentExternalWideStage(host){
 if(externalFaceDetails(host).length>1) return false;
 if(!host?.isConnected || host.dataset.rmSource!=='independent' || host.dataset.rmState!=='ready' || host.dataset.rmPlacement!=='external') return false;
 // PC-only, one-shot ready postprocess. This does not install any observer/listener.
 // It fixes the specific pure-external composition where a full-width solid stage
 // paints the whole content lane while the actual document/object is a much narrower
 // centered child. The object keeps its native size/background; only the redundant
 // solid stage color is neutralized.
 const viewportWidth=independentExternalEffectiveViewportWidth();
 if(viewportWidth>0 && viewportWidth<900) return false;
 const details=host.querySelector?.(':scope > details[data-rabbit-mirror-external-details="true"], :scope > details');
 if(!details || typeof getComputedStyle!=='function') return false;
 const body=[...(details.children||[])].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node?.tagName));
 if(!body?.isConnected) return false;
 let bodyStyle,bodyRect;
 try{ bodyStyle=getComputedStyle(body); bodyRect=body.getBoundingClientRect(); }catch{return false;}
 const bodyWidth=Math.max(0,Number(bodyRect?.width||0));
 const bodyHeight=Math.max(0,Number(bodyRect?.height||0));
 if(bodyWidth<760 || bodyHeight<260) return false;
 const stageColor=parseExternalShellColor(bodyStyle?.backgroundColor);
 if(!stageColor || stageColor.a<.16) return false;
 // Keep actual scenery/illustration backgrounds. This rescue is only for a solid
 // color lane like the pale-yellow field in the reported PC pure-external case.
 if(bodyStyle?.backgroundImage && bodyStyle.backgroundImage!=='none') return false;

 const compact=value=>String(value||'').replace(/\s+/g,'').trim();
 const totalText=Math.max(1,compact(body.textContent).length);
 const bodyCenter=Number(bodyRect.left||0)+bodyWidth/2;
 const candidates=[];
 const nodes=[...body.querySelectorAll('main,article,section,figure,div')].slice(0,320);
 for(const element of nodes){
  if(!element?.isConnected || element.closest?.('[data-rabbit-mirror-tool-entry-host]')) continue;
  let style,rect; try{ style=getComputedStyle(element); rect=element.getBoundingClientRect(); }catch{continue;}
  if(!style || style.display==='none' || style.visibility==='hidden' || Number(style.opacity||1)<.08) continue;
  const width=Math.max(0,Number(rect?.width||0));
  const height=Math.max(0,Number(rect?.height||0));
  if(width<220 || height<240) continue;
  const widthRatio=width/bodyWidth;
  if(widthRatio<.12 || widthRatio>.72) continue;
  const centerOffset=Math.abs((Number(rect.left||0)+width/2)-bodyCenter)/Math.max(1,bodyWidth);
  if(centerOffset>.13) continue;
  const textLength=compact(element.textContent).length;
  const textShare=Math.min(1,textLength/totalText);
  if(textLength<120 || textShare<.68) continue;
  const background=parseExternalShellColor(style.backgroundColor);
  const hasBackground=!!(background && background.a>=.16) || (style.backgroundImage && style.backgroundImage!=='none');
  const borderWidth=Math.max(...String(style.borderWidth||'0').split(/\s+/).map(value=>parseFloat(value)||0),0);
  const shadow=String(style.boxShadow||'none');
  const signature=`${element.id||''} ${element.className||''} ${element.getAttribute?.('aria-label')||''}`.toLowerCase();
  const semantic=/(?:document|paper|page|book|brochure|report|sheet|form|poster|certificate|flyer|catalog|manual|letter|newspaper|magazine|ticket|receipt|档案|报告|楼书|手册|纸|书页|票据|证书|刊物|报纸|杂志)/i.test(signature);
  const framed=hasBackground && (borderWidth>=1 || (shadow && shadow!=='none'));
  if(!semantic && !framed) continue;
  const portraitBonus=height>=width*1.08 ? 1.2 : 0;
  const score=textShare*6 + (1-widthRatio)*2.2 + portraitBonus + (semantic?1.8:0) + (framed?1.1:0) - centerOffset*4;
  candidates.push({element,score,widthRatio,textShare});
 }
 candidates.sort((a,b)=>b.score-a.score);
 const object=candidates[0];
 if(!object?.element) return false;

 captureIndependentContentWidthBaseline(body);
 body.style.setProperty('background','transparent','important');
 body.style.setProperty('background-color','transparent','important');
 body.style.setProperty('background-image','none','important');
 body.setAttribute(INDEPENDENT_EXTERNAL_STAGE_NEUTRALIZED_ATTR,'true');
 host.dataset.rmIndependentExternalStageNeutralized='solid-wide-stage';
 return true;
}



function rescueIndependentExternalContentWidth(host){
 if(!host?.isConnected || host.dataset.rmSource!=='independent' || host.dataset.rmState!=='ready' || host.dataset.rmPlacement!=='external') return false;
 const details=host.querySelector?.(':scope > details[data-rabbit-mirror-external-details="true"], :scope > details');
 if(!details) return false;
 const carrier=independentPrimaryContentCarrier(details);
 if(!carrier?.element || carrier.widthRatio>=.84) return false;
 // The old gate used window.innerWidth. External RabbitMirror itself is capped near 560px,
 // so a desktop browser could be 2552px wide while the actual mirror carrier is still narrow.
 // Decide from the mounted external shell, not the browser window.
 let hostWidth=0;
 try{ hostWidth=Number(host.getBoundingClientRect?.().width||0); }catch{}
 if(hostWidth>0 && hostWidth>900) return false;
 const element=carrier.element;
 captureIndependentContentWidthBaseline(element);
 element.style.setProperty('width','calc(100% - 10px)','important');
 element.style.setProperty('max-width','none','important');
 element.style.setProperty('min-width','0','important');
 element.style.setProperty('margin-left','auto','important');
 element.style.setProperty('margin-right','auto','important');
 element.style.setProperty('box-sizing','border-box','important');
 element.setAttribute(INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR,'true');
 host.dataset.rmIndependentContentWidthRescue='true';
 return true;
}

function rescueIndependentExternalVisualShell(host){
 if(!host?.isConnected || host.dataset.rmSource!=='independent' || host.dataset.rmState!=='ready' || host.dataset.rmPlacement!=='external') return false;
 const details=host.querySelector?.(':scope > details[data-rabbit-mirror-external-details="true"], :scope > details');
 if(!details) return false;
 const visual=independentPrimaryVisualShell(details);
 // Only size a clearly object-like medium (phone/device/document/book/etc.).
 // Ordinary scene/page containers keep the model's native composition.
 if(!visual?.element || !visual.objectLike) return false;
 const naturalWidth=Math.max(1,Number(visual.width||visual.element.getBoundingClientRect?.().width||0));
 const naturalHeight=Math.max(1,Number(visual.height||visual.element.getBoundingClientRect?.().height||0));
 if(naturalWidth<=0 || naturalHeight<=0) return false;

 // 1.2.67 did not force a device to fill the mirror; the outer carrier was
 // responsive while the object kept its own proportions. Recreate that behavior
 // with a fluid CSS size instead of calculating one fixed pixel width at mount.
 const portrait=naturalHeight>=naturalWidth*1.08;
 const widthRule=portrait
  ? 'clamp(320px, 78%, 460px)'
  : 'clamp(320px, 86%, 620px)';
 const element=visual.element;
 captureIndependentContentWidthBaseline(element);
 element.style.setProperty('width',widthRule,'important');
 element.style.setProperty('max-width','calc(100% - 12px)','important');
 element.style.setProperty('min-width','0','important');
 element.style.setProperty('margin-left','auto','important');
 element.style.setProperty('margin-right','auto','important');
 element.style.setProperty('box-sizing','border-box','important');
 const inlineStyle=String(element.getAttribute?.('style')||'').toLowerCase();
 if(/(?:^|;)\s*height\s*:/.test(inlineStyle)){
  element.style.setProperty('height','auto','important');
  element.style.setProperty('aspect-ratio',`${Math.round(naturalWidth)} / ${Math.round(naturalHeight)}`,'important');
 }
 element.setAttribute(INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR,'true');
 host.dataset.rmIndependentVisualShellRescue='adaptive-clamp';
 return true;
}


export function scheduleIndependentReadyPostprocess(host,key='',html=''){
 if(!host || host.dataset.rmSource!=='independent' || host.dataset.rmState!=='ready') return false;
 if(historicalLightHost(host)){
  host.dataset.rmIndependentPostprocessDeferred='history-open';
  return false;
 }
 delete host.dataset.rmIndependentPostprocessDeferred;
 const source=String(html||host.__rabbitMirrorIndependentSource||'');
 const signature=`${String(host.dataset.rmPlacement||'external')}|${String(key||host.dataset.rmKey||'')}|${source.length}:${hashText(source)}`;
 const placementDirty=host.__rabbitMirrorIndependentPlacementDirty===true;
 const scheduled=!!(host.__rabbitMirrorIndependentPostFrame || host.__rabbitMirrorIndependentPostTimer);
 if(!placementDirty && host.dataset.rmIndependentPostprocessSignature===signature && !scheduled) return false;
 if(scheduled && host.__rabbitMirrorIndependentPostPendingSignature===signature) return false;
 if(host.__rabbitMirrorIndependentPostFrame) globalThis.cancelAnimationFrame?.(host.__rabbitMirrorIndependentPostFrame);
 if(host.__rabbitMirrorIndependentPostTimer) clearTimeout(host.__rabbitMirrorIndependentPostTimer);
 host.__rabbitMirrorIndependentPostPendingSignature=signature;
 const run=()=>{
  host.__rabbitMirrorIndependentPostTimer=0;
  if(!host.isConnected || host.dataset.rmState!=='ready') return;
  if(host.__rabbitMirrorIndependentPostPendingSignature!==signature) return;
  host.__rabbitMirrorIndependentPostPendingSignature='';
  if(host.dataset.rmPlacement==='external'){
   // Cached/runtime-only layout artifacts are cleaned before mount. Do not clean the
   // already-mounted ready DOM here: Maintenance Rabbit may have intentionally written
   // a persistent repair into this exact external mirror.
   delete host.dataset.rmIndependentContentWidthRescue;
   delete host.dataset.rmIndependentVisualShellRescue;
   delete host.dataset.rmIndependentExternalStageNeutralized;
   delete host.dataset.rmIndependentExternalCompactShell;
   clearIndependentExternalCompactShellWidth(host);
   neutralizeIndependentExternalWideStage(host);
   compactIndependentExternalShellToPrimaryVisual(host);
  }
  scheduleExternalShellTint(host,source);
  host.dataset.rmIndependentPostprocessSignature=signature;
  host.__rabbitMirrorIndependentPlacementDirty=false;
 };
 if(typeof requestAnimationFrame==='function'){
  host.__rabbitMirrorIndependentPostFrame=requestAnimationFrame(()=>{
   host.__rabbitMirrorIndependentPostFrame=0;
   host.__rabbitMirrorIndependentPostTimer=setTimeout(run,80);
  });
 }else host.__rabbitMirrorIndependentPostTimer=setTimeout(run,80);
 return true;
}


export function ensureExternalUi(el,key,html,state='ready',source='independent',sourceHash='',savedRecord=null){
 const end=beginHostWorkTiming('independent.ensureExternalUi');
 try{ return ensureExternalUiCore(el,key,html,state,source,sourceHash,savedRecord); }finally{ end?.(); }
}

function ensureExternalUiCore(el,key,html,state='ready',source='independent',sourceHash='',savedRecord=null){
 const body=externalInsertTarget(el); if(!body) return null;
 let locallyPrepared=false;
 if(state==='ready' && source==='independent' && savedRecord?.html===html){
  html=prepareStoredIndependentRecordHtml(savedRecord,key);
  if(!html) return null;
  locallyPrepared=true;
 }
 const reconciled=collapseDuplicateIdentityHosts(el,key,source,sourceHash);
 const same=matchingExternalHosts(el,key,source);
 // Reuse the existing host across pure-external <-> external-then-inline mode
 // switches. A mode change is a DOM move only; it must never allocate another
 // shell or trigger a second independent generation.
 let host=same[0] || reconciled || externalHosts(el).find(node=>node.dataset.rmSource===source) || null;
 if(!host){
   const escaped=[...(el.querySelectorAll?.('details[data-rabbit-mirror-external-details="true"]')||[])].find(details=>
    details.dataset.rabbitMirrorExternalSource===String(source||'independent')
    && (!details.dataset.rabbitMirrorExternalOwner || details.dataset.rabbitMirrorExternalOwner===String(key||''))
   );
   host=document.createElement('div');
   host.setAttribute(SOURCE_ATTR,'true');
   host.setAttribute(EXTERNAL_SHELL_ATTR,'true');
   host.className='rabbit-mirror-external-host rabbit-mirror-external-shell';
   host.dataset.rmKey=key;
   host.dataset.rmSource=source;
   host.dataset.rmState=state;
   if(state!=='loading') delete host.dataset.rmReplyGenerationPlaceholder;
   if(sourceHash) host.dataset.rmSourceHash=String(sourceHash);
   if(escaped && !hasMultifaceMarkup(html)){ markExternalDetails(escaped,key,source); host.append(escaped); }
   else host=buildExternalHost(key,html,state,source,locallyPrepared);
   host.__rabbitMirrorIndependentSource = state==='ready' ? String(html||'') : '';
   if(sourceHash) host.dataset.rmSourceHash=String(sourceHash);
   stampExternalDetailsOwnership(host);
   if(state==='ready') markMountedFaceProofs(host,source,savedRecord?.apiRequest);
   markHistoricalLightHostForRestore(host);
   placeExternalHost(el,host,key,source);
   removeDuplicateExternalHosts(el,host,source);
   if(state==='ready') scheduleExternalShellTint(host,html);
   ensureExternalTools(host);
   if(state==='ready' && source==='independent') scheduleIndependentReadyPostprocess(host,key,html);
   return host;
 }
 host.dataset.rmKey=key;
 host.dataset.rmSource=source;
 host.dataset.rmState=state;
 if(state!=='loading') delete host.dataset.rmReplyGenerationPlaceholder;
 if(sourceHash) host.dataset.rmSourceHash=String(sourceHash);
 stampExternalDetailsOwnership(host);
 if(state==='ready') markMountedFaceProofs(host,source,savedRecord?.apiRequest);
 placeExternalHost(el,host,key,source);
 removeDuplicateExternalHosts(el,host,source);
 let current=repatriateExternalDetails(el,host,key,source);
 if(!current) current=recoverEscapedExternalDetails(el,host,key,source);
 const wasOpen=!!current?.hasAttribute?.('open');
 const currentFaces=externalFaceDetails(host);
 const currentReady=currentFaces.length && currentFaces.every(usableReadyDetails) ? currentFaces[0] : null;
  if(state==='ready'){
   clearExternalHostFreshSourceState(host);
   // While the maintenance rabbit is repairing an independent mirror, the live
   // DOM is the authoritative working copy. Do not let a routine sync/remount
   // replace it with the older cached/chatMetadata HTML before the repair-persist
   // bridge has committed the new snapshot.
   if(currentReady && independentMaintenanceLiveRepairLocked(host)){
     if(wasOpen) currentReady.setAttribute('open','');
     ensureExternalTools(host);
     return host;
   }
    const expectedFaces=hasMultifaceMarkup(html)?parseMultifaceOutput(html):null;
     const faceCountMatches=expectedFaces
      ? (expectedFaces.ok && externalFaceDetails(host).length===expectedFaces.faces.length)
      : externalFaceDetails(host).length===1;
    const sameReadySource=currentReady && faceCountMatches && host.dataset.rmState==='ready' && String(host.__rabbitMirrorIndependentSource||'')===String(html||'');
   host.__rabbitMirrorIndependentSource = String(html||'');
   if(sameReadySource){
     if(wasOpen) currentReady.setAttribute('open','');
     scheduleExternalShellTint(host,html);
     ensureExternalTools(host);
     if(source==='independent') scheduleIndependentReadyPostprocess(host,key,html);
     return host;
   }
    if(expectedFaces){
      if(!mountExternalFaceDetails(host,key,source,html,{wasOpen,locallyPrepared})){
       host.dataset.rmState='error';
       globalThis.toastr?.error?.('多面结构不完整，未挂载；不会自动补发请求。');
       return host;
      }
      markHistoricalLightHostForRestore(host);
      ensureExternalTools(host);
      if(source==='independent') scheduleIndependentReadyPostprocess(host,key,html);
      return host;
    }
    if(externalFaceDetails(host).length>1){
      for(const other of externalFaceDetails(host).slice(1)) other.remove();
      delete host.dataset.rmFaceCount;
      host.classList.remove('rabbit-mirror-multiface-host');
    }
    const nextDetails=extractReadyDetails(html,locallyPrepared);
   if(!nextDetails){
     host.dataset.rmState='error';
     placeExternalHost(el,host,key,source);
     const fallback=current || fallbackExternalDetails('error','');
     if(!current) host.append(fallback);
     setPlaceholderSummary(fallback,'【兔子镜：生成失败】');
     renderExternalErrorBody(fallback,'独立 API 已返回内容，但没有找到完整的兔子镜 <details>。');
     ensureExternalTools(host);
     return host;
   }
   nextDetails.removeAttribute('open');
   markExternalDetails(nextDetails,key,source);
   if(current) transferExternalTools(current,nextDetails);
   if(current?.isConnected) current.replaceWith(nextDetails); else host.append(nextDetails);
   if(wasOpen) nextDetails.setAttribute('open','');
   markHistoricalLightHostForRestore(host);
   scheduleExternalShellTint(host,html);
   ensureExternalTools(host);
   if(source==='independent') scheduleIndependentReadyPostprocess(host,key,html);
   return host;
 }
 if((state==='loading' || state==='error') && currentReady){
   host.dataset.rmState='ready';
   if(state==='loading') showIndependentResayStatus(host,/自动重试/.test(String(html||''))?String(html):'');
   else clearIndependentResayStatus(host);
   ensureExternalTools(host);
   return host;
 }
 host.__rabbitMirrorIndependentSource = '';
 let details=current;
 if(details && !details.classList?.contains('rabbit-mirror-external-placeholder')){
   const placeholder=fallbackExternalDetails(state,html);
   transferExternalTools(details,placeholder);
   details.replaceWith(placeholder);
   details=placeholder;
 }
 if(!details){ details=fallbackExternalDetails(state,html); host.append(details); }
 markExternalDetails(details,key,source);
 setPlaceholderSummary(details,state==='manual'?'【兔子镜：等待手动生成】':state==='loading'?'【兔子镜：正在生成中……】':'【兔子镜：生成失败】');
 let bodyNode=details.querySelector(':scope > .rabbit-mirror-external-placeholder-body');
 if(state==='error') renderExternalErrorBody(details,html);
 else if(html){
   if(!bodyNode){ bodyNode=document.createElement('div'); bodyNode.className='rabbit-mirror-external-placeholder-body'; details.append(bodyNode); }
   bodyNode.textContent=html;
 } else bodyNode?.remove?.();
 if(state!=='loading') clearIndependentResayStatus(host);
 ensureExternalTools(host);
 return host;
}



export function generationPollKey(index){ return `${chatKey(getContext())}:${Number(index)}`; }

export function generationWaitPollDelay(startedAt=0){
 const elapsed=Math.max(0,Date.now()-Number(startedAt||0));
 if(elapsed<12000) return GENERATION_PLACEHOLDER_POLL_INTERVAL_MS;
 if(elapsed<60000) return 1600;
 return 3200;
}

export function hasGenerationWorkFor(index,slot='',sourceHash=''){
 if(hasAutomaticFailureStop(slot,sourceHash)) return true;
 const live=currentGenerationIdentity(index);
 if(live && automaticDispatchAlreadyConsumed(live.baseSlot)) return true;
 if(generationPolls.has(generationPollKey(index))) return true;
 const active=pending.get(String(slot||''));
 if(active && String(active.sourceHash||'')===String(sourceHash||'')) return true;
 return globalFlights().has(flightIdentity(slot,sourceHash));
}

function renderGenerationGateTimeout(index,reason='generation-active'){
 const host=ensureGenerationPlaceholderForIndex(index,false);
 if(!host) return;
 host.dataset.rmState='error';
 delete host.dataset.rmReplyGenerationPlaceholder;
 const details=host.querySelector?.(':scope > details');
 if(!details) return;
 const stabilityTimeout=reason==='source-stability';
 const identityMissing=reason==='identity-missing';
 setPlaceholderSummary(details,identityMissing?'【兔子镜：没有找到当前回复】':(stabilityTimeout?'【兔子镜：等待正文稳定超时】':'【兔子镜：等待正文结束超时】'));
 renderExternalErrorBody(details,identityMissing
  ? '本轮等待期间没有重新找到这条回复对应的稳定消息身份，因此没有发送副 API 请求。请确认回复仍然存在后，点击“重新生成兔子镜”。'
  : (stabilityTimeout
   ? '正文没有在本轮等待窗口内形成可安全生成的稳定版本。兔子镜没有发送副 API 请求；确认正文已经稳定后，可点击“重新生成兔子镜”。'
   : 'SillyTavern 持续报告正文仍在生成。兔子镜为避免与主回复并发请求，已停止本轮自动等待；确认正文已经结束后，可点击“重新生成兔子镜”。'));
 ensureExternalTools(host);
}

export function exactIndependentReadyForIdentity(index,live=currentGenerationIdentity(index)){
 if(!live) return null;
 const el=messageElement(Number(index));
 const mounted=el ? externalHosts(el).find(host=>host?.dataset?.rmSource==='independent'
  && mountedIndependentReadyHostMatchesObserved(host,live.ctx,index,live.msg,live,live.key)) : null;
 if(mounted) return {kind:'mounted',host:mounted,record:null};
 const persisted=persistedOwnerForMessage(live.ctx,index,live.msg);
 if(persisted?.html && independentStoredHtmlRestorable(persisted.html) && savedRecordMatchesObserved(persisted,live)){
  return {kind:'persisted',host:null,record:persisted};
 }
 const store=readStore();
 const lock=ownerLockForBase(live.baseSlot);
 const keys=[String(lock?.slot||''),String(live.slot||''),...(Array.isArray(live.legacySlots)?live.legacySlots.map(String):[])].filter(Boolean);
 for(const key of new Set(keys)){
  const record=store?.[key];
  if(record?.html && independentStoredHtmlRestorable(record.html) && savedRecordMatchesObserved(record,live)){
   return {kind:'store',host:null,record};
  }
 }
 return null;
}

function restoreExactIndependentReadyForIdentity(index,live,result){
 if(!live || !result) return null;
 const el=messageElement(Number(index));
 if(result.host?.isConnected){
  placeExternalHost(el,result.host,result.host.dataset?.rmKey||live.key,'independent');
  result.host.hidden=false;
  clearExternalHostFreshSourceState(result.host);
  refreshExistingExternalDetails(result.host,result.host.dataset?.rmKey||live.key,'independent');
  return result.host;
 }
 if(!el || !result.record?.html) return null;
 const host=ensureExternalUi(el,live.key,result.record.html,'ready','independent',live.sourceHash,result.record);
 if(host){
  rebuildCollapsedReadyHost(el,host,live.key,'independent',result.record.html,live.sourceHash,result.record);
  host.hidden=false;
  clearExternalHostFreshSourceState(host);
 }
 return host;
}

function exactIndependentErrorForIdentity(index,live=currentGenerationIdentity(index)){
 if(!live) return null;
 const el=messageElement(Number(index));
 if(!el) return null;
 return externalHosts(el).find(host=>mountedIndependentErrorHostMatchesObserved(host,live.ctx,index,live.msg,live,live.key))||null;
}

function restoreExactIndependentErrorForIdentity(index,live,host){
 if(!live || !host?.isConnected) return null;
 const el=messageElement(Number(index)); if(!el) return null;
 placeExternalHost(el,host,host.dataset?.rmKey||live.key,'independent');
 host.dataset.rmState='error';
 host.hidden=false;
 clearExternalHostFreshSourceState(host);
 ensureExternalTools(host);
 return host;
}

export function renderAutomaticFailureStop(index,live,failure){
 if(!live || !failure) return null;
 const existing=exactIndependentErrorForIdentity(index,live);
 if(existing) return restoreExactIndependentErrorForIdentity(index,live,existing);
 const el=messageElement(Number(index)); if(!el) return null;
 const message=String(failure.message||failure.reason||'独立 API 生成失败。');
 return ensureExternalUi(el,live.key,message,'error','independent',live.sourceHash);
}

function renderAutomaticDispatchConsumed(index,sourceHash=''){
 const live=currentGenerationIdentity(index); if(!live) return null;
 const ready=exactIndependentReadyForIdentity(index,live);
 if(ready){
  clearAutomaticFailureStop(live.slot,live.sourceHash);
  return restoreExactIndependentReadyForIdentity(index,live,ready)||ready.host||null;
 }
 const preciseFailure=automaticFailureStopFor(live.slot,sourceHash||live.sourceHash);
 if(preciseFailure) return renderAutomaticFailureStop(index,live,preciseFailure);
 const exactError=exactIndependentErrorForIdentity(index,live);
 if(exactError) return restoreExactIndependentErrorForIdentity(index,live,exactError);
 const el=messageElement(index); if(!el) return null;
 const previousHost=externalHosts(el).find(host=>host?.dataset?.rmSource==='independent')||null;
 const sourceReplaced=hasExplicitSourceReplacementEvidence(live.ctx,index,live.msg,previousHost);
 const message=sourceReplaced
  ? '这次宿主生成已经发送过 1 次独立 API 请求；正文随后又发生了变化。为避免重复扣费，兔子镜没有自动发送第二次。确认最终正文后请点击“重新生成兔子镜”。'
  : '本轮已经发送过 1 次独立 API 请求，但没有形成可恢复的完整成品。为避免重复扣费，兔子镜不会自动补发；请查看本轮错误原因或手动重新生成。';
 const failure=markAutomaticFailureStop(live.slot,sourceHash||live.sourceHash,'host-operation-already-dispatched',{
  message,
  code:sourceReplaced?'source-replaced-after-dispatch':'dispatch-consumed-without-complete-output',
  semanticFailure:sourceReplaced?'source-replaced-after-dispatch':'dispatch-consumed-without-complete-output',
  terminalStage:'passive-reconcile',
 });
 return renderAutomaticFailureStop(index,live,failure);
}

export function confirmFinalRenderedGeneration(index){
 const state=generationPolls.get(generationPollKey(index));
 const live=currentGenerationIdentity(index);
 if(!state || !live) return false;
 state.finalRenderHash=live.sourceHash;
 state.finalRenderRevision=live.revision;
 state.finalRenderAt=Date.now();
 state.queue?.(FINAL_RENDER_POLL_INTERVAL_MS);
 return true;
}

export function scheduleMessageGeneration(index,delay=260,sourceAware=true,finalRenderConfirmed=false,sourceStabilityConfirmed=false,sourceStableSince=0){
 if(!automaticIndependentTiming()) return null;
 const initialContext=getContext();
 const initialMessage=initialContext.chat?.[index];
 if(suppressesAutomaticGeneration(initialContext,index) || hasExistingFollowRabbitMirror(initialContext,index,initialMessage)) return null;
 const initialIdentity=currentGenerationIdentity(index);
 const initialReady=exactIndependentReadyForIdentity(index,initialIdentity);
 if(initialReady){
  clearAutomaticFailureStop(initialIdentity.slot,initialIdentity.sourceHash);
  restoreExactIndependentReadyForIdentity(index,initialIdentity,initialReady);
  return null;
 }
 const pollKey=generationPollKey(index); const previous=generationPolls.get(pollKey);
 if(previous){ previous.cancelled=true; if(previous.timer) clearTimeout(previous.timer); }
 const state={cancelled:false,timer:0,startedAt:Date.now(),stableSince:0,lastHash:'',lastRevision:-1,weakActiveSince:0,finalRenderHash:'',finalRenderRevision:-1,finalRenderAt:0,sourceStabilityConfirmed:sourceStabilityConfirmed===true,queue:null};
 generationPolls.set(pollKey,state);
 const finish=()=>{ if(generationPolls.get(pollKey)===state) generationPolls.delete(pollKey); };
 const queue=ms=>{ if(state.timer) clearTimeout(state.timer); state.timer=setTimeout(()=>{ state.timer=0; poll(); },ms); };
 state.queue=queue;
 if(finalRenderConfirmed){
  const rendered=currentGenerationIdentity(index);
  if(rendered){
   state.finalRenderHash=rendered.sourceHash; state.finalRenderRevision=rendered.revision; state.finalRenderAt=Date.now();
   const provenStableAt=Math.min(Date.now(),Math.max(0,Number(sourceStableSince)||0));
   if(provenStableAt){
    state.lastHash=rendered.sourceHash; state.lastRevision=rendered.revision; state.stableSince=provenStableAt;
    if(Date.now()-provenStableAt>=FINAL_RENDER_SOURCE_STABLE_WAIT_MS) state.sourceStabilityConfirmed=true;
   }
  }
 }
 const poll=()=>{
  if(state.cancelled || !currentRuntime() || runtimeMode()!=='independent'){ finish(); return; }
  const live=currentGenerationIdentity(index);
  if(live && suppressesAutomaticGeneration(live.ctx,index)){
   const authorization=automaticGenerationCutovers.get(chatKey(live.ctx))?.authorized.get(Number(index));
   const refreshed=refreshUnpaidAutomaticAuthorization(live.ctx,index,authorization);
   if(refreshed==='waiting'){
    if(Date.now()-state.startedAt<ACTIVE_GENERATION_WAIT_MS) queue(generationWaitPollDelay(state.startedAt));
    else { finish(); renderGenerationGateTimeout(index,'source-stability'); }
    return;
   }
   if(refreshed===true){
    state.lastHash=''; state.lastRevision=-1; state.stableSince=0; state.sourceStabilityConfirmed=false;
    state.finalRenderHash=live.sourceHash; state.finalRenderRevision=live.revision; state.finalRenderAt=Date.now();
   }
  }
  if(live && (suppressesAutomaticGeneration(live.ctx,index) || hasExistingFollowRabbitMirror(live.ctx,index,live.msg))){ finish(); return; }
  if(live) cancelSupersededFlightsForBase(live.baseSlot,live.sourceHash);
  if(!live){ if(Date.now()-state.startedAt<OWNER_REATTACH_WAIT_MS) queue(generationWaitPollDelay(state.startedAt)); else { finish(); renderGenerationGateTimeout(index,'identity-missing'); } return; }
  const exactReady=exactIndependentReadyForIdentity(index,live);
  if(exactReady){
   clearAutomaticFailureStop(live.slot,live.sourceHash);
   restoreExactIndependentReadyForIdentity(index,live,exactReady);
   finish(); return;
  }
  const activeBaseFlight=activeIndependentFlightForBase(live.baseSlot);
  if(activeBaseFlight && automaticFlightStillOwnsBaseOperation(activeBaseFlight)){
   const liveEl=messageElement(index);
   if(liveEl){
    const remounted=ensureExternalUi(liveEl,live.key,'正在读取当前上下文并生成兔子镜……','loading','independent',live.sourceHash);
    if(remounted) activeBaseFlight.loadingHost=remounted;
   }
   // A consumed lease means the single paid request was already dispatched;
   // while that exact request still owns this message, resume/pageshow only
   // remounts its shell and must not replace it with a false failure card.
   finish(); return;
  }
  const preciseFailure=automaticFailureStopFor(live.slot,live.sourceHash);
  if(preciseFailure){ finish(); renderAutomaticFailureStop(index,live,preciseFailure); return; }
  if(automaticDispatchAlreadyConsumed(live.baseSlot)){ finish(); renderAutomaticDispatchConsumed(index,live.sourceHash); return; }
  const activity=hostGenerationActivity();
  if(activity.strong){
   state.weakActiveSince=0; state.stableSince=0; state.lastHash=''; state.lastRevision=-1; state.sourceStabilityConfirmed=false;
   if(Date.now()-state.startedAt<ACTIVE_GENERATION_WAIT_MS) queue(generationWaitPollDelay(state.startedAt));
   else { finish(); renderGenerationGateTimeout(index); }
   return;
  }
  const finalRenderMatches=state.finalRenderHash===live.sourceHash
   && state.finalRenderRevision===live.revision
   && Date.now()-state.finalRenderAt<=FINAL_RENDER_CONFIRMATION_TTL_MS;
  if(activity.weak && !finalRenderMatches){
   if(!state.weakActiveSince) state.weakActiveSince=Date.now();
   if(Date.now()-state.weakActiveSince<WEAK_GENERATION_FLAG_GRACE_MS){
    state.stableSince=0; state.lastHash=''; state.lastRevision=-1; queue(generationWaitPollDelay(state.startedAt)); return;
   }
  }else state.weakActiveSince=0;
  cancelFlightsForSlot(live.slot,live.sourceHash);
  if(!sourceAware){ finish(); void generateFor(index,live.msg,false,false); return; }
  if(live.sourceHash!==state.lastHash || live.revision!==state.lastRevision){
   state.lastHash=live.sourceHash; state.lastRevision=live.revision; state.stableSince=Date.now();
   if(state.finalRenderHash!==live.sourceHash || state.finalRenderRevision!==live.revision){ state.finalRenderHash=''; state.finalRenderRevision=-1; state.finalRenderAt=0; state.sourceStabilityConfirmed=false; }
  }
  const hasBody=String(live.msg?.mes||'').trim().length>0;
  const confirmedFinal=state.finalRenderHash===live.sourceHash
   && state.finalRenderRevision===live.revision
   && Date.now()-state.finalRenderAt<=FINAL_RENDER_CONFIRMATION_TTL_MS;
  if(hasBody && confirmedFinal && state.sourceStabilityConfirmed){ finish(); void generateFor(index,live.msg,false,true); return; }
  const stableWait=confirmedFinal?FINAL_RENDER_SOURCE_STABLE_WAIT_MS:(activity.weak?WEAK_GENERATION_SOURCE_STABLE_WAIT_MS:SOURCE_STABLE_WAIT_MS);
  if(hasBody && state.stableSince && Date.now()-state.stableSince>=stableWait){ finish(); void generateFor(index,live.msg,false,true); return; }
  if(Date.now()-state.startedAt<OWNER_REATTACH_WAIT_MS) queue(confirmedFinal?FINAL_RENDER_POLL_INTERVAL_MS:GENERATION_PLACEHOLDER_POLL_INTERVAL_MS);
  else { finish(); renderGenerationGateTimeout(index,'source-stability'); }
 };
 queue(delay);
}

export function ensureGenerationPlaceholderForIndex(index,waitingForBody=true){
 if(!currentRuntime() || runtimeMode()!=='independent') return null;
 const live=currentGenerationIdentity(index); const el=messageElement(index);
 if(!live || !el) return null;
 if(suppressesAutomaticGeneration(live.ctx,index) || hasExistingFollowRabbitMirror(live.ctx,index,live.msg)) return null;
 const store=readStore();
 const recovered=recoverSavedRecord(store,live.slot,live);
 if(recovered.storeChanged) writeStore(store);
 if(recovered.saved?.html && savedRecordMatchesObserved(recovered.saved,live)) return null;
 const existing=collapseDuplicateIdentityHosts(el,live.key,'independent',live.sourceHash);
 if(readyDetailsFromHost(existing)) return existing;
 return ensureReplyGenerationPlaceholder(el,live.key,live.sourceHash,waitingForBody);
}

export function clearGenerationPlaceholderPoll(){
 if(generationPlaceholderTimer){ clearTimeout(generationPlaceholderTimer); writeGenerationPlaceholderTimer(0); }
 writeGenerationPlaceholderStartedAt(0);
}

export function scheduleGenerationPlaceholderPoll(delay=80){
 if(!automaticIndependentTiming()) return;
 clearGenerationPlaceholderPoll();
 writeGenerationPlaceholderStartedAt(Date.now());
 const poll=()=>{
  writeGenerationPlaceholderTimer(0);
  if(!currentRuntime() || runtimeMode()!=='independent' || !hostGenerationLooksActive() || Date.now()-generationPlaceholderStartedAt>GENERATION_PLACEHOLDER_POLL_LIMIT_MS){
   clearGenerationPlaceholderPoll();
   return;
  }
  const ctx=getContext(); const index=Array.isArray(ctx.chat)?ctx.chat.length-1:-1; const msg=index>=0?ctx.chat?.[index]:null;
  if(isRabbitMirrorEligibleAssistantMessage(msg) && messageElement(index)){
   const host=ensureGenerationPlaceholderForIndex(index,true);
   if(host){ clearGenerationPlaceholderPoll(); return; }
  }
  writeGenerationPlaceholderTimer(setTimeout(poll,GENERATION_PLACEHOLDER_POLL_INTERVAL_MS));
 };
 writeGenerationPlaceholderTimer(setTimeout(poll,Math.max(0,Number(delay)||0)));
}

function resumeRabbitMirrorLifecycle(event){
 if(!currentRuntime()) return;
 const type=String(event?.type||'');
 const mode=runtimeMode();
 if(mode==='off') return;

 // 1.3.20: window focus is far too broad on iOS/Safari. SillyTavern drawers,
 // editors and toolbar controls can temporarily move focus without the page ever
 // leaving the foreground. The old handler treated every such focus as a BFCache /
 // background resume and ran syncAll() across the entire chat, causing the small
 // but visible pause that remained after 1.3.20 isolated popup DOM mutations.
 // Mark recovery only after a real hidden transition (or a persisted pageshow).
 if(type==='visibilitychange' && document?.visibilityState==='hidden'){
  writeBackgroundLifecycleNeedsRecovery(true);
  const last=lastAssistantMessage(getContext());
  if(mode==='independent' && last && !hostGenerationLooksActive()) scheduleMessageGeneration(last.i,0,true);
  return;
 }
 if(type==='pageshow' && event?.persisted===true) writeBackgroundLifecycleNeedsRecovery(true);

 // Ordinary window focus / visible visibilitychange / non-persisted pageshow must
 // not touch chat DOM. They are common during normal SillyTavern UI interaction.
 if(!backgroundLifecycleNeedsRecovery) return;
 if(document?.visibilityState==='hidden') return;

 writeBackgroundLifecycleNeedsRecovery(false);
 if(backgroundResumeTimer) clearTimeout(backgroundResumeTimer);
 writeBackgroundResumeTimer(setTimeout(()=>{
  writeBackgroundResumeTimer(0);
  if(!currentRuntime()) return;
  const currentMode=runtimeMode();
  if(currentMode==='off') return;
  const last=lastAssistantMessage(getContext());
  markExternalGeometryLifecycle('background-resume');
  scheduleStartupHistorySync(runtimeConfigSequence);
  if(currentMode==='independent' && last) scheduleMessageGeneration(last.i,160,true);
 },80));
}

export function installBackgroundLifecycleListeners(){
 if(backgroundLifecycleListenersInstalled || typeof window==='undefined' || typeof document==='undefined') return;
 document.addEventListener('visibilitychange',resumeRabbitMirrorLifecycle,true);
 window.addEventListener('pageshow',resumeRabbitMirrorLifecycle,true);
 window.addEventListener('focus',resumeRabbitMirrorLifecycle,true);
 writeBackgroundLifecycleListenersInstalled(true);
}

export function removeBackgroundLifecycleListeners(){
 if(!backgroundLifecycleListenersInstalled || typeof window==='undefined' || typeof document==='undefined') return;
 document.removeEventListener('visibilitychange',resumeRabbitMirrorLifecycle,true);
 window.removeEventListener('pageshow',resumeRabbitMirrorLifecycle,true);
 window.removeEventListener('focus',resumeRabbitMirrorLifecycle,true);
 writeBackgroundLifecycleListenersInstalled(false);
 writeBackgroundLifecycleNeedsRecovery(false);
 if(backgroundResumeTimer){ clearTimeout(backgroundResumeTimer); writeBackgroundResumeTimer(0); }
}

export function currentGenerationIdentity(index){
 const ctx=getContext(); const msg=ctx.chat?.[index];
 if(!isRabbitMirrorEligibleAssistantMessage(msg)) return null;
 const observed=observeMessageSourceRevision(ctx,index,msg);
 return {ctx,msg,index,slot:observed.slot,baseSlot:messageBaseSlotKey(ctx,index,msg),legacySlots:observed.legacySlots||[],key:recordKey(ctx,index,msg),sourceHash:observed.sourceHash,bodyHash:observed.bodyHash,displayHash:observed.displayHash,reasoningHash:observed.reasoningHash,revision:observed.revision,[INDEPENDENT_OWNER_OBSERVATION]:{ctx,index,msg}};
}

function settleCancelledIndependentFlightUi(flight,reason='cancelled'){
 if(!flight || flight.uiSettled) return false;
 const host=flight.loadingHost;
 const liveEl=messageElement(Number(flight.index));
 const identity=currentGenerationIdentity(Number(flight.index));
 const sameOwner=identity && identity.key===flight.key && identity.sourceHash===flight.sourceHash;
 if(flight.manual && flight.previousReadyRecord?.html && liveEl && sameOwner){
  ensureExternalUi(liveEl,flight.key,flight.previousReadyRecord.html,'ready','independent',flight.sourceHash,flight.previousReadyRecord);
  flight.uiSettled=true;
  return true;
 }
 if(host?.isConnected && host.dataset?.rmState==='loading'){
  if(sameOwner && liveEl && String(reason||'')==='api-settings-changed'){
   ensureExternalUi(liveEl,flight.key,'独立 API 设置在生成期间发生变化，本次已取消且不会自动重发。请确认新连接后手动重新生成兔子镜。','error','independent',flight.sourceHash);
  }else host.remove?.();
  flight.uiSettled=true;
  return true;
 }
 flight.uiSettled=true;
 return false;
}

export function abortFlight(flight,reason='cancelled'){
 if(!flight) return;
 if(flight.earlyBodyOwner){
  flight.earlyBodyOwner.cancelled=true;flight.earlyBodyOwner.cancelReason=reason;
  flight.earlyBodyOwner.resolveFinal?.(false);flight.earlyBodyOwner.resolveFinal=null;
  if(flight.earlyBodyOwner.finalTimer){clearTimeout(flight.earlyBodyOwner.finalTimer);flight.earlyBodyOwner.finalTimer=0;}
 }
 flight.cancelled=true; flight.cancelReason=reason;
 flight.deadline?.clear?.(); flight.deadline=null;
 try{ flight.dispatchLease?.release?.(); }catch{}
 try{ flight.controller?.abort?.(reason); }catch{}
 settleCancelledIndependentFlightUi(flight,reason);
}

export function cancelFlightsForSlot(slot,exceptSourceHash=''){
 for(const [id,flight] of globalFlights()){
  if(!String(id).startsWith(`${slot}\u0000`)) continue;
  if(exceptSourceHash && flight?.sourceHash===exceptSourceHash) continue;
  abortFlight(flight,'source-changed'); globalFlights().delete(id);
 }
 const active=pending.get(slot);
 if(active && (!exceptSourceHash || active.sourceHash!==exceptSourceHash)){ abortFlight(active,'source-changed'); pending.delete(slot); }
}

export function activeIndependentFlightForBase(baseSlot=''){
 const base=String(baseSlot||'');
 if(!base) return null;
 for(const flight of globalFlights().values()){
  if(String(flight?.baseSlot||'')===base && !flight?.cancelled) return flight;
 }
 for(const flight of pending.values()){
  if(String(flight?.baseSlot||'')===base && !flight?.cancelled) return flight;
 }
 return null;
}

function automaticFlightStillOwnsBaseOperation(flight){
 if(!flight || flight.cancelled || flight.manual) return false;
 if(flight.earlyBodyOwner) return earlyBodyOwnerCurrent(flight.earlyBodyOwner);
 const base=String(flight.baseSlot||'');
 if(!base || Number(flight.operationEpoch||0)!==Number(operationEpochForBase(base))) return false;
 const identity=currentGenerationIdentity(Number(flight.index));
 if(!identity || String(identity.baseSlot||'')!==base) return false;
 // A body/status postwrite inside the same authorized host operation is a
 // presentation drift, not permission to discard an already-paid response.
 // Explicit Swipe/regenerate/continue evidence still supersedes the flight.
 return !hasExplicitSourceReplacementEvidence(identity.ctx,Number(flight.index),identity.msg,flight.loadingHost||null);
}

export function cancelSupersededFlightsForBase(baseSlot,currentSourceHash=''){
 const base=String(baseSlot||'');
 if(!base) return;
 for(const [id,flight] of globalFlights()){
  if(String(flight?.baseSlot||'')!==base || String(flight?.sourceHash||'')===String(currentSourceHash||'')) continue;
  if(automaticFlightStillOwnsBaseOperation(flight) || (flight.manualBodyOwner && manualBodyOwnerCurrent(flight.manualBodyOwner))) continue;
  abortFlight(flight,'source-version-replaced');
  globalFlights().delete(id);
 }
 for(const [slot,active] of pending.entries()){
  if(String(active?.baseSlot||'')!==base || String(active?.sourceHash||'')===String(currentSourceHash||'')) continue;
  if(automaticFlightStillOwnsBaseOperation(active) || (active.manualBodyOwner && manualBodyOwnerCurrent(active.manualBodyOwner))) continue;
  abortFlight(active,'source-version-replaced');
  pending.delete(slot);
 }
}

export function cancelFlightsForMessage(index,reason='message-source-changed',preserveBaseSlot=''){
 const ctx=getContext();
 const chatKeys=new Set([chatKey(ctx),legacyChatKey(ctx)].map(value=>String(value||'')).filter(Boolean));
 const preserveBase=String(preserveBaseSlot||'');
 const liveIdentity=preserveBase?currentGenerationIdentity(Number(index)):null;
 const keepCurrentFlight=flight=>{
  const base=String(flight?.baseSlot||'');
  if(!preserveBase || base!==preserveBase || flight?.cancelled) return false;
  if(!flight?.manual) return automaticFlightStillOwnsBaseOperation(flight);
  return !!liveIdentity
   && String(liveIdentity.baseSlot||'')===preserveBase
   && String(flight?.slot||'')===String(liveIdentity.slot||'')
   && String(flight?.sourceHash||'')===String(liveIdentity.sourceHash||'')
   && Number(flight?.revision||0)===Number(liveIdentity.revision||0);
 };
 const belongsToCurrentMessage=flight=>{
  const base=String(flight?.baseSlot||'');
  if(!base || keepCurrentFlight(flight)) return false;
  return [...chatKeys].some(key=>{
   const prefix=`${key}:${Number(index)}:`;
   return base.startsWith(prefix) && /^\d+$/.test(base.slice(prefix.length));
  });
 };
 for(const [id,flight] of globalFlights()){
  if(!belongsToCurrentMessage(flight)) continue;
  abortFlight(flight,reason); globalFlights().delete(id);
 }
 for(const [slot,active] of pending.entries()){
  if(!belongsToCurrentMessage(active)) continue;
  abortFlight(active,reason); pending.delete(slot);
 }
}

export function cancelAllIndependentFlights(reason='runtime-changed'){
 for(const flight of globalFlights().values()) abortFlight(flight,reason);
 globalFlights().clear();
 for(const active of pending.values()) abortFlight(active,reason);
 pending.clear();
}

export async function generateFor(index,msg,force=false,sourceAware=true,multifaceResay=null,earlyBodyOwner=null,manualBodyOwner=null,singlePresentationResay=null,quickStartOwner=null){
 const ctx=getContext(); const currentMsg=ctx.chat?.[index];
 if(quickStartOwner && (!quickStartOwners.has(quickStartOwner)||!quickActionOwnerCurrent(quickStartOwner)||quickStartOwner.index!==index||force)) return;
 if(!isRabbitMirrorEligibleAssistantMessage(currentMsg)) return;
 msg=currentMsg;
 if(earlyBodyOwner) assertEarlyBodyOwner(earlyBodyOwner);
 const observed=observeMessageSourceRevision(ctx,index,msg);
 const key=recordKey(ctx,index,msg); const slot=observed.slot; const sourceHash=observed.sourceHash; const bodyHash=observed.bodyHash; const displayHash=observed.displayHash; const reasoningHash=observed.reasoningHash; const revision=observed.revision; const st=getSettings();
 const baseSlot=messageBaseSlotKey(ctx,index,msg);
 if(st.enabled===false || st.autoRabbitMirrorInjection===false || st.generationSource!=='independent' || runtimeMode()!=='independent') return;
 if(independentGenerationTiming(st)==='off' || (!force&&!automaticIndependentTiming())) return;
 if(force && independentGenerationTiming(st)==='manual'){
  const active=activeIndependentFlightForBase(baseSlot);
  if(active) return active.task;
  manualBodyOwner??=captureManualBodyOwner(ctx,index,msg,manualIntentForMessage(ctx,index));
 }
 if(!force && ((!earlyBodyOwner&&!quickStartOwner&&suppressesAutomaticGeneration(ctx,index)) || hasExistingFollowRabbitMirror(ctx,index,msg))) return;
 if(!force){
  const preciseFailure=automaticFailureStopFor(slot,sourceHash);
  if(preciseFailure){ renderAutomaticFailureStop(index,currentGenerationIdentity(index),preciseFailure); return; }
 }
 if(force) clearAutomaticFailureStop(slot,sourceHash);
 const el=messageElement(index);
 // Keep cross-device migration/reconciliation out of the paid request critical
 // path. Normal sync passes handle it; generation only reads the already-present
 // owner snapshot and proceeds without scanning/saving the whole chat first.
 let store=readStore();
 const persistedOwner=persistedOwnerForMessage(ctx,index,msg);
 const persistedSuppressed=!!persistedOwner?.deleted;
 const persistedReady=!persistedSuppressed&&persistedOwner?.html&&independentStoredHtmlRestorable(persistedOwner.html)&&savedRecordMatchesObserved(persistedOwner,observed)?persistedOwner:null;
 if(force){
  // Keep the last successful persisted owner and owner lock intact while a
  // paid resay is in flight. The force branch already bypasses the restore
  // returns below, so deleting the old owner before success is unnecessary.
  // Successful resay overwrites it atomically; failed/slow resay can therefore
  // fall back to the known-good mirror after reload instead of losing it.
 }
 else if(persistedReady){
  const persistedSlot=chatPersistenceSlot(ctx,index,swipeId(msg),persistedReady)||slot;
  if(!store?.[persistedSlot]?.html){ saveRecordForSlot(store,persistedSlot,persistedReady,{dropLegacy:false}); writeStore(store); }
  setOwnerLockForBase(baseSlot,persistedSlot,String(persistedReady.sourceHash||persistedReady.bodyHash||sourceHash));
  if(el) ensureExternalUi(el,key,persistedReady.html,'ready','independent',sourceHash,persistedReady);
  return persistedReady;
 } else if(!persistedSuppressed){
  const locked=lockedIndependentRecordForBase(baseSlot,store);
  if(locked?.record?.html && savedRecordMatchesObserved(locked.record,observed)){
   if(el) ensureExternalUi(el,key,locked.record.html,'ready','independent',sourceHash,locked.record);
   return locked.record;
  }
 }
 if(force){
  const resayFaceIndex=Number.isInteger(multifaceResay?.faceIndex)?multifaceResay.faceIndex:0;
  if(persistedReady?.html) seedIndependentFaceSwipes(slot,persistedReady.html);
  const earlyHost=el?collapseDuplicateIdentityHosts(el,key,'independent',sourceHash):null;
  const earlyFaces=externalFaceDetails(earlyHost);
  const overlayDetails=earlyFaces.length>1?earlyFaces[resayFaceIndex]:earlyFaces[0];
  if(!hasEphemeralFaceFailure(overlayDetails) && !canAppendSwipe(readFaceSwipe(slot,resayFaceIndex))){
   globalThis.toastr?.warning?.(FACE_SWIPE_FULL_MESSAGE);
   return null;
  }
  // A user-initiated resay becomes the sole owner for this message. Advance
  // the operation epoch and abort every older swipe/source flight before the
  // new paid request is dispatched, so a late automatic result cannot replace
  // the manual result after it has already mounted.
  advanceOperationEpochForBase(baseSlot,'manual-resay');
  cancelFlightsForMessage(index,'manual-resay');
  if(manualBodyOwner){
   manualBodyOwner.epoch=operationEpochForBase(baseSlot);
   rememberManualClickOwner(manualBodyOwner);
  }
 } else cancelSupersededFlightsForBase(baseSlot,sourceHash);
 const recoveredAtGeneration=recoverSavedRecord(store,slot,observed);
 let saved=persistedSuppressed&&!force?null:recoveredAtGeneration.saved;
 if(recoveredAtGeneration.storeChanged) writeStore(store);
 const mountedHost=el ? collapseDuplicateIdentityHosts(el,key,'independent',sourceHash) : null;
 const mountedReady=mountedIndependentReadyHostMatchesObserved(mountedHost,ctx,index,msg,observed,key)
  ? readyRecordFromHost(mountedHost,observed,st.independentApiModel)
  : null;
 if(mountedReady?.html && !force && !persistedSuppressed){
  const mountedSlot=String(mountedHost?.dataset?.rmKey||slot);
  const mountedStore=readStore();
  if(!mountedStore?.[mountedSlot]?.html){ saveRecordForSlot(mountedStore,mountedSlot,mountedReady,{dropLegacy:false}); writeStore(mountedStore); }
  setOwnerLockForBase(baseSlot,mountedSlot,String(mountedHost?.dataset?.rmSourceHash||sourceHash));
  writePersistedOwner(ctx,index,msg,mountedReady,{overwrite:false});
  return mountedReady;
 }
 if(saved?.html && !force){
  const savedSourceHash=String(saved.sourceHash||'');
  if(savedRecordMatchesObserved(saved,observed) || (!savedSourceHash && !sourceAware)){
   setOwnerLockForBase(baseSlot,slot,sourceHash);
   writePersistedOwner(ctx,index,msg,saved,{overwrite:false});
   if(el){ const restored=ensureExternalUi(el,key,saved.html,'ready','independent',sourceHash,saved); rebuildCollapsedReadyHost(el,restored,key,'independent',saved.html,sourceHash,saved); }
   return saved;
  }
 }
 const existing=pending.get(slot);
 if(!force && existing && existing.sourceHash===sourceHash && existing.revision===revision){
  if(el){
   const remounted=ensureExternalUi(el,key,'正在读取当前上下文并生成兔子镜……','loading','independent',sourceHash);
   if(remounted) existing.loadingHost=remounted;
  }
  existing.task?.finally?.(()=>queueMessageSync([index]));
  return existing.task;
 }
 const flightKey=flightIdentity(slot,sourceHash); const shared=globalFlights().get(flightKey);
 if(!force && shared?.task){
  if(el){
   const remounted=ensureExternalUi(el,key,'正在读取当前上下文并生成兔子镜……','loading','independent',sourceHash);
   if(remounted) shared.loadingHost=remounted;
  }
  shared.task.finally?.(()=>queueMessageSync([index]));
  return shared.task;
 }
 const previousReadyRecord=mountedReady || (saved?.html && independentStoredHtmlRestorable(saved.html) ? {...saved} : null);
 if(multifaceResay){
  const previousBatch=parseMultifaceOutput(String(previousReadyRecord?.html||''));
  const faceIndex=Number(multifaceResay.faceIndex);
  if(!previousBatch.ok || !Number.isInteger(faceIndex) || faceIndex<0 || faceIndex>=previousBatch.faces.length){
   globalThis.toastr?.error?.('无法确认这面兔子镜及其余各面的完整边界，本次未发送请求。');
   return null;
  }
 }
 if(force){
  if(previousReadyRecord?.html) seedIndependentFaceSwipes(slot,previousReadyRecord.html);
 } else cancelFlightsForSlot(slot,sourceHash);
 const dispatchLease=force ? createManualDispatchLease() : reserveAutomaticDispatchLease(baseSlot,sourceHash);
 if(!dispatchLease){
  if(!force){
   const preciseFailure=automaticFailureStopFor(slot,sourceHash);
   if(preciseFailure) renderAutomaticFailureStop(index,currentGenerationIdentity(index),preciseFailure);
   else if(automaticDispatchAlreadyConsumed(baseSlot)) renderAutomaticDispatchConsumed(index,sourceHash);
  }
  return null;
 }
 let loadingHost=null;
 if(el){
  collapseDuplicateIdentityHosts(el,key,'independent',sourceHash);
  // A manual resay should not blank a perfectly good mirror while the new paid
  // request is still running. The existing loading renderer keeps ready details
  // mounted and adds one aria-live resay status instead of replacing the mirror.
  loadingHost=ensureExternalUi(el,key,'正在读取当前上下文并生成兔子镜……','loading','independent',sourceHash);
 }
 const runId=++generationSequence; let stale=false;
 const operationEpoch=Number(dispatchLease?.epoch||operationEpochForBase(baseSlot));
 const flight={task:null,runId,key,slot,index,sourceHash,revision,manual:!!force,manualBodyOwner,cancelled:false,controller:new AbortController(),baseSlot,operationEpoch,flightKey,dispatchLease,timedOut:false,timeoutError:null,deadline:null,loadingHost,previousReadyRecord,uiSettled:false,batchPlan:null,automaticRerollCount:0};
 if(earlyBodyOwner){flight.earlyBodyOwner=earlyBodyOwner;earlyBodyOwner.flight=flight;}
 const currentIdentityForFlight=()=>{
  const live=currentGenerationIdentity(index); const active=pending.get(slot);
  const registered=currentRuntime() && runtimeMode()==='independent' && live
   && active?.runId===runId && active?.revision===revision
   && !flight.cancelled && globalFlights().get(flightKey)===flight;
  if(!registered) return null;
  if(earlyBodyOwner) return earlyBodyOwnerCurrent(earlyBodyOwner) ? live : null;
  if(manualBodyOwner) return manualBodyOwnerCurrent(manualBodyOwner) ? live : null;
  if(force){
   return live.slot===slot && live.key===key && live.sourceHash===sourceHash && live.revision===revision ? live : null;
  }
  if(String(live.baseSlot||'')!==String(baseSlot)
   || Number(operationEpochForBase(baseSlot))!==operationEpoch
   || hasExplicitSourceReplacementEvidence(live.ctx,index,live.msg,flight.loadingHost||null)) return null;
  return live;
 };
 const stillCurrent=()=>!!currentIdentityForFlight();
 flight.task=null; globalFlights().set(flightKey,flight); pending.set(slot,flight);
 const dispatchAttempt=()=>{
  let timeoutReject=null;
  const timeoutPromise=new Promise((resolve,reject)=>{ timeoutReject=reject; });
  flight.timedOut=false; flight.timeoutError=null;
  flight.deadline?.clear?.();
  flight.deadline=createIndependentRequestDeadline(flight.controller,error=>{
   flight.timedOut=true;
   flight.timeoutError=error;
   timeoutReject?.(error);
  });
  const apiTask=callIndependentApi(ctx,index,msg,flight.controller.signal,{manualRetry:force&&!manualBodyOwner?.firstGeneration,slot,dispatchLease,multifaceResay:multifaceResay||singlePresentationResay,earlyBodyOwner,manualBodyOwner,isPromptOwnerCurrent:stillCurrent,currentBatchPlan:()=>flight.batchPlan,onProgress:()=>flight.deadline?.progress?.(),onBatchPlan:plan=>{ flight.batchPlan=plan||null; }});
  return Promise.race([apiTask,timeoutPromise]);
 };
 const settleSuccessfulIndependentResult=async result=>{
  if(result?.skipped){
   if(!settleSkippedManualIndependentFlightUi(flight,result)) settleCancelledIndependentFlightUi(flight,'prompt-skipped');
   flight.uiSettled=true;
   return result;
  }
  if(earlyBodyOwner){
   flight.deadline?.clear?.();flight.deadline=null;
   // The request runs in parallel with the main tail, but persistence waits for
   // its final owner hash. No repeated cache writes or DOM remounts per token.
   if(!earlyBodyOwner.finalized) await earlyBodyOwner.finalPromise;
   if(!earlyBodyOwnerCurrent(earlyBodyOwner,{visibility:true})){
    stale=true;settleCancelledIndependentFlightUi(flight,'early-body-final-changed');return;
   }
  }
  const settledIdentity=currentIdentityForFlight();
  if(!settledIdentity){ stale=true; settleCancelledIndependentFlightUi(flight,'stale-owner'); return; }
  const settledCtx=settledIdentity.ctx; const settledMsg=settledIdentity.msg;
  const settledSlot=settledIdentity.slot; const settledKey=settledIdentity.key;
  const settledSourceHash=settledIdentity.sourceHash; const settledBodyHash=settledIdentity.bodyHash;
  const settledDisplayHash=settledIdentity.displayHash; const settledReasoningHash=settledIdentity.reasoningHash;
  // One chat+mesid+swipe owner accepts only its first successful automatic
  // result. Later DOM/source rewrites cannot replace A with B; explicit resay
  // clears this owner lock before starting.
  if(!force){
    const serverOwner=persistedOwnerForMessage(settledCtx,index,settledMsg);
    const serverRecord=serverOwner?.deleted?null:(serverOwner?.html&&independentStoredHtmlRestorable(serverOwner.html)&&savedRecordMatchesObserved(serverOwner,settledIdentity)?serverOwner:null);
    if(serverRecord?.html){
     const serverSlot=chatPersistenceSlot(settledCtx,index,swipeId(settledMsg),serverRecord)||settledSlot;
     const liveStore=readStore(); if(!liveStore?.[serverSlot]?.html){ saveRecordForSlot(liveStore,serverSlot,serverRecord,{dropLegacy:false}); writeStore(liveStore); }
     setOwnerLockForBase(baseSlot,serverSlot,String(serverRecord.sourceHash||serverRecord.bodyHash||settledSourceHash));
     const liveEl=messageElement(index); if(liveEl) ensureExternalUi(liveEl,settledKey,serverRecord.html,'ready','independent',settledSourceHash,serverRecord);
     return serverRecord;
    }
    const locked=lockedIndependentRecordForBase(baseSlot,readStore());
    if(locked?.record?.html && savedRecordMatchesObserved(locked.record,settledIdentity)){
     const liveEl=messageElement(index); if(liveEl) ensureExternalUi(liveEl,settledKey,locked.record.html,'ready','independent',settledSourceHash,locked.record);
     return locked.record;
    }
   }
   let html=String(result?.html||'');
   let replacementVisualHtml='';
   let replacementPreviousRecord=null;
   if(multifaceResay){
    const liveEl=messageElement(index);
    const liveHost=liveEl?collapseDuplicateIdentityHosts(liveEl,settledKey,'independent',settledSourceHash):null;
    const liveRecord=mountedIndependentReadyHostMatchesObserved(liveHost,settledCtx,index,settledMsg,settledIdentity,settledKey)
     ? readyRecordFromHost(liveHost,settledIdentity,st.independentApiModel):null;
    const persistedNow=persistedOwnerForMessage(settledCtx,index,settledMsg);
    const mergeRecord=liveRecord?.html?{...previousReadyRecord,...liveRecord,apiRequest:previousReadyRecord?.apiRequest}:persistedNow?.html?persistedNow:previousReadyRecord;
    replacementPreviousRecord=mergeRecord;
    const previousBatch=parseMultifaceOutput(String(mergeRecord?.html||''));
    const faceIndex=Number(multifaceResay.faceIndex);
    const replacementTemplate=document.createElement('template');
    replacementTemplate.innerHTML=html;
    const replacementDetails=replacementTemplate.content.querySelector('details');
    if(!replacementDetails) throw new Error('这一面的新结果缺少完整外层结构；旧成品已保留，不会自动重发。');
    replacementVisualHtml=String(replacementDetails.outerHTML||'');
    const nextFaces=previousBatch.faces.map(face=>face.index===faceIndex?wrapIndependentFace(replacementDetails.outerHTML,faceIndex):face.html);
    html=nextFaces.join('\n');
    assertIndependentMarkupComplexityWithDiagnostic(html,'multiface-resay-merged',result?.requestDiagnostic||null);
    const merged=parseMultifaceOutput(html,{expectedCount:previousBatch.faces.length});
    if(!merged.ok || !independentStoredHtmlRestorable(html)) throw new Error('这面兔子镜已生成，但无法在不改动其他面的前提下安全合并；旧成品已保留，不会自动重发。');
    const oldDiagnostic=mergeRecord?.apiRequest&&typeof mergeRecord.apiRequest==='object'?mergeRecord.apiRequest:{};
    const oldFaces=Array.isArray(oldDiagnostic.faces)?oldDiagnostic.faces:[];
    const remainingFailures=Array.isArray(oldDiagnostic.failedFaces)?oldDiagnostic.failedFaces.filter(face=>face.faceIndex!==faceIndex):[];
    result.requestDiagnostic={...oldDiagnostic,faces:oldFaces.length===previousBatch.faces.length?oldFaces.map((face,i)=>i===faceIndex?{...face,...result.requestDiagnostic}:face):oldFaces,faceCount:previousBatch.faces.length,multifaceResayFace:faceIndex+1,
     partial:remainingFailures.length>0,failedFaces:remainingFailures,completedFaces:previousBatch.faces.length-remainingFailures.length};
   }
   clearAutomaticFailureStop(slot,sourceHash);
   if(settledSlot!==slot || settledSourceHash!==sourceHash) clearAutomaticFailureStop(settledSlot,settledSourceHash);
   const paletteFingerprint=commitIndependentVisualResult(multifaceResay?replacementVisualHtml:html);
  if(result?.feedbackId && result?.feedbackPrompt){
   const liveFeedback=getActiveFeedbackForCurrentChat(getContext().chat);
   if(liveFeedback?.id===result.feedbackId){
    markFeedbackCatInjected(liveFeedback,'independent',result.feedbackPrompt);
    consumeInjectedFeedbackForSuccessfulIndependentRabbitMirror(wrappedIndependentMirrorHtml(html),result.feedbackId);
   }
  }
  const initialHtml=scrubIndependentInteractionState(html,html);
   const completed={html:initialHtml||html,initialHtml:'',sourceHash:settledSourceHash,bodyHash:settledBodyHash,displayHash:settledDisplayHash,reasoningHash:settledReasoningHash,paletteFingerprint,ts:Date.now(),model:st.independentApiModel,runtime:RUNTIME_VERSION,apiRequest:result?.requestDiagnostic||null,executionLockChars:Number(result?.executionLockChars||0)};
   bindIndependentRecordContinuity(settledCtx,index,settledMsg,completed,null,{completed:true,commit:false});
   sealIndependentTextReplacementRecord(completed,settledSlot,replacementPreviousRecord,multifaceResay?Number(multifaceResay.faceIndex):null);
   if(!independentRecordWithinBudget(completed)) throw independentMarkupLimitError('record-bytes',byteLength(completed.html),INDEPENDENT_RECORD_BUDGET_BYTES);
   bindIndependentRecordContinuity(settledCtx,index,settledMsg,completed,null,{completed:true});
   recordRabbitMirrorRecipe({ chat:settledCtx.chat, chatKey:chatKey(settledCtx), messageIndex:index, swipeId:swipeId(settledMsg), message:settledMsg, metadata:result?.requestDiagnostic||null, source:'independent' });
   if(force){
    const resayFaceIndex=Number.isInteger(multifaceResay?.faceIndex)?multifaceResay.faceIndex:0;
    const faceHtml=multifaceResay?replacementVisualHtml:faceDetailsListFromHtml(completed.html)[0]?.detailsHtml||completed.html;
    appendIndependentFaceSwipe(settledSlot,resayFaceIndex,faceHtml);
   } else seedIndependentFaceSwipes(settledSlot,completed.html);
   const next=readStore(); saveRecordForSlot(next,settledSlot,completed); writeStore(next);
   setOwnerLockForBase(baseSlot,settledSlot,settledSourceHash);
   writePersistedOwner(settledCtx,index,settledMsg,completed,{overwrite:true});
   if(String(readStore()?.[settledSlot]?.html||'')!==completed.html) showIndependentUnsavedOutput(completed);
   const liveEl=messageElement(index);
   let liveHost=null;
   if(liveEl){
    liveHost=collapseDuplicateIdentityHosts(liveEl,settledKey,'independent',settledSourceHash);
    const replacedOne=multifaceResay && liveHost
     ? replaceExternalMultifaceFace(liveHost,settledKey,'independent',html,Number(multifaceResay.faceIndex),true) : false;
    if(replacedOne){
     liveHost.dataset.rmSourceHash=settledSourceHash;
     stampExternalDetailsOwnership(liveHost);
     markMountedFaceProofs(liveHost,'independent',completed.apiRequest);
     scheduleExternalShellTint(liveHost,html);
     ensureExternalTools(liveHost);
     scheduleIndependentReadyPostprocess(liveHost,settledKey,html);
    }else{
     ensureExternalUi(liveEl,settledKey,completed.html,'ready','independent',settledSourceHash,completed);
     liveHost=collapseDuplicateIdentityHosts(liveEl,settledKey,'independent',settledSourceHash);
    }
   }
   if(result?.batchPlan){
    const persisted=findSavedRecord(readStore(),settledSlot,settledIdentity.legacySlots||[]);
    const mountedFaces=externalFaceDetails(liveHost);
    const mountedSerialized=serializeExternalFaceDetails(liveHost);
    const mountedProtocol=parseMultifaceOutput(mountedSerialized,{expectedCount:Number(result.batchPlan.requestedFaceCount)});
    const persistenceComplete=String(persisted?.html||'')===String(completed.html||'')
     && independentStoredHtmlRestorable(String(persisted?.html||''));
    const mountComplete=!liveEl || (
     liveHost?.dataset?.rmSourceHash===settledSourceHash
     && mountedFaces.length===Number(result.batchPlan.requestedFaceCount)
     && mountedFaces.every(face=>usableReadyDetails(face))
     && mountedProtocol.ok
    );
    // The paid response has already passed the complete multiface protocol and
    // sanitize boundary. A late cache readback or host-DOM reconciliation miss
    // must never turn that success into the generic error UI (the old behavior
    // could make a completed RabbitMirror disappear). Keep the accepted result,
    // let the bounded passive sync remount it, and never issue another request.
    if(!persistenceComplete || !mountComplete){
     console.warn('[RabbitMirror] multiface result accepted; deferred persistence/DOM reconciliation',{persistenceComplete,mountComplete,slot:settledSlot});
     globalThis.toastr?.warning?.('多面兔子镜已经生成；界面或缓存复核尚未完成，将从本轮成品被动恢复，不会自动补发请求。');
    }
    if(persistenceComplete && !commitPendingComboBatch(result.faceScans||[],{batchId:result.batchPlan.batchId,identity:result.batchPlan.identity,partial:!!result.failedFaces?.length})){
     globalThis.toastr?.warning?.('多面兔子镜已安全显示，但本轮随机冷却记录保存失败；不会自动补发请求。');
    }
   }
  flight.uiSettled=true;
  return completed;
 };
 const settleIndependentFailure=(err)=>{
  if(flight.timedOut && stillCurrent()){
   err=flight.timeoutError || err;
  } else if(flight.controller.signal.aborted || !stillCurrent()){
   stale=true;
   settleCancelledIndependentFlightUi(flight,flight.cancelReason||'stale-owner');
   return;
  }
  const failedIdentity=currentIdentityForFlight();
  if(!failedIdentity){ stale=true; settleCancelledIndependentFlightUi(flight,'stale-owner'); return; }
  const failedKey=failedIdentity.key, failedHash=failedIdentity.sourceHash;
  const liveEl=messageElement(index);
  const liveHost=liveEl?collapseDuplicateIdentityHosts(liveEl,failedKey,'independent',failedHash):null;
  const keptReady=!!readyDetailsFromHost(liveHost);
  const failedPosts=Math.max(Number(dispatchLease?.consumeCount?.()||0), Number(flight.automaticRerollCount||0));
  let failureMessage=String(err?.message||err||'generation-failed');
  const rerollMax=independentRerollMax();
  if(shouldAnnounceAutomaticRerollExhausted({manual:!!force,faceResay:!!(multifaceResay||singlePresentationResay),usableReadyFace:keptReady,failedPosts,max:rerollMax})){
   failureMessage=`${failureMessage} ${automaticRerollExhaustedNote(rerollMax)}`;
  }
  const terminalDiagnostic=republishIndependentTerminalFailure(failedIdentity.ctx,index,failedIdentity.msg,failedHash,baseSlot,operationEpoch,err,dispatchLease);
  markAutomaticFailureStop(failedIdentity.slot,failedHash,'generation-failed',{
   baseSlot,operationEpoch,
   message:failureMessage,
   code:String(terminalDiagnostic?.terminalErrorCode||err?.code||'independent-generation-failed'),
   semanticFailure:String(terminalDiagnostic?.semanticFailure||''),
   terminalStage:String(terminalDiagnostic?.terminalStage||'postprocess'),
   terminalFace:terminalDiagnostic?.terminalFace,
   requestCount:terminalDiagnostic?.requestCount||failedPosts,
   protocolErrorCode:terminalDiagnostic?.protocolErrorCode,
   protocolOffset:terminalDiagnostic?.protocolOffset,
  });
  console.error('[RabbitMirror] independent generation failed',err);
  if(liveEl){
   if(force && previousReadyRecord?.html){
    const currentHost=collapseDuplicateIdentityHosts(liveEl,failedKey,'independent',failedHash)||liveHost;
    if(currentHost){
     currentHost.dataset.rmState='ready';
     clearIndependentResayStatus(currentHost);
     const faceIndex=Number.isInteger(multifaceResay?.faceIndex)?multifaceResay.faceIndex:0;
     const overlayRoot=externalFaceDetails(currentHost)[currentHost && externalFaceDetails(currentHost).length>1?faceIndex:0]||currentHost;
     showEphemeralFaceFailure(currentHost,faceIndex,failureMessage,
      ()=>{ resayIndependentMirror(overlayRoot,{}); },
      ()=>{ applyIndependentFaceSwipe(overlayRoot,readFaceSwipe(failedIdentity.slot,faceIndex).currentIndex); }
     );
    }else{
     ensureExternalUi(liveEl,failedKey,previousReadyRecord.html,'ready','independent',failedHash,previousReadyRecord);
    }
    flight.uiSettled=true;
    toastr?.error?.(failureMessage);
   } else if(keptReady){
    clearIndependentResayStatus(liveHost);
    liveHost.dataset.rmState='ready';
    flight.uiSettled=true;
    toastr?.error?.(failureMessage);
   } else {
    ensureExternalUi(liveEl,failedKey,failureMessage,'error','independent',failedHash);
    flight.uiSettled=true;
   }
  }
 };
 const task=(async()=>{
  while(true){
   try{
    return await settleSuccessfulIndependentResult(await dispatchAttempt());
   }catch(err){
    if(flight.timedOut && stillCurrent()){
     err=flight.timeoutError || err;
    } else if(flight.controller.signal.aborted || !stillCurrent()){
     stale=true;
     settleCancelledIndependentFlightUi(flight,flight.cancelReason||'stale-owner');
     return;
    }
    const failedIdentity=currentIdentityForFlight();
    if(!failedIdentity){ stale=true; settleCancelledIndependentFlightUi(flight,'stale-owner'); return; }
    const liveEl=messageElement(index);
    const liveHost=liveEl?collapseDuplicateIdentityHosts(liveEl,failedIdentity.key,'independent',failedIdentity.sourceHash):null;
    const usableReadyFace=!!readyDetailsFromHost(liveHost);
    const failedPosts=Math.max(1, Number(dispatchLease?.consumeCount?.()||0));
    flight.automaticRerollCount=failedPosts;
    if(shouldAutomaticReroll({manual:!!force,faceResay:!!(multifaceResay||singlePresentationResay),usableReadyFace,failedPosts,max:independentRerollMax()}) && stillCurrent()){
     try{ flight.deadline?.clear?.(); }catch{}
     try{ flight.controller=new AbortController(); }catch{}
     if(liveEl){
      const status=automaticRerollStatusText(failedPosts,independentRerollMax());
      flight.loadingHost=ensureExternalUi(liveEl,failedIdentity.key,status,'loading','independent',failedIdentity.sourceHash);
     }
     continue;
    }
    settleIndependentFailure(err);
    return;
   }
  }
 })().finally(()=>{
  if(flight.batchPlan) releasePendingComboBatch(flight.batchPlan);
  try{ dispatchLease.release?.(); }catch{}
  flight.deadline?.clear?.(); flight.deadline=null;
  if(pending.get(slot)?.runId===runId) pending.delete(slot);
  if(globalFlights().get(flightKey)===flight) globalFlights().delete(flightKey);
   if(flight.loadingHost?.isConnected && flight.loadingHost.dataset?.rmState==='loading') settleCancelledIndependentFlightUi(flight,flight.cancelReason||'request-ended-without-terminal-ui');
   // One exact passive reconciliation repairs a DOM replacement that happened
   // while another host reply was streaming. syncMessages() never issues a paid
   // request, and the consumed dispatch lease keeps this owner single-shot.
   queueMessageSync([index]);
  });
 flight.task=task;
 await task;
}


function independentHostForRoot(root){
 if(!root) return null;
 const candidates=[];
 const add=node=>{ if(node && !candidates.includes(node)) candidates.push(node); };
 add(root?.matches?.(`[${SOURCE_ATTR}]`)?root:null);
 add(root?.closest?.(`[${SOURCE_ATTR}]`));
 add(root?.querySelector?.(`[${SOURCE_ATTR}][data-rm-source="independent"]`));
 const details=root?.matches?.('details')?root:root?.closest?.('details')||root?.querySelector?.('details');
 add(details?.parentElement?.matches?.(`[${SOURCE_ATTR}]`)?details.parentElement:null);
 const ownerKey=String(details?.dataset?.rabbitMirrorOwnerKey||details?.dataset?.rabbitMirrorExternalOwner||'');
 if(ownerKey) add(allExternalHosts().find(host=>host.dataset.rmKey===ownerKey));
 const ownerMesid=Number(details?.dataset?.rabbitMirrorOwnerMesid);
 if(Number.isInteger(ownerMesid)&&ownerMesid>=0) add(externalHostsOwnedByMesid(String(ownerMesid)).find(host=>host.dataset.rmSource==='independent'));
 return candidates.find(host=>host?.dataset?.rmSource==='independent')||null;
}

export function messageIndexForExternalHost(host){
 if(!host) return null; const ctx=getContext();
 const owner=String(host.dataset?.rmOwnerMesid||host.dataset?.rmExternalOwnerMessage||'').trim();
 if(/^\d+$/.test(owner)){ const index=Number(owner); if(Number.isInteger(index)&&index>=0&&isRabbitMirrorEligibleAssistantMessage(ctx.chat?.[index])) return index; }
 const ownerEl=host.closest?.('.mes[mesid], [mesid].mes')||host.parentElement?.closest?.('.mes[mesid], [mesid].mes');
 const mesid=String(ownerEl?.getAttribute?.('mesid')||'').trim();
 if(/^\d+$/.test(mesid)){ const index=Number(mesid); if(Number.isInteger(index)&&index>=0&&isRabbitMirrorEligibleAssistantMessage(ctx.chat?.[index])) return index; }
 const key=String(host.dataset?.rmKey||''); const match=key.match(/(?:^|:)(\d+):(\d+)$/);
 if(match){ const index=Number(match[1]); if(Number.isInteger(index)&&index>=0&&isRabbitMirrorEligibleAssistantMessage(ctx.chat?.[index])) return index; }
 return null;
}

function actionOwnerMetadata(root,owner={}){
 const details=root?.matches?.('details')?root:root?.closest?.('details')||root?.querySelector?.('details');
 const numeric=value=>{ const n=Number(value); return Number.isInteger(n)&&n>=0?n:null; };
 return {
  chat:String(owner?.chat||owner?.ownerChat||details?.dataset?.rabbitMirrorOwnerChat||''),
  mesid:numeric(owner?.mesid??owner?.messageId??owner?.index??details?.dataset?.rabbitMirrorOwnerMesid),
  swipe:numeric(owner?.swipe??details?.dataset?.rabbitMirrorOwnerSwipe),
  key:String(owner?.key||details?.dataset?.rabbitMirrorOwnerKey||details?.dataset?.rabbitMirrorExternalOwner||''),
  sourceHash:String(owner?.sourceHash||details?.dataset?.rabbitMirrorOwnerSourceHash||''),
 };
}

export function parseMessageIndexFromOwnerKey(key=''){
 const parts=String(key||'').split(':').filter(Boolean);
 if(parts.length<2) return null;
 const numeric=value=>/^\d+$/.test(String(value||''));
 if(parts.length>=4 && numeric(parts.at(-3)) && numeric(parts.at(-2))){
  const sourceHash=String(parts.at(-1)||'');
  if(/^[a-z0-9]+$/i.test(sourceHash)) return {index:Number(parts.at(-3)),swipe:Number(parts.at(-2)),sourceHash};
 }
 if(numeric(parts.at(-2)) && numeric(parts.at(-1))) return {index:Number(parts.at(-2)),swipe:Number(parts.at(-1)),sourceHash:''};
 return null;
}

export function resolveIndependentActionIdentity(root,owner={}, {allowPassiveErrorRetry=false}={}){
 const ctx=getContext(); const meta=actionOwnerMetadata(root,owner); let host=independentHostForRoot(root);
 if(!host){
  host=allExternalHosts().find(candidate=>candidate.dataset.rmSource==='independent'
   && (meta.mesid===null || Number(candidate.dataset.rmOwnerMesid)===meta.mesid)
   && (!meta.key || candidate.dataset.rmKey===meta.key))||null;
 }
 let index=messageIndexForExternalHost(host);
 if(index===null && meta.mesid!==null) index=meta.mesid;
 if(index===null){
  const parsedKey=parseMessageIndexFromOwnerKey(meta.key); if(parsedKey) index=parsedKey.index;
 }
 if(index===null){
  const messageNode=root?.closest?.('.mes[mesid], [mesid].mes'); const parsed=Number(messageNode?.getAttribute?.('mesid'));
  if(Number.isInteger(parsed)&&parsed>=0) index=parsed;
 }
 if(index===null || !isRabbitMirrorEligibleAssistantMessage(ctx.chat?.[index])) return null;
 const currentChat=chatKey(ctx); const legacyChat=legacyChatKey(ctx);
 const acceptedChats=new Set([currentChat,legacyChat].filter(Boolean));
 const hostChat=String(host?.dataset?.rmOwnerChat||'').trim();
 if(meta.chat && !acceptedChats.has(meta.chat)) return null;
 if(hostChat && !acceptedChats.has(hostChat)) return null;
 const msg=ctx.chat[index]; const currentSwipe=swipeId(msg); const currentKey=recordKey(ctx,index,msg);
 const parsedOwnerKey=parseMessageIndexFromOwnerKey(meta.key);
 const ownerSwipe=Number.isInteger(parsedOwnerKey?.swipe)?parsedOwnerKey.swipe:meta.swipe;
 if(Number.isInteger(ownerSwipe) && ownerSwipe!==currentSwipe) return null;
 const ownerSourceHash=String(parsedOwnerKey?.sourceHash || meta.sourceHash || host?.dataset?.rmSourceHash || '').trim();
 const currentSourceHash=messageSourceFingerprint(msg);
 const terminalFailure=allowPassiveErrorRetry && host?.dataset?.rmState==='error' && ownerSourceHash && ownerSourceHash!==currentSourceHash
  ? passiveIndependentFailureForIdentity(ctx,index,msg,host) : null;
 const passiveErrorRetry=!!terminalFailure && ownerSourceHash===terminalFailure.sourceHash
  && (!meta.key || meta.key===terminalFailure.slot);
 if(ownerSourceHash && ownerSourceHash!==currentSourceHash && !passiveErrorRetry) return null;
 if(meta.key && meta.key!==currentKey && !passiveErrorRetry){
  const baseSuffix=`:${index}:${currentSwipe}`;
  const fullSuffix=`${baseSuffix}:${currentSourceHash}`;
  if(!meta.key.endsWith(baseSuffix) && !meta.key.endsWith(fullSuffix)) return null;
 }
 const faces=externalFaceDetails(host);
 const requestedDetails=root?.matches?.('details')?root:root?.closest?.('details')||root?.querySelector?.('details');
 const faceIndex=faces.length>1?faces.findIndex(face=>face===requestedDetails || face.contains?.(requestedDetails)):-1;
 return {ctx,msg,index,host,slot:messageSlotKey(ctx,index,msg),legacySlots:legacyMessageSlotKeys(ctx,index,msg),key:currentKey,faceIndex};
}

function closeIndependentHistoryPanel(){
 document.querySelectorAll?.(`[${HISTORY_PANEL_ATTR}]`)?.forEach(panel=>panel.remove());
}

function historyDateLabel(value){
 const date=new Date(Number(value||0));
 return Number.isFinite(date.getTime()) ? date.toLocaleString([], {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}) : '';
}

function historyPreviewDetails(entry,faceIndex=-1,ownerSlot=''){
 let source=ownerSlot?prepareStoredIndependentRecordHtml(entry,ownerSlot):String(entry?.html||'');
 if(faceIndex>=0 && hasMultifaceMarkup(source)){
  const parsed=parseMultifaceOutput(source);
  source=parsed.ok&&parsed.faces[faceIndex]?parsed.faces[faceIndex].inner:'';
 }
 const details=extractReadyDetails(source,!!ownerSlot); if(!details) return null;
 details.removeAttribute('data-rabbit-mirror-external-details');
 details.removeAttribute('data-rabbit-mirror-external-owner');
 details.removeAttribute('data-rabbit-mirror-external-source');
 details.setAttribute('open','');
 details.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay]')?.forEach(node=>node.remove());
 try{ isolateRabbitMirrorInteractionIds(details); }catch{}
 return details;
}

function showIndependentHistory(root,owner={}){
 const identity=resolveIndependentActionIdentity(root,owner);
 if(!identity) return false;
 const current=savedIndependentRecordForOwner(identity.ctx,identity.index,identity.msg,readStore());
 const historySlot=independentLineageOriginSlot(current)||identity.slot;
 if(current?.html) appendHistoryEntry(historySlot,current);
 const entries=[...new Map(slotSearchKeys(historySlot,[identity.slot,...identity.legacySlots||[]])
  .flatMap(candidate=>historyEntriesForSlot(candidate))
  .map(entry=>[String(entry.id||hashText(entry.html||'')),entry])).values()]
  .sort((a,b)=>Number(b.ts||0)-Number(a.ts||0));
 closeIndependentHistoryPanel();
 if(!entries.length){ globalThis.toastr?.info?.('这条回复还没有兔子镜历史。'); return true; }
 const overlay=document.createElement('div');
 overlay.className='rabbit-mirror-history-overlay'; overlay.setAttribute(HISTORY_PANEL_ATTR,'true');
 overlay.innerHTML=`<section class="rabbit-mirror-history-dialog" role="dialog" aria-modal="true" aria-label="兔子镜历史">
  <header class="rabbit-mirror-history-header"><strong>兔子镜历史</strong><button type="button" data-rm-history-close="true" aria-label="关闭">×</button></header>
  <div class="rabbit-mirror-history-body"><nav class="rabbit-mirror-history-list" aria-label="历史版本"></nav><div class="rabbit-mirror-history-preview"></div></div>
 </section>`;
 const list=overlay.querySelector('.rabbit-mirror-history-list');
 const preview=overlay.querySelector('.rabbit-mirror-history-preview');
 const render=(entry,button)=>{
  list.querySelectorAll('button').forEach(item=>item.classList.toggle('is-active',item===button));
  preview.replaceChildren(); const details=historyPreviewDetails(entry,identity.faceIndex,independentLineageOriginSlot(entry)||historySlot);
  if(details) preview.append(details); else preview.textContent='这版兔子镜无法预览。';
 };
 entries.forEach((entry,index)=>{
  const button=document.createElement('button'); button.type='button';
  const number=entries.length-index; const model=entry.model?` · ${entry.model}`:'';
  button.textContent=`第 ${number} 版 · ${historyDateLabel(entry.ts)}${model}`;
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();render(entry,button);},true);
  list.append(button); if(index===0) queueMicrotask(()=>render(entry,button));
 });
 overlay.addEventListener('click',event=>{
  if(event.target===overlay || event.target?.closest?.('[data-rm-history-close="true"]')){ event.preventDefault(); closeIndependentHistoryPanel(); }
 },true);
 document.body.append(overlay); return true;
}

export function resayIndependentMirror(root,owner={}){
 if(getSettings().generationSource==='follow'){
  void import('../followFaceRetry.js?rmv=1.5.63').then(({retryFollowFace})=>retryFollowFace(root,owner,{
   getContext,hostBusy:hostGenerationLooksActive,maxRequestChars:MAX_INDEPENDENT_REQUEST_CHARS,
   resolveOwner:target=>{
    const host=target?.closest?.('[data-rabbit-mirror-external-source="true"][data-rm-source="follow"]');
    return followRecoveryOwner(host?messageElementForExternalHost(host):target?.closest?.('.mes[mesid]'));
   },
   context:(ctx,index)=>{const snapshot=globalWorldInfoSnapshotFor(ctx,index,ctx.chat[index]);return contextBundle(ctx,index,snapshot,globalWorldInfoContextView(snapshot),CONTEXT_TOTAL_BUDGET,createIndependentVisibleTextReader(index));},
   extractReadyDetails,formatDescriptors:independentSelectedFormatDescriptors,replaceExternalFace:replaceExternalMultifaceFace,
  })).catch(()=>globalThis.toastr?.error?.('主 API 单面重试模块未加载，未发送请求。'));
  return true;
 }
 const identity=resolveIndependentActionIdentity(root,owner,{allowPassiveErrorRetry:true});
 if(!identity) return false;
 const gate=canIndependentFaceResay(root,owner);
 if(!gate.ok){
  globalThis.toastr?.warning?.(gate.message||FACE_SWIPE_FULL_MESSAGE);
  return true;
 }
 const saved=savedIndependentRecordForOwner(identity.ctx,identity.index,identity.msg,readStore());
 const diagnostic=saved?.apiRequest&&typeof saved.apiRequest==='object'?saved.apiRequest:{};
 const faces=Array.isArray(diagnostic.faces)?diagnostic.faces:[];
 if(identity.faceIndex>=0 && faces.length<=identity.faceIndex){
  globalThis.toastr?.error?.('这批多面兔子镜缺少可信的逐面抽取记录，不能静默改成整批重说；本次未发送请求。');
  return true;
 }
 const multifaceResay=identity.faceIndex>=0&&faces.length>identity.faceIndex
  ? {faceIndex:identity.faceIndex,faces}
  : null;
 // Announce preparation before dispatch. A synchronous preflight rejection
 // must not be followed by a misleading new "generating" notification.
 globalThis.toastr?.info?.(multifaceResay?'正在准备重说这一面；其他面会原样保留……':'正在准备重新生成兔子镜……');
 const singlePresentationResay=!multifaceResay&&(diagnostic.presentationMode||diagnostic.visualSceneryCombination===true)
  ? {faceIndex:0,faces:[diagnostic]} : null;
 void generateFor(identity.index,identity.msg,true,true,multifaceResay,null,null,singlePresentationResay);
 return true;
}

export function showIndependentUnsavedOutput(record){
 if(!record?.html || typeof document==='undefined' || !document.body) return;
 const noticeId=hashText(String(record.ownerLineage?.id||'')+String(record.ownerLineage?.acceptedBodyHash||'')+record.html);
 if(document.querySelector?.(`[data-rabbit-mirror-unsaved-id="${noticeId}"]`)) return;
 let container=document.querySelector('[data-rabbit-mirror-unsaved-list]');
 if(!container){
  container=document.createElement('div');container.setAttribute('data-rabbit-mirror-unsaved-list','true');
  container.style.cssText='position:fixed;bottom:16px;right:16px;z-index:2147483000;max-width:min(420px,90vw);max-height:80vh;overflow:auto;display:flex;flex-direction:column;gap:8px';
  document.body.append(container);
 }
 const notice=document.createElement('section');
 notice.setAttribute('data-rabbit-mirror-unsaved-output','true');
 notice.setAttribute('data-rabbit-mirror-unsaved-id',noticeId);
 notice.setAttribute('role','alert');
 notice.style.cssText='padding:16px;border:1px solid #bb8a43;border-radius:12px;background:#fff8e8;color:#45301a;box-shadow:0 4px 20px #0004;font:14px/1.6 sans-serif';
 const description=document.createElement('p');
 description.textContent='这份兔子镜尚未保存到浏览器，退出或刷新后可能丢失。请先下载成品备份；这里不会重新请求 API。';
 const download=document.createElement('button'); download.type='button';download.textContent='下载本轮成品';
 download.addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([String(record.html)],{type:'text/html;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`RabbitMirror-${Number(record.ts)||Date.now()}.html`;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
 });
 const dismiss=document.createElement('button');dismiss.type='button';dismiss.textContent='关闭提示';
 dismiss.addEventListener('click',()=>{notice.remove();if(!container.childElementCount)container.remove();});
 notice.append(description,download,dismiss);container.append(notice);
}

function persistIndependentRepairFromEvent(event) {
 const detail=event?.detail||{};
 const host=detail.host?.matches?.(`[${SOURCE_ATTR}][data-rm-source="independent"]`)
  ? detail.host
  : detail.root?.closest?.(`[${SOURCE_ATTR}][data-rm-source="independent"]`);
 // 1.3.52: 这里原本全是静默 return false。维修保存失败时界面上没有任何痕迹，
 // “修好了但刷新又坏”与“压根没保存过”无法区分。改为统一记录放弃原因。
 const abort=reason=>{
  detail.persisted=false;
  detail.persistenceReason=String(reason||'unknown');
  console.debug('[RabbitMirror] independent repair not persisted:',reason);
  return false;
 };
 if(!host?.isConnected) return abort('host missing or detached');
 if(host.dataset.rmState!=='ready') return abort(`host state=${host.dataset.rmState||'unknown'}`);
 const index=messageIndexForExternalHost(host);
 if(!Number.isInteger(index) || index<0) return abort('owner message index unresolved');
 const identity=currentGenerationIdentity(index);
 if(!identity) return abort(`generation identity unavailable for index ${index}`);
 const mountedSource=String(host.dataset.rmSourceHash||'');
 if(!mountedSource) return abort('mounted sourceHash missing');
 if(mountedSource!==identity.sourceHash) return abort('mounted sourceHash no longer matches current source');
 const faces=externalFaceDetails(host);
 const requestedRoot=detail.root;
 const details=faces.length>1
  ? faces.find(face=>face===requestedRoot || face.contains?.(requestedRoot))
  : readyDetailsFromHost(host);
 if(!details || !usableReadyDetails(details)) return abort('no usable owner face in host');
 details.setAttribute(MAINTENANCE_PERSISTED_LAYOUT_ATTR,'true');
 const clone=details.cloneNode(true);
 clone.setAttribute(MAINTENANCE_PERSISTED_LAYOUT_ATTR,'true');
 clone.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay]')?.forEach(node=>node.remove());
 const rawHtml=faces.length>1 ? serializeExternalFaceDetails(host) : String(clone.outerHTML||'').trim();
 const store=readStore();
 const existing=savedIndependentRecordForOwner(identity.ctx,identity.index,identity.msg,store);
 const existingSlot=independentLineageOriginSlot(existing)||identity.slot;
 const baseline=String(existing?.initialHtml||host.__rabbitMirrorIndependentInitialSource||initialHtmlForRecord(existingSlot,existing)||existing?.html||rawHtml);
 const initialHtml=scrubIndependentInteractionState(baseline,baseline);
 const html=scrubIndependentInteractionState(rawHtml,initialHtml||baseline);
 if(!independentStoredHtmlRestorable(html)) return abort('scrubbed html failed restorability check');
 const previousClean=existing?.html?scrubIndependentInteractionState(existing.html,initialHtml||baseline):'';
 const repaired={
  ...(existing||{}),
  html,
  initialHtml:initialHtml||html,
  sourceHash:identity.sourceHash,
  bodyHash:identity.bodyHash,
  displayHash:identity.displayHash,
  reasoningHash:identity.reasoningHash,
  paletteFingerprint:independentPaletteFingerprintFromHtml(html),
  ts:Date.now(),
  model:String(existing?.model||getSettings().independentApiModel||''),
  runtime:RUNTIME_VERSION,
  repairedByMaintenance:true,
  ownerLineage:null,
 };
 // Reject before replacing the last restorable local record. The compactor may
 // otherwise discard an over-budget replacement and erase the previous result.
 if(!independentRecordWithinBudget(repaired)) return abort('repaired mirror exceeds storage budget');
 if(previousClean && previousClean!==html){
  const repairedFace=faces.length>1 ? faces.findIndex(face=>face===details) : 0;
  const faceIndex=Math.max(0,repairedFace);
  const repairedHtml=scrubSwipeDetailsHtml(clone.outerHTML);
  if(repairedHtml) mutateFaceSwipe(existingSlot,faceIndex,state=>{
   const seedHtml=faceDetailsListFromHtml(existing?.initialHtml||previousClean)[faceIndex]?.detailsHtml||previousClean;
   const seeded=seedSwipeState(state,{html:seedHtml,initialHtml:seedHtml,ts:Number(existing?.ts||Date.now())});
   return updateCurrentSwipeHtml(seeded.state,repairedHtml);
  });
 }
 bindIndependentRecordContinuity(identity.ctx,identity.index,identity.msg,repaired,null,{completed:true,commit:false});
 sealIndependentTextReplacementRecord(repaired,identity.slot);
 saveRecordForSlot(store,identity.slot,repaired);
 if(!writeStore(store)){ showIndependentUnsavedOutput(repaired); return abort('local repaired mirror store write failed'); }
 const stored=findSavedRecord(readStore(),identity.slot,identity.legacySlots||[]);
 if(String(stored?.html||'')!==html){ showIndependentUnsavedOutput(repaired); return abort('local repaired mirror store read-back mismatch'); }
 setOwnerLockForBase(identity.baseSlot,identity.slot,identity.sourceHash);
 const savedOwnerLock=ownerLockForBase(identity.baseSlot);
 if(String(savedOwnerLock?.slot||'')!==identity.slot || String(savedOwnerLock?.sourceHash||'')!==identity.sourceHash) return abort('owner lock read-back mismatch');
 bindIndependentRecordContinuity(identity.ctx,identity.index,identity.msg,repaired,null,{completed:true});
 writePersistedOwner(identity.ctx,identity.index,identity.msg,repaired,{overwrite:true});
 const persistedOwner=persistedOwnerForMessage(identity.ctx,identity.index,identity.msg);
 if(String(persistedOwner?.html||'')!==html || String(persistedOwner?.sourceHash||'')!==identity.sourceHash) return abort('chat metadata read-back mismatch');
 host.__rabbitMirrorIndependentSource=html;
 host.__rabbitMirrorIndependentInitialSource=initialHtml||html;
 host.dataset.rmSourceHash=identity.sourceHash;
 // Maintenance persistence is not a正文 regeneration. If a host lifecycle event
 // raced this save and set a stale-source placeholder, restore the repaired live
 // mirror immediately instead of leaving only the "正文正在更新" notice visible.
 host.hidden=false;
 clearExternalHostFreshSourceState(host);
 scheduleExternalShellTint(host,html);
 detail.persisted=true;
 detail.persistenceReason='';
 return true;
}

export function installRepairPersistenceListener(){
 if(repairPersistenceListenerInstalled || typeof document==='undefined') return;
 document.addEventListener(INDEPENDENT_REPAIR_PERSIST_EVENT,persistIndependentRepairFromEvent);
 repairPersistenceListenerInstalled=true;
}

export function removeRepairPersistenceListener(){
 if(!repairPersistenceListenerInstalled || typeof document==='undefined') return;
 document.removeEventListener(INDEPENDENT_REPAIR_PERSIST_EVENT,persistIndependentRepairFromEvent);
 repairPersistenceListenerInstalled=false;
}


// Image requests are explicit actions, isolated from automatic mirror dispatch.
// The key uses persisted source, never generated toolbar/image DOM.

function mirrorImageFaceSource(source,faceIndex){
 const text=String(source||'');
 if(hasMultifaceMarkup(text)){
  const parsed=parseMultifaceOutput(text,{allowProse:true});
  return parsed.ok?String(parsed.faces?.[faceIndex]?.html||''):'';
 }
 if(faceIndex!==0)return '';
 // Identity reads must not run cleanRabbitMirrorOutput: that sanitizer may
 // allocate fresh interaction IDs, making unchanged source look replaced.
 const toto=text.match(/<toto\b[^>]*>([\s\S]*?)<\/toto>/i);
 if(toto)return toto[1].trim();
 const trimmed=text.trim();
 return /^<details\b/i.test(trimmed)&&/<\/details>$/i.test(trimmed)?trimmed:'';
}

function prepareMirrorImageTarget(root){
 if(!root?.isConnected || !currentRuntime()) return null;
 const details=root.matches?.('details')?root:root.querySelector?.(':scope > details')||root.querySelector?.('details');
 if(!details) return null;
 const ctx=getContext();
 const cached=mirrorImageTargetCache.get(details);
 if(cached){try{cached.assertCurrent();return cached;}catch{mirrorImageTargetCache.delete(details);}}
 const independentHost=independentHostForRoot(root);
 let index,msg,faceIndex,readSource;
 if(independentHost){
  if(!independentHost.contains(details)||independentHost.dataset.rmState!=='ready') return null;
  const identity=resolveIndependentActionIdentity(details);
  if(!identity) return null;
  index=identity.index;msg=identity.msg;faceIndex=externalFaceDetails(independentHost).indexOf(details);
  if(faceIndex<0) return null;
  readSource=()=>mirrorImageFaceSource(savedIndependentRecordForOwner(getContext(),index,msg,readStore())?.html,faceIndex);
 }else{
  const followHost=details.closest?.(`[${SOURCE_ATTR}][data-rm-source="follow"]`);
  const el=followHost?messageElementForExternalHost(followHost):details.closest?.('.mes[mesid], [mesid].mes');
  const owner=followRecoveryOwner(el);
  if(!owner||!isRabbitMirrorEligibleAssistantMessage(owner.message)) return null;
  index=owner.index;msg=owner.message;
  faceIndex=(followHost?externalFaceDetails(followHost):inlineRabbitMirrorDetails(el)).indexOf(details);
  if(faceIndex<0) return null;
  readSource=()=>{
   for(const source of followMessageSourceCandidates(msg)){
    const face=mirrorImageFaceSource(source,faceIndex);if(face)return face;
   }
   return '';
  };
 }
 const faceSource=readSource();if(!faceSource) return null;
 const ownerChat=chatKey(ctx),ownerSwipe=swipeId(msg),ownerSource=messageSourceFingerprint(msg);
 const template=document.createElement('template');template.innerHTML=faceSource;
 template.content.querySelectorAll('script,style,noscript,[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal],[data-rm-image-region]').forEach(node=>node.remove());
 const title=String(template.content.querySelector('summary')?.textContent||'兔子镜').trim();
 const faceText=String(template.content.textContent||'').trim();if(!faceText)return null;
 const char=ctx.characters?.[ctx.characterId]||ctx.character||{};
 const data=char.data&&typeof char.data==='object'?char.data:char;
 const st=getSettings();
 const character=st.independentReadCharacterCardSummary===false?{name:String(char.name||data.name||ctx.name2||'')}:
  {name:String(char.name||data.name||ctx.name2||''),description:String(data.description||char.description||''),personality:String(data.personality||char.personality||''),scenario:String(data.scenario||char.scenario||'')};
 const persona={name:String(ctx.name1||globalThis.name1||''),description:st.independentReadPersonaSummary===false?'':String(ctx.powerUserSettings?.persona_description||globalThis.power_user?.persona_description||ctx.personaDescription||'')};
 const key=JSON.stringify([ownerChat,index,ownerSwipe,faceIndex,hashText(faceSource)]);
 const assertCurrent=()=>{
  const live=getContext();
  if(!currentRuntime()||!root.isConnected||!details.isConnected||chatKey(live)!==ownerChat||live.chat?.[index]!==msg
   ||swipeId(msg)!==ownerSwipe||messageSourceFingerprint(msg)!==ownerSource||readSource()!==faceSource)
   throw new Error('这面兔子镜的聊天、分支或内容已变化；未继续发送请求，请在当前镜面重新打开生图。');
  return true;
 };
 const target={key,title,faceText,floor:index,character,persona,group:character.name||persona.name||'兔子镜',assertCurrent,
  plan:(input={},options={})=>requestMirrorImagePlan(target,input,options)};
 mirrorImageTargetCache.set(details,target);
 return target;
}

async function requestMirrorImagePlan(target,input={},options={}){
 target.assertCurrent();
 const current=getSettings();
 if(current.imageEnabled!==true) throw new Error('请先在兔子镜设置中开启手动生图。');
 const st={...current,independentExcludedParams:Array.isArray(current.independentExcludedParams)?[...current.independentExcludedParams]:current.independentExcludedParams};
 if((!st.independentConnectionProfileId&&!st.independentApiBaseUrl)||!st.independentApiModel)
  throw new Error('请先完成兔子镜副 API 连接和模型设置；尚未发送请求。');
 const {buildImagePlanningPrompt,parseImagePlan}=await import('../imagePlan.js?rmv=1.5.53-image1');
 target.assertCurrent();
 const {systemPrompt,userPrompt}=buildImagePlanningPrompt({...input,title:target.title,faceText:target.faceText,
  floor:target.floor,character:target.character,persona:target.persona,promptFormat:input.promptFormat||st.imagePromptFormat});
 if(systemPrompt.length+userPrompt.length>MAX_INDEPENDENT_REQUEST_CHARS)
  throw new Error(`画面规划超过既有副 API ${MAX_INDEPENDENT_REQUEST_CHARS} 字符安全预算；未截断材料，也未发送请求。`);
 const connectionKeys=['imageEnabled','independentApiBaseUrl','independentApiKey','independentApiModel','independentConnectionProfileId',
  'independentAdvancedEnabled','independentReasoningEffort','independentExtraParams','independentExcludedParams'];
 const assertCurrent=()=>{
  target.assertCurrent();
  const live=getSettings();
  if(connectionKeys.some(key=>JSON.stringify(live[key])!==JSON.stringify(st[key])))
   throw new Error('生图开关或副 API 设置已变化；未继续发送请求，请重新操作。');
  if(options.signal?.aborted) throw new DOMException('已取消画面规划','AbortError');
 };
 const lease=createManualDispatchLease();
 const guardedLease={consume(){assertCurrent();return lease.consume();},release:()=>lease.release(),consumed:()=>lease.consumed()};
 const result=await requestIndependentCompletion(st,systemPrompt,userPrompt,{signal:options.signal,dispatchLease:guardedLease,
  advancedSettings:st,assertAdvancedCurrent:assertCurrent,onProgress:options.onProgress,diagnosticContext:{imagePlanning:true}});
 if(!result.response?.ok||result.semanticError) throw new Error(result.semanticError||'画面规划请求失败；未自动重试。');
 assertCurrent();
 return parseImagePlan(result.result?.text||'');
}


export function installIndependentActionBridge(){
 writeIndependentActionBridge({
  runtime:RUNTIME_VERSION,
  generateManual:root=>generateManualIndependentMirror(root),
  prepareImageTarget:root=>prepareMirrorImageTarget(root),
  prepareQuickResay:(root,owner={})=>prepareQuickResay(root,owner),
  resay:(root,owner={})=>resayIndependentMirror(root,owner),
  history:(root,owner={})=>true,
  swipeView:(root,owner={})=>independentFaceSwipeView(root,owner),
  selectSwipe:(root,index,owner={})=>applyIndependentFaceSwipe(root,index,owner),
  deleteSwipe:(root,owner={})=>deleteIndependentFaceSwipe(root,owner),
  restoreInitial:root=>restoreIndependentFaceSwipeInitial(root),
  hasSwipeInitial:root=>hasIndependentSwipeInitial(root),
  canResay:(root,owner={})=>canIndependentFaceResay(root,owner),
 });
 globalThis[ACTION_BRIDGE_KEY]=independentActionBridge;
}

export function removeIndependentActionBridge(){
 if(globalThis[ACTION_BRIDGE_KEY]===independentActionBridge) delete globalThis[ACTION_BRIDGE_KEY];
 writeIndependentActionBridge(null);
}

function handleFeedbackMirrorActionEvent(event){
 const detail=event?.detail; if(!detail||typeof detail!=='object') return;
 if(event.type===RESAY_EVENT){ if(resayIndependentMirror(detail.root,detail.owner||{})) detail.handled=true; return; }
 if(event.type===HISTORY_EVENT){ if(showIndependentHistory(detail.root,detail.owner||{})) detail.handled=true; }
}

export function installFeedbackMirrorActionListeners(){
 if(feedbackActionListenerInstalled) return;
 document.addEventListener(RESAY_EVENT,handleFeedbackMirrorActionEvent);
 document.addEventListener(HISTORY_EVENT,handleFeedbackMirrorActionEvent);
 feedbackActionListenerInstalled=true;
}

export function removeFeedbackMirrorActionListeners(){
 if(!feedbackActionListenerInstalled) return;
 document.removeEventListener(RESAY_EVENT,handleFeedbackMirrorActionEvent);
 document.removeEventListener(HISTORY_EVENT,handleFeedbackMirrorActionEvent);
 feedbackActionListenerInstalled=false;
 closeIndependentHistoryPanel();
}

function handleFollowMultifaceCommitted(event){
 if(runtimeMode()!=='follow-external') return false;
 const detail=event?.detail;
 const index=Number(detail?.messageIndex);
 const sourceHash=String(detail?.sourceHash||'').slice(0,64);
 const batchId=String(detail?.batchId||'').slice(0,180);
 if(!Number.isInteger(index)||index<0||!sourceHash||!batchId) return false;
 const ctx=getContext(); const msg=ctx?.chat?.[index];
 if(!isRabbitMirrorEligibleAssistantMessage(msg) || messageSourceFingerprint(msg)!==sourceHash) return false;
 // Proof and aggregate commit already succeeded for this exact owner. Do not
 // consult weak host-generation flags here: some WebViews leave them stale.
 queueMessageSync([index]);
 return true;
}

export function installFollowMultifaceCommitListener(){
 if(followMultifaceCommitListenerInstalled) return;
 globalThis.addEventListener?.(FOLLOW_MULTIFACE_COMMITTED_EVENT,handleFollowMultifaceCommitted);
 globalThis.addEventListener?.(FOLLOW_MULTIFACE_REJECTED_EVENT,handleFollowMultifaceRejected);
 followMultifaceCommitListenerInstalled=true;
}

export function removeFollowMultifaceCommitListener(){
 if(!followMultifaceCommitListenerInstalled) return;
 globalThis.removeEventListener?.(FOLLOW_MULTIFACE_COMMITTED_EVENT,handleFollowMultifaceCommitted);
 globalThis.removeEventListener?.(FOLLOW_MULTIFACE_REJECTED_EVENT,handleFollowMultifaceRejected);
 followMultifaceCommitListenerInstalled=false;
}

function handleFollowMultifaceRejected(event){
 const index=Number(event?.detail?.messageIndex);
 if(!Number.isInteger(index)||index<0) return false;
 const ctx=getContext();
 const failure=getRabbitMirrorFollowBatchFailure(ctx?.chat,index);
 if(!failure || failure.batchId!==event?.detail?.batchId) return false;
 queueMessageSync([index]);
 return true;
}

function cloneFollowFaceForExternal(root){
 const clone=root.cloneNode(true);
 // DOM properties (unlike checked/selected markup) change during native
 // interaction. Preserve them in the detached serialization used by the safe
 // external mount, so a display-mode change does not reset an opened scene.
 const controls=[...root.querySelectorAll('input, textarea, select')];
 const copies=[...clone.querySelectorAll('input, textarea, select')];
 for(let index=0;index<controls.length;index++){
  const original=controls[index],copy=copies[index];
  if(!copy||copy.tagName!==original.tagName) continue;
  if(original.matches('input[type="checkbox"], input[type="radio"]')){
   copy.toggleAttribute('checked',!!original.checked);
  }else if(original.tagName==='SELECT'){
   for(let option=0;option<original.options.length;option++) copy.options[option]?.toggleAttribute('selected',!!original.options[option].selected);
  }else if(original.tagName==='TEXTAREA') copy.textContent=original.value;
  else if(original.type!=='file'&&original.type!=='password') copy.setAttribute('value',original.value);
 }
 return clone;
}

export function externalizeFollowMirror(index,msg){
 const st=getSettings(); if(st.generationSource!=='follow'||st.followDisplayMode!=='external') return;
 const el=messageElement(index); const body=messageBody(el); if(!body) return;
 const ctx=getContext();
 if(ctx?.chat?.[index]!==msg) return;
 const rejected=getRabbitMirrorFollowBatchFailure(ctx.chat,index);
 if(rejected){ showFollowRecoveryNotice(el,rejected); return; }
 const mirrors=inlineRabbitMirrorDetails(el);
 const mirror=mirrors[0]||null;
 if(!mirror) return;
 const key=`follow:${recordKey(ctx,index,msg)}`;
 const multiSource=followMessageSourceCandidates(msg).find(hasMultifaceMarkup);
 if(multiSource){
  const parsed=parseMultifaceOutput(multiSource,{allowProse:true});
  if(!parsed.ok || mirrors.length!==parsed.faces.length) return;
   let verifiedRoots=[];
   const proven=mirrors.every((details,faceIndex)=>{
   const root=details.closest?.('toto[data-rabbit-mirror="true"]')||details;
   const proof=getSanitizedRabbitMirrorFaceProof(root);
    const valid=proof?.origin==='follow'
    && Number(proof.faceIndex)===faceIndex
    && Number(proof.faceCount)===parsed.faces.length
     && String(proof.sourceHash||'')===rabbitMirrorMultifaceSourceHash(parsed.faces[faceIndex]?.html||'');
    if(valid) verifiedRoots.push(root);
    return valid;
  });
  if(!proven){
   // A host render/regex pass may replace the already-sanitized inline DOM
   // with clones, which cannot retain WeakMap proofs. Rebuild proof through
   // the existing exact-owner, sanitizer and integrity boundary; never trust a
   // serialized marker or silently leave the selected external mode inline.
   let recoveryFailure=null;
   const recovered=recoveredFollowFaces(multiSource,{ctx,messageIndex:index,message:msg,
    onFailure:failure=>{ recoveryFailure=failure; }});
   if(recovered.length!==parsed.faces.length){
    if(recoveryFailure) showFollowRecoveryNotice(el,recoveryFailure);
    return;
   }
   verifiedRoots=recovered;
  }
   // Serialize the DOM that actually passed sanitation and integrity, not the raw
   // model source whose hash was used only to establish each face's identity.
   const preparedFaces=verifiedRoots.map((root,faceIndex)=>{
    const clone=cloneFollowFaceForExternal(root);
    normalizeRecoveredFollowRoot(clone);
    stripIndependentTransientLayoutArtifacts(clone);
    return wrapPreparedIndependentFace(clone.outerHTML,faceIndex);
   });
   if(preparedFaces.some(face=>!face)) return;
   const html=preparedFaces.join('\n');
   if(!parseMultifaceOutput(html,{expectedCount:parsed.faces.length}).ok) return;
   const host=ensureExternalUi(el,key,html,'ready','follow',messageSourceFingerprint(msg));
   if(!host || externalFaceDetails(host).length!==parsed.faces.length || !externalFaceDetails(host).every(usableReadyDetails)) return;
   followOriginMarker(el,mirror.closest?.('toto')||mirror,true);
  for(const original of mirrors) removeInlineMirrorDuplicate(original);
  return;
 }
 const sourceClone=cloneFollowFaceForExternal(mirror);
 sourceClone.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay]')?.forEach(node=>node.remove());
 const sourceHtml=String(sourceClone.outerHTML||'');
 const semanticFingerprint=mirrorSemanticFingerprint(mirror);
 // A mobile BFCache restore or cross-device redraw can recreate the inline正文
 // while the old external shell is still connected. Reuse that exact shell and
 // move the freshly rendered details into it instead of showing two copies.
 if(!followOriginMarker(el,null,false)){
  const legacyContainer=legacyFollowOriginContainer(body);
  if(legacyContainer && !legacyContainer.contains(mirror)) legacyContainer.append(mirror);
 }
 followOriginMarker(el,mirror,true);
 let host=collapseDuplicateIdentityHosts(el,key,'follow','');
 if(!host){
  host=document.createElement('div');
  host.setAttribute(SOURCE_ATTR,'true');
  host.setAttribute(EXTERNAL_SHELL_ATTR,'true');
  host.className='rabbit-mirror-external-host rabbit-mirror-external-shell';
 }
 const previous=host.querySelector?.(':scope > details');
 const existingTools=externalToolHost(previous);
 mirror.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
 if(existingTools && mirror.querySelector?.(':scope > summary')) mirror.querySelector(':scope > summary').append(existingTools);
 mirror.removeAttribute('open');
 markExternalDetails(mirror,key,'follow');
 if(previous?.isConnected) previous.replaceWith(mirror); else host.append(mirror);
 host.dataset.rmKey=key;
 host.dataset.rmSource='follow';
 host.dataset.rmState='ready';
 host.__rabbitMirrorIndependentSource=sourceHtml;
 placeExternalHost(el,host,key,'follow');
 removeDuplicateExternalHosts(el,host,'follow');
 for(const duplicate of inlineRabbitMirrorDetails(el)){
  if(duplicate===mirror) continue;
  if(semanticFingerprint && mirrorSemanticFingerprint(duplicate)===semanticFingerprint) removeInlineMirrorDuplicate(duplicate);
 }
 scheduleExternalShellTint(host,sourceHtml);
 ensureExternalTools(host);
}


export function restoreFollowInline(elOrHost){
 const el=elOrHost?.matches?.(`[${SOURCE_ATTR}]`) ? messageElementForExternalHost(elOrHost) : elOrHost;
 const host=elOrHost?.matches?.(`[${SOURCE_ATTR}][data-rm-source="follow"]`)
  ? elOrHost
  : externalHosts(el).find(node=>node.dataset.rmSource==='follow');
 if(!host) return false;
 const owner=followRecoveryOwner(el);
 const rejected=owner?getRabbitMirrorFollowBatchFailure(owner.ctx.chat,owner.index):null;
 if(rejected){ showFollowRecoveryNotice(el,rejected); return false; }
 const faces=externalFaceDetails(host);
 if(faces.length>1){
  if(!owner || host.dataset.rmSourceHash!==messageSourceFingerprint(owner.message)) return false;
  const source=followMessageSourceCandidates(owner.message).find(hasMultifaceMarkup);
  const parsed=source?parseMultifaceOutput(source,{allowProse:true}):null;
  if(!parsed?.ok || parsed.faces.length!==faces.length || faces.some((details,faceIndex)=>{
   const proof=getSanitizedRabbitMirrorFaceProof(details);
   return proof?.origin!=='follow'||proof.faceIndex!==faceIndex||proof.faceCount!==faces.length
    ||proof.sourceHash!==messageSourceFingerprint(owner.message);
  })) return false;
  const body=messageBody(el); if(!body) return false;
  const marker=followOriginMarker(el,null,false);
  const fragment=document.createDocumentFragment();
  for(const [index,details] of faces.entries()){
   normalizeRecoveredFollowRoot(details);
   const toto=document.createElement('toto');
   toto.setAttribute('data-rabbit-mirror','true');
   toto.setAttribute('data-rm-face',String(index+1));
   toto.append(details);
   markSanitizedRabbitMirrorFace(toto,{origin:'follow',faceIndex:index,faceCount:faces.length,
    sourceHash:rabbitMirrorMultifaceSourceHash(parsed.faces[index].html),...presentationModeFields(getSanitizedRabbitMirrorFaceProof(details))});
   fragment.append(toto);
  }
  if(marker) marker.replaceWith(fragment); else body.append(fragment);
  host.remove(); removeEmptyFollowExternalAnchors(el||document);
  return true;
 }
 const mirror=host.querySelector(':scope > details'); const body=messageBody(el);
 if(!mirror || !body){ host.hidden=false; return false; }
 {
  mirror.removeAttribute('data-rabbit-mirror-external-details');
  mirror.removeAttribute('data-rabbit-mirror-external-owner');
  delete mirror.dataset.rabbitMirrorExternalOwner;
  delete mirror.dataset.rabbitMirrorExternalSource;
  delete mirror.dataset.rabbitMirrorOwnerChat;
  delete mirror.dataset.rabbitMirrorOwnerMesid;
  delete mirror.dataset.rabbitMirrorOwnerSwipe;
  delete mirror.dataset.rabbitMirrorOwnerKey;
  delete mirror.dataset.rabbitMirrorOwnerSourceHash;
  const marker=followOriginMarker(el,null,false);
  if(marker) marker.replaceWith(mirror);
  else{
   const legacyContainer=legacyFollowOriginContainer(body);
   if(legacyContainer) legacyContainer.append(mirror);
   else body.append(mirror);
  }
 }
 const parent=host.parentElement;
 host.remove();
 if(parent?.hasAttribute?.(FOLLOW_EXTERNAL_ANCHOR_ATTR) && !parent.querySelector?.(`[${SOURCE_ATTR}][data-rm-source="follow"]`)) parent.remove();
 removeEmptyFollowExternalAnchors(el||document);
 return true;
}

function followDetailsRootFromHtml(html=''){
 const raw=String(html||'');
 // This function is reached for every assistant message during a full sync. In
 // independent mode almost all messages contain no inline RabbitMirror at all;
 // running the full sanitizer/DOM parser just to discover that fact dominates
 // long-chat entry. A broad lexical gate is safe here because valid mirrors must
 // contain RabbitMirror markup/title evidence before sanitization can recover one.
 if(!raw || !/<(?:toto|details)\b/i.test(raw) || !/(?:data-rabbit-mirror|【兔子镜[：:])/i.test(raw)) return null;
 const cleaned=cleanRabbitMirrorOutput(raw); if(!cleaned) return null;
 // 跟随模式在热更新/BFCache 恢复时会直接从 message source 重建 DOM，同样绕过宿主消息净化。
 // 复用副 API 的挂载前安全边界，避免旧消息里的可执行属性在恢复路径重新获得执行机会。
 const source=sanitizeIndependentReadyFragment(cleaned); if(!source) return null;
 try{
  const template=document.createElement('template'); template.innerHTML=source;
  const details=[...template.content.querySelectorAll('details')].find(node=>isRabbitMirrorDetails(node));
  if(!details) return null;
  const toto=details.closest('toto');
  const root=(toto||details).cloneNode(true);
  rearmRabbitMirrorSerializedInteractionRoot(root);
  return root;
 }catch{return null;}
}

function followRecoveryOwner(el,message=null){
 const ctx=getContext();
 const raw=el?.getAttribute?.('mesid');
 const index=raw==null?-1:Number(raw);
 if(!Number.isInteger(index)||index<0||messageElement(index)!==el) return null;
 const current=ctx?.chat?.[index];
 if(!current||current.is_user===true||(message&&current!==message)) return null;
 return {ctx,index,message:current};
}

function showFollowRecoveryNotice(el,failure={}){
 if(!el) return;
 let notice=el.querySelector?.('[data-rabbit-mirror-follow-failure], [data-rabbit-mirror-follow-recovery-notice]');
 if(!notice){ notice=document.createElement('div'); (messageBody(el)||el).append(notice); }
 notice.setAttribute('data-rabbit-mirror-follow-recovery-notice','true');
 notice.setAttribute('role','status');
 const face=Number(failure.terminalFace);
 const label=Number.isInteger(face)&&face>0?`（第 ${face} 面）`:'';
 const knownFailure=failure.kind==='follow-multiface-rejected';
 notice.textContent=`兔子镜${knownFailure?'本批生成失败':'历史恢复暂缓'}${label}：${String(failure.message||'这批内容未通过恢复前检查。')} 不会自动发送新请求。`;
 notice.dataset.rmRecoveryCode=String(failure.code||'follow-recovery-rejected');
}

function clearFollowRecoveryNotice(el){
 el?.querySelectorAll?.('[data-rabbit-mirror-follow-failure], [data-rabbit-mirror-follow-recovery-notice]')?.forEach(node=>node.remove());
}

function followRecipeSource(message){
 const swipe=Number.isInteger(message?.swipe_id)?message.swipe_id:-1;
 return swipe>=0&&typeof message?.swipes?.[swipe]==='string'?message.swipes[swipe]:String(message?.mes||'');
}

function nativeRecoveredFollowMedia(details){
 // Evidence must be in the sanitized working controls/scene, not a title that
 // merely calls three generic tabs a radio or a book. This is a conservative
 // exception for legacy output without its original selection record.
 const radios=[...details.querySelectorAll('input[type="radio"][id]')];
 const labels=[...details.querySelectorAll('label[for]')];
 const linked=labels.filter(label=>radios.some(input=>input.id===label.getAttribute('for')));
 const range=details.querySelector('input[type="range"][min][max]');
 const text=String(details.textContent||'');
 if(radios.length>=2&&linked.length>=2&&range&&/\b(?:FM|AM|MHz|kHz)\b/i.test(text)){
  const min=Number(range.getAttribute('min')),max=Number(range.getAttribute('max'));
  if(Number.isFinite(min)&&Number.isFinite(max)&&max>min&&linked.filter(label=>/(?:频道|电台|FM|AM|MHz|kHz)/i.test(label.textContent||'')).length>=2){
   return [{id:'legacy-structure:radio-tuner',title:'电台调频',summary:'净化后保留有范围的调频控件及多个关联频道。',tags:['tuner']}];
  }
 }
 const css=[...details.querySelectorAll('style')].map(style=>String(style.textContent||'')).join('\n');
 if(radios.length>=2&&linked.filter(label=>/(?:翻页|上一页|下一页|第\s*[\d一二三四五六七八九十]+\s*页)/.test(label.textContent||'')).length>=2
   &&/rotateY\s*\(/i.test(css)&&/transform-style\s*:\s*preserve-3d/i.test(css)&&/:checked\b/.test(css)){
  return [{id:'legacy-structure:page-turn',title:'立体翻页',summary:'净化后保留页状态控件、关联翻页入口及实际三维翻转规则。',tags:['page-turn']}];
 }
 return [];
}

function recoveredFollowFaces(html='',options={}){
 const fail=(code,message,terminalFace=null)=>{
  options.onFailure?.({code,message,terminalFace});
  return [];
 };
 if(!hasMultifaceMarkup(html)) return [];
 const parsed=parseMultifaceOutput(html,{allowProse:true});
 if(!parsed.ok) return fail(parsed.errors?.[0]?.code||'multiface-incomplete','历史批次的面数、顺序或独立结构不完整；未自动恢复。',parsed.errors?.[0]?.terminalFace||null);
 const ctx=options.ctx, index=Number(options.messageIndex), message=options.message;
 if(!ctx||!Number.isInteger(index)||ctx.chat?.[index]!==message||!message) return fail('follow-recovery-owner-missing','无法确认这批历史内容所属的消息；未自动恢复。');
 const rejected=getRabbitMirrorFollowBatchFailure(ctx.chat,index);
 if(rejected){ options.onFailure?.(rejected); return []; }
 const recipeSource=followRecipeSource(message);
 const partialRecord=readFollowPartialResult(ctx.chat,index);
 const exactPartial=!!partialRecord && (partialRecord.html===html || (options.snapshotOwnerVerified===true && options.recipeSourceHash===rabbitMirrorMultifaceSourceHash(recipeSource)));
 const roots=[];
 for(const face of parsed.faces){
   const localFailure=exactPartial?partialRecord.failedFaces.find(item=>item.faceIndex===face.index):null;
   const failureInner=localFailure?parseMultifaceOutput(createMultifaceFailureSlot(face.index,localFailure.code)).faces[0]?.inner:null;
   const rules=getSettings()?.rabbitMirrorBannedWords||[];
   const storedFace=exactPartial && partialRecord.html===html && !localFailure;
   const alreadyFiltered=storedFace && matchesRabbitMirrorTextReplacementReceipt(
    partialRecord.textReplacementReceipts?.[face.index],face.html,rules,followPartialResultFaceOwnerKey(partialRecord,face.index));
   const details=extractReadyDetails(failureInner||face.inner,!!alreadyFiltered);
   if(!usableReadyDetails(details)) return fail('multiface-sanitized-invalid','净化后缺少可用的标题或内容；未自动恢复。',face.index+1);
   normalizeRecoveredFollowRoot(details);
  const toto=document.createElement('toto');
  toto.setAttribute('data-rabbit-mirror','true');
  toto.setAttribute('data-rm-face',String(face.index+1));
   toto.append(details);
   if(localFailure){roots.push(toto);continue;}
   if(details.hasAttribute(MULTIFACE_FAILURE_ATTR)) return fail('untrusted-failure-slot','失败位置缺少同一消息的本地保存记录，未将它当作成功面恢复。',face.index+1);
   roots.push(toto);
 }
 const prepared=roots.map(root=>root.outerHTML).join('\n');
 if(!parseMultifaceOutput(prepared,{expectedCount:parsed.faces.length}).ok){
  return fail('multiface-sanitized-invalid','过滤后的历史批次出现空标题、同名或结构歧义；未自动恢复。');
 }
 for(let faceIndex=0;faceIndex<roots.length;faceIndex+=1){
  const originalHash=options.snapshotOwnerVerified===true&&Array.isArray(options.faceSourceHashes)
   &&options.faceSourceHashes.length===roots.length?options.faceSourceHashes[faceIndex]:null;
  if(!markSanitizedRabbitMirrorFace(roots[faceIndex],{origin:'follow',faceIndex,faceCount:roots.length,
   sourceHash:originalHash||rabbitMirrorMultifaceSourceHash(parsed.faces[faceIndex].html),...presentationModeFields(getRabbitMirrorRecipe({chatKey:chatKey(ctx),messageIndex:index,swipeId:swipeId(message),message,faceIndex,includeExternalOnly:true}))})) return fail('follow-recovery-proof-rejected','历史内容的净化证明未建立；未自动恢复。',faceIndex+1);
 }
 return roots;
}

function normalizeRecoveredFollowRoot(root){
 if(!root) return null;
 root.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay], [data-rabbit-mirror-resay-status]')?.forEach(node=>node.remove());
 const details=root.matches?.('details')?root:root.querySelector?.('details');
 if(!details) return null;
 ['data-rabbit-mirror-external-details','data-rabbit-mirror-external-owner','data-rabbit-mirror-external-source','data-rabbit-mirror-owner-chat','data-rabbit-mirror-owner-mesid','data-rabbit-mirror-owner-swipe','data-rabbit-mirror-owner-key','data-rabbit-mirror-owner-source-hash'].forEach(attr=>details.removeAttribute(attr));
 return root;
}

function followMessageSourceCandidates(msg){
 const candidates=[]; const seen=new Set();
 const push=value=>{ const text=String(value||''); if(!text||seen.has(text)) return; seen.add(text); candidates.push(text); };
 const live=getContext();
 const index=Array.isArray(live?.chat)?live.chat.indexOf(msg):-1;
 const partial=index>=0?readFollowPartialResult(live.chat,index):null;
 if(partial){push(partial.html);return candidates;}
 // Prefer the actual visible source, then the current Swipe, then mes. Older
 // SillyTavern/plugin combinations can temporarily leave these three fields
 // out of sync during a hot update or message DOM rebuild.
 push(msg?.extra?.display_text);
 const swipeIndex=Number.isInteger(msg?.swipe_id)?Number(msg.swipe_id):-1;
 if(swipeIndex>=0) push(msg?.swipes?.[swipeIndex]);
 push(msg?.mes);
 return candidates;
}

export function restoreFollowMirrorFromMessageSource(el,msg){
 if(!el) return false;
 const owner=followRecoveryOwner(el,msg); if(!owner) return false;
 const rejected=getRabbitMirrorFollowBatchFailure(owner.ctx.chat,owner.index);
 if(rejected){ showFollowRecoveryNotice(el,rejected); return false; }
 if(inlineRabbitMirrorDetails(el).length || externalHosts(el).some(node=>node.dataset.rmSource==='follow')){
  clearFollowRecoveryNotice(el);
  return false;
 }
 const body=messageBody(el); if(!body) return false;
 let recoveryFailure=null;
 for(const source of followMessageSourceCandidates(msg)){
    if(hasMultifaceMarkup(source)){
     const faces=recoveredFollowFaces(source,{ctx:owner.ctx,messageIndex:owner.index,message:msg,onFailure:failure=>{recoveryFailure=failure;}});
     if(!faces.length){
      // A rejected complete source must not fall through to another copy or to
      // the single-face recovery path and silently revive a partial batch.
      if(recoveryFailure){ showFollowRecoveryNotice(el,recoveryFailure); return false; }
      continue;
     }
     body.append(...faces);
     for(const face of faces){ try{ refreshRabbitMirrorToolsInScope(face); }catch{} }
     clearFollowRecoveryNotice(el);
     return true;
   }
  const root=normalizeRecoveredFollowRoot(followDetailsRootFromHtml(source));
  if(!root) continue;
  const details=root.matches?.('details')?root:root.querySelector?.('details');
  if(!isRabbitMirrorDetails(details)) continue;
   body.append(root);
   try{ refreshRabbitMirrorToolsInScope(root); }catch{}
   clearFollowRecoveryNotice(el);
   return true;
 }
 return false;
}

function mountedFollowRootForMessage(el){
 if(!el) return null;
 const host=externalHosts(el).find(node=>node.dataset.rmSource==='follow');
 const externalDetails=host?.querySelector?.(':scope > details');
 if(externalDetails) return externalDetails;
 const inlineDetails=inlineRabbitMirrorDetails(el)[0]||null;
 if(!inlineDetails) return null;
 return inlineDetails.closest?.('toto')||inlineDetails;
}

export function captureMountedFollowSnapshots(){
 const snapshots=[]; const seen=new Set(); const ctx=getContext();
  for(const {i} of assistantMessages(ctx)){
   const index=Number(i); if(!Number.isInteger(index)||index<0) continue;
   const message=ctx?.chat?.[index];
   if(!message || getRabbitMirrorFollowBatchFailure(ctx.chat,index)) continue;
  const el=messageElement(index); const root=mountedFollowRootForMessage(el); if(!root) continue;
   const host=externalHosts(el).find(node=>node.dataset.rmSource==='follow');
   const inline=inlineRabbitMirrorDetails(el);
    const html=host && externalFaceDetails(host).length>1 ? serializeExternalFaceDetails(host)
     : inline.length>1 ? inline.slice(0,5).map((details,faceIndex)=>wrapPreparedIndependentFace((details.closest?.('toto')||details).outerHTML,faceIndex)).join('\n')
     : String(root.outerHTML||'').trim();
    if(!html) continue;
   let faceSourceHashes=null;
   if(hasMultifaceMarkup(html)){
    const source=followMessageSourceCandidates(message).find(hasMultifaceMarkup);
    const original=source?parseMultifaceOutput(source,{allowProse:true}):null;
    const mounted=host?externalFaceDetails(host):inline;
    if(!original?.ok||mounted.length!==original.faces.length) continue;
    faceSourceHashes=original.faces.map(face=>rabbitMirrorMultifaceSourceHash(face.html));
    const current=mounted.every((details,faceIndex)=>{
     const proof=getSanitizedRabbitMirrorFaceProof(host?details:(details.closest?.('toto')||details));
     if(proof?.origin!=='follow'||proof.faceIndex!==faceIndex||proof.faceCount!==mounted.length) return false;
     if(proof.sourceHash===faceSourceHashes[faceIndex]) return true;
     return !!host && host.dataset.rmSourceHash===messageSourceFingerprint(message)
      && proof.sourceHash===messageSourceFingerprint(message);
    });
    if(!current) continue;
   }
  const fingerprint=hashText(html.replace(/\s+/g,' '));
  const identity=`${index}:${fingerprint}`; if(seen.has(identity)) continue; seen.add(identity);
   // In-memory hot-update snapshot only. A DOM at the same numeric mesid in
   // another chat/Swipe/source must never inherit this working copy.
    snapshots.push({mesid:index,html,message,chatKey:chatKey(ctx),swipeId:swipeId(message),faceSourceHashes,
    sourceHash:rabbitMirrorMultifaceSourceHash(message.mes||''),
    recipeSourceHash:rabbitMirrorMultifaceSourceHash(followRecipeSource(message))});
 }
 return snapshots;
}

export function restoreMountedFollowSnapshots(snapshots=[]){
 const ctx=getContext();
 for(const item of snapshots){
  const index=Number(item?.mesid); if(!Number.isInteger(index)||index<0) continue;
  const message=ctx?.chat?.[index];
  if(!message || item.message!==message || item.chatKey!==chatKey(ctx) || item.swipeId!==swipeId(message)
    || item.sourceHash!==rabbitMirrorMultifaceSourceHash(message.mes||'')
    || item.recipeSourceHash!==rabbitMirrorMultifaceSourceHash(followRecipeSource(message))) continue;
  const el=messageElement(index); const body=messageBody(el); if(!body) continue;
  const rejected=getRabbitMirrorFollowBatchFailure(ctx.chat,index);
  if(rejected){ showFollowRecoveryNotice(el,rejected); continue; }
  if(inlineRabbitMirrorDetails(el).length || externalHosts(el).some(node=>node.dataset.rmSource==='follow')) continue;
   if(hasMultifaceMarkup(item.html)){
     const roots=recoveredFollowFaces(item.html,{ctx,messageIndex:index,message,snapshotOwnerVerified:true,
      recipeSourceHash:item.recipeSourceHash,faceSourceHashes:item.faceSourceHashes,onFailure:failure=>showFollowRecoveryNotice(el,failure)});
    if(roots.length){ body.append(...roots); for(const root of roots){ try{ refreshRabbitMirrorToolsInScope(root); }catch{} } clearFollowRecoveryNotice(el); }
    continue;
   }
   const root=normalizeRecoveredFollowRoot(followDetailsRootFromHtml(item.html)); if(!root) continue;
  body.append(root); try{ refreshRabbitMirrorToolsInScope(root); }catch{} clearFollowRecoveryNotice(el);
 }
}


export function automaticIndependentTiming(){ return independentGenerationTiming(getSettings())==='auto'; }

export function manualIndependentTiming(){ return independentGenerationTiming(getSettings())==='manual'; }

export function manualIntentForMessage(ctx,index){
 if(!manualIndependentTiming()) return null;
 const findBound=()=>{
  const intents=globalThis[MANUAL_INTENTS_KEY];
  if(!Array.isArray(intents)) return null;
  return intents.slice().reverse().find(intent=>!intent.cancelled && intent.chat===ctx.chat
   && intent.chatKey===chatKey(ctx) && intent.index===Number(index)
   && intent.message===ctx.chat?.[index] && intent.swipe===swipeId(intent.message))||null;
 };
 const bound=findBound();
 if(bound) return bound;
 globalThis.__rabbitMirrorBindIndependentManualIntent?.(Number(index));
 return findBound();
}

function captureManualBodyOwner(ctx,index,msg,intent=null,{firstGeneration=false}={}){
 const visible=createIndependentVisibleTextReader(index,getSettings())(msg,index);
 const processor=ctx.streamingProcessor;
 return {chat:ctx.chat,chatKey:chatKey(ctx),index,message:msg,swipe:swipeId(msg),
  baseSlot:messageBaseSlotKey(ctx,index,msg),epoch:operationEpochForBase(messageBaseSlotKey(ctx,index,msg)),
  sourceText:String(msg.mes||''),visible:Object.freeze({...visible}),intent,firstGeneration,
  processor:Number(processor?.messageId)===index?processor:null};
}

export function manualBodyOwnerCurrent(owner){
 const ctx=getContext();
 if(!owner || runtimeMode()!=='independent' || independentGenerationTiming(getSettings())==='off'
  || owner.intent?.cancelled || owner.chat!==ctx.chat || owner.chatKey!==chatKey(ctx)
  || owner.message!==ctx.chat?.[owner.index] || owner.swipe!==swipeId(owner.message)
  || owner.epoch!==operationEpochForBase(owner.baseSlot)
  || !isRabbitMirrorEligibleAssistantMessage(owner.message)
  || hasExplicitSourceReplacementEvidence(ctx,owner.index,owner.message)) return false;
 const source=String(owner.message.mes||'');
 // The click freezes the request text. Only appending after that exact prefix
 // can keep this paid request; replacing even one captured character cannot.
 return source===owner.sourceText || (!!owner.sourceText && source.startsWith(owner.sourceText));
}

function currentManualPlaceholder(host,ctx,index,msg,intent){
 const owner=host && manualPlaceholderOwners.get(host);
 return !!(host?.isConnected && host.dataset.rmState==='manual' && owner
  && owner.intent===intent && owner.chat===ctx.chat && owner.chatKey===chatKey(ctx)
  && owner.index===index && owner.message===msg && owner.swipe===swipeId(msg)
  && host.querySelector?.('[data-rm-manual-generate]'));
}

export function ensureManualGenerationPlaceholder(ctx,index,msg,intent,settlingFlight=null){
 const el=messageElement(index);
 try{ globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('placeholder',{result:'entered',index,elementFound:!!el,intentPresent:!!intent,consumed:!!intent?.consumed,cancelled:!!intent?.cancelled,timingManual:manualIndependentTiming()}); }catch{}
 if(!el || !intent || intent.consumed || intent.cancelled || !manualIndependentTiming()) return null;
 const existing=externalHosts(el).find(host=>host.dataset.rmSource==='independent');
 const active=activeIndependentFlightForBase(messageBaseSlotKey(ctx,index,msg));
 if(readyDetailsFromHost(existing) || (active && active!==settlingFlight)) return existing||null;
 if(currentManualPlaceholder(existing,ctx,index,msg,intent)) return existing;
 const host=ensureExternalUi(el,recordKey(ctx,index,msg),intent.manualSkipReason||'点击后，按这一刻可见的正文生成兔子镜。','manual','independent',messageSourceFingerprint(msg));
 if(!host){try{globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('placeholder',{result:'unavailable',index});}catch{}return null;}
 manualPlaceholderOwners.set(host,{intent,chat:ctx.chat,chatKey:chatKey(ctx),index,message:msg,swipe:swipeId(msg)});
 const details=host.querySelector?.(':scope > details');
 const body=details?.querySelector?.(':scope > .rabbit-mirror-external-placeholder-body');
 if(body && !body.querySelector('[data-rm-manual-generate]')){
  const button=document.createElement('button');button.type='button';
  button.setAttribute('data-rm-manual-generate','true');button.className='rabbit-mirror-external-manual-action';
  button.textContent='生成兔子镜';body.append(button);
 }
 try{globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('placeholder',{result:'created',index,connected:!!host.isConnected,hidden:!!host.hidden,hasButton:!!host.querySelector?.('[data-rm-manual-generate]')});}catch{}
 return host;
}

function settleSkippedManualIndependentFlightUi(flight,result){
 const owner=flight.manualBodyOwner,intent=owner?.intent;
 if(!owner?.firstGeneration || !intent || flight.dispatchLease?.consumed?.()
  || !manualIndependentTiming() || !manualBodyOwnerCurrent(owner)) return false;
 intent.consumed=false;
 intent.manualSkipReason=result.reason==='directive-disabled'
  ? '本次未生成：上下文中的关闭兔子镜指令已生效，未发送请求。调整该指令后可再次点击。'
  : '本次未生成：当前没有可用的生成提示词，未发送请求。调整设置后可再次点击。';
 const ctx=getContext();
 const host=ensureManualGenerationPlaceholder(ctx,owner.index,owner.message,intent,flight);
 if(host) flight.uiSettled=true;
 return !!host;
}

function rememberManualClickOwner(owner){
 if(!owner) return;
 manualTerminalOwners.set(owner.baseSlot,owner);
 const intent=owner?.intent;
 if(!intent) return;
 intent.consumed=true;
}

function generateManualIndependentMirror(root){
 try{globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('click',{result:'entered',runtimeCurrent:currentRuntime(),timingManual:manualIndependentTiming()});}catch{}
 const host=root?.matches?.('.rabbit-mirror-external-host')?root:root?.closest?.('.rabbit-mirror-external-host');
 const owner=host && manualPlaceholderOwners.get(host);
 if(!owner || !host.isConnected || host.dataset.rmState!=='manual' || !manualIndependentTiming() || runtimeMode()!=='independent') return false;
 const ctx=getContext(),intent=owner.intent,msg=ctx.chat?.[owner.index];
 if(owner.chat!==ctx.chat || owner.chatKey!==chatKey(ctx) || owner.message!==msg || owner.swipe!==swipeId(msg)
  || !isRabbitMirrorEligibleAssistantMessage(msg) || intent.cancelled || intent.consumed
  || manualIntentForMessage(ctx,owner.index)!==intent) return false;
 if(activeIndependentFlightForBase(messageBaseSlotKey(ctx,owner.index,msg))) return true;
 const snapshot=captureManualBodyOwner(ctx,owner.index,msg,intent,{firstGeneration:true});
 rememberManualClickOwner(snapshot);
 for(const button of host.querySelectorAll('[data-rm-manual-generate]')) button.disabled=true;
 void generateFor(owner.index,msg,true,true,null,null,snapshot);
 return true;
}

export function handleIndependentManualBridge(event={}){
 try{globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('bridge',{runtimeCurrent:currentRuntime(),timingManual:manualIndependentTiming(),index:Number.isInteger(event.intent?.index)?event.intent.index:-1});}catch{}
 if(!currentRuntime()) return;
 const ctx=getContext();
 for(const flight of globalFlights().values()){
  const snapshot=flight.manualBodyOwner;
  if(!snapshot) continue;
  const intent=event.intent;
  const replacement=intent && intent!==snapshot.intent && !intent.cancelled
   && intent.chat===snapshot.chat && intent.chatKey===snapshot.chatKey
   && ['continue','swipe','regenerate'].includes(intent.type) && intent.tailIndex===snapshot.index;
  if(replacement || !manualBodyOwnerCurrent(snapshot)) abortFlight(flight,replacement?'manual-source-replaced':'manual-owner-replaced');
 }
 if(event.kind==='clear'){
  manualTerminalOwners.clear();
  for(const host of allExternalHosts()) if(host.dataset.rmState==='manual') host.remove();
  return;
 }
 if(!manualIndependentTiming()) return;
 const index=Number.isInteger(event.intent?.index)&&event.intent.index>=0?event.intent.index:ctx.chat?.length-1;
 if(!Number.isInteger(index)||index<0 || !isRabbitMirrorEligibleAssistantMessage(ctx.chat?.[index])) return;
 const intent=manualIntentForMessage(ctx,index),el=messageElement(index);
 try{globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('bridge',{index,intentPresent:!!intent,elementFound:!!el});}catch{}
 if(!intent || intent.consumed) return;
 if(externalHosts(el).some(host=>currentManualPlaceholder(host,ctx,index,ctx.chat[index],intent))) return;
 queueMessageSync([index]);
}

export function queueManualGenerationTerminalSync(){
 // A paid manual result can finish before the main reply's trailing status.
 // END/STOP only passively reconciles an already captured exact owner; it
 // never authorizes a request or discovers an old message.
 const ids=new Set(),ctx=getContext();let ownsEndedProcessor=false;
 for(const [base,owner] of manualTerminalOwners){
  if(owner.intent && !owner.intent.consumed) continue;
  if(!manualBodyOwnerCurrent(owner)){manualTerminalOwners.delete(base);continue;}
  ids.add(owner.index);
  if(owner.processor && owner.processor===ctx.streamingProcessor
   && Number(owner.processor.messageId)===owner.index
   && (owner.processor.isFinished===true || owner.processor.isStopped===true)) ownsEndedProcessor=true;
 }
 if(ids.size && (manualIndependentTiming() || ownsEndedProcessor)
  && !automaticGenerationCutovers.get(chatKey(ctx))?.activeHostGeneration && !externalHostGenerationActivity().active){
  writeHostGenerationInProgress(false);writeHostGenerationHintStartedAt(0);
 }
 if(ids.size) queueMessageSync([...ids]);
}

export function reconcileManualTimingChange(){
 const timing=independentGenerationTiming(getSettings());
 if(lastAppliedIndependentTiming!==null && lastAppliedIndependentTiming!==timing){
  clearScheduledGeneration();
  globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]=[];
  for(const cutover of automaticGenerationCutovers.values()){
   cutover.authorized.clear();
   const paidEarly=[...(cutover.earlyBodies?.values()||[])].some(owner=>!owner.cancelled&&owner.flight?.dispatchLease?.consumed?.());
   if(!paidEarly){clearAutomaticHostGenerationSettlement(cutover.activeHostGeneration);cutover.activeHostGeneration=null;}
   for(const owner of cutover.earlyBodies?.values()||[]) if(!owner.flight?.dispatchLease?.consumed?.()) cancelEarlyBodyOwner(owner,'generation-timing-changed');
  }
  for(const flight of globalFlights().values()) if(!flight.dispatchLease?.consumed?.()) abortFlight(flight,'generation-timing-changed');
  for(const host of allExternalHosts()) if(host.dataset.rmState==='manual') host.remove();
 }
 writeLastAppliedIndependentTiming(timing);
}

export function runtimeMode(){
 const st=getSettings();
 if(st.enabled===false || st.autoRabbitMirrorInjection===false) return 'off';
 if(st.generationSource==='independent') return 'independent';
 if(st.generationSource==='follow' && st.followDisplayMode==='external') return 'follow-external';
 return 'inline';
}

export function passiveObservedIdentity(ctx,index,msg){
 return {
  [INDEPENDENT_OWNER_OBSERVATION]:{ctx,index,msg},
  slot:messageSlotKey(ctx,index,msg),
  sourceHash:messageSourceFingerprint(msg),
  bodyHash:messageBodyFingerprint(msg),
  displayHash:messageDisplayFingerprint(msg),
  reasoningHash:messageReasoningFingerprint(msg),
  legacySlots:legacyMessageSlotKeys(ctx,index,msg),
 };
}

export function automaticCutoverVersionToken(msg){
 return `${swipeId(msg)}:${messageBodyFingerprint(msg)}`;
}

export function boundIndependentIntentOwner(intent,ctx,index){
 const owner=intent?.[INDEPENDENT_INTENT_OWNER];
 return owner && owner.chat===ctx.chat && owner.tail===ctx.chat?.[Number(intent.tailIndex)]
  && owner.message===ctx.chat?.[index] && owner.index===Number(index) && owner.swipe===swipeId(owner.message)
  ? owner : null;
}

export function refreshDeferredIndependentProof(ctx,index){
 if(externalHostGenerationActivity().active) return false;
 let changed=false;
 const source=deferredIndependentGenerationIntents();
 const next=source.map(intent=>{
  if(deferredIndependentIntentCandidateIndex(intent,ctx)!==Number(index)
   || intent.terminalReason!=='generation-ended' || !intent.terminalAt || intent.auxiliaryTerminalPending
   || intent.intermediateAt) return intent;
  const owner=boundIndependentIntentOwner(intent,ctx,index);
  if(!owner || (!owner.receivedAt && !owner.renderedAt)) return intent;
  const proof=automaticHostRenderProof(index);
  const processor=hostModule?.streamingProcessor || ctx.streamingProcessor;
  if(proof==='stream-tool-intermediate' || processor?.isStopped===true || processor?.abortController?.signal?.aborted===true) return intent;
  const toolCapable=intent.toolCapable!==false || automaticHostGenerationMayUseTools(intent.type,ctx);
  if(!owner.renderedAt && toolCapable && proof!=='stream-final') return intent;
  const bodyHash=messageBodyFingerprint(owner.message);
  if(!String(owner.message.mes||'').trim() || (intent.completedAt && intent.finalBodyHash===bodyHash)) return intent;
  changed=true;
  return Object.freeze({...intent,toolCapable,completedAt:Date.now(),finalIndex:Number(index),finalBodyHash:bodyHash,
   finalProof:owner.renderedAt?(intent.finalProof||proof):'received-ended',completionReason:'owner-ended-reconciled'});
 });
 if(changed) globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]=next;
 return changed;
}

export function automaticAuthorizationLineage(ctx,index,evidence){
 const fromIntent=boundIndependentIntentOwner(evidence,ctx,index);
 const fromRender=evidence?.tentativeRender;
 const owner=fromIntent || (fromRender?.message===ctx.chat?.[index] && fromRender?.chat===ctx.chat ? fromRender : null);
 if(!owner) return null;
 const ended=fromIntent ? evidence.terminalReason==='generation-ended'
  : evidence.terminalReason===String(hostModule?.event_types?.GENERATION_ENDED||'GENERATION_ENDED');
 return {chat:ctx.chat,message:ctx.chat[index],index:Number(index),swipe:swipeId(ctx.chat[index]),
  terminalEnded:ended,epoch:operationEpochForBase(messageBaseSlotKey(ctx,index,ctx.chat[index]))};
}

export function stampAutomaticAuthorizationEpoch(ctx,index){
 const proof=automaticGenerationCutovers.get(chatKey(ctx))?.authorized?.get(Number(index))?.[INDEPENDENT_INTENT_OWNER];
 if(proof) proof.epoch=operationEpochForBase(messageBaseSlotKey(ctx,index,ctx.chat[index]));
}

function refreshUnpaidAutomaticAuthorization(ctx,index,authorization){
 const cutover=automaticGenerationCutovers.get(chatKey(ctx));
 const proof=authorization?.[INDEPENDENT_INTENT_OWNER]; const msg=ctx.chat?.[index];
 if(!proof || cutover?.authorized.get(Number(index))!==authorization || proof.chat!==ctx.chat
  || proof.message!==msg || proof.index!==Number(index) || proof.swipe!==swipeId(msg) || !proof.terminalEnded) return false;
 const base=messageBaseSlotKey(ctx,index,msg);
 if(proof.epoch!==operationEpochForBase(base) || automaticDispatchAlreadyConsumed(base)
  || activeIndependentFlightForBase(base)) return false;
 if([...automaticFailureStops.values()].some(failure=>failure.baseSlot===base && failure.operationEpoch===proof.epoch)) return false;
 if(cutover.activeHostGeneration || externalHostGenerationActivity().active) return 'waiting';
 authorization.token=automaticCutoverVersionToken(msg);
 return true;
}

export function deferredIndependentGenerationIntents(){
 const now=Date.now();
 const source=Array.isArray(globalThis[INDEPENDENT_GENERATION_INTENTS_KEY])?globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]:[];
 const current=source.filter(intent=>intent
  && INDEPENDENT_GENERATION_INTENT_TYPES.has(String(intent.type||''))
  && now-Number(intent.startedAt||0)<=INDEPENDENT_GENERATION_INTENT_TTL_MS);
 if(current.length!==source.length) globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]=current;
 return current;
}

export function deferredIndependentIntentCandidateIndex(intent,ctx=getContext()){
 if(!intent || String(intent.chatKey||'')!==chatKey(ctx)) return null;
 const chat=Array.isArray(ctx?.chat)?ctx.chat:[];
 const tailIndex=Number(intent.tailIndex);
 if(!Number.isInteger(tailIndex) || tailIndex<0) return null;
 const tail=chat[tailIndex];
 const tailRole=String(intent.tailRole||'');
 const roleMatches=tailRole==='user'
  ? tail?.is_user===true
  : tailRole==='system'
   ? isRabbitMirrorToolResultMessage(tail)
   : tailRole==='assistant'
    ? isRabbitMirrorEligibleAssistantMessage(tail)
    : false;
 const type=String(intent.type||'');
 if(type==='normal'){
  if(!roleMatches
   || messageBodyFingerprint(tail)!==String(intent.tailBodyHash||'')
   || swipeId(tail)!==Number(intent.tailSwipeId||0)) return null;
  const candidate=chat[tailIndex+1];
  return isRabbitMirrorEligibleAssistantMessage(candidate) && String(candidate.mes||'').trim() ? tailIndex+1 : null;
 }
 if(['continue','swipe','regenerate'].includes(type) && tailRole==='assistant' && isRabbitMirrorEligibleAssistantMessage(tail)){
  const changed=messageBodyFingerprint(tail)!==String(intent.tailBodyHash||'') || swipeId(tail)!==Number(intent.tailSwipeId||0);
  return changed?tailIndex:null;
 }
 return null;
}

function deferredIndependentIntentHasFinalProof(intent,ctx,index){
 const normalized=Number(index); const message=ctx?.chat?.[normalized];
 const proof=String(intent?.finalProof||'');
 const lifecycleComplete=Number(intent?.terminalAt)>0 || proof==='stream-final' || proof==='non-tool-final';
 return Number(intent?.finalIndex)===normalized
   && Number(intent?.completedAt)>0
  && lifecycleComplete
  && isRabbitMirrorEligibleAssistantMessage(message)
  && (!intent?.[INDEPENDENT_INTENT_OWNER] || !!boundIndependentIntentOwner(intent,ctx,normalized))
   && messageBodyFingerprint(message)===String(intent?.finalBodyHash||'');
}

export function deferredIndependentIntentCompletedAt(ctx,index){
 const normalized=Number(index);
 return deferredIndependentGenerationIntents()
  .filter(intent=>deferredIndependentIntentCandidateIndex(intent,ctx)===normalized
   && deferredIndependentIntentHasFinalProof(intent,ctx,normalized))
  .reduce((latest,intent)=>Math.max(latest,Number(intent?.completedAt)||0),0);
}

export function claimDeferredIndependentGenerationIntent(ctx,index,reason='deferred-generation-intent',{requireFinalProof=false}={}){
 const normalized=Number(index); const source=deferredIndependentGenerationIntents();
 const matching=source.filter(intent=>deferredIndependentIntentCandidateIndex(intent,ctx)===normalized
   && (!requireFinalProof || deferredIndependentIntentHasFinalProof(intent,ctx,normalized)));
 if(!matching.length || !unlockAutomaticGenerationCutover(ctx,normalized,reason,matching.at(-1))) return false;
 // Consume only the exact target proof(s). Other completed messages in the same
 // chat may have finished before the cold graph woke and remain recoverable.
 const consumed=new Set(matching);
 globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]=source.filter(intent=>!consumed.has(intent));
 return true;
}

export function ensureAutomaticGenerationCutover(ctx=getContext()){
 const ownerChat=chatKey(ctx);
 if(automaticGenerationCutovers.has(ownerChat)) return automaticGenerationCutovers.get(ownerChat);
 // Default deny. Historical messages appended after CHAT_CHANGED are not "new"
 // merely because their index is larger than an early/partial loading boundary.
 const cutover={authorized:new Map(),activeHostGeneration:null,createdAt:Date.now(),failureRecoveryToken:{}};
 automaticGenerationCutovers.set(ownerChat,cutover);
 return cutover;
}
// Early-body state is transient and scoped to the exact visible host operation.
// Neither this state nor cumulative token text is written to settings/cache/chat.

export function earlyBodyConfigSignature(settings=getSettings()){
 const advanced=settings.independentAdvancedEnabled===true?independentAdvancedOptionsSignature(settings):'';
 return JSON.stringify([settings.enabled!==false,settings.autoRabbitMirrorInjection!==false,
  settings.generationSource,settings.mode,settings.independentEarlyBodyEnabled===true,
  String(settings.independentEarlyBodyChatKey||''),settings.independentEarlyBodyTags||[],
  settings.independentContextExcludedTags||[],
  // No API keys or chat text. Changes to generation inputs revoke this optional
  // snapshot; unrelated UI toggles do not invalidate a paid result.
  ['independentConnectionProfileId','independentApiBaseUrl','independentApiModel','independentApiTemperature','independentApiMaxTokens',
   'independentContextMaxLayers','independentReadCharacterCardSummary','independentReadPersonaSummary','independentReadGlobalWorldInfo','independentWorldInfoDisabledBooks',
   'rabbitMirrorFaceCount','samplingMode','rawPolicy','showCot','avoidRepeat','cooldownRounds','blacklistEnabled','blacklistedThemeIds','blacklistedFormatIds',
   'favoriteThemeIds','favoriteFormatIds','favoriteThemeMultipliers','favoriteFormatMultipliers','presentationWorldviewLock','richFormatBias',
   'externalWorldBookRandomEnabled','externalWorldBookMixMode','enhancedVisualDrawing','visualPromptEditingEnabled','visualPrompt','visualExtraPrompt','visualAvoidPrompt',
   'appearanceReferenceEnabled','appearanceReferenceRevision','behaviorRuleMode','behaviorRuleText','forceVisualScenery','rabbitMirrorBannedWords']
   .map(key=>settings[key]),...(advanced?[advanced]:[])]);
}

export function earlyBodyEnabled(ctx=getContext(),settings=getSettings()){
 return settings.enabled!==false && settings.autoRabbitMirrorInjection!==false
  && settings.generationSource==='independent' && settings.mode!=='off'
  && settings.independentEarlyBodyEnabled===true
  && !!String(settings.independentEarlyBodyChatKey||'')
  && String(settings.independentEarlyBodyChatKey)===chatKey(ctx)
  && Array.isArray(settings.independentEarlyBodyTags) && settings.independentEarlyBodyTags.length>0;
}

function earlyBodyOwnerFor(ctx,index){
 const owner=automaticGenerationCutovers.get(chatKey(ctx))?.earlyBodies?.get(Number(index));
 return owner && owner.chat===ctx.chat && owner.message===ctx.chat?.[Number(index)]
  && owner.swipe===swipeId(owner.message)?owner:null;
}

function containFavoriteHostLayout(host){
 if(!host?.style) return;
 host.style.setProperty('position','relative','important');
 host.style.setProperty('inset','auto','important');
 host.style.setProperty('left','auto','important');
 host.style.setProperty('top','auto','important');
 host.style.setProperty('right','auto','important');
 host.style.setProperty('bottom','auto','important');
 host.style.setProperty('width','100%','important');
 host.style.setProperty('max-width','100%','important');
 host.style.setProperty('height','auto','important');
 host.style.setProperty('transform','none','important');
 host.style.setProperty('z-index','auto','important');
 for(const el of host.querySelectorAll?.('[style]')||[]){
  const position=String(el.style?.position||'').toLowerCase();
  if(position==='fixed' || position==='sticky') el.style.position='absolute';
 }
}

export function hydrateIndependentFavoriteHtml(container,record){
 if(!container) return null;
 const html=String(record?.html||'').trim();
 if(!html) return null;
 const host=document.createElement('div');
 host.setAttribute('data-rm-theater-favorite-host','true');
 host.className='rabbit-mirror-theater-favorite-host';
 host.dataset.rmKey=String(record?.id||'favorite');
 host.dataset.rmSource='favorite';
 host.dataset.rmState='ready';
 host.dataset.rmFavorite='true';
 host.dataset.rmPlacement='contained';
 if(hasMultifaceMarkup(html)){
  if(!mountExternalFaceDetails(host,'favorite','favorite',html,{locallyPrepared:false})){
   container.replaceChildren();
   container.append('这面收藏无法按当前净化规则挂载。');
   return null;
  }
 }else{
  const details=extractReadyDetails(html,false);
  if(!details){
   container.replaceChildren();
   container.append('这面收藏缺少可展示的兔子镜结构。');
   return null;
  }
  markExternalDetails(details,'favorite','favorite');
  host.append(details);
 }
 host.__rabbitMirrorIndependentSource=html;
 delete host.dataset.rmOwnerChat;
 delete host.dataset.rmOwnerMesid;
 delete host.dataset.rmExternalOwnerMessage;
 delete host.dataset.rmOwnerSwipe;
 delete host.dataset.rmSourceHash;
 stampExternalDetailsOwnership(host);
 markMountedFaceProofs(host,'favorite',null);
 containFavoriteHostLayout(host);
 container.replaceChildren(host);
 ensureExternalTools(host);
 containFavoriteHostLayout(host);
 return host;
}

