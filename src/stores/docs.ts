import { ref } from "vue"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useToastsStore } from "./toasts"
import generateSlug from "@/utils/generateSlug"
import supabase from "@/services/supabase"
import { useAuthStore } from "./auth"

export type Category = "financial" | "minutes" | "contracts" | "general"

export interface DocumentForm {
  name: string
  details: string
  url: string
  is_draft: boolean
  is_public: boolean
  tags: string[]
  category: Category
}

export interface FileDetails {
  file_size: number
  file_type: string
}

export interface DocumentFormErrors {
  [key: string]: string
}

export interface Document {
  category: string | null
  created_at: string
  details: string | null
  file_size: number | null
  file_type: string | null
  id: number
  is_draft: boolean
  is_public: boolean
  last_accessed_at: string | null
  name: string
  tags: string[]
  updated_at: string
  url: string
  user_id: string
  original_name: string | null
}

export type GetDocumentsCriteria = "public" | "mine" | "drafts" | "sent"

export const useDocumentStore = defineStore(
  "documents",
  () => {
    const errors = ref<DocumentFormErrors>({})
    const error = ref<any>()
    const loadingAll = ref(false)
    const loadingSingle = ref(false)
    const toasts = useToastsStore()
    const documents = ref<Document[]>([])
    const auth = useAuthStore()

    const getDocuments = async (criteria: GetDocumentsCriteria = "public") => {
      loadingAll.value = true
      error.value = null
      documents.value = []

      const query = supabase.from("documents").select(`*, remarks(count)`)

      switch (criteria) {
        case "mine":
          if (!auth.user) {
            return null
          }
          query.eq("user_id", auth.user.id)

          break
        case "drafts":
          if (auth.user) {
            query.eq("user_id", auth.user.id).eq("is_draft", true)
          }
          break
        case "sent":
          if (auth.user) {
            query.eq("is_public", false)
          }
          break
        case "public":
          query.eq("is_draft", false)
          break

        default:
          break
      }

      console.log(query)

      try {
        const { data, error } = await query
        if (error) {
          handleDocumentError(error)
        }

        if (data) {
          documents.value = data
        }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingAll.value = false
      }
    }

    const uploadFile = async (file: File | undefined) => {
      if (!file) {
        errors.value.document = "No file selected"
        return null
      }

      try {
        const name = generateSlug(file.name)
        const { data, error } = await supabase.storage
          .from("documents")
          .upload(`public/${name}`, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (error) {
          return null
        }

        if (data) {
          return data.path
        }
      } catch (error) {
        handleDocumentError(error)
      }
    }

    const getDocumentPublicUrl = async (fileUrl: string) => {
      try {
        const { data } = supabase.storage
          .from("documents")
          .getPublicUrl(fileUrl)
        return data.publicUrl
      } catch (error) {
        handleDocumentError(error)
      }
    }

    const createDocument = async (
      file: File | undefined,
      form: DocumentForm,
    ) => {
      loadingSingle.value = true
      try {
        // verify file
        if (!file) {
          errors.value.document = "Document not added."
          return false
        }

        // upload file first

        const path = await uploadFile(file)

        if (!path) {
          return false
        }

        // create document
        const payload = {
          ...form,
          url: path,
          file_type: file.type,
          file_size: file.size,
          original_name: file.name,
        }

        const { data, error } = await supabase
          .from("documents")
          .insert(payload)
          .select()

        if (error) {
          handleDocumentError(error)
        }

        if (data) {
          return data
        }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingSingle.value = false
      }
    }

    const getDocument = async (id: number) => {
      loadingSingle.value = true
      error.value = null

      try {
        const { error, data } = await supabase
          .from("documents")
          .select()
          .eq("id", id)

        if (error) {
          handleDocumentError(error)
        }

        if (data && data.length) {
          return data[0]
        }

        return null
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingSingle.value = false
      }
    }

    const deleteDocument = async (id: number) => {
      loadingSingle.value = true
      error.value = null
      try {
        // get document
        const doc = await getDocument(id)

        if (!doc) {
          return false
        }

        const success = await deleteFile(doc.url)

        if (!success) {
          handleDocumentError({ error: " Error deleting file from bucket" })
        }

        const { status } = await supabase
          .from("documents")
          .delete()
          .eq("id", doc.id)

        if (status !== 204) {
          handleDocumentError("Document not succcessfully deleted")
          return false
        }

        documents.value = documents.value.filter((d) => d.id !== id)

        return true
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingSingle.value = false
      }
    }

    const deleteFile = async (path: string) => {
      // delete file, return boolean
      try {
        console.log(path)
        const { data, error } = await supabase.storage
          .from("documents")
          .remove([path])

        if (error) {
          handleDocumentError(error)
        }

        if (data) {
          return true
        }

        return false
      } catch (error) {
        handleDocumentError(error)
      }
    }

    const handleDocumentError = (error: any) => {
      if (typeof error === "object" && error.message) {
        errors.value.email = error.message
        toasts.addError("Registration error", error.message)
      }
      console.log(error)
    }

    const resetErrors = () => {
      errors.value = {}
    }

    return {
      documents,
      getDocument,
      getDocuments,
      deleteDocument,
      createDocument,
      uploadFile,
      deleteFile,
      loadingAll,
      loadingSingle,
      error,
      errors,
      resetErrors,
      getDocumentPublicUrl,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentStore, import.meta.hot))
}
