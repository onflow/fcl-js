import {initInteraction, isGetTransaction} from "../interaction/interaction"
import {getTransaction} from "./build-get-transaction.js"

describe("Build Get Transaction", () => {
  test("Get Transaction", async () => {
    const transactionId = "abc123"

    let ix = await getTransaction(transactionId)(initInteraction())

    expect(isGetTransaction(ix)).toBe(true)
    expect(ix.transaction.id).toBe(transactionId)
  })
})
