// Split from ui.js — TT diagnostic entry.

import { startTtSurfaceDiagnostics, stopTtSurfaceDiagnostics, isTtSurfaceDiagnosticsActive, buildTtSurfaceReport, recordTtSurface, registerTtSurfaceCleanup, nextTtSurfaceClickSeq } from '../ttSurfaceDiagnostics.js?rmv=1.5.53-cn-boundary1';
import { getRabbitMirrorHostCompatibilityStatus } from '../hostCompatibility.js?rmv=1.6.3-ttchild1';
import { RUNTIME_VERSION, isCurrentRuntime } from './runtime.js?rmv=1.6';

let retainedTtDiagnosticReport = '';

// Session-only capture. Never retain generated text or put diagnostic state on DOM nodes.
function captureTtDiagnosticInputs(chatRoot, session) {
    if (!chatRoot?.addEventListener) return;
    let root = chatRoot;
    let nodeIds = new WeakMap();
    let nextNodeId = 0;
    const pending = new Map();
    const recent = new Map();
    const bound = (map, key, value) => {
        map.delete(key); map.set(key, value);
        if (map.size > 24) map.delete(map.keys().next().value);
    };
    const nodeId = node => {
        if (!nodeIds.has(node)) nodeIds.set(node, ++nextNodeId);
        return nodeIds.get(node);
    };
    const handler = event => {
        if (!isTtSurfaceDiagnosticsActive() || !root) return;
        const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
        const summary = target?.closest?.('summary');
        const details = event.type === 'toggle' ? target : summary?.parentElement;
        if (!details?.matches?.('details') || !root.contains(details)) return;
        if (!details.closest('toto[data-rabbit-mirror="true"], toto[data-rabbit-hole="true"], [data-rabbit-mirror-css-scope], [data-rabbit-mirror-external-source="true"], .rabbit-mirror-external-host')) return;
        if (summary && target.closest('button, input, select, textarea, a[href], [contenteditable="true"], [data-rabbit-mirror-tool-entry-host]')) return;
        const id = nodeId(details);
        const pointer = Number.isFinite(event.pointerId) ? event.pointerId : -1;
        let previous = pending.get(pointer);
        let seq;
        if (event.type === 'pointerdown') {
            seq = nextTtSurfaceClickSeq();
            bound(pending, pointer, { seq, node: id });
            previous = null;
        } else if (event.type === 'toggle') {
            seq = recent.get(id) || 0;
        } else {
            seq = previous?.seq || recent.get(id) || nextTtSurfaceClickSeq();
        }
        if (event.type === 'click' || event.type === 'pointercancel') pending.delete(pointer);
        if (seq) bound(recent, id, seq);
        const messageId = Number(details.closest('.mes')?.getAttribute('mesid'));
        session.inputEvents += 1;
        // All arguments are scalars. A new DOM identity is recorded, never restored.
        recordTtSurface(event.type, {
            seq, node: id, mesid: Number.isInteger(messageId) ? messageId : -1,
            pointerId: Number.isFinite(event.pointerId) ? event.pointerId : undefined,
            pointerType: typeof event.pointerType === 'string' ? event.pointerType : undefined,
            detail: Number.isFinite(event.detail) ? event.detail : undefined,
            eventTime: Number.isFinite(event.timeStamp) ? event.timeStamp : undefined,
            phase: 'capture-before-default',
            open: !!details.open, connected: !!details.isConnected,
            sameDetails: previous ? previous.node === id : undefined,
            defaultPrevented: !!event.defaultPrevented,
        });
    };
    const events = ['pointerdown', 'pointerup', 'pointercancel', 'click', 'toggle'];
    registerTtSurfaceCleanup(() => {
        for (const type of events) root?.removeEventListener(type, handler, true);
        pending.clear(); recent.clear(); nodeIds = new WeakMap(); root = null;
    });
    for (const type of events) root.addEventListener(type, handler, { capture: true, passive: true });
}

// Only these two TT controls use pointerup; a drag/cancel must never start diagnostics.
function bindTtDiagnosticTap(button, activate, isAlive) {
    let gesture = null;
    let suppressClick = null;
    const now = () => performance.now();
    const isTouch = event => event.pointerType === 'touch' || event.pointerType === 'pen';
    const usable = () => isAlive() && button.isConnected && !button.disabled;
    const clearGesture = event => {
        if (gesture && gesture.id === event.pointerId) {
            suppressClick = { at: now(), id: gesture.id };
            gesture = null;
        }
    };
    const onDown = event => {
        if (!isTouch(event) || !usable()) return;
        if (event.isPrimary === false) {
            if (gesture) suppressClick = { at: now(), id: gesture.id };
            gesture = null;
            return;
        }
        if (event.button !== 0) return;
        suppressClick = null;
        gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, at: now(), moved: false };
    };
    const onMove = event => {
        if (!gesture || gesture.id !== event.pointerId) return;
        if (Math.abs(event.clientX - gesture.x) > 12 || Math.abs(event.clientY - gesture.y) > 12) gesture.moved = true;
    };
    const onUp = event => {
        if (!isTouch(event) || !gesture || gesture.id !== event.pointerId) return;
        const tap = gesture;
        gesture = null;
        suppressClick = { at: now(), id: tap.id };
        if (!usable() || event.isPrimary === false || tap.moved || now() - tap.at > 900
            || Math.abs(event.clientX - tap.x) > 12 || Math.abs(event.clientY - tap.y) > 12) return;
        // Do not synthesize click or cancel native scrolling. The later click is de-duplicated.
        activate('pointerup');
    };
    const onClick = event => {
        if (!usable()) return;
        // detail=0 is keyboard/accessibility activation, not the compatibility click after a tap.
        if (event.detail !== 0 && suppressClick && now() - suppressClick.at < 1000
            && (!(event.pointerId > 0) || event.pointerId === suppressClick.id)) return;
        suppressClick = null;
        gesture = null;
        activate('click');
    };
    const handlers = { pointerdown: onDown, pointermove: onMove, pointerup: onUp,
        pointercancel: clearGesture, lostpointercapture: clearGesture, click: onClick };
    for (const [type, handler] of Object.entries(handlers)) {
        button.addEventListener(type, handler, { capture: true, passive: true });
    }
    return () => {
        for (const [type, handler] of Object.entries(handlers)) button.removeEventListener(type, handler, true);
        gesture = null;
        suppressClick = null;
    };
}

function ttDiagnosticHostNote(state) {
    if (state?.managed === true && state?.registered === true) return 'ChatSurface 已托管。';
    if (state?.projectionFallback === true) return 'TT 首次投影已关闭注册窗口；兔子镜只能跟随当前可见楼层，滚入画面时从本机缓存回挂成品，不发新的副 API。这不是 ChatSurface 注册已修好。';
    if (state?.registrationFailure === 'late-projection') return '兔子镜尝试注册时 TT 的首次聊天投影已开始，已错过注册窗口；反复点击设置不能补注册。可见楼层滚回来时会从缓存回挂，仍不是官方原位置常驻。';
    if (state?.registrationFailure === 'duplicate-participant') return 'TT 检测到重复的兔子镜注册；请仅启用一份正式版或测试版兔子镜后重启。';
    if (state?.registrationFailure === 'host-rejected') return 'TT 拒绝了 ChatSurface 注册，具体原因未公开；不能据此认定已接入或已修复。';
    return '当前未接入 managed ChatSurface；仍可采集触摸和入口状态，缺少挂载记录不能用于排除问题。';
}

function installTtDiagnosticEntry() {
    try { globalThis.__rabbitMirrorTtDiagnosticUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorTtDiagnosticUiCleanup = null;
    const panel = document.getElementById('rabbit_mirror_theater_settings');
    if (!panel) return;
    const start = $(panel.querySelector('#rh_tt_diag_start'));
    const copy = $(panel.querySelector('#rh_tt_diag_copy'));
    const statusText = $(panel.querySelector('#rh_tt_diag_status'));
    const output = $(panel.querySelector('#rh_tt_diag_output'));
    if (!start.length || !copy.length || !statusText.length || !output.length) return;
    const hostState = getRabbitMirrorHostCompatibilityStatus();
    const isTt = !!globalThis.__TAURITAVERN__ || hostState?.host === 'tauritavern';
    // The shared button CSS uses display:... !important; plain .hide() cannot beat it.
    for (const button of [start[0], copy[0]]) {
        button.hidden = !isTt;
        button.style.setProperty('display', isTt ? 'inline-flex' : 'none', 'important');
    }
    if (!isTt) { statusText.hide(); output.hide(); return; }
    let disposed = false;
    let session = null;
    const inputCleanups = [];
    const isAlive = () => !disposed && isCurrentRuntime() && panel.isConnected
        && document.getElementById('rabbit_mirror_theater_settings') === panel;
    const hostNote = ttDiagnosticHostNote(hostState);
    const notify = (kind, text) => { try { globalThis.toastr?.[kind]?.(text); } catch {} };
    const setStatus = text => { if (!disposed) statusText.text(text).show(); };
    const report = () => {
        if (!session) return retainedTtDiagnosticReport;
        const elapsed = Math.max(0, (session.endedAt ?? performance.now()) - session.startedAt);
        const head = [
            'TT 诊断入口：1.5.48-ttentry3',
            `diagnostic-start +0ms | managed=${session.host.managed} | registered=${session.host.registered} | protocolVersion=${session.host.protocolVersion ?? '不可用'}`,
            `入口动作=${session.activation} | chatRootFound=${session.chatRootFound} | pointerEvents=${session.pointerEvents} | 输入事件 ${session.inputEvents} 条`,
            session.host.managed && session.host.registered ? '' : '未接入 managed ChatSurface：挂载分发不可用或未启用；以下报告不代表没有卡顿。',
            session.endedAt !== null ? `diagnostic-stop +${elapsed.toFixed(0)}ms | ${session.stopReason || '自动停止或达到条数上限'}` : '状态：正在采集',
            session.host.errorCode ? `宿主状态：${session.host.errorCode}` : '',
            session.host.registrationFailure ? `注册原因：${session.host.registrationFailure} | ${ttDiagnosticHostNote(session.host)}` : '',
            '没有业务记录不代表没有卡顿；以下为空时，只能确认入口已运行。',
        ].filter(Boolean).join('\n');
        return head + '\n\n' + (session.engineStarted ? buildTtSurfaceReport({ version: RUNTIME_VERSION, ...session.host }) : '采集模块未成功启动。');
    };
    const renderStopped = () => {
        if (!session) return;
        session.endedAt = performance.now();
        retainedTtDiagnosticReport = report();
        if (disposed) return;
        start.text('开始 TT 诊断（20 秒）').prop('disabled', false);
        copy.prop('disabled', false);
        setStatus('TT 诊断已结束，报告已显示，可复制；没有业务事件也会保留入口状态。');
        output.val(retainedTtDiagnosticReport).show();
        if (session.stopReason !== '入口启动异常') notify('success', 'TT 诊断已结束，报告已保留；请点击“复制 TT 诊断”。');
    };
    const startDiagnostic = activation => {
        if (!isAlive()) return;
        if (isTtSurfaceDiagnosticsActive()) {
            if (session) session.stopReason = '手动结束';
            stopTtSurfaceDiagnostics();
            return;
        }
        try {
            const state = getRabbitMirrorHostCompatibilityStatus();
            const chatRoot = document.getElementById('chat');
            session = {
                startedAt: performance.now(), endedAt: null, inputEvents: 0, engineStarted: false, activation,
                chatRootFound: !!chatRoot, pointerEvents: typeof globalThis.PointerEvent === 'function',
                host: { managed: state?.managed === true, registered: state?.registered === true,
                    protocolVersion: Number.isFinite(state?.protocolVersion) ? state.protocolVersion : null,
                    errorCode: String(state?.errorCode || '').slice(0, 48),
                    registrationFailure: ['late-projection', 'duplicate-participant', 'host-rejected'].includes(state?.registrationFailure) ? state.registrationFailure : '' },
            };
            retainedTtDiagnosticReport = '';
            output.val('').hide();
            startTtSurfaceDiagnostics({ onStateChange: active => {
                if (active) {
                    session.engineStarted = true;
                    recordTtSurface('diagnostic-start', { managed: session.host.managed, registered: session.host.registered, protocolVersion: session.host.protocolVersion });
                } else renderStopped();
            } });
            captureTtDiagnosticInputs(chatRoot, session);
            start.text('结束 TT 诊断（20 秒自动停止）').prop('disabled', false);
            copy.prop('disabled', false);
            setStatus(chatRoot ? `TT 诊断已开始（入口修复3）。请收起设置，在 20 秒内复现问题。${ttDiagnosticHostNote(session.host)}` : 'TT 诊断已开始，但未找到聊天窗口；请进入聊天后重新采集。');
            notify('info', 'TT 诊断已开始，请在 20 秒内复现滚动卡顿或点不开。');
        } catch {
            if (session) session.stopReason = '入口启动异常';
            try { stopTtSurfaceDiagnostics(); } catch {}
            if (session) { session.endedAt = performance.now(); retainedTtDiagnosticReport = report(); }
            start.text('开始 TT 诊断（20 秒）').prop('disabled', false);
            copy.prop('disabled', false);
            output.val(retainedTtDiagnosticReport || 'TT 诊断入口启动失败，未进行采集。').show();
            setStatus('TT 诊断启动失败，已显示入口报告；请复制反馈，不需要重新生成兔子镜。');
            notify('error', 'TT 诊断未正常启动，请复制下方入口报告。');
        }
    };
    const copyDiagnostic = async () => {
        if (!isAlive()) return;
        if (isTtSurfaceDiagnosticsActive()) {
            if (session) session.stopReason = '复制前结束';
            stopTtSurfaceDiagnostics();
        }
        const text = report();
        if (!text) {
            setStatus('还没有 TT 诊断报告，请先点击“开始 TT 诊断”并复现问题。');
            notify('warning', '还没有 TT 诊断报告，请先开始诊断。');
            return;
        }
        output.val(text).show();
        try {
            if (typeof navigator.clipboard?.writeText !== 'function') throw new Error('clipboard-unavailable');
            await navigator.clipboard.writeText(text);
            if (isAlive()) { setStatus('TT 诊断已复制。'); notify('success', '已复制 TT ChatSurface 诊断'); }
        } catch {
            if (!isAlive()) return;
            const textarea = output[0];
            let copied = false;
            try {
                textarea?.focus?.({ preventScroll: true }); textarea?.select?.();
                textarea?.setSelectionRange?.(0, text.length);
                copied = document.execCommand?.('copy') === true;
            } catch {}
            setStatus(copied ? 'TT 诊断已复制。' : '自动复制未成功：报告已显示，请长按下方文本全选复制。');
            notify(copied ? 'success' : 'warning', copied ? '已复制 TT ChatSurface 诊断' : '自动复制未成功，请长按下方报告手动复制。');
        }
    };
    start.off('.rmTtDiag'); copy.off('.rmTtDiag');
    inputCleanups.push(bindTtDiagnosticTap(start[0], startDiagnostic, isAlive));
    inputCleanups.push(bindTtDiagnosticTap(copy[0], copyDiagnostic, isAlive));
    start.text('开始 TT 诊断（20 秒）').prop('disabled', false);
    copy.prop('disabled', false);
    setStatus(`TT 入口修复3 · 已就绪。${hostNote}`
        + (retainedTtDiagnosticReport ? ' 已保留上次报告。' : ' 手动开启后采集 20 秒，不发模型请求。'));
    if (retainedTtDiagnosticReport) output.val(retainedTtDiagnosticReport).show();
    const cleanup = () => {
        if (disposed) return;
        disposed = true;
        if (session) session.stopReason = '设置界面卸载';
        try { stopTtSurfaceDiagnostics(); } catch {}
        for (const dispose of inputCleanups.splice(0)) dispose();
        start.off('.rmTtDiag'); copy.off('.rmTtDiag');
        if (globalThis.__rabbitMirrorTtDiagnosticUiCleanup === cleanup) globalThis.__rabbitMirrorTtDiagnosticUiCleanup = null;
    };
    globalThis.__rabbitMirrorTtDiagnosticUiCleanup = cleanup;
}

export { installTtDiagnosticEntry };
