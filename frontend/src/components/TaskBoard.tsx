import { useState, useEffect } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../api/types'
import * as api from '../api/client'
import './TaskBoard.css'

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'Todo' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'DONE', label: 'Done' },
]

const PRIORITIES: TaskPriority[] = ['HIGH', 'MEDIUM', 'LOW']

const DEFAULT_PRIORITY: TaskPriority = 'MEDIUM'

function normalizePriority(p: TaskPriority | null | undefined): TaskPriority {
  return p && PRIORITIES.includes(p) ? p : DEFAULT_PRIORITY
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true) // true until first fetch completes
  const [error, setError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPriority, setNewPriority] = useState<TaskPriority | ''>('')
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    api.listTasks()
      .then(setTasks)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let cancelled = false
    api.listTasks()
      .then((data) => { if (!cancelled) setTasks(data) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    const form = e.currentTarget
    const prioritySelect = form.querySelector('.input-priority') as HTMLSelectElement | null
    const priorityValue = prioritySelect?.value
    const priority: TaskPriority =
      priorityValue && PRIORITIES.includes(priorityValue as TaskPriority)
        ? (priorityValue as TaskPriority)
        : DEFAULT_PRIORITY
    api.createTask({ title, description: newDesc.trim() || null, priority })
      .then(() => {
        setNewTitle('')
        setNewDesc('')
        setNewPriority('')
        load()
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const remove = (id: number) => {
    api.deleteTask(id).then(load).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const setPriority = (task: Task, priority: TaskPriority) => {
    const value = PRIORITIES.includes(priority) ? priority : DEFAULT_PRIORITY
    api.updateTask(task.id, { priority: value }).then(load).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)

  const handleCardDragStart = (task: Task, e: React.DragEvent) => {
    setDraggedTaskId(task.id)
    e.dataTransfer.setData('taskId', String(task.id))
    e.dataTransfer.setData('taskStatus', task.status)
    e.dataTransfer.effectAllowed = 'move'
    const card = (e.target as HTMLElement).closest('.task-card')
    if (card) e.dataTransfer.setDragImage(card as HTMLElement, 0, 0)
  }

  const handleCardDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverStatus(null)
  }

  const handleColumnDragOver = (status: TaskStatus, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStatus(status)
  }

  const handleColumnDragLeave = () => {
    setDragOverStatus(null)
  }

  const handleColumnDrop = (targetStatus: TaskStatus, e: React.DragEvent) => {
    e.preventDefault()
    setDragOverStatus(null)
    setDraggedTaskId(null)
    const taskId = e.dataTransfer.getData('taskId')
    const sourceStatus = e.dataTransfer.getData('taskStatus') as TaskStatus
    if (!taskId || sourceStatus === targetStatus) return
    api.updateTask(Number(taskId), { status: targetStatus }).then(load).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  if (loading) return <div className="board-loading">Loading…</div>
  if (error) return <div className="board-error">Error: {error}</div>

  return (
    <div className="task-board">
      <header className="board-header">
        <h1>Task Board</h1>
        <form onSubmit={handleCreate} className="create-form">
          <input
            type="text"
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="input-title"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="input-desc"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority((e.target.value || '') as TaskPriority | '')}
            className="input-priority"
            title="Priority"
          >
            <option value="">Priority (default: Medium)</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button type="submit" className="btn-create">Add task</button>
        </form>
      </header>
      <div className="board-columns">
        {COLUMNS.map(({ status, label }) => (
          <div
            key={status}
            className={`column ${dragOverStatus === status ? 'drop-target' : ''}`}
            onDragOver={(e) => handleColumnDragOver(status, e)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(status, e)}
          >
            <h2 className="column-title">{label}</h2>
            <div className="column-tasks">
              {byStatus(status).map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${draggedTaskId === task.id ? 'dragging' : ''}`}
                >
                  <div className="task-card-header">
                    <span
                      className="task-drag-handle"
                      draggable
                      onDragStart={(e) => handleCardDragStart(task, e)}
                      onDragEnd={handleCardDragEnd}
                      title="Drag to move"
                      aria-label="Drag to move"
                    >
                      ⋮⋮
                    </span>
                    <span className={`task-priority-badge task-priority-${normalizePriority(task.priority).toLowerCase()}`}>
                      {normalizePriority(task.priority)}
                    </span>
                    <select
                      value={normalizePriority(task.priority)}
                      onChange={(e) => {
                        const v = e.target.value
                        setPriority(task, (PRIORITIES.includes(v as TaskPriority) ? v : DEFAULT_PRIORITY) as TaskPriority)
                      }}
                      className="task-priority-select"
                      title="Priority (default: Medium)"
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>{p === DEFAULT_PRIORITY ? `${p} (default)` : p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="task-title">{task.title}</div>
                  {task.description && <div className="task-desc">{task.description}</div>}
                  <div className="task-actions">
                    <button
                      type="button"
                      className="btn-delete btn-delete-icon"
                      onClick={() => remove(task.id)}
                      title="Delete"
                      aria-label="Delete task"
                    >
                      <svg className="icon-delete" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
