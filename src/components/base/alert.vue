<template>
  <div class="rounded-xl p-4 flex items-start" :class="themes[variant].bg">
    <!-- <icon-component /> -->
    <div class="p-4 pl-0 flex-none">
      <span class="p-2 rounded-full block" :class="[themes[variant].color, themes[variant].semiBg]">
        <component :size="32" :stroke-width="1.5" :is="icons[variant]" />
      </span>
    </div>
    <div class="flex-auto pt-3">
      <h1 class="text-lg font-bold mb-1" :class="themes[variant].color">
        {{ title }}
      </h1>
      <div class="text-sm">
        <slot></slot>
      </div>
    </div>
    <button type="button" @click="$emit('dismiss')" class="p-2 hover:bg-slate-900/20 rounded-full">
      <X></X>
    </button>
  </div>
</template>
<script lang="ts" setup>
import { AlertCircle, CircleCheck, Info, X } from 'lucide-vue-next';
import type { Component } from 'vue';

type AlertVariants = "success" | "info" | "error"
type VariantThemes = {
  [key in AlertVariants]: {
    bg: string;
    color: string;
    semiBg: string;
  };
}
type VariantIcons = {
  [key in AlertVariants]: Component
}
withDefaults(defineProps<{
  variant?: AlertVariants;
  title?: string;
}>(), {
  variant: "info",
  title: 'Alert',
})

defineEmits(['dismiss'])

const icons: VariantIcons = {
  "error": AlertCircle,
  "info": Info,
  "success": CircleCheck,
}

const themes: VariantThemes = {
  "error": {
    bg: "bg-red-100",
    color: "text-red-500",
    semiBg: "bg-red-500/25",
  },
  "info": { bg: "bg-blue-100", color: "text-blue-500", semiBg: "bg-blue-500/25" },
  "success": { bg: "bg-green-100", color: "text-green-500", semiBg: "bg-green-500/25" },
}
</script>
