import {COMPOSITE_SIGNATURE_PRAGMA} from "./__vsn"
import {sansPrefix} from "@onflow/util-address"

// {
//    "f_type": "CompositeSignature",
//    "f_vsn": "1.0.0",
//    "addr": "_____",         // sans-prefix
//    "signature": "adfe1234", // hex
//    "keyId": 3,
// }
export function normalizeCompositeSignature(resp) {
  if (resp == null) return null

  if (!resp["f_vsn"]) {
    return {
      ...COMPOSITE_SIGNATURE_PRAGMA,
      addr: sansPrefix(resp.addr || resp.address),
      signature: resp.signature || resp.sig,
      keyId: resp.keyId,
    }
  }

  switch (resp["f_vsn"]) {
    case "1.0.0":
      return resp

    default:
      return null
  }
}
