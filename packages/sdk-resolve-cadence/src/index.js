import {isTransaction, isScript, get, Ok, Bad} from "@onflow/interaction"

function ignore(ix) {
  return !(isTransaction(ix) || isScript(ix))
}

async function fetchParam(param) {
  return typeof param.resolve === "function"
    ? { ...param, ...await param.resolve(), tempId: param.tempId }
    : param
}

export async function resolveCadence (ix) {
  try {
    if (ignore(ix)) return Ok(ix)

    const cadence = get(ix, "ix.cadence")

    if (typeof cadence === "string") {
      ix.message.cadence = cadence
      return Ok(ix)

    } else if (typeof cadence === "function") {
      if (Object.values(ix.params).length >= 1) {
        console.error(
          `
          %cFCL/SDK Deprecation Notice
          ============================

          Interopolation of functions into template literals will not be a thing in future versions of the Flow-JS-SDK or FCL.
          You can learn more (including a guide on common transition paths) here: https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0001-deprecate-params

          ============================
        `,
          "font-weight:bold;font-family:monospace;"
        )
      }
      const params = Object.fromEntries(Object.values(ix.params).map(p => [p.key, p.value]))
      ix.message.cadence = await cadence(params)
      return Ok(ix)
    } else {
      throw new Error(`ix.cadence had a type of: "${typeof cadence}", but it must needs to be a "string" or a "function" that returns a string.`)
    }
  } catch (error) {
    return Bad(ix, error)
  }
}
