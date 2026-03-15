# 质量与验收（Quality）

> 验收标准与质量表。MVP 阶段随 OpenSpec 变更与实现逐步补全。

---

## 验收门禁

- 后端：ArchUnit 通过；`./gradlew test` 绿。
- 前端：`npm run build` 与 `npm run lint` 通过。
- 变更：实现前 `openspec validate <id> --strict` 通过；实现后人类验收再 archive。

## 占位

- 功能验收场景：随 MVP 与后续迭代在 OpenSpec specs 或本文件补充。
