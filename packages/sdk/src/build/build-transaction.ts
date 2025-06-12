import {
  pipe,
  put,
  Ok,
  makeTransaction,
  InteractionBuilderFn,
} from "../interaction/interaction"
import {template} from "@onflow/util-template"

const DEFAULT_SCRIPT_ACCOUNTS: string[] = []
const DEFAULT_REF: any = null

/**
 * A template builder to use a Cadence transaction for an interaction. FCL "mutate" does the work of building, signing, and sending a transaction behind the scenes.
 *
 * Flow supports great flexibility when it comes to transaction signing, we can define multiple authorizers (multi-sig transactions) and have different payer account than proposer.
 *
 * @param args The arguments to pass to the template
 * @returns A function that processes an interaction object
 *
 * @example
 * ```typescript
 * import * as fcl from "@onflow/fcl"
 *
 * // Basic transaction usage
 * await fcl.mutate({
 *   cadence: `
 *     transaction(a: Int) {
 *       prepare(acct: &Account) {
 *         log(acct)
 *         log(a)
 *       }
 *     }
 *   `,
 *   args: (arg, t) => [
 *     arg(6, t.Int)
 *   ],
 *   limit: 50
 * })
 *
 * // Single party, single signature
 * // Proposer, payer and authorizer are the same account
 * await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       prepare(acct: &Account) {}
 *     }
 *   `,
 *   authz: currentUser, // Optional. Will default to currentUser if not provided.
 *   limit: 50,
 * })
 *
 * // Multiple parties
 * // Proposer and authorizer are the same account, but different payer
 * await fcl.mutate({
 *   cadence: `
 *     transaction {
 *       prepare(acct: &Account) {}
 *     }
 *   `,
 *   proposer: authzFn,
 *   payer: authzTwoFn,
 *   authorizations: [authzFn],
 *   limit: 50,
 * })
 * ```
 */
export function transaction(
  ...args: [string | TemplateStringsArray, ...any[]]
): InteractionBuilderFn {
  return pipe([
    makeTransaction,
    put("ix.cadence", template(...args)),
    ix => {
      ix.message.refBlock = ix.message.refBlock || DEFAULT_REF
      ix.authorizations = ix.authorizations || DEFAULT_SCRIPT_ACCOUNTS
      return Ok(ix)
    },
  ])
}
