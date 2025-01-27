<template>
  <div>
    <form-label v-if="label" :for="id">
      {{ label }}
      <span v-if="required">&ast;</span>
    </form-label>
    <div>
      <select
        class="form-input bg-white"
        :class="[{ 'is-invalid': error }, inputClass]"
        v-model="model"
        :id
        :disabled
        :required
        ref="input"
      >
        <option :value="null" :disabled="required">{{ placeholder }}</option>
        <slot></slot>
      </select>
    </div>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script setup lang="ts">
import FormLabel from "@/components/form/label.vue"
import FormError from "@/components/form/error.vue"
import useCustomId from "@/composables/useCustomId"
import { onMounted, ref } from "vue"

withDefaults(
  defineProps<{
    label?: string | undefined
    error?: string | undefined
    type?: string | undefined
    placeholder?: string
    disabled?: boolean
    required?: boolean
    inputClass?: string
  }>(),
  {
    type: "text",
    placeholder: "Select option",
  },
)

const id = ref()

const model = defineModel<string | null | undefined>({
  required: true,
  default: null,
})

const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (input.value?.hasAttribute("autofocus")) {
    input.value?.focus()
  }

  id.value = useCustomId()
})

defineExpose({ focus: () => input.value?.focus() })
</script>
