import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/client'
import type { Task } from '../api/types'
import { I18nProvider } from '../i18n/I18nProvider'
import { TaskBoard } from './TaskBoard'

vi.mock('../api/client')

describe('TaskBoard', () => {
  let tasks: Task[] = []

  beforeEach(() => {
    tasks = []
    vi.mocked(api.listTasks).mockImplementation(() => Promise.resolve([...tasks]))
    vi.mocked(api.createTask).mockImplementation(async (req) => {
      const task: Task = {
        id: tasks.length + 1,
        title: req.title,
        description: req.description ?? null,
        status: 'TODO',
        priority: req.priority ?? 'MEDIUM',
        dueDate: req.dueDate ?? null,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }
      tasks = [...tasks, task]
      return task
    })
    vi.mocked(api.updateTask).mockImplementation(async (id, patch) => {
      const t = tasks.find((x) => x.id === id)
      if (!t) throw new Error('task not found')
      const next: Task = {
        ...t,
        ...patch,
        description:
          patch.description !== undefined ? patch.description : t.description,
        dueDate: patch.dueDate !== undefined ? patch.dueDate : t.dueDate,
        priority: patch.priority ?? t.priority,
        status: patch.status ?? t.status,
        updatedAt: '2026-01-02T00:00:00Z',
      }
      tasks = tasks.map((x) => (x.id === id ? next : x))
      return next
    })
    vi.mocked(api.deleteTask).mockImplementation(async (id) => {
      tasks = tasks.filter((x) => x.id !== id)
    })
  })

  it('shows loading then board with add-task control', async () => {
    render(
      <I18nProvider>
        <TaskBoard />
      </I18nProvider>,
    )
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: /task board/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  it('creates a task through the modal and lists it', async () => {
    const user = userEvent.setup()
    render(
      <I18nProvider>
        <TaskBoard />
      </I18nProvider>,
    )
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument())

    const headerAddButtons = screen.getAllByRole('button', { name: /add task/i })
    await user.click(headerAddButtons[0])
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText(/^title$/i), 'Buy milk')
    await user.click(within(dialog).getByRole('button', { name: /^add task$/i }))

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument()
    })
    expect(api.createTask).toHaveBeenCalled()
  })
})
