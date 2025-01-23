<template>
  <Container>
    <div
      class="flex flex-wrap gap-4 md:flex-nowrap items-center justify-between"
    >
      <page-title>User profile</page-title>
      <base-button
        type="button"
        variant="primary-outline"
        :loading="userStore.loading"
        @click="userStore.refreshUser()"
      >
        <span>Reload user</span>
      </base-button>
    </div>
    <layout-card class="mt-10">
      <div v-if="userStore.loading" class="py-5 text-center">
        <base-loader></base-loader>
      </div>
      <Form @submit="update()" v-else-if="user">
        <div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3 sm:items-center">
          <div class="flex flex-col space-y-4 items-center">
            <div
              v-if="userStore.uploading"
              class="h-40 w-40 rounded-full flex items-center justify-center"
            >
              <base-loader></base-loader>
            </div>
            <img
              v-else-if="avatar_url"
              :src="avatar_url"
              class="h-40 w-40 rounded-full object-cover"
              alt="avatar"
            />
            <label v-else for="avatar">
              <span
                class="h-40 w-40 rounded-full border bg-gray-100 flex items-center justify-center"
              >
                <Image :size="48" :stroke-width="1.5" />
              </span>
            </label>
            <div
              class="flex items-center justify-center md:justify-start flex-wrap gap-4"
            >
              <div>
                <input
                  type="file"
                  class="h-0 w-0 absolute -z-10"
                  id="avatar"
                  @change="uploadAvatar"
                />
                <label for="avatar">
                  <span
                    type="button"
                    class="rounded border p-2 inline-flex items-center space-x-2 font-medium"
                  >
                    <Edit :size="24" :stroke-width="1.5" />
                  </span>
                </label>
              </div>
              <button
                v-if="user.avatar_url"
                type="button"
                class="rounded border p-2 inline-flex items-center space-x-2 font-medium"
                @click="deleteAvatar"
              >
                <Trash2 :size="24" :stroke-width="1.5" />
              </button>
            </div>
          </div>
          <div class="space-y-4 md:col-span-2">
            <form-input
              v-model="name"
              :error="errors.name"
              label="Name"
              required
            ></form-input>
            <form-input
              v-model="email"
              :error="errors.email"
              label="Email address"
              disabled
            ></form-input>
            <form-input
              v-model="phone"
              :error="errors.phone"
              label="Phone number"
              placeholder="07XXXXXXXX"
            ></form-input>
            <base-button type="submit" :loading>
              <span>Update user details</span>
            </base-button>
          </div>
        </div>
      </Form>
    </layout-card>
  </Container>
</template>
<script lang="ts" setup>
import Container from "@/components/layout/container.vue"
import BaseButton from "@/components/base/button.vue"
import BaseLoader from "@/components/base/loader.vue"
import FormInput from "@/components/form/input.vue"
import PageTitle from "@/components/layout/title.vue"
import LayoutCard from "@/components/layout/card.vue"
import { onMounted, computed, watch } from "vue"
import { useUserStore, type NewUser } from "@/stores/users"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"
import { useToastsStore } from "@/stores/toasts"
import { Edit, Trash2, Image } from "lucide-vue-next"
import { Form, useForm } from "vee-validate"
import * as yup from "yup"

const schema = yup.object({
  name: yup.string().required("Your name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.number().required("Phone number is required"),
  avatar_url: yup.string().nullable(),
})

const { errors, defineField, resetForm, handleSubmit } = useForm<NewUser>({
  validationSchema: schema,
})

const [name] = defineField("name")
const [email] = defineField("email")
const [phone] = defineField("phone")
const [avatar_url] = defineField("avatar_url")

const userStore = useUserStore()
const auth = useAuthStore()
const toasts = useToastsStore()

const user = computed(() => auth.user)
const loading = computed(() => userStore.loading)

watch(
  () => auth.user,
  (v) => {
    if (v) {
      resetForm({ values: v })
    }
  },
)

const update = handleSubmit(async (values) => {
  if (auth.user) {
    const id = auth.user.id
    await userStore.update(id, values)
  }
})

const uploadAvatar = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) {
    return
  }

  await userStore.uploadAvatar(target.files[0])
}

const deleteAvatar = async () => {
  if (!auth.user?.avatar) {
    return
  }

  await userStore.deleteAvatar(auth.user.avatar)
}

onMounted(async () => {
  const id = auth.user?.id
  if (!id) {
    useRouter().push("/")
    toasts.addError("Forbidden", "You need to be logged in to access that page")
    return
  }
  if (auth.user) {
    resetForm({ values: auth.user })
  }
})
</script>
