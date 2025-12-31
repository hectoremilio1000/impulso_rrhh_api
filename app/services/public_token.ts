import crypto from 'node:crypto'

export function makePublicToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('hex') // 48 chars aprox
}
