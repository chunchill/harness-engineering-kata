# task-board Specification

## Purpose
TBD - created by archiving change mvp-task-board. Update Purpose after archive.
## Requirements
### Requirement: Task model

The system SHALL represent a task with: id (unique), title, optional description, status (TODO | IN_PROGRESS | DONE), createdAt, updatedAt.

#### Scenario: Create task

- GIVEN no task with the same id exists
- WHEN a client POSTs a task with title and optional description
- THEN the system creates a task with status TODO and returns it with id and timestamps

#### Scenario: List tasks

- GIVEN zero or more tasks exist
- WHEN a client GETs /tasks
- THEN the system returns all tasks (e.g. ordered by updatedAt descending)

#### Scenario: Update task (e.g. move status)

- GIVEN a task exists
- WHEN a client PATCHes the task with a new status (or title/description)
- THEN the system updates the task and returns the updated task; updatedAt is refreshed

#### Scenario: Delete task

- GIVEN a task exists
- WHEN a client DELETEs the task by id
- THEN the system removes the task and returns 204 or success

### Requirement: Board columns

The system SHALL support at least three logical columns: Todo, In Progress, Done, represented by task status (TODO, IN_PROGRESS, DONE).

#### Scenario: Tasks grouped by column

- GIVEN tasks exist with statuses TODO, IN_PROGRESS, DONE
- WHEN a client lists tasks (e.g. GET /tasks) or the UI renders the board
- THEN tasks are grouped or filterable by status so each column shows the correct tasks

