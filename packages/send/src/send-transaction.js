import {
  ObserveService,
  AccountSignature,
  Transaction as TransactionMessage,
  SendTransactionRequest,
} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {
  bufferToHexString,
  scriptToBuffer,
  hashToBuffer,
  addressToBuffer,
  bytes,
} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendTransaction(ix, opts = {}) {
  const accountSignatures = ix.authz.map(sig => {
    const accountSig = new AccountSignature()
    accountSig.setAccount(addressToBuffer(bytes(sig.acct, 20)))
    accountSig.setSignature(sig.signature)
    return accountSig
  })

  const payerSig = new AccountSignature()
  payerSig.setAccount(addressToBuffer(bytes(ix.payer.acct, 20)))
  payerSig.setSignature(ix.payer.signature)
  const payerSignature = payerSig

  const transactionMsg = new TransactionMessage()
  transactionMsg.setScript(scriptToBuffer(ix.payload.code))
  transactionMsg.setNonce(ix.payload.nonce)
  transactionMsg.setComputeLimit(ix.payload.limit)
  transactionMsg.setReferenceBlockHash(
    ix.payload.ref ? hashToBuffer(ix.payload.ref) : null
  )
  transactionMsg.setPayeraccount(addressToBuffer(bytes(ix.payer.acct, 20)))
  ix.authz.forEach(a =>
    transactionMsg.addScriptaccounts(addressToBuffer(bytes(a.acct, 20)))
  )
  accountSignatures.forEach(accountSignature =>
    transactionMsg.addSignatures(accountSignature)
  )
  accountSignatures.push(payerSignature)

  const req = new SendTransactionRequest()
  req.setTransaction(transactionMsg)

  const res = await unary(opts.node, ObserveService.SendTransaction, req)

  let ret = response()
  ret.tag = ix.tag
  ret.transactionId = bufferToHexString(res.getHash_asU8())

  return ret
}
