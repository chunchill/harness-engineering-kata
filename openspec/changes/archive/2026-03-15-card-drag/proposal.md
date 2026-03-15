# Change: Card drag-and-drop

## Why

Users expect to move tasks between columns (Todo, In Progress, Done) by dragging cards. This improves the board experience and aligns with common kanban UIs.

## What Changes

- **Frontend**: Task cards are draggable; each column (or its task list) is a drop target. On drop, the task's status is updated to the column's status via the existing PATCH API. Buttons "→ In Progress" / "→ Done" etc. remain available.
- **Backend**: No change; existing PATCH `/tasks/{id}` with `status` already supports moving.
- **Contract**: No API change. docs/API-CONTRACT.md and DOMAIN.md need no update.

## Impact

- **Spec**: Extend `openspec/specs/task-board/` with a requirement for drag-and-drop move and one scenario.
- **Frontend**: TaskBoard.tsx and TaskBoard.css — add drag handlers to cards and drop handlers to columns; call existing `moveStatus` (or `api.updateTask`) on drop.
- **Docs**: Optional one-line note in QUALITY.md or PROGRESS that drag-and-drop is supported.
