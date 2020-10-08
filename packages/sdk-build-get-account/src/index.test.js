import {interaction} from "@onflow/interaction"
import {sansPrefix, withPrefix} from "@onflow/util-address"
import {getAccount} from "./index.js"

const ADDRESS = "0xf117a8efa34ffd58"

describe("address as input", () => {
  test("sansPrefix", async () => {
    const addr = sansPrefix(ADDRESS)
    const result = await getAccount(addr)(interaction())

    expect(result.accountAddr).toBe(sansPrefix(ADDRESS))
  })

  test("withPrefix", async () => {
    const addr = withPrefix(ADDRESS)
    const result = await getAccount(addr)(interaction())

    expect(result.accountAddr).toBe(sansPrefix(ADDRESS))
  })
})
