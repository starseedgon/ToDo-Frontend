<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)
const credentials = reactive({ id: '', password: '' })

async function handleLogin() {
  if (await authStore.login(credentials.id, credentials.password)) {
    await router.push('/tasks')
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-visual">
      <div class="visual-content">
        <span class="brand__mark brand__mark--large">P</span>
        <p class="eyebrow">PLAN · FOCUS · COMPLETE</p>
        <h1>오늘의 업무에<br />명확함을 더하세요.</h1>
        <p>Pinia로 상태를 관리하고, 중요한 일에 집중하세요.</p>
      </div>
      <div class="orb orb--one"></div><div class="orb orb--two"></div>
    </section>
    <section class="login-panel">
      <form class="login-form" @submit.prevent="handleLogin">
        <span class="eyebrow">WELCOME BACK</span>
        <h2>로그인</h2>
        <p class="muted">업무 공간으로 돌아오신 것을 환영합니다.</p>
        <div v-if="error" class="inline-error" role="alert">{{ error }}</div>
        <label for="login-id">아이디</label>
        <input id="login-id" v-model="credentials.id" autocomplete="username" required placeholder="아이디를 입력하세요" />
        <label for="login-password">비밀번호</label>
        <input id="login-password" v-model="credentials.password" type="password" autocomplete="current-password" required placeholder="비밀번호를 입력하세요" />
        <button class="button button--primary button--wide" type="submit" :disabled="loading">
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
        <div class="demo-account"><strong>테스트 계정</strong><span>admin / 1234</span></div>
      </form>
    </section>
  </main>
</template>
