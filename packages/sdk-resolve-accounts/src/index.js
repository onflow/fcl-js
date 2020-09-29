import {pipe, isTransaction, Ok} from "@onflow/interaction"

const isFn = d => typeof d === "function"
const isNumber = d => typeof d === "number"
const isString = d => typeof d === "string"

const invariant = (fact, msg, ...rest) => {
  if (!fact) {
    const error = new Error(`INVARIANT ${msg}`)
    error.stack = error.stack
      .split("\n")
      .filter(d => !/at invariant/.test(d))
      .join("\n")
    console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
    throw error
  }
}

const accountCanFulfillRoles = account => {
  if (account.role.proposer) {
    if (
      !isString(account.addr) ||
      !isNumber(account.keyId) ||
      !isNumber(account.sequenceNum) ||
      !isFn(account.signingFunction)
    )
      return false
  }
  if (account.role.payer) {
    if (
      !isString(account.addr) ||
      !isNumber(account.keyId) ||
      !isFn(account.signingFunction)
    )
      return false
  }
  if (account.role.authorizer) {
    if (
      !isString(account.addr) ||
      !isNumber(account.keyId) ||
      !isFn(account.signingFunction)
    )
      return false
  }
  return true
}

const firstNonNull = (values = []) => values.filter(Boolean)[0] || null
const firstNonNullKeyId = (values = []) =>
  typeof values.filter(isNumber)[0] === "number"
    ? values.filter(isNumber)[0]
    : null
const findProposer = (accounts = []) =>
  accounts.find(d => d.role.proposer) || {}

const deepMergeAccount = (into, from) => ({
  kind: firstNonNull([into.kind, from.kind]),
  tempId: firstNonNull([into.tempId, from.tempId]),
  addr: firstNonNull([into.addr, from.addr]),
  keyId: firstNonNullKeyId([into.keyId, from.keyId]),
  sequenceNum:
    typeof findProposer([into, from]).sequenceNum === "number"
      ? findProposer([into, from]).sequenceNum
      : into.sequenceNum,
  signature: firstNonNull([into.signature, from.signature]),
  signingFunction: firstNonNull([into.signingFunction, from.signingFunction]),
  resolve: firstNonNull([into.resolve, from.resolve]),
  role: {
    proposer: into.role.proposer || from.role.proposer,
    authorizer: into.role.authorizer || from.role.authorizer,
    payer: into.role.payer || from.role.payer,
    param: into.role.param || from.role.param,
  },
})

export const enforceResolvedAccounts = async ix => {
  if (!isTransaction(ix)) return Ok(ix)
  for (let [tempId, account] of Object.entries(ix.accounts)) {
    if (isFn(account.resolve))
      ix.accounts[tempId] = await account.resolve(account)
    invariant(
      accountCanFulfillRoles(ix.accounts[tempId]),
      "Account unable to fulfill role",
      ix.accounts[tempId]
    )
  }
  return Ok(ix)
}

export const dedupeResolvedAccounts = async ix => {
  if (!isTransaction(ix)) return Ok(ix)
  for (let account of Object.values(ix.accounts)) {
    const cid = `${account.addr}|${account.keyId}`
    if (ix.accounts[cid] != null) {
      ix.accounts[cid] = deepMergeAccount(ix.accounts[cid], {
        tempId: cid,
        ...account,
      })
    } else {
      ix.accounts[cid] = {tempId: cid, ...account}
    }
    if (ix.proposer === account.tempId) ix.proposer = cid
    if (ix.payer === account.tempId) ix.payer = cid
    ix.authorizations = ix.authorizations.map(d =>
      d === account.tempId ? cid : d
    )
    delete ix.accounts[account.tempId]
  }
  for (let account of Object.values(ix.accounts)) {
    invariant(
      accountCanFulfillRoles(account),
      "Account unable to fulfill roles",
      account
    )
  }
  return Ok(ix)
}

export const resolveAccounts = pipe([
  enforceResolvedAccounts,
  dedupeResolvedAccounts,
])
