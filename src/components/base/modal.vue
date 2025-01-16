<template>
  <div class="fixed bg-black/10 inset-0 z-10 flex justify-center items-start p-4 backdrop-blur-sm overflow-auto"
    :class="{ 'hidden opacity-0': !show }">
    <layout-card ref="modal" class="w-full" :class="width">
      <div class="flex items-center">
        <slot name="header">
          <div>
            <h1 class="text-2xl font-bold">{{ title }}</h1>
          </div>
        </slot>
        <button type="button" class="hover:bg-black/10 p-2 rounded-full ml-auto" @click="close">
          <X :size="24"></X>
        </button>
      </div>
      <div class="py-5">
        <slot></slot>
      </div>
    </layout-card>
  </div>
</template>
<script lang="ts" setup>
import LayoutCard from '@/components/layout/card.vue';
import { onClickOutside } from "@vueuse/core";
import { X } from "lucide-vue-next";
import { ref, watch } from "vue"
const emit = defineEmits(['close'])
withDefaults(
  defineProps<{
    title?: string;
    width?: string;
  }>(),
  {
    width: "max-w-2xl",
  }
);

const show = defineModel("show", { default: false });
const close = () => {
  show.value = false;
  emit('close')
};

const modal = ref();

onClickOutside(modal, close);

watch(show, (v) => {
  const w = document.body.classList;
  if (v) {
    w.add("overflow-hidden")
  } else {
    w.remove("overflow-hidden");
  }
});
</script>
