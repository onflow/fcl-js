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

async function handleArgResolution(arg, depth = 3) {
  invariant(depth > 0, `Argument Resolve Recursion Limit Exceeded for Arg: ${arg.tempId}`)

  if (isFn(arg.resolveArgument)) {
    const resolvedArg = await arg.resolveArgument()
    return handleArgResolution(resolvedArg, depth - 1)
  } else {
    return arg
  }
}

export async function resolveArguments(ix) {
  if (isTransaction(ix) || isScript(ix)) {
    for (let [id, arg] of Object.entries(ix.arguments)) {
      const res = await handleArgResolution(arg)
      ix.arguments[id].asArgument = cast(res)
    }
  }

  return ix
}
