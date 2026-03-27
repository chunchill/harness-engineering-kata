# Implementation tasks: UI i18n (中文 / English)

- [x] 1. OpenSpec：确认本 change 下 `specs/task-board/spec.md` delta 完整；运行 `openspec validate 2026-03-27-i18n-zh-en --strict`。
- [x] 2. 前端 i18n 基础：`Locale` 类型（`en` | `zh`）、合并文案表、`I18nProvider` + `useI18n()`（或等价 hook），提供 `t(key)`；`localStorage` 读写与 `navigator.language` 初始推断；`document.documentElement.lang` 同步。
- [x] 3. Task Board 接入：将所有用户可见固定英文串替换为 `t(...)`；优先级下拉/徽章显示本地化标签，**提交 API 仍使用** `HIGH` | `MEDIUM` | `LOW`。
- [x] 4. UI：在页头增加语言切换（例如 `中 / EN` 或图标+文案），与现有主题切换风格一致；补充 `aria-label` / `title` 的两种语言版本。
- [x] 5. 质量：`cd frontend && npm run build`（及 `npm run lint` 若适用）通过。
