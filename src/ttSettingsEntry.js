// A settings-only escape hatch for managed TT. No chat ownership, observers,
// timers, layout measurements, library reads or heavy imports live here.
const entries = new WeakMap();

export function mountRabbitMirrorTtSettingsEntry({ runtimeVersion, isCurrent, getStatus, loadSettings, document: doc = globalThis.document }) {
    const status = getStatus();
    if (status.host !== 'tauritavern' || status.managed !== true || !isCurrent()) return null;
    const mount = doc?.getElementById('extensions_settings2');
    if (!mount) return null;
    entries.get(doc)?.dispose();
    const fullPanel = () => {
        const panel = doc.getElementById('rabbit_mirror_theater_settings');
        return panel?.isConnected && panel.dataset.rabbitMirrorRuntimeVersion === runtimeVersion
            && panel.dataset.rabbitMirrorUiReady === 'true' ? panel : null;
    };
    if (fullPanel()) return null;
    // The shell intentionally does not match the full-settings intent selectors
    // in index.js: merely hovering or focusing it must not load the runtime.
    doc.getElementById('rabbit_mirror_tt_settings_entry')?.remove();
    const shell = doc.createElement('div');
    shell.id = 'rabbit_mirror_tt_settings_entry';
    shell.className = 'rabbit-mirror-settings';
    shell.dataset.rabbitMirrorRuntimeVersion = runtimeVersion;
    shell.innerHTML = `
      <div class="inline-drawer">
        <div class="inline-drawer-header rabbit-mirror-drawer-header"><b>兔子镜小剧场</b></div>
        <div style="padding:12px;line-height:1.5;overflow-wrap:anywhere">
          <p id="rh_tt_settings_entry_note" style="margin:0 0 12px"><b>设置可用不代表聊天已接入。</b><br><span data-rm-tt-entry-host-note></span></p>
          <button id="rh_tt_settings_entry_open" class="menu_button" type="button" aria-describedby="rh_tt_settings_entry_note rh_tt_settings_entry_status" style="min-height:48px;min-width:48px;cursor:pointer;touch-action:manipulation">打开设置与诊断</button>
          <p id="rh_tt_settings_entry_status" role="status" aria-live="polite" aria-atomic="true" style="margin:8px 0 0"></p>
        </div>
      </div>`;
    let hostNote = '完整设置按需加载；聊天显示仍遵循 TT 的 ChatSurface 挂载。';
    if (status.registrationFailure === 'late-projection') {
        hostNote = 'TT 在聊天投影后才加载兔子镜，已错过注册窗口。可见楼层滚入时会从缓存回挂成品，这不是 ChatSurface 晚注册已修好；关闭/重开虚化或反复点击不能补注册。';
    } else if (status.registrationFailure === 'duplicate-participant') {
        hostNote = 'TT 检测到重复的兔子镜参与者；请仅启用一份正式版或测试版，再重启。';
    } else if (!status.registered) {
        hostNote = '兔子镜尚未获得 TT 聊天挂载；具体原因可在高级设置的「工具与维护」中查看 TT 诊断。';
    }
    shell.querySelector('[data-rm-tt-entry-host-note]').textContent = hostNote;
    const button = shell.querySelector('button');
    const feedback = shell.querySelector('[role="status"]');
    let disposed = false;
    let busy = false;
    const active = () => !disposed && isCurrent() && shell.isConnected;
    function dispose() {
        disposed = true;
        button.removeEventListener('click', open);
        shell.remove();
        if (entries.get(doc) === controller) entries.delete(doc);
    }
    function reconcile() {
        const panel = fullPanel();
        if (!panel) return false;
        dispose();
        return true;
    }
    async function open() {
        if (!active() || busy) return;
        if (reconcile()) return;
        busy = true;
        button.disabled = true;
        button.textContent = '正在加载设置…';
        shell.setAttribute('aria-busy', 'true');
        feedback.textContent = '正在加载完整设置；不会发送生成请求。';
        try {
            await loadSettings(active);
            if (!active()) return;
            const panel = fullPanel();
            if (!panel) throw new Error('RabbitMirror settings did not mount');
            // Open only the existing settings drawer. Do not dispatch a focus or
            // click into it: legacy intent listeners would initialize the API.
            const content = panel.querySelector(':scope > .inline-drawer > .inline-drawer-content');
            if (content) content.style.display = 'block';
            const icon = panel.querySelector(':scope > .inline-drawer > .inline-drawer-header .inline-drawer-icon');
            icon?.classList.remove('down', 'fa-circle-chevron-down');
            icon?.classList.add('up', 'fa-circle-chevron-up');
            reconcile();
        } catch {
            if (!active()) return;
            button.textContent = '重试打开设置与诊断';
            feedback.textContent = '未能打开完整设置。请确认连接后手动重试；未发送生成请求。';
        } finally {
            if (active()) {
                busy = false;
                button.disabled = false;
                shell.removeAttribute('aria-busy');
            }
        }
    }
    const controller = Object.freeze({ dispose, reconcile });
    entries.set(doc, controller);
    button.addEventListener('click', open);
    mount.append(shell);
    return controller;
}
