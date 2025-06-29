import {createQueryRaw, QueryOptions} from "./query-raw"
import {FCLContext} from "../context"

export function createQuery(context: FCLContext) {
  /**
   * @description Allows you to submit scripts to query the blockchain.
   *
   * @param opts Query Options and configuration
   * @param opts.cadence Cadence Script used to query Flow
   * @param opts.args Arguments passed to cadence script
   * @param opts.template Interaction Template for a script
   * @param opts.isSealed Block Finality
   * @param opts.limit Compute Limit for Query
   * @returns A promise that resolves to the query result
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
   *    await query({ cadence, args })
   */
  async function query(opts: QueryOptions = {}): Promise<any> {
    return createQueryRaw(context)(opts).then(context.sdk.decode)
  }

  return query
}
