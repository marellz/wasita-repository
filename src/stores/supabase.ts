import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useSupabaseStore = defineStore('supabase', () => {
  console.log('heah')
  const env = import.meta.env.VITE_TEST_ENV
  const url = computed(() => 'Pinia store')

  return { url, env }
})
