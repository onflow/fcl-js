import * as sdk from "@onflow/sdk"
import {normalizeArgs} from "./utils/normalize-args"
import {getCurrentUser} from "../current-user"
import {prepTemplateOpts} from "./utils/prep-template-opts.js"
import {preMutate} from "./utils/pre.js"
import {isNumber} from "../utils/is"

export const getMutate = ({platform}) => {
  /**
   * @description
   * Allows you to submit transactions to the blockchain to potentially mutate the state.
   *
   * @param {object} [opts] - Mutation Options and configuration
   * @param {string} [opts.cadence] - Cadence Transaction used to mutate Flow
   * @param {import("../shared-exports").ArgsFn} [opts.args] - Arguments passed to cadence transaction
   * @param {object | string} [opts.template] - Interaction Template for a transaction
   * @param {number} [opts.limit] - Compute Limit for transaction
   * @param {Function} [opts.authz] - Authorization function for transaction
   * @param {Function} [opts.proposer] - Proposer Authorization function for transaction
   * @param {Function} [opts.payer] - Payer Authorization function for transaction
   * @param {Array<Function>} [opts.authorizations] - Authorizations function for transaction
   * @returns {Promise<string>} Transaction Id
   *
   * @example
   * fcl.mutate({
   *   cadence: `
   *     transaction(a: Int, b: Int, c: Address) {
   *       prepare(acct: AuthAccount) {
   *         log(acct)
   *         log(a)
   *         log(b)
   *         log(c)
   *       }
   *     }
   *   `,
   *   args: (arg, t) => [
   *     arg(6, t.Int),
   *     arg(7, t.Int),
   *     arg("0xba1132bc08f82fe2", t.Address),
   *   ],
   * })
   *
   *
   * Options:
   * type Options = {
   *   template: InteractionTemplate | String // InteractionTemplate or url to one
   *   cadence: String!,
   *   args: (arg, t) => Array<Arg>,
   *   limit: Number,
   *   authz: AuthzFn, // will overload the trinity of signatory roles
   *   proposer: AuthzFn, // will overload the proposer signatory role
   *   payer: AuthzFn, // will overload the payer signatory role
   *   authorizations: [AuthzFn], // an array of authorization functions used as authorizations signatory roles
   * }
   */
  const mutate = async (opts = {}) => {
    var txid
    try {
      await preMutate(opts)
      opts = await prepTemplateOpts(opts)
      const currentUser = getCurrentUser({platform})
      // Allow for a config to overwrite the authorization function.
      // prettier-ignore
      const authz = await sdk.config().get("fcl.authz", currentUser().authorization)

      txid = sdk.config().overload(opts.dependencies || {}, async () =>
        // prettier-ignore
        sdk.send([
        sdk.transaction(opts.cadence),

        sdk.args(normalizeArgs(opts.args || [])),

        opts.limit && isNumber(opts.limit) && sdk.limit(opts.limit),

        // opts.proposer > opts.authz > authz
        sdk.proposer(opts.proposer || opts.authz || authz),

        // opts.payer > opts.authz > authz
        sdk.payer(opts.payer || opts.authz || authz),

        // opts.authorizations > [opts.authz > authz]
        sdk.authorizations(opts.authorizations || [opts.authz || authz]),
      ]).then(sdk.decode)
      )

      return txid
    } catch (error) {
      throw error
    }
  }

  return mutate
}
