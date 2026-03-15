# Change: Task Priority (High / Medium / Low)

## Why

Users need to indicate task priority so they can focus on what matters first. Adding a priority field (High, Medium, Low) to tasks supports this without changing the existing column-based workflow.

## What

- **Model**: Extend the task model with an optional **priority** field: `HIGH` | `MEDIUM` | `LOW`. Default when not provided: `MEDIUM` (or equivalent so existing tasks and creates without priority behave consistently).
- **Backend**: Add priority to types (e.g. `TaskPriority` enum), entity, DTOs, create/update request types; persist in DB; expose in GET/POST/PATCH (request/response). Keep existing endpoints; extend request/response bodies.
- **Frontend**: Show priority on each task card (e.g. label or badge); allow setting/editing priority when creating or editing a task (e.g. dropdown or buttons).
- **Contract**: Task response includes `priority`; POST /tasks accepts optional `priority`; PATCH /tasks/{id} accepts optional `priority`. docs/API-CONTRACT.md and docs/DOMAIN.md updated.

## Impact

- **Spec**: Extend `openspec/specs/task-board/` with a requirement for task priority and scenarios (create/update/list include priority).
- **Backend**: New or updated types (TaskPriority, TaskDto, TaskEntity, TaskCreateRequest, TaskUpdateRequest), repo entity column, service and controller handling.
- **Frontend**: Types and API client updated; task card and create/form UI show and set priority.
- **Docs**: API-CONTRACT.md and DOMAIN.md updated with priority field and values.
