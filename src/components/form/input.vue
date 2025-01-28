<template>
  <div>
    <form-label v-if="label" :for="id">
      {{ label }}
      <span v-if="required">&ast;</span>
    </form-label>
    <div class="relative">
      <input
        :name
        class="form-input"
        :class="[{ 'is-invalid': error }, inputClass]"
        v-model="model"
        :type="inputType"
        :id
        :placeholder
        :disabled
        :required
        :autocomplete
        ref="input"
      />
      <button
        class="p-1 rounded absolute right-2 top-1/2 -translate-y-1/2 transition-all"
        :class="{ 'opacity-50': !showPassword }"
        type="button"
        v-if="type === 'password' && allowPasswordToggle"
        :disabled="type !== 'password' && !allowPasswordToggle"
        @click="toggleInputType"
      >
        <Eye v-if="showPassword" />
        <EyeClosed v-else />
      </button>
    </div>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script setup lang="ts">
import useCustomId from "@/composables/useCustomId"
import FormLabel from "@/components/form/label.vue"
import FormError from "@/components/form/error.vue"
import { computed, onMounted, ref } from "vue"
import { Eye, EyeClosed } from "lucide-vue-next"

const props = withDefaults(
  defineProps<{
    label?: string | undefined
    error?: string | undefined
    type?: string | undefined
    name?: string | undefined
    placeholder?: string | undefined
    disabled?: boolean
    required?: boolean
    autocomplete?: string
    novalidate?: boolean
    inputClass?: string
    allowPasswordToggle?: boolean
  }>(),
  {
    type: "text",
  },
)

const id = ref()

const model = defineModel<string | null | undefined>()

const input = ref<HTMLInputElement | null>(null)

const inputType = ref(props.type)
const toggleInputType = () => {
  if (props.type !== "password") {
    return
  }

  inputType.value = inputType.value === "password" ? "text" : "password"
}
const showPassword = computed(() => inputType.value === "text")

onMounted(() => {
  if (input.value?.hasAttribute("autofocus")) {
    input.value?.focus()
  }

  id.value = useCustomId()
})

defineExpose({ focus: () => input.value?.focus() })
</script>
