<template>
  <label class="block" :for="id">
    <input class="h-0 w-0 absolute -z-10" @change="handleChange" type="file" :id :disabled :required ref="input">

    <div
      class="border-2 border-slate-400 p-4 rounded-xl border-dashed min-h-64 flex flex-wrap items-center justify-center space-x-10"
      :class="{ 'border-red-200': error }">
      <div>
        <img class="max-w-40" src="@/assets/images/undraw_add-files_d04y.svg" alt="">
      </div>
      <div>
        <template v-if="model">
          <div class="space-y-2">
            <div class="flex justify-center">
              <FileCheck class="text-indigo-600" />
            </div>
            <h1 class="font-medium text-2xl">Document added!</h1>
            <p>{{ model.name }}</p>
            <div class="!mt-4 text-center">
              <button type="button"
                class="inline-flex items-center space-x-1 text-sm leading-normal hover:bg-red-100 text-red-500 p-1 rounded font-medium"
                @click.prevent="model = undefined">
                <span>Remove file</span>
                <Trash :size="16" :stroke-width="1.5" />
              </button>

            </div>
          </div>

        </template>
        <template v-else>
          <h1 class="font-medium text-2xl">Add a document</h1>
          <p>Upload a document you wish to upload</p>

          <ul class="mt-4 list-disc pl-5 text-gray-700 text-sm">
            <li>Accepted file types: PDF, DOCX, JPG, PNG.</li>
            <li>Maximum file size: 10MB.</li>
            <li>Ensure the document name is clear and descriptive.</li>
          </ul>
        </template>
      </div>

    </div>
  </label>
  <form-error class="mt-2" v-if="error">{{ error }}</form-error>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId';
import { FileCheck, Trash } from 'lucide-vue-next';
import FormError from '@/components/form/error.vue'
import { onMounted, ref } from 'vue';

defineProps<{
  disabled?: boolean;
  required?: boolean;
  error?: any
}>()

const model = defineModel<File | undefined>();
const id = ref();
const input = ref()
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    model.value = target.files[0]
  }
}

onMounted(() => {
  id.value = useCustomId()
});
</script>
