const RELEASE_VERSION = '1.5.51';
const STYLE_ID = 'rabbit_mirror_top_layer_modal_hotfix';
const TARGET_IDS = ['rh_advanced_modal', 'rh_world_info_prompt_modal', 'rh_independent_tag_filter_modal'];

let rootObserver = null;
const modalObservers = new Map();

function installModalStyle() {
    let style = document.getElementById(STYLE_ID);
    if (style) return style;
    style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      dialog.rabbit-mirror-top-layer-modal {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        width: 100dvw !important;
        min-width: 100vw !important;
        min-width: 100dvw !important;
        max-width: none !important;
        height: 100vh !important;
        height: 100dvh !important;
        min-height: 100vh !important;
        min-height: 100dvh !important;
        max-height: none !important;
        margin: 0 !important;
        border: 0 !important;
        padding-top: max(24px, calc(env(safe-area-inset-top) + 14px)) !important;
        padding-right: max(12px, calc(env(safe-area-inset-right) + 8px)) !important;
        padding-bottom: max(24px, calc(env(safe-area-inset-bottom) + 14px)) !important;
        padding-left: max(12px, calc(env(safe-area-inset-left) + 8px)) !important;
        box-sizing: border-box !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        background: rgba(8, 10, 14, .62) !important;
        color: var(--SmartThemeBodyColor, #ddd) !important;
        pointer-events: auto !important;
        transform: none !important;
        contain: none !important;
        touch-action: none !important;
      }
      dialog.rabbit-mirror-top-layer-modal::backdrop {
        background: transparent !important;
      }
      dialog.rabbit-mirror-top-layer-modal[open] {
        display: flex !important;
      }
      dialog.rabbit-mirror-top-layer-modal:not([open]) {
        display: none !important;
      }
      dialog.rabbit-mirror-top-layer-modal .menu_button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: 100% !important;
        height: auto !important;
        aspect-ratio: auto !important;
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
        white-space: nowrap !important;
        word-break: keep-all !important;
        overflow-wrap: normal !important;
        line-height: 1.35 !important;
      }
      #rh_advanced_modal_card,
      #rh_world_info_prompt_modal > div,
      #rh_independent_tag_filter_modal > div {
        background: var(--SmartThemeBlurTintColor, #202226) !important;
        color: var(--SmartThemeBodyColor, #ddd) !important;
      }
      #rh_advanced_modal_card {
        width: min(760px, calc(100dvw - 24px)) !important;
        max-width: 100% !important;
        max-height: calc(100dvh - 76px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
        min-width: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }
      #rh_advanced_modal .rh-advanced-choice {
        display: block !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        min-height: 66px !important;
        height: auto !important;
        aspect-ratio: auto !important;
        padding: 11px 12px !important;
        text-align: left !important;
        writing-mode: horizontal-tb !important;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: anywhere !important;
      }
      #rh_advanced_modal .rh-advanced-choice > span {
        display: block !important;
        width: auto !important;
        min-width: 0 !important;
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: anywhere !important;
      }
      #rh_advanced_scroll {
        min-width: 0 !important;
        min-height: 0 !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-y !important;
      }
      #rh_advanced_menu {
        width: 100% !important;
        min-width: 0 !important;
        grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr)) !important;
      }
      @media (max-width: 520px) {
        #rh_advanced_menu {
          grid-template-columns: 1fr !important;
        }
        #rh_advanced_modal_header {
          grid-template-columns: auto minmax(0, 1fr) 38px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return style;
}

function closeThroughExistingControl(dialog) {
    const closeId = dialog.id === 'rh_advanced_modal'
        ? 'rh_advanced_close'
        : (dialog.id === 'rh_independent_tag_filter_modal' ? 'rh_independent_tag_filter_close' : 'rh_world_info_prompt_close');
    const closeButton = dialog.querySelector(`#${closeId}`);
    if (closeButton) {
        closeButton.click();
        return;
    }
    if (dialog.getAttribute('aria-hidden') !== 'true') dialog.setAttribute('aria-hidden', 'true');
    if (dialog.style.display !== 'none') dialog.style.display = 'none';
    try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch {}
}

function syncDialogTopLayer(dialog) {
    if (!(dialog instanceof HTMLElement)) return;
    const wantsOpen = dialog.getAttribute('aria-hidden') === 'false'
        || dialog.style.display === 'flex'
        || dialog.style.display === 'grid'
        || dialog.style.display === 'block';

    if (wantsOpen) {
        if (dialog.getAttribute('aria-hidden') !== 'false') dialog.setAttribute('aria-hidden', 'false');
        if (dialog.style.display !== 'flex') dialog.style.display = 'flex';
        if (!dialog.hasAttribute('open')) {
            try {
                if (typeof dialog.showModal === 'function') dialog.showModal();
                else dialog.setAttribute('open', '');
            } catch {
                dialog.setAttribute('open', '');
            }
        }
        return;
    }

    if (dialog.getAttribute('aria-hidden') !== 'true') dialog.setAttribute('aria-hidden', 'true');
    if (dialog.hasAttribute('open')) {
        try {
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.removeAttribute('open');
        } catch {
            dialog.removeAttribute('open');
        }
    }
    if (dialog.style.display !== 'none') dialog.style.display = 'none';
}

function bindPromotedDialog(dialog) {
    const existing = modalObservers.get(dialog.id);
    if (existing?.node === dialog && dialog.dataset.rabbitMirrorTopLayerBound === 'true') {
        syncDialogTopLayer(dialog);
        return;
    }
    if (existing?.observer) {
        try { existing.observer.disconnect(); } catch {}
    }
    dialog.dataset.rabbitMirrorTopLayerBound = 'true';

    dialog.addEventListener('cancel', event => {
        event.preventDefault();
        closeThroughExistingControl(dialog);
    });
    dialog.addEventListener('click', event => {
        if (event.target === dialog) closeThroughExistingControl(dialog);
    });

    const observer = new MutationObserver(() => syncDialogTopLayer(dialog));
    observer.observe(dialog, { attributes: true, attributeFilter: ['aria-hidden', 'style'] });
    modalObservers.set(dialog.id, { node: dialog, observer });
    syncDialogTopLayer(dialog);
}

function promoteModal(id) {
    let modal = document.getElementById(id);
    if (!modal) return null;

    if (modal.tagName !== 'DIALOG') {
        const dialog = document.createElement('dialog');
        for (const attr of Array.from(modal.attributes)) {
            dialog.setAttribute(attr.name, attr.value);
        }
        while (modal.firstChild) dialog.appendChild(modal.firstChild);
        modal.replaceWith(dialog);
        modal = dialog;
    }

    modal.classList.add('rabbit-mirror-top-layer-modal');
    bindPromotedDialog(modal);
    return modal;
}

function promoteAll() {
    installModalStyle();
    for (const id of TARGET_IDS) promoteModal(id);
    const watermark = document.querySelector('#rabbit_mirror_theater_settings .rabbit-mirror-toto-watermark');
    if (watermark && watermark.textContent !== `TOTOv${RELEASE_VERSION}`) watermark.textContent = `TOTOv${RELEASE_VERSION}`;
}

export function initRabbitMirrorMobileModalHotfix() {
    destroyRabbitMirrorMobileModalHotfix();
    installModalStyle();
    promoteAll();
    if (typeof MutationObserver === 'function') {
        rootObserver = new MutationObserver(() => promoteAll());
        // ui.js moves both modals to direct <body> children. Watching only direct children
        // avoids a full-page observer firing on every chat/message DOM mutation.
        rootObserver.observe(document.body, { childList: true, subtree: false });
    }
    console.log(`[RabbitMirror] mobile modal hotfix ${RELEASE_VERSION} active`);
}

export function destroyRabbitMirrorMobileModalHotfix() {
    try { rootObserver?.disconnect?.(); } catch {}
    rootObserver = null;
    for (const entry of modalObservers.values()) {
        try { entry?.observer?.disconnect?.(); } catch {}
    }
    modalObservers.clear();
    document.getElementById(STYLE_ID)?.remove?.();
}
