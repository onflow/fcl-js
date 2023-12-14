import {
  initInteraction,
  isGetTransactionStatus,
} from "../interaction/interaction"
import {getTransactionStatus} from "./build-get-transaction-status.js"

describe("Build Get Transaction Status", () => {
  test("Get Transaction Status", async () => {
    const transactionId = "abc123"

    let ix = await getTransactionStatus(transactionId)(initInteraction())

    expect(isGetTransactionStatus(ix)).toBe(true)
    expect(ix.transaction.id).toBe(transactionId)
  })
})
