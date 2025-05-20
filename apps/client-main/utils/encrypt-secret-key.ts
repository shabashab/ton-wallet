import AES from 'crypto-js/aes'
import SHA256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'

export const encryptSecretKey = (
  secretKey: Buffer,
  password: string
): string => {
  const secretKeyBase64 = secretKey.toString('base64')

  const passwordDigest = SHA256(password)
  const passwordDoubleDigest = SHA256(passwordDigest)

  const encryptedSecretKey = AES.encrypt(secretKeyBase64, passwordDigest, {
    iv: passwordDoubleDigest,
  }).toString()

  return encryptedSecretKey
}

export const decryptSecretKey = (
  encryptedSecretKey: string,
  password: string
): Buffer => {
  const passwordDigest = SHA256(password)
  const passwordDoubleDigest = SHA256(passwordDigest)

  const decrypted = AES.decrypt(encryptedSecretKey, passwordDigest, {
    iv: passwordDoubleDigest,
  })

  const secretKeyBase64 = decrypted.toString(CryptoJS.enc.Utf8)

  return Buffer.from(secretKeyBase64, 'base64')
}
