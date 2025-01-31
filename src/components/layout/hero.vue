<template>
  <div
    class="py-4 md:py-10 bg-black text-white after:h-20 after:bg-black after:absolute after:block after:top-full after:w-full relative after:z-[-2]"
  >
    <Container>
      <div
        class="flex flex-col items-start md:flex-row md:justify-between bg-black space-y-4 md:space-y-0"
      >
        <div>
          <h1
            v-if="title"
            class="text-2xl md:text-3xl font-bold font-secondary"
          >
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-gray-500 text-sm md:text-base">
            {{ subtitle }}
          </p>
        </div>

        <slot name="actions" />
      </div>
    </Container>
    <slot />
  </div>
</template>
<script lang="ts" setup>
import Container from "@/components/layout/container.vue"
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
