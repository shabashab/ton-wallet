<script setup lang="ts">
import type { Action } from '@ton-api/client'
import TransactionAction from './transaction-actions/transaction-action.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  actions: Action[]
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="space-y-2">
    <TransactionAction
      v-for="(action, index) of props.actions"
      :key="index"
      :action
    />
  </div>
</template>

<style scoped></style>
