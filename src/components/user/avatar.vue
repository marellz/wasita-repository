<template>
  <img
    v-if="avatar"
    class="object-center object-cover rounded-full border-2"
    :class="sizes[size]"
    :src="avatar"
    alt=""
  />
  <span
    v-else
    class="rounded-full border-2 border-white/10 bg-white/20 inline-flex items-center justify-center"
    :class="sizes[size]"
  >
    <User2 :size="30" :stroke-width="1" />
  </span>
</template>
<script lang="ts" setup>
import { User2 } from "lucide-vue-next"
type sizes = "lg" | "md" | "sm"
type sizeClasses = {
  [key in sizes]: string
}
withDefaults(
  defineProps<{
    avatar: string | null | undefined
    size?: sizes
  }>(),
  {
    size: "md",
  },
)

const sizes: sizeClasses = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-16 w-16",
}
</script>
