# Change: UI i18n (中文 / English)

## Why

Task Board 的界面文案目前固定为英文。为便于中文用户与英文用户在同一套 UI 中无缝切换显示语言，并在刷新后保留选择，需要在前端引入轻量 i18n，与现有主题切换、本地持久化模式保持一致。

## What Changes

- **Frontend**:
  - 引入 **中文（zh）** 与 **英文（en）** 两套文案；覆盖看板标题、列名、表单占位、按钮、无障碍标签、优先级展示文案等（任务 **title/description** 仍为用户输入内容，不翻译）。
  - 提供显式 **语言切换** 控件（与主题切换并列或相邻）；切换后立即重绘，无整页跳转。
  - **持久化**：将所选语言写入 `localStorage`；**首次访问**若无存储，则根据 `navigator.language` 在 `zh*` 与 `en` 之间自动选择，否则默认 `en`。
  - 同步更新 **`document.documentElement.lang`**（如 `zh-CN` / `en`），利于无障碍与浏览器行为。
- **Backend**: 无改动；API 字段名与枚举值（如 `TODO`、`HIGH`）不变，仅 UI 层展示文案可本地化。
- **Contract**: REST 契约不变。

## Impact

- **Spec**: 在 `task-board` 下新增「UI locale（界面语言）」需求与场景（切换、刷新后保持、首次语言推断）。
- **Frontend**: 新增 `i18n` 模块（文案表、Context、hook）；`TaskBoard`（及必要时 `App`）接入 `t()` 与语言切换。
- **Docs**: 可选在 `docs/QUALITY.md` 补一句验收要点；**归档**后由 `openspec archive` 合并 spec。
