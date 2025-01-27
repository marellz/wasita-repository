<template>
  <layout-card v-if="store.loadingAll" class="flex justify-center !py-12">
    <custom-loader></custom-loader>
  </layout-card>
  <base-alert v-else-if="error" variant="error" title="Error loading documents">
    {{ error }}
  </base-alert>
  <template v-else-if="documents.length">
    <layout-card>
      <!--documents-->
      <div class="space-y-4">
        <document-filters @submit="filterDocuments" />
        <hr />
        <document-item
          v-for="document in documents"
          :key="document.id"
          :document
          @open-document="openDocument"
        />
      </div>
    </layout-card>
  </template>
  <template v-else>
    <DocumentsEmpty />
  </template>
</template>
<script lang="ts" setup>
import CustomLoader from "@/components/base/loader.vue"
import BaseAlert from "@/components/base/alert.vue"
import LayoutCard from "@/components/layout/card.vue"
import DocumentFilters from "@/components/documents/filters.vue"
import DocumentItem from "@/components/documents/_all-item.vue"
import DocumentsEmpty from "@/components/documents/empty.vue"

import { useDocumentStore } from "@/stores/docs"
import { computed, ref, watch } from "vue"

import { onMounted } from "vue"
import { useWindowFocus } from "@vueuse/core"

const documents = computed(() => store.documents)
const error = computed(() => store.error)
const store = useDocumentStore()
const openingDocument = ref<number | null>()

const onWindowFocus = useWindowFocus()

const filterDocuments = () => {}

const openDocument = async (id: number, path: string) => {
  openingDocument.value = id
  await store.openDocument(path)
}

watch(onWindowFocus, (v) => {
  if (!v) {
    openingDocument.value = null
  }
})

onMounted(async () => {
  await store.getDocuments()
})
</script>
