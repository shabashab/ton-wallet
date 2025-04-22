import type { ErrorObject } from '@vuelidate/core'

export const useFormError = (
  error: Ref<string | ErrorObject | ErrorObject[] | undefined | null>
) => {
  const errorExists = computed(() => {
    if (Array.isArray(error.value)) {
      return error.value.length > 0
    }

    return !!error.value
  })

  const errorMessage = computed(() => {
    if (!error.value) {
      return
    }

    if (Array.isArray(error.value)) {
      return error.value[0].$message
    }

    if (typeof error.value === 'object') {
      return error.value.$message
    }

    return error.value
  })

  return {
    errorExists,
    errorMessage,
  }
}
