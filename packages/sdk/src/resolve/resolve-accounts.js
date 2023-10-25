import {sansPrefix, withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import {isTransaction} from "../interaction/interaction.js"
import {createSignableVoucher} from "./voucher.js"
import {v4 as uuidv4} from "uuid"

const MAX_DEPTH_LIMIT = 5

const idof = acct => `${withPrefix(acct.addr)}-${acct.keyId}`
const isFn = v =>
  v &&
  (Object.prototype.toString.call(v) === "[object Function]" ||
    "function" === typeof v ||
    v instanceof Function)

const genAccountId = (...ids) => ids.join("-")

const ROLES = {
  PAYER: "payer",
  PROPOSER: "proposer",
  AUTHORIZATIONS: "authorizations",
}

function debug() {
  const SPACE = " "
  const SPACE_COUNT_PER_INDENT = 4
  const DEBUG_MESSAGE = []
  return [
    function (msg, indent = 0) {
      DEBUG_MESSAGE.push(
        Array(indent * SPACE_COUNT_PER_INDENT)
          .fill(SPACE)
          .join("-") + msg
      )
    },
    function () {
      return DEBUG_MESSAGE.reduce((prev, curr) => prev + "\n" + curr)
    },
  ]
}

function recurseFlatMap(el, depthLimit = 3) {
  if (depthLimit <= 0) return el
  if (!Array.isArray(el)) return el
  return recurseFlatMap(
    el.flatMap(e => e),
    depthLimit - 1
  )
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

function addAccountToIx(ix, newAccount) {
  if (
    typeof newAccount.addr === "string" &&
    (typeof newAccount.keyId === "number" ||
      typeof newAccount.keyId === "string")
  ) {
    newAccount.tempId = idof(newAccount)
  } else {
    newAccount.tempId = newAccount.tempId || uuidv4()
  }

  const existingAccount = ix.accounts[newAccount.tempId] || newAccount

  if (!ix.accounts[newAccount.tempId]) {
    ix.accounts[newAccount.tempId] = newAccount
  }

  ix.accounts[newAccount.tempId].role.proposer =
    existingAccount.role.proposer || newAccount.role.proposer
  ix.accounts[newAccount.tempId].role.payer =
    existingAccount.role.payer || newAccount.role.payer
  ix.accounts[newAccount.tempId].role.authorizer =
    existingAccount.role.authorizer || newAccount.role.authorizer

  return ix.accounts[newAccount.tempId]
}

function uniqueAccountsFlatMap(accounts) {
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

async function recurseResolveAccount(
  ix,
  currentAccountTempId,
  depthLimit = MAX_DEPTH_LIMIT,
  {debugLogger}
) {
  if (depthLimit <= 0) {
    throw new Error(
      `recurseResolveAccount Error: Depth limit (${MAX_DEPTH_LIMIT}) reached. Ensure your authorization functions resolve to an account after ${MAX_DEPTH_LIMIT} resolves.`
    )
  }

  let account = ix.accounts[currentAccountTempId]

  if (!account) return null

  debugLogger(
    `account: ${account.tempId}`,
    Math.max(MAX_DEPTH_LIMIT - depthLimit, 0)
  )

  if (account?.resolve) {
    if (isFn(account?.resolve)) {
      debugLogger(
        `account: ${account.tempId} -- cache MISS`,
        Math.max(MAX_DEPTH_LIMIT - depthLimit, 0)
      )

      const {resolve, ...accountWithoutResolve} = account

      let resolvedAccounts = await resolve(
        accountWithoutResolve,
        buildPreSignable(accountWithoutResolve, ix)
      )

      resolvedAccounts = Array.isArray(resolvedAccounts)
        ? resolvedAccounts
        : [resolvedAccounts]

      let flatResolvedAccounts = recurseFlatMap(resolvedAccounts)

      flatResolvedAccounts = flatResolvedAccounts.map(flatResolvedAccount =>
        addAccountToIx(ix, flatResolvedAccount)
      )

      account.resolve = flatResolvedAccounts.map(
        flatResolvedAccount => flatResolvedAccount.tempId
      )

      account = addAccountToIx(ix, account)

      const recursedAccounts = await Promise.all(
        flatResolvedAccounts.map(async resolvedAccount => {
          return await recurseResolveAccount(
            ix,
            resolvedAccount.tempId,
            depthLimit - 1,
            {debugLogger}
          )
        })
      )

      return recursedAccounts
        ? recurseFlatMap(recursedAccounts)
        : account.tempId
    } else {
      debugLogger(
        `account: ${account.tempId} -- cache HIT`,
        Math.max(MAX_DEPTH_LIMIT - depthLimit, 0)
      )

      return account.resolve
    }
  }
  return account.tempId
}

async function resolveAccountType(ix, type, {debugLogger}) {
  invariant(
    ix && typeof ix === "object",
    "resolveAccountType Error: ix not defined"
  )
  invariant(
    type === ROLES.PAYER ||
      type === ROLES.PROPOSER ||
      type === ROLES.AUTHORIZATIONS,
    "resolveAccountType Error: type must be 'payer', 'proposer' or 'authorizations'"
  )

  let accountTempIDs = Array.isArray(ix[type]) ? ix[type] : [ix[type]]

  let allResolvedAccounts = []
  for (let accountId of accountTempIDs) {
    let account = ix.accounts[accountId]
    invariant(account, `resolveAccountType Error: account not found`)

    let resolvedAccountTempIds = await recurseResolveAccount(
      ix,
      accountId,
      MAX_DEPTH_LIMIT,
      {
        debugLogger,
      }
    )

    resolvedAccountTempIds = Array.isArray(resolvedAccountTempIds)
      ? resolvedAccountTempIds
      : [resolvedAccountTempIds]

    let resolvedAccounts = resolvedAccountTempIds.map(
      resolvedAccountTempId => ix.accounts[resolvedAccountTempId]
    )

    let flatResolvedAccounts = uniqueAccountsFlatMap(resolvedAccounts)

    allResolvedAccounts = allResolvedAccounts.concat(flatResolvedAccounts)
  }

  invariant(
    allResolvedAccounts.length > 0,
    "resolveAccountType Error: failed to resolve any accounts"
  )

  if (type === ROLES.PAYER) {
    allResolvedAccounts = allResolvedAccounts.filter(
      acct => acct.role.payer === true
    )
  }
  if (type === ROLES.PROPOSER) {
    allResolvedAccounts = allResolvedAccounts.filter(
      acct => acct.role.proposer === true
    )
  }
  if (type === ROLES.AUTHORIZATIONS) {
    allResolvedAccounts = allResolvedAccounts.filter(
      acct => acct.role.authorizer === true
    )
  }

  ix[type] = Array.isArray(ix[type])
    ? [...new Set(allResolvedAccounts.map(acct => acct.tempId))]
    : allResolvedAccounts[0].tempId

  // Ensure all payers are of the same account
  if (type === ROLES.PAYER) {
    let address
    for (const payerTempID of ix[ROLES.PAYER]) {
      let pAcct = ix.accounts[payerTempID]
      if (!address) address = pAcct.addr
      else if (address !== pAcct.addr) {
        throw new Error(
          "resolveAccountType Error: payers from different accounts detected"
        )
      }
    }
  }
}

export async function resolveAccounts(ix, opts = {}) {
  if (isTransaction(ix)) {
    if (!Array.isArray(ix.payer)) {
      log.deprecate({
        pkg: "FCL",
        subject:
          '"ix.payer" must be an array. Support for ix.payer as a singular',
        message: "See changelog for more info.",
      })
    }
    let [debugLogger, getDebugMessage] = debug()
    try {
      await resolveAccountType(ix, ROLES.PROPOSER, {debugLogger})
      await resolveAccountType(ix, ROLES.AUTHORIZATIONS, {debugLogger})
      await resolveAccountType(ix, ROLES.PAYER, {debugLogger})

      await removeUnusedIxAccounts(ix, {debugLogger})

      if (opts.enableDebug) {
        console.debug(getDebugMessage())
      }
    } catch (error) {
      console.error("=== SAD PANDA ===\n\n", error, "\n\n=== SAD PANDA ===")
      throw error
    }
  }
  return ix
}
