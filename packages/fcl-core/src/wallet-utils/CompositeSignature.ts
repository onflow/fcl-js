import {withPrefix} from "@onflow/util-address"
import {COMPOSITE_SIGNATURE_PRAGMA} from "../normalizers/service/__vsn"

/**
 * @description Constructs a new CompositeSignature instance.
 *
 * @param addr Flow Address
 * @param keyId Key ID
 * @param signature Signature as a hex string
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
