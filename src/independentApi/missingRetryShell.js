// Visible floors that lost their external shell cannot retry: the button lives
// on that shell. Restore a terminal error card below that assistant reply.
// Automatic-generation authorization must never gate this UI: after a crash
// there is no cutover, and that is exactly when the retry card is needed.

export const MISSING_INDEPENDENT_RETRY_SHELL_LIMIT = 10;

export const MISSING_SHELL_SCAN_RANGE_ALL = 'all';

export const MISSING_SHELL_SCAN_RANGE_OPTIONS = [10, 20, 'all'];

export const MISSING_INDEPENDENT_RETRY_SHELL_MESSAGE = '这条还没有兔子镜。上次可能因网络中断或页面退出没有挂上外壳，不会自动再发请求。确认正文后可点击“重新生成兔子镜”。';

export function normalizeMissingShellScanRange(value) {
    if (value === MISSING_SHELL_SCAN_RANGE_ALL || value === Infinity) return MISSING_SHELL_SCAN_RANGE_ALL;
    const n = Number(value);
    if (n === 20) return 20;
    return MISSING_INDEPENDENT_RETRY_SHELL_LIMIT;
}

export function assistantRowsInScanRange(rows, range) {
    const list = Array.isArray(rows) ? rows.filter(row => Number.isInteger(Number(row?.i)) && Number(row.i) >= 0) : [];
    const normalized = normalizeMissingShellScanRange(range);
    if (normalized === MISSING_SHELL_SCAN_RANGE_ALL) return list;
    return list.slice(-normalized);
}

export function isRecentAssistantIndex(recentRows, index) {
    const id = Number(index);
    if (!Number.isInteger(id) || id < 0 || !Array.isArray(recentRows)) return false;
    return recentRows.some(row => Number(row?.i) === id);
}

export function isMissingShellTargetFloor(index, { recentIndices, syncedIndices } = {}) {
    const id = Number(index);
    if (!Number.isInteger(id) || id < 0) return false;
    if (recentIndices instanceof Set && recentIndices.has(id)) return true;
    if (syncedIndices instanceof Set && syncedIndices.has(id)) return true;
    return false;
}

export function hasUsableAssistantBody(message) {
    return !!(String(message?.mes || '').trim() || String(message?.extra?.display_text || '').trim());
}

export function formatMissingShellFloorLabel(index) {
    const id = Number(index);
    return Number.isInteger(id) && id >= 0 ? `#${id}` : '';
}

export function formatMissingShellReport({ range, floors } = {}) {
    const normalized = normalizeMissingShellScanRange(range);
    const items = Array.isArray(floors) ? floors : [];
    const labels = items.map(item => formatMissingShellFloorLabel(item?.index ?? item)).filter(Boolean);
    const scope = normalized === MISSING_SHELL_SCAN_RANGE_ALL ? '全部助手回复' : `最近 ${normalized} 条助手回复`;
    if (!labels.length) return `${scope}里没有缺外壳的楼层。`;
    return `${scope}里缺外壳：${labels.join('、')}`;
}

export function shouldRestoreMissingIndependentRetryShell({
    timing = '',
    hasSavedHtml = false,
    persistedDeleted = false,
    hasHost = false,
    hasActiveFlight = false,
    hasFollowMirror = false,
    isTargetFloor = false,
    hasMessageBody = false,
    isActiveGenerationTarget = false,
    quickWaiting = false,
} = {}) {
    if (timing !== 'auto' && timing !== 'manual') return false;
    if (hasSavedHtml || persistedDeleted || hasHost || hasActiveFlight || hasFollowMirror) return false;
    if (isActiveGenerationTarget || quickWaiting) return false;
    return !!(isTargetFloor && hasMessageBody);
}
