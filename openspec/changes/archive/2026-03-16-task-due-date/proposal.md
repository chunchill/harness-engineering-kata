# Change: Task due date (截止日期)

## Why

用户需要为任务设定完成截止日期，以便更好地规划时间和追踪进度。添加可选的 `dueDate` 字段可支持此需求，而不影响现有的看板工作流。

## What

- **Model**: 扩展任务模型，增加可选字段 **dueDate**，格式为 ISO-8601 日期（YYYY-MM-DD），仅日期无时间。
- **Backend**: 在 TaskEntity、TaskDto、TaskCreateRequest、TaskUpdateRequest 中增加 dueDate；持久化到 DB（DATE 类型）；在 GET/POST/PATCH 的请求/响应中暴露。
- **Frontend**: 在任务卡片上展示截止日期；在创建表单中支持设置 dueDate（如 date input）；在已有任务上支持编辑 dueDate。
- **Contract**: Task 响应包含 `dueDate`（可为 null）；POST /tasks 接受可选 `dueDate`；PATCH /tasks/{id} 接受可选 `dueDate`。更新 docs/API-CONTRACT.md 和 docs/DOMAIN.md。

## Impact

- **Spec**: 在 `openspec/specs/task-board/` 下新增「Task due date」需求及场景（创建/更新/列表包含 dueDate）。
- **Backend**: 更新 TaskEntity（新增 dueDate 列）、TaskDto、TaskCreateRequest、TaskUpdateRequest；TaskService 与 TaskController 处理 dueDate；单测覆盖。
- **Frontend**: 更新 types 与 API client；任务卡片与创建表单展示并支持设置/编辑 dueDate。
- **Docs**: API-CONTRACT.md 和 DOMAIN.md 更新 dueDate 字段说明。
