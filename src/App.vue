<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, type Component } from 'vue'

import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/auth.vue'
import FormLayout from '@/layouts/form.vue'

type LayoutNames = "default" | "auth" | "form"

const layouts: {
  [key in LayoutNames]: Component;
} = {
  "default": DefaultLayout,
  "auth": AuthLayout,
  "form": FormLayout,
}

const route = useRoute()
const preferredLayout = computed(() => route.meta.layout || 'default')
const layout = computed(() => layouts[preferredLayout.value as LayoutNames])
</script>
