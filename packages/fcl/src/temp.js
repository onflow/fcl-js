import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {isTransaction, isScript, get} from "@onflow/interaction"
import {latestBlock} from "@onflow/sdk-latest-block"
import {sansPrefix} from "@onflow/util-address"
import {account as fetchAccount} from "@onflow/sdk-account"
import {
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "@onflow/encode"

const isString = v => typeof v === "string"
const isFn = v => typeof v === "function"

async function resolve(ix) {
  ix = await ix
  await execCadence(ix)
  await execArguments(ix)
  await execResolveAccounts(ix)
  await execFetchRef(ix)
  await execFetchSequenceNumber(ix)
  await execSignatures(ix)
  await prepForSend(ix)
  return ix
}

config().put("sdk.resolve", resolve)

async function execCadence(ix) {
  if (isTransaction(ix) || isScript(ix)) {
    var cadence = get(ix, "ix.cadence")
    invariant(
      isFn(cadence) || isString(cadence),
      "Cadence needs to be a function or a string."
    )
    if (isFn(cadence)) cadence = await cadence({})
    invariant(isString(cadence), "Cadence needs to be a string at this point.")
    ix.message.cadence = await config()
      .where(/^0x/)
      .then(d =>
        Object.entries(d).reduce(
          (cadence, [key, value]) => cadence.replace(key, value),
          cadence
        )
      )
  }

  return ix
}

async function execArguments(ix) {
  function cast(arg) {
    invariant(
      typeof arg.xform != null,
      `No type specified for argument: ${arg.value}`
    )
    if (isFn(arg.xform)) return arg.xform(arg.value)
    if (isFn(arg.xform.asArgument)) return arg.xform.asArgument(arg.value)
    invariant(false, `Invalid Argument`, arg)
  }

  if (isTransaction(ix) || isScript(ix)) {
    for (let [id, arg] of Object.entries(ix.arguments)) {
      ix.arguments[id].asArgument = cast(arg)
    }
  }

  return ix
}

const resolveAccount = async ax => {
  if (isFn(ax.resolve)) ax.resolve(ax)
  return ax
}

async function resolveAccounts(ix, accounts, last, depth = 3) {
  invariant(depth, "Account Resolve Recursion Limit Exceeded", {ix, accounts})
  for (let ax of accounts) {
    var old = last || ax
    if (isFn(ax.resolve)) ax = await ax.resolve(ax, buildPreSignable(ax, ix))

    if (Array.isArray(ax)) {
      await resolveAccounts(ix, ax, old, depth - 1)
    } else {
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

      if (ix.accounts[ax.tempId].role.payer && ix.payer === old.tempId) {
        ix.payer = ax.tempId
      }

      ix.authorizations = ix.authorizations.map(d => {
        if (ix.accounts[ax.tempId].role.authorizer && d === old.tempId) {
          return ax.tempId
        } else {
          return d
        }
      })
    }
    if (old.tempId != ax.tempId) delete ix.accounts[old.tempId]
  }
}

async function execResolveAccounts(ix) {
  if (isTransaction(ix)) {
    try {
      await resolveAccounts(ix, Object.values(ix.accounts))
      await resolveAccounts(ix, Object.values(ix.accounts))
    } catch (error) {
      console.error("=== SAD PANDA ===\n\n", error, "\n\n=== SAD PANDA ===")
      throw error
    }
  }
  return ix
}

async function execFetchRef(ix) {
  if (isTransaction(ix) && ix.message.refBlock == null) {
    ix.message.refBlock = (await latestBlock()).id
  }
  return ix
}

async function execFetchSequenceNumber(ix) {
  if (isTransaction(ix)) {
    var acct = Object.values(ix.accounts).find(a => a.role.proposer)
    invariant(acct, `Transactions require a proposer`)
    if (acct.sequenceNum == null) {
      ix.accounts[acct.tempId].sequenceNum = await fetchAccount(acct.addr)
        .then(acct => acct.keys)
        .then(keys => keys.find(key => key.index === acct.keyId))
        .then(key => key.sequenceNumber)
    }
  }
  return ix
}

async function execSignatures(ix) {
  if (isTransaction(ix)) {
    try {
      let insideSigners = findInsideSigners(ix)
      const insidePayload = encodeInsideMessage(prepForEncoding(ix))
      await Promise.all(insideSigners.map(fetchSignature(ix, insidePayload)))

      let outsideSigners = findOutsideSigners(ix)
      const outsidePayload = encodeOutsideMessage({
        ...prepForEncoding(ix),
        payloadSigs: insideSigners.map(id => ({
          address: ix.accounts[id].addr,
          keyId: ix.accounts[id].keyId,
          sig: ix.accounts[id].signature,
        })),
      })
      await Promise.all(outsideSigners.map(fetchSignature(ix, outsidePayload)))
    } catch (error) {
      console.error("Signatures", error, {ix})
      throw error
    }
  }
  return ix
}

function findInsideSigners(ix) {
  // Inside Signers Are: (authorizers + proposer) - payer
  let inside = new Set(ix.authorizations)
  inside.add(ix.proposer)
  inside.delete(ix.payer)
  return Array.from(inside)
}

function findOutsideSigners(ix) {
  // Outside Signers Are: (payer)
  let outside = new Set([ix.payer])
  return Array.from(outside)
}

function fetchSignature(ix, payload) {
  return async function innerFetchSignature(id) {
    const acct = ix.accounts[id]
    if (acct.signature != null) return
    const {signature} = await acct.signingFunction(
      buildSignable(acct, payload, ix)
    )
    ix.accounts[id].signature = signature
  }
}

function buildPreSignable(acct, ix) {
  try {
    return {
      "@type": "PreSignable",
      "@vsn": "1.0.0",
      roles: acct.role,
      cadence: ix.message.cadence,
      args: ix.message.arguments.map(d => ix.arguments[d].asArgument),
      data: {},
      interaction: ix,
    }
  } catch (error) {
    console.error("buildPreSignable", error)
    throw error
  }
}

function buildSignable(acct, message, ix) {
  try {
    return {
      "@type": "Signable",
      "@vsn": "1.0.0",
      message,
      addr: sansPrefix(acct.addr),
      keyId: acct.keyId,
      roles: acct.role,
      cadence: ix.message.cadence,
      args: ix.message.arguments.map(d => ix.arguments[d].asArgument),
      data: {},
      interaction: ix,
    }
  } catch (error) {
    console.error("buildSignable", error)
    throw error
  }
}

function prepForEncoding(ix) {
  return {
    script: ix.message.cadence,
    refBlock: ix.message.refBlock || null,
    gasLimit: ix.message.computeLimit,
    arguments: ix.message.arguments.map(id => ix.arguments[id].asArgument),
    proposalKey: {
      address: sansPrefix(ix.accounts[ix.proposer].addr),
      keyId: ix.accounts[ix.proposer].keyId,
      sequenceNum: ix.accounts[ix.proposer].sequenceNum,
    },
    payer: sansPrefix(ix.accounts[ix.payer].addr),
    authorizers: ix.authorizations
      .map(cid => sansPrefix(ix.accounts[cid].addr))
      .reduce((prev, current) => {
        return prev.find(item => item === current) ? prev : [...prev, current]
      }, []),
  }
}

async function prepForSend(ix) {
  for (let key of Object.keys(ix.accounts)) {
    ix.accounts[key].addr = sansPrefix(ix.accounts[key].addr)
  }
  return ix
}
