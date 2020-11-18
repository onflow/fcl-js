import {sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"

const label = (key, full) => (full == null ? `'${key}'` : `'${key}' (${full})`)

const missing = (key, full) =>
  `Missing ${label(key, full)} in Composite Signature.`

const noMatch = (key, full) =>
  `${label(
    key,
    full
  )} in Composit Signature did not match the requested ${key}.`

export function validateCompositeSignature(compSig, authz) {
  try {
    const xxx = {compSig, authz}
    invariant(compSig.addr, missing("addr", "Address"), xxx)
    invariant(compSig.keyId != null, missing("keyId"), xxx)
    invariant(compSig.signature, missing("signature"), xxx)
    invariant(compSig.keyId === authz.identity.keyId, noMatch("keyId"), xxx)
    invariant(
      sansPrefix(compSig.addr) === sansPrefix(authz.identity.address),
      noMatch("addr", "Address"),
      xxx
    )
    return compSig
  } catch (error) {
    throw new Error(
      `Composite Signature from Wallet Provider failed Validation/Sanitation.\nReason: ${error.message}`
    )
  }
}
