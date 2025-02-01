import { defineStore, acceptHMRUpdate } from "pinia"
import { ref } from "vue"
import { useToastsStore } from "./toasts"
import supabase from "@/services/supabase"
export interface Category {
  id: string
  name: string
  slug: string
  details?: string | null
}

export interface CategoryForm {
  name: string
  details?: string | null
}

export const useCategoryStore = defineStore(
  "categories",
  () => {
    const categories = ref<Category[]>([])
    const loading = ref(false)
    const error = ref<any>(null)
    const toasts = useToastsStore()

    const getCategories = async () => {
      loading.value = true
      error.value = null
      try {
        const { data, error } = await supabase.from("categories").select()

        if (error) {
          handleCategoryError(error.message)
        }

        if (data) {
          categories.value = data
        }
      } catch (err: any) {
        handleCategoryError(err)
      } finally {
        loading.value = false
      }
    }

    const createCategory = async (cat: CategoryForm) => {
      error.value = null
      loading.value = true
      try {
        const slug = cat.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
        const payload = { ...cat, slug }
        const { data, error } = await supabase
          .from("categories")
          .insert(payload)
          .select()

        if (error) {
          handleCategoryError(error.message)
        }

        if (data) {
          categories.value = [...categories.value, ...data]
          toasts.addInfo("Success", "Added category successfully!")

          return true
        }

        return false
      } catch (err: any) {
        handleCategoryError(err)
      } finally {
        loading.value = false
      }
    }

    const updateCategory = async (
      id: string,
      { name, details }: CategoryForm,
    ) => {
      error.value = null
      loading.value = true
      try {
        const { status, error } = await supabase
          .from("categories")
          .update({ name, details })
          .eq("id", id)

        if (error) {
          handleCategoryError(error.message)
        }

        if (status === 204) {
          const idx = categories.value.findIndex((c) => c.id === id)
          if (idx !== -1) {
            categories.value[idx] = { ...categories.value[idx], name, details }
          }

          toasts.addInfo("Success", "Updated category successfully!")

          return true
        }

        return false
      } catch (err: any) {
        handleCategoryError(err)
      } finally {
        loading.value = false
      }
    }

    const findCategory = async (slug: string) => {
      error.value = null
      loading.value = true
      try {
        const { data, error } = await supabase
          .from("tags")
          .select()
          .eq("slug", slug)

        if (error) {
          handleCategoryError(error.message)
        }

        if (data) {
          return data
        }
      } catch (err: any) {
        handleCategoryError(err)
      } finally {
        loading.value = false
      }
    }

    const handleCategoryError = (error: string) => {
      console.error("Error")
      toasts.addError("Toasts error", error)
    }

    return {
      categories,
      loading,
      error,

      //
      findCategory,
      getCategories,
      createCategory,
      updateCategory,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
}
