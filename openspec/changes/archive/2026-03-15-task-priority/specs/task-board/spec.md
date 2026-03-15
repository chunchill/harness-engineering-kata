# task-board Specification (Delta: Task Priority)

## ADDED Requirements

### Requirement: Task priority

The system SHALL represent a task with an optional priority: HIGH | MEDIUM | LOW. When not provided on create, the default SHALL be MEDIUM.

#### Scenario: Create task with priority

- GIVEN no task with the same id exists
- WHEN a client POSTs a task with title and optional description and optional priority (HIGH, MEDIUM, or LOW)
- THEN the system creates a task with the given priority, or MEDIUM if priority is omitted; returns the task including priority

#### Scenario: Update task priority

- GIVEN a task exists
- WHEN a client PATCHes the task with a new priority (HIGH, MEDIUM, or LOW)
- THEN the system updates the task priority and returns the updated task; updatedAt is refreshed

#### Scenario: List tasks includes priority

- GIVEN tasks exist with various priorities
- WHEN a client GETs /tasks
- THEN the system returns all tasks with each task including its priority field
