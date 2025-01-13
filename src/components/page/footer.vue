<template>
  <footer class="bg-black text-white py-4">
    <layout-container>
      <p class="text-center">
        Dev by <a class="inline-flex items-center space-x-1 text-blue-500 p-2 bg-white/20 rounded"
          href="https://dave-njoroge.vercel.app" target="_blank" rel="noopener noreferrer">
          <span>yours truly</span>
          <ExternalLink :size="16" />
        </a>. All
        rights Reserved.
      </p>
    </layout-container>
  </footer>
</template>
<script lang="ts" setup>
import LayoutContainer from '@/components/layout/container.vue';
import { ExternalLink } from 'lucide-vue-next';
</script>
