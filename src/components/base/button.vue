<template>
  <!--<button class="inline-flex space-x-2 text-sm font-medium px-2 py-1 rounded" :type
    :disabled="loading || disabled"> -->
  <button class="px-4 text-white font-medium py-2 rounded-lg transition-colors border border-transparent" :type
    :class="themes[variant]" :disabled="loading || disabled">
    <slot />
    <custom-loader v-if="loading" />
  </button>
</template>
<script lang="ts" setup>
type BtnVariants = "primary" | "secondary" | "primary-outline" | "secondary-outline"

type VariantThemes = {
  [key in BtnVariants]: string;
}

withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: boolean;
    type?: "submit" | "button" | "reset" | undefined;
    variant?: BtnVariants
  }>(), {
  variant: "primary"
}
);

const themes: VariantThemes = {
  "primary": "bg-indigo-600 hover:bg-indigo-700",
  "primary-outline": "border-indigo-600 text-indigo-600",
  "secondary": "bg-gray-800 hover:bg-indigo-800",
  "secondary-outline": "border-gray-600 text-gray-800",
}

</script>
