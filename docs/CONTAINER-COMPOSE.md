# Container stack (Docker Compose + MySQL)

Full stack: **MySQL 8.4**, **Spring Boot API**, **static frontend (nginx)** with `/api` proxied to the backend.

## Prerequisites

- Docker Engine and Docker Compose v2 (`docker compose`).

## Run

From the repository root:

```bash
docker compose up --build
```

- **UI**: http://localhost:3000 (override with `FRONTEND_PORT` in `.env`)
- **API (host)**: http://localhost:8080 (`BACKEND_PORT`)
- **MySQL (host)**: `localhost:3306` (`MYSQL_PORT`) — optional; the app uses the internal `mysql` hostname inside Compose.

Default DB credentials match `.env.example` (`kata` / `kata`, database `kata`). Schema is applied by **Flyway** when the backend starts with profile `mysql` (see `application-mysql.yml`).

## Local dev without Docker (unchanged)

- `npm run dev` — backend uses **H2 in-memory**; frontend Vite proxies `/api` to `localhost:8080`.
- Backend tests use **H2**; Flyway is **disabled** for tests (`application-test.yml`).

## Reset to a clean database

Removes containers and the named volume so the next `up` starts with an empty MySQL data directory:

```bash
docker compose down -v
```

Then:

```bash
docker compose up --build
```

## Troubleshooting

| Symptom | What to check |
|--------|----------------|
| Backend exits on startup | `docker compose logs backend` — DB URL, credentials, or Flyway errors. |
| Frontend loads but API errors | Confirm nginx proxy: browser should call same host on `/api/...`; check `frontend/nginx.conf`. |
| Port already in use | Set `FRONTEND_PORT`, `BACKEND_PORT`, or `MYSQL_PORT` in `.env`. Example: `BACKEND_PORT=18080 FRONTEND_PORT=13000 MYSQL_PORT=13306 docker compose up --build` if **8080** is taken by a local `bootRun`. |
