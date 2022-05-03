import {invariant} from "@onflow/util-invariant"
import {isGetAccount, isGetBlock} from "../interaction/interaction"

export function mockAccountResponse(ix, numberOfKeys = 5) {
  // prettier-ignore
  invariant(ix.account, "mockAccountResponse(ix) -- ix.account is missing", ix)
  // prettier-ignore
  invariant( ix.account.addr, "mockAccountResponse(ix) -- ix.account.addr is missing", ix)

  const address = ix.account.addr

  return {
    account: {
      addr: address,
      keys: Array.from({length: numberOfKeys}, (_, i) => ({
        index: i,
        sequenceNumber: 42,
      })),
    },
  }
}

export function mockGetBlockResponse(ix) {
  return {
    tag: "GET_BLOCK",
    block: {
      id: "32",
    },
  }
}

const identity = v => v

export function mockSend(fallback = identity) {
  return async function execSend(ix) {
    ix = await ix
    switch (true) {
      case isGetAccount(ix):
        return mockAccountResponse(ix)

      case isGetBlock(ix):
        return mockGetBlockResponse(ix)

      default:
        return fallback(ix)
    }
  }
}
