<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { cva, type VariantProps } from 'class-variance-authority'
import ButtonContent from './settings-button/button-content.vue'

const wrapperVariants = cva('p-4 rounded-xl transition-colors duration-200', {
  variants: {
    itemStyle: {
      neutral: 'bg-white/10 hover:bg-white/20',
      danger: 'bg-red-900/10 hover:bg-red-900/20',
    },
  },
})

/* Models */

/* Props and Emits */
const props = withDefaults(
  defineProps<{
    label: string
    currentValue?: string
    to?: RouteLocationRaw
    itemStyle?: VariantProps<typeof wrapperVariants>['itemStyle']
  }>(),
  {
    currentValue: undefined,
    to: undefined,
    itemStyle: 'neutral',
  }
)

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :class="wrapperVariants({ itemStyle: props.itemStyle })"
    :to="props.to"
  >
    <ButtonContent v-bind="props" />
  </NuxtLink>
  <button v-else :class="wrapperVariants({ itemStyle: props.itemStyle })">
    <ButtonContent v-bind="props" />
  </button>
</template>

<style scoped></style>
