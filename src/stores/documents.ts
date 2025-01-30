import { ref, watch } from "vue"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useToastsStore } from "./toasts"
import generateSlug from "@/utils/generateSlug"
import supabase from "@/services/supabase"
import { useAuthStore } from "./auth"
import { documentFilter } from "@/services/documentFilter"

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

  //todo: add Collaborator types here
}

export interface Collaborator {
  id: string
  name: string | null
  email: string
  phone?: string | null
  avatar_url: string | null
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
  user: {
    id: string
    name?: string | null
    email: string
    avatar_url?: string | null
  } | null
}

export type GetDocumentsCriteria =
  | "mine"
  | "private"
  | "drafts"
  | "sharedWithMe"

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

    const filters = documentFilter()

    // pagination
    // todo: check stash in 'pagination' branch
    const perPage = ref(10)
    const pageNumber = ref(1)
    const currentRange = ref({ from: 0, to: perPage.value - 1 })
    const limitReached = ref(true)
    const totalDocuments = ref<number>()

    const loadingNextPage = ref(false)

    const nextPage = async () => {
      if (limitReached.value) {
        return
      }

      loadingNextPage.value = true
      const s = currentRange.value.to + 1
      pageNumber.value++
      currentRange.value = {
        from: s,
        to: s + (perPage.value - 1),
      }

      await getDocuments()
    }

    watch(documents, (n) => {
      if (n.length === totalDocuments.value) {
        limitReached.value = true
      }
    })

    const getDocumentCount = async () => {
      const { count, error } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true)
        .eq("is_draft", false)

      if (error) {
        handleDocumentError("Trouble getting document count")
      }

      if (count) {
        totalDocuments.value = count

        if (count > perPage.value) {
          limitReached.value = false
        }
      }
    }

    const getDocuments = async (
      range: { from: number; to: number } = currentRange.value,
    ) => {
      loadingAll.value = true
      // documents.value = []

      if (pageNumber.value === 1) {
        getDocumentCount()
      }

      resetErrors()

      try {
        //todo add extra filtering
        const { data, error } = await filters.getPublicDocuments(
          {
            created_at: false,
          },
          range,
        )
        if (error) {
          handleDocumentError(error)
        }

        if (data) {
          documents.value = [...documents.value, ...data]
        }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingAll.value = false
        loadingNextPage.value = false
      }
    }

    const getUserDocuments = async (criteria: GetDocumentsCriteria) => {
      loadingAll.value = true
      documents.value = []

      resetErrors()

      let response

      try {
        switch (criteria) {
          case "mine":
            response = await filters.getMyDocuments()
            break
          case "private":
            response = await filters.getMyPrivateDocuments()
            break
          case "drafts":
            response = await filters.getMyDraftDocuments()
            break
          case "sharedWithMe":
            response = await filters.getDocumentsSharedWithMe()
            break
          default:
            response = await filters.getMyDocuments()
            break
        }

        if (response.error) {
          handleDocumentError(response.error)
          return null
        }

        if (response.data) {
          return response.data
        }

        return null
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

    const createDocument = async (
      file: File | null,
      form: DocumentForm,
      collaborators: string[] = [],
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
          toasts.addSuccess(
            "Document created!",
            "Your document has been successfully uploaded and will be displayed on the docs list if it is public",
          )

          if (collaborators.length) {
            insertCollaborators(data[0].id, collaborators)
          }

          return data
        }

        return null
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingSingle.value = false
      }
    }

    const insertCollaborators = async (
      documentId: string,
      collaborators: string[] = [],
    ) => {
      // check if current user is present,
      const user = auth.user
      if (user && collaborators.includes(user.id)) {
        // delete if so
        collaborators.splice(
          collaborators.findIndex((c) => c === user.id),
          1,
        )
      }

      const payload = Array.from(new Set(collaborators)).map((user_id) => ({
        document_id: documentId,
        user_id,
      }))

      // add new
      try {
        const { error } = await supabase
          .from("document_collaborators")
          .insert(payload)

        if (error) {
          handleDocumentError(error)
        }
      } catch (error) {
        handleDocumentError(error)
      }
    }

    const getDocument = async (id: string) => {
      loadingSingle.value = true

      resetErrors()

      try {
        const { error, data } = await supabase
          .from("documents")
          .select(
            `*,
          user: users(id, email, name, avatar_url),
          collaborators: document_collaborators (
            ...users (id, name, email, phone, avatar_url)
          ),
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
      collaborators: string[] = [],
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

        await updateCollaborators(id, collaborators)

        return { ...doc, ...payload }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loadingSingle.value = false
      }
    }

    const updateCollaborators = async (
      documentId: string,
      collaborators: string[] = [],
    ) => {
      // current list is the true list

      // remove all existsing, add current
      const { status } = await supabase
        .from("document_collaborators")
        .delete()
        .eq("document_id", documentId)

      if (status !== 204) {
        handleDocumentError("Error removing collaborators ( 1 )")
      }

      return await insertCollaborators(documentId, collaborators)
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
            cacheControl: "3600", // todo: make sure you know wth this means.
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
      //
      documents,
      getDocument,
      getUserDocuments,
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

      //
      pageNumber,
      currentRange,
      nextPage,
      limitReached,
      loadingNextPage,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentStore, import.meta.hot))
}
