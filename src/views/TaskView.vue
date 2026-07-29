<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '../components/AppHeader.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TaskFilter from '../components/TaskFilter.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import TaskStatistics from '../components/TaskStatistics.vue'
import { useTaskStore } from '../stores/task'
import type { Task, TaskInput } from '../types/task'

const taskStore = useTaskStore()
const { filteredTasks, totalCount, completedCount, pendingCount, loading, error, filter, searchKeyword } = storeToRefs(taskStore)
const editingTask = ref<Task | null>(null)

onMounted(() => void taskStore.fetchTasks())

function saveTask(input: TaskInput) {
  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, input)
    editingTask.value = null
  } else taskStore.addTask(input)
}

function confirmDelete(id: number) {
  if (window.confirm('이 업무를 삭제할까요?')) taskStore.deleteTask(id)
}
</script>

<template>
  <AppHeader />
  <main class="page-shell">
    <header class="page-intro">
      <div><span class="eyebrow">TASKS</span><h1>업무 관리</h1><p>할 일을 정리하고 오늘의 흐름을 만들어 보세요.</p></div>
      <RouterLink class="button button--secondary" to="/dashboard">대시보드 보기 →</RouterLink>
    </header>
    <TaskStatistics :total="totalCount" :completed="completedCount" :pending="pendingCount" />
    <div class="task-layout">
      <TaskForm :task="editingTask" @submit="saveTask" @cancel="editingTask = null" />
      <div class="task-main">
        <TaskFilter
          :filter="filter" :search-keyword="searchKeyword"
          @update:filter="taskStore.setFilter" @update:search-keyword="taskStore.setSearchKeyword"
        />
        <LoadingSpinner v-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" @retry="taskStore.fetchTasks" />
        <TaskList v-else :tasks="filteredTasks" @toggle="taskStore.toggleTask" @edit="editingTask = $event" @delete="confirmDelete" />
      </div>
    </div>
  </main>
</template>
