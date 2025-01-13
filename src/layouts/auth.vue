<template>
  <div class="h-screen flex flex-col bg-slate-100">
    <header class="py-10">
      <layout-container>
        <div class="flex justify-center">
          <router-link to="/">
            <img src="@/assets/images/logo.svg" class="h-10" alt="">
          </router-link>
        </div>
      </layout-container>
    </header>
    <main class="flex-auto py-4">
      <layout-container>
        <slot />
      </layout-container>
    </main>
    <page-footer></page-footer>
  </div>
</template>
<script lang="ts" setup>
import PageFooter from '@/components/page/footer.vue';
import LayoutContainer from "@/components/layout/container.vue"
</script>
