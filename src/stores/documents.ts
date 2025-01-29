import { ref } from "vue"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useToastsStore } from "./toasts"
import generateSlug from "@/utils/generateSlug"
import supabase from "@/services/supabase"
import { useAuthStore } from "./auth"

// export type Category = "financial" | "minutes" | "contracts" | "general"

export interface DocumentForm {
  id?: string
  name: string
  details: string | null
  url: string
  is_draft: boolean
  is_public: boolean
  tags: string[]
  category: string | null
}

export interface DocumentFormErrors {
  [key: string]: string
}

export interface FileDetails {
  file_size?: number
  file_type?: string
  original_name?: string
  url?: string
}

export interface Document {
  category: string | null
  created_at: string
  details: string | null
  file_size: number | null
  file_type: string | null
  id: string
  is_draft: boolean
  is_public: boolean
  last_accessed_at: string | null
  name: string
  tags: string[]
  updated_at: string
  url: string
  user_id: string
  original_name: string | null
  comments: {
    count: number
  }[]
  user?: {
    id: string
    name?: string | null
    email: string
    avatar_url?: string | null
  } | null
}

export type GetDocumentsCriteria =
  | "public"
  | "private"
  | "mine"
  | "drafts"
  | "sent"

export const useDocumentStore = defineStore(
  "documents",
  () => {
    const errors = ref<DocumentFormErrors>({})
    const error = ref<any>()
    const loadingAll = ref(false)
    const loadingSingle = ref(false)
    const uploading = ref(false)
    const toasts = useToastsStore()
    const documents = ref<Document[]>([])
    const auth = useAuthStore()

    const getDocuments = async (criteria: GetDocumentsCriteria = "public") => {
      loadingAll.value = true
      error.value = null
      documents.value = []

      const query = supabase.from("documents").select(
        `*,
          user: users(id, email, name, avatar_url),
          comments(count)`,
      )

      switch (criteria) {
        // belong to me, period
        case "mine":
          if (!auth.user) {
            return null
          }
          query.eq("user_id", auth.user.id)

          break

        // mine, not public, no collaborators
        case "private":
          if (!auth.user) {
            return null
          }

          query
            .eq("user_id", auth.user.id)
            .eq("is_public", false)
            .filter("collaborators", "eq", "{}")

        // belong to me but are in draft
        case "drafts":
          if (!auth.user) {
            return null
          }

          query.eq("user_id", auth.user.id).eq("is_draft", true)
          break

        // for which i am a collaborator
        case "sent":
          if (!auth.user) {
            return null
          }

          query
            .eq("is_public", false)
            .filter("collaborators", "cs", `{${auth.user.id}}`)
          break

        // docs for everyone!
        case "public":
          query.eq("is_draft", false).eq("is_public", true)
          break

        default:
          break
      }

      try {
        //todo add extra filtering
        const { data, error } = await query.order("created_at", {
          ascending: false,
        })
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

      uploading.value = true

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
      } finally {
        uploading.value = false
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

    const openDocument = async (path: string) => {
      // loadingDocument.value = id
      const fullPath = await getDocumentPublicUrl(path)

      if (fullPath) {
        // loadingDocument.value = null
        window.open(fullPath)
      }
    }

    const createDocument = async (file: File | null, form: DocumentForm) => {
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

        const { data, error } = await supabase.from("documents").insert(payload)
          .select(`*,
          user: users(id, email, name, avatar_url),
          comments(count)`)

        if (error) {
          handleDocumentError(error)
        }

        if (data) {
          toasts.addSuccess(
            "Document created!",
            "Your document has been successfully uploaded and will be displayed on the docs list if it is public",
          )
          return data
        }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingSingle.value = false
      }
    }

    const getDocument = async (id: string) => {
      loadingSingle.value = true
      error.value = null

      try {
        const { error, data } = await supabase
          .from("documents")
          .select(
            `*,
          user: users(id, email, name, avatar_url),
          comments(count)`,
          )
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

    const updateDocument = async (
      id: string,
      data: DocumentForm,
      file: File | null = null,
    ) => {
      loadingSingle.value = true
      error.value = null
      try {
        // get document
        const doc = await getDocument(id)

        if (!doc) {
          return false
        }

        const fileDetails: FileDetails = {}

        if (file) {
          const url = await updateFile(doc.url, file)
          fileDetails.file_size = file.size
          fileDetails.file_type = file.type
          fileDetails.original_name = file.name

          if (url) {
            fileDetails.url = url
          }
        }

        const payload = {
          ...data,
          ...fileDetails,
          updated_at: new Date().toISOString(),
        }

        const { status } = await supabase
          .from("documents")
          .update(payload)
          .eq("id", doc.id)

        if (status !== 204) {
          handleDocumentError("Document not succcessfully updated")
          return false
        }

        toasts.addSuccess("Update successful", "Document updated successfully")

        return { ...doc, ...payload }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingSingle.value = false
      }
    }

    const deleteDocument = async (id: string) => {
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

    const updateFile = async (url: string, file: File) => {
      try {
        const { data, error } = await supabase.storage
          .from("documents")
          .update(url, file, {
            cacheControl: "3600",
            upsert: true,
          })

        if (error) {
          handleDocumentError(error)
          return null
        }

        if (data) {
          return data.path
        }

        return null
      } catch (error) {
        handleDocumentError(error)
      }
    }

    const deleteFile = async (path: string) => {
      // delete file, return boolean
      try {
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
      if (typeof error === "object" || error.message) {
        errors.value.email = error.message
        toasts.addError("Document error", error.message)
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
      updateDocument,
      openDocument,
      updateFile,
      uploadFile,
      deleteFile,
      uploading,
      loadingAll,
      loadingSingle,
      error,
      errors,
      resetErrors,
      getDocumentPublicUrl,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentStore, import.meta.hot))
}
