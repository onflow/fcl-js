import {log} from "@onflow/util-logger"
import {verifyUserSignatures as verify} from "../app-utils"
import {deprecate} from "../utils/deprecate"

/**
 * Verify a valid signature/s for an account on Flow.
 *
 * @deprecated since version '1.0.0-alpha.0', use AppUtils.verifyUserSignatures instead
 *
 */
export async function verifyUserSignatures(message, compSigs) {
  log.deprecate({
    pkg: "FCL",
    action: "fcl.verifyUserSignatures()",
    message: "Please use fcl.AppUtils.verifyUserSignatures()",
  })
  return verify(message, compSigs)
}
