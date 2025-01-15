<template>
  <Container>
    <base-tabs :tabs @change="changeCriteria">
      <template #mine>
        <documents-table :items="documents" :loading="store.loadingAll" />
      </template>
      <template #drafts>
        <documents-table :items="documents" :loading="store.loadingAll" />
      </template>
      <template #sent>
        <documents-table :items="documents" :loading="store.loadingAll" />
      </template>
    </base-tabs>
  </Container>
</template>
<script lang="ts" setup>
import Container from '@/components/layout/container.vue';
import BaseTabs from '@/components/base/tabs.vue';
import { computed, onMounted, ref } from 'vue';
import { useDocumentStore, type GetDocumentsCriteria } from '@/stores/docs';
import DocumentsTable from '@/components/docs/table.vue';
const store = useDocumentStore()
const tabs = ref([
  {
    label: "My docs",
    key: 'mine',
  },
  {
    label: "Draft",
    key: 'drafts',
  },
  {
    label: "Sent to me",
    key: 'sent',
  },
])

const documents = computed(() => store.documents);

const changeCriteria = (tab: string) => {
  getDocuments(tab as GetDocumentsCriteria)
}

const getDocuments = async (criteria: GetDocumentsCriteria) => {
  await store.getDocuments(criteria)
}

onMounted(async () => {
  await getDocuments('mine')
})

</script>
