<template>
  <div
    class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 py-10"
  >
    <img
      class="max-w-sm w-full"
      src="@/assets/images/undraw_server-push_1lbi.svg"
      alt=""
    />
    <div class="space-y-4">
      <h1 class="text-3xl font-medium leading-snug">
        Your repository is ready, but it’s feeling a little empty.
      </h1>
      <p>
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
