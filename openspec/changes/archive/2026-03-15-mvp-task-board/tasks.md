# Implementation tasks: MVP Task Board

- [x] 1. Backend types: add Task type (id, title, description, status, createdAt, updatedAt) and TaskStatus enum in `com.harness.kata.types`.
- [x] 2. Backend repo: add Task entity (JPA) and repository interface in `com.harness.kata.repo`; ensure DB schema (H2) works.
- [x] 3. Backend service: add TaskService in `com.harness.kata.service` with create, findAll, update (e.g. status), delete; use repo only.
- [x] 4. Backend runtime: add TaskController in `com.harness.kata.runtime` with GET /tasks, POST /tasks, PATCH /tasks/{id}, DELETE /tasks/{id}; use service only, no repo.
- [x] 5. Backend: add unit tests for TaskService; ensure ArchUnit and existing tests pass.
- [x] 6. Frontend: add API client for /tasks (list, create, update, delete) and types (Task, TaskStatus).
- [x] 7. Frontend: add board UI with at least 2–3 columns (e.g. Todo, In Progress, Done); list tasks per column and create-task form.
- [x] 8. docs: update API-CONTRACT.md and DOMAIN.md with task model and endpoints.
- [ ] 9. Root: ensure `npm run test` and `npm run build` pass; CI green.
