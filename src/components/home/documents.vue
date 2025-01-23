<template>
  <div v-if="store.loadingAll" class="flex justify-center py-10">
    <custom-loader></custom-loader>
  </div>
  <base-alert v-else-if="error" variant="error" title="Error loading documents">
    {{ error }}
  </base-alert>
  <template v-else-if="documents.length">
    <div class="flex justify-end" v-if="auth.isAuthenticated">
      <router-link to="/create">
        <base-button variant="primary-outline">
          <span>Create document</span>
          <Plus />
        </base-button>
      </router-link>
    </div>

    <!--documents-->
    <table class="table w-full documents-table mt-6 md:mt-10">
      <tbody>
        <tr v-for="(row, index) in documents" :key="index">
          <td class="md:w-32">
            <div class="flex justify-center w-full px-4">
              <span
                class="h-16 w-16 border rounded-full flex items-center justify-center"
              >
                <FileText :size="32" :stroke-width="1" />
              </span>
            </div>
          </td>
          <td>
            <div class="space-y-2">
              <div
                class="flex items-center justify-between md:justify-start md:space-x-3"
              >
                <h1 class="font-medium text-lg md:text-3xl font-secondary">
                  {{ row.name }}
                </h1>
                <document-status-tag v-if="row.is_draft"
                  >draft</document-status-tag
                >
                <document-status-tag status="success" v-else
                  >published</document-status-tag
                >
              </div>
              <div class="flex items-center space-x-2">
                <p class="font-light">
                  by <span class="font-medium">{{ row.user.name }}</span>
                </p>
                <span>&ndash;</span>
                <p class="text-sm text-gray-500">
                  {{ parseDate(row.created_at) }}
                </p>
              </div>
              <p
                class="text-sm max-w-xl line-clamp-2 font-light"
                v-if="row.details"
              >
                {{ row.details }}
              </p>
            </div>
            <div class="flex gap-3 flex-wrap items-center flex-auto py-4">
              <button
                type="button"
                class="border rounded-lg px-2 py-1 inline-flex items-center leading-normal space-x-2 text-sm font-secondary"
                @click="viewMoreInfo(row.id)"
              >
                <span>More info</span>
                <Info :size="20" :stroke-width="1.5" />
              </button>
              <button
                type="button"
                class="border rounded-lg px-2 py-1 inline-flex items-center leading-normal space-x-2 text-sm font-secondary"
                :loading="loadingDocument === row.id"
                @click="openDocument({ path: row.url, id: row.id })"
              >
                <span>View document</span>
                <ExternalLink :size="20" :stroke-width="1.5" />
              </button>
              <div
                v-if="row.remarks[0] && row.remarks[0].count"
                class="span inline-flex items-center space-x-2 text-sm font-secondary font-medium py-1 px-2"
              >
                <MessageCircle :size="20" :stroke-width="1.5" />
                <span class="">
                  {{ row.remarks[0].count }}
                </span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  <template v-else>
    <DocumentsEmpty />
  </template>
  <DocumentView
    v-if="moreInfoDocument"
    v-model="moreInfoModalActive"
    :document="moreInfoDocument"
    ref="document"
    @close="closeMoreInfoModal"
    @open-document="openDocument"
  />
</template>
<script lang="ts" setup>
import CustomLoader from "@/components/base/loader.vue"
import BaseAlert from "@/components/base/alert.vue"
import BaseButton from "@/components/base/button.vue"
import DocumentView from "@/components/home/document-view.vue"
import DocumentStatusTag from "@/components/home/document-status-tag.vue"
import DocumentsEmpty from "@/components/home/documents-empty.vue"
import {
  ExternalLink,
  Info,
  FileText,
  Plus,
  MessageCircle,
} from "lucide-vue-next"
import { useAuthStore } from "@/stores/auth"
import { useDocumentStore } from "@/stores/docs"
import { computed, ref } from "vue"
import parseDate from "@/utils/parseDate"
import { onMounted } from "vue"

const auth = useAuthStore()
const documents = computed(() => store.documents)
const error = computed(() => store.error)
const store = useDocumentStore()
const document = ref()
const loadingDocument = ref<number | null>()

const openDocument = async ({ path, id }: { path: string; id: number }) => {
  console.log("open")

  loadingDocument.value = id
  const fullPath = await store.getDocumentPublicUrl(path)

  if (fullPath) {
    loadingDocument.value = null
    window.open(fullPath)
  }
}

const moreInfoModalActive = ref(true)
const moreInfoModalId = ref()
const moreInfoDocument = ref()

const viewMoreInfo = async (id: number) => {
  const doc = await store.getDocument(id)

  moreInfoModalActive.value = true
  moreInfoModalId.value = id
  moreInfoDocument.value = doc
}

const closeMoreInfoModal = () => {
  moreInfoModalActive.value = false
  moreInfoModalId.value = null
  moreInfoDocument.value = null
}

onMounted(async () => {
  await store.getDocuments()
})
</script>
