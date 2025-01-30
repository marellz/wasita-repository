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
        </div>
      </fieldset>

      <div class="grid md:grid-cols-2 gap-10">
        <fieldset class="border rounded-xl p-4">
          <legend class="px-4">
            <form-label class="!mb-0">Collaborators</form-label>
          </legend>

          <form-checkbox
            label="Add collaborators"
            :value="true"
            v-model="hasCollaborators"
            @change="handleCollaborationChange"
            :disabled="!collaborators"
          ></form-checkbox>

          <div v-if="hasCollaborators" class="mt-4 space-y-4">
            <template v-if="collaborators && collaborators.length">
              <p class="text-sm font-medium font-secondary">
                Added collaborators
              </p>
              <div class="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
                <div
                  v-for="(user, index) in displayedCollaborators"
                  :key="index"
                  class="flex items-center space-x-4 border border-indigo-600 text-indigo-600 rounded-xl py-0.5 px-2"
                >
                  <div class="flex-auto">
                    <p class="font-medium text-sm font-secondary">
                      {{ user.name }}
                    </p>
                  </div>
                  <div class="flex-none">
                    <button
                      type="button"
                      class="rounded-full p-1 hover:bg-red-100 hover:text-red-500"
                      @click="removeSelectedCollaborator(index)"
                    >
                      <X :size="20" />
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <p v-else class="text-slate-500 text-sm font-medium font-secondary">
              [No collaborators]
            </p>

            <form-dropdown
              v-if="collaborators !== null"
              :options="displayedUsers"
              v-model="collaborators"
              :loading="userStore.loading"
              :placeholder="`Add collaborators ${collaborators.length ? '(' + collaborators.length + ')' : ''}`"
              label-key="name"
              value-key="id"
              hide-input
              @query="(v) => (userQuery = v)"
            >
            </form-dropdown>
          </div>
        </fieldset>
        <fieldset class="border rounded-xl p-4">
          <legend class="px-4">
            <form-label class="!mb-0">Categorization</form-label>
          </legend>
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <form-label class="!mb-0">Categories</form-label>
              <button
                type="button"
                class="py-1 px-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-600 rounded inline-flex space-x-2 text-sm font-medium font-secondary"
                @click="showCategoriesModal = true"
              >
                <span>Edit</span>
                <Edit :size="20" />
              </button>
            </div>
            <form-select v-model="category" :error="errors.category">
              <option
                v-for="item in categoriesList"
                :value="item.slug"
                :key="item.id"
              >
                {{ item.name }}
              </option>
            </form-select>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <form-label class="!mb-0">Tags</form-label>
                <button
                  type="button"
                  class="py-1 px-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-600 rounded inline-flex space-x-2 text-sm font-medium font-secondary"
                  @click="showTagsModal = true"
                >
                  <span>Edit</span>
                  <Edit :size="20" />
                </button>
              </div>
              <div v-if="tagsStore.loading" class="py-4 text-center">
                <base-loader></base-loader>
              </div>
              <div v-else-if="tags" class="flex flex-wrap gap-3">
                <template v-for="item in tagsList" :key="item.id">
                  <form-pill
                    :value="item.slug"
                    name="tags"
                    :label="item.name"
                    v-model="tags"
                  />
                </template>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="!mt-10">
        <base-button class="w-full" :loading>
          <span v-if="isUpdate">Update document</span>
          <span v-else>Submit document</span>
        </base-button>
      </div>
    </div>
  </Form>

  <tags-form v-model:show="showTagsModal" />
  <category-form v-model:show="showCategoriesModal" />
</template>
<script lang="ts" setup>
import BaseAlert from "@/components/base/alert.vue"
import TagsForm from "@/components/documents/tags-form.vue"
import CategoryForm from "@/components/documents/category-form.vue"
import BaseButton from "@/components/base/button.vue"
import BaseLoader from "@/components/base/loader.vue"
import FormInput from "@/components/form/input.vue"
import FormLabel from "@/components/form/label.vue"
import FormText from "@/components/form/text.vue"
import FormPill from "@/components/form/pill.vue"
import FormSelect from "@/components/form/select.vue"
import FormCheckbox from "@/components/form/checkbox.vue"
import FormDropdown from "@/components/form/dropdown.vue"
import DocumentInput from "@/components/form/document.vue"
import {
  type DocumentForm,
  type Collaborator,
  useDocumentStore,
} from "@/stores/documents"
import { computed, onMounted, ref } from "vue"
import { useUserStore, type User } from "@/stores/users"
import { useAuthStore } from "@/stores/auth"
import { Form, useForm } from "vee-validate"
import { X, Info, Edit } from "lucide-vue-next"
import * as yup from "yup"
import { useTagStore } from "@/stores/tags"
import { useCategoryStore } from "@/stores/categories"
import { watch } from "vue"

export interface DocumentFormPayload {
  file: File | null
  data: DocumentForm
  collaborators?: string[]
}

const props = withDefaults(
  defineProps<{
    form: DocumentForm & { collaborators?: Collaborator[] }
  }>(),
  {},
)

const isUpdate = computed(() => props.form?.id)
const collaborators = ref<string[]>([])

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
  category: yup.string().required("Category is required"),
  tags: yup.array().of(yup.string()),
  file: yupFileSChema,
})

const { errors, defineField, resetForm, handleSubmit } = useForm<
  DocumentForm & { file: File }
>({
  validationSchema: schema,
})

const [name] = defineField("name")
const [details] = defineField("details")
const [is_draft] = defineField("is_draft")
const [is_public] = defineField("is_public")
const [category] = defineField("category")
const [tags] = defineField("tags")
const [file] = defineField("file")

const emit = defineEmits(["submit"])

const store = useDocumentStore()
const userStore = useUserStore()
const auth = useAuthStore()
const tagsStore = useTagStore()
const categoryStore = useCategoryStore()

const loading = computed(() => store.loadingSingle)

const hasCollaborators = ref(false)
const users = ref<User[]>([])
const userQuery = ref<string>("")

const displayedUsers = computed(() => {
  const r = users.value.filter((u) => {
    const v = userQuery.value.toLowerCase()
    return (
      u.id !== auth.user?.id &&
      (u.name?.toLowerCase().includes(v) || u.email.toLowerCase().includes(v))
    )
  })

  if (userQuery.value.length) {
    return r
  } else {
    return r.splice(0, 4)
  }
})

const displayedCollaborators = computed(() => {
  if (!collaborators.value) {
    return []
  }

  return users.value.filter(
    (u) =>
      collaborators.value instanceof Array &&
      collaborators.value.includes(u.id),
  )
})

const removeSelectedCollaborator = (index: number) => {
  collaborators.value?.splice(index, 1)
}

const getUsers = async () => {
  const _u = await userStore.getUsers()

  if (_u) {
    users.value = _u
  }
}

const submit = handleSubmit((values) => {
  const file = values.file
  const data = { ...values, file: undefined, collaborators: undefined }
  emit("submit", {
    data,
    file,
    collaborators: collaborators.value,
  })
})
const tagsList = computed(() => tagsStore.tags)
const showTagsModal = ref(false)
const showCategoriesModal = ref(false)

const categoriesList = computed(() => categoryStore.categories)

const handleCollaborationChange = async (v: boolean) => {
  if (v) {
    await getUsers()
  } else {
    collaborators.value = []
  }
}

onMounted(tagsStore.getTags)
onMounted(categoryStore.getCategories)

watch(categoriesList, (v) => {
  if (!category.value) {
    resetForm({
      values: {
        category: v[0].id,
      },
    })
  }
})

onMounted(async () => {
  if (props.form && props.form.id) {
    resetForm({ values: props.form })
  } else {
    resetForm({
      values: {
        name: "",
        details: "",
        is_draft: false,
        is_public: false,
        tags: [],
        category: null,
      },
    })
  }

  if (props.form?.collaborators && props.form.collaborators.length > 0) {
    hasCollaborators.value = true
    collaborators.value = props.form.collaborators.map((c) => c.id)
    await getUsers()
  }
})
</script>
