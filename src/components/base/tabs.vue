<template>
  <div class="flex flex-col md:flex-row items-center space-y-3 md:space-x-3">
    <ul class="border border-slate-400 p-2 rounded-lg flex overflow-auto max-w-full">
      <li v-for="{ label, key } in tabs" :key="key">
        <a :href="`#${key}`" class="text-slate-500 text-sm px-3 py-1.5 font-medium hover:bg-slate-100 rounded whitespace-nowrap"
          :class="{ '!text-black': active === key }" @click.prevent="active = key">
          {{ label }}
        </a>
      </li>
    </ul>
    <slot name="nav"></slot>
  </div>
  <div class="mt-10">
    <slot :name="active"></slot>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

interface Tab {
  key: string,
  label: string;
}

const props = defineProps<{
  tabs: Tab[],
  default?: string
}>()

const active = ref<string>(props.default ?? props.tabs[0].key)

const emit = defineEmits(['change']);

watch(active, (v) => {
  emit('change', v)
})

onMounted(() => {
  if (!props.default && props.tabs.length) {
    active.value = props.tabs[0].key
  }
})
</script>
