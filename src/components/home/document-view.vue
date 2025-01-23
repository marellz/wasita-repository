<template>
  <base-modal v-model:show="model" @close="close" title="Document">
    <div v-if="store.loadingAll" class="flex justify-center py-10">
      <base-loader></base-loader>
    </div>
    <div v-else-if="store.error" class="flex justify-center py-10">
      <base-alert variant="error" title="Error loading document">
        {{ store.error }}
      </base-alert>
    </div>
    <div v-else class="space-y-10">
      <div>
        <p class="text-sm text-gray-500 mb-2">Name</p>
        <div class="flex flex-wrap gap-4 justify-between">
          <h1 class="text-4xl">
            {{ document.name }}
          </h1>
          <div class="flex space-x-2">
            <base-button @click="openDocument(document.url, document.id)">
              <span>View document</span>
            </base-button>
            <base-button
              v-if="auth.user.id === document.user_id"
              variant="danger"
              @click="deleteDocument(document.id)"
            >
              <span>Delete document</span>
            </base-button>
          </div>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Authored by</p>
        <div class="flex space-x-2 items-center">
          <img
            v-if="document.user.avatar_url"
            class="h-16 w-16 object-center rounded-full border-2"
            :src="document.user.avatar_url"
            alt=""
          />
          <span
            v-else
            class="h-16 w-16 object-center rounded-full border-2 bg-slate-200 inline-flex items-center justify-center"
          >
            <User2 :size="40" :stroke-width="1" />
          </span>
          <div>
            <h1 class="font-medium font-secondary text-lg">
              {{ document.user.name }}
            </h1>
            <p class="text-sm text-gray-600">{{ document.user.email }}</p>
          </div>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Details</p>
        <p>{{ document.details }}</p>
      </div>
      <p class="!mt-4 text-sm text-slate-600">
        Created on {{ parseDate(document.created_at) }}
      </p>
      <hr />
      <div>
        <form @submit.prevent="createRemark">
          <div class="space-y-4">
            <form-text
              placeholder="What are your thoughts on this document?"
              v-model="comment"
              required
              :error="remarkStore.error?.comment"
            ></form-text>
            <base-button type="submit" :loading>
              <span>Comment</span>
            </base-button>
          </div>
        </form>

        <div class="py-5">
          <template v-if="remarks.length">
            <h1 class="font-medium">Other remarks</h1>
            <div class="mt-3 space-y-2">
              <div
                v-for="remark in remarks"
                :key="remark.id"
                class="border rounded-xl p-4"
              >
                <div class="flex">
                  <div class="flex-auto flex flex-col space-y-2">
                    <div class="flex space-x-2 items-center font-secondary">
                      <p>{{ remark.user.name }}</p>
                      <span>|</span>
                      <p class="text-sm text-gray-500">
                        {{ parseDate(remark.created_at) }}
                      </p>
                    </div>
                    <h1 class="text-lg">
                      {{ remark.content }}
                    </h1>
                  </div>
                  <button
                    v-if="remark.user_id === auth.user?.id"
                    type="button"
                    @click="deleteComment(remark.id)"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          </template>
          <p v-else class="text-slate-500 text-center">
            No remarks. Be the first to leave one.
          </p>
        </div>
      </div>
    </div>
  </base-modal>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth"
import { useDocumentStore, type Document } from "@/stores/docs"
import { useRemarkStore, type Remark } from "@/stores/remarks"
import BaseModal from "@/components/base/modal.vue"
import BaseAlert from "@/components/base/alert.vue"
import FormText from "@/components/form/text.vue"
import BaseButton from "@/components/base/button.vue"
import { computed, onMounted, ref, watch } from "vue"
import { Trash2, User2 } from "lucide-vue-next"
import parseDate from "@/utils/parseDate"
import BaseLoader from "@/components/base/loader.vue"

const props = defineProps<{
  document: Document
  show?: boolean
}>()

const model = defineModel<boolean>()
const emit = defineEmits(["close", "open-document"])
const store = useDocumentStore()
const remarkStore = useRemarkStore()
const auth = useAuthStore()
const comment = ref("")
const remarks = ref<Remark[]>([])

const loading = computed(() => remarkStore.loading)

const createRemark = async () => {
  console.log("create")
  if (comment.value === "") {
    return
  }

  const _newRemark = await remarkStore.create(props.document.id, comment.value)
  if (_newRemark) {
    remarks.value.push(_newRemark)

    comment.value = ""
  }
}

const deleteDocument = async (id: number) => {
  if (
    !confirm(
      "Are you sure you want to delete this document? This will delete the file and all comments under it",
    )
  ) {
    return false
  }

  const success = await store.deleteDocument(id)

  if (success) {
    emit("close")
  }
}

const openDocument = (url: string, id: number) => {
  emit("open-document", { url, id })
}

const getComments = async () => {
  const _r = await remarkStore.getRemarks(props.document.id)
  if (_r) {
    remarks.value = _r
  }
}

const deleteComment = async (id: number) => {
  if (!confirm("Are you sure you want to delete this comment?")) {
    return
  }

  const success = await remarkStore.destroy(id)
  if (success) {
    remarks.value = remarks.value.filter((r) => r.id !== id)
  }
}

const close = () => {
  model.value = false
  emit("close")
}

watch(comment, () => {
  remarkStore.resetError()
})

watch(() => props.document.id, getComments)
onMounted(getComments)
onMounted(() => {
  // active.value = props.show
})
</script>
