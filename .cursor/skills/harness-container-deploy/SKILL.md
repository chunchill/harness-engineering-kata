---
name: harness-container-deploy
description: >-
  Containerized local deployment for Harness Engineering Kata using Docker
  Compose (MySQL + backend + frontend). Use when the user asks for 容器化部署应用,
  docker 部署, compose 部署, or to run the app in local containers. Not for
  local dev (npm run dev + H2).
---

# Harness deploy: Docker Compose (local)

## Goal

Bring up **MySQL + backend + frontend** in Docker with one command and confirm the stack is healthy and usable from the browser.

- Frontend: nginx serves the built SPA and proxies `/api/*` to backend.
- Backend: runs with `SPRING_PROFILES_ACTIVE=mysql` and connects to the `mysql` service.
- DB: MySQL with a persistent named volume (reset uses `down -v`).

## Default workflow (agent)

1. **Working directory**: repository root (`harness-engineering-kata`).

2. **Port conflict avoidance**

This repo’s compose defaults are **frontend 3000**, **backend 8080**, **mysql 3306**, but the user may already have those ports in use.

- If 3000/8080/3306 are free, use defaults.
- If any are in use, prefer an alternate mapping (keep container internal ports unchanged):

  - `FRONTEND_PORT=13000`
  - `BACKEND_PORT=18080`
  - `MYSQL_PORT=13306`

3. **Start the stack (build + wait for health)**

Preferred (fast feedback, deterministic readiness):

```bash
docker compose up -d --build --wait
```

If using alternate ports:

```bash
BACKEND_PORT=18080 FRONTEND_PORT=13000 MYSQL_PORT=13306 docker compose up -d --build --wait
```

4. **Smoke checks (must pass before saying “done”)**

Using default ports:

```bash
curl -sfS "http://127.0.0.1:8080/health" | grep -q UP
curl -sfS "http://127.0.0.1:8080/tasks" | grep -q '\['
curl -sfS "http://127.0.0.1:3000/" | grep -q html
curl -sfS "http://127.0.0.1:3000/api/tasks" | grep -q '\['
```

Using alternate ports:

```bash
curl -sfS "http://127.0.0.1:18080/health" | grep -q UP
curl -sfS "http://127.0.0.1:18080/tasks" | grep -q '\['
curl -sfS "http://127.0.0.1:13000/" | grep -q html
curl -sfS "http://127.0.0.1:13000/api/tasks" | grep -q '\['
```

5. **Tell the user**

- UI URL (3000 or chosen `FRONTEND_PORT`)
- API URL (8080 or chosen `BACKEND_PORT`)
- How to see status: `docker compose ps`
- How to view logs: `docker compose logs -f --tail=200`

## Reset / teardown

- Stop containers (keep DB volume):

```bash
docker compose down
```

- Reset to a clean DB (remove volume):

```bash
docker compose down -v
```

## Troubleshooting (short)

| Symptom | Action |
|--------|--------|
| `bind: address already in use` | Use alternate ports via env vars or stop the process using that host port. |
| Backend unhealthy | `docker compose logs -f backend`; common causes: DB not ready, Flyway migration errors. |
| UI works but create/update fails with 403 | CORS/Origin mismatch; ensure backend allows the UI origin/port in `WebConfig`. |
| UI loads but `/api` fails | Verify nginx proxy config in `frontend/nginx.conf` and backend health. |

## Do not

- Do not stop unrelated Docker containers unless the user explicitly asks.
- Do not claim deployment success without passing the smoke checks.
