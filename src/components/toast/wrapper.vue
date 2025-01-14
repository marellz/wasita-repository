<template>
  <transition-group tag="ul" name="toasts"
    class="fixed z-20 h-1 bottom-0 left-0 w-full flex flex-col-reverse items-center space-y-4">
    <toast-item :toast :key="toast.id" v-for="toast in toasts" @close="toastStore.remove(toast.id)" />
  </transition-group>
</template>
<script lang="ts" setup>
import ToastItem from '@/components/toast/item.vue';
import { useToastsStore } from "@/stores/toasts";
import { computed } from "vue";

const toastStore = useToastsStore();
const toasts = computed(() => toastStore.toasts);
</script>
<style>
.toasts-enter-to,
.toasts-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.toasts-enter-from,
.toasts-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.toasts-leave-to {
  transform: translateT(50%);
}

.toasts-leave-active,
.toasts-enter-active {
  transition: all 0.15s ease;
}

.toasts-move {
  transition-delay: 0.05s;
  position: absolute;
}
</style>
