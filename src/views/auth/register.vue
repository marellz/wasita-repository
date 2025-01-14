<template>

  <h1 class="text-2xl font-bold mb-6">Register</h1>
  <form @submit.prevent="register">
    <div class="space-y-4">
      <form-input label="Name" v-model="user.name" required></form-input>
      <form-input label="Email" v-model="user.email" type="email" required></form-input>
      <form-input label="Password" v-model="user.password" type="password" required></form-input>
      <form-input label="Confirm password" v-model="user.confirmPassword" type="password" required></form-input>
      <div>
        <base-button class="w-full">
          <span>Register</span>
        </base-button>
      </div>
      <div>
        <p class="text-gray-600 text-center">Already have an account? <router-link class="text-indigo-600 font-medium"
            to="/login">Login</router-link>
        </p>
      </div>
    </div>
  </form>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue';
import BaseButton from '@/components/base/button.vue'
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()

const user = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
})

const register = async () => {
  await auth.register(user.value)
}
</script>
