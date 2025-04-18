<script setup lang="ts">
import UiButton from '~/components/ui/ui-button.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  label: string
  icon: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <UiButton :icon="props.icon">{{ label }}</UiButton>
</template>

<style scoped></style>
