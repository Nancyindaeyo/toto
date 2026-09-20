import { scanRabbitMirrorHtml } from './visualScanner.js?rmv=1.5.63';
import { updateLatestVisualSignature } from './storage.js?rmv=1.5.53-visualquick1';

const VERSION = '1.5.53';
const HOST = '[data-rabbit-mirror-external-source]';
const READY_INDEPENDENT = `${HOST}[data-rm-source="independent"][data-rm-state="ready"]`;
const TOOL = '[data-rabbit-mirror-tool-entry-host]';
let root = null;
let observer = null;
let seq = 0;
let latestHost = null;
let timer = 0;
let raf1 = 0;
let raf2 = 0;
const hostSeq = new WeakMap();
const seen = new Map();

function hash(text = '') {
    let h = 2166136261;
    for (const ch of String(text)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
}

function latestAssistantIndex() {
    try {
        const chat = globalThis.SillyTavern?.getContext?.()?.chat;
        if (!Array.isArray(chat)) return -1;
        for (let i = chat.length - 1; i >= 0; i--) if (chat[i] && chat[i].is_user !== true && typeof chat[i].mes === 'string') return i;
    } catch {}
    return -1;
}

function asIndex(value) {
    const text = String(value ?? '').trim();
    return /^\d+$/.test(text) ? Number(text) : -1;
}

function ownerIndex(details, host) {
    for (const value of [
        host?.dataset?.rmOwnerMesid,
        host?.dataset?.rmExternalOwnerMessage,
        details?.dataset?.rabbitMirrorOwnerMesid,
        details?.closest?.('.mes[mesid], [mesid].mes, [mesid]')?.getAttribute?.('mesid'),
    ]) {
        const parsed = asIndex(value);
        if (parsed >= 0) return parsed;
    }
    return -1;
}

function isMirror(details) {
    if (!details || details.tagName !== 'DETAILS') return false;
    if (details.closest?.(HOST)) return true;
    return /兔子镜|RabbitMirror/i.test(String(details.querySelector?.(':scope > summary')?.textContent || ''));
}

function eligible(details, host) {
    if (!details?.isConnected || !details.open || !isMirror(details)) return false;
    if (details.classList?.contains('rabbit-mirror-external-placeholder') || details.hasAttribute?.('data-rabbit-mirror-placeholder')) return false;
    if (host && String(host.dataset?.rmState || '') !== 'ready') return false;
    if (host?.dataset?.rmSource === 'independent') {
        const current = Number(hostSeq.get(host) || 0);
        if (current > 0 && current === seq && host === latestHost) return true;
    }
    const owner = ownerIndex(details, host);
    return owner >= 0 && owner === latestAssistantIndex();
}

function styleOf(el) {
    try { return el?.ownerDocument?.defaultView?.getComputedStyle?.(el) || globalThis.getComputedStyle?.(el) || null; }
    catch { return null; }
}

function rectOf(el) {
    try {
        const r = el?.getBoundingClientRect?.();
        if (!r) return null;
        const width = Math.max(0, Number(r.width) || 0), height = Math.max(0, Number(r.height) || 0);
        return { left:Number(r.left)||0, top:Number(r.top)||0, width, height, area:width*height, cx:(Number(r.left)||0)+width/2, cy:(Number(r.top)||0)+height/2 };
    } catch { return null; }
}

function num(value) { return Math.max(0, parseFloat(value || '0') || 0); }
function maxNum(value = '') { const vals=String(value).split(/[\s/]+/).map(parseFloat).filter(Number.isFinite); return vals.length?Math.max(...vals):0; }
function textLen(el) { return String(el?.textContent || '').replace(/\s+/g, '').trim().length; }
function visibleBackground(style) {
    if (!style) return false;
    if (String(style.backgroundImage || 'none') !== 'none') return true;
    const bg = String(style.backgroundColor || '').replace(/\s+/g, '').toLowerCase();
    return !!bg && bg !== 'transparent' && !/^rgba\([^)]*,0(?:\.0+)?\)$/.test(bg) && bg !== 'rgba(0,0,0,0)';
}

function contentRoot(details) {
    return [...(details?.children || [])].find(el => !['SUMMARY','STYLE','SCRIPT','TEMPLATE','LINK','META'].includes(el.tagName)) || details;
}

function collectBoxes(details) {
    const stage = contentRoot(details), stageRect = rectOf(stage);
    if (!stage?.querySelectorAll || !stageRect || stageRect.width < 160 || stageRect.height < 80) return { boxes:[], text:0, abs:0, stageRect };
    const minArea = Math.max(900, stageRect.area * 0.0045);
    const boxes = [];
    let abs = 0;
    for (const el of [...stage.querySelectorAll('div,section,article,li,aside,main,figure')].slice(0, 180)) {
        if (!el?.isConnected || el.closest?.(TOOL)) continue;
        const s = styleOf(el), r = rectOf(el);
        if (!s || !r || s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity || 1) < 0.08) continue;
        if (s.position === 'absolute' || s.position === 'fixed') abs++;
        if (r.width < 72 || r.height < 24 || r.area < minArea || r.area > stageRect.area * 0.88) continue;
        if (textLen(el) < 18 && !el.querySelector?.('input,button,label,select,textarea,a[href],svg,img,canvas')) continue;
        const bg = visibleBackground(s);
        const border = num(s.borderTopWidth)+num(s.borderRightWidth)+num(s.borderBottomWidth)+num(s.borderLeftWidth) >= .75;
        const radius = maxNum(s.borderRadius);
        const shadow = String(s.boxShadow || 'none') !== 'none';
        const padding = num(s.paddingTop)+num(s.paddingRight)+num(s.paddingBottom)+num(s.paddingLeft);
        const score = (bg?2:0)+(border?1:0)+(radius>=4?1:0)+(shadow?1:0)+(padding>=12?1:0);
        if (!(bg || border || shadow) || score < 3) continue;
        boxes.push({ el, parent:el.parentElement, r, bg, border, radius:radius>=4, shadow, padding:padding>=12, w:r.width/stageRect.width, cx:r.cx, cy:r.cy });
    }
    return { boxes, text:textLen(stage), abs, stageRect };
}

function similar(a,b) {
    if (!a || !b) return 0;
    let hit=0, total=0;
    const add=(ok,w)=>{total+=w;if(ok)hit+=w;};
    add(Math.abs(a.w-b.w)<=.13,.28);
    add(Math.abs(a.r.height-b.r.height)/Math.max(1,a.r.height,b.r.height)<=.48,.14);
    add(a.bg===b.bg,.12); add(a.border===b.border,.12); add(a.radius===b.radius,.10); add(a.shadow===b.shadow,.08); add(a.padding===b.padding,.08); add(a.parent===b.parent,.08);
    return total?hit/total:0;
}

function ratio(items) {
    if (items.length < 2) return 0;
    let pairs=0, hits=0;
    for(let i=0;i<items.length;i++) for(let j=i+1;j<items.length;j++){pairs++;if(similar(items[i],items[j])>=.72)hits++;}
    return pairs?hits/pairs:0;
}

function geometry(items) {
    if (items.length < 3) return 'mixed';
    const xs=items.map(x=>x.cx), ys=items.map(x=>x.cy), dx=Math.max(...xs)-Math.min(...xs), dy=Math.max(...ys)-Math.min(...ys);
    return dx>dy*1.35?'row':dy>dx*1.35?'column':'grid';
}

function renderedProfile(details) {
    const data = collectBoxes(details), {boxes}=data;
    let grid=false, stack=false, siblingRepeat=false;
    const groups=new Map();
    for(const box of boxes){ if(!box.parent)continue; const list=groups.get(box.parent)||[]; list.push(box); groups.set(box.parent,list); }
    for(const [parent,items] of groups){
        if(items.length<3 || ratio(items)<.34) continue;
        siblingRepeat=true;
        const s=styleOf(parent), display=String(s?.display||''), direction=String(s?.flexDirection||''), wrap=String(s?.flexWrap||''), g=geometry(items);
        if(display.includes('grid') || g==='grid' || (display.includes('flex') && (wrap!=='nowrap' || g==='row'))) grid=true;
        if((display.includes('flex') && direction==='column') || (!display.includes('grid') && g==='column')) stack=true;
    }
    const allRatio=ratio(boxes);
    const repeated=siblingRepeat || (boxes.length>=4&&allRatio>=.22) || (boxes.length>=6&&allRatio>=.14);
    const rounded=repeated && boxes.filter(x=>x.radius).length/Math.max(1,boxes.length)>=.55;
    const flat=data.text>=520 && data.abs<=1 && !details.querySelector?.('svg[viewBox],canvas') && (stack || (repeated&&geometry(boxes.slice(0,8))==='column'));
    const info=(repeated&&boxes.length>=4&&data.text>=260)||grid||stack;
    const flags=[];
    if(grid)flags.push('same_grid_card_risk');
    if(stack)flags.push('same_block_stack');
    if(repeated)flags.push('repeated_unit_shape');
    if(flat)flags.push('flat_vertical_flow');
    if(info)flags.push('info_page_degrade');
    return {...data, allRatio, repeated, rounded, grid, stack, flat, info, flags};
}

function parseSkeleton(value='') {
    const out={};
    for(const part of String(value).split('；')){const m=part.match(/^\s*([a-z_]+)\s*:\s*(.+?)\s*$/i);if(m)out[m[1]]=m[2];}
    return out;
}

function mergeSkeleton(base, palette, profile) {
    const f=parseSkeleton(base), b=String(palette?.brightness||'');
    if(b==='dark')f.contrast_family='contrast: dark_weighted'; else if(b==='light')f.contrast_family='contrast: light_weighted'; else if(b==='mid')f.contrast_family='contrast: mid_tone_or_mixed';
    if(profile.repeated){f.unit_family='矩形信息块/卡片化条目';f.contour_family=profile.rounded?'contour: rounded_panel_cluster':'contour: repeated_rectangular_blocks';}
    if(profile.grid){f.reading_family='按网格分区扫描';f.space_family='space: grid_plane';}
    else if(profile.stack||profile.flat){f.reading_family='自上而下分段扫描';f.space_family='space: flat_content_surface';}
    const order=['surface_family','contrast_family','contour_family','reading_family','unit_family','space_family','interaction_family','mood'];
    return order.filter(k=>f[k]).map(k=>`${k}: ${f[k]}`).join('；');
}

function sourceHtml(details) {
    try { const clone=details.cloneNode(true); clone.querySelectorAll?.(TOOL)?.forEach(n=>n.remove()); return `<toto data-rabbit-mirror="true" style="display:block;">${clone.outerHTML}</toto>`; }
    catch { return ''; }
}

function commit(host, details, expectedSeq=0) {
    if(!eligible(details,host)) return false;
    if(host?.dataset?.rmSource==='independent'&&expectedSeq>0&&(Number(hostSeq.get(host)||0)!==expectedSeq||expectedSeq!==seq||host!==latestHost)) return false;
    const html=sourceHtml(details); if(!html)return false;
    const key=`${ownerIndex(details,host)}|${host?.dataset?.rmKey||''}|${host?.dataset?.rmSourceHash||''}|${html.length}|${hash(html)}`;
    if(seen.has(key))return false;
    const scan=scanRabbitMirrorHtml(html,host||details)||{}, profile=renderedProfile(details), palette=scan.paletteFingerprint&&typeof scan.paletteFingerprint==='object'?scan.paletteFingerprint:null;
    const skeleton=mergeSkeleton(scan.skeleton||'',palette,profile);
    const flags=[...new Set([...(profile.flags||[]),...(Array.isArray(scan.riskFlags)?scan.riskFlags:[])])].slice(0,8);
    updateLatestVisualSignature(scan.signature||'',skeleton||scan.skeleton||'',flags,palette,scan.interactionFamily||null);
    seen.set(key,Date.now()); while(seen.size>48)seen.delete(seen.keys().next().value);
    globalThis.__rabbitMirrorRenderedVisualFeedbackLast={version:VERSION,ownerMesid:ownerIndex(details,host),source:String(host?.dataset?.rmSource||'inline'),brightness:String(palette?.brightness||''),darkAreaRatio:Number(palette?.darkAreaRatio||0),averageLuminance:Number(palette?.averageLuminance||0),renderedBoxes:profile.boxes.length,renderedSimilarity:Number(profile.allRatio.toFixed(3)),riskFlags:flags,skeleton,ts:Date.now()};
    console.debug('[RabbitMirror] rendered visual feedback committed:',globalThis.__rabbitMirrorRenderedVisualFeedbackLast);
    return true;
}

function cancelSchedule(){if(raf1)globalThis.cancelAnimationFrame?.(raf1);if(raf2)globalThis.cancelAnimationFrame?.(raf2);if(timer)clearTimeout(timer);raf1=raf2=timer=0;}
function schedule(host,details,expectedSeq=0){
    if(!eligible(details,host))return;
    cancelSchedule();
    const run=()=>{timer=0;commit(host,details,expectedSeq);};
    if(typeof requestAnimationFrame==='function')raf1=requestAnimationFrame(()=>{raf1=0;raf2=requestAnimationFrame(()=>{raf2=0;timer=setTimeout(run,72);});});
    else timer=setTimeout(run,90);
}

function onToggle(event){
    const details=event?.target;if(!details||details.tagName!=='DETAILS'||!details.open||!isMirror(details))return;
    const host=details.closest?.(HOST)||null;if(!eligible(details,host))return;
    schedule(host,details,host?.dataset?.rmSource==='independent'?Number(hostSeq.get(host)||0):0);
}

function onState(records){
    for(const rec of records){
        if(rec.type!=='attributes'||rec.attributeName!=='data-rm-state')continue;
        const host=rec.target;if(!host?.matches?.(READY_INDEPENDENT))continue;
        const old=String(rec.oldValue||'');if(!old||old==='ready')continue;
        seq++;latestHost=host;hostSeq.set(host,seq);
        const details=host.querySelector?.(':scope > details');if(details?.open)schedule(host,details,seq);
    }
}

function install(){
    root=document.querySelector?.('#chat')||null;if(!root)return false;
    root.addEventListener('toggle',onToggle,true);
    if(typeof MutationObserver!=='undefined'){observer=new MutationObserver(onState);observer.observe(root,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['data-rm-state']});}
    return true;
}

export function destroyRabbitMirrorRenderedVisualFeedbackHotfix(){
    cancelSchedule();observer?.disconnect?.();observer=null;root?.removeEventListener?.('toggle',onToggle,true);root=null;seq=0;latestHost=null;seen.clear();
    try{delete globalThis.__rabbitMirrorRenderedVisualFeedbackLast;}catch{}
    if(globalThis.__rabbitMirrorRenderedVisualFeedbackHotfixCleanup===destroyRabbitMirrorRenderedVisualFeedbackHotfix)delete globalThis.__rabbitMirrorRenderedVisualFeedbackHotfixCleanup;
}

export function initRabbitMirrorRenderedVisualFeedbackHotfix(){
    try{globalThis.__rabbitMirrorRenderedVisualFeedbackHotfixCleanup?.();}catch{}
    destroyRabbitMirrorRenderedVisualFeedbackHotfix();
    const ok=install();
    if(!ok)timer=setTimeout(()=>{timer=0;if(!root)install();},600);
    globalThis.__rabbitMirrorRenderedVisualFeedbackHotfixCleanup=destroyRabbitMirrorRenderedVisualFeedbackHotfix;
    console.log(`[RabbitMirror] rendered visual feedback hotfix ${VERSION} ${ok?'active':'waiting for #chat'}`);
}
