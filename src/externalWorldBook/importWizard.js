import { readLocalExternalImportFile, readPlainTextWorldBook } from './fileReader.js?rmv=1.5.53-text1';
import { getSettings, updateSettings } from '../settings.js?rmv=1.5.53-image1';
import { listHostWorldBooks, readHostWorldBook } from './hostReader.js?rmv=1.5.53-cn-boundary1';
import { searchNormalizedWorldBookEntries } from './normalize.js?rmv=1.5.53-cn-boundary1';
import {
    EXTERNAL_WORLD_BOOK_SELECTION_MODE,
    createEmptySelection,
    createFilteredSelection,
    createWholeBookSelection,
    entryIdentity,
    toggleEntrySelection,
} from './selectionState.js?rmv=1.5.53-cn-boundary1';
import {
    EXTERNAL_WORLD_BOOK_CLASSIFICATION,
    applyExternalWorldBookBulkClassification,
    createExternalWorldBookClassificationDraft,
    externalWorldBookClassificationCounts,
    updateExternalWorldBookDraftItem,
} from './classifier.js?rmv=1.5.53-text1';
import {
    deleteExternalLibrary,
    listExternalLibraries,
    prepareExternalLibrarySnapshot,
    saveExternalLibrarySnapshot,
    setExternalLibraryEnabled,
    listExternalLibraryEntryChoices,
    setExternalLibraryEntryEnabled,
    hydrateExternalPoolMetadata,
    getExternalPoolHydrationStatus,
    rebuildExternalPoolMetadata,
} from './store.js?rmv=1.5.53-text1';
import { applyAppearanceTheme } from '../settingsAppearance.js?rmv=1.6';

const MODAL_ID = 'rh_external_worldbook_import_modal';
const PAGE_SIZE = 50;
const CLASSIFICATION_PAGE_SIZE = 40;
let state = null;

const CLASSIFICATION_LABELS = Object.freeze({
    [EXTERNAL_WORLD_BOOK_CLASSIFICATION.THEME]: '主题元素',
    [EXTERNAL_WORLD_BOOK_CLASSIFICATION.FORMAT]: '展现形式',
    [EXTERNAL_WORLD_BOOK_CLASSIFICATION.TEXT]: '文本类',
    [EXTERNAL_WORLD_BOOK_CLASSIFICATION.MIXED]: '混合型',
    [EXTERNAL_WORLD_BOOK_CLASSIFICATION.AUXILIARY]: '辅助片段',
    [EXTERNAL_WORLD_BOOK_CLASSIFICATION.IGNORE]: '忽略',
    [EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING]: '待确认',
});

const CONFIDENCE_LABELS = Object.freeze({ high: '高', medium: '中', low: '低' });

function el(tag, options = {}) {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className.replace(/\bmenu_button\b/g, 'rh-external-button').replace(/\btext_pole\b/g, 'rh-external-input');
    if (options.text !== undefined) node.textContent = String(options.text);
    if (options.type) node.type = options.type;
    if (options.placeholder) node.placeholder = options.placeholder;
    if (options.value !== undefined) node.value = String(options.value);
    if (options.id) node.id = options.id;
    if (options.attrs) for (const [key, value] of Object.entries(options.attrs)) node.setAttribute(key, String(value));
    if (options.style) Object.assign(node.style, options.style);
    if (options.style?.width && /^(button|input|select|textarea)$/.test(tag)) node.style.setProperty('--rh-external-control-width', options.style.width);
    return node;
}

function button(text, onClick, style = {}) {
    const node = el('button', { className: 'menu_button', text, type: 'button', style });
    node.addEventListener('click', onClick);
    return node;
}

function setStatus(message, tone = '') {
    if (!state?.status) return;
    state.status.textContent = (tone === 'error' ? '⚠️ ' : '') + String(message || '');
    state.status.dataset.tone = tone;
    state.status.style.color = ''; // Inherit the host contrast in both light and dark themes.
}

function invalidateClassification() {
    if (!state) return;
    state.classificationDraft = [];
    state.classificationPage = 0;
    if (state.classificationPanel) state.classificationPanel.style.display = 'none';
}

function resetBookView() {
    state.currentBook = null;
    state.filteredEntries = [];
    state.page = 0;
    state.selectedIds.clear();
    state.selectionMode = EXTERNAL_WORLD_BOOK_SELECTION_MODE.WHOLE;
    state.entrySearch.value = '';
    state.fullText.checked = false;
    invalidateClassification();
    renderEntries();
    state.entrySection.style.display = 'none';
}

function renderBookList() {
    const query = state.bookSearch.value.trim().toLocaleLowerCase('zh-Hans-CN');
    const rows = state.hostBooks.filter(item => !query || `${item.displayName}\n${item.fileId}`.toLocaleLowerCase('zh-Hans-CN').includes(query));
    state.bookList.replaceChildren();
    if (!rows.length) {
        state.bookList.append(el('div', { text: '没有匹配的酒馆世界书。', style: { opacity: '.65', fontSize: '12px', padding: '8px 2px' } }));
        return;
    }
    for (const item of rows) {
        const row = el('button', {
            className: 'menu_button',
            type: 'button',
            style: { width: '100%', textAlign: 'left', padding: '8px 9px', margin: '3px 0', minHeight: '44px' },
        });
        row.append(el('div', { text: item.displayName, style: { fontWeight: '700', overflowWrap: 'anywhere' } }));
        if (item.fileId !== item.displayName) row.append(el('div', { text: item.fileId, style: { opacity: '.55', fontSize: '10px', overflowWrap: 'anywhere' } }));
        row.addEventListener('click', async () => {
            const owner = state;
            setStatus(`正在读取「${item.displayName}」…`);
            try {
                const book = await readHostWorldBook(item);
                if (state !== owner || !owner.overlay.isConnected) return;
                showNormalizedBook(book);
                setStatus(`已读取 ${book.entryCount} 条；源世界书未被修改。`, 'success');
            } catch (error) {
                if (state !== owner || !owner.overlay.isConnected) return;
                resetBookView();
                setStatus(String(error?.message || error), 'error');
            }
        });
        state.bookList.append(row);
    }
}

function updateSelectionMeta() {
    const book = state?.currentBook;
    if (!book || !state?.entryMeta) return;
    const filteredCount = Array.isArray(state.filteredEntries) ? state.filteredEntries.length : 0;
    const modeLabel = state.selectionMode === EXTERNAL_WORLD_BOOK_SELECTION_MODE.WHOLE ? '整本' : state.selectionMode === EXTERNAL_WORLD_BOOK_SELECTION_MODE.FILTERED ? '筛选' : '手动';
    state.entryMeta.textContent = `${book.sourceName}｜${book.entryCount} 条｜当前匹配 ${filteredCount} 条｜已选 ${state.selectedIds.size} 条｜${modeLabel}`;
}

function selectWholeBook() {
    const book = state?.currentBook;
    if (!book) return;
    const selection = createWholeBookSelection(book);
    state.selectedIds = selection.selectedIds;
    state.selectionMode = selection.mode;
    invalidateClassification();
    updateSelectionMeta();
    renderEntries();
    setStatus(`已选择整本「${book.sourceName}」共 ${book.entryCount} 条。下一阶段将进行分类与保存。`);
}

function selectCurrentFilter() {
    const book = state?.currentBook;
    if (!book) return;
    const matches = searchNormalizedWorldBookEntries(book, state.entrySearch.value, { fullContent: state.fullText.checked });
    const selection = createFilteredSelection(matches);
    state.selectedIds = selection.selectedIds;
    state.selectionMode = selection.mode;
    state.filteredEntries = matches;
    invalidateClassification();
    updateSelectionMeta();
    renderEntries();
    setStatus(`已选择当前筛选结果 ${matches.length} 条。`);
}

function clearSelection() {
    if (!state?.currentBook) return;
    const selection = createEmptySelection();
    state.selectedIds = selection.selectedIds;
    state.selectionMode = selection.mode;
    invalidateClassification();
    updateSelectionMeta();
    renderEntries();
    setStatus('已清空当前选择。');
}

function renderEntries() {
    state.entryList.replaceChildren();
    const book = state.currentBook;
    if (!book) {
        state.entryMeta.textContent = '尚未读取世界书。';
        state.pager.textContent = '';
        return;
    }
    const query = state.entrySearch.value;
    const matches = searchNormalizedWorldBookEntries(book, query, { fullContent: state.fullText.checked });
    state.filteredEntries = matches;
    const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
    state.page = Math.max(0, Math.min(state.page, pageCount - 1));
    const start = state.page * PAGE_SIZE;
    const rows = matches.slice(start, start + PAGE_SIZE);
    updateSelectionMeta();

    if (!rows.length) {
        const fallback = book.entries.every(entry => !entry.primaryKeywords.length && !entry.secondaryKeywords.length)
            ? '没有匹配结果。这本书的条目没有触发关键词时，可尝试按名称或正文搜索。'
            : '没有匹配结果，请尝试其它名称、关键词或正文词。';
        state.entryList.append(el('div', { text: fallback, style: { opacity: '.68', fontSize: '12px', padding: '10px 2px' } }));
    }

    for (const entry of rows) {
        const row = el('label', { style: { display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)', gap: '8px', padding: '9px 4px', borderBottom: '1px solid color-mix(in srgb,currentColor 10%,transparent)', alignItems: 'start' } });
        const check = el('input', { type: 'checkbox' });
        const identity = entryIdentity(entry);
        check.checked = state.selectedIds.has(identity);
        check.addEventListener('change', () => {
            state.selectedIds = toggleEntrySelection(state.selectedIds, identity, check.checked);
            state.selectionMode = EXTERNAL_WORLD_BOOK_SELECTION_MODE.MANUAL;
            invalidateClassification();
            updateSelectionMeta();
        });
        row.append(check);
        const body = el('div');
        body.append(el('div', { text: entry.title, style: { fontWeight: '700', fontSize: '12px', overflowWrap: 'anywhere' } }));
        const keys = [...entry.primaryKeywords, ...entry.secondaryKeywords];
        const details = [];
        if (entry.sourceEntryUid !== null) details.push(`uid ${entry.sourceEntryUid}`);
        if (entry.disabled) details.push('源条目已停用');
        if (entry.constant) details.push('常驻');
        details.push(keys.length ? `关键词 ${keys.slice(0, 5).join(' / ')}` : '无触发关键词');
        body.append(el('div', { text: details.join('｜'), style: { opacity: '.62', fontSize: '10px', lineHeight: '1.4', marginTop: '2px', overflowWrap: 'anywhere' } }));
        if (entry.previewText) body.append(el('div', { text: entry.previewText, style: { marginTop: '5px', opacity: '.82', fontSize: '11px', lineHeight: '1.5', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } }));
        row.append(body);
        state.entryList.append(row);
    }

    state.pager.replaceChildren();
    const prev = button('上一页', () => { state.page -= 1; renderEntries(); }, { minHeight: '44px' });
    const next = button('下一页', () => { state.page += 1; renderEntries(); }, { minHeight: '44px' });
    prev.disabled = state.page <= 0;
    next.disabled = state.page >= pageCount - 1;
    state.pager.append(prev, el('span', { text: `第 ${state.page + 1} / ${pageCount} 页`, style: { opacity: '.68', fontSize: '11px', alignSelf: 'center' } }), next);
}

function showNormalizedBook(book) {
    state.currentBook = book;
    state.page = 0;
    const selection = createWholeBookSelection(book);
    state.selectedIds = selection.selectedIds;
    state.selectionMode = selection.mode;
    state.entrySearch.value = '';
    state.fullText.checked = false;
    invalidateClassification();
    renderEntries();
    state.entrySection.style.display = '';
}

async function loadHostBooks() {
    const owner = state;
    setStatus('正在读取酒馆世界书列表…');
    state.hostBooks = [];
    state.bookList.replaceChildren();
    try {
        const books = await listHostWorldBooks();
        if (state !== owner || !owner.overlay.isConnected) return;
        state.hostBooks = books;
        renderBookList();
        setStatus(`已找到 ${state.hostBooks.length} 本酒馆世界书。`, 'success');
    } catch (error) {
        if (state !== owner || !owner.overlay.isConnected) return;
        setStatus(String(error?.message || error), 'error');
        state.bookList.append(el('div', { text: '酒馆来源不可用时，仍可使用本地 JSON / TXT / MD 或粘贴文字导入。', style: { opacity: '.68', fontSize: '12px', padding: '8px 2px' } }));
    }
}

async function loadLocalFiles(files) {
    const owner = state;
    const list = Array.from(files || []);
    if (!list.length) return;
    if (owner.transferControls.isBusy()) { setStatus('迁移操作正在进行，请完成后再选择本地文件。', 'error'); return; }
    const ownSequence = ++owner.localFileSequence;
    owner.transferControls.clearPending();
    if (list.length > 20 || list.reduce((sum, file) => sum + Number(file?.size || 0), 0) > 32 * 1024 * 1024) {
        setStatus('一次最多读取 20 个文件、合计 32 MiB；请选择较少文件分批确认。', 'error'); return;
    }
    setStatus(`正在读取 ${list.length} 个本地文件…`);
    const books = [];
    const backups = [];
    const failures = [];
    for (const file of list) {
        try {
            const result = await readLocalExternalImportFile(file);
            if (result.kind === 'backup') backups.push({ name: file.name || '迁移文件', backup: result.backup });
            else books.push(result.book);
        }
        catch (error) { failures.push(`${file?.name || '未命名文件'}：${String(error?.message || error)}`); }
        if (state !== owner || !owner.overlay.isConnected || owner.localFileSequence !== ownSequence) return;
    }
    state.localBooks = books;
    state.localBookList.replaceChildren();
    for (const book of books) {
        const row = button(`${book.sourceName}（${book.entryCount} 条）`, () => {
            showNormalizedBook(book);
            setStatus(`已读取本地世界书「${book.sourceName}」。`, 'success');
        }, { width: '100%', textAlign: 'left', minHeight: '44px', margin: '3px 0' });
        state.localBookList.append(row);
    }
    for (const item of backups) {
        state.localBookList.append(button(`${item.name}（整库迁移：${item.backup.libraries.length} 本，点击确认）`, () => {
            if (!owner.transferControls.prepareBackup(item.backup)) setStatus('迁移操作正在进行，请完成后再选择下一份文件。', 'error');
        }, { width: '100%', textAlign: 'left', minHeight: '44px', margin: '3px 0' }));
    }
    if (!books.length && !backups.length) state.localBookList.append(el('div', { text: '没有成功读取的本地世界书或迁移文件。', style: { opacity: '.65', fontSize: '12px', padding: '8px 2px' } }));
    if (books.length === 1) showNormalizedBook(books[0]);
    else if (!books.length) resetBookView();
    if (backups.length === 1) owner.transferControls.prepareBackup(backups[0].backup);
    const resultText = `已读取 ${books.length} 个本地世界书${backups.length ? `、${backups.length} 个整库迁移文件；迁移文件须在上方确认后才保存` : ''}。`;
    setStatus(failures.length ? `成功 ${books.length + backups.length} 个；失败 ${failures.length} 个。${failures[0] ? ` ${failures[0]}` : ''}` : resultText, failures.length ? 'error' : 'success');
}

function classificationRowsForView() {
    const draft = Array.isArray(state?.classificationDraft) ? state.classificationDraft : [];
    const mode = state?.classificationFilter?.value || 'review';
    if (mode === 'all') return draft;
    if (mode === 'review') return draft.filter(item => item.classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING || item.requiresReview);
    return draft.filter(item => item.classification === mode);
}

function renderClassification() {
    if (!state?.classificationPanel) return;
    const draft = Array.isArray(state.classificationDraft) ? state.classificationDraft : [];
    const counts = externalWorldBookClassificationCounts(draft);
    state.classificationMeta.textContent = `待保存 ${counts.total} 条｜主题 ${counts.theme}｜展现形式 ${counts.format}｜文本 ${counts.text}｜辅助 ${counts.auxiliary}｜忽略 ${counts.ignore}｜待确认 ${counts.pending}`;
    const rows = classificationRowsForView();
    const pageCount = Math.max(1, Math.ceil(rows.length / CLASSIFICATION_PAGE_SIZE));
    state.classificationPage = Math.max(0, Math.min(state.classificationPage, pageCount - 1));
    const start = state.classificationPage * CLASSIFICATION_PAGE_SIZE;
    const pageRows = rows.slice(start, start + CLASSIFICATION_PAGE_SIZE);
    state.classificationList.replaceChildren();

    if (!pageRows.length) {
        state.classificationList.append(el('div', { text: '当前筛选下没有需要显示的条目。', style: { opacity: '.65', fontSize: '12px', padding: '10px 2px' } }));
    }

    for (const item of pageRows) {
        const row = el('div', { style: { padding: '10px 4px', borderBottom: '1px solid color-mix(in srgb,currentColor 10%,transparent)' } });
        const top = el('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(128px,180px)', gap: '8px', alignItems: 'center' } });
        const label = el('div');
        label.append(el('div', { text: item.localTitle || item.sourceTitle, style: { fontWeight: '700', fontSize: '12px', overflowWrap: 'anywhere' } }));
        label.append(el('div', {
            text: `建议：${CLASSIFICATION_LABELS[item.suggestion] || item.suggestion}｜置信度：${CONFIDENCE_LABELS[item.confidence] || item.confidence}${item.reasons?.length ? `｜${item.reasons[0]}` : ''}`,
            style: { opacity: '.65', fontSize: '10px', marginTop: '2px', lineHeight: '1.4', overflowWrap: 'anywhere' },
        }));
        const select = el('select', { className: 'text_pole', style: { width: '100%', minHeight: '36px', boxSizing: 'border-box' } });
        for (const value of [
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING,
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.THEME,
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.FORMAT,
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.TEXT,
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.AUXILIARY,
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.IGNORE,
        ]) {
            const option = el('option', { text: CLASSIFICATION_LABELS[value], value });
            option.value = value;
            select.append(option);
        }
        select.value = item.classification;
        select.disabled = state.importKind === 'text';
        select.addEventListener('change', () => {
            state.classificationDraft = updateExternalWorldBookDraftItem(state.classificationDraft, item.entryIdentity, { classification: select.value, userConfirmed: true });
            renderClassification();
        });
        top.append(label, select);
        row.append(top);

        if (item.classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING || item.requiresReview) {
            const titleInput = el('input', { className: 'text_pole', type: 'text', value: item.localTitle, placeholder: '本地显示标题', style: { width: '100%', marginTop: '7px', boxSizing: 'border-box' } });
            const summaryInput = el('textarea', { className: 'text_pole', value: item.summary, placeholder: '本地短摘要', style: { width: '100%', marginTop: '6px', minHeight: '58px', resize: 'vertical', boxSizing: 'border-box' } });
            titleInput.addEventListener('change', () => {
                state.classificationDraft = updateExternalWorldBookDraftItem(state.classificationDraft, item.entryIdentity, { localTitle: titleInput.value, userConfirmed: true });
            });
            summaryInput.addEventListener('change', () => {
                state.classificationDraft = updateExternalWorldBookDraftItem(state.classificationDraft, item.entryIdentity, { summary: summaryInput.value, userConfirmed: true });
            });
            row.append(titleInput, summaryInput);
        }
        state.classificationList.append(row);
    }

    state.classificationPager.replaceChildren();
    const prev = button('上一页', () => { state.classificationPage -= 1; renderClassification(); }, { minHeight: '44px' });
    const next = button('下一页', () => { state.classificationPage += 1; renderClassification(); }, { minHeight: '44px' });
    prev.disabled = state.classificationPage <= 0;
    next.disabled = state.classificationPage >= pageCount - 1;
    state.classificationPager.append(prev, el('span', { text: `第 ${state.classificationPage + 1} / ${pageCount} 页`, style: { opacity: '.68', fontSize: '11px', alignSelf: 'center' } }), next);
}

function startClassificationReview() {
    const book = state?.currentBook;
    if (!book) { setStatus('请先读取一本世界书。', 'error'); return; }
    if (!state.selectedIds.size) { setStatus('当前没有选中的条目。', 'error'); return; }
    state.classificationDraft = createExternalWorldBookClassificationDraft(book, state.selectedIds, { importKind: state.importKind });
    state.classificationPage = 0;
    state.classificationFilter.value = state.importKind === 'text' ? 'all' : 'review';
    state.classificationPanel.style.display = '';
    renderClassification();
    setStatus(state.importKind === 'text' ? `已将选中的 ${state.classificationDraft.length} 条全部归为文本类；确认保存后按需启用。` : `已本地分析 ${state.classificationDraft.length} 条；高置信度结果已预填，混合型和不确定项保持待确认。`);
    try { state.classificationPanel.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch {}
}

async function saveClassificationReview() {
    const owner = state;
    const book = state?.currentBook;
    if (!book || !state.classificationDraft?.length) { setStatus('请先进入分类确认。', 'error'); return; }
    try {
        const snapshot = prepareExternalLibrarySnapshot(book, state.classificationDraft, { enabled: false });
        const saved = await saveExternalLibrarySnapshot(snapshot);
        if (state !== owner || !owner.overlay.isConnected) return saved;
        const counts = externalWorldBookClassificationCounts(state.classificationDraft);
        setStatus(`已保存到兔子镜本地库：主题 ${counts.theme}、展现形式 ${counts.format}、文本 ${counts.text}、辅助 ${counts.auxiliary}、待确认 ${counts.pending}。新库默认停用，请按需启用。`, 'success');
        state.showView('manage', { announce: false });
        return saved;
    } catch (error) {
        if (state === owner) setStatus(String(error?.message || error), 'error');
        return null;
    }
}

async function renderSavedLibraries() {
    if (!state?.savedLibrariesList) return;
    const owner = state;
    const renderSequence = ++owner.savedLibrariesSequence;
    state.savedLibrariesList.replaceChildren();
    let libraries;
    let needsRebuild;
    try {
        libraries = await listExternalLibraries();
        await hydrateExternalPoolMetadata();
        needsRebuild = new Set(getExternalPoolHydrationStatus().metadataRebuildRequired);
    }
    catch (error) {
        if (state !== owner || !owner.overlay.isConnected || renderSequence !== owner.savedLibrariesSequence) return;
        state.savedLibrariesPanel.style.display = '';
        state.savedLibrariesList.append(el('div', { text: String(error?.message || error), style: { color: '#fca5a5', fontSize: '11px', padding: '8px 2px' } }));
        return;
    }
    if (state !== owner || !owner.overlay.isConnected || renderSequence !== owner.savedLibrariesSequence) return;
    state.savedLibrariesPanel.style.display = '';
    if (!libraries.length) {
        state.savedLibrariesList.append(el('div', { text: '还没有保存的外部世界书。', style: { opacity: '.65', fontSize: '11px', padding: '8px 2px' } }));
        return;
    }
    for (const library of libraries) {
        const row = el('div', { style: { padding: '9px 3px', borderBottom: '1px solid color-mix(in srgb,currentColor 10%,transparent)' } });
        row.append(el('div', { text: library.displayName, style: { fontWeight: '700', fontSize: '12px', overflowWrap: 'anywhere' } }));
        row.append(el('div', {
            text: `主题 ${library.themeCount || 0}｜展现 ${library.formatCount || 0}｜文本 ${library.textCount || 0}｜辅助 ${library.auxiliaryCount || 0}｜待确认 ${library.pendingCount || 0}｜${library.enabled ? '已启用' : '已停用'}`,
            style: { opacity: '.65', fontSize: '10px', marginTop: '3px', overflowWrap: 'anywhere' },
        }));
        row.append(el('div', { text: `抽签索引：${needsRebuild.has(library.libraryId) ? '需重建（已保存内容仍在）' : '可用'}`, style: { fontSize: '12px', lineHeight: '1.5', marginTop: '6px' } }));
        const actions = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '7px' } });
        actions.append(
            button('勾选参与抽签的条目', () => openSavedEntryChoices(library), { minHeight: '44px' }),
            button(library.enabled ? '停用' : needsRebuild.has(library.libraryId) ? '重建索引并启用' : '启用', async event => {
                const control = event.currentTarget;
                control.disabled = true;
                try {
                    if (!library.enabled && needsRebuild.has(library.libraryId)) await rebuildExternalPoolMetadata(library.libraryId);
                    await setExternalLibraryEnabled(library.libraryId, !library.enabled);
                    if (state !== owner || !owner.overlay.isConnected) return;
                    await renderSavedLibraries();
                    setStatus(`已${library.enabled ? '停用' : '启用'}「${library.displayName}」。自动档参与外部抽取需打开“外部母本参与抽签”；指定文本面会优先使用已启用的文本类。`);
                } catch (error) { setStatus(String(error?.message || error), 'error'); }
                finally { control.disabled = false; }
            }, { minHeight: '44px' }),
            button('删除本地库', async () => {
                if (typeof globalThis.confirm === 'function' && !globalThis.confirm(`删除兔子镜本地保存的「${library.displayName}」？`)) return;
                try {
                    await deleteExternalLibrary(library.libraryId);
                    if (state === owner && owner.savedEntryLibrary?.libraryId === library.libraryId) {
                        owner.savedEntryLibrary = null;
                        owner.savedEntrySequence++;
                        owner.savedEntriesPanel.replaceChildren();
                        owner.savedEntriesPanel.hidden = true;
                    }
                    await renderSavedLibraries();
                    setStatus(`已删除兔子镜本地保存的「${library.displayName}」。`);
                } catch (error) { setStatus(String(error?.message || error), 'error'); }
            }, { minHeight: '44px' }),
        );
        if (needsRebuild.has(library.libraryId)) {
            const rebuild = button('重建抽签索引', async () => {
                rebuild.disabled = true;
                try {
                    await rebuildExternalPoolMetadata(library.libraryId);
                    await renderSavedLibraries();
                    if (state === owner) setStatus('已重建这个本地库的抽签索引，原文未修改。', 'success');
                } catch (error) {
                    if (state === owner) setStatus(String(error?.message || error), 'error');
                } finally { rebuild.disabled = false; }
            }, { minHeight: '44px' });
            actions.append(rebuild);
            row.append(el('div', { text: '旧库需手动重建一次索引后才能抽签；只读取这个本地库，不联网。', style: { fontSize: '12px', lineHeight: '1.5', marginTop: '6px' } }));
        }
        row.append(actions);
        state.savedLibrariesList.append(row);
    }
}

async function openSavedEntryChoices(library) {
    if (!state?.savedEntriesPanel) return;
    const owner = state;
    owner.savedEntryLibrary = { libraryId: library.libraryId, displayName: library.displayName };
    owner.savedEntryPage = 0;
    owner.savedEntryQuery = '';
    await renderSavedEntryChoices();
    if (state === owner && owner.overlay.isConnected && owner.savedEntryLibrary?.libraryId === library.libraryId) {
        try { owner.savedEntriesPanel.scrollIntoView({ block: 'start' }); owner.savedEntriesPanel.focus({ preventScroll: true }); } catch {}
    }
}

async function renderSavedEntryChoices() {
    const owner = state;
    if (!owner?.savedEntryLibrary || !owner.savedEntriesPanel) return;
    const library = owner.savedEntryLibrary;
    const sequence = ++owner.savedEntrySequence;
    const page = owner.savedEntryPage;
    const panel = owner.savedEntriesPanel;
    const current = () => state === owner && owner.overlay.isConnected && sequence === owner.savedEntrySequence;
    panel.hidden = false;
    panel.replaceChildren();
    panel.append(el('h3', { text: `${library.displayName}：选择参与抽签的条目`, style: { fontSize: '15px', margin: '0 0 8px', overflowWrap: 'anywhere' } }));
    panel.append(el('p', { text: '勾选后立即保存；取消勾选只是不再参与之后的新抽签，不删除原文。换角色卡时可回来手动调整，选择不会随角色自动切换。仍需启用这本库及“外部母本参与抽签”总开关。', style: { fontSize: '13px', lineHeight: '1.6', margin: '0 0 8px' } }));
    const message = el('div', { text: '正在读取这一页条目…', attrs: { role: 'status', 'aria-live': 'polite' }, style: { fontSize: '13px', lineHeight: '1.5', margin: '8px 0' } });
    const searchLabel = el('label', { text: '按条目标题查找', style: { display: 'block', fontSize: '13px' } });
    const search = el('input', { type: 'search', value: owner.savedEntryQuery, className: 'text_pole', style: { width: '100%', minHeight: '44px', boxSizing: 'border-box' } });
    searchLabel.append(search);
    const filter = () => { owner.savedEntryQuery = search.value.trim().slice(0, 200); owner.savedEntryPage = 0; renderSavedEntryChoices(); };
    const actions = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' } });
    actions.append(button('查找条目', filter, { minHeight: '44px' }), button('收起条目选择', () => {
        owner.savedEntrySequence++;
        owner.savedEntryLibrary = null;
        panel.replaceChildren();
        panel.hidden = true;
    }, { minHeight: '44px' }));
    search.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); filter(); } });
    panel.append(searchLabel, actions, message);
    try {
        const result = await listExternalLibraryEntryChoices(library.libraryId, { offset: page * PAGE_SIZE, pageSize: PAGE_SIZE, query: owner.savedEntryQuery });
        if (!current()) return;
        message.textContent = result.choices.length ? `第 ${page + 1} 页，本页 ${result.choices.length} 条。勾选状态已从本设备保存记录读取。` : '没有符合条件的条目。';
        for (const choice of result.choices) {
            const label = el('label', { style: { display: 'flex', alignItems: 'center', gap: '10px', minHeight: '44px', padding: '7px 0', borderBottom: '1px solid color-mix(in srgb,currentColor 12%,transparent)', overflowWrap: 'anywhere' } });
            const checkbox = el('input', { type: 'checkbox', attrs: { 'data-rh-external-entry-id': choice.externalId }, style: { flex: '0 0 auto' } });
            checkbox.checked = choice.enabled && choice.selectable;
            checkbox.disabled = !choice.selectable;
            const text = el('span', { text: `${choice.title}（${CLASSIFICATION_LABELS[choice.classification] || '未确认'}${choice.selectable ? '' : '，不参与独立抽签'}）`, style: { minWidth: '0', fontSize: '14px' } });
            label.append(checkbox, text);
            checkbox.addEventListener('change', async () => {
                const before = choice.enabled;
                const desired = checkbox.checked;
                checkbox.disabled = true;
                checkbox.setAttribute('aria-busy', 'true');
                message.textContent = `正在保存「${choice.title}」…`;
                try {
                    const saved = await setExternalLibraryEntryEnabled(library.libraryId, choice.externalId, desired);
                    if (!current()) return;
                    choice.enabled = saved.enabled;
                    checkbox.checked = saved.enabled;
                    message.textContent = `已保存：${saved.enabled ? '勾选' : '取消勾选'}「${choice.title}」。原文未删除；之后的新抽签使用新选择。`;
                } catch (error) {
                    if (!current()) return;
                    checkbox.checked = before;
                    message.textContent = String(error?.message || '保存失败，已恢复原勾选；请重试。');
                } finally {
                    if (current()) { checkbox.disabled = false; checkbox.removeAttribute('aria-busy'); }
                }
            });
            panel.append(label);
        }
        const pager = el('div', { style: { display: 'flex', gap: '8px', marginTop: '10px' } });
        const previous = button('上一页条目', () => { owner.savedEntryPage = page - 1; renderSavedEntryChoices(); }, { minHeight: '44px' });
        const next = button('下一页条目', () => { owner.savedEntryPage = page + 1; renderSavedEntryChoices(); }, { minHeight: '44px' });
        previous.disabled = page === 0;
        next.disabled = !result.hasNext;
        pager.append(previous, next);
        panel.append(pager);
    } catch (error) {
        if (current()) message.textContent = String(error?.message || '读取失败，请重新打开条目选择。');
    }
}

function createExternalRandomControls() {
    const box = el('fieldset', { style: { border: '1px solid color-mix(in srgb,currentColor 22%,transparent)', borderRadius: '12px', padding: '10px', margin: '0 0 14px', minWidth: '0' } });
    box.append(el('legend', { text: '生成与抽签', style: { fontSize: '13px', fontWeight: '700' } }));
    const label = el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', minHeight: '44px', fontSize: '14px' } });
    const toggle = el('input', { id: 'rh_external_random_enabled', type: 'checkbox' });
    label.append(toggle, document.createTextNode('外部母本参与抽签'));
    const modeLabel = el('label', { text: '抽签偏好', attrs: { for: 'rh_external_random_mix' }, style: { display: 'block', fontSize: '13px', margin: '6px 0' } });
    const mode = el('select', { id: 'rh_external_random_mix', className: 'text_pole', style: { width: '100%', minHeight: '44px', boxSizing: 'border-box' } });
    for (const [value, text] of [['builtin-preferred', '内置优先（推荐）'], ['balanced', '内置与外部均衡'], ['external-preferred', '外部优先'], ['external-only', '仅外部（可用池不足时按现有规则回退）']]) {
        mode.append(el('option', { value, text }));
    }
    const status = el('div', { attrs: { role: 'status' }, style: { fontSize: '12px', lineHeight: '1.5', marginTop: '8px', overflowWrap: 'anywhere' } });
    const render = () => {
        const settings = getSettings();
        toggle.checked = settings.externalWorldBookRandomEnabled === true && settings.externalWorldBookMixMode !== 'builtin-only';
        mode.value = settings.externalWorldBookMixMode === 'builtin-only' ? 'builtin-preferred' : settings.externalWorldBookMixMode;
        mode.disabled = !toggle.checked;
        status.textContent = toggle.checked
            ? '已开启。请另外启用下方需要的本地库；仅发送本轮抽中的条目。'
            : '已关闭，新抽签不使用外部母本；手动重说旧面仍保留原抽签。开启也不会自动启用本地库。';
    };
    toggle.addEventListener('change', () => {
        updateSettings({ externalWorldBookRandomEnabled: toggle.checked, ...(toggle.checked ? { externalWorldBookMixMode: mode.value || 'builtin-preferred' } : {}) });
        render();
    });
    mode.addEventListener('change', () => { updateSettings({ externalWorldBookMixMode: mode.value }); render(); });
    box.append(label, modeLabel, mode, status);
    render();
    return box;
}

function createLibraryTransferControls() {
    const panel = el('section', { id: 'rh_external_transfer_panel', style: { margin: '12px 0 14px', minWidth: '0' } });
    panel.append(el('h3', { text: '换设备：把已导入的母本库一起带走', style: { margin: '0 0 8px', fontSize: '16px' } }));
    panel.append(el('p', { text: '旧设备导出一个文件 → 把文件发到新设备 → 在新设备导入。不用逐本重导，也不会自动上传到服务器。', style: { fontSize: '14px', lineHeight: '1.6', margin: '4px 0 12px', overflowWrap: 'anywhere' } }));
    const message = el('div', { id: 'rh_external_transfer_status', attrs: { role: 'status', 'aria-live': 'polite', tabindex: '-1' }, style: { fontSize: '12px', lineHeight: '1.5', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginTop: '8px' } });
    const file = el('input', { id: 'rh_external_transfer_file', type: 'file', className: 'text_pole', attrs: { accept: '.json,application/json', 'aria-describedby': message.id }, style: { width: '100%' } });
    let pending = null, busy = false, sequence = 0;
    const current = owner => state === owner && owner?.overlay.isConnected && panel.isConnected;
    const feedback = (text, error = false) => { message.textContent = text; if (error) { try { message.focus({ preventScroll: true }); } catch {} } };
    const lock = value => { busy = value; exportButton.disabled = value; file.disabled = value; importButton.disabled = value || !pending; };
    const clearPending = () => { sequence++; pending = null; file.value = ''; importButton.disabled = true; message.textContent = ''; };
    const prepareBackup = backup => {
        if (busy) return false;
        clearPending(); pending = backup;
        state?.showView('transfer', { announce: false });
        feedback(`校验通过：${backup.libraries.length} 本库、${backup.libraries.reduce((sum, item) => sum + item.entries.length, 0)} 条。尚未保存，请点击“确认导入迁移文件”。`);
        lock(false);
        try { message.scrollIntoView({ block: 'center' }); } catch {}
        return true;
    };
    const exportButton = button('一键导出全部外部库', async () => {
        if (busy) return;
        const owner = state; lock(true); feedback('正在读取本设备已导入的库并生成迁移文件……');
        try {
            const module = await import('./backup.js?rmv=1.5.53-text1');
            if (!current(owner)) return;
            const result = await module.exportExternalLibraryBackup();
            if (!current(owner)) return;
            const url = URL.createObjectURL(new Blob([result.text], { type: 'application/json;charset=utf-8' }));
            const link = el('a', { attrs: { href: url, download: `RabbitMirror-external-libraries-${new Date().toISOString().slice(0, 10)}.json` } });
            panel.append(link);
            try { link.click(); } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000); }
            feedback(`已准备 ${result.libraryCount} 本库、${result.entryCount} 条。请确认浏览器已保存迁移文件，再到另一设备导入；原数据未修改。`);
        } catch (error) { if (current(owner)) feedback(String(error?.message || '导出失败，原数据未修改。'), true); }
        finally { if (current(owner)) lock(false); }
    }, { minHeight: '44px', width: '100%', marginBottom: '8px' });
    const importButton = button('确认导入迁移文件', async () => {
        if (busy || !pending) return;
        if (!globalThis.confirm('导入这份备份里的外部库？目标已有同编号库会保留并跳过，其余库保留备份的分类和启用状态。不删除或覆盖旧库，不改变抽签总开关。')) return;
        const owner = state, backup = pending; lock(true); feedback('正在原子保存迁移数据；请暂时保留此页面……');
        try {
            const module = await import('./backup.js?rmv=1.5.53-text1');
            if (!current(owner)) return;
            const result = await module.importExternalLibraryBackup(backup);
            if (!current(owner)) return;
            pending = null; file.value = '';
            feedback(`迁移完成：新增 ${result.importedLibraries} 本、${result.importedEntries} 条；保留本设备已有库并跳过 ${result.skippedLibraries} 本。未修改抽签总开关。`);
            await renderSavedLibraries();
        } catch (error) { if (current(owner)) feedback(String(error?.message || '迁移未完成；请保留原文件，现有库未删除。'), true); }
        finally { if (current(owner)) lock(false); }
    }, { minHeight: '44px', width: '100%', marginTop: '8px' });
    importButton.disabled = true;
    file.addEventListener('change', async () => {
        if (busy) return;
        if (state) state.localFileSequence++;
        pending = null; importButton.disabled = true;
        const selected = file.files?.[0]; if (!selected) return;
        const owner = state, ownSequence = ++sequence; lock(true); feedback('正在校验迁移文件，尚未写入……');
        try {
            const module = await import('./backup.js?rmv=1.5.53-text1');
            if (!current(owner)) return;
            const backup = await module.readExternalLibraryBackupFile(selected);
            if (!current(owner) || sequence !== ownSequence) return;
            pending = backup;
            feedback(`校验通过：${backup.libraries.length} 本库、${backup.libraries.reduce((sum, item) => sum + item.entries.length, 0)} 条。尚未保存，请点击“确认导入迁移文件”。`);
        } catch (error) { if (current(owner) && sequence === ownSequence) { file.value = ''; feedback(String(error?.message || '迁移文件无法读取。'), true); } }
        finally { if (current(owner) && sequence === ownSequence) lock(false); }
    });
    panel.append(el('h4', { text: '① 旧设备：导出整库', style: { margin: '12px 0 8px', fontSize: '14px' } }), exportButton,
        el('h4', { text: '② 新设备：导入刚才的文件', style: { margin: '16px 0 8px', fontSize: '14px' } }),
        el('label', { text: '选择 RabbitMirror-external-libraries 开头的 JSON 文件', attrs: { for: file.id }, style: { display: 'block', margin: '8px 0', fontSize: '13px', overflowWrap: 'anywhere' } }), file, importButton, message);
    panel.append(el('p', { text: '文件包含母本原文、分类和启用状态，请妥善保管；不含聊天、API Key 或酒馆设置。已有同编号库会保留并跳过，不删除或覆盖；抽签总开关不变。最多 32 MiB、1000 本、25000 条。', style: { fontSize: '12px', lineHeight: '1.6', margin: '12px 0 0', overflowWrap: 'anywhere' } }));
    return { panel, prepareBackup, clearPending, isBusy: () => busy, dispose: () => { sequence++; pending = null; file.value = ''; } };
}

function bindImportViewport(overlay) {
    // The visual viewport can pan/shrink independently of vh/dvh on mobile.
    // Only this open wizard subscribes; no observers, chat scans or polling.
    const viewport = globalThis.visualViewport;
    let frame = 0;
    let disposed = false;
    const sync = () => {
        frame = 0;
        if (disposed || !overlay.isConnected) return;
        const width = Math.max(1, Number(viewport?.width) || window.innerWidth);
        const height = Math.max(1, Number(viewport?.height) || window.innerHeight);
        const values = { vw: width, vh: height, top: Math.max(0, Number(viewport?.offsetTop) || 0), left: Math.max(0, Number(viewport?.offsetLeft) || 0) };
        for (const [name, number] of Object.entries(values)) {
            const property = `--rh-external-${name}`;
            const value = `${Math.round(number * 100) / 100}px`;
            if (overlay.style.getPropertyValue(property) !== value) overlay.style.setProperty(property, value);
        }
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(sync); };
    viewport?.addEventListener('resize', schedule, { passive: true });
    viewport?.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    sync();
    return () => {
        disposed = true;
        if (frame) cancelAnimationFrame(frame);
        viewport?.removeEventListener('resize', schedule);
        viewport?.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
    };
}

function createModal(initialView = 'plain', importKind = '') {
    state?.dismiss?.(false);
    document.getElementById(MODAL_ID)?.remove();
    const returnFocus = document.activeElement;
    // The settings dialog is already in the browser top layer. A body-level div
    // remains inert behind it regardless of z-index; transformed host bodies also
    // turn fixed divs into document-positioned content. Own a real nested dialog.
    const overlay = el('dialog', {
        id: MODAL_ID,
        attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': '外部世界书母本导入' },
        style: { position: 'fixed', inset: '0', zIndex: '2147483010', background: 'rgba(8,10,14,.68)', padding: 'max(12px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    });
    // Host themes may style .menu_button as a narrow icon, even with !important.
    // Own names and scoped control geometry keep this wizard usable in cloud ST.
    overlay.append(el('style', { text: `
#${MODAL_ID}, #${MODAL_ID} * { box-sizing: border-box; writing-mode: horizontal-tb; }
#${MODAL_ID} {
 position: fixed !important; inset: var(--rh-external-top,0px) auto auto var(--rh-external-left,0px) !important; margin: 0 !important;
 width: var(--rh-external-vw,100%) !important; max-width: none !important; min-width: 0 !important;
 height: var(--rh-external-vh,100vh) !important; max-height: none !important; min-height: 0 !important;
 transform: none !important; translate: none !important; scale: none !important;
 border: 0 !important; overflow: hidden !important; contain: none !important;
 display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important; justify-content: center !important;
 padding: max(12px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left)) !important;
}
#${MODAL_ID}::backdrop { background: transparent; }
#${MODAL_ID} > .rh-external-card {
 position: relative !important; inset: auto !important; transform: none !important; margin: 0 !important;
 min-width: 0 !important; min-height: 0 !important; max-width: 100% !important;
 max-height: calc(var(--rh-external-vh,100vh) - max(12px,env(safe-area-inset-top)) - max(12px,env(safe-area-inset-bottom))) !important;
 max-height: min(860px,calc(var(--rh-external-vh,100vh) - max(12px,env(safe-area-inset-top)) - max(12px,env(safe-area-inset-bottom)))) !important;
 display: flex !important; flex-direction: column !important;
}
#${MODAL_ID} .rh-external-header, #${MODAL_ID} .rh-external-status { flex: 0 0 auto; }
#${MODAL_ID} .rh-external-status { max-height: 4.5em; overflow-y: auto; overflow-wrap: anywhere; }
#${MODAL_ID} .rh-external-scroll { flex: 1 1 auto !important; min-height: 0 !important; overflow-y: auto !important; overflow-x: hidden; }
#${MODAL_ID} .rh-external-button, #${MODAL_ID} .rh-external-input {
 position: static !important; float: none !important; transform: none !important;
 width: var(--rh-external-control-width,100%) !important; min-width: 0 !important; max-width: 100% !important;
 height: auto !important; min-height: 44px !important; font: inherit; font-size: 14px !important;
 line-height: 1.5 !important; letter-spacing: normal !important; writing-mode: horizontal-tb !important;
 color: inherit; background: var(--SmartThemeBlurTintColor,#fff); border: 1px solid var(--SmartThemeBorderColor,#b8c5d6);
 border-radius: 12px; padding: 8px; margin: 0; opacity: 1; text-shadow: none;
}
#${MODAL_ID} .rh-external-button { display: block !important; white-space: normal !important; word-break: normal !important; overflow-wrap: break-word !important; cursor: pointer; touch-action: manipulation; }
#${MODAL_ID} .rh-external-button:disabled, #${MODAL_ID} .rh-external-input:disabled { opacity: .55; cursor: default; }
#${MODAL_ID} .rh-external-button:focus-visible, #${MODAL_ID} .rh-external-input:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
#${MODAL_ID} .rh-external-button:active:not(:disabled) { filter: brightness(.92); }
#${MODAL_ID} .rh-external-button[aria-pressed="true"] { border-width: 2px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
#${MODAL_ID} #rh_external_local_file { display: none !important; }
#${MODAL_ID} #rh_external_choose_file { min-height: 44px !important; border-width: 2px; font-weight: 700; }
@media (pointer: coarse) { #${MODAL_ID} .rh-external-input { font-size: 16px !important; } }
` }));
    applyAppearanceTheme(overlay);
    const card = el('div', { className: 'rh-external-card', style: { width: 'min(820px,100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--SmartThemeBlurTintColor,#fff)', color: 'var(--SmartThemeBodyColor,#34495d)', border: '1px solid var(--SmartThemeBorderColor,#cfdae5)', borderRadius: '18px', boxShadow: '0 22px 70px rgba(0,0,0,.42)' } });
    const header = el('div', { className: 'rh-external-header', style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 44px', gap: '8px', alignItems: 'center', padding: '11px 12px', borderBottom: '1px solid color-mix(in srgb,currentColor 12%,transparent)' } });
    const title = el('div');
    title.append(el('div', { text: '母本库：导入与备份', style: { fontWeight: '700', fontSize: '16px' } }));
    title.append(el('div', { text: '导入四步：选择类别 → 选择来源 → 读取并确认 → 保存后启用。备份与管理在下方单独区域。', style: { fontSize: '12px', lineHeight: '1.5', marginTop: '2px' } }));
    let disposeViewport = () => {};
    const dismiss = (restoreFocus = true) => {
        clearTimeout(debounceId);
        disposeViewport();
        transferControls.dispose();
        plainInput.value = '';
        if (overlay.open && typeof overlay.close === 'function') overlay.close();
        overlay.remove();
        if (state?.overlay === overlay) state = null;
        if (restoreFocus && returnFocus?.isConnected) {
            try { returnFocus.focus({ preventScroll: true }); } catch {}
        }
    };
    const closeButton = button('×', () => dismiss(), { width: '44px', minWidth: '44px', height: '44px', padding: '0', fontSize: '20px' });
    closeButton.setAttribute('aria-label', '关闭外部世界书母本');
    header.append(title, closeButton);
    const scroll = el('div', { className: 'rh-external-scroll', style: { padding: '12px', minHeight: '0', minWidth: '0', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' } });
    scroll.append(el('p', { className: 'rh-external-import-notice', text: '不会进入兔子镜内置，感谢各位制作小剧场的老师，请征求作者同意后使用。', style: { margin: '0 0 12px', fontSize: '12px', lineHeight: '1.6', overflowWrap: 'anywhere' } }));
    const transferControls = createLibraryTransferControls();
    // 导入来源与备份/管理分两组：同组按钮共用等高网格行，避免长文案把同排按钮撑成两种高度。
    const navGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', gridAutoRows: '1fr' };
    const sourceButtons = el('nav', { attrs: { 'aria-label': '选择来源' }, style: { ...navGridStyle } });
    const utilityButtons = el('nav', { attrs: { 'aria-label': '备份与管理' }, style: { ...navGridStyle, marginTop: '8px' } });
    const hostPane = el('section', { id: 'rh_external_host_panel', style: { marginTop: '12px' } });
    const filePane = el('section', { id: 'rh_external_file_panel', style: { marginTop: '12px', display: 'none' } });
    const plainPane = el('section', { id: 'rh_external_plain_panel', style: { marginTop: '12px', display: 'none' } });
    const managePane = el('section', { id: 'rh_external_manage_panel', style: { marginTop: '12px', display: 'none' } });
    const entrySection = el('section', { id: 'rh_external_entry_panel', style: { display: 'none' } });
    const sourceWorkflow = el('div');
    const navButtons = new Map();
    const showView = (which, { announce = true } = {}) => {
        if (!navButtons.has(which)) which = 'plain';
        overlay.dataset.activeView = which;
        const isSource = ['host', 'file', 'plain'].includes(which);
        hostPane.style.display = which === 'host' ? '' : 'none';
        filePane.style.display = which === 'file' ? '' : 'none';
        plainPane.style.display = which === 'plain' ? '' : 'none';
        transferControls.panel.style.display = which === 'transfer' ? '' : 'none';
        managePane.style.display = which === 'manage' ? '' : 'none';
        sourceWorkflow.style.display = isSource ? '' : 'none';
        for (const [view, control] of navButtons) control.setAttribute('aria-pressed', String(view === which));
        if (which === 'host') loadHostBooks();
        if (which === 'manage') renderSavedLibraries();
        if (which === 'plain') { try { plainInput.focus({ preventScroll: true }); } catch {} }
        if (announce && which !== 'host') setStatus(which === 'transfer' ? '旧设备导出 → 把文件发到新设备 → 新设备选文件并确认导入。' : which === 'manage' ? '先启用需要的库。自动档使用外部内容需打开“外部母本参与抽签”；指定文本面优先使用已启用的文本类。' : '先读取内容 → 确认分类并保存 → 启用母本库。读取和切换页面不会保存。');
    };
    for (const [view, label, panelId, group] of [
        ['plain', '粘贴文字', plainPane.id, 'source'],
        ['file', '导入文件（TXT / MD / JSON）', filePane.id, 'source'],
        ['host', '从酒馆世界书导入', hostPane.id, 'source'],
        ['transfer', '换设备：导出／导入整库', transferControls.panel.id, 'utility'],
        ['manage', '管理母本库', managePane.id, 'utility'],
    ]) {
        const control = button(label, () => showView(view), { minHeight: '44px' });
        control.setAttribute('aria-controls', panelId);
        navButtons.set(view, control);
        (group === 'source' ? sourceButtons : utilityButtons).append(control);
    }
    const importPurpose = el('select', { id: 'rh_external_import_kind', className: 'text_pole', attrs: { 'aria-label': '导入类别' } });
    for (const [value, label] of [['', '普通母本：按主题／展现形式等分类'], ['text', '文本类：导入的条目全部用于长文本']]) importPurpose.append(el('option', { value, text: label }));
    importPurpose.value = importKind === 'text' ? 'text' : '';
    importPurpose.addEventListener('change', () => {
        if (state?.overlay !== overlay) return;
        state.importKind = importPurpose.value === 'text' ? 'text' : '';
        state.classificationDraft = [];
        state.classificationPanel.style.display = 'none';
        setStatus(state.importKind === 'text' ? '文本类导入：选择来源并读取，选中的条目会全部归为文本；确认保存后按需启用。' : '普通母本导入：读取后确认主题、展现形式等分类。');
    });
    scroll.append(el('label', { text: '① 选择类别', attrs: { for: importPurpose.id } }), importPurpose,
        el('p', { text: '文本类独立于展现形式，用于生成长文本；可使用 HTML 排版，不要求内部交互。整库迁移保留备份原分类。', style: { fontSize: '12px', lineHeight: '1.5' } }),
        el('div', { text: '② 选择来源', style: { fontSize: '13px', fontWeight: '700', margin: '10px 0 6px' } }), sourceButtons,
        el('div', { text: '备份与管理（单独使用，不属于导入流程）', style: { fontSize: '13px', fontWeight: '700', margin: '14px 0 6px' } }), utilityButtons);

    const bookSearch = el('input', { className: 'text_pole', type: 'search', placeholder: '搜索世界书名称', style: { width: '100%', marginTop: '8px', boxSizing: 'border-box' } });
    const bookList = el('div', { style: { maxHeight: '210px', overflowY: 'auto', marginTop: '6px', padding: '4px 2px', WebkitOverflowScrolling: 'touch' } });
    bookSearch.addEventListener('input', renderBookList);
    hostPane.append(el('h3', { text: '从酒馆已有世界书导入', style: { fontSize: '16px', margin: '0 0 8px' } }), bookSearch, bookList);

    // The host may hide native file inputs. Own an explicit, visible action;
    // keep click synchronous so mobile file pickers retain the user gesture.
    const fileInput = el('input', { id: 'rh_external_local_file', type: 'file', attrs: { accept: '.json,.txt,.md,application/json,text/json,text/plain,text/markdown,application/octet-stream', multiple: 'multiple', tabindex: '-1', 'aria-label': '导入母本文件' } });
    const chooseFile = button('选择 TXT / MD / JSON 文件', () => {
        if (state?.overlay === overlay && overlay.isConnected) fileInput.click();
    });
    chooseFile.id = 'rh_external_choose_file';
    chooseFile.setAttribute('aria-describedby', 'rh_external_file_help rh_external_file_selection');
    const fileSelection = el('div', { id: 'rh_external_file_selection', attrs: { role: 'status', 'aria-live': 'polite' }, text: '尚未选择文件。支持多选。', style: { fontSize: '13px', lineHeight: '1.5', marginTop: '8px', overflowWrap: 'anywhere' } });
    const localBookList = el('div', { style: { maxHeight: '210px', overflowY: 'auto', marginTop: '6px', padding: '4px 2px', WebkitOverflowScrolling: 'touch' } });
    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files || []);
        fileInput.value = ''; // Selecting the same file again must fire change.
        if (state?.overlay !== overlay || !overlay.isConnected) return;
        if (!files.length) return; // Cancelling does not clear the previous read.
        fileSelection.textContent = `已选择 ${files.length} 个文件：${files.slice(0, 3).map(file => file.name).join('、')}${files.length > 3 ? '…' : ''}`;
        loadLocalFiles(files);
    });
    filePane.append(el('h3', { text: '导入文件：不必先转成 JSON', style: { fontSize: '16px', margin: '0 0 8px' } }),
        chooseFile, fileInput, fileSelection,
        el('div', { id: 'rh_external_file_help', text: '点击上方按钮选择文件。TXT / MD 每个文件先作为一个条目，JSON 世界书保留原条目。整库备份会直接进入导入确认；读取文件不会直接保存。普通文件最多 8 MiB、文字最多 100 万字符，整库备份最多 32 MiB。', style: { fontSize: '12px', lineHeight: '1.6', marginTop: '8px' } }), localBookList);
    const plainTitle = el('input', { id: 'rh_external_plain_title', type: 'text', className: 'text_pole', attrs: { maxlength: '1000' }, value: '我的小剧场文字', style: { width: '100%' } });
    // Reject oversized input as a whole in the reader; native maxlength would
    // silently truncate a paste before validation could detect the missing tail.
    const plainInput = el('textarea', { id: 'rh_external_plain_text', className: 'text_pole', attrs: { 'aria-describedby': 'rh_external_plain_status' }, style: { width: '100%', minHeight: '140px', resize: 'vertical', whiteSpace: 'pre-wrap' } });
    const plainStatus = el('div', { id: 'rh_external_plain_status', attrs: { role: 'status' }, text: '一份文字先作为一个条目，不自动按段拆开；最多 100 万字符。不会运行或预览其中的 HTML。', style: { fontSize: '12px', lineHeight: '1.5', margin: '8px 0' } });
    const preparePlain = button('读取文字并进入分类确认', () => {
        try {
            const book = readPlainTextWorldBook(plainInput.value, { name: plainTitle.value });
            showNormalizedBook(book); startClassificationReview();
            plainInput.value = ''; plainInput.removeAttribute('aria-invalid');
            plainStatus.textContent = '已读取文字，请在下方确认分类并保存；新库默认停用。';
        } catch (error) {
            plainInput.setAttribute('aria-invalid', 'true'); plainStatus.textContent = String(error?.message || '文字无法读取。'); plainInput.focus();
        }
    }, { minHeight: '44px', width: '100%' });
    plainPane.append(el('h3', { text: '粘贴文字：直接写小剧场想法', style: { fontSize: '16px', margin: '0 0 8px' } }),
        el('div', { text: '不用 JSON，不用写 HTML。粘贴玩法或文字后，下一步选它是“演什么”的主题，还是“怎么玩”的展现形式。', style: { fontSize: '13px', lineHeight: '1.6' } }),
        el('label', { text: '给这份母本起个名字', attrs: { for: plainTitle.id }, style: { display: 'block', margin: '8px 0' } }), plainTitle,
        el('label', { text: '小剧场文字或玩法想法', attrs: { for: plainInput.id }, style: { display: 'block', margin: '8px 0' } }), plainInput, plainStatus, preparePlain);
    sourceWorkflow.append(hostPane, filePane, plainPane);
    scroll.append(sourceWorkflow, transferControls.panel, managePane);

    const divider = el('div', { style: { borderTop: '1px solid color-mix(in srgb,currentColor 12%,transparent)', margin: '12px 0 9px' } });
    const entrySearch = el('input', { className: 'text_pole', type: 'search', placeholder: '搜索条目名称、关键词、正文或 uid', style: { width: '100%', boxSizing: 'border-box' } });
    const fullTextLabel = el('label', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '7px', fontSize: '11px', opacity: '.78' } });
    const fullText = el('input', { type: 'checkbox' });
    fullTextLabel.append(fullText, document.createTextNode('搜索完整正文（大型世界书可能更慢）'));
    const entryMeta = el('div', { text: '尚未读取世界书。', style: { fontSize: '11px', opacity: '.66', margin: '7px 0' } });
    const selectionActions = el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '7px', margin: '4px 0 8px' } });
    selectionActions.append(
        button('全选整本', selectWholeBook, { minHeight: '44px', fontWeight: '700' }),
        button('只选筛选结果', selectCurrentFilter, { minHeight: '44px' }),
        button('清空选择', clearSelection, { minHeight: '44px' }),
    );
    const selectionHint = el('div', { text: '读取世界书后默认整本选中；只需要部分内容时可搜索并点击“只选筛选结果”，也可手动取消个别条目。', style: { fontSize: '10px', opacity: '.62', lineHeight: '1.45', marginBottom: '6px' } });
    const entryList = el('div', { style: { minHeight: '120px', maxHeight: '360px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' } });
    const pager = el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' } });
    let debounceId = 0;
    entrySearch.addEventListener('input', () => { clearTimeout(debounceId); debounceId = setTimeout(() => { state.page = 0; renderEntries(); }, 150); });
    fullText.addEventListener('change', () => { state.page = 0; renderEntries(); });

    const advanceActions = el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '7px', marginTop: '8px' } });
    advanceActions.append(
        button('进入分类确认', startClassificationReview, { minHeight: '44px', fontWeight: '700' }),
    );
    entrySection.append(divider, entrySearch, fullTextLabel, entryMeta, selectionActions, selectionHint, entryList, pager, advanceActions);
    sourceWorkflow.append(entrySection);

    const classificationPanel = el('div', { style: { display: 'none', borderTop: '1px solid color-mix(in srgb,currentColor 12%,transparent)', marginTop: '14px', paddingTop: '10px' } });
    classificationPanel.append(el('div', { text: '分类确认', style: { fontWeight: '700', fontSize: '13px' } }));
    classificationPanel.append(el('div', { text: '明确分类标记已自动识别。可一键采用其余建议，或将待确认项批量归类；不覆盖你手动选择的分类。新库保存后默认停用，不会自动参与抽签。', style: { opacity: '.8', fontSize: '12px', lineHeight: '1.5', marginTop: '3px' } }));
    const bulkActions = el('div', { style: { display: 'grid', gap: '8px', margin: '8px 0' } });
    const applyBulk = mode => {
        state.classificationDraft = applyExternalWorldBookBulkClassification(state.classificationDraft, mode);
        state.classificationPage = 0;
        renderClassification();
        const remaining = externalWorldBookClassificationCounts(state.classificationDraft).pending;
        setStatus(`已应用分类，剩余 ${remaining} 条待确认；手动选择未更改。`);
    };
    const bulkCategory = el('select', { id: 'rh_external_bulk_category', className: 'text_pole', attrs: { 'aria-label': '待确认项批量分类' } });
    for (const value of ['format', 'theme', 'text', 'auxiliary', 'ignore']) bulkCategory.append(el('option', { value, text: `待确认项全部归为：${CLASSIFICATION_LABELS[value]}` }));
    bulkActions.append(button('全部一键分类（按线索建议）', () => applyBulk('suggested')),
        bulkCategory, button('应用待确认项批量分类', () => applyBulk(bulkCategory.value)));
    const classificationMeta = el('div', { style: { fontSize: '11px', opacity: '.72', margin: '7px 0' } });
    const classificationFilter = el('select', { className: 'text_pole', style: { width: '100%', minHeight: '36px', boxSizing: 'border-box' } });
    for (const [value, label] of [['review', '只看需确认'], ['all', '显示全部'], ['theme', '主题元素'], ['format', '展现形式'], ['text', '文本类'], ['auxiliary', '辅助片段'], ['ignore', '忽略'], ['pending', '待确认']]) {
        const option = el('option', { text: label, value }); option.value = value; classificationFilter.append(option);
    }
    classificationFilter.value = 'review';
    classificationFilter.addEventListener('change', () => { state.classificationPage = 0; renderClassification(); });
    const classificationList = el('div', { style: { maxHeight: '400px', overflowY: 'auto', WebkitOverflowScrolling: 'touch', marginTop: '6px' } });
    const classificationPager = el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' } });
    const saveButton = button('确认分类并保存到本地', saveClassificationReview, { width: '100%', minHeight: '44px', marginTop: '8px', fontWeight: '700' });
    classificationPanel.append(classificationMeta, bulkActions, classificationFilter, classificationList, classificationPager, saveButton);
    sourceWorkflow.append(classificationPanel);

    const savedLibrariesPanel = el('div', { style: { display: 'none', borderTop: '1px solid color-mix(in srgb,currentColor 12%,transparent)', marginTop: '14px', paddingTop: '10px' } });
    savedLibrariesPanel.append(el('div', { text: '已保存的外部世界书', style: { fontWeight: '700', fontSize: '13px' } }));
    savedLibrariesPanel.append(el('div', { text: '启用需要的库，再点“勾选参与抽签的条目”选择具体内容。取消勾选不会删除原文；启用本地库不会修改上方总开关。', style: { opacity: '.8', fontSize: '12px', lineHeight: '1.5', marginTop: '3px' } }));
    const savedLibrariesList = el('div', { style: { marginTop: '5px' } });
    savedLibrariesPanel.append(savedLibrariesList);
    const savedEntriesPanel = el('section', { id: 'rh_external_saved_entry_choices', attrs: { tabindex: '-1', 'aria-label': '已导入条目的抽签选择' }, style: { marginTop: '14px', paddingTop: '12px', borderTop: '1px solid color-mix(in srgb,currentColor 18%,transparent)' } });
    savedEntriesPanel.hidden = true;
    managePane.append(createExternalRandomControls(), savedLibrariesPanel, savedEntriesPanel);

    scroll.append(el('div', { text: '跟随与独立 API 均可使用；不会发送整本世界书，也不会按面额外请求。', style: { marginTop: '10px', opacity: '.8', fontSize: '12px', lineHeight: '1.5' } }));

    const status = el('div', { className: 'rh-external-status', text: '请选择来源。', style: { padding: '8px 12px', borderTop: '1px solid color-mix(in srgb,currentColor 12%,transparent)', fontSize: '11px', lineHeight: '1.45', minHeight: '34px', boxSizing: 'border-box' } });
    card.append(header, scroll, status);
    overlay.append(card);
    overlay.addEventListener('click', event => { if (event.target === overlay) dismiss(); });
    overlay.addEventListener('cancel', event => { event.preventDefault(); event.stopPropagation(); dismiss(); });
    overlay.addEventListener('keydown', event => {
        // Do not let the outer settings Escape handler close both layers.
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(); }
    });
    document.body.append(overlay);
    disposeViewport = bindImportViewport(overlay);

    state = {
        importKind: importKind === 'text' ? 'text' : '',
        overlay, dismiss, status, showView, entrySection, hostBooks: [], localBooks: [], currentBook: null, transferControls, localFileSequence: 0,
        filteredEntries: [], page: 0, selectedIds: new Set(), selectionMode: EXTERNAL_WORLD_BOOK_SELECTION_MODE.WHOLE,
        classificationDraft: [], classificationPage: 0,
        bookSearch, bookList, localBookList, entrySearch, fullText, entryMeta, entryList, pager,
        classificationPanel, classificationMeta, classificationFilter, classificationList, classificationPager,
        savedLibrariesPanel, savedLibrariesList, savedLibrariesSequence: 0,
        savedEntriesPanel, savedEntryLibrary: null, savedEntrySequence: 0, savedEntryPage: 0, savedEntryQuery: '',
    };
    if (typeof overlay.showModal === 'function') overlay.showModal();
    else {
        // Old hosts without dialog support: stay inside the active modal instead
        // of becoming an inert sibling. Modern supported hosts use showModal.
        const parent = document.querySelector('dialog[open]');
        (parent || document.documentElement).append(overlay);
        overlay.setAttribute('open', '');
    }
    try { closeButton.focus({ preventScroll: true }); } catch {}
    showView(initialView);
}

export function openExternalWorldBookImportWizard(options = {}) {
    createModal(options?.initialView, options?.importKind);
}
