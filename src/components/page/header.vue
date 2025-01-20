<template>
  <header
    class="py-5 px-2 sticky top-0 after:block after:inset-0 after:absolute after:bg-gradient-to-t after:to-slate-50 from-slate-200 after:z-[-1]"
    :class="{ 'backdrop-blur-md shadow': yScroll > 0 }"
  >
    <Container class="flex items-center relative z-1">
      <router-link to="/">
        <img src="@/assets/images/logo.svg" class="h-10" alt="" />
      </router-link>
      <nav class="ml-6 md:ml-10 flex flex-auto items-center justify-between">
        <ul class="flex items-center space-x-4 font-medium font-secondary">
          <li v-for="link in _links" :key="link.path">
            <router-link
              :to="link.path"
              class="inline-flex items-center space-x-1 border-b-2 py-1.5 border-b-transparent"
              :class="{ 'text-indigo-600': route.path === link.path }"
            >
              <span>
                {{ link.label }}
              </span>
              <component v-if="link.icon" :is="link.icon" :size="16" />
            </router-link>
          </li>
        </ul>
        <ul
          v-if="!auth.isAuthenticated"
          class="flex space-x-4 items-center ml-auto"
        >
          <li v-for="link in guestLinks" :key="link.path">
            <router-link
              :to="link.path"
              class="font-secondary font-medium flex items-center p-2 rounded md:space-x-2 hover:bg-slate-200"
              :class="{ 'text-indigo-600 hover:!bg-indigo-100': link.primary }"
            >
              <span class="hidden md:block">
                {{ link.label }}
              </span>
              <component :is="link.icon" />
            </router-link>
          </li>
        </ul>
        <div v-else>
          <div
            class="hidden sm:flex items-center space-x-2 border border-slate-300 rounded-lg py-1 px-2"
          >
            <img
              v-if="auth.user?.avatar_url"
              :src="auth.user.avatar_url"
              class="h-12 w-12 rounded-full object-cover object-center"
            />
            <span
              v-else
              class="h-12 w-12 inline-flex items-center justify-center bg-slate-200 rounded-full flex-none"
            >
              <user2 :stroke-width="1" :size="28" />
            </span>
            <div>
              <p class="font-medium text-sm">
                {{ auth.user?.name || auth.user?.email }}
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <a
                  class="text-xs hover:text-red-600"
                  href="#logout"
                  @click.prevent="logout"
                >
                  Logout
                </a>
                <span> &bull; </span>
                <router-link
                  to="/profile"
                  class="text-xs hover:text-indigo-600"
                >
                  Profile
                </router-link>
              </div>
            </div>
          </div>
          <div class="flex space-x-4 sm:hidden">
            <router-link to="/profile">
              <button type="button" class="p-2 rounded-full focus:bg-slate-200">
                <User2 :stroke-width="1.5" />
              </button>
            </router-link>

            <button
              type="button"
              class="p-2 rounded-full focus:bg-slate-200"
              @click="logout"
            >
              <LogOut :stroke-width="1.5" />
            </button>
          </div>
        </div>
      </nav>
    </Container>
  </header>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth"
import { LogIn, LogOut, User2, UserPlus2 } from "lucide-vue-next"
import { computed, type Component } from "vue"
import { useRoute } from "vue-router"
import { useWindowScroll } from "@vueuse/core"
import Container from "../layout/container.vue"

const { y: yScroll } = useWindowScroll()

const auth = useAuthStore()

interface Link {
  path: string
  label: string
  action?: () => Promise<void>
  icon?: Component
  requiresAuth?: boolean
  primary?: boolean
}

const logout = async () => {
  if (confirm("Are you sure you want to log out?")) await auth.logout()
}

const route = useRoute()

const links: Link[] = [
  { path: "/my-files", label: "My files", requiresAuth: true },
  { path: "/about", label: "About" },
]

const _links = computed(() =>
  links.filter((l) => (l.requiresAuth ? auth.isAuthenticated : true)),
)

const guestLinks: Link[] = [
  { path: "/login", label: "Login", primary: true, icon: LogIn },
  { path: "/register", label: "Register", icon: UserPlus2 },
]
</script>
