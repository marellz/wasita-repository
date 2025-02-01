import supabase from "@/services/supabase"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useToastsStore } from "@/stores/toasts"
import { useAuthStore } from "@/stores/auth"
import generateSlug from "@/utils/generateSlug"
import { ref } from "vue"

export interface NewUser {
  id: string
  name?: string | null
  email: string
  phone?: string | null
  avatar?: string | null
  avatar_url?: string | null
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
    const auth = useAuthStore()
    const uploading = ref(false)

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
    const update = async (id: string, payload: NewUser) => {
      error.value = null
      loading.value = true
      try {
        const { status } = await supabase
          .from("users")
          .update(payload)
          .eq("id", id)
        if (status !== 204) {
          handleUserError("User update unsuccessful")
          return false
        }

        toasts.addSuccess("Update successful", "User updated successfully")

        await refreshUser()

        return true
      } catch (error) {
        handleUserError(error)
      } finally {
        loading.value = false
      }
    }

    const uploadAvatar = async (file: File | undefined) => {
      if (!file) {
        error.value = "No image selected"
        return null
      }

      uploading.value = true

      const user = auth.user

      if (!user) {
        error.value = "No user"
        return
      }

      // if user already has avatar,
      // delete it first
      if (user.avatar) {
        deleteAvatar(user.avatar)
      }

      try {
        const name = generateSlug(file.name, true)
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`public/${name}`, file)

        if (error) {
          return null
        }

        if (data) {
          // update user avatar

          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(data.path)

          await update(user.id, {
            ...user,
            avatar: data.path,
            avatar_url: publicUrl,
          })

          return data.path
        }
      } catch (error) {
        handleUserError(error)
      } finally {
        uploading.value = false
      }
    }

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

    const deleteAvatar = async (avatar: string) => {
      uploading.value = true
      const user = auth.user
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .remove([avatar])

        if (error) {
          handleUserError(error)
        }

        if (data && user) {
          await update(user.id, { ...user, avatar: null, avatar_url: null })
          return true
        }

        return false
      } catch (error) {
        handleUserError(error)
      } finally {
        uploading.value = false
      }
    }

    const handleUserError = (err: any) => {
      if (typeof err === "object" && err.message) {
        error.value = err.message
        toasts.addError("User error", err.message)
      }
      console.error({ userError: err })
    }

    const refreshUser = async () => {
      if (!auth.user) {
        return
      }

      const _updatedUser = await getUser(auth.user?.id)
      if (_updatedUser) {
        auth.updateUser(_updatedUser)
      }
    }

    return {
      create,
      update,
      getUsers,
      getUser,
      uploadAvatar,
      deleteAvatar,
      refreshUser,

      //
      uploading,
      loading,
      error,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
