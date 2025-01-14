<template>
  <div class="h-screen flex flex-col">
    <page-header></page-header>
    <main class="flex-auto py-4">
      <slot />
    </main>
    <page-footer></page-footer>
    <toast-wrapper></toast-wrapper>
  </div>
</template>
<script lang="ts" setup>
import PageHeader from '@/components/page/header.vue';
import PageFooter from '@/components/page/footer.vue';
import ToastWrapper from '@/components/toast/wrapper.vue';
</script>
