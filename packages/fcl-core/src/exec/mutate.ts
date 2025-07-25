import type {AccountAuthorization} from "@onflow/sdk"
import * as sdk from "@onflow/sdk"
import {CurrentUserService} from "../current-user"
import {isNumber} from "../utils/is"
import type {ArgsFn} from "./args"
import {normalizeArgs} from "./utils/normalize-args"
import {preMutate} from "./utils/pre"
import {prepTemplateOpts} from "./utils/prep-template-opts"
import {FCLContext} from "../context"
import {createPartialGlobalFCLContext} from "../context/global"

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
export const createMutate = (
  context: Pick<FCLContext, "config" | "sdk" | "currentUser">
) => {
  /**
   * @description Allows you to submit transactions to the blockchain to potentially mutate the state.
   *
   * When being used in the browser, `fcl.mutate` uses the built-in `fcl.authz` function to produce the authorization (signatures) for the current user. When calling this method from Node.js, you will need to supply your own custom authorization function.
   *
   * @param opts Mutation options configuration
   * @param opts.cadence A valid cadence transaction (required)
   * @param opts.args Any arguments to the script if needed should be supplied via a function that returns an array of arguments
   * @param opts.limit Compute (Gas) limit for query.
   * @param opts.proposer The authorization function that returns a valid AuthorizationObject for the proposer role
   * @param opts.template Interaction Template for a transaction
   * @param opts.authz Authorization function for transaction
   * @param opts.payer Payer Authorization function for transaction
   * @param opts.authorizations Authorizations function for transaction
   * @returns The transaction ID
   *
   * @example
   * import * as fcl from '@onflow/fcl';
   * // login somewhere before
   * fcl.authenticate();
   *
   * const txId = await fcl.mutate({
   *   cadence: `
   *     import Profile from 0xba1132bc08f82fe2
   *
   *     transaction(name: String) {
   *       prepare(account: auth(BorrowValue) &Account) {
   *         account.storage.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
   *       }
   *     }
   *   `,
   *   args: (arg, t) => [arg('myName', t.String)],
   * });
   */
  const mutate = async (opts: MutateOptions = {}): Promise<string> => {
    var txid
    try {
      await preMutate(context, opts)
      opts = await prepTemplateOpts(context, opts)
      // Allow for a config to overwrite the authorization function.
      // prettier-ignore
      const authz: any = await context
        .config
        .get("fcl.authz", context.currentUser.authorization)

      txid = context.sdk
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
        .then(context.sdk.decode)

      return txid
    } catch (error) {
      throw error
    }
  }

  return mutate
}

/**
 * @description Legacy factory function that creates a mutate function using global FCL context.
 * This function provides backward compatibility for code that was written before the
 * introduction of dependency injection patterns in FCL. It creates a mutate function
 * by combining a partial global context with a provided current user service.
 *
 * This function is considered legacy and should be used primarily for backward compatibility.
 * New code should prefer using the `createMutate` function with a complete FCL context
 * for better testability and dependency management.
 *
 * The function creates a partial context using global configuration and SDK methods,
 * then combines it with the provided current user service to create a fully functional
 * mutate function.
 *
 * @param currentUserOrConfig The current user service instance that provides authentication
 * and authorization capabilities. This service must implement the CurrentUserService interface
 * and provide methods for user authentication, authorization, and session management.
 *
 * @returns A mutate function that can submit transactions to the Flow blockchain.
 * The returned function accepts the same options as the standard mutate function:
 * - cadence: The Cadence transaction code to execute
 * - args: Function that returns transaction arguments
 * - template: Interaction template for standardized transactions
 * - limit: Compute limit for the transaction
 * - authz: Authorization function for all roles
 * - proposer: Specific authorization for proposer role
 * - payer: Specific authorization for payer role
 * - authorizations: Array of authorization functions for authorizer roles
 *
 * @example
 * // Legacy usage with global context
 * import { getMutate } from "@onflow/fcl-core"
 * import { getCurrentUser } from "@onflow/fcl-core"
 *
 * // Get the current user service
 * const currentUser = getCurrentUser({ platform: "web" })
 *
 * // Create mutate function using legacy pattern
 * const mutate = getMutate(currentUser)
 *
 * // Use the mutate function
 * const txId = await mutate({
 *   cadence: `
 *     transaction {
 *       execute { log("Hello, Flow!") }
 *     }
 *   `
 * })
 */
export const getMutate = (currentUserOrConfig: CurrentUserService) => {
  const partialContext = createPartialGlobalFCLContext()
  const context: Pick<FCLContext, "config" | "sdk" | "currentUser"> = {
    ...partialContext,
    currentUser: currentUserOrConfig,
  }
  return createMutate(context)
}
