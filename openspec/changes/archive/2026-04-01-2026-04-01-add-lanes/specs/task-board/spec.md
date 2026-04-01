# task-board Specification (delta: add lanes v2)

## MODIFIED Requirements

### Requirement: Task model

Tasks SHALL belong to a lane (by id).

#### Scenario: Create task defaults to first lane

- GIVEN lanes exist
- WHEN a client POSTs a task without specifying a lane
- THEN the system creates the task in the first lane (by position) and returns it with `laneId`

#### Scenario: Move task between lanes

- GIVEN a task exists in lane A and lane B exists
- WHEN a client updates the task with `laneId = laneB.id`
- THEN the system updates the task’s laneId and the UI reflects the new column

### Requirement: Board columns

The UI SHALL render columns based on the lane list returned by `GET /lanes`.

#### Scenario: Lanes render as columns

- GIVEN lanes exist
- WHEN the UI loads
- THEN it renders one column per lane (ordered by position)

## ADDED Requirements

### Requirement: Add lane

The system SHALL allow creating lanes.

#### Scenario: Create lane

- GIVEN the system is running
- WHEN a client POSTs a new lane name to `/lanes`
- THEN the system creates a lane and returns it with id and position

