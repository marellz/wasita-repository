<template>
  <Container>
    <base-tabs :tabs @change="changeCriteria">
      <template #nav>
        <div class="!ml-auto">
          <router-link to="/create">
            <base-button variant="primary-outline">
              <span>Create document</span>
              <Plus />
            </base-button>
          </router-link>
        </div>
      </template>
      <template v-for="(tab, index) in tabs" :key="index" #[tab.key]>
        <documents-table
          :items="documents"
          :loading="store.loadingAll"
          @update="openDocumentUpdateModal"
          @get-link="getDocumentLink"
          @open-document="openDocument"
          @delete="deleteDocument"
        />
      </template>
    </base-tabs>
  </Container>
  <document-update
    :id="updateId"
    v-if="updateId"
    v-model="updateModalActive"
    @close="close"
  ></document-update>
</template>
<script lang="ts" setup>
import Container from "@/components/layout/container.vue"
import BaseTabs from "@/components/base/tabs.vue"
import BaseButton from "@/components/base/button.vue"
import UserDocuments from "@/components/documents/_user.vue"
import { computed, onMounted, ref } from "vue"
import { useDocumentStore, type GetDocumentsCriteria } from "@/stores/docs"
import DocumentsTable from "@/components/docs/table.vue"
import DocumentUpdate from "@/components/home/document-update.vue"
import { useClipboard } from "@vueuse/core"
import { useToastsStore } from "@/stores/toasts"
import { Plus } from "lucide-vue-next"

const store = useDocumentStore()
const tabs = ref([
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
    key: "sent",
  },
])

const documents = computed(() => store.documents)
const updateId = ref<number | null>()
const updateModalActive = ref<boolean>(true)

const { copy, copied } = useClipboard()

const getDocuments = async (criteria: GetDocumentsCriteria) => {
  await store.getDocuments(criteria)
}

const openDocument = async (url: string) => {
  const link = await store.getDocumentPublicUrl(url)

  if (link) {
    window.open(link)
  }
}

const openDocumentUpdateModal = (id: number) => {
  updateId.value = id
  updateModalActive.value = true
}

const getDocumentLink = async (url: string) => {
  const link = await store.getDocumentPublicUrl(url)

  if (link) {
    console.log(link)
    copy(link)
  }

  if (copied) {
    useToastsStore().addInfo("Copied!")
  }
}

const deleteDocument = async (id: number) => {
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

const close = async () => {
  const id = updateId.value
  if (id) {
    const _updated = await store.getDocument(id)
    const _i = documents.value.findIndex((d) => d.id === id)

    if (_updated && _i !== -1) {
      documents.value[_i] = _updated
    }
  }

  updateModalActive.value = false
  updateId.value = null
}

onMounted(async () => {
  await getDocuments("mine")
})
</script>
