import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import {isRequired, isObject, isString, isNumber} from "./utils/is"
import {normalizeArgs} from "./utils/normalize-args"
import {currentUser} from "../current-user"
import {prepTemplateOpts} from "./utils/prep-template-opts"
import {preMutate} from "./utils/pre"

/** As the current user Mutate the Flow Blockchain
 *
 *  @arg {Object} opts - Mutation Options and configuration
 *  @arg {string} opts.cadence - Cadence Transaction used to mutate Flow
 *  @arg {ArgsFn} opts.args - Arguments passed to cadence transaction
 *  @arg {Object} opts.template - Interaction Template for a transaction
 *  @arg {number} opts.limit - Compute Limit for transaction
 *  @returns {string} Transaction Id
 *
 *  Where:
 *    @callback ArgsFn
 *    @arg {ArgFn}  arg - Argument function to define a single argument
 *    @arg {Object} t   - Cadence Types object used to define the type
 *    @returns {args[]}
 *
 *    @callback ArgFn
 *    @arg {Any}  value - the value of the argument
 *    @arg {Type} type  - the cadence type of the value
 *    @returns {arg}
 *
 *  Example:
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
export async function mutate(opts: any = {}) {
  var txid
  try {
    await preMutate(opts)
    opts = await prepTemplateOpts(opts)

    // Allow for a config to overwrite the authorization function.
    // prettier-ignore
    const authz = await sdk.config().get("fcl.authz", currentUser.authorization)

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
