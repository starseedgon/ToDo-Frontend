<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{ task: Task }>()
defineEmits<{ toggle: [id: number]; edit: [task: Task]; delete: [id: number] }>()

const priorityLabel = { low: '낮음', medium: '보통', high: '높음' }
</script>

<template>
  <article class="task-item" :class="{ 'task-item--completed': task.completed }">
    <label class="task-check">
      <input type="checkbox" :checked="task.completed" :aria-label="`${task.title} 완료 전환`" @change="$emit('toggle', task.id)" />
      <span aria-hidden="true"></span>
    </label>
    <div class="task-content">
      <div class="task-title-row">
        <h3>{{ task.title }}</h3>
        <span class="priority" :class="`priority--${task.priority}`">{{ priorityLabel[task.priority] }}</span>
      </div>
      <p v-if="task.description">{{ task.description }}</p>
      <time :datetime="task.createdAt">{{ new Date(task.createdAt).toLocaleDateString('ko-KR') }}</time>
    </div>
    <div class="task-actions">
      <button class="icon-button" type="button" aria-label="업무 수정" @click="$emit('edit', task)">✎</button>
      <button class="icon-button icon-button--danger" type="button" aria-label="업무 삭제" @click="$emit('delete', task.id)">×</button>
    </div>
  </article>
</template>
