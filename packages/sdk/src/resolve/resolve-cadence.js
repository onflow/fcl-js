import {isTransaction, isScript, get, Ok} from "@onflow/interaction"

const isFn = d => typeof d === "function"
const isString = s => typeof s === "string"

export const resolveCadence = async (ix) => {
  if (!(isTransaction(ix) || isScript(ix))) return Ok(ix)
  const cadence = get(ix, 'ix.cadence')
  if (isString(cadence)) {
    ix.message.cadence = cadence
    return Ok(ix)
  } else if (isFn(cadence)) {
    return Ok(ix)
  }
  throw new Error("Invalid Cadence Value")
}
