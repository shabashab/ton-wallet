<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const walletsStore = useWalletsStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
await walletsStore.loadCloudStorageWallets()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
