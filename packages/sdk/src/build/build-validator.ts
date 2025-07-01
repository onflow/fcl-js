import {update, InteractionBuilderFn} from "../interaction/interaction"

/**
 * A builder function that adds a validator to a transaction.
 *
 * Validators are functions that run during transaction building to check for invalid configurations or parameters.
 * They help catch errors early before submitting transactions to the network, preventing failed transactions
 * and wasted compute costs.
 *
 * @param cb The validator function that takes an interaction and returns it (or throws an error if invalid)
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Custom validator to ensure account has sufficient balance
 * const validateBalance = (ix) => {
 *   if (ix.message.computeLimit > 1000) {
 *     throw new Error("Compute limit too high for this account");
 *   }
 *   return ix;
 * };
 *
 * await fcl.send([
 *   fcl.transaction`
 *     transaction {
 *       prepare(account: AuthAccount) {
 *         // Transaction logic
 *       }
 *     }
 *   `,
 *   fcl.validator(validateBalance),
 *   fcl.limit(500) // This will pass validation
 * ]);
 */
export function validator(cb: Function): InteractionBuilderFn {
  return update("ix.validators", (validators: Function | Function[]) =>
    Array.isArray(validators) ? [...validators, cb] : [cb]
  )
}
