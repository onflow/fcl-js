import {invariant} from "@onflow/util-invariant"
import {withPrefix, sansPrefix} from "@onflow/util-address"
import {createQuery} from "../exec/query"
import {encodeAccountProof} from "../wallet-utils"
import {isString} from "../utils/is"
import {CompositeSignature} from "@onflow/typedefs"
import {createGetChainId} from "../utils"
import {FCLContext} from "../context"
import {createPartialGlobalFCLContext} from "../context/global"

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

/**
 * @description Validates input arguments for signature verification functions (both account proof and user signature verification).
 * This function performs comprehensive validation of parameters to ensure they meet the requirements for cryptographic
 * signature verification on the Flow blockchain. It handles two different validation scenarios: account proof validation
 * (when appIdentifier is provided) and user signature validation (when message is provided).
 *
 * @param args Object containing the arguments to validate. The validation behavior depends on which properties are present:
 * - For account proof validation: appIdentifier, address, nonce, and signatures are required
 * - For user signature validation: message, address, and compSigs are required
 * @param args.appIdentifier Optional unique identifier for the application (triggers account proof validation mode)
 * @param args.address Flow account address that should be exactly 16 characters (without 0x prefix)
 * @param args.nonce Hexadecimal string representing a cryptographic nonce (for account proof validation)
 * @param args.signatures Array of CompositeSignature objects for account proof validation
 * @param args.message Hexadecimal string representing the signed message (for user signature validation)
 * @param args.compSigs Array of CompositeSignature objects for user signature validation
 *
 * @returns Always returns true if validation passes, otherwise throws an error
 *
 * @throws Throws an invariant error if any validation check fails, with specific error messages for each validation failure
 *
 * @example
 * // Validate account proof arguments
 * const accountProofArgs = {
 *   appIdentifier: "MyApp",
 *   address: "1234567890abcdef",
 *   nonce: "75f8587e5bd982ec9289c5be1f9426bd",
 *   signatures: [{
 *     f_type: "CompositeSignature",
 *     f_vsn: "1.0.0",
 *     addr: "0x1234567890abcdef",
 *     keyId: 0,
 *     signature: "abc123def456..."
 *   }]
 * }
 *
 * const isValid = validateArgs(accountProofArgs) // Returns true or throws
 *
 * // Validate user signature arguments
 * const userSigArgs = {
 *   message: "48656c6c6f20576f726c64", // "Hello World" in hex
 *   address: "1234567890abcdef",
 *   compSigs: [{
 *     f_type: "CompositeSignature",
 *     f_vsn: "1.0.0",
 *     addr: "0x1234567890abcdef",
 *     keyId: 0,
 *     signature: "def456abc123..."
 *   }]
 * }
 *
 * const isValid = validateArgs(userSigArgs) // Returns true or throws
 */
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
  context: Pick<FCLContext, "config" | "sdk">,
  sig: string,
  opts: VerifySignaturesScriptOptions
): Promise<string> => {
  const verifyFunction =
    sig === "ACCOUNT_PROOF"
      ? "verifyAccountProofSignatures"
      : "verifyUserSignatures"

  const network = await createGetChainId(context)(opts)

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

export function createVerifyAccountProof(
  context: Pick<FCLContext, "config" | "sdk">
) {
  /**
   * @description Verifies the authenticity of an account proof signature on the Flow blockchain.
   * Account proofs are cryptographic signatures used to prove ownership of a Flow account without
   * revealing private keys. This function validates that the provided signatures were indeed created
   * by the private keys associated with the specified Flow account address.
   *
   * @param appIdentifier A unique identifier for your application. This is typically
   * your app's name or domain and is included in the signed message to prevent replay attacks
   * across different applications.
   * @param accountProofData Object containing the account proof data to verify
   * @param accountProofData.address The Flow account address that allegedly signed the proof
   * @param accountProofData.nonce A random hexadecimal string (minimum 32 bytes, 64 hex chars)
   * used to prevent replay attacks. Should be unique for each proof request.
   * @param accountProofData.signatures Array of composite signatures to verify
   * against the account's public keys
   * @param opts Optional configuration parameters
   * @param opts.fclCryptoContract Override address for the FCLCrypto contract if not using
   * the default for the current network
   *
   * @returns Promise that resolves to true if all signatures are valid, false otherwise.
   *
   * @returns `true` if verified or `false`
   *
   * @example
   * import * as fcl from "@onflow/fcl"
   *
   * const accountProofData = {
   *   address: "0x123",
   *   nonce: "F0123"
   *   signatures: [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}],
   * }
   *
   * const isValid = await fcl.AppUtils.verifyAccountProof(
   *   "AwesomeAppId",
   *   accountProofData,
   *   {fclCryptoContract}
   * )
   */
  async function verifyAccountProof(
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

    return createQuery(context)({
      cadence: await getVerifySignaturesScript(context, ACCOUNT_PROOF, opts),
      args: (arg: any, t: any) => [
        arg(withPrefix(address), t.Address),
        arg(message, t.String),
        arg(keyIndices, t.Array(t.Int)),
        arg(signaturesArr, t.Array(t.String)),
      ],
    })
  }

  return verifyAccountProof
}

export function createVerifyUserSignatures(
  context: Pick<FCLContext, "config" | "sdk">
) {
  /**
   * @description Verifies user signatures for arbitrary messages on the Flow blockchain. This function
   * validates that the provided signatures were created by the private keys associated with the specified
   * Flow account when signing the given message. This is useful for authenticating users or validating
   * signed data outside of transaction contexts.
   *
   * @param message The message that was signed, encoded as a hexadecimal string. The original
   * message should be converted to hex before passing to this function.
   * @param compSigs Array of composite signatures to verify. All signatures
   * must be from the same account address.
   * @param compSigs[].f_type Must be "CompositeSignature"
   * @param compSigs[].f_vsn Must be "1.0.0"
   * @param compSigs[].addr The Flow account address that created the signature
   * @param compSigs[].keyId The key ID used to create the signature
   * @param compSigs[].signature The actual signature data
   * @param opts Optional configuration parameters
   * @param opts.fclCryptoContract Override address for the FCLCrypto contract
   *
   * @returns Promise that resolves to true if all signatures are valid, false otherwise
   *
   * @throws If parameters are invalid, signatures are from different accounts, or network issues occur
   *
   * @example
   * // Basic message signature verification
   * import * as fcl from "@onflow/fcl"
   *
   * const originalMessage = "Hello, Flow blockchain!"
   * const hexMessage = Buffer.from(originalMessage).toString("hex")
   *
   * const signatures = [{
   *   f_type: "CompositeSignature",
   *   f_vsn: "1.0.0",
   *   addr: "0x1234567890abcdef",
   *   keyId: 0,
   *   signature: "abc123def456..." // signature from user's wallet
   * }]
   *
   * const isValid = await fcl.AppUtils.verifyUserSignatures(
   *   hexMessage,
   *   signatures
   * )
   */
  async function verifyUserSignatures(
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

    return createQuery(context)({
      cadence: await getVerifySignaturesScript(context, USER_SIGNATURE, opts),
      args: (arg, t) => [
        arg(address, t.Address),
        arg(message, t.String),
        arg(keyIndices, t.Array(t.Int)),
        arg(signaturesArr, t.Array(t.String)),
      ],
    })
  }

  return verifyUserSignatures
}

export const verifyAccountProof = /* @__PURE__ */ createVerifyAccountProof(
  createPartialGlobalFCLContext()
)
export const verifyUserSignatures = /* @__PURE__ */ createVerifyUserSignatures(
  createPartialGlobalFCLContext()
)
