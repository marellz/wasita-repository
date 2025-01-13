import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
interface User {
  name: string
  email: string
  avatar?: string
}
export const useAuthStore = defineStore('counter', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)
  const logout = () => {
    user.value = null
  }

  return { user, isAuthenticated, logout }
})
