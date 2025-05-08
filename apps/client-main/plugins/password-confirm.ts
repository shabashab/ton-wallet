export default defineNuxtPlugin((nuxtApp) => {
  const awaitingConfirmationFunctions: ((value: string | undefined) => void)[] =
    []
  const displayPasswordConfirmationDialog = ref(false)

  const submitPasswordConfirmationResult = (
    confirmationResult: string | undefined
  ) => {
    displayPasswordConfirmationDialog.value = false

    for (const awaitingConfirmationFunction of awaitingConfirmationFunctions) {
      awaitingConfirmationFunction(confirmationResult)
    }
  }

  const tryConfirmPassword = (): Promise<string | undefined> => {
    displayPasswordConfirmationDialog.value = true

    return new Promise<string | undefined>((resolve) => {
      awaitingConfirmationFunctions.push((value) => {
        resolve(value)
      })
    })
  }

  const provide: PasswordConfirmInjection = {
    displayPasswordConfirmationDialog: readonly(
      displayPasswordConfirmationDialog
    ),

    submitPasswordConfirmationResult,
    tryConfirmPassword,
  }

  nuxtApp.vueApp.provide(passwordConfirmInjectionSymbol, provide)
})
