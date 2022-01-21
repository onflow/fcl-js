import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"

const HashAlgorithmIDs = {
  "SHA2_256": 1,
  "SHA2_384": 2,
  "SHA3_256": 3,
  "SHA3_384": 4,
  "KMAC128_BLS_BLS12_381": 5
}

const SignatureAlgorithmIDs = {
  "ECDSA_P256": 1,
  "ECDSA_secp256k1": 2,
  "BLS_BLS12_381": 3
}

async function sendGetAccountAtBlockHeightRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const res = await httpRequest({
    hostname: opts.node,
    path: `/accounts/${ix.account.addr}?block_height=${ix.block.height}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, context, res)
}

async function sendGetAccountAtLatestBlockRequest(ix, context, opts) {
  const httpRequest = opts.httpRequest || defaultHttpRequest

  const height = ix.block?.isSealed
  ? "sealed"
  : "final"

  const res = await httpRequest({
    hostname: opts.node,
    path: `/accounts/${ix.account.addr}?block_height=${height}&expand=contracts,keys`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  let ret = context.response()
  ret.tag = ix.tag

  const unwrapContracts = contracts => {
    const c = {}
    if (!contracts) return c
    for (let key of Object.keys(contracts)) {
      c[key] = Buffer.from(contracts[key], "base64").toString()
    }
    return c
  }

  ret.account = {
    address: res.address,
    balance: res.balance,
    code: null,
    contracts: unwrapContracts(res.contracts),
    keys: res.keys.map(key => ({
      index: Number(key.index),
      publicKey: key.public_key,
      signAlgo: SignatureAlgorithmIDs[key.signing_algorithm],
      signAlgoString: key.signing_algorithm,
      hashAlgo: HashAlgorithmIDs[key.hashing_algorithm],
      hashAlgoString: key.hashing_algorithm,
      sequenceNumber: Number(key.sequence_number),
      weight: key.weight,
      revoked: key.revoked,
    })) 
  }

  return ret
}


export async function sendGetAccount(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Get Account Error: opts.node must be defined.`)
  invariant(context.response, `SDK Send Get Account Error: context.response must be defined.`)

  ix = await ix

  if (ix.block.height !== null) {
    return await sendGetAccountAtBlockHeightRequest(ix, context, opts)
  } else {
    return await sendGetAccountAtLatestBlockRequest(ix, context, opts)
  }
}
