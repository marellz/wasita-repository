<template>
  <Hero title="My files">
    <template #actions>
      <div class="ml-auto">
        <router-link to="/create">
          <base-button variant="primary-outline">
            <span>Create document</span>
            <Plus />
          </base-button>
        </router-link>
      </div>
    </template>
  </Hero>
  <Container>
    <base-tabs :tabs @change="changeCriteria">
      <template v-for="(tab, index) in tabs" :key="index" #[tab.key]>
        <LayoutCard>
          <user-documents
            :is-owner="tab.key !== 'sharedWithMe'"
            :items="documents"
            :loading="store.loadingAll"
            @get-link="getDocumentLink"
            @open-document="openDocument"
            @delete="deleteDocument"
          />
        </LayoutCard>
      </template>
    </base-tabs>
  </Container>
</template>
<script lang="ts" setup>
import Container from "@/components/layout/container.vue"
import LayoutCard from "@/components/layout/card.vue"
import BaseTabs from "@/components/base/tabs.vue"
import BaseButton from "@/components/base/button.vue"
import Hero from "@/components/layout/hero.vue"
import UserDocuments from "@/components/documents/_user.vue"
import { useClipboard } from "@vueuse/core"
import { useToastsStore } from "@/stores/toasts"
import { onMounted, onUnmounted, ref } from "vue"
import {
  useDocumentStore,
  type GetDocumentsCriteria,
  type Document,
} from "@/stores/documents"
import { Plus } from "lucide-vue-next"

type CriteriaTab = {
  key: GetDocumentsCriteria
  label: string
}
const store = useDocumentStore()
const tabs = ref<CriteriaTab[]>([
  {
    label: "My docs",
    key: "mine",
  },
  {
    label: "Private",
    key: "private",
  },
  {
    label: "Draft",
    key: "drafts",
  },
  {
    label: "Shared with me",
    key: "sharedWithMe",
  },
])

const documents = ref<Omit<Document, "comments">[]>([])

const { copy, copied } = useClipboard()

const getDocuments = async (criteria: GetDocumentsCriteria) => {
  documents.value = []
  const _docs = await store.getUserDocuments(criteria)
  if (_docs) {
    documents.value = _docs
  }
}

const openDocument = async (url: string) => {
  const link = await store.getDocumentPublicUrl(url)

  if (link) {
    window.open(link)
  }
}

const getDocumentLink = async (url: string) => {
  const link = await store.getDocumentPublicUrl(url)

  if (link) {
    copy(link)
  }

  if (copied) {
    useToastsStore().addInfo("Copied!")
  }
}

const deleteDocument = async (id: string) => {
  if (
    !confirm(
      "Are you sure you want to delete this document? This will delete the file and all comments under it",
    )
  ) {
    return false
  }

  const success = await store.deleteDocument(id)

  if (!success) {
    return
  }
  const _i = documents.value.findIndex((d) => d.id === id)

  if (_i !== -1) {
    documents.value.splice(_i, 1)
  }
}

const changeCriteria = (tab: string) => {
  getDocuments(tab as GetDocumentsCriteria)
}

onMounted(async () => {
  await getDocuments("mine")
})

onUnmounted(() => {
  store.resetDocuments()
  store.resetParams()
})
</script>
