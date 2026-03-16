# task-board Specification (Delta: Task due date)

## ADDED Requirements

### Requirement: Task due date (截止日期)

The system SHALL represent a task with an optional due date: ISO-8601 date (YYYY-MM-DD). When not provided on create or update, the due date SHALL remain null.

#### Scenario: Create task with due date

- GIVEN no task with the same id exists
- WHEN a client POSTs a task with title and optional description and optional dueDate (YYYY-MM-DD)
- THEN the system creates a task with the given due date, or null if dueDate is omitted; returns the task including dueDate

#### Scenario: Update task due date

- GIVEN a task exists
- WHEN a client PATCHes the task with a new dueDate (YYYY-MM-DD)
- THEN the system updates the task due date and returns the updated task; updatedAt is refreshed

#### Scenario: Clear task due date

- GIVEN a task exists with a due date
- WHEN a client PATCHes the task with dueDate set to null or clearDueDate set to true
- THEN the system clears the due date and returns the updated task

#### Scenario: List tasks includes due date

- GIVEN tasks exist with various due dates (some null)
- WHEN a client GETs /tasks
- THEN the system returns all tasks with each task including its dueDate field (or null)
