import {initInteraction} from "../interaction/interaction"
import {sansPrefix, withPrefix} from "@onflow/util-address"
import {getAccount} from "./build-get-account"

const ADDRESS = "0xf117a8efa34ffd58"

describe("address as input", () => {
  test("sansPrefix", async () => {
    const addr = sansPrefix(ADDRESS)
    const result = await getAccount(addr)(initInteraction())

    expect(result.account.addr).toBe(sansPrefix(ADDRESS))
  })

  test("withPrefix", async () => {
    const addr = withPrefix(ADDRESS)
    const result = await getAccount(addr)(initInteraction())

    expect(result.account.addr).toBe(sansPrefix(ADDRESS))
  })
})
