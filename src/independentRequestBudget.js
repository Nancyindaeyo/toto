export const DEFAULT_INDEPENDENT_MAX_REQUEST_CHARS = 50000;
export const MIN_INDEPENDENT_MAX_REQUEST_CHARS = 8000;
// Only rejects accidental multi-million values; the settings field itself has no product cap.
export const INDEPENDENT_MAX_REQUEST_CHARS_CEILING = 2_000_000;

export function normalizeIndependentMaxRequestChars(value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n) || n <= 0) return DEFAULT_INDEPENDENT_MAX_REQUEST_CHARS;
    return Math.max(MIN_INDEPENDENT_MAX_REQUEST_CHARS, Math.min(INDEPENDENT_MAX_REQUEST_CHARS_CEILING, n));
}

export function configuredIndependentMaxRequestChars(settings) {
    return normalizeIndependentMaxRequestChars(settings?.independentMaxRequestChars);
}
