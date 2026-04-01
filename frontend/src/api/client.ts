import type { Lane, LaneCreateRequest, LaneRenameRequest, Task, TaskCreateRequest, TaskUpdateRequest, User } from './types'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
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

export async function listLanes(): Promise<Lane[]> {
  return request<Lane[]>('/lanes')
}

export async function createLane(req: LaneCreateRequest): Promise<Lane> {
  return request<Lane>('/lanes', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export async function renameLane(id: number, req: LaneRenameRequest): Promise<Lane> {
  return request<Lane>(`/lanes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(req),
  })
}

export async function deleteLane(id: number): Promise<void> {
  return request<void>(`/lanes/${id}`, { method: 'DELETE' })
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

export async function me(): Promise<User> {
  return request<User>('/me')
}

export async function logout(): Promise<void> {
  return request<void>('/logout', { method: 'POST' })
}

export function wechatLoginUrl(): string {
  return '/auth/wechat/login'
}

export async function register(req: { phone: string; password: string }): Promise<User> {
  return request<User>('/auth/register', { method: 'POST', body: JSON.stringify(req) })
}

export async function login(req: { phone: string; password: string }): Promise<User> {
  return request<User>('/auth/login', { method: 'POST', body: JSON.stringify(req) })
}
