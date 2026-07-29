export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskFilter = 'all' | 'pending' | 'completed'

export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: TaskPriority
  createdAt: string
}

export interface TaskInput {
  title: string
  description: string
  priority: TaskPriority
}
