<template>
  <Container>

    <div class="flex flex-wrap gap-4 md:flex-nowrap items-center justify-between">
      <h1 class="text-4xl md:text-[60px] md:leading-[80px] font-medium font-funnel">My profile.</h1>
      <base-button type="button" variant="primary-outline" :loading="userStore.loading"
        @click="userStore.refreshUser()">
        <span>Reload user</span>
      </base-button>
    </div>
    <div class="mt-10 p-4 md:p-9 rounded-xl bg-white">
      <div v-if="userStore.loading" class="py-5 text-center">
        <base-loader></base-loader>
      </div>
      <form @submit.prevent="update" v-else-if="form">
        <div class="space-y-4">
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 items-center md:space-x-4">
            <img v-if="form.avatar" :src="auth.avatar" class="h-40 w-40 rounded-full object-cover" alt="avatar">
            <div class="flex items-center justify-center md:justify-start flex-wrap gap-4">
              <div>
                <input type="file" class="h-0 w-0 absolute -z-10" id="avatar" @change="uploadAvatar" />
                <label for="avatar">
                  <span type="button" class="rounded border p-1 inline-flex items-center space-x-2 font-medium">
                    <Edit :size="20" :stroke-width="1.5" />
                    <span>{{ form.avatar ? `Edit` : 'Upload' }} avatar</span>
                  </span>
                </label>
              </div>
              <button v-if="form.avatar" type="button"
                class="rounded border p-1 inline-flex items-center space-x-2 font-medium" @click="deleteAvatar">
                <Trash2 :size="20" :stroke-width="1.5" />
                <span>Delete avatar</span>
              </button>
            </div>
          </div>
          <form-input v-model="form.name" label="Name" required></form-input>
          <form-input v-model="form.email" label="Email address" disabled></form-input>
          <form-input v-model="form.phone" label="Phone number"></form-input>
          <base-button type="submit" :loading="userStore.loading">
            <span>Update user details</span>
          </base-button>
        </div>
      </form>
    </div>
  </Container>
</template>
<script lang="ts" setup>
import Container from '@/components/layout/container.vue';
import BaseButton from '@/components/base/button.vue';
import BaseLoader from '@/components/base/loader.vue';
import FormInput from '@/components/form/input.vue';
import { onMounted, ref, watch } from 'vue';
import { useUserStore, type User } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToastsStore } from '@/stores/toasts';
import { Edit, Trash2 } from 'lucide-vue-next';

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
