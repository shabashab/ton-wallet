<script setup lang="ts">
import MnemonicsWordInput from '~/components/setup/mnemonics-word-input.vue'
import UiButton from '~/components/ui/ui-button.vue'
import BackButton from '~/components/setup/back-button.vue'

/* Models */

/* Props and Emits */

/* Composables */
const router = useRouter()
const setupStore = useSetupStore()

/* Refs and Reactive Variables */
const inputValues = ref<string[]>(['', '', '', ''])
const inputValuesError = ref(false)

/* Computed Properties */

/* Methods */
const onConfirmButtonClick = async () => {
  const verificationResult = setupStore.verifyMnemonicsValues(inputValues.value)

  if (!verificationResult) {
    inputValuesError.value = true
    inputValues.value = ['', '', '', '']
    setupStore.generateMnemonicsVerifyIndexes()
    return
  }

  await router.push('/setup/password')
}

/* Lifecycle Hooks */
setupStore.generateMnemonicsVerifyIndexes()
</script>

<template>
  <div class="pt-8 pb-4">
    <h1 class="text-center font-semibold text-2xl">Confirm your mnemonics</h1>
    <span class="text-sm opacity-50 text-center"
      >Enter 4 words from your mnemonics to confirm that you saved it</span
    >
    <div v-if="inputValuesError" class="text-red-500 pt-4 text-center">
      You entered some of your mnemonics words invalidly. Please, try again
    </div>
    <div
      v-if="setupStore.mnemonicsVerifyIndexes"
      class="flex flex-col items-stretch gap-3 pt-8 pb-8"
    >
      <MnemonicsWordInput
        v-for="(index, arrayIndex) of setupStore.mnemonicsVerifyIndexes"
        :key="index"
        v-model="inputValues[arrayIndex]"
        :index="index + 1"
      />
    </div>
    <UiButton class="w-full mt-4" size="large" @click="onConfirmButtonClick"
      >Confirm</UiButton
    >
    <BackButton />
  </div>
</template>

<style scoped></style>
