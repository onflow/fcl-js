import {createQueryRaw, QueryOptions} from "./query-raw"
import {FCLContext} from "../context"
import {createPartialGlobalFCLContext} from "../context/global"

export function createQuery(context: Pick<FCLContext, "sdk" | "config">) {
  /**
   * @description Allows you to submit scripts to query the blockchain.
   *
   * @param opts Query options configuration
   * @param opts.cadence A valid cadence script (required)
   * @param opts.args Any arguments to the script if needed should be supplied via a function that returns an array of arguments
   * @param opts.limit Compute (Gas) limit for query.
   * @param opts.template Interaction Template for a script
   * @param opts.isSealed Block Finality
   * @returns A JSON representation of the response
   *
   * @example
   * import * as fcl from '@onflow/fcl';
   *
   * const result = await fcl.query({
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
   * console.log(result); // 13
   */
  async function query(opts: QueryOptions = {}): Promise<any> {
    return createQueryRaw(context)(opts).then(context.sdk.decode)
  }

  return query
}

export const query = /* @__PURE__ */ createQuery(
  createPartialGlobalFCLContext()
)
