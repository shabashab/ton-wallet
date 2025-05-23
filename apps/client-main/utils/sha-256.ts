export const sha256 = (bytes: Uint8Array) => {
  return crypto.subtle.digest('SHA-256', bytes)
}
