<script setup lang="ts">
import type { Task } from '../types/task'
import TaskItem from './TaskItem.vue'

defineProps<{ tasks: Task[] }>()
defineEmits<{ toggle: [id: number]; edit: [task: Task]; delete: [id: number] }>()
</script>

<template>
  <section class="task-list card">
    <div class="section-heading">
      <div><span class="eyebrow">YOUR WORK</span><h2>업무 목록</h2></div>
      <span class="result-count">{{ tasks.length }}개 표시</span>
    </div>
    <div v-if="tasks.length" class="task-items">
      <TaskItem
        v-for="task in tasks" :key="task.id" :task="task"
        @toggle="$emit('toggle', $event)" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)"
      />
    </div>
    <div v-else class="empty-state">
      <span aria-hidden="true">✓</span>
      <h3>표시할 업무가 없습니다</h3>
      <p>새 업무를 추가하거나 검색 조건을 변경해 보세요.</p>
    </div>
  </section>
</template>
