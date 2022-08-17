import * as fclWC from "./fcl-wc"

describe("Init Client", () => {
  it("should throw without projectId", async () => {
    expect.assertions(1)
    await expect(fclWC.initFclConnect()).rejects.toThrow(Error)
  })
})
