<template>
  <button
    class="px-3 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-semibold font-secondary rounded-lg transition-colors border inline-flex items-center space-x-2 justify-center relative"
    :type
    :class="themes[variant]"
    :disabled="loading || disabled"
  >
    <slot />
    <base-loader class="absolute right-0" loader-class="h-4" v-if="loading" />
  </button>
</template>
<script lang="ts" setup>
import BaseLoader from "@/components/base/loader.vue"
type BtnVariants =
  | "primary"
  | "secondary"
  | "primary-outline"
  | "secondary-outline"
  | "danger"
type VariantThemes = {
  [key in BtnVariants]: string
}

withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    type?: "submit" | "button" | "reset" | undefined
    variant?: BtnVariants
  }>(),
  {
    variant: "primary",
  },
)

const themes: VariantThemes = {
  primary:
    "text-white border-indigo-600 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:border-gray-700",
  "primary-outline":
    "border-current text-indigo-600 hover:bg-indigo-100 disabled:text-gray-700 disabled:bg-gray-100",
  secondary:
    "text-white border-gray-800 bg-gray-800 hover:bg-gray-700 hover:border-gray-700",
  "secondary-outline":
    "border-current text-slate-800 hover:bg-slate-300 disabled:hover:bg-transparent disabled:text-gray-400",
  danger: "border-red-100 text-red-500 hover:text-white hover:bg-red-500",
}
</script>
