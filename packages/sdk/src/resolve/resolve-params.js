import {isTransaction, isScript, get, Ok} from "@onflow/interaction"

const isFn = d => typeof d === "function"
const isString = s => typeof s === "string"

export const resolveParams = async (ix) => {
  if (!(isTransaction(ix) || isScript(ix))) return Ok(ix)
  const cadence = get(ix, 'ix.cadence')
  if (isString(cadence)) {
    ix.message.cadence = cadence
    return Ok(ix)
  }
  if (isFn(cadence)) {
    let unresolvedParams = Object
      .values(ix.params)
    let params = await Promise.all(unresolvedParams.map(
      async function resParam(up) {
        if (typeof up.resolve === "function") return ({
          ...await up.resolve(),
          tempId: up.tempId
        })
        return up
      }
    ))
    params.forEach(p => {
      ix.params[p.tempId] = p
    })
    params = Object.fromEntries(params
      .filter(param => param.key != null)
      .map(param => [param.key, param.xform.asInjection(param.value)]))

    ix.message.cadence = cadence(params)

    return Ok(ix)
  }
  throw new Error("Invalid Cadence Value")
}
