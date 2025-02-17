<template>
  <component :is="layout">
    <router-view />
  </component>
  <analytics />
</template>
<script setup lang="ts">
import { RouterView, useRoute } from "vue-router"
import { computed, type Component } from "vue"
import { Analytics } from "@vercel/analytics/react"
import DefaultLayout from "@/layouts/default.vue"
import AuthLayout from "@/layouts/auth.vue"

type LayoutNames = "default" | "auth"

const layouts: {
  [key in LayoutNames]: Component
} = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const route = useRoute()
const preferredLayout = computed(() => route.meta.layout || "default")
const layout = computed(() => layouts[preferredLayout.value as LayoutNames])
</script>
