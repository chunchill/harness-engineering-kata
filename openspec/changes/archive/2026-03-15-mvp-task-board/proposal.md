# Change: MVP Task Board

## Why

Deliver the first runnable full-stack slice: a task board with columns (e.g. Todo, In Progress, Done) and task CRUD, so we can practice the full OpenSpec flow (Proposal → Implementation → Archive) and Middle Loop.

## What

- **Backend**: REST API for tasks (list, create, update, delete / move status). Persistence in H2. Layered: types, config, repo, service, runtime. Health remains at `GET /health`.
- **Frontend**: Simple board UI with at least 2–3 columns; list tasks and create new ones; call backend API.
- **Contract**: Task model with id, title, description (optional), status, createdAt, updatedAt. Status values align with columns (e.g. TODO, IN_PROGRESS, DONE).

## Impact

- New `openspec/specs/task-board/` (after archive).
- Backend: new types, repo, service, runtime (controller) for tasks.
- Frontend: new components and API client for tasks.
- docs/API-CONTRACT.md and docs/DOMAIN.md updated to reflect the new API and domain.
