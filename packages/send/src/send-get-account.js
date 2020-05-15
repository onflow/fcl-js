import {GetAccountRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")

const addressBuffer = addr => paddedHexBuffer(addr, 8)

export async function sendGetAccount(ix, opts = {}) {
  const req = new GetAccountRequest()
  req.setAddress(addressBuffer(ix.accountAddr))

  const res = await unary(opts.node, AccessAPI.GetAccount, req)

  let ret = response()
  ret.tag = ix.tag

  const account = res.getAccount()
  ret.account = {
    address: u8ToHex(account.getAddress_asU8()),
    balance: account.getBalance(),
    code: account.getCode_asU8(),
    keys: account.getKeysList().map(publicKey => ({
      index: publicKey.getIndex(),
      publicKey: u8ToHex(publicKey.getPublicKey_asU8()),
      signAlgo: publicKey.getSignAlgo(),
      hashAlgo: publicKey.getHashAlgo(),
      weight: publicKey.getWeight(),
      sequenceNumber: publicKey.getSequenceNumber(),
    })),
  }

  return ret
}
