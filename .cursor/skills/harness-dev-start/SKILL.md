---
name: harness-dev-start
description: >-
  Starts the Harness Engineering Kata full-stack app (Spring Boot + Vite) from
  repo root (local dev). Use when the user asks to 启动应用, 拉起应用, run or
  start the app locally, start dev servers, or bring up frontend and backend
  together. This workflow uses **H2** by default and does **not** use Docker.
---

# Harness dev: start full stack

## Goal

Run **backend** (Spring Boot, port **8080**) and **frontend** (Vite, default **5173**) together. Authoritative commands also appear in [README.md](../../../README.md) and [AGENTS.md](../../../AGENTS.md).

If the user asks for **容器化部署应用 / Docker / Compose**, use the separate skill `harness-container-deploy` instead.

## Default workflow (agent)

1. **Working directory**: repository root (`harness-engineering-kata`), not `backend/` or `frontend/` alone.

2. **Dependencies** (if missing):
   - No `node_modules` at root → `npm install`
   - No `frontend/node_modules` → `cd frontend && npm install`
   - Optional one-shot (frontend + backend compile): `npm run install:all` from root

3. **Start both processes** from root:

   ```bash
   npm run dev
   ```

   This runs `concurrently`: `dev:backend` (`backend/./gradlew bootRun --no-daemon`) and `dev:frontend` (`frontend` → `npm run dev`).

4. **Run as a long-lived process**: start in the **background**; first Spring Boot build may take tens of seconds.

5. **Sandbox / agent environment**: Gradle may need **network**; if the daemon fails with errors like `getifaddrs` / `Could not determine a usable local IP`, rerun the same command with **full permissions** (no sandbox), matching a normal local terminal.

6. **Confirm success** from logs:
   - Frontend: `VITE` ready and a **Local** URL (if **5173** is busy, Vite picks another port, e.g. **5174**).
   - Backend: `Tomcat started on port 8080` / `Started KataApplication`.

7. **Tell the user**:
   - Open the **Vite Local URL** for the UI (not only 8080).
   - API base is **8080**; the dev server **proxies** `/api` to `http://localhost:8080` (see `frontend/vite.config.ts`).

## Split start (when user wants only one side)

- Backend only: `cd backend && ./gradlew bootRun` (or `./gradlew -p backend bootRun` from root with correct path).
- Frontend only: `cd frontend && npm run dev` (expects backend on **8080** for API unless configured otherwise).

## Troubleshooting (short)

| Symptom | Action |
|--------|--------|
| Port in use | Stop old `node`/Java processes or use the new Vite URL if it auto-incremented port. |
| `no main manifest attribute` / wrapper jar | `backend/gradlew` must invoke `org.gradle.wrapper.GradleWrapperMain` on the **classpath**, not `java -jar` on `gradle-wrapper.jar`. If broken, align with official Gradle `gradlew` for the project’s Gradle version. |
| Frontend proxy `ECONNREFUSED` | Backend not up yet or not on 8080; wait for Spring Boot or fix backend start. |

## Do not

- Do not start only the backend and tell the user the app is “done” without the Vite URL when they asked for the **full app**.
- Do not skip reading logs; confirm both sides or explain which side failed.
