import {AccessAPI, Transaction, SendTransactionRequest} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {sansPrefix} from "@onflow/util-address"
import {unary as defaultUnary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const paddedHexBuffer = (hex, pad) =>
  Buffer.from(hex.padStart(pad * 2, 0), "hex")
const scriptBuffer = script => Buffer.from(script, "utf8")
const hexBuffer = hex => Buffer.from(hex, "hex")
const addressBuffer = addr => paddedHexBuffer(addr, 8)
const argumentBuffer = arg => Buffer.from(JSON.stringify(arg), "utf8")

export async function sendTransaction(ix, opts = {}) {
  const unary = opts.unary || defaultUnary

  ix = await ix

  const tx = new Transaction()
  tx.setScript(scriptBuffer(ix.message.cadence))
  tx.setGasLimit(ix.message.computeLimit)
  tx.setReferenceBlockId(
    ix.message.refBlock ? hexBuffer(ix.message.refBlock) : null
  )
  tx.setPayer(addressBuffer(sansPrefix(ix.accounts[ix.payer].addr)))
  ix.message.arguments.forEach(arg =>
    tx.addArguments(argumentBuffer(ix.arguments[arg].asArgument))
  )
  ix.authorizations
    .map(tempId => ix.accounts[tempId].addr)
    .reduce((prev, current) => {
      return prev.find(item => item === current) ? prev : [...prev, current]
    }, [])
    .forEach(addr => tx.addAuthorizers(addressBuffer(sansPrefix(addr))))

  const proposalKey = new Transaction.ProposalKey()
  proposalKey.setAddress(
    addressBuffer(sansPrefix(ix.accounts[ix.proposer].addr))
  )
  proposalKey.setKeyId(ix.accounts[ix.proposer].keyId)
  proposalKey.setSequenceNumber(ix.accounts[ix.proposer].sequenceNum)

  tx.setProposalKey(proposalKey)

  // Apply Non Payer Signatures to Payload Signatures
  for (let acct of Object.values(ix.accounts)) {
    try {
      if (!acct.role.payer && acct.signature != null) {
        const sig = new Transaction.Signature()
        sig.setAddress(addressBuffer(sansPrefix(acct.addr)))
        sig.setKeyId(acct.keyId)
        sig.setSignature(hexBuffer(acct.signature))
        tx.addPayloadSignatures(sig)
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
        sig.setAddress(addressBuffer(sansPrefix(acct.addr)))
        sig.setKeyId(acct.keyId)
        sig.setSignature(hexBuffer(acct.signature))
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
  const res = await unary(opts.node, AccessAPI.SendTransaction, req)
  var t2 = Date.now()

  let ret = response()
  ret.tag = ix.tag
  ret.transactionId = u8ToHex(res.getId_asU8())

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("FLOW::TX", {
        detail: {txId: ret.transactionId, delta: t2 - t1},
      })
    )
  }

  return ret
}
