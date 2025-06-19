import * as sdk from "@onflow/sdk"
import type {ArgsFn} from "./args"
import {normalizeArgs} from "./utils/normalize-args"
import {preQuery} from "./utils/pre"
import {prepTemplateOpts} from "./utils/prep-template-opts"

export interface QueryOptions {
  cadence?: string
  args?: ArgsFn
  template?: any
  isSealed?: boolean
  limit?: number
}

/**
 * @description Allows you to submit scripts to query the blockchain and get raw response data.
 *
 * @param opts Query Options and configuration
 * @param opts.cadence Cadence Script used to query Flow
 * @param opts.args Arguments passed to cadence script
 * @param opts.template Interaction Template for a script
 * @param opts.isSealed Block Finality
 * @param opts.limit Compute Limit for Query
 * @returns A promise that resolves to the raw query result
 *
 * @example
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
 *    await queryRaw({ cadence, args })
 */
export async function queryRaw(opts: QueryOptions = {}): Promise<any> {
  await preQuery(opts)
  opts = await prepTemplateOpts(opts)

  return sdk.send([
    sdk.script(opts.cadence!),
    sdk.args(normalizeArgs(opts.args || [])),
    sdk.atLatestBlock(opts.isSealed ?? false),
    opts.limit &&
      typeof opts.limit === "number" &&
      (sdk.limit(opts.limit!) as any),
  ])
}
