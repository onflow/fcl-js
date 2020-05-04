import {isTransaction, pipe, Ok} from "@onflow/interaction"

export const resolvePayer = pipe([
  async ix => {
    if (!isTransaction(ix)) return Ok(ix)
    while(ix.accounts[ix.payer] && ix.accounts[ix.payer].resolve) {
        ix.accounts[ix.payer] = await ix.accounts[ix.payer].resolve(ix.accounts[ix.payer])
    }
    return Ok(ix)
  }
])
