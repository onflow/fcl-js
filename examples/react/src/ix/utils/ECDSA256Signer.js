import {ec as EC} from "elliptic"
import KeyEncoder from "key-encoder"
import {SHA3} from "sha3"
import {bytes, bytesToBuffer, keyToBuffer} from "@onflow/bytes"

const signatureLength = 64
const ec = new EC("p256")
const encoder = new KeyEncoder({
  curveParameters: [1, 2, 840, 10045, 3, 1, 7],
  privatePEMOptions: {label: "EC PRIVATE KEY"},
  publicPEMOptions: {label: "PUBLIC KEY"},
  curve: new EC("p256"),
})

export const signTransactionPayload = (pk, payload) => {
  const sha3 = new SHA3(256)
  sha3.update(payload)
  const hash = bytes(Uint8Array.from(sha3.digest()), 32)
  // const pkder = encoder.encodePrivate(pk, "raw", "der")
  return signHash(decodePrivateKey(keyToBuffer(pk)), hash)
}

export const signHash = (keyPair, hash) => {
  const sig = keyPair.sign(bytesToBuffer(hash))
  const n = signatureLength / 2
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s])
}

export const decodePrivateKey = der => {
  const hexStr = encoder.encodePrivate(der, "der", "raw")
  const buf = Buffer.from(hexStr, "hex")
  const keyPair = ec.keyFromPrivate(buf)
  return keyPair
}
