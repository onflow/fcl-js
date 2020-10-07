import {isTransaction, isScript, Ok, Bad} from "@onflow/interaction"

function ignore(ix) {
  return !(isTransaction(ix) || isScript(ix))
}

function cast (arg) {
  if (typeof arg.xform == null) throw new Error(`No type specified for argument: ${arg.value}`)
  if (typeof arg.xform === "function") return arg.xform(arg.value)
  if (typeof arg.xform.asArgument === "function") return arg.xform.asArgument(arg.value)
  console.error("Invalid Argument", arg)
  throw new Error(`Invalid Argument`)
}

export async function resolveArguments (ix) {
  if (ignore(ix)) return Ok(ix)

  for (let [id, arg] of Object.entries(ix.arguments)) {
    ix.arguments[id].asArgument = cast(arg)
  }

  return Ok(ix)
}
