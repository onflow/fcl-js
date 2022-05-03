export const idof = acct => `${acct.addr}-${acct.keyId}`

export function sig(opts) {
  return ["SIGNATURE", opts.addr, opts.keyId].join(".")
}

export function authzFn(opts = {}) {
  return function (account) {
    const acct = {
      ...account,
      ...opts,
      signingFunction:
        opts.signingFunction ||
        account.signingFunction ||
        fallbackSigningFunction,
    }

    return acct

    function fallbackSigningFunction(signable) {
      return {
        addr: acct.addr,
        keyId: acct.keyId,
        signature: sig(acct),
      }
    }
  }
}

export function authzResolve(opts = {}) {
  return function (account) {
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

export function authzResolveMany(opts = {}) {
  return function (account) {
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
