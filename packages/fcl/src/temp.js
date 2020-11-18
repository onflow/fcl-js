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
  // resolve cadence
  if (isTransaction(ix) || isScript(ix)) {
    var cadence = get(ix, "ix.cadence")
    invariant(
      isFn(cadence) || isString(cadence),
      "Cadence needs to be a function or a string."
    )
    if (isFn(cadence)) cadence = await cadence({})
    invariant(isString(cadence), "Cadence needs to be a string at this point.")
    // CONTRACT ADDRESS REPLACEMENT CAN GO HERE??
    ix.message.cadence = cadence
  }

  // resolve arguments
  if (isTransaction(ix) || isScript(ix)) {
    function cast(arg) {
      invariant(
        typeof arg.xform != null,
        `No type specified for argument: ${arg.value}`
      )
      if (isFn(arg.xform)) return arg.xform(arg.value)
      if (isFn(arg.xform.asArgument)) return arg.xform.asArgument(arg.value)
      invariant(false, `Invalid Argument`, arg)
    }

    for (let [id, arg] of Object.entries(ix.arguments)) {
      ix.arguments[id].asArgument = cast(arg)
    }
  }

  // First Resolution of Accounts
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

  // Pre-Authz
  // if (isTransaction(ix)) {}

  // Dedupe Again
  // if (isTransaction(ix)) {}

  // Fetch Ref
  if (isTransaction(ix) && ix.message.refBlock == null) {
    ix.message.refBlock = (await latestBlock()).id
  }

  // Fetch Sequence Number
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

  // Signatures
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
    await Promise.all(
      insideSigners.map(async (id) => {
        const acct = ix.accounts[id]
        if (acct.signature != null) return
        const {signature} = await acct.signingFunction({
          message: insidePayload,
          addr: sansPrefix(acct.addr),
          keyId: acct.keyId,
          roles: acct.role,
          interaction: ix,
        })
        ix.accounts[id].signature = signature
      })
    )

    const outsidePayload = encodeOutsideMessage({
      ...prepForEncoding(ix),
      payloadSigs: insideSigners.map((id) => ix.accounts[id].signature),
    })

    await Promise.all(
      outsideSigners.map(async (id) => {
        const acct = ix.accounts[id]
        if (acct.signature != null) return
        const {signature} = await acct.signingFunction({
          message: outsidePayload,
          addr: sansPrefix(acct.addr),
          keyId: acct.keyId,
          roles: acct.role,
          interaction: ix,
        })
        ix.accounts[id].signature = signature
      })
    )
  }

  return ix
}

config().put("sdk.resolve", resolve)

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
