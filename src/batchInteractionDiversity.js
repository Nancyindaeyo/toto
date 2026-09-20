// Pure, bounded generation preferences. These are not output gates, candidate
// filters or a menu of interaction components. Unknown/native mechanisms remain
// free to be designed by the model; no mother-library text is inspected here.
const FAMILY_LABELS = Object.freeze({
    tabbed_radio_family: '并列标签／多按钮切页',
    multi_control_panel_family: '多控件状态面板',
    checkbox_reveal_family: '单入口显隐揭示',
    multi_checkbox_family: '多点勾选／清单揭示',
    inner_details_family: '内部折叠分层',
    flip_card_family: '翻面／双面切换',
});

function recentRepeatedFamilies(recentFamilies) {
    const recent = Array.isArray(recentFamilies) ? recentFamilies.slice(-5) : [];
    const counts = new Map();
    for (const item of recent) {
        if (Object.hasOwn(FAMILY_LABELS, item?.id)) counts.set(item.id, (counts.get(item.id) || 0) + 1);
    }
    const lastTwo = recent.slice(-2);
    const repeatedLast = lastTwo.length === 2 && lastTwo[0]?.id === lastTwo[1]?.id ? lastTwo[1]?.id : '';
    return Object.keys(FAMILY_LABELS).filter(id => {
        const threshold = id === 'tabbed_radio_family' || id === 'multi_control_panel_family' ? 2 : 3;
        return (counts.get(id) || 0) >= threshold || repeatedLast === id;
    }).slice(0, 2);
}

/** Freeze at most five per-face comparisons before any external material read. */
export function planBatchInteractionDiversity(faceCount, { enabled = false, recentFamilies = [], presentationModes = [] } = {}) {
    if (enabled !== true || !Number.isSafeInteger(faceCount) || faceCount < 2 || faceCount > 5) return null;
    const htmlIndices = Array.from({ length: faceCount }, (_, index) => index).filter(index => presentationModes[index] !== 'text');
    if (htmlIndices.length < 2) return null;
    const recentAvoidFamilyIds = recentRepeatedFamilies(recentFamilies);
    return Array.from({ length: faceCount }, (_, faceIndex) => presentationModes[faceIndex] === 'text' ? null : ({
        schemaVersion: 1, faceIndex, faceCount,
        compareWithFaceIndices: htmlIndices.filter(index => index < faceIndex),
        preferredMaxFamilyUses: Math.min(2, htmlIndices.length - 1),
        recentAvoidFamilyIds: [...recentAvoidFamilyIds],
        allowNativeRepeat: true,
    }));
}

/** Render once for the batch. Missing old hints are a no-op, never a failure. */
export function buildBatchInteractionDiversityRule(combos, settings) {
    if (!settings?.avoidRepeat || !Array.isArray(combos) || combos.length < 2 || combos.length > 5) return '';
    const htmlIndices = combos.map((combo, index) => combo?.presentationMode === 'text' ? -1 : index).filter(index => index >= 0);
    if (htmlIndices.length < 2) return '';
    const first = combos[htmlIndices[0]]?.interactionDiversity;
    if (!first || !Array.isArray(first.recentAvoidFamilyIds) || first.recentAvoidFamilyIds.length > 2 ||
        first.recentAvoidFamilyIds.some(id => !Object.hasOwn(FAMILY_LABELS, id))) return '';
    const expected = planBatchInteractionDiversity(combos.length, { enabled: true, presentationModes: combos.map(combo => combo?.presentationMode || 'html') });
    for (const index of htmlIndices) {
        const value = combos[index]?.interactionDiversity;
        const reference = expected[index];
        if (!value || value.schemaVersion !== 1 || value.faceIndex !== index || value.faceCount !== combos.length ||
            value.preferredMaxFamilyUses !== reference.preferredMaxFamilyUses || value.allowNativeRepeat !== true ||
            !Array.isArray(value.compareWithFaceIndices) || value.compareWithFaceIndices.length !== reference.compareWithFaceIndices.length ||
            value.compareWithFaceIndices.some((position, at) => position !== reference.compareWithFaceIndices[at]) ||
            !Array.isArray(value.recentAvoidFamilyIds) || value.recentAvoidFamilyIds.length !== first.recentAvoidFamilyIds.length ||
            value.recentAvoidFamilyIds.some((id, at) => id !== first.recentAvoidFamilyIds[at])) return '';
    }
    const recent = first.recentAvoidFamilyIds.map(id => FAMILY_LABELS[id]).join('、');
    const opening = htmlIndices.length === combos.length
        ? `本批交互分散：从第 2 面起对照此前各面，优先换主交互的操作路径与状态组织；只换标题、颜色、按钮文案或数量不算换。`
        : `本批交互分散：仅在第 ${htmlIndices.map(index => index + 1).join('、')} 面 HTML 作品之间对照，后面的 HTML 面优先换主交互的操作路径与状态组织；文本面不参与交互比较。只换标题、颜色、按钮文案或数量不算换。`;
    return opening +
        `同一主交互家族尽量不超过 ${first.preferredMaxFamilyUses} 面。` +
        (recent ? `近期高频的「${recent}」优先冷却。` : '') +
        '明确点菜、母本原有玩法和强制展现模式优先；可行机制不足时允许自然复用，不为凑种类另造控件，也不从固定组件菜单机械轮换。';
}
