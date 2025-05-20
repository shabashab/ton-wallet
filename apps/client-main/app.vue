<script setup lang="ts">
import { ToastProvider, ToastViewport } from 'reka-ui'
import AppToast from './components/app/app-toast.vue'

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

// eslint-disable-next-line unicorn/prefer-top-level-await
settingsStore.loadSettingsFromLocalStorage().catch((error: unknown) => {
  console.error(error)
})
</script>

<template>
  <ToastProvider swipe-direction="up" :duration="3000">
    <AppToast />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ToastViewport
      class="fixed top-0 right-0 flex flex-col px-2 pt-2 gap-[10px] w-[100vw] m-0 list-none z-[2147483647] outline-none"
    />
  </ToastProvider>
</template>

<style scoped></style>
