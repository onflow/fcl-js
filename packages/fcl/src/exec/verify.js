import {verifyUserSignatures as verify} from "../app-utils"
import {deprecate} from "../utils/deprecate"

/**
 * Verify a valid signature/s for an account on Flow.
 *
 * @deprecated since version '1.0.0-alpha.0', use AppUtils.verifyUserSignatures instead
 *
 */
export async function verifyUserSignatures(message, compSigs) {
  deprecate({
    title: "FCL Deprecation Notice",
    message: `
    fcl.verifyUserSignatures() is deprecated and will be removed in a future release
    Please use fcl.AppUtils.verifyUserSignatures()`,
    level: 2,
    always: true,
  })
  return verify(message, compSigs)
}
