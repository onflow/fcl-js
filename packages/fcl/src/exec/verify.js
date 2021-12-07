import {invariant} from "@onflow/util-invariant"
import {query} from "../exec/query"

export const validateArgs = (msg, compSigs) => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Signed message must be a hex string")
  invariant(
    Array.isArray(compSigs) &&
      compSigs.every((sig, i, arr) => sig.f_type === "CompositeSignature"),
    "Must include an Array of CompositeSignatures to verify"
  )
  invariant(
    compSigs.map(cs => cs.addr).every((addr, i, arr) => addr === arr[0]),
    "User signatures to be verified must be from a single account address"
  )
  return true
}

export async function verifyUserSignatures(msg, compSigs) {
  validateArgs(msg, compSigs)

  const acctAddress = compSigs[0].addr
  let signatures = []
  let keyIds = []
  compSigs.map(cs => {
    signatures.push(cs.signature)
    keyIds.push(cs.keyId)
  })

  return await query({
    cadence: `${VERIFY_SIG_SCRIPT}`,
    args: (arg, t) => [
      arg(acctAddress, t.Address),
      arg(msg, t.String),
      arg(keyIds, t.Array([t.Int])),
      arg(signatures, t.Array([t.String])),
    ],
  })
}

const VERIFY_SIG_SCRIPT = `
  import Crypto

  pub fun getHashAlgo(_ x: Int): HashAlgorithm {
    switch x {
    case 1:
        return HashAlgorithm.SHA2_256
    case 2:
        return HashAlgorithm.SHA2_384
    case 3:
        return HashAlgorithm.SHA3_256
    case 4:
        return HashAlgorithm.SHA3_384
    case 5:
        return HashAlgorithm.KMAC128_BLS_BLS12_381
    default:
        return HashAlgorithm.SHA3_256
    }
  }
      
  pub fun main(
    acctAddress: Address,
    message: String,
    keyIds: [Int],
    signatures: [String],
  ): Bool {

    let keyList = Crypto.KeyList()
    let rawPublicKeys: [String] = []
    let weights: [UFix64] = []
    let signAlgos: [UInt] = []
    let hashAlgos: [UInt] = []
    let uniqueKeys: {Int: Bool} = {}
    let account = getAccount(acctAddress)
    
    for id in keyIds {
      uniqueKeys[id] = true
    }

    assert(uniqueKeys.keys.length == keyIds.length, message: "Invalid KeyId: Duplicate key found for account")

    var counter = 0
    while (counter < keyIds.length) {
      let accountKey = account.keys.get(keyIndex: keyIds[counter]) ?? panic("Key provided does not exist on account")
      rawPublicKeys.append(String.encodeHex(accountKey.publicKey.publicKey))
      weights.append(accountKey.weight)
      signAlgos.append(UInt(accountKey.publicKey.signatureAlgorithm.rawValue))
      hashAlgos.append(UInt(accountKey.hashAlgorithm.rawValue))
      counter = counter + 1
    }

    var totalWeight = 0.0
    var weightIndex = 0
    while (weightIndex < weights.length) {
      totalWeight = totalWeight + weights[weightIndex]
      weightIndex = weightIndex + 1
    }
    assert(totalWeight >= 1000.0, message: "Signature key weights do not meet threshold >= 1000.0")

    var i = 0
    for rawPublicKey in rawPublicKeys {
      keyList.add(
        PublicKey(
          publicKey: rawPublicKey.decodeHex(),
          signatureAlgorithm: signAlgos[i] == 2 ? SignatureAlgorithm.ECDSA_secp256k1  : SignatureAlgorithm.ECDSA_P256
        ),
        hashAlgorithm: getHashAlgo(Int(hashAlgos[i])),
        weight: weights[i]
      )
      i = i + 1
    }

    let signatureSet: [Crypto.KeyListSignature] = []

    var j = 0
    for signature in signatures {
      signatureSet.append(
        Crypto.KeyListSignature(
          keyIndex: j,
          signature: signature.decodeHex()
        )
      )
      j = j + 1
    }
      
    let signedData = message.decodeHex()
    
    return keyList.verify(
      signatureSet: signatureSet,
      signedData: signedData
    )
  }
`
