import {
  createRouter,
  createWebHistory,
  type RouteRecordNameGeneric,
} from "vue-router"
import Home from "@/views/home.vue"
import Login from "@/views/auth/login.vue"
import { useAuthStore } from "@/stores/auth"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        layout: "auth",
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/auth/register.vue"),
      meta: {
        layout: "auth",
      },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("@/views/auth/forgot-password.vue"),
      meta: {
        layout: "auth",
      },
    },
    {
      path: "/update-password",
      name: "update-password",
      component: () => import("@/views/auth/update-password.vue"),
      meta: {
        layout: "auth",
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/profile.vue"),
    },
    {
      path: "/create",
      name: "create",
      component: () => import("@/views/create.vue"),
    },
    {
      path: "/my-files",
      name: "my-files",
      component: () => import("@/views/my-files.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/about.vue"),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const authRoutes: RouteRecordNameGeneric[] = [
    "home",
    "login",
    "register",
    "about",
    "forgot-password",
    "update-password",
  ]
  if (!authRoutes.includes(to.name) && !auth.isAuthenticated)
    next({ name: "login" })
  else next()
})

export default router
