# Implementation tasks: Lane rename (v1)

- [ ] 1. OpenSpec: update `specs/task-board/spec.md` delta for lane customization; run `openspec validate 2026-04-01-customizable-lanes --strict`.
- [ ] 2. Backend types/repo: introduce `LaneEntity` + repository; lane keys map to `TaskStatus` (`TODO`, `IN_PROGRESS`, `DONE`).
- [ ] 3. Backend API: implement `GET /lanes` and `PATCH /lanes/{key}` (rename); add tests.
- [ ] 4. DB migration: add Flyway migration(s) for lanes table + seed defaults (no task schema change in v1).
- [ ] 5. Frontend: render column headers from `GET /lanes`; allow rename lane; keep grouping + drag/drop backed by `status`.
- [ ] 6. Update docs: `docs/API-CONTRACT.md` and `openspec/specs/task-board/spec.md` final alignment; extend container smoke to cover lanes endpoint.
- [ ] 7. CI: ensure all tests pass; docker compose smoke still passes.

