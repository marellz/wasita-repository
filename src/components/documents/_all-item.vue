<template>
  <div class="border flex flex-col-reverse sm:flex-col rounded-xl">
    <!-- header -->
    <div
      class="px-4 py-2 border-t sm:border-t-0 sm:border-b flex flex-col space-y-4 sm:flex-row sm:space-y-0"
    >
      <div class="flex space-x-2 items-center">
        <img
          class="h-9 w-9 rounded-full object-cover border-2"
          v-if="document.user.avatar_url"
          :src="document.user.avatar_url"
          alt=""
        />
        <span
          v-else
          class="h-9 w-9 inline-flex items-center justify-center border-2 rounded-full bg-gray-200"
        >
          <User :size="20" />
        </span>
        <div>
          <p class="font-medium font-secondary">
            {{ document.user.name }}
          </p>
          <p class="text-xs text-slate-500">
            <template v-if="document.updated_at">
              Updated at {{ parseDate(document.updated_at) }}
            </template>
            <template v-else>
              Created at {{ parseDate(document.created_at) }}
            </template>
          </p>
        </div>
      </div>

      <div class="!ml-auto flex items-center space-x-2">
        <router-link :to="`/document/${document.id}`">
          <button type="button" class="action-btn">
            <span class="hidden sm:inline">View</span>
            <Info :size="20" :stroke-width="1.5" />
          </button>
        </router-link>
        <button
          type="button"
          class="action-btn"
          :loading="opening"
          @click="openDocument"
        >
          <span class="hidden sm:inline">Open</span>
          <ExternalLink :size="20" :stroke-width="1.5" />
        </button>
      </div>
    </div>

    <!-- body -->
    <div class="p-4 space-y-4 sm:space-y-2">
      <div
        class="flex flex-wrap items-start sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3"
      >
        <h2 class="text-xl sm:text-3xl font-secondary font-medium">
          {{ document.name }}
        </h2>

        <div class="flex items-start space-x-2 ml-auto">
          <span
            class="text-xs sm:text-sm py-0.5 px-2 bg-black text-white rounded-full font-secondary"
          >
            {{ document.category }}
          </span>
          <div
            v-if="document.remarks[0].count"
            title="`Comments`"
            class="inline-flex items-center space-x-1"
          >
            <MessageCircle :size="20" />
            <span class="text-xs sm:text-sm font-medium">{{
              document.remarks[0].count
            }}</span>
          </div>
        </div>
      </div>
      <p class="text-xs sm:text-sm text-slate-700 line-clamp-2">
        {{ document.details }}
      </p>
      <div v-if="document.tags.length">
        <div class="flex space-x-2">
          <span
            v-for="(tag, key) in document.tags"
            :key
            class="text-xs font-secondary sm:text-sm bg-slate-100 px-2 py-0.5 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import parseDate from "@/utils/parseDate"
import { ExternalLink, Info, MessageCircle, User } from "lucide-vue-next"
import { ref } from "vue"
import type { Document } from "@/stores/docs"

const props = defineProps<{
  document: Document
}>()

const opening = ref(false)
const emit = defineEmits(["open-document"])
const openDocument = () => {
  emit("open-document", props.document.id, props.document.url)
}
</script>
<style>
.action-btn {
  @apply rounded-lg bg-black/5 hover:bg-black hover:text-white px-4 py-2 inline-flex items-center leading-normal md:space-x-1.5 text-sm font-secondary font-medium;
}
</style>
