<script setup lang="ts">
import BackButton from '~/components/setup/back-button.vue'
import SetupMnemonicsDisplay from '~/components/setup/mnemonics-display.vue'
import UiButton from '~/components/ui/ui-button.vue'

/* Models */

/* Props and Emits */

/* Composables */
const router = useRouter()
const setupStore = useSetupStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onContinueButtonClick = async () => {
  await router.push('/setup/mnemonics-confirm')
}

/* Lifecycle Hooks */

await setupStore.generateMnemonics()
</script>

<template>
  <div class="pt-8 pb-4">
    <h1 class="text-center font-semibold text-2xl">
      Write your mnemonics down
    </h1>
    <span class="text-sm opacity-50 text-center"
      >Mnemonics (or seed phrase) is your wallet's key for new wallets. Write it
      down in a secret place. It can be used in order to restore your wallets
      later</span
    >
    <div class="pt-16 pb-12">
      <SetupMnemonicsDisplay
        v-if="setupStore.setupMnemonics"
        :mnemonics="setupStore.setupMnemonics"
      />
    </div>
    <UiButton class="w-full" size="large" @click="onContinueButtonClick"
      >Continue</UiButton
    >
    <BackButton />
  </div>
</template>

<style scoped></style>
