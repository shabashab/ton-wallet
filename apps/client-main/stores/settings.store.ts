import type { NetworkType } from '~/models/network-type.model'
import type { SavedSettings } from '~/types/saved-settings.type'

const SETTINGS_LOCAL_STORAGE_KEY = 'settings'

export const useSettingsStore = defineStore('settings', () => {
  const networkStore = useNetworkStore()

  const currentNetwork = computed(() => networkStore.currentNetwork)

  const updateCurrentNetwork = async (currentNetwork: NetworkType) => {
    await networkStore.updateCurrentNetwork(currentNetwork)
    saveSettingsToLocalStorage()
  }

  const saveSettingsToLocalStorage = () => {
    const savedSettings: SavedSettings = {
      version: 1,
      currentNetwork: networkStore.currentNetwork,
    }

    const serializedSavedSettings = JSON.stringify(savedSettings)

    localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, serializedSavedSettings)
  }

  const loadSettingsFromLocalStorage = async () => {
    const serializedSavedSettings = localStorage.getItem(
      SETTINGS_LOCAL_STORAGE_KEY
    )

    if (!serializedSavedSettings) {
      return
    }

    const savedSettings: SavedSettings = JSON.parse(serializedSavedSettings)

    await networkStore.updateCurrentNetwork(savedSettings.currentNetwork)
  }

  return {
    currentNetwork,

    updateCurrentNetwork,
    loadSettingsFromLocalStorage,
  }
})
