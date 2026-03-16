# Change: Theme toggle (Light / Dark)

## Why

当前 Task Board 已经支持任务优先级和拖拽等交互，但整体 UI 仍然只有单一配色。在不同光线环境（白天 / 夜晚）下使用时，用户希望可以一键切换为更舒适的主题，并且在浏览器刷新后仍然保持自己的偏好。我们希望通过显式的主题切换体验，进一步体会「体验向」小改动在 OpenSpec 流程中的表达方式。

## What Changes

- **Frontend**: 在 Task Board 页头增加一个「主题切换」控件，支持 Light / Dark 两种模式：
  - 使用 CSS 变量和 `data-theme` 属性（挂在 `<html>` 上）切换颜色。
  - 初始化时优先读取 localStorage 中的用户偏好；若无，则根据系统 `prefers-color-scheme` 决定初始主题。
  - 切换主题时立即更新 UI 并持久化到 localStorage。
- **Backend**: 无改动。
- **Contract**: API 契约不变；仅为前端 UI 的视觉层增强。

## Impact

- **Spec**: 在 `openspec/specs/task-board/spec.md` 下新增一个「Theme toggle」需求与场景，说明 UI 需要提供显式的 Light / Dark 切换，并且要记住用户选择。
- **Frontend**:
  - 更新 `src/index.css`：保留现有 CSS 变量与 `prefers-color-scheme` 行为，在此基础上增加 `[data-theme="light"]` / `[data-theme="dark"]` 对变量的覆盖。
  - 更新 `TaskBoard`（或顶层 `App`）组件：新增主题状态、初始化逻辑、本地存储读写以及头部的切换按钮。
- **Docs**: 如有需要，可在 `docs/QUALITY.md` 或 `docs/PROJECT-PURPOSE.md` 中简要补一句说明：Task Board 支持 Light / Dark 主题切换，偏好可持久化。
