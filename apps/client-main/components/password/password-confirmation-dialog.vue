<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import UiTextInput from '../ui/ui-text-input.vue'
import UiButton from '../ui/ui-button.vue'
import { required, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

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
  <DialogRoot :open="displayDialog" @update:open="onDialogOpenStateChange">
    <DialogPortal>
      <AnimatePresence multiple>
        <DialogOverlay class="bg-black/10 fixed inset-0" as-child>
          <Motion
            :initial="{ opacity: 0 }"
            :exit="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
          />
        </DialogOverlay>

        <DialogContent
          class="fixed inset-x-0 bg-slate-800 text-white font-main rounded-t-lg"
          as-child
        >
          <Motion
            :initial="{ opacity: 0, bottom: '-100%' }"
            :animate="{ opacity: 1, bottom: '0' }"
            :exit="{ opacity: 0, bottom: '-100%' }"
            class="p-6"
          >
            <DialogTitle as="h2" class="font-bold text-2xl"
              >Enter password</DialogTitle
            >
            <DialogDescription as="p" class="text-white/50 text-sm mt-2">
              Enter password to unlock you wallet and continue with action
            </DialogDescription>
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
          </Motion>
        </DialogContent>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped></style>
