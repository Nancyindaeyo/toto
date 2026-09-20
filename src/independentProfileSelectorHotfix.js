const RELEASE_VERSION = '1.5.53';
const ROW_ID = 'rh_independent_profile_selector_hotfix';
const SELECT_ID = 'rh_independent_profile_select';
const REFRESH_ID = 'rh_independent_profile_refresh';

let getSettingsRef = null;
let updateSettingsRef = null;
let getProfilesRef = null;
let refreshModeRef = null;
let documentClickHandler = null;
let retryTimers = [];
let watermarkObserver = null;


function syncReleaseWatermark() {
    if (typeof document === 'undefined') return;
    const watermark = document.querySelector('#rabbit_mirror_theater_settings .rabbit-mirror-toto-watermark');
    const wanted = `TOTOv${RELEASE_VERSION}`;
    if (watermark && watermark.textContent !== wanted) watermark.textContent = wanted;
}

function installWatermarkSync() {
    syncReleaseWatermark();
    if (typeof MutationObserver !== 'function' || typeof document === 'undefined') return;
    const watermark = document.querySelector('#rabbit_mirror_theater_settings .rabbit-mirror-toto-watermark');
    if (!watermark) return;
    watermarkObserver = new MutationObserver(() => syncReleaseWatermark());
    watermarkObserver.observe(watermark, { childList: true, characterData: true, subtree: true });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function profiles() {
    try {
        const rows = getProfilesRef?.();
        return Array.isArray(rows) ? rows.filter(item => item?.id) : [];
    } catch {
        return [];
    }
}

function selectedProfileId() {
    try { return String(getSettingsRef?.()?.independentConnectionProfileId || '').trim(); } catch { return ''; }
}

function profileLabel(item) {
    const name = String(item?.name || '未命名连接').trim();
    const model = String(item?.model || '').trim();
    const api = String(item?.api || '').trim();
    return [name, model, api].filter(Boolean).join(' · ');
}

function updateStatus(profile) {
    const status = document.getElementById('rh_independent_connection_status');
    if (!status) return;
    let actualModel = '';
    try { actualModel = String(getSettingsRef?.()?.independentApiModel || '').trim(); } catch {}
    if (!profile) {
        if (selectedProfileId()) {
            status.textContent = '当前连接已失效，请重新一键配置或选择酒馆连接';
            return;
        }
        status.textContent = `当前连接：手动接口；兔子镜请求模型：${actualModel || '尚未填写'}`;
        return;
    }
    const profileDefault = String(profile.model || '').trim();
    const defaultHint = profileDefault && profileDefault !== actualModel ? `（Profile 默认：${profileDefault}）` : '';
    status.textContent = `当前连接：${profile.name || '未命名连接'}；兔子镜请求模型：${actualModel || profileDefault || '尚未选择'}${defaultHint}`;
}

function syncModel(profile) {
    const model = String(profile?.model || '').trim();
    if (!model) return;
    const input = document.getElementById('rh_independent_model');
    if (input && input.value !== model) input.value = model;
    const select = document.getElementById('rh_independent_model_select');
    if (select) {
        let option = [...select.options].find(item => item.value === model);
        if (!option) {
            option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            select.appendChild(option);
        }
        select.value = model;
    }
}

function clearModelListForSource(profile) {
    const select = document.getElementById('rh_independent_model_select');
    if (select) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = profile
            ? `请从酒馆连接「${profile.name || '未命名连接'}」重新拉取模型`
            : '请从酒馆连接或手动接口拉取模型';
        select.innerHTML = '';
        select.appendChild(option);
        select.value = '';
        if (select.dataset) select.dataset.rhModelSource = '';
    }
    const source = document.getElementById('rh_independent_model_list_source');
    if (source) source.textContent = profile
        ? `连接来源已切换为「${profile.name || '未命名连接'}」；旧来源模型列表已清空，请重新拉取。`
        : '连接来源已切换；旧来源模型列表已清空。';
}

function renderProfileOptions({ force = false } = {}) {
    const select = document.getElementById(SELECT_ID);
    if (!select) return;
    if (!force && select.dataset.rabbitMirrorProfilesReady === 'true') return;
    const rows = profiles();
    const selected = selectedProfileId();
    const known = new Set(rows.map(item => String(item.id)));
    const options = ['<option value="">请选择 SillyTavern Connection Manager 配置</option>'];
    if (selected && !known.has(selected)) {
        options.push(`<option value="${escapeHtml(selected)}" selected disabled>当前保存的连接已不存在：${escapeHtml(selected)}</option>`);
    }
    for (const item of rows) {
        const id = String(item.id || '');
        options.push(`<option value="${escapeHtml(id)}"${id === selected ? ' selected' : ''}>${escapeHtml(profileLabel(item))}</option>`);
    }
    select.innerHTML = options.join('');
    select.dataset.rabbitMirrorProfilesReady = 'true';
    const current = rows.find(item => String(item.id) === selected) || null;
    updateStatus(current);
}

function onProfileChange(event) {
    const select = event.currentTarget;
    const id = String(select?.value || '').trim();
    const match = profiles().find(item => String(item.id) === id) || null;
    const previousId = selectedProfileId();
    let previousModel = '';
    try { previousModel = String(getSettingsRef?.()?.independentApiModel || '').trim(); } catch {}
    const selectedModel = match && (id !== previousId || !previousModel)
        ? String(match.model || '').trim()
        : previousModel;
    globalThis.__rabbitMirrorIndependentProfileSourceRevision = Number(globalThis.__rabbitMirrorIndependentProfileSourceRevision || 0) + 1;
    globalThis.__rabbitMirrorIndependentConnectionOperationRevision = Number(globalThis.__rabbitMirrorIndependentConnectionOperationRevision || 0) + 1;
    const patch = { independentConnectionProfileId: id };
    if (id) patch.independentApiKey = '';
    if (selectedModel) patch.independentApiModel = selectedModel;
    updateSettingsRef?.(patch);
    if (match) syncModel({ ...match, model: selectedModel || match.model });
    if (id !== previousId) clearModelListForSource(match);
    updateStatus(match);
    try { refreshModeRef?.(); } catch {}
}

function onRefreshClick() {
    renderProfileOptions({ force: true });
}

function ensureProfileSelector({ forceRefresh = false } = {}) {
    if (typeof document === 'undefined') return false;
    const importButton = document.getElementById('rh_independent_import_current');
    const card = importButton?.parentElement?.parentElement;
    if (!importButton || !card) return false;

    let row = document.getElementById(ROW_ID);
    let created = false;
    if (!row) {
        created = true;
        row = document.createElement('div');
        row.id = ROW_ID;
        row.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;margin-top:8px;align-items:center;';
        row.innerHTML = `
          <label for="${SELECT_ID}" style="grid-column:1/-1;font-size:11px;font-weight:700;opacity:.78;">连接配置</label>
          <select id="${SELECT_ID}" class="text_pole" style="min-width:0;width:100%;" aria-label="兔子镜独立 API Connection Manager 配置"></select>
          <button id="${REFRESH_ID}" class="menu_button" type="button" style="min-width:38px;padding:4px 8px;">↻</button>
          <div style="grid-column:1/-1;opacity:.62;font-size:10px;line-height:1.4;">可直接指定任意可复用的 Chat Completion 配置；切换后只保存 profile ID / 模型，不复制酒馆 Secrets。</div>`;
        card.appendChild(row);
        document.getElementById(SELECT_ID)?.addEventListener('change', onProfileChange);
        document.getElementById(REFRESH_ID)?.addEventListener('click', onRefreshClick);
    }
    renderProfileOptions({ force: forceRefresh || created });
    syncReleaseWatermark();
    return true;
}

function clearRetryTimers() {
    for (const timer of retryTimers) clearTimeout(timer);
    retryTimers = [];
}

function scheduleEnsure(delay = 0, { forceRefresh = false } = {}) {
    const timer = setTimeout(() => {
        retryTimers = retryTimers.filter(value => value !== timer);
        ensureProfileSelector({ forceRefresh });
    }, Math.max(0, Number(delay) || 0));
    retryTimers.push(timer);
    return timer;
}

export function initRabbitMirrorIndependentProfileSelectorHotfix({
    getSettings,
    updateSettings,
    getIndependentConnectionProfiles,
    refreshRabbitMirrorGenerationMode,
} = {}) {
    destroyRabbitMirrorIndependentProfileSelectorHotfix();
    getSettingsRef = typeof getSettings === 'function' ? getSettings : null;
    updateSettingsRef = typeof updateSettings === 'function' ? updateSettings : null;
    getProfilesRef = typeof getIndependentConnectionProfiles === 'function' ? getIndependentConnectionProfiles : null;
    refreshModeRef = typeof refreshRabbitMirrorGenerationMode === 'function' ? refreshRabbitMirrorGenerationMode : null;
    installWatermarkSync();

    documentClickHandler = event => {
        const target = event?.target;
        if (!target?.closest) return;
        if (target.closest('#rh_independent_import_current')) {
            scheduleEnsure(0);
            scheduleEnsure(300, { forceRefresh: true });
            scheduleEnsure(1200, { forceRefresh: true });
            return;
        }
        if (target.closest('#rabbit_mirror_theater_settings .inline-drawer-toggle, #rh_generation_independent, #rh_independent_api_fields')) {
            scheduleEnsure(0);
        }
    };
    document.addEventListener('click', documentClickHandler, true);
}

export function destroyRabbitMirrorIndependentProfileSelectorHotfix() {
    clearRetryTimers();
    try { watermarkObserver?.disconnect?.(); } catch {}
    watermarkObserver = null;
    if (documentClickHandler && typeof document !== 'undefined') document.removeEventListener('click', documentClickHandler, true);
    documentClickHandler = null;
    const select = typeof document !== 'undefined' ? document.getElementById(SELECT_ID) : null;
    const refresh = typeof document !== 'undefined' ? document.getElementById(REFRESH_ID) : null;
    select?.removeEventListener?.('change', onProfileChange);
    refresh?.removeEventListener?.('click', onRefreshClick);
    if (typeof document !== 'undefined') document.getElementById(ROW_ID)?.remove?.();
    getSettingsRef = null;
    updateSettingsRef = null;
    getProfilesRef = null;
    refreshModeRef = null;
}
