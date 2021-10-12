import {withPrefix} from "@onflow/util-address"
import {encodeTxIdFromVoucher} from "../encode/encode.js"

export function findInsideSigners(ix) {
  // Inside Signers Are: (authorizers + proposer) - payer
  let inside = new Set(ix.authorizations)
  inside.add(ix.proposer)
  inside.delete(ix.payer)
  return Array.from(inside)
}

export function findOutsideSigners(ix) {
  // Outside Signers Are: (payer)
  let outside = new Set([ix.payer])
  return Array.from(outside)
}

export const createSignableVoucher = ix => {
  const buildAuthorizers = () => {
    const authorizations = ix.authorizations
      .map(cid => withPrefix(ix.accounts[cid].addr))
      .reduce((prev, current) => {
        return prev.find(item => item === current) ? prev : [...prev, current]
      }, [])
    return authorizations[0] ? authorizations : []
  }

  const buildInsideSigners = () =>
    findInsideSigners(ix).map(id => ({
      address: withPrefix(ix.accounts[id].addr),
      keyId: ix.accounts[id].keyId,
      sig: ix.accounts[id].signature,
    }))

  const buildOutsideSigners = () =>
    findOutsideSigners(ix).map(id => ({
      address: withPrefix(ix.accounts[id].addr),
      keyId: ix.accounts[id].keyId,
      sig: ix.accounts[id].signature,
    }))

  return {
    cadence: ix.message.cadence,
    refBlock: ix.message.refBlock || null,
    computeLimit: ix.message.computeLimit,
    arguments: ix.message.arguments.map(id => ix.arguments[id].asArgument),
    proposalKey: {
      address: withPrefix(ix.accounts[ix.proposer].addr),
      keyId: ix.accounts[ix.proposer].keyId,
      sequenceNum: ix.accounts[ix.proposer].sequenceNum,
    },
    payer: withPrefix(ix.accounts[ix.payer].addr),
    authorizers: buildAuthorizers(),
    payloadSigs: buildInsideSigners(),
    envelopeSigs: buildOutsideSigners(),
  }
}

export const voucherToTxId = voucher => {
  return encodeTxIdFromVoucher(voucher)
}
