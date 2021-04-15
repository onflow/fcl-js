import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {isRequired, isObject, isString, isFunc, isNumber} from "./utils/is"
import {normalizeArgs} from "./utils/normalize-args"
import {currentUser} from "../current-user"

const authz = currentUser().authorization

/** As the current user Mutate the Flow Blockchain
 *
 *  @arg {Object} opts - Mutation Options and configuration
 *  @arg {string} opts.cadence - Cadence Transaction used to mutate Flow
 *  @arg {ArgsFn} opts.args - Arguments passed to cadence transaction
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
 */
export async function mutate(opts = {}) {
  await prepMutation(opts)

  // prettier-ignore
  return sdk.send([
    sdk.transaction(opts.cadence),
    sdk.args(normalizeArgs(opts.args || [])),
    opts.limit && isNumber(opts.limit) && sdk.limit(opts.limit),
    sdk.proposer(authz),
    sdk.payer(authz),
    sdk.authorizations([authz]),
  ]).then(sdk.decode)
}

async function prepMutation(opts) {
  invariant(isRequired(opts), "mutate(opts) -- opts is required")
  invariant(isObject(opts), "mutate(opts) -- opts must be an object")
  invariant(
    isRequired(opts.cadence),
    "mutate({ cadence }) -- cadence is required"
  )
  invariant(
    isString(opts.cadence),
    "mutate({ cadence }) -- cadence must be a string"
  )
}
