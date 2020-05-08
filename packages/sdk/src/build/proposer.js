import {pipe, makeProposer} from "@onflow/interaction"

const isFn = d => typeof d === "function"

export async function proposer(ax) {
  if (isFn(ax)) {
    return makeProposer(
      {
        resolve: ax,
        role: {proposer: true},
      }
    )
  } else {
    return makeProposer(
      {
        ...ax,
        role: {proposer: true},
      }
    )
  }
}
