import {ArgsFn, MutateOptions, MutateFn} from "./types/mutate"

/**
 * Sends a Cadence transaction to the Flow blockchain.
 *
 * Builds and submits a transaction using the provided Cadence code, arguments,
 * and optional signer overrides. If no authorizer, proposer, or payer is specified,
 * the current authenticated user is used.
 *
 * @param opts - Mutation options including the Cadence transaction code, args builder,
 *               compute limit, and optional signer configuration.
 * @returns A Promise that resolves to the transaction ID.
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl";
 *
 * const txId = await fcl.mutate({
 *   cadence: `
 *     transaction(amount: UFix64) {
 *       prepare(signer: AuthAccount) {}
 *       execute {
 *         log(amount)
 *       }
 *     }
 *   `,
 *   args: (arg, t) => [arg("10.0", t.UFix64)],
 *   limit: 999,
 * });
 * ```
 */
export async function mutate(opts: MutateOptions): Promise<string> {
  const {
    cadence,
    args,
    limit,
    authz,
    proposer,
    payer,
    authorizations,
  } = opts

  const {send, decode, build, transaction, getTransactionStatus} =
    await import("@onflow/sdk")

  const builders: any[] = [transaction(cadence)]

  if (args) {
    const {args: buildArgs} = await import("@onflow/sdk")
    builders.push(buildArgs(args))
  }

  if (limit != null) {
    const {limit: buildLimit} = await import("@onflow/sdk")
    builders.push(buildLimit(limit))
  }

  if (proposer) {
    const {proposer: buildProposer} = await import("@onflow/sdk")
    builders.push(buildProposer(proposer))
  }

  if (payer) {
    const {payer: buildPayer} = await import("@onflow/sdk")
    builders.push(buildPayer(payer))
  }

  if (authorizations) {
    const {authorizations: buildAuthorizations} = await import("@onflow/sdk")
    builders.push(buildAuthorizations(authorizations))
  } else if (authz) {
    const {authorizations: buildAuthorizations} = await import("@onflow/sdk")
    builders.push(buildAuthorizations([authz]))
  }

  const response = await send(await build(builders))
  return decode(response)
}
