import {pipe, makeProposer} from "@onflow/interaction"

export async function proposer(...args) {
  const [addr, keyId, sequenceNum] = args
  return pipe([
    makeProposer(
      {
        addr,
        keyId,
        sequenceNum,
        role: {proposer: true},
      }
    ),
  ])
}
