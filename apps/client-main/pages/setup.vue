<script setup lang="ts">
definePageMeta({
  layout: 'setup',
})
/* Models */

/* Props and Emits */

/* Composables */
const route = useRoute()
const setupStore = useSetupStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */

console.log(setupStore.setupMnemonics, route.path)
if (!setupStore.setupMnemonics && route.path !== '/setup') {
  await navigateTo('/setup')
}
</script>

<template>
  <div><NuxtPage></NuxtPage></div>
</template>
