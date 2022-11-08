import {withPrefix} from "@onflow/util-address"
import {COMPOSITE_SIGNATURE_PRAGMA} from "../normalizers/service/__vsn"

export function CompositeSignature(addr, keyId, signature) {
  this.f_type = COMPOSITE_SIGNATURE_PRAGMA.f_type
  this.f_vsn = COMPOSITE_SIGNATURE_PRAGMA.f_vsn
  this.addr = withPrefix(addr)
  this.keyId = Number(keyId)
  this.signature = signature
}
