import { defineStore, acceptHMRUpdate } from "pinia"
import { useAuthStore } from "./auth"
import { ref } from "vue"
import { useToastsStore } from "./toasts"
import supabase from "@/services/supabase"

export interface Comment {
  content: string
  created_at: string
  document_id: string
  id: number
  is_flagged: boolean
  user_id: string
  user: {
    id: string
    name?: string | null
    email: string
    avatar_url?: string | null
  }
}

export const useCommentStore = defineStore(
  "comments",
  () => {
    const auth = useAuthStore()
    const loading = ref(false)
    const error = ref<any>()
    const toasts = useToastsStore()

    const create = async (document_id: string, content: string) => {
      loading.value = true
      if (!auth.user) {
        return null
      }

      const form = {
        document_id,
        content,
      }

      try {
        const { data, error } = await supabase.from("comments").insert(form)
          .select(`*,
            user: users(id, email, name, avatar_url)`)

        if (error) {
          handleCommentsError(error)
          return null
        }

        if (data && data.length) {
          return data[0]
        }

        return null
      } catch (error) {
        handleCommentsError(error)
      } finally {
        loading.value = false
      }
    }

    const destroy = async (id: number) => {
      try {
        const { status } = await supabase.from("comments").delete().eq("id", id)

        if (status !== 204) {
          handleCommentsError("Comment not successfully deleted")
          return false
        }

        return true
      } catch (error) {
        handleCommentsError(error)
      }
    }

    const getComments = async (document_id: string) => {
      loading.value = true
      error.value = null
      try {
        const { data, error } = await supabase
          .from("comments")
          .select(
            `*,
          user: users(id, email, name, avatar_url)`,
          )
          .eq("document_id", document_id)

        if (error) {
          handleCommentsError(error)
        }

        if (data) {
          return data
        }

        return []
      } catch (error) {
        handleCommentsError(error)
      } finally {
        loading.value = false
      }
    }

    const handleCommentsError = (err: any) => {
      if (typeof err === "object" && err.message) {
        error.value = err.message
        toasts.addError("Registration error", err.message)
      }
      console.log(error)
    }

    const resetError = () => {
      error.value = null
    }

    return {
      create,
      getComments,
      loading,
      error,
      destroy,

      //
      resetError,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommentStore, import.meta.hot))
}
