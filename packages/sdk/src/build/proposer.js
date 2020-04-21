import {pipe, put, Ok} from "@onflow/interaction"

export async function proposer(...args) {
  let prop = null
  if (typeof args[0] === "function") prop = await args[0]()
  if (typeof args[0] === "object") prop = args[0]
  const [addr, keyId, sequenceNum] = args
  return pipe([
    ix => {
      ix.proposer = prop || proposalKey(addr, keyId, sequenceNum)
      return Ok(ix)
    },
  ])
}

function proposalKey(addr, keyId, sequenceNum) {
  return {addr, keyId, sequenceNum}
}
