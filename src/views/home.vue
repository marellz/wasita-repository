<template>
  <Hero title="Documents" subtitle="All documents">
    <template #actions>
      <div class="ml-auto flex space-x-2">
        <base-button
          variant="white-outline"
          :class="{ 'bg-white !text-black': showFilters }"
          @click="toggleFilters"
        >
          <span>Filters</span>
          <Settings2 />
        </base-button>
        <router-link to="/create" v-if="isAuthenticated">
          <base-button variant="primary-outline">
            <span>Create document</span>
            <Plus />
          </base-button>
        </router-link>
      </div>
    </template>
  </Hero>
  <LayoutContainer class="space-y-10">
    <all-documents :show-filters @hide-filters="hideFilters" />
  </LayoutContainer>
</template>
<script setup lang="ts">
import LayoutContainer from "@/components/layout/container.vue"
import Hero from "@/components/layout/hero.vue"
import AllDocuments from "@/components/documents/_all.vue"
import BaseButton from "@/components/base/button.vue"
import { Plus, Settings2 } from "lucide-vue-next"
import { useAuthStore } from "@/stores/auth"
import { inject, ref } from "vue"

const { isAuthenticated } = useAuthStore()

const showFilters = ref(false)
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const hideFilters = () => {
  showFilters.value = false
}

inject("filters", {
  hideFilters,
})
</script>
