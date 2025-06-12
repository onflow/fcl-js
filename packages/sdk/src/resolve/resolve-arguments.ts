import {invariant} from "@onflow/util-invariant"
import {isTransaction, isScript} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

interface Argument {
  tempId: string
  value: any
  xform: any
  resolveArgument?: () => Promise<Argument>
  asArgument?: any
}

const isFn = (v: any): v is Function => typeof v === "function"

function cast(arg: Argument): any {
  // prettier-ignore
  invariant(typeof arg.xform != null, `No type specified for argument: ${arg.value}`)

  if (isFn(arg.xform)) return arg.xform(arg.value)
  if (isFn(arg.xform.asArgument)) return arg.xform.asArgument(arg.value)

  // prettier-ignore
  invariant(false, `Invalid Argument`, arg)
}

async function handleArgResolution(
  arg: Argument,
  depth = 3
): Promise<Argument> {
  invariant(
    depth > 0,
    `Argument Resolve Recursion Limit Exceeded for Arg: ${arg.tempId}`
  )

  if (isFn(arg.resolveArgument)) {
    const resolvedArg = await arg.resolveArgument()
    return handleArgResolution(resolvedArg, depth - 1)
  } else {
    return arg
  }
}

/**
 * Resolves transaction arguments by evaluating argument functions and converting them to appropriate types.
 *
 * @param ix The interaction object containing arguments to resolve
 * @returns The interaction with resolved arguments
 */
export async function resolveArguments(ix: Interaction): Promise<Interaction> {
  if (isTransaction(ix) || isScript(ix)) {
    for (let [id, arg] of Object.entries(ix.arguments)) {
      const res = await handleArgResolution(arg as Argument)
      ix.arguments[id].asArgument = cast(res)
    }
  }

  return ix
}
