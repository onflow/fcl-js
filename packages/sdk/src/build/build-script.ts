import {
  pipe,
  put,
  makeScript,
  InteractionBuilderFn,
} from "../interaction/interaction"
import {template} from "@onflow/util-template"

/**
 * A builder function that creates a script interaction. Scripts allow you to write arbitrary non-mutating Cadence code on the Flow blockchain and return data.
 *
 * You can learn more about [Cadence here](https://cadence-lang.org/docs/language) and [scripts here](./scripts.md), but we are now only interested in executing the script code and getting back the data.
 *
 * We can execute a script using the latest state of the Flow blockchain or we can choose to execute the script at a specific time in history defined by a block height or block ID.
 *
 * Block ID is SHA3-256 hash of the entire block payload, but you can get that value from the block response properties.
 *
 * Block height expresses the height of the block in the chain.
 *
 * @param args The arguments to pass to the template
 * @returns A function that processes an interaction object
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
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
 *     arg("0xba1132bc08f82fe2", t.Address), // addr: Address
 *   ],
 * });
 *
 * console.log(result); // 13
 * ```
 */
export function script(
  ...args: [
    string | TemplateStringsArray | ((x?: unknown) => string),
    ...unknown[],
  ]
): InteractionBuilderFn {
  return pipe([makeScript, put("ix.cadence", template(...args))])
}
