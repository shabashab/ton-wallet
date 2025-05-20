export default defineNuxtPlugin((nuxtApp) => {
  const displayedToast = ref<ToastInfo | undefined>()

  const addToast = (info: ToastInfo) => {
    displayedToast.value = info
  }

  const removeToast = () => {
    displayedToast.value = undefined
  }

  nuxtApp.vueApp.provide(toastInjectionSymbol, {
    displayedToast,
    addToast,
    removeToast,
  } satisfies ToastInjection)
})
