import type {AccountAuthorization} from "@onflow/sdk"
import * as sdk from "@onflow/sdk"
import {CurrentUserService, getCurrentUser} from "../current-user"
import {isNumber} from "../utils/is"
import type {ArgsFn} from "./args"
import {normalizeArgs} from "./utils/normalize-args"
import {preMutate} from "./utils/pre"
import {prepTemplateOpts} from "./utils/prep-template-opts"

export interface MutateOptions {
  cadence?: string
  args?: ArgsFn
  template?: any
  limit?: number
  authz?: AccountAuthorization
  proposer?: AccountAuthorization
  payer?: AccountAuthorization
  authorizations?: AccountAuthorization[]
}

/**
 * @description Factory function that returns a mutate function for a given currentUser.
 *
 * @param currentUserOrConfig CurrentUser actor or configuration
 */
export const getMutate = (currentUserOrConfig: CurrentUserService) => {
  /**
   * @description Allows you to submit transactions to the blockchain to potentially mutate the state.
   *
   * @param opts Mutation Options and configuration
   * @param opts.cadence Cadence Transaction used to mutate Flow
   * @param opts.args Arguments passed to cadence transaction
   * @param opts.template Interaction Template for a transaction
   * @param opts.limit Compute Limit for transaction
   * @param opts.authz Authorization function for transaction
   * @param opts.proposer Proposer Authorization function for transaction
   * @param opts.payer Payer Authorization function for transaction
   * @param opts.authorizations Authorizations function for transaction
   * @returns Transaction Id
   *
   * @example
   * fcl.mutate({
   *   cadence: `
   *     transaction(a: Int, b: Int, c: Address) {
   *       prepare(acct: AuthAccount) {
   *         log(acct)
   *         log(a)
   *         log(b)
   *         log(c)
   *       }
   *     }
   *   `,
   *   args: (arg, t) => [
   *     arg(6, t.Int),
   *     arg(7, t.Int),
   *     arg("0xba1132bc08f82fe2", t.Address),
   *   ],
   * })
   *
   *
   * Options:
   * type Options = {
   *   template: InteractionTemplate | String // InteractionTemplate or url to one
   *   cadence: String!,
   *   args: (arg, t) => Array<Arg>,
   *   limit: Number,
   *   authz: AuthzFn, // will overload the trinity of signatory roles
   *   proposer: AuthzFn, // will overload the proposer signatory role
   *   payer: AuthzFn, // will overload the payer signatory role
   *   authorizations: [AuthzFn], // an array of authorization functions used as authorizations signatory roles
   * }
   */
  const mutate = async (opts: MutateOptions = {}): Promise<string> => {
    var txid
    try {
      await preMutate(opts)
      opts = await prepTemplateOpts(opts)
      // Allow for a config to overwrite the authorization function.
      // prettier-ignore
      const currentUser = typeof currentUserOrConfig === "function" ? currentUserOrConfig : getCurrentUser(currentUserOrConfig)
      const authz: any = await sdk
        .config()
        .get("fcl.authz", currentUser().authorization)

      txid = sdk
        .send([
          sdk.transaction(opts.cadence!),

          sdk.args(normalizeArgs(opts.args || [])),

          opts.limit && isNumber(opts.limit) && (sdk.limit(opts.limit!) as any),

          // opts.proposer > opts.authz > authz
          sdk.proposer(opts.proposer || opts.authz || authz),

          // opts.payer > opts.authz > authz
          sdk.payer(opts.payer || opts.authz || authz),

          // opts.authorizations > [opts.authz > authz]
          sdk.authorizations(opts.authorizations || [opts.authz || authz]),
        ])
        .then(sdk.decode)

      return txid
    } catch (error) {
      throw error
    }
  }

  return mutate
}
