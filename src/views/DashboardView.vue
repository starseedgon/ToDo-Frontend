<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '../components/AppHeader.vue'
import TaskStatistics from '../components/TaskStatistics.vue'
import { useTaskStore } from '../stores/task'

const taskStore = useTaskStore()
const { tasks, totalCount, completedCount, pendingCount } = storeToRefs(taskStore)
onMounted(() => void taskStore.fetchTasks())

const completionRate = computed(() => totalCount.value ? Math.round((completedCount.value / totalCount.value) * 100) : 0)
const priorityCounts = computed(() => ({
  high: tasks.value.filter((task) => task.priority === 'high').length,
  medium: tasks.value.filter((task) => task.priority === 'medium').length,
  low: tasks.value.filter((task) => task.priority === 'low').length,
}))
</script>

<template>
  <AppHeader />
  <main class="page-shell">
    <header class="page-intro">
      <div><span class="eyebrow">OVERVIEW</span><h1>대시보드</h1><p>업무 현황을 한눈에 확인하세요.</p></div>
      <RouterLink class="button button--secondary" to="/tasks">← 업무로 돌아가기</RouterLink>
    </header>
    <TaskStatistics :total="totalCount" :completed="completedCount" :pending="pendingCount" />
    <section class="dashboard-grid">
      <article class="card progress-card">
        <span class="eyebrow">PROGRESS</span><h2>전체 완료율</h2>
        <div class="progress-ring" :style="{ '--progress': `${completionRate * 3.6}deg` }">
          <div><strong>{{ completionRate }}%</strong><span>완료</span></div>
        </div>
        <div class="progress-bar"><span :style="{ width: `${completionRate}%` }"></span></div>
        <p>{{ completedCount }}개의 업무를 완료했습니다. 꾸준히 진행해 보세요!</p>
      </article>
      <article class="card priority-card">
        <span class="eyebrow">PRIORITY</span><h2>우선순위별 업무</h2>
        <div v-for="item in ([['high', '높음'], ['medium', '보통'], ['low', '낮음']] as const)" :key="item[0]" class="priority-row">
          <span class="priority-dot" :class="`priority-dot--${item[0]}`"></span>
          <span>{{ item[1] }}</span><strong>{{ priorityCounts[item[0]] }}</strong>
          <div class="mini-bar"><span :class="`mini-bar--${item[0]}`" :style="{ width: `${totalCount ? priorityCounts[item[0]] / totalCount * 100 : 0}%` }"></span></div>
        </div>
      </article>
    </section>
  </main>
</template>
