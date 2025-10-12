import {CompositeSignature} from "@onflow/typedefs"
import {sansPrefix} from "@onflow/util-address"
import {COMPOSITE_SIGNATURE_PRAGMA} from "./__vsn"

/**
 * @description Normalizes a composite signature to ensure compatibility with FCL format
 *
 * @param resp The composite signature to normalize
 * @returns The normalized composite signature or null
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
  resp: any
): CompositeSignature | null {
  if (resp == null) return null

  if (!resp["f_vsn"]) {
    return {
      ...COMPOSITE_SIGNATURE_PRAGMA,
      addr: sansPrefix(resp.addr || (resp as any).address),
      signature: resp.signature || (resp as any).sig,
      keyId: resp.keyId,
      ...(resp.extensionData ? {extensionData: resp.extensionData} : {}),
    } as unknown as CompositeSignature
  }

  switch (resp["f_vsn"]) {
    case "1.0.0":
      return resp as unknown as CompositeSignature

    default:
      return null
  }
}
