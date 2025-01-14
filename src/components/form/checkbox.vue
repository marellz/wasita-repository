<template>
  <div>
    <label :for="id" class="flex items-center">
      <input class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" type="checkbox" :value :required
        :disabled :name :id v-model="model">
      <slot>
        <p class="ml-2 text-sm text-gray-600">
          {{ label }}
        </p>
      </slot>
    </label>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId';
import { onMounted, ref, watch } from 'vue';

defineProps<{
  label?: string;
  name?: string;
  value?: boolean | string | number;
  required?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits(['change'])

const model = defineModel()
const id = ref()

watch(model, (v) => {
  emit('change', v)
})

onMounted(() => {
  id.value = useCustomId()
})
</script>
