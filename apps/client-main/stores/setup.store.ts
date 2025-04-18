import { mnemonicNew } from '@ton/crypto'

const MNEMONIC_WORDS_COUNT = 24

export const useSetupStore = defineStore('setup', () => {
  const setupMnemonics = ref<string[]>()

  const generateMnemonics = async () => {
    const mnemonics = await mnemonicNew(MNEMONIC_WORDS_COUNT)
    setupMnemonics.value = mnemonics
  }

  return {
    setupMnemonics,
    generateMnemonics,
  }
})
