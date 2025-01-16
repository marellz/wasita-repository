<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Login</h1>
    <form @submit.prevent="login">
      <div class="space-y-4">
        <form-input label="Email address" v-model="user.email" type="email" required></form-input>
        <form-input label="Password" v-model="user.password" type="password" required></form-input>
        <div class="flex items-center justify-between">
          <form-checkbox v-model="rememberMe" label="Remember me" />
          <router-link class="text-indigo-600 font-medium" to="/forgot-password">Forgot password? </router-link>
        </div>
        <base-button class="w-full" :loading="auth.loading">
          <span>Login</span>
        </base-button>
        <div class="space-y-2">
          <p class="text-gray-600 text-center">Dont have an account? <router-link class="text-indigo-600 font-medium"
              to="/register">Register</router-link>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue';
import FormCheckbox from '@/components/form/checkbox.vue';
import BaseButton from '@/components/base/button.vue'
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()

const user = ref({
  email: "", //dave@test.com
  password: "", //dave123@dave
})

const rememberMe = ref(false)

const login = async () => {
  await auth.login(user.value)
}
</script>
