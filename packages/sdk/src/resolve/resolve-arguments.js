import {invariant} from "@onflow/util-invariant"
import {isTransaction, isScript} from "../interaction/interaction.js"

const isFn = v => typeof v === "function"

function cast(arg) {
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
      ix.arguments[id].asArgument = cast(arg)
    }
  }

  return ix
}
