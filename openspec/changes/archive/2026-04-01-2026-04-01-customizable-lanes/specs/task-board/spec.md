# task-board Specification (delta: lane rename v1)

## ADDED Requirements

### Requirement: Lane definitions API

The system SHALL expose lane definitions (for the three default lanes) via an API so clients can render lane headers consistently.

#### Scenario: List lanes

- GIVEN the system is running
- WHEN a client GETs `/lanes`
- THEN the system returns the three default lanes ordered by position and each lane includes a stable key and name

#### Scenario: Rename a lane

- GIVEN a lane exists
- WHEN a client PATCHes `/lanes/{key}` with a new name
- THEN the lane’s name changes and subsequent GETs to `/lanes` return the updated name

## MODIFIED Requirements

### Requirement: Board columns

The system SHALL support at least three logical columns: Todo, In Progress, Done, represented by task status (TODO, IN_PROGRESS, DONE).

- Column header labels SHALL be derived from the lane definitions returned by `GET /lanes` (not hard-coded).

#### Scenario: Tasks grouped by column

- GIVEN tasks exist with statuses TODO, IN_PROGRESS, DONE
- WHEN a client lists tasks (e.g. GET /tasks) or the UI renders the board
- THEN tasks are grouped or filterable by status so each column shows the correct tasks, and the UI uses `/lanes` for the displayed header labels

### Requirement: Card drag-and-drop

The board UI SHALL allow moving a task from one column to another by dragging the task card and dropping it on a column. The move SHALL update the task status via the existing update-task API.

#### Scenario: Move task by drag-and-drop

- GIVEN the board is displayed with at least one task in any column
- WHEN the user drags a task card and drops it on a different column
- THEN the task's status is updated to that column's status and the board reflects the new column (task appears in the target column), regardless of the lane’s renamed header label

