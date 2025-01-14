<template>
  <header class="py-5 bg-slate-100">
    <layout-container class="flex items-center">
      <router-link to="/">
        <img src="@/assets/images/logo.svg" class="h-10" alt="">
      </router-link>
      <nav class="ml-10 flex flex-auto justify-between">
        <ul class="flex items-center space-x-4">
          <li v-for="link in links" :key="link.path">
            <router-link :to="link.path" class="inline-flex items-center space-x-1">
              <span>
                {{ link.label }}
              </span>
              <component v-if="link.icon" :is="link.icon" :size="16" />
            </router-link>
          </li>
        </ul>
        <ul v-if="!auth.isAuthenticated" class="flex space-x-4 ml-auto">
          <li v-for="link in guestLinks" :key="link.path">
            <router-link :to="link.path">
              {{ link.label }}
            </router-link>
          </li>
        </ul>
        <div v-else>
          <p class="font-medium">
            {{ auth.user?.user_metadata.email }}
          </p>
          <a class="text-sm" href="#logout" @click.prevent="logout">
            Logout
          </a>
        </div>
      </nav>
    </layout-container>
  </header>
</template>
<script lang="ts" setup>
import LayoutContainer from '@/components/layout/container.vue';
import { useAuthStore } from '@/stores/auth';
import { Plus } from 'lucide-vue-next';
import { type Component } from 'vue';
const auth = useAuthStore()
interface Link {
  path: string;
  label: string;
  action?: () => Promise<void>,
  icon?: Component
}

const logout = async () => {
  await auth.logout()
}

const links: Link[] = [
  { path: "/about", label: "About" },
  { path: "/submit", label: "Create a new document", icon: Plus },
]

const guestLinks: Link[] = [
  { path: "/login", label: 'Login' },
  { path: "/register", label: 'Register' },
]


</script>
