import {
  createSignableVoucher,
  resolve as defaultResolve,
  interaction,
  InteractionBuilderFn,
  pipe,
} from "@onflow/sdk"
import {Interaction} from "@onflow/typedefs"
import {FCLContext} from "../context"
import {createPartialGlobalFCLContext} from "../context/global"

export interface SerializeOptions {
  resolve?: InteractionBuilderFn
}

/**
 * @description Serializes a Flow transaction or script to a JSON-formatted signable voucher that can be
 * used for offline signing or inspection. This is useful for creating signable transactions that can be
 * signed by external wallets or hardware devices.
 *
 * @param args Array of interaction builder functions or a pre-built interaction object. Builder functions are typically from @onflow/sdk such as
 * transaction(), script(), args(), proposer(), etc.
 * @param opts Optional configuration object
 * @param opts.resolve Custom resolve function to use instead of the default
 *
 * @returns A JSON string representation of the signable voucher that contains all
 * the transaction details needed for signing
 *
 * @example
 * // Serialize a simple transaction
 * import * as fcl from "@onflow/fcl"
 *
 * const voucher = await fcl.serialize([
 *   fcl.transaction`
 *     transaction(amount: UFix64, to: Address) {
 *       prepare(signer: AuthAccount) {
 *         // Transaction logic here
 *       }
 *     }
 *   `,
 *   fcl.args([
 *     fcl.arg("10.0", fcl.t.UFix64),
 *     fcl.arg("0x01", fcl.t.Address)
 *   ]),
 *   fcl.proposer(authz),
 *   fcl.payer(authz),
 *   fcl.authorizations([authz])
 * ])
 */
export function createSerialize(context: Pick<FCLContext, "config" | "sdk">) {
  const serialize = async (
    args: (InteractionBuilderFn | false)[] | Interaction,
    opts: SerializeOptions = {}
  ) => {
    const resolveFunction = await context.config.first(
      ["sdk.resolve"],
      opts.resolve || defaultResolve
    )

    if (Array.isArray(args)) args = await pipe(interaction(), args)

    return JSON.stringify(
      createSignableVoucher(await resolveFunction(args)),
      null,
      2
    )
  }

  return serialize
}

export const serialize = /* @__PURE__ */ createSerialize(
  createPartialGlobalFCLContext()
)
