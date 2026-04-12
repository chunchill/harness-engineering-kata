# Change: Remove hover tips on delete buttons

## Why

The board currently shows browser-native tooltip text when users hover delete buttons (task delete and lane delete). This creates distracting visual noise for frequent actions and is not required for accessibility because the controls already expose accessible labels.

## What Changes

- **Frontend**: remove hover tooltips from delete controls by not setting `title` on delete buttons.
- **Accessibility**: keep `aria-label` on delete controls so screen readers still get clear control names.
- **Backend / API**: no changes.

## Impact

- **Spec**: `task-board` gains a requirement that delete actions must not rely on hover tips.
- **Frontend**: `frontend/src/components/TaskBoard.tsx`.
- **Tests**: add/update UI test assertions for no `title` on delete buttons.
