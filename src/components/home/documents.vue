<template>
  <div v-if="store.loadingAll" class="flex justify-center py-10">
    <custom-loader></custom-loader>
  </div>
  <base-alert v-else-if="error" variant="error" title="Error loading documents">
    {{ error }}
  </base-alert>
  <template v-else-if="documents.length">
    <div class="flex justify-end" v-if="auth.isAuthenticated">
      <router-link to="/submit">
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
          <td class="md:w-24">
            <div class="flex justify-center w-full">
              <span class="h-16 w-16 border rounded-full flex items-center justify-center">
                <FileText :size="32" :stroke-width="1" />
              </span>
            </div>
          </td>
          <td>
            <div class="flex items-center justify-between">
              <h1 class="font-medium text-lg md:text-2xl font-funnel">{{ row.name }}</h1>
              <document-status-tag v-if="row.is_draft">draft</document-status-tag>
              <document-status-tag status="success" v-else>published</document-status-tag>
            </div>
            <p class="text-sm max-w-xl mt-1 line-clamp-2 font-light" v-if="row.details">
              {{ row.details }}
            </p>
            <div class="flex gap-3 flex-wrap items-center flex-auto py-4">
              <button type="button"
                class="border rounded-lg px-2 py-1 inline-flex items-center leading-normal space-x-2 text-sm"
                @click="viewMoreInfo(row.id)">
                <span>More info</span>
                <Info :size="20" :stroke-width="1.5" />
              </button>
              <button type="button"
                class="border rounded-lg px-2 py-1 inline-flex items-center leading-normal space-x-2 text-sm"
                :loading="loadingDocument === row.id" @click="openDocument(row.url, row.id)">
                <span>View document</span>
                <ExternalLink :size="20" :stroke-width="1.5" />
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Created on {{ parseDate(row.created_at) }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>

  </template>
  <template v-else>
    <DocumentsEmpty />
  </template>
  <DocumentView v-if="moreInfoDocument" v-model="moreInfoModalActive" :document="moreInfoDocument" ref="document"
    @close="closeMoreInfoModal" @open-document="openDocument" />

</template>
<script lang="ts" setup>
import CustomLoader from '@/components/base/loader.vue';
import BaseAlert from '@/components/base/alert.vue';
import BaseButton from '@/components/base/button.vue';
import DocumentView from '@/components/home/document-view.vue';
import DocumentStatusTag from '@/components/home/document-status-tag.vue';
import DocumentsEmpty from '@/components/home/documents-empty.vue';
import { ExternalLink, Info, FileText, Plus } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useDocumentStore } from '@/stores/docs';
import { computed, ref } from 'vue';
import parseDate from '@/utils/parseDate';
import { onMounted } from 'vue';

const auth = useAuthStore()
const documents = computed(() => store.documents)
const error = computed(() => store.error)
const store = useDocumentStore()
const document = ref()
const loadingDocument = ref<number | null>()

const openDocument = async (path: string, id: number) => {
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
