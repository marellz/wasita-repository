<template>
  <label :for="id" class="flex items-cente">
    <input
      class="invisible h-0 w-0 absolute -z-10"
      type="checkbox"
      v-model="model"
      :value
      :required
      :disabled
      :name
      :id
    />

    <div
      class="flex flex-auto items-start space-x-2 border border-gray-300 rounded-lg p-2 select-none"
      :class="{
        'border-indigo-600': checked,
        'bg-gray-200 border-gray-200': disabled,
      }"
    >
      <span
        class="text-gray-300"
        :class="{ '!text-indigo-600': checked, 'text-gray-500': disabled }"
      >
        <CheckCircle2 :size="24" stroke-width="1.5" />
      </span>
      <div>
        <h1
          class="font-medium font-secondary"
          :class="{ 'text-indigo-600': checked, 'text-gray-500': disabled }"
        >
          {{ label }}
        </h1>
        <p class="text-sm text-slate-500">{{ subtitle }}</p>
      </div>
    </div>
  </label>
</template>
<script lang="ts" setup>
import useCustomId from "@/composables/useCustomId"
import { CheckCircle2 } from "lucide-vue-next"
import { computed, onMounted, ref } from "vue"
withDefaults(
  defineProps<{
    name?: string
    disabled?: boolean
    required?: boolean
    value?: string | number | boolean
    label: string
    subtitle?: string
  }>(),
  {
    value: true,
  },
)

const id = ref()
const model = defineModel()
const checked = computed(() => model.value)
onMounted(() => {
  id.value = useCustomId()
})
</script>
