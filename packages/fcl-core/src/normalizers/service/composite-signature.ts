import {CompositeSignature} from "@onflow/typedefs"
import {COMPOSITE_SIGNATURE_PRAGMA} from "./__vsn"
import {sansPrefix} from "@onflow/util-address"

export interface LegacyCompositeSignature extends CompositeSignature {
  address?: string
  sig?: string
}

/**
 * @param {LegacyCompositeSignature | null} resp
 * @returns {CompositeSignature | null}
 *
 * @example
 * const resp = normalizeCompositeSignature({
 *   f_type: "CompositeSignature",
 *   f_vsn: "1.0.0",
 *   addr: "_____",         // sans-prefix
 *   signature: "adfe1234", // hex
 *   keyId: 3,
 * })
 */
export function normalizeCompositeSignature(
  resp: LegacyCompositeSignature | null
): CompositeSignature | null {
  if (resp == null) return null

  if (!resp["f_vsn"]) {
    return {
      ...COMPOSITE_SIGNATURE_PRAGMA,
      addr: sansPrefix(resp.addr || (resp as any).address),
      signature: resp.signature || (resp as any).sig,
      keyId: resp.keyId,
    } as unknown as CompositeSignature
  }

  switch (resp["f_vsn"]) {
    case "1.0.0":
      return resp

    default:
      return null
  }
}
