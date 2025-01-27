<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Login</h1>
    <Form @submit="login()">
      <div class="space-y-4">
        <form-input
          label="Email address"
          v-model="email"
          :error="errors.email"
          autocomplete="email"
          type="email"
          required
        ></form-input>
        <form-input
          label="Password"
          v-model="password"
          autocomplete="password"
          :error="errors.password"
          type="password"
          required
        ></form-input>
        <div
          class="flex flex-col items-start md:flex-row md:items-center space-y-4 md:space-y-0 justify-between"
        >
          <form-checkbox v-model="rememberMe" label="Remember me" />
          <router-link class="text-indigo-600 font-medium" to="/forgot-password"
            >Forgot password?
          </router-link>
        </div>
        <base-button class="w-full" :loading="auth.loading">
          <span>Login</span>
        </base-button>
        <base-alert
          v-if="auth.hasErrors"
          variant="error"
          title="Authentication error"
        >
          <p v-for="(err, key) in auth.errors" :key>
            <span class="font-bold">{{ key }}</span
            >: <span>{{ err }}</span>
          </p></base-alert
        >
        <div class="space-y-2">
          <p class="text-gray-600 text-center">
            Dont have an account?
            <router-link class="text-indigo-600 font-medium" to="/register"
              >Register</router-link
            >
          </p>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import FormInput from "@/components/form/input.vue"
import FormCheckbox from "@/components/form/checkbox.vue"
import BaseButton from "@/components/base/button.vue"
import BaseAlert from "@/components/base/alert.vue"
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { Form, useForm } from "vee-validate"
import * as yup from "yup"
const auth = useAuthStore()

// const user = ref({
//   email: "", //dave@test.com
//   password: "", //dave123@dave
// })

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(6).required("Password is required"),
  }),
})

const [email] = defineField("email")
const [password] = defineField("password")

const rememberMe = ref(false)

const login = handleSubmit(async (values) => {
  await auth.login({
    email: values.email,
    password: values.password,
  })
})
</script>
