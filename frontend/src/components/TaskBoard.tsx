import { useState, useEffect } from 'react'
import type { Task, TaskStatus } from '../api/types'
import * as api from '../api/client'
import './TaskBoard.css'

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'Todo' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'DONE', label: 'Done' },
]

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true) // true until first fetch completes
  const [error, setError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')

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
    api.createTask({ title, description: newDesc.trim() || null })
      .then(() => {
        setNewTitle('')
        setNewDesc('')
        load()
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const moveStatus = (task: Task, status: TaskStatus) => {
    api.updateTask(task.id, { status })
      .then(load)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const remove = (id: number) => {
    api.deleteTask(id).then(load).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)

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
          <button type="submit" className="btn-create">Add task</button>
        </form>
      </header>
      <div className="board-columns">
        {COLUMNS.map(({ status, label }) => (
          <div key={status} className="column">
            <h2 className="column-title">{label}</h2>
            <div className="column-tasks">
              {byStatus(status).map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-title">{task.title}</div>
                  {task.description && <div className="task-desc">{task.description}</div>}
                  <div className="task-actions">
                    {COLUMNS.filter((c) => c.status !== task.status).map((c) => (
                      <button
                        key={c.status}
                        type="button"
                        className="btn-move"
                        onClick={() => moveStatus(task, c.status)}
                      >
                        → {c.label}
                      </button>
                    ))}
                    <button type="button" className="btn-delete" onClick={() => remove(task.id)}>
                      Delete
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
