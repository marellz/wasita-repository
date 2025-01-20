<template>
  <div>
    <form-label v-if="label" :for="id">
      {{ label }}
      <span v-if="required">&ast;</span>
    </form-label>
    <div>
      <input
        :name
        class="form-input"
        :class="{ 'is-invalid': error }"
        v-model="model"
        :type
        :id
        :placeholder
        :disabled
        :required
        ref="input"
      />
    </div>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script setup lang="ts">
import useCustomId from "@/composables/useCustomId"
import FormLabel from "@/components/form/label.vue"
import FormError from "@/components/form/error.vue"
import { onMounted, ref } from "vue"

withDefaults(
  defineProps<{
    label?: string | undefined
    error?: string | undefined
    type?: string | undefined
    name?: string | undefined
    placeholder?: string | undefined
    disabled?: boolean
    required?: boolean
    novalidate?: boolean
  }>(),
  {
    type: "text",
  },
)

const id = ref()

const model = defineModel<string | null | undefined>()

const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (input.value?.hasAttribute("autofocus")) {
    input.value?.focus()
  }

  id.value = useCustomId()
})

defineExpose({ focus: () => input.value?.focus() })
</script>
