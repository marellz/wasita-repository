<template>
  <div
    class="rounded-xl px-4 flex items-start space-x-2 border border-slate-600/10"
    :class="themes[variant].bg"
  >
    <!-- <icon-component /> -->
    <div class="pt-1.5 pl-0 flex-none">
      <span class="p-1 rounded-full block" :class="themes[variant].color">
        <component :size="24" :stroke-width="1.5" :is="icons[variant]" />
      </span>
    </div>
    <div class="flex-auto pt-2 pb-2">
      <h1
        class="text-lg font-medium font-secondary leading-snug"
        :class="themes[variant].color"
      >
        {{ title }}
      </h1>
      <div class="text-sm">
        <slot></slot>
      </div>
    </div>
    <div class="pt-2" v-if="dismissible">
      <button
        type="button"
        @click="$emit('dismiss')"
        class="p-2 hover:bg-slate-900/20 rounded-full"
      >
        <X />
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AlertCircle, CircleCheck, Info, X } from "lucide-vue-next"
import type { Component } from "vue"

export type AlertVariants = "success" | "info" | "error"
type VariantThemes = {
  [key in AlertVariants]: {
    bg: string
    color: string
  }
}
type VariantIcons = {
  [key in AlertVariants]: Component
}
withDefaults(
  defineProps<{
    variant?: AlertVariants
    dismissible?: boolean
    title?: string
  }>(),
  {
    variant: "info",
    title: "Alert",
  },
)

defineEmits(["dismiss"])

const icons: VariantIcons = {
  error: AlertCircle,
  info: Info,
  success: CircleCheck,
}

const themes: VariantThemes = {
  error: {
    bg: "bg-red-100/50",
    color: "text-red-500",
  },
  info: { bg: "bg-blue-100/50", color: "text-blue-500" },
  success: {
    bg: "bg-green-100/50",
    color: "text-green-500",
  },
}
</script>
