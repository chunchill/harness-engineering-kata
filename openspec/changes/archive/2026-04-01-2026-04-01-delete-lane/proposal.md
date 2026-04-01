# Change: Delete lane

## Why

Users can add lanes, but cannot remove mistakes or simplify the board.

## What changes

- Add `DELETE /lanes/{id}` to remove a lane.
- Define a safe behavior for tasks that belong to the deleted lane.

## Scope decisions

- In scope:
  - Deleting a **custom** lane (lanes with `key = null`)
  - When deleting a lane that still has tasks, those tasks are reassigned to the first remaining lane (by position)
- Out of scope:
  - Deleting seeded default lanes (lanes with `key != null`) — prevents breaking default status mapping
  - Deleting the last remaining lane

## Acceptance criteria

- User can delete a custom lane from the UI after confirming.
- Deleting a lane reassigns its tasks to the first remaining lane.
- Attempts to delete a default lane fail with a 4xx response (no data corruption).

