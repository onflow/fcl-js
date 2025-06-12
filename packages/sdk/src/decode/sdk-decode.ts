import {config} from "@onflow/config"
import {decodeResponse} from "./decode"

/**
 * Decodes the response from 'fcl.send()' into the appropriate JSON representation of any values returned from Cadence code.
 *
 * The response from Flow contains encoded values that need to be decoded into JavaScript types. This function handles that conversion, including complex types like structs, arrays, and dictionaries.
 *
 * **To define your own decoder, see the tutorial in the decode package.**
 *
 * @param response Should be the response returned from 'fcl.send([...])'
 * @returns A JSON representation of the raw string response depending on the cadence code executed. The return value can be a single value and type or an object with multiple types.
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
 *
 * // Simple script to add 2 numbers
 * const response = await fcl.send([
 *   fcl.script`
 *     access(all) fun main(int1: Int, int2: Int): Int {
 *       return int1 + int2
 *     }
 *   `,
 *   fcl.args([fcl.arg(1, fcl.t.Int), fcl.arg(2, fcl.t.Int)])
 * ]);
 *
 * const decoded = await fcl.decode(response);
 * console.log(decoded); // 3
 * console.log(typeof decoded); // "number"
 *
 * // Complex return types
 * const complexResponse = await fcl.send([
 *   fcl.script`
 *     access(all) fun main(): {String: Int} {
 *       return {"foo": 1, "bar": 2}
 *     }
 *   `
 * ]);
 *
 * const complexDecoded = await fcl.decode(complexResponse);
 * console.log(complexDecoded); // {foo: 1, bar: 2}
 * ```
 */
export async function decode(response: any): Promise<any> {
  const decodersFromConfig = await config().where(/^decoder\./)
  const decoders = Object.entries(decodersFromConfig).map(
    ([pattern, xform]) => {
      pattern = `/${pattern.replace(/^decoder\./, "")}$/`
      return [pattern, xform]
    }
  )

  return decodeResponse(response, Object.fromEntries(decoders))
}
