import {ec as EC} from "elliptic"
import {SHA3} from "sha3"
import * as rlp from "rlp"

const ec = new EC("p256")

// current cadded AuthAccount constructor (what you use to create an account on flow)
// requires a public key to be in a certain format. That format is an rlp encoded value
// that encodes the key itself, what curve it uses, how the signed values are hashed
// and the keys weight.
const encodePublicKeyForFlow = publicKey =>
  rlp
    .encode([
      Buffer.from(publicKey, "hex"), // publicKey hex to binary
      2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
      1000, // give key full weight
    ])
    .toString("hex")

export const genKeys = () => {
  const keys = ec.genKeyPair()
  const privateKey = keys.getPrivate("hex")
  const publicKey = keys.getPublic("hex").replace(/^04/, "")

  return {
    publicKey,
    privateKey,
    flowKey: encodePublicKeyForFlow(publicKey),
  }
}

const hashMsgHex = msgHex => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, "hex"))
  return sha.digest()
}

export const signWithKey = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32 // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}
