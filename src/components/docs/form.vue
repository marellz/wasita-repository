<template>
  <form @submit.prevent="submit">
    <div class="space-y-4">
      <form-input label="Document name" v-model="_form.name" :error="errors.name" required />
      <form-text rows="5" label="Document details" v-model="_form.details" :error="errors.details" required />
      <div class="!my-10 space-y-4">
        <base-alert v-if="isUpdate" title="Please note">
          <p>Inputting a new file will mean that the original file will be replaced</p>
        </base-alert>
        <document-input v-model="file" :error="errors.document"></document-input>
      </div>
      <fieldset class="border rounded-xl p-4">
        <legend class="px-4"><form-label class="!mb-0">Document settings</form-label></legend>
        <div class="space-y-4">
          <form-checkbox label="Save as draft" v-model="_form.is_draft" @change="handleDraftStatus"></form-checkbox>
          <form-checkbox label="Public document" v-model="_form.is_public" :disabled="_form.is_draft"></form-checkbox>
          <form-checkbox label="Add collaborators" v-model="hasCollaborators" @change="handleCollaborationChange"
            :disabled="!!_form.collaborators?.length"></form-checkbox>
        </div>
      </fieldset>
      <fieldset class="border rounded-xl p-4" v-if="hasCollaborators">
        <legend class="px-4"><form-label class="!mb-0">Collaborators</form-label></legend>
        <div class="space-y-4">
          <template v-if="_form.collaborators?.length">
            <p class="font-medium">Added collaborators</p>
            <div class="flex flex-wrap gap-3">
              <div v-for="(item, index) in displayedCollaborators" :key="index"
                class="flex items-center space-x-4 border rounded-lg p-2">
                <div class="flex-auto">
                  <p class="font-medium">
                    {{ item.name || 'No name' }}
                  </p>
                  <p class="text-xs text-slate-600">
                    {{ item.email }}
                  </p>
                </div>
                <div class="flex-none">
                  <button type="button" class="rounded-full p-1 hover:bg-red-100 hover:text-red-500"
                    @click="removeSelectedCollaborator(index)">
                    <X />
                  </button>
                </div>
              </div>
            </div>
          </template>

          <p v-else class="text-slate-500">None selected</p>

          <form-input v-model="userQuery" placeholder="Search for users"></form-input>

          <div v-if="userStore.loading" class="py-10 text-center">
            <base-loader></base-loader>
          </div>

          <template v-else>
            <hr>
            <div class="py-4 pt-2 flex flex-wrap gap-3">
              <form-checkbox v-for="(item, index) in displayedUsers" :key="index"
                class="flex items-center space-x-4 border rounded-lg px-4 py-2 border-slate-200"
                :class="{ 'bg-slate-200': item.email === auth.user?.email, '!border-indigo-600': _form.collaborators?.includes(item.id) }"
                v-model="_form.collaborators" :value="item.id" name="collaborators"
                :disabled="item.email === auth.user?.email">
                <div class="ml-4">
                  <p class="font-medium">
                    {{ item.name || `&ndash; &ndash;` }}
                  </p>
                  <p class="text-xs text-slate-600">
                    {{ item.email }}
                  </p>
                </div>
              </form-checkbox>
            </div>
          </template>
        </div>
      </fieldset>

      <fieldset class="border rounded-xl p-4">
        <legend class="px-4"><form-label class="!mb-0">Categorization</form-label></legend>
        <div class="space-y-4">
          <form-select label="Category" v-model="_form.category">
            <option v-for="item in categories" :value="item.value" :key="item.value">
              {{ item.label }}
            </option>
          </form-select>
          <div>
            <form-label>Tags</form-label>
            <div class="flex gap-4">
              <div v-for="(item, index) in tags" :key="index">
                <form-checkbox :value="item.value" :label="item.label" v-model="_form.tags" />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
      <div class="!mt-10">
        <base-button class="w-full" :loading>
          <span v-if="isUpdate">Update document</span>
          <span v-else>Submit document</span>
        </base-button>
      </div>
    </div>
  </form>
</template>
<script lang="ts" setup>

import BaseLoader from '@/components/base/loader.vue';
import BaseAlert from '@/components/base/alert.vue';
import BaseButton from '@/components/base/button.vue';
import FormInput from '@/components/form/input.vue';
import FormLabel from '@/components/form/label.vue';
import FormText from '@/components/form/text.vue';
import FormSelect from '@/components/form/select.vue';
import FormCheckbox from '@/components/form/checkbox.vue';
import DocumentInput from '@/components/form/document.vue';
import { type DocumentForm, useDocumentStore } from '@/stores/docs';
import { computed, onMounted, ref } from 'vue';
import { useUserStore, type User } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { X } from 'lucide-vue-next';

export interface DocumentFormPayload {
  data: DocumentForm,
  file: File | null
}

const props = withDefaults(defineProps<{
  form?: DocumentForm;
}>(), {
})

const emit = defineEmits(['submit'])

const store = useDocumentStore()
const userStore = useUserStore()
const auth = useAuthStore()

const loading = computed(() => store.loadingSingle)
const errors = computed(() => store.errors)
const isUpdate = computed(() => props.form?.id)
const _form = ref({ ...props.form })
const file = ref<File | undefined>()

const hasCollaborators = ref(false)
const users = ref<User[]>([])
const userQuery = ref<string>('')

const displayedUsers = computed(() => {
  const r = users.value.filter(u => {
    const v = userQuery.value.toLowerCase()
    return u.name?.toLowerCase().includes(v) || u.email.toLowerCase().includes(v)
  })

  if (userQuery.value.length) {
    return r
  } else {
    return r.splice(0, 4)
  }
})

const displayedCollaborators = computed(() => {
  if (!_form.value.collaborators) {
    return []
  }

  return users.value.filter(u => _form.value.collaborators?.includes(u.id))
})

const removeSelectedCollaborator = (index: number) => {
  _form.value.collaborators?.splice(index, 1)
}

const getUsers = async () => {
  const _u = await userStore.getUsers();

  if (_u) {
    users.value = _u
  }
}



const submit = () => {
  const _file = file.value ? file.value : null
  emit('submit', { data: _form.value, file: _file })
}

const tags = ref([
  { label: "Finance", value: "finance" },
  { label: "Meeting", value: "meeting" },
  { label: "2025", value: "2025" },
])


const categories = ref<{ label: string, value: string }[]>([
  { label: "General", value: "general" },
  { label: "Financial", value: "financial" },
  { label: "Minutes", value: "minutes" },
  { label: "Contracts", value: "contracts" },
])


const handleDraftStatus = () => {
  if (_form.value.is_draft) {
    _form.value.is_public = false
  }
}

const handleCollaborationChange = async (v: boolean) => {
  if (v) {
    await getUsers()
  }
}

onMounted(async () => {
  if (props.form?.collaborators.length) {
    hasCollaborators.value = true
    await getUsers()
  }
})

</script>
