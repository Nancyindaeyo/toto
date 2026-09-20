// Split from ui.js — runtime.

export const SETTINGS_UI_VERSION = '1.12-layered-ui3-missingshell2-requestbudget1';
export const RUNTIME_VERSION = '1.5.74';

export function isCurrentRuntime() {
    return globalThis.__rabbitMirrorRuntimeVersion === RUNTIME_VERSION;
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
