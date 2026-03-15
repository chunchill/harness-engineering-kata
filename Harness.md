# Harness — 约束规则清单

> 本仓库 Harness 的机械可检查项与人类监督项。Agent 必须遵守；人类负责更新此清单。

---

## 1. 架构约束

- [ ] **分层方向**：Types → Config → Repo → Service → Runtime。Runtime 不依赖 Repo；Service 不依赖 Runtime。
- [ ] **包归属**：所有后端代码落在 `com.harness.kata` 下且归属 types/config/repo/service/runtime 之一。
- [ ] **校验**：ArchUnit 测试在 CI 与本地运行，违反即失败。

---

## 2. 规格与文档

- [ ] **变更前有规格**：功能/非平凡改动先有 OpenSpec 变更（proposal + tasks + spec 增量）或 docs 更新，再实现。
- [ ] **API 与实现一致**：API 契约（docs/API-CONTRACT.md 或 openspec/specs）与实现一致；CI 或脚本可检查时须通过。
- [ ] **知识在 repo**：关键约定、决策、验收标准写在 docs/ 或 openspec/，不只在对话或外部文档。

---

## 3. 质量门禁

- [ ] **提交前**：Backend 跑 `./gradlew test`，Frontend 跑 `npm run build`（及 lint，若配置）。
- [ ] **CI**：每次 push/PR 跑 lint、test、build；失败即红，不合并。
- [ ] **OpenSpec 变更**：实现前 `openspec validate <id> --strict` 通过；实现后人类验收再 archive。

---

## 4. 人类专属（Agent 不做）

- 亲手写业务代码（人类只做 Middle Loop：拆任务、写约束、验收、改 Harness）。
- 在未授权前提下关闭或放宽 ArchUnit / 测试 / lint。
- 将项目关键知识仅放在对话或 repo 外。

---

## 5. 熵管理（持续）

- doc-gardening：定期检查 docs/ 与 openspec/specs 是否过期，提修复或任务。
- 架构约束：新增包/类时确保仍满足分层，ArchUnit 覆盖新代码。

---

*具体原则与编码 taste 见 [RULES.md](RULES.md)。*
