import {pipe, makeProposer} from "@onflow/interaction"

const isFn = d => typeof d === "function"

export async function proposer(...args) {
  if (isFn(args[0])) {
    return makeProposer(
      {
        resolve: args[0],
        role: {proposer: true},
      }
    )
  } else {
    const [addr, keyId, sequenceNum, signingFunction] = args
    return makeProposer(
      {
        addr,
        keyId,
        sequenceNum,
        signingFunction,
        role: {proposer: true},
      }
    )
  }
}
