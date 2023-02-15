import * as sdk from "@onflow/sdk"
import {normalizeArgs} from "./utils/normalize-args"
import {prepTemplateOpts} from "./utils/prep-template-opts.js"
import {preQuery} from "./utils/pre.js"

/**
 * @description
 * Allows you to submit scripts to query the blockchain.
 *
 *  @param {Object} opts         - Query Options and configuration
 *  @param {string} opts.cadence - Cadence Script used to query Flow
 *  @param {Function} [opts.args] - Arguments passed to cadence script
 *  @param {Object} [opts.template] - Interaction Template for a script
 *  @param {number} [opts.limit]   - Compute Limit for Query
 *  @returns {Promise}
 * 
 * @example
 * import * as fcl from "@onflow/fcl"
 * 
 * fcl.query({
 *  cadence: `
 *   pub fun main(a: Int, b: Int): Int {
 *    return a + b
 *  }
 * `,
 *  args: (args, t) => [
 *    arg(5, t.Int),
 *    arg(7, t.Int),
 *    arg("0xb2db43ad6bc345fec9", t.Address),
 *  ],
 * })
 */
export async function query(opts = {}) {
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
