<template>
  <header
    class="fixed w-full h-full md:h-auto py-1 px-2 md:sticky top-0 bg-black text-white transform md:transform-none -translate-x-full transition duration-150 ease-in-out z-20"
    :class="{ shadow: yScroll > 0, '!translate-x-0': show }"
  >
    <Container class="relative z-1 h-full">
      <nav
        class="flex flex-col h-full p-10 md:p-2 md:flex-row md:items-center md:justify-between"
      >
        <div
          class="py-10 flex items-center justify-between space-x-4 md:hidden"
        >
          <p class="text-3xl font-secondary font-semibold text-slate-100/50">
            Menu
          </p>
          <button
            type="button"
            class="p-1 rounded-xl hover:bg-slate-200/10"
            @click="show = false"
          >
            <ChevronLeft />
          </button>
        </div>
        <ul
          class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 font-medium font-secondary text-2xl lowercase"
        >
          <li v-for="link in _links" :key="link.path">
            <router-link
              :to="link.path"
              class="inline-flex items-center space-x-1 border-b-2 py-1.5 border-b-transparent opacity-35"
              :class="{ '!opacity-100': route.path === link.path }"
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
        <user-menu v-else />
      </nav>
    </Container>
  </header>
  <div class="md:hidden py-2 sticky top-0 backdrop-blur-md bg-black text-white">
    <Container>
      <div class="flex items-center justify-between">
        <router-link to="/" class="font-bold font-secondary text-lg">
          wasita-repository
        </router-link>
        <button
          type="button"
          class="rounded-xl p-2 text-slate-white hover:bg-white/10 focus:bg-white-100 relative z-10"
          @click="show = true"
        >
          <Menu />
        </button>
      </div>
    </Container>
  </div>
</template>
<script lang="ts" setup>
import { ChevronLeft, LogIn, Menu, UserPlus2 } from "lucide-vue-next"
import { computed, ref, watch, type Component } from "vue"
import { useRoute } from "vue-router"
import { useWindowScroll } from "@vueuse/core"
import { useAuthStore } from "@/stores/auth"
import Container from "@/components/layout/container.vue"
import UserMenu from "@/components/user/menu.vue"

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

const route = useRoute()
const links: Link[] = [
  { path: "/", label: "Home" },
  { path: "/my-files", label: "My files", requiresAuth: true },
  { path: "/about", label: "About" },
]

const _links = computed(() =>
  links.filter((l) => (l.requiresAuth ? auth.isAuthenticated : true)),
)

const guestLinks: Link[] = [
  { path: "/login", label: "Login", icon: LogIn },
  { path: "/register", label: "Register", icon: UserPlus2 },
]

const show = ref(false)

watch(
  () => route.path,
  () => {
    show.value = false
  },
)
</script>
