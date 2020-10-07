import * as fcl from "./fcl"
import fs from "fs"
import path from "path"

test("config", async () => {
  const $ = fcl.config()
  expect(await $.get("accessNode.api")).toBe("http://localhost:8080")
})

test("fcl.VERSION needs to match version in package.json", () => {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"))
  expect(pkg.version).toBe(fcl.VERSION)
})
