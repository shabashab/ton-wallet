<script setup lang="ts">
import AppNavigation from '~/components/app/app-navigation.vue'
import AppHeader from '~/components/app/app-header.vue'

/* Models */

/* Props and Emits */

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
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
