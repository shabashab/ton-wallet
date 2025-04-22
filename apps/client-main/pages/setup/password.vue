<script setup lang="ts">
import UiButton from '~/components/ui/ui-button.vue'
import UiTextInput from '~/components/ui/ui-text-input.vue'
import { required, minLength, sameAs } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

/* Models */

/* Props and Emits */

/* Composables */
const router = useRouter()
const setupStore = useSetupStore()

/* Refs and Reactive Variables */
const formData = reactive({
  password: '',
  passwordRepeat: '',
})

const formDataRules = computed(() => ({
  password: {
    required,
    minLength: minLength(8),
  },
  passwordRepeat: {
    required,
    sameAs: sameAs(formData.password),
  },
}))

const vuelidate = useVuelidate(formDataRules, formData)

/* Computed Properties */

/* Methods */
const onFormSubmit = async () => {
  vuelidate.value.$touch()

  if (vuelidate.value.$error) {
    return
  }

  await setupStore.finishSetupWithPassword(formData.password)
  await router.push('/setup/congratulations')
}

/* Lifecycle Hooks */
</script>

<template>
  <div class="pt-8 pb-4">
    <h1 class="text-center font-semibold text-2xl">One final step</h1>

    <div class="text-sm opacity-50 text-center pt-3">
      You have successfuly set up your wallet! In order to securely synchronize
      your wallets between devices, you need to set up a password.
      <br />
      <br />
      <b class="text-red-500"
        >IMPORTANT: store your password safely and reliably, you wouldn't be
        able to restore it in case of loss</b
      >
    </div>

    <form
      class="flex flex-col items-stretch gap-3 pt-10"
      @submit.prevent="onFormSubmit"
    >
      <UiTextInput
        v-model="formData.password"
        label="Password"
        name="password"
        type="password"
        :error="vuelidate.password.$errors"
      />
      <UiTextInput
        v-model="formData.passwordRepeat"
        label="Repeat password"
        name="password-repeat"
        type="password"
        :error="vuelidate.passwordRepeat.$errors"
      />
      <UiButton size="large">Finish setup</UiButton>
    </form>
  </div>
</template>

<style scoped></style>
