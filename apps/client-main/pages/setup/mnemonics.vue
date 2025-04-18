<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const setupStore = useSetupStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */

console.log('wtf')
await setupStore.generateMnemonics()
</script>

<template>
  <div>
    {{ setupStore.setupMnemonics }}
  </div>
</template>

<style scoped></style>
