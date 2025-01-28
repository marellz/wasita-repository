import { defineStore, acceptHMRUpdate } from "pinia"
import { v4 as uuidv4 } from "uuid"
import { ref } from "vue"

export type ToastVariant = "error" | "info" | "success"
export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  timeout_id?: any
}

export const useToastsStore = defineStore(
  "toasts",
  () => {
    const toasts = ref<Array<Toast>>([])

    const add = (toast: Omit<Toast, "id">) => {
      const id = uuidv4()
      const duration = toast.duration ?? 2000
      toasts.value.push({ ...toast, id })
      const timeout = setTimeout(() => {
        remove(id)
      }, duration)

      toast.timeout_id = timeout
    }

    const addError = (title: string, description?: string) => {
      add({ title, description, variant: "error" })
    }

    const addSuccess = (title: string, description?: string) => {
      add({ title, description, variant: "success" })
    }

    const addInfo = (title: string, description?: string) => {
      add({ title, description, variant: "info" })
    }

    const remove = (id: string) => {
      const index = toasts.value.findIndex((t) => t.id === id)
      const toast = toasts.value[index]
      if (toast && toast.timeout_id) {
        clearTimeout(toast.timeout_id)
      }
      toasts.value.splice(index, 1)
    }

    return {
      toasts,
      add,
      addError,
      addInfo,
      addSuccess,
      remove,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToastsStore, import.meta.hot))
}
