import {isTransaction, pipe, Ok} from "@onflow/interaction"

export const resolveAuthorizations = pipe([
  async ix => {
    if (!isTransaction(ix)) return Ok(ix)
    let tempId
    for (tempId in ix.authorizations) {
      while(ix.accounts[tempId] && ix.accounts[tempId].resolve) {
        ix.accounts[tempId] = await ix.accounts[tempId].resolve(ix.accounts[tempId])
      }
    }
    return Ok(ix)
  }
])
