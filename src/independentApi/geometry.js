// Split from independentApi.js — geometry.

import { presentationModeFields } from '../presentationMode.js?rmv=1.5.53-visualquick1';
import { scheduleRabbitMirrorComposerClearance } from '../composerClearance.js?rmv=1.5.58-fork1';
import { isRabbitMirrorManagedChatSurface, getRabbitMirrorExternalPlacementParent } from '../hostCompatibility.js?rmv=1.5.71';
import { getSettings } from '../settings.js?rmv=1.5.71';
import {
    cleanRabbitMirrorOutput,
    compactTotoBlock,
    refreshRabbitMirrorToolsInScope,
    repairMalformedRabbitMirrorMarkup,
    repairRabbitMirrorScopedClassAliasesInScope,
    isolateRabbitMirrorInteractionIds,
    rearmRabbitMirrorSerializedInteractionRoot,
    armRabbitMirrorFirstUseInteraction,
    repairRabbitMirrorPersistedExclusiveGridSpan,
    clearRabbitMirrorHorizontalClipArtifacts,
    sanitizeRabbitMirrorUntrustedTemplate,
    validateRabbitMirrorRecoveredStyleAssignments,
} from '../outputSanitizer.js?rmv=1.5.71';
import { rememberRabbitMirrorFilteredDom, cloneRabbitMirrorFilteredNode } from '../bannedWords.js?rmv=1.5.53-cn-boundary1';
import { createRabbitMirrorTextReplacementReceipt, matchesRabbitMirrorTextReplacementReceipt } from '../replacementReceipt.js?rmv=1.5.53-cn-boundary1';
import { parseMultifaceOutput } from '../multifaceProtocol.js?rmv=1.5.53-cn-boundary1';
import { markSanitizedRabbitMirrorFace } from '../multifaceProof.js?rmv=1.5.53-visualquick1';
import {
    EXTERNAL_SHELL_ATTR,
    FOLLOW_EXTERNAL_ANCHOR_ATTR,
    FOLLOW_ORIGIN_ATTR,
    HISTORICAL_LIGHT_HOST_ATTR,
    INLINE_ANCHOR_ATTR,
    RESAY_ATTR,
    RUNTIME_VERSION,
    SOURCE_ATTR,
    byteLength,
    currentRuntime,
    getContext,
    hashText,
    independentMaintenanceLiveRepairLocked,
} from './runtime.js?rmv=1.5.71';
import { automaticDispatchAlreadyConsumed, automaticFailureStops, generationPolls, operationEpochForBase } from './flights.js?rmv=1.5.71';
import {
    INDEPENDENT_HTML_BUDGET_BYTES,
    INTERACTION_STATE_MIGRATION_KEY,
    historyEntriesForSlot,
    independentRecordWithinBudget,
    persistedOwnerForMessage,
    readStore,
    writeStore,
} from './persistence.js?rmv=1.5.71';
import {
    chatKey,
    copyIndependentOwnerLineage,
    findSavedRecord,
    independentLineageOriginSlot,
    isRabbitMirrorEligibleAssistantMessage,
    messageBaseSlotKey,
    messageBody,
    messageElement,
    messageSourceFingerprint,
    ownerLockForBase,
    recordKey,
    saveRecordForSlot,
    savedRecordMatchesObserved,
    slotSearchKeys,
    swipeId,
} from './connection.js?rmv=1.5.71';
import {
    EXTERNAL_GEOMETRY_SETTLE_STEPS_MS,
    allExternalHosts,
    assertIndependentMarkupComplexity,
    beginExternalHostGeometryCycle,
    chooseMobileExternalAppliedGeometry,
    clampGeometryToStructural,
    clearExternalHostGeometryTokens,
    clearGeometryDataset,
    computeExternalHostGeometryPlan,
    confirmExternalHostGeometry,
    elementContentBoxRect,
    ensureExternalHostGeometryCycle,
    externalHosts,
    externalHostsByIdentityKey,
    externalOwnerMesid,
    followExternalAnchorForMessage,
    geometryCssValue,
    geometryNearlyEqual,
    hasMultifaceMarkup,
    independentExternalEffectiveViewportWidth,
    indexedExternalHostsByMesid,
    inlineAnchorForMessage,
    readGeometryDataset,
    registerExternalHostInSyncIndex,
    roundedGeometryNumber,
    stampExternalDetailsOwnership,
    stampExternalHostOwnership,
    updateExternalGeometryDiagnostics,
    wireIndependentRejectedFaceControls,
    wrapIndependentFace,
    wrapPreparedIndependentFace,
    writeGeometryDataset,
} from './request.js?rmv=1.5.71';
import {
    activeIndependentFlightForBase,
    automaticCutoverVersionToken,
    automaticIndependentTiming,
    boundIndependentIntentOwner,
    clearIndependentExternalCompactShellWidth,
    deferredIndependentGenerationIntents,
    ensureExternalUi,
    externalFaceDetails,
    generateFor,
    generationPollKey,
    historicalLightHost,
    independentPlacementForState,
    independentPrimaryVisualShell,
    messageIndexForExternalHost,
    orphanExternalHostTimers,
    resayIndependentMirror,
    resolveIndependentActionIdentity,
    runtimeMode,
    serializeExternalFaceDetails,
    stripIndependentTransientLayoutArtifacts,
} from './mount.js?rmv=1.5.71';
import {
    automaticHostGenerationRenderMatches,
    hasExistingFollowRabbitMirror,
    queueMessageSync,
    suppressesAutomaticGeneration,
} from './earlyBody.js?rmv=1.5.71';
import {
    automaticGenerationCutovers,
    persistedInteractionMigrationHandle,
    persistedInteractionMigrationIdle,
    writePersistedInteractionMigrationHandle,
    writePersistedInteractionMigrationIdle,
} from './lifecycle.js?rmv=1.5.71';

let externalGeometryFrame = 0;

let externalGeometryTimer = 0;

let externalGeometryLastSignature = '';

let externalGeometryListenersInstalled = false;

export let externalGeometryCycleSequence = 0;

export function writeExternalGeometryCycleSequence(value){ externalGeometryCycleSequence = value; return value; }

export let externalGeometryLifecycleEpoch = 1;

export function writeExternalGeometryLifecycleEpoch(value){ externalGeometryLifecycleEpoch = value; return value; }

export let externalGeometryLifecycleReason = 'runtime-init';

export function writeExternalGeometryLifecycleReason(value){ externalGeometryLifecycleReason = value; return value; }

export const externalGeometryOwnerNodes = new WeakMap();

const INDEPENDENT_SANITIZER_ATTR='data-rabbit-mirror-independent-sanitizer-version';

export const preparedReadyHtmlCache=new Map();

const RUNTIME_STATE_STYLE_ATTRS = [
 'data-rabbit-mirror-checked-pseudo-rule-rescue',
];

const MAINTENANCE_STRUCTURAL_STYLE_ATTRS = [
 'data-rabbit-mirror-focus-within-persistent-style',
 'data-rabbit-mirror-static-choice-selection-style',
 'data-rabbit-mirror-structured-static-disclosure-style',
 'data-rabbit-mirror-fill-in-choice-style',
];

const PERSISTED_STATE_STYLE_ATTRS = [...RUNTIME_STATE_STYLE_ATTRS, ...MAINTENANCE_STRUCTURAL_STYLE_ATTRS];

const PERSISTED_STATE_ARIA_ATTRS = ['aria-pressed','aria-selected','aria-expanded','aria-current','aria-checked'];

const PERSISTED_RUNTIME_UI_SELECTOR = '[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay], [data-rabbit-mirror-interaction-home], [data-rabbit-mirror-interaction-diagnostic], [data-rabbit-mirror-reference-note], [data-rm-ephemeral-failure-body], [data-rm-face-swipe-bar], [data-rm-face-favorite-star]';

const PERSISTED_STATE_ATTR_RE = /^(?:data-rm-(?:.*(?:active|selected|open|used|filled|touch-hover|pseudo-active|target-active)|checked-pseudo-rule-target|labeled-checked-verify-target|reversible-style-baseline|reversible-text-baseline|click-to-restore)|data-rabbit-mirror-(?:labeled-checked(?:-last|-verify|-verify-count)?|checked-text-rule-rescue|expanded-opacity-rescue|inert-action-active|radio-reset-last|stale-checked-inline-cleanup|deferred-interaction-rescue))$/i;

const externalPresentationMetadata = new WeakMap();

export const DEFERRED_INTERACTION_RESCUE_ATTR='data-rabbit-mirror-deferred-interaction-rescue';

const externalInteractionActivatedDetails=new WeakSet();

const externalInteractionActivationHandlers=new WeakMap();

const externalInteractionActivationScheduledDetails=new WeakSet();

export const quickStartOwners=new WeakSet();

const quickStartButtonOwners=new WeakMap();

export const quickAuthorizationOwners=new WeakMap();

export const quickIntentOwners=new WeakMap();

export let activeRestorableHtmlCache=null;

export function writeActiveRestorableHtmlCache(value){ activeRestorableHtmlCache = value; return value; }

const verifiedReadyDetailsVisualHealth=new WeakSet();

export const INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR='data-rabbit-mirror-independent-content-width-rescue';

export const INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR='data-rabbit-mirror-independent-content-width-baseline';

export const INDEPENDENT_EXTERNAL_STAGE_NEUTRALIZED_ATTR='data-rabbit-mirror-independent-external-stage-neutralized';

const INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RESCUE='auto-root-fill';

const INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RATIO=.84;

const INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_BREAKPOINT=900;

export const MAINTENANCE_PERSISTED_LAYOUT_ATTR='data-rabbit-mirror-maintenance-persisted-layout';


const manualFaceAutoWidthRepairs=new WeakMap();

const MANUAL_FACE_AUTO_WIDTH_PROPERTIES=['width','inline-size','max-width','max-inline-size','box-sizing'];

function applyMobileExternalHostGeometryPlan(host,plan,context={}){
 // Any mobile external geometry application must clear stale PC-only compact-shell
 // state first. Some Android/WebView shells can keep a desktop-like layout viewport
 // while the effective phone viewport becomes mobile, so CSS media queries alone
 // cannot be relied on to remove an earlier compact width.
 clearIndependentExternalCompactShellWidth(host);
 updateExternalGeometryDiagnostics(host,plan);
 const phase=String(context.phase||'early');
 const cycleId=String(context.cycleId||host.dataset.rmGeometryCycleId||'');
 if(cycleId && String(host.dataset.rmGeometryCycleId||'')!==cycleId) return {changed:false,stale:true};
 const candidate=clampGeometryToStructural(plan.candidate||plan.structural,plan.structural);
 if(phase==='settle-420'){
  writeGeometryDataset(host,'rmGeometryLate',candidate);
  host.dataset.rmGeometryLateSource=String(plan.candidateSource||'structural');
  host.dataset.rmGeometrySettleState='late-420-recorded';
 }else if(phase==='settle-1500'){
  const previous=readGeometryDataset(host,'rmGeometryLate');
  if(previous && geometryNearlyEqual(previous,candidate)){
   confirmExternalHostGeometry(host,candidate,'stable-420-1500',plan.candidateSource);
   host.dataset.rmGeometrySettleState='confirmed';
  }else{
   writeGeometryDataset(host,'rmGeometryLate',candidate);
   host.dataset.rmGeometryLateSource=String(plan.candidateSource||'structural');
   host.dataset.rmGeometrySettleState='await-final-confirm';
  }
 }else if(phase==='settle-final'){
  const previous=readGeometryDataset(host,'rmGeometryLate');
  if(previous && geometryNearlyEqual(previous,candidate)){
   confirmExternalHostGeometry(host,candidate,'stable-1500-final-frame',plan.candidateSource);
   host.dataset.rmGeometrySettleState='confirmed';
  }else{
   host.dataset.rmGeometrySettleState='unconfirmed';
  }
 }
 const selected=chooseMobileExternalAppliedGeometry(host,plan);
 const applied=selected.geometry;
 if(!applied) return {changed:false};
 const width=geometryCssValue(applied.width);
 const left=geometryCssValue(applied.left);
 writeGeometryDataset(host,'rmGeometryApplied',applied);
 const beforeWidth=host.style.getPropertyValue('--rm-external-lane-width');
 const beforeLeft=host.style.getPropertyValue('--rm-external-lane-left');
 if(beforeWidth!==width) host.style.setProperty('--rm-external-lane-width',width);
 if(beforeLeft!==left) host.style.setProperty('--rm-external-lane-left',left);
 let mode=plan.canonicalStructuralLane ? 'mobile-structural-content-lane' : 'mobile-structural-provisional';
 if(!plan.canonicalStructuralLane && selected.kind==='last-known-good') mode='mobile-last-known-good';
 else if(!plan.canonicalStructuralLane && selected.kind==='confirmed') mode=host.dataset.rmGeometryConfirmedSource==='message-text' ? 'mobile-confirmed-message-text-lane' : 'mobile-confirmed-structural-lane';
 host.dataset.rmExternalWidthMode=mode;
 host.dataset.rmGeometryMode=mode;
 return {changed:beforeWidth!==width || beforeLeft!==left,mode};
}

function applyExternalHostGeometryPlan(host,plan,context={}){
 if(!host || !plan || plan.skip) return {changed:false};
 if(plan.clear){
  const hadWidth=!!host.style.getPropertyValue('--rm-external-lane-width');
  const hadLeft=!!host.style.getPropertyValue('--rm-external-lane-left');
  clearExternalHostGeometryTokens(host);
  if(host.dataset.rmExternalWidthMode!==plan.mode) host.dataset.rmExternalWidthMode=plan.mode;
  host.dataset.rmGeometryMode=String(plan.mode||'stable-fallback');
  return {changed:hadWidth||hadLeft,mode:plan.mode};
 }
 if(plan.mobileIndependent) return applyMobileExternalHostGeometryPlan(host,plan,context);
 const beforeWidth=host.style.getPropertyValue('--rm-external-lane-width');
 const beforeLeft=host.style.getPropertyValue('--rm-external-lane-left');
 if(beforeWidth!==plan.width) host.style.setProperty('--rm-external-lane-width',plan.width);
 if(beforeLeft!==plan.left) host.style.setProperty('--rm-external-lane-left',plan.left);
 if(host.dataset.rmExternalWidthMode!==plan.mode) host.dataset.rmExternalWidthMode=plan.mode;
 host.dataset.rmGeometryMode=String(plan.mode||'inline-parent-content-box');
 return {changed:beforeWidth!==plan.width || beforeLeft!==plan.left,mode:plan.mode};
}

function finishExternalHostGeometrySettle(host,cycleId){
 if(!host?.isConnected || String(host.dataset.rmGeometryCycleId||'')!==String(cycleId||'')) return;
 host.dataset.rmGeometrySettlePass='done';
 host.dataset.rmGeometrySettleCycle=String(cycleId||'');
 host.dataset.rmGeometrySettleState=host.dataset.rmGeometrySettleState==='confirmed' ? 'done-confirmed' : 'done-provisional';
 if(String(host.dataset.rmGeometryScheduleCycle||'')===String(cycleId||'')) delete host.dataset.rmGeometryScheduleCycle;
}

function scheduleExternalHostGeometryFinalConfirm(host,cycleId){
 const run=()=>{
  if(!host?.isConnected || String(host.dataset.rmGeometryCycleId||'')!==String(cycleId||'')) return;
  const before=host.style.getPropertyValue('--rm-external-lane-width');
  try{ syncExternalHostGeometry(messageElementForExternalHost(host),host,{phase:'settle-final',cycleId}); }
  catch(error){ console.debug('[RabbitMirror] external geometry final confirmation skipped:',error); }
  const after=host.style.getPropertyValue('--rm-external-lane-width');
  if(before!==after) host.dataset.rmGeometrySettleCorrected='true';
  finishExternalHostGeometrySettle(host,cycleId);
 };
 if(typeof requestAnimationFrame==='function') requestAnimationFrame(()=>requestAnimationFrame(run));
 else globalThis.setTimeout?.(run,0);
}

function scheduleExternalHostGeometrySettleRecheck(host,step=0,expectedCycle=''){
 if(!host?.isConnected || host.dataset.rmSource!=='independent') return;
 if(String(host.dataset.rmPlacement||'external')!=='external') return;
 const viewportWidth=independentExternalEffectiveViewportWidth();
 if(!(viewportWidth>0 && viewportWidth<900)) return;
 const el=messageElementForExternalHost(host);
 const cycleId=String(expectedCycle||ensureExternalHostGeometryCycle(el,host)||'');
 if(!cycleId || String(host.dataset.rmGeometryCycleId||'')!==cycleId) return;
 const delay=EXTERNAL_GEOMETRY_SETTLE_STEPS_MS[step];
 if(!Number.isFinite(delay)) return;
 if(step===0){
  if(host.dataset.rmGeometrySettleCycle===cycleId && (host.dataset.rmGeometrySettlePass==='running' || host.dataset.rmGeometrySettlePass==='done')) return;
  host.dataset.rmGeometrySettleCycle=cycleId;
  host.dataset.rmGeometrySettlePass='running';
  host.dataset.rmGeometrySettleState='scheduled';
 }
 globalThis.setTimeout?.(()=>{
  if(!host?.isConnected || String(host.dataset.rmGeometryCycleId||'')!==cycleId) return;
  const before=host.style.getPropertyValue('--rm-external-lane-width');
  const phase=step===0 ? 'settle-420' : 'settle-1500';
  try{ syncExternalHostGeometry(messageElementForExternalHost(host),host,{phase,cycleId}); }
  catch(error){ console.debug('[RabbitMirror] external geometry settle recheck skipped:',error); }
  const after=host.style.getPropertyValue('--rm-external-lane-width');
  if(before!==after) host.dataset.rmGeometrySettleCorrected='true';
  if(Number.isFinite(EXTERNAL_GEOMETRY_SETTLE_STEPS_MS[step+1])){
   scheduleExternalHostGeometrySettleRecheck(host,step+1,cycleId);
   return;
  }
  if(host.dataset.rmGeometrySettleState==='await-final-confirm'){
   scheduleExternalHostGeometryFinalConfirm(host,cycleId);
   return;
  }
  finishExternalHostGeometrySettle(host,cycleId);
 },delay);
}

function syncExternalHostGeometry(el,host,context={}){
 if(!host?.isConnected) return {changed:false};
 return applyExternalHostGeometryPlan(host,computeExternalHostGeometryPlan(el,host),context);
}
// Explicit Maintenance Rabbit action only. Refresh this owned external lane in
// place; never borrow another host, restore saved markup or schedule a sweep.

export function remeasureRabbitMirrorFaceGeometry(root){
 const result=(status,beforeWidth=0,afterWidth=beforeWidth)=>({status,beforeWidth,afterWidth});
 if(!root?.isConnected || !root.matches?.('details')) return result('stale');
 if(!root.open) return result('unavailable');
 const host=root.closest?.(`[${SOURCE_ATTR}]`);
 if(!host) return result(root.dataset?.rabbitMirrorExternalDetails==='true'?'unavailable':'inline');
 if(!host.isConnected || !externalFaceDetails(host).includes(root)) return result('stale');
 if(host.dataset?.rmSource!=='independent' || host.dataset.rmState!=='ready'
  || host.hidden || host.dataset.rmAwaitingOwner==='true' || host.dataset.rmAwaitingFreshSource==='true'
  || host.dataset.rmPending==='true') return result('unavailable');
 const owner=String(host.dataset.rmOwnerMesid??host.dataset.rmExternalOwnerMessage??'');
 if(!/^\d+$/.test(owner)) return result('unavailable');
 const index=Number(owner); const ctx=getContext(); const msg=ctx.chat?.[index];
 if(!isRabbitMirrorEligibleAssistantMessage(msg)) return result('stale');
 const expectedChat=chatKey(ctx); const expectedSwipe=String(swipeId(msg));
 const expectedSourceHash=messageSourceFingerprint(msg);
 const expectedKey=recordKey(ctx,index,msg);
 // Check the same source identity as generation, without observe/store access or
 // an all-host fallback. A projected TT root needs a currently mounted owner.
 const pairs=[
  ['rmOwnerChat','rabbitMirrorOwnerChat',expectedChat],
  ['rmOwnerMesid','rabbitMirrorOwnerMesid',String(index)],
  ['rmOwnerSwipe','rabbitMirrorOwnerSwipe',expectedSwipe],
  ['rmKey','rabbitMirrorOwnerKey',expectedKey],
  ['rmSourceHash','rabbitMirrorOwnerSourceHash',expectedSourceHash],
 ];
 if(pairs.some(([hostKey,rootKey,expected])=>!expected
  || String(host.dataset[hostKey]??'')!==expected || String(root.dataset?.[rootKey]??'')!==expected)) return result('stale');
 const el=messageElement(index);
 if(!el?.isConnected || messageElementForExternalHost(host)!==el) return result('unavailable');
 const placement=String(host.dataset.rmPlacement||'external');
 if(placement==='inline') return result(el.contains?.(host)?'inline':'stale');
 if(placement!=='external') return result('unavailable');
 const managedParent=getRabbitMirrorExternalPlacementParent(el);
 if(isRabbitMirrorManagedChatSurface() && !managedParent) return result('unavailable');
 const placementParent=managedParent||el.parentElement;
 if(host.parentElement!==placementParent || el.contains?.(host)) return result('stale');
 if(!managedParent && externalHostAppearsBeforeOwner(el,host)) return result('stale');
 const measure=()=>{try{return roundedGeometryNumber(root.getBoundingClientRect().width);}catch{return 0;}};
 const beforeWidth=measure();
 if(beforeWidth<=0) return result('unavailable');
 const plan=computeExternalHostGeometryPlan(el,host);
 if(!plan || plan.skip || plan.clear) return result('unavailable',beforeWidth);
 clearIndependentExternalCompactShellWidth(host);
 clearGeometryDataset(host,'rmGeometryConfirmed');
 for(const key of ['rmGeometryConfirmedCycle','rmGeometryConfirmedReason','rmGeometryConfirmedSource']) delete host.dataset[key];
 const cycleId=beginExternalHostGeometryCycle(host,'manual-narrow-remeasure',el);
 applyExternalHostGeometryPlan(host,plan,{phase:'manual-narrow-remeasure',cycleId});
 if(plan.mobileIndependent && plan.structural){
  confirmExternalHostGeometry(host,plan.structural,'manual-structural-measurement','structural');
  host.dataset.rmGeometrySettleState='confirmed';
 }
 finishExternalHostGeometrySettle(host,cycleId);
 const afterWidth=measure();
 return result(afterWidth>beforeWidth+1?'remeasured':'unavailable',beforeWidth,afterWidth);
}

function externalHostGeometrySettledForOwner(el,host){
 if(!host?.dataset || !el) return false;
 const cycleId=String(host.dataset.rmGeometryCycleId||'');
 if(!cycleId || String(host.dataset.rmGeometryLifecycleEpoch||'')!==String(externalGeometryLifecycleEpoch)) return false;
 if(!externalGeometryOwnerNodes.has(host) || externalGeometryOwnerNodes.get(host)!==el) return false;
 return host.dataset.rmGeometrySettlePass==='done' && String(host.dataset.rmGeometrySettleCycle||'')===cycleId;
}

function scheduleExternalHostGeometry(el,host){
 if(!host?.isConnected) return false;
 if(externalHostGeometrySettledForOwner(el,host)) return false;
 const cycleId=ensureExternalHostGeometryCycle(el,host);
 if(!cycleId) return false;
 // syncMessages() and the finite duplicate-reconciliation pass can touch the same
 // ready host back-to-back. One geometry cycle owns at most one scheduler.
 if(String(host.dataset.rmGeometryScheduleCycle||'')===cycleId) return false;
 host.dataset.rmGeometryScheduleCycle=cycleId;
 const applyOnce=()=>{
  if(host?.isConnected && String(host.dataset.rmGeometryCycleId||'')===String(cycleId||'')){
   syncExternalHostGeometry(el||messageElementForExternalHost(host),host,{phase:'settled-once',cycleId});
   finishExternalHostGeometrySettle(host,cycleId);
  }
 };
 // One post-paint geometry pass for both desktop and mobile. The old mobile
 // 0/120/420/1500ms chain repeatedly forced layout around a newly generated mirror.
 if(typeof requestAnimationFrame==='function') requestAnimationFrame(applyOnce);
 else globalThis.setTimeout?.(applyOnce,0);
 return true;
}

export function clearOrphanExternalHostTimer(mesid=''){
 const id=String(mesid||'');
 const timer=orphanExternalHostTimers.get(id);
 if(timer) clearTimeout(timer);
 orphanExternalHostTimers.delete(id);
}

function externalHostAppearsBeforeOwner(el,host){
 if(!el||!host||host.parentElement!==el.parentElement) return true;
 try{
   return !!(host.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
 }catch{
   return host.nextElementSibling===el;
 }
}

export function placeExternalHost(el,host,key='',source='independent'){
 if(!el||!host) return false;
 scheduleRabbitMirrorComposerClearance();
 const previousPlacement=String(host.dataset?.rmPlacement||'');
 stampExternalHostOwnership(el,host,key,source);
 const previousParent=host.parentElement;
 const desired=source==='independent' ? independentPlacementForState(host.dataset.rmState||'ready') : 'external';
 if(source!=='independent' || desired!=='external') restoreExternalHostRendering(host);
 if(source==='independent' && desired!=='external') restoreIndependentExternalAutoRootWidth(host);
 if(source==='follow'){
  const anchor=followExternalAnchorForMessage(el,true);
  if(!anchor) return false;
  const moved=host.parentElement!==anchor;
  if(moved) anchor.append(host);
  host.dataset.rmPlacement='external';
  host.dataset.rmExternalPlacementEstablished='true';
  host.hidden=false;
  delete host.dataset.rmAwaitingOwner;
  clearOrphanExternalHostTimer(externalOwnerMesid(el));
  registerExternalHostInSyncIndex(host);
  syncExternalHostGeometry(el,host);
  if(moved || previousPlacement!=='external') host.__rabbitMirrorIndependentPlacementDirty=true;
  if(previousParent?.hasAttribute?.(FOLLOW_EXTERNAL_ANCHOR_ATTR) && previousParent!==anchor && !previousParent.querySelector?.(`[${SOURCE_ATTR}][data-rm-source="follow"]`)) previousParent.remove();
  if(previousParent?.hasAttribute?.(INLINE_ANCHOR_ATTR) && !previousParent.querySelector?.(`[${SOURCE_ATTR}]`)) previousParent.remove();
  return true;
 }
 if(desired==='inline'){
  const anchor=inlineAnchorForMessage(el,true);
  if(!anchor) return false;
  const moved=host.parentElement!==anchor;
  if(moved) anchor.append(host);
  host.dataset.rmPlacement='inline';
  if(moved || previousPlacement!=='inline') clearExternalShellIntegration(host);
  host.dataset.rmExternalPlacementEstablished='true';
  host.hidden=false;
  delete host.dataset.rmAwaitingOwner;
  clearOrphanExternalHostTimer(externalOwnerMesid(el));
  registerExternalHostInSyncIndex(host);
  syncExternalHostGeometry(el,host);
  if(moved || previousPlacement!=='inline') host.__rabbitMirrorIndependentPlacementDirty=true;
  if(previousParent?.hasAttribute?.(INLINE_ANCHOR_ATTR) && previousParent!==anchor && !previousParent.querySelector?.(`[${SOURCE_ATTR}]`)) previousParent.remove();
  return true;
 }
 const managedParent=getRabbitMirrorExternalPlacementParent(el);
 const parent=managedParent || el.parentElement;
 if(!parent) return false;
 const needsReanchor = managedParent ? host.parentElement!==managedParent : host.parentElement!==parent
   || el.contains(host)
   || externalHostAppearsBeforeOwner(el,host)
   || host.dataset.rmExternalPlacementEstablished!=='true';
 const placementChanged=previousPlacement!=='external';
 host.dataset.rmPlacement='external';
 if(source==='independent' && (needsReanchor || placementChanged)) clearExternalShellIntegration(host);
 if(needsReanchor){
  if(managedParent){
   const body=messageBody(el);
   if(body && managedParent===body.parentElement) body.insertAdjacentElement('afterend',host);
   else managedParent.append(host);
  }
  else parent.insertBefore(host,el.nextSibling);
 }
 host.dataset.rmExternalPlacementEstablished='true';
 host.hidden=false;
 delete host.dataset.rmAwaitingOwner;
 clearOrphanExternalHostTimer(externalOwnerMesid(el));
 registerExternalHostInSyncIndex(host);
 if(needsReanchor || placementChanged) host.__rabbitMirrorIndependentPlacementDirty=true;
 // Historical collapsed mirrors need only a stable title shell during full-chat
 // restoration. Default CSS already gives that shell a safe width; defer all
 // geometry reads/timers until this one mirror is actually opened.
 if(!historicalLightHost(host)){
  ensureExternalHostGeometryCycle(el,host,needsReanchor?'external-reanchor':'');
  scheduleExternalHostGeometry(el,host);
 }
 if(previousParent?.hasAttribute?.(INLINE_ANCHOR_ATTR) && !previousParent.querySelector?.(`[${SOURCE_ATTR}]`)) previousParent.remove();
 return true;
}


export function messageElementForExternalHost(host){
 const owner=Number(host?.dataset?.rmOwnerMesid ?? host?.dataset?.rmExternalOwnerMessage);
 if(Number.isInteger(owner)&&owner>=0){
   const direct=messageElement(owner);
   if(direct) return direct;
 }
 return host?.closest?.('.mes[mesid], [mesid].mes, [mesid]') || null;
}

export function externalHostsOwnedByMesid(mesid=''){
 const id=String(mesid||'');
 const currentChat=chatKey(getContext());
 return indexedExternalHostsByMesid(id).filter(host=>{
   const ownerChat=String(host.dataset.rmOwnerChat||'');
   return !ownerChat || ownerChat===currentChat;
 });
}

export function markExternalHostsAwaitingOwner(mesid=''){
 const id=String(mesid||'');
 if(!id || messageElement(Number(id))) return;
 const hosts=externalHostsOwnedByMesid(id);
 if(!hosts.length) return;
 for(const host of hosts){
   host.hidden=true;
   host.dataset.rmAwaitingOwner='true';
 }
 clearOrphanExternalHostTimer(id);
 const timer=setTimeout(()=>{
   orphanExternalHostTimers.delete(id);
   if(messageElement(Number(id))){
    queueMessageSync([Number(id)]);
    return;
   }
   for(const host of externalHostsOwnedByMesid(id)){
    // Error cards are the only retry surface after a crash. TT may briefly
    // detach the owner .mes; do not throw the card away during that gap.
    if(host.dataset?.rmState==='error' || host.dataset?.rmMissingShellRetry==='true'){
     host.hidden=true;
     host.dataset.rmAwaitingOwner='true';
     continue;
    }
    host.remove();
   }
 },1800);
 orphanExternalHostTimers.set(id,timer);
}

function markExternalHostsAwaitingFreshSource(index,status='waiting'){
 const id=Number(index);
 if(!Number.isInteger(id) || id<0) return false;
 let changed=false;
 for(const host of externalHostsOwnedByMesid(String(id)).filter(node=>node.dataset.rmSource==='independent')){
   if(!readyDetailsFromHost(host)) continue;
   // A manual Maintenance Rabbit repair can trigger SillyTavern metadata/message
   // lifecycle events while the repaired mirror is being persisted. Those events
   // are not a new正文 generation and must never hide the live repaired mirror behind
   // the "正文正在更新" stale-source placeholder.
   if(independentMaintenanceLiveRepairLocked(host)) continue;
   host.hidden=false;
   host.dataset.rmAwaitingFreshSource='true';
   host.dataset.rmFreshSourceStatus=status==='error'?'error':'waiting';
   delete host.dataset.rmPending;
   changed=true;
 }
 return changed;
}

export function clearIndependentResayStatus(host){
 if(!host) return;
 delete host.dataset.rmPending;
 host.removeAttribute?.('aria-busy');
 host.querySelector?.(':scope > [data-rabbit-mirror-resay-status="true"]')?.remove?.();
}

export function showIndependentResayStatus(host,message=''){
 if(!host) return null;
 host.dataset.rmPending='true';
 host.setAttribute?.('aria-busy','true');
 let status=host.querySelector?.(':scope > [data-rabbit-mirror-resay-status="true"]');
 if(!status){
  status=document.createElement('div');
  status.className='rabbit-mirror-resay-status';
  status.setAttribute('data-rabbit-mirror-resay-status','true');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  host.prepend(status);
 }
 status.textContent=String(message||'🐇 正在重新生成兔子镜……旧版本会保留到新版本完成');
 return status;
}

export function clearExternalHostFreshSourceState(host){
 if(!host) return;
 delete host.dataset.rmAwaitingFreshSource;
 delete host.dataset.rmFreshSourceStatus;
 clearIndependentResayStatus(host);
}

export function restoreExternalHostRendering(host){
 // 1.3.20 no longer uses the 1.3.17 off-screen suspension experiment, but a
 // hot update can leave those temporary attributes/styles on already-mounted
 // hosts. Clear them defensively without installing any observer.
 if(!host) return false;
 let changed=false;
 for(const style of host.querySelectorAll?.('style[data-rm-perf-suspended-style]')||[]){
  const previous=String(style.getAttribute('data-rm-perf-original-media')||'__rm_none__');
  if(previous==='__rm_none__') style.removeAttribute('media');
  else style.setAttribute('media',previous);
  style.removeAttribute('data-rm-perf-suspended-style');
  style.removeAttribute('data-rm-perf-original-media');
  changed=true;
 }
 if(host.hasAttribute?.('data-rm-perf-suspended')){
  host.removeAttribute('data-rm-perf-suspended');
  host.style.removeProperty('content-visibility');
  host.style.removeProperty('height');
  host.style.removeProperty('overflow');
  changed=true;
 }
 return changed;
}

function refreshExternalHostGeometry(){
 const hosts=allExternalHosts().filter(node=>node.dataset.rmSource==='independent' && String(node.dataset.rmPlacement||'external')==='external' && !historicalLightHost(node));
 if(!hosts.length) return;
 // Layout reads are allowed only after a *real browser-width change*. Never call
 // this path merely because a SillyTavern drawer/modal changed the app layout.
 // On mobile, a real viewport-width change opens a new per-host geometry cycle;
 // the viewport signature remains only the cheap global trigger, not lane validity.
 const viewportWidth=externalViewportWidthSignature();
 const effectiveViewportWidth=independentExternalEffectiveViewportWidth();
 const mobile=effectiveViewportWidth>0 && effectiveViewportWidth<900;
 const plans=hosts.map(host=>{
  const el=messageElementForExternalHost(host);
  const cycleId=mobile ? beginExternalHostGeometryCycle(host,'viewport-change',el) : '';
  return [host,computeExternalHostGeometryPlan(el,host),cycleId];
 });
 for(const [host,plan,cycleId] of plans) applyExternalHostGeometryPlan(host,plan,{phase:'early',cycleId});
 if(mobile){
 for(const [host,,cycleId] of plans){
   for(const details of externalFaceDetails(host)) if(details?.open) rescueIndependentExternalAutoRootWidth(host,details);
   scheduleExternalHostGeometrySettleRecheck(host,0,cycleId);
  }
 }else{
  for(const [host] of plans) restoreIndependentExternalAutoRootWidth(host);
 }
}

function externalViewportWidthSignature(){
 // Keep the refresh identity aligned with independentExternalEffectiveViewportWidth().
 // Read only root viewport signals here; never inspect #chat/message geometry. This
 // function runs after the shared resize debounce, not on every resize event.
 const normalize=value=>{
  const number=Number(value);
  return Number.isFinite(number) && number>0 ? Math.round(number*10)/10 : 0;
 };
 const widths=[
  normalize(globalThis.visualViewport?.width),
  normalize(globalThis.innerWidth),
  normalize(globalThis.document?.documentElement?.clientWidth),
  normalize(globalThis.screen?.width),
 ];
 return widths.some(Boolean) ? widths.join('|') : '';
}

function runQueuedExternalHostGeometryRefresh(){
 externalGeometryTimer=0;
 const width=externalViewportWidthSignature();
 if(width && width===externalGeometryLastSignature) return;
 const run=()=>{
  externalGeometryFrame=0;
  refreshExternalHostGeometry();
  if(width) externalGeometryLastSignature=width;
 };
 if(typeof requestAnimationFrame==='function') externalGeometryFrame=requestAnimationFrame(run);
 else externalGeometryFrame=setTimeout(run,0);
}

function queueExternalHostGeometryRefresh(){
 // resize is noisy on iOS/Android. Debounce first, then compare the composite
 // viewport-width signature once the event burst settles. This avoids root-width
 // reads on every visualViewport/window resize while still noticing vv/clientWidth
 // changes that can occur without innerWidth changing.
 if(externalGeometryTimer) globalThis.clearTimeout?.(externalGeometryTimer);
 externalGeometryTimer=setTimeout(runQueuedExternalHostGeometryRefresh,160);
}

function queueExternalHostOrientationRefresh(){
 // Orientation is a genuine containing-width change. Force one settled refresh
 // even if Safari reports the old innerWidth during the first orientation event.
 externalGeometryLastSignature='';
 if(externalGeometryTimer) globalThis.clearTimeout?.(externalGeometryTimer);
 externalGeometryTimer=setTimeout(runQueuedExternalHostGeometryRefresh,260);
}

export function installExternalGeometryListeners(){
 if(externalGeometryListenersInstalled) return;
 externalGeometryListenersInstalled=true;
 externalGeometryLastSignature=externalViewportWidthSignature();
 globalThis.addEventListener?.('resize',queueExternalHostGeometryRefresh,{passive:true});
 globalThis.addEventListener?.('orientationchange',queueExternalHostOrientationRefresh,{passive:true});
 globalThis.visualViewport?.addEventListener?.('resize',queueExternalHostGeometryRefresh,{passive:true});
}

export function removeExternalGeometryListeners(){
 if(externalGeometryListenersInstalled){
  globalThis.removeEventListener?.('resize',queueExternalHostGeometryRefresh);
  globalThis.removeEventListener?.('orientationchange',queueExternalHostOrientationRefresh);
  globalThis.visualViewport?.removeEventListener?.('resize',queueExternalHostGeometryRefresh);
 }
 externalGeometryListenersInstalled=false;
 if(externalGeometryTimer){
  globalThis.clearTimeout?.(externalGeometryTimer);
  externalGeometryTimer=0;
 }
 if(externalGeometryFrame){
  globalThis.cancelAnimationFrame?.(externalGeometryFrame);
  globalThis.clearTimeout?.(externalGeometryFrame);
  externalGeometryFrame=0;
 }
 externalGeometryLastSignature='';
}


export function markExternalDetails(details,key,source){
 if(!details) return details;
 details.setAttribute('data-rabbit-mirror-external-details','true');
 details.dataset.rabbitMirrorExternalOwner=String(key||'');
 details.dataset.rabbitMirrorExternalSource=String(source||'independent');
 return details;
}

export function recoverEscapedExternalDetails(el,host,key,source){
 return repatriateExternalDetails(el,host,key,source);
}

export function repatriateExternalDetails(el,host,key,source){
 if(!el||!host) return null;
 const escaped=[...(el.querySelectorAll?.('details[data-rabbit-mirror-external-details="true"]')||[])].filter(details=>{
  if(details.closest?.(`[${SOURCE_ATTR}="true"]`)===host) return false;
  return details.dataset.rabbitMirrorExternalSource===String(source||'independent')
   && (!details.dataset.rabbitMirrorExternalOwner || details.dataset.rabbitMirrorExternalOwner===String(key||''));
 });
 const direct=externalFaceDetails(host);
 if(!escaped.length) return direct[0]||null;

 // Mobile/Safari DOM repair can temporarily eject more than the first face from
 // the external shell. Keep the direct face for each trusted index and recover
 // every missing sibling; the old first-face-only branch removed faces 2..5.
 const all=[...direct,...escaped];
 let expected=Math.min(5,Math.max(1,Number(host.dataset?.rmFaceCount)||direct.length||1));
 const sourceHtml=String(host.__rabbitMirrorIndependentSource||'');
 if(hasMultifaceMarkup(sourceHtml)){
  const parsed=parseMultifaceOutput(sourceHtml);
  if(parsed.ok) expected=Math.max(expected,parsed.faces.length);
 }
 for(const details of all){
  const index=Number(details?.dataset?.rabbitMirrorFaceIndex);
  if(Number.isInteger(index) && index>=0 && index<5) expected=Math.max(expected,index+1);
 }
 expected=Math.min(5,expected);

 const advertised=new Set(all.map(details=>Number(details?.dataset?.rabbitMirrorFaceIndex))
  .filter(index=>Number.isInteger(index)&&index>=0&&index<expected));
 for(const details of all){
  const index=Number(details?.dataset?.rabbitMirrorFaceIndex);
  if(Number.isInteger(index)&&index>=0&&index<expected) continue;
  const missing=Array.from({length:expected},(_,candidate)=>candidate).find(candidate=>!advertised.has(candidate));
  if(missing===undefined) break;
  details.dataset.rabbitMirrorFaceIndex=String(missing);
  advertised.add(missing);
 }

 const kept=[]; const occupied=new Set();
 const consider=(details,preferDirect=false)=>{
  if(!details || kept.includes(details)) return;
  const index=Number(details.dataset?.rabbitMirrorFaceIndex);
  const indexed=Number.isInteger(index) && index>=0 && index<expected;
  if(indexed && occupied.has(index)){
   if(!preferDirect) details.remove?.();
   return;
  }
  if(kept.length>=expected){
   if(!preferDirect) details.remove?.();
   return;
  }
  markExternalDetails(details,key,source);
  kept.push(details);
  if(indexed) occupied.add(index);
 };
 for(const details of direct) consider(details,true);
 for(const details of escaped) consider(details,false);

 kept.sort((left,right)=>{
  const a=Number(left.dataset?.rabbitMirrorFaceIndex);
  const b=Number(right.dataset?.rabbitMirrorFaceIndex);
  const ai=Number.isInteger(a)&&a>=0&&a<expected?a:Number.MAX_SAFE_INTEGER;
  const bi=Number.isInteger(b)&&b>=0&&b<expected?b:Number.MAX_SAFE_INTEGER;
  return ai-bi;
 });
 // Moving an already-mounted node can restart its animations and scroll state.
 // Leave correctly ordered siblings in place; insert only an escaped/out-of-order face.
 let cursor=host.firstElementChild;
 const advance=()=>{while(cursor && cursor.tagName!=='DETAILS') cursor=cursor.nextElementSibling;};
 advance();
 for(const details of kept){
  if(details===cursor){cursor=cursor.nextElementSibling;advance();}
  else host.insertBefore(details,cursor);
 }
 host.dataset.rmFaceCount=String(kept.length);
 host.classList?.toggle?.('rabbit-mirror-multiface-host',kept.length>1);
 stampExternalDetailsOwnership(host);
 return kept[0]||null;
}

function repairMalformedLabelMarkup(html=''){
 return repairMalformedRabbitMirrorMarkup(String(html||''));
}

function cachePreparedReadyHtml(key,value){
 preparedReadyHtmlCache.set(key,value);
 while(preparedReadyHtmlCache.size>80){
  const oldest=preparedReadyHtmlCache.keys().next().value;
  preparedReadyHtmlCache.delete(oldest);
 }
 return value;
}

// 1.3.52: 运行时状态样式与“维修兔结构性急救样式”必须分开处理。
// 前者（checked 伪元素补丁）只在某个控件当前被勾选时生成，绝不能写进永久缓存。
// 后者（静态选项、静态分段折叠、填空选择、focus-within 持久桥接）是维修兔真正的修复产物；
// 1.3.43 把它们一起净化掉，导致用户点一次修好一次、刷新后又坏一次，永远收敛不了。

function parseIndependentDetailsRaw(html=''){
 try{
  const template=document.createElement('template');
  template.innerHTML=String(html||'');
  return template.content.querySelector('details');
 }catch{return null;}
}

function restoreEncodedInteractionBaselines(root){
 if(!root?.querySelectorAll) return;
 for(const element of [root,...root.querySelectorAll('[data-rm-reversible-style-baseline]')]){
  const encoded=String(element.getAttribute?.('data-rm-reversible-style-baseline')||'');
  if(!encoded || !element.style) continue;
  try{
   const parsed=JSON.parse(decodeURIComponent(encoded));
   const entries=Object.entries(parsed||{}).map(([property,state])=>({property,value:String(state?.value||''),priority:String(state?.priority||'').toLowerCase()==='important'?'important':''}));
   const valued=entries.filter(entry=>entry.value);
   const removedProperties=entries.filter(entry=>!entry.value).map(entry=>entry.property);
   const safe=valued.length?validateRabbitMirrorRecoveredStyleAssignments(element,valued,{removedProperties}):[];
   if(safe.length!==valued.length){ element.removeAttribute?.('data-rm-reversible-style-baseline'); continue; }
   for(const {property,value,priority} of entries){
    if(value) element.style.setProperty(property,value,priority);
    else element.style.removeProperty(property);
   }
  }catch{}
 }
 for(const element of root.querySelectorAll('[data-rm-reversible-text-baseline]')){
  const encoded=String(element.getAttribute('data-rm-reversible-text-baseline')||'');
  if(!encoded || element.children?.length) continue;
  try{ element.textContent=decodeURIComponent(encoded); }catch{}
 }
}

function persistedStateElements(root){
 if(!root?.querySelectorAll) return [];
 return [root,...root.querySelectorAll('*')].filter(element=>{
  if(element.closest?.(PERSISTED_RUNTIME_UI_SELECTOR)) return false;
  if(element.tagName==='STYLE' && PERSISTED_STATE_STYLE_ATTRS.some(name=>element.hasAttribute(name))) return false;
  return true;
 });
}

function elementHasPersistedRuntimeState(element){
 if(!element?.attributes) return false;
 if(PERSISTED_STATE_ARIA_ATTRS.some(name=>element.hasAttribute(name))) return true;
 return [...element.attributes].some(attribute=>PERSISTED_STATE_ATTR_RE.test(attribute.name));
}

function persistedClassPrefix(element){
 const scope=element.closest?.('[data-rabbit-mirror-css-scope]')?.getAttribute('data-rabbit-mirror-css-scope')||'';
 return scope?`rmc-${scope.replace(/^rmcss-/i,'')}-`:'';
}

function persistedStateBaselineMap(currentRoot,baselineRoot){
 const current=persistedStateElements(currentRoot),baseline=persistedStateElements(baselineRoot);
 const matches=new Map(),used=new Set();
 const group=(elements,keyOf)=>{
  const groups=new Map();
  for(const element of elements){const key=keyOf(element);if(!key)continue;const list=groups.get(key)||[];list.push(element);groups.set(key,list);}
  return groups;
 };
 const pair=(element,original)=>{
  if(!element||!original||matches.has(element)||used.has(original)||element.tagName!==original.tagName)return;
  matches.set(element,original);used.add(original);
 };
 pair(currentRoot,baselineRoot);
 const ids=group(baseline,node=>node.id);
 // Mounting adds an interaction namespace. Accept only a unique exact/suffix ID;
 // never consume another input merely because it occupies the same list position.
 for(const element of current){
  if(!element.id)continue;
  const candidates=new Set();
  const parts=element.id.split('-');
  for(let i=0;i<parts.length;i++)for(const item of ids.get(parts.slice(i).join('-'))||[])if(item.tagName===element.tagName)candidates.add(item);
  if(candidates.size===1)pair(element,[...candidates][0]);
 }
 // A tag-order cursor shifts whenever a repair inserts/removes a wrapper. Build
 // collision-free, interned subtree keys instead: original text + element shape,
 // excluding mutable class/style/checked state. A key must be unique on BOTH sides.
 // Ambiguous nodes remain untouched rather than borrowing another branch's CSS.
 const interned=new Map();
 const keysFor=elements=>{
  const keys=new Map(),included=new Set(elements);
  for(const element of [...elements].reverse()){
   const childKeys=[...element.childNodes].flatMap(node=>node.nodeType===1
    ? (included.has(node)?[['element',keys.get(node)]]:[])
    : node.nodeType===3&&node.nodeValue.trim()?[['text',node.nodeValue]]:[]);
   const key=JSON.stringify([element.tagName,element.getAttribute('type')||'',element.getAttribute('value')||'',childKeys]);
   if(!interned.has(key))interned.set(key,interned.size+1);
   keys.set(element,interned.get(key));
  }
  return keys;
 };
 const currentKeys=keysFor(current),baselineKeys=keysFor(baseline);
 const pairUnique=(left,right)=>{
  const leftGroups=group(left,node=>currentKeys.get(node)),rightGroups=group(right,node=>baselineKeys.get(node));
  for(const [key,items] of leftGroups){
   const originals=rightGroups.get(key);
   if(items.length!==1||originals?.length!==1)continue;
   const element=items[0],original=originals[0];
   if(element.id||original.id)continue; // IDs are handled above, without shape guessing.
   pair(element,original);
  }
 };
 pairUnique(current,baseline);
 // Text-changing controls (for example a fill-in blank) retain their authored
 // class identity. Use the whole unique class set, not a shared "panel" token.
 const classKey=element=>{
  const prefix=persistedClassPrefix(element);
  const names=[...element.classList].map(name=>prefix&&name.startsWith(prefix)?name.slice(prefix.length):name).sort();
  return names.length?JSON.stringify([element.tagName,names]):'';
 };
 const currentClasses=group(current,classKey),baselineClasses=group(baseline,classKey);
 for(const [key,items] of currentClasses){
  const originals=baselineClasses.get(key);
  if(items.length===1&&originals?.length===1&&!items[0].id&&!originals[0].id)pair(items[0],originals[0]);
 }
 // Identical small controls in different, already identified panels can be paired
 // inside their own parent, but not across panels or faces.
 for(const [element,original] of matches)pairUnique([...element.children].filter(n=>currentKeys.has(n)),[...original.children].filter(n=>baselineKeys.has(n)));
 return matches;
}

function restoreStateAttributesFromBaseline(current,baseline){
 if(!current || !baseline) return;
 const stateful=elementHasPersistedRuntimeState(current);
 if(stateful){
  for(const name of ['class','style','hidden']){
   if(baseline.hasAttribute(name)){
    let value=baseline.getAttribute(name);
    if(name==='class'){
     const previousPrefix=persistedClassPrefix(baseline),currentPrefix=persistedClassPrefix(current);
     // The mounted stylesheet owns its namespace. Restoring state must not attach
     // class names from an older mount to a different, still-current stylesheet.
     if(previousPrefix&&previousPrefix!==currentPrefix)value=value.split(/\s+/).map(token=>token.startsWith(previousPrefix)?currentPrefix+token.slice(previousPrefix.length):token).join(' ');
    }
    current.setAttribute(name,value);
   }
   else current.removeAttribute(name);
  }
 }
 // 1.3.55: fill-in 维修会把占位文字改成当前选择，并把 aria-label 改成“已填…”。
 // 这两项不是普通 attribute-state 正则能还原的；保存维修结果时必须恢复到生成时占位内容，
 // 否则“修交互”会顺手把用户当次选择写死进永久缓存。
 if(current.hasAttribute?.('data-rm-fill-in-choice-blank')){
  const currentText=[...(current.childNodes||[])].filter(node=>node?.nodeType===3);
  const baselineText=[...(baseline.childNodes||[])].filter(node=>node?.nodeType===3);
  currentText.forEach((node,index)=>{
   if(baselineText[index]) node.nodeValue=String(baselineText[index].nodeValue||'');
  });
  if(baseline.hasAttribute('aria-label')) current.setAttribute('aria-label',baseline.getAttribute('aria-label'));
  else current.removeAttribute('aria-label');
  current.removeAttribute('data-rm-fill-in-choice-code');
 }
 for(const name of PERSISTED_STATE_ARIA_ATTRS){
  if(baseline.hasAttribute(name)) current.setAttribute(name,baseline.getAttribute(name));
  else current.removeAttribute(name);
 }
 for(const attribute of [...current.attributes]){
  if(!PERSISTED_STATE_ATTR_RE.test(attribute.name)) continue;
  if(baseline.hasAttribute(attribute.name)) current.setAttribute(attribute.name,baseline.getAttribute(attribute.name));
  else current.removeAttribute(attribute.name);
 }
}

export function scrubIndependentInteractionState(html='',baselineHtml=''){
 if(hasMultifaceMarkup(html)){
  const parsed=parseMultifaceOutput(html);
  if(!parsed.ok) return '';
  const baseline=hasMultifaceMarkup(baselineHtml)?parseMultifaceOutput(baselineHtml):null;
  return parsed.faces.map(face=>wrapIndependentFace(scrubIndependentInteractionState(face.inner,baseline?.faces?.find(item=>item.index===face.index)?.inner||face.inner),face.index)).join('\n');
 }
 const details=parseIndependentDetailsRaw(html);
 if(!details) return String(html||'').trim();
 const baseline=parseIndependentDetailsRaw(baselineHtml)||parseIndependentDetailsRaw(html);
 // Diagnostic panels are runtime-only UI. Persisting them serializes their DOM but
 // not their addEventListener handlers, producing visible but dead buttons after a
 // maintenance save/remount. Never allow them into an independent mirror record.
 details.querySelectorAll(PERSISTED_RUNTIME_UI_SELECTOR).forEach(node=>node.remove());
 baseline?.querySelectorAll?.(PERSISTED_RUNTIME_UI_SELECTOR)?.forEach?.(node=>node.remove());
 restoreEncodedInteractionBaselines(details);
 // 1.3.77: 手动维修触发持久化时，横向裁切急救的 runtime CSS/属性同样无条件剔除，
 // 不受维修标志保护，避免它被序列化进缓存。
 try{ clearRabbitMirrorHorizontalClipArtifacts(details); }catch(error){ console.debug('[RabbitMirror] horizontal clip scrub skipped:',error); }
 // 1.3.52: 与 1.3.45 的排版维修保持一致——带维修兔持久化标记的记录，
 // 其结构性急救样式表属于修复结果而不是运行时污染，必须保留。
 // 运行时选中状态（input.checked / aria-pressed / data-rm-*-active）仍然照常净化。
 // 1.3.77: 横向裁切急救的产物全部是 transient runtime artifact，绝不随缓存或聊天
 // metadata 一起保存。这里在读取 preserveMaintenance 之前无条件清理，因此即使 root 带
 // data-rabbit-mirror-maintenance-persisted-layout="true" 也不会被保留。
 try{ clearRabbitMirrorHorizontalClipArtifacts(details); }catch(error){ console.debug('[RabbitMirror] horizontal clip artifact cleanup skipped:',error); }
 const preserveMaintenance=details.getAttribute?.(MAINTENANCE_PERSISTED_LAYOUT_ATTR)==='true';
 const removableStyleAttrs=preserveMaintenance ? RUNTIME_STATE_STYLE_ATTRS : PERSISTED_STATE_STYLE_ATTRS;
 details.querySelectorAll(removableStyleAttrs.map(name=>`style[${name}]`).join(',')).forEach(node=>node.remove());
 const baselineMap=persistedStateBaselineMap(details,baseline);
 for(const [current,original] of baselineMap)restoreStateAttributesFromBaseline(current,original);
 const currentInputs=[...details.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
 currentInputs.forEach(input=>{
  const original=baselineMap.get(input);
  if(!original)return;
  const checked=!!original?.hasAttribute?.('checked');
  input.checked=checked;
  input.defaultChecked=checked;
  if(checked) input.setAttribute('checked',''); else input.removeAttribute('checked');
  if(original?.hasAttribute?.('aria-pressed')) input.setAttribute('aria-pressed',original.getAttribute('aria-pressed'));
  else input.removeAttribute('aria-pressed');
 });
 const currentOptions=[...details.querySelectorAll('option')];
 currentOptions.forEach(option=>{
  const original=baselineMap.get(option);
  if(!original)return;
  const selected=!!original.hasAttribute('selected');
  option.selected=selected;
  option.defaultSelected=selected;
  if(selected) option.setAttribute('selected',''); else option.removeAttribute('selected');
 });
 const currentDetails=[details,...details.querySelectorAll('details')];
 currentDetails.forEach(item=>{
  const original=baselineMap.get(item);
  if(!original)return;
  const open=!!original.hasAttribute('open');
  if(open) item.setAttribute('open',''); else item.removeAttribute('open');
 });
 for(const element of [details,...details.querySelectorAll('*')]){
  for(const attribute of [...element.attributes]){
   if(PERSISTED_STATE_ATTR_RE.test(attribute.name)) element.removeAttribute(attribute.name);
  }
 }
 // 结构标记可以保存，但其 value 不得携带本次交互状态。
 details.querySelectorAll?.('[data-rabbit-mirror-static-choice-selection-rescue]')?.forEach?.(node=>node.setAttribute('data-rabbit-mirror-static-choice-selection-rescue','true'));
 for(const node of [details,...details.querySelectorAll?.('[data-rabbit-mirror-fill-in-choice-rescue]')||[]]){
  if(node?.hasAttribute?.('data-rabbit-mirror-fill-in-choice-rescue')) node.setAttribute('data-rabbit-mirror-fill-in-choice-rescue','true');
 }
 return String(details.outerHTML||'').trim();
}

export function interactionStatePollutionScore(html=''){
 const source=String(html||'');
 const markers=source.match(/(?:aria-(?:pressed|selected|expanded)="true"|data-rm-[^=\s>]*(?:active|selected|open|used|filled)|data-rabbit-mirror-(?:checked-pseudo-rule-rescue|checked-text-rule-rescue|labeled-checked))/gi);
 return markers?.length||0;
}

function interactionBaselineProfile(html=''){
 if(hasMultifaceMarkup(html)){
  const parsed=parseMultifaceOutput(html);
  if(!parsed.ok) return null;
  const faces=parsed.faces.map(face=>interactionBaselineProfile(face.inner));
  return faces.some(face=>!face)?null:{faces};
 }
 const details=parseIndependentDetailsRaw(html);
 if(!details) return null;
 restoreEncodedInteractionBaselines(details);
 details.querySelectorAll('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay]').forEach(node=>node.remove());
 details.querySelectorAll(PERSISTED_STATE_STYLE_ATTRS.map(name=>`style[${name}]`).join(',')).forEach(node=>node.remove());
 const summary=String(details.querySelector(':scope > summary')?.textContent||'').replace(/\s+/g,' ').trim();
 const text=String(details.textContent||'').replace(/\s+/g,' ').trim();
 const controls=[...details.querySelectorAll('input[type="checkbox"], input[type="radio"]')].map(input=>String(input.type||'')).join(',');
 return {summary,text,controls};
}

function interactionBaselinesCompatible(currentHtml,candidateHtml){
 const current=interactionBaselineProfile(currentHtml); const candidate=interactionBaselineProfile(candidateHtml);
 if(!current||!candidate) return false;
 if(current.faces||candidate.faces) return JSON.stringify(current)===JSON.stringify(candidate);
 return current.summary===candidate.summary && current.text===candidate.text && current.controls===candidate.controls;
}

export function initialHtmlForRecord(slot,record){
 if(record?.initialHtml && independentStoredHtmlRestorable(record.initialHtml)) return String(record.initialHtml);
 const currentHtml=String(record?.html||'');
 const candidates=historyEntriesForSlot(slot).filter(entry=>entry?.html&&independentStoredHtmlRestorable(entry.html)&&interactionBaselinesCompatible(currentHtml,entry.initialHtml||entry.html));
 if(candidates.length){
  candidates.sort((a,b)=>interactionStatePollutionScore(a.html)-interactionStatePollutionScore(b.html) || Number(a.ts||0)-Number(b.ts||0));
  return String(candidates[0].initialHtml||candidates[0].html||'');
 }
 return currentHtml;
}

export function normalizeSavedInteractionRecord(record,slot=''){
 if(!record?.html) return record;
 const initial=scrubIndependentInteractionState(initialHtmlForRecord(slot,record),initialHtmlForRecord(slot,record));
 const html=scrubIndependentInteractionState(record.html,initial||record.html);
 return {...record,html,initialHtml:initial||html};
}

export function migratePersistedInteractionStateRecords(){
 try{ if(localStorage.getItem(INTERACTION_STATE_MIGRATION_KEY)==='done') return false; }catch{}
 if(persistedInteractionMigrationHandle || persistedInteractionMigrationIdle) return false;
 const store=readStore(); const entries=Object.entries(store); let cursor=0; let changed=false;
 const finish=()=>{
  writePersistedInteractionMigrationHandle(0); writePersistedInteractionMigrationIdle(false);
  if(changed) writeStore(store);
  try{ localStorage.setItem(INTERACTION_STATE_MIGRATION_KEY,'done'); }catch{}
 };
 const runSlice=(deadline)=>{
  writePersistedInteractionMigrationHandle(0); writePersistedInteractionMigrationIdle(false);
  let handled=0;
  while(cursor<entries.length && handled<2 && (!deadline?.timeRemaining || deadline.timeRemaining()>3)){
   const [slot,record]=entries[cursor++]; handled+=1;
   if(!record?.html) continue;
   // Old localStorage is untrusted input. Reject by byte/lexical/structure limits
   // before normalizeSavedInteractionRecord can reach template.innerHTML.
   if(!independentStoredHtmlLightRestorable(record.html)){
    delete store[slot]; changed=true; continue;
   }
   const safeRecord=record.initialHtml && !independentStoredHtmlLightRestorable(record.initialHtml)
    ? {...record,initialHtml:''}
    : record;
   const normalized=normalizeSavedInteractionRecord(safeRecord,slot);
   if(String(normalized.html||'')!==String(record.html||'') || String(normalized.initialHtml||'')!==String(record.initialHtml||'')){
    store[slot]=normalized; changed=true;
   }
  }
  if(cursor>=entries.length){ finish(); return; }
  scheduleSlice(false);
 };
 const scheduleSlice=(initial=true)=>{
  if(typeof requestIdleCallback==='function'){
   writePersistedInteractionMigrationIdle(true);
   writePersistedInteractionMigrationHandle(requestIdleCallback(runSlice,{timeout:initial?4000:1200}));
  }else{
   writePersistedInteractionMigrationHandle(setTimeout(()=>runSlice(null),initial?2500:32));
  }
 };
 scheduleSlice(true);
 return false;
}

export function copyIndependentReplacementReceipt(receipt){
 if(receipt?.version!==1 || typeof receipt.ownerKey!=='string' || receipt.ownerKey.length>4096
  || !/^[a-f0-9]{64}$/.test(receipt.htmlHash||'') || !/^[a-f0-9]{64}$/.test(receipt.rulesHash||'')) return null;
 return {version:1,ownerKey:receipt.ownerKey,htmlHash:receipt.htmlHash,rulesHash:receipt.rulesHash};
}
// Only local successful processing calls this; never copy response fields or
// generated attributes into a receipt. The slot is external owner authority.

export function sealIndependentTextReplacementRecord(record,slot,previousRecord=null,replacedFaceIndex=null){
 if(!independentRecordWithinBudget(record) || !slot) return record;
 const rules=getSettings()?.rabbitMirrorBannedWords||[];
 if(!rules.length) return record;
 if(hasMultifaceMarkup(record.html)){
  const parsed=parseMultifaceOutput(record.html);
  const previous=previousRecord?.html?parseMultifaceOutput(previousRecord.html):null;
  if(parsed.ok){
   record.textReplacementReceipts=parsed.faces.map(face=>{
    if(Number.isInteger(replacedFaceIndex) && face.index!==replacedFaceIndex){
     return previous?.faces?.[face.index]?.inner===face.inner
      ? copyIndependentReplacementReceipt(previousRecord?.textReplacementReceipts?.[face.index]) : null;
    }
    return createRabbitMirrorTextReplacementReceipt(face.inner,rules,`${slot}#face:${face.index}`);
   });
   record.textReplacementReceipt=null;
   return record;
  }
 }
 record.textReplacementReceipt=createRabbitMirrorTextReplacementReceipt(record.html,rules,slot);
 record.initialTextReplacementReceipt=record.initialHtml
  ? createRabbitMirrorTextReplacementReceipt(record.initialHtml,rules,slot) : null;
 return record;
}

export function prepareStoredIndependentRecordHtml(record,slot){
 if(!independentRecordWithinBudget(record) || !slot) return '';
 const lineage=copyIndependentOwnerLineage(record.ownerLineage);
 const originSlot=independentLineageOriginSlot(record);
 if(originSlot && slot===`${lineage.chatKey}:${lineage.mesid}:${lineage.swipe}:${lineage.acceptedBodyHash}`) slot=originSlot;
 // This seam is reached only after the caller has selected and validated the
// owning saved result. No startup readStore scan parses or hashes all records.
 if(hasMultifaceMarkup(record.html) && Array.isArray(record.textReplacementReceipts)){
  const parsed=parseMultifaceOutput(record.html);
  if(!parsed.ok) return '';
  const faces=parsed.faces.map(face=>({index:face.index,inner:prepareIndependentReadyHtml(face.inner,
   record.textReplacementReceipts[face.index],`${slot}#face:${face.index}`)}));
  if(faces.some(face=>!face.inner)) return '';
  return faces.map(face=>wrapPreparedIndependentFace(face.inner,face.index)).join('\n');
 }
 return prepareIndependentReadyHtml(record.html,record.textReplacementReceipt,slot);
}

export function sanitizeIndependentReadyFragment(html='',textAlreadyFiltered=false){
 try{ assertIndependentMarkupComplexity(html); }catch{return '';}
 const template=document.createElement('template');
 template.innerHTML=String(html||'');
 if(textAlreadyFiltered) rememberRabbitMirrorFilteredDom(template.content,getSettings()?.rabbitMirrorBannedWords);
 // 独立 API 结果绕过 SillyTavern 的消息净化链；真正挂载前与维修兔共用同一未信任 HTML 边界。
 template.content.querySelectorAll('script').forEach(node=>node.remove());
 if(!sanitizeRabbitMirrorUntrustedTemplate(template)) return '';
 return template.innerHTML;
}


export function prepareIndependentReadyHtml(html='',savedReceipt=null,ownerSlot='',locallyPrepared=false){
 const source=String(html||'').trim();
 try{ assertIndependentMarkupComplexity(source); }catch{return '';}
 const bannedWords=getSettings()?.rabbitMirrorBannedWords;
 const bannedFingerprint=hashText(Array.isArray(bannedWords)?JSON.stringify(bannedWords):'');
 const provenance=locallyPrepared?'prepared':savedReceipt?`record:${ownerSlot}:${JSON.stringify(copyIndependentReplacementReceipt(savedReceipt))}`:'raw';
 const cacheKey=`${RUNTIME_VERSION}:${bannedFingerprint}:${provenance}:${source.length}:${hashText(source)}`;
 if(preparedReadyHtmlCache.has(cacheKey)) return preparedReadyHtmlCache.get(cacheKey);
 const textAlreadyFiltered=locallyPrepared || matchesRabbitMirrorTextReplacementReceipt(savedReceipt,String(html||''),bannedWords||[],ownerSlot);
 if(hasMultifaceMarkup(source)){
  const parsed=parseMultifaceOutput(source);
  if(!parsed.ok) return '';
  const preparedFaces=parsed.faces.map(face=>({index:face.index,inner:prepareIndependentReadyHtml(face.inner,null,'',textAlreadyFiltered)}));
  if(preparedFaces.some(face=>!face.inner)) return '';
  const prepared=preparedFaces.map(face=>wrapPreparedIndependentFace(face.inner,face.index)).join('\n');
  if(!parseMultifaceOutput(prepared,{expectedCount:parsed.faces.length}).ok) return '';
  try{ assertIndependentMarkupComplexity(prepared); }catch{return '';}
  cachePreparedReadyHtml(cacheKey,prepared);
  cachePreparedReadyHtml(`${RUNTIME_VERSION}:${bannedFingerprint}:prepared:${prepared.length}:${hashText(prepared)}`,prepared);
  return prepared;
 }
 const repaired=repairMalformedLabelMarkup(source);
 const cleaned=cleanRabbitMirrorOutput(repaired);
 // 独立 API 的成功结果本来就必须是一段完整 <details>。这里不再依赖
 // “是否像完整 HTML 作品”的启发式判断；即使是旧缓存、较短内容或已经
 // 带 data-rabbit-mirror-css-scope 的 DOM，也强制再走一次逐镜 class / keyframe 清理。
 const prepared=/<details\b/i.test(cleaned)
  ? compactTotoBlock(cleaned)
  : cleaned;
 const sanitized=sanitizeIndependentReadyFragment(prepared,textAlreadyFiltered);
 cachePreparedReadyHtml(cacheKey,sanitized);
 // callIndependentApi() stores this already-prepared value and the first DOM
 // mount receives those exact bytes. Seed that value's own key as well so the
 // mount is a cache hit instead of parsing/sanitizing a large mirror twice.
 if(sanitized){
  const sanitizedKey=`${RUNTIME_VERSION}:${bannedFingerprint}:prepared:${sanitized.length}:${hashText(sanitized)}`;
  if(sanitizedKey!==cacheKey) cachePreparedReadyHtml(sanitizedKey,sanitized);
 }
 return sanitized;
}

function repairLabelTargets(root){
 if(!root?.querySelectorAll) return 0;
 const inputs=[...root.querySelectorAll('input[id], select[id], textarea[id], button[id]')];
 let changed=0;
 for(const label of root.querySelectorAll('label[for]')){
  const target=String(label.getAttribute('for')||'').trim();
  if(!target) continue;
  const exact=inputs.find(input=>input.id===target);
  if(exact) continue;
  const suffix=`-${target}`;
  const matches=inputs.filter(input=>String(input.id||'').endsWith(suffix));
  if(matches.length===1){ label.setAttribute('for',matches[0].id); changed++; }
 }
 return changed;
}

export function extractReadyDetails(html='',locallyPrepared=false){
 const template=document.createElement('template');
 template.innerHTML=prepareIndependentReadyHtml(html,null,'',locallyPrepared);
 // The producer above has applied current local text rules. Reparse creates
 // new Text nodes; carry that local provenance for later snapshot restoration.
 rememberRabbitMirrorFilteredDom(template.content,getSettings()?.rabbitMirrorBannedWords);
 const details=template.content.querySelector('details') || null;
 if(details){
  // Layout repairs are runtime-only. 1.3.3 could persist mobile rescue marks/styles
  // into independent cache and then replay that repaired DOM on another device.
  // Strip only our own transient layout artifacts before rebuilding the live mirror.
  stripIndependentTransientLayoutArtifacts(details);
  // Independent API outputs are allowed to place <style> as a sibling of <details>
  // inside <toto>. The external renderer returns only the <details> node, so those
  // sibling styles used to be discarded here. That leaves the scene with bare
  // checkbox/text DOM, makes :checked interaction rules disappear, and prevents
  // both native return labels and the maintenance rabbit from seeing a real route.
  // Preserve only styles that belong to this prepared fragment by moving them
  // inside the returned details. The CSS has already been per-mirror scoped by
  // prepareIndependentReadyHtml(), so this cannot leak into neighboring messages.
  const detachedStyles=[...template.content.querySelectorAll('style')]
   .filter(style=>!details.contains(style));
  if(detachedStyles.length){
   const summary=details.querySelector(':scope > summary');
   const reference=summary?.nextSibling || details.firstChild;
   for(const style of detachedStyles){
    if(reference) details.insertBefore(style,reference);
    else details.append(style);
   }
  }
  repairRabbitMirrorScopedClassAliasesInScope(details);
  repairLabelTargets(details);
  // Detached parsing preserves serializable rescue markers but has no runtime
  // listeners. Rearm before first mount so the safe rescue library can bind once.
  rearmRabbitMirrorSerializedInteractionRoot(details);
  // 1.3.57: detached cache parsing must only isolate IDs/references. The full
  // interaction rescue library is intentionally deferred until the mounted mirror
  // is first opened. Running the complete rescue here and again in ensureExternalTools()
  // doubled the heaviest per-mirror work during chat entry.
  isolateRabbitMirrorInteractionIds(details);
  // 1.3.20: ready HTML stays structurally faithful while detached. Mobile/layout
  // rescue is allowed only after the mirror is mounted in the inline placement.
  // Pure external uses a light title shell and must not rewrite generated layout.
  details.setAttribute(INDEPENDENT_SANITIZER_ATTR,RUNTIME_VERSION);
 }
 return details;
}

function extractReadyFaceDetails(html='',locallyPrepared=false){
 if(!hasMultifaceMarkup(html)){
  const details=extractReadyDetails(html,locallyPrepared);
  return details?[details]:[];
 }
 const parsed=parseMultifaceOutput(html);
 if(!parsed.ok) return [];
 const faces=parsed.faces.map(face=>extractReadyDetails(face.inner,locallyPrepared));
 if(faces.some(details=>!usableReadyDetails(details))) return [];
 return faces;
}

export function mountExternalFaceDetails(host,key,source,html,{wasOpen=false,locallyPrepared=false}={}){
 const faces=extractReadyFaceDetails(html,locallyPrepared);
 if(!faces.length) return false;
 const previous=externalFaceDetails(host);
 for(const [index,details] of faces.entries()){
  markExternalDetails(details,key,source);
  // Tool listeners close over their own root; never transfer a different face's tools.
  if(previous[index]?.open || (faces.length===1 && wasOpen)) details.setAttribute('open','');
  else details.removeAttribute('open');
 }
 host.replaceChildren(...faces);
 host.dataset.rmFaceCount=String(faces.length);
 host.classList.toggle('rabbit-mirror-multiface-host',faces.length>1);
 stampExternalDetailsOwnership(host);
 for(const [index,details] of faces.entries()) markSanitizedRabbitMirrorFace(details,{faceIndex:index,faceCount:faces.length,sourceHash:String(host.dataset?.rmSourceHash||''),origin:String(source||'independent'),...externalFacePresentation(host,index)});
 return true;
}

export function replaceExternalMultifaceFace(host,key,source,html,faceIndex,locallyPrepared=false){
 const currentFaces=externalFaceDetails(host);
 const parsed=parseMultifaceOutput(String(html||''));
 const index=Number(faceIndex);
 if(!host?.isConnected || !parsed.ok || !Number.isInteger(index) || index<0
  || index>=parsed.faces.length || currentFaces.length!==parsed.faces.length
  || currentFaces.some(details=>!usableReadyDetails(details))) return false;
 const replacement=extractReadyDetails(parsed.faces[index].inner,locallyPrepared);
 const current=currentFaces[index];
 if(!replacement || !usableReadyDetails(replacement) || !current?.isConnected) return false;
 const wasOpen=!!current.hasAttribute?.('open');
 markExternalDetails(replacement,key,source);
 if(wasOpen) replacement.setAttribute('open',''); else replacement.removeAttribute('open');
 current.replaceWith(replacement);
 host.dataset.rmState='ready';
 host.dataset.rmFaceCount=String(parsed.faces.length);
 host.classList.toggle('rabbit-mirror-multiface-host',parsed.faces.length>1);
 host.__rabbitMirrorIndependentSource=String(html||'');
 stampExternalDetailsOwnership(host);
 markSanitizedRabbitMirrorFace(replacement,{faceIndex:index,faceCount:parsed.faces.length,sourceHash:String(host.dataset?.rmSourceHash||''),origin:String(source||'independent'),...externalFacePresentation(host,index)});
 return true;
}

function completeReadyFaceDetails(host,expectedHtml=''){
 const faces=externalFaceDetails(host);
 if(!host || host.dataset?.rmState!=='ready' || !faces.length || faces.some(face=>!usableReadyDetails(face))) return [];
 let expectedCount=Number(host.dataset?.rmFaceCount)||faces.length;
 const source=String(expectedHtml||'');
 if(hasMultifaceMarkup(source)){
  const parsed=parseMultifaceOutput(source);
  if(!parsed.ok) return [];
  expectedCount=parsed.faces.length;
 }
 return expectedCount===faces.length && expectedCount>=1 && expectedCount<=5 ? faces : [];
}

function externalFacePresentation(host,index){
 const metadata=externalPresentationMetadata.get(host);
 return presentationModeFields(Array.isArray(metadata?.faces)?metadata.faces[index]:metadata);
}

export function markMountedFaceProofs(host,source='independent',metadata=null){
 if(metadata) externalPresentationMetadata.set(host,metadata);
 const faces=completeReadyFaceDetails(host,host?.__rabbitMirrorIndependentSource||'');
 for(const [index,details] of faces.entries()) markSanitizedRabbitMirrorFace(details,{faceIndex:index,faceCount:faces.length,sourceHash:String(host.dataset?.rmSourceHash||''),origin:String(source||'independent'),...externalFacePresentation(host,index)});
 return faces.length;
}
// Diagnostics are optional and cannot change the operation's return or error.

export function beginHostWorkTiming(name){
 let end;
 try{ end=globalThis.__rabbitMirrorExternalDiag?.beginHostWork?.(name); }catch{}
 if(typeof end!=='function') return null;
 return ()=>{ try{ end(); }catch{} };
}

export function refreshExistingExternalDetails(host,key,source='independent'){
 const end=beginHostWorkTiming('independent.refreshExistingExternalDetails');
 try{ return refreshExistingExternalDetailsCore(host,key,source); }finally{ end?.(); }
}

function refreshExistingExternalDetailsCore(host,key,source='independent'){
 if(!host?.isConnected || host.dataset.rmState!=='ready') return null;
 if(externalFaceDetails(host).length>1){
  const faces=externalFaceDetails(host);
  if(faces.some(details=>details.getAttribute(INDEPENDENT_SANITIZER_ATTR)!==RUNTIME_VERSION)){
   const prepared=faces.map((face,index)=>wrapPreparedIndependentFace(prepareLocalDetailsClone(face),index)).join('\n');
   mountExternalFaceDetails(host,key,source,prepared,{locallyPrepared:true});
  }
  return externalFaceDetails(host)[0]||null;
 }
 const current=host.querySelector(':scope > details');
 if(!current || current.getAttribute(INDEPENDENT_SANITIZER_ATTR)===RUNTIME_VERSION) return current;
 const next=extractReadyDetails(prepareLocalDetailsClone(current),true);
 if(!next) return current;
 const wasOpen=current.hasAttribute('open');
 markExternalDetails(next,key,source);
 transferExternalTools(current,next);
 current.replaceWith(next);
 if(wasOpen) next.setAttribute('open','');
 return next;
}

function prepareLocalDetailsClone(details){
 const template=document.createElement('template');
 const clone=cloneRabbitMirrorFilteredNode(details);
 clone.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
 template.content.append(clone);
 return sanitizeRabbitMirrorUntrustedTemplate(template)?template.innerHTML:'';
}

export function externalToolHost(details){
 return details?.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]') || null;
}

function removeIndependentResayButtons(host){
 if(!host?.querySelectorAll) return;
 for(const button of host.querySelectorAll(`[${RESAY_ATTR}], .rabbit-mirror-resay`)) if(!quickStartButtonOwners.has(button)) button.remove();
 const details=host.querySelector?.(':scope > details');
 const tools=externalToolHost(details);
 if(tools && !tools.querySelector('[data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rm-quick-resay]')) tools.remove();
}

function activateExternalInteractionTools(host,details){
 if(!details || externalInteractionActivatedDetails.has(details)) return false;
 try{
  // ID isolation does not install safe interaction listeners. The shared per-face
  // gate initializes once after opening (or before a fast first internal tap),
  // without running diagnostics, persistence or rescanning on later toggles.
  armRabbitMirrorFirstUseInteraction(details);
  externalInteractionActivatedDetails.add(details);
  details.removeAttribute?.(DEFERRED_INTERACTION_RESCUE_ATTR);
  return true;
 }catch(error){
  console.debug('[RabbitMirror] external interaction activation skipped:',error);
  return false;
 }
}

function scheduleExternalInteractionActivationAfterOpenPaint(host,details,onToggle=null){
 if(!details?.isConnected || !details.open || externalInteractionActivatedDetails.has(details)) return false;
 if(externalInteractionActivationScheduledDetails.has(details)) return true;
 externalInteractionActivationScheduledDetails.add(details);
 const run=()=>{
  externalInteractionActivationScheduledDetails.delete(details);
  if(!host?.isConnected || !details?.isConnected || !details.open || details.parentElement!==host || externalInteractionActivatedDetails.has(details)) return;
  // Safari can leave the direct content root in a shrink-to-fit width on the
  // first pure-external paint even though <summary> and ::details-content are
  // already full width. The existing rescue used to run only after a real
  // resize/orientation change, so most users never reached it. Reuse the same
  // guarded, author-sizing-aware repair once after the first open paint.
  try{ rescueIndependentExternalAutoRootWidth(host,details); }
  catch(error){ console.debug('[RabbitMirror] external auto-root width rescue skipped:',error); }
  if(activateExternalInteractionTools(host,details)){
   const boundToggle=onToggle||externalInteractionActivationHandlers.get(details);
   if(boundToggle) details.removeEventListener?.('toggle',boundToggle,false);
   externalInteractionActivationHandlers.delete(details);
  }
 };
 // The old path ran the entire interaction rescue library synchronously inside the
 // native <details> toggle event. On complex mirrors Safari cannot paint the opened
 // body until that scan finishes, so a successful tap looks like a dead/cancelled tap.
 // Yield one paint first; internal controls and the guarded Safari width repair
 // are still rehydrated immediately after it.
 if(typeof requestAnimationFrame==='function') requestAnimationFrame(()=>setTimeout(run,0));
 else setTimeout(run,0);
 return true;
}

function activateHistoricalLightHostOnOpen(host,details){
 if(!host?.hasAttribute?.(HISTORICAL_LIGHT_HOST_ATTR) || !details?.isConnected || !details.open) return false;
 host.removeAttribute(HISTORICAL_LIGHT_HOST_ATTR);
 delete host.dataset.rmGeometryMode;
 const el=messageElementForExternalHost(host);
  if(host.dataset.rmSource==='independent' && host.dataset.rmPlacement==='external' && el?.isConnected){
   beginExternalHostGeometryCycle(host,'historical-first-open',el);
   const cycleId=String(host.dataset.rmGeometryCycleId||'');
   const run=()=>{ try{ syncExternalHostGeometry(el,host,{phase:'historical-open-once',cycleId}); finishExternalHostGeometrySettle(host,cycleId); }catch{} };
   if(typeof requestAnimationFrame==='function') requestAnimationFrame(run); else setTimeout(run,0);
  }
 return true;
}

function armExternalInteractionTools(host,details){
 if(!details || externalInteractionActivatedDetails.has(details)) return;
 const ready=host?.dataset?.rmState==='ready';
 const placeholder=details.classList?.contains('rabbit-mirror-external-placeholder');
 if(!ready || placeholder) return;
 // Historical ready mirrors are mounted collapsed. Running the full rescue library
 // for every collapsed mirror during CHAT_CHANGED is pure startup cost: no internal
 // control can be used until the details is opened. Activate only the mirror the
 // user actually opens. The expensive rescue pass yields one paint so the outer
 // disclosure itself stays responsive on Safari/iOS.
 if(details.open || details.hasAttribute?.('open')){
  activateHistoricalLightHostOnOpen(host,details);
  scheduleExternalInteractionActivationAfterOpenPaint(host,details);
  return;
 }
 details.setAttribute?.(DEFERRED_INTERACTION_RESCUE_ATTR,'true');
 if(externalInteractionActivationHandlers.has(details)) return;
 const onToggle=()=>{
  if(!details?.isConnected || !details.open) return;
  activateHistoricalLightHostOnOpen(host,details);
  scheduleExternalInteractionActivationAfterOpenPaint(host,details,onToggle);
 };
 details.addEventListener?.('toggle',onToggle,false);
 externalInteractionActivationHandlers.set(details,onToggle);
}

export function ensureExternalTools(host){
 if(!host?.isConnected) return;
 if(host.dataset?.rmState==='ready' && host.dataset?.rmSource==='independent') wireIndependentRejectedFaceControls(host);
 stampExternalDetailsOwnership(host);
 if(host.dataset?.rmState==='manual') return;
 const historyRestoreLight=historicalLightHost(host);
 // Placement already owns one post-paint geometry pass. Tool refresh must not
 // reopen the old mobile settle timer chain.
 const faces=externalFaceDetails(host);
 for(const details of faces){
 armExternalInteractionTools(host,details);
 // 1.3.62: old independent mirrors can already contain persisted exclusive-state
 // ownership markers even when the complete interaction library is not rerun on
 // this upgrade. Apply the cheap structural grid-span migration independently.
 try{ if(details) repairRabbitMirrorPersistedExclusiveGridSpan(details); }catch(error){ console.debug('[RabbitMirror] persisted stacked-grid migration skipped:',error); }
 }
 // General layout rescue remains explicit Maintenance Rabbit work. The only
 // automatic write here is the guarded Safari auto-root correction scheduled
 // once after a pure-external mirror is actually opened.
 if(host.dataset?.rmFavorite==='true' || host.dataset?.rmSource==='favorite'){
  host.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-face-swipe-host], [data-rm-face-swipe-bar], [data-rm-face-favorite-star]').forEach(node=>node.remove());
 }else{
  try{ refreshRabbitMirrorToolsInScope(host,{historyRestoreLight}); }catch(error){ console.debug('[RabbitMirror] external tool preparation skipped:',error); }
 }
 removeIndependentResayButtons(host);
}

export function readyDetailsFromHost(host){
 // The product lock may only trust an explicitly completed host. A loading
  // host can still contain the previous A during a manual resay, and a fresh
  // placeholder contains enough text to fool a generic DOM-content check.
 return completeReadyFaceDetails(host,host?.__rabbitMirrorIndependentSource||'')[0]||null;
}

export function mountedIndependentReadyHostMatchesObserved(host,ctx,index,msg,observed,key=''){
 if(!readyDetailsFromHost(host) || !observed) return false;
 const dataset=host.dataset||{};
 const expectedChat=chatKey(ctx);
 const expectedMesid=String(Number(index));
 const expectedSwipe=String(swipeId(msg));
 const expectedKey=String(key||recordKey(ctx,index,msg));
 const expectedSourceHash=String(observed.sourceHash||'');
 return String(dataset.rmOwnerChat||'')===expectedChat
  && String(dataset.rmOwnerMesid ?? dataset.rmExternalOwnerMessage ?? '')===expectedMesid
  && String(dataset.rmOwnerSwipe ?? '')===expectedSwipe
  && String(dataset.rmKey||'')===expectedKey
  && !!expectedSourceHash
  && String(dataset.rmSourceHash||'')===expectedSourceHash;
}

export function mountedIndependentErrorHostMatchesObserved(host,ctx,index,msg,observed,key=''){
 if(!host?.isConnected || host.dataset?.rmSource!=='independent' || host.dataset?.rmState!=='error' || !host.querySelector?.(':scope > details') || !observed) return false;
 const dataset=host.dataset||{};
 const expectedChat=chatKey(ctx);
 const expectedMesid=String(Number(index));
 const expectedSwipe=String(swipeId(msg));
 const expectedKey=String(key||recordKey(ctx,index,msg));
 const expectedSourceHash=String(observed.sourceHash||'');
 return String(dataset.rmOwnerChat||'')===expectedChat
  && String(dataset.rmOwnerMesid ?? dataset.rmExternalOwnerMessage ?? '')===expectedMesid
  && String(dataset.rmOwnerSwipe ?? '')===expectedSwipe
  && String(dataset.rmKey||'')===expectedKey
  && !!expectedSourceHash
  && String(dataset.rmSourceHash||'')===expectedSourceHash;
}

export function mountedIndependentReadyHostSharesStableOwner(host,ctx,index,msg){
 if(!readyDetailsFromHost(host)) return false;
 const dataset=host.dataset||{};
 return String(dataset.rmOwnerChat||'')===chatKey(ctx)
  && String(dataset.rmOwnerMesid ?? dataset.rmExternalOwnerMessage ?? '')===String(Number(index))
  && String(dataset.rmOwnerSwipe ?? '')===String(swipeId(msg));
}

export function passiveIndependentFailureForIdentity(ctx,index,msg,host=null){
 // A translation/postprocessor can replace mes after the failed request has
 // settled. Recover its error by the already-owned operation, never by granting
 // the replacement body a new generation authorization or completion record.
 if(!isRabbitMirrorEligibleAssistantMessage(msg)) return null;
 const baseSlot=messageBaseSlotKey(ctx,index,msg);
 const cutover=automaticGenerationCutovers.get(chatKey(ctx));
 if(!cutover || cutover.activeHostGeneration || activeIndependentFlightForBase(baseSlot)) return null;
 if(host){
  const data=host.dataset||{};
  if(!host.isConnected || data.rmSource!=='independent' || data.rmState!=='error'
   || String(data.rmOwnerChat||'')!==chatKey(ctx)
   || String(data.rmOwnerMesid ?? data.rmExternalOwnerMessage ?? '')!==String(Number(index))
   || String(data.rmOwnerSwipe ?? '')!==String(swipeId(msg))) return null;
 }
 const epoch=operationEpochForBase(baseSlot);
 let failure=null;
 // The existing transient failure map is capped at 320. This scan runs only on
 // missing/error UI, not READY content, and adds no store, history read or timer.
 for(const value of automaticFailureStops.values()){
  if(value?.baseSlot===baseSlot && value.operationEpoch===epoch && value.slot && value.sourceHash) failure=value;
 }
 if(!failure || !failure.cutoverToken || failure.cutoverToken!==cutover.failureRecoveryToken) return null;
 if(host && (String(host.dataset.rmKey||'')!==failure.slot || String(host.dataset.rmSourceHash||'')!==failure.sourceHash)) return null;
 const authorization=cutover.authorized?.get?.(Number(index));
 if(authorization!==failure.authorization
  || hasExplicitSourceReplacementEvidence(ctx,index,msg,host)) return null;
 return failure;
}

export function restorePassiveIndependentFailure(ctx,index,msg,host,failure){
 // Called synchronously only after passiveIndependentFailureForIdentity proves
 // ownership. An already-clean error needs neither a second scan nor rearming
 // tools/layout; syncMessages performs the existing placement below.
 if(!failure) return null;
 const el=messageElement(Number(index)); if(!el) return null;
 const restored=host || ensureExternalUi(el,failure.slot,failure.message,'error','independent',failure.sourceHash);
 if(!restored) return null;
 // Keep the original request identity/diagnosis. Only the explicit retry action
 // may resolve this proven terminal error to the current translated body.
 if(restored.hidden) restored.hidden=false;
 if(restored.dataset?.rmAwaitingFreshSource || restored.dataset?.rmFreshSourceStatus) clearExternalHostFreshSourceState(restored);
 return restored;
}

export function hasExplicitSourceReplacementEvidence(ctx,index,msg,readyHost=null){
 const cutover=automaticGenerationCutovers.get(chatKey(ctx));
 const normalized=Number(index);
 if(!cutover || !Number.isInteger(normalized) || normalized<0) return false;
 const owner=cutover.activeHostGeneration;
 if(owner
  && String(owner.chat||'')===chatKey(ctx)
  && owner.startTailRole==='assistant'
  && ['continue','swipe','regenerate'].includes(String(owner.type||''))
  && Number(owner.startTailIndex)===normalized) return true;
 const authorization=cutover.authorized?.get?.(normalized);
 if(!authorization) return false;
 const readySourceHash=String(readyHost?.dataset?.rmSourceHash||'');
 const baseSlot=messageBaseSlotKey(ctx,normalized,msg);
 const lock=ownerLockForBase(baseSlot);
 const persisted=persistedOwnerForMessage(ctx,normalized,msg);
 const timestamps=[];
 if(lock && (!readySourceHash || String(lock.sourceHash||'')===readySourceHash || String(lock.slot||'')===String(readyHost?.dataset?.rmKey||''))) timestamps.push(Number(lock.ts)||0);
 if(persisted && (!readySourceHash || String(persisted.sourceHash||persisted.bodyHash||'')===readySourceHash)) timestamps.push(Number(persisted.ts)||0);
 const readyTs=Math.max(0,...timestamps);
 if(readyTs>0) return Number(authorization.ts||0)>readyTs;
 const token=automaticCutoverVersionToken(msg);
 return !!token
  && String(authorization.token||'')===token
  && !!readySourceHash
  && readySourceHash!==messageSourceFingerprint(msg);
}

export function readyRecordFromHost(host,observed,model=''){
 const batch=completeReadyFaceDetails(host,host?.__rabbitMirrorIndependentSource||'');
 const details=batch[0]||null;
 if(!details || !observed) return null;
 const clone=details.cloneNode(true);
 clone.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
 clone.removeAttribute?.(DEFERRED_INTERACTION_RESCUE_ATTR);
 // Never persist device/container-specific layout rescue state. It must be recalculated
 // from the next mounted container instead of leaking from phone -> desktop or vice versa.
 stripIndependentTransientLayoutArtifacts(clone);
 const html=batch.length>1 ? serializeExternalFaceDetails(host) : String(clone.outerHTML||'').trim();
 if(!independentStoredHtmlRestorable(html)) return null;
 return {html,sourceHash:String(host?.dataset?.rmSourceHash||observed.sourceHash||''),bodyHash:String(observed.bodyHash||''),displayHash:String(observed.displayHash||''),reasoningHash:String(observed.reasoningHash||''),ts:Date.now(),model:String(model||''),runtime:RUNTIME_VERSION,recoveredFromMountedHost:true};
}

export function transferExternalTools(fromDetails,toDetails){
 const tools=externalToolHost(fromDetails);
 const summary=toDetails?.querySelector?.(':scope > summary');
 if(tools&&summary) summary.appendChild(tools);
}

function rabbitMirrorSummaryText(details){
 const summary=details?.querySelector?.(':scope > summary');
 if(!summary) return '';
 const clone=summary.cloneNode(true);
 clone.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay]')?.forEach(node=>node.remove());
 return String(clone.textContent||'').replace(/\s+/g,' ').trim();
}

export function isRabbitMirrorDetails(details){
 if(!details || details.tagName!=='DETAILS') return false;
 return /兔子镜|RabbitMirror/i.test(rabbitMirrorSummaryText(details));
}

export function inlineRabbitMirrorDetails(el){
 const body=messageBody(el);
 if(!body?.querySelectorAll) return [];
 return [...body.querySelectorAll('details')].filter(details=>{
  if(details.closest?.(`[${SOURCE_ATTR}]`)) return false;
  if(details.parentElement?.closest?.('details')) return false;
  return isRabbitMirrorDetails(details);
 });
}

export function mirrorSemanticFingerprint(details){
 if(!isRabbitMirrorDetails(details)) return '';
 const clone=details.cloneNode(true);
 clone.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay], [data-rabbit-mirror-resay-status]')?.forEach(node=>node.remove());
 const text=String(clone.textContent||'').replace(/\s+/g,' ').trim();
 if(text.length<12) return '';
 const counts=[
  clone.querySelectorAll?.('input')?.length||0,
  clone.querySelectorAll?.('label')?.length||0,
  clone.querySelectorAll?.('button')?.length||0,
  clone.querySelectorAll?.('svg,img,canvas,video,audio,iframe')?.length||0,
 ];
 return hashText(`${text}|${counts.join(':')}`);
}

function cleanupVacatedInlineMirrorContainer(parent){
 if(!parent || parent.tagName!=='TOTO') return;
 const meaningful=[...parent.childNodes].some(node=>{
  if(node.nodeType===Node.TEXT_NODE) return !!String(node.textContent||'').trim();
  if(node.nodeType!==Node.ELEMENT_NODE) return false;
  if(node.hasAttribute?.(FOLLOW_ORIGIN_ATTR)) return true;
  if(['STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node.tagName)) return false;
  return true;
 });
 if(!meaningful) parent.remove();
}

export function removeInlineMirrorDuplicate(details){
 const parent=details?.parentElement||null;
 details?.remove?.();
 cleanupVacatedInlineMirrorContainer(parent);
}

function inlineMirrorMatchesExternalHost(details,host,key=''){
 if(!details||!host) return false;
 const ownerKey=String(details.dataset?.rabbitMirrorOwnerKey||details.dataset?.rabbitMirrorExternalOwner||'');
 if(ownerKey && String(key||host.dataset.rmKey||'')===ownerKey) return true;
 const external=host.querySelector?.(':scope > details');
 const inlineFingerprint=mirrorSemanticFingerprint(details);
 const externalFingerprint=mirrorSemanticFingerprint(external);
 return !!(inlineFingerprint && externalFingerprint && inlineFingerprint===externalFingerprint);
}

function mirrorFingerprintSet(detailsList=[]){
 return detailsList.map(mirrorSemanticFingerprint).filter(Boolean).sort();
}

function sameMirrorFingerprintSet(left=[],right=[]){
 const a=mirrorFingerprintSet(left),b=mirrorFingerprintSet(right);
 return a.length===left.length && b.length===right.length && a.length===b.length && a.every((value,index)=>value===b[index]);
}

export function removeIndependentInlineDuplicates(el,host,key=''){
 if(!el||!host||host.dataset.rmSource!=='independent') return 0;
 const externalFaces=completeReadyFaceDetails(host,host.__rabbitMirrorIndependentSource||'');
 const inlineFaces=inlineRabbitMirrorDetails(el);
 if(externalFaces.length>1 && !sameMirrorFingerprintSet(inlineFaces,externalFaces)) return 0;
 let removed=0;
 for(const details of inlineFaces){
  if(!inlineMirrorMatchesExternalHost(details,host,key)) continue;
  removeInlineMirrorDuplicate(details);
  removed+=1;
 }
 return removed;
}

export function removeExternalDuplicatesPreferInline(el){
 const inline=inlineRabbitMirrorDetails(el);
 if(!inline.length) return 0;
 const fingerprints=new Set(inline.map(mirrorSemanticFingerprint).filter(Boolean));
 let removed=0;
 for(const host of externalHosts(el)){
  const externalFaces=completeReadyFaceDetails(host,host.__rabbitMirrorIndependentSource||'');
  if(externalFaces.length>1 && !sameMirrorFingerprintSet(inline,externalFaces)) continue;
  const fingerprint=mirrorSemanticFingerprint(host.querySelector?.(':scope > details'));
  if(!fingerprint || !fingerprints.has(fingerprint)) continue;
  const parent=host.parentElement;
  host.remove();
  if(parent?.hasAttribute?.(INLINE_ANCHOR_ATTR) && !parent.querySelector?.(`[${SOURCE_ATTR}]`)) parent.remove();
  if(parent?.hasAttribute?.(FOLLOW_EXTERNAL_ANCHOR_ATTR) && !parent.querySelector?.(`[${SOURCE_ATTR}]`)) parent.remove();
  removed+=1;
 }
 return removed;
}

// Only locally created controls carry quick-action authority. Markup attributes
// alone never authorize a request, and waiting clicks use the automatic lease.

function quickActionOwner(ctx,index,msg){
 return {chat:ctx.chat,chatKey:chatKey(ctx),index,message:msg,swipe:swipeId(msg),
  token:automaticCutoverVersionToken(msg),base:messageBaseSlotKey(ctx,index,msg),
  epoch:operationEpochForBase(messageBaseSlotKey(ctx,index,msg))};
}

export function quickActionOwnerCurrent(owner){
 const ctx=getContext(),msg=ctx.chat?.[owner?.index];
 return !!(owner && currentRuntime() && runtimeMode()==='independent'
  && ctx.chat===owner.chat && chatKey(ctx)===owner.chatKey && msg===owner.message
  && swipeId(msg)===owner.swipe && automaticCutoverVersionToken(msg)===owner.token
  && operationEpochForBase(owner.base)===owner.epoch);
}

export function quickWaitingCandidate(ctx,index){
 if(!automaticIndependentTiming()) return false;
 const msg=ctx.chat?.[index];
 if(!isRabbitMirrorEligibleAssistantMessage(msg)||!String(msg.mes||'').trim()) return false;
 const base=messageBaseSlotKey(ctx,index,msg);
 if(activeIndependentFlightForBase(base)||automaticDispatchAlreadyConsumed(base)||hasExistingFollowRabbitMirror(ctx,index,msg)) return false;
 if(!suppressesAutomaticGeneration(ctx,index)) return true;
 const owner=automaticGenerationCutovers.get(chatKey(ctx))?.activeHostGeneration;
 return automaticHostGenerationRenderMatches(ctx,index,owner)
  && deferredIndependentGenerationIntents().some(intent=>!!boundIndependentIntentOwner(intent,ctx,index));
}

function installQuickStartButton(host,body){
 const ctx=getContext(),index=messageIndexForExternalHost(host),msg=ctx.chat?.[index];
 if(!body||!quickWaitingCandidate(ctx,index)) return;
 const owner=quickActionOwner(ctx,index,msg);quickStartOwners.add(owner);
 const button=document.createElement('button');button.type='button';
 button.setAttribute('data-rm-quick-generate','true');button.setAttribute(RESAY_ATTR,'true');
 quickStartButtonOwners.set(button,owner);
 button.textContent='正文已出，立即生成';
 button.title='跳过自动等待，立即发送本轮尚未发送的副 API 请求';
 button.addEventListener('click',event=>{
  event.preventDefault();event.stopPropagation();
  if(!button.isConnected||!host.contains(button)||host.dataset.rmReplyGenerationPlaceholder!=='true'
   ||host.dataset.rmState!=='loading'||!quickActionOwnerCurrent(owner)) return;
  if(activeIndependentFlightForBase(owner.base)||automaticDispatchAlreadyConsumed(owner.base)) return;
  if(!quickWaitingCandidate(getContext(),index)) return;
  const pollKey=generationPollKey(index),poll=generationPolls.get(pollKey);
  if(poll){poll.cancelled=true;clearTimeout(poll.timer);generationPolls.delete(pollKey);}
  const hostOperation=automaticGenerationCutovers.get(owner.chatKey)?.activeHostGeneration;
   if(hostOperation) hostOperation.quickStartOwner=owner;
  for(const intent of deferredIndependentGenerationIntents()){
   const proof=boundIndependentIntentOwner(intent,getContext(),index);
   if(proof){quickIntentOwners.set(proof,owner);(owner.intentIds??=new Set()).add(intent.id);}
  }
  button.disabled=true;
  void generateFor(index,msg,false,true,null,null,null,null,owner);
 },true);
 body.append(document.createElement('br'),button);
}

export function prepareQuickResay(root,owner={}){
 const identity=resolveIndependentActionIdentity(root,owner);
 if(!identity || identity.host?.dataset.rmState!=='ready') return null;
 const proof=quickActionOwner(identity.ctx,identity.index,identity.msg);
 return ()=>{
  if(!root?.isConnected || !quickActionOwnerCurrent(proof)
   || identity.host?.dataset.rmState!=='ready') return false;
  if(activeIndependentFlightForBase(proof.base)) return true;
  if(!resolveIndependentActionIdentity(root,owner)) return false;
  return resayIndependentMirror(root,owner);
 };
}


export function setPlaceholderSummary(details,text){
 const summary=details?.querySelector?.(':scope > summary');
 if(!summary) return;
 let label=summary.querySelector?.(':scope > [data-rabbit-mirror-external-summary-label]');
 if(!label){
   label=document.createElement('span');
   label.setAttribute('data-rabbit-mirror-external-summary-label','true');
   const tools=externalToolHost(details);
   for(const node of [...summary.childNodes]) if(node!==tools) node.remove();
   summary.insertBefore(label,tools||null);
 }
 label.textContent=text;
}

export function ensureReplyGenerationPlaceholder(el,key,sourceHash='',waitingForBody=true){
 const message=waitingForBody
  ? '正文回复完成后会自动生成兔子镜。'
  : '正文已经完成，正在生成这条回复对应的兔子镜。';
 const existing=externalHosts(el).find(node=>node.dataset.rmKey===key && node.dataset.rmState==='loading' && node.dataset.rmReplyGenerationPlaceholder==='true');
 const host=existing||ensureExternalUi(el,key,message,'loading','independent',sourceHash);
 if(!host) return null;
 host.dataset.rmReplyGenerationPlaceholder='true';
 clearExternalHostFreshSourceState(host);
 host.dataset.rmState='loading';
 if(sourceHash) host.dataset.rmSourceHash=String(sourceHash);
 const details=host.querySelector?.(':scope > details');
 setPlaceholderSummary(details,waitingForBody?'【兔子镜：等待正文完成……】':'【兔子镜：正在生成中……】');
 let body=details?.querySelector?.(':scope > .rabbit-mirror-external-placeholder-body');
 if(details && !body){ body=document.createElement('div'); body.className='rabbit-mirror-external-placeholder-body'; details.append(body); }
 if(body){
  const button=body.querySelector('[data-rm-quick-generate="true"]'),owner=quickStartButtonOwners.get(button);
  if(button && quickActionOwnerCurrent(owner) && quickWaitingCandidate(getContext(),owner.index)){
   if(body.firstChild?.nodeType===3 && body.firstChild.textContent!==message) body.firstChild.textContent=message;
  }else{body.textContent=message;installQuickStartButton(host,body);}
 }
 return host;
}

export function renderExternalErrorBody(details,text=''){
 if(!details) return null;
 let body=details.querySelector(':scope > .rabbit-mirror-external-placeholder-body');
 if(!body){ body=document.createElement('div'); body.className='rabbit-mirror-external-placeholder-body'; details.append(body); }
 body.replaceChildren();
 const message=document.createElement('div');
 message.className='rabbit-mirror-external-error-message';
 message.textContent=String(text||'独立 API 生成失败。');
 body.append(message);
 const actions=document.createElement('div');
 actions.className='rabbit-mirror-external-error-actions';
 const retry=document.createElement('button');
 retry.type='button';
 retry.className='rabbit-mirror-external-error-action rabbit-mirror-external-error-retry';
 retry.textContent='↻ 重新生成兔子镜';
 retry.setAttribute('data-rm-external-error-retry','true');
 retry.addEventListener('click',event=>{
  event.preventDefault(); event.stopPropagation();
  // A queued compatibility click may outlive this error body. It is not a
  // second retry intent after the first click has entered loading or READY.
  const host=details.closest?.(`[${SOURCE_ATTR}="true"]`);
  if(!retry.isConnected || !details.contains?.(retry) || host?.dataset?.rmState!=='error') return;
  if(!resayIndependentMirror(details,{})) globalThis.toastr?.warning?.('没有找到这条回复对应的副 API 兔子镜。');
 },true);
 const cat=document.createElement('button');
 cat.type='button';
 cat.className='rabbit-mirror-external-error-action rabbit-mirror-external-error-cat';
 cat.textContent='🐈 打开挨打猫';
 cat.setAttribute('data-rm-external-error-cat','true');
 cat.addEventListener('click',event=>{
  event.preventDefault(); event.stopPropagation();
  const host=details.closest?.(`[${SOURCE_ATTR}][data-rm-source="independent"]`);
  if(host) ensureExternalTools(host);
  const feedback=details.querySelector?.('[data-rabbit-mirror-feedback-cat]') || host?.querySelector?.('[data-rabbit-mirror-feedback-cat]');
  if(feedback){ feedback.click(); return; }
  globalThis.toastr?.warning?.('挨打猫当前未启用，可先使用“重新生成兔子镜”。');
 },true);
 actions.append(retry,cat);
 body.append(actions);
 details.setAttribute('open','');
 return body;
}

export function fallbackExternalDetails(state,text=''){
 const details=document.createElement('details');
 details.className='rabbit-mirror-external-placeholder';
 const summary=document.createElement('summary');
 const label=document.createElement('span');
 label.setAttribute('data-rabbit-mirror-external-summary-label','true');
 label.textContent=state==='manual'?'【兔子镜：等待手动生成】':state==='loading'?'【兔子镜：正在生成中……】':'【兔子镜：生成失败】';
 summary.append(label);
 details.append(summary);
 if(state==='error') renderExternalErrorBody(details,text);
 else if(text){
   const body=document.createElement('div');
   body.className='rabbit-mirror-external-placeholder-body';
   body.textContent=text;
   details.append(body);
 }
 return details;
}


export function buildExternalHost(key,html,state,source,locallyPrepared=false){
 const host=document.createElement('div');
 host.setAttribute(SOURCE_ATTR,'true');
 host.setAttribute(EXTERNAL_SHELL_ATTR,'true');
 host.className='rabbit-mirror-external-host rabbit-mirror-external-shell';
 host.dataset.rmKey=key;
 host.dataset.rmSource=source;
 host.dataset.rmState=state;
 if(state==='ready' && hasMultifaceMarkup(html)){
  if(mountExternalFaceDetails(host,key,source,html,{locallyPrepared})) return host;
  return buildExternalHost(key,'多面结果未通过完整性检查；本轮不会自动补发请求。','error',source);
 }
 const details=state==='ready'
  ? extractReadyDetails(html,locallyPrepared)
  : fallbackExternalDetails(state,html);
 if(!details) return buildExternalHost(key,'独立 API 已返回内容，但没有找到完整的兔子镜 <details>。','error',source);
 details.removeAttribute('open');
 markExternalDetails(details,key,source);
 host.append(details);
 return host;
}

export function usableReadyDetails(details){
 if(!details || details.tagName!=='DETAILS') return false;
 // Loading/error shells are structural placeholders, never completed mirrors.
 // Treating their summary/body text as a usable result makes the A/B product
 // lock return before the independent API request is even sent.
 if(details.classList?.contains('rabbit-mirror-external-placeholder')) return false;
 if(details.hasAttribute?.('data-rabbit-mirror-placeholder')) return false;
 const summary=details.querySelector?.(':scope > summary');
 if(!summary || !String(summary.textContent||'').trim()) return false;
 return [...details.childNodes].some(node=>{
  if(node===summary) return false;
  if(node.nodeType===Node.TEXT_NODE) return !!String(node.textContent||'').trim();
  if(node.nodeType!==Node.ELEMENT_NODE) return false;
  if(['STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node.tagName)) return false;
  if(node.hidden || String(node.getAttribute?.('aria-hidden')||'').toLowerCase()==='true') return false;
  const inline=String(node.getAttribute?.('style')||'').toLowerCase();
  if(/(?:^|;)\s*display\s*:\s*none\b/.test(inline) || /(?:^|;)\s*visibility\s*:\s*hidden\b/.test(inline)) return false;
  return !!(String(node.textContent||'').trim() || node.children?.length || node.matches?.('img,svg,canvas,video,audio,iframe,input,button,select,textarea,table,ul,ol,section,article,main,figure,form'));
 });
}

export function withRestorableHtmlCacheBatch(run){
 if(typeof run!=='function') return undefined;
 if(activeRestorableHtmlCache) return run();
 activeRestorableHtmlCache=new Map();
 try{ return run(); }
 finally{ activeRestorableHtmlCache=null; }
}

export function independentStoredHtmlLightRestorable(html=''){
 const source=String(html||'').trim();
 if(!source || byteLength(source)>INDEPENDENT_HTML_BUDGET_BYTES) return false;
 try{ assertIndependentMarkupComplexity(source); }catch{return false;}
 if(hasMultifaceMarkup(source)){
  const parsed=parseMultifaceOutput(source);
  return parsed.ok && parsed.faces.every(face=>independentStoredHtmlLightRestorable(face.inner));
 }
 return /<details\b[^>]*>[\s\S]*?<summary\b[^>]*>[\s\S]*?<\/summary\s*>[\s\S]*?<\/details\s*>/i.test(source)
  && !/class\s*=\s*["'][^"']*rabbit-mirror-external-placeholder|data-rabbit-mirror-placeholder/i.test(source);
}

export function independentStoredHtmlRestorable(html=''){
 const source=String(html||'').trim();
 if(!source) return false;
 if(!independentStoredHtmlLightRestorable(source)) return false;
 if(activeRestorableHtmlCache?.has(source)) return activeRestorableHtmlCache.get(source)===true;
 if(hasMultifaceMarkup(source)){
  const parsed=parseMultifaceOutput(source);
  const valid=parsed.ok && parsed.faces.every(face=>independentStoredHtmlRestorable(face.inner));
  activeRestorableHtmlCache?.set(source,valid);
  return valid;
 }
 let result=false;
 try{
  const template=document.createElement('template');
  template.innerHTML=source;
  const details=template.content.querySelector('details');
  if(details && details.tagName==='DETAILS'
   && !details.classList?.contains('rabbit-mirror-external-placeholder')
   && !details.hasAttribute?.('data-rabbit-mirror-placeholder')){
   const summary=details.querySelector?.(':scope > summary');
   if(summary && String(summary.textContent||'').trim()){
    // Historical mirrors often keep their real body hidden until a checkbox,
    // radio, tab or script reveals it. Persistence recovery must therefore be
    // deliberately more permissive than validation of a brand-new API result.
    result=[...details.childNodes].some(node=>{
     if(node===summary) return false;
     if(node.nodeType===Node.TEXT_NODE) return !!String(node.textContent||'').trim();
     if(node.nodeType!==Node.ELEMENT_NODE) return false;
     return !['STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node.tagName);
    }) || String(details.innerHTML||'').length>120;
   }
  }
 }catch{ result=/<details\b[\s\S]*?<summary\b[\s\S]*?<\/summary>[\s\S]*?<\/details>/i.test(source); }
 if(activeRestorableHtmlCache) activeRestorableHtmlCache.set(source,!!result);
 return !!result;
}

export function historyRecoveryForObserved(slot,observed,{lightweight=false}={}){
 const valid=html=>lightweight ? independentStoredHtmlLightRestorable(html) : independentStoredHtmlRestorable(html);
 for(const candidate of slotSearchKeys(slot,observed?.legacySlots||[])){
  const entries=historyEntriesForSlot(candidate);
  const matched=entries.find(entry=>savedRecordMatchesObserved(entry,observed) && valid(entry.html))
   || entries.find(entry=>String(entry?.bodyHash||'') && String(entry.bodyHash)===String(observed?.bodyHash||'') && (!observed?.displayHash || String(entry?.displayHash||'')===String(observed.displayHash)) && valid(entry.html));
  if(matched){
   // Interaction-state normalization is a full HTML parse/serialization pass.
   // Keep it out of CHAT_CHANGED; hydration of the one requested mirror still
   // runs the ordinary full pipeline before it becomes interactive.
   return lightweight ? matched : (interactionStatePollutionScore(matched.html)>0 ? normalizeSavedInteractionRecord(matched,candidate) : matched);
  }
 }
 return null;
}

export function recoverSavedRecord(store,slot,observed,{lightweight=false}={}){
 const valid=html=>lightweight ? independentStoredHtmlLightRestorable(html) : independentStoredHtmlRestorable(html);
 const exact=store?.[slot];
 if(exact?.html && valid(exact.html)) return {saved:exact,storeChanged:false,recoveredFromHistory:false};
 const saved=findSavedRecord(store,slot,observed?.legacySlots||[]);
 if(saved?.html && valid(saved.html) && savedRecordMatchesObserved(saved,observed)){
  if(exact!==saved){
   const recovered={...saved,ts:Number(saved.ts||Date.now()),runtime:String(saved.runtime||RUNTIME_VERSION),recoveredFromHistory:false};
   // A cold historical entry is read-only. Copying every legacy alias into the
   // local current-output store would stringify/write the whole store during
   // chat entry and defeats the lightweight boundary.
   if(!lightweight){ saveRecordForSlot(store,slot,recovered); return {saved:recovered,storeChanged:true,recoveredFromHistory:false}; }
   return {saved:recovered,storeChanged:false,recoveredFromHistory:false};
  }
  return {saved,storeChanged:false,recoveredFromHistory:false};
 }
 const history=historyRecoveryForObserved(slot,observed,{lightweight});
 if(history?.html){
  const recovered={...history,ts:Number(history.ts||Date.now()),runtime:String(history.runtime||RUNTIME_VERSION),recoveredFromHistory:true};
  if(!lightweight){ saveRecordForSlot(store,slot,recovered); return {saved:recovered,storeChanged:true,recoveredFromHistory:true}; }
  return {saved:recovered,storeChanged:false,recoveredFromHistory:true};
 }
 // Never erase a persisted historical mirror merely because a newer runtime
 // cannot classify its old structure. Leave the record intact for a future
 // migration instead of turning an update into destructive data loss.
 return {saved:null,storeChanged:false,recoveredFromHistory:false};
}

function readyDetailsVisuallyCollapsed(details){
 if(!details?.isConnected) return false;
 const summary=details.querySelector?.(':scope > summary');
 if(!summary) return true;
 try{
  if(details.hidden || summary.hidden) return false;
  const style=getComputedStyle(summary);
  if(style.display==='none' || style.visibility==='hidden') return true;
  const rect=summary.getBoundingClientRect();
  return rect.height>0 && rect.height<8;
 }catch{return false;}
}

function replaceReadyDetailsFromSaved(host,key,source,html,sourceHash='',wasOpen=false,locallyPrepared=false){
 if(hasMultifaceMarkup(html)){
  if(!mountExternalFaceDetails(host,key,source,html,{wasOpen,locallyPrepared})) return false;
  host.dataset.rmState='ready';
  if(sourceHash) host.dataset.rmSourceHash=String(sourceHash);
  ensureExternalTools(host);
  return true;
 }
 const next=extractReadyDetails(html,locallyPrepared);
 if(!usableReadyDetails(next)) return false;
 markExternalDetails(next,key,source);
 if(wasOpen) next.setAttribute('open',''); else next.removeAttribute('open');
 const current=host.querySelector?.(':scope > details');
 current?.replaceWith?.(next) || host.append(next);
 host.dataset.rmState='ready';
 if(sourceHash) host.dataset.rmSourceHash=String(sourceHash);
 ensureExternalTools(host);
 return true;
}

export function rebuildCollapsedReadyHost(el,host,key,source,html,sourceHash='',savedRecord=null){
 if(!host || !html) return host;
 const locallyPrepared=source==='independent' && savedRecord?.html===html;
 if(locallyPrepared){html=prepareStoredIndependentRecordHtml(savedRecord,key);if(!html)return host;}
 const currentFaces=externalFaceDetails(host);
 const readyFaces=completeReadyFaceDetails(host,html);
 if(!readyFaces.length){
  replaceReadyDetailsFromSaved(host,key,source,html,sourceHash,!!currentFaces[0]?.hasAttribute?.('open'),locallyPrepared);
  return host;
 }
 // This is a one-time mount-health probe. Re-reading computed style + layout for
 // every historical ready mirror on every sync creates a forced-layout wall in
 // long chats even when the exact same <details> DOM has already proved healthy.
 // A multiface host is healthy only after every direct sibling has proved healthy.
 const unverified=readyFaces.filter(details=>!verifiedReadyDetailsVisualHealth.has(details));
 if(!unverified.length) return host;
 if(!unverified.some(readyDetailsVisuallyCollapsed)){
  for(const details of unverified) verifiedReadyDetailsVisualHealth.add(details);
  return host;
 }
 if(host.__rabbitMirrorCollapsedRecoveryTimer) clearTimeout(host.__rabbitMirrorCollapsedRecoveryTimer);
 const expected=[...readyFaces];
 host.__rabbitMirrorCollapsedRecoveryTimer=setTimeout(()=>{
  host.__rabbitMirrorCollapsedRecoveryTimer=0;
  if(!currentRuntime() || !host.isConnected) return;
  const live=completeReadyFaceDetails(host,html);
  if(live.length!==expected.length || live.some((details,index)=>details!==expected[index])) return;
  const liveUnverified=live.filter(details=>!verifiedReadyDetailsVisualHealth.has(details));
  if(!liveUnverified.some(readyDetailsVisuallyCollapsed)){
   for(const details of liveUnverified) verifiedReadyDetailsVisualHealth.add(details);
   return;
  }
  replaceReadyDetailsFromSaved(host,key,source,html,sourceHash,!!live[0]?.hasAttribute?.('open'),locallyPrepared);
 },120);
 return host;
}

export function collapseDuplicateIdentityHosts(el,key,source='independent',sourceHash=''){
 const currentChat=chatKey(getContext());
 const local=externalHosts(el).filter(node=>node.dataset.rmSource===source);
 // Display-mode changes used to leave the old pure-external host behind while
 // creating a second inline host. Include every same-key host from the current
 // chat, even when an older build failed to stamp the latest owner placement.
 const byIdentity=externalHostsByIdentityKey(key,source,currentChat);
 const candidates=[...new Set([...local,...byIdentity])];
 if(candidates.length<2) return candidates[0]||null;
 const score=node=>{
  let n=0;
  if(node.dataset.rmKey===key) n+=8;
  if(sourceHash && node.dataset.rmSourceHash===sourceHash) n+=6;
  if(node.dataset.rmState==='ready') n+=4;
  const completeFaces=completeReadyFaceDetails(node,node.__rabbitMirrorIndependentSource||'');
  if(completeFaces.length) n+=4+Math.min(5,completeFaces.length);
  if(!node.hidden) n+=1;
  return n;
 };
 candidates.sort((a,b)=>score(b)-score(a));
 const keep=candidates[0];
 for(const node of candidates.slice(1)){
  const details=node.querySelector?.(':scope > details');
  const keepFaces=completeReadyFaceDetails(keep,keep.__rabbitMirrorIndependentSource||'');
  const nodeFaces=completeReadyFaceDetails(node,node.__rabbitMirrorIndependentSource||'');
  if(!keepFaces.length && nodeFaces.length && usableReadyDetails(details)){
   const faces=nodeFaces;
   keep.replaceChildren(...faces);
   keep.__rabbitMirrorIndependentSource=node.__rabbitMirrorIndependentSource;
   keep.__rabbitMirrorIndependentInitialSource=node.__rabbitMirrorIndependentInitialSource;
   keep.dataset.rmFaceCount=String(faces.length);
   keep.classList.toggle('rabbit-mirror-multiface-host',faces.length>1);
   stampExternalDetailsOwnership(keep);
  }
  node.remove();
 }
 return keep;
}

function clampShellChannel(value){ return Math.max(0,Math.min(255,Math.round(Number(value)||0))); }

export function parseExternalShellColor(token=''){
 const value=String(token||'').trim().toLowerCase();
 if(!value || value==='transparent' || value==='currentcolor' || value==='inherit' || value==='initial') return null;
 let match=value.match(/^#([0-9a-f]{3,8})$/i);
 if(match){
  let hex=match[1];
  if(hex.length===3 || hex.length===4) hex=[...hex].map(ch=>ch+ch).join('');
  if(hex.length!==6 && hex.length!==8) return null;
  return {r:parseInt(hex.slice(0,2),16),g:parseInt(hex.slice(2,4),16),b:parseInt(hex.slice(4,6),16),a:hex.length===8?parseInt(hex.slice(6,8),16)/255:1};
 }
 match=value.match(/^rgba?\(([^)]+)\)$/i);
 if(match){
  const parts=match[1].split(/[\s,\/]+/).filter(Boolean);
  if(parts.length<3) return null;
  const channel=part=>String(part).includes('%')?255*parseFloat(part)/100:parseFloat(part);
  const r=channel(parts[0]),g=channel(parts[1]),b=channel(parts[2]);
  const a=parts[3]===undefined?1:(String(parts[3]).includes('%')?parseFloat(parts[3])/100:parseFloat(parts[3]));
  if([r,g,b,a].some(Number.isNaN)) return null;
  return {r:clampShellChannel(r),g:clampShellChannel(g),b:clampShellChannel(b),a:Math.max(0,Math.min(1,a))};
 }
 match=value.match(/^hsla?\(([^)]+)\)$/i);
 if(match){
  const parts=match[1].split(/[\s,\/]+/).filter(Boolean);
  if(parts.length<3) return null;
  let h=((parseFloat(parts[0])%360)+360)%360/360;
  const saturation=Math.max(0,Math.min(1,parseFloat(parts[1])/100));
  const lightness=Math.max(0,Math.min(1,parseFloat(parts[2])/100));
  const a=parts[3]===undefined?1:(String(parts[3]).includes('%')?parseFloat(parts[3])/100:parseFloat(parts[3]));
  if([h,saturation,lightness,a].some(Number.isNaN)) return null;
  const hue=(p,q,t)=>{ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; };
  let r,g,b;
  if(saturation===0) r=g=b=lightness;
  else { const q=lightness<.5?lightness*(1+saturation):lightness+saturation-lightness*saturation; const p=2*lightness-q; r=hue(p,q,h+1/3); g=hue(p,q,h); b=hue(p,q,h-1/3); }
  return {r:clampShellChannel(r*255),g:clampShellChannel(g*255),b:clampShellChannel(b*255),a:Math.max(0,Math.min(1,a))};
 }
 return null;
}

function externalShellColorMetrics(color){
 const values=[color.r,color.g,color.b].map(value=>value/255);
 const max=Math.max(...values), min=Math.min(...values);
 return {luminance:(0.2126*color.r+0.7152*color.g+0.0722*color.b)/255,saturation:max===0?0:(max-min)/max};
}

function mixExternalShellColors(color,target={r:255,g:255,b:255},ratio=.5){
 const amount=Math.max(0,Math.min(1,ratio));
 return {r:clampShellChannel(color.r*(1-amount)+target.r*amount),g:clampShellChannel(color.g*(1-amount)+target.g*amount),b:clampShellChannel(color.b*(1-amount)+target.b*amount),a:1};
}

function externalShellRgba(color,alpha=1){ return `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.max(0,Math.min(1,alpha))})`; }

function externalShellColorDistance(a,b){ return Math.hypot(Number(a?.r||0)-Number(b?.r||0),Number(a?.g||0)-Number(b?.g||0),Number(a?.b||0)-Number(b?.b||0)); }

export function averageExternalShellColors(colors=[]){
 const valid=colors.filter(color=>color && color.a!==0);
 if(!valid.length) return null;
 const weight=valid.reduce((sum,color)=>sum+Math.max(.12,Number(color.a||1)),0);
 return {r:clampShellChannel(valid.reduce((sum,color)=>sum+color.r*Math.max(.12,Number(color.a||1)),0)/weight),g:clampShellChannel(valid.reduce((sum,color)=>sum+color.g*Math.max(.12,Number(color.a||1)),0)/weight),b:clampShellChannel(valid.reduce((sum,color)=>sum+color.b*Math.max(.12,Number(color.a||1)),0)/weight),a:1};
}

export function externalShellColorsFromText(value=''){
 const tokens=String(value||'').match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)||[];
 return tokens.map(parseExternalShellColor).filter(color=>color && color.a>=.12);
}

function resolveExternalShellCssVars(value='',variables=new Map()){
 return String(value||'').replace(/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]*))?\)/g,(_match,name,fallback)=>variables.get(name)||fallback||'');
}

function externalShellSourcePalette(html=''){
 const source=String(html||'');
 if(!source || typeof document==='undefined') return null;
 try{
  const template=document.createElement('template'); template.innerHTML=source;
  const details=template.content.querySelector('details'); if(!details) return null;
  const carrier=[...details.children].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node.tagName)) || details;
  const styles=[...details.querySelectorAll('style')].map(style=>String(style.textContent||'')).join('\n');
  const variables=new Map();
  for(const match of styles.matchAll(/(--[\w-]+)\s*:\s*([^;}{]+)/g)) variables.set(match[1],match[2].trim());
  const declarations=[];
  const addDeclarations=text=>{
   const sourceText=String(text||'');
   for(const match of sourceText.matchAll(/background(?:-color)?\s*:\s*([^;}{]+)/gi)) declarations.push(resolveExternalShellCssVars(match[1],variables));
   // Explicit background-color is the most reliable carrier color. Append it
   // after shorthand/gradient declarations so it wins the source fallback.
   for(const match of sourceText.matchAll(/background-color\s*:\s*([^;}{]+)/gi)) declarations.push(resolveExternalShellCssVars(match[1],variables));
  };
  addDeclarations(carrier.getAttribute?.('style')||'');
  const selectors=[];
  if(carrier.id) selectors.push(`#${carrier.id}`);
  for(const cls of [...carrier.classList]) selectors.push(`.${cls}`);
  selectors.push(String(carrier.tagName||'').toLowerCase());
  const rules=[...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  for(const rule of rules){
   const selector=String(rule[1]||'');
   if(selectors.some(token=>token && selector.includes(token))) addDeclarations(rule[2]);
  }
  if(!declarations.length){
   addDeclarations(details.getAttribute?.('style')||'');
   for(const rule of rules.slice(0,40)) addDeclarations(rule[2]);
  }
  for(let index=declarations.length-1;index>=0;index--){
   const colors=externalShellColorsFromText(declarations[index]);
   const base=averageExternalShellColors(colors);
   if(base){
    const paletteColors=[...colors,...externalShellColorsFromText(styles)].slice(0,240);
    return {base,colors:paletteColors,source:'matched-background'};
   }
  }
  return null;
 }catch{return null;}
}

function renderedExternalShellPaletteFromRoot(root,areaBase=0,rootNode=null){
 if(!root?.isConnected || typeof getComputedStyle!=='function') return null;
 let rootRect; try{ rootRect=root.getBoundingClientRect(); }catch{return null;}
 const rootArea=Math.max(1,areaBase || (Number(rootRect?.width||0)*Math.max(1,Number(rootRect?.height||0))));
 const rootElement=rootNode || root;
 const candidates=[];
 const elements=[root,...root.querySelectorAll?.('*')||[]];
 for(const element of elements.slice(0,260)){
  if(!element?.isConnected || ['STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(element.tagName)) continue;
  if(element.closest?.('[data-rabbit-mirror-tool-entry-host]')) continue;
  let style,rect; try{ style=getComputedStyle(element); rect=element.getBoundingClientRect(); }catch{continue;}
  if(style.display==='none' || style.visibility==='hidden' || Number(style.opacity||1)<.08) continue;
  const rectArea=Math.max(0,Number(rect?.width||0))*Math.max(0,Number(rect?.height||0));
  const background=parseExternalShellColor(style.backgroundColor);
  const gradientColors=externalShellColorsFromText(style.backgroundImage);
  const gradient=averageExternalShellColors(gradientColors);
  let color=null;
  if(background && background.a>=.18) color=background;
  else if(gradient) color=gradient;
  if(!color) continue;
  let depth=0,current=element; while(current&&current!==rootElement&&depth<12){depth++;current=current.parentElement;}
  const coverage=Math.min(1.45,rectArea/rootArea);
  let score=coverage*8 + 3/(1+depth) + Math.min(1,Number(color.a||1));
  if(element===root) score+=2.8;
  if(element.tagName==='SUMMARY') continue;
  if(['SPAN','BUTTON','INPUT','LABEL','A','SVG','PATH'].includes(element.tagName)) score-=2.5;
  candidates.push({color,score,coverage,gradientColors});
 }
 if(!candidates.length) return null;
 candidates.sort((a,b)=>b.score-a.score);
 const base=candidates[0].color;
 const allColors=candidates.flatMap(item=>[item.color,...(item.gradientColors||[])]);
 return {base,colors:allColors,source:'rendered-background'};
}

function renderedExternalShellPalette(host){
 if(!host?.isConnected || typeof getComputedStyle!=='function') return null;
 const details=host.querySelector?.(':scope > details'); if(!details) return null;
 const visual=independentPrimaryVisualShell(details);
 if(visual?.element){
  const visualPalette=renderedExternalShellPaletteFromRoot(visual.element,Number(visual.area||0),visual.element);
  if(visualPalette?.base) return {...visualPalette,source:'rendered-primary-visual'};
 }
 return renderedExternalShellPaletteFromRoot(details,0,details);
}


function buildExternalShellTint(palette){
 const base=palette?.base; if(!base) return null;
 const metrics=externalShellColorMetrics(base);
 const black={r:0,g:0,b:0}, white={r:255,g:255,b:255};
 const accentCandidates=(palette.colors||[]).filter(color=>externalShellColorDistance(color,base)>=38 && externalShellColorMetrics(color).saturation>=.14);
 accentCandidates.sort((a,b)=>externalShellColorMetrics(b).saturation-externalShellColorMetrics(a).saturation);
 const secondary=accentCandidates[0]||null;
 if(metrics.luminance<.24){
  return {background:mixExternalShellColors(base,black,.08),highlight:mixExternalShellColors(base,white,.10),border:mixExternalShellColors(base,white,.24),shadow:mixExternalShellColors(base,black,.62),accent:secondary||mixExternalShellColors(base,white,.34),inner:mixExternalShellColors(base,white,.20),text:mixExternalShellColors(base,white,.86)};
 }
 if(metrics.luminance>.78){
  return {background:mixExternalShellColors(base,white,.03),highlight:mixExternalShellColors(base,white,.15),border:mixExternalShellColors(base,black,.17),shadow:mixExternalShellColors(base,black,.46),accent:secondary||mixExternalShellColors(base,black,.26),inner:white,text:mixExternalShellColors(base,black,.72)};
 }
 return {background:mixExternalShellColors(base,white,.04),highlight:mixExternalShellColors(base,white,.13),border:mixExternalShellColors(base,black,.16),shadow:mixExternalShellColors(base,black,.50),accent:secondary||mixExternalShellColors(base,black,.22),inner:mixExternalShellColors(base,white,.28),text:metrics.luminance<.52?mixExternalShellColors(base,white,.84):mixExternalShellColors(base,black,.76)};
}

function clearExternalShellTint(host){
 if(!host?.style) return;
 if(host.__rabbitMirrorShellTintFrame){ globalThis.cancelAnimationFrame?.(host.__rabbitMirrorShellTintFrame); host.__rabbitMirrorShellTintFrame=0; }
 if(host.__rabbitMirrorShellTintTimer){ clearTimeout(host.__rabbitMirrorShellTintTimer); host.__rabbitMirrorShellTintTimer=0; }
 host.removeAttribute('data-rm-shell-tinted');
 delete host.dataset.rmShellTintKey;
 delete host.dataset.rmShellPaletteSource;
 for(const property of ['--rm-shell-bg','--rm-shell-highlight','--rm-shell-border','--rm-shell-shadow','--rm-shell-accent','--rm-shell-inner-light','--rm-shell-text']) host.style.removeProperty(property);
}

function applyExternalShellTintPalette(host,palette){
 const tint=buildExternalShellTint(palette);
 if(!tint){ clearExternalShellTint(host); return false; }
 host.setAttribute('data-rm-shell-tinted','true');
 host.dataset.rmShellPaletteSource=String(palette?.source||'unknown');
 host.style.setProperty('--rm-shell-bg',externalShellRgba(tint.background,.99));
 host.style.setProperty('--rm-shell-highlight',externalShellRgba(tint.highlight,.97));
 host.style.setProperty('--rm-shell-border',externalShellRgba(tint.border,.88));
 host.style.setProperty('--rm-shell-shadow',externalShellRgba(tint.shadow,.28));
 host.style.setProperty('--rm-shell-accent',externalShellRgba(tint.accent,.58));
 host.style.setProperty('--rm-shell-inner-light',externalShellRgba(tint.inner,.42));
 host.style.setProperty('--rm-shell-text',externalShellRgba(tint.text,1));
 return true;
}

function externalShellContrastText(color){
 if(!color) return {r:36,g:36,b:36,a:1};
 const metrics=externalShellColorMetrics(color);
 return metrics.luminance<.48 ? {r:248,g:248,b:248,a:1} : {r:42,g:42,b:42,a:1};
}

function externalShellWideTopBand(root){
 if(!root?.isConnected || typeof getComputedStyle!=='function') return null;
 let rootRect; try{ rootRect=root.getBoundingClientRect(); }catch{return null;}
 const width=Math.max(1,Number(rootRect?.width||0));
 const height=Math.max(1,Number(rootRect?.height||0));
 const candidates=[];
 for(const element of [...root.querySelectorAll?.('header,div,section,nav')||[]].slice(0,120)){
  if(!element?.isConnected || element.closest?.('[data-rabbit-mirror-tool-entry-host]')) continue;
  let style,rect; try{ style=getComputedStyle(element); rect=element.getBoundingClientRect(); }catch{continue;}
  if(style.display==='none' || style.visibility==='hidden' || Number(style.opacity||1)<.08) continue;
  const w=Math.max(0,Number(rect?.width||0)), h=Math.max(0,Number(rect?.height||0));
  if(w<width*.58 || h<24 || h>Math.min(180,height*.34)) continue;
  const topOffset=(Number(rect?.top||0)-Number(rootRect?.top||0))/height;
  if(topOffset<-.03 || topOffset>.28) continue;
  const background=parseExternalShellColor(style.backgroundColor);
  const gradient=averageExternalShellColors(externalShellColorsFromText(style.backgroundImage));
  const color=(background&&background.a>=.22)?background:gradient;
  if(!color) continue;
  const metrics=externalShellColorMetrics(color);
  const coverage=Math.min(1.2,w/width);
  const score=coverage*4 + Math.max(0,1-topOffset*3) + metrics.saturation*2.2 + Math.min(1,h/90);
  candidates.push({color,score});
 }
 candidates.sort((a,b)=>b.score-a.score);
 return candidates[0]?.color||null;
}

function clearExternalShellIntegration(host){
 if(!host?.style) return;
 host.removeAttribute('data-rm-shell-integrated');
 for(const property of ['--rm-shell-surface','--rm-shell-header-bg','--rm-shell-header-text','--rm-shell-radius','--rm-shell-border-width']) host.style.removeProperty(property);
 host.querySelectorAll?.('[data-rm-shell-integrated-body="true"]').forEach(node=>node.removeAttribute('data-rm-shell-integrated-body'));
}

function applyExternalShellIntegration(host,palette=null){
 if(!host?.isConnected || host.dataset.rmSource!=='independent' || host.dataset.rmPlacement!=='external') return false;
 const details=host.querySelector?.(':scope > details[data-rabbit-mirror-external-details="true"], :scope > details');
 if(!details || typeof getComputedStyle!=='function') return false;
 const body=[...(details.children||[])].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node?.tagName));
 if(!body?.isConnected) return false;
 let bodyStyle=null; try{ bodyStyle=getComputedStyle(body); }catch{}
 const visual=independentPrimaryVisualShell(details);
 const visualRoot=visual?.element || body;
 let visualStyle=null; try{ visualStyle=getComputedStyle(visualRoot); }catch{}
 const bodyBackground=parseExternalShellColor(bodyStyle?.backgroundColor);
 const bodyGradient=averageExternalShellColors(externalShellColorsFromText(bodyStyle?.backgroundImage));
 const visualBackground=parseExternalShellColor(visualStyle?.backgroundColor);
 const visualGradient=averageExternalShellColors(externalShellColorsFromText(visualStyle?.backgroundImage));
 const surface=(bodyBackground&&bodyBackground.a>=.18?bodyBackground:null) || bodyGradient || (visualBackground&&visualBackground.a>=.18?visualBackground:null) || visualGradient || palette?.base || null;
 if(!surface) return false;
 const header=externalShellWideTopBand(visualRoot) || externalShellWideTopBand(body) || (palette?.colors||[]).filter(color=>externalShellColorMetrics(color).saturation>=.18).sort((a,b)=>externalShellColorMetrics(b).saturation-externalShellColorMetrics(a).saturation)[0] || surface;
 let border=parseExternalShellColor(bodyStyle?.borderTopColor) || parseExternalShellColor(visualStyle?.borderTopColor);
 if(!border || border.a<.12) border=mixExternalShellColors(surface,externalShellColorMetrics(surface).luminance>.55?{r:0,g:0,b:0}:{r:255,g:255,b:255},.22);
 let radius=Math.max(...String(bodyStyle?.borderRadius||visualStyle?.borderRadius||'0').split(/[\s\/]+/).map(value=>parseFloat(value)||0),0);
 if(radius<4) radius=Math.max(...String(visualStyle?.borderRadius||'0').split(/[\s\/]+/).map(value=>parseFloat(value)||0),0);
 radius=Math.max(8,Math.min(28,radius||16));
 let borderWidth=Math.max(...String(bodyStyle?.borderWidth||visualStyle?.borderWidth||'0').split(/\s+/).map(value=>parseFloat(value)||0),0);
 borderWidth=Math.max(1,Math.min(4,borderWidth||1));
 host.setAttribute('data-rm-shell-integrated','true');
 host.style.setProperty('--rm-shell-surface',externalShellRgba(surface,.99));
 host.style.setProperty('--rm-shell-header-bg',externalShellRgba(header,.99));
 host.style.setProperty('--rm-shell-header-text',externalShellRgba(externalShellContrastText(header),1));
 host.style.setProperty('--rm-shell-border',externalShellRgba(border,.88));
 host.style.setProperty('--rm-shell-radius',`${radius}px`);
 host.style.setProperty('--rm-shell-border-width',`${borderWidth}px`);
 // Only flatten the stage carrier when it is not itself the object-like medium.
 // Device/book/card objects keep their own top corners intact.
 host.querySelectorAll?.('[data-rm-shell-integrated-body="true"]').forEach(node=>node.removeAttribute('data-rm-shell-integrated-body'));
 if(!visual?.objectLike || body!==visualRoot) body.setAttribute('data-rm-shell-integrated-body','true');
 return true;
}

function applyExternalShellTint(host,html=''){
 if(!host?.style) return false;
 const rendered=renderedExternalShellPalette(host);
 const source=externalShellSourcePalette(html);
 const palette=rendered||source;
 const tinted=applyExternalShellTintPalette(host,palette);
 // 1.4.30.5: pure-external title shell follows the rendered RabbitMirror surface again.
 // Reuse the existing integration path so header/border/radius are sampled from the
 // actual body instead of keeping a detached neutral/dark title strip.
 const integrated=applyExternalShellIntegration(host,palette);
 if(!integrated) clearExternalShellIntegration(host);
 return tinted||integrated;
}

export function scheduleExternalShellTint(host,html=''){
 if(!host) return false;
 if(externalFaceDetails(host).length>1){
  const source=String(html||host.__rabbitMirrorIndependentSource||'');
  const key=`faces:${source.length}:${hashText(source)}`;
  if(host.dataset.rmShellTintKey===key) return true;
  clearExternalShellTint(host);
  clearExternalShellIntegration(host);
  const parsed=parseMultifaceOutput(source);
  externalFaceDetails(host).forEach((details,index)=>{
   // Source-only per-face tint: no fivefold computed-style/geometry pass.
   applyExternalShellTintPalette(details,externalShellSourcePalette(parsed.faces?.[index]?.inner||details.outerHTML));
  });
  host.dataset.rmShellTintKey=key;
  return true;
 }
 const source=String(html||host.__rabbitMirrorIndependentSource||'');
 const tintKey=`${source.length}:${hashText(source)}`;
 if(historicalLightHost(host)){
  // Source-only palette extraction is layout-free and keeps the collapsed title
  // recognizable. Rendered-body sampling (getComputedStyle/rect/tree scans) waits
  // until first open together with the rest of the historical heavy work.
  applyExternalShellTintPalette(host,externalShellSourcePalette(source));
  host.dataset.rmShellTintDeferred='history-open';
  return true;
 }
 delete host.dataset.rmShellTintDeferred;
 const scheduled=!!(host.__rabbitMirrorShellTintFrame || host.__rabbitMirrorShellTintTimer);
 if(host.dataset.rmShellTintKey===tintKey && host.hasAttribute('data-rm-shell-tinted') && !scheduled) return true;
 if(scheduled && host.__rabbitMirrorShellTintPendingKey===tintKey) return true;
 if(host.__rabbitMirrorShellTintFrame){ globalThis.cancelAnimationFrame?.(host.__rabbitMirrorShellTintFrame); host.__rabbitMirrorShellTintFrame=0; }
 if(host.__rabbitMirrorShellTintTimer){ clearTimeout(host.__rabbitMirrorShellTintTimer); host.__rabbitMirrorShellTintTimer=0; }
 host.__rabbitMirrorShellTintPendingKey=tintKey;
 applyExternalShellTintPalette(host,externalShellSourcePalette(source));
 const run=()=>{
  host.__rabbitMirrorShellTintTimer=0;
  host.__rabbitMirrorShellTintPendingKey='';
  if(!host.isConnected || host.dataset.rmState!=='ready') return;
  applyExternalShellTint(host,source);
  host.dataset.rmShellTintKey=tintKey;
 };
 if(typeof requestAnimationFrame==='function'){
  host.__rabbitMirrorShellTintFrame=requestAnimationFrame(()=>{
   host.__rabbitMirrorShellTintFrame=0;
   host.__rabbitMirrorShellTintTimer=setTimeout(run,40);
  });
 } else host.__rabbitMirrorShellTintTimer=setTimeout(run,40);
 return true;
}



export function captureIndependentContentWidthBaseline(element){
 if(!element?.getAttribute || element.hasAttribute(INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR)) return;
 try{ element.setAttribute(INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR,encodeURIComponent(element.getAttribute('style')||'')); }
 catch{ element.setAttribute(INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR,''); }
}

export function restoreIndependentContentWidthBaseline(element){
 if(!element?.hasAttribute?.(INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR)) return false;
 let baseline='';
 try{ baseline=decodeURIComponent(element.getAttribute(INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR)||''); }catch{ baseline=''; }
 if(baseline) element.setAttribute('style',baseline);
 else element.removeAttribute('style');
 element.removeAttribute(INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR);
 element.removeAttribute(INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR);
 element.removeAttribute(INDEPENDENT_EXTERNAL_STAGE_NEUTRALIZED_ATTR);
 return true;
}

function independentExternalDirectContentRoot(details){
 if(!details?.children) return null;
 return [...details.children].find(node=>!['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(node?.tagName)) || null;
}

function independentExternalSizingDeclarationHasIntent(style){
 if(!style?.getPropertyValue) return false;
 const explicit=['width','inline-size','max-width','max-inline-size','min-width','min-inline-size'];
 for(const property of explicit){
  const value=String(style.getPropertyValue(property)||'').trim().toLowerCase();
  if(!value) continue;
  // Automatic sizing is not a request for a narrow card. In particular Safari
  // can still shrink an auto root through the details content wrapper.
  if((property==='width'||property==='inline-size') && /^(?:auto|initial|unset)$/.test(value)) continue;
  // min-width:0 is a common generic flex/grid safety rule, not an authored width.
  if((property==='min-width'||property==='min-inline-size') && /^(?:0(?:\.0+)?(?:px|%|em|rem|vw|vh)?|auto|initial|unset|revert|revert-layer)$/.test(value)) continue;
  // max-width:100% / none are also generic containment/non-constraint declarations.
  // They do not express a narrower authored size and must not suppress Safari's
  // pure-external auto-root width rescue.
  if((property==='max-width'||property==='max-inline-size') && /^(?:100%|none|initial|unset|revert|revert-layer)$/.test(value)) continue;
  return true;
 }
 return false;
}

function independentExternalSelectorMayTargetRoot(selectorText='',element=null){
 const selector=String(selectorText||'');
 if(!selector || !element) return false;
 try{ if(element.matches?.(selector)) return true; }catch{}
 // A state rule may not match until :hover/:checked changes. Conservatively keep
 // authored width intent when the root's own id/class is in the final compound.
 for(const branch of selector.split(',')){
  if(branch.includes('::')) continue;
  const compounds=branch.trim().split(/\s+|>|\+|~/).filter(Boolean);
  const tail=compounds[compounds.length-1]||'';
  if(element.id && tail.includes(`#${element.id}`)) return true;
  for(const name of [...(element.classList||[])]){
   if(name && tail.includes(`.${name}`)) return true;
  }
 }
 return false;
}

function independentExternalRootHasAuthorSizingIntent(details,body){
 if(!details || !body) return true;
 if(independentExternalSizingDeclarationHasIntent(body.style)) return true;
 // Generated author CSS lives in local <style> elements. RabbitMirror's own
 // runtime rescue styles are marked data-rabbit-mirror-* and must not be
 // mistaken for author sizing intent.
 for(const styleElement of details.querySelectorAll?.('style')||[]){
  const internal=[...(styleElement.attributes||[])].some(attr=>String(attr.name||'').startsWith('data-rabbit-mirror-'));
  if(internal) continue;
  try{
   const visit=rules=>{
    for(const rule of [...(rules||[])]){
     if(rule?.cssRules && visit(rule.cssRules)) return true;
     if(!rule?.selectorText || !rule?.style) continue;
     if(!independentExternalSelectorMayTargetRoot(rule.selectorText,body)) continue;
     if(independentExternalSizingDeclarationHasIntent(rule.style)) return true;
    }
    return false;
   };
   if(visit(styleElement.sheet?.cssRules)) return true;
  }catch{
   // Local generated styles should normally expose CSSOM. If Safari refuses,
   // preserve behavior rather than guessing at an unreadable authored width.
   const text=String(styleElement.textContent||'');
   const tokens=[body.id&&`#${body.id}`,...[...(body.classList||[])].map(name=>name&&`.${name}`)].filter(Boolean);
   if(tokens.some(token=>text.includes(token)) && /(?:^|[;{])\s*(?:width|inline-size|max-width|max-inline-size|min-width|min-inline-size)\s*:/i.test(text)) return true;
  }
 }
 return false;
}

function independentExternalAutoRootWidthShouldRescue({viewportWidth=0,containerWidth=0,bodyWidth=0,display='',position='',floatMode='none',authorSizing=false,marginLeft=0,marginRight=0}={}){
 if(!(viewportWidth>0 && viewportWidth<INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_BREAKPOINT)) return false;
 if(authorSizing || containerWidth<220 || bodyWidth<120 || bodyWidth>containerWidth+2) return false;
 if(bodyWidth/containerWidth>=INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RATIO) return false;
 if(!['block','flex','grid','flow-root','list-item'].includes(String(display||'').toLowerCase())) return false;
 if(['absolute','fixed'].includes(String(position||'').toLowerCase())) return false;
 if(String(floatMode||'none').toLowerCase()!=='none') return false;
 if(Math.abs(Number(marginLeft)||0)>2 || Math.abs(Number(marginRight)||0)>2) return false;
 return true;
}

function restoreIndependentExternalAutoRootWidth(host){
 if(!host || host.dataset?.rmIndependentExternalAutoRootWidthRescue!==INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RESCUE) return false;
 let changed=false;
 for(const details of externalFaceDetails(host)){
  const body=independentExternalDirectContentRoot(details);
  if(body && restoreIndependentContentWidthBaseline(body)) changed=true;
 }
 delete host.dataset.rmIndependentExternalAutoRootWidthRescue;
 delete host.dataset.rmIndependentExternalAutoRootWidthBefore;
 delete host.dataset.rmIndependentExternalAutoRootWidthAfter;
 return changed;
}

function rescueIndependentExternalAutoRootWidth(host,targetDetails=null){
 if(!host?.isConnected || host.dataset.rmSource!=='independent' || host.dataset.rmState!=='ready' || host.dataset.rmPlacement!=='external') return false;
 const details=targetDetails?.parentElement===host ? targetDetails
  : host.querySelector?.(':scope > details[data-rabbit-mirror-external-details="true"], :scope > details');
 if(!details?.open || typeof getComputedStyle!=='function') return false;
 const body=independentExternalDirectContentRoot(details);
 if(!body?.isConnected) return false;
 if(host.dataset.rmIndependentExternalAutoRootWidthRescue===INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RESCUE && body.hasAttribute?.(INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR)) return true;
 const viewportWidth=independentExternalEffectiveViewportWidth();
 if(!(viewportWidth>0 && viewportWidth<INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_BREAKPOINT)){
  restoreIndependentExternalAutoRootWidth(host);
  return false;
 }
 let style,bodyRect,contentWidth=0;
 try{
  style=getComputedStyle(body);
  bodyRect=body.getBoundingClientRect();
  const pseudo=getComputedStyle(details,'::details-content');
  contentWidth=parseFloat(pseudo?.inlineSize||pseudo?.width||'')||0;
 }catch{return false;}
 if(!(contentWidth>0)) contentWidth=Number(elementContentBoxRect(details)?.width||0);
 const bodyWidth=Math.max(0,Number(bodyRect?.width||0));
 const authorSizing=independentExternalRootHasAuthorSizingIntent(details,body);
 const shouldRescue=independentExternalAutoRootWidthShouldRescue({
  viewportWidth,containerWidth:contentWidth,bodyWidth,
  display:style?.display,position:style?.position,floatMode:style?.cssFloat,
  authorSizing,marginLeft:parseFloat(style?.marginLeft||'0')||0,marginRight:parseFloat(style?.marginRight||'0')||0,
 });
 if(!shouldRescue) return false;
 captureIndependentContentWidthBaseline(body);
 body.style.setProperty('width','100%','important');
 body.style.setProperty('inline-size','100%','important');
 body.style.setProperty('max-width','100%','important');
 body.style.setProperty('max-inline-size','100%','important');
 body.style.setProperty('box-sizing','border-box','important');
 body.setAttribute(INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR,INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RESCUE);
 let afterWidth=0;
 try{ afterWidth=Math.max(0,Number(body.getBoundingClientRect()?.width||0)); }catch{}
 if(afterWidth<contentWidth*.94){
  restoreIndependentContentWidthBaseline(body);
  return false;
 }
 host.dataset.rmIndependentExternalAutoRootWidthRescue=INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RESCUE;
 host.dataset.rmIndependentExternalAutoRootWidthBefore=String(Math.round(bodyWidth*10)/10);
 host.dataset.rmIndependentExternalAutoRootWidthAfter=String(Math.round(afterWidth*10)/10);
 return true;
}


function manualFaceAutoWidthContentRoot(root){
 const children=root?.children;
 if(!children || children.length>64) return {body:null,status:'protected'};
 let body=null;
 for(const node of children){
  if(['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META','INPUT'].includes(node?.tagName)
   || node.hidden || node.matches?.(PERSISTED_RUNTIME_UI_SELECTOR)) continue;
  let style;
  try{style=getComputedStyle(node);}catch{return {body:null,status:'unavailable'};}
  if(style?.display==='none' || ['hidden','collapse'].includes(style?.visibility)) continue;
  // Several visible direct regions can be an authored split layout. Do not
  // select just its first column and stretch it over its neighbors.
  if(body) return {body:null,status:'protected'};
  body=node;
 }
 return {body,status:body?'candidate':'unavailable'};
}
// Undo only this live action's properties. Persisted baseline attributes are not
// trusted as executable/restorable style input for a manual operation.

export function undoRabbitMirrorFaceAutoWidth(root){
 const saved=manualFaceAutoWidthRepairs.get(root);
 if(!saved || !root?.isConnected || saved.body.parentElement!==root) return false;
 const {body,properties,attributes,appliedAttributes}=saved;
 let changed=false;
 for(const [property,value,priority] of properties){
  const applied=property==='box-sizing'?'border-box':'100%';
  if(body.style.getPropertyValue(property)!==applied || body.style.getPropertyPriority(property)!=='important') continue;
  if(value) body.style.setProperty(property,value,priority);
  else body.style.removeProperty(property);
  changed=true;
 }
 for(const [name,value] of attributes){
  if(body.getAttribute(name)!==appliedAttributes?.get(name)) continue;
  if(value===null) body.removeAttribute(name);
  else body.setAttribute(name,value);
 }
 manualFaceAutoWidthRepairs.delete(root);
 return changed;
}
// Called only after Maintenance Rabbit has revalidated its captured owner. The
// ordinary automatic/mobile-only rescue above remains unchanged.

export function repairRabbitMirrorFaceAutoWidth(root){
 const result=(status,beforeWidth=0,afterWidth=beforeWidth,containerWidth=0)=>({status,beforeWidth,afterWidth,containerWidth});
 if(!root?.isConnected || !root.matches?.('details')) return result('stale');
 if(!root.open || typeof getComputedStyle!=='function') return result('unavailable');
 const candidate=manualFaceAutoWidthContentRoot(root);
 if(!candidate.body) return result(candidate.status);
 const body=candidate.body;
 if(!body?.isConnected || !body.style) return result('unavailable');
 let style,beforeWidth=0,containerWidth=0;
 try{
  style=getComputedStyle(body);
  beforeWidth=roundedGeometryNumber(body.getBoundingClientRect().width);
  // A broken ::details-content can itself report the stale narrow width. The
  // real details content box is the authority for this explicit remeasurement.
  containerWidth=roundedGeometryNumber(elementContentBoxRect(root)?.width);
 }catch{return result('unavailable');}
 if(containerWidth<220 || beforeWidth<120) return result('unavailable',beforeWidth,beforeWidth,containerWidth);
 if(beforeWidth/containerWidth>=INDEPENDENT_EXTERNAL_AUTO_ROOT_WIDTH_RATIO) return result('unchanged',beforeWidth,beforeWidth,containerWidth);
 if(independentExternalRootHasAuthorSizingIntent(root,body)
  || !['block','flex','grid','flow-root','list-item'].includes(String(style?.display||'').toLowerCase())
  || ['absolute','fixed'].includes(String(style?.position||'').toLowerCase())
  || String(style?.cssFloat||'none').toLowerCase()!=='none'
  || Math.abs(parseFloat(style?.marginLeft||'0')||0)>2
  || Math.abs(parseFloat(style?.marginRight||'0')||0)>2) return result('protected',beforeWidth,beforeWidth,containerWidth);
 const saved={
  body,
  properties:MANUAL_FACE_AUTO_WIDTH_PROPERTIES.map(property=>[property,body.style.getPropertyValue(property),body.style.getPropertyPriority(property)]),
  attributes:[INDEPENDENT_CONTENT_WIDTH_BASELINE_ATTR,INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR].map(name=>[name,body.getAttribute(name)]),
 };
 manualFaceAutoWidthRepairs.set(root,saved);
 captureIndependentContentWidthBaseline(body);
 for(const property of MANUAL_FACE_AUTO_WIDTH_PROPERTIES) body.style.setProperty(property,property==='box-sizing'?'border-box':'100%','important');
 body.setAttribute(INDEPENDENT_CONTENT_WIDTH_RESCUE_ATTR,'manual-auto-root-fill');
 saved.appliedAttributes=new Map(saved.attributes.map(([name])=>[name,body.getAttribute(name)]));
 let afterWidth=0;
 try{afterWidth=roundedGeometryNumber(body.getBoundingClientRect().width);}catch{}
 if(afterWidth<containerWidth*.94 || afterWidth>containerWidth+2 || afterWidth<=beforeWidth+1){
  undoRabbitMirrorFaceAutoWidth(root);
  return result('unavailable',beforeWidth,beforeWidth,containerWidth);
 }
 return result('repaired',beforeWidth,afterWidth,containerWidth);
}


