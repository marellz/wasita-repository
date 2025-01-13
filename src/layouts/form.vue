<template>
  <div class="h-screen flex flex-col">
    <page-header></page-header>
    <main class="flex-auto py-4">
      <slot />
    </main>
    <page-footer></page-footer>
  </div>
</template>
<script lang="ts" setup>
import PageHeader from '@/components/page/header.vue';
import PageFooter from '@/components/page/footer.vue';
</script>
