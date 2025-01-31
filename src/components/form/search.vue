<template>
  <div class="relative">
    <Search
      class="absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none text-gray-300"
    />
    <input
      type="text"
      v-model="model"
      :placeholder
      :disabled
      class="form-input pl-10 placeholder:text-sm"
    />
  </div>
  <!-- border px-3 py-1.5 text-sm rounded-lg bg-transparent placeholder:italic outline-none hover:!bg-black/5 focus:ring focus:ring-offset-1 -->
</template>
<script setup lang="ts">
import { Search } from "lucide-vue-next"

withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: "Search documents",
  },
)
const model = defineModel()
</script>
