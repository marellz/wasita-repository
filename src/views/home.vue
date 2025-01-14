<template>
  <LayoutContainer>
    <div class="max-w-4xl mx-auto">
      <div v-if="loading" class="flex justify-center py-10">
        <custom-loader></custom-loader>
      </div>
      <base-alert v-else-if="error" variant="error" title="Error loading documents">
        {{ error }}
      </base-alert>
      <template v-else>
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
                {{ row.user_id }} <br>
                {{ auth.user?.id }}
              </td>
              <td>
                <h1 class="font-medium text-lg">{{ row.name }}</h1>
                <p class="text-sm max-w-xl mt-1" v-if="row.details">
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
              <td>
                <div class="flex justify-end space-x-2 items-center">
                  <button type="button" class="border rounded-lg p-2 inline-flex items-center space-x-2 text-sm"
                    :loading="loadingDocument === row.id" @click="openDocument(row.url, row.id)">
                    <span>View document</span>
                    <ExternalLink :size="20" :stroke-width="1.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

    </div>
  </LayoutContainer>
</template>
<script setup lang="ts">
import CustomLoader from '@/components/base/loader.vue';
import BaseAlert from '@/components/base/alert.vue';
import BaseButton from '@/components/base/button.vue';
import LayoutContainer from '@/components/layout/container.vue';
import { useDocumentStore } from '@/stores/docs';
import { ExternalLink, Plus } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import moment from 'moment'
import { useAuthStore } from '@/stores/auth';

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

onMounted(async () => {
  await store.getDocuments()
})
</script>
