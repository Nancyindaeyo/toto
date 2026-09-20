// Split from independentApi.js — flights.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { AUTOMATIC_REROLL_STALL_MS, configuredAutomaticRerollMax, stallTimeoutError } from '../automaticReroll.js?rmv=1.5.69';
import { baseSlotOf } from './connection.js?rmv=1.5.69';
import { automaticGenerationCutovers } from './lifecycle.js?rmv=1.5.69';

export const pending = new Map();
// A failed automatic generation owns its exact chat+mesid+swipe+sourceHash until
// the player explicitly retries. Host render/update events may repeat after a
// failure, but they must never silently turn that failure into another paid POST.

export const automaticFailureStops = new Map();

const AUTOMATIC_FAILURE_STOP_LIMIT = 320;

const GLOBAL_FLIGHT_KEY = '__rabbitMirrorIndependentFlightsV3';

const GLOBAL_DISPATCH_LEASE_KEY = '__rabbitMirrorIndependentDispatchLeasesV1';

const GLOBAL_OPERATION_EPOCH_KEY = '__rabbitMirrorIndependentOperationEpochsV1';

export const LEGACY_GLOBAL_FLIGHT_KEYS = ['__rabbitMirrorIndependentFlightsV2'];

export const OWNER_REATTACH_WAIT_MS = 60000;

export const ACTIVE_GENERATION_WAIT_MS = 10 * 60 * 1000;

export const HOST_FINAL_PROOF_WAIT_MS = 12000;

export const WEAK_GENERATION_FLAG_GRACE_MS = 30 * 1000;

export const WEAK_GENERATION_SOURCE_STABLE_WAIT_MS = 4500;

export const SOURCE_STABLE_WAIT_MS = 1400;

export const FINAL_RENDER_SOURCE_STABLE_WAIT_MS = 520;

export const FINAL_RENDER_POLL_INTERVAL_MS = 120;

export const FINAL_RENDER_CONFIRMATION_TTL_MS = 5000;
// A large, styled RabbitMirror can legitimately stream for more than five
// minutes on a mobile/public-network connection. Bound silence, not healthy
// progress, while retaining a finite absolute cap for a stuck provider.

const INDEPENDENT_REQUEST_IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const INDEPENDENT_REQUEST_ABSOLUTE_TIMEOUT_MS = 20 * 60 * 1000;

export const HOST_GENERATION_EVENT_HINT_MS = 15000;

export const GENERATION_PLACEHOLDER_POLL_LIMIT_MS = 12000;

export const GENERATION_PLACEHOLDER_POLL_INTERVAL_MS = 760;

export const generationPolls = new Map();

function automaticFailureKey(slot='',sourceHash=''){ return flightIdentity(String(slot||''),String(sourceHash||'')); }

export function automaticFailureStopFor(slot='',sourceHash=''){
 const value=automaticFailureStops.get(automaticFailureKey(slot,sourceHash));
 if(!value||typeof value!=='object') return null;
 return value.operationEpoch===operationEpochForBase(value.baseSlot)?value:null;
}

export function hasAutomaticFailureStop(slot='',sourceHash=''){ return !!automaticFailureStopFor(slot,sourceHash); }

export function markAutomaticFailureStop(slot='',sourceHash='',reason='',details={}){
 const key=automaticFailureKey(slot,sourceHash); if(!key) return null;
 const metadata=details&&typeof details==='object'?details:{};
 const baseSlot=String(metadata.baseSlot||baseSlotOf(slot));
 const ownerParts=baseSlot.split(':');
 const cutover=automaticGenerationCutovers.get(ownerParts.slice(0,-2).join(':'));
 const message=String(metadata.message||reason||'独立 API 生成失败。').replace(/\u0000/g,'').trim().slice(0,2400);
 const record={
  baseSlot,
  slot:String(slot||''),
  sourceHash:String(sourceHash||''),
  // Identity-only references: no chat, message body, profile or cutover object.
  // Equal timestamps must not merge a new chat lifecycle/authorization.
  cutoverToken:cutover?.failureRecoveryToken,
  authorization:cutover?.authorized?.get?.(Number(ownerParts.at(-2))),
  operationEpoch:Number.isSafeInteger(metadata.operationEpoch)&&metadata.operationEpoch>=1?metadata.operationEpoch:operationEpochForBase(baseSlot),
  ts:Date.now(),
  reason:String(reason||'generation-failed').slice(0,180),
  message:message||'独立 API 生成失败。',
  code:String(metadata.code||'').slice(0,120),
  semanticFailure:String(metadata.semanticFailure||'').slice(0,120),
  terminalStage:String(metadata.terminalStage||'').slice(0,120),
  terminalFace:Number.isInteger(metadata.terminalFace)&&metadata.terminalFace>=1&&metadata.terminalFace<=5?metadata.terminalFace:undefined,
  requestCount:metadata.requestCount===0||metadata.requestCount===1?metadata.requestCount:undefined,
  protocolErrorCode:String(metadata.protocolErrorCode||'').replace(/[^a-z0-9-]/gi,'').slice(0,120),
  protocolOffset:Number.isSafeInteger(metadata.protocolOffset)&&metadata.protocolOffset>=0?metadata.protocolOffset:undefined,
 };
 automaticFailureStops.delete(key);
 automaticFailureStops.set(key,record);
 while(automaticFailureStops.size>AUTOMATIC_FAILURE_STOP_LIMIT){ automaticFailureStops.delete(automaticFailureStops.keys().next().value); }
 return record;
}

export function clearAutomaticFailureStop(slot='',sourceHash=''){ automaticFailureStops.delete(automaticFailureKey(slot,sourceHash)); }

export function clearAutomaticFailureStops(){ automaticFailureStops.clear(); }

export function createIndependentRequestDeadline(controller,onTimeout,options={}){
 let idleTimer=0; let absoluteTimer=0; let stallTimer=0; let settled=false; let lastProgressAt=Date.now();
 const stallMs=Number(options.stallMs);
 const idleMs=Number(options.idleMs);
 const absoluteMs=Number(options.absoluteMs);
 const stallWait=Number.isFinite(stallMs)&&stallMs>0?stallMs:AUTOMATIC_REROLL_STALL_MS;
 const idleWait=Number.isFinite(idleMs)&&idleMs>0?idleMs:INDEPENDENT_REQUEST_IDLE_TIMEOUT_MS;
 const absoluteWait=Number.isFinite(absoluteMs)&&absoluteMs>0?absoluteMs:INDEPENDENT_REQUEST_ABSOLUTE_TIMEOUT_MS;
 const fail=kind=>{
  if(settled) return;
  settled=true;
  if(idleTimer) clearTimeout(idleTimer);
  if(absoluteTimer) clearTimeout(absoluteTimer);
  if(stallTimer) clearTimeout(stallTimer);
  idleTimer=0; absoluteTimer=0; stallTimer=0;
  const stall=kind==='stall';
  const idle=kind==='idle';
  const error=stall?stallTimeoutError(lastProgressAt):new Error(idle
   ? '独立 API 已连续 5 分钟未收到新响应，已停止本次等待。可在挨打猫中重说；本轮不会自动重新发送付费请求。'
   : '独立 API 已达到 20 分钟总等待上限，已停止本次等待。可在挨打猫中重说；本轮不会自动重新发送付费请求。');
  if(!stall){
   error.name='RabbitMirrorIndependentTimeoutError';
   error.code=idle?'RABBIT_MIRROR_INDEPENDENT_IDLE_TIMEOUT':'RABBIT_MIRROR_INDEPENDENT_ABSOLUTE_TIMEOUT';
   error.lastProgressAt=lastProgressAt;
  }
  try{ controller?.abort?.(stall?'independent-request-stall-timeout':idle?'independent-request-idle-timeout':'independent-request-absolute-timeout'); }catch{}
  onTimeout?.(error);
 };
 const armIdle=()=>{
  if(settled) return;
  if(idleTimer) clearTimeout(idleTimer);
  idleTimer=setTimeout(()=>fail('idle'),idleWait);
 };
 armIdle();
 // Streaming chunks reset idle silence, but not this wall clock. Incomplete
 // content after 180s is treated as a stuck attempt and may automatic-reroll.
 stallTimer=setTimeout(()=>fail('stall'),stallWait);
 absoluteTimer=setTimeout(()=>fail('absolute'),absoluteWait);
 return {
  progress(){ if(settled) return false; lastProgressAt=Date.now(); armIdle(); return true; },
  clear(){
   if(settled) return;
   settled=true;
   if(idleTimer) clearTimeout(idleTimer);
   if(absoluteTimer) clearTimeout(absoluteTimer);
   if(stallTimer) clearTimeout(stallTimer);
   idleTimer=0; absoluteTimer=0; stallTimer=0;
  },
  lastProgressAt:()=>lastProgressAt,
 };
}

export function globalFlights(){
 const current=globalThis[GLOBAL_FLIGHT_KEY];
 if(current&&typeof current.get==='function') return current;
 const created=new Map(); globalThis[GLOBAL_FLIGHT_KEY]=created; return created;
}

export function flightIdentity(slot,sourceHash=''){ return `${String(slot||'')}\u0000${String(sourceHash||'')}`; }


function globalDispatchLeases(){
 const current=globalThis[GLOBAL_DISPATCH_LEASE_KEY];
 if(current&&typeof current.get==='function') return current;
 const created=new Map(); globalThis[GLOBAL_DISPATCH_LEASE_KEY]=created; return created;
}

function globalOperationEpochs(){
 const current=globalThis[GLOBAL_OPERATION_EPOCH_KEY];
 if(current&&typeof current.get==='function') return current;
 const created=new Map(); globalThis[GLOBAL_OPERATION_EPOCH_KEY]=created; return created;
}

function pruneDispatchLeaseState(){
 const leases=globalDispatchLeases();
 const cutoff=Date.now()-24*60*60*1000;
 for(const [key,value] of leases){ if(Number(value?.ts||0)<cutoff) leases.delete(key); }
 while(leases.size>640){
  const oldest=[...leases.entries()].sort((a,b)=>Number(a[1]?.ts||0)-Number(b[1]?.ts||0))[0]?.[0];
  if(!oldest) break; leases.delete(oldest);
 }
 const epochs=globalOperationEpochs();
 while(epochs.size>480){
  const oldest=[...epochs.entries()].sort((a,b)=>Number(a[1]?.ts||0)-Number(b[1]?.ts||0))[0]?.[0];
  if(!oldest) break; epochs.delete(oldest);
 }
}

export function operationEpochForBase(baseSlot=''){
 const key=String(baseSlot||''); if(!key) return 1;
 return Math.max(1,Number(globalOperationEpochs().get(key)?.epoch||1));
}

export function advanceOperationEpochForBase(baseSlot='',reason='explicit-host-operation',operationToken=''){
 const key=String(baseSlot||''); if(!key) return 1;
 
 const epochs=globalOperationEpochs();
 const current=epochs.get(key);
 const now=Date.now(); const token=String(operationToken||'').trim();
 // Host event timing is not an ownership boundary. MESSAGE_SWIPED and
 // GENERATION_STARTED may describe the same operation many seconds apart; the same
 // exact swipe/body token must therefore never open a second paid epoch.
 if(token && String(current?.operationToken||'')===token) return Number(current.epoch||1);
 const epoch=Math.max(1,Number(current?.epoch||1)+1);
 epochs.set(key,{epoch,reason:String(reason||''),operationToken:token,ts:now});
 pruneDispatchLeaseState();
 return epoch;
}

export function reserveAutomaticDispatchLease(baseSlot='',sourceHash=''){
 const base=String(baseSlot||''); if(!base) return null;
 const epoch=operationEpochForBase(base);
 const key=`${base}\u0000${epoch}`;
 const leases=globalDispatchLeases();
 if(leases.has(key)) return null;
 const maxConsumes=1+configuredAutomaticRerollMax(getSettings());
 const record={key,baseSlot:base,epoch,sourceHash:String(sourceHash||''),state:'reserved',consumeCount:0,maxConsumes,ts:Date.now()};
 leases.set(key,record);
 pruneDispatchLeaseState();
 return {
  key, epoch,
  consume(){
   const live=leases.get(key);
   if(live!==record) return false;
   if(Number(live.consumeCount||0)>=Number(live.maxConsumes||1)) return false;
   live.consumeCount=Number(live.consumeCount||0)+1;
   live.state='consumed'; live.ts=Date.now(); return true;
  },
  release(){
   const live=leases.get(key);
   if(live!==record || live.state!=='reserved' || Number(live.consumeCount||0)>0) return false;
   leases.delete(key); return true;
  },
  consumed(){ return Number(leases.get(key)?.consumeCount||0)>=1; },
  consumeCount(){ return Number(leases.get(key)?.consumeCount||0); },
 };
}

export function createManualDispatchLease(){
 let state='reserved';
 let consumeCount=0;
 return {
  consume(){ if(state!=='reserved' && state!=='consumed') return false; if(consumeCount>=1) return false; consumeCount=1; state='consumed'; return true; },
  release(){ if(state!=='reserved') return false; state='released'; return true; },
  consumed(){ return consumeCount>=1; },
  consumeCount(){ return consumeCount; },
 };
}

export function automaticDispatchAlreadyConsumed(baseSlot=''){
 const base=String(baseSlot||''); if(!base) return false;
 return globalDispatchLeases().get(`${base}\u0000${operationEpochForBase(base)}`)?.state==='consumed';
}


