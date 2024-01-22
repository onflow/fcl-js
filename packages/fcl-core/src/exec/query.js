import * as sdk from "@onflow/sdk"
import {normalizeArgs} from "./utils/normalize-args"
import {prepTemplateOpts} from "./utils/prep-template-opts.js"
import {preQuery} from "./utils/pre.js"

/**
 * @description
 * Allows you to submit scripts to query the blockchain.
 *
 *  @param {object} opts - Query Options and configuration
 *  @param {string} opts.cadence - Cadence Script used to query Flow
 *  @param {import("../fcl").ArgsFn} [opts.args] - Arguments passed to cadence script
 *  @param {object | string} [opts.template] - Interaction Template for a script
 *  @param {number} [opts.limit]   - Compute Limit for Query
 *  @returns {Promise}
 *
 *  @example
 *    const cadence = `
 *      cadence: `
 *        access(all) fun main(a: Int, b: Int, c: Address): Int {
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
