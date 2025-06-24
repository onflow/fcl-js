import {withPrefix} from "@onflow/util-address"
import {COMPOSITE_SIGNATURE_PRAGMA} from "../normalizers/service/__vsn"

/**
 * @description Creates a new CompositeSignature instance. CompositeSignature is a standardized
 * signature format used in the Flow ecosystem to represent cryptographic signatures along with
 * the signing account information. It includes the signature data, the account address, and
 * the key ID used for signing.
 *
 * @param addr Flow account address that created the signature (will be normalized with 0x prefix)
 * @param keyId The key ID/index used to create the signature (will be converted to number)
 * @param signature The cryptographic signature as a hexadecimal string
 *
 * @property f_type FCL type identifier, always "CompositeSignature"
 * @property f_vsn FCL version identifier for the signature format
 * @property addr Flow account address with 0x prefix
 * @property keyId Key ID used for signing (as number)
 * @property signature Signature data as hex string
 *
 * @example
 * // Create a composite signature for transaction signing
 * import { CompositeSignature } from "@onflow/fcl"
 *
 * const compSig = new CompositeSignature(
 *   "1234567890abcdef", // will be normalized to "0x1234567890abcdef"
 *   0,                  // key ID
 *   "abc123def456..."   // signature hex string
 * )
 *
 * console.log(compSig)
 * // {
 * //   f_type: "CompositeSignature",
 * //   f_vsn: "1.0.0",
 * //   addr: "0x1234567890abcdef",
 * //   keyId: 0,
 * //   signature: "abc123def456..."
 * // }
 */
export class CompositeSignature {
  f_type: string
  f_vsn: string
  addr: string
  keyId: number
  signature: string

  constructor(addr: string, keyId: number | string, signature: string) {
    this.f_type = COMPOSITE_SIGNATURE_PRAGMA.f_type
    this.f_vsn = COMPOSITE_SIGNATURE_PRAGMA.f_vsn
    this.addr = withPrefix(addr)
    this.keyId = Number(keyId)
    this.signature = signature
  }
}
