import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import {isRequired, isObject, isString} from "./utils/is"
import {normalizeArgs} from "./utils/normalize-args"
import {prepTemplateOpts} from "./utils/prep-template-opts"
import {preQuery} from "./utils/pre"

/** Query the Flow Blockchain
 *
 *  @arg {Object} opts         - Query Options and configuration
 *  @arg {string} opts.cadence - Cadence Script used to query Flow
 *  @arg {ArgsFn} opts.args    - Arguments passed to cadence script
 *  @arg {Object} opts.template - Interaction Template for a script
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
export async function query(opts: any = {}) {
  await preQuery(opts)
  opts = await prepTemplateOpts(opts)

  return sdk.config().overload(opts.dependencies || {}, async () =>
    // prettier-ignore
    sdk.send([
      sdk.script(opts.cadence),
      sdk.args(normalizeArgs(opts.args || [])),
      opts.limit && typeof opts.limit === "number" && sdk.limit(opts.limit)
    ]).then(sdk.decode)
  )
}
