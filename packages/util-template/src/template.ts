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
