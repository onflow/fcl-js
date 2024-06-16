import {withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import {isTransaction} from "../interaction/interaction"
import {Interaction, InteractionAccount} from "@onflow/typedefs"
import {createSignableVoucher} from "./voucher"
import {v4 as uuidv4} from "uuid"

const MAX_DEPTH_LIMIT = 5

const idof = (acct: InteractionAccount) =>
  `${withPrefix(acct.addr)}-${acct.keyId}`
const isFn = (v: any): v is Function =>
  v &&
  (Object.prototype.toString.call(v) === "[object Function]" ||
    "function" === typeof v ||
    v instanceof Function)

const genAccountId = (...ids: (string | boolean | undefined)[]) => ids.join("-")

enum ROLES {
  PAYER = "payer",
  PROPOSER = "proposer",
  AUTHORIZATIONS = "authorizations",
}

function debug() {
  const SPACE = " "
  const SPACE_COUNT_PER_INDENT = 4
  const DEBUG_MESSAGE: string[] = []
  return [
    function (msg = "", indent = 0) {
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

function recurseFlatMap<T>(el: T, depthLimit = 3) {
  if (depthLimit <= 0) return el
  if (!Array.isArray(el)) return el
  return recurseFlatMap(
    el.flatMap(e => e),
    depthLimit - 1
  )
}

export function buildPreSignable(
  acct: Partial<InteractionAccount>,
  ix: Interaction
) {
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

async function removeUnusedIxAccounts(
  ix: Interaction,
  opts: Record<string, any>
) {
  const payerTempIds = Array.isArray(ix.payer) ? ix.payer : [ix.payer]
  const authorizersTempIds = Array.isArray(ix.authorizations)
    ? ix.authorizations
    : [ix.authorizations]
  const proposerTempIds =
    ix.proposer === null
      ? []
      : Array.isArray(ix.proposer)
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

function addAccountToIx(ix: Interaction, newAccount: InteractionAccount) {
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

function uniqueAccountsFlatMap(accounts: InteractionAccount[]) {
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
    .filter(e => e !== null) as InteractionAccount[]

  return uniqueAccountsFlatMapped
}

// Resolve single account, returns new account tempIds (if they exist)
async function resolveSingleAccount(
  ix: Interaction,
  currentAccountTempId: string,
  depthLimit = MAX_DEPTH_LIMIT,
  {debugLogger}: {debugLogger: (msg?: string, indent?: number) => void}
): Promise<string[]> {
  if (depthLimit <= 0) {
    throw new Error(
      `recurseResolveAccount Error: Depth limit (${MAX_DEPTH_LIMIT}) reached. Ensure your authorization functions resolve to an account after ${MAX_DEPTH_LIMIT} resolves.`
    )
  }

  let account = ix.accounts[currentAccountTempId]

  if (!account) return []

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

      flatResolvedAccounts = flatResolvedAccounts.map(
        (flatResolvedAccount: InteractionAccount) =>
          addAccountToIx(ix, flatResolvedAccount)
      )

      account.resolve = flatResolvedAccounts.map(
        (flatResolvedAccount: InteractionAccount) => flatResolvedAccount.tempId
      )

      account = addAccountToIx(ix, account)

      return flatResolvedAccounts.map(
        (flatResolvedAccount: InteractionAccount) => flatResolvedAccount.tempId
      )
    } else {
      debugLogger(
        `account: ${account.tempId} -- cache HIT`,
        Math.max(MAX_DEPTH_LIMIT - depthLimit, 0)
      )

      return account.resolve
    }
  }
  return []
}

const getAccountTempIDs = (rawTempIds: string | string[] | null) => {
  if (rawTempIds === null) {
    return []
  }
  return Array.isArray(rawTempIds) ? rawTempIds : [rawTempIds]
}

async function replaceRoles(
  ix: Interaction,
  oldAccountTempId: string,
  newAccounts: InteractionAccount[]
) {
  // Replace roles in the interaction with any resolved accounts
  // e.g. payer -> [oldAccountTempId, anotherId] => payer -> [newAccountTempId, anotherId]
  for (let role of Object.values(ROLES)) {
    if (Array.isArray(ix[role])) {
      ix[role] = (ix[role] as string[]).reduce((acc, acctTempId) => {
        if (acctTempId === oldAccountTempId) {
          return acc.concat(
            ...newAccounts
              .filter(x => {
                return (
                  (role === ROLES.PAYER && x.role.payer) ||
                  (role === ROLES.AUTHORIZATIONS && x.role.authorizer)
                )
              })
              .map(acct => acct.tempId)
          )
        }
        return acc.concat(acctTempId)
      }, [] as string[]) as any
    } else if (ix[role] === oldAccountTempId && ix[role] != null) {
      if (newAccounts.length > 1) {
        console.warn(
          `replaceRoles Warning: Multiple accounts resolved for role ${role}. Only the first account will be used.`
        )
      }
      ix[role] = newAccounts[0].tempId as any
    }
  }
}

async function resolveAccountsByIds(
  ix: Interaction,
  accountTempIds: Set<string>,
  depthLimit = MAX_DEPTH_LIMIT,
  {debugLogger}: {debugLogger: (msg?: string, indent?: number) => void}
) {
  invariant(
    ix && typeof ix === "object",
    "resolveAccountType Error: ix not defined"
  )

  let newTempIds = new Set<string>()
  for (let accountId of accountTempIds) {
    let account = ix.accounts[accountId]
    invariant(Boolean(account), `resolveAccountType Error: account not found`)

    const resolvedAccountTempIds = await resolveSingleAccount(
      ix,
      accountId,
      depthLimit,
      {
        debugLogger,
      }
    )

    const resolvedAccounts: InteractionAccount[] = resolvedAccountTempIds.map(
      (resolvedAccountTempId: string) => ix.accounts[resolvedAccountTempId]
    )

    const flatResolvedAccounts = uniqueAccountsFlatMap(resolvedAccounts)

    // Add new tempIds to the set so they can be used next iteration
    flatResolvedAccounts.forEach(x => newTempIds.add(x.tempId))

    // Update any roles in the interaction based on the new accounts
    replaceRoles(ix, accountId, flatResolvedAccounts)
  }

  // Ensure all payers are of the same account
  let payerAddress
  for (const payerTempID of ix[ROLES.PAYER]) {
    let pAcct = ix.accounts[payerTempID]
    if (!payerAddress) payerAddress = pAcct.addr
    else if (payerAddress !== pAcct.addr) {
      throw new Error(
        "resolveAccountType Error: payers from different accounts detected"
      )
    }
  }

  return newTempIds
}

export async function resolveAccounts(
  ix: Interaction,
  opts: Record<string, any> = {}
) {
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
      let depthLimit = MAX_DEPTH_LIMIT
      let accountTempIds = new Set([
        ...getAccountTempIDs(ix[ROLES.PAYER]),
        ...getAccountTempIDs(ix[ROLES.PROPOSER]),
        ...getAccountTempIDs(ix[ROLES.AUTHORIZATIONS]),
      ])

      while (accountTempIds.size > 0) {
        if (depthLimit <= 0) {
          throw new Error(
            `resolveAccounts Error: Depth limit (${MAX_DEPTH_LIMIT}) reached. Ensure your authorization functions resolve to an account after ${MAX_DEPTH_LIMIT} resolves.`
          )
        }

        accountTempIds = await resolveAccountsByIds(
          ix,
          accountTempIds,
          depthLimit,
          {
            debugLogger,
          }
        )
        depthLimit--
      }

      await removeUnusedIxAccounts(ix, {debugLogger})

      // Ensure at least one account for each role is resolved (except for authorizations)
      for (const role of Object.values(ROLES)) {
        invariant(
          getAccountTempIDs(ix[role]).length > 0 ||
            role === ROLES.AUTHORIZATIONS,
          `resolveAccountType Error: no accounts for role "${role}" found`
        )
      }

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
