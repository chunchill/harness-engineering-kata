# task-board Specification

## Purpose
TBD - created by archiving change mvp-task-board. Update Purpose after archive.
## Requirements
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

### Requirement: Card drag-and-drop

The board UI SHALL allow moving a task from one column to another by dragging the task card and dropping it on a column. The move SHALL update the task status via the existing update-task API.

#### Scenario: Move task by drag-and-drop

- GIVEN the board is displayed with at least one task in any column
- WHEN the user drags a task card and drops it on a different column
- THEN the task's status is updated to that column's status and the board reflects the new column (task appears in the target column), regardless of the lane’s renamed header label

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

### Requirement: UI locale (界面语言)

The board UI SHALL support at least two display locales: English (`en`) and Chinese (`zh`). All fixed UI chrome (headings, column titles, form labels and placeholders, buttons, theme-toggle affordances, priority labels as shown to the user, and accessible names where applicable) SHALL be rendered in the active locale. User-authored task **title** and **description** SHALL NOT be translated by the application.

The active locale SHALL be switchable from the UI without a full page navigation; changing locale SHALL immediately update visible strings.

The chosen locale SHALL be persisted across page reloads (e.g. `localStorage`). On first visit with no stored preference, the UI SHALL infer an initial locale from the browser’s `navigator.language` (e.g. treat `zh`, `zh-CN`, `zh-TW`, etc. as Chinese; otherwise default to English).

The document root `lang` attribute SHOULD reflect the active locale (e.g. `en` or `zh-CN`) for accessibility.

#### Scenario: Switch locale in the UI

- GIVEN the Task Board UI is loaded in one locale (e.g. English)
- WHEN the user activates the language / locale control to select the other locale (e.g. Chinese)
- THEN all fixed UI strings update to that locale immediately, and task titles/descriptions remain unchanged

#### Scenario: Persist locale across reloads

- GIVEN the user has selected a locale using the locale control
- WHEN the user reloads the page or revisits the Task Board
- THEN the UI initializes in the previously selected locale

#### Scenario: Infer locale on first visit

- GIVEN no stored locale preference exists for this origin
- WHEN the user opens the Task Board for the first time
- THEN the UI initializes in Chinese if the browser language indicates Chinese, otherwise in English

### Requirement: Add lane

The system SHALL allow creating lanes.

#### Scenario: Create lane

- GIVEN the system is running
- WHEN a client POSTs a new lane name to `/lanes`
- THEN the system creates a lane and returns it with id and position

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

