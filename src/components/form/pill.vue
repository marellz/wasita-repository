<template>
  <div>
    <input
      type="checkbox"
      :name
      class="absolute h-0 w-0 -z-10"
      :id="`tag-${id}`"
      :value
      v-model="model"
    />
    <label
      :for="`tag-${id}`"
      class="!ml-0 rounded-full inline-flex items-center border space-x-2 transition-all border-slate-500 text-slate-500 px-4 py-1.5 text-sm font-medium font-secondary select-none cursor-pointer hover:border-slate-800 hover:text-slate-800"
      :class="{
        '!border-indigo-600 bg-indigo-600 text-white hover:!border-indigo-600 hover:!text-white !px-2':
          checked,
      }"
    >
      <span>
        {{ label }}
      </span>
      <Check
        :size="16"
        v-show="checked"
        :class="{ 'w-0 invisible': !checked }"
      />
    </label>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from "@/composables/useCustomId"
import { Check } from "lucide-vue-next"
import { computed, onMounted, ref } from "vue"

const props = defineProps<{
  label: string
  name: string
  value: string
}>()

const id = ref()
const model = defineModel<string[]>({ default: [] })

const checked = computed(() => model.value.includes(props.value))

onMounted(() => {
  id.value = useCustomId()
})
</script>
