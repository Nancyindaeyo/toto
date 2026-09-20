// Split from independentApi.js — runtime.

export const RUNTIME_VERSION = '1.5.63';

export const SOURCE_ATTR = 'data-rabbit-mirror-external-source';

export const EXTERNAL_SHELL_ATTR = 'data-rabbit-mirror-external-shell';

export const INLINE_ANCHOR_ATTR = 'data-rabbit-mirror-independent-inline-anchor';

export const FOLLOW_EXTERNAL_ANCHOR_ATTR = 'data-rabbit-mirror-follow-external-anchor';

export const FOLLOW_ORIGIN_ATTR = 'data-rabbit-mirror-follow-origin';

export const RESAY_ATTR = 'data-rabbit-mirror-resay';

export const RESAY_EVENT = 'rabbitmirror:resay';

export const HISTORY_EVENT = 'rabbitmirror:history';

export const INDEPENDENT_REPAIR_PERSIST_EVENT = 'rabbitmirror:independent-repair-persist';

const INDEPENDENT_LIVE_REPAIR_ATTR = 'data-rabbit-mirror-maintenance-live-repair';

const INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR = 'data-rabbit-mirror-maintenance-live-repair-until';

export const EPHEMERAL_FAILURE_ATTR = 'data-rm-ephemeral-failure';

export const EPHEMERAL_FAILURE_BODY_ATTR = 'data-rm-ephemeral-failure-body';

export const ACTION_BRIDGE_KEY = '__rabbitMirrorIndependentActionsV1';

export const INDEPENDENT_GENERATION_INTENTS_KEY = '__rabbitMirrorIndependentGenerationIntents';

export const INDEPENDENT_GENERATION_STOPS_KEY = '__rabbitMirrorIndependentStoppedHostOperations';

export const INDEPENDENT_GENERATION_INTENT_TTL_MS = 5 * 60 * 1000;

export const INDEPENDENT_GENERATION_INTENT_TYPES = new Set(['normal','continue','swipe','regenerate']);

export const HISTORICAL_LIGHT_HOST_ATTR = 'data-rm-historical-light';

export const CONTEXT_TRANSCRIPT_BUDGET = 12000;

export const CONTEXT_TOTAL_BUDGET = 20000;

export const MAX_INDEPENDENT_REQUEST_CHARS = 32000;

export function independentMaintenanceLiveRepairLocked(host){
 if(!host?.isConnected || host.getAttribute?.(INDEPENDENT_LIVE_REPAIR_ATTR)!=='true') return false;
 const until=Number(host.getAttribute?.(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR)||0);
 if(until && until<=Date.now()){
  host.removeAttribute?.(INDEPENDENT_LIVE_REPAIR_ATTR);
  host.removeAttribute?.(INDEPENDENT_LIVE_REPAIR_UNTIL_ATTR);
  return false;
 }
 return true;
}

export function currentRuntime(){ return globalThis.__rabbitMirrorRuntimeVersion === RUNTIME_VERSION; }

export function byteLength(value=''){ const text=String(value||''); try{return new TextEncoder().encode(text).length;}catch{return unescape(encodeURIComponent(text)).length;} }

export function hashText(text=''){ let h=2166136261; for(const ch of String(text)){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619);} return (h>>>0).toString(36); }

export function getContext(){ try { return globalThis.SillyTavern?.getContext?.() || {}; } catch { return {}; } }

