<script setup lang="ts">
import type { Action } from '@ton-api/client'

/* Models */

/* Props and Emits */
const props = defineProps<{
  action: Action
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="flex justify-between items-center text-sm">
    <span>
      {{ props.action.simplePreview.name }}
    </span>
    <span class="font-semibold uppercase">
      {{ props.action.simplePreview.value }}
    </span>
  </div>
</template>

<style scoped></style>
