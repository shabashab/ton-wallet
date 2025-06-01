<script setup lang="ts">
import { type Event } from '@ton-api/client'
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto'
import {
  beginCell,
  external,
  fromNano,
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
import UiSkeleton from '../ui/ui-skeleton.vue'

/* Models */

/* Props and Emits */

/* Composables */
const transactionSendInjection = inject<TransactionSendInjection>(
  transactionSendInjectionSymbol
)
const activeWalletStore = useActiveWalletStore()
const walletsStore = useWalletsStore()
const confirmPassword = usePasswordConfirmation()

const tonApi = useTonApi()
const tonClient = useTonClient()

const { toast } = useToast()

/* Refs and Reactive Variables */
const emulatedEvent = ref<Event | undefined>()
const estimatedFee = ref<number | undefined>()

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
    messages: Array.isArray(sendData.message)
      ? sendData.message
      : [sendData.message],
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
  console.log('calculateEmulatedEvent')

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

  await sleep(2000)

  const feeEstimationResult = await tonClient.value.estimateExternalMessageFee(
    openedActiveWallet.value.address,
    {
      body: externalMessage.body,
      // eslint-disable-next-line unicorn/no-null
      initCode: externalMessage.init?.code ?? null,
      // eslint-disable-next-line unicorn/no-null
      initData: externalMessage.init?.data ?? null,
      ignoreSignature: true,
    }
  )

  estimatedFee.value = Number(
    fromNano(
      feeEstimationResult.source_fees.fwd_fee +
        feeEstimationResult.source_fees.gas_fee +
        feeEstimationResult.source_fees.in_fwd_fee +
        feeEstimationResult.source_fees.storage_fee
    )
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

  const decryptedSecretKey = await walletsStore.decryptSecretKey(
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

  const externalMessageCell = createExternalMessageCell(externalMessage)

  toast({
    title: 'Transaction sent',
    description: 'Transaction has been successfully sent to blockchain',
  })
  transactionSendInjection.submitSendResult(
    externalMessageCell.toBoc().toString('base64')
  )
}

/* Lifecycle Hooks */
watch(
  () => transactionSendInjection?.currentSigningMessage.value,
  async (newSigningMessage) => {
    if (!newSigningMessage) {
      emulatedEvent.value = undefined
      estimatedFee.value = undefined
      return
    }

    await calculateEmulatedEvent()
  }
)
</script>

<template>
  <UiBottomDialog
    title="Confirm transaction"
    content-class="z-[40]"
    overlay-class="z-[39]"
    :open="displayDialog"
    @update:open="onDialogOpenStateChange"
  >
    <div class="pt-8 pb-2 space-y-4">
      <div v-if="emulatedEvent" class="flex flex-col items-stretch gap-4">
        <span class="text-sm opacity-70"> Transaction actions: </span>
        <TransactionActions :actions="emulatedEvent.actions" />
        <div class="flex justify-between items-center rounded-md">
          <span class="text-sm opacity-70"> Estimated fee: </span>
          <UiSkeleton
            skeleton-class="h-[10px] w-[80px]"
            :loading="typeof estimatedFee !== 'number'"
          >
            <span class="text-sm font-semibold">{{ estimatedFee }} TON</span>
          </UiSkeleton>
        </div>
        <UiButton class="w-full" @click="onApproveButtonClick"
          >Confirm transaction
        </UiButton>
      </div>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
