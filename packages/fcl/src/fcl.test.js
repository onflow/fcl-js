import * as fcl from "./fcl"

test("config", async () => {
  const $ = fcl.config()
  expect(await $.get("accessNode.api")).toBe("http://localhost:8080")
})
