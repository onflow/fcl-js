export function interleave(a = [], b = [], c = []) {
  if (!a.length && !b.length) return c
  if (!a.length) return c
  if (!b.length) return [...c, a[0]]

  const [aHead, ...aRest] = a
  const [bHead, ...bRest] = b

  if (aHead !== undefined) c.push(aHead)
  if (bHead !== undefined) c.push(bHead)

  return interleave(aRest, bRest, c)
}

function recApply(d) {
  return function(arg1) {
    if (typeof arg1 === "function") {
      console.warn(
        `
        %cFCL/SDK Deprecation Notice
        ============================

        Interopolation of functions into template literals will not be a thing in future versions of the Flow-JS-SDK or FCL.
        You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params

        ============================
      `,
        "font-weight:bold;font-family:monospace;"
      )
      return recApply(d)(arg1(d))
    }
    return String(arg1)
  }
}

export function template(head, ...rest) {
  if (typeof head === "string") return () => head
  if (Array.isArray(head)) {
    return d =>
      interleave(head, rest.map(recApply(d)))
        .join("")
        .trim()
  }
  return head
}
