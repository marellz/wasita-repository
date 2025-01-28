<template>
  <Hero title="Documents" subtitle="All documents">
    <template #actions>
      <div class="ml-auto">
        <router-link to="/create" v-if="isAuthenticated">
          <base-button variant="primary-outline">
            <span>Create document</span>
            <Plus />
          </base-button>
        </router-link>
      </div>
    </template>
  </Hero>
  <LayoutContainer>
    <all-documents />
  </LayoutContainer>
</template>
<script setup lang="ts">
import LayoutContainer from "@/components/layout/container.vue"
import Hero from "@/components/layout/hero.vue"
import AllDocuments from "@/components/documents/_all.vue"
import BaseButton from "@/components/base/button.vue"
import { Plus } from "lucide-vue-next"
import { useAuthStore } from "@/stores/auth"

const { isAuthenticated } = useAuthStore()
</script>
