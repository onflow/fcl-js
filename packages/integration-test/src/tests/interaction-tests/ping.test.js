import * as fcl from "@onflow/fcl"

describe("ping test", () => {
  test("ping test", async () => {
    const testFn = async () => await fcl.send([fcl.ping()]).then(fcl.decode)
    await expect(testFn()).resolves.toBeNull()
  })
})
