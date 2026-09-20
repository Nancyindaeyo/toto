// Tool controls stay attached to their owning face; only their menu is portalled.
const bindings = new WeakMap();
const fits = new WeakMap();
let activeMenu = null;
const logo = '<svg viewBox="0 0 32 32" width="27" height="27" style="display:block!important;width:27px!important;height:27px!important;flex:none!important;fill:none!important;stroke:currentColor!important;pointer-events:none!important" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M10 16C4 2 11 1 14 14M18 14C20 1 27 2 23 16M9 16c-7 11 3 15 9 14s13-8 5-14c-4-3-10-3-14 0Z"/><path d="M12 22h1m6 0h1m-6 4 2 1 2-1"/></svg>';

export function fitMirrorToolPanel(panel, button, preferredWidth = 340) {
    fits.get(panel)?.();
    const anchor = button?.closest?.('[data-rabbit-mirror-tool-entry-host]')?.querySelector('[data-rm-tool-menu-button]') || button;
    const position = () => {
        if (!panel.isConnected) return;
        const view = globalThis.visualViewport;
        const width = view?.width || innerWidth;
        const height = view?.height || innerHeight;
        const left = view?.offsetLeft || 0, top = view?.offsetTop || 0;
        const margin = Math.min(12, width / 8, height / 8);
        const availableHeight = Math.max(1, height - margin * 2);
        const panelWidth = Math.min(preferredWidth, Math.max(1, width - margin * 2));
        const rect = anchor?.getBoundingClientRect?.() || { left, bottom: top };
        const sendForm = document.getElementById('send_form') || document.getElementById('form_sheld') || document.querySelector('#send_textarea')?.closest('form, #send_form, .mes_edit_buttons');
        const sendTop = sendForm?.getBoundingClientRect?.().top;
        const composerTop = Number.isFinite(sendTop) ? sendTop : top + height;
        const maxBottom = Math.min(top + height - margin, composerTop - 8);
        const styles = { position: 'fixed', 'z-index': '10050', 'box-sizing': 'border-box', width: `${panelWidth}px`, 'max-width': `${panelWidth}px`, 'max-height': `${Math.max(1, maxBottom - (top + margin))}px`, 'min-height': '0', overflow: 'auto', 'overscroll-behavior': 'contain', 'touch-action': 'pan-y', left: `${Math.max(left + margin, Math.min(rect.left, left + width - panelWidth - margin))}px` };
        for (const [name, value] of Object.entries(styles)) panel.style.setProperty(name, value, 'important');
        const panelHeight = Math.min(panel.offsetHeight || availableHeight, Math.max(1, maxBottom - (top + margin)));
        panel.style.setProperty('top', `${Math.max(top + margin, Math.min(rect.bottom + 6, maxBottom - panelHeight))}px`, 'important');
    };
    const view = globalThis.visualViewport;
    const cleanup = () => {
        globalThis.removeEventListener('resize', position);
        view?.removeEventListener('resize', position);
        view?.removeEventListener('scroll', position);
        observer.disconnect();
        fits.delete(panel);
    };
    const observer = new MutationObserver(() => { if (!panel.isConnected) cleanup(); });
    observer.observe(document.body, { childList: true });
    globalThis.addEventListener('resize', position);
    view?.addEventListener('resize', position);
    view?.addEventListener('scroll', position);
    fits.set(panel, cleanup);
    position();
}

function closeMenu() {
    if (!activeMenu) return;
    const { panel, button, outside, key } = activeMenu;
    fits.get(panel)?.();
    document.removeEventListener('pointerdown', outside, true);
    document.removeEventListener('keydown', key, true);
    panel.remove();
    button.setAttribute('aria-expanded', 'false');
    activeMenu = null;
}

export function installMirrorToolMenu(root, host, actions, beforeOpen) {
    let state = bindings.get(host);
    if (!state) {
        // Serialized controls have no trusted closures; rebind the current face.
        host.querySelectorAll('[data-rm-tool-menu-button]').forEach(node => node.remove());
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-rm-tool-menu-button', 'true');
        button.setAttribute('aria-label', '兔子镜工具');
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-expanded', 'false');
        button.title = '兔子镜工具';
        button.innerHTML = logo;
        button.style.cssText = 'all:initial!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:40px!important;height:40px!important;box-sizing:border-box!important;border:1px solid currentColor!important;border-radius:12px!important;background:transparent!important;color:inherit!important;cursor:pointer!important;flex:0 0 auto!important;pointer-events:auto!important;';
        host.append(button);
        state = { root, actions, button, beforeOpen };
        bindings.set(host, state);
        button.addEventListener('click', event => {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            if (!state.root.isConnected) return;
            if (activeMenu?.button === button) { closeMenu(); return; }
            closeMenu(); state.beforeOpen?.();
            const panel = document.createElement('section');
            panel.setAttribute('data-rm-tool-menu', 'true');
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-label', '兔子镜工具');
            panel.style.cssText = 'padding:14px;border:1px solid var(--SmartThemeBorderColor,#bbb);border-radius:15px;background:var(--SmartThemeBlurTintColor,#fff);color:var(--SmartThemeBodyColor,#34495d);box-shadow:0 8px 30px #0004;font:14px/1.5 sans-serif;';
            const title = document.createElement('strong'); title.textContent = '这面兔子镜的工具'; panel.append(title);
            const items = [...state.actions, { id: 'close', label: '关闭', run: () => button.focus() }];
            for (const action of items) {
                const item = document.createElement('button'); item.type = 'button';
                item.setAttribute('data-rm-tool-choice', action.id); item.textContent = action.label;
                item.style.cssText = 'display:block;width:100%;min-height:44px;margin-top:8px;padding:10px 12px;text-align:left;white-space:normal;border:1px solid var(--SmartThemeBorderColor,#bbb);border-radius:10px;background:transparent;color:inherit;font:inherit;cursor:pointer;';
                item.addEventListener('click', event => {
                    event.preventDefault(); event.stopPropagation();
                    if (!panel.isConnected || !state.root.isConnected) return;
                    closeMenu(); action.run(event, button);
                });
                panel.append(item);
            }
            document.body.append(panel);
            button.setAttribute('aria-expanded', 'true');
            const outside = event => { if (!panel.contains(event.target) && !button.contains(event.target)) closeMenu(); };
            const key = event => { if (event.key === 'Escape') { closeMenu(); button.focus(); } };
            activeMenu = { panel, button, outside, key };
            document.addEventListener('pointerdown', outside, true);
            document.addEventListener('keydown', key, true);
            fitMirrorToolPanel(panel, button);
            panel.querySelector('button')?.focus();
        });
    }
    state.root = root; state.actions = actions; state.beforeOpen = beforeOpen;
    let storage = host.querySelector(':scope > [data-rm-tool-storage]');
    if (!storage) { storage = document.createElement('span'); storage.setAttribute('data-rm-tool-storage', 'true'); host.append(storage); }
    storage.style.setProperty('display', 'none', 'important');
    storage.setAttribute('aria-hidden', 'true');
    for (const button of host.querySelectorAll(':scope > [data-rabbit-mirror-maintenance], :scope > [data-rabbit-mirror-maintenance-rabbit], :scope > [data-rabbit-mirror-feedback-cat], :scope > [data-rabbit-mirror-recipe]')) storage.append(button);
}
