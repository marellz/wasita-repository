<template>
  <div class="h-screen flex flex-col">
    <header class="py-5 border-b">
      <layout-container>
        <div class="flex">
          <router-link to="/">
            <img src="@/assets/images/logo.svg" class="h-10" alt="" />
          </router-link>
        </div>
      </layout-container>
    </header>
    <main class="flex-auto pt-10">
      <layout-container>
        <div class="flex items-center justify-center">
          <layout-card class="w-full max-w-md shadow-none">
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
import PageFooter from "@/components/app/footer.vue"
import LayoutContainer from "@/components/layout/container.vue"
import ToastWrapper from "@/components/toast/wrapper.vue"
import LayoutCard from "@/components/layout/card.vue"
</script>
