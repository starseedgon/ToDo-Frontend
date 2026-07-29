import axios from 'axios'
import type { Task } from '../types/task'

interface JsonPlaceholderTodo {
  id: number
  title: string
  completed: boolean
}

function mapTodoToTask(todo: JsonPlaceholderTodo): Task {
  return {
    id: todo.id,
    title: todo.title,
    description: 'JSONPlaceholder에서 불러온 예시 업무입니다.',
    completed: todo.completed,
    priority: todo.id % 3 === 0 ? 'high' : todo.id % 2 === 0 ? 'low' : 'medium',
    createdAt: new Date(Date.now() - todo.id * 86_400_000).toISOString(),
  }
}

export async function fetchInitialTasks(): Promise<Task[]> {
  const { data } = await axios.get<JsonPlaceholderTodo[]>(
    'https://jsonplaceholder.typicode.com/todos?_limit=8',
    { timeout: 8000 },
  )
  return data.map(mapTodoToTask)
}
