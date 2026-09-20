// Split from ui.js — settings HTML strings only.

import { INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT, VISUAL_AVOID_PROMPT_MAX_CHARS, VISUAL_EXTRA_PROMPT_MAX_CHARS, VISUAL_PROMPT_MAX_CHARS } from '../settings.js?rmv=1.5.60-fork1';
import { BEHAVIOR_RULE_MAX_CHARS } from '../behaviorRules.js?rmv=1.5.53-cn-boundary1';
import { RUNTIME_VERSION, SETTINGS_UI_VERSION } from './runtime.js?rmv=1.5.64';

export function buildRabbitMirrorSettingsDialogHtml() {
    return `
<dialog id="rabbit_mirror_theater_settings" class="rabbit-mirror-settings" data-rabbit-mirror-ui-version="${SETTINGS_UI_VERSION}" data-rabbit-mirror-runtime-version="${RUNTIME_VERSION}" data-rabbit-mirror-ui-ready="false">
  <div class="inline-drawer">
    <div class="inline-drawer-toggle inline-drawer-header rabbit-mirror-drawer-header">
      <b>兔子镜小剧场</b><span class="rabbit-mirror-toto-watermark">TOTO · UI1</span>
      <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
    </div>
    <div class="inline-drawer-content">
      <div class="rabbit-mirror-primary-toggle">
        <div class="rabbit-mirror-primary-row">
          <label class="checkbox_label rabbit-mirror-enable-control">
            <input id="rh_enabled" type="checkbox">
            <span class="rabbit-mirror-enable-copy"><b>兔子镜自动注入</b><small>随回复生成；首次使用请配置不发送正则。</small></span>
          </label>
          <button id="rh_advanced_open" class="menu_button rabbit-mirror-advanced-launch" type="button" aria-haspopup="dialog" aria-controls="rh_advanced_modal">高级设置</button>
        </div>
      </div>

      <div class="rabbit-mirror-help-update-row">
        <details id="rh_quick_start" class="rabbit-mirror-quick-start">
          <summary>新手指引</summary>
          <div class="rabbit-mirror-quick-start-body" role="region" aria-label="新手指引"><p role="status">展开后加载使用指引，不会修改设置。</p></div>
        </details>
        <button id="rh_update_now" class="menu_button rabbit-mirror-update-button" type="button">检查并更新</button>
      </div>
      <div id="rh_update_status" class="rabbit-mirror-update-status" role="status" aria-live="polite" hidden></div>
      <button id="rh_update_reload" class="menu_button" type="button" hidden>刷新并加载已安装版本</button>

      <details id="rh_token_meter" class="rabbit-mirror-token-meter" aria-live="polite">
        <summary class="rabbit-mirror-token-meter-head">
          <span class="rabbit-mirror-token-meter-label">Prompt 估算</span>
          <span data-rh-token-meter-main>尚无生成记录</span>
        </summary>
        <div class="rabbit-mirror-token-meter-body">
          <div data-rh-token-meter-exact class="rabbit-mirror-token-meter-exact">下一轮生成后更新。</div>
          <div data-rh-token-meter-detail class="rabbit-mirror-token-meter-detail">只统计兔子镜自己的 Prompt。</div>
          <div id="rh_independent_api_diagnostic" style="padding:7px 9px;border-left:2px solid color-mix(in srgb, var(--SmartThemeBorderColor) 65%, transparent);opacity:.78;font-size:11px;line-height:1.5;word-break:break-word;">最近请求：暂无记录</div>
          <div class="rabbit-mirror-token-meter-note">仅为本地 Prompt 估算，不是服务商账单 Token；记录在请求发送前生成。</div>
        </div>
      </details>

      <details class="rabbit-mirror-section">
        <summary><span>生成方式</span><span class="rabbit-mirror-section-note">跟随 / 独立</span></summary>
        <div class="rabbit-mirror-section-content">
          <label class="checkbox_label"><input name="rh_generation_source" id="rh_generation_follow" type="radio" value="follow"> 跟随当前 API</label>
          <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.72;font-size:12px;line-height:1.45;">跟着当前回复一起生成兔子镜。</div>
          <div id="rh_follow_display_row" style="margin-left:26px;padding:7px 10px;border-left:2px solid color-mix(in srgb, var(--SmartThemeBorderColor) 60%, transparent);">
            <label><input name="rh_follow_display" type="radio" value="inline"> 正文下方</label>
            <label style="margin-left:14px;"><input name="rh_follow_display" type="radio" value="external"> 外置弹窗</label>
            <div id="rh_follow_regex_helper" style="margin-top:9px;padding-top:8px;border-top:1px solid color-mix(in srgb,currentColor 12%,transparent);">
              <div data-rh-no-send-regex-status style="font-size:11px;line-height:1.45;opacity:.78;">不发送兔子镜正则：正在检测…</div>
              <div class="flex-container" style="gap:7px;flex-wrap:wrap;margin-top:6px;">
                <button class="menu_button rh_regex_configure" type="button">一键配置正则</button>
                <button class="menu_button rh_regex_open" type="button">查看酒馆正则</button>
              </div>
            </div>
          </div>
          <label class="checkbox_label" style="margin-top:12px;"><input name="rh_generation_source" id="rh_generation_independent" type="radio" value="independent"> 使用独立 API</label>
          <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.72;font-size:12px;line-height:1.45;">正文先生成，回复结束后再用独立 API 单独生成兔子镜；具体配置在下面的独立分区。</div>
          <div id="rh_independent_generation_timing_row">
            <label for="rh_independent_generation_timing">副 API 什么时候生成</label>
            <select id="rh_independent_generation_timing" class="text_pole">
              <option value="auto">自动生成</option>
              <option value="manual">手动生成</option>
              <option value="off">关闭</option>
            </select>
            <p id="rh_independent_generation_timing_hint" class="rabbit-mirror-subnote" aria-live="polite"></p>
          </div>
        </div>
      </details>

      <details class="rabbit-mirror-section" id="rh_independent_api_section">
        <summary><span>独立 API</span><span class="rabbit-mirror-section-note">连接 · 模型 · 显示</span></summary>
        <div class="rabbit-mirror-section-content">
          <div id="rh_independent_mode_status" aria-live="polite" style="padding:7px 9px;border-left:2px solid color-mix(in srgb,var(--SmartThemeBorderColor) 65%,transparent);opacity:.78;font-size:11px;line-height:1.45;">正在读取当前生成模式……</div>
          <details id="rh_behavior_rules" style="margin:12px 0;min-width:0;border:2px solid var(--SmartThemeQuoteColor,currentColor);border-radius:10px;background:color-mix(in srgb,var(--SmartThemeQuoteColor,currentColor) 7%,transparent);">
            <summary id="rh_behavior_rule_heading" style="cursor:pointer;padding:13px 14px;font-size:16px;font-weight:700;">补充创作规则 · 独立 API</summary>
            <div style="padding:0 14px 14px;">
              <label for="rh_behavior_rule_mode" style="display:block;font-weight:700;margin:8px 0;">注入方式</label>
              <select id="rh_behavior_rule_mode" class="text_pole" style="width:100%;max-width:100%;box-sizing:border-box;min-height:44px;">
                <option value="always">每轮注入</option><option value="off">不注入</option><option value="adult-only">仅在抽到成人内容时注入</option>
              </select>
              <label for="rh_behavior_rule_text" style="display:block;font-weight:700;margin:8px 0;">补充规则完整内容（可编辑或留空）</label>
              <textarea id="rh_behavior_rule_text" class="text_pole" rows="10" maxlength="${BEHAVIOR_RULE_MAX_CHARS}" spellcheck="false" aria-describedby="rh_behavior_rule_help" style="width:100%;max-width:100%;min-height:200px;box-sizing:border-box;resize:vertical;font-size:14px;line-height:1.6;"></textarea>
              <div id="rh_behavior_rule_help" style="font-size:12px;line-height:1.6;">仅作用于独立 API，不改变正文连接。</div>
              <div class="flex-container" style="gap:8px;flex-wrap:wrap;margin:10px 0;">
                <button id="rh_behavior_rule_save" class="menu_button" type="button" style="min-height:44px;font-weight:700;">保存创作规则</button>
                <button id="rh_behavior_rule_clear" class="menu_button" type="button" style="min-height:44px;">清空内容</button>
                <button id="rh_behavior_rule_reset" class="menu_button" type="button" style="min-height:44px;">恢复默认</button>
              </div>
              <div id="rh_behavior_rule_status" role="status" aria-live="polite" style="font-size:13px;line-height:1.6;"></div>
            </div>
          </details>
          <div id="rh_independent_api_fields" style="display:grid;gap:9px;">
            <div style="padding:10px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:10px;">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">独立 API 生成方式</div>
            <div id="rh_independent_display_row" class="flex-container" style="gap:14px;flex-wrap:wrap;align-items:center;">
              <label><input name="rh_independent_display" type="radio" value="external"> ① 轻壳外置（标题有壳）</label>
              <label><input name="rh_independent_display" type="radio" value="external_then_inline"> ② 外置后内嵌</label>
            </div>
              <div style="opacity:.66;font-size:11px;line-height:1.45;margin-top:6px;">只决定副 API 成品显示在哪里，不改变提示词、美化规则或模型。</div>
              <div style="opacity:.72;font-size:11px;line-height:1.5;margin-top:8px;">副 API 本轮若没有可用鲜兔镜，会按「自动重 roll 次数」自动再发（默认 2 次，合计请求 = 1 + 该次数）。0 表示失败后不再自动重发。已出的 ready 镜面不会被失败卡盖掉。</div>
            </div>
            <div style="padding:9px 10px;border:1px solid color-mix(in srgb, currentColor 16%, transparent);border-radius:9px;">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">连接与模型</div>
              <div class="flex-container" style="gap:7px;flex-wrap:wrap;align-items:center;">
                <button id="rh_independent_import_current" class="menu_button" type="button" style="font-weight:700;">从酒馆当前连接一键配置</button>
                <span id="rh_independent_connection_status" style="opacity:.72;font-size:11px;line-height:1.4;">尚未配置</span>
              </div>
              <div style="opacity:.78;font-size:11px;line-height:1.45;margin-top:5px;">仅“酒馆 Connection Profile 一键配置”需要 SillyTavern 1.18.0 及以上版本；旧版仍可使用兔子镜及下方“手动 OpenAI 兼容接口”。</div>
              <button id="rh_independent_models" class="menu_button" type="button" style="margin-top:8px;">从此酒馆连接拉取模型</button>
            </div>
            <div class="flex-container" style="gap:7px;flex-wrap:wrap;">
              <button id="rh_independent_test" class="menu_button" type="button">测试连接</button>
            </div>
            <select id="rh_independent_model_select" class="text_pole" aria-label="已拉取模型列表">
              <option value="">请从酒馆连接或手动接口拉取模型</option>
            </select>
            <input id="rh_independent_model" class="text_pole" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="模型 ID；可从上方完整列表选择，也可直接手动填写">
            <div id="rh_independent_model_list_source" aria-live="polite" style="opacity:.7;font-size:11px;line-height:1.45;">模型列表尚未拉取。列表来源与当前实际模型会分别标明。</div>
            <details id="rh_independent_manual_legacy" style="margin-top:2px;">
              <summary style="cursor:pointer;font-size:11px;opacity:.7;">高级：手动 OpenAI 兼容接口（旧配置兼容）</summary>
              <div style="display:grid;gap:6px;padding-top:7px;">
                <input id="rh_independent_base" class="text_pole" type="text" inputmode="url" autocapitalize="off" spellcheck="false" placeholder="API 地址">
                <input id="rh_independent_key" class="text_pole" type="password" autocomplete="off" placeholder="API Key">
                <div class="flex-container" style="gap:7px;flex-wrap:wrap;">
                  <button id="rh_independent_manual_models" class="menu_button" type="button">从此手动接口拉取模型</button>
                  <button id="rh_independent_use_manual" class="menu_button" type="button">改用这组手动接口</button>
                </div>
              </div>
            </details>
            <div class="flex-container" style="gap:8px;flex-wrap:wrap;align-items:center;padding:9px 10px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:9px;">
              <label>温度 <input id="rh_independent_temperature" class="text_pole" type="number" min="0" max="2" step="0.1" style="width:82px;"></label>
              <label>整批最大输出 <input id="rh_independent_max_tokens" class="text_pole" type="number" min="512" max="32000" step="256" style="width:110px;"></label>
              <label>自动重 roll 次数 <input id="rh_independent_automatic_reroll" class="text_pole" type="number" min="0" max="10" step="1" style="width:72px;"></label>
            </div>
            <div class="rabbit-mirror-independent-advanced-row">
              <details id="rh_independent_request_advanced" class="rabbit-mirror-request-options">
                <summary>高级生成参数 <span>排除参数 · 推理强度</span></summary>
                <div class="rabbit-mirror-request-options-body">
                  <label class="rabbit-mirror-request-enable"><input id="rh_independent_advanced_enabled" type="checkbox"> 启用高级生成参数</label>
                  <p id="rh_independent_advanced_help">仅作用于兔子镜独立 API。默认关闭，不改变原请求；关闭时可保存草稿，但不会发送。参数是否被模型支持，取决于你的接口。</p>
                  <label for="rh_independent_reasoning_effort">推理强度（reasoning_effort）</label>
                  <select id="rh_independent_reasoning_effort" class="text_pole" aria-describedby="rh_independent_advanced_help">
                    <option value="">默认：不覆盖</option><option value="none">关闭推理 · none</option>
                    <option value="minimal">最低 · minimal</option><option value="low">低 · low</option>
                    <option value="medium">中 · medium</option><option value="high">高 · high</option>
                    <option value="xhigh">极高 · xhigh</option><option value="max">最大 · max</option>
                  </select>
                  <fieldset id="rh_independent_excluded_params" aria-describedby="rh_independent_excluded_help">
                    <legend>排除参数（勾选 = 不发送）</legend>
                    <p id="rh_independent_excluded_help">从请求中移除这些字段，不是设为 0。取消勾选恢复原请求逻辑，不改正文连接的设置；推理强度单独保留。</p>
                    <div class="rabbit-mirror-exclusion-grid">
                      ${[
                          ['temperature', '温度'], ['frequency_penalty', '频率惩罚'],
                          ['presence_penalty', '存在惩罚'], ['top_p', 'Top P'],
                          ['top_k', 'Top K'], ['seed', '种子'], ['min_p', 'Min P'],
                          ['top_a', 'Top A'], ['typical_p', 'Typical P'], ['repetition_penalty', '重复惩罚'],
                      ].map(([field, label]) => `<label class="rabbit-mirror-request-enable"><input type="checkbox" name="rh_independent_excluded_param" value="${field}" data-rh-exclude-param="${field}"><span>${label}<small>${field}</small></span></label>`).join('')}
                    </div>
                    <div class="rabbit-mirror-request-options-actions">
                      <button id="rh_independent_exclude_common" class="menu_button" type="button">选中常用四项</button>
                      <button id="rh_independent_exclude_none" class="menu_button" type="button">取消所有排除</button>
                    </div>
                    <p>常用四项：温度、频率惩罚、存在惩罚、Top P。选好后点击下方“保存高级参数”。排除优先于下方合法 JSON 中的同名参数，保留编辑框内容。</p>
                  </fieldset>
                  <label for="rh_independent_extra_params">附加生成参数（JSON 对象，可留空）</label>
                  <textarea id="rh_independent_extra_params" class="text_pole" rows="5" maxlength="8192" autocapitalize="off" autocomplete="off" spellcheck="false" aria-describedby="rh_independent_extra_help rh_independent_advanced_error" placeholder='例如：{"top_p": 0.9, "seed": 42}'></textarea>
                  <div id="rh_independent_advanced_error" role="alert" aria-live="polite" hidden></div>
                  <p id="rh_independent_extra_help">支持 reasoning_effort、top_p、min_p、top_a、typical_p、top_k、frequency_penalty、presence_penalty、repetition_penalty、seed、verbosity。只接受这些生成参数，不接受对象／数组、模型、消息、密钥或网络设置；JSON 中的推理强度不能与上方选择冲突。</p>
                  <p>参数范围：top_p / min_p / top_a / typical_p 为 0–1；top_k 为 0–1000000 的整数；frequency_penalty / presence_penalty 为 −2–2；repetition_penalty 大于 0 且不超过 10；seed 为安全整数；verbosity 为 low / medium / high。你的模型可能只支持其中一部分。</p>
                  <p>当前支持手动 OpenAI 兼容接口，以及自定义 Chat Completions 类型的连接 Profile。其它连接或协议不支持这条直传路径时，将在发送前提示；不会自动切换连接或重试。TT 的宿主权限仍可能限制透传。</p>
                  <div class="rabbit-mirror-request-options-actions">
                    <button id="rh_independent_advanced_save" class="menu_button" type="button">保存高级参数</button>
                    <button id="rh_independent_extra_clear" class="menu_button" type="button">清空附加参数</button>
                    <button id="rh_independent_advanced_reset" class="menu_button" type="button">恢复默认</button>
                  </div>
                  <div id="rh_independent_advanced_status" role="status" aria-live="polite"></div>
                </div>
              </details>
            </div>
            <div class="rabbit-mirror-independent-advanced-row">
              <div class="rabbit-mirror-independent-advanced-copy"><b>读取内容与隐私</b><span>聊天层数、角色卡 / Persona、世界书与正文标签过滤</span></div>
              <button id="rh_independent_advanced_open" class="menu_button" type="button">管理读取内容</button>
            </div>
            <div style="opacity:.72;font-size:11px;line-height:1.45;">温度建议 <b>1.0</b>。</div>
            <div style="opacity:.66;font-size:11px;line-height:1.45;">一键配置时不保存 API Key；旧手动模式仍按原逻辑保存在当前 SillyTavern 扩展设置里。</div>
          </div>
        </div>
      </details>

      <details class="rabbit-mirror-section rabbit-mirror-tools">
        <summary><span>工具与维护</span><span class="rabbit-mirror-section-note">正则 · 诊断 · 重置</span></summary>
        <div class="rabbit-mirror-section-content">
          <div class="rabbit-mirror-regex-helper">
            <div style="font-weight:600;margin-bottom:6px;">不发送兔子镜正则</div>
            <div data-rh-no-send-regex-status style="opacity:.82;font-size:12px;margin-bottom:8px;">正在检测酒馆 Regex 配置…</div>
            <div class="flex-container" style="gap:7px;flex-wrap:wrap;">
              <button class="menu_button rh_regex_configure" type="button">一键配置正则</button>
              <button class="menu_button rh_regex_open" type="button">查看酒馆正则</button>
              <button id="rh_copy_regex" class="menu_button" type="button">复制推荐正则</button>
            </div>
          </div>
          <div class="rabbit-mirror-regex-helper" style="margin-top:10px;">
            <div style="font-weight:600;margin-bottom:6px;">禁词表（本地过滤）</div>
            <div style="opacity:.76;font-size:12px;line-height:1.5;margin-bottom:7px;">一行一条：原词 =&gt; 替换词。只填原词或右边留空就是删除。使用本地字面匹配，不执行输入的正则表达式；只改兔子镜文字，不改正文或代码，不占 Prompt / Token。</div>
            <label for="rh_banned_words">替换规则</label>
            <textarea id="rh_banned_words" class="text_pole" spellcheck="false" style="width:100%;min-height:180px;resize:vertical;box-sizing:border-box;" placeholder="旧称呼 => 新称呼\n要删除的词"></textarea>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
              <label style="min-width:0;">查找原文<input id="rh_replacement_find" class="text_pole" type="text" maxlength="80" style="width:100%;min-width:0;max-width:100%;box-sizing:border-box;" /></label>
              <label style="min-width:0;">替换为（留空删除）<input id="rh_replacement_value" class="text_pole" type="text" maxlength="240" style="width:100%;min-width:0;max-width:100%;box-sizing:border-box;" /></label>
            </div>
            <button id="rh_replacement_add" class="menu_button" type="button">添加到规则列表</button>
            <div class="flex-container" style="gap:7px;align-items:center;flex-wrap:wrap;margin-top:7px;">
              <button id="rh_banned_words_save" class="menu_button" type="button">保存禁词表</button>
              <span id="rh_banned_words_status" style="font-size:11px;opacity:.72;"></span>
            </div>
          </div>
          <div class="rabbit-mirror-actions">
            <button id="rh_clear_last" class="menu_button">清除抽签历史与冷却记录</button>
            <button id="rh_clear_injection" class="menu_button">清空当前注入</button>
            <button id="rh_reset" class="menu_button">恢复默认设置</button>
          </div>
          <div id="rh_external_library_actions" style="padding:10px 11px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:10px;">
            <div style="font-weight:700;">把你的文字、玩法或世界书加入母本库</div>
            <div style="font-size:12px;line-height:1.5;margin-top:4px;">不会进入兔子镜内置，感谢各位制作小剧场的老师，请征求作者同意后使用。</div>
            <div class="rh-library-quick-actions">
              <button id="rh_external_plain_open" class="menu_button" type="button">粘贴文字</button>
              <button id="rh_external_file_open" class="menu_button" type="button">导入文件（TXT / MD / JSON）</button>
              <button id="rh_external_transfer_open" class="menu_button" type="button">换设备：导出／导入整库</button>
              <button id="rh_external_worldbook_open" class="menu_button" type="button">管理母本库</button>
            </div>
            <div style="font-size:12px;line-height:1.6;margin-top:8px;">首次导入：填写文字或选择文件 → 确认分类 → 保存 → 启用库并打开外部抽签。换设备：旧设备导出整库文件，再到新设备导入。</div>
          </div>
          <section id="rh_manual_entry_diag" style="margin-top:12px;padding:12px;border:1px solid currentColor;border-radius:10px;">
            <strong>手动生成没有外置框？</strong>
            <p>先开始记录，再回到聊天正常发送一条消息。角色回复后，回来结束记录并复制报告。没有兔子镜也能使用。</p>
            <p>只记录触发与挂载状态，不读取正文、不调用模型。与宿主性能诊断分开。</p>
            <div class="flex-container flexGap5"><button id="rh_manual_diag_start" class="menu_button" type="button">开始记录</button><button id="rh_manual_diag_stop" class="menu_button" type="button">结束并生成报告</button><button id="rh_manual_diag_copy" class="menu_button" type="button">复制报告</button></div>
            <p id="rh_manual_diag_status" role="status"></p>
            <textarea id="rh_manual_diag_output" class="text_pole" aria-label="手动入口诊断报告" readonly spellcheck="false" hidden style="width:100%;min-height:220px;user-select:text;-webkit-user-select:text;"></textarea>
          </section>
          <div style="margin-top:12px;padding:10px 11px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:10px;">
            <div style="font-weight:700;">🛰 外部代码／宿主性能诊断（测试版）</div>
            <div style="opacity:.74;font-size:11px;line-height:1.5;margin-top:4px;">只诊断 <b>SillyTavern 本体、其他扩展、浏览器主线程和网络</b>：聊天为什么空白、发送为什么迟滞、AI 请求何时真正发出、维修兔点击后是否被外部脚本/网络阻塞。<br><b>不读取兔子镜内部生成或维修状态。</b> 兔子镜内部问题仍请使用对应兔子镜里的「📋 生成全链路诊断」，两份报告互不合并。</div>
            <div id="rh_external_diag_status" style="margin-top:7px;opacity:.82;font-size:11px;line-height:1.45;">默认关闭（零常驻监听）；需要复现问题时再手动开启。</div>
            <div class="flex-container" style="gap:7px;flex-wrap:wrap;margin-top:8px;">
              <button id="rh_external_diag_start" class="menu_button" type="button" style="font-weight:700;">开始新诊断</button>
              <button id="rh_external_diag_stop" class="menu_button" type="button">结束并生成报告</button>
              <button id="rh_external_diag_report" class="menu_button" type="button" style="font-weight:700;">查看当前／最后报告</button>
              <button id="rh_external_diag_copy" class="menu_button" type="button">复制外部报告</button>
                <button id="rh_tt_diag_start" class="menu_button" type="button" hidden style="display:none!important;min-height:44px;">开始 TT 诊断（20 秒）</button>
                <button id="rh_tt_diag_copy" class="menu_button" type="button" hidden style="display:none!important;min-height:44px;">复制 TT 诊断</button>
              <button id="rh_external_diag_reset" class="menu_button" type="button">清空外部记录</button>
            </div>
            <div id="rh_tt_diag_status" role="status" style="display:none;margin-top:7px;opacity:.82;font-size:11px;line-height:1.45;"></div>
            <textarea id="rh_tt_diag_output" class="text_pole" aria-label="TT 诊断报告" readonly spellcheck="false" style="display:none;width:100%;min-height:220px;max-height:50vh;resize:vertical;box-sizing:border-box;margin-top:8px;font:11px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;user-select:text;-webkit-user-select:text;"></textarea>
            <textarea id="rh_external_diag_output" class="text_pole" readonly spellcheck="false" style="display:none;width:100%;min-height:240px;resize:vertical;box-sizing:border-box;margin-top:8px;font:11px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;"></textarea>
          </div>
        </div>
      </details>

      <details id="rh_theater_favorite_section" class="rabbit-mirror-section">
        <summary><span>🐇 兔子镜收藏夹</span><span class="rabbit-mirror-section-note">回看成品</span></summary>
        <div class="rabbit-mirror-section-content">
          <div class="rabbit-mirror-subnote" style="opacity:.76;font-size:12px;line-height:1.5;margin-bottom:7px;">这里回看已经收藏的兔子镜成品，按角色卡分组。打开时走原挂载管线并保留交互，不写入主楼 Prompt。聊天里也可在镜面工具菜单点「打开收藏夹」。与下方「收藏室」（只调抽签权重）不是同一件事。</div>
          <div id="rh_theater_favorite_summary" style="padding:8px 9px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:8px;font-size:11px;line-height:1.45;"><div style="opacity:.6;">展开后显示兔子镜收藏夹。</div></div>
          <button id="rh_theater_favorite_open_library" class="menu_button" type="button" style="margin-top:7px;">打开收藏夹面板</button>
        </div>
      </details>

      <details id="rh_random_preference_section" class="rabbit-mirror-section">
        <summary><span>抽签收藏与黑名单</span><span class="rabbit-mirror-section-note">随机权重</span></summary>
        <div class="rabbit-mirror-section-content">
          <div style="padding-bottom:10px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);">
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_blacklist_enabled" type="checkbox"> 🚫 启用抽签黑名单</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 7px 26px;opacity:.76;font-size:12px;line-height:1.5;">加入黑名单后，从下一轮随机抽取开始直接从候选池排除；不增加 Token。明确点菜和固定动态视觉场景仍可覆盖随机黑名单。</div>
            <div id="rh_blacklist_summary" class="rabbit-mirror-blacklist-summary" style="padding:8px 9px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:8px;font-size:11px;line-height:1.45;"><div style="opacity:.6;">展开后显示黑名单。</div></div>
            <button id="rh_blacklist_clear" class="menu_button" type="button" style="margin-top:7px;">清空全部黑名单</button>
          </div>
          <div style="margin-top:11px;">
            <div style="font-weight:700;margin-bottom:6px;">⭐ 收藏室</div>
            <div class="rabbit-mirror-subnote" style="opacity:.76;font-size:12px;line-height:1.5;margin-bottom:7px;">只提高之后抽到该主题／形式的权重，不是回看成品的地方。</div>
            <div id="rh_favorite_summary" style="padding:8px 9px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:8px;font-size:11px;line-height:1.45;"><div style="opacity:.6;">展开后显示收藏室。</div></div>
            <button id="rh_favorite_clear" class="menu_button" type="button" style="margin-top:7px;">清空全部收藏</button>
          </div>
        </div>
      </details>

      <div id="rh_advanced_modal" class="rabbit-mirror-advanced-modal" role="dialog" aria-modal="true" aria-label="兔子镜高级设置" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:2147483000;background:rgba(8,10,14,.62);box-sizing:border-box;padding-top:max(24px,calc(env(safe-area-inset-top) + 14px));padding-right:max(12px,calc(env(safe-area-inset-right) + 8px));padding-bottom:max(24px,calc(env(safe-area-inset-bottom) + 14px));padding-left:max(12px,calc(env(safe-area-inset-left) + 8px));align-items:center;justify-content:center;overflow:hidden;pointer-events:auto;">
        <div id="rh_advanced_modal_card" style="width:min(760px,calc(100vw - 24px));max-width:100%;max-height:88vh;max-height:calc(100dvh - 76px - env(safe-area-inset-top) - env(safe-area-inset-bottom));display:flex;flex-direction:column;min-height:0;overflow:hidden;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);box-sizing:border-box;pointer-events:auto;">
          <div id="rh_advanced_modal_header" style="display:grid;grid-template-columns:auto minmax(0,1fr) 40px;align-items:center;gap:8px;flex:0 0 auto;padding:11px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);background:var(--SmartThemeBlurTintColor,#202226);">
            <button id="rh_advanced_back_top" class="menu_button" type="button" aria-label="返回高级选项" title="返回高级选项" style="display:none;min-width:84px;height:38px;padding:0 10px;border-radius:12px;font-size:12px;line-height:1;">← 高级选项</button>
            <div style="min-width:0;text-align:left;"><b id="rh_advanced_modal_title" style="font-size:15px;">高级设置</b><div id="rh_advanced_modal_hint" style="opacity:.65;font-size:11px;line-height:1.35;margin-top:2px;white-space:normal;">选择要调整的项目</div></div>
            <button id="rh_advanced_close" class="menu_button" type="button" aria-label="关闭高级设置" title="关闭" style="width:38px;min-width:38px;height:38px;padding:0;border-radius:12px;font-size:20px;line-height:1;">×</button>
          </div>
          <div id="rh_advanced_scroll" style="flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;padding:14px 14px max(18px,env(safe-area-inset-bottom));box-sizing:border-box;">
          <div id="rh_advanced_menu" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:9px;">
            <button class="menu_button rh-advanced-choice" type="button" data-page="generation" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🎛️ 生成与抽取</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">抽取模式、参考内容、世界观锁与冷却</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="visual" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🎨 个性化视觉提示词</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">额外视觉偏好、避雷与通用视觉规则</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="memory" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🧠 共同回忆资料来源</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">记忆插件接口／绑定记忆世界书</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="worldinfo" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🔌 独立 API</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">补充创作规则、读取范围、世界书与正文标签</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="repair" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">🐈‍⬛🐇 挨打猫与维修兔</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">美化反馈、维修兔与自动巡逻</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="external" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;"><span style="display:block;font-weight:700;font-size:13px;">📚 母本库：导入与备份</span><span style="display:block;opacity:.64;font-size:10px;line-height:1.4;margin-top:3px;">粘贴文字、导入文件、换设备</span></button>
            <button class="menu_button rh-advanced-choice" type="button" data-page="replacement" style="min-height:66px;text-align:left;padding:11px 12px;border-radius:12px;">🚫 禁词与文字替换</button>
          </div>

          <div id="rh_advanced_page_external" class="rh-advanced-page" data-title="母本库：导入与备份" style="display:none;">
            <div style="font-size:12px;line-height:1.6;margin-bottom:10px;">想加入自己的小剧场，或把已导入的库带到另一台设备？都从这里操作；不导入也能直接使用兔子镜。</div>
            <div style="display:grid;gap:7px;margin-bottom:10px;font-size:12px;line-height:1.55;">
              <div><b>粘贴文字：</b>填名称、贴文字 → 读取并确认分类。主题是“演什么”，展现形式是“怎么玩” → 保存，无需转成 JSON。</div>
              <div><b>导入文件：</b>选择 TXT / MD / JSON 或世界书文件 → 读取 → 确认分类 → 保存；兔子镜整库备份会自动进入导入确认。</div>
              <div><b>换设备：</b>旧设备导出整库备份 → 把文件传到新设备 → 新设备导入 → 核对并确认保存。</div>
              <div><b>启用方式：</b>新导入的库默认停用。保存后请在“管理母本库”启用新库，并打开“外部母本参与抽签”。同编号的已有库会跳过、不覆盖，抽签总开关也不会自动替你打开。</div>
            </div>
          </div>
          <div id="rh_advanced_page_replacement" class="rh-advanced-page" data-title="🚫 禁词与文字替换" style="display:none;"></div>
          <div id="rh_advanced_page_generation" class="rh-advanced-page" data-title="生成与抽取" style="display:none;">
            <label for="rh_multiface_enabled" class="checkbox_label"><input id="rh_multiface_enabled" type="checkbox" aria-describedby="rh_multiface_help" aria-controls="rh_multiface_count_row"> 多面兔子镜</label>
            <div id="rh_multiface_count_row" hidden style="margin:6px 0 6px 26px;">
              <label for="rh_multiface_count">每轮生成
                <select id="rh_multiface_count" class="text_pole" style="width:auto;min-height:36px;">
                  <option value="2">2 面</option><option value="3">3 面</option><option value="4">4 面</option><option value="5">5 面</option>
                </select>
              </label>
            </div>
            <div id="rh_multiface_help" class="rabbit-mirror-subnote" style="margin:0 0 10px 26px;">一次请求，各面独立展示。所有面共用整批输出上限，面数更多时每面可用篇幅更少；上下文字符不是绘制额度。</div>
            <div id="rh_face_presentation_modes" style="display:grid;gap:8px;margin:10px 0;">
              <b>每一面怎么呈现</b>
              ${Array.from({length:5},(_,index)=>`<label data-rh-presentation-row="${index}" for="rh_face_mode_${index}" style="display:flex;gap:12px;align-items:center;justify-content:space-between;">
                <span>第 ${index+1} 面</span><select id="rh_face_mode_${index}" class="text_pole" style="min-height:44px;width:160px;max-width:65%;" aria-describedby="rh_face_modes_help"><option value="auto">自动</option><option value="html">HTML 交互</option><option value="text">文本</option></select>
              </label>`).join('')}
              <div id="rh_face_modes_help" class="rabbit-mirror-subnote">自动：抽中文本类才用文本呈现。文本：优先抽已启用的文本类，没有可用条目则正常抽取，改成长文本与 HTML 排版，不要求内部交互。其他 HTML 面照常生成。</div>
            </div>
            <label for="rh_sampling_mode" class="flex-container alignitemscenter" style="gap:8px;flex-wrap:wrap;margin:8px 0;">
              <span>抽取模式</span>
              <select id="rh_sampling_mode" class="text_pole" style="max-width:300px;">
                <option value="classic">主题元素 + 展现形式（经典模式）</option>
                <option value="format_only">仅展现形式</option>
              </select>
            </label>
            <label for="rh_raw_policy" class="flex-container alignitemscenter" style="gap:8px;flex-wrap:wrap;margin:8px 0;">
              <span>参考内容</span>
              <select id="rh_raw_policy" class="text_pole" style="max-width:320px;">
                <option value="compact">精简：Prompt 较短，Token 较少</option>
                <option value="balanced">均衡：Prompt 长度适中（默认）</option>
                <option value="full">完整：Prompt 较长，参考内容更多</option>
              </select>
            </label>
            <div class="rabbit-mirror-subnote" style="margin:-4px 0 8px 0;opacity:.72;font-size:12px;line-height:1.45;">控制随机生成时使用的参考内容多少。默认使用“均衡”。</div>
            <div id="rh_image_settings">
              <label class="checkbox_label"><input id="rh_image_enabled" type="checkbox"> 启用镜面生图</label>
              <p>默认关闭。从每面的小兔子工具入口打开「生图」。首次点击生成时，使用当前副 API 构思一次，再调用柏宝绘出图一次；查看、编辑不调用模型。</p>
              <label>提示词格式 <select id="rh_image_prompt_format" class="text_pole"><option value="nai5-natural">自然语言＋标签（NAI 5）</option><option value="nai45-tags">标签（NAI 4.5）</option></select></label>
              <p>模型、密钥、画幅像素等在柏宝绘配置。这里的格式只决定提示词写法，不替换它的模型。柏宝绘内部重试遵循其原有规则。</p>
              <button type="button" id="rh_image_status_refresh" class="menu_button">检查柏宝绘连接</button><p id="rh_image_provider_status" role="status">点击检查读取当前连接状态，不发起生图。</p>
            </div>
            <label class="checkbox_label"><input id="rh_creative_expansion" type="checkbox"> 发散孵化模式</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">开启后会探索更随机、更跳脱的内容组合。</div>
            <label class="checkbox_label"><input id="rh_force_visual_scenery" type="checkbox"> 动态视觉场景</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">开启后，HTML 面固定保留动态视觉场景；文本面不受影响。</div>
            <label class="checkbox_label"><input id="rh_visual_scenery_combination" type="checkbox"> 动态视觉同时组合其他展现形式</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">默认关闭。与动态视觉场景一起开启后，保留动态画面，同时按原数量和偏好抽取其他展现形式，保留它们的内容、阅读方式与玩法；文本面不受影响。</div>
            <label for="rh_enhanced_visual_drawing" class="checkbox_label"><input id="rh_enhanced_visual_drawing" type="checkbox" aria-describedby="rh_enhanced_visual_drawing_help"> 增强视觉绘制</label>
            <div id="rh_enhanced_visual_drawing_help" class="rabbit-mirror-subnote" style="margin:0 0 8px 26px;">加强画面细节、层次与互动；可与动态视觉场景一起开启。</div>
            <label class="checkbox_label"><input id="rh_user_directive" type="checkbox"> 用户指令优先</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">开启后，可以自由点菜自己喜欢的任意内容。</div>
            <label class="checkbox_label"><input id="rh_worldview_lock" type="checkbox"> 展现形式世界观锁</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.72;font-size:12px;line-height:1.45;">保留展现形式功能与结构，只转换不合当前世界观的具体载体；开启时会提示把抽取模式切换为“仅展现形式”。</div>
            <label class="checkbox_label"><input id="rh_avoid_repeat" type="checkbox"> 10轮冷却：避免重复主题/展现形式/整体观感</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 2px 26px;opacity:.72;font-size:12px;line-height:1.45;">仅记录已经实际生成成功的兔子镜；用于避免连续复用相近的结构骨架与整体视觉家族。</div>
          </div>

          <div id="rh_advanced_page_visual" class="rh-advanced-page" data-title="个性化视觉提示词" style="display:none;">
            <div style="opacity:.82;font-size:12px;line-height:1.55;margin-bottom:9px;">这里可以直接写你喜欢或不喜欢的画面感觉。只有勾选下面的“启用视觉提示词编辑注入”后，保存的内容才会随生成兔子镜的请求发送。</div>
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_visual_prompt_enabled" type="checkbox"> 启用视觉提示词编辑注入</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.76;font-size:12px;line-height:1.5;">默认关闭。关闭时已编辑内容仍保存在本地，但不会注入模型；下一面继续使用 1.3.20 原版视觉规则。开启后才切换到可编辑视觉层。</div>
            <div id="rh_visual_prompt_status" style="padding:7px 9px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:8px;opacity:.82;font-size:11px;line-height:1.45;margin-bottom:10px;">当前：正在读取视觉提示词状态……</div>
            <label for="rh_visual_extra_prompt" style="display:block;font-weight:700;margin:8px 0 5px;">额外视觉偏好（可选）</label>
            <textarea id="rh_visual_extra_prompt" class="text_pole" rows="5" maxlength="${VISUAL_EXTRA_PROMPT_MAX_CHARS}" spellcheck="false" placeholder="例如：像真实纸张拼贴的小剧场，左上方来光，标题压在图像边缘，正文像杂志内页，近看能看到印刷网点和轻微裁切毛边。" style="width:100%;min-height:100px;resize:vertical;box-sizing:border-box;line-height:1.5;"></textarea>
            <div style="opacity:.68;font-size:11px;line-height:1.45;margin:5px 0 10px;">可以只写“毛玻璃”“粉嫩清新”这类简单偏好，系统会把它当作设计种子并自动补足构图、层级、光线、排版、材质细节与交互第二状态；想更可控时，也可以像占位示例那样写一条完整但不冗长的视觉句子。开启注入后会作为本轮明确视觉要求执行，未指定的部分仍由兔子镜原有视觉规则补足。上限 ${VISUAL_EXTRA_PROMPT_MAX_CHARS} 字符。</div>
            <label for="rh_visual_avoid_prompt" style="display:block;font-weight:700;margin:10px 0 5px;">不希望出现的视觉（可选）</label>
            <textarea id="rh_visual_avoid_prompt" class="text_pole" rows="4" maxlength="${VISUAL_AVOID_PROMPT_MAX_CHARS}" spellcheck="false" placeholder="例如：不要荧光渐变、蓝白系统 UI、统一圆角卡片、廉价塑料感……" style="width:100%;min-height:88px;resize:vertical;box-sizing:border-box;line-height:1.5;"></textarea>
            <div style="opacity:.68;font-size:11px;line-height:1.45;margin:5px 0 10px;">可以直接写你不喜欢的颜色、质感、排版方式、光线感觉、UI 套路或整体风格。开启注入后会作为明确避用项处理。上限 ${VISUAL_AVOID_PROMPT_MAX_CHARS} 字符。</div>
            <details style="margin-top:10px;"><summary style="cursor:pointer;font-weight:700;">高级：修改通用视觉规则 <span style="font-weight:400;opacity:.62;font-size:11px;">通常无需修改</span></summary><div style="padding-top:9px;">
              <div style="opacity:.72;font-size:11px;line-height:1.5;margin-bottom:7px;">只有想直接改兔子镜原本的通用画面规则时才需要这里。普通用户只填写上面的“额外视觉偏好 / 不希望出现”即可。</div>
              <label for="rh_visual_prompt" style="display:block;font-weight:700;margin:8px 0 5px;">通用视觉审美规则（高级，可编辑）</label>
              <textarea id="rh_visual_prompt" class="text_pole" rows="14" maxlength="${VISUAL_PROMPT_MAX_CHARS}" spellcheck="false" style="width:100%;min-height:230px;resize:vertical;box-sizing:border-box;line-height:1.5;"></textarea>
              <div style="opacity:.68;font-size:11px;line-height:1.45;margin:5px 0 8px;">修改后会替换兔子镜原本的通用画面规则；上限 ${VISUAL_PROMPT_MAX_CHARS} 字符。核心结构与兼容规则仍不可覆盖。</div>
              <button id="rh_visual_prompt_reset" class="menu_button" type="button">恢复默认通用视觉规则</button>
            </div></details>
            <div class="flex-container" style="gap:8px;flex-wrap:wrap;margin-top:12px;"><button id="rh_visual_prompt_save" class="menu_button" type="button">保存并从下一面生效</button></div>
            <div style="opacity:.66;font-size:11px;line-height:1.45;margin-top:7px;">为避免重新引入移动端设置页卡顿，三个输入框都不会在键入时写设置；只有点击上面的保存按钮才会持久化。</div>
            <details id="rh_appearance_reference" style="margin-top:16px;min-width:0;">
              <summary style="cursor:pointer;font-weight:700;min-height:44px;line-height:44px;">参考一个外观 / 交互模板（可选）</summary>
              <p style="font-size:12px;line-height:1.6;">只借鉴布局、配色与交互结构，人物、正文和情节仍按当前聊天生成。不会执行或预览导入的 HTML，也不会请求其中的图片、字体等资源。</p>
              <label class="checkbox_label" style="min-height:44px;"><input id="rh_appearance_reference_enabled" type="checkbox"> 启用已保存的外观参考</label>
              <p style="font-size:12px;line-height:1.6;">默认关闭。原输入最多 128 KiB；只在本设备保存去掉原文字、脚本、事件和网址的结构摘要（每份最多 12,000 字符；安全替换时最多保留新旧两份），不保存原文、不塞入酒馆 settings。开启后每次生成会增加输入 Token；一批多面仅带入当前一份。不支持的样式会省略，不保证复刻原作。</p>
              <label for="rh_appearance_reference_input" style="display:block;margin:8px 0;">粘贴需要参考的 HTML</label>
              <textarea id="rh_appearance_reference_input" class="text_pole" rows="4" maxlength="131072" spellcheck="false" style="width:100%;max-width:100%;box-sizing:border-box;resize:vertical;"></textarea>
              <label for="rh_appearance_reference_file" style="display:block;margin:8px 0;">或选择本地 HTML / TXT 文件</label>
              <input id="rh_appearance_reference_file" type="file" accept=".html,.htm,.txt" style="width:100%;max-width:100%;min-height:44px;">
              <button id="rh_appearance_reference_save" class="menu_button" type="button" style="min-height:44px;margin-top:8px;">提取并保存外观参考</button>
              <div id="rh_appearance_reference_status" role="status" aria-live="polite" style="font-size:12px;line-height:1.6;margin-top:8px;"></div>
              <button id="rh_appearance_reference_unlink" class="menu_button" type="button" hidden style="min-height:44px;margin-top:8px;">解除旧参考关联</button>
            </details>
          </div>

          <div id="rh_advanced_page_memory" class="rh-advanced-page" data-title="共同回忆资料来源" style="display:none;">
            <label class="checkbox_label"><input id="rh_memory_scan_enabled" type="checkbox"> 启用额外资料来源（实验性）</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.76;font-size:12px;line-height:1.45;">开启后，兔子镜可能生成回忆杀；仅在实际出现回忆杀时增加额外 Token。</div>
            <button id="rh_memory_scan_now" class="menu_button" type="button">扫描可用资料来源</button>
            <div style="margin-top:6px;opacity:.68;font-size:11px;line-height:1.45;">扫描公开、正规的记忆插件接口 API。</div>
            <div id="rh_memory_scan_results" style="margin-top:8px;"></div>
            <section aria-labelledby="rh_memory_worldbook_heading" style="margin-top:16px;padding-top:12px;border-top:1px solid var(--SmartThemeBorderColor);min-width:0;">
              <h4 id="rh_memory_worldbook_heading" style="margin:0 0 8px;">绑定记忆世界书</h4>
              <label class="checkbox_label" style="min-height:44px;"><input id="rh_memory_worldbook_enabled" type="checkbox"> 将绑定的世界书作为共同回忆资料</label>
              <div class="rabbit-mirror-subnote" style="font-size:12px;line-height:1.5;margin:6px 0;">由上方总开关控制。仅抽中 I.1 共同回忆时读取；关闭来源不清除绑定。这里只保存书名，不把世界书正文存入设置。</div>
              <button id="rh_memory_worldbook_refresh" class="menu_button" type="button" style="min-height:44px;max-width:100%;">刷新世界书目录</button>
              <label for="rh_memory_worldbook_id" style="display:block;margin:8px 0 4px;">选择记忆世界书（自动保存）</label>
              <select id="rh_memory_worldbook_id" class="text_pole" style="display:block;width:100%;max-width:100%;min-width:0;min-height:44px;box-sizing:border-box;"></select>
              <button id="rh_memory_worldbook_clear" class="menu_button" type="button" style="min-height:44px;margin-top:8px;">清空绑定</button>
              <div id="rh_memory_worldbook_status" role="status" aria-live="polite" style="font-size:12px;line-height:1.5;margin-top:8px;overflow-wrap:anywhere;"></div>
            </section>
          </div>

          <div id="rh_advanced_page_worldinfo" class="rh-advanced-page" data-title="独立 API" style="display:none;">
            <details id="rh_early_body_options" style="margin-bottom:12px;min-width:0;">
              <summary style="min-height:44px;cursor:pointer;">正文标签闭合后提前生成（可选）</summary>
              <label class="checkbox_label" style="min-height:44px;"><input id="rh_early_body_enabled" type="checkbox"> 为当前聊天开启提前生成</label>
              <label for="rh_early_body_tags" style="display:block;margin:8px 0;">正文标签名（最多 8 个，逗号分隔）</label>
              <input id="rh_early_body_tags" class="text_pole" type="text" maxlength="520" placeholder="例如 story_scene" style="width:100%;min-height:44px;box-sizing:border-box;">
              <button id="rh_early_body_scan" class="menu_button" type="button" style="min-height:44px;">扫描当前聊天可选标签</button>
              <div id="rh_early_body_candidates" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
              <button id="rh_early_body_save" class="menu_button" type="button" style="min-height:44px;margin-top:8px;">保存当前聊天设置</button>
              <div style="font-size:12px;line-height:1.6;margin-top:8px;">这里选的是要读取的正文，不是上面的过滤标签。所有选中标签完整闭合且内容可见后，可在状态栏等尾部仍输出时先请求兔子镜；仍最多一次请求，主回复结束后展示。未闭合、工具调用或无法确认时，仍等正文结束。切换聊天不会沿用此设置。</div>
              <div id="rh_early_body_status" role="status" aria-live="polite" style="font-size:12px;line-height:1.6;"></div>
            </details>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">读取范围</div>
              <label>最近 <input id="rh_independent_context_layers" class="text_pole" type="number" min="1" max="200" step="1" inputmode="numeric" style="width:76px;"> 层可见聊天正文</label>
              <div class="rabbit-mirror-subnote" style="margin:6px 0 0;opacity:.72;font-size:11px;line-height:1.5;">只读取最近 X 层可见正文。历史兔子镜和隐藏推理始终不会发送；小缓存只在本次请求内复用，完成后立即销毁。</div>
            </div>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">附加资料</div>
              <label class="checkbox_label"><input id="rh_independent_include_character_summary" type="checkbox"> 角色卡摘要（推荐开启）</label>
              <label class="checkbox_label"><input id="rh_independent_include_persona_summary" type="checkbox"> Persona 摘要（推荐开启）</label>
              <div class="rabbit-mirror-subnote" style="margin:4px 0 0 26px;opacity:.72;font-size:11px;line-height:1.5;">只带入紧凑摘要，不会把整张角色卡或其它隐藏提示整包塞给副 API。</div>
            </div>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <div style="font-weight:700;font-size:12px;margin-bottom:7px;">正文标签过滤／隔离</div>
              <div class="flex-container" style="gap:8px;flex-wrap:wrap;align-items:center;">
                <button id="rh_independent_tag_filter_open" class="menu_button" type="button">扫描与管理正文标签</button>
                <span id="rh_independent_tag_filter_summary" style="opacity:.72;font-size:11px;line-height:1.4;">尚未设置</span>
              </div>
              <label class="checkbox_label" style="margin-top:8px;"><input id="rh_follow_tag_isolation" type="checkbox"> 跟随当前 API：禁止兔子镜参考所选标签</label>
              <div class="rabbit-mirror-subnote" style="margin:3px 0 0 26px;opacity:.72;font-size:11px;line-height:1.5;">仅要求兔子镜跳过所选标签内容；如需彻底过滤，请使用独立 API。</div>
              <div class="rabbit-mirror-subnote" style="margin:6px 0 0;opacity:.72;font-size:11px;line-height:1.5;">独立 API 会在发送前从副 API 临时上下文副本中过滤并跳过所选标签内容；原酒馆正文始终不修改。</div>
            </div>
            <div style="padding:10px 11px;margin-bottom:12px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);">
              <label class="checkbox_label" style="font-weight:700;"><input id="rh_independent_read_global_world_info" type="checkbox"> 读取本轮已激活的世界书</label>
              <div class="rabbit-mirror-subnote" style="margin:2px 0 0 26px;opacity:.72;font-size:11px;line-height:1.5;">进入当前角色聊天后，优先显示酒馆为当前聊天加载过的角色／聊天／Persona／当前全局世界书；真正发送时仍只复用主生成本轮实际激活的条目，不会重新扫描或重掷概率。</div>
            </div>
            <div style="margin:7px 0 4px;font-size:12px;font-weight:700;opacity:.86;">当前聊天相关世界书</div>
            <div id="rh_world_info_book_filters" style="margin:4px 0 10px;padding:8px 9px;border:1px solid color-mix(in srgb,var(--SmartThemeBorderColor) 45%,transparent);border-radius:10px;max-height:190px;overflow:auto;-webkit-overflow-scrolling:touch;"><div style="font-size:11px;line-height:1.4;opacity:.66;">打开此高级选项时自动显示当前聊天相关世界书。</div></div>
            <details id="rh_world_info_all_books" style="margin:5px 0 8px;">
              <summary style="cursor:pointer;font-size:11px;opacity:.78;">更多：从全部世界书中选择（折叠）</summary>
              <div class="flex-container" style="gap:7px;flex-wrap:wrap;align-items:center;margin:8px 0 0;">
                <button id="rh_world_info_books_fetch" class="menu_button" type="button">拉取全部世界书</button>
                <span id="rh_world_info_books_fetch_status" style="opacity:.66;font-size:11px;">未拉取</span>
              </div>
              <div id="rh_world_info_all_book_filters" style="margin-top:7px;padding:8px 9px;border:1px solid color-mix(in srgb,var(--SmartThemeBorderColor) 45%,transparent);border-radius:10px;max-height:260px;overflow:auto;-webkit-overflow-scrolling:touch;"><div style="font-size:11px;line-height:1.4;opacity:.66;">折叠时不创建完整世界书列表；展开后按需渲染。</div></div>
            </details>
          </div>

          <div id="rh_advanced_page_repair" class="rh-advanced-page" data-title="挨打猫与维修兔" style="display:none;">
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_feedback_cat" type="checkbox"> 🐈 启用挨打猫</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.78;font-size:12px;line-height:1.5;">用于纠正兔子镜的美化效果；仅在实际提交美化反馈时增加额外 Token。</div>
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_maintenance_rabbit" type="checkbox"> 🐇 启用维修兔</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 6px 26px;opacity:.78;font-size:12px;line-height:1.5;">兔子镜出问题时，可使用维修兔进行检查和修复；维修兔本身不会增加模型 Token。</div>
            <label class="checkbox_label" style="font-weight:700;"><input id="rh_maintenance_auto_safe" type="checkbox"> 🧪 维修兔自动巡逻（实验性）</label>
            <div class="rabbit-mirror-subnote" style="margin:-2px 0 8px 26px;opacity:.78;font-size:12px;line-height:1.5;">新生成的兔子镜会自动修常见小问题；复杂问题仍需手动修。</div>
          </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</dialog>`;
}

export function buildWorldInfoPromptModalHtml() {
    return `
<div id="rh_world_info_prompt_modal" role="dialog" aria-modal="true" aria-label="独立 API 世界书设置" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:2147483001;background:rgba(8,10,14,.62);box-sizing:border-box;padding-top:max(24px,calc(env(safe-area-inset-top) + 14px));padding-right:max(12px,calc(env(safe-area-inset-right) + 8px));padding-bottom:max(24px,calc(env(safe-area-inset-bottom) + 14px));padding-left:max(12px,calc(env(safe-area-inset-left) + 8px));align-items:center;justify-content:center;overflow:hidden;pointer-events:auto;">
  <div style="width:min(520px,calc(100vw - 24px));max-height:calc(100dvh - 76px - env(safe-area-inset-top) - env(safe-area-inset-bottom));overflow:hidden;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);display:flex;flex-direction:column;">
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 40px;align-items:center;gap:8px;padding:11px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);">
      <div><b style="font-size:15px;">独立 API 是否读取世界书？</b><div style="opacity:.65;font-size:11px;line-height:1.35;margin-top:2px;">之后也可以在「设置 → 它可以参考什么」随时修改</div></div>
      <button id="rh_world_info_prompt_close" class="menu_button" type="button" aria-label="关闭" style="width:38px;min-width:38px;height:38px;padding:0;border-radius:12px;font-size:20px;line-height:1;">×</button>
    </div>
    <div style="padding:15px;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;">
      <div style="padding:12px 13px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 5%,transparent);font-size:12px;line-height:1.6;">
        <div style="font-weight:700;margin-bottom:5px;">📚 读取世界书</div>
        <div style="opacity:.78;">进入当前角色聊天后，优先显示酒馆为当前聊天加载过的角色／聊天／Persona／当前全局世界书；真正发送时仍只复用主生成本轮实际激活的条目，不会重新扫描或重掷概率。</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:14px;">
        <button id="rh_world_info_prompt_disable" class="menu_button" type="button" style="min-height:44px;">暂不启用</button>
        <button id="rh_world_info_prompt_enable" class="menu_button" type="button" style="min-height:44px;font-weight:700;">启用世界书</button>
      </div>
    </div>
  </div>
</div>`;
}

export function buildTagFilterModalHtml() {
    return `
<div id="rh_independent_tag_filter_modal" role="dialog" aria-modal="true" aria-label="兔子镜正文标签管理" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:2147483002;background:rgba(8,10,14,.62);box-sizing:border-box;padding:18px 12px;align-items:center;justify-content:center;overflow:hidden;pointer-events:auto;">
  <div style="width:min(560px,calc(100vw - 24px));max-height:min(720px,calc(100dvh - 36px));overflow:hidden;background:var(--SmartThemeBlurTintColor,#202226);color:var(--SmartThemeBodyColor,#ddd);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.42);display:flex;flex-direction:column;">
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 40px;align-items:center;gap:8px;padding:11px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);">
      <div><b style="font-size:15px;">兔子镜正文标签管理</b><div style="opacity:.65;font-size:11px;line-height:1.35;margin-top:2px;">独立 API 发送前过滤；跟随当前 API 仅在开关启用时要求兔子镜跳过所选标签，原正文与美化规则保持不变</div></div>
      <button id="rh_independent_tag_filter_close" class="menu_button" type="button" aria-label="关闭" style="width:38px;min-width:38px;height:38px;padding:0;border-radius:12px;font-size:20px;line-height:1;">×</button>
    </div>
    <div style="padding:14px;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;">
      <div style="font-size:12px;line-height:1.55;opacity:.82;">勾选要整段过滤／隔离的标签。标签名不区分大小写；可填写 <code>thinking</code>、<code>&lt;thinking&gt;</code> 或自定义标签名。最多 ${INDEPENDENT_CONTEXT_EXCLUDED_TAG_MAX_COUNT} 项，不接受正则。预设内尚未出现在聊天正文的标签，请手动添加。</div>
      <div style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:9px;align-items:center;margin-top:12px;padding:10px;border:1px solid color-mix(in srgb,currentColor 13%,transparent);border-radius:11px;background:color-mix(in srgb,currentColor 4%,transparent);">
        <button id="rh_independent_tag_filter_scan" class="menu_button" type="button">扫描当前聊天标签</button>
        <div id="rh_independent_tag_filter_scan_status" aria-live="polite" style="min-width:0;opacity:.72;font-size:11px;line-height:1.45;">扫描当前聊天已加载的正文源与可见正文；结果不会自动勾选或保存。</div>
      </div>
      <div id="rh_independent_tag_filter_list" style="display:grid;gap:7px;margin-top:12px;"></div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:12px;">
        <input id="rh_independent_tag_filter_input" class="text_pole" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" maxlength="80" placeholder="添加标签，例如 &lt;analysis&gt;">
        <button id="rh_independent_tag_filter_add" class="menu_button" type="button">添加并勾选</button>
      </div>
      <div id="rh_independent_tag_filter_error" aria-live="polite" style="min-height:18px;margin-top:5px;color:#ef9a9a;font-size:11px;line-height:1.4;"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;padding:11px 14px 14px;border-top:1px solid color-mix(in srgb,currentColor 12%,transparent);">
      <button id="rh_independent_tag_filter_cancel" class="menu_button" type="button">取消</button>
      <button id="rh_independent_tag_filter_save" class="menu_button" type="button" style="font-weight:700;">保存并从下一轮生效</button>
    </div>
  </div>
</div>`;
}
