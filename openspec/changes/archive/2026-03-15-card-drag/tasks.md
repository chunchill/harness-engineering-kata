# Implementation tasks: Card drag-and-drop

- [x] 1. Frontend: make each task card draggable (e.g. HTML5 draggable + onDragStart), storing task id and optionally source status in dataTransfer.
- [x] 2. Frontend: make each column (or column-tasks area) a drop target (onDragOver preventDefault + onDrop); on drop, resolve target column status and call api.updateTask(taskId, { status }) then refresh list.
- [x] 3. Frontend: add visual feedback when dragging (e.g. card opacity or placeholder, column highlight when over a valid drop zone); ensure drag does not conflict with priority select or buttons (e.g. drag handle or drag only from card body).
- [x] 4. OpenSpec spec delta: add requirement and scenario for drag-and-drop move under task-board spec (see specs/task-board/ in this change).
