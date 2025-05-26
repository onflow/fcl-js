import * as sdk from "@onflow/sdk"
import {normalizeArgs} from "./utils/normalize-args"
import {getCurrentUser} from "../current-user"
import {prepTemplateOpts} from "./utils/prep-template-opts"
import {preMutate} from "./utils/pre"
import {isNumber} from "../utils/is"
import type {ArgsFn} from "./args"
import type {
  Account,
  CompositeSignature,
  CurrentUser,
  Service,
} from "@onflow/typedefs"
import type {AccountAuthorization} from "@onflow/sdk"
import {StorageProvider} from "../utils/storage"

// TODO: Substitute with CurrentUser interface from current-user refactoring once merged
export interface CurrentUserConfig {
  platform: string
  discovery?: object | undefined
  getStorageProvider?: () => Promise<StorageProvider>
}

// TODO: Substitute with CurrentUser interface from current-user refactoring once merged
export interface AuthenticationOptions {
  service?: Service
  redir?: boolean
  forceReauth?: boolean
}

// TODO: Substitute with CurrentUser interface from current-user refactoring once merged
export interface CurrentUserFull extends CurrentUser {
  (): CurrentUserFull
  authenticate: ({
    service,
    redir,
    forceReauth,
  }?: AuthenticationOptions) => Promise<CurrentUser>
  unauthenticate: () => void
  authorization: (account: Account) => Promise<Account>
  signUserMessage: (msg: string) => Promise<CompositeSignature[]>
  subscribe: (callback: (user: CurrentUser) => void) => () => void
  snapshot: () => Promise<CurrentUser>
  resolveArgument: () => Promise<string>
}

export interface MutateOptions {
  cadence?: string
  args?: ArgsFn | any[]
  template?: string | any
  limit?: number
  authz?: AccountAuthorization
  proposer?: AccountAuthorization
  payer?: AccountAuthorization
  authorizations?: AccountAuthorization[]
  [key: string]: any
}

/**
 * @description Factory function that returns a mutate function for a given currentUser.
 *
 * @param currentUserOrConfig CurrentUser actor or configuration
 */
export const getMutate = (
  currentUserOrConfig: CurrentUserFull | CurrentUserConfig
) => {
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
