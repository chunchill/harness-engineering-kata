# API 契约（API Contract）

> 与 `openspec/specs/` 对齐；实现须与此一致。

---

## 健康检查

- **GET /health** — 返回 `{ "status": "UP" }`。

---

## 任务 (Task)

### 模型

- **id**: Long，唯一。
- **title**: String，必填。
- **description**: String，可选。
- **status**: `TODO` | `IN_PROGRESS` | `DONE`。
- **priority**: `HIGH` | `MEDIUM` | `LOW`，可选；创建时未传则默认 `MEDIUM`。
- **dueDate**: String，可选，ISO-8601 日期（YYYY-MM-DD）；创建/更新时未传则保持 null。
- **createdAt**, **updatedAt**: ISO-8601 时间。

### 端点

- **GET /tasks** — 列表，按 updatedAt 降序；响应中每项包含 priority、dueDate。
- **POST /tasks** — 创建。Body: `{ "title": string, "description"?: string, "priority"?: "HIGH"|"MEDIUM"|"LOW", "dueDate"?: string }`。未传 priority 时使用 MEDIUM。返回 201 + 任务。
- **PATCH /tasks/{id}** — 更新。Body: `{ "title"?, "description"?, "status"?, "priority"?, "dueDate"?, "clearDueDate"?: boolean }`。`dueDate` 为 YYYY-MM-DD 时设置；`clearDueDate: true` 时清除截止日期。返回 200 + 任务；不存在 404。
- **POST /tasks/{id}/patch** — 与 **PATCH /tasks/{id}** 语义相同、请求体相同；供本地开发等场景在代理无法可靠转发 PATCH 请求体时使用。返回 200 + 任务；不存在 404。
- **DELETE /tasks/{id}** — 删除。返回 204；不存在 404。
