import {isTransaction, pipe, Ok} from "@onflow/interaction"

export const resolveProposer = pipe([
  async ix => {
    if (!isTransaction(ix)) return Ok(ix)
    while(ix.accounts[ix.proposer] && ix.accounts[ix.proposer].resolve) {
        ix.accounts[ix.proposer] = await ix.accounts[ix.proposer].resolve(ix.accounts[ix.proposer])
    }
    return Ok(ix)
  }
])
