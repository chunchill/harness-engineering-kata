# Implementation tasks: Task due date (截止日期)

- [x] 1. Backend: 在 TaskEntity 中新增 `dueDate` 列（LocalDate，nullable）；H2 兼容。
- [x] 2. Backend: 在 TaskDto、TaskCreateRequest、TaskUpdateRequest 中增加 `dueDate`（String，可选，格式 YYYY-MM-DD）。
- [x] 3. Backend: TaskService 的 create/update 接受并持久化 dueDate；list 返回 dueDate；toDto 正确映射。
- [x] 4. Backend: TaskController 的 GET/POST/PATCH 请求/响应包含 dueDate；校验日期格式（若提供）。
- [x] 5. Backend: 补充或调整 TaskService 单测（create/update 含 dueDate）；确保 ArchUnit 及现有测试通过。
- [x] 6. Frontend: 在 types 中为 Task、TaskCreateRequest、TaskUpdateRequest 增加 `dueDate?: string | null`。
- [x] 7. Frontend: API client 支持 create/update 传入 dueDate；list 响应包含 dueDate。
- [x] 8. Frontend: 创建表单增加 dueDate 输入（如 `<input type="date">`）；任务卡片展示并支持编辑 dueDate。
- [x] 9. Docs: 更新 API-CONTRACT.md 和 DOMAIN.md，说明 dueDate 字段（可选，YYYY-MM-DD）。
- [x] 10. OpenSpec spec delta: 在本 change 的 specs/task-board/ 下添加「Task due date」需求及场景，并通过 `openspec validate task-due-date --strict` 校验。
