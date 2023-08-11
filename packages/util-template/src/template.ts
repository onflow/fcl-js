import {log} from "@onflow/util-logger"

export function interleave(
  a: unknown[] = [],
  b: unknown[] = [],
  c: unknown[] = []
): unknown[] {
  if (!a.length && !b.length) return c
  if (!a.length) return c
  if (!b.length) return [...c, a[0]]

  const [aHead, ...aRest] = a
  const [bHead, ...bRest] = b

  if (aHead !== undefined) c.push(aHead)
  if (bHead !== undefined) c.push(bHead)

  return interleave(aRest, bRest, c)
}

function recApply(d: unknown): (x: unknown) => string {
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

export function template(
  head: string | TemplateStringsArray | ((x: unknown) => string),
  ...rest: unknown[]
): (x?: unknown) => string {
  if (typeof head === "string") return () => head
  if (typeof head === "function") return head
  return d =>
    interleave([...head], rest.map(recApply(d)))
      .join("")
      .trim()
}
