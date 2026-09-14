import { entryIdentity } from './selectionState.js?rmv=1.5.51-narrow1';
import { buildExternalEntrySummary } from './summary.js?rmv=1.5.51-narrow1';

export const EXTERNAL_WORLD_BOOK_CLASSIFICATION = Object.freeze({
    THEME: 'theme',
    FORMAT: 'format',
    MIXED: 'mixed',
    AUXILIARY: 'auxiliary',
    IGNORE: 'ignore',
    PENDING: 'pending',
});

export const EXTERNAL_WORLD_BOOK_CONFIDENCE = Object.freeze({
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
});

const FORMAT_SIGNALS = Object.freeze([
    '论坛体','论坛','贴吧','主楼','回帖','楼层','帖子','聊天记录','聊天','群聊','短信','私信','通讯',
    '日记','手账','备忘录','邮件','信件','书信','排行榜','榜单','排名','塔罗','星盘','占卜','神谕卡',
    '游戏','rpg','gal game','galgame','养成','模拟人生','抽卡','gacha','状态栏','属性面板','报告','档案',
    '相册','照片','明信片','票据','收据','小票','直播','播客','电台','问答','评论','影评','书评','食评',
    '地图','画作','绘画','漫画','报纸','新闻','报导','网页','网站','搜索','购物车','订单','wiki','小说片段',
    '诗歌','俳句','祈祷词','忏悔词','短信体','豆瓣','推文','twitter','youtube','tiktok','bilibili','小红书',
    '菜单','食谱','简笔画','颜文字','时间线','档案室','回想模式','技能树','任务日志','赛马','赛车','音游',
]);

const THEME_SIGNALS = Object.freeze([
    '嫉妒','背叛','末日','救赎','失忆','记忆修改','记忆','占有欲','依恋','暗恋','告别','重生','轮回','时间循环',
    '穿越','跨时空','梦境','恐惧','悲伤','哀伤','修罗场','关系危机','分手','复合','秘密','悬疑','求生','生存',
    '成长','亲情','友情','爱情','身份互换','年龄逆转','平行世界','前世','未来','过去','遗憾','愿望','谎言','忠诚',
    '误会','执念','治愈','孤独','失恋','离别','久别重逢','宿命','灾难','怪谈','都市传说','心理操纵','催眠','常识修改',
]);

const AUXILIARY_SIGNALS = Object.freeze([
    '通用规则','公共规则','共通规则','基础规则','总规则','输出规则','格式要求','注意事项','使用说明','前置说明',
    '共享说明','补充规则','通用说明','共用说明','辅助说明','全局说明','格式补充','共同规则',
]);

const RISK_SIGNALS = Object.freeze([
    '忽略之前','忽略此前','覆盖系统','覆盖以上','system prompt','<toto','sourcehash','mesid','owner key',
    'javascript:','<script','onclick=','onload=','fetch','xmlhttprequest','/api/','reasoning_content','关闭sanitizer',
    '禁用sanitizer','关闭净化','自动重试','重复请求','slash command','执行脚本','调用api','绕过安全',
]);

function normalize(value) {
    return String(value ?? '').normalize?.('NFKC')?.toLocaleLowerCase?.('zh-Hans-CN')
        ?? String(value ?? '').toLowerCase();
}

const NORMALIZED_FORMAT_SIGNALS = Object.freeze(FORMAT_SIGNALS.map(signal => Object.freeze([signal, normalize(signal)])));
const NORMALIZED_THEME_SIGNALS = Object.freeze(THEME_SIGNALS.map(signal => Object.freeze([signal, normalize(signal)])));
const NORMALIZED_AUXILIARY_SIGNALS = Object.freeze(AUXILIARY_SIGNALS.map(signal => Object.freeze([signal, normalize(signal)])));
const NORMALIZED_RISK_SIGNALS = Object.freeze(RISK_SIGNALS.map(signal => Object.freeze([signal, normalize(signal)])));

function hitsNormalized(source, signalPairs) {
    const matched = [];
    for (const [label, normalizedSignal] of signalPairs) {
        if (source.includes(normalizedSignal)) matched.push(label);
    }
    return matched;
}

function scoreFieldNormalized(source, signalPairs, weight) {
    const matched = hitsNormalized(source, signalPairs);
    return { score: matched.length * weight, matched };
}

function mergeReason(bucket, label, matched) {
    if (!matched.length) return;
    const unique = [...new Set(matched)].slice(0, 4);
    bucket.push(`${label}：${unique.join(' / ')}`);
}

function scoreSignals(sources, signalPairs) {
    const title = scoreFieldNormalized(sources.title, signalPairs, 5);
    const keywords = scoreFieldNormalized(sources.keywords, signalPairs, 3);
    const content = scoreFieldNormalized(sources.content, signalPairs, 1);
    return {
        score: title.score + keywords.score + content.score,
        title: title.matched,
        keywords: keywords.matched,
        content: content.matched,
    };
}

function reasonFor(label, scored) {
    const reasons = [];
    mergeReason(reasons, `${label}名称`, scored.title);
    mergeReason(reasons, `${label}关键词`, scored.keywords);
    mergeReason(reasons, `${label}正文`, scored.content);
    return reasons;
}

function confidenceFor(score, runnerUp = 0) {
    if (score >= 8 && score - runnerUp >= 3) return EXTERNAL_WORLD_BOOK_CONFIDENCE.HIGH;
    if (score >= 5) return EXTERNAL_WORLD_BOOK_CONFIDENCE.MEDIUM;
    return EXTERNAL_WORLD_BOOK_CONFIDENCE.LOW;
}

// Category labels/numbering are stronger evidence than incidental words in a
// story. Body prose is not scanned as a label: only an explicit category line.
function explicitCategories(sources) {
    const labels = `${sources.title}\n${sources.keywords}`;
    const kinds = [];
    for (const [kind, label] of [['format', '展现(?:形式)?'], ['theme', '主题(?:元素)?'], ['auxiliary', '辅助(?:片段|规则)?']]) {
        const labelled = new RegExp(`(?:^|[\\s【\\[（(｜|/])${label}(?:\\s*[:：]?\\s*(?:[0-9一二三四五六七八九十]+)|\\s*(?=$|[\\n】\\]）)]))`, 'm');
        const declaration = new RegExp(`^\\s*(?:分类|类别|类型)\\s*[:：]\\s*${label}(?:\\s|$|[】\\]）)])`, 'm');
        if (labelled.test(labels) || declaration.test(`${labels}\n${sources.content}`)) kinds.push(kind);
    }
    return kinds;
}

export function classifyExternalWorldBookEntry(entry) {
    const sources = {
        title: normalize(`${entry?.title || ''}\n${entry?.comment || ''}`),
        keywords: normalize([...(entry?.primaryKeywords || []), ...(entry?.secondaryKeywords || [])].join('\n')),
        content: normalize(String(entry?.content || '').slice(0, 1800)),
    };
    const format = scoreSignals(sources, NORMALIZED_FORMAT_SIGNALS);
    const theme = scoreSignals(sources, NORMALIZED_THEME_SIGNALS);
    const auxiliary = scoreSignals(sources, NORMALIZED_AUXILIARY_SIGNALS);
    const risk = scoreSignals(sources, NORMALIZED_RISK_SIGNALS);
    const explicit = explicitCategories(sources);
    const reasons = [];

    let suggestion = EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING;
    let confidence = EXTERNAL_WORLD_BOOK_CONFIDENCE.LOW;

    if (risk.score >= 3) {
        suggestion = EXTERNAL_WORLD_BOOK_CLASSIFICATION.IGNORE;
        confidence = EXTERNAL_WORLD_BOOK_CONFIDENCE.HIGH;
        reasons.push(...reasonFor('高风险协议', risk));
    } else if (explicit.length === 1) {
        suggestion = explicit[0];
        confidence = EXTERNAL_WORLD_BOOK_CONFIDENCE.HIGH;
        reasons.push(`明确分类标记：${suggestion === 'format' ? '展现形式' : suggestion === 'theme' ? '主题元素' : '辅助片段'}`);
    } else if (explicit.length > 1) {
        suggestion = EXTERNAL_WORLD_BOOK_CLASSIFICATION.MIXED;
        reasons.push('存在多个不同分类标记，请选择最终用途');
    } else if (format.score >= 5 && theme.score >= 5) {
        suggestion = EXTERNAL_WORLD_BOOK_CLASSIFICATION.MIXED;
        confidence = (format.score >= 8 && theme.score >= 8)
            ? EXTERNAL_WORLD_BOOK_CONFIDENCE.HIGH
            : EXTERNAL_WORLD_BOOK_CONFIDENCE.MEDIUM;
        reasons.push(...reasonFor('展现形式', format), ...reasonFor('主题', theme));
    } else if (format.score >= 5 && format.score >= theme.score + 2) {
        suggestion = EXTERNAL_WORLD_BOOK_CLASSIFICATION.FORMAT;
        confidence = confidenceFor(format.score, theme.score);
        reasons.push(...reasonFor('展现形式', format));
    } else if (theme.score >= 5 && theme.score >= format.score + 2) {
        suggestion = EXTERNAL_WORLD_BOOK_CLASSIFICATION.THEME;
        confidence = confidenceFor(theme.score, format.score);
        reasons.push(...reasonFor('主题', theme));
    } else if (auxiliary.score >= 5 && format.score < 5 && theme.score < 5) {
        suggestion = EXTERNAL_WORLD_BOOK_CLASSIFICATION.AUXILIARY;
        confidence = confidenceFor(auxiliary.score, Math.max(format.score, theme.score));
        reasons.push(...reasonFor('辅助规则', auxiliary));
    } else {
        const top = Math.max(format.score, theme.score, auxiliary.score);
        if (top > 0) {
            reasons.push(`线索不足：展现 ${format.score} / 主题 ${theme.score} / 辅助 ${auxiliary.score}`);
            // A unique positive clue can be offered for one-click confirmation,
            // but is never silently promoted to an auto-accepted category.
            const ranked = [['format', format.score], ['theme', theme.score], ['auxiliary', auxiliary.score]].sort((a, b) => b[1] - a[1]);
            if (ranked[0][1] > ranked[1][1]) suggestion = ranked[0][0];
        } else {
            reasons.push('没有足够的本地分类线索');
        }
    }

    const autoAccepted = confidence === EXTERNAL_WORLD_BOOK_CONFIDENCE.HIGH
        && [
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.THEME,
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.FORMAT,
            EXTERNAL_WORLD_BOOK_CLASSIFICATION.AUXILIARY,
        ].includes(suggestion);

    return Object.freeze({
        suggestion,
        confidence,
        reasons: Object.freeze(reasons.slice(0, 6)),
        autoAccepted,
        suggestedFinalClassification: autoAccepted ? suggestion : EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING,
    });
}

export function applyExternalWorldBookBulkClassification(draft, mode = 'suggested') {
    const allowed = ['theme', 'format', 'auxiliary', 'ignore'];
    if (mode !== 'suggested' && !allowed.includes(mode)) return Array.isArray(draft) ? draft : [];
    return (Array.isArray(draft) ? draft : []).map(item => {
        if (item.userConfirmed === true || item.classification !== 'pending') return item;
        const classification = mode === 'suggested' ? item.suggestion : mode;
        // Risk/ambiguous suggestions still need an explicit category decision.
        if (!allowed.includes(classification) || (mode === 'suggested' && classification === 'ignore')) return item;
        return { ...item, classification, userConfirmed: true, requiresReview: false };
    });
}

export function createExternalWorldBookClassificationDraft(book, selectedIds) {
    const selected = selectedIds instanceof Set ? selectedIds : new Set();
    const entries = (Array.isArray(book?.entries) ? book.entries : [])
        .filter(entry => selected.has(entryIdentity(entry)))
        .map(entry => {
            const analysis = classifyExternalWorldBookEntry(entry);
            return {
                entryIdentity: entryIdentity(entry),
                sourceEntryId: entry.sourceEntryId,
                sourceEntryUid: entry.sourceEntryUid,
                sourceTitle: entry.title,
                suggestion: analysis.suggestion,
                confidence: analysis.confidence,
                reasons: [...analysis.reasons],
                classification: analysis.suggestedFinalClassification,
                userConfirmed: false,
                requiresReview: !analysis.autoAccepted,
                localTitle: String(entry.title || '').trim(),
                summary: buildExternalEntrySummary(entry),
                contentHash: entry.contentHash,
            };
        });
    return entries;
}

export function updateExternalWorldBookDraftItem(draft, identity, patch = {}) {
    const list = Array.isArray(draft) ? draft : [];
    return list.map(item => {
        if (item.entryIdentity !== identity) return item;
        const next = { ...item };
        if (Object.prototype.hasOwnProperty.call(patch, 'classification')) {
            const value = String(patch.classification || '');
            if (Object.values(EXTERNAL_WORLD_BOOK_CLASSIFICATION).includes(value)) next.classification = value;
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'localTitle')) next.localTitle = String(patch.localTitle || '').trim().slice(0, 1000);
        if (Object.prototype.hasOwnProperty.call(patch, 'summary')) next.summary = String(patch.summary || '').replace(/\r\n?/g, '\n').trim().slice(0, 1200);
        next.userConfirmed = patch.userConfirmed === true ? true : next.userConfirmed;
        next.requiresReview = next.classification === EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING;
        return next;
    });
}

export function externalWorldBookClassificationCounts(draft) {
    const counts = {
        total: 0,
        theme: 0,
        format: 0,
        auxiliary: 0,
        ignore: 0,
        pending: 0,
        mixedSuggested: 0,
        uncertainSuggested: 0,
    };
    for (const item of Array.isArray(draft) ? draft : []) {
        counts.total += 1;
        if (Object.prototype.hasOwnProperty.call(counts, item.classification)) counts[item.classification] += 1;
        if (item.suggestion === EXTERNAL_WORLD_BOOK_CLASSIFICATION.MIXED) counts.mixedSuggested += 1;
        if (item.suggestion === EXTERNAL_WORLD_BOOK_CLASSIFICATION.PENDING) counts.uncertainSuggested += 1;
    }
    return counts;
}
