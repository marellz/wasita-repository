<template>
  <label class="block" :for="id">
    <input
      class="h-0 w-0 absolute -z-10"
      @change="handleChange"
      type="file"
      :id
      :disabled="disabled || uploading"
      :required
      ref="input"
    />

    <div
      class="border-2 border-slate-400 p-4 rounded-xl border-dashed min-h-64 flex flex-wrap items-center justify-center md:space-x-10 space-y-4 md:space-y-0 transition-all ease-in-out duration-150 bg-transparent"
      :class="{
        'border-red-400': error,
        '!border-indigo-600 !bg-indigo-50': !!model,
        grayscale: disabled || uploading,
      }"
    >
      <div>
        <img
          class="max-w-40"
          src="@/assets/images/undraw_add-files_d04y.svg"
          alt=""
        />
      </div>
      <div>
        <template v-if="model">
          <div class="space-y-2">
            <h1 class="font-medium text-2xl">Document added!</h1>
            <div class="flex items-center space-x-2">
              <FileCheck class="text-indigo-600" />
              <p class="line-clamp-1 w-full max-w-80">{{ model.name }}</p>
            </div>
            <div class="!mt-4">
              <button
                type="button"
                class="inline-flex border border-red-500 items-center space-x-1 text-sm leading-normal hover:bg-red-100 text-red-500 p-1 rounded-lg font-medium"
                @click.prevent="model = undefined"
              >
                <span>Remove file</span>
                <Trash :size="16" :stroke-width="1.5" />
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <h1
            class="font-medium font-secondary text-2xl text-center md:text-left"
          >
            Add a document
          </h1>
          <p class="text-center md:text-left">
            Upload a document you wish to upload
          </p>
          <ul class="mt-6 list-disc pl-5 text-gray-700 text-xs md:text-sm">
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
import useCustomId from "@/composables/useCustomId"
import { FileCheck, Trash } from "lucide-vue-next"
import FormError from "@/components/form/error.vue"
import { computed, onMounted, ref } from "vue"
import { useDocumentStore } from "@/stores/docs"

defineProps<{
  disabled?: boolean
  required?: boolean
  error?: any
}>()

const store = useDocumentStore()
const uploading = computed(() => store.uploading)
const model = defineModel<File | undefined>()
const id = ref()
const input = ref()
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    model.value = target.files[0]
  }
}

onMounted(() => {
  id.value = useCustomId()
})
</script>
