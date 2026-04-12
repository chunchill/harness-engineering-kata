# task-board Specification (Delta: Remove delete button hover tips)

## ADDED Requirements

### Requirement: Delete controls without hover tooltip

The board UI SHALL expose delete actions (lane delete and task delete) without browser-native hover tips. These controls SHALL remain accessible through explicit accessible names (for example `aria-label`).

#### Scenario: Hover delete lane control

- GIVEN the Task Board is displayed
- WHEN the user hovers the lane delete control
- THEN no browser-native tooltip text is shown for that control

#### Scenario: Hover delete task control

- GIVEN at least one task is visible on the board
- WHEN the user hovers the task delete control
- THEN no browser-native tooltip text is shown for that control
