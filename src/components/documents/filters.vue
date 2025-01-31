<template>
  <form @submit.prevent="submit">
    <div class="rounded-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <h1 class="font-medium font-secondary text-lg">Filters</h1>
        <div class="flex items-center space-x-2 ml-auto">
          <button
            type="button"
            class="py-1 px-2 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded inline-flex space-x-2 text-sm font-medium font-secondary"
            @click="hideFilters"
          >
            <span>Hide</span>
            <X :size="20" />
          </button>
          <button
            type="button"
            class="py-1 px-2 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded inline-flex space-x-2 text-sm font-medium font-secondary"
            @click="resetFilters"
          >
            <span>Clear filters</span>
            <Undo2 :size="20" />
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(item, i) in mappedFilters"
          :key="i"
          class="text-sm border rounded-lg px-4 py-1.5"
        >
          <p class="text-xs text-slate-400">
            {{ i }}
          </p>
          <p class="font-medium font-secondary" v-if="typeof item === 'string'">
            {{ item }}
          </p>
          <div v-else class="flex flex-wrap items-center gap-x-1">
            <span
              class="font-medium font-secondary"
              v-for="(_k, i2) in item"
              :key="i2"
            >
              {{ _k }}<template v-if="i2 < item.length - 1">,</template>
            </span>
          </div>
        </div>
      </div>
      <div class="grid sm:grid-col-2 md:grid-cols-4 items-center gap-4">
        <form-search v-model="filters.query" placeholder="Search" />
        <form-dropdown
          v-model="filters.tags"
          :options="tags"
          :placeholder="
            filters.tags.length
              ? `Tags (${filters.tags.length})`
              : 'Select tags'
          "
          value-key="slug"
          label-key="name"
        ></form-dropdown>
        <form-dropdown
          v-model="filters.categories"
          :options="categories"
          :placeholder="
            filters.categories.length
              ? `Categories (${filters.categories.length})`
              : 'Select categories'
          "
          value-key="slug"
          label-key="name"
        ></form-dropdown>
        <base-button variant="secondary-outline">
          <span>Apply</span>
          <CheckCheck />
        </base-button>
      </div>
    </div>
  </form>
</template>
<script lang="ts" setup>
import FormSearch from "@/components/form/search.vue"
import FormDropdown from "@/components/form/dropdown.vue"
import BaseButton from "@/components/base/button.vue"

import { CheckCheck, Undo2, X } from "lucide-vue-next"
import { computed, onMounted, ref } from "vue"
import { useTagStore } from "@/stores/tags"
import { useCategoryStore } from "@/stores/categories"
import { useDocumentStore } from "@/stores/documents"

export interface Filters {
  tags: string[]
  categories: string[]
  query: string
}

const emit = defineEmits(["submit", "hide-filters"])

const emptyFilters = {
  query: "",
  tags: [],
  categories: [],
}

const filters = ref<Filters>({ ...emptyFilters })

const mappedFilters = computed(() => {
  const obj: Record<string, string | string[]> = {}
  if (filters.value.query) {
    obj["Search query"] = filters.value.query
  }

  if (filters.value.tags.length) {
    obj.Tags = tags.value
      .filter((t) => filters.value.tags.includes(t.slug))
      .map((t) => t.name)
  }

  if (filters.value.categories.length) {
    obj.Categories = categories.value
      .filter((c) => filters.value.categories.includes(c.slug))
      .map((c) => c.name)
  }

  return obj
})

const store = useDocumentStore()

const submit = () => {
  store.updateFilters(filters.value)
}

const hideFilters = () => {
  emit("hide-filters")
}

const tagStore = useTagStore()
const categoryStore = useCategoryStore()

const tags = computed(() => tagStore.tags)
const categories = computed(() => categoryStore.categories)

const resetFilters = () => {
  store.resetFilters()
}

onMounted(tagStore.getTags)
onMounted(categoryStore.getCategories)
</script>
