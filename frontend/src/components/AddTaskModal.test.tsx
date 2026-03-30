import type { ComponentProps } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/client'
import type { Task } from '../api/types'
import { I18nProvider } from '../i18n/I18nProvider'
import { AddTaskModal } from './AddTaskModal'

vi.mock('../api/client', () => ({
  createTask: vi.fn(),
}))

function renderModal(props: Partial<ComponentProps<typeof AddTaskModal>> = {}) {
  const onClose = props.onClose ?? vi.fn()
  const onCreated = props.onCreated ?? vi.fn()
  return {
    ...render(
      <I18nProvider>
        <AddTaskModal open onClose={onClose} onCreated={onCreated} {...props} />
      </I18nProvider>,
    ),
    onClose,
    onCreated,
  }
}

describe('AddTaskModal', () => {
  const sampleTask: Task = {
    id: 1,
    title: 'Hello',
    description: null,
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }

  beforeEach(() => {
    vi.mocked(api.createTask).mockReset()
  })

  it('renders dialog when open with accessible name', () => {
    renderModal()
    expect(screen.getByRole('dialog', { name: /add task/i })).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    render(
      <I18nProvider>
        <AddTaskModal open={false} onClose={() => {}} onCreated={() => {}} />
      </I18nProvider>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('submit calls createTask and invokes onCreated and onClose on success', async () => {
    const user = userEvent.setup()
    vi.mocked(api.createTask).mockResolvedValueOnce(sampleTask)
    const { onClose, onCreated } = renderModal()

    await user.type(screen.getByLabelText(/^title$/i), 'Hello')
    await user.click(screen.getByRole('button', { name: /^add task$/i }))

    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Hello',
          description: null,
          priority: 'MEDIUM',
        }),
      )
    })
    expect(onCreated).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call createTask when title is empty', async () => {
    const user = userEvent.setup()
    const { onClose, onCreated } = renderModal()

    await user.click(screen.getByRole('button', { name: /^add task$/i }))

    expect(api.createTask).not.toHaveBeenCalled()
    expect(onCreated).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('cancel closes without creating', async () => {
    const user = userEvent.setup()
    const { onClose, onCreated } = renderModal()

    await user.type(screen.getByLabelText(/^title$/i), 'X')
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(api.createTask).not.toHaveBeenCalled()
    expect(onCreated).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('backdrop click closes without creating', async () => {
    const user = userEvent.setup()
    const { onClose, onCreated } = renderModal()

    await user.type(screen.getByLabelText(/^title$/i), 'Y')
    await user.click(screen.getByRole('presentation'))

    expect(api.createTask).not.toHaveBeenCalled()
    expect(onCreated).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Escape closes without creating', async () => {
    const user = userEvent.setup()
    const { onClose, onCreated } = renderModal()

    await user.type(screen.getByLabelText(/^title$/i), 'Z')
    await user.keyboard('{Escape}')

    expect(api.createTask).not.toHaveBeenCalled()
    expect(onCreated).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
