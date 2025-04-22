<script setup lang="ts">
import UiButton from '~/components/ui/ui-button.vue'

/* Models */

/* Props and Emits */

/* Composables */

/* Refs and Reactive Variables */
const router = useRouter()

/* Computed Properties */

/* Methods */
const onGoToWalletButtonClick = async () => {
  await router.push('/')
}

/* Lifecycle Hooks */
</script>

<template>
  <div class="h-screen grid place-items-center">
    <div>
      <h1 class="text-center font-semibold text-2xl">Congratulations!</h1>
      <div class="text-sm opacity-50 text-center pt-3">
        You have completed everything to start using your wallet!
      </div>
      <UiButton
        class="w-full mt-8"
        size="large"
        @click="onGoToWalletButtonClick"
        >Go to wallet</UiButton
      >
    </div>
  </div>
</template>

<style scoped></style>
