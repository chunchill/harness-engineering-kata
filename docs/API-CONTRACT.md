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
- **laneId**: Long，必填；任务所属泳道。
- **status**: `TODO` | `IN_PROGRESS` | `DONE`。
- **priority**: `HIGH` | `MEDIUM` | `LOW`，可选；创建时未传则默认 `MEDIUM`。
- **dueDate**: String，可选，ISO-8601 日期（YYYY-MM-DD）；创建/更新时未传则保持 null。
- **createdAt**, **updatedAt**: ISO-8601 时间。

### 端点

- **GET /tasks** — 列表，按 updatedAt 降序；响应中每项包含 priority、dueDate。
- **POST /tasks** — 创建。Body: `{ "title": string, "description"?: string, "priority"?: "HIGH"|"MEDIUM"|"LOW", "dueDate"?: string, "laneId"?: number }`。未传 priority 时使用 MEDIUM；未传 laneId 时默认放入 position 最小的泳道。返回 201 + 任务。
- **PATCH /tasks/{id}** — 更新。Body: `{ "title"?, "description"?, "status"?, "laneId"?, "priority"?, "dueDate"?, "clearDueDate"?: boolean }`。`dueDate` 为 YYYY-MM-DD 时设置；`clearDueDate: true` 时清除截止日期。返回 200 + 任务；不存在 404。
- **POST /tasks/{id}/patch** — 与 **PATCH /tasks/{id}** 语义相同、请求体相同；供本地开发等场景在代理无法可靠转发 PATCH 请求体时使用。返回 200 + 任务；不存在 404。
- **DELETE /tasks/{id}** — 删除。返回 204；不存在 404。

---

## 泳道 (Lane)

### 模型

- **id**: Long，唯一。
- **key**: `TODO` | `IN_PROGRESS` | `DONE` | null（默认泳道有 key；自定义泳道为 null）。
- **name**: String，必填。
- **position**: int，泳道排序（越小越靠左）。
- **createdAt**, **updatedAt**: ISO-8601 时间。

### 端点

- **GET /lanes** — 列表，按 position 升序。
- **POST /lanes** — 创建。Body: `{ "name": string }`。返回 201 + 泳道。
- **PATCH /lanes/{id}** — 重命名。Body: `{ "name": string }`。返回 200 + 泳道；不存在 404。
