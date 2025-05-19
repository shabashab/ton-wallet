<script setup lang="ts">
import ActionGeneric from './action-generic.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  amount: number
  direction: 'receive' | 'send'
  currency: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */
const title = computed(() => {
  return props.direction === 'receive' ? 'Received' : 'Sent'
})

const value = computed(() => {
  return `${props.direction === 'receive' ? '+' : '-'} ${props.amount} ${props.currency}`
})

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <ActionGeneric
    :title
    :value
    :icon="
      props.direction === 'receive'
        ? 'material-symbols:arrow-downward-rounded'
        : 'material-symbols:arrow-upward-rounded'
    "
    :value-variant="props.direction === 'receive' ? 'success' : 'error'"
  />
</template>

<style scoped></style>
