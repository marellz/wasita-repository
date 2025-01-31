import type { Filters } from "@/components/documents/filters.vue"
import supabase from "@/services/supabase"
import { useAuthStore } from "@/stores/auth"
import { computed } from "vue"

type filterKeys = "created_at"

type Order = Record<filterKeys, boolean>

// type Filters = Record<filterKeys, string | number>[]

export const documentService = () => {
  const auth = useAuthStore()
  const user = computed(() => auth.user?.id ?? null)

  const getPublicDocuments = async (
    order: Order = { created_at: false },
    range: { from: number; to: number } = { from: 0, to: 9 },
    filters: Filters = { query: "", tags: [], categories: [] },
  ) => {
    /**
     * public
     *
     * documents.is_public === true
     * documents.is_draft === false
     *
     * includes: documents, comments, collaborators, user
     *
     */

    const query = supabase
      .from("documents")
      .select(
        `*,
        user: users(id, name, email, avatar_url, phone),
        collaborators: document_collaborators (
            ...users (id, name, email, phone, avatar_url)
          ),
        comments(count)`,
      )
      .eq("is_public", true)
      .range(range.from, range.to)

    const _key = Object.keys(order)[0]
    const _value = Object.values(order)[0]

    // filters

    if (filters.query) {
      query.ilike("name", `%${filters.query}%`)
      // todo: include for details and original_name
    }

    if (filters.categories.length) {
      query.in("category", filters.categories)
    }

    if (filters.tags.length) {
      query.contains("tags", filters.tags)
    }

    console.log(filters)

    return await query.order(_key, {
      ascending: _value,
    })
  }

  const getMyDocuments = async () => {
    /**
     * mine
     *
     * documents.user_id === 'me'
     *
     * includes: documents, user
     */

    if (!user.value) {
      throw new Error("No user found")
    }

    return await supabase
      .from("documents")
      .select(
        `*,
        user: users(id, name, email, avatar_url, phone)
        `,
      )
      .eq("user_id", user.value)
  }

  const getMyDraftDocuments = async () => {
    /**
     * drafts
     *
     * documnets.user_id === 'me'
     * documents.is_draft === true
     *
     *
     * includes: document, user
     */

    if (!user.value) {
      throw new Error("No user found")
    }

    return await supabase
      .from("documents")
      .select(
        `*,
        user: users(id, name, email, avatar_url, phone)
        `,
      )
      .eq("user_id", user.value)
      .eq("is_draft", true)
  }

  const getMyPrivateDocuments = async () => {
    /**
     * private
     *
     * documents.user_id === 'me'
     * document.collaborators === null
     *
     * includes: document, user
     */

    if (!user.value) {
      throw new Error("No user found")
    }

    return await supabase
      .from("documents")
      .select(
        `*,
        user: users(id, name, email, avatar_url, phone),
        collaborators: document_collaborators()
        `,
      )
      .eq("user_id", user.value)
      .eq("is_public", false)
      .is("collaborators.document_id", null)
  }

  const getDocumentsSharedWithMe = async () => {
    /**
     * sharedWithMe
     *
     * documents.collaborators.user_id === me
     *
     * includes: document, user
     */

    if (!user.value) {
      throw new Error("No user found")
    }

    return await supabase
      .from("documents")
      .select(
        `*,
          user: users(id, name, email, avatar_url, phone),
          collaborators: document_collaborators!inner(
            user_id
          )`,
      )
      .eq("collaborators.user_id", user.value)
  }

  return {
    getPublicDocuments,
    getMyDocuments,
    getMyDraftDocuments,
    getMyPrivateDocuments,
    getDocumentsSharedWithMe,
  }
}
