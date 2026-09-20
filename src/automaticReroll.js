export const AUTOMATIC_REROLL_DEFAULT = 2;
export const AUTOMATIC_REROLL_MIN = 0;
export const AUTOMATIC_REROLL_IDLE_DEFAULT_SECONDS = 90;
export const AUTOMATIC_REROLL_IDLE_MIN_SECONDS = 1;
export const AUTOMATIC_REROLL_STALL_MS = AUTOMATIC_REROLL_IDLE_DEFAULT_SECONDS * 1000;
export const AUTOMATIC_REROLL_STALL_CODE = 'RABBIT_MIRROR_INDEPENDENT_STALL_TIMEOUT';

export function stallTimeoutError(lastProgressAt = Date.now(), idleSeconds = AUTOMATIC_REROLL_IDLE_DEFAULT_SECONDS) {
    const seconds = normalizeAutomaticRerollIdleSeconds(idleSeconds);
    const error = new Error(`兔子镜已连续 ${seconds} 秒没有新进度，已中止本轮并将自动重试缺的面。`);
    error.name = 'RabbitMirrorIndependentTimeoutError';
    error.code = AUTOMATIC_REROLL_STALL_CODE;
    error.allowAutomaticReroll = true;
    error.lastProgressAt = lastProgressAt;
    error.idleSeconds = seconds;
    return error;
}

export function isAutomaticRerollStall(error) {
    return error?.code === AUTOMATIC_REROLL_STALL_CODE || error?.allowAutomaticReroll === true;
}

export function normalizeAutomaticRerollMax(value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return AUTOMATIC_REROLL_DEFAULT;
    return Math.max(AUTOMATIC_REROLL_MIN, n);
}

export function automaticRerollEnabled(settings) {
    return settings?.automaticRerollEnabled !== false;
}

export function configuredAutomaticRerollMax(settings) {
    if (!automaticRerollEnabled(settings)) return 0;
    return normalizeAutomaticRerollMax(settings?.independentAutomaticRerollMax);
}

export function normalizeAutomaticRerollIdleSeconds(value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return AUTOMATIC_REROLL_IDLE_DEFAULT_SECONDS;
    return Math.max(AUTOMATIC_REROLL_IDLE_MIN_SECONDS, n);
}

export function configuredAutomaticRerollIdleMs(settings) {
    return normalizeAutomaticRerollIdleSeconds(settings?.independentAutomaticRerollIdleSeconds) * 1000;
}

export function configuredAutomaticRerollIdleSeconds(settings) {
    return normalizeAutomaticRerollIdleSeconds(settings?.independentAutomaticRerollIdleSeconds);
}

export function isQuotaInsufficientFailure(error, diagnostic = {}) {
    const status = Number(diagnostic?.status ?? error?.status ?? error?.statusCode);
    if (status === 401 || status === 429) return false;
    const text = [
        error?.message, error?.code, diagnostic?.semanticFailure, diagnostic?.transportCause,
        diagnostic?.failureCategory, compactErrorBlob(error), compactErrorBlob(diagnostic),
    ].map(value => String(value || '')).join(' ');
    if (/\b429\b|rate[_ -]?limit|too many requests|限流|请求过多/i.test(text) && !/insufficient[_ -]?quota|余额不足|额度不足/i.test(text)) {
        return false;
    }
    return /insufficient[_ -]?quota|exceeded[_ -]?quota|quota[_ -]?exceeded|billing[_ -]?hard[_ -]?limit|payment required|\bHTTP 402\b|余额不足|额度不足|账户额度|credit(?:s)? (?:exhausted|depleted|exceeded)/i.test(text);
}

export function isLocalPreflightFailure(error, diagnostic = {}) {
    if (Number(diagnostic?.requestCount) === 0 || Number(error?.requestCount) === 0) return true;
    const text = `${error?.code || ''} ${diagnostic?.semanticFailure || ''} ${diagnostic?.transportCause || ''} ${diagnostic?.failureCategory || ''}`;
    return /local-preflight|RABBIT_MIRROR_(?:CONTEXT_BOUNDARY|REQUEST_TOO_LARGE|DISPATCH_LEASE|BATCH_PLAN|CONNECTION_PROFILE|ADVANCED_OPTIONS|EXTERNAL_|APPEARANCE_|MEMORY_)/i.test(text)
        || /WORLD_BOOK_|MULTIFACE_PLAN_UNAVAILABLE/.test(String(error?.code || ''));
}

export function shouldAutomaticReroll({
    enabled = true,
    complete = false,
    failedPosts = 0,
    max = AUTOMATIC_REROLL_DEFAULT,
    timedOut = false,
    cancelled = false,
    stale = false,
    preflight = false,
    quotaInsufficient = false,
} = {}) {
    if (enabled === false || complete || timedOut || cancelled || stale || preflight || quotaInsufficient) return false;
    const total = normalizeAutomaticRerollMax(max);
    if (total <= 0) return false;
    const failed = Math.max(0, Number(failedPosts) || 0);
    return failed >= 1 && failed <= total;
}

export function automaticRerollStatusText(attempt = 1, max = AUTOMATIC_REROLL_DEFAULT, missingCount = 0) {
    const total = Math.max(1, normalizeAutomaticRerollMax(max) || AUTOMATIC_REROLL_DEFAULT);
    const current = Math.max(1, Math.min(Number(attempt) || 1, total));
    const missing = Math.max(0, Number(missingCount) || 0);
    const missingNote = missing > 0 ? `，还缺 ${missing} 面` : '';
    return `🐇 正在自动重试兔子镜（${current}/${total}${missingNote}）……已出的镜面会保留`;
}

export function automaticRerollExhaustedNote(attempts = AUTOMATIC_REROLL_DEFAULT) {
    const total = Math.max(0, normalizeAutomaticRerollMax(attempts));
    if (total <= 0) return '未自动重发。请手动重新生成兔子镜。';
    return `已自动重试 ${total}/${total}，不会继续自动重发。已出的面会保留。`;
}

export function shouldAnnounceAutomaticRerollExhausted({
    complete = false,
    failedPosts = 0,
    max = AUTOMATIC_REROLL_DEFAULT,
    cancelled = false,
    preflight = false,
    quotaInsufficient = false,
} = {}) {
    if (complete || cancelled || preflight || quotaInsufficient) return false;
    const total = normalizeAutomaticRerollMax(max);
    if (total <= 0) return false;
    return Math.max(0, Number(failedPosts) || 0) > total;
}

function compactErrorBlob(value) {
    if (!value || typeof value !== 'object') return '';
    try {
        return JSON.stringify({
            semanticFailure: value.semanticFailure,
            transportCause: value.transportCause,
            failureCategory: value.failureCategory,
            status: value.status,
            code: value.code,
        });
    } catch {
        return '';
    }
}
