<script setup lang="ts">
import UiTextInput from '../ui/ui-text-input.vue'
import UiButton from '../ui/ui-button.vue'
import { required, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'

/* Models */

/* Props and Emits */

/* Composables */
const passwordConfirmInjection = inject<PasswordConfirmInjection>(
  passwordConfirmInjectionSymbol
)
const passwordStore = usePasswordStore()

/* Refs and Reactive Variables */
const enteredPassword = ref('')
const lastInvalidEnteredPassword = ref<string | undefined>(undefined)

/* Computed Properties */
const validationSchema = computed(() => ({
  enteredPassword: {
    required,
    validPassword: helpers.withMessage(
      'Invalid password',
      (value) => value !== lastInvalidEnteredPassword.value
    ),
  },
}))

const displayDialog = computed(() => {
  return !!passwordConfirmInjection?.displayPasswordConfirmationDialog.value
})

const onDialogOpenStateChange = (value: boolean) => {
  if (value) {
    return
  }

  onDialogClose()
}

const onDialogClose = () => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  passwordConfirmInjection?.submitPasswordConfirmationResult(undefined)
}

const onFormSubmit = async () => {
  vuelidate.value.$touch()

  if (vuelidate.value.$error) {
    return
  }

  const passwordVerificationResult = await passwordStore.verifyPassword(
    enteredPassword.value
  )

  if (!passwordVerificationResult) {
    lastInvalidEnteredPassword.value = enteredPassword.value
    return
  }

  passwordConfirmInjection?.submitPasswordConfirmationResult(
    enteredPassword.value
  )

  vuelidate.value.$reset()
  enteredPassword.value = ''
}

const onPasswordConfirmationCancel = () => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  passwordConfirmInjection?.submitPasswordConfirmationResult(undefined)
}

/* Methods */

/* Lifecycle Hooks */
const vuelidate = useVuelidate(
  validationSchema,
  computed(() => ({ enteredPassword: enteredPassword.value }))
)

watch(displayDialog, () => {
  vuelidate.value.$reset()
})

watch(enteredPassword, () => {
  lastInvalidEnteredPassword.value = undefined
})
</script>

<template>
  <UiBottomDialog
    title="Enter password"
    description="Enter password to unlock you wallet and continue with action"
    content-class="z-10"
    :open="displayDialog"
    @update:open="onDialogOpenStateChange"
  >
    <form
      class="flex flex-col items-stretch gap-4 pt-10 pb-2"
      @submit.prevent="onFormSubmit"
    >
      <UiTextInput
        v-model="enteredPassword"
        name="password"
        label="Your password"
        type="password"
        :error="vuelidate.enteredPassword.$errors"
      />
      <div class="grid grid-cols-2 gap-4">
        <UiButton
          button-style="neutral"
          type="button"
          @click="onPasswordConfirmationCancel"
        >
          Cancel
        </UiButton>
        <UiButton type="submit"> Submit </UiButton>
      </div>
    </form>
  </UiBottomDialog>
</template>

<style scoped></style>
