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
      path: "/about",
      name: "about",
      component: () => import("@/views/about.vue"),
    },

    // auth
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
      path: "/profile",
      name: "profile",
      component: () => import("@/views/profile.vue"),
    },

    // documents
    {
      path: "/create",
      name: "create",
      component: () => import("@/views/create.vue"),
    },
    {
      path: "/document/:id",
      name: "view",
      component: () => import("@/views/document/view.vue"),
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: () => import("@/views/document/edit.vue"),
    },
    {
      path: "/my-files",
      name: "my-files",
      component: () => import("@/views/my-files.vue"),
    },

    // other

    {
      path: "/styleguide",
      name: "styleguide",
      component: () => import("@/views/test/styleguide.vue"),
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
    "styleguide",
  ]
  if (!authRoutes.includes(to.name) && !auth.isAuthenticated)
    next({ name: "login" })
  else next()
})

export default router
