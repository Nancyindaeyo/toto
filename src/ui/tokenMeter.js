// Split from ui.js — Prompt meter and latest independent request diagnostic.

import { getSettings } from '../settings.js?rmv=1.5.60-fork1';
import { getLastRabbitMirrorTokenRecordForSource, TOKEN_METER_EVENT } from '../tokenMeter.js?rmv=1.5.53-visualquick1';
import { API_REQUEST_DIAGNOSTIC_EVENT, getLastIndependentApiRequestDiagnostic } from '../independentApi.js?rmv=1.5.70';
import { escapeHtml } from './runtime.js?rmv=1.5.70';

function independentApiProfileLabel(diagnostic) {
    if (!diagnostic?.profile) return '暂无记录';
    const numericStatus = Number(diagnostic.status || 0);
    const status = diagnostic.ok
        ? '成功'
        : numericStatus > 0
            ? `失败 HTTP ${numericStatus}`
            : diagnostic.transportCause === 'connection-interrupted'
                ? '连接中断（未收到完整响应）'
                : '未收到 HTTP 响应';
    const temp = diagnostic.temperatureSent ? `温度 ${Number(diagnostic.configuredTemperature ?? 0.8)}` : '默认温度';
    const stream = diagnostic.streamSent ? '流式' : '非流式';
    return `${status}｜${temp}｜${stream}`;
}
// Display only: keep the exact IDs and original labels in the request/repair record.
// No library reads are needed to render the latest selection, including legacy labels.
function shortDiagnosticSelectionLabels(labels, ids, fallback) {
    if (!Array.isArray(labels) || !labels.length) return fallback;
    return labels.slice(0, 12).map((value, index) => {
        let title = typeof value === 'string' ? value.slice(0, 4096).trim() : '';
        const id = typeof ids?.[index] === 'string' ? ids[index].slice(0, 2048) : '';
        if (id && (title === id || title.startsWith(`${id} `))) title = title.slice(id.length).trim();
        // Older diagnostics did not always carry IDs alongside "ID title".
        title = title.replace(/^ext:\S+(?:\s+|$)/, '').replace(/^(?:[A-Z]|\d+)(?:\.\d+)+(?:\s+|$)/, '').trim();
        if (!title) return '名称未记录';
        const chars = Array.from(title.replace(/\s+/g, ' '));
        return chars.length > 64 ? `${chars.slice(0, 64).join('')}…` : chars.join('');
    }).join('＋');
}

function renderDiagnosticSelection(diagnostic) {
    const faces = Array.isArray(diagnostic?.faces) ? diagnostic.faces.slice(0, 5) : [];
    const requested = Number(diagnostic?.faceCount);
    const count = Math.min(5, Math.max(faces.length, Number.isInteger(requested) && requested > 0 ? requested : 1));
    const hasLabels = Array.isArray(diagnostic?.themeLabels) || Array.isArray(diagnostic?.formatLabels);
    if (!faces.length && !hasLabels && count === 1) return '';
    const rows = Array.from({ length: count }, (_, index) => {
        const face = faces[index] || (index === 0 && !faces.length ? diagnostic : null);
        const themes = shortDiagnosticSelectionLabels(face?.themeLabels, face?.themeIds, face ? '仅当前语境' : '名称未记录');
        const formats = shortDiagnosticSelectionLabels(face?.formatLabels, face?.formatIds, '名称未记录');
        return `<div data-rm-diagnostic-face="${index + 1}" style="min-width:0;overflow-wrap:anywhere;margin-top:4px;"><b>第 ${index + 1} 面：</b>题材：${escapeHtml(themes)}｜展现：${escapeHtml(formats)}</div>`;
    }).join('');
    return `<br><b>抽到：</b>${rows}`;
}

function renderIndependentApiDiagnostic(diagnostic = getLastIndependentApiRequestDiagnostic()) {
    const target = $('#rh_independent_api_diagnostic');
    if (!target.length) return;
    const text = independentApiProfileLabel(diagnostic);
    const attempts = '';
    const requestedModel = String(diagnostic?.model || '').trim();
    const model = requestedModel ? `<br><b>请求指定模型：</b>${escapeHtml(requestedModel)}` : '';
    const selection = renderDiagnosticSelection(diagnostic);
    const worldInfo = diagnostic?.globalWorldInfoEnabled
        ? `<br><b>世界书：</b>${diagnostic.globalWorldInfoCaptured ? `已带入 ${formatMeterNumber(diagnostic.globalWorldInfoEntries)}／${formatMeterNumber(diagnostic.globalWorldInfoTotalEntries || diagnostic.globalWorldInfoEntries)} 条，${formatMeterNumber(diagnostic.globalWorldInfoChars)} 字符${diagnostic.globalWorldInfoTruncated ? '（已按独立预算裁剪）' : ''}` : '本轮无可用条目'}`
        : '<br><b>世界书：</b>关闭';
    target.html(`<b>最近请求：</b>${escapeHtml(text)}${escapeHtml(attempts)}${model}${selection}${worldInfo}`);
}


function formatMeterNumber(value) {
    return Math.max(0, Number(value) || 0).toLocaleString('zh-CN');
}

function tokenMeterSourceLabel(generationSource) {
    return String(generationSource || '').toLowerCase() === 'independent' ? '独立 API' : '跟随正文 API';
}

function tokenMeterRecordAgeLabel(record) {
    const recordedAt = Number(record?.recordedAt);
    const age = recordedAt > 0 ? Date.now() - recordedAt : Number.POSITIVE_INFINITY;
    return age >= 0 && age <= 30 * 60 * 1000 ? '最近记录' : '历史记录';
}

function tokenMeterNoInjectionLabel(reason) {
    const labels = {
        disabled: '最近状态：未注入（兔子镜已关闭）',
        'quiet-skipped': '最近状态：未注入（静默生成已跳过）',
        'impersonate-skipped': '最近状态：未注入（角色扮演生成已跳过）',
        'directive-skipped': '最近状态：未注入（用户指令要求跳过）',
        'independent-api': '最近状态：正文 API 未注入（兔子镜由独立 API 生成）',
        'mode-change': '当前注入已按生成方式切换清空',
        empty: '最近状态：未注入（没有形成有效 Prompt）',
        cleared: '当前注入已清空',
        manual: '当前注入已手动清空',
    };
    return labels[String(reason || '')] || '最近状态：未注入';
}

function renderTokenMeter(record = getLastRabbitMirrorTokenRecordForSource(getSettings().generationSource)) {
    const root = $('#rh_token_meter');
    if (!root.length) return;
    const main = root.find('[data-rh-token-meter-main]');
    const exact = root.find('[data-rh-token-meter-exact]');
    const detail = root.find('[data-rh-token-meter-detail]');
    const generationSource = getSettings().generationSource;
    const sourceLabel = tokenMeterSourceLabel(generationSource);
    if (!record) {
        main.text(`${sourceLabel} · 尚无估算记录`);
        exact.text('下一次生成准备请求时更新。');
        detail.text('这里只显示兔子镜 Prompt 的本地估算，不是服务商账单 Token。');
        return;
    }
    const ageLabel = tokenMeterRecordAgeLabel(record);
    if (record.status === 'independent') {
        const tokens = record.tokens || {};
        const chars = record.chars || {};
        main.text(`${sourceLabel} · ${ageLabel} · 请求前规则估算约 ${formatMeterNumber(tokens.estimated)} Token（非账单）`);
        const layerText = chars.independentContextLayers
            ? ` · 最近 ${formatMeterNumber(chars.independentContextLayers)}/${formatMeterNumber(chars.independentContextMaxLayers || chars.independentContextLayers)} 层`
            : '';
        const filteredText = [
            chars.filteredRabbitMirrorChars ? `历史兔子镜 ${formatMeterNumber(chars.filteredRabbitMirrorChars)} 字符` : '',
            chars.filteredContextTagChars ? `指定标签 ${formatMeterNumber(chars.filteredContextTagChars)} 字符` : '',
        ].filter(Boolean).join(' · ');
        const totalRequestChars = Number(chars.totalRequest) || (Number(chars.total) || 0) + (Number(chars.independentContext) || 0);
        exact.text(`规则估算范围 ${formatMeterNumber(tokens.min)}–${formatMeterNumber(tokens.max)} Token；请求消息内容合计 ${formatMeterNumber(totalRequestChars)} 字符（规则 ${formatMeterNumber(chars.total)}；上下文 ${formatMeterNumber(chars.independentContext)}）${layerText}${filteredText ? ` · 已过滤 ${filteredText}` : ''}。`);
        const parts = [
            `基础约 ${formatMeterNumber(tokens.baseEstimated)}`,
            chars.feedback ? `反馈约 ${formatMeterNumber(tokens.feedbackEstimated)}` : '反馈 0',
            chars.executionLock ? `格式与边界约束约 ${formatMeterNumber(tokens.executionLockEstimated)} Token（非禁词）` : '',
            `参考内容 ${formatMeterNumber(chars.motherLibrary)} 字符`,
            chars.sharedMemory ? `回忆资料 ${formatMeterNumber(chars.sharedMemory)} 字符` : '',
            chars.editableVisual ? `自定义视觉 ${formatMeterNumber(chars.editableVisual)} 字符` : '',
        ].filter(Boolean);
        detail.text(parts.join('；'));
        return;
    }
    if (record.status !== 'injected') {
        main.text(`${sourceLabel} · ${ageLabel} · 追加量 0`);
        exact.text(tokenMeterNoInjectionLabel(record.reason));
        detail.text('最近状态没有追加兔子镜 Prompt；这不是服务商账单 Token。');
        return;
    }

    const tokens = record.tokens || {};
    const chars = record.chars || {};
    main.text(`${sourceLabel} · ${ageLabel} · 兔子镜待注入 Prompt 估算约 ${formatMeterNumber(tokens.estimated)} Token（非账单）`);
    exact.text(`估算范围 ${formatMeterNumber(tokens.min)}–${formatMeterNumber(tokens.max)} Token；Prompt 字符数 ${formatMeterNumber(chars.total)}`);
    const parts = [
        `基础约 ${formatMeterNumber(tokens.baseEstimated)}`,
        chars.feedback ? `反馈约 ${formatMeterNumber(tokens.feedbackEstimated)}` : '反馈 0',
        `参考内容 ${formatMeterNumber(chars.motherLibrary)} 字符`,
        chars.sharedMemory ? `回忆资料 ${formatMeterNumber(chars.sharedMemory)} 字符` : '',
        chars.editableVisual ? `自定义视觉 ${formatMeterNumber(chars.editableVisual)} 字符` : '',
    ].filter(Boolean);
    detail.text(parts.join('；'));
}

function attachTokenMeterListener() {
    try { globalThis.__rabbitMirrorTokenMeterUiCleanup?.(); } catch {}
    try { globalThis.__rabbitMirrorBlacklistUiCleanup?.(); } catch {}
    globalThis.__rabbitMirrorBlacklistUiCleanup = null;
    // Select the record for the currently visible generation mode. A host-side
    // "main API 0 Token" bookkeeping event must not hide the latest independent
    // API measurement.
    const handler = () => renderTokenMeter();
    globalThis.addEventListener?.(TOKEN_METER_EVENT, handler);
    globalThis.__rabbitMirrorTokenMeterUiCleanup = () => globalThis.removeEventListener?.(TOKEN_METER_EVENT, handler);
}

export function attachIndependentApiDiagnosticListener() {
    try { globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup?.(); } catch {}
    const independentDiagnosticListener = event => { renderIndependentApiDiagnostic(event?.detail || null); };
    globalThis.addEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
    globalThis.__rabbitMirrorIndependentApiDiagnosticUiCleanup = () => globalThis.removeEventListener?.(API_REQUEST_DIAGNOSTIC_EVENT, independentDiagnosticListener);
}

export { renderTokenMeter, attachTokenMeterListener, renderIndependentApiDiagnostic };
