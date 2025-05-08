<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion-v'
import type { ButtonHTMLAttributes } from 'vue'

const variants = cva(
  'rounded-xl flex items-center gap-2 justify-center hover:cursor-pointer',
  {
    variants: {
      buttonStyle: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-blue-500/10 text-blue-300',
        neutral: 'bg-slate-400',
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

  type?: ButtonHTMLAttributes['type']
}>()

const emit = defineEmits(['click'])

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <motion.button
    :class="variants({ buttonStyle: props.buttonStyle, size: props.size })"
    :press="{ scale: 0.95 }"
    :hover="{ scale: 1.05 }"
    :type="props.type"
    @click="emit('click')"
  >
    <span><slot /></span>
    <Icon v-if="props.icon" class="text-3xl" :name="props.icon" />
  </motion.button>
</template>

<style scoped></style>
