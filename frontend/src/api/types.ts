export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export type LaneKey = TaskStatus

export interface Lane {
  id: number
  key: LaneKey | null
  name: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface LaneRenameRequest {
  name: string
}

export interface LaneCreateRequest {
  name: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  laneId: number
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskCreateRequest {
  title: string
  description?: string | null
  priority?: TaskPriority | null
  dueDate?: string | null
  laneId?: number | null
}

export interface TaskUpdateRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
  laneId?: number | null
  priority?: TaskPriority | null
  dueDate?: string | null
  clearDueDate?: boolean
}

export interface User {
  id: number
  openid: string
  nickname: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}
