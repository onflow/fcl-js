import {sansPrefix, withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import {isTransaction} from "../interaction/interaction.js"
import {createSignableVoucher} from "./voucher.js"

const idof = acct => `${withPrefix(acct.addr)}-${acct.keyId}`
const isFn = v => typeof v === "function"

const genAccountId = (...ids) => ids.join("-")

const ROLES = {
  PAYER: "payer",
  PROPOSER: "proposer",
  AUTHORIZATIONS: "authorizations",
}

export function buildPreSignable(acct, ix) {
  try {
    return {
      f_type: "PreSignable",
      f_vsn: "1.0.1",
      roles: acct.role,
      cadence: ix.message.cadence,
      args: ix.message.arguments.map(d => ix.arguments[d].asArgument),
      data: {},
      interaction: ix,
      voucher: createSignableVoucher(ix),
    }
  } catch (error) {
    console.error("buildPreSignable", error)
    throw error
  }
}

async function removeUnusedIxAccounts(ix) {
  const payerTempIds = Array.isArray(ix.payer) ? ix.payer : [ix.payer]
  const authorizersTempIds = Array.isArray(ix.authorizations)
    ? ix.authorizations
    : [ix.authorizations]
  const proposerTempIds = Array.isArray(ix.proposer)
    ? ix.proposer
    : [ix.proposer]

  const ixAccountKeys = Object.keys(ix.accounts)
  const uniqueTempIds = [
    ...new Set(payerTempIds.concat(authorizersTempIds, proposerTempIds)),
  ]

  for (const ixAccountKey of ixAccountKeys) {
    if (!uniqueTempIds.find(id => id === ixAccountKey)) {
      delete ix.accounts[ixAccountKey]
    }
  }
}

const addAccountToIx = (ix, newAccount) => {
  if (
    typeof newAccount.addr !== undefined &&
    typeof newAccount.keyId !== undefined
  ) {
    newAccount.tempId = idof(newAccount)
  }

  const existingAccount = ix.accounts[newAccount.tempId] || newAccount

  ix.accounts[newAccount.tempId] = newAccount

  ix.accounts[newAccount.tempId].role.proposer =
    existingAccount.role.proposer || newAccount.role.proposer
  ix.accounts[newAccount.tempId].role.payer =
    existingAccount.role.payer || newAccount.role.payer
  ix.accounts[newAccount.tempId].role.authorizer =
    existingAccount.role.authorizer || newAccount.role.authorizer

  return ix.accounts[newAccount.tempId]
}

const recurseFlatMap = (el, depthLimit = 3) => {
  if (depthLimit <= 0) return el
  if (!Array.isArray(el)) return el
  return recurseFlatMap(
    el.flatMap(e => e),
    depthLimit - 1
  )
}

const uniqueAccountsFlatMap = accounts => {
  const flatMapped = recurseFlatMap(accounts)
  const seen = new Set()

  const uniqueAccountsFlatMapped = flatMapped
    .map(account => {
      const accountId = genAccountId(
        account.tempId,
        account.role.payer,
        account.role.proposer,
        account.role.authorizer,
        account.role.param
      )
      if (seen.has(accountId)) return null
      seen.add(accountId)
      return account
    })
    .filter(e => e !== null)

  return uniqueAccountsFlatMapped
}

async function recurseResolveAccount(ix, account, depthLimit = 3) {
  if (depthLimit <= 0) return account

  if (!account) return null

  account = addAccountToIx(ix, account)

  if (account?.resolve) {
    if (isFn(account?.resolve)) {
      let resolvedAccounts = await account.resolve(
        account,
        buildPreSignable(account, ix)
      )

      resolvedAccounts = Array.isArray(resolvedAccounts)
        ? resolvedAccounts
        : [resolvedAccounts]

      account.resolve = resolvedAccounts

      account = addAccountToIx(ix, account)

      let recursedAccounts = await Promise.all(
        resolvedAccounts.map(
          async resolvedAccount =>
            await recurseResolveAccount(ix, resolvedAccount, depthLimit - 1)
        )
      )

      return recursedAccounts ? recursedAccounts : account
    } else {
      return account.resolve
    }
  }
  return account
}

async function resolveAccountType(ix, type) {
  invariant(
    ix && typeof ix === "object",
    "recurseResolveAccount Error: ix not defined"
  )
  invariant(
    type === ROLES.PAYER ||
      type === ROLES.PROPOSER ||
      type === ROLES.AUTHORIZATIONS,
    "recurseResolveAccount Error: type must be 'payer', 'proposer' or 'authorizations'"
  )

  let accountTempIDs = Array.isArray(ix[type]) ? ix[type] : [ix[type]]

  let resolvedTempIds = []
  for (let accountId of accountTempIDs) {
    let account = ix.accounts[accountId]

    invariant(account, `recurseResolveAccount Error: account not found`)

    let resolvedAccounts = await recurseResolveAccount(ix, account)

    resolvedAccounts = Array.isArray(resolvedAccounts)
      ? resolvedAccounts
      : [resolvedAccounts]

    let flatResolvedAccounts = uniqueAccountsFlatMap(resolvedAccounts)

    resolvedTempIds = resolvedTempIds.concat(flatResolvedAccounts)
  }

  invariant(
    resolvedTempIds.length > 0,
    "recurseResolveAccount Error: failed to resolve any accounts"
  )

  if (type === ROLES.PAYER) {
    resolvedTempIds = resolvedTempIds.filter(acct => acct.role.payer === true)
  }
  if (type === ROLES.PROPOSER) {
    resolvedTempIds = resolvedTempIds.filter(
      acct => acct.role.proposer === true
    )
  }
  if (type === ROLES.AUTHORIZATIONS) {
    resolvedTempIds = resolvedTempIds.filter(
      acct => acct.role.authorizer === true
    )
  }

  ix[type] = Array.isArray(ix[type])
    ? [...new Set(resolvedTempIds.map(acct => acct.tempId))]
    : resolvedTempIds[0].tempId

  // Ensure all payers are of the same account
  if (type === ROLES.PAYER) {
    let address
    for (const payerTempID of ix[ROLES.PAYER]) {
      let pAcct = ix.accounts[payerTempID]
      if (!address) address = pAcct.addr
      else if (address !== pAcct.addr)
        throw new Error(
          "recurseResolveAccount Error: payers from different accounts detected"
        )
    }
  }
}

export async function resolveAccounts(ix) {
  if (isTransaction(ix)) {
    if (!Array.isArray(ix.payer)) {
      log.deprecate({
        pkg: "FCL",
        subject:
          '"ix.payer" must be an array. Support for ix.payer as a singular',
        message: "See changelog for more info.",
      })
    }
    try {
      await resolveAccountType(ix, ROLES.PROPOSER)
      await resolveAccountType(ix, ROLES.PAYER)
      await resolveAccountType(ix, ROLES.AUTHORIZATIONS)

      await removeUnusedIxAccounts(ix)
    } catch (error) {
      console.error("=== SAD PANDA ===\n\n", error, "\n\n=== SAD PANDA ===")
      throw error
    }
  }
  return ix
}
