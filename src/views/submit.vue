<template>
  <Container>
    <h1 class="text-4xl font-medium">Make a submission</h1>
    <template v-if="!auth.isAuthenticated">
      <div class="flex flex-col xl:flex-row xl:justify-center items-center mt-20">
        <img class="max-w-md w-full" src="@/assets/images/undraw_safe_0mei.svg" alt="">
        <div class="mt-10 xl:ml-20">
          <h1 class="text-3xl font-bold">You need to be logged in.</h1>
          <p class="mt-2 max-w-xl">To make a document submission, you need to log in first. Logging in ensures your
            submissions
            are tied to your account for easy access.</p>
          <div class="mt-6 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <RouterLink to="/login">
              <base-button>
                <span>Login</span>
              </base-button>
            </RouterLink>
            <span class="text-sm font-medium px-2">or</span>
            <RouterLink to="/register">
              <base-button variant="primary-outline">
                <span>Create a new account</span>
              </base-button>
            </RouterLink>
          </div>
          <h1 class="mt-10 font-medium">Why you need login</h1>
          <ul class="mt-4 list-disc pl-5 text-gray-700">
            <li>Securely upload and manage your documents.</li>
            <li>Access all your submissions from one convenient place.</li>
            <li>Ensure your data is private and safe.</li>
          </ul>
        </div>
      </div>
    </template>
    <template v-else>
      <form @submit.prevent="submit">
        <div class="grid lg:grid-cols-2 gap-10">
          <div>
            <document-input v-model="file" :error="errors.document"></document-input>
          </div>
          <div class="space-y-4">
            <form-input label="Document name" v-model="form.name" :error="errors.name" required />
            <form-text rows="5" label="Document details" v-model="form.details" :error="errors.details" required />
            <form-checkbox label="Save as draft" v-model="form.is_draft"></form-checkbox>
            <base-button class="w-full" :loading>
              <span>Submit document</span>
            </base-button>
          </div>
        </div>
      </form>

    </template>
  </Container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useDocumentStore } from '@/stores/docs';
import { computed, ref, watch } from 'vue';
import Container from '@/components/layout/container.vue';
import BaseButton from '@/components/base/button.vue';
import FormInput from '@/components/form/input.vue';
import FormText from '@/components/form/text.vue';
import FormCheckbox from '@/components/form/checkbox.vue';
import DocumentInput from '@/components/form/document.vue';
import { useRouter } from 'vue-router';


const auth = useAuthStore()

const store = useDocumentStore()
const file = ref<File>()
const loading = computed(() => store.loading)
const errors = computed(() => store.errors)
const router = useRouter()

const newForm = {
  name: "",
  details: "",
  is_draft: false,
  url: '',
}

const form = ref(newForm)

watch([form, file], () => {
  store.resetErrors()
})

const submit = async () => {

  const path = await store.uploadFile(file.value)
  if (!path) {
    return;
  }

  form.value.url = path;
  const success = await store.createDocument(form.value)

  if (success) {
    form.value = newForm
    router.push('/')
  }


}
</script>
