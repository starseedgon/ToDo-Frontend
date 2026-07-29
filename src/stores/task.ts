import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchInitialTasks } from '../services/taskApi'
import type { Task, TaskFilter, TaskInput } from '../types/task'

const TASKS_KEY = 'pinia-task-manager-tasks'

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(TASKS_KEY)
    return saved ? (JSON.parse(saved) as Task[]) : []
  } catch {
    localStorage.removeItem(TASKS_KEY)
    return []
  }
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>(loadTasks())
  const filter = ref<TaskFilter>('all')
  const searchKeyword = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredTasks = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()
    return tasks.value.filter((task) => {
      const matchesFilter =
        filter.value === 'all' ||
        (filter.value === 'completed' ? task.completed : !task.completed)
      const matchesSearch =
        !keyword ||
        task.title.toLowerCase().includes(keyword) ||
        task.description.toLowerCase().includes(keyword)
      return matchesFilter && matchesSearch
    })
  })
  const totalCount = computed(() => tasks.value.length)
  const completedCount = computed(() => tasks.value.filter((task) => task.completed).length)
  const pendingCount = computed(() => totalCount.value - completedCount.value)

  function persistTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks.value))
  }

  async function fetchTasks() {
    if (tasks.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      tasks.value = await fetchInitialTasks()
      persistTasks()
    } catch {
      error.value = '업무 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    } finally {
      loading.value = false
    }
  }

  function addTask(input: TaskInput) {
    tasks.value.unshift({
      id: Date.now(),
      ...input,
      completed: false,
      createdAt: new Date().toISOString(),
    })
    persistTasks()
  }

  function updateTask(id: number, input: TaskInput) {
    const task = tasks.value.find((item) => item.id === id)
    if (!task) return
    // ref 내부 값을 직접 바꾸면 반응성은 유지되지만, 모든 변경을 Action에 모아
    // 저장 로직과 비즈니스 규칙을 한곳에서 관리합니다.
    Object.assign(task, input)
    persistTasks()
  }

  function deleteTask(id: number) {
    tasks.value = tasks.value.filter((task) => task.id !== id)
    persistTasks()
  }

  function toggleTask(id: number) {
    const task = tasks.value.find((item) => item.id === id)
    if (task) {
      task.completed = !task.completed
      persistTasks()
    }
  }

  function setFilter(value: TaskFilter) {
    filter.value = value
  }

  function setSearchKeyword(value: string) {
    searchKeyword.value = value
  }

  return {
    tasks, filter, searchKeyword, loading, error, filteredTasks,
    totalCount, completedCount, pendingCount, fetchTasks, addTask,
    updateTask, deleteTask, toggleTask, setFilter, setSearchKeyword,
  }
})
