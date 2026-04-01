# task-board Specification (delta: delete lane)

## ADDED Requirements

### Requirement: Delete lane

The system SHALL support deleting a lane.

#### Rules

- Only lanes with `key = null` (custom lanes) MAY be deleted.
- The system SHALL NOT allow deleting the last remaining lane.
- If tasks exist in the deleted lane, those tasks SHALL be reassigned to the first remaining lane (ordered by lane `position`, then `id`).

#### Scenario: Delete lane reassigns tasks

- GIVEN at least two lanes exist and one custom lane has tasks
- WHEN a client DELETEs `/lanes/{id}` for that custom lane
- THEN the lane is removed and those tasks now belong to the first remaining lane

