import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import {isTransaction} from "../interaction/interaction.js"
import {createSignableVoucher} from "./voucher.js"

const isFn = v => typeof v === "function"
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

async function collectAccounts(ix, accounts, last, depth = 3) {
  invariant(depth, "Account Resolve Recursion Limit Exceeded", {ix, accounts})

  let authorizations = []
  for (let ax of accounts) {
    let resolve = ax.resolve
    ax.resolve = null
    var old = last || ax
    if (isFn(resolve)) ax = await resolve(ax, buildPreSignable(ax, ix))

    if (Array.isArray(ax)) {
      await collectAccounts(ix, ax, old, depth - 1)
    } else {
      if (ax.addr != null && ax.keyId != null) {
        ax.tempId = `${ax.addr}-${ax.keyId}`
      }
      ix.accounts[ax.tempId] = ix.accounts[ax.tempId] || ax
      ix.accounts[ax.tempId].role.proposer =
        ix.accounts[ax.tempId].role.proposer || ax.role.proposer
      ix.accounts[ax.tempId].role.payer =
        ix.accounts[ax.tempId].role.payer || ax.role.payer
      ix.accounts[ax.tempId].role.authorizer =
        ix.accounts[ax.tempId].role.authorizer || ax.role.authorizer

      if (ix.accounts[ax.tempId].role.proposer && ix.proposer === old.tempId) {
        ix.proposer = ax.tempId
      }

      if (ix.accounts[ax.tempId].role.payer) {
        if (Array.isArray(ix.payer)) {
          ix.payer = Array.from(
            new Set(
              [...ix.payer, ax.tempId].map(d =>
                d === old.tempId ? ax.tempId : d
              )
            )
          )
        } else {
          ix.payer = Array.from(
            new Set(
              [ix.payer, ax.tempId].map(d => (d === old.tempId ? ax.tempId : d))
            )
          )
        }
        if (ix.payer.length > 1) {
          // remove payer dups based on addr and keyId
          const dupList = []
          const payerAccts = []
          ix.payer = ix.payer.reduce((g, tempId) => {
            const {addr, keyId} = ix.accounts[tempId]
            const key = `${addr}-${keyId}`
            payerAccts.push(addr)
            if (dupList.includes(key)) return g
            dupList.push(key)
            return [...g, tempId]
          }, [])
          const multiAccts = Array.from(new Set(payerAccts))
          if (multiAccts.length > 1) {
            throw new Error("Payer can not be different accounts")
          }
        }
      }

      if (ix.accounts[ax.tempId].role.authorizer) {
        if (last) {
          // do group replacement
          authorizations = Array.from(new Set([...authorizations, ax.tempId]))
        } else {
          // do 1-1 replacement
          ix.authorizations = ix.authorizations.map(d =>
            d === old.tempId ? ax.tempId : d
          )
        }
      }
    }
    if (old.tempId != ax.tempId) delete ix.accounts[old.tempId]
  }

  if (last) {
    // complete (flatmap) group replacement
    ix.authorizations = ix.authorizations
      .map(d => (d === last.tempId ? authorizations : d))
      .reduce(
        (prev, curr) =>
          Array.isArray(curr) ? [...prev, ...curr] : [...prev, curr],
        []
      )
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
      await collectAccounts(ix, Object.values(ix.accounts))
      await collectAccounts(ix, Object.values(ix.accounts))
    } catch (error) {
      console.error("=== SAD PANDA ===\n\n", error, "\n\n=== SAD PANDA ===")
      throw error
    }
  }
  return ix
}
