import {AccessAPI, GetTransactionRequest} from "@onflow/protobuf"
import {response} from "../response/response.js"
import {unary} from "./unary"

const u8ToHex = u8 => Buffer.from(u8).toString("hex")
const hexBuffer = hex => Buffer.from(hex, "hex")

export async function sendGetTransaction(ix, opts = {}) {
  ix = await ix

  const req = new GetTransactionRequest()
  req.setId(hexBuffer(ix.transaction.id))

  const res = await unary(opts.node, AccessAPI.GetTransaction, req)

  let events = res.getEventsList()

  let ret = response()
  ret.tag = ix.tag

  const unwrapKey = key => ({
    address: u8ToHex(key.getAddress_asU8()),
    keyId: key.getKeyId(),
    sequenceNumber: key.getSequenceNumber()
  })

  const unwrapSignature = sig => ({
    address: u8ToHex(key.getAddress_asU8()),
    keyId: key.getKeyId(),
    signature: u8ToHex(key.getSequenceNumber_asU8())
  })

  let transaction = ret.getTransaction()
  ret.transaction = {
      script: u8ToHex(transaction.getScript_asU8()),
      arguments: (transaction.getArgumentsList()).map(u8ToHex),
      referenceBlockId: u8ToHex(transaction.getReferenceBlockId_asU8()),
      gasLimit: transaction.getGasLimit(),
      proposalKey: unwrapKey(transaction.getProposalKey()),
      payer: u8ToHex(transaction.getPayer_asU8()),
      authorizers: (transaction.getAuthorizersList()).map(u8ToHex),
      payloadSignatures: (transaction.getPayloadSignaturesList()).map(unwrapSignature),
      envelopeSignatures: (transaction.getEnvelopeSignaturesList()).map(unwrapSignature)
  }

//   ret.transaction = {
//     status: res.getStatus(),
//     statusCode: res.getStatusCode(),
//     errorMessage: res.getErrorMessage(),
//     events: events.map(event => ({
//       type: event.getType(),
//       transactionId: u8ToHex(event.getTransactionId_asU8()),
//       transactionIndex: event.getTransactionIndex(),
//       eventIndex: event.getEventIndex(),
//       payload: JSON.parse(Buffer.from(event.getPayload_asU8()).toString("utf8")),
//     })),
//   }

  return ret
}

// enum TransactionStatus {
//     UNKNOWN = 0;
//     PENDING = 1;
//     FINALIZED = 2;
//     EXECUTED = 3;
//     SEALED = 4;
//     EXPIRED = 5;
//   }
  
//   message Transaction {
//     message ProposalKey {
//       bytes address = 1;
//       uint32 key_id = 2;
//       uint64 sequence_number = 3;
//     }
    
//     message Signature {
//       bytes address = 1;
//       uint32 key_id = 2;
//       bytes signature = 3;
//     }
  
//     bytes script = 1;
//     repeated bytes arguments = 2;
//     bytes reference_block_id = 3;
//     uint64 gas_limit = 4;
//     ProposalKey proposal_key = 5;
//     bytes payer = 6;
//     repeated bytes authorizers = 7;
//     repeated Signature payload_signatures = 8;
//     repeated Signature envelope_signatures = 9;
//   }
