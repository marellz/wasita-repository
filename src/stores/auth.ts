import type {
  AuthResponse,
  User as AuthUser,
  UserAttributes,
} from "@supabase/supabase-js"
import { defineStore, acceptHMRUpdate } from "pinia"
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import supabase from "@/services/supabase"
import { useToastsStore } from "@/stores/toasts"
import api from "@/plugins/api"
import { useUserStore, type User } from "@/stores/users"

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
  "auth",
  () => {
    const authUser = ref<AuthUser | null>(null)
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isAuthenticated = computed(() => user.value !== null)
    const loading = ref(false)
    const router = useRouter()
    const userStore = useUserStore()

    const errors = ref<{
      email?: string | undefined
      password?: string | undefined
    }>({})

    const toasts = useToastsStore()

    const login = async (form: LoginForm) => {
      loading.value = true
      errors.value = {}
      try {
        const { data, error }: AuthResponse =
          await supabase.auth.signInWithPassword(form)

        if (error) {
          handleAuthError(error)
        }

        if (data && data.session) {
          handleSessionCreation(data.session?.access_token, data.user)
        }
      } catch (error) {
        handleAuthError(error)
      } finally {
        loading.value = false
      }
    }

    const register = async (user: NewUser) => {
      loading.value = true
      errors.value = {}
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
          // todo: fix user id issue
          if (_user) {
            await userStore.update(_user.id, {
              id: _user.id,
              name: user.name,
              email: user.email,
            })
          }
          return true
        }

        return false
      } catch (error) {
        handleAuthError(error)
      } finally {
        loading.value = false
      }
    }

    const updateAuthUser = async (payload: UserAttributes) => {
      await supabase.auth.updateUser(payload)
    }

    const updateUser = async (payload: User) => {
      user.value = payload
    }

    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        return
      }
      authUser.value = data.user
      const _u = await userStore.getUser(data.user.id)
      if (_u) {
        user.value = _u
      }
    }

    const logout = async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
        handleAuthError(error)
      }

      token.value = null
      user.value = null

      router.push("/")
    }

    const resetPassword = async (email: string) => {
      console.log(email)
    }

    const handleAuthError = (error: any) => {
      if (typeof error === "object" && error.message) {
        errors.value.email = error.message
        toasts.addError("Registration error", error.message)
      }
      console.log(error)
    }

    const handleSessionCreation = async (
      _token: string,
      _user: AuthUser | null,
    ) => {
      token.value = _token

      if (!_user) {
        return
      }

      authUser.value = _user
      const _u = await userStore.getUser(_user.id)

      if (_u) {
        user.value = _u
      } else {
        user.value = {
          email: _user.email!,
          id: _user.id,
        }
      }

      router.push("/")
    }

    watch(token, async (v) => {
      api.defaults.headers.common["Authorization"] = v ? `Bearer ${v}` : ""
    })

    return {
      authUser,
      user,
      getUser,
      updateUser,
      isAuthenticated,
      token,
      errors,
      loading,
      login,
      register,
      logout,
      resetPassword,

      //
      updateAuthUser,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
