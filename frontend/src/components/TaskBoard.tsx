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
const THEME_KEY = 'task-board-theme'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

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
  const [newDueDate, setNewDueDate] = useState('')
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

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
    const dueDate = newDueDate.trim() || null
    api.createTask({ title, description: newDesc.trim() || null, priority, dueDate })
      .then(() => {
        setNewTitle('')
        setNewDesc('')
        setNewPriority('')
        setNewDueDate('')
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

  const setDueDate = (task: Task, dueDate: string | null) => {
    if (dueDate) {
      api.updateTask(task.id, { dueDate }).then(load).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    } else {
      api.updateTask(task.id, { clearDueDate: true }).then(load).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    }
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
        <div className="board-header-row">
          <h1>Task Board</h1>
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
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
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="input-due-date"
            title="Due date (optional)"
            aria-label="Due date"
          />
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
                  <div className="task-card-top">
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
                    <div className="task-title">{task.title}</div>
                  </div>
                  {task.description && <div className="task-desc">{task.description}</div>}
                  <div className="task-card-footer">
                    <span className={`task-priority-badge task-priority-${normalizePriority(task.priority).toLowerCase()}`}>
                      {normalizePriority(task.priority)}
                    </span>
                    <input
                      type="date"
                      value={task.dueDate ?? ''}
                      onChange={(e) => setDueDate(task, e.target.value || null)}
                      className="task-due-date-input"
                      title="Due date"
                      aria-label="Due date"
                    />
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
