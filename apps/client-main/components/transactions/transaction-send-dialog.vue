<script setup lang="ts">
import { type Event } from '@ton-api/client'
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto'
import {
  beginCell,
  external,
  SendMode,
  storeMessage,
  WalletContractV5R1,
  type Message,
  type OpenedContract,
} from '@ton/ton'
import { useTonApi } from '~/api/ton-api'
import { useTonClient } from '~/blockchain/ton-client'
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'
import UiButton from '../ui/ui-button.vue'
import type { SendTransactionData } from '~/types/send-transaction-data.type'
import { sleep } from 'radash'
import TransactionActions from './transaction-actions.vue'

/* Models */

/* Props and Emits */

/* Composables */
const transactionSendInjection = inject<TransactionSendInjection>(
  transactionSendInjectionSymbol
)
const activeWalletStore = useActiveWalletStore()
const confirmPassword = usePasswordConfirmation()

const tonApi = useTonApi()
const tonClient = useTonClient()

/* Refs and Reactive Variables */
const emulatedEvent = ref<Event | undefined>()

/* Computed Properties */
const displayDialog = computed(
  () => !!transactionSendInjection?.currentSigningMessage.value
)

/* Methods */
const onDialogOpenStateChange = () => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  transactionSendInjection?.submitSendResult(undefined)
}

const openedActiveWallet = computed(() => {
  const activeWallet = activeWalletStore.activeWallet
  const activeWalletAddress = activeWalletStore.activeWalletAddress

  if (!activeWallet || !activeWalletAddress) {
    return
  }

  const wallet = WalletContractV5R1.create({
    workchain: 0,
    publicKey: activeWallet.publicKey,
  })

  return tonClient.value.open(wallet)
})

const createExternalMessageSignedWithSecretKey = async (
  activeWallet: OpenedContract<WalletContractV5R1>,
  sendData: SendTransactionData,
  secretKey: Buffer
) => {
  const seqno = await activeWallet.getSeqno()

  const transfer = activeWallet.createTransfer({
    messages: [sendData.message],
    secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    seqno,
  })

  return external({
    to: activeWallet.address,
    init: seqno > 0 ? undefined : activeWallet.init,
    body: transfer,
  })
}

const createExternalMessageCell = (message: Message) => {
  return beginCell().store(storeMessage(message)).endCell()
}

const calculateEmulatedEvent = async () => {
  if (!openedActiveWallet.value) {
    return
  }

  if (!transactionSendInjection?.currentSigningMessage.value) {
    return
  }

  const dummyKeypair = await mnemonicToPrivateKey(await mnemonicNew())
  const dummySecretKey = dummyKeypair.secretKey

  const externalMessage = await createExternalMessageSignedWithSecretKey(
    openedActiveWallet.value,
    transactionSendInjection.currentSigningMessage.value,
    dummySecretKey
  )

  const bocExternalMessage = createExternalMessageCell(externalMessage)

  emulatedEvent.value = await tonApi.value.emulation.emulateMessageToEvent(
    {
      boc: bocExternalMessage,
    },
    { ignore_signature_check: true }
  )
}

const onApproveButtonClick = async () => {
  if (!activeWalletStore.activeWallet) {
    return
  }

  if (!openedActiveWallet.value) {
    return
  }

  if (!transactionSendInjection?.currentSigningMessage.value) {
    return
  }

  const password = await confirmPassword()

  if (!password) {
    return
  }

  const decryptedSecretKey = decryptSecretKey(
    activeWalletStore.activeWallet.encryptedSecretKey,
    password
  )

  const externalMessage = await createExternalMessageSignedWithSecretKey(
    openedActiveWallet.value,
    transactionSendInjection.currentSigningMessage.value,
    decryptedSecretKey
  )

  // So we don't hit rate limit of toncenter free api
  await sleep(2000)

  await tonClient.value.sendMessage(externalMessage)
}

/* Lifecycle Hooks */
watch(
  () => transactionSendInjection?.currentSigningMessage.value,
  async (newSigningMessage) => {
    if (!newSigningMessage) {
      emulatedEvent.value = undefined
      return
    }

    await calculateEmulatedEvent()
  }
)
</script>

<template>
  <UiBottomDialog
    title="Confirm transaction"
    :open="displayDialog"
    @update:open="onDialogOpenStateChange"
  >
    <div class="pt-8 pb-2 space-y-4">
      <div v-if="emulatedEvent">
        Transaction details:<br />
        <TransactionActions :actions="emulatedEvent.actions" />
        <UiButton class="w-full" @click="onApproveButtonClick"
          >Confirm transaction
        </UiButton>
      </div>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
