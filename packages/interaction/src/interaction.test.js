import {
  interaction,
  isInteraction,
  isOk,
  isBad,
  Bad,
  Ok,
  pipe,
  put,
  get,
  update,
} from "./interaction"
import {
  UNKNOWN,
  SCRIPT,
  TRANSACTION,
  GET_TRANSACTION_STATUS,
  GET_ACCOUNT,
  GET_EVENTS,
  GET_LATEST_BLOCK,
  GET_BLOCK_BY_ID,
  GET_BLOCK_BY_HEIGHT,
  PING,
} from "./interaction"
import {
  makeUnknown,
  makeScript,
  makeTransaction,
  makeGetTransactionStatus,
  makeGetAccount,
  makeGetEvents,
  makeGetLatestBlock,
  makeGetBlockByHeight,
  makeGetBlockById,
  makePing,
} from "./interaction"
import {
  isUnknown,
  isScript,
  isTransaction,
  isGetTransactionStatus,
  isGetAccount,
  isGetEvents,
  isGetLatestBlock,
  isGetBlockByHeight,
  isGetBlockById,
  isPing,
} from "./interaction"

const TAGS = [
  UNKNOWN,
  SCRIPT,
  TRANSACTION,
  GET_TRANSACTION_STATUS,
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

  const PARINGS = [
    [UNKNOWN, makeUnknown, isUnknown],
    [SCRIPT, makeScript, isScript],
    [TRANSACTION, makeTransaction, isTransaction],
    [GET_TRANSACTION_STATUS, makeGetTransactionStatus, isGetTransactionStatus],
    [GET_ACCOUNT, makeGetAccount, isGetAccount],
    [GET_EVENTS, makeGetEvents, isGetEvents],
    [GET_LATEST_BLOCK, makeGetLatestBlock, isGetLatestBlock],
    [GET_BLOCK_BY_HEIGHT, makeGetBlockByHeight, isGetBlockByHeight],
    [GET_BLOCK_BY_ID, makeGetBlockById, isGetBlockById],
    [PING, makePing, isPing],
  ]

  for (let [tag, make, is] of PARINGS) {
    describe(`0b${tag.toString(2)}`, () => {
      const ix = make(interaction())
      test("is", () => expect(is(ix)).toBeTruthy())
    })
  }
})

describe("Ok vs Bad", () => {
  describe("default interaction", () => {
    describe("isInteraction", () => {
      const good = [["fresh", interaction()]]

      const bad = [
        ["string", "foo"],
        ["object", {}],
        ["null", null],
        ["array", []],
        ["NaN", NaN],
        ["Number", 7],
      ]

      for (let [d, v] of good) it(d, () => expect(isInteraction(v)).toBe(true))
      for (let [d, v] of bad) it(d, () => expect(isInteraction(v)).toBe(false))
    })

    it("isOk", () => {
      expect(isOk(interaction())).toBe(true)
      expect(isBad(interaction())).toBe(false)
    })

    it("can be made a bad", () => {
      const ix = Bad(interaction(), "the reason")
      expect(isOk(ix)).toBe(false)
      expect(isBad(ix)).toBe(true)
    })
  })

  describe("pipe", () => {
    const ix = interaction()

    const explode = ix => {
      throw new Error("BOOM!")
    }
    const none = reason => ix => Bad(ix, reason)
    const some = ix => Ok(ix)
    const setA = a => put("a", a)
    const setB = b => put("b", b)
    const exec = update("value", (_, ix) => get(ix, "a", 0) + get(ix, "b", 0))

    it("golden path", async () => {
      const result = await pipe(interaction(), [setA(1), setB(2), exec])
      expect(result.assigns.value).toBe(3)
      expect(isOk(result)).toBe(true)
    })

    it("golden path -- bad", async () => {
      expect((async function() {
        const result = await pipe(interaction(), [
          setA(1),
          none("sad"),
          setB(2),
          exec,
        ])
      })()).rejects.toThrow("Interaction Error: sad")
    })

    it("golden path -- really bad", async () => {
      try {
        const result = await pipe(interaction(), [
          setA(1),
          explode,
          setB(2),
          exec,
        ])
        expect("I should never even run").toBe(
          "pipe isnt dealing with errors properly"
        )
      } catch (error) {
        expect(error.message).toBe("BOOM!")
      }
    })

    it("golden path -- curried", async () => {
      const result = await pipe([setA(2), setB(3), exec])(interaction())
      expect(result.assigns.value).toBe(5)
      expect(isOk(result)).toBe(true)
    })

    it("nested pipes", async () => {
      const inc = update("count", count => count + 1)
      const p1 = pipe([inc, inc, inc])
      const p2 = pipe([inc, inc, inc, inc])
      const p3 = pipe([inc, inc])
      const p4 = pipe([p1, p2, p3])
      const ix = await pipe(interaction(), [put("count", 5), p4])
      expect(get(ix, "count")).toBe(14)
    })
  })
})

describe("ix shape", () => {
  it("matches snapshot", () => {
    const ix = interaction()
    expect(ix).toMatchSnapshot()
  })
})
