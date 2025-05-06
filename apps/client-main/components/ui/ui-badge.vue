<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const variants = cva('inline-block px-2 py-1 font-semibold rounded-md', {
  variants: {
    badgeStyle: {
      neutral: 'bg-slate-500/80 text-slate-100',
      warning: 'bg-amber-400/80 text-amber-100',
    },
    size: {
      md: 'text-base',
      sm: 'text-sm',
    },
  },
})

/* Models */

/* Props and Emits */
const props = withDefaults(
  defineProps<{
    badgeStyle?: VariantProps<typeof variants>['badgeStyle']
    size?: VariantProps<typeof variants>['size']
  }>(),
  {
    badgeStyle: 'neutral',
    size: 'md',
  }
)

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div :class="variants({ badgeStyle: props.badgeStyle, size: props.size })">
    <slot />
  </div>
</template>

<style scoped></style>
