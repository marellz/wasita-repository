<template>
  <div class="min-h-screen flex flex-col bg-slate-200/50">
    <page-header></page-header>
    <main class="flex-auto pb-20">
      <slot />
    </main>
    <page-footer></page-footer>
    <toast-wrapper></toast-wrapper>
  </div>
</template>
<script lang="ts" setup>
import PageHeader from "@/components/app/header.vue"
import PageFooter from "@/components/app/footer.vue"
import ToastWrapper from "@/components/toast/wrapper.vue"
</script>
<style>
main > div {
  position: relative;
  z-index: 1;
}
</style>
