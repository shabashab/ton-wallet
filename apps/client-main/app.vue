<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const walletsStore = useWalletsStore()
const settingsStore = useSettingsStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
await walletsStore.loadCloudStorageWallets()
settingsStore.loadSettingsFromLocalStorage()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped></style>
