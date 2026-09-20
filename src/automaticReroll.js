export const AUTOMATIC_REROLL_DEFAULT = 2;
export const AUTOMATIC_REROLL_MIN = 0;
export const AUTOMATIC_REROLL_LIMIT = 10;
export const AUTOMATIC_REROLL_MAX = AUTOMATIC_REROLL_DEFAULT;
export const AUTOMATIC_REROLL_STALL_MS = 180 * 1000;
export const AUTOMATIC_REROLL_STALL_CODE = 'RABBIT_MIRROR_INDEPENDENT_STALL_TIMEOUT';

export function stallTimeoutError(lastProgressAt = Date.now()) {
    const error = new Error('独立 API 已等待 180 秒仍未收到完整兔子镜，已中止本轮。');
    error.name = 'RabbitMirrorIndependentTimeoutError';
    error.code = AUTOMATIC_REROLL_STALL_CODE;
    error.allowAutomaticReroll = true;
    error.lastProgressAt = lastProgressAt;
    return error;
}

export function isAutomaticRerollStall(error) {
    return error?.code === AUTOMATIC_REROLL_STALL_CODE || error?.allowAutomaticReroll === true;
}

export function normalizeAutomaticRerollMax(value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return AUTOMATIC_REROLL_DEFAULT;
    return Math.max(AUTOMATIC_REROLL_MIN, Math.min(AUTOMATIC_REROLL_LIMIT, n));
}

export function configuredAutomaticRerollMax(settings) {
    return normalizeAutomaticRerollMax(settings?.independentAutomaticRerollMax);
}

export function shouldAutomaticReroll({
    manual = false,
    faceResay = false,
    usableReadyFace = false,
    failedPosts = 0,
    max = AUTOMATIC_REROLL_DEFAULT,
    timedOut = false,
    aborted = false,
    stale = false,
} = {}) {
    if (timedOut || aborted || stale) return false;
    if (manual || faceResay || usableReadyFace) return false;
    const total = normalizeAutomaticRerollMax(max);
    if (total <= 0) return false;
    const failed = Math.max(0, Number(failedPosts) || 0);
    return failed >= 1 && failed <= total;
}

export function automaticRerollStatusText(attempt = 1, max = AUTOMATIC_REROLL_DEFAULT) {
    const total = Math.max(1, normalizeAutomaticRerollMax(max) || AUTOMATIC_REROLL_DEFAULT);
    const current = Math.max(1, Math.min(Number(attempt) || 1, total));
    return `🐇 正在自动重试兔子镜（${current}/${total}）……已出的镜面会保留到新版本完成`;
}

export function automaticRerollExhaustedNote(attempts = AUTOMATIC_REROLL_DEFAULT) {
    const total = Math.max(0, normalizeAutomaticRerollMax(attempts));
    if (total <= 0) return '未自动重发。请手动重新生成兔子镜。';
    return `已自动重试 ${total}/${total}，不会继续自动重发。请手动重新生成兔子镜。`;
}

export function shouldAnnounceAutomaticRerollExhausted({
    manual = false,
    faceResay = false,
    usableReadyFace = false,
    failedPosts = 0,
    max = AUTOMATIC_REROLL_DEFAULT,
} = {}) {
    if (manual || faceResay || usableReadyFace) return false;
    const total = normalizeAutomaticRerollMax(max);
    if (total <= 0) return false;
    return Math.max(0, Number(failedPosts) || 0) > total;
}
