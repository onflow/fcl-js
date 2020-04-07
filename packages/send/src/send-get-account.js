import {GetAccountRequest, ObserveService} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {unary} from "./unary"
import {bufferToHexString, addressToBuffer, bytes} from "@onflow/bytes"

export async function sendGetAccount(ix, opts = {}) {
  const req = new GetAccountRequest()
  const address = addressToBuffer(bytes(ix.acct, 20))
  req.setAddress(address)

  const res = await unary(opts.node, ObserveService.GetAccount, req)

  let ret = response()
  ret.tag = ix.tag

  const account = res.getAccount()
  ret.account = {
    address: bufferToHexString(account.getAddress_asU8()),
    balance: account.getBalance(),
    code: account.getCode_asU8(),
    keys: account.getKeysList().map(publicKey => ({
      publicKey: bufferToHexString(publicKey.getPublicKey_asU8()),
      signAlgo: publicKey.getSignAlgo(),
      hashAlgo: publicKey.getHashAlgo(),
      weight: publicKey.getWeight(),
    })),
  }

  return ret
}
