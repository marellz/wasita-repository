import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
interface User {
  name: string
  email: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>()
  const url = import.meta.env.VITE_TEST_ENV
  const isAuthenticated = computed(() => user.value !== null)
  const logout = () => {
    user.value = null
  }

  return { user, isAuthenticated, logout, url }
})
