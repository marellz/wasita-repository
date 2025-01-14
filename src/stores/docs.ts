import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useToastsStore } from './toasts'
import supabase from '@/services/supabase'

export interface DocumentForm {
  name: string
  details: string
  url: string
  is_draft: boolean
}

export interface DocumentFormErrors {
  [key: string]: string
}

export interface Document {
  created_at: string
  id: number
  is_draft: boolean
  name: string
  url: string
  user_id: string
  details?: string | null
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
          console.log(data)
        }
      } catch (error) {
        handleDocumentError(error)
      } finally {
        loading.value = false
      }
    }

    const uploadFile = async (file: File | undefined) => {
      console.log({ file: file })
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
      getDocuments,
      uploadFile,
      loading,
      error,
      errors,
      resetErrors,
      createDocument,
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
