// Visible floors that lost their external shell cannot retry: the button lives
// on that shell. Restore a terminal error card below that assistant reply.
// Automatic-generation authorization must never gate this UI: after a crash
// there is no cutover, and that is exactly when the retry card is needed.

export const MISSING_INDEPENDENT_RETRY_SHELL_LIMIT = 6;

export const MISSING_INDEPENDENT_RETRY_SHELL_MESSAGE = '这条还没有兔子镜。上次可能因网络中断或页面退出没有挂上外壳，不会自动再发请求。确认正文后可点击“重新生成兔子镜”。';

export function isRecentAssistantIndex(recentRows, index) {
    const id = Number(index);
    if (!Number.isInteger(id) || id < 0 || !Array.isArray(recentRows)) return false;
    return recentRows.some(row => Number(row?.i) === id);
}

export function hasUsableAssistantBody(message) {
    return !!(String(message?.mes || '').trim() || String(message?.extra?.display_text || '').trim());
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
