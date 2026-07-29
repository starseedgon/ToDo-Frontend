<script setup lang="ts">
defineProps<{ total: number; completed: number; pending: number }>()
</script>

<template>
  <section class="stats" aria-label="업무 통계">
    <article class="stat-card stat-card--total"><span>전체 업무</span><strong>{{ total }}</strong></article>
    <article class="stat-card stat-card--pending"><span>진행 중</span><strong>{{ pending }}</strong></article>
    <article class="stat-card stat-card--done"><span>완료</span><strong>{{ completed }}</strong></article>
  </section>
</template>
