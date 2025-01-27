<template>
  <form @submit.prevent="submit">
    <div class="flex items-start space-x-2">
      <div class="flex border-b space-x-2 py-2">
        <Search :size="20" class="text-slate-400" />
        <input
          class="outline-none focus:outline-none text-sm"
          type="text"
          v-model="query"
          placeholder="Search"
          id="filter-search"
        />
      </div>
      <button
        class="py-1.5 px-2 inline-flex font-medium font-secondary space-x-2 items-center rounded-lg bg-slate-100 hover:bg-black hover:text-white"
      >
        <span>Apply</span>
        <CheckCheck />
      </button>
    </div>
  </form>
</template>
<script lang="ts" setup>
// import FormInput from "@/components/form/input.vue"
import { CheckCheck, Search } from "lucide-vue-next"
import { ref } from "vue"

const emit = defineEmits(["submit"])

const query = ref("")

const submit = () => {
  const payload = {
    query: query.value,
  }
  console.log("submitting", payload)
  emit("submit", payload)
}
</script>
