# Project context (Harness Engineering Kata)

- **Stack**: Backend Spring Boot 3.x + Java 17 + Gradle; Frontend React + TypeScript + Vite.
- **Persistence**: H2 (dev) / MySQL (prod).
- **Architecture**: Layered — Types → Config → Repo → Service → Runtime. See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).
- **Conventions**: All specs and changes live in this repo. Use OpenSpec workflow: Proposal → Implementation → Archive. Root [AGENTS.md](../AGENTS.md) and [docs/](../docs/) are the single source of truth.
