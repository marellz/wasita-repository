<template>
  <Container>
    <div class="bg-white rounded-[60px] md:rounded-[100px] rounded-b-xl">
      <button type="button" @click="focusOnImage = !focusOnImage">
        <img src="@/assets/images/about.jpg" alt=""
          class="transform transition ease-in-out rounded-b-none md:rounded-b-[100px] rounded-[60px] md:rounded-[100px] object-cover"
          :class="{ '': focusOnImage }">
      </button>
      <div class="p-6 md:p-10 lg:p-20">
        <page-title class="my-6 lg:my-10">About</page-title>
        <div class="space-y-6 md:text-xl leading-relaxed font-light">
          <p class="text-lg md:text-2xl leading-8 md:leading-10">This repository is the brainchild of our family’s
            collaborative
            spirit,
            created and
            managed
            with
            care and
            precision.
            While I oversee its development and maintenance, the idea was sparked by my uncle Stephen and strongly
            supported
            by
            my uncle John. Together, we recognized the need for a reliable, centralized space to store and manage
            essential
            documents for our new self-help group. This initiative reflects the collective effort of our family to
            stay
            organized and move forward efficiently.</p>
          <p> The need for this repository became evident as important files and discussions often got lost or buried
            in
            the
            flurry of WhatsApp conversations. By creating a dedicated system, we aim to eliminate confusion, ensure
            everyone
            can
            access critical resources when needed, and track responsibilities with clarity. This repository is the
            first
            step
            in
            what we envision as a series of tools to enhance our group’s operations and foster smoother collaboration.
          </p>
          <p>
            At its core, this repository stands on values that define our family: trust, reliability, and
            accessibility.
            Guided
            by honesty, pragmatism, and meritocracy, we strive to create a space that not only meets practical needs
            but
            also
            upholds the shared principles that bind us together. This is more than a storage solution; it’s a
            testament
            to
            our
            commitment to building a better, more organized future for our self-help group.</p>
        </div>
      </div>
    </div>
  </Container>
</template>
<script setup lang="ts">
import PageTitle from '@/components/layout/title.vue';
import Container from '@/components/layout/container.vue';
import { ref } from 'vue';

const focusOnImage = ref(false)
</script>
