<template>
  <base-modal v-model:show="show" title="Tags form">
    <Form @submit="addTag()">
      <div class="space-y-2">
        <form-input label="Tag name" v-model="name" :error="errors.name" />
        <div class="flex justify-end">
          <base-button :loading="store.loading">
            <span>Add tag</span>
            <Plus />
          </base-button>
        </div>
      </div>

      <div class="mt-10 space-y-4">
        <h1 class="text-lg font-secondary font-medium">Current tags</h1>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="item in tags"
            :key="item.id"
            class="rounded-full border border-slate-600 text-slate-600 px-4 py-1.5 font-medium font-secondary cursor-default"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </Form>
  </base-modal>
</template>
<script lang="ts" setup>
import BaseModal from "@/components/base/modal.vue"
import BaseButton from "@/components/base/button.vue"
import FormInput from "@/components/form/input.vue"
import { useTagStore } from "@/stores/tags"
import { Form, useForm } from "vee-validate"
import * as yup from "yup"
import { computed } from "vue"
import { Plus } from "lucide-vue-next"

const store = useTagStore()

const tags = computed(() => store.tags)

const schema = yup.object({
  name: yup
    .string()
    .required("Tag name is required")
    .notOneOf(
      tags.value.map((t) => t.name),
      "This tag has already been created",
    ),
})

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
})

const [name] = defineField("name")

const addTag = handleSubmit(async ({ name }) => {
  const success = await store.createTag({ name })
  if (success) {
    resetForm({
      values: {
        name: "",
      },
    })
  }
})

const show = defineModel<boolean>({ default: false })
</script>
