<script setup lang="ts">
import NavigationItem from './item.vue'

/* Models */

/* Props and Emits */

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="fixed bottom-0 left-0 w-full p-2">
    <div class="w-full grid grid-flow-col bg-white/5 gap-x-4 rounded-2xl p-2">
      <NavigationItem
        icon="solar:dollar-minimalistic-bold"
        label="Home"
        to="/"
        active
      />
      <NavigationItem
        icon="material-symbols:settings-heart-rounded"
        label="Settings"
        to="/settings"
      />
    </div>
  </div>
</template>

<style scoped></style>
