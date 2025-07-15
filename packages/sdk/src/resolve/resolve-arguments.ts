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
 * This function processes all arguments in a transaction or script interaction, calling their transform functions
 * to convert JavaScript values into Cadence-compatible argument formats that can be sent to the Flow network.
 *
 * The resolution process includes:
 * - Calling argument resolver functions if present
 * - Applying type transformations using the xform field
 * - Handling recursive argument resolution up to a depth limit
 *
 * @param ix The interaction object containing arguments to resolve
 * @returns The interaction with resolved arguments ready for network transmission
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Arguments are automatically resolved during send()
 * await fcl.send([
 *   fcl.script`
 *     access(all) fun main(amount: UFix64, recipient: Address): String {
 *       return "Sending ".concat(amount.toString()).concat(" to ").concat(recipient.toString())
 *     }
 *   `,
 *   fcl.args([
 *     fcl.arg("100.0", fcl.t.UFix64),    // Will be resolved to Cadence UFix64
 *     fcl.arg("0x01", fcl.t.Address)     // Will be resolved to Cadence Address
 *   ])
 * ]).then(fcl.decode);
 *
 * // The resolveArguments function handles the conversion automatically
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
