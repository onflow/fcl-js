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
    if (compSig.addr == null) throw new Error(missing("addr", "Address"))
    if (compSig.keyId == null) throw new Error(missing("keyId"))
    if (compSig.signature == null) throw new Error(missing("signature"))
    if (compSig.addr !== authz.addr) throw new Error(noMatch("addr", "Address"))
    if (compSig.keyId !== authz.keyId) throw new Error(noMatch("keyId"))
    return compSig
  } catch (error) {
    console.error(error, "\n\n", {
      "Composite Signature": compSig,
      "Authz Service": authz,
    })
    throw new Error(
      `Composite Signature from Wallet Provider failed Validation/Sanitation.\nReason: ${error.message}`
    )
  }
}
