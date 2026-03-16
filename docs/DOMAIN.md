# 领域文档（Domain）

> 与 `openspec/specs/` 对齐。

---

## 看板 (Board)

- 三列：**Todo**、**In Progress**、**Done**，对应任务状态 `TODO`、`IN_PROGRESS`、`DONE`。
- 任务可在一列内展示，并可通过更新状态移动到另一列。

---

## 任务 (Task)

- **标题** (title)：必填。
- **描述** (description)：可选。
- **状态** (status)：TODO | IN_PROGRESS | DONE。
- **优先级** (priority)：HIGH | MEDIUM | LOW；可选，创建时未传则默认 MEDIUM。
- **截止日期** (dueDate)：可选，ISO-8601 日期（YYYY-MM-DD）；创建/更新时可设置或清除。
- **创建/更新时间**：createdAt、updatedAt，由系统维护。

创建时默认状态为 TODO；客户端通过 PATCH 更新状态以在列间移动任务，亦可更新 priority。
