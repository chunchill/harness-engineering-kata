# Harness Engineering Kata

Full-stack Task Board built to practice **Harness Engineering**, **Middle Loop**, and **OpenSpec** (Spec-Driven Development). See [docs/PROJECT-PURPOSE.md](docs/PROJECT-PURPOSE.md) and [docs/IMPLEMENTATION-GUIDE.md](docs/IMPLEMENTATION-GUIDE.md).

**协作进度**：当前要做哪一步、哪些已完成，以 [docs/PROGRESS.md](docs/PROGRESS.md) 为准；你我可以共同维护该清单的勾选。

## Quick start

- **一键本地运行**：在项目根执行 `npm install`（首次）后运行 `npm run dev`，会同时启动后端与前端。后端 http://localhost:8080，前端 http://localhost:5173（后端默认 H2 内存库）。
- **Docker 全栈（MySQL + API + 前端）**：`docker compose up --build`；端口与重置说明见 [docs/CONTAINER-COMPOSE.md](docs/CONTAINER-COMPOSE.md)。
- **分别启动**：Backend `cd backend && ./gradlew bootRun`（或本机 `gradle bootRun`）；Frontend `cd frontend && npm install && npm run dev`。前端通过 proxy 访问后端 `/api`。
- **Tests**: Backend `cd backend && ./gradlew test`; frontend `cd frontend && npm run test && npm run lint && npm run build`. Root: `npm run test` (backend + frontend tests), `npm run build` (both builds).

## Structure

- **backend/** — Spring Boot 3, layered: types → config → repo → service → runtime. ArchUnit enforces layers.
- **frontend/** — React + TypeScript + Vite; calls backend via `/api`.
- **docs/** — PROJECT-PURPOSE, IMPLEMENTATION-GUIDE, ARCHITECTURE, API-CONTRACT, DOMAIN, QUALITY.
- **openspec/** — OpenSpec SDD: specs (current truth), changes (proposals + tasks). First change: `mvp-task-board`.
- **AGENTS.md** — Entry for AI agents; points to docs and OpenSpec workflow.
- **Harness.md**, **RULES.md** — Constraints and golden principles.

## OpenSpec workflow

1. Create a change: `/opsx:propose "description"` or ask the AI to create a proposal under `openspec/changes/<id>/`.
2. Validate: `openspec validate <id> --strict`.
3. Implement following `tasks.md`; mark tasks `[x]` when done.
4. After CI and human acceptance: `openspec archive <id> --yes` to merge specs into `openspec/specs/`.

## CI

- **.github/workflows/ci.yml** — Backend tests + build, frontend lint + build, doc structure check, Docker Compose build + smoke (`--wait`).
- **.github/workflows/doc-lint.yml** — Ensures required docs and `openspec/` structure exist.
