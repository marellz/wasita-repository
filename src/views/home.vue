<template>
  <LayoutContainer>
    <div class="max-w-4xl mx-auto">
      <div v-if="loading" class="flex justify-center py-10">
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
        <table class="table w-full documents-table">
          <tbody>
            <tr v-for="(row, index) in documents" :key="index">
              <td>
                <span class="h-16 w-16 border rounded-full flex items-center justify-center">
                  <FileText :size="32" :stroke-width="1" />
                </span>
              </td>
              <td>
                <div class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 lg:items-center mb-3 lg:mb-0">
                  <h1 class="font-medium text-xl">{{ row.name }}</h1>
                  <div class="flex gap-3 flex-wrap items-center flex-auto">
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
                </div>
                <p class="text-sm max-w-xl mt-1 line-clamp-2" v-if="row.details">
                  {{ row.details }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Created on {{ parseDate(row.created_at) }}
                </p>
              </td>
              <td>
                <p v-if="row.is_draft">Draft</p>
                <p v-else>Published</p>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <div class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 py-10">
          <img class="max-w-sm w-full" src="@/assets/images/undraw_server-push_1lbi.svg" alt="">
          <div class="space-y-4">
            <h1 class="text-3xl font-medium leading-snug">
              Your repository is ready, but it’s feeling a little empty.
            </h1>
            <p>Start uploading important documents to keep everything organized and accessible for your family. With
              everything in one place, you'll never have to dig through endless conversations again.</p>
            <div class="flex items-center space-x-3">
              <template v-if="auth.isAuthenticated">
                <router-link to="/submit">
                  <base-button variant="primary-outline">
                    <span>Create document</span>
                    <Plus />
                  </base-button>
                </router-link>
              </template>
              <template v-else>
                <RouterLink to="/login">
                  <base-button>
                    <span>Login</span>
                  </base-button>
                </RouterLink>
                <span class="text-sm font-medium px-2">or</span>
                <RouterLink to="/register">
                  <base-button variant="primary-outline">
                    <span>Create a new account</span>
                  </base-button>
                </RouterLink>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <base-modal v-model:show="moreInfoModalActive" @close="closeMoreInfoModal" title="Document">
      <template v-if="moreInfoDocument">
        <div class="space-y-10">
          <div>
            <p class="text-sm text-gray-500 mb-2">Name</p>
            <div class="flex flex-wrap gap-4 justify-between">
              <h1 class="text-4xl">
                {{ moreInfoDocument.name }}
              </h1>
              <div class="flex space-x-2">
                <base-button>
                  <span>View document</span>
                </base-button>
                <base-button variant="danger" @click="deleteDocument(moreInfoDocument.id)">
                  <span>Delete document</span>
                </base-button>
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-2">Authored by</p>
            <div class="flex space-x-2 items-center">
              <img class="h-12 w-12 object-center rounded-full border-2"
                src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/09/09834fb098969556fda54d497357ad20f46a6849_full.jpg"
                alt="">
              <div>
                <h1 class="font-medium">Dave Njoroge</h1>
                <p class="text-sm">0707420685 | example@email.com</p>
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-2">Details</p>
            <p>{{ moreInfoDocument.details }}</p>
          </div>
          <p class="!mt-4 text-sm text-slate-600">Created on {{ parseDate(moreInfoDocument.created_at) }}</p>
          <hr>
          <div>
            <p class="text-lg text-center">No remarks. Be the first to <a class="text-indigo-600 font-medium"
                href="#leave-remark" @click="remarksFormActive = true">leave one</a>.
            </p>
          </div>
        </div>
      </template>
    </base-modal>
  </LayoutContainer>
</template>
<script setup lang="ts">
import CustomLoader from '@/components/base/loader.vue';
import BaseAlert from '@/components/base/alert.vue';
import BaseModal from '@/components/base/modal.vue';
import BaseButton from '@/components/base/button.vue';
import LayoutContainer from '@/components/layout/container.vue';
import { useDocumentStore } from '@/stores/docs';
import { useAuthStore } from '@/stores/auth';
import { ExternalLink, Info, Plus, FileText } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import moment from 'moment'

const auth = useAuthStore()
const store = useDocumentStore()

const documents = computed(() => store.documents)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const parseDate = (date: string) => {
  return moment(date).format('MMMM Do YYYY, h:mm a');
}

const loadingDocument = ref<number | null>()
const openDocument = async (path: string, id: number) => {
  loadingDocument.value = id
  const fullPath = await store.getDocumentPublicUrl(path)

  if (fullPath) {
    loadingDocument.value = null
    window.open(fullPath)
  }
}

const moreInfoModalActive = ref(false)
const moreInfoModalId = ref()
const moreInfoDocument = ref()

const viewMoreInfo = async (id: number) => {
  const doc = await store.getDocument(id)
  if (!doc) {
    return false
  }

  moreInfoModalActive.value = true
  moreInfoModalId.value = (id)
  moreInfoDocument.value = doc
}

const closeMoreInfoModal = () => {
  moreInfoModalActive.value = false
  moreInfoModalId.value = null
  remarksFormActive.value = false
}


const remarksFormActive = ref(false)
const deleteDocument = async (id: number) => {
  if (!confirm('Are you sure you want to delete this document? This will delete the file and all remarks')) {
    return false;
  }

  const success = await store.deleteDocument(id);

  if (success) {
    closeMoreInfoModal()
  }

}
onMounted(async () => {
  await store.getDocuments()
})
</script>
