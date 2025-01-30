<template>
  <table class="w-full border-separate border-spacing-y-2">
    <thead v-if="!loading && items.length" class="hidden sm:table-row-group">
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
          <td class="border-none sm" :colspan>
            <div class="text-center">
              <base-loader></base-loader>
            </div>
          </td>
        </tr>
      </template>
      <template v-else-if="items.length">
        <tr v-for="(row, index) in items" :key="index">
          <td class="w-16 absolute sm:static">
            <UserAvatar
              :avatar="isOwner ? auth.user?.avatar_url : row.user?.avatar_url"
            />
          </td>
          <td class="w-full !pl-20 sm:w-auto sm:!pl-4">
            <div class="space-y-2 sm:space-y-1">
              <div
                class="flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center space-y-2 sm:space-y-0"
              >
                <p class="font-medium">{{ row.name }}</p>
                <div class="flex items-center space-x-2 w-full md:w-auto">
                  <span
                    class="py-0.5 px-2 rounded-full border text-xs font-secondary"
                  >
                    {{ row.category }}</span
                  >
                  <div class="flex items-center space-x-2">
                    <p
                      v-if="row.is_draft"
                      class="bg-slate-200 text-xs px-2 py-0.5 rounded-full font-medium font-secondary inline-flex space-x-1 items-center"
                    >
                      <span> draft </span>
                    </p>
                    <p
                      v-if="row.is_public"
                      class="bg-green-100 text-green-500 text-xs px-2 py-0.5 rounded-full font-medium font-secondary inline-flex space-x-1 items-center"
                    >
                      <span> public </span>
                      <Check :size="12" />
                    </p>
                  </div>
                </div>
              </div>
              <p class="text-sm italic text-slate-500">
                <template v-if="isOwner">
                  {{ row.original_name }}
                </template>
                <template v-else-if="row.user">
                  by {{ row.user?.name }}
                  <template v-if="row.user.phone">
                    <span> | </span>
                    <a class="underline" :href="`tel:${row.user.phone}`">{{
                      row.user.phone
                    }}</a>
                  </template>
                  <span> | </span>
                  <a class="underline" :href="`mailto:${row.user.email}`">{{
                    row.user.email
                  }}</a>
                </template>
              </p>
            </div>
          </td>

          <td>
            <div class="flex space-x-3 items-center justify-end">
              <router-link :to="`/edit/${row.id}`">
                <button type="button" class="p-2 hover:bg-slate-100 rounded-lg">
                  <Edit :size="20" stroke-width="1.5" />
                </button>
              </router-link>
              <button
                type="button"
                class="p-2 hover:bg-slate-100 rounded-lg"
                @click="openDocument(row.url)"
              >
                <ExternalLink :size="20" stroke-width="1.5" />
              </button>
              <button
                v-if="isSupported"
                type="button"
                class="p-2 hover:bg-slate-100 rounded-lg"
                @click="getLink(row.url)"
              >
                <Share2 :size="20" stroke-width="1.5" />
              </button>
              <button
                type="button"
                class="p-2 hover:bg-slate-100 rounded-lg disabled:text-slate-200"
                @click="deleteDocument(row.id)"
                :disabled="auth.user?.id !== row.user_id"
              >
                <Trash2 :size="20" stroke-width="1.5" />
              </button>
            </div>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td class="border" :colspan="colspan + 1">
            <p class="text-center">
              <span class="font-secondary font-medium text-slate-500"
                >No Documents.
              </span>
              <br />
              <span class="font-light text-sm"
                >You have no documents satisfying that criteria.</span
              >
            </p>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import BaseLoader from "@/components/base/loader.vue"
import UserAvatar from "@/components/user/avatar.vue"
import { Check, Edit, ExternalLink, Share2, Trash2 } from "lucide-vue-next"
import { useClipboard } from "@vueuse/core"
import { useAuthStore } from "@/stores/auth"
import type { Document } from "@/stores/documents"
import { computed } from "vue"

const auth = useAuthStore()

const { isSupported } = useClipboard()
defineProps<{
  items: Omit<Document, "comments">[]
  loading?: boolean
  isOwner: boolean
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
  key: keyof Document | "actions"
  label: string
}

const headers: DocumentHeader[] = [
  { key: "name", label: "Document details" },
  { key: "actions", label: "Actions" },
]

const colspan = computed(() => headers.length)
</script>
<style scoped>
table tr {
  @apply flex flex-wrap md:table-row border sm:border-none rounded-xl sm:rounded-none;
}
table td {
  @apply last:w-full md:last:w-auto flex-none sm:border-y py-4 pl-4 last:pr-4 sm:first:border-l sm:last:border-r sm:first:rounded-l-xl sm:last:rounded-r-xl;
}

table th {
  @apply px-4;
}
</style>
