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

  const res = await httpRequest({
    hostname: opts.node,
    path: `/accounts/${ix.account.addr}`,
    method: "GET",
    body: null
  })

  return constructResponse(ix, context, res)
}

function constructResponse(ix, context, res) {
  let ret = context.response()
  ret.tag = ix.tag

  ret.account = {
    address: res.address,
    balance: res.balance,
    code: null, // CHECK IF THIS WILL BE RETURNED AS WELL
    contracts: res.contracts,
    keys: res.keys.map(key => ({
      index: key.index,
      publicKey: key.public_key,
      signAlgo: SignatureAlgorithmIDs[key.signing_algorithm],
      signAlgoName: key.signing_algorithm, // New! Verify this field name for correctness.
      hashAlgo: HashAlgorithmIDs[key.hashing_algorithm],
      hashAlgoName: key.hashing_algorithm, // New! Verify this field name for correctness.
      sequenceNumber: key.sequence_number,
      weight: key.weight,
      revoked: key.revoked,
    })) // VERIFY THAT KEYS WILL CONTAIN NUMBERED REPRESENTATIONS OF SIG / HASH ALGOS FOR BACKWARDS COMPATIBILITY https://docs.onflow.org/cadence/language/crypto/#hashing
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
