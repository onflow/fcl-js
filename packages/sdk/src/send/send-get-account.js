import {GetAccountAtLatestBlockRequest, GetAccountAtBlockHeightRequest, AccessAPI} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {sansPrefix, withPrefix} from "@onflow/util-address"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")

const addressBuffer = addr => paddedHexBuffer(addr, 8)

async function sendGetAccountAtBlockHeightRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetAccountAtBlockHeightRequest()
  req.setBlockHeight(Number(ix.block.height))
  req.setAddress(addressBuffer(sansPrefix(ix.account.addr)))

  const res = await unary(opts.node, AccessAPI.GetAccountAtBlockHeight, req)

  return constructResponse(ix, res)
}

async function sendGetAccountAtLatestBlockRequest(ix, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetAccountAtLatestBlockRequest()
  req.setAddress(addressBuffer(sansPrefix(ix.account.addr)))

  const res = await unary(opts.node, AccessAPI.GetAccountAtLatestBlock, req)

  return constructResponse(ix, res)
}

function constructResponse(ix, res) {
  let ret = response()
  ret.tag = ix.tag

  const account = res.getAccount()

  let contractsMap;
  const contracts = (contractsMap = account.getContractsMap()) ? contractsMap.getEntryList().reduce((acc, contract) => ({
    ...acc,
    [contract[0]]: Buffer.from(contract[1] || new UInt8Array()).toString("utf8")
  }), {}) : {}

  ret.account = {
    address: withPrefix(u8ToHex(account.getAddress_asU8())),
    balance: account.getBalance(),
    code: Buffer.from(account.getCode_asU8() || new UInt8Array()).toString("utf8"),
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


export async function sendGetAccount(ix, opts = {}) {
  ix = await ix

  if (ix.block.height !== null) {
    return await sendGetAccountAtBlockHeightRequest(ix, opts)
  } else {
    return await sendGetAccountAtLatestBlockRequest(ix, opts)
  }
}
