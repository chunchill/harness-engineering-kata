import type { Task, TaskCreateRequest, TaskUpdateRequest } from './types'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function listTasks(): Promise<Task[]> {
  return request<Task[]>('/tasks')
}

export async function createTask(req: TaskCreateRequest): Promise<Task> {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

/** Partial update. Uses POST /tasks/{id}/patch so dev proxies forward the body reliably (PATCH bodies are often dropped). */
export async function updateTask(id: number, req: TaskUpdateRequest): Promise<Task> {
  return request<Task>(`/tasks/${id}/patch`, {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export async function deleteTask(id: number): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: 'DELETE' })
}
