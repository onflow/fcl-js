import {
  pipe,
  initInteraction,
  InteractionBuilderFn,
} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

/**
 * A builder function that creates an interaction from an array of builder functions.
 *
 * The build function takes an array of builder functions and applies them to create a complete interaction object. This is the foundation for constructing all interactions in Flow, whether they're scripts, transactions, or queries.
 *
 * Each builder function modifies specific parts of the interaction object, such as adding Cadence code, arguments, authorization details, or other configuration.
 *
 * @param fns The functions to apply to the interaction
 * @returns A promise of an interaction
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Build a script interaction
 * const scriptInteraction = await fcl.build([
 *   fcl.script`
 *     access(all) fun main(a: Int, b: Int): Int {
 *       return a + b
 *     }
 *   `,
 *   fcl.args([
 *     fcl.arg(1, fcl.t.Int),
 *     fcl.arg(2, fcl.t.Int)
 *   ])
 * ]);
 *
 * // Build a transaction interaction
 * const txInteraction = await fcl.build([
 *   fcl.transaction`
 *     transaction(name: String) {
 *       prepare(account: AuthAccount) {
 *         log("Hello, " + name)
 *       }
 *     }
 *   `,
 *   fcl.args([fcl.arg("World", fcl.t.String)]),
 *   fcl.proposer(proposerAuthz),
 *   fcl.payer(payerAuthz),
 *   fcl.authorizations([authorizerAuthz]),
 *   fcl.limit(100)
 * ]);
 */
export function build(
  fns: (InteractionBuilderFn | false)[] = []
): Promise<Interaction> {
  return pipe(initInteraction(), fns)
}
