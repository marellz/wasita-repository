<template>
  <Hero title="Edit document">
    <template #actions>
      <div v-if="document" class="ml-auto">
        <router-link :to="`/document/${document.id}`">
          <base-button variant="secondary">
            <span>Cancel</span>
            <Edit :size="20" stroke-width="1.5" />
          </base-button>
        </router-link>
      </div>
    </template>
  </Hero>
  <LayoutContainer>
    <LayoutCard>
      <div v-if="store.loadingSingle" class="text-center py-4">
        <base-loader></base-loader>
      </div>
      <document-form
        v-if="document"
        :form="document"
        @submit="updateDocument"
      ></document-form>
    </LayoutCard>
  </LayoutContainer>
</template>
<script lang="ts" setup>
import LayoutContainer from "@/components/layout/container.vue"
import Hero from "@/components/layout/hero.vue"
import LayoutCard from "@/components/layout/card.vue"
import BaseLoader from "@/components/base/loader.vue"
import BaseButton from "@/components/base/button.vue"
import DocumentForm, {
  type DocumentFormPayload,
} from "@/components/documents/form.vue"
import {
  useDocumentStore,
  type DocumentForm as DocumentFormType,
} from "@/stores/documents"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { Edit } from "lucide-vue-next"
const store = useDocumentStore()

const id = computed(() => Number(useRoute().params.id))
const document = ref<DocumentFormType | null>(null)
const updateDocument = async ({ data, file }: DocumentFormPayload) => {
  // only update these fields

  const updated = await store.updateDocument(
    id.value,
    {
      name: data.name,
      details: data.details,
      url: data.url,
      is_draft: data.is_draft,
      is_public: data.is_public,
      tags: data.tags,
      category: data.category,
      collaborators: data.collaborators,
    },
    file,
  )

  if (updated) {
    document.value = { ...document.value, ...data }
  }
}

const getDocument = async () => {
  // fetches with
  const doc = await store.getDocument(id.value)
  if (doc) {
    document.value = { ...doc }
  }
}

onMounted(getDocument)
</script>
