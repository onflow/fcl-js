import {IAcct, IIx, isTransaction} from "../interaction/interaction"
import {sansPrefix} from "@onflow/util-address"
import {
  ITx,
  ITxProposalKey,
  encodeTransactionPayload as encodeInsideMessage,
  encodeTransactionEnvelope as encodeOutsideMessage,
} from "../encode/encode"
import {
  createSignableVoucher,
  findInsideSigners,
  findOutsideSigners,
} from "./voucher"

export async function resolveSignatures(ix: IIx) {
  if (isTransaction(ix)) {
    try {
      let insideSigners = findInsideSigners(ix)
      const insidePayload = encodeInsideMessage(prepForEncoding(ix))
      await Promise.all(insideSigners.map(fetchSignature(ix, insidePayload)))

      let outsideSigners = findOutsideSigners(ix)
      const outsidePayload = encodeOutsideMessage({
        ...prepForEncoding(ix),
        payloadSigs: insideSigners.map(id => ({
          address: ix.accounts[id].addr || '',
          keyId: ix.accounts[id].keyId || 0,
          sig: ix.accounts[id].signature || '',
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

function fetchSignature(ix: IIx, payload: string) {
  return async function innerFetchSignature(id: string) {
    const acct = ix.accounts[id]
    if (acct.signature != null) return
    const {signature} = await acct.signingFunction(
      buildSignable(acct, payload, ix)
    )
    ix.accounts[id].signature = signature
  }
}

export function buildSignable(acct: IAcct, message: string, ix: IIx) {
  try {
    return {
      f_type: "Signable",
      f_vsn: "1.0.1",
      message,
      addr: sansPrefix(acct.addr),
      keyId: acct.keyId,
      roles: acct.role,
      cadence: ix.message.cadence,
      args: ix.message.arguments.map(d => ix.arguments[d].asArgument),
      data: {},
      interaction: ix,
      voucher: createSignableVoucher(ix),
    }
  } catch (error) {
    console.error("buildSignable", error)
    throw error
  }
}

function prepForEncoding(ix: IIx): ITx {
  const payerAddress = sansPrefix(
    (Array.isArray(ix.payer) ? ix.accounts[ix.payer[0]] : ix.accounts[ix.payer])
      .addr || ""
  )
  
  const proposalKey: ITxProposalKey = ix.proposer ? {
    address: sansPrefix(ix.accounts[ix.proposer].addr) || '',
    keyId: ix.accounts[ix.proposer].keyId || 0,
    sequenceNum: ix.accounts[ix.proposer].sequenceNum || 0,
  } : {}

  return {
    cadence: ix.message.cadence,
    refBlock: ix.message.refBlock,
    computeLimit: ix.message.computeLimit,
    arguments: ix.message.arguments.map(id => ix.arguments[id].asArgument),
    proposalKey,
    payer: payerAddress,
    authorizers: ix.authorizations
      .map(cid => sansPrefix(ix.accounts[cid].addr) || '')
      .reduce((prev: string[], current) => {
        return prev.find(item => item === current) ? prev : [...prev, current]
      }, []),
  }
}
