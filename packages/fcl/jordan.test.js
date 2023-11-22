// TODO: REMOVE ME

import * as fcl from "./src/fcl"

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
})

fcl.events().subscribe(e => console.log(e))

jest.setTimeout(100000)

describe("fcl", () => {
  test("dummy delay", async () => {
    await new Promise(resolve => setTimeout(resolve, 90000))
    expect(false).toBe(true)
  })
})
