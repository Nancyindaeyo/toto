export const AUTOMATIC_REROLL_MAX = 2;

export function shouldAutomaticReroll({
    manual = false,
    faceResay = false,
    usableReadyFace = false,
    failedPosts = 0,
} = {}) {
    if (manual || faceResay || usableReadyFace) return false;
    const failed = Math.max(0, Number(failedPosts) || 0);
    return failed >= 1 && failed <= AUTOMATIC_REROLL_MAX;
}

export function automaticRerollStatusText(attempt = 1, max = AUTOMATIC_REROLL_MAX) {
    const current = Math.max(1, Math.min(Number(attempt) || 1, Number(max) || AUTOMATIC_REROLL_MAX));
    const total = Math.max(1, Number(max) || AUTOMATIC_REROLL_MAX);
    return `🐇 正在自动重试兔子镜（${current}/${total}）……已出的镜面会保留到新版本完成`;
}

export function automaticRerollExhaustedNote(attempts = AUTOMATIC_REROLL_MAX) {
    const total = Math.max(1, Number(attempts) || AUTOMATIC_REROLL_MAX);
    return `已自动重试 ${total}/${total}，不会继续自动重发。请手动重新生成兔子镜。`;
}

export function shouldAnnounceAutomaticRerollExhausted({
    manual = false,
    faceResay = false,
    usableReadyFace = false,
    failedPosts = 0,
} = {}) {
    if (manual || faceResay || usableReadyFace) return false;
    return Math.max(0, Number(failedPosts) || 0) > AUTOMATIC_REROLL_MAX;
}
