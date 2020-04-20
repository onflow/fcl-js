import {pipe, put, Ok} from "@onflow/interaction"

export async function proposer(...args) {
  if (typeof args[0] === "function") return put("tx.proposer", await args[0]())
  if (typeof args[0] === "object") return put("tx.proposer", args[0])
  const [addr, keyId, sequenceNum] = args
  return pipe([
    ix => {
      ix.proposer = proposalKey(addr, keyId, sequenceNum)
      return Ok(ix)
    },
  ])
}

function proposalKey(addr, keyId, sequenceNum) {
  return {addr, keyId, sequenceNum}
}
