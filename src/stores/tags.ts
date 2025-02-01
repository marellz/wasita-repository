import { defineStore, acceptHMRUpdate } from "pinia"
import { ref } from "vue"
import { useToastsStore } from "./toasts"
import supabase from "@/services/supabase"
export interface Tag {
  id: string
  name: string
  slug: string
}

export const useTagStore = defineStore(
  "tags",
  () => {
    const tags = ref<Tag[]>([])
    const loading = ref(false)
    const error = ref<any>(null)
    const toasts = useToastsStore()

    const getTags = async () => {
      loading.value = true
      error.value = null
      try {
        const { data, error } = await supabase.from("tags").select()

        if (error) {
          handleTagError(error.message)
        }

        if (data) {
          tags.value = data
        }
      } catch (err: any) {
        handleTagError(err)
      } finally {
        loading.value = false
      }
    }
    const createTag = async ({ name }: { name: string }) => {
      loading.value = true
      error.value = null
      try {
        const slug = name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
        const tag = {
          name,
          slug,
        }

        const { data, error } = await supabase.from("tags").insert(tag).select()

        if (error) {
          handleTagError(error.message)
        }

        if (data) {
          tags.value = [...tags.value, ...data]

          return true
        }

        return false
      } catch (err: any) {
        handleTagError(err.message ?? err)
      } finally {
        loading.value = false
      }
    }

    const findTag = async (slug: string) => {
      loading.value = true
      error.value = null
      try {
        const { data, error } = await supabase
          .from("tags")
          .select()
          .eq("slug", slug)

        if (error) {
          handleTagError(error.message)
        }

        if (data) {
          return data
        }
      } catch (err: any) {
        handleTagError(err)
      } finally {
        loading.value = false
      }
    }

    const handleTagError = (error: string) => {
      console.error("Error")
      toasts.addError("Toasts error", error)
    }

    return {
      tags,
      loading,
      error,

      //
      findTag,
      getTags,
      createTag,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagStore, import.meta.hot))
}
