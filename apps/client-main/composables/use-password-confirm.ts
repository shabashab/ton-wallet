import type { DeepReadonly } from 'vue'

export const passwordConfirmInjectionSymbol = Symbol()

export interface PasswordConfirmInjection {
  displayPasswordConfirmationDialog: DeepReadonly<Ref<boolean>>

  tryConfirmPassword: () => Promise<string | undefined>
  submitPasswordConfirmationResult: (value: string | undefined) => void
}

export const usePasswordConfirmation = () => {
  const injection = inject<PasswordConfirmInjection>(
    passwordConfirmInjectionSymbol
  )

  if (!injection) {
    throw new Error('Failed not inject password confirmation context. Terminal')
  }

  return () => injection.tryConfirmPassword()
}
