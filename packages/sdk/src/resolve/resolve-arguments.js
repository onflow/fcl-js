import {invariant} from "@onflow/util-invariant"
import {isTransaction, isScript} from "../interaction/interaction.js"

const isFn = v => typeof v === "function"

async function cast(arg) {
  if (isFn(arg.resolve)) {
    arg = await arg.resolve()
  }
  
  // prettier-ignore
  invariant(typeof arg.xform != null, `No type specified for argument: ${arg.value}`)

  if (isFn(arg.xform)) return arg.xform(arg.value)
  if (isFn(arg.xform.asArgument)) return arg.xform.asArgument(arg.value)

  // prettier-ignore
  invariant(false, `Invalid Argument`, arg)
}

export async function resolveArguments(ix) {
  if (isTransaction(ix) || isScript(ix)) {
    for (let [id, arg] of Object.entries(ix.arguments)) {
      const castedArg = await cast(arg)
      ix.arguments[id].asArgument = castedArg
    }
  }

  return ix
}
