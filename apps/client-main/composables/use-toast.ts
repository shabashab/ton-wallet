export const toastInjectionSymbol = Symbol()

export interface ToastInfo {
  title: string
  description?: string
}

export interface ToastInjection {
  displayedToast: Ref<ToastInfo | undefined>

  addToast: (info: ToastInfo) => void
  removeToast: () => void
}

export const useToast = () => {
  const injection = inject<ToastInjection>(toastInjectionSymbol)

  if (!injection) {
    throw new Error('Failed to inject toast context. Terminal')
  }

  const toast = (info: ToastInfo) => {
    injection.addToast(info)
  }

  return { toast }
}
