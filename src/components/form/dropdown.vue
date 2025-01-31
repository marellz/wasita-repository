<template>
  <div v-if="loading" class="py-4 text-center">
    <base-loader></base-loader>
  </div>
  <div v-else ref="dropdown" class="relative">
    <div class="relative">
      <input
        type="text"
        :placeholder
        v-model="query"
        :disabled="loading"
        @focus="active = true"
        class="form-input pr-10 placeholder:text-sm"
        :class="{
          'border-indigo-600 bg-indigo-100 placeholder:text-indigo-500 placeholder:text-':
            hasValues,
        }"
      />
      <div class="absolute right-2 top-1/2 -translate-y-1/2">
        <button
          type="button"
          class="p-2 rounded transform transition-all"
          @click="active = !active"
        >
          <ChevronDown :class="{ 'rotate-180 text-indigo-600': active }" />
        </button>
      </div>
    </div>

    <div
      v-show="active"
      class="overflow-auto max-h-56 p-2 border rounded-xl mt-2 absolute top-full w-full bg-white z-10"
    >
      <ul v-if="options.length" class="space-y-1">
        <li v-for="(option, index) in options" :key="index">
          <div class="flex items-center" :class="{ 'space-x-2': !hideInput }">
            <input
              class="flex-none"
              :class="{ 'absolute h-0 w-0 -z-20': hideInput }"
              type="checkbox"
              :name="`dropdown-${id}`"
              :id="`${id}-${index}`"
              :value="option[valueKey] || ''"
              v-model="model"
            />
            <label
              class="flex-auto flex items-center space-x-2 rounded-lg hover:bg-indigo-50 p-2"
              :class="[
                {
                  'bg-indigo-100 text-indigo-600': model.includes(
                    option[valueKey],
                  ),
                },
                labelClass,
              ]"
              :for="`${id}-${index}`"
            >
              <slot name="item" :item="option">
                <div class="text-sm font-medium font-secondary">
                  <p>
                    {{ option[labelKey] || "Unknown" }}
                  </p>
                </div>
              </slot>
              <div v-if="model.includes(option[valueKey])" class="!ml-auto">
                <Check :size="20" />
              </div>
            </label>
          </div>
        </li>
      </ul>
      <div v-else>
        <div
          class="text-slate-500 p-2 text-sm rounded-lg bg-slate-100 hover:bg-indigo-50"
        >
          <span class="font-medium text-slate-700">No options.</span>
          <span> Weird parameters or there is an error somewhere... </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from "@/composables/useCustomId"
import BaseLoader from "@/components/base/loader.vue"
import { computed, onMounted, ref, watch } from "vue"
import { Check, ChevronDown } from "lucide-vue-next"
import { onClickOutside } from "@vueuse/core"

type Option = Record<string, any>
type Options = Option[]
withDefaults(
  defineProps<{
    options: Options
    valueKey?: string
    labelKey?: string
    placeholder?: string
    loading?: boolean
    hideInput?: boolean
    labelClass?: string
  }>(),
  {
    valueKey: "key",
    labelKey: "label",
  },
)
const id = ref()
const query = ref("")
const dropdown = ref()
const active = ref(false)
const emit = defineEmits(["query"])
const model = defineModel<any[]>({ default: [] })

const hasValues = computed(() => model.value.length > 0)

watch(query, () => {
  emit("query", query.value)
})

onMounted(() => {
  id.value = useCustomId()
})

onClickOutside(dropdown, () => {
  active.value = false
})
</script>
