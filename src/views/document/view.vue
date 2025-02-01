<template>
  <Hero title="View document">
    <template #actions>
      <div v-if="document" class="ml-auto flex space-x-2">
        <base-button @click="openDocument(document.url, document.id)">
          <span>Open</span>
          <ExternalLink :size="20" stroke-width="1.5" />
        </base-button>
        <template v-if="auth.user && auth.user.id === document.user_id">
          <router-link :to="`/edit/${document.id}`">
            <base-button variant="secondary">
              <span>Edit</span>
              <Edit :size="20" stroke-width="1.5" />
            </base-button>
          </router-link>
          <base-button
            variant="danger"
            class="border-red-500"
            @click="deleteDocument(document.id)"
          >
            <span>Delete</span>
            <Trash2 :size="20" stroke-width="1.5" />
          </base-button>
        </template>
      </div>
    </template>
  </Hero>
  <LayoutContainer>
    <LayoutCard>
      <div v-if="loadingDocument" class="flex justify-center py-10">
        <base-loader></base-loader>
      </div>
      <div v-else-if="store.error" class="flex justify-center py-10">
        <base-alert variant="error" title="Error loading document">
          {{ store.error }}
        </base-alert>
      </div>
      <div v-else-if="document === null">
        <div>
          <h1 class="text-3xl font-medium font-secondary">
            Document not found.
          </h1>
          <p class="text-lg text-gray-500 font-light">Non-existent.</p>
        </div>
      </div>
      <template v-else-if="document">
        <div class="space-y-8">
          <div class="space-y-2">
            <router-link
              to="/"
              class="text-sm inline-flex py-1.5 px-0 hover:px-2 focus:px-2 transition-all items-center space-x-2 text-gray-500 hover:text-black hover:bg-slate-100 rounded-lg font-secondary font-medium"
            >
              <ChevronLeft />
              <span>Back to documents</span>
            </router-link>
            <div class="flex space-x-4 items-center">
              <h1 class="text-2xl sm:text-3xl font-medium font-secondary">
                {{ document.name }}
              </h1>
              <span
                class="text-xs sm:text-sm py-0.5 px-2 bg-black text-white rounded-full font-secondary"
              >
                {{ document.category }}
              </span>
            </div>
            <p class="text-xs text-slate-600">
              <template v-if="document.updated_at">
                Updated at {{ parseDate(document.updated_at) }}
              </template>
              <template v-else>
                Created on {{ parseDate(document.created_at) }}
              </template>
            </p>
          </div>
          <div v-if="document.details">
            <p class="text-sm text-gray-500 mb-2">Details</p>
            <p class="font-light">{{ document.details }}</p>
          </div>

          <div v-if="document.tags.length" class="flex space-x-2">
            <span
              v-for="(tag, key) in document.tags"
              :key
              class="text-xs sm:text-sm font-secondary bg-slate-100 px-2 py-0.5 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <hr />

          <div class="flex space-x-2 items-center">
            <user-avatar size="md" :avatar="document.user?.avatar_url" />
            <div>
              <h1 class="font-medium font-secondary">
                {{ document.user?.name }}
              </h1>
              <!-- <p class="text-sm text-gray-600">{{ document.user.email }}</p> -->
              <p class="text-xs text-gray-600">Document author</p>
            </div>
          </div>
          <div>
            <div class="p-4 border rounded-xl space-y-2">
              <p class="font-medium font-secondary">Leave a comment</p>
              <form @submit.prevent="createComment">
                <div class="relative">
                  <form-text
                    placeholder="What are your thoughts on this document?"
                    input-class="border-none bg-slate-100 text-sm pr-20 min-h-16"
                    v-model="comment"
                    required
                    :error="commentStore.error?.comment"
                  ></form-text>
                  <div class="absolute right-4 top-2">
                    <base-button
                      class="!px-4"
                      type="submit"
                      :loading="loadingComments"
                    >
                      <Send :size="20" :stroke-width="1.5" />
                    </base-button>
                  </div>
                </div>
              </form>
            </div>
            <div class="py-5">
              <div v-if="commentStore.loading" class="py-10 text-center">
                <base-loader></base-loader>
              </div>
              <template v-else-if="comments.length">
                <h1 class="font-medium font-secondary">Comments</h1>
                <div class="mt-3 space-y-2">
                  <comment-item
                    v-for="comment in comments"
                    :key="comment.id"
                    :comment
                    @delete-comment="deleteComment"
                  />
                </div>
              </template>
              <p v-else class="text-slate-500 text-center">
                No comments. Be the first to leave one.
              </p>
            </div>
          </div>
        </div>
      </template>
    </LayoutCard>
  </LayoutContainer>
</template>
<script lang="ts" setup>
import LayoutContainer from "@/components/layout/container.vue"
import Hero from "@/components/layout/hero.vue"
import LayoutCard from "@/components/layout/card.vue"
import BaseAlert from "@/components/base/alert.vue"
import BaseButton from "@/components/base/button.vue"
import BaseLoader from "@/components/base/loader.vue"
import FormText from "@/components/form/text.vue"
import parseDate from "@/utils/parseDate"
import UserAvatar from "@/components/user/avatar.vue"
import CommentItem from "@/components/comments/item.vue"
import { useAuthStore } from "@/stores/auth"
import { computed, onMounted, ref, watch } from "vue"
import { useDocumentStore, type Document } from "@/stores/documents"
import { useCommentStore, type Comment } from "@/stores/comments"
import { ChevronLeft, Edit, ExternalLink, Send, Trash2 } from "lucide-vue-next"
import { useRoute, useRouter } from "vue-router"
import { useWindowFocus } from "@vueuse/core"

const id = computed(() => useRoute().params.id as string)

const store = useDocumentStore()
const commentStore = useCommentStore()
const auth = useAuthStore()

const comments = ref<Comment[]>([])
const document = ref<Document | null>(null)
const comment = ref("")

const loadingDocument = computed(() => store.loadingSingle)
const loadingComments = computed(() => commentStore.loading)

const createComment = async () => {
  if (comment.value === "" || !document.value) {
    return
  }

  const _newComment = await commentStore.create(
    document.value.id,
    comment.value,
  )

  if (_newComment) {
    comments.value.push(_newComment)

    comment.value = ""
  }
}

const deleteDocument = async (id: string) => {
  if (
    !confirm(
      "Are you sure you want to delete this document? This will delete the file and all comments under it",
    )
  ) {
    return false
  }

  const success = await store.deleteDocument(id)

  if (success) {
    useRouter().push({ name: "my-files" })
  }
}

const getDocument = async () => {
  const doc = await store.getDocument(id.value)
  if (doc) {
    document.value = store.updateDocumentTagsAndCategory(doc)
    await getComments()
  }
}

const openingDocument = ref<string | null>(null)
const openDocument = async (url: string, id: string) => {
  openingDocument.value = id
  await store.openDocument(url)
}

watch(useWindowFocus(), (v) => {
  if (!v) {
    openingDocument.value = null
  }
})

const getComments = async () => {
  if (!document.value) {
    return
  }

  const _r = await commentStore.getComments(document.value.id)
  if (_r) {
    comments.value = _r
  }
}

const deleteComment = async (id: number) => {
  if (!confirm("Are you sure you want to delete this comment?")) {
    return
  }

  const success = await commentStore.destroy(id)
  if (success) {
    comments.value = comments.value.filter((r) => r.id !== id)
  }
}

onMounted(async () => {
  if (!id.value) {
    history.back()
  }

  await store.getDocumentTagsAndCategories()
  await getDocument()
})
</script>
