import {InteractionAccount} from "@onflow/typedefs"
import {withPrefix} from "@onflow/util-address"

export const idof = (acct: InteractionAccount) =>
  `${withPrefix(acct.addr)}-${acct.keyId}`

export function sig(opts: Partial<InteractionAccount>) {
  return ["SIGNATURE", opts.addr, opts.keyId].join(".")
}

interface IAuthzOpts {
  signingFunction?: (signable: any) => any
}

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
