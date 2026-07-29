import { defineStore } from 'pinia'
import type { User } from '../types/auth'

const AUTH_KEY = 'pinia-task-manager-auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

function loadUser(): User | null {
  try {
    const saved = localStorage.getItem(AUTH_KEY)
    return saved ? (JSON.parse(saved) as User) : null
  } catch {
    localStorage.removeItem(AUTH_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ user: null, loading: false, error: null }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    userName: (state) => state.user?.name ?? '',
  },
  actions: {
    async login(id: string, password: string): Promise<boolean> {
      this.loading = true
      this.error = null
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        if (id !== 'admin' || password !== '1234') {
          throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
        }
        this.user = { id, name: '관리자' }
        localStorage.setItem(AUTH_KEY, JSON.stringify(this.user))
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.'
        return false
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.error = null
      localStorage.removeItem(AUTH_KEY)
    },
    restoreSession() {
      this.user = loadUser()
    },
  },
})
