import {InteractionAccount} from "@onflow/typedefs"
import {withPrefix} from "@onflow/util-address"

/**
 * Generates a unique identifier for an account based on its address and key ID.
 *
 * @param acct The account object
 * @returns A string identifier in the format "address-keyId"
 */
export const idof = (acct: InteractionAccount) =>
  `${withPrefix(acct.addr)}-${acct.keyId}`

/**
 * Generates a test signature string for an account.
 *
 * @param opts Partial account object containing address and keyId
 * @returns A test signature string in the format "SIGNATURE.address.keyId"
 */
export function sig(opts: Partial<InteractionAccount>) {
  return ["SIGNATURE", opts.addr, opts.keyId].join(".")
}

interface IAuthzOpts {
  signingFunction?: (signable: any) => any
}

/**
 * Creates a test authorization function for testing transactions.
 *
 * @param opts Optional configuration including custom signing function
 * @returns An authorization function that can be used in tests
 */
export function authzFn(opts: IAuthzOpts = {}) {
  return function (account: Partial<InteractionAccount>) {
    const acct: Partial<InteractionAccount> = {
      ...account,
      ...opts,
      resolve: null,
      signingFunction:
        opts.signingFunction ||
        account.signingFunction ||
        fallbackSigningFunction,
    }

    return acct

    function fallbackSigningFunction(_signable: any) {
      return {
        addr: acct.addr,
        keyId: acct.keyId,
        signature: sig(acct),
      }
    }
  }
}

interface IAuthzResolveOpts {
  tempId?: string
}

/**
 * Creates a test authorization resolver that can be used for testing account resolution.
 *
 * @param opts Optional configuration including temporary ID
 * @returns A function that returns an account with resolve capability
 */
export function authzResolve(opts: IAuthzResolveOpts = {}) {
  return function (account: InteractionAccount) {
    const {tempId, ...rest} = opts
    return {
      ...account,
      tempId: tempId || "WITH_RESOLVE",
      resolve: authzFn(rest),
    }
  }
}

const ROLE = {proposer: false, authorizer: false, payer: false}
const noop = () => {}

interface IAuthzResolveMany {
  tempId?: string
  authorizations: any[]
  proposer?: any
  payer?: any
}

/**
 * Creates a test authorization resolver that handles multiple accounts with different roles.
 *
 * @param opts Configuration including authorizations array and optional proposer/payer
 * @returns A function that returns an account with multi-role resolve capability
 */
export function authzResolveMany(
  opts: IAuthzResolveMany = {authorizations: []}
) {
  return function (account: InteractionAccount): InteractionAccount {
    const tempId = opts.tempId || "AUTHZ_RESOLVE_MANY"
    return {
      ...account,
      tempId,
      resolve: () =>
        [
          opts.proposer &&
            authzFn(opts.proposer)({role: {...ROLE, proposer: true}}),
          ...opts.authorizations
            .map(authzFn)
            .map(d => d({role: {...ROLE, authorizer: true}})),
          opts.payer && authzFn(opts.payer)({role: {...ROLE, payer: true}}),
        ].filter(Boolean),
    }
  }
}

/**
 * Creates a deep test authorization resolver with nested resolution for complex testing scenarios.
 *
 * @param opts Configuration including authorizations array and optional proposer/payer
 * @param depth The depth of nesting for the resolver (default: 1)
 * @returns A function that returns an account with deep nested resolve capability
 */
export function authzDeepResolveMany(
  opts: IAuthzResolveMany = {authorizations: []},
  depth = 1
) {
  return function (account: InteractionAccount): InteractionAccount {
    const tempId = opts.tempId || "AUTHZ_DEEP_RESOLVE_MANY"
    return {
      ...account,
      tempId,
      resolve:
        depth > 0
          ? authzDeepResolveMany(opts, depth - 1)(account).resolve
          : authzResolveMany(opts)(account).resolve,
    }
  }
}
