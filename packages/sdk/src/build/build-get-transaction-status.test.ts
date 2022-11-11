import {interaction, isGetTransactionStatus} from "../interaction/interaction"
import {getTransactionStatus} from "./build-get-transaction-status"

describe("Build Get Transaction Status", () => {
  test("Get Transaction Status", async () => {
    const transactionId = "abc123"

    let ix = await getTransactionStatus(transactionId)(interaction())

    expect(isGetTransactionStatus(ix)).toBe(true)
    expect(ix.transaction.id).toBe(transactionId)
  })
})
