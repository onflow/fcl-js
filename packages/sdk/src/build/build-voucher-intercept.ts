import {put, InteractionBuilderFn} from "../interaction/interaction"
import {Voucher} from "../encode/encode"

type VoucherInterceptFn = (voucher: Voucher) => any | Promise<any>

/**
 * A builder function that intercepts and modifies a voucher.
 *
 * This function is useful for debugging, logging, or making modifications to
 * the transaction data. The voucher contains all the transaction details in their final form.
 *
 * @param fn The function to intercept and potentially modify the voucher
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Intercept voucher for logging
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         log("Transaction executed")
 *       }
 *     }
 *   `,
 *   fcl.voucherIntercept((voucher) => {
 *     console.log("Voucher details:", {
 *       cadence: voucher.cadence,
 *       proposalKey: voucher.proposalKey,
 *       payer: voucher.payer,
 *       authorizers: voucher.authorizers,
 *       computeLimit: voucher.computeLimit
 *     });
 *   }),
 *   fcl.proposer(fcl.authz),
 *   fcl.payer(fcl.authz),
 *   fcl.authorizations([fcl.authz])
 * ]);
 */
export function voucherIntercept(fn: VoucherInterceptFn): InteractionBuilderFn {
  return put("ix.voucher-intercept", fn)
}
