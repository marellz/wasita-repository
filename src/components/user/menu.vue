<template>
  <div class="flex items-center space-x-2 mt-auto" ref="target">
    <!-- rail -->
    <div class="h-12 overflow-hidden">
      <div
        class="transform translate-y-0 transition-all duration-75"
        :class="{ '!-translate-y-12': active }"
      >
        <!-- layer 1 -->
        <div class="flex items-center space-x-2 h-12">
          <user-avatar size="sm" :avatar="auth.user?.avatar_url" />
          <div>
            <p class="font-medium text-xl font-secondary">
              {{ auth.user?.name || auth.user?.email }}
            </p>
          </div>
        </div>

        <!-- layer-2 -->
        <div class="flex items-center justify-end space-x-2 h-12">
          <a
            class="text-xl font-secondary font-medium hover:text-red-600"
            href="#logout"
            @click.prevent="logout"
          >
            Logout
          </a>
          <span> &bull; </span>
          <router-link
            to="/profile"
            class="text-xl font-secondary font-medium hover:text-indigo-600"
          >
            Profile
          </router-link>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="p-1 rounded-xl bg-slate-200/10"
      @click="active = !active"
    >
      <ChevronDown :class="{ 'transform rotate-180': active }" />
    </button>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from "@/components/user/avatar.vue"
import { useAuthStore } from "@/stores/auth"
import { onClickOutside } from "@vueuse/core"
import { ChevronDown } from "lucide-vue-next"
import { ref } from "vue"

const auth = useAuthStore()

const logout = async () => {
  if (confirm("Are you sure you want to log out?")) await auth.logout()
}

const active = ref(false)
const target = ref()
onClickOutside(target, () => {
  active.value = false
})
</script>
