// Split from independentApi.js — faceSwipe.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { refreshRabbitMirrorToolsInScope } from '../outputSanitizer.js?rmv=1.5.62';
import { parseMultifaceOutput } from '../multifaceProtocol.js?rmv=1.5.53-cn-boundary1';
import { configuredAutomaticRerollMax } from '../automaticReroll.js?rmv=1.5.60-fork1';
import { seedSwipeState, appendSuccessfulSwipe, readFaceSwipe, mutateFaceSwipe } from '../swipeVersions.js?rmv=1.5.60-fork1';
import { EPHEMERAL_FAILURE_ATTR, EPHEMERAL_FAILURE_BODY_ATTR, RUNTIME_VERSION } from './runtime.js?rmv=1.5.62';
import { independentRecordWithinBudget, readStore, writePersistedOwner, writeStore } from './persistence.js?rmv=1.5.62';
import { saveRecordForSlot, savedIndependentRecordForOwner } from './connection.js?rmv=1.5.62';
import { hasMultifaceMarkup, wrapIndependentFace } from './request.js?rmv=1.5.62';
import { externalFaceDetails, showIndependentUnsavedOutput } from './mount.js?rmv=1.5.62';

export function independentRerollMax(){ return configuredAutomaticRerollMax(getSettings()); }

export function independentSwipeFaceIndex(identity){ return identity?.faceIndex>=0?identity.faceIndex:0; }

export function independentSwipeDetails(identity){
 const faces=externalFaceDetails(identity?.host);
 if(faces.length>1) return faces[independentSwipeFaceIndex(identity)]||null;
 return faces[0]||identity?.host?.querySelector?.(':scope > details')||null;
}

export function scrubSwipeDetailsHtml(html){
 const source=String(html||'').trim();
 if(!source || typeof document==='undefined') return source;
 const template=document.createElement('template');
 template.innerHTML=source;
 const details=template.content.querySelector?.('details');
 if(!details) return source;
 details.querySelectorAll?.('[data-rabbit-mirror-tool-entry-host], [data-rm-image-region], [data-rm-image-portal], [data-rabbit-mirror-maintenance-rabbit], [data-rabbit-mirror-feedback-cat], [data-rabbit-mirror-resay], [data-rm-ephemeral-failure-body], [data-rm-face-swipe-bar], [data-rm-face-favorite-star]')?.forEach(node=>node.remove());
 details.querySelectorAll?.('[data-rm-ephemeral-failure-hidden]')?.forEach(node=>{ node.removeAttribute('data-rm-ephemeral-failure-hidden'); node.hidden=false; });
 details.removeAttribute?.(EPHEMERAL_FAILURE_ATTR);
 return String(details.outerHTML||source).trim();
}

export function faceDetailsListFromHtml(html){
 const source=String(html||'');
 if(hasMultifaceMarkup(source)){
  const parsed=parseMultifaceOutput(source);
  if(!parsed.ok) return [];
  return parsed.faces.map(face=>({index:face.index,detailsHtml:scrubSwipeDetailsHtml(face.details||face.inner||'')}));
 }
 const match=source.match(/<details\b[\s\S]*<\/details>/i);
 return match?[{index:0,detailsHtml:scrubSwipeDetailsHtml(match[0])}]:[];
}

export function mergeFaceDetailsIntoHtml(recordHtml,faceIndex,detailsHtml){
 const clean=scrubSwipeDetailsHtml(detailsHtml);
 if(!clean) return '';
 if(hasMultifaceMarkup(recordHtml)){
  const parsed=parseMultifaceOutput(String(recordHtml||''));
  if(!parsed.ok) return '';
  const index=Number.isInteger(faceIndex)&&faceIndex>=0?faceIndex:0;
  return parsed.faces.map(face=>face.index===index?wrapIndependentFace(clean,index):face.html).join('\n');
 }
 return clean;
}

export function seedIndependentFaceSwipes(slot,html){
 if(!slot) return;
 for(const face of faceDetailsListFromHtml(html)){
  mutateFaceSwipe(slot,face.index,state=>seedSwipeState(state,{html:face.detailsHtml,initialHtml:face.detailsHtml,ts:Date.now()}));
 }
}

export function seedIndependentFaceSwipesFromIdentity(identity){
 if(!identity?.slot) return;
 const existing=readFaceSwipe(identity.slot,independentSwipeFaceIndex(identity));
 if(existing.versions.length) return;
 const html=savedIndependentRecordForOwner(identity.ctx,identity.index,identity.msg,readStore())?.html
  || identity.host?.__rabbitMirrorIndependentSource
  || '';
 if(html) seedIndependentFaceSwipes(identity.slot,html);
}

export function appendIndependentFaceSwipe(slot,faceIndex,detailsHtml){
 const html=scrubSwipeDetailsHtml(detailsHtml);
 if(!slot||!html) return {ok:false,reason:'invalid'};
 return mutateFaceSwipe(slot,faceIndex,state=>{
  const seeded=seedSwipeState(state,{html,initialHtml:html,ts:Date.now()});
  if(seeded.seeded) return seeded;
  return appendSuccessfulSwipe(seeded.state,{html,initialHtml:html,ts:Date.now()});
 });
}

export function clearEphemeralFaceFailure(details){
 if(!details) return;
 details.removeAttribute?.(EPHEMERAL_FAILURE_ATTR);
 details.querySelectorAll?.(`[${EPHEMERAL_FAILURE_BODY_ATTR}]`)?.forEach(node=>node.remove());
 details.querySelectorAll?.('[data-rm-ephemeral-failure-hidden]')?.forEach(node=>{
  node.removeAttribute('data-rm-ephemeral-failure-hidden');
  node.hidden=false;
 });
}

export function hasEphemeralFaceFailure(details){ return details?.getAttribute?.(EPHEMERAL_FAILURE_ATTR)==='true'; }

export function showEphemeralFaceFailure(host,faceIndex,message,onRetry,onBack){
 const faces=externalFaceDetails(host);
 const details=faces.length>1?faces[Math.max(0,Number(faceIndex)||0)]:faces[0];
 if(!details) return false;
 clearEphemeralFaceFailure(details);
 details.setAttribute(EPHEMERAL_FAILURE_ATTR,'true');
 for(const child of [...details.children]){
  if(child.tagName==='SUMMARY' || child.hasAttribute?.(EPHEMERAL_FAILURE_BODY_ATTR)) continue;
  child.setAttribute('data-rm-ephemeral-failure-hidden','true');
  child.hidden=true;
 }
 const body=document.createElement('div');
 body.setAttribute(EPHEMERAL_FAILURE_BODY_ATTR,'true');
 body.className='rabbit-mirror-ephemeral-failure';
 const text=document.createElement('p');
 text.textContent=String(message||'副 API 这一版没有生成成功。上一版仍可切换。');
 const actions=document.createElement('div');
 actions.className='rabbit-mirror-ephemeral-failure-actions';
 const retry=document.createElement('button'); retry.type='button'; retry.textContent='再试一次';
 retry.addEventListener('click',event=>{ event.preventDefault(); event.stopPropagation(); onRetry?.(); },true);
 const back=document.createElement('button'); back.type='button'; back.textContent='回到上一版';
 back.addEventListener('click',event=>{ event.preventDefault(); event.stopPropagation(); onBack?.(); },true);
 actions.append(retry,back); body.append(text,actions); details.append(body);
 try{ refreshRabbitMirrorToolsInScope(details); }catch{}
 return true;
}

export function writeIndependentOwnerHtml(identity,html){
 if(!identity||!html) return false;
 const store=readStore();
 const existing=savedIndependentRecordForOwner(identity.ctx,identity.index,identity.msg,store)||{};
 const next={...existing,html,ts:Date.now(),runtime:RUNTIME_VERSION,ownerLineage:null};
 if(!independentRecordWithinBudget(next)){ showIndependentUnsavedOutput(next); return false; }
 saveRecordForSlot(store,identity.slot,next);
 if(!writeStore(store)){ showIndependentUnsavedOutput(next); return false; }
 writePersistedOwner(identity.ctx,identity.index,identity.msg,next,{overwrite:true});
 if(identity.host){
  identity.host.__rabbitMirrorIndependentSource=html;
  identity.host.dataset.rmSourceHash=String(identity.host.dataset.rmSourceHash||existing.sourceHash||'');
 }
 return true;
}

