# Change: Add lanes (custom columns) — v2

## Why

We currently support renaming the default three lanes (Todo / In Progress / Done) via `/lanes`, but the board still has a fixed set of columns driven by `TaskStatus`.

To support real workflows, the board needs **custom lanes**: users can add lanes and move tasks between them.

## What Changes

- Lanes become a first-class, extensible concept:
  - `POST /lanes` to create a lane
  - `PATCH /lanes/{id}` to rename a lane (and optionally update position later)
  - `GET /lanes` to list lanes ordered by position
- Tasks belong to lanes:
  - `Task` includes `laneId`
  - Creating a task assigns it to a lane (default lane if omitted)
  - Moving a card updates `laneId`
- Database migration:
  - Migrate existing tasks from `status` to seeded default lanes.

## Scope decisions (v2)

- **In scope**:
  - Add lane
  - Rename lane
  - Move tasks between lanes
  - Seed + migrate existing data
- **Out of scope**:
  - Delete lane (needs rules for tasks in lane)
  - Reorder lanes (position editing UI)
  - Per-user/per-board lane sets (multi-board)

## Acceptance criteria

- After upgrade, existing tasks appear in the correct default lanes.
- User can add a lane and it renders as a new column.
- User can rename any lane and the header updates.
- Drag-and-drop moves tasks between lanes and persists via API.

