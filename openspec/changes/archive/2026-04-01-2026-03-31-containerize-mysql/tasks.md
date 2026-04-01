# Implementation tasks: Containerized deployment + MySQL (compose)

- [x] 1. OpenSpec: ensure this change has a complete delta under `specs/` (infra/deploy spec); run `openspec validate 2026-03-31-containerize-mysql --strict`.
- [x] 2. Add MySQL container: `docker compose` service with healthcheck, persistent volume, credentials via env, and an initialization mechanism (migrations).
- [x] 3. Backend runtime: add MySQL driver; add config/profile so backend connects to MySQL in compose; keep tests green (H2 acceptable in tests).
- [x] 4. Backend container: add `backend/Dockerfile` and build/run via compose; expose 8080; add `/health` check wiring if needed.
- [x] 5. Frontend container: add `frontend/Dockerfile` and run via compose (dev or prod mode defined explicitly).
- [x] 6. Compose full stack: `docker compose up` brings up mysql+backend+frontend; verify basic CRUD works through UI; document ports.
- [x] 7. CI gate: build images and run a minimal compose smoke (health checks); keep runtime under reasonable minutes.

