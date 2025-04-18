<script setup lang="ts">
import ActionButtons from '~/components/home/action-buttons.vue'
import TokenBalancesList from '~/components/home/token-balances-list.vue'

/* Models */

/* Props and Emits */

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="flex flex-col items-stretch gap-4">
    <!-- Balance -->
    <div class="flex flex-col items-center gap-2 py-8">
      <div class="flex flex-row items-end gap-1">
        <span class="text-white font-bold text-5xl">100.34</span>
        <span class="text-white font-medium opacity-50 text-3xl">$</span>
      </div>
      <div class="text-white/70">Your balance</div>
    </div>

    <!-- Action buttons -->
    <ActionButtons />

    <!-- Balances -->
    <TokenBalancesList />
  </div>
</template>

<style scoped></style>
