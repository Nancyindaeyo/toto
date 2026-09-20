// Split from independentApi.js — lifecycle.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { SOURCE_ATTR, currentRuntime, getContext } from './runtime.js?rmv=1.5.65';
import { LEGACY_GLOBAL_FLIGHT_KEYS, clearAutomaticFailureStops, pending } from './flights.js?rmv=1.5.65';
import { migrateLegacyDeletedRecords } from './persistence.js?rmv=1.5.65';
import {
    activeGlobalWorldInfoCapture,
    activeOwnerLockBatch,
    activeOwnerLockBatchDirty,
    globalWorldInfoSnapshots,
    hostGenerationLooksActive,
    writeActiveGlobalWorldInfoCapture,
    writeActiveOwnerLockBatch,
    writeActiveOwnerLockBatchDirty,
} from './connection.js?rmv=1.5.65';
import { isTheaterFavoriteHost, removeEmptyFollowExternalAnchors, removeEmptyInlineAnchors } from './request.js?rmv=1.5.65';
import {
    activeRestorableHtmlCache,
    installExternalGeometryListeners,
    migratePersistedInteractionStateRecords,
    preparedReadyHtmlCache,
    removeExternalGeometryListeners,
    writeActiveRestorableHtmlCache,
} from './geometry.js?rmv=1.5.65';
import {
    abortFlight,
    automaticIndependentTiming,
    cancelAllIndependentFlights,
    captureMountedFollowSnapshots,
    clearIndependentRejectedFacePreviews,
    earlyBodyConfigSignature,
    earlyBodyCredentials,
    ensureAutomaticGenerationCutover,
    handleIndependentManualBridge,
    installBackgroundLifecycleListeners,
    installFeedbackMirrorActionListeners,
    installFollowMultifaceCommitListener,
    installIndependentActionBridge,
    installRepairPersistenceListener,
    manualIndependentTiming,
    manualTerminalOwners,
    messageSourceRevisions,
    reconcileManualTimingChange,
    removeBackgroundLifecycleListeners,
    removeFeedbackMirrorActionListeners,
    removeFollowMultifaceCommitListener,
    removeIndependentActionBridge,
    removeRepairPersistenceListener,
    restoreFollowInline,
    restoreMountedFollowSnapshots,
    runtimeMode,
} from './mount.js?rmv=1.5.65';
import {
    cancelEarlyBodyProbes,
    captureMountedIndependentPlaceholderIndices,
    captureMountedIndependentRecords,
    clearAutomaticGenerationCutovers,
    clearPassiveRecoveryTimers,
    clearScheduledGeneration,
    disconnectObserver,
    handleIndependentEarlyBodyBridge,
    independentRequestConfigSignature,
    installHostEventsIfNeeded,
    installIndependentEarlyBodyBridge,
    installObserverIfNeeded,
    recoverDeferredIndependentGenerations,
    restoreMountedIndependentRecords,
    schedulePassiveRecoveryAfterSourceSwitch,
    scheduleStartupHistorySync,
    settleMountedIndependentPlaceholders,
    unsubscribeHostEvents,
} from './earlyBody.js?rmv=1.5.65';

export let observer = null;

export function writeObserver(value){ observer = value; return value; }

export let syncRunning = false;

export function writeSyncRunning(value){ syncRunning = value; return value; }
// 1.4.30.17: full-chat restoration keeps historical collapsed mirrors in the
// same light state promised by 1.3.57/1.3.93/1.3.94. New/current targeted
// message updates never enter this scope.

let lastIndependentRequestConfig = '';

export let hostGenerationInProgress = false;

export function writeHostGenerationInProgress(value){ hostGenerationInProgress = value; return value; }

export let hostGenerationHintStartedAt = 0;

export function writeHostGenerationHintStartedAt(value){ hostGenerationHintStartedAt = value; return value; }

export let independentActionBridge = null;

export function writeIndependentActionBridge(value){ independentActionBridge = value; return value; }

export let runtimeConfigSequence = 0;

let lastAppliedRuntimeMode = null;

export let lastAppliedIndependentTiming = null;

export function writeLastAppliedIndependentTiming(value){ lastAppliedIndependentTiming = value; return value; }

export const automaticGenerationCutovers = new Map();

export let backgroundLifecycleListenersInstalled = false;

export function writeBackgroundLifecycleListenersInstalled(value){ backgroundLifecycleListenersInstalled = value; return value; }

export let backgroundResumeTimer = 0;

export function writeBackgroundResumeTimer(value){ backgroundResumeTimer = value; return value; }

export let backgroundLifecycleNeedsRecovery = false;

export function writeBackgroundLifecycleNeedsRecovery(value){ backgroundLifecycleNeedsRecovery = value; return value; }

export let generationPlaceholderTimer = 0;

export function writeGenerationPlaceholderTimer(value){ generationPlaceholderTimer = value; return value; }

export let generationPlaceholderStartedAt = 0;

export function writeGenerationPlaceholderStartedAt(value){ generationPlaceholderStartedAt = value; return value; }

export const passiveRecoveryTimers = new Set();

export let persistedInteractionMigrationHandle = 0;

export function writePersistedInteractionMigrationHandle(value){ persistedInteractionMigrationHandle = value; return value; }

export let persistedInteractionMigrationIdle = false;

export function writePersistedInteractionMigrationIdle(value){ persistedInteractionMigrationIdle = value; return value; }

export let startupHistoryFallbackRoot=null;

export function writeStartupHistoryFallbackRoot(value){ startupHistoryFallbackRoot = value; return value; }

export let startupHistoryFallbackHandler=null;

export function writeStartupHistoryFallbackHandler(value){ startupHistoryFallbackHandler = value; return value; }

export let queuedIndices=new Set();

export function writeQueuedIndices(value){ queuedIndices = value; return value; }

export let syncTimer=null;

export function writeSyncTimer(value){ syncTimer = value; return value; }

export let hostSubscriptions=[];

export function writeHostSubscriptions(value){ hostSubscriptions = value; return value; }

export let managedIndependentMessagesUnsubscribe=null;

export function writeManagedIndependentMessagesUnsubscribe(value){ managedIndependentMessagesUnsubscribe = value; return value; }

async function reconfigureRuntime({coldStart=false}={}){
 if(!currentRuntime()) return;
 reconcileManualTimingChange();
 const sequence=++runtimeConfigSequence;
 if([...automaticGenerationCutovers.values()].some(cutover=>[...(cutover.earlyBodies?.values()||[])].some(owner=>!owner.cancelled&&(owner.config!==earlyBodyConfigSignature()||earlyBodyCredentials.get(owner)!==String(getSettings().independentApiKey||''))))) cancelEarlyBodyProbes('early-settings-changed');
 clearPassiveRecoveryTimers();
 const mountedIndependentPlaceholders=coldStart?[]:captureMountedIndependentPlaceholderIndices();
 const mountedIndependentSnapshots=coldStart?[]:captureMountedIndependentRecords();
 disconnectObserver(); unsubscribeHostEvents();
 const mode=runtimeMode();
 const previousMode=lastAppliedRuntimeMode;
 const runtimeModeTransition=previousMode!==null && previousMode!==mode;
 const enteredIndependentFromAnotherSource=mode==='independent' && previousMode!=='independent';
 if(enteredIndependentFromAnotherSource){ clearAutomaticGenerationCutovers(); ensureAutomaticGenerationCutover(getContext()); }
 else if(mode!=='independent') clearAutomaticGenerationCutovers();
 lastAppliedRuntimeMode=mode;
 if(mode!=='independent') restoreMountedIndependentRecords(mountedIndependentSnapshots);
 const nextConfig=mode==='independent'?independentRequestConfigSignature():'';
 if(lastIndependentRequestConfig && nextConfig && nextConfig!==lastIndependentRequestConfig){
   clearScheduledGeneration(); cancelAllIndependentFlights('api-settings-changed');
   settleMountedIndependentPlaceholders(mountedIndependentPlaceholders,'api-settings-changed');
 }
 if(mode!=='independent'){
   clearScheduledGeneration(); cancelAllIndependentFlights('generation-source-changed');
   settleMountedIndependentPlaceholders(mountedIndependentPlaceholders,'generation-source-changed');
 }
 lastIndependentRequestConfig=nextConfig;
 if(mode==='off'||mode==='inline'){
   clearScheduledGeneration(); cancelAllIndependentFlights('mode-disabled');
   settleMountedIndependentPlaceholders(mountedIndependentPlaceholders,'mode-disabled');
   if(mode==='inline'){
     document.querySelectorAll(`[${SOURCE_ATTR}][data-rm-source="follow"]`).forEach(el=>restoreFollowInline(el));
     // Cold entry restores only the newest few owners synchronously and yields between
     // historical chunks. Source switches/hot updates keep the exact full reconciliation.
     scheduleStartupHistorySync(sequence);
     removeEmptyInlineAnchors(document); removeEmptyFollowExternalAnchors(document);
     installObserverIfNeeded({skipHistoricalProbe:coldStart});
     if(runtimeModeTransition) schedulePassiveRecoveryAfterSourceSwitch(sequence);
   }
   if(mode==='off'){ document.querySelectorAll(`[${SOURCE_ATTR}]`).forEach(n=>{ if(!isTheaterFavoriteHost(n)) n.remove(); }); removeEmptyInlineAnchors(document); removeEmptyFollowExternalAnchors(document); }
   return;
 }
 scheduleStartupHistorySync(sequence);
 installObserverIfNeeded({skipHistoricalProbe:coldStart});
 if(runtimeModeTransition) schedulePassiveRecoveryAfterSourceSwitch(sequence);
 await installHostEventsIfNeeded(sequence);
 if(sequence!==runtimeConfigSequence || !currentRuntime()) return;
 // Passive reconfigure/history restoration never starts a paid request. The exact
 // host generation lifecycle or an explicit swipe/resay owns all authorization.
}

export function refreshRabbitMirrorGenerationMode(){ void reconfigureRuntime(); }

export async function initIndependentRabbitMirror({isActive=()=>true}={}){
 if(!isActive()) return;
 if(!currentRuntime()) return;
 migratePersistedInteractionStateRecords();
 // Snapshot traversal is a hot-update recovery mechanism, not a cold-start requirement.
 // On a fresh page there is no previous RabbitMirror runtime to preserve, so walking every
 // historical assistant message here only delays chat availability.
 const previousCleanup=globalThis.__rabbitMirrorIndependentCleanup;
 const hotUpdate=typeof previousCleanup==='function';
 const mountedSnapshots=hotUpdate?captureMountedIndependentRecords():[];
 const mountedFollowSnapshots=hotUpdate?captureMountedFollowSnapshots():[];
 try{ previousCleanup?.(); }catch{}
 restoreMountedIndependentRecords(mountedSnapshots);
 restoreMountedFollowSnapshots(mountedFollowSnapshots);
 globalThis.__rabbitMirrorIndependentCleanup=destroyIndependentRabbitMirror;
 migrateLegacyDeletedRecords();
 installIndependentActionBridge();
 handleIndependentManualBridge.diagnosticSnapshot=()=>{const frames=[...document.querySelectorAll('.rabbit-mirror-external-host[data-rm-state="manual"]')];return {runtimeVersion:'1.5.53-manualdiag1',runtimeCurrent:currentRuntime(),timingManual:manualIndependentTiming(),pendingFrames:frames.length,visiblePendingFrames:frames.filter(el=>!el.hidden&&getComputedStyle(el).visibility!=='hidden'&&el.getClientRects().length>0).length,readyFrames:document.querySelectorAll('.rabbit-mirror-external-host[data-rm-state="ready"]').length};};
 globalThis.__rabbitMirrorIndependentManualBridge=handleIndependentManualBridge;
 try{globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('runtime-start',{runtimeVersion:'1.5.53-manualdiag1',runtimeCurrent:currentRuntime()});}catch{}
 installFollowMultifaceCommitListener();
 hostGenerationInProgress=automaticIndependentTiming() && hostGenerationLooksActive();
 hostGenerationHintStartedAt=hostGenerationInProgress?Date.now():0;
 for(const key of LEGACY_GLOBAL_FLIGHT_KEYS){ const legacy=globalThis[key]; if(legacy?.values) for(const flight of legacy.values()) abortFlight(flight,'runtime-upgrade'); try{legacy?.clear?.();}catch{} delete globalThis[key]; }
 installFeedbackMirrorActionListeners();
 installRepairPersistenceListener();
 installExternalGeometryListeners();
 installBackgroundLifecycleListeners();
 await reconfigureRuntime({coldStart:!hotUpdate});
 if(!isActive()) return;
 installIndependentEarlyBodyBridge();
 if(manualIndependentTiming()) handleIndependentManualBridge({kind:'changed'});
 recoverDeferredIndependentGenerations();
 // Hot updates never restart historical loading/error placeholders. Only a
 // genuinely new assistant reply or an explicit manual retry may issue a POST.
}

export function destroyIndependentRabbitMirror(){
 try{globalThis.__rabbitMirrorManualEntryDiagnosticRecord?.('runtime-stop',{runtimeVersion:'1.5.53-manualdiag1'});}catch{}
 if(globalThis.__rabbitMirrorIndependentManualBridge===handleIndependentManualBridge) delete globalThis.__rabbitMirrorIndependentManualBridge;
 manualTerminalOwners.clear();
 lastAppliedIndependentTiming=null;
 cancelEarlyBodyProbes('runtime-destroyed',{clear:true});
 if(globalThis.__rabbitMirrorEarlyBodyBridge===handleIndependentEarlyBodyBridge) delete globalThis.__rabbitMirrorEarlyBodyBridge;
 managedIndependentMessagesUnsubscribe?.(); managedIndependentMessagesUnsubscribe=null;
 runtimeConfigSequence++; hostGenerationInProgress=false; hostGenerationHintStartedAt=0; clearScheduledGeneration(); clearPassiveRecoveryTimers(); cancelAllIndependentFlights('runtime-destroyed'); clearIndependentRejectedFacePreviews(); clearAutomaticGenerationCutovers(); lastAppliedRuntimeMode=null;
 if(persistedInteractionMigrationHandle){
  if(persistedInteractionMigrationIdle && typeof cancelIdleCallback==='function') cancelIdleCallback(persistedInteractionMigrationHandle);
  else clearTimeout(persistedInteractionMigrationHandle);
  persistedInteractionMigrationHandle=0; persistedInteractionMigrationIdle=false;
 }
 removeIndependentActionBridge();
 lastIndependentRequestConfig='';
 disconnectObserver(); unsubscribeHostEvents(); removeFeedbackMirrorActionListeners(); removeFollowMultifaceCommitListener(); removeRepairPersistenceListener(); removeExternalGeometryListeners(); removeBackgroundLifecycleListeners();
 syncRunning=false; pending.clear(); clearAutomaticFailureStops(); messageSourceRevisions.clear(); writeActiveGlobalWorldInfoCapture(null); globalWorldInfoSnapshots.clear(); preparedReadyHtmlCache.clear(); writeActiveRestorableHtmlCache(null); writeActiveOwnerLockBatch(null); writeActiveOwnerLockBatchDirty(false);
 document.querySelectorAll(`[${SOURCE_ATTR}][data-rm-source="follow"]`).forEach(host=>restoreFollowInline(host));
 document.querySelectorAll(`[${SOURCE_ATTR}][data-rm-source="independent"]`).forEach(n=>{ if(!isTheaterFavoriteHost(n)) n.remove(); });
 removeEmptyInlineAnchors(document); removeEmptyFollowExternalAnchors(document);
 if(globalThis.__rabbitMirrorIndependentCleanup===destroyIndependentRabbitMirror) delete globalThis.__rabbitMirrorIndependentCleanup;
}

