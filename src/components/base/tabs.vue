<template>
  <div
    class="flex flex-col md:flex-row md:items-center space-y-3 md:space-x-3 md:space-y-0"
  >
    <ul
      class="py-1.5 md:p-2 rounded-lg flex overflow-auto max-w-full space-x-2"
    >
      <li v-for="{ label, key } in tabs" :key="key">
        <a
          :href="`#${key}`"
          class="text-xs md:text-sm px-2 md:px-3 py-1.5 font-secondary font-medium text-white/25 hover:bg-slate-200/20 hover:text-white rounded-lg whitespace-nowrap"
          :class="{ '!text-white bg-black hover:bg-black': active === key }"
          @click.prevent="active = key"
        >
          {{ label }}
        </a>
      </li>
    </ul>
    <slot name="nav"></slot>
  </div>
  <div class="mt-4">
    <slot :name="active"></slot>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"

interface Tab {
  key: string
  label: string
}

const props = defineProps<{
  tabs: Tab[]
  default?: string
}>()

const active = ref<string>(props.default ?? props.tabs[0].key)

const emit = defineEmits(["change"])

watch(active, (v) => {
  emit("change", v)
})

onMounted(() => {
  if (!props.default && props.tabs.length) {
    active.value = props.tabs[0].key
  }
})
</script>
