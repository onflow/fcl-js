import {isTransaction, isScript, pipe, get, Ok, update} from "@onflow/interaction"

function isFn(v) {
  return typeof v === "function"
}

export const resolveParams = pipe([
  ix => {
    if (!isTransaction(ix) && !isScript(ix)) return Ok(ix)
    const cadence = get(ix, "ix.cadence")
    ix.message.cadence = isFn(cadence) ? cadence(get(ix, "ix.params", {})) : cadence
    return Ok(ix)
  }
])
