<template>
  <Container>
    <div class="flex flex-wrap gap-4 md:flex-nowrap items-center justify-between">
      <page-title>My profile.</page-title>
      <base-button type="button" variant="primary-outline" :loading="userStore.loading"
        @click="userStore.refreshUser()">
        <span>Reload user</span>
      </base-button>
    </div>
    <layout-card class="mt-10">
      <div v-if="userStore.loading" class="py-5 text-center">
        <base-loader></base-loader>
      </div>
      <form @submit.prevent="update" v-else-if="form">
        <div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3 sm:items-center">
          <div class="flex flex-col space-y-4 items-center">
            <img v-if="form.avatar_url" :src="form.avatar_url" class="h-40 w-40 rounded-full object-cover" alt="avatar">
            <label v-else for="avatar">
              <span class="h-40 w-40 rounded-full border bg-gray-100 flex items-center justify-center">
                <Image :size="48" :stroke-width="1.5"/>
              </span>
            </label>
            <div class="flex items-center justify-center md:justify-start flex-wrap gap-4">
              <div>
                <input type="file" class="h-0 w-0 absolute -z-10" id="avatar" @change="uploadAvatar" />
                <label for="avatar">
                  <span type="button" class="rounded border p-2 inline-flex items-center space-x-2 font-medium">
                    <Edit :size="24" :stroke-width="1.5" />
                  </span>
                </label>
              </div>
              <button v-if="form.avatar_url" type="button"
                class="rounded border p-2 inline-flex items-center space-x-2 font-medium" @click="deleteAvatar">
                <Trash2 :size="24" :stroke-width="1.5" />
              </button>
            </div>
          </div>
          <div class="space-y-4 md:col-span-2">
            <form-input v-model="form.name" label="Name" required></form-input>
            <form-input v-model="form.email" label="Email address" disabled></form-input>
            <form-input v-model="form.phone" label="Phone number"></form-input>
            <base-button type="submit" :loading="userStore.loading">
              <span>Update user details</span>
            </base-button>
          </div>
        </div>
      </form>
    </layout-card>
  </Container>
</template>
<script lang="ts" setup>
import Container from '@/components/layout/container.vue';
import BaseButton from '@/components/base/button.vue';
import BaseLoader from '@/components/base/loader.vue';
import FormInput from '@/components/form/input.vue';
import PageTitle from '@/components/layout/title.vue';
import LayoutCard from '@/components/layout/card.vue';
import { onMounted, ref, watch } from 'vue';
import { useUserStore, type User } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToastsStore } from '@/stores/toasts';
import { Edit, Trash2, Image } from 'lucide-vue-next';

const userStore = useUserStore()
const auth = useAuthStore()
const toasts = useToastsStore()

const form = ref<User>({ ...auth.user! })
watch(() => auth.user, (v) => {
  if (v) {
    form.value = v
  }
})
const update = async () => {
  if (!auth.user || !form.value) {
    return
  }

  await userStore.update(auth.user?.id, form.value)
}

const uploadAvatar = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) {
    return
  }

  await userStore.uploadAvatar(target.files[0])
}
const deleteAvatar = async () => {
  if (!form.value?.avatar) {
    return
  }

  await userStore.deleteAvatar(form.value?.avatar)
}

onMounted(async () => {
  const id = auth.user?.id
  if (!id) {
    useRouter().push('/')
    toasts.addError('Forbidden', 'You need to be logged in to access that page');
    return
  }



})
</script>
