export const authzFn = (opts = {}) => account => {
  const fallbackSigningFunction = signable => ({
    addr: opts.addr || account.addr,
    keyId: opts.keyId || account.keyId,
    signature: [
      "SIGNATURE",
      opts.addr || account.addr,
      opts.keyId || account.keyId,
    ].join("."),
  })

  return {
    ...account,
    ...opts,
    signingFunction:
      opts.signingFunction ||
      account.signingFunction ||
      fallbackSigningFunction,
  }
}

export const authzResolve = (opts = {}) => account => {
  const {tempId, ...rest} = opts
  return {
    ...account,
    tempId: tempId || "WITH_RESOLVE",
    resolve: authzFn(rest),
  }
}

const ROLE = {proposer: false, authorizer: false, payer: false}

const noop = () => {}
export const authzResolveMany = (opts = {}) => account => {
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
