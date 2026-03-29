import { useState, useEffect, useRef, useCallback, useId } from 'react'
import type { TaskPriority } from '../api/types'
import * as api from '../api/client'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/messages'

const PRIORITIES: TaskPriority[] = ['HIGH', 'MEDIUM', 'LOW']
const DEFAULT_PRIORITY: TaskPriority = 'MEDIUM'

const DIALOG_TITLE_ID = 'add-task-modal-title'

type Props = {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function AddTaskModal({ open, onClose, onCreated }: Props) {
  const { t } = useI18n()
  const formId = useId()
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState<TaskPriority | ''>('')
  const [dueDate, setDueDate] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fieldIds = {
    title: `${formId}-title`,
    description: `${formId}-description`,
    priority: `${formId}-priority`,
    due: `${formId}-due`,
  }

  const priorityLabel = useCallback(
    (p: TaskPriority) => t(`priority.${p.toLowerCase()}` as MessageKey),
    [t],
  )

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      titleInputRef.current?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || submitting) return
    const priorityValue: TaskPriority =
      priority && PRIORITIES.includes(priority) ? priority : DEFAULT_PRIORITY
    const due = dueDate.trim() || null
    setSubmitting(true)
    setSubmitError(null)
    api
      .createTask({
        title: trimmed,
        description: desc.trim() || null,
        priority: priorityValue,
        dueDate: due,
      })
      .then(() => {
        onCreated()
        onClose()
      })
      .catch((err) => setSubmitError(err instanceof Error ? err.message : String(err)))
      .finally(() => setSubmitting(false))
  }

  if (!open) return null

  return (
    <div className="add-task-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={DIALOG_TITLE_ID}
        className="add-task-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="add-task-modal-header">
          <h2 id={DIALOG_TITLE_ID}>{t('modal.title')}</h2>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label={t('modal.closeAria')}
          >
            ×
          </button>
        </div>
        {submitError && <div className="add-task-modal-error" role="alert">{submitError}</div>}
        <form onSubmit={handleSubmit} className="add-task-modal-form">
          <div className="add-task-modal-fields">
            <div className="add-task-modal-field">
              <label className="add-task-modal-label" htmlFor={fieldIds.title}>
                {t('modal.fieldTitle')}
              </label>
              <input
                ref={titleInputRef}
                id={fieldIds.title}
                type="text"
                placeholder={t('form.titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="add-task-modal-control"
                autoComplete="off"
              />
            </div>
            <div className="add-task-modal-field">
              <label className="add-task-modal-label" htmlFor={fieldIds.description}>
                {t('modal.fieldDescription')}
                <span className="add-task-modal-label-hint">{t('modal.optionalHint')}</span>
              </label>
              <textarea
                id={fieldIds.description}
                placeholder={t('form.descPlaceholder')}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="add-task-modal-textarea"
                rows={4}
                autoComplete="off"
              />
            </div>
            <div className="add-task-modal-row">
              <div className="add-task-modal-field">
                <label className="add-task-modal-label" htmlFor={fieldIds.priority}>
                  {t('form.priorityTitle')}
                </label>
                <select
                  id={fieldIds.priority}
                  value={priority}
                  onChange={(e) => setPriority((e.target.value || '') as TaskPriority | '')}
                  className="add-task-modal-select"
                  title={t('form.priorityTitle')}
                >
                  <option value="">{t('form.priorityPlaceholder')}</option>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {priorityLabel(p)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-task-modal-field">
                <label className="add-task-modal-label" htmlFor={fieldIds.due}>
                  {t('form.dueLabel')}
                </label>
                <input
                  id={fieldIds.due}
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="add-task-modal-date"
                  title={t('form.dueTitle')}
                  aria-label={t('form.dueAria')}
                />
              </div>
            </div>
          </div>
          <div className="add-task-modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              {t('modal.cancel')}
            </button>
            <button type="submit" className="btn-create" disabled={submitting}>
              {t('form.addTask')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
