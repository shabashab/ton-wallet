<script setup lang="ts">
import AppNavigation from '~/components/app/app-navigation.vue'
import AppHeader from '~/components/app/app-header.vue'

/* Models */

/* Props and Emits */

/* Composables */
const walletsStore = useWalletsStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
if (walletsStore.loadedWallets.length === 0) {
  await navigateTo('/setup')
}
</script>

<template>
  <div class="container font-main bg-slate-900 min-h-screen text-white">
    <AppHeader />

    <div class="px-4">
      <slot />
    </div>

    <AppNavigation />
  </div>
</template>

<style scoped></style>
