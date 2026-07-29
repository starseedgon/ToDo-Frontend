<script setup lang="ts">
import type { TaskFilter } from '../types/task'

defineProps<{ filter: TaskFilter; searchKeyword: string }>()
const emit = defineEmits<{
  'update:filter': [value: TaskFilter]
  'update:searchKeyword': [value: string]
}>()
</script>

<template>
  <section class="toolbar">
    <div class="search-field">
      <span aria-hidden="true">⌕</span>
      <label class="sr-only" for="task-search">업무 검색</label>
      <input
        id="task-search"
        type="search"
        placeholder="제목이나 설명으로 검색"
        :value="searchKeyword"
        @input="emit('update:searchKeyword', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="filter-group" aria-label="업무 상태 필터">
      <button
        v-for="item in ([['all', '전체'], ['pending', '진행 중'], ['completed', '완료']] as const)"
        :key="item[0]"
        type="button"
        :class="{ active: filter === item[0] }"
        @click="emit('update:filter', item[0])"
      >{{ item[1] }}</button>
    </div>
  </section>
</template>
