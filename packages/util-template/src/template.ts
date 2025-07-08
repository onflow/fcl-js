import {log} from "@onflow/util-logger"

/**
 * Interleaves two arrays
 * @param a - The first array
 * @param b - The second array
 * @param c - The target array
 * @returns The interleaved array
 */
export function interleave<A, B>(
  a: A[] = [],
  b: B[] = [],
  c: (A | B)[] = []
): (A | B)[] {
  if (!a.length && !b.length) return c
  if (!a.length) return c
  if (!b.length) {
    c.push(...a)
    return c
  }

  const [aHead, ...aRest] = a
  const [bHead, ...bRest] = b

  if (aHead !== undefined) c.push(aHead)
  if (bHead !== undefined) c.push(bHead)

  return interleave(aRest, bRest, c)
}

/**
 * Recursively apply a value to a function
 * @param d - The value to apply
 * @returns A function that takes a function and applies the value to it
 */
function recApply<T, U>(d: T): (x: U) => string {
  return function (arg1) {
    if (typeof arg1 === "function") {
      log.deprecate({
        pkg: "FCL/SDK",
        subject: "Interopolation of functions into template literals",
        transition:
          "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params",
      })
      return recApply(d)(arg1(d))
    }
    return String(arg1)
  }
}

/**
 * Creates a template function
 * @param head - A string, template string array, or template function
 * @param rest - The rest of the arguments
 * @returns A template function
 *
 * @example
 * import { template } from "@onflow/util-template"
 *
 * // String template
 * const simpleTemplate = template("Hello, World!");
 * console.log(simpleTemplate()); // "Hello, World!"
 *
 * // Template literal with interpolation
 * const name = "Alice";
 * const greeting = template`Hello, ${name}!`;
 * console.log(greeting()); // "Hello, Alice!"
 *
 * // Cadence script template
 * const cadenceScript = template`
 *   access(all) fun main(greeting: String): String {
 *     return greeting.concat(", from Flow!")
 *   }
 * `;
 * console.log(cadenceScript()); // The Cadence script as a string
 *
 * // Used with FCL for dynamic Cadence code
 * import * as fcl from "@onflow/fcl";
 *
 * const contractAddress = "0x123456789abcdef0";
 * const scriptTemplate = fcl.cadence`
 *   import MyContract from ${contractAddress}
 *
 *   access(all) fun main(): String {
 *     return MyContract.getMessage()
 *   }
 * `;
 */
export function template(
  head: string | TemplateStringsArray | ((x?: unknown) => string),
  ...rest: unknown[]
): (x?: unknown) => string {
  if (typeof head === "string") return () => head
  if (typeof head === "function") return head
  return (x: unknown) =>
    interleave([...head], rest.map(recApply(x)))
      .join("")
      .trim()
}
