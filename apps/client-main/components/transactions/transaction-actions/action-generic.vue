<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const valueVariants = cva('', {
  variants: {
    valueStyle: {
      neutral: 'text-white',
      success: 'text-green-400',
      error: 'text-red-400',
    },
  },
})

const titleVariants = cva('', {
  variants: {
    titleStyle: {
      default: 'text-white',
      failed: 'text-red-400',
    },
  },
})

const iconVariants = cva('grid place-items-center', {
  variants: {
    iconStyle: {
      default: '',
      failed: 'text-red-400',
    },
  },
})

/* Models */

/* Props and Emits */
const props = defineProps<{
  title: string
  value?: string
  icon?: string
  failed?: boolean
  valueVariant?: VariantProps<typeof valueVariants>['valueStyle']
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="flex flex-row items-center text-sm font-semibold gap-2">
    <div
      v-if="props.icon || props.failed"
      :class="iconVariants({ iconStyle: props.failed ? 'failed' : 'default' })"
    >
      <Icon :name="props.failed ? 'mingcute:warning-fill' : props.icon" />
    </div>
    <div
      :class="
        titleVariants({ titleStyle: props.failed ? 'failed' : 'default' })
      "
    >
      {{ props.title }} {{ props.failed ? '(fail)' : undefined }}
    </div>
    <div class="flex-1"></div>
    <div :class="valueVariants({ valueStyle: props.valueVariant })">
      {{ props.value }}
    </div>
  </div>
</template>

<style scoped></style>
