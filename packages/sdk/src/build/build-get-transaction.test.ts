import {interaction, isGetTransaction} from "../interaction/interaction"
import {getTransaction} from "./build-get-transaction"

describe("Build Get Transaction", () => {
  test("Get Transaction", async () => {
    const transactionId = "abc123"

    let ix = await getTransaction(transactionId)(interaction())

    expect(isGetTransaction(ix)).toBe(true)
    expect(ix.transaction.id).toBe(transactionId)
  })
})
