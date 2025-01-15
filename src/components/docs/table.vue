<template>
  <div class="bg-white p-4 md:p-8 rounded-xl overflow-auto">
    <table class="w-full border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th v-for="({ label, key }, i) in headers" :key>
            <p class="text-sm text-slate-500 font-light text-left"
              :class="{ '!text-center': i === headers.length - 1 }">
              {{ label
              }}</p>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr>
            <td class="border-none" :colspan>
              <div class="text-center">
                <base-loader></base-loader>
              </div>
            </td>
          </tr>
        </template>
        <template v-else-if="items.length">
          <tr v-for="(row, index) in items" :key="index">
            <td>
              <div class="space-y-1">
                <div class="flex space-x-2 items-center">
                  <p class="font-medium">{{ row.name }}</p>
                  <span class="py-0.5 px-2 rounded-full border text-xs"> {{ row.category }}</span>
                  <div>
                    <DocumentStatusTag v-if="row.is_draft">draft</DocumentStatusTag>
                    <DocumentStatusTag status="success" v-else>published</DocumentStatusTag>
                  </div>
                </div>
                <p class="text-sm italic text-slate-500">
                  {{ row.original_name }}
                </p>
                <p v-if="row.details" class="!mt-2 p-2 bg-slate-50 text-xs rounded-lg line-clamp-2">{{
                  row.details }}
                </p>
              </div>
            </td>

            <td>
              <div class="flex space-x-3 items-center justify-center">
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg" @click="update(row.id)">
                  <Edit2 />
                </button>
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg" @click="openDocument(row.url)">
                  <ExternalLink />
                </button>
                <button v-if="isSupported" type="button" class="p-2 hover:bg-slate-100 rounded-lg"
                  @click="getLink(row.url)">
                  <Share2 />
                </button>
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg" @click="deleteDocument(row.id)">
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="border-none" :colspan>
              <p class="text-center font-funnel">
                No Documents
              </p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { Edit2, ExternalLink, Share2, Trash2 } from 'lucide-vue-next';
import BaseLoader from '@/components/base/loader.vue';
import DocumentStatusTag from '@/components/home/document-status-tag.vue';
import type { Document } from '@/stores/docs';
import { computed } from 'vue';
import { useClipboard } from '@vueuse/core';

const { isSupported } = useClipboard()
defineProps<{
  items: Document[],
  loading?: boolean

}>()

const emit = defineEmits(['update', 'open-document',
  'get-link',
  'delete'])

const update = (id: number) => {
  emit('update', id)
}

const openDocument = (url: string) => {
  emit('open-document', url);

}
const getLink = (url: string) => {
  emit('get-link', url);
}
const deleteDocument = (id: number) => {
  emit('delete', id);
}

type DocumentHeader = {
  key: keyof Document,
  label: string;
}


const headers: DocumentHeader[] = [
  { key: "name", label: "Document details" },
  { key: "id", label: "Actions" },
]

const colspan = computed(() => headers.length)
</script>
<style scoped>
table td {
  @apply border-b p-4;
}
</style>
