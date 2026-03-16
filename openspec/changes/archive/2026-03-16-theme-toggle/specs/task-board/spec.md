# task-board Specification (Delta: Theme toggle)

## ADDED Requirements

### Requirement: Theme toggle (Light / Dark)

The board UI SHALL provide a user-visible theme toggle that switches the overall color scheme between Light and Dark. The chosen theme SHALL be persisted across page reloads.

#### Scenario: Toggle theme between light and dark

- GIVEN the Task Board UI is loaded
- WHEN the user clicks the theme toggle control
- THEN the UI switches from Light to Dark or from Dark to Light, and the new theme is immediately applied across the board

#### Scenario: Persist theme preference across reloads

- GIVEN the user has previously selected a theme (Light or Dark) using the theme toggle
- WHEN the user reloads the page or revisits the Task Board
- THEN the UI initializes using the previously selected theme (even if the system `prefers-color-scheme` setting is different)
