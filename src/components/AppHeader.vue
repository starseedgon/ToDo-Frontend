<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { userName } = storeToRefs(authStore)

function handleLogout() {
  authStore.logout()
  void router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <RouterLink class="brand" to="/tasks">
      <span class="brand__mark">P</span>
      <span>Pinia Task Manager</span>
    </RouterLink>
    <nav aria-label="주 메뉴">
      <RouterLink to="/tasks">업무</RouterLink>
      <RouterLink to="/dashboard">대시보드</RouterLink>
    </nav>
    <div class="user-menu">
      <span><strong>{{ userName }}</strong>님</span>
      <button class="button button--ghost button--small" type="button" @click="handleLogout">로그아웃</button>
    </div>
  </header>
</template>
