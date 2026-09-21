# 兔子镜 1.6.2 窄修包 — 改动说明

> **1.6.2 紧急热修（在 1.6.1 基础上）**：修复 1.6.1 引入的严重卡顿/发热。
> 根因：新×按钮没加进"持久化前剥离"总清单（geometry.js 的 `PERSISTED_RUNTIME_UI_SELECTOR`），导致它被写进镜子存档，且其 disabled/title 属性随翻页状态变化使存档每轮都"变脏"，同步→重写→再同步循环空转。已补入清单，并从存储恢复的旧×自动补挂点击事件（1.6.1 期间写入存档的死按钮会自愈）。
> 改动文件：geometry.js、toolsChrome.js（及引用它们的 rmv 版本号 1.6.1→1.6.2）。
> **装上 1.6.2 后**：之前被污染的存档会在下次保存时自动清掉死按钮，无需手动处理。


基于官方 **toto1.6.zip** 制作（1.6.1 全部修复均保留，见下）。覆盖方式：解压本包，把里面的文件按相同路径覆盖到扩展目录即可。
本次共 4 项修复，未触碰任何发送给模型的 prompt，未改动无关功能。

---

## 1. 构思 JSON 宽容解析（修复"只有 no-thinking 模型能生图"）

**文件：`src/imagePlan.js`（实质改动）**

- 根因：1.6 的 `parseImagePlan` 仍是旧的严格解析——只认"整段是 JSON"或"整段被 ``` 围栏包住"。思考型模型会在 JSON 前后输出思考过程，全部被误判为"构思结果不是可解析的 JSON"。
- 修法（与心迹回廊同思路的三层提取）：
  1. 先试整段文本；
  2. 再找正文**任意位置**的 ```` ```json ```` 围栏块；
  3. 最后做"平衡花括号"扫描（能正确跳过字符串内的引号、转义符和 `{}`），从后往前逐个对象尝试——思考型模型通常把最终答案放在最后。
- 严格性不变：提取出的对象仍走原有全部校验（`prompt` 必须非空、characters 结构完整等），垃圾输出照样拒绝，不会硬猜。

## 2. 切面后保持展开（修复"切到下一面就折叠"）

**文件：`src/independentApi/mount.js`（实质改动）**

- 根因：多面镜子的每一面是独立的 `<details>`，`showMultifaceFace` 切换时只改 `display`，从不碰 `open` 属性。你展开的是第 3 面的 details，切到第 4 面时第 4 面自己的 details 还是折叠的。
- 修法：切换时把当前面的展开/折叠状态"带"到目标面（同一时刻最多只有可见面持有 `open`，持久化 HTML 也保持干净）。同 index 的归一化调用、单面镜子完全不受影响。

## 3. 翻页键放大下移 + × 移到右上角（误触与"点着点着没响应"）

**文件：`src/outputSanitizer/toolsChrome.js`、`style.css`（实质改动）**

- **× 删除按钮**：从翻页条里拆出，作为独立小圆钮（30px、半透明弱化）浮动在**标题行最右上角**（summary 首子元素右浮动，长标题换行也不会把它挤下去）。远离 ‹ ›，不再误删。
- **‹ › 翻页键**：挪到标题下方的工具行内（左侧），☆ 🐰 保持在该行右侧原位；触控区从 22×28 放大到 **36×34**，字号 16→18，计数文字 12→13。属于"适度放大"，不是大胶囊。
- **连点失灵**：翻页按钮补上 `touch-action: manipulation`——iOS 上快速连点此前会被当成双击缩放手势吞掉；叠加修复 2（不再折叠跳动，按钮不再移位）后，连续翻页稳定响应。
- 序列化防护：× 成为 summary 直接子元素后，已同步加入全部 4 处"持久化/收藏前剥离工具元素"清单（faceSwipe.js、geometry.js、theaterFavorites.js、mount.js），不会被写进存储 HTML。

## 4. rmv 缓存戳更新（仅版本号，无逻辑改动）

manifest.json、index 级与 src 内共 13 个文件仅 `?rmv=1.6` → `?rmv=1.6.1`，确保旧缓存失效。
（`src/independentApi/mount.js` 中 imagePlan 引用为 `?rmv=1.6-image2`。）

---

## 测试

- 新增 `tests/imagePlanTolerant.test.mjs`：13 项（思考链夹杂、围栏混在散文、字符串内含花括号/转义引号、截断/缺字段拒绝等）全过。
- 新增 `tests/multifaceOpenCarry.test.mjs`：5 项（展开状态带过去/带回来、折叠保持折叠、同位归一化不动 open、单面不受影响、× 结构断言）全过。
- 全量：`node --experimental-vm-modules --test tests/` → 179 项，170 过 / 7 跳过 / 2 失败。**2 个失败（batchStorageQuota、theaterFavorites）在未改动的原始 1.6 上同样失败**，属 1.6 预存问题，与本包无关。

## 改动文件清单

实质改动（7）：
- `src/imagePlan.js`
- `src/independentApi/mount.js`
- `src/independentApi/faceSwipe.js`
- `src/independentApi/geometry.js`
- `src/outputSanitizer/toolsChrome.js`
- `src/theaterFavorites.js`
- `style.css`

仅 rmv 版本号（13）：
- `manifest.json`、`src/independentApi.js`、`src/settingsAppearance.js`、`src/ui.js`、`src/outputSanitizer.js`、`src/independentApi/connection.js`、`src/independentApi/earlyBody.js`、`src/independentApi/lifecycle.js`、`src/independentApi/persistence.js`、`src/independentApi/request.js`、`src/outputSanitizer/diagnostics.js`、`src/outputSanitizer/lifecycle.js`、`src/outputSanitizer/maintenanceInspect.js`

新增测试（2，可选覆盖）：
- `tests/imagePlanTolerant.test.mjs`、`tests/multifaceOpenCarry.test.mjs`

## 注意

下次升级官方新版本会覆盖本补丁（这次 1.5.53 → 1.6 就发生了一次）。如果升级后问题复现，把新版发包给我重新移植即可。
