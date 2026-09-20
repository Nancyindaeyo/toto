// Local help only. Routes reveal existing controls; they never run those controls.
const setting = (id, name, description, target, page = '') => ({ id, name, description, target, page });
const mirror = (id, name, description, path) => ({ id, name, description, mirror: path });
export const QUICK_START_GROUPS = [
    { name: '生成与抽取', items: [
        setting('mode', '生成方式', '正文一起出，或使用独立 API 单独生成。', '#rh_generation_follow'),
        setting('display', '显示方式', '根据当前模式选择正文下方、外置弹窗、轻壳外置或外置后内嵌。', '#rh_independent_display_row'),
        setting('multiface', '多面兔子镜', '一次请求最多生成五面；面数越多，整批输出通常越长。', '#rh_multiface_enabled', 'generation'),
        setting('classic', '经典 / 仅展现形式', '经典模式抽题材与形式；仅展现形式模式侧重呈现方式。', '#rh_sampling_mode', 'generation'),
        setting('reference', '参考内容量', '精简、均衡、完整：选择本轮携带的参考量。', '#rh_raw_policy', 'generation'),
        setting('creative', '发散孵化模式', '允许更随机、更跳脱的内容组合。', '#rh_creative_expansion', 'generation'),
        setting('directive', '用户指令优先', '优先遵循本轮明确提出的小剧场要求。', '#rh_user_directive', 'generation'),
        setting('worldlock', '展现形式世界观锁', '保留功能与结构，转换不合当前世界观的具体载体。', '#rh_worldview_lock', 'generation'),
        setting('cooldown', '10 轮冷却', '减少近期成功生成的重复主题、形式和整体观感。', '#rh_avoid_repeat', 'generation'),
    ] },
    { name: '视觉与个性化', items: [
        setting('scenery', '动态视觉场景', '将展现形式固定为动态场景，一直出现动画可能会造成审美疲劳哦。', '#rh_force_visual_scenery', 'generation'),
        setting('enhanced', '视觉效果增强 / 增强视觉绘制', '允许更丰富的绘制，不保证每次都更好看。', '#rh_enhanced_visual_drawing', 'generation'),
        setting('visual', '个人视觉偏好', '填写想要和不想要的画面效果；启用并保存后从后续生成生效。', '#rh_visual_extra_prompt', 'visual'),
        setting('visualrules', '通用视觉规则', '进阶修改视觉规则，也可以恢复默认。', '#rh_visual_prompt', 'visual'),
    ] },
    { name: '读取与资料', items: [
        setting('layers', '读取层数', '设置独立 API 读取最近多少层可见聊天正文。', '#rh_independent_context_layers', 'worldinfo'),
        setting('tags', '正文标签过滤', '扫描正文标签，排除不想带给独立 API 的内容。', '#rh_independent_tag_filter_open', 'worldinfo'),
        setting('earlybody', '正文标签闭合就提前生成（可选）', '高级设置 → 独立 API：扫描勾选或填写当前聊天的正文标签并保存；不选思考标签，也不能同时过滤该标签。', '#rh_early_body_enabled', 'worldinfo'),
        setting('persona', '角色与 Persona', '可选带入精简的角色资料和用户设定。', '#rh_independent_include_character_summary', 'worldinfo'),
        setting('worldinfo', '当前激活世界书', '按需选取当前已激活的世界书参考。', '#rh_independent_read_global_world_info', 'worldinfo'),
        setting('memory', '共享记忆源（实验性）', '读取兼容扩展公开提供的记忆源，实际带入时可能增加上下文用量。', '#rh_memory_scan_enabled', 'memory'),
        setting('memorybook', '绑定记忆世界书', '开启额外资料来源后，刷新目录并选择记忆世界书；跟随和独立 API 都只在抽中共同回忆时读取。', '#rh_memory_worldbook_enabled', 'memory'),
        setting('followtags', '跟随模式标签隔离', '通过提示要求忽略指定标签；不同于独立 API 的实际过滤。', '#rh_follow_tag_isolation', 'worldinfo'),
    ] },
    { name: '偏好与文字', items: [
        setting('behavior', '补充创作规则', '高级设置 → 独立 API：选择注入方式，编辑并保存；可清空、关闭或恢复默认，只影响独立 API。', '#rh_behavior_rule_text', 'worldinfo'),
        setting('draw', '本轮抽签记录', '在 Prompt 估算里查看逐面记录；镜面的挨打猫里也可查看本轮抽签。', '#rh_token_meter'),
        setting('favorites', '收藏偏好', '提高收藏项目的随机抽取权重，不保证每轮必出。', '#rh_favorite_summary'),
        setting('theater-favorites', '兔子镜收藏夹', '回看已收藏成品，按角色卡分组；聊天里也可在工具菜单打开收藏夹。', '#rh_theater_favorite_summary'),
        setting('blacklist', '抽签黑名单', '排除不喜欢的随机项目；明确指令和强制场景有例外。', '#rh_blacklist_enabled'),
        setting('replacement', '禁词与文字替换', '本地删除或替换兔子镜可见文字，不改聊天原文。', '#rh_banned_words', 'replacement'),
    ] },
    { name: '镜面工具', items: [
        mirror('cat', '反馈猫 / 挨打猫', '对某一面反馈配色、结构、交互或文字等问题。', '该镜面标题 → 挨打猫'),
        mirror('resay', '重说', '重新请求独立 API 生成，会消耗所配置 API 的额度。同一面最多保留五版，满了要先删一版。', '该独立镜面 → 挨打猫 → 重说'),
        mirror('swipe', '上一版 / 下一版', '标题旁 ‹ 2/5 › 切换这一面已成功的重说版本；失败的一格不会保存。', '该独立镜面标题旁的版本箭头'),
        mirror('repair', '维修兔', '在具体镜面里检查并尝试本地修复，不请求模型。高频项：点了没反应、展开后文字被裁。', '该镜面标题 → 维修兔'),
        mirror('copyhtml', '复制本面 HTML', '单独保存这一面的代码和样式；不含诊断，依赖插件脚本的交互不会随之导出。', '该镜面标题 → 维修兔 → 复制本面 HTML（含样式）'),
        mirror('inspect', '只巡检不修改', '检查该镜面的问题，保留当前成品。', '该镜面 → 维修兔 → 只巡逻，不修改'),
        mirror('resetinteraction', '恢复到初始', '丢掉这一版上的维修和交互改动，回到刚生成时的整面 HTML；不会删掉 swipe 格子。', '该镜面 → 维修兔 → 恢复到初始'),
        setting('reroll', '自动重 roll 次数', '副 API 没有可用鲜兔镜时自动再发几次，默认 2。', '#rh_independent_automatic_reroll'),
        setting('patrol', '自动安全巡检（实验性）', '按需启用自动检查，复杂问题仍需手动处理。', '#rh_maintenance_auto_safe', 'repair'),
    ] },
    { name: '配置与维护', items: [
        setting('connection', '连接与模型', '从酒馆当前连接配置，或手动填写兼容接口与模型。', '#rh_independent_import_current'),
        setting('output', '温度、整批最大输出与请求字符预算', '配置生成参数；多面共享整批输出上限。完整请求字符预算可按模型上下文自行调大。', '#rh_independent_max_request_chars'),
        setting('regex', '一键配置正则', '为跟随正文 API 配置不发送正则；也可查看或复制。', '.rabbit-mirror-tools .rh_regex_configure'),
        setting('estimate', 'Prompt 估算', '查看请求前的本地估算，不是服务商账单。', '#rh_token_meter'),
        mirror('chain', '生成全链路诊断', '在出问题的镜面中查看生成与维修链路。', '该镜面 → 维修兔 → 生成全链路诊断'),
        setting('hostdiag', '宿主性能诊断', '检查宿主、其他扩展和网络，与内部诊断分开。', '#rh_external_diag_start'),
        setting('clear', '清理与恢复', '分别清除抽签冷却、当前注入或恢复默认；先确认范围。', '#rh_clear_last'),
        setting('update', '检查并更新', '通过宿主更新当前扩展所登记的 git 仓库，不读取本 fork 的 homePage。若 remote 仍是作者仓库，会覆盖成本地 fork。权限或非 Git 安装仍可能受限。', '#rh_update_now'),
    ] },
];
export const QUICK_START_STEPS = {
    independent: [
        ['inject', '勾选自动注入', '先打开总开关，配好后再发新消息。'],
        ['independent-mode', '选择独立模式', '生成方式 → 使用独立 API。'],
        ['connection', '配置连接与模型', '可从酒馆当前连接配置，也可手动填写。'],
        ['layers', '设置读取层数', '选择最近多少层聊天作为参考。'],
        ['tags', '设置过滤标签', '扫描并排除不需要带入的正文标签。'],
        ['independent-display', '选择显示方式', '轻壳外置，或外置后内嵌。'],
    ],
    follow: [
        ['inject', '勾选自动注入', '先打开总开关，配好后再发新消息。'],
        ['mode', '选择跟随当前 API', '让正文与兔子镜在同一次回复里生成。'],
        ['regex', '一键配置正则', '配置不发送正则，避免旧镜面重复带回上下文。'],
        ['follow-display', '选择显示方式', '正文下方，或外置弹窗。'],
    ],
};

export function mountRabbitMirrorQuickStart({ root, openAdvanced, closeAdvanced }) {
    const doc = root.ownerDocument;
    const win = doc.defaultView;
    const guide = root.querySelector('#rh_quick_start');
    const body = guide.querySelector('.rabbit-mirror-quick-start-body');
    const entries = new Map(QUICK_START_GROUPS.flatMap(group => group.items).map(item => [item.id, item]));
    [setting('inject', '兔子镜自动注入', '', '#rh_enabled'),
        setting('independent-mode', '使用独立 API', '', '#rh_generation_independent'),
        setting('independent-display', '独立模式显示方式', '', '#rh_independent_display_row'),
        setting('follow-display', '跟随模式显示方式', '', '#rh_follow_display_row')].forEach(item => entries.set(item.id, item));
    const create = (tag, className, text) => {
        const node = doc.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    };
    const button = (className, text) => { const node = create('button', className, text); node.type = 'button'; return node; };
    const backBar = create('div', 'rabbit-mirror-guide-return');
    const back = button('rabbit-mirror-guide-link', '← 返回新手指引');
    const status = create('span', 'rabbit-mirror-guide-caption');
    status.setAttribute('role', 'status');
    backBar.append(back, status);
    const live = create('p', 'rabbit-mirror-guide-caption');
    live.setAttribute('role', 'status');
    live.hidden = true;
    const tabs = create('div', 'rabbit-mirror-guide-tabs');
    tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', '选择要阅读的生成方式');
    const panels = new Map(); const tabButtons = new Map();
    function row(id, title, description, index) {
        const node = button('rabbit-mirror-guide-link rabbit-mirror-guide-item'); node.dataset.rhGuideRoute = id;
        if (index !== undefined) node.append(create('span', 'rabbit-mirror-guide-number', String(index + 1)));
        const text = create('span', 'rabbit-mirror-guide-copy');
        text.append(create('span', 'rabbit-mirror-guide-name', title), create('span', 'rabbit-mirror-guide-caption', description));
        const arrow = create('span', 'rabbit-mirror-guide-arrow', '›'); arrow.setAttribute('aria-hidden', 'true');
        node.append(text, arrow); return node;
    }
    body.replaceChildren(tabs);
    for (const mode of ['follow', 'independent']) {
        const tab = button('rabbit-mirror-guide-tab', mode === 'follow' ? '跟随正文 API' : '独立 API');
        tab.id = `rh_guide_tab_${mode}`; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', `rh_guide_panel_${mode}`);
        const panel = create('div'); panel.id = `rh_guide_panel_${mode}`;
        panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id);
        panel.append(create('p', 'rabbit-mirror-guide-lead', mode === 'follow'
            ? '正文和兔子镜在同一次回复里生成，无需另配 API。'
            : '正文与兔子镜分别请求，可使用不同模型。兔子镜会额外消耗所配置 API 的额度。'));
        const list = create('ol', 'rabbit-mirror-guide-steps');
        QUICK_START_STEPS[mode].forEach(([id, title, description], index) => { const li = create('li'); li.append(row(id, title, description, index)); list.append(li); });
        panel.append(list, create('p', 'rabbit-mirror-guide-caption', mode === 'follow'
            ? '配置完成后，正常发送一条新消息即可。'
            : '全部配置好再聊天，新回复完成后会自动生成兔子镜；提前生成是可选项，在高级设置 → 独立 API 中设置。'));
        tabs.append(tab); body.append(panel); panels.set(mode, panel); tabButtons.set(mode, tab);
        tab.addEventListener('click', () => selectTab(mode));
        tab.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const selected = event.key === 'Home' ? 'follow' : event.key === 'End' ? 'independent' : mode === 'follow' ? 'independent' : 'follow';
            selectTab(selected); tabButtons.get(selected).focus();
        });
    }
    function selectTab(mode) {
        for (const [name, panel] of panels) { panel.hidden = name !== mode; tabButtons.get(name).setAttribute('aria-selected', String(name === mode)); }
    }
    selectTab(root.querySelector('#rh_generation_independent')?.checked ? 'independent' : 'follow');
    const catalogue = create('details', 'rabbit-mirror-guide-catalogue'); catalogue.id = 'rh_guide_catalogue';
    catalogue.append(create('summary', '', '完整功能说明 · 按需查看'));
    for (const group of QUICK_START_GROUPS) {
        const details = create('details', 'rabbit-mirror-guide-group'); details.append(create('summary', '', group.name));
        group.items.forEach(item => details.append(row(item.id, item.name, item.description)));
        catalogue.append(details);
    }
    body.append(catalogue, live);
    let origin = null; let highlights = []; let timer = 0; let frame = 0; let disposed = false;
    function clearHighlight() { if (timer) win.clearTimeout(timer); timer = 0; highlights.forEach(node => node.classList.remove('rabbit-mirror-guide-highlight')); highlights = []; }
    function capture(trigger) {
        const scroll = []; let node = trigger.parentElement;
        while (node) { if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) scroll.push([node, node.scrollTop, node.scrollLeft]); node = node.parentElement; }
        origin = { trigger, scroll, x: win.scrollX, y: win.scrollY,
            details: [...root.querySelectorAll('details')].map(node => [node, node.open]) };
    }
    const showMessage = text => { live.hidden = false; live.textContent = text; };
    function navigate(event) {
        const trigger = event.target.closest('[data-rh-guide-route]');
        if (!trigger || !body.contains(trigger)) return;
        const item = entries.get(trigger.dataset.rhGuideRoute); if (!item) return;
        clearHighlight(); backBar.remove(); live.hidden = true; capture(trigger);
        if (item.mirror) {
            showMessage(`${item.name}：${item.mirror}。请回到聊天选择要操作的那一面；不会自动替你选择或执行。`);
            live.prepend(backBar); status.textContent = '镜面工具入口'; back.focus({ preventScroll: true }); live.scrollIntoView({ block: 'nearest', behavior: 'instant' }); return;
        }
        let selector = item.target;
        if (item.id === 'display') selector = root.querySelector('#rh_generation_independent')?.checked ? '#rh_independent_display_row' : '#rh_follow_display_row';
        if (item.id === 'theater-favorites') root.__rabbitMirrorWorkbench?.navigate?.('theaterFavorites');
        const scope = item.page ? doc.getElementById('rh_advanced_modal') : root;
        const target = scope?.querySelector(selector);
        if (!target) { showMessage('此入口暂时不可用，请在原设置中查找；没有修改任何配置。'); return; }
        if (item.page) openAdvanced(item.page); else closeAdvanced();
        let ancestor = target;
        while (ancestor && ancestor !== scope) { if (ancestor.tagName === 'DETAILS') ancestor.open = true; ancestor = ancestor.parentElement; }
        // Follow-only display fields can be intentionally hidden by the real mode.
        // Do not change that mode just to satisfy a help link.
        const hiddenMode = !target.getClientRects().length;
        let anchor = target.closest('label') || target;
        if (hiddenMode) anchor = root.querySelector(selector === '#rh_follow_display_row' ? '#rh_generation_follow' : '#rh_generation_independent')?.closest('label') || target;
        if (item.page) doc.getElementById('rh_advanced_modal_header').append(backBar);
        else if (anchor.tagName === 'DETAILS') anchor.querySelector('summary').after(backBar);
        else anchor.before(backBar);
        status.textContent = hiddenMode ? '请先自行选择相应生成模式' : `已定位：${item.name}`;
        back.focus({ preventScroll: true });
        if (frame) win.cancelAnimationFrame(frame);
        frame = win.requestAnimationFrame(() => {
            // Native details toggle handlers may populate lazy settings after opening.
            // Wait one paint for that layout before positioning, without observers/polling.
            frame = win.requestAnimationFrame(() => {
                frame = 0; if (disposed || !target.isConnected) return;
                // Reveal the actual setting, not the return bar preceding it. A nearest-edge
                // scroll can leave the control under the host's fixed composer/header.
                const destination = !hiddenMode && target.matches('select,textarea,button,input:not([type="checkbox"]):not([type="radio"])')
                    ? target : anchor.tagName === 'DETAILS' ? anchor.querySelector('summary') || anchor : anchor;
                destination.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
                destination.classList.add('rabbit-mirror-guide-highlight'); highlights = [destination];
                timer = win.setTimeout(clearHighlight, 1600);
            });
        });
    }
    function restore() {
        if (!origin) return;
        if (frame) win.cancelAnimationFrame(frame); frame = 0;
        clearHighlight(); closeAdvanced(); backBar.remove(); live.hidden = true;
        const saved = origin; origin = null;
        saved.details.forEach(([node, open]) => { if (node.isConnected) node.open = open; });
        guide.open = true;
        frame = win.requestAnimationFrame(() => {
            frame = 0; if (disposed || !saved.trigger.isConnected) return;
            saved.trigger.focus({ preventScroll: true });
            saved.scroll.forEach(([node, top, left]) => { if (node.isConnected) { node.scrollTop = top; node.scrollLeft = left; } });
            win.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
        });
    }
    back.addEventListener('click', restore); body.addEventListener('click', navigate);
    return () => {
        disposed = true; if (frame) win.cancelAnimationFrame(frame); clearHighlight();
        body.removeEventListener('click', navigate); back.removeEventListener('click', restore); backBar.remove(); origin = null;
    };
}
