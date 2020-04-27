import * as CONFIG from "../config"
import {createSign, createVerify, generateKeyPairSync} from "crypto"
import {ec as EC} from "elliptic"
import {SHA3} from "sha3"
import * as rlp from "rlp"

const ec = new EC("p256")

export const sensorKey = (key, label, ...args) =>
  [label, [key.slice(0, 5), key.slice(key.length - 5)].join("..."), ...args]
    .filter(Boolean)
    .join(" ")

export const sensorKeys = obj => {
  if (obj == null) return obj
  const {privateKey, publicKey, ...rest} = obj
  return {
    ...rest,
    publicKey: sensorKey(publicKey, "PUBLIC"),
    privateKey: sensorKey(privateKey, "PRIVATE"),
  }
}

const hashMsgHex = hex => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(hex, "hex"))
  return sha.digest()
}

const signWithPrivateKey = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32 // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

export const signAsRoot = msgHex => {
  return signWithPrivateKey(CONFIG.PK, msgHex)
}

export const sign = (user, msgHex) => {
  return signWithPrivateKey(user.privateKey, msgHex)
}

export const genKeys = () => {
  const keys = ec.genKeyPair()

  const privateKey = keys.getPrivate("hex")
  const publicKey = keys.getPublic("hex").replace(/^04/, "")

  return {
    publicKey,
    privateKey,
    flowKey: rlp
      .encode([
        Buffer.from(publicKey, "hex"), // publicKey hex to binary
        2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
        3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
        1000, // full weight
      ])
      .toString("hex"),
  }
}
