<template>
  <div>
    <layout-card v-if="showFilters" class="mb-10">
      <document-filters @hide-filters="$emit('hide-filters')" />
    </layout-card>
    <layout-card
      v-if="store.loadingAll && store.pageNumber === 1"
      class="flex justify-center !py-12"
    >
      <custom-loader></custom-loader>
    </layout-card>

    <base-alert
      v-else-if="error"
      variant="error"
      title="Error loading documents"
    >
      {{ error }}
    </base-alert>
    <template v-else-if="documents.length">
      <layout-card>
        <!--documents-->
        <div class="space-y-4">
          <document-item
            v-for="document in documents"
            :key="document.id"
            :document
            @open-document="openDocument"
          />
          <div v-if="!store.limitReached" class="py-4 text-center">
            <base-button
              @click="store.nextPage()"
              variant="secondary-outline"
              :loading="store.loadingNextPage"
              :disabled="store.limitReached"
            >
              <span>Load more</span>
            </base-button>
          </div>
        </div>
      </layout-card>
    </template>
    <template v-else-if="hasFilters">
      <layout-card>
        <div class="space-y-1">
          <h1 class="text-2xl md:text-4xl font-medium font-secondary">
            Empty.
          </h1>
          <p class="text-sm text-slate-600">
            Looks like there’s nothing here. Modify your filters to see more
            results.
          </p>
        </div>
      </layout-card>
    </template>
    <template v-else>
      <DocumentsEmpty />
    </template>
  </div>
</template>
<script lang="ts" setup>
import CustomLoader from "@/components/base/loader.vue"
import BaseAlert from "@/components/base/alert.vue"
import BaseButton from "@/components/base/button.vue"
import LayoutCard from "@/components/layout/card.vue"
import DocumentFilters from "@/components/documents/filters.vue"
import DocumentItem from "@/components/documents/_all-item.vue"
import DocumentsEmpty from "@/components/documents/empty.vue"

import { useDocumentStore } from "@/stores/documents"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useWindowFocus } from "@vueuse/core"

defineProps<{
  showFilters?: boolean
}>()

defineEmits(["hide-filters"])

const documents = computed(() => store.documents)
const error = computed(() => store.error)
const store = useDocumentStore()
const openingDocument = ref<string | null>()

const onWindowFocus = useWindowFocus()

const openDocument = async (id: string, path: string) => {
  openingDocument.value = id
  await store.openDocument(path)
}

watch(onWindowFocus, (v) => {
  if (!v) {
    openingDocument.value = null
  }
})

onMounted(async () => {
  store.resetDocuments()
  store.resetFilters()
})

const hasFilters = computed(() => store.params.filters !== null)

onUnmounted(() => {
  store.resetDocuments()
  store.resetParams()
})
</script>
