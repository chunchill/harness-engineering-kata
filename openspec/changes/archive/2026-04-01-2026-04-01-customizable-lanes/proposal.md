# Change: Lane rename (v1)

## Why

Today the board lanes are fixed to three columns mapped to `TaskStatus` (`TODO`, `IN_PROGRESS`, `DONE`). The smallest, safest first step is to support **renaming** those lanes (custom labels), without changing task persistence or allowing arbitrary new lanes yet.

## What Changes

- Add a persisted lane definition model for the three default lanes (`TODO`, `IN_PROGRESS`, `DONE`).
- Add lane endpoints:
  - `GET /lanes`
  - `PATCH /lanes/{key}` (rename)
- Update the UI to render column header labels from `/lanes`, while keeping task persistence and drag/drop behavior based on `TaskStatus`.

## Goals (for v1)

- The UI SHALL render lane headers based on server-provided lane definitions (not hard-coded labels).
- A user (or admin) SHALL be able to **rename** an existing lane.
- Existing tasks and boards SHALL continue to work; tasks remain stored using `TaskStatus`.

## Non-goals (for v1)

- Adding new lanes (e.g. “Blocked”, “QA”). This will be a follow-up change.
- Per-user / per-board lane sets (multi-board). This change assumes a single global lane set for the app.
- Deleting lanes, WIP limits, lane permissions.
- Complex drag constraints or workflows.

## Proposed design (high-level)

### Data model

Introduce a persisted `Lane` model for the **three default lanes**:

- `key` (stable identifier; maps to `TaskStatus`: `TODO`, `IN_PROGRESS`, `DONE`)
- `name` (display label; editable)
- `position` (order on the board)
- timestamps
Tasks continue to use `status` (no task schema changes in v1).

### API

Add lane endpoints:

- `GET /lanes` → list lanes ordered by `position`
- `PATCH /lanes/{key}` → rename lane

### Migration / compatibility

Seed default lanes representing the current three columns (“Todo”, “In Progress”, “Done”).

## Acceptance criteria

- Starting from an existing DB with tasks, after migration:
  - lanes exist for the three defaults
  - tasks still appear grouped by `status`, but the lane header labels come from lanes API
- From the UI:
  - user can rename a lane and the header updates
  - drag-and-drop continues to move tasks between the three lanes and persists (still backed by `status`)

