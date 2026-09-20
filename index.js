import { rabbitMirrorGenerateInterceptor, clearRabbitMirrorPrompt, destroyIndependentGenerationIntentBridge, initIndependentGenerationIntentBridge, prewarmRabbitMirrorGenerationRuntime } from './src/injector.js?rmv=1.5.53-image1';
import { clearLastCombo } from './src/storage.js?rmv=1.5.53-visualquick1';
import { clearAllFeedbackCatState, destroyFeedbackCatPromptSync, initFeedbackCatPromptSync } from './src/feedbackCat.js?rmv=1.5.53-cn-boundary1';
import { getSettings, updateSettings } from './src/settings.js?rmv=1.5.73';
import { initRabbitMirrorIndependentSecurityGuard, destroyRabbitMirrorIndependentSecurityGuard } from './src/independentSecurityGuard.js?rmv=1.5.53-cn-boundary1';
import { initRabbitMirrorHostCompatibility, isRabbitMirrorManagedChatSurface, getRabbitMirrorMountedMessages, subscribeRabbitMirrorChatSurface, getRabbitMirrorEarlyBootstrap, getRabbitMirrorHostCompatibilityStatus } from './src/hostCompatibility.js?rmv=1.5.73';

// TT requires ownership registration before its first projection, not after the
// deferred DOM runtime loads. This bridge has no network, timers or heavy imports.
initRabbitMirrorHostCompatibility();

// SecurityFix2 leaves only the prompt interceptor and request guard in the parser-critical
// graph. The 1.8 MiB UI/sanitizer/independent runtime graph is imported after the host has
// received a paint/idle opportunity, or immediately after explicit RabbitMirror intent.
const GOLDEN_MERGE_VERSION = '1.5.73';
const RABBIT_MIRROR_RUNTIME_VERSION = '1.5.73';
const earlyBootstrap = getRabbitMirrorEarlyBootstrap();
let runtimeCancelled = earlyBootstrap?.cancelled === true || (!!globalThis.__rabbitMirrorTtBootstrap && !earlyBootstrap);
let runtimeClaimed = !runtimeCancelled;
const runtimeIsActive = () => !runtimeCancelled && (earlyBootstrap
    ? globalThis.__rabbitMirrorTtBootstrap === earlyBootstrap && !earlyBootstrap.cancelled
    : !globalThis.__rabbitMirrorTtBootstrap);
let deferredRuntimePromise = null;
let deferredRuntimeModules = null;
let deferredBootTimer = 0;
let deferredIdleHandle = 0;
let deferredTtBootTimer = 0;
let deferredTtBootAttempts = 0;
let deferredLoadHandler = null;
let deferredChatWakeObserver = null;
let deferredChatSurfaceWakeCleanup = null;
let deferredHostSignature = '';
let deferredHostStableSince = 0;
let generationPrewarmStarted = false;
let generationPrewarmDone = false;
let externalDiagnosticsPromise = null;
let externalDiagnosticsModule = null;
let externalDiagnosticsApi = null;
let externalDiagnosticsOperationRevision = 0;
let externalDiagnosticsDesiredEnabled = false;
const optionalModules = new Map();
const optionalPromises = new Map();
let lazyPointerHandler = null;
let lazyFocusHandler = null;
let lazyClickHandler = null;

if (!runtimeCancelled) {
try { globalThis.__rabbitMirrorFeedbackCatSyncCleanup?.(); } catch {}
globalThis.__rabbitMirrorRuntimeVersion = RABBIT_MIRROR_RUNTIME_VERSION;
globalThis.rabbitMirrorGenerateInterceptor = earlyBootstrap?.interceptor || rabbitMirrorGenerateInterceptor;
globalThis.__rabbitMirrorGoldenMerge = {
    version: GOLDEN_MERGE_VERSION,
    deferredReady: () => !!deferredRuntimeModules,
    optionalLoaded: () => [...optionalModules.keys()],
};
// The lightweight generation interceptor calls this without awaiting it when
// independent mode is selected. That closes the cold-start event gap without
// making the host's main generation wait for the 1.8 MiB UI/runtime graph.
globalThis.__rabbitMirrorEnsureDeferredCoreRuntime = ensureDeferredCoreRuntime;
}

function captureDeferredBootBoundary() {
    try {
        const context = globalThis.SillyTavern?.getContext?.();
        const chat = Array.isArray(context?.chat) ? context.chat : [];
        globalThis.__rabbitMirrorDeferredBootBoundary = Object.freeze({
            chatLength: chat.length,
            maxExistingIndex: chat.length - 1,
            capturedAt: Date.now(),
        });
    } catch {}
}

async function ensureDeferredCoreRuntime(reason = 'scheduled-idle') {
    if (!runtimeIsActive()) return null;
    if (deferredRuntimeModules) return deferredRuntimeModules;
    if (deferredRuntimePromise) return deferredRuntimePromise;
    deferredRuntimePromise = Promise.all([
        import('./src/outputSanitizer.js?rmv=1.5.73'),
        import('./src/visualScanner.js?rmv=1.5.73'),
        import('./src/independentApi.js?rmv=1.5.73'),
        import('./src/touchTheater.js?rmv=1.5.56-extfloor1'),
        import('./src/ui.js?rmv=1.5.73'),
        import('./src/composerClearance.js?rmv=1.5.58-fork1'),
    ]).then(async ([output, visual, independent, touch, ui, clearance]) => {
        if (!runtimeIsActive()) return null;
        deferredRuntimeModules = { output, visual, independent, touch, ui, clearance };
        output.initOutputSanitizer?.();
        visual.initVisualScanner?.();
        await independent.initIndependentRabbitMirror?.({ isActive: runtimeIsActive });
        if (!runtimeIsActive()) {
            // Our ordinary disable already releases resources. If superseded,
            // never run selector/global-based cleanup against the new owner.
            if (!earlyBootstrap || globalThis.__rabbitMirrorTtBootstrap === earlyBootstrap) independent.destroyIndependentRabbitMirror?.();
            return null;
        }
        touch.initTouchTheaterBridge?.();
        ui.initRabbitMirrorUI?.();
        clearance.initRabbitMirrorComposerClearance?.();
        console.log(`[RabbitMirror] deferred core ready (${reason}) via ${GOLDEN_MERGE_VERSION}`);
        return deferredRuntimeModules;
    }).catch(error => {
        deferredRuntimePromise = null;
        console.error('[RabbitMirror] deferred core failed to load:', error);
        return null;
    });
    return deferredRuntimePromise;
}

function hostControlVisible(selector) {
    try {
        const node = document?.querySelector?.(selector);
        if (!node || node.hidden || node.classList?.contains('displayNone') || node.getAttribute?.('aria-hidden') === 'true') return false;
        const style = globalThis.getComputedStyle?.(node);
        if (style && (style.display === 'none' || style.visibility === 'hidden' || style.contentVisibility === 'hidden')) return false;
        const rects = node.getClientRects?.();
        return !rects || rects.length > 0;
    } catch { return false; }
}

function hostLooksBusy() {
    try {
        const context = globalThis.SillyTavern?.getContext?.();
        if ([context?.isGenerating, context?.is_generating, context?.is_send_press, globalThis.is_send_press, globalThis.is_group_generating].some(value => value === true)) return true;
        const streamingMessage = document?.querySelector?.('#chat .mes.streaming, #chat .mes[data-is-streaming="true"], #chat .mes[is_generating="true"], #chat .mes[data-generating="true"]');
        return !!streamingMessage || hostControlVisible('#mes_stop') || hostControlVisible('#stop_but');
    } catch { return true; }
}

function stableHostChatSignature() {
    try {
        const chatRoot = document?.querySelector?.('#chat');
        if (!chatRoot?.isConnected || document?.readyState !== 'complete') return '';
        const context = globalThis.SillyTavern?.getContext?.();
        const chat = Array.isArray(context?.chat) ? context.chat : [];
        if (chat.length) {
            if (isRabbitMirrorManagedChatSurface()) {
                // The tail may legitimately be virtualized away. Only use public
                // mounted leases; never materialize history just to start our runtime.
                const mounted = getRabbitMirrorMountedMessages().filter(item => item.element?.isConnected);
                if (!mounted.length) return '';
                return `${chat.length}:managed:${mounted.map(item => item.mesid).join(',')}`;
            }
            const tail = chat.length - 1;
            const renderedTail = chatRoot.querySelector?.(`.mes[mesid="${tail}"], [mesid="${tail}"].mes`);
            if (!renderedTail?.isConnected) return '';
            return `${chat.length}:${tail}:${renderedTail.getAttribute?.('mesid') || ''}:${String(chat[tail]?.mes || '').length}`;
        }
        // An empty context is indistinguishable from a chat that has not finished
        // loading. Fail closed; a genuinely new empty chat needs no background DOM runtime.
        return '';
    } catch { return ''; }
}

function shouldBypassEmptyChatGate() {
    try {
        const status = getRabbitMirrorHostCompatibilityStatus();
        return status.host === 'tauritavern' && status.managed === true && status.registered !== true;
    } catch { return false; }
}

function bootTtLateProjectionRuntime() {
    if (!runtimeIsActive() || deferredRuntimeModules || deferredRuntimePromise) return false;
    if (!shouldBypassEmptyChatGate()) return false;
    if (deferredTtBootTimer) {
        clearTimeout(deferredTtBootTimer);
        deferredTtBootTimer = 0;
    }
    void ensureDeferredCoreRuntime('tt-late-projection');
    return true;
}

function scheduleTtLateProjectionBackup() {
    if (deferredTtBootTimer || deferredRuntimeModules || deferredRuntimePromise) return;
    deferredTtBootTimer = setTimeout(() => {
        deferredTtBootTimer = 0;
        if (!runtimeIsActive() || deferredRuntimeModules || deferredRuntimePromise) return;
        if (bootTtLateProjectionRuntime()) return;
        if (++deferredTtBootAttempts > 24) return;
        scheduleTtLateProjectionBackup();
    }, deferredTtBootAttempts ? 250 : 50);
}

function requestDeferredIdleCheck(delay = 1400) {
    if (!runtimeIsActive() || deferredRuntimeModules || deferredRuntimePromise) return;
    if (bootTtLateProjectionRuntime()) return;
    deferredBootTimer = setTimeout(() => {
        deferredBootTimer = 0;
        if (bootTtLateProjectionRuntime()) return;
        if (typeof globalThis.requestIdleCallback === 'function') {
            // SillyTavern keeps no timeout so a long chat load cannot be forced
            // onto the 1.8 MiB graph. TT already deferred third-party until after
            // APP_READY; iOS WKWebView idle often never comes under virtualization.
            deferredIdleHandle = globalThis.__TAURITAVERN__
                ? globalThis.requestIdleCallback(runDeferredBoot, { timeout: 2000 })
                : globalThis.requestIdleCallback(runDeferredBoot);
        } else {
            runDeferredBoot();
        }
    }, Math.max(600, Number(delay) || 1400));
}

function beginGenerationRuntimePrewarm() {
    if (generationPrewarmStarted || generationPrewarmDone || !runtimeIsActive()) return false;
    generationPrewarmStarted = true;
    const settings = getSettings();
    const task = settings.enabled !== false && settings.autoRabbitMirrorInjection !== false && settings.generationSource !== 'independent'
        ? prewarmRabbitMirrorGenerationRuntime()
        : Promise.resolve(true);
    void task.catch(error => console.debug('[RabbitMirror] generation prewarm skipped:', error)).finally(() => {
        generationPrewarmDone = true;
        requestDeferredIdleCheck(1800);
    });
    return true;
}

function installDeferredChatWakeObserver() {
    if (isRabbitMirrorManagedChatSurface()) {
        if (!deferredChatSurfaceWakeCleanup) {
            deferredChatSurfaceWakeCleanup = subscribeRabbitMirrorChatSurface({
                id: 'bootstrap-wake',
                didMount() { if (!deferredBootTimer && !deferredIdleHandle) requestDeferredIdleCheck(1200); },
            });
        }
        return true;
    }
    if (deferredChatWakeObserver || typeof MutationObserver !== 'function') return false;
    const chatRoot = document?.querySelector?.('#chat');
    if (!chatRoot?.isConnected) return false;
    deferredChatWakeObserver = new MutationObserver(records => {
        if (!records?.some(record => Number(record?.addedNodes?.length || 0) > 0)) return;
        deferredChatWakeObserver?.disconnect?.();
        deferredChatWakeObserver = null;
        requestDeferredIdleCheck(1200);
    });
    deferredChatWakeObserver.observe(chatRoot, { childList: true, subtree: true });
    return true;
}

function runDeferredBoot() {
    deferredBootTimer = 0;
    deferredIdleHandle = 0;
    if (bootTtLateProjectionRuntime()) return;
    const signature = stableHostChatSignature();
    if (hostLooksBusy()) {
        deferredHostSignature = '';
        deferredHostStableSince = 0;
        requestDeferredIdleCheck(1600);
        return;
    }
    if (!signature) {
        // Empty chat and not-yet-loaded chat are intentionally indistinguishable for
        // the heavy DOM graph. A no-timeout idle slot may still prewarm only the much
        // smaller generation graph so the first send does not pay its parse cost.
        installDeferredChatWakeObserver();
        if (bootTtLateProjectionRuntime()) return;
        if (!generationPrewarmDone && beginGenerationRuntimePrewarm()) return;
        if (!generationPrewarmDone && generationPrewarmStarted) return;
        return;
    }
    deferredChatWakeObserver?.disconnect?.();
    deferredChatWakeObserver = null;
    deferredChatSurfaceWakeCleanup?.();
    deferredChatSurfaceWakeCleanup = null;
    const current = Date.now();
    if (signature !== deferredHostSignature) {
        deferredHostSignature = signature;
        deferredHostStableSince = current;
        requestDeferredIdleCheck(1600);
        return;
    }
    if (!deferredHostStableSince || current - deferredHostStableSince < 3000) {
        requestDeferredIdleCheck(1400);
        return;
    }
    if (!generationPrewarmDone) {
        beginGenerationRuntimePrewarm();
        return;
    }
    void ensureDeferredCoreRuntime('post-paint-idle');
}

function scheduleDeferredCoreRuntime() {
    if (bootTtLateProjectionRuntime()) return;
    const schedule = () => {
        if (!runtimeIsActive() || deferredRuntimeModules || deferredRuntimePromise) return;
        if (bootTtLateProjectionRuntime()) return;
        // SillyTavern still waits for a stable idle chat. TT late-projection
        // already returned above; remaining TT paths use a 2s idle timeout.
        requestDeferredIdleCheck(3500);
        scheduleTtLateProjectionBackup();
    };
    if (document?.readyState === 'complete') schedule();
    else {
        deferredLoadHandler = () => { deferredLoadHandler = null; schedule(); };
        window.addEventListener('load', deferredLoadHandler, { once: true });
        // WKWebView injected scripts can miss window load. Keep a bounded backup.
        scheduleTtLateProjectionBackup();
    }
}

function loadOptional(name, specifier, init) {
    if (!runtimeIsActive()) return Promise.resolve(null);
    if (optionalModules.has(name)) return Promise.resolve(optionalModules.get(name));
    if (optionalPromises.has(name)) return optionalPromises.get(name);
    const promise = import(specifier).then(mod => {
        optionalPromises.delete(name);
        if (!runtimeIsActive()) return null;
        optionalModules.set(name, mod);
        try { init?.(mod); } catch (error) { console.warn(`[RabbitMirror] ${name} init failed:`, error); }
        return mod;
    }).catch(error => {
        optionalPromises.delete(name);
        console.warn(`[RabbitMirror] optional ${name} failed to load:`, error);
        return null;
    });
    optionalPromises.set(name, promise);
    return promise;
}

function loadProfileSelector() {
    return ensureDeferredCoreRuntime('settings-intent').then(modules => loadOptional('profileSelector', './src/independentProfileSelectorHotfix.js?rmv=1.5.53-cn-boundary1', mod => {
        mod.initRabbitMirrorIndependentProfileSelectorHotfix?.({
            getSettings,
            updateSettings,
            getIndependentConnectionProfiles: modules?.independent?.getIndependentConnectionProfiles,
            refreshRabbitMirrorGenerationMode: modules?.independent?.refreshRabbitMirrorGenerationMode,
        });
    }));
}

function loadMirrorVisualCompat() {
    // A normal details/label/radio click must never bootstrap the whole heavy graph.
    // Compatibility helpers may join only after the runtime was already loaded at a
    // stable idle boundary or by an explicit RabbitMirror settings/maintenance action.
    if (!deferredRuntimeModules) return Promise.resolve(null);
    return Promise.all([
        loadOptional('checkedSelectorRepair', './src/checkedSelectorRepair.js?rmv=1.5.53-cn-boundary1', mod => mod.initRabbitMirrorCheckedSelectorRepair?.()),
        loadOptional('renderedVisualFeedback', './src/renderedVisualFeedbackHotfix.js?rmv=1.5.73', mod => mod.initRabbitMirrorRenderedVisualFeedbackHotfix?.()),
    ]);
}

function loadMaintenanceCompat() {
    return ensureDeferredCoreRuntime('maintenance-intent').then(() => loadOptional('maintenanceRecommendation', './src/maintenanceRecommendationHotfix.js?rmv=1.5.53-cn-boundary1', mod => mod.initRabbitMirrorMaintenanceRecommendationHotfix?.()));
}

function mobileLike() {
    try { return globalThis.matchMedia?.('(max-width: 900px), (pointer: coarse)')?.matches === true; }
    catch { return false; }
}

function loadMobileModalCompat() {
    if (!mobileLike()) return Promise.resolve(null);
    return ensureDeferredCoreRuntime('mobile-settings-intent').then(() => loadOptional('mobileModal', './src/mobileModalHotfix.js?rmv=1.5.53-cn-boundary1', mod => mod.initRabbitMirrorMobileModalHotfix?.()));
}

function isRabbitMirrorSurface(target) {
    return !!target?.closest?.('[data-rabbit-mirror-external-source="true"], toto[data-rabbit-mirror], toto, .rabbit-mirror-maintenance-toolbar');
}

function isRabbitMirrorSettingsSurface(target) {
    return !!target?.closest?.('#rabbit_mirror_theater_settings, #rh_independent_api_fields, #rh_generation_independent, [data-extension-name="兔子镜"]');
}

function installSettingsWandEntry() {
    if (!runtimeIsActive() || document.getElementById('rabbit_mirror_wand_entry')) return;
    const menu = document.getElementById('extensionsMenu');
    if (!menu || document.getElementById('rabbit_mirror_wand_bootstrap')) return;
    const entry = document.createElement('button');
    entry.id = 'rabbit_mirror_wand_bootstrap';
    entry.type = 'button';
    entry.className = 'list-group-item flex-container flexGap5';
    entry.style.cssText = 'background:transparent;background-color:transparent;color:inherit;border:0;box-shadow:none;appearance:none;-webkit-appearance:none;';
    entry.innerHTML = '<span class="rabbit-mirror-wand-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M10 16C4 2 11 1 14 14M18 14C20 1 27 2 23 16M9 16c-7 11 3 15 9 14s13-8 5-14c-4-3-10-3-14 0Z"/><path d="M12 22h1m6 0h1m-6 4 2 1 2-1"/></svg></span><span>兔子镜</span>';
    entry.setAttribute('aria-haspopup', 'dialog');
    entry.addEventListener('click', async () => {
        if (entry.disabled || !runtimeIsActive()) return;
        entry.disabled = true;
        const label = entry.querySelector('span:last-child');
        if (label) label.textContent = '正在打开兔子镜…';
        try {
            await ensureDeferredCoreRuntime('wand-settings-intent');
            if (!runtimeIsActive()) return;
            const workbench = document.getElementById('rabbit_mirror_theater_settings')?.__rabbitMirrorWorkbench;
            if (!workbench) throw new Error('RabbitMirror settings did not mount');
            workbench.open();
        } catch (error) {
            if (entry.isConnected && runtimeIsActive() && label) label.textContent = '打开失败，点击重试兔子镜';
            console.debug('[RabbitMirror] settings entry could not open:', error);
        } finally { if (entry.isConnected) entry.disabled = false; }
    });
    menu.append(entry);
}

function installOnDemandCompatTriggers() {
    if (typeof document === 'undefined') return;
    lazyPointerHandler = event => {
        const target = event?.target;
        if (!target?.closest || event?.isTrusted === false) return;
        if (isRabbitMirrorSettingsSurface(target)) {
            void ensureDeferredCoreRuntime('settings-intent');
            void loadProfileSelector();
            void loadMobileModalCompat();
        }
        if (target.closest?.('[data-rabbit-mirror-maintenance-rabbit="true"]')) void loadMaintenanceCompat();
    };
    lazyFocusHandler = event => {
        const target = event?.target;
        if (!target?.closest || event?.isTrusted === false) return;
        if (isRabbitMirrorSettingsSurface(target)) {
            void ensureDeferredCoreRuntime('settings-focus');
            void loadProfileSelector();
            void loadMobileModalCompat();
        }
        if (target.closest?.('[data-rabbit-mirror-maintenance-rabbit="true"]')) void loadMaintenanceCompat();
    };
    lazyClickHandler = event => {
        const target = event?.target;
        if (target?.closest?.('#extensionsMenuButton')) installSettingsWandEntry();
        if (!target?.closest || event?.isTrusted === false || !isRabbitMirrorSurface(target)) return;
        // Native details/label/radio interaction completes first. If the heavy runtime
        // is not already ready, this click stays entirely native and performs no import.
        setTimeout(() => { if (deferredRuntimeModules) void loadMirrorVisualCompat(); }, 700);
    };
    document.addEventListener('pointerover', lazyPointerHandler, true);
    document.addEventListener('pointerdown', lazyPointerHandler, true);
    document.addEventListener('focusin', lazyFocusHandler, true);
    document.addEventListener('click', lazyClickHandler, false);
}

function removeOnDemandCompatTriggers() {
    if (typeof document === 'undefined') return;
    if (lazyPointerHandler) {
        document.removeEventListener('pointerover', lazyPointerHandler, true);
        document.removeEventListener('pointerdown', lazyPointerHandler, true);
    }
    if (lazyFocusHandler) document.removeEventListener('focusin', lazyFocusHandler, true);
    if (lazyClickHandler) document.removeEventListener('click', lazyClickHandler, false);
    lazyPointerHandler = null;
    lazyFocusHandler = null;
    lazyClickHandler = null;
}

async function ensureExternalDiagnostics() {
    if (!runtimeIsActive()) return null;
    externalDiagnosticsDesiredEnabled = true;
    if (externalDiagnosticsApi) return externalDiagnosticsApi;
    if (externalDiagnosticsPromise) return externalDiagnosticsPromise;
    const revision = ++externalDiagnosticsOperationRevision;
    const loadPromise = import('./src/externalDiagnostics.js?rmv=1.5.53-ttperfdiag1').then(mod => {
        if (!runtimeIsActive() || !externalDiagnosticsDesiredEnabled || revision !== externalDiagnosticsOperationRevision) return null;
        externalDiagnosticsModule = mod;
        externalDiagnosticsApi = mod.initRabbitMirrorExternalDiagnostics?.() || null;
        externalDiagnosticsApi?.mark?.('externalDiag.userEnabled', { readyState: String(document?.readyState || '') });
        return externalDiagnosticsApi;
    }).finally(() => {
        if (externalDiagnosticsPromise === loadPromise) externalDiagnosticsPromise = null;
    });
    externalDiagnosticsPromise = loadPromise;
    return loadPromise;
}

function disableExternalDiagnostics() {
    externalDiagnosticsDesiredEnabled = false;
    externalDiagnosticsOperationRevision += 1;
    externalDiagnosticsPromise = null;
    try { externalDiagnosticsModule?.destroyRabbitMirrorExternalDiagnostics?.(); } catch {}
    externalDiagnosticsApi = null;
}

function clearDeferredGenerationSnapshots() {
    void import('./src/generationGuard.js?rmv=1.5.53-image1')
        .then(mod => {
            // Disable may await this import while a newer installation takes
            // ownership. Do not clear that owner's shared snapshot/attempt keys.
            if (earlyBootstrap ? globalThis.__rabbitMirrorTtBootstrap !== earlyBootstrap : !!globalThis.__rabbitMirrorTtBootstrap) return;
            mod.clearRabbitMirrorGenerationSnapshots?.();
        })
        .catch(() => {});
}

if (!runtimeCancelled) {
    globalThis.__rabbitMirrorEnsureExternalDiag = ensureExternalDiagnostics;
    globalThis.__rabbitMirrorDisableExternalDiag = disableExternalDiagnostics;
}

function destroyOptionalCompat() {
    for (const [name, mod] of optionalModules) {
        try {
            if (name === 'profileSelector') mod.destroyRabbitMirrorIndependentProfileSelectorHotfix?.();
            else if (name === 'maintenanceRecommendation') mod.destroyRabbitMirrorMaintenanceRecommendationHotfix?.();
            else if (name === 'checkedSelectorRepair') mod.destroyRabbitMirrorCheckedSelectorRepair?.();
            else if (name === 'renderedVisualFeedback') mod.destroyRabbitMirrorRenderedVisualFeedbackHotfix?.();
            else if (name === 'mobileModal') mod.destroyRabbitMirrorMobileModalHotfix?.();
        } catch {}
    }
    optionalModules.clear();
    optionalPromises.clear();
}

jQuery(() => {
    if (!runtimeIsActive()) return;
    captureDeferredBootBoundary();
    initFeedbackCatPromptSync(() => getSettings().feedbackCatEnabled !== false);
    globalThis.__rabbitMirrorFeedbackCatSyncCleanup = destroyFeedbackCatPromptSync;
    initIndependentGenerationIntentBridge();
    initRabbitMirrorIndependentSecurityGuard({ getSettings, updateSettings });
    installOnDemandCompatTriggers();
    installSettingsWandEntry();
    if (!bootTtLateProjectionRuntime()) scheduleDeferredCoreRuntime();
    console.log(`[RabbitMirror] lightweight bootstrap ${RABBIT_MIRROR_RUNTIME_VERSION} ready; heavy runtime deferred`);
});

export function onDisable() {
    runtimeCancelled = true;
    if (earlyBootstrap && globalThis.__rabbitMirrorTtBootstrap !== earlyBootstrap) return;
    if (!runtimeClaimed) return;
    runtimeClaimed = false;
    if (deferredBootTimer) clearTimeout(deferredBootTimer);
    deferredBootTimer = 0;
    if (deferredTtBootTimer) clearTimeout(deferredTtBootTimer);
    deferredTtBootTimer = 0;
    deferredTtBootAttempts = 0;
    if (deferredIdleHandle && typeof globalThis.cancelIdleCallback === 'function') globalThis.cancelIdleCallback(deferredIdleHandle);
    deferredIdleHandle = 0;
    if (deferredLoadHandler) window.removeEventListener('load', deferredLoadHandler);
    deferredLoadHandler = null;
    deferredChatWakeObserver?.disconnect?.();
    deferredChatWakeObserver = null;
    deferredChatSurfaceWakeCleanup?.();
    deferredChatSurfaceWakeCleanup = null;
    deferredHostSignature = '';
    deferredHostStableSince = 0;
    generationPrewarmStarted = false;
    generationPrewarmDone = false;
    document.getElementById('rabbit_mirror_wand_bootstrap')?.remove();
    removeOnDemandCompatTriggers();
    destroyOptionalCompat();
    destroyFeedbackCatPromptSync();
    destroyIndependentGenerationIntentBridge({ clearIntents: true });
    clearRabbitMirrorPrompt();
    deferredRuntimeModules?.ui?.destroyRabbitMirrorUI?.();
    deferredRuntimeModules?.clearance?.destroyRabbitMirrorComposerClearance?.();
    deferredRuntimeModules?.output?.destroyOutputSanitizer?.();
    deferredRuntimeModules?.visual?.destroyVisualScanner?.();
    deferredRuntimeModules?.independent?.destroyIndependentRabbitMirror?.();
    deferredRuntimeModules?.touch?.destroyTouchTheaterBridge?.();
    destroyRabbitMirrorIndependentSecurityGuard();
    if (globalThis.rabbitMirrorGenerateInterceptor === rabbitMirrorGenerateInterceptor ||
        globalThis.rabbitMirrorGenerateInterceptor === earlyBootstrap?.interceptor) delete globalThis.rabbitMirrorGenerateInterceptor;
    clearDeferredGenerationSnapshots();
    disableExternalDiagnostics();
    if (globalThis.__rabbitMirrorEnsureDeferredCoreRuntime === ensureDeferredCoreRuntime) {
        try { delete globalThis.__rabbitMirrorEnsureDeferredCoreRuntime; } catch {}
    }
    try { delete globalThis.__rabbitMirrorEnsureExternalDiag; } catch {}
    try { delete globalThis.__rabbitMirrorDisableExternalDiag; } catch {}
}

export { rabbitMirrorGenerateInterceptor };

export function onClean() {
    if (earlyBootstrap && globalThis.__rabbitMirrorTtBootstrap !== earlyBootstrap) return;
    onDisable();
    clearRabbitMirrorPrompt();
    clearLastCombo();
    clearAllFeedbackCatState();
    clearDeferredGenerationSnapshots();
}
