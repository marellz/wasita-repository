<template>
  <span class="inline-block font-medium text-xs py-0.5 px-2 rounded-full border text-center" :class="themes[status]">
    <slot />
  </span>
</template>
<script lang="ts" setup>
type TagStatus = "inactive" | "active" | "success" | "warning" | "error";
type TagThemes = {
  [key in TagStatus]: string;
}
withDefaults(defineProps<{
  status?: TagStatus
}>(), {
  status: "inactive"
})

const themes: TagThemes = {
  "inactive": "bg slate-200 text-slate-600 border-slate-200",
  "active": "bg-blue-100 text-blue-500 border-blue-200",
  "success": "bg-green-100 text-green-500 border-green-200",
  "warning": "bg-amber-100 text-amber-600 border-amber-200",
  "error": "bg-red-100 text-red-500 border-red-200",
}
</script>
