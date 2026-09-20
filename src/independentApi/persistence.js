// Split from independentApi.js — persistence.

import { presentationModeFields } from '../presentationMode.js?rmv=1.5.53-visualquick1';
import { independentAdvancedOptionsSignature } from '../advancedRequestOptions.js?rmv=1.5.53-cn-boundary1';
import { refreshRabbitMirrorToolsInScope } from '../outputSanitizer.js?rmv=1.5.74';
import {
    FACE_SWIPE_FULL_MESSAGE,
    FACE_SWIPE_MAX,
    canAppendSwipe,
    selectSwipeIndex,
    deleteCurrentSwipe,
    restoreCurrentSwipeInitial,
    currentSwipeEntry,
    readFaceSwipe,
    mutateFaceSwipe,
    multifaceFacePagerView,
} from '../swipeVersions.js?rmv=1.5.74';
import { RUNTIME_VERSION, byteLength, getContext, hashText } from './runtime.js?rmv=1.5.74';
import {
    clearEphemeralFaceFailure,
    hasEphemeralFaceFailure,
    independentSwipeDetails,
    independentSwipeFaceIndex,
    mergeFaceDetailsIntoHtml,
    independentSwipeSlot,
    seedIndependentFaceSwipesFromIdentity,
    writeIndependentOwnerHtml,
} from './faceSwipe.js?rmv=1.5.74';
import {
    API_PROFILE_STORE_KEY,
    assistantMessages,
    chatKey,
    clearOwnerLockForBase,
    copyIndependentOwnerLineage,
    lockedIndependentRecordForBase,
    messageBaseSlotKey,
    normalizeBase,
    normalizeIndependentConnectionText,
    observeMessageSourceRevision,
    saveRecordForSlot,
    savedIndependentRecordForOwner,
    setOwnerLockForBase,
    swipeId,
} from './connection.js?rmv=1.5.74';
import { stampExternalDetailsOwnership } from './request.js?rmv=1.5.74';
import {
    copyIndependentReplacementReceipt,
    ensureExternalTools,
    extractReadyDetails,
    independentStoredHtmlRestorable,
    interactionStatePollutionScore,
    markExternalDetails,
    normalizeSavedInteractionRecord,
    recoverSavedRecord,
    replaceExternalMultifaceFace,
} from './geometry.js?rmv=1.5.74';
import { externalFaceDetails, resolveIndependentActionIdentity, scheduleIndependentReadyPostprocess, showMultifaceFace } from './mount.js?rmv=1.5.74';

const STORE_KEY = 'rabbit_mirror_independent_outputs_v1';

export const INTERACTION_STATE_MIGRATION_KEY = 'rabbit_mirror_independent_interaction_state_migration_securityfix2_v2';

export const OWNER_LOCK_STORE_KEY = 'rabbit_mirror_independent_owner_locks_v1';

const HISTORY_STORE_KEY = 'rabbit_mirror_independent_history_v1';

const CHAT_OUTPUT_METADATA_KEY = 'rabbit_mirror_independent_outputs_v2';

const CHAT_OUTPUT_METADATA_SCHEMA = 2;

export const HISTORY_PANEL_ATTR = 'data-rabbit-mirror-history-panel';

const OUTPUT_STORE_BUDGET_BYTES = 1600000;

const HISTORY_STORE_BUDGET_BYTES = 1750000;

export const INDEPENDENT_HTML_BUDGET_BYTES = 512 * 1024;

export const INDEPENDENT_RECORD_BUDGET_BYTES = 640 * 1024;

export const INDEPENDENT_RAW_MARKUP_BUDGET_CHARS = 768 * 1024;

export const INDEPENDENT_MAX_TAGS = 4200;

export const INDEPENDENT_MAX_APPROX_DEPTH = 72;

export const INDEPENDENT_MAX_ATTRIBUTES = 12000;

export const INDEPENDENT_MAX_CSS_CHARS = 160000;

export const INDEPENDENT_MAX_CSS_RULES = 1400;

export const INDEPENDENT_MAX_DATA_URI_CHARS = 192000;

let storageWarningShown = false;

export function independentRecordWithinBudget(value){
 if(!value?.html) return false;
 const html=String(value.html||''); const initial=String(value.initialHtml||'');
 return byteLength(html)<=INDEPENDENT_HTML_BUDGET_BYTES
  && byteLength(initial)<=INDEPENDENT_HTML_BUDGET_BYTES
  && byteLength(html)+byteLength(initial)<=INDEPENDENT_RECORD_BUDGET_BYTES;
}

function warnStorageTrimmed(){
 if(storageWarningShown) return;
 storageWarningShown=true;
 console.warn('[RabbitMirror] 本地存储发生容量不足或拒写；当前成品是否保存成功须以读回结果为准。');
}

export function readStore(){ try { const v=JSON.parse(localStorage.getItem(STORE_KEY)||'{}'); return v&&typeof v==='object'?v:{}; } catch { return {}; } }

function compactOutputStore(value){
 const entries=Object.entries(value&&typeof value==='object'?value:{}).filter(([,item])=>independentRecordWithinBudget(item)).sort((a,b)=>Number(b[1]?.ts||0)-Number(a[1]?.ts||0));
 const next={};
 for(const [key,item] of entries.slice(0,120)){
  next[key]=item;
  if(byteLength(JSON.stringify(next))>OUTPUT_STORE_BUDGET_BYTES){ delete next[key]; warnStorageTrimmed(); }
 }
 return next;
}

export function writeStore(v){
 const compacted=compactOutputStore(v);
 try { localStorage.setItem(STORE_KEY, JSON.stringify(compacted)); return true; }
 catch {
  const entries=Object.entries(compacted).sort((a,b)=>Number(b[1]?.ts||0)-Number(a[1]?.ts||0));
  while(entries.length>1){ entries.pop(); try{ localStorage.setItem(STORE_KEY,JSON.stringify(Object.fromEntries(entries))); warnStorageTrimmed(); return true; }catch{} }
  warnStorageTrimmed(); return false;
 }
}

function emptyHistoryStore(){ return {version:1,slots:{}}; }

export function readHistoryStore(){
 try{
  const parsed=JSON.parse(localStorage.getItem(HISTORY_STORE_KEY)||'null');
  if(parsed&&typeof parsed==='object'&&parsed.slots&&typeof parsed.slots==='object') return parsed;
 }catch{}
 return emptyHistoryStore();
}

function compactHistoryStore(value){
 const normalized=value&&typeof value==='object'?value:emptyHistoryStore();
 const flattened=[];
 for(const [slot,entries] of Object.entries(normalized.slots||{})){
  for(const entry of (Array.isArray(entries)?entries:[]).slice(-10)) if(independentRecordWithinBudget(entry)) flattened.push({slot,entry});
 }
 flattened.sort((a,b)=>Number(b.entry?.ts||0)-Number(a.entry?.ts||0));
 const next=emptyHistoryStore();
 for(const {slot,entry} of flattened.slice(0,70)){
  const list=next.slots[slot]||(next.slots[slot]=[]);
  if(list.length>=10) continue;
  list.push(entry);
  if(byteLength(JSON.stringify(next))>HISTORY_STORE_BUDGET_BYTES){ list.pop(); if(!list.length) delete next.slots[slot]; warnStorageTrimmed(); }
 }
 for(const list of Object.values(next.slots)) list.sort((a,b)=>Number(a?.ts||0)-Number(b?.ts||0));
 return next;
}

function writeHistoryStore(value){
 const compacted=compactHistoryStore(value);
 try{ localStorage.setItem(HISTORY_STORE_KEY,JSON.stringify(compacted)); return true; }
 catch{
  const flattened=[];
  for(const [slot,entries] of Object.entries(compacted.slots||{})) for(const entry of entries) flattened.push({slot,entry});
  flattened.sort((a,b)=>Number(b.entry?.ts||0)-Number(a.entry?.ts||0));
  while(flattened.length>1){
   flattened.pop(); const retry=emptyHistoryStore();
   for(const {slot,entry} of flattened) (retry.slots[slot]||(retry.slots[slot]=[])).push(entry);
   try{ localStorage.setItem(HISTORY_STORE_KEY,JSON.stringify(retry)); warnStorageTrimmed(); return true; }catch{}
  }
  warnStorageTrimmed(); return false;
 }
}

export function normalizeHistoryEntry(value){
 if(!independentRecordWithinBudget(value)) return null;
 const html=String(value.html||'');
 return {
  id:String(value.id||hashText(html)), html, initialHtml:String(value.initialHtml||''), sourceHash:String(value.sourceHash||''),
  bodyHash:String(value.bodyHash||''), displayHash:String(value.displayHash||''), reasoningHash:String(value.reasoningHash||''),
  ts:Number(value.ts||Date.now()), model:String(value.model||''), runtime:String(value.runtime||RUNTIME_VERSION),
  apiRequest:value.apiRequest&&typeof value.apiRequest==='object'?{...value.apiRequest}:null,
  executionLockChars:Number(value.executionLockChars||0),
  paletteFingerprint:value.paletteFingerprint&&typeof value.paletteFingerprint==='object'?{...value.paletteFingerprint}:null,
  textReplacementReceipt:copyIndependentReplacementReceipt(value.textReplacementReceipt),
  textReplacementReceipts:Array.isArray(value.textReplacementReceipts)?value.textReplacementReceipts.slice(0,5).map(copyIndependentReplacementReceipt):null,
  initialTextReplacementReceipt:copyIndependentReplacementReceipt(value.initialTextReplacementReceipt),
  ownerLineage:copyIndependentOwnerLineage(value.ownerLineage),
 };
}

export function appendHistoryEntry(slot,value){
 const entry=normalizeHistoryEntry(value); if(!slot||!entry) return null;
 const store=readHistoryStore(); const list=Array.isArray(store.slots[slot])?store.slots[slot]:[];
 const deduped=list.filter(item=>String(item?.id||'')!==entry.id);
 deduped.push(entry); store.slots[slot]=deduped.slice(-10);
 const flattened=[];
 for(const [key,entries] of Object.entries(store.slots)) for(const item of entries) flattened.push({key,item});
 flattened.sort((a,b)=>Number(b.item?.ts||0)-Number(a.item?.ts||0));
 const allowed=new Set(flattened.slice(0,70).map(({key,item})=>`${key}\u0000${item?.id||''}`));
 for(const [key,entries] of Object.entries(store.slots)){
  store.slots[key]=entries.filter(item=>allowed.has(`${key}\u0000${item?.id||''}`));
  if(!store.slots[key].length) delete store.slots[key];
 }
 writeHistoryStore(store); return entry;
}

export function historyEntriesForSlot(slot){
 const list=readHistoryStore().slots?.[slot];
 return (Array.isArray(list)?list:[]).map(normalizeHistoryEntry).filter(Boolean).sort((a,b)=>Number(b.ts||0)-Number(a.ts||0));
}

function remountIndependentFaceFromHtml(identity,html,faceIndex){
 const host=identity?.host;
 if(!host?.isConnected) return false;
 const faces=externalFaceDetails(host);
 if(faces.length>1){
  if(!replaceExternalMultifaceFace(host,identity.key,'independent',html,faceIndex,true)) return false;
 }else{
  const replacement=extractReadyDetails(html,true);
  const current=host.querySelector?.(':scope > details');
  if(!replacement||!current) return false;
  const wasOpen=current.hasAttribute('open');
  markExternalDetails(replacement,identity.key,'independent');
  if(wasOpen) replacement.setAttribute('open',''); else replacement.removeAttribute('open');
  current.replaceWith(replacement);
  host.__rabbitMirrorIndependentSource=html;
  host.dataset.rmState='ready';
 }
 stampExternalDetailsOwnership(host);
 ensureExternalTools(host);
 scheduleIndependentReadyPostprocess(host,identity.key,html);
 try{ refreshRabbitMirrorToolsInScope(host); }catch{}
 return true;
}

function commitIndependentFaceVersion(identity,mutator){
 if(!identity) return {ok:false,reason:'missing'};
 const faceIndex=independentSwipeFaceIndex(identity);
 const result=mutateFaceSwipe(independentSwipeSlot(identity),faceIndex,mutator);
 if(!result?.ok) return result;
 const entry=currentSwipeEntry(result.state);
 const existing=savedIndependentRecordForOwner(identity.ctx,identity.index,identity.msg,readStore());
 const merged=mergeFaceDetailsIntoHtml(existing?.html||identity.host?.__rabbitMirrorIndependentSource||entry.html,faceIndex,entry.html);
 if(!merged || !writeIndependentOwnerHtml(identity,merged)) return {ok:false,reason:'persist',state:result.state};
 remountIndependentFaceFromHtml(identity,merged,faceIndex);
 return result;
}

export function independentFaceSwipeView(root,owner={}){
 const identity=resolveIndependentActionIdentity(root,owner);
 if(!identity || identity.host?.dataset?.rmState==='error') return null;
 const faces=externalFaceDetails(identity.host);
 if(faces.length>1){
  const currentIndex=showMultifaceFace(identity.host,identity.host.dataset.rmFaceView);
  return multifaceFacePagerView(faces.length,currentIndex,hasEphemeralFaceFailure(faces[currentIndex]));
 }
 seedIndependentFaceSwipesFromIdentity(identity);
 const details=independentSwipeDetails(identity);
 const overlay=hasEphemeralFaceFailure(details);
 const state=readFaceSwipe(independentSwipeSlot(identity),independentSwipeFaceIndex(identity));
 if(!state.versions.length && !overlay) return null;
 const count=state.versions.length;
 const currentIndex=state.currentIndex;
 const full=count>=FACE_SWIPE_MAX;
 return {
  count, currentIndex, overlay,
  label:`${currentIndex+1}/${count||1}`,
  canPrev: overlay || currentIndex>0,
  canNext: currentIndex<count-1,
  canDelete: count>1 && !overlay,
  canResay: overlay || !full,
  full,
 };
}

export function canIndependentFaceResay(root,owner={}){
 const identity=resolveIndependentActionIdentity(root,owner,{allowPassiveErrorRetry:true});
 if(!identity) return {ok:false,reason:'missing'};
 seedIndependentFaceSwipesFromIdentity(identity);
 if(hasEphemeralFaceFailure(independentSwipeDetails(identity))) return {ok:true,retry:true};
 const state=readFaceSwipe(independentSwipeSlot(identity),independentSwipeFaceIndex(identity));
 if(!canAppendSwipe(state)) return {ok:false,reason:'full',message:FACE_SWIPE_FULL_MESSAGE};
 return {ok:true};
}

export function applyIndependentFaceSwipe(root,index,owner={}){
 const identity=resolveIndependentActionIdentity(root,owner);
 if(!identity) return false;
 const faces=externalFaceDetails(identity.host);
 if(faces.length>1){
  const current=Number(identity.host.dataset.rmFaceView)||0;
  const details=faces[showMultifaceFace(identity.host,index)];
  if(hasEphemeralFaceFailure(details) && Number(index)===current) clearEphemeralFaceFailure(details);
  try{ refreshRabbitMirrorToolsInScope(identity.host); }catch{}
  return true;
 }
 seedIndependentFaceSwipesFromIdentity(identity);
 const details=independentSwipeDetails(identity);
 if(hasEphemeralFaceFailure(details) && Number(index)===readFaceSwipe(independentSwipeSlot(identity),independentSwipeFaceIndex(identity)).currentIndex){
  clearEphemeralFaceFailure(details);
  const existing=savedIndependentRecordForOwner(identity.ctx,identity.index,identity.msg,readStore());
  if(existing?.html) remountIndependentFaceFromHtml(identity,existing.html,independentSwipeFaceIndex(identity));
  return true;
 }
 const result=commitIndependentFaceVersion(identity,state=>selectSwipeIndex(state,index));
 return !!result?.ok;
}

export function deleteIndependentFaceSwipe(root,owner={}){
 const identity=resolveIndependentActionIdentity(root,owner);
 if(!identity) return false;
 seedIndependentFaceSwipesFromIdentity(identity);
 const result=commitIndependentFaceVersion(identity,deleteCurrentSwipe);
 if(!result?.ok){
  if(result?.reason==='last') globalThis.toastr?.info?.('只剩一版，不能删空。');
  return false;
 }
 globalThis.toastr?.success?.(`已删除这一版，当前 ${result.state.currentIndex+1}/${result.state.versions.length}`);
 return true;
}

export function restoreIndependentFaceSwipeInitial(root){
 const identity=resolveIndependentActionIdentity(root);
 if(!identity) return false;
 seedIndependentFaceSwipesFromIdentity(identity);
 const result=commitIndependentFaceVersion(identity,restoreCurrentSwipeInitial);
 if(!result?.ok) return false;
 globalThis.toastr?.success?.('已恢复到这一版刚生成时的画面和交互。');
 return true;
}

export function hasIndependentSwipeInitial(root){
 const identity=resolveIndependentActionIdentity(root);
 if(!identity) return false;
 seedIndependentFaceSwipesFromIdentity(identity);
 return !!currentSwipeEntry(readFaceSwipe(independentSwipeSlot(identity),independentSwipeFaceIndex(identity)))?.initialHtml;
}

function emptyChatOutputMetadata(){ return {version:CHAT_OUTPUT_METADATA_SCHEMA,owners:{}}; }

function chatMetadataObject(ctx=getContext()){
 const value=ctx?.chatMetadata || globalThis.chat_metadata;
 return value&&typeof value==='object'?value:null;
}

function compactExternalSourceNote(metadata){
 const externalSources=[...new Set((Array.isArray(metadata?.externalSources)?metadata.externalSources:[]).filter(name=>typeof name==='string').slice(0,24).map(name=>name.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,200)).filter(Boolean))];
 return metadata?.hasExternalReferences===true||externalSources.length?{hasExternalReferences:true,externalSources}:{};
}

function compactChatPersistedRecord(value){
 if(!independentRecordWithinBudget(value)) return null;
 const record=normalizeHistoryEntry(value); if(!record?.html) return null;
 const initialHtml=String(value.initialHtml||record.initialHtml||'');
 const diagnostic=value?.apiRequest&&typeof value.apiRequest==='object'?value.apiRequest:null;
 const faces=Array.isArray(diagnostic?.faces)&&diagnostic.faces.length>=2&&diagnostic.faces.length<=5
  ? diagnostic.faces.map((face,faceIndex)=>({faceIndex, samplingMode:String(face?.samplingMode||''), themeIds:Array.isArray(face?.themeIds)?face.themeIds.map(String).slice(0,12):[], formatIds:Array.isArray(face?.formatIds)?face.formatIds.map(String).slice(0,12):[], themeLabels:Array.isArray(face?.themeLabels)?face.themeLabels.map(String).slice(0,12):[], formatLabels:Array.isArray(face?.formatLabels)?face.formatLabels.map(String).slice(0,12):[], forcedVisualScenery:face?.forcedVisualScenery===true,...compactExternalSourceNote(face),...presentationModeFields(face)}))
  : null;
 return {
  html:String(record.html||''), initialHtml:initialHtml && initialHtml!==String(record.html||'') ? initialHtml : '', sourceHash:String(record.sourceHash||''), bodyHash:String(record.bodyHash||''),
  displayHash:String(record.displayHash||''), reasoningHash:String(record.reasoningHash||''), ts:Number(record.ts||Date.now()),
  model:String(record.model||''), runtime:String(record.runtime||RUNTIME_VERSION), executionLockChars:Number(record.executionLockChars||0),
  paletteFingerprint:record.paletteFingerprint&&typeof record.paletteFingerprint==='object'?{...record.paletteFingerprint}:null,
  repairedByMaintenance:!!value?.repairedByMaintenance,
  textReplacementReceipt:record.textReplacementReceipt,
  textReplacementReceipts:record.textReplacementReceipts,
  initialTextReplacementReceipt:record.initialTextReplacementReceipt,
  ownerLineage:record.ownerLineage,
  ...(faces?{apiRequest:{faceCount:faces.length,faces,...compactExternalSourceNote(diagnostic),
   ...(diagnostic.partial===true?{partial:true,failedFaces:(Array.isArray(diagnostic.failedFaces)?diagnostic.failedFaces:[])
    .filter(face=>Number.isInteger(face?.faceIndex)&&face.faceIndex>=0&&face.faceIndex<faces.length)
    .slice(0,5).map(face=>({faceIndex:face.faceIndex,status:'failed',code:String(face.code||'incomplete-face').replace(/[^a-z0-9-]/gi,'').slice(0,80)}))}:{}),
  }}:diagnostic?.hasExternalReferences||diagnostic?.presentationMode||diagnostic?.visualSceneryCombination===true?{apiRequest:{...compactExternalSourceNote(diagnostic),...presentationModeFields(diagnostic),
   ...(diagnostic?.visualSceneryCombination===true?{
    samplingMode:String(diagnostic.samplingMode||''),
    themeIds:Array.isArray(diagnostic.themeIds)?diagnostic.themeIds.map(String).slice(0,12):[],
    formatIds:Array.isArray(diagnostic.formatIds)?diagnostic.formatIds.map(String).slice(0,12):[],
    themeLabels:Array.isArray(diagnostic.themeLabels)?diagnostic.themeLabels.map(String).slice(0,12):[],
    formatLabels:Array.isArray(diagnostic.formatLabels)?diagnostic.formatLabels.map(String).slice(0,12):[],
    forcedVisualScenery:diagnostic.forcedVisualScenery===true,
   }:{}),
  }}:{}),
 };
}

function normalizeChatOutputMetadata(value){
 const next=emptyChatOutputMetadata();
 const owners=value&&typeof value==='object'&&value.owners&&typeof value.owners==='object'?value.owners:{};
 for(const [key,raw] of Object.entries(owners)){
  if(!/^\d+:\d+$/.test(String(key||'')) || !raw || typeof raw!=='object') continue;
  if(raw.deleted===true){ next.owners[key]={deleted:true,ts:Number(raw.ts||0),runtime:String(raw.runtime||RUNTIME_VERSION)}; continue; }
  const record=compactChatPersistedRecord(raw); if(record) next.owners[key]=record;
 }
 return next;
}

function readChatOutputMetadata(ctx=getContext()){
 const metadata=chatMetadataObject(ctx); if(!metadata) return emptyChatOutputMetadata();
 return normalizeChatOutputMetadata(metadata[CHAT_OUTPUT_METADATA_KEY]);
}

function saveChatOutputMetadata(ctx=getContext()){
 const metadata=chatMetadataObject(ctx);
 if(!metadata) return false;
 // CRITICAL CHAT-SAFETY BOUNDARY:
 // SillyTavern's context.saveMetadata() delegates to saveChatConditional(), which
 // serializes the entire currently loaded chat. RabbitMirror must never trigger
 // that whole-chat write merely to persist its own auxiliary metadata: during a
 // slow/failed chat load the in-memory chat can be temporarily empty or partial,
 // and forcing a save at that moment could overwrite a complete server chat.
 //
 // The chatMetadata object is live and has already been updated by the caller.
 // RabbitMirror also keeps an immediate localStorage fallback. The host's next
 // ordinary, user-owned chat save may persist this metadata naturally; RabbitMirror
 // itself does not initiate a chat save.
 return true;
}

function chatOwnerKey(index,swipe=0){
 const i=Number(index), s=Number(swipe);
 return Number.isInteger(i)&&i>=0&&Number.isInteger(s)&&s>=0?`${i}:${s}`:'';
}

function parseChatOwnerKey(value=''){
 const match=String(value||'').match(/^(\d+):(\d+)$/); if(!match) return null;
 return {index:Number(match[1]),swipe:Number(match[2])};
}

export function persistedOwnerForMessage(ctx,index,msg){
 const key=chatOwnerKey(index,swipeId(msg)); if(!key) return null;
 const metadata=chatMetadataObject(ctx); const raw=metadata?.[CHAT_OUTPUT_METADATA_KEY]?.owners?.[key];
 if(!raw||typeof raw!=='object') return null;
 if(raw.deleted===true) return {deleted:true,ts:Number(raw.ts||0),runtime:String(raw.runtime||RUNTIME_VERSION)};
 return compactChatPersistedRecord(raw);
}

export function writePersistedOwner(ctx,index,msg,value,{overwrite=true}={}){
 const metadata=chatMetadataObject(ctx); const ownerKey=chatOwnerKey(index,swipeId(msg));
 if(!metadata||!ownerKey) return false;
 let state=metadata[CHAT_OUTPUT_METADATA_KEY];
 if(!state||typeof state!=='object'||!state.owners||typeof state.owners!=='object') state=emptyChatOutputMetadata();
 const existing=state.owners?.[ownerKey];
 if(!overwrite && existing) return false;
 let next=null;
 if(value?.deleted===true) next={deleted:true,ts:Number(value.ts||Date.now()),runtime:RUNTIME_VERSION};
 else next=compactChatPersistedRecord(value);
 if(!next) return false;
 if(existing && JSON.stringify(existing)===JSON.stringify(next)) return false;
 state.version=CHAT_OUTPUT_METADATA_SCHEMA; state.owners[ownerKey]=next; metadata[CHAT_OUTPUT_METADATA_KEY]=state; saveChatOutputMetadata(ctx); return true;
}

export function chatPersistenceSlot(ctx,index,swipe,record){
 const sourceHash=String(record?.sourceHash||record?.bodyHash||'').trim();
 return sourceHash?`${chatKey(ctx)}:${Number(index)}:${Number(swipe)}:${sourceHash}`:'';
}

function mergeChatOutputsIntoLocalStore(ctx,store){
 const state=readChatOutputMetadata(ctx); const metadata=chatMetadataObject(ctx);
 let storeChanged=false; let metadataChanged=false;
 for(const [ownerKey,raw] of Object.entries(state.owners||{})){
  const owner=parseChatOwnerKey(ownerKey); if(!owner) continue;
  const base=`${chatKey(ctx)}:${owner.index}:${owner.swipe}`;
  if(raw?.deleted===true){ clearOwnerLockForBase(base); continue; }
  let record=compactChatPersistedRecord(raw); if(!record?.html || !independentStoredHtmlRestorable(record.html)) continue;
  const slot=chatPersistenceSlot(ctx,owner.index,owner.swipe,record); if(!slot) continue;
  if(!record.initialHtml && interactionStatePollutionScore(record.html)>0) record=normalizeSavedInteractionRecord(record,slot);
  const existing=store?.[slot];
  const existingReady=existing?.html && independentStoredHtmlRestorable(existing.html) ? compactChatPersistedRecord(existing) : null;
  const localIsNewer=!!existingReady && (Number(existingReady.ts||0)>Number(record.ts||0)
   || (Number(existingReady.ts||0)===Number(record.ts||0)
    && Number(existingReady.ownerLineage?.observedAt||0)>Number(record.ownerLineage?.observedAt||0)));
  if(localIsNewer){
   // A maintenance repair is first committed to the live/local snapshot. If an
   // older chatMetadata copy is observed before the queued server save finishes,
   // keep the newer local HTML authoritative and immediately heal metadata.
   if(String(existingReady.html||'')!==String(record.html||'') || JSON.stringify(existingReady.ownerLineage)!==JSON.stringify(record.ownerLineage)){
    state.owners[ownerKey]=existingReady; metadataChanged=true;
   }
  }else if(!existingReady || String(existingReady.html||'')!==String(record.html||'') || JSON.stringify(existingReady.ownerLineage)!==JSON.stringify(record.ownerLineage)){
   saveRecordForSlot(store,slot,record,{dropLegacy:false}); storeChanged=true;
  }
  setOwnerLockForBase(base,slot,String((localIsNewer?existingReady:record)?.sourceHash||(localIsNewer?existingReady:record)?.bodyHash||''));
 }
 if(metadataChanged && metadata){ metadata[CHAT_OUTPUT_METADATA_KEY]=state; saveChatOutputMetadata(ctx); }
 return {storeChanged,metadataChanged};
}

function migrateLegacyLocalOutputsToChatMetadata(ctx,store){
 const metadata=chatMetadataObject(ctx); if(!metadata) return {metadataChanged:false,storeChanged:false};
 const state=readChatOutputMetadata(ctx); let metadataChanged=false; let storeChanged=false;
 for(const {m,i} of assistantMessages(ctx)){
  const ownerKey=chatOwnerKey(i,swipeId(m)); if(!ownerKey || Object.prototype.hasOwnProperty.call(state.owners,ownerKey)) continue;
  const observed=observeMessageSourceRevision(ctx,i,m);
  const base=messageBaseSlotKey(ctx,i,m);
  const locked=lockedIndependentRecordForBase(base,store);
  let record=locked?.record||null;
  if(!record?.html){
   const recovered=recoverSavedRecord(store,observed.slot,observed);
   if(recovered.storeChanged) storeChanged=true;
   record=recovered.saved||null;
  }
  const compact=compactChatPersistedRecord(record);
  if(!compact?.html || !independentStoredHtmlRestorable(compact.html)) continue;
  state.owners[ownerKey]=compact; metadataChanged=true;
 }
 if(metadataChanged){ metadata[CHAT_OUTPUT_METADATA_KEY]=state; saveChatOutputMetadata(ctx); }
 return {metadataChanged,storeChanged};
}

export function synchronizeIndependentChatPersistence(ctx,store){
 const imported=mergeChatOutputsIntoLocalStore(ctx,store);
 const migrated=migrateLegacyLocalOutputsToChatMetadata(ctx,store);
 return {
  storeChanged:!!(imported.storeChanged||migrated.storeChanged),
  metadataChanged:!!(imported.metadataChanged||migrated.metadataChanged),
 };
}

function independentContextChatMetadata(ctx){
 const source=ctx?.chatMetadata || globalThis.chat_metadata || null;
 if(!source || typeof source!=='object') return source;
 const copy={...source}; delete copy[CHAT_OUTPUT_METADATA_KEY]; return copy;
}

export function migrateLegacyDeletedRecords(){
 const store=readStore(); let changed=false;
 for(const [key,value] of Object.entries(store)){
  if(!value?.deleted) continue;
  if(value?.html){
   const next={...value};
   delete next.deleted;
   store[key]=next;
  }else delete store[key];
  changed=true;
 }
 if(changed) writeStore(store);
}

export function readApiProfileStore(){ try { const v=JSON.parse(localStorage.getItem(API_PROFILE_STORE_KEY)||'{}'); return v&&typeof v==='object'?v:{}; } catch { return {}; } }

export function writeApiProfileStore(v){ try { localStorage.setItem(API_PROFILE_STORE_KEY,JSON.stringify(v)); } catch {} }

export function apiProfileKey(st){ const connectionId=normalizeIndependentConnectionText(st?.independentConnectionProfileId,160); const transport=connectionId?`st:${connectionId}`:normalizeBase(st?.independentApiBaseUrl||''); const advanced=st?.independentAdvancedEnabled===true?independentAdvancedOptionsSignature(st):''; return `${transport}|${String(st?.independentApiModel||'')}${advanced?`|advanced:${advanced}`:''}`; }

export function normalizedConfiguredTemperature(st){ const value=Number(st?.independentApiTemperature); return Number.isFinite(value)?Math.max(0,Math.min(2,value)):0.8; }

