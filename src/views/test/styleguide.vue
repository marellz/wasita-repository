<template>
  <Hero title="Styleguide" />
  <Container>
    <base-tabs :tabs>
      <template #buttons>
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
      </template>
      <template #toasts>
        <layout-card>
          <div class="space-y-10">
            <h1 class="font-medium font-secondary">Toasts</h1>
            <div class="flex flex-wrap gap-10">
              <base-button
                @click="
                  toasts.addInfo(
                    'Info toast',
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus, mauris et varius rutrum, ex eros pellentesque erat, eget luctus eros ligula a nisl.',
                  )
                "
              >
                <span>Info toast</span>
                <ExternalLink />
              </base-button>
              <base-button
                variant="secondary"
                @click="
                  toasts.addSuccess(
                    'Success toast',
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus, mauris et varius rutrum, ex eros pellentesque erat, eget luctus eros ligula a nisl.',
                  )
                "
              >
                <span>Success toast</span>
                <ExternalLink />
              </base-button>
              <base-button
                variant="danger"
                @click="
                  toasts.addError(
                    'Error toasts',
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus, mauris et varius rutrum, ex eros pellentesque erat, eget luctus eros ligula a nisl.',
                  )
                "
              >
                <span>Error toast</span>
                <ExternalLink />
              </base-button>
            </div>
          </div>
        </layout-card>
      </template>
    </base-tabs>
  </Container>
</template>
<script lang="ts" setup>
import Hero from "@/components/layout/hero.vue"
import Container from "@/components/layout/container.vue"
import LayoutCard from "@/components/layout/card.vue"
import BaseButton, { type BtnVariants } from "@/components/base/button.vue"
import BaseTabs from "@/components/base/tabs.vue"
import { ExternalLink } from "lucide-vue-next"
import { useToastsStore } from "@/stores/toasts"

const toasts = useToastsStore()

const tabs = [
  { key: "buttons", label: "Buttons" },
  { key: "toasts", label: "Toasts" },
]

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
