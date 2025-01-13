import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Login from '@/views/auth/login.vue'
import Register from '@/views/auth/register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        layout: 'auth',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        layout: 'auth',
      },
    },
    {
      path: '/submit',
      name: 'submit',
      component: () => import('@/views/submit.vue'),
      meta: {
        layout: 'form',
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/about.vue'),
    },
  ],
})

export default router
