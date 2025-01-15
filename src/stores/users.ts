import supabase from "@/services/supabase"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useToastsStore } from "./toasts"
import { ref } from "vue"

export interface NewUser {
  id: string
  name?: string | null
  email: string
  phone?: string | null
  avatar?: string | null
}

export interface User extends NewUser {
  created_at?: string
}

export const useUserStore = defineStore(
  "users",
  () => {
    const toasts = useToastsStore()
    const loading = ref(false)
    const error = ref<any>()

    const create = async (user: User) => {
      try {
        const { data, error } = await supabase.from("users").insert(user)
        if (error) {
          handleUserError(error)
        }

        if (data) {
          //nice!
          toasts.addSuccess("User created!")
        }
      } catch (error) {
        handleUserError(error)
      }
    }
    const update = async () => {}

    const getUsers = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase.from("users").select()
        if (error) {
          handleUserError(error)
          return null
        }

        if (data) {
          //nice!
          return data
        }

        return null
      } catch (error) {
        handleUserError(error)
      } finally {
        loading.value = false
      }
    }
    const getUser = async (id: string) => {
      loading.value = true
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("id", id)
          .limit(1)
          .maybeSingle()

        if (error) {
          handleUserError(error)
          return null
        }

        if (data) {
          //nice!
          return data
        }

        return null
      } catch (error) {
        handleUserError(error)
      } finally {
        loading.value = false
      }
    }

    const handleUserError = (err: any) => {
      if (typeof err === "object" && err.message) {
        error.value = err.message
        toasts.addError("User error", err.message)
      }
      console.log(err)
    }

    return {
      create,
      update,
      getUsers,
      getUser,

      //
      loading,
      error,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
