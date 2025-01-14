import type { AuthResponse, User, UserAttributes } from '@supabase/supabase-js'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import supabase from '@/services/supabase'
import { useToastsStore } from '@/stores/toasts'
import api from '@/plugins/api'

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

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isAuthenticated = computed(() => user.value !== null)
    const loading = ref(false)
    const router = useRouter()

    const errors = ref<{
      email?: string | undefined
      password?: string | undefined
    }>({})

    const toasts = useToastsStore()

    const login = async (form: LoginForm) => {
      try {
        const { data, error }: AuthResponse = await supabase.auth.signInWithPassword(form)

        if (error) {
          handleAuthError(error)
        }

        if (data && data.session) {
          handleSessionCreation(data.session?.access_token, data.user)
        }
      } catch (error) {
        handleAuthError(error)
      }
    }

    const register = async (user: NewUser) => {
      loading.value = true
      try {
        const {
          data: { session, user: _user },
          error,
        }: AuthResponse = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
        })

        if (error) {
          handleAuthError(error)
        }

        if (session) {
          handleSessionCreation(session.access_token, _user)
          updateUser({
            data: {
              name: user.name,
            },
          })
          return true
        }

        return false
      } catch (error) {
        handleAuthError(error)
      } finally {
        loading.value = false
      }
    }

    const updateUser = async (payload: UserAttributes) => {
      await supabase.auth.updateUser(payload)
    }

    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      user.value = data.user
    }

    const logout = async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
        handleAuthError(error)
      }

      token.value = null
      user.value = null

      router.push('/')
    }

    const resetPassword = async (email: string) => {
      console.log(email)
    }

    const handleAuthError = (error: any) => {
      if (typeof error === 'object' && error.message) {
        errors.value.email = error.message
        toasts.addError('Registration error', error.message)
      }
      console.log(error)
    }

    const handleSessionCreation = async (_token: string, _user: User | null) => {
      token.value = _token

      if (_user) {
        user.value = _user

        router.push('/')
      }
    }

    watch(token, async (v) => {
      api.defaults.headers.common['Authorization'] = v ? `Bearer ${v}` : ''
    })

    return {
      user,
      getUser,
      isAuthenticated,
      token,
      errors,
      loading,
      login,
      register,
      logout,
      resetPassword,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
