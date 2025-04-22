export const base64StringToArrayBuffer = (base64String: string) => {
  const binaryString = atob(base64String)
  const bytes = new Uint8Array(binaryString.length)

  for (let index = 0; index < binaryString.length; index++) {
    bytes[index] = binaryString.codePointAt(index) ?? 0
  }

  return bytes.buffer
}

export const arrayBufferToBase64 = (buffer: ArrayBufferLike) => {
  let binary = ''

  const bytes = new Uint8Array(buffer)
  const length = bytes.byteLength

  for (let index = 0; index < length; index++) {
    binary += String.fromCodePoint(bytes[index])
  }

  return btoa(binary)
}
