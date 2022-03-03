import {invariant} from "@onflow/util-invariant"
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
  let payers = []
  for (let ax of accounts) {
    var old = last || ax
    if (isFn(ax.resolve)) ax = await ax.resolve(ax, buildPreSignable(ax, ix))

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
          ix.payer = Array.from(new Set([...ix.payer, ax.tempId]))
        } else if (ix.payer === old.tempId) {
          ix.payer = ax.tempId
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

    // complete (flatmap) group replacement
    // treat payer like authorizations, there can be multiple keys
    ix.payer = Array.isArray(ix.payer) ? ix.payer
    .map(d => (d === last.tempId ? payers : d))
    .reduce(
      (prev, curr) =>
        Array.isArray(curr) ? [...prev, ...curr] : [...prev, curr],
      []    
    ) : [ix.payer]
  }
}

export async function resolveAccounts(ix) {
  if (isTransaction(ix)) {
    if (!Array.isArray(ix.payer)) {
      console.warn(
        `
        %cFCL Warning
        ============================
        "ix.payer" must be an array. Support for ix.payer as a singular is deprecated,
        see changelog for more info: https://docs.onflow.org/fcl/
        ============================
        `,
        "font-weight:bold;font-family:monospace;"
      )
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
