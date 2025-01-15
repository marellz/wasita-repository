<template>
  <form @submit.prevent="submit">
    <div class="space-y-4">
      <form-input label="Document name" v-model="_form.name" :error="errors.name" required />
      <form-text rows="5" label="Document details" v-model="_form.details" :error="errors.details" required />
      <form-checkbox label="Save as draft" v-model="_form.is_draft" @change="handleDraftStatus"></form-checkbox>
      <form-checkbox label="Public document" v-model="_form.is_public" :disabled="_form.is_draft"></form-checkbox>
      <form-select label="Category" v-model="_form.category">
        <option v-for="item in categories" :value="item.value" :key="item.value">
          {{ item.label }}
        </option>
      </form-select>
      <div class="!my-10 space-y-4">
        <base-alert v-if="isUpdate" title="Please note">
          <p>Inputting a new file will mean that the original file will be replaced</p>
        </base-alert>
        <document-input v-model="file" :error="errors.document"></document-input>
      </div>
      <div>
        <form-label>Tags</form-label>
        <div class="flex gap-4">
          <div v-for="(item, index) in tags" :key="index">
            <form-checkbox :value="item.value" :label="item.label" v-model="_form.tags" />
          </div>
        </div>
      </div>
      <div class="!mt-10">
        <base-button class="w-full" :loading>
          <span v-if="isUpdate">Update document</span>
          <span v-else>Submit document</span>
        </base-button>
      </div>
    </div>
  </form>
</template>
<script lang="ts" setup>

import BaseAlert from '@/components/base/alert.vue';
import BaseButton from '@/components/base/button.vue';
import FormInput from '@/components/form/input.vue';
import FormLabel from '@/components/form/label.vue';
import FormText from '@/components/form/text.vue';
import FormSelect from '@/components/form/select.vue';
import FormCheckbox from '@/components/form/checkbox.vue';
import DocumentInput from '@/components/form/document.vue';
import { type DocumentForm, useDocumentStore } from '@/stores/docs';
import { computed, ref } from 'vue';

export interface DocumentFormPayload {
  data: DocumentForm,
  file: File | null
}

const props = withDefaults(defineProps<{
  form?: DocumentForm;
}>(), {
})

const emit = defineEmits(['submit'])

const store = useDocumentStore()

const loading = computed(() => store.loadingSingle)
const errors = computed(() => store.errors)
const isUpdate = computed(() => props.form?.id)
const _form = ref({ ...props.form })
const file = ref<File | undefined>()

const submit = () => {
  const _file = file.value ? file.value : null
  emit('submit', { data: _form.value, file: _file })
}

const tags = ref([
  { label: "Finance", value: "finance" },
  { label: "Meeting", value: "meeting" },
  { label: "2025", value: "2025" },
])


const categories = ref<{ label: string, value: string }[]>([
  { label: "General", value: "general" },
  { label: "Financial", value: "financial" },
  { label: "Minutes", value: "minutes" },
  { label: "Contracts", value: "contracts" },
])


const handleDraftStatus = () => {
  if (_form.value.is_draft) {
    _form.value.is_public = false
  }
}

</script>
