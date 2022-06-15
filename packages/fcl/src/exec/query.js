import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {isRequired, isObject, isString, isFunc} from "./utils/is"
import {normalizeArgs} from "./utils/normalize-args"
import {log} from "@onflow/util-logger"

/** Query the Flow Blockchain
 *
 *  @arg {Object} opts         - Query Options and configuration
 *  @arg {string} opts.cadence - Cadence Script used to query Flow
 *  @arg {ArgsFn} opts.args    - Arguments passed to cadence script
 *  @arg {number} opts.limit   - Compute Limit for Query
 *  @returns {Promise<Response>}
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
 *    const cadence = `
 *      cadence: `
 *        pub fun main(a: Int, b: Int, c: Address): Int {
 *          log(c)
 *          return a + b
 *        }
 *    `.trim()
 *
 *    const args = (arg, t) => [
 *      arg(5, t.Int),
 *      arg(7, t.Int),
 *      arg("0xb2db43ad6bc345fec9", t.Address),
 *    ]
 *
 *    await query({ cadence, args })
 */
export async function query(opts = {}) {
  await preQuery(opts)

  // prettier-ignore
  return sdk.send([
    sdk.script(opts.cadence),
    sdk.args(normalizeArgs(opts.args || [])),
    opts.limit && typeof opts.limit === "number" && sdk.limit(opts.limit)
  ]).then(sdk.decode)
}

async function preQuery(opts) {
  invariant(
    isRequired(opts.cadence),
    "query({ cadence }) -- cadence is required"
  )

  invariant(
    isString(opts.cadence),
    "query({ cadence }) -- cadence must be a string"
  )

  let node =
    (await sdk.config.get("accessNode.httpApi")) ||
    (await sdk.config.get("accessNode.grpcApi"))

  if (!node) {
    node = await sdk.config.get("accessNode.api")
    log.deprecate({
      pkg: "FCL/SDK",
      subject:
        'Providing the access node endpoint via the "accessNode.api" configuration key',
      message:
        'Please provide either "accessNode.httpApi" or "accessNode.grpcApi" instead.',
      transition:
        "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0010-deprecate-accessNode-api",
    })
  }

  invariant(
    node,
    `Required value for either "accessNode.httpApi" or "accessNode.grpcApi" not defined in config. See: ${"https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#configuration"}`
  )
}
