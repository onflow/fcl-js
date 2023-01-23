import {sansPrefix, withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import {isTransaction} from "../interaction/interaction.js"
import {createSignableVoucher} from "./voucher.js"

const idof = acct => `${withPrefix(acct.addr)}-${acct.keyId}`
const isFn = v => typeof v === "function"

const genAccountId = (...ids) => ids.join("-")

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

const addAccountToIx = (ix, newAccount) => {
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
    type === "payer" || type === "proposer" || type === "authorizations",
    "recurseResolveAccount Error: type must be 'payer', 'proposer' or 'authorizations'"
  )

  let accountTempIDs = Array.isArray(ix[type]) ? ix[type] : [ix[type]]

  let accounts = accountTempIDs.map(tempId => ix.accounts[tempId])

  accounts.forEach(account => {
    invariant(account, `recurseResolveAccount Error: account not found`)
  })

  for (let account of accounts) {
    let resolvedAccounts = await recurseResolveAccount(ix, account)

    resolvedAccounts = Array.isArray(resolvedAccounts)
      ? resolvedAccounts
      : [resolvedAccounts]

    let flatResolvedAccounts = uniqueAccountsFlatMap(resolvedAccounts)

    for (const resolvedAccount of flatResolvedAccounts) {
      ix[type] = Array.isArray(ix[type])
        ? [...new Set(flatResolvedAccounts.map(acct => acct.tempId))]
        : resolvedAccount.tempId
    }

    // Ensure all payers are of the same account
    if (type === "payer") {
      let address
      for (const payerTempID of ix["payer"]) {
        let pAcct = ix.accounts[payerTempID]
        if (!address) address = pAcct.addr
        else if (address !== pAcct.addr)
          throw new Error(
            "recurseResolveAccount Error: payers from different accounts detected"
          )
      }
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
      await resolveAccountType(ix, "proposer")
      await resolveAccountType(ix, "payer")
      await resolveAccountType(ix, "authorizations")
    } catch (error) {
      console.error("=== SAD PANDA ===\n\n", error, "\n\n=== SAD PANDA ===")
      throw error
    }
  }
  return ix
}
