export const useWalletSelectionStore = defineStore('wallet-selection', () => {
  const displayWalletSelectionDialog = ref(false)

  return {
    displayWalletSelectionDialog,
  }
})
