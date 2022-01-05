import {invariant} from "@onflow/util-invariant"
import {GetAccountAtLatestBlockRequest, GetAccountAtBlockHeightRequest, AccessAPI} from "@onflow/protobuf"
import {sansPrefix, withPrefix} from "@onflow/util-address"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")

const addressBuffer = addr => paddedHexBuffer(addr, 8)

const HashAlgorithmNames = {
  1: "SHA2_256",
  2: "SHA2_384",
  3: "SHA3_256",
  4: "SHA3_384",
  5: "KMAC128_BLS_BLS12_381",
}

const SignatureAlgorithmNames = {
  1: "ECDSA_P256",
  2: "ECDSA_secp256k1",
  3: "BLS_BLS12_381",
}

async function sendGetAccountAtBlockHeightRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetAccountAtBlockHeightRequest()
  req.setBlockHeight(Number(ix.block.height))
  req.setAddress(addressBuffer(sansPrefix(ix.account.addr)))

  const res = await unary(opts.node, AccessAPI.GetAccountAtBlockHeight, req, context)

  return constructResponse(ix, context, res)
}

async function sendGetAccountAtLatestBlockRequest(ix, context, opts) {
  const unary = opts.unary || defaultUnary

  const req = new GetAccountAtLatestBlockRequest()
  req.setAddress(addressBuffer(sansPrefix(ix.account.addr)))

  const res = await unary(opts.node, AccessAPI.GetAccountAtLatestBlock, req, context)

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  let ret = context.response()
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
      signAlgoString: SignatureAlgorithmNames[publicKey.getSignAlgo()], // New! Verify this field name for correctness.
      hashAlgo: publicKey.getHashAlgo(),
      hashAlgoString: HashAlgorithmNames[publicKey.getHashAlgo()], // New! Verify this field name for correctness.
      weight: publicKey.getWeight(),
      sequenceNumber: publicKey.getSequenceNumber(),
      revoked: publicKey.getRevoked(),
    })),
  }

  return ret
}


export async function sendGetAccount(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Account Error: opts.node must be defined.`)
  invariant(context.response, `SDK Get Account Error: context.response must be defined.`)

  ix = await ix

  if (ix.block.height !== null) {
    return await sendGetAccountAtBlockHeightRequest(ix, context, opts)
  } else {
    return await sendGetAccountAtLatestBlockRequest(ix, context, opts)
  }
}
