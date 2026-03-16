# Implementation tasks: Theme toggle (Light / Dark)

- [x] 1. 前端样式：在 `src/index.css` 中基于现有 CSS 变量，增加 `[data-theme="light"]` 和 `[data-theme="dark"]` 的覆盖，使两种主题在文本、背景、边框等颜色上有明显区分；确保仍兼容 `prefers-color-scheme`。
- [x] 2. 前端状态与初始化：在 React 中引入 `theme` 状态（light | dark），初始值从 localStorage 读取；若无存储，则根据 `window.matchMedia('(prefers-color-scheme: dark)')` 决定；将当前主题写入 `document.documentElement.dataset.theme` 并同步到 localStorage。
- [x] 3. UI 控件：在 Task Board 顶部（如 `board-header` 区域）增加主题切换按钮（可使用文字或简洁图标），点击后在 light/dark 之间切换；为无障碍添加 `aria-label`。
- [x] 4. OpenSpec spec delta：在 `specs/task-board/spec.md`（本 change 下）添加「Theme toggle」需求与至少一个场景（点击切换 + 刷新后仍使用上次选择），并通过 `openspec validate theme-toggle --strict` 校验。
