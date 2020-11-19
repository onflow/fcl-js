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

const isString = (v) => typeof v === "string"
const isFn = (v) => typeof v === "function"

async function resolve(ix) {
  ix = await ix
  await execCadence(ix)
  await execArguments(ix)
  await execResolveAccounts(ix)

  // Pre-Authz
  // if (isTransaction(ix)) {}

  await execFetchRef(ix)
  await execFetchSequenceNumber(ix)
  await execSignatures(ix)
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
      .then((d) =>
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

async function execResolveAccounts(ix) {
  if (isTransaction(ix)) {
    // Dedupe and collect roles
    var axs = {}
    for (let [id, acct] of Object.entries(ix.accounts)) {
      var _id = id
      if (isFn(acct.resolve)) {
        acct = await acct.resolve(acct)
        id = acct.tempId
      }

      // deep upsert account and merge roles
      axs[id] = axs[id] || acct
      axs[id].role.proposer = axs[id].role.proposer || acct.role.proposer
      axs[id].role.payer = axs[id].role.payer || acct.role.payer
      axs[id].role.authorizer = axs[id].role.authorizer || acct.role.authorizer

      // Replace older temp Ids to be new ones
      if (ix.proposer === _id) ix.proposer = id
      if (ix.payer === _id) ix.payer = id
      ix.authorizations = ix.authorizations.map((d) => (d === _id ? id : d))
    }
    ix.accounts = axs
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
    var acct = Object.values(ix.accounts).find((a) => a.role.proposer)
    invariant(acct, `Transactions require a proposer`)
    if (acct.sequenceNum === null) {
      ix.accounts[acct.tempId].sequenceNum = await fetchAccount(acct.addr)
        .then((acct) => acct.keys)
        .then((keys) => keys.find((key) => key.index === acct.keyId))
        .then((key) => key.sequenceNumber)
    }
  }
  return ix
}

async function execSignatures(ix) {
  if (isTransaction(ix)) {
    // Inside Signers Are: (authorizers + proposer) - payer
    let insideSigners = new Set(ix.authorizations)
    insideSigners.add(ix.proposer)
    insideSigners.delete(ix.payer)
    insideSigners = Array.from(insideSigners)

    // Outside Signers Are: (payer)
    let outsideSigners = new Set([ix.payer])
    outsideSigners = Array.from(outsideSigners)

    const insidePayload = encodeInsideMessage(prepForEncoding(ix))
    await Promise.all(insideSigners.map(fetchSignature(ix, insidePayload)))

    const outsidePayload = encodeOutsideMessage({
      ...prepForEncoding(ix),
      payloadSigs: insideSigners.map((id) => ix.accounts[id].signature),
    })
    await Promise.all(outsideSigners.map(fetchSignature(ix, outsidePayload)))
  }
  return ix
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
  console.log("BUILD PRE SIGNABLE", {acct, message, ix})
  return {
    "@type": "PreSignable",
    "@vsn": "1.0.0",
    roles: acct.role,
    cadence: ix.message.cadence,
    args: ix.message.arguments.map((d) => ix.arguments[d].asArgument),
    data: {},
    interaction: ix,
  }
}

function buildSignable(acct, message, ix) {
  console.log("BUILD SIGNABLE", {acct, message, ix})
  return {
    "@type": "Signable",
    "@vsn": "1.0.0",
    message,
    addr: sansPrefix(acct.addr),
    keyId: acct.keyId,
    roles: acct.role,
    cadence: ix.message.cadence,
    args: ix.message.arguments.map((d) => ix.arguments[d].asArgument),
    data: {},
    interaction: ix,
  }
}

function prepForEncoding(ix) {
  return {
    script: ix.message.cadence,
    refBlock: ix.message.refBlock || null,
    gasLimit: ix.message.computeLimit,
    arguments: ix.message.arguments.map((id) => ix.arguments[id].asArgument),
    proposalKey: {
      address: sansPrefix(ix.accounts[ix.proposer].addr),
      keyId: ix.accounts[ix.proposer].keyId,
      sequenceNum: ix.accounts[ix.proposer].sequenceNum,
    },
    payer: sansPrefix(ix.accounts[ix.payer].addr),
    authorizers: ix.authorizations
      .map((cid) => sansPrefix(ix.accounts[cid].addr))
      .reduce((prev, current) => {
        return prev.find((item) => item === current) ? prev : [...prev, current]
      }, []),
  }
}
