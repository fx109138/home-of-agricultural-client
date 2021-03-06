import JsEncrypt from 'jsencrypt/bin/jsencrypt'

export function encryptPassword (realPassword) {
  const jse = new JsEncrypt.JSEncrypt()
  jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd16RIo6j+9AmzDWuPEvVXH9yz
  H4sjlRwT1mdWOyS2PCrjSZkQI760dZARQhmIjJd6yOL5mAaHoAzAAG/aB8YqVCCc
  OI9bQ6xOxbYzIMcjUAcz9EVmm+p78XJHI8gfOk40EUEieWKF5IIwu48Gse3fds+m
  qc2hYJl0EC/XEOMW0QIDAQAB
  -----END PUBLIC KEY-----`)
  const encrypted = jse.encrypt(realPassword)
  return encrypted
}

export const BASE_API_PATH = 'http://39.106.41.253:7001'
