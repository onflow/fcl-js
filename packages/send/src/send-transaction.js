import {
  ObserveService,
  AccountSignature,
  Transaction as TransactionMessage,
  SendTransactionRequest,
} from "@onflow/protobuf"
import {response} from "@onflow/response"
import {bufferToHexString} from "@onflow/bytes"
import {unary} from "./unary"

export async function sendTransaction(ix, opts = {}) {
  const accountSignatures = ix.signatures.map(signature => {
    const accountSig = new AccountSignature()
    accountSig.setAccount(signature.acct)
    accountSig.setSignature(signature.signature)
    return accountSig
  })

  const transactionMsg = new TransactionMessage()
  transactionMsg.setScript(ix.code)
  transactionMsg.setNonce(ix.nonce)
  transactionMsg.setComputeLimit(ix.computeLimit)
  transactionMsg.setPayeraccount(ix.payerAuthorization.acct)
  accountSignatures.forEach(accountSignature =>
    transactionMsg.addSignatures(accountSignature)
  )

  const req = new SendTransactionRequest()
  req.setTransaction(transactionMsg)

  const res = await unary(opts.node, ObserveService.SendTransaction, req)

  let ret = response()
  ret.tag = ix.tag
  ret.transactionHash = bufferToHexString(res.getHash_asU8())

  return ret
}
