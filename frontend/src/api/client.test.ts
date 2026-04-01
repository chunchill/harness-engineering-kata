import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTask, deleteTask, listTasks, updateTask } from './client'
import type { Task } from './types'

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('api client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('listTasks GET /api/tasks', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse([]))
    const result = await listTasks()
    expect(result).toEqual([])
    expect(fetch).toHaveBeenCalledWith(
      '/api/tasks',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('createTask POST with JSON body', async () => {
    const created: Task = {
      id: 1,
      title: 'T',
      description: null,
      laneId: 1,
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: null,
      createdAt: 'a',
      updatedAt: 'b',
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(created))
    const out = await createTask({ title: 'T', priority: 'HIGH' })
    expect(out).toEqual(created)
    expect(fetch).toHaveBeenCalledWith(
      '/api/tasks',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'T', priority: 'HIGH' }),
      }),
    )
  })

  it('updateTask POST /api/tasks/:id/patch', async () => {
    const updated: Task = {
      id: 5,
      title: 'X',
      description: null,
      laneId: 3,
      status: 'DONE',
      priority: 'LOW',
      dueDate: null,
      createdAt: 'a',
      updatedAt: 'b',
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(updated))
    const out = await updateTask(5, { status: 'DONE' })
    expect(out).toEqual(updated)
    expect(fetch).toHaveBeenCalledWith(
      '/api/tasks/5/patch',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ status: 'DONE' }),
      }),
    )
  })

  it('deleteTask DELETE /api/tasks/:id', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 204 }))
    await deleteTask(3)
    expect(fetch).toHaveBeenCalledWith(
      '/api/tasks/3',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('throws on non-OK response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('', { status: 500, statusText: 'Server Error' }),
    )
    await expect(listTasks()).rejects.toThrow('API 500: Server Error')
  })
})
