<template>
  <div class="flex rounded-xl w-80 z-10 relative m-4 mb-0 first:!mb-10 items-center border"
    :class="[toastTheme.bg, toastTheme.shadow]">
    <div class="p-3">
      <div class="p-2  flex items-center justify-center rounded-full" :class="toastTheme.color">
        <component :is="toastIcon" :size="24" :stroke-width="1.5" />
      </div>
    </div>
    <div class="flex-auto p-2">
      <h1 class="font-bold" :class="[toastTheme['color']]">{{ toast.title }}</h1>
      <p class="text-sm">{{ toast.description }}</p>
    </div>
    <button type="button" class="p-2 rounded-full m-2" :class="toastTheme.color" @click="$emit('close', toast.id)">
      <x :size="20" />
    </button>
  </div>
</template>
<script lang="ts" setup>
import type { Toast, ToastVariant } from "@/stores/toasts";
import { Check, CircleAlert, Info } from "lucide-vue-next";
import { X } from "lucide-vue-next";
import { computed } from "vue";
const props = defineProps<{
  toast: Toast;
}>();

defineEmits(["close"]);

const defaultVariant: ToastVariant = "info"

interface Theme {
  bg: string;
  color: string;
  shadow: string;
}

interface Themes {
  success: Theme;
  info: Theme;
  error: Theme;
}

const icons = {
  success: Check,
  info: Info,
  error: CircleAlert,
};

const themes: Themes = {
  success: { bg: "bg-green-100", color: "text-green-500", shadow: "border-green-200" },
  info: { bg: "bg-blue-100", color: "text-blue-500", shadow: "border-blue-200" },
  error: { bg: "bg-red-100", color: "text-red-500", shadow: "border-red-200" },
};

const toastTheme = computed(() => {
  const v = props.toast.variant || defaultVariant;
  return themes[v as keyof Themes];
});

const toastIcon = computed(() => {
  return icons[props.toast.variant || defaultVariant];
});
</script>
