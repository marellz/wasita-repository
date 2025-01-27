<template>
  <Hero title="Styleguide"> </Hero>
  <Container>
    <layout-card>
      <div class="space-y-10">
        <h1 class="font-medium font-secondary">Buttons</h1>

        <div class="flex flex-wrap gap-10">
          <div
            v-for="({ variant, label }, key) in buttons"
            :key
            class="p-4 rounded-xl"
            :class="{ 'bg-black': variant === 'white-outline' }"
          >
            <base-button :variant>
              {{ label }}
            </base-button>
          </div>
        </div>
        <h1 class="font-medium text-slate-600">(disabled)</h1>
        <div class="flex flex-wrap gap-10">
          <div
            v-for="({ variant, label }, key) in buttons"
            :key
            class="p-4"
            :class="{ 'bg-black': variant === 'white-outline' }"
          >
            <base-button :variant disabled>
              {{ label }}
            </base-button>
          </div>
        </div>
      </div>
    </layout-card>
  </Container>
</template>
<script lang="ts" setup>
import Hero from "@/components/layout/hero.vue"
import Container from "@/components/layout/container.vue"
import LayoutCard from "@/components/layout/card.vue"
import BaseButton, { type BtnVariants } from "@/components/base/button.vue"

const buttons: { label: string; variant: BtnVariants }[] = [
  {
    label: "Primary",
    variant: "primary",
  },
  {
    label: "Primary outline",
    variant: "primary-outline",
  },
  {
    label: "Secondary",
    variant: "secondary",
  },
  {
    label: "Secondary outline",
    variant: "secondary-outline",
  },
  {
    label: "Danger",
    variant: "danger",
  },
  {
    label: "White",
    variant: "white-outline",
  },
]
</script>
