import {invariant} from "@onflow/util-invariant"
import {withPrefix, sansPrefix} from "@onflow/util-address"
import {query} from "../exec/query"
import {encodeAccountProof} from "../wallet-utils"
import {isString} from "../utils/is"
import {getChainId} from "../utils"
import {CompositeSignature} from "@onflow/typedefs"

export interface AccountProofData {
  address: string
  nonce: string
  signatures: CompositeSignature[]
}

export interface VerifySignaturesScriptOptions {
  fclCryptoContract?: string
}

export interface ValidateArgsInput {
  appIdentifier?: string
  address?: string
  nonce?: string
  signatures?: CompositeSignature[]
  message?: string
  compSigs?: CompositeSignature[]
}

const ACCOUNT_PROOF = "ACCOUNT_PROOF"
const USER_SIGNATURE = "USER_SIGNATURE"

export const validateArgs = (args: ValidateArgsInput): boolean => {
  if (args.appIdentifier) {
    const {appIdentifier, address, nonce, signatures} = args
    invariant(
      isString(appIdentifier),
      "verifyAccountProof({ appIdentifier }) -- appIdentifier must be a string"
    )
    invariant(
      isString(address) && sansPrefix(address!).length === 16,
      "verifyAccountProof({ address }) -- address must be a valid address"
    )
    invariant(/^[0-9a-f]+$/i.test(nonce!), "nonce must be a hex string")
    invariant(
      Array.isArray(signatures) &&
        signatures.every((sig, i, arr) => sig.f_type === "CompositeSignature"),
      "Must include an Array of CompositeSignatures to verify"
    )
    invariant(
      signatures.map(cs => cs.addr).every((addr, i, arr) => addr === arr[0]),
      "User signatures to be verified must be from a single account address"
    )
    return true
  } else {
    const {message, address, compSigs} = args
    invariant(
      /^[0-9a-f]+$/i.test(message!),
      "Signed message must be a hex string"
    )
    invariant(
      isString(address) && sansPrefix(address!).length === 16,
      "verifyUserSignatures({ address }) -- address must be a valid address"
    )
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
}

// TODO: pass in option for contract but we're connected to testnet
// log address + network -> in sync?
const getVerifySignaturesScript = async (
  sig: string,
  opts: VerifySignaturesScriptOptions
): Promise<string> => {
  const verifyFunction =
    sig === "ACCOUNT_PROOF"
      ? "verifyAccountProofSignatures"
      : "verifyUserSignatures"

  const network = await getChainId(opts)

  const contractAddresses: any = {
    testnet: "0x74daa6f9c7ef24b1",
    mainnet: "0xb4b82a1c9d21d284",
    previewnet: "0x40b5b8b2ce81ea4a",
  }
  const fclCryptoContract = opts.fclCryptoContract || contractAddresses[network]

  invariant(
    fclCryptoContract as any,
    `${verifyFunction}({ fclCryptoContract }) -- FCLCrypto contract address is unknown for network: ${network}. Please manually specify the FCLCrypto contract address.`
  )

  return `
      import FCLCrypto from ${fclCryptoContract}

      access(all) fun main(
          address: Address, 
          message: String, 
          keyIndices: [Int], 
          signatures: [String]
      ): Bool {
        return FCLCrypto.${verifyFunction}(address: address, message: message, keyIndices: keyIndices, signatures: signatures)
      }
    `
}

/**
 * @description
 * Verify a valid account proof signature or signatures for an account on Flow.
 *
 * @param {string} appIdentifier - A message string in hexadecimal format
 * @param {object} accountProofData - An object consisting of address, nonce, and signatures
 * @param {string} accountProofData.address - A Flow account address
 * @param {string} accountProofData.nonce - A random string in hexadecimal format (minimum 32 bytes in total, i.e 64 hex characters)
 * @param {object[]} accountProofData.signatures - An array of composite signatures to verify
 * @param {object} [opts={}] - Options object
 * @param {string} opts.fclCryptoContract - An optional override Flow account address where the FCLCrypto contract is deployed
 * @returns {Promise<boolean>} - Returns true if the signature is valid, false otherwise
 *
 * @example
 *
 *  const accountProofData = {
 *   address: "0x123",
 *   nonce: "F0123"
 *   signatures: [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}],
 *  }
 *
 *  const isValid = await fcl.AppUtils.verifyAccountProof(
 *    "AwesomeAppId",
 *    accountProofData,
 *    {fclCryptoContract}
 *  )
 */
export async function verifyAccountProof(
  appIdentifier: string,
  {address, nonce, signatures}: AccountProofData,
  opts: VerifySignaturesScriptOptions = {}
): Promise<boolean> {
  validateArgs({appIdentifier, address, nonce, signatures})
  const message = encodeAccountProof({address, nonce, appIdentifier}, false)

  const signaturesArr: string[] = []
  const keyIndices: string[] = []

  for (const el of signatures) {
    signaturesArr.push(el.signature)
    keyIndices.push(el.keyId.toString())
  }

  return query({
    cadence: await getVerifySignaturesScript(ACCOUNT_PROOF, opts),
    args: (arg: any, t: any) => [
      arg(withPrefix(address), t.Address),
      arg(message, t.String),
      arg(keyIndices, t.Array(t.Int)),
      arg(signaturesArr, t.Array(t.String)),
    ],
  })
}

/**
 * @description
 * Verify a valid signature/s for an account on Flow.
 *
 * @param {string} message - A message string in hexadecimal format
 * @param {Array} compSigs - An array of Composite Signatures
 * @param {string} compSigs[].addr - The account address
 * @param {number} compSigs[].keyId - The account keyId
 * @param {string} compSigs[].signature - The signature to verify
 * @param {object} [opts={}] - Options object
 * @param {string} opts.fclCryptoContract - An optional override of Flow account address where the FCLCrypto contract is deployed
 * @returns {Promise<boolean>} - Returns true if the signature is valid, false otherwise
 *
 * @example
 *
 *  const isValid = await fcl.AppUtils.verifyUserSignatures(
 *    Buffer.from('FOO').toString("hex"),
 *    [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}],
 *    {fclCryptoContract}
 *  )
 */
export async function verifyUserSignatures(
  message: string,
  compSigs: CompositeSignature[],
  opts: VerifySignaturesScriptOptions = {}
): Promise<boolean> {
  const address = withPrefix(compSigs[0].addr)
  validateArgs({message, address, compSigs})

  const signaturesArr: string[] = []
  const keyIndices: string[] = []

  for (const el of compSigs) {
    signaturesArr.push(el.signature)
    keyIndices.push(el.keyId.toString())
  }

  return query({
    cadence: await getVerifySignaturesScript(USER_SIGNATURE, opts),
    args: (arg: any, t: any) => [
      arg(address, t.Address),
      arg(message, t.String),
      arg(keyIndices, t.Array(t.Int)),
      arg(signaturesArr, t.Array(t.String)),
    ],
  })
}
