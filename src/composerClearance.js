import { recordTtSurface, ttSurfaceNow } from './ttSurfaceDiagnostics.js?rmv=1.5.51-narrow1';
// Reserve scrollable space, not a decorative frame. No chat text, polling or model calls.
import { isRabbitMirrorManagedChatSurface, getRabbitMirrorMountedMessages, subscribeRabbitMirrorChatSurface } from './hostCompatibility.js?rmv=1.5.53-iosidle1';
let active = null;
export function composerOverlap(chat, composer, viewportBottom) {
    if (!chat || !composer || composer.width <= 0 || composer.height <= 0
        || composer.right <= chat.left || composer.left >= chat.right) return 0;
    const bottom = Math.min(chat.bottom, viewportBottom);
    if (composer.top >= bottom || composer.bottom <= chat.top) return 0;
    return Math.ceil(Math.max(0, bottom - Math.max(chat.top, composer.top)) + 12);
}
export function scheduleRabbitMirrorComposerClearance() { active?.schedule('external'); }
function externalFooterClearance(message) {
    const rect = message.getBoundingClientRect();
    let protrusion = 0;
    // Measure only the adjacent owner's footer geometry, never theme artwork/text.
    for (const pseudo of ['::before', '::after']) {
        const style = getComputedStyle(message, pseudo);
        if (!style.content || style.content === 'none' || style.content === 'normal'
            || style.display === 'none' || style.visibility === 'hidden' || style.position !== 'absolute') continue;
        if (/^-?[\d.]+px$/.test(style.bottom)) protrusion = Math.max(protrusion, -parseFloat(style.bottom));
    }
    for (const node of message.querySelectorAll('.swipe_left, .swipeRightBlock, .swipes-counter')) {
        const style = getComputedStyle(node), box = node.getBoundingClientRect();
        if (style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0)
            protrusion = Math.max(protrusion, box.bottom - rect.bottom);
    }
    return protrusion > 0 ? Math.ceil(protrusion + 6) : 0;
}
export function destroyRabbitMirrorComposerClearance() { active?.destroy(); active = null; }
export function initRabbitMirrorComposerClearance() {
    destroyRabbitMirrorComposerClearance();
    const chat = document.getElementById('chat');
    if (!chat) return;
    const managed = isRabbitMirrorManagedChatSurface();
    let frame = 0, stopped = false, spacer = null, lastHeight = 0;
    let observedForm = null, footerOwner = null, footerHeight = 0;
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => schedule(entries?.[0]?.target === chat ? 'resize-chat' : 'resize-form')) : null;
    const viewport = window.visualViewport;
    function measure() {
        frame = 0;
        const ttStart = ttSurfaceNow();
        if (stopped || !chat.isConnected) return;
        const mounted = managed ? getRabbitMirrorMountedMessages().filter(context => !context.signal.aborted && context.element.isConnected) : [];
        const lastMountedOwner = managed ? mounted.find(context => context.element.matches('.last_mes'))?.element : null;
        const owner = managed ? null : chat.querySelector(':scope > .mes.last_mes:has(+ .rabbit-mirror-external-host[data-rm-source="independent"][data-rm-placement="external"]:not([hidden]))');
        if (footerOwner !== owner) {
            footerOwner?.style.removeProperty('--rm-external-footer-clearance');
            footerOwner = owner; footerHeight = 0;
        }
        if (owner) {
            const next = externalFooterClearance(owner);
            if (next !== footerHeight) {
                owner.style.setProperty('--rm-external-footer-clearance', `${next}px`);
                recordTtSurface('layout-write', { what: 'footer-var', changed: true, prev: footerHeight, next });
                footerHeight = next;
            }
        }
        const form = document.getElementById('send_form') || document.getElementById('form_sheld');
        if (observedForm !== form) {
            if (observedForm) resize?.unobserve(observedForm);
            observedForm = form;
            if (form) resize?.observe(form);
        }
        // First matching shell only; never enumerate historical messages or their content.
        const hasMirror = managed
            ? !!lastMountedOwner?.querySelector('toto, [data-rabbit-mirror-external-source="true"]')
            : !!chat.querySelector('toto, [data-rabbit-mirror-external-source="true"]');
        const formStyle = form && getComputedStyle(form);
        const shown = form && formStyle.display !== 'none' && formStyle.visibility !== 'hidden';
        const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
        const height = hasMirror && shown ? composerOverlap(chat.getBoundingClientRect(), form.getBoundingClientRect(), bottom) : 0;
        if (!height) {
            if (spacer) {
                recordTtSurface('layout-write', { what: 'spacer-remove', changed: lastHeight !== 0, prev: lastHeight });
                spacer.remove(); spacer = null;
            }
            recordTtSurface('clearance-measure', { ms: ttStart ? performance.now() - ttStart : 0, managed, height: 0, changed: lastHeight !== 0 });
            lastHeight = 0;
            return;
        }
        const nearEnd = chat.scrollHeight - chat.clientHeight - chat.scrollTop < 4;
        const oldHeight = lastHeight;
        if (!spacer) {
            spacer = document.createElement('div');
            spacer.className = 'rabbit-mirror-composer-clearance';
            spacer.setAttribute('aria-hidden', 'true');
        }
        if (height !== lastHeight) {
            spacer.style.setProperty('--rm-composer-clearance', `${height}px`);
            // changed 直接来自已算好的 height/lastHeight 比较，未额外读取任何几何。
            recordTtSurface('layout-write', { what: 'clearance-var', changed: true, prev: lastHeight, next: height });
            lastHeight = height;
        }
        // TT owns all direct #chat children. Reserve space inside its live last
        // message only; do not append siblings or alter its virtual spacers.
        const spacerParent = managed ? lastMountedOwner : chat;
        if (spacerParent?.lastElementChild !== spacer) {
            recordTtSurface('layout-write', { what: 'spacer-append', changed: true, managed, height });
            spacerParent?.append(spacer);
        }
        recordTtSurface('clearance-measure', { ms: ttStart ? performance.now() - ttStart : 0, managed, height, changed: height !== oldHeight });
        // Keep an already bottom-anchored reader at the bottom; never jump a history reader.
        // Managed hosts own their own scroll anchoring and observe message size.
        if (!managed && nearEnd && height > oldHeight) chat.scrollTop = chat.scrollHeight;
    }
    function schedule(source) {
        recordTtSurface('clearance-schedule', { source: typeof source === 'string' ? source : 'unknown' });
        if (!stopped && !frame) frame = requestAnimationFrame(measure);
    }
    const structure = !managed && typeof MutationObserver === 'function' ? new MutationObserver(records => {
        if (records.some(r => [...r.addedNodes, ...r.removedNodes].some(n => n !== spacer))) schedule('structure');
    }) : null;
    const onManagedMount = context => {
        schedule('managed-mount');
        return () => {
            if (spacer && context.element.contains(spacer)) {
                spacer.remove(); spacer = null; lastHeight = 0;
            }
            schedule('managed-unmount');
        };
    };
    const unsubscribeManaged = managed ? subscribeRabbitMirrorChatSurface({
        id: 'rabbitmirror/composer-clearance', didMount: onManagedMount,
        // Content revisions do not own the owner-level spacer. Removing it on
        // each content abort would fight host anchoring during streamed updates.
        didCommitContent: () => { schedule('managed-commit'); },
    }) : null;
    // 具名包装：事件 handler 直接传 schedule 会把 Event 当作 source，且
    // removeEventListener 必须引用同一函数对象。包装只为标注来源，不改变时序。
    const onWindowResize = () => schedule('window-resize');
    const onViewportResize = () => schedule('viewport-resize');
    const onViewportScroll = () => schedule('viewport-scroll');
    const onFocusIn = () => schedule('focusin');
    const onFocusOut = () => schedule('focusout');
    structure?.observe(chat, { childList: true });
    resize?.observe(chat);
    window.addEventListener('resize', onWindowResize, { passive: true });
    viewport?.addEventListener('resize', onViewportResize, { passive: true });
    viewport?.addEventListener('scroll', onViewportScroll, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    active = { schedule, destroy() {
        stopped = true;
        unsubscribeManaged?.();
        if (frame) cancelAnimationFrame(frame);
        structure?.disconnect(); resize?.disconnect(); spacer?.remove();
        footerOwner?.style.removeProperty('--rm-external-footer-clearance');
        window.removeEventListener('resize', onWindowResize);
        viewport?.removeEventListener('resize', onViewportResize);
        viewport?.removeEventListener('scroll', onViewportScroll);
        document.removeEventListener('focusin', onFocusIn);
        document.removeEventListener('focusout', onFocusOut);
    } };
    schedule('init');
}
