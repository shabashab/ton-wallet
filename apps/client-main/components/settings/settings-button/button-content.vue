<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

/* Models */

const contentVariants = cva('flex justify-between items-center', {
  variants: {
    itemStyle: {
      neutral: 'text-white',
      danger: 'text-red-500',
    },
  },
})

/* Props and Emits */
const props = defineProps<{
  label: string
  currentValue?: string
  itemStyle: VariantProps<typeof contentVariants>['itemStyle']
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div :class="contentVariants({ itemStyle: props.itemStyle })">
    <div>{{ props.label }}</div>
    <div class="flex items-center gap-2">
      <div class="opacity-80 text-sm">
        {{ props.currentValue }}
      </div>
      <Icon class="opacity-50" name="material-symbols-light:chevron-right" />
    </div>
  </div>
</template>

<style scoped></style>
