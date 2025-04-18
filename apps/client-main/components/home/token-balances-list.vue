<script setup lang="ts">
import ListItem from './token-balances-list/list-item.vue'
import ListSeparator from './token-balances-list/list-separator.vue'

/* Models */

/* Props and Emits */

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 p-4 bg-white/10 rounded-xl">
    <ListItem
      token-name="TON"
      token-symbol="TON"
      :token-amount="10.14"
      :usd-amount="101.4"
    />
    <ListSeparator />
    <ListItem
      token-name="Tether USD"
      token-symbol="USDT"
      :token-amount="1000.145"
      :usd-amount="1000.14"
    />
    <ListSeparator />
    <ListItem
      token-name="STONfi"
      token-symbol="STON"
      :token-amount="10"
      :usd-amount="12"
    />
  </div>
</template>

<style scoped></style>
