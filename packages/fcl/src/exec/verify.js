import {verifyUserSignatures as verify} from "../app-utils"

/**
 * Verify a valid signature/s for an account on Flow.
 *
 * @deprecated since version '1.0.0-alpha.0'
 *
 * @param {string} msg - A message string in hexadecimal format
 * @param {Array} compSigs - An array of Composite Signatures
 * @param {string} compSigs[].addr - The account address
 * @param {number} compSigs[].keyId - The account keyId
 * @param {string} compSigs[].signature - The signature to verify
 * @return {bool}
 *
 * @example
 *
 *  const isValid = await fcl.verifyUserSignatures(
 *    Buffer.from('FOO').toString("hex"),
 *    [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}]
 *  )
 */
export async function verifyUserSignatures(message, compSigs) {
  console.warn(
    `
    %cFCL/SDK Deprecation Notice
    ============================
    fcl.verifyUserSignatures() is deprecated and will be removed in a future release
    Please use fcl.AppUtils.verifyUserSignatures()
    ============================
    `,
    "font-weight:bold;font-family:monospace;"
  )
  return verify(message, compSigs)
}
