import { mnemonicNew } from '@ton/crypto'

const MNEMONIC_WORDS_COUNT = 24

export const useSetupStore = defineStore('setup', () => {
  const passwordStore = usePasswordStore()
  const mnemonicsStore = useMnemonicsStore()
  const walletsStore = useWalletsStore()

  const setupMnemonics = ref<string[]>()

  const mnemonicsVerifyIndexes = ref<number[]>()

  const generateMnemonics = async () => {
    const mnemonics = await mnemonicNew(MNEMONIC_WORDS_COUNT)
    setupMnemonics.value = mnemonics
  }

  const generateMnemonicsVerifyIndexes = () => {
    mnemonicsVerifyIndexes.value = [
      generateRandomInt(0, 6),
      generateRandomInt(6, 12),
      generateRandomInt(12, 18),
      generateRandomInt(18, 24),
    ]
  }

  const verifyMnemonicsValues = (values: string[]) => {
    if (!setupMnemonics.value) {
      return false
    }

    if (
      !mnemonicsVerifyIndexes.value ||
      values.length !== mnemonicsVerifyIndexes.value.length
    ) {
      return false
    }

    for (const [index, value] of values.entries()) {
      const mnemonicsVerifyIndex = mnemonicsVerifyIndexes.value[index]

      const enteredValue = value.toLocaleLowerCase().trim()
      const expectedValue = setupMnemonics.value[mnemonicsVerifyIndex]

      if (enteredValue !== expectedValue) {
        return false
      }
    }

    return true
  }

  const finishSetupWithPassword = async (password: string) => {
    if (!setupMnemonics.value) {
      return
    }

    await passwordStore.savePasswordHash(password)
    await mnemonicsStore.saveMnemonicsWithPassword(
      setupMnemonics.value.join(' '),
      password
    )
    await walletsStore.generateNextWalletWithMnemonics(password)
  }

  return {
    setupMnemonics,
    generateMnemonics,
    mnemonicsVerifyIndexes,
    generateMnemonicsVerifyIndexes,
    verifyMnemonicsValues,
    finishSetupWithPassword,
  }
})
