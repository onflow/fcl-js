import {interaction} from "./interaction"
import {
  UNKNOWN,
  SCRIPT,
  TRANSACTION,
  GET_TRANSACTION,
  GET_ACCOUNT,
  GET_EVENTS,
  GET_LATEST_BLOCK,
  PING,
} from "./interaction"
import {
  makeUnknown,
  makeScript,
  makeTransaction,
  makeGetTransaction,
  makeGetAccount,
  makeGetEvents,
  makeGetLatestBlock,
  makePing,
} from "./interaction"
import {
  isUnknown,
  isScript,
  isTransaction,
  isGetTransaction,
  isGetAccount,
  isGetEvents,
  isGetLatestBlock,
  isPing,
} from "./interaction"

const TAGS = [
  UNKNOWN,
  SCRIPT,
  TRANSACTION,
  GET_TRANSACTION,
  GET_ACCOUNT,
  GET_EVENTS,
  GET_LATEST_BLOCK,
  PING,
]

describe("TAGS", () => {
  test("unique", () => {
    const tags = new Set(TAGS)
    expect(tags.size).toBe(TAGS.length)
  })

  test("unique bloom match", () => {
    expect(TAGS.reduce((a, b) => a & b)).toBe(0b0)
  })
})

const PARINGS = [
  [UNKNOWN, makeUnknown, isUnknown],
  [SCRIPT, makeScript, isScript],
  [TRANSACTION, makeTransaction, isTransaction],
  [GET_TRANSACTION, makeGetTransaction, isGetTransaction],
  [GET_ACCOUNT, makeGetAccount, isGetAccount],
  [GET_EVENTS, makeGetEvents, isGetEvents],
  [GET_LATEST_BLOCK, makeGetLatestBlock, isGetLatestBlock],
  [PING, makePing, isPing],
]

for (let [tag, make, is] of PARINGS) {
  describe(`0b${tag.toString(2)}`, () => {
    const ix = make(interaction())
    test("is", () => expect(is(ix)).toBeTruthy())
  })
}
