import { useState, useEffect, useCallback } from 'react'
import type { Lane, Task, TaskPriority } from '../api/types'
import * as api from '../api/client'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/messages'
import { AddTaskModal } from './AddTaskModal'
import './TaskBoard.css'

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

export function TaskBoard(props: { onLoggedOut: () => void }) {
  const { locale, setLocale, t } = useI18n()

  const priorityLabel = useCallback(
    (p: TaskPriority) => t(`priority.${p.toLowerCase()}` as MessageKey),
    [t],
  )

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true) // true until first fetch completes
  const [error, setError] = useState<string | null>(null)
  const [lanes, setLanes] = useState<Lane[] | null>(null)
  const [creatingLane, setCreatingLane] = useState(false)
  const [createLaneValue, setCreateLaneValue] = useState('')
  const [renamingLaneId, setRenamingLaneId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingLaneId, setDeletingLaneId] = useState<number | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addModalNonce, setAddModalNonce] = useState(0)

  const openAddModal = () => {
    setAddModalNonce((n) => n + 1)
    setAddModalOpen(true)
  }
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
  const [dragOverLaneId, setDragOverLaneId] = useState<number | null>(null)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((th) => (th === 'light' ? 'dark' : 'light'))

  const toggleLocale = () => setLocale(locale === 'en' ? 'zh' : 'en')

  const reloadAll = () => {
    Promise.all([api.listTasks(), api.listLanes()])
      .then(([taskData, laneData]) => {
        setTasks(taskData)
        setLanes(laneData)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listTasks(), api.listLanes()])
      .then(([taskData, laneData]) => {
        if (cancelled) return
        setTasks(taskData)
        setLanes(laneData)
      })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const remove = (id: number) => {
    api.deleteTask(id).then(reloadAll).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const setPriority = (task: Task, priority: TaskPriority) => {
    const value = PRIORITIES.includes(priority) ? priority : DEFAULT_PRIORITY
    api.updateTask(task.id, { priority: value }).then(reloadAll).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const setDueDate = (task: Task, dueDate: string | null) => {
    if (dueDate) {
      api.updateTask(task.id, { dueDate }).then(reloadAll).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    } else {
      api.updateTask(task.id, { clearDueDate: true }).then(reloadAll).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    }
  }

  const byLaneId = (laneId: number) => tasks.filter((t) => t.laneId === laneId)

  const startRenameLane = (lane: Lane) => {
    setRenamingLaneId(lane.id)
    setRenameValue(lane.name)
  }

  const submitRenameLane = async () => {
    if (!renamingLaneId) return
    try {
      const updated = await api.renameLane(renamingLaneId, { name: renameValue })
      setLanes((prev) => {
        if (!prev) return [updated]
        const idx = prev.findIndex((l) => l.id === updated.id)
        if (idx === -1) return [...prev, updated]
        return prev.map((l) => (l.id === updated.id ? updated : l))
      })
      setRenamingLaneId(null)
      setRenameValue('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const submitCreateLane = async () => {
    try {
      const created = await api.createLane({ name: createLaneValue })
      setLanes((prev) => (prev ? [...prev, created].sort((a, b) => a.position - b.position) : [created]))
      setCreatingLane(false)
      setCreateLaneValue('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const handleCardDragStart = (task: Task, e: React.DragEvent) => {
    setDraggedTaskId(task.id)
    e.dataTransfer.setData('taskId', String(task.id))
    e.dataTransfer.setData('laneId', String(task.laneId))
    e.dataTransfer.effectAllowed = 'move'
    const card = (e.target as HTMLElement).closest('.task-card')
    if (card) e.dataTransfer.setDragImage(card as HTMLElement, 0, 0)
  }

  const handleCardDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverLaneId(null)
  }

  const handleColumnDragOver = (laneId: number, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverLaneId(laneId)
  }

  const handleColumnDragLeave = () => {
    setDragOverLaneId(null)
  }

  const handleColumnDrop = (targetLaneId: number, e: React.DragEvent) => {
    e.preventDefault()
    setDragOverLaneId(null)
    setDraggedTaskId(null)
    const taskId = e.dataTransfer.getData('taskId')
    const sourceLaneId = Number(e.dataTransfer.getData('laneId') || '0')
    if (!taskId || !targetLaneId || sourceLaneId === targetLaneId) return
    api.updateTask(Number(taskId), { laneId: targetLaneId }).then(reloadAll).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const submitDeleteLane = async () => {
    if (!deletingLaneId) return
    try {
      await api.deleteLane(deletingLaneId)
      setDeletingLaneId(null)
      reloadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  if (loading) return <div className="board-loading">{t('board.loading')}</div>
  if (error) return <div className="board-error">{t('board.errorPrefix')}{error}</div>

  return (
    <div className="task-board">
      <header className="board-header">
        <div className="board-header-row">
          <h1>{t('board.title')}</h1>
          <div className="board-header-actions">
            <button
              type="button"
              className="btn-add-task"
              onClick={() => api.logout().then(props.onLoggedOut).catch((e) => setError(e instanceof Error ? e.message : String(e)))}
            >
              {t('auth.logout')}
            </button>
            <button
              type="button"
              className="btn-add-task"
              onClick={openAddModal}
              aria-haspopup="dialog"
              aria-expanded={addModalOpen}
            >
              {t('form.addTask')}
            </button>
            <button
              type="button"
              className="btn-add-task"
              onClick={() => setCreatingLane(true)}
            >
              {t('lane.add')}
            </button>
            <button
              type="button"
              className="btn-theme-toggle"
              onClick={toggleLocale}
              title={locale === 'en' ? t('locale.switchToZh') : t('locale.switchToEn')}
              aria-label={locale === 'en' ? t('locale.switchToZh') : t('locale.switchToEn')}
            >
              <svg
                className="header-action-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20" />
              </svg>
            </button>
            <button
              type="button"
              className="btn-theme-toggle"
              onClick={toggleTheme}
              title={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
              aria-label={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      <AddTaskModal
        key={addModalNonce}
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={reloadAll}
      />
      <div className="board-columns">
        {(lanes ?? []).map((lane) => (
          <div
            key={lane.id}
            className={`column ${dragOverLaneId === lane.id ? 'drop-target' : ''}`}
            onDragOver={(e) => handleColumnDragOver(lane.id, e)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(lane.id, e)}
          >
            <div className="column-title-row">
              <h2 className="column-title">{lane.name}</h2>
              <div className="column-title-actions">
                <button
                  type="button"
                  className="column-rename-btn"
                  onClick={() => startRenameLane(lane)}
                  aria-label={t('column.rename') as string}
                  title={t('column.rename') as string}
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="column-delete-btn"
                  onClick={() => setDeletingLaneId(lane.id)}
                  aria-label={t('lane.delete') as string}
                  title={t('lane.delete') as string}
                >
                  🗑
                </button>
              </div>
            </div>
            <div className="column-tasks">
              {byLaneId(lane.id).map((task) => (
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
                      title={t('card.dragTitle')}
                      aria-label={t('card.dragAria')}
                    >
                      ⋮⋮
                    </span>
                    <div className="task-title">{task.title}</div>
                  </div>
                  <div className="task-card-body">
                    {task.description && <div className="task-desc">{task.description}</div>}
                    <div className="task-card-due">
                      <span className="task-due-label">{t('card.dueLabel')}</span>
                      <input
                        type="date"
                        value={task.dueDate ?? ''}
                        onChange={(e) => setDueDate(task, e.target.value || null)}
                        className="task-due-date-input"
                        title={t('card.dueTitle')}
                        aria-label={t('card.dueAria')}
                      />
                    </div>
                  </div>
                  <div className="task-card-footer">
                    <select
                      value={normalizePriority(task.priority)}
                      onChange={(e) => {
                        const v = e.target.value
                        setPriority(task, (PRIORITIES.includes(v as TaskPriority) ? v : DEFAULT_PRIORITY) as TaskPriority)
                      }}
                      className={`task-priority-badge-select task-priority-${normalizePriority(task.priority).toLowerCase()}`}
                      title={t('card.priorityTitle')}
                      aria-label={t('card.priorityAria')}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {priorityLabel(p)}
                          {p === DEFAULT_PRIORITY ? t('priority.defaultSuffix') : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-delete btn-delete-icon"
                      onClick={() => remove(task.id)}
                      title={t('card.deleteTitle')}
                      aria-label={t('card.deleteAria')}
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
      {creatingLane && (
        <div className="rename-lane-modal" role="dialog" aria-modal="true" aria-label={t('lane.add') as string}>
          <div className="rename-lane-panel">
            <div className="rename-lane-title">{t('lane.add')}</div>
            <input
              className="rename-lane-input"
              value={createLaneValue}
              onChange={(e) => setCreateLaneValue(e.target.value)}
              autoFocus
            />
            <div className="rename-lane-actions">
              <button type="button" className="rename-lane-cancel" onClick={() => setCreatingLane(false)}>
                {t('form.cancel')}
              </button>
              <button type="button" className="rename-lane-save" onClick={submitCreateLane}>
                {t('form.save')}
              </button>
            </div>
          </div>
          <button type="button" className="rename-lane-backdrop" onClick={() => setCreatingLane(false)} aria-label="Close" />
        </div>
      )}
      {renamingLaneId && (
        <div className="rename-lane-modal" role="dialog" aria-modal="true" aria-label={t('column.rename') as string}>
          <div className="rename-lane-panel">
            <div className="rename-lane-title">{t('column.rename')}</div>
            <input
              className="rename-lane-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
            />
            <div className="rename-lane-actions">
              <button type="button" className="rename-lane-cancel" onClick={() => setRenamingLaneId(null)}>
                {t('form.cancel')}
              </button>
              <button type="button" className="rename-lane-save" onClick={submitRenameLane}>
                {t('form.save')}
              </button>
            </div>
          </div>
          <button type="button" className="rename-lane-backdrop" onClick={() => setRenamingLaneId(null)} aria-label="Close" />
        </div>
      )}
      {deletingLaneId && (
        <div className="rename-lane-modal" role="dialog" aria-modal="true" aria-label={t('lane.delete') as string}>
          <div className="rename-lane-panel">
            <div className="rename-lane-title">{t('lane.deleteConfirm')}</div>
            <div className="rename-lane-actions">
              <button type="button" className="rename-lane-cancel" onClick={() => setDeletingLaneId(null)}>
                {t('form.cancel')}
              </button>
              <button type="button" className="rename-lane-save" onClick={submitDeleteLane}>
                {t('form.save')}
              </button>
            </div>
          </div>
          <button type="button" className="rename-lane-backdrop" onClick={() => setDeletingLaneId(null)} aria-label="Close" />
        </div>
      )}
    </div>
  )
}
