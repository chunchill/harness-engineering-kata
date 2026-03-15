# task-board Specification (Delta: Card drag-and-drop)

## ADDED Requirements

### Requirement: Card drag-and-drop

The board UI SHALL allow moving a task from one column to another by dragging the task card and dropping it on a column (Todo, In Progress, Done). The move SHALL update the task status via the existing update-task API.

#### Scenario: Move task by drag-and-drop

- GIVEN the board is displayed with at least one task in any column
- WHEN the user drags a task card and drops it on a different column
- THEN the task's status is updated to that column's status and the board reflects the new column (task appears in the target column).
