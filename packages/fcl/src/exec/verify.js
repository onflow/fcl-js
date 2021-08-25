import {invariant} from "@onflow/util-invariant"
import {query} from "../exec/query"
import {account} from "@onflow/sdk"

export async function verifyUserSignatures(msg, compSigs) {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")
  invariant(
    Array.isArray(compSigs),
    "Must include an Array of composite signatures"
  )

  let weights = []
  let signAlgos = []
  let signatures = []
  const rawPubKeys = await Promise.all(
    compSigs.map(async cs => {
      invariant(typeof cs.addr === "string", "addr must be a string")
      invariant(typeof cs.keyId === "number", "keyId must be a number")
      invariant(typeof cs.signature === "string", "signature must be a string")

      try {
        const account = await account(cs.addr)
        weights.push(account.keys[cs.keyId].weight.toFixed(1))
        signAlgos.push(account.keys[cs.keyId].signAlgo)
        signatures.push(cs.signature)
        return account.keys[cs.keyId].publicKey
      } catch (err) {
        throw err
      }
    })
  )

  return await query({
    cadence: `${VERIFY_SIG_SCRIPT}`,
    args: (arg, t) => [
      arg(msg, t.String),
      arg(rawPubKeys, t.Array([t.String])),
      arg(weights, t.Array(t.UFix64)),
      arg(signAlgos, t.Array([t.UInt])),
      arg(signatures, t.Array([t.String])),
    ],
  })
}

const VERIFY_SIG_SCRIPT = `
import Crypto
    
pub fun main(
  message: String,
  rawPublicKeys: [String],
  weights: [UFix64],
  signAlgos: [UInt],
  signatures: [String],
): Bool {

  let keyList = Crypto.KeyList()
  
  var i = 0
  for rawPublicKey in rawPublicKeys {
    keyList.add(
      PublicKey(
        publicKey: rawPublicKey.decodeHex(),
        signatureAlgorithm: signAlgos[i] == 2 ? SignatureAlgorithm.ECDSA_P256 : SignatureAlgorithm.ECDSA_secp256k1 
      ),
      hashAlgorithm: HashAlgorithm.SHA3_256,
      weight: weights[i],
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
