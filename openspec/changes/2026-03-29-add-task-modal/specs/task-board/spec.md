# task-board Specification (Delta: Add task modal)

## ADDED Requirements

### Requirement: Add task modal (dialog)

The board UI SHALL NOT present the create-task fields as a permanent inline strip under the main header. Instead, the user SHALL open a **modal dialog** from an explicit control (e.g. a button) in the header area.

The modal SHALL contain the same create-task fields as supported by the API: **title** (required), optional **description**, **priority** (with the same defaulting behavior as today when omitted), and optional **due date**. Submitting the modal SHALL create a task via the existing create-task API, close the modal, clear the form, and refresh the board so the new task appears.

The user SHALL be able to **dismiss** the modal without creating a task using: a **cancel** (or equivalent) control, **clicking the backdrop** outside the dialog panel, and the **Escape** key while the modal is open. Dismissing SHALL not call the create API.

The dialog SHALL be exposed to assistive technologies as a modal (`role="dialog"`, `aria-modal="true"`) with an **accessible name** (e.g. via `aria-labelledby` pointing to a visible dialog title). When the modal opens, focus SHALL move to an appropriate control inside the dialog (e.g. the title field).

#### Scenario: Open add-task modal

- GIVEN the Task Board is displayed
- WHEN the user activates the add-task control in the header
- THEN a modal opens showing the create-task fields and the dialog has an accessible name

#### Scenario: Create task from modal

- GIVEN the add-task modal is open and the user has entered a non-empty title
- WHEN the user submits the modal (primary create action)
- THEN a task is created via the API, the modal closes, the form is cleared, and the new task appears on the board

#### Scenario: Dismiss modal without creating

- GIVEN the add-task modal is open
- WHEN the user dismisses via cancel, backdrop click, or Escape
- THEN the modal closes and no new task is created
