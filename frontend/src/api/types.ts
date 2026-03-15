export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface TaskCreateRequest {
  title: string
  description?: string | null
  priority?: TaskPriority | null
}

export interface TaskUpdateRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority | null
}
