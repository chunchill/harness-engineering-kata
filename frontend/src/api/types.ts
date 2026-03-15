export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskCreateRequest {
  title: string
  description?: string | null
}

export interface TaskUpdateRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
}
