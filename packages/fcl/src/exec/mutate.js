import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import {config} from "@onflow/config"
import {isRequired, isObject, isString, isFunc, isNumber} from "./utils/is"
import {normalizeArgs} from "./utils/normalize-args"
import {currentUser} from "../current-user"
import {transaction} from "../transaction"
import {deriveCadenceByNetwork} from "../interaction-template-utils"
import {retrieve} from "../document/document.js"
import {deriveDependencies} from "./utils/derive-dependencies"
import {normalizeInteractionTemplate} from "../interaction-template-utils/normalize/interaction-template"

/** As the current user Mutate the Flow Blockchain
 *
 *  @arg {Object} opts - Mutation Options and configuration
 *  @arg {string} opts.cadence - Cadence Transaction used to mutate Flow
 *  @arg {ArgsFn} opts.args - Arguments passed to cadence transaction
 *  @arg {Object} opts.template - InteractionTemplate passed to cadence transaction
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
export async function mutate(opts = {}) {
  var txid
  try {
    await prepMutation(opts)

    // Allow for a config to overwrite the authorization function.
    // prettier-ignore
    const authz = await sdk.config().get("fcl.authz", currentUser().authorization)

    if (isString(opts?.template)) {
      opts.template = await retrieve({url: opts?.template})
    }

    if (opts?.template) {
      opts.template = normalizeInteractionTemplate(opts?.template)
    }

    let dependencies = {}
    if (opts?.template) {
      dependencies = await deriveDependencies({template})
    }

    const cadence =
      opts.cadence ||
      deriveCadenceByNetwork({
        template: opts.template,
        network: await sdk.config().get("flow.network"),
      })

    txid = config.overload(dependencies, async () =>
      // prettier-ignore
      sdk.send([
        // sdk.transaction(opts.cadence || opts?.template?.data?.cadence),
        sdk.transaction(cadence),

        sdk.args(normalizeArgs(opts.args || [])),

        opts.limit && isNumber(opts.limit) && sdk.limit(opts.limit),

        // opts.proposer > opts.authz > authz
        sdk.proposer(opts.proposer || opts.authz || authz),

        // opts.payer > opts.authz > authz
        sdk.payer(opts.payer || opts.authz || authz),

        sdk.template(opts.template || null),

        // opts.authorizations > [opts.authz > authz]
        sdk.authorizations(opts.authorizations || [opts.authz || authz]),
      ]).then(sdk.decode)
    )

    return txid
  } catch (error) {
    throw error
  }
}

async function prepMutation(opts) {
  // prettier-ignore
  invariant(isRequired(opts), "mutate(opts) -- opts is required")
  // prettier-ignore
  invariant(isObject(opts), "mutate(opts) -- opts must be an object")
  // prettier-ignore
  invariant(isRequired(opts.cadence || opts?.template), "mutate({ cadence }) -- cadence is required")
  // // prettier-ignore
  invariant(
    isString(opts.cadence) || opts?.template,
    "mutate({ cadence }) -- cadence must be a string"
  )
  // prettier-ignore
  invariant(
    await sdk.config.get("accessNode.api"),
    `Required value for "accessNode.api" not defined in config. See: ${"https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#configuration"}`
  )
}
