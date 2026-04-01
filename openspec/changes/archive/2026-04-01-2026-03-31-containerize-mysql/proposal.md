# Change: Containerized deployment + MySQL (compose)

## Why

We already practice “Agent codes + CI runs continuously”. Next, we want to practice **Outer Loop** with the same Harness discipline: make the full product (frontend + backend + database) deployable **via containers**, driven by chat instructions and validated by automation.

Today, the backend uses H2 in-memory at runtime; this does not represent a real deployment environment. Switching runtime persistence to **MySQL**, also containerized, improves realism and makes environment parity possible.

## What Changes

- **Runtime persistence**: Backend runtime uses **MySQL** (container) via env-driven configuration; keep H2 only where appropriate for tests/fast local.
- **Containerization**:
  - Add Dockerfiles for backend and frontend.
  - Add `docker compose` to bring up MySQL + backend + frontend together.
  - Add healthchecks and a repeatable “reset” story (down + volumes).
- **CI gates**: CI must run containerization gates (image build and minimal compose smoke/health checks).

## Impact

- **Backend**: add MySQL driver and runtime profiles/config.
- **Infra**: add `docker-compose.yml` (and optional overrides), plus `.env.example`.
- **Docs**: document how to run and troubleshoot containerized stack.

