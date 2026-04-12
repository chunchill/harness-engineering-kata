# Implementation tasks: Remove delete button hover tips

- [x] 1. OpenSpec: add `task-board` spec delta for delete-button tooltip behavior and run `openspec validate 2026-04-12-remove-delete-button-tips --strict`.
- [x] 2. Frontend: remove `title` attribute from lane delete and task delete buttons while keeping `aria-label`.
- [x] 3. Frontend tests: verify delete buttons no longer expose hover tooltip (`title`) while remaining accessible by label.
- [x] 4. Quality: run `cd frontend && npx vitest run src/components/TaskBoard.test.tsx && npm run lint && npm run build`.
