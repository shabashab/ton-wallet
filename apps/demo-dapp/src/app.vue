<script setup lang="ts">
import { CHAIN, TonConnect, TonConnectUI, type Wallet } from '@tonconnect/ui'
import { toNano } from '@ton/core'
import { ref } from 'vue'

const connector = new TonConnect({})
const tonConnect = new TonConnectUI({
  connector,
  walletsListConfiguration: {
    includeWallets: [
      {
        name: 'TON Wallet',
        appName: 'TON Wallet',
        aboutUrl: 'https://google.com',
        bridgeUrl: 'https://ton-wallet-bridge.shabashab.dev/bridge',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU7Hz0AK6gD_mXh0fv_PLJ6ie1S6mlB-bhrg&s',
        universalLink: 'https://google.com',
        // Telegram Mini App
        platforms: ['ios', 'android', 'macos', 'windows', 'linux'],
      },
    ],
  },
})

const wallet = ref<Wallet>()

tonConnect.onStatusChange((newWallet) => {
  wallet.value = newWallet ?? undefined
})

const onConnectButtonClick = async () => {
  await tonConnect.openModal()
}

const onSendTestTransactionButtonClick = async () => {
  if (!wallet.value) return

  const transaction = {
    address: 'UQAtQgKuoHLLohg13F5O7jd_8M-c-iAwudtR0JgqE8fEGZ4X',
    amount: toNano('0.5').toString(),
  }

  const result = await tonConnect.sendTransaction({
    messages: [transaction],
    validUntil: Date.now() + 60 * 1000,
    from: wallet.value.account.address,
    network: CHAIN.MAINNET,
  })

  // eslint-disable-next-line no-undef
  console.log({ result })
}

const onDisconnectButtonClick = async () => {
  await tonConnect.disconnect()
}
</script>

<template>
  <div>
    <button v-if="!wallet" @click="onConnectButtonClick">Connect</button>
    <div v-else class="connected-account-container">
      {{ wallet.account.address }}
      <button @click="onSendTestTransactionButtonClick">
        Send test transaction
      </button>
      <button @click="onDisconnectButtonClick">Disconnect</button>
    </div>
  </div>
</template>

<style scoped>
.connected-account-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
</style>
