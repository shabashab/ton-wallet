<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling'
import TonSymbol from '~/assets/images/ton-symbol.png'
/* Models */

/* Props and Emits */
const props = defineProps<{
  walletAddress: string
}>()

/* Composables */

/* Refs and Reactive Variables */
const qrCodeContentsElement = useTemplateRef('qrCodeContents')

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
onMounted(async () => {
  if (!qrCodeContentsElement.value) {
    return
  }

  const qrcode = new QRCodeStyling({
    data: `ton://transfer/${props.walletAddress}`,
    width: 1000,
    height: 1000,
    dotsOptions: {
      type: 'extra-rounded',
      color: '#1e293b',
    },
    cornersSquareOptions: {
      type: 'rounded',
    },
    image: TonSymbol,
    imageOptions: {
      margin: 10,
    },
  })

  qrcode.append(qrCodeContentsElement.value)
})
</script>

<template>
  <div
    ref="qrCodeContents"
    class="overflow-hidden rounded-xl max-w-[80%] [&>canvas]:max-w-full bg-white p-2"
  ></div>
</template>

<style scoped></style>
