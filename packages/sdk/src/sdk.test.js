import assert from "assert"
import fs from "fs"
import path from "path"
import {
  build,
  resolve,
  ref,
  transaction,
  limit,
  proposer,
  authorizations,
  payer,
  authorization,
  params,
  param,
  VERSION,
} from "./sdk.js"

test("fcl.VERSION needs to match version in package.json", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8")
  )
  expect(pkg.version).toBe(VERSION)
})

describe("build", () => {
  it("returns the correct limit when building a transaction", async () => {
    const one = await resolve(
      await build([
        transaction``,
        limit(156),
        proposer(authorization("01", () => ({signature: "123"}), 1, 123)),
        authorizations([
          authorization("01", () => ({signature: "123"}), 1, 123),
        ]),
        payer(authorization("01", () => ({signature: "123"}), 1, 123)),
        ref("123"),
      ])
    )

    const two = await resolve(
      await build([
        limit(156),
        transaction``,
        proposer(authorization("01", () => ({signature: "123"}), 1, 123)),
        authorizations([
          authorization("01", () => ({signature: "123"}), 1, 123),
        ]),
        payer(authorization("01", () => ({signature: "123"}), 1, 123)),
        ref("123"),
      ])
    )

    // console.log("one", one)
    // console.log("two", two)

    assert.equal(one.message.computeLimit, 156)
    assert.equal(two.message.computeLimit, 156)
    assert.deepEqual(one.message.limit, two.message.limit)
  })

  it("returns the correct proposer when building a transaction with a known proposer", async () => {
    const ix = await resolve(
      await build([
        transaction``,
        proposer(authorization("01", () => ({signature: "123"}), 1, 123)),
        authorizations([
          authorization("01", () => ({signature: "123"}), 1, 123),
        ]),
        payer(authorization("01", () => ({signature: "123"}), 1, 123)),
        ref("123"),
      ])
    )

    const txProposer = ix.accounts[ix.proposer]

    assert.deepEqual(txProposer.addr, "01")
    assert.deepEqual(txProposer.keyId, 1)
    assert.deepEqual(txProposer.sequenceNum, 123)
  })
})
