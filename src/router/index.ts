import { createRouter, createWebHistory } from 'vue-router'
import type { Pinia } from 'pinia'
import LoginView from '../views/LoginView.vue'
import TaskView from '../views/TaskView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '../stores/auth'

export function createAppRouter(pinia: Pinia) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/tasks' },
      { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
      { path: '/tasks', name: 'tasks', component: TaskView, meta: { requiresAuth: true } },
      { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
      { path: '/:pathMatch(.*)*', redirect: '/tasks' },
    ],
  })

  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)
    if (to.meta.requiresAuth && !authStore.isLoggedIn) return { name: 'login' }
    if (to.meta.guestOnly && authStore.isLoggedIn) return { name: 'tasks' }
    return true
  })
  return router
}
