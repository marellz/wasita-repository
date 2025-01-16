import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/home.vue"
import Login from "@/views/auth/login.vue"

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
      path: "/profile",
      name: "profile",
      component: () => import("@/views/profile.vue"),
    },
    {
      path: "/submit",
      name: "submit",
      component: () => import("@/views/submit.vue"),
      meta: {
        layout: "form",
      },
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

export default router
