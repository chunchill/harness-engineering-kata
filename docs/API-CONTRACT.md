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
- **createdAt**, **updatedAt**: ISO-8601 时间。

### 端点

- **GET /tasks** — 列表，按 updatedAt 降序。
- **POST /tasks** — 创建。Body: `{ "title": string, "description"?: string }`。返回 201 + 任务。
- **PATCH /tasks/{id}** — 更新。Body: `{ "title"?, "description"?, "status"? }`。返回 200 + 任务；不存在 404。
- **DELETE /tasks/{id}** — 删除。返回 204；不存在 404。
