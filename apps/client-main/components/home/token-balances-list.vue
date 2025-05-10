<script setup lang="ts">
import ListItem from './token-balances-list/list-item.vue'
import ListSeparator from './token-balances-list/list-separator.vue'

/* Models */

/* Props and Emits */

/* Composables */
const activeWalletStore = useActiveWalletStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    v-if="activeWalletStore.activeWalletFungibleAssets"
    class="flex flex-col items-stretch gap-4 p-4 bg-white/10 rounded-xl"
  >
    <template
      v-for="(fungibleAsset, index) of activeWalletStore
        .activeWalletFungibleAssets.assets"
      :key="fungibleAsset.meta.symbol"
    >
      <ListItem
        :token-name="fungibleAsset.meta.displayName"
        :token-symbol="fungibleAsset.meta.symbol"
        :token-amount="fungibleAsset.balance"
        :usd-amount="fungibleAsset.balanceUsd"
        :image-url="fungibleAsset.meta.imageUrl"
      />
      <ListSeparator
        v-if="
          index + 1 !==
          activeWalletStore.activeWalletFungibleAssets.assets.length
        "
      />
    </template>
  </div>
</template>

<style scoped></style>
