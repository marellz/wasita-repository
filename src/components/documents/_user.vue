<template>
  <table class="w-full border-separate border-spacing-y-2">
    <thead>
      <tr>
        <th></th>
        <th v-for="({ label, key }, i) in headers" :key>
          <p
            class="text-sm text-slate-500 font-light text-left"
            :class="{ '!text-center': i === headers.length - 1 }"
          >
            {{ label }}
          </p>
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
          <td class="w-2">
            <File />
          </td>
          <td>
            <div class="space-y-1">
              <div class="flex space-x-2 items-center">
                <p class="font-medium">{{ row.name }}</p>
                <span
                  class="py-0.5 px-2 rounded-full border text-xs font-secondary"
                >
                  {{ row.category }}</span
                >
                <div>
                  <p
                    class="bg-slate-200 text-xs px-2 py-0.5 rounded-full font-medium font-secondary inline-flex space-x-1 items-center"
                    :class="{ '!bg-green-100 text-green-500': !row.is_draft }"
                  >
                    <span>
                      {{ row.is_draft ? "draft" : "published" }}
                    </span>
                    <Check v-if="!row.is_draft" :size="12" />
                  </p>
                </div>
              </div>
              <p class="text-sm italic text-slate-500">
                {{ row.original_name }}
              </p>
            </div>
          </td>

          <td>
            <div class="flex space-x-3 items-center justify-center">
              <router-link :to="`/edit/${row.id}`">
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg">
                  <Edit :size="20" />
                </button>
              </router-link>
              <button
                type="button"
                class="p-2 hover:bg-slate-100 rounded-lg"
                @click="openDocument(row.url)"
              >
                <ExternalLink :size="20" />
              </button>
              <button
                v-if="isSupported"
                type="button"
                class="p-2 hover:bg-slate-100 rounded-lg"
                @click="getLink(row.url)"
              >
                <Share2 :size="20" />
              </button>
              <button
                type="button"
                class="p-2 hover:bg-slate-100 rounded-lg disabled:text-slate-200"
                @click="deleteDocument(row.id)"
                :disabled="auth.user?.id !== row.user_id"
              >
                <Trash2 :size="20" />
              </button>
            </div>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td class="border-none" :colspan>
            <p class="text-center font-secondary">No Documents</p>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import BaseLoader from "@/components/base/loader.vue"
import {
  Check,
  Edit,
  ExternalLink,
  Share2,
  Trash2,
  File,
} from "lucide-vue-next"
import { useClipboard } from "@vueuse/core"
import { useAuthStore } from "@/stores/auth"
import type { Document } from "@/stores/documents"
import { computed } from "vue"

const auth = useAuthStore()

const { isSupported } = useClipboard()
defineProps<{
  items: Document[]
  loading?: boolean
}>()

const emit = defineEmits(["update", "open-document", "get-link", "delete"])

const openDocument = (url: string) => {
  emit("open-document", url)
}
const getLink = (url: string) => {
  emit("get-link", url)
}
const deleteDocument = (id: string) => {
  emit("delete", id)
}

type DocumentHeader = {
  key: keyof Document
  label: string
}

const headers: DocumentHeader[] = [
  { key: "name", label: "Document details" },
  { key: "id", label: "Actions" },
]

const colspan = computed(() => headers.length)
</script>
<style scoped>
table td {
  @apply bg-slate-100 p-4 first:rounded-l last:rounded-r;
}

table th {
  @apply px-4;
}
</style>
