<template>
  <base-modal v-model:show="model" title="Update document" @close="close">
    <div v-if="store.loadingSingle" class="text-center py-4">
      <base-loader></base-loader>
    </div>
    <document-form v-else-if="form" :form @submit="updateDocument"></document-form>
  </base-modal>
</template>
<script lang="ts" setup>
import { useDocumentStore, type DocumentForm as DocumentFormType } from '@/stores/docs';

import BaseModal from '@/components/base/modal.vue'
import BaseLoader from '@/components/base/loader.vue'
import DocumentForm, { type DocumentFormPayload } from '@/components/docs/form.vue';
import { onMounted, ref } from 'vue';
const store = useDocumentStore()

const props = defineProps<{
  id: number;
}>()

const emit = defineEmits(['close'])

const model = defineModel<boolean>()

const form = ref<DocumentFormType | null>(null)

const updateDocument = async ({ data, file }: DocumentFormPayload) => {
  const updated = await store.updateDocument(props.id, data, file)

  if (updated) {
    close()
  }
}

const close = () => {
  model.value = false
  emit('close')
}

onMounted(async () => {
  const doc = await store.getDocument(props.id)
  if (doc) {
    form.value = { ...doc }
  }
})

</script>
