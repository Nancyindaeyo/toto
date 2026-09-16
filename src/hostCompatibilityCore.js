// TT Project Contract v1, not an invented SillyTavern event or private engine API.
// https://github.com/Darkatse/TauriTavern/blob/9693a4ec47cd4552f90878bccab453f176de0f18/docs/API/ChatSurface.md
// Register this lightweight bridge during extension evaluation, before projection.
// Heavy consumers may subscribe later; only currently mounted host leases are replayed.
const PARTICIPANT_ID = 'rabbitmirror/message-runtime';
const SURFACES = new Set(['fullscreen-window', 'backdrop', 'free-window', 'viewport-host']);

// TT v1 freezes registration at the first projection. If this extension is
// loaded after that freeze, we still follow currently visible #chat > .mes
// nodes and emit the same lease callbacks. We do not rewrite projection
// structure or append siblings to #chat.
function registrationFailureReason(error) {
    const message = typeof error?.message === 'string' ? error.message : '';
    if (message.includes('must register before the first projection')) return 'late-projection';
    if (message.includes('participant already registered')) return 'duplicate-participant';
    return 'host-rejected';
}

function toDisposer(value) {
    if (value === undefined || value === null) return null;
    if (typeof value === 'function') return value;
    if (typeof value?.then === 'function') throw new TypeError('RabbitMirror ChatSurface handlers must return synchronous cleanup');
    if (typeof value?.dispose === 'function') return () => value.dispose();
    throw new TypeError('RabbitMirror ChatSurface cleanup must be a function or disposable');
}

export function createRabbitMirrorHostCompatibility(hostGlobal = globalThis, diagnostics = {}) {
    let recordTtSurface = diagnostics.record || (() => {});
    let ttSurfaceNow = diagnostics.now || (() => 0);
    let disposed = false;
    let initialized = false;
    let managed = false;
    let registration = null;
    let status = Object.freeze({ host: 'sillytavern', managed: false, registered: false, protocolVersion: null, errorCode: '', projectionFallback: false });
    const subscriptions = new Map();
    const mounted = new Map();
    const visibleFallback = { observer: null, chatWaiter: null, contentFrame: 0, pendingContent: new Set(), adopted: new Map() };

    function reportFault(error) {
        status = Object.freeze({ ...status, errorCode: 'CHAT_SURFACE_CONSUMER_FAILED' });
        registration?.fault?.(error);
    }

    function disposeCallback(lease, id) {
        const dispose = lease.cleanups.get(id);
        lease.cleanups.delete(id);
        lease.delivered.delete(id);
        dispose?.();
    }

    function deliver(lease, subscription) {
        if (!lease.active || lease.context.signal.aborted || lease.delivered.has(subscription.id)) return;
        const callback = subscription[lease.kind];
        if (typeof callback !== 'function') return;
        lease.delivered.add(subscription.id);
        // 仅诊断：关闭时 ttSurfaceNow() 返回 0，不会调用 performance.now()。
        const ttStart = ttSurfaceNow();
        const dispose = toDisposer(callback(lease.context));
        recordTtSurface('deliver', {
            sub: subscription.id, phase: lease.kind, mesid: lease.context.mesid,
            ms: ttStart ? performance.now() - ttStart : 0,
        });
        // A handler can synchronously release its own mount or subscription.
        if (!lease.active || !subscriptions.has(subscription.id) || lease.context.signal.aborted) dispose?.();
        else if (dispose) lease.cleanups.set(subscription.id, dispose);
    }

    function openLease(kind, context) {
        if (disposed) return () => {};
        if (!context?.element || !context?.content || !Number.isInteger(context?.mesid)
            || typeof context?.signal?.addEventListener !== 'function') {
            throw new TypeError('RabbitMirror requires a valid TT ChatSurface mounted context');
        }
        if (context.signal.aborted) return () => {};
        let record = mounted.get(context.element);
        if (!record) {
            record = { didMount: null, didCommitContent: null };
            mounted.set(context.element, record);
        }
        record[kind]?.dispose();
        // Replacing the final lease can remove the old record from the map.
        mounted.set(context.element, record);
        const lease = { kind, context, active: true, cleanups: new Map(), delivered: new Set(), dispose: null };
        const dispose = () => {
            if (!lease.active) return;
            recordTtSurface('lease-dispose', { mesid: context.mesid, phase: kind });
            lease.active = false;
            context.signal.removeEventListener('abort', dispose);
            let firstError = null;
            for (const id of [...lease.delivered]) {
                try { disposeCallback(lease, id); } catch (error) { firstError ??= error; }
            }
            if (record[kind] === lease) record[kind] = null;
            if (!record.didMount && !record.didCommitContent) mounted.delete(context.element);
            if (firstError) reportFault(firstError);
        };
        lease.dispose = dispose;
        record[kind] = lease;
        context.signal.addEventListener('abort', dispose, { once: true });
        try {
            for (const subscription of subscriptions.values()) deliver(lease, subscription);
        } catch (error) {
            dispose();
            throw error;
        }
        return dispose;
    }

    function messageContent(element) {
        return element.querySelector?.('.mes_text') || element;
    }

    function messageId(element) {
        const id = Number(element?.getAttribute?.('mesid'));
        return Number.isInteger(id) ? id : NaN;
    }

    function isAuxiliaryMessageChild(node) {
        return node instanceof Element && !!node.matches?.(
            'toto, [data-rabbit-mirror-external-source="true"], .rabbit-mirror-composer-clearance, [data-rabbit-mirror-tool-entry-host], .rabbit-mirror-maintenance-toolbar, [data-rabbit-mirror-tool-entry-host] *',
        );
    }

    function dropVisibleLease(element) {
        const record = visibleFallback.adopted.get(element);
        if (!record) return;
        visibleFallback.adopted.delete(element);
        record.contentObserver?.disconnect?.();
        try { record.mount.abort(); } catch {}
        try { record.content.abort(); } catch {}
    }

    function adoptVisibleMessage(element) {
        if (disposed || !managed || status.registered || !(element instanceof Element) || !element.matches?.('.mes')) return;
        const mesid = messageId(element);
        if (!Number.isInteger(mesid) || !element.isConnected) return;
        dropVisibleLease(element);
        const content = messageContent(element);
        const mount = new AbortController();
        const contentLease = new AbortController();
        openLease('didMount', { mesid, element, content, signal: mount.signal });
        openLease('didCommitContent', { mesid, element, content, signal: contentLease.signal });
        const contentObserver = typeof MutationObserver === 'function'
            ? new MutationObserver(records => {
                const hostReplacedContent = records.some(record =>
                    [...(record.addedNodes || []), ...(record.removedNodes || [])]
                        .some(node => node instanceof Element && !isAuxiliaryMessageChild(node)),
                );
                if (hostReplacedContent) queueVisibleContent(element);
            })
            : null;
        contentObserver?.observe(element, { childList: true });
        visibleFallback.adopted.set(element, { mount, content: contentLease, contentObserver });
    }

    function refreshVisibleContent(element) {
        const record = visibleFallback.adopted.get(element);
        if (!record || disposed || !element.isConnected) return;
        const mesid = messageId(element);
        if (!Number.isInteger(mesid)) return;
        const content = messageContent(element);
        try { record.content.abort(); } catch {}
        const contentLease = new AbortController();
        openLease('didCommitContent', { mesid, element, content, signal: contentLease.signal });
        record.content = contentLease;
        record.contentNode = content;
    }

    function queueVisibleContent(element) {
        if (!element) return;
        visibleFallback.pendingContent.add(element);
        if (visibleFallback.contentFrame) return;
        visibleFallback.contentFrame = hostGlobal.requestAnimationFrame?.(() => {
            visibleFallback.contentFrame = 0;
            const pending = [...visibleFallback.pendingContent];
            visibleFallback.pendingContent.clear();
            for (const node of pending) refreshVisibleContent(node);
        }) || 0;
        if (!visibleFallback.contentFrame) {
            visibleFallback.pendingContent.clear();
            refreshVisibleContent(element);
        }
    }

    function collectDirectMessages(root, node) {
        if (!(node instanceof Element)) return [];
        if (node.matches?.('.mes') && node.parentElement === root) return [node];
        return [...(node.querySelectorAll?.(':scope > .mes, .mes') || [])].filter(el => el.parentElement === root);
    }

    function stopVisibleProjectionFallback() {
        visibleFallback.observer?.disconnect?.();
        visibleFallback.observer = null;
        visibleFallback.chatWaiter?.disconnect?.();
        visibleFallback.chatWaiter = null;
        if (visibleFallback.contentFrame && typeof hostGlobal.cancelAnimationFrame === 'function') {
            hostGlobal.cancelAnimationFrame(visibleFallback.contentFrame);
        }
        visibleFallback.contentFrame = 0;
        visibleFallback.pendingContent.clear();
        for (const element of [...visibleFallback.adopted.keys()]) dropVisibleLease(element);
    }

    function attachVisibleProjectionFallback(chatRoot) {
        if (disposed || !managed || status.registered || visibleFallback.observer || !chatRoot?.isConnected) return;
        status = Object.freeze({ ...status, projectionFallback: true });
        for (const element of chatRoot.querySelectorAll?.(':scope > .mes') || []) adoptVisibleMessage(element);
        if (typeof MutationObserver !== 'function') return;
        visibleFallback.observer = new MutationObserver(records => {
            if (disposed || status.registered) return;
            for (const record of records) {
                if (record.target !== chatRoot || record.type !== 'childList') continue;
                for (const node of record.removedNodes || []) {
                    for (const element of collectDirectMessages(chatRoot, node)) dropVisibleLease(element);
                }
                for (const node of record.addedNodes || []) {
                    for (const element of collectDirectMessages(chatRoot, node)) adoptVisibleMessage(element);
                }
            }
        });
        visibleFallback.observer.observe(chatRoot, { childList: true });
        try { console.info('[RabbitMirror] ChatSurface late-projection fallback: following visible #chat > .mes leases'); } catch {}
    }

    function startVisibleProjectionFallback() {
        if (disposed || !managed || status.registered) return;
        const doc = hostGlobal.document;
        const chatRoot = doc?.getElementById?.('chat') || doc?.querySelector?.('#chat');
        if (chatRoot?.isConnected) {
            attachVisibleProjectionFallback(chatRoot);
            return;
        }
        if (visibleFallback.chatWaiter || typeof MutationObserver !== 'function' || !doc?.documentElement) return;
        visibleFallback.chatWaiter = new MutationObserver(() => {
            const found = doc.getElementById?.('chat') || doc.querySelector?.('#chat');
            if (!found?.isConnected) return;
            visibleFallback.chatWaiter?.disconnect?.();
            visibleFallback.chatWaiter = null;
            attachVisibleProjectionFallback(found);
        });
        visibleFallback.chatWaiter.observe(doc.documentElement, { childList: true, subtree: true });
    }

    function initialize() {
        if (initialized || disposed) return status;
        initialized = true;
        const host = hostGlobal?.__TAURITAVERN__;
        const api = host?.api?.chatSurface;
        if (!host) return status;
        status = Object.freeze({ ...status, host: 'tauritavern', protocolVersion: api?.protocolVersion ?? null });
        if (typeof api?.isManagedOwnershipRequired !== 'function') return status;
        try { managed = api.isManagedOwnershipRequired() === true; }
        catch {
            // Ownership is unknown, so do not launch an unmanaged repair watcher.
            managed = true;
            status = Object.freeze({ ...status, managed, errorCode: 'CHAT_SURFACE_OWNERSHIP_UNAVAILABLE' });
            startVisibleProjectionFallback();
            return status;
        }
        status = Object.freeze({ ...status, managed });
        if (!managed) return status;
        if (api.protocolVersion !== 1 || typeof api.registerParticipant !== 'function') {
            status = Object.freeze({ ...status, errorCode: 'CHAT_SURFACE_PROTOCOL_UNSUPPORTED' });
            startVisibleProjectionFallback();
            return status;
        }
        try {
            registration = api.registerParticipant({
                id: PARTICIPANT_ID,
                protocolVersion: 1,
                didMount: context => openLease('didMount', context),
                didCommitContent: context => openLease('didCommitContent', context),
            });
            status = Object.freeze({ ...status, registered: true });
        } catch (error) {
            status = Object.freeze({ ...status, errorCode: 'CHAT_SURFACE_REGISTRATION_FAILED',
                registrationFailure: registrationFailureReason(error) });
            startVisibleProjectionFallback();
        }
        return status;
    }

    function subscribe(definition) {
        if (disposed) return () => {};
        initialize();
        if (!definition || typeof definition.id !== 'string' || !definition.id.trim()) {
            throw new TypeError('RabbitMirror ChatSurface consumer requires a stable id');
        }
        for (const kind of ['didMount', 'didCommitContent']) {
            if (definition[kind] !== undefined && typeof definition[kind] !== 'function') {
                throw new TypeError(`RabbitMirror ChatSurface ${kind} must be a function`);
            }
        }
        // Host registration is best-effort. Late-projection still delivers visible
        // #chat leases so settings and in-viewport theaters can start.
        if (!managed) return () => {};
        if (subscriptions.has(definition.id)) throw new Error(`Duplicate RabbitMirror ChatSurface consumer: ${definition.id}`);
        const subscription = { id: definition.id, didMount: definition.didMount, didCommitContent: definition.didCommitContent };
        subscriptions.set(subscription.id, subscription);
        let active = true;
        const unsubscribe = () => {
            if (!active) return;
            active = false;
            subscriptions.delete(subscription.id);
            let firstError = null;
            for (const record of mounted.values()) {
                for (const kind of ['didMount', 'didCommitContent']) {
                    if (!record[kind]) continue;
                    try { disposeCallback(record[kind], subscription.id); } catch (error) { firstError ??= error; }
                }
            }
            if (firstError) reportFault(firstError);
        };
        try {
            for (const record of mounted.values()) {
                for (const kind of ['didMount', 'didCommitContent']) {
                    if (record[kind]) deliver(record[kind], subscription);
                }
            }
        } catch (error) {
            unsubscribe();
            reportFault(error);
            throw error;
        }
        return unsubscribe;
    }

    function dispose() {
        if (disposed) return;
        disposed = true;
        stopVisibleProjectionFallback();
        let firstError = null;
        for (const record of [...mounted.values()]) {
            for (const kind of ['didMount', 'didCommitContent']) {
                try { record[kind]?.dispose(); } catch (error) { firstError ??= error; }
            }
        }
        subscriptions.clear();
        mounted.clear();
        recordTtSurface = () => {};
        ttSurfaceNow = () => 0;
        if (firstError) reportFault(firstError);
    }

    return Object.freeze({
        initialize,
        dispose,
        attachDiagnostics(next = {}) {
            if (disposed) return;
            recordTtSurface = typeof next.record === 'function' ? next.record : (() => {});
            ttSurfaceNow = typeof next.now === 'function' ? next.now : (() => 0);
        },
        isManaged: () => { initialize(); return managed; },
        getStatus: () => { initialize(); return status; },
        subscribe,
        getMountedMessages() {
            initialize();
            return [...mounted.values()].map(record => (record.didCommitContent || record.didMount)?.context).filter(Boolean);
        },
        externalPlacementParent(message) { initialize(); return managed ? message : null; },
        applySurface(element, surface) {
            if (!SURFACES.has(surface)) throw new TypeError('Unsupported RabbitMirror host surface');
            if (!hostGlobal?.__TAURITAVERN__?.api?.layout || typeof element?.setAttribute !== 'function') return false;
            element.setAttribute('data-tt-mobile-surface', surface);
            return true;
        },
    });
}
