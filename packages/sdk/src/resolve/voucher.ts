import {withPrefix} from "@onflow/util-address"
import {Voucher, encodeTxIdFromVoucher} from "../encode/encode"
import {Interaction} from "@onflow/typedefs"

export function findInsideSigners(ix: Interaction) {
  // Inside Signers Are: (authorizers + proposer) - payer
  let inside = new Set(ix.authorizations)
  if (ix.proposer) {
    inside.add(ix.proposer)
  }
  if (Array.isArray(ix.payer)) {
    ix.payer.forEach(p => inside.delete(p))
  } else {
    inside.delete(ix.payer)
  }
  return Array.from(inside)
}

export function findOutsideSigners(ix: Interaction) {
  // Outside Signers Are: (payer)
  let outside = new Set(Array.isArray(ix.payer) ? ix.payer : [ix.payer])
  return Array.from(outside)
}

export const createSignableVoucher = (ix: Interaction) => {
  const buildAuthorizers = () => {
    const authorizations = ix.authorizations
      .map(cid => withPrefix(ix.accounts[cid].addr))
      .reduce((prev: (string | null)[], current) => {
        return prev.find(item => item === current) ? prev : [...prev, current]
      }, [])
    return authorizations
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

  const proposalKey = ix.proposer
    ? {
        address: withPrefix(ix.accounts[ix.proposer].addr),
        keyId: ix.accounts[ix.proposer].keyId,
        sequenceNum: ix.accounts[ix.proposer].sequenceNum,
      }
    : {}

  return {
    cadence: ix.message.cadence,
    refBlock: ix.message.refBlock || null,
    computeLimit: ix.message.computeLimit,
    arguments: ix.message.arguments.map(id => ix.arguments[id].asArgument),
    proposalKey,
    payer: withPrefix(
      ix.accounts[Array.isArray(ix.payer) ? ix.payer[0] : ix.payer].addr
    ),
    authorizers: buildAuthorizers(),
    payloadSigs: buildInsideSigners(),
    envelopeSigs: buildOutsideSigners(),
  }
}

export const voucherToTxId = (voucher: Voucher) => {
  return encodeTxIdFromVoucher(voucher)
}
