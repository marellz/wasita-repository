<template>
  <Container>
    <page-title>Make a submission</page-title>
    <layout-card>
      <div v-if="!auth.isAuthenticated">
        <img class="max-w-md w-full" src="@/assets/images/undraw_safe_0mei.svg" alt="">
        <div class="mt-20">
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
      <template v-else>
        <document-form :form @submit="submit"></document-form>
      </template>
    </layout-card>
  </Container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useDocumentStore, type DocumentForm as DocumentFormType } from '@/stores/docs';
import { ref, watch } from 'vue';
import Container from '@/components/layout/container.vue';
import BaseButton from '@/components/base/button.vue';
import DocumentForm, { type DocumentFormPayload } from '@/components/docs/form.vue'
import PageTitle from '@/components/layout/title.vue';
import LayoutCard from '@/components/layout/card.vue';

const auth = useAuthStore()

const store = useDocumentStore()
const file = ref<File>()

const router = useRouter()


const newForm: DocumentFormType = {
  name: "",
  details: "",
  is_draft: false,
  url: '',
  is_public: true,
  category: 'general',
  tags: [],
  collaborators: [],
}

const form = ref(newForm)

watch([form, file], () => {
  store.resetErrors()
})


const submit = async ({ data, file }: DocumentFormPayload) => {
  const success = await store.createDocument(file, data)
  if (!success) {
    return;
  }

  form.value = newForm
  router.push('/')

}
</script>
