<template>
  <div class="bg-white p-4 md:p-8 rounded-xl overflow-auto">
    <table class="w-full border-separate border-spacing-y-2">
      <tbody>
        <template v-if="loading">
          <tr>
            <td :colspan>
              <div class="text-center">
                <base-loader></base-loader>
              </div>
            </td>
          </tr>
        </template>
        <template v-else-if="items.length">
          <tr v-for="(row, index) in items" :key="index">
            <td class="border-b py-4">
              <p class="text-sm text-slate-500">Original name</p>
              {{ row.original_name }}
            </td>
            <td class="border-b py-4">
              <DocumentStatusTag v-if="row.is_draft">draft</DocumentStatusTag>
              <DocumentStatusTag status="success" v-else>published</DocumentStatusTag>
            </td>
            <td class="border-b py-4">
              <div class="flex space-x-3 items-center justify-center">
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg">
                  <ExternalLink />
                </button>
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg">
                  <Share2 />
                </button>
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg">
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="" :colspan>
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
import { ExternalLink, Share2, Trash2 } from 'lucide-vue-next';
import BaseLoader from '@/components/base/loader.vue';
import DocumentStatusTag from '@/components/home/document-status-tag.vue';
import type { Document } from '@/stores/docs';

defineProps<{
  items: Document[],
  loading?: boolean

}>()

/** might be important */
// type DocumentKey = keyof Document;
// type DocumentHeader = {
//   key: DocumentKey,
//   label: string;
// }


// const headers: DocumentHeader[] = [
//   { key: "original_name", label: "Name" },
//   { key: "file_type", label: "Type" },
//   { key: "file_type", label: "Type" },
// ]

const colspan = 3
</script>
