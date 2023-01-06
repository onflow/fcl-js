import {sansPrefix, withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"
import {isTransaction} from "../interaction/interaction.js"
import {createSignableVoucher} from "./voucher.js"

const idof = acct => `${withPrefix(acct.addr)}-${acct.keyId}`
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

function mergeRoles(ix, ax) {
  const tempAccountRoles = Object.assign({}, ix.accounts[ax.tempId].role)

  // remove false roles
  const axTrueRoles =  Object.keys(ax.role)
    .filter(key => ax.role[key])
    .reduce((acc, key) => {
      acc[key] = ax.role[key];
      return acc;
    }, {})

  // Override true roles from account on temp account
  return {...tempAccountRoles, ...axTrueRoles}
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
      if (ax.addr) {
        ax.addr = sansPrefix(ax.addr)
      }
      if (ax.addr != null && ax.keyId != null) {
        ax.tempId = idof(ax)
      }

      ix.accounts[ax.tempId] = ix.accounts[ax.tempId] || ax
      ix.accounts[ax.tempId].role = mergeRoles(ix, ax)

      if (ix.accounts[ax.tempId].role.proposer && ix.proposer === old.tempId) {
        ix.proposer = ax.tempId
      }

      if (ix.accounts[ax.tempId].role.payer) {

        const payer = Array.isArray(ix.payer) ? ix.payer : [ix.payer]
        ix.payer = Array.from(
          new Set(
            [...payer, ax.tempId].map(d => (d === old.tempId ? ax.tempId : d))
          )
        )

        if (ix.payer.length > 1) {
          // remove payer dups based on addr and keyId
          const dupList = []
          const payerAccts = []
          ix.payer = ix.payer.reduce((g, tempId) => {
            const {addr} = ix.accounts[tempId]
            const key = idof(ix.accounts[tempId])
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
