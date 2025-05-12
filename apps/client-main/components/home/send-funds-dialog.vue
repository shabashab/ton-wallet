<script setup lang="ts">
import type { ServerIndexWalletFungibleAsset } from '~/models/server-index-wallet-fungible-assets.model'
import type { UiSelectOption } from '../ui/ui-select/types'
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'
import UiSelect from '../ui/ui-select.vue'
import UiCheckmark from '../ui/ui-checkmark.vue'
import UiTextInput from '../ui/ui-text-input.vue'
import UiButton from '../ui/ui-button.vue'
import { Decimal } from 'decimal.js'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { Address, beginCell, internal, toNano } from '@ton/core'

interface SendFundsDialogOption extends UiSelectOption<string> {
  asset: ServerIndexWalletFungibleAsset
}

/* Models */
const open = defineModel<boolean>('open', { required: true })

/* Props and Emits */

/* Composables */
const activeWalletStore = useActiveWalletStore()
const sendTransaction = useTransactionSend()

/* Refs and Reactive Variables */
const formData = ref({
  sendAmount: '',
  recipientAddressString: '',
  comment: '',
  selectedAssetType: undefined as string | undefined,
})

/* Computed Properties */
const availableBalance = computed<Decimal | undefined>(() => {
  if (!selectedAsset.value) {
    return
  }

  return new Decimal(selectedAsset.value.balanceRaw).div(
    new Decimal(10).pow(selectedAsset.value.meta.decimals)
  )
})

const currencySelectOptions = computed<SendFundsDialogOption[]>(() => {
  if (!activeWalletStore.activeWalletFungibleAssets) {
    return []
  }

  return activeWalletStore.activeWalletFungibleAssets.assets.map(
    (asset): SendFundsDialogOption => {
      return {
        value: asset.type === 'ton' ? 'ton' : asset.contractAddress,
        asset,
      }
    }
  )
})

const availableBalanceString = computed(() => {
  if (!availableBalance.value || !selectedAsset.value) {
    return
  }

  return `${availableBalance.value.toString()} ${selectedAsset.value.meta.symbol}`
})

const selectedAsset = computed(() => {
  const selectedAssetType = formData.value.selectedAssetType

  if (!activeWalletStore.activeWalletFungibleAssets || !selectedAssetType) {
    return
  }

  return activeWalletStore.activeWalletFungibleAssets.assets.find(
    (asset) =>
      asset.type === selectedAssetType ||
      (asset.type === 'jetton' && asset.contractAddress === selectedAssetType)
  )
})

const vuelidate = useVuelidate(
  {
    sendAmount: {
      required,
      isParseableDecimal: helpers.withMessage(
        'Amount should be a number',
        (value: string) => {
          try {
            new Decimal(value)
            return true
          } catch {
            return false
          }
        }
      ),
      sufficientBalance: helpers.withMessage(
        'Insufficient balance',
        helpers.withParams({ balance: availableBalance }, (value: string) => {
          const decimalAmount = new Decimal(value)

          if (!availableBalance.value) {
            return true
          }

          return availableBalance.value.gte(decimalAmount)
        })
      ),
    },
    recipientAddressString: {
      required,
      validTonAddress: helpers.withMessage(
        'Invalid ton address',
        (value: string) => {
          try {
            Address.parse(value)
            return true
          } catch {
            return false
          }
        }
      ),
    },
    selectedAssetType: {
      required,
    },
  },
  formData
)

/* Methods */
const onPercentageAvailableBalanceButtonClick = (percentage: number) => {
  if (!availableBalance.value) {
    return
  }

  formData.value.sendAmount = availableBalance.value
    .div(100)
    .mul(percentage)
    .toString()
}

const onSendButtonClick = async () => {
  vuelidate.value.$touch()

  if (vuelidate.value.$error) {
    return
  }

  if (!selectedAsset.value) {
    return
  }

  const sendAmount = BigInt(
    new Decimal(formData.value.sendAmount)
      .mul(new Decimal(10).pow(selectedAsset.value.meta.decimals))
      .floor()
      .toString()
  )
  const recipientAddress = Address.parse(formData.value.recipientAddressString)
  const comment =
    formData.value.comment.length > 0 ? formData.value.comment : undefined

  const transferMessage =
    selectedAsset.value.type === 'ton'
      ? createTonTransferMessage(sendAmount, recipientAddress, comment)
      : createJettonTransferMessage(
          sendAmount,
          Address.parse(selectedAsset.value.walletAddress),
          recipientAddress,
          comment
        )

  const result = await sendTransaction({ message: transferMessage })
  console.log('sendTransaction result', result)
}

const createTonTransferMessage = (
  amount: bigint,
  to: Address,
  comment?: string
) => {
  const ownAddress = activeWalletStore.activeWalletAddress

  if (!ownAddress) {
    throw new Error(
      'Could not create ton transfer message. No active wallet available'
    )
  }

  const body = comment
    ? beginCell().storeUint(0, 32).storeStringTail(comment).endCell()
    : undefined

  return internal({
    to,
    value: amount,
    body,
  })
}

const createJettonTransferMessage = (
  amount: bigint,
  walletAddress: Address,
  to: Address,
  comment?: string
) => {
  const ownAddress = activeWalletStore.activeWalletAddress

  if (!ownAddress) {
    throw new Error(
      'Could not create jetton transfer message. No active wallet available'
    )
  }

  const payload = comment
    ? beginCell().storeUint(0, 32).storeStringTail(comment).endCell()
    : undefined

  const body = beginCell()
    .storeUint(0xf_8a_7e_a5, 32) // transfer operation
    .storeUint(0, 64) // op, queryId
    .storeCoins(amount)
    .storeAddress(to)
    .storeAddress(ownAddress)
    // eslint-disable-next-line unicorn/no-useless-undefined
    .storeMaybeRef(undefined)
    .storeCoins(comment ? 1 : 0)
    .storeMaybeRef(payload)
    .endCell()

  return internal({
    to: walletAddress,
    body,
    value: toNano('0.101'),
  })
}

/* Lifecycle Hooks */
watch(
  () => formData.value.selectedAssetType,
  () => {
    formData.value.sendAmount = ''
  }
)
</script>

<template>
  <UiBottomDialog
    v-model:open="open"
    title="Send funds"
    content-class="overflow-y-auto"
  >
    <div class="pt-8 pb-2 space-y-4">
      <UiSelect
        v-model="formData.selectedAssetType"
        label="Asset type"
        :options="currencySelectOptions"
        :error="vuelidate.selectedAssetType.$errors"
      >
        <template #option="{ option, selected }">
          <div class="p-4 bg-slate-900/50 rounded-lg flex items-center gap-2">
            <UiCheckmark :value="selected" />
            <span>{{ option.asset.meta.symbol }}</span>
            <div class="flex-1" />
            <div>
              {{ option.asset.balance.toFixed(2) }}
              {{ option.asset.meta.symbol }}
            </div>
          </div>
        </template>
        <template #selectedOption="{ option }">
          <span class="font-semibold">{{ option.asset.meta.symbol }}</span>
        </template>
      </UiSelect>
      <UiTextInput
        v-model="formData.recipientAddressString"
        name="recipient-address"
        label="Recipient address"
        :error="vuelidate.recipientAddressString.$errors"
      />
      <UiTextInput
        v-model="formData.sendAmount"
        name="send-amount"
        label="Send amount"
        :error="vuelidate.sendAmount.$errors"
      />
      <div
        v-if="availableBalance && availableBalanceString"
        class="flex flex-row items-center justify-between"
      >
        <span class="text-sm opacity-60">Available balance</span>
        <span>{{ availableBalanceString }}</span>
      </div>
      <div v-if="availableBalance" class="grid grid-cols-4 gap-1">
        <UiButton
          button-style="secondary"
          @click="onPercentageAvailableBalanceButtonClick(25)"
        >
          25%
        </UiButton>
        <UiButton
          button-style="secondary"
          @click="onPercentageAvailableBalanceButtonClick(50)"
        >
          50%
        </UiButton>
        <UiButton
          button-style="secondary"
          @click="onPercentageAvailableBalanceButtonClick(75)"
        >
          75%
        </UiButton>
        <UiButton
          button-style="secondary"
          @click="onPercentageAvailableBalanceButtonClick(100)"
        >
          100%
        </UiButton>
      </div>
      <UiTextInput
        v-model="formData.comment"
        name="comment"
        label="Comment (optional)"
      />
      <UiButton size="large" class="w-full" @click="onSendButtonClick">
        Send
      </UiButton>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
