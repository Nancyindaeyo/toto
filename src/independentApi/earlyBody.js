// Split from independentApi.js — earlyBody.

import { isRabbitMirrorManagedChatSurface, getRabbitMirrorMountedMessages, subscribeRabbitMirrorChatSurface } from '../hostCompatibility.js?rmv=1.5.58-fork1';
import { recordTtSurface, ttSurfaceNow } from '../ttSurfaceDiagnostics.js?rmv=1.5.53-cn-boundary1';
import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { independentGenerationTiming } from '../independentTiming.js?rmv=1.5.53-timing1';
import { independentAdvancedOptionsSignature } from '../advancedRequestOptions.js?rmv=1.5.53-cn-boundary1';
import {
    INDEPENDENT_GENERATION_INTENTS_KEY,
    INDEPENDENT_GENERATION_INTENT_TYPES,
    INDEPENDENT_GENERATION_STOPS_KEY,
    RUNTIME_VERSION,
    SOURCE_ATTR,
    currentRuntime,
    getContext,
    hashText,
} from './runtime.js?rmv=1.5.65';
import {
    ACTIVE_GENERATION_WAIT_MS,
    FINAL_RENDER_POLL_INTERVAL_MS,
    FINAL_RENDER_SOURCE_STABLE_WAIT_MS,
    GENERATION_PLACEHOLDER_POLL_INTERVAL_MS,
    HOST_FINAL_PROOF_WAIT_MS,
    SOURCE_STABLE_WAIT_MS,
    advanceOperationEpochForBase,
    automaticFailureStopFor,
    generationPolls,
    markAutomaticFailureStop,
    operationEpochForBase,
    pending,
} from './flights.js?rmv=1.5.65';
import {
    appendHistoryEntry,
    chatPersistenceSlot,
    normalizeHistoryEntry,
    persistedOwnerForMessage,
    readStore,
    synchronizeIndependentChatPersistence,
    writePersistedOwner,
    writeStore,
} from './persistence.js?rmv=1.5.65';
import {
    activeGlobalWorldInfoCapture,
    assistantMessages,
    beginGlobalWorldInfoCapture,
    bindIndependentRecordContinuity,
    canonicalVisibleMessageText,
    captureActivatedGlobalWorldInfo,
    captureGlobalWorldInfoEntriesLoaded,
    chatKey,
    clearOwnerLockForBase,
    currentWorldInfoBookScope,
    dispatchWorldInfoBooksChanged,
    externalHostGenerationActivity,
    findSavedRecord,
    finishGlobalWorldInfoCapture,
    hostGenerationLooksActive,
    hostModule,
    independentContextExcludedTagSet,
    independentRecordContinuity,
    isRabbitMirrorEligibleAssistantMessage,
    lastAssistantMessage,
    liveVisibleIndependentMessageText,
    lockedIndependentRecordForBase,
    messageBaseSlotKey,
    messageBodyFingerprint,
    messageDisplayFingerprint,
    messageElement,
    messageReasoningFingerprint,
    messageSlotKey,
    messageSourceFingerprint,
    normalizeBase,
    normalizeIndependentConnectionText,
    normalizedIndependentVisibleComparison,
    observeMessageSourceRevision,
    publishIndependentApiRequestDiagnostic,
    recentAssistantMessages,
    recordKey,
    revokeIndependentRecordContinuity,
    saveRecordForSlot,
    savedRecordMatchesObserved,
    setOwnerLockForBase,
    stripHistoricalRabbitMirrorBlocks,
    stripInvisibleIndependentContextMarkup,
    swipeId,
    updateIndependentRecordContinuity,
    withOwnerLockStoreBatch,
    writeActiveGlobalWorldInfoCapture,
    writeHostModule,
} from './connection.js?rmv=1.5.65';
import {
    allExternalHosts,
    externalHosts,
    removeEmptyFollowExternalAnchors,
    removeEmptyInlineAnchors,
    withExternalHostSyncIndex,
} from './request.js?rmv=1.5.65';
import {
    beginHostWorkTiming,
    clearExternalHostFreshSourceState,
    clearIndependentResayStatus,
    clearOrphanExternalHostTimer,
    collapseDuplicateIdentityHosts,
    ensureReplyGenerationPlaceholder,
    externalHostsOwnedByMesid,
    hasExplicitSourceReplacementEvidence,
    historyRecoveryForObserved,
    independentStoredHtmlRestorable,
    markExternalHostsAwaitingOwner,
    mountedIndependentReadyHostMatchesObserved,
    mountedIndependentReadyHostSharesStableOwner,
    passiveIndependentFailureForIdentity,
    placeExternalHost,
    quickAuthorizationOwners,
    quickIntentOwners,
    quickStartOwners,
    quickWaitingCandidate,
    readyDetailsFromHost,
    readyRecordFromHost,
    rebuildCollapsedReadyHost,
    recoverSavedRecord,
    refreshExistingExternalDetails,
    removeExternalDuplicatesPreferInline,
    removeIndependentInlineDuplicates,
    restoreExternalHostRendering,
    restorePassiveIndependentFailure,
    setPlaceholderSummary,
    usableReadyDetails,
    withRestorableHtmlCacheBatch,
} from './geometry.js?rmv=1.5.65';
import {
    INDEPENDENT_INTENT_OWNER,
    abortFlight,
    activeIndependentFlightForBase,
    automaticAuthorizationLineage,
    automaticCutoverVersionToken,
    automaticIndependentTiming,
    boundIndependentIntentOwner,
    cancelAllIndependentFlights,
    cancelFlightsForMessage,
    cancelFlightsForSlot,
    cancelSupersededFlightsForBase,
    claimDeferredIndependentGenerationIntent,
    clearGenerationPlaceholderPoll,
    clearIndependentRejectedFacePreviews,
    confirmFinalRenderedGeneration,
    consumeIndependentDisplayModeChange,
    currentGenerationIdentity,
    deferredIndependentGenerationIntents,
    deferredIndependentIntentCandidateIndex,
    deferredIndependentIntentCompletedAt,
    earlyBodyConfigSignature,
    earlyBodyCredentials,
    earlyBodyEnabled,
    ensureAutomaticGenerationCutover,
    ensureExternalUi,
    ensureGenerationPlaceholderForIndex,
    ensureManualGenerationPlaceholder,
    exactIndependentReadyForIdentity,
    externalFaceDetails,
    externalizeFollowMirror,
    generateFor,
    generationPollKey,
    generationWaitPollDelay,
    handleIndependentManualBridge,
    hasGenerationWorkFor,
    manualBodyOwnerCurrent,
    manualIndependentTiming,
    manualIntentForMessage,
    messageSourceRevisions,
    orphanExternalHostTimers,
    passiveObservedIdentity,
    queueManualGenerationTerminalSync,
    refreshDeferredIndependentProof,
    renderAutomaticFailureStop,
    restoreFollowInline,
    restoreFollowMirrorFromMessageSource,
    runtimeMode,
    scheduleGenerationPlaceholderPoll,
    scheduleMessageGeneration,
    serializeExternalFaceDetails,
    stampAutomaticAuthorizationEpoch,
    withHistoricalRestoreLightPass,
} from './mount.js?rmv=1.5.65';
import {
    automaticGenerationCutovers,
    hostGenerationHintStartedAt,
    hostGenerationInProgress,
    hostSubscriptions,
    managedIndependentMessagesUnsubscribe,
    observer,
    passiveRecoveryTimers,
    queuedIndices,
    runtimeConfigSequence,
    startupHistoryFallbackHandler,
    startupHistoryFallbackRoot,
    syncRunning,
    syncTimer,
    writeHostGenerationHintStartedAt,
    writeHostGenerationInProgress,
    writeHostSubscriptions,
    writeManagedIndependentMessagesUnsubscribe,
    writeObserver,
    writeQueuedIndices,
    writeStartupHistoryFallbackHandler,
    writeStartupHistoryFallbackRoot,
    writeSyncRunning,
    writeSyncTimer,
} from './lifecycle.js?rmv=1.5.65';

let earlyBodyParserPromise=null;

let earlyBodyParser=null;

let earlyBodyProbeTimer=0;

let earlyBodyProbeSequence=0;
// Credentials are compared only in process memory; never part of a signature,
// owner diagnostic, settings extension, or persisted result.

const STARTUP_SYNC_IMMEDIATE_MESSAGES=6;

export function cancelEarlyBodyOwner(owner,reason='early-body-changed'){
 if(!owner || owner.cancelled) return;
 owner.cancelled=true; owner.cancelReason=reason;
 earlyBodyCredentials.delete(owner);
 owner.resolveFinal?.(false); owner.resolveFinal=null;
 if(owner.finalTimer){clearTimeout(owner.finalTimer);owner.finalTimer=0;}
 if(owner.flight) abortFlight(owner.flight,reason);
}

export function cancelEarlyBodyProbes(reason='early-body-cancelled',{clear=false}={}){
 earlyBodyProbeSequence+=1;
 if(earlyBodyProbeTimer){clearTimeout(earlyBodyProbeTimer);earlyBodyProbeTimer=0;}
 for(const cutover of automaticGenerationCutovers.values()){
  for(const owner of cutover.earlyBodies?.values()||[]) cancelEarlyBodyOwner(owner,reason);
  if(clear) cutover.earlyBodies?.clear();
 }
}

function earlyBodyPacketCurrent(packet,ctx=getContext()){
 if(!automaticIndependentTiming() || !packet || !earlyBodyEnabled(ctx) || packet.chat!==ctx.chat || packet.chatKey!==chatKey(ctx)
  || packet.message!==ctx.chat?.[packet.index] || packet.swipe!==swipeId(packet.message)
  || !isRabbitMirrorEligibleAssistantMessage(packet.message)
  || ctx.streamingProcessor!==packet.processor || packet.processor?.isStopped===true
  || packet.processor?.abortController?.signal?.aborted
  || packet.type!==String(packet.processor?.type||'').toLowerCase()
  || (Array.isArray(packet.processor?.toolCalls)&&packet.processor.toolCalls.length)) return false;
 const settings=getSettings();
 if(!packet.selectionKey || packet.selectionKey!==JSON.stringify([String(settings.independentEarlyBodyChatKey||''),settings.independentEarlyBodyTags||[],settings.independentContextExcludedTags||[]])) return false;
 try{if(typeof ctx.canPerformToolCalls!=='function'||ctx.canPerformToolCalls(packet.type)!==false)return false;}catch{return false;}
 const current=`${String(packet.processor.continueMessage||'')}${String(packet.processor.result||'')}`;
 if(current!==packet.text || current.length>256*1024) return false;
 const intent=deferredIndependentGenerationIntents().find(item=>item.id===packet.intentId);
 return !!intent && !intent.auxiliaryTerminalPending && !intent.terminalAt
  && deferredIndependentIntentCandidateIndex(intent,ctx)===packet.index;
}

function earlyBodyVisibleProjection(snapshot,index,message,source=''){
 if(!snapshot || typeof document==='undefined') return null;
 const excluded=independentContextExcludedTagSet();
 for(const tag of ['think','thinking','reasoning','analysis','cot','chain-of-thought','toto','script','style','template','noscript']) excluded.add(tag);
 // Retain the selected wrapper during filtering: <story hidden> is not made
 // visible by discarding its opening tag before the visibility projection.
 const selected=source && snapshot.segments?.length?snapshot.segments.map(segment=>source.slice(segment.start,segment.end)).join('\n\n'):snapshot.body;
 const filtered=stripInvisibleIndependentContextMarkup(stripHistoricalRabbitMirrorBlocks(selected).text,excluded);
 const candidate=String(filtered.text||'').replace(/\s+/g,' ').trim();
 if(!candidate) return null;
 const live=canonicalVisibleMessageText(message,index,excluded);
 if(!String(live.source||'').startsWith('live-dom')) return null;
 const text=String(live.text||'');
 const needle=normalizedIndependentVisibleComparison(candidate);
 const haystack=normalizedIndependentVisibleComparison(text);
 const offset=haystack.indexOf(needle);
 // The source is not a visibility oracle. Only one exact continuous projection
 // in the live rendered body authorizes it; incomplete/ambiguous paint waits.
 if(offset<0 || haystack.indexOf(needle,offset+1)>=0) return null;
 return {text:candidate,filteredRabbitMirrorChars:0,filteredExcludedTagChars:Number(filtered.filteredExcludedTagChars||0),
  filteredExcludedTags:filtered.filteredExcludedTags||[],source:'live-dom+early-body'};
}

export function earlyBodyOwnerCurrent(owner,{visibility=false}={}){
 const ctx=getContext();
 if(!owner || owner.cancelled || !earlyBodyEnabled(ctx) || earlyBodyConfigSignature()!==owner.config
  || earlyBodyCredentials.get(owner)!==String(getSettings().independentApiKey||'')
  || owner.chat!==ctx.chat || owner.chatKey!==chatKey(ctx) || owner.message!==ctx.chat?.[owner.index]
  || owner.swipe!==swipeId(owner.message) || !isRabbitMirrorEligibleAssistantMessage(owner.message)
  || operationEpochForBase(owner.baseSlot)!==owner.epoch) return false;
 const processor=ctx.streamingProcessor;
 // During streaming, result is authoritative and chat.mes may lag one frame.
 // After final, only the exact current message can prove the same selected body.
 let source=String(owner.message.mes||'');
 if(!owner.finalized){
  if(processor!==owner.processor || processor?.isStopped===true || processor?.abortController?.signal?.aborted
   || (Array.isArray(processor?.toolCalls)&&processor.toolCalls.length)) return false;
  try{if(typeof ctx.canPerformToolCalls!=='function'||ctx.canPerformToolCalls(owner.type)!==false)return false;}catch{return false;}
  source=`${String(processor.continueMessage||'')}${String(processor.result||'')}`;
 }
 const snapshot=earlyBodyParser?.extractClosedBodySnapshot(source,owner.tags);
 if(!snapshot || snapshot.signature!==owner.signature) return false;
 return !visibility || !!earlyBodyVisibleProjection(snapshot,owner.index,owner.message,source);
}

export function assertEarlyBodyOwner(owner){
 if(earlyBodyOwnerCurrent(owner,{visibility:true})) return;
 cancelEarlyBodyOwner(owner,'early-body-owner-changed');
 const error=new Error('提前生成的正文或所属操作已变化，本轮已停止且不会自动重发。');
 error.code='RABBIT_MIRROR_EARLY_BODY_STALE'; error.requestCount=owner?.flight?.dispatchLease?.consumed?.()?1:0;
 throw error;
}

function settleEarlyBodyAtFinal(ctx,index){
 const owner=automaticGenerationCutovers.get(chatKey(ctx))?.earlyBodies?.get(Number(index));
 if(!owner) return false;
 if(owner.chat!==ctx.chat || owner.message!==ctx.chat?.[Number(index)] || owner.swipe!==swipeId(owner.message)){
  cancelEarlyBodyOwner(owner,'early-body-owner-replaced');return true;
 }
 if(!owner.finalized){
  if(owner.finalTimer){clearTimeout(owner.finalTimer);owner.finalTimer=0;}
  owner.finalized=true;
  if(!earlyBodyOwnerCurrent(owner,{visibility:true})) cancelEarlyBodyOwner(owner,'early-body-final-changed');
  owner.resolveFinal?.(!owner.cancelled); owner.resolveFinal=null;
  if(globalThis.__rabbitMirrorEarlyBodyPacket?.intentId===owner.intentId) delete globalThis.__rabbitMirrorEarlyBodyPacket;
 }
 // Even cancelled/unpaid early attempts retain their operation latch. A final
 // event must never turn an interrupted early attempt into an automatic retry.
 return true;
}

async function probeIndependentEarlyBody(packet,sequence){
 if(!earlyBodyPacketCurrent(packet)) return;
 if(!earlyBodyParserPromise) earlyBodyParserPromise=import('../earlyBodyTags.js?rmv=1.5.53-cn-boundary1')
  .then(module=>{earlyBodyParser=module;return module;}).catch(()=>{earlyBodyParserPromise=null;return null;});
 const parser=await earlyBodyParserPromise;
 if(!parser || sequence!==earlyBodyProbeSequence || !earlyBodyPacketCurrent(packet)) return;
 const ctx=getContext(); const existing=automaticGenerationCutovers.get(chatKey(ctx))?.earlyBodies?.get(packet.index);
 // A replaced message object does not erase the once-per-intent latch. Reusing
 // that same processor/intent may cancel the old result, never open a new epoch.
 if(existing){
  if(existing.intentId===packet.intentId || existing.processor===packet.processor){
   if(!earlyBodyOwnerCurrent(existing))cancelEarlyBodyOwner(existing);return;
  }
  cancelEarlyBodyOwner(existing,'new-host-operation');
 }
 const settings=getSettings(); const tags=parser.normalizeEarlyBodyTags(settings.independentEarlyBodyTags);
 const snapshot=parser.extractClosedBodySnapshot(packet.text,tags);
 const visible=earlyBodyVisibleProjection(snapshot,packet.index,packet.message,packet.text);
 if(!snapshot || !visible || hasExistingFollowRabbitMirror(ctx,packet.index,packet.message)) return;
 const cutover=ensureAutomaticGenerationCutover(ctx);
 const baseSlot=messageBaseSlotKey(ctx,packet.index,packet.message);
 const epoch=advanceOperationEpochForBase(baseSlot,'early-body-closed',`early:${packet.intentId}`);
 let resolveFinal;
 const finalPromise=new Promise(resolve=>{resolveFinal=resolve;});
 const owner={chat:ctx.chat,chatKey:chatKey(ctx),message:packet.message,index:packet.index,swipe:packet.swipe,
  processor:packet.processor,type:packet.type,intentId:packet.intentId,baseSlot,epoch,
  tags:[...tags],signature:snapshot.signature,visible:Object.freeze(visible),config:earlyBodyConfigSignature(settings),
  finalized:false,cancelled:false,flight:null,finalPromise,resolveFinal,finalTimer:0};
 earlyBodyCredentials.set(owner,String(settings.independentApiKey||''));
 owner.finalTimer=setTimeout(()=>cancelEarlyBodyOwner(owner,'early-final-timeout'),ACTIVE_GENERATION_WAIT_MS);
 cutover.earlyBodies??=new Map(); cutover.earlyBodies.set(packet.index,owner);
 while(cutover.earlyBodies.size>8){const first=cutover.earlyBodies.keys().next().value;cancelEarlyBodyOwner(cutover.earlyBodies.get(first),'early-owner-limit');cutover.earlyBodies.delete(first);}
 unlockAutomaticGenerationCutover(ctx,packet.index,'early-body-closed');
 // No await: host STREAM_TOKEN_RECEIVED awaits its listeners; generation must
 // not hold the main response stream or recursive host event dispatch open.
 void generateFor(packet.index,packet.message,false,true,null,owner).catch(()=>cancelEarlyBodyOwner(owner,'early-dispatch-failed'));
}

export function handleIndependentEarlyBodyBridge(event){
 if(event?.kind==='cancel'){cancelEarlyBodyProbes(String(event.reason||'early-body-cancelled'));return;}
 const packet=event?.packet;
 if(!earlyBodyPacketCurrent(packet)) return;
 // Parsing is coalesced outside the awaited host listener, including validation
 // of an existing flight. Consume/return guards additionally check synchronously.
 if(earlyBodyProbeTimer) return;
 const sequence=earlyBodyProbeSequence;
 earlyBodyProbeTimer=setTimeout(()=>{
  earlyBodyProbeTimer=0;
  const latest=globalThis.__rabbitMirrorEarlyBodyPacket;
  if(sequence===earlyBodyProbeSequence) void probeIndependentEarlyBody(latest,sequence);
 },100);
}

export function installIndependentEarlyBodyBridge(){
 globalThis.__rabbitMirrorEarlyBodyBridge=handleIndependentEarlyBodyBridge;
 const packet=globalThis.__rabbitMirrorEarlyBodyPacket;
 if(packet) handleIndependentEarlyBodyBridge({kind:'token',packet});
}

export function clearAutomaticHostGenerationSettlement(owner){
 if(owner?.settleTimer){ clearTimeout(owner.settleTimer); owner.settleTimer=0; }
}

function automaticHostGenerationPhaseBaseline(ctx){
 const last=lastAssistantMessage(ctx);
 return last
   ? {index:last.i,token:automaticCutoverVersionToken(last.m)}
   : {index:-1,token:''};
}

export function automaticHostGenerationMayUseTools(type='',ctx={}){
 const normalized=String(type||'').trim().toLowerCase();
 if(!['normal','swipe','regenerate'].includes(normalized)) return false;
 const mainApi=String(ctx?.mainApi||hostModule?.main_api||'').trim().toLowerCase();
 if(mainApi && mainApi!=='openai') return false;
 // ST exposes its own synchronous capability check through getContext(). Do
 // not equate every Chat Completion with tool calling; function_calling is off
 // by default. Unknown/throwing host APIs remain possible, not falsely disabled.
 try{
  if(typeof ctx?.canPerformToolCalls==='function') return ctx.canPerformToolCalls(normalized)!==false;
  if(typeof ctx?.ToolManager?.canPerformToolCalls==='function') return ctx.ToolManager.canPerformToolCalls(normalized)!==false;
 }catch{return true;}
 if(ctx?.chatCompletionSettings?.function_calling===false) return false;
 return true;
}

function automaticHostToolResultTail(ctx){
 const chat=Array.isArray(ctx?.chat)?ctx.chat:[];
 const tail=chat[chat.length-1];
 return Array.isArray(tail?.extra?.tool_invocations) && tail.extra.tool_invocations.length>0;
}

export function automaticHostRenderProof(index){
 const processor=hostModule?.streamingProcessor || getContext()?.streamingProcessor;
 if(processor && Number(processor.messageId)===Number(index) && processor.isFinished===true){
  return Array.isArray(processor.toolCalls) && processor.toolCalls.length>0
   ? 'stream-tool-intermediate'
   : 'stream-final';
 }
 return 'exact-render';
}

function beginAutomaticHostGeneration(ctx,type='',nested=false,dryRun=false){
 if(runtimeMode()!=='independent' || !automaticIndependentTiming()) return false;
 const cutover=ensureAutomaticGenerationCutover(ctx);
 const normalized=String(type||'').trim().toLowerCase();
 const current=cutover.activeHostGeneration;
 // SillyTavern emits START for auxiliary generations whose END can be absent or
 // indistinguishable from the visible owner's terminal. Keep one bounded
 // ambiguity marker: its next unscoped END is consumed as auxiliary evidence,
 // never as permission to mirror a partial正文.
 if(dryRun===true) return false;
 if(!INDEPENDENT_GENERATION_INTENT_TYPES.has(normalized)){
  if(cutover.earlyBodies?.size) cancelEarlyBodyProbes('auxiliary-generation-started');
  if(!current) return false;
  current.auxiliaryTerminalPending=true;
  current.auxiliaryStartedAt=Date.now();
  return 'auxiliary';
 }
 // A slow tool can recurse after this operation was explicitly stopped. Keep a
 // bounded metadata-only tombstone until a non-tool-tail/new user operation or
 // chat change; late recursive START is not a fresh retry authorization.
 const stops=Array.isArray(globalThis[INDEPENDENT_GENERATION_STOPS_KEY])?globalThis[INDEPENDENT_GENERATION_STOPS_KEY]:[];
 if(normalized==='normal' && automaticHostToolResultTail(ctx) && stops.some(stop=>stop?.chatKey===chatKey(ctx))) return false;
 if(stops.length) globalThis[INDEPENDENT_GENERATION_STOPS_KEY]=stops.filter(stop=>stop?.chatKey!==chatKey(ctx));
 // A recursive tool call emits an intermediate CHARACTER_MESSAGE_RENDERED and
 // then another normal START, while the whole visible operation still has only
 // one terminal END. Keep the owner, advance its proof phase, and discard every
 // render/terminal hint from the previous (tool-intermediate) phase.
 if(nested && current){
  if(cutover.earlyBodies?.size) cancelEarlyBodyProbes('tool-recursion');
  const baseline=automaticHostGenerationPhaseBaseline(ctx);
  clearAutomaticHostGenerationSettlement(current);
  current.phase=Number(current.phase||0)+1;
  current.phaseBaselineIndex=baseline.index;
  current.phaseBaselineToken=baseline.token;
  current.tentativeRender=null;
   current.received=null;
   current.intermediateRender=null;
   current.terminalSeen=false;
   current.terminalAt=0;
   current.auxiliaryTerminalPending=false;
   current.auxiliaryStartedAt=0;
   current.toolCapable=current.toolCapable===true || automaticHostGenerationMayUseTools(normalized,ctx);
   current.settleStartedAt=0;
   return 'nested';
 }
 if(nested) return false;
 clearAutomaticHostGenerationSettlement(current);
 const chat=Array.isArray(ctx?.chat)?ctx.chat:[];
 const tailIndex=chat.length-1; const tail=tailIndex>=0?chat[tailIndex]:null;
 if(['continue','swipe','regenerate'].includes(normalized)){
  revokeIndependentRecordContinuity(ctx,tailIndex);
  cutover.authorized.delete(tailIndex);
 }
 if(['continue','swipe','regenerate'].includes(normalized) && cutover.earlyBodies?.has(tailIndex)){
  cancelEarlyBodyOwner(cutover.earlyBodies.get(tailIndex),'new-host-operation');cutover.earlyBodies.delete(tailIndex);
 }
 const baseline=automaticHostGenerationPhaseBaseline(ctx);
 cutover.activeHostGeneration={
  chat:chatKey(ctx),chatRef:chat,type:normalized,startedAt:Date.now(),phase:0,
  startChatLength:chat.length,startTailIndex:tailIndex,
  startTailRole:tail?.is_user===true?'user':(tail?'assistant':'none'),
   startTailToken:tail&&!tail.is_user?automaticCutoverVersionToken(tail):'',
   phaseBaselineIndex:baseline.index,phaseBaselineToken:baseline.token,
   tentativeRender:null,intermediateRender:null,terminalSeen:false,terminalAt:0,
   auxiliaryTerminalPending:false,auxiliaryStartedAt:0,
   toolCapable:automaticHostGenerationMayUseTools(normalized,ctx),
   settleTimer:0,settleStartedAt:0,
  };
 return 'new';
}

export function unlockAutomaticGenerationCutover(ctx,index,reason='host-generation-finished',evidence=null){ 
 const cutover=ensureAutomaticGenerationCutover(ctx); const normalized=Number(index); const msg=ctx?.chat?.[normalized];
 if(!Number.isInteger(normalized)||normalized<0||!isRabbitMirrorEligibleAssistantMessage(msg)) return false;
 const token=automaticCutoverVersionToken(msg);
 if(!token) return false;
 const previousQuick=quickAuthorizationOwners.get(cutover.authorized.get(normalized));
 const authorization={token,reason:String(reason||''),ts:Date.now(),[INDEPENDENT_INTENT_OWNER]:automaticAuthorizationLineage(ctx,normalized,evidence)};
 cutover.authorized.set(normalized,authorization);
 const quickOwner=evidence?.quickStartOwner||quickIntentOwners.get(boundIndependentIntentOwner(evidence,ctx,normalized))
  ||(previousQuick?.intentIds?.has(evidence?.id)?previousQuick:null);
 
 if(quickStartOwners.has(quickOwner)) quickAuthorizationOwners.set(authorization,quickOwner);
 return true;
}

export function automaticHostGenerationRenderMatches(ctx,index,owner){
 if(!owner || String(owner.chat||'')!==chatKey(ctx)) return false;
 if(owner.chatRef && owner.chatRef!==ctx.chat) return false;
 const normalized=Number(index); const msg=ctx?.chat?.[normalized];
 if(!Number.isInteger(normalized)||normalized<0||!isRabbitMirrorEligibleAssistantMessage(msg)||!String(msg.mes||'').trim()) return false;
 for(const bound of [owner.received,owner.tentativeRender,owner.intermediateRender]){
  if(bound?.message && bound.phase===Number(owner.phase||0)
   && (bound.chat!==ctx.chat || bound.message!==msg || bound.index!==normalized || bound.swipe!==swipeId(msg))) return false;
 }
 const last=lastAssistantMessage(ctx); if(!last || last.i!==normalized) return false;
 const token=automaticCutoverVersionToken(msg);
 if(!token || (normalized===Number(owner.phaseBaselineIndex) && token===String(owner.phaseBaselineToken||''))) return false;
 if(normalized<Math.max(0,Number(owner.startChatLength||0)-1)) return false;
 if(Number(owner.phase||0)===0
  && owner.startTailRole==='assistant'
  && ['continue','swipe','regenerate'].includes(String(owner.type||''))
  && normalized!==Number(owner.startTailIndex)) return false;
 return true;
}

function noteAutomaticHostGenerationTerminal(ctx,reason='host-generation-ended'){
 const cutover=ensureAutomaticGenerationCutover(ctx);
 const owner=cutover.activeHostGeneration;
 if(!owner || String(owner.chat||'')!==chatKey(ctx)) return false;
 if(owner.auxiliaryTerminalPending===true){
  owner.auxiliaryTerminalPending=false;
  owner.auxiliaryTerminalAt=Date.now();
  owner.auxiliaryTerminalReason=String(reason||'').slice(0,64);
  return 'auxiliary';
 }
 if(owner.terminalSeen===true) return 'terminal';
 owner.terminalSeen=true; owner.terminalAt=Date.now(); owner.terminalReason=String(reason||'').slice(0,64);
 return 'terminal';
}

function noteAutomaticHostGenerationRender(ctx,index){
 const cutover=ensureAutomaticGenerationCutover(ctx); const owner=cutover.activeHostGeneration;
 if(!automaticHostGenerationRenderMatches(ctx,index,owner)) return false;
 const normalized=Number(index); const msg=ctx.chat[normalized];
 // Capability is latched for this phase, never downgraded when the user changes
 // settings after dispatch. Include the later interceptor snapshot as well.
 const intents=globalThis[INDEPENDENT_GENERATION_INTENTS_KEY];
 const bridgeMayUseTools=Array.isArray(intents) && intents.some(intent=>
  String(intent?.chatKey||'')===owner.chat && Number(intent?.startedAt||0)>=Number(owner.startedAt||0)
  && intent?.toolCapable!==false);
 owner.toolCapable=owner.toolCapable===true || bridgeMayUseTools || automaticHostGenerationMayUseTools(owner.type,ctx);
 const proof=automaticHostRenderProof(normalized);
 if(proof==='stream-tool-intermediate'){
  owner.tentativeRender=null;
  owner.intermediateRender={index:normalized,token:automaticCutoverVersionToken(msg),phase:Number(owner.phase||0),at:Date.now(),proof,
   chat:ctx.chat,message:msg,swipe:swipeId(msg)};
  return false;
 }
 owner.tentativeRender={
  index:normalized,token:automaticCutoverVersionToken(msg),phase:Number(owner.phase||0),at:Date.now(),proof,
  chat:ctx.chat,message:msg,swipe:swipeId(msg),
 };
 return true;
}

function noteAutomaticHostGenerationReceived(ctx,index){
 const owner=automaticGenerationCutovers.get(chatKey(ctx))?.activeHostGeneration;
 if(!automaticHostGenerationRenderMatches(ctx,index,owner)) return false;
 const bound=deferredIndependentGenerationIntents().some(intent=>!!boundIndependentIntentOwner(intent,ctx,index));
 if(!bound) return false;
 const msg=ctx.chat[index];
 owner.received={index:Number(index),token:automaticCutoverVersionToken(msg),phase:Number(owner.phase||0),
  at:Date.now(),chat:ctx.chat,message:msg,swipe:swipeId(msg)};
 return true;
}

function refreshAutomaticHostGenerationEvidence(ctx,owner){
 if(!owner?.terminalSeen || owner.terminalReason!==String(hostModule?.event_types?.GENERATION_ENDED||'GENERATION_ENDED')
  || owner.auxiliaryTerminalPending || owner.intermediateRender || externalHostGenerationActivity().active) return false;
 const rendered=owner.tentativeRender, candidate=rendered||owner.received;
 if(!candidate || candidate.chat!==ctx.chat || candidate.message!==ctx.chat?.[candidate.index]
  || candidate.swipe!==swipeId(candidate.message) || candidate.phase!==Number(owner.phase||0)
  || !automaticHostGenerationRenderMatches(ctx,candidate.index,owner)) return false;
 const proof=automaticHostRenderProof(candidate.index);
 const processor=hostModule?.streamingProcessor || ctx.streamingProcessor;
 if(proof==='stream-tool-intermediate' || processor?.isStopped===true || processor?.abortController?.signal?.aborted===true) return false;
 owner.toolCapable=owner.toolCapable===true || automaticHostGenerationMayUseTools(owner.type,ctx);
 if(!rendered && owner.toolCapable && proof!=='stream-final') return false;
 const token=automaticCutoverVersionToken(candidate.message);
 if(rendered && rendered.token===token) return true;
 owner.tentativeRender={...candidate,token,at:Date.now(),proof:rendered?.proof||(proof==='stream-final'?proof:'received-ended')};
 return true;
}

function automaticHostGenerationSettlementCandidate(ctx,{externalActive=false}={}){
 const cutover=automaticGenerationCutovers.get(chatKey(ctx)); const owner=cutover?.activeHostGeneration;
 refreshAutomaticHostGenerationEvidence(ctx,owner);
 const rendered=owner?.tentativeRender;
 if(!owner || !rendered || externalActive===true || Number(rendered.phase)!==Number(owner.phase||0)) return null;
 if(!automaticHostGenerationRenderMatches(ctx,rendered.index,owner)) return null;
 const msg=ctx?.chat?.[rendered.index]; const token=automaticCutoverVersionToken(msg);
 if(rendered.message && (rendered.message!==msg || rendered.chat!==ctx.chat || rendered.swipe!==swipeId(msg))) return null;
 if(token!==String(rendered.token||'')) return null;
 const proof=String(rendered.proof||'exact-render');
 // A non-stream Chat Completion render may be the visible pre-tool assistant.
 // Its local response data is not exposed by SillyTavern, so in a tool-capable
 // host it must have the visible owner's terminal proof. Missing-END recovery is
 // allowed only for a synchronously proven stream final or a non-tool host.
 if(owner.toolCapable===true && proof!=='stream-final' && owner.terminalSeen!==true) return null;
 return {owner,index:Number(rendered.index),token,proof,terminalSeen:owner.terminalSeen===true};
}

function settleAutomaticHostGeneration(ctx,index,reason='host-final-render'){
 const cutover=ensureAutomaticGenerationCutover(ctx); const owner=cutover.activeHostGeneration;
 const normalized=Number(index);
 if(!owner || !automaticHostGenerationRenderMatches(ctx,normalized,owner)) return false;
 const rendered=owner.tentativeRender;
 if(!rendered || Number(rendered.phase)!==Number(owner.phase||0)
  || Number(rendered.index)!==normalized
  || String(rendered.token||'')!==automaticCutoverVersionToken(ctx.chat[normalized])) return false;
 clearAutomaticHostGenerationSettlement(owner);
 cutover.activeHostGeneration=null;
 return unlockAutomaticGenerationCutover(ctx,normalized,reason,owner);
}

export function suppressesAutomaticGeneration(ctx,index){
 const timing=getSettings().independentGenerationTiming;
 if(timing==='manual' || timing==='off') return true;
 const cutover=automaticGenerationCutovers.get(chatKey(ctx));
 if(!cutover) return true;
 if(cutover.earlyBodies?.has(Number(index))) return true;
 const normalized=Number(index);
 if(!Number.isInteger(normalized) || normalized<0) return true;
 const msg=ctx?.chat?.[normalized]; const authorization=cutover.authorized.get(normalized);
 if(!isRabbitMirrorEligibleAssistantMessage(msg) || !authorization) return true;
 const proof=authorization[INDEPENDENT_INTENT_OWNER];
 if(proof && (proof.chat!==ctx.chat || proof.message!==msg || proof.swipe!==swipeId(msg))) return true;
 return String(authorization.token||'')!==automaticCutoverVersionToken(msg);
}

export function clearAutomaticGenerationCutovers(){
 if([...automaticGenerationCutovers.values()].some(cutover=>cutover.earlyBodies?.size)) cancelEarlyBodyProbes('chat-cutover-cleared',{clear:true});
 for(const cutover of automaticGenerationCutovers.values()) clearAutomaticHostGenerationSettlement(cutover?.activeHostGeneration);
 automaticGenerationCutovers.clear();
}

function activateAuthorizedAutomaticGeneration(ctx,index,reason='host-final-render',finalRenderConfirmed=true,sourceStabilityConfirmed=false,sourceStableSince=0){
 const normalized=Number(index); const msg=ctx?.chat?.[normalized];
 if(!Number.isInteger(normalized)||normalized<0||!isRabbitMirrorEligibleAssistantMessage(msg)) return false;
 if(automaticGenerationCutovers.get(chatKey(ctx))?.earlyBodies?.has(normalized)){
  settleEarlyBodyAtFinal(ctx,normalized);queueMessageSync([normalized]);return true;
 }
 const quickOwner=quickAuthorizationOwners.get(automaticGenerationCutovers.get(chatKey(ctx))?.authorized.get(normalized));
 // Completion of the same host reply must preserve its already reserved/paid lease.
 const sameQuickOperation=quickOwner && quickOwner.chat===ctx.chat && quickOwner.message===msg
  && quickOwner.swipe===swipeId(msg) && quickOwner.epoch===operationEpochForBase(quickOwner.base);
   if(!sameQuickOperation) advanceOperationEpochForBase(
  messageBaseSlotKey(ctx,normalized,msg),
  reason,
  automaticCutoverVersionToken(msg),
 );
 stampAutomaticAuthorizationEpoch(ctx,normalized);
 ensureGenerationPlaceholderForIndex(normalized,false);
 queueMessageSync([normalized]);
 const live=currentGenerationIdentity(normalized);
 if(!live || !String(live.msg?.mes||'').trim() || hasGenerationWorkFor(normalized,live.slot,live.sourceHash)) return true;
 const existingPoll=generationPolls.get(generationPollKey(normalized));
 if(existingPoll){
   if(finalRenderConfirmed){
    confirmFinalRenderedGeneration(normalized);
    if(sourceStabilityConfirmed===true) existingPoll.sourceStabilityConfirmed=true;
    const provenStableAt=Math.min(Date.now(),Math.max(0,Number(sourceStableSince)||0));
    if(provenStableAt && live){
     existingPoll.lastHash=live.sourceHash; existingPoll.lastRevision=live.revision; existingPoll.stableSince=provenStableAt;
     if(Date.now()-provenStableAt>=FINAL_RENDER_SOURCE_STABLE_WAIT_MS) existingPoll.sourceStabilityConfirmed=true;
    }
   }
   else existingPoll.queue?.(420);
 }else{
  const provenStableAt=Math.min(Date.now(),Math.max(0,Number(sourceStableSince)||0));
  const delay=finalRenderConfirmed && provenStableAt
   ? Math.max(0,FINAL_RENDER_SOURCE_STABLE_WAIT_MS-(Date.now()-provenStableAt))
   : (finalRenderConfirmed?FINAL_RENDER_POLL_INTERVAL_MS:420);
  scheduleMessageGeneration(normalized,delay,true,finalRenderConfirmed,sourceStabilityConfirmed,provenStableAt);
 }
 return true;
}

function finalizeAutomaticHostGeneration(ctx,index,reason='host-final-render'){
 if(!settleAutomaticHostGeneration(ctx,index,reason)) return false;
 writeHostGenerationInProgress(false);
 writeHostGenerationHintStartedAt(0);
 clearGenerationPlaceholderPoll();
 finishGlobalWorldInfoCapture(ctx);
 // Consume the lightweight exact-render proof too, so a later duplicate END or
 // RENDER cannot reopen the same operation through the cold-runtime path.
 claimDeferredIndependentGenerationIntent(ctx,index,`${reason}-deferred`,{requireFinalProof:true});
 return activateAuthorizedAutomaticGeneration(ctx,index,reason,true,true);
}

function stopAutomaticHostGenerationSettlement(ctx,owner,reason='host-completion-timeout'){
 if(runtimeMode()!=='independent') return false;
 const cutover=automaticGenerationCutovers.get(chatKey(ctx));
 if(!owner || cutover?.activeHostGeneration!==owner || owner.chat!==chatKey(ctx)) return false;
 clearAutomaticHostGenerationSettlement(owner);
 cutover.activeHostGeneration=null;
 writeHostGenerationInProgress(false); writeHostGenerationHintStartedAt(0); clearGenerationPlaceholderPoll();
 if(activeGlobalWorldInfoCapture?.chat===owner.chat) writeActiveGlobalWorldInfoCapture(null);
 const intents=globalThis[INDEPENDENT_GENERATION_INTENTS_KEY];
 if(Array.isArray(intents)) globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]=intents.filter(intent=>String(intent?.chatKey||'')!==owner.chat);
 const stops=Array.isArray(globalThis[INDEPENDENT_GENERATION_STOPS_KEY])?globalThis[INDEPENDENT_GENERATION_STOPS_KEY]:[];
 globalThis[INDEPENDENT_GENERATION_STOPS_KEY]=[...stops.filter(stop=>stop?.chatKey!==owner.chat),{chatKey:owner.chat,startedAt:Date.now()}].slice(-8);
 globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.hostCompletionUnproven',{reason:String(reason||''),phase:Number(owner.phase||0)});
 // A timeout is UI/error evidence only, never permission to read a guessed tail
 // or send a paid request. Bind the retry shell only to this exact rendered body.
 const rendered=owner.tentativeRender || owner.intermediateRender || owner.received;
 const index=Number(rendered?.index); const msg=ctx?.chat?.[index];
 if(!rendered || !automaticHostGenerationRenderMatches(ctx,index,owner)
  || (!rendered.message && automaticCutoverVersionToken(msg)!==String(rendered.token||''))) return true;
 // A positively bound object may have been postprocessed while waiting. This
 // only places a zero-request error on its current body; it grants no dispatch.
 const live=currentGenerationIdentity(index); const el=messageElement(index);
 if(!live || !el || hasExistingFollowRabbitMirror(ctx,index,msg) || hasGenerationWorkFor(index,live.slot,live.sourceHash)) return true;
 cutover.authorized.delete(index);
 const message=reason==='final-proof-missing'
  ? '⚠️ 未能确认工具调用后的最终正文，本轮未发送副 API 请求。请等正文和工具执行结束后，点击“重新生成兔子镜”。'
  : '⚠️ 未收到当前正文的可靠结束信号，本轮未发送副 API 请求，已停止自动等待。确认正文已经完成后，请点击“重新生成兔子镜”。';
 markAutomaticFailureStop(live.slot,live.sourceHash,reason,{
  message,
  code:String(reason||'host-completion-timeout'),
  semanticFailure:String(reason||'host-completion-timeout'),
  terminalStage:'preflight',
 });
 publishIndependentApiRequestDiagnostic({
  ok:false,
  status:0,
  requestCount:0,
  automaticRetry:false,
  chatKeyHash:hashText(chatKey(ctx)),
  mesid:index,
  swipe:swipeId(msg),
  sourceHash:live.sourceHash,
  baseSlotHash:hashText(live.baseSlot),
  operationEpoch:operationEpochForBase(live.baseSlot),
  semanticFailure:String(reason||'host-completion-timeout'),
  terminalStage:'preflight',
  terminalErrorCode:String(reason||'host-completion-timeout'),
  diagnosticUpdatedAt:Date.now(),
 });
 const existing=collapseDuplicateIdentityHosts(el,live.key,'independent',live.sourceHash);
 if(mountedIndependentReadyHostMatchesObserved(existing,live.ctx,index,live.msg,live,live.key)){
  existing.dataset.rmState='ready'; clearIndependentResayStatus(existing);
  globalThis.toastr?.warning?.(message);
  return true;
 }
 const host=ensureExternalUi(el,live.key,message,'error','independent',live.sourceHash);
 const details=host?.querySelector?.(':scope > details');
 if(details) setPlaceholderSummary(details,'【兔子镜：⚠️ 等待已停止】');
 return true;
}

function scheduleAutomaticHostGenerationSettlement(delay=FINAL_RENDER_POLL_INTERVAL_MS){
 if(runtimeMode()!=='independent') return false;
 const initialContext=getContext(); const cutover=automaticGenerationCutovers.get(chatKey(initialContext));
 const owner=cutover?.activeHostGeneration; if(!owner) return false;
 clearAutomaticHostGenerationSettlement(owner);
 if(!owner.settleStartedAt) owner.settleStartedAt=Date.now();
 owner.settleTimer=setTimeout(()=>{
  owner.settleTimer=0;
  const ctx=getContext(); const liveCutover=automaticGenerationCutovers.get(chatKey(ctx));
  if(liveCutover?.activeHostGeneration!==owner || String(owner.chat||'')!==chatKey(ctx)) return;
  const external=externalHostGenerationActivity();
  const candidate=automaticHostGenerationSettlementCandidate(ctx,{externalActive:external.active});
  const renderedAt=Number(owner.tentativeRender?.at||owner.received?.at||0);
  // Even a terminal-backed render gets one short final-paint window. This lets a
  // recursive tool START revoke the intermediate phase before authorization;
  // the downstream poll then rechecks the exact hash/revision once more.
  const settleWait=candidate?.terminalSeen===true || candidate?.proof==='stream-final'
   ? FINAL_RENDER_SOURCE_STABLE_WAIT_MS
   : SOURCE_STABLE_WAIT_MS;
  if(candidate && renderedAt && Date.now()-renderedAt>=settleWait){
   finalizeAutomaticHostGeneration(ctx,candidate.index,owner.terminalSeen?'host-generation-finished':'host-final-render-without-end');
   return;
  }
  // A non-stream tool response can render before tool execution. If the host
  // then loses its shared END edge, do not hang or turn elapsed time into final
  // proof: stop with an explicit manual retry entry after a bounded grace window.
  const receivedWithoutFinal=!owner.tentativeRender && !owner.intermediateRender && owner.received
   && owner.terminalSeen===true && owner.terminalReason===String(hostModule?.event_types?.GENERATION_ENDED||'GENERATION_ENDED');
  if(!external.active && owner.toolCapable===true
   && ((owner.terminalSeen!==true && owner.tentativeRender?.proof==='exact-render') || receivedWithoutFinal) && renderedAt
   && Date.now()-renderedAt>=HOST_FINAL_PROOF_WAIT_MS){
   stopAutomaticHostGenerationSettlement(ctx,owner,'final-proof-missing');
   return;
  }
  if(Date.now()-Number(owner.settleStartedAt||0)<ACTIVE_GENERATION_WAIT_MS){
   if(renderedAt){
    const renderedElapsed=Math.max(0,Date.now()-renderedAt);
    let nextDelay=candidate
     ? Math.max(1,Math.min(FINAL_RENDER_POLL_INTERVAL_MS,settleWait-renderedElapsed))
     : (renderedElapsed<HOST_FINAL_PROOF_WAIT_MS?FINAL_RENDER_POLL_INTERVAL_MS:GENERATION_PLACEHOLDER_POLL_INTERVAL_MS);
    if(owner.toolCapable===true && owner.terminalSeen!==true && owner.tentativeRender?.proof==='exact-render'){
     const proofRemaining=HOST_FINAL_PROOF_WAIT_MS-renderedElapsed;
     if(proofRemaining>0) nextDelay=Math.min(nextDelay,proofRemaining);
    }
    scheduleAutomaticHostGenerationSettlement(nextDelay);
   }else scheduleAutomaticHostGenerationSettlement(generationWaitPollDelay(owner.settleStartedAt));
   return;
  }
  stopAutomaticHostGenerationSettlement(ctx,owner);
 },Math.max(0,Number(delay)||0));
 return true;
}

function recoverDeferredAutomaticHostCompletion(ctx,index,reason='deferred-host-completion'){
 if(runtimeMode()!=='independent' || !automaticIndependentTiming()) return false;
 const normalized=Number(index);
 if(!Number.isInteger(normalized)||normalized<0||externalHostGenerationActivity().active) return false;
 refreshDeferredIndependentProof(ctx,normalized);
 const completedAt=deferredIndependentIntentCompletedAt(ctx,normalized);
 if(!completedAt || !claimDeferredIndependentGenerationIntent(ctx,normalized,reason,{requireFinalProof:true})) return false;
 writeHostGenerationInProgress(false); writeHostGenerationHintStartedAt(0); clearGenerationPlaceholderPoll();
 return activateAuthorizedAutomaticGeneration(ctx,normalized,reason,true,false,completedAt);
}

export function recoverDeferredIndependentGenerations(){
 if(!currentRuntime() || runtimeMode()!=='independent' || !automaticIndependentTiming() || hostGenerationLooksActive()) return 0;
 const ctx=getContext(); const candidates=new Set();
 for(const intent of deferredIndependentGenerationIntents()){
  const index=deferredIndependentIntentCandidateIndex(intent,ctx);
  if(Number.isInteger(index)&&index>=0) candidates.add(index);
 }
 let recovered=0;
 for(const index of candidates){
  const msg=ctx.chat?.[index];
  if(!isRabbitMirrorEligibleAssistantMessage(msg) || !messageElement(index)) continue;
  refreshDeferredIndependentProof(ctx,index);
  // A cold runtime can initialize after the first streaming fragment but before
  // final paint. Recovery therefore requires completion proof captured by the
  // lightweight bridge plus the same final正文 hash; nonempty partial text alone
  // is never enough to consume an intent.
  const completedAt=deferredIndependentIntentCompletedAt(ctx,index);
  if(!completedAt){ recoverDeferredUnprovenOwner(ctx,index); continue; }
  if(!claimDeferredIndependentGenerationIntent(ctx,index,'deferred-runtime-recovery',{requireFinalProof:true})) continue;
  recovered+=1;
  if(automaticGenerationCutovers.get(chatKey(ctx))?.earlyBodies?.has(index)){
   settleEarlyBodyAtFinal(ctx,index);queueMessageSync([index]);continue;
  }
  advanceOperationEpochForBase(messageBaseSlotKey(ctx,index,msg),'deferred-runtime-recovery',automaticCutoverVersionToken(msg));
  stampAutomaticAuthorizationEpoch(ctx,index);
  ensureGenerationPlaceholderForIndex(index,hostGenerationLooksActive());
  queueMessageSync([index]);
  const finalRendered=!hostGenerationLooksActive() && !!liveVisibleIndependentMessageText(index,independentContextExcludedTagSet()).text;
  const recoveredDelay=finalRendered
   ? Math.max(0,FINAL_RENDER_SOURCE_STABLE_WAIT_MS-(Date.now()-completedAt))
   : GENERATION_PLACEHOLDER_POLL_INTERVAL_MS;
  scheduleMessageGeneration(index,recoveredDelay,true,finalRendered,false,completedAt);
 }
 return recovered;
}

function recoverDeferredUnprovenOwner(ctx,index){
 const cutover=ensureAutomaticGenerationCutover(ctx);
 if(cutover.activeHostGeneration || cutover.authorized.has(Number(index))) return false;
 const intent=deferredIndependentGenerationIntents().filter(value=>String(value.chatKey||'')===chatKey(ctx)).at(-1);
 const bound=boundIndependentIntentOwner(intent,ctx,index);
 if(!bound?.receivedAt || intent?.terminalReason!=='generation-ended' || !intent.terminalAt
  || intent.auxiliaryTerminalPending || intent.intermediateAt || deferredIndependentIntentCandidateIndex(intent,ctx)!==Number(index)) return false;
 const live=currentGenerationIdentity(index);
 if(!live || hasGenerationWorkFor(index,live.slot,live.sourceHash) || exactIndependentReadyForIdentity(index,live)) return false;
 // Restore only the wait owner, never final proof or a dispatch authorization.
 // The existing bounded settlement timer can accept a later real final render,
 // or expose the missing proof with zero requests and the existing manual action.
 cutover.activeHostGeneration={chat:chatKey(ctx),chatRef:ctx.chat,type:String(intent.type),startedAt:Number(intent.startedAt),phase:0,
  startChatLength:Number(intent.tailIndex)+1,startTailIndex:Number(intent.tailIndex),startTailRole:String(intent.tailRole),
  phaseBaselineIndex:-1,phaseBaselineToken:'',tentativeRender:null,intermediateRender:null,
  received:{index:Number(index),token:automaticCutoverVersionToken(bound.message),phase:0,at:Number(bound.receivedAt),
   chat:ctx.chat,message:bound.message,swipe:bound.swipe},
  terminalSeen:true,terminalAt:Number(intent.terminalAt),terminalReason:String(hostModule?.event_types?.GENERATION_ENDED||'GENERATION_ENDED'),
  auxiliaryTerminalPending:false,toolCapable:intent.toolCapable!==false || automaticHostGenerationMayUseTools(intent.type,ctx),
  settleTimer:0,settleStartedAt:0};
 return scheduleAutomaticHostGenerationSettlement();
}

export function hasExistingFollowRabbitMirror(ctx,index,msg){
 const el=messageElement(index);
 if(el){
  const followHost=externalHosts(el).find(node=>node.dataset.rmSource==='follow' && usableReadyDetails(node.querySelector?.(':scope > details')));
  if(followHost) return true;
  const independentSelector=`[${SOURCE_ATTR}][data-rm-source="independent"]`;
  const inlineRoot=[...(el.querySelectorAll?.('toto[data-rabbit-mirror="true"], [data-rabbit-mirror="true"]')||[])].find(node=>
   !node.matches?.(`[${SOURCE_ATTR}]`) && !node.closest?.(independentSelector)
  );
  if(inlineRoot) return true;
  const inlineDetails=[...(el.querySelectorAll?.('details')||[])].find(details=>{
   if(details.closest?.(independentSelector)) return false;
   const summary=String(details.querySelector?.(':scope > summary')?.textContent||'').trim();
   return summary.startsWith('【兔子镜');
  });
  if(inlineDetails) return true;
 }
 const raw=`${String(msg?.mes||'')}
${String(msg?.extra?.display_text||'')}`;
 return /<toto\b[^>]*data-rabbit-mirror\s*=\s*["']true["'][^>]*>/i.test(raw)
  || /<summary\b[^>]*>\s*【兔子镜[：:]/i.test(raw);
}

function settleIndependentHostsForInactiveSource(el){
 if(!el) return;
 for(const host of externalHosts(el).filter(node=>node.dataset.rmSource==='independent')){
  const details=host.querySelector?.(':scope > details');
  const ready=details && !details.classList?.contains('rabbit-mirror-external-placeholder') && usableReadyDetails(details) ? details : null;
  if(ready){
   // A source switch may interrupt an independent resay after the old ready
   // details were deliberately kept visible. Preserve that completed mirror,
   // but clear every transient loading marker so follow-current display changes
   // can never look like they started a new independent request.
   host.dataset.rmState='ready';
   clearIndependentResayStatus(host);
   delete host.dataset.rmReplyGenerationPlaceholder;
   clearExternalHostFreshSourceState(host);
   placeExternalHost(el,host,host.dataset.rmKey||'', 'independent');
   continue;
  }
  // A loading/error placeholder without usable completed details has no visual
  // value once the independent generator is inactive. Removing it does not
  // delete cache/history and it will be recreated only after switching back to
  // the independent source and scheduling a real request.
  host.remove();
 }
 removeEmptyInlineAnchors(el);
}


function remountVisibleFloorFromCache(index){
 const ctx=getContext();
 const msg=ctx.chat?.[index];
 if(!isRabbitMirrorEligibleAssistantMessage(msg)) return false;
 const el=messageElement(index);
 if(!el?.isConnected) return false;
 const observed=passiveObservedIdentity(ctx,index,msg);
 const key=recordKey(ctx,index,msg);
 const existing=collapseDuplicateIdentityHosts(el,key,'independent',observed.sourceHash);
 if(mountedIndependentReadyHostMatchesObserved(existing,ctx,index,msg,observed,key)){
  placeExternalHost(el,existing,key,'independent');
  existing.hidden=false;
  clearIndependentResayStatus(existing);
  return true;
 }
 const persisted=persistedOwnerForMessage(ctx,index,msg);
 const persistedReady=!persisted?.deleted&&persisted?.html&&independentStoredHtmlRestorable(persisted.html)&&savedRecordMatchesObserved(persisted,observed)?persisted:null;
 const saved=persistedReady||recoverSavedRecord(readStore(),observed.slot,observed).saved;
 if(saved?.html && savedRecordMatchesObserved(saved,observed)){
  const host=ensureExternalUi(el,key,saved.html,'ready','independent',observed.sourceHash,saved);
  if(host){ host.hidden=false; clearIndependentResayStatus(host); }
  return !!host;
 }
 return false;
}

function restoreIndependentMirrorPassively(ctx,store,el,index,msg){
 const continuityChanged=updateIndependentRecordContinuity(ctx,index,msg,store);
 const observed=passiveObservedIdentity(ctx,index,msg);
 const key=recordKey(ctx,index,msg);
 let keep=collapseDuplicateIdentityHosts(el,key,'independent',observed.sourceHash);
 if(keep?.dataset?.rmState==='ready' && !usableReadyDetails(keep.querySelector?.(':scope > details'))){ keep.remove(); keep=null; }
 const persistedOwner=persistedOwnerForMessage(ctx,index,msg);
 const persistedReady=!persistedOwner?.deleted&&persistedOwner?.html&&independentStoredHtmlRestorable(persistedOwner.html)&&savedRecordMatchesObserved(persistedOwner,observed)?persistedOwner:null;
 const recovered=persistedReady?{saved:persistedReady,storeChanged:false}:persistedOwner?.deleted?{saved:null,storeChanged:false}:recoverSavedRecord(store,observed.slot,observed);
 if(continuityChanged) recovered.storeChanged=true;
 let saved=recovered.saved;
 if(saved?.html && !savedRecordMatchesObserved(saved,observed)) saved=null;
 if(persistedReady){
  const persistedSlot=chatPersistenceSlot(ctx,index,swipeId(msg),persistedReady)||observed.slot;
  if(!store?.[persistedSlot]?.html){ saveRecordForSlot(store,persistedSlot,persistedReady,{dropLegacy:false}); recovered.storeChanged=true; }
  setOwnerLockForBase(messageBaseSlotKey(ctx,index,msg),persistedSlot,String(persistedReady.sourceHash||persistedReady.bodyHash||observed.sourceHash));
 }
 if(saved?.html){
  if(bindIndependentRecordContinuity(ctx,index,msg,saved,store)) recovered.storeChanged=true;
  const host=ensureExternalUi(el,key,saved.html,'ready','independent',observed.sourceHash,saved);
  if(host){
   rebuildCollapsedReadyHost(el,host,key,'independent',saved.html,observed.sourceHash,saved);
   host.hidden=false;
   clearExternalHostFreshSourceState(host);
  }
  return recovered.storeChanged;
 }
 if(keep){
  if(mountedIndependentReadyHostMatchesObserved(keep,ctx,index,msg,observed,key)){
   placeExternalHost(el,keep,keep.dataset.rmKey||key,'independent');
   keep.hidden=false;
   clearExternalHostFreshSourceState(keep);
   refreshExistingExternalDetails(keep,key,'independent');
  }else{
   // The old mirror belongs to another chat, Swipe or正文 version. Keep its
   // cache/history but never display it beside the current正文 while the follow
   // API is active.
   keep.hidden=true;
  }
 }
 return recovered.storeChanged;
}

function syncMessages(indices=null){
 const end=beginHostWorkTiming('independent.syncMessages');
 try{ return syncMessagesCore(indices); }finally{ end?.(); }
}

function syncMessagesCore(indices=null){
 if(!currentRuntime() || syncRunning) return;
 writeSyncRunning(true);
 try{
   const ctx=getContext(); const st=getSettings(); const mode=runtimeMode(); const store=readStore();
   let storeChanged=false;
   if(!(indices instanceof Set)){
    const persistenceSync=synchronizeIndependentChatPersistence(ctx,store);
    if(persistenceSync.storeChanged) storeChanged=true;
   }
   const displayModeChanged=mode==='independent' ? consumeIndependentDisplayModeChange() : false;
   const allowed=indices instanceof Set?indices:null;
   const generationActive=mode==='independent' && hostGenerationLooksActive();
   const tailIndex=Array.isArray(ctx.chat)?ctx.chat.length-1:-1;
   const tailMessage=tailIndex>=0?ctx.chat?.[tailIndex]:null;
    const activeGenerationIndex=generationActive && isRabbitMirrorEligibleAssistantMessage(tailMessage) ? tailIndex : -1;
    const rows=allowed
     ? [...allowed].sort((a,b)=>a-b).map(i=>({m:ctx.chat?.[i],i})).filter(({m})=>isRabbitMirrorEligibleAssistantMessage(m))
    : assistantMessages(ctx);
   for(const {m,i} of rows){
     const el=messageElement(i); if(!el) continue;
     if(mode!=='off') restoreFollowMirrorFromMessageSource(el,m);
     if(mode==='off') { externalHosts(el).forEach(n=>n.remove()); continue; }
     if(mode==='independent'){
       // Switching generation source must not erase mirrors that were produced
       // together with the正文 API. Restore any externalized follow mirror to
       // its exact origin marker first; only future replies use the independent
       // generator.
       for(const followHost of externalHosts(el).filter(n=>n.dataset.rmSource==='follow')) restoreFollowInline(followHost);
       if(updateIndependentRecordContinuity(ctx,i,m,store)) storeChanged=true;
       const observed=observeMessageSourceRevision(ctx,i,m);
       const key=recordKey(ctx,i,m); const slot=observed.slot; const sourceHash=observed.sourceHash;
       const baseSlot=messageBaseSlotKey(ctx,i,m);
        const persistedOwner=persistedOwnerForMessage(ctx,i,m);
        const persistedSuppressed=!!persistedOwner?.deleted;
        cancelSupersededFlightsForBase(baseSlot,sourceHash);
        cancelFlightsForSlot(slot,sourceHash);
        const activeBaseFlight=activeIndependentFlightForBase(baseSlot);
       const persistedReady=!persistedSuppressed&&persistedOwner?.html&&independentStoredHtmlRestorable(persistedOwner.html)&&savedRecordMatchesObserved(persistedOwner,observed)?persistedOwner:null;
       if(persistedSuppressed) clearOwnerLockForBase(baseSlot);
       let ownerLocked=null;
       if(persistedReady){
        const persistedSlot=chatPersistenceSlot(ctx,i,swipeId(m),persistedReady)||slot;
        if(!store?.[persistedSlot]?.html){ saveRecordForSlot(store,persistedSlot,persistedReady,{dropLegacy:false}); storeChanged=true; }
        setOwnerLockForBase(baseSlot,persistedSlot,String(persistedReady.sourceHash||persistedReady.bodyHash||sourceHash));
        ownerLocked={record:persistedReady,lock:{slot:persistedSlot}};
       } else if(!persistedSuppressed){
        const locked=lockedIndependentRecordForBase(baseSlot,store);
        if(locked?.record?.html && savedRecordMatchesObserved(locked.record,observed)) ownerLocked=locked;
       }
       const recoveredAtSync=persistedSuppressed?{saved:null,storeChanged:false}:ownerLocked?.record ? {saved:ownerLocked.record,storeChanged:false} : recoverSavedRecord(store,slot,observed);
       let saved=recoveredAtSync.saved;
       if(recoveredAtSync.storeChanged) storeChanged=true;
       let keep=collapseDuplicateIdentityHosts(el,key,'independent',sourceHash);
       const manualIntent=st.independentGenerationTiming==='manual'?manualIntentForMessage(ctx,i):null;
       if(keep?.dataset?.rmState==='manual' && (!manualIntent || manualIntent.cancelled || !manualIndependentTiming())){
        keep.remove();keep=null;
       }
       if(manualIntent && !manualIntent.consumed && !saved?.html && !activeBaseFlight){
        keep=ensureManualGenerationPlaceholder(ctx,i,m,manualIntent)||keep;
       }
       // Migrate beta.14.54-beta.14.64 CSS-only failure notices into a real,
       // actionable error placeholder. Those old hosts hid the stale details
       // and exposed only a ::before sentence, so neither the feedback cat nor
       // a retry control could be reached.
       if(keep?.dataset?.rmAwaitingFreshSource==='true' && keep.dataset.rmFreshSourceStatus==='error'){
         clearExternalHostFreshSourceState(keep);
         keep=ensureExternalUi(el,key,'独立 API 生成失败。可直接重新生成兔子镜，或打开挨打猫后重说。','error','independent',sourceHash);
       }
       if(keep?.dataset?.rmState==='ready' && !usableReadyDetails(keep.querySelector?.(':scope > details'))){ keep.remove(); keep=null; }
       // A mounted ready mirror may seed the stable owner only while its stamped
       // chat+mesid+swipe+sourceHash still exactly matches the current正文. A DOM
       // replacement preserves that identity; a Swipe or正文 change must fall
       // through to the existing stale-source/new-generation path instead.
       const mountedReadyMatchesObserved=mountedIndependentReadyHostMatchesObserved(keep,ctx,i,m,observed,key);
       const mountedReadyPassiveSourceDrift=!!(!mountedReadyMatchesObserved
        && mountedIndependentReadyHostSharesStableOwner(keep,ctx,i,m)
        && !hasExplicitSourceReplacementEvidence(ctx,i,m,keep));
       const mountedReadyAtSync=!persistedSuppressed && !ownerLocked?.record && mountedReadyMatchesObserved ? readyRecordFromHost(keep,observed,st.independentApiModel) : null;
       if(mountedReadyAtSync?.html && !ownerLocked?.record){
         const mountedSlot=String(keep?.dataset?.rmKey||slot);
         const previous=store?.[mountedSlot];
         if(!previous?.html || String(previous.html)!==String(mountedReadyAtSync.html)){
           if(previous?.html) appendHistoryEntry(mountedSlot,previous);
           saveRecordForSlot(store,mountedSlot,mountedReadyAtSync,{dropLegacy:false}); storeChanged=true;
         }
         setOwnerLockForBase(baseSlot,mountedSlot,String(keep?.dataset?.rmSourceHash||sourceHash));
         writePersistedOwner(ctx,i,m,mountedReadyAtSync,{overwrite:false});
         ownerLocked={record:mountedReadyAtSync,lock:{slot:mountedSlot}};
         saved=mountedReadyAtSync;
       }
       if(displayModeChanged && keep){
         // Switching display mode only relocates the one existing mirror.
         placeExternalHost(el,keep,keep.dataset.rmKey||key,'independent');
       }
       const independentHosts=externalHosts(el).filter(n=>n.dataset.rmSource==='independent');
       for(const node of independentHosts){ if(node!==keep) node.remove(); }
       const isActiveGenerationTarget=i===activeGenerationIndex;
       const automaticGenerationSuppressed=suppressesAutomaticGeneration(ctx,i) || hasExistingFollowRabbitMirror(ctx,i,m);
       const quickWaiting=quickWaitingCandidate(ctx,i);

       // Never repaint an old mirror over a newly regenerated/swiped正文. A
       // record is eligible only for the exact current source fingerprint.
       if(saved?.html && !ownerLocked?.record && !savedRecordMatchesObserved(saved,observed)){
         // Synchronization is read-only for incompatible legacy records. Do
         // not destroy persisted mirrors merely because the current runtime
         // cannot prove a match; a later migration or Swipe may still recover
         // them. Actual replacement happens only when a new generation starts.
         saved=null;
       }
        const passiveFailure=!saved?.html && !persistedSuppressed && !activeBaseFlight
          && (!keep || keep.dataset?.rmState==='error')
          ? passiveIndependentFailureForIdentity(ctx,i,m,keep) : null;
        const passiveFailureHost=passiveFailure ? restorePassiveIndependentFailure(ctx,i,m,keep,passiveFailure) : null;
        if(passiveFailureHost){
          keep=passiveFailureHost;
        } else if(!saved?.html && !keep && activeBaseFlight){
          // A second host reply may replace the earlier message DOM while its
          // already-paid independent request is still unresolved. Reattach only
          // that exact owner shell; do not schedule or dispatch another request.
          keep=ensureExternalUi(el,key,'正在读取当前上下文并生成兔子镜……','loading','independent',sourceHash);
          if(keep) activeBaseFlight.loadingHost=keep;
        } else if(!saved?.html && !activeBaseFlight && !persistedSuppressed && !automaticGenerationSuppressed
          && (!keep || keep.dataset?.rmState==='loading') && automaticFailureStopFor(slot,sourceHash)){
          // Passive DOM replacement must restore the exact terminal state, never
          // schedule a request or turn the previous failure back into waiting.
          const live=currentGenerationIdentity(i);
          if(live?.slot===slot && live.sourceHash===sourceHash){
           keep=renderAutomaticFailureStop(i,live,automaticFailureStopFor(slot,sourceHash));
          }
        } else if(!saved?.html && !keep && !persistedSuppressed && (isActiveGenerationTarget && !automaticGenerationSuppressed || quickWaiting)){
          keep=ensureReplyGenerationPlaceholder(el,key,sourceHash,true);
        }
       const hostSourceHash=String(keep?.dataset?.rmSourceHash||'');
       const mountedReadyIdentityStale=!!(readyDetailsFromHost(keep) && !mountedReadyMatchesObserved && !mountedReadyPassiveSourceDrift);
       let hostIsStale=!!(keep && keep.dataset.rmState!=='manual' && !passiveFailureHost && !mountedReadyPassiveSourceDrift && (mountedReadyIdentityStale || (hostSourceHash && hostSourceHash!==sourceHash)));
       const keepIsReplyPlaceholder=!!(keep && (keep.dataset.rmReplyGenerationPlaceholder==='true' || (keep.dataset.rmState==='loading' && keep.querySelector?.(':scope > details.rabbit-mirror-external-placeholder'))));
        if(keepIsReplyPlaceholder && !saved?.html && automaticGenerationSuppressed && !quickWaiting && !activeBaseFlight){
          keep.remove();
          keep=null;
          hostIsStale=false;
        } else if(keepIsReplyPlaceholder && !saved?.html){
         // Streaming正文 changes its fingerprint repeatedly. Re-key the same
         // placeholder instead of treating it as an old completed mirror.
          keep=ensureReplyGenerationPlaceholder(el,key,sourceHash,isActiveGenerationTarget);
          if(keep && activeBaseFlight) activeBaseFlight.loadingHost=keep;
          hostIsStale=false;
       } else if(hostIsStale){
         // The mounted mirror belongs to the previous正文 version. Keep the one
         // shell anchored in place, but never show stale mirror content beside
         // the regenerated正文 while the new independent result is pending.
         placeExternalHost(el,keep,keep.dataset.rmKey||key,'independent');
         keep.hidden=false;
         keep.dataset.rmAwaitingFreshSource='true';
         keep.dataset.rmFreshSourceStatus='waiting';
       }
        const activePending=pending.get(slot)||activeBaseFlight;
       const manualResayPending=!!(activePending?.manual
        && !activePending.cancelled
        && ((activePending.manualBodyOwner && manualBodyOwnerCurrent(activePending.manualBodyOwner))
         || (String(activePending.sourceHash||'')===String(sourceHash||'')
          && Number(activePending.revision)===Number(observed.revision))));
       if(saved?.html && (ownerLocked?.record || savedRecordMatchesObserved(saved,observed))){
         if(bindIndependentRecordContinuity(ctx,i,m,saved,store)) storeChanged=true;
         if(!ownerLocked?.record){ setOwnerLockForBase(baseSlot,slot,sourceHash); writePersistedOwner(ctx,i,m,saved,{overwrite:false}); ownerLocked={record:saved,lock:{slot}}; }
         const host=ensureExternalUi(el,key,saved.html,'ready','independent',sourceHash,saved);
         if(host){
          rebuildCollapsedReadyHost(el,host,key,'independent',saved.html,sourceHash,saved);
          host.hidden=false;
          if(manualResayPending){
           // Pointer/focus history sync may remount the persisted old owner while a
           // paid manual resay is still active. Re-enter loading immediately so the
           // old ready details stay visible but never look idle before that flight ends.
           ensureExternalUi(el,key,'正在读取当前上下文并生成兔子镜……','loading','independent',sourceHash);
          } else clearExternalHostFreshSourceState(host);
         }
       } else if(keep && !hostIsStale){
         placeExternalHost(el,keep,keep.dataset.rmKey||key,'independent');
         if(mountedReadyPassiveSourceDrift) clearExternalHostFreshSourceState(keep);
         refreshExistingExternalDetails(keep,key,'independent');
       }
     } else {
       // Generation-source changes affect only future replies. Keep completed
       // independent mirrors, but remove any abandoned loading/error placeholder
       // left by a cancelled independent run. A follow display-mode switch must
       // never appear to start an independent generation.
       settleIndependentHostsForInactiveSource(el);
       // Existing exact independent RabbitMirrors remain visible and are
       // passively remounted from cache after SillyTavern replaces a message DOM.
       if(restoreIndependentMirrorPassively(ctx,store,el,i,m)) storeChanged=true;
       if(mode==='follow-external') externalizeFollowMirror(i,m); else restoreFollowInline(el);
     }
     if(mode==='independent'){
       const independentHost=externalHosts(el).find(node=>node.dataset.rmSource==='independent');
       if(independentHost) removeIndependentInlineDuplicates(el,independentHost,independentHost.dataset.rmKey||recordKey(ctx,i,m));
     }
   }
   if(storeChanged) writeStore(store);
 } finally { writeSyncRunning(false); }
}

function pruneForeignChatExternalHosts(){
 const current=chatKey(getContext());
 for(const host of allExternalHosts()){
   const ownerChat=String(host.dataset.rmOwnerChat||'');
   if(ownerChat && ownerChat!==current) host.remove();
 }
}

function reconcileVisibleMirrorDuplicates(indices=null){
 const end=beginHostWorkTiming('independent.reconcileVisibleMirrorDuplicates');
 try{ return reconcileVisibleMirrorDuplicatesCore(indices); }finally{ end?.(); }
}

function reconcileVisibleMirrorDuplicatesCore(indices=null){
 const ctx=getContext();
 const mode=runtimeMode();
 const allowed=indices instanceof Set?indices:null;
  const rows=allowed
   ? [...allowed].slice(0,12).map(i=>({m:ctx.chat?.[i],i})).filter(({m})=>isRabbitMirrorEligibleAssistantMessage(m))
  : assistantMessages(ctx);
 for(const {m,i} of rows){
  const el=messageElement(i); if(!el) continue;
  if(mode==='follow-external'){
   externalizeFollowMirror(i,m);
   continue;
  }
  if(mode==='independent'){
   const key=recordKey(ctx,i,m);
   const host=collapseDuplicateIdentityHosts(el,key,'independent',messageSourceFingerprint(m))
    || externalHosts(el).find(node=>node.dataset.rmSource==='independent')
    || null;
   if(host){
    // Hot updates, BFCache restores and a second legacy extension copy can leave
    // a ready independent host inside the inline anchor even though the current
    // setting is “纯外置”. Re-apply the selected placement on every finite
    // reconciliation pass; placeExternalHost still keeps loading shells external
    // and honours external_then_inline for completed mirrors.
    placeExternalHost(el,host,host.dataset.rmKey||key,'independent');
    removeIndependentInlineDuplicates(el,host,host.dataset.rmKey||key);
   }
   continue;
  }
  if(mode==='inline') removeExternalDuplicatesPreferInline(el);
 }
 if(allowed){
  for(const {i} of rows){ const el=messageElement(i); if(el){ removeEmptyInlineAnchors(el); removeEmptyFollowExternalAnchors(el); } }
 }else{
  removeEmptyInlineAnchors(document);
  removeEmptyFollowExternalAnchors(document);
 }
}

function syncAll(reason='unknown',detail={}){
 const diag=globalThis.__rabbitMirrorPerfDiag;
 const ctx=getContext();
 const end=diag?.begin?.('independent.syncAll',{reason:String(reason||'unknown'),...detail,mode:runtimeMode(),assistantMessages:assistantMessages(ctx).length},0);
 try{
  return withOwnerLockStoreBatch(()=>withRestorableHtmlCacheBatch(()=>withHistoricalRestoreLightPass(()=>withExternalHostSyncIndex(()=>{
   pruneForeignChatExternalHosts();
   syncMessages(null);
   reconcileVisibleMirrorDuplicates();
  }))));
 }finally{ end?.({chatMessages:Array.isArray(ctx?.chat)?ctx.chat.length:0}); }
}

function clearStartupHistoryLazySync(){
 if(startupHistoryFallbackRoot && startupHistoryFallbackHandler){
  try{ startupHistoryFallbackRoot.removeEventListener('scroll',startupHistoryFallbackHandler,false); }catch{}
  try{ startupHistoryFallbackRoot.removeEventListener('pointerdown',startupHistoryFallbackHandler,true); }catch{}
  try{ startupHistoryFallbackRoot.removeEventListener('focusin',startupHistoryFallbackHandler,true); }catch{}
 }
 writeStartupHistoryFallbackRoot(null); writeStartupHistoryFallbackHandler(null);
}

function syncMessageBatch(indices=[],historyRestoreLight=true){
 const batch=new Set((Array.isArray(indices)?indices:[]).filter(index=>Number.isInteger(index)&&index>=0));
 if(!batch.size) return;
 const end=globalThis.__rabbitMirrorPerfDiag?.begin?.('independent.syncMessageBatch',{count:batch.size,historyRestoreLight:!!historyRestoreLight},5);
 const run=()=>withOwnerLockStoreBatch(()=>withRestorableHtmlCacheBatch(()=>{
  syncMessages(batch);
  reconcileVisibleMirrorDuplicates(batch);
 }));
 try{ return historyRestoreLight ? withHistoricalRestoreLightPass(run) : run(); }
 finally{ end?.(); }
}

function viewportMessageIndices(chat,limit=STARTUP_SYNC_IMMEDIATE_MESSAGES){
 const end=beginHostWorkTiming('independent.viewportMessageIndices');
 try{ return viewportMessageIndicesCore(chat,limit); }finally{ end?.(); }
}

function viewportMessageIndicesCore(chat,limit=STARTUP_SYNC_IMMEDIATE_MESSAGES){
 const found=new Set(); const max=Math.max(1,Math.min(8,Number(limit)||STARTUP_SYNC_IMMEDIATE_MESSAGES));
 const add=node=>{
  const message=node?.closest?.('.mes[mesid], [mesid].mes') || (node?.matches?.('.mes[mesid], [mesid].mes')?node:null);
  if(!message || !chat.contains?.(message)) return;
  const index=Number(message.getAttribute?.('mesid')); if(Number.isInteger(index)&&index>=0) found.add(index);
  let before=message.previousElementSibling; let after=message.nextElementSibling;
  for(let i=0;i<2 && found.size<max;i++){
   for(const sibling of [before,after]){
    const id=Number(sibling?.getAttribute?.('mesid')); if(Number.isInteger(id)&&id>=0) found.add(id);
   }
   before=before?.previousElementSibling; after=after?.nextElementSibling;
  }
 };
 try{
  const rect=chat.getBoundingClientRect?.();
  if(rect && typeof document.elementsFromPoint==='function'){
   const x=Math.max(rect.left+1,Math.min(rect.right-1,rect.left+rect.width/2));
   for(const y of [rect.top+4,rect.top+rect.height/2,rect.bottom-4]){
    for(const node of document.elementsFromPoint(x,y)||[]){ add(node); if(found.size>=max) break; }
    if(found.size>=max) break;
   }
  }
 }catch{}
 if(!found.size){
  let node=chat.lastElementChild;
  while(node && found.size<max){ add(node); node=node.previousElementSibling; }
 }
 return [...found].slice(0,max);
}
// This cache only suppresses passive viewport probes. Host events, explicit
// repairs and structural replacement observers retain their existing sync path.

function restoredHistoryProbeState(ctx,index){
 const message=ctx.chat?.[index],element=messageElement(index);
 if(!element || !isRabbitMirrorEligibleAssistantMessage(message)) return null;
 const hosts=externalHosts(element).filter(host=>host.dataset.rmSource==='independent');
 if(hosts.length!==1) return null;
 const host=hosts[0];
 if(!host.isConnected || host.dataset.rmState!=='ready' || host.dataset.rmAwaitingFreshSource==='true') return null;
 const faces=externalFaceDetails(host);
 if(!faces.length) return null;
 return {element,message,chat:ctx.chat,chatKey:chatKey(ctx),host,faces,
  body:String(message.mes||''),display:String(message.extra?.display_text||''),reasoning:String(message.extra?.reasoning||''),
  swipe:swipeId(message),source:host.__rabbitMirrorIndependentSource,
  textRoot:element.querySelector?.('.mes_text'),
  tools:[...(host.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-recipe]')||[])]};
}

function sameRestoredHistoryProbe(a,b){
 return !!(a&&b&&a.element===b.element&&a.message===b.message&&a.chat===b.chat&&a.chatKey===b.chatKey
  &&a.host===b.host&&a.body===b.body&&a.display===b.display&&a.reasoning===b.reasoning&&a.swipe===b.swipe
  &&a.source===b.source&&a.textRoot===b.textRoot&&a.faces.length===b.faces.length&&a.faces.every((face,i)=>face===b.faces[i])
  &&a.tools.length===b.tools.length&&a.tools.every((tool,i)=>tool===b.tools[i]));
}

function installStartupHistoryLazySync(expectedSequence=runtimeConfigSequence){
 clearStartupHistoryLazySync();
 if(isRabbitMirrorManagedChatSurface()){ installManagedIndependentMessages(); return; }
 const chat=document.querySelector('#chat');
 if(!chat) return;
 const restored=new WeakMap();
 let queued=false;
 const probe=()=>{
  if(queued) return; queued=true;
  setTimeout(()=>{
   queued=false;
   if(expectedSequence!==runtimeConfigSequence || !currentRuntime()) return;
   const ctx=getContext();
   const visible=viewportMessageIndices(chat,STARTUP_SYNC_IMMEDIATE_MESSAGES);
   const ready=visible.filter(index=>{
    if(!isRabbitMirrorEligibleAssistantMessage(ctx.chat?.[index])) return false;
    const state=restoredHistoryProbeState(ctx,index);
    return !state || !sameRestoredHistoryProbe(restored.get(state.element),state);
   });
   if(ready.length) syncMessageBatch(ready,true);
   for(const index of ready){
    const state=restoredHistoryProbeState(ctx,index);
    if(state) restored.set(state.element,state);
   }
  },80);
 };
 writeStartupHistoryFallbackRoot(chat); writeStartupHistoryFallbackHandler(probe);
 chat.addEventListener('scroll',probe,{passive:true});
 chat.addEventListener('pointerdown',probe,true); chat.addEventListener('focusin',probe,true);
 probe();
}

export function scheduleStartupHistorySync(expectedSequence=runtimeConfigSequence){
 if(isRabbitMirrorManagedChatSurface()){
  installManagedIndependentMessages();
  syncMessageBatch(getRabbitMirrorMountedMessages().filter(context=>!context.signal.aborted).map(context=>context.mesid),true);
  return;
 }
 const ctx=getContext();
 const immediate=recentAssistantMessages(ctx,STARTUP_SYNC_IMMEDIATE_MESSAGES).map(item=>Number(item.i)).filter(index=>Number.isInteger(index)&&index>=0);
 globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.startupHistorySync',{bounded:true,immediate:immediate.length,mode:runtimeMode()});
 syncMessageBatch(immediate,true);
 installStartupHistoryLazySync(expectedSequence);
}

export function queueMessageSync(indices=[]){
 for(const index of indices){ if(Number.isInteger(index) && index>=0) queuedIndices.add(index); }
 if(syncTimer) return;
 writeSyncTimer(setTimeout(()=>{
   writeSyncTimer(null);
   const batch=queuedIndices; writeQueuedIndices(new Set());
   if(batch.size){
    withOwnerLockStoreBatch(()=>withRestorableHtmlCacheBatch(()=>{
     syncMessages(batch);
     reconcileVisibleMirrorDuplicates(batch);
    }));
   }
 },120));
}

function nodeMessageIndex(node){
 const el=node?.nodeType===1?node:node?.parentElement;
 const mes=el?.closest?.('.mes[mesid], [mesid].mes, [mesid]');
 const id=Number(mes?.getAttribute?.('mesid'));
 return Number.isInteger(id)&&id>=0?id:null;
}

function removedMutationIndices(records){
 const found=new Set();
 for(const rec of records){
   const target=rec.target?.nodeType===1?rec.target:rec.target?.parentElement;
   // Removed children have already lost their parent. Classifying only the
   // detached node treated our own toolbar/scene refresh as a host replacement.
   if(target?.closest?.(`[${SOURCE_ATTR}], toto, [data-rabbit-mirror-tool-entry-host]`)) continue;
    const targetId=nodeMessageIndex(target);
    for(const node of [...(rec.removedNodes||[])]){
      const el=node?.nodeType===1?node:null;
      if(!el) continue;
      if(el.matches?.(`[${SOURCE_ATTR}]`)){
        const owner=Number(el.dataset?.rmOwnerMesid ?? el.dataset?.rmExternalOwnerMessage);
        if(Number.isInteger(owner)&&owner>=0) found.add(owner);
        continue;
      }
      if(el.closest?.(`[${SOURCE_ATTR}]`)) continue;
     if(targetId!==null){
       found.add(targetId);
       continue;
     }
     if(el.matches?.('.mes[mesid], [mesid].mes, [mesid]')){
       const id=Number(el.getAttribute?.('mesid'));
       if(Number.isInteger(id)&&id>=0) found.add(id);
       continue;
     }
     // Only direct #chat removals may contain removed message wrappers. Do not
     // recursively inspect arbitrary popup/drawer subtrees on close.
     if(target?.id==='chat'){
       for(const root of el.querySelectorAll?.('.mes[mesid], [mesid].mes')||[]){
         const id=Number(root.getAttribute?.('mesid'));
         if(Number.isInteger(id)&&id>=0) found.add(id);
       }
     }
   }
 }
 return found;
}

function relevantMutationIndices(records){
 const found=new Set();
 for(const rec of records){
   const target=rec.target?.nodeType===1?rec.target:rec.target?.parentElement;
   if(target?.closest?.(`[${SOURCE_ATTR}], toto, [data-rabbit-mirror-tool-entry-host]`)) continue;
   const targetId=nodeMessageIndex(target);
   // 1.3.20: never descend through unrelated SillyTavern drawer/popup DOM that
   // happens to be mounted under #chat. Only message-scoped mutations are allowed
   // to inspect descendants for RabbitMirror structures.
   for(const node of [...(rec.addedNodes||[])]){
     const el=node?.nodeType===1?node:null;
     if(!el) continue;
     if(el.matches?.(`[${SOURCE_ATTR}]`)){
       const owner=Number(el.dataset?.rmOwnerMesid ?? el.dataset?.rmExternalOwnerMessage);
       if(Number.isInteger(owner)&&owner>=0) found.add(owner);
       continue;
     }
     if(el.matches?.('[data-rabbit-mirror-tool-entry-host]') || el.closest?.(`[${SOURCE_ATTR}], [data-rabbit-mirror-tool-entry-host]`)) continue;

     const ownId=nodeMessageIndex(el);
     if(ownId!==null){
       const relevant=el.matches?.('.mes, .mes_text, toto, details') || !!el.querySelector?.('toto, details');
       if(relevant) found.add(ownId);
       continue;
     }
     if(targetId!==null){
       const relevant=el.matches?.('.mes_text, toto, details') || !!el.querySelector?.('toto, details');
       if(relevant) found.add(targetId);
       continue;
     }

     // Only a direct #chat insertion is allowed to contain brand-new message
     // wrappers. Search for .mes roots, not arbitrary details/toto descendants.
     if(target?.id==='chat'){
       for(const nested of el.querySelectorAll?.('.mes[mesid], [mesid].mes')||[]){
         const id=Number(nested.getAttribute?.('mesid'));
         if(Number.isInteger(id)&&id>=0) found.add(id);
       }
     }
   }
 }
 return found;
}

function clearGenerationPolls(){
 for(const entry of generationPolls.values()){ entry.cancelled=true; if(entry.timer) clearTimeout(entry.timer); }
 generationPolls.clear();
}

function clearLatestGenerationScheduling(){
 clearGenerationPlaceholderPoll();
}

export function clearScheduledGeneration(){
 clearLatestGenerationScheduling();
 clearGenerationPolls();
}

export function unsubscribeHostEvents(){
 for(const {es,event,handler} of hostSubscriptions){ try{ es?.off?.(event,handler); }catch{} }
 writeHostSubscriptions([]);
}

export function disconnectObserver(){
 observer?.disconnect?.(); writeObserver(null);
 if(syncTimer){clearTimeout(syncTimer);writeSyncTimer(null);}
 queuedIndices.clear();
 for(const timer of orphanExternalHostTimers.values()) clearTimeout(timer);
 orphanExternalHostTimers.clear();
}

export function clearPassiveRecoveryTimers(){
 for(const timer of passiveRecoveryTimers) clearTimeout(timer);
 passiveRecoveryTimers.clear();
 clearStartupHistoryLazySync();
}

function currentChatHasRestorableIndependentRecord(){
 const ctx=getContext();
 const rows=recentAssistantMessages(ctx,12);
 const end=globalThis.__rabbitMirrorPerfDiag?.begin?.('independent.probeRestorableHistory',{assistantMessages:rows.length},8);
 const store=readStore();
 let found=false;
 try{
  for(const {m,i} of rows){
   const observed=passiveObservedIdentity(ctx,i,m);
   const saved=findSavedRecord(store,observed.slot,observed.legacySlots||[]);
   if(saved?.html && independentStoredHtmlRestorable(saved.html) && savedRecordMatchesObserved(saved,observed)){ found=true; return true; }
   if(historyRecoveryForObserved(observed.slot,observed)?.html){ found=true; return true; }
  }
  return false;
 }finally{ end?.({found}); }
}

export function schedulePassiveRecoveryAfterSourceSwitch(expectedSequence=runtimeConfigSequence){
 clearPassiveRecoveryTimers();
 globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.passiveRecovery.schedule',{mode:runtimeMode(),bounded:true});
 for(const delay of [120,850]){
  const timer=setTimeout(()=>{
   passiveRecoveryTimers.delete(timer);
   if(expectedSequence!==runtimeConfigSequence || !currentRuntime()) return;
   const mode=runtimeMode();
   if(mode==='off') return;
   globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.passiveRecovery.fire',{delay,mode,bounded:true});
   // A hot update or source switch can coincide with SillyTavern replacing the
   // message DOM after the first synchronous pass. Run two finite, read-only
   // reconciliations in every active mode: they remount historical follow/API
   // mirrors from message source or exact cache and never issue a network POST.
   globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.boundedRecovery',{reason:'passive-recovery',delay});
   scheduleStartupHistorySync(expectedSequence);
   if(!observer) installObserverIfNeeded();
  },delay);
  passiveRecoveryTimers.add(timer);
 }
}

function installManagedIndependentMessages(){
 if(managedIndependentMessagesUnsubscribe || !isRabbitMirrorManagedChatSurface()) return;
 const install=(context,wholeMessage=false)=>{
  if(context.signal.aborted || !context.element?.isConnected || !currentRuntime()) return;
  if(runtimeMode()!=='off') syncMessageBatch([context.mesid],true);
  if(runtimeMode()==='independent'){
   const ctx=getContext();
   const id=context.mesid;
   const remounted=remountVisibleFloorFromCache(id);
   ensureGenerationPlaceholderForIndex(id,hostGenerationLooksActive());
   if(!wholeMessage){
    if(recoverDeferredAutomaticHostCompletion(ctx,id,'visible-floor-content-commit')) return;
    if(!remounted && !suppressesAutomaticGeneration(ctx,id)){
     const live=currentGenerationIdentity(id);
     if(live && String(live.msg?.mes||'').trim() && !hasGenerationWorkFor(id,live.slot,live.sourceHash)){
      scheduleMessageGeneration(id,200,true);
     }
    }
   }
  }
  if(!wholeMessage) return;
  return ()=>{
   queuedIndices.delete(context.mesid);
   clearOrphanExternalHostTimer(String(context.mesid));
   const hosts=externalHosts(context.element).filter(host=>context.element.contains(host));
   for(const host of hosts){
    // Visible-floor dispose only detaches this projection. Cache/history stay for remount.
    if(context.element.contains(host)) host.remove();
   }
  };
 };
 writeManagedIndependentMessagesUnsubscribe(subscribeRabbitMirrorChatSurface({id:'rabbitmirror/independent-messages',didMount:context=>install(context,true),didCommitContent:install}));
}

export function installObserverIfNeeded({skipHistoricalProbe=false}={}){
 disconnectObserver();
 if(isRabbitMirrorManagedChatSurface()){
  clearStartupHistoryLazySync();
  const ttStart=ttSurfaceNow();
  installManagedIndependentMessages();
  recordTtSurface('install',{sub:'independent-messages',ms:ttStart?performance.now()-ttStart:0});
  return;
 }
 const mode=runtimeMode();
 const liveIndependent=allExternalHosts().some(node=>node.dataset.rmSource==='independent');
 const preserveIndependentInInline=mode==='inline' && (liveIndependent || (!skipHistoricalProbe && currentChatHasRestorableIndependentRecord()));
 if(mode==='off' || (mode==='inline' && !preserveIndependentInInline) || typeof MutationObserver==='undefined') return;
 const chat=document.querySelector('#chat'); if(!chat) return;
  writeObserver(new MutationObserver(records=>{
   const end=globalThis.__rabbitMirrorPerfDiag?.begin?.('independent.mutationObserver',{records:records.length},8);
   // Streaming mutations are finalized by GENERATION_ENDED/STOPPED. Scanning the
   // current message on every token used to turn a long reply into repeated full
   // source/DOM passes even though no paid request may start before completion.
    if(hostGenerationLooksActive()){
     if(manualIndependentTiming()) handleIndependentManualBridge({kind:'changed'});
     // Do not scan streaming additions. Removals are different: SillyTavern may
     // replace an older message wrapper or its external RabbitMirror shell when
     // a new reply starts. Recover only those exact owner ids, with no chat-wide
     // traversal and no generation call.
     const removed=removedMutationIndices(records);
     for(const id of removed){ if(!messageElement(id)) markExternalHostsAwaitingOwner(id); }
     if(removed.size) queueMessageSync(removed);
     end?.({affectedMessages:removed.size,removedMessages:removed.size,skippedStreaming:true,boundedOwnerRecovery:true});
     return;
    }
   const removed=removedMutationIndices(records);
   for(const id of removed){
     if(!messageElement(id)) markExternalHostsAwaitingOwner(id);
   }
   const indices=relevantMutationIndices(records);
   for(const id of removed) indices.add(id);
   if(indices.size) queueMessageSync(indices);
   end?.({affectedMessages:indices.size,removedMessages:removed.size});
 }));
 observer.observe(chat,{childList:true,subtree:true});
}

function resolveHostEventMessageIndex(payload,ctx=getContext(),{fallbackLastAssistant=true}={}){
 const chat=Array.isArray(ctx?.chat)?ctx.chat:[];
 let raw=payload;
 if(payload && typeof payload==='object' && !Array.isArray(payload)){
  raw=payload.messageId ?? payload.message_id ?? payload.mesid ?? payload.index ?? payload.id;
  if(raw===undefined){
   const exact=chat.indexOf(payload);
   if(exact>=0) raw=exact;
  }
 }
 const explicit=typeof raw==='number' || (typeof raw==='string' && /^\d+$/.test(raw.trim()));
 const parsed=explicit?Number(raw):NaN;
 if(Number.isSafeInteger(parsed) && parsed>=0 && isRabbitMirrorEligibleAssistantMessage(chat?.[parsed])) return parsed;
 if(!fallbackLastAssistant) return null;
 const last=lastAssistantMessage(ctx)?.i;
 return Number.isInteger(last)&&last>=0?last:null;
}

function syncUpdatedIndependentMessage(payload){
 // MESSAGE_UPDATED is a repaint/postprocessing signal, never a generation
 // intent. Require its explicit id: Number(null/empty) must not select mesid 0.
 if(runtimeMode()!=='independent') return;
 const raw=payload && typeof payload==='object' && !Array.isArray(payload)
  ? payload.messageId ?? payload.message_id ?? payload.mesid ?? payload.index ?? payload.id : payload;
 if(typeof raw==='string' ? !/^\d+$/.test(raw.trim()) : typeof raw!=='number' || !Number.isSafeInteger(raw)) return;
 if(!Number.isSafeInteger(Number(raw)) || Number(raw)<0) return;
 const id=resolveHostEventMessageIndex(raw,getContext(),{fallbackLastAssistant:false});
 if(Number.isInteger(id)&&id>=0) queueMessageSync([id]);
}

export async function installHostEventsIfNeeded(expectedSequence=runtimeConfigSequence){
 unsubscribeHostEvents();
 const mode=runtimeMode(); if(mode==='off'||mode==='inline') return;
 try{
   writeHostModule(hostModule || await import('../../../../../../script.js'));
   if(expectedSequence!==runtimeConfigSequence || !currentRuntime()){ return; }
   const activeMode=runtimeMode();
   if(activeMode==='off'||activeMode==='inline'){ return; }
   unsubscribeHostEvents();
   const es=hostModule?.eventSource, et=hostModule?.event_types||{};
   const fullSyncEvents=[et.CHAT_CHANGED].filter(Boolean);
   const generationStartedEvents=[et.GENERATION_STARTED].filter(Boolean);
   const generationFinishedEvents=[et.GENERATION_ENDED,et.GENERATION_STOPPED].filter(Boolean);
   const swipeEvents=[et.MESSAGE_SWIPED].filter(Boolean);
   const worldInfoEntriesLoadedEvents=[et.WORLDINFO_ENTRIES_LOADED].filter(Boolean);
   const worldInfoActivatedEvents=[et.WORLD_INFO_ACTIVATED].filter(Boolean);
   const renderOnlyEvents=[et.MESSAGE_RECEIVED].filter(Boolean);
   const finalRenderEvents=[et.CHARACTER_MESSAGE_RENDERED].filter(Boolean);
    if(et.MESSAGE_UPDATED){
     es?.on?.(et.MESSAGE_UPDATED,syncUpdatedIndependentMessage);
     hostSubscriptions.push({es,event:et.MESSAGE_UPDATED,handler:syncUpdatedIndependentMessage});
    }
   for(const event of new Set(fullSyncEvents)){
      const handler=()=>{
        writeHostGenerationInProgress(false); writeHostGenerationHintStartedAt(0); clearScheduledGeneration(); cancelAllIndependentFlights('chat-changed'); clearIndependentRejectedFacePreviews(); messageSourceRevisions.clear(); writeActiveGlobalWorldInfoCapture(null);
        globalThis[INDEPENDENT_GENERATION_INTENTS_KEY]=[];
        globalThis[INDEPENDENT_GENERATION_STOPS_KEY]=[];
        dispatchWorldInfoBooksChanged(currentWorldInfoBookScope());
       clearAutomaticGenerationCutovers();
       if(runtimeMode()==='independent') ensureAutomaticGenerationCutover(getContext());
       // Do not invalidate every mounted mirror's geometry merely because the chat
       // changed. New/replaced message DOM is detected per host by owner-dom-replaced;
       // real viewport changes have their own geometry refresh path.
       globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.boundedRecovery',{reason:'host:CHAT_CHANGED',event:String(event||'CHAT_CHANGED')});
       scheduleStartupHistorySync(runtimeConfigSequence);
     };
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
    for(const event of new Set(generationStartedEvents)){
      const handler=(_type,_options,dryRun=false)=>{
        const normalizedType=typeof _type==='string'?_type.trim().toLowerCase():'';
        const ctx=getContext();
        const existingOwner=automaticGenerationCutovers.get(chatKey(ctx))?.activeHostGeneration;
        // Official tool recursion appends a strongly marked tool-result system
        // message before re-entering Generate('normal'). External activity flags
        // alone are insufficient: a later unrelated generation can see stale flags.
        const nestedStart=normalizedType==='normal' && !!existingOwner && automaticHostToolResultTail(ctx);
        const ownerStartKind=beginAutomaticHostGeneration(ctx,normalizedType,nestedStart,dryRun);
        if(ownerStartKind==='new' || ownerStartKind==='nested') beginGlobalWorldInfoCapture(ctx,dryRun,_type,_options,ownerStartKind==='nested');
        // A new assistant reply must not cancel the previous reply's already
        // queued RabbitMirror poll. Each message owns its own poll/flight; only
        // the transient latest/placeholder scheduler is replaced here.
        if(ownerStartKind==='new'){
          writeHostGenerationInProgress(true);
          writeHostGenerationHintStartedAt(Date.now());
          clearLatestGenerationScheduling();
          scheduleGenerationPlaceholderPoll(60);
        }
        if(ownerStartKind==='new' || ownerStartKind==='nested') scheduleAutomaticHostGenerationSettlement();
       // GENERATION_STARTED alone is never source-replacement evidence. Genuine
       // Swipe/regenerate正文 changes are cancelled by MESSAGE_SWIPED or the exact
       // sourceHash/revision checks in syncMessages(), while auxiliary starts leave
       // the already-paid response and its loading UI untouched.
     };
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
   for(const event of new Set(worldInfoEntriesLoadedEvents)){
     const handler=payload=>captureGlobalWorldInfoEntriesLoaded(payload);
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
   for(const event of new Set(worldInfoActivatedEvents)){
     const handler=entries=>captureActivatedGlobalWorldInfo(entries);
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
    for(const event of new Set(generationFinishedEvents)){
      const handler=payload=>{
        const finishedContext=getContext();
        queueManualGenerationTerminalSync();
        if(runtimeMode()==='follow-external'){
          const id=resolveHostEventMessageIndex(payload,finishedContext,{fallbackLastAssistant:true});
          if(Number.isInteger(id)&&id>=0) queueMessageSync([id]);
          return;
        }
        // END/STOP has neither type nor message id. Treat it only as a terminal
        // hint; a quiet/impersonate completion must not bind the partial tail or
        // clear the outer owner's placeholder and World Info capture.
        if(noteAutomaticHostGenerationTerminal(finishedContext,String(event||'host-generation-finished'))){
          scheduleAutomaticHostGenerationSettlement();
          return;
        }
        const last=lastAssistantMessage(finishedContext);
        if(!last || !recoverDeferredAutomaticHostCompletion(finishedContext,last.i,'host-generation-finished-deferred')){
          globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.eventNoOwner',{reason:last?'host:generation-finished-without-start':'host:generation-finished:fallback',event:String(event||'generation-finished')});
        }
      };
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
   for(const event of new Set(swipeEvents)){
     const handler=messageId=>{
       const ctx=getContext();
       const id=resolveHostEventMessageIndex(messageId,ctx,{fallbackLastAssistant:true});
       if(Number.isInteger(id)&&id>=0){
       const early=automaticGenerationCutovers.get(chatKey(ctx))?.earlyBodies?.get(id);
       if(early && ctx.streamingProcessor===early.processor && earlyBodyOwnerCurrent(early)){
        // A delayed event describing the already-owned current swipe is not a
        // second host operation and must not create a second paid epoch.
        queueMessageSync([id]);return;
       }
       if(early){cancelEarlyBodyOwner(early,'swipe-changed');automaticGenerationCutovers.get(chatKey(ctx)).earlyBodies.delete(id);}
       independentRecordContinuity.delete(ctx.chat?.[id]);
       unlockAutomaticGenerationCutover(ctx,id,'host-swipe');
       const message=ctx.chat?.[id];
         const currentBase=isRabbitMirrorEligibleAssistantMessage(message)?messageBaseSlotKey(ctx,id,message):'';
         if(currentBase) advanceOperationEpochForBase(currentBase,'host-swipe',automaticCutoverVersionToken(message));
         // Some hosts emit MESSAGE_SWIPED after the new swipe's generation has
         // already started. Preserve that exact current operation, while still
         // aborting every older swipe/source flight for this chat+message.
         cancelFlightsForMessage(id,'swipe-changed',currentBase);
         queueMessageSync([id]);
         scheduleMessageGeneration(id,260,true);
       } else globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.eventNoOwner',{reason:'host:MESSAGE_SWIPED:fallback',event:String(event||'MESSAGE_SWIPED')});
     };
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
   // MESSAGE_RECEIVED / CHARACTER_MESSAGE_RENDERED may be the only reliable
   // completion signal in some mobile WebViews. They may schedule the exact stable
   // version only when no poll, pending task or shared flight already owns it.
   for(const event of new Set(renderOnlyEvents)){
     const handler=messageId=>{
       const ctx=getContext();
       const id=resolveHostEventMessageIndex(messageId,ctx,{fallbackLastAssistant:true});
       if(Number.isInteger(id)&&id>=0){
         noteAutomaticHostGenerationReceived(ctx,id);
         scheduleAutomaticHostGenerationSettlement();
         const active=hostGenerationLooksActive();
         if(active) ensureGenerationPlaceholderForIndex(id,true);
         if(runtimeMode()!=='follow-external' || !active) queueMessageSync([id]);
         if(!active && !suppressesAutomaticGeneration(ctx,id)){
           const live=currentGenerationIdentity(id);
           if(live && String(live.msg?.mes||'').trim() && !hasGenerationWorkFor(id,live.slot,live.sourceHash)) scheduleMessageGeneration(id,180,true);
         }
       } else globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.eventNoOwner',{reason:'host:render-event:fallback',event:String(event||'render-event')});
     };
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
   // CHARACTER_MESSAGE_RENDERED binds an exact painted body, but can also be a
   // tool-intermediate frame. Synchronous stream/capability/owner checks below
   // decide whether it is final; this event never dispatches a request directly.
    for(const event of new Set(finalRenderEvents)){
      const handler=messageId=>{
        const ctx=getContext();
        // This event carries the only exact message id in the host lifecycle.
        // Invalid payloads must not silently fall back to the current tail.
        const id=resolveHostEventMessageIndex(messageId,ctx,{fallbackLastAssistant:false});
        if(Number.isInteger(id)&&id>=0){
          const active=hostGenerationLooksActive();
          if(active) ensureGenerationPlaceholderForIndex(id,true);
         queueMessageSync([id]);
         // Some WebViews omit GENERATION_ENDED/STOPPED, and a cold deferred
         // runtime can miss GENERATION_STARTED as well. This event is the host's
         // exact paint, so it may close only a proven active lifecycle or
         // the exact generation intent captured by the lightweight interceptor.
         // Historical renders have neither proof and remain default-denied.
         // Do not bind the unscoped active lifecycle to this render id: a host or
         // extension may repaint an old message while a new reply is generating.
         // Only the interceptor's chat + tail role/hash proof may authorize this
         // exact id when END/STOP is missing.
          const ownerObserved=noteAutomaticHostGenerationRender(ctx,id);
          if(ownerObserved) scheduleAutomaticHostGenerationSettlement();
          else if(!automaticGenerationCutovers.get(chatKey(ctx))?.activeHostGeneration) recoverDeferredAutomaticHostCompletion(ctx,id,'final-render-deferred');
         if(!suppressesAutomaticGeneration(ctx,id)){
           const live=currentGenerationIdentity(id);
           if(live && String(live.msg?.mes||'').trim()){
             if(!confirmFinalRenderedGeneration(id) && !hasGenerationWorkFor(id,live.slot,live.sourceHash)) scheduleMessageGeneration(id,FINAL_RENDER_POLL_INTERVAL_MS,true,true);
           }
         }
       } else globalThis.__rabbitMirrorPerfDiag?.mark?.('independent.eventNoOwner',{reason:'host:CHARACTER_MESSAGE_RENDERED:fallback',event:String(event||'CHARACTER_MESSAGE_RENDERED')});
     };
     es?.on?.(event,handler); hostSubscriptions.push({es,event,handler});
   }
 }catch(e){ console.warn('[RabbitMirror] independent host events unavailable',e); }
}

export function independentRequestConfigSignature(st=getSettings()){
 const base=[st?.generationSource,normalizeIndependentConnectionText(st?.independentConnectionProfileId,160)||normalizeBase(st?.independentApiBaseUrl||''),String(st?.independentApiModel||''),Number(st?.independentApiTemperature)||0,Number(st?.independentApiMaxTokens)||12000].join('|');
 const advanced=st?.independentAdvancedEnabled===true?independentAdvancedOptionsSignature(st):'';
 return advanced?`${base}|advanced:${advanced}`:base;
}

export function captureMountedIndependentPlaceholderIndices(){
 const ctx=getContext(); const currentChat=chatKey(ctx); const indices=new Set();
 for(const host of allExternalHosts().filter(node=>node.dataset.rmSource==='independent')){
  const ownerChat=String(host.dataset.rmOwnerChat||'');
  if(ownerChat && ownerChat!==currentChat) continue;
  const loading=host.dataset.rmState==='loading' || host.dataset.rmReplyGenerationPlaceholder==='true' || !!host.querySelector?.(':scope > details.rabbit-mirror-external-placeholder');
  if(!loading) continue;
  const index=Number(host.dataset.rmOwnerMesid ?? host.dataset.rmExternalOwnerMessage);
  const msg=Number.isInteger(index)&&index>=0 ? ctx.chat?.[index] : null;
  if(isRabbitMirrorEligibleAssistantMessage(msg) && String(msg.mes||'').trim()) indices.add(index);
 }
 return [...indices];
}

export function settleMountedIndependentPlaceholders(indices,reason){
 const ctx=getContext();
 const message=String(reason||'runtime-changed')==='api-settings-changed'
  ? '独立 API 设置在生成期间发生变化，本次等待已停止，且不会自动重新发送付费请求。请确认新连接后手动重新生成兔子镜。'
  : '本次独立 API 生成已因页面／生成来源状态变化而停止，且不会自动重新发送付费请求。需要时请手动重新生成兔子镜。';
 for(const index of Array.isArray(indices)?indices:[]){
  const id=Number(index); const msg=Number.isInteger(id)&&id>=0?ctx.chat?.[id]:null; const el=msg?messageElement(id):null;
  if(!isRabbitMirrorEligibleAssistantMessage(msg) || !el) continue;
  const loading=externalHostsOwnedByMesid(String(id)).some(host=>host.dataset.rmSource==='independent' && (host.dataset.rmState==='loading' || host.dataset.rmReplyGenerationPlaceholder==='true'));
  if(!loading) continue;
  const observed=observeMessageSourceRevision(ctx,id,msg);
  ensureExternalUi(el,recordKey(ctx,id,msg),message,'error','independent',observed.sourceHash);
 }
}

export function captureMountedIndependentRecords(){
 const snapshots=[];
 const ctx=getContext();
 for(const host of allExternalHosts().filter(node=>node.dataset.rmSource==='independent' && node.dataset.rmState==='ready')){
  restoreExternalHostRendering(host);
  const index=Number(host.dataset.rmOwnerMesid ?? host.dataset.rmExternalOwnerMessage);
  const msg=Number.isInteger(index)&&index>=0 ? ctx.chat?.[index] : null;
  if(!isRabbitMirrorEligibleAssistantMessage(msg)) continue;
  const details=host.querySelector?.(':scope > details');
  if(!details) continue;
  let html=String(host.__rabbitMirrorIndependentSource||'').trim();
  if(!html){
   const clone=details.cloneNode(true);
   clone.querySelector?.(':scope > summary > [data-rabbit-mirror-tool-entry-host]')?.remove?.();
   html=externalFaceDetails(host).length>1 ? serializeExternalFaceDetails(host) : clone.outerHTML;
  }
  if(!independentStoredHtmlRestorable(html)) continue;
  const observed={
   slot:messageSlotKey(ctx,index,msg),
   sourceHash:messageSourceFingerprint(msg),
   bodyHash:messageBodyFingerprint(msg),
   displayHash:messageDisplayFingerprint(msg),
   reasoningHash:messageReasoningFingerprint(msg),
  };
  const mountedSource=String(host.dataset.rmSourceHash||details.dataset.rabbitMirrorOwnerSourceHash||'');
  const matches=!mountedSource || mountedSource===observed.sourceHash || mountedSource===observed.bodyHash;
  snapshots.push({
   slot:observed.slot,
   matches,
   record:{html,sourceHash:mountedSource||observed.sourceHash,bodyHash:observed.bodyHash,displayHash:observed.displayHash,reasoningHash:observed.reasoningHash,ts:Date.now(),model:'',runtime:RUNTIME_VERSION,recoveredFromMountedHost:true},
  });
 }
 return snapshots;
}

export function restoreMountedIndependentRecords(snapshots=[]){
 if(!Array.isArray(snapshots)||!snapshots.length) return;
 const store=readStore(); let changed=false;
 for(const snapshot of snapshots){
  const slot=String(snapshot?.slot||''); const record=normalizeHistoryEntry(snapshot?.record);
  if(!slot||!record) continue;
  appendHistoryEntry(slot,record);
  const existing=findSavedRecord(store,slot);
  if(snapshot.matches && (!existing?.html || !independentStoredHtmlRestorable(existing.html))){ saveRecordForSlot(store,slot,record); changed=true; }
 }
 if(changed) writeStore(store);
}


