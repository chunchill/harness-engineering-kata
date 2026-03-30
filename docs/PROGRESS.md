# 进度清单（与计划「建议操作顺序」对齐）

> 协作时以本文件为准：你和我都可编辑勾选；做下一步前先看当前状态。计划全文见 Cursor 计划或 IMPLEMENTATION-GUIDE 第十一节。

---

## 当前状态（最近更新）

- **Phase 0**：已全部完成 —— 骨架、分层文档、OpenSpec、AGENTS/Harness/RULES、ArchUnit、Pre-commit + CI 均已就绪。
- **Phase 1**：已全部完成（含 1.4 Archive：mvp-task-board 已归档，openspec/specs/task-board 已生成）。
- **Phase 2**：已全部完成（CI 重试与超时、可观测文档与日志 pattern、`npm run dev` 一键运行）。
- **Phase 3～4**：未开始；下一步可做 Phase 3（迭代完善 + Bug 修复）或 Phase 4（熵管理）。

---

## Phase 0：Harness 骨架（已完成）

- [x] Phase 0.1：初始化项目骨架（backend Spring Boot + Gradle，frontend React + Vite，根 package.json）
- [x] Phase 0.2：设计分层 + ARCHITECTURE.md（Types→Config→Repo→Service→Runtime，Mermaid）
- [x] Phase 0.3：OpenSpec 初始化（`openspec init --tools cursor`，openspec/project.md、README）
- [x] Phase 0.4：写 AGENTS.md（目录风格，含 OpenSpec 与 docs 指引）
- [x] Phase 0.5：Harness.md + RULES.md（约束清单与 Golden Principles）
- [x] Phase 0.6：配置 ArchUnit（分层与 runtime↛repo、service↛runtime 校验）
- [x] Phase 0.7：Pre-commit + CI（.husky/pre-commit，.github/workflows/ci.yml、doc-lint.yml）

---

## Phase 1：0→1 MVP（Task Board，SDD + OpenSpec）

- [x] Phase 1.1：OpenSpec Proposal（openspec/changes/mvp-task-board：proposal、tasks、specs/task-board）
- [x] Phase 1.2：Validate 与定稿（`openspec validate mvp-task-board --strict` 已通过）
- [x] Phase 1.3：Implementation（后端任务 CRUD + 分层 + 单测，前端看板三列 + API 客户端，docs/API-CONTRACT、DOMAIN 已更新）
- [x] Phase 1.4：Archive（已执行 `openspec archive mvp-task-board --yes`，specs/task-board 已更新）

---

## Phase 2：DevOps 闭环（已完成）

- [x] Phase 2.1：CI 全量（backend/frontend 测试与构建失败时自动重试最多 3 次，job 超时 15/10 分钟）
- [x] Phase 2.2：可观测（/health 已有；application.yml 统一日志 pattern；docs/OBSERVABILITY.md 说明）
- [x] Phase 2.3：本地一键运行（`npm run dev` 使用 concurrently 同时起 backend + frontend）

---

## Phase 3：迭代完善 + Bug 修复

- [x] Phase 3.1：功能增强（优先级、卡片拖拽、主题切换、卡片布局优化、任务截止日期已完成并已 archive；**添加任务模态框**：OpenSpec `2026-03-29-add-task-modal` 已 archive，`openspec/specs/task-board` 已含「Add task modal」需求，归档目录 `openspec/changes/archive/2026-03-30-2026-03-29-add-task-modal`；**UI 中英文 i18n** 见 OpenSpec `2026-03-27-i18n-zh-en`，实现已完成，**待你验收后** `openspec archive 2026-03-27-i18n-zh-en --yes` 合并进 `openspec/specs/`）
- [ ] Phase 3.2：故意留 Bug + 用 Harness 修（补测试/规则，再让 Agent 修）
- [ ] Phase 3.3：可选 Vibe 小实验

---

## Phase 4：熵管理

- [ ] Phase 4.1：API 与实现一致性检查（CI）
- [ ] Phase 4.2：架构约束检查（ArchUnit 维护/扩展）
- [ ] Phase 4.3：doc-gardening / code-gc（扫描与修复）
- [ ] Phase 4.4：README 与入口（Phase 1 时已有一版；此处可再完善安装、test、CI、docs 说明）

---

*你：做完一步可把 `- [ ]` 改为 `- [x]` 或加备注。我：做下一步前会读此文件，做完后更新勾选。*
