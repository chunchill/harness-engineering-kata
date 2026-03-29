# Implementation tasks: Add task modal

- [x] 1. OpenSpec: ensure `specs/task-board/spec.md` delta under this change is complete; run `openspec validate 2026-03-29-add-task-modal --strict`.
- [x] 2. Frontend: replace inline header create form with an **Add task** (or equivalent) control that opens a **modal** containing the same fields and submit behavior (`createTask`); on success close modal, clear fields, reload list; on dismiss (cancel, backdrop, Escape) close without creating.
- [x] 3. Frontend: modal **accessibility** — `role="dialog"`, `aria-modal="true"`, accessible name (e.g. `aria-labelledby`); focus title field when opened; Escape closes while open.
- [x] 4. Frontend: **i18n** — add any new user-visible strings for modal title, cancel, close affordance (EN + ZH); reuse existing placeholders where appropriate.
- [x] 5. Frontend: **styles** — overlay + panel consistent with existing theme variables (`TaskBoard.css` or co-located).
- [x] 6. Quality: `cd frontend && npm run lint && npm run build` pass.
