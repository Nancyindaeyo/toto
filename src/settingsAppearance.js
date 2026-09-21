// UI palettes from the user-provided Hearttrace source, by Toto.
// Presentation only: no generation settings, Prompt, content storage, or network.
import { closeTheaterFavoriteLibrary, closeTheaterFavoriteViewer } from './theaterFavorites.js?rmv=1.6.3-fav1';
export const UI_THEMES = Object.freeze([
  {
    "id": "default",
    "label": "日间 · 珍珠白",
    "palette": {
      "background": "#f5f4fb",
      "surface": "#ffffff",
      "text": "#34495d",
      "muted": "#586b7c",
      "accent": "#ce729c",
      "accentAlt": "#58a59e",
      "border": "#cfdae5"
    }
  },
  {
    "id": "night",
    "label": "夜间 · 星黛蓝",
    "palette": {
      "background": "#171d28",
      "surface": "#232c3a",
      "text": "#edf1f8",
      "muted": "#b8c5d6",
      "accent": "#d9a8c1",
      "accentAlt": "#90c9c5",
      "border": "#455269"
    }
  },
  {
    "id": "gs1",
    "label": "初叶绿",
    "palette": {
      "background": "#edf6e5",
      "surface": "#ffffff",
      "text": "#234831",
      "muted": "#50624d",
      "accent": "#43833d",
      "accentAlt": "#e7b83b",
      "border": "#bad7a7"
    }
  },
  {
    "id": "gs2",
    "label": "海盐蓝",
    "palette": {
      "background": "#e9f3ff",
      "surface": "#ffffff",
      "text": "#233d61",
      "muted": "#52647d",
      "accent": "#287dc3",
      "accentAlt": "#9b79c8",
      "border": "#b4d2ee"
    }
  },
  {
    "id": "gs3",
    "label": "花漾粉",
    "palette": {
      "background": "#fff0f5",
      "surface": "#ffffff",
      "text": "#572c43",
      "muted": "#78536a",
      "accent": "#cc4d87",
      "accentAlt": "#68a97d",
      "border": "#edb6cf"
    }
  },
  {
    "id": "gs4",
    "label": "杏糖橙",
    "palette": {
      "background": "#fff1d9",
      "surface": "#fffefd",
      "text": "#553b24",
      "muted": "#74604b",
      "accent": "#c77425",
      "accentAlt": "#5096c8",
      "border": "#e9ca94"
    }
  }
]);

export const APPEARANCE_STORAGE_KEY = 'rabbit_mirror_settings_appearance_v1';
const paletteKeys = ['background', 'surface', 'text', 'muted', 'accent', 'accentAlt', 'border'];
const colorLabels = ['背景', '卡片底色', '正文', '辅助文字', '主色', '辅助色', '边框'];
const modes = new Set(['host', 'custom', ...UI_THEMES.map(theme => theme.id)]);
const mounts = new WeakMap();

export function normalizeAppearance(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
        mode: modes.has(source.mode) ? source.mode : 'host',
        custom: Object.fromEntries(paletteKeys.map(key => [key,
            /^#[0-9a-f]{6}$/i.test(source.custom?.[key] || '')
                ? source.custom[key] : UI_THEMES[0].palette[key],
        ])),
    };
}

const tokenNames = { background: 'bg', surface: 'card', text: 'text', muted: 'muted', accent: 'primary', accentAlt: 'secondary', border: 'border' };
const hostTokens = { background: 'var(--SmartThemeBlurTintColor, #f5f4fb)', surface: 'var(--SmartThemeBlurTintColor, #ffffff)', text: 'var(--SmartThemeBodyColor, #34495d)', muted: 'var(--SmartThemeBodyColor, #586b7c)', accent: 'var(--SmartThemeQuoteColor, #ce729c)', accentAlt: 'var(--SmartThemeQuoteColor, #58a59e)', border: 'var(--SmartThemeBorderColor, #cfdae5)' };
const smartThemeAliases = [['--SmartThemeBodyColor', 'text'], ['--SmartThemeBlurTintColor', 'card'], ['--SmartThemeBorderColor', 'border'], ['--SmartThemeQuoteColor', 'primary']];

// Panels mounted outside the settings workbench (for example the world-book import
// wizard on document.body) cannot inherit the workbench's theme tokens. Apply the
// exact same --rh-* palette and SmartTheme aliasing to one such root element.
export function applyAppearanceTheme(target, appearance) {
    if (!target?.style) return;
    let state = appearance;
    if (!state) {
        try { state = normalizeAppearance(JSON.parse(globalThis.localStorage.getItem(APPEARANCE_STORAGE_KEY) || 'null')); }
        catch { state = normalizeAppearance(null); }
    }
    const preset = UI_THEMES.find(theme => theme.id === state.mode);
    const palette = state.mode === 'custom' ? state.custom : preset?.palette;
    target.dataset.rhTheme = state.mode;
    for (const key of paletteKeys) target.style.setProperty('--rh-' + tokenNames[key], palette?.[key] || hostTokens[key]);
    for (const [alias, key] of smartThemeAliases) {
        if (state.mode === 'host') target.style.removeProperty(alias);
        else target.style.setProperty(alias, `var(--rh-${key})`);
    }
}

const iconPaths = {
    palette: '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M8 15h8"/>',
    sliders: '<path d="M6 4v16M12 4v16M18 4v16M3 8h6M9 16h6M15 10h6"/>',
    book: '<path d="M4 4h7v16H4zM13 4h7v16h-7z"/>',
    memory: '<path d="M5 5h14v14H5zM8 2v3M16 2v3M8 19v3M16 19v3M2 8h3M19 8h3M2 16h3M19 16h3"/>',
    repair: '<path d="m4 20 9-9M13 4a5 5 0 0 0 7 7l-4-1-2-2z"/>',
};
function icon(name) {
    return `<span class="rh-ui-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] || iconPaths.sliders}</svg></span>`;
}
function element(doc, tag, className, text = '') {
    const node = doc.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
}

export function destroySettingsAppearance(root) {
    mounts.get(root)?.();
}

export function mountSettingsAppearance(root, { onNavigate = () => {} } = {}) {
    if (!root || mounts.has(root)) return;
    const doc = root.ownerDocument;
    const drawer = root.querySelector(':scope > .inline-drawer > .inline-drawer-content');
    if (!drawer) return;
    const listeners = [];
    const listen = (node, event, fn, options) => { node.addEventListener(event, fn, options); listeners.push(() => node.removeEventListener(event, fn, options)); };
    const get = id => doc.getElementById(id);
    const make = (tag, cls, text = '') => element(doc, tag, cls, text);
    const html = (tag, cls, text) => { const n = make(tag, cls); n.innerHTML = text; return n; };
    const button = (text, fn, cls = '') => { const n = make('button', cls, text); n.type = 'button'; listen(n, 'click', fn); return n; };
    root.dataset.rhWorkbench = 'ui3'; root.hidden = true;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', '兔子镜');
    const vault = make('div', 'rh-ui-source'); vault.hidden = true;
    vault.append(...root.children); root.append(vault);
    const window = make('div', 'rh-ui-window');
    const head = html('header', 'rh-ui-head', '<span class="rh-ui-logo" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M10 16C4 2 11 1 14 14M18 14C20 1 27 2 23 16M9 16c-7 11 3 15 9 14s13-8 5-14c-4-3-10-3-14 0Z"/><path d="M12 22h1m6 0h1m-6 4 2 1 2-1"/></svg></span><div><strong>兔子镜</strong><small>RABBIT MIRROR · 小剧场</small></div>');
    const close = button('×', () => setOpen(false), 'rh-ui-close'); close.setAttribute('aria-label', '关闭兔子镜'); head.append(close);
    const searchbar = make('div', 'rh-ui-searchbar');
    const back = button('‹ 返回', () => goBack(), 'rh-ui-back'); back.id = 'rh_ui_back';
    const search = make('input', 'rh-ui-search'); search.type = 'search'; search.placeholder = '搜索功能，如：多面、世界书'; search.setAttribute('aria-label', '搜索兔子镜功能');
    searchbar.append(back, search);
    const tabs = make('nav', 'rh-ui-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', '兔子镜主要页面');
    const main = make('main', 'rh-ui-main'); main.id = 'rh_ui_content';
    window.append(head, searchbar, tabs, main); root.append(window);
    const tabNames = {settings:'设置',play:'玩法',tools:'工具'};
    const definitions = {
        settings:['settings','设置','先选怎么生成，再调整阅读与界面。'],
        play:['play','玩法','想多看几面、换种呈现，或导入小剧场世界书。'],
        tools:['tools','工具','遇到问题时，再打开需要的这一项。'],
        mode:['settings','怎么生成兔子镜','正文与兔子镜，可以一起生成，也可以分开生成。'],
        display:['settings','兔子镜显示模式','选择兔子镜的显示模式。'],
        connection:['settings','给兔子镜连接模型','副 API 生成时，兔子镜会使用这里的连接。'],
        manual:['settings','自己填写接口','使用兼容 OpenAI 的接口地址、密钥与模型。'],
        parameters:['settings','生成参数','调整副 API 的温度、整批最大输出和完整请求字符预算。'],
        reroll:['settings','自动重 roll','空回、报错或缺面时自动再试；跟随正文 API 和副 API 共用。'],
        request:['settings','请求参数','默认关闭。只有你的模型需要这些参数时，才启用并配置。'],
        read:['settings','它可以参考什么','决定兔子镜副 API 生成时，可以读取哪些资料。'],
        chat:['settings','参考聊天正文','读取层数，以及角色卡和你的 Persona 摘要。'],
        tags:['settings','跳过指定标签','扫描正文标签，排除不想作为参考的内容。'],
        books:['settings','使用世界书资料','复用当前聊天本轮已激活的资料，不重新抽取世界书。'],
        memories:['settings','加入共同回忆','让抽到的回忆类内容，有合适的过往资料可参考。'],
        early:['settings','什么时候开始副 API 生成','这是可选项。默认等正文完成后，再生成兔子镜。'],
        image:['settings','镜面生图','把这一面里的角色与高光画面画出来。手动点击才调用模型。'],
        appearance:['settings','主题与外观','只改变这个设置面板的颜色，不影响小剧场画面。'],
        faces:['play','一次生成几面','一面就是一份独立呈现的小剧场。默认一次生成一面。'],
        draw:['play','怎么挑选题材和形式','先决定是一起抽题材与形式，还是只抽呈现形式。'],
        library:['play','导入小剧场世界书','导入你的题材或呈现模板。不导入，也可以使用内置玩法。'],
        favorites:['play','让喜欢的更常出现','收藏能提高抽取权重；不是锁定每轮都出现。'],
        theaterFavorites:['play','回看收藏的兔子镜','按角色卡查看已收藏成品，打开时保留交互。'],
        blacklist:['play','不想抽到哪些内容','把不喜欢的项目放进抽签黑名单。'],
        look:['play','调整画面与写法','说清楚你想要什么，再按需要补充参考。'],
        visualText:['play','你想要什么画面','告诉它你喜欢的效果，也可以明确哪些不要。'],
        drawing:['play','动态场景与绘制细节','按需要开启，不必全部打开。'],
        writing:['play','给小剧场补充写作要求','这些规则只用于兔子镜副 API 生成。'],
        references:['play','参考已有的 HTML','借鉴参考的外观与交互特点，和界面主题是两回事。'],
        visualRules:['play','通用视觉规则','查看或修改每次绘制遵循的规则。'],
        replacement:['play','禁词与文字替换','只处理兔子镜可见文字，保留原聊天正文。'],
        mirror:['tools','镜面出问题了','先处理缺外壳的楼层，再对已有镜面使用挨打猫或维修兔。'],
        usage:['tools','看看这次抽到了什么','查看抽签、请求记录和 Prompt 估算。估算不是服务商账单。'],
        regex:['tools','避免旧镜面重复发给模型','跟随正文 API 生成时，用这条正则过滤旧的兔子镜内容。'],
        diagnosis:['tools','检查宿主与连接问题','记录情况、查看诊断报告。'],
        cleanup:['tools','清理与恢复','分别处理抽签记录、当前注入与设置。'],
        help:['tools','第一次使用兔子镜','先确定生成方式和显示模式，再回到聊天开始使用。'],
        update:['tools','版本与更新','检查插件版本，或加载已经安装的版本。'],
    };
    const panels = new Map();
    for (const [key,[tab,title,desc]] of Object.entries(definitions)) {
        const panel = make('section', 'rh-ui-page'); panel.dataset.rhPage = key; panel.hidden = true;
        const heading = make('div','rh-ui-heading'); heading.append(make('h2','',title),make('p','',desc)); panel.append(heading);
        const body = make('div','rh-ui-page-body'); panel.append(body); main.append(panel); panels.set(key,{panel,body,tab});
    }
    const body = key => panels.get(key).body;
    const move = (node, key) => {
        if (typeof node === 'string') node = get(node);
        if (!node) return null;
        body(key).append(node);
        if (node.matches('details')) { node.open = true; node.classList.add('rh-ui-unfolded'); }
        if (node.matches('.rh-advanced-page')) node.style.display = 'block';
        return node;
    };
    const row = (where,key,title,desc,glyph='sliders') => {
        const n = button('',()=>navigate(key),'rh-ui-entry'); n.dataset.rhRoute = key;
        n.innerHTML = `${icon(glyph)}<span><strong>${title || definitions[key][1]}</strong><small>${desc || definitions[key][2]}</small></span><b aria-hidden="true">›</b>`;
        body(where).append(n); return n;
    };
    const note = (where,text) => { const n=make('p','rh-ui-note',text); body(where).append(n); return n; };
    // Move original bound nodes; never clone a field or replace its business handler.
    const withNote = (id,key) => {
        const control = get(id), label = control?.closest('label');
        if (!label) return;
        const after = label.nextElementSibling;
        move(label,key);
        if (after?.matches('.rabbit-mirror-subnote')) move(after,key);
    };
    const enable = get('rh_enabled').closest('.rabbit-mirror-primary-toggle');
    move(enable,'settings'); enable.classList.add('rh-ui-start'); get('rh_advanced_open').hidden = true;
    enable.querySelector('b').textContent='随聊天生成小剧场'; enable.querySelector('small').textContent='按当前生成方式，随聊天生成兔子镜。';
    const modeSummary=html('div','rh-ui-mode-summary','<small>当前生成方式</small><strong data-rh-source-label></strong><p data-rh-source-description></p>');
    const change=button('更改 ›',()=>navigate('mode'),'rh-ui-text-link');change.dataset.rhRoute='mode';modeSummary.append(change);enable.append(modeSummary);
    const connectionNudge=row('settings','connection','还没有配置副 API 模型','选择连接和模型，供兔子镜单独使用。','memory');
    const displayRow=row('settings','display','兔子镜显示模式');
    row('settings','reroll','自动重 roll','空回、报错或缺面时自动再试。关闭后只在手动重说或重新生成正文时再出兔子镜。');
    row('settings','image','镜面生图','连接柏宝绘、选择提示词格式。','palette');
    move('rh_image_settings','image');
    row('settings','appearance','主题与外观','调整这个面板的颜色。','palette');row('settings','read','它可以参考什么','聊天正文、角色资料、世界书和共同回忆。','memory');
    for(const [key,title,desc,glyph] of [
        ['faces','一次想看几面','现在每轮生成 1 面；想多看几种内容时再开启多面。'],
        ['draw','怎么挑选题材和形式'],['look','调整画面与写法',null,'palette'],
        ['library','导入小剧场世界书',null,'book'],['theaterFavorites','回看收藏的兔子镜'],['favorites','让喜欢的更常出现'],['blacklist','不想抽到哪些内容']])row('play',key,title,desc,glyph);
    for(const key of ['help','mirror','usage','diagnosis','regex','cleanup','update'])row('tools',key);
    const choice = (input,title,description,extra='') => {
        const old = input.closest('label'); const label = make('label','rh-ui-choice');
        label.append(input); const text=make('span','');text.append(make('strong','',title),make('small','',description));if(extra)text.append(make('em','',extra));label.append(text);
        old.replaceWith(label); return label;
    };
    move(choice(get('rh_generation_follow'),'跟随正文 API','使用聊天正在用的模型，一次回复里带出正文和小剧场。','不需要另外配置模型'),'mode');
    move(choice(get('rh_generation_independent'),'使用副 API','正文照常回复，兔子镜另外请求一个模型。','需要单独连接，会产生额外模型用量'),'mode');
    const timingRow=move('rh_independent_generation_timing_row','mode');
    const nextConnection=row('mode','connection','接下来，给兔子镜选一个模型','可以使用酒馆已有的连接配置，也可以自己填写接口。');
    row('mode','early','想在正文完成前开始生成？','默认等正文完成。需要时再配置正文标签。');
    row('mode','regex','检查不发送兔子镜正则','避免旧镜面跟着下一次请求重复发送。');
    const outer='每面兔子镜带有独有的外置壳，防止被其他模块包裹。',inner='生成时外置展示，完成后以内嵌方式查看。';
    move('rh_follow_regex_helper','regex');
    const followDisplay=move('rh_follow_display_row','display'),indDisplay=move('rh_independent_display_row','display');
    for(const input of followDisplay.querySelectorAll('input'))choice(input,input.value==='inline'?'放在正文下方':'外置展示',input.value==='inline'?'翻到这条回复，就能看到对应的小剧场。':outer);
    for(const input of indDisplay.querySelectorAll('input'))choice(input,input.value==='external'?'外置展示':'跟随正文内嵌',input.value==='external'?outer:inner);
    for(const node of [followDisplay,indDisplay]){node.removeAttribute('style');node.className='rh-ui-display-options';}
    move('rh_independent_manual_legacy','manual');
    move('rh_automatic_reroll_block','reroll');
    move(get('rh_independent_temperature').closest('.rh-independent-generation-params')||get('rh_independent_temperature').closest('.flex-container'),'parameters');move('rh_independent_request_advanced','request');
    get('rh_independent_advanced_open').closest('.rabbit-mirror-independent-advanced-row').hidden=true;
    const apiFields=get('rh_independent_api_fields');
    // The emptied display wrapper is presentation only. Connection/profile hooks retain their original parent card.
    apiFields.firstElementChild.hidden=true;
    move('rh_independent_api_section','connection');
    row('connection','manual','自己填写接口地址','已有接口地址和密钥时使用。');row('connection','parameters','调整生成参数');row('parameters','request','请求参数');
    row('read','chat');row('read','tags');row('read','books');row('read','memories');
    move('rh_early_body_options','early');move('rh_behavior_rules','writing');
    move(get('rh_independent_context_layers').closest('label').parentElement,'chat');
    move(get('rh_independent_include_character_summary').closest('label').parentElement,'chat');
    move(get('rh_independent_tag_filter_open').parentElement.parentElement,'tags');
    move('rh_advanced_page_worldinfo','books');move('rh_advanced_page_memory','memories');
    withNote('rh_multiface_enabled','faces');move('rh_multiface_count_row','faces');move('rh_multiface_help','faces');move('rh_face_presentation_modes','faces');
    withNote('rh_force_visual_scenery','drawing');withNote('rh_visual_scenery_combination','drawing');withNote('rh_enhanced_visual_drawing','drawing');move('rh_advanced_page_generation','draw');
    for(const key of ['visualText','drawing','writing','references','visualRules','replacement'])row('look',key);
    move('rh_appearance_reference','references');
    move(get('rh_visual_prompt').closest('details'),'visualRules');
    move('rh_advanced_page_visual','visualText');
    const visualSaveProxy=button('保存并从下一面生效',()=>get('rh_visual_prompt_save').click(),'menu_button');body('visualRules').append(visualSaveProxy);
    move('rh_advanced_page_replacement','replacement');move('rh_advanced_page_external','library');
    move(get('rh_blacklist_enabled').closest('label').parentElement,'blacklist');move(get('rh_favorite_summary').parentElement,'favorites');
    move(get('rh_theater_favorite_section')?.querySelector('.rabbit-mirror-section-content'),'theaterFavorites');
    move('rh_missing_shell_panel','mirror');
    move('rh_advanced_page_repair','mirror');
    note('mirror','每面兔子镜的标题旁都有版本箭头、收藏星标和兔子工具。挨打猫用于反馈和重说；维修兔用于检查、修复、复制本面 HTML；星标收藏当前这一版。');
    move('rh_manual_entry_diag','diagnosis');
    move('rh_token_meter','usage');move(get('rh_copy_regex').closest('.rabbit-mirror-regex-helper'),'regex');
    move(get('rh_clear_last').parentElement,'cleanup');move(get('rh_external_diag_status').parentElement,'diagnosis');
    for(const id of ['rh_update_now','rh_update_status','rh_update_reload'])move(id,'update');
    const steps=[['先选生成方式','选择“跟随正文 API”，或“使用副 API”。使用副 API 时，再为兔子镜配置连接与模型。','mode','选择生成方式'],['选择兔子镜显示模式',`根据生成方式，选择正文下方、外置展示或跟随正文内嵌。外置展示时，${outer}跟随正文内嵌则是${inner}`,'display','选择兔子镜显示模式'],['回到聊天，发一条消息','保持“随聊天生成小剧场”开启。按选好的生成与显示模式使用兔子镜。']];
    steps.forEach(([title,desc,target,label],i)=>{const step=html('section','rh-ui-guide-step',`<span>${i+1}</span><div><h3>${title}</h3><p>${desc}</p></div>`);if(i===2)step.querySelector('p').dataset.rhTimingGuide='true';if(target){const link=button(label+' ›',()=>navigate(target),'rh-ui-text-link');link.dataset.rhRoute=target;step.lastElementChild.append(link);}body('help').append(step);});
    note('help','想换内容，去「玩法」。遇到显示问题，查看具体镜面上的工具。');
    let state;
    try{state=normalizeAppearance(JSON.parse(globalThis.localStorage.getItem(APPEARANCE_STORAGE_KEY)||'null'));}catch{state=normalizeAppearance(null);}
    const appearance=html('div','rh-ui-appearance',`<label for="rh_ui_theme">界面主题</label><select id="rh_ui_theme" class="text_pole"><option value="host">跟随酒馆主题</option>${UI_THEMES.map(t=>`<option value="${t.id}">${t.label}</option>`).join('')}<option value="custom">自定义配色</option></select><p data-rh-theme-label></p><div id="rh_ui_custom" class="rh-ui-custom-grid" hidden>${paletteKeys.map((key,i)=>`<label>${colorLabels[i]}<input type="color" data-rh-color="${key}" aria-label="${colorLabels[i]}"><span data-rh-color-value="${key}"></span></label>`).join('')}</div><div class="rh-ui-save-status" role="status" aria-live="polite"></div>`);body('appearance').append(appearance);
    const themeSelect=get('rh_ui_theme'),status=appearance.querySelector('.rh-ui-save-status');
    const modalIds=['rh_advanced_modal','rh_world_info_prompt_modal','rh_independent_tag_filter_modal'];
    function applyTheme(save=false){
        const preset=UI_THEMES.find(t=>t.id===state.mode);
        for(const target of [root,...modalIds.map(get).filter(Boolean)])applyAppearanceTheme(target,state);
        themeSelect.value=state.mode;get('rh_ui_custom').hidden=state.mode!=='custom';appearance.querySelector('[data-rh-theme-label]').textContent=preset?.label||(state.mode==='host'?'跟随酒馆主题':'自定义配色');
        for(const input of appearance.querySelectorAll('[data-rh-color]')){input.value=state.custom[input.dataset.rhColor];appearance.querySelector(`[data-rh-color-value="${input.dataset.rhColor}"]`).textContent=input.value;}
        if(save){try{globalThis.localStorage.setItem(APPEARANCE_STORAGE_KEY,JSON.stringify(state));status.textContent='外观已保存到此设备。';}catch{status.textContent='当前外观已应用，但此设备未能保存；重新进入后可能恢复原设置。';}}
    }
    listen(themeSelect,'change',()=>{state.mode=themeSelect.value;applyTheme(true);});
    listen(appearance,'input',e=>{const key=e.target.dataset.rhColor;if(paletteKeys.includes(key)){state.custom[key]=e.target.value;applyTheme(true);}});
    // Rename visible UI copy only. Values, bounds, defaults, IDs and handlers are retained.
    const walker=doc.createTreeWalker(root,globalThis.NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
        const n=walker.currentNode;if(n.parentElement?.closest('textarea,script,style'))continue;
        n.textContent=n.textContent.replaceAll('独立 API','副 API').replaceAll('跟随当前 API','跟随正文 API').replaceAll('高级生成参数','请求参数').replaceAll('保存高级参数','保存请求参数').replaceAll('高级：','').replaceAll('（高级，可编辑）','（可编辑）').replaceAll('打开此高级选项时','打开此页面时');
    }
    let active='settings',history=[],originFocus=null;
    const searchResults=make('section','rh-ui-search-results');searchResults.hidden=true;main.append(searchResults);
    function sync(){
        const follow=get('rh_generation_follow').checked;
        const timing=get('rh_independent_generation_timing').value;
        const timingTitle={auto:'自动生成',manual:'手动生成',off:'关闭'}[timing];
        get('rh_enabled').closest('.rabbit-mirror-primary-row').hidden=!follow;
        timingRow.hidden=follow;
        modeSummary.querySelector('[data-rh-source-label]').textContent=follow?'跟随正文 API':`使用副 API · ${timingTitle}`;
        modeSummary.querySelector('[data-rh-source-description]').textContent=follow?'使用聊天正在用的模型，不需要另外连接。':timing==='manual'?'先显示待生成外置框，等你点击“生成”才请求模型。':timing==='off'?'当前不生成兔子镜，已保存内容仍保留。':'按原有规则自动请求你配置的模型。';
        body('help').querySelector('[data-rh-timing-guide]').textContent=follow?'保持“随聊天生成小剧场”开启。按选好的生成与显示模式使用兔子镜。':timing==='manual'?'回到聊天，先看到待生成外置框。你判断正文完成后，点击框内“生成”。':timing==='off'?'副 API 当前关闭。需要生成时，先在“怎么生成兔子镜”选择自动生成或手动生成。':'回到聊天，发一条消息。兔子镜按原有自动规则生成。';
        connectionNudge.hidden=follow;nextConnection.hidden=follow;
        const rerollOn=get('rh_automatic_reroll_enabled').checked===true;
        const rerollFields=get('rh_automatic_reroll_fields');
        if(rerollFields) rerollFields.hidden=!rerollOn;
        connectionNudge.querySelector('strong').textContent=get('rh_independent_model').value?'连接与模型':'还没有配置副 API 模型';
        followDisplay.hidden=!follow;indDisplay.hidden=follow;
        const selected=(follow?followDisplay:indDisplay).querySelector('input:checked')?.value;
        displayRow.querySelector('small').textContent=selected==='inline'?'现在放在正文下方，跟着这条回复阅读。':selected==='external_then_inline'?'跟随正文内嵌：'+inner:'外置展示：'+outer;
        const count=get('rh_multiface_enabled').checked?get('rh_multiface_count').value:1;
        body('play').querySelector('[data-rh-route="faces"] small').textContent=`现在每轮生成 ${count} 面；想多看几种内容时再开启多面。`;
        for(const label of root.querySelectorAll('.rh-ui-choice'))label.classList.toggle('selected',label.querySelector('input').checked);
    }
    function paint(focus=false){
        const searching=!!search.value.trim();
        for(const [key,{panel}] of panels)panel.hidden=searching||key!==active;
        searchResults.hidden=!searching;
        if(searching){
            searchResults.replaceChildren(make('h2','','查找功能'));const q=search.value.trim().toLowerCase();
            for(const [key,[tab,title,desc]] of Object.entries(definitions)){
                if(key in tabNames)continue;
                if(!(title+' '+desc+' '+body(key).textContent).toLowerCase().includes(q))continue;
                const result=make('button','rh-ui-entry');result.type='button';result.dataset.rhSearchResult=key;result.append(make('span','',title),make('small','',tabNames[tab]+' ›'));searchResults.append(result);
            }
            if(searchResults.children.length===1)searchResults.append(make('p','','换个词试试，比如“多面”“母本”或“世界书”。'));
        }
        for(const tab of tabs.children){const selected=tab.dataset.rhTab===definitions[active][0];tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;}
        back.hidden=history.length===0&&!searching;
        if(active==='theaterFavorites'||active==='favorites'||active==='blacklist')onNavigate('preferences');
        if(active==='books')onNavigate('books');
        sync();main.scrollTop=0;if(focus&&!back.hidden)back.focus({preventScroll:true});
    }
    function navigate(key,remember=true){
        if(!panels.has(key))return;
        if(remember)history.push({key:active,query:search.value});
        active=key;search.value='';paint();
    }
    function goBack(){const prev=history.pop();if(prev){active=prev.key;search.value=prev.query;}else{active=definitions[active][0];search.value='';}paint(true);}
    // The main workbench must use the browser top layer just like its child
    // dialogs: host body transforms otherwise clip a position:fixed panel.
    const view = doc.defaultView;
    let viewportCleanup = null;
    function syncViewport(){
        if(root.hidden)return;
        const viewport=view?.visualViewport;
        const width=viewport?.width || view?.innerWidth;
        const height=viewport?.height || view?.innerHeight;
        if(!(width>0&&height>0))return;
        for(const [key,value] of Object.entries({width,height,left:viewport?.offsetLeft||0,top:viewport?.offsetTop||0})){
            const name='--rh-viewport-'+key, next=value+'px';
            if(root.style.getPropertyValue(name)!==next)root.style.setProperty(name,next);
        }
    }
    function trackViewport(){
        viewportCleanup?.();
        const viewport=view?.visualViewport;
        viewport?.addEventListener('resize',syncViewport);
        viewport?.addEventListener('scroll',syncViewport);
        view?.addEventListener('resize',syncViewport);
        viewportCleanup=()=>{
            viewport?.removeEventListener('resize',syncViewport);
            viewport?.removeEventListener('scroll',syncViewport);
            view?.removeEventListener('resize',syncViewport);
            viewportCleanup=null;
        };
        syncViewport();
    }
    function setOpen(open){
        if(open){
            originFocus=doc.activeElement;root.hidden=false;
            // Desktop hosts may not load the optional mobile dialog promoter.
            // Keep ordinary child overlays inside this modal's active subtree.
            for(const id of ['rh_world_info_prompt_modal','rh_independent_tag_filter_modal']){
                const modal=get(id);if(modal&&modal.tagName!=='DIALOG'&&!root.contains(modal))root.append(modal);
            }
            if(typeof root.showModal==='function'){if(!root.open)root.showModal();}
            else root.setAttribute('open','');
            trackViewport();applyTheme();paint();close.focus({preventScroll:true});
        }else{
            closeTheaterFavoriteViewer();
            closeTheaterFavoriteLibrary();
            viewportCleanup?.();
            if(root.open&&typeof root.close==='function')root.close();else root.removeAttribute('open');
            root.hidden=true;originFocus?.focus?.({preventScroll:true});
        }
    }
    listen(root,'cancel',event=>{
        if(event.target!==root)return;
        event.preventDefault();
        if(doc.querySelector('[data-rm-theater-favorite-viewer],[data-rm-theater-favorite-library]'))return;
        setOpen(false);
    });
    for(const [key,name] of Object.entries(tabNames)){const tab=button(name,()=>{history=[];navigate(key,false);});tab.dataset.rhTab=key;tab.setAttribute('role','tab');tabs.append(tab);}
    listen(tabs,'keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const items=[...tabs.children],i=items.indexOf(e.target);if(i<0)return;e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowLeft'?-1:1)+items.length)%items.length;items[j].click();items[j].focus();});
    listen(search,'input',()=>paint());
    listen(searchResults,'click',e=>{const result=e.target.closest('[data-rh-search-result]');if(result)navigate(result.dataset.rhSearchResult);});
    listen(root,'change',()=>sync());
    listen(root,'click',e=>{
        if(e.target!==root)return;
        if(doc.querySelector('[data-rm-theater-favorite-viewer],[data-rm-theater-favorite-library]'))return;
        setOpen(false);
    });
    listen(root,'keydown',e=>{
        if(e.target.closest?.('dialog')!==root)return;
        if(e.key==='Escape'){
            if(doc.querySelector('[data-rm-theater-favorite-viewer],[data-rm-theater-favorite-library]')){e.preventDefault();return;}
            e.preventDefault();setOpen(false);
        }
        if(e.key!=='Tab')return;
        const items=[...window.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')].filter(n=>!n.disabled&&n.getClientRects().length);
        const first=items[0],last=items.at(-1);if(e.shiftKey&&doc.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&doc.activeElement===last){e.preventDefault();first?.focus();}
    });
    const menu=get('extensionsMenu');
    get('rabbit_mirror_wand_bootstrap')?.remove();
    const entry=make('button','list-group-item flex-container flexGap5');
    entry.type='button';
    entry.id='rabbit_mirror_wand_entry';
    entry.style.cssText='background:transparent;background-color:transparent;color:inherit;border:0;box-shadow:none;appearance:none;-webkit-appearance:none;';
    entry.innerHTML='<span class="rabbit-mirror-wand-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M10 16C4 2 11 1 14 14M18 14C20 1 27 2 23 16M9 16c-7 11 3 15 9 14s13-8 5-14c-4-3-10-3-14 0Z"/><path d="M12 22h1m6 0h1m-6 4 2 1 2-1"/></svg></span><span>兔子镜</span>';
    entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls',root.id);
    listen(entry,'click',()=>setOpen(true));
    menu?.append(entry);
    const requiredControls=[...root.querySelectorAll('input[id],select[id],textarea[id]')].map(n=>n.id);
    root.__rabbitMirrorWorkbench={open:()=>setOpen(true),navigate,hasEntry:()=>entry.isConnected,
        isComplete:()=>requiredControls.every(id=>root.querySelectorAll('#'+id).length===1)};
    applyTheme();paint();
    const cleanup=()=>{closeTheaterFavoriteViewer();closeTheaterFavoriteLibrary();viewportCleanup?.();if(root.open&&typeof root.close==='function')root.close();listeners.splice(0).forEach(fn=>fn());entry.remove();delete root.__rabbitMirrorWorkbench;mounts.delete(root);};mounts.set(root,cleanup);
}
