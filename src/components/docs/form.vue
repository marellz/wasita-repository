<template>
  <base-alert
    class="mb-10"
    v-if="store.errors && Object.keys(store.errors).length"
    variant="error"
    title="Document form errors"
  >
    {{ store.errors }}
  </base-alert>

  <Form @submit="submit()">
    <div class="space-y-4">
      <form-input
        label="Document name"
        v-model="name"
        :error="errors.name"
        required
      />
      <form-text
        rows="5"
        label="Document details"
        v-model="details"
        :error="errors.details"
        required
      />
      <div class="!my-10 space-y-4">
        <base-alert v-if="isUpdate" title="Please note">
          <p>
            Inputting a new file will mean that the original file will be
            replaced
          </p>
        </base-alert>
        <document-input v-model="file" :error="errors.file"></document-input>
      </div>
      <fieldset class="border rounded-xl p-4">
        <legend class="px-4">
          <form-label class="!mb-0">Document settings</form-label>
        </legend>
        <div class="space-y-4">
          <div
            class="flex py-1 px-2 bg-slate-50 rounded-lg space-x-2 text-slate-500"
          >
            <Info :size="20" class="flex-none mt-0.5" />
            <p class="italic text-sm">
              Documents cannot be draft and public at the same time. Documents
              marked as draft remain in the custody of the owner and are not
              displayed to everyone else.
            </p>
          </div>
          <form-checkbox
            label="Save as draft"
            :value="true"
            v-model="is_draft"
            :disabled="is_public"
            name="Is draft"
          ></form-checkbox>
          <form-checkbox
            label="Public document"
            :value="true"
            v-model="is_public"
            name="isPublic"
            :disabled="is_draft"
          ></form-checkbox>
          <form-checkbox
            label="Add collaborators"
            :value="true"
            v-model="hasCollaborators"
            @change="handleCollaborationChange"
            :disabled="!!collaborators?.length"
          ></form-checkbox>
        </div>
      </fieldset>
      <fieldset class="border rounded-xl p-4" v-if="hasCollaborators">
        <legend class="px-4">
          <form-label class="!mb-0">Collaborators</form-label>
        </legend>
        <div class="space-y-4">
          <template v-if="collaborators?.length">
            <p class="font-medium">Added collaborators</p>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="(item, index) in displayedCollaborators"
                :key="index"
                class="flex items-center space-x-4 border rounded-lg p-2"
              >
                <div class="flex-auto">
                  <p class="font-medium">
                    {{ item.name || "No name" }}
                  </p>
                  <p class="text-xs text-slate-600">
                    {{ item.email }}
                  </p>
                </div>
                <div class="flex-none">
                  <button
                    type="button"
                    class="rounded-full p-1 hover:bg-red-100 hover:text-red-500"
                    @click="removeSelectedCollaborator(index)"
                  >
                    <X />
                  </button>
                </div>
              </div>
            </div>
          </template>

          <p v-else class="text-slate-500">None selected</p>

          <form-input
            v-model="userQuery"
            placeholder="Search for users"
          ></form-input>

          <div v-if="userStore.loading" class="py-10 text-center">
            <base-loader></base-loader>
          </div>

          <template v-else>
            <hr />
            <div class="py-4 pt-2 flex flex-wrap gap-3">
              <form-checkbox
                v-for="(item, index) in displayedUsers"
                :key="index"
                class="flex items-center space-x-4 border rounded-lg px-4 py-2 border-slate-200"
                :class="{
                  'bg-slate-200': item.email === auth.user?.email,
                  '!border-indigo-600': collaborators?.includes(item.id),
                }"
                v-model="collaborators"
                :value="item.id"
                name="collaborators"
                :disabled="item.email === auth.user?.email"
              >
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
        <legend class="px-4">
          <form-label class="!mb-0">Categorization</form-label>
        </legend>
        <div class="space-y-4">
          <form-select
            label="Category"
            v-model="category"
            :error="errors.category"
          >
            <option
              v-for="item in categoriesList"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </option>
          </form-select>
          <div>
            <form-label>Tags</form-label>
            <div class="flex gap-4">
              <div v-for="(item, index) in tagsList" :key="index">
                <form-checkbox
                  :value="item.value"
                  :label="item.label"
                  v-model="tags"
                />
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
  </Form>
</template>
<script lang="ts" setup>
import BaseLoader from "@/components/base/loader.vue"
import BaseAlert from "@/components/base/alert.vue"
import BaseButton from "@/components/base/button.vue"
import FormInput from "@/components/form/input.vue"
import FormLabel from "@/components/form/label.vue"
import FormText from "@/components/form/text.vue"
import FormSelect from "@/components/form/select.vue"
import FormCheckbox from "@/components/form/checkbox.vue"
import DocumentInput from "@/components/form/document.vue"
import { type DocumentForm, useDocumentStore } from "@/stores/docs"
import { computed, onMounted, ref } from "vue"
import { useUserStore, type User } from "@/stores/users"
import { useAuthStore } from "@/stores/auth"
import { Form, useForm } from "vee-validate"
import { X, Info } from "lucide-vue-next"
import * as yup from "yup"

export interface DocumentFormPayload {
  data: DocumentForm
  file: File | null
}

const props = withDefaults(
  defineProps<{
    form?: DocumentForm
  }>(),
  {},
)

const isUpdate = computed(() => props.form?.id)

const isRequired = (required: boolean = false) =>
  yup
    .mixed()
    .test("File", "File is required", (value) => {
      if (!value && required) {
        return false
      }

      return true
    })
    .test("File size", "Files must be less than 20MB", (value) => {
      if (value) {
        return value instanceof File && value.size <= 1024 * 1024 * 20
      }

      return true
    })

const yupFileSChema = isRequired(!isUpdate.value)

const schema = yup.object({
  name: yup.string().required("Document requires a name"),
  details: yup.string().required("Document information is required"),
  is_draft: yup.boolean(),
  is_public: yup.boolean(),
  category: yup.string().required(),
  tags: yup.array().of(yup.string()),
  collaborators: yup.array().of(yup.string()),
  file: yupFileSChema,
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema: schema,
})

const [name] = defineField("name")
const [details] = defineField("details")
const [is_draft] = defineField("is_draft")
const [is_public] = defineField("is_public")
const [category] = defineField("category")
const [collaborators] = defineField("collaborators")
const [tags] = defineField("tags")
const [file] = defineField("file")

const emit = defineEmits(["submit"])

const store = useDocumentStore()
const userStore = useUserStore()
const auth = useAuthStore()

const loading = computed(() => store.loadingSingle)

const hasCollaborators = ref(false)
const users = ref<User[]>([])
const userQuery = ref<string>("")

const displayedUsers = computed(() => {
  const r = users.value.filter((u) => {
    const v = userQuery.value.toLowerCase()
    return (
      u.name?.toLowerCase().includes(v) || u.email.toLowerCase().includes(v)
    )
  })

  if (userQuery.value.length) {
    return r
  } else {
    return r.splice(0, 4)
  }
})

const displayedCollaborators = computed(() => {
  if (!collaborators) {
    return []
  }

  return users.value.filter((u) => collaborators?.includes(u.id))
})

const removeSelectedCollaborator = (index: number) => {
  collaborators?.splice(index, 1)
}

const getUsers = async () => {
  const _u = await userStore.getUsers()

  if (_u) {
    users.value = _u
  }
}

const submit = handleSubmit((values) => {
  const file = values.file
  delete values.file
  emit("submit", { data: values, file })
})

const tagsList = ref([
  { label: "Finance", value: "finance" },
  { label: "Meeting", value: "meeting" },
  { label: "2025", value: "2025" },
])

const categoriesList = ref<{ label: string; value: string }[]>([
  { label: "General", value: "general" },
  { label: "Financial", value: "financial" },
  { label: "Minutes", value: "minutes" },
  { label: "Contracts", value: "contracts" },
])

const handleCollaborationChange = async (v: boolean) => {
  if (v) {
    await getUsers()
  }
}

onMounted(async () => {
  if (props.form && props.form.id) {
    resetForm({ values: props.form })
  } else {
    resetForm({ values: newForm })
  }

  if (collaborators.length) {
    hasCollaborators.value = true
    await getUsers()
  }
})
</script>
