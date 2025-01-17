<template>
  <div>
    <form-label v-if="label" :for="id">
      {{ label }}
      <span v-if="required">&ast;</span>
    </form-label>
    <div>
      <component :is="comp" :name class="form-input" v-model="model" :type :id :placeholder :disabled :required ref="input"></component>
    </div>
    <form-error v-if="error">{{ error }}</form-error>
  </div>
</template>
<script setup lang="ts">
import useCustomId from '@/composables/useCustomId';
import FormLabel from '@/components/form/label.vue';
import FormError from '@/components/form/error.vue';
import { computed, onMounted, ref } from 'vue';
import { Field } from 'vee-validate';

const props = withDefaults(defineProps<{
  label?: string | undefined;
  error?: string | undefined;
  type?: string | undefined;
  name: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean;
  required?: boolean;
  novalidate?: boolean;
}>(), {
  type: 'text'
})

const id = ref();

const model = defineModel<string | null | undefined>();

const input = ref<HTMLInputElement | null>(null);

const comp = computed(() => !props.novalidate && !props.name ? 'input' : Field)
onMounted(() => {
  if (input.value?.hasAttribute('autofocus')) {
    input.value?.focus();
  }

  id.value = useCustomId()
});

defineExpose({ focus: () => input.value?.focus() });
</script>
