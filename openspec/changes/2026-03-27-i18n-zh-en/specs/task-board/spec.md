# task-board Specification (Delta: UI i18n)

## ADDED Requirements

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
