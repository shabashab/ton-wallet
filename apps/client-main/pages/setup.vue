<script setup lang="ts">
import UiButton from '~/components/ui/ui-button.vue'

definePageMeta({
  layout: 'setup',
})

/* Models */

/* Props and Emits */

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="min-h-screen flex flex-col items-center">
    <div class="font-semibold text-4xl text-center pb-16 pt-20">
      Welcome to TON Wallet!
    </div>
    <div class="text-lg opacity-70 text-center">
      Unleash next generation of TON blockchain experience!
    </div>
    <div class="flex-1"></div>
    <UiButton class="w-full mb-10" size="large"> Create a wallet </UiButton>
  </div>
</template>

<style scoped></style>
