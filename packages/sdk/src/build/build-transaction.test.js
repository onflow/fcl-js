import {interaction, isTransaction} from "../interaction/interaction.js"
import {transaction} from "./build-transaction.js"

describe("Build Transaction", () => {
  test("Build Transaction", async () => {
    const cadence = "transaction { increaseMyBallerStatus() }"

    let ix = await transaction(cadence)(interaction())

    expect(isTransaction(ix)).toBe(true)
    expect(ix.assigns["ix.cadence"]).not.toBeUndefined()
  })
})
