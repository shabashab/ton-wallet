<script setup lang="ts">
import type { Action } from '@ton-api/client'
import ActionTonTransfer from './action-ton-transfer.vue'
import ActionJettonTransfer from './action-jetton-transfer.vue'
import ActionGeneric from './action-generic.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  action: Action
}>()

/* Composables */
const failed = computed(() => props.action.status === 'failed')

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <ActionTonTransfer
    v-if="props.action.TonTransfer"
    :action="props.action.TonTransfer"
    :failed
  />
  <ActionJettonTransfer
    v-else-if="props.action.JettonTransfer"
    :action="props.action.JettonTransfer"
    :failed
  />
  <ActionGeneric
    v-else
    :title="props.action.simplePreview.name"
    :value="props.action.simplePreview.value"
    icon="ion:ios-checkmark"
    :failed
  />
</template>

<style scoped></style>
