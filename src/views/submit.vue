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
            <form-checkbox label="Save as draft" v-model="form.is_draft" @change="handleDraftStatus"></form-checkbox>
            <form-checkbox label="Public document" v-model="form.is_public" :disabled="form.is_draft"></form-checkbox>
            <form-select label="Category" v-model="form.category">
              <option v-for="item in categories" :value="item.value" :key="item.value">
                {{ item.label }}
              </option>
            </form-select>
            <div>
              <form-label>Tags</form-label>
              <div class="flex gap-4">
                <div v-for="(item, index) in tags" :key="index">
                  <form-checkbox :value="item.value" :label="item.label" v-model="form.tags" />
                </div>
              </div>
            </div>
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
import { useDocumentStore, type Category, type DocumentForm } from '@/stores/docs';
import { computed, ref, watch } from 'vue';
import Container from '@/components/layout/container.vue';
import BaseButton from '@/components/base/button.vue';
import FormInput from '@/components/form/input.vue';
import FormLabel from '@/components/form/label.vue';
import FormText from '@/components/form/text.vue';
import FormSelect from '@/components/form/select.vue';
import FormCheckbox from '@/components/form/checkbox.vue';
import DocumentInput from '@/components/form/document.vue';
import { useRouter } from 'vue-router';


const auth = useAuthStore()

const store = useDocumentStore()
const file = ref<File>()
const loading = computed(() => store.loadingSingle)
const errors = computed(() => store.errors)
const router = useRouter()

const tags = ref([
  { label: "Finance", value: "finance" },
  { label: "Meeting", value: "meeting" },
  { label: "2025", value: "2025" },
])


const categories = ref<{ label: string, value: Category }[]>([
  { label: "General", value: "general" },
  { label: "Financial", value: "financial" },
  { label: "Minutes", value: "minutes" },
  { label: "Contracts", value: "contracts" },
])

const newForm: DocumentForm = {
  name: "",
  details: "",
  is_draft: false,
  url: '',
  is_public: true,
  category: 'general',
  tags: []
}

const form = ref(newForm)

watch([form, file], () => {
  store.resetErrors()
})

const handleDraftStatus = () => {
  if (form.value.is_draft) {
    form.value.is_public = false
  }
}

const submit = async () => {

  const success = await store.createDocument(file.value, form.value)
  if (!success) {
    return;
  }

  form.value = newForm
  router.push('/')




}
</script>
