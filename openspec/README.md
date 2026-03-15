# OpenSpec (SDD)

This project uses [OpenSpec](https://openspec.dev/) for Spec-Driven Development.

- **specs/** — Current deployed capabilities (read-only reference).
- **changes/** — Active change proposals (proposal.md, tasks.md, specs/ deltas).
- **changes/archive/** — Completed changes.

Workflow: create a change with `/opsx:propose "your idea"` or ask the AI to create an OpenSpec proposal; validate with `openspec validate <id> --strict`; implement per tasks.md; then `openspec archive <id> --yes`.

If Cursor slash commands were not installed (e.g. EPERM during init), run locally: `openspec init --tools cursor`.
