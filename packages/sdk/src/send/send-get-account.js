import {GetAccountAtLatestBlockRequest, GetAccountAtBlockHeightRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {sansPrefix, withPrefix} from "@onflow/util-address"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")

const addressBuffer = addr => paddedHexBuffer(addr, 8)

export async function sendGetAccount(ix, opts = {}) {
  ix = await ix

  const req = ix.block.height ? new GetAccountAtBlockHeightRequest() : new GetAccountAtLatestBlockRequest()
  if (ix.block.height) req.setHeight(Number(ix.block.height))
  req.setAddress(addressBuffer(sansPrefix(ix.account.addr)))

  const res = await unary(opts.node, ix.block.height ? AccessAPI.GetAccountAtBlockHeight : AccessAPI.GetAccountAtLatestBlock, req)

  let ret = response()
  ret.tag = ix.tag

  const account = res.getAccount()

  let contractsMap;
  const contracts = (contractsMap = account.getContractsMap()) ? contractsMap.getEntryList().reduce((acc, contract) => ({
    ...acc,
    [contract[0]]: new TextDecoder("utf-8").decode(contract[1] || new UInt8Array())
  }), {}) : {}

  ret.account = {
    address: withPrefix(u8ToHex(account.getAddress_asU8())),
    balance: account.getBalance(),
    code: new TextDecoder("utf-8").decode(account.getCode_asU8() || new UInt8Array()),
    contracts,
    keys: account.getKeysList().map(publicKey => ({
      index: publicKey.getIndex(),
      publicKey: u8ToHex(publicKey.getPublicKey_asU8()),
      signAlgo: publicKey.getSignAlgo(),
      hashAlgo: publicKey.getHashAlgo(),
      weight: publicKey.getWeight(),
      sequenceNumber: publicKey.getSequenceNumber(),
      revoked: publicKey.getRevoked(),
    })),
  }

  return ret
}
