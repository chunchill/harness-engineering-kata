# AGENTS.md — Harness Engineering Kata

> Entry point for AI agents. Keep this file ~100 lines; details live in docs/ and openspec/.

---

## 1. Project and goals

- **What**: Full-stack Task Board (MVP: columns + task CRUD). Harness Engineering + Middle Loop practice.
- **Why**: Human designs harness and does Middle Loop (spec, review, accept); agent implements in Inner Loop.
- **Ref**: [docs/PROJECT-PURPOSE.md](docs/PROJECT-PURPOSE.md), [docs/IMPLEMENTATION-GUIDE.md](docs/IMPLEMENTATION-GUIDE.md).

---

## 2. Spec-Driven Development (OpenSpec)

- **Before coding a feature or non-trivial change**: Create or use an OpenSpec change (Proposal → Implementation → Archive).
- **Create proposal**: Use `/opsx:propose "description"` or ask: “Create an OpenSpec change proposal for …”. Proposal lives under `openspec/changes/<change-id>/` (proposal.md, tasks.md, specs/ deltas).
- **Validate**: Human or agent runs `openspec validate <change-id> --strict` before implementation.
- **Implement**: Follow `tasks.md` in order; mark tasks `[x]` when done. Do not skip or reorder without updating the proposal.
- **After merge/deploy**: Human runs `openspec archive <change-id> --yes` so specs merge into `openspec/specs/`.
- **Context**: [openspec/README.md](openspec/README.md), [openspec/project.md](openspec/project.md).

---

## 3. Architecture and layers (backend)

- **Layers** (dependency order): `Types` → `Config` → `Repo` → `Service` → `Runtime`.
- **Packages**: `com.harness.kata.types`, `.config`, `.repo`, `.service`, `.runtime`.
- **Rules**: Runtime must not depend on Repo. Service must not depend on Runtime. New code must respect these layers.
- **Ref**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Enforced by ArchUnit tests.

---

## 4. Progress and collaboration

- **Current steps and done/not-done**: See [docs/PROGRESS.md](docs/PROGRESS.md). Human and agent both update checkboxes there when completing steps; before starting the next step, read PROGRESS.md to stay in sync.

## 5. Where to read and write

| Topic | Read / authority | Update |
|-------|------------------|--------|
| Purpose, Middle Loop, loops | [docs/PROJECT-PURPOSE.md](docs/PROJECT-PURPOSE.md) | Human |
| Implementation, harness, merge | [docs/IMPLEMENTATION-GUIDE.md](docs/IMPLEMENTATION-GUIDE.md) | Human + agent (docs only when specified) |
| Architecture, layers | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Agent when adding layers/packages per plan |
| API contract | [docs/API-CONTRACT.md](docs/API-CONTRACT.md) or openspec/specs | With OpenSpec change or explicit task |
| Domain | [docs/DOMAIN.md](docs/DOMAIN.md) | With OpenSpec change or explicit task |
| Quality / acceptance | [docs/QUALITY.md](docs/QUALITY.md) | With OpenSpec change or explicit task |
| Constraints, rules | [Harness.md](Harness.md), [RULES.md](RULES.md) | Human; agent follows |

---

## 6. Commands you must run

- **Backend**: From repo root, `./backend/gradlew -p backend test` (or `backend/gradlew test` from backend). Before committing backend changes, ensure tests pass.
- **Frontend**: `cd frontend && npm run test` (Vitest), `npm run lint`, `npm run build`. From repo root: `npm run test:frontend`, `npm run build:frontend`.
- **Root**: `npm run test` runs backend tests and frontend tests; `npm run build` runs both builds.
- **OpenSpec**: After editing a change, `openspec validate <change-id> --strict`.

---

## 7. Don’ts

- Do not add dependencies from Runtime to Repo, or Service to Runtime.
- Do not implement a feature that has a spec/change in OpenSpec without following that change’s tasks.md and proposal.
- Do not remove or weaken ArchUnit (or other harness) checks without explicit human direction.
- Do not put project-critical knowledge only in chat or external docs; put it in docs/ or openspec/.

---

## 8. When something fails

- **Tests/CI red**: Fix code or tests; do not disable tests or ArchUnit without human approval.
- **Wrong behavior vs spec**: Prefer updating the spec (or OpenSpec change) and then code so that code matches spec; if the human asked for a spec change, do that first.
- **Unclear requirement**: Prefer asking or proposing a small OpenSpec change (or doc update) and then implementing, rather than guessing.

---

*End of AGENTS.md. For detailed harness and principles, see [Harness.md](Harness.md) and [RULES.md](RULES.md).*
