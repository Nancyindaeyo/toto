const PREFIX = 'rabbitMirror:image:v1:';

function storageKey(key, kind) {
    if (typeof key !== 'string' || !key) throw new TypeError('图片必须绑定到明确的聊天与镜面。');
    return `${PREFIX}${kind}:${key}`;
}

function read(key, kind) {
    const text = globalThis.localStorage.getItem(storageKey(key, kind));
    return text == null ? null : JSON.parse(text);
}

function write(key, kind, value) {
    // A single atomic setItem: a quota/error leaves the entire old record intact.
    globalThis.localStorage.setItem(storageKey(key, kind), JSON.stringify(value));
}

function storedRecord(record) {
    if (!record || typeof record !== 'object') throw new TypeError('缺少要保存的图片。');
    const { history: ignoredHistory, ...copy } = record;
    const url = copy.path || copy.url || copy.dataUrl;
    if (typeof url !== 'string' || !url) throw new TypeError('图片没有可保存的地址。');
    copy.url = url;
    // Durable provider files do not require duplicating their large base64 payload.
    if (copy.path) delete copy.dataUrl;
    return copy;
}

export function loadMirrorImage(key) {
    const data = read(key, 'images');
    if (data == null) return null;
    if (data.version !== 1 || !data.current || !Array.isArray(data.history)) throw new TypeError('图片存档格式无法识别，原存档已保留。');
    return { ...data.current, history: data.history };
}

export function saveMirrorImage(key, record) {
    const previous = loadMirrorImage(key);
    const current = storedRecord(record);
    const history = previous ? [...previous.history, storedRecord(previous)] : [];
    write(key, 'images', { version: 1, current, history });
    return { ...current, history };
}

export function loadMirrorImageDraft(key) { return read(key, 'draft'); }

export function saveMirrorImageDraft(key, draft) {
    if (!draft || typeof draft !== 'object' || Array.isArray(draft)) throw new TypeError('提示词草稿必须是对象。');
    write(key, 'draft', draft);
    return draft;
}
