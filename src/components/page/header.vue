<template>
  <header
    class="py-5 px-2 sticky top-0 after:block after:inset-0 after:absolute after:bg-gradient-to-t after:to-slate-50 from-slate-200 after:z-[-1]"
    :class="{ 'backdrop-blur-md shadow': yScroll > 0 }">
    <Container class="flex items-center relative z-1">
      <router-link to="/">
        <img src="@/assets/images/logo.svg" class="h-10" alt="">
      </router-link>
      <nav class="ml-10 flex flex-auto justify-between">
        <ul class="flex items-center space-x-4 font-medium font-funnel">
          <li v-for="link in _links" :key="link.path">
            <router-link :to="link.path" class="inline-flex items-center space-x-1 border-b-2 py-2 border-b-transparent"
              :class="{ 'text-indigo-600': route.path === link.path }">
              <span>
                {{ link.label }}
              </span>
              <component v-if="link.icon" :is="link.icon" :size="16" />
            </router-link>
          </li>
        </ul>
        <ul v-if="!auth.isAuthenticated" class="flex space-x-4 ml-auto">
          <li v-for="link in guestLinks" :key="link.path">
            <router-link :to="link.path" class="font-funnel font-medium" :class="{ 'text-indigo-600': link.primary }">
              {{ link.label }}
            </router-link>
          </li>
        </ul>
        <div v-else>
          <div class="hidden sm:flex items-center space-x-2 border border-slate-300 rounded-lg py-1 px-2">
            <span class="p-1 bg-slate-200 rounded-full flex-none">
              <user2 :stroke-width="1" :size="28" />
            </span>
            <div>
              <p class="font-medium text-sm">
                {{ auth.user?.name || auth.user?.email }}
              </p>
              <a class="text-xs" href="#logout" @click.prevent="logout">
                Logout
              </a>

            </div>
          </div>
          <div class="flex space-x-4 sm:hidden">
            <button type="button" class="p-2 rounded-full focus:bg-slate-200">
              <User2 :stroke-width="1.5" />
            </button>
            <button type="button" class="p-2 rounded-full focus:bg-slate-200">
              <LogOut :stroke-width="1.5" />
            </button>

          </div>
        </div>
      </nav>
    </Container>
  </header>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { LogOut, User2 } from 'lucide-vue-next';
import { computed, type Component } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core'
import Container from '../layout/container.vue';

const { y: yScroll } = useWindowScroll()

const auth = useAuthStore()

interface Link {
  path: string;
  label: string;
  action?: () => Promise<void>,
  icon?: Component;
  requiresAuth?: boolean;
  primary?: boolean
}

const logout = async () => {
  await auth.logout()
}

const route = useRoute()

const links: Link[] = [
  { path: "/my-files", label: "My files", requiresAuth: true },
  { path: "/about", label: "About" },
]

const _links = computed(() => links.filter(l => l.requiresAuth ? auth.isAuthenticated : true))

const guestLinks: Link[] = [
  { path: "/login", label: 'Login', primary: true },
  { path: "/register", label: 'Register' },
]

</script>
