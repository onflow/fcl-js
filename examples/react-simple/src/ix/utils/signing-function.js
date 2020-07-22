import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import flowJson from "../../../flow.json"

const ec = new EC("p256")
const hashMsgHex = msgHex => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, "hex"))
  return sha.digest()
};
const bufferToHexString = buffer =>
  buffer.reduce(
    (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
    ""
  )
const hashToBuffer = hash => Buffer.from(hash, "hex")

const signWithKey = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

export const signingFunction = ({
  message,
  addr,
  keyId,
  roles: {
    proposer,
    authorizer,
    payer,
  },
  interaction,
}) => {
  return {
    addr,
    keyId,
    signature: signWithKey(flowJson.accounts.service.privateKey, hashToBuffer(message))
  }
}
