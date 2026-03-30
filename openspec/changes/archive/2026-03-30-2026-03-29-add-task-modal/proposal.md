# Change: Add task via modal dialog

## Why

The board currently shows the full create-task form inline under the page header, which consumes vertical space and competes with column content. Moving creation into a **modal dialog** keeps the board focused on tasks while preserving the same fields and API behavior.

## What Changes

- **Frontend**: Remove the inline header create form. Add a clear control (e.g. button) in the header that **opens** a modal. The modal contains the same inputs as today (title, optional description, priority, optional due date) and the primary action that **POST**s via the existing create-task API. Closing the modal without submitting does not create a task. **Dismiss** via cancel control, backdrop click, and **Escape** (when focus is in the dialog). Provide dialog semantics (`role="dialog"`, `aria-modal`, labelled title) and move focus into the dialog when opened; restore or leave focus in a sensible place when closed.
- **Backend**: No change.
- **REST contract**: Unchanged (`docs/API-CONTRACT.md`).

## Impact

- **Spec**: `task-board` gains a requirement for add-task UI as a modal (open, submit, dismiss, accessibility).
- **Frontend**: `TaskBoard` (and/or a small `AddTaskModal` component), `TaskBoard.css`, i18n keys (`en` / `zh`).
- **Docs**: Optional one-line in `docs/QUALITY.md` after human review; **archive** merges spec into `openspec/specs/`.
