import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useToastsStore } from './toasts'
import supabase from '@/services/supabase'

export type Category = 'financial' | 'minutes' | 'contracts' | 'general'

export interface DocumentForm {
  name: string
  details: string
  url: string
  is_draft: boolean
  is_public: boolean
  tags: string[]
  category: Category
}

export interface DocumentFormErrors {
  [key: string]: string
}

export interface Document {
  category: string | null
  created_at: string
  details: string | null
  id: number
  is_draft: boolean
  is_public: boolean
  last_accessed_at?: string | null
  name: string
  tags: string[]
  updated_at?: string
  url: string
  user_id?: string
}

export const useDocumentStore = defineStore(
  'documents',
  () => {
    const errors = ref<DocumentFormErrors>({})
    const error = ref<any>()
    const loading = ref(false)
    const toasts = useToastsStore()
    const documents = ref<Document[]>([])

    const getDocuments = async () => {
      loading.value = true
      error.value = null
      try {
        const { data, error } = await supabase.from('documents').select()
        if (error) {
          handleDocumentError(error)
        }

        if (data) {
          documents.value = data
        }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loading.value = false
      }
    }

    const uploadFile = async (file: File | undefined) => {
      if (!file) {
        errors.value.document = 'No file selected'
        return null
      }

      try {
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(`public/${file.name}`, file, {
            cacheControl: '3600',
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
        const { data } = supabase.storage.from('documents').getPublicUrl(fileUrl)
        return data.publicUrl
      } catch (error) {
        handleDocumentError(error)
      }
    }

    const createDocument = async (form: DocumentForm) => {
      try {
        const { data, error } = await supabase.from('documents').insert(form).select()

        if (error) {
          handleDocumentError(error)
        }

        if (data) {
          return data
        }
      } catch (error) {
        handleDocumentError(error)
      }
    }

    const getDocument = async (id: number) => {
      loading.value = true
      error.value = null

      try {
        const { error, data } = await supabase.from('documents').select().eq('id', id)

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
        loading.value = false
      }
    }

    const deleteDocument = async (id: number) => {
      loading.value = true
      error.value = null
      try {
        // get document
        const doc = await getDocument(id)

        if (!doc) {
          return false
        }

        const success = await deleteFile(doc.url)

        if (!success) {
          handleDocumentError({ error: ' Error deleting file from bucket' })
        }

        const { status } = await supabase.from('documents').delete().eq('id', doc.id)

        if (status !== 204) {
          handleDocumentError(error)
          return false
        }

        documents.value = documents.value.filter((d) => d.id !== id)

        return true
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loading.value = false
      }
    }

    const deleteFile = async (path: string) => {
      // delete file, return boolean
      try {
        console.log(path)
        const { data, error } = await supabase.storage.from('documents').remove([path])

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
      if (typeof error === 'object' && error.message) {
        errors.value.email = error.message
        toasts.addError('Registration error', error.message)
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
      loading,
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
