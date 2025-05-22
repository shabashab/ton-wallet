<script setup lang="ts">
import { TonConnect, TonConnectUI, type Wallet } from '@tonconnect/ui'
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
        bridgeUrl: 'https://bachelors-ton-wallet-bridge.fly.dev/bridge',
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
</script>

<template>
  <div>
    <button v-if="!wallet" @click="onConnectButtonClick">Connect</button>
    <div v-else class="connected-account-container">
      {{ wallet.account.address }}
      <button v-if="!wallet">Disconnect</button>
    </div>
  </div>
</template>

<style scoped>
.connected-account-container {
  display: flex;
  align-items: center;
}
</style>
