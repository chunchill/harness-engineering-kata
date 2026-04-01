import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Lane, LaneKey, Task, TaskPriority, TaskStatus } from '../api/types'
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

export function TaskBoard() {
  const { locale, setLocale, t } = useI18n()

  const defaultColumns = useMemo(
    (): { key: LaneKey; fallbackLabel: string }[] => [
      { key: 'TODO', fallbackLabel: t('column.todo') },
      { key: 'IN_PROGRESS', fallbackLabel: t('column.inProgress') },
      { key: 'DONE', fallbackLabel: t('column.done') },
    ],
    [t],
  )

  const priorityLabel = useCallback(
    (p: TaskPriority) => t(`priority.${p.toLowerCase()}` as MessageKey),
    [t],
  )

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true) // true until first fetch completes
  const [error, setError] = useState<string | null>(null)
  const [lanes, setLanes] = useState<Lane[] | null>(null)
  const [renamingLaneKey, setRenamingLaneKey] = useState<LaneKey | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addModalNonce, setAddModalNonce] = useState(0)

  const openAddModal = () => {
    setAddModalNonce((n) => n + 1)
    setAddModalOpen(true)
  }
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((th) => (th === 'light' ? 'dark' : 'light'))

  const toggleLocale = () => setLocale(locale === 'en' ? 'zh' : 'en')

  const reloadTasks = () => {
    api.listTasks()
      .then((data) => {
        setTasks(data)
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
    api.deleteTask(id).then(reloadTasks).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const setPriority = (task: Task, priority: TaskPriority) => {
    const value = PRIORITIES.includes(priority) ? priority : DEFAULT_PRIORITY
    api.updateTask(task.id, { priority: value }).then(reloadTasks).catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }

  const setDueDate = (task: Task, dueDate: string | null) => {
    if (dueDate) {
      api.updateTask(task.id, { dueDate }).then(reloadTasks).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    } else {
      api.updateTask(task.id, { clearDueDate: true }).then(reloadTasks).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    }
  }

  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)

  const laneNameFor = useCallback(
    (key: LaneKey, fallback: string) => {
      const found = lanes?.find((l) => l.key === key)
      return found?.name ?? fallback
    },
    [lanes],
  )

  const startRenameLane = (key: LaneKey) => {
    const current = lanes?.find((l) => l.key === key)?.name
    const fallback = defaultColumns.find((c) => c.key === key)?.fallbackLabel ?? key
    setRenamingLaneKey(key)
    setRenameValue(current ?? fallback)
  }

  const submitRenameLane = async () => {
    if (!renamingLaneKey) return
    try {
      const updated = await api.renameLane(renamingLaneKey, { name: renameValue })
      setLanes((prev) => {
        if (!prev) return [updated]
        const idx = prev.findIndex((l) => l.key === updated.key)
        if (idx === -1) return [...prev, updated]
        return prev.map((l) => (l.key === updated.key ? updated : l))
      })
      setRenamingLaneKey(null)
      setRenameValue('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

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
    api.updateTask(Number(taskId), { status: targetStatus }).then(reloadTasks).catch((e) => setError(e instanceof Error ? e.message : String(e)))
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
              onClick={openAddModal}
              aria-haspopup="dialog"
              aria-expanded={addModalOpen}
            >
              {t('form.addTask')}
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
        onCreated={reloadTasks}
      />
      <div className="board-columns">
        {defaultColumns.map(({ key, fallbackLabel }) => (
          <div
            key={key}
            className={`column ${dragOverStatus === key ? 'drop-target' : ''}`}
            onDragOver={(e) => handleColumnDragOver(key, e)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(key, e)}
          >
            <div className="column-title-row">
              <h2 className="column-title">{laneNameFor(key, fallbackLabel)}</h2>
              <button
                type="button"
                className="column-rename-btn"
                onClick={() => startRenameLane(key)}
                aria-label={t('column.rename') as string}
                title={t('column.rename') as string}
              >
                ✎
              </button>
            </div>
            <div className="column-tasks">
              {byStatus(key).map((task) => (
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
      {renamingLaneKey && (
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
              <button type="button" className="rename-lane-cancel" onClick={() => setRenamingLaneKey(null)}>
                {t('form.cancel')}
              </button>
              <button type="button" className="rename-lane-save" onClick={submitRenameLane}>
                {t('form.save')}
              </button>
            </div>
          </div>
          <button type="button" className="rename-lane-backdrop" onClick={() => setRenamingLaneKey(null)} aria-label="Close" />
        </div>
      )}
    </div>
  )
}
