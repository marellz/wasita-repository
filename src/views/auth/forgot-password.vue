<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Forgot password</h1>
    <form @submit.prevent="resetPassword">
      <div class="space-y-4">
        <form-input label="Email address" v-model="email" type="email" required></form-input>
        <base-button class="w-full">
          <span>Send recovery email</span>
        </base-button>

      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue';
import BaseButton from '@/components/base/button.vue'
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()

const email = ref("")


const resetPassword = async () => {
  await auth.resetPassword(email.value)
}
</script>
