# Implementation tasks: Add lanes (custom columns) — v2

- [x] 1. OpenSpec: add spec delta for lanes + laneId; run `openspec validate 2026-04-01-add-lanes --strict`.
- [x] 2. Backend data model: change lanes to extensible `LaneEntity` (id, name, position); migrate from v1 lane-key model.
- [x] 3. Backend API: `GET /lanes`, `POST /lanes`, `PATCH /lanes/{id}`; tests.
- [x] 4. Backend tasks: add `laneId` to task DTO and create/update requests; implement move by updating laneId; keep `status` behavior per migration plan (deprecate or map).
- [x] 5. Flyway migrations: lanes v2 table + seed defaults + migrate tasks to laneId.
- [x] 6. Frontend: render columns from `GET /lanes`; add lane UI; rename lane UI (reuse modal); update DnD to use lane ids and call task update with laneId.
- [x] 7. Docs & contract: update API contract/specs; update compose smoke if needed.
- [x] 8. Validate: `npm run test` and (optionally) docker compose smoke.

