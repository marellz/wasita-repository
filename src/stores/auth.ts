import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
  avatar?: string
}

interface LoginForm {
  email: string
  password: string
}

interface NewUser {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  const login = async (form: LoginForm) => {
    console.log(form)
  }

  const register = async (user: NewUser) => {
    console.log(user)
  }

  const logout = () => {
    user.value = null
  }

  const resetPassword = async (email: string) => {
    console.log(email)
  }

  return { user, isAuthenticated, login, register, logout, resetPassword }
})
