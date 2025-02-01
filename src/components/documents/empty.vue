<template>
  <div
    class="bg-white shadow-xl rounded-xl p-4 md:p-8 flex flex-col md:flex-row items-center lg:items-start justify-center gap-8 md:gap-12 py-10 md:py-14"
  >
    <img
      class="max-w-xs w-full"
      src="@/assets/images/undraw_server-push_1lbi.svg"
      alt=""
    />
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold font-secondary leading-tight">
          Your repository is ready
        </h1>
        <p
          class="font-medium font-secondary text-sm sm:text-base mt-1 text-slate-600"
        >
          but it’s feeling a little empty.
        </p>
      </div>
      <p class="font-light text-sm sm:text-base">
        Start uploading important documents to keep everything organized and
        accessible for your family. With everything in one place, you'll never
        have to dig through endless conversations again.
      </p>
      <div class="flex items-center space-x-3">
        <template v-if="auth.isAuthenticated">
          <router-link to="/create">
            <base-button variant="primary-outline">
              <span>Create document</span>
              <Plus />
            </base-button>
          </router-link>
        </template>
        <template v-else>
          <RouterLink to="/login">
            <base-button>
              <span>Login</span>
            </base-button>
          </RouterLink>
          <span class="text-sm font-medium px-2">or</span>
          <RouterLink to="/register">
            <base-button variant="primary-outline">
              <span>Create a new account</span>
            </base-button>
          </RouterLink>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth"
import BaseButton from "@/components/base/button.vue"
import { Plus } from "lucide-vue-next"
const auth = useAuthStore()
</script>
