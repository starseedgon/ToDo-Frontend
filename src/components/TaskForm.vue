<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Task, TaskInput, TaskPriority } from '../types/task'

const props = defineProps<{ task?: Task | null }>()
const emit = defineEmits<{ submit: [input: TaskInput]; cancel: [] }>()
const form = reactive<TaskInput>({ title: '', description: '', priority: 'medium' })

watch(
  () => props.task,
  (task) => {
    form.title = task?.title ?? ''
    form.description = task?.description ?? ''
    form.priority = task?.priority ?? 'medium'
  },
  { immediate: true },
)

function handleSubmit() {
  const title = form.title.trim()
  if (!title) return
  emit('submit', { title, description: form.description.trim(), priority: form.priority })
  if (!props.task) {
    form.title = ''
    form.description = ''
    form.priority = 'medium'
  }
}
</script>

<template>
  <form class="task-form card" @submit.prevent="handleSubmit">
    <div class="section-heading">
      <div><span class="eyebrow">{{ task ? 'UPDATE TASK' : 'NEW TASK' }}</span><h2>{{ task ? '업무 수정' : '새 업무 추가' }}</h2></div>
      <button v-if="task" class="icon-button" type="button" aria-label="수정 취소" @click="emit('cancel')">×</button>
    </div>
    <label for="task-title">업무 제목</label>
    <input id="task-title" v-model="form.title" required maxlength="80" placeholder="해야 할 일을 입력하세요" />
    <label for="task-description">설명</label>
    <textarea id="task-description" v-model="form.description" rows="3" maxlength="300" placeholder="업무에 대한 간단한 설명"></textarea>
    <label for="task-priority">우선순위</label>
    <select id="task-priority" v-model="form.priority">
      <option v-for="priority in (['low', 'medium', 'high'] as TaskPriority[])" :key="priority" :value="priority">
        {{ { low: '낮음', medium: '보통', high: '높음' }[priority] }}
      </option>
    </select>
    <div class="form-actions">
      <button v-if="task" class="button button--ghost" type="button" @click="emit('cancel')">취소</button>
      <button class="button button--primary" type="submit">{{ task ? '변경사항 저장' : '업무 추가' }}</button>
    </div>
  </form>
</template>
