import { defineStore, acceptHMRUpdate } from "pinia"
import { useAuthStore } from "./auth"
import { ref } from "vue"
import { useToastsStore } from "./toasts"
import supabase from "@/services/supabase"

export interface Remark {
  content: string
  created_at: string
  document_id: number
  id: number
  is_flagged: boolean
  user_id: string
}

export const useRemarkStore = defineStore(
  "remarks",
  () => {
    const auth = useAuthStore()
    const loading = ref(false)
    const error = ref<any>()
    const toasts = useToastsStore()

    const create = async (doc: number, content: string) => {
      loading.value = true
      if (!auth.user) {
        return null
      }

      const form = {
        document_id: doc,
        content,
      }

      try {
        const { data, error } = await supabase
          .from("remarks")
          .insert(form)
          .select()

        if (error) {
          handleRemarksError(error)
          return null
        }

        if (data && data.length) {
          return data[0]
        }

        return null
      } catch (error) {
        handleRemarksError(error)
      } finally {
        loading.value = false
      }
    }

    const destroy = async (id: number) => {
      try {
        const { status } = await supabase.from("remarks").delete().eq("id", id)

        if (status !== 204) {
          handleRemarksError("Comment not successfully deleted")
          return false
        }

        return true
      } catch (error) {
        handleRemarksError(error)
      }
    }

    const getRemarks = async (doc: number) => {
      try {
        const { data, error } = await supabase
          .from("remarks")
          .select()
          .eq("document_id", doc)

        if (error) {
          handleRemarksError(error)
        }

        if (data) {
          return data
        }

        return []
      } catch (error) {
        handleRemarksError(error)
      }
    }

    const handleRemarksError = (err: any) => {
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
      getRemarks,
      loading,
      error,
      destroy,

      //
      resetError,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRemarkStore, import.meta.hot))
}
