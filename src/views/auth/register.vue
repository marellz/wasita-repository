<template>
  <div class="mb-8 text-center space-y-2">
    <h1 class="auth-title">Join Our Platform</h1>
    <p class="auth-subtitle">
      Create an account to start uploading, organizing, and sharing your
      documents securely. Forgot Password Page
    </p>
  </div>
  <Form @submit="register()" @invalid-submit="handleInvalidSubmit">
    <div class="space-y-4">
      <form-input
        label="Name"
        v-model="name"
        required
        :error="errors.name"
        v-bind="nameAttrs"
      ></form-input>

      <form-input
        label="Email"
        :error="errors.email"
        v-model="email"
        type="email"
        required
      ></form-input>

      <form-input
        label="Password"
        v-model="password"
        type="password"
        required
        :error="errors.password"
        allow-password-toggle
      ></form-input>

      <form-input
        label="Confirm password"
        v-model="confirmPassword"
        type="password"
        required
        :error="errors.password_confirmation"
      ></form-input>

      <div>
        <base-button class="w-full" :loading>
          <span>Register</span>
        </base-button>
      </div>
      <base-alert
        v-if="auth.hasErrors"
        variant="error"
        title="Authentication error"
      >
        <div class="space-y-2">
          <p v-for="(err, key) in auth.errors" :key>
            <span>{{ err }}</span>
          </p>
        </div>
      </base-alert>
      <div>
        <p class="text-gray-600 text-center">
          Already have an account?
          <router-link class="text-indigo-600 font-medium" to="/login"
            >Login</router-link
          >
        </p>
      </div>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import { Form, useForm } from "vee-validate"
import FormInput from "@/components/form/input.vue"
import BaseButton from "@/components/base/button.vue"
import BaseAlert from "@/components/base/alert.vue"
import { computed } from "vue"
import { useAuthStore } from "@/stores/auth"

import * as yup from "yup"

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  password_confirmation: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
})

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
})

const auth = useAuthStore()

const loading = computed(() => auth.loading)

const [name, nameAttrs] = defineField("name")
const [email] = defineField("email")
const [password] = defineField("password")
const [confirmPassword] = defineField("password_confirmation")

const register = handleSubmit(async (values) => {
  console.log(values)

  await auth.register({
    name: values.name,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
  })
})

const handleInvalidSubmit = () => {
  if (Object.keys(errors).length) {
    alert("Errors!")
    return null
  }
}
</script>
