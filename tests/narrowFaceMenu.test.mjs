import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../src/outputSanitizer.js', import.meta.url), 'utf8');
const actionSource = source.slice(source.indexOf('async function runMaintenanceNarrowFaceRepair('), source.indexOf('function maintenanceRecommendationForInspection('));
const menuSource = source.slice(source.indexOf('function showMaintenanceRabbitMenu('), source.indexOf('function handleMaintenanceRabbitClick('));
function fixture(options = {}) {
    const states = [], calls = [];
    const details = { isConnected: true, open: true, querySelector: () => ({}) };
    const button = { isConnected: true, closest: () => details };
    let current = true, locked = false;
    const adapter = {
        remeasureRabbitMirrorFaceGeometry: root => { assert.equal(root, details); calls.push('geometry'); return options.geometry || {status:'inline',beforeWidth:366,afterWidth:366}; },
        repairRabbitMirrorFaceAutoWidth: root => { assert.equal(root, details); calls.push('body'); return options.content || {status:'repaired',beforeWidth:227,afterWidth:366}; },
    };
    const context = vm.createContext({ console,
        isRabbitMirrorDetails: root => root === details,
        MAINTENANCE_STATES: {idle:'idle',checking:'checking',unknown:'unknown'},
        setMaintenanceRabbitState: (_, state, text) => states.push({state,text}),
        beginMaintenanceRepairRun: () => { if(locked) return null; locked=true; return {}; },
        maintenanceRepairRunIsCurrent: () => current,
        finishMaintenanceRepairRun: () => { locked=false; calls.push('finish'); },
        rejectOversizedMaintenanceRepair: () => !!options.oversized,
        containRabbitMirrorTitleToolFloat: () => calls.push('float'),
        failMaintenanceRabbit: (_, text) => states.push({state:'failed',text}),
        loadAdapter: options.loadAdapter || (async () => adapter),
    });
    // Stub only the asynchronous module-loading boundary. Execute the complete
    // production action; repair collaborators/owner changes are explicit fakes.
    const transformed = actionSource.replace(/await import\('\.\/independentApi\.js\?rmv=[^']+'\)/, 'await loadAdapter()');
    assert.notEqual(transformed, actionSource);
    vm.runInContext(transformed, context);
    return {details,button,states,calls,adapter,run:()=>context.runMaintenanceNarrowFaceRepair(details,button), stale:()=>{current=false;}, get locked(){return locked;}};
}
test('manual action measures current face and reports measured gain, keeping node identity', async () => {
    const f=fixture(); const node=f.details;
    assert.equal(await f.run(),true);
    assert.equal(f.details,node);
    assert.deepEqual(f.calls,['geometry','float','body','finish']);
    assert.match(f.states.at(-1).text,/227 → 366/);
    assert.equal(f.locked,false);
});
test('no measured improvement is not labelled recovered', async () => {
    const f=fixture({content:{status:'protected',beforeWidth:260,afterWidth:260}});
    assert.equal(await f.run(),false);
    assert.match(f.states.at(-1).text,/未确认/);
});
test('closed face keeps its folded state and does not load or repair', async () => {
    const f=fixture(); f.details.open=false;
    assert.equal(await f.run(),false);
    assert.equal(f.details.open,false);
    assert.deepEqual(f.calls,[]);
});
test('over-budget face stops before module loading or geometry changes', async () => {
    const f=fixture({oversized:true}); assert.equal(await f.run(),false);
    assert.deepEqual(f.calls,['finish']);
});
test('chat or swipe change during module load cancels without applying to replacement', async () => {
    let resolve; const f=fixture({loadAdapter:()=>new Promise(r=>{resolve=r;})});
    const pending=f.run(); f.stale(); resolve(f.adapter);
    assert.equal(await pending,false);
    assert.deepEqual(f.calls,['finish']);
    assert.match(f.states.at(-1).text,/取消/);
});
test('repeat click during pending load cannot start a second repair', async () => {
    let resolve; const f=fixture({loadAdapter:()=>new Promise(r=>{resolve=r;})});
    const first=f.run(); assert.equal(await f.run(),false);
    resolve(f.adapter); assert.equal(await first,true);
    assert.equal(f.calls.filter(x=>x==='geometry').length,1);
});
test('stale external ownership stops before changing title or body', async () => {
    const f=fixture({geometry:{status:'stale',beforeWidth:0,afterWidth:0}});
    assert.equal(await f.run(),false);
    assert.deepEqual(f.calls,['geometry','finish']);
});
test('adapter exception releases maintenance lock without claiming success', async () => {
    const f=fixture({loadAdapter:async()=>{throw new Error('fixture unavailable');}});
    assert.equal(await f.run(),false); assert.equal(f.locked,false);
    assert.equal(f.states.at(-1).state,'failed');
});
test('real maintenance menu routes narrow-width to dedicated action, not generic repair', () => {
    let handler, dedicated=0, generic=0;
    const panel={setAttribute(){},querySelector(){return null;},style:{},offsetHeight:400,
        addEventListener(type,fn){ if(type==='click') handler=fn; }};
    const root={isConnected:true}, button={isConnected:true,getBoundingClientRect:()=>({left:20,bottom:30})};
    const context=vm.createContext({
        document:{createElement:()=>panel,body:{appendChild(){}}},innerWidth:390,innerHeight:844,
        closeFeedbackCatMenu(){},closeMaintenanceRabbitMenu(){},
        MAINTENANCE_MENU_ATTR:'data-menu',hasRabbitMirrorInteractionResetSnapshot:()=>false,
        maintenancePreRepairSnapshots:new Map(),maintenanceSnapshotKey:()=>'',bindMaintenanceOutsideClose(){},
        runMaintenanceNarrowFaceRepair:(r,b)=>{assert.equal(r,root);assert.equal(b,button);dedicated++;},
        runMaintenanceUserRepair:()=>generic++,
    });
    vm.runInContext(menuSource,context);
    assert.equal(context.showMaintenanceRabbitMenu(root,button),true);
    assert.match(panel.innerHTML,/data-rm-maintenance-action="narrow-width">⚡ 强效电击：恢复窄面/);
    handler({target:{closest:()=>({getAttribute:()=> 'narrow-width'})},preventDefault(){},stopPropagation(){}});
    assert.equal(dedicated,1); assert.equal(generic,0);
});
test('real maintenance menu routes reveal-clip to dedicated action, not generic repair', () => {
    let handler, dedicated=0, generic=0;
    const panel={setAttribute(){},querySelector(){return null;},style:{},offsetHeight:400,
        addEventListener(type,fn){ if(type==='click') handler=fn; }};
    const root={isConnected:true}, button={isConnected:true,getBoundingClientRect:()=>({left:20,bottom:30})};
    const context=vm.createContext({
        document:{createElement:()=>panel,body:{appendChild(){}}},innerWidth:390,innerHeight:844,
        closeFeedbackCatMenu(){},closeMaintenanceRabbitMenu(){},
        MAINTENANCE_MENU_ATTR:'data-menu',hasRabbitMirrorInteractionResetSnapshot:()=>false,
        maintenancePreRepairSnapshots:new Map(),maintenanceSnapshotKey:()=>'',bindMaintenanceOutsideClose(){},
        runMaintenanceNarrowFaceRepair:()=>{},
        runMaintenanceRevealClipRepair:(r,b)=>{assert.equal(r,root);assert.equal(b,button);dedicated++;},
        runMaintenanceUserRepair:()=>generic++,
    });
    vm.runInContext(menuSource,context);
    assert.equal(context.showMaintenanceRabbitMenu(root,button),true);
    assert.match(panel.innerHTML,/data-rm-maintenance-action="reveal-clip">📖 展开后文字被裁／显示不全/);
    handler({target:{closest:()=>({getAttribute:()=> 'reveal-clip'})},preventDefault(){},stopPropagation(){}});
    assert.equal(dedicated,1); assert.equal(generic,0);
});
