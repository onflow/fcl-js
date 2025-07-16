import * as sdk from "@onflow/sdk"
import type {ArgsFn} from "./args"
import {normalizeArgs} from "./utils/normalize-args"
import {preQuery} from "./utils/pre"
import {prepTemplateOpts} from "./utils/prep-template-opts"
import {FCLContext} from "../context"
import {createPartialGlobalFCLContext} from "../context/global"

export interface QueryOptions {
  cadence?: string
  args?: ArgsFn
  template?: any
  isSealed?: boolean
  limit?: number
}

export function createQueryRaw(context: Pick<FCLContext, "sdk" | "config">) {
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
   * import * as fcl from '@onflow/fcl';
   *
   * const result = await fcl.queryRaw({
   *   cadence: `
   *     access(all) fun main(a: Int, b: Int, addr: Address): Int {
   *       log(addr)
   *       return a + b
   *     }
   *   `,
   *   args: (arg, t) => [
   *     arg(7, t.Int), // a: Int
   *     arg(6, t.Int), // b: Int
   *     arg('0xba1132bc08f82fe2', t.Address), // addr: Address
   *   ],
   * });
   */
  async function queryRaw(opts: QueryOptions = {}): Promise<any> {
    await preQuery(context, opts)
    opts = await prepTemplateOpts(context, opts)

    return sdk.send([
      sdk.script(opts.cadence!),
      sdk.args(normalizeArgs(opts.args || [])),
      sdk.atLatestBlock(opts.isSealed ?? false),
      opts.limit &&
        typeof opts.limit === "number" &&
        (sdk.limit(opts.limit!) as any),
    ])
  }

  return queryRaw
}

export const queryRaw = /* @__PURE__ */ createQueryRaw(
  createPartialGlobalFCLContext()
)
