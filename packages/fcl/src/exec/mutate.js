import * as sdk from "@onflow/sdk"
import {normalizeArgs} from "./utils/normalize-args"
import {currentUser} from "../current-user"
import {prepTemplateOpts} from "./utils/prep-template-opts.js"
import {preMutate} from "./utils/pre.js"

/**
 * @description
 * Allows you to submit transactions to the blockchain to potentially mutate the state.
 *
 *  @param {Object} opts - Mutation Options and configuration
 *  @param {string} opts.cadence - Cadence Transaction used to mutate Flow
 *  @param {ArgsFn} [opts.args] - Arguments passed to cadence transaction
 *  @param {Object} [opts.template] - Interaction Template for a transaction
 *  @param {number} [opts.limit] - Compute Limit for transaction
 *  @returns {string} Transaction Id
 *
 *  Where:
 *    @callback ArgsFn
 *    @param {ArgFn} arg - Argument function to define a single argument
 *    @param {Object} t - Cadence Types object used to define the type
 *    @returns {Array<any>}
 *
 *    @callback ArgFn
 *    @param {any} value - the value of the argument
 *    @param {Type} type - the cadence type of the value
 *    @returns {any}
 *
 * @example
 *    fcl.mutate({
 *      cadence: `
 *        transaction(a: Int, b: Int, c: Address) {
 *          prepare(acct: AuthAccount) {
 *            log(acct)
 *            log(a)
 *            log(b)
 *            log(c)
 *          }
 *        }
 *      `,
 *      args: (arg, t) => [
 *        arg(6, t.Int),
 *        arg(7, t.Int),
 *        arg("0xba1132bc08f82fe2", t.Address),
 *      ],
 *    })
 *
 *
 *  Options:
 *    type Options = {
 *      template: InteractionTemplate | String // InteractionTemplate or url to one
 *      cadence: String!,
 *      args: (arg, t) => Array<Arg>,
 *      limit: Number,
 *      authz: AuthzFn, // will overload the trinity of signatory roles
 *      proposer: AuthzFn, // will overload the proposer signatory role
 *      payer: AuthzFn, // will overload the payer signatory role
 *      authorizations: [AuthzFn], // an array of authorization functions used as authorizations signatory roles
 *    }
 */
export async function mutate(opts = {}) {
  var txid
  try {
    await preMutate(opts)
    opts = await prepTemplateOpts(opts)

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
