import {invariant} from "@onflow/util-invariant"
import {AccessAPI, Transaction, SendTransactionRequest} from "@onflow/protobuf"
import {sansPrefix} from "@onflow/util-address"
import {unary as defaultUnary} from "./unary"

const u8ToHex = (u8, context) => context.Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad, context) =>
  context.Buffer.from(hex.padStart(pad * 2, 0), "hex")
const scriptBuffer = (script, context) => context.Buffer.from(script, "utf8")
const hexBuffer = (hex, context) => context.Buffer.from(hex, "hex")
const addressBuffer = (addr, context) => paddedHexBuffer(addr, 8, context)
const argumentBuffer = (arg, context) =>
  context.Buffer.from(JSON.stringify(arg), "utf8")

export async function sendTransaction(ix, context = {}, opts = {}) {
  invariant(opts.node, `SDK Send Transaction Error: opts.node must be defined.`)
  invariant(
    context.response,
    `SDK Send Transaction Error: context.response must be defined.`
  )
  invariant(
    context.Buffer,
    `SDK Send Transaction Error: context.Buffer must be defined.`
  )

  const unary = opts.unary || defaultUnary

  ix = await ix

  const tx = new Transaction()
  tx.setScript(scriptBuffer(ix.message.cadence, context))
  tx.setGasLimit(ix.message.computeLimit)
  tx.setReferenceBlockId(
    ix.message.refBlock ? hexBuffer(ix.message.refBlock, context) : null
  )
  tx.setPayer(
    addressBuffer(
      sansPrefix(
        ix.accounts[Array.isArray(ix.payer) ? ix.payer[0] : ix.payer].addr
      ),
      context
    )
  )

  ix.message.arguments.forEach(arg =>
    tx.addArguments(argumentBuffer(ix.arguments[arg].asArgument, context))
  )
  ix.authorizations
    .map(tempId => ix.accounts[tempId].addr)
    .reduce((prev, current) => {
      return prev.find(item => item === current) ? prev : [...prev, current]
    }, [])
    .forEach(addr =>
      tx.addAuthorizers(addressBuffer(sansPrefix(addr), context))
    )

  const proposalKey = new Transaction.ProposalKey()
  proposalKey.setAddress(
    addressBuffer(sansPrefix(ix.accounts[ix.proposer].addr), context)
  )
  proposalKey.setKeyId(ix.accounts[ix.proposer].keyId)
  proposalKey.setSequenceNumber(ix.accounts[ix.proposer].sequenceNum)

  tx.setProposalKey(proposalKey)

  // Apply Non Payer Signatures to Payload Signatures
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (!acct.role.payer && acct.signature != null) {
        const sig = new Transaction.Signature()
        sig.setAddress(addressBuffer(sansPrefix(acct.addr), context))
        sig.setKeyId(acct.keyId)
        sig.setSignature(hexBuffer(acct.signature, context))

        const isSignatureExist = tx
          .getPayloadSignaturesList()
          .some(
            existingSignature =>
              existingSignature.getAddress().toString() ===
                sig.getAddress().toString() &&
              existingSignature.getKeyId() === sig.getKeyId() &&
              existingSignature.getSignature().toString() ===
                sig.getSignature().toString()
          )
        if (!isSignatureExist) {
          tx.addPayloadSignatures(sig)
        }
      }
    } catch (error) {
      console.error("Trouble applying payload signature", {acct, ix})
      throw error
    }
  }

  // Apply Payer Signatures to Envelope Signatures
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (acct.role.payer && acct.signature != null) {
        const sig = new Transaction.Signature()
        sig.setAddress(addressBuffer(sansPrefix(acct.addr), context))
        sig.setKeyId(acct.keyId)
        sig.setSignature(hexBuffer(acct.signature, context))
        tx.addEnvelopeSignatures(sig)
      }
    } catch (error) {
      console.error("Trouble applying envelope signature", {acct, ix})
      throw error
    }
  }

  const req = new SendTransactionRequest()
  req.setTransaction(tx)

  var t1 = Date.now()
  const res = await unary(opts.node, AccessAPI.SendTransaction, req, context)
  var t2 = Date.now()

  let ret = context.response()
  ret.tag = ix.tag
  ret.transactionId = u8ToHex(res.getId_asU8(), context)

  if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("FLOW::TX", {
        detail: {txId: ret.transactionId, delta: t2 - t1},
      })
    )
  }

  return ret
}
