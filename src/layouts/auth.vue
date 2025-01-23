<template>
  <div class="h-screen flex flex-col bg-slate-200">
    <header class="py-10">
      <layout-container>
        <div class="flex justify-center">
          <router-link to="/">
            <img src="@/assets/images/logo.svg" class="h-10" alt="" />
          </router-link>
        </div>
      </layout-container>
    </header>
    <main class="flex-auto py-4">
      <layout-container>
        <div class="flex items-center justify-center">
          <layout-card class="w-full max-w-md border border-slate-300">
            <slot />
          </layout-card>
        </div>
      </layout-container>
    </main>
    <page-footer></page-footer>
    <toast-wrapper></toast-wrapper>
  </div>
</template>
<script lang="ts" setup>
import PageFooter from "@/components/page/footer.vue"
import LayoutContainer from "@/components/layout/container.vue"
import ToastWrapper from "@/components/toast/wrapper.vue"
import LayoutCard from "@/components/layout/card.vue"
</script>
