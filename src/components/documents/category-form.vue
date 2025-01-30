<template>
  <base-modal v-model:show="show" title="Category form">
    <Form @submit="submit()">
      <div class="space-y-4">
        <base-alert v-if="store.error" variant="error">
          <p>{{ store.error }}</p>
        </base-alert>
        <form-input label="Category name" v-model="name" :error="errors.name" />
        <form-text
          label="Category details"
          v-model="details"
          :error="errors.details"
        />
        <div class="flex justify-end">
          <base-button :loading="store.loading">
            <template v-if="isEdit">
              <span>Update category</span>
              <Edit2 />
            </template>
            <template v-else>
              <span>Add category</span>
              <Plus />
            </template>
          </base-button>
        </div>
      </div>

      <div class="mt-10 space-y-4">
        <h1 class="text-lg font-secondary font-medium">
          Current added categories
        </h1>
        <div v-if="categories.length" class="flex flex-wrap gap-4">
          <div
            v-for="item in categories"
            :key="item.id"
            class="rounded-full border inline-flex items-center space-x-2 border-slate-600 text-slate-600 px-4 py-1.5 font-medium font-secondary cursor-default"
          >
            <span>{{ item.name }}</span>
            <button
              type="button"
              class="hover:text-indigo-600 hover:bg-indigo-100 rounded p-1"
              @click="editItem(item.id)"
            >
              <Edit2 :size="16" />
            </button>
          </div>
        </div>
        <p
          class="text-center p-4 text-sm font-secondary text-slate-600 bg-slate-100 rounded-lg"
        >
          Nothing added for now
        </p>
      </div>
    </Form>
  </base-modal>
</template>
<script lang="ts" setup>
import BaseModal from "@/components/base/modal.vue"
import BaseAlert from "@/components/base/alert.vue"
import BaseButton from "@/components/base/button.vue"
import FormInput from "@/components/form/input.vue"
import FormText from "@/components/form/text.vue"
import { Form, useForm } from "vee-validate"
import * as yup from "yup"
import { computed, ref, watch } from "vue"
import { Edit2, Plus } from "lucide-vue-next"
import { useCategoryStore } from "@/stores/categories"

const store = useCategoryStore()

const categories = computed(() => store.categories)

const schema = yup.object({
  name: yup
    .string()
    .required("Category name is required")
    .notOneOf(
      categories.value.map((c) => c.name),
      "This category has already been created",
    ),
  details: yup.string(),
})

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
})

const show = defineModel<boolean>({ default: false })

const editableId = ref<string | null>(null)
const isEdit = computed(() => editableId.value !== null)

const [name] = defineField("name")
const [details] = defineField("details")

const submit = handleSubmit(async ({ name, details }) => {
  let success
  if (editableId.value) {
    success = await store.updateCategory(editableId.value, {
      name,
      details,
    })
  } else {
    success = await store.createCategory({ name, details })
  }

  if (success) {
    reset()
  }
})

const editItem = (id: string) => {
  const item = categories.value.find((c) => c.id === id)
  if (!item) {
    return
  }

  editableId.value = id
  const { name, details } = item

  resetForm({
    values: {
      name,
      details,
    },
  })
}

const reset = () => {
  resetForm({
    values: {
      name: "",
      details: "",
    },
  })

  editableId.value = null
}

watch(show, reset)
</script>
