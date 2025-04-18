<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const variants = cva(
  'rounded-xl flex items-center gap-2 justify-center hover:cursor-pointer transition-colors duration-200',
  {
    variants: {
      buttonStyle: {
        primary: 'bg-blue-500 text-white hover:bg-blue-700',
        secondary: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300',
      },
      size: {
        medium: 'py-2 px-4',
        large: 'py-3 px-6',
      },
    },
    defaultVariants: {
      buttonStyle: 'primary',
      size: 'medium',
    },
  }
)

/* Models */

/* Props and Emits */
const props = defineProps<{
  icon?: string

  buttonStyle?: VariantProps<typeof variants>['buttonStyle']
  size?: VariantProps<typeof variants>['size']
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <button
    :class="variants({ buttonStyle: props.buttonStyle, size: props.size })"
  >
    <span><slot /></span>
    <Icon v-if="props.icon" class="text-3xl" :name="props.icon" />
  </button>
</template>

<style scoped></style>
