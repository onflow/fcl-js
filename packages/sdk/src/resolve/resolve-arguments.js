import {isTransaction, isScript, Ok} from "@onflow/interaction"

export const resolveArguments = async (ix) => {
  if (!(isTransaction(ix) || isScript(ix))) return Ok(ix)
  
  let unresolvedArguments = Object
      .values(ix.arguments)
  let args = await Promise.all(unresolvedArguments.map(
    async function resArg(ua) {
      if (typeof ua.resolve === "function") return ({
        ...await ua.resolve(),
        tempId: ua.tempId
      })
      return ua
    }
  ))
  args.forEach(a => {
    ix.arguments[a.tempId] = {
      ...a,
      asArgument: a.xform.asArgument(a.value),
    }
  })

  return Ok(ix)
}
