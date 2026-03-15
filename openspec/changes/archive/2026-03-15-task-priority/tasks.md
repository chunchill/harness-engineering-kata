# Implementation tasks: Task Priority (High / Medium / Low)

- [x] 1. Backend types: add `TaskPriority` enum (HIGH, MEDIUM, LOW) in `com.harness.kata.types`; add `priority` to TaskDto, TaskCreateRequest, TaskUpdateRequest (optional; default MEDIUM when absent).
- [x] 2. Backend repo: add `priority` column to Task entity (JPA); migration or schema compatible with H2 (e.g. default MEDIUM for existing rows if needed).
- [x] 3. Backend service: TaskService create/update accept and persist priority; list returns priority; apply default (e.g. MEDIUM) when priority is null on create.
- [x] 4. Backend runtime: TaskController GET/POST/PATCH request/response include priority; validate priority value if present (HIGH|MEDIUM|LOW).
- [x] 5. Backend: add or adjust unit tests for TaskService (create/update with priority); ensure ArchUnit and existing tests pass.
- [x] 6. Frontend types: add TaskPriority and `priority` to Task, TaskCreateRequest, TaskUpdateRequest (optional).
- [x] 7. Frontend API client: ensure create/update send priority when provided; list response includes priority.
- [x] 8. Frontend UI: show priority on each task card (e.g. badge or label); add priority selector to create form and optional in-place edit or edit flow for existing tasks.
- [x] 9. Docs: update docs/API-CONTRACT.md and docs/DOMAIN.md with priority field (values HIGH, MEDIUM, LOW; optional on create/update; default MEDIUM).
- [x] 10. OpenSpec spec delta: add requirement and scenarios for task priority under task-board spec (see specs/task-board/ in this change).
